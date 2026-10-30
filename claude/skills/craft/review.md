# Reviewing a page

From interface-design's `design-review`, impeccable's critique and the deslop
pass. Read-only: a review writes findings, not code, unless asked to fix.

## Steps

1. **Scope and intent.** What is this page for, who reads it, what mode (Read, Operate, Persuade, Experience)? Which rules are in force (DESIGN.md, the project theme)?
2. **Look at the whole render first.** Screenshots at 1440 and 390, before reading any code. Squint: where does the eye land? Is that the right place? Is there one focal point, or none, or five?
3. **Six lenses, one at a time:**
   1. *Hierarchy*: one focal point; headings, body and meta clearly apart; space does the grouping. Promoting without demoting isn't hierarchy: mute secondary actions and metadata. At any decision point, at most 4 choices: one main action, one or two secondary, the rest in a menu.
   2. *Type and colour*: the house fonts and tokens only; sizes on the scale; contrast ≥ 4.5:1 for body, 3:1 for large text, in every state (error and stale views dim text; over moving backgrounds, measure the rendered frame); a ghost button over a picture needs a scrim; colour spent where it means something.
   3. *Surfaces*: borders, shadows, fills used on purpose; nothing doing a job space should do; no cards in cards.
   4. *Composition*: layout families varied; alignment true; nothing cramped or floating; good at 390.
   5. *States and motion*: every state exists; each animation has a job; reduced motion works.
   6. *Structure, reuse, content*: house parts reused instead of hand-rolled; copy real, plain, consistent. Find the hacks: negative margins undoing a parent's padding, escape-hatch `calc()`, absolute positioning to dodge layout.
4. **Stress it.** Try a 100-character name, 0 items, 1 item, 1000 items and a long unbroken URL. To see every state at once, add `.is-hover`, `.is-focus` and similar classes to copies of the parts on a test page.
5. **False-positive filter.** Drop a finding if it is only taste; a bold choice that works as meant; out of scope; already settled in DESIGN.md or `house.md`; or a lint nit a scanner would catch anyway.
6. **Write the findings.** Each one: *what defaulted* → *why it costs the reader* → *the crafted fix* (one, specific). Group by severity:
   - **Blocker**: the reader can't do the job, or it breaks DESIGN.md or accessibility. Tiebreak: would someone contact support or give up? Then it's at least Should-fix.
   - **Should-fix**: clearly worse than it should be.
   - **Note**: polish.

Approve only with zero Blockers. Presumed blockers: sideways scroll at 390,
text under 4.5:1, a control the keyboard can't reach, content hidden without
JS, a missing empty or error state on a real data view.

## Optional score

When the owner wants a number: score Nielsen's 10 heuristics 0–4 each (out of
40; drop any that don't apply). 36+ excellent, 28+ good, 20+ acceptable,
12+ poor.

## Deslop pass

When a page "looks AI-made": first the squint (no focal point, flat
hierarchy, same layout repeated, timid colour, borders instead of space),
then scan the changed code for the bans in `rules.md` and for hand-rolled
parts that exist in `~/.claude/design/components/`. Write a Before / After
table. A house pattern from DESIGN.md is never slop.

## Against a reference

When there is a mock or reference picture, compare both in greyscale first
(it shows hierarchy without colour), then rank the differences from cheap and
decisive to expensive and marginal. Fix from the top.
