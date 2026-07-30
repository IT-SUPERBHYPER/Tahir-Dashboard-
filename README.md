# Tahir Dashboard

A lightweight, stylish dashboard to view all repositories for the user IT-SUPERBHYPER. It is a single-page static site (HTML/CSS/JS) that uses the GitHub REST API to list repositories and show basic metadata (stars, forks, language, updated time).

What I added
- `index.html` — main dashboard page
- `assets/style.css` — stylish dark/techy UI
- `assets/app.js` — fetches repos and renders cards

Features
- Shows public repositories for the username IT-SUPERBHYPER by default
- Optional: paste a GitHub personal access token (saved to localStorage) to surface private repositories and increase rate limits
- Search and sort repositories

How to use
1. Enable GitHub Pages in this repository (Settings → Pages) and set the source to the `main` branch / root. The dashboard will be served at `https://IT-SUPERBHYPER.github.io/Tahir-Dashboard-/`.
2. Open the site. It will list public repositories automatically.
3. To see private repositories or avoid low rate limits, create a personal access token with `repo` scope, paste it into the token field, and click Save. The token is stored in your browser's localStorage only.

Customization
- Change the username shown at the top (currently hard-coded to `IT-SUPERBHYPER`) by editing `index.html` or modify `assets/app.js` to allow switching accounts.
- Tweak the styles in `assets/style.css` to match your visual taste.

Security note
- The optional PAT is stored in localStorage on the client. Do not paste tokens in shared machines or someone else's browser.

Want me to:
- Add automatic GitHub Pages setup (workflow) to publish on push?
- Add support for organizations or pagination across many repos?
- Add repo readme previews and language color badges?

