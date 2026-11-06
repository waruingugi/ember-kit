// Round 4, batch f: data, lists and blocks. 32 activity heatmap, 33 reorderable list, 34 timeline,
// 35 empty states, 36 stats band. Ideas from Arc's free parts (uiarc.dev, MIT), rebuilt in our look with our own code.
// New shared helpers (set in part 32's js): TL4fflip (FLIP a list on a spring), TL4swap (cross-fade a pane with a height glide).
import { arc, house, skill } from '../src-links.mjs';

const SHOW = '../../components/showcase/index.html';
const STAGE = String.raw`
#heatmap .stage, #reorder .stage, #timeline .stage, #empty .stage, #statsband .stage { height: auto; min-height: var(--h); container-type: inline-size; }`;

/* ================= 32 Activity heatmap ================= */
const hmCss = STAGE + String.raw`
#heatmap .hm { width: min(100%, 440px); display: grid; gap: 12px; }
#heatmap .hm-top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 10px 14px; }
#heatmap .hm-l { margin: 0; font: 500 11px/1.4 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
#heatmap .hm-big { margin: 3px 0 0; display: flex; align-items: baseline; gap: 7px; font: 400 40px/1 var(--font-num); color: var(--ink); }
#heatmap .hm-big .tlr-a, #heatmap .hm-tip .tlr-a { font: 500 .42em/1 var(--font-mono); color: var(--muted); letter-spacing: .04em; }
#heatmap .hm-u { font: 500 14px/1 var(--font-body); color: var(--muted); }
#heatmap .hm-wrap { position: relative; }
#heatmap .hm-mo, #heatmap .hm-g { display: grid; grid-template-columns: 30px repeat(12, minmax(0, 1fr)); gap: 3px; }
#heatmap .hm-mo { margin-bottom: 5px; font: 500 10.5px/1 var(--font-mono); color: var(--muted); }
#heatmap .hm-mo span { white-space: nowrap; }
#heatmap .hm-g [role="row"] { display: contents; }
#heatmap .hm-d { font: 500 10px/1 var(--font-mono); color: var(--muted); align-self: center; }
#heatmap .hm-c, #heatmap .hm-k { background: rgb(var(--ink-rgb) / .07); }
#heatmap .hm-c { aspect-ratio: 1; border-radius: 4px; outline: none; transition: background-color .35s var(--ease-out), opacity .25s var(--ease-out); }
#heatmap [data-l="1"] { background: color-mix(in oklab, var(--accent) 24%, var(--paper-raised)); }
#heatmap [data-l="2"] { background: color-mix(in oklab, var(--accent) 46%, var(--paper-raised)); }
#heatmap [data-l="3"] { background: color-mix(in oklab, var(--accent) 70%, var(--paper-raised)); }
#heatmap [data-l="4"] { background: var(--accent); }
#heatmap .hm-c.is-on { position: relative; z-index: 1; box-shadow: 0 0 0 2px var(--paper), 0 0 0 3.5px var(--ink); }
#heatmap .hm-g:focus-within .hm-c.is-on { box-shadow: 0 0 0 2px var(--paper), 0 0 0 3.5px var(--accent); }
#heatmap .hm-c.is-dim { opacity: .2; }
#heatmap .hm-tip { position: absolute; left: 0; top: 0; z-index: 3; pointer-events: none; display: grid; gap: 1px; padding: 6px 10px 7px; border-radius: 9px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-lg); white-space: nowrap; opacity: 0; transition: opacity .15s; }
#heatmap .hm-tip.is-on { opacity: 1; }
#heatmap .hm-tip b { display: flex; align-items: baseline; gap: 4px; font: 400 20px/1.1 var(--font-num); color: var(--ink); }
#heatmap .hm-tip small { font: 500 12px/1 var(--font-body); color: var(--muted); }
#heatmap .hm-tip > span { font-size: 12px; color: var(--muted); }
#heatmap .hm-foot { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px 14px; font-size: 12.5px; color: var(--muted); }
#heatmap .hm-key { display: flex; align-items: center; gap: 4px; font: 500 10.5px/1 var(--font-mono); }
#heatmap .hm-key > span { margin: 0 3px; }
#heatmap .hm-k { display: block; width: 12px; height: 12px; border-radius: 3px; }
#heatmap .hm-kb { padding: 5px; border-radius: 7px; transition: background-color .15s, box-shadow .15s, transform .15s var(--ease-out); }
#heatmap .hm-kb:hover { background: rgb(var(--ink-rgb) / .06); }
#heatmap .hm-kb:active { transform: scale(.94); }
#heatmap .hm-kb[aria-pressed="true"] { box-shadow: inset 0 0 0 1.5px var(--ink); }
#heatmap .me-sw { min-width: 0; }
@media (pointer: coarse) { #heatmap .hm-kb { padding: 9px 5px; } }`;

const hmJs = String.raw`
/* ===== batch f shared helpers ===== */
/* Move list items, then let each glide from where it was (FLIP). composite:add keeps any scale already on it. */
window.TL4fflip = function (els, mutate, o) {
  o = o || {};
  var first = els.map(function (e) { return e.getBoundingClientRect().top; });
  els.forEach(function (e) { if (e._fl) { e._fl.cancel(); e._fl = null; } });
  mutate();
  if (!moving()) return;
  var sp = o.ease || TLsp(o.sp || 'snappy');
  els.forEach(function (e, k) { var dy = first[k] - e.getBoundingClientRect().top; if (Math.abs(dy) < .5) return;
    e._fl = e.animate([{ transform: 'translateY(' + dy.toFixed(1) + 'px)' }, { transform: 'translateY(0)' }], { duration: sp.d, easing: sp.e, composite: 'add' });
    e._fl.onfinish = function () { e._fl = null; }; });
};
/* Swap the pane inside host: the old one fades where it stands, the new one rises in, the host glides to its new height. */
window.TL4swap = function (host, html) {
  var h0 = host.offsetHeight, mv = moving();
  $$('[data-old]', host).forEach(function (x) { x.remove(); });
  var old = host.firstElementChild, nw = document.createElement('div'); nw.className = 'tl4-pane'; nw.innerHTML = html;
  if (old && mv) { old.setAttribute('data-old', ''); old.setAttribute('aria-hidden', 'true'); old.inert = true; old.style.cssText = 'position:absolute;left:0;right:0;top:0'; host.appendChild(nw);
    old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-out', fill: 'forwards' }).onfinish = function () { old.remove(); }; }
  else { if (old) old.remove(); host.appendChild(nw); }
  var h1 = host.offsetHeight;
  if (mv) {
    if (host._g) host._g.cancel();
    if (h0 && Math.abs(h0 - h1) > 1) host._g = host.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
    nw.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 340, delay: 90, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
  }
  return nw;
};

/* ===== 32: the heatmap ===== */
window.TL4heat = function (box, c) {
  c = c || {};
  var N = 84, D = [], i, w, r, base = [18, 20, 22, 25, 31, 39, 11];
  var MN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (i = 0; i < N; i++) {
    var dt = new Date(2026, 7, 10 + i), o = i === 71 ? 0 : Math.max(0, Math.round(base[i % 7] * (.74 + .5 * i / (N - 1)) + 5 * Math.sin(i * 2.7) + 3.5 * Math.sin(i * 1.3 + 2)));
    D.push({ o: o, k: Math.round(o * (560 + 120 * Math.sin(i * .7 + 1)) / 10) * 10, n: dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', ''), m: dt.getMonth(), shut: i === 71 });
  }
  var M = 'o', X = 1, filt = -1, act = -1, cur = N - 1, seen = false;
  function fmt(n) { return M === 'k' ? TLkes(n) : Math.round(n).toLocaleString('en-KE'); }
  function unit(n) { return M === 'k' ? '' : n === 1 ? 'order' : 'orders'; }
  function lev(v) { return v ? Math.min(4, Math.ceil(v / X * 4)) : 0; }
  function tot() { var t = 0; D.forEach(function (d) { t += d[M]; }); return t; }
  function setX() { X = 1; D.forEach(function (d) { if (d[M] > X) X = d[M]; }); }
  function range(l) { if (!l) return 'Days with no orders'; var lo = Math.floor(X * (l - 1) / 4) + 1, hi = Math.floor(X * l / 4); return 'Days with ' + (lo === hi ? lo : lo + '–' + hi) + ' orders'; }
  setX();
  var mo = '<span></span>', pm = -1, g = '', DN = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];
  for (w = 0; w < 12; w++) { var m = D[w * 7 + 3].m; mo += '<span>' + (m !== pm ? MN[m] : '') + '</span>'; pm = m; }
  for (r = 0; r < 7; r++) { g += '<div role="row"><span class="hm-d" aria-hidden="true">' + DN[r] + '</span>'; for (w = 0; w < 12; w++) { i = w * 7 + r; g += '<span class="hm-c" role="gridcell" data-i="' + i + '" tabindex="' + (i === cur ? 0 : -1) + '"></span>'; } g += '</div>'; }
  var keys = [0, 1, 2, 3, 4].map(function (l) { return c.legend ? '<button class="hm-kb" type="button" data-k="' + l + '" aria-pressed="false"><i class="hm-k" data-l="' + l + '"></i><span class="sr"></span></button>' : '<i class="hm-k" data-l="' + l + '"></i>'; }).join('');
  var el = $('[data-hm]', box);
  el.innerHTML = '<div class="hm-top"><div><p class="hm-l" data-l>Orders · last 12 weeks</p><p class="hm-big"><span data-v></span><span class="hm-u" data-u>orders</span></p></div>' + (c.metric ? '<div class="me-sw" role="radiogroup" aria-label="Show"></div>' : '') + '</div>'
    + '<div class="hm-wrap" data-wrap><div class="hm-mo" aria-hidden="true">' + mo + '</div><div class="hm-g" role="grid" aria-label="Orders per day for the last 12 weeks. Arrow keys move by day and by week." data-g>' + g + '</div>'
    + (c.tip ? '<div class="hm-tip" data-tip aria-hidden="true"><b><span data-tv></span><small data-tu></small></b><span data-td></span></div>' : '') + '</div>'
    + '<div class="hm-foot"><span data-hint>' + (c.legend ? 'Press a colour to find those days.' : 'Darker days had more orders.') + '</span><span class="hm-key"><span aria-hidden="true">Less</span>' + keys + '<span aria-hidden="true">More</span></span></div><p class="sr" aria-live="polite" data-say></p>';
  var grid = $('[data-g]', el), wrap = $('[data-wrap]', el), tip = $('[data-tip]', el), say = $('[data-say]', el), uEl = $('[data-u]', el), hint = $('[data-hint]', el);
  var byI = []; $$('.hm-c', el).forEach(function (e) { byI[+e.getAttribute('data-i')] = e; });
  var kbs = $$('.hm-kb', el), lbl = TLline($('[data-l]', el));
  var big = TLroll($('[data-v]', el), { value: 0, fmt: function (n) { return filt >= 0 ? String(n) : fmt(n); }, dur: 620, live: false });
  var tv = tip ? TLroll($('[data-tv]', tip), { value: 0, fmt: fmt, dur: 460, live: false }) : null;
  var vec = tip ? TLvec([0, 0], function (x) { tip.style.transform = 'translate(' + x[0].toFixed(1) + 'px,' + x[1].toFixed(1) + 'px)'; }, { dur: 380, zeta: .78, eps: .05 }) : null;
  function paint(sweep) {
    byI.forEach(function (e, i) {
      var v = D[i][M]; e.style.transitionDelay = sweep && moving() ? (Math.floor(i / 7) * 32 + (i % 7) * 8) + 'ms' : '';
      e.setAttribute('data-l', lev(v));
      e.setAttribute('aria-label', D[i].n + ': ' + (M === 'k' ? TLkes(v) : v + ' ' + unit(v)) + (D[i].shut ? ', shop closed' : ''));
    });
    kbs.forEach(function (b, l) { b.lastChild.textContent = range(l); });
    if (sweep) setTimeout(function () { byI.forEach(function (e) { e.style.transitionDelay = ''; }); }, 1000);
  }
  paint(false);
  function rest(dir) {
    if (filt >= 0) { var k = 0; D.forEach(function (d) { if (lev(d[M]) === filt) k++; }); lbl.set(range(filt), dir); big.set(k); uEl.textContent = k === 1 ? 'day' : 'days'; return k; }
    lbl.set((M === 'k' ? 'Sales' : 'Orders') + ' · last 12 weeks', dir);
    if (seen) big.set(tot()); uEl.textContent = unit(2);
  }
  function tipTo(i, jump) {
    var e = byI[i], wr = wrap.getBoundingClientRect(), cr = e.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    var x = Math.max(-4, Math.min(wr.width - tw + 4, cr.left - wr.left + cr.width / 2 - tw / 2)), y = cr.top - wr.top - th - 9;
    if (y < -6) y = cr.bottom - wr.top + 9;
    vec.to([x, y], { jump: jump });
  }
  function show(i) {
    if (i === act) return; var was = act; act = i;
    if (was >= 0) byI[was].classList.remove('is-on'); byI[i].classList.add('is-on');
    var d = D[i];
    if (tip) {
      var first = !tip.classList.contains('is-on');
      tv.set(d[M], { instant: first }); $('[data-tu]', tip).textContent = unit(d[M]); $('[data-td]', tip).textContent = d.n + (d.shut ? ' · shop closed' : '');
      tip.classList.add('is-on'); tipTo(i, first || !moving());
    } else { lbl.set(d.n + (d.shut ? ' · shop closed' : ''), was < 0 || i > was ? 1 : -1); big.set(d[M]); uEl.textContent = unit(d[M]); }
  }
  function hide() { if (act < 0) return; byI[act].classList.remove('is-on'); act = -1; if (tip) tip.classList.remove('is-on'); else rest(-1); }
  function roving(i) { byI[cur].tabIndex = -1; cur = i; byI[i].tabIndex = 0; }
  function cellOf(e) { return e.target.closest ? e.target.closest('.hm-c') : null; }
  grid.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') { e.preventDefault(); return; } var t = cellOf(e); if (t) show(+t.getAttribute('data-i')); });
  grid.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; var t = cellOf(e); if (t) show(+t.getAttribute('data-i')); });
  grid.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !grid.contains(document.activeElement)) hide(); });
  document.addEventListener('pointerdown', function (e) { if (act >= 0 && e.pointerType !== 'mouse' && !grid.contains(e.target)) hide(); });
  grid.addEventListener('focusin', function (e) { var t = cellOf(e); if (t) { roving(+t.getAttribute('data-i')); show(cur); } });
  grid.addEventListener('focusout', function (e) { if (!grid.contains(e.relatedTarget)) hide(); });
  grid.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { hide(); return; }
    var i = cur, j = { ArrowUp: i - 1, ArrowDown: i + 1, ArrowLeft: i - 7, ArrowRight: i + 7, Home: 0, End: N - 1 }[e.key];
    if (j == null) return; e.preventDefault(); j = Math.max(0, Math.min(N - 1, j));
    if (j === i) { show(i); return; } byI[j].focus({ preventScroll: true });
  });
  kbs.forEach(function (b, l) { b.addEventListener('click', function () {
    filt = filt === l ? -1 : l; kbs.forEach(function (x, j) { x.setAttribute('aria-pressed', String(j === filt)); });
    byI.forEach(function (e, i) { e.classList.toggle('is-dim', filt >= 0 && lev(D[i][M]) !== filt); });
    var k = rest(filt >= 0 ? 1 : -1); say.textContent = filt >= 0 ? range(filt) + ': ' + k + ' days.' : 'Showing every day.';
  }); });
  if (c.metric) TLseg($('.me-sw', el), ['Orders', 'Sales'], function (k) {
    M = k ? 'k' : 'o'; setX(); paint(true); hint.textContent = M === 'k' ? 'Darker days sold more.' : 'Darker days had more orders.'; rest(k ? 1 : -1);
    if (act >= 0) { var a = act; act = -1; byI[a].classList.remove('is-on'); show(a); }
    say.textContent = (M === 'k' ? 'Sales, ' : 'Orders, ') + fmt(tot()) + ' in 12 weeks.';
  }, { cls: 'me' });
  if (moving()) byI.forEach(function (e) { e.style.opacity = '0'; });
  TLonView(el, function () {
    seen = true;
    byI.forEach(function (e, i) { e.style.opacity = ''; if (!moving()) return; var w = Math.floor(i / 7), r = i % 7, all = c.wave === 'all';
      e.animate(all ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'scale(.55)' }, { opacity: 1, transform: 'none' }], { duration: all ? 600 : 460, delay: all ? 0 : c.wave === 'cols' ? w * 45 : (w + r) * 26, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }); });
    big.set(tot(), { dir: 'up' });
  });
};`;

const hmHtml = '<div class="hm" data-hm></div>';
const heatmap = {
  id: 'heatmap', n: '32', name: 'Activity heatmap', h: 330,
  claim: 'Twelve weeks of orders, <em>one square a day.</em>',
  lead: 'Orders per day at Duka Fresh, for the last 12 weeks. Darker orange means a busier day. Point at a day, tap it, or tab in and use the arrow keys. The number rolls to that day.',
  ref: null,
  noteHint: 'B, with D’s switch', moreHint: 'the same grid for one product',
  css: hmCss, js: hmJs,
  opts: [
    {
      k: 'B', name: 'A small card glides from day to day', kind: 'Lively, after Arc',
      line: 'The squares wave in once, corner to corner. Point at a day and a small card springs over to it. Its number rolls to that day. The total stays at the top.',
      from: [arc('activity-heatmap'), house('n06'), house('n07')], tryit: 'Sweep the pointer across a week, then tab in and use the arrows.',
      needs: 'TLroll, TLvec and a grid of squares.', keys: 'Tab in. Up and down move a day, left and right a week. Home, End. Escape hides the card.', off: 'All squares show at once. The card jumps.', law: 'Proximity: the number sits right on the day it names.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: hmHtml, js: String.raw`TL4heat(box, { tip: true });`,
    },
    {
      k: 'A', name: 'The heading reads the day', kind: 'Plain',
      line: 'No floating card. The heading above the grid changes to the day you point at, and its number rolls. The squares fade in together.',
      from: [arc('activity-heatmap'), ['GitHub contributions', null]], tryit: 'Point at a day and watch the heading.',
      needs: 'TLroll and a grid of squares.', keys: 'Same keys as B. Escape goes back to the total.', off: 'The squares show at once. The number swaps with a short fade.', law: 'Jakob: works like a contribution graph.',
      tags: ['motion:some', 'speed:quick', 'density:compact', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: hmHtml, js: String.raw`TL4heat(box, { wave: 'all' });`,
    },
    {
      k: 'C', name: 'The key finds those days', kind: 'Mix',
      line: 'The squares come in one week at a time. Press a colour in the key and only those days stay lit. The heading rolls to how many days that is.',
      from: [arc('activity-heatmap'), house('n07')], tryit: 'Press the darkest colour in the key. Press it again to undo.',
      needs: 'TLroll and a grid of squares.', keys: 'Same keys as B. Tab reaches the key; Space or Enter presses a colour.', off: 'The other days dim at once.', law: 'Hick: five colours to pick from, no more.',
      tags: ['motion:some', 'speed:mid', 'density:compact', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: hmHtml, js: String.raw`TL4heat(box, { legend: true, wave: 'cols' });`,
    },
    {
      k: 'D', name: 'Orders or sales, recoloured in a sweep', kind: 'Reference, pushed',
      line: 'B’s gliding card, plus a switch between orders and sales. Switching sweeps the new colours across the grid, left to right. The total rolls to KES.',
      from: [arc('activity-heatmap'), house('n06'), ['Round 3 donut switch', null]], tryit: 'Switch to Sales and watch the sweep, then point at a day.',
      needs: 'TLroll, TLvec, TLseg and a grid of squares.', keys: 'Arrows move along the switch. Same grid keys as B.', off: 'The colours change at once.', law: 'Proximity: the switch sits next to the number it changes.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'open:inplace', 'new:novel', 'look:ember'],
      html: hmHtml, h: 360, js: String.raw`TL4heat(box, { tip: true, metric: true });`,
    },
  ],
};

/* ================= 33 Reorderable list ================= */
const roCss = String.raw`
#reorder .ro { width: min(100%, 420px); display: grid; gap: 12px; }
#reorder .ro-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
#reorder .ro-t { margin: 0; font-weight: 600; font-size: 15px; color: var(--ink); }
#reorder .ro-st { margin: 2px 0 0; min-height: 1.45em; font-size: 13px; line-height: 1.45; color: var(--muted); }
#reorder .ro-st.tll { display: grid; }
#reorder .ro-st.tll > span { white-space: normal; }
#reorder .ro-st b { font-weight: 500; color: var(--ink-soft); }
#reorder .ro-lw { position: relative; }
#reorder .ro-l { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
#reorder .ro-l.is-sorting { -webkit-user-select: none; user-select: none; }
#reorder .ro-r { position: relative; z-index: 1; }
#reorder .ro-r.is-lift, #reorder .ro-r.is-drag { z-index: 3; }
#reorder .ro-in { position: relative; display: flex; align-items: center; gap: 12px; min-height: 56px; padding: 0 4px 0 12px; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-sm); transition: transform var(--sp-snappy-d) var(--sp-snappy), border-color .2s; }
#reorder .ro-in::after { content: ""; position: absolute; inset: -1px; border-radius: inherit; box-shadow: var(--shadow-lg); opacity: 0; transition: opacity .25s var(--ease-out); pointer-events: none; }
#reorder .is-lift .ro-in { transform: scale(var(--lift, 1.03)) rotate(var(--tilt, 0deg)); border-color: var(--line-hi); }
#reorder .is-lift .ro-in::after { opacity: 1; }
#reorder .ro-n { flex: none; width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; background: rgb(var(--ink-rgb) / .07); font: 400 15px/1 var(--font-num); color: var(--ink); }
#reorder .ro-n .tlr-c { -webkit-mask-image: none; mask-image: none; }
#reorder .ro-r:first-child .ro-n { background: var(--accent); color: var(--on-accent); }
#reorder .ro-b { flex: 1; min-width: 0; display: grid; }
#reorder .ro-b b { font-weight: 600; font-size: 14.5px; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#reorder .ro-b small { font-size: 12.5px; color: var(--muted); }
#reorder .ro-e { flex: none; display: grid; justify-items: end; font: 400 17px/1.1 var(--font-num); color: var(--ink); }
#reorder .ro-e small { font: 500 10px/1.2 var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
#reorder .ro-g { flex: none; width: 36px; height: 44px; display: grid; place-items: center; border-radius: 8px; color: var(--muted); cursor: grab; touch-action: none; transition: background-color .15s, color .15s; }
#reorder .ro-g:hover, #reorder .ro-g[aria-pressed="true"] { background: rgb(var(--ink-rgb) / .06); color: var(--ink); }
#reorder .is-drag .ro-g { cursor: grabbing; }
#reorder .ro-g svg { width: 16px; height: 16px; fill: currentColor; }
#reorder .ro-g:focus-visible, #reorder .ro-ar button:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
#reorder .ro-ar { flex: none; display: flex; gap: 2px; }
#reorder .ro-ar button { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 8px; color: var(--ink-soft); transition: background-color .15s, transform .15s var(--ease-out), opacity .15s; }
#reorder .ro-ar button:hover { background: rgb(var(--ink-rgb) / .06); }
#reorder .ro-ar button:active { transform: scale(.92); }
#reorder .ro-ar button[aria-disabled="true"] { opacity: .3; cursor: default; }
#reorder .ro-ar svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
#reorder .ro-ph { position: absolute; left: 0; right: 0; top: 0; border-radius: 12px; border: 1.5px dashed var(--line-hi); opacity: 0; pointer-events: none; transition: transform .2s var(--ease-out), opacity .15s; }
#reorder .ro-ph.is-on { opacity: 1; }
#reorder .ro-ok { display: inline-flex; align-items: center; gap: 6px; }
#reorder .ro-ok .l-tick { width: 16px; height: 16px; flex: 0 0 16px; }
@media (pointer: coarse) { #reorder .ro-ar button { width: 40px; height: 40px; } #reorder .ro-g { width: 44px; } }
@container (max-width: 360px) { #reorder .ro-b small { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } }`;

const roJs = String.raw`
window.TL4reorder = function (box, c) {
  c = c || {};
  var S = [['Wanjiku Kamau', 'Westlands', '3 bags', [0.6, 0.4]], ['Grace Njeri', 'Karen', '2 bags', [-3.8, -11]], ['Brian Ochieng', 'Kilimani', '1 bag', [2.2, -2.1]], ['Peter Mwangi', 'Upper Hill', '4 bags', [3.4, -3.6]], ['Amina Hassan', 'Lavington', '2 bags', [-1.6, -2.4]]];
  var GRIP = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="5.5" cy="3.5" r="1.4"/><circle cx="10.5" cy="3.5" r="1.4"/><circle cx="5.5" cy="8" r="1.4"/><circle cx="10.5" cy="8" r="1.4"/><circle cx="5.5" cy="12.5" r="1.4"/><circle cx="10.5" cy="12.5" r="1.4"/></svg>';
  var UP = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 8.6 7 4.6l4 4"/></svg>', DN = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 5.4 7 9.4l4-4"/></svg>';
  var hid = box.id + '-hint', el = $('[data-ro]', box);
  el.innerHTML = '<div class="ro-top"><div><p class="ro-t">Otieno’s stops today</p><p class="ro-st" data-st>' + (c.eta ? 'Back at the shop by <b data-back></b>' : 'Drag a grip, or press Space on it and use the arrows.') + '</p></div>' + (c.eta ? '<button class="l-btn sm" type="button" data-best>Best order</button>' : '') + '</div>'
    + '<div class="ro-lw"><ol class="ro-l" data-list aria-label="Delivery stops, in order">' + S.map(function (s, k) {
      return '<li class="ro-r" data-k="' + k + '"><div class="ro-in"><span class="ro-n" data-n aria-hidden="true"></span><span class="ro-b"><b>' + s[0] + '</b><small>' + s[1] + ' · ' + s[2] + '</small></span>'
        + (c.eta ? '<span class="ro-e"><small>About</small><span data-e></span></span>' : '')
        + (c.arrows ? '<span class="ro-ar"><button type="button" class="ro-up" aria-label="Move ' + s[0] + ' up">' + UP + '</button><button type="button" class="ro-dn" aria-label="Move ' + s[0] + ' down">' + DN + '</button></span>' : '')
        + '<button class="ro-g" type="button" aria-pressed="false" aria-describedby="' + hid + '">' + GRIP + '</button></div></li>'; }).join('') + '</ol>'
    + (c.ph ? '<i class="ro-ph" aria-hidden="true"></i>' : '') + '</div>'
    + '<p class="sr" id="' + hid + '">Press Space to pick it up. Up and down arrows move it. Space drops it. Escape puts it back.</p><p class="sr" aria-live="assertive" data-say></p>';
  var list = $('[data-list]', el), say = $('[data-say]', el), ph = $('.ro-ph', el), stEl = $('[data-st]', el), SP = c.ease ? { e: 'cubic-bezier(.22,1,.36,1)', d: 220 } : null;
  function hm(n) { n = Math.round(n); var h = Math.floor(n / 60), m = n % 60; return h + ':' + (m < 10 ? '0' : '') + m; }
  function rows() { return $$('.ro-r', list); }
  function name(li) { return S[+li.getAttribute('data-k')][0]; }
  function travel(a, b) { return Math.round(Math.hypot(a[0] - b[0], a[1] - b[1]) * 3.2 + 4); }
  function route(ks) { var t = 10 * 60 + 5, p = [0, 0], out = []; ks.forEach(function (k) { t += travel(p, S[k][3]); out.push(t); t += 6; p = S[k][3]; }); return { at: out, back: t + travel(p, [0, 0]) }; }
  var back = c.eta ? TLroll($('[data-back]', el), { value: 0, fmt: hm, dur: 560, live: false }) : null;
  rows().forEach(function (li) { li._n = TLroll($('[data-n]', li), { value: 1, fmt: String, dur: 460, live: false }); if (c.eta) li._e = TLroll($('[data-e]', li), { value: 600, fmt: hm, dur: 520, live: false }); });
  function sync(inst) {
    var rs = rows(), R = route(rs.map(function (li) { return +li.getAttribute('data-k'); }));
    rs.forEach(function (li, k) {
      li._n.set(k + 1, { instant: inst }); $('.ro-g', li).setAttribute('aria-label', 'Move ' + name(li) + ', stop ' + (k + 1) + ' of ' + rs.length);
      if (c.arrows) { $('.ro-up', li).setAttribute('aria-disabled', String(k === 0)); $('.ro-dn', li).setAttribute('aria-disabled', String(k === rs.length - 1)); }
      if (c.eta) li._e.set(R.at[k], { instant: inst });
    });
    if (back) back.set(R.back, { instant: inst });
    return R;
  }
  sync(true);
  var stl = c.eta ? null : TLline(stEl);
  function changed() {
    if (!stl) return;
    stl.set(c.saved ? 'Saved. Otieno sees the new order.' : 'New order saved.', 1);
    if (c.saved) { var sp = stEl.lastChild; if (sp) sp.innerHTML = '<span class="ro-ok">' + TICK + 'Saved. Otieno sees the new order.</span>'; }
  }
  function stepIt(r, d) { if (d > 0) { var nx = r.nextElementSibling; if (nx) list.insertBefore(nx, r); } else { var pv = r.previousElementSibling; if (pv) list.insertBefore(pv, r.nextElementSibling); } }
  function others(r) { return rows().filter(function (x) { return x !== r; }); }
  /* move r by d places; the neighbours move around it, so r keeps focus and pointer capture */
  function moveBy(r, d, self) {
    var rs = rows(), i = rs.indexOf(r), j = Math.max(0, Math.min(rs.length - 1, i + d)); if (i === j) return false;
    TL4fflip(self ? rs : others(r), function () { while (i !== j) { stepIt(r, j > i ? 1 : -1); i += j > i ? 1 : -1; } }, { ease: SP });
    sync(); return true;
  }
  function lift(r, on) { r.classList.toggle('is-lift', on); }
  function where(r) { return name(r) + ', stop ' + (rows().indexOf(r) + 1) + ' of ' + rows().length + '.'; }
  var T0 = 0;
  function placePh(idx, r, step, first) {
    if (!ph) return; if (idx < 0) { ph.classList.remove('is-on'); return; }
    if (first) { ph.style.transition = 'none'; ph.style.height = r.offsetHeight + 'px'; }
    ph.style.transform = 'translateY(' + (T0 + idx * step) + 'px)'; if (first) { ph.offsetWidth; ph.style.transition = ''; } ph.classList.add('is-on');
  }
  /* pointer drag on the grip */
  var drag = null, grab = null, grab0 = 0;
  list.addEventListener('pointerdown', function (e) {
    var g = e.target.closest && e.target.closest('.ro-g'); if (!g || e.button > 0) return;
    e.preventDefault(); var r = g.closest('.ro-r'), rs = rows();
    if (grab) drop(false);
    [r._fl, r._dr].forEach(function (a) { if (a) a.cancel(); }); r._fl = r._dr = null;
    try { g.setPointerCapture(e.pointerId); } catch (x) {}
    T0 = list.firstElementChild.offsetTop;
    drag = { r: r, y0: e.clientY, top0: r.offsetTop, step: rs.length > 1 ? rs[1].offsetTop - rs[0].offsetTop : r.offsetHeight, ly: e.clientY, lt: performance.now(), from: rs.indexOf(r), tt: 0 };
    r.classList.add('is-drag'); lift(r, true); list.classList.add('is-sorting'); placePh(drag.from, r, drag.step, true);
  });
  list.addEventListener('pointermove', function (e) {
    if (!drag) return; var r = drag.r, rs = rows(), n = rs.length;
    var vt = drag.top0 + e.clientY - drag.y0, lo = T0, hi = T0 + (n - 1) * drag.step;
    var cv = vt < lo ? lo - Math.pow(lo - vt, .75) : vt > hi ? hi + Math.pow(vt - hi, .75) : vt;
    var tgt = Math.max(0, Math.min(n - 1, Math.round((cv - T0) / drag.step))), i = rs.indexOf(r);
    if (tgt !== i) { TL4fflip(others(r), function () { while (i !== tgt) { stepIt(r, tgt > i ? 1 : -1); i += tgt > i ? 1 : -1; } }, { ease: SP }); sync(); placePh(tgt, r, drag.step); }
    r.style.transform = 'translateY(' + (cv - r.offsetTop).toFixed(1) + 'px)';
    if (c.tilt) { var now = performance.now(), v = (e.clientY - drag.ly) / Math.max(8, now - drag.lt); drag.ly = e.clientY; drag.lt = now;
      r.style.setProperty('--tilt', Math.max(-2.5, Math.min(2.5, v * 2.2)).toFixed(2) + 'deg'); clearTimeout(drag.tt); drag.tt = setTimeout(function () { r.style.setProperty('--tilt', '0deg'); }, 90); }
  });
  function end() {
    if (!drag) return; var d = drag, r = d.r; drag = null; clearTimeout(d.tt);
    var off = r.style.transform; r.style.transform = ''; r.classList.remove('is-drag'); r.style.setProperty('--tilt', '0deg'); lift(r, false); list.classList.remove('is-sorting'); placePh(-1);
    if (moving() && off) { var sp = SP || TLsp(c.drop || 'bouncy'); r._dr = r.animate([{ transform: off }, { transform: 'translateY(0)' }], { duration: sp.d, easing: sp.e }); r._dr.onfinish = function () { r._dr = null; }; }
    if (rows().indexOf(r) !== d.from) { say.textContent = name(r) + ' moved to ' + where(r).replace(name(r) + ', ', ''); changed(); }
  }
  list.addEventListener('pointerup', end); list.addEventListener('pointercancel', end); list.addEventListener('lostpointercapture', end);
  /* keyboard: Space picks up, arrows move, Space drops, Escape puts it back */
  function pick(r) { grab = r; grab0 = rows().indexOf(r); $('.ro-g', r).setAttribute('aria-pressed', 'true'); lift(r, true); say.textContent = 'Picked up ' + where(r) + ' Up and down arrows move it. Space drops it. Escape puts it back.'; }
  function release() { var r = grab; grab = null; if (!r) return r; $('.ro-g', r).setAttribute('aria-pressed', 'false'); lift(r, false); return r; }
  function drop(talk) { var r = release(); if (!r) return; if (talk) say.textContent = 'Dropped ' + where(r); if (rows().indexOf(r) !== grab0) changed(); }
  list.addEventListener('keydown', function (e) {
    var g = e.target.closest && e.target.closest('.ro-g'); if (!g) return; var r = g.closest('.ro-r'), k = e.key;
    if (k === ' ' || k === 'Enter') { e.preventDefault(); if (grab === r) drop(true); else { if (grab) drop(false); pick(r); } return; }
    if (grab !== r) return;
    if (k === 'ArrowUp' || k === 'ArrowDown' || k === 'Home' || k === 'End') { e.preventDefault(); if (moveBy(r, { ArrowUp: -1, ArrowDown: 1, Home: -99, End: 99 }[k], true)) say.textContent = where(r); }
    else if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); moveBy(r, grab0 - rows().indexOf(r), true); release(); say.textContent = 'Put back. ' + where(r); }
  });
  list.addEventListener('focusout', function (e) { if (grab && !grab.contains(e.relatedTarget)) drop(true); });
  /* up and down buttons */
  list.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.ro-ar button'); if (!b || b.getAttribute('aria-disabled') === 'true') return;
    var r = b.closest('.ro-r'); if (moveBy(r, b.classList.contains('ro-up') ? -1 : 1, true)) { say.textContent = where(r); changed(); }
  });
  var best = $('[data-best]', el);
  if (best) best.addEventListener('click', function () {
    var ks = [0, 1, 2, 3, 4], top = null, bt = 1e9;
    (function perm(a, l) { if (l === a.length) { var t = route(a).back; if (t < bt) { bt = t; top = a.slice(); } return; } for (var i = l; i < a.length; i++) { var x = a[l]; a[l] = a[i]; a[i] = x; perm(a, l + 1); a[i] = a[l]; a[l] = x; } })(ks, 0);
    var before = route(rows().map(function (li) { return +li.getAttribute('data-k'); })).back, by = {};
    rows().forEach(function (li) { by[li.getAttribute('data-k')] = li; });
    TL4fflip(rows(), function () { top.forEach(function (k) { list.appendChild(by[k]); }); }, { sp: 'soft' });
    sync(); var saved = before - bt;
    best.textContent = saved > 0 ? saved + ' min saved' : 'Already the best';
    say.textContent = saved > 0 ? 'Stops put in the best order. Back at the shop by ' + hm(bt) + ', ' + saved + ' minutes sooner.' : 'This is already the best order.';
    clearTimeout(best._t); best._t = setTimeout(function () { best.textContent = 'Best order'; }, 2200);
  });
};`;

const roHtml = '<div class="ro" data-ro></div>';
const reorder = {
  id: 'reorder', n: '33', name: 'Reorderable list', h: 420,
  claim: 'Drag a row and <em>the others make room.</em>',
  lead: 'Otieno’s delivery stops for today. Put them in the order he should ride. Drag the dotted grip with a mouse or a finger, or tab to it, press Space, and use the arrow keys.',
  ref: null,
  noteHint: 'B’s lift with C’s buttons', moreHint: 'a list of shop shelves to sort',
  css: roCss, js: roJs,
  opts: [
    {
      k: 'B', name: 'The row lifts and leans', kind: 'Lively, after Arc',
      line: 'Grab a row and it lifts, a shadow under it. It leans a little as you move it fast. The other rows slide aside on a spring, and every stop number rolls to its new place.',
      from: [arc('reorderable-list'), house('n07'), skill('animate')], tryit: 'Drag Grace from stop 2 to the bottom, quickly. Then try the keys.',
      needs: 'A small script, TLroll and a FLIP helper.', keys: 'Tab to a grip. Space picks up, Up and Down move, Home and End, Space drops, Escape puts it back.', off: 'The row follows your finger. Others jump into place.', law: 'Fitts: the grip runs the full height of the row.',
      tags: ['motion:springy', 'speed:mid', 'depth:lifted', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: roHtml, top: true, js: String.raw`TL4reorder(box, { tilt: true });`,
    },
    {
      k: 'A', name: 'A dashed gap shows where it lands', kind: 'Plain',
      line: 'The usual sortable list. The row you drag gets a shadow but does not grow. A dashed outline shows where it will land. Rows move on our smooth curve, with no spring.',
      from: [arc('reorderable-list'), ['dnd-kit sortable', 'https://dndkit.com']], tryit: 'Drag a row slowly and watch the dashed gap.',
      needs: 'A small script and TLroll.', keys: 'Same keys as B.', off: 'Rows jump into place.', law: 'Jakob: works like most sortable lists.',
      tags: ['motion:some', 'speed:quick', 'depth:some', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: roHtml, top: true, css: String.raw`#t33A .ro-in { --lift: 1; }`, js: String.raw`TL4reorder(box, { ease: true, ph: true });`,
    },
    {
      k: 'C', name: 'Drag it, or tap up and down', kind: 'Mix',
      line: 'B’s spring, plus small up and down buttons on every row, for people who would rather tap than drag. After each change a tick says it is saved.',
      from: [arc('reorderable-list'), house('n29'), house('n07')], tryit: 'Tap the down arrow on Wanjiku twice, then drag her back.',
      needs: 'A small script, TLroll and a FLIP helper.', keys: 'Tab reaches each arrow and grip. Same grip keys as B.', off: 'Rows jump into place. The tick shows at once.', law: 'Fitts: big buttons for thumbs, so dragging is never the only way.',
      tags: ['motion:springy', 'speed:mid', 'depth:some', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: roHtml, top: true, js: String.raw`TL4reorder(box, { arrows: true, saved: true, drop: 'snappy' });`,
    },
    {
      k: 'D', name: 'Each stop’s time rolls as you sort', kind: 'Reference, pushed',
      line: 'Each row shows when Otieno gets there. Move a stop and every time after it rolls, along with when he is back. Best order sorts the whole list for the shortest ride.',
      from: [arc('reorderable-list'), house('n07'), house('c24')], tryit: 'Press Best order, then drag Karen to the top and watch the times.',
      needs: 'A small script, TLroll and a FLIP helper.', keys: 'Same grip keys as B. Best order is a normal button.', off: 'Rows and times jump into place.', law: 'Proximity: each time sits on its own stop.',
      tags: ['motion:springy', 'speed:mid', 'depth:lifted', 'feedback:loud', 'open:inplace', 'new:novel', 'look:ember'],
      html: roHtml, top: true, js: String.raw`TL4reorder(box, { eta: true, tilt: true });`,
    },
  ],
};

/* ================= 34 Timeline ================= */
const tkCss = String.raw`
#timeline .tk { width: min(100%, 440px); display: grid; gap: 14px; }
#timeline .tk-top { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; flex-wrap: wrap; }
#timeline .tk-k { margin: 0; font: 500 11px/1.4 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
#timeline .tk-h1 { margin: 2px 0 0; display: flex; align-items: baseline; gap: 6px; font-size: 14px; color: var(--muted); }
#timeline .tk-h1 b { font: 400 28px/1 var(--font-num); color: var(--ink); }
#timeline .tk-eta { margin: 0; display: flex; align-items: baseline; gap: 5px; font-size: 13.5px; color: var(--ink-soft); }
#timeline .tk-eta b { font: 400 22px/1 var(--font-num); color: var(--accent-text); }
#timeline .tk-day { margin: 0 0 -4px; font: 500 10.5px/1 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
#timeline .tk-l { list-style: none; margin: 0; padding: 0; }
#timeline .tk-r { position: relative; display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 12px; padding-bottom: 12px; box-sizing: border-box; }
#timeline .tk-r:last-child { padding-bottom: 0; }
#timeline .tk-seg { position: absolute; left: 10px; top: 17px; width: 2px; height: 100%; background: var(--line-hi); overflow: hidden; }
#timeline .tk-r:last-child .tk-seg { display: none; }
#timeline .tk-seg i { position: absolute; inset: 0; background: var(--accent); transform: scaleY(0); transform-origin: top; transition: transform .5s var(--ease-out); }
#timeline .tk-r[data-f] .tk-seg i { transform: none; }
#timeline .tk-mw { position: relative; z-index: 1; width: 22px; height: 22px; margin-top: 6px; }
#timeline .tk-mw svg { width: 22px; height: 22px; display: block; overflow: visible; }
#timeline .tk-o { fill: var(--paper); stroke: var(--line-hi); stroke-width: 1.6; transition: stroke .25s; }
#timeline .tk-f, #timeline .tk-p { transform-origin: center; transform-box: fill-box; }
#timeline .tk-f { fill: var(--accent); opacity: 0; transform: scale(.6); transition: transform var(--sp-bouncy-d) var(--sp-bouncy), opacity .2s, fill .2s; }
#timeline .tk-k2, #timeline .tk-x { fill: none; stroke: var(--on-accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 16; stroke-dashoffset: 16; transition: stroke-dashoffset .34s var(--ease-out) .12s; }
#timeline .tk-p { fill: var(--accent); opacity: 0; transform: scale(.4); transition: transform var(--sp-bouncy-d) var(--sp-bouncy), opacity .2s; }
#timeline .tk-pu { position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--accent); opacity: 0; pointer-events: none; }
#timeline [data-s="run"] .tk-o { stroke: var(--accent); stroke-width: 2; }
#timeline [data-s="run"] .tk-p { opacity: 1; transform: none; }
#timeline [data-s="run"] .tk-pu { animation: tk-pulse 1.8s var(--ease-out) infinite; }
@keyframes tk-pulse { from { opacity: .55; transform: scale(1); } to { opacity: 0; transform: scale(1.9); } }
html[data-motion="off"] #timeline .tk-pu { animation: none !important; opacity: 0; }
#timeline [data-s="done"] .tk-f, #timeline [data-s="fail"] .tk-f { opacity: 1; transform: none; }
#timeline [data-s="fail"] .tk-f { fill: var(--accent-text); }
#timeline [data-s="done"] .tk-k2, #timeline [data-s="fail"] .tk-x { stroke-dashoffset: 0; }
#timeline .tk-b { min-width: 0; }
#timeline .tk-hd { width: calc(100% + 8px); min-height: 34px; display: flex; align-items: center; gap: 10px; padding: 4px 8px; margin-left: -8px; border-radius: 8px; text-align: left; transition: background-color .15s; box-sizing: border-box; }
#timeline .tk-hd:hover { background: rgb(var(--ink-rgb) / .05); }
#timeline .tk-hd:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
#timeline .tk-t { flex: 1; min-width: 0; font-weight: 600; font-size: 14.5px; color: var(--ink); }
#timeline [data-s="wait"] .tk-t { color: var(--muted); font-weight: 500; }
#timeline .tk-at { flex: none; font: 500 11.5px/1 var(--font-mono); color: var(--muted); }
#timeline [data-s="run"] .tk-at, #timeline [data-s="fail"] .tk-at { color: var(--accent-text); }
#timeline .tk-hd svg { flex: none; width: 14px; height: 14px; fill: none; stroke: var(--muted); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#timeline .tk-hd[aria-expanded="true"] svg { transform: rotate(180deg); }
#timeline .tk-s { margin: 0; font-size: 13px; line-height: 1.45; color: var(--muted); }
#timeline .tk-d { overflow: hidden; }
#timeline .tk-d p { margin: 0; padding: 8px 0 2px; font-size: 13px; line-height: 1.5; color: var(--ink-soft); }
#timeline .tk-d p span { display: block; margin-top: 6px; padding: 8px 10px; border-radius: 10px; background: var(--paper-raised); border: 1px solid var(--line); font-size: 12.5px; color: var(--ink-soft); }
#timeline .tk-foot { display: flex; align-items: center; gap: 8px 10px; flex-wrap: wrap; }
#timeline .tk-say { font-size: 12.5px; color: var(--muted); }
#timeline .tk-pc { overflow: clip; padding: 12px 12px 10px; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); }
#timeline .tk-pt { position: relative; height: 14px; margin: 0 10%; }
#timeline .tk-pt::before { content: ""; position: absolute; left: 0; right: 0; top: 6px; height: 2px; border-radius: 1px; background: var(--line-hi); }
#timeline .tk-pf { position: absolute; left: 0; right: 0; top: 6px; height: 2px; border-radius: 1px; background: var(--accent); transform-origin: left; transform: scaleX(var(--p, 0)); transition: transform .7s var(--ease-out); }
#timeline .tk-pm { position: absolute; inset: 0; transform: translateX(calc(var(--p, 0) * 100%)); transition: transform .7s var(--ease-out); pointer-events: none; z-index: 2; }
#timeline .tk-pm i { position: absolute; left: -7px; top: 0; width: 14px; height: 14px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px var(--paper-raised); }
#timeline .tk-ps { list-style: none; margin: 8px 0 0; padding: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); text-align: center; font-size: 11.5px; line-height: 1.25; color: var(--muted); }
#timeline .tk-ps li.is-on { color: var(--ink); font-weight: 600; }
#timeline .tk-pk { position: absolute; top: 3px; width: 8px; height: 8px; margin-left: -4px; border-radius: 50%; background: var(--paper-raised); box-shadow: inset 0 0 0 1.5px var(--line-hi); transition: background-color .3s, box-shadow .3s; }
#timeline .tk-pk.is-done { background: var(--accent); box-shadow: none; }
#timeline .tk-pk.is-fail { background: var(--accent-text); box-shadow: none; }
#timeline .tk-r.is-new { overflow: hidden; }
@media (pointer: coarse) { #timeline .tk-hd { min-height: 44px; } }`;

const tkJs = String.raw`
window.TL4time = function (box, c) {
  c = c || {};
  var E = [
    { t: 'Order placed', at: '09:12', s: 'Wanjiku Kamau ordered 6 items.', d: 'Sukuma wiki, 2 kg tomatoes, maize flour, milk, eggs and bread.<span>Total KES 2,450</span>', p: 'Placed' },
    { t: 'Paid with PocketPay', at: '09:13', s: 'KES 2,450 paid in the PocketPay app.', w: 'Waiting for payment.', d: 'The money is held until the order arrives.<span>Receipt QK73HD9X2</span>', p: 'Paid' },
    { t: 'Packed', at: '09:41', s: 'Two bags, one kept cold.', w: 'Not packed yet.', d: 'Packed by Achieng at Duka Fresh, Westlands. Milk and eggs are in the cold bag.', p: 'Packed' },
    { t: 'Out for delivery', at: '10:05', s: 'Otieno is on the way.', w: 'Waiting for a rider.', f: 'Otieno could not find the gate. He will call Wanjiku.', d: 'Otieno rides a motorbike, plate KMFB 214Q.<span>Call him on +254 712 345 678</span>', p: 'On the way' },
    { t: 'Delivered', at: '10:38', s: 'Handed to Wanjiku at the gate.', r: 'Otieno is at the gate now.', w: 'Expected about 10:40.', f: 'No one came to the gate. Otieno will try again.', d: 'Signed for by Wanjiku. A receipt went to +254 722 410 337.', p: 'Delivered' },
  ];
  var MIN = [88, 87, 59, 35, 3], n = E.length, cur = 3, failed = false, lim = c.arrive && moving() ? -1 : 99, tm = [];
  var CHEV = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 5.5 7 9l3.5-3.5"/></svg>';
  var MK = '<svg viewBox="0 0 22 22"><circle class="tk-o" cx="11" cy="11" r="10"/><circle class="tk-f" cx="11" cy="11" r="11"/><path class="tk-k2" d="M6.6 11.4 9.6 14.3l5.8-6.4"/><path class="tk-x" d="M7.9 7.9l6.2 6.2M14.1 7.9l-6.2 6.2"/><circle class="tk-p" cx="11" cy="11" r="4.5"/></svg><span class="tk-pu"></span>';
  var el = $('[data-tk]', box);
  el.innerHTML = '<div class="tk-top"><div><p class="tk-k">Order DF-2041 · Duka Fresh</p><p class="tk-h1"><b data-done></b> of 5 steps done</p></div>'
    + (c.parcel ? '<p class="tk-eta"><span data-el>Arriving in about</span><b data-min></b><span data-eu>min</span></p>' : '') + '</div>'
    + (c.parcel ? '<div class="tk-pc" aria-hidden="true"><div class="tk-pt"><i class="tk-pf"></i>' + E.map(function (e, i) { return '<i class="tk-pk" style="left:' + (i * 25) + '%"></i>'; }).join('') + '<span class="tk-pm"><i></i></span></div><ol class="tk-ps">' + E.map(function (e) { return '<li>' + e.p + '</li>'; }).join('') + '</ol></div>' : '')
    + (c.feed ? '<p class="tk-day">Today · Thu 5 Nov</p>' : '')
    + '<ol class="tk-l" data-list aria-label="Order steps' + (c.feed ? ', newest first' : '') + '"></ol>'
    + '<div class="tk-foot"><button class="l-btn sm pri" type="button" data-next>Next update</button>' + (c.parcel ? '<button class="l-btn sm" type="button" data-fail aria-pressed="false">Report a problem</button>' : '') + '<span class="tk-say" data-st aria-live="polite"></span></div>';
  var list = $('[data-list]', el), L = [], nextB = $('[data-next]', el), failB = $('[data-fail]', el), st = $('[data-st]', el);
  var done = TLroll($('[data-done]', el), { value: 0, fmt: String, dur: 480, live: false });
  var mins = c.parcel ? TLroll($('[data-min]', el), { value: MIN[cur], fmt: function (v) { return v >= 600 ? Math.floor(v / 60) + ':' + ('0' + v % 60).slice(-2) : String(v); }, dur: 560, live: false }) : null;
  function rowHtml(i) { var e = E[i], id = box.id + '-d' + i; return '<li class="tk-r" data-i="' + i + '" data-s="wait"><span class="tk-seg" aria-hidden="true"><i></i></span><span class="tk-mw" aria-hidden="true">' + MK + '</span><div class="tk-b"><button class="tk-hd" type="button" aria-expanded="false" aria-controls="' + id + '"><span class="tk-t">' + e.t + '<span class="sr" data-sr></span></span><span class="tk-at" data-at></span>' + CHEV + '</button><p class="tk-s" data-s2></p><div class="tk-d" id="' + id + '" hidden><p>' + e.d + '</p></div></div></li>'; }
  function mk(i) { var t = document.createElement('ol'); t.innerHTML = rowHtml(i); return t.firstChild; }
  function stateOf(i) { if (i > lim) return 'wait'; return i < cur ? 'done' : i === cur ? (failed ? 'fail' : 'run') : 'wait'; }
  function paint(i) {
    var li = L[i]; if (!li) return; var s = stateOf(i), e = E[i];
    li.setAttribute('data-s', s);
    if (i < cur && i < lim) li.setAttribute('data-f', ''); else li.removeAttribute('data-f');
    $('[data-at]', li).textContent = s === 'done' ? e.at : s === 'run' ? 'Now' : s === 'fail' ? 'Failed' : 'Waiting';
    $('[data-s2]', li).textContent = s === 'wait' ? (e.w || '') : s === 'fail' ? (e.f || 'This step failed.') : s === 'run' ? (e.r || e.s) : e.s;
    $('[data-sr]', li).textContent = { done: ', done', run: ', in progress', fail: ', failed', wait: ', not yet' }[s];
  }
  function paintAll() { for (var i = 0; i < n; i++) paint(i); }
  function upd(talk) {
    var k = Math.min(cur, n); done.set(k);
    nextB.textContent = cur >= n ? 'Start again' : 'Next update';
    nextB.setAttribute('aria-disabled', String(failed)); if (failB) { failB.disabled = cur >= n; failB.textContent = failed ? 'Try again' : 'Report a problem'; failB.setAttribute('aria-pressed', String(failed)); }
    if (c.parcel) {
      var p = Math.min(cur, n - 1) / (n - 1); $('.tk-pt', el).style.setProperty('--p', p);
      $$('.tk-pk', el).forEach(function (x, i) { x.classList.toggle('is-done', i < cur || (i === n - 1 && cur >= n)); x.classList.toggle('is-fail', failed && i === cur); });
      $$('.tk-ps li', el).forEach(function (x, i) { x.classList.toggle('is-on', i === Math.min(cur, n - 1)); });
      $('[data-el]', el).textContent = cur >= n ? 'Delivered at' : failed ? 'Running late, about' : 'Arriving in about'; $('[data-eu]', el).textContent = cur >= n ? '' : 'min';
      mins.set(cur >= n ? 638 : MIN[cur] + (failed ? 15 : 0));
    }
    if (talk) st.textContent = cur >= n ? 'Delivered. Every step is done.' : failed ? E[cur].t + ' failed.' : E[cur].t + ': ' + (E[cur].r || E[cur].s);
  }
  function clearT() { tm.forEach(clearTimeout); tm = []; }
  function build() {
    list.innerHTML = ''; L = [];
    if (c.feed) { for (var i = Math.min(cur, n - 1); i >= 0; i--) { L[i] = mk(i); list.appendChild(L[i]); } }
    else for (var j = 0; j < n; j++) { L[j] = mk(j); list.appendChild(L[j]); }
    paintAll();
  }
  build(); upd();
  function addTop(i) {
    var li = mk(i); L[i] = li; list.insertBefore(li, list.firstChild); li.offsetWidth;
    if (moving()) { li.classList.add('is-new'); var h = li.offsetHeight, sp = TLsp('soft');
      var a = li.animate([{ height: '0px', paddingBottom: '0px', opacity: 0, transform: 'translateY(-10px)' }, { height: h + 'px', paddingBottom: '12px', opacity: 1, transform: 'none' }], { duration: sp.d * 1.2, easing: sp.e });
      a.onfinish = function () { li.classList.remove('is-new'); }; }
  }
  function next() {
    if (failed) return; clearT();
    if (cur >= n) { cur = 1; failed = false;
      if (c.feed) { build(); if (moving()) list.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 }); } else paintAll();
      upd(); st.textContent = 'Started again. The order is waiting for payment.'; return; }
    cur++;
    if (c.feed) { if (cur < n) addTop(cur); paintAll(); upd(true); return; }
    if (c.seq && moving()) { paint(cur - 1); upd(true); tm.push(setTimeout(function () { paintAll(); }, 430)); }
    else { paintAll(); upd(true); }
  }
  nextB.addEventListener('click', next);
  if (failB) failB.addEventListener('click', function () { if (cur >= n) return; failed = !failed; paint(cur); upd(true); if (!failed) st.textContent = 'Trying again. ' + E[cur].t + ': ' + (E[cur].r || E[cur].s); });
  function toggle(li) {
    var d = $('.tk-d', li), b = $('.tk-hd', li), open = d.hidden || !!d._closing;
    b.setAttribute('aria-expanded', String(open));
    var h0 = d.hidden ? 0 : d.offsetHeight; if (d._a) { d._a.cancel(); d._a = null; } d._closing = false;
    if (!moving()) { d.hidden = !open; return; }
    d.hidden = false; var h1 = open ? d.scrollHeight : 0, sp = c.fade ? { e: 'cubic-bezier(.22,1,.36,1)', d: 260 } : TLsp('snappy');
    d._a = d.animate([{ height: h0 + 'px', opacity: open ? 0 : 1 }, { height: h1 + 'px', opacity: open ? 1 : 0 }], { duration: open ? Math.max(260, sp.d) : 220, easing: open ? sp.e : 'cubic-bezier(.22,1,.36,1)' });
    d._closing = !open;
    d._a.onfinish = function () { d._a = null; if (d._closing) { d.hidden = true; d._closing = false; } };
  }
  list.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('.tk-hd'); if (b) toggle(b.closest('.tk-r')); });
  list.addEventListener('keydown', function (e) {
    var b = e.target.closest && e.target.closest('.tk-hd'); if (!b) return; var hs = $$('.tk-hd', list), i = hs.indexOf(b);
    var j = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: hs.length - 1 }[e.key]; if (j == null) return; e.preventDefault(); hs[Math.max(0, Math.min(hs.length - 1, j))].focus();
  });
  if (lim < 0) {
    L.forEach(function (li) { li.style.opacity = '0'; });
    TLonView(el, function () {
      L.forEach(function (li, i) { tm.push(setTimeout(function () {
        lim = i; li.style.opacity = ''; li.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' });
        paintAll(); if (i === n - 1) lim = 99;
      }, i * 170)); });
      done.set(cur, { dir: 'up' });
    });
  } else done.set(cur, { instant: true });
};`;

const tkHtml = '<div class="tk" data-tk></div>';
const timeline = {
  id: 'timeline', n: '34', name: 'Timeline', h: 470,
  claim: 'An order should show <em>how far it has got.</em>',
  lead: 'One Duka Fresh order, from placed to delivered. Done steps are orange with a tick, and the line fills orange as the order moves on. Press Next update to move it along. Press a step to read more.',
  ref: { ids: 'c24', text: 'Our timeline (part 24): done steps are filled orange circles on an orange line, the running step pulses a ring, failed is darker orange with a ✕, and cards open with a fade.', url: SHOW + '#c24', label: 'Open part 24' },
  noteHint: 'B, with D’s line on top', moreHint: 'the same for a money transfer',
  css: tkCss, js: tkJs,
  opts: [
    {
      k: 'B', name: 'Steps arrive in turn, the line follows', kind: 'Lively, after Arc',
      line: 'When you scroll to it, the steps rise in one by one. Each tick pops and draws, and the orange line runs down to the next. Next update ticks the step, fills the line, then rings the next one.',
      from: [arc('timeline'), house('c24'), skill('animate')], tryit: 'Press Next update twice, then open a step.',
      needs: 'A small script and TLroll.', keys: 'Tab to a step; Enter or Space opens it. Up and Down move between steps.', off: 'Every step shows at once. Ticks and lines are already there.', law: 'Jakob: reads like a parcel tracker.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: tkHtml, top: true, js: String.raw`TL4time(box, { arrive: true, seq: true });`,
    },
    {
      k: 'A', name: 'Our part 24, for an order', kind: 'Plain',
      line: 'Every step is there from the start. A step opens with a short fade. Next update moves the state on at once, with the line filling on our smooth curve.',
      from: [house('c24'), arc('timeline')], tryit: 'Open Packed, then press Next update.',
      needs: 'A small script and TLroll.', keys: 'Same keys as B.', off: 'Steps open and change at once.', law: 'Jakob: the kit’s timeline today.',
      tags: ['motion:some', 'speed:quick', 'density:mid', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: tkHtml, top: true, js: String.raw`TL4time(box, { fade: true });`,
    },
    {
      k: 'C', name: 'Newest first, news slides in on top', kind: 'Mix',
      line: 'Arc’s feed: the latest step is at the top. Each update slides in from above, the rows below glide down to make room, and its orange line draws down to the step before.',
      from: [arc('timeline'), house('c24'), house('n22')], tryit: 'Press Next update and watch the new row push in.',
      needs: 'A small script and TLroll.', keys: 'Same keys as B.', off: 'New rows appear at once.', law: 'Jakob: like a chat or a feed, news on top.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: tkHtml, top: true, h: 430, js: String.raw`TL4time(box, { feed: true });`,
    },
    {
      k: 'D', name: 'A parcel line on top, the steps below', kind: 'Reference, pushed',
      line: 'Our parcel line sits on top: one orange line with a dot riding its front, and the minutes left rolling. Report a problem turns the step darker orange with a ✕, the way part 24 shows a failed deploy.',
      from: [house('c24'), arc('timeline'), ['DESIGN.md: the progress line', null]], tryit: 'Press Report a problem, then Try again, then Next update.',
      needs: 'A small script and TLroll.', keys: 'Same keys as B. Both buttons are normal buttons.', off: 'The line and the dot jump to the step.', law: 'Proximity: the time left sits next to the line it explains.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:loud', 'open:inplace', 'new:novel', 'look:ember'],
      html: tkHtml, top: true, h: 560, js: String.raw`TL4time(box, { parcel: true, arrive: true, seq: true });`,
    },
  ],
};

/* ================= 35 Empty states ================= */
const esCss = String.raw`
#empty .es { width: min(100%, 400px); display: grid; gap: 14px; justify-items: center; text-align: center; }
#empty .es .me-sw { min-width: 0; justify-self: center; }
#empty .es-art { display: block; width: 160px; height: 112px; overflow: visible; }
#empty .es-art rect { fill: var(--paper-raised); stroke: var(--ink-soft); stroke-width: 1.6; }
#empty .es-art rect[data-s="3"] { fill: var(--line-hi); stroke: none; }
#empty .es-art rect[data-s="4"] { fill: var(--accent); stroke: none; }
#empty .es-tk { fill: none; stroke: var(--on-accent); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 24; stroke-dashoffset: 24; opacity: 0; transition: stroke-dashoffset .4s var(--ease-out), opacity .15s; }
#empty .es-art.is-k .es-tk { stroke-dashoffset: 0; opacity: 1; transition: stroke-dashoffset .45s var(--ease-out) .42s, opacity .15s .38s; }
#empty .es-ic { width: 64px; height: 64px; display: grid; place-items: center; border-radius: 16px; background: var(--paper-sunk); color: var(--ink-soft); }
#empty .es-ic svg { width: 28px; height: 28px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
#empty .es-ic .ac { stroke: var(--accent); }
#empty .es-t { margin: 0; font: 500 19px/1.25 var(--font-display); color: var(--ink); max-width: 100%; }
#empty .es-t.tll { display: grid; }
#empty .es-p { margin: -6px 0 0; max-width: 34ch; min-height: 2.9em; font-size: 14px; line-height: 1.45; color: var(--muted); }
#empty .es-ok { margin: -4px 0 0; min-height: 22px; display: flex; align-items: center; justify-content: center; gap: 7px; font-size: 13px; color: var(--ink-soft); }
#empty .es-ok .l-tick { width: 18px; height: 18px; flex: 0 0 18px; }
#empty .es-b .l-spin { width: 14px; height: 14px; }
#empty .es-b[aria-busy="true"] { pointer-events: none; }
#empty .es-c, #empty .es-d { width: min(100%, 420px); display: grid; gap: 12px; }
#empty .es-bar { display: flex; gap: 8px; }
#empty .es-bar .l-in { flex: 1; min-width: 0; }
#empty .es-body { position: relative; overflow: hidden; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); box-shadow: var(--shadow-sm); }
#empty .tl4-pane { padding: 6px 14px; }
#empty .es-row { display: flex; align-items: center; gap: 12px; min-height: 58px; border-top: 1px solid var(--line); text-align: left; }
#empty .es-row:first-child { border-top: 0; }
#empty .es-row > span:nth-child(2) { flex: 1; min-width: 0; display: grid; }
#empty .es-row b { font-size: 14.5px; font-weight: 600; color: var(--ink); }
#empty .es-row small { font-size: 13px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#empty .es-row .l-num { font-size: 17px; color: var(--ink); }
#empty .es-in { display: grid; gap: 10px; justify-items: center; text-align: center; padding: 18px 4px 16px; }
#empty .es-in .es-art { width: 128px; height: 90px; }
#empty .es-in .es-p { min-height: 0; margin: -4px 0 0; }
#empty .es-cf { display: flex; justify-content: space-between; align-items: center; gap: 10px; font-size: 13px; color: var(--muted); }
#empty .es-cf b { font: 400 17px/1 var(--font-num); color: var(--ink); }
#empty .es-dh { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
#empty .es-dh b { font-size: 15px; color: var(--ink); }
#empty .es-dh > div { display: flex; gap: 6px; }
#empty .es-sk { display: flex; align-items: center; gap: 12px; min-height: 58px; border-top: 1px solid var(--line); }
#empty .es-sk:first-child { border-top: 0; }
#empty .es-sk i { position: relative; display: block; height: 12px; border-radius: 6px; background: rgb(var(--ink-rgb) / .08); overflow: hidden; }
#empty .es-sk i.av { width: 36px; height: 36px; border-radius: 50%; flex: none; }
#empty .es-sk i::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgb(var(--ink-rgb) / .08), transparent); transform: translateX(-100%); animation: es-sweep 1.2s ease-in-out infinite; }
@keyframes es-sweep { to { transform: translateX(100%); } }
html[data-motion="off"] #empty .es-sk i::after { animation: none !important; opacity: 0; }
#empty .es-d .es-art rect { stroke-dasharray: 1; stroke-dashoffset: 0; }
#empty .es-d .es-art.is-draw rect:not([data-s="4"]) { animation: es-draw .8s var(--ease-out) both; }
#empty .es-d .es-art.is-draw rect[data-s="1"] { animation-delay: .12s; }
#empty .es-d .es-art.is-draw rect[data-s="2"] { animation-delay: .24s; }
#empty .es-d .es-art.is-draw rect[data-s="3"] { animation-delay: .3s; }
#empty .es-d .es-art.is-draw rect[data-s="4"] { transform-box: fill-box; transform-origin: center; animation: l-popin .35s var(--ease-out) .75s both; }
@keyframes es-draw { from { stroke-dashoffset: 1; fill-opacity: 0; } 60% { fill-opacity: 0; } to { stroke-dashoffset: 0; fill-opacity: 1; } }`;

const esJs = String.raw`
window.TL4empty = function (box, c) {
  c = c || {};
  var SC = [
    { k: 'Orders', t: 'No orders yet', p: 'When someone buys from your shop, the order shows up here.', b: 'Share your shop link', ok: 'Link copied: dukafresh.example.com' },
    { k: 'Search', t: 'Nothing matches “sukuma wiki”', p: 'Check the spelling, or look in every shop, not only this one.', b: 'Search every shop', busy: 'Searching…', ok: 'Found it in 3 shops near you.' },
    { k: 'Inbox', t: 'You are all caught up', p: 'Every customer message has an answer. New ones will show up here.', b: 'See answered messages', ok: 'Showing 24 answered messages.' },
    { k: 'Offline', t: 'You are offline', p: 'Your orders are safe on this phone. They send when you are back online.', b: 'Try again', busy: 'Checking…', ok: 'Back online. 3 orders sent.' },
  ];
  var SH = [
    [[24, 38, 54, 14, 5, -9, 1], [82, 38, 54, 14, 5, 9, 1], [30, 50, 100, 46, 9, 0, 1], [18, 101, 124, 3, 1.5, 0, 1], [111, 14, 16, 16, 8, 0, 1]],
    [[20, 34, 86, 60, 9, 0, 1], [104, 74, 30, 10, 5, 42, 1], [72, 30, 46, 46, 23, 0, 1], [18, 101, 124, 3, 1.5, 0, 1], [90, 48, 10, 10, 5, 0, 1]],
    [[54, 30, 52, 26, 5, -6, 0], [46, 50, 68, 12, 6, 0, 1], [28, 58, 104, 38, 10, 0, 1], [18, 101, 124, 3, 1.5, 0, 1], [100, 12, 32, 32, 16, 0, 1]],
    [[44, 34, 40, 40, 20, 0, 1], [74, 42, 36, 36, 18, 0, 1], [30, 56, 104, 36, 18, 0, 1], [18, 101, 124, 3, 1.5, 0, 1], [36, 68, 92, 6, 3, -28, 1]],
  ];
  var IC = [
    '<path d="M4 9.5 7 4h14l3 5.5M4 9.5V22a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9.5M4 9.5h20M11 14h6"/>',
    '<circle cx="12.5" cy="12.5" r="7"/><path d="M17.5 17.5 24 24"/><path class="ac" d="M10 12.5h5"/>',
    '<path d="M4 15h6l2 3h4l2-3h6M4 15l3-9h14l3 9v7H4z"/><path class="ac" d="m10.5 9.5 2.2 2.2 4.3-4.4"/>',
    '<path d="M4 11a14 14 0 0 1 20 0M8 15a8.5 8.5 0 0 1 12 0M12 19a3 3 0 0 1 4 0"/><path class="ac" d="M5 5l18 18"/>',
  ];
  function art(k, cls) { return '<svg class="es-art' + (cls ? ' ' + cls : '') + (k === 2 ? ' is-k' : '') + '" viewBox="0 0 160 112" aria-hidden="true">' + SH[k].map(function (s, i) { return '<rect data-s="' + i + '" pathLength="1" x="' + s[0] + '" y="' + s[1] + '" width="' + s[2] + '" height="' + s[3] + '" rx="' + s[4] + '" transform="rotate(' + s[5] + ' ' + (s[0] + s[2] / 2) + ' ' + (s[1] + s[3] / 2) + ')" opacity="' + s[6] + '"/>'; }).join('') + '<path class="es-tk" d="M108.5 28.5l5 5 9.5-10.5"/></svg>'; }
  function flat(k) { var a = []; SH[k].forEach(function (s) { a.push.apply(a, s); }); return a; }
  var el = $('[data-es]', box);
  function action(b, k, ok, after) {
    var s = SC[k]; if (b.getAttribute('aria-busy') === 'true') return;
    function fin(msg) { b.removeAttribute('aria-busy'); b.textContent = s.b; ok.innerHTML = TICK + '<span></span>'; ok.lastChild.textContent = msg || s.ok; if (after) after(); }
    if (k === 0) { var p; try { p = navigator.clipboard.writeText('https://dukafresh.example.com'); } catch (x) { p = Promise.reject(x); } p.then(function () { fin(); }, function () { fin('Your link: dukafresh.example.com'); }); return; }
    if (!s.busy) { fin(); return; }
    b.setAttribute('aria-busy', 'true'); b.innerHTML = '<span class="l-spin" aria-hidden="true"></span>' + s.busy; ok.textContent = '';
    setTimeout(fin, moving() ? 1100 : 300);
  }
  /* B and A: one scene at a time, picked by tabs */
  if (c.mode === 'morph' || c.mode === 'plain') {
    var morph = c.mode === 'morph';
    el.innerHTML = '<div class="me-sw" role="radiogroup" aria-label="Pick an empty state"></div><div data-pic role="img" aria-label="' + SC[0].t + '">' + (morph ? art(0) : '<span class="es-ic"><svg viewBox="0 0 28 28" aria-hidden="true">' + IC[0] + '</svg></span>') + '</div>'
      + '<p class="es-t" data-t>' + SC[0].t + '</p><p class="es-p" data-p>' + SC[0].p + '</p><button class="l-btn pri es-b" type="button" data-b>' + SC[0].b + '</button><p class="es-ok" data-ok aria-live="polite"></p>';
    var pic = $('[data-pic]', el), tEl = $('[data-t]', el), pEl = $('[data-p]', el), bEl = $('[data-b]', el), okEl = $('[data-ok]', el), k0 = 0;
    var tl = morph ? TLline(tEl) : null, svg = $('svg', pic), rects = morph ? $$('rect', svg) : [];
    var vec = morph ? TLvec(flat(0), function (x) { rects.forEach(function (r, i) { var b = i * 7, w = Math.max(0, x[b + 2]), h = Math.max(0, x[b + 3]);
      r.setAttribute('x', x[b].toFixed(2)); r.setAttribute('y', x[b + 1].toFixed(2)); r.setAttribute('width', w.toFixed(2)); r.setAttribute('height', h.toFixed(2)); r.setAttribute('rx', Math.max(0, Math.min(x[b + 4], w / 2, h / 2)).toFixed(2));
      r.setAttribute('transform', 'rotate(' + x[b + 5].toFixed(2) + ' ' + (x[b] + w / 2).toFixed(2) + ' ' + (x[b + 1] + h / 2).toFixed(2) + ')'); r.setAttribute('opacity', Math.max(0, Math.min(1, x[b + 6])).toFixed(3)); }); }, { dur: 720, zeta: .78, eps: .02 }) : null;
    function fade(e, fn) { if (!moving()) { fn(); return; } e.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 110, easing: 'ease-in' }).onfinish = function () { fn(); e.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'cubic-bezier(.22,1,.36,1)' }); }; }
    TLseg($('.me-sw', el), SC.map(function (s) { return s.k; }), function (k) {
      var dir = k > k0 ? 1 : -1; k0 = k; var s = SC[k];
      pic.setAttribute('aria-label', s.t); okEl.textContent = ''; bEl.removeAttribute('aria-busy');
      if (morph) { tl.set(s.t, dir); svg.classList.toggle('is-k', k === 2); vec.to(flat(k), { delay: function (i) { return Math.floor(i / 7) * 45; } }); }
      else { fade(pic, function () { $('svg', pic).innerHTML = IC[k]; }); fade(tEl, function () { tEl.textContent = s.t; }); }
      fade(pEl, function () { pEl.textContent = s.p; }); fade(bEl, function () { bEl.textContent = s.b; });
    }, { cls: 'me' });
    bEl.addEventListener('click', function () { action(bEl, k0, okEl); });
    return;
  }
  var O = [['WK', 'Wanjiku Kamau', 'Sukuma wiki, eggs, milk', 2450], ['BO', 'Brian Ochieng', 'Maize flour, sugar', 1180], ['AH', 'Amina Hassan', 'Tomatoes, onions', 640]];
  function rowsHtml(list) { return list.map(function (o) { return '<div class="es-row"><span class="l-av" aria-hidden="true">' + o[0] + '</span><span><b>' + o[1] + '</b><small>' + o[2] + '</small></span><span class="l-num">' + TLkes(o[3]) + '</span></div>'; }).join(''); }
  function skel() { return [0, 1, 2].map(function (i) { return '<div class="es-sk" aria-hidden="true"><i class="av"></i><span style="flex:1;display:grid;gap:7px"><i style="width:' + [52, 40, 46][i] + '%"></i><i style="width:' + [70, 58, 64][i] + '%;height:10px"></i></span><i style="width:54px"></i></div>'; }).join(''); }
  function empty(k, btn) { var s = SC[k]; return '<div class="es-in">' + art(k, c.mode === 'load' ? 'is-draw' : '') + '<p class="es-t" data-t></p><p class="es-p">' + s.p + '</p><button class="l-btn pri es-b" type="button" data-b>' + (btn || s.b) + '</button><p class="es-ok" data-ok aria-live="polite"></p></div>'; }
  function setT(pane, t) { var e = $('[data-t]', pane); if (e) e.textContent = t; }
  /* C: the empty states come from real actions on a list */
  if (c.mode === 'live') {
    el.innerHTML = '<div class="es-c"><div class="es-bar"><input class="l-in" type="search" placeholder="Search open orders" aria-label="Search open orders" data-q><button class="l-btn" type="button" data-off aria-pressed="false">Go offline</button></div><div class="es-body" data-body></div><div class="es-cf"><span><b data-cnt></b> open orders</span><button class="l-btn sm" type="button" data-all>Mark all done</button></div><p class="sr" aria-live="polite" data-say></p></div>';
    var body = $('[data-body]', el), q = $('[data-q]', el), off = $('[data-off]', el), allB = $('[data-all]', el), say = $('[data-say]', el), open = true, offline = false, shown = '', tmr = 0;
    var cnt = TLroll($('[data-cnt]', el), { value: 3, fmt: String, dur: 460, live: false });
    function render() {
      var term = q.value.trim().toLowerCase(), list = open ? O.filter(function (o) { return !term || (o[1] + ' ' + o[2]).toLowerCase().indexOf(term) >= 0; }) : [];
      var key = offline ? 'off' : !open ? 'done' : list.length ? 'list' : 'none', pane;
      cnt.set(offline || !open ? 0 : list.length); allB.disabled = !open || offline; q.disabled = offline;
      if (key === 'list' && shown === 'list') { body.firstElementChild.innerHTML = rowsHtml(list); return; }
      if (key === shown && key !== 'none') return;
      shown = key;
      if (key === 'list') { TL4swap(body, rowsHtml(list)); say.textContent = list.length + ' open orders.'; return; }
      var k = key === 'off' ? 3 : key === 'done' ? 2 : 1;
      pane = TL4swap(body, empty(k, k === 1 ? 'Clear the search' : k === 2 ? 'Show done orders' : null));
      var t = k === 1 ? 'No open order matches “' + q.value.trim() + '”' : SC[k].t; setT(pane, t); say.textContent = t + '.';
      var b = $('[data-b]', pane), ok = $('[data-ok]', pane);
      b.addEventListener('click', function () {
        if (k === 1) { q.value = ''; render(); q.focus(); return; }
        if (k === 2) { open = true; render(); allB.focus(); return; }
        action(b, 3, ok, function () { setTimeout(function () { offline = false; off.setAttribute('aria-pressed', 'false'); off.textContent = 'Go offline'; shown = 'load'; TL4swap(body, skel()); setTimeout(render, moving() ? 700 : 0); }, moving() ? 700 : 0); });
      });
    }
    q.addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(render, 160); });
    q.addEventListener('keydown', function (e) { if (e.key === 'Escape' && q.value) { e.stopPropagation(); q.value = ''; render(); } });
    allB.addEventListener('click', function () { open = false; render(); });
    off.addEventListener('click', function () { offline = !offline; off.setAttribute('aria-pressed', String(offline)); off.textContent = offline ? 'Go online' : 'Go offline'; render(); });
    render(); return;
  }
  /* D: n38's card. Reload shows the sweep, then rows or the empty state, which draws itself in */
  el.innerHTML = '<div class="es-d"><div class="es-dh"><b>Recent orders</b><div><button class="l-btn sm" type="button" data-re>Reload</button><button class="l-btn sm ghost" type="button" data-em aria-pressed="false">Show empty</button></div></div><div class="es-body" data-body aria-busy="false"></div></div>';
  var bd = $('[data-body]', el), re = $('[data-re]', el), em = $('[data-em]', el), isEmpty = false, tk = 0;
  function load() {
    clearTimeout(tk); bd.setAttribute('aria-busy', 'true'); TL4swap(bd, skel());
    tk = setTimeout(function () {
      bd.setAttribute('aria-busy', 'false');
      if (!isEmpty) { var p = TL4swap(bd, rowsHtml(O)); if (moving()) $$('.es-row', p).forEach(function (r, i) { r.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: 90 + i * 60, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }); }); return; }
      var pane = TL4swap(bd, empty(0)); setT(pane, SC[0].t); var b = $('[data-b]', pane), ok = $('[data-ok]', pane);
      b.addEventListener('click', function () { action(b, 0, ok); });
    }, moving() ? 900 : 0);
  }
  re.addEventListener('click', load);
  em.addEventListener('click', function () { isEmpty = !isEmpty; em.setAttribute('aria-pressed', String(isEmpty)); em.textContent = isEmpty ? 'Show orders' : 'Show empty'; load(); });
  TL4swap(bd, rowsHtml(O));
};`;

const esHtml = '<div class="es" data-es></div>';
const empty = {
  id: 'empty', n: '35', name: 'Empty states', h: 400,
  claim: 'An empty screen should say <em>what to do next.</em>',
  lead: 'Four times a screen has nothing to show: no orders yet, a search with no results, nothing left to answer, and no internet. Each one says why, moves a little, and offers one clear button.',
  ref: { ids: 'n38', text: 'Round 1 you picked the skeleton sweep (n38): grey blocks sweep while loading, then real content rises in. Its Show empty is one plain line.', url: SHOW + '#n38', label: 'Open n38' },
  noteHint: 'B’s drawings in C’s list', moreHint: 'a first-run screen for a new shop',
  css: esCss, js: esJs,
  opts: [
    {
      k: 'B', name: 'One drawing that changes shape', kind: 'Lively, after Arc',
      line: 'The same five shapes make every drawing. Switch and they spring into the new one: the box turns into a magnifier, a tray, then a cloud. The heading rolls in, and the button does its job.',
      from: [arc('blocks/empty-states', 'Arc empty states'), arc('empty-state'), skill('animate')], tryit: 'Click through all four, then press the button on Offline.',
      needs: 'TLvec, TLline and an inline drawing.', keys: 'Arrow keys move between the four. Tab to the button.', off: 'The drawing and words swap at once.', law: 'Hick: one button, so there is nothing to choose.',
      tags: ['motion:springy', 'speed:mid', 'density:roomy', 'feedback:clear', 'open:inplace', 'new:novel', 'look:ember'],
      html: esHtml, top: true, js: String.raw`TL4empty(box, { mode: 'morph' });`,
    },
    {
      k: 'A', name: 'An icon, a line and a button', kind: 'Plain',
      line: 'The usual empty state. A small icon in a soft square, a heading, one line and one button. Switching fades the words and icon.',
      from: [arc('empty-state'), ['shadcn/ui empty', 'https://ui.shadcn.com/docs/components/empty']], tryit: 'Switch between the four, then press a button.',
      needs: 'A few lines of script.', keys: 'Arrow keys move between the four.', off: 'Everything swaps at once.', law: 'Jakob: looks like most apps.',
      tags: ['motion:some', 'speed:quick', 'density:mid', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: esHtml, top: true, h: 340, js: String.raw`TL4empty(box, { mode: 'plain' });`,
    },
    {
      k: 'C', name: 'Empty states you reach for real', kind: 'Mix',
      line: 'A real list of open orders. Search for something that is not there, mark them all done, or go offline, and the right empty state glides in. Its button puts things back.',
      from: [arc('blocks/empty-states', 'Arc empty states'), house('n38'), house('n22')], tryit: 'Type “pizza”, then Clear the search. Then Go offline and Try again.',
      needs: 'TLroll and a small script.', keys: 'Normal field and button keys. Escape clears the search.', off: 'States swap at once. The sweep does not move.', law: 'Proximity: the fix sits right where the list was.',
      tags: ['motion:some', 'speed:mid', 'density:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: esHtml, top: true, h: 400, js: String.raw`TL4empty(box, { mode: 'live' });`,
    },
    {
      k: 'D', name: 'Our sweep, then a drawing that draws itself', kind: 'Reference, pushed',
      line: 'Our n38 card. Reload sweeps grey blocks, then the rows rise in. With Show empty, the blocks fade where they stand while the box draws in line by line, and its orange dot pops in last.',
      from: [house('n38'), arc('blocks/empty-states', 'Arc empty states'), ['DESIGN.md: diagrams build in', null]], tryit: 'Press Show empty, then Show orders.',
      needs: 'A small script and CSS drawing.', keys: 'Normal button keys.', off: 'No sweep. The drawing shows at once.', law: 'Jakob: loading looks like the kit’s loading.',
      tags: ['motion:some', 'speed:slow', 'density:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: esHtml, top: true, h: 400, js: String.raw`TL4empty(box, { mode: 'load' });`,
    },
  ],
};

/* ================= 36 Stats band ================= */
const svCss = String.raw`
#statsband .sv { width: 100%; display: grid; gap: 16px; }
#statsband .sv-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px 16px; }
#statsband .sv-h { margin: 0; font: 500 11px/1.4 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
#statsband .me-sw { min-width: 0; }
#statsband .sv-band { position: relative; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
#statsband .is-plain .sv-band { gap: 14px; }
#statsband .sv-s { position: relative; min-width: 0; display: grid; align-content: start; gap: 7px; padding: 18px 20px; border-radius: 12px; outline: none; text-align: left; }
#statsband .is-plain .sv-s { padding: 4px 2px; }
#statsband .sv-s:focus-visible { box-shadow: inset 0 0 0 2px var(--accent); }
#statsband .sv-l { margin: 0; font: 500 10.5px/1.3 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
#statsband .sv-v { margin: 0; font: 400 clamp(28px, 3.7cqi, 44px)/1.05 var(--font-num); color: var(--ink); white-space: nowrap; }
#statsband .sv-v .tlr-a { font: 500 .42em/1 var(--font-mono); color: var(--muted); letter-spacing: .04em; }
#statsband .sv-m { margin: 0; display: flex; }
#statsband .sv-x { margin: 0; min-height: 2.8em; font-size: 12.5px; line-height: 1.4; color: var(--muted); }
#statsband .sv-x.tll { display: grid; grid-template-columns: minmax(0, 1fr); }
#statsband .sv-x.tll > span { white-space: normal; }
#statsband .sv-vis { display: block; width: 100%; height: 30px; overflow: visible; clip-path: inset(-4px 100% -4px 0); transition: clip-path 1s var(--ease-out) calc(var(--j) * 90ms + .5s); }
#statsband .is-in .sv-vis { clip-path: inset(-4px -4px -4px 0); }
#statsband .sv-vis path { fill: none; stroke: var(--ink-soft); stroke-width: 1.8; stroke-linecap: round; transition: stroke .2s; }
#statsband .sv.has-on .sv-s:not(.is-on) .sv-vis path { stroke: var(--dim); }
#statsband .sv-s.is-on .sv-vis path { stroke: var(--accent); }
#statsband .is-div .sv-s + .sv-s::before { content: ""; position: absolute; left: 0; top: 16px; bottom: 16px; width: 1px; background: var(--line-hi); transform: scaleY(0); transform-origin: top; transition: transform .8s var(--ease-out) calc(var(--j) * 90ms + .3s); }
#statsband .is-div.is-in .sv-s::before { transform: none; }
#statsband .sv-ru { position: absolute; left: 0; right: 0; height: 1px; background: var(--line-hi); transform: scaleX(0); transform-origin: left; transition: transform 1.1s var(--ease-out); }
#statsband .sv-ru.t { top: 0; }
#statsband .sv-ru.b { bottom: 0; transition-delay: .12s; }
#statsband .is-in .sv-ru { transform: none; }
#statsband .sv-g { display: grid; gap: 5px; margin-top: 2px; }
#statsband .sv-gb { position: relative; height: 6px; border-radius: 3px; background: rgb(var(--ink-rgb) / .08); overflow: hidden; }
#statsband .sv-gb i { position: absolute; inset: 0; border-radius: inherit; background: var(--accent); transform-origin: left; transform: scaleX(var(--g, 0)); transition: transform var(--sp-soft-d) var(--sp-soft); }
#statsband .sv-gt { font-size: 12px; color: var(--muted); }
#statsband .sv-gt .tlr { color: var(--ink-soft); font-weight: 600; }
#statsband .sv-gt .tlr-c { -webkit-mask-image: none; mask-image: none; }
#statsband .is-card .sv-in { border-radius: 14px; border: 1px solid var(--line); background: var(--paper-raised); box-shadow: var(--shadow-sm); overflow: hidden; }
#statsband .is-card .sv-s { cursor: pointer; border-radius: 0; transition: background-color .15s; }
#statsband .is-card .sv-s:hover { background: rgb(var(--ink-rgb) / .03); }
#statsband .is-card .sv-s::after { content: ""; position: absolute; left: 20px; right: 20px; bottom: 0; height: 2px; border-radius: 1px; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#statsband .is-card .sv-s[aria-checked="true"]::after { transform: none; }
#statsband .is-card .sv-s[aria-checked="true"] .sv-l { color: var(--accent-text); }
#statsband .is-card .sv-band { border-bottom: 1px solid var(--line); }
#statsband .is-card .sv-s + .sv-s { box-shadow: inset 1px 0 0 var(--line); }
#statsband .is-card .sv-s:focus-visible { box-shadow: inset 0 0 0 2px var(--accent); }
#statsband .sv-ch { padding: 14px 20px 16px; display: grid; gap: 6px; }
#statsband .sv-cl { margin: 0; font-size: 13px; color: var(--muted); }
#statsband .sv-cl.tll { display: grid; }
#statsband .sv-big { display: block; width: 100%; height: 96px; overflow: visible; }
#statsband .sv-big .ln { fill: none; stroke: var(--accent); stroke-width: 2; stroke-linecap: round; }
#statsband .sv-big .ar { fill: rgb(var(--accent-rgb) / .1); }
#statsband .sv-big .gd { stroke: var(--line); stroke-width: 1; }
@container (max-width: 640px) {
  #statsband .sv-band { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  #statsband .sv-v { font-size: min(34px, 9.4cqi); }
  #statsband .sv-s { padding: 14px 12px; }
  #statsband .is-div .sv-s:nth-of-type(2n+1)::before { display: none; }
  #statsband .is-div .sv-s:nth-of-type(n+3)::after { content: ""; position: absolute; left: 12px; right: 12px; top: 0; height: 1px; background: var(--line-hi); transform: scaleX(0); transform-origin: left; transition: transform .9s var(--ease-out) .35s; }
  #statsband .is-div.is-in .sv-s:nth-of-type(n+3)::after { transform: none; }
  #statsband .is-card .sv-s:nth-of-type(3) { box-shadow: inset 0 1px 0 var(--line); }
  #statsband .is-card .sv-s:nth-of-type(4) { box-shadow: inset 1px 0 0 var(--line), inset 0 1px 0 var(--line); }
  #statsband .is-card .sv-s::after { left: 12px; right: 12px; }
  #statsband .sv-ch { padding: 12px; }
}`;

const svJs = String.raw`
window.TL4band = function (box, c) {
  c = c || {};
  var RAW = [['Today', 'yesterday', [18450, 64, 51], [12.4, 8.5, 5.2], [20000, 70, 60, 300]], ['7 days', 'the 7 days before', [112300, 402, 288], [-3.2, 1.8, -1.4], [125000, 420, 300, 300]], ['30 days', 'the 30 days before', [486900, 1712, 1046], [9.1, 6.0, 11.3], [500000, 1800, 1100, 300]]];
  var P = RAW.map(function (p) {
    var s = p[2][0], o = p[2][1], ps = s / (1 + p[3][0] / 100), po = o / (1 + p[3][1] / 100), b = s / o, pb = ps / po, pc = p[2][2] / (1 + p[3][2] / 100);
    return { n: p[0], w: p[1], k: [{ v: s, c: p[3][0], d: s - ps }, { v: o, c: p[3][1], d: o - po }, { v: p[2][2], c: p[3][2], d: p[2][2] - pc }, { v: Math.round(b), c: (b / pb - 1) * 100, d: b - pb }], g: p[4] };
  });
  var K = ['Sales', 'Orders', 'Customers', 'Average basket'], INT = function (n) { return Math.round(n).toLocaleString('en-KE'); }, F = [TLkes, INT, INT, TLkes];
  var CX = [['Most of it came in after 5 pm.', 'Saturday was the best day.', 'Payday week sold the most.'], ['Busiest hour: 5 pm to 6 pm.', '61 orders came on Saturday alone.', 'One in five came from the shop link.'], ['12 bought for the first time.', '94 came back for more.', '312 came back for more.'], ['Most baskets had 4 to 6 items.', 'Baskets were bigger on the weekend.', 'Up from KES 262 in August.']];
  function detail(j, p) { var x = P[p].k[j], a = Math.abs(x.d); return (x.d >= 0 ? 'Up ' : 'Down ') + (j === 0 || j === 3 ? TLkes(a) : Math.round(a) + (j === 1 ? ' orders' : ' customers')) + ' on ' + P[p].w + '.'; }
  function ser(j, p, m) { var x = P[p].k[j].c, out = [], t, mn = 1e9, mx = -1e9; for (t = 0; t < m; t++) { var v = 1 + x / 100 * t / (m - 1) + .05 * Math.sin(t * 1.9 * 12 / m + j * 1.3 + p) + .012 * Math.sin(t * 4.1 * 12 / m + j); out.push(v); mn = Math.min(mn, v); mx = Math.max(mx, v); } return out.map(function (v) { return (v - mn) / (mx - mn || 1); }); }
  var lay = c.layout || 'div', card = lay === 'card', goal = !!c.goal, vis = !!c.vis, ctx = !!c.ctx;
  var el = $('[data-sv]', box), cellTag = card ? 'role="radio" tabindex="-1"' : (ctx ? 'tabindex="0"' : '');
  el.className = 'sv is-' + (lay === 'plain' ? 'plain' : card ? 'card' : 'div');
  el.innerHTML = '<div class="sv-top"><p class="sv-h">Duka Fresh · key numbers</p><div class="me-sw" role="radiogroup" aria-label="Period"></div></div>'
    + (card ? '<div class="sv-in">' : '') + '<div class="sv-band" role="' + (card ? 'radiogroup' : 'group') + '" aria-label="' + (card ? 'Pick a number to chart' : 'Key numbers') + '">'
    + K.map(function (l, j) { return '<div class="sv-s" data-j="' + j + '" style="--j:' + j + '" ' + cellTag + '><p class="sv-l">' + l + '</p><p class="sv-v" data-v></p><p class="sv-m"><span class="me-chip" data-chip>' + TLchipHtml + '</span></p>'
      + (goal ? '<div class="sv-g"><span class="sv-gb" aria-hidden="true"><i data-gb></i></span><span class="sv-gt"><span data-gp></span> of the goal</span></div>' : '')
      + '<p class="sv-x" data-x></p>' + (vis ? '<svg class="sv-vis" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path vector-effect="non-scaling-stroke"/></svg>' : '') + '</div>'; }).join('')
    + (lay === 'div' ? '<i class="sv-ru t" aria-hidden="true"></i><i class="sv-ru b" aria-hidden="true"></i>' : '') + '</div>'
    + (card ? '<div class="sv-ch"><p class="sv-cl" data-cl></p><svg class="sv-big" viewBox="0 0 300 96" preserveAspectRatio="none" aria-hidden="true"><path class="gd" d="M0 95.5H300" vector-effect="non-scaling-stroke"/><path class="ar"/><path class="ln" vector-effect="non-scaling-stroke"/></svg></div></div>' : '')
    + '<p class="sr" aria-live="polite" data-say></p>';
  var cells = $$('.sv-s', el), say = $('[data-say]', el), pi = 0, on = -1, sel = 0, seen = false;
  var S = cells.map(function (s, j) {
    var o = { s: s, j: j, chip: $('[data-chip]', s), xe: $('[data-x]', s) };
    o.v = TLroll($('[data-v]', s), { value: 0, fmt: F[j], dur: 700, live: false });
    o.p = TLroll($('[data-pct]', o.chip), { value: 0, fmt: TLpct, dur: 520, live: false });
    o.x = lay === 'plain' ? { set: function (t) { o.xe.textContent = t; } } : TLline(o.xe);
    if (goal) { o.gb = $('[data-gb]', s); o.gp = TLroll($('[data-gp]', s), { value: 0, fmt: function (n) { return Math.round(n) + '%'; }, dur: 560, live: false }); }
    if (vis) { var path = $('.sv-vis path', s); o.sv = TLvec(ser(j, 0, 12), function (y) { path.setAttribute('d', TLmono(y.map(function (v, i) { return [i / 11 * 100, 3 + (1 - v) * 24]; }))); }, { dur: 550, ease: true }); }
    return o;
  });
  function line(o, dir) { o.x.set(on === o.j && ctx ? CX[o.j][pi] : detail(o.j, pi), dir); }
  var big = null, cl = null;
  if (card) {
    var bp = $('.sv-big .ln', el), ba = $('.sv-big .ar', el); cl = TLline($('[data-cl]', el));
    big = TLvec(ser(0, 0, 24).map(function () { return .5; }), function (y) { var d = TLmono(y.map(function (v, i) { return [i / 23 * 300, 8 + (1 - v) * 80]; })); bp.setAttribute('d', d); ba.setAttribute('d', d + 'L300 96L0 96Z'); }, { dur: 550, ease: true });
  }
  function chart(j, dir) { if (!card) return; cl.set(K[j] + ' · ' + (pi === 0 ? 'today, hour by hour' : P[pi].n + ', day by day'), dir || 1); if (seen) big.to(ser(j, pi, 24)); }
  function goalSet(o, p) { var g = P[p].k[o.j].v / P[p].g[o.j] * 100; o.gp.set(g); o.gb.style.setProperty('--g', Math.min(1, g / 100).toFixed(3)); }
  function apply(p, first) {
    var prev = pi; pi = p;
    S.forEach(function (o) { var x = P[p].k[o.j], dir = x.v >= P[prev].k[o.j].v ? 1 : -1;
      if (seen) { o.v.set(x.v); o.p.set(Math.round(Math.abs(x.c) * 10) / 10); if (goal) goalSet(o, p); if (o.sv) o.sv.to(ser(o.j, p, 12)); }
      o.chip.setAttribute('data-dir', x.c >= 0 ? 'up' : 'down'); o.chip.setAttribute('title', (x.c >= 0 ? 'Up ' : 'Down ') + TLpct(x.c) + ' on ' + P[p].w);
      line(o, dir); });
    chart(card ? sel : 0, p > prev ? 1 : -1);
    if (!first) say.textContent = P[p].n + ': sales ' + TLkes(P[p].k[0].v) + ', ' + P[p].k[1].v + ' orders, ' + P[p].k[2].v + ' customers, ' + TLkes(P[p].k[3].v) + ' average basket.';
  }
  TLseg($('.me-sw', el), P.map(function (p) { return p.n; }), function (i) { apply(i); }, { cls: 'me' });
  apply(0, true);
  /* context on hover or focus (B, D) */
  function setOn(j) { if (j === on) return; var was = on; on = j; el.classList.toggle('has-on', j >= 0); S.forEach(function (o) { o.s.classList.toggle('is-on', o.j === j); if (o.j === j || o.j === was) line(o, o.j === j ? 1 : -1); }); }
  if (ctx) cells.forEach(function (s, j) {
    s.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') setOn(j); });
    s.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && document.activeElement !== s) setOn(-1); });
    s.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') setOn(on === j ? -1 : j); });
    s.addEventListener('focus', function () { setOn(j); }); s.addEventListener('blur', function () { setOn(-1); });
  });
  /* pick a number to chart (C) */
  if (card) {
    var pick = function (j, focus) { cells.forEach(function (s, i) { s.setAttribute('aria-checked', String(i === j)); s.tabIndex = i === j ? 0 : -1; }); if (focus) cells[j].focus(); if (j !== sel) { var d = j > sel ? 1 : -1; sel = j; chart(j, d); } };
    pick(0);
    cells.forEach(function (s, j) {
      s.setAttribute('aria-label', K[j]);
      s.addEventListener('click', function () { pick(j); });
      s.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); pick(j); return; } var k = { ArrowRight: j + 1, ArrowDown: j + 1, ArrowLeft: j - 1, ArrowUp: j - 1, Home: 0, End: 3 }[e.key]; if (k == null) return; e.preventDefault(); pick((k + 4) % 4, true); });
    });
  }
  TLonView(el, function () {
    seen = true; el.classList.add('is-in');
    S.forEach(function (o) { var x = P[pi].k[o.j];
      setTimeout(function () { o.v.set(x.v, { dir: 'up' }); o.p.set(Math.round(Math.abs(x.c) * 10) / 10); if (goal) goalSet(o, pi); }, moving() ? o.j * 90 : 0); });
    if (card) big.to(ser(sel, pi, 24));
  }, .5);
};`;

const svHtml = '<div class="sv" data-sv></div>';
const statsband = {
  id: 'statsband', n: '36', name: 'Stats band', h: 250,
  claim: 'Four numbers in a row should <em>read as one band.</em>',
  lead: 'Sales, orders, customers and the average basket for Duka Fresh. The numbers roll up when you scroll to them, and roll again when you switch the period. Each chip says which way it went.',
  ref: { ids: 'r3 05', text: 'Round 3, you kept three metric cards: B three tiles that roll together, C one card with three rows, and D the KES stat card whose line reshapes.', url: 'taste-lab-r3.html#metric', label: 'Open round 3' },
  noteHint: 'B’s band with D’s goals', moreHint: 'a band for a whole page head',
  css: svCss, js: svJs,
  opts: [
    {
      k: 'B', name: 'A ruled band with tiny lines', kind: 'Lively, after Arc',
      line: 'The rules draw across and the thin lines between grow in. Each number rolls up, 90 ms after the last. Then a tiny trend line wipes in. Point at a number: its line turns orange and the words under it tell you more.',
      from: [arc('blocks/stats-band', 'Arc stats band'), arc('metric-card'), house('n07')], tryit: 'Scroll it into view, point at Orders, then switch to 30 days.',
      needs: 'TLroll, TLline, TLvec and small SVG lines.', keys: 'Arrow keys move along the period switch. Tab reaches each number to read more.', off: 'Numbers, rules and lines show at once.', law: 'Proximity: one number, its change and its trend in one column.',
      tags: ['motion:springy', 'speed:mid', 'density:roomy', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: svHtml, wide: true, h: 260, js: String.raw`TL4band(box, { vis: true, ctx: true });`,
    },
    {
      k: 'A', name: 'Four numbers, nothing else', kind: 'Plain',
      line: 'Just the numbers, their chips and one line each, floating on the page. They roll up on arrival and when you switch the period. No rules, no trend lines.',
      from: [arc('blocks/stats-band', 'Arc stats band'), ['Round 3 metric card B', null]], tryit: 'Switch Today, 7 days, 30 days.',
      needs: 'TLroll.', keys: 'Arrow keys move along the period switch.', off: 'Numbers swap at once.', law: 'Jakob: like most dashboard heads.',
      tags: ['motion:some', 'speed:mid', 'density:mid', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: svHtml, wide: true, h: 220, js: String.raw`TL4band(box, { layout: 'plain' });`,
    },
    {
      k: 'C', name: 'Pick a number, the chart follows', kind: 'Mix',
      line: 'The band sits in one card, like round 3’s C. Pick a number and an orange bar springs under it. The one chart below reshapes to that number in 0.55 s, instead of drawing again.',
      from: [arc('blocks/stats-band', 'Arc stats band'), ['Round 3 metric card C and D', null], ['patterns/line-chart.md', null]], tryit: 'Pick Customers, then switch to 7 days.',
      needs: 'TLroll, TLline, TLvec and an SVG chart.', keys: 'Tab into the band. Arrows move between numbers, Space or Enter picks.', off: 'The chart and numbers swap at once.', law: 'Hick: four numbers, one chart, no tabs.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: svHtml, wide: true, h: 380, js: String.raw`TL4band(box, { layout: 'card' });`,
    },
    {
      k: 'D', name: 'The band with a goal under each number', kind: 'Reference, pushed',
      line: 'Our round 3 tiles, joined into one ruled band. Each number has an orange bar toward this period’s goal, and the percent rolls as it fills. Point at a number to read more.',
      from: [house('n06'), ['Round 3 metric card B', null], house('n47')], tryit: 'Switch to 7 days and watch the goal bars settle.',
      needs: 'TLroll, TLline and CSS bars on a spring.', keys: 'Arrow keys move along the period switch. Tab reaches each number.', off: 'Bars and numbers jump to their values.', law: 'Proximity: the goal sits under the number it measures.',
      tags: ['motion:springy', 'speed:mid', 'density:roomy', 'feedback:loud', 'open:inplace', 'new:novel', 'look:ember'],
      html: svHtml, wide: true, h: 280, js: String.raw`TL4band(box, { goal: true, ctx: true });`,
    },
  ],
};

export default [heatmap, reorder, timeline, empty, statsband];
