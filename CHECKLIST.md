# Checklist

Open placeholders and TODOs. Updated at the end of every phase.

## Placeholders in content/site.json
- [ ] about.bio_paragraph_2: [BSC_INSTITUTION] (confirm bachelor university; supervisors named are at AUEB)
- [ ] research.interests_paragraph, research.directions, research.projects
- [ ] experience.entries (teaching assistant roles included; research positions decided per entry)
- [ ] education
- [ ] life.intro, life.interests, life.places_lived, life.photos
- [ ] contact.open_to

## Workflow
- After editing content/site.json run `python3 tools/sync_static.py` to update the no-JS text in index.html

## Files to add
- [ ] Portrait photo (files.portrait, assets/img/)
- [ ] CV PDF (links.cv_pdf, assets/pdf/)

## Decisions to revisit
- [ ] Accent color: terracotta #c2410c chosen to match Fraunces; swap in css/style.css if wanted
- [ ] Fraunces: switch to Source Serif 4 if it feels like too much

## Verification pending
- [ ] Visual check of Phase 2 header, toggle and hero in a browser (no browser on the cluster)

## Phase status
- [x] Phase 0, discovery
- [x] Phase 1, scaffold
- [x] Phase 2, design system
- [ ] Phase 3, sections
- [ ] Phase 4, motion
- [ ] Phase 5, polish
- [ ] Phase 6, QA
