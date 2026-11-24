# Plan: the agent kit for ember-kit

Status: draft 3, waiting for the owner's go. Written 2026-11-23.
Draft 1 guessed the parts. Draft 2 counted them (`notes/piece-inventory.md`). Draft 3 is about **how to write the kit so another Claude can copy any piece exactly, reading only what it needs.**

Settled by the owner (2026-11-23): HTML **and** React with shadcn. Paste `ember.css` in for now, link it from GitHub Pages once deployed. The 8 laws in section 6 are fine for now.

## 1. Why copies come out wrong

On 2026-11-23 Claude built a showcase and the tables came out wrong (the owner: "the tables are a bit off"). It shows the whole problem in one piece:

| What the kit's table has (`n37`) | What Claude wrote |
|---|---|
| Header 40 px tall, Inter 12.5 px, `--muted`, normal case | Mono 10.5 px, upper case, letter-spaced |
| Rows 46 px tall, 12 px side padding, no wrapping | 11 px padding, rows as tall as their text |
| Row hover: ink at 3%, fading in over 0.12 s on `--ease-out` | No hover |
| Selected row: orange at 6% | No selected state |

The reasons, in order:

1. **The look is locked inside a part.** All 39 table rules are written as `#n37 th`, `#n37 td`. There's no `.table` class to use. To copy the table you'd have to find n37, read 39 rules out of a 527 KB file, and rename them. Nobody does that, so everyone writes their own.
2. **Docs describe things in words; code gets retyped.** "A light hover" turns into a guess. Exact values only survive if they're copied, not described.
3. **Motion lives only in code.** Durations, curves and springs sit in scripts, so a copy keeps how a part looks and loses how it moves.
4. **Rules are spread out.** The table rules from 2026-11-15 (tabs are states, kinds are filters, Add button, a 560 px selection bar) live in `DESIGN.md`, 52 KB away from the table's code.
5. **No check.** Nothing tells the copier that it's off by 6 px.

## 2. The idea

**Each piece gets one card, and the card is everything needed to rebuild it:** the code to copy (made from the source, never typed), the motion as numbers, every state, the rules that apply only to it, pictures, and a check that measures your copy against the original.

An agent reads the index, opens the 3–5 cards its page needs, copies, then runs the check. It never reads the 527 KB CSS, the 1.8 MB showcase or the whole of `DESIGN.md`.

## 3. Three tiers, read in order

| Tier | File | Size | When it's read |
|---|---|---|---|
| 0 | `kit/RULES.md`: the rules that apply everywhere (tokens, both themes, orange once per view, words, the 8 laws, how to use cards) | about 80 lines | Always |
| 1 | `kit/INDEX.md`: "I need to …" → card. Every job in `taste.md` plus every piece | about 150 lines | Always |
| 2 | `kit/cards/<piece>.md` | 150–400 lines each | Only the cards the page uses |

The rest of `DESIGN.md` moves into the cards it belongs to (the table rules go into `table.md`, the sheet spacing into `sheet.md`). `DESIGN.md` keeps the reasons and the history.

**Packed as a Claude skill.** `kit/` ships as a skill named `ember-kit`, whose `SKILL.md` is tier 0 plus a link to the index. Claude loads it whenever UI work starts, and opens cards on demand. This is the built-in way for Claude to "read only what's needed". A rule in `~/.claude/rules/design.md` points to the skill.

## 4. What a card holds

Every card has the same sections in the same order, so an agent always knows where to look. Example, `cards/table.md`:

```
# Table                                         (from part n37 · made 2026-11-xx · ember-kit vN)
Use it for: rows people scan, sort, pick and act on.   Not for: 3 rows or fewer (use a list).

## Picture        table.light.png  table.night.png  table.states.png (rest · hover · selected · sorted · empty)
## Anatomy        a labelled drawing: toolbar → header row → body rows → checkbox column → selection bar
## Sizes          header 40 · row 46 · side padding 12 · checkbox 18 · bar 560 wide, 60 tall      ← every number, as tokens
## Markup         the one allowed HTML, complete, with every class and aria attribute
## CSS            the complete rules, class-based (.tbl), copied out of the source by a script
## Behaviour      the complete script, copied out by a script (sort, pick, select all, keys)
## Motion         one row per thing that moves:
                  | trigger     | what moves     | from → to       | time   | curve          |
                  | hover row   | background     | 0 → ink 3%      | 0.12 s | --ease-out     |
                  | sort        | rows glide     | old y → new y   | (read from n37's script) |
                  | pick rows   | bar rises      | y+12, 0 → 0, 1  | spring | --sp-snappy    |
                  Reduced motion: what each one does instead.
## States         rest · hover · focus · selected · some selected · sorted · empty · loading · error, each with its look
## Rules          only this piece's rules: tabs are states, kinds go in Filters, Add button at the right end, …
## Laws           Fitts: rows 46 px. Hick: at most 3 bulk actions, then "More". Proximity: …
## React          the shadcn component (Table, TableRow, …) with the same classes and variants
## Don't          what copies actually got wrong (see section 1). This list grows every time a check fails.
## Check          node kit/verify.mjs page.html --card table
```

Rules for writing cards:
- **Code is made by a script, never typed.** `kit/build.mjs` copies the CSS and JS out of the showcase into each card. So a card can't drift from the kit: rebuild, and the card changes.
- **Numbers, not adjectives.** "46 px row", never "roomy rows". "0.12 s on `--ease-out`", never "a soft fade".
- **Every state gets a picture.** Hover, selected and empty are where copies drift, and where screenshots usually skip.
- **Real sample data** in every example (orders, drivers, KES), as the showcase rule already asks.
- **6th-grade English** for the prose, like the rest of the folder.

## 5. The check: measure, don't eyeball

`kit/verify.mjs page.html --card table` opens your page and the original part side by side in Playwright and compares:

1. **Computed styles.** For each element the card names (header cell, row, cell, checkbox, bar), it compares height, padding, font, colour, radius, border and shadow with the original. The output is the exact fix: `th height 32 ≠ 40 (use .tbl)`. This catches the table error from section 1 in one run.
2. **States.** It puts both into each state (hover a row, pick two rows, sort, empty) and compares again.
3. **Motion.** It records the timings of each transition and animation, and the frames of a hover, a sort and the bar rising, then checks them against the card's motion table. This uses the frame tests already in `patterns/smooth-motion.md`.
4. **Pixels.** A screenshot diff of each state, light and night, at 1440 and 390 px (`match.mjs` already does this).
5. **The laws** that can be measured: tap areas, orange count, gaps on the scale, number of primary buttons.

It exits with an error if anything is off. A hook runs it when an agent writes an `.html` file that uses kit classes.

## 6. The 8 laws (settled for now)

| Law | Rule | Checked |
|---|---|---|
| Fitts | Tap area 44 px on touch, 24 px at least. Remove sits away from Save. | measured |
| Hick | One main button per group. Menus with 7 or more items get groups or search. 5 tabs or fewer. | counted |
| Jakob | Close at top right. Enter sends, Esc closes. | key test |
| Proximity | Gaps from the spacing scale. Label 8 px from its field, fields 16 px apart. | measured |
| Similarity | One look per job. Nothing that isn't a button looks like one. | unknown classes fail |
| Von Restorff | Orange fills one thing per view. | counted |
| Doherty | A press shows a change within 0.1 s. Waits over 0.4 s show progress. | timed |
| Postel | Fields take messy input and show it tidy. Errors say how to fix it. | sample inputs |

The other 22 laws from lawsofux.com go on the `craft` review checklist.

## 7. Pieces and parts

- **Pieces** are the basic things everything is made of: button, icon button, field, select, checkbox, radio, switch, slider, tabs, segmented switch, menu, tooltip, chip, badge, avatar, card, **table**, dialog, side sheet, toast, empty state, skeleton, stepper. About 25 cards. Each becomes a class (`.tbl`, `.b`, `.in`) that works anywhere, not just under one part's id.
- **Parts** are the 156 showcase parts. Each part card is a recipe: which pieces it uses, plus its own extra CSS, JS and motion. Made by the same script.
- **Screens** come from Fossa: sign-in flow, list with table and side sheet, settings, dashboard. Each screen card lists the cards it uses.

## 8. React and shadcn

The same source makes both:
- `ember.css`: tokens and piece classes, pasted into HTML pages now and linked from GitHub Pages later.
- A **shadcn registry** (`kit/registry/`): each piece as a shadcn component (cva variants named like the classes: `Button variant="primary" size="sm"` is `.b.pri.sm`), plus a `globals.css` with the tokens. Apps add a piece with `npx shadcn add <github-pages-url>/r/table.json`.
- The motion goes into Motion (`motion/react`) with the same springs and curves, per `tools/motion.md`.
- `verify.mjs` runs on the React page too. It must give the same numbers as the HTML.

## 9. Steps

A. **Inventory.** Done (`scripts/inventory.mjs` → `notes/piece-inventory.md`).
B. **Pilot one card: the table.** Make `.tbl` from n37, write `cards/table.md` from the template, write `verify.mjs` for it, and fix the showcase artifact's two tables with it. Then hand only `RULES.md` and `table.md` to a fresh Claude with "build a drivers table with search and bulk actions". Pass means: verify finds no style differences in every state, and the motion timings match. If it fails, change the card, not the agent. **The owner reviews the pilot before step C.**
C. **The owner picks the rest.** For each other piece, show the most-used versions side by side with their law results. Each pick is logged in `notes/choices.md`.
D. **The build script.** `kit/build.mjs`: showcase → `ember.css`, cards with their code blocks, pictures for every state, React components. Run it after every kit change.
E. **The rest of the piece cards**, then `INDEX.md` and `RULES.md`. Move rules out of `DESIGN.md` into their cards.
F. **Part cards and screen cards.**
G. **Skill, hook, deploy.** Package as the `ember-kit` skill, add the verify hook, publish `ember.css`, the cards and the registry on GitHub Pages.
H. **The blind test.** A fresh Claude builds three pages (a settings page, a drivers list, a sign-in flow) from the skill alone, once in HTML and once in React. All checks must pass. Anything it got wrong goes into that card's Don't list.

## 10. Open

1. Turning `#n37` rules into a `.tbl` class means changing the showcase (step D). Is that OK, or should the kit keep a separate copy?
2. Should the skill live in this repo (`~/.claude/design/kit/`) or in its own repo?


## Status, 2026-11-24 (after three blind rounds)

Done: `kit/RULES.md`, `kit/INDEX.md`, the table card (`n37` made class-based, with `setRows`), `verify.mjs` (house and card checks, motion on, served over http), `kit/tests/run.sh` (11 cases), `kit/tools/accent.mjs` (swap the accent), `kit/tools/part.mjs` (pull one part), snippets (theme switch, top line, springs), the `ember-reviewer` agent. Nine blind builds: every one passes both checks; the reviewer still finds page-level misses (headings that only describe, a missing Add button, demo controls), which RULES.md now names.

Biggest gap left: only the table is a reusable piece. Every other part is tied to its showcase id (`#n31`), sits in a demo stage, and can't be used twice on a page. Agents copy it under the id, or rewrite its script. Next: give the app pieces the table's treatment (classes, one shared script with a handle, a card with measured states and a check), in this order: tabs with panels (`n71` + `n17`'s panel fade), switch (`n31`), field (`n30`, `n69`), busy button (`n29`), side sheet (`n41`), toast (`n78`), numbers (`n87`).

Open for the owner: the Undo countdown pause rule (two lines in DESIGN.md disagree), `n17` width motion, `c03` busiest bar and today stripe, `n87` change chips, the selection bar size.
