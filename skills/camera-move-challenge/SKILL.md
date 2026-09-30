---
name: camera-move-challenge
description: >-
  Turns a 3D camera move into a playable framing challenge: dolly, orbit, lens change, composition target,
  scoring, and capture feedback. Use when Ariel says "תעשה משחק על תנועות מצלמה", "תרגיל משחקי לזוויות צילום",
  "camera move mini-game", "score my framing", or "make the camera explainer playable". Pairs with
  code3d-explainer when a lesson needs a scoring loop; this skill owns timed, scored camera play.
---

# Camera move challenge

Build a small game in which the player moves a virtual camera to satisfy a visible composition brief.

## Rules

1. Teach one camera principle per round. State the principle in the brief.
2. Show the virtual camera's location and the image it frames at the same time.
3. Keep camera travel, lens change, target framing, and horizon as separate controls.
4. Score against a declared target. Never describe an arbitrary score as a cinema rule.
5. Provide keyboard controls and a touch action button when mobile input is present.

## Round setup

Write a round record with:

```json
{
  "id": "round-01",
  "principle": "A dolly changes perspective as camera distance changes",
  "target": { "subject": "actor", "screenX": 0.5, "screenY": 0.48, "heightRatio": 0.36 },
  "camera": { "move": "dolly", "lensMm": 50, "safeArea": 0.8 },
  "timeLimitSeconds": 45
}
```

Use metric camera distances and a documented field of view. A dolly physically moves the camera. A zoom changes focal length while camera position stays fixed. Keep those actions separate in the controls and scoring.

## Build sequence

1. Place the subject, floor, key light, fill light, and a camera-visible reference grid.
2. Add the player camera on a rail, orbit path, or constrained move volume.
3. Render a live camera preview or a frame guide showing the subject and safe area.
4. Add one target composition, timer, score, capture action, and a round result.
5. Add three rounds with different camera principles only after one round behaves correctly.
6. Provide replay, next round, and return-to-hub controls.

## Scoring

Keep each metric visible in the result:

- Subject center error in normalized screen coordinates.
- Subject height error from the target ratio.
- Camera-angle or horizon error when that round tests the angle.
- Correct camera operation for the lesson, such as moving the dolly instead of changing focal length.

Convert the weighted error into a 0–100 score and show the measured values. Add an explanation that ties the result to the stated principle.

## QA checklist

- [ ] The camera object and the camera's image show the same live move.
- [ ] Dolly and zoom produce visibly different results.
- [ ] Each round's target can be reached using the visible controls.
- [ ] Keyboard, touch capture, replay, and return paths work.
- [ ] Target text and framing markers remain legible on mobile.
- [ ] Score values are based on measured framing error.
