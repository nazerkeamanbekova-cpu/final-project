# Qoldau AI — interactive research site

Static website (HTML + CSS + vanilla JS). No build step, no backend, no API keys.

```
qoldau-ai/
├── index.html        all content and references
├── css/style.css     visual system
├── js/main.js        charts, simulations, dashboard mockup
├── favicon.svg
└── docs/
    ├── QUALITY_CONTROL.md   read first: issues to fix in the paper
    └── PRESENTATION.md      route, 9-minute script, 10 Q&A
```

## View it on your computer
Double-click `index.html`, or run `python3 -m http.server 8000` in this folder and open http://localhost:8000.

## Publish free on GitHub Pages
1. Create an account at github.com and click **New repository** (name e.g. `qoldau-ai`, Public).
2. Click **uploading an existing file**, drag in `index.html`, `favicon.svg`, and the `css` and `js` folders (the `docs` folder is optional; do not publish `QUALITY_CONTROL.md` if you want it private).
3. Commit changes.
4. **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, folder `/ (root)` → Save.**
5. After 1–2 minutes your site is at `https://YOUR-USERNAME.github.io/qoldau-ai/`.

Alternative: drag the folder onto https://app.netlify.com/drop for an instant link.

## Before presenting
- Fix the items in `docs/QUALITY_CONTROL.md` (especially pending references).
- Open the site on the presentation computer with Wi-Fi to load fonts, and test once.
- Use browser zoom 100–110% and full-screen (F11).
