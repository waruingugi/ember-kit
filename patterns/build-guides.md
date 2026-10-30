# Build guides

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

Guides share their own layout: a sticky top bar, a chapter rail on the
left (collapsible, see *The sidebar* (`DESIGN.md`)), and a masthead with "where you are
right now". Chapters are **numbered steps**. Each step has a title (what),
a **Why** and a **Where** (small ink labels in the mono font), then the
code. Notes are boxes on raised paper with a 3 px left edge. The colour
follows the state rule in `DESIGN.md` (orange and ink, never green, red or
violet), and every box also carries an icon and a word, so colour is never
the only sign:

| Box | Edge and icon | Meaning |
|---|---|---|
| `note-why` | ink edge, "Why" | The reasoning. |
| `note-trap` | `--accent-text` edge, a warning icon, "Trap" | A mistake to avoid. |
| `note-check` | ink edge, a tick, "Check" | Check this before you commit. |
| `note-spike` | accent orange edge, "Spike decides" | A claim not yet proven. |

Each chapter ends with a commit block. The guide ends with a dark "done"
banner and a "what comes next" roadmap.
