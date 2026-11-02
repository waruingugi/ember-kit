// Batch 4: accordion, command menu, date picker, empty and loading states.
import { sh, be, ez, radix, house, skill, orbs } from './src-links.mjs';

const CH = '<svg class="chv" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const PM = '<span class="pm" aria-hidden="true"><i></i><i></i></span>';

/* ---------------- 13 Accordion ---------------- */
const FAQ = [
  ['When do you deliver?', 'Every day from 8 am to 8 pm in Nairobi. Towns on the coast and in the Rift Valley get deliveries on Tuesday and Friday.'],
  ['How do I pay?', 'PocketPay, card or cash on delivery. PocketPay payments show up at once.'],
  ['Can I return an item?', 'Yes, within 7 days if it is not opened. We pick it up for free.'],
  ['Do you sell wholesale?', 'Yes. Orders over KES 20,000 get 8% off, and you choose the delivery slot.'],
];
const accHtml = (id, icon = CH, num = false, extra = '') => `<div class="a13">${extra}${FAQ.map(([q, a], i) => `<div class="a13-it" data-it><h4 class="a13-h"><button class="a13-b" type="button" id="${id}-b${i}" aria-expanded="false" aria-controls="${id}-r${i}">${num ? `<span class="nn">0${i + 1}</span>` : ''}<span class="q">${q}</span>${icon}</button></h4><div class="a13-r" id="${id}-r${i}" hidden><div class="a13-in">${a}</div></div></div>`).join('')}</div>`;
const accordion = {
  id: 'accordion', n: '13', name: 'Accordion', h: 380,
  claim: 'Opening an answer should <em>never make the page jump</em>.',
  lead: 'Four shop questions. Open one, then another. Some open one at a time, some let you open many.',
  ref: { ids: 'n18', text: 'Shop answers that open without a jump, with a switch for one at a time.' },
  noteHint: 'C\'s plus sign with A\'s speed', moreHint: 'accordions inside a settings page',
  css: `.a13 { width: min(100%, 380px); align-self: start; text-align: left; }
.a13-it { border-bottom: 1px solid var(--line); }
.a13-h { margin: 0; font: inherit; }
.a13-b { width: 100%; display: flex; align-items: center; gap: 10px; min-height: 48px; padding: 0 4px; font-size: 15px; font-weight: 500; color: var(--ink); text-align: left; }
.a13-b .q { flex: 1; }
.a13-b .chv { width: 16px; height: 16px; color: var(--muted); transition: transform .25s var(--ease-out); }
.a13-b[aria-expanded="true"] .chv { transform: rotate(180deg); }
.a13-r { overflow: hidden; }
.a13-in { padding: 0 4px 14px; font-size: 14px; color: var(--ink-soft); }`,
  js: `/* Height glides open and closed; padding sits inside .a13-in so nothing snaps. */
window.TLacc = function (box, o) {
  o = o || {}; var bs = $$('.a13-b', box);
  function ease() { return o.spring && lvl() === 'lively' ? getComputedStyle(root).getPropertyValue('--sp-bouncy').trim() || 'cubic-bezier(.22,1,.36,1)' : 'cubic-bezier(.22,1,.36,1)'; }
  function dur() { return o.spring && lvl() === 'lively' ? parseFloat(getComputedStyle(root).getPropertyValue('--sp-bouncy-d')) * 1000 || 450 : (o.ms || 300); }
  function set(b, open) { var r = $('#' + b.getAttribute('aria-controls')), was = b.getAttribute('aria-expanded') === 'true'; if (was === open) return; b.setAttribute('aria-expanded', String(open)); var it = b.closest('[data-it]'); it.classList.toggle('is-open', open);
    if (r._a) r._a.cancel();
    if (!moving()) { r.hidden = !open; return; }
    if (open) { r.hidden = false; var h = r.scrollHeight; r._a = r.animate([{ height: '0px' }, { height: h + 'px' }], { duration: dur(), easing: ease() }); if (o.inner) $('.a13-in', r).animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: dur() * .9, easing: 'cubic-bezier(.22,1,.36,1)' }); }
    else { var h0 = r.offsetHeight; r._a = r.animate([{ height: h0 + 'px' }, { height: '0px' }], { duration: Math.min(260, dur() * .7), easing: 'cubic-bezier(.22,1,.36,1)' }); r._a.onfinish = function () { if (b.getAttribute('aria-expanded') === 'false') r.hidden = true; }; }
    if (o.onToggle) o.onToggle(it, open); }
  bs.forEach(function (b, i) { b.addEventListener('click', function () { var open = b.getAttribute('aria-expanded') !== 'true'; if (open && (o.single === true || (typeof o.single === 'function' && o.single()))) bs.forEach(function (x) { if (x !== b) set(x, false); }); set(b, open); });
    b.addEventListener('keydown', function (e) { var j = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? bs.length - 1 : null; if (j === null) return; e.preventDefault(); bs[(j + bs.length) % bs.length].focus(); }); });
  set(bs[0], true);
};`,
  opts: [
    {
      k: 'A', name: 'A turning arrow and a short glide', line: 'The Radix accordion: the arrow turns, the answer glides open in 0.3 s, and you can open as many as you like.',
      from: [sh('accordion'), radix('accordion')], tryit: 'Open all four.',
      needs: 'CSS and the Web Animations API.', keys: 'Enter or Space opens. Up and Down move between questions.', off: 'Answers open at once.', law: 'Jakob: the usual FAQ.',
      tags: ['motion:some', 'speed:quick', 'density:mid', 'new:familiar', 'look:ember'],
      html: accHtml('t13A'), js: `TLacc(box);`,
    },
    {
      k: 'B', name: 'One at a time, with a spring', line: 'beUI\'s bouncy accordion: only one answer is open. Opening a new one closes the last, and the new one springs open.',
      from: [be('bouncy-accordion'), ez('smooth-accordion')], tryit: 'Open the second question, then the third.',
      needs: 'CSS springs and the Web Animations API.', keys: 'Same as A.', off: 'Answers swap at once.', law: 'Hick: only one answer on screen.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'new:twist', 'look:ember'],
      html: accHtml('t13B'), css: `#t13B .a13-b .chv { transition: transform var(--sp-bouncy-d) var(--sp-bouncy); }`, js: `TLacc(box, { single: true, spring: true });`,
    },
    {
      k: 'C', name: 'A plus that turns to a minus, words that rise', line: 'easyui\'s unfold accordion: the plus folds into a minus, and the answer rises into place as the space opens.',
      from: [ez('unfold-accordion'), skill('animate')], tryit: 'Open and close a question slowly.',
      needs: 'CSS and the Web Animations API.', keys: 'Same as A.', off: 'Answers open at once.', law: 'Jakob: plus means "more" almost everywhere.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: accHtml('t13C', PM),
      css: `#t13C .pm { position: relative; width: 14px; height: 14px; flex: 0 0 14px; }
#t13C .pm i { position: absolute; left: 0; top: 6px; width: 14px; height: 2px; border-radius: 2px; background: var(--ink-soft); transition: transform .3s var(--ease-out); }
#t13C .pm i + i { transform: rotate(90deg); }
#t13C [aria-expanded="true"] .pm i + i { transform: rotate(180deg) scaleX(0); }
#t13C [aria-expanded="true"] .pm i:first-child { transform: rotate(180deg); }`,
      js: `TLacc(box, { inner: true, ms: 380 });`,
    },
    {
      k: 'D', name: 'The open one lifts into a card', line: 'Your n18, pushed: the open answer rises into a raised card while the others stay flat lines. "One at a time" is a switch.',
      from: [house('n18'), ['patterns/depth.md', null]], tryit: 'Open one, then turn on "One at a time" and open another.',
      needs: 'CSS and the Web Animations API.', keys: 'Same as A. The switch uses Space.', off: 'No lift; answers open at once.', law: 'Proximity: the question and answer become one card.',
      tags: ['motion:some', 'speed:mid', 'depth:lifted', 'new:twist', 'look:ember'], h: 420,
      html: accHtml('t13D', CH, false, '<div class="tg-row a13d-sw"><span class="tg-l" id="t13D-one">One at a time</span><button class="sw" type="button" role="switch" aria-checked="false" aria-labelledby="t13D-one" data-one><span class="th"></span></button></div>'),
      css: `#t13D .a13d-sw { margin-bottom: 8px; }
#t13D .a13-it { position: relative; border-bottom: 0; border-radius: 12px; margin: 2px 0; transition: transform .45s var(--ease-out); }
#t13D .a13-it::before { content: ""; position: absolute; inset: 0; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-lg); opacity: 0; transition: opacity .35s var(--ease-out); z-index: -1; }
#t13D .a13-it { isolation: isolate; }
#t13D .a13-it.is-open { transform: translateY(-2px); }
#t13D .a13-it.is-open::before { opacity: 1; }
#t13D .a13-b, #t13D .a13-in { padding-left: 12px; padding-right: 12px; }
#t13D .a13-it:not(.is-open) + .a13-it:not(.is-open) .a13-b { box-shadow: 0 -1px 0 var(--line); }`,
      js: `var one = $('[data-one]', box); TLtoggles(box); TLacc(box, { single: function () { return one.getAttribute('aria-checked') === 'true'; } });`,
    },
    {
      k: 'E', name: 'Numbered serif questions with a big plus', line: 'Steps outside ember: questions in large serif type with numbers, a thin rule between, and a big plain plus sign.',
      from: [['Printed FAQ pages', null]], tryit: 'Open two questions.',
      needs: 'CSS and the Web Animations API.', keys: 'Same as A.', off: 'Answers open at once.', law: 'Fitts: the whole wide row is the target.',
      tags: ['motion:some', 'density:roomy', 'depth:flat', 'new:novel', 'look:off'], h: 440,
      html: accHtml('t13E', '<span class="bp" aria-hidden="true">+</span>', true),
      css: `#t13E .a13-it { border-bottom: 1px solid var(--ink); }
#t13E .a13-b { min-height: 58px; font-family: var(--font-display); font-size: 19px; font-weight: 400; align-items: baseline; padding-top: 14px; }
#t13E .nn { font-family: var(--font-mono); font-size: 10.5px; color: var(--muted); width: 22px; }
#t13E .bp { font-family: var(--font-display); font-size: 26px; line-height: 1; font-weight: 300; transition: transform .3s var(--ease-out); }
#t13E [aria-expanded="true"] .bp { transform: rotate(45deg); }
#t13E .a13-in { font-family: var(--font-display); font-size: 15px; padding-left: 32px; }`,
      js: `TLacc(box);`,
    },
  ],
};

/* ---------------- 14 Command menu ---------------- */
const CMDS = [
  ['Create', 'New invoice', 'N', 'Starts a blank invoice for a customer.'],
  ['Create', 'Add customer', 'C', 'Adds a name and phone number to your customers.'],
  ['Go to', 'Orders', 'G O', 'Opens today\'s orders, newest first.'],
  ['Go to', 'Payouts', 'G P', 'Shows money paid to your PocketPay till.'],
  ['Go to', 'Shop settings', 'G S', 'Opens hours, address and team.'],
  ['Do', 'Export orders as CSV', 'E', 'Downloads this month\'s orders as a spreadsheet file.'],
  ['Do', 'Print today\'s report', 'P', 'Sends today\'s sales summary to the printer.'],
  ['Do', 'Invite teammate', 'I', 'Sends an invite by SMS and email.'],
];
const cmdPanel = (id, cls = '', extra = '') => `<div class="c14 ${cls}" role="dialog" aria-modal="true" aria-label="Command menu" data-dlg><div class="c14-q"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.4"/><path d="m10.5 10.5 3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg><input data-q role="combobox" aria-expanded="true" aria-controls="${id}-lb" aria-autocomplete="list" autocomplete="off" placeholder="Type a command or search…" aria-label="Command"></div><div class="c14-body"><div class="c14-sc" id="${id}-lb" role="listbox" aria-label="Commands" data-list></div>${extra}</div><div class="c14-ft"><span><kbd class="l-kbd">↑</kbd><kbd class="l-kbd">↓</kbd> move</span><span><kbd class="l-kbd">Enter</kbd> run</span><span><kbd class="l-kbd">Esc</kbd> close</span></div></div>`;
const cmdHtml = (id, cls = '', extra = '') => `<div class="c14-page"><button class="l-btn" type="button" data-tr aria-haspopup="dialog"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.4"/><path d="m10.5 10.5 3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>Search actions<kbd class="l-kbd">/</kbd></button><p class="l-muted c14-msg" data-msg aria-live="polite">Or focus this card and press /</p></div><div class="l-scrim" data-scrim></div>${cmdPanel(id, cls, extra)}`;
const command = {
  id: 'command', n: '14', name: 'Command menu', h: 400,
  claim: 'Every action should be <em>a few letters away</em>.',
  lead: 'Eight shop actions in one search. Open it, type "inv", move with the arrows and press Enter.',
  ref: { ids: 'n12', text: 'Every action, one search away: Ctrl or Cmd + K, a few letters, the arrows, Enter.' },
  noteHint: 'D\'s preview but A\'s size', moreHint: 'command menus with recent items',
  css: `.c14-page { display: grid; justify-items: center; gap: 10px; text-align: center; }
.c14-page .l-btn svg { width: 15px; height: 15px; }
.c14-msg { margin: 0; min-height: 1.4em; }
.c14 { position: absolute; left: 50%; top: 18px; width: min(380px, calc(100% - 24px)); margin-left: max(-190px, calc(-50% + 12px)); z-index: 6; border-radius: 14px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-lg); overflow: hidden; text-align: left; visibility: hidden; opacity: 0; transform: scale(.98); transition: opacity .12s, transform .12s, visibility 0s linear .12s; }
.c14.is-open { visibility: visible; opacity: 1; transform: none; transition: opacity .15s, transform .15s var(--ease-out), visibility 0s; }
.c14-q { display: flex; align-items: center; gap: 8px; padding: 0 14px; border-bottom: 1px solid var(--line); }
.c14-q svg { width: 16px; height: 16px; color: var(--muted); flex: 0 0 16px; }
.c14-q input { flex: 1; height: 46px; border: 0; background: transparent; font: inherit; font-size: 15px; color: var(--ink); outline: 0; }
.c14-sc { position: relative; max-height: 236px; overflow-y: auto; padding: 5px; overscroll-behavior: contain; }
.c14 .l-item .sc { letter-spacing: .04em; }
.c14 mark { background: none; color: var(--accent-text); font-weight: 600; }
.c14-none { padding: 18px 12px; margin: 0; }
.c14-ft { display: flex; gap: 14px; padding: 8px 12px; border-top: 1px solid var(--line); font-size: 11.5px; color: var(--muted); }
.c14-ft kbd { margin-right: 2px; }`,
  js: `window.CMDS = ${JSON.stringify(CMDS)};
/* letters in order, gaps allowed: "nvc" finds "New invoice" */
window.TLfuzzy = function (q, s) { q = q.toLowerCase(); var t = s.toLowerCase(), i = 0, hit = []; if (!q) return []; for (var j = 0; j < t.length && i < q.length; j++) if (t[j] === q[i]) { hit.push(j); i++; } return i === q.length ? hit : null; };
window.TLcmd = function (box, o) {
  o = o || {}; var tr = $('[data-tr]', box), dlg = $('[data-dlg]', box), sc = $('[data-scrim]', box), inp = $('[data-q]', box), list = $('[data-list]', box), msg = $('[data-msg]', box), id = box.id;
  var groups = []; CMDS.forEach(function (c) { if (groups.indexOf(c[0]) < 0) groups.push(c[0]); });
  list.innerHTML = (o.hl ? '<span class="l-hl" data-hl aria-hidden="true"></span>' : '') + groups.map(function (g, gi) { return '<div role="group" aria-labelledby="' + id + '-g' + gi + '" data-g><div class="l-head" id="' + id + '-g' + gi + '">' + g + '</div>' + CMDS.map(function (c, i) { return c[0] !== g ? '' : '<div class="l-item" role="option" id="' + id + '-c' + i + '" data-i="' + i + '"><span class="nm">' + c[1] + '</span><span class="sc">' + c[2] + '</span></div>'; }).join('') + '</div>'; }).join('') + '<p class="l-muted c14-none" data-none hidden>No action matches. Try "pay".</p>';
  var p = pop(tr, dlg, { scrim: sc, trap: true, focus: '[data-q]', onOpen: function () { inp.value = ''; filter(); if (o.onOpen) o.onOpen(); }, onClose: o.onClose });
  var n = nav(dlg, '.l-item', { keys: inp, hl: $('[data-hl]', list), scroller: list, pick: run, onMark: function (el) { if (el) inp.setAttribute('aria-activedescendant', el.id); if (o.onMark) o.onMark(el); } });
  function filter() { var q = inp.value.trim(), any = 0; $$('.l-item', list).forEach(function (it) { var c = CMDS[+it.dataset.i], h = TLfuzzy(q, c[1]); it.hidden = !!q && !h; if (!it.hidden) any++; $('.nm', it).innerHTML = h && h.length ? c[1].split('').map(function (ch, k) { return h.indexOf(k) >= 0 ? '<mark>' + ch + '</mark>' : ch; }).join('') : c[1]; });
    $$('[data-g]', list).forEach(function (g) { g.hidden = !$$('.l-item', g).some(function (x) { return !x.hidden; }); }); $('[data-none]', list).hidden = !!any; list.scrollTop = 0; n.mark(0); }
  function run(it) { var c = CMDS[+it.dataset.i]; p.set(false); msg.textContent = 'Ran "' + c[1] + '". ' + c[3]; }
  $$('.l-item', list).forEach(function (it) { it.addEventListener('click', function () { run(it); }); });
  inp.addEventListener('input', filter);
  box.addEventListener('keydown', function (e) { if (e.key === '/' && !p.isOpen() && !(e.target.closest && e.target.closest('input, textarea'))) { e.preventDefault(); p.set(true); } });
  return { pop: p };
};`,
  opts: [
    {
      k: 'A', name: 'A plain search box with groups', line: 'Like cmdk, the shadcn command menu: a box in the middle, actions in groups, the row you are on is shaded, shortcuts on the right.',
      from: [sh('command'), ['cmdk', 'https://cmdk.paco.me/']], tryit: 'Open it, type "pay", press Enter.',
      needs: 'CSS and script.', keys: 'Type to filter, arrows move, Enter runs, Escape closes. Focus stays inside.', off: 'Shows at once.', law: 'Hick: eight actions, but you only read the ones you search for.',
      tags: ['motion:still', 'speed:quick', 'density:compact', 'open:centre', 'new:familiar'],
      html: cmdHtml('t14A'), js: `TLcmd(box);`,
    },
    {
      k: 'B', name: 'A springy box and a gliding highlight', line: 'beUI\'s command palette: the box springs in from 0.96, and the highlight glides from row to row on a spring.',
      from: [be('command-palette'), ez('spotlight-search')], tryit: 'Open it and hold the down arrow.',
      needs: 'CSS springs.', keys: 'Same as A.', off: 'No spring, the highlight jumps.', law: 'Jakob: same keys as A.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'open:centre', 'new:twist'],
      html: cmdHtml('t14B'),
      css: `#t14B .c14 { transform: scale(.96); }
#t14B .c14.is-open { transition: opacity .15s, transform var(--sp-bouncy-d) var(--sp-bouncy), visibility 0s; }
#t14B .l-hl { transition: transform var(--sp-snappy-d) var(--sp-snappy), opacity .15s; }
#t14B .l-item[data-on], #t14B .l-item:hover { background: none; }`,
      js: `TLcmd(box, { hl: true });`,
    },
    {
      k: 'C', name: 'The button stretches into the search', line: 'beUI\'s morphing search: the search button itself grows into the full menu, from where it sits, instead of a box popping up in the middle.',
      from: [be('morphing-search'), ez('expandable-search'), skill('animate')], tryit: 'Click the search button and watch it grow.',
      needs: 'CSS and script.', keys: 'Same as A.', off: 'Shows at once.', law: 'Fitts: the menu starts where your pointer already is.',
      tags: ['motion:some', 'speed:mid', 'open:trigger', 'new:twist', 'look:ember'],
      html: cmdHtml('t14C'),
      css: `#t14C .c14 { top: calc(50% - 40px); transform-origin: 50% 0; transform: scale(.42, .14); transition: opacity .1s linear .12s, transform .24s var(--ease-out), visibility 0s linear .26s; }
#t14C .c14.is-open { top: 18px; transform: none; transition: opacity .08s, transform .4s var(--ease-out), top .4s var(--ease-out), visibility 0s; }
#t14C .c14 > * { opacity: 0; transition: opacity .1s; }
#t14C .c14.is-open > * { opacity: 1; transition: opacity .2s .14s; }`,
      js: `TLcmd(box);`,
    },
    {
      k: 'D', name: 'A list with a preview beside it', line: 'Your n12, pushed: the menu is wider, and the right side says what the action on your row will do before you press Enter.',
      from: [house('n12'), ['Raycast', 'https://www.raycast.com/']], tryit: 'Move down the list and read the right side.',
      needs: 'CSS and script.', keys: 'Same as A.', off: 'The preview swaps at once.', law: 'Hick: you can check before you act.',
      tags: ['motion:some', 'density:mid', 'feedback:clear', 'new:twist', 'look:ember'], wide: true,
      html: cmdHtml('t14D', 'c14d', '<div class="pv" data-pv aria-live="polite"><p class="mono-label" data-pk></p><h4 data-pt></h4><p data-pd></p><p class="l-muted" data-ps></p></div>'),
      css: `#t14D .c14d { width: min(600px, calc(100% - 24px)); margin-left: max(-300px, calc(-50% + 12px)); }
#t14D .c14-body { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
#t14D .pv { padding: 16px; border-left: 1px solid var(--line); background: var(--paper); }
#t14D .pv h4 { margin: 4px 0 6px; font-size: 17px; }
#t14D .pv p { margin: 0 0 8px; font-size: 13.5px; color: var(--ink-soft); }
#t14D .pv.swap > * { animation: l-fadeup .25s var(--ease-out); }
@media (max-width: 560px) { #t14D .c14-body { grid-template-columns: 1fr; } #t14D .pv { display: none; } }`,
      js: `var pv = $('[data-pv]', box); TLcmd(box, { onMark: function (el) { if (!el) return; var c = CMDS[+el.dataset.i]; $('[data-pk]', pv).textContent = c[0]; $('[data-pt]', pv).textContent = c[1]; $('[data-pd]', pv).textContent = c[3]; $('[data-ps]', pv).textContent = 'Shortcut: ' + c[2]; pv.classList.remove('swap'); void pv.offsetWidth; pv.classList.add('swap'); } });`,
    },
    {
      k: 'E', name: 'A dark terminal prompt', line: 'Steps outside ember: an ink-black box with mono letters and a ">" prompt. Results read like lines in a terminal.',
      from: [['Terminal prompts and Vim', null]], tryit: 'Open it and type "exp".',
      needs: 'CSS and script.', keys: 'Same as A.', off: 'Same; it appears at once.', law: 'Jakob bends: only people who use terminals feel at home.',
      tags: ['motion:still', 'speed:quick', 'density:compact', 'new:novel', 'look:off'],
      html: cmdHtml('t14E', 'c14e'),
      css: `#t14E .c14e { --tx: #dfe5ea; --tm: #79848d; --hi: #ff8d5e; --ln: rgb(255 255 255 / .1); --ln2: rgb(255 255 255 / .2); --on: rgb(255 106 43 / .18); background: var(--plate); color: var(--tx); border-color: transparent; border-radius: 4px; font-family: var(--font-mono); transform: none; transition: visibility 0s; }
#t14E .c14e.is-open { transition: none; }
#t14E .c14-q { border-color: var(--ln); }
#t14E .c14-q svg { display: none; }
#t14E .c14-q::before { content: ">"; color: var(--accent); font-weight: 600; }
#t14E .c14-q input { color: var(--tx); font-family: var(--font-mono); font-size: 13.5px; }
#t14E .c14-q input::placeholder { color: var(--tm); }
#t14E .l-item { color: var(--tx); font-size: 12.5px; min-height: 28px; border-radius: 2px; }
#t14E .l-item .sc { color: var(--tm); }
#t14E .l-item[data-on], #t14E .l-item:hover { background: var(--on); }
#t14E .l-item[data-on]::before { content: "›"; color: var(--accent); margin-right: -4px; }
#t14E .l-head { color: var(--tm); }
#t14E mark { color: var(--hi); }
#t14E .c14-ft { border-color: var(--ln); color: var(--tm); }
#t14E .l-kbd { background: transparent; border-color: var(--ln2); color: var(--tm); }
#t14E .c14-none { color: var(--tm); }`,
      js: `TLcmd(box);`,
    },
  ],
};

/* ---------------- 15 Date picker ---------------- */
const calShell = '<div class="cal" data-cal></div>';
const datepick = {
  id: 'dates', n: '15', name: 'Date picker', h: 400,
  claim: 'A date picker should show <em>what the dates mean</em>, not only the numbers.',
  lead: 'Today is Sunday 1 November 2026. Pick a delivery day, or a range of market days. Arrow keys move between days, Page Up and Page Down change month.',
  ref: { ids: 'n01', text: 'Pick your nights and see the price as you go; booked nights are crossed out.' },
  noteHint: 'B\'s gliding pill inside A\'s pop-up', moreHint: 'date pickers with a time',
  css: `.cal { width: 266px; user-select: none; -webkit-user-select: none; text-align: center; }
.cal-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.cal-hd b { font-size: 14.5px; font-weight: 600; }
.cal-hd .l-ib { width: 32px; height: 32px; box-shadow: none; }
.cal-vp { position: relative; overflow: hidden; }
.cal-g { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; position: relative; }
.cal-dn { font-size: 11px; color: var(--muted); height: 26px; display: grid; place-items: center; }
.cal-d { position: relative; z-index: 1; height: 34px; border-radius: 8px; font-size: 13.5px; font-variant-numeric: tabular-nums; color: var(--ink); transition: background-color .12s, color .12s; }
.cal-d:hover:not(:disabled) { background: rgb(var(--ink-rgb) / .07); }
.cal-d:disabled { color: var(--dim); cursor: default; }
.cal-d.is-booked { text-decoration: line-through; }
.cal-d.is-today { box-shadow: inset 0 0 0 1px var(--line-hi); }
.cal-d.is-sel, .cal-d.is-a, .cal-d.is-b { background: var(--accent); color: var(--on-accent); font-weight: 600; }
.cal-d.in-r, .cal-d.in-p { background: rgb(var(--accent-rgb) / .12); border-radius: 0; }
.cal-x { width: 100%; }
.cal-out { margin: 10px 0 0; font-size: 13px; color: var(--ink-soft); min-height: 1.4em; text-align: center; }`,
  js: `/* One month grid. Weeks start Monday. o.range picks a start and an end. */
window.TLcal = function (host, o) {
  o = o || {}; var today = new Date(2026, 10, 1), view = new Date(2026, 10, 1), sel = null, a = null, b = null, foc = new Date(2026, 10, 2), M = ['January','February','March','April','May','June','July','August','September','October','November','December'], W = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  function key(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function same(x, y) { return x && y && key(x) === key(y); }
  function off(d) { return d < today || (o.booked && o.booked(d)); }
  function wd(d) { return (d.getDay() + 6) % 7; }
  function render(dir, keepFocus) {
    var y = view.getFullYear(), m = view.getMonth(), first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate(), h = '';
    for (var i = 0; i < wd(first); i++) h += '<span></span>';
    for (var d = 1; d <= days; d++) { var dt = new Date(y, m, d), c = 'cal-d'; if (same(dt, today)) c += ' is-today'; if (o.booked && o.booked(dt)) c += ' is-booked';
      if (!o.range && same(dt, sel)) c += ' is-sel'; if (o.range) { if (same(dt, a)) c += ' is-a'; if (same(dt, b)) c += ' is-b'; if (a && b && dt > a && dt < b) c += ' in-r'; }
      h += '<button type="button" class="' + c + '" data-d="' + d + '"' + (off(dt) ? ' disabled' : '') + ' tabindex="' + (same(dt, foc) ? 0 : -1) + '" aria-label="' + W[wd(dt)] + ' ' + d + ' ' + M[m] + (o.price && !off(dt) ? ', KES ' + o.price(dt) : '') + (o.booked && o.booked(dt) ? ', booked' : '') + '" aria-pressed="' + !!(same(dt, sel) || same(dt, a) || same(dt, b)) + '">' + d + (o.price && !off(dt) ? '<small aria-hidden="true">' + o.price(dt) + '</small>' : '') + '</button>'; }
    host.innerHTML = '<div class="cal-hd"><button class="l-ib" type="button" aria-label="Previous month" data-pv><svg viewBox="0 0 16 16" fill="none"><path d="m10 4-4 4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button><b aria-live="polite">' + M[m] + ' ' + y + '</b><button class="l-ib" type="button" aria-label="Next month" data-nx><svg viewBox="0 0 16 16" fill="none"><path d="m6 4 4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button></div><div class="cal-g cal-dns" aria-hidden="true">' + ['Mo','Tu','We','Th','Fr','Sa','Su'].map(function (x) { return '<span class="cal-dn">' + x + '</span>'; }).join('') + '</div><div class="cal-vp"><div class="cal-g" role="group" aria-label="' + M[m] + ' ' + y + '" data-g>' + (o.pill ? '<span class="pill" aria-hidden="true"></span>' : '') + h + '</div></div>';
    $('[data-pv]', host).disabled = y === 2026 && m === 10;
    $('[data-pv]', host).addEventListener('click', function () { move(-1); }); $('[data-nx]', host).addEventListener('click', function () { move(1); });
    var g = $('[data-g]', host);
    $$('.cal-d', g).forEach(function (bt) { bt.addEventListener('click', function () { pick(new Date(y, m, +bt.dataset.d)); }); bt.addEventListener('pointerenter', function () { if (o.range && a && !b) preview(new Date(y, m, +bt.dataset.d)); }); });
    g.addEventListener('pointerleave', function () { if (o.range) preview(null); });
    g.addEventListener('keydown', kd);
    if (dir && o.slide && moving()) o.slide(g, dir);
    if (keepFocus) { var f = $('.cal-d[tabindex="0"]', g); if (f) f.focus(); }
    if (o.after) o.after(host, g);
  }
  function move(dir, keep) { view = new Date(view.getFullYear(), view.getMonth() + dir, 1); if (view < new Date(2026, 10, 1)) view = new Date(2026, 10, 1); if (foc.getMonth() !== view.getMonth()) foc = new Date(view.getFullYear(), view.getMonth(), view.getMonth() === 10 ? 2 : 1); render(dir, keep); }
  function preview(d) { $$('.cal-d', host).forEach(function (bt) { var dt = new Date(view.getFullYear(), view.getMonth(), +bt.dataset.d); bt.classList.toggle('in-p', !!(d && a && dt > a && dt <= d && !blocked(a, d))); }); if (o.onPreview) o.onPreview(a, d && d > a && !blocked(a, d) ? d : null); }
  function blocked(x, y) { if (!o.booked) return false; for (var d = new Date(x); d <= y; d.setDate(d.getDate() + 1)) if (o.booked(d)) return true; return false; }
  function pick(d) { foc = d; if (!o.range) sel = d; else if (!a || b || d <= a || blocked(a, d)) { a = d; b = null; } else b = d; render(0, true); if (o.onChange) o.onChange({ sel: sel, a: a, b: b }); }
  function kd(e) { var k = e.key, d = new Date(foc), s = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[k];
    if (s) d.setDate(d.getDate() + s); else if (k === 'Home') d.setDate(d.getDate() - wd(d)); else if (k === 'End') d.setDate(d.getDate() + 6 - wd(d)); else if (k === 'PageUp' || k === 'PageDown') { e.preventDefault(); move(k === 'PageUp' ? -1 : 1, true); return; } else return;
    e.preventDefault(); if (d < today) return; foc = d; if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) { var dir = d > view ? 1 : -1; view = new Date(d.getFullYear(), d.getMonth(), 1); render(dir, true); } else { $$('.cal-d', host).forEach(function (bt) { bt.tabIndex = +bt.dataset.d === d.getDate() ? 0 : -1; }); $('.cal-d[tabindex="0"]', host).focus(); if (o.range && a && !b) preview(d); } }
  render();
  return { set: function (x, y) { a = x; b = y; foc = x; view = new Date(x.getFullYear(), x.getMonth(), 1); render(); if (o.onChange) o.onChange({ a: a, b: b }); }, fmt: function (d) { return W[wd(d)] + ' ' + d.getDate() + ' ' + M[d.getMonth()]; }, short: function (d) { return d.getDate() + ' ' + M[d.getMonth()].slice(0, 3); } };
};
window.TLslide = function (g, dir) { g.animate([{ opacity: 0, transform: 'translateX(' + (dir * 28) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' }); };`,
  opts: [
    {
      k: 'A', name: 'A button that opens a calendar', line: 'The shadcn date picker: a button with the date, a calendar pops under it, today has a ring, the picked day is orange.',
      from: [sh('date-picker'), sh('calendar', 'shadcn/ui calendar'), ['React DayPicker', 'https://daypicker.dev/']], tryit: 'Open it, press Page Down, pick a day with the arrows and Enter.',
      needs: 'CSS and script.', keys: 'Arrows move a day or a week, Page Up and Down change month, Enter picks, Escape closes.', off: 'Shows at once.', law: 'Jakob: the calendar everyone knows.',
      tags: ['motion:still', 'speed:quick', 'open:trigger', 'new:familiar', 'look:ember'], top: true, h: 420,
      html: `<div class="d15a"><span class="l-lbl" id="t15A-l">Deliver on</span><button class="s03-tr" type="button" aria-haspopup="dialog" aria-labelledby="t15A-l t15A-v" data-tr><span id="t15A-v" class="ph" data-v>Pick a date</span><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2.5" y="3.5" width="11" height="10" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></button><div class="l-panel l-pop d15a-p" role="dialog" aria-label="Choose a delivery date" data-pop>${calShell}</div></div>`,
      css: `#t15A .d15a { position: relative; width: 266px; text-align: left; }
#t15A .s03-tr svg { transform: none !important; }
#t15A .d15a-p { position: absolute; left: 0; top: calc(100% + 6px); padding: 10px; z-index: 6; transform-origin: top left; }`,
      js: `var v = $('[data-v]', box), pp = $('[data-pop]', box), p = pop($('[data-tr]', box), pp, { focus: function () { return $('.cal-d[tabindex="0"]', pp); } });
var c = TLcal($('[data-cal]', box), { onChange: function (s) { v.textContent = c.fmt(s.sel); v.classList.remove('ph'); p.set(false); } });`,
    },
    {
      k: 'B', name: 'A pill that glides to the day, months that slide', line: 'easyui\'s calendar: the orange pill glides from the old day to the new one, and months slide in from the side you went.',
      from: [ez('calendar'), ez('date-picker')], tryit: 'Pick 5, then 26. Then go to next month.',
      needs: 'CSS springs and the Web Animations API.', keys: 'Same as A.', off: 'Pill and months jump.', law: 'Jakob: a normal month grid.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'], h: 400,
      html: `<div>${calShell}<p class="cal-out" data-out aria-live="polite">No day picked yet.</p></div>`,
      css: `#t15B .pill { position: absolute; left: 0; top: 0; z-index: 0; border-radius: 8px; background: var(--accent); opacity: 0; transition: transform var(--sp-snappy-d) var(--sp-snappy), opacity .2s; pointer-events: none; }
#t15B .cal-d.is-sel { background: transparent; }`,
      js: `var last = null, out = $('[data-out]', box);
var c = TLcal($('[data-cal]', box), { pill: true, slide: TLslide, onChange: function (s) { out.textContent = 'Delivery on ' + c.fmt(s.sel) + '.'; },
  after: function (host, g) { var pill = $('.pill', g), s = $('.is-sel', g); if (!s) { pill.style.opacity = 0; last = null; return; } pill.style.width = s.offsetWidth + 'px'; pill.style.height = s.offsetHeight + 'px';
    var to = 'translate(' + s.offsetLeft + 'px,' + s.offsetTop + 'px)'; if (last && moving()) { pill.style.transition = 'none'; pill.style.transform = last; void pill.offsetWidth; pill.style.transition = ''; } pill.style.transform = to; pill.style.opacity = 1; last = to; } });`,
    },
    {
      k: 'C', name: 'A range with a live band and quick picks', line: 'Pick a first and a last day: a soft band follows your pointer before you click. Quick picks on the left set common ranges in one press.',
      from: [be('date-range-picker'), ez('calendar'), sh('calendar', 'shadcn/ui calendar')], tryit: 'Press "Next 7 days". Then click 10 and point at 14.',
      needs: 'CSS and script.', keys: 'Same as A. Quick picks are buttons.', off: 'The band shows without moving.', law: 'Hick: three quick picks cover most needs.',
      tags: ['motion:some', 'speed:quick', 'density:compact', 'feedback:clear', 'look:ember'], wide: true, h: 380,
      html: `<div class="d15c"><div class="pre" role="group" aria-label="Quick picks"><button class="l-btn sm" type="button" data-pre="1,1">Tomorrow</button><button class="l-btn sm" type="button" data-pre="6,7">This weekend</button><button class="l-btn sm" type="button" data-pre="1,7">Next 7 days</button><button class="l-btn sm" type="button" data-pre="1,29">Rest of November</button></div>${calShell}<div class="d15c-sum"><p class="mono-label">Market days</p><p class="big" data-n>—</p><p class="l-muted" data-r>Pick a first day.</p></div></div>`,
      css: `#t15C .d15c { display: flex; gap: 22px; align-items: flex-start; flex-wrap: wrap; justify-content: center; text-align: left; }
#t15C .pre { display: grid; gap: 6px; }
#t15C .pre .l-btn { justify-content: flex-start; }
#t15C .d15c-sum { width: 150px; }
#t15C .d15c-sum p { margin: 0 0 4px; }
#t15C .big { font-family: var(--font-num); font-size: 44px; line-height: 1; color: var(--ink); }
#t15C .cal-d.in-p { transition: background-color .1s; }`,
      js: `var n = $('[data-n]', box), r = $('[data-r]', box), c;
function show(a, b) { if (!a) { n.textContent = '—'; r.textContent = 'Pick a first day.'; return; } if (!b) { n.textContent = '1'; r.textContent = 'From ' + c.short(a) + '. Now pick the last day.'; return; } var d = Math.round((b - a) / 864e5) + 1; n.textContent = d; r.textContent = c.short(a) + ' to ' + c.short(b); }
c = TLcal($('[data-cal]', box), { range: true, onChange: function (s) { show(s.a, s.b); }, onPreview: function (a, d) { if (d) show(a, d); } });
$$('[data-pre]', box).forEach(function (bt) { bt.addEventListener('click', function () { var p = bt.dataset.pre.split(','); c.set(new Date(2026, 10, 1 + +p[0]), new Date(2026, 10, 1 + +p[1])); }); });`,
    },
    {
      k: 'D', name: 'Prices on the days, a total as you point', line: 'Your n01, pushed for a market stall: each day shows its price, booked days are crossed out, and the total counts up as you point at a last day.',
      from: [house('n01'), ['Airbnb date picker', null]], tryit: 'Click 9, then point at 13 and at 16 (booked days block the way).',
      needs: 'CSS and script.', keys: 'Same as A. Prices are read out with each day.', off: 'The total changes without counting.', law: 'Fitts and Hick: price and choice in one place, no second screen.',
      tags: ['motion:some', 'speed:mid', 'feedback:loud', 'density:compact', 'look:ember'], wide: true, h: 470,
      html: `<div class="d15d">${calShell}<div class="tot"><p class="mono-label">Stall at Gikomba market</p><p class="big"><span class="cur">KES</span> <span data-t>0</span></p><p class="l-muted" data-r>KES 500 a day, KES 800 on Saturday and Sunday.</p><button class="l-btn pri" type="button" data-book disabled>Book the stall</button><p class="l-muted" data-ok aria-live="polite"></p></div></div>`,
      css: `#t15D .d15d { display: flex; gap: 26px; align-items: flex-start; flex-wrap: wrap; justify-content: center; text-align: left; }
#t15D .cal { width: 300px; }
#t15D .cal-d { height: 42px; display: grid; place-items: center; align-content: center; gap: 0; line-height: 1.1; }
#t15D .cal-d small { display: block; font-size: 9.5px; color: var(--muted); font-weight: 400; }
#t15D .cal-d.is-a small, #t15D .cal-d.is-b small { color: inherit; opacity: .85; }
#t15D .cal-d.is-booked small { display: none; }
#t15D .tot { width: 220px; }
#t15D .tot p { margin: 0 0 6px; }
#t15D .big { font-family: var(--font-num); font-size: 46px; line-height: 1; color: var(--ink); font-variant-numeric: tabular-nums; }
#t15D .cur { font-size: 20px; color: var(--muted); }
#t15D [data-book] { margin-top: 8px; }`,
      js: `function price(d) { var w = d.getDay(); return w === 0 || w === 6 ? 800 : 500; }
var BK = { '2026-11-14': 1, '2026-11-15': 1, '2026-11-24': 1, '2026-12-5': 1 };
function booked(d) { return !!BK[d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()]; }
var t = $('[data-t]', box), r = $('[data-r]', box), bk = $('[data-book]', box), ok = $('[data-ok]', box), shown = 0, anim = null, c, range = null;
function count(to) { cancelAnimationFrame(anim); if (!moving()) { shown = to; t.textContent = TLmoney(to); return; } var from = shown, t0 = performance.now(); (function step(now) { var k = Math.min(1, (now - t0) / 380); shown = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); t.textContent = TLmoney(shown); if (k < 1) anim = requestAnimationFrame(step); })(t0); }
function sum(a, b) { var s = 0; for (var d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) s += price(d); return s; }
function show(a, b, fixed) { if (!a) { count(0); return; } var e = b || a, n = Math.round((e - a) / 864e5) + 1; count(sum(a, e)); r.textContent = n + (n > 1 ? ' days, ' : ' day, ') + c.short(a) + (b ? ' to ' + c.short(b) : '') + (fixed || b ? '' : '. Point at a last day.'); }
c = TLcal($('[data-cal]', box), { range: true, booked: booked, price: price, slide: TLslide, onChange: function (s) { range = s.b ? s : null; bk.disabled = !s.b; ok.textContent = ''; show(s.a, s.b, true); }, onPreview: function (a, d) { if (!range) show(a, d); } });
bk.addEventListener('click', function () { ok.innerHTML = TICK + ' Booked. Pay by PocketPay to hold it.'; bk.disabled = true; });`,
    },
    {
      k: 'E', name: 'A square grid in mono', line: 'Steps outside ember: hard square cells with lines between them, mono numbers, and the picked day filled with ink, like a wall planner.',
      from: [['Paper wall planners', null]], tryit: 'Pick a day with the keyboard.',
      needs: 'CSS and script.', keys: 'Same as A.', off: 'Same.', law: 'Fitts: cells are bigger and touch each other, so no near misses.',
      tags: ['motion:still', 'speed:quick', 'density:compact', 'new:novel', 'look:off'], h: 400,
      html: `<div>${calShell}<p class="cal-out d15e-out" data-out aria-live="polite">NO DAY PICKED</p></div>`,
      css: `#t15E .cal { font-family: var(--font-mono); }
#t15E .cal-hd b { font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .08em; font-size: 12px; }
#t15E .cal-hd .l-ib { border-radius: 0; border-color: var(--ink); }
#t15E [data-g] { gap: 0; border-top: 1.5px solid var(--ink); border-left: 1.5px solid var(--ink); }
#t15E [data-g] > * { border-right: 1.5px solid var(--ink); border-bottom: 1.5px solid var(--ink); }
#t15E .cal-d { border-radius: 0; height: 36px; font-size: 12.5px; }
#t15E .cal-d.is-sel { background: var(--ink); color: var(--paper); }
#t15E .cal-d.is-today { box-shadow: inset 0 0 0 3px var(--accent); }
#t15E .cal-dn { font-size: 10px; text-transform: uppercase; }
#t15E .d15e-out { font-family: var(--font-mono); font-size: 11.5px; letter-spacing: .06em; }`,
      js: `var out = $('[data-out]', box); var c = TLcal($('[data-cal]', box), { onChange: function (s) { out.textContent = ('DELIVERY: ' + c.fmt(s.sel)).toUpperCase(); } });`,
    },
  ],
};

/* ---------------- 16 Empty and loading states ---------------- */
const ORDERS = [['AO', 'Amina Otieno', 'Sukuma, unga, oil', '760'], ['BK', 'Brian Kiprop', 'Rice 10 kg, sugar', '2,350'], ['WM', 'Wanjiru Mwangi', 'Bread, milk', '180'], ['OO', 'Otieno Ouma', 'Soap, flour, eggs', '640']];
const rowsHtml = ORDERS.map(([i, n, w, k]) => `<div class="e16-r"><span class="l-av">${i}</span><div><b>${n}</b><span class="l-muted">${w}</span></div><span class="l-num">KES ${k}</span></div>`).join('');
const loadHtml = (id, extra = '') => `<div class="e16"><div class="e16-hd"><b>Recent orders</b><div class="e16-btns"><button class="l-btn sm" type="button" data-reload>Reload</button><button class="l-btn sm ghost" type="button" data-empty>Show empty</button></div></div><div class="e16-body" data-body aria-live="polite" aria-busy="false"></div>${extra}</div>`;
const loading = {
  id: 'loading', n: '16', name: 'Empty and loading states', h: 380,
  claim: 'Waiting should look like <em>the page that is coming</em>.',
  lead: 'A list of recent orders. Press Reload to watch it load for two seconds. Press "Show empty" to see what a new shop sees.',
  ref: { ids: 'n23', text: 'Grey shapes hold the place of the news, then the stories fade in one by one.' },
  noteHint: 'D\'s shapes with C\'s words', moreHint: 'error states that say what to do',
  css: `.e16 { width: min(100%, 360px); align-self: start; text-align: left; position: relative; padding: 14px; border-radius: 14px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-sm); }
.e16-hd { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px; }
.e16-hd b { font-size: 15px; }
.e16-btns { display: flex; gap: 4px; }
.e16-body { min-height: 236px; }
.e16-r { display: flex; align-items: center; gap: 10px; height: 56px; border-top: 1px solid var(--line); }
.e16-r:first-child { border-top: 0; }
.e16-r > div { flex: 1; min-width: 0; }
.e16-r b { display: block; font-size: 14px; font-weight: 600; }
.e16-r .l-muted { font-size: 12.5px; }
.e16-r .l-num { font-size: 15px; }
.e16-empty { display: grid; justify-items: center; text-align: center; gap: 6px; padding: 26px 10px; }
.e16-empty svg { width: 46px; height: 46px; color: var(--dim); }
.e16-empty b { font-size: 15px; }
.e16-empty p { margin: 0 0 8px; font-size: 13.5px; color: var(--muted); max-width: 30ch; }`,
  js: `window.TLorders = ${JSON.stringify(rowsHtml)};
window.TLemptyHtml = function (title, line, art) { return '<div class="e16-empty">' + (art || '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="9" y="12" width="30" height="26" rx="4" stroke="currentColor" stroke-width="1.6"/><path d="M9 20h30M17 12V8M31 12V8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>') + '<b>' + title + '</b><p>' + line + '</p><button class="l-btn sm pri" type="button" data-new>Create an order</button></div>'; };
/* states: loading for 2 s, then loaded; or empty. o.loading / o.loaded / o.empty fill the body. */
window.TLload = function (box, o) {
  var body = $('[data-body]', box), t = null;
  function loaded() { body.setAttribute('aria-busy', 'false'); body.innerHTML = TLorders; if (o.loaded) o.loaded(body); }
  function load() { clearTimeout(t); body.setAttribute('aria-busy', 'true'); o.loading(body); t = setTimeout(loaded, o.ms || 2000); }
  function empty() { clearTimeout(t); body.setAttribute('aria-busy', 'false'); body.innerHTML = o.empty ? o.empty() : TLemptyHtml('No orders yet', 'When a customer pays, their order shows up here.'); var n = $('[data-new]', body); if (n) n.addEventListener('click', load); if (o.onEmpty) o.onEmpty(body); }
  $('[data-reload]', box).addEventListener('click', load); $('[data-empty]', box).addEventListener('click', empty);
  loaded(); return { load: load };
};`,
  opts: [
    {
      k: 'A', name: 'A spinner and plain words', line: 'The shadcn way: a small spinner and "Loading orders…" in the middle. The empty state is an icon, one line and a button.',
      from: [sh('spinner'), sh('empty', 'shadcn/ui empty')], tryit: 'Press Reload, then Show empty.',
      needs: 'Plain CSS.', keys: 'The list says it is busy to screen readers.', off: 'The spinner stands still.', law: 'Jakob: the most common wait sign.',
      tags: ['motion:still', 'speed:quick', 'feedback:quiet', 'new:familiar', 'look:ember'],
      html: loadHtml('t16A'),
      css: `#t16A .sp { min-height: 236px; display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--muted); font-size: 14px; }`,
      js: `TLload(box, { loading: function (b) { b.innerHTML = '<div class="sp"><span class="l-spin" aria-hidden="true"></span>Loading orders…</div>'; } });`,
    },
    {
      k: 'B', name: 'Grey blocks with a light that sweeps', line: 'easyui\'s skeleton: grey blocks the size of the rows, with a soft light sweeping across. Then the real rows rise in one by one.',
      from: [ez('skeleton'), sh('skeleton', 'shadcn/ui skeleton')], tryit: 'Press Reload and watch the sweep.',
      needs: 'CSS and the Web Animations API.', keys: 'Same as A.', off: 'The blocks stay still, rows appear at once.', law: 'Jakob: most apps load this way now.',
      tags: ['motion:some', 'speed:mid', 'feedback:quiet', 'new:familiar', 'look:ember'],
      html: loadHtml('t16B'),
      css: `#t16B .sk { display: flex; align-items: center; gap: 10px; height: 56px; }
#t16B .sk i { display: block; border-radius: 6px; background: rgb(var(--ink-rgb) / .08); position: relative; overflow: hidden; }
#t16B .sk i::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgb(255 255 255 / .55), transparent); transform: translateX(-100%); animation: e16sw 1.6s cubic-bezier(.32, .72, 0, 1) infinite; }
html[data-theme="dark"] #t16B .sk i::after { background: linear-gradient(90deg, transparent, rgb(255 255 255 / .07), transparent); }
@keyframes e16sw { to { transform: translateX(100%); } }`,
      js: `TLload(box, { loading: function (b) { b.innerHTML = [1, 2, 3, 4].map(function () { return '<div class="sk" aria-hidden="true"><i style="width:34px;height:34px;border-radius:50%"></i><div style="flex:1;display:grid;gap:6px"><i style="width:55%;height:11px"></i><i style="width:75%;height:9px"></i></div><i style="width:60px;height:12px"></i></div>'; }).join('') + '<span class="sr">Loading orders</span>'; },
  loaded: function (b) { if (!moving()) return; $$('.e16-r', b).forEach(function (r, i) { r.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: i * 70, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }); }); } });`,
    },
    {
      k: 'C', name: 'A thinking orb and words that say what is happening', line: 'Our thinking orb with beUI\'s thinking shimmer: a small living orb, and words that change as the work moves on ("Finding orders", "Adding up totals").',
      from: [orbs, be('thinking-shimmer'), be('agent-progress')], tryit: 'Press Reload and read the words.',
      needs: 'The thinking-orbs engine from jsDelivr (pinned 0.3.2). A plain dot if it cannot load.', keys: 'Same as A. The words are read out.', off: 'The orb shows one still frame; words still change.', law: 'Jakob bends a little: an orb is newer than a spinner.',
      tags: ['motion:some', 'speed:slow', 'feedback:clear', 'new:novel', 'look:ember'],
      html: loadHtml('t16C'),
      css: `#t16C .orbw { min-height: 236px; display: grid; justify-items: center; align-content: center; gap: 12px; }
#t16C canvas { width: 64px; height: 64px; }
#t16C .fb { width: 18px; height: 18px; border-radius: 50%; background: var(--ink); animation: pulse 1.4s var(--ease-in-out) infinite; }
#t16C .wd { font-size: 14px; color: var(--muted); background: linear-gradient(90deg, var(--muted) 0 40%, var(--ink) 50%, var(--muted) 60% 100%) 0 0 / 300% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: e16sh 2s linear infinite; }
html[data-motion="off"] #t16C .wd { color: var(--muted); background: none; }
@keyframes e16sh { from { background-position: 100% 0; } to { background-position: 0 0; } }`,
      js: `var eng = null, W = ['Finding your orders…', 'Adding up totals…', 'Almost done…'], wt = null;
import('https://cdn.jsdelivr.net/npm/thinking-orbs@0.3.2/dist/index-B8WsUNf5.js').then(function (m) { eng = m; }, function () { eng = false; });
function orb(c, mode) { if (!eng) { c.outerHTML = '<span class="fb" aria-hidden="true"></span>'; return; } var size = 64, dpr = Math.min(2, devicePixelRatio || 1); c.width = c.height = size * dpr; var ctx = c.getContext('2d'), pr = eng.r(mode, size);
  function dark() { return root.getAttribute('data-theme') === 'dark'; }
  function draw(t) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, size, size); eng.p(ctx, eng.M[pr.mode](size, t, pr.opts), dark()); }
  (function loop(now) { if (!c.isConnected) return; if (!moving()) draw(.6); else draw(now / 1000 * pr.speed * (lvl() === 'calm' ? .5 : 1)); requestAnimationFrame(loop); })(performance.now()); }
TLload(box, { ms: 2600, loading: function (b) { clearInterval(wt); b.innerHTML = '<div class="orbw"><canvas role="img" aria-label="Working"></canvas><span class="wd" data-w>' + W[0] + '</span></div>'; orb($('canvas', b), 'searching'); var i = 0; wt = setInterval(function () { var w = $('[data-w]', b); if (!w) { clearInterval(wt); return; } i = Math.min(W.length - 1, i + 1); w.textContent = W[i]; }, 900); },
  loaded: function () { clearInterval(wt); },
  empty: function () { return TLemptyHtml('No orders yet', 'When a customer pays, their order shows up here.', '<canvas role="img" aria-label="Waiting for orders" data-idle></canvas>'); },
  onEmpty: function (b) { var c = $('[data-idle]', b); c.style.width = c.style.height = '64px'; orb(c, 'listening'); } });`,
    },
    {
      k: 'D', name: 'Outlines that turn into the rows', line: 'Your n23, pushed: outline shapes exactly the size of the real rows, an orange line across the top for progress, and each row fills its own outline in turn, so nothing moves.',
      from: [house('n23'), ez('skeleton', 'easyui SkeletonReveal')], tryit: 'Press Reload and watch the line and the rows.',
      needs: 'CSS and script.', keys: 'Same as A.', off: 'The line is full; rows appear at once.', law: 'Proximity: every row lands where its outline was.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'new:twist', 'look:ember'],
      html: loadHtml('t16D', '<span class="pl" aria-hidden="true" data-pl></span>'),
      css: `#t16D .pl { position: absolute; left: 14px; right: 14px; top: 48px; height: 2px; background: var(--accent); transform: scaleX(0); transform-origin: left; opacity: 0; }
#t16D .pl.is-on { opacity: 1; transform: scaleX(1); transition: transform 2s cubic-bezier(.3, .1, .3, 1), opacity .2s; }
#t16D .pl.is-done { opacity: 0; transform: scaleX(1); transition: opacity .4s .2s; }
#t16D .ol { display: flex; align-items: center; gap: 10px; height: 56px; border-top: 1px solid var(--line); }
#t16D .ol:first-child { border-top: 0; }
#t16D .ol i { display: block; border: 1.5px solid var(--line-hi); border-radius: 6px; }`,
      js: `var pl = $('[data-pl]', box);
TLload(box, { loading: function (b) { pl.className = 'pl'; void pl.offsetWidth; pl.classList.add('is-on'); b.innerHTML = [1, 2, 3, 4].map(function () { return '<div class="ol" aria-hidden="true"><i style="width:34px;height:34px;border-radius:50%"></i><div style="flex:1;display:grid;gap:6px"><i style="width:50%;height:11px"></i><i style="width:70%;height:9px"></i></div><i style="width:62px;height:12px"></i></div>'; }).join('') + '<span class="sr">Loading orders</span>'; },
  loaded: function (b) { pl.classList.add('is-done'); if (!moving()) return; $$('.e16-r', b).forEach(function (r, i) { r.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: i * 120, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }); }); } });`,
    },
    {
      k: 'E', name: 'Only words and a big number', line: 'Steps outside ember: no shapes at all. A big number counts the orders as they arrive, with one line of serif text. The empty state is one sentence.',
      from: [['Print and editorial status pages', null]], tryit: 'Press Reload, then Show empty.',
      needs: 'Plain CSS and script.', keys: 'Same as A.', off: 'The number jumps to the end.', law: 'Hick: one thing to read while you wait.',
      tags: ['motion:some', 'density:roomy', 'feedback:loud', 'new:novel', 'look:off'],
      html: loadHtml('t16E'),
      css: `#t16E .wd { min-height: 236px; display: grid; align-content: center; justify-items: start; gap: 4px; padding-left: 8px; }
#t16E .n { font-family: var(--font-num); font-size: 84px; line-height: .9; color: var(--ink); font-variant-numeric: tabular-nums; }
#t16E .wd p, #t16E .e16-empty b { font-family: var(--font-display); font-style: italic; font-size: 18px; margin: 0; color: var(--ink-soft); }
#t16E .e16-empty svg { display: none; }
#t16E .e16-empty b { font-size: 26px; font-style: normal; color: var(--ink); }`,
      js: `var ti = null; TLload(box, { loading: function (b) { clearInterval(ti); b.innerHTML = '<div class="wd"><span class="n" data-n>0</span><p>of 4 orders found. Still looking.</p></div>'; var n = 0, el = $('[data-n]', b); ti = setInterval(function () { n++; el.textContent = n; if (n >= 4) clearInterval(ti); }, moving() ? 420 : 1); },
  loaded: function () { clearInterval(ti); }, empty: function () { return TLemptyHtml('Nothing yet.', 'Your first order will appear here the moment it is paid.'); } });`,
    },
  ],
};

export default [accordion, command, datepick, loading];
