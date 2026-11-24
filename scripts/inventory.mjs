// Piece inventory: every basic piece (button, field, checkbox, tab, table cell, chip, card …) the pages really
// render, grouped by size and by colour, with the parts that use each version. Read-only on the pages.
// Usage: node scripts/inventory.mjs [page.html ...] [--out notes/piece-inventory.md] [--json raw.json]
//   no pages: the showcase. Each extra page (an app like Fossa) gets its own columns in the report.
import { chromium } from 'playwright';
import { writeFileSync, readFileSync } from 'node:fs';
import { resolve, basename, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const kit = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i < 0 ? d : args.splice(i, 2)[1]; };
const out = flag('--out', resolve(kit, 'notes/piece-inventory.md'));
const jsonOut = flag('--json', null);
const pages = args.length ? args : [resolve(kit, 'components/showcase/index.html')];
if (!args.length || !pages.includes(resolve(kit, 'components/showcase/index.html'))) pages.unshift(resolve(kit, 'components/showcase/index.html'));
const uniq = [...new Set(pages.map(p => resolve(p)))];

// part id -> what it shows, from the parts table
const partName = Object.fromEntries(readFileSync(resolve(kit, 'components/parts/README.md'), 'utf8')
  .split('\n').filter(l => l.startsWith('| `')).map(l => l.split('|').map(s => s.trim().replace(/`/g, '')))
  .map(c => [c[1], c[3]]));
const tokenNames = [...readFileSync(resolve(kit, 'components/tokens.css'), 'utf8').matchAll(/(--[a-z0-9-]+)\s*:/g)].map(m => m[1]);

function collect({ partIds, tokenNames }) {
  const ids = new Set(partIds);
  // token value -> name, resolved by the browser so formats match computed styles
  const probe = document.createElement('i'); document.body.append(probe);
  const tok = {};
  for (const n of tokenNames) {
    probe.style.color = ''; probe.style.color = `var(${n})`;
    const v = getComputedStyle(probe).color;
    if (v && v !== 'rgba(0, 0, 0, 0)' && !(v in tok)) tok[v] = n;
  }
  probe.remove();
  const name = c => c === 'rgba(0, 0, 0, 0)' ? 'none' : (tok[c] || `RAW ${c}`);
  const owner = el => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      if (e.id && ids.has(e.id)) return e.id;
      if (e.dataset?.view) return 'view:' + e.dataset.view;
    }
    const s = el.closest('section[id], main[id], [id^="h-"], #auth, #dash, #fleet, #settings');
    return s ? s.id : '(page shell)';
  };
  const kinds = [
    ['button', 'button, [role=button], a.b, a.btn'],
    ['text field', 'input:not([type]), input[type=text], input[type=email], input[type=password], input[type=search], input[type=tel], input[type=number], input[type=url], textarea'],
    ['select', 'select, [role=combobox], [aria-haspopup=listbox]'],
    ['checkbox', 'input[type=checkbox], [role=checkbox]'],
    ['radio', 'input[type=radio], [role=radio]'],
    ['switch', '[role=switch]'],
    ['slider', 'input[type=range], [role=slider]'],
    ['tab', '[role=tab]'],
    ['menu or list option', '[role=option], [role=menuitem], [role=menuitemradio], [role=menuitemcheckbox]'],
    ['table header cell', 'th'],
    ['table cell', 'td'],
    ['dialog or sheet', 'dialog, [role=dialog], [role=alertdialog]'],
    ['tooltip', '[role=tooltip]'],
    ['key', 'kbd, .kbd'],
  ];
  const classKinds = [
    ['chip, pill, badge or tag', /(^|[\s-])(chip|pill|badge|tag|prop|status)s?($|[\s-])/],
    ['card', /(^|[\s-])card($|[\s-])/],
    ['avatar', /(^|[\s-])(av|avatar)($|[\s-])/],
  ];
  const seen = new Set(), rows = [];
  const rec = (kind, el) => {
    if (seen.has(el)) return; seen.add(el);
    let box = el, custom = false;
    const r0 = el.getBoundingClientRect(), cs0 = getComputedStyle(el);
    // custom checkboxes/radios/switches hide the real input; measure the drawn box next to it
    if (/checkbox|radio|switch|slider/.test(kind) && el.tagName === 'INPUT' && (r0.width < 4 || +cs0.opacity === 0) && el.nextElementSibling) { box = el.nextElementSibling; custom = true; }
    const r = box.getBoundingClientRect(), cs = getComputedStyle(box);
    const shown = r.width > 0 && r.height > 0 && cs.visibility !== 'hidden';
    const px = v => Math.round(parseFloat(v) || 0);
    const iconOnly = kind === 'button' && !el.textContent.trim();
    rows.push({
      kind: kind === 'button' && iconOnly ? 'icon button' : kind, part: owner(el), shown, custom,
      cls: (typeof el.className === 'string' ? el.className : el.getAttribute('class') || '').trim().split(/\s+/).slice(0, 3).join(' ') || el.tagName.toLowerCase(),
      h: shown ? Math.round(r.height) : null, w: shown ? Math.round(r.width) : null,
      radius: px(cs.borderTopLeftRadius) >= 99 || cs.borderTopLeftRadius.includes('%') ? 'full' : px(cs.borderTopLeftRadius),
      padX: px(cs.paddingLeft), font: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
      size: px(cs.fontSize), weight: cs.fontWeight,
      bg: name(cs.backgroundColor), fg: name(cs.color),
      border: px(cs.borderTopWidth) ? `${px(cs.borderTopWidth)}px ${name(cs.borderTopColor)}` : 'none',
      shadow: cs.boxShadow === 'none' ? 'none' : 'yes',
    });
  };
  for (const [k, sel] of kinds) document.querySelectorAll(sel).forEach(el => rec(k, el));
  for (const el of document.querySelectorAll('[class]')) {
    const c = typeof el.className === 'string' ? el.className : el.getAttribute('class');
    for (const [k, re] of classKinds) if (c.split(/\s+/).some(x => re.test(x))) { rec(k, el); break; }
  }
  return rows;
}

const browser = await chromium.launch();
const all = [];
for (const file of uniq) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', colorScheme: 'light' });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
  // scroll the whole page so lazy parts mount
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
  await page.waitForTimeout(800);
  const rows = await page.evaluate(collect, { partIds: Object.keys(partName), tokenNames });
  const src = basename(file) === 'index.html' ? 'showcase' : basename(file, '.html');
  rows.forEach(r => (r.src = src));
  all.push(...rows);
  console.log(`${src}: ${rows.length} pieces${errors.length ? `, ${errors.length} page errors` : ''}`);
  await ctx.close();
}
await browser.close();
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(all, null, 1));

// ---------- report ----------
const srcs = [...new Set(all.map(r => r.src))];
const label = p => partName[p] ? `${p}` : p;
const sizeKey = r => `${r.h ?? 'hidden'} | ${r.radius} | ${r.padX} | ${r.font} ${r.size}/${r.weight}`;
const colourKey = r => `${r.bg} | ${r.fg} | ${r.border}${r.shadow === 'yes' ? ' + shadow' : ''}`;
const table = (rows, keyFn, head) => {
  const g = new Map();
  for (const r of rows) { const k = keyFn(r); if (!g.has(k)) g.set(k, []); g.get(k).push(r); }
  const lines = [`| ${head} | ${srcs.map(s => s).join(' | ')} | Parts | Classes |`, `|${'---|'.repeat(head.split('|').length + srcs.length + 2)}`];
  for (const [k, rs] of [...g].sort((a, b) => b[1].length - a[1].length)) {
    const parts = [...new Set(rs.map(r => label(r.part)))];
    const cls = [...new Set(rs.map(r => r.cls))];
    lines.push(`| ${k} | ${srcs.map(s => rs.filter(r => r.src === s).length || '').join(' | ')} | ${parts.slice(0, 12).join(', ')}${parts.length > 12 ? ` +${parts.length - 12}` : ''} | ${cls.slice(0, 6).map(c => '`' + c + '`').join(' ')}${cls.length > 6 ? ` +${cls.length - 6}` : ''} |`);
  }
  return { md: lines.join('\n'), n: g.size };
};
const kindsOrder = [...new Set(all.map(r => r.kind))];
const summary = kindsOrder.map(k => {
  const rs = all.filter(r => r.kind === k), shown = rs.filter(r => r.shown);
  const n = f => new Set(shown.map(f)).size;
  return `| ${k} | ${srcs.map(s => rs.filter(r => r.src === s).length).join(' | ')} | ${n(r => r.h)} | ${n(r => r.radius)} | ${n(colourKey)} | ${new Set(rs.map(r => r.cls)).size} |`;
});
const rawColours = new Map();
for (const r of all) for (const c of [r.bg, r.fg, r.border]) for (const m of c.matchAll(/RAW (rgba?\([^)]*\))/g)) rawColours.set(m[1], (rawColours.get(m[1]) || 0) + 1);

let md = `# Piece inventory

Made by \`node scripts/inventory.mjs\` on ${new Date().toISOString().slice(0, 10)}. Do not edit by hand; run it again.
Pages: ${srcs.join(', ')}. Light theme, 1440 px wide, reduced motion, after scrolling the whole page once.

Every basic piece the pages really draw, measured by the browser. **Size** is height (px, or "hidden" when it was not on screen, such as a closed menu), corner radius, side padding, and font size/weight. **Colour** names each colour by its token; \`RAW\` means a colour that is not a token.
A piece is found by its HTML (\`button\`, \`input\`, \`th\`, roles) or, for chips, cards and avatars, by its class name, so a few may be counted under the wrong piece.

## Summary

| Piece | ${srcs.join(' | ')} | Heights | Radii | Colour sets | Class names |
|${'---|'.repeat(srcs.length + 5)}
${summary.join('\n')}

## Colours that are not tokens

${rawColours.size ? [...rawColours].sort((a, b) => b[1] - a[1]).map(([c, n]) => `- \`${c}\` × ${n}`).join('\n') : 'None.'}
`;
for (const k of kindsOrder) {
  const rs = all.filter(r => r.kind === k);
  const s = table(rs, sizeKey, 'Height | Radius | Pad | Font');
  const c = table(rs, colourKey, 'Background | Text | Border');
  md += `\n## ${k} (${rs.length})\n\n### By size: ${s.n} versions\n\n${s.md}\n\n### By colour: ${c.n} versions\n\n${c.md}\n`;
}
writeFileSync(out, md);
console.log(`wrote ${out}`);
