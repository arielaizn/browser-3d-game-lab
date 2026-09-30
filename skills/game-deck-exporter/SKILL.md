---
name: game-deck-exporter
description: >-
  Produces one project-matched presentation in interactive HTML, PDF, and editable PPTX from verified 3D-game
  screenshots, source notes, a skill map, and a release checklist. Use when Ariel says "תכין מצגת למשחקים",
  "export the game deck", "HTML PDF PPTX game presentation", or "make a release deck with checklists".
  Pairs with web-artifacts-builder and the pptx skill when game captures, source notes, and a release gate need one deck.
---

# Game deck exporter

Create a presentation from evidence in the current game project. Keep the three exports aligned in slide order, words, imagery, and source notes.

## Inputs

Read the source note, game registry, `docs/WORLD.md`, current hub and game screenshots, installed skill list, and live publication record. Mark each value as a source fact, project decision, measured result, or open item.

Do not reuse old captures after the scene changes. Do not fill metrics with guesses.

## Deck structure

Use 10–14 slides unless the evidence calls for fewer:

1. Cover in the same art direction as the hub.
2. Source and goal.
3. Method drawn from the source.
4. Architecture and asset map.
5. Skill pack map and boundaries.
6. One slide for each playable game with a current screenshot and controls.
7. Hub navigation and responsive behavior.
8. Measured QA evidence.
9. Public release links and status.
10. Release checklist, open items, and source link.

## Output files

- `presentation/index.html`: keyboard-navigable slide deck with accessible headings and a print stylesheet.
- `presentation/low-alt-deck.pdf`: one page per slide, fonts and images embedded.
- `presentation/low-alt-deck.pptx`: editable text and shapes. Screenshots may remain images.

Use the project's own colors, type, grid, and game captures. Keep each slide focused on one fact or decision. Use alt text for game images and source links for attributed facts.

## Export and validation

1. Freeze the slide content and filenames in one data source or verify the three outputs line by line.
2. Open the HTML deck and navigate with arrows, Home, End, and browser print.
3. Export PDF and inspect page count, first page, last page, image crop, Hebrew direction, and checklist legibility.
4. Open the PPTX through LibreOffice or PowerPoint and inspect title, game, and checklist slides.
5. Keep the latest export date in the PDF and PPTX metadata. Remove draft slides before publishing.

## Checklist

- [ ] Every game slide uses a current capture of the final code.
- [ ] The deck separates video statements from project measurements.
- [ ] Source and repo links resolve.
- [ ] HTML navigation works by keyboard.
- [ ] PDF and PPTX each contain the full slide set.
- [ ] No unsupported performance, time, or quality claims remain.
