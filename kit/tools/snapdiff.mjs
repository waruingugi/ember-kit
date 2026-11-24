// Compare two snapshots element by element, in document order. Exit 1 on any difference.
// Usage: node kit/tools/snapdiff.mjs before.json after.json
import { readFileSync } from 'node:fs';
const [a, b] = process.argv.slice(2).map(f => JSON.parse(readFileSync(f, 'utf8')));
let bad = 0;
// Sub-pixel text widths change from run to run as fonts settle: numbers within 0.1 count as equal.
const NUM = /-?\d+(\.\d+)?/g;
const same = (x, y) => x === y || (x.replace(NUM, '#') === y.replace(NUM, '#') &&
  (x.match(NUM) || []).every((n, i) => Math.abs(+n - +(y.match(NUM)[i])) <= 0.1));
for (const st of Object.keys(a)) {
  const A = a[st], B = b[st];
  if (!B) { console.log(`${st}: missing in second`); bad++; continue; }
  if (A.length !== B.length) { console.log(`${st}: ${A.length} elements vs ${B.length}`); bad++; }
  for (let i = 0; i < Math.min(A.length, B.length); i++) for (const k of Object.keys(A[i])) {
    if (k === 'i') continue;
    if (!same(String(A[i][k]), String(B[i][k]))) { if (bad++ < 60) console.log(`${st} #${i} <${A[i].tag}> "${A[i].text}" ${k}: ${A[i][k]} → ${B[i][k]}`); }
  }
}
console.log(bad ? `${bad} differences` : 'identical: every element, every state, every property');
process.exit(bad ? 1 : 0);
