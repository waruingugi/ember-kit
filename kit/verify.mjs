// verify: does a page look and move like ember-kit? Prints each problem with its fix, then PASS or FAIL.
//   node kit/verify.mjs page.html --card table [--root ".tbl"]   compare a piece with its house part, state by state, both themes, motion too
//   node kit/verify.mjs page.html --house [--root "main"]         house rules for any page or new piece (no card needed)
//   add --json out.json to save the findings
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { act } from './tools/snapshot.mjs';

const KIT = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const bool = n => { const i = args.indexOf(n); if (i < 0) return false; args.splice(i, 1); return true; };
const cardName = flag('--card', null), house = bool('--house'), jsonOut = flag('--json', null);
let rootSel = flag('--root', null);
const file = args[0];
if (!file || (!cardName && !house)) { console.error('usage: node kit/verify.mjs page.html (--card <name> | --house) [--root sel]'); process.exit(2); }
// serve the page's folder over http: a built app (Vite, Next export) links its CSS and loads module scripts, which file:// blocks
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, dirname as dn, basename, join, normalize, relative, isAbsolute } from 'node:path';
const ROOT = dn(resolve(file)), TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
const server = createServer(async (req, res) => {
  let p; try { p = normalize(join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname))); } catch { res.writeHead(400); return res.end(); }
  const rel = relative(ROOT, p); if (rel.startsWith('..') || isAbsolute(rel)) { res.writeHead(403); return res.end(); } // stay inside the page's folder
  try { const body = await readFile(p); res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' }); res.end(body); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/${encodeURIComponent(basename(file))}`;
const findings = []; // { level: 'fail'|'warn', where, what, fix }
const fail = (where, what, fix) => findings.push({ level: 'fail', where, what, fix });
const warn = (where, what, fix) => findings.push({ level: 'warn', where, what, fix });
const browser = await chromium.launch();

async function open(u, { theme = 'light', w = 1440, h = 900, motion = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme, reducedMotion: motion ? 'no-preference' : 'reduce' });
  const page = await ctx.newPage(); const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errors.push((m.type() === 'warning' ? 'warning: ' : '') + m.text().slice(0, 160)); });
  await page.goto(u, { waitUntil: 'load' }); await page.waitForTimeout(500);
  return { ctx, page, errors };
}

// token names for colours, read from the page itself (so night values resolve too)
function tokenMap() {
  const rules = [...document.styleSheets].flatMap(sh => { try { return [...sh.cssRules]; } catch { return []; } })
    .flatMap(function flat(r) { return [r, ...(r.cssRules ? [...r.cssRules].flatMap(flat) : [])]; }).filter(r => r.style);
  const uniq = [...new Set(rules.flatMap(r => [...r.style]).filter(p => p.startsWith('--')))];
  // tokens can be set on one box (a scoped brand colour): resolve them there as well as on the page root
  const scopes = new Set([document.documentElement]);
  for (const r of rules) if ([...r.style].some(p => p.startsWith('--')) && r.selectorText && !/^(:root|html)\b/.test(r.selectorText)) { try { const e = document.querySelector(r.selectorText); if (e) scopes.add(e); } catch {} }
  const col = {}, rgbs = {};
  for (const scope of scopes) {
    const pr = document.createElement('i'); (scope === document.documentElement ? document.body : scope).append(pr);
    for (const n of uniq) {
      const raw = getComputedStyle(scope).getPropertyValue(n).trim();
      if (/^\d+\s+\d+\s+\d+$/.test(raw)) { rgbs[raw.split(/\s+/).join(',')] ??= n; continue; } // an rgb triple (--accent-rgb)
      if (!raw || !CSS.supports('color', raw)) continue; // shadows and sizes are not colours
      pr.style.color = ''; pr.style.color = `var(${n})`; const v = getComputedStyle(pr).color;
      if (v && v !== 'rgba(0, 0, 0, 0)' && !(v in col)) col[v] = n;
    }
    pr.remove();
  }
  return { col, rgbs };
}

// ---------------------------------------------------------------- card mode
async function cardMode() {
  const spec = JSON.parse(readFileSync(resolve(KIT, 'cards', cardName, 'spec.json'), 'utf8'));
  const ref = pathToFileURL(resolve(KIT, 'cards', cardName, 'reference.html')).href;
  const candRoot = rootSel || spec.candidateRoot || '.' + spec.root.split('.').pop();
  const measureFn = ({ root, named }) => {
    const piece = document.querySelector(root); if (!piece) return null;
    const out = {};
    for (const [name, sel] of Object.entries(named)) {
      const el = sel === ':scope' ? piece : piece.querySelector(sel);
      if (!el) { out[name] = null; continue; }
      const cs = getComputedStyle(el), r = el.getBoundingClientRect(), b = getComputedStyle(el, '::before');
      out[name] = { h: Math.round(r.height), padL: cs.paddingLeft, padR: cs.paddingRight, font: cs.fontFamily.split(',')[0].replace(/"/g, '').trim(),
        fs: cs.fontSize, fw: cs.fontWeight, tt: cs.textTransform, ls: cs.letterSpacing, color: cs.color, bg: cs.backgroundColor,
        bw: cs.borderBottomWidth, bc: cs.borderBottomColor, radius: cs.borderTopLeftRadius, shadow: cs.boxShadow !== 'none',
        tr: cs.transitionDuration === '0s' ? '' : `${cs.transitionProperty}|${cs.transitionDuration}`, op: cs.opacity, vis: cs.visibility,
        before: b.content !== 'none' ? `${b.width}x${b.height}|${b.backgroundColor}|${b.borderTopWidth}` : '' };
    }
    return out;
  };
  const LABEL = { h: 'height', padL: 'left padding', padR: 'right padding', font: 'font', fs: 'font size', fw: 'font weight', tt: 'text case', ls: 'letter spacing',
    color: 'text colour', bg: 'fill', bw: 'border width', bc: 'border colour', radius: 'corners', shadow: 'shadow', tr: 'transition', op: 'opacity', vis: 'visibility', before: 'drawn mark (::before)' };
  const SKIP_H = new Set(spec.skipHeight || ['table card', 'foot line', 'status', 'selection bar']);
  for (const theme of ['light', 'dark']) {
    for (const st of spec.states) {
      const A = await open(ref, { theme }), B = await open(url, { theme });
      if (!(await B.page.locator(candRoot).count())) { fail('page', `no ${candRoot} found`, `build the piece with the markup in cards/${cardName}.md`); await A.ctx.close(); await B.ctx.close(); return; }
      await A.page.locator(spec.root).scrollIntoViewIfNeeded(); await B.page.locator(candRoot).first().scrollIntoViewIfNeeded();
      try { await act(A.page, spec.root, st.do); await act(B.page, candRoot, st.do); }
      catch (e) { fail(`${st.name}`, `could not ${st.how}: ${e.message.split('\n')[0]}`, 'keep the markup and classes from the card so the piece works the same'); await A.ctx.close(); await B.ctx.close(); continue; }
      const [ta, tb] = await Promise.all([A.page.evaluate(tokenMap), B.page.evaluate(tokenMap)]);
      const a = await A.page.evaluate(measureFn, { root: spec.root, named: spec.measure });
      const b = await B.page.evaluate(measureFn, { root: candRoot, named: spec.measure });
      // name a colour by its token, including colours made from a token's rgb (rgb(var(--accent-rgb) / .06)), so a swapped accent still matches
      const nm1 = (t, v) => { if (t.col[v]) return t.col[v]; const m = v.match(/^rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)$/); if (!m) return v; const r = t.rgbs[`${m[1]},${m[2]},${m[3]}`]; return r ? `${r}${m[4] ? ' / ' + m[4] : ''}` : v; };
      const nm = (t, v) => (v || '').replace(/rgba?\([^)]*\)/g, c => nm1(t, c));
      for (const [el, va] of Object.entries(a)) {
        const vb = b[el];
        if (va && !vb) { if (!(spec.optional || []).includes(el)) fail(`${theme} · ${st.name} · ${el}`, 'missing', `add it with the card's markup (${spec.measure[el]})`); continue; }
        if (!va || !vb) continue;
        for (const k of Object.keys(LABEL)) {
          if (k === 'h' && (SKIP_H.has(el) || st.ignoreSize)) continue;
          let x = va[k], y = vb[k];
          if (k === 'color' || k === 'bg' || k === 'bc' || k === 'before') { x = nm(ta, x); y = nm(tb, y); }
          if (k === 'h' && Math.abs(x - y) <= 1) continue;
          if (x !== y) fail(`${theme} · ${st.name} · ${el}`, `${LABEL[k]} is ${y || 'none'}, should be ${x || 'none'}`, `use the card's CSS as is for ${spec.measure[el]}`);
        }
      }
      if (B.errors.length) fail(`${theme} · ${st.name}`, `console error: ${B.errors[0]}`, 'fix the script error');
      await A.ctx.close(); await B.ctx.close();
    }
  }
  // motion, with motion on
  const A = await open(ref, { motion: true }), B = await open(url, { motion: true });
  await A.page.locator(spec.root).scrollIntoViewIfNeeded(); await B.page.locator(candRoot).first().scrollIntoViewIfNeeded();
  for (const m of spec.motion) {
    const rec = async (P, root) => {
      await act(P.page, root, (m.before || []).map(s => ({ ...s, wait: s.wait ?? 900 })));
      const pr = P.page.evaluate(({ root }) => new Promise(done => {
        const piece = document.querySelector(root), seen = new Map();
        const iv = setInterval(() => document.getAnimations().forEach(a => { const t = a.effect?.target; if (!t || !piece.contains(t)) return;
          const tm = a.effect.getTiming(); const prop = a.transitionProperty || 'transform'; seen.set(`${t.tagName.toLowerCase()}|${prop}|${Math.round(+tm.duration)}|${tm.easing.slice(0, 50)}`, 1); }), 16);
        setTimeout(() => { clearInterval(iv); done([...seen.keys()]); }, 900);
      }), { root });
      await act(P.page, root, (m.do || []).map(s => ({ ...s, wait: 0 })));
      const got = await pr; await act(P.page, root, (m.after || []).map(s => ({ ...s, wait: s.wait ?? 600 }))); return got;
    };
    try {
      const ra = await rec(A, spec.root), rb = await rec(B, candRoot);
      for (const k of ra) { if ((m.ignore || []).some(x => k.startsWith(x.split('.')[0] + '|') && x.includes('.'))) continue;
        if (!rb.includes(k)) { const [tag, prop, ms] = k.split('|'); fail(`motion · ${m.name}`, `${tag} ${prop} should move for ${ms} ms on the house curve; yours ${rb.filter(x => x.startsWith(tag + '|' + prop)).map(x => x.split('|')[2] + ' ms').join(', ') || 'does not move'}`, 'copy the card\'s CSS and script; do not write your own transitions'); } }
    } catch (e) { fail(`motion · ${m.name}`, e.message.split('\n')[0], 'keep the card\'s markup so the same actions work'); }
  }
  await A.ctx.close(); await B.ctx.close();
}

// ---------------------------------------------------------------- house mode (any page, any new piece)
async function houseMode() {
  const root = rootSel || 'body';
  for (const theme of ['light', 'dark']) {
    const { ctx, page, errors } = await open(url, { theme, motion: true }); // motion on, or the kit's off rules hide every transition
    // scroll through so lazy content arrives
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } scrollTo(0, 0); });
    await page.waitForTimeout(600);
    await page.addScriptTag({ content: `window.__emberTokens = ${tokenMap.toString()};` });
    const res = await page.evaluate(({ root }) => {
      const t = window.__emberTokens();
      const FONTS = ['Inter', 'Fraunces', 'Space Grotesk', 'JetBrains Mono', 'Antonio'];
      const lum = c => { const m = c.match(/[\d.]+/g); if (!m) return 1; const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(+m[0]) + .7152 * f(+m[1]) + .0722 * f(+m[2]); };
      const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
      const okColour = c => { if (c === 'rgba(0, 0, 0, 0)' || t.col[c]) return true; const m = c.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/); if (!m) return true;
        return !!t.rgbs[`${m[1]},${m[2]},${m[3]}`] || Object.keys(t.col).some(k => k.startsWith(`rgb(${m[1]}, ${m[2]}, ${m[3]}`) || k.startsWith(`rgba(${m[1]}, ${m[2]}, ${m[3]},`)); };
      const bgOf = el => { for (let e = el; e; e = e.parentElement) { const b = getComputedStyle(e).backgroundColor; if (b !== 'rgba(0, 0, 0, 0)' && !b.endsWith(', 0)')) return b; } return getComputedStyle(document.body).backgroundColor; };
      const out = { colours: {}, fonts: {}, radii: [], moves: [], curves: {}, contrast: [], targets: [], accentFills: 0, wide: document.documentElement.scrollWidth - innerWidth };
      const scope = document.querySelector(root) || document.body;
      const plate = el => el.closest('pre, code, .plate, .end, [class*="code"], [class*="term"], [class*="diff"]');
      // the house shell (sidebar, top bar, options sheet, page grid) and vendored figures are checked once, in the kit, not on every page
      const skip = el => el.closest('.sidebar, .topbar, .sheet, #bg, .skip, [data-hairline], [data-anatomy], .archify, .arch');
      for (const el of [scope, ...scope.querySelectorAll('*')]) {
        if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
        const cs = getComputedStyle(el), r = el.getBoundingClientRect(); if (cs.display === 'none') continue;
        const shown = r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && +cs.opacity > 0;
        const pse = ['::before', '::after'].map(p => getComputedStyle(el, p)).filter(p => p.content !== 'none').flatMap(p => [p.backgroundColor, p.borderTopWidth !== '0px' ? p.borderTopColor : null]);
        if (shown && !el.matches('input[type=checkbox], input[type=radio], input[type=range], [class*=scrim], [class*=backdrop]')) for (const c of [cs.color, cs.backgroundColor, cs.borderTopWidth !== '0px' ? cs.borderTopColor : null, ...pse].filter(Boolean)) if (!okColour(c) && !plate(el) && !skip(el)) { out.colours[c] = (out.colours[c] || 0) + 1; out.colourEx = out.colourEx || {}; out.colourEx[c] = out.colourEx[c] || `${el.tagName.toLowerCase()}.${String(el.className?.baseVal ?? el.className).split(' ')[0]} in ${el.closest('[id]')?.id || 'page'}`; }
        const f = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(); if (shown && el.childNodes.length && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && !FONTS.includes(f)) out.fonts[f] = (out.fonts[f] || 0) + 1;
        if (shown && cs.transitionDuration !== '0s' && !skip(el)) {
          const props = cs.transitionProperty.split(',').map(s => s.trim()), durs = cs.transitionDuration.split(',').map(s => parseFloat(s) * (s.includes('ms') ? 1 : 1000));
          props.forEach((p, i) => { if (/^(width|height|top|left|right|bottom|margin|padding|box-shadow|all|max-height|min-height)/.test(p) && durs[i % durs.length] > 0) out.moves.push((el.closest('[id]') && [...function* () { for (let e = el; e; e = e.parentElement) if (/^[nc]\d{2}$/.test(e.id || '')) yield e.id; }()][0] ? '@' + [...function* () { for (let e = el; e; e = e.parentElement) if (/^[nc]\d{2}$/.test(e.id || '')) yield e.id; }()][0] + ' ' : '') + `${el.tagName.toLowerCase()}.${String(el.className?.baseVal ?? el.className).split(' ')[0]} animates ${p}`); });
          for (const e of cs.transitionTimingFunction.split(/,(?![^(]*\))/)) out.curves[e.trim().slice(0, 40)] = (out.curves[e.trim().slice(0, 40)] || 0) + 1;
        }
        // text contrast
        if (shown && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && !el.closest('[aria-hidden="true"], [disabled], .sr-only') && !skip(el) && !el.matches('[aria-checked], [aria-pressed], [aria-selected], [role=radio], [role=tab]') && el.textContent.trim().length > 0 && cs.color !== 'rgba(0, 0, 0, 0)') {
          // contrast by the house rule, read from tokens: pixel-free and reliable on chips and markers
          const tok = t.col[cs.color], small = parseFloat(cs.fontSize) < 18 && +cs.fontWeight < 700;
          if (tok === '--dim') (out.softContrast = out.softContrast || []).push(`${el.tagName.toLowerCase()}.${String(el.className?.baseVal ?? el.className).split(' ')[0]} in ${el.closest('[id]')?.id || 'page'} "${el.textContent.trim().slice(0, 28)}" uses --dim`);
          if (tok === '--accent' && small && !plate(el) && !el.closest('.terminal, .term, .cw, [class*="win"]')) out.contrast.push(`${el.tagName.toLowerCase()}.${String(el.className?.baseVal ?? el.className).split(' ')[0]} in ${el.closest('[id]')?.id || 'page'} "${el.textContent.trim().slice(0, 28)}" is small text in --accent (use --accent-text)`);
        }
        // tap targets
        if (shown && el.matches('button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=checkbox], [role=switch], [role=tab], [role=option]') && r.top < innerHeight * 6) {
          const cx = r.left + r.width / 2, cy = r.top + r.height / 2, probe = (dx, dy) => { const h = document.elementFromPoint(cx + dx, cy + dy); return !!h && (h === el || el.contains(h)); };
          if (r.top > 0 && r.bottom < innerHeight) { let s = 0; for (const d of [12, 16, 20, 22]) if (probe(d - .5, 0) && probe(-d + .5, 0) && probe(0, d - .5) && probe(0, -d + .5)) s = d * 2; else break;
            if (Math.min(r.width, r.height) < 24 && s < 24) out.targets.push(`${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent).trim().slice(0, 24)}" ${Math.round(r.width)}×${Math.round(r.height)}`); }
        }
        if (shown && t.col[cs.backgroundColor] === '--accent' && r.width * r.height > 600 && r.top < innerHeight && r.bottom > 0) out.accentFills++;
      }
      return out;
    }, { root });
    const where = `${theme}`;
    for (const [c, n] of Object.entries(res.colours)) (n >= 3 ? fail : warn)(where, `${n} element(s) use ${c}, which is not a token (e.g. ${res.colourEx[c]})`, 'use a token (--ink, --muted, --paper-raised, --accent …) or rgb(var(--ink-rgb) / a)');
    for (const [f, n] of Object.entries(res.fonts)) fail(where, `${n} text element(s) in ${f}`, 'use the house fonts: Inter, Fraunces, Space Grotesk, JetBrains Mono, Antonio');
    for (const m0 of [...new Set(res.moves)].slice(0, 12)) {
      const part = m0.startsWith('@') ? m0.slice(1, m0.indexOf(' ')) : null, m = part ? m0.slice(m0.indexOf(' ') + 1) : m0;
      if (part) warn(where, `${m}, inside house part ${part}`, 'copy the house part as it is; the owner decides on fixing the part (INDEX.md, Known exceptions)');
      else if (/box-shadow/.test(m)) warn(where, m, 'a focus ring may fade its shadow; anything that lifts fades a shadow layer instead (opacity)');
      else fail(where, m, 'move only transform, opacity and colours; for a height glide use grid-template-rows or a clip, per patterns/smooth-motion.md');
    }
    const okCurve = c => /cubic-bezier\(0\.22, 1, 0\.36, 1\)|cubic-bezier\(0\.65, 0, 0\.35, 1\)|^linear\(0|^linear$|^ease$/.test(c);
    for (const [c, n] of Object.entries(res.curves)) if (!okCurve(c)) warn(where, `${n} transition(s) on ${c}`, 'use var(--ease-out), var(--ease-in-out) or a spring token');
    for (const c of (res.softContrast || []).slice(0, 6)) warn(where, `weak contrast: ${c}`, 'readable text uses --ink, --ink-soft, --muted or --accent-text; --dim only for marks and disabled things');
    for (const c of res.contrast.slice(0, 8)) fail(where, `low contrast: ${c}`, 'small text uses --ink, --ink-soft, --muted or --accent-text, never --dim or --accent');
    if (res.wide > 0) fail(where, `page scrolls sideways by ${res.wide}px at 1440`, 'give wide things their own overflow-x: auto box');
    if (res.accentFills > 1) warn(where, `${res.accentFills} orange fills in the first screen`, 'orange fills one thing per view (Von Restorff)');
    for (const tg of res.targets.slice(0, 6)) warn(where, `small tap area: ${tg}`, 'make the hit area at least 24 px (44 px on touch) with padding or a ::before');
    // a busy sign runs only while work runs: no looping animation on something hidden, at rest
    const loops = await page.evaluate(() => document.getAnimations().filter(a => { const t = a.effect?.target, tm = a.effect?.getTiming?.(); if (!t || !tm || tm.iterations !== Infinity) return false; const el = t.nodeType === 1 ? t : t.parentElement; const cs = getComputedStyle(el), r = el.getBoundingClientRect(); a.__part = (() => { for (let e = el; e; e = e.parentElement) if (/^[nc]\d{2}$/.test(e.id || '')) return e.id; })(); return cs.visibility === 'hidden' || +cs.opacity === 0 || r.width === 0 || !!el.closest('[hidden], [aria-hidden="true"][style*="opacity: 0"]'); }).map(a => { const el = a.effect.target; return (a.__part ? '@' + a.__part + ' ' : '') + `${el.tagName.toLowerCase()}.${String(el.className?.baseVal ?? el.className).split(' ')[0]} (${a.animationName || 'animation'})`; }));
    for (const l0 of [...new Set(loops)].slice(0, 6)) { const part = l0.startsWith('@') ? l0.slice(1, l0.indexOf(' ')) : null, l = part ? l0.slice(l0.indexOf(' ') + 1) : l0; if (part) { warn(where, `${l} loops while hidden, inside house part ${part}`, 'copy the house part as it is; the owner decides on fixing the part'); continue; } fail(where, `${l} loops while hidden`, 'start the loop only while the work runs (put the animation under the busy state, e.g. [aria-busy="true"])'); }
    for (const e of errors) fail(where, `console ${e.startsWith('warning: ') ? '' : 'error: '}${e}`, 'fix it: the page must be clean after scrolling and using every control');
    // focus ring
    if (theme === 'light') {
      const rings = [];
      for (let i = 0; i < 40; i++) { await page.keyboard.press('Tab'); rings.push(await page.evaluate(() => { const a = document.activeElement; if (!a || a === document.body) return null; if (a.closest('.sidebar, .topbar, .sheet, .skip')) return null; const cs = getComputedStyle(a);
          // a field may show focus once, on its box (:focus-within), not on the input: compare the box focused and blurred
          let boxRing = false;
          if (cs.outlineStyle === 'none' && cs.boxShadow === 'none') { const anc = []; for (let e = a.parentElement, i = 0; e && i < 3; e = e.parentElement, i++) anc.push(e);
            const look = e => { const c = getComputedStyle(e); return c.boxShadow + c.outlineStyle + c.borderTopColor; };
            const on = anc.map(look); a.blur(); const off = anc.map(look); a.focus({ preventScroll: true }); boxRing = on.some((v, i) => v !== off[i]); }
          return { boxRing, el: a.tagName.toLowerCase() + (a.className && typeof a.className === 'string' ? '.' + a.className.split(' ')[0] : '') + (a.closest('[id]') ? ' in ' + a.closest('[id]').id : ''), style: cs.outlineStyle, colour: cs.outlineColor, shadow: cs.boxShadow }; })); }
      const t = await page.evaluate(tokenMap);
      for (const r of rings.filter(Boolean)) if (r.style === 'none' && r.shadow === 'none' && !r.boxRing) fail('focus', `${r.el} shows no focus ring`, 'every focusable thing gets the orange outline'); else if (r.style !== 'none' && !/--accent/.test(t.col[r.colour] || '')) fail('focus', `${r.el} focus ring is ${r.colour}`, 'focus rings are orange (var(--accent)), never the browser blue');
    }
    await ctx.close();
  }
  // phone
  const P = await open(url, { w: 390, h: 844 });
  const wide = await P.page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (wide > 0) fail('phone', `page scrolls sideways by ${wide}px at 390 px`, 'stack columns, and give tables and code their own overflow-x: auto box');
  // both themes really differ
  const L = await open(url, { theme: 'light' }), D = await open(url, { theme: 'dark' });
  const [bl, bd] = await Promise.all([L.page.evaluate(() => getComputedStyle(document.body).backgroundColor), D.page.evaluate(() => getComputedStyle(document.body).backgroundColor)]);
  if (bl === bd) fail('themes', `the page looks the same with the system set to dark (${bl})`, 'paste the theme boot script and the tokens for both themes (RULES.md)');
  // reduced motion leaves everything visible
  const hiddenList = await P.page.evaluate(() => [...document.querySelectorAll('h1, h2, h3, p, li, td')].filter(e => { const cs = getComputedStyle(e); return e.textContent.trim() && e.getBoundingClientRect().height > 0 && +cs.opacity < .1 && !e.closest('[aria-hidden="true"], [hidden], .sr-only, [inert]') && !e.closest('[style*="opacity: 0"]')?.matches('.toast, .tip, [role=tooltip], [role=status]'); }).map(e => `${e.tagName.toLowerCase()} in ${e.closest('[id]')?.id || 'page'} "${e.textContent.trim().slice(0, 24)}"`)); const hidden = hiddenList.length;
  if (hidden) fail('reduced motion', `${hidden} text element(s) stay invisible with motion off: ${hiddenList.slice(0, 3).join('; ')}`, 'everything readable shows at rest; entrances only animate from a visible state');
  for (const x of [P, L, D]) await x.ctx.close();
}

try { if (cardName) await cardMode(); if (house) await houseMode(); } finally { await browser.close(); server.close(); }
const fails = findings.filter(f => f.level === 'fail'), warns = findings.filter(f => f.level === 'warn');
const seen = new Set();
const times = {}; for (const f of findings) times[f.level + f.what] = (times[f.level + f.what] || 0) + 1;
for (const f of findings) { const k = f.level + f.what; if (seen.has(k)) continue; seen.add(k); if (times[k] > 1) f.what += ` (×${times[k]})`; console.log(`${f.level === 'fail' ? 'FAIL' : 'warn'}  ${f.where}: ${f.what}\n      fix: ${f.fix}`); }
console.log(fails.length ? `\nFAIL · ${fails.length} problems, ${warns.length} warnings` : `\nPASS · ${warns.length} warnings`);
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(findings, null, 1));
process.exit(fails.length ? 1 : 0);
