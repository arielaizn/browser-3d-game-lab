# LOW / ALT · world file

## Identity

- Project: browser-3d-game-lab
- Format: static browser game hub; Three.js 0.186.0 module is vendored under `public/vendor/`.
- Audience: players opening the public site on desktop or touch screen.
- Language: Hebrew interface; English game keys and code IDs remain stable.
- Source: Yuval Avidani's 2026-09-28 3D-development video, link and distinctions in `SOURCE-NOTES.md`.

## Art direction

Dark editorial arcade. Asphalt black, low-saturation city and studio colors, acid lime for objectives, cyan for the orbit world, warm coral for hazard cues. Use geometry and light to make each game feel different while the HUD stays shared.

## Game registry

| ID | Scene | Goal | Controls |
| --- | --- | --- | --- |
| `flight` | Skyline | Collect 12 rings while flying between buildings | WASD / arrow keys |
| `orbit` | Last Orbit | Adjust path and collect 10 light fragments | A/D radius, W/S altitude |
| `camera` | Motion Director | Capture three compositions against a timed brief | A/D orbit, W/S distance, Space |

## Conventions

- Three.js uses Y-up and meters as approximate scene units.
- Render scene swaps go through `window.__game.start(id)` and `window.__game.home()`.
- Fixed test updates use `window.__game.tick(n)` at 1/60 second per tick.
- Every game returns `update(dt, keys)`, progress, score, and a diagnostic info getter.
- The camera challenge scores measured center, angle, and distance errors from its target records.
- Escape returns to the hub. Inputs clear during scene changes and on blur.

## Assets and tools

- See `assets/ASSET-MANIFEST.md`.
- Models, city blocks, lights, orbit fragments, and game UI are generated in local code.
- No paid asset-generation call, remote image, key, or backend service is part of the build.
- Three.js's MIT license is preserved beside the vendored runtime.

## Review and release

- Current screenshot evidence: `presentation/assets/{hub,flight,orbit,camera}.png`.
- Browser validation: see `qa/REPORT.md` after the final review run.
- Presentation exports: `presentation/index.html`, `presentation/low-alt-deck.pdf`, `presentation/low-alt-deck.pptx`.
- Public URL and commit hash are added after the production deployment is verified.

## Feedback log

- Initial scope came from the 2026-09-30 request: three games, one hub, a public skill repo, and HTML/PDF/PPTX presentation.
