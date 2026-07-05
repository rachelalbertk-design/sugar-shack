# Sugar Shack App Store Readiness

This checklist keeps the prototype moving toward a first TestFlight build without rewriting the game.

## Current Status

- Core story engine is intact: scene -> choice -> stat/flag update -> consequence -> next scene -> debrief.
- Shifts 1-7 are playable from punch-in through receipt and psychology debrief.
- The launch-scope story arc is implemented for prototype testing.
- Settings panel added for text size, reduce motion, high contrast, replay intro, and clear progress.
- Privacy and support drafts exist as local pages.
- The prototype remains offline-first: no account, ads, analytics, or tracking.

## Launch Story Scope

Sugar Shack should not launch as a one-shift pilot or a three-shift episode. The store release target is all seven shifts:

1. Shift 1 - Whiskey Ramen
2. Shift 2 - The Glass Orchid
3. Shift 3 - The Memory Tab
4. Shift 4 - Two Birthdays
5. Shift 5 - The Kindness Audit
6. Shift 6 - The House Leak
7. Shift 7 - Last Call for Privacy

Each shift needs 7-10 story beats, coded orders, civilian complications, limited reads/interventions, a final Serve/Alter/Delay/Refuse-style decision, consequences, receipt debrief, psychology debrief, and future-facing flags.

## Before TestFlight

- Package the web build in an iOS shell, likely WKWebView or Capacitor.
- Bundle all HTML, CSS, JS, manifest, icon, privacy, and support files locally.
- Create final raster app icons: 1024x1024 App Store icon plus required iOS icon sizes.
- Add a native launch screen.
- Confirm save data survives app relaunch and updates.
- Test on small iPhone, large iPhone, and iPad if iPad is supported.
- Confirm Settings controls work with VoiceOver and keyboard focus.
- Run a full seven-shift editing, balance, accessibility, and device QA pass.
- Confirm the final story debrief reflects the whole run clearly.

## App Store Connect

- App name: Sugar Shack.
- Category: Games, likely Adventure or Role Playing.
- Age rating: complete based on final themes and language.
- Privacy Nutrition Label: if the offline-first plan remains true, declare no collected data.
- Privacy Policy URL: publish the final version of privacy.html to a stable public URL.
- Support URL: publish the final version of support.html to a stable public URL.
- Review notes: explain that Sugar Shack is an offline interactive fiction/social deduction game with local-only saves.

## Store Page Draft

Short description:

Sugar Shack is a cyber-noir story game about coded drinks, civilian complications, and the cost of a clean pour.

Long description seed:

Above street level, Sugar Shack is a cute donut shop. Below it, every drink is a message and every order has a cost. Read the room, protect the wrong people for the right reasons, and find out what kind of bartender the house thinks you are.

## Screenshot Set

- Title/storefront: cute upstairs, dangerous downstairs.
- Job listing or elevator: first-night mystery.
- Whiskey Ramen order: coded drink moment.
- Nia and Jules: civilian complication.
- Two glasses: wrong-glass dilemma.
- Mid-game: Harmony's safety language enters the room.
- Late game: Director Vale offers the final bargain.
- Receipt debrief: consequence and player style.

## Not Yet Store-Ready

- Final hosted privacy/support URLs are missing.
- Native iOS wrapper has not been created.
- Final app icon raster assets are missing.
- More device and accessibility testing is needed.
- TestFlight build, signing, and App Store Connect setup still require a Mac/Xcode environment.
