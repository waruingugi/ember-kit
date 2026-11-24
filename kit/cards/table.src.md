# Table

Made from house part `{{part}}` ("Sort, and rows glide to their place.") by `node kit/build.mjs table` on {{date}}. Every code block, number and picture below comes from the live part. Don't edit `table.md`; edit `table.src.md` or the showcase, then rebuild.

**Use it for** rows people scan, sort, search, tick and act on: orders, invoices, drivers, vehicles.
**Don't use it for** three rows or fewer (use a list), or rows that open into detail (that's `c15`, for quiet pages only).

## The fastest exact start

Open `{{starter}}`. It's a whole working page with this table. Copy it, then change only the words, the data and the columns. Keep every class, rule and script as it is.

## Pictures

Look at these before you build. Your table must look like this in every state, in both themes.

{{pictures}}

## Sizes and colours

Measured in the browser at rest (1440 px wide, light). Colours are named by token: use the token, never the hex.

{{sizes}}

## States

How each state differs from rest, measured:

{{states}}

## Motion

Recorded while the part was used, with motion on. Copy the code below and you get all of it; don't rebuild it with other values.

{{motion}}

- With reduced motion (the motion level `off`), rows jump to their place and nothing glides. The script checks this itself (`lv()`).
- The bar rises on the house snappy spring (`--sp-snappy`, `--sp-snappy-d`). Both come from `{{cssfile}}`. Motion is always lively; it is off only when the reader's system asks for less motion.
- Only `transform`, `opacity` and colours move. Nothing animates size.

## Markup

The one allowed markup. Change the words, the columns (one `<th data-k="N">` per column, numbered from 0) and the bar's actions. Keep every class and `aria-` attribute.

{{markup}}

Icons it uses, once per page (put this as the first thing in `<body>`):

{{icons}}

Rules for the markup:
- The page (or a box around the table) has the class `kit`. The CSS depends on it.
- **Put the status column second**, right after the name, so it still shows at 390 px. The table scrolls sideways inside its own box on a phone; what people scan for must be in the first columns.
- A column of numbers or money gets `tbl-end tbl-num` on both its `<th>` and its cells, so it lines up on the right.
- Status words use `<span class="tbl-st" data-s="done|due|late|idle">`: done is a filled accent dot, due (waiting) a grey ring, late (a problem) an accent ring with accent words, idle (neutral: draft, off, paused) a short grey dash with muted words. There is no green or red. Map every state you have to one of these four.
- A plate or code column: wrap the value in `<code>` and add one rule, `.kit .tbl code { font: 500 13px var(--font-mono); background: none; padding: 0; border: 0; }` (it must start with `.kit`, or the page's own code style wins).
- **The toolbar.** Every list people add to has an Add button on the search's row, at the right end:
  ```html
  <div class="tbl-top" style="display:flex;justify-content:space-between;align-items:center;gap:12px">
    <label class="tbl-search">…the search, as above…</label>
    <button class="b pri" type="button">Add invoice</button>
  </div>
  ```
  Tabs over the table are its states (All, Paid, Due, Late) and sit above the toolbar: use part `n71`, and call the table's `setRows` with the rows for the picked tab. Kinds of thing go in a Filters menu.
- Each bar button has `data-bx="what happened"`. The foot line shows those words after the action. The × has `data-bc`.
- The bar's buttons start with `tabindex="-1"`. The script puts them back in the tab order when the bar shows.

## CSS

Paste all of `{{cssfile}}` into the page's `<style>`. It is {{csscount}} rules: the tokens for both themes, the page base, the button, the field, the icon, and the table. Don't retype it, trim it or rename its classes.

## Behaviour

Paste this once per page. It is the same script the showcase runs.

{{js}}

Then start each table with its own data. This is the showcase's own call; yours changes only the data, columns and words:

{{example}}

- `columns[k]` matches `<th data-k="k">`. `get` is the value to sort by (a number for money, an ISO date for dates). `html` is what the cell shows.
- **Pass any text that came from people through `emberTable.esc()`** before it goes into `html`. Names, notes and search results can hold `<` and quotes.
- `onAction(button, ids)` runs after a bar action, with the ids that were ticked. Use it to call your server.
- `emberTable()` returns a handle: `setRows(rows)` swaps the data in place (rows glide; ticks on rows that left are dropped), and `rows()` gives the current data. Use it for tabs, after an action changes rows (Retire, Suspend, Undo), and in React.

## Rules for tables

From `DESIGN.md` and `patterns/taste.md`, the owner's own words:
- **This is the table for sorting, searching and acting on rows** (Taste Lab round 1: "B but with a search as well"). `c15` is for quiet pages only.
- **Tabs over a table are its states** (All, Active, Deactivated). **Kinds are filters** (kitchen, branch, depot) and go in a Filters menu. A list with no states and nothing to filter shows no tabs row and no Filters button.
- **Every table people add to has an Add button** at the right end of the toolbar, orange, naming the thing ("Add vehicle"). It opens the side sheet with an empty form. After saving, the table goes to the page with the new row, and that row glows once.
- **The action is the confirmation.** A bulk action runs at once and says so. Never ask "Are you sure?". Offer Undo where it can be undone.
- **A badge that marks a whole record** (a verified tick) shows once, in the record's own header, never on every row.
- **A number plate is a code**: mono font everywhere.
- **Search finds what people type**: a plate, a name, or a phone typed the local way (0711…) still matches.
- **A list by date** gets its own date button next to its search ("The button grows into a calendar", `n73`).
- **Every button that sends a request** shows three bouncing dots while it works and keeps its width.
- **Open question for the owner:** `DESIGN.md` (2026-11-15) says the selection bar should be at least 560 px wide and about 60 px tall, with 38 px buttons. Part `n37` still has the smaller bar measured above. Until the owner picks, build what this card measures; the check compares against `n37`.

## Laws

| Law | How the table meets it |
|---|---|
| Fitts | Rows are 46 px. The 18 px checkbox has a 42 px tap area (its `::before` reaches 12 px out). The bar sits at the bottom, next to the rows it acts on. |
| Hick | One orange button in the bar. At most three actions in the bar, then a "More" menu. |
| Jakob | Headers are buttons that sort. Press again to flip. The tick-all box sits at the top left. |
| Proximity | The search sits 10 px above the table card. The foot line sits 8 px under it. |
| Similarity | Every table on every page uses these classes. Nothing that isn't a button looks like one. |
| Von Restorff | Orange marks only the sorted arrow, paid dots, late words, ticks and the one main button. |
| Doherty | A tick changes the row at once. The bar rises within 0.4 s. |
| Postel | Search ignores case and spaces at the ends. |

## Don't

What copies have got wrong. Each item came from a real failed build.
- Header in mono capitals with letter spacing. The header is Inter 12.5 px, weight 500, `--muted`, normal case. (Claude, 2026-11-23)
- Padding guessed per cell, rows as tall as their text. Rows are 46 px, headers 40 px, sides 12 px. (Claude, 2026-11-23)
- No row hover, or no picked tint. Hover is ink at 3%, picked is orange at 6%. (Claude, 2026-11-23)
- Classes renamed with a prefix (`fl-b`, `.my-table`) and values retyped. Copy the CSS file. (Fossa, 2026-11)
- A green "Paid" or red "Overdue". Status is the accent and ink only.
- No Add button on a list people add to. (Blind round 1, 2026-11-23)
- A state with no look of its own left as bare words. Neutral states use `idle`. (Blind round 1, 2026-11-23)
- An ink-black selection bar. The bar is raised paper with a hairline and a big shadow.

## Check

```
node ~/.claude/design/kit/verify.mjs your-page.html --card table
```

It finds the first `.tbl` on your page and puts it through the same states as above. It compares every measured element with this card, records the motion, and checks the laws it can measure. It prints each difference with the fix. A page passes when it prints `PASS`.
