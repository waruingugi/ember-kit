# Depth: things that float, tilt and sit in layers

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

Added 2026-10-11 at the owner's request, from the `antigravity-design-expert`
skill. That skill's ideas are good. Its stack and its glass look are not ours.
This file says what we keep, where depth has a job, and where it never goes.

**The idea.** A page is mostly flat paper. A few things on it are *objects*
the reader can pick up: a card that opens a page, a layer of a system, a
piece of a scene, a widget to play with. Depth makes those few things look
like objects, so the eye knows what can be touched and what sits in front of
what. If everything floats, nothing does.

## Where depth goes, and where it never goes

Ask one question: *is this a thing the reader can pick up, or a thing that
sits in front of another thing?* If yes, it may get depth. If no, it stays
flat.

| Use depth | Why it has a job |
|---|---|
| Cards that open another page (page cards, the overview's map) | They are doors. Lift and tilt say "you can go in here". |
| The exploded layer scene and other layer stacks | The layers really are in front of each other. Shadows make the gap real. |
| Hero scenes (one picture at the top of a page) | Two or three planes moving at different speeds show what sits behind what. |
| Interactive widgets (a gate you switch, a breaker you trip) | They are machines on the table. A soft float says "play with me". |
| Sheets, drawers, pop-overs | They really are above the page. |
| The one orange part of a figure, when it is "picked up" in a scene | Depth is how it steps out of the group. |

| Never use depth | Why |
|---|---|
| Body text, headings, callouts | Reading needs a still, flat page. |
| Tables, model cards, code blocks, folder views | Data is checked line by line. Tilt and float make that harder. |
| Boxes inside a diagram on the dot grid | The canvas rule: everything in front of the dots is solid and flat. |
| The sidebar and top bar | They are the frame, not the content. |
| More than one floating group in one screen | Two things fighting for "front" means neither is. |

## Three heights

Depth is a shadow plus, sometimes, a move. Use only these three heights.
Shadows are soft, wide and tinted with our ink, never black and never a glow.

```css
:root{
  /* rest: sits on the paper */
  --depth-1: 0 1px 0 rgba(20,23,26,.04), 0 2px 6px -2px rgba(20,23,26,.08);
  /* lift: hovered or picked up */
  --depth-2: 0 1px 0 rgba(20,23,26,.04), 0 10px 24px -10px rgba(20,23,26,.18), 0 2px 6px -2px rgba(20,23,26,.06);
  /* float: above the page (sheets, the front layer of a scene) */
  --depth-3: 0 1px 0 rgba(20,23,26,.04), 0 30px 60px -28px rgba(20,23,26,.30), 0 12px 24px -12px rgba(20,23,26,.12);
}
```

`--shadow-sm` and `--shadow-lg` in `components/tokens.css` stay as they are.
`--depth-1` is close to `--shadow-sm`; `--depth-3` is close to `--shadow-lg`.

## The moves

All moves use the one curve (`--ease-out`, GSAP `expo.out`) and only
`transform` and `opacity`.

- **Lift.** On hover a depth card rises 3 px (the standard card hover) and
  its shadow goes from height 1 to 2. Never animate `box-shadow` itself. Put
  the bigger shadow on a `::after` layer and fade its `opacity`. 0.45 s.
- **Tilt.** A door card leans toward the pointer, at most 4°, with
  `perspective: 900px` on its parent. Only on a mouse (`(hover:hover) and
  (pointer:fine)`). It eases back to flat when the pointer leaves. Never
  tilt text that is being read; a door card has a title and two lines.
- **Planes.** A scene has two or three planes: back (dots, ghost shapes),
  middle (the main picture), front (labels, the orange part). On scroll the
  back moves at 0.85 of the scroll speed and the front at 1.05. Use
  ScrollTrigger `scrub`, never a scroll listener.
- **Drop in.** A group of depth cards arrives in a stagger of 0.08 s, each
  falling 14 px from slightly above with its shadow fading in, like plates
  set on a table. This replaces the plain fade-up for that group only.
- **Isometric.** Only for layer stacks and scenes, built by the drawing tool
  (`patterns/exploded-layers.md`) or as an SVG drawn at 30°. Never rotate
  live HTML text into isometric.

## The motion levels

- `lively`: everything above.
- `calm`: lift and drop-in only, at half distance. No tilt, no planes.
- `off` and reduced motion: shadows stay (they are not motion), nothing moves.
  Height 2 shows on hover with no transition.

## What we took out of the Antigravity skill, and why

| Antigravity says | We do | Why |
|---|---|---|
| React, Next.js, Tailwind | Plain HTML, CSS, GSAP | Our pages are single files that work without a build. |
| Glassmorphism, `backdrop-filter: blur(12px)` | Solid paper | Light theme, solid parts in front of the dots, and blur is slow on large surfaces. |
| Every state change at least 0.3 s | Our timings: hovers 0.45 s, presses fast | DESIGN.md *Motion*. |
| "Tasteful" scroll hijacking | Pinning only on explainer pages, never hijacking | Readers scroll back and forth. |
| `will-change: transform` on animated parts | Only while a move runs, then removed | Many promoted layers waste memory (`fixing-motion-performance`). |
| Isometric tilt on dashboard grids | Isometric only for layer stacks and scenes | A tilted dashboard is hard to read. |

## Code

```css
.depth{position:relative;box-shadow:var(--depth-1);
  transition:transform .45s var(--ease-out)}
.depth::after{content:"";position:absolute;inset:0;border-radius:inherit;
  box-shadow:var(--depth-2);opacity:0;transition:opacity .45s var(--ease-out);
  pointer-events:none}
.depth:hover{transform:translateY(-3px)}
.depth:hover::after{opacity:1}
.tilt-wrap{perspective:900px}
.tilt{transform-style:preserve-3d}
html[data-motion=off] .depth,html[data-motion=off] .depth::after{transition:none}
html[data-motion=off] .depth:hover{transform:none}
@media (prefers-reduced-motion:reduce){.depth,.depth::after{transition:none}.depth:hover{transform:none}}
```

```js
// Tilt: door cards lean toward the pointer. Mouse only, lively only.
const fine = matchMedia('(hover:hover) and (pointer:fine)');
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('pointermove', e => {
    if (!fine.matches || document.documentElement.dataset.motion !== 'lively') return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `translateY(-3px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});
```

Read the rect once per move, write once (no layout thrash). The card's
`transition` eases it back on leave.

## Check before publishing

- Depth appears only where the first table says it has a job.
- At most one floating group per screen.
- No `backdrop-filter`, no glow, no black shadows.
- Motion `off` and reduced motion: no move, shadows still there.
- `fixing-motion-performance` audit: no `box-shadow` animation, no lasting
  `will-change`, no scroll listeners.
