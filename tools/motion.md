# Motion

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

Motion (motion.dev, formerly Framer Motion, MIT) is the second motion layer,
next to GSAP. Write its code with the `motion` skill.

**Which one?** One library per page, never both.

| Pick | When |
|---|---|
| **Motion** | A React or Next app (`motion/react`). A static page whose motion is small: entrances, hover and press, springs, a scroll progress line. |
| **GSAP** (`tools/gsap.md`) | Timelines, pinned scroll scenes, scrubbed stories, Flip, SplitText, DrawSVG. A page that already uses GSAP. |

## Static pages

Load this exact file. It sets `window.Motion`:

```html
<script src="https://cdn.jsdelivr.net/npm/motion@14.3.0/dist/motion.js" integrity="sha384-JJz0BhlNR1957eKKTU9kYgNBX0pRVhjx04tpsEyYeKKREeVPmFK3cw6ut9tue9l3" crossorigin="anonymous"></script>
```

The hash was worked out from the npm file and matched the jsDelivr file
on 2026-11-01. The npm package `motion@14.3.0` has no install scripts.
14.3.0 was the newest release more than two weeks old that day.

**Motion is an upgrade, not a need.** The page must work with it missing.
Write the CSS reveal first. Then the Motion code checks for itself and
steps back if anything is wrong:

```js
(function () {
  if (!window.Motion || !motionOn()) return;
  const { animate, inView, stagger } = Motion;
  const k = document.documentElement.dataset.motion === 'calm' ? 0.5 : 1;
  const ease = [0.22, 1, 0.36, 1]; // our one curve, --ease-out
  document.documentElement.classList.add('motion-on');

  inView('[data-reveal]', (el) => {
    animate(el, { opacity: [0, 1], y: [24 * k, 0] }, { duration: 1.1 * k, ease });
  }, { amount: 0.4 }); // returning nothing = runs once
})();
```

`motionOn()` returns `false` for `off` and for reduced motion, as on GSAP
pages. Durations are in seconds. Group items that arrive together with
`delay: stagger(0.08)`.

## Springs without a library

The owner's default feel for parts the reader works is a spring that settles
(Taste Lab round 1, `notes/owner-likes.md`). On a static page, make the
springs as CSS `linear()` curves. No library is needed. The three springs
come from easyui's motion tokens:

| Token | Spring (stiffness / damping / mass) | Use it for |
|---|---|---|
| `--sp-snappy` | 380 / 30 / 0.5 | Highlights that glide, switch knobs, markers |
| `--sp-bouncy` | 320 / 17 / 0.7 | Things that open: a menu, modal, accordion, command box |
| `--sp-soft` | 170 / 26 / 0.9 | Large moves: a drawer, a sheet, rows that reorder |

Each one has a matching time, `--sp-*-d`. Use it like this:
`transition: transform var(--sp-bouncy-d) var(--sp-bouncy)`.

```html
<style>
:root { /* fallbacks for old browsers */
  --sp-snappy: cubic-bezier(.34, 1.3, .64, 1); --sp-snappy-d: .32s;
  --sp-bouncy: cubic-bezier(.34, 1.56, .64, 1); --sp-bouncy-d: .5s;
  --sp-soft: cubic-bezier(.22, 1, .36, 1); --sp-soft-d: .45s;
}
html[data-motion="calm"] { --sp-snappy: var(--ease-out); --sp-bouncy: var(--ease-out); --sp-soft: var(--ease-out); }
</style>
<script>
/* Real spring curves as CSS linear(). */
(function () {
  if (!window.CSS || !CSS.supports('transition-timing-function', 'linear(0, 1)')) return;
  function curve(k, c, m) {
    var x = 0, v = 0, dt = 1 / 1000, pts = [0], last = 0;
    for (var i = 1; i < 2500; i++) { var a = (-k * (x - 1) - c * v) / m; v += a * dt; x += v * dt; pts.push(x); if (Math.abs(x - 1) > 0.003 || Math.abs(v) > 0.05) last = i; }
    var end = Math.min(pts.length - 1, last + 10), out = [];
    for (var j = 0; j <= 48; j++) out.push(j === 48 ? '1' : pts[Math.round(j * end / 48)].toFixed(3));
    return { e: 'linear(' + out.join(', ') + ')', d: (end / 1000).toFixed(2) + 's' };
  }
  var s = curve(380, 30, 0.5), b = curve(320, 17, 0.7), g = curve(170, 26, 0.9);
  var st = document.createElement('style');
  st.textContent = ':root{--sp-snappy:' + s.e + ';--sp-snappy-d:' + s.d + ';--sp-bouncy:' + b.e + ';--sp-bouncy-d:' + b.d + ';--sp-soft:' + g.e + ';--sp-soft-d:' + g.d + '}';
  document.head.appendChild(st);
})();
</script>
```

- **Calm** swaps every spring for `--ease-out`, so nothing overshoots.
- **Off** and reduced motion set every time to 0, the same as for all motion.
- **Springs move only `transform` and `opacity`.** A height change (an
  accordion opening) uses the Web Animations API with the spring as its easing.
- **In React**, use Motion's `type: "spring"` with the same three numbers.
- **No script needed:** the showcase writes the three `linear()` curves out in CSS inside `@supports (transition-timing-function: linear(0, 1))`, with the `cubic-bezier` lines as the fallback. Copy that block from `components/parts/base.css` (search `--sp-snappy`).

## React and Next

`npm i motion@14.3.0`, then `import { motion } from "motion/react"`.
Wrap the app once so reduced motion and our curve apply everywhere:

```jsx
<MotionConfig reducedMotion="user" transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
```

Read the motion level the same way and pass `duration: 0` for `off`.

## Traps

- Never let a CSS transition and Motion move the same property. It jitters.
  Add `html.motion-on [data-reveal] { transition: none !important; }`.
- Never load GSAP and Motion on the same page.
- Never use `framer-motion` in new work. Same code, old name.
- Only `transform` and `opacity` move (`x`, `y`, `scale`, `opacity`).
  Never animate `layout` on big blocks; it measures the page every frame.
- Springs are for things the reader drags or throws. Entrances use our curve,
  with no bounce or overshoot.
- Never animate inside an Archify diagram. Animate its frame instead.
