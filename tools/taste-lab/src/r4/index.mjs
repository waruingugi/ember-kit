// Round 4: round 3 follow-ups, then the Arc parts the owner named, on one page.
// Round 3's parts load as helpers only (window.TLroll and friends), without their sections.
import r3a from '../r3/a.mjs';
import r3b from '../r3/b.mjs';
import a from './a.mjs'; // 01–05 more like this, and round 3 fixes
import b from './b.mjs'; // 06–14 buttons and the theme switch
import c from './c.mjs'; // 15–20 menus and text inputs
import d from './d.mjs'; // 21–26 choices, pickers, upload
import e from './e.mjs'; // 27–31 layout and status
import f from './f.mjs'; // 32–36 data, lists and blocks
export const helpers = [...r3a, ...r3b];
export const batches = { a, b, c, d, e, f };
export default [a, b, c, d, e, f].flat();
export const description = 'Taste Lab round 4: more of the round 3 parts you liked, then buttons, menus, inputs, pickers, lists and blocks after Arc.';
export const lead = 'Round 4. It starts with more of the round 3 parts you asked for, then everything you marked on Arc, in our look. Corners are well curved now, not pills. Pick the versions you like, as before.';
