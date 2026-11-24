# ember-kit index: find the part for the job

Read `RULES.md` first. Find your job below, then build with the part id (`RULES.md` section 2). Read only the files named for your parts.

## Parts that have a card

A card has measured sizes, pictures of every state, the CSS file, the script, a starter page and a check. Use it when you place the part in a page you write yourself.

| Part | Card | Starter |
|---|---|---|
| `n37` table: sort, search, tick, act | `cards/table.md` | `cards/table/table.starter.html` |

Every other part: build it with `scripts/assemble.mjs` (exact copy). Never retype it.

## Common pages

| Page | Parts, in order | Notes |
|---|---|---|
| List of records (drivers, orders, invoices) | `n87` (four numbers) or `n53`, `c03` (counts per day) or `c02` (money over time), `n71` (state tabs, if the rows have states), `n37` (table) | Tabs over the table are states; kinds go in Filters. An accent Add button at the right of the toolbar (`cards/table.md`, *The toolbar*). |
| Settings | `n71` (view switch) or `n17` (tabs), `n31` (switches), `n30` (fields), `n43` or `n99` (choice cards) | One card with gliding tabs. Each tab saves on its own. |
| Sign in | `n30` (field that checks), `n29` (button that works and ticks) | A picture beside the form fades in where it sits. |
| Report or dashboard | `n53`/`n54`/`n55` (metric cards), `c02` (line), `c03` (bars), `n90` (donut), `n82` (heatmap) | Stat tiles show the number only. |
| A customer's status page (track an order, see a payment) | `snippets/top-line.html`, the section head, `n84` (steps that arrive in turn), `n29` (button that works), `n78` (toast) | Small page: no sidebar (RULES.md section 2, small page). One main action. No demo controls. |
| Explainer or story | `hero`, the pattern files in `DESIGN.md` *Start here*, `endcard`, `footer` | Pictures first; headings are claims. |

## By job (the owner's picks)

From `patterns/taste.md`. When an older part does the same job, use the one in the Build column.

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

## Tools by job

When a page needs more than parts (a diagram, a figure, scroll motion, a chart, a map), use these. They are all installed. The full notes are in `~/.claude/design/tools/toolkit.md`. Every visual still uses the house colours and the house motion.

| Job | Tool | When |
|---|---|---|
| Architecture map, sequence (request steps) | skill `archify` | a system overview, the steps of a login or a request |
| Venn, state machine, data model, swimlane, layer stack | skill `diagram-design:diagram-design` with the `ember` profile (clone in `~/tools/diagram-design`) | most other diagrams |
| Small hand-built state machine or timeline | `~/.claude/design/tools/diagram_svg.py` | when the two above are too heavy |
| Isometric line figure that reacts or comes apart | skill `hairline-create` for a new one; 33 ready figures in `~/.claude/design/vendor/hairline-0.5.1.js` | a small figure on a card or beside a section |
| Big isometric "machine" figure with a live readout | skill `anatomy` (`~/tools/anatomy`); read `~/.claude/design/tools/anatomy.md` first | one showpiece per page, at most |
| Scroll scenes, timelines, count-ups, Flip reorders | GSAP 3.15 + ScrollTrigger; skills `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`, `gsap-performance` | static pages |
| Motion in React or Next | skill `motion` (motion.dev); the picker in `~/.claude/design/tools/motion.md` | React apps. Never GSAP and Motion on one page |
| Plan, review or trim motion | skills `animate`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `remove-animations`, `animation-performance`, `animation-vocabulary`, `motion-design`, `design-motion-principles` | before and after you add motion |
| Charts, sparklines, stat tiles | skill `dataviz` with chart parts `c01` and `c02` | every chart |
| Real map tiles | mapcn / MapLibre | GitHub Pages only: a claude.ai artifact blocks outside tiles |
| Map that works everywhere | the canvas street map and road graph in `~/.claude/articles/tracking-system/v2/` | artifacts, offline pages |
| H3 hexagons | `h3-js` from cdnjs (not installed; the page loads it) | hex grids on a map |
| Ready React parts | skills `shadcn`, `beui` | React projects only, restyled to the house tokens |
| 3D | the `threejs-*` skills | not on house pages (Hairline and Anatomy cover 3D looks); only in projects that already use Three.js. Ask the owner first |
| Design pass and AI-slop scan | skill `craft`; `~/.claude/skills/craft/scripts/scan.sh` | before you say a page is done |
| Slop lint | `~/tools/hallmark` (its sloplint checker only) | copy and markup |
| Accessibility, motion speed, metadata, UI drift | skills `fixing-accessibility`, `fixing-motion-performance`, `fixing-metadata`, `improve-ui` | audits |
| House style verdict | agent `ember-reviewer` | after the checks pass |
| Copy that sounds like a person | skill `humanizer:humanizer` | headings and help text |
| Current docs for a library | Context7 (`resolve-library-id`, then `query-docs`) | before using any library API |
| Screenshots, clicks, phone width | Playwright from `~/.claude/design/scripts/node_modules` (what `verify.mjs` uses) | always works, even when the Playwright MCP server is down |

## Known exceptions in house parts

Some parts break a motion rule. Copy them as they are; don't copy the break into a new part. The owner will decide on fixes.

| Part | What it does | The rule |
|---|---|---|
| `n17` tabs | its marker animates `width` | only transform and opacity move; use `n71` for new tabs |
| `n87` numbers | the digit roll animates `width` | the same |
| shell side sheet (`.sheet`) | 0.5 s both ways, 18 px corner | sheets open in 0.45 s and close in 0.25 s; `n41` is the house side sheet |
| `n84` timeline | one `opacity .2s` with no curve | every move names a house curve |
| `n41` side sheet, `n78` toasts | sit in a demo stage (`position: absolute`) | on a real page their outer box is `position: fixed` |
| `n41` sheet, `n60` button | a busy loop keeps running while hidden | loops run only while work runs |

## Every part, by group

`node scripts/assemble.mjs <id> -o x.html` opens any one of them. "Needs" lists parts that must come with it.

### hero

| Id | What it shows | Needs |
|---|---|---|
| `hero` | Hero |  |

### Charts and numbers

| Id | What it shows | Needs |
|---|---|---|
| `c01` | Server traffic, live. | pair:c01,c02 |
| `c02` | Revenue, day by day. | pair:c01,c02 |
| `c03` | Sign-ups by channel, month by month. |  |
| `n06` | Three numbers that count up and can be scrubbed. |  |
| `n87` | Four numbers, nothing else. |  |
| `n88` | One ruled band, a goal under each number. |  |
| `n91` | When the period changes, the old line fades where it stood. |  |
| `n92` | A stat card that says how this period did. |  |
| `n53` | Three tiles that roll together. |  |
| `n54` | Three numbers in one small card. |  |
| `n55` | Sales that roll up, with a line that reshapes. |  |
| `n07` | A live count where each digit rolls on its own. |  |
| `n64` | When the deal ends, the next step is right there. |  |
| `n03` | Where the month's money went, in one ring. |  |
| `n90` | Point at one kind, and the rest steps back. |  |
| `n82` | Twelve weeks of orders, recoloured in a sweep. |  |

### Dates

| Id | What it shows | Needs |
|---|---|---|
| `n01` | Pick your nights, see the price as you go. |  |
| `n73` | The button grows into a calendar, and the dates settle in. |  |

### Tables and lists

| Id | What it shows | Needs |
|---|---|---|
| `c15` | Customers, in one table. |  |
| `n37` | Sort, and rows glide to their place. |  |
| `n48` | Pages with a pill that slides to your page. |  |
| `c16` | Open an account to see its history. |  |
| `n20` | Search pages with a marker that slides. |  |
| `c18` | Pick files, act on all at once. |  |
| `c19` | Clear a busy inbox in one go. |  |
| `n83` | Sort the stops, and every time after rolls. |  |
| `n89` | A dashed gap shows where it lands. |  |
| `c20` | Delete a notice, and it turns to dust. |  |
| `c17` | Three plans, side by side. |  |

### Forms and inputs

| Id | What it shows | Needs |
|---|---|---|
| `c10` | Three steps, one line that fills. |  |
| `n79` | A form in steps, with a dot riding the line. |  |
| `c11` | Sign in, and see what went wrong. |  |
| `n30` | Wrong fields shake. Right ones get a tick. |  |
| `n97` | Editing a name should happen right where it sits. |  |
| `n56` | A number field that pushes back at its limit. |  |
| `n57` | Top up with one tap per amount. |  |
| `n11` | A sign-up form that grades your password. |  |
| `n69` | A phone field that finds the country as you type. |  |
| `n10` | A six-digit code, checked as you finish. |  |
| `n09` | A long list, found by typing. |  |
| `n59` | Type an area and the list shrinks to fit. |  |
| `n14` | Settings that respond to a touch. |  |
| `n31` | Switches that spring when you flip them. |  |
| `n43` | Pick one, and see what it means. |  |
| `n99` | A choice with a price should show what each one gets you. |  |
| `n44` | Slide, and the number counts to it. |  |
| `n93` | A small orange ring that stretches past the ends. |  |
| `n94` | A short orange bar, and the date rolls in. |  |
| `n72` | Rate it, then see where you stand. |  |
| `n45` | Tags that suggest as you type. |  |
| `n98` | A mention should become one piece the moment you pick a name. |  |
| `n46` | Filter chips that add up as you tap. |  |
| `n96` | One tap can answer a note without a reply. |  |
| `n70` | Type to pick several, and the chips make room. |  |
| `n39` | A window that settles into place. |  |
| `n41` | A side sheet that glides in from the edge. |  |
| `c12` | Upload files, and watch each one. |  |
| `n74` | Once files are in, the box folds into a slim bar. |  |
| `c13` | A secret key, shown only when asked. |  |
| `n15` | One button, a choice beside it. |  |
| `n65` | A row of actions that reads as one shape. |  |
| `n60` | A remove button that asks in place. |  |
| `n61` | A copy button that stays the same size. |  |
| `n95` | Copy the code and see what went. |  |
| `n62` | Small icons can open to say their name. |  |
| `c14` | One big button for the last step. |  |
| `n29` | Pay, and see it go through. |  |
| `n58` | A cart whose total rolls in the pay button. |  |
| `n63` | A pay button that folds while it works. |  |
| `n67` | For what can’t be undone, hold, don’t tap. |  |

### Getting around

| Id | What it shows | Needs |
|---|---|---|
| `c05` | A site menu, with a second row. |  |
| `c06` | Pick a group, then the thing you want. |  |
| `n17` | Settings tabs with a marker that glides. |  |
| `n71` | A switch whose marker stretches to your pick. |  |
| `n18` | Shop answers that open without a jump. |  |
| `n35` | Answers that spring open, one at a time. |  |
| `n19` | A long file path that folds itself to fit. |  |
| `n75` | A path that moves with you. |  |
| `n76` | Press "…" and the path opens right where it is. |  |
| `n12` | Every action, one search away. |  |
| `n36` | A command box that springs in. |  |
| `n68` | A search icon that grows into the field. |  |
| `n32` | A menu that pops on a spring. |  |
| `n66` | One highlight that changes size as it moves. |  |
| `n33` | Actions that bloom around one button. |  |
| `n34` | One tooltip that slides between buttons. |  |
| `n49` | A tooltip that waits, then fades in. |  |
| `n50` | A tooltip that drops in from above. |  |
| `n51` | A quick tooltip that teaches the key. |  |
| `c07` | A guide, with a line that follows you. |  |
| `c08` | A dock that grows under your finger. |  |
| `c09` | A profile pill that opens up. |  |

### Status and news

| Id | What it shows | Needs |
|---|---|---|
| `n21` | Notices that close without a jump. |  |
| `n42` | A warning that checks again by itself. |  |
| `c21` | Small news, then it leaves. |  |
| `n78` | Short news in a plain column. |  |
| `n22` | Archive a message and change your mind. |  |
| `n25` | A bell that swings and counts up. |  |
| `n23` | Grey shapes that hold the place of the news. |  |
| `n38` | Grey blocks that sweep while you wait. |  |
| `n85` | One drawing that changes shape. |  |
| `n86` | The loading sweep, then a drawing that draws itself. |  |
| `n47` | A bar that springs to the end. |  |
| `n80` | One task at a time, and done ones become dots. |  |
| `n81` | A plain list that ticks as you go. |  |
| `n52` | A meter that shows what fills the space. |  |
| `c22` | A payment that says where it is. |  |
| `c23` | A café receipt, printed slowly. |  |
| `c24` | A deploy, step by step. |  |
| `n84` | An order that shows how far it has got. |  |
| `n24` | Team faces that lift and say hello. |  |

### AI helpers

| Id | What it shows | Needs |
|---|---|---|
| `n08` | Watch a helper fix a failing test. |  |
| `n16` | An answer that writes itself in. |  |

### Cards you can pick up

| Id | What it shows | Needs |
|---|---|---|
| `c25` | Point at a name to peek. |  |
| `n40` | Open a name, see the trend. |  |
| `c26` | Cards that lean toward you. |  |
| `n77` | A card that grows into its details. |  |
| `c27` | A folder of files, fanning out. |  |
| `n26` | Each step takes the whole space. |  |
| `n27` | Steps that pile up, so you see how far you are. |  |
| `n28` | Covered steps settle back. |  |
| `c31` | A stack of photos, turning as you scroll. |  |

### Backgrounds

| Id | What it shows | Needs |
|---|---|---|
| `c04` | Dots that step aside. |  |
| `c29` | Click the field, watch it ripple. |  |
| `c30` | A wall of photos, sliding as you scroll. |  |

### pattern

| Id | What it shows | Needs |
|---|---|---|
| `why` | Three cards, one problem each. |  |
| `goals` | Four goals, each with a test. |  |
| `numbers` | The numbers that matter most. |  |
| `layers` | Any app, as four layers stacked. |  |
| `journey` | A photo's trip, in four steps. |  |
| `delivery` | One food order, in nine steps. |  |
| `data` | Two kinds of data, kept in two places. |  |
| `states` | Every alert is always in one state. |  |
| `stack` | Boring tools, used well. | hairline |
| `code` | See what changed, at a glance. |  |
| `repo` | Where everything lives. |  |

### end

| Id | What it shows | Needs |
|---|---|---|
| `endcard` | End card |  |

### footer

| Id | What it shows | Needs |
|---|---|---|
| `footer` | Footer |  |
