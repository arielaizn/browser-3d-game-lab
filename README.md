# Browser 3D Game Lab

Three small 3D games share one browser hub. Each game has a separate control loop, objective, score, and scene. The project also includes a skill pack and a presentation set.

## Play

Open the live site or run a local static server from this folder:

```bash
python3 -m http.server 5500
```

Then open `http://localhost:5500`.

| Game | Loop | Controls |
| --- | --- | --- |
| Skyline | Fly through a city and collect 12 rings | WASD or arrow keys |
| Last Orbit | Tune an orbital path to meet light fragments | A/D for radius, W/S for altitude |
| Motion Director | Compose three camera shots and score the frame | A/D to orbit, W/S for distance, Space to capture |

Escape returns to the hub. The touch pad appears on narrow screens. The games use procedural Three.js geometry and short Web Audio cues. They need no login or service key.

## Skill pack

`skills/` contains three installable skills:

- `multi-game-hub`: joins distinct game loops in one navigable browser experience.
- `camera-move-challenge`: turns camera motion and framing into a score-based game.
- `game-deck-exporter`: creates a visual HTML, PDF, and PowerPoint handoff from checked game evidence.

The general single-game workflow remains with the `code3d` skill family. This pack handles multi-game integration and its presentation handoff.

## Source and design decisions

The skill pack was derived from Yuval Avidani's Hebrew video, [איך קלוד אופוס 5.5 יודע לפתח בתלת מימד כ"כ טוב?](https://youtu.be/yhjouIJY6ko). The games translate three examples from that video into playable scenes: city flight, an interactive 3D hero-style world, and a camera-movement challenge.

The source describes a project split by asset type, connected creation tools, screenshot review before public release, and feedback after play. It reports roughly four prompts and six hours for that creator's game. That is a report from one project, not a build-time promise.

This sample uses procedural geometry and local browser code. It does not use the source creator's logo, source project files, or paid generation APIs. The project keeps credentials out of browser bundles and has no external API calls.

## Local checks

```bash
python3 qa/check_package.py
python3 -m pip install playwright PyMuPDF
python3 qa/run_browser_smoke.py
python3 presentation/build_pptx.py
```

`qa/check_package.py` checks required files, game registration, skill frontmatter, HTML references, and presentation exports. The browser run needs Chrome and uses SwiftShader when hardware WebGL is unavailable. The browser hook `window.__game` exposes `ready`, `state`, `tick`, `info`, and game navigation.

## Presentation

Open `presentation/index.html` for the interactive deck. Downloadable files are in `presentation/`.

## License

Project code and skill files use the MIT License. Three.js is included under its own MIT license in `public/vendor/THREE-LICENSE.txt`.
