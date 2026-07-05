// script.js
// This file turns the Sugar Shack story data into a playable browser game.
// The wrapper keeps these variables from colliding with gameData.js in browsers.
(() => {
  const gameContent = window.gameContent;
  const initialState = gameContent.initialState;
  const scenes = gameContent.scenes;
  const codenameText = gameContent.codenameText;
  const branchLabels = gameContent.branchLabels;

  const app = document.querySelector("#app");
  const statOrder = ["mercy", "risk", "logic", "trust", "social_read", "independence"];
  const introStorageKey = "sugarShack.hasCompletedIntro";
  const runStorageKey = "sugarShack.activeRun";
  const settingsStorageKey = "sugarShack.settings";
  const shiftInfo = {
    1: { title: "Whiskey Ramen", clockScene: "shift_clocked" },
    2: { title: "The Glass Orchid", clockScene: "shift2_clocked" },
    3: { title: "The Memory Tab", clockScene: "shift3_clocked" },
    4: { title: "Two Birthdays", clockScene: "shift4_clocked" },
    5: { title: "The Kindness Audit", clockScene: "shift5_clocked" },
    6: { title: "The House Leak", clockScene: "shift6_clocked" },
    7: { title: "Last Call for Privacy", clockScene: "shift7_clocked" },
  };
  const defaultSettings = {
    textSize: "standard",
    reduceMotion: false,
    highContrast: false,
  };

  let state = createFreshState();
  let currentSceneId = "studio_intro";
  let lastResponse = "";
  let clueLog = [];
  let runLog = [];
  let studioTimer = null;
  let activePanel = "brief";
  let isCaseDrawerOpen = false;
  let isSettingsDrawerOpen = false;
  let saveStatus = "Ready";
  let appSettings = loadSettings();

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createFreshState() {
    const fresh = clone(initialState);
    fresh.hasCompletedIntro = loadIntroFlag();
    return fresh;
  }

  function loadIntroFlag() {
    try {
      return localStorage.getItem(introStorageKey) === "true";
    } catch (error) {
      return false;
    }
  }

  function saveIntroFlag(value) {
    try {
      localStorage.setItem(introStorageKey, value ? "true" : "false");
    } catch (error) {
      // If storage is unavailable, the run still works for this session.
    }
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(settingsStorageKey);
      if (!raw) return clone(defaultSettings);
      return Object.assign(clone(defaultSettings), JSON.parse(raw));
    } catch (error) {
      return clone(defaultSettings);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(settingsStorageKey, JSON.stringify(appSettings));
    } catch (error) {
      // Settings are a comfort layer. The game still plays if storage is blocked.
    }
  }

  function applyAppSettings() {
    document.body.classList.toggle("text-compact", appSettings.textSize === "compact");
    document.body.classList.toggle("text-large", appSettings.textSize === "large");
    document.body.classList.toggle("reduce-motion", Boolean(appSettings.reduceMotion));
    document.body.classList.toggle("high-contrast", Boolean(appSettings.highContrast));
  }

  function updateSetting(key, value) {
    appSettings[key] = value;
    saveSettings();
    applyAppSettings();
    renderAppChrome();
  }

  function resetGame() {
    state = createFreshState();
    currentSceneId = "studio_intro";
    lastResponse = "";
    clueLog = [];
    runLog = [];
    render();
  }

  function resetIntroSave() {
    clearSavedRun();
    saveIntroFlag(false);
    state = createFreshState();
    currentSceneId = "title";
    lastResponse = "The punchcard slot forgets you. Upstairs, the job listing waits like fresh ink.";
    clueLog = [];
    runLog = [];
    render();
  }

  function resetAllProgress() {
    clearSavedRun();
    saveIntroFlag(false);
    state = createFreshState();
    currentSceneId = "studio_intro";
    lastResponse = "";
    clueLog = [];
    runLog = [];
    isCaseDrawerOpen = false;
    isSettingsDrawerOpen = false;
    saveStatus = "Progress cleared";
    render();
  }

  function getShiftInfo(number) {
    return shiftInfo[number] || shiftInfo[1];
  }

  function beginCurrentShift() {
    clearSavedRun();
    state.snoopActionsRemaining = 2;
    state.snoopActionsUsed = [];
    state.endingLabel = "";
    state.resultText = "";
    state.flags.received_punchcard = true;
    lastResponse = "";
    clueLog = [];
    currentSceneId = getShiftInfo(state.currentShift).clockScene;
    render();
  }

  function continueToNextShift() {
    if (state.currentShift >= 7) {
      currentSceneId = "title";
      lastResponse = "The week is printed. Sugar Shack waits for a new run and a different kind of mercy.";
      render();
      return;
    }

    state.currentShift += 1;
    state.snoopActionsRemaining = 2;
    state.snoopActionsUsed = [];
    state.endingLabel = "";
    state.resultText = "";
    clueLog = [];
    if (state.currentShift === 2) {
      lastResponse = "Mara keeps your tab open. The second shift waits under fresh ice.";
    } else if (state.currentShift === 3) {
      lastResponse = "The receipt printer remembers your hands. The third shift waits in warm ink.";
    } else if (state.currentShift === 4) {
      lastResponse = "The paper moons are already hanging. The fourth shift waits for someone to sing too loudly.";
    } else if (state.currentShift === 5) {
      lastResponse = "The silver kindness cards are already on the tables. The fifth shift waits with a polite smile.";
    } else if (state.currentShift === 6) {
      lastResponse = "The router lights are breathing wrong. The sixth shift waits inside the walls.";
    } else {
      lastResponse = "The house is full before last call. The final shift waits for the room to answer.";
    }
    currentSceneId = getShiftInfo(state.currentShift).clockScene;
    render();
  }

  function labelFromKey(key) {
    return key
      .split("_")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  function branchName(key) {
    return branchLabels[key] || labelFromKey(key);
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }



  function setupAppShell() {
    const shell = document.querySelector(".game-shell");
    if (!shell || document.querySelector("#appTopbar")) return;

    const topbar = makeElement("header", "app-topbar");
    topbar.id = "appTopbar";

    const brand = makeElement("div", "app-brand");
    brand.appendChild(makeElement("span", "app-mark", "SS"));
    const brandText = makeElement("div", "app-brand-text");
    brandText.appendChild(makeElement("strong", "", "Sugar Shack"));
    brandText.appendChild(makeElement("span", "", "Shift console"));
    brand.appendChild(brandText);

    const statusBar = makeElement("div", "app-status-bar");
    statusBar.id = "appStatus";

    const actions = makeElement("div", "app-actions");
    actions.appendChild(makeAppButton("caseFileButton", "Case File", function () {
      isCaseDrawerOpen = !isCaseDrawerOpen;
      isSettingsDrawerOpen = false;
      renderAppChrome();
    }));
    actions.appendChild(makeAppButton("settingsButton", "Settings", function () {
      isSettingsDrawerOpen = !isSettingsDrawerOpen;
      isCaseDrawerOpen = false;
      renderAppChrome();
    }));
    actions.appendChild(makeAppButton("resumeShiftButton", "Resume", resumeSavedRun));
    actions.appendChild(makeAppButton("newShiftButton", "New Shift", startNewShift));

    topbar.appendChild(brand);
    topbar.appendChild(statusBar);
    topbar.appendChild(actions);
    shell.insertBefore(topbar, shell.firstChild);

    const scrim = makeElement("button", "case-scrim");
    scrim.id = "caseScrim";
    scrim.type = "button";
    scrim.setAttribute("aria-label", "Close case file");
    scrim.addEventListener("click", function () {
      isCaseDrawerOpen = false;
      renderAppChrome();
    });
    document.body.appendChild(scrim);

    const drawer = makeElement("aside", "case-drawer");
    drawer.id = "caseDrawer";
    drawer.setAttribute("aria-label", "Case file");
    document.body.appendChild(drawer);

    const settingsScrim = makeElement("button", "case-scrim settings-scrim");
    settingsScrim.id = "settingsScrim";
    settingsScrim.type = "button";
    settingsScrim.setAttribute("aria-label", "Close settings");
    settingsScrim.addEventListener("click", function () {
      isSettingsDrawerOpen = false;
      renderAppChrome();
    });
    document.body.appendChild(settingsScrim);

    const settingsDrawer = makeElement("aside", "case-drawer settings-drawer");
    settingsDrawer.id = "settingsDrawer";
    settingsDrawer.setAttribute("aria-label", "Settings");
    document.body.appendChild(settingsDrawer);
  }

  function makeAppButton(id, text, action) {
    const button = makeElement("button", "app-icon-button", text);
    button.id = id;
    button.type = "button";
    button.addEventListener("click", action);
    return button;
  }

  function finishRender(options) {
    const settings = options || {};
    if (!settings.skipSave) {
      saveRun();
    }
    renderAppChrome();
  }

  function renderAppChrome() {
    const statusBar = document.querySelector("#appStatus");
    if (!statusBar) return;

    const overlayOpen = isCaseDrawerOpen || isSettingsDrawerOpen;
    const shell = document.querySelector(".game-shell");
    if (shell) {
      shell.setAttribute("aria-hidden", String(overlayOpen));
      if ("inert" in shell) {
        shell.inert = overlayOpen;
      }
    }

    statusBar.innerHTML = "";
    [
      ["Zone", getSceneLabel()],
      ["Access", state.hasCompletedIntro ? "Employee" : "Applicant"],
      ["Case", getCaseSignal()],
      ["Save", saveStatus],
    ].forEach(function (item) {
      statusBar.appendChild(renderStatusChip(item[0], item[1]));
    });

    const resumeButton = document.querySelector("#resumeShiftButton");
    if (resumeButton) {
      resumeButton.disabled = !hasSavedRun();
    }

    const caseButton = document.querySelector("#caseFileButton");
    if (caseButton) {
      caseButton.setAttribute("aria-expanded", String(isCaseDrawerOpen));
      caseButton.classList.toggle("is-active", isCaseDrawerOpen);
    }

    const settingsButton = document.querySelector("#settingsButton");
    if (settingsButton) {
      settingsButton.setAttribute("aria-expanded", String(isSettingsDrawerOpen));
      settingsButton.classList.toggle("is-active", isSettingsDrawerOpen);
    }

    renderCaseDrawer();
    renderSettingsDrawer();
  }

  function renderStatusChip(label, value) {
    const chip = makeElement("span", "app-chip");
    chip.appendChild(makeElement("strong", "", label));
    chip.appendChild(makeElement("span", "", value));
    return chip;
  }

  function renderCaseDrawer() {
    const drawer = document.querySelector("#caseDrawer");
    const scrim = document.querySelector("#caseScrim");
    if (!drawer || !scrim) return;

    drawer.classList.toggle("is-open", isCaseDrawerOpen);
    scrim.classList.toggle("is-open", isCaseDrawerOpen);
    drawer.setAttribute("aria-hidden", String(!isCaseDrawerOpen));
    scrim.setAttribute("aria-hidden", String(!isCaseDrawerOpen));
    scrim.disabled = !isCaseDrawerOpen;
    scrim.tabIndex = isCaseDrawerOpen ? 0 : -1;
    if ("inert" in drawer) {
      drawer.inert = !isCaseDrawerOpen;
    }

    drawer.innerHTML = "";

    const header = makeElement("div", "case-drawer-header");
    const title = makeElement("div", "case-title-block");
    title.appendChild(makeElement("p", "panel-label", "Case File"));
    title.appendChild(makeElement("h2", "", "Shift Console"));
    header.appendChild(title);

    const close = makeElement("button", "app-icon-button", "Close");
    close.type = "button";
    close.addEventListener("click", function () {
      isCaseDrawerOpen = false;
      renderAppChrome();
    });
    header.appendChild(close);
    drawer.appendChild(header);

    const tabs = makeElement("div", "case-tabs");
    [
      ["brief", "Brief"],
      ["log", "Log"],
      ["clues", "Clues"],
    ].forEach(function (tab) {
      const button = makeElement("button", "case-tab", tab[1]);
      button.type = "button";
      button.classList.toggle("is-active", activePanel === tab[0]);
      button.addEventListener("click", function () {
        activePanel = tab[0];
        renderAppChrome();
      });
      tabs.appendChild(button);
    });
    drawer.appendChild(tabs);

    if (activePanel === "log") {
      drawer.appendChild(renderCaseLog());
    } else if (activePanel === "clues") {
      drawer.appendChild(renderCaseClues());
    } else {
      drawer.appendChild(renderCaseBrief());
    }

    if (!isCaseDrawerOpen) {
      drawer.querySelectorAll("button").forEach(function (button) {
        button.disabled = true;
        button.tabIndex = -1;
      });
    }
  }

  function renderSettingsDrawer() {
    const drawer = document.querySelector("#settingsDrawer");
    const scrim = document.querySelector("#settingsScrim");
    if (!drawer || !scrim) return;

    drawer.classList.toggle("is-open", isSettingsDrawerOpen);
    scrim.classList.toggle("is-open", isSettingsDrawerOpen);
    drawer.setAttribute("aria-hidden", String(!isSettingsDrawerOpen));
    scrim.setAttribute("aria-hidden", String(!isSettingsDrawerOpen));
    scrim.disabled = !isSettingsDrawerOpen;
    scrim.tabIndex = isSettingsDrawerOpen ? 0 : -1;
    if ("inert" in drawer) {
      drawer.inert = !isSettingsDrawerOpen;
    }

    drawer.innerHTML = "";

    const header = makeElement("div", "case-drawer-header");
    const title = makeElement("div", "case-title-block");
    title.appendChild(makeElement("p", "panel-label", "App Settings"));
    title.appendChild(makeElement("h2", "", "Make It Yours"));
    header.appendChild(title);

    const close = makeElement("button", "app-icon-button", "Close");
    close.type = "button";
    close.addEventListener("click", function () {
      isSettingsDrawerOpen = false;
      renderAppChrome();
    });
    header.appendChild(close);
    drawer.appendChild(header);

    drawer.appendChild(renderSettingsSection());
    drawer.appendChild(renderStoreNotesSection());
    drawer.appendChild(renderSettingsActions());

    if (!isSettingsDrawerOpen) {
      drawer.querySelectorAll("button, a").forEach(function (control) {
        if (control.tagName === "BUTTON") control.disabled = true;
        control.tabIndex = -1;
      });
    }
  }

  function renderSettingsSection() {
    const section = makeElement("section", "case-section settings-section");
    section.appendChild(makeElement("p", "panel-label", "Comfort"));

    const textRow = makeElement("div", "setting-row");
    textRow.appendChild(renderSettingCopy("Text size", "Change story text without changing the room."));
    const textOptions = makeElement("div", "setting-options");
    [
      ["compact", "Compact"],
      ["standard", "Standard"],
      ["large", "Large"],
    ].forEach(function (option) {
      textOptions.appendChild(makeSettingButton(option[1], appSettings.textSize === option[0], function () {
        updateSetting("textSize", option[0]);
      }));
    });
    textRow.appendChild(textOptions);
    section.appendChild(textRow);

    section.appendChild(
      renderToggleRow("Reduce motion", "Quiet the flicker, stamp, and receipt animations.", appSettings.reduceMotion, function () {
        updateSetting("reduceMotion", !appSettings.reduceMotion);
      })
    );

    section.appendChild(
      renderToggleRow("High contrast", "Sharpen borders and text for darker screens.", appSettings.highContrast, function () {
        updateSetting("highContrast", !appSettings.highContrast);
      })
    );

    return section;
  }

  function renderStoreNotesSection() {
    const section = makeElement("section", "case-section settings-section");
    section.appendChild(makeElement("p", "panel-label", "Release Notes"));
    section.appendChild(
      renderInfoCard(
        "Privacy",
        "Progress is saved on this device. This prototype does not use accounts, ads, analytics, location, camera, microphone, contacts, or tracking."
      )
    );
    section.appendChild(
      renderInfoCard(
        "Support",
        "The store build needs a live support URL and contact email. Until then, tester notes belong in the project README."
      )
    );
    section.appendChild(renderInfoCard("Credits", "Sugar Shack is a 99-cent Studios game about coded drinks, pressure, and the cost of a clean pour."));

    const links = makeElement("div", "settings-links");
    links.appendChild(makeInfoLink("Privacy policy draft", "privacy.html"));
    links.appendChild(makeInfoLink("Support draft", "support.html"));
    section.appendChild(links);

    return section;
  }

  function renderSettingsActions() {
    const section = makeElement("section", "case-section settings-section");
    section.appendChild(makeElement("p", "panel-label", "Save"));

    const replay = makeElement("button", "app-icon-button settings-action", "Replay hiring intro");
    replay.type = "button";
    replay.addEventListener("click", function () {
      isSettingsDrawerOpen = false;
      resetIntroSave();
    });
    section.appendChild(replay);

    const reset = makeElement("button", "app-icon-button settings-action danger-action", "Clear all progress");
    reset.type = "button";
    reset.addEventListener("click", resetAllProgress);
    section.appendChild(reset);

    return section;
  }

  function renderSettingCopy(title, text) {
    const copy = makeElement("div", "setting-copy");
    copy.appendChild(makeElement("strong", "", title));
    copy.appendChild(makeElement("span", "", text));
    return copy;
  }

  function renderToggleRow(title, text, isOn, action) {
    const row = makeElement("div", "setting-row");
    row.appendChild(renderSettingCopy(title, text));
    row.appendChild(makeSettingButton(isOn ? "On" : "Off", isOn, action));
    return row;
  }

  function makeSettingButton(text, isActive, action) {
    const button = makeElement("button", "setting-option", text);
    button.type = "button";
    button.setAttribute("aria-pressed", String(isActive));
    button.classList.toggle("is-active", isActive);
    button.addEventListener("click", action);
    return button;
  }

  function renderInfoCard(title, text) {
    const card = makeElement("article", "info-card");
    card.appendChild(makeElement("strong", "", title));
    card.appendChild(makeElement("p", "", text));
    return card;
  }

  function makeInfoLink(text, href) {
    const link = document.createElement("a");
    link.className = "app-link";
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = text;
    return link;
  }

  function renderCaseBrief() {
    const section = makeElement("section", "case-section");
    const metrics = makeElement("div", "case-metric-grid");
    [
      ["Current Zone", getSceneLabel()],
      ["Signal", getCaseSignal()],
      ["Shift", String(state.currentShift).padStart(2, "0")],
      ["Clues", String(getEvidenceItems().length)],
    ].forEach(function (metric) {
      const item = makeElement("article", "case-metric");
      item.appendChild(makeElement("span", "", metric[0]));
      item.appendChild(makeElement("strong", "", metric[1]));
      metrics.appendChild(item);
    });
    section.appendChild(metrics);
    section.appendChild(renderProgressRail());

    const evidence = getEvidenceItems().slice(0, 3);
    section.appendChild(makeElement("p", "panel-label", "Latest Evidence"));
    if (evidence.length === 0) {
      section.appendChild(makeElement("p", "empty-state", "No evidence logged yet."));
    } else {
      const list = makeElement("div", "evidence-list");
      evidence.forEach(function (entry) {
        list.appendChild(renderEvidenceItem(entry));
      });
      section.appendChild(list);
    }

    return section;
  }

  function renderCaseLog() {
    const section = makeElement("section", "case-section");
    section.appendChild(makeElement("p", "panel-label", "Run Log"));

    if (runLog.length === 0) {
      section.appendChild(makeElement("p", "empty-state", "No shift activity logged yet."));
      return section;
    }

    const list = makeElement("ol", "log-list");
    runLog.slice(-12).forEach(function (entry) {
      const item = makeElement("li", "log-entry");
      const top = makeElement("div", "log-entry-top");
      top.appendChild(makeElement("strong", "", entry.sceneTitle));
      top.appendChild(makeElement("span", "", entry.time));
      item.appendChild(top);
      item.appendChild(makeElement("p", "", entry.choice));
      if (entry.response) {
        item.appendChild(makeElement("small", "", entry.response));
      }
      list.appendChild(item);
    });
    section.appendChild(list);
    return section;
  }

  function renderCaseClues() {
    const section = makeElement("section", "case-section");
    section.appendChild(makeElement("p", "panel-label", "Clues"));

    const evidence = getEvidenceItems();
    if (evidence.length === 0) {
      section.appendChild(makeElement("p", "empty-state", "The file is waiting for its first real mark."));
      return section;
    }

    const list = makeElement("div", "evidence-list");
    evidence.forEach(function (entry) {
      list.appendChild(renderEvidenceItem(entry));
    });
    section.appendChild(list);
    return section;
  }

  function renderEvidenceItem(entry) {
    const item = makeElement("article", "evidence-item");
    item.appendChild(makeElement("strong", "", entry.title));
    item.appendChild(makeElement("p", "", entry.text));
    return item;
  }

  function renderProgressRail() {
    const wrapper = makeElement("section", "progress-panel");
    wrapper.appendChild(makeElement("p", "panel-label", "Shift Progress"));
    const rail = makeElement("div", "progress-rail");
    const current = getStageIndex();

    getProgressStages().forEach(function (stage, index) {
      const step = makeElement("div", "progress-step");
      if (index < current) step.classList.add("is-complete");
      if (index === current) step.classList.add("is-active");
      step.appendChild(makeElement("span", "", String(index + 1).padStart(2, "0")));
      step.appendChild(makeElement("strong", "", stage.label));
      rail.appendChild(step);
    });

    wrapper.appendChild(rail);
    return wrapper;
  }

  function getProgressStages() {
    return [
      { key: "cover", label: "Cover" },
      { key: "hiring", label: "Hiring" },
      { key: "floor", label: "Floor" },
      { key: "booth", label: "Booth 3" },
      { key: "tab", label: "Tab" },
    ];
  }

  function getStageIndex() {
    if (["studio_intro", "title", "job_listing", "donut_shop", "elevator_receipt", "elevator_down"].includes(currentSceneId)) return 0;
    if (currentSceneId.indexOf("interview_") === 0 || ["lounge_arrival", "punchcard"].includes(currentSceneId) || currentSceneId.endsWith("_clocked")) return 1;
    if (["shift_opening", "patron_intro", "coded_order", "chrome_reacts"].includes(currentSceneId) || /^shift\d+_(opening|patron_intro|coded_order|civilians_enter)$/.test(currentSceneId)) return 2;
    if (["veil_break", "snoop_menu", "veil_returns", "host_signal", "final_decision"].includes(currentSceneId) || /^shift\d+_(confusion|snoop_menu|convergence|host_signal|final_decision)$/.test(currentSceneId)) return 3;
    return 4;
  }

  function getSceneLabel() {
    if (currentSceneId === "receipt_debrief") return "End Tab";
    if (currentSceneId === "psychology_debrief") return "Reflection";
    if (currentSceneId === "final_story_debrief") return "Final Debrief";
    if (currentSceneId === "studio_intro") return "Studio";
    const scene = scenes[currentSceneId];
    if (scene && scene.endingLabel) return scene.endingLabel;
    if (scene && scene.title) return scene.title;
    return "Unknown";
  }

  function getCaseSignal() {
    if (currentSceneId === "receipt_debrief" || currentSceneId === "psychology_debrief" || currentSceneId === "final_story_debrief" || currentSceneId.indexOf("result_") === 0) {
      return getEarlyCodename();
    }

    if (state.flags.received_punchcard || getStageIndex() >= 2) return "Active";
    if (state.hasCompletedIntro) return "On File";
    return "Pending";
  }

  function getEvidenceItems() {
    const items = [];

    if (state.flags.asked_day_old_dozen) items.push({ title: "Day-Old Dozen", text: "The cover phrase opened more than the counter." });
    if (state.flags.checked_receipt_printer) items.push({ title: "Warm Printer", text: "The receipt machine reacted before the room admitted why." });
    if (state.flags.found_elevator_hint) items.push({ title: "Fryer Button", text: "The elevator was hiding under the public routine." });
    if (state.flags.found_glass_residue) items.push({ title: "Static Coupe", text: "Silver Veil's drink carried the compromised signal in the side glass." });
    if (state.flags.found_privacy_chip) items.push({ title: "Pink Dots", text: "The napkin carried the quiet burn of privacy tech." });
    if (state.flags.found_receipt_404) items.push({ title: "Receipt 404", text: "A timestamp arrived before the moment that printed it." });
    if (state.flags.snooped_sleeve) items.push({ title: "Sleeve Pocket", text: "Crossing the line revealed a route somebody wanted hidden." });
    if (state.flags.asked_host_about_veil) items.push({ title: "Mara's Tap", text: "Mara translated the problem without saying it out loud." });
    if (state.flags.wrong_glass_corrected) items.push({ title: "Wrong Glass Corrected", text: "Nia's copy was marked as harmless before it could become the signal." });
    if (state.flags.jules_warned) items.push({ title: "Jules Noticed", text: "The civilian who wanted to leave read the room faster than the one who wanted the dare." });
    if (state.flags.noticed_chrome_reaction) items.push({ title: "Elevator Reflection", text: "Silver Veil kept watching the exit instead of the drink." });
    if (state.flags.harmony_slogan_seen) items.push({ title: "Harmony Slogan", text: "Safety language appeared in the elevator reflection before anyone said Director Vale's name." });
    if (state.flags.found_orchid_frost) items.push({ title: "Frosted Stem", text: "The real Glass Orchid carried a white thread of data inside the cold garnish." });
    if (state.flags.anika_recording_seen) items.push({ title: "Camera Frame", text: "Anika's clip caught too many truths in one pretty reflection." });
    if (state.flags.dom_is_civilian) items.push({ title: "Dom's Delivery", text: "The cheap orchid was civilian noise, not a signal. That did not make it harmless." });
    if (state.flags.orchid_camera_blurred) items.push({ title: "Blurred Bloom", text: "The room gave the camera something beautiful and useless to remember." });
    if (state.flags.memory_audit_mentioned) items.push({ title: "Memory Audit", text: "Harmony's safety language started talking about records instead of cameras." });
    if (state.flags.found_double_timestamp) items.push({ title: "Double Timestamp", text: "Two tabs remembered 12:40 AM and disagreed about who paid." });
    if (state.flags.theo_receipt_seen) items.push({ title: "Theo's Receipt", text: "The old receipt remembered Theo more clearly than Theo remembered the room." });
    if (state.flags.elevator_audit_seen) items.push({ title: "Audit Ink", text: "Harmony's memory audit mark was still visible under the erased heat-print." });
    if (state.flags.memory_receipt_redacted) items.push({ title: "Redacted Name", text: "Theo's name left the receipt before the printer could make a cleaner copy." });
    if (state.flags.harmony_birthday_prompt_seen) items.push({ title: "Shared Celebration", text: "Harmony tried to make joy feel safer by making it public." });
    if (state.flags.found_wrong_name_cake) items.push({ title: "Wrong Cake", text: "MIKA was printed upstairs. NOON arrived warm from the room below." });
    if (state.flags.tally_post_seen) items.push({ title: "Phone Preview", text: "The caption guessed the code phrase before the room admitted it was a code." });
    if (state.flags.birthday_name_corrected) items.push({ title: "Name Card Swap", text: "The public cake kept the right name. The private signal kept none." });
    if (state.flags.birthday_song_stopped) items.push({ title: "Held Chorus", text: "The song stopped before a roomful of witnesses could turn care into proof." });
    if (state.flags.harmony_recording_seen) items.push({ title: "Vale Recording", text: "Director Vale made surveillance sound like community care before speaking live." });
    if (state.flags.found_kindness_score) items.push({ title: "Kindness Score", text: "The audit counted helper, helped, witness, and delay as if care were a ledger." });
    if (state.flags.found_tip_camera) items.push({ title: "Silver Card Lens", text: "The kindness card watched the person being helped more clearly than the person helping." });
    if (state.flags.kindness_receipt_redacted) items.push({ title: "Redacted Help", text: "The audit kept its shape after Pax's name left its teeth." });
    if (state.flags.vale_direct_signal) items.push({ title: "Vale Live", text: "Director Vale stopped being a recording and spoke through the house itself." });
    if (state.flags.found_router_heat) items.push({ title: "Hot Router", text: "The leak pulsed when Vale said safe, like the word was a command." });
    if (state.flags.found_backdoor_log) items.push({ title: "Backdoor Log", text: "The route used a real house code for a request the house never made." });
    if (state.flags.decoy_leak_sent) items.push({ title: "False Route", text: "The leak accepted a believable lie and carried it toward the wrong door." });
    if (state.flags.privacy_bargain_seen) items.push({ title: "Vale's Bargain", text: "Safety arrived as a roster, a promise, and a price." });
    if (state.flags.found_all_names_list) items.push({ title: "The Roster", text: "The final list held names, old names, blanks, and guesses labeled like care." });
    if (state.flags.final_consent_taken) items.push({ title: "Uneven Consent", text: "The room did not agree. That was the first honest answer." });
    if (state.flags.last_call_blackout) items.push({ title: "Breaker Option", text: "The final choice included darkness, not as an escape, but as refusal." });

    clueLog.slice(-5).forEach(function (clue, index) {
      items.push({ title: "Field Note " + String(index + 1).padStart(2, "0"), text: clue });
    });

    return items;
  }

  function recordRunEntry(choiceText, response) {
    if (!choiceText || currentSceneId === "studio_intro") return;
    const scene = scenes[currentSceneId];
    runLog.push({
      sceneId: currentSceneId,
      sceneTitle: scene ? scene.title : getSceneLabel(),
      choice: choiceText,
      response: response || "",
      time: formatTime(Date.now()),
    });

    if (runLog.length > 50) {
      runLog = runLog.slice(-50);
    }
  }

  function formatTime(value) {
    try {
      return new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } catch (error) {
      return "now";
    }
  }

  function readSavedRun() {
    try {
      const raw = localStorage.getItem(runStorageKey);
      if (!raw) return null;
      const snapshot = JSON.parse(raw);
      if (!snapshot || snapshot.version !== 2 || !snapshot.state || !snapshot.currentSceneId) return null;
      return snapshot;
    } catch (error) {
      return null;
    }
  }

  function hasSavedRun() {
    return Boolean(readSavedRun());
  }

  function saveRun() {
    if (currentSceneId === "studio_intro" || (currentSceneId === "title" && runLog.length === 0)) {
      saveStatus = hasSavedRun() ? "Resume ready" : "Ready";
      return;
    }

    try {
      localStorage.setItem(
        runStorageKey,
        JSON.stringify({
          version: 2,
          savedAt: Date.now(),
          currentSceneId: currentSceneId,
          state: clone(state),
          lastResponse: lastResponse,
          clueLog: clueLog.slice(-25),
          runLog: runLog.slice(-50),
        })
      );
      saveStatus = "Saved " + formatTime(Date.now());
    } catch (error) {
      saveStatus = "Save blocked";
    }
  }

  function clearSavedRun() {
    try {
      localStorage.removeItem(runStorageKey);
      saveStatus = "Cleared";
    } catch (error) {
      saveStatus = "Clear blocked";
    }
  }

  function resumeSavedRun() {
    const snapshot = readSavedRun();
    if (!snapshot) {
      saveStatus = "No save";
      renderAppChrome();
      return;
    }

    state = clone(snapshot.state);
    currentSceneId = snapshot.currentSceneId;
    lastResponse = snapshot.lastResponse || "";
    clueLog = Array.isArray(snapshot.clueLog) ? snapshot.clueLog.slice() : [];
    runLog = Array.isArray(snapshot.runLog) ? snapshot.runLog.slice() : [];

    if (Object.prototype.hasOwnProperty.call(state, "hasCompletedIntro")) {
      saveIntroFlag(state.hasCompletedIntro);
    }

    saveStatus = "Resumed";
    render();
  }

  function startNewShift() {
    clearSavedRun();
    resetGame();
  }


  function render() {
    if (studioTimer) {
      window.clearTimeout(studioTimer);
      studioTimer = null;
    }

    app.innerHTML = "";
    window.scrollTo(0, 0);

    if (currentSceneId === "receipt_debrief") {
      renderReceiptDebrief();
      finishRender();
      return;
    }

    if (currentSceneId === "psychology_debrief") {
      renderPsychologyDebrief();
      finishRender();
      return;
    }

    if (currentSceneId === "final_story_debrief") {
      renderFinalStoryDebrief();
      finishRender();
      return;
    }

    const scene = scenes[currentSceneId];

    if (scene.type === "studioIntro") {
      renderStudioIntro(scene);
      finishRender({ skipSave: true });
      return;
    }

    if (scene.type === "snoopMenu") {
      renderSnoopMenu(scene);
      finishRender();
      return;
    }

    if (scene.type === "result") {
      renderResult(scene);
      finishRender();
      return;
    }

    renderScene(scene);
    finishRender();
  }

  function renderStudioIntro(scene) {
    const wrapper = makeElement("section", "studio-intro");
    const stage = makeElement("div", "studio-stage");
    const stick = makeElement("div", "stick-figure");
    ["head", "body", "arm-a", "arm-b", "leg-a", "leg-b"].forEach(function (part) {
      stick.appendChild(makeElement("span", part));
    });

    stage.appendChild(stick);
    stage.appendChild(makeElement("div", "poster", "99¢"));
    stage.appendChild(makeElement("div", "studio-reveal", "99¢ STUDIOS"));
    wrapper.appendChild(stage);

    const choices = makeElement("div", "choices studio-skip");
    choices.appendChild(makeChoiceButton({ text: "Skip to title", next: scene.next }, 1));
    wrapper.appendChild(choices);
    app.appendChild(wrapper);

    studioTimer = window.setTimeout(function () {
      if (currentSceneId === "studio_intro") {
        currentSceneId = scene.next;
        render();
      }
    }, 5000);
  }

  function renderScene(scene) {
    const layout = makeElement("div", "layout " + getSceneClass());
    const scenePanel = makeElement("section", "scene-panel");

    scenePanel.appendChild(makeElement("p", "scene-kicker", getKicker(scene)));
    scenePanel.appendChild(makeElement("h2", "scene-title", scene.title));

    const visual = renderSceneVisual(scene);
    if (visual) {
      scenePanel.appendChild(visual);
    }

    if (scene.type === "punchcard") {
      scenePanel.appendChild(renderPunchcard(scene));
    } else {
      scenePanel.appendChild(renderText(getSceneText(scene)));
    }

    const dialogue = getSceneDialogue(scene);
    if (dialogue) {
      scenePanel.appendChild(renderDialogue(scene.speaker, dialogue));
    }

    const callback = getCallbackNote();
    if (callback) {
      scenePanel.appendChild(makeElement("div", "callback-note", callback));
    }

    if (lastResponse) {
      scenePanel.appendChild(makeElement("div", "response-note", lastResponse));
    }

    const choices = makeElement("div", "choices");
    getChoices(scene).forEach(function (choice, index) {
      choices.appendChild(makeChoiceButton(choice, index + 1));
    });

    scenePanel.appendChild(choices);
    layout.appendChild(scenePanel);
    layout.appendChild(renderSidePanel(scene));
    app.appendChild(layout);
  }

  function getSceneClass() {
    if (currentSceneId.indexOf("interview_") === 0) return "scene-interview";
    if (currentSceneId.indexOf("result_") === 0) return "scene-result";
    return "scene-" + currentSceneId.replace(/_/g, "-");
  }

  function getKicker(scene) {
    if (scene.type === "title") return "99¢ Studios Presents";
    if (scene.type === "punchcard") return "Punchcard";
    if (scene.type === "snoopStart") return "Twenty Seconds";
    if (currentSceneId.indexOf("interview_") === 0) return "Mini-Interview";
    return "Sugar Shack";
  }

  function getChoices(scene) {
    if (scene.type === "title") {
      const choices = [];
      const savedRun = readSavedRun();

      if (savedRun && savedRun.currentSceneId !== "title") {
        choices.push({ text: "Resume saved shift", action: resumeSavedRun });
      }

      if (state.hasCompletedIntro) {
        choices.push({ text: "Punch In", action: beginCurrentShift });
        choices.push({ text: "Replay hiring intro", next: "job_listing" });
        choices.push({ text: "Reset new-hire save", action: resetIntroSave });
        return choices;
      }

      choices.push({ text: "Read the job listing", next: "job_listing" });
      return choices;
    }

    if (scene.type === "snoopStart") {
      return [{ text: "Step back onto the floor.", next: scene.next }];
    }

    return scene.choices || [];
  }

  function makeArtFrame(kind, caption) {
    const frame = makeElement("div", "scene-visual art-frame art-" + kind);
    frame.appendChild(makeElement("div", "art-bg"));
    frame.appendChild(makeElement("div", "art-glow"));
    frame.appendChild(makeElement("div", "art-ground"));
    frame.appendChild(makeElement("div", "art-caption", caption));
    return frame;
  }

  function addArt(frame, className, text) {
    const item = makeElement("div", className, text || "");
    frame.appendChild(item);
    return item;
  }

  function numberedShift() {
    const match = currentSceneId.match(/^shift(\d+)_/);
    if (match) return Number(match[1]);
    if (currentSceneId.indexOf("shift_") === 0 || currentSceneId === "shift_clocked") return 1;
    return 0;
  }

  function shiftVisualLabel() {
    const number = numberedShift();
    if (number === 7) return "PRIVACY";
    if (number === 6) return "LEAK";
    if (number === 5) return "AUDIT";
    if (number === 4) return "CANDLE";
    if (number === 3) return "TAB";
    if (number === 2) return "ORCHID";
    return "NO EGG";
  }

  function shiftMenuLabel() {
    const number = numberedShift();
    if (number === 7) return "LAST CALL";
    if (number === 6) return "HOUSE LEAK";
    if (number === 5) return "KINDNESS AUDIT";
    if (number === 4) return "TWO BIRTHDAYS";
    if (number === 3) return "MEMORY TAB";
    if (number === 2) return "GLASS ORCHID";
    return "WHISKEY RAMEN";
  }

  function renderSceneVisual(scene) {
    if (currentSceneId === "title") {
      const frame = makeArtFrame("storefront", "Cute upstairs. Dangerous downstairs.");
      addArt(frame, "shop-awning");
      addArt(frame, "shop-window window-left");
      addArt(frame, "shop-window window-right");
      addArt(frame, "shop-door");
      addArt(frame, "shop-sign", "SUGAR SHACK");
      addArt(frame, "donut-box-stack");
      addArt(frame, "newspaper-peek", "HELP WANTED");
      addArt(frame, "basement-glow");
      addArt(frame, "basement-sign", "B2");
      addArt(frame, "tiny-elevator-line");
      return frame;
    }

    if (currentSceneId === "job_listing") {
      const frame = makeArtFrame("newspaper", "The listing is cute enough to be suspicious.");
      addArt(frame, "news-sheet");
      addArt(frame, "news-head", "HELP WANTED");
      addArt(frame, "news-title", "SUGAR SHACK");
      addArt(frame, "news-line line-a");
      addArt(frame, "news-line line-b");
      addArt(frame, "news-line line-c");
      addArt(frame, "news-stamp", "12:07 AM");
      addArt(frame, "coffee-ring");
      addArt(frame, "donut-crumb crumb-a");
      addArt(frame, "donut-crumb crumb-b");
      return frame;
    }

    if (currentSceneId === "donut_shop" || currentSceneId === "elevator_receipt") {
      const frame = makeArtFrame("counter", currentSceneId === "elevator_receipt" ? "The floor answers with blue light." : "The public counter is trying too hard.");
      addArt(frame, "counter-back-wall");
      addArt(frame, "counter-clock-art", "12:07");
      addArt(frame, "cashier-silhouette");
      addArt(frame, "cashier-visor");
      addArt(frame, "box-stack-art");
      addArt(frame, "receipt-machine");
      addArt(frame, "receipt-paper", state.flags.checked_receipt_printer ? "PRINTING" : "#404");
      addArt(frame, "fryer-shape");
      addArt(frame, state.flags.found_elevator_hint || currentSceneId === "elevator_receipt" ? "floor-seam open" : "floor-seam");
      addArt(frame, "floor-light");
      return frame;
    }

    if (currentSceneId === "elevator_down") {
      const frame = makeArtFrame("elevator", "The elevator descends longer than the building is tall.");
      addArt(frame, "shaft-lines");
      addArt(frame, "elevator-cab");
      addArt(frame, "elevator-door-art left");
      addArt(frame, "elevator-door-art right");
      addArt(frame, "floor-indicator", "B2  B3  B4  ?");
      addArt(frame, "descending-lights");
      addArt(frame, "cable-line");
      return frame;
    }

    if (currentSceneId === "punchcard" || currentSceneId.endsWith("_clocked")) {
      const isClocked = currentSceneId.endsWith("_clocked");
      const frame = makeArtFrame("punchclock", isClocked ? "A tiny verdict, printed in pink." : "Temporary access is still access.");
      addArt(frame, "timecard-stack");
      addArt(frame, "punchclock-body");
      addArt(frame, "punchclock-face", "12:07");
      addArt(frame, "punchclock-slot");
      addArt(frame, isClocked ? "timecard active" : "timecard", "SHIFT " + String(state.currentShift).padStart(2, "0"));
      addArt(frame, "timecard-rule rule-a");
      addArt(frame, "timecard-rule rule-b");
      addArt(frame, isClocked ? "clock-stamp punched" : "clock-stamp", isClocked ? "CLOCKED IN" : "TEMP ACCESS");
      addArt(frame, "host-shadow-small");
      addArt(frame, "approval-light");
      return frame;
    }

    if (currentSceneId === "lounge_arrival" || currentSceneId === "shift_opening" || /^shift\d+_opening$/.test(currentSceneId)) {
      const frame = makeArtFrame(
        "lounge",
        numberedShift() === 7
          ? "Every glass in the room remembers a choice."
          : numberedShift() === 6
            ? "The walls have started listening back."
            : numberedShift() === 5
              ? "Kindness cards make gratitude look expensive."
              : currentSceneId === "shift4_opening"
          ? "Paper moons make public joy look dangerous."
          : currentSceneId === "shift3_opening"
          ? "The receipt printer remembers too much."
          : currentSceneId === "shift2_opening"
            ? "Harmony smiles from the elevator glass."
            : "Chrome, velvet, shadow, and expensive secrets."
      );
      addArt(frame, "neon-arch");
      addArt(frame, "bar-top");
      addArt(frame, "bottle-row");
      addArt(frame, "bottle b1");
      addArt(frame, "bottle b2");
      addArt(frame, "bottle b3");
      addArt(frame, "booth-shape booth-a");
      addArt(frame, "booth-shape booth-b");
      addArt(frame, "privacy-glass");
      addArt(frame, "menu-scribble", shiftMenuLabel());
      return frame;
    }

    if (currentSceneId.indexOf("interview_") === 0) {
      const frame = makeArtFrame("interview", "The interview is mostly lighting and trapdoors.");
      addArt(frame, "interview-table");
      addArt(frame, "host-silhouette");
      addArt(frame, "host-visor-art");
      addArt(frame, "applicant-chair");
      addArt(frame, "hanging-light");
      addArt(frame, "intercom-panel-art", "VOICEPRINT OPTIONAL");
      addArt(frame, "waveform-bars");
      return frame;
    }

    if (["patron_intro", "coded_order", "chrome_reacts", "host_signal", "final_decision"].includes(currentSceneId) || /^shift\d+_(patron_intro|coded_order|civilians_enter|host_signal|final_decision)$/.test(currentSceneId)) {
      let caption = "Booth 3 pretends not to be a stage.";
      if (numberedShift() === 7) {
        caption = "Every protected person is visible enough to matter.";
      } else if (numberedShift() === 6) {
        caption = "The speaker makes the booth feel owned.";
      } else if (numberedShift() === 5) {
        caption = "The kindness card shines like a tiny camera.";
      } else if (currentSceneId === "shift4_host_signal") {
        caption = "One candle waits between celebration and evidence.";
      } else if (currentSceneId === "host_signal" || currentSceneId === "shift2_host_signal") {
        caption = "The final object arrives heavier than it looks.";
      } else if (currentSceneId === "shift3_host_signal") {
        caption = "The printer tray closes like a verdict.";
      } else if (currentSceneId.indexOf("shift4_") === 0) {
        caption = "The phone makes the birthday feel too bright.";
      } else if (currentSceneId.indexOf("shift3_") === 0) {
        caption = "The receipt remembers the room wrong.";
      } else if (currentSceneId.indexOf("shift2_") === 0) {
        caption = "The camera makes the booth feel smaller.";
      }

      const frame = makeArtFrame("patrons", caption);
      addArt(frame, "booth-backdrop");
      addArt(frame, "silver-veil-silhouette");
      addArt(frame, "veil-face");
      addArt(frame, "chrome-silhouette");
      addArt(frame, "chrome-jacket-shine");
      addArt(frame, "table-ellipse");
      addArt(frame, "ramen-glass", currentSceneId === "host_signal" ? "TWO GLASSES" : shiftVisualLabel());
      addArt(frame, "static-lines");
      addArt(frame, state.flags.noticed_chrome_reaction || state.flags.chrome_is_suspected ? "watch-line active" : "watch-line");
      return frame;
    }

    if (["veil_break", "snoop_menu", "veil_returns"].includes(currentSceneId) || /^shift\d+_(confusion|snoop_menu|convergence)$/.test(currentSceneId)) {
      const frame = makeArtFrame(
        "tabletop",
        numberedShift() === 7
          ? "One roster, too many lives."
          : numberedShift() === 6
            ? "One label, one router, one door that should not exist."
            : numberedShift() === 5
              ? "One good deed, now printed with teeth."
              : currentSceneId.indexOf("shift4_") === 0
          ? "Two cakes, one name too many."
          : currentSceneId.indexOf("shift3_") === 0
          ? "Two receipts, one missing night."
          : currentSceneId.indexOf("shift2_") === 0
            ? "Three flowers, one signal, one camera."
            : "Every object is either evidence or bait."
      );
      addArt(frame, "tabletop-surface");
      addArt(frame, "close-glass", numberedShift() === 7 ? "ROSTER" : numberedShift() === 6 ? "ROUTER" : numberedShift() === 5 ? "SCORE" : currentSceneId.indexOf("shift4_") === 0 ? "CAKE" : currentSceneId.indexOf("shift3_") === 0 ? "TAB" : currentSceneId.indexOf("shift2_") === 0 ? "REAL" : state.flags.found_glass_residue ? "TWO TRACES" : "EMPTY");
      addArt(frame, "close-napkin", numberedShift() === 7 ? "NAMES" : numberedShift() === 6 ? "LABEL" : numberedShift() === 5 ? "CARD" : currentSceneId.indexOf("shift4_") === 0 ? "PHONE" : currentSceneId.indexOf("shift3_") === 0 ? "AUDIT" : currentSceneId.indexOf("shift2_") === 0 ? "CAMERA" : state.flags.found_privacy_chip ? "PINK DOTS" : "SEALED");
      addArt(frame, "close-receipt", numberedShift() === 7 ? "OPT IN" : numberedShift() === 6 ? "BACK" : numberedShift() === 5 ? "HELP" : currentSceneId.indexOf("shift4_") === 0 ? "NOON" : currentSceneId.indexOf("shift3_") === 0 ? "12:40" : currentSceneId.indexOf("shift2_") === 0 ? "HARMONY" : state.flags.found_receipt_404 ? "12:40" : "#404");
      addArt(frame, "close-sleeve", numberedShift() === 7 ? "LAST" : numberedShift() === 6 ? "DOOR" : numberedShift() === 5 ? "LENS" : currentSceneId.indexOf("shift4_") === 0 ? "SONG" : currentSceneId.indexOf("shift3_") === 0 ? "ERASED" : currentSceneId.indexOf("shift2_") === 0 ? "DECOY" : state.flags.snooped_sleeve ? "DISTURBED" : "SLEEVE");
      addArt(frame, "close-chip");
      addArt(frame, "sugar-crystal");
      return frame;
    }

    if (currentSceneId.indexOf("result_") === 0) {
      const frame = makeArtFrame("result", scene.endingLabel || "End of shift");
      addArt(frame, "result-neon");
      addArt(frame, "result-door");
      addArt(frame, "result-capsule");
      addArt(frame, "result-receipt", "TAB PRINTING");
      addArt(frame, "result-shadow-a");
      addArt(frame, "result-shadow-b");
      return frame;
    }

    return null;
  }

  function getSceneText(scene) {
    let text = scene.text || "";

    if (currentSceneId === "elevator_receipt") {
      if (state.flags.checked_receipt_printer) {
        text += "\n\nThe printer seems pleased you noticed it first. Machines downstairs appreciate manners.";
      }
      if (state.flags.found_elevator_hint) {
        text += "\n\nThe fryer button warms under the counter, like it has been waiting to be useful.";
      }
      if (state.flags.showed_job_listing && !state.flags.asked_day_old_dozen) {
        text += "\n\nThe listing did most of the talking. The cashier looks disappointed but not surprised.";
      }
    }

    if (currentSceneId === "lounge_arrival" && state.flags.found_elevator_hint) {
      text += "\n\nThe host glances once at your shoes, then at your hands. You found the button before the room decided to show it to you.";
    }

    if (currentSceneId === "shift_opening" && state.hasCompletedIntro && !state.flags.received_punchcard) {
      text += "\n\nYour old punchcard crease still knows where to fold. The house remembers you, even when the shift starts clean.";
    }

    if (currentSceneId === "patron_intro" && state.flags.interview_watched_room) {
      text += "\n\nThe interview answer follows you onto the floor. Before anyone speaks, you find the watcher, then the watcher behind them.";
    }

    if (currentSceneId === "chrome_reacts" && state.flags.tested_drink_code) {
      text += "\n\nSilver Veil keeps watching you like you already touched a live wire and somehow did not flinch.";
    }

    if (currentSceneId === "host_signal" && state.flags.asked_host_about_veil) {
      text += "\n\nThe coaster warning was not free. Nothing from the host ever is.";
    }

    if (currentSceneId === "shift2_opening" && state.flags.nia_protected) {
      text += "\n\nSomewhere upstairs, Nia and Jules have probably turned last night into a story about weird drinks. The room lets you keep that mercy.";
    }

    if (currentSceneId === "shift2_civilians_enter" && state.flags.whiskey_signal_refused) {
      text += "\n\nAfter last shift, the sound of something fragile entering the room finds you before the object does.";
    }

    if (currentSceneId === "shift3_opening" && state.flags.orchid_camera_blurred) {
      text += "\n\nAfter the Glass Orchid, the room seems less worried about cameras and more worried about what a machine can remember after the camera is gone.";
    }

    if (currentSceneId === "shift3_civilians_enter" && state.flags.anika_recording_seen) {
      text += "\n\nAnika's clip from last shift left no useful face. Tonight, the receipts are trying to do the same job with better manners.";
    }

    if (currentSceneId === "shift4_opening" && state.flags.memory_receipt_redacted) {
      text += "\n\nAfter the Memory Tab, the room treats names like open flame. Tonight someone has decorated with both.";
    }

    if (currentSceneId === "shift4_civilians_enter" && state.flags.theo_protected) {
      text += "\n\nThe civilians arrive laughing. You remember Theo's tired joke and how fast a harmless request can become a record.";
    }

    if (currentSceneId === "shift5_opening" && state.flags.birthday_signal_altered) {
      text += "\n\nAfter Two Birthdays, public care feels less innocent. Tonight, Harmony has printed cards for it.";
    }

    if (currentSceneId === "shift5_civilians_enter" && state.flags.tally_redirected) {
      text += "\n\nTally's lowered phone taught you something: attention can be turned before it has to be broken.";
    }

    if (currentSceneId === "shift6_opening" && state.flags.kindness_receipt_redacted) {
      text += "\n\nAfter the Kindness Audit, even the blank forms look suspicious. The house seems to agree.";
    }

    if (currentSceneId === "shift6_civilians_enter" && state.flags.pax_protected) {
      text += "\n\nNash's delivery smile reminds you of Pax before the audit named them. Civilian is not the same as harmless.";
    }

    if (currentSceneId === "shift7_opening" && state.flags.network_cut) {
      text += "\n\nAfter the Dead Switch, the room trusts darkness more than it used to. That is not the same as peace.";
    }

    if (currentSceneId === "shift7_civilians_enter" && state.flags.final_consent_taken) {
      text += "\n\nThe week has made one thing clear: consent sounds messy because people are.";
    }

    return text;
  }

  function getSceneDialogue(scene) {
    if (currentSceneId === "lounge_arrival" && state.flags.checked_receipt_printer) {
      return "You touched the printer upstairs. Good. It hates being ignored.";
    }

    if (currentSceneId === "veil_returns") {
      if (state.flags.snooped_sleeve) return "Did anyone touch my sleeve?";
      if (state.flags.found_receipt_404) return "Did the clock move while I was gone?";
      if (state.flags.asked_host_about_veil) return "Did the host say anything?";
    }

    return scene.dialogue || "";
  }

  function getCallbackNote() {
    if (currentSceneId === "veil_returns" && state.flags.snooped_sleeve) {
      return "Echo: The sleeve seam sits one thread higher than before. Silver Veil sees it before they sit.";
    }

    if (currentSceneId === "final_decision" && state.flags.found_receipt_404) {
      return "Echo: The future receipt said 12:40. The clock is getting close enough to make that matter.";
    }

    if (currentSceneId === "final_decision" && state.flags.asked_host_about_veil) {
      return "Echo: Static on the side means compromised communication. The civilian copy is not harmless if the room mistakes it for the signal.";
    }

    if (currentSceneId === "host_signal" && state.flags.served_code_clean) {
      return "Echo: Because you wrote the first order clean, Mara lets the final choice arrive without a speech.";
    }

    if (currentSceneId === "shift2_final_decision" && state.flags.mara_orchid_warning) {
      return "Echo: Mara's ice-well tap meant preserve the flower, break the frame, spare the civilian.";
    }

    if (currentSceneId === "shift2_final_decision" && state.flags.anika_recording_seen) {
      return "Echo: Anika's clip caught the flower, the face, and the slogan. Pretty is not the same as safe.";
    }

    if (currentSceneId === "shift3_final_decision" && state.flags.mara_memory_warning) {
      return "Echo: Mara's printer-tray tap meant truth can save a person, and so can a closed door.";
    }

    if (currentSceneId === "shift3_final_decision" && state.flags.elevator_audit_seen) {
      return "Echo: Harmony's audit ink is faint, but not dead. If the printer gets a clean copy, someone upstairs gets one too.";
    }

    if (currentSceneId === "shift4_final_decision" && state.flags.mara_birthday_warning) {
      return "Echo: Mara's match went out before it burned. No song means no public proof.";
    }

    if (currentSceneId === "shift4_final_decision" && state.flags.tally_post_seen) {
      return "Echo: Tally's caption guessed the code phrase too quickly. The phone is not neutral just because it smiles.";
    }

    if (currentSceneId === "shift5_final_decision" && state.flags.mara_kindness_warning) {
      return "Echo: Mara's finger over the camera dot meant proof can save a crowd and still harm the first person it names.";
    }

    if (currentSceneId === "shift5_final_decision" && state.flags.found_tip_camera) {
      return "Echo: The silver card saw Pax more clearly than Rina. The audit knows how to watch need.";
    }

    if (currentSceneId === "shift6_final_decision" && state.flags.mara_leak_warning) {
      return "Echo: Mara's breaker tap meant follow the leak only if you can lie better than it listens.";
    }

    if (currentSceneId === "shift6_final_decision" && state.flags.found_backdoor_log) {
      return "Echo: The route used a real house code for a false request. Someone wore the house's voice badly.";
    }

    if (currentSceneId === "shift7_final_decision" && state.flags.mara_final_warning) {
      return "Echo: Mara's open hand meant do not save privacy by stealing choice.";
    }

    if (currentSceneId === "shift7_final_decision" && state.flags.found_all_names_list) {
      return "Echo: Vale's roster is useful because it is dangerous. That is the whole bargain.";
    }

    return "";
  }

  function renderPunchcard(scene) {
    const card = makeElement("article", "punchcard-card");
    card.appendChild(makeElement("p", "receipt-label", "SUGAR SHACK"));
    card.appendChild(makeElement("h2", "", scene.title));
    card.appendChild(makeElement("p", "receipt-subtitle", "Temporary Access / Shift " + String(state.currentShift).padStart(2, "0")));
    card.appendChild(renderText(getSceneText(scene)));
    return card;
  }

  function renderResult(scene) {
    state.endingLabel = scene.endingLabel;
    state.resultText = cleanText(scene.text);
    lastResponse = "";

    const layout = makeElement("div", "layout " + getSceneClass());
    const scenePanel = makeElement("section", "scene-panel");

    scenePanel.appendChild(makeElement("p", "scene-kicker", "Result"));
    scenePanel.appendChild(makeElement("h2", "scene-title", scene.endingLabel));
    scenePanel.appendChild(renderSceneVisual(scene) || makeElement("div", "scene-visual visual-result", scene.endingLabel));
    scenePanel.appendChild(renderText(scene.text));

    const choices = makeElement("div", "choices");
    choices.appendChild(makeChoiceButton({ text: "Print the end-of-shift tab.", next: scene.next }, 1));
    scenePanel.appendChild(choices);

    layout.appendChild(scenePanel);
    layout.appendChild(renderSidePanel(scene));
    app.appendChild(layout);
  }

  function renderSnoopMenu(scene) {
    const layout = makeElement("div", "layout " + getSceneClass());
    const scenePanel = makeElement("section", "scene-panel");
    const remainingText = state.snoopActionsRemaining + " action" + (state.snoopActionsRemaining === 1 ? "" : "s") + " left";

    scenePanel.appendChild(makeElement("p", "scene-kicker", "Twenty Seconds"));
    scenePanel.appendChild(makeElement("h2", "scene-title", scene.title));
    scenePanel.appendChild(renderSceneVisual(scene));
    scenePanel.appendChild(renderText(getSceneText(scene)));
    scenePanel.appendChild(makeElement("p", "remaining", remainingText));

    if (lastResponse) {
      scenePanel.appendChild(makeElement("div", "clue-note", lastResponse));
    }

    const choices = makeElement("div", "choices");

    scene.options.forEach(function (option, index) {
      const button = makeChoiceButton(
        {
          text: option.text,
          action: function () {
            chooseSnoopAction(option, scene.nextWhenDone);
          },
        },
        index + 1
      );
      const wasUsed = state.snoopActionsUsed.includes(option.text);
      button.disabled = wasUsed && !option.endSnooping;
      choices.appendChild(button);
    });

    scenePanel.appendChild(choices);
    layout.appendChild(scenePanel);
    layout.appendChild(renderSidePanel(scene));
    app.appendChild(layout);
  }

  function renderText(text) {
    const wrapper = makeElement("div", "scene-text");
    const safeText = text || "";
    const paragraphs = cleanText(safeText).split(/\n\s*\n/).filter(Boolean);

    paragraphs.forEach(function (paragraph) {
      wrapper.appendChild(makeElement("p", "", paragraph));
    });

    return wrapper;
  }

  function cleanText(text) {
    return (text || "")
      .trim()
      .split("\n")
      .map(function (line) {
        return line.trim();
      })
      .join("\n");
  }

  function renderDialogue(speaker, dialogue) {
    const box = makeElement("blockquote", "dialogue");

    if (speaker) {
      box.appendChild(makeElement("span", "speaker", speaker));
    }

    box.appendChild(makeElement("span", "", dialogue));
    return box;
  }

  function renderSidePanel(scene) {
    const panel = makeElement("aside", "side-panel");
    const cards = getCharacterCards();

    panel.appendChild(renderProgressRail());

    if (cards.length > 0) {
      panel.appendChild(makeElement("p", "panel-label", "Character Reads"));
      const cardWrap = makeElement("div", "character-grid");
      cards.forEach(function (card) {
        cardWrap.appendChild(renderCharacterCard(card));
      });
      panel.appendChild(cardWrap);
    }

    panel.appendChild(makeElement("p", "panel-label", "Floor Read"));
    const readList = makeElement("ul", "read-list");
    const reads = getSceneReads(scene);
    reads.forEach(function (entry) {
      readList.appendChild(makeElement("li", "", entry));
    });
    panel.appendChild(readList);

    if (clueLog.length > 0) {
      panel.appendChild(makeElement("p", "panel-label", "Clues Remembered"));
      const list = makeElement("ul", "clue-list");
      clueLog.slice(-5).forEach(function (entry) {
        list.appendChild(makeElement("li", "", entry));
      });
      panel.appendChild(list);
    }

    return panel;
  }

  function getSceneReads(scene) {
    const reads = scene.reads && scene.reads.length > 0 ? scene.reads.slice() : getDefaultReads();

    if (currentSceneId === "veil_returns" && state.flags.snooped_sleeve) {
      reads.unshift("Silver Veil Mood: Wary. Their sleeve hand closes before their mouth opens.");
    }

    if (currentSceneId === "final_decision" && state.flags.snooped_sleeve) {
      reads.push("Object Read: The transit chip in your memory makes every exit feel louder.");
    }

    if (currentSceneId === "final_decision" && state.flags.found_receipt_404) {
      reads.push("Clock Read: The future is now close enough to fog the glass.");
    }

    return reads;
  }

  function renderCharacterCard(card) {
    const item = makeElement("article", "character-card mood-" + card.mood.toLowerCase().replace(/\s+/g, "-"));
    const top = makeElement("div", "character-top");
    top.appendChild(makeElement("strong", "", card.name));
    top.appendChild(makeElement("span", "mood-pill", card.mood));
    item.appendChild(top);
    item.appendChild(makeElement("p", "", card.read));
    return item;
  }

  function getCharacterCards() {
    const scene = scenes[currentSceneId];
    if (scene && Array.isArray(scene.cards)) return scene.cards;

    if (["title", "job_listing", "studio_intro"].includes(currentSceneId)) return [];

    if (["donut_shop", "elevator_receipt", "elevator_down"].includes(currentSceneId)) {
      return [
        {
          name: "Cashier",
          mood: state.flags.asked_day_old_dozen ? "Listening" : state.flags.checked_receipt_printer ? "Alert" : "Closed",
          read: state.flags.checked_receipt_printer
            ? "They noticed you noticed the printer. Respect, or a warning. Hard to tell upstairs."
            : "Their customer-service smile never arrives. Something under the counter already did.",
        },
      ];
    }

    const cards = [];

    if (isHostScene()) {
      cards.push({
        name: "Host",
        mood: getHostMood(),
        read: getHostRead(),
      });
    }

    if (isPatronScene()) {
      cards.push({
        name: "Silver Veil",
        mood: getSilverMood(),
        read: getSilverRead(),
      });
      cards.push({
        name: "Chrome Jacket",
        mood: getChromeMood(),
        read: getChromeRead(),
      });
    }

    return cards;
  }

  function isHostScene() {
    return !["title", "job_listing", "donut_shop", "elevator_receipt", "elevator_down", "studio_intro"].includes(currentSceneId);
  }

  function isPatronScene() {
    return [
      "patron_intro",
      "coded_order",
      "chrome_reacts",
      "veil_break",
      "snoop_menu",
      "veil_returns",
      "host_signal",
      "final_decision",
    ].includes(currentSceneId);
  }

  function getHostMood() {
    if (state.flags.capsule_hidden) return "Calculating";
    if (state.flags.capsule_dissolved) return "Icy";
    if (state.flags.asked_host_about_veil) return "Invested";
    return state.characterStates.host || "Amused";
  }

  function getHostRead() {
    if (state.flags.asked_host_about_veil) return "They gave you one translation and are waiting to see whether you confuse help with permission.";
    if (state.flags.received_punchcard) return "They watch your hands now, not your face. The house cares what you touch.";
    return "They already know which answer you want to give. They are more interested in the cost.";
  }

  function getSilverMood() {
    if (state.flags.veil_is_protected) return "Alarmed";
    if (state.flags.snooped_sleeve) return "Wary";
    if (state.hidden.patron_trust > 0) return "Listening";
    return state.characterStates.silver_veil || "Guarded";
  }

  function getSilverRead() {
    if (state.flags.snooped_sleeve) return "Their sleeve sits wrong. They know it. They are deciding whether to forgive the room or leave it.";
    if (state.flags.veil_is_protected) return "Fear has cracked the performance. They are still playing, but not for you.";
    if (state.flags.found_glass_residue) return "Their empty glass has a history. They keep covering the rim like memory can leak out.";
    return "Their hand keeps covering the glass. They are listening to the booth behind them.";
  }

  function getChromeMood() {
    if (state.hidden.enemy_suspicion >= 2) return "Threatened";
    if (state.flags.chrome_is_suspected || state.flags.noticed_chrome_reaction) return "Watching";
    return state.characterStates.chrome_man || "Calm";
  }

  function getChromeRead() {
    if (state.hidden.enemy_suspicion >= 2) return "His calm has edges now. He is still smiling, but the smile is doing overtime.";
    if (state.flags.chrome_is_suspected) return "He is not watching the order. He is watching who learns from it.";
    return "He tilts a drink he has no intention of drinking. The performance is expensive.";
  }

  function getDefaultReads() {
    return ["House Mood: Watching.", "Operator Note: No raw numbers. Read the room, not a meter."];
  }

  function makeChoiceButton(choice, number) {
    const button = makeElement("button", "choice-button");
    button.type = "button";
    button.setAttribute("aria-label", choice.text);

    const choiceNumber = makeElement("span", "choice-number", String(number).padStart(2, "0"));
    choiceNumber.setAttribute("aria-hidden", "true");
    button.appendChild(choiceNumber);
    button.appendChild(makeElement("span", "", choice.text));

    button.addEventListener("click", function () {
      if (choice.action) {
        choice.action();
        return;
      }

      chooseStoryAction(choice);
    });

    return button;
  }

  function chooseStoryAction(choice) {
    applyEffects(choice.effects);
    const nextResponse = choice.response || "";
    recordRunEntry(choice.text, nextResponse);
    lastResponse = nextResponse;
    currentSceneId = choice.next;
    render();
  }

  function chooseSnoopAction(option, nextSceneId) {
    applyEffects(option.effects);
    lastResponse = option.response;
    recordRunEntry(option.text, option.response);
    clueLog.push(option.response);

    if (!option.endSnooping) {
      state.snoopActionsUsed.push(option.text);
      state.snoopActionsRemaining -= 1;
    } else {
      state.snoopActionsRemaining = 0;
    }

    if (state.snoopActionsRemaining <= 0 || option.endSnooping) {
      currentSceneId = nextSceneId;
    }

    render();
  }

  function applyEffects(effects) {
    const safeEffects = effects || {};

    addNumberEffects(state.stats, safeEffects.stats);
    addNumberEffects(state.hidden, safeEffects.hidden);

    if (safeEffects.flags) {
      Object.entries(safeEffects.flags).forEach(function (entry) {
        state.flags[entry[0]] = entry[1];
      });
    }

    if (safeEffects.characterStates) {
      Object.entries(safeEffects.characterStates).forEach(function (entry) {
        state.characterStates[entry[0]] = entry[1];
      });
    }

    if (safeEffects.save && Object.prototype.hasOwnProperty.call(safeEffects.save, "hasCompletedIntro")) {
      state.hasCompletedIntro = safeEffects.save.hasCompletedIntro;
      saveIntroFlag(state.hasCompletedIntro);
    }
  }

  function addNumberEffects(target, changes) {
    Object.entries(changes || {}).forEach(function (entry) {
      const key = entry[0];
      const value = entry[1];
      target[key] = (Number(target[key]) || 0) + value;
    });
  }

  function getEarlyCodename() {
    const mercy = state.stats.mercy;
    const risk = state.stats.risk;
    const logic = state.stats.logic;
    const trust = state.stats.trust;
    const social_read = state.stats.social_read;
    const independence = state.stats.independence;
    const enemy_suspicion = state.hidden.enemy_suspicion;
    const venue_stability = state.hidden.venue_stability;

    if (mercy >= 2 && social_read >= 2) return "The Lantern";
    if (logic >= 4 && mercy <= 0) return "Cold Brew";
    if (social_read >= 4 && enemy_suspicion <= 0) return "Ghost Bartender";
    if (venue_stability >= 2 && trust >= 2) return "House Favorite";
    if (mercy >= 3 && trust >= 2) return "Glass Saint";
    if (independence >= 2 && risk >= 2) return "Double Signal";
    if (risk >= 3 && enemy_suspicion >= 2) return "The Velvet Knife";
    return "Open Tab";
  }

  function rawToSkillScore(raw) {
    if (raw <= 0) return 1;
    if (raw === 1) return 2;
    if (raw === 2) return 3;
    if (raw === 3) return 4;
    return 5;
  }

  function rankedBranches(direction) {
    const sorted = statOrder.slice().sort(function (left, right) {
      if (direction === "strongest") {
        return state.stats[right] - state.stats[left];
      }

      return state.stats[left] - state.stats[right];
    });

    return sorted.map(function (key) {
      return branchName(key);
    });
  }

  function signatureMove() {
    if (state.flags.privacy_final_refused) return "Destroyed the roster and left safety unfinished";
    if (state.flags.privacy_final_delayed) return "Sealed the roster until consent could catch up";
    if (state.flags.privacy_final_altered) return "Gave Vale only the names people chose and routes that lied";
    if (state.flags.privacy_final_served) return "Accepted the guarantee and the record it required";
    if (state.flags.house_leak_refused) return "Cut the network before Vale could map the house";
    if (state.flags.house_leak_delayed) return "Held the leak open just long enough to hear it answer";
    if (state.flags.house_leak_altered || state.flags.decoy_leak_sent) return "Fed the leak a believable wrong door";
    if (state.flags.house_leak_served) return "Followed the true leak and paid for the map";
    if (state.flags.kindness_audit_refused) return "Dissolved the score before kindness became ownership";
    if (state.flags.kindness_audit_delayed) return "Held the credit until help could ask permission";
    if (state.flags.kindness_audit_altered || state.flags.kindness_receipt_redacted) return "Preserved the proof and removed the person";
    if (state.flags.kindness_audit_served) return "Printed the ugly proof without softening it";
    if (state.flags.birthday_signal_refused) return "Killed the witness list before the name could land";
    if (state.flags.birthday_signal_delayed) return "Held the song until everyone could choose";
    if (state.flags.birthday_signal_altered || state.flags.birthday_name_corrected) return "Hid the private candle inside the public party";
    if (state.flags.birthday_signal_served) return "Honored the quiet birthday without letting the room sing";
    if (state.flags.mika_protected && state.flags.tally_redirected) return "Gave the civilians a harmless story";
    if (state.flags.memory_tab_refused) return "Burned the duplicate tab before Harmony could copy it";
    if (state.flags.memory_tab_delayed) return "Held the missing night until Theo could choose";
    if (state.flags.memory_tab_altered || state.flags.memory_receipt_redacted) return "Preserved the proof and redacted the person";
    if (state.flags.memory_tab_served) return "Opened the tab and let the truth arrive";
    if (state.flags.theo_protected) return "Gave Theo a choice before the room gave them a file";
    if (state.flags.orchid_signal_refused) return "Broke the flower before the camera could own it";
    if (state.flags.orchid_signal_delayed) return "Held the bloom until the watcher reached first";
    if (state.flags.orchid_signal_altered || state.flags.orchid_camera_blurred) return "Gave the camera a harmless flower";
    if (state.flags.orchid_signal_served && state.flags.dom_protected) return "Preserved the evidence and moved the civilian out of frame";
    if (state.flags.dom_protected) return "Moved the wrong flower out of the wrong hands";
    if (state.flags.anika_redirected) return "Turned attention into cover";
    if (state.flags.whiskey_signal_refused) return "Broke the signal before it could land wrong";
    if (state.flags.whiskey_signal_delayed) return "Held both glasses until the room showed its hands";
    if (state.flags.whiskey_signal_altered || state.flags.wrong_glass_corrected) return "Marked the civilian glass before it became a signal";
    if (state.flags.silver_signal_served && state.flags.nia_protected) return "Served the signal and shielded the civilians";
    if (state.flags.jules_warned) return "Trusted the civilian who noticed first";
    if (state.flags.capsule_dissolved) return "Melted the message before anyone could own it";
    if (state.flags.capsule_hidden) return "Moved the signal to song 404";
    if (state.flags.capsule_to_veil && state.flags.veil_is_protected) return "Protected Silver Veil in plain sight";
    if (state.flags.capsule_to_veil) return "Trusted the veiled patron";
    if (state.flags.capsule_to_chrome && state.flags.chrome_is_suspected) return "Fed the watcher while keeping your eyes open";
    if (state.flags.capsule_to_chrome) return "Kept the clean pour clean";
    return "Kept the house sweet and quiet";
  }

  function secretsKept() {
    let count = 0;
    if (state.flags.kept_cover_clean) count += 1;
    if (state.flags.capsule_hidden || state.flags.capsule_dissolved) count += 1;
    if (!state.flags.snooped_sleeve) count += 1;
    if (state.hidden.venue_stability > 1) count += 1;

    if (count <= 1) return "Few, but memorable";
    if (count === 2) return "Enough to keep the lights pink";
    if (count === 3) return "Most of the room stayed plausible";
    return "The house may frame this receipt";
  }

  function signalsAltered() {
    let count = 0;
    [
      "tested_drink_code",
      "found_receipt_404",
      "asked_host_about_veil",
      "capsule_hidden",
      "capsule_dissolved",
      "veil_is_protected",
    ].forEach(function (flag) {
      if (state.flags[flag]) count += 1;
    });

    if (count === 0) return "None obvious";
    if (count <= 2) return "Low interference";
    if (count <= 4) return "Meaningfully bent";
    return "The signal left wearing a fake mustache";
  }

  function heatLevel() {
    const heat =
      Math.max(0, state.stats.risk) +
      Math.max(0, state.hidden.enemy_suspicion) +
      Math.max(0, state.hidden.heat) +
      Math.max(0, state.hidden.harmony_attention);
    if (heat <= 1) return "Cool glass";
    if (heat <= 3) return "Warm neon";
    if (heat <= 5) return "Watching";
    return "Hot enough to melt chrome";
  }

  function civiliansShielded() {
    if (state.currentShift === 7) {
      if (state.flags.privacy_final_refused && state.flags.returns_protected) return "The room stayed unlisted and chose its own risk";
      if (state.flags.privacy_final_altered && state.flags.final_consent_taken) return "People who opted in were findable; everyone else stayed difficult";
      if (state.flags.privacy_final_delayed) return "The room kept the right to answer later";
      if (state.flags.privacy_final_served) return "Everyone became safer and less private";
    }

    if (state.currentShift === 6) {
      if (state.flags.penny_protected && state.flags.mara_protected && state.flags.decoy_leak_sent) return "Penny and Mara stayed out of Vale's clean map";
      if (state.flags.penny_protected) return "Penny left useful without becoming the culprit";
      if (state.flags.penny_exposed) return "Penny became part of the proof";
      if (state.flags.house_exposed) return "The house took the blame loudly enough to shield less of itself";
    }

    if (state.currentShift === 5) {
      if (state.flags.pax_protected && state.flags.vera_proof_preserved) return "Pax left unnamed; Vera kept proof with fewer teeth";
      if (state.flags.pax_protected) return "Pax left helped but uncounted";
      if (state.flags.pax_exposed) return "Pax became the cost of a clean audit";
      if (state.flags.vera_exposed) return "Vera kept less proof than the room deserved";
    }

    if (state.currentShift === 4) {
      if (state.flags.mika_protected && state.flags.celia_identity_preserved && state.flags.tally_redirected) return "Mika got a birthday; Celia kept a self";
      if (state.flags.mika_protected && state.flags.celia_identity_preserved) return "Mika and Celia both left with fewer witnesses";
      if (state.flags.mika_exposed) return "Mika learned the party had sharp edges";
      if (state.flags.celia_exposed) return "Celia's private date got too public";
    }

    if (state.currentShift === 3) {
      if (state.flags.theo_protected && state.flags.memory_receipt_redacted) return "Theo kept the choice without becoming a case number";
      if (state.flags.theo_protected) return "Theo left with agency still attached";
      if (state.flags.theo_exposed) return "Theo learned the truth in public";
      if (state.flags.sable_exposed) return "Sable kept less proof than they deserved";
    }

    if (state.currentShift === 2) {
      if (state.flags.dom_protected && state.flags.anika_redirected) return "Dom left untagged; Anika left with a harmless story";
      if (state.flags.dom_protected) return "Dom left outside the arrangement";
      if (state.flags.anika_redirected) return "Anika filmed the wrong miracle";
      if (state.flags.anika_exposed || state.flags.dom_exposed) return "The civilians got too close to the evidence";
    }

    if (state.flags.nia_protected && state.flags.jules_warned) return "Nia and Jules left with only a bad feeling";
    if (state.flags.nia_protected) return "Nia left outside the signal";
    if (state.flags.nia_exposed) return "The civilians learned too much";
    return "Unclear";
  }

  function exposureLevel() {
    const exposure =
      Math.max(0, state.hidden.civilian_exposure) +
      Math.max(0, state.hidden.heat) +
      Math.max(0, state.hidden.harmony_attention);

    if (exposure === 0) return "Low";
    if (exposure <= 2) return "Noticeable";
    return "Loud";
  }

  function coverIntact() {
    if (state.currentShift === 7) {
      if (state.flags.privacy_final_refused) return "Burned, private, unstable";
      if (state.flags.privacy_final_altered) return "Bent into consent";
      if (state.flags.privacy_final_delayed) return "Sealed but unresolved";
      if (state.flags.privacy_final_served) return "Open to Vale";
    }

    if (state.currentShift === 6) {
      if (state.flags.house_leak_refused) return "Dark, with missing proof";
      if (state.flags.house_leak_altered || state.flags.decoy_leak_sent) return "Mostly intact";
      if (state.flags.house_leak_delayed || state.flags.leak_watched) return "Thin around the router";
    }

    if (state.currentShift === 5) {
      if (state.flags.kindness_audit_refused) return "Clean of names, thin on proof";
      if (state.flags.kindness_receipt_redacted || state.flags.kindness_audit_altered) return "Mostly intact";
      if (state.flags.audit_watched || state.flags.found_tip_camera) return "Thin around the silver cards";
    }

    if (state.currentShift === 4) {
      if (state.flags.birthday_signal_refused) return "Dark, but the post died";
      if (state.flags.birthday_signal_altered || state.flags.birthday_name_corrected) return "Mostly intact";
      if (state.flags.birthday_watched || state.flags.tally_post_seen) return "Thin around the phone";
    }

    if (state.currentShift === 3) {
      if (state.flags.memory_tab_refused) return "Burned, with smoke in the audit";
      if (state.flags.memory_receipt_redacted || state.flags.memory_tab_altered) return "Mostly intact";
      if (state.flags.memory_watched || state.flags.elevator_audit_seen) return "Thin around the printer";
    }

    if (state.currentShift === 2) {
      if (state.flags.orchid_signal_refused) return "Dark, but public footage failed";
      if (state.flags.orchid_camera_blurred || state.flags.anika_redirected) return "Mostly intact";
      if (state.flags.orchid_watched) return "Thin around the camera";
    }

    if (state.flags.whiskey_signal_refused) return "Cracked, but no civilian carried the code";
    if (state.flags.wrong_glass_corrected || state.flags.nia_protected) return "Mostly intact";
    if (state.flags.wrong_glass_watched) return "Thin";
    return "Intact enough";
  }

  function renderReceiptDebrief() {
    const layout = makeElement("div", "layout scene-receipt-debrief");
    const scenePanel = makeElement("section", "scene-panel");
    const receipt = makeElement("article", "receipt");
    const codename = getEarlyCodename();

    receipt.appendChild(makeElement("p", "receipt-label", "SUGAR SHACK"));
    receipt.appendChild(makeElement("h2", "", "END OF SHIFT TAB"));
    receipt.appendChild(makeElement("p", "receipt-subtitle", "Shift " + String(state.currentShift).padStart(2, "0") + " / " + getShiftInfo(state.currentShift).title));

    [
      ["Codename", codename],
      ["Ending", state.endingLabel],
      ["Shift Summary", signatureMove()],
      ["Civilians Shielded", civiliansShielded()],
      ["Exposure Level", exposureLevel()],
      ["Cover Intact", coverIntact()],
      ["Strongest Branch", rankedBranches("strongest")[0]],
      ["Weakest Branch", rankedBranches("weakest")[0]],
      ["House Note", heatLevel()],
    ].forEach(function (row) {
      receipt.appendChild(renderReceiptRow(row[0], row[1]));
    });

    const actions = makeElement("div", "footer-actions");
    actions.appendChild(makeChoiceButton({ text: "Open psychology debrief.", next: "psychology_debrief" }, 1));
    actions.appendChild(makeChoiceButton({ text: "Restart story.", action: startNewShift }, 2));

    scenePanel.appendChild(receipt);
    scenePanel.appendChild(actions);
    layout.appendChild(scenePanel);
    layout.appendChild(renderSidePanel({ reads: ["Receipt: Printed warm.", "House Mood: Interested in whether you keep it."] }));
    app.appendChild(layout);
  }

  function renderReceiptRow(label, value) {
    const row = makeElement("div", "receipt-row");
    row.appendChild(makeElement("strong", "", label + ":"));
    row.appendChild(makeElement("span", "", value));
    return row;
  }

  function renderPsychologyDebrief() {
    const layout = makeElement("div", "layout scene-psychology-debrief");
    const scenePanel = makeElement("section", "scene-panel case-file");
    const codename = getEarlyCodename();

    scenePanel.appendChild(makeElement("p", "scene-kicker", "Reflection File"));
    scenePanel.appendChild(makeElement("h2", "", "WHAT THIS SHIFT SAYS ABOUT YOUR DECISIONS"));
    scenePanel.appendChild(renderText("Based on your choices this run.\n\nPlaythrough insight, not a diagnosis.\n\n" + codenameText[codename]));
    scenePanel.appendChild(renderSkillTree());
    scenePanel.appendChild(renderUnlockedTraits());

    const actions = makeElement("div", "footer-actions");
    actions.appendChild(makeChoiceButton({ text: "Return to tab.", next: "receipt_debrief" }, 1));
    if (state.currentShift < 7) {
      actions.appendChild(makeChoiceButton({ text: "Continue to Shift " + String(state.currentShift + 1) + ".", action: continueToNextShift }, 2));
    } else {
      actions.appendChild(makeChoiceButton({ text: "Open final story debrief.", next: "final_story_debrief" }, 2));
      actions.appendChild(makeChoiceButton({ text: "Restart story.", action: startNewShift }, 3));
    }
    scenePanel.appendChild(actions);

    layout.appendChild(scenePanel);
    layout.appendChild(renderSidePanel({ reads: ["Reflection: Shareable, not clinical.", "Branch Reveal: Stats appear only after the shift ends."] }));
    app.appendChild(layout);
  }

  function renderFinalStoryDebrief() {
    const layout = makeElement("div", "layout scene-final-story-debrief");
    const scenePanel = makeElement("section", "scene-panel case-file");
    const codename = getEarlyCodename();

    scenePanel.appendChild(makeElement("p", "scene-kicker", "Final Story Debrief"));
    scenePanel.appendChild(makeElement("h2", "", "THE WEEK BELOW SUGAR SHACK"));
    scenePanel.appendChild(
      renderText(
        "Based on your choices this run.\n\n" +
          finalRunSummary() +
          "\n\nCodename: " +
          codename +
          "\nEnding: " +
          (state.endingLabel || "Open Tab") +
          "\nHouse Future: " +
          finalHouseFuture()
      )
    );

    const list = makeElement("ul", "trait-list");
    finalRunBeats().forEach(function (beat) {
      list.appendChild(makeElement("li", "", beat));
    });
    scenePanel.appendChild(list);

    const actions = makeElement("div", "footer-actions");
    actions.appendChild(makeChoiceButton({ text: "Return to reflection.", next: "psychology_debrief" }, 1));
    actions.appendChild(makeChoiceButton({ text: "Restart story.", action: startNewShift }, 2));
    scenePanel.appendChild(actions);

    layout.appendChild(scenePanel);
    layout.appendChild(renderSidePanel({ reads: ["Final Tab: Full-week reflection.", "Store Note: Seven-shift arc complete for prototype testing."] }));
    app.appendChild(layout);
  }

  function finalRunSummary() {
    if (state.flags.privacy_final_refused) return "You refused the final bargain. Sugar Shack kept privacy, lost certainty, and chose the terror of letting people remain unowned.";
    if (state.flags.privacy_final_delayed) return "You refused the deadline. The roster stayed sealed, and the room left with the right to answer after fear stopped talking first.";
    if (state.flags.privacy_final_altered) return "You bent the bargain into consent. Vale received help only where people chose it, and the house survived by lying carefully.";
    if (state.flags.privacy_final_served) return "You accepted the guarantee. The room became safer in the way systems understand safety, and less private in the way people feel it.";
    return "You reached last call with the tab still open. The house has not decided what to call that yet.";
  }

  function finalHouseFuture() {
    if (state.flags.house_future_watched) return "Protected, monitored, uneasy";
    if (state.flags.house_future_private && state.flags.last_call_blackout) return "Private, damaged, alive";
    if (state.flags.house_future_private) return "Private by consent";
    return "Open tab";
  }

  function finalRunBeats() {
    const beats = [];
    if (state.flags.nia_protected) beats.push("You learned the wrong glass can endanger someone who only wanted a story.");
    if (state.flags.orchid_camera_blurred) beats.push("You learned beauty can be used as cover when a camera wants proof.");
    if (state.flags.memory_receipt_redacted) beats.push("You learned truth and privacy can share the same receipt if someone warms the ink carefully.");
    if (state.flags.birthday_name_corrected) beats.push("You learned celebration becomes dangerous when a room says the wrong name together.");
    if (state.flags.kindness_receipt_redacted) beats.push("You learned help should not automatically become a ledger.");
    if (state.flags.decoy_leak_sent) beats.push("You learned a sanctuary sometimes survives by telling a better lie.");
    if (state.flags.final_consent_taken) beats.push("You learned the room's uneven answers were not a failure of care. They were care.");
    if (beats.length === 0) beats.push("You moved through the week on instinct. Sugar Shack kept the tab open because instinct still leaves a trace.");
    return beats;
  }

  function renderSkillTree() {
    const wrapper = makeElement("section", "skill-tree");
    wrapper.appendChild(makeElement("p", "panel-label", "Branch Reveal"));

    statOrder.forEach(function (key) {
      const score = rawToSkillScore(state.stats[key]);
      const row = makeElement("div", "skill-row");
      const track = makeElement("span", "skill-track");
      const fill = makeElement("span", "skill-fill");

      fill.style.width = score * 20 + "%";
      track.setAttribute("aria-label", branchName(key) + " " + score + " out of 5");
      track.appendChild(fill);

      row.appendChild(makeElement("span", "", branchName(key)));
      row.appendChild(track);
      row.appendChild(makeElement("strong", "", score + "/5"));
      wrapper.appendChild(row);
    });

    return wrapper;
  }

  function renderUnlockedTraits() {
    const wrapper = makeElement("section", "");
    wrapper.appendChild(makeElement("p", "panel-label", "Unlocked Traits"));

    const list = makeElement("ul", "trait-list");
    getUnlockedTraits().forEach(function (trait) {
      list.appendChild(makeElement("li", "", trait));
    });

    wrapper.appendChild(list);
    return wrapper;
  }

  function getUnlockedTraits() {
    const traits = [];

    if (state.flags.asked_day_old_dozen) traits.push("Day-Old Password: You knew how to enter without sounding like you knew.");
    if (state.flags.found_elevator_hint || state.flags.checked_receipt_printer) traits.push("Trapdoor Instinct: You looked at the cover shop until it blinked.");
    if (state.flags.interview_watched_room) traits.push("Watcher Watcher: You checked the room before accepting the premise.");
    if (state.flags.tested_drink_code) traits.push("Code Taster: You pressed gently on a phrase to see what leaked out.");
    if (state.flags.noticed_chrome_reaction) traits.push("Chrome Read: You noticed the calmest person in the room was performing calm.");
    if (state.flags.found_glass_residue) traits.push("Sugar Trace: You read the glass after the story left it.");
    if (state.flags.found_receipt_404) traits.push("Future Tab: You caught a timestamp before it happened.");
    if (state.flags.found_privacy_chip) traits.push("Pink Dots: You noticed the quietest burn mark on the table.");
    if (state.flags.asked_host_about_veil) traits.push("House Whisper: The host trusted you with a translation.");
    if (state.flags.snooped_sleeve) traits.push("Risky Hands: You crossed a line and found a route out.");
    if (state.flags.wrong_glass_corrected) traits.push("Wrong Glass: You noticed when a civilian joke started looking like a signal.");
    if (state.flags.nia_protected) traits.push("Civilian Shield: You kept danger off someone who never ordered it knowingly.");
    if (state.flags.jules_warned) traits.push("Exit Read: You trusted the person who wanted to leave.");
    if (state.flags.whiskey_signal_delayed) traits.push("Static Hold: You bought time instead of forcing a clean answer.");
    if (state.flags.whiskey_signal_refused) traits.push("Cut Glass: You broke the chain when every clean option cost too much.");
    if (state.flags.harmony_slogan_seen) traits.push("Slogan Read: You noticed when safety language entered the room wearing good manners.");
    if (state.flags.found_orchid_frost) traits.push("Cold Bloom: You saw the evidence inside the beautiful thing.");
    if (state.flags.anika_recording_seen) traits.push("Frame Sense: You knew the camera was not neutral.");
    if (state.flags.orchid_camera_blurred) traits.push("Soft Focus: You gave the lens something useless to love.");
    if (state.flags.dom_protected) traits.push("Delivery Mercy: You moved a tired civilian out of the story's teeth.");
    if (state.flags.orchid_signal_delayed) traits.push("Held Bloom: You waited until the watcher moved first.");
    if (state.flags.orchid_signal_refused) traits.push("Shattered Stem: You chose darkness over public proof.");
    if (state.flags.memory_audit_mentioned) traits.push("Audit Ear: You heard safety language turn into recordkeeping.");
    if (state.flags.found_double_timestamp) traits.push("Double Timestamp: You noticed when the same night tried to charge twice.");
    if (state.flags.theo_receipt_seen) traits.push("Receipt Read: You trusted paper only after reading who it failed.");
    if (state.flags.theo_remembers_song) traits.push("Song Memory: You noticed a body remember before a person could.");
    if (state.flags.memory_receipt_redacted) traits.push("Redacted Mercy: You protected the person while preserving the proof.");
    if (state.flags.memory_tab_delayed) traits.push("Held Tab: You treated consent as part of the evidence.");
    if (state.flags.memory_tab_refused) traits.push("Ash Receipt: You chose the living person over the clean record.");
    if (state.flags.harmony_birthday_prompt_seen) traits.push("Birthday Static: You heard Harmony make sharing sound like safety.");
    if (state.flags.found_wrong_name_cake) traits.push("Wrong Cake: You caught a celebration printing the wrong life.");
    if (state.flags.tally_post_seen) traits.push("Caption Sense: You noticed when the phone started solving the room for the wrong audience.");
    if (state.flags.birthday_name_corrected) traits.push("Name Mercy: You kept the public cake simple and the private signal nameless.");
    if (state.flags.tally_redirected) traits.push("Soft Redirect: You turned a camera toward something harmless without making it a fight.");
    if (state.flags.birthday_signal_altered) traits.push("Decoy Wish: You protected a private signal by giving the public room a brighter story.");
    if (state.flags.birthday_signal_delayed) traits.push("Held Song: You stopped the chorus long enough for consent to catch up.");
    if (state.flags.birthday_signal_refused) traits.push("Blown Candle: You chose darkness before a name could become evidence.");
    if (state.flags.harmony_recording_seen) traits.push("Recorded Reason: You heard Vale make being watched sound like civic care.");
    if (state.flags.found_kindness_score) traits.push("Ledger Read: You noticed kindness had been turned into columns.");
    if (state.flags.found_tip_camera) traits.push("Card Lens: You found the camera hidden inside gratitude.");
    if (state.flags.kindness_receipt_redacted) traits.push("Redacted Help: You kept proof without letting need become a file.");
    if (state.flags.kindness_audit_delayed) traits.push("Held Credit: You made the audit wait for consent.");
    if (state.flags.kindness_audit_refused) traits.push("Broken Ledger: You destroyed the count before it could own the helped person.");
    if (state.flags.vale_direct_signal) traits.push("Live Wire: You heard Vale speak through the house itself.");
    if (state.flags.found_router_heat) traits.push("Router Pulse: You found the leak by listening to the word safe.");
    if (state.flags.found_backdoor_log) traits.push("Backdoor Log: You caught a real house code being worn by a false request.");
    if (state.flags.decoy_leak_sent) traits.push("False Pipe: You protected the house by giving the leak a lie it wanted.");
    if (state.flags.network_cut) traits.push("Dead Switch: You chose privacy even when it killed the proof.");
    if (state.flags.privacy_bargain_seen) traits.push("Bargain Ear: You heard the part of Vale's offer that was genuinely tempting.");
    if (state.flags.found_all_names_list) traits.push("Roster Read: You saw how a list can rescue and endanger at the same time.");
    if (state.flags.final_consent_taken) traits.push("Uneven Consent: You let the room answer messily instead of averaging fear.");
    if (state.flags.privacy_final_altered) traits.push("Opt-In Ghosts: You made safety conditional on choice.");
    if (state.flags.privacy_final_delayed) traits.push("Sealed Last Call: You refused the deadline without pretending the problem vanished.");
    if (state.flags.privacy_final_refused) traits.push("Private Blackout: You chose unowned danger over guaranteed surveillance.");
    if (state.flags.veil_is_protected) traits.push("Veil Mercy: You warned someone before the room closed in.");
    if (state.flags.capsule_hidden) traits.push("Delayed Signal: You made the house hold its own secret.");
    if (state.flags.capsule_dissolved) traits.push("Melted Message: You chose safety over ownership.");

    if (traits.length === 0) {
      traits.push("Open Tab: No special trait unlocked yet. The lounge kept most of its receipts.");
    }

    return traits;
  }

  applyAppSettings();
  setupAppShell();
  resetGame();
})();
