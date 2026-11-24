// Pull one house part out to paste into a page you write yourself: its markup, its own CSS rules and its script.
//   node kit/tools/part.mjs n29            prints to the screen
//   node kit/tools/part.mjs n29 -o out/    writes out/n29.html, out/n29.css, out/n29.js
// The shared pieces (tokens, .b buttons, .in fields, icons) come from cards/table/table.starter.html, not from here.
// shortcut: older parts (c01–c31) style plain class names, not their id, so only their markup and script come out; build those pages with assemble.mjs instead.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PARTS = resolve(dirname(fileURLToPath(import.meta.url)), '../../components/parts');
const [id, flag, outDir] = process.argv.slice(2);
if (!/^[a-z0-9-]+$/.test(id || '')) { console.error('usage: node kit/tools/part.mjs <part id> [-o folder]'); process.exit(2); }
const file = readFileSync(resolve(PARTS, `${id}.html`), 'utf8');
const markup = file.replace(/<script[\s\S]*?<\/script>/g, '').replace(/^<!--[^]*?-->\n?/, '').trim();
const js = [...file.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1].trim()).join('\n\n');
const base = readFileSync(resolve(PARTS, 'base.css'), 'utf8');
// base.css holds one rule per line (with @media blocks wrapping some); keep every rule that names this part's id
const own = new RegExp(`#${id}(?![\\w-])`);
const lines = base.split('\n'), css = [];
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (!own.test(l)) continue;
  // a rule inside @media/@supports: find its opening line above
  let j = i; while (j > 0 && /^\s/.test(lines[j]) && !/^\S/.test(lines[j])) j--;
  const wrap = j < i && /^\s*(\/\*@[\d.]+\*\/\s*)?@/.test(lines[j]) ? lines[j].replace(/\/\*@[\d.]+\*\/\s*/, '') : null;
  const rule = l.replace(/\/\*@[\d.]+\*\/\s*/, '').trim();
  css.push(wrap ? `${wrap.trim().replace(/\{\s*$/, '')} { ${rule} }` : rule);
}
const head = `/* part ${id}: its own rules from components/parts/base.css (made from the showcase). Paste after the starter's CSS. Don't edit; copy again. */`;
if (flag === '-o' && outDir) {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, `${id}.html`), markup + '\n');
  writeFileSync(resolve(outDir, `${id}.css`), head + '\n' + css.join('\n') + '\n');
  writeFileSync(resolve(outDir, `${id}.js`), js + '\n');
  console.log(`${id}: ${css.length} CSS rules, ${js.length} B of script → ${outDir}`);
} else {
  console.log(`<!-- markup -->\n${markup}\n\n<style>\n${head}\n${css.join('\n')}\n</style>\n\n<script>\n${js}\n</script>`);
}
if (!css.length) console.error(`note: no rule names #${id}. It is an older part; build its page with scripts/assemble.mjs.`);
