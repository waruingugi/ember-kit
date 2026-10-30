# Hairline figure library

Every Hairline figure Claude makes is saved here, so it can be reused and
improved. How to build and check one is in `../DESIGN.md`, under
*Hairline figures* (`tools/hairline.md`).

- `figures/<name>.js` is each figure's source.
- The table below lists every figure. Add a row when you make one. Add a
  log line when you improve one.

| Name | The object | The idea it stands for | What the mouse does | Used on |
|---|---|---|---|---|
| `watch` | A wristwatch in 4 layers stacked straight up (case, movement, dial with hands, glass), dashed guides at the sides, like Hairline's stock phone | An overview: a system as a few layers | The layer under the mouse lifts with every layer above it. The slider (or the page's scroll) is the explode; layers spin while they rise and settle square when fully open. Ambient: wheels turn, balance swings, hands keep real time | Watch Study stage one (throwaway), https://claude.ai/artifact/CPUTrvHqkcTidGkGY9355G |
| `movement` | One layer of the watch taken apart: plate, barrel, 4 wheels with pinions, pallet fork, balance, bridge, each up its own dashed arbor | Stage two: drilling into one layer of an overview | The part under the mouse lifts with every part above it. Explode slider, with a spin that peaks halfway. Ambient: a working escapement driven by one phase number (balance swings, fork flips, escape wheel steps, wheels follow) | Watch Study stage two |
| `cabinet` | A parts cabinet: 2 × 3 drawers on feet | A store of things, one drawer per kind | The drawer under the mouse slides out; neighbours ease out by distance; 3 spare wheels inside pop up one by one and turn; the pull lights. Slider is the stagger | Watch Study section 04 |
| `pigeonholes` | A mail rack: 12 slots on a plinth, one envelope each | A web API (FastAPI): a slot is a route, an envelope a request | The slot under the mouse slides its envelope out. The others ease back in, staggered outward. At rest, the furthest-out envelope is lit | The showcase (`components/showcase/index.html`), inline |
| `tracker` | Two vehicle decks (a low bike deck, a taller van bed), each with a mounting pad, and one tracker puck with an antenna; a row of dots in front of each deck | A device moves between vehicles, so its binding is a history (`DeviceInstallation`), not a column | The deck under the mouse calls the puck over: it lifts, arcs across on the 700ms curve and lands. The open deck's record dots light; the other's dim but stay. Slider is the arc height. Tour: van, bike, van, leave | A fleet page |

## How a library figure goes onto a page

The showcase shows it inline (search `custom Hairline figures` in
`components/showcase/index.html`): the unchanged
`kernel.js` from `~/tools/hairline/skills/hairline-create/`, then a small
shim that registers each figure, then each figure's source inside its own
block.

## Log

Newest first. `<date> <name>: what changed and why.`

- 2026-10-09 tracker: new, for a fleet page. Hit test on each deck's own resting top (rule 01). One tween drives x, z and the arc, so the puck can never drift from its path. Passes `validate.mjs`; tour checked in the bench with `?play=1`. Shown small in a `.tcard`, per the new size rule.
- 2026-10-09 all four: added a `tour` for the new hairline-create pin (`a221785`), found by sweeping each frame for the part the read-out names. watch: movement, dial, glass. movement: barrel, escape, balance. cabinet: a zigzag over three drawers. pigeonholes: a diagonal. All pass `validate.mjs`; the watch lap was played with `?play=1`.
- 2026-10-09 watch v3, movement v3: built the owner's notes. No guide lines. Watch gained a case back that unscrews and drops; the movement lifts, the dial slides right, the glass slides left, the crown unscrews outward with turning grip lines. Movement parts each leave on their own vector (`OUT`). Fixed: watch's `act` started at -2, so the rest highlight never showed. 193 and 181 lines.
- 2026-10-08 watch, movement: The owner's notes for the next version. Remove the dashed guides (side guides in `watch`, arbor guides in `movement`); the layering alone was good. Make the explode more complex: parts move in mixed directions (up, down, left to right, diagonal) and rotate if they turn in real life. Not built yet.
- 2026-10-08 watch v2: rebuilt as a 4-layer straight stack with side guides (the owner liked the stock phone as an overview), plus a spin of `SPIN · (i+1) · 4e(1−e)` so layers turn while rising and land square. 182 lines.
- 2026-10-08 movement: new, stage two of the watch. One phase `ph = t · BEAT` drives balance, fork and escape wheel together. Guides drawn only once a part is above the plate. 177 lines.
- 2026-10-08 cabinet: new. The pointer is read on the face's own plane (a 2 × 2 inverse of P), which never moves. Drawers are re-ordered by how far out they are. 159 lines.
- 2026-10-08 watch: first version, 184 lines, passes validate.mjs. Lessons: big discs hide small parts unless layers also drift sideways (DRIFT 14); fit the camera to the real outer edges, not a loose box; a bright stroke must swap `sil` for `hi`, or `sil` wins. To improve: bigger train and balance, a `focus(i)` handle so a page list can lift a layer.
- 2026-10-08 pigeonholes: added from an overview page, where the owner loved it. Source copied unchanged.
- 2026-10-08: Library started.
