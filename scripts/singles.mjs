// Each part alone: assemble a page with just that part (plus the shell) and check it looks the same as in
// the showcase and throws no errors. Usage: node scripts/singles.mjs [--ids a,b] [--w 1440] [--theme light] [--min 99] [--kit dir]
// --kit checks a copy of the kit (its showcase and components/parts) instead of this one; the scripts stay here.
import { chromium } from 'playwright';
import { diff, styles, styleDiff, LIVE, WAIT, settle } from './diff.mjs';
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const HERE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : args.splice(i, 2)[1]; };
const KIT = resolve(opt('kit', HERE));
const w = +opt('w', 1440), theme = opt('theme', 'light'), min = +opt('min', 99), only = opt('ids', '');
const manifest = JSON.parse(readFileSync(`${KIT}/components/parts/manifest.json`, 'utf8'));
const ids = only ? only.split(',') : manifest.filter(m => !['group', 'icons'].includes(m.kind)).map(m => m.id);
const tmp = `${tmpdir()}/ember-singles`; mkdirSync(tmp, { recursive: true });

const browser = await chromium.launch();
async function load(path) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(() => { let s = 42; Math.random = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); });
  await page.clock.install({ time: new Date('2026-10-29T09:00:00') });
  await page.goto(pathToFileURL(path).href, { waitUntil: 'load' });
  await page.evaluate(t => { document.documentElement.dataset.theme = t; }, theme);
  await page.evaluate(() => document.fonts.ready); await page.clock.runFor(3000);
  await settle(page);
  return { ctx, page, errors };
}
async function shot(page, id, wait = 1500) {
  const el = page.locator(id).first(); if (!(await el.count())) return null;
  await el.scrollIntoViewIfNeeded(); await page.clock.runFor(wait);
  // a section at a half-pixel spot anti-aliases differently; nudge it onto a whole pixel first
  await el.evaluate(e => { const r = e.getBoundingClientRect(); e.style.translate = `${-((r.left + scrollX) % 1)}px ${-((r.top + scrollY) % 1)}px`; });
  return el.screenshot({ animations: 'disabled', caret: 'hide', style: '.topbar,.sidebar,.scrim,.sheet,#toast{visibility:hidden!important} .layers-sticky{position:static!important}' }).catch(() => null);
}
const sectionId = id => ({ hero: '#top', endcard: '.wrap > .endcard', footer: '.wrap > footer' })[id] || `[id="${id}"]`;

const ref = await load(`${KIT}/components/showcase/index.html`);
let bad = 0;
for (const id of ids) {
  const file = `${tmp}/${id}.html`;
  execFileSync('node', [`${HERE}/scripts/assemble.mjs`, id, '-o', file, '--parts', `${KIT}/components/parts`]);
  const C = await load(file);
  const sid = sectionId(id), a = await shot(ref.page, sid, WAIT[id]), b = await shot(C.page, sid, WAIT[id]);
  let pct = 0, note = '';
  if (!a || !b) note = !a ? 'not in showcase' : 'MISSING';
  else {
    const d = diff(a, b); pct = d.pct;
    if (!d.sameSize) note = `size ${d.sizeA} vs ${d.sizeB}`;
    if (pct < (LIVE[id] ?? min)) { mkdirSync(`${tmp}/out`, { recursive: true }); writeFileSync(`${tmp}/out/${id}.diff.png`, d.png); writeFileSync(`${tmp}/out/${id}.cand.png`, b); writeFileSync(`${tmp}/out/${id}.ref.png`, a); }
  }
  const sd = a && b && !LIVE[id] ? styleDiff(await styles(ref.page, sid), await styles(C.page, sid)) : [];
  const fail = C.errors.length || sd.length || pct < (LIVE[id] ?? min);
  if (fail) bad++;
  console.log(`${fail ? 'FAIL' : 'ok  '} ${id.padEnd(14)} ${pct.toFixed(2)}% ${sd.length ? sd.length + ' style diffs' : ''} ${note} ${C.errors.length ? 'errors: ' + C.errors.slice(0, 2).join(' | ') : ''}`);
  for (const x of sd.slice(0, 3)) console.log('       ', x.path, x.why.slice(0, 160));
  await C.ctx.close();
}
await browser.close();
console.log(`${ids.length - bad}/${ids.length} parts match alone at ${w}px ${theme}. Diffs in ${tmp}/out`);
process.exit(bad ? 1 : 0);
