#!/usr/bin/env python3
"""Copy text from content/site.json into the static parts of index.html.

Keeps the no-JavaScript version of the page in sync with the content file.
Run from the repo root after editing site.json:  python3 tools/sync_static.py
Touches: single-line data-field elements, data-links rows, data-portrait,
data-email-obf. The plain email address and "mailto:" never appear in the HTML;
js/render.js builds the real link at runtime.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
site = json.loads((ROOT / "content/site.json").read_text())
page = (ROOT / "index.html").read_text()
L = site.get("links") or {}


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
    items = []
    if L.get("email"): items.append(("Email", "#contact"))
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

# Portrait, static so it shows without JavaScript.
portrait = (site.get("files") or {}).get("portrait")
img = (f'<img src="assets/img/{html.escape(portrait, quote=True)}" alt="Portrait of {html.escape(site["name"])}" '
       f'width="160" height="160" decoding="async">') if portrait else ""
page = re.sub(r'(<div class="hero-portrait" data-portrait>).*?(</div>)', lambda m: m.group(1) + img + m.group(2), page, flags=re.S)

# Obfuscated email: "user [at] domain [dot] tld" in the HTML, real address assembled in JS.
if L.get("email"):
    user, domain = L["email"].split("@", 1)
    shown = f"{user} [at] {domain.replace('.', ' [dot] ')}"
    attrs = f'data-u="{html.escape(user, quote=True)}" data-d="{html.escape(domain, quote=True)}"'
    page = re.sub(r'<span data-render="email" data-email-obf[^>]*>.*?</span>',
                  f'<span data-render="email" data-email-obf {attrs}>{html.escape(shown)}</span>', page, flags=re.S)

(ROOT / "index.html").write_text(page)
print("index.html synced from content/site.json")
