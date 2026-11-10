# Smooth motion

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

**When to read it.** Before you build or change any part that opens, closes, swaps its words,
moves between steps or choices, or loads with GSAP. Every rule here came from a fix the owner
asked for on 2026-11-10, when parts felt rough: they jumped, blinked, snapped or played twice.
Each rule says what we saw, why it happened, and what to do instead. The part named in it is the
working example to copy.

**The big idea.** The eye notices the *first* frame and the *last* frame most. A motion feels
smooth when nothing jumps at the start, nothing snaps at the end, and nothing is ever empty in
between. Most of the bugs below were one bad frame.

## Opening and closing

1. **Change only what changed.** The Customers table (`c15`) rebuilt the whole table on every
   click, so a row's details appeared in one frame and vanished in one frame. Open and close the
   one row in place, and keep a full redraw for sorting and filtering.
2. **Opening that pushes content down settles with no bounce.** Use `--sp-soft`. A bounce here
   makes everything under it wobble. The owner turned the bounce off on `c15`. Small things
   that push nothing (a tick, a dot) may still spring.
3. **Closing is not opening played backwards.** Close on `--ease-in-out` in about 0.3 s: a slow
   start the eye can catch, and a soft landing. Never close on a spring or on a fast-start curve
   like `--ease-out`, which snaps shut. Fade the words out in the first half (`offset: .45`), so
   the folding edge never cuts through text. Examples: `c15`, `n42`.
4. **Everything that takes space must move with the height.** If only the height animates,
   whatever is left jumps:
   - **Padding.** `c15` jumped to 30 px tall on its first frame, because the padding was
     there from the start. That felt like a car starter. Animate `paddingTop` and
     `paddingBottom` with the height, and set `box-sizing: border-box` so the height you
     measure is the height you animate.
   - **The gap.** In `n42` the 10 px grid `gap` snapped shut when the notice was removed. A grid
     item can't shrink below zero height, so a negative margin can't eat the gap either. Use
     `> * + * { margin-top: 10px; }` in place of `gap`, and animate that `marginTop` to 0
     with the height.
   - `fold()` and `unfold()` in `n80` are the house helpers for height, padding and margin together.
5. **Measure only once the content is final.** `n42` measured a notice, then wrote its countdown
   ("Checking again in 8 s"). On a phone that text wrapped onto a second line, and the notice
   jumped 31 px at the end. Write every word first, then measure, then animate.
6. **Something that appears at the end must not change any size.** When the last notice in
   `n42` closed, the "Show the notices again" button appeared in a row shorter than the button,
   and everything jumped 8 px. Give the row the button's height from the start (`min-height`).

## Changing words in one place

7. **Fade, then write.** Copy the pay button (`n63`). The old words fade where they are
   (0.16 s, a slight blur). The new words rise in letter by letter: each letter comes up 7 px
   from a 3 px blur, 14 ms after the one before, on `--ease-out`. Things the owner turned down
   on `n60`:
   - **The blink.** The old words left before the new ones came. For one frame the surface was
     empty, and the eye saw a flash.
   - **The pile-up.** Two lines fading over each other on the same spot.
   - **The roll.** The old line lifting out while the new one rose in. The owner said it was "too much".
8. **Wrap the letters.** If the letters are direct children of a flex button with a `gap`, the gap
   spreads them apart while they move. Put the letter spans inside one plain span. Give that
   span `role="text"` and an `aria-label`, so a screen reader hears the words and not single letters.
9. **Pieces arrive in reading order.** Start each piece about 42 ms (3 letters) after the one
   before it, and let a button's background fade in with its own letters. Otherwise a solid
   orange block appears before its word does (`n60`).
10. **Words live under the surface's edge.** When a surface grows (`n60`, `n62`), clip the words
    with the same edge, using `clip-path` on the same curve. They are then revealed as the
    surface grows, and never show outside it.

11. **Words never fly across another surface.** `n73` used to fly its new dates from the panel's
    footer into the button. On the way they floated over the calendar, outside both, then shot into
    the button. The owner said they "zap in". A value that ends up in a control arrives *in the
    control*:
    - While the panel is open, hide the control's old words (fade 0.15 s), so nothing stale
      shows behind the panel.
    - When the panel closes, the final words arrive in place, as the panel folds back (about 180 ms
      in). That's the new value after Apply, and the old one after Cancel, Escape or a click
      outside. The control is never left blank.
    - Use n71's caption motion: slide 6 px from the side the value moved (later = from below,
      earlier = from above) and fade in, 0.32 s, `--ease-out`, no blur. A second piece (the
      day count) comes 60 ms later.
12. **Pick the reference by what the text is.** A single picked word in a field (an area name)
    rises like `n59`. A line that describes a range or a period ("Monday 2 to Thursday 5
    November") slides in like `n71`'s caption. A word swap inside a button (Pay → Paid, Remove
    → Remove it for good?) writes in letter by letter like `n63`. On `n73` the owner tried
    `n59`'s rise first: it was "too fast", and slowing it down still wasn't right. The `n71`
    caption was. When the owner names a reference, copy its exact timing. Never invent new numbers.

## Moving between steps and choices

13. **Never fly a squashed copy of a card.** `n80` used to shrink a copy of the finished card into
    its dot, squeezing its text. The new card arrived under it at the same time. Slide the new
    content 24 px in from the side the reader is heading, and glide the box to its new height.
    Copy the steps form (`n79`).
14. **A frame that moves between choices stretches.** Each edge rides its own spring. The edge
    on the side it moves toward leads (snappy), and the back edge catches up (soft). The words
    in the box below roll toward the side you moved. Copy `n99` (also in `n43`).
15. **A live dot drifts, it does not blink.** For the step in progress, use an orange ring with a dot inside, and
    a thin ring that grows out and fades to nothing (`n84`, also `n41`). A glow that swells and
    then snaps back to start again reads as a blink.

## Loading the page

16. **GSAP can arrive late.** On a first visit GSAP still has to download. By then the page's own
    reveal may be fading blocks in. GSAP then hid them and played their entrance again, so every
    block appeared twice. Before adding `gsap-on`, list every `[data-reveal]` whose opacity is
    already above 0, mark it `gs-done`, and leave it to finish. The test is "can you see it",
    not "is it marked `is-in`": `is-in` is set a moment before anything shows, and testing for it
    made fast loads lose their entrance. The fix is `seen` in the showcase's GSAP layer. The
    trap is also in `tools/gsap.md`.

## Code traps we hit

17. **Two parts can share code.** `n80` and `n81` hold the same functions. A find-and-replace on
    the showcase matched both, and the edit stopped. Make each replace match exactly once, and
    only inside the part's own script: cut the text from its `getElementById("nXX")` to the next
    part's.
18. **Look inside the right list.** In `n41`, `$(".n", sheet)` found another element named `.n`
    before the step list, so "Mark delivered" crashed and the sheet never closed. Look inside the
    list itself: `$(".sp .n", sheet)`.

## How to prove it is smooth

Never trust your eyes on one fast run. Measure, then look. Work on a copy of the kit, as the
`components/parts/README.md` says, and show the owner that one part on its own, old next to new:
`node scripts/assemble.mjs n42 -o <scratch>/n42-new.html --parts <copy>/components/parts`.

- **Track the thing below.** Log, on every frame, where the content under the moving part sits,
  measured from its parent (`el.getBoundingClientRect().top - parent.getBoundingClientRect().top`).
  Never measure from the window: the browser keeps scrolled content still (scroll anchoring),
  so a real jump can read as 0. Read the numbers: a smooth close looks like `281 278 264 226 207
  200 198 198`. A snap looks like `208 208 198`, and a hold looks like `280 280 280 280 264`.
- **Slow it down and look.** Use Playwright and the DevTools protocol:
  `cdp.send("Animation.setPlaybackRate", { playbackRate: 0.1 })`, then take screenshots every
  400 ms. One empty or muddled frame is the flash the owner sees. The slow-down only affects
  animations: a `setTimeout` in the part still runs at full speed. So if the part uses timers
  (`n73` closes with one), record at real speed instead with `Page.startScreencast` and look at
  the frames one by one.
- **Load it the first-visit way.** Hold GSAP back with
  `page.route(/jsdelivr/, r => setTimeout(() => r.continue(), 1500))` and log each block's opacity
  on every frame. A block may only go up, never back to 0. Try 0, 600, 1500 and 3000 ms.
- **The rest of the checks.** Run each at 1440 px and 390 px, with motion on, with motion off
  (`localStorage['ds-showcase-v4'] = '{"motion":"off"}'` before load), and with GSAP blocked.
  Try fast double clicks. Check that the console has no errors. Then
  `node scripts/singles.mjs --ids <parts>` must still match.
