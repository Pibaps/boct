#!/usr/bin/env python3
"""
Fetch Blood on the Clocktower role pages and archive them locally.

The goal is to keep a complete, reproducible cache of the wiki pages for every
role, plus a machine-readable manifest with the most useful sections.

Outputs are intentionally written under /local-implementation so they stay out
of git history.
"""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
import time
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Optional
from urllib import error, parse, request

USER_AGENT = "BOCT-RolePageFetcher/1.0 (+local project tooling)"
WIKI_BASE = "https://wiki.bloodontheclocktower.com"
EDITION_URLS = [
    ("trouble-brewing", f"{WIKI_BASE}/index.php/Trouble_Brewing"),
    ("bad-moon-rising", f"{WIKI_BASE}/index.php/Bad_Moon_Rising"),
    ("sects-and-violets", f"{WIKI_BASE}/index.php/Sects_%26_Violets"),
    ("experimental", f"{WIKI_BASE}/index.php/Experimental"),
    ("travellers", f"{WIKI_BASE}/index.php/Travellers"),
    ("fabled", f"{WIKI_BASE}/index.php/Fabled"),
]

ROLE_SECTION_PATTERNS = {
    "townsfolk": r"Townsfolk",
    "outsider": r"Outsiders?",
    "minion": r"Minions?",
    "demon": r"Demons?",
    "traveller": r"Travellers?",
    "fabled": r"Fabled",
}

SKIP_TITLE_TOKENS = {
    "file",
    "image",
    "enlarge",
    "icon",
    "logo",
    "main page",
    "special:categories",
    "special:recentchanges",
    "special:random",
}


@dataclass
class RoleLink:
    edition: str
    role_type: str
    name: str
    title: str
    href: str
    page_url: str


@dataclass
class RolePageRecord:
    edition: str
    role_type: str
    name: str
    title: str
    page_url: str
    local_html_path: str
    local_text_path: str
    sections: dict[str, str] = field(default_factory=dict)
    summary: str = ""
    how_to_run: str = ""
    tips_and_tricks: str = ""
    bluffing_as: str = ""


def fetch_url(url: str, timeout: int) -> str:
    req = request.Request(url, headers={"User-Agent": USER_AGENT})
    with request.urlopen(req, timeout=timeout) as response:
        return response.read().decode("utf-8", errors="replace")


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = value.replace("&", "and")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def strip_html(raw_html: str) -> str:
    cleaned = re.sub(r"<br\s*/?>", "\n", raw_html, flags=re.IGNORECASE)
    cleaned = re.sub(r"</p>|</li>|</h[1-6]>", "\n", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"<li[^>]*>", "- ", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"<[^>]+>", " ", cleaned)
    cleaned = html.unescape(cleaned)
    cleaned = re.sub(r"[\t\r ]+", " ", cleaned)
    cleaned = re.sub(r"\n\s+", "\n", cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()


def extract_sections(page_html: str) -> tuple[dict[str, str], str]:
    heading_pattern = re.compile(
        r'<h2[^>]*>.*?<span class="mw-headline"[^>]*>(.*?)</span>.*?</h2>',
        re.IGNORECASE | re.DOTALL,
    )

    matches = list(heading_pattern.finditer(page_html))
    sections: dict[str, str] = {}
    title = ""

    for index, match in enumerate(matches):
        heading = strip_html(match.group(1))
        if not title and heading:
            title = heading

        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(page_html)
        section_html = page_html[start:end]
        section_text = strip_html(section_html)
        if section_text:
            sections[heading.lower()] = section_text

    if not title:
        h1_match = re.search(r'<h1[^>]*id="firstHeading"[^>]*>(.*?)</h1>', page_html, re.IGNORECASE | re.DOTALL)
        if h1_match:
            title = strip_html(h1_match.group(1))

    return sections, title


def extract_role_links_from_edition_html(html_text: str, edition: str) -> list[RoleLink]:
    links: list[RoleLink] = []
    seen: set[tuple[str, str]] = set()

    for role_type, pattern in ROLE_SECTION_PATTERNS.items():
        section_pattern = re.compile(
            rf'<h2[^>]*>.*?<span class="mw-headline"[^>]*>{pattern}</span>.*?</h2>(.*?)(?=<h2[^>]*>|\Z)',
            re.IGNORECASE | re.DOTALL,
        )
        match = section_pattern.search(html_text)
        if not match:
            continue

        section_content = match.group(1)
        for href, title in re.findall(r'<a href="([^"]+)"[^>]*title="([^"]+)"[^>]*>', section_content, re.IGNORECASE):
            clean_title = strip_html(title)
            clean_title_lower = clean_title.lower()
            if clean_title_lower in SKIP_TITLE_TOKENS:
                continue
            if clean_title.startswith(("Special:", "File:", "Category:")):
                continue

            role_id = slugify(clean_title)
            key = (role_id, edition)
            if key in seen:
                continue
            seen.add(key)

            page_url = parse.urljoin(WIKI_BASE, href)
            links.append(
                RoleLink(
                    edition=edition,
                    role_type=role_type,
                    name=clean_title,
                    title=clean_title,
                    href=href,
                    page_url=page_url,
                )
            )

    return links


def fetch_edition_roles(edition: str, url: str, timeout: int) -> list[RoleLink]:
    print(f"[*] Scraping edition page: {edition}")
    page_html = fetch_url(url, timeout=timeout)
    role_links = extract_role_links_from_edition_html(page_html, edition)
    print(f"[+] Found {len(role_links)} role links in {edition}")
    return role_links


def save_page(record: RolePageRecord, html_text: str, text: str, project_root: Path, output_dir: Path) -> None:
    html_path = project_root / record.local_html_path
    text_path = project_root / record.local_text_path
    html_path.parent.mkdir(parents=True, exist_ok=True)
    text_path.parent.mkdir(parents=True, exist_ok=True)
    html_path.write_text(html_text, encoding="utf-8")
    text_path.write_text(text, encoding="utf-8")

    manifest_path = output_dir / "manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)


def build_record(link: RoleLink, page_html: str, project_root: Path, output_dir: Path) -> RolePageRecord:
    sections, page_title = extract_sections(page_html)
    role_slug = slugify(link.name or page_title or link.title)
    edition_slug = slugify(link.edition)

    local_html_path = f"local-implementation/botc-role-pages/{edition_slug}/{link.role_type}/{role_slug}.html"
    local_text_path = f"local-implementation/botc-role-pages/{edition_slug}/{link.role_type}/{role_slug}.txt"

    summary = sections.get("summary", "")
    how_to_run = sections.get("how to run", "")
    tips_and_tricks = sections.get("tips & tricks", "") or sections.get("tips and tricks", "")
    bluffing_as = sections.get(f"bluffing as the {page_title.lower()}".strip(), "")

    text_sections = []
    for key in ["summary", "how to run", "examples", "tips & tricks", "bluffing as the"]:
        pass

    plain_text = []
    for section_name, section_text in sections.items():
        plain_text.append(f"## {section_name.upper()}\n{section_text}\n")

    return RolePageRecord(
        edition=link.edition,
        role_type=link.role_type,
        name=link.name,
        title=page_title or link.title,
        page_url=link.page_url,
        local_html_path=local_html_path,
        local_text_path=local_text_path,
        sections=sections,
        summary=summary,
        how_to_run=how_to_run,
        tips_and_tricks=tips_and_tricks,
        bluffing_as=bluffing_as,
    )


def write_manifest(records: list[RolePageRecord], output_dir: Path) -> None:
    payload = {
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "count": len(records),
        "records": [asdict(record) for record in records],
    }
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "manifest.json").write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Fetch and archive BotC role pages.")
    parser.add_argument("--output-dir", default="local-implementation/botc-role-pages", help="Where to save the archived pages.")
    parser.add_argument("--timeout", type=int, default=30, help="HTTP timeout in seconds.")
    parser.add_argument("--delay-ms", type=int, default=150, help="Delay between page fetches.")
    parser.add_argument("--editions", nargs="*", default=[edition for edition, _ in EDITION_URLS], help="Editions to include.")
    parser.add_argument("--limit", type=int, default=0, help="Optional maximum number of pages to archive.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    project_root = Path(__file__).resolve().parents[1]
    output_dir = project_root / args.output_dir

    all_records: list[RolePageRecord] = []

    for edition, edition_url in EDITION_URLS:
        if edition not in args.editions:
            continue

        try:
            role_links = fetch_edition_roles(edition, edition_url, timeout=max(1, args.timeout))
        except (error.URLError, TimeoutError, ValueError) as exc:
            print(f"[!] Failed to fetch edition page for {edition}: {exc}", file=sys.stderr)
            continue

        for link in role_links:
            if args.limit > 0 and len(all_records) >= args.limit:
                break

            try:
                page_html = fetch_url(link.page_url, timeout=max(1, args.timeout))
            except (error.URLError, TimeoutError, ValueError) as exc:
                print(f"[!] Failed to fetch role page {link.page_url}: {exc}", file=sys.stderr)
                continue

            record = build_record(link, page_html, project_root=project_root, output_dir=output_dir)
            save_page(record, page_html, strip_html(page_html), project_root, output_dir)
            all_records.append(record)
            print(f"[saved] {record.page_url} -> {record.local_html_path}")

            if args.delay_ms > 0:
                time.sleep(args.delay_ms / 1000.0)

        if args.limit > 0 and len(all_records) >= args.limit:
            break

    write_manifest(all_records, output_dir)
    print(f"[OK] Archived {len(all_records)} role pages into {output_dir}")
    print(f"[OK] Manifest written to {output_dir / 'manifest.json'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
