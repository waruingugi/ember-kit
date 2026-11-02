# The state-machine figure (section 08)

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

**What it is.** Every state an order can be in, as boxes on the dot
canvas, with arrows for the only moves allowed. The happy path runs in
orange: along the top row, down, then back along the middle row to
`delivered`. Cancels are dashed and gather into one "cancel bus". Failure
states are muted and dashed. `END` tags mark the final states. Below it, an
Archify sequence of the same order is shown as a light or dark poster, and
opens as the live diagram on "Explore diagram ↗".

**Why it works.** You see the whole life of an order at once. Colour says
which path is normal, dashes say which ones go back or give up, and every
arrow is labelled with what causes it.

**How it is built.** Not by the Diagram Design skill. It is a small Python
class, `Diagram` in `tools/diagram_svg.py`, that writes SVG in Diagram
Design's style; style it with `tools/diagram_svg.css`. Copy that class for
new diagrams of this kind. Its example draws an invoice's states
(`python3 -I tools/diagram_svg.py <out-dir>`). A finished state machine is
section 17 of `components/showcase/index.html`.
- `node(x, y, w, h, name, sub, cls, tag)` draws a solid mask in the canvas
  colour, then the box (`--paper-raised`, 1 px ink, radius 6). `cls="f"`
  makes the focal box (orange). `cls="e"` makes a muted, dashed end or
  error box. `tag` adds a small mono tag such as `END`.
- `arrow(points, cls, label, at, side)` draws right-angle connectors from
  a list of points. `cls="h"` is the orange happy path. `cls="d"` is dashed.
  Solid arrows get `pathLength="1"` so they can draw in. Dashed ones do
  not.
- `label(...)` puts upper-case mono text on a solid canvas-coloured patch,
  7 px clear of its line, above, below, left or right.
- `zone(...)` draws a dashed region with a label in its top-left corner.
- Every diagram starts with the 18 px dot pattern on `#f1f3f2`. The paint
  order is zones, arrows, labels, nodes, notes.
- Every `<svg class="dg">` has `role="img"`, a `<title>` and a `<desc>`.
- **The motion** (the showcase script, "diagrams: boxes, then lines draw, then
  labels"): one GSAP timeline per diagram, started once at `top 78%`.
  Boxes (`[data-dg]`) rise 8 px and fade in, staggered. Solid arrows draw
  in with `strokeDashoffset 1 → 0`. Dashed arrows fade in. Labels
  (`[data-dgl]`) fade in last. With motion off, it is simply drawn.
- **The styles** (section `#states` of the showcase): node fill `--paper-raised`,
  focal `color-mix(in srgb, var(--accent) 8%, var(--paper-raised))`, arrows
  `--muted` at 1.2 px, the happy path `--accent` at 1.6 px, dashes `5 4`.
- Check each diagram with Diagram Design's `verify-geometry.py` and
  `self_check.py` (see *Diagram Design* (`tools/diagrams.md`)).
- **The Archify poster** under it: show the light and dark `visual-check`
  PNGs first. Keep the live diagram in a `<template>` and add the
  `<iframe sandbox="allow-scripts allow-popups allow-downloads">` only when
  the reader clicks "Explore diagram". That stops the diagram from moving
  the page while it loads.

**Prompt to rebuild it:**
> Draw `<thing>`'s states as a state machine with the `Diagram` class from
> `~/.claude/design/tools/diagram_svg.py`. Lay the
> happy path out as a snake: left to right on the top row, down, then right
> to left. Mark it orange (`h`). Make every give-up or go-back move dashed
> (`d`), and gather the cancels into one bus. Make failure and end states
> muted and dashed (`e`), with `END` tags. Label every arrow with its cause.
> Use the dot canvas, and the boxes-then-lines-then-labels draw-in. Follow
> it with the same flow as an Archify sequence, poster first.
