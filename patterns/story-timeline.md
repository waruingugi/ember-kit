# The story timeline (showcase section 15)

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

**What it is.** One order told as a story, step by step, down a vertical
line. Cards alternate left and right of the line. Each has who acts (in
orange mono), a clock time on the right, a Fraunces title and two plain
lines. As you scroll, the line fills orange from the top, a small orange
dot runs down it, and each step's dot fills when the line reaches it. A
small dashed pill next to the heading says "times are an example".

**Why it works.** The state machine shows every path. The story shows one
real path, in order, with times, so the reader feels how fast it goes.
Scrolling is the clock.

**How it is built** (copy section `#delivery` of the showcase: classes `.flow`, `.flow-spine`, `.flow-runner`, `.flow-step`):
- **The markup:** `<div class="flow" id="flow">` holds a
  `.spine` with an `<i>` fill, a `.runner` dot, then one `.step` per beat.
  A step is a `.dot` plus a `.card` with `.who` (actor, then `<span>` time),
  an `<h3>` and a `<p>`.
- **The layout:** the line runs down the middle (2 px, `--line-hi`). A step
  is a three-column grid, `1fr 56px 1fr`. Odd steps put the card left, even
  steps right. The runner is a 12 px orange dot with a soft orange ring.
- **One number drives it.** `renderFlow(p)`, with `p` from 0 to 1, sets the
  fill to `scaleY(p)`, moves the runner to `p · (height − 12)`, and gives
  each step `.reached` once the line passes its dot. A reached dot turns
  solid orange.
- **With GSAP:** `p` is scrubbed from `top 55%` to `bottom 55%` with
  `scrub: 0.6`. Each card is tied to the scroll (one scrubbed timeline per
  card, `top bottom` to `bottom top`, `scrub: 0.5`): it fades in from 0 and
  comes 60 px from its own side and 40 px up, from 94% size and tilted
  1.5° away from the line, settling flat as it rises (`power3.out`), stays fully clear
  through the middle of the screen, then dims to 0.3 and drifts 16 px up as it
  leaves the top. It never fades out fully, so a passed step can still be
  read. Calm motion halves the distances and the tilt. (the owner, 2026-10-30: "a tad stronger".) Each dot pops in with
  `back.out(3)` at `top 60%`.
- **Without GSAP:** the same `p` from plain scroll maths. The runner is
  hidden.
- **With motion off:** `p = 1`. The whole line is filled and every step is
  reached.
- **On a phone:** the line moves to the left edge, and every card sits on
  its right.

**Prompt to rebuild it:**
> Tell one real `<thing>` as a story timeline: 6 to 10 steps, each with
> who acts, an example clock time, a short title and two plain sentences.
> Mark the times "times are an example" with a dashed pill. Build it as
> the `.flow` scene in section 15 of `~/.claude/design/components/showcase/index.html`:
> a centre line that fills orange as you scroll, a runner dot, cards
> alternating sides, dots that fill when reached, GSAP scrub 0.6, and a
> plain-scroll fallback.
