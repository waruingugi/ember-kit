# Showing code and terminals

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

Code always sits on the dark plate. It is the one place the page goes
dark. There are three kinds of block, and each has one job.

**The tokens** (on the plate only):

| Token | Value | Used for |
|---|---|---|
| `--plate` | `#0f1216` | The block's body |
| `--plate-raised` | `#161a1f` | The tab bar |
| `--plate-line` | `rgba(255,255,255,.12)` | Rules between the tab bar, the file bar and the code |
| `--plate-text` / `--plate-dim` | `#dfe5ea` / `#79848d` | Code text / line numbers, comments in bars |
| `--syn-k` `--syn-s` `--syn-f` `--syn-t` `--syn-n` `--syn-c` `--syn-p` | `#ff9b6b` `#a8dcb6` `#f2d58c` `#8fc8ff` `#e9b0ff` `#6c7882` `#c9d3db` | Keyword, string, function, type, number, comment (italic), property |
| `--diff-add` `--diff-del` `--diff-mod` `--diff-ren` | `#3fb950` `#f85149` `#d29922` `#58a6ff` | Added, deleted, edited, moved |

Syntax classes are short (`.k`, `.s`, `.f`, `.t`, `.n`, `.c`, `.p`), so
always scope them under `pre` (`pre .k { … }`). Otherwise they clash with
the page's own classes.

## 1. The code window: "here is the code"

How it looks:
- **A tab bar:** three dim dots, then one tab per file with a small status
  letter (`A` in green for a new file) and its name. The chosen tab is an
  editor tab: white text on a sheet of plate joined to the code under it
  (no line between them, a 1 px line on its sides and top, 8 px top
  corners). When you switch, the sheet glides to the new tab on the snappy
  spring. Only `transform` moves: two rounded ends slide and the middle
  stretches with `scaleX` (`placeSheet` in the showcase). With motion `off`
  it jumps; without the script it sits on the tab. No colour, never an
  orange underline. Name its classes `tab-sheet`, `ts-l`, `ts-m`, `ts-r`:
  `.sheet` is taken by the side sheet. The tabs work with the arrow keys
  (`role="tablist"`, `role="tab"`, `aria-selected`, roving `tabindex`).
- **A file bar** under the tabs: the kind (`New`), the path, then either an
  `Our proposal` pill or the plan section it comes from, then `+n` lines,
  then a **Copy** button.
- **The code:** one `<span class="ln" data-n="…">` per line, so the line
  number comes from CSS (`::before { content: attr(data-n) }`, not
  selectable). Lines that matter get `.hl`: a faint orange wash and a 2 px
  orange bar on the left. Use `hl` for the two or three lines the text
  talks about.
- **The highlighting is done before the page ships**: the code is plain
  HTML with `<span>`s already in it (copy them from section 19 of the
  showcase). Never load a highlighting library.
- **Copy** copies the lines' text without the numbers, then shows a toast
  ("Copied create-order.http"). Call `navigator.clipboard.writeText` inside
  the click, and fall back to selecting the text if it is refused.
- Lines never wrap. A long line scrolls inside the block, never the page.
  Font: JetBrains Mono 13.5 px, line height 1.75.
- Keep a sample short: about 20 lines. Show the part the text talks about,
  not the whole file.

## 2. The diff window: "here is what changed"

A working copy is section 19, *Code changes*, in `components/showcase/index.html` (`#code`,
`.code-win`):
- **Tabs** carry a status letter in a small tinted square: `A` new (green),
  `M` edited (amber), `D` deleted (red, and the file name struck through),
  `R` moved (blue). The chosen tab is the gliding editor tab from section 1.
- **A file bar** gives the kind in words (`New file`, `Edited`, `Deleted`,
  `Moved`), the path (`old → new` for a move, struck through for a
  delete), then `+n −n` and five little blocks that show the size of the
  change in green and red.
- **Every line** is a grid of four: old line number, new line number, a
  `+` or `−` mark, then the code. Added lines get a 12% green wash and a
  2 px green bar. Deleted lines get the same in red, with the text a little
  faded. `@@` hunk lines are blue.
- **Copy** copies the new version of the file. On a deleted file it says
  there is nothing to copy.
- Switching tabs fades the panel in over 0.45 s while the sheet glides (none with motion off).
- **A diff legend** beside it: the four status letters in 22 px tiles, each
  with one plain sentence ("Added: a new file").

## 3. The terminal: "type this"

The same plate and tab bar, with one tab named `terminal` (the sheet sits on it and never moves).
- Each command starts with an orange `$ ` (`.prompt`, not selectable, so
  Copy and select give only the command).
- Long commands break with ` \` and an indent.
- A comment line above the command says why, in plain words.
- The result line starts with a green `✓` (`.ok`, `--syn-s`).
- Copy copies only the command.

**Which one when:** show code with the code window, a change with the diff
window, and a command to run with the terminal. Do not put a command in a
code window, or code in a terminal.

**Prompt to rebuild any of them:**
> Show `<code / change / command>` as a `<code window / diff window /
> terminal>` on the dark plate, as described under *Showing code and
> terminals* in `~/.claude/design/DESIGN.md`. Copy the markup and styles
> from section 19 of `~/.claude/design/components/showcase/index.html`. Keep it under about 20 lines,
> highlight the lines the text talks about, and give it a working Copy
> button.
