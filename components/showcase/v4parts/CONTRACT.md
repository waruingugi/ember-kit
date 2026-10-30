# Build contract: new parts for Showcase v4

You rebuild components from easyui.site (React + Framer Motion) as **plain HTML, CSS and vanilla JS** in the owner's design system. You are not copying their look: you take the *behaviour and the idea*, and dress it in our look.

Source code: `https://raw.githubusercontent.com/Surajmaurya1/easyui/main/<path>`. The paths for each component are in the repo's `registry.json` (find the item by name, read `files[].path`). Read the source with WebFetch or curl to learn the behaviour. Also look at the live page `https://easyui.site/components/<name>` if useful.

## Output: one file

Write **`components/showcase/v4parts/<your-file>.html`**, made of one block per part, in this exact shape:

```html
<!--PART n01 | Calendar | A month of bookings, <em>picked as a range.</em> | Click a first night, then a last night. Arrow keys move the day.-->
<style>
.kit #n01 .cal { ... }            /* EVERY selector starts with `.kit #n01 ` */
html[data-theme="dark"] .kit #n01 .cal { ... }   /* only if a token can't do it */
</style>
<section class="cs" id="n01">
  <div class="frame"><div class="fbody">
    ... the part ...
  </div></div>
</section>
<script>
(function () {
  "use strict";
  var box = document.getElementById("n01"); if (!box) return;
  ...
})();
</script>
<!--/PART-->
```

- Header comment fields: id | short name | heading (a plain claim with ONE `<em>` phrase, 3–8 words) | one plain line saying what to try (6th-grade English, no jargon, no tech names, no "React").
- All CSS selectors start with `.kit #nXX ` (inside @media too). Keyframe names start with `nXX-`. Element ids inside a part start with `nXX-`. No global listeners that act outside your part except keyboard shortcuts you document, and `scroll`/`resize` if really needed.
- No libraries, no external requests, no images (draw with SVG/CSS). No `localStorage`. No `alert/confirm/prompt`.

## What is already on the page (use it, don't redefine it)

- Wrapper: `.frame` = the part's own card (border, raised paper, radius 16, small shadow). `.fbody` = its padding. `.stage` = centred flex area. `.note` = small muted line under a demo (use `aria-live="polite"` on it for status text).
- Buttons: `.b` (outline), `.b.pri` (filled **orange**, the one main action), `.b.sm`, `.b.q` (quiet), `.ib` (34px icon button), `.ib.bx` (boxed). Inputs: `.in` (text field), `.inwrap` (field with icon at left `.i` and/or `.ib` at right). Checkbox: `.chk`. Small chip: `.tag`. Pulsing live dot: `.live`. Status word with dot: `.st` (+ `.ok`, `.wait`, `.off`, `.hot`). Mono label: `.label`.
- Icons: `<svg class="i" aria-hidden="true"><use href="#i-NAME"/></svg>` (`.i.s` 13px, `.i.l` 22px). Names: check x plus search cr cl cd (chevron right/left/down) sort asc desc info copy rot printer trash share dl up folder ar al aup commit clock alert mail lock eye eyeoff user home grid list cols file img film music zip code card store sliders bell cal msg layers globe zap shield db term cpu key refresh ext receipt archive gh google.
- The exact CSS of those classes is in `v4parts/base-classes.css` (read it).

## Tokens (CSS variables; never hard-code colours except `#fff` text on orange)

`--paper --paper-raised --paper-sunk --canvas --ink --ink-rgb (use as rgb(var(--ink-rgb) / .08)) --ink-soft --muted (faintest readable text) --dim (never text; ticks, rules, disabled) --line --line-hi --accent (orange marks, big text) --accent-text (orange small text) --accent-rgb --accent-soft --shadow-sm --shadow-lg --depth-2 --radius (14px) --ease-out --ease-in-out`
Fonts: `--font-display` (Fraunces, headings), `--font-body` (Inter), `--font-mono` (JetBrains Mono: labels, small upper-case eyebrows, letter-spacing .06–.12em), `--font-num` (Antonio: **numbers only**, with `font-variant-numeric: tabular-nums` for live numbers).
A night theme swaps the tokens automatically (`html[data-theme="dark"]`). If you use tokens only, it just works. Check nothing is white-on-white in the dark theme: use `var(--paper-raised)`, not `#fff`, for surfaces.

## The look (hard rules; the owner checks every one)

1. **Orange is rare and means: the one focus, progress, done.** Every progress bar, filled step line, countdown line, "done" circle is **orange**. A done sign = filled orange circle + white tick, tick path `M20 6 9 17l-5-5`, `stroke-linecap: round; stroke-linejoin: round` (straight lines, rounded corner and ends; never curved). Selected/on states (tabs marker, toggle on, selected day) are **ink** (`var(--ink)` with `var(--paper)` text), except where it is progress/done.
2. **No green, no red, no blue, no purple, no gradients for show.** (Only exception: the six system colours in `DESIGN.md`, as small chips that name a part of a system, never a state.) Errors/warnings use `--accent-text` text + an icon + words. Good = ink. Neutral = muted. Charts: one hue family: orange for the focus series, ink/grey steps (`rgb(var(--ink-rgb) / .7)`, `/.45`, `/.25`) for the rest.
3. Flat. Hairline borders (`1px solid var(--line)` / `--line-hi`), radius 8–12 inside the card. Only things you can pick up get `--shadow-lg`; popovers/menus get `--shadow-lg` and a 1px line.
4. No emoji, no exclamation marks, no hype words. 6th-grade English in every label.
5. Each part needs **its own realistic sample data** that fits its job (given in your task). Real-looking names, amounts, dates. Dates are around 29 Oct 2026.
6. Must work at **390 px wide** (phone) and 1440. Nothing may overflow sideways; use `min-width: 0`, wrapping, `overflow-x: auto` only for real tables.

## Motion (we care a lot: make it smoother than the original)

- One curve: `cubic-bezier(.22,1,.36,1)` (`var(--ease-out)`; in JS `EASE = "cubic-bezier(.22,1,.36,1)"`). Only animate `transform` and `opacity` (WAAPI `el.animate` or CSS transitions). Exception: a height glide when content opens/closes: measure h0, change, measure h1, animate `height` h0→h1 with `overflow:hidden` during it, then clear. Never let a box *snap* to a new height.
- Two speeds: a control answering the reader is fast (press scale .97 in .15s; hover colour .15–.2s; menus/popovers open .2–.25s, close a bit faster); content that arrives or moves layout is slow (.35–.6s; toasts arrive .35s).
- Popovers grow from where they were opened (`transform-origin` at the trigger), from `scale(.96)` + fade, never from 0.
- Sliding markers (tabs, selected day, pagination dot) **glide** with transform between positions instead of jumping.
- Motion levels: read `document.documentElement.dataset.motion` each time you animate: `"off"` → no animation at all (final state immediately), `"calm"` → half distance and ~0.6× duration, else full. Also treat `matchMedia("(prefers-reduced-motion: reduce)").matches` as off. Write a helper: `var spd = function () { var m = document.documentElement.dataset.motion || "lively"; if (matchMedia("(prefers-reduced-motion: reduce)").matches) m = "off"; return m === "off" ? 0 : m === "calm" ? .5 : 1; };` In CSS, wrap transitions you want gone under `html[data-motion="off"] .kit #nXX ...{ transition: none; animation: none; }`.
- No endless loops for show. A loop is OK only while work is really running (a spinner while "loading"), and it stops when done.
- Keyboard-opened things (command menu) open instantly or in ≤150ms opacity only.
- Everything readable is visible at rest; nothing waits at opacity 0 for scroll.

## Accessibility

Real `<button>`s, labels on inputs, `aria-expanded`/`aria-selected`/`aria-pressed` where they apply, roles for tabs/listbox/combobox, arrow keys where the pattern expects them, visible focus (the page already gives `:focus-visible` an orange ring; don't remove it), touch targets ≥ 36px.

## Check before you finish

1. Extract each `<script>` and run `node --check` on it (write to a temp .js file). No syntax errors.
2. Grep your file for: `#[0-9a-f]{3,6}` colours other than `#fff`, `green`, `red`, `blue`, `!` in visible text, `localStorage`, selectors not starting with `.kit #n`.
3. Do NOT use the Playwright browser (other agents share it). The lead will test everything visually.
4. Report: the file path, and per part one line: what it does, and anything you were unsure of.
