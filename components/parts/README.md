# Parts

Every piece of the showcase (`components/showcase/index.html`) as its own file. **Made by `node scripts/split.mjs`; never edit these files by hand.** Change the showcase, then split again.

## Build a page from parts

1. Pick the parts you need from the table below, in the order the page shows them.
2. `node scripts/assemble.mjs hero,c15,n20,why,endcard,footer -o page.html`
   - A part brings its group heading with it. `c01` and `c02` always come together. The icon sprites always come.
   - `all` gives the whole showcase back.
   - For a real app page, add `--app "Shop settings"`. The sidebar keeps only links to sections on the page, the top bar shows your title with no "v4 · Live" badge, and the group numbers and "what to try" lines go. Then rewrite the headings (`.kit-h`) and group heads as your app's own words.
   - One part alone is the same command with one id: `node scripts/assemble.mjs n47 -o n47.html`. Never open `n47.html` from this folder on its own: it has no page shell and no CSS.
3. Change the words and sample data inside the page. Keep every class, rule and script as it is.
4. Check it: `node scripts/singles.mjs --ids c15,n20` checks parts against the showcase, and
   `node scripts/match.mjs components/showcase/index.html page.html` checks a whole page.
   Pages made with `--app` will not match, by design; check them for console errors and sideways scroll instead.

First time: `cd scripts && npm install` (Playwright, pixelmatch, pngjs).

## Work on a copy

To try a change without touching the kit, copy it, then point the scripts at the copy:

- `node scripts/split.mjs <copy>/components/showcase/index.html <copy>/components/parts`
- `node scripts/singles.mjs --kit <copy> --ids n90`
- `node scripts/assemble.mjs n90 -o x.html --parts <copy>/components/parts`

## Things that trip people up

- **`base.css` holds every part's CSS**, not just shared rules. A rule moves into a part's own file only when no other part uses any of its class names. So a page that loads `base.css` already styles `#n47`. If you rebuild a part by hand, give it a new id, or your rules will mix with the real ones.
- **The main button.** `base.css` has two `.kit .b.pri` rules: an older dark ink one, then a later one that makes it orange with `--on-accent` text. The later one wins, and it is the house rule (`DESIGN.md`): orange, white text by day, dark text at night.
- Never edit these files: `split.mjs` deletes and rewrites this folder every time.

Each part looks exactly as it does in the showcase because:

- `base.css` holds every style rule, in showcase order. Each rule starts with `/*@NNNN*/`, its place in the showcase.
- Scripts keep their showcase order (`data-slot`). Older parts share one script; `lib/closure-*.js` holds its start and end.
- `skeleton.html` is the page shell: the sidebar, top bar, Options sheet and fonts.

## The parts

| File | Group | What it shows | Needs |
|---|---|---|---|
| `hero` | hero | Hero |  |
| `c01` | Charts and numbers | Server traffic, live. | pair:c01,c02 |
| `c02` | Charts and numbers | Revenue, day by day. | pair:c01,c02 |
| `c03` | Charts and numbers | Sign-ups by channel, month by month. |  |
| `n06` | Charts and numbers | Three numbers that count up and can be scrubbed. |  |
| `n07` | Charts and numbers | A live count where each digit rolls on its own. |  |
| `n03` | Charts and numbers | Where the month's money went, in one ring. |  |
| `n01` | Dates | Pick your nights, see the price as you go. |  |
| `c15` | Tables and lists | Customers, in one table. |  |
| `n37` | Tables and lists | Sort, and rows glide to their place. |  |
| `n48` | Tables and lists | Pages with a pill that slides to your page. |  |
| `c16` | Tables and lists | Open an account to see its history. |  |
| `n20` | Tables and lists | Search pages with a marker that slides. |  |
| `c18` | Tables and lists | Pick files, act on all at once. |  |
| `c19` | Tables and lists | Clear a busy inbox in one go. |  |
| `c20` | Tables and lists | Delete a notice, and it turns to dust. |  |
| `c17` | Tables and lists | Three plans, side by side. |  |
| `c10` | Forms and inputs | Three steps, one line that fills. |  |
| `c11` | Forms and inputs | Sign in, and see what went wrong. |  |
| `n30` | Forms and inputs | Wrong fields shake. Right ones get a tick. |  |
| `n11` | Forms and inputs | A sign-up form that grades your password. |  |
| `n10` | Forms and inputs | A six-digit code, checked as you finish. |  |
| `n09` | Forms and inputs | A long list, found by typing. |  |
| `n14` | Forms and inputs | Settings that respond to a touch. |  |
| `n31` | Forms and inputs | Switches that spring when you flip them. |  |
| `n43` | Forms and inputs | Pick one, and see what it means. |  |
| `n44` | Forms and inputs | Slide, and the number counts to it. |  |
| `n45` | Forms and inputs | Tags that suggest as you type. |  |
| `n46` | Forms and inputs | Filter chips that add up as you tap. |  |
| `n39` | Forms and inputs | A window that settles into place. |  |
| `n41` | Forms and inputs | A side sheet whose lines arrive in turn. |  |
| `c12` | Forms and inputs | Upload files, and watch each one. |  |
| `c13` | Forms and inputs | A secret key, shown only when asked. |  |
| `n15` | Forms and inputs | One button, a choice beside it. |  |
| `c14` | Forms and inputs | One big button for the last step. |  |
| `n29` | Forms and inputs | Pay, and see it go through. |  |
| `c05` | Getting around | A site menu, with a second row. |  |
| `c06` | Getting around | Pick a group, then the thing you want. |  |
| `n17` | Getting around | Settings tabs with a marker that glides. |  |
| `n18` | Getting around | Shop answers that open without a jump. |  |
| `n35` | Getting around | Answers that spring open, one at a time. |  |
| `n19` | Getting around | A long file path that folds itself to fit. |  |
| `n12` | Getting around | Every action, one search away. |  |
| `n36` | Getting around | A command box that springs in. |  |
| `n32` | Getting around | A menu that pops on a spring. |  |
| `n33` | Getting around | Actions that bloom around one button. |  |
| `n34` | Getting around | One tooltip that slides between buttons. |  |
| `c07` | Getting around | A guide, with a line that follows you. |  |
| `c08` | Getting around | A dock that grows under your finger. |  |
| `c09` | Getting around | A profile pill that opens up. |  |
| `n21` | Status and news | Notices that close without a jump. |  |
| `n42` | Status and news | A warning that checks again by itself. |  |
| `c21` | Status and news | Small news, then it leaves. |  |
| `n22` | Status and news | Archive a message and change your mind. |  |
| `n25` | Status and news | A bell that swings and counts up. |  |
| `n23` | Status and news | Grey shapes that hold the place of the news. |  |
| `n38` | Status and news | Grey blocks that sweep while you wait. |  |
| `n47` | Status and news | A bar that springs to the end. |  |
| `c22` | Status and news | A payment that says where it is. |  |
| `c23` | Status and news | A café receipt, printed slowly. |  |
| `c24` | Status and news | A deploy, step by step. |  |
| `n24` | Status and news | Team faces that lift and say hello. |  |
| `n08` | AI helpers | Watch a helper fix a failing test. |  |
| `n16` | AI helpers | An answer that writes itself in. |  |
| `c25` | Cards you can pick up | Point at a name to peek. |  |
| `n40` | Cards you can pick up | Open a name, see the trend. |  |
| `c26` | Cards you can pick up | Cards that lean toward you. |  |
| `c27` | Cards you can pick up | A folder of files, fanning out. |  |
| `n26` | Cards you can pick up | Each step takes the whole space. |  |
| `n27` | Cards you can pick up | Steps that pile up, so you see how far you are. |  |
| `n28` | Cards you can pick up | Covered steps settle back. |  |
| `c31` | Cards you can pick up | A stack of photos, turning as you scroll. |  |
| `c04` | Backgrounds | Dots that step aside. |  |
| `c29` | Backgrounds | Click the field, watch it ripple. |  |
| `c30` | Backgrounds | A wall of photos, sliding as you scroll. |  |
| `why` | pattern | Three cards, one problem each. |  |
| `goals` | pattern | Four goals, each with a test. |  |
| `numbers` | pattern | The numbers that matter most. |  |
| `layers` | pattern | Any app, as four layers stacked. |  |
| `journey` | pattern | A photo's trip, in four steps. |  |
| `delivery` | pattern | One food order, in nine steps. |  |
| `data` | pattern | Two kinds of data, kept in two places. |  |
| `states` | pattern | Every alert is always in one state. |  |
| `stack` | pattern | Boring tools, used well. | hairline |
| `code` | pattern | See what changed, at a glance. |  |
| `repo` | pattern | Where everything lives. |  |
| `endcard` | end | End card |  |
| `footer` | footer | Footer |  |
