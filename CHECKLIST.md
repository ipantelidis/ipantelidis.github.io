# Checklist

Open placeholders and TODOs. Updated at the end of every phase.

## Placeholders in content/site.json
- [ ] contact.open_to: drafted from the assistant's example, confirm wording

## Workflow
- After editing content/site.json run `python3 tools/sync_static.py` to update the no-JS text in index.html

## Publications (content/publications.json)
- [ ] punzo2026physics: paper URL (none in the repo yet, OpenReview or arXiv when available)
- [ ] caselli2026mindthegap: author order taken from the CV; the repo BibTeX lists the students alphabetically, confirm which is the paper's order. Confirm the project page https://hi-lewm.netlify.app/ is public.
- [ ] chatzipapadopoulou2025imageclef: paper URL (CEUR-WS), BibTeX
- [ ] Thumbnails for the three papers (optional)
- [ ] Decide: list "Efficient Text Classification with Conformal In-Context Learning" (submitted to LREC 2026) as a preprint?

## Files to add
- [ ] Portrait: assets/img/portrait.jpg is 800x800, 116 KB, acceptable. Optional downscale on a laptop: `magick portrait.jpg -resize 400x400 -quality 82 portrait.jpg` (ImageMagick) or `sips -Z 400 portrait.jpg` (macOS)
- [ ] Optional Open Graph card: convert assets/img/og-card.svg to PNG on a laptop (`rsvg-convert -w 1200 og-card.svg > og-card.png` or `magick og-card.svg og-card.png`), then point og:image and twitter:image in index.html to it and set twitter:card to summary_large_image. Until then the portrait is the preview image.
- [ ] CV PDF: copy the file to assets/pdf/cv-ippokratis.pdf (link already wired, so the CV link is dead until the file is there)

## Decisions to revisit
- [ ] Accent color: terracotta #c2410c chosen to match Fraunces; swap in css/style.css if wanted
- [ ] Fraunces: switch to Source Serif 4 if it feels like too much

## Verification pending
- [ ] Motion check in a browser: reduced motion off = reveal below the fold only, underline draws in on hover; reduced motion on = nothing moves
- [ ] Visual check in a browser of header, hero, lists and contact (no browser on the cluster)

## Phase status
- [x] Phase 0, discovery
- [x] Phase 1, scaffold
- [x] Phase 2, design system
- [x] Phase 3, sections (About, Publications, Experience, Education, Contact; Research and Life removed)
- [x] Phase 4, motion (scroll reveal, underline draw-in, thumbnail lift; no toggle or optional extras)
- [x] Phase 5, polish (meta, Open Graph, JSON-LD, 404, print styles, contrast and HTML checks)
- [x] Phase 6, QA and handover (checks below are yours to tick in a browser)

## QA to tick in a browser (python3 -m http.server 8000, open http://localhost:8000)
- [ ] 360px wide (phone): no horizontal scroll, portrait above the text, nav wraps, link rows wrap
- [ ] 768px (tablet) and 1600px (desktop): single column centred at 740px, rules between sections
- [ ] Reduced motion on (OS setting): no fade or slide, hover underlines appear instantly
- [ ] Reduced motion off: sections below the fold fade in once, underline draws in from the left, BibTeX opens
- [ ] JavaScript off (browser devtools): name, role, bio, portrait and link rows visible, email shown as "[at] [dot]", lists show the one-line note
- [ ] Keyboard only: Tab reaches skip link, nav, every link, BibTeX buttons and Copy; focus ring visible; Enter opens BibTeX; Copy announces "Copied"
- [ ] Print preview: nav and buttons hidden, all sections present
- [ ] Lighthouse (Chrome devtools, incognito): performance, accessibility, best practices, SEO all 95 or above; record the numbers here
- [ ] Console: no errors
- [ ] 404: open http://localhost:8000/nope.html (local server shows its own 404; the styled page is served only on GitHub Pages)

## Publish
1. Copy the CV to assets/pdf/cv-ippokratis.pdf. Commit it.
2. `git push -u origin main` (the remote is already set to github.com/ipantelidis/ipantelidis.github.io).
3. On GitHub: Settings > Pages > Build and deployment > Source "Deploy from a branch", Branch "main", Folder "/ (root)", Save.
4. Wait a few minutes, open https://ipantelidis.github.io. Check the 404 page at https://ipantelidis.github.io/nope.
5. Paste the URL into a LinkedIn post preview or https://www.opengraph.xyz to check the card.

## Add a publication later
1. Open content/publications.json and copy an existing entry. Set id (unique, lowercase), title, authors (full names, in paper order), me (0-based index of your name), equal_contribution (list of indices, or []), venue, year, type, links (null for the ones you do not have), summary (one sentence), highlight, bibtex (the entry as a string with \n for line breaks, or null).
2. Optional thumbnail: put a 240x180 JPEG in assets/img/ and set "thumbnail": "<file>.jpg".
3. Check the JSON: `python3 -c "import json;json.load(open('content/publications.json'))"`.
4. `git add -A && git commit -m "Add <paper>" && git push`.
Entries are grouped by year, newest first, automatically. The filter row appears on its own once there are more than six entries (not built yet; ask for it when needed).

## Edit text later
1. Edit content/site.json.
2. Run `python3 tools/sync_static.py` so the no-JS text and JSON-LD in index.html match.
3. Commit and push.
