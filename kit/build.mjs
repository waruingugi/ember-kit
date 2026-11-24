// Build a card's code, numbers and pictures from the live showcase part, so a card can never drift from the kit.
// Usage: node kit/build.mjs table        (reads kit/cards/<card>.src.md and kit/cards/<card>/spec.json, writes kit/cards/<card>.md)
// Every code block and number in the card comes from the browser, not from a person:
//   CSS     every rule that styles an element of the piece, plus the tokens and page base it needs, in showcase order
//   markup  the piece's HTML from components/parts/<part>.html, ids stripped, with the icon symbols it uses
//   JS      the text between /* <card>:begin */ and /* <card>:end */ in the part's script
//   sizes   computed styles of the named elements, colours named by token
//   motion  transitions read from computed styles, Web Animations recorded while the piece is used
//   pictures one PNG per state, light and night, plus a phone shot
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { act } from './tools/snapshot.mjs';

const KIT = dirname(fileURLToPath(import.meta.url)), DS = resolve(KIT, '..');
const card = process.argv[2]; if (!card) { console.error('usage: node kit/build.mjs <card>'); process.exit(2); }
const dir = resolve(KIT, 'cards', card); mkdirSync(dir, { recursive: true });
const spec = JSON.parse(readFileSync(resolve(dir, 'spec.json'), 'utf8'));
const ref = resolve(dir, 'reference.html');
execFileSync('node', [resolve(DS, 'scripts/assemble.mjs'), spec.part, '-o', ref], { stdio: 'ignore' });
const tokenNames = [...readFileSync(resolve(DS, 'components/tokens.css'), 'utf8').matchAll(/(--[a-z0-9-]+)\s*:/g)].map(m => m[1]);

// ---------- 1. CSS that styles the piece ----------
function collectCss({ root, everything }) {
  const piece = document.querySelector(root), kit = piece.closest('.kit');
  const inPiece = el => el === piece || piece.contains(el);
  const base = new Set([document.documentElement, document.body, kit].filter(Boolean));
  const strip = sel => sel.replace(/::?(hover|focus-visible|focus-within|focus|active|visited|before|after|placeholder|-webkit-[a-z-]+|-moz-[a-z-]+|selection|marker)(\([^)]*\))?/g, '');
  const split = sel => { const out = []; let d = 0, cur = ''; for (const ch of sel) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && !d) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out; };
  const ROOTISH = /^(:root|html)([.\[:][^\s,]*)?$/;
  const out = [], frames = new Set(), used = new Set();
  function test(rule) {
    if (!(rule instanceof CSSStyleRule)) return false;
    // tokens and theme switches on the root
    if (split(rule.selectorText).every(s => ROOTISH.test(s.trim()))) return [...rule.style].some(p => p.startsWith('--')) || true;
    for (const part of split(rule.selectorText)) {
      let els; try { els = document.querySelectorAll(strip(part.trim()) || '*'); } catch { continue; }
      const bare = strip(part.trim());
      for (const el of els) if (inPiece(el) || (base.has(el) && el !== piece && /^(html|body|\.kit|\*|:root)\b/.test(bare) && !/kit-|fbar|frame/.test(bare))) return true;
    }
    return false;
  }
  function walk(rules, wrap) {
    for (const r of rules) {
      if (r instanceof CSSMediaRule || r instanceof CSSSupportsRule) { walk(r.cssRules, [...wrap, r instanceof CSSMediaRule ? `@media ${r.conditionText}` : `@supports ${r.conditionText}`]); continue; }
      if (r instanceof CSSKeyframesRule) { frames.add(r); continue; }
      if (everything || test(r)) { out.push({ wrap, text: r.cssText }); const an = (r.style && r.style.animationName) || ''; an.split(',').forEach(n => n.trim() && n !== 'none' && used.add(n.trim())); }
    }
  }
  for (const sh of document.styleSheets) { try { walk(sh.cssRules, []); } catch {} }
  for (const k of frames) if (used.has(k.name)) out.push({ wrap: [], text: k.cssText });
  return out;
}

// ---------- 2. measured numbers ----------
function measure({ root, named, tokenNames }) {
  const probe = document.createElement('i'); document.body.append(probe);
  const tok = {};
  for (const n of tokenNames) { probe.style.color = ''; probe.style.color = `var(${n})`; const v = getComputedStyle(probe).color; if (v && v !== 'rgba(0, 0, 0, 0)' && !(v in tok)) tok[v] = n; }
  probe.remove();
  const col = c => c === 'rgba(0, 0, 0, 0)' ? 'none' : (tok[c] ? `var(${tok[c]})` : c);
  const piece = document.querySelector(root), res = {};
  for (const [name, sel] of Object.entries(named)) {
    const el = sel === ':scope' ? piece : piece.querySelector(sel); if (!el) { res[name] = null; continue; }
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    res[name] = {
      size: `${Math.round(r.width)} × ${Math.round(r.height)}`, pad: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`.replace(/(\d)px/g, '$1'),
      font: `${cs.fontFamily.split(',')[0].replace(/"/g, '')} ${cs.fontSize} / ${cs.fontWeight}${cs.textTransform !== 'none' ? ' ' + cs.textTransform : ''}`,
      color: col(cs.color), bg: col(cs.backgroundColor), radius: cs.borderTopLeftRadius,
      border: cs.borderBottomWidth !== '0px' ? `${cs.borderBottomWidth} ${col(cs.borderBottomColor)}` : (cs.borderTopWidth !== '0px' ? `${cs.borderTopWidth} ${col(cs.borderTopColor)}` : 'none'),
      shadow: cs.boxShadow === 'none' ? 'none' : 'yes',
      transition: cs.transitionDuration !== '0s' ? `${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction}` : '',
    };
  }
  return res;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(pathToFileURL(ref).href, { waitUntil: 'load' });
await page.locator(spec.root).scrollIntoViewIfNeeded(); await page.waitForTimeout(600);
// union over every state, so rules for picked, sorted, empty and the open bar come too; keep showcase order
const key = r => r.wrap.join('|') + '§' + r.text;
const order = new Map((await page.evaluate(collectCss, { root: spec.root, everything: true })).map((r, i) => [key(r), i]));
const picked = new Map();
for (const st of spec.states) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); await p.goto(pathToFileURL(ref).href, { waitUntil: 'load' });
  await p.locator(spec.root).scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
  await act(p, spec.root, st.do);
  for (const r of await p.evaluate(collectCss, { root: spec.root })) picked.set(key(r), r);
  await ctx.close();
}
// the kit has two motion levels (lively, off); calm rules are leftovers in the showcase
const rules = [...picked.entries()].sort((a, b) => (order.get(a[0]) ?? 1e9) - (order.get(b[0]) ?? 1e9)).map(e => e[1]).filter(r => !/data-motion="calm"/.test(r.text + r.wrap.join('')));
const css = rules.map(r => r.wrap.reduceRight((t, w) => `${w} { ${t} }`, r.text)).join('\n');

// sizes and colours per state
const numbers = {};
for (const st of spec.states) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); await p.goto(pathToFileURL(ref).href, { waitUntil: 'load' });
  await p.locator(spec.root).scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
  await act(p, spec.root, st.do);
  numbers[st.name] = await p.evaluate(measure, { root: spec.root, named: st.measure || spec.measure, tokenNames });
  await ctx.close();
}

// motion: record every Web Animation and CSS transition the piece runs while used
const motion = [];
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage(); await p.goto(pathToFileURL(ref).href, { waitUntil: 'load' });
  await p.locator(spec.root).scrollIntoViewIfNeeded(); await p.waitForTimeout(800);
  for (const m of spec.motion) {
    await act(p, spec.root, (m.before || []).map(s => ({ ...s, wait: s.wait ?? 400 })));
    const rec = p.evaluate(({ root }) => new Promise(done => {
      const piece = document.querySelector(root), seen = [];
      const grab = () => document.getAnimations().forEach(a => {
        const t = a.effect?.target; if (!t || !piece.contains(t) || seen.some(s => s.a === a)) return;
        const tm = a.effect.getTiming(), kf = a.effect.getKeyframes();
        seen.push({ a, kind: a.constructor.name === 'CSSTransition' ? 'transition' : a.constructor.name === 'CSSAnimation' ? 'css animation' : 'script',
          what: (t.className?.baseVal ?? t.className) ? `${t.tagName.toLowerCase()}.${String(t.className?.baseVal ?? t.className).split(' ')[0]}` : t.tagName.toLowerCase(),
          prop: a.transitionProperty || Object.keys(kf[0] || {}).filter(k => !['offset', 'easing', 'composite', 'computedOffset'].includes(k)).join(', '),
          from: a.transitionProperty ? '' : JSON.stringify(kf[0]?.[Object.keys(kf[0]).find(k => !['offset', 'easing', 'composite', 'computedOffset'].includes(k))] ?? ''),
          ms: Math.round(+tm.duration), delay: Math.round(+tm.delay), easing: tm.easing });
      });
      const iv = setInterval(grab, 16); setTimeout(() => { clearInterval(iv); done(seen.map(({ a, ...r }) => r)); }, 900);
    }), { root: spec.root });
    await act(p, spec.root, (m.do || []).map(s => ({ ...s, wait: 0 })));
    const got = await rec;
    const curves = await p.evaluate(() => { const o = {}, pr = document.createElement('i'); document.body.append(pr);
      for (const n of ['--ease-out', '--ease-in-out', '--sp-snappy', '--sp-bouncy', '--sp-soft']) { pr.style.transitionTimingFunction = `var(${n})`; o[getComputedStyle(pr).transitionTimingFunction] = n; }
      pr.remove(); o['cubic-bezier(0.22, 1, 0.36, 1)'] = o['cubic-bezier(0.22, 1, 0.36, 1)'] || '--ease-out'; return o; });
    // linear() springs print with stops; compare their values only
    const norm = e => e.startsWith('linear(') ? 'L' + (e.match(/-?\d*\.?\d+(?=\s*(,|\)|\s\d))/g) || []).map(n => (+n).toFixed(3)).join(',') : e;
    const named = {}; for (const [k, v] of Object.entries(curves)) named[norm(k)] = v;
    got.forEach(g => { const n = named[norm(g.easing)]; if (n) g.easing = `var(${n})`; else if (g.easing.length > 60) g.easing = g.easing.slice(0, 40) + '…'; });
    const uniq = []; for (const g of got) if (!uniq.some(u => u.what === g.what && u.prop === g.prop && u.ms === g.ms)) uniq.push({ ...g, n: got.filter(x => x.what === g.what && x.prop === g.prop && x.ms === g.ms).length });
    motion.push({ trigger: m.name, runs: uniq.filter(u => !(m.ignore || []).some(x => u.what.startsWith(x))) });
    await act(p, spec.root, (m.after || []).map(s => ({ ...s, wait: s.wait ?? 600 })));
  }
  await ctx.close();
}

// pictures
const pics = [];
for (const theme of ['light', 'dark']) for (const st of spec.states.filter(s => s.picture)) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  const p = await ctx.newPage(); await p.goto(pathToFileURL(ref).href, { waitUntil: 'load' });
  await p.locator(spec.root).scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
  await act(p, spec.root, st.do);
  const f = `${card}.${st.name}.${theme === 'dark' ? 'night' : 'light'}.png`;
  await p.locator(spec.root).screenshot({ path: resolve(dir, f) }); pics.push(f);
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage(); await p.goto(pathToFileURL(ref).href, { waitUntil: 'load' });
  await p.locator(spec.root).scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
  const f = `${card}.phone.light.png`; await p.locator(spec.root).screenshot({ path: resolve(dir, f) }); pics.push(f);
  await ctx.close();
}
await browser.close();

// ---------- markup, icons and JS from the source files ----------
const partHtml = readFileSync(resolve(DS, 'components/parts', spec.part + '.html'), 'utf8');
const showcase = readFileSync(resolve(DS, 'components/showcase/index.html'), 'utf8');
function outer(html, startMark) {
  const a = html.indexOf(startMark); if (a < 0) throw new Error('markup start not found: ' + startMark);
  let depth = 0, i = a; const re = /<(\/?)div\b[^>]*>/g; re.lastIndex = a;
  for (let m; (m = re.exec(html));) { depth += m[1] ? -1 : 1; if (!depth) { i = re.lastIndex; break; } }
  return html.slice(a, i);
}
let markup = outer(partHtml, spec.markupStart).replace(new RegExp(` id="${spec.part}-[a-z]+"`, 'g'), '');
markup = markup.replace(/></g, '>\n<').replace(/\n<\/(svg|use|path|button|span|th|tr|thead|tbody)>/g, '</$1>').replace(/\n<(use|path|svg)/g, '<$1');
const icons = [...new Set([...markup.matchAll(/href="#(i-[a-z0-9-]+)"/g)].map(m => m[1]))];
const sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">\n' + icons.map(id => {
  const m = showcase.match(new RegExp(`<symbol id="${id}"[\\s\\S]*?</symbol>`)); if (!m) throw new Error('icon not found ' + id); return '  ' + m[0];
}).join('\n') + '\n</svg>';
const jsA = showcase.indexOf(`/* ${spec.js}:begin`), jsB = showcase.indexOf(`/* ${spec.js}:end */`);
if (jsA < 0 || jsB < 0) throw new Error('JS markers not found');
const js = showcase.slice(jsA, jsB + `/* ${spec.js}:end */`.length);
const example = showcase.slice(jsB + `/* ${spec.js}:end */`.length, showcase.indexOf('</script>', jsB)).trim();
const fontLink = (showcase.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]+>/) || [''])[0];

writeFileSync(resolve(dir, `${card}.css`), `/* ${card}: made by kit/build.mjs from part ${spec.part}. Do not edit; rebuild. ${rules.length} rules. */\n${css}\n`);
writeFileSync(resolve(dir, `${card}.js`), `${js}\n`);
// a whole working page: the fastest exact start
const starter = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${spec.title}</title>
<script>
/* theme and motion boot (RULES.md): a picked theme wins, else the system setting; reduced motion means off */
(function () { var r = document.documentElement, t = null, m = null;
  try { t = localStorage.getItem("ember-theme-v1"); m = localStorage.getItem("ember-motion-v1"); } catch (e) {}
  if (!t || t === "system") t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) m = "off";
  r.setAttribute("data-theme", t); r.setAttribute("data-motion", m || "lively"); r.classList.add("js"); })();
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fontLink}
<style>
${css}
.page { max-width: 1040px; margin: 0 auto; padding: 48px max(16px, env(safe-area-inset-left, 0px)); }
</style>
</head>
<body class="kit">
${sprite}
<main class="page">
${markup}
</main>
<script>
${js}
${example.replace(/var box = document\.getElementById\("[a-z0-9]+"\); if \(!box\) return;/, 'var box = document.querySelector("main");')}
</script>
</body>
</html>
`;
writeFileSync(resolve(dir, `${card}.starter.html`), starter);

// ---------- the card ----------
const fmtState = (st) => {
  const n = numbers[st]; return Object.entries(n).filter(([, v]) => v).map(([k, v]) =>
    `| ${k} | ${v.size} | ${v.pad} | ${v.font} | ${v.color} | ${v.bg} | ${v.border} | ${v.radius} |`).join('\n');
};
const sizes = `| Element | Size (px) | Padding | Font | Text | Fill | Border | Corners |\n|---|---|---|---|---|---|---|---|\n${fmtState(spec.states[0].name)}`;
const stateDiffs = spec.states.slice(1).map(st => {
  const rows = []; for (const [k, v] of Object.entries(numbers[st.name])) { const b = numbers[spec.states[0].name][k]; if (!v || !b) continue;
    for (const f of ['color', 'bg', 'border', 'size', 'shadow']) if (v[f] !== b[f] && !(f === 'size' && st.ignoreSize)) rows.push(`${k} ${f}: ${b[f]} → **${v[f]}**`); }
  return `- **${st.name}** (${st.how}): ${rows.length ? rows.join('; ') : 'no change in the measured elements'}`;
}).join('\n');
const motionTable = '| When | What moves | Property | Time | Curve | Kind |\n|---|---|---|---|---|---|\n' + motion.flatMap(m => m.runs.length ? m.runs.map(r =>
  `| ${m.trigger} | ${r.what}${r.n > 1 ? ` (×${r.n})` : ''} | ${r.prop}${r.from ? ` from ${r.from}` : ''} | ${r.ms} ms${r.delay ? ` after ${r.delay} ms` : ''} | \`${r.easing}\` | ${r.kind} |`) : [`| ${m.trigger} | nothing | | | | |`]).join('\n');
const picTable = spec.states.filter(s => s.picture).map(s => `| ${s.name} | ![](${card}/${card}.${s.name}.light.png) | ![](${card}/${card}.${s.name}.night.png) |`).join('\n');
let src = readFileSync(resolve(KIT, 'cards', `${card}.src.md`), 'utf8');
const fill = {
  sizes, states: stateDiffs, motion: motionTable, pictures: `| State | Light | Night |\n|---|---|---|\n${picTable}\n\nPhone (390 px): ![](${card}/${card}.phone.light.png)`,
  markup: '```html\n' + markup + '\n```', icons: '```html\n' + sprite + '\n```', js: '```js\n' + js + '\n```', example: '```js\n' + example + '\n```',
  csscount: String(rules.length), cssfile: `${card}/${card}.css`, starter: `${card}/${card}.starter.html`, date: new Date().toISOString().slice(0, 10), part: spec.part,
};
src = src.replace(/\{\{(\w+)\}\}/g, (m, k) => { if (!(k in fill)) throw new Error('unknown slot ' + k); return fill[k]; });
writeFileSync(resolve(KIT, 'cards', `${card}.md`), src);
writeFileSync(resolve(dir, 'measured.json'), JSON.stringify({ numbers, motion }, null, 1));
console.log(`${card}: ${rules.length} CSS rules, ${icons.length} icons, ${js.length} B of JS, ${pics.length} pictures, ${motion.length} motion triggers → kit/cards/${card}.md`);
