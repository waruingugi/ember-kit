// Builds taste-lab.html from src/: the page frame, shared helpers, and one file per batch of components.
// Run: node taste-lab/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = (f) => readFileSync(join(here, 'src', f), 'utf8');
// Round: `node build.mjs` builds round 1; `node build.mjs 2` builds round 2 from src/r2/.
const R = Number(process.argv[2] || 1);
const r1 = (await Promise.all(['b1.mjs', 'b2.mjs', 'b3.mjs', 'b4.mjs'].map((f) => import(join(here, 'src', f))))).flatMap((b) => b.default);
const rN = R === 1 ? null : await import(join(here, 'src', `r${R}`, 'index.mjs'));
const comps = R === 1 ? r1 : rN.default;
// later rounds reuse round 1's shared helpers (window.TL*), not its sections
const helpers = R === 1 ? [] : r1;
// the lively option comes first from round 2 on (notes/owner-likes.md)
const ORDER = R === 1 ? 'ABCDEF' : 'BACDFE';
for (const c of comps) c.opts.sort((a, b) => ORDER.indexOf(a.k) - ORDER.indexOf(b.k));

const TAG = {
  'motion:still': 'Still', 'motion:some': 'Some motion', 'motion:springy': 'Springy',
  'speed:quick': 'Quick', 'speed:mid': 'Medium speed', 'speed:slow': 'Slow and smooth',
  'density:roomy': 'Roomy', 'density:mid': 'Medium density', 'density:compact': 'Compact',
  'depth:flat': 'Flat', 'depth:some': 'A little depth', 'depth:lifted': 'Lifted',
  'feedback:quiet': 'Quiet feedback', 'feedback:clear': 'Clear feedback', 'feedback:loud': 'Loud feedback',
  'open:trigger': 'Opens from the trigger', 'open:centre': 'Opens from the centre', 'open:edge': 'Opens from an edge', 'open:inplace': 'Changes in place',
  'new:familiar': 'Familiar', 'new:twist': 'Familiar with a twist', 'new:novel': 'New idea',
  'look:ember': 'Ember look', 'look:off': 'Off-look',
};
const LETTER = { A: 'Plain', B: 'Lively', C: 'Mix', D: 'Reference, pushed', E: 'Off-look', F: 'Wild card' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
for (const c of comps) for (const o of c.opts) for (const t of o.tags) if (!TAG[t]) throw new Error(`${c.id}${o.k}: unknown tag ${t}`);

const sb = comps.map((c) => `<li><a class="sb-link" href="#${c.id}" data-tip="${esc(c.name)}" data-comp="${c.id}"><span class="k">${c.n}</span><span class="t">${esc(c.name)}</span><svg class="tick" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8"/><path d="M4.8 8.3 7 10.4l4.2-4.8"/></svg></a></li>`).join('\n');

const optCard = (c, o) => {
  const id = `t${c.n}${o.k}`;
  const kind = o.kind || LETTER[o.k];
  const off = o.tags.includes('look:off');
  return `<article class="opt${off ? ' is-off' : ''}${o.wide ? ' is-wide' : ''}" id="${id}" data-comp="${c.id}" data-opt="${o.k}" data-tags="${o.tags.join(' ')}" aria-labelledby="${id}-h" data-reveal>
  <header class="opt-h"><span class="opt-k" aria-hidden="true">${o.k}</span><div><p class="opt-kind">${esc(kind)}${off ? ' <span class="offmark">Off-look</span>' : ''}</p><h3 id="${id}-h"><span class="sr">Option ${o.k}: </span>${esc(o.name)}</h3><p class="opt-line">${o.line}</p></div></header>
  <div class="stage${o.top ? ' is-top' : ''}" style="--h:${o.h || c.h || 240}px">${o.html}</div>
  <p class="opt-try"><b>Try</b> ${o.tryit}</p>
  <dl class="facts">
    <div><dt>Needs</dt><dd>${o.needs}</dd></div>
    <div><dt>Keys</dt><dd>${o.keys}</dd></div>
    <div><dt>Motion off</dt><dd>${o.off}</dd></div>
    <div><dt>UX law</dt><dd>${o.law}</dd></div>
  </dl>
  <p class="from"><span>Taken from</span>${o.from.map(([n, u]) => (u ? `<a class="chip" href="${u}" target="_blank" rel="noopener">${esc(n)}</a>` : `<span class="chip">${esc(n)}</span>`)).join('')}</p>
  <ul class="tags" aria-label="Taste tags">${o.tags.map((t) => `<li data-t="${t}">${TAG[t]}</li>`).join('')}</ul>
  <button class="pick" type="button" aria-pressed="false" data-pick="${o.k}"><span class="pk-off">Pick ${o.k}</span><span class="pk-on">Picked</span></button>
</article>`;
};

const section = (c) => `<section class="sec comp" id="${c.id}" data-comp="${c.id}" data-name="${esc(c.name)}">
  <div class="sec-head" data-reveal>
    <span class="sec-ghost" aria-hidden="true">${c.n}</span>
    <p class="eyebrow"><b>${c.n}</b> ${esc(c.name)}</p>
    <h2 class="display">${c.claim}</h2>
    <p class="lead">${c.lead}</p>
  </div>
  <aside class="ref" data-reveal aria-label="What you liked before: ${c.name}">
    <p class="mono-label">What you liked before</p>
    ${c.ref ? `<p><span class="chip">${esc(c.ref.ids)}</span> ${c.ref.text} <a href="${c.ref.url || '../../components/showcase/index.html'}" target="_blank" rel="noopener">${c.ref.label || 'Open the showcase'}</a></p>` : `<p>No house part yet. Your pick here becomes the first one.</p>`}
  </aside>
  <div class="opts">
${c.opts.map((o) => optCard(c, o)).join('\n')}
  </div>
  <div class="decide" data-reveal>
    <div class="decide-row">
      <button class="l-btn none" type="button" data-none aria-pressed="false">None of these</button>
      <span class="save-state" aria-live="polite"></span>
    </div>
    <label class="note"><span>Note <small>for example "${esc(c.noteHint)}"</small></span><textarea id="note-${c.id}" rows="2" data-note></textarea></label>
    <label class="note"><span>Show me more like… <small>a request for round ${R + 1}</small></span><input id="more-${c.id}" type="text" data-more placeholder="${esc(c.moreHint)}"></label>
  </div>
</section>`;

const css = src('frame.css') + src('base.css') + helpers.map((c) => c.css || '').join('\n') + comps.map((c) => (c.css || '') + c.opts.map((o) => o.css || '').join('\n')).join('\n');
const js = helpers.map((c) => c.js || '').join('\n') + '\n' + comps.map((c) => [c.js ? `run(${JSON.stringify(c.id)}, function (sec) {\n${c.js}\n});` : '', ...c.opts.map((o) => (o.js ? `run(${JSON.stringify(`t${c.n}${o.k}`)}, function (box) {\n${o.js}\n});` : ''))].join('\n')).join('\n');
const meta = comps.map((c) => ({ id: c.id, n: c.n, name: c.name, opts: c.opts.map((o) => ({ k: o.k, name: o.name, tags: o.tags })) }));

let page = src('page.html')
  .replace('/*CSS*/', () => css)
  .replace('<!--SB-->', () => sb)
  .replace('<!--SECTIONS-->', () => comps.map(section).join('\n'))
  .replace('/*META*/', () => `var LAB = ${JSON.stringify(meta)};`)
  .replace('/*LIB*/', () => src('lib.js'))
  .replace('/*PARTS*/', () => js)
  .replaceAll('{{COUNT}}', String(comps.length))
  .replaceAll('{{OPTS}}', String(comps.reduce((n, c) => n + c.opts.length, 0)));
if (R > 1) {
  page = page.replaceAll('Round 1', `Round ${R}`).replaceAll('round 1', `round ${R}`).replace("ROUND = 'r1'", `ROUND = 'r${R}'`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(rN.description)}">`)
    .replace(/<p class="lead" data-reveal style="--i:2">[\s\S]*?<\/p>/, () => `<p class="lead" data-reveal style="--i:2">${rN.lead}</p>`)
    .replace(/\s*<div class="lg is-off">[\s\S]*?<\/div>/, '');
}
const OUT = R === 1 ? '' : `-r${R}`;

writeFileSync(join(here, `taste-lab${OUT}.html`), page);
// local preview: the same page in the skeleton the Artifact tool adds
writeFileSync(join(here, `preview${OUT}.html`), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>[hidden]{display:none!important}body{margin:0}</style></head><body>' + page + '</body></html>');
console.log(`taste-lab${OUT}.html: ${comps.length} components, ${comps.reduce((n, c) => n + c.opts.length, 0)} options, ${(page.length / 1024).toFixed(0)} KB`);
