# Choices

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

What the owner picked from each compare page (`patterns/compare-parts.md`).
Newest first. Read this before building a new kind of part: a part picked
here is settled, and a close part's pick becomes option A.

Taste Lab r1 winners are house parts `n29`–`n39` (`CHANGELOG.md`, 2026-11-01).

| Date | Part | Options shown | Picked | Why (the owner's words) | Sources |
|---|---|---|---|---|---|
| 2026-11-01 | Taste Lab r2: 09 Tags | A plain tags, B springy tags, C suggestions as you type, D filter chips with counts | C and D; Claude picks per case (C when people type their own, D when the list is fixed) | "Use C and D" | easyui tag-input, Radix combobox, beUI chips |
| 2026-11-01 | Taste Lab r2: 08 Pages of a list | A plain numbers, B sliding pill, C Show more, D page box to jump | B | Picked B | beUI pagination, easyui animated-pagination |
| 2026-11-01 | Taste Lab r2: 07 Alerts and banners | A plain alert, B drops in on a spring and the page closes the gap, C checks again by itself, D shrinks to a dot | C when the problem can be checked again; B when it cannot | "I pick C but if it can not retry use B" | easyui alert-banner, beUI banner |
| 2026-11-01 | Taste Lab r2: 06 Progress | A plain bar, B springy bar with count-up and tick, C ring with steps, D parcel-tracker stops | B | Picked B | beUI progress |
| 2026-11-01 | Taste Lab r2: 05 Slider | A plain, B bubble follows the thumb, C marks every 1,000 and a number that counts, D weeks as a big number (n06) | C | Picked C | easyui stepped-slider, house n06 |
| 2026-11-01 | Taste Lab r2: 04 Choice (radio, segmented) | A radio list, B springy pill, C cards that lift, D choice with an explaining box | G, the mix: cards, a frame that springs between them, and a box that explains the pick | "We need a variation of c, b and D or a combination of all 3", then picked G | beUI segmented-control, easyui radio-cards |
| 2026-11-01 | Taste Lab r2: 03 Drawer | A right sheet with lines arriving, B rubber band, C bottom sheet with three stops, D sheet becomes a page | A | Picked A (the right sheet with more motion asked for in round 1) | shadcn sheet, easyui sheet |
| 2026-11-01 | Taste Lab r2: 02 Popover | B springs out with a pointer, A plain with pointer, C peek that grows, D order line draws in (c25), F opens in the sentence | D, the peek card whose order line draws in (house c25 pushed) | Picked D once the cards showed in full | beUI popover, easyui peek-card, house c25 |
| 2026-11-01 | Taste Lab r2: 01 Primary button contrast | A today's orange and white, B deeper orange, C black text, D ink with orange dot, F big and bold | A, kept as it is, knowing it reads about 4 to 1 in day | Picked A | WCAG 2.2 1.4.3 |
| 2026-11-01 | Taste Lab r1: 16 Empty and loading | A spinner, B skeleton sweep, C thinking orb, D outlines that fill, E words and a big number | B | Picked B | easyui skeleton, shadcn skeleton |
| 2026-11-01 | Taste Lab r1: 15 Date picker | A shadcn popover calendar, B gliding pill, C range with quick picks, D prices per day (n01), E square mono grid | A, B, C, D; Claude picks per case | "Keep all except E and use them where needed" | shadcn, easyui, beUI, house n01 |
| 2026-11-01 | Taste Lab r1: 14 Command menu | A cmdk box, B springy box and gliding highlight, C button stretches into search, D list with preview (n12), E terminal | B | Picked B | beUI command-palette, easyui spotlight-search |
| 2026-11-01 | Taste Lab r1: 13 Accordion | A Radix arrow, B one at a time with a spring, C plus to minus, D open one lifts (n18), E serif numbered | B | Picked B | beUI bouncy-accordion, easyui smooth-accordion |
| 2026-11-01 | Taste Lab r1: 12 Data table | A plain sort, B rows glide and a selection bar rises, C density and open rows, D search and spreadsheet edit (c15), E ledger | B, plus D's search box | "I like B but with a search as well" | beUI table, easyui selection-basket, house c15/c19 |
| 2026-11-01 | Taste Lab r1: 11 Toast | A corner toast, B pile that opens, C sending then sent with countdown, D row says Sent (c21), E ink bar | A, B, C; Claude picks per case | "We like A, B and C" | Sonner, beUI toast stack, easyui undo-toast |
| 2026-11-01 | Taste Lab r1: 10 Drawer and side sheet | A right sheet, B springy drag-away, C page steps back, D bottom sheet with two stops, E ink panel | None yet; round 2 shows more D, and A with more motion | "Show me more of D and A where A has some more motion" | shadcn sheet, beUI bottom-sheet, Vaul |
| 2026-11-01 | Taste Lab r1: 09 Modal | A fade and grow, B settles into place, C grows from the button, D three steps, E full cover | B | Picked B | easyui settle-modal, beUI center-morph-modal |
| 2026-11-01 | Taste Lab r1: 08 Popover | A click and fade, B blooms from the name, C peek then pin, D peek that leans (c25), E soft bubble | None yet; round 2 shows more, without E | "Show me more except" E (confirmed in chat) | shadcn, beUI popover-morph, easyui peek-card, house c25 |
| 2026-11-01 | Taste Lab r1: 07 Tooltip | A wait and fade, B drops in from its side, C fast with the key, D one tooltip slides between buttons, E instant label | A, B, C, D; Claude picks per case | "All are valid except E" | shadcn/Radix, easyui directional-tooltip, beUI tooltip |
| 2026-11-01 | Taste Lab r1: 06 Dropdown menu | A corner fade, B springy pop with gliding row, C submenu, D button grows into menu (c09), E mono ink, F bloom | B (default) and F when it fits | "Use both F and B when needed" | beUI context-menu, beUI bloom-menu, easyui origin-dropdown |
| 2026-11-01 | Taste Lab r1: 05 Tabs | A grey track, B springy underline, C gliding pill and height, D stretching marker (n17), E numbered words | A, B, C, D; Claude picks per case | "Use all except E when needed" | shadcn/Radix, beUI tabs, easyui pill-navigation, house n17 |
| 2026-11-01 | Taste Lab r1: 04 Switch and checkbox | A quick slide, B spring knob and drawn tick, C stretch and bounce, D whole row is the switch (n14), E square ON/OFF | B | Picked B | beUI switch, beUI checkbox |
| 2026-11-01 | Taste Lab r1: 03 Select and combobox | A plain list, B springy drop, C search with groups, D button grows into search, E soft sheet, F wheel | None; keep house n09 | "A long list, found by typing … from the v4 artifact is better. Stick with it" | house n09 |
| 2026-11-01 | Taste Lab r1: 02 Form field with errors | A check on submit, B shake when wrong and tick when right, C flag on leave, D countdown error list (c11), E serif lines | B | Picked B | beUI input |
| 2026-11-01 | Taste Lab r1: 01 Buttons | A spinner, B words roll and tick pops, C squash and drawn tick, D edge light and split menu (c14/n15), E brutal block, F hold to pay | B | Picked B | beUI button-stateful, button-base |
| 2026-11-01 | Stacked pages (part 28, brought back) | A full cover (easyui), B the deck fixed, C the deck that settles (mix), D card swap | All four; Claude picks case by case | "Pick best option for me when and where needed, case by case" | easyui Sticky Pages, our part 28, our card swap (part 31), `animate` |
| 2026-11-02 | Code, diff and terminal tabs | A editor tab, B diff colour fill, C gliding pill, D editor tab with a diff-coloured top edge | A's look with C's glide (owner's mix; D was a first pick by Claude, replaced the same day) | "I don't like the orange underline when I switch between tabs"; then "use C gliding pill but with A design" | VS Code and Zed tabs, the kit diff letters, Taste Lab tabs C |
