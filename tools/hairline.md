# Hairline figures

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

Hairline draws small line pictures of real objects that react to the
mouse, like a cabinet for a database or a padlock for auth. **Claude may
make new ones whenever a card or an idea would be clearer with one.** Save
every figure you make, so it can be reused and improved later.

**The figure library** is `~/.claude/design/hairline/`:
- `figures/<name>.js` holds each figure's source.
- `README.md` lists every figure: what object it is, what idea it stands
  for, what the mouse does, which pages use it, and a short log of each
  improvement.

Before making a new figure, check the library. Reuse or improve one that
fits. When you improve a figure, keep its name, write the change in its log
line, and rebuild the pages that use it.

**The tool.** `hairline-create` comes from
https://github.com/lucasmarkes/hairline (MIT), pinned to commit
`37d2e78dcb333ab30c3338e28ed4a690364ea014` (release 0.5.1; the kernel's own
hash is `346b48bd…`). The pin moved from `a221785` on 2026-10-29, after a
check: the kernel changed one line (each frame reads `performance.now()`),
and the new `read.mjs` turns an SVG someone brings into a card and a picture
without running its scripts or fetching anything. All five figures in
`hairline/` and both examples pass `validate.mjs`; `look.mjs` on the watch
shows no console errors. The same repo now has a second skill,
`hairline-adopt` (an SVG goes to `hairline-create`'s new step 0); it is not
installed, because `hairline-create` reads an `.svg` on its own. It is installed
as a global skill in `~/.claude/skills/hairline-create/` (2026-10-09), so
`/hairline-create` works in every project. Read its `SKILL.md`,
`rules.md`, `concepts.md` and `look.md` before the first figure in a
session.

**How it was installed.** It is a copy of the pinned clone in
`~/tools/hairline`, made with a plain file copy. We did not use
`npx skills add https://github.com/lucasmarkes/hairline --skill hairline-create`,
because that fetches whatever is newest instead of the pinned commit. To
move the pin: `git -C ~/tools/hairline fetch`, read what changed, check out
the new commit, then copy `skills/hairline-create/` over the installed
skill again.

```bash
HL=~/.claude/skills/hairline-create
node $HL/build.mjs <name>.js
node $HL/validate.mjs hairline-<name>.html   # must print ok
```

**Every figure declares a tour** (new in this pin). The last line of the
figure is `hairline({ name, means, rules, range, tour, mount })`. `tour` is
3 to 6 points in the figure's 400 × 320 frame, ending with `null`. When
the page plays the figure (a Play button, or `?play=1`), an unseen
pointer walks those stops, so a stranger sees the figure answer with no
hand on it. A real hand takes over at once.
- Pick stops on different parts, in the order a hand would reach them. A
  lap is a sentence, not a list of every part: three stops that each
  show a different answer, then `null` to go back to rest.
- The figure never plays itself. Only the page and the package do.
- Our tours: the watch goes movement, dial, glass. The movement goes
  barrel (the power), escape wheel (the beat), balance (the pace). The
  cabinet zigzags across three drawers. The mail rack runs a diagonal.
- To find good stops, sweep the frame with pointer moves and note which
  part the read-out names where. Take the middle of each part's area.

`look.mjs` installs `playwright-core` the first time it runs. Skip it and
do the look checks with the Playwright MCP instead: at rest, with the mouse
over a part, at 240 px wide, and with no console errors.

**Keep figures small, inside cards** (the owner, 2026-10-09). A Hairline
figure is a small drawing at the top of a card, never a big stage of its
own. Use the figure card from `patterns/figure-cards.md`: `.card.tcard`,
then `<div class="fig" data-hairline="…">` at 70% of the card's width and
at most 210 px wide, then a system chip, a title and two lines. No dot
canvas box and no read-out badge around it. The only exception is a
staged explode on its own study page.

**How a figure should feel.** One object you could put on a desk, and one
idea. Not a diagram and not an icon. No words inside the figure. Its parts
are solid plates painted back to front, so nothing shows through. The only
highlight is a line turning orange. Its lines take their colours from the
page:

```css
--hairline-plate: var(--paper-raised);  --hairline-hi: var(--accent);
--hairline-edge: var(--ink);            --hairline-mid: var(--muted);
--hairline-lo: rgba(21,24,27,.18);      --hairline-stroke: 0.9;
```

**Staged explode.** To show something complex, take it apart in stages.
The study at https://claude.ai/artifact/CPUTrvHqkcTidGkGY9355G is the
working example (figures `watch`, `movement` and `cabinet` in the library).
The owner called it "very good" on 2026-10-08.
- **Stage one is the overview.** A few chunky layers that come apart, with
  one layer bright at rest. Motion stays calmer here than in later stages.
- **Stage two picks one layer and does it again.** Its parts come apart
  too, and each part has its own motion. Here the page animates much more.
- **No dashed guide lines in a layered explode.** the owner said so on
  2026-10-08: the layers alone read well. Do not draw guides between layers
  or up the parts' axles. (The stock phone has them. We take its calm,
  chunky look, not its lines.)
- **Every part moves the way it really would.** Do not send everything
  straight up. A part may lift up, drop down, slide left to right or right
  to left, or go off on a diagonal, whichever shows it best. A part that
  turns in real life also rotates as it comes out: a wheel about its axle, a
  lever about its pivot, a crown as it unscrews. Mixing directions also
  stops big parts from hiding small ones.
- **Spin while moving, land square.** A part's turn is
  `SPIN · (i + 1) · 4e(1 − e)`, where `e` is how far open it is. It peaks
  halfway and is zero when shut and when fully open, so the open view still
  reads correctly (the hands still tell the real time).
- **One number drives linked motion.** When parts move together (a
  balance, a fork, an escape wheel), derive every angle from one phase
  value, so they can never drift apart.
- **Real motion beats show motion.** the owner liked that the watch kept the
  real time, the escapement really worked, and nothing moved only for show.
- **The page's scroll drives each stage.** Each stage is its own pinned
  scene (explainer pages only), calling the figure's `set(e)`. A list next
  to it lights each part as it frees itself, and the frame's corner names
  the part under the pointer.
- **One figure per stage.** A figure must stay under 200 lines, so each
  stage is its own figure, joined by the page.

**Lessons from building them** (2026-10-08):
- Big discs hide small parts behind them. Spread the parts in different
  directions, or show fewer, bigger parts.
- Fit the camera to the real outer edges of the most open pose, plus the
  pointer's lift. A loose box leaves the figure small and off-centre.
- A bright part must swap `sil` for `hi`. With both classes on, `sil` wins
  and the part stays ink.
- Start a figure's "chosen" value at something no state uses (like `-9`).
  If it starts at the rest value, the first `setActive(rest)` returns early
  and the rest highlight never shows.
- Test the pointer against each part's resting plane, never where it is
  drawn this frame. For a part on an upright face (a drawer front), invert
  the camera on that face's plane once, and test against that.
- When parts move in front of each other (drawers sliding out), move their
  groups in the paint order, furthest out last. Never redraw to reorder.
- Check every figure at rest, fully open with the pointer's lift, and at
  phone width, before calling it done.

**What the owner liked in the study:** the layered explode, the two stages
(overview, then one layer taken apart), the cabinet's micro-animations
(a drawer slides out, its neighbours follow, spare wheels pop up and
turn), the Antonio numbers, the one orange part at rest, and the read-out
naming each part.

**Ready-made figures** are the npm package `@lucasmarkes/hairline@0.5.1`
(moved from 0.3.0 on 2026-10-09, and from 0.5.0 on 2026-10-29: the only
code change is the same one-line clock fix as the kernel). It has 33 figures, six more than
before: `hub`, `relay`, `settle`, `format`, `rebuild` and `stack`. Each
mount also takes a `play` option, which walks the figure's own tour. Its
`dist/index.js` has sha256
`16fdfec136dc99cf3f65730989364797f0bbb228b7bca60c4d422e0e12ce3b7d`. It has
no install scripts. A search found no `fetch`, `eval`, `localStorage` or
cookie use. Eight figures were mounted in our colours with no console
errors.

It is an ES module, so a page needs a plain-script copy: wrap the file in a
function and turn its last `export { … }` into `window.Hairline = { … }`.
Both are vendored in `~/.claude/design/vendor/`: `hairline-0.5.1.js` (the
original) and `hairline-0.5.1.global.js` (sha256 `a1942f7d…`, the one a
page loads; made by applying the same one-line fix to the 0.5.0 plain copy,
and it loads all 33 figures).

**Keep an eye on it.** Its first release was 1 Oct 2026, and one person
maintains it. Re-check every update before moving the pin.
