// Split the showcase into parts: one file per part, pattern and page piece, plus the shared skeleton and base CSS.
// Usage: node scripts/split.mjs [components/showcase/index.html] [components/parts]
// The showcase is the master copy. Never edit components/parts/ by hand for the house look: edit the
// showcase, run this, then run assemble + match to prove nothing moved.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(process.argv[2] || `${KIT}/components/showcase/index.html`);
const OUT = resolve(process.argv[3] || `${KIT}/components/parts`);
const html = readFileSync(SRC, 'utf8');

// ---------- CSS: split the main <style> into top-level items, keeping the original text ----------
const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)];
const main = styles.reduce((a, b) => (b[1].length > a[1].length ? b : a));
function items(css) {
  const out = []; let i = 0;
  const skipWs = () => { while (i < css.length && /\s/.test(css[i])) i++; };
  while (true) {
    skipWs(); if (i >= css.length) break;
    if (css.startsWith('/*', i)) { const j = css.indexOf('*/', i) + 2; out.push({ type: 'comment', text: css.slice(i, j) }); i = j; continue; }
    const start = i; let depth = 0, q = null;
    // the prelude runs to the first { or ; at depth 0
    for (; i < css.length; i++) {
      const c = css[i];
      if (q) { if (c === '\\') i++; else if (c === q) q = null; continue; }
      if (c === '"' || c === "'") { q = c; continue; }
      if (css.startsWith('/*', i)) { i = css.indexOf('*/', i) + 1; continue; }
      if (c === ';' && depth === 0) { i++; out.push({ type: 'stmt', text: css.slice(start, i) }); break; }
      if (c === '{') {
        const prelude = css.slice(start, i).trim(); const bodyStart = i + 1; depth = 1; i++;
        for (; i < css.length && depth; i++) {
          const d = css[i];
          if (q) { if (d === '\\') i++; else if (d === q) q = null; continue; }
          if (d === '"' || d === "'") q = d;
          else if (css.startsWith('/*', i)) i = css.indexOf('*/', i) + 1;
          else if (d === '{') depth++; else if (d === '}') depth--;
        }
        const body = css.slice(bodyStart, i - 1), text = css.slice(start, i);
        if (prelude.startsWith('@')) {
          const kind = prelude.split(/[\s(]/)[0];
          if (/^@(media|supports|container|layer)$/.test(kind) && body.includes('{')) out.push({ type: 'group', prelude, inner: items(body), text });
          else out.push({ type: 'at', prelude, text });
        } else out.push({ type: 'rule', prelude, text });
        break;
      }
    }
  }
  return out;
}
const cssItems = items(main[1]);

// ---------- scripts: classify every <script> in the body ----------
const bodyAt = html.indexOf('<body');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter(m => m.index > bodyAt);
function classify(attrs, code) {
  if (/\bsrc=/.test(attrs)) return { kind: 'shell' };
  if (code.includes('// src/core/styles.ts') || /custom Hairline figures/i.test(code)) return { kind: 'lib', lib: 'hairline' };
  if (code.includes('window.__draft') || code.includes('GSAP layer')) return { kind: 'shell' };
  if (code.includes('window.emberGrid = ')) return { kind: 'shell', grid: true }; // the squares grid: every page gets it, and it is also written out alone as bg-grid.html
  if (code.includes('the still chart')) return { kind: 'frag', frag: 'c01', pair: ['c01', 'c02'] };
  const v4 = code.match(/var box = document\.getElementById\("(n\d\d)"\); if \(!box\) return;/);
  if (v4) return { kind: 'frag', frag: v4[1] };
  if (/\/\* -{16} (\d\d) /.test(code)) return { kind: 'closure' };
  console.warn('unclassified script kept in the shell:', code.slice(0, 80).replace(/\s+/g, ' '));
  return { kind: 'shell' };
}

// ---------- browser: original markup (scripts off), fragment roots, and which rules each fragment uses ----------
const browser = await chromium.launch();
const page = await (await browser.newContext({ javaScriptEnabled: false })).newPage();
await page.setContent(html, { waitUntil: 'domcontentloaded' });
const frags = await page.evaluate(() => {
  const wrap = document.querySelector('#content > .wrap'), list = [];
  const text = el => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  for (const el of wrap.children) {
    if (el.matches('section#top')) { el.dataset.frag = 'hero'; list.push({ id: 'hero', kind: 'hero', name: 'Hero', html: el.outerHTML }); continue; }
    if (el.tagName === 'svg') { const id = 'icons-' + (list.filter(f => f.kind === 'icons').length + 1); el.dataset.frag = id; list.push({ id, kind: 'icons', html: el.outerHTML }); continue; }
    if (el.matches('section.sec') && el.querySelector(':scope > .kit-part')) {
      const head = el.querySelector(':scope > .sec-head'); head.dataset.frag = 'group-' + el.id;
      const open = el.outerHTML.slice(0, el.outerHTML.indexOf('>') + 1);
      list.push({ id: 'group-' + el.id, kind: 'group', group: el.id, name: text(el.querySelector('.eyebrow')).replace(/^\d+\s*/, ''), heading: text(head.querySelector('h2')), open, html: head.outerHTML });
      for (const p of el.querySelectorAll(':scope > .kit-part')) {
        const cs = p.querySelector('section.cs'); p.dataset.frag = cs.id;
        list.push({ id: cs.id, kind: 'part', group: el.id, name: text(cs.querySelector('.eyebrow')).replace(/^\d+\s*/, '') || text(p.querySelector('.kit-h')), heading: text(p.querySelector('.kit-h, h3')), html: p.outerHTML });
      }
      continue;
    }
    if (el.matches('section.sec')) { el.dataset.frag = el.id; list.push({ id: el.id, kind: 'pattern', name: text(el.querySelector('.eyebrow')).replace(/^\d+\s*/, ''), heading: text(el.querySelector('h2')), html: el.outerHTML }); continue; }
    if (el.matches('section.endcard')) { el.dataset.frag = 'endcard'; list.push({ id: 'endcard', kind: 'end', name: 'End card', html: el.outerHTML }); continue; }
    if (el.tagName === 'FOOTER') { el.dataset.frag = 'footer'; list.push({ id: 'footer', kind: 'footer', name: 'Footer', html: el.outerHTML }); continue; }
    console.warn('unknown wrap child', el.tagName);
  }
  return list;
});

// which fragment does each selector touch? pseudo-states are stripped so :hover rules count too
const selectors = [];
const walk = (list, path) => list.forEach((it, i) => {
  if (it.type === 'rule') selectors.push({ key: [...path, i].join('.'), sel: it.prelude });
  if (it.type === 'group') walk(it.inner, [...path, i]);
});
walk(cssItems, []);
const owners = await page.evaluate(sels => {
  const strip = s => s
    .replace(/::?(before|after|placeholder|selection|marker|backdrop|-webkit-[\w-]+|-moz-[\w-]+)\b/g, '')
    .replace(/:(where|not|has|is)\((?:[^()]|\([^()]*\))*\)/g, '')
    .replace(/:(hover|focus-visible|focus-within|focus|active|visited|checked|disabled|enabled|empty|first-child|last-child|first-of-type|last-of-type|only-child|placeholder-shown|target|open|popover-open|default|indeterminate|invalid|valid|required|read-only|autofill|-webkit-[\w-]+)\b/g, '')
    .replace(/:(nth-child|nth-of-type|nth-last-child|nth-last-of-type|dir|lang)\([^)]*\)/g, '');
  const res = {};
  for (const { key, sel } of sels) {
    const owners = new Set();
    for (const part of sel.split(/,(?![^()]*\))/)) {
      let s = strip(part).trim(); if (!s || /^(html|:root|body)$/i.test(s)) { owners.add('base'); continue; }
      let els; try { els = document.querySelectorAll(s); } catch { owners.add('base'); continue; }
      if (!els.length) owners.add('none');
      for (const e of els) { const f = e.closest('[data-frag]'); owners.add(f ? f.dataset.frag : 'base'); }
    }
    owners.delete('none');
    res[key] = owners.size === 1 ? [...owners][0] : 'base';
  }
  return res;
}, selectors);
await browser.close();

// a rule stays with one part only if every class and id it names shows up in that part's own source alone;
// parts build elements in script, so a name used by two parts (or the shell) means the rule is shared
{
  const blob = {};
  for (const f of frags) blob[f.id] = f.html;
  for (const m of scripts) {
    const c = classify(m[1], m[2]);
    if (c.kind === 'frag') blob[c.frag] += m[2];
    else if (c.kind === 'closure') for (const b of m[2].split(/(?=\n  \/\* -{16} \d\d )/)) { const k = b.match(/-{16} (\d\d) /); const id = k ? 'c' + k[1] : '__shell'; blob[id] = (blob[id] || '') + b; }
    else blob.__shell = (blob.__shell || '') + m[2];
  }
  blob.__shell += html.slice(0, html.indexOf('<div class="wrap">')) + html.slice(html.indexOf('</main>'));
  const used = (tok, id) => new RegExp(`(^|[^\\w-])${tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\w-])`).test(blob[id] || '');
  for (const { key, sel } of selectors) {
    const f = owners[key]; if (!f || f === 'base') continue;
    const toks = [...new Set((sel.replace(/:(where|not|has|is)\((?:[^()]|\([^()]*\))*\)/g, '').match(/[.#][a-zA-Z][\w-]*/g) || []).map(t => t.slice(1)))].filter(t => !['kit', 'kit-part', 'kv4'].includes(t));
    // a rule with no class or id of its own (a bare `pre`, `a`) is page-wide, so it stays in base
    if (!toks.length || toks.some(t => Object.keys(blob).some(id => id !== f && used(t, id)))) owners[key] = 'base';
  }
}

// ---------- write ----------
rmSync(OUT, { recursive: true, force: true }); mkdirSync(`${OUT}/lib`, { recursive: true });
const pad = n => String(n).padStart(4, '0');
const cssFor = {}; // frag -> [lines]
const push = (f, line) => (cssFor[f] ||= []).push(line);
cssItems.forEach((it, i) => {
  if (it.type === 'comment') return;
  if (it.type === 'rule') push(owners[String(i)] || 'base', `/*@${pad(i)}*/ ${it.text.trim()}`);
  else if (it.type === 'group') it.inner.forEach((r, j) => {
    if (r.type === 'comment') return;
    const f = r.type === 'rule' ? owners[`${i}.${j}`] || 'base' : 'base';
    push(f, `/*@${pad(i)}.${pad(j)} ${it.prelude}*/ ${r.text.trim()}`);
  });
  else push('base', `/*@${pad(i)}*/ ${it.text.trim()}`);
});
writeFileSync(`${OUT}/base.css`, '/* Shared by every page. Generated by scripts/split.mjs from components/showcase/index.html. */\n' + (cssFor.base || []).join('\n') + '\n');

// scripts: shell and libs keep their slot; closures split into prelude + one block per part
const jsFor = {}; let slot = 0;
const shellScripts = [];
for (const m of scripts) {
  slot++; const [, attrs, code] = m, c = classify(attrs, code), tag = `data-slot="${pad(slot)}"`;
  if (c.kind === 'shell') shellScripts.push(`<script ${tag}${attrs}>${code}</script>`);
  else if (c.kind === 'lib') writeFileSync(`${OUT}/lib/${c.lib}-${pad(slot)}.js`, `// slot ${pad(slot)}\n` + code);
  else if (c.kind === 'frag') (jsFor[c.frag] ||= []).push(`<script ${tag}>${code}</script>`);
  else if (c.kind === 'closure') {
    const parts = code.split(/(?=\n  \/\* -{16} \d\d )/);
    const prelude = parts.shift(), last = parts[parts.length - 1], end = last.lastIndexOf('})();');
    const epilogue = last.slice(end); parts[parts.length - 1] = last.slice(0, end);
    writeFileSync(`${OUT}/lib/closure-${pad(slot)}.js`, JSON.stringify({ slot: pad(slot), prelude, epilogue }));
    parts.forEach((b, k) => { const id = 'c' + b.match(/-{16} (\d\d) /)[1]; (jsFor[id] ||= []).push(`<script ${tag} data-block="${pad(k)}">${b}</script>`); });
  }
}

// the skeleton: the page with the parts, their CSS and every body script taken out
const wrapOpen = html.indexOf('<div class="wrap">'), mainClose = html.indexOf('</main>');
const wrapClose = html.lastIndexOf('</div>', mainClose);
let skel = html.slice(0, wrapOpen + '<div class="wrap">'.length) + '\n<!--@@PARTS@@-->\n    ' + html.slice(wrapClose);
skel = skel.replace(main[0], '<style>\n/*@@CSS@@*/\n</style>');
for (const m of scripts) skel = skel.replace(m[0], '');
skel = skel.replace('</body>', '<!--@@SCRIPTS@@-->\n</body>');
writeFileSync(`${OUT}/skeleton.html`, skel);
writeFileSync(`${OUT}/lib/shell-scripts.html`, shellScripts.join('\n'));

// the squares grid on its own, for pages not built with assemble.mjs (assembled pages already have it: canvas in the skeleton, script in the shell)
{
  const g = scripts.find(m => classify(m[1], m[2]).grid), rule = cssItems.find(it => it.type === 'rule' && it.prelude === '#bg');
  if (!g || !rule) throw new Error('bg-grid: the grid script or the #bg rule is missing from the showcase');
  writeFileSync(`${OUT}/bg-grid.html`, `<!-- part bg-grid | page background | The faint squares grid that shows only in open gaps. Paste the canvas first in <body>, the style in the page's CSS, and the script at the end of <body>. Fit it to the page with data-blocks, data-live, data-bands and data-ghosts on the canvas (see the script's top comment). Page content must sit above it: .shell { position: relative; z-index: 1 }. -->
<style>
${rule.text.trim()}
</style>
<canvas id="bg" aria-hidden="true"></canvas>
<script>${g[2]}</script>
`);
}

const manifest = [];
for (const f of frags) {
  f.html = f.html.replace(/ data-frag="[^"]*"/g, ''); // markers were only for finding owners
  const needs = [];
  if (/data-hairline/.test(f.html)) needs.push('hairline');
  if (f.id === 'c01' || f.id === 'c02') needs.push('pair:c01,c02');
  const head = `<!-- part ${f.id} | ${f.kind}${f.group ? ' | group ' + f.group : ''} | ${f.name || ''}${f.heading ? ' | ' + f.heading : ''}${needs.length ? ' | needs ' + needs.join(' ') : ''} -->`;
  const body = [head];
  if (f.open) body.push(`<!--@@OPEN ${f.open}-->`);
  if (cssFor[f.id]) body.push('<style>\n' + cssFor[f.id].join('\n') + '\n</style>');
  body.push(f.html);
  if (jsFor[f.id]) body.push(...jsFor[f.id]);
  writeFileSync(`${OUT}/${f.id}.html`, body.join('\n') + '\n');
  manifest.push({ id: f.id, kind: f.kind, group: f.group, name: f.name, heading: f.heading, needs, css: (cssFor[f.id] || []).length, js: (jsFor[f.id] || []).length });
}
const orphanCss = Object.keys(cssFor).filter(k => k !== 'base' && !frags.some(f => f.id === k));
const orphanJs = Object.keys(jsFor).filter(k => !frags.some(f => f.id === k));
writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 1));

// the index people read: what each part is, and how to build a page from them
const row = m => `| \`${m.id}\` | ${m.kind === 'part' ? groupName[m.group] : m.kind} | ${m.heading || m.name || ''} | ${m.needs.join(', ')} |`;
const groupName = Object.fromEntries(manifest.filter(m => m.kind === 'group').map(m => [m.group, m.name]));
writeFileSync(`${OUT}/README.md`, `# Parts

Every piece of the showcase (\`components/showcase/index.html\`) as its own file. **Made by \`node scripts/split.mjs\`; never edit these files by hand.** Change the showcase, then split again.

## Build a page from parts

1. Pick the parts you need from the table below, in the order the page shows them.
2. \`node scripts/assemble.mjs hero,c15,n20,why,endcard,footer -o page.html\`
   - A part brings its group heading with it. \`c01\` and \`c02\` always come together. The icon sprites always come.
   - \`all\` gives the whole showcase back.
   - For a real app page, add \`--app "Shop settings"\`. The sidebar keeps only links to sections on the page, the top bar shows your title with no "v4 · Live" badge, and the group numbers and "what to try" lines go. Then rewrite the headings (\`.kit-h\`) and group heads as your app's own words.
   - One part alone is the same command with one id: \`node scripts/assemble.mjs n47 -o n47.html\`. Never open \`n47.html\` from this folder on its own: it has no page shell and no CSS.
3. Change the words and sample data inside the page. Keep every class, rule and script as it is.
4. Check it: \`node scripts/singles.mjs --ids c15,n20\` checks parts against the showcase, and
   \`node scripts/match.mjs components/showcase/index.html page.html\` checks a whole page.
   Pages made with \`--app\` will not match, by design; check them for console errors and sideways scroll instead.

First time: \`cd scripts && npm install\` (Playwright, pixelmatch, pngjs).

## Work on a copy

To try a change without touching the kit, copy it, then point the scripts at the copy:

- \`node scripts/split.mjs <copy>/components/showcase/index.html <copy>/components/parts\`
- \`node scripts/singles.mjs --kit <copy> --ids n90\`
- \`node scripts/assemble.mjs n90 -o x.html --parts <copy>/components/parts\`

## Things that trip people up

- **\`base.css\` holds every part's CSS**, not just shared rules. A rule moves into a part's own file only when no other part uses any of its class names. So a page that loads \`base.css\` already styles \`#n47\`. If you rebuild a part by hand, give it a new id, or your rules will mix with the real ones.
- **The main button.** \`base.css\` has two \`.kit .b.pri\` rules: an older dark ink one, then a later one that makes it orange with \`--on-accent\` text. The later one wins, and it is the house rule (\`DESIGN.md\`): orange, white text by day, dark text at night.
- Never edit these files: \`split.mjs\` deletes and rewrites this folder every time.

Each part looks exactly as it does in the showcase because:

- \`base.css\` holds every style rule, in showcase order. Each rule starts with \`/*@NNNN*/\`, its place in the showcase.
- Scripts keep their showcase order (\`data-slot\`). Older parts share one script; \`lib/closure-*.js\` holds its start and end.
- \`skeleton.html\` is the page shell: the sidebar, top bar, Options sheet and fonts.

## The background grid

The faint squares grid that shows only in open gaps (\`DESIGN.md\`, *Recurring parts*) comes with every assembled page: its canvas is in \`skeleton.html\` and its script is in \`lib/shell-scripts.html\`. For any other page, paste \`bg-grid.html\`: the canvas first in \`<body>\`, the \`#bg\` rule in the CSS, the script at the end. Tell it which boxes to keep clear of with \`data-blocks\` on the canvas (and \`data-bands\`, \`data-ghosts\`, \`data-live\`), and keep the page above it (\`.shell { position: relative; z-index: 1 }\`). The Taste Lab page (\`tools/taste-lab/src/page.html\`) is a worked example.

## The parts

| File | Group | What it shows | Needs |
|---|---|---|---|
${manifest.filter(m => !['group', 'icons'].includes(m.kind)).map(row).join('\n')}
`);
console.log(`${frags.length} fragments, base.css ${cssFor.base.length} rules, ${shellScripts.length} shell scripts.`);
if (orphanCss.length || orphanJs.length) console.log('orphans', { orphanCss, orphanJs });
