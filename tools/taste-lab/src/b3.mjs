// Batch 3: modal, drawer, toast, data table.
import { sh, be, ez, radix, house, skill } from './src-links.mjs';

const X = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

/* ---------------- 09 Modal ---------------- */
const roles = (id) => `<div class="m09-roles" role="radiogroup" aria-label="Role">${['Cashier', 'Stock', 'Manager'].map((r, i) => `<button type="button" role="radio" aria-checked="${i === 0}" tabindex="${i ? -1 : 0}">${r}</button>`).join('')}</div>`;
const dlgBody = (id) => `<h3 class="m09-h" id="${id}-h">Invite a teammate</h3><p class="l-muted m09-sub">They get an SMS and an email with a link.</p>
<div class="m09-f"><label class="l-lbl" for="${id}-e">Email</label><input class="l-in" id="${id}-e" type="email" autocomplete="off" placeholder="brian@example.com" data-email><p class="l-err" data-err hidden></p></div>
<div class="m09-f"><span class="l-lbl">Role</span>${roles(id)}</div>
<div class="m09-act"><button class="l-btn ghost" type="button" data-cancel>Cancel</button><button class="l-btn pri" type="button" data-send>Send invite</button></div>`;
const modalHtml = (id, cls = '', inner = null) => `<div class="m09-page"><p class="l-muted">Team: 3 people</p><button class="l-btn" type="button" data-tr aria-haspopup="dialog">Invite teammate</button><p class="m09-msg" data-msg aria-live="polite"></p></div><div class="l-scrim" data-scrim></div><div class="m09 ${cls}" role="dialog" aria-modal="true" aria-labelledby="${id}-h" data-dlg><button class="l-ib m09-x" type="button" aria-label="Close" data-cancel>${X}</button>${inner || dlgBody(id)}</div>`;
const modal = {
  id: 'modal', n: '09', name: 'Modal', h: 380,
  claim: 'A modal should open <em>from where you asked</em>, and close the same way.',
  lead: 'Invite a teammate in a small window. Open it, try Send with the box empty, then fill it in. Escape, the dim area, Cancel and the cross all close it.',
  ref: null,
  noteHint: 'C\'s opening with A\'s speed', moreHint: 'a modal with steps',
  css: `.m09-page { display: grid; justify-items: center; gap: 10px; text-align: center; }
.m09-page .l-muted { margin: 0; }
.m09-msg { margin: 0; min-height: 22px; display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--ink-soft); }
.m09 { position: absolute; inset: 0; margin: auto; z-index: 6; width: min(330px, calc(100% - 24px)); height: fit-content; padding: 20px; border-radius: 14px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-lg); text-align: left; visibility: hidden; opacity: 0; transition: opacity .15s var(--ease-out), transform .15s var(--ease-out), visibility 0s linear .15s; }
.m09.is-open { visibility: visible; opacity: 1; transform: none; transition: opacity .2s var(--ease-out), transform .25s var(--ease-out), visibility 0s; }
.m09-x { position: absolute; right: 10px; top: 10px; width: 32px; height: 32px; box-shadow: none; border-color: transparent; background: transparent; }
.m09-h { margin: 0; font-size: 18px; }
.m09-sub { margin: 2px 0 14px; }
.m09-f { margin-bottom: 12px; }
.m09-roles { display: flex; gap: 2px; padding: 3px; border-radius: 10px; background: rgb(var(--ink-rgb) / .07); }
.m09-roles button { flex: 1; height: 32px; border-radius: 7px; font-size: 13.5px; font-weight: 500; color: var(--muted); }
.m09-roles [aria-checked="true"] { background: var(--paper-raised); color: var(--ink); box-shadow: 0 1px 2px rgb(0 0 0 / .1), 0 0 0 1px var(--line); }
.m09-act { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }`,
  js: `window.TLmodal = function (box, o) {
  o = o || {}; var tr = $('[data-tr]', box), dlg = $('[data-dlg]', box), sc = $('[data-scrim]', box), msg = $('[data-msg]', box);
  var p = pop(tr, dlg, { scrim: sc, trap: true, focus: o.focus || '[data-email]', onOpen: o.onOpen, onClose: o.onClose });
  $$('[data-cancel]', dlg).forEach(function (b) { b.addEventListener('click', function () { p.set(false); }); });
  var rg = $('[role="radiogroup"]', dlg); if (rg) { var rs = $$('[role="radio"]', rg); function pick(r, f) { rs.forEach(function (x) { x.setAttribute('aria-checked', String(x === r)); x.tabIndex = x === r ? 0 : -1; }); if (f) r.focus(); }
    rs.forEach(function (r, i) { r.addEventListener('click', function () { pick(r); }); r.addEventListener('keydown', function (e) { var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0; if (d) { e.preventDefault(); pick(rs[(i + d + rs.length) % rs.length], true); } }); }); }
  function role() { var r = $('[aria-checked="true"]', dlg); return r ? r.textContent.toLowerCase() : 'cashier'; }
  function check() { var e = $('[data-email]', dlg), err = $('[data-err]', dlg), v = e.value.trim(); if (/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(v)) { err.hidden = true; e.removeAttribute('aria-invalid'); return v; } err.hidden = false; err.innerHTML = '<svg class="l-x" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5"/></svg>Enter an email like brian@example.com.'; e.setAttribute('aria-invalid', 'true'); e.focus(); return ''; }
  var send = $('[data-send]', dlg); if (send && !o.noSend) send.addEventListener('click', function () { var v = check(); if (!v) return; p.set(false); msg.innerHTML = TICK + 'Invite sent to ' + v.replace(/[<>&"]/g, '') + ' as ' + role() + '.'; $('[data-email]', dlg).value = ''; });
  if (!o.noSend) $('[data-email]', dlg).addEventListener('keydown', function (e) { if (e.key === 'Enter' && send) send.click(); });
  return { pop: p, dlg: dlg, check: check, role: role, msg: msg, tr: tr };
};`,
  opts: [
    {
      k: 'A', name: 'Fades and grows in the middle', line: 'The Radix dialog: the page dims, the window fades in and grows from 0.95 in the centre. Focus stays inside until you close it.',
      from: [sh('dialog'), radix('dialog')], tryit: 'Open it and press Tab a few times. Focus loops inside.',
      needs: 'CSS and script.', keys: 'Focus goes to the email box and stays inside. Escape closes and returns focus. Enter sends.', off: 'Shows and hides at once.', law: 'Jakob: works like every dialog.',
      tags: ['motion:still', 'speed:quick', 'open:centre', 'new:familiar', 'look:ember'],
      html: modalHtml('t09A'), css: `#t09A .m09 { transform: scale(.95); }`, js: `TLmodal(box);`,
    },
    {
      k: 'B', name: 'It settles into place', line: 'easyui\'s settle modal: the window rises a little, grows just past full size and settles back, then its rows follow one by one.',
      from: [ez('settle-modal'), be('center-morph-modal')], tryit: 'Open and close it a few times.',
      needs: 'CSS keyframes.', keys: 'Same as A.', off: 'Shows at once.', law: 'Jakob: same keys as A.',
      tags: ['motion:springy', 'speed:mid', 'open:centre', 'new:twist', 'look:ember'],
      html: modalHtml('t09B'),
      css: `#t09B .m09 { transform: translateY(8px) scale(.94); }
#t09B .m09.is-open { animation: m09settle .42s cubic-bezier(.16, 1, .3, 1); }
@keyframes m09settle { 0% { transform: translateY(8px) scale(.94); } 60% { transform: translateY(0) scale(1.02); } 100% { transform: none; } }
#t09B .m09.is-open > * { animation: l-fadeup .35s var(--ease-out) both; }
#t09B .m09.is-open > :nth-child(2) { animation-delay: .04s; } #t09B .m09.is-open > :nth-child(3) { animation-delay: .08s; } #t09B .m09.is-open > :nth-child(4) { animation-delay: .12s; } #t09B .m09.is-open > :nth-child(5) { animation-delay: .16s; } #t09B .m09.is-open > :nth-child(6) { animation-delay: .2s; }`,
      js: `TLmodal(box);`,
    },
    {
      k: 'C', name: 'It grows out of the button', line: 'The window starts small at the button you pressed and grows to the middle. On close it shrinks back into the button.',
      from: [ez('morphing-dialog'), skill('animate'), radix('dialog')], tryit: 'Watch where it starts, then press Escape and watch where it goes.',
      needs: 'CSS and a few lines of script.', keys: 'Same as A.', off: 'Shows at once.', law: 'Fitts and the eye: you see the link between button and window.',
      tags: ['motion:some', 'speed:mid', 'open:trigger', 'new:twist', 'look:ember'],
      html: modalHtml('t09C'),
      css: `#t09C .m09 { transform: translate(var(--dx, 0), var(--dy, 0)) scale(.3); transition: opacity .2s var(--ease-out), transform .3s var(--ease-out), visibility 0s linear .3s; }
#t09C .m09.is-open { transition: opacity .2s var(--ease-out), transform .45s var(--ease-out), visibility 0s; }`,
      js: `var m = TLmodal(box, { onOpen: aim }); function aim() { var d = m.dlg, t = m.tr, st = box.querySelector('.stage').getBoundingClientRect(), tb = t.getBoundingClientRect(); var cx = st.left + st.width / 2, cy = st.top + st.height / 2; d.style.setProperty('--dx', (tb.left + tb.width / 2 - cx) + 'px'); d.style.setProperty('--dy', (tb.top + tb.height / 2 - cy) + 'px'); } aim();`,
    },
    {
      k: 'D', name: 'One window, three steps', line: 'beUI\'s morphing modal: email, then role, then done, all in one window that glides to each step\'s height. No new window pops up.',
      from: [be('morphing-modal'), skill('animate')], tryit: 'Fill the email, press Next, pick a role, press Send.',
      needs: 'CSS and the Web Animations API.', keys: 'Same as A. Enter moves on.', off: 'Steps swap at once.', law: 'Hick: one small question at a time.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: modalHtml('t09D', 'm09d', `<div class="st" data-st="1"><h3 class="m09-h" id="t09D-h">Invite a teammate</h3><p class="l-muted m09-sub">Step 1 of 2: their email.</p><div class="m09-f"><label class="l-lbl" for="t09D-e">Email</label><input class="l-in" id="t09D-e" type="email" autocomplete="off" placeholder="brian@example.com" data-email><p class="l-err" data-err hidden></p></div><div class="m09-act"><button class="l-btn ghost" type="button" data-cancel>Cancel</button><button class="l-btn pri" type="button" data-next>Next</button></div></div>
<div class="st" data-st="2" hidden><h3 class="m09-h">What will they do?</h3><p class="l-muted m09-sub">Step 2 of 2: their role.</p><div class="m09-f">${roles('t09D')}</div><div class="m09-act"><button class="l-btn ghost" type="button" data-back>Back</button><button class="l-btn pri" type="button" data-send>Send invite</button></div></div>
<div class="st m09d-done" data-st="3" hidden><svg class="l-tick draw big" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="11"/><path d="M6.6 11.4 9.6 14.3l5.8-6.4"/></svg><h3 class="m09-h" tabindex="-1" data-done-h>Invite sent</h3><p class="l-muted" data-done-t></p><button class="l-btn" type="button" data-cancel>Done</button></div>`),
      css: `#t09D .m09 { transform: scale(.96); overflow: hidden; }
#t09D .m09d-done { display: grid; justify-items: center; text-align: center; gap: 6px; padding: 6px 0; }
#t09D .m09d-done .big { width: 44px; height: 44px; }
#t09D .m09d-done .l-muted { margin: 0 0 8px; }
#t09D .st[data-in] { animation: l-fadeup .3s .08s var(--ease-out) both; }`,
      js: `var m = TLmodal(box, { noSend: true, onClose: function () { setTimeout(function () { show(1, true); }, 200); } });
function show(n, quiet) { var d = m.dlg, h0 = d.offsetHeight; $$('.st', d).forEach(function (s) { s.hidden = s.getAttribute('data-st') !== String(n); s.removeAttribute('data-in'); }); var s = $('[data-st="' + n + '"]', d); if (quiet) return; s.setAttribute('data-in', ''); if (moving()) TLglide(d, h0, 360); var f = $('input, [aria-checked="true"], [data-done-h]', s); if (f) f.focus(); }
$('[data-next]', box).addEventListener('click', function () { if (m.check()) show(2); });
$('[data-email]', box).addEventListener('keydown', function (e) { if (e.key === 'Enter') $('[data-next]', box).click(); });
$('[data-back]', box).addEventListener('click', function () { show(1); });
$('[data-send]', box).addEventListener('click', function () { var v = $('[data-email]', box).value.trim(); $('[data-done-t]', box).textContent = v + ' will join as ' + m.role() + '.'; m.msg.innerHTML = TICK + 'Invite sent to ' + v.replace(/[<>&"]/g, '') + '.'; show(3); $('[data-email]', box).value = ''; });`,
    },
    {
      k: 'E', name: 'A full cover with a big serif title', line: 'Steps outside ember: no floating window. A flat sheet with square corners slides up and covers everything, with a large serif title.',
      from: [['Editorial full-screen forms', null]], tryit: 'Open it and close it with Escape.',
      needs: 'CSS and script.', keys: 'Same as A.', off: 'Covers at once.', law: 'Hick: nothing else to look at while it is open.',
      tags: ['motion:some', 'speed:mid', 'open:edge', 'new:novel', 'look:off'],
      html: modalHtml('t09E', 'm09e'),
      css: `#t09E .m09e { inset: 0; width: auto; height: auto; margin: 0; border-radius: 0; border: 0; box-shadow: none; padding: 26px 22px; transform: translateY(100%); opacity: 1; transition: transform .32s var(--ease-in-out), visibility 0s linear .32s; }
#t09E .m09e.is-open { transform: none; transition: transform .38s var(--ease-in-out), visibility 0s; }
#t09E .m09-h { font-family: var(--font-display); font-weight: 400; font-size: 30px; letter-spacing: -.02em; }
#t09E .m09-roles, #t09E .l-in { border-radius: 0; }
#t09E .m09-roles button { border-radius: 0; }
#t09E .m09-act .l-btn { border-radius: 0; }`,
      js: `TLmodal(box);`,
    },
  ],
};

/* ---------------- 10 Drawer ---------------- */
const orderBody = `<div class="d10-items"><div><span>Sukuma wiki, 2 bunches</span><span class="l-num">120</span></div><div><span>Unga, 2 kg</span><span class="l-num">230</span></div><div><span>Cooking oil, 1 L</span><span class="l-num">410</span></div><div class="tot"><span>Total</span><span class="l-num">KES 760</span></div></div>
<ol class="d10-steps"><li class="done">Paid by PocketPay · 2:14 pm</li><li class="done">Packed · 2:31 pm</li><li class="now">Out for delivery</li></ol>`;
const drawerHtml = (id, cls = '', edge = 'right') => `<div class="d10-page" data-page><div class="d10-row"><div><b>Order #4821</b><span class="l-muted">Amina Otieno · 3 items</span></div><button class="l-btn sm" type="button" data-tr aria-haspopup="dialog">Open</button></div><div class="d10-row ghost"><div><b>Order #4820</b><span class="l-muted">Brian Kiprop · 5 items</span></div></div><p class="l-muted d10-msg" data-msg aria-live="polite"></p></div><div class="l-scrim" data-scrim></div>
<div class="d10 ${cls} d10-${edge}" role="dialog" aria-modal="true" aria-labelledby="${id}-h" data-dlg><span class="grab" aria-hidden="true" data-grab></span><div class="d10-head"><h3 id="${id}-h">Order #4821</h3><button class="l-ib d10-x" type="button" aria-label="Close" data-close>${X}</button></div>${orderBody}<button class="l-btn pri d10-go" type="button" data-sent>Mark as delivered</button></div>`;
const drawer = {
  id: 'drawer', n: '10', name: 'Drawer and side sheet', h: 380,
  claim: 'A drawer keeps <em>the list in view</em> while you read one item.',
  lead: 'Open order #4821 to see its items and where it is. Close it with Escape, the cross, the dim area, or by dragging it away where you can.',
  ref: null,
  noteHint: 'B\'s drag with A\'s look', moreHint: 'drawers with a form to edit',
  css: `.d10-page { width: min(100%, 330px); display: grid; gap: 8px; text-align: left; transform-origin: center; }
.d10-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 14px; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); }
.d10-row.ghost { opacity: .6; }
.d10-row b { display: block; font-size: 14.5px; }
.d10-row .l-muted { font-size: 12.5px; }
.d10-msg { margin: 4px 2px 0; min-height: 1.3em; }
.d10 { position: absolute; z-index: 6; background: var(--paper-raised); box-shadow: var(--shadow-lg); padding: 16px; display: flex; flex-direction: column; gap: 12px; text-align: left; visibility: hidden; touch-action: none; }
.d10-right { top: 0; right: 0; bottom: 0; width: min(290px, 86%); border-left: 1px solid var(--line); transform: translateX(102%); transition: transform .25s var(--ease-out), visibility 0s linear .25s; }
.d10.is-open { visibility: visible; transform: none; transition: transform .35s var(--ease-out), visibility 0s; }
.d10 .grab { display: none; }
.d10-head { display: flex; align-items: center; justify-content: space-between; }
.d10-head h3 { margin: 0; font-size: 17px; }
.d10-x { width: 32px; height: 32px; box-shadow: none; }
.d10-items { display: grid; gap: 6px; font-size: 13.5px; }
.d10-items > div { display: flex; justify-content: space-between; gap: 10px; }
.d10-items .tot { padding-top: 8px; border-top: 1px solid var(--line); font-weight: 600; }
.d10-steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; font-size: 13px; color: var(--ink-soft); }
.d10-steps li { display: flex; align-items: center; gap: 8px; }
.d10-steps li::before { content: ""; width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--line-hi); flex: 0 0 12px; box-sizing: border-box; }
.d10-steps .done::before { background: var(--accent); border-color: var(--accent); }
.d10-steps .now::before { border-color: var(--accent); }
.d10-go { margin-top: auto; }`,
  js: `/* drag: axis 'x' (to the right) or 'y' (down). Past 30% or a quick flick closes. */
window.TLdrawer = function (box, o) {
  o = o || {}; var tr = $('[data-tr]', box), d = $('[data-dlg]', box), sc = $('[data-scrim]', box), msg = $('[data-msg]', box);
  var p = pop(tr, d, { scrim: sc, trap: true, focus: '[data-close]', onOpen: o.onOpen, onClose: o.onClose });
  $('[data-close]', d).addEventListener('click', function () { p.set(false); });
  $('[data-sent]', d).addEventListener('click', function () { msg.innerHTML = TICK + 'Order #4821 marked as delivered.'; var n = $('.now', d); if (n) { n.className = 'done'; n.textContent = 'Delivered · just now'; } p.set(false); });
  if (o.drag) { var start = null, last = 0, lt = 0, ax = o.drag;
    d.addEventListener('pointerdown', function (e) { if (e.target.closest('button, input') ) return; start = ax === 'x' ? e.clientX : e.clientY; last = start; lt = performance.now(); d.setPointerCapture(e.pointerId); d.style.transition = 'none'; });
    d.addEventListener('pointermove', function (e) { if (start === null) return; var v = ax === 'x' ? e.clientX : e.clientY, dd = Math.max(0, v - start); last = v; lt = performance.now(); d.style.transform = (ax === 'x' ? 'translateX(' : 'translateY(') + dd + 'px)' + (o.base || ''); if (o.onDrag) o.onDrag(dd / (ax === 'x' ? d.offsetWidth : d.offsetHeight)); });
    function end(e) { if (start === null) return; var v = ax === 'x' ? e.clientX : e.clientY, dd = v - start, size = ax === 'x' ? d.offsetWidth : d.offsetHeight, fast = dd > 20 && performance.now() - lt < 60; start = null; d.style.transition = ''; d.style.transform = ''; if (o.onDrag) o.onDrag(0); if (dd > size * .3 || fast) p.set(false); }
    d.addEventListener('pointerup', end); d.addEventListener('pointercancel', end); }
  return { pop: p, d: d };
};`,
  opts: [
    {
      k: 'A', name: 'Slides in from the right', line: 'The shadcn sheet: the page dims and the panel slides in from the right edge in 0.35 s.',
      from: [sh('sheet'), radix('dialog')], tryit: 'Open, press Tab a few times, then Escape.',
      needs: 'CSS and script.', keys: 'Focus goes to the cross and stays inside. Escape closes and returns focus.', off: 'Shows at once.', law: 'Jakob: the most common side panel.',
      tags: ['motion:some', 'speed:mid', 'open:edge', 'new:familiar', 'look:ember'],
      html: drawerHtml('t10A'), js: `TLdrawer(box);`,
    },
    {
      k: 'B', name: 'A springy slide you can drag away', line: 'easyui\'s sheet: it springs in, and you can grab it and drag it to the right to close it. A short drag springs back.',
      from: [ez('sheet'), be('drawer')], tryit: 'Open it, then drag the panel to the right.',
      needs: 'CSS springs and pointer events.', keys: 'Same as A.', off: 'Shows at once; dragging still works.', law: 'Fitts: the whole panel is a handle.',
      tags: ['motion:springy', 'speed:mid', 'open:edge', 'new:twist', 'look:ember'],
      html: drawerHtml('t10B'),
      css: `#t10B .d10.is-open { transition: transform var(--sp-bouncy-d) var(--sp-bouncy), visibility 0s; }
#t10B .d10 { cursor: grab; }`,
      js: `TLdrawer(box, { drag: 'x' });`,
    },
    {
      k: 'C', name: 'The page steps back as it comes', line: 'The list behind shrinks a little and dims as the panel arrives, like a card being set aside. Drag works too.',
      from: [ez('sheet'), ['Vaul (scaled background)', 'https://vaul.emilkowal.ski/'], skill('animate')], tryit: 'Open it and watch the list behind.',
      needs: 'CSS and script.', keys: 'Same as A.', off: 'No step back.', law: 'Proximity: the list stays in view, so you keep your place.',
      tags: ['motion:some', 'speed:slow', 'depth:lifted', 'open:edge', 'look:ember'],
      html: drawerHtml('t10C'),
      css: `#t10C .d10-page { transition: transform .45s var(--ease-out); }
#t10C .is-back .d10-page { transform: scale(.94) translateX(-10px); }
#t10C .d10 { border-radius: 14px 0 0 14px; }`,
      js: `var st = box.querySelector('.stage'); TLdrawer(box, { drag: 'x', onOpen: function () { st.classList.add('is-back'); }, onClose: function () { st.classList.remove('is-back'); } });`,
    },
    {
      k: 'D', name: 'A sheet from the bottom with two stops', line: 'beUI\'s bottom sheet: it rises halfway first. Pull it up for the full order, or down to close.',
      from: [be('bottom-sheet'), ['Vaul', 'https://vaul.emilkowal.ski/']], tryit: 'Open it, then click or drag the grey handle.',
      needs: 'CSS and pointer events.', keys: 'The handle is a button: Enter switches half and full. Escape closes.', off: 'Moves between stops at once.', law: 'Fitts: on phones the sheet sits where the thumb is.',
      tags: ['motion:springy', 'speed:mid', 'open:edge', 'new:twist', 'look:ember'],
      html: drawerHtml('t10D', 'd10d', 'bottom'),
      css: `#t10D .d10-bottom { left: 0; right: 0; bottom: 0; height: 92%; border-radius: 18px 18px 0 0; border-top: 1px solid var(--line); transform: translateY(102%); transition: transform .3s var(--ease-out), visibility 0s linear .3s; }
#t10D .d10.is-open { transform: translateY(var(--stop, 45%)); transition: transform var(--sp-snappy-d) var(--sp-snappy), visibility 0s; }
#t10D .d10.is-full { --stop: 0%; }
#t10D .grab { display: block; align-self: center; width: 44px; height: 18px; margin: -10px 0 -6px; border-radius: 9px; cursor: pointer; position: relative; }
#t10D .grab::before { content: ""; position: absolute; left: 8px; right: 8px; top: 7px; height: 4px; border-radius: 4px; background: var(--line-hi); }`,
      js: `var g = $('[data-grab]', box); g.setAttribute('role', 'button'); g.setAttribute('tabindex', '0'); g.setAttribute('aria-label', 'Show the full order'); g.removeAttribute('aria-hidden');
var api = TLdrawer(box, { onClose: function () { api.d.classList.remove('is-full'); } });
function flip() { var f = api.d.classList.toggle('is-full'); g.setAttribute('aria-label', f ? 'Show half' : 'Show the full order'); }
g.addEventListener('click', function () { if (moved) { moved = false; return; } flip(); }); g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
var y0 = null, moved = false; g.addEventListener('pointerdown', function (e) { y0 = e.clientY; moved = false; g.setPointerCapture(e.pointerId); });
g.addEventListener('pointerup', function (e) { if (y0 === null) return; var dy = e.clientY - y0; y0 = null; if (Math.abs(dy) < 6) return; moved = true; if (dy < -20) api.d.classList.add('is-full'); else if (dy > 20) { if (api.d.classList.contains('is-full')) api.d.classList.remove('is-full'); else api.pop.set(false); } });`,
    },
    {
      k: 'E', name: 'An ink panel from the left, no dimming', line: 'Steps outside ember: a dark mono panel slides from the left edge with a hard line and no dim page, like a tool sidebar.',
      from: [['Code editor side panels', null]], tryit: 'Open it and press Escape.',
      needs: 'CSS and script.', keys: 'Same as A.', off: 'Shows at once.', law: 'Jakob bends: from the left usually means a menu, not details.',
      tags: ['motion:some', 'speed:quick', 'density:compact', 'open:edge', 'look:off'],
      html: drawerHtml('t10E', 'd10e', 'left'),
      css: `#t10E .l-scrim { background: transparent; }
#t10E .d10-left { top: 0; left: 0; bottom: 0; width: min(280px, 86%); background: var(--ink); color: var(--paper); box-shadow: none; border-right: 2px solid var(--accent); font-family: var(--font-mono); font-size: 12px; transform: translateX(-102%); transition: transform .2s var(--ease-out), visibility 0s linear .2s; }
#t10E .d10-left.is-open { transition: transform .22s var(--ease-out), visibility 0s; }
#t10E .d10 h3 { font-family: var(--font-mono); font-size: 13px; text-transform: uppercase; letter-spacing: .08em; }
#t10E .d10-items { font-size: 12px; }
#t10E .d10-steps { color: var(--paper); opacity: .8; font-size: 11.5px; }
#t10E .d10-x { background: transparent; color: var(--paper); border-color: rgb(255 255 255 / .2); }
html[data-theme="dark"] #t10E .d10-x { border-color: rgb(0 0 0 / .2); }
#t10E .d10-go { border-radius: 0; }`,
      js: `TLdrawer(box);`,
    },
  ],
};

/* ---------------- 11 Toast ---------------- */
const toastPage = (extra = '') => `<div class="t11-page"><div class="t11-inv"><div><b>Invoice #4821</b><span class="l-muted">Amina Otieno · KES 4,200</span></div><button class="l-btn sm pri" type="button" data-send>Send</button></div>${extra}</div><div class="t11-host" data-host aria-live="polite"></div>`;
const toast = {
  id: 'toast', n: '11', name: 'Toast', h: 330,
  claim: 'A toast says <em>it is done</em>, and lets you take it back.',
  lead: 'Send the invoice. Then send it a few times quickly to see how messages stack. Undo puts it back.',
  ref: { ids: 'c21 · n22', text: 'Small news that rises, waits four seconds and goes; and Archive with an Undo you can catch in time.' },
  noteHint: 'C\'s countdown, B\'s stack', moreHint: 'toasts for errors that need a choice',
  css: `.t11-page { width: min(100%, 320px); align-self: start; margin-top: 10px; display: grid; gap: 10px; }
.t11-inv { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 14px; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); text-align: left; }
.t11-inv b { display: block; font-size: 14.5px; }
.t11-inv .l-muted { font-size: 12.5px; }
.t11-host { position: absolute; right: 12px; bottom: 12px; left: 12px; z-index: 6; display: grid; justify-items: end; gap: 8px; pointer-events: none; }
.t11 { pointer-events: auto; position: relative; width: min(300px, 100%); display: flex; align-items: center; gap: 10px; padding: 11px 12px; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-lg); font-size: 13.5px; text-align: left; color: var(--ink); overflow: hidden; }
.t11 .tx { flex: 1; min-width: 0; }
.t11 .tx b { display: block; font-weight: 600; }
.t11 .tx span { color: var(--muted); font-size: 12.5px; }
.t11 .u { font-weight: 600; color: var(--accent-text); font-size: 13px; padding: 4px 6px; border-radius: 6px; }
.t11 .u:hover { background: rgb(var(--accent-rgb) / .08); }
.t11 .cl { width: 26px; height: 26px; display: grid; place-items: center; color: var(--muted); border-radius: 6px; }
.t11 .cl svg { width: 14px; height: 14px; }`,
  js: `/* make(n) builds one toast; life in ms; the host keeps at most max. */
window.TLtoast = function (box, o) {
  var host = $('[data-host]', box), n = 0, list = [];
  function remove(t) { list = list.filter(function (x) { return x !== t; }); if (!t.parentNode || t.dataset.gone) return; t.dataset.gone = '1'; clearTimeout(t._t); t.classList.add('is-out'); setTimeout(function () { t.remove(); }, moving() ? (o.outMs || 220) : 0); if (o.layout) o.layout(list, host); }
  function timer(t, ms) { clearTimeout(t._t); t._end = performance.now() + ms; t._t = setTimeout(function () { remove(t); }, ms); }
  function add(extra) { n++; var t = document.createElement('div'); t.className = 't11'; t.setAttribute('role', 'status'); t.innerHTML = o.make(n, extra); host.appendChild(t); list.push(t);
    var u = $('.u', t); if (u) u.addEventListener('click', function () { if (o.undo) o.undo(t); remove(t); });
    var c = $('.cl', t); if (c) c.addEventListener('click', function () { remove(t); });
    if (o.life) { timer(t, o.life); t._left = o.life; t.addEventListener('pointerenter', function () { if (!t._t) return; clearTimeout(t._t); t._t = null; t._left = Math.max(400, t._end - performance.now()); t.classList.add('is-paused'); }); t.addEventListener('pointerleave', function () { t.classList.remove('is-paused'); timer(t, t._left); }); }
    while (o.max && list.length > o.max) remove(list[0]);
    if (o.layout) o.layout(list, host); if (o.added) o.added(t, n); return t; }
  $('[data-send]', box).addEventListener('click', function () { add(); });
  return { add: add, remove: remove };
};`,
  opts: [
    {
      k: 'A', name: 'Rises in the corner, leaves after 4 s', line: 'Like Sonner, the shadcn toast: a paper card rises in the corner, waits four seconds and fades. New ones stack above.',
      from: [sh('sonner'), ['Sonner', 'https://sonner.emilkowal.ski/']], tryit: 'Press Send three times quickly.',
      needs: 'CSS and script.', keys: 'Undo and close are buttons. The message is read out.', off: 'Shows and goes at once.', law: 'Jakob: where people look for these.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'new:familiar', 'look:ember'],
      html: toastPage(),
      css: `#t11A .t11 { animation: t11up .35s var(--ease-out); transition: opacity .2s, transform .2s var(--ease-out); }
#t11A .t11.is-out { opacity: 0; transform: translateY(6px); }
@keyframes t11up { from { opacity: 0; transform: translateY(16px); } }`,
      js: `TLtoast(box, { life: 4000, max: 3, make: function (n) { return '<div class="tx"><b>Invoice sent</b><span>To Amina Otieno' + (n > 1 ? ' (again, ' + n + ')' : '') + '</span></div><button class="u" type="button">Undo</button><button class="cl" type="button" aria-label="Close">${X.replace(/"/g, '\\"')}</button>'; } });`,
    },
    {
      k: 'B', name: 'A pile that opens when you point', line: 'beUI\'s toast stack: messages pile up behind each other. Point at the pile and it opens into a list. Swipe one sideways to clear it.',
      from: [be('animated-toast-stack'), be('notification-stack'), ['Sonner', 'https://sonner.emilkowal.ski/']], tryit: 'Press Send four times, then point at the pile.',
      needs: 'CSS springs and pointer events.', keys: 'Tab into the pile to open it.', off: 'Pile and list swap at once.', law: 'Hick: you see one message, the rest wait behind.',
      tags: ['motion:springy', 'speed:mid', 'depth:lifted', 'new:twist', 'look:ember'],
      html: toastPage(),
      css: `#t11B .t11-host { display: block; height: 210px; top: auto; }
#t11B .t11 { position: absolute; right: 0; bottom: 0; transition: transform var(--sp-snappy-d) var(--sp-snappy), opacity .25s; animation: t11in .4s var(--ease-out); touch-action: pan-y; }
@keyframes t11in { from { opacity: 0; transform: translateY(30px) scale(.96); } }
#t11B .t11.is-out { opacity: 0; }`,
      js: `var open = false, hostB = $('[data-host]', box);
function lay(list) { var k = list.length; list.forEach(function (t, i) { var d = k - 1 - i; t.style.zIndex = 10 - d; if (t.dataset.gone) return; t.style.transform = open ? 'translateY(' + (-d * 58) + 'px)' : 'translateY(' + (-d * 9) + 'px) scale(' + (1 - d * .05) + ')'; t.style.opacity = d > 2 && !open ? 0 : 1; }); }
var api = TLtoast(box, { life: 6000, max: 4, layout: lay, make: function () { return '<div class="tx"><b>Invoice sent</b><span>To Amina Otieno</span></div><button class="u" type="button">Undo</button>'; },
  added: function (t) { var x0 = null; t.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; x0 = e.clientX; t.setPointerCapture(e.pointerId); t.style.transition = 'none'; });
    t.addEventListener('pointermove', function (e) { if (x0 === null) return; t.style.transform = 'translateX(' + (e.clientX - x0) + 'px)'; });
    t.addEventListener('pointerup', function (e) { if (x0 === null) return; var dx = e.clientX - x0; x0 = null; t.style.transition = ''; if (Math.abs(dx) > 90) { t.style.transform = 'translateX(' + (dx > 0 ? 340 : -340) + 'px)'; api.remove(t); } else lay($$('.t11', hostB)); }); } });
['pointerenter', 'focusin'].forEach(function (ev) { hostB.addEventListener(ev, function () { open = true; lay($$('.t11', hostB)); }); });
['pointerleave', 'focusout'].forEach(function (ev) { hostB.addEventListener(ev, function () { open = false; lay($$('.t11', hostB)); }); });`,
    },
    {
      k: 'C', name: 'Sending, then sent, with an orange countdown', line: 'Our Undo rule with easyui\'s velocity toast: it says "Sending…", turns into "Sent" with a drawn tick, and an orange line counts down five seconds. Pointing at it pauses the line.',
      from: [ez('undo-toast'), ez('velocity-toast'), house('n22')], tryit: 'Press Send, then rest the pointer on the toast.',
      needs: 'CSS springs and script.', keys: 'Focus on Undo pauses it too.', off: 'The line still counts down, without moving parts.', law: 'Fitts: Undo is the biggest thing in the toast.',
      tags: ['motion:springy', 'speed:mid', 'feedback:loud', 'new:twist', 'look:ember'],
      html: toastPage('<p class="l-muted t11-st" data-st>Status: draft</p>'),
      css: `#t11C .t11 { animation: t11v .5s var(--sp-bouncy) both; padding-bottom: 14px; }
@keyframes t11v { from { opacity: 0; transform: translateY(40px); } }
#t11C .t11.is-out { opacity: 0; transform: translateY(8px); transition: opacity .2s, transform .2s; }
#t11C .bar { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: var(--accent); transform-origin: left; animation: t11bar 5s linear forwards; }
#t11C .is-paused .bar, #t11C .t11:focus-within .bar { animation-play-state: paused; }
@keyframes t11bar { to { transform: scaleX(0); } }
html[data-motion="off"] #t11C .bar { animation-duration: 5s !important; }
#t11C .ic { width: 22px; height: 22px; display: grid; place-items: center; }
#t11C .t11-st { margin: 0; text-align: left; }`,
      js: `var st = $('[data-st]', box); var api = TLtoast(box, { life: 5000, max: 2, make: function () { return '<span class="ic"><span class="l-spin" aria-hidden="true"></span></span><div class="tx"><b>Sending invoice…</b><span>To Amina Otieno</span></div><button class="u" type="button">Undo</button><span class="bar" aria-hidden="true"></span>'; },
  added: function (t) { st.textContent = 'Status: sending'; setTimeout(function () { if (!t.parentNode) return; $('.ic', t).innerHTML = TICK; $('b', t).textContent = 'Invoice sent'; st.textContent = 'Status: sent'; }, 900); },
  undo: function () { st.textContent = 'Status: draft (sending undone)'; } });
box.addEventListener('focusin', function (e) { var t = e.target.closest('.t11'); if (t) t.dispatchEvent(new PointerEvent('pointerenter')); });
box.addEventListener('focusout', function (e) { var t = e.target.closest('.t11'); if (t) t.dispatchEvent(new PointerEvent('pointerleave')); });`,
    },
    {
      k: 'D', name: 'The row itself says "Sent", and Undo sits there', line: 'Your c21 and n22, pushed: no corner message at all. The invoice row changes to "Sent just now", with Undo and an orange countdown line right where you clicked.',
      from: [house('c21'), house('n22'), ['DESIGN.md: the action is the confirmation', null]], tryit: 'Press Send, then Undo before the line runs out.',
      needs: 'CSS and script.', keys: 'Focus moves to Undo, so Enter undoes.', off: 'The line counts down without moving.', law: 'Fitts and proximity at their best: the answer sits on the button you pressed.',
      tags: ['motion:some', 'speed:mid', 'feedback:quiet', 'open:inplace', 'look:ember'],
      html: `<div class="t11-page"><div class="t11-inv t11d" data-row><div><b>Invoice #4821</b><span class="l-muted" data-sub>Amina Otieno · KES 4,200</span></div><div class="act"><button class="l-btn sm pri" type="button" data-go>Send</button><span class="sent" data-sent hidden>${'<svg class="l-tick draw" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="11"/><path d="M6.6 11.4 9.6 14.3l5.8-6.4"/></svg>'}<button class="l-btn sm ghost" type="button" data-undo>Undo</button></span></div><span class="bar" aria-hidden="true"></span></div><p class="l-muted" data-say aria-live="polite"></p></div>`,
      css: `#t11D .t11d { position: relative; overflow: hidden; }
#t11D .act { display: flex; align-items: center; }
#t11D .sent { display: inline-flex; align-items: center; gap: 4px; animation: l-fadeup .25s var(--ease-out); }
#t11D .sent .l-btn { color: var(--accent-text); }
#t11D .bar { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: var(--accent); transform: scaleX(0); transform-origin: left; }
#t11D .is-sent .bar { animation: t11dbar 5s linear forwards; }
#t11D .is-sent:hover .bar, #t11D .is-sent:focus-within .bar { animation-play-state: paused; }
@keyframes t11dbar { from { transform: scaleX(1); } to { transform: scaleX(0); } }
html[data-motion="off"] #t11D .is-sent .bar { animation-duration: 5s !important; }`,
      js: `var row = $('[data-row]', box), go = $('[data-go]', box), sent = $('[data-sent]', box), sub = $('[data-sub]', box), say = $('[data-say]', box), bar = $('.bar', box);
function reset(w) { row.classList.remove('is-sent'); sent.hidden = true; go.hidden = false; sub.textContent = 'Amina Otieno · KES 4,200'; if (w) say.textContent = w; }
go.addEventListener('click', function () { go.hidden = true; sent.hidden = false; row.classList.add('is-sent'); sub.textContent = 'Sent just now · undo for 5 s'; say.textContent = ''; $('[data-undo]', box).focus(); });
$('[data-undo]', box).addEventListener('click', function () { reset('Sending undone. Invoice #4821 is still a draft.'); go.focus(); });
bar.addEventListener('animationend', function () { row.classList.remove('is-sent'); sub.textContent = 'Sent to Amina at ' + new Date().toTimeString().slice(0, 5); sent.hidden = true; say.textContent = 'Invoice #4821 sent.'; go.hidden = false; go.textContent = 'Send again'; });`,
    },
    {
      k: 'E', name: 'A hard ink bar at the top', line: 'Steps outside ember (and breaks our "never a black box" rule on purpose): a square ink bar drops from the top with upper-case mono words.',
      from: [['Old Android snackbars', null]], tryit: 'Press Send twice.',
      needs: 'CSS and script.', keys: 'Same as A.', off: 'Shows and goes at once.', law: 'Fitts bends: Undo at the top is far from the Send button.',
      tags: ['motion:some', 'speed:quick', 'feedback:loud', 'new:novel', 'look:off'],
      html: toastPage(),
      css: `#t11E .t11-page { margin-top: 64px; }
#t11E .t11-host { top: 0; left: 0; right: 0; bottom: auto; justify-items: stretch; gap: 0; }
#t11E .t11 { width: 100%; border-radius: 0; border: 0; background: var(--ink); color: var(--paper); box-shadow: none; font-family: var(--font-mono); font-size: 11.5px; letter-spacing: .06em; text-transform: uppercase; animation: t11down .22s var(--ease-out); }
@keyframes t11down { from { transform: translateY(-100%); } }
#t11E .t11 .tx span { color: var(--dim); font-size: 11px; }
#t11E .t11 .tx b { font-weight: 600; }
#t11E .t11 .u { color: var(--accent); font-size: 11.5px; letter-spacing: .06em; }
#t11E .t11.is-out { transform: translateY(-100%); transition: transform .18s; }`,
      js: `TLtoast(box, { life: 3500, max: 1, outMs: 180, make: function () { return '<div class="tx"><b>Invoice #4821 sent</b></div><button class="u" type="button">UNDO</button>'; } });`,
    },
  ],
};

/* ---------------- 12 Data table ---------------- */
const table = {
  id: 'table', n: '12', name: 'Data table', h: 420,
  claim: 'A table should let you <em>sort, pick and act</em> without losing your place.',
  lead: 'Eight invoices. Sort by a column, tick a few rows, and try each table\'s own extra. Each one takes the full width.',
  ref: { ids: 'c15', text: 'Customers in one table: search, filter, sort and pick, open a row for more, cards on a phone.' },
  noteHint: 'C\'s density switch with A\'s calm sort', moreHint: 'tables with filters and columns you hide',
  css: `.t12 { width: 100%; align-self: start; text-align: left; }
.t12-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
.t12-top .l-muted { margin: 0; }
.t12-sc { position: relative; overflow-x: auto; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); }
.t12 table { width: 100%; min-width: 600px; border-collapse: collapse; font-size: 14px; }
.t12 th { text-align: left; font-weight: 500; font-size: 12.5px; color: var(--muted); padding: 0 12px; height: 40px; border-bottom: 1px solid var(--line); white-space: nowrap; }
.t12 td { padding: 0 12px; height: 44px; border-bottom: 1px solid var(--line); white-space: nowrap; }
.t12 tbody tr:last-child td { border-bottom: 0; }
.t12 .r { text-align: right; }
.t12 .num { font-variant-numeric: tabular-nums; }
.t12 .sb { display: inline-flex; align-items: center; gap: 4px; font: inherit; color: inherit; height: 30px; padding: 0 6px; margin: 0 -6px; border-radius: 6px; }
.t12 .sb:hover { background: rgb(var(--ink-rgb) / .06); color: var(--ink); }
.t12 .sb svg { width: 12px; height: 12px; opacity: .5; transition: transform .2s var(--ease-out); }
.t12 [aria-sort="descending"] .sb svg { transform: rotate(180deg); }
.t12 [aria-sort="ascending"] .sb svg, .t12 [aria-sort="descending"] .sb svg { opacity: 1; color: var(--accent-text); }
.t12 .ckc { width: 40px; padding-right: 0; }
.t12 tbody tr { transition: background-color .12s; }
.t12 tbody tr:hover { background: rgb(var(--ink-rgb) / .035); }
.t12 tbody tr[aria-selected="true"] { background: rgb(var(--accent-rgb) / .06); }
.t12 .stt { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }
.t12 .stt::before { content: ""; width: 9px; height: 9px; border-radius: 50%; box-sizing: border-box; }
.t12 .s-Paid::before { background: var(--accent); }
.t12 .s-Due::before { border: 2px solid var(--line-hi); }
.t12 .s-Overdue { color: var(--accent-text); font-weight: 500; }
.t12 .s-Overdue::before { border: 2px solid var(--accent-text); }
.t12-foot { margin: 8px 2px 0; font-size: 13px; color: var(--muted); min-height: 1.4em; }`,
  js: `window.TLrows = [['4821', 'Amina Otieno', 4200, 'Paid', '2026-10-31'], ['4820', 'Brian Kiprop', 12750, 'Due', '2026-10-30'], ['4819', 'Wanjiru Mwangi', 860, 'Paid', '2026-10-30'], ['4818', 'Otieno Ouma', 3400, 'Overdue', '2026-10-24'], ['4817', 'Fatuma Hassan', 7900, 'Paid', '2026-10-23'], ['4816', 'Kevin Mutua', 2150, 'Due', '2026-10-22'], ['4815', 'Grace Akinyi', 15300, 'Paid', '2026-10-20'], ['4814', 'Daniel Njoroge', 5600, 'Overdue', '2026-10-15']];
window.TLday = function (d) { var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return +d.slice(8) + ' ' + m[+d.slice(5, 7) - 1]; };
window.TLmoney = function (n) { return n.toLocaleString('en-KE'); };
/* A sortable, pickable table. o.cell(row, col) can replace a cell; o.flip animates rows to their new places. */
window.TLtable = function (box, o) {
  o = o || {}; var tb = $('tbody', box), foot = $('[data-foot]', box), all = $('[data-all]', box), sort = { k: 4, dir: -1 }, sel = {}, q = '';
  var CB = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.8 8.3 6.7 11 12.2 5"/></svg>';
  function rows() { var r = TLrows.filter(function (x) { return !q || (x[0] + ' ' + x[1] + ' ' + x[3]).toLowerCase().indexOf(q) >= 0; }); return r.sort(function (a, b) { var A = a[sort.k], B = b[sort.k]; return (A > B ? 1 : A < B ? -1 : 0) * sort.dir; }); }
  function render() { var before = {}; if (o.flip && moving()) $$('tr', tb).forEach(function (tr) { before[tr.dataset.id] = tr.getBoundingClientRect().top; });
    var html = rows().map(function (r) { var s = !!sel[r[0]]; return '<tr data-id="' + r[0] + '" aria-selected="' + s + '"><td class="ckc"><button class="cb" type="button" role="checkbox" aria-checked="' + s + '" aria-label="Pick invoice ' + r[0] + '">' + CB + '</button></td><td>' + (o.cell ? o.cell(r, 0) || '#' + r[0] : '#' + r[0]) + '</td><td>' + r[1] + '</td><td class="r num">' + (o.cell && o.cell(r, 2) || TLmoney(r[2])) + '</td><td><span class="stt s-' + r[3] + '">' + r[3] + '</span></td><td class="num">' + TLday(r[4]) + '</td>' + (o.extra ? o.extra(r) : '') + '</tr>' + (o.after ? o.after(r) : ''); }).join('');
    tb.innerHTML = html || '<tr><td colspan="7" class="l-muted" style="padding:18px 12px">No invoice matches. Clear the search.</td></tr>';
    $$('tr[data-id]', tb).forEach(function (tr) { var b = $('.cb', tr); b.addEventListener('click', function () { sel[tr.dataset.id] = !sel[tr.dataset.id]; render(); }); if (o.row) o.row(tr); });
    if (o.flip && moving()) $$('tr[data-id]', tb).forEach(function (tr) { var b = before[tr.dataset.id]; if (b === undefined) return; var d = b - tr.getBoundingClientRect().top; if (d) tr.animate([{ transform: 'translateY(' + d + 'px)' }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' }); });
    var n = Object.keys(sel).filter(function (k) { return sel[k]; }), tot = TLrows.filter(function (r) { return sel[r[0]]; }).reduce(function (a, r) { return a + r[2]; }, 0);
    all.setAttribute('aria-checked', n.length === TLrows.length ? 'true' : n.length ? 'mixed' : 'false');
    foot.textContent = n.length ? n.length + ' of ' + TLrows.length + ' picked · KES ' + TLmoney(tot) : TLrows.length + ' invoices · sorted by ' + ['number', 'customer', 'amount', 'status', 'date'][sort.k] + (sort.dir > 0 ? ', low to high' : ', high to low');
    if (o.after_render) o.after_render(n, tot); }
  $$('th[data-k]', box).forEach(function (th) { $('.sb', th).addEventListener('click', function () { var k = +th.dataset.k; sort = { k: k, dir: sort.k === k ? -sort.dir : 1 }; $$('th[data-k]', box).forEach(function (h) { h.setAttribute('aria-sort', +h.dataset.k === k ? (sort.dir > 0 ? 'ascending' : 'descending') : 'none'); }); render(); }); });
  all.addEventListener('click', function () { var on = all.getAttribute('aria-checked') !== 'true'; TLrows.forEach(function (r) { sel[r[0]] = on; }); render(); });
  render(); return { render: render, sel: sel, setQ: function (v) { q = v.trim().toLowerCase(); render(); }, clear: function () { for (var k in sel) sel[k] = false; render(); } };
};`,
  opts: [],
};
const SORT = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5l3-3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
const thead = (extra = '') => `<thead><tr><th class="ckc"><button class="cb" type="button" role="checkbox" aria-checked="false" aria-label="Pick all invoices" data-all><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.8 8.3 6.7 11 12.2 5"/></svg></button></th>${[['Invoice', 0], ['Customer', 1], ['Amount (KES)', 2, 'r'], ['Status', 3], ['Date', 4]].map(([n, k, c]) => `<th data-k="${k}" aria-sort="${k === 4 ? 'descending' : 'none'}"${c ? ` class="${c}"` : ''}><button class="sb" type="button">${n}${SORT}</button></th>`).join('')}${extra}</tr></thead>`;
const tableHtml = (top = '', extra = '', after = '') => `<div class="t12">${top}<div class="t12-sc"><table>${thead(extra)}<tbody></tbody></table></div><p class="t12-foot" data-foot aria-live="polite"></p>${after}</div>`;
const cbCss = `.t12 .cb { position: relative; width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--line-hi); background: var(--paper-raised); display: grid; place-items: center; }
.t12 .cb::before { content: ""; position: absolute; inset: -12px; }
.t12 .cb[aria-checked="true"], .t12 .cb[aria-checked="mixed"] { background: var(--accent); border-color: var(--accent); }
.t12 .cb svg { width: 12px; height: 12px; fill: none; stroke: var(--on-accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; opacity: 0; }
.t12 .cb[aria-checked="true"] svg { opacity: 1; }
.t12 .cb[aria-checked="mixed"]::after { content: ""; width: 8px; height: 2px; background: var(--on-accent); border-radius: 2px; position: absolute; }`;
table.css += '\n' + cbCss;
table.opts = [
  {
    k: 'A', name: 'Calm rows, sort by a header', line: 'The shadcn data table: click a header to sort, rows change at once, ticked rows get a faint orange wash, and the line below counts them.',
    from: [sh('data-table'), sh('table', 'shadcn/ui table'), ['TanStack Table', 'https://tanstack.com/table']], tryit: 'Sort by Amount twice. Tick three rows.',
    needs: 'Plain CSS and script.', keys: 'Headers and boxes are buttons. Tab moves through them.', off: 'Same; nothing moves.', law: 'Jakob: works like a spreadsheet header.',
    tags: ['motion:still', 'speed:quick', 'density:mid', 'new:familiar', 'look:ember'], wide: true, h: 470,
    html: tableHtml(), js: `TLtable(box);`,
  },
  {
    k: 'B', name: 'Rows glide when you sort, a bar rises for picks', line: 'beUI\'s table feel: rows glide to their new places when you sort, and a dark action bar rises from the bottom once you tick something.',
    from: [be('table'), ez('selection-basket'), house('c19')], tryit: 'Sort by Customer, then tick two rows.',
    needs: 'CSS and the Web Animations API.', keys: 'Same as A. The bar\'s buttons follow the table.', off: 'Rows jump; the bar appears at once.', law: 'Fitts: actions come to the bottom, near the thumb.',
    tags: ['motion:some', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'], wide: true, h: 470,
    html: tableHtml('', '', `<div class="t12-bar" data-bar aria-hidden="true"><span data-bn></span><button class="l-btn sm" type="button" data-bx="Reminders sent.">Send reminders</button><button class="l-btn sm" type="button" data-bx="Marked as paid.">Mark paid</button><button class="l-ib" type="button" aria-label="Clear picks" data-bc>${X}</button></div>`),
    css: `#t12B .t12-bar { position: absolute; left: 50%; bottom: 14px; z-index: 6; display: flex; align-items: center; gap: 8px; padding: 8px 8px 8px 14px; border-radius: 12px; background: var(--ink); color: var(--paper); box-shadow: var(--shadow-lg); font-size: 13.5px; white-space: nowrap; transform: translate(-50%, 140%); opacity: 0; visibility: hidden; transition: transform .25s var(--ease-out), opacity .2s, visibility 0s linear .25s; }
#t12B .t12-bar.is-on { transform: translate(-50%, 0); opacity: 1; visibility: visible; transition: transform var(--sp-snappy-d) var(--sp-snappy), opacity .2s, visibility 0s; }
#t12B .t12-bar .l-btn { background: transparent; color: var(--paper); border-color: rgb(255 255 255 / .25); box-shadow: none; }
#t12B .t12-bar .l-ib { width: 30px; height: 30px; background: transparent; color: var(--paper); border-color: transparent; box-shadow: none; }
html[data-theme="dark"] #t12B .t12-bar .l-btn { border-color: rgb(0 0 0 / .2); }`,
    js: `var bar = $('[data-bar]', box), bn = $('[data-bn]', box), api = TLtable(box, { flip: true, after_render: function (n) { var on = n.length > 0; bar.classList.toggle('is-on', on); bar.setAttribute('aria-hidden', String(!on)); $$('button', bar).forEach(function (b) { b.tabIndex = on ? 0 : -1; }); bn.textContent = n.length + ' picked'; } });
$$('[data-bx]', bar).forEach(function (b) { b.addEventListener('click', function () { $('[data-foot]', box).textContent = b.getAttribute('data-bx'); api.clear(); }); });
$('[data-bc]', bar).addEventListener('click', function () { api.clear(); });`,
  },
  {
    k: 'C', name: 'Roomy or compact, rows that open', line: 'A switch for row height, rows that open to show the items and the phone number, and rows that glide when sorted.',
    from: [ez('advanced-data-table'), ez('expandable-data-row'), be('table')], tryit: 'Switch to Compact. Open the row for #4818.',
    needs: 'CSS, script and the Web Animations API.', keys: 'The open arrow is a button with aria-expanded.', off: 'Rows open at once.', law: 'Proximity: details open right under their row.',
    tags: ['motion:some', 'speed:mid', 'density:compact', 'feedback:clear', 'look:ember'], wide: true, h: 520,
    html: tableHtml('<div class="t12-top"><p class="l-muted">October invoices</p><div class="seg" role="group" aria-label="Row height"><button type="button" aria-pressed="true" data-den="roomy">Roomy</button><button type="button" aria-pressed="false" data-den="compact">Compact</button></div></div>', '<th class="r"><span class="sr">Open</span></th>'),
    css: `#t12C .t12.is-compact td { height: 32px; font-size: 13px; }
#t12C .t12.is-compact th { height: 32px; }
#t12C .ex { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 6px; color: var(--muted); margin-left: auto; }
#t12C .ex:hover { background: rgb(var(--ink-rgb) / .06); }
#t12C .ex svg { width: 14px; height: 14px; transition: transform .3s var(--ease-out); }
#t12C .ex[aria-expanded="true"] svg { transform: rotate(180deg); }
#t12C tr.det td { height: auto; padding: 0; background: var(--paper); white-space: normal; }
#t12C tr.det .in { padding: 12px 52px 14px; display: grid; grid-template-columns: repeat(3, auto); gap: 6px 26px; justify-content: start; font-size: 13px; color: var(--ink-soft); }
#t12C tr.det b { display: block; font-size: 11px; font-family: var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--muted); font-weight: 500; }
#t12C .seg button { min-height: 32px; }`,
    js: `var open = {}, CH = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>', ITEMS = { '4821': 'Sukuma, unga, oil', '4820': 'Rice 10 kg, sugar', '4819': 'Bread, milk', '4818': 'Soap, flour, eggs', '4817': 'Maize meal 20 kg', '4816': 'Tea, sugar', '4815': 'Wholesale crate', '4814': 'Cooking gas refill' }, last = null;
var api = TLtable(box, { flip: true, extra: function (r) { return '<td class="r"><button class="ex" type="button" aria-expanded="' + !!open[r[0]] + '" aria-label="Details for invoice ' + r[0] + '">' + CH + '</button></td>'; },
  after: function (r) { return open[r[0]] ? '<tr class="det" data-det="' + r[0] + '"><td colspan="7"><div class="in"><span><b>Items</b>' + ITEMS[r[0]] + '</span><span><b>Phone</b>07' + r[0].slice(1) + ' 112 ' + r[0].slice(2) + '</span><span><b>Paid by</b>' + (r[3] === 'Paid' ? 'PocketPay' : 'Not yet') + '</span></div></td></tr>' : ''; },
  row: function (tr) { $('.ex', tr).addEventListener('click', function () { var id = tr.dataset.id; open[id] = !open[id]; last = open[id] ? id : null; api.render(); var b = $('tr[data-id="' + id + '"] .ex', box); if (b) b.focus(); if (last && moving()) { var d = $('[data-det="' + last + '"] .in', box); if (d) d.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' }); } }); } });
$$('[data-den]', box).forEach(function (b) { b.addEventListener('click', function () { $$('[data-den]', box).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); $('.t12', box).classList.toggle('is-compact', b.getAttribute('data-den') === 'compact'); }); });`,
  },
  {
    k: 'D', name: 'Search, then move and edit like a spreadsheet', line: 'Your c15, pushed: a search box on top, and the amount cells work like a spreadsheet. Arrow keys move a cell outline, Enter edits, Escape cancels.',
    from: [house('c15'), be('table-editable')], tryit: 'Search "Due". Click an amount, use the arrows, press Enter, type, Enter.',
    needs: 'CSS and script.', keys: 'Arrows move between amounts, Enter edits and saves, Escape cancels.', off: 'Same; the outline jumps.', law: 'Jakob: Excel keys, which many shop owners know.',
    tags: ['motion:still', 'speed:quick', 'density:compact', 'new:twist', 'look:ember'], wide: true, h: 500,
    html: tableHtml('<div class="t12-top"><label class="sr" for="t12D-q">Search invoices</label><input class="l-in t12-q" id="t12D-q" type="search" placeholder="Search name, number or status" data-q><p class="l-muted">Amounts are editable</p></div>'),
    css: `#t12D .t12-q { max-width: 280px; height: 36px; }
#t12D .amt { display: inline-block; min-width: 80px; padding: 4px 6px; margin: -4px -6px; border-radius: 6px; cursor: cell; outline: 0; }
#t12D .amt:focus { box-shadow: inset 0 0 0 2px var(--accent); }
#t12D .amt input { width: 90px; font: inherit; text-align: right; border: 0; background: var(--paper); color: var(--ink); padding: 0; outline: 0; }
#t12D .amt.saved { background: rgb(var(--accent-rgb) / .1); transition: background-color 1.2s; }`,
    js: `var api = TLtable(box, { cell: function (r, c) { return c === 2 ? '<span class="amt num" tabindex="-1" data-amt="' + r[0] + '">' + TLmoney(r[2]) + '</span>' : null; }, row: function () {} });
var tb = $('tbody', box), cur = null;
function cells() { return $$('[data-amt]', tb); }
function focusCell(i) { var cs = cells(); if (!cs.length) return; i = Math.max(0, Math.min(cs.length - 1, i)); cs.forEach(function (c, j) { c.tabIndex = j === i ? 0 : -1; }); cs[i].focus(); cur = cs[i].dataset.amt; }
function edit(c) { var id = c.dataset.amt, r = TLrows.filter(function (x) { return x[0] === id; })[0]; c.innerHTML = '<input inputmode="numeric" aria-label="Amount for invoice ' + id + '" value="' + r[2] + '">'; var inp = $('input', c); inp.focus(); inp.select();
  inp.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Enter') { var v = parseInt(inp.value.replace(/[^0-9]/g, ''), 10); if (!isNaN(v)) r[2] = v; done(true); } else if (e.key === 'Escape') done(false); });
  inp.addEventListener('blur', function () { if (inp.isConnected) done(false); });
  function done(saved) { var i = cells().indexOf(c); api.render(); var n = cells()[i]; if (n) { focusCell(i); if (saved) { n.classList.add('saved'); setTimeout(function () { n.classList.remove('saved'); }, 50); $('[data-foot]', box).textContent = 'Invoice #' + id + ' is now KES ' + TLmoney(r[2]) + '.'; } } } }
tb.addEventListener('click', function (e) { var c = e.target.closest('[data-amt]'); if (c && !$('input', c)) focusCell(cells().indexOf(c)); });
tb.addEventListener('dblclick', function (e) { var c = e.target.closest('[data-amt]'); if (c) edit(c); });
tb.addEventListener('keydown', function (e) { var c = e.target.closest && e.target.closest('[data-amt]'); if (!c || $('input', c)) return; var i = cells().indexOf(c); if (e.key === 'ArrowDown') { e.preventDefault(); focusCell(i + 1); } else if (e.key === 'ArrowUp') { e.preventDefault(); focusCell(i - 1); } else if (e.key === 'Enter') { e.preventDefault(); edit(c); } });
$('[data-q]', box).addEventListener('input', function (e) { api.setQ(e.target.value); });
var f0 = cells()[0]; if (f0) f0.tabIndex = 0;`,
  },
  {
    k: 'E', name: 'No lines, big serif numbers', line: 'Steps outside ember: no borders or boxes, wide rows, amounts in large serif numbers and the status in italic words, like a printed ledger.',
    from: [['Printed ledgers and annual reports', null]], tryit: 'Sort by Amount and tick a row.',
    needs: 'Plain CSS.', keys: 'Same as A.', off: 'Same.', law: 'Proximity: space alone makes the rows.',
    tags: ['motion:still', 'density:roomy', 'depth:flat', 'new:novel', 'look:off'], wide: true, h: 590,
    html: tableHtml(), css: `#t12E .t12-sc { border: 0; background: transparent; border-radius: 0; }
#t12E th { border-bottom: 1.5px solid var(--ink); font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink); }
#t12E td { border-bottom: 0; height: 54px; font-family: var(--font-display); font-size: 16px; }
#t12E td.num { font-family: var(--font-display); font-size: 21px; font-variant-numeric: lining-nums tabular-nums; }
#t12E .stt { font-style: italic; font-size: 15px; }
#t12E .stt::before { display: none; }
#t12E tbody tr:hover { background: transparent; }
#t12E tbody tr[aria-selected="true"] td { text-decoration: underline; text-decoration-color: var(--accent); text-underline-offset: 6px; }
#t12E tbody tr[aria-selected="true"] { background: transparent; }
#t12E .cb { border-radius: 0; border-color: var(--ink); }`,
    js: `TLtable(box);`,
  },
];

export default [modal, drawer, toast, table];
