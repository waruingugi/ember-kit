# What the owner likes

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

These notes come from making an overview page, on 2026-10-08. The owner
picked them from drafts, so do not offer them again as open choices.
Reach for these first.

**Picked from the drafts:**
- A light theme with the Ember orange: `#e14a0e` for big things, `#b33a0a`
  for small text.
- Fraunces for headings.
- The "Squares" grid background, kept mostly hidden. It shows only in
  open gaps, never behind callouts, cards or lists.
- The `lively` motion level, with the "Rise" reveal (blocks rise and fade
  in).
- Two folder views, picked per case. Explorer shows the whole repo or what
  changed. Columns walks down one path, and its last pane says what the
  folder is for in plain words. Never offer both for the same job.

**The picture tools he approved:**
- Archify for how the parts of a system flow.
- Diagram Design for layers and data models. He wants more of these.
- Hairline figures inside cards. He loved the custom FastAPI mail rack,
  made with `hairline-create`. Make a custom figure whenever no stock one
  fits.
- A diagram canvas of dots, `#f1f3f2` with an 18 px dot grid. Tinted
  boxes must be solid, so no dots show through them.
- A "live" shimmer on live numbers: the same hue as the line, subtle, but
  easy to see. It is a **short** lighter stroke that slides along the line,
  never a long band (the owner, 2026-10-09). See *The live shimmer* (`DESIGN.md`) under
  *Motion* (`DESIGN.md`).

**Parts he liked:**
- The sidebar: numbered keys, a sliding orange marker on the active item,
  a reading-progress bar in its footer, and the collapse described below.
- The top bar: breadcrumbs, a small status badge with a pulsing dot, and a
  2 px orange progress line along its bottom edge.
- Ghost section numbers. Each section head has a mono eyebrow
  (`01 WHY REBUILD ——`), a huge outlined ghost number behind it, a
  Fraunces heading with one italic orange phrase, then a lead paragraph.
- Numbers that count up, like the KES stat card, with a small sparkline
  that draws in and then shimmers to say "live".
- Lines and arrows that draw themselves in.
- The message-bus log animation: entries slide along a tape while readers
  move at their own pace.
- Code windows with tabs that show file names, a status letter per file
  (A, M, D, R) and a Copy button.
- Archify diagrams.
- Options shown side by side.
- 6th-grade English.

**How he likes to work:**
- Plain 6th-grade English that flows. Bring in one idea at a time.
- For design work he often says "first improve this prompt". Rewrite his
  request as a clear spec, then stop and wait for his go-ahead before
  building.
- Show 3 or 4 options side by side, so he can choose by looking. He picks,
  then adds notes. Never pick silently for him.
- He works in drafts and improves the design over several rounds.
- He wants pictures first: figures, diagrams, data models, Archify and
  motion, used generously wherever they explain better than words
  (2026-10-09).
- He accepts more words when they are needed, as long as the page says
  the same thing in far fewer words than the source (2026-10-09).
- He likes long documents turned into short visual pages for engineers:
  one picture per idea, the final decision rather than the debate
  (2026-10-09).

**Not taken from the first draft.** It also used Figtree for body text,
Geist in diagrams, and a dark theme. The owner said no to those on 2026-10-08,
to keep the look the existing artifacts already have. Antonio for numbers
was taken later the same day. So our fonts are the five under *Type* (`DESIGN.md`), and
the theme stays light only.

**Liked on 2026-10-08, from a plan page:** Hairline's stock phone
figure (Firebase Cloud Messaging) as the model for an overview: a few
chunky layers and one orange part. Not its dashed guide lines (see
*Staged explode* (`tools/hairline.md`)). Later stages animate more.

Keep the look the same on every edit. Extend it with the same parts. Never
restyle, swap fonts, or swap colours quietly. If a request would change the
look, flag it as a real design decision and ask first.

In a project that already has pages in this style, copy from the nearest
existing page rather than rebuilding from this summary.
