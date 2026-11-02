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

**The picture tools the owner approved:**
- Archify for how the parts of a system flow.
- Diagram Design for layers and data models. The owner wants more of these.
- Hairline figures inside cards. The owner loved the custom FastAPI mail rack,
  made with `hairline-create`. Make a custom figure whenever no stock one
  fits.
- A diagram canvas of dots, `#f1f3f2` with an 18 px dot grid. Tinted
  boxes must be solid, so no dots show through them.
- A "live" shimmer on live numbers: the same hue as the line, subtle, but
  easy to see. It is a **short** lighter stroke that slides along the line,
  never a long band (the owner, 2026-10-09). See *The live shimmer* (`DESIGN.md`) under
  *Motion* (`DESIGN.md`).

**Parts the owner liked:**
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

**How the owner likes to work:**
- Plain 6th-grade English that flows. Bring in one idea at a time.
- For design work the owner often says "first improve this prompt". Rewrite the owner's
  request as a clear spec, then stop and wait for the owner's go-ahead before
  building.
- Show 3 or 4 options side by side, so the owner can choose by looking. The owner picks,
  then adds notes. Never pick silently for the owner.
- The owner works in drafts and improves the design over several rounds.
- The owner wants pictures first: figures, diagrams, data models, Archify and
  motion, used generously wherever they explain better than words
  (2026-10-09).
- The owner accepts more words when they are needed, as long as the page says
  the same thing in far fewer words than the source (2026-10-09).
- The owner likes long documents turned into short visual pages for engineers:
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

## Taste profile: Taste Lab round 1 (2026-11-01)

The owner tried 83 versions of 16 common parts and picked
(`notes/choices.md`, rows marked "Taste Lab r1"). Where the owner kept a few
versions of one part, it means: keep them all, and Claude picks the one that
fits the page.

**Each axis, which way the owner leans:**

- **Motion: springy.** All 9 single picks were option B, the lively one
  (beUI or easyui). Seven of the nine use a spring that settles: buttons,
  form fields, switches, dropdown, modal, accordion and command menu. The
  other two, the table and loading, use some motion without a spring.
  Strong leaning.
- **Speed: mid.** Springs that settle in about 0.4–0.5 s. Nothing slow and
  nothing instant.
- **Newness: a twist on the familiar.** The owner picks a part that works
  the usual way and moves in a new one (a tick that pops, a highlight that
  glides). Novel versions, like the bloom menu, are kept only as extras.
- **Look: always ember.** Every off-look version (E) was left out, often by
  name ("all except E"). Strong leaning.
- **Feedback: clear, and loud for errors.** A tick that pops when something
  works. A shake when a field is wrong. Loading stays quiet (a skeleton
  sweep).
- **Plain versions (A)** are fine as one of several kept (tabs, tooltips,
  toasts, dates). They never won alone. For the drawer the owner wants A
  "with some more motion".
- **The owner's own house parts still win where they are strong.** The
  select stays the house `n09` ("stick with it"). The table keeps B's motion
  and adds D's search box from house `c15`.

**Several kept, Claude picks per case:** tabs (A–D), tooltips (A–D), toasts
(A–C), date pickers (A–D), dropdown (B by default, F the bloom menu when a
few actions sit around one thing).

**For round 2:** more popovers (no E), more drawers (D, and A with more
motion), and the parts not yet shown.

## Taste profile: Taste Lab round 2 (2026-11-01)

The owner tried 9 more parts (`notes/choices.md`, rows marked "Taste Lab r2").
Round 2 agrees with round 1 and adds a few things:

- **Springy still wins.** Progress (B) and pages (B) settle on a spring.
  The drawer the owner picked is A, the plain right sheet, now with a soft
  spring and its lines arriving one after another.
- **Numbers that count.** The slider (C) and progress (B) both count up to
  the new number. The owner likes seeing a number move to its value.
- **Helpful over clever.** Alerts: the banner that checks again by itself
  (C), with B (drops in, page closes the gap) when there is nothing to
  check. The dot banner (D) was not picked.
- **Mixes are welcome.** For choice, the owner asked for one version that
  joins B (spring), C (cards) and D (a box that explains the pick). The owner
  picked that mix (G).
- **Popover: the peek card with a trend.** D, house `c25` pushed: the card
  lifts out of the name and a small line of orders draws in. Data inside
  a popover is welcome.
- **Keep the orange button.** The owner kept today's orange with white text
  (A), knowing it reads about 4 to 1 in the day theme. See `DESIGN.md`,
  *Colour*.
- **Several kept, Claude picks per case:** tags C (typing your own) and D
  (filter chips from a fixed list).
- **Lab lesson:** a popover must show in full inside its box, or the owner
  cannot judge it. Pin the trigger to the top and size the box to the open
  card.
