// Round 3, batch A: rolling number (ours against Arc's), usage meter, donut, sparkline, metric card.
// Ideas from Arc's free parts (uiarc.dev, MIT), rebuilt in our own look with our own code.
// The first part's js puts the shared helpers on window: TLroll (the number roll), TLvec (springs
// for any list of numbers), TLez (our one curve), TLsp (a spring token), TLline (a line that rolls in),
// TLmono (the monotone curve for lines), TLonView, TLkes. Batch B loads after this file and uses TLroll.
import { arc, house, skill } from '../src-links.mjs';

const SHOW = '../../components/showcase/index.html';

/* ================= 01 Rolling number ================= */
const rlHtml = `<div class="rl"><p class="rl-cap">Today's sales <span>· Duka Fresh</span></p><div class="rl-num" data-num></div><p class="rl-d" data-d>Starts at KES 12,480</p><div class="rl-btns"><button class="l-btn sm" type="button" data-add="350">+KES 350</button><button class="l-btn sm" type="button" data-add="-1200">−KES 1,200</button><button class="l-btn sm" type="button" data-to>Jump to 1,048,300</button><button class="l-btn sm" type="button" data-rand>Random</button></div></div>`;

const rollCss = String.raw`
/* ---- TLroll: shared by every part that rolls a number ---- */
.tlr { display: inline-flex; align-items: baseline; white-space: nowrap; font-variant-numeric: tabular-nums lining-nums; --tlr-h: 1.18em; }
.tlr-v { display: inline-flex; align-items: baseline; }
.tlr-c, .tlr-s { display: inline-block; height: var(--tlr-h); line-height: var(--tlr-h); overflow: hidden; }
.tlr-c { -webkit-mask-image: linear-gradient(transparent, #000 13%, #000 87%, transparent); mask-image: linear-gradient(transparent, #000 13%, #000 87%, transparent); }
.tlr-st { display: block; }
.tlr-st > span { display: block; height: var(--tlr-h); text-align: center; }
.tlr-s { white-space: pre; }
/* ---- a line that rolls in ---- */
.tll { display: inline-grid; overflow: clip; vertical-align: bottom; }
.tll > span { grid-area: 1 / 1; white-space: nowrap; }
/* ---- 01 ---- */
.rl-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px; margin: 0 0 18px; padding: 14px 16px; border-radius: var(--radius); border: 1px solid var(--line); background: var(--paper-raised); box-shadow: var(--shadow-sm); }
.rl-bar .l-btn[aria-pressed="true"] { background: var(--ink); color: var(--paper); border-color: transparent; }
.rl-st { margin: 0; flex: 1 1 220px; font-size: 13.5px; color: var(--muted); }
#roll .stage { container-type: inline-size; }
.rl { width: 100%; display: grid; justify-items: center; gap: 6px; text-align: center; }
.rl-cap { margin: 0; font: 500 11px/1.3 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.rl-cap span { text-transform: none; letter-spacing: 0; font-family: var(--font-body); font-size: 12.5px; }
.rl-num { font: 400 min(58px, 14.5cqi)/1 var(--font-num); color: var(--ink); min-height: 1.2em; }
.rl-num .tlr-a, .rl-num .n7-a { font-size: .42em; letter-spacing: .04em; color: var(--muted); font-family: var(--font-mono); font-weight: 500; }
.rl-d { margin: 0; min-height: 1.4em; font: 500 12px/1.4 var(--font-mono); letter-spacing: .04em; color: var(--muted); }
.rl-btns { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-top: 10px; }
/* our n07, as it is today */
.n7, .n7-v { display: inline-flex; align-items: baseline; font-variant-numeric: tabular-nums; }
.n7-c, .n7-s { display: block; height: 1.1em; line-height: 1.1em; overflow: hidden; }
.n7-s { white-space: pre; }
.n7-a { height: auto; line-height: 1; }
.n7-st { display: block; transition: transform .5s var(--ease-out); }
.n7-st > span { display: block; height: 1.1em; }
html[data-motion="calm"] .n7-st { transition-duration: .3s; }`;

const rollJs = String.raw`
/* ===== shared helpers (round 3) ===== */
window.TLez = function (t) { /* our one curve, cubic-bezier(.22,1,.36,1) */
  if (t <= 0) return 0; if (t >= 1) return 1;
  function b(s, p, q) { return 3 * p * s * (1 - s) * (1 - s) + 3 * q * s * s * (1 - s) + s * s * s; }
  var s = t; for (var i = 0; i < 8; i++) { var x = b(s, .22, .36) - t, d = 3 * .22 * (1 - s) * (1 - s) + 6 * (.36 - .22) * s * (1 - s) + 3 * (1 - .36) * s * s; if (Math.abs(x) < 1e-5 || !d) break; s = Math.max(0, Math.min(1, s - x / d)); }
  return b(s, 1, 1);
};
window.TLsp = function (n) { var cs = getComputedStyle(root); return { e: cs.getPropertyValue('--sp-' + n).trim() || 'cubic-bezier(.22,1,.36,1)', d: (parseFloat(cs.getPropertyValue('--sp-' + n + '-d')) || .4) * 1000 }; };
/* Springs for any list of numbers. draw(x) runs every frame. Calm motion and o.ease use our curve instead. */
window.TLvec = function (x0, draw, o) {
  o = o || {}; var n = x0.length, x = x0.slice(), v = x0.map(function () { return 0; }), T = x0.slice(), g = x0.slice(), f = x0.slice(), t0 = v.slice(), at = v.slice(), raf = 0, last = 0, eps = o.eps || 1e-3;
  function cfg() { var d = (o.dur || 550) * (window.TLrollSlow || 1), calm = lvl() === 'calm', z = o.zeta || .82; return { tw: !!o.ease || calm, D: calm ? d * .6 : d, Z: z, W: 4.6 / (z * d / 1000) }; }
  function tick(t) {
    var c = cfg(), dt = Math.min(.032, Math.max(.001, (t - last) / 1000)), busy = false; last = t;
    for (var i = 0; i < n; i++) {
      if (at[i] && t >= at[i]) { at[i] = 0; T[i] = g[i]; f[i] = x[i]; t0[i] = t; }
      if (at[i]) { busy = true; continue; }
      if (c.tw) { var k = Math.min(1, (t - t0[i]) / c.D); x[i] = k >= 1 ? T[i] : f[i] + (T[i] - f[i]) * TLez(k); v[i] = 0; if (k < 1) busy = true; }
      else if (x[i] !== T[i] || v[i]) { var a = -c.W * c.W * (x[i] - T[i]) - 2 * c.Z * c.W * v[i]; v[i] += a * dt; x[i] += v[i] * dt; if (Math.abs(x[i] - T[i]) < eps && Math.abs(v[i]) < eps * 20) { x[i] = T[i]; v[i] = 0; } else busy = true; }
    }
    draw(x); raf = busy ? requestAnimationFrame(tick) : 0;
  }
  draw(x);
  return {
    x: x, goal: g,
    to: function (tg, so) {
      so = so || {}; var now = performance.now(), i;
      if (!moving() || so.jump) { for (i = 0; i < n; i++) { x[i] = T[i] = g[i] = f[i] = tg[i]; v[i] = 0; at[i] = 0; } draw(x); return; }
      for (i = 0; i < n; i++) { if (tg[i] === g[i] && !at[i]) continue; g[i] = tg[i]; var dl = so.delay ? so.delay(i) * (window.TLrollSlow || 1) : 0; if (dl > 0) at[i] = now + dl; else { at[i] = 0; T[i] = tg[i]; f[i] = x[i]; t0[i] = now; } }
      if (!raf) { last = now; raf = requestAnimationFrame(tick); }
    }
  };
};
/* The number roll. Each digit is a drum that turns the way the number moved. */
window.TLroll = function (el, o) {
  o = o || {};
  var api = { value: o.value || 0, fmt: o.fmt || function (n) { return String(n); }, el: el };
  var slots = {}, order = [], raf = 0, last = 0, built = false;
  el.classList.add('tlr'); el.textContent = '';
  var vis = document.createElement('span'); vis.className = 'tlr-v'; vis.setAttribute('aria-hidden', 'true');
  var sr = document.createElement('span'); sr.className = 'sr'; if (o.live !== false) sr.setAttribute('aria-live', 'polite');
  el.appendChild(vis); el.appendChild(sr);
  function md(a) { return ((a % 10) + 10) % 10; }
  function rank(k) { var c = k.charAt(0), i = parseInt(k.slice(1), 10); return c === 'p' ? i : c === 'd' ? 1000 - 2 * i : c === 's' ? 1001 - 2 * i : 3000 + i; }
  function parse(s) {
    var tot = (s.match(/[0-9]/g) || []).length, seen = 0, p = 0, x = 0, out = [];
    for (var i = 0; i < s.length; i++) { var ch = s.charAt(i);
      if (ch >= '0' && ch <= '9') { seen++; out.push({ k: 'd' + (tot - seen), ch: ch, d: +ch }); }
      else out.push({ k: (seen === 0 ? 'p' + (p++) : seen === tot ? 'x' + (x++) : 's' + (tot - seen)) + ch, ch: ch }); }
    return out;
  }
  function mk(t) {
    var e = document.createElement('span'), s = { k: t.k, el: e, r: rank(t.k) };
    if (t.d != null) { e.className = 'tlr-c'; var st = document.createElement('span'), h = ''; st.className = 'tlr-st'; for (var i = 0; i < 11; i++) h += '<span>' + (i % 10) + '</span>'; st.innerHTML = h; e.appendChild(st); s.st = st; s.x = s.T = s.g = s.f = 0; s.v = 0; s.t0 = 0; s.at = 0; }
    else { e.className = 'tlr-s' + (/[A-Za-z]/.test(t.ch) ? ' tlr-a' : ''); e.textContent = t.ch === ' ' ? ' ' : t.ch; }
    return s;
  }
  function cfg() { var d = (o.dur || 650) * (window.TLrollSlow || 1), calm = lvl() === 'calm', z = o.zeta || .86; return { tw: !!o.ease || calm, D: calm ? d * .6 : d, Z: z, W: 4.6 / (z * d / 1000) }; }
  function draw(s) {
    s.st.style.transform = 'translateY(' + (-md(s.x) * 100 / 11).toFixed(3) + '%)';
    if (o.blur) { var b = Math.min(1, Math.max(0, Math.abs(s.vel || 0) - 4) / 26), c = 'color-mix(in srgb, currentColor ' + Math.round(50 * b) + '%, transparent)';
      s.st.style.textShadow = b > .03 ? '0 ' + (-.2 * b).toFixed(3) + 'em ' + (.06 * b).toFixed(3) + 'em ' + c + ', 0 ' + (.2 * b).toFixed(3) + 'em ' + (.06 * b).toFixed(3) + 'em ' + c : ''; }
  }
  function tick(t) {
    var c = cfg(), dt = Math.min(.032, Math.max(.001, (t - last) / 1000)), busy = false; last = t;
    order.forEach(function (s) {
      if (!s.st) return;
      if (s.at && t >= s.at) { s.at = 0; s.T = s.g; s.f = s.x; s.t0 = t; }
      var px = s.x;
      if (s.at) busy = true;
      else if (c.tw) { var k = Math.min(1, (t - s.t0) / c.D); s.x = k >= 1 ? s.T : s.f + (s.T - s.f) * TLez(k); s.v = 0; if (k < 1) busy = true; }
      else if (s.x !== s.T || s.v) { var a = -c.W * c.W * (s.x - s.T) - 2 * c.Z * c.W * s.v; s.v += a * dt; s.x += s.v * dt; if (Math.abs(s.x - s.T) < .003 && Math.abs(s.v) < .05) { s.x = s.T; s.v = 0; } else busy = true; }
      s.vel = (s.x - px) / dt;
      var on = s.x !== s.T || !!s.at;
      if (o.lift && s.on !== on) { s.on = on; s.el.classList.toggle('is-roll', on); }
      if (!on) { var w = s.T - md(s.T); if (w) { s.x -= w; s.T -= w; s.g -= w; s.f -= w; } }
      draw(s);
    });
    raf = busy ? requestAnimationFrame(tick) : 0;
  }
  function wid(e) { return e.getBoundingClientRect().width; }
  function kill(s) { if (s.wa) s.wa.cancel(); s.el.remove(); var i = order.indexOf(s); if (i >= 0) order.splice(i, 1); if (slots[s.k] === s) delete slots[s.k]; }
  function leave(s, mv, sl) {
    s.gone = true; if (!mv) { kill(s); return; }
    var w = wid(s.el); if (s.wa) s.wa.cancel();
    s.wa = s.el.animate([{ width: w + 'px', opacity: 1 }, { opacity: 0, offset: .55 }, { width: '0px', opacity: 0 }], { duration: 420 * sl, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
    s.wa.onfinish = function () { if (s.gone) kill(s); };
  }
  function grow(s, w0, sl) { var w1 = wid(s.el); if (w1 - w0 > .5) s.wa = s.el.animate([{ width: w0 + 'px', opacity: w0 / w1 }, { opacity: w0 / w1, offset: .3 }, { width: w1 + 'px', opacity: 1 }], { duration: 460 * sl, easing: 'cubic-bezier(.22,1,.36,1)' }); }
  function set(v, so) {
    so = so || {};
    var old = api.value; api.value = v;
    var dir = so.dir === 'up' ? 1 : so.dir === 'down' ? -1 : v >= old ? 1 : -1;
    var str = api.fmt(v), toks = parse(str), now = performance.now(), mv = built && moving() && !so.instant, sl = window.TLrollSlow || 1, keep = {}, rk = 0, j, s, cd;
    sr.textContent = o.say ? o.say(v, str) : str;
    toks.forEach(function (t) {
      var s = slots[t.k]; keep[t.k] = 1;
      if (!s) {
        s = slots[t.k] = mk(t);
        var nx = null; for (var i = 0; i < order.length; i++) if (order[i].r > s.r) { nx = order[i]; break; }
        vis.insertBefore(s.el, nx ? nx.el : null); order.splice(nx ? order.indexOf(nx) : order.length, 0, s);
        if (mv) { s.el.style.width = '0px'; s.enter = true; }
      } else if (s.gone) { s.gone = false; var w0 = wid(s.el); if (s.wa) s.wa.cancel(); s.wa = null; if (mv) grow(s, w0, sl); }
    });
    order.slice().forEach(function (s) {
      if (keep[s.k] || s.gone) return;
      if (s.st) { var c0 = md(s.g); if (c0) { s.g += dir > 0 ? md(-c0) : -c0; if (mv) { s.at = 0; s.T = s.g; s.f = s.x; s.t0 = now; } } }
      leave(s, mv, sl);
    });
    order.forEach(function (s) { if (s.enter) { s.enter = false; s.el.style.width = ''; grow(s, 0, sl); } });
    for (j = toks.length - 1; j >= 0; j--) {
      var t = toks[j]; if (t.d == null) continue; s = slots[t.k];
      cd = md(s.g); if (cd === t.d) continue;
      var g = s.g + (dir > 0 ? md(t.d - cd) : -md(cd - t.d));
      if (!mv) { s.x = s.T = s.g = s.f = g; s.v = 0; s.at = 0; draw(s); continue; }
      s.g = g; var dl = (o.stagger == null ? 30 : o.stagger) * rk++ * sl;
      if (dl > 0) s.at = now + dl; else { s.at = 0; s.T = g; s.f = s.x; s.t0 = now; }
    }
    if (!mv) { order.forEach(function (s) { if (s.st) { s.x = s.T = s.g; s.v = 0; s.at = 0; draw(s); if (s.on) { s.on = false; s.el.classList.remove('is-roll'); } } });
      if (built && old !== v && !so.instant) vis.animate([{ opacity: .3 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' }); }
    else if (!raf) { last = now; raf = requestAnimationFrame(tick); }
    return api;
  }
  api.set = set;
  set(api.value, { instant: true }); built = true;
  return api;
};
/* A short line that rolls in from the side the number moved (dir 1 = up: in from below). */
window.TLline = function (el) {
  el.classList.add('tll'); var cur = document.createElement('span'); cur.textContent = el.textContent; el.textContent = ''; el.appendChild(cur);
  return { set: function (txt, dir) {
    if (cur.textContent === txt) return; var old = cur; cur = document.createElement('span'); cur.textContent = txt; el.appendChild(cur);
    if (!moving() || !old.textContent) { old.remove(); return; }
    var y = dir < 0 ? -1 : 1, a = { duration: 440 * (window.TLrollSlow || 1), easing: 'cubic-bezier(.22,1,.36,1)' };
    old.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(' + (-y * 80) + '%)', opacity: 0 }], a).onfinish = function () { old.remove(); };
    cur.animate([{ transform: 'translateY(' + (y * 80) + '%)', opacity: 0 }, { transform: 'none', opacity: 1 }], a);
  } };
};
/* The house monotone curve: passes through every point, never overshoots. */
window.TLmono = function (p) {
  var n = p.length, i, d = [], m = [], s = 'M' + p[0][0].toFixed(1) + ' ' + p[0][1].toFixed(1);
  if (n < 2) return s;
  for (i = 0; i < n - 1; i++) d.push((p[i + 1][1] - p[i][1]) / (p[i + 1][0] - p[i][0]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (i = 0; i < n - 1; i++) { if (!d[i]) { m[i] = m[i + 1] = 0; continue; } var a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b; if (h > 9) { var t = 3 / Math.sqrt(h); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; } }
  for (i = 0; i < n - 1; i++) { var dx = (p[i + 1][0] - p[i][0]) / 3; s += 'C' + (p[i][0] + dx).toFixed(1) + ' ' + (p[i][1] + m[i] * dx).toFixed(1) + ' ' + (p[i + 1][0] - dx).toFixed(1) + ' ' + (p[i + 1][1] - m[i + 1] * dx).toFixed(1) + ' ' + p[i + 1][0].toFixed(1) + ' ' + p[i + 1][1].toFixed(1); }
  return s;
};
window.TLkes = function (n) { return 'KES ' + Math.round(n).toLocaleString('en-KE'); };
/* Run fn once when el is 40% on screen; at once with motion off. */
window.TLonView = function (el, fn, th) {
  if (!moving() || !('IntersectionObserver' in window)) { fn(); return; }
  var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); fn(); } }, { threshold: th || .4 });
  io.observe(el);
};
/* Our n07 as it is today: each digit strip slides straight to its place in 0.5 s. */
window.TLn07 = function (el, o) {
  var api = { value: o.value, el: el }, shape = '', cols = [];
  el.classList.add('n7'); el.textContent = '';
  var vis = document.createElement('span'); vis.className = 'n7-v'; vis.setAttribute('aria-hidden', 'true');
  var sr = document.createElement('span'); sr.className = 'sr'; sr.setAttribute('aria-live', 'polite');
  el.appendChild(vis); el.appendChild(sr);
  api.set = function (v) {
    api.value = v; var s = o.fmt(v), sh = s.replace(/[0-9]/g, '0'), dg = s.replace(/[^0-9]/g, ''), sl = window.TLrollSlow || 1;
    sr.textContent = s;
    if (sh !== shape) { shape = sh; vis.innerHTML = ''; cols = [];
      for (var i = 0; i < s.length; i++) { var ch = s.charAt(i), e = document.createElement('span');
        if (ch >= '0' && ch <= '9') { e.className = 'n7-c'; e.innerHTML = '<span class="n7-st"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span></span>'; cols.push(e.firstChild); e.firstChild.style.transition = 'none'; }
        else { e.className = 'n7-s' + (/[A-Za-z]/.test(ch) ? ' n7-a' : ''); e.textContent = ch === ' ' ? ' ' : ch; }
        vis.appendChild(e); }
    }
    cols.forEach(function (c, k) { var y = 'translateY(' + (-dg.charAt(k) * 10) + '%)'; if (c.style.transition === 'none') { c.style.transform = y; c.offsetWidth; c.style.transition = ''; } c.style.transitionDuration = sl > 1 ? (lvl() === 'calm' ? .3 : .5) * sl + 's' : ''; c.style.transform = y; });
    return api;
  };
  api.set(o.value); return api;
};

/* ===== part 01: the shared controls and Run all ===== */
var cards = [];
window.TLrollCard = function (box, r) {
  var d = $('[data-d]', box), to = $('[data-to]', box);
  function go(v) { var dv = v - r.value; if (!dv) return; r.set(v); d.textContent = (dv > 0 ? 'Up ' : 'Down ') + TLkes(Math.abs(dv)); to.textContent = r.value === 1048300 ? 'Back to 12,480' : 'Jump to 1,048,300'; }
  $$('[data-add]', box).forEach(function (b) { b.addEventListener('click', function () { go(Math.max(0, r.value + Number(b.getAttribute('data-add')))); }); });
  to.addEventListener('click', function () { go(r.value === 1048300 ? 12480 : 1048300); });
  $('[data-rand]', box).addEventListener('click', function () { go(Math.round(Math.pow(10, 3 + Math.random() * 3.1) / 10) * 10); });
  cards.push(go);
};
var bar = document.createElement('div'); bar.className = 'rl-bar';
bar.innerHTML = '<button class="l-btn pri" type="button" data-all>Run all four</button><button class="l-btn" type="button" data-slow aria-pressed="false">Slow motion</button><p class="rl-st" data-st aria-live="polite">Plays the same changes in every card at once, so you can watch them side by side.</p>';
var optsEl = $('.opts', sec); optsEl.parentNode.insertBefore(bar, optsEl);
var STEPS = [[12480, 'back to KES 12,480'], [12830, '+KES 350'], [13180, '+KES 350'], [11980, '−KES 1,200'], [1048300, 'jump to KES 1,048,300'], [1047900, '−KES 400'], [12480, 'back to KES 12,480']];
var all = $('[data-all]', bar), slow = $('[data-slow]', bar), st = $('[data-st]', bar), tm = 0, k = 0;
function stop(msg) { clearTimeout(tm); tm = 0; all.textContent = 'Run all four'; if (msg) st.textContent = msg; }
function step() {
  var s = STEPS[k]; cards.forEach(function (go) { go(s[0]); });
  st.textContent = 'Step ' + (k + 1) + ' of ' + STEPS.length + ': ' + s[1] + '.'; k++;
  tm = setTimeout(k < STEPS.length ? step : function () { stop('Done. Run it again, or turn on Slow motion first.'); }, 1600 * (window.TLrollSlow || 1));
}
all.addEventListener('click', function () { if (tm) { stop('Stopped.'); return; } k = 0; all.textContent = 'Stop'; step(); });
slow.addEventListener('click', function () { var on = slow.getAttribute('aria-pressed') !== 'true'; slow.setAttribute('aria-pressed', String(on)); window.TLrollSlow = on ? 4 : 1; st.textContent = on ? 'Slow motion is on: every roll on the page takes four times as long.' : 'Slow motion is off.'; });`;

const roll = {
  id: 'roll', n: '01', name: 'Rolling number', h: 250,
  claim: 'A number should <em>roll the way it moved.</em>',
  lead: 'Our house roll (n07) against Arc’s odometer, on the same number. Every card has the same buttons. Run all four plays the same changes in every card at once. Slow motion makes each digit easy to follow.',
  ref: { ids: 'n07', text: 'Our number roll: each digit slides straight to its new place in 0.5 s, on our smooth curve.', url: SHOW + '#n07', label: 'Open n07' },
  noteHint: 'B, but with C’s speed', moreHint: 'a countdown clock that rolls',
  css: rollCss, js: rollJs,
  opts: [
    {
      k: 'B', name: 'An odometer that turns the way the number went', kind: 'Lively, after Arc',
      line: 'Each digit is a drum. Up turns it up, down turns it down, and 9 rolls on to 0. The right digit moves first. New digits slide in, so the width glides. It settles on a soft spring.',
      from: [arc('animated-counter'), arc('usage-meter'), house('n07')], tryit: 'Press +KES 350 a few times fast, then Jump.',
      needs: 'A small script with a spring per digit.', keys: 'Normal button keys. A screen reader hears only the final number.', off: 'The number swaps with a short fade.', law: 'Jakob: it moves like a car’s odometer.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: rlHtml, js: String.raw`TLrollCard(box, TLroll($('[data-num]', box), { value: 12480, fmt: TLkes, dur: 650, stagger: 30 }));`,
    },
    {
      k: 'A', name: 'Our n07, exactly as it is', kind: 'Ours today',
      line: 'Each digit strip slides straight to its new digit in 0.5 s. It takes the short way on the strip, so a 9 going to 0 rolls down even when the number went up. New digits just appear.',
      from: [house('n07')], tryit: 'Press +KES 350 until a 9 turns to 0. Then Jump.',
      needs: 'CSS transitions and a few lines of script.', keys: 'Normal button keys.', off: 'The digits jump.', law: 'Jakob: the kit’s roll today.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:familiar', 'look:ember'],
      html: rlHtml, js: String.raw`TLrollCard(box, TLn07($('[data-num]', box), { value: 12480, fmt: TLkes }));`,
    },
    {
      k: 'C', name: 'Our timing, with Arc’s direction', kind: 'Mix',
      line: 'Keeps our 0.5 s smooth curve with no spring, like n07. Adds what B does well: digits turn the way the number moved, the right one first, and the width glides when digits come and go.',
      from: [house('n07'), arc('animated-counter')], tryit: 'Press Jump, then Back, and compare with A.',
      needs: 'The same script as B, on our curve.', keys: 'Normal button keys.', off: 'The number swaps with a short fade.', law: 'Jakob: familiar timing, clearer direction.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: rlHtml, js: String.raw`TLrollCard(box, TLroll($('[data-num]', box), { value: 12480, fmt: TLkes, dur: 520, stagger: 24, ease: true }));`,
    },
    {
      k: 'D', name: 'The odometer, with a little weight', kind: 'Reference, pushed',
      line: 'B’s drums, plus two touches. A digit that spins fast gets a soft blur, like a real wheel. Digits that change lift a hair and turn orange while they move, then settle back.',
      from: [arc('animated-counter'), house('n07'), skill('animate')], tryit: 'Turn on Slow motion, then Jump to see the blur.',
      needs: 'B’s script and a text shadow while spinning.', keys: 'Normal button keys.', off: 'The number swaps with a short fade. No blur, no lift.', law: 'Proximity does little here. The eye goes to the digits that moved.',
      tags: ['motion:springy', 'speed:mid', 'feedback:loud', 'open:inplace', 'new:novel', 'look:ember'],
      html: rlHtml,
      css: String.raw`#t01D .tlr-c { transition: transform var(--sp-soft-d) var(--sp-soft), color .3s var(--ease-out); }
#t01D .tlr-c.is-roll { transform: translateY(-.06em); color: var(--accent); }`,
      js: String.raw`TLrollCard(box, TLroll($('[data-num]', box), { value: 12480, fmt: TLkes, dur: 700, stagger: 34, zeta: .84, blur: true, lift: true }));`,
    },
  ],
};

/* ================= 02 Usage meter ================= */
const meterCss = String.raw`
#meter .stage, #donut .stage, #spark .stage, #metric .stage { height: auto; min-height: var(--h); container-type: inline-size; }
.mt { width: min(100%, 440px); display: grid; gap: 14px; }
html[data-theme="dark"] .mt { --mt-mx: var(--ink); }
.mt-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.mt-h { min-width: 0; }
.mt-lbl { margin: 0; font: 500 11px/1.4 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.mt-big { margin: 2px 0 0; display: flex; align-items: baseline; gap: 6px; font: 400 46px/1 var(--font-num); color: var(--ink); }
.mt-u { font: 500 14px/1 var(--font-body); color: var(--muted); }
.mt-of { margin: 4px 0 0; min-height: 1.45em; font-size: 13px; line-height: 1.45; color: var(--muted); }
.mt-badge { flex: none; display: inline-flex; align-items: center; gap: 6px; overflow: hidden; white-space: nowrap; height: 26px; padding: 0 10px; margin-top: 2px; border-radius: 999px; font: 600 12px/1 var(--font-body); border: 1px solid var(--line-hi); color: var(--ink-soft); background: var(--paper-raised); transition: background-color .25s, color .25s, border-color .25s; }
.mt-badge::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex: none; }
.mt-badge[data-st="warn"] { color: var(--accent-text); background: rgb(var(--accent-rgb) / .1); border-color: rgb(var(--accent-rgb) / .32); }
.mt-badge[data-st="over"] { color: var(--on-accent); background: var(--accent-text); border-color: transparent; }
.mt-bar { position: relative; height: var(--bh, 12px); border-radius: var(--br, 999px); overflow: hidden; background: rgb(var(--ink-rgb) / .08); cursor: crosshair; touch-action: manipulation; }
.mt-bar:focus-visible { outline-offset: 4px; }
.mt-seg, .mt-gap, .mt-over, .mt-lim { position: absolute; inset: 0; transform-origin: 0 50%; pointer-events: none; }
.mt-seg { transition: opacity .2s var(--ease-out); }
.mt [data-s="0"] { background: var(--accent); }
.mt [data-s="1"] { background: color-mix(in oklab, var(--accent) 64%, var(--mt-mx, var(--paper-raised))); }
.mt [data-s="2"] { background: color-mix(in oklab, var(--accent) 40%, var(--mt-mx, var(--paper-raised))); }
.mt [data-s="3"] { background: color-mix(in oklab, var(--accent) 22%, var(--mt-mx, var(--paper-raised))); }
.mt .is-dim { opacity: .26; }
.mt-gap { background: linear-gradient(90deg, var(--paper) 2px, transparent 2px); margin-left: -1px; }
.mt-over { opacity: 0; background: repeating-linear-gradient(-45deg, var(--paper) 0 2px, transparent 2px 6px); transition: opacity .35s var(--ease-out); }
.mt-lim { opacity: 0; margin-left: -1px; background: linear-gradient(90deg, var(--ink) 2px, transparent 2px); transition: opacity .3s var(--ease-out); }
.mt-bar.is-over .mt-over, .mt-bar.is-over .mt-lim { opacity: 1; }
.mt-scale { display: flex; justify-content: space-between; margin: -8px 0 0; font: 500 10.5px/1 var(--font-mono); color: var(--muted); }
.mt-leg { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2px 10px; }
.mt-row { width: 100%; display: flex; align-items: center; gap: 8px; min-height: 36px; padding: 4px 8px; border-radius: 8px; font-size: 13.5px; color: var(--ink-soft); text-align: left; transition: background-color .15s, color .15s, box-shadow .15s; }
.mt-row:hover, .mt-row.is-on { background: rgb(var(--ink-rgb) / .06); color: var(--ink); }
.mt-row.is-pin { box-shadow: inset 0 0 0 1.5px var(--accent); }
.mt-sw { width: 10px; height: 10px; border-radius: 3px; flex: none; }
.mt-nm { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mt-v { font-family: var(--font-num); font-size: 16px; color: var(--ink); }
.mt-v .tlr-a { font: 500 .62em/1 var(--font-mono); color: var(--muted); }
.mt-ctl { display: flex; flex-wrap: wrap; gap: 8px; }
@media (pointer: coarse) { .mt-row { min-height: 44px; } }
/* one bar per GB */
.mt-bar.is-cells { display: flex; gap: 2px; height: 34px; overflow: visible; background: none; border-radius: 0; }
.mt-cell { flex: 1 1 0; min-width: 0; border-radius: 2px; background: rgb(var(--ink-rgb) / .1); transform: scaleY(.45); transform-origin: 50% 100%; transition: transform var(--sp-bouncy-d) var(--sp-bouncy), background-color .3s var(--ease-out), opacity .2s var(--ease-out); }
.mt-cell[data-s] { transform: none; }
.mt-cell[data-s="o"] { background: repeating-linear-gradient(-45deg, var(--accent-text) 0 1.5px, transparent 1.5px 4px); box-shadow: inset 0 0 0 1px var(--accent-text); }
.mt-lm { flex: 0 0 2px; margin: -5px 2px; border-radius: 1px; background: var(--ink); }`;

const meterJs = String.raw`
window.TLmeter = function (box, c) {
  c = c || {};
  var LIM = 50, WARN = .85, CAP = 58, N = 4, cells = c.shape === 'cells';
  var segs = [['Photos', 16.2], ['Backups', 11.4], ['Receipts', 7.3], ['Other', 3.4]].map(function (s) { return { n: s[0], v: s[1] }; });
  function r1(n) { return Math.round(n * 10) / 10; }
  function f1(n) { return r1(n).toFixed(1); }
  var m = $('[data-mt]', box), k, barIn = '';
  if (cells) for (k = 0; k < 60; k++) barIn += (k === LIM ? '<i class="mt-lm" aria-hidden="true"></i>' : '') + '<i class="mt-cell"></i>';
  else barIn = segs.map(function (s, i) { return '<i class="mt-seg" data-s="' + i + '"></i>'; }).join('') + '<i class="mt-gap"></i><i class="mt-gap"></i><i class="mt-gap"></i><i class="mt-over"></i><i class="mt-lim"></i>';
  m.innerHTML = '<div class="mt-top"><div class="mt-h"><p class="mt-lbl" data-lbl>Storage used</p><p class="mt-big"><span data-num></span><span class="mt-u">GB</span></p><p class="mt-of" data-of>of 50 GB</p></div><span class="mt-badge" data-badge><span data-bt>On track</span></span></div>'
    + '<div class="mt-bar' + (cells ? ' is-cells' : '') + '" data-bar tabindex="0" role="meter" aria-valuemin="0" aria-valuemax="' + LIM + '" aria-label="Storage used. Arrow keys read each kind.">' + barIn + '</div>'
    + (c.scale ? '<p class="mt-scale" aria-hidden="true">' + (cells ? '<span>Each bar is 1 GB</span><span>Line: 50 GB limit</span>' : '<span>0</span><span>50 GB</span>') + '</p>' : '')
    + '<ul class="mt-leg">' + segs.map(function (s, i) { return '<li><button class="mt-row" type="button" data-i="' + i + '"' + (c.pin ? ' aria-pressed="false"' : '') + '><i class="mt-sw" data-s="' + i + '"></i><span class="mt-nm">' + s.n + '</span><span class="mt-v" data-v></span></button></li>'; }).join('') + '</ul>'
    + '<div class="mt-ctl"><button class="l-btn sm" type="button" data-add>Add 3 GB of photos</button><button class="l-btn sm" type="button" data-free>Free 3 GB</button></div><p class="sr" aria-live="polite" data-say></p>';
  var bar = $('[data-bar]', m), lbl = $('[data-lbl]', m), of = $('[data-of]', m), bdg = $('[data-badge]', m), bt = $('[data-bt]', m), say = $('[data-say]', m), rows = $$('.mt-row', m);
  var num = TLroll($('[data-num]', m), { value: 0, fmt: f1, dur: 640, live: false });
  var vals = rows.map(function (r, i) { return TLroll($('[data-v]', r), { value: segs[i].v, fmt: function (n) { return f1(n) + ' GB'; }, dur: 520, live: false }); });
  var segEls = $$('.mt-seg', bar), gapEls = $$('.mt-gap', bar), over = $('.mt-over', bar), lim = $('.mt-lim', bar), cellEls = $$('.mt-cell', bar);
  function tot() { var t = 0; segs.forEach(function (s) { t += s.v; }); return r1(t); }
  function geo() { var t = tot(), D = Math.max(LIM, t), cum = 0, a = segs.map(function (s) { cum += s.v; return cum / D; }); a.push(LIM / D); return a; }
  var vec = cells ? null : TLvec([0, 0, 0, 0, 1], function (x) {
    var p = 0; segEls.forEach(function (e, i) { var b = Math.max(p, x[i]); e.style.transform = 'translateX(' + (p * 100).toFixed(3) + '%) scaleX(' + Math.max(0, b - p).toFixed(4) + ')'; p = b; });
    gapEls.forEach(function (g, i) { g.style.transform = 'translateX(' + (x[i] * 100).toFixed(3) + '%)'; g.style.opacity = x[i + 1] - x[i] > .004 && x[i] > .004 ? 1 : 0; });
    over.style.transform = lim.style.transform = 'translateX(' + (x[N] * 100).toFixed(3) + '%)';
  }, { dur: 640, zeta: .8 });
  function paint(wave) {
    var cum = [], s = 0, t = tot(); segs.forEach(function (x) { s += x.v; cum.push(s); });
    cellEls.forEach(function (e, k) {
      var mid = k + .5, st = '', g = '';
      if (mid < t) { for (var i = 0; i < N; i++) if (mid < cum[i]) { g = String(i); break; } st = k >= LIM ? 'o' : g; }
      e.style.transitionDelay = wave ? (k * 16 * (window.TLrollSlow || 1)) + 'ms' : '';
      if (st) e.setAttribute('data-s', st); else e.removeAttribute('data-s');
      if (g) e.setAttribute('data-g', g); else e.removeAttribute('data-g');
    });
    if (wave) setTimeout(function () { cellEls.forEach(function (e) { e.style.transitionDelay = ''; }); }, 1400 * (window.TLrollSlow || 1));
  }
  var act = -1, pin = -1, seen = false;
  function dim() {
    segEls.forEach(function (e, j) { e.classList.toggle('is-dim', act >= 0 && j !== act); });
    cellEls.forEach(function (e) { e.classList.toggle('is-dim', act >= 0 && e.getAttribute('data-g') !== String(act)); });
    rows.forEach(function (r, j) { r.classList.toggle('is-on', j === act); });
  }
  function swap(el, txt) { if (el.textContent === txt) return; el.textContent = txt; if (moving()) el.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(.22,1,.36,1)' }); }
  function head() {
    var t = tot(), i = c.hover === 'list' ? -1 : act;
    if (i < 0) { swap(lbl, 'Storage used'); if (seen) num.set(t); swap(of, !seen ? 'of 50 GB' : t > LIM ? f1(t - LIM) + ' GB over your 50 GB plan' : 'of 50 GB · ' + f1(LIM - t) + ' GB free'); }
    else { swap(lbl, segs[i].n); num.set(segs[i].v); swap(of, Math.round(segs[i].v / t * 100) + '% of what you use'); }
  }
  function show(i) { if (i === act) return; act = i; dim(); head(); }
  function badge() {
    var t = tot(), s = t > LIM ? 'over' : t >= LIM * WARN ? 'warn' : 'ok';
    bar.classList.toggle('is-over', s === 'over');
    if (bdg.getAttribute('data-st') === s) return;
    var w0 = bdg.offsetWidth, first = !bdg.getAttribute('data-st'); bdg.setAttribute('data-st', s); bt.textContent = { ok: 'On track', warn: 'Near limit', over: 'Over limit' }[s];
    var w1 = bdg.offsetWidth;
    if (moving() && !first && w0 !== w1) { var sp = TLsp('bouncy'); bdg.animate([{ width: w0 + 'px' }, { width: w1 + 'px' }], { duration: sp.d, easing: sp.e }); bt.animate([{ opacity: 0, transform: 'translateY(70%)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' }); }
  }
  function update(wave) {
    var t = tot();
    if (cells) { paint(wave); dim(); } else vec.to(geo(), wave ? { delay: function (i) { return i < N ? i * 110 : 0; } } : null);
    vals.forEach(function (r, i) { r.set(segs[i].v); });
    badge(); head();
    bar.setAttribute('aria-valuenow', String(Math.min(t, LIM))); bar.setAttribute('aria-valuetext', f1(t) + ' GB of 50 GB used. ' + bt.textContent + '.');
    $('[data-free]', m).disabled = t < 3; $('[data-add]', m).disabled = t + 3 > CAP;
  }
  function rest() { show(pin); }
  function segAt(e) {
    var r = bar.getBoundingClientRect(), t = tot(), fx = (e.clientX - r.left) / r.width * (cells ? 60 : Math.max(LIM, t));
    if (fx < 0 || fx > t) return -1; var cum = 0; for (var i = 0; i < N; i++) { cum += segs[i].v; if (fx <= cum) return i; } return -1;
  }
  function setPin(i) { pin = i; rows.forEach(function (r, j) { if (c.pin) r.setAttribute('aria-pressed', String(j === i)); r.classList.toggle('is-pin', j === i); }); show(i); }
  bar.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') show(segAt(e)); });
  bar.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') rest(); });
  bar.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') show(segAt(e)); });
  bar.addEventListener('click', function (e) { if (!c.pin) return; var i = segAt(e); setPin(i === pin ? -1 : i); });
  document.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' && !m.contains(e.target)) rest(); });
  bar.addEventListener('keydown', function (e) {
    var key = e.key, i = act;
    if (key === 'ArrowRight' || key === 'ArrowDown') i = Math.min(N - 1, i + 1);
    else if (key === 'ArrowLeft' || key === 'ArrowUp') i = Math.max(0, i - 1);
    else if (key === 'Home') i = 0; else if (key === 'End') i = N - 1;
    else if (key === 'Escape') { setPin(-1); return; }
    else if ((key === 'Enter' || key === ' ') && c.pin && act >= 0) { e.preventDefault(); setPin(act === pin ? -1 : act); return; }
    else return;
    e.preventDefault(); show(i);
  });
  bar.addEventListener('blur', rest);
  rows.forEach(function (r, i) {
    r.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') show(i); });
    r.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !r.matches(':focus-visible')) rest(); });
    r.addEventListener('focus', function () { if (r.matches(':focus-visible')) show(i); });
    r.addEventListener('blur', function () { setTimeout(function () { var a = document.activeElement; if (!a || !a.closest || !a.closest('.mt-row') || !m.contains(a)) rest(); }, 0); });
    r.addEventListener('click', function () { if (c.pin) setPin(pin === i ? -1 : i); else show(i); });
    r.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setPin(-1); return; }
      var j = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: N - 1 }[e.key];
      if (j == null) return; e.preventDefault(); rows[(j + N) % N].focus();
    });
  });
  $('[data-add]', m).addEventListener('click', function () { segs[0].v = r1(segs[0].v + 3); update(); say.textContent = 'Added 3 GB of photos. ' + bar.getAttribute('aria-valuetext'); });
  $('[data-free]', m).addEventListener('click', function () { var need = 3; [1, 3, 2, 0].forEach(function (i) { var take = Math.min(segs[i].v, need); segs[i].v = r1(segs[i].v - take); need = r1(need - take); }); update(); say.textContent = 'Freed 3 GB. ' + bar.getAttribute('aria-valuetext'); });
  badge();
  TLonView(m, function () { seen = true; update(true); });
};`;

const mtHtml = '<div class="mt" data-mt></div>';
const meter = {
  id: 'meter', n: '02', name: 'Usage meter', h: 360,
  claim: 'A meter should show <em>what fills the space</em> as you point at it.',
  lead: 'A PocketPay till keeps photos, backups and receipts in 50 GB. Point at a part of the bar or a row: the big number rolls to that part, then back. Add space until it goes over the limit.',
  ref: { ids: 'n47', text: 'Progress bar that springs: the orange fill moves on a spring and the percent counts up.', url: SHOW + '#n47', label: 'Open n47' },
  noteHint: 'B’s hover, with D’s bars', moreHint: 'a meter for SMS credits that resets each month',
  css: meterCss, js: meterJs,
  opts: [
    {
      k: 'B', name: 'Point at a part and the number rolls to it', kind: 'Lively, after Arc',
      line: 'The parts grow in from the left when you scroll to it. Pointing at a part, or a row, rolls the big number to that part and dims the rest. The badge springs to its new width.',
      from: [arc('usage-meter'), house('n47'), house('n07')], tryit: 'Point along the bar. Then add 3 GB four times.',
      needs: 'TLroll and a spring for the bar.', keys: 'Tab to the bar, then arrow keys read each part. Tab to a row to read it. Escape goes back.', off: 'Everything is drawn at once. The number swaps.', law: 'Proximity: the number you read is right above the part you point at.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: mtHtml, css: String.raw`#t02B .mt { --bh: 14px; }`, js: String.raw`TLmeter(box, { hover: 'roll' });`,
    },
    {
      k: 'A', name: 'A thin bar with a plain list', kind: 'Plain',
      line: 'The shadcn way: a thin bar and a list of numbers. Pointing at a part lights it and its row. The big number always shows the total and only rolls when the total changes.',
      from: [['shadcn/ui progress', 'https://ui.shadcn.com/docs/components/progress'], arc('usage-meter')], tryit: 'Point at a part, then free 3 GB.',
      needs: 'TLroll and a spring for the bar.', keys: 'Arrow keys on the bar light each part.', off: 'Everything is drawn at once.', law: 'Jakob: looks like every storage page.',
      tags: ['motion:some', 'speed:mid', 'density:compact', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: mtHtml, css: String.raw`#t02A .mt { --bh: 7px; gap: 12px; }
#t02A .mt-big { font-size: 38px; }`, js: String.raw`TLmeter(box, { hover: 'list' });`,
    },
    {
      k: 'C', name: 'Click a part to keep it', kind: 'Mix',
      line: 'A thick bar with square ends. Pointing previews a part, like B. Clicking a part or a row keeps it in the big number, with an orange ring on its row, until you click it again or press Escape.',
      from: [arc('usage-meter'), house('n46')], tryit: 'Click Backups, then point at other parts and leave.',
      needs: 'TLroll and a spring for the bar.', keys: 'Arrow keys read parts. Enter keeps one. Escape lets go.', off: 'Everything is drawn at once.', law: 'Hick: one part held still while you think.',
      tags: ['motion:springy', 'speed:mid', 'density:roomy', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: mtHtml, css: String.raw`#t02C .mt { --bh: 26px; --br: 7px; }
#t02C .mt-gap { background: linear-gradient(90deg, var(--paper) 3px, transparent 3px); margin-left: -1.5px; }`, js: String.raw`TLmeter(box, { hover: 'roll', pin: true, scale: true });`,
    },
    {
      k: 'D', name: 'One small bar for every gigabyte', kind: 'Reference, pushed',
      line: 'Our spring progress bar (n47), pushed: 50 small bars, one per GB, pop up one after another. A line marks the 50 GB limit. Past it, the bars are striped, so going over is clear without colour.',
      from: [house('n47'), arc('usage-meter'), house('n07')], tryit: 'Add 3 GB until the striped bars appear past the line.',
      needs: 'TLroll and CSS springs.', keys: 'Arrow keys on the bars read each part.', off: 'All the bars show at once.', law: 'Proximity: the limit line sits right where the space runs out.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'open:inplace', 'new:novel', 'look:ember'],
      html: mtHtml, js: String.raw`TLmeter(box, { hover: 'roll', shape: 'cells', scale: true });`,
    },
  ],
};

/* ================= 03 Donut ================= */
const donutCss = String.raw`
.dn { width: min(100%, 460px); display: grid; gap: 14px; }
.dn-seg, .me-sw { position: relative; display: grid; grid-auto-columns: minmax(0, 1fr); grid-auto-flow: column; padding: 3px; border-radius: 10px; background: rgb(var(--ink-rgb) / .06); border: 1px solid var(--line); justify-self: start; }
.dn-seg button, .me-sw button { position: relative; z-index: 1; padding: 0 12px; height: 30px; border-radius: 7px; font-size: 13px; font-weight: 500; color: var(--muted); white-space: nowrap; transition: color .2s, transform .15s var(--ease-out); }
.dn-seg button:active, .me-sw button:active { transform: scale(.97); }
.dn-seg button[aria-checked="true"], .me-sw button[aria-checked="true"] { color: var(--ink); }
.dn-pill, .me-pill { position: absolute; top: 3px; bottom: 3px; left: 3px; width: calc((100% - 6px) / var(--n, 2)); border-radius: 7px; background: var(--paper-raised); box-shadow: 0 1px 2px rgb(0 0 0 / .1), 0 0 0 1px var(--line); transform: translateX(calc(var(--i, 0) * 100%)); transition: transform var(--sp-snappy-d) var(--sp-snappy); }
.dn-main { display: grid; grid-template-columns: minmax(0, 200px) minmax(0, 1fr); gap: 18px; align-items: center; }
@container (max-width: 400px) { .dn-main { grid-template-columns: minmax(0, 1fr); justify-items: center; gap: 10px; } .dn-leg { width: 100%; } }
.dn-fig { position: relative; width: 100%; max-width: 200px; border-radius: 50%; cursor: crosshair; touch-action: manipulation; }
.dn-fig:focus-visible { outline-offset: 2px; }
.dn-fig svg { width: 100%; height: auto; overflow: visible; }
.dn-fig path { fill: none; stroke-linecap: butt; transition: opacity .2s var(--ease-out); }
.dn-fig path.is-dim { opacity: .25; }
.dn-tr { fill: none; stroke: rgb(var(--ink-rgb) / .06); }
.dn [data-c="0"] { stroke: var(--accent); background: var(--accent); }
.dn [data-c="1"] { stroke: rgb(var(--ink-rgb) / .64); background: rgb(var(--ink-rgb) / .64); }
.dn [data-c="2"] { stroke: rgb(var(--ink-rgb) / .44); background: rgb(var(--ink-rgb) / .44); }
.dn [data-c="3"] { stroke: rgb(var(--ink-rgb) / .28); background: rgb(var(--ink-rgb) / .28); }
.dn [data-c="4"] { stroke: rgb(var(--ink-rgb) / .15); background: rgb(var(--ink-rgb) / .15); }
.dn-c { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; text-align: center; pointer-events: none; padding: 0 22%; }
.dn-l { margin: 0; max-width: 100%; font: 500 10px/1.3 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); white-space: nowrap; }
.dn-v { margin: 3px 0 2px; font: 400 26px/1 var(--font-num); color: var(--ink); }
.dn-v .tlr-a { font: 500 .44em/1 var(--font-mono); color: var(--muted); letter-spacing: .04em; }
.dn-s { margin: 0; font-size: 11px; color: var(--muted); white-space: nowrap; }
.dn-leg { list-style: none; margin: 0; padding: 0; display: grid; gap: 1px; min-width: 0; }
.dn-row { width: 100%; display: flex; align-items: center; gap: 9px; min-height: 34px; padding: 3px 8px; border-radius: 8px; font-size: 13.5px; color: var(--ink-soft); text-align: left; transition: background-color .15s, color .15s, box-shadow .15s; }
.dn-row:hover, .dn-row.is-on { background: rgb(var(--ink-rgb) / .06); color: var(--ink); }
.dn-row.is-pin { box-shadow: inset 0 0 0 1.5px var(--accent); }
.dn-sw { width: 10px; height: 10px; border-radius: 3px; flex: none; }
.dn-nm { flex: 1; min-width: 0; }
.dn-rv { font-family: var(--font-num); font-size: 15px; color: var(--ink); }
.dn-rv .tlr-a { font: 500 .6em/1 var(--font-mono); color: var(--muted); }
@media (pointer: coarse) { .dn-row { min-height: 44px; } .dn-seg button, .me-sw button { height: 40px; } }`;

const donutJs = String.raw`
/* A row of choices with one sliding pill (equal widths, so only transform moves). */
window.TLseg = function (wrap, names, pick, o) {
  o = o || {}; var cls = o.cls || 'dn';
  wrap.innerHTML = '<i class="' + cls + '-pill" aria-hidden="true"></i>' + names.map(function (n, i) { return '<button type="button" role="radio" aria-checked="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' + n + '</button>'; }).join('');
  var bs = $$('button', wrap), pill = wrap.firstChild, cur = 0; pill.style.setProperty('--n', names.length);
  function go(i, focus) { if (focus) bs[i].focus(); if (i === cur) return; cur = i; bs.forEach(function (b, j) { b.setAttribute('aria-checked', String(j === i)); b.tabIndex = j === i ? 0 : -1; }); pill.style.setProperty('--i', i); pick(i); }
  bs.forEach(function (b, i) { b.addEventListener('click', function () { go(i); });
    b.addEventListener('keydown', function (e) { var j = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: bs.length - 1 }[e.key]; if (j == null) return; e.preventDefault(); go((j + bs.length) % bs.length, true); }); });
  return { go: go };
};
window.TLdonut = function (box, c) {
  c = c || {};
  var NM = ['Rent', 'Food', 'Transport', 'Fun', 'Airtime'], MON = [['October', [25000, 18400, 9600, 6100, 2300]], ['November', [25000, 15200, 12800, 9400, 3100]]], mi = 0, N = 5;
  var half = !!c.half, CX = 100, CY = half ? 104 : 100, R = half ? 82 : 76, TH = half ? 20 : 22, A0 = half ? -Math.PI / 2 : 0, SPAN = half ? Math.PI : Math.PI * 2, PAD = .02;
  var el = $('[data-dn]', box);
  function arcD(r, a, e) { function p(t) { return (CX + r * Math.sin(t)).toFixed(2) + ' ' + (CY - r * Math.cos(t)).toFixed(2); } return 'M' + p(a) + 'A' + r + ' ' + r + ' 0 ' + (e - a > Math.PI ? 1 : 0) + ' 1 ' + p(e); }
  el.innerHTML = '<div class="dn-seg" role="radiogroup" aria-label="Month"></div>'
    + '<div class="dn-main"><div class="dn-fig" data-fig tabindex="0" role="group" aria-roledescription="chart" aria-label="Spending by kind. Arrow keys read each kind.' + (c.pin ? ' Enter keeps one.' : '') + '"><svg viewBox="0 0 200 ' + (half ? 116 : 200) + '" aria-hidden="true">'
    + '<path class="dn-tr" d="' + (half ? arcD(R, A0, A0 + SPAN) : arcD(R, 0, Math.PI * 1.999)) + '" style="stroke-width:' + TH + 'px"/>'
    + NM.map(function (n, i) { return '<path data-c="' + i + '"/>'; }).join('') + '</svg>'
    + '<div class="dn-c"' + (half ? ' style="place-content:end center;padding-bottom:0"' : '') + '><p class="dn-l" data-l></p><p class="dn-v" data-v></p><p class="dn-s" data-sub></p></div></div>'
    + '<ul class="dn-leg">' + NM.map(function (n, i) { return '<li><button class="dn-row" type="button"' + (c.pin ? ' aria-pressed="false"' : '') + '><i class="dn-sw" data-c="' + i + '"></i><span class="dn-nm">' + n + '</span><span class="dn-rv" data-rv></span></button></li>'; }).join('') + '</ul></div><p class="sr" aria-live="polite" data-say></p>';
  if (half) el.querySelector('.dn-fig').style.borderRadius = '12px';
  var fig = $('[data-fig]', el), svg = $('svg', fig), P = $$('path[data-c]', svg), rows = $$('.dn-row', el), l = $('[data-l]', el), sub = $('[data-sub]', el), say = $('[data-say]', el);
  var val = TLroll($('[data-v]', el), { value: 0, fmt: TLkes, dur: 600, live: false });
  var rv = rows.map(function (r, i) { return TLroll($('[data-rv]', r), { value: MON[0][1][i], fmt: TLkes, dur: 520, live: false }); });
  function data() { return MON[mi][1]; }
  function total() { return data().reduce(function (a, b) { return a + b; }, 0); }
  function bounds() { var t = total(), s = 0, b = [0]; data().forEach(function (v) { s += v; b.push(s / t); }); return b; }
  var B = bounds(), act = -1, pin = -1, seen = false, lift = c.mode === 'lift';
  var vec = TLvec([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], function (x) {
    for (var i = 0; i < N; i++) {
      var a = A0 + x[i] * SPAN + PAD, e = A0 + x[i + 1] * SPAN - PAD, k = x[N + 1 + i], mid = (a + e) / 2;
      P[i].setAttribute('d', e - a > .004 ? arcD(R + 1.5 * k, a, e) : 'M0 0');
      P[i].setAttribute('transform', 'translate(' + (Math.sin(mid) * 5 * k).toFixed(2) + ' ' + (-Math.cos(mid) * 5 * k).toFixed(2) + ')');
      P[i].style.strokeWidth = (TH + 6 * k).toFixed(2) + 'px';
    }
  }, { dur: 720, zeta: .8 });
  function lifts() { return NM.map(function (n, i) { return lift && i === act ? 1 : 0; }); }
  function swap(e, txt) { if (e.textContent === txt) return; e.textContent = txt; if (moving()) e.animate([{ opacity: 0, transform: 'translateY(3px)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: 'cubic-bezier(.22,1,.36,1)' }); }
  function centre() {
    if (act < 0) { swap(l, MON[mi][0]); if (seen) val.set(total()); swap(sub, 'spent in all'); }
    else { swap(l, NM[act]); val.set(data()[act]); swap(sub, Math.round(data()[act] / total() * 100) + '% of the month'); }
  }
  function show(i) {
    if (i === act) return; act = i;
    P.forEach(function (p, j) { p.classList.toggle('is-dim', !lift && i >= 0 && j !== i); });
    rows.forEach(function (r, j) { r.classList.toggle('is-on', j === i); });
    if (seen) vec.to(B.concat(lifts())); centre();
  }
  function setPin(i) { pin = i; rows.forEach(function (r, j) { r.setAttribute('aria-pressed', String(j === i)); r.classList.toggle('is-pin', j === i); }); show(i); say.textContent = i < 0 ? 'Showing the whole month.' : NM[i] + ' kept: ' + TLkes(data()[i]) + '.'; }
  function rest() { show(c.pin ? pin : -1); }
  function segAt(e) {
    var r = svg.getBoundingClientRect(), k = 200 / r.width, x = (e.clientX - r.left) * k - CX, y = (e.clientY - r.top) * k - CY, d = Math.sqrt(x * x + y * y);
    if (d < R - TH / 2 - 10 || d > R + TH / 2 + 14) return -1;
    var t = Math.atan2(x, -y); if (!half && t < 0) t += Math.PI * 2;
    var f = (t - A0) / SPAN; if (f < 0 || f > 1) return -1;
    for (var i = 0; i < N; i++) if (f <= B[i + 1]) return i; return -1;
  }
  fig.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') show(segAt(e)); });
  fig.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') rest(); });
  fig.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' && !c.pin) show(segAt(e)); });
  fig.addEventListener('click', function (e) { if (!c.pin) return; var i = segAt(e); setPin(i === pin ? -1 : i); });
  document.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' && !el.contains(e.target)) rest(); });
  fig.addEventListener('keydown', function (e) {
    var key = e.key, i = act;
    if (key === 'ArrowRight' || key === 'ArrowDown') i = (i + 1) % N;
    else if (key === 'ArrowLeft' || key === 'ArrowUp') i = i <= 0 ? N - 1 : i - 1;
    else if (key === 'Home') i = 0; else if (key === 'End') i = N - 1;
    else if (key === 'Escape') { if (c.pin) setPin(-1); else show(-1); return; }
    else if ((key === 'Enter' || key === ' ') && c.pin && act >= 0) { e.preventDefault(); setPin(act === pin ? -1 : act); return; }
    else return;
    e.preventDefault(); show(i);
  });
  fig.addEventListener('blur', rest);
  rows.forEach(function (r, i) {
    r.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') show(i); });
    r.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !r.matches(':focus-visible')) rest(); });
    r.addEventListener('focus', function () { if (r.matches(':focus-visible')) show(i); });
    r.addEventListener('blur', function () { setTimeout(function () { var a = document.activeElement; if (!a || !a.closest || !a.closest('.dn-row') || !el.contains(a)) rest(); }, 0); });
    r.addEventListener('click', function () { if (c.pin) setPin(pin === i ? -1 : i); else show(i); });
    r.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { if (c.pin) setPin(-1); else show(-1); return; }
      var j = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: N - 1 }[e.key]; if (j == null) return; e.preventDefault(); rows[(j + N) % N].focus();
    });
  });
  TLseg($('.dn-seg', el), MON.map(function (m) { return m[0]; }), function (i) {
    mi = i; B = bounds(); if (seen) vec.to(B.concat(lifts())); rv.forEach(function (r, j) { r.set(data()[j]); }); centre();
    say.textContent = MON[i][0] + ': ' + TLkes(total()) + ' spent.';
  });
  centre();
  TLonView(el, function () { seen = true; vec.to(B.concat(lifts()), { delay: function (i) { return i <= N ? i * 70 : 0; } }); centre(); });
};`;

const dnHtml = '<div class="dn" data-dn></div>';
const donut = {
  id: 'donut', n: '03', name: 'Donut with a rolling centre', h: 330,
  claim: 'The middle of a donut should <em>read what you point at.</em>',
  lead: 'One month of spending on a PocketPay wallet. Point at a slice or a row, or use the arrow keys: the middle rolls to that slice. Switch the month and the slices reshape from where they are.',
  ref: { ids: 'c02', text: 'Our still line chart: hover and arrow keys snap to a real day and read it out.', url: SHOW + '#c02', label: 'Open c02' },
  noteHint: 'B, but click to keep like C', moreHint: 'the half ring for a savings goal',
  css: donutCss, js: donutJs,
  opts: [
    {
      k: 'B', name: 'Point at a slice and it lifts out', kind: 'Lively, after Arc',
      line: 'The slices sweep in from the top, each a beat behind the last. Pointing at one pulls it out a little and makes it thicker. The middle rolls to its amount, and its row lights.',
      from: [arc('donut-chart'), house('n07')], tryit: 'Point around the ring. Switch the month fast, twice.',
      needs: 'TLroll and springs on the slice angles.', keys: 'Tab to the ring, then arrow keys go round. Escape goes back.', off: 'Slices are drawn at once. Numbers swap.', law: 'Proximity: the amount sits inside the ring you point at.',
      tags: ['motion:springy', 'speed:mid', 'depth:some', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: dnHtml, js: String.raw`TLdonut(box, { mode: 'lift' });`,
    },
    {
      k: 'A', name: 'The other slices fade back', kind: 'Plain',
      line: 'The usual chart way. Pointing at a slice fades the others, and the middle rolls to its amount. Nothing moves out of place.',
      from: [['shadcn/ui charts', 'https://ui.shadcn.com/charts'], arc('donut-chart')], tryit: 'Point at Food, then Transport.',
      needs: 'TLroll and springs on the slice angles.', keys: 'Arrow keys on the ring. Escape goes back.', off: 'Slices are drawn at once.', law: 'Jakob: works like most charts.',
      tags: ['motion:some', 'speed:mid', 'depth:flat', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: dnHtml, js: String.raw`TLdonut(box, { mode: 'dim' });`,
    },
    {
      k: 'C', name: 'Click a slice to keep it', kind: 'Mix',
      line: 'Pointing previews a slice, like B. A click keeps it in the middle, with an orange ring on its row. Switch the month and the kept slice stays, with its new amount.',
      from: [arc('donut-chart'), house('n46')], tryit: 'Click Transport, then switch to November.',
      needs: 'TLroll and springs on the slice angles.', keys: 'Arrow keys read slices. Enter keeps one. Escape lets go.', off: 'Slices are drawn at once.', law: 'Hick: one slice held still while you compare months.',
      tags: ['motion:springy', 'speed:mid', 'depth:some', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: dnHtml, js: String.raw`TLdonut(box, { mode: 'lift', pin: true });`,
    },
    {
      k: 'D', name: 'A half ring, like a gauge', kind: 'Reference, pushed',
      line: 'The same slices on a half ring, with the amount under the arch. It takes less height, so it fits a small card. Pointing lifts a slice, as in B.',
      from: [arc('gauge'), arc('donut-chart'), house('n06')], tryit: 'Point along the arch, then use the arrow keys.',
      needs: 'TLroll and springs on the slice angles.', keys: 'Arrow keys on the arch. Escape goes back.', off: 'Slices are drawn at once.', law: 'Fitts: a wide arch is easy to point along.',
      tags: ['motion:springy', 'speed:mid', 'depth:some', 'feedback:clear', 'open:inplace', 'new:novel', 'look:ember'],
      html: dnHtml, js: String.raw`TLdonut(box, { mode: 'lift', half: true });`,
    },
  ],
};

/* ================= 04 Sparkline ================= */
const sparkCss = String.raw`
.sk { width: min(100%, 460px); display: grid; gap: 10px; }
.sk-h { display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.sk-l { margin: 0; font: 500 11px/1.4 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.sk-v { margin: 2px 0 0; font: 400 42px/1 var(--font-num); color: var(--ink); }
.sk-v .tlr-a, .sk-pill .tlr-a { font: 500 .4em/1 var(--font-mono); color: var(--muted); letter-spacing: .04em; }
.sk-plot { position: relative; height: 104px; margin-top: 6px; border-radius: 8px; cursor: crosshair; touch-action: pan-y; user-select: none; -webkit-user-select: none; }
.sk-plot:focus-visible { outline-offset: 6px; }
.sk-plot svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.sk-plot path { fill: none; stroke-linecap: round; stroke-linejoin: round; }
.sk-plot path.sk-fill { fill: rgb(var(--accent-rgb) / .1); stroke: none; }
.sk-base { stroke: var(--line); stroke-width: 1; }
.sk-dim { stroke: var(--accent); stroke-width: 2; opacity: 0; transition: opacity .2s; }
.sk-plot.is-scrub .sk-dim { opacity: .25; }
.sk-ln { stroke: var(--accent); stroke-width: 2; }
.sk-gl { stroke: color-mix(in oklab, var(--accent) 38%, #fff); stroke-width: 2.6; stroke-dasharray: .03 1.2; stroke-dashoffset: .03; opacity: 0; }
.sk-plot.is-live .sk-gl { opacity: .95; animation: tl-shimmer 3.4s cubic-bezier(.45, 0, .55, 1) infinite; }
.sk-plot.is-scrub .sk-gl { opacity: 0; }
@keyframes tl-shimmer { 0% { stroke-dashoffset: .03; } 75%, 100% { stroke-dashoffset: -1.03; } }
.sk-cur { stroke: var(--ink); stroke-width: 1; opacity: 0; transition: opacity .15s; }
.sk-plot.is-scrub .sk-cur { opacity: .35; }
.sk-dot { fill: var(--paper-raised); stroke: var(--accent); stroke-width: 2.5; opacity: 0; transition: opacity .15s; }
.sk-plot.is-scrub .sk-dot { opacity: 1; }
.sk-end { fill: var(--accent); transition: opacity .15s; }
.sk-plot.is-scrub .sk-end { opacity: .3; }
.sk-x { display: flex; justify-content: space-between; margin: 0; font: 500 10.5px/1 var(--font-mono); color: var(--muted); }
.sk-tip, .sk-pill { position: absolute; left: 0; top: 0; pointer-events: none; white-space: nowrap; }
.sk-tip { padding: 5px 8px; border-radius: 7px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-lg); font-size: 12px; line-height: 1.3; color: var(--ink-soft); opacity: 0; transition: opacity .15s; }
.sk-tip b { display: block; font: 500 15px/1.2 var(--font-num); color: var(--ink); }
.sk-plot.is-scrub .sk-tip { opacity: 1; }
.sk-pill { display: grid; justify-items: center; padding: 5px 10px 6px; border-radius: 10px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-sm); }
.sk-pill .sk-pv { font: 400 20px/1 var(--font-num); color: var(--ink); }
.sk-pill .sk-pd { font: 500 10px/1.3 var(--font-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.sk-chip, .me-chip { display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 8px 0 6px; border-radius: 999px; font: 600 12px/1 var(--font-body); border: 1px solid var(--line); color: var(--muted); white-space: nowrap; transition: background-color .25s, color .25s, border-color .25s; }
.sk-chip[data-dir="up"], .me-chip[data-dir="up"] { color: var(--accent-text); background: rgb(var(--accent-rgb) / .09); border-color: rgb(var(--accent-rgb) / .25); }
.sk-chip svg, .me-chip svg { width: 12px; height: 12px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; transition: transform var(--sp-bouncy-d) var(--sp-bouncy); }
.sk-chip[data-dir="down"] svg, .me-chip[data-dir="down"] svg { transform: rotate(180deg); }
.sk-chip .tlr-c, .me-chip .tlr-c { -webkit-mask-image: none; mask-image: none; }`;

const sparkJs = String.raw`
window.TLchipHtml = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 9.6V2.6M2.9 5.5 6 2.4l3.1 3.1"/></svg><span data-pct></span>';
window.TLpct = function (n) { return Math.abs(n).toFixed(1) + '%'; };
window.TLspark = function (box, c) {
  c = c || {};
  var N = 30, V = [], D = [], i, base = new Date(2026, 9, 7);
  for (i = 0; i < N; i++) { V.push(Math.round((10400 + i * 190 + 1700 * Math.sin(i * .85) + 800 * Math.sin(i * 2.1 + 1)) / 10) * 10); var d = new Date(base); d.setDate(base.getDate() + i); D.push(i === N - 1 ? 'Today' : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', '')); }
  var el = $('[data-sk]', box), uid = box.id + '-cl';
  el.innerHTML = '<div class="sk-h"><div><p class="sk-l" data-l>' + (c.readout === 'head' ? 'Sales today' : 'Daily sales · last 30 days') + '</p>' + (c.readout === 'head' ? '<p class="sk-v" data-v></p>' : '') + '</div>' + (c.chip ? '<span class="sk-chip" data-chip>' + TLchipHtml + '</span>' : '') + '</div>'
    + '<div class="sk-plot" data-plot tabindex="0" role="slider" aria-label="Daily sales, last 30 days. Arrow keys move through the days." aria-valuemin="0" aria-valuemax="' + (N - 1) + '">'
    + '<svg aria-hidden="true"><defs><clipPath id="' + uid + '"><rect data-clip x="-10" y="-20" height="200" width="0"/></clipPath></defs>'
    + (c.fill ? '<path class="sk-fill" data-fill/>' : '') + '<path class="sk-base" data-base/><path class="sk-dim" data-dim/><path class="sk-ln" data-ln clip-path="url(#' + uid + ')"/>' + (c.shimmer ? '<path class="sk-gl" data-gl pathLength="1"/>' : '')
    + '<line class="sk-cur" data-cur/><circle class="sk-end" data-end r="3.5"/><circle class="sk-dot" data-dot r="4.5"/></svg>'
    + (c.readout === 'tip' ? '<div class="sk-tip" data-tip><span data-td></span><b data-tv></b></div>' : '') + (c.readout === 'pill' ? '<div class="sk-pill" data-pill><span class="sk-pv" data-v></span><span class="sk-pd" data-pd>Today</span></div>' : '') + '</div>'
    + '<p class="sk-x" aria-hidden="true"><span>' + D[0] + '</span><span>Today</span></p>';
  var plot = $('[data-plot]', el), svg = $('svg', plot), ln = $('[data-ln]', el), dim = $('[data-dim]', el), fill = $('[data-fill]', el), gl = $('[data-gl]', el), cur = $('[data-cur]', el), dot = $('[data-dot]', el), end = $('[data-end]', el), clip = $('[data-clip]', el), basel = $('[data-base]', el);
  var tip = $('[data-tip]', el), pill = $('[data-pill]', el), lbl = $('[data-l]', el), chip = $('[data-chip]', el);
  var val = $('[data-v]', el) ? TLroll($('[data-v]', el), { value: V[N - 1], fmt: TLkes, dur: 520, live: false }) : null;
  var pct = chip ? TLroll($('[data-pct]', chip), { value: 0, fmt: TLpct, dur: 480, live: false }) : null;
  var W = 300, H = 104, pts = [], idx = N - 1, scrub = false, drawn = false, down = false, L = 0, vec = null;
  var mn = Math.min.apply(null, V), mx = Math.max.apply(null, V);
  function layout() {
    W = plot.clientWidth || 300; H = plot.clientHeight || 104;
    var top = c.readout === 'pill' ? 60 : 10;
    pts = V.map(function (v, i) { return [5 + i * (W - 10) / (N - 1), top + (1 - (v - mn) / (mx - mn)) * (H - top - 8)]; });
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var d = TLmono(pts); ln.setAttribute('d', d); dim.setAttribute('d', d); if (gl) gl.setAttribute('d', d);
    basel.setAttribute('d', 'M0 ' + (H - .5) + 'H' + W);
    if (fill) fill.setAttribute('d', d + 'L' + pts[N - 1][0].toFixed(1) + ' ' + H + 'L' + pts[0][0].toFixed(1) + ' ' + H + 'Z');
    L = ln.getTotalLength(); cur.setAttribute('y1', 0); cur.setAttribute('y2', H);
    end.setAttribute('cx', pts[N - 1][0]); end.setAttribute('cy', pts[N - 1][1]);
    if (drawn) { ln.style.strokeDasharray = ''; ln.style.strokeDashoffset = ''; }
    if (vec) vec.to([pts[idx][0], pts[idx][1]], { jump: true });
  }
  function place(x) {
    var X = x[0], Y = x[1];
    cur.setAttribute('x1', X); cur.setAttribute('x2', X); dot.setAttribute('cx', X); dot.setAttribute('cy', Y);
    clip.setAttribute('width', scrub ? X + 10 : W + 20);
    if (tip) { var tw = tip.offsetWidth, th = tip.offsetHeight; tip.style.transform = 'translate(' + Math.max(0, Math.min(W - tw, X - tw / 2)).toFixed(1) + 'px,' + (Y - th - 14 < -8 ? Y + 14 : Y - th - 14).toFixed(1) + 'px)'; }
    if (pill) { var pw = pill.offsetWidth; pill.style.transform = 'translate(' + Math.max(0, Math.min(W - pw, X - pw / 2)).toFixed(1) + 'px,' + Math.max(0, Y - pill.offsetHeight - 12).toFixed(1) + 'px)'; }
  }
  layout();
  vec = TLvec([pts[idx][0], pts[idx][1]], place, { dur: 380, zeta: .82, eps: .05 });
  function swap(e, txt) { if (!e || e.textContent === txt) return; e.textContent = txt; if (moving()) e.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160 }); }
  function at(i) {
    i = Math.max(0, Math.min(N - 1, i)); idx = i;
    vec.to([pts[i][0], pts[i][1]], { jump: !!c.snap });
    if (val) val.set(V[i]);
    if (c.readout === 'head') swap(lbl, i === N - 1 ? 'Sales today' : 'Sales on ' + D[i]);
    if (pill) swap($('[data-pd]', pill), D[i]);
    if (tip) { $('[data-td]', tip).textContent = D[i]; $('[data-tv]', tip).textContent = TLkes(V[i]); place(vec.x); }
    if (chip) { var p = i === N - 1 ? (V[N - 1] / V[0] - 1) * 100 : (V[i] / V[N - 1] - 1) * 100; chip.setAttribute('data-dir', p >= 0 ? 'up' : 'down'); pct.set(Math.round(Math.abs(p) * 10) / 10); chip.setAttribute('title', i === N - 1 ? 'Change over 30 days' : 'Against today'); }
    plot.setAttribute('aria-valuenow', String(i)); plot.setAttribute('aria-valuetext', D[i] + ', ' + TLkes(V[i]));
  }
  function setScrub(on) { if (scrub === on) return; scrub = on; plot.classList.toggle('is-scrub', on); place(vec.x); }
  function near(e) { var r = plot.getBoundingClientRect(); return Math.round(((e.clientX - r.left) - 5) / ((W - 10) / (N - 1))); }
  function release() { down = false; setScrub(false); at(N - 1); }
  plot.addEventListener('pointerdown', function (e) { down = true; setScrub(true); at(near(e)); });
  plot.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' || down) { setScrub(true); at(near(e)); } });
  plot.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') release(); else down = false; });
  plot.addEventListener('pointercancel', release);
  plot.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') release(); });
  plot.addEventListener('keydown', function (e) {
    var k = e.key, j = { ArrowLeft: idx - 1, ArrowDown: idx - 1, ArrowRight: idx + 1, ArrowUp: idx + 1, PageDown: idx - 5, PageUp: idx + 5, Home: 0, End: N - 1 }[k];
    if (k === 'Escape') { release(); return; } if (j == null) return; e.preventDefault(); setScrub(true); at(j);
  });
  plot.addEventListener('blur', release);
  at(N - 1);
  if ('ResizeObserver' in window) new ResizeObserver(function () { var w = plot.clientWidth; if (w && Math.abs(w - W) > 1) layout(); }).observe(plot);
  function finish() { drawn = true; ln.style.strokeDasharray = ''; ln.style.strokeDashoffset = ''; end.style.opacity = ''; if (fill) fill.style.opacity = ''; end.setAttribute('cx', pts[N - 1][0]); end.setAttribute('cy', pts[N - 1][1]); if (gl && moving()) plot.classList.add('is-live'); }
  if (!moving()) { finish(); return; }
  if (c.draw === 'fade') { [ln, end, fill].forEach(function (x) { if (x) x.style.opacity = 0; }); }
  else { ln.style.strokeDasharray = L + ' ' + L; ln.style.strokeDashoffset = L; if (fill) fill.style.opacity = 0; }
  TLonView(el, function () {
    if (c.draw === 'fade') { [ln, end, fill].forEach(function (x) { if (x) { x.style.opacity = ''; x.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: 'ease-out' }); } }); finish(); return; }
    var t0 = performance.now(), DUR = 1100 * (window.TLrollSlow || 1);
    (function f(t) { var k = Math.min(1, (t - t0) / DUR), p = TLez(k); if (drawn) return;
      ln.style.strokeDashoffset = L * (1 - p); var q = ln.getPointAtLength(L * p); end.setAttribute('cx', q.x); end.setAttribute('cy', q.y); if (fill) fill.style.opacity = p;
      if (k < 1) requestAnimationFrame(f); else finish(); })(t0);
  });
};`;

const skHtml = '<div class="sk" data-sk></div>';
const spark = {
  id: 'spark', n: '04', name: 'Sparkline that scrubs', h: 270,
  claim: 'A small line should let you <em>slide back through the days.</em>',
  lead: 'Thirty days of sales for Duka Fresh. Slide along the line with a finger, a mouse or the arrow keys. The value rolls to that day. Let go and it goes back to today.',
  ref: { ids: 'n06', text: 'The KES stat card: a number that counts up, and a sparkline that draws in, then shimmers to say "live".', url: SHOW + '#n06', label: 'Open n06' },
  noteHint: 'B, with D’s shimmer at rest', moreHint: 'a small bar chart that scrubs the same way',
  css: sparkCss, js: sparkJs,
  opts: [
    {
      k: 'B', name: 'The headline rolls as you slide', kind: 'Lively, after Arc',
      line: 'The line draws in with an orange dot on its front. Sliding moves a cursor that springs from day to day. Later days dim, and the big number rolls to the day under your finger.',
      from: [arc('sparkline'), house('n06'), ['patterns/line-chart.md', null]], tryit: 'Slide slowly, then fast, across the line. Let go.',
      needs: 'TLroll, TLvec and an inline SVG.', keys: 'Tab to the line. Arrows move a day, Page keys five days, Home and End, Escape goes back to today.', off: 'The line is drawn. The cursor jumps.', law: 'Fitts: the whole width is the target, not a small dot.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: skHtml, js: String.raw`TLspark(box, { readout: 'head' });`,
    },
    {
      k: 'A', name: 'A small label above the point', kind: 'Plain',
      line: 'The usual chart tooltip. The line fades in. A small card above the point shows the day and amount. The cursor jumps from day to day with no spring.',
      from: [['shadcn/ui charts', 'https://ui.shadcn.com/charts'], house('c02')], tryit: 'Point along the line.',
      needs: 'An inline SVG and a little script.', keys: 'Same keys as B.', off: 'Same, with no fade.', law: 'Jakob: works like most charts.',
      tags: ['motion:still', 'speed:quick', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: skHtml, js: String.raw`TLspark(box, { readout: 'tip', snap: true, draw: 'fade' });`,
    },
    {
      k: 'C', name: 'The amount rides on the line', kind: 'Mix',
      line: 'A small pill sits on the line at today. Slide and the pill springs along with the cursor, its number rolling as it goes. A soft fill sits under the line.',
      from: [arc('sparkline'), house('c02'), house('n07')], tryit: 'Slide to the left end and back.',
      needs: 'TLroll, TLvec and an inline SVG.', keys: 'Same keys as B.', off: 'The pill jumps from day to day.', law: 'Proximity: the number is on the point it names.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: skHtml, css: String.raw`#t04C .sk-plot { height: 134px; }`, js: String.raw`TLspark(box, { readout: 'pill', fill: true });`,
    },
    {
      k: 'D', name: 'Our stat card, with a line you can slide', kind: 'Reference, pushed',
      line: 'Our KES stat card (n06), pushed. After the line draws in, the house shimmer crosses it to say "live". Slide back and the chip rolls to how that day compares with today.',
      from: [house('n06'), arc('sparkline'), ['DESIGN.md: the live shimmer', null]], tryit: 'Watch the shimmer, then slide to a low day.',
      needs: 'TLroll, TLvec, an inline SVG and one CSS loop.', keys: 'Same keys as B.', off: 'No shimmer. The line is drawn.', law: 'Proximity: the change sits next to the number it changes.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: skHtml, js: String.raw`TLspark(box, { readout: 'head', chip: true, fill: true, shimmer: true });`,
    },
  ],
};

/* ================= 05 Metric card ================= */
const metricCss = String.raw`
.me { width: min(100%, 520px); display: grid; gap: 14px; }
.me-sw { min-width: 240px; }
.me-tiles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
@container (max-width: 430px) { .me-tiles { grid-template-columns: minmax(0, 1fr); } }
.me-t { min-width: 0; display: grid; align-content: start; gap: 6px; padding: 12px 12px 11px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); box-shadow: var(--shadow-sm); }
.me-l { margin: 0; font: 500 10.5px/1.3 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.me-v { margin: 0; font: 400 min(30px, 6.4cqi)/1.05 var(--font-num); color: var(--ink); white-space: nowrap; }
@container (max-width: 430px) { .me-v { font-size: 30px; } }
.me-v .tlr-a, .me-hero .tlr-a { font: 500 .44em/1 var(--font-mono); color: var(--muted); letter-spacing: .04em; }
.me-x { margin: 0; font-size: 12px; line-height: 1.35; color: var(--muted); }
.me-x.tll { display: grid; grid-template-columns: minmax(0, 1fr); }
.me-x.tll > span { white-space: normal; }
.me-row { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 10px; padding: 10px 0; border-top: 1px solid var(--line); }
.me-row:first-child { border-top: 0; padding-top: 2px; }
.me-row .me-v { font-size: 26px; }
.me-foot { padding-top: 9px; border-top: 1px solid var(--line); }
.me-hero { margin: 4px 0 0; font: 400 50px/1 var(--font-num); color: var(--ink); }
.me-hl { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-top: 8px; }
.me-sp { display: block; width: 100%; height: 58px; margin-top: 6px; overflow: visible; }
.me-sp path { fill: none; stroke: var(--accent); stroke-width: 2; stroke-linecap: round; }
.me-sp path.ar { fill: rgb(var(--accent-rgb) / .1); stroke: none; }
.me-mini { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; padding-top: 10px; border-top: 1px solid var(--line); }
.me-mini > div { display: grid; gap: 5px; justify-items: start; }
.me-mini .me-v { font-size: 24px; }`;

const metricJs = String.raw`
window.TLmetric = function (box, c) {
  c = c || {};
  var PER = [['Today', 18450, 64, 12.4, 8.5, 'yesterday'], ['7 days', 112300, 402, -3.2, 1.8, 'the 7 days before'], ['30 days', 486900, 1712, 9.1, 6.0, 'the 30 days before']].map(function (p) {
    var ps = p[1] / (1 + p[3] / 100), po = p[2] / (1 + p[4] / 100), b = p[1] / p[2], pb = ps / po;
    return { n: p[0], w: p[5], k: [{ v: p[1], c: p[3], d: p[1] - ps }, { v: p[2], c: p[4], d: p[2] - po }, { v: Math.round(b), c: (b / pb - 1) * 100, d: b - pb }] };
  });
  var SER = [[600, 900, 1400, 1100, 1800, 2300, 1900, 1500, 1200, 1700, 2100, 1300, 650], [14200, 16900, 15100, 17800, 13900, 16200, 18200], []];
  for (var q = 0; q < 30; q++) SER[2].push(14500 + q * 120 + 2200 * Math.sin(q * .9) + 900 * Math.sin(q * 2.3));
  var KN = ['Sales', 'Orders', 'Average basket'], FM = [TLkes, function (n) { return Math.round(n).toLocaleString('en-KE'); }, TLkes];
  function ctx(j, p) { var x = p.k[j], a = Math.abs(x.d); return (x.d >= 0 ? 'Up ' : 'Down ') + (j === 1 ? Math.round(a) + ' orders' : TLkes(a)) + ' on ' + p.w; }
  var el = $('[data-me]', box), pi = 0, hero = c.layout === 'hero', list = c.layout === 'list', chipH = '<span class="me-chip" data-chip>' + TLchipHtml + '</span>', body;
  if (list) body = '<div class="me-t">' + KN.map(function (n) { return '<div class="me-row" data-k><p class="me-l">' + n + '</p><p class="me-v" data-v></p>' + chipH + '</div>'; }).join('') + '<p class="me-x me-foot" data-foot></p></div>';
  else if (hero) body = '<div class="me-t" style="padding:16px"><div data-k><p class="me-l">Sales</p><p class="me-hero" data-v></p><div class="me-hl">' + chipH + '<p class="me-x" data-x></p></div></div><svg class="me-sp" data-sp viewBox="0 0 300 58" preserveAspectRatio="none" aria-hidden="true"><path class="ar"/><path vector-effect="non-scaling-stroke"/></svg>'
    + '<div class="me-mini">' + [1, 2].map(function (j) { return '<div data-k><p class="me-l">' + KN[j] + '</p><p class="me-v" data-v></p>' + chipH + '</div>'; }).join('') + '</div></div>';
  else body = '<div class="me-tiles">' + KN.map(function (n) { return '<div class="me-t" data-k><p class="me-l">' + n + '</p><p class="me-v" data-v></p><p style="margin:0">' + chipH + '</p><p class="me-x" data-x></p></div>'; }).join('') + '</div>';
  el.innerHTML = '<div class="me-sw" role="radiogroup" aria-label="Period"></div>' + body + '<p class="sr" aria-live="polite" data-say></p>';
  var ks = $$('[data-k]', el), say = $('[data-say]', el), sp = $('[data-sp]', el), seen = !hero, foot = $('[data-foot]', el);
  function count(e, from, to, fmt) { if (!moving()) { e.textContent = fmt(to); return; } cancelAnimationFrame(e._an); var t0 = performance.now(); (function f(t) { var k = Math.min(1, (t - t0) / 320); e.textContent = fmt(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)))); if (k < 1) e._an = requestAnimationFrame(f); })(t0); }
  var V = ks.map(function (k, j) {
    var vEl = $('[data-v]', k), chip = $('[data-chip]', k), xEl = $('[data-x]', k), p = PER[0].k[j], o = { chip: chip, j: j };
    if (c.count) {
      vEl.innerHTML = (j === 1 ? '' : '<span class="tlr-a">KES </span>') + '<span></span>'; vEl.classList.add('l-num');
      var nEl = vEl.lastChild, nf = function (n) { return Math.round(n).toLocaleString('en-KE'); }; nEl.textContent = nf(p.v);
      o.v = { value: p.v, set: function (n) { var from = this.value; this.value = n; count(nEl, from, n, nf); } };
      o.p = { set: function (n) { $('[data-pct]', chip).textContent = TLpct(n); } };
      o.x = xEl ? { set: function (t) { xEl.textContent = t; } } : null;
    } else {
      o.v = TLroll(vEl, { value: hero && j === 0 ? 0 : p.v, fmt: FM[j], dur: 640, live: false });
      o.p = TLroll($('[data-pct]', chip), { value: hero ? 0 : Math.round(Math.abs(p.c) * 10) / 10, fmt: TLpct, dur: 520, live: false });
      o.x = xEl ? TLline(xEl) : null;
    }
    return o;
  });
  var fl = foot ? TLline(foot) : null;
  function resample(a) { var out = []; for (var i = 0; i < 24; i++) { var t = i / 23 * (a.length - 1), lo = Math.floor(t), hi = Math.min(a.length - 1, lo + 1); out.push(a[lo] + (a[hi] - a[lo]) * (t - lo)); } var mn = Math.min.apply(null, out), mx = Math.max.apply(null, out); return out.map(function (v) { return (v - mn) / (mx - mn || 1); }); }
  var sv = sp ? TLvec(resample(SER[0]).map(function () { return .5; }), function (y) {
    var d = TLmono(y.map(function (v, i) { return [i / 23 * 300, 6 + (1 - v) * 46]; }));
    sp.lastChild.setAttribute('d', d); sp.firstChild.setAttribute('d', d + 'L300 58L0 58Z');
  }, { dur: 550, ease: true }) : null;
  function apply(i, first) {
    var prev = PER[pi], p = PER[i]; pi = i;
    V.forEach(function (o) {
      var x = p.k[o.j], dir = x.v >= prev.k[o.j].v ? 1 : -1;
      if (seen) { o.v.set(x.v); o.p.set(Math.round(Math.abs(x.c) * 10) / 10); }
      o.chip.setAttribute('data-dir', x.c >= 0 ? 'up' : 'down'); o.chip.setAttribute('title', (x.c >= 0 ? 'Up ' : 'Down ') + TLpct(x.c) + ' on ' + p.w);
      if (o.x) o.x.set(ctx(o.j, p), dir);
    });
    if (fl) fl.set('Each change is against ' + p.w + '.', p.k[0].v >= prev.k[0].v ? 1 : -1);
    if (sv && seen) sv.to(resample(SER[i]));
    if (!first) say.textContent = p.n + ': sales ' + TLkes(p.k[0].v) + ', ' + p.k[1].v + ' orders, ' + TLkes(p.k[2].v) + ' average basket.';
  }
  TLseg($('.me-sw', el), PER.map(function (p) { return p.n; }), function (i) { apply(i); }, { cls: 'me' });
  apply(0, true);
  if (hero) TLonView(el, function () { seen = true; V.forEach(function (o) { o.v.set(PER[pi].k[o.j].v, { dir: 'up' }); o.p.set(Math.round(Math.abs(PER[pi].k[o.j].c) * 10) / 10); }); sv.to(resample(SER[pi])); });
};`;

const meHtml = '<div class="me" data-me></div>';
const metric = {
  id: 'metric', n: '05', name: 'Metric card', h: 300,
  claim: 'A metric card should say <em>which way things went.</em>',
  lead: 'Sales, orders and the average basket for Duka Fresh. Switch between Today, 7 days and 30 days. The numbers roll, the change chip grows to fit, and the line under it rolls in from the side the number moved.',
  ref: { ids: 'n06', text: 'The KES stat card: a number that counts up, with a small sparkline that draws in.', url: SHOW + '#n06', label: 'Open n06' },
  noteHint: 'B’s tiles with D’s line', moreHint: 'a card that compares two shops',
  css: metricCss, js: metricJs,
  opts: [
    {
      k: 'B', name: 'Three tiles that roll together', kind: 'Lively, after Arc',
      line: 'Each tile rolls its number the way it moved. The change chip grows or shrinks to fit, and its arrow flips on a spring. The line under it rolls in from below when the number went up, from above when it went down.',
      from: [arc('metric-card'), house('n06'), house('n07')], tryit: 'Switch Today, 7 days, 30 days, and back.',
      needs: 'TLroll and a few lines for the rolling line.', keys: 'Arrow keys move between the periods.', off: 'Numbers and lines swap at once.', law: 'Proximity: each change sits under its own number.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: meHtml, js: String.raw`TLmetric(box, {});`,
    },
    {
      k: 'A', name: 'Numbers count, words swap', kind: 'Plain',
      line: 'The same tiles with our count() helper: each number counts to its new value in 0.32 s. The chip and the line under it change at once.',
      from: [house('n44'), house('n46')], tryit: 'Switch the period and watch the numbers count.',
      needs: 'Our count() helper.', keys: 'Arrow keys move between the periods.', off: 'Numbers jump.', law: 'Jakob: like most dashboards.',
      tags: ['motion:some', 'speed:quick', 'density:mid', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: meHtml, js: String.raw`TLmetric(box, { count: true });`,
    },
    {
      k: 'C', name: 'One card, three rows', kind: 'Mix',
      line: 'All three numbers in one small card, one row each, with the chip at the end of the row. The rolls are the same as B. One line at the bottom says what the change is against.',
      from: [arc('metric-card'), house('n06')], tryit: 'Switch to 7 days and watch the rows.',
      needs: 'TLroll.', keys: 'Arrow keys move between the periods.', off: 'Numbers swap at once.', law: 'Proximity: one row per number, read left to right.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: meHtml, js: String.raw`TLmetric(box, { layout: 'list' });`,
    },
    {
      k: 'D', name: 'Our KES stat card, rolling', kind: 'Reference, pushed',
      line: 'Our KES stat card (n06), pushed. Sales rolls up from zero when you scroll to it. Its line reshapes in 0.55 s when you switch period, instead of drawing again. Orders and basket sit below it.',
      from: [house('n06'), arc('metric-card'), ['patterns/line-chart.md', null]], tryit: 'Scroll it into view, then switch to 30 days.',
      needs: 'TLroll, TLvec and an inline SVG.', keys: 'Arrow keys move between the periods.', off: 'Numbers and line swap at once.', law: 'Proximity: the trend sits under the number it explains.',
      tags: ['motion:springy', 'speed:mid', 'density:roomy', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: meHtml, h: 340, js: String.raw`TLmetric(box, { layout: 'hero' });`,
    },
  ],
};

export default [roll, meter, donut, spark, metric];
