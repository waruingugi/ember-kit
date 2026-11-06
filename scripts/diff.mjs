// Parts that change on their own over time (random data, timers, replays, a pulsing ring, scroll state).
// They get only the pixel check, at this bar; every other part must pass the exact style check too.
// n26–n28 and c31 are scroll stacks: alone, the page is shorter, so their sticky cards sit at another offset.
export const LIVE = { c01: 95, n10: 99, hero: 99, top: 99, n26: 99, n27: 99, n28: 99, c31: 99 }; // top is the hero's section id
// Parts that run a timer once seen (n42 counts down 8 s, then closes its banner): wait this long before a shot,
// so the showcase and the part alone are caught in the same end state.
export const WAIT = { n42: 14000, n64: 95000 }; // n64 counts down 90 s to its "Deal ended" state
// Put a page in a state two runs agree on: sticky scenes sit still, and every lazy part has been seen.
export async function settle(page) {
  await page.addStyleTag({ content: '.layers-sticky{position:static!important}' });
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 300) { await page.evaluate(y => scrollTo(0, y), y); await page.clock.runFor(120); await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))).catch(() => {}); }
  await page.evaluate(() => scrollTo(0, 0)); await page.clock.runFor(400);
}
// equal, allowing every number in px to be up to 1 px apart (sub-pixel rounding)
const close = (x, y) => {
  if (x === y) return true;
  const nx = x.match(/-?\d*\.?\d+/g) || [], ny = y.match(/-?\d*\.?\d+/g) || [];
  return x.replace(/-?\d*\.?\d+/g, '#') === y.replace(/-?\d*\.?\d+/g, '#') && nx.length === ny.length && nx.every((v, i) => Math.abs(v - ny[i]) <= 1);
};

// Exact check: every element in a section, with the styles that make the look and its box (to 1 px).
const PROPS = ['color', 'background-color', 'background-image', 'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'text-transform',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'border-top-width', 'border-top-color', 'border-top-style', 'border-right-color', 'border-bottom-color', 'border-left-color', 'border-radius', 'box-shadow',
  'opacity', 'display', 'gap', 'grid-template-columns', 'fill', 'stroke', 'stroke-width', 'visibility'];
export async function styles(page, selector) {
  return page.locator(selector).first().evaluate((root, [PROPS, live]) => {
    const o = root.getBoundingClientRect(), out = [];
    const walk = (el, path) => {
      const cs = getComputedStyle(el), r = el.getBoundingClientRect();
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').replace(/\s+/g, ' ').trim().slice(0, 60);
      // is-in only says the reveal has run, which depends on scroll timing, not on the look
      const cls = (typeof el.className === 'string' ? el.className : el.getAttribute('class') || '').replace(/\bis-in\b/g, '').replace(/\s+/g, ' ').trim();
      out.push({ path, tag: el.tagName.toLowerCase(), cls, text: own,
        box: [r.left - o.left, r.top - o.top, r.width, r.height].map(Math.round), css: PROPS.map(p => cs.getPropertyValue(p)) });
      // a live part inside a bigger section (c01 in its group) is checked by pixels only
      if (el !== root && live.includes(el.id)) return;
      [...el.children].forEach((c, i) => walk(c, path + '/' + i));
    };
    walk(root, '');
    return out;
  }, [PROPS, Object.keys(LIVE)]);
}
// returns the elements that differ; boxes may be 1 px apart (rounding), everything else must be equal
export function styleDiff(a, b) {
  const byPath = new Map(b.map(e => [e.path, e])), out = [];
  for (const e of a) {
    const f = byPath.get(e.path);
    if (!f) { out.push({ path: e.path, why: `missing <${e.tag} class="${e.cls}">` }); continue; }
    if (e.tag !== f.tag || e.cls !== f.cls) { out.push({ path: e.path, why: `<${e.tag}.${e.cls}> became <${f.tag}.${f.cls}>` }); continue; }
    if (e.text !== f.text) out.push({ path: e.path, why: `text "${e.text}" became "${f.text}"` });
    const bad = PROPS.filter((p, i) => !close(e.css[i], f.css[i])).map(p => `${p}: ${e.css[PROPS.indexOf(p)]} → ${f.css[PROPS.indexOf(p)]}`);
    if (bad.length) out.push({ path: e.path, why: bad.join('; ') });
    const hidden = x => x.box[2] === 0 && x.box[3] === 0; // a hidden element has no place to compare
    if (!hidden(e) && !hidden(f) && e.box.some((v, i) => Math.abs(v - f.box[i]) > 1)) out.push({ path: e.path, why: `box ${e.box} → ${f.box}` });
  }
  if (b.length > a.length) out.push({ path: '', why: `${b.length - a.length} extra elements` });
  return out;
}

// Compare two screenshots. A pixel counts as the same when the other shot has a close colour at the same
// spot or one pixel away, so half-pixel layout nudges (invisible to people) do not count as changes.
import { PNG } from 'pngjs';

const TOL = 40; // biggest channel gap (0–255) still treated as the same colour

export function diff(bufA, bufB) {
  const A = PNG.sync.read(bufA), B = PNG.sync.read(bufB);
  const W = Math.max(A.width, B.width), H = Math.max(A.height, B.height);
  const px = (img, x, y) => (x < 0 || y < 0 || x >= img.width || y >= img.height) ? null : (y * img.width + x) * 4;
  const near = (src, x, y, other) => {
    const i = px(src, x, y); if (i == null) return false;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const j = px(other, x + dx, y + dy); if (j == null) continue;
      if (Math.abs(src.data[i] - other.data[j]) <= TOL && Math.abs(src.data[i + 1] - other.data[j + 1]) <= TOL && Math.abs(src.data[i + 2] - other.data[j + 2]) <= TOL) return true;
    }
    return false;
  };
  const out = new PNG({ width: W, height: H }); out.data.fill(255);
  let bad = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (near(A, x, y, B) && near(B, x, y, A)) continue;
    bad++; const o = (y * W + x) * 4; out.data[o] = 255; out.data[o + 1] = 0; out.data[o + 2] = 0;
  }
  return { pct: 100 * (1 - bad / (W * H)), sizeA: `${A.width}x${A.height}`, sizeB: `${B.width}x${B.height}`, sameSize: A.width === B.width && A.height === B.height, png: PNG.sync.write(out) };
}
