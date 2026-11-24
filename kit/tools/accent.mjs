// Make an accent block from one brand colour. Paste the printed CSS after tokens.css (and after any card CSS).
//   node kit/tools/accent.mjs "#2563eb"                 light from this colour, night worked out
//   node kit/tools/accent.mjs "#2563eb" --night "#60a5fa"
//   node kit/tools/accent.mjs ember                      the house orange, exact
//   add -o accent.css to write a file
// Only colour changes. Motion, sizes, fonts and states stay the house ones.
import { writeFileSync } from 'node:fs';

const PAPER = '#eff2f1', RAISED = '#f8faf9', NIGHT = '#0d1013', NIGHT_RAISED = '#14181c';
const EMBER = { light: { accent: '#e14a0e', text: '#b33a0a', on: '#ffffff' }, night: { accent: '#ff6a2b', text: '#ff8d5e', on: '#120a06' } };

const hex = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error('not a hex colour: ' + h); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const toHex = c => '#' + c.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); };
const ratio = (a, b) => { const x = lum(hex(a)), y = lum(hex(b)); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const mix = (a, b, t) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));
// walk toward black or white until every background reaches the target contrast
const reach = (c, toward, target, bgs) => { for (let t = 0; t <= 1.0001; t += .01) { const m = mix(c, toward, t); if (bgs.every(bg => ratio(m, bg) >= target)) return m; } return toward; };

function make(base, nightBase) {
  if (base === 'ember') return EMBER;
  // light: the accent must show as a mark (3:1); small text needs 4.5:1 on paper and raised
  const accent = toHex(hex(base)); // the brand stays as given; only the text tone is worked out
  // small text is always a step deeper than the accent, so the two tokens never share a value
  const text = reach(mix(accent, '#000000', .1), '#000000', 4.6, [PAPER, RAISED]);
  // the main button keeps white words when they read at least 3.5:1 (the house orange reads about 4:1, by the owner's choice)
  const on = ratio('#ffffff', accent) >= 3.5 ? '#ffffff' : mix(accent, '#000000', .92);
  // night: lighten until it glows on dark paper like the house orange does (about 6:1)
  const nAccent = nightBase || reach(base, '#ffffff', 5.5, [NIGHT]);
  const nText = reach(mix(nAccent, '#ffffff', .2), '#ffffff', 7, [NIGHT, NIGHT_RAISED]);
  const nOn = ratio(mix(nAccent, '#000000', .92), nAccent) >= 4.5 ? mix(nAccent, '#000000', .92) : '#ffffff';
  return { light: { accent, text, on }, night: { accent: nAccent, text: nText, on: nOn } };
}

const args = process.argv.slice(2);
const flag = n => { const i = args.indexOf(n); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };
const nightArg = flag('--night'), out = flag('-o');
const base = args[0];
if (!base) { console.error('usage: node kit/tools/accent.mjs <#hex | ember> [--night #hex] [-o file.css]'); process.exit(2); }
const a = make(base, nightArg);
const rgb = h => hex(h).join(' ');
const block = s => `  --accent: ${s.accent};\n  --accent-text: ${s.text};\n  --accent-rgb: ${rgb(s.accent)};\n  --accent-soft: rgb(${rgb(s.accent)} / ${s === a.light ? '.08' : '.1'});\n  --on-accent: ${s.on};`;
const css = `/* accent: ${base}${nightArg ? ' / night ' + nightArg : ''}. Made by kit/tools/accent.mjs. Paste after tokens.css and any card CSS. Colour only: motion stays the house motion. */
:root {
${block(a.light)}
}
@media (prefers-color-scheme: dark) {
  html:not([data-theme="light"]) {
${block(a.night).replace(/^/gm, '  ')}
  }
}
html[data-theme="dark"] {
${block(a.night)}
}
`;
const report = [
  ['light accent on paper (dots and rings need 3)', ratio(a.light.accent, PAPER)],
  ['light accent text on raised (needs 4.5)', ratio(a.light.text, RAISED)],
  ['button words on light accent', ratio(a.light.on, a.light.accent)],
  ['night accent on night paper', ratio(a.night.accent, NIGHT)],
  ['night accent text on night raised (needs 4.5)', ratio(a.night.text, NIGHT_RAISED)],
  ['button words on night accent', ratio(a.night.on, a.night.accent)],
];
if (out) writeFileSync(out, css); else process.stdout.write(css);
const need = k => k.includes('dots') ? 3 : k.startsWith('button words') ? 3.5 : k.startsWith('night accent on') ? 3 : 4.5;
for (const [k, v] of report) console.error(`${v >= need(k) ? 'ok  ' : 'low '} ${k}: ${v.toFixed(2)}:1${v < need(k) && k.includes('dots') ? ' (status dots and rings will look faint; pass a deeper shade, or accept it)' : ''}`);
// a green or red brand fights the house rule that state is accent and ink only
const [r, g, b] = hex(a.light.accent); if ((g > r * 1.2 && g > b) || (r > 180 && g < 60 && b < 60)) console.error('note: a green or red accent reads as good/bad. The kit shows done and problems in the accent, so pick a brand colour that does not already mean "good" or "error".');
