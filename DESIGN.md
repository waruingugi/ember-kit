# DESIGN.md: ember-kit, a design system (core)

Applies to every artifact, page, diagram and Hairline figure, in every project. Loaded by `~/.claude/rules/design.md`. Read this whole file before any design work; open the other files in `~/.claude/design/` only when the picker below sends you there. It overrides any skill's default look.

Source of truth: `~/.claude/design/` (clone this repo there; see `README.md` and `tools/setup.md`). Names: "the owner" is the person whose system this is, the user (they/them in your own text).

## Ask first

Stop and ask the owner, then wait, when:
1. **The project has its own theme** (its `CLAUDE.md`, a tokens/design file, or its existing pages' styles) and it differs from this file. Never mix two themes in one page.
2. **Code copied from somewhere else differs from this file** (another project's page, a skill's example, a library's demo). It may carry other tokens, fonts or a dark theme. Say what differs; ask which to follow.
3. **A change would alter the look**: a new colour, font, layout system or motion value. That is a design decision, not a fix.

An answer already written in this folder is settled. Do not ask it again.

## Start here

1. Apply the fixed theme below: *Colours*, *Type*, *Recurring parts*, *The sidebar*, *Motion*, *Words*.
2. Pick patterns. Read only the files the page needs:

| The page needs to show | Read |
|---|---|
| The big shape of a system, 3–5 layers | `patterns/exploded-layers.md` |
| A real object with moving parts, taken apart in stages | `tools/hairline.md` (*Staged explode*) |
| One idea shown working as a real machine (a queue as a marble run) | `tools/anatomy.md` |
| One concept per card, with a small drawing | `patterns/figure-cards.md` |
| How parts connect, who calls whom | `tools/diagrams.md` (Archify) |
| Every state of one thing | `patterns/state-machine.md` |
| One real run, in order, with times | `patterns/story-timeline.md` |
| Tables and how they link | `patterns/data-model.md` |
| One shared thing doing several jobs | `patterns/deep-dive-drawers.md` |
| A repo, one module's files, or any tree (org tree, URL routes) | `patterns/folder-views.md` |
| Many features, each with full detail | `patterns/feature-catalog.md` |
| Code, a diff, or a command | `patterns/code-blocks.md` |
| A step-by-step build guide | `patterns/build-guides.md` |
| A value over time (a line chart, live or still) | `patterns/line-chart.md` |
| A small part: card, stat, callout, pill, table, toast | `components/README.md` |
| A part the reader works: tabs or nav, stepper, form, upload, data table, rows that open, pricing, selection bar, toast, payment or deploy status, peek card, card that tilts, folder, card pile, bar chart, dot field | `patterns/interactive-parts.md` (29 parts in `components/interactive.html`, plus 21 v4 parts in `components/showcase/v4parts/`) |
| Things the reader can pick up (door cards, widgets, layer stacks, a hero scene) | `patterns/depth.md` |

3. Build from parts: paste `components/tokens.css` and the needed blocks of `components/components.css`. Copy bigger pieces from `components/` as the pattern file says (open any of them with `bash ~/.claude/design/scripts/show-reference.sh …`).
4. Use the tool named for the job (`tools/toolkit.md`). Motion: `tools/gsap.md`. Publishing: `tools/publishing.md`. Craft and checks: the `craft` skill (the read before code, the craft rules, the scanners, the review); `fixing-*` and `improve-ui` audit. They give rules and audits only; this file sets the look (`tools/toolkit.md`, *UI skills*).
5. Run *The checklist* (end of file), then publish.
6. When the owner gives design feedback: write the rule into the right file the same day, in plain 6th-grade English, and add a dated line to `CHANGELOG.md` (see *Keeping it up to date*).

**Workflow the owner expects.** When asked to "improve/write the prompt first": rewrite the request as a spec, save it, stop, wait for go. Offer real choices as 3–4 options side by side, never pick silently. He iterates in drafts.

**Whole-page prompt template:**

> Build `<page>` for `<reader>` in the style of `~/.claude/design/DESIGN.md`; follow it exactly, including *Ask first*. 6th-grade English; every term explained once; every heading a claim with one italic orange phrase. Pictures first: each section opens with a picture, scene or worked example, then 1–3 plain sentences, then detail. One row per section:
>
> | # | Section | What it must show | Pattern |
> |---|---|---|---|
>
> Facts trace to the source; anything else is marked "Our proposal" or "Open question". Build from `components/`. Done when every section has its picture and the checklist passes at 1440 and 390 px, motion on and off.

For a long source document (PDF, plan): first extract one fact per line with its page into a facts file, audit the page against it, and show final decisions, not the debate.

## Colours

Light is the default; a **night theme** is official (`html[data-theme="dark"]` in `components/tokens.css`, from the old overview: paper `#0d1013`, orange `#ff6a2b`). Offer a theme switch on showcase and explainer pages and save it with the motion level. `body` background is always `var(--paper)`. All tokens, including plate, syntax, diff and Hairline colours: `components/tokens.css`.

| Token | Value | Use |
|---|---|---|
| `--paper` | `#eff2f1` | Page background (warm paper; not white, not dark) |
| `--paper-raised` | `#f8faf9` | Cards, panels |
| `--paper-sunk` | `#e5e9e8` | Wells, hover fills, Columns note pane |
| `--canvas` | `#f1f3f2` | Behind dot-grid diagrams and figures |
| `--ink` | `#15181b` | Main text |
| `--ink-soft` / `--muted` | `#363c41` / `#5b6368` | Softer text. `--muted` is the faintest text anyone must read (about 5:1) |
| `--dim` | `#8e969a` | Never readable text (2.3–2.7:1). Only disabled things, ticks, rules, dots and other faint marks |
| `--accent` | `#e14a0e` | Burnt orange: big text, marks, counters, the one focal box |
| `--accent-text` | `#b33a0a` | Orange for text under ~18 px: links, eyebrow numbers, labels |

**Progress is orange.** Steps, timelines and checklists show done as a filled orange circle with a white round-cornered tick, and the line between steps fills orange as you go. The step in progress gets an orange ring. Failed is a filled darker orange (`--accent-text`) circle with a white ✕ and the word "Failed". There is still no green or red. Elsewhere orange stays rare.

**Done is orange too.** A "paid", "sent" or "saved" sign is a filled orange circle with a white tick (drawn in). The tick is two straight lines; only its corner and ends are rounded (`stroke-linejoin` and `stroke-linecap: round`). Never bend the lines into a curve, and its next button is the orange `.b.pri`. All progress lines are orange: upload bars, steppers, the reading line, timer lines. Lines that show a reader keeping up with a log are orange, never green. Dissolve specks are orange. If you are about to type a green, a grey bar or an ink tick for progress, stop: it is orange.

**Steppers look like the "one alert" scene** (old overview, section 06): Antonio numbers in 34 px circles, a 2 px line that fills orange as you go, and the step you are on filled orange with **no outer ring**.

| `--plate` | `#0f1216` | Only code/terminal blocks and the closing end card. Never a page background |
| `--line` / `--line-hi` | `rgba(20,23,26,.12)` / `.26` | Hairline borders |

Two oranges because of contrast (AA needs 4.5:1, measured 2026-10-08): `#e14a0e` gets 3.59:1 on paper and 3.86:1 on raised, so it fails for small text; `#b33a0a` gets 5.29:1 and 5.68:1.

System colours mean the same everywhere (chips and diagrams): frontend cyan `#0891b2` · backend emerald `#047857` · database violet `#6d28d9` · security rose `#be123c` · message bus orange `#b45309` · external slate `#475569`. **They are the only exception to "no green, red or blue", and only as names.** They say *which part of a system* a thing is, as a small chip, a tag, a diagram line or a note label. They never say *how it is going*: emerald never means good or done, rose never means an error, and none of them is a big fill, a chart series or decoration. State is always orange and ink (above).

## Type

One Google Fonts link (in `components/README.md`) loads all five:
- **Fraunces** (serif, often italic): headings, emphasis.
- **Space Grotesk**: big display headings.
- **Inter**: body.
- **JetBrains Mono**: labels, code, small upper-case eyebrows.
- **Antonio**: numbers only. Stats (500), outlined ghost section numbers (600), list/sidebar numerals, live readouts. Live numbers use `tabular-nums`. Token `--font-num:'Antonio','Arial Narrow',sans-serif`.

Not ours: Figtree, Geist.

## Recurring parts

Markup and CSS for all of these: `components/`.
- Section head: mono eyebrow (`01 ORDER FLOW ——`, via `counter(seclabel, decimal-leading-zero)` or written in), huge outlined Antonio ghost number behind, Fraunces claim heading, lead.
- Bento grids with mixed widths. Never three equal cards by default; the figure-card grid (`patterns/figure-cards.md`) is the one exception.
- `fade-up` reveal on every major block, with a reduced-motion escape.
- Every picture sits in a frame (bar with three dots, a title, a count) with a one-sentence tool note under it.
- Page background: a faint squares grid, visible only in empty gaps (between sections, page edges, the hero's open side), masked to nothing around content. Never behind text, a card, a callout or a ghost number. Copy the mask from `components/showcase/index.html` (its `bg` canvas script).
- Diagram canvases use dots, not squares (see *Pictures*).
- **Showcases show parts on the page itself**: no outer wrapper box, no file-name bar (dots and title), no iframe. Each part **keeps its own card** (the inner wall: border, raised paper, round corners); only the wrapper around the whole set goes. Each part stands alone with its own realistic sample data that fits its job (money in charts, orders in tables, bookings in calendars), not one shared story. Each gets a small heading (a claim with one orange phrase) and one plain line on what to try, then the part. Never add build notes (how React became HTML, file paths) to a reader's page. Story words stay plain: no tech names like NATS or ClickHouse unless the page is about them. A part's own feedback (a toast, a popover, an Undo bar) shows inside its own card, next to what you clicked; leave room in the card so a popover never spills out. Every button in a showcase must visibly do something when clicked. The owner removed these, so don't bring them back: slide to confirm, the flight date picker with fares, the year-of-running heatmap, the shop funnel and stacked pages. The current showcase (v4, every part, 62 in all): `components/showcase/index.html` (the 21 new parts are in `components/showcase/v4parts/`).
- Interactive parts (29 in `components/interactive.html`, from tabs to a data table, plus the 21 v4 parts) have one house version each: copy it, never restyle it for one page (`patterns/interactive-parts.md`). Secret reveal and the edge-lit button are rare: at most one per page, only for a real secret or one final action.
- **A status word gets its own line.** A short state like "Paused" or "Catching up" sits on a small line under the name, never tacked onto the end of it, so it can't run over a line or a dot next to it.

## The sidebar

Any page with a sidebar or chapter rail:
- **Collapse**: a button at the top and the `[` key (ignored while typing in a field). Button has `aria-expanded` and a visible focus ring.
- **Collapsed** = ~68 px rail showing each item's short key (`01`, `A`); hover/focus shows the full name as a tooltip; clicking still jumps.
- **Remember**: `{ collapsed, width }` in `localStorage` key `<project>-sb-v1`, inside `try`/`catch`; if storage throws, open expanded.
- **Move**: width animates 0.45 s `--ease-out`; snaps with motion `off`/reduced motion.
- **Resize**: drag the right edge, 216–420 px; drag far left snaps shut; double-click resets; arrow keys work on the handle.
- **Phones (<960 px)**: hidden; a menu button slides it in over a dim backdrop; `Escape` or a backdrop tap closes it.
- Sliding orange marker on the active item, numbered keys, reading-progress bar in its footer. Top bar beside it: breadcrumbs, status badge with a pulsing dot, 2 px orange progress line on its bottom edge.

## Motion

Use motion wherever it has a job (entrance = reading order; a line drawing in = direction of flow; a scroll scene = a process; hover = clickable). Nothing loud loops for show. Allowed loops: a small "live" dot or glint; a busy sign while work is really running (a dot going round a clock, a pulse on the step in progress), which stops when the work ends; and **quiet accents** that keep a page alive, like the callout line's slow drift and the live card in the hero. Quiet means small, slow, one at a time on screen, and gone with motion `off`.

Minimum set:
- Major blocks fade and rise in on arrival.
- Our own diagrams build in: boxes, then lines draw in, then labels fade in.
- Numbers count up at 40% visible: 2.2 s, strong ease-out, once.
- Still line charts draw in once at 40% visible: left to right over 1.1 s, a small orange dot riding the front edge; grid and labels show from the start. Range buttons reshape the line in 0.55 s, never redraw it (`patterns/line-chart.md`).
- Cards rise 3 px on hover; links grow an underline from the left; buttons, toggles and clickable cells shrink to 0.97 on press.
- Ghost numbers drift slowly on scroll.
- **Progress line**: the parcel line from the old overview (one orange line that fills as the steps are reached, a dot riding its front) is the house way to show progress through steps. The top bar's 2 px orange line shows progress through the page.
- **Scroll-driven stacks**: don't use stacked pages that stick as you scroll (the owner removed them: too buggy). Card swaps follow the scroll (down sends the front card back, up brings it back). The moving wall slides with the scroll, with no glow.
- **Slow printing**: a receipt feeds out in about 4.5 s with ease-in-out (`--ease-in-out`), like a real printer.
- **The live shimmer**: after a sparkline draws in, one short lighter stroke (~3% of the line's length, same hue mixed with white, slightly thicker, round caps) crosses it every 3.4 s, then rests off the end. Never a band, glow, blur or white bar. Hidden with motion `off`. CSS: `.spark` in `components/components.css`.

Rules:
- **One curve**: `--ease-out: cubic-bezier(.22,1,.36,1)`; GSAP `expo.out`.
- **Two speeds.** Content that arrives or moves the layout is slow: entrances 0.9–1.3 s; card lift, sidebar and drawers 0.45 s. A control answering the reader is fast: press 0.15 s; hover colour, tooltips, menus and dropdowns 0.15–0.25 s (closing a little faster than opening). Toasts arrive in 0.35 s. A toast is a light paper card with a hairline and a shadow, never a black box with white text. A control that waits half a second feels broken.
- **The action is the confirmation.** After a clear action (archive, delete, send), never add an "Are you sure?" box. Do it, say so, and offer Undo with an orange countdown line that pauses on hover or focus.
- **Things that turn into other things stay on screen.** Never make an object vanish in one frame. The old thing fades where it stands while the new pieces leave it (a folder fades as its cards fly out), and on the way back the old thing returns first so the pieces have somewhere to go. While a box glides to a new height, its content sits at the top, never centred, so nothing slides.
- **Closing boxes glide all the way.** When a row or notice closes, its padding and margin close with its height, so nothing snaps at the end. A list has no fixed height: its card shrinks as rows leave and grows when they come back.
- **Pinning**: build guides never pin (readers scroll back and forth while coding). Explainer pages may pin.
- **Levels** on `html[data-motion]`: `lively` (default; full entrances, ghost drift) · `calm` (half distance and time, no drift) · `off` (final state, no animation, no loops, no GSAP). Save the choice under `<project>-motion-v1` in `try`/`catch`.
- **Reduced motion always wins**: `prefers-reduced-motion: reduce` acts as `off`, whatever is saved.
- **Complete at rest**: nothing readable waits at `opacity: 0` for scroll; if scripts fail, everything shows. One exception: story timeline cards may follow the scroll (`patterns/story-timeline.md`). They fade in as they rise, are fully clear through the middle of the screen, and never dim below 0.3 once passed. With motion `off` they all show.
- **GSAP is an upgrade**: the page works without it. Script tags, bail-out pattern and traps: `tools/gsap.md`.
- **Two motion helpers, used often** (`tools/toolkit.md`, *Motion helpers*):
  - **`animate`** (Emil Kowalski's own skill) for any piece the reader works: tabs with a sliding marker, toasts, popovers, menus, modals, drawers, accordions, clip-path text reveals, shared-element moves. Take its recipes; our curve and *Two speeds* replace its easing tables. Emil's `review-animations`, `remove-animations` and `animation-performance` check the result.
  - **`motion-ecosystem`** whenever a page needs more than CSS and GSAP: a React or Next app, a Three.js scene, or a project that already ships Framer Motion or Lenis. It picks one library per job and wires them so they never fight. On our own single-file pages the answer stays CSS plus GSAP.
  - **GreenSock's `gsap-*` skills** for any GSAP code; `tools/gsap.md` still sets the version, the script tags and the traps. Three.js skills, `motion-design` and `design-dna`: when and how in `tools/toolkit.md`.
- Never start a scale animation from 0; use ~0.6 plus a fade. Exception: the story-timeline dot pop the pattern specifies.
- **Edges at rest**: cards and picture frames get the 1 px line and the small shadow (`--shadow-sm`). The wide soft shadow (`--shadow-lg`) shows only on something lifted (hover lift, a dragged or floating object), never as a resting look next to a line.
- **Depth has a job too**: only things the reader can pick up float, lift or tilt; text, tables, code and diagram boxes stay flat; three shadow heights, no glass, no glow (`patterns/depth.md`).
- **Warm tint, not glow**: a card the reader can tilt may carry a faint orange tint that follows the pointer (radial, about 13% orange at the middle, gone by 65%), on its own layer that fades in. Never a white glare, blur or coloured shadow.
- **Only `transform` and `opacity` move.** Never animate `box-shadow`, size or position; fade a shadow layer instead. `will-change` only while moving.

## Words

The owner rewrites copy that misses these, so get them right first time. (These apply to page copy and to the files in this folder.)
- **6th-grade English.** Short sentences, one idea each, words a 12-year-old knows. Two ideas → two sentences.
- **Plain is not vague.** Keep real file names, commands, numbers.
- **Explain each term** the first time, in plain words.
- **One idea at a time.** Each section builds on the last; explainers read as a guided story.
- **Headings are claims**, not labels ("Every order is always in one state." beats "Order states"), with one italic orange phrase.
- **Pictures first.** If a picture, figure, diagram, data model or small animation can carry the idea, use it instead of a paragraph. Use them generously, each with a job.
- **As many words as needed, no more.** No fixed cap. After writing, cut every sentence the picture or an earlier section already says.
- **Show, then tell**: picture or scene, then 1–3 plain sentences, then detail.
- **Captions and tool notes**: one sentence, what the picture shows and why this tool.
- **No dash pile-ups**: a dash bolting a second thought onto a finished sentence becomes a full stop.
- **Never**: hype words (seamless, robust, leverage, cutting-edge), "Let's dive in", emoji, exclamation marks, unexplained acronyms, a wall of bullets where a sentence works.

## Taste

Settled picks; never offer them again as open choices. Full notes and how the owner works: `notes/owner-likes.md`.
- One orange part at rest in every figure.
- Real motion, never show motion (the watch keeps real time, the escapement really ticks).
- Complex things come apart in stages: overview, then one layer taken apart; each part moves the way it really would and spins as it goes; no dashed guide lines in a layered explode.
- Options side by side, chosen by looking.
- Loved parts: collapsible sidebar, ghost numbers, count-ups, lines that draw in, message-bus tape, code tabs with Copy, exploded layer scene, story timeline, folder views, custom Hairline figures, interactive pieces the reader can break a rule with.
- Long documents become short visual pages: one picture per idea, final decisions only.

## Pictures

Each tool has one job. Never draw boxes and arrows as plain HTML.

| Need | Tool | Read |
|---|---|---|
| How parts connect, who calls whom | Archify (its own canvas) | `tools/diagrams.md` |
| States, data models, swimlanes, flows, layer stacks | Diagram Design with the `ember` profile, or hand-drawn SVG | `tools/diagrams.md`, `patterns/state-machine.md` |
| A real object that reacts to the pointer | Hairline (`hairline-create`), **small, inside a card** | `tools/hairline.md` |
| One idea shown working as a big machine, with a live read-out | Anatomy (`anatomy`), **one per screen, light theme** | `tools/anatomy.md` |
| Charts, sparklines | built-in `dataviz` skill; line charts copy `components/line-chart.html` | `tools/toolkit.md`, `patterns/line-chart.md` |

- **Canvas rule**: Diagram Design and hand-drawn diagrams sit on an 18 px dot grid on `--canvas`; everything in front of the dots is solid. Archify keeps its own canvas.
- **Hairline size rule**: a figure is a small drawing at the top of a card: `.card.tcard` → `<div class="fig" data-hairline="…">` at 70% of card width, max 210 px, then a system chip, title, two lines. No dot box or read-out badge around it. Only a staged-explode study page shows a big figure, with a read-out naming the part under the pointer.
- **Hairline or Anatomy?** Hairline names a thing, small, in a card. Anatomy shows one idea working, big, as the section's main picture.
- Use the 33 stock Hairline figures first; make a custom one only when none fits, and save it to `hairline/`.
- **Sparklines are curved too**: the same monotone curve as line charts, never straight segments.
- **Line charts are curved, never sharp**: one orange line on a monotone curve that passes through every reading and never overshoots it, a soft fill under it, quiet axes, and hover to read. Two kinds: **live** (scrolls, hover pauses it) and **still** (draws in once, 7D/30D/1Y reshape it, hover and arrow keys snap to real days). Copy both from `components/line-chart.html`; rules in `patterns/line-chart.md`.

## Where everything is

| Path | Contents |
|---|---|
| `DESIGN.md` | This core. Always read. |
| `CHANGELOG.md` | Every change, newest first |
| `components/` | `tokens.css`, `components.css`, README of small parts, `preview.html`, `line-chart.html`, `interactive.html` (29 interactive parts), `showcase/` (every part on one page) |
| `patterns/` | One file per pattern: what, why, how, rebuild prompt |
| `tools/` | Archify + Diagram Design, Hairline, Anatomy, GSAP, toolkit, publishing, new-machine setup |
| `notes/` | What the owner likes, in full |
| `hairline/` | Figure library with a log |
| `vendor/` | Hairline 0.5.1: original module + plain-script copy (MIT, with its licence) |
| `claude/` | The Claude Code rule that loads this file, and the `ember` Diagram Design profile |
| `scripts/` | `show-reference.sh` (open any page in Chrome), `check-updates.sh` (are the pins old?) |

## Known traps

Bugs hit while building pages in this style. Check for them.
- **Class clashes with older CSS.** Older stylesheets define `.skip` (skip link), `.later`, `.end` (dark end card), `.done`, `.t`, `.k`, `.stat`. Never reuse them for new parts; scope or rename first.
- **Undefined layout classes.** Older CSS has no `.bento`/`.c4`–`.c12`; add them from `components/components.css` before using them.
- **Grid overflow.** Long code lines stretch grid tracks. Give grid children `min-width: 0` and single-column grids `minmax(0,1fr)`.
- **CSS transition + GSAP on the same property** jitters. Turn the CSS transition off under `html.gsap-on`.
- **GSAP reveals must skip scroll-driven scenes** (`.layers-pin`), which manage their own visibility.
- **Key handlers**: guard `e.target.closest` (the target can be `document`).
- **Diagram labels** need a gap wider than their text; `verify-geometry.py` catches clipped label masks.
- **Parts lose pieces when split out.** A part that puts things in a holder outside its own section (a toast holder, a fixed layer) breaks when it is copied alone: the click throws and nothing shows. Check every `getElementById` target exists, and keep holders inside the part.
- **Padding left out of a height glide.** If a box has padding and only its height animates, it jumps at the start or snaps at the end. Use `box-sizing: border-box` and animate the padding with the height.
- **Fixed heights on lists.** A `min-height` on a list's box stops its card from shrinking when rows leave. Let the list set the height.
- **Side slides push the page sideways on phones.** A card that slides in from the side can make the page scroll sideways. Give its parent `overflow-x: clip`.
- **Archify**: endpoints use side centres; `via` points must keep segments perpendicular; self-messages are not supported in sequences.

## Keeping it up to date

- Monthly: if `.last-update-check` is >30 days old, run `bash ~/.claude/design/scripts/check-updates.sh` and report. It only reports. Never move a pin without reading the change and testing it.
- After any change: a dated line in `CHANGELOG.md`, and remind the owner to push the folder to GitHub.
- If the change touches diagrams, also run `/diagram-design:profile update ember`.

## The checklist

Every line, before an artifact goes online:
- [ ] *Ask first* settled: theme, copied-code differences, look changes.
- [ ] No sideways scroll at 1440×900 and 390×844 (`document.documentElement.scrollWidth === innerWidth`).
- [ ] Sidebar collapses by button and `[`, remembers it, becomes a drawer on phones.
- [ ] Motion runs where it has a job. With motion `off` and with reduced motion, everything is visible and nothing moves.
- [ ] Works with GSAP blocked.
- [ ] No console errors or warnings after scrolling the whole page and using every control.
- [ ] Every button visibly does something. Every open and close was checked frame by frame (or its height measured each frame): nothing vanishes in one frame, and nothing snaps at the end.
- [ ] Diagram Design and hand-drawn diagrams sit on the dot grid; no dot shows inside a box, label or legend.
- [ ] Diagram Design's style guide starts with the `ember` profile header.
- [ ] Motion audited with `design-motion-principles` (audit mode; this file wins on conflicts) and `fixing-motion-performance`; charts checked with `dataviz`.
- [ ] Depth only where `patterns/depth.md` gives it a job; at most one floating group per screen.
- [ ] Controls audited with `fixing-accessibility`; forms, navigation and touch sizes checked against `craft`'s `rules.md`.
- [ ] `craft` scan run (`scripts/scan.sh`); every finding fixed or listed as house style in its `house.md`.
- [ ] No page grid line behind text, a card or a box.
- [ ] Archify: `validate` at `showcase`, 9 of 9.
- [ ] Diagram Design: `verify-geometry` 0 findings and `self_check` OK.
- [ ] New or changed Hairline figures declare a tour, pass `validate.mjs`, are saved in `hairline/`, and sit small inside cards.
- [ ] Anatomy figures: light theme, one per screen, `--audit` passes and `lines.mjs` prints `line ends: 0`.
- [ ] Small orange text uses `--accent-text`; focus rings show; the keyboard reaches every control.
- [ ] No class clashes (see *Known traps*).
- [ ] Copy reads at a 6th-grade level.
- [ ] Local file changed first, then published (`tools/publishing.md`).
