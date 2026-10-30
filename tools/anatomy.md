# Anatomy figures

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

Anatomy turns one idea into a real machine that does the idea. A queue
becomes a marble run. A cache becomes a pin-tumbler lock: when every pin
matches, the plug turns. The reader understands the idea because they know
the machine. Each figure has 40 or more small solid parts, and its live
read-out comes from the same model that moves them.

## When to use it

Use Anatomy when **one idea is the heart of a section** and the reader must
see *how it works*, not just what it is called. All three must be true:

1. The idea has a mechanism: something moves, fills, waits, matches or wears out.
2. A real object does the same thing (you can say it in one sentence: "the plug
   turns only when every pin lines up, just like a cache hit").
3. The section has room for a big figure, about full content width.

Use something else when:

| The need | Use |
|---|---|
| A small picture at the top of a card, a symbol for a thing | Hairline (`tools/hairline.md`) |
| A real object taken apart in stages, line style | Hairline *Staged explode* |
| Who calls whom, how services connect | Archify (`tools/diagrams.md`) |
| States, data models, flows, layer stacks | Diagram Design (`tools/diagrams.md`) |
| Numbers over time | `dataviz` |

Short test: Hairline names a thing. Anatomy shows a thing working.

## Limits

- **At most one Anatomy figure per screen**, and usually one or two per page.
  It is the page's big picture, so it gets no rivals.
- **Size it first** (the skill's step 1). A *Figure* (40–80 parts) is the
  default. A *Hero* (2–4 hours) needs the owner to say yes first. Never start an *Epic*.
- **Truth first.** Every number in the read-out and caption comes from the
  source or the model. Nothing is made up to look busy.
- Add `interactive` when the reader should push the idea and see it break.
  Add `WebGL` only for fire, water or light that lines cannot draw. `3D` only when asked.
- Never publish to the Anatomy community gallery unless the owner asks.

## How it fits our look

- Always build the light theme: `--light` on `build.mjs`, or
  `data-theme="light"` on the wrapper. We have no dark theme.
- The page around it follows `DESIGN.md`: the figure sits in our picture
  frame with a one-sentence tool note under it, and the motion levels
  (`lively`, `calm`, `off`) and reduced motion still win.
- **Settled 2026-10-21: our finish.** The one part to watch is orange
  (`--accent`), like every house figure. The figure sits in our `.frame` (bar
  with three dots, the title, a count) with a tool note under it. Inside, keep
  only Anatomy's hint (bottom left) and live read-out (bottom right): they do
  a job. Its `Fig n` and title corners go, because the frame bar has the
  title. Paste this after `ISO_CSS` and `tokens.css`:

```css
/* On the figure itself, so it wins wherever `.iso` sits (page body or a wrapper). */
.frame .iso-figure {
  --anatomy-page: var(--paper); --anatomy-card: var(--paper-raised); --anatomy-paper: var(--paper-raised);
  --anatomy-text: var(--ink-soft); --anatomy-strong: var(--ink); --anatomy-muted: var(--muted);
  --anatomy-lit: var(--accent); --anatomy-mono: var(--font-mono);
  margin: 0;
}
.frame .iso-plate { box-shadow: none; }                       /* the frame is the edge */
.frame .iso-plate-corner[data-corner="fig"],
.frame .iso-plate-corner[data-corner="title"] { display: none; }
.frame .iso-plate-corner { font-size: 11px; }                 /* house minimum for readable labels */
.frame .iso-plate-corner[data-corner="readout"] { font-family: var(--font-num); font-size: 13px; }
.frame .iso-legend { font-family: var(--font-body); color: var(--muted); padding: 12px 20px 16px; }
```

  Check the first figure built this way at 4x: the orange edges must stay
  crisp, and the read-out must change as the parts move.

## The tool

`anatomy` comes from https://github.com/wheresryan22/anatomy (MIT), pinned
to commit `1482e8469b0a9e0d8cc18ea2740a01423d29ae80` (2026-10-18). The clone
is `~/tools/anatomy`; the global skill is a plain copy in
`~/.claude/skills/anatomy/` (2026-10-21), so `/anatomy` works everywhere. Its
only network use is `scripts/publish.mjs` (the gallery). To move the pin:
`git -C ~/tools/anatomy fetch`, read what changed, check out the new commit,
then copy it over the installed skill again (without `.git`).

Before you finish, run its checks to zero: `node build.mjs --audit`, and
`node scripts/lines.mjs page.html` on the light page.
