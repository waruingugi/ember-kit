# Showcase

A showcase is one page that shows the whole kit. It has two halves: **the parts** (things people use) and **the page patterns** (a short story for each pattern file). A showcase with only the parts is half done.

The finished page is `components/showcase/index.html`, the master copy. **Start from it.** `node scripts/assemble.mjs all -o page.html` gives it back from `components/parts/` (see `components/parts/README.md`); the words, drawings and sample data are part of the look. This file says what it holds, in order, so you can check a copy.

## The frame around everything

- **Sidebar** (see *The sidebar* in `DESIGN.md`). A small orange mark, the word "kit." and "Design system · v4". Two groups of links, each with a two-digit key:
  - **Parts**: 00 Overview, 01 Charts and numbers, 02 Dates, 03 Tables and lists, 04 Forms, 05 Getting around, 06 Status, 07 AI helpers, 08 Cards, 09 Backgrounds.
  - **Page patterns**: 10 Problem cards, 11 Goal list, 12 Stat tiles, 13 Exploded layers, 14 Flow, 15 Story timeline, 16 Data model, 17 State machine, 18 Tool cards, 19 Code changes, 20 Folder views.
  - A marker slides to the link you are reading. The foot has an orange reading bar with a percent, and the hint "[ collapse · drag the edge to resize". The edge can be dragged. On a phone the sidebar is a drawer.
- **Top bar**: a menu button (phones), the trail "Design system / v4 showcase / Every part", a "v4 · Live" badge, an **Options** button and a theme button. A thin orange line along its bottom shows how far you have read.
- **Options** opens a sheet from the side: a title "Options", the line "How the page looks and moves for you.", a close button, then theme (light, night) and motion (off, calm, lively). Save both together as one JSON object in `localStorage` under `ds-showcase-v4`. The sidebar keeps its own state (open or shut, width) under `ember-sb-v1`. Put the sheet's motion switch before any line chart in the page, because the line-chart script takes the first `.seg` it finds.
- **Background**: the faint squares grid, only in empty gaps (see *Recurring parts* in `DESIGN.md`).

## 00 Hero

- Eyebrow `00 Showcase · Design System v4`.
- A two-line display heading: "Every part we build," then "*in one place.*" in orange italic. Each line comes in on its own.
- A lead that says what the page is: every part, each with its own sample data, each standing alone.
- A meta row: Status: Showcase · Built with: DESIGN.md · Updated: (date) · Parts: (count).
- On the right, a **live courier card**: "Courier · order #214" with a Live chip; a small street map where an orange route draws and a rider dot moves along it, from KITCHEN to HOME; three numbers under it: Arrives in (a countdown like 07:42), Left (km), Update (s).
- A scroll cue at the bottom: "Scroll to see every part".

## 01–09 The parts, in groups

Each group opens with a head: a big faint ghost number, the eyebrow, a display heading that is a claim (its end in orange italic), and one lead line. Then its parts, in this order:

| # | id | Eyebrow | Heading | Lead | Parts, in order |
|---|---|---|---|---|---|
| 01 | `charts` | Charts and numbers | Numbers people can *read at a glance.* | Every chart here has one orange line or slice: the one thing to look at. The rest stays quiet grey. | live line chart, still line chart, bar chart, scrub numbers, rolling count, donut |
| 02 | `time` | Dates | Pick a day *without a fight.* | A calendar for booking a stay. Hover to see the range before you pick. | date range |
| 03 | `tables` | Tables and lists | Lots of rows, *still easy to scan.* | Search, sort, pick and act. The tables turn into cards on a phone. | data table, sorting table with gliding rows (spring), pages with a sliding pill (spring), expandable rows, pagination, selection basket, batch tray, dissolve delete, plan comparison |
| 04 | `forms` | Forms and inputs | Forms that *say what went wrong.* | Errors sit under their field, in words. Progress and done are orange. | stepper, sign-in, field that shakes and ticks (spring), sign-up, code boxes, search box, switches, spring switches, cards with a springing frame (spring), slider that counts, tags that suggest, filter chips, settle modal, side sheet whose lines arrive (spring), file upload, secret reveal, split button, edge-lit button, pay button that rolls (spring) |
| 05 | `nav` | Getting around | Always know *where you are.* | Menus, tabs and trails. A marker glides to show where you are. | pill nav, branching menu, tabs, FAQ, one-at-a-time FAQ (spring), breadcrumb, command menu, springy command box, springy dropdown, bloom menu, sliding tooltip, reading progress, dock, profile pill |
| 06 | `status` | Status and news | Tell people *what just happened.* | Notices, toasts, payments and progress, each with a clear end. | notices, banner that checks again, toast, undo, bell, skeleton, skeleton sweep (spring rise), progress bar that springs (spring), payment status, receipt, deploy steps, avatars |
| 07 | `ai` | AI helpers | Show what the AI *is doing.* | People trust a helper more when they can see each step and stop it. | agent activity, streamed answer |
| 08 | `cards` | Cards you can pick up | Some things *want to be touched.* | Only things you can pick up float, lean or fan out. Text and tables stay flat. | peek card, peek card with a trend, tilt card, folder, card swap |
| 09 | `fields` | Backgrounds | Quiet backgrounds *that answer your hand.* | They sit still until you move. Use one per page, behind a hero or an empty state. | dot field, push-back dots, photo wall |

The small parts from `components.css` (cards, stats, callouts, pills, tables) are not a group of their own. They show up inside the page patterns below.

## 10–20 The page patterns

Each one has the same group head (ghost number, eyebrow, claim, lead) and then **one small, real story** built with that pattern. Every story has its own made-up subject. Never a list of rules about the pattern.

| # | id | Eyebrow | Heading | The story | Build it from |
|---|---|---|---|---|---|
| 10 | `why` | Problem cards | Three cards, *one problem each.* | A clinic's patients: "The queue is long", "The phone is always busy", "Nobody reminds you". Each card has a small icon, a title and one line. Then a callout: "In one sentence: Book a visit in one minute, wait at home, and get a reminder the day before." | `components/README.md` (card, callout) |
| 11 | `goals` | Goal list | Four goals, *each with a test.* | A shop's checkout: Fast, Clear, Simple, Calm. Each goal has one line, and a "How we'll know" box with a test, such as "Page open < 1 s". | `components/README.md` |
| 12 | `numbers` | Stat tiles | The numbers that *matter most.* | A food delivery app's week: Orders (1,240,500), Riders (18,432), Order to kitchen (0.8 s), Uptime (99.95%) and one more. Mixed tile widths. A "Sample" or "Target" chip on each. Numbers count up once, fast then slow. | `components/README.md` (stat card), *Motion* in `DESIGN.md` |
| 13 | `layers` | Exploded layers | Any app, as *four layers stacked.* | A chat app in four layers that come apart as you scroll. | `patterns/exploded-layers.md`, `tools/build_layers.py` |
| 14 | `journey` | Flow | A photo's trip, *in four steps.* | Pick, Upload, Shrink, Show. Hand-drawn arrows draw in one by one, then a dot walks the steps. A tool note under it. | `tools/diagrams.md`, `tools/diagram_svg.py` |
| 15 | `delivery` | Story timeline | One food order, *in nine steps.* | A lunch order from the tap to the doorbell, with times and the system that did each step. The line follows as you scroll. | `patterns/story-timeline.md` |
| 16 | `data` | Data model | Two kinds of data, *kept in two places.* | Weather stations: facts in Postgres, readings in ClickHouse. | `patterns/data-model.md` |
| 17 | `states` | State machine | Every alert is always *in one state.* | A weather alert: watching, rising, sent, missed, tried again. | `patterns/state-machine.md` |
| 18 | `stack` | Tool cards | Boring tools, *used well.* | One card per tool, each with its job in one line (the bus, Postgres, Auth callout, FastAPI, Alerts, ClickHouse), each with a Hairline drawing that reacts to the mouse. The big card is the message bus: see *The tape* below. | `patterns/figure-cards.md`, `tools/hairline.md` |
| 19 | `code` | Code changes | See what changed, *at a glance.* | A shared change: files with a letter for what happened to each, and a diff. | `patterns/code-blocks.md` |
| 20 | `repo` | Folder views | Where everything *lives.* | The same repo two ways: the whole tree, and a walk down to one folder. | `patterns/folder-views.md` |

## The tape (section 18)

A row of numbered message tiles, newest on the right, and one lane per reader under it.

- **Head**: "The log · newest on the right" and the newest number (`#1040`).
- **Tiles**: 46 px apart, each showing the last two digits. Tiles every reader has passed are pale; unread ones are filled orange. A new tile slides in from the right.
- **Readers**: Index, Alerts and ClickHouse. Each lane has an orange line that fills up to the reader's dot, and the number it has read (`#1039`, `#1037`, `#1036`). The dot sits under the tile it has read.
- **Every 1.1 s** (only when motion is on, the tab is visible and the tape is on screen): a new message arrives. Index reads it at once. Alerts catches up every other tick. ClickHouse jumps to the newest every fifth tick, because it reads in batches.
- **The button** "Pause ClickHouse" stops that reader. Its lane says "Paused", and the caption says nothing is lost. Press "Start ClickHouse" and it says "Catching up", reads three a tick until it reaches the head, then the caption says all are caught up.
- Caption at rest: "Each helper reads at its own speed. ClickHouse waits and reads in batches, and that is fine."

## The end

- **End card** on the dark plate: "Every part here *comes from one file.*", one line saying the data is made up and the parts are real, and three numbered next steps: Pick a pattern, Copy the part, Run the checklist.
- **Footer**: "Design System v4 · sample data" on the left, the picture tools on the right.

## A page like this one

For a page that is like the showcase but not the same (a smaller kit page, a product tour, a page for one group):

1. Pick the sections from the tables above, in the order the page needs. Keep the hero, the end card and the footer.
2. `node scripts/assemble.mjs hero,<ids>,endcard,footer -o page.html`.
3. Change only words and sample data: headings (a claim with one orange phrase), the lead line, names, numbers, dates. Keep each part's own realistic data for its job. Some sample data sits in a part's script (the stepper's steps, a chart's numbers): change those values, never the code around them. Never change a class or a rule.
4. Make the page its own: the `<title>`, the sidebar links and their two-digit keys, the top-bar trail, and the section numbers (ghost numbers and eyebrows count 01, 02 … in the new order). Change the storage key `ds-showcase-v4` to `<project>-motion-v1`, as *Motion* in `DESIGN.md` says.
5. `node scripts/singles.mjs --ids <ids>` must pass (sticky parts are the exception: `patterns/interactive-parts.md`, part 28) before you change words (it proves the parts came through whole). After you change words, check by eye and run the *Checklist* in `DESIGN.md`.

Parts marked (spring) are the owner's Taste Lab round 1 and 2 winners (`notes/choices.md`); they use the spring tokens in `tools/motion.md`.

A part the kit does not have yet: build it in the showcase first (its own section, class `kv4`), then run `node scripts/split.mjs` so it becomes a part, then use it.

## Traps

- Old parts and v4 parts on one page need scoping (see *Known traps* in `DESIGN.md`).
- Toasts sit inside their own part's card, not in a page corner.
- Before you call it done, run `node scripts/match.mjs components/showcase/index.html page.html`: every section at 99% or better, with no style differences.
