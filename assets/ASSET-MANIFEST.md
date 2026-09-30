# Asset manifest

| Asset | Path | Source | Use |
| --- | --- | --- | --- |
| Three.js 0.186.0 module | `public/vendor/three.module.js` | npm CDN distribution, MIT | WebGL scene engine |
| Three.js core 0.186.0 | `public/vendor/three.core.js` | npm CDN distribution, MIT | WebGL module dependency |
| Skyline scene | `src/games.js` | Procedural local code | City, ring gates, ship, lights |
| Orbit scene | `src/games.js` | Procedural local code | Planet, path rings, crystals, ship |
| Camera studio scene | `src/games.js` | Procedural local code | Actor, stage, light, camera rig |
| Hub thumbnails | `index.html`, `src/style.css` | CSS geometry | Game selection cards |
| QA screenshots | `presentation/assets/` | Final local browser capture | Deck and QA evidence |

No generative media, uploaded brand asset, external API key, or unlicensed audio is used. Short pickup tones are synthesized with Web Audio after a user gesture.
