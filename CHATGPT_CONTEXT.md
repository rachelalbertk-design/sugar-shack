# Sugar Shack Context For ChatGPT

Sugar Shack is a mobile-friendly browser prototype for a premium narrative game by 99-cent Studios.

The public location is a cute donut shop. The real game happens below it in a cyber-noir speakeasy where coded drink orders act as messages, risks, favors, and moral tests.

## Core Engine

Preserve this structure:

```text
scene -> player choice -> stat/flag update -> consequence -> next scene -> debrief
```

Do not replace the scene system. New story should extend `gameData.js` and use the existing renderer in `script.js`.

## Core Question

Do you serve what someone ordered, what they meant, or what they needed?

Most major actions should map to one of four verbs:

- Serve
- Alter
- Delay
- Refuse

## Hidden Stats

The player should not see raw stats during gameplay. Choices update hidden stats and flags, but the interface shows atmosphere instead:

- codebook notes
- drink meanings
- character reactions
- facial/body language reads
- clue closeups
- overheard lines
- elevator/printer/receipt details
- bartender advice

Stats and branch labels are revealed only in the receipt and psychology debriefs.

## Current Playable Shifts

1. Whiskey Ramen
   - Wrong-glass problem.
   - Silver Veil orders a coded drink.
   - Nia accidentally copies it because it sounds funny.
   - The player decides how to protect a civilian who does not know they are in danger.

2. The Glass Orchid
   - Public filming pressure.
   - A coded flower/drink order is confused by a civilian delivery and an influencer camera.
   - Harmony's safety-language villain thread begins.

3. The Memory Tab
   - Memory audits and consent.
   - A patron needs proof of a missing night while a civilian may be harmed by remembering it publicly.

4. Two Birthdays
   - Public celebration as exposure.
   - Celia orders "Two Birthdays. One candle. No song."
   - Mika and Tally turn a private signal into a near-public birthday post.

## Planned Shifts

5. The Kindness Audit
   - Director Vale appears through a recorded message.

6. The House Leak
   - Director Vale speaks through the system.

7. Last Call for Privacy
   - Director Vale offers the final bargain: safety through surveillance.

## File Map

- `index.html` loads the app.
- `style.css` controls layout, polish, responsive behavior, and lightweight animation.
- `gameData.js` contains state, scenes, choices, flags, hidden effects, and debrief copy.
- `script.js` contains rendering, localStorage saves, snooping menus, settings, debriefs, and shift progression.
- `STORY_ROADMAP.md` tracks the seven-shift launch story.
- `APP_STORE_READINESS.md` tracks future release prep.

## Tone

Keep the writing concise, stylish, emotional, strange, and noir. Avoid formal puzzle language. The player should feel like they are reading people under pressure, not solving a worksheet.
