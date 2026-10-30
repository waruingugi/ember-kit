# Diagrams: Archify, Diagram Design and the dot canvas

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

Two tools draw every diagram, and Hairline draws small figures. Each one
has its own job. Never draw boxes and arrows as plain HTML.

| Need | Tool |
|---|---|
| How parts connect (architecture), who calls whom in order (sequence) | Archify |
| A state machine, a data model, the layers of one thing, a swimlane | Diagram Design |
| A small drawing of one idea that reacts to the mouse | Hairline |

## The canvas: dots, never lines

Every diagram we draw ourselves sits on a **dot grid**. Never a grid of
lines behind a diagram.

- An even grid of small dots: one dot every 18 px, radius 1, ink at about
  20% (`rgba(21,24,27,.2)`), on the canvas colour `#f1f3f2`. That is a
  touch lighter than the page paper, so the diagram reads as its own sheet.
  Put a strip of canvas colour behind the legend row.
- **Everything in front is solid.** Boxes, labels, the legend and every
  label mask use an opaque fill, so no dot ever shows through them. A tint
  is mixed into the fill ahead of time, never laid on top with opacity.
  The focal fill is `#f7f1ed`, not `rgba(225,74,14,.05)`.
- Paint back to front: the canvas, then the dots, then lines, then boxes,
  then labels.

```svg
<defs>
  <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
    <circle cx="9" cy="9" r="1" fill="rgba(21,24,27,0.2)"/>
  </pattern>
</defs>
<rect width="100%" height="100%" fill="#f1f3f2"/>
<rect width="100%" height="100%" fill="url(#dots)"/>
```

**Which tool uses the dots** (the owner, 2026-10-09):

| Tool | Canvas |
|---|---|
| Diagram Design | **The dot grid.** The `ember` profile turns the dots on and makes them ours. It is loaded into both copies of the skill (see *Diagram Design*). |
| Hand-drawn SVG diagrams | **The dot grid.** Use the pattern above. |
| Hairline figures | A `.canvas-dots` block behind the stage, as in the watch study. The figure's plates are solid. |
| Archify | **Its own canvas. Leave it as it is.** Do not swap its grid for dots. |

The CSS form of the same dots, for a block behind a figure:

```css
.canvas-dots { background-color: #f1f3f2;
  background-image: radial-gradient(circle at 9px 9px, rgba(21,24,27,.2) 1px, transparent 1.3px);
  background-size: 18px 18px; }
```

**Check it every time.** Every Diagram Design or hand-drawn diagram has
the dot pattern, and no dot shows through a box, a label or the legend.

## Motion in diagrams

Diagrams we draw ourselves build in when they scroll into view, once:
boxes rise and fade in, then solid lines draw in, then dashed lines and
labels fade in. A solid line draws in with `pathLength="1"` and
`stroke-dashoffset` from 1 to 0. A dashed line must not use `pathLength`,
because the dashes turn solid. Fade dashed lines in instead. With motion
`off`, the diagram simply shows in its final state.

## Archify

A JSON spec, validated at the `showcase` quality profile, then delivered
with `node bin/archify.mjs deliver`. An overview's hero can be a small
Archify diagram. Once it was replaced by hand-drawn SVG and pictures, and
that was reverted. Do not redo that.

Pinned at `v3.2.0` (the newest release, checked 2026-10-30; `tools/setup.md`
installs it). Since `v3.0.1` the guided story views (`meta.views`, the "Play
story" chapters) are gone and the checks are stricter, so never put
`meta.views` in a spec.

**The steps, every time:**

```bash
A=~/.claude/skills/archify
node $A/bin/archify.mjs validate <type> <spec.json> --quality showcase --json      # 9 of 9, 0 errors
node $A/bin/archify.mjs deliver <type> <spec.json> <out.html> --quality showcase --json
node $A/bin/archify.mjs visual-check <out.html> --json                              # light and dark posters
```

**Its canvas stays its own.** Archify draws a faint grid of lines behind
its diagrams. That is right for Archify, so do not change it. The dot grid
is for Diagram Design and hand-drawn diagrams only.

## Diagram Design

It comes from https://github.com/cathrynlavery/diagram-design (MIT). Pin
it to commit `0cf73c3fcc56667ad91a9a04c439ac6ccfabc9d1` (plugin 2.6.136,
checked 2026-10-29; moved from `f4547ee`/2.6.68). The check found no hooks
and no servers; the "ignore previous instructions" strings in it are test
files proving that imported diagrams cannot carry prompts. `self_check` and
`verify-geometry` give the same results as the old pin on our four
diagram files. Its default accent is now darker and its style guide gained a
contrast contract and a "Font source" switch; `ember` replaces that file, so
our look is unchanged. Installed as a plugin from a clone in
`~/tools/diagram-design`. The plugin keeps its own copy in
`~/.claude/plugins/cache/diagram-design/diagram-design/2.6.136/`. The check
commands below run from the clone, so keep it.

**How to get it.**

```bash
git clone https://github.com/cathrynlavery/diagram-design ~/tools/diagram-design
git -C ~/tools/diagram-design checkout 0cf73c3fcc56667ad91a9a04c439ac6ccfabc9d1
# then, inside Claude Code:
/plugin marketplace add ~/tools/diagram-design
/plugin install diagram-design@diagram-design
/reload-plugins
```

**Its look must be ours.** Our look is saved as the Diagram Design profile
`ember`, in `~/.diagram-design/profiles/ember.md`. This repo keeps the
master copy in `claude/diagram-design/ember.md`.

**It is loaded into both copies of the skill**, so its defaults are never
the shipped look (done 2026-10-09):
- the clone, `~/tools/diagram-design/skills/diagram-design/references/style-guide.md`,
  which is the copy the skill actually runs from;
- the plugin, `~/.claude/plugins/cache/diagram-design/diagram-design/<version>/skills/diagram-design/references/style-guide.md`.

Each starts with a `diagram-design-profile` header naming `ember`. Before
drawing, check that header is there. If a plugin update or a `git` command
put the default back, run `/diagram-design:profile load ember`. The
shipped default is saved as the `default` profile, so `reset` can bring it
back if ever wanted. The clone now shows this file as changed in `git`.
That is on purpose. Before moving the pin, run
`git -C ~/tools/diagram-design stash`, move it, then load `ember` again.

When this file's diagram rules change, update that profile too, with
`/diagram-design:profile update ember`, then load it into both copies. The
profile carries these rules:
- The dot-grid canvas and solid boxes from *The canvas* above.
- Boxes: `--paper-raised` fill, a 1 px `--ink` line, corner radius 6 (8
  for states).
- One or two focal boxes at most, with an orange line and the `#f7f1ed`
  fill.
- Lines turn at right angles only. The happy path is orange. A line that
  "goes back" is dashed `5 4`.
- Labels sit on a solid patch the colour of the canvas, so no line crosses
  a word.
- Our fonts: Inter for box names, JetBrains Mono for small labels, Fraunces
  italic for a note.
- Our component colours, from the table above.
- Every SVG gets `role="img"`, a `<title>` first, then a `<desc>`.

**Checks.** Put the `<svg>` in its own HTML file, then run:

```bash
DD=~/tools/diagram-design
python3 -I $DD/scripts/verify-geometry.py <file.html>                 # must say 0 finding(s)
python3 -I $DD/skills/diagram-design/scripts/self_check.py <file.html> # must say OK
python3 -I $DD/scripts/verify-exploded.py <file.html>                 # only for layer views
```
