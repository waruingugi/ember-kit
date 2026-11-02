// Put a page together from components/parts/.
// Usage: node scripts/assemble.mjs <ids|all> -o out.html [--parts components/parts] [--app "Page title"]
//   --app makes a page to build on, not a showcase copy: the sidebar keeps only links to sections on the page,
//   the top bar shows the title (no "v4 · Live" badge), and group numbers and "what to try" lines go.
//   ids: comma list in page order, e.g. "hero,c15,n20,why,endcard,footer". A part brings its group head
//   with it; c01 and c02 come as a pair; icons always come. "all" gives the whole showcase.
// Every rule, block and script keeps the showcase's order, so a part looks exactly as it does there.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i < 0 ? d : args.splice(i, 2)[1]; };
const app = opt('--app', null), out = opt('-o', 'page.html'), DIR = resolve(opt('--parts', `${KIT}/components/parts`));
const manifest = JSON.parse(readFileSync(`${DIR}/manifest.json`, 'utf8'));
const byId = Object.fromEntries(manifest.map(m => [m.id, m]));

let want = (args[0] || 'all') === 'all' ? manifest.filter(m => m.kind !== 'group').map(m => m.id) : args[0].split(',').map(s => s.trim());
for (const id of want) if (!byId[id]) { console.error(`unknown part "${id}". Known: ${manifest.map(m => m.id).join(' ')}`); process.exit(2); }
// pairs travel together; icons always come
want = want.flatMap(id => (byId[id].needs.find(n => n.startsWith('pair:'))?.slice(5).split(',') || [id]));
manifest.filter(m => m.kind === 'icons').forEach(m => want.includes(m.id) || want.unshift(m.id));
want = [...new Set(want)];

const read = id => readFileSync(`${DIR}/${id}.html`, 'utf8');
const css = [readFileSync(`${DIR}/base.css`, 'utf8')], scripts = [], html = [];
const take = (src, re) => [...src.matchAll(re)];

let openGroup = null;
const closeGroup = () => { if (openGroup) { html.push('      </section>'); openGroup = null; } };
for (const id of want) {
  const m = byId[id];
  if (m.kind === 'part' && openGroup !== m.group) {
    closeGroup();
    const g = read('group-' + m.group);
    html.push(g.match(/<!--@@OPEN ([\s\S]*?)-->/)[1], g.replace(/<!--[\s\S]*?-->\n?/g, '').replace(/<style>[\s\S]*?<\/style>\n?/, '').trim());
    css.push(...take(g, /<style>\n([\s\S]*?)\n<\/style>/g).map(x => x[1]));
    openGroup = m.group;
  } else if (m.kind !== 'part') closeGroup();
  const src = read(id);
  css.push(...take(src, /<style>\n([\s\S]*?)\n<\/style>/g).map(x => x[1]));
  scripts.push(...take(src, /<script data-slot="(\d+)"(?: data-block="(\d+)")?>([\s\S]*?)<\/script>/g).map(x => ({ slot: x[1], block: x[2], code: x[3] })));
  html.push(src.replace(/^<!-- part [^\n]*\n/, '').replace(/<style>[\s\S]*?<\/style>\n?/g, '').replace(/<script[\s\S]*?<\/script>\n?/g, '').trim());
}
closeGroup();

// CSS: every rule carries its showcase position; sort, then re-wrap the @media pieces
const rules = css.join('\n').split(/\n(?=\/\*@\d)/).map(l => l.slice(l.indexOf('/*@'))).filter(l => l.startsWith('/*@'))
  .map(l => { const k = l.match(/^\/\*@(\d+)(?:\.(\d+) ([^*]*))?\*\//); return { i: +k[1], j: k[2] == null ? -1 : +k[2], at: k[3], text: l.slice(k[0].length).trim() }; })
  .sort((a, b) => a.i - b.i || a.j - b.j);
const cssOut = []; let curAt = null;
for (const r of rules) {
  const key = r.at ? `${r.i}|${r.at}` : null;
  if (curAt && curAt !== key) { cssOut.push('}'); curAt = null; }
  if (key && curAt !== key) { cssOut.push(r.at + ' {'); curAt = key; }
  cssOut.push(r.text);
}
if (curAt) cssOut.push('}');

// scripts: shell scripts and libs keep their slot; closure blocks are wrapped in their prelude again
const shell = take(readFileSync(`${DIR}/lib/shell-scripts.html`, 'utf8'), /<script data-slot="(\d+)"([^>]*)>([\s\S]*?)<\/script>/g)
  .map(x => ({ slot: x[1], tag: `<script${x[2]}>${x[3]}</script>` }));
const libs = readdirSync(`${DIR}/lib`);
const slots = [...shell];
if (want.some(id => byId[id].needs.includes('hairline')))
  for (const f of libs.filter(f => f.startsWith('hairline-'))) slots.push({ slot: f.match(/(\d+)\.js$/)[1], tag: `<script>${readFileSync(`${DIR}/lib/${f}`, 'utf8').replace(/^\/\/ slot \d+\n/, '')}</script>` });
const bySlot = {};
for (const s of scripts) (bySlot[s.slot] ||= []).push(s);
for (const [slot, list] of Object.entries(bySlot)) {
  const closure = `${DIR}/lib/closure-${slot}.js`;
  if (existsSync(closure)) {
    const c = JSON.parse(readFileSync(closure, 'utf8'));
    slots.push({ slot, tag: `<script>${c.prelude}${list.sort((a, b) => a.block - b.block).map(s => s.code).join('')}${c.epilogue}</script>` });
  } else list.forEach(s => slots.push({ slot, tag: `<script>${s.code}</script>` }));
}
slots.sort((a, b) => a.slot - b.slot);

const page = readFileSync(`${DIR}/skeleton.html`, 'utf8')
  .replace('/*@@CSS@@*/', () => cssOut.join('\n'))
  .replace('<!--@@PARTS@@-->', () => html.join('\n'))
  .replace('<!--@@SCRIPTS@@-->', () => slots.map(s => s.tag).join('\n'));
writeFileSync(out, app ? appPage(page, app) : page);
console.log(`${out}: ${want.length} pieces, ${rules.length} CSS rules, ${slots.length} scripts.`);

function appPage(page, title) {
  const esc = t => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const ids = new Set([...page.matchAll(/ id="([^"]+)"/g)].map(m => m[1]));
  return page
    .replace(/\s*<li><a class="sb-link" href="#([^"]+)"[\s\S]*?<\/li>/g, (li, id) => (ids.has(id) ? li : ''))
    .replace(/\s*<div class="sb-group">[^<]*<\/div>\s*<ul class="sb-list">\s*<\/ul>/g, '')
    .replace(/<div class="crumbs">[\s\S]*?<\/div>/, `<div class="crumbs"><span>${esc(title)}</span></div>`)
    .replace(/\s*<span class="badge">v4 · Live<\/span>/, '')
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/\s*<span class="ghost" aria-hidden="true">\d+<\/span>/g, '')
    .replace(/(<p class="eyebrow"[^>]*>)<b>\d+<\/b> /g, '$1')
    .replace(/\s*<p class="kit-p">[\s\S]*?<\/p>/g, '');
}
