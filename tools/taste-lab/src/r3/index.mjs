// Round 3: ideas from Arc (uiarc.dev, free parts), rebuilt in the ember look.
// a.mjs carries the shared number roll (window.TLroll), so it must come first.
import a from './a.mjs';
import b from './b.mjs';
export default [...a, ...b];
export const description = 'Taste Lab round 3: numbers that roll, meters and charts that answer on hover, and fluid inputs, after Arc.';
export const lead = 'Round 3 is about fluid motion, after the Arc library. It starts with the rolling number: ours against theirs, side by side, on the same values. Pick the versions you like, as before.';
