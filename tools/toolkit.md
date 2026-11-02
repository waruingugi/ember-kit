# The toolkit

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

Everything a page in this style needs. Each tool has one job. Use the one
named here, so the look does not drift.

| Job | Tool | Where it lives |
|---|---|---|
| Line figures that react, take apart, spin and run (the watch, the cabinet) | `hairline-create` on the Hairline engine | Global skill `~/.claude/skills/hairline-create/`, pinned `37d2e78` (every figure declares a tour) |
| Ready-made line figures (33: padlock, patch, riffle, branches, elevator, sieve, hub, stack, phone, cabinet, plug and more) | `@lucasmarkes/hairline@0.5.1`, as a plain script | Vendored in `~/.claude/design/vendor/` |
| Folder views, story timelines, hand-built state machines | The showcase's own code, and the `Diagram` helper | `components/showcase/index.html`, `tools/diagram_svg.py` (see *Patterns from a plan page* (`patterns/`)) |
| How parts connect (architecture), who calls whom (sequence) | Archify, on its own canvas | Skill `~/.claude/skills/archify/` (versions: `tools/diagrams.md`) |
| State machines, data models, swimlanes, on the dot grid; layer stacks as the scroll-driven exploded scene (see *The exploded layer scene* (`patterns/exploded-layers.md`)) | Diagram Design with the `ember` profile | Plugin, and clone `~/tools/diagram-design` pinned `0cf73c3` |
| Scroll scenes, fade-ins, count-ups, scrubbing | GSAP 3.15.0 + ScrollTrigger | CDN with SRI (see *GSAP* (`tools/gsap.md`)) |
| Ready-made React parts to reuse or learn from: plain controls and forms, or parts that move | shadcn/ui (`shadcn` skill), free beUI (`beui` skill) and easyui | Public registries; global skills `~/.claude/skills/shadcn/` pinned `4233ed1` and `~/.claude/skills/beui/` pinned `a866cb2` (`tools/ui-libraries.md`) |
| Charts, sparklines, stat tiles | `dataviz` (built-in skill) | Load it before any chart. Line charts: parts `c01`/`c02` in `components/parts/` (`patterns/line-chart.md`) |
| Current docs for GSAP or any library | Context7 | MCP server |
| Looking at the page: screenshots, hover tests, phone width | Playwright MCP | Plugin `playwright@claude-plugins-official` |

**Motion helpers** (global skills since 2026-10-21; the motion set grew on
2026-10-29). This folder wins every conflict. Every new skill below was read
in full for safety on 2026-10-29 (no data stealing, no hidden prompts, no
hooks) and is copied from a clone pinned in `~/tools/` (`tools/setup.md`).

| Skill | Use it when | Take | Ignore |
|---|---|---|---|
| `animate` (Emil Kowalski, `emilkowalski/skills` pinned `a81dbca`; `~/.claude/skills/animate/`) | Building a piece the reader works: tabs and their sliding marker, toasts, popovers and menus, modals, drawers, accordions, height changes, clip-path reveals, hold-to-confirm, drag to dismiss | Its order of questions (should it move at all, why, which property, how it stops halfway, how it leaves); `RECIPES.md`; popovers grow from their trigger, modals from the centre; CSS transitions (not keyframes) for anything that can be re-triggered; springs for drag | Its curve and duration tables (we have one curve and *Two speeds*; its "under 300 ms" fits controls only, not content); Framer Motion on a plain HTML page |
| Emil's other motion skills: `review-animations`, `improve-animations`, `find-animation-opportunities`, `remove-animations`, `animation-performance`, `animation-vocabulary` | Review one change; plan fixes across a project (read-only); find what should move; cut motion that has no job; fix jank; name an effect | Their checks and their "should this move at all" test, which matches *Motion* | Values that fight *Two speeds*; `improve-animations` writes plans only, so we still make the edits |
| `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, `gsap-plugins`, `gsap-utils`, `gsap-performance`, `gsap-react`, `gsap-frameworks` (GreenSock's own, `greensock/gsap-skills` pinned `aed9cfd`) | Any GSAP work: tweens, timelines, ScrollTrigger scenes, Flip, SplitText, DrawSVG, React or Vue cleanup | Correct, current API use; `matchMedia()` for reduced motion; cleanup; batching | ScrollSmoother (it takes over the scroll, like Lenis); its easing advice (we use `expo.out`); `tools/gsap.md` sets the version and the SRI tags |
| `motion` (our own, written 2026-11-01; no official Motion skill exists) | Any Motion code: a React or Next app, or a static page the picker in `tools/motion.md` gives to Motion | Its order: read DESIGN.md and `tools/motion.md`, check the page has no GSAP, look up the API in Context7 | Nothing; it only points to our files |
| `threejs-*` (13 skills, `CloudAI-X/threejs-skills` pinned `0e18186`) | A project that already uses Three.js or React Three Fiber, after `motion-ecosystem` picks it | Scene setup, cleanup, performance, loaders, shaders | Adding Three.js to our own pages (Hairline and Anatomy cover 3D-looking figures) |
| `motion-design` (LottieFiles, pinned `f9a8a04`) | Planning how a group of things moves together: order, stagger, what leads | Its choreography and "motion with a reason" ideas, as a second opinion next to `design-motion-principles` | Its personality archetypes, curves and duration tables; bounce and overshoot |
| `motion-ecosystem` (ours, in `claude/skills/motion-ecosystem/`) | A page needs more than CSS + GSAP: a React or Next app, a Three.js scene, a project that already ships Framer Motion or Lenis, or two libraries on one page | Its routing table; one library owns each element and property (split wrapper and child); the Lenis + ScrollTrigger wiring when Lenis is already there; tweening Three.js values with GSAP; reduced motion handled in every library; plain CSS for simple hovers | Adding a library the project doesn't have; Lenis on our own pages (it takes over the scroll); its component-library list (those bring their own look: restyle to our tokens or skip) |

On our own single-file pages the answer stays plain CSS plus GSAP (`tools/gsap.md`).

**Reviewers.** Run these on a finished page, before publishing (the UI
skills below add three more):
- **`design-motion-principles`, in audit mode**, on every page with
  motion. It checks timing, easing, and motion that is only for show. Ask
  for the audit. Do not let it rebuild the page in another style. Its
  findings are advice, and this file wins where they disagree.
- **`dataviz`** on every chart or sparkline: one method, accessible, and
  drawn to scale.

**UI skills** (added 2026-10-11). Each has one job, and this folder wins
every conflict. Load the skill, take its rules, ignore its stack.

| Skill | Job here | When | Never |
|---|---|---|---|
| `craft` (`~/.claude/skills/craft/`, ours, 2026-10-21) | The one design-craft skill. The read before code (thesis, one peak, reflex check, layout plan, motion budget), craft and UX rules, anti-slop bans, review with severity, and `scripts/scan.sh` (slopscan, genjutsu audit, impeccable detect). Merged from the ten design skills listed below; `house.md` says which of their flags are really house style | Every page: the read before building, the scan before publishing, `review.md` when asked to critique | Picking fonts, colours or a theme; writing another DESIGN.md |
| `fixing-motion-performance` | Audit: only `transform` and `opacity` move, no scroll listeners, `will-change` only while moving | Every page with motion, before publishing, next to `design-motion-principles` | Swapping GSAP for another library |
| `fixing-accessibility` | Audit: names, keyboard, focus, dialogs, `aria-expanded` | Every page with controls (sidebar, tabs, widgets, sheets) | Adding ARIA where a native element already works |
| `fixing-metadata` | Title, description, `theme-color`, favicon | Pages that get shared or hosted outside claude.ai | SEO tags on a private review artifact |
| `hallmark` (`~/tools/hallmark/`, nutlope/hallmark pinned `4f6a46c`, checker only) | Its slop linter, `sloplint.mjs`, as one more check | Before a page is done, after `craft` | Letting it design: no `/hallmark`, no themes, no hook; skip the gates `tools/hallmark.md` lists |
| `improve-ui` | Read-only audit of a finished page against DESIGN.md; up to three proven findings | After Draft 1 of a big page, or when a page "feels off" | Letting it edit the page; it writes plans only |

Left out on purpose: `baseline-ui` and `ui-skills-root` from the same
collection. `baseline-ui` forces Tailwind and `motion/react` and bans custom
easing and unrequested animation; `ui-skills-root` fetches skills over `npx`
each time. On our own pages, no Three.js, Lenis, Framer Motion or any other
animation library (Hairline and Anatomy cover 3D-looking figures, GSAP covers
motion). In projects that already use them, `motion-ecosystem` decides.

Also turned off (2026-10-21): the design-language skills, which would pull
the look away from this file. Their best rules and their scanners now live in
`craft`: taste-skill, impeccable, ui-ux-pro-max, auteur, genjutsu,
frontend-design, interface-design, antigravity-design-expert and hue. The
motion helpers `animate` and `motion-ecosystem` stay on (above). Off, never
uninstalled: `craft`
runs their scanners from the plugin cache.

**How they keep out the AI look ("slop").** The skills only check and
suggest. The look stays ours: one accent, our fonts, flat paper with depth
only on objects, one curve, motion with a job. If a skill suggests a purple
gradient, glass, emoji icons, a new font or a "hero with three feature
cards", ignore it.

**Study only: `design-dna`** (`zanwei/design-dna` pinned `593e39b`, added
2026-10-29). It pulls the look out of another site or screenshot into JSON.
Use it only to study someone else's design and say what we could learn. Never
let it style our pages or write a second design file: the look stays this
folder's. Its `scripts/` need `sharp`; do not install it unless the owner asks.

**Checked and left out (2026-10-29):** HyperFrames (`heygen-com/hyperframes`,
HTML to video). It is safe to read, but it sends usage data unless
`DO_NOT_TRACK=1`, tells the agent to upgrade itself to `@latest`, and some
steps use a HeyGen or Gemini account. Add it only when the owner needs video, as a
plugin, with `DO_NOT_TRACK=1`. Genjutsu stays off (`craft` replaces it).
