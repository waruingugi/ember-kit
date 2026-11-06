# UI libraries: shadcn/ui, beUI, easyui and Arc

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

Four free libraries of React parts. Check them before you build a part by hand.
They give you a part that already works (keyboard, focus, screen readers), or
an idea for one. They never give the look: `DESIGN.md` does.

| Library | What it is good for |
|---|---|
| **shadcn/ui** (https://ui.shadcn.com, `shadcn-ui/ui`, MIT) | Plain, sound parts with no motion: dialogs, menus, selects, forms, tables, tabs, sidebars, toasts. Built on Radix, so the keyboard and screen-reader rules are right. |
| **beUI** (https://beui.dev, `starc007/ui-components`, MIT, by Saurabh Chauhan) | Parts where motion is the point: toast stacks, docks, bottom sheets, wheel pickers, number tickers, chat and agent parts. Built on Motion. |
| **easyui** (https://easyui.site, `Surajmaurya1/easyui`, MIT) | Everyday parts with a twist: stat and money cards, charts, payment status, receipt printer, peek cards, folder cards, undo toasts. Built on Framer Motion. 25 of them are already rebuilt in our look (`patterns/interactive-parts.md`, parts `n01` to `n25`): check those first. |
| **Arc** (https://uiarc.dev, free parts MIT) | The most fluid motion of the four. Look here first when a part must feel alive: numbers that roll like an odometer in the direction they moved, meters and charts that answer on hover, springy sliders (elastic, ruler, scrub), hold to confirm, morphing buttons and selects. Every part's docs say how it moves, how it handles keys, and what reduced motion does. About half the parts are Pro: skip those. Built on Motion. |

## Order

1. **Our parts first.** `components/parts/` already has the look.
2. **Then a library.** A plain control or form: shadcn/ui. A part that moves:
   Arc, beUI or easyui. When more than one fits, compare them
   (`patterns/compare-parts.md`).
3. **Hand-built last.**

## Free parts only

shadcn/ui, beUI and easyui are free and MIT. Arc's free parts are MIT; its Pro parts are paid. Use only beUI's public registry and the
`beui` skill. Never use beUI Pro, the `beui-pro` skill or anything that asks
for a licence key. If a part is not in a public registry, skip it. For Arc,
`https://uiarc.dev/llms.txt` marks every Pro part with "(Pro)": never read,
rebuild or copy a Pro part, not even from its demo.

## Where to look (nothing to install)

| What | shadcn/ui | beUI |
|---|---|---|
| Every part | `https://ui.shadcn.com/r/index.json` | `https://beui.dev/registry.json` |
| One part's docs | `https://ui.shadcn.com/docs/components/<name>.md` | `https://beui.dev/components/motion/<slug>.md` |
| One part's source | `https://ui.shadcn.com/r/styles/new-york-v4/<name>.json` (the code is in `files[].content`) | `https://beui.dev/r/<slug>/raw` |
| Which part for which job | the `shadcn` skill's rules, or the docs list in `https://ui.shadcn.com/llms.txt` | the picker table in the `beui` skill |

**easyui** has no docs files. Its list, with each part's file path, is
`https://easyui.site/registry.json`. Read a part's source on GitHub at
`https://raw.githubusercontent.com/Surajmaurya1/easyui/main/<files[].path>`,
see it working at `https://easyui.site/components/<name>`, and add it with
`npx shadcn@latest add Surajmaurya1/easyui/<name>`. Its sticky pages are
already ours, in four kinds (`patterns/interactive-parts.md`, part 28).

**Arc** lists every part, with its docs link and a "(Pro)" mark, in
`https://uiarc.dev/llms.txt`. One part's docs (when to use it, keys, motion,
reduced motion): `https://uiarc.dev/components/<slug>/markdown`. A free part's
source: `https://uiarc.dev/r/<slug>.json` (the code is in `files[].content`).
See it working at `https://uiarc.dev/components/<slug>`. Its own agent rules
are in `https://uiarc.dev/r/skills/arc/SKILL.md`: read them for ideas, but
`DESIGN.md` wins on the look. Taste Lab round 3 tried its best ideas in our look.

**Icons:** never take icons from morfy.design. Its terms forbid giving its designs away as a set or library, and ember-kit is public. Draw our own.

The parts change often, so read the source each time. It is someone else's
code: read it before you use it.

## In a React or Next app

1. In a shadcn project (it has a `components.json` file) the `shadcn` skill
   loads by itself. Follow its rules for building parts (forms, composition,
   icons). For the look, this file wins. Add the part: `npx shadcn@latest add <name>` or `npx shadcn@latest add @beui/<slug>`.
   If not, copy the source and turn its Tailwind classes into our CSS.
2. Read every file it added.
3. Give it our look. For shadcn parts, do it once in the theme, not in each
   part: set shadcn's colour names in `globals.css` to our values (below).
   To theme a whole new app, follow the `shadcn` skill's `design-system.md`
   with our `DESIGN.md`, and use the table below as its role map.
   Swap timing and curves for *Two speeds* and our curve (`DESIGN.md`,
   *Motion*). Keep how each part is built, and keep its keyboard, focus and
   reduced-motion handling.
4. Make it follow the motion levels: with motion `off` it shows the end state
   and does not move.

**Name clash.** shadcn uses two of our names for other things. Its `--accent`
is a grey hover colour (ours is the orange), and its `--radius` replaces ours.
In a shadcn project, do not load `components/tokens.css` as it is. Put our
values into shadcn's names, copying the value, not `var(...)`:

| shadcn name | our value from `components/tokens.css` |
|---|---|
| `--background` | `--paper` |
| `--foreground`, `--card-foreground`, `--popover-foreground` | `--ink` |
| `--card`, `--popover` | `--paper-raised` |
| `--primary`, `--ring` | `--accent` (the orange) |
| `--primary-foreground` | `--paper` |
| `--secondary`, `--muted`, `--accent` | `--paper-sunk` |
| `--muted-foreground` | `--muted` |
| `--border`, `--input` | `--line-hi` |
| `--radius` | `--radius` |

Do the same for the night theme under `.dark`, with the night values. Fonts
come from `--font-body` and `--font-mono`.

## On a static HTML page

Use the libraries for ideas only. Never paste React into a static page. Read
the docs and the source to learn how the part works: its parts, its states,
its ARIA roles and which keys do what (shadcn), or its spring and its timing
(beUI). Then build it again with plain HTML, our CSS, and `window.Motion`
(`tools/motion.md`) or CSS transitions. Keep every role and key it had.

## Thinking orbs (libraries.dev, the orbs only)

From https://libraries.dev/orbs, by Jakub Antalik (npm `thinking-orbs`, MIT).
Only the orbs: nothing else from libraries.dev. Each orb is a small dotted
ball drawn on a canvas that shows an AI or agent at work. It has nine states:
`working`, `searching`, `solving`, `listening`, `connecting`, `weaving`,
`composing`, `breathing` and `shaping`. It comes in two sizes that are
separate designs: `64` (next to a chat answer) and `20` (inside a line of
text). It is one ink colour, so it already fits our look, and it follows
`html[data-theme]`, our night switch.

It is our *busy sign* (`DESIGN.md`, *Motion*): show it only while work is
really running, and remove it the moment the work ends. Pick the state that
says what is happening. Never use it as decoration. It stays ink; making it
orange would change the look, so ask the owner first.

Read for safety on 2026-11-01: no network calls, no storage, no `eval`, no
install scripts, no dependencies. It draws with plain canvas arcs. With
reduced motion it shows one still frame, and it pauses when off screen.

**React or Next:** `npm i thinking-orbs@0.3.2`, then
`<ThinkingOrb state="searching" size={64} aria-label="Searching the files" />`.
With motion `off`, pass `paused`.

**Static page:** paste this. It loads only the drawing engine (no React)
from that exact version, follows our motion levels (`calm` runs at half speed,
`off` shows one still frame) and the night theme, and stops when the page
removes the canvas. Write an `aria-label` that says what is happening.

```html
<canvas data-orb="searching" role="img" aria-label="Searching the files"></canvas>
<canvas data-orb="working" data-size="20" role="img" aria-label="Working"></canvas>
<script type="module">
// Thinking orbs engine: thinking-orbs@0.3.2 by Jakub Antalik, MIT. A published npm version never changes.
import { r as resolvePreset, M as MODE_FRAMES, p as paintFrame } from 'https://cdn.jsdelivr.net/npm/thinking-orbs@0.3.2/dist/index-B8WsUNf5.js';
const root = document.documentElement;
const level = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'off' : (root.dataset.motion || 'lively');
const dark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
for (const c of document.querySelectorAll('canvas[data-orb]')) {
  const size = Number(c.dataset.size) === 20 ? 20 : 64; // two tuned designs, not a scale
  const dpr = Math.min(2, devicePixelRatio || 1);
  c.width = c.height = Math.round(size * dpr);
  c.style.width = c.style.height = size + 'px';
  const ctx = c.getContext('2d');
  const { mode, speed, opts } = resolvePreset(c.dataset.orb, size);
  const draw = (t) => { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, size, size); paintFrame(ctx, MODE_FRAMES[mode](size, t, opts), dark()); };
  let seen = true;
  new IntersectionObserver(([e]) => { seen = e.isIntersecting; }).observe(c);
  const loop = (now) => {
    if (!c.isConnected) return; // work ended: the page removed the orb
    const m = level();
    if (m === 'off') draw(0.6); // one still frame, like the package does for reduced motion
    else if (seen && !document.hidden) draw(now / 1000 * speed * (m === 'calm' ? 0.5 : 1));
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
</script>
```

The engine file has a hashed name (`index-B8WsUNf5.js`) and short export
names (`r`, `M`, `p`). They are fixed for 0.3.2, but they change with every
new version: when you move the pin, read the new `dist/index.es.js` to find
them again. Tested in Chromium on 2026-11-01: both sizes draw and move,
and motion `off` holds still.

## What we never take

- Their colours, fonts, shadows, glows, gradients, metallic or shader looks,
  or their timing values.
- Any part `DESIGN.md` has removed, such as slide to confirm.
- The shadcn skill's own look advice where it fights `DESIGN.md` (for example
  "never change a part's colours": we change them through the theme).
- Both MCP servers. We do not set them up, because the links above do the
  same job.

## Credit

When you copy code from a part, put this line at the top of the file:
`// Based on shadcn/ui <name> (MIT, github.com/shadcn-ui/ui)` or
`// Based on beUI <slug> (MIT, github.com/starc007/ui-components)` or
`// Based on easyui <name> (MIT, github.com/Surajmaurya1/easyui)` or
`// Based on Arc <slug> (MIT, uiarc.dev)`.

The `shadcn` skill (`npx skills add shadcn/ui` fetches whatever is newest)
is a copy of `skills/shadcn/` from commit
`4233ed1caded8c38f4bc14b14afe1f93ebcaf966` (2026-10-14), unchanged, with
shadcn's `LICENSE.md`. It was read in full on 2026-11-01: no hooks, no hidden
instructions, and its one script only lists files. Each time it loads, it
runs `npx shadcn@latest info --json` in the project. That is shadcn's own
CLI at its newest version, and it only reads the project.

The `beui` skill is a copy of `skills/beui/` from commit
`a866cb2f37ce68c3fc0c66425e86e3f31566e4be` (2026-11-01), unchanged, with
beUI's `LICENSE`. To move the pin, read what changed in the skill, then copy
the new `SKILL.md` over `claude/skills/beui/` and over the installed skill.
