// Round 3, batch B: countdown, number and money field, fluid sliders, morph select, morphing buttons.
// Ideas from Arc's free parts (uiarc.dev), rebuilt in plain script and the ember look.
// The digit rolls use window.TLroll from batch A (a.mjs loads first).
import { sh, arc, house } from '../src-links.mjs';

const sv = (d, w = 1.6) => `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const I = {
  minus: sv('M3.5 8h9', 1.8), plus: sv('M8 3.5v9M3.5 8h9', 1.8), chev: sv('m4.5 6.5 3.5 3.5 3.5-3.5'), up: sv('m4.5 9.5 3.5-3.5 3.5 3.5'),
  check: sv('M3.5 8.4 6.6 11.3 12.5 4.8', 1.8),
  phone: sv('M5.2 2.5h-1.4a1.3 1.3 0 0 0-1.3 1.4c.4 5 4.6 9.2 9.6 9.6a1.3 1.3 0 0 0 1.4-1.3v-1.4l-2.6-1.1-1.3 1.3a7 7 0 0 1-3.4-3.4l1.3-1.3z', 1.4),
  chat: sv('M2.8 3.5h10.4v7H7.5L4.5 13v-2.5H2.8z', 1.4), link: sv('M6.8 9.2 9.2 6.8M7.3 4.6l1-1a2.6 2.6 0 0 1 3.7 3.7l-1 1M8.7 11.4l-1 1a2.6 2.6 0 0 1-3.7-3.7l1-1', 1.4),
  pin: sv('M8 14s4.5-4 4.5-7.6a4.5 4.5 0 0 0-9 0C3.5 10 8 14 8 14zM8 8.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4z', 1.4),
  trash: sv('M2.8 4.3h10.4M6.3 4.3V3h3.4v1.3M4.2 4.3l.6 8.7h6.4l.6-8.7', 1.4), copy: sv('M5.5 5.5h7v7h-7zM3.5 10.5v-7h7', 1.4),
  card: sv('M2 4h12v8H2zM2 6.6h12M4.5 10h2.5', 1.3),
};
// the orange done tick, drawn in place when it is added (lib's TICK); TK0 is the same tick already drawn
const TK0 = '<svg class="l-tick" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="11"/><path d="M6.6 11.4 9.6 14.3l5.8-6.4"/></svg>';

/* ---------------- 06 Countdown ---------------- */
const unitB = (k, label, last) => `<span class="cd-u" data-u="${k}"><span class="cd-uc"><span class="cd-w" data-w></span><small>${label}</small></span>${last ? '' : '<span class="cd-sep" aria-hidden="true">:</span>'}</span>`;
const cdActs = (again = true) => `<div class="cd-act"><button class="l-btn sm" type="button" data-skip>Skip to the last 10 s</button>${again ? '<button class="l-btn sm" type="button" data-again>Start again</button>' : ''}</div>`;
const countdown = {
  id: 'countdown', n: '06', name: 'Countdown', h: 300,
  claim: 'A countdown should <em>turn like a wheel,</em> not flicker.',
  lead: 'Each card counts down for real. Watch a minute go by: 00 turns one step down to 59. When a unit runs out, the box shrinks to fit. Use Skip to see the end. The clocks pause while they are off screen.',
  ref: { ids: 'n07', text: 'The number roll: each digit rolls on its own in 0.5 s, and pauses off screen.' },
  noteHint: 'B, but with the pill size of C', moreHint: 'a countdown to a date, with days',
  css: `#countdown .cd { display: grid; justify-items: center; gap: 14px; text-align: center; width: 100%; }
#countdown .cd-k { margin: 0; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: var(--ink-soft); }
#countdown .cd-dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); position: relative; transition: background-color .3s, opacity .25s; }
#countdown .cd-dot::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: var(--accent); animation: cdPing 1.6s var(--ease-out) infinite; }
#countdown .is-over .cd-dot { background: var(--dim); }
#countdown .is-over .cd-dot::after { animation: none; opacity: 0; }
@keyframes cdPing { from { transform: scale(1); opacity: .5; } to { transform: scale(2.6); opacity: 0; } }
#countdown .cd-shell { position: relative; display: grid; place-items: center; }
#countdown .cd-shell > * { grid-area: 1 / 1; }
#countdown .cd-bgw { position: absolute; top: 0; bottom: 0; left: 50%; filter: drop-shadow(0 0 .6px var(--line-hi)) drop-shadow(0 1px 2px rgb(var(--ink-rgb) / .08)); pointer-events: none; }
#countdown .cd-bg { display: block; height: 100%; background: var(--paper-raised); }
#countdown .cd-row { position: relative; display: flex; align-items: flex-start; justify-content: center; }
#countdown .cd-u { display: flex; align-items: flex-start; }
#countdown .cd-u > * { transition: opacity .28s var(--ease-out), transform .36s var(--ease-out), filter .28s var(--ease-out); }
#countdown .cd-u.gone { position: absolute; top: 0; }
#countdown .cd-u.gone > * { opacity: 0; transform: scale(.7); filter: blur(4px); }
#countdown .cd-uc { display: grid; justify-items: center; }
#countdown .cd-w { font-family: var(--font-num); font-variant-numeric: tabular-nums; color: var(--ink); line-height: 1.1; }
#countdown .cd-uc small { font-family: var(--font-mono); font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
#countdown .cd-sep { font-family: var(--font-num); color: var(--dim); line-height: 1.1; }
#countdown .cd-row.out { pointer-events: none; }
#countdown .cd-row.out .cd-u > * { opacity: 0; transform: scale(.72); filter: blur(6px); }
#countdown .cd-done { margin: 0; opacity: 0; transform: scale(.9); filter: blur(4px); pointer-events: none; transition: opacity .3s var(--ease-out), transform .45s var(--ease-out), filter .3s var(--ease-out); white-space: nowrap; }
#countdown .cd-done.on { z-index: 1; opacity: 1; transform: none; filter: none; pointer-events: auto; transition-delay: .14s; }
#countdown .cd-act { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
#countdown .cd-line { width: min(100%, 220px); height: 3px; border-radius: 3px; background: rgb(var(--ink-rgb) / .08); overflow: hidden; }
#countdown .cd-line i { display: block; height: 100%; background: var(--accent); transform-origin: left; transition: transform 1s linear; }`,
  js: `/* ---- round 3 batch B shared helpers ---- */
window.TLb = window.TLb || {};
/* digit roll from batch A; if it is missing, numbers still change */
TLb.roll = function (el, o) {
  if (window.TLroll) { if (o.live == null) o.live = false; return TLroll(el, o); }
  var s = { value: o.value, set: function (n) { s.value = n; el.textContent = o.fmt ? o.fmt(n) : String(n); } }; s.set(o.value); return s;
};
TLb.pad = function (n) { return (n < 10 ? '0' : '') + n; };
TLb.money = function (n) { return n.toLocaleString('en-KE'); };
TLb.fonts = function (fn) { if (document.fonts && document.fonts.ready) document.fonts.ready.then(fn); };
/* a real spring that keeps its speed when you give it a new target */
TLb.sp = function (on, o) {
  o = o || {}; var s = { x: o.x || 0, v: 0, t: o.x || 0 }, raf = 0, last = 0, K = o.k || 320, C = o.c || 24, eps = o.eps || .05, k = K, c = C;
  function f(now) {
    var dt = Math.min(.034, (now - last) / 1000); last = now;
    var cc = lvl() === 'calm' ? Math.max(c, 2 * Math.sqrt(k)) : c;
    for (var i = 0; i < 4; i++) { var a = -k * (s.x - s.t) - cc * s.v; s.v += a * dt / 4; s.x += s.v * dt / 4; }
    if (Math.abs(s.x - s.t) < eps && Math.abs(s.v) < eps * 8) { s.x = s.t; s.v = 0; raf = 0; on(s.x, s); return; }
    on(s.x, s); raf = requestAnimationFrame(f);
  }
  s.to = function (t, p) { p = p || {}; s.t = t; k = p.k || K; c = p.c || C; if (p.v != null) s.v = p.v; if (!moving()) return s.jump(t); if (!raf) { last = performance.now(); raf = requestAnimationFrame(f); } };
  s.jump = function (t) { cancelAnimationFrame(raf); raf = 0; s.x = s.t = t; s.v = 0; on(t, s); };
  return s;
};
/* move siblings to their new places on a spring after a layout change */
TLb.flip = function (els, change) {
  var a = els.map(function (e) { return e.getBoundingClientRect().left; }); change();
  if (!moving()) return;
  els.forEach(function (e, i) { var d = a[i] - e.getBoundingClientRect().left; if (Math.abs(d) < .5) return; e.style.transition = 'none'; e.style.transform = 'translateX(' + d + 'px)'; e.offsetWidth; e.style.transition = 'transform var(--sp-bouncy-d) var(--sp-bouncy)'; e.style.transform = ''; });
};
TLb.spring = function (n) { var cs = getComputedStyle(root); return { e: cs.getPropertyValue('--sp-' + n).trim() || 'cubic-bezier(.22,1,.36,1)', d: (parseFloat(cs.getPropertyValue('--sp-' + n + '-d')) || .4) * 1000 }; };

/* the countdown engine: units that drop off, a box that springs to fit, an end label */
TLb.cd = function (box, o) {
  var row = $('[data-row]', box), bg = $('[data-bg]', box), done = $('[data-done]', box), st = $('[data-st]', box), live = $('[data-sr]', box), line = $('[data-line] i', box), pad = o.pad || 0, R = o.r || 16;
  var units = $$('[data-u]', box).map(function (u) { var np = u.hasAttribute('data-np'), w = $('[data-w]', u), f = np ? String : TLb.pad;
    return { k: u.getAttribute('data-u'), el: u, on: true, r: o.plain ? { set: function (n) { w.textContent = f(n); } } : TLb.roll(w, { value: 0, fmt: f, dur: 560, stagger: 40 }) }; });
  var hasH = units.some(function (u) { return u.k === 'h'; }), left = o.secs, total = o.secs, seen = false, timer = 0, ended = false, maxW = 0;
  var ws = bg ? TLb.sp(function (w) { var c = Math.max(0, (maxW - w) / 2); bg.style.clipPath = 'inset(0 ' + c.toFixed(2) + 'px round ' + R + 'px)'; }, { k: 360, c: 22, eps: .2 }) : null;
  function split(t) { return { h: Math.floor(t / 3600), m: hasH ? Math.floor(t / 60) % 60 : Math.floor(t / 60), s: t % 60 }; }
  function want(u, v) { return u.k === 's' || (u.k === 'm' && (!o.dropM || v.h > 0 || v.m > 0)) || (u.k === 'h' && v.h > 0); }
  function width() { return (ended ? done.offsetWidth : row.offsetWidth) + pad * 2; }
  function measure() { var g = bg.parentNode, hid = units.filter(function (u) { return u.el.hidden; }); hid.forEach(function (u) { u.el.hidden = false; u.el.classList.remove('gone'); });
    maxW = Math.max(row.offsetWidth, done.offsetWidth) + pad * 2 + 4; hid.forEach(function (u) { u.el.classList.add('gone'); u.el.hidden = true; }); g.style.width = maxW + 'px'; g.style.marginLeft = (-maxW / 2) + 'px'; bg.style.width = maxW + 'px'; }
  function vis(u, on) {
    u.on = on;
    if (!on) { u.el.style.left = u.el.offsetLeft + 'px'; u.el.classList.add('gone'); clearTimeout(u.t); u.t = setTimeout(function () { if (!u.on) u.el.hidden = true; }, moving() ? 420 : 0); }
    else { clearTimeout(u.t); u.el.hidden = false; u.el.style.left = ''; u.el.classList.add('gone'); u.el.offsetWidth; u.el.classList.remove('gone'); }
  }
  function words(v) { var p = []; if (v.h) p.push(v.h + (v.h === 1 ? ' hour' : ' hours')); if (v.h || v.m) p.push(v.m + (v.m === 1 ? ' minute' : ' minutes')); p.push(v.s + (v.s === 1 ? ' second' : ' seconds')); return p.join(' ') + ' left'; }
  function paint(t, first, dir) {
    var v = split(t), ch = units.filter(function (u) { return want(u, v) !== u.on; });
    if (ch.length) { var apply = function () { ch.forEach(function (u) { vis(u, !u.on); }); }; if (first) apply(); else TLb.flip($$(':scope > *', row), apply); }
    units.forEach(function (u) { if (first) u.r.set(v[u.k]); else u.r.set(v[u.k], { dir: dir || 'down' }); });
    if (st) st.textContent = words(v);
    if (line) line.style.transform = 'scaleX(' + (total ? t / total : 0) + ')';
    if (ws) { if (first) ws.jump(width()); else if (ch.length) ws.to(width()); }
  }
  function loop() { clearTimeout(timer); if (!seen || document.hidden || ended) return; timer = setTimeout(function () { left = Math.max(0, left - 1); paint(left); if (left === 0) end(); else loop(); }, 1000); }
  function end() { ended = true; box.classList.add('is-over'); row.classList.add('out'); done.classList.add('on'); if (ws) ws.to(width(), { k: 300, c: 20 }); if (live) live.textContent = o.endSay || done.textContent; if (o.end) o.end(); }
  function restart(secs) { clearTimeout(timer); var was = ended; ended = false; total = left = secs; box.classList.remove('is-over'); row.classList.remove('out'); done.classList.remove('on'); paint(left, false, 'up'); if (was && ws) ws.to(width()); if (live) live.textContent = o.startSay || ''; loop(); }
  if (bg) { measure(); TLb.fonts(function () { measure(); ws.jump(width()); }); }
  paint(left, true);
  new IntersectionObserver(function (es) { seen = es[0].isIntersecting; loop(); }).observe(box);
  document.addEventListener('visibilitychange', loop);
  var sk = $('[data-skip]', box), ag = $('[data-again]', box);
  if (sk) sk.addEventListener('click', function () { if (ended) return; left = Math.min(left, 10); paint(left, false, 'down'); loop(); });
  if (ag) ag.addEventListener('click', function () { restart(o.secs); });
  return { restart: restart, left: function () { return left; } };
};`,
  opts: [
    {
      k: 'B', name: 'Wheels in a box that shrinks to fit', line: 'Big digit wheels in a raised box. When the hour runs out, the hours wheel fades away and the box springs to its new width. At zero the digits blur out and the box turns into the end message.',
      from: [arc('countdown'), house('n07')], tryit: 'Wait five seconds for the hour to drop off. Then press Skip and watch zero.',
      needs: 'Script, the shared digit roll and a spring.', keys: 'Tab to the two buttons.', off: 'Digits change in place, the box jumps to its new size, and the end message shows at once.', law: 'Jakob: it reads like a clock everyone knows.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'], h: 290,
      html: `<div class="cd"><p class="cd-k"><span class="cd-dot" aria-hidden="true"></span>Duka Fresh flash sale ends in</p>
<div class="cd-shell" role="timer" aria-label="Time left in the sale"><span class="cd-bgw"><span class="cd-bg" data-bg></span></span>
<div class="cd-row" data-row aria-hidden="true">${unitB('h', 'hours')}${unitB('m', 'min')}${unitB('s', 'sec', true)}</div>
<p class="cd-done" data-done><b>The sale is over.</b><span>New deals at 8 am.</span></p><span class="sr" data-st></span></div>
${cdActs()}<p class="sr" aria-live="polite" data-sr></p></div>`,
      css: `#t06B .cd-row { padding: 10px 0 8px; gap: 2px; }
#t06B .cd-w { font-size: 50px; min-width: 1.05em; }
#t06B .cd-sep { font-size: 44px; padding: 0 4px; margin-top: 2px; }
#t06B .cd-done { display: grid; gap: 2px; padding: 14px 0; font-size: 18px; }
#t06B .cd-done b { font-weight: 600; color: var(--ink); }
#t06B .cd-done span { font-size: 13.5px; color: var(--muted); }
@media (max-width: 400px) { #t06B .cd-w { font-size: 40px; } #t06B .cd-sep { font-size: 36px; } }`,
      js: `TLb.cd(box, { secs: 3605, pad: 22, r: 18, endSay: 'The sale is over.' });`,
    },
    {
      k: 'A', name: 'Plain words and numbers', line: 'A sentence with the time in it. The numbers change each second with no motion. At zero the sentence changes.',
      from: [sh('badge', 'shadcn/ui text and badge')], tryit: 'Press Skip and wait for zero.',
      needs: 'A few lines of script.', keys: 'Tab to the buttons.', off: 'Same.', law: 'Hick: one sentence, one number.',
      tags: ['motion:still', 'speed:quick', 'feedback:quiet', 'new:familiar', 'look:ember'], h: 220,
      html: `<div class="cd"><div class="cd-shell" role="timer" aria-label="Time left to order"><p class="cd-row" data-row>Order in the next <b class="l-num"><span class="cd-u" data-u="m" data-np><span data-w></span></span>:<span class="cd-u" data-u="s"><span data-w></span></span></b> for delivery today.</p>
<p class="cd-done" data-done>Too late for today. We deliver tomorrow from 9 am.</p><span class="sr" data-st></span></div>${cdActs()}<p class="sr" aria-live="polite" data-sr></p></div>`,
      css: `#t06A .cd-row { display: block; margin: 0; font-size: 15px; color: var(--ink-soft); }
#t06A .cd-row b { color: var(--ink); font-size: 17px; }
#t06A .cd-row .cd-u { display: inline; }
#t06A .cd-row, #t06A .cd-done, #t06A .cd-row * { transition: none !important; }
#t06A .cd-row.out { visibility: hidden; }
#t06A .cd-row.out .cd-u > * { opacity: 1; transform: none; filter: none; }
#t06A .cd-done { font-size: 15px; color: var(--ink); transform: none; filter: none; white-space: normal; }`,
      js: `TLb.cd(box, { secs: 299, plain: true });`,
    },
    {
      k: 'C', name: 'A small pill with a line that drains', line: 'A compact pill with a live dot and a short orange line under it that drains each second. When the minutes run out, the pill gets shorter. At zero it turns into "Deal ended".',
      kind: 'Mix', from: [arc('countdown'), house('n47')], tryit: 'Wait for the minute to run out. Then press Skip, and Start again to see the digits roll back up.',
      needs: 'Script, the shared digit roll and a spring.', keys: 'Tab to the buttons.', off: 'The line and digits jump; the pill jumps to size.', law: 'Fitts: small enough to sit beside a price.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:quiet', 'new:twist', 'look:ember'], h: 240,
      html: `<div class="cd"><p class="cd-k">Mawimbi Mobile: 10 GB for KES 499</p>
<div class="cd-shell" role="timer" aria-label="Time left on the deal"><span class="cd-bgw"><span class="cd-bg" data-bg></span></span>
<div class="cd-row" data-row aria-hidden="true"><span class="cd-dot"></span><span class="cd-t">Ends in</span><span class="cd-u" data-u="m" data-np><span class="cd-uc"><span class="cd-w" data-w></span><small>m</small></span></span><span class="cd-u" data-u="s"><span class="cd-uc"><span class="cd-w" data-w></span><small>s</small></span></span></div>
<p class="cd-done" data-done>Deal ended</p><span class="sr" data-st></span></div>
<div class="cd-line" data-line aria-hidden="true"><i></i></div>${cdActs()}<p class="sr" aria-live="polite" data-sr></p></div>`,
      css: `#t06C .cd-row { align-items: center; gap: 6px; height: 40px; }
#t06C .cd-row .cd-dot { margin-right: 2px; }
#t06C .cd-t { font-size: 13.5px; color: var(--muted); margin-right: 2px; transition: opacity .25s; }
#t06C .cd-row.out .cd-t, #t06C .cd-row.out > .cd-dot { opacity: 0; }
#t06C .cd-uc { display: flex; align-items: baseline; gap: 1px; }
#t06C .cd-w { font-size: 20px; }
#t06C .cd-uc small { font-size: 11px; letter-spacing: 0; text-transform: none; }
#t06C .cd-done { font-size: 14px; font-weight: 600; color: var(--ink); }`,
      js: `TLb.cd(box, { secs: 64, dropM: true, pad: 16, r: 20, endSay: 'The deal has ended.' });`,
    },
    {
      k: 'D', name: 'A code timer that rolls back up', line: 'Your n07 roll, pushed. The time left on a sign-in code counts down on wheels, with an orange line under it. At zero the digits blur out and a "Send a new code" button grows in their place. Press it and the digits roll back up.',
      kind: 'Reference, pushed', from: [house('n07'), arc('countdown')], tryit: 'Press Skip, wait for zero, then press Send a new code.',
      needs: 'Script and the shared digit roll.', keys: 'Tab to Skip. At zero, focus moves to Send a new code.', off: 'The digits change in place; the button shows at once.', law: 'Fitts: the next step appears where your eyes already are.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'], h: 290,
      html: `<div class="cd"><p class="cd-k">We sent a code to 0712 345 678</p>
<div class="cd-shell" role="timer" aria-label="Time left on the code"><div class="cd-row" data-row aria-hidden="true"><span class="cd-u" data-u="m" data-np><span class="cd-w" data-w></span><span class="cd-sep">:</span></span><span class="cd-u" data-u="s"><span class="cd-w" data-w></span></span></div>
<div class="cd-done" data-done><button class="l-btn pri" type="button" data-new>Send a new code</button></div><span class="sr" data-st></span></div>
<div class="cd-line" data-line aria-hidden="true"><i></i></div><p class="l-muted cd-msg" data-msg>The code works for 30 seconds.</p>${cdActs(false)}<p class="sr" aria-live="polite" data-sr></p></div>`,
      css: `#t06D .cd-w { font-size: 56px; }
#t06D .cd-sep { font-size: 52px; padding: 0 3px; }
#t06D .cd-done { transform: scale(.85); }
#t06D .cd-done.on { transform: none; transition: opacity .25s var(--ease-out) .14s, transform var(--sp-bouncy-d) var(--sp-bouncy) .14s, filter .25s var(--ease-out) .14s; }
#t06D .cd-msg { margin: -4px 0 0; }`,
      js: `var msg = $('[data-msg]', box), nw = $('[data-new]', box);
var cd = TLb.cd(box, { secs: 30, endSay: 'The code has run out. You can send a new one.', end: function () { msg.textContent = 'This code has run out.'; setTimeout(function () { if (box.contains(document.activeElement)) nw.focus({ preventScroll: true }); }, 300); } });
nw.addEventListener('click', function () { msg.textContent = 'New code sent to 0712 345 678.'; cd.restart(30); $('[data-skip]', box).focus({ preventScroll: true }); });`,
    },
  ],
};

/* ---------------- 07 Number and money field ---------------- */
const stepper = (id, label, min, max, val, cls = '') => `<div class="nf-row ${cls}" data-shell><button class="nf-st" type="button" data-dn tabindex="-1" aria-label="One fewer">${I.minus}</button><span class="nf-cell"><input id="${id}" class="nf-in" data-in type="text" inputmode="numeric" autocomplete="off" role="spinbutton" aria-label="${label}" aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${val}"><span class="nf-disp" data-disp aria-hidden="true"></span></span><button class="nf-st" type="button" data-up tabindex="-1" aria-label="One more">${I.plus}</button></div>`;
const numfield = {
  id: 'numfield', n: '07', name: 'Number and money field', h: 280,
  claim: 'A number field should <em>push back at its limits.</em>',
  lead: 'Press and hold a plus button: it starts slow, then speeds up. Each digit rolls the way the number moved. Push past the limit and the number strains, then springs home. Type a number and it appears at once.',
  ref: { ids: 'n30', text: 'The field that shakes when it is wrong and ticks when it is right.' },
  noteHint: 'C\'s chips on B\'s stepper', moreHint: 'a field for a phone number with a country list',
  css: `#numfield .nf { width: min(100%, 320px); display: grid; gap: 10px; text-align: left; }
#numfield .nf .l-lbl { margin: 0; }
#numfield .nf-row { display: flex; align-items: center; gap: 4px; width: max-content; padding: 4px; border-radius: 14px; background: var(--paper-raised); border: 1px solid var(--line-hi); transition: border-color .2s, box-shadow .2s; }
#numfield .nf-row:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgb(var(--accent-rgb) / .16); }
#numfield .nf-row.over { border-color: var(--accent-text); background: color-mix(in srgb, var(--paper-raised) 92%, var(--accent)); }
#numfield .nf-st { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 10px; color: var(--ink-soft); background: rgb(var(--ink-rgb) / .05); touch-action: manipulation; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; transition: transform .12s var(--ease-out), background-color .15s, color .15s; }
#numfield .nf-st svg { width: 16px; height: 16px; }
@media (hover: hover) { #numfield .nf-st:hover { background: rgb(var(--ink-rgb) / .09); color: var(--ink); } }
#numfield .nf-st:active { transform: scale(.92); }
#numfield .nf-st[aria-disabled="true"] { color: var(--dim); }
#numfield .no { animation: nfNo .32s var(--ease-out); }
@keyframes nfNo { 20% { transform: translateX(-3px); } 45% { transform: translateX(3px); } 70% { transform: translateX(-2px); } 100% { transform: none; } }
#numfield .nf-cell { position: relative; display: grid; }
#numfield .nf-in { width: 64px; height: 40px; border: 0; background: transparent; text-align: center; font: 500 22px/1 var(--font-num); font-variant-numeric: tabular-nums; color: transparent; caret-color: var(--accent); padding: 0; }
#numfield .nf-in:focus { outline: none; }
#numfield .nf-disp { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; font: 500 22px/1 var(--font-num); font-variant-numeric: tabular-nums; color: var(--ink); white-space: nowrap; }
#numfield .typing .nf-in { color: var(--ink); }
#numfield .typing .nf-disp { opacity: 0; }
#numfield .nf-note { margin: 0; min-height: 1.45em; font-size: 13px; color: var(--accent-text); opacity: 0; transform: translateY(5px); transition: opacity .2s var(--ease-out), transform .3s var(--ease-out); }
#numfield .nf-note.on { opacity: 1; transform: none; }
#numfield .nf-sum { margin: 0; font-size: 14px; color: var(--ink-soft); }
#numfield .nf-sum b { font-family: var(--font-num); font-weight: 500; font-size: 17px; color: var(--ink); font-variant-numeric: tabular-nums; }
@media (pointer: coarse) { #numfield .nf-st { width: 44px; height: 44px; } }`,
  js: `/* a spinbutton: steppers that speed up when held, a refusal at the limits, typing that cuts straight in */
TLb.nf = function (box, o) {
  var inp = $('[data-in]', box), disp = $('[data-disp]', box), shell = $('[data-shell]', box), note = $('[data-note]', box), dn = $('[data-dn]', box), up = $('[data-up]', box);
  var v = o.value, editing = false, strain = 0, sT = 0, fmt = o.fmt || String;
  var r = disp ? TLb.roll(disp, { value: v, fmt: fmt, dur: 420, stagger: 24 }) : null;
  var kick = disp ? TLb.sp(function (x) { disp.style.transform = Math.abs(x) > .01 ? 'translateX(' + x.toFixed(2) + 'px)' : ''; }, { k: 620, c: 15, eps: .02 }) : null;
  function num(s) { var t = String(s).replace(/[^0-9]/g, ''); return t ? parseInt(t, 10) : null; }
  function sync() { inp.setAttribute('aria-valuenow', v); inp.setAttribute('aria-valuetext', o.text ? o.text(v) : fmt(v)); if (!editing) inp.value = String(v); if (dn) dn.setAttribute('aria-disabled', String(v <= o.min)); if (up) up.setAttribute('aria-disabled', String(v >= o.max)); }
  function say(t) { if (!note) return; note.textContent = t; note.classList.remove('on'); void note.offsetWidth; note.classList.add('on'); clearTimeout(note._t); note._t = setTimeout(function () { note.classList.remove('on'); }, 2400); }
  function refuse(dir, btn) {
    strain = Math.min(strain + 1, 4); clearTimeout(sT); sT = setTimeout(function () { strain = 0; }, 900);
    if (kick && moving()) kick.to(0, { v: dir * (130 + 60 * strain) });
    if (btn && moving()) { btn.classList.remove('no'); void btn.offsetWidth; btn.classList.add('no'); }
    say(dir > 0 ? o.maxMsg : o.minMsg); if (o.refuse) o.refuse(dir);
  }
  function set(n, btn) {
    var c = Math.max(o.min, Math.min(o.max, n));
    if (c === v) { if (c !== n) refuse(n > v ? 1 : -1, btn); return c === n; }
    var was = v; v = c; sync(); if (r) r.set(v); if (o.on) o.on(v, was);
    if (c !== n) refuse(n > c ? 1 : -1, btn);
    return c === n;
  }
  function commit() {
    if (!editing) return; editing = false; shell.classList.remove('typing', 'over');
    var n = num(inp.value); if (n == null) { if (r) r.set(v); sync(); return; }
    var c = Math.max(o.min, Math.min(o.max, n)), was = v; v = c; sync();
    if (c !== n) { if (r && moving()) setTimeout(function () { r.set(c); }, 140); else if (r) r.set(c); refuse(n > c ? 1 : -1); }
    if (o.on && c !== was) o.on(v, was);
  }
  function hold(btn, d) {
    if (!btn) return; var t = 0, n = 0;
    function stop() { clearTimeout(t); t = 0; }
    function step() { n++; if (!set(v + d * o.step, btn)) return stop(); t = setTimeout(step, Math.max(40, 150 - n * 14)); }
    btn.addEventListener('pointerdown', function (e) { if (e.button) return; e.preventDefault(); commit(); n = 0; if (set(v + d * o.step, btn)) t = setTimeout(step, 400); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { btn.addEventListener(ev, stop); });
    btn.addEventListener('click', function (e) { if (e.detail === 0) set(v + d * o.step, btn); });
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  }
  hold(dn, -1); hold(up, 1);
  inp.addEventListener('keydown', function (e) {
    var k = e.key, s = o.step, m = { ArrowUp: s, ArrowDown: -s, PageUp: s * 10, PageDown: -s * 10 };
    if (k in m) { e.preventDefault(); commit(); set(v + m[k] * (e.shiftKey && k.indexOf('Arrow') === 0 ? 10 : 1), m[k] > 0 ? up : dn); }
    else if ((k === 'Home' || k === 'End') && !editing) { e.preventDefault(); set(k === 'Home' ? o.min : o.max); }
    else if (k === 'Enter') { commit(); }
    else if (k === 'Escape' && editing) { e.preventDefault(); e.stopPropagation(); editing = false; shell.classList.remove('typing', 'over'); if (r) r.set(v); sync(); }
  });
  inp.addEventListener('input', function () { editing = true; shell.classList.add('typing'); var n = num(inp.value); shell.classList.toggle('over', n != null && (n > o.max || n < o.min)); if (r && n != null) r.set(n, { instant: true }); });
  inp.addEventListener('blur', commit);
  sync(); if (o.on) o.on(v, v, true);
  return { get: function () { return v; }, set: set };
};`,
  opts: [
    {
      k: 'B', name: 'Digits that roll, a stepper that strains', line: 'Each digit rolls up or down with the change. Hold a button and it speeds up. At 10, the number leans toward your press and springs back, and the button shakes once.',
      from: [arc('number-field'), house('n30')], tryit: 'Hold the plus button until it stops at 10, then keep pressing.',
      needs: 'Script, the shared digit roll and a spring.', keys: 'In the field: arrows add or take 1, Shift adds 10, Home and End jump to the ends. Type a number and press Enter.', off: 'The digits change in place; no lean or shake. The limit note still shows.', law: 'Fitts: big buttons right beside the number.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: `<div class="nf"><span class="l-lbl">Data bundles, 1 GB each</span>${stepper('t07B-in', 'Data bundles', 1, 10, 3)}<p class="nf-sum"><span data-gb>3 GB</span> for <b data-tot></b></p><p class="nf-note" data-note aria-live="polite"></p></div>`,
      js: `var gb = $('[data-gb]', box), tot = TLb.roll($('[data-tot]', box), { value: 297, fmt: function (n) { return 'KES ' + TLb.money(n); }, dur: 500, stagger: 30 });
TLb.nf(box, { value: 3, min: 1, max: 10, step: 1, maxMsg: 'You can buy up to 10 at a time.', minMsg: 'You need at least one bundle.', text: function (n) { return n + ' bundles'; }, on: function (n) { gb.textContent = n + ' GB'; tot.set(n * 99); } });`,
    },
    {
      k: 'A', name: 'A plain number box', line: 'The shadcn way: a number in a box with two small arrows. It changes in place and stops at the limit, with a short note.',
      from: [sh('input'), arc('number-field')], tryit: 'Press the arrows, or type 12 and press Enter.',
      needs: 'A few lines of script.', keys: 'Same as B.', off: 'Same.', law: 'Jakob: the number box every form has.',
      tags: ['motion:still', 'speed:quick', 'feedback:quiet', 'new:familiar', 'look:ember'],
      html: `<div class="nf"><label class="l-lbl" for="t07A-in">Guests for the table</label><div class="pl" data-shell><input id="t07A-in" class="l-in" data-in type="text" inputmode="numeric" autocomplete="off" role="spinbutton" aria-valuemin="1" aria-valuemax="8" aria-valuenow="2"><span class="pl-a"><button type="button" data-up tabindex="-1" aria-label="One more">${I.up}</button><button type="button" data-dn tabindex="-1" aria-label="One fewer">${I.chev}</button></span></div><p class="nf-note" data-note aria-live="polite"></p></div>`,
      css: `#t07A .pl { position: relative; width: 160px; }
#t07A .l-in { padding-right: 34px; font-variant-numeric: tabular-nums; }
#t07A .pl-a { position: absolute; right: 4px; top: 4px; bottom: 4px; display: grid; grid-template-rows: 1fr 1fr; width: 26px; }
#t07A .pl-a button { display: grid; place-items: center; border-radius: 5px; color: var(--muted); }
#t07A .pl-a button:hover { background: rgb(var(--ink-rgb) / .07); color: var(--ink); }
#t07A .pl-a svg { width: 13px; height: 13px; }
#t07A .pl.over .l-in { border-color: var(--accent-text); }
#t07A .nf-note { transition: none; transform: none; }`,
      js: `TLb.nf(box, { value: 2, min: 1, max: 8, step: 1, maxMsg: 'Our tables seat up to 8.', minMsg: 'Book for at least one guest.', text: function (n) { return n + (n === 1 ? ' guest' : ' guests'); } });`,
    },
    {
      k: 'C', name: 'A money field with quick-add chips', line: 'A big KES amount. Chips add 100, 500 or 1,000, and each digit rolls in the direction of the change. Past KES 10,000 the amount kicks sideways and the range line turns orange.',
      kind: 'Mix', from: [arc('money-input'), house('n46')], tryit: 'Press +1,000 until it refuses. Then type 25000 and press Enter.',
      needs: 'Script, the shared digit roll and a spring.', keys: 'Tab into the amount. Arrows add or take 10, Shift adds 100. Tab on to the chips.', off: 'The amount changes in place; no kick. The range line still turns orange.', law: 'Hick: three common amounts, one tap each.',
      tags: ['motion:springy', 'speed:mid', 'feedback:loud', 'new:twist', 'look:ember'], h: 320,
      html: `<div class="nf"><label class="l-lbl" for="t07C-in">Top up PocketPay</label><div class="mo" data-shell><span class="mo-c">KES</span><span class="nf-cell"><input id="t07C-in" class="nf-in" data-in type="text" inputmode="numeric" autocomplete="off" role="spinbutton" aria-valuemin="10" aria-valuemax="10000" aria-valuenow="1500"><span class="nf-disp" data-disp aria-hidden="true"></span></span></div>
<p class="mo-r" data-range>From KES 10 to KES 10,000</p><div class="mo-ch" role="group" aria-label="Quick add"><button class="l-btn sm" type="button" data-add="100">+100</button><button class="l-btn sm" type="button" data-add="500">+500</button><button class="l-btn sm" type="button" data-add="1000">+1,000</button></div>
<div class="mo-go"><button class="l-btn pri" type="button" data-go>Top up</button><span class="l-muted" data-msg aria-live="polite"></span></div><p class="nf-note" data-note aria-live="polite"></p></div>`,
      css: `#t07C .mo { display: flex; align-items: center; gap: 10px; padding: 6px 14px; border-radius: 14px; background: var(--paper-raised); border: 1px solid var(--line-hi); transition: border-color .2s, box-shadow .2s; }
#t07C .mo:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgb(var(--accent-rgb) / .16); }
#t07C .mo.over { border-color: var(--accent-text); }
#t07C .mo-c { font-family: var(--font-mono); font-size: 13px; color: var(--muted); }
#t07C .nf-cell { flex: 1; min-width: 0; }
#t07C .nf-in, #t07C .nf-disp { font-size: 40px; text-align: left; justify-content: flex-start; height: 52px; }
#t07C .nf-in { width: 100%; }
#t07C .mo-r { margin: -4px 0 0; font-size: 12.5px; color: var(--muted); transition: color .2s; }
#t07C .mo-r.flash { color: var(--accent-text); }
#t07C .mo-ch { display: flex; gap: 6px; flex-wrap: wrap; }
#t07C .mo-ch .l-btn { font-family: var(--font-num); font-size: 15px; letter-spacing: .02em; }
#t07C .mo-go { display: flex; align-items: center; gap: 12px; }
#t07C .mo-go .l-muted { display: inline-flex; align-items: center; gap: 6px; }
#t07C .mo-go .l-tick { width: 18px; height: 18px; flex-basis: 18px; }
#t07C .nf-note { margin-top: -6px; }`,
      js: `var rg = $('[data-range]', box), msg = $('[data-msg]', box), rt = 0;
var f = TLb.nf(box, { value: 1500, min: 10, max: 10000, step: 10, fmt: TLb.money, text: function (n) { return 'KES ' + TLb.money(n); }, maxMsg: 'The most you can top up at once is KES 10,000.', minMsg: 'The least you can top up is KES 10.',
  refuse: function () { rg.classList.add('flash'); clearTimeout(rt); rt = setTimeout(function () { rg.classList.remove('flash'); }, 1400); }, on: function () { msg.textContent = ''; } });
$$('[data-add]', box).forEach(function (b) { b.addEventListener('click', function () { f.set(f.get() + +b.getAttribute('data-add'), b); }); });
$('[data-go]', box).addEventListener('click', function () { msg.innerHTML = TICK + 'KES ' + TLb.money(f.get()) + ' added.'; });`,
    },
    {
      k: 'D', name: 'A cart whose total rolls in the pay button', line: 'Your n29 pay button, pushed. Each item has a small stepper. Every change rolls the line price and the total inside the pay button. Pay and it rolls on to a tick.',
      kind: 'Reference, pushed', from: [house('n29'), arc('number-field'), arc('action-swap')], tryit: 'Add two mangoes, take away the bread, then pay.',
      needs: 'Script and the shared digit roll.', keys: 'Tab to each count; arrows change it. Tab on to Pay.', off: 'Prices change in place. The button still shows Paying and Paid.', law: 'Proximity: each price sits on its own row, the total on the button that pays it.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'new:twist', 'look:ember'], h: 330, top: true,
      html: `<div class="nf cr"><ul class="cr-l">${[['Mangoes, each', 60, 2], ['Milk, 500 ml', 65, 1], ['Bread, 400 g', 70, 1]].map(([n, p, q], i) => `<li class="cr-r" data-row data-p="${p}" data-q="${q}"><span class="cr-n">${n}<small>KES ${p}</small></span>${stepper(`t07D-${i}`, n, 0, 9, q, 'sm')}<b class="cr-t" data-trk></b><p class="sr" data-note aria-live="polite"></p></li>`).join('')}</ul>
<button class="l-btn pri cr-pay" type="button" data-pay><span class="cr-s is-on" data-s="0">Pay KES <span data-amt></span></span><span class="cr-s" data-s="1" aria-hidden="true"><i></i><i></i><i></i></span><span class="cr-s" data-s="2" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M3.5 8.4 6.6 11.3 12.5 4.8"/></svg>Paid</span></button>
<p class="l-muted cr-m" data-msg aria-live="polite">Nothing paid yet.</p></div>`,
      css: `#t07D .cr { width: min(100%, 340px); gap: 12px; }
#t07D .cr-l { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
#t07D .cr-r { display: grid; grid-template-columns: minmax(0, 1fr) auto 64px; align-items: center; gap: 10px; padding: 4px 0; border-bottom: 1px solid var(--line); }
#t07D .cr-n { font-size: 14px; color: var(--ink); line-height: 1.25; }
#t07D .cr-n small { display: block; font-size: 12px; color: var(--muted); }
#t07D .nf-row.sm { padding: 2px; gap: 2px; border-radius: 10px; }
#t07D .nf-row.sm .nf-st { width: 30px; height: 30px; border-radius: 8px; }
#t07D .nf-row.sm .nf-in { width: 30px; height: 30px; font-size: 17px; }
#t07D .nf-row.sm .nf-disp { font-size: 17px; }
@media (pointer: coarse) { #t07D .nf-row.sm .nf-st { width: 40px; height: 40px; } }
#t07D .cr-t { text-align: right; font-family: var(--font-num); font-weight: 500; font-size: 16px; color: var(--ink); font-variant-numeric: tabular-nums; }
#t07D .cr-pay { display: grid; justify-self: stretch; height: 46px; font-weight: 600; overflow: hidden; }
#t07D .cr-s { grid-area: 1 / 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; opacity: 0; transform: translateY(14px) scale(.9); transition: opacity .18s var(--ease-out), transform var(--sp-bouncy-d) var(--sp-bouncy); }
#t07D .cr-s.is-on { opacity: 1; transform: none; }
#t07D .cr-s.was { transform: translateY(-14px) scale(.9); }
#t07D .cr-s i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: crDot .9s ease-in-out infinite; }
#t07D .cr-s i:nth-child(2) { animation-delay: .12s; } #t07D .cr-s i:nth-child(3) { animation-delay: .24s; }
@keyframes crDot { 0%, 60%, 100% { transform: none; opacity: .55; } 30% { transform: translateY(-4px); opacity: 1; } }
#t07D .cr-s svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
#t07D .cr-pay[aria-disabled="true"] { opacity: .5; }
#t07D .cr-m { margin: 0; }
@media (max-width: 400px) { #t07D .cr-r { grid-template-columns: minmax(0, 1fr) auto 50px; gap: 6px; } }`,
      js: `var rows = $$('[data-row]', box), amt = TLb.roll($('[data-amt]', box), { value: 255, fmt: TLb.money, dur: 520, stagger: 30 }), pay = $('[data-pay]', box), S = $$('[data-s]', pay), msg = $('[data-msg]', box), busy = false, fs = [];
function total() { return fs.reduce(function (a, f, i) { return a + f.get() * +rows[i].getAttribute('data-p'); }, 0); }
function show(k) { S.forEach(function (s, i) { var was = s.classList.contains('is-on'); s.classList.toggle('is-on', i === k); s.classList.toggle('was', was && i !== k); }); }
rows.forEach(function (row) { var p = +row.getAttribute('data-p'), t = TLb.roll($('[data-trk]', row), { value: p * +row.getAttribute('data-q'), fmt: TLb.money, dur: 460, stagger: 26 });
  fs.push(TLb.nf(row, { value: +row.getAttribute('data-q'), min: 0, max: 9, step: 1, maxMsg: 'Nine is the most per item.', minMsg: 'None in the cart.', on: function (n, was, first) { t.set(n * p); if (!first) { var tt = total(); amt.set(tt); pay.setAttribute('aria-disabled', String(tt === 0)); msg.textContent = tt ? 'Nothing paid yet.' : 'Your cart is empty.'; } } })); });
pay.addEventListener('click', function () { if (busy || !total()) return; busy = true; var tt = total(); pay.setAttribute('aria-busy', 'true'); show(1); msg.textContent = 'Paying…';
  setTimeout(function () { show(2); pay.removeAttribute('aria-busy'); msg.textContent = 'KES ' + TLb.money(tt) + ' paid to Duka Fresh.'; setTimeout(function () { show(0); busy = false; }, 2200); }, 1400); });`,
    },
  ],
};

/* ---------------- 08 Fluid sliders ---------------- */
const slider = {
  id: 'slider', n: '08', name: 'Fluid sliders', h: 300,
  claim: 'A slider should feel like <em>something you can throw.</em>',
  lead: 'Save for a phone that costs KES 24,000, or send money. Drag fast and let go. Pull past the end and feel it stretch. Every slider here also works with the arrow keys.',
  ref: { ids: 'n44', text: 'The slider that counts: a real range input, marks every 1,000, and a big number that counts to its new value.' },
  noteHint: 'B\'s stretch on the n44 marks', moreHint: 'a ruler for picking a time of day',
  css: `#slider .fs { width: min(100%, 360px); display: grid; gap: 10px; text-align: left; }
#slider .fs-h { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
#slider .fs-h .l-lbl { margin: 0; }
#slider .fs-v { font-family: var(--font-num); font-size: 30px; line-height: 1; color: var(--ink); font-variant-numeric: tabular-nums; white-space: nowrap; }
#slider .fs-g { margin: 0; font-size: 13.5px; color: var(--muted); }
#slider .fs-g b { font-family: var(--font-num); font-weight: 500; font-size: 16px; color: var(--ink); }
#slider [role="slider"] { touch-action: none; -webkit-user-select: none; user-select: none; cursor: grab; }
#slider [role="slider"]:focus { outline: none; }
#slider [role="slider"]:active { cursor: grabbing; }`,
  js: `/* arrow, Page, Home and End keys for a custom slider */
TLb.keys = function (el, o) { el.addEventListener('keydown', function (e) { var s = o.step, m = { ArrowRight: s, ArrowUp: s, ArrowLeft: -s, ArrowDown: -s, PageUp: o.big, PageDown: -o.big };
  if (e.key in m) { e.preventDefault(); o.go(o.get() + m[e.key] * (e.shiftKey && e.key.indexOf('Arrow') === 0 ? 10 : 1), m[e.key] > 0 ? 1 : -1); }
  else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); o.go(e.key === 'Home' ? o.min : o.max, e.key === 'Home' ? -1 : 1); } }); };
TLb.weeks = function (x) { var w = Math.ceil(24000 / x); return { w: w, d: new Date(2026, 10, 1 + w * 7).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) }; };`,
  opts: [
    {
      k: 'B', name: 'An elastic slider with a tag that leans', line: 'Pull past either end and the track stretches like rubber, then snaps back. The value tag trails the thumb and leans with your speed. The thumb clicks softly into each 1,000.',
      from: [arc('elastic-slider'), house('n44')], tryit: 'Drag fast from side to side, then pull hard past the right end.',
      needs: 'Script and a spring.', keys: 'Arrows move 100, Page keys 1,000, Home and End jump. At an end the track stretches.', off: 'No stretch and no lean; the thumb goes straight to the value.', law: 'Fitts: the tag shows the amount where your finger is.',
      tags: ['motion:springy', 'speed:mid', 'feedback:loud', 'new:novel', 'look:ember'], h: 290,
      html: `<div class="fs es"><div class="fs-h"><span class="l-lbl" id="t08B-l">Save each week</span><span class="fs-v" data-v aria-hidden="true"></span></div>
<div class="es-t" data-trk role="slider" tabindex="0" aria-labelledby="t08B-l" aria-valuemin="100" aria-valuemax="5000" aria-valuenow="1500"><div class="es-rail" data-rail><i class="es-f" data-fill></i></div><span class="es-mk" aria-hidden="true">${[1, 2, 3, 4, 5].map((k) => `<i data-mk="${k * 1000}" style="left:${((k * 1000 - 100) / 4900 * 100).toFixed(3)}%"></i>`).join('')}</span><span class="es-tag" data-tag aria-hidden="true"></span><span class="es-th" data-th></span></div>
<p class="fs-g">The phone is yours in <b data-w></b> weeks, around <span data-d></span>.</p></div>`,
      css: `#t08B .es-t { position: relative; height: 44px; margin: 30px 11px 0; }
#t08B .es-rail { position: absolute; left: 0; right: 0; top: 19px; height: 6px; border-radius: 6px; background: rgb(var(--ink-rgb) / .12); overflow: hidden; }
#t08B .es-f { position: absolute; inset: 0; background: var(--accent); transform-origin: left; }
#t08B .es-mk i { position: absolute; top: 30px; width: 1px; height: 6px; margin-left: -.5px; background: var(--line-hi); transform-origin: top; transition: transform .3s var(--sp-bouncy), background-color .2s; }
#t08B .es-mk i.hit { transform: scaleY(1.8); background: var(--accent); }
#t08B .es-th { position: absolute; left: -11px; top: 11px; width: 22px; height: 22px; }
#t08B .es-th::before { content: ""; position: absolute; inset: 0; border-radius: 50%; background: var(--paper-raised); border: 2px solid var(--accent); box-shadow: var(--shadow-sm); transition: transform .25s var(--ease-out); }
#t08B .es-t.drag .es-th::before { transform: scale(1.28); transition: transform var(--sp-bouncy-d) var(--sp-bouncy); }
#t08B .es-t:focus-visible .es-th::before { box-shadow: 0 0 0 4px rgb(var(--accent-rgb) / .25); }
#t08B .es-tag { position: absolute; left: 0; bottom: 100%; margin-bottom: -6px; padding: 4px 8px; border-radius: 7px; background: var(--ink); color: var(--paper); font: 500 12px/1 var(--font-mono); white-space: nowrap; pointer-events: none; transform-origin: 50% 140%; opacity: 0; transition: opacity .15s; }
#t08B .es-tag::after { content: ""; position: absolute; left: 50%; top: 100%; margin-left: -4px; border: 4px solid transparent; border-top-color: var(--ink); }
#t08B .es-t.drag .es-tag, #t08B .es-t:focus-visible .es-tag { opacity: 1; }
@media (hover: hover) { #t08B .es-t:hover .es-tag { opacity: 1; } }`,
      js: `var t = $('[data-trk]', box), rail = $('[data-rail]', box), fill = $('[data-fill]', box), th = $('[data-th]', box), tag = $('[data-tag]', box), mks = $$('[data-mk]', box), MIN = 100, MAX = 5000, val = 0, W = 1, drag = null;
var rv = TLb.roll($('[data-v]', box), { value: 1500, fmt: function (n) { return 'KES ' + TLb.money(n); }, dur: 420, stagger: 24 }), rw = TLb.roll($('[data-w]', box), { value: 16, dur: 420 }), dd = $('[data-d]', box);
function px(v) { return (v - MIN) / (MAX - MIN) * W; }
function draw() { var x = pos.x, s = str.x; th.style.transform = 'translateX(' + (x + s).toFixed(2) + 'px)';
  rail.style.transformOrigin = s < 0 ? 'right' : 'left'; rail.style.transform = Math.abs(s) > .05 ? 'scaleX(' + (1 + Math.abs(s) / W).toFixed(4) + ')' : '';
  fill.style.transform = 'scaleX(' + Math.max(0, Math.min(1, x / W)).toFixed(4) + ')'; }
var pos = TLb.sp(draw, { k: 420, c: 34, eps: .1 }), str = TLb.sp(draw, { k: 380, c: 11, eps: .05 });
var lean = TLb.sp(function (x, s) { var r = Math.max(-16, Math.min(16, -s.v * .028)); tag.style.transform = 'translateX(' + x.toFixed(2) + 'px) translateX(-50%) rotate(' + r.toFixed(2) + 'deg)'; }, { k: 170, c: 17, eps: .1 });
function setv(v, glide) { v = Math.max(MIN, Math.min(MAX, Math.round(v / 100) * 100)); if (v !== val) { var was = val; val = v; if (was) mks.forEach(function (m) { var k = +m.getAttribute('data-mk'); if ((was < k) !== (v < k) || v === k) { m.classList.add('hit'); clearTimeout(m._t); m._t = setTimeout(function () { m.classList.remove('hit'); }, 260); } }); }
  t.setAttribute('aria-valuenow', val); t.setAttribute('aria-valuetext', 'KES ' + TLb.money(val) + ' a week'); rv.set(val); tag.textContent = 'KES ' + TLb.money(val); var w = TLb.weeks(val); rw.set(w.w); dd.textContent = w.d;
  if (glide) pos.to(px(val)); else pos.to(px(val), { k: 1400, c: 75 }); lean.to(px(val)); }
function measure() { W = t.clientWidth || 1; pos.jump(px(val)); lean.jump(px(val)); }
function rub(o) { return Math.sign(o) * 22 * (1 - Math.exp(-Math.abs(o) / 70)); }
function fromX(cx) { var r = t.getBoundingClientRect(), raw = (cx - r.left) / W; if (raw < 0) str.jump(rub(raw * W)); else if (raw > 1) str.jump(rub((raw - 1) * W)); else if (str.x) str.jump(0);
  var v = MIN + Math.max(0, Math.min(1, raw)) * (MAX - MIN), near = Math.round(v / 1000) * 1000; if (near >= 1000 && Math.abs(v - near) < 90) v = near; return v; }
t.addEventListener('pointerdown', function (e) { if (e.button) return; t.setPointerCapture(e.pointerId); t.classList.add('drag'); drag = true; setv(fromX(e.clientX), true); });
t.addEventListener('pointermove', function (e) { if (drag) setv(fromX(e.clientX), false); });
function up() { if (!drag) return; drag = null; t.classList.remove('drag'); str.to(0); }
t.addEventListener('pointerup', up); t.addEventListener('pointercancel', up);
TLb.keys(t, { step: 100, big: 1000, min: MIN, max: MAX, get: function () { return val; }, go: function (v, d) { if ((v > MAX && val === MAX) || (v < MIN && val === MIN)) { str.to(0, { v: d * 260 }); return; } setv(v, true); } });
setv(1500, true); new ResizeObserver(measure).observe(t); measure();`,
    },
    {
      k: 'A', name: 'Numbers you scrub by their labels', line: 'Like a design tool. Drag sideways on a label to change its number. Hold Shift for big steps or Alt for small ones. You can still click in and type.',
      from: [arc('scrub-input'), sh('input')], tryit: 'Drag the words "Price per kg" left and right, then try it with Shift held.',
      needs: 'Script and a spring.', keys: 'In a field: arrows add or take 1, Shift adds 10. Type a number and press Enter. Escape while dragging puts the old number back.', off: 'The number does not lean at the limit; the bar jumps.', law: 'Jakob: works like Figma and other design tools.',
      tags: ['motion:some', 'speed:quick', 'density:compact', 'feedback:quiet', 'new:familiar', 'look:ember'], h: 280,
      html: `<div class="fs scr">${[['p', 'Price per kg', 'KES', 120, 20, 400], ['q', 'Weight', 'kg', 2, 1, 25], ['d', 'Discount', '%', 10, 0, 50]].map(([k, l, u, v, a, b]) => `<div class="scr-f" data-f="${k}" data-min="${a}" data-max="${b}"><span class="scr-l" data-l aria-hidden="true">${l}<em data-mul></em></span><span class="scr-b" data-shell><input class="scr-in" data-in type="text" inputmode="numeric" autocomplete="off" role="spinbutton" aria-label="${l}" aria-valuemin="${a}" aria-valuemax="${b}" aria-valuenow="${v}" value="${v}"><span class="scr-u">${u}</span><i class="scr-bar" data-bar></i></span></div>`).join('')}
<p class="fs-g">Mangoes: <b data-sum></b></p></div>`,
      css: `#t08A .scr { gap: 8px; }
#t08A .fs-g b { font-family: inherit; font-size: 13.5px; font-weight: 600; }
#t08A .scr-f { display: grid; grid-template-columns: 104px minmax(0, 1fr); align-items: center; gap: 10px; }
#t08A .scr-l { font-size: 13.5px; color: var(--ink-soft); cursor: ew-resize; touch-action: none; -webkit-user-select: none; user-select: none; padding: 10px 0; display: flex; align-items: center; gap: 6px; transition: color .15s; }
#t08A .scr-l:hover, #t08A .scr-f.drag .scr-l { color: var(--accent-text); }
#t08A .scr-l em { font: 500 10px/1 var(--font-mono); font-style: normal; color: var(--accent-text); opacity: 0; transition: opacity .15s; }
#t08A .scr-l em.on { opacity: 1; }
#t08A .scr-b { position: relative; display: flex; align-items: center; height: 36px; padding: 0 10px; border-radius: 8px; border: 1px solid var(--line-hi); background: var(--paper-raised); overflow: hidden; transition: border-color .2s; }
#t08A .scr-b:focus-within { border-color: var(--accent); }
#t08A .scr-b.no { animation: scNo .32s var(--ease-out); }
@keyframes scNo { 20% { transform: translateX(-3px); } 45% { transform: translateX(3px); } 70% { transform: translateX(-2px); } 100% { transform: none; } }
#t08A .scr-in { flex: 1; min-width: 0; border: 0; background: transparent; font: 500 15px var(--font-body); font-variant-numeric: tabular-nums; color: var(--ink); padding: 0; }
#t08A .scr-in:focus { outline: none; }
#t08A .scr-u { font: 500 11px var(--font-mono); color: var(--muted); }
#t08A .scr-bar { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: var(--accent); transform-origin: left; transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#t08A .scr-f.drag .scr-bar { transition: none; }
@media (pointer: coarse) { #t08A .scr-b { height: 44px; } }`,
      js: `var F = {}, sum = $('[data-sum]', box);
function total() { if (!F.d) return; var p = F.p.v, q = F.q.v, d = F.d.v; sum.textContent = q + ' kg at KES ' + p + ', less ' + d + '%, is KES ' + TLb.money(Math.round(p * q * (100 - d) / 100)); }
$$('[data-f]', box).forEach(function (f) {
  var k = f.getAttribute('data-f'), lab = $('[data-l]', f), mul = $('[data-mul]', f), inp = $('[data-in]', f), bar = $('[data-bar]', f), sh = $('[data-shell]', f), min = +f.getAttribute('data-min'), max = +f.getAttribute('data-max'), d = null;
  var me = F[k] = { v: +inp.value };
  var lean = TLb.sp(function (x) { inp.style.transform = Math.abs(x) > .02 ? 'translateX(' + x.toFixed(2) + 'px)' : ''; }, { k: 500, c: 22, eps: .02 });
  function put(v) { me.v = Math.max(min, Math.min(max, Math.round(v))); inp.value = me.v; inp.setAttribute('aria-valuenow', me.v); bar.style.transform = 'scaleX(' + ((me.v - min) / (max - min)).toFixed(4) + ')'; total(); }
  function rate(e) { return e.shiftKey ? 10 : e.altKey ? .125 : 1; }
  lab.addEventListener('pointerdown', function (e) { if (e.button) return; e.preventDefault(); lab.setPointerCapture(e.pointerId); d = { x: e.clientX, v: me.v, start: me.v, m: rate(e) }; f.classList.add('drag'); });
  lab.addEventListener('pointermove', function (e) { if (!d) return; var m = rate(e); if (m !== d.m) d = { x: e.clientX, v: me.v, start: d.start, m: m }; mul.textContent = m > 1 ? '×10' : m < 1 ? 'fine' : ''; mul.classList.toggle('on', m !== 1);
    var raw = d.v + (e.clientX - d.x) / 4 * m; put(raw); var over = raw > max ? raw - max : raw < min ? raw - min : 0; if (moving()) lean.jump(Math.sign(over) * Math.min(12, Math.abs(over) / m)); });
  function end(cancel) { if (!d) return; if (cancel === true) put(d.start); d = null; f.classList.remove('drag'); mul.classList.remove('on'); lean.to(0); }
  lab.addEventListener('pointerup', end); lab.addEventListener('pointercancel', end);
  document.addEventListener('keydown', function (e) { if (d && e.key === 'Escape') end(true); });
  inp.addEventListener('keydown', function (e) { var s = e.shiftKey ? 10 : 1; if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); var n = me.v + (e.key === 'ArrowUp' ? s : -s); if (n > max || n < min) lean.to(0, { v: (n > max ? 1 : -1) * 130 }); put(n); } else if (e.key === 'Enter') inp.blur(); });
  inp.addEventListener('change', function () { var n = parseInt(inp.value.replace(/[^0-9]/g, ''), 10); if (isNaN(n)) { if (moving()) { sh.classList.remove('no'); void sh.offsetWidth; sh.classList.add('no'); } put(me.v); return; } put(n); });
  put(me.v);
});
total();`,
    },
    {
      k: 'C', name: 'A ruler you flick under a needle', line: 'A tape of ticks slides under a fixed orange needle. Flick it and it coasts, slows and lands on a tick. Pull past an end and it bands back. Each digit of the amount rolls as ticks pass the needle.',
      kind: 'Mix', from: [arc('ruler-slider'), house('n07')], tryit: 'Flick the ruler hard, grab it while it coasts, then press a quick amount.',
      needs: 'Script and a spring.', keys: 'Arrows move 50, Page keys 500, Home and End jump. The tape glides and keeps its speed if you keep pressing.', off: 'The tape jumps to the value; no coasting.', law: 'Fitts: the whole ruler is the target, good for thumbs on a phone.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:novel', 'look:ember'], h: 310,
      html: `<div class="fs ru"><div class="fs-h"><span class="l-lbl" id="t08C-l">Send to Amina Otieno</span><span class="fs-v" data-v aria-hidden="true"></span></div>
<div class="ru-w" data-trk role="slider" tabindex="0" aria-labelledby="t08C-l" aria-valuemin="0" aria-valuemax="10000" aria-valuenow="1500"><div class="ru-tape" data-tape aria-hidden="true">${Array.from({ length: 21 }, (_, i) => `<span style="left:${i * 80}px">${i % 2 ? '' : i / 2 + 'k'}</span>`).join('')}</div><span class="ru-n" aria-hidden="true"></span></div>
<div class="ru-q" role="group" aria-label="Quick amounts">${[500, 1000, 2500, 5000].map((v) => `<button class="l-btn sm" type="button" data-q="${v}">${v.toLocaleString('en-KE')}</button>`).join('')}</div></div>`,
      css: `#t08C .ru-w { position: relative; height: 64px; margin: 4px 0 2px; overflow: hidden; border-radius: 10px; background: var(--paper-raised); border: 1px solid var(--line); -webkit-mask-image: linear-gradient(90deg, transparent, #000 16%, #000 84%, transparent); mask-image: linear-gradient(90deg, transparent, #000 16%, #000 84%, transparent); }
#t08C .ru-w:focus-visible { border-color: var(--accent); -webkit-mask-image: none; mask-image: none; box-shadow: 0 0 0 3px rgb(var(--accent-rgb) / .18); }
#t08C .ru-tape { position: absolute; left: 50%; top: 0; bottom: 0; width: 1601px; background: linear-gradient(90deg, var(--line-hi) 1px, transparent 1px) 0 0 / 8px 12px repeat-x, linear-gradient(90deg, var(--muted) 1px, transparent 1px) 0 0 / 40px 18px repeat-x; }
#t08C .ru-tape span { position: absolute; top: 34px; transform: translateX(-50%); font: 500 11px/1 var(--font-mono); color: var(--muted); }
#t08C .ru-tape span:not(:empty)::before { content: ""; position: absolute; left: 50%; top: -34px; width: 1px; height: 28px; background: var(--ink-soft); }
#t08C .ru-n { position: absolute; left: 50%; top: 0; width: 2px; height: 36px; margin-left: -1px; border-radius: 0 0 2px 2px; background: var(--accent); }
#t08C .ru-n::after { content: ""; position: absolute; left: -4px; top: 0; border: 5px solid transparent; border-top-color: var(--accent); }
#t08C .ru-q { display: flex; gap: 6px; flex-wrap: wrap; }
#t08C .ru-q .l-btn { font-family: var(--font-num); font-size: 15px; }`,
      js: `var t = $('[data-trk]', box), tape = $('[data-tape]', box), PX = 8, STEP = 50, END = 1600, val = -1, drag = null;
var rv = TLb.roll($('[data-v]', box), { value: 1500, fmt: function (n) { return 'KES ' + TLb.money(n); }, dur: 300, stagger: 16 });
function show(x) { tape.style.transform = 'translateX(' + (-x).toFixed(2) + 'px)'; var v = Math.round(Math.max(0, Math.min(END, x)) / PX) * STEP; if (v !== val) { val = v; rv.set(v); t.setAttribute('aria-valuenow', v); t.setAttribute('aria-valuetext', 'KES ' + TLb.money(v)); } }
var sp = TLb.sp(show, { k: 260, c: 30, eps: .05 });
function snap(x) { return Math.max(0, Math.min(END, Math.round(x / PX) * PX)); }
function band(x) { if (x < 0) return -38 * (1 - Math.exp(x / 110)); if (x > END) return END + 38 * (1 - Math.exp(-(x - END) / 110)); return x; }
t.addEventListener('pointerdown', function (e) { if (e.button) return; t.setPointerCapture(e.pointerId); var x0 = sp.x; sp.jump(x0); drag = { x: e.clientX, o: x0 < 0 ? 0 : x0 > END ? END : x0, raw: x0, s: [[performance.now(), x0]], moved: 0 }; });
t.addEventListener('pointermove', function (e) { if (!drag) return; var raw = drag.o - (e.clientX - drag.x); drag.moved = Math.max(drag.moved, Math.abs(e.clientX - drag.x)); drag.raw = raw; sp.jump(band(raw)); drag.s.push([performance.now(), raw]); if (drag.s.length > 6) drag.s.shift(); });
function up(e) { if (!drag) return; var d = drag; drag = null;
  if (d.moved < 4) { var r = t.getBoundingClientRect(); sp.to(snap(sp.x + (e.clientX - (r.left + r.width / 2))), { k: 260, c: 30 }); return; }
  var a = d.s[0], b = d.s[d.s.length - 1], dt = (b[0] - a[0]) / 1000, v = dt > 0 && performance.now() - b[0] < 90 ? (b[1] - a[1]) / dt : 0; v = Math.max(-5000, Math.min(5000, v));
  var aim = d.raw + v * .3, out = aim < 0 || aim > END; sp.to(snap(aim), out ? { v: v, k: 120, c: 15 } : { v: v, k: 11, c: 6.7 }); }
t.addEventListener('pointerup', up); t.addEventListener('pointercancel', up);
TLb.keys(t, { step: STEP, big: 500, min: 0, max: 10000, get: function () { return Math.round(sp.t / PX) * STEP; }, go: function (v) { sp.to(snap(v / STEP * PX), { k: 300, c: 32 }); } });
$$('[data-q]', box).forEach(function (b) { b.addEventListener('click', function () { sp.to(+b.getAttribute('data-q') / STEP * PX, { k: 170, c: 26 }); }); });
sp.jump(1500 / STEP * PX);`,
    },
    {
      k: 'D', name: 'Your counting slider, now rolling', line: 'Your n44 slider, pushed. The amount and the weeks roll digit by digit in the direction you slide. Each mark under the track lights up as the thumb passes it.',
      kind: 'Reference, pushed', from: [house('n44'), arc('elastic-slider')], tryit: 'Slide from 500 to 5,000 and watch the weeks roll down.',
      needs: 'A real range input, script and the shared digit roll.', keys: 'Arrows move 100, Page keys 1,000, Home and End jump.', off: 'The numbers change in place; the marks light with no pop.', law: 'Proximity: the marks put numbers right under the track.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'], h: 260,
      html: `<div class="fs n4"><div class="fs-h"><label class="l-lbl" for="t08D-r">Save each week</label><output class="fs-v" for="t08D-r" data-v></output></div>
<input id="t08D-r" type="range" min="100" max="5000" step="100" value="1500" data-r><div class="n4-mk" aria-hidden="true">${['100', '1k', '2k', '3k', '4k', '5k'].map((l, i) => `<span data-mk="${i ? i * 1000 : 100}">${l}</span>`).join('')}</div>
<p class="fs-g">The phone is yours in <b data-w></b> weeks, around <span data-d></span>.</p></div>`,
      css: `#t08D input[type=range] { --p: 28.6%; width: 100%; height: 28px; margin: 0; background: transparent; -webkit-appearance: none; appearance: none; cursor: pointer; }
#t08D input[type=range]::-webkit-slider-runnable-track { height: 6px; border-radius: 6px; background: linear-gradient(90deg, var(--accent) var(--p), rgb(var(--ink-rgb) / .12) var(--p)); }
#t08D input[type=range]::-moz-range-track { height: 6px; border-radius: 6px; background: linear-gradient(90deg, var(--accent) var(--p), rgb(var(--ink-rgb) / .12) var(--p)); }
#t08D input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; margin-top: -8px; border-radius: 50%; background: var(--paper-raised); border: 2px solid var(--accent); box-shadow: var(--shadow-sm); transition: transform var(--sp-bouncy-d) var(--sp-bouncy); }
#t08D input[type=range]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: var(--paper-raised); border: 2px solid var(--accent); }
#t08D input[type=range]:active::-webkit-slider-thumb { transform: scale(1.15); }
#t08D input[type=range]:focus-visible { outline: none; }
#t08D input[type=range]:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgb(var(--accent-rgb) / .25); }
#t08D .n4-mk { display: flex; justify-content: space-between; padding: 0 4px; margin-top: -6px; font: 500 10.5px/1 var(--font-mono); color: var(--muted); }
#t08D .n4-mk span { position: relative; padding-top: 7px; transition: color .2s; }
#t08D .n4-mk span::before { content: ""; position: absolute; left: 50%; top: 0; width: 1px; height: 5px; background: var(--line-hi); transform-origin: top; transition: transform .3s var(--sp-bouncy), background-color .2s; }
#t08D .n4-mk span.on { color: var(--accent-text); }
#t08D .n4-mk span.on::before { background: var(--accent); }
#t08D .n4-mk span.hit::before { transform: scaleY(1.9); }`,
      js: `var r = $('[data-r]', box), mk = $$('[data-mk]', box), dd = $('[data-d]', box), last = +r.value;
var rv = TLb.roll($('[data-v]', box), { value: last, fmt: function (n) { return 'KES ' + TLb.money(n); }, dur: 460, stagger: 28 }), rw = TLb.roll($('[data-w]', box), { value: 16, dur: 460 });
function upd() { var x = +r.value; r.style.setProperty('--p', ((x - 100) / 4900 * 100) + '%'); rv.set(x); var w = TLb.weeks(x); rw.set(w.w); dd.textContent = w.d;
  mk.forEach(function (m) { var k = +m.getAttribute('data-mk'); m.classList.toggle('on', x >= k); if ((last < k) !== (x < k) || (x === k && last !== k)) { m.classList.add('hit'); clearTimeout(m._t); m._t = setTimeout(function () { m.classList.remove('hit'); }, 280); } }); last = x; }
r.addEventListener('input', upd); upd();`,
    },
  ],
};

/* ---------------- 09 Morph select ---------------- */
const AREAS = [['Westlands', 150], ['Kilimani', 150], ['Lavington', 200], ['Kileleshwa', 200], ['Parklands', 180], ['South B', 250], ['Embakasi', 300], ['Karen', 350]];
const AR = JSON.stringify(AREAS);
const optsHtml = (id, sel) => AREAS.map(([n, f], i) => `<li role="option" id="${id}-o${i}" aria-selected="${i === sel}" class="ms-o"><span class="ms-ol">${n}</span><span class="ms-of">KES ${f}</span><span class="ms-ok" aria-hidden="true">${I.check}</span></li>`).join('');
const trig = (id, sel) => `<button class="ms-tr" type="button" data-trig aria-haspopup="listbox" aria-controls="${id}-lb" aria-labelledby="${id}-l ${id}-v"><span class="ms-val" id="${id}-v" data-val>${AREAS[sel][0]}</span><span class="ms-fee" data-fee></span><span class="ms-cv">${I.chev}</span></button>`;
const morphsel = {
  id: 'morphsel', n: '09', name: 'Morph select', h: 430,
  claim: 'A select should <em>grow out of itself,</em> then fold back.',
  lead: 'Pick where Duka Fresh delivers your order. The delivery fee changes with the area. Open each one with a click or the keyboard, and watch where the list comes from and how your pick goes back.',
  ref: { ids: 'n09', text: 'The combobox: type to filter, one highlight glides between options. You said "stick with it".' },
  noteHint: 'B\'s growing box with D\'s typing', moreHint: 'the same morph for a phone country code',
  css: `#morphsel .ms { width: min(100%, 290px); text-align: left; }
#morphsel .ms .l-lbl { margin-bottom: 6px; }
#morphsel .ms-wrap { position: relative; }
#morphsel .ms-tr { position: relative; width: 100%; height: 46px; display: flex; align-items: center; gap: 10px; padding: 0 12px 0 14px; border-radius: 12px; border: 1px solid var(--line-hi); background: var(--paper-raised); color: var(--ink); font-size: 15px; font-weight: 500; text-align: left; box-shadow: var(--shadow-sm); transition: border-color .2s, transform .15s var(--ease-out); }
#morphsel .ms-tr:hover { border-color: rgb(var(--ink-rgb) / .42); }
#morphsel .ms-tr:active { transform: scale(.985); }
#morphsel .ms-tr:focus-visible { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgb(var(--accent-rgb) / .18); }
#morphsel .ms-val { flex: 1; min-width: 0; white-space: nowrap; }
#morphsel .ms-fee { font: 500 12px/1 var(--font-mono); color: var(--muted); white-space: nowrap; }
#morphsel .ms-cv { display: grid; color: var(--muted); transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#morphsel .ms-cv svg { width: 16px; height: 16px; }
#morphsel [aria-expanded="true"] .ms-cv { transform: rotate(180deg); }
#morphsel .ms-lb { list-style: none; margin: 0; padding: 5px; position: relative; outline: none; }
#morphsel .ms-o { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border-radius: 8px; font-size: 14.5px; color: var(--ink); cursor: pointer; -webkit-user-select: none; user-select: none; }
#morphsel .ms-ol { flex: 1; }
#morphsel .ms-of { font: 500 11.5px/1 var(--font-mono); color: var(--muted); }
#morphsel .ms-ok { width: 16px; display: grid; color: var(--accent-text); opacity: 0; }
#morphsel .ms-ok svg { width: 15px; height: 15px; }
#morphsel .ms-o[aria-selected="true"] .ms-ok { opacity: 1; }
#morphsel .ms-o[aria-selected="true"] .ms-ol { font-weight: 600; }
#morphsel .ms-hl { position: absolute; z-index: 0; left: 5px; right: 5px; top: 0; height: 36px; border-radius: 8px; background: rgb(var(--ink-rgb) / .07); pointer-events: none; transition: transform var(--sp-snappy-d) var(--sp-snappy), opacity .15s; }
#morphsel .ms-lb:focus-visible .ms-hl { box-shadow: inset 0 0 0 1.5px rgb(var(--accent-rgb) / .55); }
#morphsel .ms-out { margin: 10px 0 0; font-size: 13px; color: var(--muted); min-height: 1.4em; }
#morphsel .ms-out b { color: var(--ink); font-weight: 600; }
@media (pointer: coarse) { #morphsel .ms-o { height: 44px; } }`,
  js: `/* a listbox with arrows, type-ahead, Enter and Escape; the version decides how it opens and closes */
TLb.lb = function (box, o) {
  var wrap = $('.ms-wrap', box), trig = $('[data-trig]', box), list = $('[role="listbox"]', box), opts = $$('[role="option"]', list), hl = $('.ms-hl', list), open = false, act = o.sel, sel = o.sel, buf = '', bT = 0, out = $('[data-out]', box);
  function mark(i, jump) { act = Math.max(0, Math.min(opts.length - 1, i)); opts.forEach(function (op, j) { op.toggleAttribute('data-on', j === act); }); list.setAttribute('aria-activedescendant', opts[act].id);
    if (hl) { if (jump) hl.style.transition = 'none'; hl.style.transform = 'translateY(' + opts[act].offsetTop + 'px)'; hl.style.height = opts[act].offsetHeight + 'px'; if (jump) { hl.offsetWidth; hl.style.transition = ''; } } }
  function set(v, back) { if (v === open) return; open = v; trig.setAttribute('aria-expanded', String(v)); box.classList.toggle('is-open', v);
    if (v) { mark(sel, true); setTimeout(function () { list.focus({ preventScroll: true }); }, 10); }
    else if (back !== false) trig.focus({ preventScroll: true }); }
  function pick(i) { var from = sel; sel = i; opts.forEach(function (op, j) { op.setAttribute('aria-selected', String(j === i)); }); if (o.pick) o.pick(i, from, opts[i]); set(false); if (out) out.innerHTML = 'Delivery to <b>' + o.items[i][0] + '</b>: KES ' + o.items[i][1] + '.'; }
  trig.setAttribute('aria-expanded', 'false');
  trig.addEventListener('click', function () { set(!open); });
  trig.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); set(true); } });
  list.addEventListener('keydown', function (e) { var k = e.key;
    if (k === 'ArrowDown') { e.preventDefault(); mark(act + 1); } else if (k === 'ArrowUp') { e.preventDefault(); mark(act - 1); }
    else if (k === 'Home' || k === 'PageUp') { e.preventDefault(); mark(0); } else if (k === 'End' || k === 'PageDown') { e.preventDefault(); mark(opts.length - 1); }
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); pick(act); }
    else if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); set(false); }
    else if (k === 'Tab') { set(false, false); }
    else if (k.length === 1 && /[a-z]/i.test(k)) { clearTimeout(bT); buf += k.toLowerCase(); bT = setTimeout(function () { buf = ''; }, 600);
      for (var j = 0; j < opts.length; j++) { var c = (act + (buf.length === 1 ? 1 : 0) + j) % opts.length; if (o.items[c][0].toLowerCase().indexOf(buf) === 0) { mark(c); break; } } } });
  list.addEventListener('pointermove', function (e) { var t = e.target.closest && e.target.closest('[role="option"]'); if (t) { var j = opts.indexOf(t); if (j !== act) mark(j); } });
  list.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[role="option"]'); if (t) pick(opts.indexOf(t)); });
  document.addEventListener('pointerdown', function (e) { if (open && !wrap.contains(e.target)) set(false, false); });
};
/* a word that rolls up or down to its new text */
TLb.word = function (el, text, dir) {
  if (!moving()) { el.textContent = text; el._t = text; return; } if (el._t === text) return;
  el.innerHTML = ''; var a = document.createElement('span'), b = document.createElement('span'); a.textContent = el._t || ''; b.textContent = text; el._t = text;
  el.appendChild(a); el.appendChild(b); var y = dir > 0 ? 1 : -1, s = TLb.spring('snappy');
  a.animate([{ transform: 'none', opacity: 1, filter: 'blur(0)' }, { transform: 'translateY(' + (-y * 80) + '%)', opacity: 0, filter: 'blur(3px)' }], { duration: 200, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
  b.animate([{ transform: 'translateY(' + (y * 80) + '%)', opacity: 0, filter: 'blur(3px)' }, { transform: 'none', opacity: 1, filter: 'blur(0)' }], { duration: s.d, easing: s.e }).onfinish = function () { if (el._t === text) el.textContent = text; };
};`,
  opts: [
    {
      k: 'B', name: 'The button grows into the list', line: 'The button itself grows into the list, and its corners round off as it grows. Pick an area and its name flies back into the button while the list folds away. The fee rolls up or down by where the area sits in the list.',
      from: [arc('morph-select'), house('n09')], tryit: 'Open it, pick Karen, then open it again and pick Westlands.',
      needs: 'Script, a clip-path spring and the shared digit roll.', keys: 'Arrow down opens. Arrows, Home, End and the first letters move. Enter picks. Escape closes and puts you back on the button.', off: 'The list shows and hides at once; the name swaps in place.', law: 'Jakob: works like the select in every form, it just moves better.',
      tags: ['motion:springy', 'speed:mid', 'open:inplace', 'feedback:clear', 'new:twist', 'look:ember'], top: true,
      html: `<div class="ms"><span class="l-lbl" id="t09B-l">Deliver to</span><div class="ms-wrap">${trig('t09B', 1)}<div class="ms-pw"><div class="ms-pan"><div class="ms-head" aria-hidden="true"><span data-hv>${AREAS[1][0]}</span><span class="ms-cv">${I.chev}</span></div><ul class="ms-lb" role="listbox" id="t09B-lb" tabindex="-1" aria-labelledby="t09B-l"><li class="ms-hl" aria-hidden="true" role="presentation"></li>${optsHtml('t09B', 1)}</ul></div></div></div><p class="ms-out" data-out aria-live="polite"></p></div>`,
      css: `#t09B .ms-pw { position: absolute; z-index: 4; left: 0; right: 0; top: 0; filter: drop-shadow(0 0 .6px var(--line-hi)) drop-shadow(0 16px 22px rgb(var(--ink-rgb) / .12)); pointer-events: none; }
html[data-theme="dark"] #t09B .ms-pw { filter: drop-shadow(0 0 .6px var(--line-hi)) drop-shadow(0 16px 24px rgb(0 0 0 / .55)); }
#t09B .ms-pan { background: var(--paper-raised); visibility: hidden; clip-path: inset(0 0 calc(100% - 46px) 0 round 12px); transition: clip-path .22s var(--ease-out), visibility 0s linear .22s; }
#t09B.is-open .ms-pan { visibility: visible; pointer-events: auto; clip-path: inset(0 0 0 0 round 16px); transition: clip-path var(--sp-bouncy-d) var(--sp-bouncy), visibility 0s; }
#t09B .ms-head { height: 46px; display: flex; align-items: center; justify-content: space-between; padding: 0 12px 0 14px; font-size: 15px; font-weight: 500; color: var(--muted); border-bottom: 1px solid var(--line); }
#t09B .ms-head .ms-cv { transform: rotate(180deg); }
#t09B .ms-lb .ms-o { opacity: 0; transition: opacity .12s; }
#t09B.is-open .ms-lb .ms-o { opacity: 1; transition: opacity .2s .06s; }
#t09B .ms-fly { position: absolute; z-index: 6; left: 0; top: 0; font-size: 15px; font-weight: 500; color: var(--ink); white-space: nowrap; pointer-events: none; }`,
      js: `var wrap = $('.ms-wrap', box), val = $('[data-val]', box), hv = $('[data-hv]', box), A = ${AR}, fee = TLb.roll($('[data-fee]', box), { value: A[1][1], fmt: function (n) { return 'KES ' + n; }, dur: 480, stagger: 30 });
TLb.lb(box, { sel: 1, items: A, pick: function (i, from, op) {
  var lab = $('.ms-ol', op), w = wrap.getBoundingClientRect(), a = lab.getBoundingClientRect();
  val.textContent = A[i][0]; if (i !== from && moving()) hv.style.opacity = 0; setTimeout(function () { hv.textContent = A[i][0]; hv.style.opacity = ''; }, 260); if (i !== from) fee.set(A[i][1], { dir: i > from ? 'up' : 'down' });
  if (!moving() || i === from) return;
  var b = val.getBoundingClientRect(), fl = document.createElement('span'); fl.className = 'ms-fly'; fl.textContent = A[i][0]; fl.setAttribute('aria-hidden', 'true'); wrap.appendChild(fl); val.style.opacity = 0;
  var fh = fl.offsetHeight, ya = a.top - w.top + (a.height - fh) / 2, yb = b.top - w.top + (b.height - fh) / 2;
  var s = TLb.spring('snappy'), an = fl.animate([{ transform: 'translate(' + (a.left - w.left) + 'px,' + ya + 'px)' }, { transform: 'translate(' + (b.left - w.left) + 'px,' + yb + 'px)' }], { duration: s.d, easing: s.e, fill: 'forwards' });
  an.onfinish = function () { val.style.opacity = ''; fl.remove(); }; } });`,
    },
    {
      k: 'A', name: 'A plain list under the button', line: 'The shadcn select: a list opens under the button, the row under the pointer turns grey, and the name swaps when you pick.',
      from: [sh('select'), arc('select')], tryit: 'Open it and pick with the keyboard.',
      needs: 'Script for the keys.', keys: 'Same as B.', off: 'Same.', law: 'Jakob: the select everyone knows.',
      tags: ['motion:still', 'speed:quick', 'open:trigger', 'new:familiar', 'look:ember'], top: true,
      html: `<div class="ms"><span class="l-lbl" id="t09A-l">Deliver to</span><div class="ms-wrap">${trig('t09A', 1)}<div class="ms-pop l-panel"><ul class="ms-lb" role="listbox" id="t09A-lb" tabindex="-1" aria-labelledby="t09A-l">${optsHtml('t09A', 1)}</ul></div></div><p class="ms-out" data-out aria-live="polite"></p></div>`,
      css: `#t09A .ms-pop { position: absolute; z-index: 4; left: 0; right: 0; top: calc(100% + 6px); padding: 0; display: none; }
#t09A.is-open .ms-pop { display: block; }
#t09A .ms-o[data-on] { background: rgb(var(--ink-rgb) / .07); }`,
      js: `var val = $('[data-val]', box), fee = $('[data-fee]', box), A = ${AR}; fee.textContent = 'KES ' + A[1][1];
TLb.lb(box, { sel: 1, items: A, pick: function (i) { val.textContent = A[i][0]; fee.textContent = 'KES ' + A[i][1]; } });`,
    },
    {
      k: 'C', name: 'A list that springs open, a name that rolls', line: 'The list springs out of the button, a little bigger, then settles. When you pick, the name in the button rolls up for an area lower in the list and down for one higher up.',
      kind: 'Mix', from: [arc('select'), arc('morph-select'), house('n32')], tryit: 'Pick Embakasi, then Westlands, and watch which way the name rolls.',
      needs: 'Script and CSS springs.', keys: 'Same as B.', off: 'The list shows at once; the name swaps in place.', law: 'Jakob: a normal select with one clear twist.',
      tags: ['motion:springy', 'speed:mid', 'open:trigger', 'feedback:clear', 'new:twist', 'look:ember'], top: true,
      html: `<div class="ms"><span class="l-lbl" id="t09C-l">Deliver to</span><div class="ms-wrap">${trig('t09C', 1)}<div class="ms-pop l-panel"><ul class="ms-lb" role="listbox" id="t09C-lb" tabindex="-1" aria-labelledby="t09C-l"><li class="ms-hl" aria-hidden="true" role="presentation"></li>${optsHtml('t09C', 1)}</ul></div></div><p class="ms-out" data-out aria-live="polite"></p></div>`,
      css: `#t09C .ms-pop { position: absolute; z-index: 4; left: 0; right: 0; top: calc(100% + 6px); padding: 0; transform-origin: 50% 0; opacity: 0; visibility: hidden; transform: translateY(-6px) scale(.96); transition: opacity .15s var(--ease-out), transform .18s var(--ease-out), visibility 0s linear .18s; }
#t09C.is-open .ms-pop { opacity: 1; visibility: visible; transform: none; transition: opacity .18s var(--ease-out), transform var(--sp-bouncy-d) var(--sp-bouncy), visibility 0s; }
#t09C .ms-val { display: grid; overflow: hidden; height: 1.5em; line-height: 1.5em; }
#t09C .ms-val > span { grid-area: 1 / 1; }`,
      js: `var val = $('[data-val]', box), A = ${AR}, fee = TLb.roll($('[data-fee]', box), { value: A[1][1], fmt: function (n) { return 'KES ' + n; }, dur: 480, stagger: 30 }); val._t = A[1][0];
TLb.lb(box, { sel: 1, items: A, pick: function (i, from) { if (i === from) return; TLb.word(val, A[i][0], i > from ? 1 : -1); fee.set(A[i][1], { dir: i > from ? 'up' : 'down' }); } });`,
    },
    {
      k: 'D', name: 'Your combobox, with a list that resizes', line: 'Your n09 combobox, pushed. Type to filter, and the list grows or shrinks smoothly to fit what is left. The highlight glides. Your pick rises into the field, and the fee rolls.',
      kind: 'Reference, pushed', from: [house('n09'), arc('combobox')], tryit: 'Type "ki", then delete it slowly. Pick with Enter.',
      needs: 'Script and the shared digit roll.', keys: 'Type to filter. Arrows move, Enter picks, Escape closes or clears.', off: 'The list jumps to its new size; the pick shows at once.', law: 'Hick: typing cuts eight choices down to one or two.',
      tags: ['motion:springy', 'speed:mid', 'open:trigger', 'feedback:clear', 'new:twist', 'look:ember'], top: true,
      html: `<div class="ms"><label class="l-lbl" for="t09D-in">Deliver to</label><div class="ms-wrap"><div class="cbx"><input id="t09D-in" class="cbx-in" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="t09D-lb" autocomplete="off" value="${AREAS[1][0]}"><span class="ms-fee" data-fee></span></div>
<div class="ms-pop l-panel"><div class="cbx-box" data-box><ul class="ms-lb" role="listbox" id="t09D-lb" aria-label="Areas"><li class="ms-hl" aria-hidden="true" role="presentation"></li>${optsHtml('t09D', 1)}</ul><p class="cbx-none" data-none hidden></p></div></div></div><p class="ms-out" data-out aria-live="polite"></p></div>`,
      css: `#t09D .cbx { display: flex; align-items: center; gap: 8px; height: 46px; padding: 0 12px 0 14px; border-radius: 12px; border: 1px solid var(--line-hi); background: var(--paper-raised); box-shadow: var(--shadow-sm); overflow: hidden; transition: border-color .2s, box-shadow .2s; }
#t09D .cbx:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgb(var(--accent-rgb) / .16); }
#t09D .cbx-in { flex: 1; min-width: 0; height: 100%; border: 0; background: transparent; font: inherit; font-size: 15px; font-weight: 500; color: var(--ink); padding: 0; }
#t09D .cbx-in:focus { outline: none; }
#t09D .cbx-in.rise { animation: cbRise var(--sp-snappy-d) var(--sp-snappy); }
@keyframes cbRise { from { transform: translateY(9px); opacity: 0; filter: blur(3px); } }
#t09D .ms-pop { position: absolute; z-index: 4; left: 0; right: 0; top: calc(100% + 6px); padding: 0; overflow: hidden; opacity: 0; visibility: hidden; transform: translateY(-4px) scale(.98); transform-origin: 50% 0; transition: opacity .15s var(--ease-out), transform .15s var(--ease-out), visibility 0s linear .15s; }
#t09D.is-open .ms-pop { opacity: 1; visibility: visible; transform: none; transition: opacity .18s var(--ease-out), transform var(--sp-snappy-d) var(--sp-snappy), visibility 0s; }
#t09D .cbx-box { overflow: hidden; }
#t09D .ms-o[hidden] { display: none; }
#t09D .ms-o mark { background: none; color: var(--accent-text); font-weight: 600; }
#t09D .cbx-none { margin: 0; padding: 12px 14px; font-size: 13.5px; color: var(--muted); }`,
      js: `var inp = $('.cbx-in', box), wrap = $('.ms-wrap', box), list = $('[role="listbox"]', box), bx = $('[data-box]', box), none = $('[data-none]', box), hl = $('.ms-hl', box), out = $('[data-out]', box), opts = $$('[role="option"]', list), A = ${AR}, sel = 1, act = -1, open = false, an = null;
var fee = TLb.roll($('[data-fee]', box), { value: A[1][1], fmt: function (n) { return 'KES ' + n; }, dur: 480, stagger: 30 });
function shown() { return opts.filter(function (o) { return !o.hidden; }); }
function mark(i, jump) { var s = shown(); opts.forEach(function (o) { o.removeAttribute('data-on'); }); if (!s.length) { act = -1; hl.style.opacity = 0; inp.removeAttribute('aria-activedescendant'); return; } act = Math.max(0, Math.min(s.length - 1, i)); var el = s[act]; el.setAttribute('data-on', ''); inp.setAttribute('aria-activedescendant', el.id);
  if (jump) hl.style.transition = 'none'; hl.style.opacity = 1; hl.style.transform = 'translateY(' + el.offsetTop + 'px)'; hl.style.height = el.offsetHeight + 'px'; if (jump) { hl.offsetWidth; hl.style.transition = ''; } }
function setOpen(v) { if (v === open) return; open = v; box.classList.toggle('is-open', v); inp.setAttribute('aria-expanded', String(v)); }
function filter(q) { var h0 = bx.offsetHeight; q = q.trim().toLowerCase(); var n = 0;
  opts.forEach(function (o, i) { var name = A[i][0], at = name.toLowerCase().indexOf(q), ok = !q || at >= 0; o.hidden = !ok; if (ok) n++; $('.ms-ol', o).innerHTML = q && ok ? name.slice(0, at) + '<mark>' + name.slice(at, at + q.length) + '</mark>' + name.slice(at + q.length) : name; });
  none.hidden = n > 0; none.textContent = 'No area called "' + q + '". We deliver to 8 areas.';
  if (open && moving()) { var h1 = bx.offsetHeight; if (an) an.cancel(); if (h0 !== h1) { var s = TLb.spring('soft'); an = bx.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: s.d, easing: s.e }); } } mark(0, true); }
function openAll() { filter(''); setOpen(true); mark(shown().indexOf(opts[sel]), true); }
function pick(i) { var from = sel; sel = i; opts.forEach(function (o, j) { o.setAttribute('aria-selected', String(j === i)); }); inp.value = A[i][0]; inp.classList.remove('rise'); if (moving()) { void inp.offsetWidth; inp.classList.add('rise'); }
  if (i !== from) fee.set(A[i][1], { dir: i > from ? 'up' : 'down' }); setOpen(false); out.innerHTML = 'Delivery to <b>' + A[i][0] + '</b>: KES ' + A[i][1] + '.'; }
function cancel() { setOpen(false); inp.value = A[sel][0]; }
inp.addEventListener('focus', function () { setTimeout(function () { inp.select(); }, 0); });
inp.addEventListener('click', function () { if (!open) openAll(); });
inp.addEventListener('input', function () { if (!open) setOpen(true); filter(inp.value); });
inp.addEventListener('keydown', function (e) { var s = shown();
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!open) { openAll(); return; } mark(act + (e.key === 'ArrowDown' ? 1 : -1)); }
  else if (e.key === 'Enter' && open && act >= 0) { e.preventDefault(); pick(opts.indexOf(s[act])); }
  else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); if (open) cancel(); else inp.value = ''; }
  else if (e.key === 'Tab' && open) cancel(); });
list.addEventListener('pointermove', function (e) { var t = e.target.closest && e.target.closest('[role="option"]'); if (t) { var j = shown().indexOf(t); if (j !== act) mark(j); } });
list.addEventListener('pointerdown', function (e) { e.preventDefault(); });
list.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[role="option"]'); if (t) pick(opts.indexOf(t)); });
document.addEventListener('pointerdown', function (e) { if (open && !wrap.contains(e.target)) cancel(); });`,
    },
  ],
};

/* ---------------- 10 Morphing buttons ---------------- */
const ACTS = [['phone', 'Call Otieno', 'Calling'], ['chat', 'Message', 'Sent'], ['link', 'Share link', 'Copied'], ['pin', 'Track', '3 min away']];
const morphbtn = {
  id: 'morphbtn', n: '10', name: 'Morphing buttons', h: 250,
  claim: 'A button can <em>change shape</em> to say what happened.',
  lead: 'These buttons grow and shrink into their next step instead of swapping in one frame. Press each one, and try them with Tab and Enter too.',
  ref: { ids: 'n29', text: 'The pay button that rolls: its words roll up to "Paying…", then a tick pops and draws in.' },
  noteHint: 'C\'s row with A\'s plain tick', moreHint: 'a Follow button that turns into Following',
  css: `#morphbtn .mb-bgw { position: absolute; left: 0; top: 0; bottom: 0; pointer-events: none; filter: drop-shadow(0 0 .6px var(--line-hi)) drop-shadow(0 1px 2px rgb(var(--ink-rgb) / .08)); }
#morphbtn .mb-bg { display: block; height: 100%; background: var(--paper-raised); transition: background-color .25s var(--ease-out); }
#morphbtn .mb-f { position: absolute; left: 0; top: 0; height: 100%; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; visibility: hidden; pointer-events: none; transition: visibility 0s linear .16s; }
#morphbtn .mb-f.on { visibility: visible; pointer-events: auto; transition: none; }
#morphbtn .mb-f > [data-p] { opacity: 0; transform: translateX(-5px); filter: blur(3px); transition: opacity .14s var(--ease-out), transform .2s var(--ease-out), filter .14s var(--ease-out); }
#morphbtn .mb-f.on > [data-p] { opacity: 1; transform: none; filter: none; transition: opacity .2s var(--ease-out), transform .3s var(--ease-out), filter .2s var(--ease-out); transition-delay: calc(var(--i, 0) * 55ms + 60ms); }
#morphbtn .mb-f .l-tick { width: 18px; height: 18px; flex-basis: 18px; }`,
  js: `/* a pill whose width morphs on a spring; only its clip moves, so the words never stretch */
TLb.mw = function (bg, o) { var W = 0, cur = 0;
  var s = TLb.sp(function (w) { cur = w; var c = Math.max(0, W - w); bg.style.clipPath = o.centre ? 'inset(0 ' + (c / 2).toFixed(2) + 'px round ' + o.r + 'px)' : 'inset(0 ' + c.toFixed(2) + 'px 0 0 round ' + o.r + 'px)'; }, { k: 330, c: 21, eps: .2 });
  return { size: function (w) { W = w; bg.style.width = w + 'px'; if (o.centre) { bg.parentNode.style.left = '50%'; bg.parentNode.style.marginLeft = (-w / 2) + 'px'; } s.jump(cur); },
    grow: function (w) { s.to(w, { k: 330, c: 21 }); }, shrink: function (w) { s.to(w, { k: 300, c: 34 }); }, jump: function (w) { s.jump(w); } }; };`,
  opts: [
    {
      k: 'B', name: 'A remove button that asks in place', line: 'For the rare action you cannot undo. The button grows sideways into "Remove it for good?" with Remove and Keep, each part arriving in reading order. A press in the first quarter second is ignored, so a double click cannot remove by mistake.',
      from: [arc('confirm-morph'), house('n29')], tryit: 'Press Remove card, then try to double-click straight through it.',
      needs: 'Script and a clip-path spring.', keys: 'Enter opens it and focus moves to Remove. Escape puts it back. Held keys do not repeat a press.', off: 'Each step shows at once, at its own width.', law: 'Fitts: the answer appears right where you pressed.',
      tags: ['motion:springy', 'speed:mid', 'open:inplace', 'feedback:clear', 'new:twist', 'look:ember'],
      html: `<div class="cf"><div class="cf-card" data-card><span class="cf-ic">${I.card}</span><span><b data-ct>Visa ending 4821</b><small data-cs>Expires 08/28. Used for PocketPay top-ups.</small></span></div>
<div class="cf-m" data-m><span class="mb-bgw"><span class="mb-bg" data-bg></span></span>
<div class="mb-f on" data-f="a"><button class="cf-ask" type="button" data-p data-ask>${I.trash}Remove card</button></div>
<div class="mb-f" data-f="q"><span class="cf-q" data-p style="--i:0">Remove it for good?</span><button class="cf-yes" type="button" data-p data-yes style="--i:1">Remove</button><button class="cf-no" type="button" data-p data-no style="--i:2">Keep</button></div>
<div class="mb-f" data-f="busy"><span class="l-spin" data-p></span><span data-p style="--i:1">Removing…</span></div>
<div class="mb-f" data-f="done"><span class="cf-tk" data-p data-tk>${TK0}</span><span data-p style="--i:1">Card removed</span></div></div>
<button class="l-btn sm cf-back" type="button" data-back hidden>Add the card back</button><p class="sr" aria-live="polite" data-live></p></div>`,
      css: `#t10B .cf { width: min(100%, 340px); display: grid; gap: 14px; justify-items: start; text-align: left; }
#t10B .cf-card { display: flex; align-items: center; gap: 12px; width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); transition: opacity .3s var(--ease-out); }
#t10B .cf-card.gone { opacity: .5; }
#t10B .cf-ic { width: 34px; height: 34px; flex: none; display: grid; place-items: center; border-radius: 9px; background: var(--paper-sunk); color: var(--ink-soft); }
#t10B .cf-ic svg { width: 18px; height: 18px; }
#t10B .cf-card b { display: block; font-size: 14.5px; color: var(--ink); }
#t10B .cf-card small { font-size: 12.5px; color: var(--muted); }
#t10B .cf-m { position: relative; height: 40px; max-width: 100%; }
#t10B .mb-bg { border-radius: 20px; }
#t10B .cf-m[data-at="q"] .mb-bg { background: color-mix(in srgb, var(--paper-raised) 88%, var(--accent)); }
#t10B .mb-f { padding: 0 4px; }
#t10B .cf-ask { display: inline-flex; align-items: center; gap: 7px; height: 32px; padding: 0 12px 0 10px; border-radius: 16px; font-size: 14px; font-weight: 600; color: var(--accent-text); transition: background-color .15s; }
#t10B .cf-ask svg { width: 15px; height: 15px; }
#t10B .cf-ask:hover { background: rgb(var(--accent-rgb) / .1); }
#t10B .cf-q { padding-left: 10px; font-size: 14px; font-weight: 500; color: var(--ink); }
#t10B .cf-yes, #t10B .cf-no { height: 32px; padding: 0 13px; border-radius: 16px; font-size: 13.5px; font-weight: 600; }
#t10B .cf-yes { background: var(--accent); color: var(--on-accent); }
#t10B .cf-no { color: var(--accent-text); }
#t10B .cf-no:hover { background: rgb(var(--accent-rgb) / .1); }
#t10B .cf-ask:active, #t10B .cf-yes:active, #t10B .cf-no:active { scale: .96; }
#t10B .cf-m button:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
#t10B [data-f="busy"], #t10B [data-f="done"] { padding: 0 14px 0 10px; font-size: 14px; font-weight: 500; color: var(--ink); }
#t10B .cf-tk { display: grid; }
#t10B .l-spin { color: var(--accent); }
@media (max-width: 400px) { #t10B .cf-q { padding-left: 6px; font-size: 13px; } #t10B .cf-yes, #t10B .cf-no { padding: 0 10px; } }`,
      js: `var m = $('[data-m]', box), F = {}, at = 'a', t0 = 0, rep = false, live = $('[data-live]', box), card = $('[data-card]', box), back = $('[data-back]', box), tk = $('[data-tk]', box);
$$('[data-f]', box).forEach(function (f) { F[f.getAttribute('data-f')] = f; });
var mw = TLb.mw($('[data-bg]', box), { r: 20 });
function wOf(k) { return F[k].offsetWidth; }
function size() { var MAX = Math.max.apply(null, Object.keys(F).map(wOf)); m.style.width = MAX + 'px'; mw.size(MAX); mw.jump(wOf(at)); }
function go(k, focus) { var grow = wOf(k) > wOf(at); Object.keys(F).forEach(function (n) { F[n].classList.toggle('on', n === k); F[n].inert = n !== k; }); at = k; m.setAttribute('data-at', k); if (grow) mw.grow(wOf(k)); else mw.shrink(wOf(k)); if (focus) { var b = $(focus, F[k]); if (b) b.focus({ preventScroll: true }); } }
size(); go('a'); TLb.fonts(size);
$('[data-ask]', box).addEventListener('click', function () { t0 = performance.now(); go('q', '[data-yes]'); live.textContent = 'Remove the card for good? Remove or Keep.'; });
box.addEventListener('keydown', function (e) { rep = e.repeat; if (rep && (e.key === 'Enter' || e.key === ' ')) e.preventDefault(); if (e.key === 'Escape' && at === 'q') { e.stopPropagation(); go('a', '[data-ask]'); live.textContent = 'Kept.'; } });
box.addEventListener('keyup', function () { rep = false; });
$('[data-yes]', box).addEventListener('click', function () { if (performance.now() - t0 < 280 || rep) return; go('busy'); live.textContent = 'Removing the card.';
  setTimeout(function () { tk.innerHTML = TICK; go('done'); card.classList.add('gone'); $('[data-ct]', box).textContent = 'No saved card'; $('[data-cs]', box).textContent = 'Add a card to top up faster.'; back.hidden = false; back.focus({ preventScroll: true }); live.textContent = 'Card removed.'; }, 1000); });
$('[data-no]', box).addEventListener('click', function () { go('a', '[data-ask]'); live.textContent = 'Kept.'; });
back.addEventListener('click', function () { card.classList.remove('gone'); $('[data-ct]', box).textContent = 'Visa ending 4821'; $('[data-cs]', box).textContent = 'Expires 08/28. Used for PocketPay top-ups.'; back.hidden = true; go('a', '[data-ask]'); live.textContent = 'Card added back.'; });
document.addEventListener('pointerdown', function (e) { if (at === 'q' && !m.contains(e.target)) go('a'); });`,
    },
    {
      k: 'A', name: 'A plain copy button', line: 'Press Copy and the icon fades into an orange tick and the word becomes "Copied". The button keeps its width, so nothing moves.',
      from: [arc('copy-button'), sh('button')], tryit: 'Press Copy, then press it again.',
      needs: 'A few lines of script.', keys: 'Tab to Copy, then Enter.', off: 'The tick and word swap at once.', law: 'Jakob: the copy button every docs page has.',
      tags: ['motion:some', 'speed:quick', 'feedback:clear', 'new:familiar', 'look:ember'], h: 210,
      html: `<div class="cp"><label class="l-lbl" for="t10A-u">Your PocketPay link</label><div class="cp-r"><input id="t10A-u" class="l-in" readonly value="pay.example.com/duka-fresh"><button class="l-btn cp-b" type="button" data-copy><span class="cp-i"><span class="cp-a">${I.copy}</span><span class="cp-d">${TK0}</span></span><span class="cp-w"><span class="cp-a">Copy</span><span class="cp-d" data-done>Copied</span><span class="cp-z" aria-hidden="true">Selected</span></span></button></div><p class="sr" aria-live="polite" data-live></p></div>`,
      css: `#t10A .cp { width: min(100%, 360px); text-align: left; }
#t10A .cp-r { display: flex; gap: 8px; }
#t10A .l-in { flex: 1; min-width: 0; font-family: var(--font-mono); font-size: 13px; color: var(--ink-soft); }
#t10A .cp-i, #t10A .cp-w { display: grid; }
#t10A .cp-i > *, #t10A .cp-w > * { grid-area: 1 / 1; display: grid; place-items: center start; transition: opacity .16s var(--ease-out) .1s; }
#t10A .cp-i > * { place-items: center; }
#t10A .cp-i .l-tick { width: 16px; height: 16px; flex-basis: 16px; }
#t10A .cp-z { visibility: hidden; }
#t10A .cp-d { opacity: 0; transition: opacity .1s var(--ease-out); }
#t10A .is-done .cp-d { opacity: 1; transition: opacity .16s var(--ease-out) .1s; }
#t10A .is-done .cp-a { opacity: 0; transition: opacity .1s var(--ease-out); }`,
      js: `var b = $('[data-copy]', box), inp = $('input', box), live = $('[data-live]', box), dn = $('[data-done]', box), t = 0;
function ok(w) { dn.textContent = w; b.classList.add('is-done'); live.textContent = w === 'Copied' ? 'Link copied.' : 'Link selected. Press Ctrl+C or ⌘C to copy.'; clearTimeout(t); t = setTimeout(function () { b.classList.remove('is-done'); }, 1800); }
b.addEventListener('click', function () { var fail = function () { inp.select(); ok('Selected'); }; if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(inp.value).then(function () { ok('Copied'); }, fail); else fail(); });`,
    },
    {
      k: 'C', name: 'A row of icons that open to show their name', line: 'Four round icon buttons. Point at one, or Tab to it, and it springs open to show its name while its neighbours slide aside. Press it and its icon turns into an orange tick.',
      kind: 'Mix', from: [arc('expanding-button-group'), house('n34')], tryit: 'Slide the pointer along the row, then press Share link.',
      needs: 'Script and CSS springs.', keys: 'Tab or the left and right arrows move along the row; the one with focus opens. Enter presses it.', off: 'Buttons open and close at once.', law: 'Fitts: small at rest, big when you aim at one.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'new:novel', 'look:ember'], h: 220,
      html: `<div class="xg"><p class="xg-k"><b>Order #4821 is on its way</b><span>Otieno will be there in about 3 minutes.</span></p><div class="xg-row" data-row role="toolbar" aria-label="Order actions">${ACTS.map(([ic, l, d], i) => `<span class="xg-w" data-w><button class="xg-b" type="button" data-b="${i}" aria-label="${l}"><span class="xg-i"><span class="xg-ic">${I[ic]}</span><span class="xg-ok">${TK0}</span></span><span class="xg-l" data-l data-a="${l}" data-d="${d}">${l}</span></button></span>`).join('')}</div><p class="sr" aria-live="polite" data-live></p></div>`,
      css: `#t10C .xg { display: grid; justify-items: center; gap: 16px; width: 100%; }
#t10C .xg-k { margin: 0; display: grid; gap: 2px; text-align: center; font-size: 14px; }
#t10C .xg-k b { color: var(--ink); } #t10C .xg-k span { font-size: 13px; color: var(--muted); }
#t10C .xg-row { position: relative; height: 44px; max-width: 100%; }
#t10C .xg-w { position: absolute; left: 0; top: 0; filter: drop-shadow(0 0 .6px var(--line-hi)) drop-shadow(0 1px 2px rgb(var(--ink-rgb) / .08)); transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#t10C .xg-b { position: relative; height: 44px; display: flex; align-items: center; padding: 0 16px 0 0; border-radius: 22px; background: var(--paper-raised); color: var(--ink-soft); font-size: 14px; font-weight: 500; white-space: nowrap; clip-path: inset(0 calc(100% - 44px) 0 0 round 22px); transition: clip-path .2s var(--ease-out), background-color .15s, color .15s; }
#t10C .xg-w.open .xg-b { clip-path: inset(0 0 0 0 round 22px); color: var(--ink); transition: clip-path var(--sp-snappy-d) var(--sp-snappy), background-color .15s, color .15s; }
#t10C .xg-b:focus-visible { outline: none; background: color-mix(in srgb, var(--paper-raised) 86%, var(--accent)); }
#t10C .xg-b:active .xg-i { scale: .86; }
#t10C .xg-i { width: 44px; height: 44px; flex: 0 0 44px; display: grid; place-items: center; transition: scale .12s var(--ease-out); }
#t10C .xg-i > * { grid-area: 1 / 1; display: grid; transition: opacity .16s, transform var(--sp-bouncy-d) var(--sp-bouncy); }
#t10C .xg-ic svg { width: 18px; height: 18px; }
#t10C .xg-ok { opacity: 0; transform: scale(.6); }
#t10C .xg-ok .l-tick { width: 20px; height: 20px; }
#t10C .is-done .xg-ok { opacity: 1; transform: none; }
#t10C .is-done .xg-ic { opacity: 0; transform: scale(.6); }
#t10C .xg-l { opacity: 0; transform: translateX(-8px); filter: blur(2px); transition: opacity .1s, transform .14s var(--ease-out), filter .1s; }
#t10C .xg-w.open .xg-l { opacity: 1; transform: none; filter: none; transition: opacity .2s .04s, transform var(--sp-snappy-d) var(--sp-snappy), filter .2s .04s; }`,
      js: `var row = $('[data-row]', box), W = $$('[data-w]', box), B = $$('[data-b]', box), live = $('[data-live]', box), GAP = 8, OW = [], at = -1, hov = -1;
function measure() { W.forEach(function (w, i) { var l = $('[data-l]', w); l.style.minWidth = ''; var a = l.offsetWidth; l.textContent = l.getAttribute('data-d'); var d = l.offsetWidth; l.textContent = l.getAttribute('data-a'); l.style.minWidth = Math.max(a, d) + 'px'; OW[i] = 44 + Math.max(a, d) + 16; B[i].style.width = OW[i] + 'px'; });
  row.style.width = (W.length * 44 + (W.length - 1) * GAP + Math.max.apply(null, OW) - 44) + 'px'; lay(); }
function lay() { var tot = 0; W.forEach(function (w, i) { tot += (i === at ? OW[i] : 44) + (i ? GAP : 0); }); var x = (row.offsetWidth - tot) / 2;
  W.forEach(function (w, i) { w.classList.toggle('open', i === at); w.style.transform = 'translateX(' + x.toFixed(1) + 'px)'; x += (i === at ? OW[i] : 44) + GAP; }); }
function open(i) { if (i === at) return; at = i; lay(); }
var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
W.forEach(function (w, i) {
  w.addEventListener('pointerenter', function () { if (fine) { hov = i; open(i); } });
  B[i].addEventListener('focus', function () { if (B[i].matches(':focus-visible')) open(i); });
  B[i].addEventListener('blur', function () { setTimeout(function () { if (!row.contains(document.activeElement)) open(hov); }, 0); });
  B[i].addEventListener('click', function () { open(i); var l = $('[data-l]', w); if (i === 2 && navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText('https://example.com/track/4821').catch(function () {});
    w.classList.add('is-done'); l.textContent = l.getAttribute('data-d'); live.textContent = ['Calling Otieno.', 'Message sent to Otieno.', 'Tracking link copied.', 'Otieno is 3 minutes away.'][i];
    clearTimeout(w._t); w._t = setTimeout(function () { w.classList.remove('is-done'); l.textContent = l.getAttribute('data-a'); }, 1800); });
  B[i].addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); B[(i + (e.key === 'ArrowRight' ? 1 : -1) + B.length) % B.length].focus(); } });
});
row.addEventListener('pointerleave', function () { hov = -1; var f = document.activeElement; open(row.contains(f) && f.matches(':focus-visible') ? B.indexOf(f) : -1); });
measure(); TLb.fonts(measure); new ResizeObserver(lay).observe(box);`,
    },
    {
      k: 'D', name: 'A pay button that folds into a circle', line: 'Your n29 pay button, pushed. Press it and it folds into an orange circle while it works. Then it opens into a paper pill with a tick and "Paid". After a moment it grows back, and only the letters that change rise in.',
      kind: 'Reference, pushed', from: [house('n29'), arc('action-swap'), arc('action-button')], tryit: 'Press Pay and watch the shape, then watch it come back.',
      needs: 'Script and a clip-path spring.', keys: 'Tab to Pay, then Enter.', off: 'Each step shows at once: Paying, then Paid.', law: 'Doherty: the button answers the moment you press.',
      tags: ['motion:springy', 'speed:mid', 'open:inplace', 'feedback:loud', 'new:twist', 'look:ember'], h: 220,
      html: `<div class="pb"><button class="pb-b" type="button" data-b><span class="mb-bgw"><span class="mb-bg" data-bg></span></span><span class="pb-c" data-c><span class="pb-tk" data-tk></span><span class="pb-l" data-l>Pay KES 4,200</span></span><span class="pb-sp" aria-hidden="true"><span class="l-spin"></span></span></button><p class="l-muted pb-m" data-msg aria-live="polite">Nothing paid yet.</p></div>`,
      css: `#t10D .pb { display: grid; justify-items: center; gap: 14px; }
#t10D .pb-b { position: relative; height: 46px; display: grid; place-items: center; border-radius: 23px; font-size: 15px; font-weight: 600; color: var(--on-accent); transition: color .25s; }
#t10D .pb-b:active .pb-c { scale: .96; }
#t10D .pb-b:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
#t10D .mb-bgw { filter: none; }
#t10D .mb-bg { background: var(--accent); }
#t10D .pb-b[data-at="done"] { color: var(--ink); }
#t10D .pb-b[data-at="done"] .mb-bgw { filter: drop-shadow(0 0 .6px var(--line-hi)) drop-shadow(0 1px 2px rgb(var(--ink-rgb) / .1)); }
#t10D .pb-b[data-at="done"] .mb-bg { background: var(--paper-raised); }
#t10D .pb-c { position: relative; display: inline-flex; align-items: center; gap: 8px; padding: 0 22px; white-space: nowrap; transition: opacity .16s var(--ease-out), filter .16s, scale .12s var(--ease-out); }
#t10D [data-at="busy"] .pb-c { opacity: 0; filter: blur(4px); }
#t10D .pb-tk { display: none; }
#t10D [data-at="done"] .pb-tk { display: grid; }
#t10D .pb-tk .l-tick { width: 20px; height: 20px; flex-basis: 20px; }
#t10D .pb-l .ch { display: inline-block; white-space: pre; }
#t10D .pb-l .ch.in { animation: pbIn .34s var(--ease-out) both; animation-delay: calc(var(--i) * 22ms); }
#t10D .pb-l .ch.out { animation: pbOut .14s var(--ease-out) forwards; }
@keyframes pbIn { from { opacity: 0; transform: translateY(7px); filter: blur(3px); } }
@keyframes pbOut { to { opacity: 0; transform: translateY(-6px); filter: blur(3px); } }
#t10D .pb-sp { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0; transform: scale(.7); transition: opacity .15s, transform .25s var(--ease-out); pointer-events: none; }
#t10D [data-at="busy"] .pb-sp { opacity: 1; transform: none; transition-delay: .12s; }
#t10D .pb-sp .l-spin { color: var(--on-accent); width: 18px; height: 18px; }
#t10D .pb-m { margin: 0; }`,
      js: `var b = $('[data-b]', box), c = $('[data-c]', box), l = $('[data-l]', box), tk = $('[data-tk]', box), msg = $('[data-msg]', box), busy = false, IDLE = 'Pay KES 4,200', DONE = 'Paid', wi = 0, wd = 0;
var mw = TLb.mw($('[data-bg]', box), { r: 23, centre: true });
function size() { if (busy) return; tk.innerHTML = TICK.replace(' draw', ''); b.setAttribute('data-at', 'done'); l.textContent = DONE; wd = c.offsetWidth; b.setAttribute('data-at', 'idle'); l.textContent = IDLE; wi = c.offsetWidth; var M = Math.max(wi, wd); b.style.width = M + 'px'; mw.size(M); mw.jump(wi); }
size(); TLb.fonts(size);
/* only the letters that differ leave and rise in; the rest stay put */
function letters(to, from) { if (!moving()) { l.textContent = to; return 0; } var p = 0; while (p < to.length && p < from.length && to[p] === from[p]) p++;
  var sp = function (s, cls) { return s.split('').map(function (ch, i) { return '<span class="ch ' + cls + '" style="--i:' + i + '">' + ch + '</span>'; }).join(''); };
  l.innerHTML = from.slice(0, p) + sp(from.slice(p), 'out'); setTimeout(function () { l.innerHTML = to.slice(0, p) + sp(to.slice(p), 'in'); setTimeout(function () { l.textContent = to; }, 600); }, 140); return 140; }
b.addEventListener('click', function () { if (busy) return; busy = true; b.setAttribute('data-at', 'busy'); b.setAttribute('aria-busy', 'true'); mw.shrink(46); msg.textContent = 'Paying…';
  setTimeout(function () { tk.innerHTML = TICK; l.textContent = DONE; b.removeAttribute('aria-busy'); b.setAttribute('data-at', 'done'); mw.grow(wd); msg.textContent = 'KES 4,200 paid to Duka Fresh.';
    setTimeout(function () { b.setAttribute('data-at', 'idle'); var d = letters(IDLE, DONE); setTimeout(function () { mw.grow(wi); busy = false; }, d); }, 2400); }, 1300); });`,
    },
  ],
};

export default [countdown, numfield, slider, morphsel, morphbtn];
