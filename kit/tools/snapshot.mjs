// Snapshot: every element under a root, its computed styles, in each state. Used to prove a refactor moved nothing.
// Usage: node kit/tools/snapshot.mjs <page.html> <root-selector> <states.json> <out.json> [--theme light|dark] [--w 1440]
// states.json: [{ "name": "rest", "do": [] }, { "name": "hover", "do": [{ "hover": "tbody tr" }] }, …]
//   actions: hover | click | fill [sel, value] | wait ms. Selectors are relative to the root.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const PROPS = ['display', 'position', 'width', 'height', 'min-height', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'gap', 'font-family', 'font-size', 'font-weight', 'font-style', 'line-height',
  'letter-spacing', 'text-transform', 'text-align', 'white-space', 'font-variant-numeric', 'color', 'background-color', 'border-top-width',
  'border-top-style', 'border-top-color', 'border-bottom-width', 'border-bottom-color', 'border-left-width', 'border-left-color',
  'border-top-left-radius', 'box-shadow', 'opacity', 'visibility', 'transform', 'transition-property', 'transition-duration',
  'transition-timing-function', 'transition-delay', 'cursor', 'stroke', 'fill', 'z-index', 'overflow-x'];

export async function act(page, root, steps) {
  for (const s of steps || []) {
    const loc = sel => page.locator(`${root} ${sel}`).first();
    if (s.hover) await loc(s.hover).hover();
    if (s.click) await loc(s.click).click();
    if (s.fill) await loc(s.fill[0]).fill(s.fill[1]);
    if (s.press) await page.keyboard.press(s.press);
    if (s.mouseAway) await page.mouse.move(0, 0);
    await page.waitForTimeout(s.wait ?? 700);
  }
}

export function grab({ root, props, pseudo }) {
  const r = document.querySelector(root); if (!r) return null;
  const els = [r, ...r.querySelectorAll('*')].filter(e => !e.closest('svg') || e.tagName.toLowerCase() === 'svg');
  return els.map((e, i) => {
    const out = { i, tag: e.tagName.toLowerCase(), text: (e.childNodes[0]?.nodeType === 3 ? e.childNodes[0].textContent.trim().slice(0, 24) : '') };
    for (const ps of [null, ...(pseudo ? ['::before', '::after'] : [])]) {
      const cs = getComputedStyle(e, ps);
      if (ps && (cs.content === 'none' || cs.content === 'normal')) continue;
      for (const p of props) out[(ps || '') + p] = cs.getPropertyValue(p);
    }
    return out;
  });
}

async function main() {
  const args = process.argv.slice(2);
  const flag = (n, d) => { const i = args.indexOf(n); return i < 0 ? d : args.splice(i, 2)[1]; };
  const theme = flag('--theme', 'light'), w = +flag('--w', 1440);
  const [file, root, statesFile, out] = args;
  const states = JSON.parse(readFileSync(statesFile, 'utf8'));
  const browser = await chromium.launch();
  const res = {};
  for (const st of states) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(resolve(file)).href, { waitUntil: 'load' });
    await page.locator(root).scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
    await act(page, root, st.do);
    res[st.name] = await page.evaluate(grab, { root, props: PROPS, pseudo: true });
    await ctx.close();
  }
  await browser.close();
  writeFileSync(out, JSON.stringify(res));
  console.log(`snapshot ${file} → ${out}: ${Object.entries(res).map(([k, v]) => `${k} ${v?.length ?? 'MISSING'}`).join(', ')}`);
}
if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
