#!/usr/bin/env python3
"""Generate one $19 single-template product per prompt in the three Grok packs.

Reads the review drafts in ~/workspace/goals/nightshift-storefront-build/files/
(grok-templates-contractors.md, grok-templates-construction.md,
grok-templates-commercial-cleaning.md) and writes generated blocks into:

  - src/lib/catalog.ts (SEED_PRODUCTS entries, listed: true, $19 each)
  - src/lib/commerce/grok-template-deliverables.ts (one downloadable .md per single)

The blocks are delimited by BEGIN/END GENERATED GROK SINGLES markers, so
re-running this script replaces them instead of duplicating. Do NOT hand-edit
between the markers.

Run from the repo root:  python3 scripts/generate-grok-singles.py
"""
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRAFT_DIR = os.path.expanduser(
    "~/workspace/goals/nightshift-storefront-build/files"
)

TRADES = [
    # (draft file, trade slug, trade display name, niche, pack title, pack audience)
    (
        "grok-templates-contractors.md",
        "contractors",
        "contractors",
        "Contractors",
        "Grok Templates for Contractors",
        "General contractors and small trade crews who need client-ready paperwork fast and want the model to draft it from their own job details. For contractors only — not for shopkeepers, teachers, small studio owners, or newsletter writers.",
    ),
    (
        "grok-templates-construction.md",
        "construction",
        "construction",
        "Construction",
        "Grok Templates for Construction",
        "Construction workers and small crews running projects who need estimates, logs, and updates in writing without spending the evening on them. For construction workers only — not for shopkeepers, teachers, small studio owners, or newsletter writers.",
    ),
    (
        "grok-templates-commercial-cleaning.md",
        "commercial-cleaning",
        "commercial cleaning",
        "Commercial cleaning",
        "Grok Templates for Commercial Cleaning",
        "Commercial cleaners and cleaning crews who want consistent quotes, checklists, and client messages for every account. For commercial cleaners only — not for shopkeepers, teachers, small studio owners, or newsletter writers.",
    ),
]


def slugify(text):
    s = text.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def parse_draft(path):
    """Return list of (category, template name, prompt text)."""
    text = open(path).read()
    lines = text.split("\n")
    templates = []
    category = ""
    current = None  # [name, [prompt lines]]
    in_fence = False
    for line in lines:
        m2 = re.match(r"^##\s+(?:\d+\.\s+)?(.*\S)\s*$", line)
        m3 = re.match(r"^###\s+(.*\S)\s*$", line)
        if m2 and not line.startswith("###"):
            category = m2.group(1).strip()
            continue
        if m3:
            if current is not None:
                templates.append((category, current[0], "\n".join(current[1]).strip()))
            current = [m3.group(1).strip(), []]
            in_fence = False
            continue
        if line.strip() == "```":
            in_fence = not in_fence
            continue
        if in_fence and current is not None:
            current[1].append(line)
    if current is not None:
        templates.append((category, current[0], "\n".join(current[1]).strip()))
    return templates


def ts_str(s):
    """Render a Python string as a double-quoted TS string literal."""
    return json.dumps(s, ensure_ascii=False)


def catalog_entry(t, idx):
    trade_slug, trade_name, niche, pack_title, audience = (
        t["trade_slug"],
        t["trade_name"],
        t["niche"],
        t["pack_title"],
        t["audience"],
    )
    name = t["name"]
    tagline = f"One copy-paste Grok prompt for {trade_name}: {name.lower()}."
    gumroad = (
        f"One copy-paste Grok prompt for {trade_name} — {name}. "
        "Paste it into Grok, fill in the blanks with your own job details, "
        "and read the result before you send it."
    )
    sales = (
        f"Just need the one prompt, not the whole pack? This is the {name} prompt "
        f"from the {pack_title} pack, on its own. Paste it into Grok, fill in every "
        "blank with the real job facts, and check the result before you send it. "
        f"Same prompt as in the full pack — buy the single if this is the only one "
        f"you need, or the pack if you want them all."
    )
    tweet = (
        f"One prompt, one job done: {name} for {trade_name}. "
        "Paste, fill in the blanks, check it, send it."
    )
    email_subject = f"One prompt for {name.lower()}"
    email_body = (
        f"Paste the {name} prompt into Grok, fill in every blank with the real "
        "job facts, and read the result before you send it. If a blank is empty, "
        "the output is not ready — the blanks are the whole point."
    )
    howto = (
        "Paste the prompt into Grok, fill in every bracketed blank with your own "
        "job details, and read the result carefully before you send it to a client, "
        "subcontractor, or crew member. The prompt refuses to invent prices, dates, "
        "or services you did not list — if a blank is empty, fill it in first."
    )
    covers = (
        f"This single covers one job from the {t['category']} section of the "
        f"{pack_title} pack: {name}. It is the same prompt that ships in the full "
        f"pack — sold on its own for buyers who only need this one."
    )
    return f"""  {{
    id: {ts_str(t["id"])},
    slug: {ts_str(t["slug"])},
    title: {ts_str(name)},
    tagline: {ts_str(tagline)},
    niche: {ts_str(niche)},
    type: "prompt-pack",
    priceUsd: GROK_SINGLE_TEMPLATE_PRICE_USD,
    audience: {ts_str(audience)},
    listed: true,
    source: "seed",
    createdAt: t0 + {100 + idx},
    tags: ["grok", "prompts", {ts_str(trade_slug)}, "single"],
    gumroadDescription: {ts_str(gumroad)},
    salesPage: {ts_str(sales)},
    tweets: [
      {ts_str(tweet)},
    ],
    emails: [
      {{
        subject: {ts_str(email_subject)},
        body: {ts_str(email_body)},
      }},
    ],
    sections: [
      {{
        heading: "How to use this template",
        body: {ts_str(howto)},
      }},
      {{
        heading: "What it covers",
        body: {ts_str(covers)},
      }},
    ],
  }},"""


def deliverable_entry(t):
    name = t["name"]
    doc = (
        f"# {name}\n\n"
        "## How to use this template\n\n"
        "Paste the prompt below into Grok, fill in every bracketed blank with "
        "your own job details, and read the result carefully before you send it "
        "to a client, subcontractor, or crew member. This prompt is a generic "
        "starting point — it contains no company names, prices, or certifications, "
        "so add only details that are true for your own business.\n\n"
        "---\n\n"
        f"## {name}\n\n"
        "```\n"
        f"{t['prompt']}\n"
        "```\n"
    )
    return f"""  {{
    productId: {ts_str(t["id"])},
    filename: {ts_str(t["slug"] + ".md")},
    mimeType: "text/markdown",
    content: {ts_str(doc)},
  }},"""


def replace_block(path, begin, end, block, anchor=None):
    s = open(path).read()
    if begin in s and end in s:
        # Slice, never re.sub: the block holds TS string escapes (\\n, \\")
        # and re.sub's replacement would rewrite those backslashes.
        b = s.index(begin)
        e = s.index(end) + len(end)
        s = s[:b] + begin + "\n" + block + "\n" + end + s[e:]
    else:
        # Insert before the array close. `anchor` pins which close it is:
        # catalog.ts has other arrays after SEED_PRODUCTS, so anchor on the
        # text right after its close; the deliverables file is one array.
        if anchor is not None:
            idx = s.index(anchor)
        else:
            idx = s.rfind("\n];")
            assert idx != -1, f"no array close found in {path}"
        head, tail = s[:idx], s[idx:]
        # The last existing entry may close without a trailing comma; the
        # generated block adds more entries, so it needs one.
        if head.rstrip().endswith("}") and not head.rstrip().endswith("},"):
            head = head.rstrip() + ",\n"
        s = head + begin + "\n" + block + "\n" + end + "\n" + tail
    open(path, "w").write(s)


def main():
    templates = []
    for fname, trade_slug, trade_name, niche, pack_title, audience in TRADES:
        parsed = parse_draft(os.path.join(DRAFT_DIR, fname))
        assert parsed, f"no templates parsed from {fname}"
        for category, name, prompt in parsed:
            assert prompt, f"empty prompt for {name} in {fname}"
            slug = f"grok-template-{trade_slug}-{slugify(name)}"
            templates.append(
                {
                    "id": f"seed_grok_single_{trade_slug}_{slugify(name)}",
                    "slug": slug,
                    "name": name,
                    "category": category,
                    "prompt": prompt,
                    "trade_slug": trade_slug,
                    "trade_name": trade_name,
                    "niche": niche,
                    "pack_title": pack_title,
                    "audience": audience,
                }
            )
    # Ids and slugs must be unique.
    assert len({t["id"] for t in templates}) == len(templates), "duplicate ids"
    assert len({t["slug"] for t in templates}) == len(templates), "duplicate slugs"

    catalog_block = "\n".join(
        catalog_entry(t, i) for i, t in enumerate(templates)
    )
    deliverable_block = "\n".join(deliverable_entry(t) for t in templates)

    replace_block(
        os.path.join(REPO, "src/lib/catalog.ts"),
        "// --- BEGIN GENERATED GROK SINGLES ---",
        "// --- END GENERATED GROK SINGLES ---",
        catalog_block,
        anchor="];\n\nexport function productToMarkdown",
    )
    replace_block(
        os.path.join(REPO, "src/lib/commerce/grok-template-deliverables.ts"),
        "// --- BEGIN GENERATED GROK SINGLES ---",
        "// --- END GENERATED GROK SINGLES ---",
        deliverable_block,
    )

    from collections import Counter

    counts = Counter(t["trade_slug"] for t in templates)
    print(f"singles generated: {len(templates)} total ({dict(counts)})")
    for t in templates:
        print(f"  {t['id']}  ${19}  {t['name']}")


if __name__ == "__main__":
    main()
