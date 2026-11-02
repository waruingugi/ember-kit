# The folder views (showcase section 20)

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

**What it is.** Two views of the same repo, one above the other, each for
its own job.
- **Row 1, the Explorer: the whole repo.** A dark plate (`--plate`), mono
  text. Each folder is a button with a turning chevron and an orange folder
  mark. Each file has a short comment in dim text saying what it holds.
  Folders open and close with a smooth height animation.
- **Row 2, the Columns: walk into one module.** Three panes side by side,
  like a Mac Finder in column view, and a fourth pane that explains
  whatever is chosen in plain words. The chosen item in each pane is
  filled orange. It opens already walked in (`orders › services ›
  cancel_order.py`), so the first view shows what it does.
- Under them, an orange-edged callout states the rule that holds the shape
  together ("Other modules may import only …"), then a "Done looks like"
  box.

**Why it works.** The Explorer answers "what is in here?" and the Columns
answer "what does this one thing do?". Every file carries its reason, so
nobody has to guess.

**How it is built** (a working copy is section 20, *Folder views*, in
`components/showcase/index.html`, `#repo`):
- **The data** is a nested tree in section `#repo` of the showcase: `TREE` for the Explorer
  (name, comment, children, and which folders start open) and `COLS` for
  the Columns (each entry has `children` and a `note`). `tree_html()` turns
  `TREE` into nested `<ul>`s. `COLS` goes into the page as `window.__COLS`.
- **The Explorer markup:** a folder is `<button class="row" aria-expanded
  aria-controls="tkN">` with `.chev`, `.fi` (folder mark), `.nm` (name) and
  `.cm` (comment), followed by `<ul class="kids" id="tkN" hidden>`. A file
  is a plain `<span class="row">` with `.fl` instead of `.fi`. A
  `.tag` can mark a folder "new" or "removing".
- **The Explorer motion** (section `#repo`): on click, flip
  `aria-expanded`. With GSAP and motion on, close with `height → 0` over
  0.35 s `power2.inOut`, then set `hidden`. Open by clearing `hidden`, then
  `height 0 → auto` over 0.5 s `expo.out`. Clear the height after. The
  chevron turns 90° in CSS over 0.35 s. Without motion, just toggle
  `hidden`.
- **The Columns** (section `#repo`): `renderCols(path)` draws
  three `role="listbox"` panes of `role="option"` buttons, one per depth,
  then a note pane with `aria-live="polite"`. A click cuts the path to that
  depth, adds the choice, redraws, and keeps focus on the same button.
- **The styles** (section `#repo`, `.cols`): the Columns
  grid is `repeat(3, minmax(0,1fr)) minmax(0,1.3fr)`, the note pane is
  `--paper-sunk`, and the chosen option is `--accent` with white text.
  Below 1100 px the Columns become two by two.

**Prompt to rebuild it:**
> Show the folder structure of `<repo>` in two rows. Row 1: an Explorer
> tree of the whole repo on the dark plate, every folder a button that
> opens with a GSAP height animation, every file with a one-line plain
> comment saying what it holds. Row 2: Columns that walk into one module,
> three panes plus a note pane, opened on a real example path. Then a
> callout with the one rule that keeps every module the same shape, and a
> "Done looks like" box. Copy the markup, CSS and JS from section 20 of
> `~/.claude/design/components/showcase/index.html`; keep the data in one
> tree.
