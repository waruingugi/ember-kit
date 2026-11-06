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

The 20 winners are house parts `n29` to `n48`, and the three other kept tooltips are `n49` to `n51`, in `components/showcase/index.html` and `components/parts/`. Every version from both rounds can be rebuilt from `tools/taste-lab/`.

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
| See details at the side of a page | `n41` side sheet that glides in | a plain sheet | Picked A; on 2026-11-02 the owner dropped the lines arriving in turn and the spring, for one smooth glide each way |
| Choose one of a few (delivery, plan) | `n43` cards, a springing frame, a box that explains the pick | radio list, segmented pill | Asked for a mix of B, C and D, then picked it |
| Choose an amount | `n94` or `n93` slider (see section 5); `n44` on a quiet page | a plain slider | Round 2: picked C (`n44`). Round 4: kept C and D; "The handle should be small and orange, and still easy to grab" |
| Read a total split into parts | `n90` donut: point at a part and the rest step back | `n03` | Round 4: picked A |
| Read a trend for a period | `n91` or `n92` sparkline cards (see section 5) | `n06` | Round 4: kept C and D |
| Copy code or a command | `n95` code block that shows what it copied; every code block's copy button does the same | a button that only says Copied | Round 4: picked C; now the copy animation for all code blocks |
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
| Type a phone number | `n69` phone field that searches the country list | `n11` | Round 4: picked C |
| Pick many from a long list | `n70` type in the field, chips wrap | `n46` | Round 4: picked C |
| Switch between views of the same numbers | `n71` ink marker that stretches, view follows | `n17` | Round 4: picked D |
| Give a star rating | `n72` stars, then the rating card after a pick | a plain row of stars | Round 4: B, with D's card shown after a pick |
| Pick a date range for a report | `n73` button that grows into the panel | `n01` | Round 4: picked B; the button must stay in view as it closes |
| Send a few files | `n74` box that folds into a bar | `c12` | Round 4: picked C; × must start the shrink at once |
| Open one item from a short list | `n77` card that grows into its details | `c26` | Round 4: picked B |
| Read short news after an action | `n78` plain toast column | `c21` | Round 4: picked A |
| Fill a form in steps | `n79` stepper, current step filled orange, no ring | `c10` | Round 4: picked D |
| See twelve weeks of daily numbers | `n82` heatmap that recolours in a sweep | a bar chart | Round 4: picked D |
| Put things in order | `n83` list you sort, the times roll, or `n89` the plain one with a dashed gap (see section 5) | `c19` | Round 4: kept D and A; the dashed landing gap added to D |
| Track one order | `n84` timeline where steps arrive in turn | `c24` | Round 4: picked B |
| See space or credit used against a limit | `n52` usage meter: point at a part and the number rolls to it | `n47` | Round 3: picked B |
| Read three key numbers for a period | `n53`, `n54` or `n55` metric cards (see section 5) | `n06` | Round 3: kept B, C and D |
| Enter a count or an amount | `n56`, `n57` or `n58` number fields (see section 5) | a plain number box | Round 3: kept B, C and D; D with round 4's "KES 60 × 3 = KES 180" fix |
| Pick one from a list by typing | `n59` combobox whose list resizes | `n09` | Round 3: picked D; round 4 made it 40 px with 9 px corners and 34 px rows |
| Press a button that changes shape as it works | `n60`, `n61` and `n63` morphing buttons (see section 5) | a spinner or a plain confirm box | Round 3: kept A to D; B and D with round 4's corner fixes; C (round icons) replaced by `n62` |
| Three or four actions where space is tight | `n62` icons that open from the left, with well-curved corners | round icons that open (round 3's C) | Round 4: picked B; "Replace" the round 3 part |
| Answer a note without a reply | `n96` reactions: chips that roll, an add button that grows into a picker with named icons | a reply box | Round 4: B's look with C's icon row and a tooltip on each icon (a mix) |
| Rename one thing where it sits | `n97` inline edit: the words roll to the new ones and a tick draws in | a separate edit form | Round 4: picked B |
| Tell someone in a note | `n98` mention input: the list pops up at the caret, a pick becomes one piece | a plain list under the box | Round 4: picked B; "A mention should become one piece the moment you pick a name." |
| Pick one plan that has a price | `n99` radio cards: one ring stretches to the pick, the price rolls | `n43` | Round 4: picked B; "A choice with a price should show what each one gets you." |
| Show how long a deal has left | `n64` countdown pill, a button where the line was | a plain timer | Round 4: picked B |
| Act on one item with three or four buttons | `n65` button group with one gliding highlight | separate buttons | Round 4: picked B |
| Use tools over a document | `n66` floating tray | a plain toolbar | Round 4: picked B |
| Confirm something that can't be undone | `n67` hold to delete | a confirm box alone | Round 4: picked B |
| Search from a small top bar | `n68` search that grows from its icon | a search box that is always open | Round 4: picked B |

## 5. When the owner kept several

Keeping several versions means "use the one that fits the page". The owner left the choice to Claude, so the "Use" column is Claude's own rule for choosing. If the owner corrects one, change the row.

| Part | Kept | Use |
|---|---|---|
| Tabs | A to D | **A** grey track for settings and forms. **B** springy underline for page sections. **C** gliding pill for two to four big views. **D** stretching marker (`n17`) for a showcase or a lively page. |
| Tooltips | A to D | **A** wait and fade for single icons. **B** drop in from its side near the edge of the screen. **C** fast, with the key, for keyboard power users. **D** (`n34`) for a row of buttons. A is `n49`, B is `n50`, C is `n51`. |
| Toasts | A to C | **A** corner toast for one short message. **B** a pile that opens when many arrive. **C** sending then sent, with a countdown, when there is Undo. |
| Date pickers | A to D | **A** plain calendar for one date. **B** gliding pill for a quick date. **C** range with quick picks (7 days, 30 days) for reports. **D** prices per day (`n01`) when price changes by day. |
| Dropdown | B and F | **B** by default. **F** bloom menu when a few actions sit around one thing. |
| Alerts | C and B | **C** when the problem can be checked again (a slow payment service). **B** when it cannot (a holiday closing). Both are in `n42`. |
| Tags | C and D | **C** when people type their own. **D** when the list is fixed. |
| Breadcrumb | B and C | **B** (`n75`) by default: the middle folds into a "…" menu. **C** (`n76`) on a roomy page, where the path can open in place and wrap. |
| Setup tasks | C and A | **C** (`n80`) one task at a time, for a first run. **A** (`n81`) a plain list, when people want to see every task at once. |
| Empty states | B and D | **B** (`n85`) when one place has several empty states. **D** (`n86`) for an empty list that just finished loading. |
| Stats band | A and D | **A** (`n87`) for a quiet page head. **D** (`n88`) when each number has a goal. |
| Reorderable list | D and A | **D** (`n83`) when each step has a time that depends on the order. **A** (`n89`) for any short list with nothing to recount. Both show a dashed outline where the row lands. |
| Metric cards | B, C and D | **B** (`n53`) three tiles when the three numbers matter the same and there is room. **C** (`n54`) one card with three rows in a narrow column or a side panel. **D** (`n55`) when one number matters most and its trend helps. |
| Number fields | B, C and D | **B** (`n56`) a small count with steppers and a hard limit. **C** (`n57`) a money amount, with quick-add chips. **D** (`n58`) counts inside a short cart, the total on the pay button. |
| Morphing buttons | A, B and D (C replaced) | **B** (`n60`) a remove or delete that needs a yes, in place. **A** (`n61`) copy a link (code uses `n95`). **D** (`n63`) one payment with nothing else to say on the button; `n29` when the words should roll. Round 3's C (round icons) was replaced on 2026-11-06 by round 4's expanding group, still `n62`, for three or four actions where space is tight (section 4). |
| Sparkline cards | C and D | **C** (`n91`) when people switch periods to compare shapes: the old line stays and fades, so the change is easy to see. **D** (`n92`) when the card must say how the period did against the one before (the chip), on a lively page. On a dense admin page use `n06`. |
| Sliders | C and D | **D** (`n94`) by default: a real range input with a short orange bar, works the same everywhere. **C** (`n93`) on a lively page where the slider is the main thing (a savings goal), for the stretch at the ends. Both keep a 44 px grab area. `n44` when the page must stay quiet. |

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
| `n03` Donut and gauge | Parts of one total, or progress to a goal | Default for a gauge; `n90` for a split | Approved in review. One orange slice is the focus |
| `n06` Stat card | A headline number with its trend | Default | The owner liked the KES stat card: a number that counts up and a sparkline that draws in |
| `n07` Number roll | A live count that changes | Default | Now the odometer the owner picked in Taste Lab r3 (part 01, B): each digit turns the way the number went, right digit first, on a soft spring. "Replace n07 now" |

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
