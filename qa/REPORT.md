# QA report

Run date: 2026-09-30. The browser run used headless Chrome with SwiftShader at 1280 × 800 and 390 × 844.

## Results

- Hub and all three game routes loaded. Return-to-hub worked after each game.
- Flight, orbit, and camera scenes reported 37,370, 6,244, and 5,428 triangles in the test frame.
- The camera round accepted three captures and reached `done=true` with `progress=1`.
- Mobile hub and camera controls loaded. The mobile page had no horizontal overflow.
- The 13-slide interactive deck navigated to its final slide. PDF and PPTX each contain 13 slides/pages.
- Browser console and page errors: 0. HTTP errors: 0.

The renderer was SwiftShader software rendering. Triangle and draw-call counts are captured test-frame measurements; they are not hardware performance benchmarks.

## Evidence

- Raw measurements: `qa/browser-smoke.json`.
- Hub and game captures: `presentation/assets/{hub,flight,orbit,camera}.png`.
- Clean scene captures: `presentation/assets/{flight,orbit,camera}-scene.png`.
- Deck captures: `presentation/assets/deck-cover.png` and `presentation/assets/deck-game.png`.
- HTML deck: `presentation/index.html`.
- PDF: `presentation/low-alt-deck.pdf`.
- Editable PowerPoint: `presentation/low-alt-deck.pptx`.

Production URL and public repository are recorded in `docs/WORLD.md` after deployment verification.
