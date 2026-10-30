# Craft rules

Merged from taste-skill, impeccable, ui-ux-pro-max, auteur, genjutsu,
frontend-design, interface-design and the motion skills. Only rules that set
no look were kept. Where a rule clashes with DESIGN.md, DESIGN.md wins
(`house.md` lists the known clashes).

## Layout

- One focal point per screen. Squint test: blur your eyes; one thing should win, and it should be the right thing.
- A layout family (split, bento, full-bleed picture, list, timeline, table) appears once per page. 8 sections need at least 4 families. No third zig-zag in a row.
- Bento: number of cells = number of items. Use `grid-auto-flow: dense` and check no cell is left empty.
- No cards in cards in cards. A card holds content, never another card grid.
- Things that should line up do: card buttons pinned to the bottom, lists start at the same height across columns.
- Text width 65–75 characters for body; never wider than about 80.
- Spacing on a 4/8 px grid. Section gaps scale with the screen: `clamp(3rem, 8vw, 6rem)`.
- Bottom padding a little larger than top; nudge optically (1–2 px) when a shape looks off.
- Concentric corners: inner radius = outer radius − padding.
- Thin dividers: `display:grid; gap:1px` with the parent's colour showing through.
- Wrap the page so animation can never cause sideways scroll (`overflow-x: clip` on the root wrapper).
- Lists over 5 items get grouped or chunked. A spec table needs no border on every row.
- Tables stay tables: sticky head, `tabular-nums`, numbers right-aligned.

## Hero

- Headline at most 2–3 lines at desktop; fix a long one by widening its box, not adding lines.
- Subtext at most about 20 words. At most 4 text pieces in the hero.
- The hero must read on a small laptop (1280×720) without scrolling.
- No trust strip, pricing teaser or tagline crammed under the buttons.

## Type (inside the house fonts)

- Size scale on a ratio (1.2, 1.25 or 1.333). Do hierarchy with weight and colour before size.
- Use weights 500/600, not only 400/700.
- Display letter-spacing no tighter than −0.04em; display at most 6rem.
- Numbers that change use `tabular-nums`.
- `text-wrap: balance` on headings, `pretty` on paragraphs.
- Italic words with descenders in big headings need a little extra line height and bottom padding, or they get clipped.

## Copy

- Re-read every visible string before shipping.
- Name things the way the reader thinks of them, not how the system is built ("notifications", not "webhook config").
- Destructive actions name the thing and what will happen. Prefer Undo to a confirm box; a confirm button repeats the action ("Delete project"), never "OK".
- Quotes: at most 3 lines, a real name and role, curly quote marks.
- Buttons name their result, 3 words at most, and never wrap at desktop. One label per intent: "Contact us" and "Let's talk" on one page is a fail.
- The same verb follows through the flow: Publish → Publishing → Published.
- Errors: what failed, why, how to fix it. No apology, no "Oops!", no internal error codes as the main message.
- Success messages without exclamation marks. Sentence case.
- No invented precise numbers, fake names (John Doe, Acme), fake logos or fake screenshots built from divs.
- Banned filler: "Elevate", "Unlock", "Seamless", "Empower", "Supercharge", "Next-gen", "Quietly trusted by", "Step 1 / 2 / 3" labels on things that are not steps.

## States

Every interactive thing has: default, hover, focus (visible ring), active
(press), disabled, loading. Every list or view has: empty, error.

- Disabled things say why they are disabled. Nav shows where you are.
- Empty states say which empty: first use, no results, filtered to nothing, cleared by the user, no permission, or failed to load. Each gets its own words and next step.
- Loading: a skeleton that matches the final layout, so nothing jumps (CLS < 0.1).
- Theme the browser's own parts: text selection, caret, scrollbars, focus ring, link underline offset.
- One part failing (a chart, a widget) shows its own error; it never blanks the page.
- Tabs and filters live in the URL; Back restores them and the scroll position.
- Numbers, dates and plurals go through `Intl` (`NumberFormat`, `DateTimeFormat`, `PluralRules`).

## Forms and controls

- Native element first, then a headless primitive, then hand-rolled.
- Every input has a visible label; a placeholder is an example, never the label.
- Say the format before submit. Validate on blur, not on every key.
- Error under its field, linked with `aria-describedby`, announced with `role="alert"` or `aria-live`.
- On a failed submit, move focus to a summary at the top that links to each bad field. Keep the inline errors too.
- Touch targets ≥ 44×44 px (extend small ones with a pseudo-element), at least 8 px apart. `touch-action: manipulation`.
- Never colour alone for meaning: add a word or icon.
- Long forms autosave.
- While a submit runs, disable the button and show progress. On error, keep everything the user typed.
- Keyboard and screen-reader order match the visual order. Never reorder with CSS alone.
- Use the right tags for technical data: `<data>`, `<kbd>`, `<samp>`, `<output>`, `<dl>`.
- Placeholder and helper text pass contrast too.
- Things AI forgets: skip link, active nav state, links that go to `#`, a 404 page, legal links on public sites.

## Motion (house values in DESIGN.md *Motion* win)

- Every animation has a one-sentence reason. No reason, no animation.
- Only `transform` and `opacity` move. Never `transition: all`. `will-change` only while moving.
- Never start from `scale(0)`; start near 0.6 with a fade. Press = `scale(0.97)`.
- Popovers grow from their trigger; modals from the centre.
- Exits are shorter than entrances (about 75%).
- Stagger 30–80 ms per item.
- No `addEventListener('scroll')` for effects; use IntersectionObserver or CSS `animation-timeline`. If one is truly needed (a progress bar), throttle it to one run per frame with `requestAnimationFrame`.
- One animation library per element and property. Split wrapper and child if two must move.
- Reduced motion = DESIGN.md's `off` level: the final state, nothing moves (not even fades).
- Leave an effect out rather than ship it broken: no cut-off scroll scenes, no jumpy entrances.
- A new state cancels the running animation and lands on the right final state. Use CSS transitions, not keyframes, for UI that can be retriggered. Test fast repeat clicks.
- Allowed loops (the live dot, the glint, the sparkline shimmer) pause when off screen or when the tab is hidden.
- Hover effects go inside `@media (hover: hover) and (pointer: fine)`, so phones don't get stuck hovers.
- Auto-rotating content gets pause, previous and next, and stops on hover or focus.
- If the project already has an animation library, keep it. Never add a second.
- Complete at rest: nothing readable waits at `opacity: 0`; with JS off, everything shows.
- 3D or WebGL: cap device pixel ratio at 2, render only on change, clean up on leave, still image when `hardwareConcurrency < 4` or reduced motion.

## Scroll scenes

Pick the lightest technique that does the job. GSAP rules: `~/.claude/design/tools/gsap.md`.

| Need | Technique |
|---|---|
| Simple reveals | CSS `animation-timeline: view()`, with a GSAP fallback |
| A process told in steps | A pinned GSAP timeline (explainer pages only; build guides never pin) |
| A product turning, frame-exact | A canvas image sequence |
| Real footage | A scrubbed video with a poster image |
| Continuity between pages | View Transitions |

- Pinning: pin the wrapper, `start: "top top"`, `end: "+=<distance>"`, `invalidateOnRefresh: true`; clean up with `ctx.revert()`.
- Call `ScrollTrigger.refresh()` after late layout (fonts, images). Scrub smoothing 0.3–0.8.
- No dead scroll: every stretch of scrolling changes something. Every element reaches full opacity.
- Every scene has a fallback that shows the final state.
- Keep every scene number in one config, each with a comment saying why.

## Responsive

- Check 390, 768, 1024 and 1440 wide.
- `min-width: 0` on grid and flex children; `minmax(0, 1fr)` columns.
- `100dvh` or `100svh`, never `100vh` or `h-screen`, for full-height parts.
- `overflow: clip` instead of `hidden` near sticky parts (hidden breaks sticky). Sticky children need `align-self: start`.
- A `transform` on a parent breaks `position: fixed` inside it.
- Inputs at least 16 px on phones, or iOS zooms in.
- Never disable zoom (`user-scalable=no`, `maximum-scale`). The page still works at 200% zoom.
- A sticky top bar sets `scroll-padding-top` to its height, so a focused item or an anchor target never hides under it.
- An `overflow-x: auto` wrapper breaks a sticky table head. Check it after a real scroll.
- On phones, drop rotations and negative-margin overlaps; they make touch targets clash.
- Long words and tokens (URLs, IDs) get `overflow-wrap: anywhere`.
- Respect safe areas (`env(safe-area-inset-*)`). Use `isolation: isolate` to contain `z-index`.
- Bottom nav at most 5 items. Lists over about 50 rows get virtualized or paged.

## Depth

Only where DESIGN.md's `patterns/depth.md` gives it a job. Background moves
slower than foreground. Never animate `box-shadow` or `filter`; fade a shadow
layer instead. `backdrop-filter` only on fixed or sticky bars, with a solid fallback under
`prefers-reduced-transparency: reduce`.

## Performance

LCP < 2.5 s, CLS < 0.1, INP < 200 ms, hero video ≤ 2 MB with a poster image.
Reserve space for images, fonts and embeds so nothing jumps. Lazy-load
below the fold. Fullscreen effects cost per pixel, so keep them small.

## The bans (AI-default tells)

Each is a sign a default slipped in. If one is truly right, say why in a comment.

- Gradient text; purple-to-blue gradients; glow shadows.
- Glass cards as decoration.
- A coloured border-left (over 1 px) as the accent on cards or callouts.
- A thin 1 px border plus a wide soft shadow on the same box: pick one.
- Three (or any number of) identical cards with icon, heading, text as the default answer.
- The "hero metric" template: big number, small label, gradient, repeated.
- Numbering (01/02/03) on things that are not a real sequence.
- Decorative status dots, fake build or version labels, weather or locale strips, a "scroll down" cue.
- More than one marquee per page; animation that loops forever for show.
- Emoji as icons. Monospace used only to look technical.
- Hard offset "brutal" shadows, unless that is the house look.
- A small explainer sentence under every heading; poetic section labels ("Field notes"); made-up enterprise words ("orchestration layer"). Custom cursors.
- Placeholder code in a delivery: `// ...`, "for brevity", "the rest follows the same pattern". Count the pieces asked for and deliver all of them. If it can't fit, stop at a clean break and write `[PAUSED — X of Y complete]`.

## CSS traps

- Two classes on one element (`.section` and `.cta`) can silently cancel each other's padding. Check the computed value.
- A `ch` max-width uses the container's font size, not the heading's.
- `inset-inline` written after `left: 50%` resets `left`.
- `line-height` under 1 plus a `clip-path` reveal clips the tops and tails of letters.
- Override width and height together, or neither.
- A focusable control inside an `opacity: 0` parent is a keyboard trap.
