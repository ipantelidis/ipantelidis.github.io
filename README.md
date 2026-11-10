# ipantelidis.github.io

Personal academic site. Plain HTML, CSS and vanilla JavaScript. No build step.

## Update content
- Personal text and links: edit `content/site.json`, then run `python3 tools/sync_static.py` (updates the no-JS text and JSON-LD in `index.html`).
- Publications: edit `content/publications.json` (one object per paper), drop a thumbnail in `assets/img/`.
- Portrait: put the file in `assets/img/` and set `files.portrait` in `site.json`.
- CV: put the PDF in `assets/pdf/` and set `links.cv_pdf` to `assets/pdf/<file>.pdf`.
- Open placeholders are tracked in `CHECKLIST.md`.

## Preview locally
`python3 -m http.server 8000` in this folder, then open http://localhost:8000.
(Opening `index.html` directly shows only the static content; `fetch` needs a server.)

## Deploy
Repo must be named `ipantelidis.github.io`. Push to `main`.
GitHub: Settings > Pages > Build and deployment > Source "Deploy from a branch", branch `main`, folder `/ (root)`. The site is live at https://ipantelidis.github.io within a few minutes.
