# Interactive parts

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

**What it is.** 29 parts a reader works with: navigation, forms, tables, status,
cards and moving surfaces. Each one started as a React component the owner shared, and
was rebuilt in plain HTML in our look on 2026-10-29. The owner reviewed them the same
day. All of them live in one working page to copy:
`components/interactive.html`. Sections 01–02 are the line charts, also in
`components/line-chart.html`. Sections 03–31 are these parts.

**How to use it.** Find the part in the table below, then copy its section from
the page. Each part has three pieces: its CSS block (`/* ---------- NN name */`),
its markup (`<section class="cs" id="cNN">`) and its script
(`/* ---------------- NN name */`). Also copy the shared helpers listed under
*Shared pieces*. Don't restyle a part for one page. If it needs to change, change
it here first.

## The parts

| # | Part | Use it when | What to keep |
|---|---|---|---|
| 03 | Bar chart | A few groups compared side by side or stacked | Bars grow once at 40% visible, 30 ms apart. Side by side ↔ stacked reshapes in 0.55 s. Click a name in the key to hide it, but the last one can't be hidden. Hover or arrow keys read a month. The table of numbers is behind a "show as a table" toggle. Series colours: orange, ink-soft, dim |
| 04 | Dot field | A quiet background behind a hero | Dots turn orange and step aside near the pointer. It draws only while something moves, with no wave |
| 05 | Pill navigation | Top-level pages, some with a second row | Ink marker made by clipping a copy of the row, so the text turns white as the edge passes. Arrow keys move along a row |
| 06 | Branching submenu | Pick a group, then an item in it | The same marker, standing up. Items fade in 30 ms apart. Right arrow jumps into the list, left arrow comes back |
| 07 | Scroll progress | A long box or guide with parts | Orange scaleX line. The marker rests on a part while you read, then slides to the next name over the last 35% of the way. Clicking a name glides the box |
| 08 | Floating dock | A small set of app shortcuts | Icons grow toward the pointer, from the bottom, to at most 1.3 (1.15 on calm), mouse only. Tooltips on hover and focus. Orange dot under the open one |
| 09 | Dynamic island | A small pill that opens into actions or a card | The background layer scales from the old size to the new one (FLIP) while the content fades. Escape or a click outside closes it. Show an email as text with a copy button |
| 10 | Stepper | A form in steps | The "one alert" look: 34 px circles with Antonio numbers. Done: filled orange circle with a white round tick that draws in. The 2 px line fills orange behind you. The current step is filled orange, with no outer ring. Panels slide 24 px the way you are going |
| 11 | Sign in | Any sign-in form | Errors sit under their field, tied with aria-describedby, in orange text. A banner for a wrong password. A "Checking…" state with the live dot |
| 12 | File upload | Drop or pick files | Dashed box that turns orange on drag-over. One row per file with an **orange** scaleX bar. Size limit checked first. Retry for a failed file |
| 13 | Secret reveal · **rare** | API keys and real secrets only | Letters settle left to right in 0.8 s, still-changing ones in orange text. Screen readers get the real key |
| 14 | Edge-lit button · **rare** | One final action on a page at most | Still orange arc at rest. The light runs round the edge only on hover or focus (slower on calm) |
| 15 | Data table | Rows people search, filter, sort and pick | Real `<table>` with aria-sort. Filter chips, column picker, select with an in-between state, rows that open. Copy as CSV, not download. It turns into cards under 640 px. Status is a word plus a mark |
| 16 | Expandable rows | A short list where each row has a story | Header row. Initials, and numbers lined up on the right. An open row gets a thin orange edge and three cards (details, activity, actions) lined up under the name, fading in 40 ms apart |
| 17 | Plan comparison | Pricing plans side by side | Full-size plan buttons. The suggested plan's column has a faint orange wash top to bottom, and the column you point at darkens. Search, "Differences only", groups that close. One plan at a time on a phone |
| 18 | Selection basket | Pick tiles, then act on all of them | A bar slides up (0.35 s in, 0.2 s out) with a count and the actions. Uses the house checkbox |
| 19 | Batch tray | A long list, act on many rows | Rows are role=checkbox. A sticky tray follows the list. Actions show a short busy state. Escape clears |
| 20 | Dissolve delete | Removing an item should feel final | The row wipes away in orange specks (canvas plus clip-path), then the rows below slide up (FLIP) and the panel shrinks with them, both in 0.45 s on the house curve, so nothing snaps. Restore brings them back |
| 21 | Toast | Short news after an action | Rises in 0.35 s, leaves after 4 s, pauses on hover or focus. role=status. An optional action button (Undo, Retry). The countdown line is orange. In a showcase, show the toast inside its own card, under the buttons, so it appears where you clicked; on a real page it sits at the bottom of the screen |
| 22 | Payment status | Processing, succeeded, failed | Processing: one orange dot goes round the clock. Done: a filled orange circle with a white tick (straight lines, round corner and ends) that draws in, and an orange button. Failed: a reason and two buttons. Labels and values line up on one baseline. Copy as text, not download |
| 23 | Receipt printer | A receipt that should feel printed | The slip feeds out slowly, in about 4.5 s with ease-in-out, at 40% visible. A tiny shake only while printing, not on calm. The light is orange while busy and ink when done |
| 24 | Timeline | A run of steps with times (a deploy) | Done: filled orange circles and an orange line. The running step pulses a ring. Failed: darker orange with a ✕. Cards open with a fade |
| 25 | Peek card | More about a name or number, without leaving | Opens after a 200 ms rest, or on focus or tap. It grows from its trigger. Escape or a click outside closes it |
| 26 | Reveal card | A card worth picking up | Lifts 3 px and leans toward the pointer (4°, 2° on calm, mouse only). A faint orange tint follows the pointer. The last line shows on hover; on touch it always shows |
| 27 | Folder | A group of files or ideas | On hover the cards fan out and the flap tips 16°. On click the flap opens and the cards rise; 0.2 s in, the folder stays where it stands and fades while the cards leave it and fly to their grid places (FLIP, 0.8 s, 60 ms apart). Never make the folder vanish in one frame. Close is the same in reverse: the folder fades back in with its flap open, the cards fly back into it (0.56 s, 50 ms apart), then the flap shuts. The folder is taken out of the flow while this happens, and the content sits at the top of the box, so the box glides to its new height without anything shifting |
| 28 | Stacked pages · **don't use** | Removed from the showcase on 2026-10-29: scroll-stacking stayed buggy. Use the stepper (10) or timeline (24) for steps in order | Pure CSS sticky pages, each 14 px lower than the last, set below the top bar. Pages are about 300 px tall. The stack has no fixed height and nothing clipped, so it works out in the open on any page |
| 29 | Dot grid | A bigger, bolder field than 04 | A spring on every dot that settles without overshooting. Dots fill in once. A click sends a ripple out |
| 30 | Moving grid | A tilted wall of tiles or pictures | Rows slide as the page scrolls, every other row the other way, and lean with the pointer. No glow or light. It never moves on its own |
| 31 | Card swap | A pile of cards to flip through | Front card drops to the back. Next, drag, or Play. Play swaps at once, then every 4 s, with an orange timer line, and pauses while you point at it. It never starts by itself. On a showcase, scroll drives it: a tall box with a sticky pile, so scrolling down sends cards back and scrolling up brings them back |

### v4 parts (2026-10-29)

Rebuilt from easyui.site in our look. Working code: `components/showcase/v4parts/` (one file per group; each part is a `<!--PART id | name | heading | line-->` block with its own scoped CSS and script). The build contract every part follows is `v4parts/CONTRACT.md`.

| # | Part | Use it when | What to keep |
|---|---|---|---|
| n01 | Booking calendar | Picking a range of nights | Two months side by side (one on a phone). One unbroken faint-ink band joins the two ink end caps, rounded at week edges. After the first pick, hover previews the range with an outlined end. Booked nights are struck through and stop a range; a bad pick gets an orange outline and a small shake. Footer shows check-in, check-out and the total. Months slide 28 px with a fade |
| n03 | Donut and gauge | Parts of one total; progress to a goal | One orange slice (the focus), the rest ink steps. Draws in once. Hover a slice or key row to read it in the centre |
| n06 | Stat card | A headline number with its trend | Counts up once; delta in ink words with an arrow (never green or red); curved sparkline you can scrub |
| n07 | Number roll | A live count that changes | Each digit rolls on its own in 0.5 s. Pauses off screen and with motion off |
| n08 | AI agent activity | Showing an AI helper's steps | Steps rise in one by one; an orange line fills; done steps get the orange tick, sitting in the middle of its circle with even space around it; tool steps open to show input and result |
| n09 | Combobox | Picking one of many options by typing | One highlight glides between options for mouse and keys |
| n10 | Code boxes (OTP) | A one-time code | Digits spring in; right code = orange tick; wrong = a short shake and words |
| n11 | Sign-up form | Making an account | Strength bar fills orange in four steps; rules tick in orange; errors in words under each field |
| n12 | Command menu | Keyboard-first search of actions | Opens at once (opacity only, 0.1 s), since a key opens it |
| n14 | Switches and checkboxes | Settings | On = ink. The thumb stretches while pressed. Ticks draw themselves |
| n15 | Split button | One main action with a few ways to do it | The menu grows from the chevron |
| n16 | AI answer | A streamed reply | Words stream in with a caret only while streaming; Stop, Copy, Good / Not good, Regenerate |
| n17 | Tabs | Panels of one page | The ink marker takes the width of the tab and glides to it. All panels sit in one grid cell, so the box never jumps; the new panel fades in and slides 8 px from the side you moved toward |
| n18 | FAQ accordion | Questions and answers | Height glides open (0.4 s) and shut (0.3 s); "one at a time" switch |
| n19 | Breadcrumb | A deep path | Middle folds into "…" when there is no room; a hover pill glides |
| n20 | Pagination | Pages of results | Ink pill slides between page numbers; results cross-fade |
| n21 | Inline notices | Account warnings | Tone by icon and words. Closing fades the notice, then the stack closes up smoothly; it must stay faded while it closes, with no flash back. The gap starts closing while the notice fades, and its padding closes with its height, so the end never snaps |
| n22 | Undo toast | After a delete or archive | A light paper card (raised paper, hairline, big shadow), never a black box. Undo is orange text. Orange countdown line that pauses on hover. The list has no fixed height: the card shrinks as each row closes and grows on Undo. An empty list says so in one line |
| n23 | Skeleton | Content that takes time to load | Soft sweep loops only while loading; real cards fade in 60 ms apart |
| n24 | Avatar stack | Who is on a project | Lift on hover; tooltip enters from the side you came from; +3 spreads the row |
| n25 | Notification bell | New items to read | One short swing on arrival; badge digit rolls; orange unread dots |

## Shared pieces (copy these with any part)

- **Helpers** at the top of the part-two script:
  - `spd()`: 0 when motion is off, 0.5 on calm, 1 on lively. Multiply distances and times by it.
  - `ease()`: the house curve, for script-driven motion.
  - `copy()`: clipboard with a fallback.
  - `onView()`: runs once at 40% visible.
  - `outside()`: a click outside a box. It ignores nodes the click itself removed.
- **`tabs()`**: the sliding marker for any row of choices (05, 06, 07, 17, 22 and the bar chart). It is Emil Kowalski's clipped-copy recipe. `follow(i, f)` drives it from scroll.
- **House checkbox `.chk`**: a custom box with a white round-cornered tick (and a round dash for "some"), ink when ticked. Never the browser's own box.
- **Small parts**:
  - `.b` buttons, with `.pri`, `.sm`, `.q` and `.danger` versions.
  - `.ib` icon buttons, `.in` inputs.
  - `.tag`, `.live` (the live dot), `.st` (status word with its mark).
  - `.kv` (label and value rows), `.pop` (popover box).
- **Icons**: one hidden SVG sprite (`#i-…` symbols, Lucide-style, 1.6 stroke, round caps) used with `<use href="#i-name">`. Logos (GitHub, Google, LinkedIn, X) are filled.

## Rules these parts follow

- **Progress is orange** (DESIGN.md, *Colours*): done steps are filled orange with a white round tick, and so is the line between steps.
- **Loops** only for the live dot or a busy sign while work is really running (the dot round the clock, the pulse on a running step). Things that looped for show in React became pointer- or scroll-driven: the dot field, the moving grid, the edge light, and card swap's autoplay.
- **Showcase them out in the open** (DESIGN.md, *Recurring parts*): copy the part's card straight onto the page. Keep the card (the inner wall); drop the outer wrapper and the file-name bar. Check that popups, sticky pages and hover cards still work there.
- **No bounce, no glow, no green or red.** Springs settle without overshooting. The white glare became a faint orange tint. Errors use orange text.
- **Height snaps; content fades.** Rows, panels and cards that open change height at once, and only their content moves. The exceptions are a delete and the folder opening: when an item goes away, the box around it shrinks smoothly (0.45 s) with the rows sliding up, never a jump.
- **Downloads and outside images are blocked in artifacts.** Use Copy instead of Download, and drawings instead of photos.
- **Complete at rest.** With motion off every part shows its final state and still works.
- **Test at the default motion level, with a real hover.** Two bugs in the owner's review came from parts that only moved on lively, or only after a 4 s wait.

## Rebuild prompt

> Rebuild `<part>` from `~/.claude/design/patterns/interactive-parts.md` for `<page>`. Copy its CSS, markup and script from `components/interactive.html`, plus the shared pieces. Keep the values in the table. Swap only the sample content.
