from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors = []

required = [
    "index.html", "src/main.js", "src/games.js", "src/style.css",
    "public/vendor/three.module.js", "public/vendor/three.core.js",
    "docs/WORLD.md", "docs/SOURCE-NOTES.md", "assets/ASSET-MANIFEST.md",
    "presentation/index.html", "presentation/deck.json", "presentation/low-alt-deck.pdf",
    "presentation/low-alt-deck.pptx",
]
for entry in required:
    if not (ROOT / entry).is_file():
        errors.append(f"missing file: {entry}")

main = (ROOT / "src/main.js").read_text(encoding="utf-8")
for game_id in ("flight", "orbit", "camera"):
    if f"{game_id}:" not in main:
        errors.append(f"game id not registered: {game_id}")

deck = json.loads((ROOT / "presentation/deck.json").read_text(encoding="utf-8"))
if len(deck["slides"]) != 13:
    errors.append(f"expected 13 slides, found {len(deck['slides'])}")
for slide in deck["slides"]:
    if slide.get("image") and not (ROOT / "presentation" / slide["image"]).is_file():
        errors.append(f"missing deck image: {slide['image']}")

skill_dirs = sorted((ROOT / "skills").glob("*/"))
if len(skill_dirs) != 3:
    errors.append(f"expected 3 skills, found {len(skill_dirs)}")
for skill_dir in skill_dirs:
    skill_path = skill_dir / "SKILL.md"
    if not skill_path.is_file():
        errors.append(f"missing SKILL.md: {skill_dir.name}")
        continue
    text = skill_path.read_text(encoding="utf-8")
    if not text.startswith("---\n") or "\nname:" not in text or "\ndescription:" not in text:
        errors.append(f"invalid frontmatter: {skill_dir.name}")
    if not re.search(r"\n# .+", text):
        errors.append(f"missing skill title: {skill_dir.name}")

html = (ROOT / "presentation/index.html").read_text(encoding="utf-8")
if "ArrowLeft" not in html or "window.__deck" not in html:
    errors.append("presentation navigation hook is missing")

if errors:
    print(json.dumps({"ok": False, "errors": errors}, ensure_ascii=False, indent=2))
    sys.exit(1)
print(json.dumps({"ok": True, "games": 3, "skills": len(skill_dirs), "slides": len(deck["slides"])}, ensure_ascii=False))
