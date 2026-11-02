# The exploded layer scene

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

**The owner loved this one (2026-10-09). Make more of it.** It is section 13,
*Exploded layers*, in the showcase
(`bash ~/.claude/design/scripts/show-reference.sh components/showcase/index.html layers`). A system is
drawn as a few solid slabs stacked into one block. As you scroll, the
block comes apart from the top down, one slab at a time, until every layer
floats on its own with its name beside it. A list next to it lights each
layer as it frees itself. The idea it teaches: a system has a few layers,
and each one only talks to the layer next to it.

**Why it works:**
- It shows the shape before the detail. The reader meets four things, not
  forty.
- The scroll is the explanation. The stack comes apart in reading order,
  top layer first.
- The slabs are real objects, not boxes. Each has a surface that hints at
  its job: a screen for the apps, posts for the services, stacked cards
  for the log, a vault door for the data.
- One slab is orange, the one the page is about (there, the shared log).
- Names appear only once a slab has settled, so nothing is read in motion.

**What you need to build one** (checked 2026-10-09 by rebuilding the
scene from scratch; both skins passed `verify-exploded.py`):

| Need | Why | Where |
|---|---|---|
| The Diagram Design **clone**, pinned `0cf73c3` | The exploded builder (`build-exploded-examples.py`, `axonometry.py`) and `verify-exploded.py` live only in the repo's `scripts/` folder, not in the skill | `~/tools/diagram-design` |
| Python 3.10 or newer | The builder needs it. It uses only the standard library, so there is nothing to `pip install` | Homebrew's `/opt/homebrew/bin/python3` (3.14). Not macOS's `/usr/bin/python3`, which is 3.9 |
| `build_layers.py` | Our starting point: our two skins and four example parts | `~/.claude/design/tools/build_layers.py` |
| GSAP 3.15.0 + ScrollTrigger | Smooths the scroll on desktop. The scene works without it | CDN with SRI (see *GSAP* (`tools/gsap.md`)) |
| The showcase's section 13 | The CSS and the `updateLayers()` scroll code to copy | `components/showcase/index.html` (`#layers`) |
| Playwright MCP | The look checks: at rest, half open, open, phone width | Plugin `playwright@claude-plugins-official` |

The Diagram Design **plugin** is not needed to build this scene. It is
needed for its other diagrams. The builder's skins in `build_layers.py`
are separate from the `ember` profile. When our colours change, change
both.

**How it is built.** Two halves, a drawing and a page.

*The drawing* is Diagram Design's exploded-axonometric builder, run once.
Copy `tools/build_layers.py` and change only the
parts. It loads the builder from the pinned clone and adds our two skins:

```bash
python3 -I build_layers.py ~/tools/diagram-design/scripts <out-dir>
```

- Each layer is a `Part(key, name, sub, rect, t=thickness, kind=..., closed_z=...)`.
  Use 3 to 5 parts. `closed_z` is its height when the stack is shut.
- `kind` sets the slab's surface. The builder has `interface` (a screen),
  `tools` (posts and buttons), `skills` (stacked cards), `vault` (a vault
  with a dial), `harness`, plus plain slabs. Pick the one whose surface
  hints at the layer's job.
- `Figure(..., focus="<key>", gap_k=0.75)` picks the one orange layer and
  how far apart the layers float.
- The skins `ember-light` and `ember-dark` set our paper, ink, muted and
  orange. Copy them as they are.
- The builder writes the SVG drawn **fully open**, with every part in its
  own `<g data-part data-motion-item style="--lift:…px">`. It also writes
  a standalone HTML file per skin. Run `verify-exploded.py` on it.

*The page* closes the drawing with CSS, then lets the scroll open it:

```css
.layers-pin { position: relative; height: 230vh; }      /* the scroll room */
.layers-sticky { position: sticky; top: max(76px, calc(50vh - 290px));
  display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); gap: 32px; align-items: center; }
.layers-fig [data-part][data-motion-item] { transform: translateY(calc(var(--lift) * var(--closed, 0))); }
.layers-fig [data-part] .part-label { opacity: var(--lbl, 1); transition: opacity .3s; }
```

- `--closed` is 1 when a part sits down in the stack, and 0 when it floats
  in its open place. Each part slides on its own `--lift`.
- One number, the scroll progress `p` from 0 to 1, drives every part. Part
  `k`, counted from the top, gets `local = clamp(p · 3.6 − k · 1.05)`, then
  `--closed = 1 − easeOut(local)` with `easeOut(t) = 1 − (1 − t)⁴`. So the
  top layer lifts first and the others follow, one by one. Only the top
  three parts lift (`k` = 0, 1, 2; at `p = 1` the third reaches `1.5`, so
  it settles). The bottom layer never lifts: it is the floor the stack
  opens from, and its list item lights with `clamp((p − 0.8) · 5)`.
- A part's label fades in once `local > 0.92`, when it has settled.
- The list item for each layer gets `.on` as its part frees itself. The
  bottom layer lights last. A small bar per layer fills with the same
  `local` value.
- On desktop, GSAP scrubs `p` with a little weight
  (`ScrollTrigger`, `start: 'top top+=64'`, `end: 'bottom bottom'`,
  `scrub: 0.9`) inside `gsap.matchMedia('(min-width: 1101px)')`. Without
  GSAP, plain scroll maths gives the same `p`.
- With motion `off` or reduced motion, `p` is 1: the stack is open and
  still.
- Below 1100 px the scene is not pinned. The figure sits above the list,
  and `p` follows the figure's place on screen.

**To make a new one:**
1. Name the 3 to 5 layers, top to bottom, and the one the page is about.
2. Copy `build_layers.py`, write the parts, pick a `kind` per layer, set
   `focus`.
3. Build, then run `verify-exploded.py`.
4. Paste the light and dark SVG into the page. Copy the CSS and the
   `updateLayers()` scroll code from the showcase's section 13.
   Change only the part keys.
5. Write the list: one line per layer, saying its job in plain words.
6. Check it at rest, half open, fully open, at phone width, and with
   motion `off`.

**Use it for:** a platform's layers, a product's stack, a request through
its tiers, anything with a few layers where the order matters. Do not use
it for parts that sit side by side. That is an architecture diagram, so
use Archify. For a real object with moving parts, like the watch, use a
Hairline figure instead.
