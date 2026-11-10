#!/usr/bin/env python3
"""Copy text from content/site.json into the static parts of index.html.

Keeps the no-JavaScript version of the page in sync with the content file.
Run from the repo root after editing site.json:  python3 tools/sync_static.py
Only elements with data-field="..." or data-links on a single line are touched.
"""
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
site = json.loads((ROOT / "content/site.json").read_text())
page = (ROOT / "index.html").read_text()


def get(obj, path):
    for k in path.split("."):
        obj = obj.get(k) if isinstance(obj, dict) else None
    return obj


def sub_field(m):
    value = get(site, m.group("field"))
    if value is None:
        return m.group(0)
    return f"{m.group('open')}{html.escape(str(value))}{m.group('close')}"


page = re.sub(
    r'(?P<open><(?P<tag>\w+)[^>]*\bdata-field="(?P<field>[^"]+)"[^>]*>)(?P<body>[^<]*)(?P<close></(?P=tag)>)',
    sub_field, page)


def link_row():
    L = site.get("links") or {}
    items = []
    if L.get("email"): items.append(("Email", "mailto:" + L["email"]))
    if L.get("cv_pdf"): items.append(("CV", L["cv_pdf"]))
    if L.get("scholar"): items.append(("Google Scholar", L["scholar"]))
    if L.get("github"): items.append(("GitHub", L["github"]))
    if L.get("linkedin"): items.append(("LinkedIn", L["linkedin"]))
    if L.get("x"): items.append(("X", L["x"]))
    if L.get("orcid"): items.append(("ORCID", L["orcid"]))
    return " /\n          ".join(f'<a href="{html.escape(h, quote=True)}">{html.escape(t)}</a>' for t, h in items)


page = re.sub(
    r'(?P<open><p class="link-row" data-links>)\s*.*?\s*(?P<close></p>)',
    lambda m: f"{m.group('open')}\n          {link_row()}\n        {m.group('close')}",
    page, flags=re.S)

(ROOT / "index.html").write_text(page)
print("index.html synced from content/site.json")
