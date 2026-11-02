// Round 2, batch B: progress, alerts, pagination, tags.
import { sh, be, ez, radix, skill } from '../src-links.mjs';

const X = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

/* ---------------- 06 Progress ---------------- */
const STEPS = ['Checking 24 receipts', 'Adding up the totals', 'Writing the report', 'Done'];
const pgHtml = (inner) => `<div class="g06"><div class="g06-h"><b>October report</b><span class="l-muted" data-step aria-live="polite">Ready to start</span></div>${inner}<div class="g06-a"><button class="l-btn sm pri" type="button" data-go>Make the report</button></div></div>`;
const progress = {
  id: 'progress', n: '06', name: 'Progress', h: 250,
  claim: 'A wait feels shorter when you <em>see it move.</em>',
  lead: 'We make your October report from 24 receipts. It takes about four seconds. Press the button in each card and watch how it tells you where it is.',
  ref: null,
  noteHint: 'B\'s bar with C\'s step names', moreHint: 'progress for a file upload',
  css: `.g06 { width: min(100%, 340px); display: grid; gap: 12px; text-align: left; }
.g06-h { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; font-size: 14px; }
.g06-h .l-muted { font-size: 13px; }
.g06-a { display: flex; justify-content: flex-end; }`,
  js: `/* fake work: calls on(p, step) about 60 times a second for 4 s */
window.TLprog = function (box, on) { var go = $('[data-go]', box), st = $('[data-step]', box), S = ${JSON.stringify(STEPS)}, raf = null;
  function run() { cancelAnimationFrame(raf); go.disabled = true; var t0 = performance.now(), dur = moving() ? 4000 : 1200;
    (function f(t) { var p = Math.min(1, (t - t0) / dur), k = p < 1 ? Math.min(2, Math.floor(p * 3)) : 3; st.textContent = S[k] + (p < 1 ? '…' : '.'); on(p, k); if (p < 1) raf = requestAnimationFrame(f); else { go.disabled = false; go.textContent = 'Make it again'; } })(t0); }
  go.addEventListener('click', run); on(0, -1); };`,
  opts: [
    {
      k: 'B', name: 'A bar that springs, a number that counts', line: 'The bar fills on a spring and gives a small bounce at the end. The percent counts up beside it. When it is done, a tick draws in.',
      from: [be('progress'), skill('animate')], tryit: 'Press the button and watch the end.',
      needs: 'CSS springs and script.', keys: 'Normal button keys.', off: 'Fills fast with no bounce.', law: 'Doherty: you always see something happening.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: pgHtml('<div class="row"><div class="tr" role="progressbar" aria-label="Report" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-bar><i></i></div><span class="pc l-num" data-pc>0%</span><span class="dn" data-dn></span></div>'),
      css: `#t06B .row { display: flex; align-items: center; gap: 10px; }
#t06B .tr { flex: 1; height: 10px; border-radius: 10px; background: rgb(var(--ink-rgb) / .1); overflow: hidden; }
#t06B .tr i { display: block; height: 100%; width: 100%; border-radius: inherit; background: var(--accent); transform-origin: left; transform: scaleX(var(--p, 0)); transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#t06B .pc { width: 3.2em; text-align: right; font-variant-numeric: tabular-nums; }
#t06B .dn { width: 20px; height: 20px; display: grid; }
#t06B .dn .l-tick { width: 20px; height: 20px; }`,
      js: `var bar = $('[data-bar]', box), pc = $('[data-pc]', box), dn = $('[data-dn]', box);
TLprog(box, function (p, k) { var n = Math.round(p * 100); bar.style.setProperty('--p', p); bar.setAttribute('aria-valuenow', n); pc.textContent = n + '%'; dn.innerHTML = k === 3 ? TICK : ''; });`,
    },
    {
      k: 'A', name: 'A plain bar', line: 'The shadcn progress bar: a grey track that fills with orange, and the step name above it.',
      from: [sh('progress'), radix('progress')], tryit: 'Press the button.',
      needs: 'CSS only.', keys: 'Normal button keys.', off: 'Same.', law: 'Jakob: the bar everyone knows.',
      tags: ['motion:still', 'speed:quick', 'feedback:quiet', 'new:familiar', 'look:ember'],
      html: pgHtml('<div class="tr" role="progressbar" aria-label="Report" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-bar><i></i></div>'),
      css: `#t06A .tr { height: 6px; border-radius: 6px; background: rgb(var(--ink-rgb) / .1); overflow: hidden; }
#t06A .tr i { display: block; height: 100%; background: var(--accent); width: calc(var(--p, 0) * 100%); }`,
      js: `var bar = $('[data-bar]', box); TLprog(box, function (p) { bar.style.setProperty('--p', p); bar.setAttribute('aria-valuenow', Math.round(p * 100)); });`,
    },
    {
      k: 'C', name: 'A ring, with the steps listed beside it', line: 'A ring fills around the percent. Next to it, the three steps tick off one by one as each finishes.',
      from: [ez('progress-ring'), skill('animate')], tryit: 'Press the button and watch the list.',
      needs: 'CSS, an inline SVG and script.', keys: 'Normal button keys.', off: 'The ticks show without drawing.', law: 'Goal gradient: you see how close the end is.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'], h: 280,
      html: pgHtml(`<div class="rg"><div class="ring" role="progressbar" aria-label="Report" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-bar><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27"/><circle class="f" cx="32" cy="32" r="27" pathLength="1"/></svg><span class="l-num" data-pc>0%</span></div><ol>${STEPS.slice(0, 3).map((s) => `<li>${s}</li>`).join('')}</ol></div>`),
      css: `#t06C .rg { display: flex; align-items: center; gap: 18px; }
#t06C .ring { position: relative; width: 76px; height: 76px; flex: none; }
#t06C .ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
#t06C .ring circle { fill: none; stroke: rgb(var(--ink-rgb) / .1); stroke-width: 6; }
#t06C .ring .f { stroke: var(--accent); stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: calc(1 - var(--p, 0)); }
#t06C .ring span { position: absolute; inset: 0; display: grid; place-items: center; font-size: 15px; }
#t06C ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; font-size: 13.5px; color: var(--muted); }
#t06C li { display: flex; align-items: center; gap: 8px; }
#t06C li::before { content: ""; width: 16px; height: 16px; flex: none; box-sizing: border-box; border-radius: 50%; border: 1.5px solid var(--line-hi); }
#t06C li.now { color: var(--ink); font-weight: 500; }
#t06C li.now::before { border-color: var(--accent); border-right-color: transparent; animation: g06spin .8s linear infinite; }
#t06C li.ok { color: var(--ink-soft); }
#t06C li.ok::before { border: 0; background: var(--accent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M4.5 8.3 7 10.6l4.6-5' fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 14px no-repeat; animation: l-fadeup .25s var(--ease-out); }
@keyframes g06spin { to { transform: rotate(360deg); } }
html[data-motion="off"] #t06C li.now::before { animation: none; }`,
      js: `var bar = $('[data-bar]', box), pc = $('[data-pc]', box), li = $$('li', box);
TLprog(box, function (p, k) { var n = Math.round(p * 100); bar.style.setProperty('--p', p); bar.setAttribute('aria-valuenow', n); pc.textContent = n + '%'; li.forEach(function (l, i) { l.className = k < 0 ? '' : i < k || k === 3 ? 'ok' : i === k ? 'now' : ''; }); });`,
    },
    {
      k: 'D', name: 'A line of stops, like a parcel tracker', line: 'Three stops on a line, like tracking a parcel. The orange line runs from stop to stop; each stop pops when the line reaches it, and its name lights up.',
      kind: 'Mix', from: [be('stepper'), ['patterns/interactive-parts.md', null]], tryit: 'Press the button and watch each stop.',
      needs: 'CSS springs and script.', keys: 'Normal button keys.', off: 'The stops light with no pop.', law: 'Goal gradient: each stop is a small win.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'], h: 270,
      html: pgHtml(`<div class="trk" role="progressbar" aria-label="Report" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-bar><div class="ln"><i></i></div>${['Receipts', 'Totals', 'Report'].map((s, i) => `<div class="st" style="--x:${i * 50}%"><span class="dt"></span><span class="nm">${s}</span></div>`).join('')}</div>`),
      css: `#t06D .trk { position: relative; height: 54px; margin: 0 22px; }
#t06D .ln { position: absolute; left: 0; right: 0; top: 9px; height: 3px; border-radius: 3px; background: rgb(var(--ink-rgb) / .12); }
#t06D .ln i { display: block; height: 100%; border-radius: inherit; background: var(--accent); width: calc(var(--p, 0) * 100%); }
#t06D .st { position: absolute; left: var(--x); top: 0; transform: translateX(-50%); display: grid; justify-items: center; gap: 8px; }
#t06D .dt { width: 20px; height: 20px; box-sizing: border-box; border-radius: 50%; border: 2px solid var(--line-hi); background: var(--paper-raised); transition: transform var(--sp-bouncy-d) var(--sp-bouncy), background-color .2s, border-color .2s; }
#t06D .nm { font-size: 12.5px; color: var(--muted); white-space: nowrap; transition: color .2s; }
#t06D .st.on .dt { background: var(--accent); border-color: var(--accent); transform: scale(1.2); }
#t06D .st.on .nm { color: var(--ink); font-weight: 500; }`,
      js: `var bar = $('[data-bar]', box), st = $$('.st', box);
TLprog(box, function (p) { bar.style.setProperty('--p', p); bar.setAttribute('aria-valuenow', Math.round(p * 100)); st.forEach(function (s, i) { s.classList.toggle('on', p > 0 && p >= i / 2); }); });`,
    },
  ],
};

/* ---------------- 07 Alerts and banners ---------------- */
const alHtml = (inner) => `<div class="a07"><div class="a07-slot" data-slot>${inner}</div><div class="a07-page"><div class="a07-ln"></div><div class="a07-ln s"></div></div><button class="l-btn sm" type="button" data-again hidden>Show it again</button><p class="l-muted a07-msg" data-msg aria-live="polite"></p></div>`;
const banner = (extra = '', cls = '') => `<div class="a07-b ${cls}" role="status" data-b><svg class="ic" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9"/><path d="M10 5.5v5.5M10 14v.2"/></svg><div class="tx"><b>PocketPay is slow right now.</b><span>Payments may take up to 5 minutes to show.</span>${extra}</div><button class="l-ib a07-x" type="button" aria-label="Dismiss" data-x>${X}</button></div>`;
const alerts = {
  id: 'alerts', n: '07', name: 'Alerts and banners', h: 280,
  claim: 'A warning should <em>arrive, say it, and leave cleanly.</em>',
  lead: 'PocketPay is slow, and we tell the shop owner at the top of the page. Dismiss each banner and watch what the page below does.',
  ref: null,
  noteHint: 'B, but with C\'s retry button', moreHint: 'a red error banner too',
  css: `.a07 { width: min(100%, 380px); display: grid; gap: 10px; text-align: left; }
.a07-b { display: flex; align-items: flex-start; gap: 10px; padding: 12px; border-radius: 12px; border: 1px solid rgb(var(--accent-rgb) / .35); background: color-mix(in srgb, var(--accent) 7%, var(--paper-raised)); }
.a07-b .ic { width: 20px; height: 20px; flex: none; margin-top: 1px; }
.a07-b .ic circle { fill: var(--accent); }
.a07-b .ic path { stroke: var(--on-accent); stroke-width: 2; stroke-linecap: round; fill: none; }
.a07-b .tx { flex: 1; display: grid; gap: 2px; font-size: 13.5px; color: var(--ink-soft); }
.a07-b .tx b { color: var(--ink); font-weight: 600; }
.a07-x { width: 28px; height: 28px; flex: none; box-shadow: none; background: transparent; }
.a07-page { display: grid; gap: 8px; }
.a07-ln { height: 12px; border-radius: 6px; background: rgb(var(--ink-rgb) / .08); }
.a07-ln.s { width: 60%; }
.a07-msg { margin: 0; min-height: 1.4em; }
.a07 [data-again] { justify-self: start; }`,
  js: `/* hide(done) runs the option's own exit; show() brings it back */
window.TLalert = function (box, o) { o = o || {}; var slot = $('[data-slot]', box), b = $('[data-b]', box), ag = $('[data-again]', box);
  function hide(why) { var h0 = slot.offsetHeight; function fin() { b.hidden = true; ag.hidden = false; ag.focus(); if (o.after) o.after(why); }
    if (o.exit && moving()) o.exit(b, slot, h0, fin); else fin(); }
  function show() { ag.hidden = true; b.hidden = false; b.style.cssText = ''; slot.style.cssText = ''; if (o.enter && moving()) o.enter(b, slot); if (o.shown) o.shown(); }
  $('[data-x]', b).addEventListener('click', function () { hide('x'); }); ag.addEventListener('click', show); show(); return { hide: hide, b: b }; };`,
  opts: [
    {
      k: 'B', name: 'It drops in on a spring, the page closes the gap', line: 'The banner springs down from the top. When you dismiss it, it slides up and fades, and the page below glides up to fill the space instead of jumping.',
      from: [be('banner'), skill('animate'), ['DESIGN.md: closing boxes glide all the way', null]], tryit: 'Dismiss it and watch the grey lines. Then show it again.',
      needs: 'The Web Animations API.', keys: 'Tab to the close button, Enter dismisses.', off: 'Shows and hides at once.', law: 'Doherty: the page never jumps under you.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: alHtml(banner()),
      js: `TLalert(box, { enter: function (b) { b.animate([{ transform: 'translateY(-14px) scale(.97)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 490, easing: getComputedStyle(root).getPropertyValue('--sp-bouncy').trim() || 'ease-out' }); },
  exit: function (b, slot, h0, fin) { b.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-8px)' }], { duration: 180, fill: 'forwards' }).onfinish = function () { var a = slot.animate([{ height: h0 + 'px' }, { height: '0px' }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' }); a.onfinish = function () { b.getAnimations().forEach(function (x) { x.cancel(); }); fin(); }; }; } });`,
    },
    {
      k: 'A', name: 'A plain alert box', line: 'The shadcn alert: an icon, a bold line and a short line, in a soft orange box. Dismiss removes it at once.',
      from: [sh('alert')], tryit: 'Dismiss it.',
      needs: 'CSS only.', keys: 'Same as B.', off: 'Same.', law: 'Jakob: looks like every warning box.',
      tags: ['motion:still', 'speed:quick', 'feedback:clear', 'new:familiar', 'look:ember'],
      html: alHtml(banner()), js: `TLalert(box);`,
    },
    {
      k: 'C', name: 'It tries again by itself', line: 'The banner has a "Check now" button and counts down to an automatic check. When the check works, it turns into a quiet "Payments are back" line with a tick, then leaves.',
      from: [ez('alert-banner'), skill('animate')], tryit: 'Press Check now, or wait 8 seconds.',
      needs: 'Script and the Web Animations API.', keys: 'Tab to Check now or close.', off: 'Swaps with no fade.', law: 'Peak-end: it ends on good news.',
      tags: ['motion:some', 'speed:mid', 'feedback:loud', 'new:twist', 'look:ember'], h: 300,
      html: alHtml(banner('<span class="ac"><button class="l-btn sm" type="button" data-chk>Check now</button><span class="l-muted cd" data-cd></span></span>')),
      css: `#t07C .ac { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
#t07C .cd { font-size: 12.5px; font-variant-numeric: tabular-nums; }
#t07C .a07-b.ok { border-color: var(--line); background: var(--paper-raised); }
#t07C .a07-b.ok .ic circle { fill: var(--ink); }`,
      js: `var t = null, n = 8, chk = $('[data-chk]', box), cd = $('[data-cd]', box), api;
function tick() { cd.textContent = 'Checking again in ' + n + ' s'; if (n-- <= 0) ok(); else t = setTimeout(tick, 1000); }
function ok() { clearTimeout(t); var b = api.b, tx = $('.tx', b); b.classList.add('ok'); tx.innerHTML = '<b>Payments are back.</b><span>Everything paid in the last 5 minutes now shows.</span>'; if (moving()) tx.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260 }); setTimeout(function () { if (!b.hidden) api.hide('ok'); }, 2600); }
api = TLalert(box, { shown: function () { var b = $('[data-b]', box); if (b.classList.contains('ok')) { b.classList.remove('ok'); $('.tx', b).innerHTML = '<b>PocketPay is slow right now.</b><span>Payments may take up to 5 minutes to show.</span><span class="ac"><button class="l-btn sm" type="button" data-chk>Check now</button><span class="l-muted cd" data-cd></span></span>'; chk = $('[data-chk]', box); cd = $('[data-cd]', box); chk.addEventListener('click', ok); } n = 8; clearTimeout(t); cd.textContent = ''; var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); tick(); } }, { threshold: .6 }); io.observe(box); },
  exit: function (b, slot, h0, fin) { b.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 }).onfinish = fin; }, after: function () { clearTimeout(t); } });
chk.addEventListener('click', ok);`,
    },
    {
      k: 'D', name: 'It shrinks to a dot you can open again', line: 'Dismiss does not throw it away. The banner shrinks into a small orange dot by the page title, so you can open it again while PocketPay is still slow.',
      kind: 'Wild card', from: [be('dynamic-island'), skill('animate')], tryit: 'Dismiss it, then click the dot.',
      needs: 'The Web Animations API.', keys: 'Tab to the dot; Enter opens the banner again.', off: 'Swaps at once.', law: 'Recognition over recall: the warning is still one click away.',
      tags: ['motion:springy', 'speed:mid', 'open:inplace', 'new:novel', 'look:ember'], h: 300,
      html: `<div class="a07"><div class="hd"><b>Today's sales</b><button class="dot" type="button" aria-label="PocketPay is slow. Show the warning" data-dot hidden></button></div>${alHtml(banner()).replace('<div class="a07">', '<div class="a07 in">')}</div>`,
      css: `#t07D .hd { display: flex; align-items: center; gap: 8px; font-size: 15px; min-height: 24px; }
#t07D .a07.in { gap: 10px; }
#t07D [data-again] { display: none; }
#t07D .dot { width: 22px; height: 22px; border-radius: 50%; border: 0; padding: 0; background: var(--accent); position: relative; cursor: pointer; }
#t07D .dot::after { content: ""; position: absolute; inset: -4px; border-radius: 50%; border: 2px solid rgb(var(--accent-rgb) / .35); }`,
      js: `var dot = $('[data-dot]', box), api = TLalert(box, {
  exit: function (b, slot, h0, fin) { dot.hidden = false; var r = b.getBoundingClientRect(), d = dot.getBoundingClientRect(); dot.hidden = true; b.style.transformOrigin = '0 0';
    b.animate([{ transform: 'none', opacity: 1, borderRadius: '12px' }, { transform: 'translate(' + (d.left - r.left) + 'px,' + (d.top - r.top) + 'px) scale(' + (d.width / r.width) + ',' + (d.height / r.height) + ')', opacity: .4, borderRadius: '50%' }], { duration: 420, easing: 'cubic-bezier(.32,.72,0,1)' }).onfinish = fin;
    slot.animate([{ height: h0 + 'px' }, { height: '0px' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' }); },
  after: function () { dot.hidden = false; dot.focus(); if (moving()) dot.animate([{ transform: 'scale(.4)' }, { transform: 'scale(1)' }], { duration: 490, easing: getComputedStyle(root).getPropertyValue('--sp-bouncy').trim() || 'ease-out' }); },
  enter: function (b) { b.animate([{ opacity: 0, transform: 'translateY(-10px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' }); },
  shown: function () { dot.hidden = true; } });
dot.addEventListener('click', function () { $('[data-again]', box).click(); $('[data-x]', box).focus(); });`,
    },
  ],
};

/* ---------------- 08 Pagination ---------------- */
const NAMES = ['Amina Otieno', 'Brian Kiprop', 'Chebet Rono', 'David Mwangi', 'Esther Wanjiku', 'Faith Achieng', 'George Njoroge', 'Halima Hassan', 'Ian Kamau', 'Joy Muthoni', 'Kevin Odhiambo', 'Lucy Nyambura'];
const pager = {
  id: 'pager', n: '08', name: 'Pages of a list', h: 330,
  claim: 'Moving through a long list should <em>keep your place.</em>',
  lead: '48 orders, 4 to a page. Move through them in each card. Watch where your eyes have to go after each click.',
  ref: null,
  noteHint: 'B\'s pill, but C for phones', moreHint: 'a list that loads as you scroll',
  css: `.p09 { width: min(100%, 360px); display: grid; gap: 10px; text-align: left; }
.p09-l { list-style: none; margin: 0; padding: 0; border: 1px solid var(--line); border-radius: 12px; background: var(--paper-raised); overflow: hidden; }
.p09-l li { display: flex; justify-content: space-between; gap: 10px; padding: 9px 12px; font-size: 13.5px; border-top: 1px solid var(--line); }
.p09-l li:first-child { border-top: 0; }
.p09-l li .l-num { color: var(--ink-soft); }
.p09-n { display: flex; align-items: center; justify-content: center; gap: 4px; flex-wrap: wrap; }
.p09-n .pg { min-width: 32px; height: 32px; padding: 0 6px; border-radius: 8px; border: 0; background: transparent; font: 500 13.5px/1 var(--font-body); color: var(--ink-soft); cursor: pointer; }
.p09-n .pg[aria-current="page"] { color: var(--ink); font-weight: 600; }
.p09-n .pg:disabled { opacity: .35; cursor: default; }
.p09-n .pg svg { width: 16px; height: 16px; }
.p09-st { margin: 0; text-align: center; font-size: 12.5px; }`,
  js: `window.TLorders = function (from, n) { var N = ${JSON.stringify(NAMES)}, out = ''; for (var i = from; i < Math.min(48, from + n); i++) out += '<li><span>#' + (4848 - i) + ' · ' + N[i % 12] + '</span><span class="l-num">KES ' + TLmoney(((i * 7919) % 4200) + 300) + '</span></li>'; return out; };
/* numbered pager: pages 1..12 with gaps; on(p) after a change */
window.TLpager = function (box, o) { o = o || {}; var l = $('[data-list]', box), nv = $('[data-nav]', box), st = $('[data-st]', box), P = 1, L = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m10 3.5-4.5 4.5 4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>', R = L.replace('m10 3.5-4.5 4.5 4.5 4.5', 'm6 3.5 4.5 4.5-4.5 4.5');
  function nums() { var s = [1]; for (var i = Math.max(2, P - 1); i <= Math.min(11, P + 1); i++) s.push(i); s.push(12); return s.filter(function (v, i, a) { return a.indexOf(v) === i; }); }
  function draw(focus) { var h = '<button class="pg" type="button" aria-label="Previous page" data-p="' + (P - 1) + '"' + (P === 1 ? ' disabled' : '') + '>' + L + '</button>', last = 0;
    nums().forEach(function (n) { if (n - last > 1) h += '<span class="l-muted" aria-hidden="true">…</span>'; h += '<button class="pg" type="button" data-p="' + n + '"' + (n === P ? ' aria-current="page"' : '') + ' aria-label="Page ' + n + '">' + n + '</button>'; last = n; });
    h += '<button class="pg" type="button" aria-label="Next page" data-p="' + (P + 1) + '"' + (P === 12 ? ' disabled' : '') + '>' + R + '</button>'; nv.innerHTML = (o.pill ? '<span class="pill" aria-hidden="true"></span>' : '') + h;
    var f = focus && ($('[aria-label="' + focus + '"]:not(:disabled)', nv) || $('[aria-current]', nv)); if (f) f.focus(); if (o.drawn) o.drawn(nv); }
  function go(p, how) { var old = P; P = Math.max(1, Math.min(12, p)); l.innerHTML = TLorders((P - 1) * 4, 4); st.textContent = 'Orders ' + ((P - 1) * 4 + 1) + ' to ' + P * 4 + ' of 48'; draw(how); if (o.on) o.on(P, old); }
  nv.addEventListener('click', function (e) { var b = e.target.closest('[data-p]'); if (b && !b.disabled) go(+b.getAttribute('data-p'), b.getAttribute('aria-label')); });
  go(1); return { go: go }; };`,
  opts: [
    {
      k: 'B', name: 'A pill that slides to the page', line: 'Page numbers with a soft pill behind the one you are on. The pill springs across to the new page, and the rows slide in from the side you moved to.',
      from: [be('pagination'), ez('animated-pagination')], tryit: 'Click page 3, then the arrows.',
      needs: 'CSS springs and the Web Animations API.', keys: 'Tab to a page and press Enter.', off: 'The pill and rows jump.', law: 'Fitts: the buttons stay in the same place.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'new:twist', 'look:ember'],
      html: `<nav class="p09" aria-label="Orders, pill pages"><ul class="p09-l" data-list></ul><div class="p09-n" data-nav></div><p class="l-muted p09-st" data-st aria-live="polite"></p></nav>`,
      css: `#t08B .p09-n { position: relative; }
#t08B .pg { position: relative; z-index: 1; }
#t08B .pill { position: absolute; z-index: 0; left: 0; top: 0; height: 32px; border-radius: 8px; background: var(--paper-raised); box-shadow: 0 0 0 1px var(--line-hi), var(--shadow-sm); transition: transform var(--sp-bouncy-d) var(--sp-bouncy), width .2s; }`,
      js: `var px = null; TLpager(box, { pill: true, drawn: function (nv) { var c = $('[aria-current]', nv), p = $('.pill', nv), x = c.offsetLeft, y = c.offsetTop; p.style.width = c.offsetWidth + 'px';
    if (px !== null && moving()) { p.style.transition = 'none'; p.style.transform = 'translate(' + px[0] + 'px,' + px[1] + 'px)'; p.offsetWidth; p.style.transition = ''; } p.style.transform = 'translate(' + x + 'px,' + y + 'px)'; px = [x, y]; },
  on: function (P, old) { if (!moving() || P === old) return; $('[data-list]', box).animate([{ opacity: 0, transform: 'translateX(' + (P > old ? 16 : -16) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' }); } });`,
    },
    {
      k: 'A', name: 'Plain page numbers', line: 'The shadcn pagination: arrows, numbers and gaps. The page you are on is bold. The rows swap at once.',
      from: [sh('pagination')], tryit: 'Click through a few pages.',
      needs: 'Script only.', keys: 'Same as B.', off: 'Same.', law: 'Jakob: works like every list of pages.',
      tags: ['motion:still', 'speed:quick', 'new:familiar', 'look:ember'],
      html: `<nav class="p09" aria-label="Orders, plain pages"><ul class="p09-l" data-list></ul><div class="p09-n" data-nav></div><p class="l-muted p09-st" data-st aria-live="polite"></p></nav>`,
      css: `#t08A .pg[aria-current="page"] { box-shadow: inset 0 0 0 1px var(--line-hi); background: var(--paper-raised); }`,
      js: `TLpager(box);`,
    },
    {
      k: 'C', name: '"Show more" adds rows under the old ones', line: 'No pages. A button at the bottom adds 4 more orders. The new rows rise in one by one, and the list keeps what you already saw.',
      from: [ez('load-more'), skill('animate')], tryit: 'Press Show more twice.',
      needs: 'Script and CSS.', keys: 'Tab to Show more, Enter adds. Focus moves to the first new row.', off: 'Rows appear at once.', law: 'Recognition over recall: the old rows stay on screen.',
      tags: ['motion:some', 'speed:mid', 'new:familiar', 'look:ember'], h: 380,
      html: `<div class="p09"><ul class="p09-l sc" data-list tabindex="-1" aria-label="Orders"></ul><button class="l-btn" type="button" data-more>Show 4 more</button><p class="l-muted p09-st" data-st aria-live="polite"></p></div>`,
      css: `#t08C .sc { max-height: 230px; overflow: auto; }
#t08C li.new { animation: l-fadeup .32s var(--ease-out) both; animation-delay: calc(var(--i) * 50ms); }
#t08C li:focus { outline: 2px solid var(--accent); outline-offset: -2px; }`,
      js: `var l = $('[data-list]', box), mb = $('[data-more]', box), st = $('[data-st]', box), n = 0;
function more(f) { var d = document.createElement('ul'); d.innerHTML = TLorders(n, 4); var first = null; $$('li', d).forEach(function (li, i) { li.className = f ? '' : 'new'; li.style.setProperty('--i', i); li.tabIndex = -1; l.appendChild(li); first = first || li; }); n += 4; st.textContent = 'Showing ' + n + ' of 48 orders'; if (n >= 48) mb.hidden = true; if (!f) { first.focus({ preventScroll: true }); first.scrollIntoView({ block: 'nearest', behavior: moving() ? 'smooth' : 'auto' }); } }
mb.addEventListener('click', function () { more(false); }); more(true);`,
    },
    {
      k: 'D', name: '"Page 3 of 12" with a box to jump', line: 'Two arrows and a small box with the page number. Type a page and press Enter to jump. The number in the box rolls to the new page.',
      kind: 'Mix', from: [ez('pagination'), ['Linear issue paging', null]], tryit: 'Type 9 in the box and press Enter.',
      needs: 'Script and the Web Animations API.', keys: 'Arrows go back and forward; the box takes a number.', off: 'The number does not roll.', law: 'Hick: two buttons and one box, no matter how many pages.',
      tags: ['motion:some', 'speed:mid', 'density:compact', 'new:twist', 'look:ember'],
      html: `<nav class="p09" aria-label="Orders, page box"><ul class="p09-l" data-list></ul><div class="p09-n jm"><button class="pg" type="button" aria-label="Previous page" data-prev><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m10 3.5-4.5 4.5 4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button><label>Page <input class="l-in" type="text" inputmode="numeric" value="1" aria-label="Page number, 1 to 12" data-in> of 12</label><button class="pg" type="button" aria-label="Next page" data-next><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m6 3.5 4.5 4.5-4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><p class="l-muted p09-st" data-st aria-live="polite"></p></nav>`,
      css: `#t08D .jm { gap: 10px; font-size: 13.5px; color: var(--ink-soft); }
#t08D .jm label { display: inline-flex; align-items: center; gap: 6px; }
#t08D .jm .l-in { width: 44px; height: 32px; padding: 0; text-align: center; font-variant-numeric: tabular-nums; }`,
      js: `var l = $('[data-list]', box), inp = $('[data-in]', box), st = $('[data-st]', box), pv = $('[data-prev]', box), nx = $('[data-next]', box), P = 1;
function go(p) { p = Math.max(1, Math.min(12, p || P)); var old = P; P = p; inp.value = P; l.innerHTML = TLorders((P - 1) * 4, 4); st.textContent = 'Orders ' + ((P - 1) * 4 + 1) + ' to ' + P * 4 + ' of 48'; pv.disabled = P === 1; nx.disabled = P === 12;
  if (moving() && old !== P) { var d = P > old ? 1 : -1; inp.animate([{ transform: 'translateY(' + (d * 8) + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' }); l.animate([{ opacity: .3 }, { opacity: 1 }], { duration: 220 }); } }
pv.addEventListener('click', function () { go(P - 1); }); nx.addEventListener('click', function () { go(P + 1); });
inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); go(parseInt(inp.value, 10)); inp.select(); } });
inp.addEventListener('blur', function () { go(parseInt(inp.value, 10)); }); go(1);`,
    },
  ],
};

/* ---------------- 09 Tags ---------------- */
const SUG = ['Fruit', 'Vegetables', 'Dairy', 'Bakery', 'Drinks', 'Cleaning', 'Snacks', 'Meat'];
const tgHtml = (id, list = '') => `<div class="t09"><label class="l-lbl" for="${id}-in">Shop categories</label><div class="t09-f" data-f><ul class="t09-c" data-chips aria-label="Chosen categories"></ul><input class="t09-in" id="${id}-in" type="text" autocomplete="off" placeholder="Type and press Enter" data-in${list ? ` role="combobox" aria-expanded="false" aria-controls="${id}-ls" aria-autocomplete="list"` : ''}></div>${list ? `<ul class="l-panel t09-ls" id="${id}-ls" role="listbox" aria-label="Suggestions" data-ls hidden></ul>` : ''}<p class="l-muted t09-msg" data-msg aria-live="polite"></p></div>`;
const tags = {
  id: 'tags', n: '09', name: 'Tags you type', h: 260,
  claim: 'Adding and removing tags should <em>feel like handling cards.</em>',
  lead: 'What does your shop sell? Type a category and press Enter, or press Backspace in the empty box to remove the last one.',
  ref: null,
  noteHint: 'B\'s spring with C\'s suggestions', moreHint: 'tags with colours',
  css: `.t09 { position: relative; width: min(100%, 360px); text-align: left; }
.t09-f { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-height: 44px; padding: 6px 8px; border-radius: 10px; border: 1px solid var(--line-hi); background: var(--paper-raised); cursor: text; }
.t09-f:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgb(var(--accent-rgb) / .15); }
.t09-c { display: contents; list-style: none; }
.t09-c li { display: inline-flex; align-items: center; gap: 2px; height: 28px; padding: 0 2px 0 10px; border-radius: 999px; background: rgb(var(--ink-rgb) / .07); font-size: 13px; color: var(--ink); }
.t09-c li button { width: 22px; height: 22px; display: grid; place-items: center; border: 0; border-radius: 50%; background: transparent; color: var(--muted); cursor: pointer; padding: 0; }
.t09-c li button:hover { background: rgb(var(--ink-rgb) / .1); color: var(--ink); }
.t09-c li button svg { width: 12px; height: 12px; }
.t09-in { flex: 1; min-width: 110px; height: 30px; border: 0; outline: 0; background: transparent; font: inherit; font-size: 14px; color: var(--ink); }
.t09-msg { margin: 8px 0 0; min-height: 1.4em; font-size: 13px; }`,
  js: `window.TLtags = function (box, o) { o = o || {}; var ul = $('[data-chips]', box), inp = $('[data-in]', box), msg = $('[data-msg]', box), f = $('[data-f]', box), T = ['Fruit', 'Dairy'];
  function li(t) { var e = document.createElement('li'); e.innerHTML = '<span></span><button type="button">${X.replace(/"/g, '\\"')}</button>'; e.firstChild.textContent = t; e.lastChild.setAttribute('aria-label', 'Remove ' + t); e.lastChild.addEventListener('click', function () { rm(t, true); }); return e; }
  function add(t) { t = t.trim().replace(/^./, function (c) { return c.toUpperCase(); }); if (!t) return false; if (T.indexOf(t) > -1) { msg.textContent = t + ' is already there.'; var d = $$('li', ul)[T.indexOf(t)]; if (o.dup) o.dup(d); return false; } T.push(t); var e = li(t); ul.appendChild(e); if (o.added) o.added(e); msg.textContent = t + ' added. ' + T.length + ' categories.'; return true; }
  function rm(t, fromBtn) { var i = T.indexOf(t); if (i < 0) return; var e = $$('li', ul)[i]; T.splice(i, 1); function done() { e.remove(); } if (o.removed && moving()) o.removed(e, done); else done(); msg.textContent = t + ' removed. ' + T.length + ' categories.'; if (fromBtn) inp.focus(); if (o.change) o.change(T); }
  T.forEach(function (t) { ul.appendChild(li(t)); });
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ',') { if (o.enter && o.enter(e)) return; e.preventDefault(); if (add(inp.value)) { inp.value = ''; if (o.change) o.change(T); } } else if (e.key === 'Backspace' && !inp.value && T.length) rm(T[T.length - 1]); });
  f.addEventListener('click', function (e) { if (e.target === f) inp.focus(); });
  return { add: add, T: T, inp: inp }; };`,
  opts: [
    {
      k: 'B', name: 'Tags pop in on a spring, the rest make room', line: 'A new tag springs in from small. Removing one squeezes it away while the tags after it slide over to close the gap. Typing one you already have shakes the old one.',
      from: [be('tag-input'), skill('animate')], tryit: 'Add "Drinks", then type "Fruit" again, then remove Dairy.',
      needs: 'CSS springs and the Web Animations API.', keys: 'Enter adds, Backspace in the empty box removes the last.', off: 'Tags appear and go at once.', law: 'Doherty: each key gives a reaction you can see.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: tgHtml('t09B'),
      js: `function flip(run) { var ls = $$('li', box), a = ls.map(function (l) { return l.getBoundingClientRect(); }); run(); ls.forEach(function (l, i) { if (!l.isConnected) return; var b = l.getBoundingClientRect(), dx = a[i].left - b.left, dy = a[i].top - b.top; if (dx || dy) l.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 370, easing: getComputedStyle(root).getPropertyValue('--sp-snappy').trim() || 'ease-out' }); }); }
TLtags(box, { added: function (e) { if (moving()) e.animate([{ transform: 'scale(.5)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 490, easing: getComputedStyle(root).getPropertyValue('--sp-bouncy').trim() || 'ease-out' }); },
  removed: function (e, done) { e.animate([{ transform: 'none', opacity: 1 }, { transform: 'scale(.6)', opacity: 0 }], { duration: 160, easing: 'ease-in' }).onfinish = function () { flip(done); }; },
  dup: function (d) { if (moving()) d.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-2px)' }, { transform: 'none' }], { duration: 360 }); } });`,
    },
    {
      k: 'A', name: 'Plain tags in a box', line: 'Type and press Enter to add, click the cross to remove. Nothing moves.',
      from: [sh('badge'), ['shadcn tag input pattern', 'https://ui.shadcn.com/docs/components/input']], tryit: 'Add two tags, then remove one.',
      needs: 'Script only.', keys: 'Same as B.', off: 'Same.', law: 'Jakob: the usual tag box.',
      tags: ['motion:still', 'speed:quick', 'new:familiar', 'look:ember'],
      html: tgHtml('t09A'), js: `TLtags(box);`,
    },
    {
      k: 'C', name: 'Suggestions as you type', line: 'Start typing and a list of matching categories opens under the box. Arrow down to one and press Enter. The matching letters are bold.',
      from: [ez('tag-input'), radix('combobox')], tryit: 'Type "d", arrow down, press Enter.',
      needs: 'Script.', keys: 'Arrows move in the list, Enter picks, Escape closes it.', off: 'The list shows at once.', law: 'Recognition over recall: pick a word instead of remembering it.',
      tags: ['motion:some', 'speed:mid', 'open:trigger', 'new:familiar', 'look:ember'], h: 320,
      html: tgHtml('t09C', true),
      css: `#t09C .t09-ls { position: absolute; left: 0; right: 0; top: 76px; z-index: 5; margin: 0; padding: 4px; list-style: none; max-height: 170px; overflow: auto; animation: l-fadeup .18s var(--ease-out); }
#t09C .t09-ls li { padding: 7px 10px; border-radius: 7px; font-size: 13.5px; color: var(--ink-soft); cursor: pointer; }
#t09C .t09-ls li b { color: var(--ink); }
#t09C .t09-ls li[aria-selected="true"] { background: rgb(var(--ink-rgb) / .07); color: var(--ink); }`,
      js: `var ls = $('[data-ls]', box), at = -1, M = [], api = TLtags(box, { enter: function (e) { if (at > -1 && !ls.hidden) { e.preventDefault(); pick(M[at]); return true; } }, change: function () { fill(); } }), inp = api.inp;
function fill() { var q = inp.value.trim().toLowerCase(); M = q ? ${JSON.stringify(SUG)}.filter(function (s) { return s.toLowerCase().indexOf(q) > -1 && api.T.indexOf(s) < 0; }) : []; at = M.length ? 0 : -1;
  ls.innerHTML = M.map(function (s, i) { var k = s.toLowerCase().indexOf(q); return '<li role="option" id="t09C-o' + i + '" aria-selected="' + (i === at) + '">' + s.slice(0, k) + '<b>' + s.slice(k, k + q.length) + '</b>' + s.slice(k + q.length) + '</li>'; }).join('');
  ls.hidden = !M.length; inp.setAttribute('aria-expanded', String(!ls.hidden)); mark(); }
function mark() { $$('li', ls).forEach(function (l, i) { l.setAttribute('aria-selected', String(i === at)); }); if (at > -1) inp.setAttribute('aria-activedescendant', 't09C-o' + at); else inp.removeAttribute('aria-activedescendant'); }
function pick(s) { api.add(s); inp.value = ''; fill(); inp.focus(); }
inp.addEventListener('input', fill);
inp.addEventListener('keydown', function (e) { if (ls.hidden) return; if (e.key === 'ArrowDown') { e.preventDefault(); at = (at + 1) % M.length; mark(); } else if (e.key === 'ArrowUp') { e.preventDefault(); at = (at - 1 + M.length) % M.length; mark(); } else if (e.key === 'Escape') { ls.hidden = true; inp.setAttribute('aria-expanded', 'false'); } });
ls.addEventListener('mousedown', function (e) { var l = e.target.closest('li'); if (l) { e.preventDefault(); pick(M[$$('li', ls).indexOf(l)]); } });
inp.addEventListener('blur', function () { setTimeout(function () { ls.hidden = true; inp.setAttribute('aria-expanded', 'false'); }, 100); });`,
    },
    {
      k: 'D', name: 'Filter chips with counts', line: 'Not typed: all the categories are chips with how many products each has. Tap to turn one on; it fills with ink, a tick slides in, and the total at the bottom counts to the new number.',
      kind: 'Mix', from: [be('chips'), ['DESIGN.md: numbers count up', null]], tryit: 'Turn on Drinks and Snacks.',
      needs: 'CSS springs and script.', keys: 'Tab to a chip, Space or Enter turns it on or off.', off: 'Tick and count do not move.', law: 'Recognition over recall: every choice is on screen.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: `<div class="t09"><p class="l-lbl" id="t09D-l">Shop categories</p><div class="fc" role="group" aria-labelledby="t09D-l">${SUG.map((s, i) => `<button type="button" class="ch" aria-pressed="${i === 0 || i === 2}" data-n="${[42, 65, 18, 23, 51, 12, 37, 9][i]}"><svg class="tk" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.3 6.5 11l6-6.5"/></svg>${s}<span class="l-num">${[42, 65, 18, 23, 51, 12, 37, 9][i]}</span></button>`).join('')}</div><p class="l-muted t09-msg" aria-live="polite"><b class="l-num" data-tot>60</b> products in your shop</p></div>`,
      css: `#t09D .fc { display: flex; flex-wrap: wrap; gap: 6px; }
#t09D .ch { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; border-radius: 999px; border: 1px solid var(--line-hi); background: var(--paper-raised); font: 500 13px/1 var(--font-body); color: var(--ink-soft); cursor: pointer; transition: background-color .2s, color .2s, border-color .2s; }
#t09D .ch .l-num { font-size: 12px; color: var(--muted); }
#t09D .ch .tk { width: 0; height: 14px; overflow: visible; transition: width var(--sp-bouncy-d) var(--sp-bouncy); margin-right: -6px; }
#t09D .ch .tk path { fill: none; stroke: var(--accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 14; stroke-dashoffset: 14; transition: stroke-dashoffset .3s var(--ease-out) .08s; }
#t09D .ch[aria-pressed="true"] { background: var(--ink); color: var(--paper); border-color: var(--ink); }
#t09D .ch[aria-pressed="true"] .l-num { color: rgb(var(--paper-rgb, 239 242 241) / .7); color: color-mix(in srgb, var(--paper) 70%, transparent); }
#t09D .ch[aria-pressed="true"] .tk { width: 14px; margin-right: 0; }
#t09D .ch[aria-pressed="true"] .tk path { stroke-dashoffset: 0; }
#t09D .t09-msg b { color: var(--ink); font-size: 15px; }`,
      js: `var tot = $('[data-tot]', box), shown = 60, an = null;
function sum() { return $$('.ch', box).reduce(function (a, c) { return a + (c.getAttribute('aria-pressed') === 'true' ? +c.getAttribute('data-n') : 0); }, 0); }
$$('.ch', box).forEach(function (c) { c.addEventListener('click', function () { c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true')); var to = sum();
  if (!moving()) { shown = to; tot.textContent = to; return; } cancelAnimationFrame(an); var from = shown, t0 = performance.now(); (function f(t) { var k = Math.min(1, (t - t0) / 350); shown = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); tot.textContent = shown; if (k < 1) an = requestAnimationFrame(f); })(t0); }); });`,
    },
  ],
};

export default [progress, alerts, pager, tags];
