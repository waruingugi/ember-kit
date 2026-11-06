// Round 4, batch c: menus and text inputs (parts 15–20).
// Ideas from Arc's free parts (uiarc.dev), rebuilt in plain script and the ember look.
// Shared helpers for this batch live on window.TL4c (set in part 15's js). Each part's own engine is in its part js.
import { sh, arc, house } from '../src-links.mjs';

const sv = (d, w = 1.5) => `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const I = {
  chev: sv('m4.5 6.5 3.5 3.5 3.5-3.5'), right: sv('m6.5 4 4 4-4 4'), left: sv('m9.5 4-4 4 4 4'),
  check: sv('M3.5 8.4 6.6 11.3 12.5 4.8', 1.8), x: sv('M4.5 4.5l7 7M11.5 4.5l-7 7', 1.6),
  search: sv('M7.2 12.2a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM10.9 10.9l3.1 3.1', 1.6),
  sliders: sv('M2.5 4.5h7M12.5 4.5h1M2.5 11.5h1M6.5 11.5h7M11 3v3M5 10v3'),
  help: sv('M8 14.2A6.2 6.2 0 1 0 8 1.8a6.2 6.2 0 0 0 0 12.4zM6.3 6.3a1.8 1.8 0 1 1 2.5 1.6c-.5.2-.8.6-.8 1.1v.3M8 11.3v.1'),
  out: sv('M6.5 2.8H3.6v10.4h2.9M10 5.2 12.8 8 10 10.8M12.5 8H6.3'),
  sun: sv('M8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8 1.7v1.2M8 13.1v1.2M1.7 8h1.2M13.1 8h1.2M3.6 3.6l.8.8M11.6 11.6l.8.8M3.6 12.4l.8-.8M11.6 4.4l.8-.8'),
  moon: sv('M13.2 9.7A5.5 5.5 0 0 1 6.3 2.8a5.5 5.5 0 1 0 6.9 6.9z'),
  monitor: sv('M2.3 3.2h11.4v7.3H2.3zM6 13.2h4M8 10.5v2.7'),
  shop: sv('M2.5 6.2 3.6 2.8h8.8l1.1 3.4M2.5 6.2v7h11v-7M2.5 6.2h11M6.3 13.2V9.6h3.4v3.6'),
  pencil: sv('M10.4 3.1l2.5 2.5-7.4 7.4H3v-2.5z'),
  bag: sv('M3.4 5.5h9.2l-.7 8H4.1zM5.8 5.5v-.9a2.2 2.2 0 0 1 4.4 0v.9'),
  receipt: sv('M4 2.2h8v11.6l-2-1.2-2 1.2-2-1.2-2 1.2zM6 5.6h4M6 8.2h4'),
  user: sv('M8 7.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2zM3 13.6c.6-2.4 2.6-3.8 5-3.8s4.4 1.4 5 3.8'),
  clock: sv('M8 14.2A6.2 6.2 0 1 0 8 1.8a6.2 6.2 0 0 0 0 12.4zM8 4.6V8l2.3 1.5'),
  del: sv('M6 3.5h7.5v9H6L2.5 8zM8.2 6.2l3 3.6M11.2 6.2l-3 3.6', 1.4),
  send: sv('M2.6 8 13.4 2.8l-3 10.7-2.8-4.4zM7.6 9.1l5.8-6.3', 1.4),
};
const J = (x) => JSON.stringify(x);

/* ================================================================ 15 User menu */
const TILLS = [['Duka Fresh Westlands', 'Till 482 913', 'W'], ['Duka Fresh Karen', 'Till 517 204', 'K']];
const umKey = (k, on) => (on ? `<span class="um-k" aria-hidden="true">${k}</span>` : '');
const umIt = (a, label, inner, extra = '') => `<div class="um-it" role="menuitem" tabindex="-1" data-r data-it="${a}" data-label="${label}"${extra}>${inner}</div>`;
const shopRow = (i) => `<div class="um-it um-shop" role="menuitemradio" aria-checked="${i === 0}" tabindex="-1" data-r data-it="shop" data-shop="${i}" data-label="${TILLS[i][0]}"><span class="um-sq" aria-hidden="true">${TILLS[i][2]}</span><span class="um-sl">${TILLS[i][0]}<small>${TILLS[i][1]}</small></span><span class="um-ok" aria-hidden="true">${I.check}</span></div>`;
const themeSeg = `<div class="um-it um-th" role="menuitem" tabindex="-1" data-r data-it="theme" data-label="Theme" data-key="T"><span class="um-ic">${I.sun}</span><span>Theme</span><span class="um-seg" aria-hidden="true"><i class="um-thumb" data-thumb></i><span data-tv="system" title="System">${I.monitor}</span><span data-tv="light" title="Light">${I.sun}</span><span data-tv="dark" title="Night">${I.moon}</span></span></div>`;
const themeRows = `<div class="um-gh" data-r role="presentation">Theme</div>` + [['system', 'System', I.monitor], ['light', 'Light', I.sun], ['dark', 'Night', I.moon]].map(([v, l, ic]) => `<div class="um-it" role="menuitemradio" aria-checked="false" tabindex="-1" data-r data-it="tv" data-tv="${v}" data-label="${l}"><span class="um-ic">${ic}</span><span>${l}</span><span class="um-ok" aria-hidden="true">${I.check}</span></div>`).join('');
const umMenu = (id, v = {}) => {
  const sep = '<div class="um-sep" data-r role="separator"></div>';
  const head = `<div class="um-head" data-r role="presentation"><span class="l-av" aria-hidden="true">AW</span><span><b>Amina Wanjiru</b><small>amina@example.com</small></span></div>`;
  const shops = `<div class="um-gh" data-r role="presentation">PocketPay tills</div>${shopRow(0)}${shopRow(1)}`;
  const sett = umIt('say', 'Settings', `<span class="um-ic">${I.sliders}</span><span>Settings</span>${umKey('S', v.keys)}`, ' data-key="S" data-say="Settings for {shop} would open here."');
  const help = umIt('say', 'Help and support', `<span class="um-ic">${I.help}</span><span>Help and support</span>${umKey('H', v.keys)}`, ' data-key="H" data-say="Help: call 0711 000 111, from 7 am to 10 pm."');
  const out = `<div class="um-it um-out" role="menuitem" tabindex="-1" data-r data-it="out" data-label="Sign out" data-key="Q"><span class="um-ic"><span class="um-oi">${I.out}</span><span class="l-spin um-spin"></span></span><span data-lt>Sign out</span>${umKey('Q', v.keys)}</div>`;
  const theme = v.radio ? themeRows : themeSeg;
  const hl = v.radio ? '' : '<span class="um-hl" data-hl aria-hidden="true"></span>';
  let body;
  if (v.pages) {
    const go = `<div class="um-it" role="menuitem" aria-haspopup="menu" tabindex="-1" data-r data-it="go" data-go="shop" data-label="Switch till"><span class="um-ic">${I.shop}</span><span class="um-sl">Switch till<small data-shopname>${TILLS[0][0]}</small></span><span class="um-ic">${I.right}</span></div>`;
    body = `<div class="um-pages" data-pages><div data-pg="main">${hl}${head}${sep}${go}${sett}${help}${theme}${sep}${out}</div><div data-pg="shop" aria-hidden="true">${hl}<div class="um-it um-back" role="menuitem" tabindex="-1" data-it="back" data-label="Back"><span class="um-ic">${I.left}</span><span>Back</span></div><div class="um-gh" role="presentation">PocketPay tills</div>${shopRow(0)}${shopRow(1)}</div></div>`;
  } else body = `${hl}${head}${sep}${shops}${sep}${sett}${help}${theme}${sep}${out}`;
  return `<div class="um-m" role="menu" id="${id}-m" aria-label="Account" tabindex="-1" data-menu>${v.grab ? '<div class="um-grab" data-grab aria-hidden="true"><i></i></div>' : ''}${body}</div>`;
};
const umHtml = (id, v = {}) => {
  const tr = v.avatar
    ? `<button class="um-tr is-av" type="button" data-tr aria-haspopup="menu" aria-controls="${id}-m" aria-label="Account: Amina Wanjiru"><span class="l-av um-av" aria-hidden="true">AW</span></button>`
    : `<button class="um-tr" type="button" data-tr aria-haspopup="menu" aria-controls="${id}-m" aria-label="Account: Amina Wanjiru"><span class="l-av um-av" aria-hidden="true">AW</span><span class="um-tn" aria-hidden="true"><b>Amina Wanjiru</b><small data-shopname>${TILLS[0][0]}</small></span><span class="um-cv">${I.chev}</span></button>`;
  const brand = v.avatar ? `<span class="um-bs"><b>PocketPay</b><small data-shopname>${TILLS[0][0]}</small></span>` : 'PocketPay';
  return `<div class="um-wrap"><div class="um-bar"><span class="um-brand"><i aria-hidden="true"></i>${brand}</span><div class="um">${tr}<button class="l-btn sm um-si" type="button" data-signin>Sign in again</button>${umMenu(id, v)}</div></div><p class="um-note" data-note aria-live="polite">Signed in as Amina Wanjiru.</p>${v.grab ? '<div class="um-scrim" data-scrim aria-hidden="true"></div>' : ''}</div>`;
};

const usermenu = {
  id: 'usermenu', n: '15', name: 'User menu', h: 470,
  claim: 'Your account menu should <em>open from your face,</em> not from a corner.',
  lead: 'Press the avatar. Each menu holds the same things: who you are, your two PocketPay tills, settings, the theme, and sign out. Use the arrow keys, type a letter to jump, and try the theme row: it really changes this page.',
  ref: { ids: 'n32', text: 'The springy dropdown: it pops from its button on a spring, and one highlight glides between the rows. (n33, the bloom menu, is kept for a few actions around one thing.)' },
  noteHint: 'B, with C\'s page for the tills', moreHint: 'a menu with a status (Online, Away, Busy)',
  css: String.raw`#usermenu .um-wrap { width: min(100%, 430px); display: grid; gap: 10px; text-align: left; }
#usermenu .um-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 6px 6px 6px 14px; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-sm); }
#usermenu .um-brand { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; color: var(--ink); min-width: 0; }
#usermenu .um-brand > i { flex: none; width: 10px; height: 10px; border-radius: 3px; background: var(--accent); }
#usermenu .um-bs { display: grid; line-height: 1.2; }
#usermenu .um-bs small { font-size: 12px; font-weight: 400; color: var(--muted); }
#usermenu .um { position: relative; display: grid; }
#usermenu .um > .um-tr, #usermenu .um > .um-si { grid-area: 1 / 1; justify-self: end; align-self: center; transition: opacity .2s var(--ease-out), transform .2s var(--ease-out), visibility 0s; }
#usermenu .um-si { opacity: 0; visibility: hidden; transform: scale(.96); }
#usermenu .is-out .um-si { opacity: 1; visibility: visible; transform: none; }
#usermenu .is-out .um-tr { opacity: 0; visibility: hidden; transform: scale(.96); }
#usermenu .um-tr { display: flex; align-items: center; gap: 9px; height: 44px; padding: 0 8px 0 5px; border-radius: 10px; color: var(--ink); text-align: left; transition: background-color .15s, transform .15s var(--ease-out); }
#usermenu .um-tr:hover, #usermenu .um-tr[aria-expanded="true"] { background: rgb(var(--ink-rgb) / .06); }
#usermenu .um-tr:active { transform: scale(.97); }
#usermenu .um-tr:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
#usermenu .um-tr.is-av { width: 44px; padding: 0; justify-content: center; border-radius: 50%; }
#usermenu .um-tn { display: grid; line-height: 1.2; min-width: 0; }
#usermenu .um-tn b { font-size: 13.5px; font-weight: 600; }
#usermenu .um-tn small, #usermenu .um-bs small { display: block; font-size: 12px; color: var(--muted); white-space: nowrap; }
#usermenu .um-cv { display: grid; color: var(--muted); transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#usermenu .um-cv svg { width: 15px; height: 15px; }
#usermenu [aria-expanded="true"] .um-cv { transform: rotate(180deg); }
#usermenu .um-m { position: absolute; z-index: 5; top: calc(100% + 8px); right: 0; width: 272px; max-width: calc(100vw - 72px); padding: 5px; border-radius: 13px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-lg); outline: none; text-align: left; }
#usermenu .um-hl { position: absolute; z-index: 0; left: 5px; right: 5px; top: 0; height: 36px; border-radius: 8px; background: rgb(var(--ink-rgb) / .07); pointer-events: none; opacity: 0; transition: transform var(--sp-snappy-d) var(--sp-snappy), height var(--sp-snappy-d) var(--sp-snappy), opacity .15s; }
#usermenu .um-it { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; width: 100%; min-height: 36px; padding: 6px 10px; border-radius: 8px; font-size: 14px; color: var(--ink); outline: none; cursor: default; -webkit-user-select: none; user-select: none; }
#usermenu .um-it[data-on]:focus-visible { box-shadow: inset 0 0 0 1.5px rgb(var(--accent-rgb) / .55); }
#usermenu .um-ic { position: relative; width: 16px; height: 16px; flex: 0 0 16px; display: grid; place-items: center; color: var(--muted); }
#usermenu .um-ic svg { width: 16px; height: 16px; }
#usermenu .um-k { margin-left: auto; font: 500 11px/1 var(--font-mono); color: var(--muted); }
#usermenu .um-sep { height: 1px; background: var(--line); margin: 5px 6px; }
#usermenu .um-gh { font: 500 10.5px/1 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); padding: 9px 10px 6px; }
#usermenu .um-head { display: flex; align-items: center; gap: 10px; padding: 8px 10px 9px; line-height: 1.25; }
#usermenu .um-head b { display: block; font-size: 14px; font-weight: 600; color: var(--ink); }
#usermenu .um-head small { font-size: 12.5px; color: var(--muted); }
#usermenu .um-sq { width: 28px; height: 28px; flex: 0 0 28px; display: grid; place-items: center; border-radius: 8px; background: var(--paper-sunk); border: 1px solid var(--line); font: 600 12px/1 var(--font-grot); color: var(--ink-soft); }
#usermenu .um-sl { flex: 1; min-width: 0; display: grid; line-height: 1.25; }
#usermenu .um-sl small { font: 400 11.5px/1.3 var(--font-mono); color: var(--muted); white-space: nowrap; }
#usermenu .um-ok { display: grid; color: var(--accent-text); opacity: 0; transform: scale(.6); transition: opacity .15s, transform var(--sp-bouncy-d) var(--sp-bouncy); }
#usermenu .um-ok svg { width: 16px; height: 16px; }
#usermenu [aria-checked="true"] > .um-ok { opacity: 1; transform: none; }
#usermenu .um-shop[aria-checked="true"] .um-sl { font-weight: 600; }
#usermenu .um-seg { margin-left: auto; position: relative; display: flex; padding: 2px; border-radius: 9px; background: rgb(var(--ink-rgb) / .07); }
#usermenu .um-seg > span { position: relative; z-index: 1; width: 30px; height: 24px; display: grid; place-items: center; color: var(--muted); transition: color .15s; cursor: pointer; }
#usermenu .um-seg > span[aria-checked="true"] { color: var(--ink); }
#usermenu .um-seg svg { width: 14px; height: 14px; }
#usermenu .um-thumb { position: absolute; left: 2px; top: 2px; width: 30px; height: 24px; border-radius: 7px; background: var(--paper-raised); box-shadow: var(--shadow-sm); transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#usermenu .um-spin { position: absolute; width: 14px; height: 14px; color: var(--accent); opacity: 0; }
#usermenu .um-oi { display: grid; transition: opacity .15s; }
#usermenu .um-out[aria-busy="true"] .um-oi { opacity: 0; }
#usermenu .um-out[aria-busy="true"] .um-spin { opacity: 1; }
#usermenu .um-note { margin: 0; padding: 0 4px; font-size: 13px; color: var(--muted); min-height: 1.4em; }
@media (pointer: coarse) { #usermenu .um-it { min-height: 44px; } }`,
  js: String.raw`/* ---- round 4 batch c shared helpers ---- */
window.TL4c = window.TL4c || {};
(function (C) {
  C.offY = function (el, anc) { var y = 0; while (el && el !== anc) { y += el.offsetTop; el = el.offsetParent; } return y; };
  /* one highlight that glides to a row; jumps the first time it shows */
  C.hl = function (h, el, jump) {
    if (!h) return;
    if (!el) { h.style.opacity = 0; h._on = false; return; }
    var j = jump || !h._on || !moving(); if (j) h.style.transition = 'none';
    h.style.height = el.offsetHeight + 'px'; h.style.transform = 'translateY(' + C.offY(el, h.offsetParent) + 'px)'; h.style.opacity = 1; h._on = true;
    if (j) { void h.offsetWidth; h.style.transition = ''; }
  };
  /* measure h0 before the change, then call: the box glides to its new height on a spring */
  C.glide = function (el, h0, sp) {
    if (el._gl) { el._gl.cancel(); el._gl = null; }
    if (!moving()) return; var h1 = el.offsetHeight; if (Math.abs(h0 - h1) < 1) return;
    var s = TLsp(sp || 'soft'); el._gl = el.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: s.d, easing: s.e }); el._gl.onfinish = function () { el._gl = null; };
  };
  C.glideW = function (el, w0, sp) {
    if (el._gw) { el._gw.cancel(); el._gw = null; }
    if (!moving()) return; var w1 = el.offsetWidth; if (Math.abs(w0 - w1) < 1) return;
    var s = TLsp(sp || 'snappy'); el._gw = el.animate([{ width: w0 + 'px' }, { width: w1 + 'px' }], { duration: s.d, easing: s.e }); el._gw.onfinish = function () { el._gw = null; };
  };
  C.shake = function (el) { if (!el || !moving()) return; el.animate([{ transform: 'none' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-2px)' }, { transform: 'none' }], { duration: 340, easing: 'cubic-bezier(.22,1,.36,1)' }); };
  C.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  C.mark = function (s, q) { if (!q) return C.esc(s); var i = s.toLowerCase().indexOf(q.toLowerCase()); return i < 0 ? C.esc(s) : C.esc(s.slice(0, i)) + '<mark>' + C.esc(s.slice(i, i + q.length)) + '</mark>' + C.esc(s.slice(i + q.length)); };
  C.group = function (d) { d = String(d).replace(/^0+(?=\d)/, ''); return d.replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  /* a text box that formats as you type and keeps the caret after the same digit; Backspace over a space or comma takes the digit beside it */
  C.mask = function (inp, fmt, o) {
    o = o || {};
    function dig(s) { return String(s).replace(/\D/g, ''); }
    function max(d) { return typeof o.max === 'function' ? o.max(d) : (o.max || 20); }
    function apply(d, k) {
      d = d.slice(0, max(d)); var s = fmt(d), p = 0, n = 0;
      if (k > 0) { for (p = 0; p < s.length; p++) if (/\d/.test(s.charAt(p)) && ++n >= k) { p++; break; } }
      inp.value = s; if (document.activeElement === inp) inp.setSelectionRange(p, p);
      if (o.on) o.on(d, s);
    }
    inp.addEventListener('input', function () {
      if (o.plus && inp.value.indexOf('+') >= 0) { o.plus(inp.value); return; }
      var c = inp.selectionStart == null ? inp.value.length : inp.selectionStart;
      apply(dig(inp.value), dig(inp.value.slice(0, c)).length);
    });
    inp.addEventListener('keydown', function (e) {
      var a = inp.selectionStart, b = inp.selectionEnd, s = inp.value, d, k; if (a !== b || a == null) return;
      if (e.key === 'Backspace' && a > 0 && /[^0-9+]/.test(s.charAt(a - 1))) { e.preventDefault(); k = dig(s.slice(0, a)).length; if (!k) return; d = dig(s); apply(d.slice(0, k - 1) + d.slice(k), k - 1); }
      else if (e.key === 'Delete' && a < s.length && /[^0-9+]/.test(s.charAt(a))) { e.preventDefault(); k = dig(s.slice(0, a)).length; d = dig(s); apply(d.slice(0, k) + d.slice(k + 1), k); }
    });
    return { set: function (d) { d = dig(d); apply(d, d.length); }, digits: function () { return dig(inp.value); } };
  };
})(window.TL4c);

/* ---- the user menu: keys, type-ahead, gliding highlight, tills, theme, sign out ---- */
TL4c.um = function (box, o) {
  o = o || {}; var C = TL4c;
  var tr = $('[data-tr]', box), menu = $('[data-menu]', box), note = $('[data-note]', box), si = $('[data-signin]', box), pages = $('[data-pages]', menu), scrim = $('[data-scrim]', box), stage = $('.stage', box);
  var open = false, act = null, buf = '', bT = 0, busy = false, shop = 0, page = 'main', T = ['system', 'light', 'dark'], TN = { system: 'System', light: 'Light', dark: 'Night' }, mq = matchMedia('(prefers-color-scheme: dark)');
  var lines = $$('[data-shopname]', box).map(function (el) { return o.plain || !window.TLline ? { set: function (t) { el.textContent = t; } } : TLline(el); });
  $$('[data-r]', menu).forEach(function (el, i) { el.style.setProperty('--i', i); });
  menu.inert = true;
  function say(t) { if (note) note.textContent = t; }
  function items() { return $$('[data-it]', menu).filter(function (el) { var p = el.closest('[data-pg]'); return !p || p.getAttribute('data-pg') === page; }); }
  function hlFor(el) { var p = el && el.closest('[data-pg]'); return $('[data-hl]', p || menu); }
  function mark(el, jump) { act = el || null; $$('[data-it]', menu).forEach(function (x) { if (x === el) x.setAttribute('data-on', ''); else x.removeAttribute('data-on'); }); if (el) { el.focus({ preventScroll: true }); C.hl(hlFor(el), el, jump); } }
  function step(d) { var its = items(), i = its.indexOf(act); mark(its[i < 0 ? (d > 0 ? 0 : its.length - 1) : (i + d + its.length) % its.length]); }
  function showPage(name, jump) {
    if (!pages) return; var h0 = pages.offsetHeight; page = name;
    $$('[data-pg]', menu).forEach(function (p) { var on = p.getAttribute('data-pg') === name; p.setAttribute('aria-hidden', String(!on)); p.inert = !on; });
    if (jump) { if (pages._gl) pages._gl.cancel(); return; }
    C.glide(pages, h0, 'snappy');
    var its = items(); mark(name === 'main' ? its.filter(function (x) { return x.getAttribute('data-it') === 'go'; })[0] : its[0], true);
  }
  function setOpen(v, how) {
    if (v === open || (!v && busy)) return; open = v;
    if (v && o.sheet) box.classList.toggle('is-sheet', !!stage && stage.clientWidth < 440);
    box.classList.toggle('is-open', v); tr.setAttribute('aria-expanded', String(v)); menu.inert = !v;
    if (v) { showPage('main', true); $$('[data-hl]', menu).forEach(function (h) { h.style.opacity = 0; h._on = false; }); act = null; var its = items();
      if (how === 'key') mark(its[0], true); else if (how === 'last') mark(its[its.length - 1], true); else menu.focus({ preventScroll: true }); }
    else { menu.style.transform = ''; mark(null); if (how !== 'stay') tr.focus({ preventScroll: true }); }
  }
  function want(v) { return v === 'system' ? (mq.matches ? 'dark' : 'light') : v; }
  var tv = (root.getAttribute('data-theme') || 'light') === want('system') ? 'system' : root.getAttribute('data-theme');
  function syncTheme() {
    var cur = root.getAttribute('data-theme') || 'light'; if (want(tv) !== cur) tv = cur; var i = T.indexOf(tv);
    $$('[data-tv]', box).forEach(function (el) { el.setAttribute('aria-checked', String(el.getAttribute('data-tv') === tv)); });
    var th = $('[data-thumb]', box); if (th) th.style.transform = 'translateX(' + (i * 100) + '%)';
    var row = $('[data-it="theme"]', box); if (row) row.setAttribute('aria-label', 'Theme: ' + TN[tv] + '. Left and right arrows change it.');
  }
  function setTheme(v) { tv = v; var w = want(v); if ((root.getAttribute('data-theme') || 'light') !== w) { var b = document.getElementById('themeBtn'); if (b) b.click(); else root.setAttribute('data-theme', w); } tv = v; syncTheme(); say('Theme: ' + TN[v] + (v === 'system' ? ', the same as this device.' : '.')); }
  function stepTheme(d) { var i = T.indexOf(tv) + d; if (i < 0 || i > 2) return; setTheme(T[i]); }
  new MutationObserver(syncTheme).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  syncTheme();
  function pickShop(i) {
    if (i !== shop) { var d = i > shop ? 1 : -1; shop = i; $$('[data-shop]', menu).forEach(function (el) { el.setAttribute('aria-checked', String(+el.getAttribute('data-shop') === i)); }); lines.forEach(function (l) { l.set(o.tills[i][0], d); }); }
    say('Now selling from ' + o.tills[i][0] + ', ' + o.tills[i][1] + '.');
    if (pages) { setTimeout(function () { if (open) showPage('main'); }, moving() ? 240 : 0); return; }
    setTimeout(function () { setOpen(false); }, moving() ? 260 : 0);
  }
  function signOut(el) {
    if (busy) return; busy = true; var lt = $('[data-lt]', el); el.setAttribute('aria-busy', 'true'); lt.textContent = 'Signing out…'; say('Signing out…');
    setTimeout(function () { busy = false; el.removeAttribute('aria-busy'); lt.textContent = 'Sign out'; setOpen(false, 'stay'); box.classList.add('is-out'); say('You are signed out of PocketPay.'); if (si) si.focus({ preventScroll: true }); }, 900);
  }
  if (si) si.addEventListener('click', function () { box.classList.remove('is-out'); say('Signed in again as Amina Wanjiru.'); tr.focus({ preventScroll: true }); });
  function runIt(el) {
    var a = el.getAttribute('data-it');
    if (a === 'shop') pickShop(+el.getAttribute('data-shop'));
    else if (a === 'tv') setTheme(el.getAttribute('data-tv'));
    else if (a === 'theme') setTheme(T[(T.indexOf(tv) + 1) % 3]);
    else if (a === 'go') showPage(el.getAttribute('data-go'));
    else if (a === 'back') showPage('main');
    else if (a === 'out') signOut(el);
    else { say(el.getAttribute('data-say').replace('{shop}', o.tills[shop][0])); setOpen(false); }
  }
  tr.addEventListener('click', function (e) { if (open) setOpen(false); else setOpen(true, e.detail === 0 ? 'key' : 'pointer'); });
  tr.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true, e.key === 'ArrowDown' ? 'key' : 'last'); } });
  menu.addEventListener('keydown', function (e) {
    var k = e.key, a = act && act.getAttribute('data-it');
    if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); step(k === 'ArrowDown' ? 1 : -1); }
    else if (k === 'Home' || k === 'End') { e.preventDefault(); var its = items(); mark(k === 'Home' ? its[0] : its[its.length - 1]); }
    else if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); if (page !== 'main') showPage('main'); else setOpen(false); }
    else if (k === 'Tab') { e.preventDefault(); setOpen(false); }
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); if (act) runIt(act); }
    else if (k === 'ArrowLeft' || k === 'ArrowRight') { var d = k === 'ArrowRight' ? 1 : -1;
      if (a === 'theme') { e.preventDefault(); stepTheme(d); } else if (d > 0 && a === 'go') { e.preventDefault(); runIt(act); } else if (d < 0 && page !== 'main') { e.preventDefault(); showPage('main'); } }
    else if (k.length === 1 && /\S/.test(k) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      var its2 = items(), K = k.toUpperCase();
      if (o.keys) { var hit = its2.filter(function (x) { return x.getAttribute('data-key') === K; })[0]; if (hit) { e.preventDefault(); mark(hit); runIt(hit); return; } }
      clearTimeout(bT); buf += k.toLowerCase(); bT = setTimeout(function () { buf = ''; }, 600);
      var i0 = its2.indexOf(act); for (var j = 0; j < its2.length; j++) { var c = its2[(i0 + (buf.length === 1 ? 1 : 0) + j + its2.length * 2) % its2.length]; if ((c.getAttribute('data-label') || '').toLowerCase().indexOf(buf) === 0) { mark(c); break; } }
    }
  });
  menu.addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; var t = e.target.closest && e.target.closest('[data-it]'); if (t && t !== act && items().indexOf(t) >= 0) mark(t); });
  menu.addEventListener('click', function (e) { var s = e.target.closest && e.target.closest('.um-seg [data-tv]'); if (s) { setTheme(s.getAttribute('data-tv')); return; } var t = e.target.closest && e.target.closest('[data-it]'); if (t && items().indexOf(t) >= 0) { mark(t); runIt(t); } });
  document.addEventListener('pointerdown', function (e) { if (!open || menu.contains(e.target) || tr.contains(e.target)) return; setOpen(false, scrim && e.target === scrim ? 'back' : 'stay'); });
  var grab = $('[data-grab]', menu);
  if (grab) {
    var dr = null;
    var down = function (e) { if (!box.classList.contains('is-sheet') || !open || e.target.closest('[data-it]')) return; dr = { y: e.clientY, t: performance.now(), dy: 0, v: 0 }; e.currentTarget.setPointerCapture(e.pointerId); menu.style.transition = 'none'; };
    var move = function (e) { if (!dr) return; var dy = e.clientY - dr.y; dy = dy < 0 ? dy * .2 : dy; var now = performance.now(); dr.v = (dy - dr.dy) / Math.max(1, now - dr.t); dr.t = now; dr.dy = dy; menu.style.transform = 'translateY(' + dy.toFixed(1) + 'px)'; };
    var up = function () { if (!dr) return; var d = dr; dr = null; menu.style.transition = ''; if (d.dy > 70 || d.v > .6) setOpen(false); else menu.style.transform = ''; };
    [grab, $('.um-head', menu)].forEach(function (h) { h.addEventListener('pointerdown', down); h.addEventListener('pointermove', move); h.addEventListener('pointerup', up); h.addEventListener('pointercancel', up); });
  }
  return { set: setOpen };
};`,
  opts: [
    {
      k: 'B', name: 'Grows out of the avatar, rows arrive in turn', line: 'The menu springs out of your avatar and settles. Its rows arrive one after another, top to bottom. One soft highlight glides to the row under your pointer or keys. Switch tills and the name in the button rolls to the new one.',
      from: [arc('user-menu'), house('n32')], tryit: 'Open it, switch to the Karen till, then open it again and press Right on Theme.',
      needs: 'Script and CSS springs.', keys: 'Enter or Down opens. Arrows move, letters jump (S for Settings). Left and Right change the theme. Escape closes and puts you back on the avatar.', off: 'The menu shows at once with every row in place; the till name swaps.', law: 'Jakob: the account menu sits top right, under your face, where everyone looks for it.',
      tags: ['motion:springy', 'speed:mid', 'open:trigger', 'feedback:clear', 'new:twist', 'look:ember'], top: true,
      html: umHtml('t15B'),
      css: String.raw`#t15B .um-m { transform-origin: calc(100% - 26px) -8px; opacity: 0; visibility: hidden; transform: translateY(-6px) scale(.9); transition: opacity .14s var(--ease-out), transform .16s var(--ease-out), visibility 0s linear .16s; }
#t15B.is-open .um-m { opacity: 1; visibility: visible; transform: none; transition: opacity .18s var(--ease-out), transform var(--sp-bouncy-d) var(--sp-bouncy), visibility 0s; }
#t15B .um-m [data-r] { opacity: 0; transform: translateY(-5px); transition: opacity .1s, transform .1s; }
#t15B.is-open .um-m [data-r] { opacity: 1; transform: none; transition: opacity .22s var(--ease-out) calc(var(--i) * 20ms + 40ms), transform var(--sp-snappy-d) var(--sp-snappy) calc(var(--i) * 20ms + 40ms); }`,
      js: `TL4c.um(box, { tills: ${J(TILLS)} });`,
    },
    {
      k: 'A', name: 'A plain menu under the button', line: 'The shadcn way. A list under the button, a grey row under the pointer, and the theme as three rows with a tick. No motion.',
      from: [sh('dropdown-menu'), arc('user-menu')], tryit: 'Open it and pick Night with the keyboard.',
      needs: 'Script for the keys.', keys: 'Same as B. Left and Right do nothing here; the theme has its own rows.', off: 'Same.', law: 'Hick: every choice is one row, nothing hidden.',
      tags: ['motion:still', 'speed:quick', 'open:trigger', 'feedback:quiet', 'new:familiar', 'look:ember'], top: true, h: 560,
      html: umHtml('t15A', { radio: true }),
      css: String.raw`#t15A .um-m { display: none; }
#t15A.is-open .um-m { display: block; }
#t15A .um-it[data-on] { background: rgb(var(--ink-rgb) / .07); }
#t15A .um-ok { transition: none; }`,
      js: `TL4c.um(box, { tills: ${J(TILLS)}, plain: true });`,
    },
    {
      k: 'C', name: 'The tills open on a page inside the menu', line: 'The menu stays short. "Switch till" slides the menu sideways to a second page with both tills, and the menu glides to its new height. Pick one and it slides back, showing your new till.',
      kind: 'Mix', from: [arc('user-menu'), house('c06'), house('n32')], tryit: 'Open it, go to Switch till, pick Karen, and watch the page slide back.',
      needs: 'Script and CSS springs.', keys: 'Right on Switch till opens the page; Left or Escape comes back. The rest as B.', off: 'The pages swap at once; the menu jumps to its new height.', law: 'Hick: four choices at the top, the tills one step in.',
      tags: ['motion:springy', 'speed:mid', 'open:trigger', 'feedback:clear', 'new:twist', 'look:ember'], top: true, h: 430,
      html: umHtml('t15C', { pages: true }),
      css: String.raw`#t15C .um-m { transform-origin: calc(100% - 26px) 0; opacity: 0; visibility: hidden; transform: scale(.95); transition: opacity .14s var(--ease-out), transform .16s var(--ease-out), visibility 0s linear .16s; }
#t15C.is-open .um-m { opacity: 1; visibility: visible; transform: none; transition: opacity .18s var(--ease-out), transform var(--sp-snappy-d) var(--sp-snappy), visibility 0s; }
#t15C .um-pages { position: relative; overflow: hidden; margin: -5px; padding: 5px; }
#t15C [data-pg] { position: relative; transition: transform .34s var(--ease-out), opacity .22s var(--ease-out); }
#t15C [data-pg][aria-hidden="true"] { position: absolute; top: 5px; left: 5px; right: 5px; opacity: 0; pointer-events: none; }
#t15C [data-pg="main"][aria-hidden="true"] { transform: translateX(-30%); }
#t15C [data-pg="shop"][aria-hidden="true"] { transform: translateX(30%); }
#t15C .um-back { color: var(--ink-soft); }`,
      js: `TL4c.um(box, { tills: ${J(TILLS)} });`,
    },
    {
      k: 'D', name: 'Your n32 dropdown with keys, a sheet on phones', line: 'Your n32 dropdown, pushed. It pops from the avatar on a spring and shows a letter key on each row: press it and the row runs. On a phone it rises from the bottom as a sheet you can pull down to close.',
      kind: 'Reference, pushed', from: [house('n32'), arc('user-menu')], tryit: 'Open it and press S. On a phone, open it and pull the sheet down.',
      needs: 'Script and CSS springs.', keys: 'S, H and Q run their rows. T changes the theme. Arrows, Escape and Tab as B.', off: 'The menu or sheet shows at once. Pulling the sheet still closes it.', law: 'Fitts: on a phone the menu comes to your thumb.',
      tags: ['motion:springy', 'speed:mid', 'open:edge', 'feedback:clear', 'new:twist', 'look:ember'], top: true,
      html: umHtml('t15D', { keys: true, avatar: true, grab: true }),
      css: String.raw`#t15D .um-m { transform-origin: calc(100% - 20px) 0; opacity: 0; visibility: hidden; transform: scale(.6); transition: opacity .15s var(--ease-out), transform .15s var(--ease-out), visibility 0s linear .15s; }
#t15D.is-open .um-m { opacity: 1; visibility: visible; transform: none; transition: opacity .16s var(--ease-out), transform var(--sp-bouncy-d) var(--sp-bouncy), visibility 0s; }
#t15D .um-grab { display: none; }
#t15D .um-scrim { position: absolute; inset: 0; z-index: 4; background: var(--scrim); opacity: 0; visibility: hidden; transition: opacity .25s var(--ease-out), visibility 0s linear .25s; }
#t15D.is-sheet .um { position: static; }
#t15D.is-sheet .um-m { top: auto; left: 0; right: 0; bottom: 0; width: auto; max-width: none; padding: 0 6px 10px; border-radius: 14px 14px 0 0; border-bottom: 0; opacity: 1; transform: translateY(104%); transition: transform .25s var(--ease-out), visibility 0s linear .25s; }
#t15D.is-sheet.is-open .um-m { transform: none; transition: transform .45s var(--ease-out), visibility 0s; }
#t15D.is-sheet .um-grab { display: grid; place-items: center; height: 22px; touch-action: none; cursor: grab; }
#t15D.is-sheet .um-grab i { width: 36px; height: 4px; border-radius: 4px; background: rgb(var(--ink-rgb) / .2); }
#t15D.is-sheet .um-head { touch-action: none; }
#t15D.is-sheet.is-open .um-scrim { opacity: 1; visibility: visible; transition: opacity .35s var(--ease-out), visibility 0s; }`,
      js: `TL4c.um(box, { tills: ${J(TILLS)}, keys: true, sheet: true });`,
    },
  ],
};

/* ================================================================ 16 Expanding search */
const XS = {
  groups: [
    ['Products', [['Mangoes', 'KES 60 each', 'bag'], ['Milk, 500 ml', 'KES 65', 'bag'], ['Bread, 400 g', 'KES 70', 'bag'], ['Sukuma wiki', 'KES 30 a bunch', 'bag'], ['Avocado', 'KES 40 each', 'bag'], ['Maize flour, 2 kg', 'KES 210', 'bag']]],
    ['Orders', [['#4821', 'Amina Otieno · KES 4,200', 'receipt'], ['#4820', 'Brian Kiprop · KES 12,750', 'receipt'], ['#4819', 'Wanjiru Mwangi · KES 860', 'receipt'], ['#4818', 'Otieno Ouma · KES 3,400', 'receipt']]],
    ['Customers', [['Amina Otieno', '0712 345 678', 'user'], ['Brian Kiprop', '0722 410 905', 'user'], ['Wanjiru Mwangi', '0733 118 264', 'user'], ['Otieno Ouma', '0701 556 120', 'user']]],
  ],
  recent: [['Mangoes', 'KES 60 each', 'bag'], ['#4820', 'Brian Kiprop · KES 12,750', 'receipt'], ['Brian Kiprop', '0722 410 905', 'user']],
  icons: { bag: I.bag, receipt: I.receipt, user: I.user, recent: I.clock },
};
const xsField = (id, v = {}) => `<div class="xs-f" data-f><span class="xs-fi" aria-hidden="true">${I.search}</span><input id="${id}-in" class="xs-in" data-in type="text" role="combobox" aria-expanded="false" aria-controls="${id}-lb" aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="${v.ph || 'Search products, orders, people'}" aria-label="Search the shop"><kbd class="l-kbd xs-esc" aria-hidden="true">Esc</kbd></div>`;
const xsList = (id) => `<div class="xs-ph" data-ph><div class="xs-lw"><span class="xs-hl" data-hl aria-hidden="true"></span><ul class="xs-lb" role="listbox" id="${id}-lb" data-list aria-label="Results"></ul></div></div>`;
const xsBtn = `<button class="l-ib xs-btn" type="button" data-open aria-label="Search the shop" aria-expanded="false">${I.search}</button>`;
const xsBar = (id, v = {}) => `<div class="xs-app"><div class="xs-bar" data-xs><span class="xs-brand"><i aria-hidden="true"></i>Duka Fresh</span><span class="xs-nav" aria-hidden="true"><span>Orders</span><span>Stock</span></span>${xsBtn}${xsField(id, v)}${v.inline ? '' : `<div class="xs-p" data-panel>${xsList(id)}</div>`}</div>${v.inline ? `<div class="xs-p" data-panel>${xsList(id)}</div>` : ''}${v.below || ''}<p class="xs-note" data-note aria-live="polite">Nothing opened yet.</p></div>`;

const expsearch = {
  id: 'expsearch', n: '16', name: 'Expanding search', h: 460,
  claim: 'A search icon should <em>grow into the field</em> and fold back when you are done.',
  lead: 'Duka Fresh keeps search small in its top bar. Press the search icon, or Tab to it and press Enter. Type "ma" or "48". Pick with the arrow keys and Enter. Escape folds it back and puts you on the icon again.',
  ref: { ids: 'n36', text: 'The springy command box: a box springs open over the page, you type, one highlight glides, Enter runs it.' },
  noteHint: 'B, but recent searches as chips', moreHint: 'search that also finds settings',
  css: String.raw`#expsearch .xs-app { width: min(100%, 440px); display: grid; gap: 10px; text-align: left; }
#expsearch .xs-bar { position: relative; z-index: 3; display: flex; align-items: center; gap: 14px; height: 52px; padding: 0 6px 0 14px; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-sm); }
#expsearch .xs-brand { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; color: var(--ink); white-space: nowrap; }
#expsearch .xs-brand > i { width: 10px; height: 10px; border-radius: 3px; background: var(--accent); }
#expsearch .xs-nav { display: flex; gap: 12px; font-size: 13.5px; color: var(--muted); }
#expsearch .xs-btn { margin-left: auto; width: 40px; height: 40px; }
#expsearch .xs-f { position: absolute; top: 5px; bottom: 5px; left: 5px; right: 5px; display: flex; align-items: center; gap: 8px; padding: 0 8px 0 12px; border-radius: 10px; border: 1px solid var(--accent); background: var(--paper-raised); box-shadow: 0 0 0 3px rgb(var(--accent-rgb) / .14); visibility: hidden; }
#expsearch .xs-fi { display: grid; color: var(--muted); }
#expsearch .xs-fi svg { width: 16px; height: 16px; }
#expsearch .xs-in { flex: 1; min-width: 0; height: 100%; border: 0; background: transparent; font: inherit; font-size: 15px; color: var(--ink); padding: 0; outline: none; }
#expsearch .xs-in::placeholder { color: var(--muted); }
#expsearch .xs-esc { flex: none; }
#expsearch .xs-p { position: absolute; z-index: 4; left: 0; right: 0; top: calc(100% + 6px); border-radius: 13px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-lg); visibility: hidden; }
#expsearch .xs-ph { overflow: hidden; }
#expsearch .xs-lw { position: relative; padding: 5px; }
#expsearch .xs-lb { list-style: none; margin: 0; padding: 0; }
#expsearch .xs-hl { position: absolute; z-index: 0; left: 5px; right: 5px; top: 0; height: 40px; border-radius: 8px; background: rgb(var(--ink-rgb) / .07); pointer-events: none; opacity: 0; transition: transform var(--sp-snappy-d) var(--sp-snappy), opacity .15s; }
#expsearch .xs-gh { font: 500 10.5px/1 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); padding: 10px 10px 6px; }
#expsearch .xs-o { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; height: 40px; padding: 0 10px; border-radius: 8px; font-size: 14px; color: var(--ink); cursor: pointer; -webkit-user-select: none; user-select: none; }
#expsearch .xs-ic { display: grid; color: var(--muted); }
#expsearch .xs-ic svg { width: 16px; height: 16px; }
#expsearch .xs-l { white-space: nowrap; }
#expsearch .xs-l mark { background: none; color: var(--accent-text); font-weight: 600; }
#expsearch .xs-s { margin-left: auto; font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
#expsearch .xs-none { padding: 14px 10px; font-size: 13.5px; color: var(--muted); }
#expsearch .xs-note { margin: 0; padding: 0 4px; font-size: 13px; color: var(--muted); min-height: 1.4em; }
#expsearch .is-open .xs-f, #expsearch .is-open .xs-p { visibility: visible; }
@media (max-width: 420px) { #expsearch .xs-nav { display: none; } #expsearch .xs-s { display: none; } }
@media (pointer: coarse) { #expsearch .xs-o { height: 44px; } }`,
  js: String.raw`/* ---- expanding search: results by group, recent searches, keys, a gliding highlight ---- */
TL4c.xs = function (box, o) {
  var C = TL4c, bar = $('[data-xs]', box), btn = $('[data-open]', box), inp = $('[data-in]', box), list = $('[data-list]', box), ph = $('[data-ph]', box), hl = $('[data-hl]', box), note = $('[data-note]', box);
  var open = false, act = -1, rows = [], shown = [], recent = o.recent.slice(), id = inp.id;
  function row(it, q, n, kind) { return '<li role="option" aria-selected="false" id="' + id + '-o' + n + '" class="xs-o"><span class="xs-ic" aria-hidden="true">' + o.icons[kind || it[2]] + '</span><span class="xs-l">' + C.mark(it[0], q) + '</span><span class="xs-s">' + C.esc(it[1]) + '</span></li>'; }
  function render(q, first) {
    var h0 = ph.offsetHeight, html = '', n = 0; q = q.trim(); shown = [];
    if (!q) { html += '<li class="xs-gh" role="presentation">Recent</li>'; recent.forEach(function (it) { shown.push(it); html += row(it, '', n++, 'recent'); }); }
    else o.groups.forEach(function (g) { var m = g[1].filter(function (it) { return (it[0] + ' ' + it[1]).toLowerCase().indexOf(q.toLowerCase()) >= 0; }).slice(0, 2); if (!m.length) return; html += '<li class="xs-gh" role="presentation">' + g[0] + '</li>'; m.forEach(function (it) { shown.push(it); html += row(it, q, n++); }); });
    if (!n) html += '<li class="xs-none" role="presentation">Nothing matches “' + C.esc(q) + '”. Try “mango” or “4820”.</li>';
    list.innerHTML = html; rows = $$('[role="option"]', list); mark(0, first);
    if (!first) C.glide(ph, h0, o.sp || 'soft');
  }
  function mark(i, jump) {
    if (!rows.length) { act = -1; C.hl(hl, null); inp.removeAttribute('aria-activedescendant'); return; }
    act = (i + rows.length) % rows.length; rows.forEach(function (r, j) { if (j === act) r.setAttribute('data-on', ''); else r.removeAttribute('data-on'); r.setAttribute('aria-selected', String(j === act)); });
    inp.setAttribute('aria-activedescendant', rows[act].id); C.hl(hl, rows[act], jump);
  }
  function setOpen(v, back) {
    if (v === open) return; open = v; box.classList.toggle('is-open', v); btn.setAttribute('aria-expanded', String(v)); inp.setAttribute('aria-expanded', String(v));
    if (v) { inp.value = ''; render('', true); if (o.onOpen) o.onOpen(); setTimeout(function () { if (open) inp.focus({ preventScroll: true }); }, 0); }
    else { if (o.onClose) o.onClose(); inp.removeAttribute('aria-activedescendant'); if (back) btn.focus({ preventScroll: true }); }
  }
  function pick(i) { var it = shown[i]; if (!it) return; note.textContent = 'Opened ' + it[0] + ': ' + it[1] + '.'; recent = [it].concat(recent.filter(function (r) { return r[0] !== it[0]; })).slice(0, 3); setOpen(false, true); }
  btn.addEventListener('click', function () { setOpen(true); });
  inp.addEventListener('input', function () { render(inp.value); });
  inp.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); if (rows.length) mark(act + (k === 'ArrowDown' ? 1 : -1)); }
    else if (k === 'Enter') { e.preventDefault(); if (act >= 0) pick(act); }
    else if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); setOpen(false, true); }
    else if (k === 'Tab') { e.preventDefault(); setOpen(false, true); }
  });
  list.addEventListener('pointermove', function (e) { var t = e.target.closest && e.target.closest('[role="option"]'); if (t) { var j = rows.indexOf(t); if (j !== act) mark(j); } });
  list.addEventListener('pointerdown', function (e) { e.preventDefault(); });
  list.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[role="option"]'); if (t) pick(rows.indexOf(t)); });
  document.addEventListener('pointerdown', function (e) { if (!open) return; var panel = $('[data-panel]', box); if (bar.contains(e.target) || (panel && panel.contains(e.target))) return; setOpen(false, !!(e.target.hasAttribute && e.target.hasAttribute('data-scrim'))); });
  if (o.slash) box.addEventListener('keydown', function (e) { if (e.key === '/' && !open && !(e.target.closest && e.target.closest('input, textarea, [contenteditable="true"]'))) { e.preventDefault(); setOpen(true); } });
  return { set: setOpen, isOpen: function () { return open; } };
};`,
  opts: [
    {
      k: 'B', name: 'The icon grows into the field', line: 'Press the icon and the field grows out of it to the left, over the shop name, on a spring. The results unfold under it. As you type, the box glides to fit what is left, and one highlight glides between the rows.',
      from: [arc('expanding-search'), house('n36')], tryit: 'Press the icon, type "ma", then press Down twice and Enter.',
      needs: 'Script and CSS springs.', keys: 'Enter on the icon opens. Arrows move, Enter opens a result, Escape or Tab folds it back to the icon.', off: 'The field and the results show at once. The box jumps to its new size.', law: 'Fitts: the field grows where the icon was, so your eyes do not move.',
      tags: ['motion:springy', 'speed:mid', 'open:inplace', 'feedback:clear', 'new:twist', 'look:ember'], top: true,
      html: xsBar('t16B'),
      css: String.raw`#t16B .xs-f { clip-path: inset(-5px -5px -5px calc(100% - 40px) round 10px); transition: clip-path .2s var(--ease-out), visibility 0s linear .2s; }
#t16B.is-open .xs-f { clip-path: inset(-5px -5px -5px -5px round 14px); transition: clip-path var(--sp-bouncy-d) var(--sp-bouncy), visibility 0s; }
#t16B .xs-f > * { opacity: 0; transition: opacity .1s; }
#t16B.is-open .xs-f > * { opacity: 1; transition: opacity .2s .08s; }
#t16B .xs-btn { transition: opacity .15s, transform .15s var(--ease-out); }
#t16B.is-open .xs-btn { opacity: 0; }
#t16B .xs-p { clip-path: inset(0 -40px 100% -40px); transition: clip-path .18s var(--ease-out), visibility 0s linear .18s; }
#t16B.is-open .xs-p { clip-path: inset(-10px -40px -70px -40px); transition: clip-path var(--sp-soft-d) var(--sp-soft) .05s, visibility 0s; }`,
      js: `TL4c.xs(box, ${J(XS)});`,
    },
    {
      k: 'A', name: 'A plain field that swaps in', line: 'The icon swaps for a normal search field, and a plain list shows under it. The row under the pointer turns grey. No motion.',
      from: [sh('input', 'shadcn/ui input'), arc('search-field')], tryit: 'Press the icon and type "bread".',
      needs: 'Script for the keys.', keys: 'Same as B.', off: 'Same.', law: 'Jakob: a search box like every shop has.',
      tags: ['motion:still', 'speed:quick', 'open:inplace', 'feedback:quiet', 'new:familiar', 'look:ember'], top: true,
      html: xsBar('t16A'),
      css: String.raw`#t16A .xs-hl { display: none; }
#t16A .xs-o[data-on] { background: rgb(var(--ink-rgb) / .07); }
#t16A .xs-f { border-color: var(--line-hi); box-shadow: none; }
#t16A .xs-f:focus-within { border-color: var(--accent); }`,
      js: `TL4c.xs(box, ${J(XS)});`,
    },
    {
      k: 'C', name: 'Results open in the page and push it down', line: 'The field slides out from the icon while the shop name steps aside. The results open inside the page, not in a floating box, and push the list of orders down. The space glides to fit as you type.',
      kind: 'Mix', from: [arc('expanding-search'), house('n37')], tryit: 'Press the icon, type "o", then delete it and watch the orders below move.',
      needs: 'Script and CSS springs.', keys: 'Same as B.', off: 'The results show at once and the orders jump down.', law: 'Proximity: results sit right in the page, next to what they belong to.',
      tags: ['motion:springy', 'speed:mid', 'open:inplace', 'feedback:clear', 'new:novel', 'look:ember'], top: true, h: 500,
      html: xsBar('t16C', { inline: true, below: `<ul class="xs-today" aria-label="Today's orders"><li><b>#4822</b><span>Njeri Kamau</span><span class="l-num">KES 1,350</span></li><li><b>#4821</b><span>Amina Otieno</span><span class="l-num">KES 4,200</span></li><li><b>#4820</b><span>Brian Kiprop</span><span class="l-num">KES 12,750</span></li></ul>` }),
      css: String.raw`#t16C .xs-f { opacity: 0; transform: translateX(24px); transition: opacity .15s var(--ease-out), transform .2s var(--ease-out), visibility 0s linear .2s; }
#t16C.is-open .xs-f { opacity: 1; transform: none; transition: opacity .2s var(--ease-out), transform var(--sp-snappy-d) var(--sp-snappy), visibility 0s; }
#t16C .xs-brand, #t16C .xs-nav { transition: opacity .2s var(--ease-out), transform .3s var(--ease-out); }
#t16C.is-open .xs-brand, #t16C.is-open .xs-nav { opacity: 0; transform: translateX(-16px); }
#t16C .xs-p { position: static; visibility: visible; display: grid; grid-template-rows: 0fr; border-color: transparent; box-shadow: none; background: transparent; transition: grid-template-rows .3s var(--ease-out), border-color .2s, background-color .2s; }
#t16C.is-open .xs-p { grid-template-rows: 1fr; border-color: var(--line); background: var(--paper-raised); transition: grid-template-rows var(--sp-soft-d) var(--sp-soft), border-color .2s, background-color .2s; }
#t16C .xs-ph { min-height: 0; }
#t16C .xs-today { list-style: none; margin: 0; padding: 4px 14px; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); }
#t16C .xs-today li { display: grid; grid-template-columns: 56px minmax(0, 1fr) auto; gap: 10px; padding: 9px 0; font-size: 13.5px; color: var(--ink-soft); border-bottom: 1px solid var(--line); }
#t16C .xs-today li:last-child { border-bottom: 0; }
#t16C .xs-today b { font-weight: 600; color: var(--ink); }`,
      js: `TL4c.xs(box, Object.assign(${J(XS)}, { sp: 'soft' }));`,
    },
    {
      k: 'D', name: 'Your n36 command box, grown from the icon', line: 'Your n36 command box, pushed. Press the icon, or / anywhere in this card, and the box grows out of the icon to the middle on a spring, with the card dimmed behind it. Escape shrinks it back into the icon.',
      kind: 'Reference, pushed', from: [house('n36'), arc('expanding-search'), arc('command-palette')], tryit: 'Click inside this card, press /, type "kip", press Enter.',
      needs: 'Script and CSS springs.', keys: '/ opens. Arrows, Enter and Escape as B. Tab stays in the box.', off: 'The box shows and hides at once.', law: 'Jakob: / opens search, as on many sites.',
      tags: ['motion:springy', 'speed:mid', 'open:centre', 'feedback:clear', 'new:twist', 'look:ember'], top: true,
      html: `<div class="xs-app"><div class="xs-bar"><span class="xs-brand"><i aria-hidden="true"></i>Duka Fresh</span><span class="xs-nav" aria-hidden="true"><span>Orders</span><span>Stock</span></span><button class="l-ib xs-btn" type="button" data-open aria-label="Search the shop" aria-expanded="false" aria-keyshortcuts="/">${I.search}<kbd class="xs-slash" aria-hidden="true">/</kbd></button></div><p class="xs-note" data-note aria-live="polite">Nothing opened yet.</p><div class="xs-scrim" data-scrim aria-hidden="true"></div><div class="xs-dlg" data-xs role="dialog" aria-label="Search the shop" data-panel>${xsField('t16D')}${xsList('t16D')}<p class="xs-foot" aria-hidden="true"><span><kbd class="l-kbd">↑↓</kbd> move</span><span><kbd class="l-kbd">Enter</kbd> open</span><span><kbd class="l-kbd">Esc</kbd> close</span></p></div></div>`,
      css: String.raw`#t16D .xs-btn { position: relative; }
#t16D .xs-slash { position: absolute; right: -4px; bottom: -4px; font: 500 9.5px/1 var(--font-mono); padding: 2px 4px; border-radius: 4px; background: var(--paper); border: 1px solid var(--line-hi); color: var(--muted); }
#t16D .xs-scrim { position: absolute; inset: 0; z-index: 5; background: rgb(var(--ink-rgb) / .2); opacity: 0; visibility: hidden; transition: opacity .2s var(--ease-out), visibility 0s linear .2s; }
#t16D.is-open .xs-scrim { opacity: 1; visibility: visible; transition: opacity .25s var(--ease-out), visibility 0s; }
#t16D .xs-dlg { position: absolute; z-index: 6; top: 18px; left: 50%; width: min(420px, calc(100% - 24px)); margin-left: max(-210px, calc(-50% + 12px)); border-radius: 14px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-lg); visibility: hidden; transform-origin: 0 0; }
#t16D.is-open .xs-dlg { visibility: visible; }
#t16D .xs-f { position: relative; inset: auto; visibility: inherit; height: 50px; border: 0; border-bottom: 1px solid var(--line); border-radius: 14px 14px 0 0; box-shadow: none; background: transparent; }
#t16D .xs-esc { display: none; }
#t16D .xs-dlg > * { transition: opacity .12s; }
#t16D:not(.is-open) .xs-dlg > *, #t16D .xs-dlg.is-grow > * { opacity: 0; }
#t16D .xs-foot { display: flex; gap: 14px; margin: 0; padding: 8px 14px; border-top: 1px solid var(--line); font-size: 12px; color: var(--muted); }`,
      js: String.raw`var dlg = $('.xs-dlg', box), btn = $('[data-open]', box), an = null;
function rel() { var a = btn.getBoundingClientRect(), b = dlg.getBoundingClientRect(); return 'translate(' + (a.left - b.left) + 'px,' + (a.top - b.top) + 'px) scale(' + (a.width / b.width) + ',' + (a.height / b.height) + ')'; }
var api = TL4c.xs(box, Object.assign(` + J(XS) + String.raw`, { slash: true,
  onOpen: function () { if (!moving()) return; if (an) an.cancel(); var s = TLsp('bouncy'); dlg.classList.add('is-grow'); an = dlg.animate([{ transform: rel(), borderRadius: '50%' }, { transform: 'none', borderRadius: '14px' }], { duration: s.d, easing: s.e }); setTimeout(function () { dlg.classList.remove('is-grow'); }, 90); },
  onClose: function () { if (!moving()) return; if (an) an.cancel(); dlg.style.visibility = 'visible'; dlg.classList.add('is-grow'); an = dlg.animate([{ transform: 'none', borderRadius: '14px' }, { transform: rel(), borderRadius: '50%', opacity: .4 }], { duration: 220, easing: 'cubic-bezier(.22,1,.36,1)' }); an.onfinish = function () { dlg.style.visibility = ''; dlg.classList.remove('is-grow'); }; } }));
$('[data-scrim]', box).addEventListener('click', function () { api.set(false, true); });`,
    },
  ],
};

/* ================================================================ 17 Inline edit */
const ieField = (id, k, label, val, v = {}) => `<div class="ie-f${v.cls ? ' ' + v.cls : ''}" data-ief data-k="${k}"><span class="ie-lb" id="${id}-${k}-l">${label}</span><span class="ie" data-ie><button class="ie-t" type="button" data-t><span class="ie-v" data-v>${val}</span><span class="ie-pen" aria-hidden="true">${I.pencil}</span></button>${v.multi ? `<textarea class="ie-in" data-in rows="1" aria-labelledby="${id}-${k}-l" hidden></textarea>` : `<input class="ie-in" data-in type="text" aria-labelledby="${id}-${k}-l"${v.num ? ' inputmode="numeric"' : ''} autocomplete="off" spellcheck="false" hidden>`}<span class="ie-mir" data-mir aria-hidden="true"></span><span class="ie-st" data-st aria-hidden="true"></span></span>${v.plainBtns ? `<span class="ie-btns" data-btns hidden><button class="l-btn sm pri" type="button" data-save>Save</button><button class="l-btn sm" type="button" data-cancel>Cancel</button></span>` : ''}<p class="ie-msg" data-msg aria-live="polite"></p></div>`;
const NAMECHECK = String.raw`function (s) { if (!s) return 'A shop needs a name.'; if (s.length > 32) return 'Keep it under 32 letters. You have ' + s.length + '.'; return null; }`;

const inlineedit = {
  id: 'inlineedit', n: '17', name: 'Inline edit', h: 340,
  claim: 'Editing a name should <em>happen right where it sits.</em>',
  lead: 'Click a line of text to change it. Enter saves and Escape puts the old words back. Watch the text turn into a box without moving, and the orange tick when the save lands.',
  ref: { ids: 'n30', text: 'The field that shakes when it is wrong and ticks when it is right.' },
  noteHint: 'B, with C\'s Tab to the next line', moreHint: 'inline edit for a whole table row',
  css: String.raw`#inlineedit .ie-card { width: min(100%, 380px); display: grid; gap: 12px; padding: 16px 18px; border-radius: 13px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-sm); text-align: left; }
#inlineedit .ie-f { display: grid; gap: 3px; justify-items: start; min-width: 0; }
#inlineedit .ie-lb { font: 500 10.5px/1.2 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
#inlineedit .ie { position: relative; display: inline-flex; align-items: center; gap: 8px; max-width: 100%; min-width: 0; }
#inlineedit .ie-t { display: inline-flex; align-items: center; gap: 8px; max-width: 100%; min-width: 0; margin: 0 -8px; padding: 3px 8px; border-radius: 8px; border: 1px solid transparent; font: inherit; color: var(--ink); text-align: left; overflow: hidden; cursor: text; transition: background-color .15s; }
#inlineedit .ie-t:hover { background: rgb(var(--ink-rgb) / .05); }
#inlineedit .ie-t:focus-visible { outline: 2px solid var(--accent); outline-offset: 0; }
#inlineedit .ie-v { flex: none; white-space: nowrap; }
#inlineedit .ie-pen { flex: none; display: grid; color: var(--muted); opacity: 0; transition: opacity .15s; }
#inlineedit .ie-pen svg { width: 13px; height: 13px; }
#inlineedit .ie-t:hover .ie-pen, #inlineedit .ie-t:focus-visible .ie-pen { opacity: 1; }
#inlineedit .ie-in { display: block; margin: 0 -8px; padding: 3px 8px; border-radius: 8px; border: 1px solid var(--accent); background: var(--paper-raised); box-shadow: 0 0 0 3px rgb(var(--accent-rgb) / .15); font: inherit; color: var(--ink); line-height: inherit; outline: none; max-width: calc(100% + 16px); resize: none; }
#inlineedit .ie-in[hidden] { display: none; }
#inlineedit .ie-in[aria-invalid="true"] { border-color: var(--accent-text); }
#inlineedit .ie-mir { position: absolute; left: 0; top: 0; visibility: hidden; white-space: pre; pointer-events: none; }
#inlineedit .ie-st { flex: none; width: 18px; height: 18px; display: grid; place-items: center; transition: opacity .3s; }
#inlineedit .ie-st:empty { width: 0; }
#inlineedit .ie-st .l-tick { width: 18px; height: 18px; flex-basis: 18px; }
#inlineedit .ie-st .l-spin { width: 13px; height: 13px; color: var(--accent); }
#inlineedit .ie-st.fade { opacity: 0; }
#inlineedit .ie-msg { margin: 0; min-height: 1.3em; font-size: 12.5px; color: var(--muted); }
#inlineedit .ie-msg.bad { color: var(--accent-text); }
#inlineedit .ie-big { font: 600 20px/1.25 var(--font-grot); }`,
  js: String.raw`/* ---- inline edit: the text becomes a box in place; Enter saves, Escape cancels, a tick when it lands ---- */
TL4c.ie = function (f, o) {
  o = o || {}; var C = TL4c;
  var t = $('[data-t]', f), v = $('[data-v]', f), inp = $('[data-in]', f), st = $('[data-st]', f), msg = $('[data-msg]', f), mir = $('[data-mir]', f), btns = $('[data-btns]', f);
  var multi = inp.tagName === 'TEXTAREA', val = o.value != null ? String(o.value) : v.textContent, editing = false, n = 0;
  var line = o.roll && window.TLline ? TLline(v) : null;
  function show(s, dir) { if (o.show) o.show(s, dir); else if (line) line.set(s, dir); else v.textContent = s; }
  function label() { t.setAttribute('aria-label', o.name + ': ' + (o.say ? o.say(val) : val) + '. Press to edit.'); }
  function say(s, bad) { msg.textContent = s || ''; msg.classList.toggle('bad', !!bad); }
  function fit() {
    if (multi) { inp.style.height = 'auto'; inp.style.height = inp.scrollHeight + 2 + 'px'; inp.style.width = '100%'; return; }
    mir.textContent = inp.value || ' '; var max = f.clientWidth + 16; inp.style.width = Math.min(max, Math.max(o.minW || 120, mir.offsetWidth + 34)) + 'px';
  }
  function start() {
    if (editing) return; editing = true; var w0 = t.offsetWidth, h0 = t.offsetHeight;
    inp.value = o.edit ? o.edit(val) : val; t.hidden = true; inp.hidden = false; if (btns) btns.hidden = false; f.classList.add('is-edit'); st.innerHTML = ''; say(o.help || '');
    fit(); inp.focus({ preventScroll: true }); inp.select();
    if (!multi) C.glideW(inp, w0); else C.glide(inp, h0, 'snappy');
  }
  function finish(nv, back) {
    var w0 = inp.offsetWidth; editing = false; inp.hidden = true; t.hidden = false; if (btns) btns.hidden = true; f.classList.remove('is-edit'); inp.removeAttribute('aria-invalid');
    var old = val; if (nv != null && nv !== val) { val = nv; show(nv, 1); }
    if (!multi) { t.style.overflow = 'hidden'; C.glideW(t, w0); }
    if (back !== false) t.focus({ preventScroll: true });
    label(); if (nv != null && nv !== old) saving(old, ++n);
  }
  function saving(old, my) {
    st.classList.remove('fade'); st.innerHTML = '<span class="l-spin"></span>'; say('Saving…');
    setTimeout(function () {
      if (my !== n) return; var bad = o.fail && o.fail(val);
      if (bad) { var was = val; val = old; show(old, -1); label(); st.innerHTML = ''; say(bad, true); C.shake(t); if (o.on) o.on(val, was, true); return; }
      st.innerHTML = TICK; say(o.saved ? o.saved(val) : 'Saved.'); if (o.on) o.on(val, old);
      clearTimeout(f._tt); f._tt = setTimeout(function () { st.classList.add('fade'); setTimeout(function () { if (my === n) { st.innerHTML = ''; st.classList.remove('fade'); } }, 320); }, 1800);
    }, o.wait || 650);
  }
  function save(back) {
    var nv = multi ? inp.value.replace(/\s+$/, '') : inp.value.trim(); if (o.clean) nv = o.clean(nv);
    var err = o.check ? o.check(nv) : null;
    if (err) { say(err, true); inp.setAttribute('aria-invalid', 'true'); C.shake(inp); return false; }
    finish(nv, back); return true;
  }
  function cancel(back) { finish(null, back); say(''); }
  t.addEventListener('click', start);
  inp.addEventListener('input', function () { fit(); if (inp.getAttribute('aria-invalid')) { inp.removeAttribute('aria-invalid'); say(o.help || ''); } });
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !(multi && e.shiftKey)) { e.preventDefault(); save(); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cancel(); }
    else if (e.key === 'Tab' && !o.btnsOnly) { e.preventDefault(); if (save(!o.onTab)) { if (o.onTab) o.onTab(e.shiftKey ? -1 : 1); } }
  });
  inp.addEventListener('blur', function () { if (!editing || o.btnsOnly) return; setTimeout(function () { if (!editing || f.contains(document.activeElement)) return; if (!save(false)) cancel(false); }, 0); });
  if (btns) { $('[data-save]', f).addEventListener('click', function () { save(); }); $('[data-cancel]', f).addEventListener('click', function () { cancel(); }); }
  show(val); label();
  return { start: start, get: function () { return val; } };
};`,
  opts: [
    {
      k: 'B', name: 'The text rolls to its new words', line: 'Click the words and they become a box in the same place. The box glides wider as it opens. Save, and the box glides back to the words, the new words roll up into place, and an orange tick draws in once the save lands.',
      from: [arc('inline-edit'), house('n30')], tryit: 'Click the shop name, type a new one, press Enter. Then clear it and press Enter.',
      needs: 'Script and CSS springs.', keys: 'Enter or Tab saves, Escape cancels and puts you back on the words.', off: 'The box swaps in and out at once; the words change in place. The tick still shows.', law: 'Jakob: click to rename, like a file name.',
      tags: ['motion:springy', 'speed:mid', 'open:inplace', 'feedback:clear', 'new:twist', 'look:ember'],
      html: `<div class="ie-card">${ieField('t17B', 'name', 'Shop name', 'Duka Fresh Westlands', { cls: 'ie-big' })}${ieField('t17B', 'till', 'Till name', 'Front counter')}${ieField('t17B', 'hours', 'Opening hours', '7 am to 9 pm, every day')}</div>`,
      js: String.raw`var F = $$('[data-ief]', box);
TL4c.ie(F[0], { name: 'Shop name', roll: true, check: ${NAMECHECK}, saved: function (s) { return 'Saved. Customers now see ' + s + '.'; } });
TL4c.ie(F[1], { name: 'Till name', roll: true, check: function (s) { return s ? null : 'Give the till a name, like Front counter.'; } });
TL4c.ie(F[2], { name: 'Opening hours', roll: true, minW: 180, check: function (s) { return s ? null : 'Tell customers when you open.'; } });`,
    },
    {
      k: 'A', name: 'An edit box with Save and Cancel', line: 'The plain way. Click the words to get a box with Save and Cancel buttons under it. Nothing moves; the words just change.',
      from: [sh('input', 'shadcn/ui input'), arc('inline-edit')], tryit: 'Click the till name, change it and press Save.',
      needs: 'A few lines of script.', keys: 'Enter saves, Escape cancels. Tab moves to the buttons.', off: 'Same.', law: 'Jakob: clear buttons, no guessing how to save.',
      tags: ['motion:still', 'speed:quick', 'open:inplace', 'feedback:quiet', 'new:familiar', 'look:ember'], h: 380,
      html: `<div class="ie-card">${ieField('t17A', 'name', 'Shop name', 'Duka Fresh Westlands', { cls: 'ie-big', plainBtns: true })}${ieField('t17A', 'till', 'Till name', 'Front counter', { plainBtns: true })}</div>`,
      css: String.raw`#t17A .ie-btns { display: flex; gap: 6px; margin-top: 6px; }
#t17A .ie-btns[hidden] { display: none; }
#t17A .ie-in { box-shadow: none; }
#t17A .ie-pen { opacity: 1; }`,
      js: String.raw`var F = $$('[data-ief]', box);
TL4c.ie(F[0], { name: 'Shop name', btnsOnly: true, check: ${NAMECHECK}, wait: 300 });
TL4c.ie(F[1], { name: 'Till name', btnsOnly: true, wait: 300, check: function (s) { return s ? null : 'Give the till a name, like Front counter.'; } });`,
    },
    {
      k: 'C', name: 'A settings list you Tab down', line: 'A list of shop settings. Tab saves the line you are on and opens the next one, like a sheet. About can take two lines (Shift and Enter) and its box grows. Name the shop "Duka Fresh Karen" to see a save fail: the words roll back.',
      kind: 'Mix', from: [arc('inline-edit'), house('c15')], tryit: 'Click the shop name, then press Tab four times. Then name it Duka Fresh Karen.',
      needs: 'Script and CSS springs.', keys: 'Tab saves and opens the next line; Shift and Tab the one before. Enter saves, Escape cancels.', off: 'The boxes swap at once. A failed save shows its words and puts the old name back.', law: 'Proximity: each label sits right beside its value.',
      tags: ['motion:springy', 'speed:quick', 'density:compact', 'open:inplace', 'feedback:clear', 'new:twist', 'look:ember'], h: 400,
      html: `<div class="ie-card ie-list">${ieField('t17C', 'name', 'Shop name', 'Duka Fresh Westlands')}${ieField('t17C', 'phone', 'Phone', '0712 345 678')}${ieField('t17C', 'hours', 'Open', '7 am to 9 pm')}${ieField('t17C', 'about', 'About', 'Fresh fruit and vegetables from Limuru farms.', { multi: true })}</div>`,
      css: String.raw`#t17C .ie-list { gap: 0; padding: 4px 16px; }
#t17C .ie-f { grid-template-columns: 92px minmax(0, 1fr); align-items: start; column-gap: 12px; padding: 9px 0; border-bottom: 1px solid var(--line); }
#t17C .ie-f:last-child { border-bottom: 0; }
#t17C .ie-lb { padding-top: 7px; }
#t17C .ie { width: 100%; justify-content: flex-start; }
#t17C .ie-msg { grid-column: 2; min-height: 0; }
#t17C .ie-msg:empty { display: none; }
#t17C [data-k="about"] .ie-v { white-space: normal; }
#t17C [data-k="about"] .ie { align-items: flex-start; }
#t17C [data-k="about"] .ie-t { width: calc(100% + 16px); }
#t17C .ie-in { font-size: 14.5px; }
#t17C .ie-t { font-size: 14.5px; }`,
      js: String.raw`var F = $$('[data-ief]', box), E = [];
function tab(i) { return function (d) { var j = i + d; if (j >= 0 && j < E.length) E[j].start(); else F[i].querySelector('[data-t]').focus({ preventScroll: true }); }; }
E[0] = TL4c.ie(F[0], { name: 'Shop name', roll: true, onTab: tab(0), check: ${NAMECHECK}, fail: function (s) { return s.toLowerCase() === 'duka fresh karen' ? 'Your Karen till already uses that name. We put the old one back.' : null; }, wait: 800 });
E[1] = TL4c.ie(F[1], { name: 'Phone', roll: true, onTab: tab(1), clean: function (s) { var d = s.replace(/\D/g, ''); return d.length === 10 ? d.slice(0, 4) + ' ' + d.slice(4, 7) + ' ' + d.slice(7) : s; }, check: function (s) { return /^0[17]\d{2} \d{3} \d{3}$/.test(s) ? null : 'Use a number like 0712 345 678.'; } });
E[2] = TL4c.ie(F[2], { name: 'Open', roll: true, onTab: tab(2), check: function (s) { return s ? null : 'Tell customers when you open.'; } });
E[3] = TL4c.ie(F[3], { name: 'About', onTab: tab(3), help: 'Shift and Enter for a new line.', check: function (s) { return s.length > 140 ? 'Keep it under 140 letters.' : null; } });`,
    },
    {
      k: 'D', name: 'Your n30 field, on a price list', line: 'Your n30 field, pushed into a price list. Click a price to change it. A wrong price shakes and says why in orange. A right one saves: its digits roll to the new price and the orange tick draws in.',
      kind: 'Reference, pushed', from: [house('n30'), arc('inline-edit'), arc('number-field')], tryit: 'Click the mango price, type 75 and press Enter. Then try 0.',
      needs: 'Script and the shared digit roll.', keys: 'Enter or Tab saves, Escape cancels.', off: 'Prices change in place; no shake. The words and the tick still show.', law: 'Fitts: the price you change is the thing you click.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'open:inplace', 'feedback:loud', 'new:twist', 'look:ember'], h: 360,
      html: `<div class="ie-card ie-prices"><p class="ie-cap">Duka Fresh prices <span>· today</span></p>${[['mango', 'Mangoes, each', 60], ['milk', 'Milk, 500 ml', 65], ['bread', 'Bread, 400 g', 70], ['avo', 'Avocado, each', 40]].map(([k, n, p]) => ieField('t17D', k, n, String(p), { num: true })).join('')}</div>`,
      css: String.raw`#t17D .ie-prices { gap: 0; padding: 6px 16px; }
#t17D .ie-cap { margin: 4px 0 6px; font-size: 13.5px; font-weight: 600; color: var(--ink); }
#t17D .ie-cap span { font-weight: 400; color: var(--muted); }
#t17D .ie-f { grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 12px; padding: 7px 0; border-top: 1px solid var(--line); }
#t17D .ie-lb { font: 400 14px/1.3 var(--font-body, inherit); letter-spacing: 0; text-transform: none; color: var(--ink-soft); }
#t17D .ie { flex-direction: row-reverse; justify-self: end; }
#t17D .ie-t, #t17D .ie-in { font: 500 18px/1.3 var(--font-num); font-variant-numeric: tabular-nums; text-align: right; }
#t17D .ie-msg { grid-column: 1 / -1; min-height: 0; text-align: right; }
#t17D .ie-msg:empty { display: none; }`,
      js: String.raw`$$('[data-ief]', box).forEach(function (f) {
  var v = $('[data-v]', f), p0 = v.textContent, r = TLroll(v, { value: +p0, fmt: function (n) { return 'KES ' + TLmoney(n); }, dur: 520, stagger: 30, live: false });
  TL4c.ie(f, { name: $('.ie-lb', f).textContent, value: p0, minW: 90, say: function (s) { return 'KES ' + s; },
    show: function (s) { r.set(+s); }, edit: function (s) { return s; }, clean: function (s) { return s.replace(/[\s,]/g, '').replace(/^kes/i, ''); },
    check: function (s) { if (!s) return 'Type a price.'; if (!/^\d+$/.test(s)) return 'Use numbers only, like 75.'; if (+s === 0) return 'A price must be more than KES 0.'; if (+s > 10000) return 'That is more than KES 10,000. Check the price.'; return null; },
    saved: function (s) { return 'Saved. Now KES ' + TLmoney(+s) + '.'; } });
});`,
    },
  ],
};

/* ================================================================ 18 Phone input */
// [name, short code, calling code, first digits allowed, example]
const CTY = [['Kenya', 'KE', '+254', '71', '0712 345 678'], ['Uganda', 'UG', '+256', '7', '0772 123 456'], ['Tanzania', 'TZ', '+255', '67', '0754 123 456'], ['Rwanda', 'RW', '+250', '7', '0788 123 456'], ['South Sudan', 'SS', '+211', '9', '0921 234 567'], ['Ethiopia', 'ET', '+251', '97', '0911 234 567'], ['DR Congo', 'CD', '+243', '89', '0812 345 678']];
const phOpts = (id) => CTY.map(([n, k, c], i) => `<li role="option" id="${id}-o${i}" aria-selected="${i === 0}" class="ph-o"><span class="ph-iso">${k}</span><span class="ph-on">${n}</span><span class="ph-oc">${c}</span><span class="ph-ck" aria-hidden="true">${I.check}</span></li>`).join('');
const phTrig = (id) => `<button class="ph-cc" type="button" data-trig aria-haspopup="listbox" aria-controls="${id}-lb" aria-label="Country: Kenya, +254"><span class="ph-iso" data-iso>KE</span><span class="ph-code" data-code>+254</span><span class="ph-cv">${I.chev}</span></button>`;
const phField = (id, v = {}) => `<div class="ph-f" data-shell>${phTrig(id)}<span class="ph-cell">${v.mask ? '<span class="ph-mask" aria-hidden="true"><i data-typed></i><span data-rest></span></span>' : ''}<input id="${id}-in" class="ph-in" data-in type="tel" inputmode="tel" autocomplete="tel-national" aria-labelledby="${id}-l" aria-describedby="${id}-m"></span><span class="ph-ok" data-ok aria-hidden="true"></span></div>`;
const phHtml = (id, v = {}) => `<div class="ph"><span class="l-lbl" id="${id}-l">${v.label || 'Phone number for PocketPay'}</span><div class="ms-wrap ph-wrap">${phField(id, v)}${v.pop}</div><p class="ph-msg" id="${id}-m" data-msg aria-live="polite"></p><p class="ph-out" data-e164>${v.hint || 'We text a code to this number.'}</p>${v.after || ''}</div>`;
const phList = (id) => `<ul class="ph-lb" role="listbox" id="${id}-lb" tabindex="-1" aria-label="Country"><li class="ms-hl ph-hl" aria-hidden="true" role="presentation"></li>${phOpts(id)}</ul>`;

const phone = {
  id: 'phone', n: '18', name: 'Phone input', h: 430,
  claim: 'A phone field should <em>format as you type</em> and never move your caret.',
  lead: 'Kenya comes first. Type 0712345678 or 712345678: the spaces appear by themselves, and the caret stays where you are, even when you fix a digit in the middle. A full, right number gets an orange tick. Pick another country from the code button.',
  ref: { ids: 'n09 · n30', text: 'The combobox whose highlight glides, and the field that shakes when it is wrong and ticks when it is right.' },
  noteHint: 'B\'s surface with C\'s search', moreHint: 'a phone field that also checks the network (Safaricom, Airtel)',
  css: String.raw`#phone .ph { width: min(100%, 340px); display: grid; gap: 6px; text-align: left; }
#phone .ph .l-lbl { margin: 0; }
#phone .ph-wrap { position: relative; }
#phone .ph-f { display: flex; align-items: center; height: 46px; border-radius: 10px; border: 1px solid var(--line-hi); background: var(--paper-raised); transition: border-color .2s, box-shadow .2s; }
#phone .ph-f:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgb(var(--accent-rgb) / .15); }
#phone .ph-f.bad { border-color: var(--accent-text); }
#phone .ph-cc { flex: none; height: 100%; display: flex; align-items: center; gap: 7px; padding: 0 8px 0 10px; border-right: 1px solid var(--line); border-radius: 9px 0 0 9px; color: var(--ink); transition: background-color .15s; }
#phone .ph-cc:hover { background: rgb(var(--ink-rgb) / .05); }
#phone .ph-cc:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
#phone .ph-iso { flex: none; font: 600 10px/1 var(--font-mono); letter-spacing: .04em; padding: 4px 5px; border-radius: 5px; background: rgb(var(--ink-rgb) / .07); color: var(--ink-soft); }
#phone .ph-code { font-size: 15px; font-weight: 500; font-variant-numeric: tabular-nums; min-width: 2.6em; }
#phone .ph-cv { display: grid; color: var(--muted); transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#phone .ph-cv svg { width: 14px; height: 14px; }
#phone [aria-expanded="true"] .ph-cv { transform: rotate(180deg); }
#phone .ph-cell { position: relative; flex: 1; min-width: 0; height: 100%; }
#phone .ph-in { width: 100%; height: 100%; border: 0; background: transparent; padding: 0 10px; font: inherit; font-size: 16px; font-weight: 500; letter-spacing: .02em; font-variant-numeric: tabular-nums; color: var(--ink); outline: none; }
#phone .ph-in::placeholder { color: var(--dim); }
#phone .ph-ok { flex: none; width: 22px; height: 22px; margin-right: 12px; display: grid; place-items: center; }
#phone .ph-ok .l-tick { width: 20px; height: 20px; flex-basis: 20px; }
#phone .ph-msg { margin: 0; font-size: 12.5px; color: var(--accent-text); min-height: 1.35em; }
#phone .ph-out { margin: 0; font-size: 12.5px; color: var(--muted); }
#phone .ph-out b { color: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }
#phone .ph-lb { position: relative; list-style: none; margin: 0; padding: 5px; outline: none; }
#phone .ph-hl { position: absolute; z-index: 0; left: 5px; right: 5px; top: 0; height: 38px; border-radius: 8px; background: rgb(var(--ink-rgb) / .07); pointer-events: none; transition: transform var(--sp-snappy-d) var(--sp-snappy), opacity .15s; }
#phone .ph-lb:focus-visible .ph-hl { box-shadow: inset 0 0 0 1.5px rgb(var(--accent-rgb) / .55); }
#phone .ph-o { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; height: 38px; padding: 0 10px; border-radius: 8px; font-size: 14px; color: var(--ink); cursor: pointer; -webkit-user-select: none; user-select: none; }
#phone .ph-o[hidden] { display: none; }
#phone .ph-on { flex: 1; }
#phone .ph-on mark { background: none; color: var(--accent-text); font-weight: 600; }
#phone .ph-oc { font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums; }
#phone .ph-ck { width: 15px; display: grid; color: var(--accent-text); opacity: 0; }
#phone .ph-ck svg { width: 15px; height: 15px; }
#phone .ph-o[aria-selected="true"] .ph-ck { opacity: 1; }
#phone .ph-o[aria-selected="true"] .ph-on { font-weight: 600; }
@media (pointer: coarse) { #phone .ph-o { height: 44px; } }`,
  js: String.raw`/* ---- phone number: formats as you type, keeps the caret, knows when it is complete ---- */
TL4c.ph = function (box, o) {
  var C = TL4c, inp = $('[data-in]', box), okS = $('[data-ok]', box), msg = $('[data-msg]', box), out = $('[data-e164]', box), shell = $('[data-shell]', box), L = o.list, c = 0, was = false, touched = false, hint = out ? out.innerHTML : '';
  function nat(d) { return d.charAt(0) === '0' ? d.slice(1) : d; }
  function fmt(d) { if (!d) return ''; var t = d.charAt(0) === '0', n = nat(d).slice(0, 9), s = (t ? '0' : '') + n.slice(0, 3); if (n.length > 3) s += ' ' + n.slice(3, 6); if (n.length > 6) s += ' ' + n.slice(6, 9); return s; }
  function ok(d) { var n = nat(d); return n.length === 9 && L[c][3].indexOf(n.charAt(0)) >= 0; }
  function pretty(d) { var n = nat(d); return L[c][2] + ' ' + n.slice(0, 3) + ' ' + n.slice(3, 6) + ' ' + n.slice(6); }
  function problem(d) { var n = nat(d); if (!n) return ''; if (L[c][3].indexOf(n.charAt(0)) < 0) return L[c][0] + ' mobile numbers start with ' + (d.charAt(0) === '0' ? '0' : '') + L[c][3].split('').join(' or ') + ', like ' + L[c][4] + '.'; if (n.length < 9) return L[c][0] + ' numbers have 9 digits after ' + L[c][2] + '. You have ' + n.length + '.'; return ''; }
  function setMsg(t) { if (!msg || msg._t === t) return; msg._t = t; if (o.msg) o.msg(msg, t); else msg.textContent = t; }
  function state(d, typing) {
    var v = ok(d);
    if (v !== was) { was = v; box.classList.toggle('is-valid', v); if (okS) okS.innerHTML = v ? TICK : ''; }
    var p = problem(d), show = v ? '' : (touched || !typing ? p : '');
    setMsg(show); shell.classList.toggle('bad', !!show); inp.setAttribute('aria-invalid', String(!!show));
    if (out) out.innerHTML = v ? 'We will text <b>' + pretty(d) + '</b>.' : hint;
    if (o.onChange) o.onChange(d, v, fmt(d));
  }
  var m = C.mask(inp, fmt, { max: function (d) { return d.charAt(0) === '0' ? 10 : 9; }, on: function (d) { state(d, true); }, plus: plus });
  function plus(s) {
    var d = s.replace(/\D/g, ''), i;
    for (i = 0; i < L.length; i++) { var cd = L[i][2].slice(1); if (d.length >= cd.length && d.indexOf(cd) === 0) { setC(i); m.set(d.slice(cd.length)); return; } }
    if (!d && o.onPlus) { m.set(''); o.onPlus(); return; }
    if (L.some(function (x) { return x[2].slice(1).indexOf(d) === 0; })) return;
    m.set(d);
  }
  function setC(i) { if (i === c) return; var from = c; c = i; inp.placeholder = o.noPh ? '' : L[i][4]; if (o.onCountry) o.onCountry(i, from); state(m.digits(), !touched); }
  inp.addEventListener('blur', function () { var d = m.digits(); touched = touched || !!d; state(d, false); });
  inp.placeholder = o.noPh ? '' : L[0][4]; state('', true);
  return { setC: setC, get: function () { return c; }, digits: m.digits, valid: function () { return ok(m.digits()); }, pretty: function () { return pretty(m.digits()); }, problem: function () { return problem(m.digits()); }, touch: function () { touched = true; state(m.digits(), false); }, fmt: fmt };
};
/* the code button: its short code and calling code roll the way you moved in the list */
TL4c.phTrig = function (box, roll) {
  var iso = $$('[data-iso]', box), code = $$('[data-code]', box), tr = $('[data-trig]', box), L = ${J(CTY)};
  function mk(e) { return roll && window.TLline ? TLline(e) : { set: function (t) { e.textContent = t; } }; }
  var li = iso.map(mk), lc = code.map(mk);
  return function (i, from) { var d = i > from ? 1 : -1; li.forEach(function (l) { l.set(L[i][1], d); }); lc.forEach(function (l) { l.set(L[i][2], d); }); tr.setAttribute('aria-label', 'Country: ' + L[i][0] + ', ' + L[i][2]); };
};`,
  opts: [
    {
      k: 'B', name: 'The code button grows into the list', line: 'Press the code and the button itself grows into the country list on a spring, with its corners rounding off. Pick Uganda and the list folds back into the button while the code rolls to +256. A full number gets an orange tick that draws in.',
      from: [arc('phone-input'), arc('morph-select'), house('n09')], tryit: 'Type 0712345678. Then press the code, pick Tanzania, and see the message.',
      needs: 'Script, a clip-path spring and the shared rolling line.', keys: 'Down on the code opens. Arrows and first letters move, Enter picks, Escape closes. Type +256 in the number to switch country.', off: 'The list shows and hides at once; the code changes in place. The tick still shows.', law: 'Jakob: the country code sits before the number, like on every phone.',
      tags: ['motion:springy', 'speed:mid', 'open:inplace', 'feedback:clear', 'new:twist', 'look:ember'], top: true,
      html: phHtml('t18B', { pop: `<div class="ph-pw"><div class="ph-pop"><div class="ph-head" aria-hidden="true"><span class="ph-iso" data-iso>KE</span><span class="ph-code" data-code>+254</span><span class="ph-cv">${I.chev}</span></div>${phList('t18B')}</div></div>` }),
      css: String.raw`#t18B .ph-pw { position: absolute; z-index: 5; left: 0; right: 0; top: 0; filter: drop-shadow(0 0 .6px var(--line-hi)) drop-shadow(0 16px 22px rgb(var(--ink-rgb) / .12)); pointer-events: none; }
html[data-theme="dark"] #t18B .ph-pw { filter: drop-shadow(0 0 .6px var(--line-hi)) drop-shadow(0 16px 24px rgb(0 0 0 / .55)); }
#t18B .ph-pop { background: var(--paper-raised); visibility: hidden; clip-path: inset(0 calc(100% - var(--bw, 100px)) calc(100% - 46px) 0 round 10px); transition: clip-path .22s var(--ease-out), visibility 0s linear .22s; }
#t18B.is-open .ph-pop { visibility: visible; pointer-events: auto; clip-path: inset(0 0 0 0 round 14px); transition: clip-path var(--sp-bouncy-d) var(--sp-bouncy), visibility 0s; }
#t18B .ph-head { display: flex; align-items: center; gap: 7px; height: 46px; padding: 0 10px; border-bottom: 1px solid var(--line); color: var(--ink); }
#t18B .ph-head .ph-cv { transform: rotate(180deg); }
#t18B .ph-o { opacity: 0; transition: opacity .1s; }
#t18B.is-open .ph-o { opacity: 1; transition: opacity .2s .07s; }`,
      js: String.raw`var trig = TL4c.phTrig(box, true), tb = $('[data-trig]', box), pop = $('.ph-pop', box), inp = $('[data-in]', box);
function bw() { pop.style.setProperty('--bw', tb.offsetWidth + 'px'); } bw(); TLb.fonts(bw);
var ph = TL4c.ph(box, { list: ` + J(CTY) + String.raw`, onCountry: function (i, f) { trig(i, f); setTimeout(bw, 460); } });
TLb.lb(box, { sel: 0, items: ` + J(CTY) + String.raw`, pick: function (i) { ph.setC(i); setTimeout(function () { inp.focus({ preventScroll: true }); }, 0); } });`,
    },
    {
      k: 'A', name: 'A plain code list and a number box', line: 'The plain way. The code opens a list under it. The number box adds spaces as you type. A full number shows the tick; a wrong one says why when you leave the box.',
      from: [sh('input', 'shadcn/ui input'), sh('select', 'shadcn/ui select')], tryit: 'Type 0812345678 and Tab away. Then fix the first digit.',
      needs: 'Script for the keys and the spaces.', keys: 'Same as B.', off: 'Same.', law: 'Jakob: two boxes everyone has seen.',
      tags: ['motion:still', 'speed:quick', 'open:trigger', 'feedback:quiet', 'new:familiar', 'look:ember'], top: true,
      html: phHtml('t18A', { pop: `<div class="ph-pop l-panel">${phList('t18A')}</div>` }),
      css: String.raw`#t18A .ph-pop { position: absolute; z-index: 5; left: 0; width: 230px; top: calc(100% + 6px); padding: 0; display: none; }
#t18A.is-open .ph-pop { display: block; }
#t18A .ph-hl { display: none; }
#t18A .ph-o[data-on] { background: rgb(var(--ink-rgb) / .07); }
#t18A .ph-cv { transition: none; }
#t18A .l-tick.draw circle, #t18A .l-tick.draw path { animation: none; stroke-dashoffset: 0; }`,
      js: String.raw`var trig = TL4c.phTrig(box, false), inp = $('[data-in]', box);
var ph = TL4c.ph(box, { list: ` + J(CTY) + String.raw`, onCountry: trig });
TLb.lb(box, { sel: 0, items: ` + J(CTY) + String.raw`, pick: function (i) { ph.setC(i); setTimeout(function () { inp.focus({ preventScroll: true }); }, 0); } });`,
    },
    {
      k: 'C', name: 'Search the country list, messages that rise', line: 'The code opens a small box with a search on top: type "tan" or "255". The list glides to fit what is left. Type + in the number box and the search opens by itself. Messages under the field rise in out of a blur as the space opens for them.',
      kind: 'Mix', from: [arc('phone-input'), house('n09')], tryit: 'Type + in the number box, then 250. Or press the code and type "eth".',
      needs: 'Script and CSS springs.', keys: 'In the search: arrows move, Enter picks, Escape closes. + in the number box opens it.', off: 'The box shows at once, the list and messages jump to size.', law: 'Hick: typing cuts seven countries down to one.',
      tags: ['motion:springy', 'speed:mid', 'open:trigger', 'feedback:clear', 'new:twist', 'look:ember'], top: true,
      html: phHtml('t18C', { pop: `<div class="ph-pop l-panel" data-pop role="dialog" aria-label="Choose a country"><div class="ph-sf"><span aria-hidden="true">${I.search}</span><input class="ph-q" data-q type="text" role="combobox" aria-controls="t18C-lb" aria-expanded="true" aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="Search country or code" aria-label="Search country or code"></div><div class="ph-lbw" data-lbw><ul class="ph-lb" role="listbox" id="t18C-lb" aria-label="Country"><li class="ph-hl" data-hl aria-hidden="true" role="presentation"></li>${phOpts('t18C')}</ul><p class="ph-none" data-none hidden></p></div></div>` }),
      css: String.raw`#t18C .ph-pop { position: absolute; z-index: 5; left: 0; width: min(270px, 100%); top: calc(100% + 6px); padding: 0; overflow: hidden; opacity: 0; visibility: hidden; transform: translateY(-6px) scale(.97); transform-origin: 20% 0; transition: opacity .14s var(--ease-out), transform .16s var(--ease-out), visibility 0s linear .16s; }
#t18C.is-open .ph-pop { opacity: 1; visibility: visible; transform: none; transition: opacity .18s var(--ease-out), transform var(--sp-snappy-d) var(--sp-snappy), visibility 0s; }
#t18C .ph-sf { display: flex; align-items: center; gap: 8px; height: 42px; padding: 0 12px; border-bottom: 1px solid var(--line); color: var(--muted); }
#t18C .ph-sf svg { width: 15px; height: 15px; display: block; }
#t18C .ph-q { flex: 1; min-width: 0; border: 0; background: transparent; font: inherit; font-size: 14px; color: var(--ink); outline: none; }
#t18C .ph-lbw { overflow: hidden; }
#t18C .ph-none { margin: 0; padding: 12px 14px; font-size: 13px; color: var(--muted); }
#t18C .ph-msg { min-height: 0; overflow: hidden; }
#t18C .ph-msg > span { display: block; padding-bottom: 1px; }`,
      js: String.raw`var C = TL4c, trig = TL4c.phTrig(box, true), tb = $('[data-trig]', box), inp = $('[data-in]', box), pop = $('[data-pop]', box), q = $('[data-q]', box), lbw = $('[data-lbw]', box), hl = $('[data-hl]', box), none = $('[data-none]', box), opts = $$('[role="option"]', box), L = ` + J(CTY) + String.raw`, open = false, act = 0, back = tb;
var ph = TL4c.ph(box, { list: L, onCountry: trig, onPlus: function () { setOpen(true, inp, '+'); },
  msg: function (el, t) { var h0 = el.offsetHeight; el.innerHTML = t ? '<span>' + C.esc(t) + '</span>' : ''; C.glide(el, h0, 'snappy'); var s = el.firstChild; if (s && moving()) s.animate([{ opacity: 0, transform: 'translateY(6px)', filter: 'blur(3px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' }); } });
function vis() { return opts.filter(function (o) { return !o.hidden; }); }
function mark(i, jump) { var v = vis(); opts.forEach(function (o) { o.removeAttribute('data-on'); }); if (!v.length) { C.hl(hl, null); q.removeAttribute('aria-activedescendant'); return; } act = (i + v.length) % v.length; v[act].setAttribute('data-on', ''); q.setAttribute('aria-activedescendant', v[act].id); C.hl(hl, v[act], jump); }
function filter(s, jump) { var h0 = lbw.offsetHeight, t = s.trim().toLowerCase().replace(/^\+/, ''), n = 0;
  opts.forEach(function (o, i) { var name = L[i][0], ok = !t || name.toLowerCase().indexOf(t) >= 0 || L[i][2].slice(1).indexOf(t) === 0 || L[i][1].toLowerCase() === t; o.hidden = !ok; if (ok) n++; $('.ph-on', o).innerHTML = /\d/.test(t) ? C.esc(name) : C.mark(name, t); });
  none.hidden = n > 0; none.textContent = 'No country matches "' + s + '". We cover East and Central Africa.';
  if (!jump) C.glide(lbw, h0, 'soft'); mark(Math.max(0, vis().indexOf(opts[ph.get()])), true); }
function setOpen(v, from, pre) { if (v === open) return; open = v; box.classList.toggle('is-open', v); tb.setAttribute('aria-expanded', String(v));
  if (v) { back = from || tb; q.value = pre || ''; filter(q.value, true); setTimeout(function () { q.focus({ preventScroll: true }); var n = q.value.length; q.setSelectionRange(n, n); }, 0); }
  else if (from !== false) back.focus({ preventScroll: true }); }
function pick(o) { var i = opts.indexOf(o); opts.forEach(function (x, j) { x.setAttribute('aria-selected', String(j === i)); }); ph.setC(i); setOpen(false, false); inp.focus({ preventScroll: true }); }
tb.setAttribute('aria-expanded', 'false');
tb.addEventListener('click', function () { if (open) setOpen(false); else setOpen(true, tb); });
tb.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true, tb); } });
q.addEventListener('input', function () { filter(q.value); var d = q.value.replace(/\D/g, ''), hit = L.findIndex(function (x) { return x[2].slice(1) === d; }); if (q.value.charAt(0) === '+' && hit >= 0) pick(opts[hit]); });
q.addEventListener('keydown', function (e) { var k = e.key;
  if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); mark(act + (k === 'ArrowDown' ? 1 : -1)); }
  else if (k === 'Enter') { e.preventDefault(); var v = vis(); if (v[act]) pick(v[act]); }
  else if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); setOpen(false); }
  else if (k === 'Tab') { e.preventDefault(); setOpen(false); } });
pop.addEventListener('pointermove', function (e) { var t = e.target.closest && e.target.closest('[role="option"]'); if (t) { var j = vis().indexOf(t); if (j !== act) mark(j); } });
pop.addEventListener('pointerdown', function (e) { if (e.target !== q) e.preventDefault(); });
pop.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[role="option"]'); if (t) pick(t); });
document.addEventListener('pointerdown', function (e) { if (open && !pop.contains(e.target) && !tb.contains(e.target)) setOpen(false, false); });`,
    },
    {
      k: 'D', name: 'Your n30 field, with slots that fill', line: 'Your n30 field, pushed. Faint slots show how many digits are left, and each digit you type fills one. Leave the box too soon and it shakes and says why in orange. A full number draws the tick and wakes up the Send code button.',
      kind: 'Reference, pushed', from: [house('n30'), arc('phone-input')], tryit: 'Type 0712 34 and Tab away. Then finish the number and press Send code.',
      needs: 'Script and CSS springs.', keys: 'Same as B. Tab on to Send code.', off: 'No shake. The words, the tick and the button still change.', law: 'Fitts: Send code wakes up right under the number.',
      tags: ['motion:springy', 'speed:mid', 'feedback:loud', 'open:trigger', 'new:twist', 'look:ember'], top: true,
      html: phHtml('t18D', { mask: true, label: 'Your phone number', hint: 'We text a 6-digit code to sign you in.', pop: `<div class="ph-pop l-panel">${phList('t18D')}</div>`, after: '<div class="ph-go"><button class="l-btn pri" type="button" data-send aria-disabled="true">Send code</button><span class="l-muted" data-sent aria-live="polite"></span></div>' }),
      css: String.raw`#t18D .ph-in, #t18D .ph-mask { font: 500 16px/46px var(--font-mono); letter-spacing: 0; }
#t18D .ph-mask { position: absolute; inset: 0; padding: 0 10px; white-space: pre; pointer-events: none; color: var(--dim); overflow: hidden; }
#t18D .ph-mask i { font-style: normal; color: transparent; }
#t18D .ph-pop { position: absolute; z-index: 5; left: 0; width: 230px; top: calc(100% + 6px); padding: 0; opacity: 0; visibility: hidden; transform: translateY(-6px) scale(.96); transform-origin: 15% 0; transition: opacity .14s var(--ease-out), transform .16s var(--ease-out), visibility 0s linear .16s; }
#t18D.is-open .ph-pop { opacity: 1; visibility: visible; transform: none; transition: opacity .18s var(--ease-out), transform var(--sp-bouncy-d) var(--sp-bouncy), visibility 0s; }
#t18D .ph-go { display: flex; align-items: center; gap: 12px; margin-top: 6px; flex-wrap: wrap; }
#t18D .ph-go .l-btn { transition: transform .15s var(--ease-out), opacity .25s; }
#t18D .ph-go .l-btn[aria-disabled="true"] { opacity: .45; }
#t18D [data-sent] { display: inline-flex; align-items: center; gap: 6px; }
#t18D [data-sent] .l-tick { width: 18px; height: 18px; flex-basis: 18px; }`,
      js: String.raw`var trig = TL4c.phTrig(box, true), inp = $('[data-in]', box), typed = $('[data-typed]', box), rest = $('[data-rest]', box), send = $('[data-send]', box), sent = $('[data-sent]', box), shell = $('[data-shell]', box), L = ` + J(CTY) + String.raw`, ph = null;
function paint(d, s) { var t = d ? (d.charAt(0) === '0' ? '0___ ___ ___' : '___ ___ ___') : L[ph ? ph.get() : 0][4]; typed.textContent = s; rest.textContent = t.slice(s.length); }
ph = TL4c.ph(box, { list: L, noPh: true, onCountry: function (i, f) { trig(i, f); paint(ph.digits(), inp.value); }, onChange: function (d, v, s) { paint(d, s); send.setAttribute('aria-disabled', String(!v)); if (!v) sent.textContent = ''; } });
paint('', '');
inp.addEventListener('blur', function () { if (ph.problem()) TL4c.shake(shell); });
send.addEventListener('click', function () { if (!ph.valid()) { ph.touch(); TL4c.shake(shell); inp.focus({ preventScroll: true }); if (!ph.digits()) sent.textContent = 'Type your number first.'; return; } sent.innerHTML = TICK + 'Code sent to ' + ph.pretty() + '.'; });
TLb.lb(box, { sel: 0, items: L, pick: function (i) { ph.setC(i); setTimeout(function () { inp.focus({ preventScroll: true }); }, 0); } });`,
    },
  ],
};

/* ================================================================ 19 Money input */
const moField = (id, v = {}) => `<div class="mo-f" data-shell>${v.cur || '<span class="mo-c">KES</span>'}<span class="mo-cell" data-cell><span class="mo-fit" data-fit><input id="${id}-in" class="mo-in" data-in type="text" inputmode="numeric" autocomplete="off" aria-describedby="${id}-r"><span class="mo-disp" data-disp aria-hidden="true"></span></span><span class="mo-mir" data-mir aria-hidden="true"></span></span></div>`;
const CUR = [['KES', 'Kenyan shilling', 1], ['UGX', 'Ugandan shilling', 28.6], ['TZS', 'Tanzanian shilling', 19.6], ['RWF', 'Rwandan franc', 10.1], ['USD', 'US dollar', 0.0077]];

const money = {
  id: 'money', n: '19', name: 'Money input', h: 400,
  claim: 'A money field should <em>roll when you nudge it</em> and keep up when you type.',
  lead: 'Press a chip or an arrow key and each digit rolls the way the amount moved. Type, and the number is there at once, with commas as you go. Ask for too much and the amount kicks back. Very long amounts shrink to fit.',
  ref: { ids: 'Round 3 · 07 C', text: 'The money field with quick-add chips: digits roll, past the top it kicks sideways and the range line turns orange. You kept it.', url: 'preview-r3.html#numfield', label: 'Open round 3' },
  noteHint: 'D\'s keypad with B\'s chips', moreHint: 'a field that splits one amount between people',
  css: String.raw`#money .mo { width: min(100%, 340px); display: grid; gap: 10px; text-align: left; }
#money .mo .l-lbl { margin: 0; }
#money .mo-f { display: flex; align-items: center; gap: 10px; padding: 6px 14px; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line-hi); transition: border-color .2s, box-shadow .2s; }
#money .mo-f:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgb(var(--accent-rgb) / .15); }
#money .mo-f.over { border-color: var(--accent-text); }
#money .mo-c { flex: none; font: 500 13px/1 var(--font-mono); color: var(--muted); }
#money .mo-cell { position: relative; flex: 1; min-width: 0; height: 64px; overflow: clip; overflow-clip-margin: 4px; }
#money .mo-fit { position: relative; display: grid; height: 100%; transform-origin: 0 50%; }
#money .mo-in, #money .mo-disp, #money .mo-mir { font: 500 52px/64px var(--font-num); font-variant-numeric: tabular-nums; }
#money .mo-in { grid-area: 1 / 1; width: 100%; height: 100%; border: 0; padding: 0; background: transparent; color: transparent; caret-color: var(--accent); outline: none; }
#money .mo-disp { grid-area: 1 / 1; align-self: center; pointer-events: none; color: var(--ink); white-space: nowrap; }
#money .typing .mo-in { color: var(--ink); }
#money .typing .mo-disp { opacity: 0; }
#money .mo-mir { position: absolute; left: 0; top: 0; visibility: hidden; white-space: pre; }
#money .mo-r { margin: -4px 0 0; font-size: 12.5px; color: var(--muted); transition: color .2s; }
#money .mo-r.flash { color: var(--accent-text); }
#money .mo-ch { display: flex; gap: 6px; flex-wrap: wrap; }
#money .mo-ch .l-btn { font-family: var(--font-num); font-size: 15px; letter-spacing: .02em; }
#money .mo-note { margin: 0; min-height: 1.4em; font-size: 13px; color: var(--accent-text); opacity: 0; transform: translateY(4px); transition: opacity .2s var(--ease-out), transform .3s var(--ease-out); }
#money .mo-note.on { opacity: 1; transform: none; }
#money .mo-go { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
#money .mo-go .l-muted { display: inline-flex; align-items: center; gap: 6px; }
#money .mo-go .l-tick { width: 18px; height: 18px; flex-basis: 18px; }
@media (max-width: 400px) { #money .mo-in, #money .mo-disp, #money .mo-mir { font-size: 44px; } }`,
  js: String.raw`/* ---- money: a scale-to-fit spring and a sideways kick for the amount ---- */
TL4c.fitk = function (fitEl, cell, mir) {
  var s = 1, kx = 0;
  function draw() { fitEl.style.transform = (Math.abs(kx) > .01 ? 'translateX(' + kx.toFixed(2) + 'px) ' : '') + (s < .9995 ? 'scale(' + s.toFixed(4) + ')' : ''); }
  var ks = TLb.sp(function (x) { kx = x; draw(); }, { k: 620, c: 14, eps: .02 }), ss = TLb.sp(function (x) { s = x; draw(); }, { x: 1, k: 300, c: 24, eps: .0005 });
  return {
    fit: function (text, jump) { mir.textContent = text; var need = mir.offsetWidth + 6, avail = cell.clientWidth; if (!avail) return; fitEl.style.width = Math.max(avail, need) + 'px'; var t = Math.min(1, avail / need); if (jump) ss.jump(t); else ss.to(t); },
    kick: function (dir, n) { if (moving()) ks.to(0, { v: dir * (150 + 50 * (n || 0)) }); }
  };
};
/* ---- money: typing cuts straight in with commas, chips and arrows roll, limits push back ---- */
TL4c.mo = function (box, o) {
  var C = TL4c, inp = $('[data-in]', box), disp = $('[data-disp]', box), shell = $('[data-shell]', box), note = $('[data-note]', box), rg = $('[data-range]', box);
  var v = o.value, min = o.min, max = o.max, strain = 0, sT = 0, rT = 0, typ = false, cur = o.cur || function () { return 'KES'; };
  var fk = C.fitk($('[data-fit]', box), $('[data-cell]', box), $('[data-mir]', box));
  var r = disp && !o.plain ? TLroll(disp, { value: v, fmt: TLmoney, dur: 520, stagger: 28, live: false }) : null;
  function say(t) { if (!note) return; note.textContent = t; note.classList.remove('on'); void note.offsetWidth; note.classList.add('on'); clearTimeout(note._t); note._t = setTimeout(function () { note.classList.remove('on'); }, 2800); }
  function refuse(dir, btn) { strain = Math.min(strain + 1, 4); clearTimeout(sT); sT = setTimeout(function () { strain = 0; }, 900); if (!o.plain) { fk.kick(dir, strain); C.shake(btn); } if (rg) { rg.classList.add('flash'); clearTimeout(rT); rT = setTimeout(function () { rg.classList.remove('flash'); }, 1400); } say(dir > 0 ? o.maxMsg(max, cur()) : o.minMsg(min, cur())); }
  function sync() { inp.setAttribute('aria-valuetext', cur() + ' ' + TLmoney(v)); }
  function typing(on) { typ = on; shell.classList.toggle('typing', on || !r); }
  var m = C.mask(inp, C.group, { max: function () { return String(max).length + 1; }, on: function (d) { typing(true); var n = d ? parseInt(d, 10) : null; shell.classList.toggle('over', n != null && n > max); if (!o.plain) fk.fit(C.group(d) || '0'); if (r) r.set(n || 0, { instant: true }); if (o.onType) o.onType(n); } });
  function show(n, so) { var was = v; v = n; inp.value = C.group(String(n)); sync(); if (!o.plain) fk.fit(inp.value); if (r) r.set(n, so); if (o.on && was !== n) o.on(v, was); }
  function commit() {
    if (!typ) return; typing(false); shell.classList.remove('over');
    var d = m.digits(), n = d ? parseInt(d, 10) : v, c = Math.max(min, Math.min(max, n));
    if (c !== n) { var was = v; v = c; inp.value = C.group(String(c)); sync(); if (!o.plain) fk.fit(inp.value); if (r) setTimeout(function () { r.set(c); }, moving() ? 140 : 0); refuse(n > c ? 1 : -1); if (o.on) o.on(v, was); }
    else show(c, { instant: true });
  }
  function set(n, btn) { commit(); var c = Math.max(min, Math.min(max, n)); if (c !== v) show(c); if (c !== n) refuse(n > c ? 1 : -1, btn); }
  inp.addEventListener('keydown', function (e) { var k = e.key, s = o.step * (e.shiftKey ? 10 : 1);
    if (k === 'ArrowUp' || k === 'ArrowDown') { e.preventDefault(); set(v + (k === 'ArrowUp' ? s : -s)); }
    else if (k === 'Enter') { e.preventDefault(); commit(); }
    else if (k === 'Escape' && typ) { e.preventDefault(); e.stopPropagation(); typing(false); shell.classList.remove('over'); show(v, { instant: true }); } });
  inp.addEventListener('blur', commit);
  typing(false); show(v, { instant: true }); TLb.fonts(function () { if (!o.plain) fk.fit(inp.value, true); });
  addEventListener('resize', function () { if (!o.plain) fk.fit(inp.value, true); });
  return { get: function () { commit(); return v; }, set: set, show: show, limits: function (a, b) { min = a; max = b; }, say: say };
};`,
  opts: [
    {
      k: 'B', name: 'Typing cuts in, chips roll, long amounts shrink', line: 'Type and the amount is there at once, commas and all, and your caret never lags. Press a chip or an arrow and each digit rolls. Ask for more than your limit and the amount kicks back. Long amounts shrink to fit on a spring.',
      from: [arc('money-input'), arc('number-field')], tryit: 'Type 2500000, then press +100,000. Then type more digits and watch it shrink.',
      needs: 'Script, the shared digit roll and a spring.', keys: 'Arrows add or take 1,000; Shift makes it 10,000. Enter keeps it, Escape puts back the last amount. Backspace on a comma takes the digit beside it.', off: 'The amount changes in place and jumps to its size; no kick. The limit words still show.', law: 'Hick: three common amounts, one tap each.',
      tags: ['motion:springy', 'speed:mid', 'feedback:loud', 'new:twist', 'look:ember'],
      html: `<div class="mo"><label class="l-lbl" for="t19B-in">Pay Mawimbi Mobile, supplier</label>${moField('t19B')}<p class="mo-r" id="t19B-r" data-range>From KES 50 to KES 2,500,000 a day.</p><div class="mo-ch" role="group" aria-label="Add to the amount"><button class="l-btn sm" type="button" data-add="1000">+1,000</button><button class="l-btn sm" type="button" data-add="10000">+10,000</button><button class="l-btn sm" type="button" data-add="100000">+100,000</button></div><p class="mo-note" data-note aria-live="polite"></p></div>`,
      js: String.raw`var f = TL4c.mo(box, { value: 15000, min: 50, max: 2500000, step: 1000, maxMsg: function (m) { return 'Your PocketPay limit is KES ' + TLmoney(m) + ' a day.'; }, minMsg: function (m) { return 'The least you can pay is KES ' + m + '.'; } });
$$('[data-add]', box).forEach(function (b) { b.addEventListener('click', function () { f.set(f.get() + +b.getAttribute('data-add'), b); }); });`,
    },
    {
      k: 'A', name: 'A plain amount box', line: 'The plain way. KES sits in front, the number box adds commas as you type, and the limit shows as words in orange when you go over. Nothing rolls or moves.',
      from: [sh('input', 'shadcn/ui input'), arc('money-input')], tryit: 'Type 60000 and press Enter.',
      needs: 'A few lines of script.', keys: 'Arrows add or take 100. Enter keeps the amount.', off: 'Same.', law: 'Jakob: an amount box like every bank app.',
      tags: ['motion:still', 'speed:quick', 'feedback:quiet', 'new:familiar', 'look:ember'], h: 300,
      html: `<div class="mo"><label class="l-lbl" for="t19A-in">Top up your PocketPay</label>${moField('t19A')}<p class="mo-r" id="t19A-r" data-range>From KES 10 to KES 50,000.</p><p class="mo-note" data-note aria-live="polite"></p></div>`,
      css: String.raw`#t19A .mo-f { padding: 0 14px; border-radius: 10px; }
#t19A .mo-cell { height: 46px; }
#t19A .mo-in, #t19A .mo-mir { font: inherit; font-size: 20px; line-height: 46px; font-weight: 500; font-variant-numeric: tabular-nums; color: var(--ink); }
#t19A .mo-disp { display: none; }
#t19A .mo-note { transition: none; transform: none; }`,
      js: String.raw`TL4c.mo(box, { value: 1500, min: 10, max: 50000, step: 100, plain: true, maxMsg: function (m) { return 'The most is KES ' + TLmoney(m) + '. We changed it to that.'; }, minMsg: function (m) { return 'The least is KES ' + m + '.'; } });`,
    },
    {
      k: 'C', name: 'Pick the currency, the code rolls', line: 'Duka Fresh pays farmers across East Africa. Press KES to pick another currency; type a letter to find it. The code rolls to its new name, the box springs to its new width, and the amount rolls to the same money in the new currency.',
      kind: 'Mix', from: [arc('money-input'), arc('morph-select'), house('n09')], tryit: 'Press KES and pick Ugandan shilling. Then press U again for US dollar.',
      needs: 'Script, the shared digit roll and a spring.', keys: 'Down on the code opens; letters find a currency, Enter picks. Arrows in the amount add or take 100.', off: 'The code and amount change in place.', law: 'Proximity: the currency sits right before the amount it names.',
      tags: ['motion:springy', 'speed:mid', 'open:trigger', 'feedback:clear', 'new:twist', 'look:ember'], top: true, h: 420,
      html: `<div class="mo"><label class="l-lbl" for="t19C-in">Pay Wanjiru Mwangi, farmer</label><div class="ms-wrap mo-wrap">${moField('t19C', { cur: '<button class="mo-cc" type="button" data-trig aria-haspopup="listbox" aria-controls="t19C-lb" aria-label="Currency: Kenyan shilling"><span class="mo-c" data-cur>KES</span><span class="mo-cv">' + I.chev + '</span></button>' })}<div class="mo-pop l-panel"><ul class="mo-lb" role="listbox" id="t19C-lb" tabindex="-1" aria-label="Currency"><li class="ms-hl mo-hl" aria-hidden="true" role="presentation"></li>${CUR.map(([c, n], i) => `<li role="option" id="t19C-o${i}" aria-selected="${i === 0}" class="mo-o"><span class="mo-oc">${c}</span><span>${n}</span></li>`).join('')}</ul></div></div><p class="mo-r" id="t19C-r" data-range></p><p class="mo-eq">Same as <b data-eq></b> from your PocketPay.</p><p class="mo-note" data-note aria-live="polite"></p></div>`,
      css: String.raw`#t19C .mo-wrap { position: relative; }
#t19C .mo-f { padding-left: 6px; }
#t19C .mo-cc { flex: none; display: flex; align-items: center; gap: 4px; height: 40px; padding: 0 8px; border-radius: 8px; background: rgb(var(--ink-rgb) / .05); transition: background-color .15s, transform .15s var(--ease-out); }
#t19C .mo-cc:hover { background: rgb(var(--ink-rgb) / .09); }
#t19C .mo-cc:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
#t19C .mo-cc .mo-c { color: var(--ink); font-size: 14px; }
#t19C .mo-cv { display: grid; color: var(--muted); transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#t19C .mo-cv svg { width: 13px; height: 13px; }
#t19C [aria-expanded="true"] .mo-cv { transform: rotate(180deg); }
#t19C .mo-pop { position: absolute; z-index: 5; left: 0; top: calc(100% + 6px); width: 230px; padding: 0; opacity: 0; visibility: hidden; transform: translateY(-6px) scale(.96); transform-origin: 15% 0; transition: opacity .14s var(--ease-out), transform .16s var(--ease-out), visibility 0s linear .16s; }
#t19C.is-open .mo-pop { opacity: 1; visibility: visible; transform: none; transition: opacity .18s var(--ease-out), transform var(--sp-bouncy-d) var(--sp-bouncy), visibility 0s; }
#t19C .mo-lb { position: relative; list-style: none; margin: 0; padding: 5px; outline: none; }
#t19C .mo-hl { position: absolute; z-index: 0; left: 5px; right: 5px; top: 0; height: 36px; border-radius: 8px; background: rgb(var(--ink-rgb) / .07); pointer-events: none; transition: transform var(--sp-snappy-d) var(--sp-snappy); }
#t19C .mo-lb:focus-visible .mo-hl { box-shadow: inset 0 0 0 1.5px rgb(var(--accent-rgb) / .55); }
#t19C .mo-o { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; height: 36px; padding: 0 10px; border-radius: 8px; font-size: 14px; color: var(--ink); cursor: pointer; }
#t19C .mo-o[aria-selected="true"] { font-weight: 600; }
#t19C .mo-oc { font: 500 12px/1 var(--font-mono); color: var(--muted); width: 32px; }
#t19C .mo-eq { margin: -4px 0 0; font-size: 13px; color: var(--muted); }
#t19C .mo-eq b { color: var(--ink); font-weight: 600; }`,
      js: String.raw`var L = ` + J(CUR) + String.raw`, c = 0, kes = 12000, curEl = $('[data-cur]', box), tb = $('[data-trig]', box), rg = $('[data-range]', box), cell = $('.mo-cell', box);
var line = TLline(curEl), eq = TLroll($('[data-eq]', box), { value: kes, fmt: TLkes, dur: 520, stagger: 26, live: false });
function lim(i) { var r = L[i][2]; return [Math.max(1, Math.round(50 * r)), Math.round(500000 * r)]; }
function range() { var l = lim(c); rg.textContent = 'From ' + L[c][0] + ' ' + TLmoney(l[0]) + ' to ' + L[c][0] + ' ' + TLmoney(l[1]) + '.'; }
var f = TL4c.mo(box, { value: kes, min: 50, max: 500000, step: 100, cur: function () { return L[c][0]; },
  maxMsg: function (m, k) { return 'The most for one payment is ' + k + ' ' + TLmoney(m) + '.'; }, minMsg: function (m, k) { return 'The least is ' + k + ' ' + TLmoney(m) + '.'; },
  on: function (n) { kes = Math.round(n / L[c][2]); eq.set(kes); }, onType: function (n) { if (n != null) eq.set(Math.round(n / L[c][2]), { instant: true }); } });
range();
TLb.lb(box, { sel: 0, items: L, pick: function (i, from) { if (i === from) return;
  TLb.flip([cell], function () { line.set(L[i][0], i > from ? 1 : -1); });
  c = i; var l = lim(i); f.limits(l[0], l[1]); range(); tb.setAttribute('aria-label', 'Currency: ' + L[i][1]);
  var k0 = kes; f.show(Math.min(l[1], Math.max(l[0], Math.round(k0 * L[i][2]))), { dir: i > from ? 'up' : 'down' }); kes = k0; eq.set(kes); } });`,
    },
    {
      k: 'D', name: 'Your chips field, with a keypad', line: 'Round 3\'s money field, pushed into a till keypad. Each digit you tap drops into place and the amount slides over to make room. Backspace lifts the last digit away. Too much and the key you pressed shakes while the amount kicks back. The amount shrinks to fit as it grows.',
      kind: 'Reference, pushed', from: [arc('money-input'), house('n29')], tryit: 'Tap 7, 5, 0, 0, then 00 twice. Or click the amount and type on your keyboard.',
      needs: 'Script and a spring.', keys: 'Click the amount, then type digits; Backspace takes one off. Tab to the keys.', off: 'Digits appear and leave at once; no kick. The limit words still show.', law: 'Fitts: big keys under your thumb, like a till.',
      tags: ['motion:springy', 'speed:quick', 'feedback:loud', 'new:novel', 'look:ember'], h: 520,
      html: `<div class="mo kp"><p class="kp-cap">Pay Duka Fresh Westlands <span>· Till 482 913</span></p><div class="kp-amt" data-amt tabindex="0" role="group" aria-label="Amount. Type digits; Backspace takes one off." aria-describedby="t19D-r"><span class="mo-c">KES</span><span class="mo-cell" data-cell><span class="mo-fit kp-fit" data-fit><span class="kp-chars" data-chars></span></span><span class="mo-mir" data-mir aria-hidden="true"></span></span><span class="sr" data-sr aria-live="polite"></span></div><p class="mo-r" id="t19D-r" data-range>Up to KES 70,000 a payment.</p><div class="kp-pad" role="group" aria-label="Keypad">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0'].map((k) => `<button class="kp-k" type="button" data-k="${k}">${k}</button>`).join('')}<button class="kp-k" type="button" data-k="del" aria-label="Take off the last digit">${I.del}</button></div><div class="mo-go"><button class="l-btn pri" type="button" data-pay>Pay</button><span class="l-muted" data-msg aria-live="polite"></span></div><p class="mo-note" data-note aria-live="polite"></p></div>`,
      css: String.raw`#t19D .kp { gap: 8px; }
#t19D .kp-cap { margin: 0; font-size: 13.5px; font-weight: 600; color: var(--ink); }
#t19D .kp-cap span { font-weight: 400; color: var(--muted); }
#t19D .kp-amt { display: flex; align-items: center; gap: 10px; padding: 4px 14px; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line-hi); outline: none; transition: border-color .2s, box-shadow .2s; }
#t19D .kp-amt:focus-visible { border-color: var(--accent); box-shadow: 0 0 0 3px rgb(var(--accent-rgb) / .15); }
#t19D .kp-chars { display: inline-flex; font: 500 52px/64px var(--font-num); font-variant-numeric: tabular-nums; color: var(--ink); white-space: pre; }
#t19D .kp-chars span { display: inline-block; }
#t19D .kp-chars .z { color: var(--dim); }
#t19D .kp-gh { position: absolute; top: 0; font: 500 52px/64px var(--font-num); color: var(--ink); pointer-events: none; }
#t19D .kp-pad { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
#t19D .kp-k { height: 46px; display: grid; place-items: center; border-radius: 10px; border: 1px solid var(--line); background: var(--paper-raised); color: var(--ink); font: 500 20px/1 var(--font-num); box-shadow: var(--shadow-sm); touch-action: manipulation; transition: transform .12s var(--ease-out), background-color .15s; }
#t19D .kp-k:hover { background: color-mix(in srgb, var(--paper-raised) 92%, var(--ink)); }
#t19D .kp-k:active { transform: scale(.95); }
#t19D .kp-k:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
#t19D .kp-k svg { width: 20px; height: 20px; }
@media (max-width: 400px) { #t19D .kp-chars, #t19D .kp-gh { font-size: 44px; } }`,
      js: String.raw`var C = TL4c, amt = $('[data-amt]', box), ch = $('[data-chars]', box), sr = $('[data-sr]', box), rg = $('[data-range]', box), note = $('[data-note]', box), msg = $('[data-msg]', box), v = 0, MAX = 70000, strain = 0, sT = 0;
var fk = C.fitk($('[data-fit]', box), $('[data-cell]', box), $('[data-mir]', box));
function draw(add) { var s = v ? TLmoney(v) : '0'; ch.innerHTML = s.split('').map(function (x) { return '<span' + (v ? '' : ' class="z"') + '>' + x + '</span>'; }).join(''); fk.fit(s); sr.textContent = 'KES ' + s;
  if (add && moving()) { var last = ch.lastChild, sp = TLsp('snappy'); last.animate([{ transform: 'translateY(-45%) scale(.8)', opacity: 0, filter: 'blur(3px)' }, { transform: 'none', opacity: 1, filter: 'blur(0)' }], { duration: sp.d, easing: sp.e }); } }
function lift() { var last = ch.lastChild; if (!last || !moving()) return; var g = document.createElement('span'); g.className = 'kp-gh'; g.textContent = last.textContent; g.setAttribute('aria-hidden', 'true'); g.style.left = last.offsetLeft + 'px'; ch.parentNode.appendChild(g); g.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-50%)', opacity: 0, filter: 'blur(3px)' }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = function () { g.remove(); }; }
function say(t) { note.textContent = t; note.classList.remove('on'); void note.offsetWidth; note.classList.add('on'); clearTimeout(note._t); note._t = setTimeout(function () { note.classList.remove('on'); }, 2800); }
function refuse(btn) { strain = Math.min(strain + 1, 4); clearTimeout(sT); sT = setTimeout(function () { strain = 0; }, 900); fk.kick(1, strain); C.shake(btn); rg.classList.add('flash'); setTimeout(function () { rg.classList.remove('flash'); }, 1400); say('One payment can be up to KES 70,000.'); }
function press(k, btn) { msg.textContent = ''; var n;
  if (k === 'del') { if (!v) return; lift(); v = Math.floor(v / 10); draw(false); return; }
  n = k === '00' ? v * 100 : v * 10 + +k; if (n === v) return; if (n > MAX) { refuse(btn || amt); return; } v = n; draw(true); }
$$('[data-k]', box).forEach(function (b) { b.addEventListener('click', function () { press(b.getAttribute('data-k'), b); }); });
amt.addEventListener('keydown', function (e) { if (/^\d$/.test(e.key)) { e.preventDefault(); press(e.key, $('[data-k="' + e.key + '"]', box)); } else if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); press('del'); } });
amt.addEventListener('click', function () { amt.focus({ preventScroll: true }); });
$('[data-pay]', box).addEventListener('click', function () { if (!v) { say('Tap an amount first.'); C.shake(amt); return; } msg.innerHTML = TICK + 'KES ' + TLmoney(v) + ' paid to Duka Fresh.'; });
draw(false); TLb.fonts(function () { draw(false); });`,
    },
  ],
};

/* ================================================================ 20 Mention input */
const PEOPLE = [['Amina Wanjiru', 'Shop owner', 'AW', 'u1'], ['Brian Kiprop', 'Stock', 'BK', 'u2'], ['Wanjiru Mwangi', 'Front counter', 'WM', 'u3'], ['Otieno Ouma', 'Deliveries', 'OO', 'u4'], ['Njeri Kamau', 'Accounts', 'NK', 'u5'], ['Kevin Mutua', 'Deliveries', 'KM', 'u6'], ['Achieng Odhiambo', 'Stock', 'AO', 'u7']];
const ORDERS = [['4821', 'Amina Otieno · KES 4,200', '', 'o1'], ['4820', 'Brian Kiprop · KES 12,750', '', 'o2'], ['4819', 'Wanjiru Mwangi · KES 860', '', 'o3'], ['4818', 'Otieno Ouma · KES 3,400', '', 'o4']];
const SET_AT = { ch: '@', head: 'Team', items: PEOPLE, none: 'No one called “{q}” on your team.' };
const SET_HASH = { ch: '#', head: 'Orders', items: ORDERS, none: 'No order “#{q}” today.' };
const mnHtml = (id, v = {}) => `<div class="mn"><div class="mn-card" data-anchor><p class="mn-cap">Order #4822 · Njeri Kamau · <span class="l-num">KES 1,350</span></p>${v.tags ? '<div class="mn-tags"><span class="mn-tl">Will be told</span><ul class="mn-tg" data-tags aria-label="People who will be told"><li class="mn-tnone" data-tnone>No one yet</li></ul></div>' : ''}<div class="mn-shell" data-shell><div class="mn-ed" id="${id}-ed" data-ed contenteditable="true" role="combobox" aria-multiline="true" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}-lb" aria-autocomplete="list" aria-label="Note for the team" data-ph="${v.ph || 'Write a note. Type @ to tell someone.'}"></div><button class="l-ib mn-send" type="button" data-send aria-label="Send note">${I.send}</button></div><div class="mn-pop" data-pop><div class="mn-ph" data-ph><div class="mn-lw"><span class="mn-hl" data-hl aria-hidden="true"></span><ul class="mn-lb" role="listbox" id="${id}-lb" data-list aria-label="Suggestions"></ul></div></div></div><ul class="mn-feed" data-feed aria-label="Notes"><li class="mn-post"><span class="l-av mn-av" aria-hidden="true">OO</span><div><b>Otieno Ouma</b> <span class="mn-time">9:42 am</span><p>Rider is at the gate. Who has change for KES 5,000?</p></div></li></ul></div><p class="mn-note" data-note aria-live="polite">${v.hint || 'Enter sends. Shift and Enter makes a new line.'}</p></div>`;

const mention = {
  id: 'mention', n: '20', name: 'Mention input', h: 470,
  claim: 'A mention should <em>become one piece</em> the moment you pick a name.',
  lead: 'Write a note on a Duka Fresh order. Type @ and a list of your team opens right where you are typing. Pick with the arrow keys and Enter. The name becomes one piece: one Backspace takes it all away.',
  ref: { ids: 'n45', text: 'Tags that suggest: matching words open under the box, arrow keys and Enter pick, Backspace in an empty box takes the last tag away.' },
  noteHint: 'B, with C\'s orders', moreHint: 'mentions that show who has read the note',
  css: String.raw`#mention .mn { width: min(100%, 400px); display: grid; gap: 8px; text-align: left; }
#mention .mn-card { position: relative; display: grid; gap: 10px; padding: 14px; border-radius: 13px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-sm); }
#mention .mn-cap { margin: 0; font-size: 13px; font-weight: 600; color: var(--ink); }
#mention .mn-shell { display: flex; align-items: flex-end; gap: 6px; padding: 4px 4px 4px 12px; border-radius: 10px; border: 1px solid var(--line-hi); background: var(--paper); overflow: hidden; transition: border-color .2s, box-shadow .2s; }
#mention .mn-shell:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgb(var(--accent-rgb) / .15); }
#mention .mn-ed { flex: 1; min-width: 0; min-height: 22px; padding: 7px 0; font-size: 14.5px; line-height: 22px; color: var(--ink); outline: none; white-space: pre-wrap; overflow-wrap: anywhere; }
#mention .mn-ed:empty::before { content: attr(data-ph); color: var(--muted); pointer-events: none; }
#mention .mn-send { flex: none; width: 36px; height: 36px; border-radius: 8px; }
#mention .mn-tok { display: inline-block; padding: 0 5px; margin: 0 1px; border-radius: 6px; background: rgb(var(--accent-rgb) / .12); color: var(--accent-text); font-weight: 600; line-height: 21px; white-space: nowrap; }
#mention .mn-tok.is-hash { background: rgb(var(--ink-rgb) / .08); color: var(--ink); font-family: var(--font-mono); font-size: 13px; font-weight: 500; }
#mention .mn-tok.is-new { animation: mnPop var(--sp-snappy-d) var(--sp-snappy); }
@keyframes mnPop { from { transform: scale(.6); opacity: 0; } }
#mention .mn-pop { position: absolute; z-index: 5; left: 14px; top: 90px; width: 250px; max-width: calc(100% - 28px); border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-lg); visibility: hidden; }
#mention .mn-open .mn-pop { visibility: visible; }
#mention .mn-ph { overflow: hidden; }
#mention .mn-lw { position: relative; padding: 5px; }
#mention .mn-lb { list-style: none; margin: 0; padding: 0; }
#mention .mn-hl { position: absolute; z-index: 0; left: 5px; right: 5px; top: 0; height: 42px; border-radius: 8px; background: rgb(var(--ink-rgb) / .07); pointer-events: none; opacity: 0; transition: transform var(--sp-snappy-d) var(--sp-snappy), opacity .15s; }
#mention .mn-gh { font: 500 10.5px/1 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); padding: 8px 8px 6px; }
#mention .mn-o { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; height: 42px; padding: 0 8px; border-radius: 8px; cursor: pointer; -webkit-user-select: none; user-select: none; }
#mention .mn-av { width: 28px; height: 28px; flex-basis: 28px; font-size: 11px; }
#mention .mn-hash { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 8px; background: rgb(var(--ink-rgb) / .07); font: 600 13px/1 var(--font-mono); color: var(--ink-soft); }
#mention .mn-l { display: grid; line-height: 1.2; min-width: 0; }
#mention .mn-l b { font-size: 14px; font-weight: 500; color: var(--ink); }
#mention .mn-l b mark { background: none; color: var(--accent-text); font-weight: 700; }
#mention .mn-l small { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#mention .mn-none { padding: 12px 8px; font-size: 13px; color: var(--muted); }
#mention .mn-feed { list-style: none; margin: 0; padding: 0; display: grid; overflow: hidden; }
#mention .mn-post { display: flex; gap: 10px; padding: 10px 0 2px; border-top: 1px solid var(--line); }
#mention .mn-post b { font-size: 13px; font-weight: 600; color: var(--ink); }
#mention .mn-time { font-size: 12px; color: var(--muted); }
#mention .mn-post p { margin: 2px 0 0; font-size: 14px; color: var(--ink-soft); line-height: 1.5; }
#mention .mn-note { margin: 0; padding: 0 4px; font-size: 13px; color: var(--muted); min-height: 1.4em; }
@media (pointer: coarse) { #mention .mn-o { height: 46px; } }`,
  js: String.raw`/* ---- mentions: @ (and #) open a list at the caret; a pick becomes one token ---- */
TL4c.men = function (box, o) {
  var C = TL4c, ed = $('[data-ed]', box), pop = $('[data-pop]', box), list = $('[data-list]', box), hl = $('[data-hl]', box), ph = $('[data-ph]', box), shell = $('[data-shell]', box), anchor = $('[data-anchor]', box), feed = $('[data-feed]', box), note = $('[data-note]', box);
  var S = {}, trig = null, act = -1, rows = [], shown = [], dismissed = null, lastH = shell.offsetHeight, isOpen = false, id = ed.id;
  o.sets.forEach(function (s) { S[s.ch] = s; });
  function say(t) { if (note) note.textContent = t; }
  function ctx() {
    var sel = getSelection(); if (!sel.rangeCount || !sel.isCollapsed) return null; var n = sel.anchorNode, off = sel.anchorOffset;
    if (!n || n.nodeType !== 3 || !ed.contains(n)) return null; var s = n.data.slice(0, off);
    for (var i = s.length - 1; i >= 0 && i >= s.length - 18; i--) { var ch = s.charAt(i);
      if (S[ch]) { var pre = i ? s.charAt(i - 1) : ''; if (pre && !/[\s( ]/.test(pre)) return null; var q = s.slice(i + 1); return /^[A-Za-z0-9]*$/.test(q) ? { node: n, at: i, end: off, ch: ch, q: q } : null; }
      if (/[\s ]/.test(ch)) return null; }
    return null;
  }
  function match(set, q) { q = q.toLowerCase(); return set.items.filter(function (it) { return !q || it[0].toLowerCase().split(/\s+/).some(function (w) { return w.indexOf(q) === 0; }); }).slice(0, 5); }
  function row(it, set, q, n) { return '<li role="option" aria-selected="false" id="' + id + '-o' + n + '" class="mn-o">' + (set.ch === '@' ? '<span class="l-av mn-av" aria-hidden="true">' + it[2] + '</span>' : '<span class="mn-hash" aria-hidden="true">#</span>') + '<span class="mn-l"><b>' + C.mark(it[0], q) + '</b><small>' + C.esc(it[1]) + '</small></span></li>'; }
  function place(c) {
    if (o.below) { pop.style.left = shell.offsetLeft + 'px'; pop.style.top = shell.offsetTop + shell.offsetHeight + 6 + 'px'; pop.style.width = shell.offsetWidth + 'px'; pop.style.maxWidth = 'none'; return; }
    var r = document.createRange(); r.setStart(c.node, c.at); r.setEnd(c.node, c.at + 1); var b = r.getBoundingClientRect(), a = anchor.getBoundingClientRect();
    var x = b.left - a.left - 12, mx = anchor.clientWidth - pop.offsetWidth - 6, px = Math.max(6, Math.min(mx, x));
    pop.style.left = px + 'px'; pop.style.top = (b.bottom - a.top + 8) + 'px'; pop.style.transformOrigin = (b.left - a.left - px + 6) + 'px 0';
  }
  function close() { if (!isOpen) return; isOpen = false; trig = null; box.classList.remove('mn-open'); ed.setAttribute('aria-expanded', 'false'); ed.removeAttribute('aria-activedescendant'); }
  function mark(i, jump) { if (!rows.length) { act = -1; C.hl(hl, null); ed.removeAttribute('aria-activedescendant'); return; } act = (i + rows.length) % rows.length; rows.forEach(function (r, j) { if (j === act) r.setAttribute('data-on', ''); else r.removeAttribute('data-on'); r.setAttribute('aria-selected', String(j === act)); }); ed.setAttribute('aria-activedescendant', rows[act].id); C.hl(hl, rows[act], jump); }
  function update() {
    var c = ctx();
    if (!c || (dismissed && dismissed.node === c.node && dismissed.at === c.at)) { close(); return; }
    dismissed = null; var set = S[c.ch], m = match(set, c.q), h0 = ph.offsetHeight, was = isOpen; trig = c; shown = m;
    list.innerHTML = (o.heads ? '<li class="mn-gh" role="presentation">' + set.head + '</li>' : '') + (m.length ? m.map(function (it, i) { return row(it, set, c.q, i); }).join('') : '<li class="mn-none" role="presentation">' + set.none.replace('{q}', C.esc(c.q)) + '</li>');
    rows = $$('[role="option"]', list);
    if (!was || pop._n !== c.node || pop._a !== c.at) { pop._n = c.node; pop._a = c.at; place(c); }
    if (!was) { isOpen = true; box.classList.add('mn-open'); ed.setAttribute('aria-expanded', 'true'); }
    mark(0, !was); if (was) C.glide(ph, h0, 'snappy');
  }
  function grow() {
    if (!ed.textContent.replace(/ /g, ' ').trim() && !$('.mn-tok', ed) && ed.innerHTML) ed.innerHTML = '';
    if (shell._gl) { shell._gl.cancel(); shell._gl = null; } var h1 = shell.offsetHeight;
    if (h1 !== lastH) { var h0 = lastH; lastH = h1; if (moving()) { var s = TLsp('snappy'); shell._gl = shell.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: s.d, easing: s.e }); } }
  }
  function caretAt(node, off) { var r = document.createRange(); r.setStart(node, off); r.collapse(true); var sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
  function pick(i) {
    var it = shown[i], c = trig; if (!it || !c) return; var set = S[c.ch];
    var r = document.createRange(); r.setStart(c.node, c.at); r.setEnd(c.node, c.end); r.deleteContents();
    var t = document.createElement('span'); t.className = 'mn-tok' + (c.ch === '#' ? ' is-hash' : ''); t.contentEditable = 'false'; t.setAttribute('data-id', it[3]); t.setAttribute('data-ch', c.ch); t.textContent = c.ch + it[0];
    var sp = document.createTextNode(' '); r.insertNode(sp); r.insertNode(t); caretAt(sp, 1);
    if (moving()) { t.classList.add('is-new'); setTimeout(function () { t.classList.remove('is-new'); }, 600); }
    close(); grow(); if (o.onAdd) o.onAdd(it, set); say(c.ch === '@' ? it[0] + ' will be told when you send.' : 'Linked order #' + it[0] + '.');
  }
  function prevTok() { var sel = getSelection(); if (!sel.rangeCount || !sel.isCollapsed) return null; var n = sel.anchorNode, off = sel.anchorOffset, prev = null;
    if (n === ed) prev = ed.childNodes[off - 1]; else if (n.nodeType === 3 && off === 0) prev = n.previousSibling;
    while (prev && prev.nodeType === 3 && !prev.data) prev = prev.previousSibling;
    return prev && prev.nodeType === 1 && prev.classList.contains('mn-tok') ? prev : null; }
  function removeTok(t) { var tid = t.getAttribute('data-id'), par = t.parentNode, idx = [].indexOf.call(par.childNodes, t); t.remove(); caretAt(par, Math.min(idx, par.childNodes.length)); grow(); if (o.onRemove) o.onRemove(tid, t); say('Took out ' + t.textContent + '.'); }
  function ser(node) { var h = ''; node.childNodes.forEach(function (n) { if (n.nodeType === 3) h += C.esc(n.data.replace(/ /g, ' ')); else if (n.classList && n.classList.contains('mn-tok')) h += '<span class="' + n.className.replace(' is-new', '') + '">' + C.esc(n.textContent) + '</span>'; else if (n.nodeName === 'BR') h += '<br>'; else h += '<br>' + ser(n); }); return h; }
  function names(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
  function post() {
    var toks = $$('.mn-tok', ed), text = ed.textContent.replace(/ /g, ' ').trim();
    if (!text) { C.shake(shell); say('Write a note first. Type @ to tell someone.'); ed.focus(); return; }
    var li = document.createElement('li'); li.className = 'mn-post'; li.innerHTML = '<span class="l-av mn-av" aria-hidden="true">AW</span><div><b>Amina Wanjiru</b> <span class="mn-time">now</span><p>' + ser(ed).replace(/^(<br>)+|(<br>)+$/g, '') + '</p></div>';
    var h0 = feed.offsetHeight; feed.insertBefore(li, feed.firstChild); while (feed.children.length > 2) feed.removeChild(feed.lastChild); C.glide(feed, h0, 'soft');
    if (moving()) li.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
    var ppl = []; toks.forEach(function (t) { if (t.getAttribute('data-ch') === '@') { var n = t.textContent.slice(1); if (ppl.indexOf(n) < 0) ppl.push(n); } });
    say(ppl.length ? 'Sent. ' + names(ppl) + ' will get a message.' : 'Sent. You named no one, so no one gets a message.');
    ed.innerHTML = ''; close(); grow(); if (o.onPost) o.onPost();
  }
  ed.addEventListener('keydown', function (e) {
    var k = e.key;
    if (isOpen) {
      if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); if (rows.length) mark(act + (k === 'ArrowDown' ? 1 : -1)); return; }
      if ((k === 'Enter' || k === 'Tab') && act >= 0) { e.preventDefault(); pick(act); return; }
      if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); dismissed = { node: trig.node, at: trig.at }; close(); return; }
    }
    if (k === 'Backspace') { var p = prevTok(); if (p) { e.preventDefault(); removeTok(p); } return; }
    if (k === 'Enter') { e.preventDefault(); if (e.shiftKey) document.execCommand('insertLineBreak'); else post(); }
  });
  ed.addEventListener('input', function () { update(); grow(); });
  ed.addEventListener('keyup', function (e) { if (/^(Arrow(Left|Right)|Home|End)$/.test(e.key)) update(); });
  ed.addEventListener('pointerup', function () { setTimeout(update, 0); });
  ed.addEventListener('paste', function (e) { e.preventDefault(); var t = (e.clipboardData || window.clipboardData).getData('text/plain'); document.execCommand('insertText', false, t); });
  ed.addEventListener('blur', function () { setTimeout(function () { if (document.activeElement !== ed) close(); }, 0); });
  pop.addEventListener('pointerdown', function (e) { e.preventDefault(); });
  pop.addEventListener('pointermove', function (e) { var t = e.target.closest && e.target.closest('[role="option"]'); if (t) { var j = rows.indexOf(t); if (j !== act) mark(j); } });
  pop.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[role="option"]'); if (t) pick(rows.indexOf(t)); });
  $('[data-send]', box).addEventListener('click', post);
  return { ed: ed, removeId: function (tid) { $$('.mn-tok', ed).forEach(function (t) { if (t.getAttribute('data-id') === tid) t.remove(); }); grow(); }, say: say };
};`,
  opts: [
    {
      k: 'B', name: 'The list pops up at your caret', line: 'Type @ and a small list of your team pops out from that very spot, on a spring. As you type more letters it glides to fit the names that are left, and one highlight glides between them. The name you pick springs in as one piece.',
      from: [arc('mention-input'), house('n45')], tryit: 'Type "Can @ki" and press Enter. Then press Backspace twice.',
      needs: 'Script and CSS springs.', keys: 'Arrows move, Enter or Tab picks, Escape closes the list. One Backspace takes a whole name away. Enter sends; Shift and Enter makes a new line.', off: 'The list and the names show at once; the field jumps to its new height.', law: 'Proximity: the list opens right where your eyes already are.',
      tags: ['motion:springy', 'speed:mid', 'open:trigger', 'feedback:clear', 'new:twist', 'look:ember'], top: true,
      html: mnHtml('t20B'),
      css: String.raw`#t20B .mn-pop { opacity: 0; transform: translateY(-4px) scale(.92); transition: opacity .12s var(--ease-out), transform .14s var(--ease-out), visibility 0s linear .14s; }
#t20B.mn-open .mn-pop { opacity: 1; transform: none; transition: opacity .16s var(--ease-out), transform var(--sp-bouncy-d) var(--sp-bouncy), visibility 0s; }`,
      js: `TL4c.men(box, { sets: [${J(SET_AT)}] });`,
    },
    {
      k: 'A', name: 'A plain list under the box', line: 'The plain way. Type @ and a list opens under the whole box, not at the caret. The row under the pointer turns grey. Names become one piece, with no motion.',
      from: [sh('textarea', 'shadcn/ui textarea'), arc('mention-input')], tryit: 'Type @nj and press Enter.',
      needs: 'Script for the keys.', keys: 'Same as B.', off: 'Same.', law: 'Jakob: like the list under a search box.',
      tags: ['motion:still', 'speed:quick', 'open:trigger', 'feedback:quiet', 'new:familiar', 'look:ember'], top: true,
      html: mnHtml('t20A'),
      css: String.raw`#t20A .mn-hl { display: none; }
#t20A .mn-o[data-on] { background: rgb(var(--ink-rgb) / .07); }`,
      js: `TL4c.men(box, { sets: [${J(SET_AT)}], below: true });`,
    },
    {
      k: 'C', name: '@ for people, # for orders', line: 'Two kinds of mention. @ opens your team, # opens today\'s orders. Each list has its own heading, and each kind of piece its own look: people in orange, orders in plain type.',
      kind: 'Mix', from: [arc('mention-input'), house('n45')], tryit: 'Type "@br see #48" and pick with Enter each time.',
      needs: 'Script and CSS springs.', keys: 'Same as B.', off: 'The list and the pieces show at once.', law: 'Hick: each sign opens only its own short list.',
      tags: ['motion:springy', 'speed:mid', 'open:trigger', 'feedback:clear', 'new:twist', 'look:ember'], top: true,
      html: mnHtml('t20C', { ph: 'Write a note. @ tells someone, # links an order.', hint: '@ for people, # for orders. Enter sends.' }),
      css: String.raw`#t20C .mn-pop { opacity: 0; transform: translateY(-4px) scale(.94); transition: opacity .12s var(--ease-out), transform .14s var(--ease-out), visibility 0s linear .14s; }
#t20C.mn-open .mn-pop { opacity: 1; transform: none; transition: opacity .16s var(--ease-out), transform var(--sp-snappy-d) var(--sp-snappy), visibility 0s; }`,
      js: `TL4c.men(box, { sets: [${J(SET_AT)}, ${J(SET_HASH)}], heads: true });`,
    },
    {
      k: 'D', name: 'Your n45 tags, kept in step with the note', line: 'Your n45 tags, pushed. Everyone you mention also shows as a tag above the note, under "Will be told". Take a name out of the note and its tag leaves; press the cross on a tag and the name leaves the note.',
      kind: 'Reference, pushed', from: [house('n45'), arc('mention-input'), arc('tag-input')], tryit: 'Mention Otieno and Njeri, then press the cross on Otieno\'s tag.',
      needs: 'Script and CSS springs.', keys: 'Same as B. Tab reaches each tag\'s cross.', off: 'Tags appear and leave at once.', law: 'Proximity: who will be told sits right above what they will read.',
      tags: ['motion:springy', 'speed:mid', 'open:trigger', 'feedback:clear', 'new:twist', 'look:ember'], top: true, h: 510,
      html: mnHtml('t20D', { tags: true }),
      css: String.raw`#t20D .mn-pop { opacity: 0; transform: translateY(-4px) scale(.92); transition: opacity .12s var(--ease-out), transform .14s var(--ease-out), visibility 0s linear .14s; }
#t20D.mn-open .mn-pop { opacity: 1; transform: none; transition: opacity .16s var(--ease-out), transform var(--sp-bouncy-d) var(--sp-bouncy), visibility 0s; }
#t20D .mn-tags { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-height: 28px; }
#t20D .mn-tl { font: 500 10.5px/1 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
#t20D .mn-tg { list-style: none; margin: 0; padding: 0; display: flex; gap: 6px; flex-wrap: wrap; }
#t20D .mn-tg li { display: inline-flex; align-items: center; gap: 4px; height: 28px; padding: 0 4px 0 10px; border-radius: 999px; background: rgb(var(--ink-rgb) / .07); font-size: 13px; color: var(--ink); }
#t20D .mn-tg li.mn-tnone { padding: 0; background: none; color: var(--muted); }
#t20D .mn-tg li[hidden] { display: none; }
#t20D .mn-tg button { width: 22px; height: 22px; display: grid; place-items: center; border-radius: 50%; color: var(--muted); }
#t20D .mn-tg button:hover { background: rgb(var(--ink-rgb) / .08); color: var(--ink); }
#t20D .mn-tg button:focus-visible { outline: 2px solid var(--accent); outline-offset: 0; }
#t20D .mn-tg svg { width: 12px; height: 12px; }`,
      js: String.raw`var tg = $('[data-tags]', box), none = $('[data-tnone]', box), api;
function tagOf(tid) { return $('[data-tid="' + tid + '"]', tg); }
function sync() { none.hidden = !!$('[data-tid]', tg); }
function drop(li) { li.removeAttribute('data-tid'); sync(); if (!moving()) { li.remove(); sync(); return; } li.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.7)' }], { duration: 160, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = function () { li.remove(); sync(); }; }
api = TL4c.men(box, { sets: [` + J(SET_AT) + String.raw`],
  onAdd: function (it) { if (tagOf(it[3])) return; var li = document.createElement('li'); li.setAttribute('data-tid', it[3]); li.innerHTML = '<span>' + TL4c.esc(it[0]) + '</span><button type="button" aria-label="Do not tell ' + TL4c.esc(it[0]) + '">` + I.x + String.raw`</button>'; tg.appendChild(li); sync();
    if (moving()) { var s = TLsp('snappy'); li.animate([{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: s.d, easing: s.e }); }
    $('button', li).addEventListener('click', function () { api.removeId(it[3]); drop(li); api.say(it[0] + ' will not be told.'); api.ed.focus({ preventScroll: true }); }); },
  onRemove: function (tid) { if (!$('.mn-tok[data-id="' + tid + '"]', box)) { var li = tagOf(tid); if (li) drop(li); } },
  onPost: function () { $$('[data-tid]', tg).forEach(drop); } });`,
    },
  ],
};

export default [usermenu, expsearch, inlineedit, phone, money, mention];
