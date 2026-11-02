// Batch 1: buttons, form fields, select, switches and checkboxes.
import { sh, be, ez, radix, house, skill } from './src-links.mjs';

const TICK = '<svg class="l-tick draw" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="11"/><path d="M6.6 11.4 9.6 14.3l5.8-6.4"/></svg>';
const CHEV = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHECK = '<svg class="ck" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.4 6.6 11.3 12.5 4.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* ---------------- 01 Buttons ---------------- */
const payRow = (main, extra = '') => `<div class="b01"><div class="b01-row">${main}<button class="l-btn" type="button" data-draft>Save draft</button>${extra}</div><p class="l-muted b01-msg" data-msg aria-live="polite"></p></div>`;
const draftJs = `var msg = $('[data-msg]', box), dr = $('[data-draft]', box); if (dr) dr.addEventListener('click', function () { msg.textContent = 'Draft saved at ' + new Date().toTimeString().slice(0, 5) + '.'; });`;
const buttons = {
  id: 'buttons', n: '01', name: 'Buttons', h: 200,
  claim: 'A button should <em>feel pressed</em>, and say what it is doing.',
  lead: 'Every version pays the same order. Press "Pay KES 4,200" and watch how it presses, waits and says it is done.',
  ref: { ids: 'c14 · n15', text: 'One big orange button with a light that runs round its edge, and a split button with a choice beside it.' },
  noteHint: 'C, but with the light from D', moreHint: 'buttons that show progress',
  css: `.b01 { display: grid; gap: 14px; justify-items: center; text-align: center; }
.b01-row { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; position: relative; }
.b01-msg { min-height: 1.4em; margin: 0; }`,
  opts: [
    {
      k: 'A', name: 'Quiet press, spinner while it works', line: 'The shadcn button: shrinks a little on press, shows a spinner and "Paying…", then says "Paid".',
      from: [sh('button'), sh('spinner', 'shadcn/ui spinner')], tryit: 'Press Pay, then Save draft.',
      needs: 'Plain CSS. About 10 lines of script.', keys: 'Tab to it, Enter or Space presses.', off: 'No shrink, and the spinner stands still. The words still change.', law: 'Fitts: 40 px tall, 44 px on touch.',
      tags: ['motion:still', 'speed:quick', 'feedback:quiet', 'new:familiar', 'look:ember'],
      html: payRow('<button class="l-btn pri b01a" type="button" data-pay>Pay KES 4,200</button>'),
      css: `#t01A .b01a { min-width: 150px; }`,
      js: `${draftJs}
var pay = $('[data-pay]', box), label = pay.innerHTML;
pay.addEventListener('click', function () {
  if (pay.dataset.busy) return; pay.dataset.busy = '1'; pay.setAttribute('aria-disabled', 'true'); msg.textContent = '';
  pay.innerHTML = '<span class="l-spin" aria-hidden="true"></span>Paying…';
  setTimeout(function () { pay.textContent = 'Paid'; msg.textContent = 'KES 4,200 paid to Duka Fresh.';
    setTimeout(function () { pay.innerHTML = label; delete pay.dataset.busy; pay.removeAttribute('aria-disabled'); }, 2200); }, 1400);
});`,
    },
    {
      k: 'B', name: 'Words that roll, a tick that pops', line: 'From beUI\'s stateful button: each state rolls in from below, with a springy press and three bouncing dots while it works.',
      from: [be('button-stateful'), be('button-base')], tryit: 'Press Pay. Hold the press down to feel the spring when you let go.',
      needs: 'CSS springs (made in the page, no library).', keys: 'Enter or Space. The state is read out.', off: 'Words swap at once. Dots stay still.', law: 'Jakob: works like any button.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: payRow(`<button class="l-btn pri b01b" type="button" data-pay aria-live="polite"><span class="st is-on" data-s="idle">Pay KES 4,200</span><span class="st" data-s="load" aria-label="Paying"><i></i><i></i><i></i></span><span class="st" data-s="done"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.4 6.6 11.3 12.5 4.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Paid</span></button>`),
      css: `#t01B .b01b { display: grid; min-width: 168px; overflow: hidden; transition: transform var(--sp-bouncy-d) var(--sp-bouncy), background-color .2s; }
#t01B .b01b:active { transform: scale(.94); transition-duration: .1s; transition-timing-function: var(--ease-out); }
#t01B .st { grid-area: 1 / 1; display: flex; align-items: center; justify-content: center; gap: 6px; opacity: 0; transform: translateY(14px) scale(.9); transition: opacity .18s var(--ease-out), transform var(--sp-bouncy-d) var(--sp-bouncy); }
#t01B .st.is-on { opacity: 1; transform: none; }
#t01B .st.is-out { transform: translateY(-14px) scale(.9); }
#t01B .st i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; animation: b01dot .9s var(--ease-in-out) infinite; }
#t01B .st i:nth-child(2) { animation-delay: .12s; } #t01B .st i:nth-child(3) { animation-delay: .24s; }
@keyframes b01dot { 40% { transform: translateY(-5px); } }`,
      js: `${draftJs}
var pay = $('[data-pay]', box), cur = 'idle';
function to(s) { var a = $('[data-s="' + cur + '"]', pay), b = $('[data-s="' + s + '"]', pay); a.classList.remove('is-on'); a.classList.add('is-out'); setTimeout(function () { a.classList.remove('is-out'); }, 400); b.classList.add('is-on'); cur = s; }
pay.addEventListener('click', function () {
  if (cur !== 'idle') return; to('load'); msg.textContent = '';
  setTimeout(function () { to('done'); msg.textContent = 'KES 4,200 paid to Duka Fresh.'; setTimeout(function () { to('idle'); }, 2200); }, 1400);
});`,
    },
    {
      k: 'C', name: 'Squash, a line that fills, a tick that draws', line: 'easyui\'s press squash, plus our own progress line: a thin bar fills across the button while it works, then the button turns into a drawn orange tick.',
      from: [ez('press-button'), ez('morphing-button'), skill('animate')], tryit: 'Press Pay and watch the line run along the bottom.',
      needs: 'Plain CSS and a few lines of script.', keys: 'Enter or Space.', off: 'No squash, the line shows full, the tick shows drawn.', law: 'Proximity: the progress sits inside the button you pressed.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'depth:flat', 'look:ember'],
      html: payRow('<button class="l-btn pri b01c" type="button" data-pay><span class="lb" data-l>Pay KES 4,200</span><span class="ln" aria-hidden="true"></span></button>'),
      css: `#t01C .b01c { position: relative; min-width: 170px; overflow: hidden; transition: transform var(--sp-snappy-d) var(--sp-snappy), background-color .25s, color .25s, border-color .25s; }
#t01C .b01c:active { transform: scale(.96, .9); transition-duration: .12s; }
#t01C .lb { display: inline-flex; align-items: center; gap: 8px; transition: opacity .12s; }
#t01C .lb.is-swap { opacity: 0; }
#t01C .ln { position: absolute; left: 12px; right: 12px; bottom: 6px; height: 2px; border-radius: 2px; background: currentColor; opacity: 0; transform: scaleX(0); transform-origin: left; }
#t01C .is-load .ln { opacity: .7; transform: scaleX(1); transition: transform 1.4s cubic-bezier(.3, .1, .3, 1), opacity .2s; }
#t01C .b01c.is-done { background: var(--paper-raised); color: var(--ink); border-color: var(--line-hi); }`,
      js: `${draftJs}
var pay = $('[data-pay]', box), lb = $('[data-l]', pay);
function say(h) { lb.classList.add('is-swap'); setTimeout(function () { lb.innerHTML = h; lb.classList.remove('is-swap'); }, moving() ? 120 : 0); }
pay.addEventListener('click', function () {
  if (pay.dataset.busy) return; pay.dataset.busy = '1'; msg.textContent = ''; pay.classList.add('is-load'); say('Paying…');
  setTimeout(function () { pay.classList.remove('is-load'); pay.classList.add('is-done'); say(TICK + 'Paid'); msg.textContent = 'KES 4,200 paid to Duka Fresh.';
    setTimeout(function () { pay.classList.remove('is-done'); say('Pay KES 4,200'); delete pay.dataset.busy; }, 2400); }, 1450);
});`,
    },
    {
      k: 'D', name: 'The edge light, with a choice beside it', line: 'Your c14 light and n15 split button in one. Pushed: the light runs faster while it pays, so the edge is the busy sign.',
      from: [house('c14'), house('n15'), radix('dropdown-menu')], tryit: 'Point at Pay. Open the arrow, pick "Pay in 2 parts", then pay.',
      needs: 'Plain CSS and script.', keys: 'Arrow button: Enter opens, arrows move, Enter picks, Escape closes.', off: 'The light stays still as a bright corner.', law: 'Hick: the rare ways to pay hide behind the arrow.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'open:trigger', 'look:ember'], top: true, h: 230,
      html: `<div class="b01"><div class="b01d"><button class="b01d-main" type="button" data-pay><span class="edge" aria-hidden="true"></span><span class="fill" aria-hidden="true"></span><span class="lb" data-l>Pay KES 4,200</span></button><button class="b01d-arr" type="button" aria-label="More ways to pay" aria-haspopup="menu" data-arr>${CHEV}</button>
<div class="l-panel l-pop b01d-menu" role="menu" aria-label="Ways to pay" data-menu><button class="l-item" type="button" role="menuitemradio" aria-checked="true" data-way="Pay KES 4,200">Pay now<span class="sc">KES 4,200</span></button><button class="l-item" type="button" role="menuitemradio" aria-checked="false" data-way="Pay KES 2,100 now">Pay in 2 parts<span class="sc">2 × 2,100</span></button><button class="l-item" type="button" role="menuitemradio" aria-checked="false" data-way="Pay on Friday">Schedule for Friday<span class="sc">7 Nov</span></button></div></div><p class="l-muted b01-msg" data-msg aria-live="polite"></p></div>`,
      css: `#t01D .b01d { position: relative; display: flex; }
#t01D .b01d-main { position: relative; overflow: hidden; height: 46px; min-width: 190px; padding: 0 20px; border-radius: 11px 0 0 11px; color: var(--on-accent); font-weight: 600; font-size: 15px; transition: transform .15s var(--ease-out); }
#t01D .b01d-main:active, #t01D .b01d-arr:active { transform: scale(.97); }
#t01D .edge { position: absolute; left: 50%; top: 50%; width: 260px; height: 260px; margin: -130px 0 0 -130px; background: conic-gradient(from 0deg, transparent 0 70%, rgb(255 255 255 / .95) 86%, transparent 100%); opacity: 0; transition: opacity .3s; animation: l-spin 2.6s linear infinite; }
#t01D .b01d-main:hover .edge, #t01D .b01d-main:focus-visible .edge, #t01D .is-load .edge { opacity: 1; }
#t01D .is-load .edge { animation-duration: .8s; }
#t01D .fill { position: absolute; inset: 1.5px; border-radius: 9.5px 0 0 9.5px; background: var(--accent); }
#t01D .lb { position: relative; display: inline-flex; align-items: center; gap: 8px; }
#t01D .b01d-arr { width: 42px; height: 46px; display: grid; place-items: center; border-radius: 0 11px 11px 0; background: var(--accent); color: var(--on-accent); border-left: 1px solid rgb(0 0 0 / .18); transition: transform .15s var(--ease-out); }
#t01D .b01d-arr svg { width: 16px; height: 16px; transition: transform .25s var(--ease-out); }
#t01D .b01d-arr[aria-expanded="true"] svg { transform: rotate(180deg); }
#t01D .b01d-menu { position: absolute; right: 0; top: calc(100% + 6px); width: 230px; z-index: 6; transform-origin: top right; --from: translateY(-4px) scale(.96); }
#t01D .l-item[aria-checked="true"] { font-weight: 600; }
#t01D .l-item[aria-checked="true"]::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); margin-right: -2px; }`,
      js: `${draftJs}
var pay = $('[data-pay]', box), lb = $('[data-l]', pay), menu = $('[data-menu]', box), arr = $('[data-arr]', box), label = 'Pay KES 4,200';
var p = pop(arr, menu, { arrowOpen: true, focus: function () { return $('[aria-checked="true"]', menu); } });
nav(menu, '.l-item', { focus: true, loop: true });
$$('.l-item', menu).forEach(function (it) { it.addEventListener('click', function () { $$('.l-item', menu).forEach(function (x) { x.setAttribute('aria-checked', String(x === it)); }); label = it.getAttribute('data-way'); lb.textContent = label; p.set(false); }); });
pay.addEventListener('click', function () {
  if (pay.dataset.busy) return; pay.dataset.busy = '1'; msg.textContent = ''; pay.classList.add('is-load'); lb.textContent = 'Paying…';
  setTimeout(function () { pay.classList.remove('is-load'); lb.innerHTML = 'Paid'; msg.textContent = label.indexOf('Friday') > 0 ? 'Payment set for Friday 7 November.' : 'Paid to Duka Fresh.';
    setTimeout(function () { lb.textContent = label; delete pay.dataset.busy; }, 2200); }, 1500);
});`,
    },
    {
      k: 'E', name: 'Square block with a hard shadow', line: 'Steps outside ember: no round corners, a solid ink shadow, upper-case mono letters. Pressing pushes the block into its shadow.',
      from: [['Neo-brutalist web style', null], ez('press-button', 'easyui press (idea)')], tryit: 'Press both buttons. Watch the block drop into its shadow.',
      needs: 'Plain CSS.', keys: 'Enter or Space.', off: 'Same. It never animated; the press is instant on purpose.', law: 'Fitts: 44 px tall everywhere.',
      tags: ['motion:still', 'speed:quick', 'depth:some', 'new:novel', 'look:off'],
      html: `<div class="b01"><div class="b01-row"><button class="b01e" type="button" data-pay><span data-l>PAY KES 4,200</span></button><button class="b01e b01e-2" type="button" data-draft>SAVE DRAFT</button></div><p class="b01-msg b01e-msg" data-msg aria-live="polite"></p></div>`,
      css: `#t01E .b01e { height: 44px; padding: 0 18px; border: 2px solid var(--ink); border-radius: 0; background: var(--accent); color: var(--on-accent); font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: .06em; box-shadow: 5px 5px 0 var(--ink); }
#t01E .b01e-2 { background: var(--paper-raised); color: var(--ink); }
#t01E .b01e:active { transform: translate(5px, 5px); box-shadow: none; }
#t01E .b01e-msg { font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: var(--ink-soft); }`,
      js: `${draftJs}
var pay = $('[data-pay]', box), lb = $('[data-l]', pay);
pay.addEventListener('click', function () {
  if (pay.dataset.busy) return; pay.dataset.busy = '1'; msg.textContent = ''; var n = 0;
  var t = setInterval(function () { n++; lb.textContent = 'PAYING ' + '■■■■'.slice(0, n % 5) + '□□□□'.slice(0, 4 - n % 5); }, 220);
  setTimeout(function () { clearInterval(t); lb.textContent = 'PAID ✓'; msg.textContent = 'KES 4,200 paid to Duka Fresh';
    setTimeout(function () { lb.textContent = 'PAY KES 4,200'; delete pay.dataset.busy; }, 2200); }, 1500);
});`,
    },
    {
      k: 'F', name: 'Hold to pay', line: 'From beUI\'s hold button: press and hold for one second while the button fills. Let go early and nothing happens.',
      from: [be('hold-action-button')], tryit: 'Press and hold. Then try letting go halfway.',
      needs: 'Plain CSS and script.', keys: 'Hold Space or Enter.', off: 'The fill shows at once, and the words count you through.', law: 'Fitts and Jakob both bend: holding is slower and less familiar. Only for money or deleting.',
      tags: ['motion:some', 'speed:slow', 'feedback:loud', 'new:novel', 'look:ember'],
      html: `<div class="b01"><button class="b01f" type="button" data-hold aria-describedby="t01F-d"><span class="fl" aria-hidden="true"></span><span class="lb" data-l>Hold to pay KES 4,200</span></button><p class="l-muted b01-msg" id="t01F-d" data-msg aria-live="polite">Press and hold for one second.</p></div>`,
      css: `#t01F .b01f { position: relative; overflow: hidden; height: 48px; padding: 0 24px; border-radius: 12px; border: 1px solid var(--line-hi); background: var(--paper-raised); color: var(--ink); font-weight: 600; box-shadow: var(--shadow-sm); touch-action: none; user-select: none; -webkit-user-select: none; }
#t01F .fl { position: absolute; inset: 0; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform .35s var(--ease-out); }
#t01F .is-hold .fl, #t01F .is-done .fl { transform: scaleX(1); transition: transform 1s linear; }
#t01F .is-done .fl { transition: none; }
#t01F .lb { position: relative; display: inline-flex; align-items: center; gap: 8px; }
#t01F .is-done { color: var(--on-accent); }`,
      js: `var b = $('[data-hold]', box), lb = $('[data-l]', b), msg = $('[data-msg]', box), t = null, done = false;
function start() { if (done || t) return; b.classList.add('is-hold'); lb.textContent = 'Keep holding…'; t = setTimeout(finish, 1000); }
function stop() { if (!t) return; clearTimeout(t); t = null; b.classList.remove('is-hold'); lb.textContent = 'Hold to pay KES 4,200'; msg.textContent = 'Let go too early. Hold for one second.'; }
function finish() { t = null; done = true; b.classList.remove('is-hold'); b.classList.add('is-done'); lb.textContent = 'Paid'; msg.textContent = 'KES 4,200 paid to Duka Fresh.';
  setTimeout(function () { done = false; b.classList.remove('is-done'); lb.textContent = 'Hold to pay KES 4,200'; msg.textContent = 'Press and hold for one second.'; }, 2400); }
b.addEventListener('pointerdown', function (e) { b.setPointerCapture(e.pointerId); start(); });
b.addEventListener('pointerup', stop); b.addEventListener('pointercancel', stop);
b.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start(); } else if (e.key === ' ' || e.key === 'Enter') e.preventDefault(); });
b.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') stop(); });
b.addEventListener('blur', stop);`,
    },
  ],
};

/* ---------------- 02 Form field with errors ---------------- */
const formHtml = (id, cls = '', extra = '') => `<form class="f02 ${cls}" novalidate>${extra}
<div class="fl"><label class="l-lbl" for="${id}-e">Email</label><div class="iw"><input class="l-in" id="${id}-e" data-f="e" type="email" autocomplete="off" spellcheck="false" aria-describedby="${id}-em"></div><p class="l-help" id="${id}-em" data-m="e">We send receipts here.</p></div>
<div class="fl"><label class="l-lbl" for="${id}-p">Password</label><div class="iw"><input class="l-in" id="${id}-p" data-f="p" type="password" autocomplete="new-password" aria-describedby="${id}-pm"></div><p class="l-help" id="${id}-pm" data-m="p">8 or more characters.</p></div>
<button class="l-btn pri f02-go" type="submit">Create account</button><p class="f02-ok" data-ok aria-live="polite"></p></form>`;
const fields = {
  id: 'fields', n: '02', name: 'Form field with errors', h: 340,
  claim: 'An error should say <em>how to fix it</em>, right where you look.',
  lead: 'One sign-up form, five ways to show what went wrong. Press "Create account" with the boxes empty, then fix them one by one.',
  ref: { ids: 'c11', text: 'Sign in, and see what went wrong: errors under each field after you press the button.' },
  noteHint: 'C\'s timing, but A\'s calm look', moreHint: 'forms with many fields',
  css: `.f02 { width: min(100%, 320px); display: grid; gap: 14px; text-align: left; }
.f02 .iw { position: relative; }
.f02-go { justify-self: start; }
.f02-ok { margin: 0; min-height: 22px; display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--ink-soft); }
.f02 .l-help, .f02 .l-err { min-height: 18px; }`,
  js: `window.TLX = '<svg class="l-x" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5"/></svg>';
window.TLform = function (box, o) {
  var form = $('form', box), f = { e: $('[data-f="e"]', box), p: $('[data-f="p"]', box) }, tried = false, left = {}, help = {};
  ['e', 'p'].forEach(function (k) { help[k] = $('[data-m="' + k + '"]', box).textContent; });
  function msg(k, v) { if (k === 'e') { if (!v) return 'Enter your email.'; if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(v)) return 'Enter an email like amina@example.com.'; return ''; } if (!v) return 'Enter a password.'; if (v.length < 8) return 'Use 8 or more characters. You have ' + v.length + '.'; return ''; }
  function show(k) { var inp = f[k], m = msg(k, inp.value), on = !!m && (tried || left[k]); inp.setAttribute('aria-invalid', on ? 'true' : 'false'); o.show(k, $('[data-m="' + k + '"]', box), on ? m : '', help[k], !m, inp); return m; }
  form.addEventListener('submit', function (e) {
    e.preventDefault(); tried = true; var bad = ['e', 'p'].filter(function (k) { return show(k); });
    if (o.submit) o.submit(bad, f); var ok = $('[data-ok]', box);
    if (bad.length) { ok.textContent = ''; f[bad[0]].focus(); } else { ok.innerHTML = '<svg class="l-tick draw" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="11"/><path d="M6.6 11.4 9.6 14.3l5.8-6.4"/></svg>Account made for ' + f.e.value.replace(/[<>&"]/g, '') + '.'; }
  });
  ['e', 'p'].forEach(function (k) {
    f[k].addEventListener('input', function () { if (o.live) o.live(k, f[k].value); if (tried || left[k]) show(k); });
    f[k].addEventListener('blur', function () { if (o.onLeave && f[k].value) { left[k] = true; show(k); } if (o.blur) o.blur(k, f[k], !msg(k, f[k].value)); });
  });
  return { msg: msg, f: f };
};
window.TLplain = function (k, el, m, help) { el.className = m ? 'l-err' : 'l-help'; el.innerHTML = m ? TLX + m : help; };`,
  opts: [
    {
      k: 'A', name: 'Check on submit, then as you type', line: 'The shadcn form: nothing shows until you press the button. Then each error sits under its field and clears as you fix it.',
      from: [sh('form'), sh('field', 'shadcn/ui field')], tryit: 'Press Create account empty, then type an email.',
      needs: 'Plain HTML and a little script.', keys: 'Enter sends. Focus jumps to the first error.', off: 'Nothing moves anyway.', law: 'Proximity: each error hugs its own field.',
      tags: ['motion:still', 'feedback:quiet', 'density:mid', 'new:familiar', 'look:ember'],
      html: formHtml('t02A'),
      js: `TLform(box, { show: TLplain });`,
    },
    {
      k: 'B', name: 'A shake when wrong, a tick when right', line: 'From beUI\'s input: a wrong field gives a small shake when you press the button, and a good one draws a tick inside the box.',
      from: [be('input')], tryit: 'Press Create account empty. Then fill the email and leave the box.',
      needs: 'CSS and script.', keys: 'Enter sends.', off: 'No shake. The tick shows without drawing.', law: 'Jakob: shake means "no" on phones and laptops alike.',
      tags: ['motion:springy', 'speed:quick', 'feedback:loud', 'new:twist', 'look:ember'],
      html: formHtml('t02B'),
      css: `#t02B .shake { animation: f02shake .42s var(--ease-out); }
@keyframes f02shake { 15% { transform: translateX(-6px); } 35% { transform: translateX(5px); } 55% { transform: translateX(-3px); } 75% { transform: translateX(2px); } }
#t02B .okt { position: absolute; right: 10px; top: 9px; width: 22px; height: 22px; pointer-events: none; }
#t02B .l-in { padding-right: 38px; }`,
      js: `TLform(box, { show: function (k, el, m, help, valid, inp) { TLplain(k, el, m, help); var w = inp.parentNode, t = $('.okt', w); if (!valid && t) t.remove(); },
  submit: function (bad, f) { bad.forEach(function (k) { var w = f[k].parentNode; w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake'); }); },
  blur: function (k, inp, valid) { var w = inp.parentNode, t = $('.okt', w); if (valid && !t) w.insertAdjacentHTML('beforeend', TICK.replace('l-tick draw', 'l-tick draw okt')); if (!valid && t) t.remove(); } });`.replace('TICK', JSON.stringify(TICK)),
    },
    {
      k: 'C', name: 'Flag on leave, clear on fix, a strength line', line: 'beUI\'s sign-up form rule: a field is only marked wrong once you leave it, and it clears the moment it is right. The password gets an orange strength line.',
      from: [be('signup-form'), sh('field', 'shadcn/ui field'), skill('animate')], tryit: 'Type "ami" in Email and press Tab. Then type a password slowly.',
      needs: 'CSS and script.', keys: 'Tab moves on, and that is when it checks.', off: 'Help and error swap at once.', law: 'Jakob: the most common rule on good sign-up forms.',
      tags: ['motion:some', 'speed:quick', 'feedback:clear', 'new:familiar', 'look:ember'],
      html: formHtml('t02C', '', ''),
      css: `#t02C .f02 [data-m] { display: grid; }
#t02C .f02 [data-m] > span { grid-area: 1 / 1; display: flex; gap: 6px; align-items: center; transition: opacity .18s var(--ease-out), transform .25s var(--ease-out); }
#t02C .f02 [data-m] > .x { color: var(--accent-text); opacity: 0; transform: translateY(-4px); }
#t02C .f02 [data-m].bad > .x { opacity: 1; transform: none; }
#t02C .f02 [data-m].bad > .h { opacity: 0; transform: translateY(4px); }
#t02C .meter { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-top: 6px; }
#t02C .meter i { height: 3px; border-radius: 3px; background: var(--line); position: relative; overflow: hidden; }
#t02C .meter i::after { content: ""; position: absolute; inset: 0; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform .3s var(--ease-out); }
#t02C .meter i.on::after { transform: scaleX(1); }`,
      js: `var mm = $('[data-m="p"]', box); mm.insertAdjacentHTML('beforebegin', '<div class="meter" aria-hidden="true"><i></i><i></i><i></i><i></i></div>');
$$('[data-m]', box).forEach(function (el) { el.className = 'l-help'; el.innerHTML = '<span class="h">' + el.textContent + '</span><span class="x"></span>'; });
TLform(box, { onLeave: true,
  show: function (k, el, m) { el.classList.toggle('bad', !!m); if (m) $('.x', el).innerHTML = TLX + m; },
  live: function (k, v) { if (k !== 'p') return; var s = Math.min(4, Math.floor(v.length / 3) + (/[0-9]/.test(v) ? 1 : 0) + (/[^a-zA-Z0-9]/.test(v) ? 1 : 0)); if (!v) s = 0; $$('.meter i', box).forEach(function (i, j) { i.classList.toggle('on', j < s); }); } });`,
    },
    {
      k: 'D', name: 'A to-do list of fixes that counts down', line: 'Your c11 errors, pushed: a short list at the top says "2 things to fix" and links to each field. It counts down as you fix them.',
      from: [house('c11'), ['GOV.UK error summary', 'https://design-system.service.gov.uk/components/error-summary/']], tryit: 'Press Create account empty, click a line in the list, then fix both.',
      needs: 'CSS and script.', keys: 'Each line in the list is a button that moves focus to its field.', off: 'The list appears without its slide.', law: 'Hick: one short list instead of hunting for red boxes.',
      tags: ['motion:some', 'feedback:loud', 'density:mid', 'new:twist', 'look:ember'], h: 380,
      html: formHtml('t02D', '', '<div class="sumx" data-sum role="alert" hidden></div>'),
      css: `#t02D .sumx { padding: 10px 12px; border-radius: 10px; border: 1px solid rgb(var(--accent-rgb) / .35); background: rgb(var(--accent-rgb) / .06); font-size: 13.5px; animation: l-fadeup .3s var(--ease-out); }
#t02D .sumx b { display: flex; align-items: center; gap: 8px; color: var(--ink); }
#t02D .sumx button { display: block; color: var(--accent-text); font-size: 13px; padding: 2px 0 0 22px; text-align: left; text-decoration: underline; text-underline-offset: 2px; }
#t02D .sumx.is-ok { border-color: var(--line); background: var(--paper-raised); }`,
      js: `var sum = $('[data-sum]', box), tried = false, api;
function draw() { if (!tried) return; var bad = ['e', 'p'].map(function (k) { return [k, api.msg(k, api.f[k].value)]; }).filter(function (x) { return x[1]; });
  sum.hidden = false; sum.classList.toggle('is-ok', !bad.length);
  sum.innerHTML = bad.length ? '<b>' + TLX + bad.length + (bad.length > 1 ? ' things' : ' thing') + ' to fix</b>' + bad.map(function (x) { return '<button type="button" data-go="' + x[0] + '">' + x[1] + '</button>'; }).join('') : '<b>' + ${JSON.stringify(TICK)} + 'All set. Press Create account.</b>';
  $$('[data-go]', sum).forEach(function (b) { b.addEventListener('click', function () { api.f[b.getAttribute('data-go')].focus(); }); }); }
api = TLform(box, { show: function (k, el, m, help) { TLplain(k, el, m, help); draw(); }, submit: function () { tried = true; draw(); } });`,
    },
    {
      k: 'E', name: 'Underlined lines and serif words', line: 'Steps outside ember: no boxes at all. Fields are a single line, labels are italic serif, errors read like a note in the margin.',
      from: [['Editorial print forms', null]], tryit: 'Press the link-style button with the lines empty.',
      needs: 'Plain CSS.', keys: 'Enter sends.', off: 'Nothing moves anyway.', law: 'Jakob bends: a line with no box is harder to spot as a place to type.',
      tags: ['motion:still', 'density:roomy', 'depth:flat', 'new:novel', 'look:off'],
      html: formHtml('t02E', 'f02e'),
      css: `#t02E .f02e .l-lbl { font-family: var(--font-display); font-style: italic; font-size: 17px; font-weight: 400; color: var(--ink); margin: 0; }
#t02E .f02e .l-in { border: 0; border-bottom: 1.5px solid var(--ink); border-radius: 0; background: transparent; padding: 0; height: 34px; box-shadow: none; }
#t02E .f02e .l-in:focus { border-bottom-color: var(--accent); box-shadow: 0 1.5px 0 var(--accent); }
#t02E .f02e .l-help, #t02E .f02e .l-err { font-family: var(--font-display); font-style: italic; font-size: 14px; }
#t02E .f02e .l-err .l-x { display: none; }
#t02E .f02e .l-err::before { content: "— "; }
#t02E .f02e .f02-go { background: none; color: var(--ink); border: 0; box-shadow: none; padding: 0; height: 32px; font-family: var(--font-display); font-size: 18px; text-decoration: underline; text-underline-offset: 5px; text-decoration-color: var(--accent); }
#t02E .f02e .f02-go::after { content: " →"; }`,
      js: `TLform(box, { show: TLplain });`,
    },
  ],
};

/* ---------------- 03 Select / combobox ---------------- */
const selTrig = (id, cls = '') => `<span class="l-lbl" id="${id}-l">Deliver to</span><button class="s03-tr ${cls}" type="button" id="${id}-t" aria-haspopup="listbox" aria-labelledby="${id}-l ${id}-t" data-tr><span data-v class="ph">Choose a city</span>${CHEV}</button>`;
const select = {
  id: 'select', n: '03', name: 'Select and combobox', h: 330,
  claim: 'Picking from a list should take <em>one look and one press</em>.',
  lead: 'Twelve towns to deliver to. Open each one, use the arrow keys, and pick a town.',
  ref: { ids: 'n09', text: 'A long list, found by typing: a combobox you search, then pick with Enter.' },
  noteHint: 'D\'s morph, but A\'s plain list', moreHint: 'selects with icons or pictures',
  css: `.s03 { position: relative; width: min(100%, 270px); text-align: left; }
.s03-tr { width: 100%; height: 42px; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 0 12px; border-radius: 10px; border: 1px solid var(--line-hi); background: var(--paper-raised); box-shadow: var(--shadow-sm); font-size: 15px; color: var(--ink); transition: border-color .2s, transform .15s var(--ease-out); }
.s03-tr:hover { border-color: rgb(var(--ink-rgb) / .42); }
.s03-tr .ph { color: var(--muted); }
.s03-tr svg { width: 16px; height: 16px; color: var(--muted); transition: transform .2s var(--ease-out); }
.s03-tr[aria-expanded="true"] svg { transform: rotate(180deg); }
.s03-p { position: absolute; left: 0; right: 0; top: calc(100% + 6px); z-index: 6; transform-origin: top center; }
.s03-sc { position: relative; max-height: 196px; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; }
.s03 .l-item .ck { width: 15px; height: 15px; margin-left: auto; color: var(--accent-text); opacity: 0; }
.s03 .l-item[aria-selected="true"] .ck { opacity: 1; }
.s03 .l-item[aria-selected="true"] { font-weight: 600; }
.s03-out { margin: 10px 0 0; font-size: 13px; color: var(--muted); min-height: 1.3em; }`,
  js: `window.TLcities = [['Nairobi', 'Central'], ['Thika', 'Central'], ['Nyeri', 'Central'], ['Machakos', 'Central'], ['Mombasa', 'Coast'], ['Malindi', 'Coast'], ['Lamu', 'Coast'], ['Nakuru', 'Rift Valley'], ['Eldoret', 'Rift Valley'], ['Kitale', 'Rift Valley'], ['Kisumu', 'Western'], ['Kakamega', 'Western']];
window.TLfee = { Central: 'KES 150', Coast: 'KES 350', 'Rift Valley': 'KES 250', Western: 'KES 300' };
/* A plain select: trigger, listbox, arrow keys and typeahead. */
window.TLselect = function (box, o) {
  o = o || {}; var tr = $('[data-tr]', box), panel = $('[data-panel]', box), list = $('[data-list]', box), out = $('[data-out]', box), v = $('[data-v]', box), id = box.id;
  list.innerHTML = TLcities.map(function (c, i) { return '<div class="l-item" role="option" tabindex="-1" id="' + id + '-o' + i + '" aria-selected="false" data-val="' + c[0] + '" style="--i:' + i + '">' + c[0] + ${JSON.stringify(CHECK)} + '</div>'; }).join('');
  var p = pop(tr, panel, { arrowOpen: true, onOpen: o.onOpen, onClose: o.onClose, focus: function () { return $('[aria-selected="true"]', list) || $('.l-item', list); } });
  nav(panel, '.l-item', { focus: true, scroller: list });
  function choose(it) { $$('.l-item', list).forEach(function (x) { x.setAttribute('aria-selected', String(x === it)); }); var c = TLcities.filter(function (x) { return x[0] === it.getAttribute('data-val'); })[0]; v.textContent = c[0]; v.classList.remove('ph'); if (out) out.textContent = 'Delivery to ' + c[0] + ': ' + TLfee[c[1]] + ', in 2 days.'; p.set(false); if (o.onChoose) o.onChoose(c); }
  $$('.l-item', list).forEach(function (it) { it.addEventListener('click', function () { choose(it); }); });
  return p;
};
/* A searchable list: text box keeps focus, the active row is marked. */
window.TLcombo = function (box, o) {
  o = o || {}; var inp = $('[data-q]', box), panel = $('[data-panel]', box), list = $('[data-list]', box), out = $('[data-out]', box), id = box.id, regions = [];
  TLcities.forEach(function (c) { if (regions.indexOf(c[1]) < 0) regions.push(c[1]); });
  list.innerHTML = (o.hl ? '<span class="l-hl" data-hl aria-hidden="true"></span>' : '') + regions.map(function (r, g) { return '<div role="group" aria-labelledby="' + id + '-g' + g + '" data-g><div class="l-head" id="' + id + '-g' + g + '">' + r + '</div>' + TLcities.filter(function (c) { return c[1] === r; }).map(function (c) { return '<div class="l-item" role="option" id="' + id + '-' + c[0] + '" aria-selected="false" data-val="' + c[0] + '"><span class="nm">' + c[0] + '</span>' + ${JSON.stringify(CHECK)} + '</div>'; }).join('') + '</div>'; }).join('') + '<p class="l-muted s03-none" data-none hidden>No town matches. Try "Nai".</p>';
  var picked = null, hl = $('[data-hl]', list);
  var p = pop(o.trigger || null, panel, { keep: inp, onClose: function () { inp.setAttribute('aria-expanded', 'false'); n.clear(); if (o.onClose) o.onClose(); }, onOpen: function () { inp.setAttribute('aria-expanded', 'true'); if (o.onOpen) o.onOpen(); } });
  var n = nav(panel, '.l-item', { keys: inp, hl: hl, scroller: list, pick: function (it) { choose(it); }, onMark: function (el) { if (el) inp.setAttribute('aria-activedescendant', el.id); else inp.removeAttribute('aria-activedescendant'); } });
  function filter() { var q = inp.value.trim().toLowerCase(), any = 0;
    $$('.l-item', list).forEach(function (it) { var nm = it.getAttribute('data-val'), i = nm.toLowerCase().indexOf(q), show = !q || i >= 0; it.hidden = !show; if (show) any++; $('.nm', it).innerHTML = q && i >= 0 ? nm.slice(0, i) + '<mark>' + nm.slice(i, i + q.length) + '</mark>' + nm.slice(i + q.length) : nm; });
    $$('[data-g]', list).forEach(function (g) { g.hidden = !$$('.l-item', g).some(function (it) { return !it.hidden; }); });
    $('[data-none]', list).hidden = !!any; if (any && q) n.mark(0); else n.clear(); }
  function choose(it) { picked = it.getAttribute('data-val'); $$('.l-item', list).forEach(function (x) { x.setAttribute('aria-selected', String(x === it)); }); inp.value = picked; var c = TLcities.filter(function (x) { return x[0] === picked; })[0]; if (out) out.textContent = 'Delivery to ' + c[0] + ': ' + TLfee[c[1]] + ', in 2 days.'; p.set(false); if (o.onChoose) o.onChoose(it); filter(); }
  $$('.l-item', list).forEach(function (it) { it.addEventListener('click', function () { choose(it); }); });
  inp.addEventListener('input', function () { p.set(true); filter(); });
  inp.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' && !p.isOpen()) { p.set(true); } if (e.key === 'Escape' && p.isOpen()) { e.stopPropagation(); p.set(false); } if (e.key === 'Tab') p.set(false, false); });
  if (!o.trigger) inp.addEventListener('click', function () { p.set(true); });
  return { pop: p, filter: filter, inp: inp };
};`,
  opts: [
    {
      k: 'A', name: 'A plain list under the button', line: 'The Radix select: the list fades in under the button, the picked town has a tick, and typing a letter jumps to it.',
      from: [sh('select'), radix('select')], tryit: 'Open it, press K twice, then Enter.',
      needs: 'Plain CSS and script.', keys: 'Down opens. Arrows, Home, End, a letter to jump, Enter picks, Escape closes.', off: 'The list shows at once.', law: 'Jakob: works like every select you know.',
      tags: ['motion:still', 'speed:quick', 'open:trigger', 'new:familiar', 'look:ember'], top: true,
      html: `<div class="s03">${selTrig('t03A')}<div class="l-panel l-pop s03-p" role="listbox" aria-labelledby="t03A-l" data-panel><div class="s03-sc" data-list></div></div><p class="s03-out" data-out aria-live="polite"></p></div>`,
      js: `TLselect(box);`,
    },
    {
      k: 'B', name: 'A springy drop with rows that follow', line: 'easyui\'s spring select: the arrow swings a little past and settles, the list drops with a small bounce, and the rows fall in one after another.',
      from: [ez('spring-select'), be('select')], tryit: 'Open and close it a few times.',
      needs: 'CSS springs.', keys: 'The same as A.', off: 'No swing, no bounce, no follow.', law: 'Jakob: same keys as A.',
      tags: ['motion:springy', 'speed:mid', 'open:trigger', 'new:twist', 'look:ember'], top: true,
      html: `<div class="s03">${selTrig('t03B')}<div class="l-panel l-pop s03-p" role="listbox" aria-labelledby="t03B-l" data-panel><div class="s03-sc" data-list></div></div><p class="s03-out" data-out aria-live="polite"></p></div>`,
      css: `#t03B .s03-tr svg { transition: transform var(--sp-bouncy-d) var(--sp-bouncy); }
#t03B .s03-p { --from: translateY(-10px) scale(.98); --in: var(--sp-bouncy-d); --ease: var(--sp-bouncy); }
#t03B .s03-p.is-open .l-item { animation: l-fadeup .3s var(--ease-out) both; animation-delay: calc(var(--i) * 18ms); }`,
      js: `TLselect(box);`,
    },
    {
      k: 'C', name: 'Search, groups, and a gliding mark', line: 'easyui\'s combobox with our groups: type to filter, the matching letters are marked, one soft highlight glides from row to row.',
      from: [ez('combobox'), be('combobox'), sh('combobox')], tryit: 'Type "ma", use the arrows, press Enter.',
      needs: 'CSS and script.', keys: 'Type to filter. Arrows move, Enter picks, Escape closes.', off: 'The highlight jumps instead of gliding.', law: 'Hick, the right way: a long list you search, in groups.',
      tags: ['motion:some', 'speed:quick', 'density:compact', 'open:trigger', 'look:ember'], top: true,
      html: `<div class="s03"><label class="l-lbl" for="t03C-q">Deliver to</label><input class="l-in" id="t03C-q" data-q role="combobox" aria-expanded="false" aria-controls="t03C-lb" aria-autocomplete="list" autocomplete="off" placeholder="Search towns"><div class="l-panel l-pop s03-p" id="t03C-lb" role="listbox" aria-labelledby="t03C-q" data-panel><div class="s03-sc" data-list></div></div><p class="s03-out" data-out aria-live="polite"></p></div>`,
      css: `#t03C mark { background: none; color: var(--accent-text); font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
#t03C .l-item[data-on], #t03C .l-item:hover { background: none; }
#t03C .l-item[aria-selected="true"] .ck { animation: l-popin .35s var(--sp-bouncy) both; }
#t03C .s03-none { padding: 10px; margin: 0; }`,
      js: `TLcombo(box, { hl: true });`,
    },
    {
      k: 'D', name: 'The button grows into a search panel', line: 'beUI\'s morphing select, with your n09 search inside: the button itself stretches down into the panel, and its label becomes the search box.',
      from: [be('select-morph'), house('n09'), skill('animate')], tryit: 'Click the button. Type "ki", then Enter.',
      needs: 'CSS and script.', keys: 'Enter opens and puts you in the search. Arrows, Enter, Escape.', off: 'The panel appears at full size.', law: 'Fitts: the list opens exactly where you clicked.',
      tags: ['motion:some', 'speed:mid', 'open:inplace', 'new:twist', 'look:ember'], top: true,
      html: `<div class="s03 s03d"><span class="l-lbl" id="t03D-l">Deliver to</span><button class="s03-tr" type="button" data-tr aria-haspopup="listbox" aria-labelledby="t03D-l" aria-expanded="false"><span data-v class="ph">Choose a city</span>${CHEV}</button>
<div class="s03d-p" data-panel><span class="bg" aria-hidden="true"></span><div class="c"><input class="l-in s03d-q" data-q role="combobox" aria-expanded="false" aria-controls="t03D-lb" aria-autocomplete="list" aria-labelledby="t03D-l" autocomplete="off" placeholder="Search towns"><div class="s03-sc" id="t03D-lb" role="listbox" aria-labelledby="t03D-l" data-list></div></div></div><p class="s03-out" data-out aria-live="polite"></p></div>`,
      css: `#t03D .s03d-p { position: absolute; left: 0; right: 0; top: 25px; z-index: 6; height: 262px; visibility: hidden; pointer-events: none; transition: visibility 0s linear .3s; }
#t03D .s03d-p.is-open { visibility: visible; pointer-events: auto; transition: none; }
#t03D .s03d-p .bg { position: absolute; inset: 0; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line-hi); box-shadow: var(--shadow-lg); transform-origin: top center; transform: scaleY(.16); opacity: 0; transition: transform .28s var(--ease-out), opacity .1s linear .18s; }
#t03D .s03d-p.is-open .bg { transform: none; opacity: 1; transition: transform .38s var(--ease-out), opacity 0s; }
#t03D .s03d-p .c { position: relative; padding: 0 5px 5px; opacity: 0; transition: opacity .1s; }
#t03D .s03d-p.is-open .c { opacity: 1; transition: opacity .2s .1s; }
#t03D .s03d-q { border: 0; border-bottom: 1px solid var(--line); border-radius: 0; background: transparent; height: 41px; margin-bottom: 4px; box-shadow: none; }
#t03D .s03-sc { max-height: 208px; }
#t03D .s03-tr { transition: opacity .1s; }
#t03D .s03d.is-open .s03-tr { opacity: 0; }
#t03D mark { background: none; color: var(--accent-text); font-weight: 600; }`,
      js: `var root3 = $('.s03d', box), tr = $('[data-tr]', box), v = $('[data-v]', box);
var c = TLcombo(box, { trigger: tr, onOpen: function () { root3.classList.add('is-open'); tr.setAttribute('aria-expanded', 'true'); setTimeout(function () { c.inp.focus(); }, 30); }, onClose: function () { root3.classList.remove('is-open'); tr.setAttribute('aria-expanded', 'false'); setTimeout(function () { tr.focus({ preventScroll: true }); }, 10); }, onChoose: function (it) { v.textContent = it.getAttribute('data-val'); v.classList.remove('ph'); c.inp.value = ''; c.filter(); } });`,
    },
    {
      k: 'E', name: 'A soft sheet with big rows', line: 'Steps outside ember, like a phone app: a round pill button, and the list rises from the bottom as a sheet with large rows.',
      from: [ez('sheet', 'easyui sheet (idea)'), ['iOS action sheet', null]], tryit: 'Open it and tap a town. Tap the dim area to close.',
      needs: 'CSS and script.', keys: 'Arrows, Enter, Escape. Focus goes into the sheet.', off: 'The sheet appears without rising.', law: 'Fitts: 48 px rows, in thumb reach at the bottom.',
      tags: ['motion:some', 'speed:slow', 'density:roomy', 'open:edge', 'look:off'],
      html: `<div class="s03 s03e">${selTrig('t03E')}<p class="s03-out" data-out aria-live="polite"></p></div><div class="l-scrim" data-scrim></div><div class="s03e-sh l-pop" role="listbox" aria-labelledby="t03E-l" data-panel><span class="grab" aria-hidden="true"></span><p class="s03e-t">Deliver to</p><div class="s03-sc" data-list></div></div>`,
      css: `#t03E .s03-tr { border-radius: 999px; height: 46px; padding: 0 18px; font-family: var(--font-grot); border-color: transparent; background: var(--paper-sunk); box-shadow: none; }
#t03E .s03e-sh { position: absolute; left: 8px; right: 8px; bottom: 8px; z-index: 6; border-radius: 22px; background: var(--paper-raised); box-shadow: var(--shadow-lg); padding: 8px 8px 10px; font-family: var(--font-grot); --from: translateY(105%); --in: .42s; }
#t03E .grab { display: block; width: 36px; height: 4px; border-radius: 4px; background: var(--line-hi); margin: 2px auto 6px; }
#t03E .s03e-t { margin: 0 12px 4px; font-size: 13px; color: var(--muted); }
#t03E .s03-sc { max-height: 190px; }
#t03E .l-item { min-height: 48px; font-size: 16px; border-radius: 14px; padding: 0 14px; }`,
      js: `TLselect(box, { onOpen: function () { $('[data-scrim]', box).classList.add('is-open'); }, onClose: function () { $('[data-scrim]', box).classList.remove('is-open'); } });`,
    },
    {
      k: 'F', name: 'A wheel you spin', line: 'beUI\'s wheel picker: the towns sit on a drum. Scroll, drag or use the arrows, and the one in the middle band is picked.',
      from: [be('wheel-picker')], tryit: 'Scroll the wheel, or focus it and press the arrow keys.',
      needs: 'CSS scroll snap and script.', keys: 'Up and Down move one town. Home and End jump.', off: 'The drum stays flat; scrolling still works.', law: 'Hick holds (one at a time), but Jakob bends on a computer.',
      tags: ['motion:some', 'speed:mid', 'open:inplace', 'new:novel', 'look:ember'],
      html: `<div class="s03f"><span class="l-lbl" id="t03F-l">Deliver to</span><div class="wh" tabindex="0" role="listbox" aria-labelledby="t03F-l" data-wh><span class="band" aria-hidden="true"></span><div class="sc" data-sc></div></div><p class="s03-out" data-out aria-live="polite"></p></div>`,
      css: `#t03F .s03f { width: min(100%, 240px); text-align: center; }
#t03F .wh { position: relative; height: 180px; border-radius: 14px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-sm); overflow: hidden; }
#t03F .band { position: absolute; left: 8px; right: 8px; top: 72px; height: 36px; border-radius: 9px; background: rgb(var(--ink-rgb) / .06); border: 1px solid var(--line); }
#t03F .sc { position: relative; height: 100%; overflow-y: auto; scroll-snap-type: y mandatory; scrollbar-width: none; padding: 72px 0; perspective: 420px; }
#t03F .sc::-webkit-scrollbar { display: none; }
#t03F .it { height: 36px; display: grid; place-items: center; scroll-snap-align: center; font-size: 16px; color: var(--ink); transform-origin: center; }
#t03F .it[aria-selected="true"] { font-weight: 600; }
#t03F .wh { -webkit-mask-image: linear-gradient(transparent, #000 30%, #000 70%, transparent); mask-image: linear-gradient(transparent, #000 30%, #000 70%, transparent); }`,
      js: `var sc = $('[data-sc]', box), wh = $('[data-wh]', box), out = $('[data-out]', box), cur = -1, t = null;
sc.innerHTML = TLcities.map(function (c, i) { return '<div class="it" role="option" id="t03F-o' + i + '" aria-selected="false">' + c[0] + '</div>'; }).join('');
var its = $$('.it', sc);
function paint() { var mid = sc.scrollTop + 90 - 72; its.forEach(function (el, i) { var d = (i * 36 + 18 - mid) / 36; el.style.transform = moving() ? 'rotateX(' + Math.max(-70, Math.min(70, d * -22)) + 'deg)' : ''; el.style.opacity = Math.max(.25, 1 - Math.abs(d) * .22); });
  var i = Math.max(0, Math.min(its.length - 1, Math.round((sc.scrollTop) / 36))); if (i !== cur) { if (cur >= 0) its[cur].setAttribute('aria-selected', 'false'); cur = i; its[i].setAttribute('aria-selected', 'true'); wh.setAttribute('aria-activedescendant', its[i].id); clearTimeout(t); t = setTimeout(function () { var c = TLcities[cur]; out.textContent = 'Delivery to ' + c[0] + ': ' + TLfee[c[1]] + ', in 2 days.'; }, 250); } }
sc.addEventListener('scroll', function () { requestAnimationFrame(paint); }, { passive: true });
wh.addEventListener('keydown', function (e) { var k = e.key, i = cur; if (k === 'ArrowDown') i++; else if (k === 'ArrowUp') i--; else if (k === 'Home') i = 0; else if (k === 'End') i = its.length - 1; else return; e.preventDefault(); i = Math.max(0, Math.min(its.length - 1, i)); sc.scrollTo({ top: i * 36, behavior: moving() ? 'smooth' : 'auto' }); });
its.forEach(function (el, i) { el.addEventListener('click', function () { sc.scrollTo({ top: i * 36, behavior: moving() ? 'smooth' : 'auto' }); }); });
paint();`,
    },
  ],
};

/* ---------------- 04 Switch and checkbox ---------------- */
const sw = (id, n, label, on) => `<div class="tg-row"><span class="tg-l" id="${id}-${n}">${label}</span><button class="sw" type="button" role="switch" aria-checked="${on}" aria-labelledby="${id}-${n}"><span class="th"></span></button></div>`;
const cb = (id, n, label, on) => `<div class="tg-row tg-cb"><button class="cb" type="button" role="checkbox" aria-checked="${on}" aria-labelledby="${id}-${n}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.8 8.3 6.7 11 12.2 5"/></svg></button><span class="tg-l" id="${id}-${n}">${label}</span></div>`;
const tgSet = (id) => `<div class="tg">${sw(id, 1, 'Email receipts', true)}${sw(id, 2, 'SMS when paid', false)}${sw(id, 3, 'Weekly summary', true)}${cb(id, 4, 'Also send to my accountant', false)}</div>`;
const toggles = {
  id: 'toggles', n: '04', name: 'Switch and checkbox', h: 250,
  claim: 'A switch should flip <em>the moment you touch it</em>.',
  lead: 'Three alert settings and one box to tick. Flip each one and feel the knob move.',
  ref: { ids: 'n14', text: 'Settings that respond to a touch: the knob stretches when you hold it, and the tick draws itself.' },
  noteHint: 'B\'s spring, but square like E', moreHint: 'radio buttons and segmented choices',
  css: `.tg { width: min(100%, 300px); display: grid; gap: 4px; text-align: left; }
.tg-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; min-height: 40px; }
.tg-cb { justify-content: flex-start; margin-top: 6px; padding-top: 10px; border-top: 1px solid var(--line); }
.tg-l { font-size: 14.5px; color: var(--ink); cursor: pointer; }
.sw { position: relative; flex: 0 0 auto; width: 38px; height: 22px; border-radius: 999px; background: rgb(var(--ink-rgb) / .2); transition: background-color .2s; }
.sw[aria-checked="true"] { background: var(--accent); }
.sw .th { position: absolute; left: 3px; top: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgb(0 0 0 / .25); transition: transform .15s var(--ease-out); }
.sw[aria-checked="true"] .th { transform: translateX(16px); }
.cb { position: relative; flex: 0 0 18px; width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--line-hi); background: var(--paper-raised); display: grid; place-items: center; transition: background-color .15s, border-color .15s; }
.cb::before { content: ""; position: absolute; inset: -13px; }
.sw::before { content: ""; position: absolute; inset: -11px -4px; }
.cb[aria-checked="true"] { background: var(--accent); border-color: var(--accent); }
.cb svg { width: 13px; height: 13px; fill: none; stroke: var(--on-accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; opacity: 0; transition: opacity .12s; }
.cb[aria-checked="true"] svg { opacity: 1; }`,
  js: `window.TLtoggles = function (box, cb) {
  $$('[role="switch"], [role="checkbox"]', box).forEach(function (b) {
    b.addEventListener('click', function () { var on = b.getAttribute('aria-checked') !== 'true'; b.setAttribute('aria-checked', String(on)); if (cb) cb(b, on); });
    var lid = b.getAttribute('aria-labelledby'), l = lid && document.getElementById(lid); if (l && !b.contains(l)) l.addEventListener('click', function () { b.click(); b.focus(); });
  });
};`,
  opts: [
    {
      k: 'A', name: 'A quick slide and a tick', line: 'The shadcn switch and checkbox: the knob slides in 0.15 s, the box fills orange and shows its tick.',
      from: [sh('switch'), sh('checkbox')], tryit: 'Flip each switch. Click the words too.',
      needs: 'Plain CSS.', keys: 'Tab, then Space flips.', off: 'The knob jumps.', law: 'Fitts: the hit area is bigger than the knob, and the words work too.',
      tags: ['motion:still', 'speed:quick', 'feedback:quiet', 'new:familiar', 'look:ember'],
      html: tgSet('t04A'), js: `TLtoggles(box);`,
    },
    {
      k: 'B', name: 'A spring knob and a drawn tick', line: 'beUI\'s switch: the knob shrinks a little when pressed and springs across. The tick draws itself in.',
      from: [be('switch'), be('checkbox')], tryit: 'Flip a switch quickly a few times.',
      needs: 'CSS springs.', keys: 'Space flips.', off: 'Knob jumps; tick shows at once.', law: 'Jakob: on is right, like every switch.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: tgSet('t04B'),
      css: `#t04B .sw .th { transition: transform var(--sp-bouncy-d) var(--sp-bouncy); }
#t04B .sw:active .th { transform: scale(.85); transition-duration: .12s; }
#t04B .sw[aria-checked="true"]:active .th { transform: translateX(16px) scale(.85); }
#t04B .cb { transition: transform var(--sp-bouncy-d) var(--sp-bouncy), background-color .15s, border-color .15s; }
#t04B .cb:active { transform: scale(.85); transition-duration: .1s; }
#t04B .cb svg { opacity: 1; stroke-dasharray: 14; stroke-dashoffset: 14; transition: stroke-dashoffset .3s var(--ease-out); }
#t04B .cb[aria-checked="true"] svg { stroke-dashoffset: 0; }`,
      js: `TLtoggles(box);`,
    },
    {
      k: 'C', name: 'A knob that stretches, a box that bounces', line: 'easyui\'s stretch switch and draw checkbox: hold the knob and it stretches toward where it will go. The box swells to 1.04 and settles as the tick draws.',
      from: [ez('stretch-switch'), ez('draw-checkbox'), house('n14')], tryit: 'Press and hold a switch before you let go.',
      needs: 'CSS springs.', keys: 'Space flips.', off: 'No stretch, no bounce.', law: 'Jakob: same shapes, more feel.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'depth:flat', 'look:ember'],
      html: tgSet('t04C'),
      css: `#t04C .sw .th { width: 16px; transform-origin: left center; transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#t04C .sw[aria-checked="true"] .th { transform-origin: right center; }
#t04C .sw:active .th { transform: scale(1.3, .86); transition-duration: .14s; }
#t04C .sw[aria-checked="true"]:active .th { transform: translateX(16px) scale(1.3, .86); }
#t04C .cb svg { opacity: 1; stroke-dasharray: 14; stroke-dashoffset: 14; transition: stroke-dashoffset .28s cubic-bezier(.65, 0, .35, 1); }
#t04C .cb[aria-checked="true"] svg { stroke-dashoffset: 0; }
#t04C .cb.pop { animation: t04pop .36s cubic-bezier(.16, 1, .3, 1); }
@keyframes t04pop { 0% { transform: scale(.9); } 55% { transform: scale(1.04); } 100% { transform: none; } }`,
      js: `TLtoggles(box, function (b, on) { if (b.classList.contains('cb')) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } });`,
    },
    {
      k: 'D', name: 'The whole row is the switch, and it says so', line: 'Your n14, pushed: the full row is one big target, the state word sits on its own line under the name, and a small orange dot says "Saved".',
      from: [house('n14'), ['Apple Settings rows', null]], tryit: 'Click anywhere on a row.',
      needs: 'CSS and script.', keys: 'Each row is one button. Space flips.', off: 'Words swap at once.', law: 'Fitts at its best: the target is the whole row.',
      tags: ['motion:some', 'feedback:clear', 'density:roomy', 'new:twist', 'look:ember'], h: 290,
      html: `<div class="tg tgd">${[['Email receipts', true, 'On · sent at 6 pm'], ['SMS when paid', false, 'On · to 0712 345 678'], ['Weekly summary', true, 'On · every Monday']].map(([l, on, w], i) => `<button class="tgd-row" type="button" role="switch" aria-checked="${on}"><span class="tg-l">${l}<span class="st" aria-hidden="true"><span class="on">${w}</span><span class="of">Off</span></span></span><span class="sv" aria-hidden="true">Saved</span><span class="sw"><span class="th"></span></span></button>`).join('')}${cb('t04D', 4, 'Also send to my accountant', false)}</div>`,
      css: `#t04D .tgd-row { display: flex; align-items: center; gap: 12px; width: 100%; padding: 9px 12px; border-radius: 12px; text-align: left; transition: background-color .15s, transform .15s var(--ease-out); }
#t04D .tgd-row:hover { background: rgb(var(--ink-rgb) / .05); }
#t04D .tgd-row:active { transform: scale(.985); }
#t04D .tg-l { flex: 1; display: grid; }
#t04D .st { display: grid; font-size: 12.5px; color: var(--muted); overflow: hidden; height: 18px; }
#t04D .st span { grid-area: 1 / 1; transition: transform .3s var(--ease-out), opacity .2s; }
#t04D [aria-checked="true"] .of, #t04D [aria-checked="false"] .on { transform: translateY(100%); opacity: 0; }
#t04D .sv { font-family: var(--font-mono); font-size: 10.5px; color: var(--accent-text); display: inline-flex; align-items: center; gap: 5px; opacity: 0; transition: opacity .3s; }
#t04D .sv::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
#t04D .sv.is-on { opacity: 1; transition-duration: .15s; }
#t04D .sw .th { transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#t04D .tg-cb { padding-left: 12px; }`,
      js: `TLtoggles(box, function (b) { var s = $('.sv', b); if (!s) return; s.classList.add('is-on'); clearTimeout(s._t); s._t = setTimeout(function () { s.classList.remove('is-on'); }, 1300); });`,
    },
    {
      k: 'E', name: 'Square switches that say ON and OFF', line: 'Steps outside ember: square tracks, a square knob, and the words ON and OFF written in mono inside. The box shows a cross, like a paper form.',
      from: [['Swiss print forms', null]], tryit: 'Flip a switch and tick the box.',
      needs: 'Plain CSS.', keys: 'Space flips.', off: 'Same; the move is instant.', law: 'Jakob bends a little: a cross can read as "no".',
      tags: ['motion:still', 'speed:quick', 'density:compact', 'new:novel', 'look:off'],
      html: tgSet('t04E'),
      css: `#t04E .tg-l { font-family: var(--font-mono); font-size: 13px; text-transform: uppercase; letter-spacing: .04em; }
#t04E .sw { width: 54px; height: 24px; border-radius: 0; border: 2px solid var(--ink); background: var(--paper-raised); }
#t04E .sw[aria-checked="true"] { background: var(--ink); }
#t04E .sw .th { left: 2px; top: 2px; width: 16px; height: 16px; border-radius: 0; background: var(--ink); box-shadow: none; transition: none; }
#t04E .sw[aria-checked="true"] .th { transform: translateX(30px); background: var(--accent); }
#t04E .sw::after { content: "OFF"; position: absolute; right: 5px; top: 3px; font: 600 9px/14px var(--font-mono); color: var(--ink); }
#t04E .sw[aria-checked="true"]::after { content: "ON"; left: 6px; right: auto; color: var(--paper); }
#t04E .cb { border-radius: 0; border: 2px solid var(--ink); }
#t04E .cb[aria-checked="true"] { background: var(--paper-raised); border-color: var(--ink); }
#t04E .cb svg { display: none; }
#t04E .cb[aria-checked="true"]::after { content: "✕"; font: 700 12px/1 var(--font-mono); color: var(--ink); }`,
      js: `TLtoggles(box);`,
    },
  ],
};

export default [buttons, fields, select, toggles];
