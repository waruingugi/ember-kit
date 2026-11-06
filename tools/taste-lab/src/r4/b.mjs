// Round 4, batch b: buttons and the theme switch (06–14).
// Ideas from Arc's free parts (uiarc.dev, MIT), rebuilt in plain script and the ember look.
// Corners follow the new rule: buttons 8–10 px, panels 12–14 px; circles only for icon-only buttons and chips.
// Shared helpers for this batch live on window.TL4b (set in part 06's js): hl (one highlight that morphs
// in place and size), rove (arrow keys through a row or grid), swap (labels that share one box), copy,
// say, flip2, faces (a box that morphs between faces), hold (press and hold), morph (icons that morph),
// theme (switch the page theme with a view transition).
import { sh, arc, house } from '../src-links.mjs';

const sv = (d, w = 1.6) => `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const I = {
  edit: sv('M10.6 2.9 13.1 5.4 5.6 12.9l-3 .5.5-3zM9.3 4.2l2.5 2.5', 1.4),
  copy: sv('M6.2 5.5h5.6c.4 0 .7.3.7.7v5.6c0 .4-.3.7-.7.7H6.2a.7.7 0 0 1-.7-.7V6.2c0-.4.3-.7.7-.7zM3.5 10V4.2c0-.4.3-.7.7-.7H10', 1.4),
  share: sv('M8 2.5v7.5M5.2 5.3 8 2.5l2.8 2.8M3.5 8.5v3.8c0 .7.5 1.2 1.2 1.2h6.6c.7 0 1.2-.5 1.2-1.2V8.5', 1.4),
  chev: sv('m4.5 6.5 3.5 3.5 3.5-3.5'), dots: sv('M3.6 8h.01M8 8h.01M12.4 8h.01', 2.4),
  send: sv('M13.5 2.5 7 9M13.5 2.5 9.3 13.5 7 9 2.5 6.7z', 1.4), mail: sv('M2.5 4h11v8h-11zM2.5 4.5 8 8.8l5.5-4.3', 1.4),
  chat: sv('M2.8 3.5h10.4v7H7.5L4.5 13v-2.5H2.8z', 1.4),
  link: sv('M6.8 9.2 9.2 6.8M7.3 4.6l1-1a2.6 2.6 0 0 1 3.7 3.7l-1 1M8.7 11.4l-1 1a2.6 2.6 0 0 1-3.7-3.7l1-1', 1.4),
  trash: sv('M2.8 4.3h10.4M6.3 4.3V3h3.4v1.3M4.2 4.3l.6 8.7h6.4l.6-8.7', 1.4),
  archive: sv('M2.5 3.5h11v3h-11zM3.5 6.5v6h9v-6M6.5 9h3', 1.4), clock: sv('M8 13.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM8 5v3.2l2 1.3', 1.4),
  reply: sv('M6.5 4 3 7.5 6.5 11M3 7.5h6.5a3.5 3.5 0 0 1 3.5 3.5v1', 1.4), bell: sv('M4 11V7.3a4 4 0 0 1 8 0V11l1 1.5H3zM6.6 14a1.6 1.6 0 0 0 2.8 0', 1.4),
  check: sv('M3.5 8.4 6.6 11.3 12.5 4.8', 1.8), plus: sv('M8 3.5v9M3.5 8h9', 1.8), minus: sv('M3.5 8h9', 1.8),
  zin: sv('M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM13.5 13.5l-2.9-2.9M5 7h4M7 5v4', 1.4), zout: sv('M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM13.5 13.5l-2.9-2.9M5 7h4', 1.4),
  fit: sv('M2.5 6V3.5c0-.6.4-1 1-1H6M10 2.5h2.5c.6 0 1 .4 1 1V6M13.5 10v2.5c0 .6-.4 1-1 1H10M6 13.5H3.5c-.6 0-1-.4-1-1V10', 1.4),
  left: sv('M10 3.5 5.5 8l4.5 4.5'), right: sv('M6 3.5 10.5 8 6 12.5'), info: sv('M8 13.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM8 7.4V11M8 5.2h.01', 1.4),
  phone: sv('M5.2 2.5h-1.4a1.3 1.3 0 0 0-1.3 1.4c.4 5 4.6 9.2 9.6 9.6a1.3 1.3 0 0 0 1.4-1.3v-1.4l-2.6-1.1-1.3 1.3a7 7 0 0 1-3.4-3.4l1.3-1.3z', 1.4),
  pin: sv('M8 14s4.5-4 4.5-7.6a4.5 4.5 0 0 0-9 0C3.5 10 8 14 8 14zM8 8.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4z', 1.4),
  card: sv('M2 4h12v8H2zM2 6.6h12M4.5 10h2.5', 1.3), receipt: sv('M4 2.5h8v11l-2-1.2-2 1.2-2-1.2-2 1.2zM6 5.5h4M6 8h4', 1.4),
  home: sv('M2.8 7.2 8 2.8l5.2 4.4v6H9.6V9.8H6.4v3.4H2.8z', 1.4), wallet: sv('M2.5 4.5h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-10zM2.5 4.5l7-2v2M10.5 9h.01', 1.4),
  user: sv('M8 8a2.8 2.8 0 1 0 0-5.6A2.8 2.8 0 0 0 8 8zM2.8 13.6a5.2 5.2 0 0 1 10.4 0', 1.4), store: sv('M2.5 6.5 3.5 3h9l1 3.5zM3.5 8v5.5h9V8M6.5 13.5v-3h3v3', 1.4),
  cash: sv('M1.8 4.5h12.4v7H1.8zM8 9.6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2zM4 6.5v3M12 6.5v3', 1.3), signal: sv('M3 12.5v-2M6 12.5V8M9 12.5V5.5M12 12.5v-9', 1.6),
  thumb: sv('M5 7v6.3H2.8V7zM5 7l2.5-4.4c1 0 1.7.8 1.5 1.8L8.6 6.5h3.6c.8 0 1.3.7 1.2 1.4l-.9 4.4c-.1.6-.6 1-1.2 1H5', 1.4),
  heart: sv('M8 13.2S2.5 10 2.5 6.1A2.9 2.9 0 0 1 8 4.6a2.9 2.9 0 0 1 5.5 1.5C13.5 10 8 13.2 8 13.2z', 1.4),
  smile: sv('M8 13.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM5.6 9.3a2.8 2.8 0 0 0 4.8 0M6 6.4h.01M10 6.4h.01', 1.4),
  eye: sv('M1.8 8S4 3.8 8 3.8 14.2 8 14.2 8 12 12.2 8 12.2 1.8 8 1.8 8zM8 9.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z', 1.4),
  spark: sv('M8 2.5v2.2M8 11.3v2.2M2.5 8h2.2M11.3 8h2.2M4.1 4.1l1.5 1.5M10.4 10.4l1.5 1.5M4.1 11.9l1.5-1.5M10.4 5.6l1.5-1.5', 1.4),
  react: sv('M8 13.5a5.5 5.5 0 1 1 5.5-5.5M5.6 9.3a2.8 2.8 0 0 0 4.4.5M6 6.4h.01M10 6.4h.01M12.5 10.5v3M11 12h3', 1.4),
  monitor: sv('M2.5 3.5h11v7.5h-11zM6 13.5h4M8 11v2.5', 1.4),
  sun: sv('M8 10.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6zM8 1.8v1.4M8 12.8v1.4M1.8 8h1.4M12.8 8h1.4M3.6 3.6l1 1M11.4 11.4l1 1M3.6 12.4l1-1M11.4 4.6l1-1', 1.4),
  moon: sv('M13.2 9.9A5.6 5.6 0 0 1 6.1 2.8a5.6 5.6 0 1 0 7.1 7.1z', 1.4),
};
// the orange done tick: TICK (lib) draws itself in; TK0 is the same tick already drawn
const TK0 = '<svg class="l-tick" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="11"/><path d="M6.6 11.4 9.6 14.3l5.8-6.4"/></svg>';
// labels that share one box (TL4b.swap): the widest sets the width, so nothing moves when the word changes
const rs = (pairs, cls = '') => `<span class="t4b-rs ${cls}">${pairs.map(([k, t], i) => `<span data-k="${k}"${i ? ' aria-hidden="true"' : ' class="on"'}>${t}</span>`).join('')}</span>`;

/* morphing icons, our own paths on a 24 grid (TL4b.morph drives them) */
const ms = (body, cls = '') => `<svg class="t4b-mi ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
const RAYS = Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4, c = Math.cos(a), s = Math.sin(a), r = (v) => Math.round(v * 100) / 100; return `M${r(12 + c * 7.4)} ${r(12 + s * 7.4)}L${r(12 + c * 9.6)} ${r(12 + s * 9.6)}`; }).join('');
const MI = {
  menu: () => ms('<path data-p="a" d="M4.5 7h15"/><path data-p="b" d="M4.5 12h15"/><path data-p="c" d="M4.5 17h15"/>'),
  play: () => ms('<path data-p="a" fill="currentColor" stroke-width="1.6" d="M8 5L12.5 7.6L12.5 16.4L8 19Z"/><path data-p="b" fill="currentColor" stroke-width="1.6" d="M12.5 7.6L19 11.6L19 12.4L12.5 16.4Z"/>'),
  plus: () => ms('<path data-p="a" d="M12 5L12 19"/><path data-p="b" d="M5 12L19 12"/>', 't4b-ok'),
  copy: () => ms('<path data-p="a" d="M15.5 5.5V5c0-.8-.7-1.5-1.5-1.5H5c-.8 0-1.5.7-1.5 1.5v9c0 .8.7 1.5 1.5 1.5h.5"/><rect data-p="b" x="8.5" y="8.5" width="12" height="12" rx="2"/><path data-p="k" class="t4b-tk" d="M6.2 12.6 10.2 16.6 18.4 8.2" stroke-width="2"/>'),
  theme: () => ms('<defs><mask data-p="mk" maskUnits="userSpaceOnUse" x="-8" y="-8" width="40" height="40"><rect x="-8" y="-8" width="40" height="40" fill="#fff" stroke="none"/><circle data-p="m" cx="27" cy="-3" r="6.2" fill="#000" stroke="none"/></mask><clipPath data-p="cp"><circle data-p="q" cx="12" cy="12" r="4.2"/></clipPath></defs><circle data-p="d" cx="12" cy="12" r="4.2"/><circle data-p="s" cx="27" cy="-3" r="6.2"/><g data-p="r">' + `<path d="${RAYS}"/>` + '</g>'),
  chev: () => ms('<path data-p="a" d="M6.5 9.5 12 15l5.5-5.5"/>'),
  bell: () => ms('<defs><mask data-p="mk" maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32"><rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none"/><path data-p="m" d="M3.5 3.5 20.5 20.5" stroke="#000" stroke-width="5"/></mask></defs><g data-p="g"><path data-p="b" d="M6.2 9a5.8 5.8 0 0 1 11.6 0c0 6.4 2.7 8.2 2.7 8.2H3.5S6.2 15.4 6.2 9"/><path data-p="c" d="M10.3 20.5a1.9 1.9 0 0 0 3.4 0"/></g><path data-p="s" d="M3.5 3.5 20.5 20.5"/>'),
  eye: () => ms('<defs><mask data-p="mk" maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32"><rect x="-4" y="-4" width="32" height="32" fill="#fff" stroke="none"/><path data-p="m" d="M4 4 20 20" stroke="#000" stroke-width="5"/></mask></defs><g data-p="g"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle data-p="p" cx="12" cy="12" r="2.8"/></g><path data-p="s" d="M4 4 20 20"/>'),
};

/* ================= shared helpers: window.TL4b ================= */
const H4 = String.raw`/* ===== round 4 batch b shared helpers ===== */
window.TL4b = window.TL4b || {};
(function (T) {
  var cl = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; }, L = function (a, b, t) { return a + (b - a) * t; };
  T.fine = function () { return matchMedia('(hover: hover) and (pointer: fine)').matches; };
  /* say something to screen readers; the same words again are read again */
  T.say = function (el, t) { if (!el) return; clearTimeout(el._say); el.textContent = ''; el._say = setTimeout(function () { el.textContent = t; }, 40); };
  /* copy text; falls back to a hidden text box. Resolves true or false */
  T.copy = function (text) {
    function old() { var a = document.activeElement, t = document.createElement('textarea'), ok = false; t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none'; document.body.appendChild(t); t.select(); try { ok = document.execCommand('copy'); } catch (e) {} t.remove(); if (a && a.focus) a.focus({ preventScroll: true }); return ok; }
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return old(); });
    return Promise.resolve(old());
  };
  /* labels that share one box: the old word lifts away, the new one rises in from a soft blur */
  T.swap = function (rs, k) {
    $$(':scope > [data-k]', rs).forEach(function (s) {
      var on = s.getAttribute('data-k') === k, was = s.classList.contains('on');
      if (was && !on) s.classList.add('out');
      if (on && !was) { s.classList.remove('out'); s.style.transition = 'none'; s.offsetWidth; s.style.transition = ''; }
      s.classList.toggle('on', on); s.setAttribute('aria-hidden', String(!on));
    });
  };
  /* one highlight that moves in place and size on a spring that keeps its speed. It is a full-size layer
     clipped to the target, so only paint changes and its corners never stretch. Arriving from nothing it grows
     from 94% where it lands; pressing settles it to 96.5% and darkens it. */
  T.hl = function (tray, el, o) {
    o = o || {}; var R = o.r == null ? 8 : o.r, on = false, cur = null, down = false;
    function rect(b) { var a = tray.getBoundingClientRect(), r = b.getBoundingClientRect(), k = tray.offsetWidth ? a.width / tray.offsetWidth : 1; return [(r.left - a.left) / k - tray.clientLeft, (r.top - a.top) / k - tray.clientTop, r.width / k, r.height / k]; }
    var v = TLvec([0, 0, 0, 0, 1], function (x) {
      var W = tray.clientWidth, H = tray.clientHeight, s = x[4], w = Math.max(0, x[2] * s), h = Math.max(0, x[3] * s), l = x[0] + (x[2] - w) / 2, t = x[1] + (x[3] - h) / 2;
      el.style.clipPath = 'inset(' + t.toFixed(2) + 'px ' + (W - l - w).toFixed(2) + 'px ' + (H - t - h).toFixed(2) + 'px ' + l.toFixed(2) + 'px round ' + R + 'px)';
    }, { dur: o.dur || 440, zeta: o.zeta || .8 });
    var api = {
      to: function (b) {
        if (!b) { api.hide(); return; }
        var g = rect(b), fresh = !on; cur = b;
        if (fresh) { on = true; v.to(g.concat([.94]), { jump: true }); el.classList.add('on'); }
        if (!o.old) v.to(g.concat([down ? .965 : 1]));
        else { el.style.clipPath = ''; el.style.transform = 'translate(' + g[0] + 'px,' + g[1] + 'px)'; el.style.width = g[2] + 'px'; el.style.height = g[3] + 'px'; }
        if (o.onMove) o.onMove(b);
      },
      hide: function () { on = false; cur = null; el.classList.remove('on'); if (o.onMove) o.onMove(null); },
      press: function (d) { down = d; el.classList.toggle('down', d); if (cur && !o.old) v.to(rect(cur).concat([d ? .965 : 1])); },
      sync: function () { if (cur && !o.old) v.to(rect(cur).concat([down ? .965 : 1]), { jump: true }); },
      cur: function () { return cur; }, mode: function (old) { o.old = old; el.style.cssText = ''; on = false; cur = null; el.classList.remove('on'); }
    };
    if (window.ResizeObserver) new ResizeObserver(function () { api.sync(); }).observe(tray);
    return api;
  };
  /* arrow keys through a row (o.vertical: a column; o.grid: any layout, by position). o.single: one tab stop */
  T.rove = function (items, o) {
    o = o || {}; var at = o.start || 0;
    function mark(i) { at = i; if (o.single) items.forEach(function (b, j) { b.tabIndex = j === i ? 0 : -1; }); }
    function near(i, dx, dy) {
      var a = items[i].getBoundingClientRect(), ax = a.left + a.width / 2, ay = a.top + a.height / 2, best = -1, bd = 1e9;
      items.forEach(function (b, j) { if (j === i) return; var r = b.getBoundingClientRect(), x = r.left + r.width / 2 - ax, y = r.top + r.height / 2 - ay;
        if ((dx && x * dx <= 4) || (dy && y * dy <= 4)) return; var d = dx ? Math.abs(x) + Math.abs(y) * 3 : Math.abs(y) + Math.abs(x) * 3; if (d < bd) { bd = d; best = j; } });
      return best;
    }
    mark(at);
    items.forEach(function (b, i) {
      b.addEventListener('focus', function () { mark(i); });
      b.addEventListener('keydown', function (e) {
        var n = items.length, k = e.key, j = -1, fw = o.vertical ? 'ArrowDown' : 'ArrowRight', bk = o.vertical ? 'ArrowUp' : 'ArrowLeft';
        if (o.skip && o.skip(e, i)) return;
        if (o.grid && /^Arrow/.test(k)) { j = near(i, k === 'ArrowRight' ? 1 : k === 'ArrowLeft' ? -1 : 0, k === 'ArrowDown' ? 1 : k === 'ArrowUp' ? -1 : 0); if (j < 0) { e.preventDefault(); return; } }
        else if (k === fw) j = (i + 1) % n; else if (k === bk) j = (i - 1 + n) % n;
        else if (k === 'Home') j = 0; else if (k === 'End') j = n - 1;
        if (j < 0) return; e.preventDefault(); items[j].focus({ preventScroll: true });
      });
    });
    return { mark: mark, at: function () { return at; } };
  };
  /* move boxes to their new places on a spring after a layout change, in both directions */
  T.flip2 = function (els, change) {
    var a = els.map(function (e) { return e.getBoundingClientRect(); }); change();
    if (!moving()) return; var s = TLsp('snappy');
    els.forEach(function (e, i) { if (!e.isConnected) return; var b = e.getBoundingClientRect(), dx = a[i].left - b.left, dy = a[i].top - b.top;
      if (Math.abs(dx) < .5 && Math.abs(dy) < .5) return; e.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'translate(0,0)' }], { duration: s.d, easing: s.e, composite: 'add' }); });
  };
  /* a box that morphs between faces: each face sits at its own size against the leading edge,
     and a clipped background springs to it, so text never squashes */
  T.faces = function (m, o) {
    o = o || {}; var F = {}, at = null, W = 0, H = 0, bg = $('[data-bg]', m), R = o.r || 10;
    $$('[data-f]', m).forEach(function (f) { F[f.getAttribute('data-f')] = f; });
    var v = TLvec([0, 0], function (x) { bg.style.clipPath = 'inset(0 ' + Math.max(0, W - x[0]).toFixed(2) + 'px ' + Math.max(0, H - x[1]).toFixed(2) + 'px 0 round ' + R + 'px)'; }, { dur: o.dur || 480, zeta: o.zeta || .8 });
    function wh(k) { return [F[k].offsetWidth, F[k].offsetHeight]; }
    function size() { W = 0; H = 0; Object.keys(F).forEach(function (k) { W = Math.max(W, F[k].offsetWidth); H = Math.max(H, F[k].offsetHeight); }); m.style.width = W + 'px'; m.style.height = (o.h || H) + 'px'; if (at) v.to(wh(at), { jump: true }); }
    function go(k, focus) {
      var first = !at; at = k; m.setAttribute('data-at', k);
      Object.keys(F).forEach(function (n) { F[n].classList.toggle('on', n === k); F[n].inert = n !== k; });
      v.to(wh(k), first ? { jump: true } : null);
      if (focus) { var b = $(focus, F[k]); if (b) setTimeout(function () { b.focus({ preventScroll: true }); }, 0); }
    }
    size(); go(o.start || Object.keys(F)[0]); TLb.fonts(size);
    return { go: go, at: function () { return at; }, size: size, face: function (k) { return F[k]; } };
  };
  /* press and hold: the fill runs on a straight line while held, drains back on a spring when let go early,
     and goes on from where it was if pressed again. Space or Enter held does the same. Tab away cancels. */
  T.hold = function (btn, o) {
    var p = 0, held = false, raf = 0, last = 0, done = false, D = o.ms || 1600;
    var sp = TLb.sp(function (x) { p = x; o.draw(p); }, { k: 150, c: 20, eps: .002 });
    function tick(t) { if (!held) return; p = Math.min(1, p + (t - last) / D); last = t; sp.jump(p);
      if (p >= 1) { held = false; done = true; btn.classList.remove('is-held'); btn.setAttribute('aria-disabled', 'true'); try { if (navigator.vibrate) navigator.vibrate(14); } catch (e) {} o.done(); return; }
      raf = requestAnimationFrame(tick); }
    function start() { if (done || held) return; held = true; last = performance.now(); btn.classList.add('is-held'); if (o.start) o.start(); raf = requestAnimationFrame(tick); }
    function stop() { if (!held) return; held = false; cancelAnimationFrame(raf); btn.classList.remove('is-held'); if (p < 1) { sp.to(0); if (o.early) o.early(p); } }
    btn.addEventListener('pointerdown', function (e) { if (e.button) return; e.preventDefault(); btn.focus({ preventScroll: true }); try { btn.setPointerCapture(e.pointerId); } catch (er) {} start(); });
    btn.addEventListener('pointerup', stop); btn.addEventListener('pointercancel', stop); btn.addEventListener('lostpointercapture', stop);
    btn.addEventListener('keydown', function (e) { if (e.key !== ' ' && e.key !== 'Enter') return; e.preventDefault(); if (!e.repeat) start(); });
    btn.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); stop(); } });
    btn.addEventListener('blur', stop);
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    btn.addEventListener('click', function (e) { e.preventDefault(); });
    return { reset: function () { done = false; held = false; btn.removeAttribute('aria-disabled'); btn.classList.remove('is-held'); sp.jump(0); }, p: function () { return p; } };
  };
  /* icons that morph: each shape moves on an interruptible spring, so a fast second press turns it back from where it is */
  var uid = 0;
  function pts(a, b, t) { var s = ''; for (var i = 0; i < a.length; i += 2) s += (i ? 'L' : 'M') + L(a[i], b[i], t).toFixed(2) + ' ' + L(a[i + 1], b[i + 1], t).toFixed(2); return s; }
  function dash(p) { var l = p.getTotalLength ? p.getTotalLength() : 24; p.style.strokeDasharray = l + ' ' + l; return l; }
  function ring(el, frames, ms) { if (moving()) el.animate(frames, { duration: ms || 900, easing: 'ease-out' }); }
  T.MORPH = {
    menu: { zeta: .64, draw: function (t, P) { P.a.setAttribute('transform', 'translate(0 ' + (5 * t).toFixed(3) + ') rotate(' + (45 * t).toFixed(2) + ' 12 7)'); P.c.setAttribute('transform', 'translate(0 ' + (-5 * t).toFixed(3) + ') rotate(' + (-45 * t).toFixed(2) + ' 12 17)'); P.b.style.opacity = cl(1 - t * 1.8); P.b.setAttribute('transform', 'translate(12 0) scale(' + Math.max(.2, 1 - .8 * t).toFixed(3) + ' 1) translate(-12 0)'); } },
    play: { zeta: .8, draw: function (t, P) { t = Math.max(-.06, Math.min(1.06, t)); P.a.setAttribute('d', pts([8, 5, 12.5, 7.6, 12.5, 16.4, 8, 19], [7, 5, 10.5, 5, 10.5, 19, 7, 19], t) + 'Z'); P.b.setAttribute('d', pts([12.5, 7.6, 19, 11.6, 19, 12.4, 12.5, 16.4], [13.5, 5, 17, 5, 17, 19, 13.5, 19], t) + 'Z'); } },
    plus: { zeta: .6, draw: function (t, P) { P.a.setAttribute('d', pts([12, 5, 12, 19], [18.4, 7.6, 10.2, 16.8], t)); P.b.setAttribute('d', pts([5, 12, 19, 12], [5.6, 12.4, 10.2, 16.8], t)); } },
    copy: { zeta: .9, init: function (s, P) { P.k._l = dash(P.k); }, draw: function (t, P) { var f = cl(1 - t * 2), k = cl((t - .12) / .88); P.a.setAttribute('transform', 'translate(' + (3 * t).toFixed(2) + ' ' + (3 * t).toFixed(2) + ')'); P.a.style.opacity = f; P.b.setAttribute('transform', 'translate(14.5 14.5) scale(' + (1 - .3 * cl(t)).toFixed(3) + ') translate(-14.5 -14.5)'); P.b.style.opacity = f; P.k.style.strokeDashoffset = (P.k._l * (1 - k)).toFixed(2); P.k.style.opacity = k > .01 ? 1 : 0; } },
    theme: { zeta: .78, init: function (s, P) { var a = 't4m' + (++uid), b = a + 'c'; P.mk.id = a; P.cp.id = b; P.d.setAttribute('mask', 'url(#' + a + ')'); P.s.setAttribute('clip-path', 'url(#' + b + ')'); },
      draw: function (t, P) { var r = (4.2 + 3.8 * t).toFixed(2), x = L(27, 17.4, t).toFixed(2), y = L(-3, 6.6, t).toFixed(2); P.d.setAttribute('r', r); P.q.setAttribute('r', r); [P.m, P.s].forEach(function (c) { c.setAttribute('cx', x); c.setAttribute('cy', y); }); P.r.setAttribute('transform', 'rotate(' + (90 * t).toFixed(2) + ' 12 12) translate(12 12) scale(' + Math.max(.3, 1 - .6 * t).toFixed(3) + ') translate(-12 -12)'); P.r.style.opacity = cl(1 - t * 1.5); } },
    chev: { zeta: .6, draw: function (t, P) { P.a.setAttribute('transform', 'rotate(' + (180 * t).toFixed(2) + ' 12 12)'); } },
    /* on = alerts on: the strike undraws and the bell rings once */
    bell: { zeta: .9, init: function (s, P) { var a = 't4m' + (++uid); P.mk.id = a; P.g.setAttribute('mask', 'url(#' + a + ')'); P.s._l = dash(P.s); dash(P.m); }, once: function (P) { ring(P.b, [{ transform: 'rotate(0)' }, { transform: 'rotate(16deg)' }, { transform: 'rotate(-13deg)' }, { transform: 'rotate(9deg)' }, { transform: 'rotate(-5deg)' }, { transform: 'rotate(0)' }]); ring(P.c, [{ transform: 'none' }, { transform: 'translateX(-2px)' }, { transform: 'translateX(2px)' }, { transform: 'translateX(-1.2px)' }, { transform: 'none' }]); },
      draw: function (t, P) { var o = (P.s._l * cl(t)).toFixed(2); P.s.style.strokeDashoffset = o; P.m.style.strokeDashoffset = o; P.s.style.opacity = t > .98 ? 0 : 1; } },
    /* on = shown: the strike undraws and the eye opens wide */
    eye: { zeta: .7, init: function (s, P) { var a = 't4m' + (++uid); P.mk.id = a; P.g.setAttribute('mask', 'url(#' + a + ')'); P.s._l = dash(P.s); dash(P.m); },
      draw: function (t, P) { var o = (P.s._l * cl(t)).toFixed(2); P.s.style.strokeDashoffset = o; P.m.style.strokeDashoffset = o; P.s.style.opacity = t > .98 ? 0 : 1; P.p.setAttribute('r', (1.6 + 1.2 * t).toFixed(2)); } },
  };
  T.morph = function (svg, kind, o) {
    o = o || {}; var K = T.MORPH[kind], P = {}, on = !!o.on;
    $$('[data-p]', svg).forEach(function (p) { P[p.getAttribute('data-p')] = p; }); if (K.init) K.init(svg, P);
    svg.classList.toggle('on', on);
    var v = TLvec([on ? 1 : 0], function (x) { K.draw(x[0], P, svg); }, { dur: o.dur || K.dur || 460, zeta: o.zeta || K.zeta || .66 });
    return { set: function (s) { s = !!s; if (s && !on && K.once) K.once(P, svg); on = s; svg.classList.toggle('on', on); v.to([on ? 1 : 0]); }, get: function () { return on; } };
  };
  /* the page theme: System, Light or Night. Saved like the lab's own top bar does (taste-lab-v1). The new theme
     arrives through a view transition when the browser has one; otherwise, and with motion off, it changes at once. */
  var mq = matchMedia('(prefers-color-scheme: dark)'), KEY = 'taste-lab-v1', fns = [], own = false;
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function cur() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  var th = T.theme = { choice: read().theme || 'system', vt: null,
    cur: cur, sys: function () { return mq.matches ? 'dark' : 'light'; },
    on: function (fn) { fns.push(fn); fn(th.choice, cur(), true); },
    /* how: 'wipe' 'eclipse' 'split' 'rise' 'drop' 'circle' 'fade'; from: the button, for the circle */
    set: function (choice, how, from) {
      th.choice = choice; var next = choice === 'system' ? th.sys() : choice;
      try { var s = read(); s.theme = choice === 'system' ? '' : choice; s.motion = root.getAttribute('data-motion'); localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
      if (next === cur()) { fns.forEach(function (f) { f(th.choice, cur()); }); return; }
      function apply() { own = true; root.setAttribute('data-theme', next); var tb = document.getElementById('themeBtn'); if (tb) tb.setAttribute('aria-label', next === 'dark' ? 'Switch to day theme' : 'Switch to night theme'); }
      if (th.vt) { try { th.vt.skipTransition(); } catch (e) {} }
      if (!moving() || !document.startViewTransition) { apply(); return; }
      var r = from ? from.getBoundingClientRect() : null, x = r ? r.left + r.width / 2 : innerWidth / 2, y = r ? r.top + r.height / 2 : 0, R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      var calm = lvl() === 'calm', K = {
        wipe: [['inset(0 100% 0 0)', 'inset(0 0 0 0)'], 380], eclipse: [['ellipse(0% 110% at 50% 50%)', 'ellipse(80% 110% at 50% 50%)'], 430],
        split: [['inset(50% 0 50% 0)', 'inset(0 0 0 0)'], 390], rise: [['inset(100% 0 0 0)', 'inset(0 0 0 0)'], 360], drop: [['inset(0 0 100% 0)', 'inset(0 0 0 0)'], 450],
        circle: [['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + R + 'px at ' + x + 'px ' + y + 'px)'], 520] }[how];
      root.setAttribute('data-t4vt', how); root.classList.add('t4-vt');
      var vt = document.startViewTransition(apply); th.vt = vt;
      vt.ready.then(function () {
        var o = { duration: (K ? K[1] : 280) * (calm ? .6 : 1), easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)', fill: 'both' };
        if (K) root.animate({ clipPath: K[0] }, o); else root.animate({ opacity: [0, 1] }, o);
      }, function () {});
      var end = function () { if (th.vt === vt) { th.vt = null; root.removeAttribute('data-t4vt'); root.classList.remove('t4-vt'); } };
      vt.finished.then(end, end);
    }
  };
  /* any change of data-theme (ours, the lab's top bar, or the device in System) reaches every switch */
  new MutationObserver(function () { if (!own) th.choice = cur(); own = false; fns.forEach(function (f) { f(th.choice, cur()); }); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  var onSys = function () { if (th.choice === 'system') th.set('system', 'fade'); };
  if (mq.addEventListener) mq.addEventListener('change', onSys); else if (mq.addListener) mq.addListener(onSys);
})(window.TL4b);`;

/* ---------------- 06 Button group ---------------- */
const CSS4 = `/* ---- round 4 batch b shared ---- */
.t4b-rs { display: inline-grid; }
.t4b-rs > * { grid-area: 1 / 1; white-space: nowrap; transition: opacity .1s var(--ease-out), transform .18s var(--ease-out), filter .1s var(--ease-out); }
.t4b-rs > :not(.on) { opacity: 0; transform: translateY(5px); filter: blur(2px); }
.t4b-rs > .out:not(.on) { transform: translateY(-5px); }
.t4b-rs > .on { transition: opacity .16s var(--ease-out) .04s, transform var(--sp-snappy-d) var(--sp-snappy) .04s, filter .16s var(--ease-out) .04s; }
.t4b-hl { position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0; background: rgb(var(--ink-rgb) / .07); transition: opacity .16s var(--ease-out), background-color .15s; }
.t4b-hl.on { opacity: 1; }
.t4b-hl.down { background: rgb(var(--ink-rgb) / .13); }
.t4b-mi { display: block; width: 22px; height: 22px; overflow: visible; }
.t4b-tk { stroke: var(--accent); }
.t4b-ok.on { color: var(--accent); }
.t4b-ok { transition: color .2s var(--ease-out); }
.t4b-msg { margin: 0; min-height: 1.45em; font-size: 13px; color: var(--muted); }
.t4b-b:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
html[data-t4vt]::view-transition-old(root), html[data-t4vt]::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
html.t4-vt *:not(.t4b-keep, .t4b-keep *), html.t4-vt *:not(.t4b-keep, .t4b-keep *)::before, html.t4-vt *:not(.t4b-keep, .t4b-keep *)::after { transition: none !important; }
/* ---- 06 ---- */
#btngroup .bg6 { width: min(100%, 340px); display: grid; gap: 12px; justify-items: start; text-align: left; }
#btngroup .bg6-card { width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); }
#btngroup .bg6-card .l-av { width: 30px; height: 30px; flex-basis: 30px; font-size: 12px; }
#btngroup .bg6-card b { display: block; font-size: 14px; color: var(--ink); }
#btngroup .bg6-card small { font-size: 12.5px; color: var(--muted); }
#btngroup .bg6-w { position: relative; }
#btngroup .bg6-g { position: relative; display: inline-flex; padding: 3px; border-radius: 10px; border: 1px solid var(--line-hi); background: var(--paper-raised); box-shadow: var(--shadow-sm); }
#btngroup .bg6-s { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 11px; border-radius: 7px; font-size: 13.5px; font-weight: 500; color: var(--ink); white-space: nowrap; }
#btngroup .bg6-s > * { transition: scale .14s var(--ease-out); }
#btngroup .bg6-s:active > * { scale: .97; }
#btngroup .bg6-s.ic:active > * { scale: .9; }
#btngroup .bg6-s svg { width: 15px; height: 15px; flex: 0 0 15px; color: var(--ink-soft); }
#btngroup .bg6-s + .bg6-s::before { content: ""; position: absolute; left: -.5px; top: 9px; bottom: 9px; width: 1px; background: var(--line-hi); transition: opacity .16s var(--ease-out); }
#btngroup .bg6-s.near::before { opacity: 0; }
#btngroup .bg6-s:focus { outline: none; }
#btngroup .bg6-s:focus-visible { box-shadow: 0 0 0 2px var(--accent); }
#btngroup .bg6-ch { padding: 0 9px; }
#btngroup .bg6-ch svg { transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#btngroup .bg6-ch[aria-expanded="true"] svg { transform: rotate(180deg); }
#btngroup .bg6-m { position: absolute; z-index: 5; top: calc(100% + 6px); right: 0; width: 200px; transform-origin: top right; --from: translateY(-6px) scale(.96); --in: var(--sp-snappy-d); --ease: var(--sp-snappy); }
#btngroup .bg6-m .l-item { font-size: 13.5px; }
#btngroup .bg6-m .warn { color: var(--accent-text); }
#btngroup .bg6-m .warn svg { color: var(--accent-text); }
#btngroup .bg6-m hr { border: 0; border-top: 1px solid var(--line); margin: 4px 2px; }
#btngroup .bg6-mh { position: absolute; left: 5px; right: 5px; top: 0; border-radius: 8px; background: rgb(var(--ink-rgb) / .07); opacity: 0; transition: transform var(--sp-snappy-d) var(--sp-snappy), height .2s var(--ease-out), opacity .15s; pointer-events: none; }
#btngroup .bg6-m .l-item[data-on], #btngroup .bg6-m .l-item:hover { background: none; }
@media (max-width: 400px) { #btngroup .bg6-s:not(.ic) > svg { display: none; } #btngroup .bg6-s { padding: 0 9px; } }`;

/* the shared builder: one group, glide on or off */
const BG6 = String.raw`
TL4b.bg6 = function (box, o) {
  var g = $('[data-g]', box), segs = $$('[data-s]', box), msg = $('[data-msg]', box), live = $('[data-live]', box), hlEl = $('[data-hl]', box);
  var hl = o.glide ? TL4b.hl(g, hlEl, { r: 7, onMove: function (b) { var i = segs.indexOf(b); segs.forEach(function (s, j) { s.classList.toggle('near', i >= 0 && (j === i || j === i + 1)); }); } }) : null;
  var touch = false;
  if (hl) {
    g.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; var s = e.target.closest && e.target.closest('[data-s]'); if (s && s !== hl.cur()) hl.to(s); });
    g.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !(document.activeElement && g.contains(document.activeElement) && document.activeElement.matches(':focus-visible'))) hl.hide(); });
    segs.forEach(function (s) {
      s.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') { touch = true; hl.to(s); } hl.press(true); });
      s.addEventListener('focus', function () { if (s.matches(':focus-visible')) hl.to(s); });
      s.addEventListener('blur', function () { setTimeout(function () { if (!g.contains(document.activeElement) && !g.matches(':hover')) hl.hide(); }, 0); });
      s.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) hl.press(true); });
      s.addEventListener('keyup', function () { hl.press(false); });
    });
    var up = function () { hl.press(false); if (touch) { touch = false; setTimeout(function () { hl.hide(); }, 160); } };
    document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up);
  }
  TL4b.rove(segs, { skip: function (e, i) { return e.key === 'ArrowDown' && segs[i].hasAttribute('aria-haspopup'); } });
  var t = 0;
  segs.forEach(function (s) { s.addEventListener('click', function () {
    var k = s.getAttribute('data-s'), r = $('.t4b-rs', s);
    if (o.act[k]) { var w = o.act[k](s); if (w) { msg.textContent = w; } }
    if (r && $('[data-k="d"]', r)) { TL4b.copy('https://pay.example.com/i/4821').then(function (ok) { TL4b.swap(r, ok ? 'd' : 'f'); TL4b.say(live, ok ? 'Link copied' : 'Could not copy'); msg.textContent = ok ? 'Link to invoice #4821 copied.' : 'Could not copy. The link is pay.example.com/i/4821.'; clearTimeout(t); t = setTimeout(function () { TL4b.swap(r, 'a'); }, 1700); }); }
  }); });
  var ch = $('[aria-haspopup]', box), menu = $('[data-menu]', box);
  if (ch && menu) {
    var mh = $('[data-mh]', menu), p = pop(ch, menu, { focus: '[role="menuitem"]', onClose: function () { nv.clear(); } });
    var nv = nav(menu, '[role="menuitem"]', { focus: true, loop: true, hl: mh });
    ch.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' && !p.isOpen()) { e.preventDefault(); p.set(true); } });
    menu.addEventListener('keydown', function (e) { if (e.key === 'Tab') p.set(false, false); });
    $$('[role="menuitem"]', menu).forEach(function (it) { it.addEventListener('click', function () { msg.textContent = it.getAttribute('data-say'); p.set(false); }); });
  }
};`;

const bg6Html = (lbls = true) => `<div class="bg6"><div class="bg6-card"><span class="l-av">AO</span><span><b>Invoice #4821</b><small>Amina Otieno · KES 4,200 · due Friday</small></span></div>
<div class="bg6-w"><div class="bg6-g" role="group" aria-label="Invoice actions" data-g><span class="t4b-hl" data-hl></span>
<button class="bg6-s" type="button" data-s="edit">${I.edit}<span>Edit</span></button><button class="bg6-s" type="button" data-s="dup">${I.copy}<span>Duplicate</span></button><button class="bg6-s" type="button" data-s="share">${I.share}${rs([['a', 'Share'], ['d', 'Copied'], ['f', 'Failed']])}</button><button class="bg6-s bg6-ch ic" type="button" data-s="more" aria-haspopup="menu" aria-label="More actions">${I.chev}</button></div>
<div class="bg6-m l-panel l-pop" role="menu" aria-label="More actions" data-menu><span class="bg6-mh" data-mh></span>
<button class="l-item" type="button" role="menuitem" tabindex="-1" data-say="Reminder sent to Amina on +254 712 345 678.">${I.bell}Send reminder</button>
<button class="l-item" type="button" role="menuitem" tabindex="-1" data-say="Invoice #4821 marked as paid.">${I.check}Mark as paid</button>
<button class="l-item" type="button" role="menuitem" tabindex="-1" data-say="Invoice #4821 moved to the archive.">${I.archive}Archive</button><hr>
<button class="l-item warn" type="button" role="menuitem" tabindex="-1" data-say="Invoice #4821 deleted. Undo is in the bin for 30 days.">${I.trash}Delete invoice</button></div></div>
<p class="t4b-msg" data-msg aria-live="polite">Nothing done yet.</p><p class="sr" aria-live="polite" data-live></p></div>`;
const bg6Act = `{ edit: function () { return 'Editing invoice #4821.'; }, dup: function () { return 'Made a copy: invoice #4822.'; } }`;

const btngroup = {
  id: 'btngroup', n: '06', name: 'Button group', h: 330,
  claim: 'A row of buttons can <em>read as one shape.</em>',
  lead: 'Related actions joined in one bar. Move the pointer along the bar, press a part, and try Tab and the arrow keys. Share really copies a link.',
  ref: { ids: 'n15', text: 'The split button: one main action, and a menu that grows from the chevron.' },
  noteHint: 'B, but the highlight a little darker', moreHint: 'a group of three view buttons, like Day, Week and Month',
  css: CSS4,
  js: H4 + BG6,
  opts: [
    {
      k: 'B', name: 'One highlight glides along the bar', line: 'One soft highlight lives under all the parts and glides to the one you point at. The thin lines beside it fade, so it reads as one shape. A press dips the words, and Share turns into Copied in the same box, so nothing moves.',
      from: [arc('button-group'), house('n15')], tryit: 'Slide along the bar, press Share, then open the arrow.',
      needs: 'Script and a spring.', keys: 'Tab moves through each part. Left and right arrows move too, and wrap. Down on the arrow opens the menu; Escape closes it.', off: 'The highlight jumps to its part; the word swaps at once.', law: 'Proximity: actions on one invoice sit in one bar.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:clear', 'new:twist', 'look:ember'], top: true,
      html: bg6Html(), js: `TL4b.bg6(box, { glide: true, act: ${bg6Act} });`,
    },
    {
      k: 'A', name: 'A plain joined bar', line: 'The same bar the usual way: each part gets its own grey fill when you point at it. The lines stay put. Copied shows in the same box.',
      from: [sh('button-group', 'shadcn/ui button group')], tryit: 'Point at each part, press Share, then open the arrow.',
      needs: 'CSS and a few lines of script.', keys: 'Tab and the arrow keys move along the bar; Down opens the menu.', off: 'Same, without the fade.', law: 'Jakob: the toolbar everyone knows.',
      tags: ['motion:still', 'speed:quick', 'density:mid', 'feedback:quiet', 'new:familiar', 'look:ember'], top: true,
      html: bg6Html(), css: `#t06A .bg6-s:hover { background: rgb(var(--ink-rgb) / .07); }
#t06A .bg6-s:active { background: rgb(var(--ink-rgb) / .12); }
#t06A .bg6-m { --from: none; --in: .12s; --ease: linear; }`,
      js: `TL4b.bg6(box, { glide: false, act: ${bg6Act} });`,
    },
    {
      k: 'C', name: 'A zoom bar with a rolling number', line: 'Icon parts for zoom, with the size in the middle. The highlight glides between them and a press dips the icon deeper. The number rolls to its new value, and the receipt grows on a spring.',
      kind: 'Mix', from: [arc('button-group'), house('n07')], tryit: 'Press plus a few times, then press the number to go back to 100%.',
      needs: 'Script, a spring and the shared number roll.', keys: 'Tab or the arrows move along; Enter presses. At the ends the button says it cannot go further.', off: 'The highlight jumps, the number and the receipt change at once.', law: 'Fitts: big targets in a short row.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'new:twist', 'look:ember'], h: 300,
      html: `<div class="zm"><div class="zm-v" aria-hidden="true"><div class="zm-r" data-r><b>Duka Fresh</b><span>Sukuma wiki ×2<i>KES 80</i></span><span>Maziwa 1 L<i>KES 120</i></span><span class="zm-t">Total<i>KES 200</i></span></div></div>
<div class="bg6-g" role="group" aria-label="Receipt zoom" data-g><span class="t4b-hl" data-hl></span>
<button class="bg6-s ic" type="button" data-s="out" aria-label="Zoom out">${I.zout}</button><button class="bg6-s zm-n" type="button" data-s="reset" aria-label="Zoom 100%. Press to reset"><span data-n></span></button><button class="bg6-s ic" type="button" data-s="in" aria-label="Zoom in">${I.zin}</button><button class="bg6-s ic" type="button" data-s="fit" aria-label="Fit to the box">${I.fit}</button></div>
<p class="t4b-msg" data-msg aria-live="polite">Receipt at 100%.</p><p class="sr" aria-live="polite" data-live></p></div>`,
      css: `#t06C .zm { display: grid; justify-items: center; gap: 12px; width: 100%; }
#t06C .zm-v { width: min(100%, 260px); height: 132px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-sunk); overflow: hidden; display: grid; place-items: center; }
#t06C .zm-r { width: 150px; display: grid; gap: 3px; padding: 10px 12px; border-radius: 6px; background: var(--paper-raised); box-shadow: var(--shadow-sm); font-size: 11px; color: var(--ink-soft); transition: transform var(--sp-bouncy-d) var(--sp-bouncy); }
#t06C .zm-r b { font-size: 12px; color: var(--ink); }
#t06C .zm-r span { display: flex; justify-content: space-between; }
#t06C .zm-r i { font-style: normal; font-variant-numeric: tabular-nums; }
#t06C .zm-t { border-top: 1px dashed var(--line-hi); padding-top: 3px; color: var(--ink); font-weight: 600; }
#t06C .bg6-s.ic { width: 38px; justify-content: center; padding: 0; }
#t06C .bg6-s.ic svg { width: 17px; height: 17px; flex-basis: 17px; }
#t06C .zm-n { min-width: 64px; justify-content: center; font-family: var(--font-num); font-size: 16px; }
#t06C .bg6-s[aria-disabled="true"] svg { color: var(--dim); }`,
      js: `var r = $('[data-r]', box), nb = $('[data-s="reset"]', box), z = 100, live = $('[data-live]', box);
var roll = TLroll($('[data-n]', box), { value: 100, fmt: function (n) { return n + '%'; }, live: false, dur: 520 });
var bOut = $('[data-s="out"]', box), bIn = $('[data-s="in"]', box);
function set(n, why) { n = Math.max(50, Math.min(200, n)); var d = n > z ? 'up' : 'down'; z = n; roll.set(n, { dir: d }); r.style.transform = 'scale(' + (n / 100) + ')'; nb.setAttribute('aria-label', 'Zoom ' + n + '%. Press to reset');
  bOut.setAttribute('aria-disabled', String(n <= 50)); bIn.setAttribute('aria-disabled', String(n >= 200)); TL4b.say(live, n + '%'); return why || ('Receipt at ' + n + '%.'); }
TL4b.bg6(box, { glide: true, act: {
  out: function () { return z <= 50 ? 'This is as small as it goes.' : set(z - 25); },
  in: function () { return z >= 200 ? 'This is as big as it goes.' : set(z + 25); },
  reset: function () { return set(100, 'Back to 100%.'); },
  fit: function () { return set(150, 'Fitted to the box: 150%.'); } } });`,
    },
    {
      k: 'D', name: 'Your split button, pushed', line: 'Your n15 split button, pushed. Pick how to send in the menu: the main button changes its words in the same box, so it never jumps. Press it and it shows a spinner, then an orange tick.',
      kind: 'Reference, pushed', from: [house('n15'), arc('button-group')], tryit: 'Open the arrow, pick Email, then press Send.',
      needs: 'Script and the shared highlight.', keys: 'Tab to each half. Down on the arrow opens the menu; arrows move, Enter picks, Escape closes.', off: 'The words swap at once; the menu shows at once.', law: 'Hick: one main action, the other ways one step away.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'open:trigger', 'new:twist', 'look:ember'], top: true, h: 300,
      html: `<div class="sp"><p class="sp-k"><b>Invoice #4821</b> · KES 4,200 to Amina Otieno</p><div class="sp-w"><div class="sp-g">
<button class="sp-m t4b-b" type="button" data-main><span class="sp-i" data-ic>${rs([['sms', I.chat], ['mail', I.mail], ['link', I.link], ['busy', '<span class="l-spin"></span>'], ['ok', TK0]])}</span>${rs([['sms', 'Send by SMS'], ['mail', 'Send by email'], ['link', 'Copy pay link'], ['busy', 'Sending…'], ['ok', 'Sent']], 'sp-l')}</button>
<button class="sp-c t4b-b" type="button" aria-haspopup="menu" aria-label="Other ways to send" data-ch>${I.chev}</button></div>
<div class="l-panel l-pop sp-menu" role="menu" aria-label="Ways to send" data-menu><span class="t4b-hl" data-hl></span>
<button class="l-item" type="button" role="menuitemradio" aria-checked="true" tabindex="-1" data-w="sms">${I.chat}<span>SMS to +254 712 345 678</span></button>
<button class="l-item" type="button" role="menuitemradio" aria-checked="false" tabindex="-1" data-w="mail">${I.mail}<span>Email to amina@example.com</span></button>
<button class="l-item" type="button" role="menuitemradio" aria-checked="false" tabindex="-1" data-w="link">${I.link}<span>Copy a pay link</span></button></div></div>
<p class="t4b-msg" data-msg aria-live="polite">Not sent yet.</p></div>`,
      css: `#t06D .sp { width: min(100%, 320px); display: grid; gap: 12px; justify-items: start; text-align: left; }
#t06D .sp-k { margin: 0; font-size: 13.5px; color: var(--ink-soft); } #t06D .sp-k b { color: var(--ink); }
#t06D .sp-w { position: relative; }
#t06D .sp-g { display: inline-flex; border-radius: 10px; background: var(--accent); color: var(--on-accent); box-shadow: var(--shadow-sm); }
#t06D .sp-m, #t06D .sp-c { display: inline-flex; align-items: center; gap: 8px; height: 40px; font-size: 14.5px; font-weight: 600; color: inherit; transition: background-color .15s; }
#t06D .sp-m { padding: 0 14px; border-radius: 10px 0 0 10px; }
#t06D .sp-c { padding: 0 11px; border-radius: 0 10px 10px 0; border-left: 1px solid rgb(0 0 0 / .18); }
#t06D .sp-m:hover, #t06D .sp-c:hover { background: rgb(0 0 0 / .08); }
#t06D .sp-m:active > *, #t06D .sp-c:active svg { scale: .96; }
#t06D .sp-m > *, #t06D .sp-c svg { transition: scale .14s var(--ease-out), transform var(--sp-snappy-d) var(--sp-snappy); }
#t06D .sp-c[aria-expanded="true"] svg { transform: rotate(180deg); }
#t06D .sp-i { display: grid; width: 18px; height: 18px; } #t06D .sp-i > .t4b-rs { place-items: center; } #t06D .sp-i svg { width: 16px; height: 16px; }
#t06D .sp-i .l-tick { width: 18px; height: 18px; } #t06D .sp-i .l-tick circle { fill: var(--on-accent); } #t06D .sp-i .l-tick path { stroke: var(--accent); }
#t06D .sp-menu { position: absolute; z-index: 5; top: calc(100% + 6px); left: 0; width: min(270px, calc(100vw - 80px)); transform-origin: top right; --from: translateY(-6px) scale(.96); --in: var(--sp-snappy-d); --ease: var(--sp-snappy); }
#t06D .sp-menu .t4b-hl { border-radius: 8px; }
#t06D .sp-menu .l-item[data-on], #t06D .sp-menu .l-item:hover { background: none; }
#t06D .sp-menu .l-item[aria-checked="true"] { font-weight: 600; }
#t06D .sp-menu .l-item span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`,
      js: `var main = $('[data-main]', box), ch = $('[data-ch]', box), menu = $('[data-menu]', box), msg = $('[data-msg]', box), ic = $('[data-ic] .t4b-rs', box), lb = $('.sp-l', box), way = 'sms', busy = false;
var its = $$('[role="menuitemradio"]', menu), hl = TL4b.hl(menu, $('[data-hl]', menu), { r: 8 });
var p = pop(ch, menu, { focus: '[aria-checked="true"]', onOpen: function () { setTimeout(function () { hl.to($('[aria-checked="true"]', menu)); }, 30); }, onClose: function () { hl.hide(); } });
ch.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' && !p.isOpen()) { e.preventDefault(); p.set(true); } });
TL4b.rove(its, { vertical: true });
its.forEach(function (it) { it.addEventListener('focus', function () { hl.to(it); }); it.addEventListener('pointermove', function () { if (hl.cur() !== it) it.focus({ preventScroll: true }); });
  it.addEventListener('pointerdown', function () { hl.press(true); }); it.addEventListener('pointerup', function () { hl.press(false); });
  it.addEventListener('click', function () { way = it.getAttribute('data-w'); its.forEach(function (x) { x.setAttribute('aria-checked', String(x === it)); }); TL4b.swap(ic, way); TL4b.swap(lb, way); msg.textContent = 'The main button now: ' + lb.querySelector('.on').textContent + '.'; p.set(false); }); });
menu.addEventListener('keydown', function (e) { if (e.key === 'Tab') p.set(false, false); if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.activeElement.click(); } });
main.addEventListener('click', function () { if (busy) return; busy = true; main.setAttribute('aria-busy', 'true'); TL4b.swap(ic, 'busy'); TL4b.swap(lb, 'busy');
  var done = function (ok) { $('[data-k="ok"]', ic).innerHTML = TICK; TL4b.swap(ic, 'ok'); TL4b.swap(lb, 'ok'); main.removeAttribute('aria-busy');
    msg.textContent = way === 'sms' ? 'Sent by SMS to +254 712 345 678.' : way === 'mail' ? 'Sent to amina@example.com.' : ok ? 'Pay link copied: pay.example.com/i/4821.' : 'Could not copy. The link is pay.example.com/i/4821.';
    setTimeout(function () { TL4b.swap(ic, way); TL4b.swap(lb, way); busy = false; }, 1800); };
  if (way === 'link') TL4b.copy('https://pay.example.com/i/4821').then(function (ok) { setTimeout(function () { done(ok); }, 500); }); else setTimeout(function () { done(true); }, 1100); });`,
    },
  ],
};

/* ---------------- 07 Floating button group ---------------- */
const FG = String.raw`
/* a tray of separate buttons with one highlight that follows the pointer and the keys and stays put over gaps */
TL4b.fg = function (box, o) {
  o = o || {}; var tray = $('[data-tray]', box), bs = $$('[data-b]', tray), hlEl = $('[data-hl]', tray), cap = $('[data-cap]', box), capL = cap ? TLline(cap) : null;
  var hl = o.plain ? null : TL4b.hl(tray, hlEl, { r: o.r || 9, onMove: function (b) { if (capL) capL.set(b ? b.getAttribute('data-name') || b.getAttribute('aria-label') || b.textContent.trim() : o.capRest || '', 1); } });
  var rv = TL4b.rove(bs, { single: true, grid: !!o.grid, vertical: !!o.vertical });
  if (hl) {
    tray.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse') return; var b = e.target.closest && e.target.closest('[data-b]'); if (b && b !== hl.cur()) hl.to(b); });
    tray.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'mouse') return; var f = document.activeElement; if (f && tray.contains(f) && f.matches(':focus-visible')) hl.to(f); else hl.hide(); });
    bs.forEach(function (b) {
      b.addEventListener('focus', function () { if (b.matches(':focus-visible')) hl.to(b); });
      b.addEventListener('blur', function () { setTimeout(function () { if (!tray.contains(document.activeElement) && !tray.matches(':hover')) hl.hide(); }, 0); });
      b.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') hl.to(b); hl.press(true); });
      b.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) hl.press(true); });
      b.addEventListener('keyup', function () { hl.press(false); });
    });
    var up = function (e) { hl.press(false); if (e && e.pointerType && e.pointerType !== 'mouse') setTimeout(function () { hl.hide(); }, 180); };
    document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up);
  }
  bs.forEach(function (b) { b.addEventListener('click', function () { if (o.act) o.act(b.getAttribute('data-b'), b); }); });
  return { hl: hl, rv: rv };
};`;

const fgTray = `<div class="fg-tray" role="toolbar" aria-label="Receipt tools" data-tray><span class="t4b-hl" data-hl></span>
<button class="fg-b ic" type="button" data-b="prev" aria-label="Previous receipt">${I.left}</button><button class="fg-b ic" type="button" data-b="next" aria-label="Next receipt">${I.right}</button><span class="fg-sep" role="separator" aria-orientation="vertical"></span>
<button class="fg-b" type="button" data-b="copy" data-name="Copy link">${I.link}${rs([['a', 'Copy link'], ['d', 'Copied'], ['f', 'Failed']])}</button><span class="fg-sep" role="separator" aria-orientation="vertical"></span>
<button class="fg-b ic" type="button" data-b="info" aria-label="Details" aria-pressed="false">${I.info}</button></div>`;
const fgHtml = `<div class="fg"><div class="fg-doc" aria-live="polite"><span class="fg-n">Receipt <b data-n></b> of 5</span><b class="fg-who" data-who>Duka Fresh · KES 1,240</b><span class="fg-more" data-more hidden>Paid with PocketPay from +254 712 345 678 at 9:14 am.</span></div>
${fgTray}<p class="fg-cap" aria-hidden="true"><span data-cap>Point at a button</span></p><p class="sr" aria-live="polite" data-live></p></div>`;
const fgJs = (plain) => `var n = 1, who = $('[data-who]', box), more = $('[data-more]', box), live = $('[data-live]', box), t = 0;
var R = ['Duka Fresh · KES 1,240', 'Mawimbi Mobile · KES 499', 'Duka Fresh · KES 380', 'PocketPay top-up · KES 2,000', 'Kilimani Pharmacy · KES 860'];
var roll = TLroll($('[data-n]', box), { value: 1, live: false, dur: 480 });
function go(d) { n = (n - 1 + d + 5) % 5 + 1; roll.set(n, { dir: d > 0 ? 'up' : 'down' }); who.textContent = R[n - 1]; }
TL4b.fg(box, { plain: ${plain}, capRest: 'Point at a button', act: function (k, b) {
  if (k === 'prev') go(-1); else if (k === 'next') go(1);
  else if (k === 'info') { var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); more.hidden = !on; }
  else if (k === 'copy') { var r = $('.t4b-rs', b); TL4b.copy('https://pay.example.com/r/' + (4820 + n)).then(function (ok) { TL4b.swap(r, ok ? 'd' : 'f'); TL4b.say(live, ok ? 'Receipt link copied' : 'Could not copy'); clearTimeout(t); t = setTimeout(function () { TL4b.swap(r, 'a'); }, 1700); }); }
} });`;

const floatgroup = {
  id: 'floatgroup', n: '07', name: 'Floating button group', h: 280,
  claim: 'One highlight can <em>travel between buttons</em> and change its size.',
  lead: 'Separate buttons in a small floating tray. One highlight follows you, grows or shrinks to fit each button, and stays put while you cross a gap. Our dropdowns have a glide too: D puts the new one and ours side by side.',
  ref: { ids: 'n32', text: 'Our glide today: in the springy dropdown (and the lab\'s menus) a highlight moves up and down to the row under the pointer on a CSS spring. It only moves in one direction, starts again from zero speed when you change your mind, and slides over from the last row when you come back.' },
  noteHint: 'B, but the tray without a shadow', moreHint: 'a tray down the side of a map',
  css: `#floatgroup .fg { display: grid; justify-items: center; gap: 12px; width: 100%; }
#floatgroup .fg-doc { display: grid; gap: 2px; text-align: center; min-height: 66px; align-content: center; }
#floatgroup .fg-n { font: 500 11px/1.4 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
#floatgroup .fg-who { font-size: 15px; color: var(--ink); }
#floatgroup .fg-more { font-size: 12.5px; color: var(--muted); max-width: 260px; }
#floatgroup .fg-tray { position: relative; display: inline-flex; align-items: center; gap: 4px; padding: 5px; border-radius: 14px; border: 1px solid var(--line); background: var(--paper-raised); box-shadow: var(--shadow-lg); }
#floatgroup .fg-b { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 7px; height: 38px; padding: 0 13px; border-radius: 9px; font-size: 14px; font-weight: 500; color: var(--ink); white-space: nowrap; }
#floatgroup .fg-b.ic { width: 38px; padding: 0; justify-content: center; }
#floatgroup .fg-b svg { width: 16px; height: 16px; flex: 0 0 16px; color: var(--ink-soft); }
#floatgroup .fg-b[aria-pressed="true"] { color: var(--accent-text); } #floatgroup .fg-b[aria-pressed="true"] svg { color: var(--accent-text); }
#floatgroup .fg-b:focus { outline: none; } #floatgroup .fg-b:focus-visible { box-shadow: 0 0 0 2px var(--accent); }
#floatgroup .fg-sep { width: 1px; height: 20px; margin: 0 4px; background: var(--line-hi); }
#floatgroup .fg-cap { margin: 0; min-height: 1.4em; font: 500 11px/1.4 var(--font-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }`,
  js: FG,
  opts: [
    {
      k: 'B', name: 'One highlight that changes size as it moves', line: 'Icon buttons and a word button in one tray. The highlight glides from one to the next and grows or shrinks to fit, keeping its speed if you change your mind. Over a gap or a line it waits. A press darkens it and settles it in a little; the buttons never move.',
      from: [arc('floating-button-group'), house('n32')], tryit: 'Sweep the pointer back and forth fast, stop over a line, then press Copy link.',
      needs: 'Script and a spring.', keys: 'Tab lands on one button. Left and right arrows move, Home and End jump to the ends. Holding Enter darkens it.', off: 'The highlight jumps to the button.', law: 'Fitts: the target you aim at lights up in full.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'depth:lifted', 'feedback:clear', 'new:twist', 'look:ember'],
      html: fgHtml, js: fgJs(false),
    },
    {
      k: 'A', name: 'Each button lights up on its own', line: 'The usual way: each button gets its own grey fill when you point at it, and loses it when you leave. Nothing travels.',
      from: [sh('toggle-group', 'shadcn/ui toolbar')], tryit: 'Sweep the pointer along the tray, then press the arrows.',
      needs: 'CSS and a few lines of script.', keys: 'Tab lands on one button; the arrows move along.', off: 'Same.', law: 'Jakob: every toolbar works like this.',
      tags: ['motion:still', 'speed:quick', 'density:compact', 'depth:lifted', 'feedback:quiet', 'new:familiar', 'look:ember'],
      html: fgHtml, css: `#t07A .fg-b:hover, #t07A .fg-b:focus-visible { background: rgb(var(--ink-rgb) / .07); }
#t07A .fg-b:active { background: rgb(var(--ink-rgb) / .13); }`, js: fgJs(true),
    },
    {
      k: 'C', name: 'A grid of quick actions', line: 'The same highlight in two directions. Tiles of different sizes sit in a grid, and the highlight moves across and down, stretching to the wide tile and back.',
      kind: 'Mix', from: [arc('floating-button-group'), house('n32')], tryit: 'Move from Send money down to Withdraw, then use the arrow keys.',
      needs: 'Script and a spring.', keys: 'One tab stop; the arrow keys move to the nearest tile in that direction.', off: 'The highlight jumps.', law: 'Fitts: the most used action is the biggest.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:clear', 'new:novel', 'look:ember'], h: 300,
      html: `<div class="fg"><div class="fg-tray qa" role="toolbar" aria-label="PocketPay quick actions" data-tray><span class="t4b-hl" data-hl></span>
<button class="fg-b qa-b w" type="button" data-b="send">${I.send}<span>Send money<small>To any +254 number</small></span></button><button class="fg-b qa-b" type="button" data-b="bill">${I.receipt}<span>Pay bill</span></button>
<button class="fg-b qa-b" type="button" data-b="air">${I.signal}<span>Airtime</span></button><button class="fg-b qa-b" type="button" data-b="cash">${I.cash}<span>Withdraw</span></button><button class="fg-b qa-b" type="button" data-b="top">${I.wallet}<span>Top up</span></button></div>
<p class="t4b-msg" data-msg aria-live="polite">Pick an action.</p></div>`,
      css: `#t07C .qa { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; width: min(100%, 300px); }
#t07C .qa-b { height: auto; min-height: 64px; padding: 10px; flex-direction: column; align-items: flex-start; justify-content: space-between; gap: 6px; font-size: 13px; white-space: normal; text-align: left; }
#t07C .qa-b.w { grid-column: span 2; }
#t07C .qa-b small { display: block; font-size: 11.5px; font-weight: 400; color: var(--muted); }
#t07C .qa-b svg { width: 18px; height: 18px; color: var(--accent-text); }`,
      js: `var msg = $('[data-msg]', box), S = { send: 'Send money: who do you want to pay?', bill: 'Pay bill: enter the business number.', air: 'Airtime: KES 100 for +254 712 345 678?', cash: 'Withdraw: find an agent near Kilimani.', top: 'Top up from your card ending 4821.' };
TL4b.fg(box, { grid: true, r: 10, act: function (k) { msg.textContent = S[k]; } });`,
    },
    {
      k: 'D', name: 'Our dropdown glide, side by side with the new one', line: 'The n32 menu with both glides. Switch between them and feel the difference: the new one keeps its speed when you change direction, grows in where you land instead of sliding from the last row, waits over the line, and fits the taller row.',
      kind: 'Reference, pushed', from: [house('n32'), arc('floating-button-group')], tryit: 'Sweep up and down the menu with New, then switch to Today and do the same.',
      needs: 'Script and a spring.', keys: 'Up and down move, Home and End jump, Enter picks. Tab moves to the switch.', off: 'Both jump to the row.', law: 'Jakob: the menu still works the usual way.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'open:trigger', 'new:twist', 'look:ember'], h: 330,
      html: `<div class="dd"><div class="dd-sw" role="group" aria-label="Which glide"><button type="button" class="t4b-b" data-m="new" aria-pressed="true">New glide</button><button type="button" class="t4b-b" data-m="old" aria-pressed="false">Today's glide</button></div>
<div class="l-panel dd-m" role="menu" aria-label="Actions for invoice 4821" data-tray><span class="t4b-hl" data-hl></span>
<button class="l-item" type="button" role="menuitem" data-b="edit">${I.edit}Edit invoice<span class="sc">E</span></button>
<button class="l-item" type="button" role="menuitem" data-b="dup">${I.copy}Duplicate<span class="sc">D</span></button>
<button class="l-item dd-2" type="button" role="menuitem" data-b="rem">${I.bell}<span>Send reminder<small>By SMS to +254 712 345 678</small></span><span class="sc">R</span></button>
<span class="dd-sep" role="separator"></span>
<button class="l-item dd-w" type="button" role="menuitem" data-b="del">${I.trash}Delete invoice</button></div>
<p class="t4b-msg" data-msg aria-live="polite">Nothing picked yet.</p></div>`,
      css: `#t07D .dd { width: min(100%, 260px); display: grid; gap: 10px; }
#t07D .dd-sw { display: inline-flex; justify-self: start; padding: 3px; gap: 2px; border-radius: 10px; background: rgb(var(--ink-rgb) / .06); border: 1px solid var(--line); }
#t07D .dd-sw button { padding: 5px 10px; border-radius: 7px; font-size: 12.5px; font-weight: 500; color: var(--muted); }
#t07D .dd-sw button[aria-pressed="true"] { background: var(--paper-raised); color: var(--ink); box-shadow: 0 1px 2px rgb(0 0 0 / .1), 0 0 0 1px var(--line); }
#t07D .dd-m { position: relative; }
#t07D .dd-m .l-item[data-on], #t07D .dd-m .l-item:hover { background: none; }
#t07D .dd-m .l-item:focus-visible { outline: none; }
#t07D .dd-2 { align-items: flex-start; padding-top: 8px; padding-bottom: 8px; }
#t07D .dd-2 small { display: block; font-size: 12px; color: var(--muted); }
#t07D .dd-sep { display: block; height: 1px; margin: 6px 4px; background: var(--line); }
#t07D .dd-w, #t07D .dd-w svg { color: var(--accent-text); }
#t07D .t4b-hl { border-radius: 8px; }
#t07D .dd-m.old .t4b-hl { clip-path: none; transition: transform var(--sp-snappy-d) var(--sp-snappy), height .2s var(--ease-out), width .2s var(--ease-out), opacity .15s; }`,
      js: `var msg = $('[data-msg]', box), m = $('[data-tray]', box), S = { edit: 'Editing invoice #4821.', dup: 'Copied as invoice #4822.', rem: 'Reminder sent to Amina.', del: 'Invoice #4821 deleted.' };
var f = TL4b.fg(box, { vertical: true, r: 8, act: function (k) { msg.textContent = S[k]; } });
$$('[data-b]', m).forEach(function (b) { b.addEventListener('pointermove', function () { if (document.activeElement !== b && box.contains(document.activeElement) && document.activeElement.matches('[data-b]')) b.focus({ preventScroll: true }); }); });
$$('[data-m]', box).forEach(function (b) { b.addEventListener('click', function () { var old = b.getAttribute('data-m') === 'old'; $$('[data-m]', box).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); m.classList.toggle('old', old); f.hl.mode(old); msg.textContent = old ? 'Today\\'s glide: it moves up and down on a CSS spring.' : 'New glide: it moves on a spring that keeps its speed.'; }); });`,
    },
  ],
};

/* ---------------- 08 Expanding button group ---------------- */
const XG = String.raw`
/* icon buttons that open to show their name. Each sits at its own place on a spring; only its clip and place move.
   o.select: tabs, the picked one stays open. Otherwise the one you point at or Tab to opens. */
TL4b.xg = function (box, o) {
  o = o || {}; var row = $('[data-row]', box), W = $$('[data-w]', row), B = W.map(function (w) { return $('button', w); }), live = $('[data-live]', box), msg = $('[data-msg]', box);
  var S = o.size || 40, GAP = o.gap == null ? 6 : o.gap, PR = o.padR || 14, OW = [], xs = [], ws = [], at = -1, sel = o.select ? (o.start || 0) : -1, timers = [];
  function measure() { W.forEach(function (w, i) { var r = $('.t4b-rs', w); OW[i] = Math.ceil(S + r.offsetWidth + PR); B[i].style.width = OW[i] + 'px'; });
    row.style.width = (W.length * S + (W.length - 1) * GAP + Math.max.apply(null, OW) - S) + 'px'; row.style.height = S + 'px'; lay(); }
  function lay() { var op = o.select ? sel : at, tot = 0; W.forEach(function (w, i) { tot += (i === op ? OW[i] : S) + (i ? GAP : 0); });
    var x = o.centre ? (row.offsetWidth - tot) / 2 : 0;
    W.forEach(function (w, i) { w.classList.toggle('open', i === op); xs[i] = x; ws[i] = i === op ? OW[i] : S; w.style.transform = 'translateX(' + x.toFixed(1) + 'px)'; x += ws[i] + GAP; }); }
  function open(i) { if (o.select || i === at) return; at = i; lay(); }
  var rv = TL4b.rove(B, { single: true, start: Math.max(0, sel) });
  /* hover follows real pointer moves only, and a neighbour takes over once the pointer is 4 px inside it,
     so a button that slides under a resting pointer never steals it, and an edge never flickers */
  row.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse' || o.select) return; var x = e.clientX - row.getBoundingClientRect().left;
    if (at >= 0 && x >= xs[at] && x <= xs[at] + ws[at]) return;
    for (var j = 0; j < W.length; j++) if (j !== at && x >= xs[j] + 4 && x <= xs[j] + ws[j] - 4) { open(j); return; } });
  row.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'mouse') return; var f = document.activeElement; open(row.contains(f) && f.matches(':focus-visible') ? B.indexOf(f) : -1); });
  B.forEach(function (b, i) {
    b.addEventListener('focus', function () { if (b.matches(':focus-visible')) { if (o.select) pick(i); else open(i); } });
    b.addEventListener('blur', function () { setTimeout(function () { if (!row.contains(document.activeElement) && !row.matches(':hover')) open(-1); }, 0); });
    b.addEventListener('click', function () { if (o.select) { pick(i); return; } open(i); var a = o.acts[i]; if (!a) return;
      var r = $('.t4b-rs', W[i]), ic = $('[data-ic]', W[i]); W[i].classList.add('is-done'); if (ic) ic.innerHTML = TICK; if (r) TL4b.swap(r, 'd'); TL4b.say(live, a[0]); if (msg) msg.textContent = a[1] || a[0];
      clearTimeout(timers[i]); timers[i] = setTimeout(function () { W[i].classList.remove('is-done'); if (r) TL4b.swap(r, 'a'); }, 1800); });
  });
  function pick(i) { sel = i; B.forEach(function (b, j) { b.setAttribute('aria-selected', String(j === i)); }); rv.mark(i); lay(); if (o.onPick) o.onPick(i); }
  if (o.select) pick(sel);
  measure(); TLb.fonts(measure); if (window.ResizeObserver) new ResizeObserver(lay).observe(box);
  return { open: open };
};`;

const XA = [['reply', 'Reply', 'Replying', 'Reply box open for Amina.'], ['bell', 'Remind', 'Reminded', 'Reminder sent to +254 712 345 678.'], ['check', 'Mark paid', 'Paid', 'Invoice #4821 marked paid.'], ['archive', 'Archive', 'Archived', 'Invoice #4821 archived.']];
const xgBtn = ([ic, a, d], cls = 'xg') => `<span class="${cls}-w" data-w><button class="${cls}-b t4b-b" type="button" aria-label="${a}"><span class="${cls}-i"><span class="${cls}-ic">${I[ic]}</span><span class="${cls}-ok" data-ic>${TK0}</span></span>${rs([['a', a], ['d', d]], `${cls}-l`)}</button></span>`;
const xgCss = (id, S, R, c = 'xg', R2 = R) => `${id} .${c}-row { position: relative; max-width: 100%; }
${id} .${c}-w { position: absolute; left: 0; top: 0; filter: drop-shadow(0 0 .6px var(--line-hi)) drop-shadow(0 1px 2px rgb(var(--ink-rgb) / .08)); transition: transform var(--sp-snappy-d) var(--sp-snappy); }
${id} .${c}-b { position: relative; height: ${S}px; display: flex; align-items: center; border-radius: ${R}px; background: var(--paper-raised); color: var(--ink-soft); font-size: 14px; font-weight: 500; white-space: nowrap; clip-path: inset(0 calc(100% - ${S}px) 0 0 round ${R}px); transition: clip-path .2s var(--ease-out), border-radius .2s var(--ease-out), color .15s; }
${id} .${c}-w.open .${c}-b { clip-path: inset(0 0 0 0 round ${R2}px); border-radius: ${R2}px; color: var(--ink); transition: clip-path var(--sp-snappy-d) var(--sp-snappy), border-radius var(--sp-snappy-d) var(--sp-snappy), color .15s; }
${id} .${c}-b:focus { outline: none; }
${id} .${c}-b:focus-visible { background: color-mix(in srgb, var(--paper-raised) 88%, var(--accent)); }
${id} .${c}-b:active .${c}-i { scale: .84; }
${id} .${c}-i { width: ${S}px; height: ${S}px; flex: 0 0 ${S}px; display: grid; place-items: center; transition: scale .12s var(--ease-out); }
${id} .${c}-i > * { grid-area: 1 / 1; display: grid; transition: opacity .16s, transform var(--sp-bouncy-d) var(--sp-bouncy); }
${id} .${c}-ic svg { width: 17px; height: 17px; }
${id} .${c}-ok { opacity: 0; transform: scale(.6); } ${id} .${c}-ok .l-tick { width: 19px; height: 19px; flex-basis: 19px; }
${id} .is-done .${c}-ok { opacity: 1; transform: none; } ${id} .is-done .${c}-ic { opacity: 0; transform: scale(.6); }
${id} .${c}-l { opacity: 0; transform: translateX(-8px); filter: blur(2px); transition: opacity .1s, transform .14s var(--ease-out), filter .1s; }
${id} .${c}-w.open .${c}-l { opacity: 1; transform: none; filter: none; transition: opacity .2s .04s, transform var(--sp-snappy-d) var(--sp-snappy), filter .2s .04s; }`;

const expandgroup = {
  id: 'expandgroup', n: '08', name: 'Expanding button group', h: 240,
  claim: 'Small icons can <em>open to say their name</em> when you aim at them.',
  lead: 'Icon buttons that spring open to show their name while the others slide aside. A neighbour only takes over once the pointer is 4 px inside it, so a resting pointer never makes them flicker.',
  ref: { ids: 'r3 10C', text: 'Round 3\'s row of round icons that open. You liked it, and the circles; the new rule keeps circles only for icon buttons.' },
  noteHint: 'B, but open a little slower', moreHint: 'the same row down the side of a card',
  css: `#expandgroup .xg-box { width: min(100%, 340px); display: grid; gap: 14px; text-align: left; }
#expandgroup .xg-k { margin: 0; display: grid; gap: 1px; padding: 10px 12px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); font-size: 13px; color: var(--muted); }
#expandgroup .xg-k b { font-size: 14px; color: var(--ink); }`,
  js: XG,
  opts: [
    {
      k: 'B', name: 'Opens from the left, with well-curved corners', line: 'Four icon buttons under an invoice, lined up on the left. The one you point at springs open to its name and the others slide right. Press one and its icon turns into an orange tick while the word changes in the same box.',
      from: [arc('expanding-button-group'), house('n34')], tryit: 'Rest the pointer on the line between two buttons, then slide slowly along. Press Mark paid.',
      needs: 'Script and CSS springs.', keys: 'Tab lands on one button; left and right arrows move and open the one with focus. Enter presses it.', off: 'Buttons open and close at once.', law: 'Fitts: small at rest, big when you aim at one.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'new:twist', 'look:ember'],
      html: `<div class="xg-box"><p class="xg-k"><b>Invoice #4821 · KES 4,200</b>Amina Otieno · due Friday</p><div class="xg-row" data-row role="toolbar" aria-label="Invoice actions">${XA.map((a) => xgBtn(a)).join('')}</div><p class="t4b-msg" data-msg aria-live="polite">Nothing done yet.</p><p class="sr" aria-live="polite" data-live></p></div>`,
      css: xgCss('#t08B', 40, 10),
      js: `TL4b.xg(box, { size: 40, gap: 6, acts: ${JSON.stringify(XA.map((a) => [a[2], a[3]]))} });`,
    },
    {
      k: 'A', name: 'Plain: the name slides out with CSS', line: 'The usual way: each name is hidden and slides out when you point at the button or Tab to it. The row moves by itself, with no spring and no 4 px rule.',
      from: [sh('button')], tryit: 'Slide the pointer along the row and stop on a line between two buttons.',
      needs: 'CSS, and a few lines of script for the press.', keys: 'Tab moves along; Enter presses.', off: 'Names show and hide at once.', law: 'Jakob: like most icon rows.',
      tags: ['motion:some', 'speed:quick', 'density:compact', 'feedback:clear', 'new:familiar', 'look:ember'],
      html: `<div class="xg-box"><p class="xg-k"><b>Invoice #4821 · KES 4,200</b>Amina Otieno · due Friday</p><div class="xa-row" role="toolbar" aria-label="Invoice actions">${XA.map(([ic, a, d]) => `<button class="xa-b t4b-b" type="button" aria-label="${a}"><span class="xa-i"><span class="xa-ic">${I[ic]}</span><span class="xa-ok" data-ic>${TK0}</span></span><span class="xa-l">${rs([['a', a], ['d', d]])}</span></button>`).join('')}</div><p class="t4b-msg" data-msg aria-live="polite">Nothing done yet.</p></div>`,
      css: `#t08A .xa-row { display: flex; gap: 6px; flex-wrap: nowrap; }
#t08A .xa-b { display: flex; align-items: center; height: 40px; padding: 0; border-radius: 10px; border: 1px solid var(--line-hi); background: var(--paper-raised); color: var(--ink-soft); font-size: 14px; font-weight: 500; white-space: nowrap; }
#t08A .xa-i { width: 38px; height: 38px; display: grid; place-items: center; } #t08A .xa-i > * { grid-area: 1 / 1; display: grid; } #t08A .xa-ic svg { width: 17px; height: 17px; }
#t08A .xa-ok { opacity: 0; } #t08A .xa-ok .l-tick { width: 19px; height: 19px; } #t08A .is-done .xa-ok { opacity: 1; } #t08A .is-done .xa-ic { opacity: 0; }
#t08A .xa-l { display: grid; grid-template-columns: 0fr; overflow: hidden; transition: grid-template-columns .2s var(--ease-out), padding .2s var(--ease-out); }
#t08A .xa-l > * { min-width: 0; }
#t08A .xa-b:hover .xa-l, #t08A .xa-b:focus-visible .xa-l { grid-template-columns: 1fr; padding-right: 12px; }
#t08A .xa-b:focus { outline: none; } #t08A .xa-b:focus-visible { border-color: var(--accent); }`,
      js: `var msg = $('[data-msg]', box), A = ${JSON.stringify(XA.map((a) => a[3]))};
$$('.xa-b', box).forEach(function (b, i) { var t = 0; b.addEventListener('click', function () { var r = $('.t4b-rs', b); $('[data-ic]', b).innerHTML = TICK; b.classList.add('is-done'); TL4b.swap(r, 'd'); msg.textContent = A[i]; clearTimeout(t); t = setTimeout(function () { b.classList.remove('is-done'); TL4b.swap(r, 'a'); }, 1800); }); });`,
    },
    {
      k: 'C', name: 'A phone tab bar where the open one is the page', line: 'Four tabs at the bottom of a phone app. The tab you are on stays open with its name; tap another and it springs open while the old one closes and the rest slide along. The page title above rolls to match.',
      kind: 'Mix', from: [arc('expanding-button-group'), house('n17')], tryit: 'Tap Pay, then Me. With the keys, use left and right.',
      needs: 'Script and CSS springs.', keys: 'One tab stop; left and right pick the next tab at once; Home and End jump.', off: 'The tab opens at once and the title changes in place.', law: 'Fitts: big thumb targets at the bottom of the screen.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'new:twist', 'look:ember'], h: 260,
      html: `<div class="tb"><div class="tb-scr"><p class="tb-t"><span data-title>Home</span></p><p class="tb-s" data-sub>Balance KES 12,480</p></div>
<div class="tb-bar"><div class="tb-row" data-row role="tablist" aria-label="PocketPay">${[['home', 'Home'], ['send', 'Pay'], ['card', 'Cards'], ['user', 'Me']].map(([ic, a]) => `<span class="tb-w" data-w><button class="tb-b" type="button" role="tab" aria-label="${a}"><span class="tb-i"><span class="tb-ic">${I[ic]}</span></span>${rs([['a', a]], 'tb-l')}</button></span>`).join('')}</div></div></div>`,
      css: xgCss('#t08C', 44, 12, 'tb') + `
#t08C .tb { width: min(100%, 300px); display: grid; gap: 14px; }
#t08C .tb-scr { padding: 16px; border-radius: 14px; border: 1px solid var(--line); background: var(--paper-raised); min-height: 92px; }
#t08C .tb-t { margin: 0; font: 400 26px/1.1 var(--font-display); color: var(--ink); }
#t08C .tb-s { margin: 6px 0 0; font-size: 13px; color: var(--muted); }
#t08C .tb-bar { display: flex; justify-content: center; padding: 6px; border-radius: 14px; border: 1px solid var(--line); background: var(--paper-raised); box-shadow: var(--shadow-sm); }
#t08C .tb-w { filter: none; }
#t08C .tb-b { background: transparent; }
#t08C .tb-w.open .tb-b { background: rgb(var(--ink-rgb) / .08); }
#t08C .tb-w.open .tb-ic svg { color: var(--accent-text); }`,
      js: `var T = ['Home', 'Pay', 'Cards', 'Me'], Sb = ['Balance KES 12,480', 'Send to a number or a till', 'Visa ending 4821', 'Wanjiku Kamau · +254 712 345 678'], tl = TLline($('[data-title]', box)), sub = $('[data-sub]', box), last = 0;
TL4b.xg(box, { size: 44, gap: 4, select: true, centre: true, padR: 16, onPick: function (i) { tl.set(T[i], i >= last ? 1 : -1); sub.textContent = Sb[i]; last = i; } });`,
    },
    {
      k: 'D', name: 'Round 3\'s row of circles, pushed', line: 'Your round 3 row, with its circles. Now hover needs real pointer movement and the 4 px rule, a press shrinks the icon, and the done word lifts in while the old one lifts away.',
      kind: 'Reference, pushed', from: [arc('expanding-button-group'), house('n34')], tryit: 'Slide along the row, rest on a line between two circles, then press Share link.',
      needs: 'Script and CSS springs.', keys: 'Tab lands on one; the arrows move and open it. Enter presses it.', off: 'Buttons open and close at once.', law: 'Fitts: small at rest, big when you aim at one.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'new:novel', 'look:ember'],
      html: `<div class="xg-box xd"><p class="xg-k"><b>Order #4821 is on its way</b>Otieno will be there in about 3 minutes.</p><div class="xg-row" data-row role="toolbar" aria-label="Order actions">${[['phone', 'Call Otieno', 'Calling'], ['chat', 'Message', 'Sent'], ['link', 'Share link', 'Copied'], ['pin', 'Track', '3 min away']].map((a) => xgBtn(a)).join('')}</div><p class="t4b-msg" data-msg aria-live="polite">Nothing done yet.</p><p class="sr" aria-live="polite" data-live></p></div>`,
      css: xgCss('#t08D', 44, 22, 'xg', 12) + `
#t08D .xd { justify-items: center; text-align: center; } #t08D .xd .xg-k { width: 100%; }`,
      js: `var x = TL4b.xg(box, { size: 44, gap: 8, centre: true, padR: 18, acts: [['Calling Otieno.'], ['Message sent to Otieno.'], ['Tracking link copied.', 'Tracking link copied: example.com/track/4821.'], ['Otieno is 3 minutes away.']] });
$$('button', box)[2].addEventListener('click', function () { TL4b.copy('https://example.com/track/4821'); });`,
    },
  ],
};

/* ---------------- 09 Copy button ---------------- */
const copybtn = {
  id: 'copybtn', n: '09', name: 'Copy button', h: 250,
  claim: 'A copy button should <em>say it worked</em> right where you pressed.',
  lead: 'Each one really copies. Press it, then paste somewhere to check. The tick is orange, because copied means done.',
  ref: { ids: 'r3 10A', text: 'Round 3\'s plain copy button: the icon fades into an orange tick and the word becomes Copied, in a box that keeps its width.' },
  noteHint: 'B, but the tick a little bigger', moreHint: 'a copy button for a whole table',
  css: `#copybtn .cpy { width: min(100%, 330px); display: grid; gap: 12px; text-align: left; }
#copybtn .cpy-row { display: flex; align-items: center; gap: 10px; padding: 10px 10px 10px 14px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); }
#copybtn .cpy-row > span { flex: 1; min-width: 0; }
#copybtn .cpy-row small { display: block; font: 500 10.5px/1.4 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
#copybtn .cpy-row b { display: block; font: 500 19px/1.2 var(--font-num); letter-spacing: .02em; color: var(--ink); font-variant-numeric: tabular-nums; }`,
  opts: [
    {
      k: 'B', name: 'The sheets tuck away and a tick draws in', line: 'Press Copy and the two sheets in the icon tuck away while an orange tick draws itself in. The word lifts out and Copied rises in, in a box that already fits the longest word, so nothing moves.',
      from: [arc('copy-button'), arc('icon-morph')], tryit: 'Copy the paybill, then the account, then paste them.',
      needs: 'Script and a spring.', keys: 'Tab to a button, then Enter or Space.', off: 'The tick and the word swap at once.', law: 'Jakob: a copy button next to the thing it copies.',
      tags: ['motion:springy', 'speed:quick', 'density:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: `<div class="cpy"><p class="t4b-msg">Pay Duka Fresh with PocketPay</p>${[['Paybill', '247 247', '247247'], ['Account', 'DUKA-4821', 'DUKA-4821']].map(([l, v, c]) => `<div class="cpy-row"><span><small>${l}</small><b>${v}</b></span><button class="cbB t4b-b" type="button" data-copy="${c}" aria-label="Copy ${l.toLowerCase()} ${v}">${MI.copy()}${rs([['a', 'Copy'], ['d', 'Copied'], ['f', 'Failed']])}</button></div>`).join('')}<p class="sr" role="status" data-live></p></div>`,
      css: `#t09B .cbB { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 11px 0 8px; border-radius: 9px; border: 1px solid var(--line-hi); background: var(--paper-raised); font-size: 13.5px; font-weight: 500; color: var(--ink); transition: border-color .15s; }
#t09B .cbB:hover { border-color: rgb(var(--ink-rgb) / .42); }
#t09B .cbB:active > * { scale: .95; } #t09B .cbB > * { transition: scale .12s var(--ease-out); }
#t09B .cbB .t4b-mi { width: 18px; height: 18px; }`,
      js: `var live = $('[data-live]', box);
$$('[data-copy]', box).forEach(function (b) { var m = TL4b.morph($('svg', b), 'copy'), r = $('.t4b-rs', b), t = 0;
  b.addEventListener('click', function () { TL4b.copy(b.getAttribute('data-copy')).then(function (ok) { m.set(ok); TL4b.swap(r, ok ? 'd' : 'f'); TL4b.say(live, b.getAttribute('aria-label').replace('Copy ', '') + (ok ? ': copied' : ': could not copy'));
    clearTimeout(t); t = setTimeout(function () { m.set(false); TL4b.swap(r, 'a'); }, 1800); }); }); });`,
    },
    {
      k: 'A', name: 'An icon in the field, with a small note', line: 'A small icon button inside the field. Press it and the icon fades into an orange tick and a little "Copied" note drops in above it.',
      from: [arc('copy-button'), sh('input')], tryit: 'Press the icon in the field, then paste.',
      needs: 'A few lines of script.', keys: 'Tab to the icon, then Enter.', off: 'The tick and note show at once.', law: 'Fitts: the button sits right on what it copies.',
      tags: ['motion:some', 'speed:quick', 'density:compact', 'feedback:clear', 'new:familiar', 'look:ember'],
      html: `<div class="cpy"><label class="l-lbl" for="t09A-u">Your shop link</label><div class="ca-f"><input id="t09A-u" class="l-in" readonly value="duka.example.com/kilimani"><button class="ca-b t4b-b" type="button" aria-label="Copy link"><span class="ca-i">${I.copy}</span><span class="ca-ok">${TK0}</span><span class="ca-tip" aria-hidden="true" data-tip>Copied</span></button></div><p class="sr" role="status" data-live></p></div>`,
      css: `#t09A .ca-f { position: relative; }
#t09A .l-in { padding-right: 46px; font-family: var(--font-mono); font-size: 13px; color: var(--ink-soft); }
#t09A .ca-b { position: absolute; right: 4px; top: 4px; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 8px; color: var(--ink-soft); transition: background-color .15s; }
#t09A .ca-b:hover { background: rgb(var(--ink-rgb) / .07); }
#t09A .ca-b > * { grid-area: 1 / 1; }
#t09A .ca-i, #t09A .ca-ok { display: grid; transition: opacity .1s var(--ease-out); } #t09A .ca-ok { opacity: 0; } #t09A .ca-ok .l-tick { width: 18px; height: 18px; }
#t09A .is-done .ca-ok { opacity: 1; transition: opacity .16s var(--ease-out) .1s; } #t09A .is-done .ca-i { opacity: 0; }
#t09A .ca-tip { position: absolute; bottom: calc(100% + 6px); left: 50%; translate: -50% 0; padding: 3px 8px; border-radius: 7px; background: var(--ink); color: var(--paper); font-size: 12px; white-space: nowrap; opacity: 0; transform: translateY(4px); transition: opacity .12s, transform .12s var(--ease-out); pointer-events: none; }
#t09A .is-done .ca-tip { opacity: 1; transform: none; transition: opacity .16s, transform var(--sp-snappy-d) var(--sp-snappy); }`,
      js: `var b = $('.ca-b', box), inp = $('input', box), live = $('[data-live]', box), tip = $('[data-tip]', box), t = 0;
b.addEventListener('click', function () { TL4b.copy(inp.value).then(function (ok) { if (!ok) inp.select(); tip.textContent = ok ? 'Copied' : 'Press Ctrl+C'; b.classList.add('is-done'); TL4b.say(live, ok ? 'Link copied' : 'Could not copy. The link is selected.'); clearTimeout(t); t = setTimeout(function () { b.classList.remove('is-done'); }, 1600); }); });`,
    },
    {
      k: 'C', name: 'A code block that shows what it copied', line: 'Press Copy on the code and a soft orange light sweeps once along the lines it copied, so you see exactly what went. Then the button shows its tick.',
      kind: 'Mix', from: [arc('copy-button'), ['Our code tabs with Copy', null]], tryit: 'Press Copy, watch the lines, then paste into a terminal or a note.',
      needs: 'Script and a short sweep.', keys: 'Tab to Copy, then Enter.', off: 'The lines flash orange once without moving; the tick shows at once.', law: 'Jakob: code blocks always carry a copy button.',
      tags: ['motion:some', 'speed:mid', 'density:mid', 'feedback:loud', 'new:novel', 'look:ember'], h: 260,
      html: `<div class="cc"><div class="cc-h"><span>Take a payment</span><button class="cc-b t4b-b" type="button" aria-label="Copy the code"><span class="cc-i">${rs([['a', I.copy], ['d', TK0], ['f', I.copy]])}</span>${rs([['a', 'Copy'], ['d', 'Copied'], ['f', 'Select']])}</button></div>
<pre class="cc-p" data-code><code><span class="cc-l">curl -X POST https://api.example.com/v1/pay \\</span>
<span class="cc-l">  -d phone=254712345678 \\</span>
<span class="cc-l">  -d amount=4200</span></code></pre><p class="sr" role="status" data-live></p></div>`,
      css: `#t09C .cc { width: min(100%, 340px); border-radius: 12px; background: #0f1216; overflow: hidden; text-align: left; box-shadow: var(--shadow-sm); }
#t09C .cc-h { display: flex; align-items: center; justify-content: space-between; padding: 6px 6px 6px 14px; border-bottom: 1px solid rgb(255 255 255 / .08); font: 500 11px/1.4 var(--font-mono); letter-spacing: .06em; color: #9aa3a8; }
#t09C .cc-b { display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 10px 0 8px; border-radius: 8px; color: #e8ecee; font: 500 12.5px var(--font-body); transition: background-color .15s; }
#t09C .cc-b:hover { background: rgb(255 255 255 / .08); }
#t09C .cc-i { display: grid; width: 16px; } #t09C .cc-i svg { width: 15px; height: 15px; } #t09C .cc-i .l-tick { width: 16px; height: 16px; } #t09C .cc-i .l-tick path { stroke: #120a06; } #t09C .cc-i .l-tick circle { fill: #ff6a2b; }
#t09C .cc-p { margin: 0; padding: 12px 14px 14px; overflow-x: auto; font: 12px/1.7 var(--font-mono); color: #d7dde0; }
#t09C .cc-l { display: inline-block; position: relative; white-space: pre; }
#t09C .cc-l::after { content: ""; position: absolute; inset: 0 -3px; border-radius: 4px; background: rgb(255 106 43 / .28); transform-origin: left; transform: scaleX(0); opacity: 0; }
#t09C .is-sweep .cc-l::after { animation: ccSweep .7s var(--ease-out) both; animation-delay: calc(var(--i) * 70ms); }
@keyframes ccSweep { 0% { transform: scaleX(0); opacity: 1; } 55% { transform: scaleX(1); opacity: 1; } 100% { transform: scaleX(1); opacity: 0; } }`,
      js: `var b = $('.cc-b', box), code = $('[data-code]', box), live = $('[data-live]', box), t = 0, R = $$('.t4b-rs', b);
$$('.cc-l', box).forEach(function (l, i) { l.style.setProperty('--i', i); });
b.addEventListener('click', function () { TL4b.copy(code.textContent).then(function (ok) {
  if (!ok) { var s = getSelection(), r = document.createRange(); r.selectNodeContents(code); s.removeAllRanges(); s.addRange(r); }
  if (ok) $('[data-k="d"]', R[0]).innerHTML = TICK; R.forEach(function (r) { TL4b.swap(r, ok ? 'd' : 'f'); });
  code.classList.remove('is-sweep'); code.offsetWidth; if (ok) code.classList.add('is-sweep');
  TL4b.say(live, ok ? 'Code copied, three lines.' : 'Could not copy. The code is selected; press Ctrl+C.');
  clearTimeout(t); t = setTimeout(function () { R.forEach(function (r) { TL4b.swap(r, 'a'); }); code.classList.remove('is-sweep'); }, 2000); }); });`,
    },
    {
      k: 'D', name: 'Pay details with one copy for each, and Copy all', line: 'Our code tabs\' Copy, pushed to a list of pay details. Each row copies its own value and ticks. Copy all ticks every row in turn, top to bottom, and one line under the list rolls to say what was copied.',
      kind: 'Reference, pushed', from: [['Our code tabs with Copy', null], arc('copy-button')], tryit: 'Copy the till number, then press Copy all and paste.',
      needs: 'Script and the shared line roll.', keys: 'Tab through the rows, then Enter.', off: 'All the ticks show at once; the line changes in place.', law: 'Proximity: each copy button sits on its own row.',
      tags: ['motion:some', 'speed:mid', 'density:mid', 'feedback:clear', 'new:twist', 'look:ember'], h: 300,
      html: `<div class="cd"><ul class="cd-l">${[['Till number', '508 112'], ['Account name', 'Duka Fresh Kilimani'], ['Amount', 'KES 4,200']].map(([l, v]) => `<li><span><small>${l}</small><b>${v}</b></span><button class="cd-b t4b-b" type="button" aria-label="Copy ${l.toLowerCase()}" data-v="${v}" data-l="${l.toLowerCase()}"><span class="cd-i">${I.copy}</span><span class="cd-ok" data-ok>${TK0}</span></button></li>`).join('')}</ul>
<div class="cd-f"><span class="cd-s" aria-hidden="true"><span data-s>Nothing copied yet</span></span><button class="l-btn sm" type="button" data-all>${I.copy}Copy all</button></div><p class="sr" role="status" data-live></p></div>`,
      css: `#t09D .cd { width: min(100%, 330px); display: grid; gap: 10px; text-align: left; }
#t09D .cd-l { list-style: none; margin: 0; padding: 0; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); }
#t09D .cd-l li { display: flex; align-items: center; gap: 10px; padding: 8px 8px 8px 14px; } #t09D .cd-l li + li { border-top: 1px solid var(--line); }
#t09D .cd-l li > span { flex: 1; min-width: 0; } #t09D .cd-l small { display: block; font-size: 12px; color: var(--muted); } #t09D .cd-l b { font-size: 14.5px; font-weight: 600; color: var(--ink); }
#t09D .cd-b { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 9px; color: var(--ink-soft); transition: background-color .15s; } #t09D .cd-b:hover { background: rgb(var(--ink-rgb) / .07); }
#t09D .cd-b > * { grid-area: 1 / 1; display: grid; transition: opacity .1s, transform var(--sp-bouncy-d) var(--sp-bouncy); }
#t09D .cd-ok { opacity: 0; transform: scale(.6); } #t09D .cd-ok .l-tick { width: 19px; height: 19px; }
#t09D .is-done .cd-ok { opacity: 1; transform: none; } #t09D .is-done .cd-i { opacity: 0; transform: scale(.6); }
#t09D .cd-f { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
#t09D .cd-s { font-size: 13px; color: var(--muted); min-width: 0; overflow: hidden; }`,
      js: `var bs = $$('.cd-b', box), live = $('[data-live]', box), s = TLline($('[data-s]', box)), T = [];
function tick(b, i, d) { setTimeout(function () { $('[data-ok]', b).innerHTML = TICK; b.classList.add('is-done'); clearTimeout(T[i]); T[i] = setTimeout(function () { b.classList.remove('is-done'); }, 1900); }, moving() ? d : 0); }
bs.forEach(function (b, i) { b.addEventListener('click', function () { TL4b.copy(b.getAttribute('data-v')).then(function (ok) { if (ok) tick(b, i, 0); var w = ok ? 'Copied the ' + b.getAttribute('data-l') + '.' : 'Could not copy.'; s.set(w, 1); TL4b.say(live, w); }); }); });
$('[data-all]', box).addEventListener('click', function () { var txt = bs.map(function (b) { return b.getAttribute('aria-label').replace('Copy ', '') + ': ' + b.getAttribute('data-v'); }).join('\\n');
  TL4b.copy(txt).then(function (ok) { if (ok) bs.forEach(function (b, i) { tick(b, i, i * 90); }); var w = ok ? 'Copied all three details.' : 'Could not copy.'; s.set(w, 1); TL4b.say(live, w); }); });`,
    },
  ],
};

/* ---------------- 10 Icon morph ---------------- */
const IM4 = [['menu', 'Menu', 'Close', 'aria-expanded'], ['play', 'Play', 'Pause', 'aria-pressed'], ['plus', 'Add', 'Added', 'aria-pressed'], ['copy', 'Copy', 'Copied', 'aria-pressed']];
const imGrid = (cls) => `<div class="im"><div class="im-g">${IM4.map(([k, a, b, at]) => `<div class="im-c"><button class="im-b t4b-b" type="button" data-k="${k}" data-a="${a}" data-b="${b}" data-at="${at}" ${at}="false" aria-label="${a}">${cls === 'A' ? `<span class="im-x"><span class="im-0">${k === 'copy' ? ms('<path d="M15.5 5.5V5c0-.8-.7-1.5-1.5-1.5H5c-.8 0-1.5.7-1.5 1.5v9c0 .8.7 1.5 1.5 1.5h.5"/><rect x="8.5" y="8.5" width="12" height="12" rx="2"/>') : MI[k]()}</span><span class="im-1">${k === 'menu' ? ms('<path d="M6 6l12 12M18 6 6 18"/>') : k === 'play' ? ms('<path fill="currentColor" stroke-width="1.6" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>') : k === 'plus' ? ms('<path d="M5.6 12.4 10.2 16.8 18.4 7.6"/>', 't4b-ok on') : ms('<path class="t4b-tk" stroke-width="2" d="M6.2 12.6 10.2 16.6 18.4 8.2"/>')}</span></span>` : MI[k]()}</button><span class="im-n" aria-hidden="true">${rs([['a', a], ['b', b]])}</span></div>`).join('')}</div><p class="t4b-msg">Press fast twice: it turns back from where it is.</p></div>`;
const iconmorph = {
  id: 'iconmorph', n: '10', name: 'Icon morph', h: 230,
  claim: 'An icon can <em>turn into</em> the next one, not swap.',
  lead: 'Menu turns into close, play into pause, plus into a tick, copy into a tick. Each line moves on its own spring, so pressing again halfway turns it back from where it is. These are our own drawings: Morfy\'s icons cannot go into a public kit (their terms forbid sharing them as a set).',
  ref: { ids: 'Top bar', text: 'Our theme button: the sun slides up and away and the moon slides in from below, on our one curve. And the FAQ chevron, which turns over on a spring.' },
  noteHint: 'B, but a little slower', moreHint: 'a heart for saved items, in our colours',
  css: `#iconmorph .im { display: grid; gap: 14px; justify-items: center; width: 100%; }
#iconmorph .im-g { display: grid; grid-template-columns: repeat(4, auto); gap: 14px; }
#iconmorph .im-c { display: grid; justify-items: center; gap: 6px; }
#iconmorph .im-b { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--line-hi); background: var(--paper-raised); color: var(--ink); box-shadow: var(--shadow-sm); transition: border-color .15s; }
#iconmorph .im-b:hover { border-color: rgb(var(--ink-rgb) / .42); }
#iconmorph .im-b:active .t4b-mi, #iconmorph .im-b:active .im-x { scale: .88; } #iconmorph .im-b .t4b-mi, #iconmorph .im-x { transition: scale .12s var(--ease-out); }
#iconmorph .im-n { font: 500 10.5px/1.3 var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
@media (max-width: 400px) { #iconmorph .im-g { gap: 8px; } #iconmorph .im-b { width: 44px; height: 44px; } }`,
  js: String.raw`TL4b.imWire = function (box, fn) { $$('.im-b', box).forEach(function (b) { var k = b.getAttribute('data-k'), on = false, at = b.getAttribute('data-at'), n = b.parentNode.querySelector('.t4b-rs'), m = fn(b, k);
  b.addEventListener('click', function () { on = !on; m.set(on); b.setAttribute(at, String(on)); b.setAttribute('aria-label', on ? b.getAttribute('data-b') : b.getAttribute('data-a')); TL4b.swap(n, on ? 'b' : 'a');
    if (k === 'copy' && on) TL4b.copy('KES 4,200 to Duka Fresh, paybill 247 247'); }); }); };`,
  opts: [
    {
      k: 'B', name: 'Every line moves on its own spring', line: 'Menu: the top and bottom lines turn into a cross and the middle one folds away. Play: the triangle splits into two bars. Plus: each bar swings into one side of an orange tick. Copy: the sheets tuck away and the tick draws in.',
      from: [arc('icon-morph')], tryit: 'Press each one, then press one twice very fast.',
      needs: 'Script and a spring for each icon.', keys: 'Tab to each, then Enter or Space. Each says its state to screen readers.', off: 'Each icon shows its new shape at once.', law: 'Jakob: the icons people know, moving the way they expect.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'new:twist', 'look:ember'],
      html: imGrid('B'), js: `TL4b.imWire(box, function (b, k) { return TL4b.morph($('svg', b), k); });`,
    },
    {
      k: 'A', name: 'A plain crossfade', line: 'The old icon fades and shrinks a little while the new one fades in. No shape moves. Quick and calm.',
      from: [arc('icon-morph'), sh('toggle')], tryit: 'Press each one.',
      needs: 'CSS and a few lines of script.', keys: 'Tab to each, then Enter or Space.', off: 'The icons swap at once.', law: 'Jakob: the usual toggle.',
      tags: ['motion:some', 'speed:quick', 'density:compact', 'feedback:quiet', 'new:familiar', 'look:ember'],
      html: imGrid('A'), css: `#t10A .im-x { display: grid; } #t10A .im-x > * { grid-area: 1 / 1; display: grid; transition: opacity .14s var(--ease-out), transform .2s var(--ease-out); }
#t10A .im-1 { opacity: 0; transform: scale(.8); } #t10A .on .im-1 { opacity: 1; transform: none; } #t10A .on .im-0 { opacity: 0; transform: scale(.8); }`,
      js: `TL4b.imWire(box, function (b) { var x = $('.im-x', b); return { set: function (on) { x.classList.toggle('on', on); } }; });`,
    },
    {
      k: 'C', name: 'A radio player that uses them', line: 'The same icons doing real jobs. Play turns into pause and the orange line moves while the show plays. Plus turns into a tick when you save the show. The menu turns into a cross and opens a small list.',
      kind: 'Mix', from: [arc('icon-morph'), house('n32')], tryit: 'Press play, save the show, then open the menu.',
      needs: 'Script and the shared icon springs.', keys: 'Tab to each button. Escape closes the menu and puts focus back.', off: 'Icons change at once; the line still shows how far the show has got.', law: 'Fitts: the main control is the biggest.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'open:trigger', 'new:twist', 'look:ember'], h: 300, top: true,
      html: `<div class="rp"><div class="rp-c"><button class="rp-p t4b-b" type="button" aria-pressed="false" aria-label="Play" data-play>${MI.play()}</button>
<span class="rp-t"><b>Mawimbi FM</b><small>Morning drive with Achieng</small><span class="rp-bar" aria-hidden="true"><i data-bar></i></span><small class="rp-tm" data-tm>0:00 / 2:00</small></span>
<button class="rp-s t4b-b" type="button" aria-pressed="false" aria-label="Save the show" data-save>${MI.plus()}</button><button class="rp-s t4b-b" type="button" aria-expanded="false" aria-haspopup="menu" aria-label="More" data-menu>${MI.menu()}</button>
<div class="l-panel l-pop rp-m" role="menu" data-m><button class="l-item" type="button" role="menuitem" data-say="Sleep timer set for 30 minutes.">${I.clock}Sleep in 30 min</button><button class="l-item" type="button" role="menuitem" data-say="Show link copied.">${I.link}Copy show link</button><button class="l-item" type="button" role="menuitem" data-say="We will remind you at 6 am tomorrow.">${I.bell}Remind me tomorrow</button></div></div>
<p class="t4b-msg" data-msg aria-live="polite">Paused.</p></div>`,
      css: `#t10C .rp { width: min(100%, 340px); display: grid; gap: 10px; text-align: left; }
#t10C .rp-c { position: relative; display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 14px; border: 1px solid var(--line); background: var(--paper-raised); box-shadow: var(--shadow-sm); }
#t10C .rp-p { flex: 0 0 48px; width: 48px; height: 48px; display: grid; place-items: center; border-radius: 50%; background: var(--accent); color: var(--on-accent); }
#t10C .rp-p:active .t4b-mi, #t10C .rp-s:active .t4b-mi { scale: .86; } #t10C .t4b-mi { transition: scale .12s var(--ease-out); }
#t10C .rp-t { flex: 1; min-width: 0; display: grid; gap: 1px; } #t10C .rp-t b { font-size: 14px; color: var(--ink); } #t10C .rp-t small { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#t10C .rp-bar { height: 3px; margin: 6px 0 2px; border-radius: 3px; background: rgb(var(--ink-rgb) / .1); overflow: hidden; } #t10C .rp-bar i { display: block; height: 100%; background: var(--accent); transform-origin: left; transform: scaleX(0); }
#t10C .rp-tm { font-family: var(--font-num) !important; font-variant-numeric: tabular-nums; }
#t10C .rp-s { flex: 0 0 38px; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-soft); transition: background-color .15s; } #t10C .rp-s:hover { background: rgb(var(--ink-rgb) / .07); }
#t10C .rp-s .t4b-mi { width: 20px; height: 20px; }
#t10C .rp-m { position: absolute; z-index: 5; top: calc(100% + 6px); right: 0; width: 210px; transform-origin: top right; --from: translateY(-6px) scale(.96); --in: var(--sp-snappy-d); --ease: var(--sp-snappy); }`,
      js: `var pb = $('[data-play]', box), sv = $('[data-save]', box), mb = $('[data-menu]', box), m = $('[data-m]', box), msg = $('[data-msg]', box), bar = $('[data-bar]', box), tm = $('[data-tm]', box);
var mp = TL4b.morph($('svg', pb), 'play'), ms2 = TL4b.morph($('svg', sv), 'plus'), mm = TL4b.morph($('svg', mb), 'menu'), pos = 0, raf = 0, last = 0, playing = false;
function show() { var s = Math.floor(pos); bar.style.transform = 'scaleX(' + (pos / 120) + ')'; tm.textContent = Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2) + ' / 2:00'; }
function loop(t) { if (!playing) return; pos = (pos + (t - last) / 1000) % 120; last = t; show(); raf = requestAnimationFrame(loop); }
pb.addEventListener('click', function () { playing = !playing; mp.set(playing); pb.setAttribute('aria-pressed', String(playing)); pb.setAttribute('aria-label', playing ? 'Pause' : 'Play'); msg.textContent = playing ? 'Playing Mawimbi FM.' : 'Paused.'; if (playing) { last = performance.now(); raf = requestAnimationFrame(loop); } else cancelAnimationFrame(raf); });
sv.addEventListener('click', function () { var on = sv.getAttribute('aria-pressed') !== 'true'; ms2.set(on); sv.setAttribute('aria-pressed', String(on)); sv.setAttribute('aria-label', on ? 'Saved. Press to remove' : 'Save the show'); msg.textContent = on ? 'Saved to your shows.' : 'Removed from your shows.'; });
var p = pop(mb, m, { focus: '[role="menuitem"]', onOpen: function () { mm.set(true); }, onClose: function () { mm.set(false); } });
nav(m, '[role="menuitem"]', { focus: true, loop: true });
m.addEventListener('keydown', function (e) { if (e.key === 'Tab') p.set(false, false); });
$$('[role="menuitem"]', m).forEach(function (it) { it.addEventListener('click', function () { msg.textContent = it.getAttribute('data-say'); if (/link/.test(it.textContent)) TL4b.copy('https://radio.example.com/mawimbi/morning'); p.set(false); }); });
show();`,
    },
    {
      k: 'D', name: 'Our chevron and bell, pushed into a settings card', line: 'Our FAQ chevron, pushed, with two new ones. The bell rings once when you turn alerts on and gets a line through it when you turn them off. The eye shows or hides the PIN. The chevron turns over and the box below glides open.',
      kind: 'Reference, pushed', from: [house('n35'), arc('icon-morph')], tryit: 'Turn alerts off and on, show the PIN, then open More.',
      needs: 'Script and the shared icon springs.', keys: 'Tab to each button, then Enter or Space.', off: 'Icons change at once; the box opens at once.', law: 'Jakob: each icon does what it always does.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:clear', 'new:twist', 'look:ember'], h: 320, top: true,
      html: `<div class="st4"><div class="st4-r"><span><b>Order alerts</b><small data-bs>On: a message for each order</small></span><button class="st4-b t4b-b" type="button" aria-pressed="true" aria-label="Order alerts on" data-bell>${MI.bell()}</button></div>
<div class="st4-r"><span><b>Shop PIN</b><input class="st4-pin" type="password" value="4821" readonly aria-label="Shop PIN" data-pin></span><button class="st4-b t4b-b" type="button" aria-pressed="false" aria-label="Show PIN" data-eye>${MI.eye()}</button></div>
<div class="st4-x" data-x><div class="st4-r"><span><b>More</b><small>Opening hours and pickup</small></span><button class="st4-b t4b-b" type="button" aria-expanded="false" aria-controls="t10D-more" aria-label="More" data-chev>${MI.chev()}</button></div>
<div class="st4-more" id="t10D-more" hidden><p>Open 7 am to 9 pm, every day.</p><p>Pickup from the gate on Argwings Kodhek Road.</p></div></div></div>`,
      css: `#t10D .st4 { width: min(100%, 340px); border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); text-align: left; }
#t10D .st4-r { display: flex; align-items: center; gap: 10px; padding: 10px 10px 10px 14px; } #t10D .st4 > * + * { border-top: 1px solid var(--line); }
#t10D .st4-r > span { flex: 1; min-width: 0; display: grid; } #t10D .st4-r b { font-size: 14px; color: var(--ink); } #t10D .st4-r small { font-size: 12.5px; color: var(--muted); }
#t10D .st4-pin { border: 0; padding: 0; background: none; font: 500 15px var(--font-num); letter-spacing: .2em; color: var(--ink-soft); width: 8ch; outline: none; }
#t10D .st4-b { width: 40px; height: 40px; flex: 0 0 40px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-soft); transition: background-color .15s; } #t10D .st4-b:hover { background: rgb(var(--ink-rgb) / .07); }
#t10D .st4-b .t4b-mi { width: 21px; height: 21px; } #t10D .st4-b:active .t4b-mi { scale: .86; } #t10D .t4b-mi { transition: scale .12s var(--ease-out); }
#t10D .st4-b [data-p="b"], #t10D .st4-b [data-p="c"] { transform-box: fill-box; transform-origin: 50% 0; }
#t10D .st4-x { overflow: hidden; } #t10D .st4-more { padding: 0 14px 12px; font-size: 13px; color: var(--ink-soft); } #t10D .st4-more p { margin: 0 0 4px; }`,
      js: `var bb = $('[data-bell]', box), eb = $('[data-eye]', box), cb = $('[data-chev]', box), pin = $('[data-pin]', box), x = $('[data-x]', box), more = $('#t10D-more', box), bs = $('[data-bs]', box);
var mbell = TL4b.morph($('svg', bb), 'bell', { on: true }), meye = TL4b.morph($('svg', eb), 'eye'), mch = TL4b.morph($('svg', cb), 'chev');
bb.addEventListener('click', function () { var on = bb.getAttribute('aria-pressed') !== 'true'; mbell.set(on); bb.setAttribute('aria-pressed', String(on)); bb.setAttribute('aria-label', on ? 'Order alerts on' : 'Order alerts off'); bs.textContent = on ? 'On: a message for each order' : 'Off: no messages'; });
eb.addEventListener('click', function () { var on = eb.getAttribute('aria-pressed') !== 'true'; meye.set(on); eb.setAttribute('aria-pressed', String(on)); eb.setAttribute('aria-label', on ? 'Hide PIN' : 'Show PIN'); pin.type = on ? 'text' : 'password'; });
cb.addEventListener('click', function () { var on = cb.getAttribute('aria-expanded') !== 'true', h0 = x.offsetHeight; mch.set(on); cb.setAttribute('aria-expanded', String(on)); more.getAnimations().forEach(function (a) { a.cancel(); });
  if (on) { more.hidden = false; if (moving()) { TLglide(x, h0, 400); more.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, delay: 80, fill: 'backwards' }); } return; }
  if (!moving()) { more.hidden = true; return; }
  var a = x.animate([{ height: h0 + 'px' }, { height: (h0 - more.offsetHeight) + 'px' }], { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' }); more.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' });
  a.onfinish = function () { if (cb.getAttribute('aria-expanded') === 'false') more.hidden = true; }; });`,
    },
  ],
};

/* ---------------- 11 Confirm morph ---------------- */
const CMCSS = `#confirm .cm { width: min(100%, 340px); display: grid; gap: 12px; justify-items: start; text-align: left; }
#confirm .cm-row { width: 100%; display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); box-sizing: border-box; overflow: hidden; transition: opacity .3s var(--ease-out); }
#confirm .cm-row.dim { opacity: .45; }
#confirm .cm-row .l-av { width: 32px; height: 32px; flex-basis: 32px; font-size: 12px; }
#confirm .cm-row b { display: block; font-size: 14px; color: var(--ink); } #confirm .cm-row small { font-size: 12.5px; color: var(--muted); }
#confirm .cm-ic { width: 32px; height: 32px; flex: none; display: grid; place-items: center; border-radius: 9px; background: var(--paper-sunk); color: var(--ink-soft); } #confirm .cm-ic svg { width: 17px; height: 17px; }
#confirm .cm-m { position: relative; max-width: 100%; }
#confirm .cm-bgw { position: absolute; inset: 0; pointer-events: none; filter: drop-shadow(0 0 .6px var(--line-hi)) drop-shadow(0 1px 2px rgb(var(--ink-rgb) / .08)); }
#confirm .cm-bg { position: absolute; inset: 0; background: var(--paper-raised); transition: background-color .25s var(--ease-out); }
#confirm .cm-m[data-at="q"] .cm-bg { background: color-mix(in srgb, var(--paper-raised) 90%, var(--accent)); }
#confirm .cm-f { position: absolute; left: 0; top: 0; display: inline-flex; align-items: center; gap: 6px; height: 40px; padding: 0 4px; white-space: nowrap; visibility: hidden; pointer-events: none; transition: visibility 0s linear .16s; }
#confirm .cm-f.on { visibility: visible; pointer-events: auto; transition: none; }
#confirm .cm-f > [data-p] { opacity: 0; transform: translateX(-5px); filter: blur(3px); transition: opacity .14s var(--ease-out), transform .2s var(--ease-out), filter .14s var(--ease-out); }
#confirm .cm-f.on > [data-p] { opacity: 1; transform: none; filter: none; transition: opacity .2s var(--ease-out), transform .3s var(--ease-out), filter .2s var(--ease-out); transition-delay: calc(var(--i, 0) * 55ms + 60ms); }
#confirm .cm-t { padding: 0 6px 0 10px; font-size: 14px; font-weight: 500; color: var(--ink); }
#confirm .cm-a { display: inline-flex; align-items: center; gap: 7px; height: 32px; padding: 0 12px 0 10px; border-radius: 8px; font-size: 14px; font-weight: 600; color: var(--accent-text); transition: background-color .15s; }
#confirm .cm-a svg { width: 15px; height: 15px; }
#confirm .cm-a:hover, #confirm .cm-n:hover { background: rgb(var(--accent-rgb) / .1); }
#confirm .cm-y, #confirm .cm-n { height: 32px; padding: 0 12px; border-radius: 8px; font-size: 13.5px; font-weight: 600; }
#confirm .cm-y { background: var(--accent); color: var(--on-accent); } #confirm .cm-n { color: var(--accent-text); }
#confirm .cm-f button:active { scale: .96; }
#confirm .cm-f button:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
#confirm .cm-f .l-tick { width: 18px; height: 18px; flex-basis: 18px; } #confirm .cm-f .l-spin { color: var(--accent); margin-left: 8px; }
#confirm .cm-line { position: absolute; left: 10px; right: 10px; bottom: 3px; height: 2px; border-radius: 2px; background: rgb(var(--accent-rgb) / .16); overflow: hidden; }
#confirm .cm-line i { display: block; height: 100%; background: var(--accent); transform-origin: left; }
#confirm .cm-sec { font-family: var(--font-num); font-size: 15px; color: var(--accent-text); min-width: 2ch; }
#confirm .cm-again { display: none; } #confirm .cm-again.on { display: inline-flex; }
@media (max-width: 400px) { #confirm .cm-t { padding-left: 6px; font-size: 13px; } #confirm .cm-y, #confirm .cm-n { padding: 0 9px; } }`;
const cmM = (faces) => `<div class="cm-m" data-m><span class="cm-bgw"><span class="cm-bg" data-bg></span></span>${faces}</div>`;
/* a countdown that pauses while the pointer or focus is on the control */
const CMJS = String.raw`
TL4b.cdown = function (hold, ms, tick, end) {
  var left = ms, last = 0, raf = 0, paused = false, on = true;
  function f(t) { if (!on) return; if (!paused && !document.hidden) left -= t - last; last = t; tick(Math.max(0, left) / ms, Math.ceil(Math.max(0, left) / 1000)); if (left <= 0) { on = false; end(); return; } raf = requestAnimationFrame(f); }
  function pz() { paused = hold.matches(':hover') || hold.contains(document.activeElement); }
  hold.addEventListener('pointerenter', pz); hold.addEventListener('pointerleave', pz); hold.addEventListener('focusin', pz); hold.addEventListener('focusout', function () { setTimeout(pz, 0); });
  pz(); last = performance.now(); raf = requestAnimationFrame(f);
  return { stop: function () { on = false; cancelAnimationFrame(raf); } };
};`;

const confirm = {
  id: 'confirm', n: '11', name: 'Confirm morph', h: 260,
  claim: 'The button you press can <em>become the question,</em> then the answer.',
  lead: 'Four ways to make a risky action safe, kept side by side so Claude can pick one per case. Each grows out of the button you pressed, so your eyes never leave it.',
  ref: { ids: 'r3 10B', text: 'Round 3\'s remove button that asks in place: it grows into "Remove it for good?" with Remove and Keep, and ignores a press in the first quarter second.' },
  noteHint: 'Use B for archive, C only for closing an account', moreHint: 'a confirm for sending money',
  css: CMCSS, js: CMJS,
  opts: [
    {
      k: 'B', name: 'Do it at once, with Undo on a countdown', line: 'For anything that can be undone, which is most things. Archive happens straight away. The button turns into "Archived" with Undo and an orange line that drains for five seconds, and the seconds roll down. Point at it and the clock waits.',
      kind: 'Lively · use when it can be undone', from: [arc('confirm-morph'), house('n29')], tryit: 'Press Archive chat, rest the pointer on it, then press Undo. Then let it run out.',
      needs: 'Script, a clip spring and the number roll.', keys: 'Enter archives and focus moves to Undo. Escape also undoes.', off: 'Each step shows at once; the line and seconds still count down.', law: 'Doherty: the action happens the moment you press.',
      tags: ['motion:springy', 'speed:mid', 'open:inplace', 'feedback:clear', 'new:twist', 'look:ember'],
      html: `<div class="cm"><div class="cm-row" data-row><span class="l-av">OK</span><span><b>Otieno Kamau</b><small data-rs>See you at the gate at 4.</small></span></div>
${cmM(`<div class="cm-f" data-f="a"><button class="cm-a" type="button" data-p data-go>${I.archive}Archive chat</button></div>
<div class="cm-f" data-f="u"><span class="cm-t" data-p style="--i:0">Archived</span><span class="cm-sec" data-p style="--i:1" aria-hidden="true" data-sec></span><button class="cm-n" type="button" data-p style="--i:2" data-undo>Undo</button><span class="cm-line" aria-hidden="true"><i data-line></i></span></div>
<div class="cm-f" data-f="d"><span data-p data-tk>${TK0}</span><span class="cm-t" data-p style="--i:1">Chat archived</span><button class="cm-n cm-again" type="button" data-p style="--i:2" data-again>Bring it back</button></div>`)}
<p class="sr" aria-live="polite" data-live></p></div>`,
      js: `var fc = TL4b.faces($('[data-m]', box), { r: 10 }), row = $('[data-row]', box), live = $('[data-live]', box), line = $('[data-line]', box), cd = null, again = $('[data-again]', box);
var sec = TLroll($('[data-sec]', box), { value: 5, live: false, dur: 420 });
function undo() { if (cd) cd.stop(); cd = null; row.classList.remove('dim'); fc.go('a', '[data-go]'); TL4b.say(live, 'Chat is back.'); }
$('[data-go]', box).addEventListener('click', function () { row.classList.add('dim'); sec.set(5, { instant: true }); line.style.transform = 'scaleX(1)'; fc.go('u', '[data-undo]'); TL4b.say(live, 'Chat archived. Undo for 5 seconds.');
  cd = TL4b.cdown($('[data-m]', box), 5000, function (p, s) { line.style.transform = 'scaleX(' + p.toFixed(4) + ')'; if (s !== sec.value) sec.set(s, { dir: 'down' }); }, function () { cd = null; $('[data-tk]', box).innerHTML = TICK; again.classList.add('on'); fc.size(); fc.go('d', '[data-again]'); TL4b.say(live, 'Chat archived.'); }); });
$('[data-undo]', box).addEventListener('click', undo);
again.addEventListener('click', function () { again.classList.remove('on'); undo(); });
box.addEventListener('keydown', function (e) { if (e.key === 'Escape' && fc.at() === 'u') { e.stopPropagation(); undo(); } });`,
    },
    {
      k: 'A', name: 'Plain: ask in place, no motion', line: 'For a quiet admin page. The button is swapped for the question and two buttons in one step. Nothing moves.',
      kind: 'Plain · use on calm, dense pages', from: [arc('confirm-morph'), sh('alert-dialog', 'shadcn/ui alert dialog')], tryit: 'Press Remove card, then Keep, then Remove.',
      needs: 'A few lines of script.', keys: 'Enter opens it and focus moves to Remove. Escape puts it back.', off: 'Same.', law: 'Hick: one question, two answers.',
      tags: ['motion:still', 'speed:quick', 'open:inplace', 'feedback:quiet', 'new:familiar', 'look:ember'],
      html: `<div class="cm"><div class="cm-row" data-row><span class="cm-ic">${I.card}</span><span><b data-ct>Visa ending 4821</b><small data-cs>Used for PocketPay top-ups.</small></span></div>
<div class="ca" data-a><button class="l-btn sm" type="button" data-go>${I.trash}Remove card</button></div>
<div class="ca" data-q hidden><span class="cm-t">Remove for good?</span><button class="l-btn sm pri" type="button" data-yes>Remove</button><button class="l-btn sm" type="button" data-no>Keep</button></div>
<div class="ca" data-d hidden><span>${TK0}</span><span class="cm-t">Card removed</span><button class="l-btn sm" type="button" data-back>Add it back</button></div><p class="sr" aria-live="polite" data-live></p></div>`,
      css: `#t11A .ca { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; } #t11A .ca .cm-t { padding-left: 0; } #t11A .ca .l-tick { width: 18px; height: 18px; }`,
      js: `var A = $('[data-a]', box), Q = $('[data-q]', box), D = $('[data-d]', box), live = $('[data-live]', box), t0 = 0;
function show(el, f) { [A, Q, D].forEach(function (x) { x.hidden = x !== el; }); if (f) $(f, el).focus({ preventScroll: true }); }
$('[data-go]', box).addEventListener('click', function () { t0 = performance.now(); show(Q, '[data-yes]'); TL4b.say(live, 'Remove the card for good? Remove or Keep.'); });
$('[data-no]', box).addEventListener('click', function () { show(A, '[data-go]'); TL4b.say(live, 'Kept.'); });
$('[data-yes]', box).addEventListener('click', function () { if (performance.now() - t0 < 280) return; show(D, '[data-back]'); $('[data-ct]', box).textContent = 'No saved card'; $('[data-cs]', box).textContent = 'Add one to top up faster.'; TL4b.say(live, 'Card removed.'); });
$('[data-back]', box).addEventListener('click', function () { show(A, '[data-go]'); $('[data-ct]', box).textContent = 'Visa ending 4821'; $('[data-cs]', box).textContent = 'Used for PocketPay top-ups.'; TL4b.say(live, 'Card added back.'); });
box.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !Q.hidden) { e.stopPropagation(); show(A, '[data-go]'); } });`,
    },
    {
      k: 'C', name: 'Type the name to close the shop', line: 'For the one action that wipes a lot. The button grows down into a small box: type DUKA to close the shop. Each right letter fills the button a quarter more orange, and it only works once full.',
      kind: 'Mix · use when it wipes a lot of data', from: [arc('confirm-morph'), house('n30')], tryit: 'Press Close shop, type duka, then press Close shop.',
      needs: 'Script and a clip spring in two directions.', keys: 'Enter opens it and focus moves to the field. Enter in the field closes the shop once it matches. Escape folds it back.', off: 'The box opens at once; the fill still shows each right letter.', law: 'Hick: one clear step, and it cannot be done by accident.',
      tags: ['motion:springy', 'speed:mid', 'open:inplace', 'feedback:loud', 'new:novel', 'look:ember'], h: 300, top: true,
      html: `<div class="cm"><div class="cm-row" data-row><span class="cm-ic">${I.store}</span><span><b>Duka Fresh</b><small data-rs>248 products · open since 2021</small></span></div>
${cmM(`<div class="cm-f" data-f="a"><button class="cm-a" type="button" data-p data-go>${I.trash}Close shop</button></div>
<div class="cm-f cc-q" data-f="q"><p class="cc-t" data-p style="--i:0">Type <b>DUKA</b> to close Duka Fresh for good. Its 248 products go too.</p><input class="l-in" data-p style="--i:1" data-in aria-label="Type DUKA to confirm" autocomplete="off" spellcheck="false"><div class="cc-r" data-p style="--i:2"><button class="cm-n" type="button" data-no>Cancel</button><button class="cc-y" type="button" data-yes aria-disabled="true"><span class="cc-fill" data-fill></span><span class="cc-yl">Close shop</span></button></div></div>
<div class="cm-f" data-f="busy"><span class="l-spin" data-p></span><span class="cm-t" data-p style="--i:1">Closing the shop…</span></div>
<div class="cm-f" data-f="d"><span data-p data-tk>${TK0}</span><span class="cm-t" data-p style="--i:1">Shop closed</span><button class="cm-n" type="button" data-p style="--i:2" data-again>Open it again</button></div>`)}
<p class="sr" aria-live="polite" data-live></p></div>`,
      css: `#t11C .cc-q { flex-direction: column; align-items: stretch; height: auto; gap: 10px; padding: 12px; width: min(300px, calc(100vw - 124px)); white-space: normal; }
#t11C .cc-t { margin: 0; font-size: 13.5px; color: var(--ink-soft); } #t11C .cc-t b { color: var(--ink); font-family: var(--font-mono); }
#t11C .cc-q .l-in { height: 38px; font-family: var(--font-mono); letter-spacing: .1em; text-transform: uppercase; }
#t11C .cc-r { display: flex; justify-content: flex-end; gap: 6px; }
#t11C .cc-y { position: relative; overflow: hidden; height: 34px; padding: 0 14px; border-radius: 8px; border: 1px solid rgb(var(--accent-rgb) / .45); font-size: 13.5px; font-weight: 600; color: var(--accent-text); background: var(--paper-raised); }
#t11C .cc-fill { position: absolute; inset: 0; background: var(--accent); transform-origin: left; transform: scaleX(0); transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#t11C .cc-yl { position: relative; transition: color .2s; }
#t11C .cc-y.full .cc-yl { color: var(--on-accent); }`,
      js: `var m = $('[data-m]', box), fc = TL4b.faces(m, { r: 12 }), inp = $('[data-in]', box), y = $('[data-yes]', box), fill = $('[data-fill]', box), live = $('[data-live]', box), rs2 = $('[data-rs]', box), W = 'DUKA', t0 = 0;
function score() { var v = inp.value.toUpperCase(), n = 0; while (n < W.length && v[n] === W[n]) n++; if (v.length > W.length) n = Math.min(n, W.length - 1); fill.style.transform = 'scaleX(' + (n / W.length) + ')'; var ok = n === W.length && v.length === W.length; y.classList.toggle('full', ok); y.setAttribute('aria-disabled', String(!ok)); return ok; }
function back() { inp.value = ''; score(); fc.go('a', '[data-go]'); }
$('[data-go]', box).addEventListener('click', function () { t0 = performance.now(); fc.go('q', '[data-in]'); TL4b.say(live, 'Type DUKA to close the shop.'); });
inp.addEventListener('input', score);
function go() { if (!score() || performance.now() - t0 < 280) { if (!score()) TL4b.say(live, 'Type DUKA first.'); return; } fc.go('busy'); TL4b.say(live, 'Closing the shop.');
  setTimeout(function () { $('[data-tk]', box).innerHTML = TICK; fc.go('d', '[data-again]'); rs2.textContent = 'Closed today'; $('[data-row]', box).classList.add('dim'); TL4b.say(live, 'Shop closed.'); }, 1200); }
y.addEventListener('click', go);
inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } });
$('[data-no]', box).addEventListener('click', back);
$('[data-again]', box).addEventListener('click', function () { $('[data-row]', box).classList.remove('dim'); rs2.textContent = '248 products · open since 2021'; back(); TL4b.say(live, 'Shop open again.'); });
box.addEventListener('keydown', function (e) { if (e.key === 'Escape' && fc.at() === 'q') { e.stopPropagation(); back(); } });`,
    },
    {
      k: 'D', name: 'Round 3\'s remove button, pushed', line: 'Your round 3 B with well-curved corners. It asks in place, ignores a press in the first quarter second, shows a spinner, then the card row folds away while the button offers Undo on a draining orange line.',
      kind: 'Reference, pushed · use when it is rare and big', from: [arc('confirm-morph'), house('n29')], tryit: 'Press Remove card, then Remove, then Undo.',
      needs: 'Script, a clip spring and a height glide.', keys: 'Enter opens it; focus moves to Remove, then to Undo. Escape steps back. Held keys never repeat a press.', off: 'Each step shows at once; the row folds at once.', law: 'Fitts: the answer appears right where you pressed.',
      tags: ['motion:springy', 'speed:mid', 'open:inplace', 'feedback:clear', 'new:twist', 'look:ember'], h: 270,
      html: `<div class="cm"><div class="cm-wrap" data-wrap><div class="cm-row" data-row><span class="cm-ic">${I.card}</span><span><b>Visa ending 4821</b><small>Expires 08/28. Used for PocketPay top-ups.</small></span></div></div>
${cmM(`<div class="cm-f" data-f="a"><button class="cm-a" type="button" data-p data-go>${I.trash}Remove card</button></div>
<div class="cm-f" data-f="q"><span class="cm-t" data-p style="--i:0">Remove for good?</span><button class="cm-y" type="button" data-p style="--i:1" data-yes>Remove</button><button class="cm-n" type="button" data-p style="--i:2" data-no>Keep</button></div>
<div class="cm-f" data-f="busy"><span class="l-spin" data-p></span><span class="cm-t" data-p style="--i:1">Removing…</span></div>
<div class="cm-f" data-f="d"><span data-p data-tk>${TK0}</span><span class="cm-t" data-p style="--i:1">Card removed</span><button class="cm-n" type="button" data-p style="--i:2" data-undo>Undo</button><span class="cm-line" aria-hidden="true"><i data-line></i></span></div>`)}
<p class="sr" aria-live="polite" data-live></p></div>`,
      css: `#t11D .cm-wrap { width: 100%; overflow: hidden; }
#t11D .cm-wrap.gone { height: 0; } #t11D .cm-wrap.gone .cm-row { opacity: 0; }`,
      js: `var fc = TL4b.faces($('[data-m]', box), { r: 10 }), wrap = $('[data-wrap]', box), live = $('[data-live]', box), line = $('[data-line]', box), t0 = 0, rep = false, cd = null;
function fold(gone) { var h0 = wrap.offsetHeight; wrap.classList.toggle('gone', gone); var h1 = wrap.offsetHeight; if (moving()) wrap.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: gone ? 380 : 440, easing: 'cubic-bezier(.22,1,.36,1)' }); }
$('[data-go]', box).addEventListener('click', function () { t0 = performance.now(); fc.go('q', '[data-yes]'); TL4b.say(live, 'Remove the card for good? Remove or Keep.'); });
$('[data-no]', box).addEventListener('click', function () { fc.go('a', '[data-go]'); TL4b.say(live, 'Kept.'); });
box.addEventListener('keydown', function (e) { rep = e.repeat; if (rep && (e.key === 'Enter' || e.key === ' ')) e.preventDefault(); if (e.key === 'Escape') { if (fc.at() === 'q') { e.stopPropagation(); fc.go('a', '[data-go]'); } else if (fc.at() === 'd' && cd) { e.stopPropagation(); $('[data-undo]', box).click(); } } });
box.addEventListener('keyup', function () { rep = false; });
$('[data-yes]', box).addEventListener('click', function () { if (performance.now() - t0 < 280 || rep) return; fc.go('busy'); TL4b.say(live, 'Removing the card.');
  setTimeout(function () { $('[data-tk]', box).innerHTML = TICK; line.style.transform = 'scaleX(1)'; fold(true); fc.go('d', '[data-undo]'); TL4b.say(live, 'Card removed. Undo for 6 seconds.');
    cd = TL4b.cdown($('[data-m]', box), 6000, function (p) { line.style.transform = 'scaleX(' + p.toFixed(4) + ')'; }, function () { cd = null; $('[data-undo]', box).textContent = 'Add it back'; line.style.transform = 'scaleX(0)'; }); }, 900); });
$('[data-undo]', box).addEventListener('click', function () { if (cd) cd.stop(); cd = null; fold(false); this.textContent = 'Undo'; fc.go('a', '[data-go]'); TL4b.say(live, 'Card is back.'); });`,
    },
  ],
};

/* ---------------- 12 Hold to confirm ---------------- */
const hold = {
  id: 'hold', n: '12', name: 'Hold to confirm', h: 250,
  claim: 'For what can\'t be undone, <em>hold, don\'t tap.</em>',
  lead: 'Press and keep holding. The orange fill shows how close you are. Let go early and it drains back on a spring; press again and it goes on from there. With a keyboard, hold Space or Enter.',
  ref: { ids: 'n29', text: 'The pay button that rolls: its words roll up to "Paying…", then a tick pops and draws in.' },
  noteHint: 'B, but a shorter hold', moreHint: 'hold to end a live sale',
  css: `#hold .hd { width: min(100%, 330px); display: grid; gap: 10px; justify-items: center; text-align: center; }
#hold .hd-k { margin: 0; font-size: 13.5px; color: var(--ink-soft); } #hold .hd-k b { color: var(--ink); }
#hold .hd-hint { margin: 0; min-height: 1.45em; font-size: 12.5px; color: var(--muted); }
#hold .hd-again { display: none; } #hold .hd-again.on { display: inline-flex; }
#hold [aria-disabled="true"] { cursor: default; }
#hold button { touch-action: manipulation; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }`,
  opts: [
    {
      k: 'B', name: 'The words change colour right at the fill\'s edge', line: 'The button holds two copies of its words: ink on paper, and white on orange. As you hold, the orange copy is uncovered from the left, so each letter turns white exactly as the fill passes it. When it is full the words change to "Shop deleted" with a tick.',
      from: [arc('hold-to-confirm'), arc('confirm-morph')], tryit: 'Hold for a second and let go, then hold all the way.',
      needs: 'Script and a spring.', keys: 'Hold Space or Enter. Tab away cancels.', off: 'The fill still follows your hold; letting go empties it at once.', law: 'Fitts: one big target, and time does the checking.',
      tags: ['motion:springy', 'speed:slow', 'feedback:loud', 'open:inplace', 'new:twist', 'look:ember'],
      html: `<div class="hd"><p class="hd-k">This deletes <b>Duka Fresh</b>, its 248 products and all their sales.</p>
<button class="hb t4b-b" type="button" aria-describedby="t12B-h" data-b><span class="hb-l"><span class="hb-w" data-w>${I.trash}<span>Hold to delete shop</span></span></span><span class="hb-l hb-o" data-o aria-hidden="true"><span class="hb-w">${I.trash}<span>Hold to delete shop</span></span></span><span class="hb-d"><span data-tk></span>Shop deleted</span></button>
<p class="hd-hint" id="t12B-h" data-hint>Press and hold for 1.6 seconds. With a keyboard, hold Space or Enter.</p><button class="l-btn sm hd-again" type="button" data-again>Start again</button><p class="sr" role="status" data-live></p></div>`,
      css: `#t12B .hb { position: relative; display: grid; height: 44px; min-width: 230px; border-radius: 10px; border: 1px solid rgb(var(--accent-rgb) / .5); background: var(--paper-raised); color: var(--accent-text); font-size: 14.5px; font-weight: 600; overflow: hidden; transition: transform .15s var(--ease-out); }
#t12B .hb.is-held { transform: scale(.97); }
#t12B .hb > * { grid-area: 1 / 1; display: grid; place-items: center; padding: 0 16px; }
#t12B .hb-w { display: inline-flex; align-items: center; gap: 8px; } #t12B .hb-w svg { width: 16px; height: 16px; }
#t12B .hb-o { background: var(--accent); color: var(--on-accent); clip-path: inset(0 100% 0 0); }
#t12B .hb-d { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--accent); color: var(--on-accent); opacity: 0; transform: translateY(6px); transition: opacity .2s var(--ease-out), transform var(--sp-snappy-d) var(--sp-snappy); }
#t12B .hb-d .l-tick { width: 20px; height: 20px; } #t12B .hb-d .l-tick circle { fill: var(--on-accent); } #t12B .hb-d .l-tick path { stroke: var(--accent); }
#t12B .hb.done .hb-d { opacity: 1; transform: none; } #t12B .hb.done .hb-l { opacity: 0; transition: opacity .12s; }`,
      js: `var b = $('[data-b]', box), o = $('[data-o]', box), hint = $('[data-hint]', box), live = $('[data-live]', box), ag = $('[data-again]', box), H = hint.textContent;
var h = TL4b.hold(b, { ms: 1600, draw: function (p) { o.style.clipPath = 'inset(0 ' + ((1 - p) * 100).toFixed(2) + '% 0 0)'; },
  start: function () { hint.textContent = 'Keep holding…'; },
  early: function (p) { hint.textContent = p < .15 ? 'Press and hold. A tap does nothing.' : 'Let go too soon. Hold a little longer.'; TL4b.say(live, 'Keep holding to delete the shop.'); },
  done: function () { $('[data-tk]', box).innerHTML = TICK; b.classList.add('done'); b.setAttribute('aria-label', 'Shop deleted'); hint.textContent = 'Duka Fresh is deleted.'; TL4b.say(live, 'Shop deleted.'); ag.classList.add('on'); } });
ag.addEventListener('click', function () { h.reset(); b.classList.remove('done'); b.removeAttribute('aria-label'); hint.textContent = H; ag.classList.remove('on'); b.focus({ preventScroll: true }); });`,
    },
    {
      k: 'A', name: 'Plain: a line fills under the button', line: 'A plain button with a thin orange line under it that fills while you hold. Let go early and the line empties. When it is full the button says Deleted.',
      from: [arc('hold-to-confirm'), sh('button')], tryit: 'Hold the button down until the line is full.',
      needs: 'A few lines of script.', keys: 'Hold Space or Enter. Tab away cancels.', off: 'Same; the line empties at once.', law: 'Hick: one button, one way to use it.',
      tags: ['motion:some', 'speed:slow', 'feedback:clear', 'new:familiar', 'look:ember'],
      html: `<div class="hd"><p class="hd-k">Removes <b>Wanjiku Kamau</b> from your team. She loses access at once.</p><div class="ha"><button class="l-btn ha-b t4b-b" type="button" aria-describedby="t12A-h" data-b>${rs([['a', 'Hold to remove'], ['d', 'Removed']])}</button><span class="ha-line" aria-hidden="true"><i data-line></i></span></div>
<p class="hd-hint" id="t12A-h" data-hint>Press and hold. With a keyboard, hold Space or Enter.</p><button class="l-btn sm hd-again" type="button" data-again>Start again</button><p class="sr" role="status" data-live></p></div>`,
      css: `#t12A .ha { display: grid; gap: 6px; width: 200px; } #t12A .ha-b { width: 100%; color: var(--accent-text); }
#t12A .ha-line { height: 3px; border-radius: 3px; background: rgb(var(--ink-rgb) / .1); overflow: hidden; } #t12A .ha-line i { display: block; height: 100%; background: var(--accent); transform-origin: left; transform: scaleX(0); }`,
      js: `var b = $('[data-b]', box), l = $('[data-line]', box), hint = $('[data-hint]', box), live = $('[data-live]', box), ag = $('[data-again]', box), H = hint.textContent;
var h = TL4b.hold(b, { ms: 1400, draw: function (p) { l.style.transform = 'scaleX(' + p.toFixed(4) + ')'; }, early: function () { hint.textContent = 'Let go too soon. Hold until the line is full.'; },
  done: function () { TL4b.swap($('.t4b-rs', b), 'd'); hint.textContent = 'Wanjiku is no longer on your team.'; TL4b.say(live, 'Removed.'); ag.classList.add('on'); } });
ag.addEventListener('click', function () { h.reset(); TL4b.swap($('.t4b-rs', b), 'a'); hint.textContent = H; ag.classList.remove('on'); });`,
    },
    {
      k: 'C', name: 'A round button with a ring that fills', line: 'A round icon button. While you hold, an orange ring draws around it and the seconds left roll down beside it. Let go and the ring winds back. Full, the icon turns into an orange tick.',
      kind: 'Mix', from: [arc('hold-to-confirm'), house('n07')], tryit: 'Hold the round button, let go halfway, then hold again.',
      needs: 'Script, a spring and the number roll.', keys: 'Hold Space or Enter on the button. Tab away cancels.', off: 'The ring still follows your hold; it empties at once.', law: 'Fitts: a big round thumb target.',
      tags: ['motion:springy', 'speed:slow', 'density:compact', 'feedback:loud', 'new:novel', 'look:ember'],
      html: `<div class="hd hc"><div class="hc-r"><button class="hc-b t4b-b" type="button" aria-label="Hold to cancel the payout" aria-describedby="t12C-h" data-b><svg class="hc-ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29" class="hc-t"/><circle cx="32" cy="32" r="29" class="hc-f" data-ring/></svg><span class="hc-i"><span class="hc-ic">${I.cash}</span><span class="hc-ok" data-tk>${TK0}</span></span></button>
<span class="hc-tx"><b data-t>Cancel payout</b><small>KES 12,000 to Otieno Kamau</small><small class="hc-s" aria-hidden="true"><span data-sec></span> s to hold</small></span></div>
<p class="hd-hint" id="t12C-h" data-hint>Press and hold for 2 seconds, or hold Space.</p><button class="l-btn sm hd-again" type="button" data-again>Start again</button><p class="sr" role="status" data-live></p></div>`,
      css: `#t12C .hc-r { display: flex; align-items: center; gap: 14px; text-align: left; }
#t12C .hc-b { position: relative; width: 64px; height: 64px; flex: none; border-radius: 50%; display: grid; place-items: center; background: var(--paper-raised); color: var(--ink-soft); box-shadow: var(--shadow-sm); transition: transform .15s var(--ease-out); }
#t12C .hc-b.is-held { transform: scale(.95); }
#t12C .hc-ring { position: absolute; inset: 0; width: 64px; height: 64px; transform: rotate(-90deg); }
#t12C .hc-ring circle { fill: none; stroke-width: 3; } #t12C .hc-t { stroke: var(--line-hi); } #t12C .hc-f { stroke: var(--accent); stroke-linecap: round; stroke-dasharray: 182.2; stroke-dashoffset: 182.2; }
#t12C .hc-i { display: grid; } #t12C .hc-i > * { grid-area: 1 / 1; display: grid; transition: opacity .16s, transform var(--sp-bouncy-d) var(--sp-bouncy); }
#t12C .hc-ic svg { width: 22px; height: 22px; } #t12C .hc-ok { opacity: 0; transform: scale(.6); } #t12C .hc-ok .l-tick { width: 26px; height: 26px; }
#t12C .done .hc-ok { opacity: 1; transform: none; } #t12C .done .hc-ic { opacity: 0; transform: scale(.6); }
#t12C .hc-tx { display: grid; } #t12C .hc-tx b { font-size: 14.5px; color: var(--ink); } #t12C .hc-tx small { font-size: 12.5px; color: var(--muted); }
#t12C .hc-s { font-family: var(--font-num); color: var(--accent-text) !important; }`,
      js: `var b = $('[data-b]', box), ring = $('[data-ring]', box), hint = $('[data-hint]', box), live = $('[data-live]', box), ag = $('[data-again]', box), tt = $('[data-t]', box), H = hint.textContent, C = 182.2;
var sec = TLroll($('[data-sec]', box), { value: 2.0, fmt: function (n) { return n.toFixed(1); }, live: false, dur: 260 });
var h = TL4b.hold(b, { ms: 2000, draw: function (p) { ring.style.strokeDashoffset = (C * (1 - p)).toFixed(2); var s = Math.round((1 - p) * 20) / 10; if (s !== sec.value) sec.set(s); },
  early: function () { hint.textContent = 'Let go too soon. Hold until the ring closes.'; TL4b.say(live, 'Keep holding to cancel the payout.'); },
  done: function () { $('[data-tk]', box).innerHTML = TICK; b.classList.add('done'); b.setAttribute('aria-label', 'Payout cancelled'); tt.textContent = 'Payout cancelled'; hint.textContent = 'KES 12,000 stays in your PocketPay wallet.'; TL4b.say(live, 'Payout cancelled.'); ag.classList.add('on'); } });
ag.addEventListener('click', function () { h.reset(); b.classList.remove('done'); b.setAttribute('aria-label', 'Hold to cancel the payout'); tt.textContent = 'Cancel payout'; hint.textContent = H; ag.classList.remove('on'); });`,
    },
    {
      k: 'D', name: 'Your pay button, held instead of pressed', line: 'Your n29 pay button, pushed. Sending money cannot be taken back, so you hold it. The orange fills in from the left; when it is full the words roll up to "Sending…", then a tick pops and the words roll to "Sent".',
      kind: 'Reference, pushed', from: [house('n29'), arc('hold-to-confirm')], tryit: 'Hold Send until it fills, then watch the words.',
      needs: 'Script, a spring and the line roll.', keys: 'Hold Space or Enter. Tab away cancels.', off: 'The fill follows your hold; the words change in place.', law: 'Doherty: it answers the moment it is full.',
      tags: ['motion:springy', 'speed:slow', 'feedback:loud', 'open:inplace', 'new:twist', 'look:ember'],
      html: `<div class="hd"><p class="hd-k">Send to <b>Amina Otieno</b> · +254 712 345 678</p><button class="hp t4b-b" type="button" aria-describedby="t12D-h" data-b><span class="hp-f" data-f></span><span class="hp-c"><span class="hp-tk" data-tk></span><span data-l>Hold to send KES 4,200</span></span></button>
<p class="hd-hint" id="t12D-h" data-hint>Press and hold. With a keyboard, hold Space or Enter.</p><button class="l-btn sm hd-again" type="button" data-again>Send another</button><p class="sr" role="status" data-live></p></div>`,
      css: `#t12D .hp { position: relative; height: 46px; min-width: 240px; border-radius: 10px; overflow: hidden; background: rgb(var(--accent-rgb) / .14); color: var(--accent-text); font-size: 15px; font-weight: 600; transition: transform .15s var(--ease-out), color .2s; }
#t12D .hp.is-held { transform: scale(.97); }
#t12D .hp-f { position: absolute; inset: 0; background: var(--accent); transform-origin: left; transform: scaleX(0); }
#t12D .hp.full { color: var(--on-accent); }
#t12D .hp-c { position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 0 18px; }
#t12D .hp-tk:empty { display: none; } #t12D .hp-tk .l-tick { width: 20px; height: 20px; } #t12D .hp-tk .l-tick circle { fill: var(--on-accent); } #t12D .hp-tk .l-tick path { stroke: var(--accent); }`,
      js: `var b = $('[data-b]', box), f = $('[data-f]', box), hint = $('[data-hint]', box), live = $('[data-live]', box), ag = $('[data-again]', box), tk = $('[data-tk]', box), H = hint.textContent, ln = TLline($('[data-l]', box));
var h = TL4b.hold(b, { ms: 1500, draw: function (p) { f.style.transform = 'scaleX(' + p.toFixed(4) + ')'; b.classList.toggle('full', p > .55); },
  early: function () { hint.textContent = 'Let go too soon. Nothing was sent.'; TL4b.say(live, 'Not sent. Keep holding to send.'); },
  done: function () { ln.set('Sending…', 1); b.setAttribute('aria-busy', 'true'); TL4b.say(live, 'Sending KES 4,200.');
    setTimeout(function () { tk.innerHTML = TICK; ln.set('Sent to Amina', 1); b.removeAttribute('aria-busy'); hint.textContent = 'KES 4,200 sent. Receipt PP-4821.'; TL4b.say(live, 'Sent.'); ag.classList.add('on'); }, 1100); } });
ag.addEventListener('click', function () { h.reset(); tk.innerHTML = ''; ln.set('Hold to send KES 4,200', -1); hint.textContent = H; ag.classList.remove('on'); b.focus({ preventScroll: true }); });`,
    },
  ],
};

/* ---------------- 13 Reactions ---------------- */
const RX = { agree: ['Agree', I.thumb], thanks: ['Thanks', I.heart], funny: ['Funny', I.smile], seen: ['Seen', I.eye], nice: ['Nice', I.spark], gotit: ['Got it', TK0] };
const RXJS = String.raw`
TL4b.RX = ` + JSON.stringify(Object.fromEntries(Object.entries(RX).map(([k, [l, ic]]) => [k, [l, ic]]))) + String.raw`;
/* chips with counts that roll. o.list: [[key, count, mine]]; o.sort: keep the biggest first; o.pick: an add button with a picker */
TL4b.rx = function (box, o) {
  var bar = $('[data-bar]', box), add = $('[data-add]', box), live = $('[data-live]', box), tot = o.total ? TLroll($('[data-tot]', box), { value: 0, live: false, dur: 520 }) : null, C = {};
  function label(c) { var n = c.n, l = TL4b.RX[c.k][0]; return l + ', ' + n + (n === 1 ? ' reaction' : ' reactions') + (c.mine ? ', including yours' : ''); }
  function chips() { return $$('[data-r]', bar); }
  function all() { return chips().concat(add ? [add] : []); }
  function total() { if (!tot) return; var t = 0; Object.keys(C).forEach(function (k) { t += C[k].n; }); tot.set(t); }
  function make(k, n, mine) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'rx-c t4b-b'; b.setAttribute('data-r', k);
    b.innerHTML = '<span class="rx-ic">' + TL4b.RX[k][1] + '</span><span class="rx-n"></span>';
    var c = C[k] = { k: k, n: n, mine: !!mine, el: b }; c.roll = TLroll($('.rx-n', b), { value: n, live: false, dur: 460 });
    var ic = $('.rx-ic', b); c.sp = TLb.sp(function (x) { ic.style.transform = 'scale(' + x.toFixed(3) + ')'; }, { x: 1, k: 430, c: 15, eps: .002 });
    b.addEventListener('click', function () { toggle(k); });
    paint(c); return c;
  }
  function paint(c) { c.el.setAttribute('aria-pressed', String(c.mine)); c.el.setAttribute('aria-label', label(c)); }
  function kick(c) { if (moving()) c.sp.to(1, { v: (c.sp.v || 0) + 7 }); }
  function order(change) { TL4b.flip2(all(), function () { change(); if (o.sort) chips().map(function (e) { return C[e.getAttribute('data-r')]; }).sort(function (a, b) { return b.n - a.n; }).forEach(function (c) { bar.insertBefore(c.el, add || null); }); }); }
  function bump(k, d, mine) {
    var c = C[k];
    if (!c) { order(function () { c = make(k, 0, false); bar.insertBefore(c.el, add || null); if (moving()) c.el.animate([{ transform: 'scale(.6)', opacity: 0, filter: 'blur(4px)' }, { transform: 'none', opacity: 1, filter: 'none' }], { duration: TLsp('snappy').d, easing: TLsp('snappy').e }); }); }
    c.n = Math.max(0, c.n + d); if (mine != null) c.mine = mine; c.roll.set(c.n, { dir: d > 0 ? 'up' : 'down' }); paint(c); if (d > 0) kick(c);
    if (c.n === 0 && o.drop) { var f = document.activeElement === c.el, sib = c.el.nextElementSibling || c.el.previousElementSibling || add; delete C[k];
      var gone = function () { order(function () { c.el.remove(); }); if (f && sib) sib.focus({ preventScroll: true }); };
      if (moving()) c.el.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.6)', opacity: 0, filter: 'blur(4px)' }], { duration: 160, easing: 'ease-in', fill: 'forwards' }).onfinish = gone; else gone(); }
    else if (o.sort) order(function () {});
    total(); return c;
  }
  function toggle(k) { var c = C[k]; if (!c) return; var on = !c.mine; bump(k, on ? 1 : -1, on); TL4b.say(live, on ? 'You reacted ' + TL4b.RX[k][0] + '.' : 'Your ' + TL4b.RX[k][0] + ' is removed.'); }
  o.list.forEach(function (r) { var c = make(r[0], r[1], r[2]); bar.insertBefore(c.el, add || null); }); total();
  return { bump: bump, toggle: toggle, get: function (k) { return C[k]; } };
};`;
const rxNote = (who, ini, time, text) => `<div class="rx-note"><span class="l-av">${ini}</span><div><p class="rx-h"><b>${who}</b><span>${time}</span></p><p class="rx-t">${text}</p></div></div>`;

const reactions = {
  id: 'reactions', n: '13', name: 'Reactions', h: 300,
  claim: 'One tap can <em>answer a note</em> without a reply.',
  lead: 'Our own take on reactions, on order notes and team notes. No emoji: our own line icons, and "Got it" uses the orange tick because it means done. Every count rolls to its new value.',
  ref: { ids: 'n46', text: 'Filter chips that add up: chips with a small count that changes as you pick.' },
  noteHint: 'B, but without the Funny one', moreHint: 'reactions on a photo of a delivery',
  css: `#reactions .rx { width: min(100%, 340px); display: grid; gap: 10px; text-align: left; position: relative; }
#reactions .rx-card { padding: 12px 14px; border-radius: 14px; border: 1px solid var(--line); background: var(--paper-raised); display: grid; gap: 10px; position: relative; }
#reactions .rx-note { display: flex; gap: 10px; } #reactions .rx-note .l-av { width: 32px; height: 32px; flex-basis: 32px; font-size: 12px; }
#reactions .rx-h { margin: 0; display: flex; gap: 8px; align-items: baseline; font-size: 13.5px; } #reactions .rx-h b { color: var(--ink); } #reactions .rx-h span { font-size: 12px; color: var(--muted); }
#reactions .rx-t { margin: 2px 0 0; font-size: 14px; color: var(--ink-soft); }
#reactions .rx-bar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
#reactions .rx-c { display: inline-flex; align-items: center; gap: 5px; height: 30px; padding: 0 10px 0 8px; border-radius: 15px; border: 1px solid var(--line-hi); background: var(--paper-raised); font-size: 13px; font-weight: 500; color: var(--ink-soft); transition: background-color .15s, border-color .15s, color .15s; }
#reactions .rx-c:hover { border-color: rgb(var(--ink-rgb) / .42); }
#reactions .rx-c[aria-pressed="true"] { background: rgb(var(--ink-rgb) / .08); border-color: rgb(var(--ink-rgb) / .5); color: var(--ink); }
#reactions .rx-ic { display: grid; } #reactions .rx-ic svg { width: 15px; height: 15px; } #reactions .rx-ic .l-tick { width: 15px; height: 15px; }
#reactions .rx-n { font-family: var(--font-num); font-size: 14px; min-width: 1ch; }
#reactions .rx-add { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; border: 1px dashed var(--line-hi); color: var(--muted); }
#reactions .rx-add:hover { color: var(--ink); border-color: rgb(var(--ink-rgb) / .42); } #reactions .rx-add svg { width: 16px; height: 16px; }`,
  js: RXJS,
  opts: [
    {
      k: 'B', name: 'Chips that pop in, and a picker that grows from the add button', line: 'Tap a chip to add or remove yours: its count rolls and its icon gets a little kick, which stacks if you tap fast. The add button opens a picker with one gliding highlight. A new reaction pops in and the others move aside on a spring.',
      from: [arc('reactions'), house('n46')], tryit: 'Tap Agree fast three times, then add Got it from the picker, then remove it again.',
      needs: 'Script, springs and the number roll.', keys: 'Tab to a chip and press Enter. In the picker, the arrows move and Enter picks; Escape closes and puts focus back.', off: 'Counts change in place; chips show and go at once.', law: 'Fitts: the reactions you use sit right under the note.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'open:trigger', 'new:twist', 'look:ember'], h: 320, top: true,
      html: `<div class="rx"><div class="rx-card">${rxNote('Wanjiku Kamau', 'WK', '2 min ago', 'Delivery moved to 4 pm. The gate code is 2580.')}<div class="rx-bar" role="group" aria-label="Reactions" data-bar><button class="rx-add t4b-b" type="button" aria-label="Add reaction" aria-haspopup="true" data-add>${I.react}</button></div>
<div class="rx-pk l-panel l-pop" role="toolbar" aria-label="Pick a reaction" data-pk><span class="t4b-hl" data-hl></span>${Object.entries(RX).map(([k, [l, ic]]) => `<button class="rx-o" type="button" data-o="${k}" aria-label="${l}">${ic}</button>`).join('')}</div></div><p class="sr" role="status" data-live></p></div>`,
      css: `#t13B .rx-pk { position: absolute; z-index: 5; left: 12px; top: calc(100% - 8px); display: flex; gap: 2px; padding: 5px; border-radius: 14px; transform-origin: 10px 0; --from: translateY(-4px) scale(.6); --in: var(--sp-bouncy-d); --ease: var(--sp-bouncy); }
#t13B .rx-o { position: relative; z-index: 1; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-soft); }
#t13B .rx-o svg { width: 18px; height: 18px; } #t13B .rx-o .l-tick { width: 19px; height: 19px; }
#t13B .rx-o:active > * { scale: .86; } #t13B .rx-o > * { transition: scale .12s var(--ease-out); }
#t13B .rx-o:focus { outline: none; }`,
      js: `var r = TL4b.rx(box, { list: [['agree', 3, false], ['thanks', 2, true]], drop: true }), add = $('[data-add]', box), pk = $('[data-pk]', box), os = $$('[data-o]', pk), live = $('[data-live]', box);
var hl = TL4b.hl(pk, $('[data-hl]', pk), { r: 19 });
var p = pop(add, pk, { focus: '[data-o]', onClose: function () { hl.hide(); } });
TL4b.rove(os, { single: true });
os.forEach(function (o) { o.addEventListener('focus', function () { hl.to(o); }); o.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' && hl.cur() !== o) hl.to(o); });
  o.addEventListener('pointerdown', function () { hl.press(true); }); o.addEventListener('pointerup', function () { hl.press(false); });
  o.addEventListener('click', function () { var k = o.getAttribute('data-o'), c = r.get(k); if (c && c.mine) { r.bump(k, 0); TL4b.say(live, 'You already reacted ' + TL4b.RX[k][0] + '.'); if (moving()) c.sp.to(1, { v: 7 }); } else { r.bump(k, 1, true); TL4b.say(live, 'You reacted ' + TL4b.RX[k][0] + '.'); } p.set(false); }); });
pk.addEventListener('pointerleave', function () { if (!pk.contains(document.activeElement) || !document.activeElement.matches(':focus-visible')) hl.to(document.activeElement && pk.contains(document.activeElement) ? document.activeElement : null); });`,
    },
    {
      k: 'A', name: 'A plain row of reactions', line: 'Four fixed reactions under the note. Tap one to add or take away yours. Only the count moves: it rolls.',
      from: [sh('toggle')], tryit: 'Tap Seen, then tap it again.',
      needs: 'A few lines of script and the number roll.', keys: 'Tab to each, then Enter or Space.', off: 'Counts change in place.', law: 'Hick: four choices, always the same.',
      tags: ['motion:some', 'speed:quick', 'density:compact', 'feedback:quiet', 'new:familiar', 'look:ember'],
      html: `<div class="rx"><div class="rx-card">${rxNote('Brian Mwangi', 'BM', '9:40 am', 'Stock count for Duka Fresh Kilimani is done.')}<div class="rx-bar" role="group" aria-label="Reactions" data-bar></div></div><p class="sr" role="status" data-live></p></div>`,
      js: `TL4b.rx(box, { list: [['seen', 4, false], ['gotit', 2, false], ['thanks', 1, false], ['agree', 0, false]] });`,
    },
    {
      k: 'C', name: 'Hold React and slide to pick', line: 'A variation for a delivery note. Press and hold React, or tap it, and six reactions fan out above it. Slide along: the one under your finger grows and its neighbours lean in. Let go on one to send it.',
      kind: 'Mix', from: [arc('reactions'), house('n33')], tryit: 'Hold React, slide to Thanks and let go. Then tap React and pick Thanks again to take it back.',
      needs: 'Script and CSS springs.', keys: 'Enter opens the fan. Left and right move; the one with focus grows. Enter sends; Escape closes.', off: 'The fan shows at once; icons grow without moving.', law: 'Fitts: the choice comes to where your thumb already is.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:loud', 'open:trigger', 'new:novel', 'look:ember'], h: 320,
      html: `<div class="rx"><div class="rx-card fc">${rxNote('Otieno Kamau · rider', 'OK', 'just now', 'Your order is at the gate. Please come down.')}
<div class="fc-row"><div class="fc-w"><button class="fc-b t4b-b" type="button" aria-haspopup="true" aria-expanded="false" data-b><span class="fc-i" data-i>${I.thumb}</span><span data-l>React</span></button>
<div class="fc-fan" role="toolbar" aria-label="Pick a reaction" data-fan>${Object.entries(RX).map(([k, [l, ic]]) => `<button class="fc-o" type="button" data-o="${k}" aria-label="${l}" tabindex="-1"><span>${ic}</span><em>${l}</em></button>`).join('')}</div></div>
<span class="fc-s" aria-hidden="true"><span data-n></span> reactions</span></div></div><p class="sr" role="status" data-live></p></div>`,
      css: `#t13C .fc-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
#t13C .fc-w { position: relative; }
#t13C .fc-b { display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 12px 0 10px; border-radius: 9px; border: 1px solid var(--line-hi); background: var(--paper-raised); font-size: 13.5px; font-weight: 500; color: var(--ink-soft); -webkit-user-select: none; user-select: none; touch-action: none; }
#t13C .fc-b[aria-pressed="true"] { color: var(--ink); background: rgb(var(--ink-rgb) / .08); }
#t13C .fc-i { display: grid; } #t13C .fc-i svg { width: 16px; height: 16px; } #t13C .fc-i .l-tick { width: 16px; height: 16px; }
#t13C .fc-s { font-size: 12.5px; color: var(--muted); } #t13C .fc-s span { font-family: var(--font-num); font-size: 14px; color: var(--ink-soft); }
#t13C .fc-fan { position: absolute; z-index: 5; left: -4px; bottom: calc(100% + 8px); display: flex; gap: 2px; padding: 6px; border-radius: 14px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-lg); visibility: hidden; opacity: 0; transform: translateY(6px) scale(.9); transform-origin: 20px 100%; transition: opacity .12s, transform .15s var(--ease-out), visibility 0s linear .15s; }
#t13C .fc-fan.on { visibility: visible; opacity: 1; transform: none; transition: opacity .16s, transform var(--sp-bouncy-d) var(--sp-bouncy), visibility 0s; }
#t13C .fc-o { position: relative; width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-soft); }
#t13C .fc-o > span { display: grid; transform: scale(var(--s, 1)) translateY(calc((var(--s, 1) - 1) * -14px)); transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#t13C .fc-o svg { width: 19px; height: 19px; } #t13C .fc-o .l-tick { width: 20px; height: 20px; }
#t13C .fc-o em { position: absolute; bottom: calc(100% + 14px); left: 50%; translate: -50% 0; padding: 2px 7px; border-radius: 6px; background: var(--ink); color: var(--paper); font: normal 500 11.5px var(--font-body); white-space: nowrap; opacity: 0; transition: opacity .12s; pointer-events: none; }
#t13C .fc-o.hot em { opacity: 1; } #t13C .fc-o.hot { color: var(--ink); }
#t13C .fc-o:focus { outline: none; }`,
      js: `var b = $('[data-b]', box), fan = $('[data-fan]', box), os = $$('[data-o]', fan), live = $('[data-live]', box), ic = $('[data-i]', box), lb = $('[data-l]', box), open = false, mine = null, hot = -1, timer = 0, dragging = false, fromHold = false, wasOpen = false, base = 11;
var cnt = TLroll($('[data-n]', box), { value: base, live: false, dur: 480 });
function mag(i) { hot = i; os.forEach(function (o, j) { var d = i < 0 ? 9 : Math.abs(j - i); o.style.setProperty('--s', d === 0 ? 1.45 : d === 1 ? 1.12 : 1); o.classList.toggle('hot', d === 0); }); }
function show(v, keys) { open = v; fan.classList.toggle('on', v); b.setAttribute('aria-expanded', String(v)); os.forEach(function (o) { o.tabIndex = -1; }); if (v) { var s = Math.max(0, mine ? os.findIndex(function (o) { return o.getAttribute('data-o') === mine; }) : 0); mag(keys ? s : -1); if (keys) { os[s].tabIndex = 0; os[s].focus({ preventScroll: true }); } } else mag(-1); }
function pick(k) { show(false); if (mine === k) { mine = null; ic.innerHTML = TL4b.RX.agree[1]; lb.textContent = 'React'; b.removeAttribute('aria-pressed'); cnt.set(base, { dir: 'down' }); TL4b.say(live, 'Reaction removed.'); }
  else { var was = mine; mine = k; ic.innerHTML = TL4b.RX[k][1]; lb.textContent = TL4b.RX[k][0]; b.setAttribute('aria-pressed', 'true'); if (!was) cnt.set(base + 1, { dir: 'up' }); TL4b.say(live, 'You reacted ' + TL4b.RX[k][0] + '.');
    if (moving()) ic.animate([{ transform: 'scale(.5)' }, { transform: 'scale(1.25)', offset: .55 }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' }); }
  b.focus({ preventScroll: true }); }
function under(e) { for (var j = 0; j < os.length; j++) { var r = os[j].getBoundingClientRect(); if (e.clientX >= r.left - 1 && e.clientX <= r.right + 1 && e.clientY > r.top - 30 && e.clientY < r.bottom + 30) return j; } return -1; }
b.addEventListener('pointerdown', function (e) { if (e.button) return; e.preventDefault(); b.focus({ preventScroll: true }); dragging = true; fromHold = false; try { b.setPointerCapture(e.pointerId); } catch (er) {} if (!open) timer = setTimeout(function () { timer = 0; fromHold = true; show(true); }, 260); else wasOpen = true; });
b.addEventListener('pointermove', function (e) { if (dragging && fromHold) mag(under(e)); });
b.addEventListener('pointerup', function (e) { var t = timer; clearTimeout(timer); timer = 0; dragging = false;
  if (fromHold) { var j = under(e); if (j >= 0) pick(os[j].getAttribute('data-o')); else mag(-1); }
  else if (t) show(true); else if (wasOpen) show(false); wasOpen = false; fromHold = false; });
b.addEventListener('pointercancel', function () { clearTimeout(timer); timer = 0; dragging = false; });
b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
b.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp') && !open) { e.preventDefault(); show(true, true); } });
os.forEach(function (o, i) { o.addEventListener('click', function () { pick(o.getAttribute('data-o')); }); o.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && !dragging) mag(i); }); o.addEventListener('focus', function () { mag(i); }); });
fan.addEventListener('pointerleave', function () { if (!dragging) mag(-1); });
fan.addEventListener('keydown', function (e) { var i = os.indexOf(document.activeElement), n = os.length, j = -1;
  if (e.key === 'ArrowRight') j = (i + 1) % n; else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = n - 1;
  else if (e.key === 'Escape') { e.stopPropagation(); show(false); b.focus({ preventScroll: true }); return; } else if (e.key === 'Tab') { show(false); return; }
  if (j >= 0) { e.preventDefault(); os[i].tabIndex = -1; os[j].tabIndex = 0; os[j].focus({ preventScroll: true }); } });
document.addEventListener('pointerdown', function (e) { if (open && !fan.contains(e.target) && !b.contains(e.target)) show(false); });`,
    },
    {
      k: 'D', name: 'Chips that add up and change places', line: 'Your n46 chips, pushed. The biggest reaction always comes first. When your tap, or a teammate\'s, makes one pass its neighbour, the two swap places on a spring, and the total at the end rolls.',
      kind: 'Reference, pushed', from: [house('n46'), arc('reactions')], tryit: 'Tap Thanks so it passes Agree, then press "A teammate reacts" a few times.',
      needs: 'Script, a spring and the number roll.', keys: 'Tab to each chip, then Enter or Space.', off: 'Counts and places change at once.', law: 'Proximity: the most common answer sits first.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'new:twist', 'look:ember'], h: 300,
      html: `<div class="rx"><div class="rx-card">${rxNote('Achieng Odhiambo', 'AO', 'Mon', 'From Friday, Duka Fresh opens at 7 am, not 8.')}<div class="rx-bar" role="group" aria-label="Reactions" data-bar></div>
<p class="rx-tot"><span data-tot></span> reactions from the team</p></div><button class="l-btn sm" type="button" data-sim>A teammate reacts</button><p class="sr" role="status" data-live></p></div>`,
      css: `#t13D .rx-tot { margin: 0; font-size: 12.5px; color: var(--muted); } #t13D .rx-tot span { font-family: var(--font-num); font-size: 14px; color: var(--ink-soft); }
#t13D .rx > .l-btn { justify-self: start; }`,
      js: `var r = TL4b.rx(box, { list: [['gotit', 5, false], ['agree', 4, false], ['thanks', 4, false], ['nice', 1, false]], sort: true, total: true }), live = $('[data-live]', box), K = ['gotit', 'agree', 'thanks', 'nice'], W = ['Brian', 'Wanjiku', 'Otieno', 'Amina', 'Kevin'];
$('[data-sim]', box).addEventListener('click', function () { var k = K[Math.floor(Math.random() * K.length)]; r.bump(k, 1); TL4b.say(live, W[Math.floor(Math.random() * W.length)] + ' reacted ' + TL4b.RX[k][0] + '.'); });`,
    },
  ],
};

/* ---------------- 14 Theme switch ---------------- */
const TSNAME = { system: 'System', light: 'Light', dark: 'Night' };
const tsState = `<span class="ts-st" aria-live="polite"><b data-now>Light</b><small data-why>Following your device</small></span>`;
const TSJS = String.raw`
/* a label line that says what the page shows and why */
TL4b.tsSay = function (box) { var now = $('[data-now]', box), why = $('[data-why]', box);
  TL4b.theme.on(function (ch, t) { now.textContent = t === 'dark' ? 'Night' : 'Light'; why.textContent = ch === 'system' ? 'Following your device' : 'Picked by you'; }); };
/* turn on the icon's transitions only after the first frames, so a page that loads at night never spins its switch */
TL4b.settle = function (el) { requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('settled'); }); }); };`;
const theme = {
  id: 'theme', n: '14', name: 'Theme switch', h: 250,
  claim: 'Changing the theme should <em>move like a page turning,</em> not blink.',
  lead: 'These switches really change this whole page. Arc\'s switch turns the sun into the moon on a spring, and the new theme is drawn over the old one, here from the left. Each keeps System, Light and Night, and is saved like the top bar\'s. With motion off, or in a browser that cannot do it, the theme just changes.',
  ref: { ids: 'Top bar', text: 'Our switch today: in the top bar, the sun slides up and away and the moon rises in on our one curve, while the page colours fade over 0.4 s. The showcase adds System, Light and Night, saved as ember-theme-v1.' },
  noteHint: 'B with the Eclipse move', moreHint: 'the switch inside a user menu',
  css: `#theme .ts { width: min(100%, 320px); display: grid; gap: 14px; justify-items: start; text-align: left; }
#theme .ts-row { display: flex; align-items: center; gap: 12px; }
#theme .ts-st { display: grid; } #theme .ts-st b { font-size: 14.5px; color: var(--ink); } #theme .ts-st small { font-size: 12.5px; color: var(--muted); }
#theme .ts-seg { position: relative; display: inline-flex; padding: 3px; gap: 2px; border-radius: 10px; background: rgb(var(--ink-rgb) / .06); border: 1px solid var(--line); flex-wrap: wrap; }
#theme .ts-seg button { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 7px; font-size: 13px; font-weight: 500; color: var(--muted); transition: color .15s, background-color .15s; }
#theme .ts-seg button svg { width: 15px; height: 15px; }
#theme .ts-seg button:hover { color: var(--ink); }
#theme .ts-seg button[aria-pressed="true"], #theme .ts-seg button[aria-checked="true"] { background: var(--paper-raised); color: var(--ink); box-shadow: 0 1px 2px rgb(0 0 0 / .1), 0 0 0 1px var(--line); }
#theme .ts-cap { margin: 0 0 -8px; font: 500 10.5px/1.4 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
#theme .ts-ib { position: relative; width: 40px; height: 40px; flex: none; display: grid; place-items: center; border-radius: 10px; border: 1px solid var(--line-hi); background: var(--paper-raised); color: var(--ink); box-shadow: var(--shadow-sm); transition: border-color .15s, transform .15s var(--ease-out); }
#theme .ts-ib:hover { border-color: rgb(var(--ink-rgb) / .42); } #theme .ts-ib:active { transform: scale(.94); }`,
  js: TSJS,
  opts: [
    {
      k: 'B', name: 'Arc\'s switch, with its four page moves', line: 'Copied from Arc. Both icons turn the same way, so the sun leaving and the moon arriving read as one turn, with a little blur and a spring. Then the new theme is drawn over the old one. Pick how it arrives: from the left (Arc\'s default), from the middle, from a thin seam, or from the bottom.',
      from: [arc('theme-switch'), arc('theme-switch-eclipse', 'Arc eclipse'), arc('theme-switch-split', 'Arc split'), arc('theme-switch-rise', 'Arc rise')], tryit: 'Press the sun. Then pick Eclipse and press it again. Press Follow my device to hand it back.',
      needs: 'Script, a spring and the browser\'s view transitions.', keys: 'Tab to the switch, then Enter or Space. The four moves are buttons too.', off: 'The icon and the page change at once.', law: 'Jakob: a sun and a moon, where people look for them.',
      tags: ['motion:springy', 'speed:mid', 'feedback:loud', 'new:twist', 'look:ember'], h: 290,
      html: `<div class="ts"><div class="ts-row"><button class="ts-ib tsB t4b-b t4b-keep" type="button" aria-pressed="false" data-tog><span class="tsB-w"><span class="tsB-i" data-k="light">${I.sun}</span><span class="tsB-i" data-k="dark">${I.moon}</span></span></button>${tsState}</div>
<p class="ts-cap">How the page changes</p><div class="ts-seg" role="group" aria-label="How the page changes">${[['wipe', 'Wipe'], ['eclipse', 'Eclipse'], ['split', 'Split'], ['rise', 'Rise']].map(([k, l], i) => `<button type="button" data-how="${k}" aria-pressed="${i ? 'false' : 'true'}">${l}</button>`).join('')}</div>
<button class="l-btn sm" type="button" data-sys aria-pressed="false">${I.monitor}Follow my device</button></div>`,
      css: `#t14B .tsB-w { display: grid; width: 20px; height: 20px; place-items: center; }
#t14B .tsB-i { grid-area: 1 / 1; display: grid; }
#t14B .tsB-i svg { width: 18px; height: 18px; }
#t14B .tsB-i:not(.on) { opacity: 0; filter: blur(2px); }
#t14B .tsB-i[data-k="light"]:not(.on) { transform: rotate(30deg) scale(.7); }
#t14B .tsB-i[data-k="dark"]:not(.on) { transform: rotate(-30deg) scale(.7); }
#t14B .settled .tsB-i { transition: transform .16s var(--ease-out), opacity .16s var(--ease-out), filter .16s var(--ease-out); }
#t14B .settled .tsB-i.on { transition: transform var(--sp-snappy-d) var(--sp-snappy), opacity .16s var(--ease-out), filter .16s var(--ease-out); }
#t14B .settled .tsB-w { transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#t14B .tsB[data-t="dark"][data-how="wipe"] .tsB-w { transform: scale(1.08); }
#t14B .tsB[data-t="dark"][data-how="eclipse"] .tsB-w { transform: translateX(-2px); }
#t14B .tsB[data-t="dark"][data-how="split"] .tsB-w { transform: translateX(1px); }
#t14B .tsB[data-t="dark"][data-how="rise"] .tsB-w { transform: translateY(-2px); }
#t14B [data-sys][aria-pressed="true"] { border-color: var(--accent); color: var(--accent-text); }
#t14B .ts-seg { flex-wrap: nowrap; }
@media (max-width: 400px) { #t14B .ts-seg button { padding: 6px 8px; font-size: 12.5px; } }`,
      js: `var tog = $('[data-tog]', box), sys = $('[data-sys]', box), how = 'wipe', I2 = $$('.tsB-i', box); tog.setAttribute('data-how', how);
TL4b.tsSay(box);
TL4b.theme.on(function (ch, t) { tog.setAttribute('data-t', t); I2.forEach(function (i) { i.classList.toggle('on', i.getAttribute('data-k') === t); }); tog.setAttribute('aria-pressed', String(t === 'dark')); tog.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to night theme'); sys.setAttribute('aria-pressed', String(ch === 'system')); });
TL4b.settle(tog);
tog.addEventListener('click', function () { TL4b.theme.set(TL4b.theme.cur() === 'dark' ? 'light' : 'dark', how, tog); });
sys.addEventListener('click', function () { TL4b.theme.set('system', how, tog); });
$$('[data-how]', box).forEach(function (b) { b.addEventListener('click', function () { how = b.getAttribute('data-how'); tog.setAttribute('data-how', how); $$('[data-how]', box).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); }); });`,
    },
    {
      k: 'A', name: 'Plain: System, Light, Night, with a soft fade', line: 'Three buttons in a row, the usual way. The page fades from one theme to the other in under a third of a second.',
      from: [sh('toggle-group', 'shadcn/ui toggle group'), arc('theme-switch')], tryit: 'Press Night, then Light, then System.',
      needs: 'A few lines of script and the browser\'s view transitions.', keys: 'Tab to the row; left and right move; Enter or Space picks.', off: 'The page changes at once.', law: 'Hick: three plain choices, all in sight.',
      tags: ['motion:some', 'speed:quick', 'feedback:clear', 'new:familiar', 'look:ember'],
      html: `<div class="ts"><div class="ts-seg" role="radiogroup" aria-label="Theme">${[['system', 'monitor'], ['light', 'sun'], ['dark', 'moon']].map(([k, ic]) => `<button type="button" role="radio" data-c="${k}" aria-checked="false">${I[ic]}${TSNAME[k]}</button>`).join('')}</div>${tsState}</div>`,
      js: `var bs = $$('[data-c]', box), rv = TL4b.rove(bs, { single: true });
TL4b.tsSay(box);
TL4b.theme.on(function (ch) { bs.forEach(function (b, i) { var on = b.getAttribute('data-c') === ch; b.setAttribute('aria-checked', String(on)); if (on) rv.mark(i); }); });
bs.forEach(function (b) { b.addEventListener('click', function () { TL4b.theme.set(b.getAttribute('data-c'), 'fade', b); }); });`,
    },
    {
      k: 'C', name: 'A circle that grows from the button', line: 'The icon carves itself: the sun grows into a disc while a shadow slides across to cut the moon, and its rays fold in. Pick from the small menu and the new theme grows out of the button in a circle until it fills the page.',
      kind: 'Mix', from: [arc('theme-switch'), arc('icon-morph'), house('n32')], tryit: 'Open the switch and pick Night, then pick Light.',
      needs: 'Script, springs and the browser\'s view transitions.', keys: 'Enter or Down opens the menu. Up and down move, Enter picks, Escape closes and puts focus back.', off: 'The icon and the page change at once.', law: 'Fitts: the change starts where you pressed.',
      tags: ['motion:springy', 'speed:mid', 'feedback:loud', 'open:trigger', 'new:novel', 'look:ember'], h: 290, top: true,
      html: `<div class="ts"><div class="ts-row"><div class="tsC-w"><button class="ts-ib t4b-b t4b-keep" type="button" aria-haspopup="menu" aria-label="Theme" data-tog>${MI.theme()}</button>
<div class="l-panel l-pop tsC-m" role="menu" aria-label="Theme" data-m><span class="t4b-hl" data-hl></span>${[['system', 'monitor'], ['light', 'sun'], ['dark', 'moon']].map(([k, ic]) => `<button class="l-item" type="button" role="menuitemradio" aria-checked="false" tabindex="-1" data-c="${k}">${I[ic]}${TSNAME[k]}<span class="tsC-now">Now</span></button>`).join('')}</div></div>${tsState}</div></div>`,
      css: `#t14C .tsC-w { position: relative; }
#t14C .ts-ib .t4b-mi { width: 22px; height: 22px; }
#t14C .ts-ib [data-p="d"], #t14C .ts-ib [data-p="s"] { fill: none; }
#t14C .tsC-m { position: absolute; z-index: 5; top: calc(100% + 6px); left: 0; width: 180px; transform-origin: top left; --from: translateY(-6px) scale(.96); --in: var(--sp-snappy-d); --ease: var(--sp-snappy); }
#t14C .tsC-m .l-item[data-on], #t14C .tsC-m .l-item:hover { background: none; }
#t14C .tsC-m .l-item:focus-visible { outline: none; }
#t14C .tsC-now { margin-left: auto; font: 500 10.5px var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--muted); opacity: 0; }
#t14C .l-item[aria-checked="true"] .tsC-now { opacity: 1; }
#t14C .l-item[aria-checked="true"] { font-weight: 600; }`,
      js: `var TSNAME = ${JSON.stringify(TSNAME)};
var tog = $('[data-tog]', box), m = $('[data-m]', box), its = $$('[data-c]', m), mo = TL4b.morph($('svg', tog), 'theme', { on: TL4b.theme.cur() === 'dark' }), hl = TL4b.hl(m, $('[data-hl]', m), { r: 8 });
TL4b.tsSay(box);
TL4b.theme.on(function (ch, t) { mo.set(t === 'dark'); its.forEach(function (i) { i.setAttribute('aria-checked', String(i.getAttribute('data-c') === ch)); }); tog.setAttribute('aria-label', 'Theme: ' + TSNAME[ch] + (ch === 'system' ? ', now ' + (t === 'dark' ? 'night' : 'light') : '')); });
var p = pop(tog, m, { focus: '[aria-checked="true"]', arrowOpen: true, onClose: function () { hl.hide(); } });
TL4b.rove(its, { vertical: true });
its.forEach(function (it) { it.addEventListener('focus', function () { hl.to(it); }); it.addEventListener('pointermove', function () { if (document.activeElement !== it) it.focus({ preventScroll: true }); });
  it.addEventListener('pointerdown', function () { hl.press(true); }); it.addEventListener('pointerup', function () { hl.press(false); });
  it.addEventListener('click', function () { p.set(false); TL4b.theme.set(it.getAttribute('data-c'), 'circle', tog); }); });
m.addEventListener('keydown', function (e) { if (e.key === 'Tab') p.set(false, false); });`,
    },
    {
      k: 'D', name: 'Our top bar switch, pushed', line: 'Our switch as it is, made livelier: the sun still slides up and the moon rises in, now on a spring with a soft blur. The new theme comes down from the top bar like a blind. A small System button sits beside it.',
      kind: 'Reference, pushed', from: [['Our top bar switch', null], arc('theme-switch-rise')], tryit: 'Press the switch twice, then press System.',
      needs: 'Script, a spring and the browser\'s view transitions.', keys: 'Tab to each button, then Enter or Space.', off: 'The icon and the page change at once.', law: 'Jakob: the switch stays where our pages always put it.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:familiar', 'look:ember'],
      html: `<div class="ts"><div class="ts-row"><button class="ts-ib tsD t4b-b t4b-keep" type="button" data-tog><svg class="sun" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="3.4" stroke="currentColor" stroke-width="1.5"/><path d="M9 1.8v1.6M9 14.6v1.6M1.8 9h1.6M14.6 9h1.6M3.9 3.9l1.1 1.1M13 13l1.1 1.1M3.9 14.1 5 13M13 5l1.1-1.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><svg class="moon" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M14.8 11.2A6.3 6.3 0 0 1 6.8 3.2a6.3 6.3 0 1 0 8 8z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></button>
<button class="ts-ib tsD-s t4b-b" type="button" aria-pressed="false" aria-label="Follow my device" data-sys>${I.monitor}</button>${tsState}</div></div>`,
      css: `#t14D .tsD { overflow: hidden; }
#t14D .tsD svg { position: absolute; width: 17px; height: 17px; }
#t14D .tsD .moon { transform: translateY(26px) rotate(-60deg); opacity: 0; filter: blur(2px); }
#t14D .tsD[data-t="dark"] .sun { transform: translateY(-26px) rotate(60deg); opacity: 0; filter: blur(2px); }
#t14D .tsD[data-t="dark"] .moon { transform: none; opacity: 1; filter: none; }
#t14D .tsD.settled svg { transition: transform var(--sp-bouncy-d) var(--sp-bouncy), opacity .2s var(--ease-out), filter .2s var(--ease-out); }
#t14D .tsD-s svg { width: 17px; height: 17px; color: var(--muted); }
#t14D .tsD-s[aria-pressed="true"] { border-color: var(--accent); } #t14D .tsD-s[aria-pressed="true"] svg { color: var(--accent-text); }`,
      js: `var tog = $('[data-tog]', box), sys = $('[data-sys]', box);
TL4b.tsSay(box);
TL4b.theme.on(function (ch, t) { tog.setAttribute('data-t', t); tog.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to night theme'); sys.setAttribute('aria-pressed', String(ch === 'system')); });
TL4b.settle(tog);
tog.addEventListener('click', function () { TL4b.theme.set(TL4b.theme.cur() === 'dark' ? 'light' : 'dark', 'drop', tog); });
sys.addEventListener('click', function () { TL4b.theme.set('system', 'drop', tog); });`,
    },
  ],
};

export default [btngroup, floatgroup, expandgroup, copybtn, iconmorph, confirm, hold, reactions, theme];
