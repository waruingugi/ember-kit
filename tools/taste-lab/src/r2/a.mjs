// Round 2, batch A: primary button contrast, popover, drawer, choice, slider.
import { sh, be, ez, radix, house, skill } from '../src-links.mjs';

const R1 = 'taste-lab.html'; // round 1, built next to this page with `node build.mjs 1`
const X = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

/* ---------------- 01 Primary button contrast ---------------- */
const cxHtml = (extra = '') => `<div class="cx"><div class="cx-row"><button class="l-btn cx-p" type="button" data-p>Pay KES 4,200</button><button class="l-btn sm cx-p" type="button" data-p>Save</button>${extra}</div><p class="cx-r" data-r aria-live="polite"></p><p class="l-muted cx-msg" data-msg aria-live="polite"></p></div>`;
const contrast = {
  id: 'contrast', n: '01', name: 'Primary button contrast', h: 230,
  claim: 'The main button should be <em>easy to read for everyone.</em>',
  lead: 'Our orange button with white text reads at about 4 to 1 in the day theme. The accessibility rule (WCAG AA) asks for 4.5 to 1 for normal text. Night already passes. Each card checks its own button live, so switch themes to compare.',
  ref: { ids: 'b.pri', text: 'Today: orange (#e14a0e) with white text in day, orange with dark text at night.' },
  noteHint: 'B, but only for small buttons', moreHint: 'secondary and danger buttons too',
  css: `.cx { display: grid; justify-items: center; gap: 12px; text-align: center; }
.cx-row { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; align-items: center; }
.cx-p { border-color: transparent; font-weight: 600; transition: transform .15s var(--ease-out), background-color .2s var(--ease-out); }
.cx-r { display: inline-flex; align-items: center; gap: 8px; margin: 0; padding: 5px 10px; border-radius: 999px; border: 1px solid var(--line); background: var(--paper-raised); font: 500 12.5px/1.2 var(--font-mono); color: var(--ink-soft); }
.cx-r b { font-weight: 600; color: var(--ink); }
.cx-r .ok, .cx-r .no { font-family: var(--font-body); font-weight: 600; }
.cx-r .ok { color: var(--ink); }
.cx-r .no { color: var(--accent-text); }
.cx-msg { margin: 0; min-height: 1.4em; }`,
  js: `/* WCAG contrast of the first button, in whatever theme is showing */
window.TLcx = function (box, large) {
  var b = $('[data-p]', box), out = $('[data-r]', box), msg = $('[data-msg]', box);
  function rgb(s) { var m = s.match(/[\\d.]+/g); return m ? m.slice(0, 3).map(Number) : [0, 0, 0]; }
  function lum(c) { return c.map(function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }).reduce(function (a, v, i) { return a + v * [.2126, .7152, .0722][i]; }, 0); }
  function check() { var cs = getComputedStyle(b), A = lum(rgb(cs.backgroundColor)), B = lum(rgb(cs.color)), r = (Math.max(A, B) + .05) / (Math.min(A, B) + .05), need = large ? 3 : 4.5, ok = r >= need;
    out.innerHTML = '<b>' + r.toFixed(1) + ' : 1</b> in ' + (root.getAttribute('data-theme') === 'dark' ? 'night' : 'day') + ' · <span class="' + (ok ? 'ok' : 'no') + '">' + (ok ? 'passes' : 'fails') + '</span> AA' + (large ? ' for large text' : '') + ' (needs ' + need + ')'; }
  check(); new MutationObserver(function () { setTimeout(check, 400); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  $$('[data-p]', box).forEach(function (x) { x.addEventListener('click', function () { msg.textContent = x.textContent === 'Save' ? 'Draft saved.' : 'KES 4,200 paid to Duka Fresh.'; }); });
};`,
  opts: [
    {
      k: 'A', name: 'Keep it as it is', line: 'Orange with white text, the way every primary button looks today. Bright, but below the reading rule in the day theme.',
      kind: 'Today', from: [house('b.pri')], tryit: 'Read the check under the buttons, then switch to night.',
      needs: 'Nothing new.', keys: 'Normal button keys.', off: 'Same.', law: 'Jakob: looks like it does everywhere in the kit.',
      tags: ['feedback:clear', 'new:familiar', 'look:ember'],
      html: cxHtml(), css: `#t01A .cx-p { background: var(--accent); color: var(--on-accent); }`, js: `TLcx(box);`,
    },
    {
      k: 'B', name: 'A deeper orange', line: 'The button uses our darker orange (#b33a0a, the one we already use for small orange text). White text then passes. At night it uses the lighter orange with dark text.',
      kind: 'Fix with our own colour', from: [['WCAG 2.2 contrast (1.4.3)', 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html'], house('--accent-text')], tryit: 'Compare its orange with A. Switch to night.',
      needs: 'One CSS change.', keys: 'Normal button keys.', off: 'Same.', law: 'Jakob: still clearly the orange button.',
      tags: ['feedback:clear', 'new:familiar', 'look:ember'],
      html: cxHtml(), css: `#t01B .cx-p { background: var(--accent-text); color: var(--on-accent); }
#t01B .cx-p:hover { background: color-mix(in oklab, var(--accent-text) 88%, var(--ink)); }`, js: `TLcx(box);`,
    },
    {
      k: 'C', name: 'Same orange, dark text', line: 'Keeps the bright orange and writes the words in pure black, in both themes. Our usual ink is not quite dark enough here (4.4 to 1), so it has to be true black.',
      kind: 'Fix with dark text', from: [['WCAG 2.2 contrast (1.4.3)', 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html']], tryit: 'See if the dark words feel right on orange.',
      needs: 'One CSS change.', keys: 'Normal button keys.', off: 'Same.', law: 'Jakob bends a little: most orange buttons use white text.',
      tags: ['feedback:clear', 'new:twist', 'look:ember'],
      html: cxHtml(), css: `#t01C .cx-p { background: var(--accent); color: #000; }`, js: `TLcx(box);`,
    },
    {
      k: 'D', name: 'An ink button with an orange spark', line: 'The main button turns ink (near-black), with a small orange dot that grows on hover. Orange stays for the one thing that matters on the page.',
      kind: 'Reference, pushed', from: [house('c14'), ['DESIGN.md: one orange part at rest', null]], tryit: 'Point at the button and watch the dot.',
      needs: 'CSS only.', keys: 'Normal button keys.', off: 'The dot does not grow.', law: 'Hick: one orange thing to look at, not many.',
      tags: ['motion:some', 'feedback:quiet', 'new:twist', 'look:ember'],
      html: cxHtml(), css: `#t01D .cx-p { background: var(--ink); color: var(--paper); }
#t01D .cx-p::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); transition: transform var(--sp-bouncy-d) var(--sp-bouncy); }
#t01D .cx-p:hover::before { transform: scale(1.5); }`, js: `TLcx(box);`,
    },
    {
      k: 'F', name: 'Big and bold, only for the last step', line: 'Keeps orange with white text, but only on large, bold buttons (19 px bold). The rule for large text is 3 to 1, so it passes. Small buttons use B.',
      kind: 'Wild card', from: [['WCAG large-text rule', 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html'], house('c14')], tryit: 'Compare the big button with the small one beside it.',
      needs: 'Two sizes of primary button.', keys: 'Normal button keys.', off: 'Same.', law: 'Fitts: the last step gets the biggest target.',
      tags: ['feedback:loud', 'density:roomy', 'new:twist', 'look:ember'],
      html: cxHtml(), css: `#t01F .cx-p { background: var(--accent); color: var(--on-accent); height: 54px; padding: 0 26px; font-size: 19px; font-weight: 700; border-radius: 12px; }
#t01F .cx-p.sm { height: 32px; padding: 0 11px; font-size: 13px; border-radius: 8px; background: var(--accent-text); }`, js: `TLcx(box, true);`,
    },
  ],
};

/* ---------------- 02 Popover, more ---------------- */
const pvCard = (more = '') => `<div class="p08-c"><div class="p08-top"><span class="l-av">AO</span><div><b>Amina Otieno</b><span class="l-muted">Customer since March 2023</span></div></div><dl class="p08-st"><div><dt>Orders</dt><dd class="l-num">48</dd></div><div><dt>Spent</dt><dd class="l-num">92,300</dd></div><div><dt>Last</dt><dd>2 days ago</dd></div></dl>${more}</div>`;
const pvActs = `<div class="p08-a"><button class="l-btn sm pri" type="button" data-act="Message sent to Amina.">Message</button><button class="l-btn sm" type="button" data-act="Opening Amina's 48 orders.">View orders</button></div>`;
const pvHtml = (id, inner, cls = '', pcls = 'l-panel l-pop p08-pv') => `<div class="p08 ${cls}"><div class="p08-s">Last order from <span class="p08-w"><button class="p08-tr" type="button" aria-haspopup="dialog" aria-controls="${id}-pv" data-tr>Amina Otieno</button><div class="${pcls}" id="${id}-pv" role="dialog" aria-label="Amina Otieno" data-pv>${inner}</div></span> came in at 2:14 pm.</div><p class="l-muted p08-msg" data-msg aria-live="polite"></p></div>`;
const SPARK = '<svg class="sp" viewBox="0 0 220 44" aria-hidden="true"><path class="ar" d="M0 34 L20 30 L40 32 L60 24 L80 26 L100 18 L120 22 L140 14 L160 16 L180 10 L200 12 L220 6 L220 44 L0 44Z"/><path class="ln" pathLength="1" d="M0 34 L20 30 L40 32 L60 24 L80 26 L100 18 L120 22 L140 14 L160 16 L180 10 L200 12 L220 6"/><circle class="dt" cx="220" cy="6" r="3.5"/></svg>';
const popover = {
  id: 'popover', n: '02', name: 'Popover, more', h: 360,
  claim: 'A popover should <em>feel attached</em> to what opened it.',
  lead: 'You asked for more popovers, without the off-look one. Same sentence, same customer. Open each from the name, close with Escape or a click outside.',
  ref: { ids: 'Round 1', text: 'You saw: a plain fade, a bloom from the name, peek then pin, and a peek that leans. None was picked yet.', url: R1, label: 'Open round 1' },
  noteHint: 'C\'s grow, but with B\'s spring', moreHint: 'popovers for a date or a price',
  css: `@media (max-width: 400px) { .p08-pv { width: 250px; margin-left: -125px; } }
.p08-pv .ptr { position: absolute; left: 50%; top: -6px; margin-left: -6px; width: 12px; height: 12px; background: var(--paper-raised); border-left: 1px solid var(--line); border-top: 1px solid var(--line); transform: rotate(45deg); }`,
  opts: [
    {
      k: 'B', name: 'It springs out, its lines follow', line: 'The card springs out of the name with a small pointer, then its lines rise in one after another. Closing is quick and plain.',
      from: [be('popover'), ez('spring-popover'), skill('animate')], tryit: 'Click the name, then click outside.',
      needs: 'CSS springs.', keys: 'Enter opens, Tab moves inside, Escape closes and returns to the name.', off: 'Shows at once.', law: 'Proximity: the pointer ties the card to the name.',
      tags: ['motion:springy', 'speed:mid', 'open:trigger', 'new:twist', 'look:ember'], top: true,
      html: pvHtml('t02B', '<span class="ptr" aria-hidden="true"></span>' + pvCard() + pvActs),
      css: `#t02B .p08-pv { --from: translateY(-8px) scale(.7); --in: var(--sp-bouncy-d); --ease: var(--sp-bouncy); transform-origin: 50% -8px; }
#t02B .p08-pv.is-open .p08-top, #t02B .p08-pv.is-open .p08-st, #t02B .p08-pv.is-open .p08-a { animation: l-fadeup .35s var(--ease-out) both; }
#t02B .p08-pv.is-open .p08-st { animation-delay: .05s; }
#t02B .p08-pv.is-open .p08-a { animation-delay: .1s; }`,
      js: `TLpv(box);`,
    },
    {
      k: 'A', name: 'A plain card with a pointer', line: 'The shadcn popover with a pointer arrow, opening in 0.15 s. It flips above the name when there is no room below.',
      from: [sh('popover'), radix('popover')], tryit: 'Open it. Make the window short and open it again.',
      needs: 'CSS and script.', keys: 'Same as B.', off: 'Shows at once.', law: 'Jakob: works like every popover.',
      tags: ['motion:still', 'speed:quick', 'open:trigger', 'new:familiar', 'look:ember'], top: true,
      html: pvHtml('t02A', '<span class="ptr" aria-hidden="true"></span>' + pvCard() + pvActs),
      css: `#t02A .p08-pv { --from: translateY(-3px); }
#t02A .p08-pv.is-up { top: auto; bottom: calc(100% + 8px); }
#t02A .is-up .ptr { top: auto; bottom: -6px; transform: rotate(225deg); }`,
      js: `var a = TLpv(box, { onOpen: function () { var s = box.querySelector('.stage').getBoundingClientRect(), t = a.tr.getBoundingClientRect(); a.pv.classList.toggle('is-up', s.bottom - t.bottom < a.pv.offsetHeight + 16 && t.top - s.top > a.pv.offsetHeight + 16); } });`,
    },
    {
      k: 'C', name: 'A small peek that grows if you stay', line: 'Point at the name: a small chip with her name and orders appears. Stay on it and it grows into the full card. Click to keep it open.',
      from: [ez('peek-card'), radix('hover-card'), house('c25')], tryit: 'Point at the name and wait. Then click it.',
      needs: 'CSS and the Web Animations API.', keys: 'Enter opens the full card at once. Escape closes.', off: 'Opens full at once.', law: 'Hick: a little first, more only if you want it.',
      tags: ['motion:some', 'speed:mid', 'open:trigger', 'new:twist', 'look:ember'], top: true,
      html: pvHtml('t02C', pvCard('<div class="gr"><div>' + pvActs + '</div></div>')),
      css: `#t02C .p08-pv { --from: translateY(4px) scale(.96); width: 270px; }
#t02C .p08-st, #t02C .p08-top .l-muted { display: none; }
#t02C .gr { display: none; }
#t02C .p08-pv.is-full .p08-st, #t02C .p08-pv.is-full .p08-top .l-muted { display: grid; }
#t02C .p08-pv.is-full .p08-top .l-muted { display: block; }
#t02C .p08-pv.is-full .gr { display: block; margin: 12px -12px -12px; }
#t02C .p08-pv:not(.is-full) { width: 200px; margin-left: -100px; }
#t02C .p08-pv:not(.is-full) .p08-c { padding: 8px 10px; }`,
      js: `var a = TLpv(box, { click: false, onClose: function () { a.pv.classList.remove('is-full'); delete a.pv.dataset.pinned; clearTimeout(g); } }), g = null;
function grow() { if (a.pv.classList.contains('is-full')) return; var w0 = a.pv.offsetWidth, h0 = a.pv.offsetHeight; a.pv.classList.add('is-full'); if (moving()) a.pv.animate([{ width: w0 + 'px', height: h0 + 'px', marginLeft: (-w0 / 2) + 'px' }, { width: a.pv.offsetWidth + 'px', height: a.pv.offsetHeight + 'px', marginLeft: '-135px' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' }); }
TLhover(a, 300, function () { clearTimeout(g); g = setTimeout(grow, 700); });
a.tr.addEventListener('click', function (e) { e.stopPropagation(); if (a.pv.dataset.pinned) { a.pop.set(false); return; } a.pv.dataset.pinned = '1'; a.pop.set(true); grow(); setTimeout(function () { var b = $('.l-btn', a.pv); if (b) b.focus(); }, 30); });`,
    },
    {
      k: 'D', name: 'The peek card shows her orders as a line', line: 'Your c25, pushed: the card lifts out of the name and a small line of her orders by month draws in, with an orange dot on this month.',
      from: [house('c25'), house('c02'), ['patterns/line-chart.md', null]], tryit: 'Click the name and watch the line draw.',
      needs: 'CSS and an inline SVG.', keys: 'Same as B.', off: 'The line shows drawn.', law: 'Proximity: the numbers and their trend sit together.',
      tags: ['motion:some', 'speed:mid', 'depth:lifted', 'new:twist', 'look:ember'], h: 430, top: true,
      html: pvHtml('t02D', pvCard('<div class="trend"><p class="mono-label">Orders by month</p>' + SPARK + '</div>') + pvActs),
      css: `#t02D .p08-pv { --from: translateY(8px) scale(.97); --in: .45s; }
#t02D .trend { margin-top: 10px; }
#t02D .trend .mono-label { margin: 0 0 4px; }
#t02D .sp { display: block; width: 100%; height: 44px; overflow: visible; }
#t02D .sp .ar { fill: rgb(var(--ink-rgb) / .05); }
#t02D .sp .ln { fill: none; stroke: var(--ink); stroke-width: 1.6; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
#t02D .sp .dt { fill: var(--accent); }
#t02D .p08-pv.is-open .ln { animation: p02draw 1.1s var(--ease-out) .15s both; }
#t02D .p08-pv.is-open .dt { animation: p02pop .3s var(--sp-bouncy) 1.15s both; }
@keyframes p02draw { from { stroke-dashoffset: 1; } }
@keyframes p02pop { from { transform: scale(.6); opacity: 0; } }
#t02D .dt { transform-origin: 220px 6px; }`,
      js: `TLpv(box);`,
    },
    {
      k: 'F', name: 'It opens inside the sentence', line: 'No floating card. The sentence parts and the card slides open between the lines, pushing the text below down. Nothing covers anything.',
      kind: 'Wild card', from: [ez('inline-expand'), ['patterns/interactive-parts.md: things that turn into other things', null]], tryit: 'Click the name. Click it again.',
      needs: 'CSS and the Web Animations API.', keys: 'Enter opens and closes. Escape closes.', off: 'Opens at once.', law: 'Proximity: the card sits right under the name it explains.',
      tags: ['motion:some', 'speed:mid', 'open:inplace', 'new:novel', 'look:ember'], h: 420, top: true,
      html: `<div class="p02f"><p class="p08-s">Last order from <button class="p08-tr" type="button" aria-expanded="false" aria-controls="t02F-in" data-tr>Amina Otieno</button> came in at 2:14 pm.</p><div class="in" id="t02F-in" role="region" aria-label="Amina Otieno" hidden><div class="l-panel">${pvCard()}${pvActs}</div></div><p class="p08-s">She paid KES 760 by PocketPay.</p><p class="l-muted p02f-msg" data-msg aria-live="polite"></p></div>`,
      css: `#t02F .p02f { width: min(100%, 320px); text-align: center; }
#t02F .p08-s { margin: 0; }
#t02F .in { overflow: hidden; }
#t02F .in > .l-panel { margin: 10px 0; text-align: left; box-shadow: var(--shadow-sm); }
#t02F .p02f-msg { margin: 10px 0 0; min-height: 1.4em; }`,
      js: `var tr = $('[data-tr]', box), inn = $('#t02F-in', box), msg = $('[data-msg]', box);
function set(open) { tr.setAttribute('aria-expanded', String(open)); if (inn._a) inn._a.cancel();
  if (open) { inn.hidden = false; if (moving()) inn._a = inn.animate([{ height: '0px', opacity: 0 }, { height: inn.offsetHeight + 'px', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' }); }
  else if (moving()) { inn._a = inn.animate([{ height: inn.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' }); inn._a.onfinish = function () { if (tr.getAttribute('aria-expanded') === 'false') inn.hidden = true; }; }
  else inn.hidden = true; }
tr.addEventListener('click', function () { set(tr.getAttribute('aria-expanded') !== 'true'); });
box.addEventListener('keydown', function (e) { if (e.key === 'Escape' && tr.getAttribute('aria-expanded') === 'true') { set(false); tr.focus(); } });
$$('[data-act]', inn).forEach(function (b) { b.addEventListener('click', function () { msg.textContent = b.getAttribute('data-act'); set(false); tr.focus(); }); });`,
    },
  ],
};

/* ---------------- 03 Drawer, more ---------------- */
const drHtml = (id, cls, head = '') => `<div class="d10-page" data-page><div class="d10-row"><div><b>Order #4821</b><span class="l-muted">Amina Otieno · 3 items</span></div><button class="l-btn sm" type="button" data-tr aria-haspopup="dialog">Open</button></div><div class="d10-row ghost"><div><b>Order #4820</b><span class="l-muted">Brian Kiprop · 5 items</span></div></div><p class="l-muted d10-msg" data-msg aria-live="polite"></p></div><div class="l-scrim" data-scrim></div>
<div class="d10 ${cls}" role="dialog" aria-modal="true" aria-labelledby="${id}-h" data-dlg><span class="grab" aria-hidden="true" data-grab></span>${head}<div class="d10-head"><h3 id="${id}-h">Order #4821</h3><button class="l-ib d10-x" type="button" aria-label="Close" data-close>${X}</button></div><div class="d10-items"><div><span>Sukuma wiki, 2 bunches</span><span class="l-num">120</span></div><div><span>Unga, 2 kg</span><span class="l-num">230</span></div><div><span>Cooking oil, 1 L</span><span class="l-num">410</span></div><div class="tot"><span>Total</span><span class="l-num">KES 760</span></div></div>
<ol class="d10-steps"><li class="done">Paid by PocketPay · 2:14 pm</li><li class="done">Packed · 2:31 pm</li><li class="now">Out for delivery</li></ol><button class="l-btn pri d10-go" type="button" data-sent>Mark as delivered</button></div>`;
const sheetCss = (id) => `#${id} .d10-bottom { left: 0; right: 0; bottom: 0; height: 92%; border-radius: 18px 18px 0 0; border-top: 1px solid var(--line); transform: translateY(102%); transition: transform .3s var(--ease-out), visibility 0s linear .3s; }
#${id} .d10-bottom.is-open { transform: translateY(var(--stop, 45%)); transition: transform var(--sp-snappy-d) var(--sp-snappy), visibility 0s; }
#${id} .d10-bottom.is-drag { transition: none; }
#${id} .grab { display: block; align-self: center; flex: none; width: 56px; height: 22px; margin: -12px 0 -6px; border-radius: 11px; cursor: grab; position: relative; touch-action: none; }
#${id} .grab::before { content: ""; position: absolute; left: 14px; right: 14px; top: 9px; height: 4px; border-radius: 4px; background: var(--line-hi); }`;
const drawer = {
  id: 'drawer', n: '03', name: 'Drawer, more', h: 400,
  claim: 'A drawer should <em>move like a real sheet.</em>',
  lead: 'You asked for more of the bottom sheet (D), and the right-side sheet (A) with more motion. Open order #4821 in each. Drag where you see a handle.',
  ref: { ids: 'Round 1', text: 'You liked D, the bottom sheet with two stops, and A, the plain right-side sheet, but wanted A to move more.', url: R1, label: 'Open round 1' },
  noteHint: 'C\'s stops with D\'s top bar', moreHint: 'a drawer with a form inside',
  css: `.d10 .d10-x { transition: transform .3s var(--ease-out); }`,
  opts: [
    {
      k: 'A', name: 'The right sheet, with its lines arriving', line: 'Round 1\'s A with more motion: the sheet slides in on a soft spring, then its title, items and steps arrive one after another. The close button turns in.',
      kind: 'Plain, with more motion', from: [sh('sheet'), ez('sheet'), skill('animate')], tryit: 'Open it and watch the order the lines come in.',
      needs: 'CSS springs.', keys: 'Escape closes. Focus stays inside.', off: 'Shows at once.', law: 'Jakob: the usual right-side sheet.',
      tags: ['motion:springy', 'speed:mid', 'open:edge', 'new:familiar', 'look:ember'],
      html: drHtml('t03A', 'd10-right'),
      css: `#t03A .d10.is-open { transition: transform var(--sp-soft-d) var(--sp-soft), visibility 0s; }
#t03A .d10.is-open > :not(.grab) { animation: l-fadeup .4s var(--ease-out) both; }
#t03A .d10.is-open > .d10-items { animation-delay: .08s; }
#t03A .d10.is-open > .d10-steps { animation-delay: .14s; }
#t03A .d10.is-open > .d10-go { animation-delay: .2s; }
#t03A .d10:not(.is-open) .d10-x { transform: rotate(-90deg); }`,
      js: `TLdrawer(box);`,
    },
    {
      k: 'B', name: 'The right sheet with a rubber band', line: 'Drag it to the right to close. Pull it the wrong way and it stretches a little, then springs back, like a real sheet held at one edge.',
      from: [be('drawer'), ['Vaul', 'https://vaul.emilkowal.ski/']], tryit: 'Open it. Drag it left, then let go. Then drag it right.',
      needs: 'CSS springs and pointer events.', keys: 'Same as A.', off: 'No stretch; it closes at once.', law: 'Fitts: the whole sheet is the handle.',
      tags: ['motion:springy', 'speed:mid', 'open:edge', 'feedback:clear', 'new:twist', 'look:ember'],
      html: drHtml('t03B', 'd10-right'),
      css: `#t03B .d10.is-open { transition: transform var(--sp-bouncy-d) var(--sp-bouncy), visibility 0s; cursor: grab; }
#t03B .d10.is-drag { transition: none; cursor: grabbing; }`,
      js: `var api = TLdrawer(box), d = api.d, x0 = null, dx = 0;
d.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; x0 = e.clientX; dx = 0; d.setPointerCapture(e.pointerId); d.classList.add('is-drag'); });
d.addEventListener('pointermove', function (e) { if (x0 === null) return; dx = e.clientX - x0; var v = dx < 0 ? -Math.pow(-dx, .7) : dx; if (!moving() && dx < 0) v = 0; d.style.transform = 'translateX(' + v + 'px)'; });
function end() { if (x0 === null) return; x0 = null; d.classList.remove('is-drag'); d.style.transform = ''; if (dx > d.offsetWidth * .3) api.pop.set(false); }
d.addEventListener('pointerup', end); d.addEventListener('pointercancel', end);`,
    },
    {
      k: 'C', name: 'A bottom sheet with three stops', line: 'It opens to a peek with the total, then half, then full. Drag the handle and it snaps to the nearest stop on a spring. Arrow keys on the handle move between stops.',
      kind: 'Mix', from: [be('bottom-sheet'), ['Vaul snap points', 'https://vaul.emilkowal.ski/snap-points'], skill('animate')], tryit: 'Open it, then drag the handle up in two steps.',
      needs: 'CSS springs and pointer events.', keys: 'Handle: Up and Down move a stop. Escape closes.', off: 'Jumps between stops.', law: 'Hick: you see the total first, details only if you pull.',
      tags: ['motion:springy', 'speed:mid', 'open:edge', 'density:compact', 'new:twist', 'look:ember'], h: 420,
      html: drHtml('t03C', 'd10-bottom'),
      css: sheetCss('t03C') + `\n#t03C .d10-bottom { --stop: 68%; }`,
      js: `var STOPS = [68, 40, 0], at = 0, api = TLdrawer(box, { onOpen: function () { go(0); }, onClose: function () {} }), d = api.d, g = $('[data-grab]', box);
g.setAttribute('role', 'slider'); g.setAttribute('tabindex', '0'); g.setAttribute('aria-label', 'Sheet height'); g.setAttribute('aria-valuemin', '1'); g.setAttribute('aria-valuemax', '3'); g.removeAttribute('aria-hidden');
function go(i) { at = Math.max(0, Math.min(2, i)); d.style.setProperty('--stop', STOPS[at] + '%'); g.setAttribute('aria-valuenow', String(at + 1)); g.setAttribute('aria-valuetext', ['Peek', 'Half', 'Full'][at]); }
g.addEventListener('keydown', function (e) { if (e.key === 'ArrowUp') { e.preventDefault(); go(at + 1); } else if (e.key === 'ArrowDown') { e.preventDefault(); if (at === 0) api.pop.set(false); else go(at - 1); } });
var y0 = null, base = 0;
g.addEventListener('pointerdown', function (e) { y0 = e.clientY; base = d.offsetHeight * STOPS[at] / 100; g.setPointerCapture(e.pointerId); d.classList.add('is-drag'); });
g.addEventListener('pointermove', function (e) { if (y0 === null) return; var y = Math.max(0, base + e.clientY - y0); d.style.transform = 'translateY(' + y + 'px)'; });
g.addEventListener('pointerup', function (e) { if (y0 === null) return; var y = base + e.clientY - y0, p = y / d.offsetHeight * 100; y0 = null; d.classList.remove('is-drag'); d.style.transform = '';
  if (p > 84) { api.pop.set(false); return; } var best = 0; STOPS.forEach(function (s, i) { if (Math.abs(s - p) < Math.abs(STOPS[best] - p)) best = i; }); go(best); });
g.addEventListener('click', function () { if (at < 2) go(at + 1); });`,
    },
    {
      k: 'D', name: 'The sheet turns into a page at the top', line: 'Round 1\'s D, pushed: pull it all the way up and the rounded sheet squares off, the handle fades, and the title moves into a top bar with a back arrow.',
      kind: 'Reference, pushed', from: [be('bottom-sheet'), ['iOS sheets that become pages', null], skill('animate')], tryit: 'Open it, then press or drag the handle up.',
      needs: 'CSS springs.', keys: 'Handle: Enter or Up goes full. Back arrow or Escape returns.', off: 'Swaps at once.', law: 'Jakob: full height works like a normal page.',
      tags: ['motion:springy', 'speed:mid', 'open:edge', 'new:twist', 'look:ember'], h: 420,
      html: drHtml('t03D', 'd10-bottom', '<div class="bar" aria-hidden="true"><button class="l-ib back" type="button" tabindex="-1" aria-label="Back to half" data-back><svg viewBox="0 0 16 16" fill="none"><path d="m10 3.5-4.5 4.5 4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button><b>Order #4821</b></div>'),
      css: sheetCss('t03D') + `
#t03D .d10-bottom { transition: transform .3s var(--ease-out), border-radius .3s var(--ease-out), visibility 0s linear .3s; }
#t03D .d10-bottom.is-full { --stop: 0%; border-radius: 0; height: 100%; }
#t03D .bar { display: flex; align-items: center; gap: 8px; height: 0; opacity: 0; overflow: hidden; transition: height .35s var(--ease-out), opacity .2s; }
#t03D .bar .back { width: 32px; height: 32px; box-shadow: none; }
#t03D .is-full .bar { height: 36px; opacity: 1; }
#t03D .is-full .grab { opacity: 0; pointer-events: none; }
#t03D .d10-head { transition: opacity .2s, height .3s var(--ease-out); }
#t03D .is-full .d10-head h3 { opacity: 0; }`,
      js: `var g = $('[data-grab]', box), bk = $('[data-back]', box), bar = $('.bar', box); g.setAttribute('role', 'button'); g.setAttribute('tabindex', '0'); g.setAttribute('aria-label', 'Show the full order'); g.removeAttribute('aria-hidden');
var api = TLdrawer(box, { onClose: function () { full(false); } });
function full(on) { api.d.classList.toggle('is-full', on); bar.setAttribute('aria-hidden', String(!on)); bk.tabIndex = on ? 0 : -1; g.tabIndex = on ? -1 : 0; if (on) setTimeout(function () { bk.focus(); }, 60); }
g.addEventListener('click', function () { full(true); }); g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); full(true); } });
bk.addEventListener('click', function () { full(false); g.focus(); });
api.d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && api.d.classList.contains('is-full')) { e.stopPropagation(); full(false); g.focus(); } }, true);
var y0 = null; g.addEventListener('pointerdown', function (e) { y0 = e.clientY; }); g.addEventListener('pointerup', function (e) { if (y0 !== null && e.clientY - y0 < -20) full(true); else if (y0 !== null && e.clientY - y0 > 20) api.pop.set(false); y0 = null; });`,
    },
  ],
};

/* ---------------- 04 Choice: radio and segmented ---------------- */
const DEL = [['std', 'Standard', 'Free', 'Arrives Thursday 5 November.'], ['exp', 'Express', 'KES 250', 'Arrives today by 6 pm.'], ['pick', 'Pickup', 'Free', 'Ready from 4 pm at our Westlands shop.']];
const radios = (id, cls = 'c04-o') => DEL.map(([v, n, p], i) => `<label class="${cls}"><input type="radio" name="${id}-d" value="${v}"${i === 0 ? ' checked' : ''}><span class="nm">${n}</span><span class="pr">${p}</span></label>`).join('');
const choice = {
  id: 'choice', n: '04', name: 'Choice: radio and segmented', h: 260,
  claim: 'Choosing one of a few things should <em>take one tap.</em>',
  lead: 'How should we deliver? Three choices, one answer. Every version uses real radio buttons, so arrow keys move between them.',
  ref: null,
  noteHint: 'G, but without the tick', moreHint: 'a choice with five or more options',
  css: `.c04 { width: min(100%, 360px); display: grid; gap: 10px; text-align: left; }
.c04 input { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; }
.c04-out { margin: 0; min-height: 1.4em; font-size: 13.5px; color: var(--ink-soft); }
.c04 label { cursor: pointer; }
.c04 label:has(input:focus-visible) { outline: 2px solid var(--accent); outline-offset: 2px; }`,
  js: `window.TLchoice = function (box, onChange) { var out = $('[data-out]', box), ins = $$('input', box), D = ${JSON.stringify(DEL)};
  function upd(first) { var i = ins.findIndex(function (x) { return x.checked; }), d = D[i]; out.textContent = d[1] + ' · ' + d[2] + '. ' + d[3]; if (onChange) onChange(i, first); }
  ins.forEach(function (x) { x.addEventListener('change', function () { upd(false); }); }); upd(true); };`,
  opts: [
    {
      k: 'B', name: 'A pill that springs to your choice', line: 'A segmented control: the orange-edged pill springs across to the one you pick, and the line under it changes.',
      from: [be('segmented-control'), ez('segmented-control')], tryit: 'Click Pickup, then use the arrow keys.',
      needs: 'CSS springs.', keys: 'Tab in, arrows move and pick.', off: 'The pill jumps.', law: 'Fitts: big targets side by side.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'new:twist', 'look:ember'],
      html: `<div class="c04" role="radiogroup" aria-label="Delivery"><div class="seg"><span class="pill" aria-hidden="true"></span>${radios('t04B', 'sg')}</div><p class="c04-out" data-out aria-live="polite"></p></div>`,
      css: `#t04B .seg { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); padding: 4px; border-radius: 12px; background: rgb(var(--ink-rgb) / .07); }
#t04B .sg { position: relative; z-index: 1; display: grid; justify-items: center; gap: 1px; padding: 8px 4px; border-radius: 9px; }
#t04B .sg .nm { font-size: 14px; font-weight: 600; color: var(--ink); }
#t04B .sg .pr { font-size: 12px; color: var(--muted); }
#t04B .pill { position: absolute; top: 4px; bottom: 4px; left: 4px; width: calc((100% - 8px) / 3); border-radius: 9px; background: var(--paper-raised); box-shadow: 0 0 0 1px var(--line), var(--shadow-sm); transition: transform var(--sp-bouncy-d) var(--sp-bouncy); }`,
      js: `var pill = $('.pill', box); TLchoice(box, function (i) { pill.style.transform = 'translateX(' + (i * 100) + '%)'; });`,
    },
    {
      k: 'A', name: 'A plain list of round buttons', line: 'The shadcn radio group: a circle for each choice, a dot in the one you pick. The price sits on the right.',
      from: [sh('radio-group'), radix('radio-group')], tryit: 'Pick Express.',
      needs: 'CSS only.', keys: 'Tab in, arrows move and pick.', off: 'Same.', law: 'Jakob: the form control everyone knows.',
      tags: ['motion:still', 'speed:quick', 'density:mid', 'new:familiar', 'look:ember'],
      html: `<div class="c04" role="radiogroup" aria-label="Delivery">${radios('t04A', 'rl')}<p class="c04-out" data-out aria-live="polite"></p></div>`,
      css: `#t04A .rl { position: relative; display: flex; align-items: center; gap: 10px; min-height: 40px; font-size: 14.5px; color: var(--ink); }
#t04A .rl::before { content: ""; width: 18px; height: 18px; flex: none; box-sizing: border-box; border-radius: 50%; border: 1.5px solid var(--line-hi); background: var(--paper-raised); }
#t04A .rl:has(input:checked)::before { border: 5.5px solid var(--accent); }
#t04A .rl .pr { margin-left: auto; color: var(--muted); font-size: 13.5px; }`,
      js: `TLchoice(box);`,
    },
    {
      k: 'C', name: 'Cards that lift when picked', line: 'Each choice is a small card. The one you pick lifts, gets an orange edge, and a tick draws in its corner.',
      from: [ez('radio-cards'), sh('radio-group'), ['patterns/depth.md', null]], tryit: 'Pick each card in turn.',
      needs: 'CSS only.', keys: 'Tab in, arrows move and pick.', off: 'No lift.', law: 'Fitts: the whole card is the target.',
      tags: ['motion:some', 'speed:mid', 'depth:lifted', 'density:roomy', 'new:twist', 'look:ember'], h: 300,
      html: `<div class="c04" role="radiogroup" aria-label="Delivery"><div class="cards">${DEL.map(([v, n, p, w], i) => `<label class="cd"><input type="radio" name="t04C-d" value="${v}"${i === 0 ? ' checked' : ''}><span class="nm">${n}</span><span class="pr">${p}</span><svg class="tk" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="11"/><path d="M6.6 11.4 9.6 14.3l5.8-6.4"/></svg></label>`).join('')}</div><p class="c04-out" data-out aria-live="polite"></p></div>`,
      css: `#t04C .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
#t04C .cd { position: relative; display: grid; gap: 2px; padding: 12px 10px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); transition: transform .3s var(--ease-out), border-color .2s, box-shadow .3s; }
#t04C .cd .nm { font-size: 14px; font-weight: 600; color: var(--ink); }
#t04C .cd .pr { font-size: 12.5px; color: var(--muted); }
#t04C .cd:has(input:checked) { border-color: var(--accent); transform: translateY(-3px); box-shadow: var(--shadow-lg); }
#t04C .tk { position: absolute; right: 8px; top: 8px; width: 18px; height: 18px; opacity: 0; }
#t04C .tk circle { fill: var(--accent); }
#t04C .tk path { fill: none; stroke: var(--on-accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 16; stroke-dashoffset: 16; }
#t04C .cd:has(input:checked) .tk { opacity: 1; }
#t04C .cd:has(input:checked) .tk path { stroke-dashoffset: 0; transition: stroke-dashoffset .34s var(--ease-out) .08s; }
@media (max-width: 400px) { #t04C .cards { grid-template-columns: 1fr; } }`,
      js: `TLchoice(box);`,
    },
    {
      k: 'D', name: 'A choice that explains itself', line: 'A segmented control on top, and a box under it that tells you what the choice means: the day it arrives and the cost. The box glides to its new height and the words cross-fade.',
      kind: 'Mix, pushed', from: [be('segmented-control'), skill('animate'), ['DESIGN.md: closing boxes glide all the way', null]], tryit: 'Switch between all three and watch the box below.',
      needs: 'CSS and the Web Animations API.', keys: 'Tab in, arrows move and pick.', off: 'Swaps at once.', law: 'Hick: you see the result of a choice before you move on.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'], h: 300,
      html: `<div class="c04" role="radiogroup" aria-label="Delivery"><div class="seg">${radios('t04D', 'sg')}</div><div class="ex" data-ex><div class="in" data-in></div></div><p class="c04-out sr" data-out aria-live="polite"></p></div>`,
      css: `#t04D .seg { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--line-hi); border-radius: 10px; overflow: hidden; }
#t04D .sg { display: grid; place-items: center; min-height: 40px; font-size: 14px; font-weight: 500; color: var(--ink-soft); border-left: 1px solid var(--line); transition: background-color .2s, color .2s; }
#t04D .sg:first-child { border-left: 0; }
#t04D .sg .pr { display: none; }
#t04D .sg:has(input:checked) { background: var(--ink); color: var(--paper); }
#t04D .ex { overflow: hidden; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); }
#t04D .in { padding: 12px 14px; display: grid; gap: 4px; }
#t04D .in b { font-size: 22px; font-family: var(--font-num); font-weight: 400; color: var(--ink); }
#t04D .in p { margin: 0; font-size: 13.5px; color: var(--ink-soft); }
#t04D .in .x { font-size: 12.5px; color: var(--muted); }`,
      js: `var ex = $('[data-ex]', box), inn = $('[data-in]', box), MORE = ['Our rider brings it with other orders on the way.', 'A rider leaves within the hour, just for you.', 'Show your order number at the counter.'];
TLchoice(box, function (i, first) { var D = ${JSON.stringify(DEL)}[i], h0 = ex.offsetHeight;
  inn.innerHTML = '<b>' + D[2] + '</b><p>' + D[3] + '</p><p class="x">' + MORE[i] + '</p>';
  if (first || !moving()) return; inn.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' }); TLglide(ex, h0, 320); });`,
    },
    {
      k: 'G', name: 'Cards, a frame that springs between them, and a note below', line: 'Your mix of B, C and D. Each choice is a card (C). An orange frame springs from card to card (B), the picked card lifts and its tick draws in. Under them, a box tells you what it means and glides to its new size (D).',
      kind: 'Your mix', from: [be('segmented-control'), ez('radio-cards'), skill('animate')], tryit: 'Click each card, then use the arrow keys.',
      needs: 'CSS springs and the Web Animations API.', keys: 'Tab in, arrows move and pick.', off: 'The frame jumps and the box swaps at once.', law: 'Hick: you see what a choice means before you move on.',
      tags: ['motion:springy', 'speed:mid', 'depth:lifted', 'feedback:clear', 'new:twist', 'look:ember'], h: 340,
      html: `<div class="c04" role="radiogroup" aria-label="Delivery"><div class="cards"><span class="fr" aria-hidden="true"></span>${DEL.map(([v, n, p], i) => `<label class="cd"><input type="radio" name="t04G-d" value="${v}"${i === 0 ? ' checked' : ''}><span class="nm">${n}</span><span class="pr">${p}</span><svg class="tk" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="11"/><path d="M6.6 11.4 9.6 14.3l5.8-6.4"/></svg></label>`).join('')}</div><div class="ex" data-ex><div class="in" data-in></div></div><p class="c04-out sr" data-out aria-live="polite"></p></div>`,
      css: `#t04G .cards { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
#t04G .cd { position: relative; z-index: 1; display: grid; gap: 2px; padding: 12px 10px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); transition: transform var(--sp-bouncy-d) var(--sp-bouncy); }
#t04G .cd:has(input:checked) { transform: translateY(-3px); border-color: transparent; }
#t04G .cd .nm { font-size: 14px; font-weight: 600; color: var(--ink); }
#t04G .cd .pr { font-size: 12.5px; color: var(--muted); }
#t04G .fr { position: absolute; z-index: 2; left: 0; top: 0; border-radius: 12px; border: 1.5px solid var(--accent); box-shadow: var(--shadow-lg); pointer-events: none; transition: transform var(--sp-bouncy-d) var(--sp-bouncy), width .2s, height .2s; }
#t04G .tk { position: absolute; right: 8px; top: 8px; width: 18px; height: 18px; opacity: 0; }
#t04G .tk circle { fill: var(--accent); }
#t04G .tk path { fill: none; stroke: var(--on-accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 16; stroke-dashoffset: 16; }
#t04G .cd:has(input:checked) .tk { opacity: 1; }
#t04G .cd:has(input:checked) .tk path { stroke-dashoffset: 0; transition: stroke-dashoffset .34s var(--ease-out) .12s; }
#t04G .ex { overflow: hidden; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); }
#t04G .in { padding: 12px 14px; display: grid; gap: 4px; }
#t04G .in b { font-size: 22px; font-family: var(--font-num); font-weight: 400; color: var(--ink); }
#t04G .in p { margin: 0; font-size: 13.5px; color: var(--ink-soft); }
#t04G .in .x { font-size: 12.5px; color: var(--muted); }
@media (max-width: 400px) { #t04G .cd { padding: 10px 8px; } #t04G .tk { width: 14px; height: 14px; right: 6px; top: 6px; } }`,
      js: `var ex = $('[data-ex]', box), inn = $('[data-in]', box), fr = $('.fr', box), cds = $$('.cd', box), cur = 0, MORE = ['Our rider brings it with other orders on the way.', 'A rider leaves within the hour, just for you.', 'Show your order number at the counter.'];
function place() { var c = cds[cur]; fr.style.width = c.offsetWidth + 'px'; fr.style.height = c.offsetHeight + 'px'; fr.style.transform = 'translate(' + c.offsetLeft + 'px,' + (c.offsetTop - 3) + 'px)'; }
TLchoice(box, function (i, first) { var D = ${JSON.stringify(DEL)}[i], h0 = ex.offsetHeight; cur = i;
  if (first) { fr.style.transition = 'none'; place(); fr.offsetWidth; fr.style.transition = ''; } else place();
  inn.innerHTML = '<b>' + D[2] + '</b><p>' + D[3] + '</p><p class="x">' + MORE[i] + '</p>';
  if (first || !moving()) return; inn.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' }); TLglide(ex, h0, 320); });
new ResizeObserver(function () { var t = fr.style.transition; fr.style.transition = 'none'; place(); fr.offsetWidth; fr.style.transition = t; }).observe(box.querySelector('.cards'));`,
    },
  ],
};

/* ---------------- 05 Slider ---------------- */
const rangeHtml = (id, extra = '', top = '') => `<div class="s05">${top}<div class="s05-h"><label class="l-lbl" for="${id}-r">Save each week</label><output class="s05-v" for="${id}-r" data-v>KES 1,500</output></div><div class="s05-t"><input type="range" id="${id}-r" min="100" max="5000" step="100" value="1500" data-r aria-describedby="${id}-g"></div>${extra}<p class="l-muted s05-g" id="${id}-g" data-g></p></div>`;
const slider = {
  id: 'slider', n: '05', name: 'Slider', h: 260,
  claim: 'A slider should show <em>what the number buys.</em>',
  lead: 'Save for a phone that costs KES 24,000. Slide how much you put away each week, and see how long it takes. Every version is a real range input, so arrow keys and Page keys work.',
  ref: { ids: 'n06', text: 'Three numbers that count up and can be scrubbed.' },
  noteHint: 'B\'s bubble with D\'s weeks', moreHint: 'a slider with two handles for a price range',
  css: `.s05 { width: min(100%, 360px); text-align: left; }
.s05-h { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
.s05-h .l-lbl { margin: 0; }
.s05-v { font-family: var(--font-num); font-size: 22px; color: var(--ink); font-variant-numeric: tabular-nums; }
.s05-t { position: relative; }
.s05 input[type=range] { --p: 28.6%; width: 100%; height: 28px; margin: 0; background: transparent; -webkit-appearance: none; appearance: none; cursor: pointer; }
.s05 input[type=range]::-webkit-slider-runnable-track { height: 6px; border-radius: 6px; background: linear-gradient(90deg, var(--accent) var(--p), rgb(var(--ink-rgb) / .12) var(--p)); }
.s05 input[type=range]::-moz-range-track { height: 6px; border-radius: 6px; background: linear-gradient(90deg, var(--accent) var(--p), rgb(var(--ink-rgb) / .12) var(--p)); }
.s05 input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; margin-top: -8px; border-radius: 50%; background: var(--paper-raised); border: 2px solid var(--accent); box-shadow: var(--shadow-sm); transition: transform .15s var(--ease-out); }
.s05 input[type=range]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: var(--paper-raised); border: 2px solid var(--accent); box-shadow: var(--shadow-sm); }
.s05 input[type=range]:focus-visible { outline: none; }
.s05 input[type=range]:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgb(var(--accent-rgb) / .25); }
.s05-g { margin: 10px 0 0; min-height: 1.4em; font-size: 13.5px; }`,
  js: `window.TLslider = function (box, o) { o = o || {}; var r = $('[data-r]', box), v = $('[data-v]', box), g = $('[data-g]', box), shown = +r.value, an = null;
  function weeks(x) { return Math.ceil(24000 / x); }
  function show(x) { v.textContent = 'KES ' + TLmoney(Math.round(x)); }
  function upd(first) { var x = +r.value, p = (x - r.min) / (r.max - r.min) * 100; r.style.setProperty('--p', p + '%'); var w = weeks(x);
    g.textContent = 'The phone is yours in ' + w + ' weeks, around ' + new Date(2026, 10, 1 + w * 7).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + '.';
    if (o.count && !first && moving()) { cancelAnimationFrame(an); var from = shown, t0 = performance.now(); (function step(n) { var k = Math.min(1, (n - t0) / 300); shown = from + (x - from) * (1 - Math.pow(1 - k, 3)); show(shown); if (k < 1) an = requestAnimationFrame(step); })(t0); } else { shown = x; show(x); }
    if (o.on) o.on(x, p, w, first); }
  r.addEventListener('input', function () { upd(false); }); upd(true); return r; };`,
  opts: [
    {
      k: 'B', name: 'A thumb that swells, a bubble that follows', line: 'Press the thumb and it swells. A small bubble with the amount rides above it on a spring, a step behind your finger.',
      from: [be('slider'), ez('spring-slider')], tryit: 'Drag fast, then stop.',
      needs: 'CSS springs.', keys: 'Arrows move 100, Page keys move 1,000, Home and End jump.', off: 'The bubble moves with no lag.', law: 'Fitts: the bubble shows the value where your eyes already are.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: rangeHtml('t05B', '', ''),
      css: `#t05B input[type=range]:active::-webkit-slider-thumb { transform: scale(1.25); }
#t05B .bub { position: absolute; left: 0; bottom: calc(100% + 2px); padding: 4px 8px; border-radius: 7px; background: var(--ink); color: var(--paper); font: 500 12px/1 var(--font-mono); white-space: nowrap; pointer-events: none; transform: translateX(calc(var(--x, 0px) - 50%)); transition: transform var(--sp-snappy-d) var(--sp-snappy), opacity .15s; opacity: 0; }
#t05B .s05-t:hover .bub, #t05B .s05-t:focus-within .bub { opacity: 1; }`,
      js: `var t = $('.s05-t', box); t.insertAdjacentHTML('afterbegin', '<span class="bub" aria-hidden="true"></span>'); var b = $('.bub', box);
TLslider(box, { on: function (x, p) { var w = t.offsetWidth - 22; b.style.setProperty('--x', (11 + w * p / 100) + 'px'); b.textContent = TLmoney(x); } });`,
    },
    {
      k: 'A', name: 'A plain slider and a number', line: 'The shadcn slider: an orange fill, a round thumb, and the amount at the top right.',
      from: [sh('slider'), radix('slider')], tryit: 'Use the arrow keys.',
      needs: 'CSS only.', keys: 'Same as B.', off: 'Same.', law: 'Jakob: the slider everyone knows.',
      tags: ['motion:still', 'speed:quick', 'new:familiar', 'look:ember'],
      html: rangeHtml('t05A'), js: `TLslider(box);`,
    },
    {
      k: 'C', name: 'Marks every 1,000, a number that counts', line: 'Small marks every KES 1,000 under the track. The big number counts to its new value instead of jumping.',
      from: [ez('stepped-slider'), house('n06')], tryit: 'Click near a mark, then press Page Up.',
      needs: 'CSS and script.', keys: 'Same as B.', off: 'The number jumps.', law: 'Proximity: the marks put numbers right under the track.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: rangeHtml('t05C', '<div class="mk" aria-hidden="true"><span>100</span><span>1k</span><span>2k</span><span>3k</span><span>4k</span><span>5k</span></div>'),
      css: `#t05C .s05-v { font-size: 30px; }
#t05C .mk { display: flex; justify-content: space-between; padding: 0 4px; margin-top: 2px; font: 500 10.5px/1 var(--font-mono); color: var(--muted); }
#t05C .mk span { position: relative; padding-top: 7px; }
#t05C .mk span::before { content: ""; position: absolute; left: 50%; top: 0; width: 1px; height: 5px; background: var(--line-hi); }`,
      js: `TLslider(box, { count: true });`,
    },
    {
      k: 'D', name: 'Weeks to the goal, as a big number and a bar', line: 'Your n06, pushed: the weeks count up in big type, and a row of bars fills to KES 24,000, one bar per week. Slide less and the row grows longer.',
      kind: 'Reference, pushed', from: [house('n06'), ['DESIGN.md: numbers count up', null]], tryit: 'Slide to 500, then to 5,000.',
      needs: 'CSS and script.', keys: 'Same as B.', off: 'Numbers and bars jump.', law: 'Hick: the one number that matters is the biggest.',
      tags: ['motion:some', 'speed:mid', 'feedback:loud', 'new:twist', 'look:ember'], h: 300,
      html: rangeHtml('t05D', '', '<div class="big"><span class="w" data-w>16</span><span class="l">weeks to your phone</span></div><div class="bars" aria-hidden="true" data-bars></div>'),
      css: `#t05D .big { display: flex; align-items: baseline; gap: 10px; margin-bottom: 6px; }
#t05D .w { font-family: var(--font-num); font-size: 56px; line-height: 1; color: var(--ink); font-variant-numeric: tabular-nums; }
#t05D .l { font-size: 14px; color: var(--muted); }
#t05D .bars { display: flex; gap: 2px; height: 22px; align-items: flex-end; margin-bottom: 14px; }
#t05D .bars i { flex: 1; height: 100%; border-radius: 2px; background: rgb(var(--ink-rgb) / .15); transform-origin: bottom; animation: s05grow .3s var(--ease-out) both; }
#t05D .bars i:last-child { background: var(--accent); }
@keyframes s05grow { from { transform: scaleY(.3); opacity: 0; } }
#t05D .s05-g { display: none; }`,
      js: `var W = $('[data-w]', box), bars = $('[data-bars]', box), sw = 16, an = null;
TLslider(box, { on: function (x, p, w, first) { var n = Math.min(w, 120); bars.innerHTML = new Array(n + 1).join('<i></i>'); if (first || !moving()) { sw = w; W.textContent = w; return; }
  cancelAnimationFrame(an); var from = sw, t0 = performance.now(); (function step(t) { var k = Math.min(1, (t - t0) / 350); sw = Math.round(from + (w - from) * (1 - Math.pow(1 - k, 3))); W.textContent = sw; if (k < 1) an = requestAnimationFrame(step); })(t0); } });`,
    },
  ],
};

export default [contrast, popover, drawer, choice, slider];
