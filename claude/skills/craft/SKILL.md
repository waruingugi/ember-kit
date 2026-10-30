---
name: craft
description: Make any web page or UI beautiful and well made, then prove it. One skill that replaces taste-skill, impeccable, ui-ux-pro-max, auteur, genjutsu, frontend-design, interface-design, antigravity-design-expert and hue. Use it when building, redesigning, polishing or reviewing a page, landing page, site, dashboard, component or form; when someone says "make it beautiful", "make it look less AI", "polish", "critique", "review the design", "deslop"; or before publishing any page. It never sets a look (fonts, colours, theme): ~/.claude/design/DESIGN.md or the project's own theme does that. It adds the process, the craft rules, the anti-slop bans, the UX rules, the scanners and the review.
---

# Craft

The look comes from `~/.claude/design/DESIGN.md` (or the project's own theme,
after asking the owner, per *Ask first*). This skill never picks fonts, colours,
radii, shadows or a theme. It makes sure whatever look is in force is used
well, and proves it with screenshots and scanners.

**Who wins:** DESIGN.md > the project's theme (once chosen) > this skill.
When a rule here fights DESIGN.md, DESIGN.md wins and the rule is skipped.
`house.md` lists the known clashes, so you don't have to rediscover them.

Files:
- `rules.md`: the craft rules (layout, type, copy, states, forms, motion, scroll scenes, responsive, depth) and the bans.
- `review.md`: how to review a page (the six lenses, severity, the false-positive filter, stress tests).
- `house.md`: what the scanners flag that is really house style, the answers the owner settled, and the tools.
- `scripts/scan.sh`: runs all the scanners on a page, a folder or a URL.

## 1. Before any code: the read

Write these lines in your reply (short, plain) before you build. Most of the
quality is decided here.

1. **Reading this as:** `<page kind>` for `<reader>`, mode `Read | Operate | Persuade | Experience`. Ask at most one question, and only if the answer changes the build.
2. **Thesis:** one sentence on what this page must make the reader feel or do. **Guessability test**: if the product category alone could have written it, rewrite it.
3. **The one peak:** where the boldness goes. One wow moment per page, not one per section. Product UI (apps, dashboards, settings) gets no peak, only one small "moment of care".
4. **Reflex check:** name 3 defaults you are rejecting for this page (for example "three equal feature cards", "a centered hero with two buttons", "a stat row of big numbers with no story").
5. **Layout plan:** one row per section: what it shows, its picture, its layout family. A family appears once; 8 sections need at least 4 families. No third zig-zag in a row.
6. **Motion budget:** which moments move and why, one reason each. Anything without a reason stays still.

For a big page (5+ sections), show this plan and wait for a go (the owner's rule: the prompt first).

**Options side by side** (when the owner must choose a look, a layout or a motion):
put them on one throwaway preview page, next to each other, with one replay
button that runs them all at once. Use only values from the plan. Say it is a
proposal, not the build, and never copy its markup into the build. If nobody
answers, take the default and mark it UNVALIDATED.

**An existing page:** URL slugs, anchor IDs, nav labels, form field names and
order, analytics hooks and legal copy stay the same unless the owner says so.
Keep its voice and its accessibility wins. Work in the current stack: scan,
diagnose, fix in small diffs. Don't rewrite.

**From a screenshot or mock:** stay faithful to it. Fill unclear details from
DESIGN.md, never from habit.

**Several pages or screens** (a site, an app, a dashboard): build the shell
first (nav, layout, tokens), then the busiest screen, then the rest. Before
building, list each control's variants (`button: primary / ghost / danger`)
and keep to that list.

## 2. Build

Build from the house parts (`~/.claude/design/components/`) and follow
`rules.md`. A part that isn't in `components/` gets one comment line naming
the house rule it follows. The rules that matter most:

- **One focal point per screen.** Squint: one thing should win. Spend colour where it means something.
- **Hierarchy by weight and colour before size.** Promote one thing and demote the rest. Space above a heading is bigger than below it.
- **No card inside a card inside a card.** Bento cells = number of items; no empty cells.
- **Every state exists:** hover, focus, active, disabled (says why), loading, empty, error.
- **Copy:** the button names its result ("Publish"), and the same verb follows through ("Published"). Name things the way the reader thinks of them, not how the system is built. Errors say what failed, why, and how to fix it, without apology. No invented numbers.
- **Motion:** only `transform` and `opacity`; never `transition: all`; never start from `scale(0)`; reduced motion = DESIGN.md's `off` (final state, nothing moves); readable with JS off. Leave an effect out rather than ship it broken.
- **Responsive:** `min-width: 0` on grid and flex children, `100dvh`/`svh` not `100vh`, `overflow: clip` not `hidden` near sticky, inputs ≥ 16 px on phones, touch targets ≥ 44 px, zoom never disabled.

## 3. Verify, once, in a bounded loop

1. Serve over HTTP (`python3 -m http.server 8000`), never `file://`: fallbacks give false passes. Before trusting any screenshot, check the port serves *your* page: `curl -s localhost:8000/<page> | grep -o '<title>.*</title>'` (a failed server can leave another app on that port).
2. Screenshot at 390×844 and 1440×900 (DESIGN.md's sizes), plus 768 for layouts that change there, plus one pass with reduced motion. Use the Playwright MCP, or `shoot.mjs` (`house.md`, *Tools*). Look at every image yourself. Judge fixed and sticky parts only from screen-sized shots: full-page shots draw them in the wrong place.
3. **Did it really render?** Read the computed `font-family` and `font-size` of the `h1` and one body paragraph (a missing font falls back silently). Check that nothing sits stuck at the top with dead space below, and that nothing shown at 1440 is simply gone at 390.
4. **Click through it:** every nav link, the phone menu open and close, an empty form submit, Tab through every control, `Escape` in every overlay, a fast double-click on every toggle.
5. Run `bash ~/.claude/skills/craft/scripts/scan.sh <file | folder | http-url>`. With a URL, impeccable also checks the rendered page. Read each finding against `house.md` before fixing it.
6. Fix everything in **one batch**, in this order: broken task or lost data → missing states → hierarchy and phone layout → looks → cleanup. Take one decoration away. Do **one** confirm pass, then stop. If the same check fails twice, fix the cause or delete the element; don't loop.
7. Then DESIGN.md's own checklist (and its named reviewers: `fixing-accessibility`, `design-motion-principles` audit, `fixing-motion-performance`, `dataviz`).

Report the scan summary lines word for word, in three groups: checked, found,
not checked. Evidence or it didn't happen: a claim of "fixed" names the file
and line, or shows the new screenshot.

## 4. Review (when asked to critique, or before a big page ships)

Follow `review.md`: look at the whole render first, then six lenses, then the
false-positive filter, then the findings that matter, each with what
defaulted, why it costs the reader, and the crafted fix. For a big page, run
the review in a fresh subagent that did not build it.

## Not this skill's job

- Figures: Hairline, Anatomy, Archify, Diagram Design (DESIGN.md's *Pictures*).
- Charts: `dataviz`.
- Motion recipes (tabs, toasts, popovers, modals, reveals): `animate`. Choosing and wiring libraries beyond CSS + GSAP (React, Three.js, Framer Motion, Lenis): `motion-ecosystem`. Both stay on; DESIGN.md says when.
- Proving one finding against the design system in depth: `improve-ui`.
- Writing a new DESIGN.md or tokens file. Never write one; the house one exists.
