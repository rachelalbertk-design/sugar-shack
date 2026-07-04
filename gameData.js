// gameData.js
// This file is the story brain: state, scenes, choices, hidden effects,
// and debrief text for Sugar Shack.

function paragraphs(lines) {
  return lines.join("\n\n");
}

const initialState = {
  hasCompletedIntro: false,
  currentShift: 1,
  stats: {
    mercy: 0,
    risk: 0,
    logic: 0,
    trust: 0,
    social_read: 0,
    independence: 0,
  },
  hidden: {
    house_trust: 0,
    enemy_suspicion: 0,
    venue_stability: 0,
    civilian_safety: 0,
    civilian_exposure: 0,
    heat: 0,
    harmony_attention: 0,
    patron_trust: 0,
  },
  flags: {
    asked_day_old_dozen: false,
    showed_job_listing: false,
    checked_receipt_printer: false,
    found_elevator_hint: false,
    received_punchcard: false,
    interview_kept_sealed: false,
    interview_watched_room: false,
    interview_chose_mercy: false,
    interview_refused_package: false,
    served_code_clean: false,
    noticed_chrome_reaction: false,
    tested_drink_code: false,
    found_glass_residue: false,
    found_receipt_404: false,
    found_privacy_chip: false,
    found_second_stirrer: false,
    asked_host_about_veil: false,
    snooped_sleeve: false,
    kept_cover_clean: false,
    chrome_is_suspected: false,
    veil_is_protected: false,
    silver_veil_protected: false,
    silver_signal_served: false,
    wrong_glass_corrected: false,
    wrong_glass_watched: false,
    nia_protected: false,
    nia_exposed: false,
    jules_warned: false,
    singer_warning_heard: false,
    whiskey_signal_altered: false,
    whiskey_signal_delayed: false,
    whiskey_signal_refused: false,
    harmony_slogan_seen: false,
    orchid_signal_served: false,
    orchid_signal_altered: false,
    orchid_signal_delayed: false,
    orchid_signal_refused: false,
    found_orchid_frost: false,
    anika_recording_seen: false,
    anika_redirected: false,
    anika_exposed: false,
    dom_protected: false,
    dom_exposed: false,
    dom_is_civilian: false,
    mara_orchid_warning: false,
    singer_orchid_warning: false,
    orchid_watched: false,
    orchid_camera_blurred: false,
    memory_audit_mentioned: false,
    memory_tab_served: false,
    memory_tab_altered: false,
    memory_tab_delayed: false,
    memory_tab_refused: false,
    found_double_timestamp: false,
    theo_receipt_seen: false,
    theo_protected: false,
    theo_exposed: false,
    theo_remembers_song: false,
    rook_lied_for_theo: false,
    rook_called_out: false,
    sable_memory_preserved: false,
    sable_exposed: false,
    memory_receipt_redacted: false,
    memory_watched: false,
    singer_memory_warning: false,
    mara_memory_warning: false,
    elevator_audit_seen: false,
    harmony_birthday_prompt_seen: false,
    birthday_signal_served: false,
    birthday_signal_altered: false,
    birthday_signal_delayed: false,
    birthday_signal_refused: false,
    found_second_birthday: false,
    found_wrong_name_cake: false,
    birthday_name_corrected: false,
    birthday_song_stopped: false,
    birthday_watched: false,
    mara_birthday_warning: false,
    singer_birthday_warning: false,
    tally_post_seen: false,
    tally_redirected: false,
    mika_protected: false,
    mika_exposed: false,
    celia_identity_preserved: false,
    celia_exposed: false,
    capsule_to_veil: false,
    capsule_to_chrome: false,
    capsule_hidden: false,
    capsule_dissolved: false,
  },
  characterStates: {
    host: "Amused",
    silver_veil: "Guarded",
    chrome_man: "Calm",
  },
  snoopActionsRemaining: 2,
  snoopActionsUsed: [],
  endingLabel: "",
  resultText: "",
};

const branchLabels = {
  mercy: "Sanctuary",
  risk: "Heat",
  logic: "Cipher",
  trust: "Pour",
  social_read: "Whisper",
  independence: "Static",
};

const scenes = {
  studio_intro: {
    type: "studioIntro",
    title: "99¢ Studios",
    text: "A tiny premium game drop, held together with tape, nerve, and one suspicious poster.",
    next: "title",
  },

  title: {
    type: "title",
    title: "SUGAR SHACK",
    text: paragraphs([
      "Above street level, it is a cute donut shop with pink boxes, fluorescent lights, and a receipt printer that never quite sleeps.",
      "Below it, Sugar Shack keeps the real menu: coded drinks, velvet booths, privacy tech, and patrons who know better than to use their own names.",
    ]),
    reads: [
      "Cover: Open 24 hours, aggressively normal.",
      "Underneath: Something neon is breathing below the floor.",
    ],
  },

  job_listing: {
    type: "scene",
    title: "HELP WANTED",
    text: paragraphs([
      "SUGAR SHACK",
      "Night shift. No experience necessary. Must be discreet. Must not ask who ordered what.",
      "Apply in person after 12:07 AM.",
      "Ask for the day-old dozen.",
      "The newspaper ink leaves a pink crescent on your thumb, like the listing was printed through frosting.",
    ]),
    reads: [
      "Listing: Cute enough to be fake. Specific enough to be dangerous.",
    ],
    choices: [
      {
        text: "Fold the listing and go after 12:07 AM.",
        next: "donut_shop",
      },
    ],
  },

  donut_shop: {
    type: "scene",
    title: "The Public Counter",
    text: paragraphs([
      "The upstairs shop smells like glaze, fryer oil, and plausible deniability.",
      "Pink boxes are stacked in a perfect little wall. A clock above the register reads 12:07 AM and refuses to move.",
      "The cashier looks up before the bell over the door finishes ringing.",
    ]),
    speaker: "Cashier",
    dialogue: "We are out of everything fresh.",
    reads: [
      "Cashier Mood: Closed. They are waiting for a phrase, not a customer.",
      "Room Read: The receipt printer is warmer than the fryer.",
    ],
    choices: [
      {
        text: "Ask for the day-old dozen.",
        next: "elevator_receipt",
        effects: {
          stats: { trust: 1, logic: 1 },
          hidden: { house_trust: 1 },
          flags: { asked_day_old_dozen: true },
          characterStates: { host: "Interested" },
        },
        response: "The cashier does not smile. That is how you know you said it right.",
      },
      {
        text: "Show the job listing.",
        next: "elevator_receipt",
        effects: {
          stats: { logic: 1 },
          hidden: { venue_stability: 1 },
          flags: { showed_job_listing: true },
        },
        response: "The cashier reads it upside down and nods like the paper has vouched for you.",
      },
      {
        text: "Wait by the pink boxes.",
        next: "elevator_receipt",
        effects: {
          stats: { social_read: 1, risk: -1 },
          hidden: { venue_stability: 1 },
          flags: { kept_cover_clean: true },
        },
        response: "You let the room decide whether you belong. The pink boxes decide first.",
      },
      {
        text: "Check the receipt printer.",
        next: "elevator_receipt",
        effects: {
          stats: { logic: 1, risk: 1 },
          flags: { checked_receipt_printer: true },
        },
        response: "The printer chatters before you touch it. A blank receipt slides out with your name almost on it.",
      },
      {
        text: "Look for the elevator.",
        next: "elevator_receipt",
        effects: {
          stats: { independence: 1, risk: 1 },
          flags: { found_elevator_hint: true },
        },
        response: "There is no elevator. There is, however, a fryer with a DOWN button taped under the lip.",
      },
    ],
  },

  elevator_receipt: {
    type: "scene",
    title: "ORDER #404",
    text: paragraphs([
      "The cashier tears a blank receipt from the printer and slides it across the counter.",
      "ORDER #404",
      "ELEVATOR ACCESS: APPROVED",
      "Behind the fryer, something clicks. A rectangle of floor exhales cold blue light.",
    ]),
    reads: [
      "Cashier Mood: Wary, but no longer closed.",
      "Environment: The shop is still cute. The floor is not.",
    ],
    choices: [
      {
        text: "Step into the hidden elevator.",
        next: "elevator_down",
      },
    ],
  },

  elevator_down: {
    type: "scene",
    title: "Below the Sweet Stuff",
    text: paragraphs([
      "The elevator doors close with the softness of a secret being kept.",
      "Donut shop sounds fade. The fryer hum deepens until it almost becomes bass.",
      "The elevator descends longer than the building is tall.",
      "When the doors open, the air smells like sugar, ozone, and expensive secrets.",
    ]),
    reads: [
      "Transition: Public sweetness above. Private signal below.",
    ],
    choices: [
      {
        text: "Enter Sugar Shack.",
        next: "lounge_arrival",
      },
    ],
  },

  lounge_arrival: {
    type: "scene",
    title: "Sugar Shack",
    text: paragraphs([
      "The lounge is chrome, velvet, shadow, and neon pink reflected in black glass.",
      "A bartender polishes a coupe that is already clean. A host in a pearled visor looks you over like a password they might accept.",
      "Behind them, a punch clock waits under a sign that says EMPLOYEES TEMPORARY AND OTHERWISE.",
    ]),
    speaker: "Host",
    dialogue: "Hiring is downstairs. Honesty is upstairs. Let us see where you belong.",
    reads: [
      "Host Mood: Amused. They already know which answer you want to give.",
      "Room Read: Every booth has privacy glass. Every booth is still listening.",
    ],
    choices: [
      {
        text: "Take the mini-interview.",
        next: "interview_1",
      },
    ],
  },

  interview_1: {
    type: "scene",
    title: "Interview: Sealed Things",
    speaker: "Host",
    dialogue: "A patron gives you a sealed envelope and says not to open it. What do you do?",
    reads: [
      "Host Mood: Testing. Not your answer. Your delay before the answer.",
    ],
    choices: [
      {
        text: "Keep it sealed and wait for instructions.",
        next: "interview_2",
        effects: {
          stats: { trust: 1 },
          hidden: { house_trust: 1 },
          flags: { interview_kept_sealed: true },
        },
        response: "The host taps one lacquered nail against the counter. Once means acceptable.",
      },
      {
        text: "Check who is watching before accepting it.",
        next: "interview_2",
        effects: {
          stats: { social_read: 1, logic: 1 },
          flags: { interview_watched_room: true },
        },
        response: "The host's smile sharpens. Watching the watchers counts as experience here.",
      },
      {
        text: "Open it only if someone's safety depends on it.",
        next: "interview_2",
        effects: {
          stats: { mercy: 1, independence: 1 },
          flags: { interview_chose_mercy: true },
        },
        response: "The host writes something down without looking at the paper.",
      },
      {
        text: "Refuse to take it.",
        next: "interview_2",
        effects: {
          stats: { risk: -1, independence: 1 },
          flags: { interview_refused_package: true },
        },
        response: "The host laughs softly. Not brave. Not cowardly. Expensive to schedule.",
      },
    ],
  },

  interview_2: {
    type: "scene",
    title: "Interview: Same Order",
    speaker: "Host",
    dialogue: "Two patrons claim the same order. Who gets served first?",
    reads: [
      "Host Mood: Curious. The question has no clean answer, which is why they asked it.",
    ],
    choices: [
      {
        text: "The one who ordered first.",
        next: "interview_3",
        effects: { stats: { logic: 1 } },
        response: "The host nods toward the punch clock. Time is a witness, sometimes.",
      },
      {
        text: "The one who looks more afraid.",
        next: "interview_3",
        effects: { stats: { mercy: 1 } },
        response: "The host's visor dims for half a second. It may have been approval.",
      },
      {
        text: "The one the room is watching.",
        next: "interview_3",
        effects: { stats: { social_read: 1 } },
        response: "Somewhere behind you, a booth stops pretending not to listen.",
      },
      {
        text: "Neither, until the code is clear.",
        next: "interview_3",
        effects: { stats: { logic: 1, risk: -1 } },
        response: "The host circles something on the form. It might be your name. It might be a warning.",
      },
    ],
  },

  interview_3: {
    type: "scene",
    title: "Interview: Polite Lies",
    speaker: "Host",
    dialogue: "If the house asks you to lie, can you do it politely?",
    reads: [
      "Host Mood: Amused again. This is either the real question or a joke with teeth.",
    ],
    choices: [
      {
        text: "Yes.",
        next: "punchcard",
        effects: {
          stats: { trust: 1 },
          hidden: { house_trust: 1 },
        },
        response: "Good enough. Nobody honest gets hired here anyway.",
      },
      {
        text: "Only if the lie protects someone.",
        next: "punchcard",
        effects: { stats: { mercy: 1, independence: 1 } },
        response: "Good enough. Nobody simple gets hired here anyway.",
      },
      {
        text: "Only if I know why.",
        next: "punchcard",
        effects: { stats: { logic: 1, independence: 1 } },
        response: "Good enough. Nobody obedient gets hired here anyway.",
      },
      {
        text: "No, but I can keep quiet.",
        next: "punchcard",
        effects: { stats: { social_read: 1, risk: -1 } },
        response: "Good enough. Silence has better margins than honesty.",
      },
    ],
  },

  punchcard: {
    type: "punchcard",
    title: "SUGAR SHACK",
    text: paragraphs([
      "EMPLOYEE TEMPORARY",
      "SHIFT ACCESS GRANTED",
      "The host slides you a punchcard still warm from the printer. Your name is missing. Your slot is not.",
    ]),
    reads: [
      "Ritual: The card is cheap paper. The permission is not.",
    ],
    choices: [
      {
        text: "Punch In",
        next: "shift_clocked",
        effects: {
          save: { hasCompletedIntro: true },
          flags: { received_punchcard: true },
          hidden: { venue_stability: 1 },
        },
      },
    ],
  },

  shift_clocked: {
    type: "punchcard",
    title: "12:07 AM",
    text: paragraphs([
      "SHIFT 01",
      "CLOCKED IN",
      "The punch clock bites the card with a sound like a tiny verdict.",
    ]),
    reads: [
      "Punchcard: Active.",
      "House Mood: Watching, but willing to call it training.",
    ],
    choices: [
      {
        text: "Enter the floor.",
        next: "shift_opening",
      },
    ],
  },

  shift_opening: {
    type: "scene",
    title: "Whiskey Ramen",
    text: paragraphs([
      "Your station is a narrow bar beneath a menu written like a dare.",
      "Whiskey Ramen. Neon Milk. Black Honey. Ghost Espresso. Static on the side.",
      "Mara sets down two clean glasses and one look that says clean is temporary.",
    ]),
    speaker: "Mara",
    dialogue: "Serve the order. Read the room. Do not let the wrong person leave with the wrong thing.",
    reads: [
      "Shift Title: Whiskey Ramen.",
      "House Rule: Serve what was ordered, what was meant, or what was needed. Those are not always the same pour.",
    ],
    cards: [
      {
        name: "Mara",
        mood: "Measuring",
        read: "She is teaching you by not explaining too much.",
      },
    ],
    choices: [
      {
        text: "Begin service.",
        next: "patron_intro",
      },
    ],
  },

  patron_intro: {
    type: "scene",
    title: "Silver Veil Takes Booth 3",
    text: paragraphs([
      "A patron in a silver veil takes Booth 3 without asking. Their gloves are dry, though elevator mist clings to everyone else.",
      "They sit with their back to the wall and their eyes on the exit reflected in the table.",
      "When the Singer misses a note, Silver Veil flinches before the sound reaches you.",
    ]),
    speaker: "Patron in Silver Veil",
    dialogue: "Is the kitchen still making mistakes?",
    reads: [
      "Silver Veil Mood: Afraid, but practiced.",
      "Body Read: They watch the elevator, not the menu.",
    ],
    cards: [
      {
        name: "Silver Veil",
        mood: "Guarded",
        read: "Their hand covers the empty glass before anything has been poured.",
      },
      {
        name: "The Singer",
        mood: "Careful",
        read: "They let one wrong note hang in the room like a warning.",
      },
    ],
    choices: [
      {
        text: "Say the kitchen specializes in them.",
        next: "coded_order",
        effects: {
          stats: { trust: 1, social_read: 1 },
          flags: { kept_cover_clean: true },
        },
        response: "Silver Veil almost laughs. It costs them something.",
      },
      {
        text: "Ask what kind of mistake they want.",
        next: "coded_order",
        effects: {
          stats: { logic: 1, risk: 1 },
          flags: { tested_drink_code: true },
        },
        response: "The veil turns toward you by one careful inch.",
      },
      {
        text: "Glance at the elevator reflection first.",
        next: "coded_order",
        effects: {
          stats: { social_read: 1 },
          flags: { noticed_chrome_reaction: true },
        },
        response: "Silver Veil notices you noticing the exit. Their shoulders drop by less than a breath.",
      },
    ],
  },

  coded_order: {
    type: "scene",
    title: "The Order",
    speaker: "Patron in Silver Veil",
    dialogue: "Whiskey Ramen. No egg. Static on the side.",
    text: paragraphs([
      "The order lands badly on purpose.",
      "The bartender stops polishing. Mara looks at the punch clock. The Singer changes keys without changing songs.",
      "Silver Veil keeps one hand flat on the table, as if the room might tip.",
    ]),
    reads: [
      "Codebook: Whiskey Ramen means a memory or source problem.",
      "Codebook: No egg means no second identity.",
      "Codebook: Static is never mixed in by accident. If it comes on the side, someone wants you to notice the line is compromised.",
    ],
    cards: [
      {
        name: "Silver Veil",
        mood: "Tense",
        read: "They look relieved when you do not laugh at the drink name.",
      },
      {
        name: "Mara",
        mood: "Still",
        read: "Her silence tells you the order is real.",
      },
    ],
    choices: [
      {
        text: "Write the order down exactly.",
        next: "chrome_reacts",
        effects: {
          stats: { logic: 1 },
          hidden: { venue_stability: 1 },
          flags: { served_code_clean: true },
        },
        response: "Your pen writes Whiskey Ramen like it is normal. The room appreciates the effort.",
      },
      {
        text: "Ask if they mean no broth instead.",
        next: "chrome_reacts",
        effects: {
          stats: { logic: 1, risk: 1, social_read: 1 },
          flags: { tested_drink_code: true },
        },
        response: "Silver Veil stills. No broth means the source is missing. They did not say that.",
      },
      {
        text: "Look around before responding.",
        next: "chrome_reacts",
        effects: {
          stats: { social_read: 2 },
          flags: { noticed_chrome_reaction: true },
        },
        response: "Jules is not here yet, but someone has already left two civilian seats open near the aisle.",
      },
    ],
  },

  chrome_reacts: {
    type: "scene",
    title: "Nia and Jules",
    text: paragraphs([
      "The elevator opens on a civilian couple dressed for a secret they think is cute.",
      "Nia is bright-eyed, already in love with the idea of the place. Jules stays half a step behind her, reading the room faster than they want to.",
      "Nia points at the handwritten menu. I'll have the ramen whiskey thing. That sounds disgusting in a brave way.",
    ]),
    speaker: "Jules",
    dialogue: "Could we maybe not order something that sounds like a dare?",
    reads: [
      "Nia Mood: Excited. Trying to seem brave.",
      "Jules Mood: Nervous. More perceptive than Nia knows.",
      "Problem: There are about to be two Whiskey Ramen orders in the same room.",
    ],
    cards: [
      {
        name: "Nia",
        mood: "Excited",
        read: "She thinks the danger is atmosphere.",
      },
      {
        name: "Jules",
        mood: "Uneasy",
        read: "They notice the room go quiet around the joke.",
      },
      {
        name: "Silver Veil",
        mood: "Alarmed",
        read: "They do not look at Nia. That is how you know they heard her.",
      },
    ],
    choices: [
      {
        text: "Warn Nia that the drink is not for first dates.",
        next: "veil_break",
        effects: {
          stats: { mercy: 1, risk: 1 },
          hidden: { civilian_safety: 1 },
          flags: { jules_warned: true },
        },
        response: "Nia laughs because she thinks you are joking. Jules does not.",
      },
      {
        text: "Take the order like it is harmless and watch the room.",
        next: "veil_break",
        effects: {
          stats: { social_read: 1, logic: 1 },
          flags: { wrong_glass_watched: true },
        },
        response: "Nia beams. Silver Veil's hand closes before they can stop it.",
      },
      {
        text: "Ask Jules what they want instead.",
        next: "veil_break",
        effects: {
          stats: { social_read: 1, mercy: 1 },
          hidden: { civilian_safety: 1 },
          flags: { jules_warned: true },
        },
        response: "Jules says water too quickly. They are not thirsty. They want a reason to leave.",
      },
    ],
  },

  veil_break: {
    type: "scene",
    title: "Two Similar Drinks",
    text: paragraphs([
      "Two tickets print almost together.",
      "WHISKEY RAMEN / NO EGG / STATIC ON THE SIDE",
      "WHISKEY RAMEN / MAKE IT CUTE",
      "The bartender sets two glasses on the rail. One carries the real signal. One carries a civilian dare. They look similar enough to ruin someone.",
    ]),
    reads: [
      "Wrong-Glass Problem: The room knows only one drink was meant as a signal.",
      "Civilian Risk: Nia does not know she just copied a distress call.",
    ],
    cards: [
      {
        name: "Mara",
        mood: "Warning",
        read: "She does not point. She looks at the glasses, then at you.",
      },
      {
        name: "Nia",
        mood: "Delighted",
        read: "She is taking a picture of the menu, not the room.",
      },
      {
        name: "Jules",
        mood: "Watching",
        read: "They know the silence is not part of the theme.",
      },
    ],
    choices: [
      {
        text: "Take two limited reads before serving.",
        next: "snoop_menu",
      },
    ],
  },

  snoop_menu: {
    type: "snoopMenu",
    title: "Read the Wrong Glasses",
    text: "Choose what to inspect or interrupt. You have time for two reads before the drinks leave the rail.",
    cards: [
      {
        name: "Silver Veil",
        mood: "Frightened",
        read: "They need the real signal to stay theirs.",
      },
      {
        name: "Nia",
        mood: "Oblivious",
        read: "She is still trying to make the night fun.",
      },
      {
        name: "Jules",
        mood: "Alert",
        read: "They know the joke has stopped being a joke.",
      },
    ],
    options: [
      {
        text: "Inspect Silver Veil's glass",
        response: "The real Whiskey Ramen has static served in a tiny side coupe. The liquid crackles only when Silver Veil looks away.",
        effects: {
          stats: { logic: 1 },
          flags: { found_glass_residue: true },
        },
      },
      {
        text: "Inspect Nia's glass",
        response: "Nia's version has a candy egg on the rim. Cute. Wrong. Someone could still mistake it from across the room.",
        effects: {
          stats: { logic: 1, mercy: 1 },
          flags: { wrong_glass_corrected: true },
        },
      },
      {
        text: "Read Silver Veil",
        response: "Silver Veil says nothing, but their knuckles go pale when Nia laughs at the drink name.",
        effects: {
          stats: { social_read: 2 },
          flags: { silver_veil_protected: true },
        },
      },
      {
        text: "Read Nia and Jules",
        response: "Nia is thrilled. Jules has stopped trying to be polite about wanting to leave.",
        effects: {
          stats: { mercy: 1, social_read: 1 },
          hidden: { civilian_safety: 1 },
          flags: { jules_warned: true },
        },
      },
      {
        text: "Ask Mara with your eyes",
        response: "Mara taps the rail once. Serve the signal if you must. Protect the civilians if you can. Do not confuse the two.",
        effects: {
          stats: { trust: 1, social_read: 1 },
          hidden: { house_trust: 1 },
          flags: { asked_host_about_veil: true },
        },
      },
      {
        text: "Listen to the Singer",
        response: "The Singer changes the lyric: one bowl feeds a ghost, one bowl feeds a joke. Nia hums along. Jules does not.",
        effects: {
          stats: { social_read: 2 },
          flags: { singer_warning_heard: true },
        },
      },
      {
        text: "Swap the tray positions now",
        response: "You turn the tray without touching either drink. From the floor, the glasses no longer rhyme.",
        effects: {
          stats: { logic: 1, mercy: 1 },
          hidden: { civilian_safety: 1 },
          flags: { wrong_glass_corrected: true, whiskey_signal_altered: true },
        },
      },
      {
        text: "Do not interfere yet",
        response: "You let the glasses sit a little longer. The first person to panic is Jules.",
        effects: {
          stats: { risk: 1, social_read: 1 },
          hidden: { heat: 1 },
          flags: { wrong_glass_watched: true },
        },
        endSnooping: true,
      },
    ],
    nextWhenDone: "veil_returns",
  },

  veil_returns: {
    type: "scene",
    title: "The Room Stops Pretending",
    speaker: "Jules",
    dialogue: "Nia. I think we should not drink the joke.",
    text: paragraphs([
      "The two Whiskey Ramen glasses wait on the rail.",
      "Silver Veil watches one. Nia reaches for the other. Jules reaches for Nia.",
      "For one clean second, everyone in the room knows there is a wrong glass and a worse way to fix it.",
    ]),
    reads: [
      "Nia Mood: Embarrassed now, which is safer than brave.",
      "Jules Mood: Afraid, but present.",
      "Silver Veil Mood: Waiting to see whether you protect the signal, the house, or the civilians.",
    ],
    cards: [
      {
        name: "Nia",
        mood: "Embarrassed",
        read: "Her laugh arrives too late and leaves early.",
      },
      {
        name: "Jules",
        mood: "Protective",
        read: "They put one hand between Nia and the glass without making a scene.",
      },
      {
        name: "Silver Veil",
        mood: "Afraid",
        read: "They watch the civilian glass like it might accuse them.",
      },
    ],
    choices: [
      {
        text: "Make the civilian glass visibly harmless.",
        next: "host_signal",
        effects: {
          stats: { mercy: 1, logic: 1 },
          hidden: { civilian_safety: 1, venue_stability: 1 },
          flags: { wrong_glass_corrected: true, nia_protected: true },
        },
        response: "You add the candy egg to Nia's glass and move the static coupe away. The room gets the message without Nia needing to.",
      },
      {
        text: "Let the glasses remain similar and watch who moves first.",
        next: "host_signal",
        effects: {
          stats: { logic: 1, risk: 1, social_read: 1 },
          hidden: { heat: 1 },
          flags: { wrong_glass_watched: true },
        },
        response: "Jules moves before Silver Veil does. That tells you who noticed danger without understanding it.",
      },
      {
        text: "Warn Jules directly, under the music.",
        next: "host_signal",
        effects: {
          stats: { mercy: 1, risk: 1, trust: 1 },
          hidden: { civilian_safety: 1, civilian_exposure: 1 },
          flags: { jules_warned: true, nia_protected: true },
        },
        response: "Jules believes you immediately. That is useful and dangerous.",
      },
    ],
  },

  host_signal: {
    type: "scene",
    title: "Mara's Look",
    text: paragraphs([
      "Mara slides a clean bar towel toward you.",
      "No words. Just the towel, the two glasses, and her eyes moving once from Silver Veil to Nia.",
      "Serve. Alter. Delay. Refuse.",
      "The whole job, folded into four verbs.",
    ]),
    reads: [
      "Mara Mood: Letting you choose the cost.",
      "Final Read: The real signal matters. So does the person who copied it by accident.",
    ],
    cards: [
      {
        name: "Mara",
        mood: "Still",
        read: "She will not rescue the decision from you.",
      },
      {
        name: "Silver Veil",
        mood: "Waiting",
        read: "They need the code to land, but not on Nia.",
      },
      {
        name: "Nia and Jules",
        mood: "Too Close",
        read: "One is embarrassed. One is scared. Neither knows the whole shape of why.",
      },
    ],
    choices: [
      {
        text: "Make the final pour.",
        next: "final_decision",
      },
    ],
  },

  final_decision: {
    type: "scene",
    title: "Last Call: Whiskey Ramen",
    text: "The shift has narrowed to two ugly-funny drinks, one frightened signal, and two civilians who do not know how close they are to the story.",
    reads: [
      "Spy Question: Which drink is the real signal?",
      "Human Question: Do you protect someone who does not know they are in danger?",
      "House Mood: Watching what kind of bartender you become.",
    ],
    cards: [
      {
        name: "Silver Veil",
        mood: "Frightened",
        read: "They came for a compromised signal and found a civilian standing inside it.",
      },
      {
        name: "Nia",
        mood: "Small",
        read: "She wants the joke to become funny again.",
      },
      {
        name: "Jules",
        mood: "Ready",
        read: "They will believe a warning faster than a reassurance.",
      },
    ],
    choices: [
      {
        text: "Serve - give Silver Veil the real Whiskey Ramen and Nia the harmless copy.",
        next: "result_veil",
        effects: {
          stats: { trust: 2, logic: 1 },
          hidden: { patron_trust: 1, venue_stability: 1 },
          flags: { silver_signal_served: true, nia_protected: true },
        },
      },
      {
        text: "Alter - mark Nia's drink so no one can mistake it for the signal.",
        next: "result_chrome",
        effects: {
          stats: { mercy: 1, logic: 1, social_read: 1 },
          hidden: { civilian_safety: 2, house_trust: 1 },
          flags: { whiskey_signal_altered: true, wrong_glass_corrected: true, nia_protected: true },
        },
      },
      {
        text: "Delay - hold both drinks and let the room reveal who panics.",
        next: "result_hidden",
        effects: {
          stats: { social_read: 2, risk: 1 },
          hidden: { heat: 1, civilian_safety: 1 },
          flags: { whiskey_signal_delayed: true, wrong_glass_watched: true },
        },
      },
      {
        text: "Refuse - spill the Whiskey Ramen and cut the signal off.",
        next: "result_dissolved",
        effects: {
          stats: { independence: 2, risk: 1, mercy: 1 },
          hidden: { house_trust: -1, civilian_safety: 2, heat: 1 },
          flags: { whiskey_signal_refused: true, nia_protected: true },
        },
      },
    ],
  },

  result_veil: {
    type: "result",
    endingLabel: "The Safe Pour",
    text: paragraphs([
      "Silver Veil receives the real Whiskey Ramen. Static on the side. No egg.",
      "Nia gets the harmless copy and decides it tastes like a dare losing confidence.",
      "Jules keeps watching you after they leave, like they know you saved them from a story they never got to read.",
      "Mara prints the tab without comment. That is how she says acceptable.",
    ]),
    next: "receipt_debrief",
  },

  result_chrome: {
    type: "result",
    endingLabel: "Quiet Redirect",
    text: paragraphs([
      "You change Nia's glass with a candy egg, a paper umbrella, and enough color to make it visibly civilian.",
      "The room understands. Nia only thinks you upgraded the joke.",
      "Silver Veil's signal lands where it was meant to. The civilians leave with a story about a weird drink and nothing more expensive.",
    ]),
    next: "receipt_debrief",
  },

  result_hidden: {
    type: "result",
    endingLabel: "Static Hold",
    text: paragraphs([
      "You hold both drinks long enough for the room to show its hands.",
      "Jules moves first. Silver Veil moves second. Mara moves last, which means she already knew what she wanted you to learn.",
      "The signal is delayed, not lost. Nia leaves shaken by the mood, not the truth.",
    ]),
    next: "receipt_debrief",
  },

  result_dissolved: {
    type: "result",
    endingLabel: "Cut Glass",
    text: paragraphs([
      "The Whiskey Ramen hits the floor and becomes everyone else's problem.",
      "Nia gasps. Jules pulls her back. Silver Veil goes very still.",
      "No compromised signal leaves in the wrong glass. No clean signal leaves at all.",
      "Mara marks the receipt with one word: costly.",
    ]),
    next: "receipt_debrief",
  },

  shift2_clocked: {
    type: "punchcard",
    title: "12:07 AM",
    text: paragraphs([
      "SHIFT 02",
      "CLOCKED IN",
      "The punch clock bites the card again. This time it hesitates first.",
    ]),
    reads: [
      "Punchcard: Active.",
      "House Mood: Less curious now. More interested.",
    ],
    choices: [
      {
        text: "Enter the floor.",
        next: "shift2_opening",
      },
    ],
  },

  shift2_opening: {
    type: "scene",
    title: "The Glass Orchid",
    text: paragraphs([
      "The lounge has been polished too hard.",
      "Every chrome edge reflects a new elevator ad: HARMONY KEEPS GOOD PEOPLE SAFE.",
      "Mara peels the ad off the glass with two fingers and drops it behind the bar like it might stain.",
    ]),
    speaker: "Mara",
    dialogue: "Tonight, if someone smiles for a camera, ask who taught them to.",
    reads: [
      "Shift Title: The Glass Orchid.",
      "Room Read: The word Harmony makes the staff go professionally still.",
      "Codebook: Glass Orchid usually means a beautiful thing made to survive inspection.",
    ],
    cards: [
      {
        name: "Mara",
        mood: "Flat",
        read: "She dislikes the Harmony slogan more than she wants you to notice.",
      },
    ],
    choices: [
      {
        text: "Begin second service.",
        next: "shift2_patron_intro",
        effects: {
          flags: { harmony_slogan_seen: true },
          hidden: { harmony_attention: 1 },
        },
      },
    ],
  },

  shift2_patron_intro: {
    type: "scene",
    title: "Vesper Bloom",
    text: paragraphs([
      "A patron in a white coat takes the narrow booth beneath the fake orchids.",
      "They remove one glove, then put it back on, as if their own hand surprised them.",
      "Their eyes keep catching on the Harmony slogan reflected in the elevator doors.",
    ]),
    speaker: "Vesper Bloom",
    dialogue: "Do you keep flowers cold here?",
    reads: [
      "Vesper Mood: Polite terror.",
      "Body Read: They fear the slogan more than the room.",
    ],
    cards: [
      {
        name: "Vesper Bloom",
        mood: "Composed",
        read: "Their voice is smooth. Their hands are not invited to the performance.",
      },
      {
        name: "Mara",
        mood: "Listening",
        read: "She hears the code before the order arrives.",
      },
    ],
    choices: [
      {
        text: "Say the house chills delicate things.",
        next: "shift2_coded_order",
        effects: {
          stats: { trust: 1, social_read: 1 },
          hidden: { house_trust: 1 },
        },
        response: "Vesper breathes like you opened a door without touching it.",
      },
      {
        text: "Ask whether the stem is broken.",
        next: "shift2_coded_order",
        effects: {
          stats: { logic: 1, risk: 1 },
          flags: { tested_drink_code: true },
        },
        response: "Vesper's eyes flash once. Too much recognition, too quickly hidden.",
      },
      {
        text: "Wipe the Harmony reflection off the rail first.",
        next: "shift2_coded_order",
        effects: {
          stats: { mercy: 1, independence: 1 },
          flags: { harmony_slogan_seen: true },
        },
        response: "Mara sees the gesture and says nothing. Vesper sees it and almost sits down twice.",
      },
    ],
  },

  shift2_coded_order: {
    type: "scene",
    title: "The Flower Order",
    speaker: "Vesper Bloom",
    dialogue: "Glass Orchid. Stem snapped. House ice.",
    text: paragraphs([
      "The order is pretty enough that the tourists would buy it on a tote bag.",
      "Mara sets one frosted coupe on the rail. The Singer lowers the key until the room feels underwater.",
      "Vesper looks at the glass flower garnish like it might testify.",
    ]),
    reads: [
      "Codebook: Glass Orchid means evidence hidden inside something decorative.",
      "Codebook: Stem snapped means the handler chain is broken.",
      "Codebook: House ice means preserve it here. Do not warm it with attention.",
    ],
    cards: [
      {
        name: "Vesper Bloom",
        mood: "Careful",
        read: "They are asking for help without saying the word help.",
      },
      {
        name: "The Singer",
        mood: "Quiet",
        read: "They make the room sound softer than it is.",
      },
    ],
    choices: [
      {
        text: "Write the flower order exactly.",
        next: "shift2_civilians_enter",
        effects: {
          stats: { logic: 1 },
          hidden: { venue_stability: 1 },
        },
        response: "The ticket prints clean. Vesper looks grateful and ashamed of needing that.",
      },
      {
        text: "Ask if the orchid should bloom open.",
        next: "shift2_civilians_enter",
        effects: {
          stats: { logic: 1, risk: 1 },
          flags: { found_orchid_frost: true },
        },
        response: "Vesper shakes their head too fast. Open means public. They did not ask for public.",
      },
      {
        text: "Watch who reacts to House ice.",
        next: "shift2_civilians_enter",
        effects: {
          stats: { social_read: 2 },
          flags: { orchid_watched: true },
        },
        response: "Mara stills. A booth near the elevator stops laughing one beat late.",
      },
    ],
  },

  shift2_civilians_enter: {
    type: "scene",
    title: "Camera Night",
    text: paragraphs([
      "The elevator opens on Anika already filming.",
      "She is rich enough to think rules are decor and nervous enough to narrate over them.",
      "Behind her, Dom steps out in a delivery jacket, holding a cheap glass orchid wrapped in plastic and trying not to fall asleep standing up.",
    ]),
    speaker: "Anika",
    dialogue: "Tell me that glass flower drink is real. My followers are going to be unbearable about this place.",
    reads: [
      "Anika Mood: Dazzled. Performing bravery for a lens.",
      "Dom Mood: Exhausted. Carrying the wrong object into the right room.",
      "Problem: The real signal, the filmed drink, and Dom's cheap orchid are starting to rhyme.",
    ],
    cards: [
      {
        name: "Anika",
        mood: "Bright",
        read: "She points the camera where the room is most afraid.",
      },
      {
        name: "Dom",
        mood: "Spent",
        read: "They are not part of the code. That may not protect them.",
      },
      {
        name: "Vesper Bloom",
        mood: "Tight",
        read: "They look at the camera before the drink.",
      },
    ],
    choices: [
      {
        text: "Tell Anika the flower drink is off-menu.",
        next: "shift2_confusion",
        effects: {
          stats: { mercy: 1, risk: 1 },
          flags: { anika_redirected: true },
          hidden: { civilian_safety: 1 },
        },
        response: "Anika grins like off-menu means premium. Dom looks relieved for half a second.",
      },
      {
        text: "Ask Dom who the orchid is for.",
        next: "shift2_confusion",
        effects: {
          stats: { social_read: 1, mercy: 1 },
          flags: { dom_is_civilian: true },
        },
        response: "Dom blinks at the label. The name has been smudged by elevator mist.",
      },
      {
        text: "Let the camera keep rolling and watch the room.",
        next: "shift2_confusion",
        effects: {
          stats: { risk: 1, social_read: 1 },
          flags: { anika_recording_seen: true },
          hidden: { civilian_exposure: 1, harmony_attention: 1 },
        },
        response: "Anika catches the Harmony slogan in the reflection. Three people notice. She is not one of them.",
      },
    ],
  },

  shift2_confusion: {
    type: "scene",
    title: "Three Flowers",
    text: paragraphs([
      "Mara sets the Glass Orchid on the rail.",
      "Vesper's frosted garnish holds a tiny white line inside the stem.",
      "Anika's camera loves it. Dom's cheap plastic orchid looks close enough from across the room to ruin a stranger.",
    ]),
    reads: [
      "Wrong-Object Problem: There are three flowers in play and only one is the signal.",
      "Civilian Risk: Anika can make the signal public. Dom can carry the wrong flower to the wrong booth.",
    ],
    cards: [
      {
        name: "Mara",
        mood: "Warning",
        read: "She watches the camera, then Dom's hands, then you.",
      },
      {
        name: "Anika",
        mood: "Delighted",
        read: "She thinks a secret is a backdrop.",
      },
      {
        name: "Dom",
        mood: "Worn Thin",
        read: "They just want to finish the delivery and go home.",
      },
      {
        name: "Vesper Bloom",
        mood: "Pinned",
        read: "The camera makes them smaller without touching them.",
      },
    ],
    choices: [
      {
        text: "Take two limited reads before serving.",
        next: "shift2_snoop_menu",
      },
    ],
  },

  shift2_snoop_menu: {
    type: "snoopMenu",
    title: "Read the Three Flowers",
    text: "Choose what to inspect or interrupt. You have time for two reads before the camera makes the room permanent.",
    cards: [
      {
        name: "Vesper Bloom",
        mood: "Cornered",
        read: "They need the flower preserved, not admired.",
      },
      {
        name: "Anika",
        mood: "Live",
        read: "Her smile is for the camera. Her fear has not arrived yet.",
      },
      {
        name: "Dom",
        mood: "Half-Awake",
        read: "They are holding a prop the room might punish.",
      },
    ],
    options: [
      {
        text: "Inspect Vesper's glass orchid",
        response: "The real garnish is hollow. Frost gathers inside the stem around a white thread of data.",
        effects: {
          stats: { logic: 1 },
          flags: { found_orchid_frost: true },
        },
      },
      {
        text: "Check Anika's recording angle",
        response: "The clip caught Vesper's face, the Harmony slogan, and Dom's cheap orchid in one beautiful dangerous frame.",
        effects: {
          stats: { logic: 1, social_read: 1 },
          hidden: { civilian_exposure: 1, harmony_attention: 1 },
          flags: { anika_recording_seen: true },
        },
      },
      {
        text: "Read Dom",
        response: "Dom is not an agent. They are a night worker with bad shoes and a delivery app that stopped showing the apartment number.",
        effects: {
          stats: { mercy: 1, social_read: 1 },
          flags: { dom_is_civilian: true },
        },
      },
      {
        text: "Ask Mara with your eyes",
        response: "Mara taps the ice well twice. Preserve the flower. Break the frame. Keep the civilian out of the arrangement.",
        effects: {
          stats: { trust: 1, social_read: 1 },
          hidden: { house_trust: 1 },
          flags: { mara_orchid_warning: true },
        },
      },
      {
        text: "Listen to the Singer",
        response: "The Singer changes one lyric: flowers break louder on film. Anika calls it cinematic.",
        effects: {
          stats: { social_read: 2 },
          flags: { singer_orchid_warning: true },
        },
      },
      {
        text: "Move the camera angle with a tray flourish",
        response: "You pass between Anika's lens and Vesper at the exact wrong-perfect time. The clip becomes neon, hands, and no useful face.",
        effects: {
          stats: { social_read: 1, mercy: 1 },
          hidden: { civilian_safety: 1, civilian_exposure: -1 },
          flags: { orchid_camera_blurred: true, anika_redirected: true },
        },
      },
      {
        text: "Hide Dom's orchid behind the bar",
        response: "Dom lets you take the cheap flower because exhaustion trusts confidence. The wrong object leaves the room's attention.",
        effects: {
          stats: { mercy: 1, logic: 1 },
          hidden: { civilian_safety: 1 },
          flags: { dom_protected: true, dom_is_civilian: true },
        },
      },
      {
        text: "Do not interfere yet",
        response: "You let all three flowers stay visible. The first person to reach for anything is not Vesper.",
        effects: {
          stats: { risk: 1, social_read: 1 },
          hidden: { heat: 1, harmony_attention: 1 },
          flags: { orchid_watched: true },
        },
        endSnooping: true,
      },
    ],
    nextWhenDone: "shift2_convergence",
  },

  shift2_convergence: {
    type: "scene",
    title: "The Clip Wants a Witness",
    speaker: "Dom",
    dialogue: "I think this flower is for somebody down here. I just need a name.",
    text: paragraphs([
      "Anika angles her camera for the prettiest possible danger.",
      "Dom steps toward Vesper's booth with the cheap orchid held out like an apology.",
      "Vesper looks ready to disappear through the upholstery.",
    ]),
    reads: [
      "Anika Mood: Excited, but not cruel.",
      "Dom Mood: Lost in public.",
      "Vesper Mood: One wrong name away from running.",
    ],
    cards: [
      {
        name: "Anika",
        mood: "Recording",
        read: "She will post before she understands what she filmed.",
      },
      {
        name: "Dom",
        mood: "Vulnerable",
        read: "They have become useful to people who have not met them.",
      },
      {
        name: "Vesper Bloom",
        mood: "Afraid",
        read: "They are protecting the evidence and hating it for needing protection.",
      },
    ],
    choices: [
      {
        text: "Give Dom a fake bar task behind the rail.",
        next: "shift2_host_signal",
        effects: {
          stats: { mercy: 1, logic: 1 },
          hidden: { civilian_safety: 1, venue_stability: 1 },
          flags: { dom_protected: true, dom_is_civilian: true },
        },
        response: "Dom follows the instruction because it sounds like work. Sometimes safety wears an apron.",
      },
      {
        text: "Redirect Anika toward a harmless flaming dessert.",
        next: "shift2_host_signal",
        effects: {
          stats: { social_read: 1, mercy: 1 },
          hidden: { civilian_safety: 1, civilian_exposure: -1 },
          flags: { anika_redirected: true, orchid_camera_blurred: true },
        },
        response: "Anika gasps at the flame. The room exhales because attention is movable after all.",
      },
      {
        text: "Let the clip keep running and watch who reaches.",
        next: "shift2_host_signal",
        effects: {
          stats: { risk: 1, logic: 1, social_read: 1 },
          hidden: { heat: 1, harmony_attention: 1 },
          flags: { orchid_watched: true, anika_recording_seen: true },
        },
        response: "A quiet patron near the elevator reaches for their cuff, not their drink. Vesper sees it too.",
      },
    ],
  },

  shift2_host_signal: {
    type: "scene",
    title: "Mara's Ice Well",
    text: paragraphs([
      "Mara slides open the ice well.",
      "The Glass Orchid waits beside it, cold and delicate and carrying something that does not want to be beautiful.",
      "Serve. Alter. Delay. Refuse.",
      "The verbs feel older on the second night.",
    ]),
    reads: [
      "Mara Mood: Trusting you with the expensive kind of mistake.",
      "Final Read: Vesper needs preservation. Anika needs redirection. Dom needs to stop being useful.",
    ],
    cards: [
      {
        name: "Mara",
        mood: "Grave",
        read: "Her look says House ice is not a garnish.",
      },
      {
        name: "Vesper Bloom",
        mood: "Waiting",
        read: "They came with evidence and found an audience.",
      },
      {
        name: "Anika and Dom",
        mood: "Too Visible",
        read: "One is filming danger. One is carrying a decoy. Neither ordered the cost.",
      },
    ],
    choices: [
      {
        text: "Make the final flower.",
        next: "shift2_final_decision",
      },
    ],
  },

  shift2_final_decision: {
    type: "scene",
    title: "Last Call: The Glass Orchid",
    text: "The shift has narrowed to one frozen signal, one camera, one exhausted civilian, and a slogan pretending safety is the same as permission.",
    reads: [
      "Spy Question: Which flower carries the evidence?",
      "Human Question: Who gets protected from becoming proof?",
      "House Mood: Watching whether your mercy can stay quiet.",
    ],
    cards: [
      {
        name: "Vesper Bloom",
        mood: "Frightened",
        read: "They need the evidence preserved without turning themselves into evidence.",
      },
      {
        name: "Anika",
        mood: "Almost Aware",
        read: "She knows the room changed. She does not know she helped change it.",
      },
      {
        name: "Dom",
        mood: "Tired",
        read: "They are one wrong delivery away from being remembered by the wrong people.",
      },
    ],
    choices: [
      {
        text: "Serve - preserve Vesper's Glass Orchid on House ice.",
        next: "result_orchid_served",
        effects: {
          stats: { trust: 2, logic: 1 },
          hidden: { house_trust: 1, patron_trust: 1, venue_stability: 1 },
          flags: { orchid_signal_served: true },
        },
      },
      {
        text: "Alter - swap in a harmless sugar-glass flower for the camera.",
        next: "result_orchid_altered",
        effects: {
          stats: { mercy: 1, logic: 1, social_read: 1 },
          hidden: { civilian_safety: 2, house_trust: 1, civilian_exposure: -1 },
          flags: { orchid_signal_altered: true, orchid_camera_blurred: true, anika_redirected: true, dom_protected: true },
        },
      },
      {
        text: "Delay - hold the orchid until the watcher moves first.",
        next: "result_orchid_delayed",
        effects: {
          stats: { social_read: 2, risk: 1 },
          hidden: { heat: 1, harmony_attention: 1, civilian_safety: 1 },
          flags: { orchid_signal_delayed: true, orchid_watched: true },
        },
      },
      {
        text: "Refuse - shatter the flower and cut the lights.",
        next: "result_orchid_refused",
        effects: {
          stats: { independence: 2, mercy: 1, risk: 1 },
          hidden: { house_trust: -1, civilian_safety: 2, heat: 1 },
          flags: { orchid_signal_refused: true, dom_protected: true, anika_redirected: true },
        },
      },
    ],
  },

  result_orchid_served: {
    type: "result",
    endingLabel: "Cold Bloom",
    text: paragraphs([
      "Vesper receives the real Glass Orchid on House ice.",
      "The evidence stays cold. The signal reaches the house clean enough to matter.",
      "Anika leaves with a gorgeous useless clip. Dom leaves with a new delivery label written in Mara's hand.",
      "On the elevator screen, Harmony smiles in a font designed by someone who has never apologized.",
    ]),
    next: "receipt_debrief",
  },

  result_orchid_altered: {
    type: "result",
    endingLabel: "False Flower",
    text: paragraphs([
      "You give the camera a sugar-glass flower bright enough to love and empty enough to survive being posted.",
      "Vesper's real orchid disappears into the ice well without a flash.",
      "Anika gets content. Dom gets out. The house gets evidence with fewer fingerprints than expected.",
    ]),
    next: "receipt_debrief",
  },

  result_orchid_delayed: {
    type: "result",
    endingLabel: "Held Bloom",
    text: paragraphs([
      "You hold the Glass Orchid until the room cannot stand its own reflection.",
      "The watcher near the elevator reaches first. Mara remembers the hand. Vesper remembers the mercy.",
      "Anika's clip catches mostly silence, which is more dangerous than she knows.",
    ]),
    next: "receipt_debrief",
  },

  result_orchid_refused: {
    type: "result",
    endingLabel: "Shattered Stem",
    text: paragraphs([
      "The Glass Orchid breaks in your towel-covered hand.",
      "The lights cut. The camera loses the room. Dom drops the cheap flower and says sorry to the dark.",
      "No evidence leaves public. No evidence arrives clean.",
      "Mara writes the tab herself this time. Her handwriting is colder than the ice.",
    ]),
    next: "receipt_debrief",
  },

  shift3_clocked: {
    type: "punchcard",
    title: "12:07 AM",
    text: paragraphs([
      "SHIFT 03",
      "CLOCKED IN",
      "The punch clock prints the time, pauses, and prints it again one line lower.",
    ]),
    reads: [
      "Punchcard: Active.",
      "House Mood: Quiet enough to hear the printer think.",
    ],
    choices: [
      {
        text: "Enter the floor.",
        next: "shift3_opening",
      },
    ],
  },

  shift3_opening: {
    type: "scene",
    title: "The Memory Tab",
    text: paragraphs([
      "The bar has a new stack of receipt paper, cream-white and too clean.",
      "The elevator screen cycles a Harmony message in a polite blue loop: NOTHING GOOD GETS LOST.",
      "Mara turns the screen off with the back of her knuckle. It turns itself on again.",
    ]),
    speaker: "Mara",
    dialogue: "Tonight, if a receipt remembers someone better than they remember themselves, do not trust either one alone.",
    reads: [
      "Shift Title: The Memory Tab.",
      "Room Read: Harmony's safety language has moved from slogans to records.",
      "Codebook: A Memory Tab is not nostalgia. It is proof with teeth.",
    ],
    cards: [
      {
        name: "Mara",
        mood: "Tired",
        read: "She watches the receipt printer like it might say her name.",
      },
    ],
    choices: [
      {
        text: "Begin third service.",
        next: "shift3_patron_intro",
        effects: {
          flags: { memory_audit_mentioned: true },
          hidden: { harmony_attention: 1 },
        },
      },
    ],
  },

  shift3_patron_intro: {
    type: "scene",
    title: "Sable Wren",
    text: paragraphs([
      "A patron in a dark green coat sits where the light refuses to settle.",
      "They place a coin on the counter, then another identical coin on top of it.",
      "Their left eye is red from crying. Their right eye is dry enough to be a lie.",
    ]),
    speaker: "Sable Wren",
    dialogue: "Can the house reopen a tab it already closed?",
    reads: [
      "Sable Mood: Controlled grief.",
      "Body Read: They keep touching their temple when the printer wakes.",
    ],
    cards: [
      {
        name: "Sable Wren",
        mood: "Contained",
        read: "They are not afraid of remembering. They are afraid of being the only one who does.",
      },
      {
        name: "Mara",
        mood: "Careful",
        read: "She does not like this order before it exists.",
      },
    ],
    choices: [
      {
        text: "Say the house keeps open tabs.",
        next: "shift3_coded_order",
        effects: {
          stats: { trust: 1, social_read: 1 },
          hidden: { house_trust: 1 },
        },
        response: "Sable's mouth moves like thank you. No sound comes with it.",
      },
      {
        text: "Ask who paid the first time.",
        next: "shift3_coded_order",
        effects: {
          stats: { logic: 1, risk: 1 },
          flags: { found_double_timestamp: true },
        },
        response: "Sable looks at the stacked coins. One of them is warmer than the other.",
      },
      {
        text: "Watch the printer before answering.",
        next: "shift3_coded_order",
        effects: {
          stats: { social_read: 1, independence: 1 },
          flags: { memory_watched: true },
        },
        response: "The printer clicks once, offended by your attention.",
      },
    ],
  },

  shift3_coded_order: {
    type: "scene",
    title: "The Closed Tab",
    speaker: "Sable Wren",
    dialogue: "Memory Tab. Paid twice. No receipt.",
    text: paragraphs([
      "The order makes the bar colder without changing the air.",
      "Mara stops moving. The Singer forgets one word and hums through the hole.",
      "The receipt printer chatters under the counter, then pretends it did not.",
    ]),
    reads: [
      "Codebook: Memory Tab means a record of what the room remembers.",
      "Codebook: Paid twice means two versions of the same night are charging rent.",
      "Codebook: No receipt means do not let the audit system keep a copy.",
    ],
    cards: [
      {
        name: "Sable Wren",
        mood: "Raw",
        read: "They need the truth preserved, but not necessarily exposed.",
      },
      {
        name: "The Singer",
        mood: "Interrupted",
        read: "They know the missing word and choose not to sing it.",
      },
    ],
    choices: [
      {
        text: "Write the tab down exactly.",
        next: "shift3_civilians_enter",
        effects: {
          stats: { logic: 1 },
          hidden: { venue_stability: 1 },
        },
        response: "The ink dries slower than it should. Sable watches it like a wound closing.",
      },
      {
        text: "Ask whether the second payment was voluntary.",
        next: "shift3_civilians_enter",
        effects: {
          stats: { logic: 1, social_read: 1, risk: 1 },
          flags: { found_double_timestamp: true },
        },
        response: "Sable closes their dry eye. The crying one stays open.",
      },
      {
        text: "Keep the order off paper and hold it in your head.",
        next: "shift3_civilians_enter",
        effects: {
          stats: { independence: 1, mercy: 1 },
          hidden: { harmony_attention: -1 },
          flags: { memory_receipt_redacted: true },
        },
        response: "Mara gives the smallest nod. The printer clicks like it has been insulted.",
      },
    ],
  },

  shift3_civilians_enter: {
    type: "scene",
    title: "Whatever I Had Last Time",
    text: paragraphs([
      "The elevator opens on Theo Park, exhausted, rain in their hair, a Sugar Shack receipt folded in one hand.",
      "Rook follows two steps behind, an oblivious regular with a grin that arrives before the truth does.",
      "Theo squints at the old receipt and points to the line they cannot remember ordering.",
    ]),
    speaker: "Theo Park",
    dialogue: "Can I get whatever I had last time? Apparently I loved it.",
    reads: [
      "Theo Mood: Tired and trying to be funny.",
      "Rook Mood: Too casual. Protecting something badly.",
      "Problem: Theo's old receipt matches Sable's Memory Tab.",
    ],
    cards: [
      {
        name: "Theo Park",
        mood: "Worn Out",
        read: "They joke about the missing night because the alternative is asking why it is missing.",
      },
      {
        name: "Rook",
        mood: "Bright",
        read: "Their cheer lands a half-second before everyone else's comfort.",
      },
      {
        name: "Sable Wren",
        mood: "Alarmed",
        read: "They know Theo's face. Theo does not know theirs.",
      },
    ],
    choices: [
      {
        text: "Tell Theo the last-time special is unavailable.",
        next: "shift3_confusion",
        effects: {
          stats: { mercy: 1, risk: 1 },
          hidden: { civilian_safety: 1 },
          flags: { theo_protected: true },
        },
        response: "Theo laughs because that is easier than asking why you look worried. Rook laughs too late.",
      },
      {
        text: "Ask Rook what Theo had last time.",
        next: "shift3_confusion",
        effects: {
          stats: { social_read: 1, logic: 1 },
          flags: { rook_lied_for_theo: true },
        },
        response: "Rook says something pink. Theo's receipt says something impossible.",
      },
      {
        text: "Take Theo's receipt and watch Sable.",
        next: "shift3_confusion",
        effects: {
          stats: { social_read: 1, logic: 1 },
          flags: { theo_receipt_seen: true },
        },
        response: "Sable stops breathing when your thumb covers the timestamp.",
      },
    ],
  },

  shift3_confusion: {
    type: "scene",
    title: "Two Tabs, One Night",
    text: paragraphs([
      "Sable's closed tab and Theo's old receipt sit on the rail.",
      "Both show 12:40 AM. Both are stamped PAID. Only one has a name, and the name has been burned almost white.",
      "The printer under the counter starts warming itself like an animal that smelled blood.",
    ]),
    reads: [
      "Wrong-Receipt Problem: Two tabs remember the same night differently.",
      "Civilian Risk: Theo may be safer without the missing memory, but Sable may not be safe unless someone preserves it.",
    ],
    cards: [
      {
        name: "Mara",
        mood: "Warning",
        read: "She looks at the printer, then at your hands.",
      },
      {
        name: "Theo Park",
        mood: "Uneasy",
        read: "The joke has stopped carrying them.",
      },
      {
        name: "Rook",
        mood: "Performing",
        read: "They are smiling hard enough to crack.",
      },
      {
        name: "Sable Wren",
        mood: "Pinned",
        read: "They want Theo to remember and fear what remembering will cost.",
      },
    ],
    choices: [
      {
        text: "Take two limited reads before serving.",
        next: "shift3_snoop_menu",
      },
    ],
  },

  shift3_snoop_menu: {
    type: "snoopMenu",
    title: "Read the Two Tabs",
    text: "Choose what to inspect or interrupt. You have time for two reads before the printer makes a permanent copy.",
    cards: [
      {
        name: "Sable Wren",
        mood: "Desperate",
        read: "They need a witness, not an audience.",
      },
      {
        name: "Theo Park",
        mood: "Shaken",
        read: "They are afraid of the missing night becoming theirs again.",
      },
      {
        name: "Rook",
        mood: "Strained",
        read: "Their lie is shaped like a blanket.",
      },
    ],
    options: [
      {
        text: "Inspect Sable's closed tab",
        response: "Two payments sit in the ink. One is Sable's. The other is marked with Theo's thumbprint and no consent line.",
        effects: {
          stats: { logic: 1 },
          flags: { found_double_timestamp: true },
        },
      },
      {
        text: "Inspect Theo's old receipt",
        response: "The receipt has been heat-erased, but the back still reads HARMONY MEMORY AUDIT in faint blue.",
        effects: {
          stats: { logic: 1, risk: 1 },
          hidden: { harmony_attention: 1 },
          flags: { theo_receipt_seen: true, elevator_audit_seen: true, memory_audit_mentioned: true },
        },
      },
      {
        text: "Read Theo",
        response: "Theo does not react to Sable's face. They react to the Singer's missing lyric before the Singer repeats it.",
        effects: {
          stats: { mercy: 1, social_read: 1 },
          flags: { theo_remembers_song: true },
        },
      },
      {
        text: "Read Rook",
        response: "Rook is lying. Not to trap Theo. To keep Theo from asking why they cried in the elevator last time.",
        effects: {
          stats: { social_read: 2 },
          flags: { rook_lied_for_theo: true },
        },
      },
      {
        text: "Ask Mara with your eyes",
        response: "Mara taps the printer tray closed. Truth can save a person. So can a closed door. Choose which one this is.",
        effects: {
          stats: { trust: 1, social_read: 1 },
          hidden: { house_trust: 1 },
          flags: { mara_memory_warning: true },
        },
      },
      {
        text: "Listen to the Singer",
        response: "The Singer restores the missing lyric softly. Theo mouths it with them, then looks scared of their own mouth.",
        effects: {
          stats: { social_read: 2 },
          flags: { singer_memory_warning: true, theo_remembers_song: true },
        },
      },
      {
        text: "Redact Theo's name from the receipt",
        response: "You pass a warm spoon under the old ink. The name disappears before the printer can learn it again.",
        effects: {
          stats: { mercy: 1, logic: 1 },
          hidden: { civilian_safety: 1, harmony_attention: -1 },
          flags: { memory_receipt_redacted: true, theo_protected: true },
        },
      },
      {
        text: "Do not interfere yet",
        response: "You let both tabs sit open. The printer warms. Rook reaches for Theo before Sable does.",
        effects: {
          stats: { risk: 1, social_read: 1 },
          hidden: { heat: 1, harmony_attention: 1 },
          flags: { memory_watched: true },
        },
        endSnooping: true,
      },
    ],
    nextWhenDone: "shift3_convergence",
  },

  shift3_convergence: {
    type: "scene",
    title: "The Printer Wants a Copy",
    speaker: "Rook",
    dialogue: "Theo, you do not have to know everything that happened to you to still be you.",
    text: paragraphs([
      "Theo looks at Rook like betrayal and relief arrived wearing the same coat.",
      "Sable flinches. The receipt printer starts to hum louder under the bar.",
      "The missing night is no longer missing. It is waiting to see who claims it.",
    ]),
    reads: [
      "Theo Mood: Frightened of needing the truth.",
      "Rook Mood: Protective, but not clean.",
      "Sable Mood: Needing proof and hating the need.",
    ],
    cards: [
      {
        name: "Theo Park",
        mood: "Fractured",
        read: "They want agency more than comfort, but comfort is closer.",
      },
      {
        name: "Rook",
        mood: "Protective",
        read: "Their lie tried to be kindness and may still have cut.",
      },
      {
        name: "Sable Wren",
        mood: "Bare",
        read: "They cannot survive being the only witness much longer.",
      },
    ],
    choices: [
      {
        text: "Give Theo the choice before the tab opens.",
        next: "shift3_host_signal",
        effects: {
          stats: { mercy: 1, trust: 1 },
          hidden: { civilian_safety: 1 },
          flags: { theo_protected: true },
        },
        response: "Theo says yes and no in the same breath. You wait for the word that belongs to them.",
      },
      {
        text: "Call out Rook's lie gently.",
        next: "shift3_host_signal",
        effects: {
          stats: { social_read: 1, risk: 1 },
          flags: { rook_called_out: true, rook_lied_for_theo: true },
        },
        response: "Rook stops smiling. Theo stops looking alone.",
      },
      {
        text: "Let the printer keep warming and watch who panics.",
        next: "shift3_host_signal",
        effects: {
          stats: { logic: 1, risk: 1, social_read: 1 },
          hidden: { heat: 1, harmony_attention: 1 },
          flags: { memory_watched: true },
        },
        response: "The printer panics first. That is the most honest thing in the room.",
      },
    ],
  },

  shift3_host_signal: {
    type: "scene",
    title: "Mara's Printer Tray",
    text: paragraphs([
      "Mara slides the receipt tray shut with one finger.",
      "The two tabs wait beside it: one asking to remember, one begging not to become a file.",
      "Serve. Alter. Delay. Refuse.",
      "The verbs feel crueler when the drink is a missing night.",
    ]),
    reads: [
      "Mara Mood: Letting you choose whether truth needs a witness, a veil, time, or a grave.",
      "Final Read: Sable needs proof. Theo needs agency. Rook needs to stop deciding for Theo.",
    ],
    cards: [
      {
        name: "Mara",
        mood: "Still",
        read: "She will not call any answer clean.",
      },
      {
        name: "Sable Wren",
        mood: "Waiting",
        read: "They are asking the room to remember without making Theo a specimen.",
      },
      {
        name: "Theo and Rook",
        mood: "Too Human",
        read: "One forgot. One lied. Both were trying to survive the same night.",
      },
    ],
    choices: [
      {
        text: "Open the final tab.",
        next: "shift3_final_decision",
      },
    ],
  },

  shift3_final_decision: {
    type: "scene",
    title: "Last Call: The Memory Tab",
    text: "The shift has narrowed to two receipts, one missing night, and a printer that wants to turn pain into a record.",
    reads: [
      "Spy Question: Which tab preserves the truth without feeding the audit?",
      "Human Question: Does Theo need the memory, the choice, or protection from both?",
      "House Mood: Waiting to see whether you treat forgetting as mercy or theft.",
    ],
    cards: [
      {
        name: "Sable Wren",
        mood: "Exposed",
        read: "They need the house to believe them.",
      },
      {
        name: "Theo Park",
        mood: "Afraid",
        read: "They deserve a say in the memory that used their body.",
      },
      {
        name: "Rook",
        mood: "Ashamed",
        read: "They are learning that protection without consent can still be control.",
      },
    ],
    choices: [
      {
        text: "Serve - open the Memory Tab and give Theo the truth.",
        next: "result_memory_served",
        effects: {
          stats: { trust: 1, logic: 2 },
          hidden: { patron_trust: 1, heat: 1 },
          flags: { memory_tab_served: true, sable_memory_preserved: true, theo_exposed: true },
        },
      },
      {
        text: "Alter - preserve Sable's proof but redact Theo from the audit.",
        next: "result_memory_altered",
        effects: {
          stats: { mercy: 1, logic: 1, social_read: 1 },
          hidden: { civilian_safety: 2, house_trust: 1, harmony_attention: -1 },
          flags: { memory_tab_altered: true, memory_receipt_redacted: true, sable_memory_preserved: true, theo_protected: true },
        },
      },
      {
        text: "Delay - hold both tabs until Theo can choose.",
        next: "result_memory_delayed",
        effects: {
          stats: { mercy: 1, social_read: 2, risk: 1 },
          hidden: { civilian_safety: 1, heat: 1 },
          flags: { memory_tab_delayed: true, theo_protected: true, memory_watched: true },
        },
      },
      {
        text: "Refuse - burn the duplicate tab before Harmony can copy it.",
        next: "result_memory_refused",
        effects: {
          stats: { independence: 2, mercy: 1, risk: 1 },
          hidden: { house_trust: -1, civilian_safety: 2, heat: 1 },
          flags: { memory_tab_refused: true, theo_protected: true, sable_exposed: true },
        },
      },
    ],
  },

  result_memory_served: {
    type: "result",
    endingLabel: "Open Tab",
    text: paragraphs([
      "The Memory Tab opens clean.",
      "Theo remembers enough to sit down before their knees decide for them.",
      "Sable gets proof. Rook gets forgiven by no one yet, which may be healthier.",
      "The printer keeps one extra line warm. Mara tears it out before you can read the header.",
    ]),
    next: "receipt_debrief",
  },

  result_memory_altered: {
    type: "result",
    endingLabel: "Redacted Mercy",
    text: paragraphs([
      "You preserve Sable's proof and warm the ink off Theo's name.",
      "Theo gets the choice without becoming a case number.",
      "Rook cries quietly into a napkin. Sable watches the redacted tab like a door left unlocked.",
    ]),
    next: "receipt_debrief",
  },

  result_memory_delayed: {
    type: "result",
    endingLabel: "Held Tab",
    text: paragraphs([
      "You keep both tabs under your palm until Theo can breathe around the question.",
      "No one gets the whole truth tonight. No one loses the right to ask for it tomorrow.",
      "The printer cools by degrees, offended but obedient.",
    ]),
    next: "receipt_debrief",
  },

  result_memory_refused: {
    type: "result",
    endingLabel: "Ash Receipt",
    text: paragraphs([
      "The duplicate tab burns blue-white in the sink.",
      "Theo is safe from the audit. Sable is not safe from being doubted.",
      "Rook says Theo's name like an apology and a promise.",
      "Mara opens the back door to let the smoke out. Harmony's elevator screen flickers once.",
    ]),
    next: "receipt_debrief",
  },

  shift4_clocked: {
    type: "punchcard",
    title: "12:07 AM",
    text: paragraphs([
      "SHIFT 04",
      "CLOCKED IN",
      "The punch clock stamps a tiny candle beside the time. It smokes without burning.",
    ]),
    reads: [
      "Punchcard: Active.",
      "House Mood: Brighter than comfort allows.",
    ],
    choices: [
      {
        text: "Enter the floor.",
        next: "shift4_opening",
      },
    ],
  },

  shift4_opening: {
    type: "scene",
    title: "Two Birthdays",
    text: paragraphs([
      "The lounge has strung paper moons over Booth 3. Someone upstairs decided the room looked almost cheerful and took offense.",
      "The elevator screen scrolls a new Harmony prompt: CELEBRATION IS SAFER WHEN SHARED.",
      "Mara turns a candle between her fingers until the wax bends.",
    ]),
    speaker: "Mara",
    dialogue: "Tonight, a song can be a witness. A witness can be a weapon. Keep your ear on the chorus.",
    reads: [
      "Shift Title: Two Birthdays.",
      "Room Read: Public joy has edges down here.",
      "Codebook: A birthday is not always a date. Sometimes it is the day a person became someone else.",
    ],
    cards: [
      {
        name: "Mara",
        mood: "Watchful",
        read: "She keeps the candle unlit. That seems less like caution than grief.",
      },
    ],
    choices: [
      {
        text: "Begin fourth service.",
        next: "shift4_patron_intro",
        effects: {
          flags: { harmony_birthday_prompt_seen: true },
          hidden: { harmony_attention: 1 },
        },
      },
    ],
  },

  shift4_patron_intro: {
    type: "scene",
    title: "Celia Noon",
    text: paragraphs([
      "A patron in a pearl-gray coat sits alone at the end of the bar.",
      "They have dressed for no party at all: bare wrists, flat shoes, hair pinned with a black match.",
      "When the Singer tests the word birthday, Celia looks at the elevator instead of the stage.",
    ]),
    speaker: "Celia Noon",
    dialogue: "Does the house still honor private occasions?",
    reads: [
      "Celia Mood: Afraid of being congratulated.",
      "Body Read: Their hand covers the place where a bracelet used to be.",
    ],
    cards: [
      {
        name: "Celia Noon",
        mood: "Braced",
        read: "They want the room to understand the order without celebrating it.",
      },
      {
        name: "The Singer",
        mood: "Soft",
        read: "They know three versions of the birthday song and choose none of them.",
      },
    ],
    choices: [
      {
        text: "Say the house honors quiet dates.",
        next: "shift4_coded_order",
        effects: {
          stats: { trust: 1, social_read: 1 },
          hidden: { patron_trust: 1 },
        },
        response: "Celia's shoulders fall one careful inch.",
      },
      {
        text: "Ask which name should stay off the candle.",
        next: "shift4_coded_order",
        effects: {
          stats: { logic: 1, risk: 1 },
          flags: { found_second_birthday: true },
        },
        response: "Celia looks at you like you found the bruise without pressing it.",
      },
      {
        text: "Watch the elevator reflection before answering.",
        next: "shift4_coded_order",
        effects: {
          stats: { social_read: 1, independence: 1 },
          flags: { birthday_watched: true, harmony_birthday_prompt_seen: true },
        },
        response: "The screen brightens on Celia's face, then politely forgets to dim.",
      },
    ],
  },

  shift4_coded_order: {
    type: "scene",
    title: "One Candle",
    speaker: "Celia Noon",
    dialogue: "Two Birthdays. One candle. No song.",
    text: paragraphs([
      "The order lands gently. That is what makes everyone still.",
      "Mara's hand stops over the garnish tray.",
      "The Singer touches their throat and lets the silence stay whole.",
    ]),
    reads: [
      "Codebook: Two Birthdays means two lives are trying to claim the same person.",
      "Codebook: One candle means only one version can safely be acknowledged.",
      "Codebook: No song means no public confirmation. A chorus is evidence.",
    ],
    cards: [
      {
        name: "Celia Noon",
        mood: "Careful",
        read: "They are asking for recognition without proof.",
      },
      {
        name: "Mara",
        mood: "Still",
        read: "She does not reach for the lighter.",
      },
    ],
    choices: [
      {
        text: "Write the order exactly.",
        next: "shift4_civilians_enter",
        effects: {
          stats: { logic: 1 },
          hidden: { venue_stability: 1 },
        },
        response: "The words look harmless on the pad until the word song starts feeling like a threat.",
      },
      {
        text: "Ask who should not hear the date.",
        next: "shift4_civilians_enter",
        effects: {
          stats: { logic: 1, social_read: 1, risk: 1 },
          flags: { found_second_birthday: true },
        },
        response: "Celia says nobody. Their eyes say Harmony.",
      },
      {
        text: "Keep the order off paper.",
        next: "shift4_civilians_enter",
        effects: {
          stats: { mercy: 1, independence: 1 },
          hidden: { harmony_attention: -1 },
          flags: { birthday_name_corrected: true },
        },
        response: "Mara slides the order pad away before the printer can feel excluded.",
      },
    ],
  },

  shift4_civilians_enter: {
    type: "scene",
    title: "Happy Mika",
    text: paragraphs([
      "The elevator opens on Mika Voss, glowing with cheap courage, and Tally, already filming sideways.",
      "Mika sees the paper moons and laughs like they were put up for them.",
      "Tally sweeps the phone across the bar, catching Celia in the edge of the frame.",
    ]),
    speaker: "Mika Voss",
    dialogue: "It is my birthday and I would like the weirdest thing on the menu.",
    reads: [
      "Mika Mood: Brave for the camera.",
      "Tally Mood: Helpful in a dangerous way.",
      "Problem: The public birthday is about to copy the private one.",
    ],
    cards: [
      {
        name: "Mika Voss",
        mood: "Lit Up",
        read: "They want one good story out of a year that looks tired around the edges.",
      },
      {
        name: "Tally",
        mood: "Broadcasting",
        read: "They love Mika enough to make the room public without asking it.",
      },
      {
        name: "Celia Noon",
        mood: "Frozen",
        read: "They react before the phone reaches them.",
      },
    ],
    choices: [
      {
        text: "Offer Mika a house special away from Booth 3.",
        next: "shift4_confusion",
        effects: {
          stats: { mercy: 1, social_read: 1 },
          hidden: { civilian_safety: 1 },
          flags: { mika_protected: true },
        },
        response: "Mika follows the sparkle. Tally follows Mika. Celia breathes once.",
      },
      {
        text: "Ask Tally to frame the neon instead of the room.",
        next: "shift4_confusion",
        effects: {
          stats: { social_read: 1, trust: 1 },
          hidden: { civilian_exposure: -1 },
          flags: { tally_redirected: true },
        },
        response: "Tally says yes because the neon is gorgeous. The phone forgets Celia for three seconds.",
      },
      {
        text: "Let them sit and watch Celia.",
        next: "shift4_confusion",
        effects: {
          stats: { risk: 1, social_read: 1 },
          hidden: { heat: 1, harmony_attention: 1 },
          flags: { birthday_watched: true, tally_post_seen: true },
        },
        response: "The phone finds Celia again. Celia does not look at it, which is how you know they know.",
      },
    ],
  },

  shift4_confusion: {
    type: "scene",
    title: "The Wrong Birthday",
    text: paragraphs([
      "Mika orders the funny birthday drink because it sounds cursed and memorable.",
      "A runner brings two tiny cakes to the rail. One says MIKA. One says NOON.",
      "Tally's phone auto-captions the room before anyone sings: TWO BIRTHDAYS AT SUGAR SHACK.",
    ]),
    reads: [
      "Wrong-Name Problem: One cake is celebration. One cake is signal.",
      "Civilian Risk: Mika thinks a wrong cake is funny. Celia thinks it is a file opening.",
    ],
    cards: [
      {
        name: "Mara",
        mood: "Warning",
        read: "She looks at the cakes, then at the house lights.",
      },
      {
        name: "Mika Voss",
        mood: "Delighted",
        read: "They are one joke away from becoming a witness.",
      },
      {
        name: "Tally",
        mood: "Pleased",
        read: "The phone is doing more work than they understand.",
      },
      {
        name: "Celia Noon",
        mood: "Cornered",
        read: "They watch the name NOON like it has teeth.",
      },
    ],
    choices: [
      {
        text: "Take two limited reads before last call.",
        next: "shift4_snoop_menu",
      },
    ],
  },

  shift4_snoop_menu: {
    type: "snoopMenu",
    title: "Read the Birthday Room",
    text: "Choose what to inspect or interrupt. You have time for two reads before the room becomes a chorus.",
    cards: [
      {
        name: "Celia Noon",
        mood: "Contained Panic",
        read: "They are afraid of applause, not danger.",
      },
      {
        name: "Mika Voss",
        mood: "Unaware",
        read: "They deserve a birthday that does not belong to a surveillance system.",
      },
      {
        name: "Tally",
        mood: "Eager",
        read: "They mistake attention for care.",
      },
    ],
    options: [
      {
        text: "Inspect the cake tickets",
        response: "MIKA was printed upstairs. NOON was printed downstairs in receipt ink, warm enough to smear.",
        effects: {
          stats: { logic: 1 },
          flags: { found_wrong_name_cake: true },
        },
      },
      {
        text: "Check Tally's phone preview",
        response: "The auto-caption has already guessed the code phrase. A tiny Harmony charm spins beside the text.",
        effects: {
          stats: { logic: 1, risk: 1 },
          hidden: { harmony_attention: 1 },
          flags: { tally_post_seen: true, harmony_birthday_prompt_seen: true },
        },
      },
      {
        text: "Read Celia",
        response: "Celia flinches at the word happy, not the word birthday. The old name must have been used kindly once.",
        effects: {
          stats: { mercy: 1, social_read: 1 },
          flags: { found_second_birthday: true },
        },
      },
      {
        text: "Read Mika",
        response: "Mika keeps checking whether Tally is still filming. They want proof they were joyful tonight.",
        effects: {
          stats: { social_read: 1, mercy: 1 },
          flags: { mika_protected: true },
        },
      },
      {
        text: "Ask Mara with your eyes",
        response: "Mara pinches the candle flame out before lighting it. No song means no public proof. If they sing, Harmony gets witnesses.",
        effects: {
          stats: { trust: 1, social_read: 1 },
          hidden: { house_trust: 1 },
          flags: { mara_birthday_warning: true },
        },
      },
      {
        text: "Listen to the Singer",
        response: "The Singer hums around the birthday melody without entering it. Some doors open when a room says your name together.",
        effects: {
          stats: { social_read: 2 },
          flags: { singer_birthday_warning: true },
        },
      },
      {
        text: "Swap the cake cards",
        response: "You trade the name cards under cover of a napkin fold. Mika gets MIKA. Celia gets no paper at all.",
        effects: {
          stats: { mercy: 1, logic: 1 },
          hidden: { civilian_safety: 1, harmony_attention: -1 },
          flags: { birthday_name_corrected: true, mika_protected: true },
        },
      },
      {
        text: "Do not interfere yet",
        response: "You let the wrong birthday sit in public. The room notices who stops pretending not to notice.",
        effects: {
          stats: { risk: 1, social_read: 1 },
          hidden: { heat: 1, harmony_attention: 1 },
          flags: { birthday_watched: true },
        },
        endSnooping: true,
      },
    ],
    nextWhenDone: "shift4_convergence",
  },

  shift4_convergence: {
    type: "scene",
    title: "The Song Almost Starts",
    speaker: "Tally",
    dialogue: "Everybody, we have two birthdays tonight!",
    text: paragraphs([
      "Mika laughs, then checks the room and laughs smaller.",
      "Celia's hand closes around the unlit candle until the wax bends.",
      "The elevator screen brightens like it has been invited to sing.",
    ]),
    reads: [
      "Mika Mood: Starting to understand the joke has teeth.",
      "Tally Mood: One second from making care public.",
      "Celia Mood: Ready to run if the room says the wrong name.",
    ],
    cards: [
      {
        name: "Mika Voss",
        mood: "Confused",
        read: "They did not mean to steal anyone's danger.",
      },
      {
        name: "Tally",
        mood: "Too Loud",
        read: "Their love is about to become evidence.",
      },
      {
        name: "Celia Noon",
        mood: "Pinned",
        read: "They need to be believed without being announced.",
      },
    ],
    choices: [
      {
        text: "Give Mika a decoy flourish before the song begins.",
        next: "shift4_host_signal",
        effects: {
          stats: { mercy: 1, social_read: 1 },
          hidden: { civilian_safety: 1 },
          flags: { mika_protected: true, tally_redirected: true },
        },
        response: "Mika gets a sparkler, Tally gets a better angle, and Celia gets one breath not spent fleeing.",
      },
      {
        text: "Ask Tally to keep this one offline.",
        next: "shift4_host_signal",
        effects: {
          stats: { trust: 1, risk: 1 },
          flags: { tally_redirected: true, tally_post_seen: true },
        },
        response: "Tally looks annoyed until Mika touches their wrist. Then the phone tilts down.",
      },
      {
        text: "Let the first note start and watch who moves.",
        next: "shift4_host_signal",
        effects: {
          stats: { logic: 1, risk: 1, social_read: 1 },
          hidden: { heat: 1, harmony_attention: 1 },
          flags: { birthday_watched: true },
        },
        response: "The first note is enough. Celia moves toward the exit. Mara moves toward the lights.",
      },
    ],
  },

  shift4_host_signal: {
    type: "scene",
    title: "Mara's Match",
    text: paragraphs([
      "Mara places one unlit match beside two cakes.",
      "The room waits for you to decide what counts as a birthday: the order, the meaning, or the need.",
      "Serve. Alter. Delay. Refuse.",
      "The candle is small. The witness list is not.",
    ]),
    reads: [
      "Mara Mood: Letting you choose whether privacy needs ceremony, cover, time, or darkness.",
      "Final Read: Celia needs no chorus. Mika needs not to be punished for joy. Tally needs a reason to lower the phone.",
    ],
    cards: [
      {
        name: "Mara",
        mood: "Still",
        read: "She will remember whether you save the person, the proof, or the room.",
      },
      {
        name: "Celia Noon",
        mood: "Waiting",
        read: "They are asking to exist without being re-entered into a system.",
      },
      {
        name: "Mika and Tally",
        mood: "Human",
        read: "One wanted a birthday. One wanted to prove it happened. Neither came here to harm anyone.",
      },
    ],
    choices: [
      {
        text: "Take the final birthday order.",
        next: "shift4_final_decision",
      },
    ],
  },

  shift4_final_decision: {
    type: "scene",
    title: "Last Call: Two Birthdays",
    text: "The shift has narrowed to two cakes, one candle, a phone waiting to post, and a song that could turn care into evidence.",
    reads: [
      "Spy Question: Which birthday is the real signal?",
      "Human Question: Who gets protected when a harmless party becomes a public record?",
      "House Mood: Watching whether you treat joy as cover, bait, evidence, or something worth saving.",
    ],
    cards: [
      {
        name: "Celia Noon",
        mood: "Exposed",
        read: "They need recognition without a public name.",
      },
      {
        name: "Mika Voss",
        mood: "Embarrassed",
        read: "They know enough now to feel guilty for wanting a simple night.",
      },
      {
        name: "Tally",
        mood: "Hovering",
        read: "Their thumb is still close to the post button.",
      },
    ],
    choices: [
      {
        text: "Serve - honor Celia's Two Birthdays with one quiet candle.",
        next: "result_birthday_served",
        effects: {
          stats: { trust: 1, logic: 2 },
          hidden: { patron_trust: 1, heat: 1, civilian_exposure: 1 },
          flags: { birthday_signal_served: true, celia_identity_preserved: true, mika_exposed: true },
        },
      },
      {
        text: "Alter - give Mika the public party and hide Celia's signal inside it.",
        next: "result_birthday_altered",
        effects: {
          stats: { mercy: 1, logic: 1, social_read: 1 },
          hidden: { civilian_safety: 2, house_trust: 1, harmony_attention: -1 },
          flags: { birthday_signal_altered: true, birthday_name_corrected: true, mika_protected: true, celia_identity_preserved: true, tally_redirected: true },
        },
      },
      {
        text: "Delay - stop the song until everyone chooses what can be witnessed.",
        next: "result_birthday_delayed",
        effects: {
          stats: { mercy: 1, social_read: 2, risk: 1 },
          hidden: { civilian_safety: 1, heat: 1 },
          flags: { birthday_signal_delayed: true, birthday_song_stopped: true, mika_protected: true, birthday_watched: true },
        },
      },
      {
        text: "Refuse - cut the lights and kill the post before the name lands.",
        next: "result_birthday_refused",
        effects: {
          stats: { independence: 2, mercy: 1, risk: 1 },
          hidden: { house_trust: -1, civilian_safety: 2, heat: 1 },
          flags: { birthday_signal_refused: true, birthday_song_stopped: true, mika_protected: true, celia_identity_preserved: true, tally_redirected: true },
        },
      },
    ],
  },

  result_birthday_served: {
    type: "result",
    endingLabel: "True Candle",
    text: paragraphs([
      "You honor Celia's order exactly: two birthdays, one candle, no song.",
      "Celia touches the flame like it is proof of life and not proof for anyone else.",
      "Mika's party goes quiet around the edges. Tally gets a strange clip and no clean explanation.",
      "Harmony's prompt fades late, as if deciding whether silence counts as sharing.",
    ]),
    next: "receipt_debrief",
  },

  result_birthday_altered: {
    type: "result",
    endingLabel: "Decoy Wish",
    text: paragraphs([
      "You give Mika the bright cake, the silly sparkler, the harmless chorus.",
      "Celia's candle arrives as a reflection in the bar spoon, seen only by the people meant to see it.",
      "Tally posts a clip of neon and joy. Harmony learns nothing useful from beauty this time.",
    ]),
    next: "receipt_debrief",
  },

  result_birthday_delayed: {
    type: "result",
    endingLabel: "Held Song",
    text: paragraphs([
      "You hold up one hand and the song stops before it becomes a record.",
      "Mika asks Tally to put the phone away. Celia asks for the candle anyway, after a long breath.",
      "No one gets the clean moment they wanted. Everyone keeps more of themselves.",
    ]),
    next: "receipt_debrief",
  },

  result_birthday_refused: {
    type: "result",
    endingLabel: "Blown Candle",
    text: paragraphs([
      "You cut the house lights. The phone loses the room. The candle dies before it becomes evidence.",
      "Mika swears, then understands enough to go quiet. Tally deletes the draft with shaking hands.",
      "Celia leaves without a birthday and without a file. Mara relights the bar slowly, one lamp at a time.",
    ]),
    next: "receipt_debrief",
  },
};

const codenameText = {
  "The Lantern":
    "Based on your choices this shift, you treated privacy like mercy. You noticed who needed to disappear and who only wanted to be seen.",
  "Cold Brew":
    "Based on your choices this shift, you trusted the code more than the face delivering it. You can make a clean decision in a dirty room.",
  "Ghost Bartender":
    "Based on your choices this shift, you controlled the room by almost vanishing inside it. People revealed themselves because you gave them silence.",
  "House Favorite":
    "Based on your choices this shift, you kept the venue stable by making the impossible feel routine. Warmth was part of your cover.",
  "Glass Saint":
    "Based on your choices this shift, you gave people a little room to be more than their worst signal. You risked being wrong because cruelty felt worse.",
  "Double Signal":
    "Based on your choices this shift, you stopped waiting for permission. You changed the route and accepted that everyone might notice the detour.",
  "The Velvet Knife":
    "Based on your choices this shift, you cut through the room with style and heat. You were not careless, exactly, but subtlety did not get the final pour.",
  "Open Tab":
    "Based on your choices this shift, you moved between instinct and evidence, cover and risk, sweetness and static. The tab is open. The house is still watching.",
};

window.gameContent = {
  initialState,
  scenes,
  codenameText,
  branchLabels,
};
