# ember-kit for agents: the rules

You are building a page, an artifact or a part in the owner's house style, ember-kit. Read this whole file first. Then open `INDEX.md`, find your job, and read only the files it names. Every rule here was paid for by a failed copy. Follow them as written.

Paths: `cards/`, `snippets/`, `tools/` and `verify.mjs` are in `~/.claude/design/kit/`. `components/` and `scripts/` are in `~/.claude/design/`.

## 1. The one big rule: copy, never retype

The house look lives in exact CSS, markup and scripts. A copy that "looks about right" fails. Agents fail when they read a picture or a description and then write their own CSS. So:

- **Never write CSS for a part the kit already has.** Copy its CSS file whole. Don't trim it, rename its classes or change its numbers.
- **Never rename classes** (`my-table`, `fl-b`) and never move values into your own variables.
- **Change only words, data and columns.** Keep every class, `aria-` attribute and script.
- A part you must make yourself (nothing in `INDEX.md` fits) is built from tokens with section 7's recipe. Then the house check must pass.

## 2. Three ways to build. Pick one

| You need | Do this |
|---|---|
| **A whole page or artifact** (dashboard, settings, list page, explainer) | `node ~/.claude/design/scripts/assemble.mjs n87,c03,n37 -o page.html --app "Page title"` (ids joined by commas, no spaces; a space drops every id after it). It gives you the shell (sidebar, top bar, theme, motion, background grid) and every part exactly. Then change words and data, and rewrite every showcase word it brings: the logo (the word "kit." and the diamond `.mark` svg next to it: use the brand's own mark or remove it), the meta description, each section heading and "what to try" line, and the sidebar labels. A heading that promises something the part doesn't do ("turns into cards on a phone") must go. |
| **A small page with one or two parts** (a customer page, a single card, an artifact) | Start from `cards/table/table.starter.html`'s head (boot script, fonts, tokens, buttons, springs), then add the top line and heading from section 3. Bring other parts in with `node ~/.claude/design/kit/tools/part.mjs <id> -o parts/`: it writes the part's markup, its own CSS rules and its script. Paste each whole, inside a `<div class="kit">`. (Older `c` parts style plain class names; build those pages with `assemble.mjs`.) |
| **One part inside a page you write yourself** | Open the part's card in `cards/` (only the table has one so far). Start from its `*.starter.html`. Paste its CSS file and script whole. |
| **React or Next (shadcn project)** | Section 8. Same CSS file, same classes, same script. |

`INDEX.md` lists every part id by the job it does. Part ids look like `n37`, `c03`, `hero`.

Need a diagram, a figure, scroll motion, a chart or a map? See "Tools by job" in `~/.claude/design/kit/INDEX.md`.

## 3. Every page starts like this

1. In `<head>`, first: the boot script. It sets the theme and motion before anything paints. Copy it from `cards/table/table.starter.html` (the first `<script>`). It reads `ember-theme-v1` from `localStorage`, follows the system theme when nothing is picked, and turns motion off when the system asks for less motion.
2. The fonts link (in the starter, and in `components/README.md`).
3. All of `components/tokens.css` (both themes), then `snippets/springs.css`. A card's CSS file already holds both. Never make a light-only page.
4. `<body class="kit">`. The kit's CSS hangs off `.kit`.
5. A theme switch (System, Light, Night) at the right end of the page's top line (the row with the page title): paste `snippets/theme-switch.html`. Pages from `assemble.mjs` come with their own theme boot and a light/night button in the top bar; keep those and don't add a second switch.
6. The page heading is the showcase's section head. Markup and CSS, copied from `components/parts/base.css`:
   ```html
   <div class="sec-head">
     <p class="eyebrow"><b>01</b> Billing</p>
     <h1 class="display">Every invoice, <em>paid or chased.</em></h1>
     <p class="lead">One plain line that says what this page is for.</p>
   </div>
   ```
   ```css
   .sec-head { position: relative; margin-bottom: clamp(36px, 4vw, 56px); }
   .eyebrow { display: flex; align-items: center; gap: 12px; margin: 0 0 22px; font: 500 12px/1 var(--font-mono); letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft); }
   .eyebrow b { color: var(--accent-text); font-weight: 500; }
   .eyebrow::after { content: ""; width: 48px; height: 1px; background: var(--line-hi); }
   .display { margin: 0 0 20px; font-family: var(--font-display); font-weight: 380; font-size: clamp(34px, 4.2vw, 56px); line-height: 1.02; letter-spacing: -0.028em; text-wrap: balance; }
   .display em { font-style: italic; color: var(--accent); }
   .lead { margin: 0; max-width: 62ch; font-size: clamp(18px, 1.6vw, 21px); line-height: 1.55; color: var(--ink-soft); text-wrap: pretty; }
   ```
   One `<em>` per heading. A part's own small heading inside the page is `.kit-h` (Fraunces 380, 26–34 px), as assembled pages show.
7. On a phone (under 560 px) the theme switch shows as one round button that flips light and night, so the title keeps its room. The snippet does this by itself.
8. The top line, on a page you write yourself: paste `snippets/top-line.html` first inside your page wrapper (the box with the side padding and max width) (brand on the left, the theme switch on the right, a hairline under it). Don't make your own.
   On an assembled page, the page title is `<h1 class="display">` inside `.sec-head` (the shell sizes it); the top bar is already there.

## 4. The look, in numbers

Use the token, never the hex. A literal colour is allowed only on the dark code plate.

**For now, only the house colours: paper white, ember orange, charcoal** (the owner, 2026-11-24). Don't run the accent tool or pick another brand colour, even if the task names one; say so in your report. The next lines are for later.

**The accent is a colour choice.** Ember orange is the house accent. For another brand run `node ~/.claude/design/kit/tools/accent.mjs "#2563eb"` and paste the block it prints after all other CSS. It sets the five accent tokens for both themes and checks contrast. Nothing else changes: motion, sizes, fonts, paper and ink stay the house ones. Wherever this file says orange, read "the accent". Never type an accent colour into a part, or the swap can't reach it.

| Token | Use |
|---|---|
| `--paper` | page background (body is always `var(--paper)`) |
| `--paper-raised` | cards, panels, bars, menus, toasts |
| `--paper-sunk` | wells, hover fills |
| `--ink`, `--ink-soft`, `--muted` | text. `--muted` is the faintest text anyone must read |
| `--dim` | never text people must read: ticks, rules, disabled things |
| `--accent` | accent marks, big accent text, the one main button, the one focal box |
| `--accent-text` | accent words under 18 px (links, small labels, numbers) |
| `--line`, `--line-hi` | 1 px hairlines |
| `--on-accent` | text on the accent button (white by day, dark at night for ember; it is meant to be that way) |
| `--accent-soft`, `rgb(var(--accent-rgb) / .06)` | accent tints (picked rows, soft rings) |

- **Fonts**: Inter for body and controls. Fraunces (often italic) for headings. Space Grotesk for big display words. JetBrains Mono for codes, plates, eyebrows. Antonio for numbers that matter (stats, counts), with `tabular-nums`. Nothing else.
- **Corners**: buttons and fields 8–10 px, cards and menus 12–14 px. Pills only for chips, badges and round icon buttons.
- **Edges**: resting cards get a 1 px `--line` and `--shadow-sm`. The big shadow only on things that float (menus, bars, toasts, a lifted card).
- **The accent is rare**: one accent fill on the page at rest (usually the main button, like "Add invoice"). A bar, sheet or menu that floats over the page may bring its own one main button. Orange means progress, done, the main action or the focal thing. **There is no green or red for state.** A status has four looks: done is a filled accent dot (or the house tick); waiting is a grey ring (`--line-hi`); a problem is an accent ring with `--accent-text` words; neutral (draft, off, paused) is a short grey dash (`--dim`) with `--muted` words. The table's `data-s` values are `done`, `due`, `late` and `idle`. Map every state you have to one of the four: cancelled, retired, off, draft and paused are `idle`; anything that needs someone's help is `late`.
- **Steps**: a form in steps (stepper) fills the current step with the accent, no ring. A live flow (an order on its way) shows the current step as an accent ring that pings. Done steps are filled with a tick in both.
- **Picked or pressed** is ink fill with paper text. Focus is a 2 px accent outline, never the browser blue.
- Headings are claims with one italic orange phrase ("Every order is *always in one state*."). 6th-grade words. No emoji, no exclamation marks, no hype words.

## 5. Motion

**Motion is always lively.** Build no motion setting and no calm level. `html[data-motion]` is `lively`, and `off` only when the reader's system asks for less motion (the boot script does this). With `off`, everything shows in its final place and nothing moves.

| Kind of move | Time | Curve |
|---|---|---|
| A control answering (hover colour, press, tooltip, menu) | 0.12–0.25 s | `var(--ease-out)` |
| Press | scale to 0.97, 0.15 s | `var(--ease-out)` |
| A part the reader works settling (bar rises, marker slides, menu opens) | 0.37 s | `var(--sp-snappy)` spring |
| Something closing | ~0.25–0.3 s | `var(--ease-out)` or `var(--ease-in-out)`, never a spring |
| Rows moving to new places (sort, filter) | 0.42 s | `var(--ease-out)`, FLIP with `transform` |
| Side sheet | 0.45 s open, 0.25 s close | `var(--ease-out)` |
| Content arriving on scroll (fade and rise 22 px) | 0.9 s, 70 ms apart | `var(--ease-out)` |
| Numbers counting up | 2.2 s, once, at 40% visible | strong ease-out |
| Something going round while work runs (a dot on a ring) | one turn in 1.4 s, only while it runs | `linear` |

- **Only `transform`, `opacity` and colours move.** Never animate height, width, top, left, padding or box-shadow. To grow a box, use `grid-template-rows: 0fr → 1fr`, or fade a shadow layer.
- **Words and numbers that change roll.** A number that updates (a count, an arrival time) rolls its digits like part `n84` or `n53`; a heading or label that swaps fades out, then writes in (`DESIGN.md` *Changing words in one place*). Never set `textContent` with no motion. Count a long wait in minutes ("32 min"), not seconds.
- **Complete at rest**: with motion off or scripts broken, everything readable shows. Never leave text at `opacity: 0` waiting for a scroll.
- Nothing loops for show. A small live dot may drift; a busy sign runs only while work really runs.
- The spring tokens are in `snippets/springs.css` (paste it after `tokens.css`) and in every assembled page and card CSS file. Don't invent curves.

## 6. The laws the check measures

| Law | What it means here |
|---|---|
| Fitts | Every tap area is at least 24 px (44 px on touch). Small checkboxes get a bigger `::before`. Actions sit next to what they act on. |
| Hick | One main (accent) button per view. At most three actions in a row, then "More". |
| Jakob | Things work the way people expect: headers sort, Escape closes, Enter submits, the logo goes home. |
| Proximity | Related things sit close (8 px), groups sit apart (20–24 px). Forms: 8 px label to field, 16 px between fields, 24 px between sections. |
| Similarity | The same job always uses the same part and class. Nothing that isn't a button looks like one. |
| Von Restorff | The accent marks only the one thing that matters at rest. A floating bar or sheet brings its own one. |
| Doherty | A click answers within 0.1 s. A request shows three bouncing dots and keeps the button's width. |
| Postel | Search ignores case and spaces at the ends, and finds a phone typed the local way (0711…). |

## 7. Making a part the kit doesn't have

1. Find the nearest part in `INDEX.md` and open it (`node ~/.claude/design/scripts/assemble.mjs <id> -o near.html`). Borrow its sizes, spacing, motion and states. Your part should look like its sibling.
2. Build only from tokens (section 4), the house fonts, the radius and shadow scale, and the motion table (section 5). No new colours, fonts, curves or sizes.
3. Give it every state: rest, hover, focus (accent outline; a field shows it once, on its box), pressed (0.97), picked (ink fill), disabled (the house `.kit .b:disabled { opacity: .4 }`, words in `--dim`), empty, busy (three dots), error (accent ring and `--accent-text` words).
   One box that swaps between views (form, waiting, done) stacks the views in one grid cell and fades between them, and its height glides with `grid-template-rows` or a clip. Read `~/.claude/design/patterns/smooth-motion.md` first: it has the recipes and the frame tests.
4. Name its classes with a short prefix of its own (`.tl-`, `.mtr-`) so they can't clash. Never reuse `.skip .later .end .done .t .k .stat .st .sheet .on .in`. House rules start with `.kit` (`.kit .b { display: flex }`), so they beat a bare class of yours: write yours as `.yourpart .yourclass`.
5. Run the house check (section 9) in both themes. Fix every `FAIL`.

## 8. React and shadcn

- One file with no build step: load React 18.3.1 and ReactDOM UMD from cdnjs and write `React.createElement`. Everything else below still holds.

- Put the part's CSS file and `components/tokens.css` in your global CSS. Don't turn it into Tailwind classes.
- Write the same markup as JSX (`class` → `className`). Keep every class name and `aria-` attribute.
- Run the part's script once the DOM is there, and keep its handle. When your data changes (a tab, a retired row), call `setRows` so rows glide; don't remount the table:
  ```js
  const t = React.useRef(null);
  React.useEffect(() => { t.current = emberTable(ref.current, { rows, ...rest }); }, []);
  React.useEffect(() => { if (t.current) t.current.setRows(rows); }, [rows]);
  ```
- shadcn components map to house classes by name: `<Button variant="primary">` renders `class="b pri"`, `size="sm"` adds `sm`. Make the variant names the class names so a reader of either can find the other.
- **Never put a changing `key` on the table or its wrapper.** A new key throws the table away and builds it again: rows snap, and the reader's sort and ticks are lost. Call `setRows` instead.
- Bring in other parts with `tools/part.mjs <id> -o src/kit/` and import their CSS whole. A part's script is plain JavaScript that runs once on its box: wrap it in a function that takes the box, call it in a `[]` effect, and guard it so React's StrictMode doesn't run it twice (`if (box.dataset.ready) return; box.dataset.ready = 1`).
- Parts that float (the side sheet `n41`, toasts `n78`) sit inside a demo stage in the showcase (`position: absolute`). On a real page make their outer box `position: fixed` and lift it above the table's bar (`z-index`).
- Put the boot script in the document head (Next: `app/layout.tsx`, inside `<head>`, with `suppressHydrationWarning` on `<html>`).

## 9. Check your work before you say it is done

```
node ~/.claude/design/kit/verify.mjs page.html --house          # any page or new part
node ~/.claude/design/kit/verify.mjs page.html --card table     # a page with the table on it (about 2 minutes; give it a long timeout)
```

`--house` checks both themes: token colours only, house fonts, no moving size, house curves, readable contrast, tap areas, one orange fill per view, orange focus rings, no sideways scroll at 1440 and 390 px, and everything visible with motion off. `--card` puts the part through every state and compares it with the house part, element by element, and records its motion. Each problem prints with its fix. You are done when both print `PASS`. Then look at a screenshot of each theme yourself.

Anything the check reports inside a house part ("inside house part n41") is a warning: copy the part as it is. Anything in your own code is a `FAIL`.

What the check can't see, so you must: a marker or row that snaps instead of gliding when you use the page, words that change with no motion, demo buttons left on a real page, and headings that only describe the part ("Twelve drivers, sorted your way") instead of saying something true about the data ("Three drivers are free right now").

For a React app, run `npm run build` with `base: './'` in `vite.config.js`, then point the check at `dist/index.html`. The check serves that folder itself, so linked CSS and module scripts load as normal. No plugins needed.

## 10. Don't

Each line came from a real failed build.
- Retyping a part's CSS from a picture. Copy the file.
- Mono capitals with letter spacing on table headers. Headers are Inter 12.5 px, 500, `--muted`.
- Green "Paid", red "Overdue". Status is the accent and ink (four looks, section 4).
- A list page with no Add button. Every list people add to has an accent "Add …" button (`class="b pri"`) at the right end of its toolbar, on the search's row.
- A heading block you styled yourself. Use `.sec-head`, `.eyebrow`, `.display`, `.lead` (section 3).
- A motion setting or a calm level. Motion is always lively.
- A typed accent colour (`#e14a0e`, `rgba(225,74,14,.1)`). Use the accent tokens.
- A black slab for a floating bar or toast. Floating things are raised paper with a hairline and the big shadow.
- Animating height or box-shadow. Use transform, opacity, a grid row or a shadow layer.
- A light-only page, or a theme that only follows the system with no switch.
- Text that waits at `opacity: 0` for scroll.
- Small orange words in `--accent`. Use `--accent-text`.
- Fully round pill buttons. Buttons have 8–10 px corners.
- "Are you sure?" after a clear action. Do it, say so, offer Undo.
- Demo controls ("Simulate next step") on a page real people use. Show them only with `?demo` in the URL.
- A "right now" number (on a trip now) inside a period switch (Today · 7 days). Period switches hold numbers that have a period.
- Three equal cards in a row by default. Use a bento grid with mixed widths.
