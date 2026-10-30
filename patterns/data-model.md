# The data model (section 10): the ER diagram

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

**What it is.** The main tables as boxes on the dot canvas, laid out on a
grid of three rows and five columns. Each box has the table's name on top,
a thin rule under it, then one row per key field, with the field's type
(`FK`, `MONEY`, `POINT`, `POLYGON`, `mch_…`) right-aligned in small mono
caps. Lines carry `1:n` or `1:1` labels. The table the page is about
(`Order`) is the orange focal box, and its two main links are orange too.
Tables that only collect history (`AuditLog`, `OutboxEvent`) are muted and
dashed. Under it, three cards state the rules the tables follow, then a
"Done looks like" box.

**Why it works.** One picture answers "where does this live, and what does
it link to?". The type column makes the money, map and ID fields stand out
at a glance.

**How it is built.** With the same `Diagram` class as the state machine
(`tools/diagram_svg.py`; a finished one is section 16 of
`components/showcase/index.html`):
- Each table is `name: (x, y, [fields], cls)`. A field is written
  `"name  TYPE"`, with two spaces before the type. A box is 228 wide, and
  `32 + 18 · fields + 8` tall.
- Draw the links first, so they sit under the boxes. Each link is
  `d.arrow(points, cls, "1:n", label_at, side)`. Use `"h"` only for the
  focal table's main links.
- Each box is a solid mask, then the box, a header rule (`.dg-hd`), the
  name (`.dg-name`), field names (`.dg-fld`, mono 12 px, `--ink-soft`) and
  types (`.dg-ty`, mono 10 px, tracked, `--muted`).
- `cls="f"` is the focal table. `cls="e"` is a muted, dashed log table.
- The frame bar says "field lists: Our proposal" when the fields are not
  settled yet.
- It draws in like every `Diagram`: boxes, then lines, then labels. Check
  it with `verify-geometry.py` and `self_check.py`.
- For physical tables with SQL types, constraints and indexes, use
  Diagram Design's `type-db-schema` instead. This one is for the shape.

**Prompt to rebuild it:**
> Draw `<product>`'s main tables as an ER diagram with the `Diagram` class
> from `~/.claude/design/tools/diagram_svg.py`. Lay them on a grid with the busiest table in the middle as the
> orange focal box. List key fields with right-aligned types (`FK`,
> `MONEY`, `POINT`, readable ID prefixes). Label every link `1:n` or `1:1`.
> Mute and dash the log tables. Add three cards for the rules the tables
> follow, and a "Done looks like" box.
