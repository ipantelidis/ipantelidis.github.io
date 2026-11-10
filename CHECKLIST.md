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
- [ ] Portrait: assets/img/portrait.jpg is 800x800, 116 KB; downscale to 320x320 in Phase 5 (no image tools on the cluster)
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
- [ ] Phase 5, polish
- [ ] Phase 6, QA
