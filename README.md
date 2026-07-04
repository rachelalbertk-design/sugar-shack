# Sugar Shack

A mobile-friendly browser prototype for Sugar Shack, the first major concept in the tiny premium-game studio idea 99-cent Studios.

Sugar Shack is a hidden futuristic speakeasy beneath a cute public-facing donut shop. The donut shop is only the cover; the real game happens downstairs, where every drink is a message and the end-of-shift tab reveals what kind of operator you became.

## Files

- index.html - page structure and script links
- style.css - cyber-noir donut-cover styling, scene treatments, and lightweight animations
- gameData.js - state, scenes, choices, flags, hidden effects, character states, and debrief text
- script.js - game state, localStorage intro flag, rendering, callbacks, snooping, and debrief logic
- manifest.webmanifest - installable web-app metadata for release prep
- privacy.html - privacy policy draft to publish before store submission
- support.html - support page draft to publish before store submission
- APP_STORE_READINESS.md - TestFlight and App Store checklist
- STORY_ROADMAP.md - seven-shift launch story plan
- GITHUB_UPLOAD_GUIDE.md - simple GitHub and GitHub Pages upload instructions
- CHATGPT_CONTEXT.md - shareable project brief for ChatGPT or another collaborator
- assets/app-icon.svg - source icon concept for the prototype
- README.md - this guide

## Current Build

This update preserves the original structure:

scene -> player choice -> stat/flag updates -> consequence -> next scene -> end-of-shift debrief

Current features:

- Renamed the game to Sugar Shack
- Added a short 99-cent Studios stick-figure intro
- Added the first-playthrough job listing path
- Added the hidden elevator transition
- Added a three-question mini-interview
- Added a punchcard moment and local saved intro flag
- Later starts use Punch In
- Title also supports replaying the hiring intro or resetting the new-hire save
- Settings panel supports text size, reduce motion, high contrast, replay intro, and clear progress
- Live stats are hidden during gameplay
- End screens reveal the player style as a tab and branch system
- First shift is an underground speakeasy coded-drink scenario featuring Whiskey Ramen
- Second shift introduces The Glass Orchid, civilian filming pressure, and Harmony's safety language
- Third shift introduces The Memory Tab, memory audits, and consent around remembered harm
- Fourth shift introduces Two Birthdays, public celebration pressure, and social posting as danger
- Launch scope is seven complete shifts, with Shifts 1-4 as the current playable benchmarks
- Scene-specific visual props now appear for the job listing, counter, elevator, interview, booth, coded drink, and ending moments
- Character read cards show soft mood/read states for the cashier, Mara, Silver Veil, Nia, and Jules
- Earlier choices now echo later through callback text and altered dialogue
- Release-prep privacy and support drafts are included for a future app-store package

## Local Save Flag

The browser stores this key after the hiring intro is completed:

sugarShack.hasCompletedIntro

The browser also stores active-run saves and comfort settings:

sugarShack.activeRun
sugarShack.settings

When `sugarShack.hasCompletedIntro` is false or missing, the title starts with the job listing path. When it is true, the title shows Punch In, plus options to replay or reset the intro state.

## How to Play

Open index.html in a browser, or serve the folder locally and open the local address. No packages or build tools are required.

For GitHub Pages, upload this folder as a static site and publish from the repository root.

## Launch Scope

The planned store release is the full seven-shift arc:

1. Whiskey Ramen
2. The Glass Orchid
3. The Memory Tab
4. Two Birthdays
5. The Kindness Audit
6. The House Leak
7. Last Call for Privacy
# sugar-shack
