# Sugar Shack TestFlight Packaging Notes

Sugar Shack is currently a static offline web prototype. The seven-shift story arc is playable in the browser.

## Recommended Native Route

Use a lightweight iOS wrapper around the existing web build:

- Capacitor, if a small cross-platform wrapper is desired.
- Native WKWebView, if the goal is the simplest iOS-only shell.

The app should bundle these files locally:

- `index.html`
- `style.css`
- `script.js`
- `gameData.js`
- `manifest.webmanifest`
- `assets/app-icon.svg`
- `privacy.html`
- `support.html`

## Required Before TestFlight

- Create raster icons, including a 1024x1024 App Store icon.
- Add a native launch screen.
- Confirm localStorage saves persist in the wrapper.
- Test on small iPhone, large iPhone, and iPad if iPad is supported.
- Test VoiceOver focus order, text size settings, reduce motion, and high contrast.
- Publish final privacy and support URLs.
- Create App Store Connect app record, signing certificates, bundle identifier, and TestFlight build.

## Suggested Bundle ID

`com.99centstudios.sugarshack`

## Review Note Seed

Sugar Shack is an offline narrative game. It uses local-only browser storage for progress and settings. It does not require an account, collect analytics, run ads, or send player data to a server.
