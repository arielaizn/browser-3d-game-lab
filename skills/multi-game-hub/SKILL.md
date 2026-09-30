---
name: multi-game-hub
description: >-
  Connects three or more distinct browser-game loops into one polished, navigable 3D hub, with shared menus,
  controls, state, visual direction, and handoff notes. Use when Ariel says "תעשה לי hub לכמה משחקי תלת־ממד",
  "תחבר שלושה משחקים לאתר אחד", "תכין ארקייד עם כמה עולמות", "multi-game 3D hub", "browser game collection",
  or "turn these game demos into one site". Use the existing code3d skill family for a single game's world,
  character, audio, screenshots, and deployment; this skill owns the multi-game shell and integration.
---

# Multi-game hub

Turn a set of playable 3D ideas into one browser experience with a clear way in and out of every game.

## Rules

1. A hub entry points to a playable loop with a goal and a restart or return path.
2. Each game has its own state, controls, score, and scene. Shared UI may display those states.
3. Lock the art direction, input map, and scene handoff before building all game modules.
4. Record every external asset, tool, license, and cost. Project credentials stay in that project.
5. A public link waits for a current live screenshot and a clean console.

## Workflow

### 1. Read the project

Read `docs/WORLD.md`, the current game registry, asset manifest, and publishing notes. Preserve an existing hub, registry, routing convention, and visual token system. If no 3D project exists, hand off initial setup to `code3d-scaffold`.

### 2. Separate the loops

Write a one-line pitch and control map for each game. Give each a different verb pair and completion condition. Example: steer and collect, orbit and tune, frame and capture. Avoid three maps that only change color and scenery.

Make one integration table before implementation:

| Field | Required value |
| --- | --- |
| ID | Stable URL-safe key |
| Title | Short title for the hub card |
| Goal | Observable player action |
| Controls | Keyboard and touch mapping |
| Start / finish | Function or route contract |
| Evidence | Screenshot and state to capture |

### 3. Define the shared shell

Create one registry that maps each game ID to its scene builder, title, objective, controls, status, and thumbnail. Give the hub a back action and each game a consistent pause or return action. Keep game simulation isolated from shared navigation state.

Use one design token set for type, color, spacing, card treatment, HUD, and motion. Keep each world visually distinct through its lighting, geometry, atmosphere, and palette. Store generated or authored assets under named asset folders and note their source.

### 4. Build and connect one game at a time

Start each module from the same scene contract. Mount its scene, update loop, reset behavior, and disposal path through the registry. Check that leaving a game clears its inputs and that returning to the hub restores menu focus.

Keep keyboard support complete. Add touch controls when mobile play is in scope. Respect reduced motion and show a readable fallback when WebGL is unavailable.

### 5. Review every route

Build or serve the exact deployment tree. Capture the hub and every game at desktop size. Capture at least the hub and input state at a narrow mobile size. Open every capture and check framing, HUD overlap, legibility, loaded assets, and scene state.

Use a headless browser state hook when available. Report draw calls, triangles, WebGL renderer, errors, and the route for each capture. A successful build alone does not prove the game plays.

### 6. Publish the collection

Read the project-specific ship skill and publishing configuration. Run its secret and file-size checks. Publish only after the live URL loads the hub and every game path. Capture evidence from the live URL and record the date, repo, URL, and checks in `docs/WORLD.md`.

## Completion checklist

- [ ] Every card opens a working game loop.
- [ ] Each game has a distinct objective and controls.
- [ ] Back, restart, keyboard, and touch paths work where supported.
- [ ] Hub and games have current desktop captures.
- [ ] Mobile layout and WebGL fallback are readable.
- [ ] No console exceptions or credentials appear in shipped files.
- [ ] Every live route is captured and recorded.

## Output

Report the game IDs, objective, control mapping, screenshot paths, build evidence, live URL, and unresolved defects. Separate source statements from estimates.
