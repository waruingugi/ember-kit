// Batch 2: tabs, dropdown menu, tooltip, popover.
import { sh, be, ez, radix, house, skill } from './src-links.mjs';

const ic = (d) => `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const I = {
  user: ic('M8 8a2.6 2.6 0 1 0 0-5.2A2.6 2.6 0 0 0 8 8zM3 13.5c.6-2.3 2.6-3.6 5-3.6s4.4 1.3 5 3.6'),
  cash: ic('M2 4.5h12v7H2zM8 9.6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2zM4.5 8h.01M11.5 8h.01'),
  team: ic('M6 7.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4zM2 13c.5-2 2-3.1 4-3.1s3.5 1.1 4 3.1M11 7.3a1.9 1.9 0 1 0 0-3.8M12 9.9c1.2.4 2 1.4 2.3 3'),
  bell: ic('M4 11V7.2a4 4 0 0 1 8 0V11l1.2 1.3H2.8zM6.6 13.8a1.5 1.5 0 0 0 2.8 0'),
  edit: ic('M10.5 2.8l2.7 2.7L6 12.7H3.3V10zM9.2 4.1l2.7 2.7'),
  copy: ic('M5.5 5.5h7v7h-7zM3.5 10.5v-7h7'),
  down: ic('M8 2.5v8M4.8 7.5 8 10.7l3.2-3.2M3 13.5h10'),
  send: ic('M2.5 8 13.5 2.8 10.8 13.5 7.8 9.2zM7.8 9.2 13.5 2.8'),
  del: ic('M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 9h5.8l.6-9'),
  dots: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="3.5" cy="8" r="1.3" fill="currentColor"/><circle cx="8" cy="8" r="1.3" fill="currentColor"/><circle cx="12.5" cy="8" r="1.3" fill="currentColor"/></svg>',
  ref: ic('M13 8a5 5 0 1 1-1.5-3.5M13 2.8v2.7h-2.7'),
  exp: ic('M8 10.5v-8M5 5.5l3-3 3 3M3 9.5v4h10v-4'),
  share: ic('M11.5 5.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM4.5 9.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM11.5 14.1a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM6.1 7.1l3.8-2M6.1 8.9l3.8 2'),
  filt: ic('M2.5 3.5h11L9.3 8.5v4l-2.6 1.2V8.5z'),
  chev: ic('m6 4 4 4-4 4'),
};

/* ---------------- 05 Tabs ---------------- */
const TABS = [
  ['Profile', I.user, '<p><b>Duka Fresh</b></p><p class="l-muted">Shop on Moi Avenue, Nairobi. Open 7 am to 9 pm.</p>'],
  ['Payouts', I.cash, '<p>Paid to PocketPay till <b class="l-num">552 211</b> every Friday.</p><p class="l-muted">Next payout: KES 38,400 on 7 November.</p><p class="l-muted">Last payout: KES 41,050 on 31 October.</p>'],
  ['Team', I.team, '<ul class="t05-ul"><li>Amina Otieno <span class="l-muted">· owner</span></li><li>Brian Kiprop <span class="l-muted">· cashier</span></li><li>Wanjiru Mwangi <span class="l-muted">· stock</span></li><li>Otieno Ouma <span class="l-muted">· delivery</span></li></ul>'],
  ['Alerts', I.bell, '<p>Email receipts are on.</p>'],
];
const tabsHtml = (id, cls, icons = false, num = false) => `<div class="t05 ${cls}"><div class="t05-list" role="tablist" aria-label="Shop settings"><span class="ind" aria-hidden="true"></span>${TABS.map(([n, i], j) => `<button class="t05-tab" type="button" role="tab" id="${id}-t${j}" aria-controls="${id}-p${j}" aria-selected="${j === 0}" tabindex="${j === 0 ? 0 : -1}">${num ? `<span class="nn">0${j + 1}</span>` : ''}${icons ? i : ''}<span class="tl">${n}</span></button>`).join('')}</div><div class="t05-box"><div class="t05-in">${TABS.map(([n, , c], j) => `<div class="t05-p" role="tabpanel" id="${id}-p${j}" aria-labelledby="${id}-t${j}" tabindex="0"${j ? ' hidden' : ''}>${c}</div>`).join('')}</div></div></div>`;
const tabs = {
  id: 'tabs', n: '05', name: 'Tabs', h: 280,
  claim: 'Tabs should show <em>where you are</em> and where you just were.',
  lead: 'Four pages of shop settings. Click the tabs, or focus one and use the arrow keys. The pages have different lengths on purpose.',
  ref: { ids: 'n17', text: 'Settings tabs with a dark marker that glides, and a box that changes size.' },
  noteHint: 'B\'s underline with C\'s height glide', moreHint: 'vertical tabs for a settings page',
  css: `.t05 { width: min(100%, 360px); align-self: start; text-align: left; }
.t05-list { position: relative; display: flex; gap: 2px; }
.t05-tab { position: relative; z-index: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 34px; padding: 0 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: var(--muted); white-space: nowrap; transition: color .2s; }
.t05-tab svg { width: 15px; height: 15px; }
.t05-tab:hover, .t05-tab[aria-selected="true"] { color: var(--ink); }
.t05-tab:focus-visible { outline-offset: -2px; }
.t05 .ind { position: absolute; left: 0; top: 0; width: 100px; height: 100%; transform-origin: left center; pointer-events: none; }
.t05-box { margin-top: 12px; position: relative; overflow: hidden; }
.t05-p { font-size: 14.5px; }
.t05-p p { margin: 0 0 6px; }
.t05-p:focus-visible { outline-offset: 2px; }
.t05-ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 4px; }`,
  js: `window.TLtabs = function (box, o) {
  o = o || {}; var tabs = $$('[role="tab"]', box), list = $('[role="tablist"]', box), ind = $('.ind', box), bx = $('.t05-box', box), inn = $('.t05-in', box), cur = 0;
  function place(i, first) { if (!ind) return; var t = tabs[i]; if (o.place) return o.place(ind, t, first); ind.style.transform = 'translateX(' + t.offsetLeft + 'px) scaleX(' + (t.offsetWidth / 100) + ')'; }
  function go(i, focus) { if (i === cur) return; var a = $('#' + tabs[cur].getAttribute('aria-controls')), b = $('#' + tabs[i].getAttribute('aria-controls')), dir = i > cur ? 1 : -1, h0 = bx.offsetHeight;
    tabs.forEach(function (t, j) { t.setAttribute('aria-selected', String(j === i)); t.tabIndex = j === i ? 0 : -1; });
    a.hidden = true; b.hidden = false; cur = i; place(i); if (focus) tabs[i].focus();
    if (o.swap && moving()) o.swap(b, dir, bx, h0); }
  tabs.forEach(function (t, i) { t.addEventListener('click', function () { go(i); }); });
  list.addEventListener('keydown', function (e) { var i = cur; if (e.key === 'ArrowRight') i = (cur + 1) % tabs.length; else if (e.key === 'ArrowLeft') i = (cur - 1 + tabs.length) % tabs.length; else if (e.key === 'Home') i = 0; else if (e.key === 'End') i = tabs.length - 1; else return; e.preventDefault(); go(i, true); });
  requestAnimationFrame(function () { place(0, true); }); addEventListener('resize', function () { place(cur, true); });
};
/* height glide: the box moves from old height to new; content stays at the top */
window.TLglide = function (bx, h0, d) { if (bx._gl) bx._gl.cancel(); var h1 = bx.offsetHeight; if (h0 === h1) return; bx._gl = bx.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: d || 380, easing: 'cubic-bezier(.22,1,.36,1)' }); };`,
  opts: [
    {
      k: 'A', name: 'A grey track with a raised tab', line: 'The shadcn tabs: the picked tab sits raised in a grey track. The page swaps at once.',
      from: [sh('tabs'), radix('tabs')], tryit: 'Click Team, then press the left arrow.',
      needs: 'Plain CSS.', keys: 'Arrows move and open, Home and End jump, Tab goes into the page.', off: 'Same; nothing moves.', law: 'Jakob: the most common tab look today.',
      tags: ['motion:still', 'speed:quick', 'density:compact', 'new:familiar', 'look:ember'],
      html: tabsHtml('t05A', 't05a'),
      css: `#t05A .t05-list { padding: 3px; border-radius: 10px; background: rgb(var(--ink-rgb) / .07); }
#t05A .t05-tab { flex: 1; height: 32px; padding: 0 8px; }
#t05A .t05-tab[aria-selected="true"] { background: var(--paper-raised); box-shadow: 0 1px 2px rgb(0 0 0 / .1), 0 0 0 1px var(--line); }`,
      js: `TLtabs(box);`,
    },
    {
      k: 'B', name: 'An underline that springs across', line: 'beUI\'s tabs: an orange line under the tab springs to the next one, and the page cross-fades.',
      from: [be('tabs'), ez('animated-tabs')], tryit: 'Jump from Profile to Alerts and back.',
      needs: 'CSS springs.', keys: 'Same as A.', off: 'The line jumps, no fade.', law: 'Jakob: underline tabs are everywhere.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'new:familiar', 'look:ember'],
      html: tabsHtml('t05B', 't05b'),
      css: `#t05B .t05-list { border-bottom: 1px solid var(--line); gap: 6px; }
#t05B .t05-tab { border-radius: 6px 6px 0 0; padding: 0 8px; height: 38px; }
#t05B .ind { top: auto; bottom: -1px; height: 2px; background: var(--accent); border-radius: 2px; transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#t05B .t05-p { animation: l-fadeup .3s var(--ease-out); }`,
      js: `TLtabs(box);`,
    },
    {
      k: 'C', name: 'A gliding pill, a box that changes height', line: 'A pill glides to the tab, the box grows or shrinks to the new page, and the page slides in from the side you moved to.',
      from: [ez('pill-navigation'), be('expandable-tabs'), skill('animate')], tryit: 'Go from Alerts (short) to Team (long).',
      needs: 'CSS springs and the Web Animations API.', keys: 'Same as A.', off: 'Pill and box jump.', law: 'Proximity: the pill and page move as one group.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: tabsHtml('t05C', 't05c'),
      css: `#t05C .t05-list { padding: 3px; border-radius: 999px; border: 1px solid var(--line); background: var(--paper-raised); width: max-content; max-width: 100%; }
#t05C .t05-tab { border-radius: 999px; }
#t05C .t05-tab[aria-selected="true"] { color: var(--on-accent); }
#t05C .ind { top: 3px; height: calc(100% - 6px); border-radius: 999px; background: var(--accent); transition: transform var(--sp-snappy-d) var(--sp-snappy); }`,
      js: `TLtabs(box, { place: function (ind, t) { ind.style.transform = 'translateX(' + (t.offsetLeft) + 'px) scaleX(' + (t.offsetWidth / 100) + ')'; },
  swap: function (b, dir, bx, h0) { TLglide(bx, h0); b.animate([{ opacity: 0, transform: 'translateX(' + (dir * 18) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' }); } });`,
    },
    {
      k: 'D', name: 'The dark marker stretches as it travels', line: 'Your n17, pushed: the dark marker reaches the new tab first with its front edge, then pulls its back edge after, like a step. The box still glides to its new height.',
      from: [house('n17'), skill('animate')], tryit: 'Click a far tab, then a near one.',
      needs: 'The Web Animations API.', keys: 'Same as A.', off: 'The marker jumps.', law: 'Jakob: looks like tabs, with a new move.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'new:novel', 'look:ember'],
      html: tabsHtml('t05D', 't05d', true),
      css: `#t05D .t05-tab { padding: 0 10px; }
#t05D .t05-tab[aria-selected="true"] { color: var(--paper); }
#t05D .ind { border-radius: 8px; background: var(--ink); }`,
      js: `var last = null; TLtabs(box, { place: function (ind, t, first) { var x1 = t.offsetLeft, w1 = t.offsetWidth, to = 'translateX(' + x1 + 'px) scaleX(' + (w1 / 100) + ')';
    if (first || !last || !moving()) { ind.style.transform = to; last = [x1, w1]; return; }
    var x0 = last[0], w0 = last[1], L = Math.min(x0, x1), R = Math.max(x0 + w0, x1 + w1), mid = 'translateX(' + L + 'px) scaleX(' + ((R - L) / 100) + ')';
    ind.animate([{ transform: ind.style.transform }, { transform: mid, offset: .45 }, { transform: to }], { duration: 440, easing: 'cubic-bezier(.65,0,.35,1)' }); ind.style.transform = to; last = [x1, w1]; },
  swap: function (b, dir, bx, h0) { TLglide(bx, h0, 440); b.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, delay: 120, fill: 'backwards' }); } });`,
    },
    {
      k: 'E', name: 'Numbered words, like a book', line: 'Steps outside ember: no track, no box. Large serif words with small numbers, and an orange line drawn under the one you are on.',
      from: [['Magazine contents pages', null]], tryit: 'Click through the four words.',
      needs: 'Plain CSS.', keys: 'Same as A.', off: 'The line shows at once.', law: 'Jakob bends: these look like links more than tabs.',
      tags: ['motion:some', 'density:roomy', 'depth:flat', 'new:novel', 'look:off'],
      html: tabsHtml('t05E', 't05e', false, true),
      css: `#t05E .t05-list { gap: 16px; flex-wrap: wrap; }
#t05E .t05-tab { padding: 0; height: auto; font-family: var(--font-display); font-size: 21px; font-weight: 400; display: inline-flex; align-items: baseline; gap: 4px; }
#t05E .t05-tab .nn { font-family: var(--font-mono); font-size: 10px; color: var(--muted); }
#t05E .t05-tab[aria-selected="true"] .tl { font-style: italic; }
#t05E .t05-tab .tl { position: relative; }
#t05E .t05-tab .tl::after { content: ""; position: absolute; left: 0; right: 0; bottom: -3px; height: 2px; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform .4s var(--ease-out); }
#t05E .t05-tab[aria-selected="true"] .tl::after { transform: none; }
#t05E .t05-p { font-family: var(--font-display); font-size: 16px; }`,
      js: `TLtabs(box);`,
    },
  ],
};

/* ---------------- 06 Dropdown menu ---------------- */
const ITEMS = [['edit', 'Edit invoice', 'E', 'Editing invoice #4821.'], ['copy', 'Duplicate', 'D', 'Copied as invoice #4822.'], ['down', 'Download PDF', 'P', 'invoice-4821.pdf is ready.'], ['send', 'Send reminder', 'R', 'Reminder sent to Amina by SMS.']];
const menuItems = (sub = false, icons = true) => ITEMS.map(([i, n, k, m]) => (sub && i === 'send' ? `<button class="l-item" type="button" role="menuitem" aria-haspopup="menu" aria-expanded="false" data-sub>${icons ? I[i] : ''}${n}<span class="sc">${I.chev}</span></button>` : `<button class="l-item" type="button" role="menuitem" data-msg="${m}">${icons ? I[i] : ''}${n}<span class="sc">${k}</span></button>`)).join('') + `<div class="l-sep" role="separator"></div><button class="l-item del" type="button" role="menuitem" data-msg="Invoice #4821 deleted. Undo is in the toast part.">${icons ? I.del : ''}Delete invoice</button>`;
const rowHtml = (menu, extra = '') => `<div class="m06"><div class="m06-row"><div><b>Invoice #4821</b><span class="l-muted">Amina Otieno · KES 4,200</span></div><button class="l-ib m06-tr" type="button" aria-label="Actions for invoice 4821" aria-haspopup="menu" data-tr>${I.dots}</button>${menu}</div><p class="l-muted m06-msg" data-out aria-live="polite"></p>${extra}</div>`;
const dropdown = {
  id: 'dropdown', n: '06', name: 'Dropdown menu', h: 330,
  claim: 'A menu should grow <em>out of the button</em> you pressed.',
  lead: 'One invoice row with an actions button. Open the menu with a click or with Enter, move with the arrows, and pick an action.',
  ref: { ids: 'c09', text: 'A profile pill that opens up: the button grows into actions, then a card.' },
  noteHint: 'A\'s density, D\'s grow', moreHint: 'right-click menus',
  css: `.m06 { width: min(100%, 340px); align-self: start; text-align: left; }
.m06-row { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 12px 12px 16px; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-sm); }
.m06-row b { display: block; font-size: 14.5px; }
.m06-row .l-muted { font-size: 13px; }
.m06-tr { box-shadow: none; border-color: transparent; background: transparent; }
.m06-tr[aria-expanded="true"] { background: rgb(var(--ink-rgb) / .07); }
.m06-menu { position: absolute; right: 8px; top: calc(100% - 4px); width: 220px; z-index: 6; transform-origin: top right; }
.m06 .del, .m06 .del svg { color: var(--accent-text); }
.m06-msg { margin: 10px 4px 0; min-height: 1.4em; }`,
  js: `window.TLmenu = function (box, o) {
  o = o || {}; var tr = $('[data-tr]', box), menu = $('[data-menu]', box), msg = $('[data-out]', box);
  var p = pop(tr, menu, { arrowOpen: true, onOpen: o.onOpen, onClose: o.onClose, focus: function () { return $('.l-item', menu); } });
  var n = nav(menu, '.l-item:not(.m06-sub .l-item)', { focus: true, loop: true, hl: $('[data-hl]', menu) });
  $$('[data-msg]', menu).forEach(function (it) { if (it.closest('.m06-sub')) return; it.addEventListener('click', function () { msg.textContent = it.getAttribute('data-msg'); p.set(false); }); });
  return { pop: p, nav: n, menu: menu };
};`,
  opts: [
    {
      k: 'A', name: 'A small fade from the corner', line: 'The Radix menu: it fades and grows a little from the button\'s corner in 0.15 s. Letters on the right are shortcuts.',
      from: [sh('dropdown-menu'), radix('dropdown-menu')], tryit: 'Press the ⋯ button, then type D.',
      needs: 'Plain CSS and script.', keys: 'Enter or Down opens. Arrows loop, a letter jumps, Escape closes and returns focus.', off: 'The menu shows at once.', law: 'Fitts: Delete sits apart, below a line.',
      tags: ['motion:still', 'speed:quick', 'density:compact', 'open:trigger', 'new:familiar'],
      html: rowHtml(`<div class="l-panel l-pop m06-menu" role="menu" aria-label="Invoice actions" data-menu>${menuItems()}</div>`),
      js: `TLmenu(box);`,
    },
    {
      k: 'B', name: 'A springy pop with a gliding row', line: 'From beUI\'s context menu: it pops from the corner with a spring, and one soft highlight glides under the row you point at.',
      from: [be('context-menu'), ez('origin-dropdown')], tryit: 'Open it and run the pointer up and down the rows.',
      needs: 'CSS springs.', keys: 'Same as A.', off: 'No pop, the highlight jumps.', law: 'Jakob: same keys as A.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'open:trigger', 'new:twist'],
      html: rowHtml(`<div class="l-panel l-pop m06-menu" role="menu" aria-label="Invoice actions" data-menu><span class="l-hl" data-hl aria-hidden="true"></span>${menuItems()}</div>`),
      css: `#t06B .m06-menu { --from: scale(.6); --in: var(--sp-bouncy-d); --ease: var(--sp-bouncy); }
#t06B .l-item[data-on], #t06B .l-item:hover { background: none; }`,
      js: `TLmenu(box);`,
    },
    {
      k: 'C', name: 'A side menu for the reminder', line: 'Grows from the corner, the highlight glides, and "Send reminder" opens a second menu to the side with SMS, email or WhatsApp.',
      from: [ez('branching-submenu'), ez('origin-dropdown'), radix('dropdown-menu')], tryit: 'Open it, go to Send reminder, press the right arrow.',
      needs: 'CSS and script.', keys: 'Right opens the side menu, Left goes back, Escape closes both.', off: 'Both menus show at once.', law: 'Hick: the three ways to remind hide one level down.',
      tags: ['motion:some', 'speed:quick', 'density:compact', 'open:trigger', 'look:ember'], h: 360,
      html: rowHtml(`<div class="l-panel l-pop m06-menu" role="menu" aria-label="Invoice actions" data-menu><span class="l-hl" data-hl aria-hidden="true"></span>${menuItems(true)}<div class="l-panel l-pop m06-sub" role="menu" aria-label="Send reminder by" data-submenu><button class="l-item" type="button" role="menuitem" data-msg="Reminder sent to Amina by SMS.">SMS</button><button class="l-item" type="button" role="menuitem" data-msg="Reminder sent to amina@example.com.">Email</button><button class="l-item" type="button" role="menuitem" data-msg="Reminder sent on WhatsApp.">WhatsApp</button></div></div>`),
      css: `#t06C .m06-menu { right: auto; left: 40px; width: 190px; transform-origin: top left; --from: scale(.94); }
#t06C .l-item[data-on], #t06C .l-item:hover { background: none; }
#t06C .m06-sub { position: absolute; left: calc(100% - 6px); top: 100px; width: 140px; transform-origin: top left; --from: translateX(-6px) scale(.97); }
#t06C .m06-sub .l-item:hover, #t06C .m06-sub .l-item:focus { background: rgb(var(--ink-rgb) / .06); }`,
      js: `var m = TLmenu(box, { onClose: function () { sp.set(false, false); } }), sub = $('[data-submenu]', box), sb = $('[data-sub]', box), msg = $('[data-out]', box);
var sp = pop(null, sub, { focus: function () { return $('.l-item', sub); }, keep: sb });
sb.addEventListener('click', function (e) { e.stopPropagation(); sp.set(!sp.isOpen()); sb.setAttribute('aria-expanded', String(sp.isOpen())); });
sb.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); sp.set(true); sb.setAttribute('aria-expanded', 'true'); } });
sub.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft' || e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); sp.set(false); sb.setAttribute('aria-expanded', 'false'); sb.focus(); } });
nav(sub, '.l-item', { focus: true, loop: true });
sub.addEventListener('keydown', function (e) { e.stopPropagation(); });
$$('.l-item', sub).forEach(function (it) { it.addEventListener('click', function () { msg.textContent = it.getAttribute('data-msg'); sp.set(false); m.pop.set(false); }); });`,
    },
    {
      k: 'D', name: 'The button grows into the menu', line: 'Your c09, pushed: the ⋯ button\'s own background stretches out into the menu, so the menu is the button, opened up.',
      from: [house('c09'), be('popover-morph'), skill('animate')], tryit: 'Open and close it slowly, watching the corner.',
      needs: 'CSS and script.', keys: 'Same as A.', off: 'The menu appears at full size.', law: 'Fitts: it opens exactly where your hand is.',
      tags: ['motion:some', 'speed:mid', 'open:inplace', 'new:twist', 'look:ember'],
      html: rowHtml(`<div class="m06d" role="menu" aria-label="Invoice actions" data-menu><span class="bg" aria-hidden="true"></span><div class="c">${menuItems()}</div></div>`),
      css: `#t06D .m06d { position: absolute; right: 12px; top: 14px; width: 220px; z-index: 6; visibility: hidden; pointer-events: none; transition: visibility 0s linear .3s; }
#t06D .m06d.is-open { visibility: visible; pointer-events: auto; transition: none; }
#t06D .m06d .bg { position: absolute; inset: 0; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-lg); transform-origin: top right; transform: scale(.164, .16); opacity: 0; transition: transform .26s var(--ease-out), opacity .08s linear .2s; }
#t06D .m06d.is-open .bg { transform: none; opacity: 1; transition: transform .38s var(--ease-out), opacity 0s; }
#t06D .m06d .c { position: relative; padding: 40px 5px 5px; opacity: 0; transition: opacity .1s; }
#t06D .m06d.is-open .c { opacity: 1; transition: opacity .2s .12s; }
#t06D .m06-tr { position: relative; z-index: 7; }`,
      js: `TLmenu(box);`,
    },
    {
      k: 'E', name: 'A dark, tight menu in mono', line: 'Steps outside ember: an ink-dark menu with light mono letters, tight rows and square corners, like a code editor.',
      from: [['Code editor menus', null]], tryit: 'Open it with Enter and move with the arrows.',
      needs: 'Plain CSS.', keys: 'Same as A.', off: 'Same; it appears at once anyway.', law: 'Fitts bends: 28 px rows are tight for touch (44 px on phones).',
      tags: ['motion:still', 'speed:quick', 'density:compact', 'new:novel', 'look:off'],
      html: rowHtml(`<div class="m06-menu m06e l-pop" role="menu" aria-label="Invoice actions" data-menu>${menuItems(false, false)}</div>`),
      css: `#t06E .m06e { background: var(--ink); color: var(--paper); border-radius: 3px; padding: 4px; box-shadow: var(--shadow-lg); --from: none; transition-duration: 0s; }
#t06E .m06e.is-open { transition-duration: 0s; }
#t06E .l-item { min-height: 28px; border-radius: 2px; font-family: var(--font-mono); font-size: 12.5px; color: var(--paper); }
#t06E .l-item .sc { color: rgb(var(--ink-rgb) / .1); color: var(--dim); }
#t06E .l-item[data-on], #t06E .l-item:hover { background: var(--accent); color: var(--on-accent); }
#t06E .del { color: var(--paper); }
#t06E .l-sep { background: rgb(255 255 255 / .15); }
html[data-theme="dark"] #t06E .l-sep { background: rgb(0 0 0 / .2); }`,
      js: `TLmenu(box);`,
    },
    {
      k: 'F', name: 'Actions bloom around the button', line: 'From beUI\'s bloom menu: the five actions fan out in an arc around the button, each a round icon with its name.',
      from: [be('bloom-menu')], tryit: 'Open it, then use the arrow keys to go round.',
      needs: 'CSS and script.', keys: 'Arrows go round, Enter picks, Escape closes.', off: 'The icons appear in place.', law: 'Hick holds (five choices), Fitts bends (small round targets).',
      tags: ['motion:springy', 'speed:mid', 'open:trigger', 'new:novel', 'look:ember'], h: 300,
      html: `<div class="m06f"><button class="l-ib m06f-tr" type="button" aria-label="Actions for invoice 4821" aria-haspopup="menu" data-tr>${I.dots}</button><div class="m06f-ring" role="menu" aria-label="Invoice actions" data-menu>${[...ITEMS.map(([i, n, , m]) => [i, n, m]), ['del', 'Delete', 'Invoice #4821 deleted.']].map(([i, n, m], j) => `<button class="l-item b" type="button" role="menuitem" data-msg="${m}" style="--a:${-170 + j * 40}deg;--j:${j}">${I[i]}<span class="nm">${n}</span></button>`).join('')}</div><p class="l-muted m06-msg" data-out aria-live="polite">Invoice #4821 · Amina Otieno</p></div>`,
      css: `#t06F .m06f { position: relative; width: 300px; height: 230px; display: grid; place-items: end center; text-align: center; }
#t06F .m06f-tr { position: absolute; left: 50%; top: 140px; margin-left: -22px; width: 44px; height: 44px; border-radius: 50%; z-index: 2; }
#t06F .m06f-ring { position: absolute; left: 50%; top: 162px; width: 0; height: 0; }
#t06F .b { position: absolute; left: -22px; top: -22px; width: 44px; height: 44px; min-height: 44px; padding: 0; justify-content: center; border-radius: 50%; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-sm); opacity: 0; visibility: hidden; transform: rotate(var(--a)) translateX(0) rotate(calc(var(--a) * -1)) scale(.6); transition: transform .2s var(--ease-out), opacity .15s, visibility 0s linear .2s; }
#t06F .is-open .b { opacity: 1; visibility: visible; transform: rotate(var(--a)) translateX(92px) rotate(calc(var(--a) * -1)); transition: transform var(--sp-bouncy-d) var(--sp-bouncy) calc(var(--j) * 30ms), opacity .2s calc(var(--j) * 30ms), visibility 0s; }
#t06F .b svg { color: var(--ink); width: 17px; height: 17px; }
#t06F .b:nth-child(5) svg { color: var(--accent-text); }
#t06F .b .nm { position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 3px; font-size: 11px; white-space: nowrap; color: var(--ink-soft); }
#t06F .b[data-on] { background: var(--paper-raised); border-color: var(--accent); }
#t06F .m06-msg { position: absolute; bottom: 0; left: 0; right: 0; }`,
      js: `var tr = $('[data-tr]', box), ring = $('[data-menu]', box), msg = $('.m06-msg', box), wrap = $('.m06f', box);
var p = pop(tr, ring, { focus: function () { return $('.b', ring); }, onOpen: function () { wrap.classList.add('is-open'); }, onClose: function () { wrap.classList.remove('is-open'); } });
var n = nav(ring, '.b', { focus: true, loop: true });
ring.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); var i = n.index(); n.mark(i + (e.key === 'ArrowRight' ? 1 : -1)); } });
$$('.b', ring).forEach(function (b) { b.addEventListener('click', function () { msg.textContent = b.getAttribute('data-msg'); p.set(false); }); });`,
    },
  ],
};

/* ---------------- 07 Tooltip ---------------- */
const TIPS = [['ref', 'Refresh', 'R'], ['exp', 'Export CSV', 'E'], ['share', 'Share report', 'S'], ['filt', 'Filter', 'F']];
const tipHtml = (id, cls = '') => `<div class="t07 ${cls}"><div class="t07-bar" role="toolbar" aria-label="Sales report">${TIPS.map(([i, n, k]) => `<button class="l-ib" type="button" aria-label="${n}" aria-describedby="${id}-tip" data-k="${k}">${I[i]}</button>`).join('')}<div class="t07-tip" role="tooltip" id="${id}-tip" data-tip><span class="tx" data-tx></span><span class="ar" aria-hidden="true"></span></div></div><p class="l-muted t07-cap">Sales this week: KES 182,400</p></div>`;
const tooltip = {
  id: 'tooltip', n: '07', name: 'Tooltip', h: 200,
  claim: 'A tooltip should come <em>quickly, and only when asked</em>.',
  lead: 'A toolbar of four icon buttons. Point at one and wait, then slide along to the next. Tab to them as well.',
  ref: null,
  noteHint: 'C\'s speed with A\'s arrow', moreHint: 'tooltips with a short help text',
  css: `.t07 { text-align: center; }
.t07-bar { position: relative; display: inline-flex; gap: 8px; padding: 6px; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-sm); }
.t07-bar .l-ib { box-shadow: none; border-color: transparent; background: transparent; }
.t07-bar .l-ib:hover { background: rgb(var(--ink-rgb) / .06); }
.t07-tip { position: absolute; left: 0; bottom: calc(100% + 8px); z-index: 6; pointer-events: none; white-space: nowrap; font-size: 12.5px; line-height: 1; padding: 7px 9px; border-radius: 7px; background: var(--ink); color: var(--paper); opacity: 0; visibility: hidden; }
.t07-tip .ar { position: absolute; left: 50%; top: 100%; margin-left: -5px; border: 5px solid transparent; border-top-color: var(--ink); display: none; }
.t07-tip .k { margin-left: 8px; font-family: var(--font-mono); font-size: 10.5px; padding: 1px 4px; border-radius: 3px; background: rgb(255 255 255 / .16); }
html[data-theme="dark"] .t07-tip .k { background: rgb(0 0 0 / .14); }
.t07-tip.is-on { opacity: 1; visibility: visible; }
.t07-cap { margin: 14px 0 0; }`,
  js: `/* One tooltip per toolbar. delay: wait before the first one; skip: how long it stays warm after you leave. */
window.TLtip = function (box, o) {
  var bar = $('.t07-bar', box), tip = $('[data-tip]', box), tx = $('[data-tx]', box), t = null, warmUntil = 0, cur = null;
  function place(b) { var x = b.offsetLeft + b.offsetWidth / 2; if (o.glide && cur && tip.classList.contains('is-on')) { tip.style.setProperty('--x', x + 'px'); } else { tip.style.setProperty('--x', x + 'px'); } }
  function show(b, now) { clearTimeout(t); var go = function () { tx.innerHTML = b.getAttribute('aria-label') + (o.kbd ? '<span class="k">' + b.getAttribute('data-k') + '</span>' : ''); var was = tip.classList.contains('is-on'); place(b); if (o.onShow) o.onShow(tip, b, was); tip.classList.add('is-on'); cur = b; };
    if (now || performance.now() < warmUntil || tip.classList.contains('is-on')) go(); else t = setTimeout(go, o.delay); }
  function hide() { clearTimeout(t); if (tip.classList.contains('is-on')) warmUntil = performance.now() + o.skip; tip.classList.remove('is-on'); cur = null; }
  $$('.l-ib', bar).forEach(function (b) { b.addEventListener('pointerenter', function () { show(b); }); b.addEventListener('pointerleave', hide); b.addEventListener('focus', function () { show(b, true); }); b.addEventListener('blur', hide); b.addEventListener('click', hide); b.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); }); });
};`,
  opts: [
    {
      k: 'A', name: 'Waits, then fades, with an arrow', line: 'The Radix tooltip: waits 0.7 s the first time, then shows at once while you move along. A small fade and grow, with an arrow.',
      from: [sh('tooltip'), radix('tooltip')], tryit: 'Point at Refresh and wait. Then slide to Share.',
      needs: 'CSS and script.', keys: 'Shows at once on focus. Escape hides it.', off: 'Shows without the fade.', law: 'Jakob: the delay most apps use.',
      tags: ['motion:still', 'speed:slow', 'feedback:quiet', 'new:familiar', 'look:ember'],
      html: tipHtml('t07A'),
      css: `#t07A .t07-tip { transform: translateX(calc(var(--x) - 50%)) scale(.96); transform-origin: bottom center; transition: opacity .12s, transform .12s var(--ease-out), visibility 0s linear .12s; }
#t07A .t07-tip.is-on { transform: translateX(calc(var(--x) - 50%)); transition: opacity .15s, transform .15s var(--ease-out), visibility 0s; }
#t07A .ar { display: block; }`,
      js: `TLtip(box, { delay: 700, skip: 300 });`,
    },
    {
      k: 'B', name: 'Drops in from where it points', line: 'easyui\'s directional tooltip: it starts a little above and springs down onto the button, as if it came from its side.',
      from: [ez('directional-tooltip')], tryit: 'Point at each button in turn.',
      needs: 'CSS springs.', keys: 'Same as A.', off: 'Shows in place.', law: 'Jakob: a common spot, a new move.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: tipHtml('t07B'),
      css: `#t07B .t07-tip { transform: translate(calc(var(--x) - 50%), -8px); transition: opacity .12s, transform .12s, visibility 0s linear .12s; }
#t07B .t07-tip.is-on { transform: translate(calc(var(--x) - 50%), 0); transition: opacity .16s, transform var(--sp-bouncy-d) var(--sp-bouncy), visibility 0s; }
#t07B .ar { display: block; }`,
      js: `TLtip(box, { delay: 300, skip: 400 });`,
    },
    {
      k: 'C', name: 'Fast, with the shortcut key', line: 'beUI\'s timing: only 0.12 s before the first one, no arrow, and the keyboard shortcut sits inside the tooltip.',
      from: [be('tooltip'), sh('kbd', 'shadcn/ui kbd')], tryit: 'Run the pointer across all four quickly.',
      needs: 'CSS and script.', keys: 'Same as A.', off: 'Shows without the fade.', law: 'Hick: the shortcut teaches a faster way.',
      tags: ['motion:some', 'speed:quick', 'feedback:clear', 'density:compact', 'look:ember'],
      html: tipHtml('t07C'),
      css: `#t07C .t07-tip { transform: translateX(calc(var(--x) - 50%)) translateY(3px) scale(.97); transition: opacity .1s, transform .1s, visibility 0s linear .1s; }
#t07C .t07-tip.is-on { transform: translateX(calc(var(--x) - 50%)); transition: opacity .14s, transform .18s var(--ease-out), visibility 0s; }`,
      js: `TLtip(box, { delay: 120, skip: 300, kbd: true });`,
    },
    {
      k: 'D', name: 'One tooltip that slides between buttons', line: 'A second mix: once one tooltip is showing, moving along the bar slides the same tooltip to the next button, and its words swap.',
      from: [be('tooltip', 'beUI tooltip (warm group)'), skill('animate')], tryit: 'Point at Refresh, wait, then slide right slowly.',
      needs: 'CSS and script.', keys: 'Tab along the bar and it follows.', off: 'It jumps between buttons.', law: 'Proximity: it never leaves the bar, so your eye never jumps.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'new:novel', 'look:ember'],
      html: tipHtml('t07D'),
      css: `#t07D .t07-tip { transform: translateX(calc(var(--x) - 50%)) translateY(3px); transition: opacity .12s, transform .12s, visibility 0s linear .12s; }
#t07D .t07-tip.is-on { transform: translateX(calc(var(--x) - 50%)); transition: opacity .15s, transform .32s var(--ease-out), visibility 0s; }
#t07D .t07-tip.no-slide { transition: opacity .15s, visibility 0s; }
#t07D .ar { display: block; }`,
      js: `TLtip(box, { delay: 400, skip: 500, glide: true, onShow: function (tip, b, was) { if (!was) { tip.classList.add('no-slide'); void tip.offsetWidth; requestAnimationFrame(function () { tip.classList.remove('no-slide'); }); } } });`,
    },
    {
      k: 'E', name: 'An instant label below', line: 'Steps outside ember: no wait and no fade. A square ink block with an upper-case mono label shows right under the button.',
      from: [['Old desktop software', null]], tryit: 'Point at each button.',
      needs: 'Plain CSS.', keys: 'Same as A.', off: 'Same; it never moved.', law: 'Fitts bends: below the button it can hide what is under your pointer.',
      tags: ['motion:still', 'speed:quick', 'feedback:loud', 'new:novel', 'look:off'],
      html: tipHtml('t07E'),
      css: `#t07E .t07-tip { bottom: auto; top: calc(100% + 4px); border-radius: 0; font-family: var(--font-mono); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; transform: translateX(calc(var(--x) - 50%)); }`,
      js: `TLtip(box, { delay: 0, skip: 0 });`,
    },
  ],
};

/* ---------------- 08 Popover ---------------- */
const card = (more = '') => `<div class="p08-c"><div class="p08-top"><span class="l-av">AO</span><div><b>Amina Otieno</b><span class="l-muted">Customer since March 2023</span></div></div><dl class="p08-st"><div><dt>Orders</dt><dd class="l-num">48</dd></div><div><dt>Spent</dt><dd class="l-num">92,300</dd></div><div><dt>Last</dt><dd>2 days ago</dd></div></dl>${more}</div>`;
const acts = `<div class="p08-a"><button class="l-btn sm pri" type="button" data-act="Message sent to Amina.">Message</button><button class="l-btn sm" type="button" data-act="Opening Amina's 48 orders.">View orders</button></div>`;
const sentence = (id, panel, cls = '') => `<div class="p08 ${cls}"><div class="p08-s">Last order from <span class="p08-w"><button class="p08-tr" type="button" aria-haspopup="dialog" aria-controls="${id}-pv" data-tr>Amina Otieno</button>${panel}</span> came in at 2:14 pm.</div><p class="l-muted p08-msg" data-msg aria-live="polite"></p></div>`;
const popover = {
  id: 'popover', n: '08', name: 'Popover', h: 300,
  claim: 'A popover is a <em>small window you can close</em> with one key.',
  lead: 'A customer\'s name in a sentence. Open each popover by clicking or pointing at the name, then close it with Escape or a click outside.',
  ref: { ids: 'c25', text: 'Point at a name to peek: a card that lifts out of the underlined words.' },
  noteHint: 'D\'s peek, but it should open on click', moreHint: 'popovers with a small form inside',
  css: `.p08 { width: 100%; text-align: center; }
.p08-s { margin: 0; font-size: 15px; color: var(--ink-soft); }
.p08-w { position: relative; display: inline-block; }
.p08-tr { color: var(--ink); font-weight: 600; text-decoration: underline; text-decoration-color: var(--accent); text-underline-offset: 3px; text-decoration-thickness: 1.5px; }
.p08-pv { position: absolute; left: 50%; top: calc(100% + 8px); margin-left: -135px; width: 270px; z-index: 6; text-align: left; transform-origin: top center; }
.p08-c { padding: 12px; }
.p08-top { display: flex; gap: 10px; align-items: center; }
.p08-top b { display: block; font-size: 14.5px; color: var(--ink); }
.p08-top .l-muted { font-size: 12.5px; }
.p08-st { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin: 12px 0 0; padding-top: 10px; border-top: 1px solid var(--line); }
.p08-st dt { font-family: var(--font-mono); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.p08-st dd { margin: 0; font-size: 15px; color: var(--ink); }
.p08-a { display: flex; gap: 8px; padding: 0 12px 12px; }
.p08-msg { margin: 0; min-height: 1.4em; position: absolute; left: 0; right: 0; bottom: 14px; }`,
  js: `window.TLpv = function (box, o) { o = o || {}; var tr = $('[data-tr]', box), pv = $('[data-pv]', box), msg = $('[data-msg]', box);
  var p = pop(o.click === false ? null : tr, pv, Object.assign({ focus: '.l-btn' }, o));
  $$('[data-act]', pv).forEach(function (b) { b.addEventListener('click', function () { msg.textContent = b.getAttribute('data-act'); p.set(false); }); });
  return { pop: p, tr: tr, pv: pv };
};
/* hover intent: open after a short wait, stay while the pointer is on the name or the card */
window.TLhover = function (api, wait, onPeek) { var t = null; function enter() { clearTimeout(t); t = setTimeout(function () { if (!api.pop.isOpen()) { onPeek && onPeek(true); api.pop.set(true); } }, wait); } function leave() { clearTimeout(t); t = setTimeout(function () { if (api.pv.dataset.pinned) return; api.pop.set(false, false); }, 180); }
  [api.tr, api.pv].forEach(function (el) { el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') enter(); }); el.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') leave(); }); }); };`,
  opts: [
    {
      k: 'A', name: 'Click to open, a small fade', line: 'The Radix popover: click the name, the card fades and grows a little below it, and focus moves inside.',
      from: [sh('popover'), radix('popover')], tryit: 'Click the name, press Tab, then Escape.',
      needs: 'CSS and script.', keys: 'Enter opens, focus goes in, Escape closes and returns focus.', off: 'Shows at once.', law: 'Jakob: works like every popover.',
      tags: ['motion:still', 'speed:quick', 'open:trigger', 'new:familiar', 'look:ember'], top: true,
      html: sentence('t08A', `<div class="l-panel l-pop p08-pv" id="t08A-pv" role="dialog" aria-label="Amina Otieno" data-pv>${card()}${acts}</div>`),
      css: `#t08A .p08-pv { --from: translateY(-4px) scale(.96); }`,
      js: `TLpv(box);`,
    },
    {
      k: 'B', name: 'It blooms from the name', line: 'beUI\'s morph popover: the card grows from the point where the name is, with a soft spring.',
      from: [be('popover-morph'), be('popover')], tryit: 'Open and close it a few times.',
      needs: 'CSS springs.', keys: 'Same as A.', off: 'Shows at once.', law: 'Jakob: same keys as A.',
      tags: ['motion:springy', 'speed:mid', 'open:trigger', 'new:twist', 'look:ember'], top: true,
      html: sentence('t08B', `<div class="l-panel l-pop p08-pv" id="t08B-pv" role="dialog" aria-label="Amina Otieno" data-pv>${card()}${acts}</div>`),
      css: `#t08B .p08-pv { --from: scale(.4); --in: var(--sp-bouncy-d); --ease: var(--sp-bouncy); transform-origin: 50% -8px; }`,
      js: `TLpv(box);`,
    },
    {
      k: 'C', name: 'Peek on point, pin on click', line: 'Rest the pointer on the name and a lifted card peeks out with an arrow. Click to pin it open and use its buttons.',
      from: [ez('peek-card'), radix('hover-card'), sh('hover-card', 'shadcn/ui hover-card')], tryit: 'Point and wait. Then click the name to pin it.',
      needs: 'CSS and script.', keys: 'Focus or Enter opens and pins. Escape closes.', off: 'Shows at once.', law: 'Fitts: the card waits a moment, so you can reach its buttons.',
      tags: ['motion:some', 'speed:mid', 'depth:lifted', 'open:trigger', 'look:ember'], top: true,
      html: sentence('t08C', `<div class="l-panel l-pop p08-pv" id="t08C-pv" role="dialog" aria-label="Amina Otieno" data-pv><span class="ar" aria-hidden="true"></span>${card()}${acts}<p class="pin l-muted">Click the name to pin</p></div>`),
      css: `#t08C .p08-pv { --from: translateY(6px); box-shadow: var(--shadow-lg), 0 2px 6px rgb(0 0 0 / .06); }
#t08C .ar { position: absolute; left: 50%; top: -6px; margin-left: -6px; width: 12px; height: 12px; background: var(--paper-raised); border-left: 1px solid var(--line); border-top: 1px solid var(--line); transform: rotate(45deg); }
#t08C .pin { margin: 0; padding: 0 12px 10px; font-size: 12px; }
#t08C [data-pinned] .pin { display: none; }`,
      js: `var a = TLpv(box, { click: false, onClose: function () { delete a.pv.dataset.pinned; } });
a.tr.addEventListener('click', function (e) { e.stopPropagation(); if (a.pv.dataset.pinned) { a.pop.set(false); return; } a.pv.dataset.pinned = '1'; a.pop.set(true); setTimeout(function () { $('.l-btn', a.pv).focus(); }, 20); });
TLhover(a, 300);`,
    },
    {
      k: 'D', name: 'A peek that leans, then opens up', line: 'Your c25 peek, pushed: the small card leans toward your pointer with a warm tint. Click and it grows into the full card with actions.',
      from: [house('c25'), ['patterns/depth.md', null]], tryit: 'Point at the name and move around on the card. Then click the name.',
      needs: 'CSS and script.', keys: 'Enter opens the full card at once.', off: 'No lean, no tint, no grow.', law: 'Fitts: the full card opens under the pointer.',
      tags: ['motion:some', 'speed:mid', 'depth:lifted', 'new:twist', 'look:ember'], top: true,
      html: sentence('t08D', `<div class="l-panel l-pop p08-pv" id="t08D-pv" role="dialog" aria-label="Amina Otieno" data-pv><span class="tint" aria-hidden="true"></span>${card('<div class="more"><p class="l-muted">Usually orders on Fridays. Pays by PocketPay.</p></div>')}<div class="more">${acts}</div></div>`),
      css: `#t08D .p08-pv { --from: translateY(6px) scale(.97); transform-style: preserve-3d; overflow: hidden; }
#t08D .p08-pv.is-open { transform: perspective(700px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); transition: opacity .2s, transform .45s var(--ease-out), visibility 0s; }
#t08D .tint { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgb(var(--accent-rgb) / .13), transparent 65%); opacity: 0; transition: opacity .3s; }
#t08D .p08-pv:hover .tint { opacity: 1; }
#t08D .more { display: grid; grid-template-rows: 0fr; opacity: 0; transition: opacity .2s; }
#t08D .more > * { overflow: hidden; min-height: 0; }
#t08D .more .l-muted { margin: 10px 0 0; font-size: 12.5px; }
#t08D [data-pinned] .more { grid-template-rows: 1fr; opacity: 1; transition: opacity .3s .1s; }`,
      js: `var a = TLpv(box, { click: false, onClose: function () { delete a.pv.dataset.pinned; a.pv.style.removeProperty('--rx'); a.pv.style.removeProperty('--ry'); } }), h0;
a.tr.addEventListener('click', function (e) { e.stopPropagation(); if (a.pv.dataset.pinned) { a.pop.set(false); return; } h0 = a.pv.offsetHeight; var was = a.pop.isOpen(); a.pv.dataset.pinned = '1'; a.pop.set(true); if (was && moving()) TLglide(a.pv, h0, 380); setTimeout(function () { $('.l-btn', a.pv).focus(); }, 20); });
TLhover(a, 250);
a.pv.addEventListener('pointermove', function (e) { if (!moving() || a.pv.dataset.pinned) return; var r = a.pv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; a.pv.style.setProperty('--ry', ((x - .5) * 8).toFixed(2) + 'deg'); a.pv.style.setProperty('--rx', ((.5 - y) * 8).toFixed(2) + 'deg'); a.pv.style.setProperty('--mx', (x * 100) + '%'); a.pv.style.setProperty('--my', (y * 100) + '%'); });
a.pv.addEventListener('pointerleave', function () { a.pv.style.setProperty('--rx', '0deg'); a.pv.style.setProperty('--ry', '0deg'); });`,
    },
    {
      k: 'E', name: 'A soft round bubble', line: 'Steps outside ember: a big round bubble with a large face, centred text and soft grey, like a phone contact card.',
      from: [['iOS contact cards', null]], tryit: 'Click the name.',
      needs: 'CSS and script.', keys: 'Same as A.', off: 'Shows at once.', law: 'Fitts: big round buttons, easy on a phone.',
      tags: ['motion:some', 'density:roomy', 'depth:some', 'new:novel', 'look:off'], top: true,
      html: sentence('t08E', `<div class="l-pop p08-pv p08e" id="t08E-pv" role="dialog" aria-label="Amina Otieno" data-pv><span class="big" aria-hidden="true">AO</span><b>Amina Otieno</b><span class="l-muted">48 orders · KES 92,300</span><div class="p08e-a"><button class="l-btn sm" type="button" data-act="Message sent to Amina.">Message</button><button class="l-btn sm" type="button" data-act="Opening Amina's 48 orders.">Orders</button></div></div>`),
      css: `#t08E .p08e { display: grid; justify-items: center; gap: 4px; padding: 18px; border-radius: 26px; background: var(--paper-sunk); box-shadow: var(--shadow-lg); font-family: var(--font-grot); text-align: center; --from: translateY(8px) scale(.95); --in: .35s; }
#t08E .big { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; font-size: 20px; font-weight: 600; background: var(--paper-raised); color: var(--ink); }
#t08E .p08e b { color: var(--ink); font-size: 16px; }
#t08E .p08e-a { display: flex; gap: 8px; margin-top: 8px; }
#t08E .p08e-a .l-btn { border-radius: 999px; box-shadow: none; border-color: transparent; background: var(--paper-raised); }`,
      js: `TLpv(box);`,
    },
  ],
};

export default [tabs, dropdown, tooltip, popover];
