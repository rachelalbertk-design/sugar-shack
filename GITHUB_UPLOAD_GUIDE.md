# Sugar Shack GitHub Upload Guide

This prototype is a static browser game. It has no build step, no server code, and no secret keys.

## Fast Upload

1. Create a new GitHub repository named `sugar-shack`.
2. Upload every file in this folder to the repository root.
3. Commit the upload.
4. To publish a playable web link, open repository Settings -> Pages.
5. Choose "Deploy from a branch", then select `main` and `/root`.
6. Share the GitHub repo link or the GitHub Pages link with ChatGPT.

## What To Tell ChatGPT

Ask ChatGPT to read `CHATGPT_CONTEXT.md` first. That file explains the story, structure, current playable shifts, and where the important code lives.

## Local Play

Open `index.html` directly in a browser, or run any simple static file server from this folder.

The game stores prototype progress in browser localStorage:

- `sugarShack.hasCompletedIntro`
- `sugarShack.activeRun`
- `sugarShack.settings`
