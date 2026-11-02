# Taste: which version of a part to build, and why

A design doc for Claude. Read it before you build any part the reader works (a button, field, menu, sheet, list, alert) and before you offer the owner a choice of looks. It covers every part in the kit: the Taste Lab picks (sections 4 and 5) and every older part (section 6). It turns the owner's picks into rules you can follow without asking again.

## 1. Goal

Every part the reader works should feel the way the owner likes, on the first try. You should not ask "which style?" for anything this file answers. You should only ask when a part or a case is truly new.

## 2. Where these rules come from

The owner ran a **Taste Lab**: each common part was built in four to six versions, side by side, and the owner kept the ones they liked.

- Round 1: 16 parts, 83 versions.
- Round 2: 9 parts, 39 versions.
- Every pick, with the owner's own words, is in `notes/choices.md` (rows marked "Taste Lab r1" and "Taste Lab r2").
- The full taste notes are in `notes/owner-likes.md`.

The 20 winners are house parts `n29` to `n48` in `components/showcase/index.html` and `components/parts/`. Every version from both rounds can be rebuilt from `tools/taste-lab/`.

## 3. The five leanings

Use these when this file has no exact answer for a part.

| Scale | The owner leans to | What it means when you build |
|---|---|---|
| Motion | **Springy** | Parts the reader works settle on a spring that overshoots a little (`--sp-snappy`, `--sp-bouncy`, `--sp-soft`; recipe in `tools/motion.md`). Page entrances keep the one smooth curve. |
| Speed | **Middle** | The spring settles in about 0.4 to 0.5 s. It starts moving at once, so the control still answers fast. |
| Newness | **A twist on the familiar** | The part works the usual way and moves in a new one: a tick that pops, a pill that slides, a number that counts to its value. Novel ideas are extras, never the default. |
| Feedback | **Clear, loud for errors** | Every action shows it worked (a tick, a count, a line). A wrong field shakes. A warning that can be checked again keeps checking. |
| Look | **Always ember** | Never a style from outside the kit (brutal block, ink terminal, editorial serif, square mono, soft bubble), unless the owner asks. |

Two more things the owner showed:
- **Numbers move to their value.** Sliders, totals and progress count up instead of jumping.
- **Data inside small boxes is welcome.** The picked popover carries a small trend line.

## 4. What to build

Find the job, use the part. When an older part does the same job, the Taste Lab part is the default. Use the older one only when the page must stay quiet (a dense admin tool or a calm page), or when the owner asks.

| The reader needs to | Build | Instead of | Why the owner picked it |
|---|---|---|---|
| Press a main button that takes time (pay, send) | `n29` pay button: words roll, a tick pops | a spinner | Picked B |
| Fill a field that can be wrong | `n30` field that shakes and ticks | errors only on submit | Picked B |
| Pick one of many by typing | `n09` combobox (unchanged) | any new select | "Stick with it" |
| Turn settings on and off | `n31` spring switches | `n14` | Picked B |
| Fill a short form in a window | `n39` modal that settles | a plain fade | Picked B |
| See details at the side of a page | `n41` side sheet whose lines arrive | a plain sheet | Picked A, with the extra motion asked for in round 1 |
| Choose one of a few (delivery, plan) | `n43` cards, a springing frame, a box that explains the pick | radio list, segmented pill | Asked for a mix of B, C and D, then picked it |
| Choose an amount | `n44` slider with marks and a counting number | a plain slider | Picked C |
| Add their own tags | `n45` tags that suggest as you type | plain tags | Kept C |
| Filter by a fixed list | `n46` filter chips that add up | tags | Kept D |
| Open a short menu of actions | `n32` springy dropdown | a corner fade | Picked B, the default |
| Act on one thing with a few actions around it | `n33` bloom menu | the dropdown | Kept F, "when needed" |
| Read a hint on a row of buttons | `n34` sliding tooltip | one tooltip per button | Kept D among A to D |
| Read questions and answers | `n35` one-at-a-time FAQ | `n18` | Picked B |
| Search for an action by keyboard | `n36` springy command box | `n12` | Picked B |
| Sort, search and act on rows | `n37` table with glide, search and a rising bar | `c15` alone | "B but with a search as well" |
| Move through pages of a list | `n48` pages with a sliding pill | `n20` | Picked B |
| See more about a name or number | `n40` peek card with a trend | `c25` alone | Picked D |
| Wait for content | `n38` skeleton sweep | a spinner | Picked B |
| Wait for a job with steps | `n47` progress bar that springs and counts | a plain bar | Picked B |
| Read a warning about the system | `n42` banner that checks again, or drops in when it cannot | `n21` | "C, but if it cannot retry use B" |

## 5. When the owner kept several

Keeping several versions means "use the one that fits the page". The owner left the choice to Claude, so the "Use" column is Claude's own rule for choosing. If the owner corrects one, change the row.

| Part | Kept | Use |
|---|---|---|
| Tabs | A to D | **A** grey track for settings and forms. **B** springy underline for page sections. **C** gliding pill for two to four big views. **D** stretching marker (`n17`) for a showcase or a lively page. |
| Tooltips | A to D | **A** wait and fade for single icons. **B** drop in from its side near the edge of the screen. **C** fast, with the key, for keyboard power users. **D** (`n34`) for a row of buttons. |
| Toasts | A to C | **A** corner toast for one short message. **B** a pile that opens when many arrive. **C** sending then sent, with a countdown, when there is Undo. |
| Date pickers | A to D | **A** plain calendar for one date. **B** gliding pill for a quick date. **C** range with quick picks (7 days, 30 days) for reports. **D** prices per day (`n01`) when price changes by day. |
| Dropdown | B and F | **B** by default. **F** bloom menu when a few actions sit around one thing. |
| Alerts | C and B | **C** when the problem can be checked again (a slow payment service). **B** when it cannot (a holiday closing). Both are in `n42`. |
| Tags | C and D | **C** when people type their own. **D** when the list is fixed. |

Versions with no house part yet (tabs A to C, tooltips A to C, toasts A to C, dates A to C) are in the Taste Lab source, `tools/taste-lab/` (round 1, `src/b2.mjs`, `src/b3.mjs` and `src/b4.mjs`). Build one with `node build.mjs 1` to see it, then rebuild it as a house part (`tools/taste-lab/README.md`).

## 6. Every other part in the kit

These parts came before the Taste Lab. The owner reviewed and approved them on 2026-10-29 and 2026-10-30 (`CHANGELOG.md`). They are the house version for their job unless the status says otherwise. How each one looks and moves: `patterns/interactive-parts.md`.

**Status** means:
- **Default**: the house part for this job. Use it.
- **Quiet only**: a Taste Lab part now does this job. Use this older one only on a quiet page, or when the owner asks.
- **Rare**: at most one per page, only for the case named.
- **Per case**: one of several the owner kept; Claude picks.

### Numbers and charts

| Part | Use it when | Status | Why |
|---|---|---|---|
| `c01` Live line chart | A value that changes as you watch | Default | The owner set the look: one orange curved line, soft fill, quiet axes, hover to pause (`patterns/line-chart.md`) |
| `c02` Still line chart | A value over days, weeks or a year | Default | The owner set how it loads: draws in once, range buttons reshape the line |
| `c03` Bar chart | A few groups side by side or stacked | Default | Approved in review |
| `n03` Donut and gauge | Parts of one total, or progress to a goal | Default | Approved in review. One orange slice is the focus |
| `n06` Stat card | A headline number with its trend | Default | The owner liked the KES stat card: a number that counts up and a sparkline that draws in |
| `n07` Number roll | A live count that changes | Default | Approved in review |

### Dates

| Part | Use it when | Status | Why |
|---|---|---|---|
| `n01` Booking calendar | Picking a range of nights, or prices per day | Per case (date D in section 5) | The owner had it rebuilt: one range band, a hover preview, prices |

### Tables and lists

| Part | Use it when | Status | Why |
|---|---|---|---|
| `c15` Data table | Rows with filters, a column picker and rows that open | Quiet only: use `n37` | Round 1 picked `n37`, with this table's search box |
| `c16` Expandable rows | A short list where each row has a story | Default | Approved in review |
| `c17` Plan comparison | Pricing plans side by side | Default | Approved in review |
| `c18` Selection basket | Pick tiles, then act on all of them | Default | Approved in review |
| `c19` Batch tray | A long list, act on many rows | Default | Approved in review |
| `c20` Dissolve delete | Removing an item should feel final | Default | The owner asked for the panel to shrink with the rows, never snap |
| `n20` Pagination | Pages of results | Quiet only: use `n48` | Round 2 picked `n48` |

### Forms and inputs

| Part | Use it when | Status | Why |
|---|---|---|---|
| `c10` Stepper | A form in steps | Default | The owner's "one alert" look: the step you are on is filled orange with no outer ring |
| `c11` Sign in | Any sign-in form | Default | Errors in words under their field, as the owner asks everywhere |
| `n11` Sign-up form | Making an account | Default | Approved in review |
| `n10` Code boxes | A one-time code | Default | Approved in review |
| `n09` Combobox | Picking one of many by typing | Default | Round 1: "Stick with it" |
| `n14` Switches and checkboxes | Settings | Quiet only: use `n31` | Round 1 picked `n31` |
| `c12` File upload | Drop or pick files | Default | Approved in review. The upload line is orange |
| `c13` Secret reveal | API keys and real secrets only | Rare | At most one per page |
| `c14` Edge-lit button | One final action on a page | Rare | At most one per page |
| `n15` Split button | One main action with a few ways to do it | Default | Approved in review |

### Getting around

| Part | Use it when | Status | Why |
|---|---|---|---|
| `c05` Pill navigation | Top-level pages, some with a second row | Default | Approved in review |
| `c06` Branching submenu | Pick a group, then an item in it | Default | Approved in review |
| `c07` Scroll progress | A long box or guide with parts | Default | Approved in review |
| `c08` Floating dock | A small set of app shortcuts | Default | Approved in review |
| `c09` Dynamic island | A small pill that opens into actions or a card | Default | Approved in review |
| `n17` Tabs | Panels of one page | Per case (tabs D in section 5) | Round 1 kept A to D |
| `n18` FAQ accordion | Questions and answers | Quiet only: use `n35` | Round 1 picked `n35` |
| `n19` Breadcrumb | A deep path | Default | Approved in review |
| `n12` Command menu | Keyboard search of actions | Quiet only: use `n36` | Round 1 picked `n36` |

### Status and news

| Part | Use it when | Status | Why |
|---|---|---|---|
| `c21` Toast | Short news after an action | Default (toast A in section 5) | The owner had it fixed: it shows in its own card with an orange countdown line |
| `n22` Undo toast | After a delete or archive | Default | The owner's rule: a light paper card, never a black box, and the list shrinks as rows leave |
| `n21` Inline notices | Account warnings | Quiet only: use `n42` | Round 2 picked `n42` |
| `n23` Skeleton | Content that takes time to load | Quiet only: use `n38` | Round 1 picked `n38` |
| `c22` Payment status | Processing, paid or failed | Default | The owner corrected the tick: two straight lines, round corner and ends |
| `c23` Receipt printer | A receipt that should feel printed | Default | The owner's slow printing: about 4.5 s, like a real printer |
| `c24` Timeline | A run of steps with times (a deploy) | Default | Progress is orange, as the owner set |
| `n24` Avatar stack | Who is on a project | Default | Approved in review |
| `n25` Notification bell | New items to read | Default | Approved in review |

### AI helpers

| Part | Use it when | Status | Why |
|---|---|---|---|
| `n08` AI agent activity | Showing an AI helper's steps | Default | Approved in review. The owner had the done tick centred |
| `n16` AI answer | A streamed reply | Default | Approved in review |

### Cards you can pick up

| Part | Use it when | Status | Why |
|---|---|---|---|
| `c25` Peek card | More about a name, plain | Quiet only: use `n40` | Round 2 picked `n40`, this card pushed |
| `c26` Reveal card | A card worth picking up | Default | Approved in review. A faint orange tint, never a white glare |
| `c27` Folder | A group of files or ideas | Default | The owner asked twice for a smoother open and close; the folder stays on screen while the cards fly |
| `n27` The deck | Steps that stack as you scroll (3 to 5) | Per case, the default kind | The owner kept all four stack kinds |
| `n26` Full cover | Few steps, each a big screen | Per case | Same |
| `n28` The deck that settles | The main picture on a lively page, at most one | Per case | Same |
| `c31` Card swap | More than 5 items to flip through | Per case | Same. Which kind when: `patterns/interactive-parts.md` |

### Backgrounds

| Part | Use it when | Status | Why |
|---|---|---|---|
| `c04` Dot field | A quiet background behind a hero | Default | Approved in review. One per page |
| `c29` Dot grid | A bigger, bolder field than `c04` | Default | Approved in review. One per page |
| `c30` Moving grid | A tilted wall of tiles or pictures | Default | Approved in review. No glow; it never moves on its own |

### Removed: never bring these back

The owner removed these on 2026-10-29: **slide to confirm** (or slide to delete), the **flight date picker with fares**, the **running heatmap** and the **shop funnel**.

## 7. Settled colour and look rules

- **The main button stays orange.** White words in day (about 4 to 1), dark words at night (`--on-accent`, about 6.9 to 1). The owner saw four fixes and chose this. Do not "fix" it, and do not count it as a problem in a check.
- **A popover must show in full inside its box**, or nobody can judge it. Put the trigger near the top and give the box room for the open card.
- **Springs overshoot a little.** This replaces the older "springs settle without overshooting" note.
- **Closing boxes glide all the way** (`DESIGN.md`, *Motion*). This replaces the older "height snaps" note.

## 8. What not to do

- Do not offer an off-look version in a set of choices.
- Do not make a plain, still version the default. Plain versions were fine as one of several kept, but they never won alone.
- Do not ask the owner which style to use for anything in sections 4 and 5.
- Do not replace a house part the owner said to keep (`n09`).

## 9. When something is new

If a part or a case is not in sections 4 to 6:
1. Use the five leanings (section 3) to build the lively ember version first.
2. If the choice really matters, show three or four versions side by side, lively first, with no off-look version (`patterns/compare-parts.md`). For several parts at once, run a Taste Lab round (`tools/taste-lab/README.md`).
3. Log the pick in `notes/choices.md` the same day, add it to section 4, 5 or 6 here, and add a line to `CHANGELOG.md`.
