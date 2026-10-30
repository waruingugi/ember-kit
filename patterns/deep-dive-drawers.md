# The deep dive: one box with many drawers (the Redis drawing)

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

**What it is.** One shared thing that does several separate jobs, drawn as
a cabinet with one drawer per job. On the left, a big rounded cabinet
labelled `REDIS · MEMORYSTORE`. Inside it, four drawers stacked top to
bottom. Each drawer has the job's name, its key pattern in mono
(`idem:<merchant>:<key>`), a small tag for how long the data lives, and a
little handle. On the right, one box per drawer says who uses it. An
arrow from each user box points into its drawer, labelled with the verb
(`push / pull`, `get / set`, `geoadd / search`). One drawer is focal, and
the busiest drawer's arrow is orange. Under the drawing, a table gives each
drawer's maker, key names, lifetime, purpose and "If Redis is down", then a
code window shows the key names and calls.

**Why it works.** "One Redis, four jobs" is hard to keep in your head. A
cabinet with drawers makes it a thing you can see. Each job keeps its own
keys and its own plan for failure, and the table says what breaks.

**How it is built.** With the `Diagram` class in `tools/diagram_svg.py`:
- The cabinet is one raw rounded path, drawn into the zones layer so it
  sits behind everything, with its label on a solid patch above its top
  edge.
- Each drawer is `d.node(x, y, 420, 72, name, key_pattern, cls, lifetime, anchor="start")`.
  The lifetime goes in the tag slot. A small rounded `.dg-handle` bar sits
  at the bottom middle of each drawer.
- Each user is a node on the right, and `d.arrow([(user_x, cy), (drawer_x, cy)], cls, verb, …)`
  joins them, straight across.
- `cls="f"` on the drawer the page is about, `cls="h"` on the busiest one.
- It draws in like every `Diagram`, then the table and the code window
  follow with `data-reveal`.

**Prompt to rebuild it:**
> `<Thing>` does `<n>` separate jobs. Draw it as one cabinet with one drawer
> per job, with the `Diagram` class in
> `~/.claude/design/tools/diagram_svg.py`:
> each drawer with its name, key or data pattern, a lifetime tag and a
> handle. Put one "who uses it" box per drawer on the right, joined by a
> labelled arrow. Make one drawer focal. Follow it with a table (drawer,
> made by, key names, how long it lives, what it's for, if it is down) and a
> code window of the real calls.
