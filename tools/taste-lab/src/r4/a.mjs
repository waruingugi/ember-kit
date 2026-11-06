// Round 4, batch a: "more like this" on round 3 (donut, sparkline, countdown, sliders), then four round 3 fixes.
// Builds on src/r3/a.mjs and b.mjs: their helpers (TLroll, TLvec, TLline, TLmono, TLseg, TLb.*) load on the page.
// New shared helpers, set in each part's js: TL4donut, TL4spark, TL4dial (a digit wheel with its own
// number of faces, so the tens of seconds turn on 0 to 5), TL4cd (a countdown on those wheels), TL4elastic, TL4range.
import { arc, house } from '../src-links.mjs';
import r3b from '../r3/b.mjs';

const SHOW = '../../components/showcase/index.html';
// round 3 pieces the fixes reuse as they were, with only the fixed lines changed
const P3 = (id) => r3b.find((p) => p.id === id);
const O3 = (id, k) => P3(id).opts.find((o) => o.k === k);
const re = (s, a, b) => { if (!s.includes(a)) throw new Error(`r4/a: "${a}" not found, round 3 changed`); return s.split(a).join(b); };

/* ================= 01 Donut, more ================= */
const donutCss = String.raw`
#donut2 .stage, #spark2 .stage { height: auto; min-height: var(--h); container-type: inline-size; }
.dn-fig.is-half { border-radius: 12px; }
.dn-c.is-half { place-content: end center; padding: 0 22%; }
.dn-c.is-below { position: static; padding: 4px 0 0; }
.dn-row { position: relative; transition: background-color .15s, color .15s, opacity .2s var(--ease-out); }
.dn-row.is-fade { opacity: .42; }
.dn-bar { position: absolute; left: 27px; right: 8px; bottom: 3px; height: 2px; border-radius: 2px; background: rgb(var(--ink-rgb) / .07); overflow: hidden; }
.dn-bar i { position: absolute; inset: 0; transform-origin: left; transform: scaleX(0); transition: transform var(--sp-soft-d) var(--sp-soft); }
.dn-nd line { stroke: var(--ink); stroke-width: 2.4; stroke-linecap: round; }
.dn-nd circle { fill: var(--ink); }
.dn-nd .dn-hub { fill: var(--paper-raised); }
.dn-ends { display: flex; justify-content: space-between; margin: 2px 0 0; font: 500 10px/1.2 var(--font-mono); letter-spacing: .04em; color: var(--muted); }
.dn-s .sk-chip { vertical-align: middle; }
.dn .sk-chip[data-dir="flat"] svg { transform: rotate(90deg); }
.dn-s [data-cw] { margin-left: 4px; }`;

const donutJs = String.raw`
/* A donut or half ring. c: half, fade (other rows fade too), bars (a share line under each row), thick (px the
   active slice grows), compare (two arches: November over October), needle (a gauge needle), budget (KES). */
window.TL4donut = function (box, c) {
  c = c || {};
  var NM = ['Rent', 'Food', 'Transport', 'Fun', 'Airtime'], MON = [['October', [25000, 18400, 9600, 6100, 2300]], ['November', [25000, 15200, 12800, 9400, 3100]]];
  var N = 5, cmp = !!c.compare, ndl = !!c.needle, half = !!c.half, BUD = c.budget || 0, TK = c.thick || 0, mi = cmp ? 1 : 0;
  var CX = 100, CY = half ? 104 : 100, R = half ? (cmp ? 86 : 82) : 76, TH = half ? (cmp ? 16 : 20) : 22, R2 = 63, TH2 = 9;
  var A0 = half ? -Math.PI / 2 : 0, SPAN = half ? Math.PI : Math.PI * 2, PAD = .02, below = cmp || ndl, LN = R - TH / 2 - 9;
  function arcD(r, a, e) { function p(t) { return (CX + r * Math.sin(t)).toFixed(2) + ' ' + (CY - r * Math.cos(t)).toFixed(2); } return 'M' + p(a) + 'A' + r + ' ' + r + ' 0 ' + (e - a > Math.PI ? 1 : 0) + ' 1 ' + p(e); }
  function track(r, th) { return '<path class="dn-tr" d="' + (half ? arcD(r, A0, A0 + SPAN) : arcD(r, 0, Math.PI * 1.999)) + '" style="stroke-width:' + th + 'px"/>'; }
  var el = $('[data-dn]', box);
  el.innerHTML = (cmp ? '' : '<div class="dn-seg" role="radiogroup" aria-label="Month"></div>')
    + '<div class="dn-main"><div class="dn-fig' + (half ? ' is-half' : '') + '" data-fig tabindex="0" role="group" aria-roledescription="chart" aria-label="' + (cmp ? 'November spending over October, by kind.' : 'Spending by kind.') + ' Arrow keys read each kind."><svg viewBox="0 0 200 ' + (half ? 116 : 200) + '" aria-hidden="true">'
    + track(R, TH) + (cmp ? track(R2, TH2) : '')
    + NM.map(function (n, i) { return '<path data-c="' + i + '" data-o/>'; }).join('') + (cmp ? NM.map(function (n, i) { return '<path data-c="' + i + '" data-i/>'; }).join('') : '')
    + (ndl ? '<g class="dn-nd" data-nd transform="rotate(-90 ' + CX + ' ' + CY + ')"><line x1="' + CX + '" y1="' + CY + '" x2="' + CX + '" y2="' + (CY - LN) + '"/><circle cx="' + CX + '" cy="' + CY + '" r="6"/><circle class="dn-hub" cx="' + CX + '" cy="' + CY + '" r="2.2"/></g>' : '') + '</svg>'
    + (BUD ? '<p class="dn-ends" aria-hidden="true"><span>KES 0</span><span>Budget ' + TLkes(BUD) + '</span></p>' : '')
    + '<div class="dn-c' + (half ? ' is-half' : '') + (below ? ' is-below' : '') + '"><p class="dn-l" data-l></p><p class="dn-v" data-v></p><p class="dn-s" data-sub>' + (cmp ? '<span class="sk-chip" data-chip>' + TLchipHtml + '</span><span data-cw>on October</span>' : '') + '</p></div></div>'
    + '<ul class="dn-leg">' + NM.map(function (n, i) { return '<li><button class="dn-row" type="button"><i class="dn-sw" data-c="' + i + '"></i><span class="dn-nm">' + n + '</span><span class="dn-rv" data-rv></span>' + (c.bars ? '<span class="dn-bar" aria-hidden="true"><i data-c="' + i + '"></i></span>' : '') + '</button></li>'; }).join('') + '</ul></div><p class="sr" aria-live="polite" data-say></p>';
  var fig = $('[data-fig]', el), svg = $('svg', fig), P = $$('path[data-o]', svg), Q = $$('path[data-i]', svg), nd = $('[data-nd]', svg), rows = $$('.dn-row', el), bars = $$('.dn-bar i', el);
  var l = $('[data-l]', el), sub = $('[data-sub]', el), say = $('[data-say]', el), chip = $('[data-chip]', el);
  var val = TLroll($('[data-v]', el), { value: 0, fmt: TLkes, dur: 600, live: false });
  var rv = rows.map(function (r, i) { return TLroll($('[data-rv]', r), { value: MON[mi][1][i], fmt: TLkes, dur: 520, live: false }); });
  var pct = chip ? TLroll($('[data-pct]', chip), { value: 0, fmt: TLpct, dur: 480, live: false }) : null;
  function data(m) { return MON[m == null ? mi : m][1]; }
  function total(m) { return data(m).reduce(function (a, b) { return a + b; }, 0); }
  function bounds(m) { var D = Math.max(total(m), BUD), s = 0, b = [0]; data(m).forEach(function (v) { s += v; b.push(s / D); }); return b; }
  var act = -1, seen = false, oK = N + 1, oN = 2 * N + 1, oQ = oN + (ndl ? 1 : 0);
  function goal() { var b = bounds(), g = b.concat(NM.map(function (n, i) { return i === act ? 1 : 0; })); if (ndl) g.push(act < 0 ? b[N] : (b[act] + b[act + 1]) / 2); if (cmp) g = g.concat(bounds(0)); return g; }
  var vec = TLvec(goal().map(function () { return 0; }), function (x) {
    for (var i = 0; i < N; i++) {
      var k = x[oK + i], a = A0 + x[i] * SPAN + PAD, e = A0 + x[i + 1] * SPAN - PAD;
      P[i].setAttribute('d', e - a > .004 ? arcD(R, a, e) : 'M0 0'); P[i].style.strokeWidth = (TH + TK * k).toFixed(2) + 'px';
      if (cmp) { var a2 = A0 + x[oQ + i] * SPAN + PAD, e2 = A0 + x[oQ + i + 1] * SPAN - PAD; Q[i].setAttribute('d', e2 - a2 > .004 ? arcD(R2, a2, e2) : 'M0 0'); Q[i].style.strokeWidth = (TH2 + TK * .6 * k).toFixed(2) + 'px'; }
    }
    if (nd) nd.setAttribute('transform', 'rotate(' + ((A0 + x[oN] * SPAN) * 180 / Math.PI).toFixed(2) + ' ' + CX + ' ' + CY + ')');
  }, { dur: 720, zeta: .8 });
  function swap(e, txt) { if (!e || e.textContent === txt) return; e.textContent = txt; if (moving()) e.animate([{ opacity: 0, transform: 'translateY(3px)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.22,1,.36,1)' }); }
  function chipTo(p) { chip.setAttribute('data-dir', Math.abs(p) < .05 ? 'flat' : p > 0 ? 'up' : 'down'); pct.set(Math.round(Math.abs(p) * 10) / 10); chip.title = Math.abs(p) < .05 ? 'The same as October' : (p > 0 ? 'Up ' : 'Down ') + TLpct(p) + ' on October'; }
  function centre() {
    var t = total();
    if (act < 0) { swap(l, MON[mi][0]); if (seen) val.set(t);
      if (cmp) { if (seen) chipTo((t / total(0) - 1) * 100); }
      else swap(sub, BUD ? TLkes(Math.max(0, BUD - t)) + ' left of ' + BUD.toLocaleString('en-KE') : 'spent in all'); }
    else { swap(l, NM[act]); val.set(data()[act]);
      if (cmp) chipTo((data()[act] / data(0)[act] - 1) * 100);
      else swap(sub, Math.round(data()[act] / t * 100) + '% of the month'); }
  }
  function barsTo() { var t = total(); bars.forEach(function (b, i) { b.style.transform = 'scaleX(' + (data()[i] / t).toFixed(4) + ')'; }); }
  function show(i) {
    if (i === act) return; act = i;
    P.concat(Q).forEach(function (p) { p.classList.toggle('is-dim', i >= 0 && +p.getAttribute('data-c') !== i); });
    rows.forEach(function (r, j) { r.classList.toggle('is-on', j === i); if (c.fade) r.classList.toggle('is-fade', i >= 0 && j !== i); });
    if (seen) vec.to(goal()); centre();
  }
  function segAt(e) {
    var r = svg.getBoundingClientRect(), k = 200 / r.width, x = (e.clientX - r.left) * k - CX, y = (e.clientY - r.top) * k - CY, d = Math.sqrt(x * x + y * y);
    if (d < (cmp ? R2 - TH2 / 2 : R - TH / 2) - 10 || d > R + TH / 2 + 14) return -1;
    var t = Math.atan2(x, -y); if (!half && t < 0) t += Math.PI * 2;
    var f = (t - A0) / SPAN, B = bounds(); if (f < 0 || f > 1) return -1;
    for (var i = 0; i < N; i++) if (f <= B[i + 1]) return i; return -1;
  }
  fig.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') show(segAt(e)); });
  fig.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') show(-1); });
  fig.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') show(segAt(e)); });
  document.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' && !el.contains(e.target)) show(-1); });
  fig.addEventListener('keydown', function (e) {
    var key = e.key, i = act;
    if (key === 'ArrowRight' || key === 'ArrowDown') i = (i + 1) % N;
    else if (key === 'ArrowLeft' || key === 'ArrowUp') i = i <= 0 ? N - 1 : i - 1;
    else if (key === 'Home') i = 0; else if (key === 'End') i = N - 1;
    else if (key === 'Escape') { show(-1); return; }
    else return;
    e.preventDefault(); show(i);
  });
  fig.addEventListener('blur', function () { show(-1); });
  rows.forEach(function (r, i) {
    r.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') show(i); });
    r.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !r.matches(':focus-visible')) show(-1); });
    r.addEventListener('focus', function () { if (r.matches(':focus-visible')) show(i); });
    r.addEventListener('blur', function () { setTimeout(function () { var a = document.activeElement; if (!a || !a.closest || !a.closest('.dn-row') || !el.contains(a)) show(-1); }, 0); });
    r.addEventListener('click', function () { show(i); });
    r.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { show(-1); return; }
      var j = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: N - 1 }[e.key]; if (j == null) return; e.preventDefault(); rows[(j + N) % N].focus();
    });
  });
  if (!cmp) TLseg($('.dn-seg', el), MON.map(function (m) { return m[0]; }), function (i) {
    mi = i; if (seen) vec.to(goal()); rv.forEach(function (r, j) { r.set(data()[j]); }); barsTo(); centre();
    say.textContent = MON[i][0] + ': ' + TLkes(total()) + ' spent' + (BUD ? ', ' + TLkes(BUD - total()) + ' left of the budget.' : '.');
  });
  centre();
  TLonView(el, function () { seen = true; vec.to(goal(), { delay: function (i) { return i <= N ? i * 70 : cmp && i >= oQ ? (i - oQ) * 70 + 140 : ndl && i === oN ? 120 : 0; } }); barsTo(); centre(); });
};`;

const dnHtml = '<div class="dn" data-dn></div>';
const donut2 = {
  id: 'donut2', n: '01', name: 'Donut, more', h: 300,
  claim: 'A donut can <em>fade the rest</em> or stand up as a gauge.',
  lead: 'You asked for more of round 3’s A (the other slices fade back) and D (a half ring, like a gauge). Same PocketPay spending. Point at a slice or a row, or use the arrow keys. Switch the month and the slices reshape from where they are.',
  ref: { ids: 'r3 03A, 03D', text: '03A faded the other slices. 03D put the slices on a half ring with the amount under the arch. Our house donut today:', url: SHOW + '#n03', label: 'Open n03' },
  noteHint: 'B, with D’s budget line', moreHint: 'the half ring for a savings goal',
  css: donutCss, js: donutJs,
  opts: [
    {
      k: 'B', name: 'A half ring where the rest fades', kind: 'Lively, A and D mixed',
      line: 'D’s half ring with A’s fading. Point at a slice: the others and their rows fade back, and your slice grows a little thicker on a spring. Nothing moves out of place. The amount rolls under the arch.',
      from: [arc('donut-chart'), arc('gauge'), house('n03')], tryit: 'Point along the arch, then switch to November.',
      needs: 'TLroll and springs on the slice angles.', keys: 'Tab to the arch, then arrow keys go round. Escape goes back. Tab on to read each row.', off: 'Slices are drawn at once. Fading still shows.', law: 'Proximity: the amount sits under the arch you point at.',
      tags: ['motion:springy', 'speed:mid', 'depth:flat', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: dnHtml, js: String.raw`TL4donut(box, { half: true, fade: true, thick: 5 });`,
    },
    {
      k: 'A', name: 'The full ring, with rows that fade too', kind: 'Plain, pushed',
      line: 'Round 3’s A, one step on. Pointing fades the other slices and their rows, so the eye has one place to go. A thin line under each row shows its share of the month.',
      from: [['shadcn/ui charts', 'https://ui.shadcn.com/charts'], arc('donut-chart'), house('n03')], tryit: 'Point at Food, then Transport. Watch the rows.',
      needs: 'TLroll and springs on the slice angles.', keys: 'Arrow keys on the ring. Escape goes back.', off: 'Slices and share lines are drawn at once.', law: 'Jakob: works like most charts.',
      tags: ['motion:some', 'speed:mid', 'depth:flat', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: dnHtml, h: 320, js: String.raw`TL4donut(box, { fade: true, bars: true });`,
    },
    {
      k: 'C', name: 'Two arches: this month over last', kind: 'Mix',
      line: 'November on the big arch, October on the thin one inside it. Point at a kind and both of its slices stay while the rest fade. Under the arch, the amount rolls and a chip says how it changed.',
      from: [arc('donut-chart'), arc('gauge'), arc('metric-card')], tryit: 'Point at Food, then Fun. Watch the chip turn round.',
      needs: 'TLroll, the change chip and springs on both arches.', keys: 'Arrow keys go round. Escape goes back to the whole month.', off: 'Both arches are drawn at once. Numbers swap.', law: 'Proximity: last month sits right inside this month.',
      tags: ['motion:springy', 'speed:mid', 'depth:flat', 'feedback:clear', 'open:inplace', 'new:novel', 'look:ember'],
      html: dnHtml, h: 280, js: String.raw`TL4donut(box, { half: true, compare: true, fade: true, thick: 3 });`,
    },
    {
      k: 'D', name: 'A budget gauge with a needle', kind: 'Reference, pushed',
      line: 'Our donut and gauge (n03), pushed. The arch is the KES 70,000 budget and the slices fill it. A needle swings to how much is spent. Point at a slice and the needle swings to it while the rest fade.',
      from: [house('n03'), arc('gauge'), arc('donut-chart')], tryit: 'Point at Transport, then leave. Switch the month and watch the needle.',
      needs: 'TLroll and one spring for the slices and the needle.', keys: 'Arrow keys move the needle from slice to slice. Escape sends it back.', off: 'The needle and slices are drawn in place.', law: 'Jakob: it reads like a fuel gauge.',
      tags: ['motion:springy', 'speed:mid', 'depth:flat', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: dnHtml, h: 320, js: String.raw`TL4donut(box, { half: true, needle: true, budget: 70000, thick: 3 });`,
    },
  ],
};

/* ================= 02 Sparkline, more ================= */
const sparkCss = String.raw`
.sk4-h { display: flex; align-items: flex-end; justify-content: space-between; gap: 8px 12px; flex-wrap: wrap; }
.sk4-h > div { min-width: 0; display: grid; justify-items: start; }
.sk4-h .sk-l.tll { display: grid; }
.sk4-c { margin: 0 0 4px; display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); }
.sk-ghost { fill: none; stroke: var(--accent); stroke-width: 2; stroke-linecap: round; opacity: 0; }
.sk .dn-seg button { padding: 0 11px; }`;

const sparkJs = String.raw`
/* A sparkline with 7, 30 and 90 days. The line is read at M even steps along its curve, so every period has the
   same points and a switch reshapes the line from where it is. c: morph ('wave' | 'ease'), snap, fill, ghost, shimmer, chip. */
window.TL4spark = function (box, c) {
  c = c || {};
  var T = 180, M = 121, ALL = [], DT = [], i, last = new Date(2026, 10, 5);
  for (i = 0; i < T; i++) { ALL.push(Math.round((11800 + i * 22 + 1700 * Math.sin(i * .85) + 800 * Math.sin(i * 2.1 + 1) + 1300 * Math.sin(i * .13)) / 10) * 10);
    var d = new Date(last); d.setDate(last.getDate() - (T - 1 - i)); DT.push(i === T - 1 ? 'Today' : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', '')); }
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  var PER = [7, 30, 90].map(function (n) { var v = ALL.slice(T - n), s = sum(v); return { n: n, v: v, d: DT.slice(T - n), tot: s, ch: (s / sum(ALL.slice(T - 2 * n, T - n)) - 1) * 100, avg: s / n }; });
  /* the monotone curve through v (scaled 0..1), read at M even steps: the same curve TLmono draws */
  function samp(v) {
    var mn = Math.min.apply(null, v), mx = Math.max.apply(null, v), y = v.map(function (x) { return (x - mn) / (mx - mn || 1); }), n = y.length, dd = [], m = [], k, out = [];
    for (k = 0; k < n - 1; k++) dd.push(y[k + 1] - y[k]);
    m[0] = dd[0]; m[n - 1] = dd[n - 2];
    for (k = 1; k < n - 1; k++) m[k] = dd[k - 1] * dd[k] <= 0 ? 0 : (dd[k - 1] + dd[k]) / 2;
    for (k = 0; k < n - 1; k++) { if (!dd[k]) { m[k] = m[k + 1] = 0; continue; } var a = m[k] / dd[k], b = m[k + 1] / dd[k], h = a * a + b * b; if (h > 9) { var q = 3 / Math.sqrt(h); m[k] = q * a * dd[k]; m[k + 1] = q * b * dd[k]; } }
    for (var j = 0; j < M; j++) { var x = j / (M - 1) * (n - 1), lo = Math.min(n - 2, Math.floor(x)), s = x - lo, s2 = s * s, s3 = s2 * s;
      out.push((2 * s3 - 3 * s2 + 1) * y[lo] + (s3 - 2 * s2 + s) * m[lo] + (-2 * s3 + 3 * s2) * y[lo + 1] + (s3 - s2) * m[lo + 1]); }
    return out;
  }
  var pi = 1, P = PER[pi], el = $('[data-sk]', box), uid = box.id + '-cl';
  el.innerHTML = '<div class="dn-seg" role="radiogroup" aria-label="Period"></div>'
    + '<div class="sk4-h"><div><p class="sk-l" data-l>Sales, last 30 days</p><p class="sk-v" data-v></p></div>' + (c.chip ? '<p class="sk4-c"><span class="sk-chip" data-chip>' + TLchipHtml + '</span><span data-cw>on the 30 days before</span></p>' : '') + '</div>'
    + '<div class="sk-plot" data-plot tabindex="0" role="slider" aria-label="Daily sales. Arrow keys move through the days." aria-valuemin="0">'
    + '<svg aria-hidden="true"><defs><clipPath id="' + uid + '"><rect data-clip x="-10" y="-20" height="200" width="0"/></clipPath></defs>'
    + (c.fill ? '<path class="sk-fill" data-fill/>' : '') + '<path class="sk-base" data-base/>' + (c.ghost ? '<path class="sk-ghost" data-gh/>' : '') + '<path class="sk-dim" data-dim/><path class="sk-ln" data-ln clip-path="url(#' + uid + ')"/>' + (c.shimmer ? '<path class="sk-gl" data-gl pathLength="1"/>' : '')
    + '<line class="sk-cur" data-cur/><circle class="sk-end" data-end r="3.5"/><circle class="sk-dot" data-dot r="4.5"/></svg></div>'
    + '<p class="sk-x" aria-hidden="true"><span data-x0>' + P.d[0] + '</span><span>Today</span></p><p class="sr" aria-live="polite" data-say></p>';
  var plot = $('[data-plot]', el), svg = $('svg', plot), ln = $('[data-ln]', el), dim = $('[data-dim]', el), fill = $('[data-fill]', el), gl = $('[data-gl]', el), gh = $('[data-gh]', el), cur = $('[data-cur]', el), dot = $('[data-dot]', el), end = $('[data-end]', el), clip = $('[data-clip]', el), basel = $('[data-base]', el), say = $('[data-say]', el), chip = $('[data-chip]', el);
  var lbl = TLline($('[data-l]', el)), x0 = TLline($('[data-x0]', el)), cw = chip ? TLline($('[data-cw]', el)) : null;
  var val = TLroll($('[data-v]', el), { value: P.tot, fmt: TLkes, dur: 560, live: false });
  var pct = chip ? TLroll($('[data-pct]', chip), { value: 0, fmt: TLpct, dur: 480, live: false }) : null;
  var W = 300, H = 104, TOP = 10, ys = samp(P.v), u = 1, intro = moving() ? 0 : 1, scrub = false, down = false, idx = P.n - 1, dirty = true, ready = false, lastD = '', pend = false, seen = false;
  function X(f) { return 5 + f * (W - 10); }
  function Y(y) { return TOP + (1 - y) * (H - TOP - 8); }
  function yAt(f) { var t = Math.max(0, Math.min(1, f)) * (M - 1), lo = Math.min(M - 2, Math.floor(t)); return ys[lo] + (ys[lo + 1] - ys[lo]) * (t - lo); }
  function render() {
    if (!ready) return;
    if (dirty) { dirty = false; var d = TLmono(ys.map(function (y, j) { return [X(j / (M - 1)), Y(y)]; })); lastD = d;
      ln.setAttribute('d', d); dim.setAttribute('d', d); if (gl) gl.setAttribute('d', d); if (fill) fill.setAttribute('d', d + 'L' + X(1).toFixed(1) + ' ' + H + 'L' + X(0).toFixed(1) + ' ' + H + 'Z'); }
    var cx = X(u), cy = Y(yAt(u)), f = intro < 1 ? intro : 1;
    cur.setAttribute('x1', cx); cur.setAttribute('x2', cx); dot.setAttribute('cx', cx); dot.setAttribute('cy', cy);
    clip.setAttribute('width', intro < 1 ? X(intro) + 10 : scrub ? cx + 10 : W + 30);
    end.setAttribute('cx', X(f)); end.setAttribute('cy', Y(yAt(f))); if (fill) fill.style.opacity = intro < 1 ? intro : '';
  }
  function layout() { W = plot.clientWidth || 300; H = plot.clientHeight || 104; svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); basel.setAttribute('d', 'M0 ' + (H - .5) + 'H' + W); cur.setAttribute('y1', 0); cur.setAttribute('y2', H); dirty = true; render(); }
  var vec = TLvec(ys.slice(), function (x) {
    ys = x; dirty = true; render();
    if (pend && vec && x.every(function (v, j) { return v === vec.goal[j]; })) { pend = false; if (gl && moving()) plot.classList.add('is-live'); }
  }, c.morph === 'ease' ? { dur: 550, ease: true, eps: 1e-4 } : { dur: 640, zeta: .8, eps: 1e-4 });
  var cv = TLvec([1], function (x) { u = x[0]; render(); }, { dur: 380, zeta: .82, eps: 5e-4 });
  ready = true; layout();
  function chipTo(p, words) { if (!chip) return; chip.setAttribute('data-dir', p >= 0 ? 'up' : 'down'); pct.set(Math.round(Math.abs(p) * 10) / 10); cw.set(words, p >= 0 ? 1 : -1); }
  function rest() { idx = P.n - 1; cv.to([1], { jump: !!c.snap }); val.set(P.tot); lbl.set('Sales, last ' + P.n + ' days', -1); if (seen) chipTo(P.ch, 'on the ' + P.n + ' days before'); plot.setAttribute('aria-valuenow', String(idx)); plot.setAttribute('aria-valuetext', 'Last ' + P.n + ' days, ' + TLkes(P.tot) + ' in all'); }
  function at(i) {
    i = Math.max(0, Math.min(P.n - 1, i)); var was = idx; idx = i;
    cv.to([i / (P.n - 1)], { jump: !!c.snap }); val.set(P.v[i]);
    lbl.set(i === P.n - 1 ? 'Sales today' : 'Sales on ' + P.d[i], i >= was ? 1 : -1);
    chipTo((P.v[i] / P.avg - 1) * 100, 'on a usual day');
    plot.setAttribute('aria-valuenow', String(i)); plot.setAttribute('aria-valuetext', P.d[i] + ', ' + TLkes(P.v[i]));
  }
  function setScrub(on) { if (scrub === on) return; scrub = on; plot.classList.toggle('is-scrub', on); render(); }
  function near(e) { var r = plot.getBoundingClientRect(); return Math.round(((e.clientX - r.left) - 5) / ((W - 10) / (P.n - 1))); }
  function release() { down = false; if (!scrub) return; setScrub(false); rest(); }
  plot.addEventListener('pointerdown', function (e) { down = true; setScrub(true); at(near(e)); });
  plot.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' || down) { setScrub(true); at(near(e)); } });
  plot.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') release(); else down = false; });
  plot.addEventListener('pointercancel', release);
  plot.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') release(); });
  plot.addEventListener('keydown', function (e) {
    var k = e.key, pg = Math.max(1, Math.round(P.n / 6)), j = { ArrowLeft: idx - 1, ArrowDown: idx - 1, ArrowRight: idx + 1, ArrowUp: idx + 1, PageDown: idx - pg, PageUp: idx + pg, Home: 0, End: P.n - 1 }[k];
    if (k === 'Escape') { release(); return; } if (j == null) return; e.preventDefault(); setScrub(true); at(j);
  });
  plot.addEventListener('blur', release);
  var seg = TLseg($('.dn-seg', el), PER.map(function (p) { return p.n + ' days'; }), function (k) {
    if (k === pi) return; pi = k; P = PER[k];
    if (gh && moving() && lastD) { gh.setAttribute('d', lastD); gh.animate([{ opacity: .38 }, { opacity: 0 }], { duration: 900, easing: 'cubic-bezier(.22,1,.36,1)' }); }
    if (gl) { plot.classList.remove('is-live'); pend = true; }
    vec.to(samp(P.v), c.morph === 'wave' ? { delay: function (j) { return j * 2.6; } } : null);
    setScrub(false); rest(); x0.set(P.d[0], k > 1 ? -1 : 1);
    plot.setAttribute('aria-valuemax', String(P.n - 1));
    say.textContent = 'Last ' + P.n + ' days: ' + TLkes(P.tot) + ' in sales.';
  });
  pi = 0; seg.go(1);
  if ('ResizeObserver' in window) new ResizeObserver(function () { var w = plot.clientWidth; if (w && Math.abs(w - W) > 1) layout(); }).observe(plot);
  function done() { intro = 1; render(); if (gl && moving()) plot.classList.add('is-live'); }
  TLonView(el, function () {
    seen = true; if (chip) chipTo(P.ch, 'on the ' + P.n + ' days before');
    if (!moving()) { done(); return; }
    var t0 = performance.now(), DUR = 1100 * (window.TLrollSlow || 1);
    (function f(t) { var k = Math.min(1, (t - t0) / DUR); intro = TLez(k); render(); if (k < 1) requestAnimationFrame(f); else done(); })(t0);
  });
};`;

const skHtml = '<div class="sk" data-sk></div>';
const spark2 = {
  id: 'spark2', n: '02', name: 'Sparkline, more', h: 300,
  claim: 'Switching the period should feel <em>as smooth as sliding.</em>',
  lead: 'You asked for more of round 3’s B and D. Now each card has 7, 30 and 90 days of Duka Fresh sales. Switch the period: the line reshapes from where it is and the big number rolls to the new total. Slide along the line to read one day.',
  ref: { ids: 'r3 04B, 04D', text: '04B rolled the headline, sprang the cursor and dimmed later days. 04D added the live shimmer and a change chip. Our house stat card:', url: SHOW + '#n06', label: 'Open n06' },
  noteHint: 'B’s wave, with D’s chip', moreHint: 'the same switch on a full line chart',
  css: sparkCss, js: sparkJs,
  opts: [
    {
      k: 'B', name: 'The line reshapes in a wave', kind: 'Lively, more of B',
      line: 'Round 3’s B, with periods. Switch and the line reshapes from left to right, each part a beat behind the last, settling on a soft spring. The headline rolls to the new total. Slide and the cursor springs from day to day.',
      from: [arc('sparkline'), arc('line-chart'), house('n06')], tryit: 'Switch 7, 30, 90 days fast. Then slide along the line.',
      needs: 'TLroll, TLvec and an inline SVG.', keys: 'Arrow keys move between periods. On the line: arrows move a day, Page keys a sixth, Home and End, Escape goes back to the total.', off: 'The line takes its new shape at once. Numbers swap.', law: 'Fitts: the whole width of the line is the target.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: skHtml, js: String.raw`TL4spark(box, { morph: 'wave' });`,
    },
    {
      k: 'A', name: 'The house reshape, 0.55 s', kind: 'Plain',
      line: 'What our line chart rule says: range buttons reshape the line in 0.55 s on our one curve, never draw it again. The cursor jumps from day to day with no spring.',
      from: [house('c02'), ['patterns/line-chart.md', null], arc('sparkline')], tryit: 'Switch to 90 days, then back to 7.',
      needs: 'TLroll, TLvec and an inline SVG.', keys: 'Same keys as B.', off: 'The line takes its new shape at once.', law: 'Jakob: works like our other line charts.',
      tags: ['motion:some', 'speed:quick', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: skHtml, js: String.raw`TL4spark(box, { morph: 'ease', snap: true });`,
    },
    {
      k: 'C', name: 'The old line fades where it stood', kind: 'Mix',
      line: 'B’s spring, with a soft fill. When you switch, a faint copy of the old line stays where it was and fades, so you can see how the shape changed.',
      from: [arc('line-chart'), arc('sparkline'), ['DESIGN.md: things that turn into other things stay on screen', null]], tryit: 'Switch from 7 to 90 days and watch the faint line.',
      needs: 'TLroll, TLvec and an inline SVG.', keys: 'Same keys as B.', off: 'No faint line. The line takes its new shape at once.', law: 'Proximity: old and new shape share one place.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:novel', 'look:ember'],
      html: skHtml, js: String.raw`TL4spark(box, { fill: true, ghost: true });`,
    },
    {
      k: 'D', name: 'The stat card, with periods and a chip', kind: 'Reference, pushed',
      line: 'Round 3’s D, pushed. The chip rolls to how this period did against the one before it. While the line reshapes, the shimmer waits, then starts again. Slide back and the chip says how that day compares with a usual day.',
      from: [house('n06'), arc('sparkline'), arc('metric-card'), ['DESIGN.md: the live shimmer', null]], tryit: 'Watch the shimmer, switch to 7 days, then slide to a low day.',
      needs: 'TLroll, TLvec, an inline SVG and one CSS loop.', keys: 'Same keys as B.', off: 'No shimmer. The line and numbers change at once.', law: 'Proximity: the change sits next to the number it changes.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: skHtml, h: 320, js: String.raw`TL4spark(box, { morph: 'ease', chip: true, fill: true, shimmer: true });`,
    },
  ],
};

/* ================= 03 Countdown, more ================= */
const countCss = String.raw`
#countdown2 .c4 { width: min(100%, 340px); display: grid; justify-items: center; gap: 14px; text-align: center; }
#countdown2 .c4-k { margin: 0; font-size: 14px; color: var(--ink-soft); }
#countdown2 .c4 .tlr { font-family: var(--font-num); font-weight: 400; color: var(--ink); }
#countdown2 .c4-dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); position: relative; }
#countdown2 .c4-dot::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: var(--accent); animation: c4Ping 1.6s var(--ease-out) infinite; }
@keyframes c4Ping { from { transform: scale(1); opacity: .5; } to { transform: scale(2.6); opacity: 0; } }
#countdown2 .c4-act { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
#countdown2 .c4-line { width: min(100%, 220px); height: 3px; border-radius: 3px; background: rgb(var(--ink-rgb) / .08); overflow: hidden; transition: opacity .25s var(--ease-out); }
#countdown2 .c4-line i { display: block; height: 100%; background: var(--accent); transform-origin: left; transition: transform 1s linear; }
#countdown2 .c4-bl { display: grid; }
#countdown2 .c4-bl > span { grid-area: 1 / 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; opacity: 0; transform: translateY(10px); transition: opacity .16s var(--ease-out), transform var(--sp-bouncy-d) var(--sp-bouncy); }
#countdown2 .c4-bl > span.on { opacity: 1; transform: none; }
#countdown2 .c4-bl > span.was { transform: translateY(-10px); }
#countdown2 .c4-bl .l-tick { width: 16px; height: 16px; flex-basis: 16px; }`;

const countJs = String.raw`
/* A digit wheel per place, each with its own number of faces: bases [6, 10] for seconds, so the tens turn on
   0 to 5 and 00 to 59 is one step down on both wheels. Same spring and feathered edges as TLroll. */
window.TL4dial = function (el, o) {
  var n = o.bases.length, D = [], val = o.value || 0;
  el.classList.add('tlr'); el.textContent = '';
  var vis = document.createElement('span'); vis.className = 'tlr-v'; vis.setAttribute('aria-hidden', 'true'); el.appendChild(vis);
  o.bases.forEach(function (b) { var c = document.createElement('span'), st = document.createElement('span'), h = ''; c.className = 'tlr-c'; st.className = 'tlr-st'; for (var i = 0; i <= b; i++) h += '<span>' + (i % b) + '</span>'; st.innerHTML = h; c.appendChild(st); vis.appendChild(c); D.push({ b: b, st: st }); });
  function dig(v, i) { return Math.floor(v / Math.pow(10, n - 1 - i)) % 10; }
  var g = D.map(function (d, i) { return dig(val, i) % d.b; });
  var vec = TLvec(g.slice(), function (x) { D.forEach(function (d, i) { var m = ((x[i] % d.b) + d.b) % d.b; d.st.style.transform = 'translateY(' + (-m * 100 / (d.b + 1)).toFixed(3) + '%)'; }); }, { dur: o.dur || 560, zeta: .86 });
  return { set: function (v, so) {
    so = so || {}; var dir = so.dir === 'up' ? 1 : so.dir === 'down' ? -1 : v >= val ? 1 : -1, t = g.slice(); val = v;
    for (var i = 0; i < n; i++) { var b = D[i].b, cd = ((g[i] % b) + b) % b, nd = dig(v, i) % b; if (cd !== nd) t[i] = g[i] + (dir > 0 ? (nd - cd + b) % b : -((cd - nd + b) % b)); }
    g = t; vec.to(t, { jump: so.instant, delay: function (i) { return (n - 1 - i) * 40; } });
  } };
};
/* A countdown on those wheels: m:ss, pauses off screen. o: secs, tick(left, total, dir), end(), start(). */
window.TL4cd = function (box, o) {
  var left = o.secs, total = o.secs, seen = false, timer = 0, ended = false, st = $('[data-st]', box);
  var mm = TL4dial($('[data-mm]', box), { bases: [10], value: Math.floor(left / 60) }), ss = TL4dial($('[data-ss]', box), { bases: [6, 10], value: left % 60 });
  function words() { var m = Math.floor(left / 60), s = left % 60; return (m ? m + (m === 1 ? ' minute ' : ' minutes ') : '') + s + (s === 1 ? ' second' : ' seconds') + ' left'; }
  function paint(dir) { mm.set(Math.floor(left / 60), { dir: dir }); ss.set(left % 60, { dir: dir }); if (st) st.textContent = words(); if (o.tick) o.tick(left, total, dir); }
  function loop() { clearTimeout(timer); if (!seen || document.hidden || ended) return; timer = setTimeout(function () { left = Math.max(0, left - 1); paint('down'); if (!left) { ended = true; if (o.end) o.end(); } else loop(); }, 1000); }
  function restart(secs) { clearTimeout(timer); ended = false; total = left = secs || o.secs; if (o.start) o.start(); paint('up'); loop(); }
  paint();
  new IntersectionObserver(function (es) { seen = es[0].isIntersecting; loop(); }).observe(box);
  document.addEventListener('visibilitychange', loop);
  var sk = $('[data-skip]', box), ag = $('[data-again]', box);
  if (sk) sk.addEventListener('click', function () { if (ended || left <= 10) return; left = 10; paint('down'); loop(); });
  if (ag) ag.addEventListener('click', function () { restart(); });
  return { restart: restart, ended: function () { return ended; } };
};`;

const c4Acts = (again = true) => `<div class="c4-act"><button class="l-btn sm" type="button" data-skip>Skip to the last 10 s</button>${again ? '<button class="l-btn sm" type="button" data-again>Start again</button>' : ''}</div><p class="sr" aria-live="polite" data-sr></p>`;
const countdown2 = {
  id: 'countdown2', n: '03', name: 'Countdown, more', h: 260,
  claim: 'When time runs out, <em>the next step</em> should be right there.',
  lead: 'You asked for more of round 3’s C (the small pill with a draining line) and D (the code timer). Every card counts down for real and pauses off screen. When a minute ends, 00 turns one step to 59: the tens wheel now has only 0 to 5 on it.',
  ref: { ids: 'r3 06C, 06D', text: '06C was a Mawimbi pill with a live dot and an orange line that drains. 06D was a sign-in code timer with "Send a new code" at zero. Both rolled on our odometer:', url: SHOW + '#n07', label: 'Open n07' },
  noteHint: 'B’s pill, with D’s button', moreHint: 'a countdown to a date, with days',
  css: countCss, js: countJs,
  opts: [
    {
      k: 'B', name: 'A pill whose next step grows under it', kind: 'Lively, C and D mixed',
      line: 'C’s pill and draining line. When the minute runs out, the minutes slide away and the pill springs shorter. At zero the pill says "Deal ended", and where the line was, a "Remind me next time" button grows in.',
      from: [arc('countdown'), house('n07'), house('n47')], tryit: 'Wait four seconds for the minute to drop. Then press Skip and wait for zero.',
      needs: 'TL4dial, a clip-path spring and CSS springs.', keys: 'Tab to the buttons. At zero, focus moves to Remind me if it was in the card.', off: 'Digits change in place, the pill jumps to size, the button shows at once.', law: 'Fitts: the next step appears where your eyes already are.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: `<div class="c4"><p class="c4-k">Mawimbi Mobile: 10 GB for KES 499</p>
<div class="c4-pill" data-pill role="timer" aria-label="Time left on the deal"><span class="c4-bgw"><span class="c4-bg" data-bg></span></span>
<span class="c4-row" data-row aria-hidden="true"><span class="c4-dot"></span><span class="c4-t">Ends in</span><span class="c4-u" data-mu><b data-mm></b><small>m</small></span><span class="c4-u"><b data-ss></b><small>s</small></span></span>
<span class="c4-end" data-endl aria-hidden="true">Deal ended</span><span class="sr" data-st></span></div>
<div class="c4-slot"><div class="c4-line" aria-hidden="true"><i data-line></i></div><button class="l-btn sm c4-rm" type="button" data-remind><span class="c4-bl"><span data-s="a" class="on">Remind me next time</span><span data-s="b"><span data-tk></span>We will text you</span></span></button></div>
${c4Acts()}</div>`,
      css: String.raw`#t03B .c4-pill { position: relative; height: 40px; display: grid; place-items: center; max-width: 100%; }
#t03B .c4-pill > * { grid-area: 1 / 1; }
#t03B .c4-bgw { position: absolute; top: 0; bottom: 0; left: 0; pointer-events: none; filter: drop-shadow(0 0 .6px var(--line-hi)) drop-shadow(0 1px 2px rgb(var(--ink-rgb) / .08)); }
#t03B .c4-bg { display: block; height: 100%; background: var(--paper-raised); }
#t03B .c4-row { position: relative; display: flex; align-items: center; gap: 6px; transition: opacity .28s var(--ease-out), transform .36s var(--ease-out), filter .28s var(--ease-out); }
#t03B .c4-t { font-size: 13.5px; color: var(--muted); }
#t03B .c4-u { display: inline-flex; align-items: baseline; gap: 1px; transition: opacity .28s var(--ease-out), transform .36s var(--ease-out), filter .28s var(--ease-out); }
#t03B .c4-u.gone { position: absolute; top: 50%; margin-top: -.7em; opacity: 0; transform: scale(.7); filter: blur(4px); }
#t03B .c4-u b { font-size: 20px; }
#t03B .c4-u small { font-size: 11px; color: var(--muted); }
#t03B .c4-end { position: relative; font-size: 14px; font-weight: 600; color: var(--ink); opacity: 0; transform: scale(.9); filter: blur(4px); transition: opacity .3s var(--ease-out), transform .45s var(--ease-out), filter .3s var(--ease-out); }
#t03B .is-over .c4-row { opacity: 0; transform: scale(.8); filter: blur(5px); }
#t03B .is-over .c4-end { opacity: 1; transform: none; filter: none; transition-delay: .14s; }
#t03B .c4-slot { display: grid; place-items: center; width: 100%; height: 34px; }
#t03B .c4-slot > * { grid-area: 1 / 1; }
#t03B .is-over .c4-line { opacity: 0; }
#t03B .c4-rm { opacity: 0; transform: scale(.85); visibility: hidden; transition: opacity .18s var(--ease-out), transform .2s var(--ease-out), visibility 0s linear .2s; }
#t03B .is-over .c4-rm { opacity: 1; transform: none; visibility: visible; transition: opacity .25s var(--ease-out) .2s, transform var(--sp-bouncy-d) var(--sp-bouncy) .2s, visibility 0s; }`,
      js: String.raw`var pill = $('[data-pill]', box), row = $('[data-row]', box), mu = $('[data-mu]', box), endl = $('[data-endl]', box), line = $('[data-line]', box), rem = $('[data-remind]', box), RS = $$('[data-s]', rem), live = $('[data-sr]', box), wrap = $('.c4', box), PAD = 16, muOn = true, over = false, mw = null;
function wNow() { return (over ? endl.offsetWidth : row.offsetWidth) + PAD * 2; }
function setMu(on) { if (on === muOn) return; muOn = on;
  TLb.flip($$(':scope > *', row).filter(function (k) { return k !== mu; }), function () {
    if (!on) { mu.style.left = mu.offsetLeft + 'px'; mu.classList.add('gone'); clearTimeout(mu._t); mu._t = setTimeout(function () { if (!muOn) mu.hidden = true; }, moving() ? 400 : 0); }
    else { clearTimeout(mu._t); mu.hidden = false; mu.style.left = ''; mu.classList.add('gone'); void mu.offsetWidth; mu.classList.remove('gone'); } });
  if (mw) { if (on) mw.grow(wNow()); else mw.shrink(wNow()); } }
function rs(k) { RS.forEach(function (s) { var on = s.getAttribute('data-s') === k, was = s.classList.contains('on'); s.classList.toggle('on', on); s.classList.toggle('was', was && !on); }); }
mw = TLb.mw($('[data-bg]', box), { r: 20, centre: true });
function measure() { var h = !muOn; if (h) { mu.hidden = false; mu.classList.remove('gone'); } var w = Math.max(row.offsetWidth, endl.offsetWidth) + PAD * 2 + 4; if (h) { mu.classList.add('gone'); mu.hidden = true; } pill.style.width = w + 'px'; mw.size(w); mw.jump(wNow()); }
TL4cd(box, { secs: 64,
  tick: function (left, total, dir) { line.style.transitionDuration = dir === 'up' ? '.5s' : ''; line.style.transform = 'scaleX(' + (left / total).toFixed(4) + ')'; setMu(left >= 60); },
  end: function () { over = true; wrap.classList.add('is-over'); mw.shrink(wNow()); live.textContent = 'The deal has ended.'; if (box.contains(document.activeElement)) setTimeout(function () { rem.focus({ preventScroll: true }); }, 300); },
  start: function () { if (over) { over = false; wrap.classList.remove('is-over'); mw.grow(wNow()); } rs('a'); rem.removeAttribute('data-done'); live.textContent = ''; } });
rem.addEventListener('click', function () { if (rem.getAttribute('data-done')) return; rem.setAttribute('data-done', '1'); $('[data-tk]', rem).innerHTML = TICK; rs('b'); live.textContent = 'We will text you when the next deal starts.'; });
measure(); TLb.fonts(measure);`,
    },
    {
      k: 'C', name: 'The line drains around the box', kind: 'Mix, more of C',
      line: 'C’s draining line, wrapped round the edge of the box, like a timer ring for a card. It empties a little each second. Watch 1:00 turn to 0:59 in one step. At zero the box says free delivery has ended.',
      from: [arc('countdown'), house('n07'), house('n47')], tryit: 'Wait four seconds for 1:00 to turn to 0:59. Then Skip, and Start again to see it roll up.',
      needs: 'TL4dial and one SVG outline.', keys: 'Tab to the buttons.', off: 'The outline and digits jump each second. The end words show at once.', law: 'Proximity: the time left sits on the edge of the thing it is about.',
      tags: ['motion:some', 'speed:mid', 'density:mid', 'feedback:quiet', 'open:inplace', 'new:novel', 'look:ember'],
      html: `<div class="c4"><div class="c4-box" data-box role="timer" aria-label="Time left for free delivery"><svg class="c4-ring" aria-hidden="true"><rect class="c4-tr" data-r x="1" y="1" rx="11"/><rect class="c4-pr" data-r data-ring x="1" y="1" rx="11" pathLength="1"/></svg>
<p class="c4-row" aria-hidden="true"><span class="c4-t">Duka Fresh: free delivery if you order in</span><span class="c4-clk"><b data-mm></b><span>:</span><b data-ss></b></span></p>
<p class="c4-end" aria-hidden="true"><b>Free delivery has ended for today.</b><span>It is back tomorrow at 8 am.</span></p><span class="sr" data-st></span></div>
${c4Acts()}</div>`,
      css: String.raw`#t03C .c4-box { position: relative; width: 100%; display: grid; place-items: center; padding: 16px 18px; border-radius: 12px; background: var(--paper-raised); }
#t03C .c4-box > p { grid-area: 1 / 1; margin: 0; transition: opacity .3s var(--ease-out), transform .4s var(--ease-out), filter .3s var(--ease-out); }
#t03C .c4-ring { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
#t03C .c4-ring rect { fill: none; }
#t03C .c4-tr { stroke: var(--line-hi); stroke-width: 1; }
#t03C .c4-pr { stroke: var(--accent); stroke-width: 2.5; stroke-dasharray: 1 1; transition: stroke-dasharray 1s linear, opacity .3s; }
#t03C .c4-row { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: center; gap: 4px 10px; }
#t03C .c4-t { font-size: 14px; color: var(--ink-soft); }
#t03C .c4-clk { display: inline-flex; align-items: baseline; font: 400 28px/1 var(--font-num); color: var(--ink); }
#t03C .c4-clk > span { padding: 0 1px; color: var(--muted); }
#t03C .c4-end { display: grid; gap: 2px; opacity: 0; transform: scale(.94); filter: blur(4px); }
#t03C .c4-end b { font-size: 15px; font-weight: 600; color: var(--ink); }
#t03C .c4-end span { font-size: 13px; color: var(--muted); }
#t03C .is-over .c4-row { opacity: 0; transform: scale(.9); filter: blur(5px); }
#t03C .is-over .c4-end { opacity: 1; transform: none; filter: none; transition-delay: .14s; }
#t03C .is-over .c4-pr { opacity: 0; }`,
      js: String.raw`var bx = $('[data-box]', box), ring = $('[data-ring]', box), svg = ring.ownerSVGElement, live = $('[data-sr]', box);
function fit() { var w = bx.offsetWidth, h = bx.offsetHeight; svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h); $$('[data-r]', svg).forEach(function (r) { r.setAttribute('width', Math.max(0, w - 2)); r.setAttribute('height', Math.max(0, h - 2)); }); }
fit(); new ResizeObserver(fit).observe(bx);
TL4cd(box, { secs: 64,
  tick: function (left, total, dir) { ring.style.transitionDuration = dir === 'up' ? '.5s' : ''; ring.style.strokeDasharray = (left / total).toFixed(4) + ' 1'; },
  end: function () { bx.classList.add('is-over'); live.textContent = 'Free delivery has ended for today.'; },
  start: function () { bx.classList.remove('is-over'); live.textContent = ''; } });`,
    },
    {
      k: 'D', name: 'The resend button counts down inside itself', kind: 'Reference, pushed',
      line: 'Round 3’s D, pushed. "Send a new code in 0:30" waits inside the button, with an orange line draining along its bottom. At zero the words roll to "Send a new code" and it wakes up. Press it: a tick, then the time rolls back up.',
      from: [house('n07'), house('n29'), arc('countdown'), arc('action-swap')], tryit: 'Press Skip, wait for zero, then press Send a new code.',
      needs: 'TL4dial and CSS springs.', keys: 'Tab to the code field and the button. Before zero, the button says when it will work.', off: 'Words and digits change in place.', law: 'Fitts: the button you will need is the one that counts.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: `<div class="c4"><p class="c4-k">We sent a code to 0712 345 678</p><label class="sr" for="t03D-code">Code</label><input id="t03D-code" class="l-in c4-code" data-code type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="6-digit code">
<button class="l-btn c4-rs is-wait" type="button" data-rs aria-disabled="true"><span class="c4-bl"><span data-s="wait" class="on">Send a new code in <span class="c4-clk"><b data-mm></b>:<b data-ss></b></span></span><span data-s="ready">Send a new code</span><span data-s="sent"><span data-tk></span>New code sent</span></span><i class="c4-rline" data-line aria-hidden="true"></i><span class="sr" data-st></span></button>
<p class="l-muted c4-msg" data-msg aria-live="polite">The code works for 30 seconds.</p>${c4Acts(false)}</div>`,
      css: String.raw`#t03D .c4-code { width: min(100%, 240px); text-align: center; font-family: var(--font-mono); letter-spacing: .3em; }
#t03D .c4-code::placeholder { letter-spacing: .04em; color: var(--muted); }
#t03D .c4-rs { position: relative; overflow: hidden; min-width: min(100%, 240px); font-weight: 600; }
#t03D .c4-rs[aria-disabled="true"] { color: var(--muted); cursor: default; }
#t03D .c4-rs[aria-disabled="true"]:active { transform: none; }
#t03D .c4-clk { display: inline-flex; align-items: baseline; font-size: 16px; }
#t03D .c4-rline { position: absolute; left: 10px; right: 10px; bottom: 5px; height: 2px; border-radius: 2px; background: var(--accent); transform-origin: left; transition: transform 1s linear, opacity .2s; }
#t03D .c4-rs:not(.is-wait) .c4-rline { opacity: 0; }
#t03D .c4-msg { margin: -4px 0 0; display: inline-flex; align-items: center; gap: 6px; }
#t03D .c4-msg .l-tick { width: 16px; height: 16px; flex-basis: 16px; }`,
      js: String.raw`var btn = $('[data-rs]', box), S = $$('[data-s]', btn), line = $('[data-line]', box), msg = $('[data-msg]', box), code = $('[data-code]', box), live = $('[data-sr]', box), at = 'wait';
function show(k) { at = k; S.forEach(function (s) { var on = s.getAttribute('data-s') === k, was = s.classList.contains('on'); s.classList.toggle('on', on); s.classList.toggle('was', was && !on); }); btn.setAttribute('aria-disabled', String(k !== 'ready')); btn.classList.toggle('is-wait', k === 'wait'); if (k !== 'wait') btn.removeAttribute('aria-label'); }
var cd = TL4cd(box, { secs: 30,
  tick: function (left, total, dir) { line.style.transitionDuration = dir === 'up' ? '.5s' : ''; line.style.transform = 'scaleX(' + (left / total).toFixed(4) + ')'; if (at === 'wait') btn.setAttribute('aria-label', 'Send a new code. It works in ' + left + (left === 1 ? ' second.' : ' seconds.')); },
  end: function () { show('ready'); msg.textContent = 'This code has run out.'; live.textContent = 'You can send a new code now.'; } });
btn.addEventListener('click', function () {
  if (at === 'wait') { msg.textContent = 'You can ask for a new code when the time runs out.'; return; } if (at !== 'ready') return;
  $('[data-tk]', btn).innerHTML = TICK; show('sent'); msg.textContent = 'New code sent to 0712 345 678.'; code.value = '';
  setTimeout(function () { show('wait'); cd.restart(30); }, 1400); });
code.addEventListener('input', function () { code.value = code.value.replace(/[^0-9]/g, '').slice(0, 6); if (code.value.length === 6) msg.innerHTML = TICK + 'That code works. You are signed in.'; });`,
    },
  ],
};

/* ================= 04 Sliders, more ================= */
const mkAt = (v) => (v - 100) / 4900;
const MKS = [[100, '100'], [1000, '1k'], [2000, '2k'], [3000, '3k'], [4000, '4k'], [5000, '5k']];
const goalP = (id) => `<p class="fs-g" id="${id}-g">The phone is yours in <b data-w></b> weeks, around <span data-d></span>.</p>`;
const elastic = (id, cls, inner) => `<div class="fs"><div class="fs-h"><span class="l-lbl" id="${id}-l">Save each week</span><span class="fs-v" data-v aria-hidden="true"></span></div>
<div class="es-t ${cls}" data-trk role="slider" tabindex="0" aria-labelledby="${id}-l" aria-describedby="${id}-g" aria-valuemin="100" aria-valuemax="5000" aria-valuenow="1500"><div class="es-rail" data-rail><i class="es-f" data-fill></i></div>${inner}<span class="es-th" data-th></span></div>
${goalP(id)}</div>`;
const range = (id, marks) => `<div class="fs"><div class="fs-h"><label class="l-lbl" for="${id}-r">Save each week</label><output class="fs-v" for="${id}-r" data-v></output></div>
<input id="${id}-r" type="range" min="100" max="5000" step="100" value="1500" data-r aria-describedby="${id}-g">${marks ? `<div class="n4-mk" aria-hidden="true">${MKS.map(([v, l]) => `<span data-mk="${v}" style="left:calc(var(--tw) / 2 + ${mkAt(v).toFixed(4)} * (100% - var(--tw)))">${l}</span>`).join('')}</div>` : ''}
${goalP(id)}</div>`;

const sliderCss = String.raw`
#slider2 .fs { width: min(100%, 360px); display: grid; gap: 10px; text-align: left; }
#slider2 .fs-h { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
#slider2 .fs-h .l-lbl { margin: 0; }
#slider2 .fs-v { font-family: var(--font-num); font-size: 30px; line-height: 1; color: var(--ink); font-variant-numeric: tabular-nums; white-space: nowrap; }
#slider2 .fs-g { margin: 0; font-size: 13.5px; color: var(--muted); }
#slider2 .fs-g b { font-family: var(--font-num); font-weight: 500; font-size: 16px; color: var(--ink); }
/* the elastic track (custom slider) */
#slider2 [role="slider"] { touch-action: none; -webkit-user-select: none; user-select: none; cursor: grab; }
#slider2 [role="slider"]:focus { outline: none; }
#slider2 [role="slider"]:active { cursor: grabbing; }
#slider2 .es-t { position: relative; height: 44px; margin: 30px 8px 0; }
#slider2 .es-rail { position: absolute; left: 0; right: 0; top: 20px; height: 4px; border-radius: 4px; background: rgb(var(--ink-rgb) / .12); overflow: hidden; }
#slider2 .es-f { position: absolute; inset: 0; background: var(--accent); transform-origin: left; }
#slider2 .es-th { position: absolute; left: -11px; top: 11px; width: 22px; height: 22px; }
#slider2 .es-th::before { content: ""; position: absolute; border-radius: 50%; transition: transform .25s var(--ease-out); }
#slider2 .es-t.drag .es-th::before { transform: scale(1.25); transition: transform var(--sp-bouncy-d) var(--sp-bouncy); }
#slider2 .th-dot .es-th::before { inset: 3px; background: var(--accent); box-shadow: 0 0 0 2px var(--paper-raised), var(--shadow-sm); }
#slider2 .th-dot:focus-visible .es-th::before { box-shadow: 0 0 0 2px var(--paper-raised), 0 0 0 6px rgb(var(--accent-rgb) / .3); }
#slider2 .th-ring .es-th::before { inset: 4px; background: var(--paper-raised); border: 3px solid var(--accent); box-shadow: var(--shadow-sm); }
#slider2 .th-ring:focus-visible .es-th::before { box-shadow: 0 0 0 4px rgb(var(--accent-rgb) / .28); }
#slider2 .es-tag { position: absolute; left: 0; bottom: 100%; margin-bottom: -4px; padding: 4px 8px; border-radius: 7px; background: var(--ink); color: var(--paper); font: 500 12px/1 var(--font-mono); white-space: nowrap; pointer-events: none; transform-origin: 50% 140%; opacity: 0; transition: opacity .15s; }
#slider2 .es-tag::after { content: ""; position: absolute; left: 50%; top: 100%; margin-left: -4px; border: 4px solid transparent; border-top-color: var(--ink); }
#slider2 .es-t.drag .es-tag, #slider2 .es-t:focus-visible .es-tag { opacity: 1; }
@media (hover: hover) { #slider2 .es-t:hover .es-tag { opacity: 1; } }
#slider2 .es-mk i { position: absolute; top: 29px; width: 1px; height: 6px; margin-left: -.5px; background: var(--line-hi); transform-origin: top; transition: transform .3s var(--sp-bouncy), background-color .2s; }
#slider2 .es-mk i.on { background: var(--accent); }
#slider2 .es-mk i.hit { transform: scaleY(1.9); }
#slider2 .es-mk b { position: absolute; top: 39px; transform: translateX(-50%); font: 500 10.5px/1 var(--font-mono); color: var(--muted); transition: color .2s; }
#slider2 .es-mk b.on { color: var(--accent-text); }
/* a real range input */
#slider2 input[type=range] { --p: .2857; width: 100%; height: 28px; margin: 0; background: transparent; -webkit-appearance: none; appearance: none; cursor: pointer; }
#slider2 input[type=range]:focus-visible { outline: none; }
#slider2 input[type=range]::-webkit-slider-runnable-track { height: 4px; border-radius: 4px; background: linear-gradient(90deg, var(--accent) calc(var(--tw) / 2 + var(--p) * (100% - var(--tw))), rgb(var(--ink-rgb) / .12) 0); }
#slider2 input[type=range]::-moz-range-track { height: 4px; border-radius: 4px; background: linear-gradient(90deg, var(--accent) calc(var(--tw) / 2 + var(--p) * (100% - var(--tw))), rgb(var(--ink-rgb) / .12) 0); }
#slider2 input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; background: var(--accent); border: 0; transition: transform var(--sp-bouncy-d) var(--sp-bouncy); }
#slider2 input[type=range]::-moz-range-thumb { background: var(--accent); border: 0; }
#slider2 .n4-mk { position: relative; height: 20px; margin-top: -6px; font: 500 10.5px/1 var(--font-mono); color: var(--muted); }
#slider2 .n4-mk span { position: absolute; top: 0; padding-top: 8px; transform: translateX(-50%); transition: color .2s; }
#slider2 .n4-mk span::before { content: ""; position: absolute; left: 50%; top: 0; width: 1px; height: 5px; background: var(--line-hi); transform-origin: top; transition: transform .3s var(--sp-bouncy), background-color .2s; }
#slider2 .n4-mk span.on { color: var(--accent-text); }
#slider2 .n4-mk span.on::before { background: var(--accent); }
#slider2 .n4-mk span.hit::before { transform: scaleY(1.9); }`;

const sliderJs = String.raw`
/* The elastic slider from round 3 (08B), with marks that light as the thumb passes. Arrow, Page, Home and End keys. */
window.TL4elastic = function (box) {
  var t = $('[data-trk]', box), rail = $('[data-rail]', box), fill = $('[data-fill]', box), th = $('[data-th]', box), tag = $('[data-tag]', box), mks = $$('[data-mk]', box), MIN = 100, MAX = 5000, val = 0, W = 1, drag = false;
  function kes(n) { return 'KES ' + TLb.money(n); }
  var rv = TLb.roll($('[data-v]', box), { value: 1500, fmt: kes, dur: 420, stagger: 24 }), rw = TLb.roll($('[data-w]', box), { value: 16, dur: 420 }), dd = $('[data-d]', box);
  function px(v) { return (v - MIN) / (MAX - MIN) * W; }
  function draw() { var x = pos.x, s = str.x; th.style.transform = 'translateX(' + (x + s).toFixed(2) + 'px)';
    rail.style.transformOrigin = s < 0 ? 'right' : 'left'; rail.style.transform = Math.abs(s) > .05 ? 'scaleX(' + (1 + Math.abs(s) / W).toFixed(4) + ')' : '';
    fill.style.transform = 'scaleX(' + Math.max(0, Math.min(1, x / W)).toFixed(4) + ')'; }
  var pos = TLb.sp(draw, { k: 420, c: 34, eps: .1 }), str = TLb.sp(draw, { k: 380, c: 11, eps: .05 });
  var lean = tag ? TLb.sp(function (x, s) { var r = Math.max(-16, Math.min(16, -s.v * .028)); tag.style.transform = 'translateX(' + x.toFixed(2) + 'px) translateX(-50%) rotate(' + r.toFixed(2) + 'deg)'; }, { k: 170, c: 17, eps: .1 }) : null;
  function setv(v, glide) { v = Math.max(MIN, Math.min(MAX, Math.round(v / 100) * 100));
    if (v !== val) { var was = val; val = v; if (was) mks.forEach(function (m) { var k = +m.getAttribute('data-mk'); if ((was < k) !== (v < k) || v === k) { m.classList.add('hit'); clearTimeout(m._t); m._t = setTimeout(function () { m.classList.remove('hit'); }, 260); } }); }
    mks.forEach(function (m) { m.classList.toggle('on', val >= +m.getAttribute('data-mk')); });
    t.setAttribute('aria-valuenow', val); t.setAttribute('aria-valuetext', kes(val) + ' a week'); rv.set(val); if (tag) tag.textContent = kes(val); var w = TLb.weeks(val); rw.set(w.w); dd.textContent = w.d;
    if (glide) pos.to(px(val)); else pos.to(px(val), { k: 1400, c: 75 }); if (lean) lean.to(px(val)); }
  function measure() { W = t.clientWidth || 1; pos.jump(px(val)); if (lean) lean.jump(px(val)); }
  function rub(o) { return Math.sign(o) * 22 * (1 - Math.exp(-Math.abs(o) / 70)); }
  function fromX(cx) { var r = t.getBoundingClientRect(), raw = (cx - r.left) / W; if (raw < 0) str.jump(rub(raw * W)); else if (raw > 1) str.jump(rub((raw - 1) * W)); else if (str.x) str.jump(0);
    var v = MIN + Math.max(0, Math.min(1, raw)) * (MAX - MIN), near = Math.round(v / 1000) * 1000; if (near >= 1000 && Math.abs(v - near) < 90) v = near; return v; }
  t.addEventListener('pointerdown', function (e) { if (e.button) return; t.setPointerCapture(e.pointerId); t.classList.add('drag'); drag = true; setv(fromX(e.clientX), true); });
  t.addEventListener('pointermove', function (e) { if (drag) setv(fromX(e.clientX), false); });
  function up() { if (!drag) return; drag = false; t.classList.remove('drag'); str.to(0); }
  t.addEventListener('pointerup', up); t.addEventListener('pointercancel', up);
  TLb.keys(t, { step: 100, big: 1000, min: MIN, max: MAX, get: function () { return val; }, go: function (v, d) { if ((v > MAX && val === MAX) || (v < MIN && val === MIN)) { str.to(0, { v: d * 260 }); return; } setv(v, true); } });
  setv(1500, true); new ResizeObserver(measure).observe(t); measure();
};
/* A real range input: the amount and weeks roll, marks light and pop as the thumb passes. */
window.TL4range = function (box, o) {
  o = o || {}; var r = $('[data-r]', box), mk = $$('[data-mk]', box), dd = $('[data-d]', box), last = +r.value;
  function kes(n) { return 'KES ' + TLb.money(n); }
  var rv = TLb.roll($('[data-v]', box), { value: last, fmt: kes, dur: 460, stagger: 28 }), rw = TLb.roll($('[data-w]', box), { value: TLb.weeks(last).w, dur: 460 }), dl = null;
  if (o.line) { dd.textContent = TLb.weeks(last).d; dl = TLline(dd); }
  function upd() { var x = +r.value, w = TLb.weeks(x); r.style.setProperty('--p', ((x - 100) / 4900).toFixed(4)); r.setAttribute('aria-valuetext', kes(x) + ' a week'); rv.set(x); rw.set(w.w); if (dl) dl.set(w.d, x >= last ? -1 : 1); else dd.textContent = w.d;
    mk.forEach(function (m) { var k = +m.getAttribute('data-mk'); m.classList.toggle('on', x >= k); if ((last < k) !== (x < k) || (x === k && last !== k)) { m.classList.add('hit'); clearTimeout(m._t); m._t = setTimeout(function () { m.classList.remove('hit'); }, 280); } }); last = x; }
  r.addEventListener('input', upd); upd();
};`;

const slider2 = {
  id: 'slider2', n: '04', name: 'Sliders, more', h: 230,
  claim: 'The handle should be <em>small and orange,</em> and still easy to grab.',
  lead: 'You asked for more of round 3’s B (elastic) and D (our counting slider), with smaller orange handles. Each card tries a different handle: a solid dot, a plain dot on a real slider, a ring and a short bar. The whole track is still the target, and the arrow keys work on every one.',
  ref: { ids: 'r3 08B, 08D', text: '08B stretched past the ends and its tag leaned with your speed. 08D was our n44 slider with rolling numbers. Both had a 22 px paper handle with an orange edge. Our house slider:', url: SHOW + '#n44', label: 'Open n44' },
  noteHint: 'B’s stretch with D’s bar', moreHint: 'a two-handle price range',
  css: sliderCss, js: sliderJs,
  opts: [
    {
      k: 'B', name: 'Elastic, with a solid orange dot', kind: 'Lively, more of B',
      line: 'Round 3’s B with a 16 px solid orange dot and a thin paper edge, so it reads on the orange track. It swells a little while you drag. Pull past an end and the track stretches, then snaps back. The tag leans with your speed.',
      from: [arc('elastic-slider'), house('n44')], tryit: 'Drag fast from side to side, then pull hard past the right end.',
      needs: 'Script and a spring.', keys: 'Arrows move 100, Shift moves 1,000, Page keys 1,000, Home and End jump. At an end the track stretches.', off: 'No stretch or lean. The dot goes straight to the value.', law: 'Fitts: the dot is small, but the whole track is the target.',
      tags: ['motion:springy', 'speed:mid', 'feedback:loud', 'new:twist', 'look:ember'],
      html: elastic('t04B', 'th-dot', '<span class="es-tag" data-tag aria-hidden="true"></span>'), js: String.raw`TL4elastic(box);`,
    },
    {
      k: 'A', name: 'A real slider with a 14 px orange dot', kind: 'Plain',
      line: 'The plain way: the browser’s own slider with a 14 px solid orange dot and a thin track. The amount and the weeks still roll. Nothing else moves.',
      from: [['shadcn/ui slider', 'https://ui.shadcn.com/docs/components/slider'], house('n44')], tryit: 'Drag the dot, then use the arrow keys.',
      needs: 'A real range input and the shared digit roll.', keys: 'Arrows move 100, Page keys 1,000, Home and End jump.', off: 'The numbers change in place.', law: 'Jakob: the slider every phone has.',
      tags: ['motion:some', 'speed:quick', 'feedback:quiet', 'new:familiar', 'look:ember'],
      html: range('t04A', false),
      css: String.raw`#t04A .fs { --tw: 14px; }
#t04A input[type=range]::-webkit-slider-thumb { width: 14px; height: 14px; margin-top: -5px; border-radius: 50%; box-shadow: 0 0 0 2px var(--paper-raised), var(--shadow-sm); }
#t04A input[type=range]::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 0 2px var(--paper-raised); }
#t04A input[type=range]:active::-webkit-slider-thumb { transform: scale(1.25); }
#t04A input[type=range]:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 2px var(--paper-raised), 0 0 0 6px rgb(var(--accent-rgb) / .3); }
#t04A input[type=range]:focus-visible::-moz-range-thumb { box-shadow: 0 0 0 2px var(--paper-raised), 0 0 0 6px rgb(var(--accent-rgb) / .3); }`,
      js: String.raw`TL4range(box);`,
    },
    {
      k: 'C', name: 'Elastic on our marks, with an orange ring', kind: 'Mix, B and D',
      line: 'B’s stretch on D’s marks. The handle is a 14 px orange ring. Each mark lights orange and pops as the ring passes it, and the track still stretches past the ends.',
      from: [arc('elastic-slider'), house('n44')], tryit: 'Slide slowly across 2k and 3k, then pull past the left end.',
      needs: 'Script and a spring.', keys: 'Arrows move 100, Page keys 1,000, Home and End jump.', off: 'No stretch or pop. The marks still light.', law: 'Proximity: the marks put numbers right under the track.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: elastic('t04C', 'th-ring', `<span class="es-mk" aria-hidden="true">${MKS.map(([v, l]) => `<i data-mk="${v}" style="left:${(mkAt(v) * 100).toFixed(3)}%"></i><b data-mk="${v}" style="left:${(mkAt(v) * 100).toFixed(3)}%">${l}</b>`).join('')}</span>`),
      css: String.raw`#t04C .es-t { height: 54px; margin-top: 18px; }`,
      js: String.raw`TL4elastic(box);`,
    },
    {
      k: 'D', name: 'Our counting slider, with a short orange bar', kind: 'Reference, pushed',
      line: 'Round 3’s D, pushed. A real slider whose handle is a short orange bar, 6 by 20 px, that stretches a little while you hold it. The marks light as it passes, the numbers roll, and the date rolls in from the side it moved.',
      from: [house('n44'), arc('slider')], tryit: 'Slide from 500 to 5,000 and watch the weeks and the date roll.',
      needs: 'A real range input, script and the shared digit roll.', keys: 'Arrows move 100, Page keys 1,000, Home and End jump.', off: 'The numbers and date change in place. The marks light with no pop.', law: 'Fitts: a thin bar marks the exact spot, and the whole track is the target.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: range('t04D', true),
      css: String.raw`#t04D .fs { --tw: 6px; }
#t04D input[type=range]::-webkit-slider-thumb { width: 6px; height: 20px; margin-top: -8px; border-radius: 3px; box-shadow: 0 0 0 2px var(--paper-raised); }
#t04D input[type=range]::-moz-range-thumb { width: 6px; height: 20px; border-radius: 3px; box-shadow: 0 0 0 2px var(--paper-raised); }
#t04D input[type=range]:active::-webkit-slider-thumb { transform: scaleY(1.2); }
#t04D input[type=range]:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 2px var(--paper-raised), 0 0 0 5px rgb(var(--accent-rgb) / .3); }
#t04D input[type=range]:focus-visible::-moz-range-thumb { box-shadow: 0 0 0 2px var(--paper-raised), 0 0 0 5px rgb(var(--accent-rgb) / .3); }
#t04D .fs-g .tll { vertical-align: bottom; }`,
      js: String.raw`TL4range(box, { line: true });`,
    },
  ],
};

/* ================= 05 Fixed from round 3 ================= */
const sv = (d) => `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const stepper = (id, label, min, max, val) => `<div class="nf-row sm" data-shell><button class="nf-st" type="button" data-dn tabindex="-1" aria-label="One fewer">${sv('M3.5 8h9')}</button><span class="nf-cell"><input id="${id}" class="nf-in" data-in type="text" inputmode="numeric" autocomplete="off" role="spinbutton" aria-label="${label}" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${val}"><span class="nf-disp" data-disp aria-hidden="true"></span></span><button class="nf-st" type="button" data-up tabindex="-1" aria-label="One more">${sv('M8 3.5v9M3.5 8h9')}</button></div>`;
const cart = O3('numfield', 'D'), combo = O3('morphsel', 'D'), fold = O3('morphbtn', 'D'), ask = O3('morphbtn', 'B');
const fixes = {
  id: 'fixes', n: '05', name: 'Fixed from round 3', h: 240,
  claim: 'Four round 3 parts, <em>fixed the way you asked.</em>',
  lead: 'Each card is one round 3 version with only your fix in it. Its name says what changed, and its line says which version it fixes.',
  ref: { ids: 'r3 07D, 09D, 10D, 10B', text: 'The cart total in the pay button, the combobox that resizes, the pay button that folds and the remove button that asks in place. The pay button they grew from:', url: SHOW + '#n29', label: 'Open n29' },
  noteHint: 'C, but fold a little slower', moreHint: 'the same corners on the copy button',
  css: re(P3('numfield').css, '#numfield', '#fixes') + re(P3('morphsel').css, '#morphsel', '#fixes') + re(P3('morphbtn').css, '#morphbtn', '#fixes'),
  opts: [
    {
      k: 'B', name: 'Each row now says KES 60 × 3 = KES 180', kind: 'Fixes r3 07D',
      line: 'Round 3’s 07D, the cart whose total rolls in the pay button. Each row now shows the sum with the currency: "KES 60 × 3 = KES 180". The count and the row total roll as you change it.',
      from: [house('n29'), arc('number-field')], tryit: 'Add a mango, take away the bread, then pay.',
      needs: 'Script and the shared digit roll.', keys: 'Tab to each count; arrows change it. Tab on to Pay.', off: 'Numbers change in place. The button still shows Paying and Paid.', law: 'Proximity: each sum sits on its own row, the total on the button that pays it.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'new:twist', 'look:ember'], h: 330, top: true,
      html: `<div class="nf cr"><ul class="cr-l">${[['Mangoes', 60, 3], ['Milk, 500 ml', 65, 1], ['Bread, 400 g', 70, 1]].map(([n, p, q], i) => `<li class="cr-r" data-row data-p="${p}" data-q="${q}"><span class="cr-n">${n}<small aria-hidden="true">KES ${p} × <span data-qn></span> = <span data-trk></span></small></span>${stepper(`t05B-${i}`, n, 0, 9, q)}<p class="sr" data-note aria-live="polite"></p></li>`).join('')}</ul>
<button class="l-btn pri cr-pay" type="button" data-pay><span class="cr-s is-on" data-s="0">Pay KES <span data-amt></span></span><span class="cr-s" data-s="1" aria-hidden="true"><i></i><i></i><i></i></span><span class="cr-s" data-s="2" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.4 6.6 11.3 12.5 4.8"/></svg>Paid</span></button>
<p class="l-muted cr-m" data-msg aria-live="polite">Nothing paid yet.</p></div>`,
      css: re(cart.css, '#t07D', '#t05B') + String.raw`
#t05B .cr-r { grid-template-columns: minmax(0, 1fr) auto; }
#t05B .cr-n small { font-variant-numeric: tabular-nums; white-space: nowrap; }
#t05B .cr-n small .tlr { vertical-align: bottom; }
@media (max-width: 400px) { #t05B .cr-r { grid-template-columns: minmax(0, 1fr) auto; } }`,
      js: String.raw`var rows = $$('[data-row]', box), amt = TLb.roll($('[data-amt]', box), { value: 315, fmt: TLb.money, dur: 520, stagger: 30 }), pay = $('[data-pay]', box), S = $$('[data-s]', pay), msg = $('[data-msg]', box), busy = false, fs = [];
function total() { return fs.reduce(function (a, f, i) { return a + f.get() * +rows[i].getAttribute('data-p'); }, 0); }
function show(k) { S.forEach(function (s, i) { var was = s.classList.contains('is-on'); s.classList.toggle('is-on', i === k); s.classList.toggle('was', was && i !== k); }); }
rows.forEach(function (row) { var p = +row.getAttribute('data-p'), q = +row.getAttribute('data-q'), t = TLb.roll($('[data-trk]', row), { value: p * q, fmt: function (n) { return 'KES ' + TLb.money(n); }, dur: 460, stagger: 26 }), qn = TLb.roll($('[data-qn]', row), { value: q, dur: 420 });
  fs.push(TLb.nf(row, { value: q, min: 0, max: 9, step: 1, maxMsg: 'Nine is the most per item.', minMsg: 'None in the cart.', text: function (n) { return n + ' at KES ' + p + ' each, KES ' + TLb.money(n * p); },
    on: function (n, was, first) { t.set(n * p); qn.set(n); if (!first) { var tt = total(); amt.set(tt); pay.setAttribute('aria-disabled', String(tt === 0)); msg.textContent = tt ? 'Nothing paid yet.' : 'Your cart is empty.'; } } })); });
pay.addEventListener('click', function () { if (busy || !total()) return; busy = true; var tt = total(); pay.setAttribute('aria-busy', 'true'); show(1); msg.textContent = 'Paying…';
  setTimeout(function () { show(2); pay.removeAttribute('aria-busy'); msg.textContent = 'KES ' + TLb.money(tt) + ' paid to Duka Fresh.'; setTimeout(function () { show(0); busy = false; }, 2200); }, 1400); });`,
    },
    {
      k: 'A', name: 'The combobox, smaller and less round', kind: 'Fixes r3 09D',
      line: 'Round 3’s 09D, the one you picked. It was the size, not the padding: the field was 46 px tall, and our fields are 40. It is 40 now, its corners are 9 px instead of 12, and the rows are 34 px instead of 36. The padding stays as it was.',
      from: [house('n09'), arc('combobox')], tryit: 'Type "ki", then delete it slowly. Pick with Enter.',
      needs: 'Script and the shared digit roll.', keys: 'Type to filter. Arrows move, Enter picks, Escape closes or clears.', off: 'The list jumps to its new size; the pick shows at once.', law: 'Hick: typing cuts eight choices down to one or two.',
      tags: ['motion:springy', 'speed:mid', 'open:trigger', 'feedback:clear', 'new:twist', 'look:ember'], h: 400, top: true,
      html: re(combo.html, 't09D', 't05A'),
      css: re(combo.css, '#t09D', '#t05A') + String.raw`
#t05A .cbx { height: 40px; border-radius: 9px; }
#t05A .ms-pop { border-radius: 12px; top: calc(100% + 5px); }
#t05A .ms-o, #t05A .ms-hl { height: 34px; border-radius: 7px; }
@media (pointer: coarse) { #t05A .ms-o, #t05A .ms-hl { height: 44px; } }`,
      js: combo.js,
    },
    {
      k: 'C', name: 'The pay button folds with curved corners', kind: 'Fixes r3 10D',
      line: 'Round 3’s 10D, with your corner rule. The button keeps 10 px corners the whole way: it folds into a small orange square with round corners while it works, opens into a paper button with a tick, then grows back. No pill and no circle.',
      from: [house('n29'), arc('action-swap'), arc('action-button')], tryit: 'Press Pay and watch the corners, then watch it come back.',
      needs: 'Script and a clip-path spring.', keys: 'Tab to Pay, then Enter.', off: 'Each step shows at once: Paying, then Paid.', law: 'Doherty: the button answers the moment you press.',
      tags: ['motion:springy', 'speed:mid', 'open:inplace', 'feedback:loud', 'new:twist', 'look:ember'], h: 200,
      html: fold.html,
      css: re(fold.css, '#t10D', '#t05C') + String.raw`
#t05C .pb-b { border-radius: 10px; }`,
      js: re(fold.js, '{ r: 23, centre: true }', '{ r: 10, centre: true }'),
    },
    {
      k: 'D', name: 'The remove button asks in place, with curved corners', kind: 'Fixes r3 10B',
      line: 'Round 3’s 10B, with your corner rule. The shape that grows into "Remove it for good?" now has 10 px corners, and the buttons inside it have 7 px corners, so the curves sit inside each other. The motion is the same.',
      from: [arc('confirm-morph'), house('n29')], tryit: 'Press Remove card, then try to double-click straight through it.',
      needs: 'Script and a clip-path spring.', keys: 'Enter opens it and focus moves to Remove. Escape puts it back. Held keys do not repeat a press.', off: 'Each step shows at once, at its own width.', law: 'Fitts: the answer appears right where you pressed.',
      tags: ['motion:springy', 'speed:mid', 'open:inplace', 'feedback:clear', 'new:twist', 'look:ember'], h: 250,
      html: ask.html,
      css: re(ask.css, '#t10B', '#t05D') + String.raw`
#t05D .mb-bg { border-radius: 10px; }
#t05D .cf-ask, #t05D .cf-yes, #t05D .cf-no { border-radius: 7px; }`,
      js: re(ask.js, '{ r: 20 }', '{ r: 10 }'),
    },
  ],
};

export default [donut2, spark2, countdown2, slider2, fixes];
