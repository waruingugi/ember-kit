# The figure cards (showcase section 18, Tool cards)

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

**What it is.** A three-column grid of cards (`.grid.g3` of
`.card.tcard.lift`). Each card has a small Hairline figure on top, a
coloured system chip, a Fraunces title, and two lines that name the code
(`for_actor(actor)`, `@capability`, `emit(event)`). Under the grid, a plain
table lists the smaller pieces: what each is and why it pays off.

**Why it works.** Each figure is a real object that does what the idea
does, so the idea sticks:

| Idea | Figure | Why it fits |
|---|---|---|
| Tenancy | `padlock` | It keeps each merchant's data locked away from the others |
| Capabilities | `patch` | A patch panel: each setting is one port you plug in |
| Outbox and event bus | `riffle` | A tray of cards held until the relay takes them |
| Audit | `branches` | A commit graph: every action leaves a trail |
| State machine engine | `elevator` | It moves floor by floor, only between allowed floors |
| Strategy registry | `sieve` | Stacked sieves, each one swappable |

**How it is built:**
- **The figures are ready-made**, from `@lucasmarkes/hairline@0.5.1`. Its
  33 figures are: hub, relay, settle, format, rebuild, stack, riffle, terrain, exploded, phosphor, slow, turntable,
  keyboard, elevator, phone, laptop, terminal, cabinet, branches, vault,
  lockers, loupe, padlock, patch, dish, router, sieve, rail, plug, query,
  drawer, basket and plot. Pick from these first. Make a custom one with
  `hairline-create` only when none fits.
- The package is an ES module, so the page loads the plain-script copy
  `~/.claude/design/vendor/hairline-0.5.1.global.js` (the last
  `export { … }` turned into `window.Hairline = { … }`). Custom figures come
  in a second file, `hairline-custom.js` (kernel, shim, then each figure).
- **The markup** is one empty div per card:
  `<div class="fig" data-hairline="padlock" data-label="A padlock: tenancy keeps …"></div>`.
  The `data-label` is one sentence: the object, then what it means here.
  It becomes the figure's `aria-label`.
- **Mounting** (the showcase script, "Hairline figures"): an `IntersectionObserver`
  with `rootMargin: 200px` mounts each figure just before it scrolls in.
  Stock figures mount with `window.Hairline[name](el, { intensity: 0.6, label })`.
  Custom ones mount through `window.hairlineCustom[name].mount(...)`. If a
  figure throws, the card still reads fine without it.
- **The size:** `.tcard .fig { width: 70%; max-width: 210px; aspect-ratio: 400/320; }`.
- **The colours** come from the `--hairline-*` tokens (see *Hairline
  figures*), so a lit part turns our orange.

**Prompt to rebuild it:**
> For each of these ideas, pick a Hairline figure: a real object that does
> what the idea does. Use the stock list first. Write one `data-label`
> sentence each: "A <object>: <what it means here>." Lay them out as
> `.tcard` cards in a three-column grid, with a system chip, a Fraunces
> title and two lines naming the code. Mount each figure only when its
> card scrolls into view (`tools/hairline.md`). Put the smaller
> pieces in a plain table under the grid.
