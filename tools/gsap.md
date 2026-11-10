# GSAP

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

GSAP plus its ScrollTrigger plugin is the motion layer. Every plugin is
free under GSAP's "Standard no-charge" license
(https://gsap.com/standard-license). Load these two exact files:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js" integrity="sha384-XmJ9SoHtVOHoQUcKvFAzVXwdkKo1Ie3bhmSoIAkcdsHGaIrVJIkmozyq0FJeb/Ly" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js" integrity="sha384-wl5TeDVvOWt30Pbf8aSo2ZrzsOjddu3avOBvHe+p+OhJt9gP6w9YXmDkN5DK2/dF" crossorigin="anonymous"></script>
```

Those two hashes were worked out from the real files on 2026-10-08. They
matched the hashes in the source spec. The npm package `gsap@3.15.0` has
no install scripts.

**GSAP is an upgrade, not a need.** The page must work with GSAP missing.
Write the CSS reveal first. Then the GSAP code checks for itself and steps
back if anything is wrong:

```js
(function () {
  if (!window.gsap || !window.ScrollTrigger || !motionOn()) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('gsap-on');
  // ... entrances and scroll scenes go here
})();
```

`motionOn()` returns `false` for `off` and for reduced motion. Use
`gsap.matchMedia()` to change things by screen width or by reduced motion.
It cleans up its own animations when a condition stops matching.
Group reveals with `ScrollTrigger.batch(items, { start: 'top 90%', once: true, onEnter })`,
so what arrives together enters together.

**Traps:**
- Never let a CSS transition and GSAP move the same property. It jitters.
  Add `html.gsap-on [data-reveal] { transition: none !important; }`, then
  `clearProps` once GSAP is done.
- Never hand GSAP an empty list. It prints a console warning.
- GSAP can arrive late, on a first visit when it still has to download. By then the
  page's own reveal may already be fading blocks in. Before adding `gsap-on`, note every
  `[data-reveal]` you can already see (opacity above 0) and leave it to finish. Otherwise it
  vanishes and enters a second time. The showcase does this (`seen` in its GSAP layer).
- Never use Lenis or any other library that takes over scrolling. It fights
  the iframes and the page jumps.
- Never animate inside an Archify diagram. Animate its frame instead.
