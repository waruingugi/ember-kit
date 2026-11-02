---
name: motion
description: Write animation code with Motion (motion.dev, formerly Framer Motion) the house way — on static HTML pages through the pinned window.Motion script, and in React or Next through motion/react. Use whenever a task names Motion, Framer Motion, motion/react, animate(), inView(), scroll(), MotionConfig or AnimatePresence, or when DESIGN.md's picker chooses Motion over GSAP for a page.
license: MIT
---

# Motion

1. Read `~/.claude/design/DESIGN.md` (*Motion*), then `~/.claude/design/tools/motion.md`.
   They set the version, the script tag, the hash, the curve, the speeds and the
   traps. They win every conflict with this file and with Motion's own docs.
2. Check the page is not already on GSAP. One library per page.
3. Fetch current API details from the Motion docs (Context7 `/websites/motion_dev`)
   for anything you are not sure of. Use the pinned version, never `@latest`.

## Static page

- Load the pinned `dist/motion.js` with its `integrity` hash. Take `animate`,
  `inView`, `scroll`, `stagger`, `hover`, `press` from `window.Motion`.
- Start from the bail-out block in `tools/motion.md`: no `Motion`, motion `off`
  or reduced motion means return and leave the page complete at rest.
- `inView(el, (target, entry) => …)` runs once if the callback returns nothing.
  Return a function only when the element should react to leaving view.
- Scroll progress line: `scroll(animate(bar, { scaleX: [0, 1] }, { ease: 'linear' }))`.
- Press: `press(el, () => { animate(el, { scale: 0.97 }, { duration: 0.15 }); return () => animate(el, { scale: 1 }, { duration: 0.15 }); })`.

## React or Next

- `import { motion, AnimatePresence, MotionConfig } from "motion/react"`.
- One `MotionConfig` at the root with `reducedMotion="user"` and our curve.
- `AnimatePresence` for anything that leaves: toasts, popovers, rows. Exits run
  a little faster than entrances (*Two speeds*).
- `whileHover={{ y: -3 }}` for cards, `whileTap={{ scale: 0.97 }}` for controls.
- `layout` only on small pieces (a tab marker, one card), never a whole page.

## Done when

- Works with the Motion script blocked, with motion `off`, and with reduced motion.
- Only `transform` and `opacity` move.
- No GSAP on the same page, no `framer-motion` import, no `@latest` URL.
