// Match check: does a built page look the same as the reference, section by section?
// Usage: node scripts/match.mjs <reference.html> <candidate.html> [--ids a,b,c] [--out dir] [--min 99]
// Shoots every `section[id]` of the reference (or only --ids) at 1440 and 390 px, light and night,
// with reduced motion so live parts hold still, then pixel-diffs each pair. Exit 1 if any is under --min.
import { chromium } from 'playwright';
import { diff, styles, styleDiff, LIVE, settle } from './diff.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : args.splice(i, 2)[1]; };
const out = resolve(opt('out', 'match-out')), min = +opt('min', 99), only = opt('ids', '');
const [refPath, candPath] = args;
if (!refPath || !candPath) { console.error('usage: node match.mjs <reference.html> <candidate.html> [--ids a,b] [--out dir] [--min 99]'); process.exit(2); }
mkdirSync(out, { recursive: true });

const VIEWS = [{ w: 1440, h: 900 }, { w: 390, h: 844 }];
const THEMES = ['light', 'dark'];

async function open(browser, path, w, h, theme) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  // live parts use random data and the clock: seed one and stop the other, so two runs agree
  await page.addInitScript(() => { let s = 42; Math.random = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); });
  await page.clock.install({ time: new Date('2026-10-29T09:00:00') });
  await page.goto(pathToFileURL(resolve(path)).href, { waitUntil: 'load' });
  await page.evaluate(t => { document.documentElement.dataset.theme = t; }, theme);
  await page.evaluate(() => document.fonts.ready);
  await page.clock.runFor(3000);
  await settle(page);
  return { ctx, page, errors };
}

async function shot(page, id) {
  const el = page.locator('#' + CSS_escape(id)).first();
  if (!(await el.count())) return null;
  await el.scrollIntoViewIfNeeded();
  await page.clock.runFor(150);
  // a section at a half-pixel spot anti-aliases differently; nudge it onto a whole pixel first
  await el.evaluate(e => { const r = e.getBoundingClientRect(); e.style.translate = `${-((r.left + scrollX) % 1)}px ${-((r.top + scrollY) % 1)}px`; });
  // hide fixed chrome so it never lands on a section shot
  return el.screenshot({ animations: 'disabled', caret: 'hide', timeout: 20000, style: '.topbar,.sidebar,.scrim,.sheet,#toast{visibility:hidden!important} .layers-sticky{position:static!important}' }).catch(() => null);
}
const CSS_escape = s => s.replace(/([^\w-])/g, '\\$1');

const browser = await chromium.launch();
const results = [];
let worst = 100;
for (const v of VIEWS) for (const theme of THEMES) {
  const R = await open(browser, refPath, v.w, v.h, theme), C = await open(browser, candPath, v.w, v.h, theme);
  const ids = only ? only.split(',') : await R.page.$$eval('section[id]', els => els.map(e => e.id));
  for (const id of ids) {
    const a = await shot(R.page, id), b = await shot(C.page, id);
    const tag = `${id}@${v.w}-${theme}`;
    if (!a) { results.push({ tag, status: 'not in reference' }); continue; }
    if (!b) { results.push({ tag, status: 'MISSING', pct: 0 }); worst = 0; continue; }
    const d = diff(a, b);
    worst = Math.min(worst, d.pct);
    const sd = LIVE[id] ? [] : styleDiff(await styles(R.page, '#' + CSS_escape(id)), await styles(C.page, '#' + CSS_escape(id)));
    const r = { tag, pct: +d.pct.toFixed(2), sizeRef: d.sizeA, sizeCand: d.sizeB, styleDiffs: sd.slice(0, 20) };
    const bar = LIVE[id] ?? min;
    if (d.pct < bar || sd.length) { r.status = 'DIFF'; writeFileSync(`${out}/${tag}.diff.png`, d.png); writeFileSync(`${out}/${tag}.ref.png`, a); writeFileSync(`${out}/${tag}.cand.png`, b); }
    results.push(r);
  }
  // the shell (sidebar, top bar) as the reader first sees it
  const top = async p => { await p.evaluate(() => scrollTo(0, 0)); await p.clock.runFor(300); return p.screenshot({ animations: 'disabled', caret: 'hide' }); };
  const d = diff(await top(R.page), await top(C.page)), tag = `viewport-top@${v.w}-${theme}`;
  worst = Math.min(worst, d.pct);
  results.push({ tag, pct: +d.pct.toFixed(2), status: d.pct < min ? 'DIFF' : undefined });
  if (d.pct < min) writeFileSync(`${out}/${tag}.diff.png`, d.png);
  results.push({ tag: `errors@${v.w}-${theme}`, reference: R.errors, candidate: C.errors });
  await R.ctx.close(); await C.ctx.close();
}
await browser.close();
writeFileSync(`${out}/report.json`, JSON.stringify(results, null, 1));
const bad = results.filter(r => r.status === 'DIFF' || r.status === 'MISSING');
for (const r of bad) { console.log(`${r.status.padEnd(8)} ${r.tag} ${r.pct ?? ''}% ${r.sizeRef ?? ''} vs ${r.sizeCand ?? ''}`); for (const x of (r.styleDiffs || []).slice(0, 3)) console.log('        ', x.path, x.why.slice(0, 160)); }
const errs = results.filter(r => r.candidate?.length); for (const e of errs) console.log('JS ERRORS', e.tag, e.candidate.slice(0, 3));
console.log(`${results.filter(r => r.pct != null).length} shots, worst ${worst.toFixed(2)}%, ${bad.length} under ${min}%. Report: ${out}/report.json`);
process.exit(bad.length || errs.length ? 1 : 0);
