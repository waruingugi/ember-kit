# Taste Lab

> Part of ember-kit. Read `DESIGN.md` first. What the owner picked here, and the rules that came out of it, are in `patterns/taste.md`.

**What it is.** A page that shows one common part (a button, a menu, a drawer) in four to six versions side by side. The owner tries each one and keeps the ones they like. The picks become rules in `patterns/taste.md`, and the winners become house parts in the showcase.

This folder holds the source of every round run so far, so every version can be rebuilt, including the ones that are not house parts yet:

| Round | Parts | Versions | Source |
|---|---|---|---|
| 1 | 16: buttons, form field, select, switch, tabs, dropdown, tooltip, popover, modal, drawer, toast, data table, accordion, command menu, date picker, empty and loading | 83 | `src/b1.mjs` to `src/b4.mjs` |
| 2 | 9: main button contrast, popover, drawer, choice, slider, progress, alerts, pages, tags | 39 | `src/r2/a.mjs`, `src/r2/b.mjs` |
| 3 | 10, after Arc (uiarc.dev, free parts): rolling number (ours against Arc's), usage meter, donut, sparkline, metric card, countdown, number and money field, fluid sliders, morph select, morphing buttons | 40 | `src/r3/a.mjs` (holds the shared `window.TLroll`), `src/r3/b.mjs` |
| 4 | 36: more of r3's donut, sparkline, countdown and sliders, r3 fixes, then the Arc parts the owner named (buttons, theme switch, menus, inputs, pickers, upload, layout, status, lists, blocks) | 143 | `src/r4/a.mjs` to `f.mjs`; `ONLY=<batch> node build.mjs 4` builds one batch alone |

## Build it

```bash
cd ~/.claude/design/tools/taste-lab
node build.mjs 1     # round 1 → taste-lab.html and preview.html
node build.mjs 2     # round 2 → taste-lab-r2.html and preview-r2.html
node build.mjs 3     # round 3 → taste-lab-r3.html and preview-r3.html
node build.mjs 4     # round 4 → taste-lab-r4.html and preview-r4.html
```

- `taste-lab*.html` is the page to publish as an artifact. It starts with its own `<title>` and `<style>`, with no `<html>` or `<head>`, because the Artifact tool adds those.
- `preview*.html` is the same page wrapped in a full document, to open in a browser or test with Playwright.
- Both are made by the build, so git ignores them.
- The page background is the house squares grid (part `bg-grid`). Its script is pasted at the end of `src/page.html`, because the build cannot include files from `components/`. If the grid changes in the showcase, run `node scripts/split.mjs` and paste the script from `components/parts/bg-grid.html` there again. The canvas's `data-blocks` lists the lab's own boxes (`.opt`, `.ref`, `.decide`, the section heads) so the grid shows only in the gaps.

**Saving picks.** Published as an artifact with `capabilities: {db: {rules: [{path: "rounds", read: "view", write: "owner"}]}, user: {}}`, each pick saves to `rounds/r<N>/picks/<part id>`. Opened anywhere else, the page says "Not saving here. Use Copy picks", and the owner pastes the copied list into chat.

## Find a version

To rebuild one version, find its part in the source, then the option by its letter.

| File | Parts (`id`) |
|---|---|
| `src/b1.mjs` | `buttons`, `fields`, `select`, `toggles` |
| `src/b2.mjs` | `tabs`, `dropdown`, `tooltip`, `popover` |
| `src/b3.mjs` | `modal`, `drawer`, `toast`, `table` |
| `src/b4.mjs` | `accordion`, `command`, `datepick`, `loading` |
| `src/r2/a.mjs` | `contrast`, `popover`, `drawer`, `choice`, `slider` |
| `src/r2/b.mjs` | `progress`, `alerts`, `pager`, `tags` |

Each version's own CSS is scoped to `#t<n><letter>` (for example `#t05B`, tabs B in round 1). It uses the lab's small helpers (below), so to make it a house part, rewrite it in the showcase's style. See *Make a winner a house part*.

## How a part is written

A part is one object. Its versions are in `opts`.

```js
{
  id: 'tabs', n: '05', name: 'Tabs', h: 240,                // h: default stage height in px
  claim: 'A heading with <em>one orange phrase.</em>',
  lead: 'One or two plain sentences: the job, and what to try.',
  ref: { ids: 'n17', text: 'What the house part does today.', url, label }, // or null
  noteHint: 'Placeholder for the owner\'s note', moreHint: 'Placeholder for "show me more like"',
  css: '/* shared by every version */', js: '/* shared helpers, often window.TL… */',
  opts: [ /* versions, below */ ],
}
```

A version:

```js
{
  k: 'B', name: 'What it does, in plain words', line: 'One or two sentences.',
  kind: 'Optional label; defaults by letter',
  from: [['beUI tabs', 'https://…'], ['House part n17', null]],  // where the idea came from
  tryit: 'What to click', needs: 'CSS only', keys: 'Arrow keys move', off: 'What happens with motion off',
  law: 'Which UX law it leans on (patterns/ux-laws.md)',
  tags: ['motion:springy', 'speed:mid', 'new:twist', 'look:ember'],
  html: '…', css: '#t05B …', js: '…',      // js runs as run(id, function (box) { … })
  top: false, h: 260, wide: false,          // optional: pin to top, own height, span two columns
}
```

**Letters.** A plain (the shadcn way), B lively (beUI or easyui, on a spring), C a mix, D a house part pushed further, E off-look, F wild card, G a mix the owner asked for. In round 2 and later, B comes first and **E is never shown** unless the owner asks (`DESIGN.md`, *Motion*).

**Tags.** The build refuses any tag not in this list. They are how picks turn into the leanings in `patterns/taste.md`.

| Scale | Values |
|---|---|
| `motion` | `still`, `some`, `springy` |
| `speed` | `quick`, `mid`, `slow` |
| `density` | `roomy`, `mid`, `compact` |
| `depth` | `flat`, `some`, `lifted` |
| `feedback` | `quiet`, `clear`, `loud` |
| `open` | `trigger`, `centre`, `edge`, `inplace` |
| `new` | `familiar`, `twist`, `novel` |
| `look` | `ember`, `off` |

**Lab helpers** (`src/lib.js`): `$`, `$$`, `run`, `moving()` (false with motion off or reduced motion), `TICK` (the orange tick), `pop(trigger, panel, opts)` (open, close, Escape, outside click, focus) and `nav(panel, selector, opts)` (arrow keys and a gliding highlight). Shared pieces go on `window.TL…` in a part's `js`, such as `TLpv` (popover), `TLdrawer`, `TLglide` (a height glide) and `TLmoney`. Lab atoms in `src/base.css`: `.l-btn` (`.pri`, `.sm`, `.ghost`), `.l-in`, `.l-panel`, `.l-pop`, `.l-item`, `.l-av`, `.l-num`, `.l-muted`, `.l-lbl`, and the spring tokens `--sp-snappy`, `--sp-bouncy`, `--sp-soft`.

## Run a new round

1. Pick the parts: what the owner asked to see more of, and common parts not shown yet.
2. Make `src/r<N>/index.mjs` that exports the parts as `default`, plus `description` (a sentence) and `lead` (the hero paragraph). Put the parts in batch files beside it, as `r2/` does. Round 1's shared helpers (`window.TL…`) load on their own. To reuse a round 2 helper, import that batch into your index and list it before your parts.
3. Four or five versions per part. B (lively) first. No E. Use the owner's earlier picks for the "What you liked before" strip (`ref`).
4. Make sure every open box shows **in full** inside its stage: pin the trigger to the top (`top: true`) and give the stage room (`h`). In round 2 the owner could not judge popovers that were cut off.
5. `node build.mjs <N>`, then test `preview-r<N>.html` at 1440 and 390 px, in day and night, with motion off: every control does something, nothing spills out of its stage, and the console stays clean.
6. Publish `taste-lab-r<N>.html` as a new artifact with the capabilities above. Write one test pick, read it back and delete it.

## After the owner picks

1. Log each part in `notes/choices.md` (one row, with the owner's own words).
2. Add the leanings to `notes/owner-likes.md`, and the rules to `patterns/taste.md` (sections 3 to 5).
3. If a pick is a new rule for every page, add it to `DESIGN.md` and ask the owner first.
4. Make each winner a house part (below).
5. Add a dated line to `CHANGELOG.md`.

## Make a winner a house part

The lab version shows the idea; the house part is the one pages build from. The lab's code does not move across as it is: rewrite it in the showcase's style.

**Before you start.** `cd ~/.claude/design/scripts && npm install` once. Pick the id: the next free `n` number. `grep -o 'id="n[0-9][0-9]"' components/showcase/index.html | sort | tail -1` shows the highest; add one.

1. **Markup.** Put a `kit kit-part` block in `components/showcase/index.html`, right after the older part that does the same job (for example after `n17` for tabs):

   ```html
   <div class="kit kit-part">
     <h3 class="kit-h">A claim with <em>one orange phrase.</em></h3>
     <p class="kit-p">One plain line on what to try.</p>
     <section class="cs kv4" id="nXX">
       <div class="frame"><div class="fbody"><div class="stage">
         … the part …
       </div></div></div>
     </section>
   </div>
   ```

   Use the showcase's own classes (`.b`, `.b.sm`, `.b.pri`, `.in`, `.stage`, `.frame`, `.fbody`, `.note`, the icon sprite `<svg class="i"><use href="#i-…"/></svg>`), not the lab atoms (`.l-btn`, `.l-in`, `.l-panel`).

2. **CSS.** Add it to the **main `<style>` of the showcase** (the big one in the head), in number order: right after the rules of the part with the next lower number (n47's rules come after n46's). `split.mjs` reads only that block; CSS anywhere else is lost. Scope every rule as `.kit #nXX …`. Name keyframes `nXX-…`.
   - Use the showcase's spring tokens: `transition: transform var(--sp-snappy-d) var(--sp-snappy)`. Their lengths differ from the lab's (the showcase: snappy .37 s, bouncy .49 s, soft .67 s; the lab: .32, .5, .45). Never copy a lab duration in by hand.
   - Colours only from tokens (`--accent`, `--accent-text`, `--on-accent`, `--ink`, `--ink-soft`, `--muted`, `--line`, `--paper-raised`, `rgb(var(--ink-rgb) / .1)`), so night works by itself.

3. **Script.** One `<script>` per part, near the end of the body, in number order among the other new-style part scripts. It must start **exactly** like this, double quotes and two digits, or `split.mjs` never finds it and the part file comes out with no script:

   ```js
   (function () {
     "use strict";
     var box = document.getElementById("nXX"); if (!box) return;
     var root = document.documentElement;
     function lv() { var m = root.dataset.motion || "lively"; if (matchMedia("(prefers-reduced-motion: reduce)").matches) m = "off"; return m; }
     function moving() { return lv() !== "off"; }
     function sp(n) { return getComputedStyle(root).getPropertyValue("--sp-" + n).trim() || "cubic-bezier(.22,1,.36,1)"; }
     function $(s, el) { return (el || box).querySelector(s); }
     function $$(s, el) { return [].slice.call((el || box).querySelectorAll(s)); }
     function money(n) { return n.toLocaleString("en-KE"); }
     function count(el, from, to, fmt, ms) { if (!moving()) { el.textContent = fmt(to); return; } cancelAnimationFrame(el._an); var t0 = performance.now(); (function f(t) { var k = Math.min(1, (t - t0) / (ms || 320)); el.textContent = fmt(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)))); if (k < 1) el._an = requestAnimationFrame(f); })(t0); }
     function glide(el, h0, d) { if (el._gl) el._gl.cancel(); var h1 = el.offsetHeight; if (h0 !== h1 && moving()) el._gl = el.animate([{ height: h0 + "px" }, { height: h1 + "px" }], { duration: d || 340, easing: "cubic-bezier(.22,1,.36,1)" }); }
     // … the part …
   })();
   ```

   Copy only the helpers you use. This is the whole toolbox: the older parts' `spd()` and `onView()` live in a different script and cannot be reached. For a height glide, measure `h0 = el.offsetHeight` **before** you change the content, then call `glide(el, h0)`. Motion off (`!moving()`) must still do the job, just without the movement. With motion off the showcase also kills every CSS animation and transition in `.kit`, so the resting CSS must show the end state: prefer a transition between two states over a `forwards` keyframe, which never reaches its end. Never put a holder (a toast, a layer) outside the part.

4. **Words and data.** Made-up sample data that fits the part's job (PocketPay, example.com, KES amounts).

5. **Check.**
   - `node scripts/split.mjs`: it should list `nXX.html` with a `<script data-slot>` inside. If the script is missing, step 3's first lines are wrong.
   - `node scripts/singles.mjs --ids nXX`, then again with `--w 390 --theme dark`. Each must say `ok`.
   - `node scripts/assemble.mjs all -o /tmp/all.html && node scripts/match.mjs components/showcase/index.html /tmp/all.html`. The parts after yours move down, so their shots fail; that is expected. Every other group must still match.
   - Open it in a browser at 1440 and 390 px, in day and night, with motion off: every control does something, nothing spills out, no console errors.
   - `node scripts/lint-paths.mjs`.

6. **Docs.** Update all of these the same day:
   - `patterns/interactive-parts.md`: a row in the Taste Lab table **and** a spec in *Part specs* (layout, timing, motion off, keys, words), so a future Claude can rebuild it.
   - `patterns/taste.md`: section 4 (the job it does) and section 5 if it was one of several kept.
   - `patterns/showcase.md`: its group list.
   - `notes/choices.md`, and `CHANGELOG.md` (one dated line).
   - The part count in `README.md` (twice), `DESIGN.md` (*Showcases*) and the showcase's meta row (`<dt>Parts</dt><dd>85</dd>`).
