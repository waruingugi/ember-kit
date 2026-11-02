# House wins: what the scanners get wrong about our style

The scanners and the merged skills were written for "any site". Some of what
they flag is the owner's house style, settled in `~/.claude/design/DESIGN.md`.
Don't "fix" these. Tested on a real page (2026-10-21).

## Ignore: this is house style

| Flag (tool) | Why it stays |
|---|---|
| `overused-font` Inter, Fraunces, Space Grotesk (impeccable); font bans in taste-skill and auteur | DESIGN.md *Type* picks these five fonts |
| `kicker-above-heading` (impeccable), eyebrow and section-number bans (taste-skill, auteur, genjutsu "numbered eyebrow") | The mono eyebrow `01 ORDER FLOW ——` and the system chip above a card title are house parts |
| `all-caps-body`, `wide-tracking` on mono eyebrows and labels | House eyebrows are small upper-case mono with tracking. Still flag it on real body text |
| `codex-grid-background` (impeccable) | The faint squares grid masked to the gaps is a house part. Flag it only if it shows behind text or a card |
| `pulsing-dot` on the top bar's status badge | DESIGN.md allows one small "live" dot |
| `tell-glass` / `backdrop-filter` on the sticky sidebar and top bar | Blur only on fixed or sticky bars is allowed. Glass on cards is still banned |
| `marquee` on `.callout::before` (the `sweep` glint) | A house component (`components.css`). Counts as the allowed glint |
| Cream / warm paper bans (auteur `CREAM_DEFAULT`) | `--paper #eff2f1` is a cool grey-green; the check does not fire on it |
| One ease curve (genjutsu and the old delphi `animate-skill` want `ease-in` exits; Emil's `animate`, `motion-design` and the `gsap-*` skills bring their own curve tables) | DESIGN.md: one curve, `cubic-bezier(.22,1,.36,1)`. Exits use it too, just shorter |
| Reduced motion "gentler, keep fades" (auteur, genjutsu) | DESIGN.md: reduced motion acts as `off`. Final state, nothing moves |
| `fade-up` on every section called a tell (frontend-design) | DESIGN.md: `fade-up` on every major block is a house part |
| One italic or coloured word in a headline called a tell (frontend-design) | DESIGN.md: every heading has one italic orange phrase |
| Serif display plus warm orange accent called an AI cluster (frontend-design) | That is Fraunces plus `#e14a0e`, the house pick |
| Middle-dot meta strings (frontend-design; genjutsu `tell-dot-run`) | A `·` between two short facts in a meta line or label is house style. Flag three or more on one line |
| Mono small labels (frontend-design, impeccable) | JetBrains Mono labels and eyebrows are house parts |
| hue `validate.mjs` warning `fonts` (Fraunces as display) | House font |
| hue `validate.mjs` `placeholders` inside a code or template block | `{{name}}` shown on purpose in a template sample is content, not a leftover |

## Real: fix these when they show up

| Flag | What to do |
|---|---|
| `low-contrast` on `--dim` (`#929a9e` on paper ≈ 2.7:1) | `--dim` is for faint marks and disabled things, never for text someone must read. Use `--muted` |
| `undersized-ui-text` / `tiny-text` under 11 px | Labels people must read are at least 11 px. Tick marks inside a figure may be smaller |
| `RAW_SCROLL_LISTENER` (slopscan) | The reading-progress bar may listen to scroll, but only through one `requestAnimationFrame` per frame, and no `getBoundingClientRect` loop on every event. Section tracking uses IntersectionObserver |
| `tell-perpetual-motion` other than the live dot or the glint | Remove the loop |
| `gpt-thin-border-wide-shadow` on a resting card or frame | Swap `--shadow-lg` for `--shadow-sm`. The wide shadow belongs only on a lifted object |
| `aphoristic-cadence` ("X. No Y." again and again) | Short sentences are house style, but the same rebuttal rhythm three times is a tell. Vary it |
| hue `css-vars`: a `var(--x)` never defined | Real bug (DESIGN.md *Known traps*). Define it from `tokens.css` or remove it. A var with a fallback set by script (`var(--gx, 20%)`) is fine |
| hue `css-orphans`: a class with no element | Dead CSS, or a missing layout class. Check classes added by script before deleting |
| A GSAP tween with `repeat: -1` on decoration | A loop for show. DESIGN.md: only the live dot and the glint loop |

## Settled by the owner (2026-10-21)

The owner asked Claude to choose; these are now rules in DESIGN.md.

1. **UI timing: two speeds.** Controls answer fast (press 0.15 s; hover colour, tooltips, menus 0.15–0.25 s). Content stays slow (entrances 0.9–1.3 s; card lift, sidebar and drawers 0.45 s). The `[` sidebar key keeps its 0.45 s: it moves the layout, and the owner likes it.
2. **Border plus shadow.** At rest: the 1 px line plus the small `--shadow-sm`. The wide `--shadow-lg` only on something lifted. `.frame` moved from `--shadow-lg` to `--shadow-sm`. So `gpt-thin-border-wide-shadow` on a resting card or frame is now a real finding.
3. **`--dim` is never readable text.** Use `--muted` (4.6–5.4:1). `--dim` is for disabled things and faint marks.
4. **Anatomy's finish.** Orange part to watch, inside our frame. Recipe in `~/.claude/design/tools/anatomy.md`.

## Tools

The scanners stay in their plugins' cache folders, so turn those plugins
**off, never uninstall them** (rename `hue` to `hue.disabled`; don't delete it).
`scripts/scan.sh` finds the newest version. Once impeccable is off, its
per-edit detector hook and live mode are gone: `scan.sh` before publishing is
the only gate.

| Tool | Command | What it checks |
|---|---|---|
| All three scanners | `bash ~/.claude/skills/craft/scripts/scan.sh <page-or-folder>` | Below, summarised |
| slopscan (auteur) | `node <auteur>/scripts/slopscan.mjs <folder>` | Gradient text, glass cards, AI gradients, clone card grids, em dashes, `transition: all`, scroll listeners, video without poster, WebGL without reduced motion |
| design-audit (genjutsu) | `python3 <genjutsu>/skills/_jutsu/design-audit/scripts/audit.py <folder>` | AI tells (filler, invented stats, scroll cues, endless loops) plus motion and focus checks in CSS and JSX. Says "did not run" instead of a false pass |
| detect (impeccable) | `<impeccable>/skills/impeccable/scripts/impeccable detect <file\|url> [--viewport 390x844]` | On a file: static HTML/CSS checks. On an `http://` URL: a real browser render too (contrast, tiny text, cramped padding, overflow); `--viewport` works on URLs only. Per-page ignores: `<!-- impeccable-disable kicker-above-heading -- house eyebrow -->` |
| validate (hue) | `node ~/.claude/skills/hue*/scripts/validate.mjs <folder>` (the page must be named `preview.html`; `scan.sh` does this) | Undefined `var(--x)`, CSS classes with no element, leftover `{{placeholders}}`, TODO and lorem |
| systemscan (auteur) | `node <auteur>/scripts/systemscan.mjs <url> --routes /,/a,/b --max-variants button=3` | Sites with 2+ pages: does every page still use one system? Drift, too many variants per control, focus visible. Look at its `components.png` |
| Screenshots | `node <auteur>/scripts/shoot.mjs <url> --breakpoints 390,768,1440 --reduced-motion` (or the Playwright MCP) | The three widths plus reduced motion |
| Frame rate | `node <auteur>/scripts/motionqa.mjs <url> --headed --dpr 2 --min-fps 50` | FPS and long tasks while scrolling |
| UX rule book | `python3 <ui-ux-pro-max>/.claude/skills/ui-ux-pro-max/scripts/search.py "<2–5 words>" --domain ux` (also `chart`) | 119 do/don't rules with code, by severity. Never `--design-system` or `--persist` |
| Token drift | `node <ui-ux-pro-max>/.claude/skills/design-system/scripts/validate-tokens.cjs --dir <src>` | Hard-coded values that should be tokens, in `.css`/`.js`/`.tsx` files only: it skips `.html`, so single-file pages always pass. Never `--fix` |

`<auteur>` = `~/.claude/plugins/cache/auteur/auteur/<version>`, and so on for
`genjutsu/genjutsu`, `impeccable/impeccable`, `ui-ux-pro-max-skill/ui-ux-pro-max`.
