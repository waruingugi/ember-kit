# The feature catalog (section 09): expandable cards

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

**What it is.** One card per feature, in a single column, each one shut by
default. A shut card shows a big orange Antonio number (`01`), the
feature's name in Fraunces, one line on what it does, and small tags for
who uses it plus when it ships (`V1`, in orange). A `+` on the right turns
into a `×` when it opens. Above the list, filter buttons choose who uses it
(All, Merchant, Rider, Ops, Recipient, Admin), and an "Open all" button
opens every card at once.

An open card has two columns. Left: "How it works", a numbered list of
plain steps. Right: a column of short labelled facts: owning module,
endpoints, events, per-merchant settings, tables, "When it goes wrong", and
"Proved by". Anything not settled is marked with a small dashed
`Our proposal` pill.

**Why it works.** The page stays short, but nothing is left out. A reader
skims the names, opens only what they care about, and finds every card
laid out the same way.

**How it is built:**
- **The cards are native `<details>` and `<summary>`**, so they open with
  the keyboard and work with no script at all. Hide the browser's own
  marker (`summary::-webkit-details-marker { display: none }`, plus
  `list-style: none`).
- **The data is one list**, `FEATURES`, kept in the page's build script.
  Each feature is a dict: `name`, `who`, `when`, `module`, `does`, `steps`,
  `endpoints` (each with a flag for "Our proposal"), `events`, `caps`,
  `tables`, `fails` and `proof`. One small function turns each one
  into a card. To add a feature, add a dict. Never hand-write a card.
- **The styles** (`.feat`): the summary is a grid,
  `44px minmax(0,1fr) auto`. The number is `--font-num` at 26 px in
  `--accent`. The `+` is a 28 px circle that turns 45° over 0.35 s when
  `[open]`. The open body is `minmax(0,1.2fr) minmax(0,1fr)`, padded 78 px
  on the left so it lines up under the title. Below 1100 px it becomes one
  column.
- **The filters**: each `.fbtn` is a toggle
  with `aria-pressed`. A card is hidden unless its `data-who` holds the
  chosen user. "Open all" flips every card's `open` and its own label.
  After any open, close or filter, call `ScrollTrigger.refresh()`, because
  the page height changed under the pinned scenes.

**Prompt to rebuild it:**
> Make a feature catalog of `<product>`. Write one record per feature in a
> single data list: name, who uses it, when it ships, owning module, one
> line on what it does, plain numbered steps, endpoints (mark unsettled ones
> "Our proposal"), events, per-merchant settings, tables, what goes wrong,
> and the test that proves it. Render each as a native `<details>` card,
> as described above: an Antonio
> number, a Fraunces name, who-tags, a `+` that turns to `×`, and a
> two-column body. Add filter buttons by user and an "Open all" button.
