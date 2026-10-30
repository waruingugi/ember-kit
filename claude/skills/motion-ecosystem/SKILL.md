---
name: motion-ecosystem
description: Meta-skill that picks and wires the right motion library — Framer Motion, GSAP, Lenis, or Three.js — for a given animation or interaction need in a project, and shows how to combine them safely without conflicts. Also indexes free, ready-made component libraries to borrow from (smooth scroll, immersive/animated blocks, dashboards) instead of building from scratch. Use whenever a task calls for animation, scroll behavior, transitions, 3D, or "make this feel more alive/immersive."
license: MIT
metadata:
  covers:
    - framer-motion
    - gsap
    - lenis
    - three.js
    - component-library-index
---

# Motion Ecosystem

It covers four motion libraries: **Framer Motion**, **GSAP**, **Lenis**, and **Three.js**. Check the project's `package.json` for which ones it already has; never add one it doesn't need. Each is good at a different job. Using the wrong one for a task creates fighting animations, jank, or bloated bundles. This skill decides which library (or combination) to reach for, then shows the standard wiring pattern.

## Step 1 — Route by need

| Need | Library | Why |
|---|---|---|
| React component enter/exit, layout transitions, drag, gestures, hover/tap states | **Framer Motion** | Declarative, React-native, handles React's render cycle and unmount timing correctly. |
| Complex scroll-triggered sequences, pinning, timelines, SVG morphing, animating non-React DOM or canvas, anything outside React | **GSAP** (+ ScrollTrigger plugin) | Framework-agnostic, most powerful timeline control, best raw performance for complex sequencing. |
| Smooth/inertia page scrolling | **Lenis** | Its only job. Do not use it for element animation — it just intercepts and smooths the scroll itself. |
| 3D scenes, WebGL, particles, camera movement, product viewers | **Three.js** | The only one of the four that does 3D. |

Decision rule: pick the single library that owns the *smallest sufficient scope*. Don't add GSAP for something Framer Motion already does declaratively; don't hand-roll 3D in GSAP/CSS when Three.js is the right tool.

## Step 2 — Never let two libraries animate the same property on the same element

The most common bug in a mixed-library setup: Framer Motion and GSAP both trying to drive `transform` on the same node. Pick one owner per element. If a React component needs both a mount transition (Framer Motion) and a scroll-triggered effect (GSAP), split it: Framer Motion owns the wrapper's enter/exit, GSAP targets an inner child that Framer Motion never touches.

## Step 3 — Standard composition patterns

**Lenis + GSAP ScrollTrigger** (smooth scroll driving scroll-triggered animation — the most common combo):
```js
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis()
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```
Without this wiring, Lenis's virtual scroll position and ScrollTrigger's scroll listener drift apart and triggers fire at the wrong offset.

**Framer Motion inside a Lenis page** — no special wiring needed. Framer Motion animates elements, not scroll position, so it's unaffected by Lenis. Just don't also point GSAP ScrollTrigger at elements Framer Motion is mid-transitioning.

**GSAP + Three.js** — use GSAP to tween Three.js object properties (position, rotation, material uniforms) instead of writing manual lerp/rAF math:
```js
gsap.to(mesh.rotation, { y: Math.PI * 2, duration: 2, ease: 'power2.inOut' })
```

**Framer Motion + Three.js** — use `framer-motion-3d` only if the scene is simple and React-driven; for anything with a real render loop or many objects, drive Three.js directly (or via `@react-three/fiber` + GSAP) instead — Framer Motion's spring system isn't built for a 3D render loop.

## Step 4 — Defaults and guardrails

- Respect `prefers-reduced-motion` regardless of which library is used: Framer Motion via `useReducedMotion()`, GSAP via checking the media query and short-circuiting durations to 0, Lenis via disabling smoothing (`lenis.stop()` / instant scroll).
- Don't load a library you're not using on a given page — check the bundle. Lenis and Three.js are the two most worth code-splitting/lazy-loading since not every route needs them.
- If a task only needs a CSS transition (simple hover/opacity/color change), use plain CSS — don't reach for any of these four libraries at all.

## Step 5 — When motion also needs design judgment, not just wiring

This skill decides *which library*. For *how the motion should feel* (easing choices, duration, when restraint beats flourish), defer to `~/.claude/design/DESIGN.md` first, then `animate` or `design-motion-principles` if installed — they cover taste; this skill covers plumbing.

## Step 6 — Borrow a ready-made component instead of building from scratch

Before hand-coding a common piece of UI (a marquee, a bento grid, an animated hero, a pricing table, a chart), check whether one of these already has it — copy the pattern, then restyle it to this project's tokens rather than inventing the interaction logic from zero. All links below are verified live (checked via web search, not guessed). This is the shortlist worth reaching for first, grouped by job. Every entry here is **FREE** or **FREEMIUM with a usable free core** — skip the PAID-only ones unless the project has budget for them.

**Smooth scroll / scroll-driven effects**
- Lenis (if the project already has it) — the scroll engine itself. See Steps 1–3 above for wiring.
- [UI Layouts](https://www.ui-layouts.com) — FREE. React/Next.js + Tailwind + Motion + GSAP + React Three Fiber layout patterns, several scroll-driven.
- [Aceternity UI](https://ui.aceternity.com) — FREEMIUM. The most common source for "immersive" scroll/hover effects (parallax cards, spotlight, text reveals) built on Framer Motion.

**Animated component blocks (general "make it feel alive")**
- [Magic UI](https://magicui.design) — FREEMIUM. React + Tailwind + Motion; marquees, animated beams, bento grids.
- [Aceternity UI](https://ui.aceternity.com) — FREEMIUM. Advanced animated components, Framer Motion based.
- [Motion Primitives](https://motion-primitives.com) — FREEMIUM. Small, focused animation primitives (accordions, dialogs, tooltips) with motion built in.
- [SmoothUI](https://smoothui.dev) — FREE. shadcn-compatible, React + Tailwind + Motion.
- [Animate UI](https://animate-ui.com) — FREE. React + Tailwind + Radix + Motion.

**Copy-paste component registries (shadcn-style, own the code)**
- [shadcn/ui](https://ui.shadcn.com) — FREE. The base pattern most of the others above extend — Radix + Tailwind, you copy the code in.
- [Kibo UI](https://www.kibo-ui.com) — FREE. Composed shadcn components.
- [Fancy Components](https://www.fancycomponents.dev) — FREE. React + TypeScript + Tailwind + Motion.
- [HyperUI](https://hyperui.dev) — FREE. Plain Tailwind markup, no JS — good for fast marketing sections and simple stat/chart-adjacent layouts.

**Dashboards, charts, data-heavy UI**
- [Tremor](https://tremor.so) — FREE. React + Tailwind + Radix/Recharts, built for dashboards specifically.
- [shadcn/ui](https://ui.shadcn.com) charts (built on Recharts) — FREE.

**Accessible unstyled primitives (when you want zero visual opinion)**
- [Radix UI](https://www.radix-ui.com) — FREE. Headless, accessibility-first.
- [Headless UI](https://headlessui.com) — FREE. From the Tailwind Labs team, pairs naturally with Tailwind.
- [React Aria](https://react-spectrum.adobe.com/react-aria/) (via [HeroUI](https://heroui.com) or [Jolly UI](https://www.jollyui.dev)) — FREE.

Rule of thumb: reach for a **copy-paste registry** (shadcn/Kibo/Fancy/HyperUI) when you want to own and edit the code; reach for an **installed package** (Radix, Headless UI, Tremor) when you want it to stay a maintained dependency. Either way, still run it through this skill's Step 1–4 rules before wiring its animation into the rest of the page — a borrowed component that also bundles its own motion library (e.g. Framer Motion inside an Aceternity block) still has to follow the "one owner per element" rule in Step 2.
