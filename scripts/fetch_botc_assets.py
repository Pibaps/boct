#!/usr/bin/env python3
"""
Crawl approved Blood on the Clocktower pages and download image assets.

Important:
- This script is designed to respect robots.txt by default.
- You are responsible for usage rights and attribution before publishing assets.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import mimetypes
import os
import re
import sys
import time
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable
from urllib import error, parse, request, robotparser

DEFAULT_SEEDS = [
    "https://wiki.bloodontheclocktower.com",
    "https://bloodontheclocktower.com/",
    "https://quiz.bloodontheclocktower.com",
    "https://bloodontheclocktower.com/pages/custom-scripts#scripts",
]

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".svg", ".avif", ".gif"}
ALLOWED_SCHEMES = {"http", "https"}
USER_AGENT = "BOCT-AssetFetcher/1.0 (+local project tooling)"


@dataclass
class DownloadedAsset:
    source_url: str
    page_url: str
    local_path: str
    content_type: str
    size_bytes: int


class LinkAndImageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: set[str] = set()
        self.images: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {k.lower(): (v or "").strip() for k, v in attrs}

        if tag.lower() == "a":
            href = attr_map.get("href")
            if href:
                self.links.add(href)

        if tag.lower() == "img":
            src = attr_map.get("src")
            srcset = attr_map.get("srcset")
            if src:
                self.images.add(src)
            if srcset:
                self.images.update(parse_srcset(srcset))

        if tag.lower() == "source":
            srcset = attr_map.get("srcset")
            if srcset:
                self.images.update(parse_srcset(srcset))

        if tag.lower() == "meta":
            prop = attr_map.get("property") or attr_map.get("name")
            content = attr_map.get("content")
            if prop and content and prop.lower() in {"og:image", "twitter:image"}:
                self.images.add(content)


def parse_srcset(srcset: str) -> set[str]:
    urls: set[str] = set()
    for chunk in srcset.split(","):
        token = chunk.strip().split(" ")[0].strip()
        if token:
            urls.add(token)
    return urls


def normalize_url(base_url: str, raw_url: str) -> str | None:
    if not raw_url:
        return None

    raw_url = raw_url.strip()
    if raw_url.startswith("data:") or raw_url.startswith("javascript:"):
        return None

    full = parse.urljoin(base_url, raw_url)
    parsed = parse.urlparse(full)
    if parsed.scheme not in ALLOWED_SCHEMES:
        return None

    # Drop URL fragments for dedupe.
    clean = parsed._replace(fragment="")
    return parse.urlunparse(clean)


def canonical_image_key(url: str) -> str:
    """Normalize variant URLs (e.g. ?width=...) so we keep one file per logical image."""
    parsed = parse.urlparse(url)
    query_pairs = parse.parse_qsl(parsed.query, keep_blank_values=True)
    filtered_pairs = [(k, v) for k, v in query_pairs if k.lower() not in {"width", "height"}]
    normalized_query = parse.urlencode(filtered_pairs, doseq=True)
    canonical = parsed._replace(query=normalized_query, fragment="")
    return parse.urlunparse(canonical)


def get_domain(url: str) -> str:
    return parse.urlparse(url).netloc.lower()


def is_image_url(url: str) -> bool:
    path = parse.urlparse(url).path.lower()
    ext = os.path.splitext(path)[1]
    return ext in IMAGE_EXTS


def looks_like_html_url(url: str) -> bool:
    path = parse.urlparse(url).path.lower()
    ext = os.path.splitext(path)[1]
    return ext in {"", ".html", ".htm", ".php", ".asp", ".aspx"}


class RobotsCache:
    def __init__(self, enabled: bool) -> None:
        self.enabled = enabled
        self.cache: dict[str, robotparser.RobotFileParser] = {}

    def can_fetch(self, url: str, user_agent: str) -> bool:
        if not self.enabled:
            return True

        domain = get_domain(url)
        if domain not in self.cache:
            rp = robotparser.RobotFileParser()
            rp.set_url(f"{parse.urlparse(url).scheme}://{domain}/robots.txt")
            try:
                rp.read()
            except Exception:
                # If robots is unreachable, default to conservative allow for now.
                pass
            self.cache[domain] = rp

        return self.cache[domain].can_fetch(user_agent, url)


def fetch_url(url: str, timeout: int) -> tuple[bytes, str]:
    req = request.Request(url, headers={"User-Agent": USER_AGENT})
    with request.urlopen(req, timeout=timeout) as resp:
        body = resp.read()
        content_type = resp.headers.get_content_type() or "application/octet-stream"
    return body, content_type


def safe_filename(url: str, content_type: str) -> str:
    parsed = parse.urlparse(url)
    raw_name = os.path.basename(parsed.path) or "asset"
    stem, ext = os.path.splitext(raw_name)

    if ext.lower() not in IMAGE_EXTS:
        guessed_ext = mimetypes.guess_extension(content_type) or ""
        if guessed_ext in {".jpe", ".jfif"}:
            guessed_ext = ".jpg"
        ext = guessed_ext if guessed_ext in IMAGE_EXTS else ".bin"

    digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:10]
    safe_stem = re.sub(r"[^a-zA-Z0-9_-]", "-", stem)[:60] or "asset"
    return f"{safe_stem}-{digest}{ext}"


def write_manifest(path: Path, assets: list[DownloadedAsset]) -> None:
    payload = {
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "count": len(assets),
        "assets": [
            {
                "sourceUrl": a.source_url,
                "pageUrl": a.page_url,
                "localPath": a.local_path.replace("\\", "/"),
                "contentType": a.content_type,
                "sizeBytes": a.size_bytes,
                "license": "TODO",
                "attribution": "TODO",
            }
            for a in assets
        ],
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=True), encoding="utf-8")


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def load_character_ids(characters_ts: Path) -> list[str]:
    if not characters_ts.exists():
        return []
    text = characters_ts.read_text(encoding="utf-8")
    return sorted(set(re.findall(r'id:\s*"([a-z0-9-]+)"', text)))


def generate_artwork_map(
    assets: list[DownloadedAsset],
    project_root: Path,
    output_path: Path,
) -> None:
    character_ids = load_character_ids(project_root / "src" / "data" / "characters.ts")
    candidates: dict[str, str] = {}

    def to_web_path(local_path: str) -> str:
        normalized = local_path.replace("\\", "/")
        if normalized.startswith("public/"):
            return "/" + normalized[len("public/") :]
        return "/" + normalized

    def has_character_id(corpus: str, char_id: str) -> bool:
        escaped = re.escape(char_id).replace("\\-", "[-_ ]")
        exact_pattern = re.compile(rf"(?<![a-z0-9]){escaped}(?![a-z0-9])")
        if exact_pattern.search(corpus):
            return True

        squashed = char_id.replace("-", "")
        if squashed != char_id:
            squashed_pattern = re.compile(rf"(?<![a-z0-9]){re.escape(squashed)}(?![a-z0-9])")
            return bool(squashed_pattern.search(corpus))

        return False

    # Use source URL + local filename as matching corpus.
    for asset in assets:
        corpus = f"{asset.source_url} {Path(asset.local_path).name}".lower()
        for char_id in character_ids:
            if char_id in candidates:
                continue
            if has_character_id(corpus, char_id):
                candidates[char_id] = to_web_path(asset.local_path)

    edition_keywords = {
        "trouble-brewing": ["trouble-brewing", "troublebrewing", "trouble_brewing", "logo_trouble_brewing"],
        "bad-moon-rising": ["bad-moon-rising", "badmoonrising", "bad_moon_rising", "logo_bad_moon_rising"],
        "sects-and-violets": ["sects-and-violets", "sects-violets", "sects_and_violets", "logo_sects_and_violets"],
        "experimental": ["experimental"],
    }

    edition_map: dict[str, str] = {}
    for asset in assets:
        corpus = f"{asset.source_url} {Path(asset.local_path).name}".lower()
        for edition, keys in edition_keywords.items():
            if edition in edition_map:
                continue
            if any(k in corpus for k in keys):
                edition_map[edition] = to_web_path(asset.local_path)

    lines = [
        "export const characterArtwork: Record<string, string> = {",
    ]
    for cid in sorted(candidates):
        lines.append(f'  "{cid}": "{candidates[cid]}",')
    lines.append("};")
    lines.append("")
    lines.append("export const editionArtwork: Record<string, string> = {")
    for edition in ["trouble-brewing", "bad-moon-rising", "sects-and-violets", "experimental"]:
        if edition in edition_map:
            lines.append(f'  "{edition}": "{edition_map[edition]}",')
    lines.append("};")
    lines.append("")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines), encoding="utf-8")


def crawl_and_download(
    seeds: Iterable[str],
    project_root: Path,
    output_dir: Path,
    max_pages: int,
    max_images: int,
    timeout: int,
    respect_robots: bool,
    delay_ms: int,
) -> list[DownloadedAsset]:
    normalized_seeds = [normalize_url(url, url) for url in seeds]
    queue = [u for u in normalized_seeds if u]
    visited_pages: set[str] = set()
    queued_pages: set[str] = set(queue)
    seen_images: set[str] = set()

    allowed_domains = {get_domain(u) for u in queue}
    robots = RobotsCache(enabled=respect_robots)
    downloaded: list[DownloadedAsset] = []

    while queue and len(visited_pages) < max_pages:
        page_url = queue.pop(0)
        if page_url in visited_pages:
            continue
        if get_domain(page_url) not in allowed_domains:
            continue
        if not robots.can_fetch(page_url, USER_AGENT):
            print(f"[skip robots] {page_url}")
            visited_pages.add(page_url)
            continue

        try:
            body, content_type = fetch_url(page_url, timeout)
        except (error.URLError, TimeoutError, ValueError) as exc:
            print(f"[page error] {page_url} :: {exc}")
            visited_pages.add(page_url)
            continue

        visited_pages.add(page_url)
        if not content_type.startswith("text/html"):
            continue

        parser = LinkAndImageParser()
        try:
            parser.feed(body.decode("utf-8", errors="ignore"))
        except Exception as exc:
            print(f"[parse error] {page_url} :: {exc}")
            continue

        for raw_link in parser.links:
            link_url = normalize_url(page_url, raw_link)
            if not link_url:
                continue
            if get_domain(link_url) not in allowed_domains:
                continue
            if link_url in visited_pages or link_url in queued_pages:
                continue
            if looks_like_html_url(link_url):
                queue.append(link_url)
                queued_pages.add(link_url)

        for raw_img in parser.images:
            img_url = normalize_url(page_url, raw_img)
            if not img_url:
                continue
            img_key = canonical_image_key(img_url)
            if img_key in seen_images:
                continue
            if get_domain(img_url) not in allowed_domains:
                continue
            if not robots.can_fetch(img_url, USER_AGENT):
                print(f"[skip robots image] {img_url}")
                continue
            if not is_image_url(img_url):
                # Keep a lightweight filter for extension-less URLs.
                pass

            seen_images.add(img_key)
            try:
                img_bytes, img_type = fetch_url(img_url, timeout)
            except (error.URLError, TimeoutError, ValueError) as exc:
                print(f"[image error] {img_url} :: {exc}")
                continue

            if not img_type.startswith("image/"):
                continue

            domain = get_domain(img_url)
            target_dir = output_dir / domain
            target_dir.mkdir(parents=True, exist_ok=True)
            filename = safe_filename(img_url, img_type)
            target_path = target_dir / filename
            target_path.write_bytes(img_bytes)
            rel_path = target_path.relative_to(project_root)

            downloaded.append(
                DownloadedAsset(
                    source_url=img_url,
                    page_url=page_url,
                    local_path=str(rel_path).replace("\\", "/"),
                    content_type=img_type,
                    size_bytes=len(img_bytes),
                )
            )
            print(f"[saved] {img_url} -> {target_path}")

            if len(downloaded) >= max_images:
                return downloaded

            if delay_ms > 0:
                time.sleep(delay_ms / 1000.0)

    return downloaded


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Fetch BOCT image assets from approved seed URLs.")
    parser.add_argument("--seed", action="append", default=[], help="Seed URL (can be repeated).")
    parser.add_argument("--max-pages", type=int, default=120, help="Maximum HTML pages to crawl.")
    parser.add_argument("--max-images", type=int, default=1500, help="Maximum images to download.")
    parser.add_argument("--timeout", type=int, default=20, help="HTTP timeout in seconds.")
    parser.add_argument("--delay-ms", type=int, default=150, help="Delay between image requests.")
    parser.add_argument("--no-robots", action="store_true", help="Disable robots.txt checks.")
    parser.add_argument(
        "--output-dir",
        default="public/assets/botc",
        help="Directory where downloaded images will be stored.",
    )
    parser.add_argument(
        "--manifest",
        default="public/assets/botc/manifest.json",
        help="JSON manifest output path.",
    )
    parser.add_argument(
        "--artwork-map",
        default="src/data/characterArtwork.ts",
        help="TypeScript map output path used by the UI.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    project_root = Path(__file__).resolve().parents[1]

    seeds = args.seed if args.seed else DEFAULT_SEEDS
    print("Seeds:")
    for s in seeds:
        print(f"- {s}")

    output_dir = project_root / args.output_dir
    manifest_path = project_root / args.manifest
    artwork_map_path = project_root / args.artwork_map

    assets = crawl_and_download(
        seeds=seeds,
        project_root=project_root,
        output_dir=output_dir,
        max_pages=max(1, args.max_pages),
        max_images=max(1, args.max_images),
        timeout=max(1, args.timeout),
        respect_robots=not args.no_robots,
        delay_ms=max(0, args.delay_ms),
    )

    write_manifest(manifest_path, assets)
    generate_artwork_map(assets, project_root=project_root, output_path=artwork_map_path)

    print(f"Downloaded images: {len(assets)}")
    print(f"Manifest: {manifest_path}")
    print(f"Artwork map: {artwork_map_path}")
    print("Review license/attribution fields in manifest before publishing.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
