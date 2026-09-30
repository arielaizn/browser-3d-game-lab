from __future__ import annotations

import json
import os
import tempfile
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import fitz
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "presentation" / "assets"
ARTIFACTS.mkdir(parents=True, exist_ok=True)


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


class ProjectHandler(QuietHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)


server = ThreadingHTTPServer(("127.0.0.1", 0), ProjectHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{server.server_port}"
errors: list[str] = []
measurements = {}

try:
    with sync_playwright() as p:
        launch = {"headless": True, "args": ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl", "--enable-unsafe-swiftshader", "--hide-scrollbars"]}
        executable = os.environ.get("CHROME_PATH", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
        if Path(executable).exists():
            launch["executable_path"] = executable
        browser = p.chromium.launch(**launch)
        page = browser.new_page(viewport={"width": 1280, "height": 800}, device_scale_factor=1)
        page.on("console", lambda msg: errors.append(f"console: {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda err: errors.append(f"exception: {err}"))
        page.on("response", lambda response: errors.append(f"HTTP {response.status}: {response.url}") if response.status >= 400 else None)
        page.goto(base + "/", wait_until="domcontentloaded", timeout=10000)
        page.wait_for_function("window.__game && window.__game.ready", timeout=15000)
        page.wait_for_timeout(350)
        measurements["hub"] = page.evaluate("window.__game.info()")
        page.screenshot(path=str(ARTIFACTS / "hub.png"))

        for game_id in ("flight", "orbit", "camera"):
            page.locator(f'[data-game="{game_id}"]').click()
            page.wait_for_timeout(420)
            page.evaluate("window.__game.tick(3)")
            measurements[game_id] = page.evaluate("window.__game.info()")
            def capture_scene(path):
                page.evaluate("document.querySelectorAll('body > *:not(#world)').forEach(el => el.style.visibility = 'hidden')")
                page.locator("#world").screenshot(path=str(path))
                page.evaluate("document.querySelectorAll('body > *:not(#world)').forEach(el => el.style.visibility = '')")
            capture_scene(ARTIFACTS / f"{game_id}-scene.png")
            if game_id == "orbit":
                capture_scene(ARTIFACTS / "cover-art.png")
            page.screenshot(path=str(ARTIFACTS / f"{game_id}.png"))
            if game_id == "camera":
                for _ in range(3):
                    page.keyboard.press("Space")
                measurements["camera_result"] = page.evaluate("window.__game.state")
                if not measurements["camera_result"]["done"] or measurements["camera_result"]["progress"] < 1:
                    errors.append("camera round did not complete after three captures")
            page.locator("#backButton").click()
            page.wait_for_timeout(420)
            if page.evaluate("window.__game.state.screen") != "hub":
                errors.append(f"return to hub failed after {game_id}")

        mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1, is_mobile=True, has_touch=True)
        mobile.on("pageerror", lambda err: errors.append(f"mobile exception: {err}"))
        mobile.goto(base + "/", wait_until="domcontentloaded", timeout=10000)
        mobile.wait_for_function("window.__game && window.__game.ready", timeout=15000)
        mobile.screenshot(path=str(ARTIFACTS / "hub-mobile.png"))
        mobile.locator('[data-game="camera"]').click()
        mobile.wait_for_timeout(450)
        if not mobile.locator("#actionButton").is_visible():
            errors.append("camera action button is not visible on mobile")
        mobile.locator("#actionButton").click()
        if mobile.evaluate("document.documentElement.scrollWidth > window.innerWidth"):
            errors.append("mobile layout has horizontal overflow")
        mobile.close()

        deck = browser.new_page(viewport={"width": 1280, "height": 720}, device_scale_factor=1)
        deck.on("pageerror", lambda err: errors.append(f"deck exception: {err}"))
        deck.on("response", lambda response: errors.append(f"deck HTTP {response.status}: {response.url}") if response.status >= 400 else None)
        deck.goto(base + "/presentation/", wait_until="domcontentloaded", timeout=10000)
        deck.wait_for_function("window.__deck && window.__deck.ready", timeout=12000)
        measurements["slides"] = deck.evaluate("window.__deck.total")
        deck.screenshot(path=str(ARTIFACTS / "deck-cover.png"))
        deck.keyboard.press("ArrowLeft")
        deck.keyboard.press("End")
        measurements["deck_last_slide"] = deck.locator(".slide.active h2").inner_text()
        deck.evaluate("window.__deck.go(4)")
        deck.wait_for_timeout(650)
        deck.screenshot(path=str(ARTIFACTS / "deck-game.png"))
        deck.add_style_tag(content=".controls-bar,.progress,.help{display:none!important}")
        deck.set_viewport_size({"width": 1920, "height": 1080})
        with tempfile.TemporaryDirectory(prefix="low-alt-pdf-") as temp_dir:
            slide_images = []
            for i in range(measurements["slides"]):
                deck.evaluate(f"window.__deck.go({i})")
                deck.wait_for_timeout(360)
                image_path = Path(temp_dir) / f"slide-{i + 1:02d}.png"
                deck.locator(".slide.active").screenshot(path=str(image_path), animations="disabled")
                slide_images.append(image_path)
            pdf = fitz.open()
            for image_path in slide_images:
                pdf_page = pdf.new_page(width=960, height=540)
                pdf_page.insert_image(pdf_page.rect, filename=str(image_path))
            pdf.set_metadata({"title": "LOW / ALT · מצגת מעבדת המשחקים", "author": "Ariel Aizenshtat"})
            pdf.save(ROOT / "presentation" / "low-alt-deck.pdf", garbage=4, deflate=True)
            measurements["pdf_pages"] = len(pdf)
            pdf.close()
        browser.close()
finally:
    server.shutdown()
    server.server_close()

report = {"ok": not errors, "base": base, "measurements": measurements, "errors": errors, "screenshots": sorted(p.name for p in ARTIFACTS.glob("*.png"))}
(ROOT / "qa" / "browser-smoke.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, ensure_ascii=False, indent=2))
if errors:
    raise SystemExit(1)
