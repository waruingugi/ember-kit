// Round 4, batch e: layout and status. Breadcrumb, expandable card, toast stack, stepper, onboarding checklist.
// Ideas from Arc's free parts (uiarc.dev, MIT), rebuilt in plain script and the ember look.
// Shared helpers this batch adds (set in the first part's js): TL4i (icons), TL4glide (a height glide),
// TL4fold / TL4unfold (a row that closes or opens all the way: height, padding and margin together).
// Numbers roll with TLroll (round 3).
import { arc, house, sh, skill } from '../src-links.mjs';

const SHOW = '../../components/showcase/index.html';
const sv = (d, w = 1.6) => `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const I = {
  chev: sv('m6 3.8 4.2 4.2L6 12.2'), down: sv('m4.5 6.5 3.5 3.5 3.5-3.5'), x: sv('M4.5 4.5l7 7M11.5 4.5l-7 7'),
  folder: sv('M2 4.2h4.2l1.4 1.6H14v6.6H2z', 1.4), phone: sv('M5.2 2.5h-1.4a1.3 1.3 0 0 0-1.3 1.4c.4 5 4.6 9.2 9.6 9.6a1.3 1.3 0 0 0 1.4-1.3v-1.4l-2.6-1.1-1.3 1.3a7 7 0 0 1-3.4-3.4l1.3-1.3z', 1.4),
  archive: sv('M2.5 3.5h11v3h-11zM3.5 6.5v6h9v-6M6.5 9h3', 1.4), back: sv('m9.8 3.8-4.2 4.2 4.2 4.2'),
};
// the done tick for a 34 px circle; the stroke draws in through stroke-dashoffset
const TK34 = '<svg class="tk" viewBox="0 0 34 34" aria-hidden="true"><path d="M11.2 17.6l4 4 7.6-8.4"/></svg>';
const FAIL = '<svg class="l-tick l-fail" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="11"/><path d="M7.6 7.6l6.8 6.8M14.4 7.6l-6.8 6.8"/></svg>';

/* ================= 27 Breadcrumb ================= */
const bcHtml = (extra = '') => `<div class="bc" data-bc>${extra}<div class="bc-bar" data-bar><nav class="bc-nav" data-nav aria-label="Folder path"><span class="bc-hp" data-hp aria-hidden="true"></span><ol class="bc-ol" data-ol></ol></nav><div class="bc-menu l-panel l-pop" data-menu role="menu" aria-label="Hidden folders"></div></div><div class="bc-body"><p class="bc-h" data-here tabindex="-1"></p><ul class="bc-kids" data-kids></ul></div><p class="bc-say" data-say aria-live="polite"></p></div>`;

const bcCss = String.raw`
#breadcrumb .stage { place-items: start center; padding-top: 22px; }
#breadcrumb .bc { width: 100%; display: grid; grid-template-columns: minmax(0, 1fr); gap: 14px; text-align: left; }
#breadcrumb .bc-bar { position: relative; justify-self: start; min-width: 0; width: 100%; max-width: 100%; padding: 6px; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-sm); }
#breadcrumb .bc-nav { position: relative; }
#breadcrumb .bc-ol { position: relative; z-index: 1; list-style: none; margin: 0; padding: 0; display: flex; align-items: center; min-width: 0; }
#breadcrumb .bc-ol.is-wrap { flex-wrap: wrap; row-gap: 2px; }
#breadcrumb .bc-c { display: flex; align-items: center; flex: none; min-width: 0; }
#breadcrumb .bc-c[data-k="cur"] { flex: 0 1 auto; }
#breadcrumb .bc-ol.is-measure .bc-c { flex-shrink: 0; }
#breadcrumb .bc-c:first-child .bc-sp { display: none; }
#breadcrumb .bc-sp { width: 14px; flex: none; display: grid; place-items: center; color: var(--dim); }
#breadcrumb .bc-sp svg { width: 12px; height: 12px; }
#breadcrumb .bc-lk { display: inline-flex; align-items: center; gap: 4px; height: 32px; padding: 0 8px; border-radius: 8px; font-size: 14px; color: var(--muted); white-space: nowrap; text-decoration: none; background: none; background-image: none; transition: color .15s, background-color .15s; }
#breadcrumb .bc-lk:hover { color: var(--ink); }
#breadcrumb .bc-lk:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
#breadcrumb .bc-more { color: var(--ink-soft); font-weight: 600; letter-spacing: .08em; }
#breadcrumb .bc-more[aria-expanded="true"] { color: var(--ink); background: rgb(var(--ink-rgb) / .07); }
#breadcrumb .bc-hc { display: inline-grid; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px; place-items: center; font: 600 11px/18px var(--font-body); letter-spacing: 0; color: var(--ink-soft); background: rgb(var(--ink-rgb) / .08); }
#breadcrumb .bc-cur { display: inline-flex; align-items: center; min-width: 4.5em; height: 32px; padding: 0 8px; font-size: 14px; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; }
#breadcrumb .bc-cur .tll { min-width: 0; }
#breadcrumb .bc-cur .tll > span { overflow: hidden; text-overflow: ellipsis; }
#breadcrumb .bc-hp { position: absolute; z-index: 0; left: 0; top: 0; width: 0; height: 32px; border-radius: 8px; background: rgb(var(--ink-rgb) / .07); opacity: 0; pointer-events: none; transition: transform var(--sp-snappy-d) var(--sp-snappy), width var(--sp-snappy-d) var(--sp-snappy), opacity .15s var(--ease-out); }
#breadcrumb .bc-ghost { position: absolute; z-index: 1; pointer-events: none; margin: 0; }
#breadcrumb .bc-menu { position: absolute; z-index: 6; top: calc(100% + 6px); left: 0; min-width: 196px; max-width: calc(100% - 4px); transform-origin: top left; --from: translateY(-6px) scale(.97); }
#breadcrumb .bc-menu .l-item { min-height: 36px; }
#breadcrumb .bc-menu .l-item svg { color: var(--dim); }
#breadcrumb .bc-body { display: grid; gap: 8px; }
#breadcrumb .bc-h { margin: 0; font: 500 11px/1.3 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
#breadcrumb .bc-h:focus { outline: none; }
#breadcrumb .bc-h:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 4px; }
#breadcrumb .bc-kids { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
#breadcrumb .bc-kid { width: 100%; display: flex; align-items: center; gap: 10px; min-height: 42px; padding: 0 12px; border-radius: 10px; border: 1px solid var(--line); background: var(--paper-raised); font-size: 14px; color: var(--ink); text-align: left; transition: transform .15s var(--ease-out), border-color .2s; }
#breadcrumb .bc-kid:hover { border-color: rgb(var(--ink-rgb) / .3); }
#breadcrumb .bc-kid:active { transform: scale(.97); }
#breadcrumb .bc-kid svg { width: 15px; height: 15px; flex: none; color: var(--muted); }
#breadcrumb .bc-kid span { flex: 1; min-width: 0; }
#breadcrumb .bc-kid small { font-size: 12.5px; color: var(--muted); }
#breadcrumb .bc-leaf { padding: 12px 14px; border-radius: 10px; background: var(--paper-sunk); font-size: 13.5px; color: var(--ink-soft); }
#breadcrumb .bc-say { margin: 0; min-height: 1.4em; font-size: 12.5px; color: var(--muted); }
#breadcrumb .bc-rg { display: flex; align-items: center; gap: 10px; font-size: 12.5px; color: var(--muted); }
#breadcrumb .bc-rg input { flex: 1; max-width: 220px; accent-color: var(--accent); }
@media (pointer: coarse) { #breadcrumb .bc-lk, #breadcrumb .bc-cur { height: 40px; } #breadcrumb .bc-kid { min-height: 46px; } }`;

const bcJs = String.raw`
/* ===== round 4 batch e: shared helpers ===== */
window.TL4i = ${JSON.stringify(I)};
/* glide a box from the height it had (h0) to the height it has now */
window.TL4glide = function (el, h0, d, ease) {
  if (el._g) el._g.cancel(); var h1 = el.offsetHeight;
  if (!moving() || Math.abs(h0 - h1) < 1) return null;
  el._g = el.animate([{ height: h0 + 'px', overflow: 'clip' }, { height: h1 + 'px', overflow: 'clip' }], { duration: d || 380, easing: ease || 'cubic-bezier(.22,1,.36,1)' });
  el._g.onfinish = function () { el._g = null; };
  return el._g;
};
/* close a row all the way (height, padding and margin together), then call done */
window.TL4fold = function (el, done, d) {
  if (!moving()) { done(); return; }
  var cs = getComputedStyle(el), h = el.offsetHeight;
  var a = el.animate([{ height: h + 'px', paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, marginTop: cs.marginTop, marginBottom: cs.marginBottom, opacity: 1, overflow: 'clip' },
    { height: '0px', paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '0px', opacity: 0, overflow: 'clip' }], { duration: d || 340, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
  a.onfinish = function () { done(); a.cancel(); };
};
/* the reverse: a row grows back open */
window.TL4unfold = function (el, d) {
  if (!moving()) return;
  var cs = getComputedStyle(el), h = el.offsetHeight;
  el.animate([{ height: '0px', paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '0px', opacity: 0, overflow: 'clip' },
    { height: h + 'px', paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, marginTop: cs.marginTop, marginBottom: cs.marginBottom, opacity: 1, overflow: 'clip' }], { duration: d || 380, easing: 'cubic-bezier(.22,1,.36,1)' });
};

/* ----- 27 breadcrumb engine ----- */
window.TL4crumb = function (box, c) {
  c = c || {};
  var TREE = { Home: ['Duka Fresh', 'Mawimbi Mobile'], 'Duka Fresh': ['Branches', 'Staff', 'Payouts'], 'Mawimbi Mobile': ['Branches', 'Payouts'], Branches: ['Westlands', 'Karen', 'Thika Road'], Westlands: ['Orders', 'Stock'], Karen: ['Orders', 'Stock'], 'Thika Road': ['Orders', 'Stock'], Orders: ['2026', '2025'], '2026': ['November', 'October', 'September'], '2025': ['December', 'November'] };
  var LEAF = { November: 48, October: 112, September: 96, December: 131, Stock: 37, Staff: 6, Payouts: 14 };
  var path = ['Home', 'Duka Fresh', 'Branches', 'Westlands', 'Orders', '2026', 'November'];
  var bar = $('[data-bar]', box), navEl = $('[data-nav]', box), ol = $('[data-ol]', box), hp = $('[data-hp]', box), here = $('[data-here]', box), kidsEl = $('[data-kids]', box), say = $('[data-say]', box), menu = $('[data-menu]', box);
  var CH = '<span class="bc-sp" aria-hidden="true">' + TL4i.chev + '</span>', els = {}, expanded = false, built = false, hidIdx = [], pm = null, shown = false, foldT = 0;
  var anim = !c.plain;
  function mkLink(k, n, i) { var li = document.createElement('li'); li.className = 'bc-c'; li.setAttribute('data-k', k); li.innerHTML = CH + '<a class="bc-lk" href="#" data-i="' + i + '"></a>'; $('a', li).textContent = n; return li; }
  var curLi = document.createElement('li'); curLi.className = 'bc-c'; curLi.setAttribute('data-k', 'cur');
  curLi.innerHTML = CH + '<span class="bc-cur" aria-current="page"><span data-cl></span></span>';
  var cl = $('[data-cl]', curLi); cl.textContent = path[path.length - 1];
  var line = anim ? TLline(cl) : null;
  var moreLi = document.createElement('li'); moreLi.className = 'bc-c'; moreLi.setAttribute('data-k', 'more');
  moreLi.innerHTML = CH + '<button class="bc-lk bc-more" type="button"' + (c.fold === 'inline' ? ' aria-expanded="false"' : ' aria-haspopup="menu"') + '><span aria-hidden="true">…</span>' + (c.count ? '<span class="bc-hc" data-hc></span>' : '') + '</button>';
  var moreBtn = $('button', moreLi), hc = c.count ? TLroll($('[data-hc]', moreLi), { value: 0, dur: 480, live: false }) : null;
  function vis() { return $$('.bc-c', ol).filter(function (li) { return !li.hidden; }); }
  function rel(r, nr) { return { x: r.left - nr.left, y: r.top - nr.top, w: r.width, h: r.height }; }
  function ghost(li, r) { var g = li.cloneNode(true); g.classList.add('bc-ghost'); g.removeAttribute('data-k'); g.hidden = false; g.style.left = r.x + 'px'; g.style.top = r.y + 'px'; g.style.width = r.w + 'px'; navEl.appendChild(g);
    var a = g.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(6px)' + (c.blur ? ' scale(.96)' : '') }], { duration: 200, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }); a.onfinish = function () { g.remove(); }; }
  function render(dir) {
    var nr = navEl.getBoundingClientRect(), before = {}, mv = anim && built && moving(), h0 = bar.offsetHeight;
    vis().forEach(function (li) { li.getAnimations().forEach(function (a) { a.finish(); }); before[li.getAttribute('data-k')] = rel(li.getBoundingClientRect(), nr); });
    var keep = {}, list = [];
    path.forEach(function (n, i) { var last = i === path.length - 1, k = last ? 'cur' : i + ':' + n; if (!last && !els[k]) els[k] = mkLink(k, n, i); keep[k] = 1; list.push(last ? curLi : els[k]); });
    Object.keys(els).forEach(function (k) { if (keep[k]) return; var li = els[k]; if (mv && !li.hidden && before[k]) ghost(li, before[k]); li.remove(); delete els[k]; });
    list.forEach(function (li, j) { ol.appendChild(li); if (j === 0) ol.appendChild(moreLi); });
    var wasHidden = {}; list.forEach(function (li) { wasHidden[li.getAttribute('data-k')] = !before[li.getAttribute('data-k')]; li.hidden = false; });
    moreLi.hidden = true; hidIdx = [];
    ol.classList.toggle('is-wrap', expanded);
    ol.classList.add('is-measure');
    if (!expanded && list.length > 3 && ol.scrollWidth > navEl.clientWidth + .5) {
      moreLi.hidden = false;
      for (var i = 1; i < list.length - 1 && ol.scrollWidth > navEl.clientWidth + .5; i++) { list[i].hidden = true; hidIdx.push(i); }
    }
    ol.classList.remove('is-measure');
    // what folded away fades where it stood
    if (mv) list.forEach(function (li) { var k = li.getAttribute('data-k'); if (li.hidden && before[k]) ghost(li, before[k]); });
    if (line) line.set(path[path.length - 1], dir || 1); else cl.textContent = path[path.length - 1];
    if (hc) hc.set(hidIdx.length);
    moreBtn.setAttribute('aria-label', 'Show ' + hidIdx.length + ' hidden folder' + (hidIdx.length === 1 ? '' : 's'));
    if (c.fold === 'inline') moreBtn.setAttribute('aria-expanded', String(expanded));
    buildMenu();
    hp.style.opacity = 0; shown = false;
    if (mv) {
      var nr2 = navEl.getBoundingClientRect(), sp = c.spring ? TLsp('snappy') : { d: 380, e: 'cubic-bezier(.22,1,.36,1)' };
      vis().forEach(function (li) {
        var k = li.getAttribute('data-k'), b = before[k], r = rel(li.getBoundingClientRect(), nr2);
        if (b && !wasHidden[k]) { var dx = b.x - r.x, dy = b.y - r.y; if (Math.abs(dx) + Math.abs(dy) > .5) li.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: sp.d, easing: sp.e }); }
        else li.animate([{ opacity: 0, transform: 'translateX(-8px)', filter: c.blur ? 'blur(3px)' : 'none' }, { opacity: 1, transform: 'none', filter: 'none' }], { duration: 300, delay: 40, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
      });
      if (c.fold === 'inline') TL4glide(bar, h0, 380);
    }
    built = true;
  }
  function buildMenu() {
    if (c.fold === 'inline') return;
    menu.innerHTML = hidIdx.map(function (i, j) { return '<button class="l-item" type="button" role="menuitem" data-i="' + i + '" style="padding-left:' + (10 + j * 12) + 'px">' + TL4i.folder + '<span></span></button>'; }).join('');
    $$('.l-item', menu).forEach(function (b) { $('span', b).textContent = path[+b.getAttribute('data-i')]; });
  }
  function kids(dir) {
    var cur = path[path.length - 1], ks = TREE[cur] || [];
    here.textContent = 'Inside ' + cur;
    kidsEl.innerHTML = ks.length ? ks.map(function (n) { var cnt = TREE[n] ? TREE[n].length + ' folders' : (LEAF[n] || 0) + ' files'; return '<li><button class="bc-kid" type="button" data-n="' + n + '">' + TL4i.folder + '<span>' + n + '</span><small>' + cnt + '</small></button></li>'; }).join('')
      : '<li class="bc-leaf">' + (LEAF[cur] || 0) + ' receipts are kept here. Use the path above to go back.</li>';
    if (moving() && built && dir) kidsEl.animate([{ opacity: 0, transform: 'translateX(' + (dir * 14) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
  function go(newPath, dir, msg) {
    var hadFocus = box.contains(document.activeElement);
    if (pm && pm.isOpen()) pm.set(false, false);
    path = newPath; expanded = false; render(dir); kids(dir); say.textContent = msg;
    if (hadFocus) here.focus({ preventScroll: true });
  }
  function up(i) { if (i >= path.length - 1) return; go(path.slice(0, i + 1), -1, 'Back in ' + path[i] + '.'); }
  ol.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a.bc-lk'); if (!a) return; e.preventDefault(); up(+a.getAttribute('data-i')); });
  kidsEl.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('.bc-kid'); if (!b) return; var n = b.getAttribute('data-n'); go(path.concat([n]), 1, 'Opened ' + n + '.'); });
  if (c.fold === 'inline') {
    var shut = function () { if (!expanded) return; expanded = false; render(0); };
    moreBtn.addEventListener('click', function () { expanded = true; render(0); var f = vis()[1]; if (f) $('.bc-lk', f).focus({ preventScroll: true }); });
    bar.addEventListener('pointerleave', function () { clearTimeout(foldT); foldT = setTimeout(function () { if (!bar.contains(document.activeElement)) shut(); }, 900); });
    bar.addEventListener('pointerenter', function () { clearTimeout(foldT); });
    bar.addEventListener('focusout', function (e) { if (!bar.contains(e.relatedTarget)) { clearTimeout(foldT); foldT = setTimeout(function () { if (!bar.contains(document.activeElement) && !bar.matches(':hover')) shut(); }, 300); } });
    bar.addEventListener('keydown', function (e) { if (e.key === 'Escape' && expanded) { e.stopPropagation(); shut(); moreBtn.focus({ preventScroll: true }); } });
  } else {
    pm = pop(moreBtn, menu, { focus: '.l-item', onOpen: function () { var br = bar.getBoundingClientRect(), mr = moreBtn.getBoundingClientRect(); menu.style.left = Math.max(0, Math.min(mr.left - br.left - 4, br.width - Math.min(menu.offsetWidth || 196, br.width) - 2)) + 'px'; } });
    nav(menu, '.l-item', { focus: true });
    menu.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('.l-item'); if (b) up(+b.getAttribute('data-i')); });
  }
  navEl.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
    var ls = vis().map(function (li) { return $('.bc-lk', li); }).filter(Boolean), i = ls.indexOf(document.activeElement); if (i < 0) return;
    e.preventDefault(); i = e.key === 'Home' ? 0 : e.key === 'End' ? ls.length - 1 : Math.max(0, Math.min(ls.length - 1, i + (e.key === 'ArrowRight' ? 1 : -1))); ls[i].focus();
  });
  if (c.pill) {
    var pill = function (a) { var r = a.getBoundingClientRect(), n = navEl.getBoundingClientRect(); if (!shown) hp.style.transition = 'none';
      hp.style.width = r.width + 'px'; hp.style.height = r.height + 'px'; hp.style.transform = 'translate(' + (r.left - n.left) + 'px,' + (r.top - n.top) + 'px)';
      if (!shown) { hp.offsetWidth; hp.style.transition = ''; } hp.style.opacity = 1; shown = true; };
    navEl.addEventListener('pointerover', function (e) { var a = e.target.closest && e.target.closest('.bc-lk'); if (a && e.pointerType === 'mouse') pill(a); });
    navEl.addEventListener('pointerleave', function () { hp.style.opacity = 0; shown = false; });
    navEl.addEventListener('focusin', function (e) { if (e.target.classList.contains('bc-lk') && e.target.matches(':focus-visible')) pill(e.target); });
    navEl.addEventListener('focusout', function (e) { if (!navEl.contains(e.relatedTarget) && !navEl.matches(':hover')) { hp.style.opacity = 0; shown = false; } });
  }
  var wIn = $('[data-w]', box), lastW = 0;
  if (wIn) wIn.addEventListener('input', function () { bar.style.width = 'max(' + wIn.value + '%, 236px)'; render(0); });
  render(0); kids(0);
  say.textContent = 'Click a name in the path to go back up.';
  if (window.ResizeObserver) new ResizeObserver(function () { var w = box.clientWidth; if (built && Math.abs(w - lastW) > 1) { lastW = w; render(0); } }).observe(box);
};`;

const crumbs = {
  id: 'breadcrumb', n: '27', name: 'Breadcrumb', h: 300,
  claim: 'A path should <em>fold its middle</em> and show where you are.',
  lead: 'A shop’s folders, seven deep. Open folders below to go deeper, and click a name in the path to go back. When the path is too long, the middle folds into “…”.',
  ref: { ids: 'n19', text: 'Our breadcrumb: the middle folds into “…” when there is no room, and a soft pill glides under the pointer.', url: SHOW + '#n19', label: 'Open n19' },
  noteHint: 'B, but the menu from A', moreHint: 'a path with a menu on every folder',
  css: bcCss, js: bcJs,
  opts: [
    {
      k: 'B', name: 'The path moves with you', kind: 'Lively, after Arc',
      line: 'The pill glides under the pointer on a spring. Going deeper, the last name rolls up and a new folder slides in from the left. Going back, the names you leave fade where they stood. “…” opens a small menu.',
      from: [arc('breadcrumb'), house('n19')], tryit: 'Open two folders, then click Branches in the path. Then press “…”.',
      needs: 'A small script, springs.', keys: 'Tab into the path, Left and Right move along it. In the menu, arrows and Enter; Escape closes.', off: 'The path changes at once. Nothing rolls or slides.', law: 'Jakob: a path reads left to right, like every file app.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'open:trigger', 'new:twist', 'look:ember'],
      html: bcHtml(),
      css: String.raw`#t27B .bc-menu { --in: var(--sp-snappy-d); --ease: var(--sp-snappy); }`,
      js: String.raw`TL4crumb(box, { pill: true, spring: true, blur: true, fold: 'menu' });`,
    },
    {
      k: 'A', name: 'A plain path with a menu', kind: 'Plain, the shadcn way',
      line: 'Like the shadcn breadcrumb. Names underline on hover. “…” opens a menu of the folded folders. The path just changes when you move.',
      from: [sh('breadcrumb')], tryit: 'Click 2026 in the path, then open a month.',
      needs: 'A few lines of script.', keys: 'Tab and Enter. Arrows in the menu; Escape closes it.', off: 'The same as with motion on.', law: 'Jakob: the plain web breadcrumb.',
      tags: ['motion:still', 'speed:quick', 'feedback:quiet', 'open:trigger', 'new:familiar', 'look:ember'],
      html: bcHtml(),
      css: String.raw`#t27A .bc-lk:not(.bc-more) { background-image: linear-gradient(currentColor, currentColor); background-size: 0 1px; background-repeat: no-repeat; background-position: 8px calc(100% - 7px); }
#t27A .bc-lk:not(.bc-more):hover { background-size: calc(100% - 16px) 1px; }`,
      js: String.raw`TL4crumb(box, { plain: true, fold: 'menu' });`,
    },
    {
      k: 'C', name: '“…” unfolds right in the path', kind: 'Mix',
      line: 'No menu. Press “…” and the hidden folders open in place, so the path wraps onto a second line and the box grows. Move away and it folds back up.',
      from: [arc('breadcrumb'), house('n19'), skill('animate')], tryit: 'Press “…”, pick a folder, or move the pointer away and wait.',
      needs: 'A small script.', keys: 'Enter on “…” opens it and moves focus in. Escape folds it.', off: 'The path opens and folds at once.', law: 'Proximity: the hidden folders show where they belong, not in a box.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: bcHtml(),
      js: String.raw`TL4crumb(box, { pill: true, fold: 'inline' });`,
    },
    {
      k: 'D', name: 'n19 with a count that rolls', kind: 'Reference, pushed',
      line: 'Our n19 with Box width, as in the kit. Drag it narrower and names fold one by one. “…” carries a small count that rolls as more fold in. The last name rolls too.',
      from: [house('n19'), arc('breadcrumb')], tryit: 'Drag Box width all the way left, then back.',
      needs: 'A small script, springs.', keys: 'The slider takes arrow keys. Left and Right move along the path.', off: 'Names fold at once and the count just changes.', law: 'Hick: the count says how much is hidden before you open it.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'open:trigger', 'new:twist', 'look:ember'], h: 340,
      html: bcHtml('<label class="bc-rg"><span>Box width</span><input type="range" min="40" max="100" value="100" data-w></label>'),
      css: String.raw`#t27D .bc-menu { --in: var(--sp-snappy-d); --ease: var(--sp-snappy); }`,
      js: String.raw`TL4crumb(box, { pill: true, spring: true, fold: 'menu', count: true });`,
    },
  ],
};


/* ================= 28 Expandable card ================= */
const ORD = [
  { id: '4821', nm: 'Amina Otieno', ini: 'AO', ph: '+254 712 345 678', k: 2, t: ['2:14 pm', '2:31 pm'], items: [['Sukuma wiki, 2 bunches', 120], ['Unga, 2 kg', 230], ['Cooking oil, 1 L', 410]], tr: [3, 4, 3, 5, 6, 5, 7, 8] },
  { id: '4820', nm: 'Brian Kiprop', ini: 'BK', ph: '+254 733 210 445', k: 1, t: ['2:40 pm'], items: [['Milk, 3 L', 210], ['Bread, 2 loaves', 130], ['Eggs, a tray', 450], ['Sugar, 2 kg', 390]], tr: [6, 5, 7, 6, 4, 5, 4, 6] },
  { id: '4819', nm: 'Wanjiru Mwangi', ini: 'WM', ph: '+254 701 998 120', k: 3, t: ['1:05 pm', '1:20 pm', '1:52 pm'], items: [['Tomatoes, 1 kg', 150], ['Avocados, 4', 280]], tr: [1, 2, 2, 3, 2, 4, 5, 4] },
];
const ST = ['', 'Packing', 'Out for delivery', 'Delivered'];
const kes = (n) => n.toLocaleString('en-KE');
const tot = (o) => o.items.reduce((a, b) => a + b[1], 0);
const xcHd = (o) => `<span class="xc-a" data-a><span class="l-av">${o.ini}</span><span class="xc-nm"><b>${o.nm}</b><small data-cs>${ST[o.k]}</small></span></span><span class="xc-m" data-m><b>KES ${kes(tot(o))}</b><small>#${o.id}</small></span>`;
const xcList = () => `<p class="xc-cap">Today’s orders · Duka Fresh</p><ul class="xc-list">${ORD.map((o, i) => `<li><button class="xc-card" type="button" data-i="${i}" aria-expanded="false" aria-label="${o.nm}, order ${o.id}, ${ST[o.k]}. Open details">${xcHd(o)}</button></li>`).join('')}</ul>`;
const xcHtml = () => `<div class="xc" data-xc>${xcList()}<div class="xc-shw"><div class="xc-det" data-det role="dialog" aria-label="Order details" hidden><div class="xc-in" data-in><div class="xc-dh"><span class="xc-a" data-da></span><span class="xc-m" data-dm></span></div><button class="l-ib xc-x" type="button" data-close aria-label="Close details">${I.x}</button><div class="xc-body" data-body></div></div></div></div></div>`;
const xaHtml = () => `<div class="xc xa" data-xc><p class="xc-cap">Today’s orders · Duka Fresh</p><ul class="xc-list">${ORD.map((o, i) => `<li class="xa-it"><button class="xc-card xa-hd" type="button" data-i="${i}" aria-expanded="false" aria-controls="xa-${i}">${xcHd(o)}<span class="xa-ch" aria-hidden="true">${I.down}</span></button><div class="xa-bd" data-bd hidden><div class="xa-in" data-body></div></div></li>`).join('')}</ul></div>`;

const xcCss = String.raw`
#expcard .stage { padding: 14px; place-items: stretch; }
#expcard .xc { position: relative; width: 100%; height: 100%; min-width: 0; container-type: inline-size; text-align: left; }
#expcard .xc-cap { margin: 2px 0 10px; font: 500 11px/1.3 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
#expcard .xc-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
#expcard .xc-card { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); box-shadow: var(--shadow-sm); text-align: left; color: var(--ink); transition: transform .45s var(--ease-out), border-color .2s, box-shadow .2s; }
#expcard .xc-card:hover { transform: translateY(-3px); border-color: rgb(var(--ink-rgb) / .26); }
#expcard .xc-card:active { transform: scale(.97); transition-duration: .15s; }
#expcard .xc-card.is-on { border-color: var(--ink); transform: none; }
#expcard .xc-a { display: flex; align-items: center; gap: 10px; min-width: 0; }
#expcard .xc-nm { display: grid; min-width: 0; }
#expcard .xc-nm b { font-size: 14.5px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#expcard .xc-nm small { font-size: 12.5px; color: var(--muted); }
#expcard .xc-m { display: grid; justify-items: end; flex: none; }
#expcard .xc-m b { font: 500 17px/1.15 var(--font-num); font-variant-numeric: tabular-nums; color: var(--ink); }
#expcard .xc-m small { font: 500 11px/1.4 var(--font-mono); color: var(--muted); }
#expcard .xc-shw { position: absolute; inset: 0; z-index: 5; pointer-events: none; filter: drop-shadow(0 0 .7px var(--line-hi)) drop-shadow(0 0 .3px var(--line-hi)); }
#expcard .xc-det { position: absolute; inset: 0; background: var(--paper-raised); pointer-events: auto; }
#expcard .xc-in { position: absolute; inset: 0; padding: 12px 14px; display: flex; flex-direction: column; gap: 12px; overflow: auto; overscroll-behavior: contain; }
#expcard .xc-dh { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-right: 42px; min-height: 40px; }
#expcard .xc-dh > * { will-change: transform; }
#expcard .xc-x { position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; }
#expcard .xc-x svg { width: 14px; height: 14px; }
#expcard .xc-body { display: grid; gap: 12px; }
#expcard .xc-items { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; font-size: 13.5px; }
#expcard .xc-items li { display: flex; justify-content: space-between; gap: 10px; padding: 3px 0; color: var(--ink-soft); }
#expcard .xc-items li span:last-child { font-variant-numeric: tabular-nums; color: var(--ink); }
#expcard .xc-items .tot { margin-top: 4px; padding-top: 7px; border-top: 1px solid var(--line); font-weight: 600; color: var(--ink); }
#expcard .xc-steps { position: relative; list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); font-size: 12.5px; }
#expcard .xc-steps::before, #expcard .xc-steps::after { content: ""; position: absolute; left: 16.66%; right: 16.66%; top: 8px; height: 2px; border-radius: 2px; background: rgb(var(--ink-rgb) / .12); }
#expcard .xc-steps::after { background: var(--accent); transform-origin: left; transform: scaleX(var(--f, 0)); transition: transform .55s var(--ease-out); }
#expcard .xc-steps li { position: relative; z-index: 1; display: grid; justify-items: center; gap: 5px; text-align: center; color: var(--muted); }
#expcard .xc-steps li b { display: block; font-weight: 500; color: var(--ink-soft); }
#expcard .xc-dot { width: 18px; height: 18px; border-radius: 50%; display: grid; place-items: center; background: var(--paper-raised); box-shadow: inset 0 0 0 1.5px var(--line-hi); }
#expcard .is-done .xc-dot { background: var(--accent); box-shadow: none; }
#expcard .is-cur .xc-dot { box-shadow: inset 0 0 0 2px var(--accent); }
#expcard .is-cur b { color: var(--ink); }
#expcard .xc-dot svg { width: 12px; height: 12px; }
#expcard .xc-dot path { fill: none; stroke: var(--on-accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 12; stroke-dashoffset: 0; }
#expcard .is-new .xc-dot { animation: xcPop .34s var(--ease-out) both; }
#expcard .is-new .xc-dot path { animation: xcDraw .3s .12s var(--ease-out) both; }
@keyframes xcPop { from { transform: scale(.6); opacity: 0; } }
@keyframes xcDraw { from { stroke-dashoffset: 12; } }
#expcard .xc-acts { display: flex; flex-wrap: wrap; gap: 8px; }
#expcard [data-next]:disabled { opacity: .5; cursor: default; transform: none; }
#expcard .xc-note { margin: 0; min-height: 1.4em; font-size: 12.5px; color: var(--muted); }
#expcard .xc-tr { display: grid; gap: 4px; }
#expcard .xc-lbl { margin: 0; font: 500 10.5px/1.3 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
#expcard .xc-tr svg { width: 100%; height: 44px; overflow: visible; }
#expcard .xc-ln { fill: none; stroke: var(--accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
#expcard .xc-area { fill: rgb(var(--accent-rgb) / .1); }
#expcard .xc-tdot { fill: var(--accent); }
/* A: the card opens in place */
#expcard .xa-it { border-radius: 12px; }
#expcard .xa-hd { position: relative; z-index: 1; padding-right: 40px; }
#expcard .xa-hd:hover { transform: none; }
#expcard .xa-ch { position: absolute; right: 14px; top: 50%; width: 16px; height: 16px; margin-top: -8px; color: var(--muted); transition: transform .3s var(--ease-out); }
#expcard .xa-ch svg { width: 16px; height: 16px; }
#expcard .xa-hd[aria-expanded="true"] { border-radius: 12px 12px 0 0; border-bottom-color: transparent; }
#expcard .xa-hd[aria-expanded="true"] .xa-ch { transform: rotate(180deg); }
#expcard .xa-bd { margin-top: -1px; border: 1px solid var(--line); border-top: 0; border-radius: 0 0 12px 12px; background: var(--paper-raised); }
#expcard .xa-in { padding: 4px 14px 14px; display: grid; gap: 12px; }
@media (pointer: coarse) { #expcard .xc-x { width: 44px; height: 44px; top: 8px; right: 8px; } }`;

const xcJs = String.raw`
window.TL4orders = ${JSON.stringify(ORD)};
window.TL4xcSt = ${JSON.stringify(ST)};
/* the detail body: items, the three steps, the next step's button */
window.TL4xcBody = function (o, trend, fresh) {
  var sum = 0, S = ['Paid', 'Packed', 'Delivered'], TK = '<svg viewBox="0 0 12 12"><path d="M3.2 6.3 5.2 8.2 8.8 4.2"/></svg>';
  var items = o.items.map(function (it) { sum += it[1]; return '<li><span>' + it[0] + '</span><span>' + it[1].toLocaleString('en-KE') + '</span></li>'; }).join('') + '<li class="tot"><span>Total</span><span>KES ' + sum.toLocaleString('en-KE') + '</span></li>';
  var steps = '<ol class="xc-steps" style="--f:' + (Math.min(o.k, 2) / 2) + '">' + S.map(function (s, j) { var cls = j < o.k ? 'is-done' : j === o.k ? 'is-cur' : ''; if (j === fresh) cls += ' is-new';
    return '<li class="' + cls + '"><span class="xc-dot">' + (j < o.k ? TK : '') + '</span><span><b>' + s + '</b>' + (o.t[j] || (j === o.k ? 'Next' : '')) + '</span></li>'; }).join('') + '</ol>';
  var tr = '';
  if (trend) { var W = 240, H = 40, mx = Math.max.apply(null, o.tr), pts = o.tr.map(function (v, i) { return [i * W / (o.tr.length - 1), H - 3 - (v / mx) * (H - 8)]; }), d = TLmono(pts), e = pts[pts.length - 1];
    tr = '<div class="xc-tr"><p class="xc-lbl">Orders by month</p><svg viewBox="0 0 240 40" preserveAspectRatio="none" aria-hidden="true"><path class="xc-area" d="' + d + 'L240 40L0 40Z"/><path class="xc-ln" d="' + d + '"/><circle class="xc-tdot" cx="' + e[0] + '" cy="' + e[1] + '" r="3.5"/></svg></div>'; }
  var nx = ['', 'Mark as packed', 'Mark as delivered', 'Delivered'][o.k];
  return '<ul class="xc-items">' + items + '</ul>' + steps + tr + '<div class="xc-acts"><button class="l-btn sm pri" type="button" data-next' + (o.k >= 3 ? ' disabled' : '') + '>' + nx + '</button><button class="l-btn sm" type="button" data-call>' + TL4i.phone + 'Call ' + o.nm.split(' ')[0] + '</button></div><p class="xc-note" data-note aria-live="polite"></p>';
};
/* wire the buttons inside a body; cardEls get the new status word */
window.TL4xcWire = function (bodyEl, o, cardEls, trend) {
  function now() { var d = new Date(), h = d.getHours(), m = d.getMinutes(); return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m + ' ' + (h < 12 ? 'am' : 'pm'); }
  function wire() {
    $('[data-next]', bodyEl).addEventListener('click', function () {
      if (o.k >= 3) return; o.t[o.k] = now(); o.k++;
      bodyEl.innerHTML = TL4xcBody(o, trend, o.k - 1); wire();
      cardEls.forEach(function (el) { var s = $('[data-cs]', el); if (s) s.textContent = TL4xcSt[o.k]; });
      $('[data-note]', bodyEl).textContent = 'Order #' + o.id + (o.k === 3 ? ' marked as delivered.' : ' marked as packed.');
      var nb = $('[data-next]', bodyEl); (nb.disabled ? $('[data-call]', bodyEl) : nb).focus({ preventScroll: true });
    });
    $('[data-call]', bodyEl).addEventListener('click', function () { $('[data-note]', bodyEl).textContent = 'Calling ' + o.nm + ' on ' + o.ph + '.'; });
  }
  bodyEl.innerHTML = TL4xcBody(o, trend); wire();
};
/* draw the trend line in, then pop its end dot (n40) */
window.TL4trend = function (bodyEl, delay) {
  var ln = $('.xc-ln', bodyEl), dot = $('.xc-tdot', bodyEl), ar = $('.xc-area', bodyEl); if (!ln || !moving()) return;
  var L = ln.getTotalLength(); ln.style.strokeDasharray = L; 
  ln.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: 1100, delay: delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
  ar.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: delay + 300, fill: 'backwards' });
  dot.style.transformOrigin = 'center'; dot.style.transformBox = 'fill-box';
  dot.animate([{ transform: 'scale(.6)', opacity: 0 }, { transform: 'scale(1.35)', opacity: 1, offset: .6 }, { transform: 'none', opacity: 1 }], { duration: 380, delay: delay + 1000, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
};
/* the card grows into its detail view: one clip that opens from the card's box, the header moves with it */
window.TL4xc = function (box, c) {
  c = c || {};
  var O = JSON.parse(JSON.stringify(TL4orders)), side = c.mode === 'side';
  var xc = $('[data-xc]', box), det = $('[data-det]', box), inn = $('[data-in]', box), dA = $('[data-da]', box), dM = $('[data-dm]', box), body = $('[data-body]', box), xb = $('[data-close]', box), cards = $$('.xc-card', box);
  var st = 'shut', cur = -1, from = [0, 0, 0, 0], to = [0, 0, 0, 0], dl = { a: [0, 0], m: [0, 0] }, vo = { dur: c.dOpen || 520, zeta: c.zeta || 1, ease: !!c.ease };
  function L(a, b, t) { return a + (b - a) * t; }
  function q(v) { return Math.max(0, Math.min(1, v)); }
  function target() { var w = xc.clientWidth; return side && w >= 560 ? [0, 0, 0, Math.round(w * .44)] : [0, 0, 0, 0]; }
  function measure() {
    var xr = xc.getBoundingClientRect(), cd = cards[cur], cr = cd.getBoundingClientRect();
    from = [cr.top - xr.top, xr.right - cr.right, xr.bottom - cr.bottom, cr.left - xr.left]; to = target();
    inn.style.top = to[0] + 'px'; inn.style.right = to[1] + 'px'; inn.style.bottom = to[2] + 'px'; inn.style.left = to[3] + 'px';
    dA.style.transform = dM.style.transform = 'none';
    var ca = $('[data-a]', cd).getBoundingClientRect(), cm = $('[data-m]', cd).getBoundingClientRect(), da = dA.getBoundingClientRect(), dm = dM.getBoundingClientRect();
    dl.a = [ca.left - da.left, ca.top - da.top]; dl.m = [cm.right - dm.right, cm.top - dm.top];
  }
  function draw(x) {
    var t = x[0]; if (cur < 0) return;
    var ins = from.map(function (f, i) { return L(f, to[i], t).toFixed(2) + 'px'; });
    det.style.clipPath = 'inset(' + ins.join(' ') + ' round ' + L(12, 14, q(t)).toFixed(2) + 'px)';
    var u = 1 - t, f = q((t - .5) / .42);
    dA.style.transform = 'translate(' + (dl.a[0] * u).toFixed(2) + 'px,' + (dl.a[1] * u).toFixed(2) + 'px)';
    dM.style.transform = 'translate(' + (dl.m[0] * u).toFixed(2) + 'px,' + (dl.m[1] * u).toFixed(2) + 'px)';
    body.style.opacity = xb.style.opacity = f; body.style.transform = 'translateY(' + ((1 - f) * 8).toFixed(2) + 'px)';
    if (t <= .0005 && st === 'closing') done();
  }
  var vec = TLvec([0], draw, vo);
  function fill(i) {
    var cd = cards[i]; dA.innerHTML = $('[data-a]', cd).innerHTML; dM.innerHTML = $('[data-m]', cd).innerHTML;
    TL4xcWire(body, O[i], [cd, dA], c.trend);
    det.setAttribute('aria-label', 'Order ' + O[i].id + ' for ' + O[i].nm);
  }
  function done() { st = 'shut'; det.hidden = true; if (cur >= 0) { cards[cur].setAttribute('aria-expanded', 'false'); cards[cur].classList.remove('is-on'); } cur = -1; }
  function open(i) {
    if (cur === i && st === 'open') { close(); return; }
    if (side && st === 'open' && cur !== i) { cards[cur].classList.remove('is-on'); cards[cur].setAttribute('aria-expanded', 'false'); cur = i; fill(i); measure(); draw(vec.x); cards[i].classList.add('is-on'); cards[i].setAttribute('aria-expanded', 'true');
      if (moving()) [dA, dM, body].forEach(function (el, j) { el.animate([{ opacity: 0, translate: '0 6px' }, { opacity: 1, translate: '0 0' }], { duration: 260, delay: j === 2 ? 60 : 0, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }); });
      if (c.trend) TL4trend(body, 120); return; }
    if (st === 'closing' && cur !== i) { vec.to([0], { jump: true }); done(); }
    var again = st === 'closing' && cur === i;
    cur = i; if (!again) fill(i); det.hidden = false; measure(); draw(vec.x);
    cards[i].setAttribute('aria-expanded', 'true'); if (side) cards[i].classList.add('is-on');
    st = 'open'; vo.dur = c.dOpen || 520; vec.to([1]);
    xb.focus({ preventScroll: true });
    if (c.trend && !again) TL4trend(body, Math.round((c.dOpen || 520) * .55));
  }
  function close() { if (st !== 'open') return; st = 'closing'; vo.dur = c.dClose || vo.dur; var cd = cards[cur]; vec.to([0]); cd.focus({ preventScroll: true }); }
  cards.forEach(function (cd, i) { cd.addEventListener('click', function () { open(i); }); });
  xb.addEventListener('click', close);
  xc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && st === 'open') { e.stopPropagation(); close(); return; }
    if (e.key === 'Tab' && st === 'open' && !side && det.contains(document.activeElement)) {
      var f = $$('button:not([disabled])', det), a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });
  addEventListener('resize', function () { if (cur >= 0) { measure(); draw(vec.x); } });
};
/* A: each card opens in place, one at a time */
window.TL4xa = function (box) {
  var O = JSON.parse(JSON.stringify(TL4orders)), its = $$('.xa-it', box), open = -1;
  its.forEach(function (it, i) { var hd = $('.xa-hd', it), bd = $('[data-bd]', it); bd.id = box.id + '-bd' + i; hd.setAttribute('aria-controls', bd.id); TL4xcWire($('[data-body]', it), O[i], [hd]);
    hd.addEventListener('click', function () { if (open === i) shut(i); else { if (open >= 0) shut(open); show(i); } });
    it.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open === i) { e.stopPropagation(); shut(i); hd.focus(); } }); });
  function show(i) { var it = its[i], bd = $('[data-bd]', it); open = i; $('.xa-hd', it).setAttribute('aria-expanded', 'true'); bd.hidden = false;
    if (!moving()) return; var h = bd.offsetHeight, sp = TLsp('soft'); if (bd._a) bd._a.cancel();
    bd._a = bd.animate([{ height: '0px', overflow: 'clip' }, { height: h + 'px', overflow: 'clip' }], { duration: sp.d, easing: sp.e });
    $('.xa-in', bd).animate([{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: 60, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }); }
  function shut(i) { var it = its[i], bd = $('[data-bd]', it), hd = $('.xa-hd', it); open = -1;
    if (!moving()) { bd.hidden = true; hd.setAttribute('aria-expanded', 'false'); return; }
    var h = bd.offsetHeight; if (bd._a) bd._a.cancel();
    bd._a = bd.animate([{ height: h + 'px', overflow: 'clip', opacity: 1 }, { height: '0px', overflow: 'clip', opacity: .4 }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' });
    bd._a.onfinish = function () { bd.hidden = true; hd.setAttribute('aria-expanded', 'false'); bd._a = null; }; }
};`;

const expcard = {
  id: 'expcard', n: '28', name: 'Expandable card', h: 400,
  claim: 'A card should <em>grow into its details</em> and fold back.',
  lead: 'Three orders from today. Open one to see its items and steps, mark the next step done, then close it. The card you opened is where the details come from and go back to.',
  ref: { ids: 'n40 · n41', text: 'Our peek card lifts out of a name with a small trend; our side sheet glides in from the right in 0.45 s and back in 0.25 s.', url: SHOW + '#n41', label: 'Open n41' },
  noteHint: 'B, but on the side sheet’s timing', moreHint: 'a photo card that grows into a product page',
  css: xcCss, js: xcJs,
  opts: [
    {
      k: 'B', name: 'The card grows to fill the box', kind: 'Lively, after Arc',
      line: 'The card’s own outline grows until it fills the box, on a soft spring. The name and amount ride along to their new place. The details fade in once there is room, and fade out first on the way back.',
      from: [arc('expandable-card'), skill('animate')], tryit: 'Open Amina’s order. Press Mark as delivered. Press Escape. Then open and close fast.',
      needs: 'A small script with one spring.', keys: 'Enter opens. Tab stays inside the details. Escape or × closes and focus goes back to the card.', off: 'The details show and hide at once.', law: 'Jakob: like a phone app’s card that opens into a page.',
      tags: ['motion:springy', 'speed:mid', 'depth:some', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: xcHtml(), js: String.raw`TL4xc(box, { dOpen: 560, dClose: 420, zeta: .9 });`,
    },
    {
      k: 'A', name: 'The card opens in place', kind: 'Plain, the shadcn way',
      line: 'Like the shadcn collapsible. The card opens downwards and pushes the others down. One open at a time. The arrow turns.',
      from: [sh('collapsible')], tryit: 'Open Brian’s order, then Wanjiru’s.',
      needs: 'A few lines of script.', keys: 'Enter opens and closes. Escape closes.', off: 'The card opens and closes at once.', law: 'Proximity: the details sit right under their card.',
      tags: ['motion:some', 'speed:mid', 'depth:flat', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: xaHtml(), css: String.raw`#t28A .stage { height: auto; min-height: var(--h); }`, js: String.raw`TL4xa(box);`,
    },
    {
      k: 'C', name: 'The card becomes a side sheet', kind: 'Mix', wide: true,
      line: 'The card grows into a sheet on the right, and the list stays. Pick another order and the sheet swaps its content in place. It glides on our one curve, like n41, with no spring.',
      from: [arc('expandable-card'), house('n41')], tryit: 'Open Amina’s order, then Brian’s, then press × .',
      needs: 'A small script.', keys: 'Enter opens. Escape or × closes. Focus goes back to the card.', off: 'The sheet shows and hides at once.', law: 'Proximity: the list and the details sit side by side.',
      tags: ['motion:some', 'speed:mid', 'depth:some', 'feedback:clear', 'open:edge', 'new:twist', 'look:ember'], h: 360,
      html: xcHtml(), css: String.raw`@container (min-width: 560px) { #t28C .xc-list, #t28C .xc-cap { width: calc(44% - 14px); } }`,
      js: String.raw`TL4xc(box, { mode: 'side', ease: true, dOpen: 450, dClose: 300 });`,
    },
    {
      k: 'D', name: 'Grows on the sheet’s timing, with a trend', kind: 'Reference, pushed',
      line: 'B’s grow, on n41’s timing: 0.45 s open and 0.25 s back, no spring. Inside, n40’s small line of orders draws in, then its orange dot pops.',
      from: [house('n40'), house('n41'), arc('expandable-card')], tryit: 'Open Wanjiru’s order and watch the line draw in.',
      needs: 'A small script.', keys: 'Enter opens. Tab stays inside. Escape or × closes.', off: 'The details and the line show at once.', law: 'Jakob: the kit’s own timing for things that open.',
      tags: ['motion:some', 'speed:mid', 'depth:some', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'], h: 460,
      html: xcHtml(), js: String.raw`TL4xc(box, { ease: true, dOpen: 450, dClose: 250, trend: true });`,
    },
  ],
};


/* ================= 29 Toast stack ================= */
const tqPage = () => `<div class="tq-root" data-root><div class="tq-page"><div class="tq-row"><b>Invoices · Duka Fresh</b><span class="l-muted"><span data-wait></span> waiting to send</span></div><div class="tq-acts"><button class="l-btn sm pri" type="button" data-a="send">Send invoice</button><button class="l-btn sm" type="button" data-a="pay">Record payment</button><button class="l-btn sm" type="button" data-a="fail">Pay out</button></div><p class="tq-note" data-note aria-live="polite">Press Alt+T to reach the messages from the keyboard.</p></div><ol class="tq-host" data-host aria-label="Messages"></ol></div>`;
const TQROWS = [['4821', 'Amina Otieno', 760], ['4820', 'Brian Kiprop', 1180], ['4819', 'Wanjiru Mwangi', 430], ['4818', 'Otieno Ouma', 2650]];
const tqRows = () => `<div class="tq-root" data-root><div class="tq-page"><div class="tq-list"><p class="tq-lh">Open orders</p><ul data-rows>${TQROWS.map((r) => `<li class="tq-r" data-id="${r[0]}"><span><b>#${r[0]}</b> · ${r[1]}</span><small>KES ${kes(r[2])}</small><button class="l-ib tq-arc" type="button" aria-label="Archive order ${r[0]}">${I.archive}</button></li>`).join('')}</ul><p class="tq-empty" data-empty hidden>No open orders. Undo brings them back.</p></div><p class="tq-note" data-note aria-live="polite"></p></div><ol class="tq-host" data-host aria-label="Messages"></ol></div>`;

const tqCss = String.raw`
#toasts .stage { padding: 14px; place-items: stretch; }
#toasts .tq-root { position: relative; width: 100%; height: 100%; min-width: 0; text-align: left; }
#toasts .tq-page { display: grid; gap: 10px; }
#toasts .tq-row { display: grid; gap: 2px; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); box-shadow: var(--shadow-sm); }
#toasts .tq-row b { font-size: 14.5px; }
#toasts .tq-row .l-muted { display: inline-flex; gap: .3em; }
#toasts .tq-row [data-wait] { font-family: var(--font-num); font-size: 16px; line-height: 1.2; color: var(--ink); }
#toasts .tq-acts { display: flex; flex-wrap: wrap; gap: 6px; }
#toasts .tq-note { margin: 0; min-height: 1.4em; font-size: 12.5px; color: var(--muted); }
#toasts .tq-host { position: absolute; left: 0; right: 0; bottom: 0; height: 0; margin: 0; padding: 0; list-style: none; pointer-events: none; }
#toasts .tq-host.has { pointer-events: auto; }
#toasts .tq { position: absolute; right: 0; bottom: 0; width: min(330px, 100%); padding: 11px 10px 13px 12px; border-radius: 12px; background: var(--paper-raised); border: 1px solid var(--line); box-shadow: var(--shadow-lg); transform-origin: 50% 100%; transition: transform var(--sp-snappy-d) var(--sp-snappy), opacity .25s var(--ease-out); touch-action: pan-y; overflow: hidden; user-select: none; -webkit-user-select: none; }
#toasts .tq:focus { outline: none; }
#toasts .tq:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
#toasts .tq-in { display: flex; align-items: center; gap: 10px; transition: opacity .2s var(--ease-out); }
#toasts .tq.is-back .tq-in { opacity: 0; }
#toasts .tq-ic { width: 22px; height: 22px; flex: none; display: grid; place-items: center; color: var(--accent); }
#toasts .tq-ic:empty { display: none; }
#toasts .l-fail circle { fill: var(--accent-text); }
#toasts .tq-tx { flex: 1; min-width: 0; font-size: 13.5px; line-height: 1.35; }
#toasts .tq-tx b { display: block; font-weight: 600; color: var(--ink); }
#toasts .tq-s { display: block; font-size: 12.5px; color: var(--muted); }
#toasts .tq-act { flex: none; height: 30px; padding: 0 8px; border-radius: 8px; font-size: 13px; font-weight: 600; color: var(--accent-text); transition: background-color .15s, transform .15s var(--ease-out); }
#toasts .tq-act:hover { background: rgb(var(--accent-rgb) / .08); }
#toasts .tq-act:active, #toasts .tq-x:active { transform: scale(.97); }
#toasts .tq-x { flex: none; width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; color: var(--muted); transition: background-color .15s, color .15s, opacity .15s; }
#toasts .tq-x:hover { background: rgb(var(--ink-rgb) / .07); color: var(--ink); }
#toasts .tq-x svg { width: 13px; height: 13px; }
#toasts .tq-line { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: var(--accent); transform-origin: left; transform: scaleX(0); }
#toasts .tq-more { position: absolute; right: 10px; bottom: 0; z-index: 20; height: 20px; min-width: 22px; padding: 0 7px; border-radius: 999px; display: grid; place-items: center; font: 600 11px/20px var(--font-body); color: var(--ink-soft); background: var(--paper-sunk); border: 1px solid var(--line); opacity: 0; pointer-events: none; transition: opacity .2s var(--ease-out), transform var(--sp-snappy-d) var(--sp-snappy); }
#toasts .tq-list { border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); box-shadow: var(--shadow-sm); padding: 6px; }
#toasts .tq-lh { margin: 4px 8px 4px; font: 500 10.5px/1.3 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
#toasts .tq-list ul { list-style: none; margin: 0; padding: 0; }
#toasts .tq-r { display: flex; align-items: center; gap: 10px; padding: 4px 4px 4px 8px; border-radius: 8px; font-size: 13.5px; color: var(--ink-soft); }
#toasts .tq-r span { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#toasts .tq-r b { color: var(--ink); font-weight: 600; }
#toasts .tq-r small { font-variant-numeric: tabular-nums; color: var(--muted); font-size: 12.5px; }
#toasts .tq-arc { width: 32px; height: 32px; box-shadow: none; }
#toasts .tq-empty { margin: 6px 8px 8px; font-size: 13px; color: var(--muted); }
@media (pointer: coarse) { #toasts .tq-x, #toasts .tq-act { min-width: 40px; height: 40px; } #toasts .tq-arc { width: 44px; height: 44px; } }`;

const tqJs = String.raw`
window.TL4tqIc = { ok: TICK, fail: ${JSON.stringify(FAIL)}, busy: '<span class="l-spin" aria-hidden="true"></span>', none: '' };
/* the toast stack: pile or column, fan out on hover and focus, timers pause, swipe right to clear */
window.TL4ts = function (box, c) {
  c = c || {};
  var host = $('[data-host]', box), list = [], hover = false, focus = false, drag = false, touchOpen = false, pile = !!c.pile, LIFE = c.life || 5000, GAP = 8, more = null, moreR = null;
  if (c.count) { more = document.createElement('span'); more.className = 'tq-more'; more.setAttribute('aria-hidden', 'true'); host.appendChild(more); moreR = TLroll(more, { value: 0, fmt: function (n) { return '+' + n; }, dur: 420, live: false }); }
  function paused() { return hover || focus || drag || document.hidden; }
  function open() { return !pile || hover || focus || touchOpen; }
  function inner(t) {
    var s = t.spec;
    t.el.innerHTML = '<div class="tq-in"><span class="tq-ic">' + (TL4tqIc[s.ic || 'none'] || '') + '</span><div class="tq-tx"><b></b><span class="tq-s"></span></div>' + (s.act ? '<button class="tq-act" type="button"></button>' : '') + '<button class="tq-x" type="button" aria-label="Close message">' + TL4i.x + '</button></div><span class="tq-line" aria-hidden="true"></span>';
    $('b', t.el).innerHTML = s.b; $('.tq-s', t.el).textContent = s.s || '';
    if (s.act) { var a = $('.tq-act', t.el); a.textContent = s.act.label; a.addEventListener('click', function (e) { e.stopPropagation(); s.act.fn(t); }); }
    $('.tq-x', t.el).addEventListener('click', function (e) { e.stopPropagation(); remove(t); });
  }
  function timer(t) {
    if (t.anim) t.anim.cancel(); t.anim = null;
    if (t.spec.ic === 'busy') return;
    var ln = $('.tq-line', t.el);
    t.anim = ln.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: t.spec.life || LIFE, fill: 'forwards' });
    t.anim.onfinish = function () { remove(t); };
    if (paused()) t.anim.pause();
  }
  function sync() { list.forEach(function (t) { if (!t.anim) return; if (paused()) t.anim.pause(); else if (t.anim.playState === 'paused') t.anim.play(); }); }
  function lay() {
    var n = list.length, op = open(), y = 0, H = [];
    list.forEach(function (t) { H.push(t.el.offsetHeight); });
    for (var i = n - 1; i >= 0; i--) {
      var t = list[i], d = n - 1 - i, el = t.el, ty, sc = 1;
      if (op) { ty = -y; y += H[i] + GAP; } else { ty = -d * 14; sc = 1 - d * .05; }
      t.y = ty; t.sc = sc; el.style.zIndex = 10 + i;
      el.classList.toggle('is-back', !op && d > 0);
      el.style.opacity = !op && d > 2 ? 0 : 1;
      if (!t.dx) el.style.transform = 'translateY(' + ty + 'px) scale(' + sc + ')';
    }
    var front = n ? H[n - 1] : 0;
    host.style.height = (op ? Math.max(0, y - GAP) : front + 14 * Math.min(2, Math.max(0, n - 1))) + 'px';
    host.classList.toggle('has', n > 0);
    if (more) { var k = n - 1; moreR.set(Math.max(0, k)); more.style.opacity = !op && k > 0 ? 1 : 0; more.style.transform = 'translateY(' + (-front + 10) + 'px)'; }
  }
  function add(spec) {
    var el = document.createElement('li'), t = { el: el, spec: spec, dx: 0 };
    el.className = 'tq'; el.tabIndex = 0; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
    inner(t); host.insertBefore(el, more); list.push(t);
    var max = 3; while (list.length > max) remove(list[0]);
    if (moving()) { el.style.transition = 'none'; el.style.transform = 'translateY(30px) scale(.96)'; el.style.opacity = 0; el.offsetWidth; el.style.transition = ''; }
    lay(); timer(t); wireDrag(t);
    el.addEventListener('keydown', function (e) { if (e.key === 'Escape' && e.target === el) { e.stopPropagation(); remove(t); } });
    return t;
  }
  function update(t, spec) {
    if (list.indexOf(t) < 0) return;
    var h0 = t.el.offsetHeight, f = t.el.contains(document.activeElement); t.spec = spec; inner(t); if (f) t.el.focus({ preventScroll: true });
    if (moving()) { $('.tq-in', t.el).animate([{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'cubic-bezier(.22,1,.36,1)' }); TL4glide(t.el, h0, 260); }
    timer(t); lay();
  }
  function remove(t, how) {
    var i = list.indexOf(t); if (i < 0) return;
    var hadF = t.el.contains(document.activeElement);
    list.splice(i, 1); if (t.anim) { t.anim.onfinish = null; t.anim.cancel(); }
    var el = t.el; el.style.pointerEvents = 'none';
    if (moving() && how !== 'quiet') { el.style.opacity = 0; el.style.transform = how === 'swipe' ? 'translate(' + (el.offsetWidth + 40) + 'px,' + t.y + 'px)' : 'translateY(' + (t.y + 10) + 'px) scale(' + t.sc + ')'; setTimeout(function () { el.remove(); }, 300); }
    else el.remove();
    lay();
    if (hadF) { var nx = list[Math.min(i, list.length - 1)]; if (nx) nx.el.focus({ preventScroll: true }); else { focus = false; if (c.back) c.back().focus({ preventScroll: true }); sync(); } }
  }
  function wireDrag(t) {
    var el = t.el, x0 = 0, t0 = 0, on = false;
    if (!c.swipe) return;
    el.addEventListener('pointerdown', function (e) { if (e.target.closest('button') || e.button > 0) return; on = true; x0 = e.clientX; t0 = performance.now(); drag = true; sync(); el.setPointerCapture(e.pointerId); el.style.transition = 'none'; });
    el.addEventListener('pointermove', function (e) { if (!on) return; var dx = e.clientX - x0; t.dx = dx > 0 ? dx : -Math.sqrt(-dx) * 3; el.style.transform = 'translate(' + t.dx + 'px,' + t.y + 'px) scale(' + t.sc + ')'; el.style.opacity = dx > 0 ? Math.max(.35, 1 - dx / 260) : 1; });
    function up(e) { if (!on) return; on = false; drag = false; var dx = e.clientX - x0, v = dx / Math.max(1, performance.now() - t0); el.style.transition = '';
      if (dx > 80 || (dx > 20 && v > .45)) { t.dx = 0; remove(t, 'swipe'); } else { t.dx = 0; el.style.opacity = 1; lay(); } sync(); }
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  }
  host.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'mouse') return; hover = true; lay(); sync(); });
  host.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'mouse') return; hover = false; if (!drag) { lay(); sync(); } });
  host.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' && !touchOpen) { touchOpen = true; lay(); } });
  document.addEventListener('pointerdown', function (e) { if (touchOpen && !host.contains(e.target)) { touchOpen = false; lay(); } });
  host.addEventListener('focusin', function () { focus = true; lay(); sync(); });
  host.addEventListener('focusout', function (e) { if (host.contains(e.relatedTarget)) return; focus = false; lay(); sync(); });
  document.addEventListener('visibilitychange', sync);
  box.addEventListener('keydown', function (e) { if (e.altKey && (e.code === 'KeyT' || e.key === 't')) { var f = list[list.length - 1]; if (f) { e.preventDefault(); f.el.focus({ preventScroll: true }); } } });
  return { add: add, update: update, remove: remove, alive: function (t) { return list.indexOf(t) >= 0; }, timer: timer };
};
/* the invoice demo shared by B, A and C */
window.TL4tsDemo = function (box, c) {
  var INV = [['4821', 'Amina Otieno'], ['4822', 'Brian Kiprop'], ['4823', 'Wanjiru Mwangi'], ['4824', 'Otieno Ouma'], ['4825', 'Faith Njeri']];
  var wait = INV.slice(), note = $('[data-note]', box), sendB = $('[data-a="send"]', box), last = sendB, batch = null;
  var w = TLroll($('[data-wait]', box), { value: wait.length, dur: 480, live: false });
  var ts = TL4ts(box, { pile: c.pile, swipe: c.swipe, back: function () { return last; } });
  function count() { w.set(wait.length); sendB.disabled = !wait.length; sendB.textContent = wait.length ? 'Send invoice' : 'All sent'; }
  function back(invs) { invs.slice().reverse().forEach(function (v) { wait.unshift(v); }); count(); }
  $$('[data-a]', box).forEach(function (b) { b.addEventListener('click', function () { last = b; var a = b.getAttribute('data-a');
    if (a === 'send') {
      if (!wait.length) return; var v = wait.shift(); count();
      if (c.merge && batch && ts.alive(batch.t) && batch.t.spec.ic === 'ok') { batch.inv.push(v); var t = batch.t; batch.roll.set(batch.inv.length); $('[data-pl]', t.el).textContent = 'invoices'; $('.tq-s', t.el).textContent = 'To ' + names(batch.inv); ts.timer(t);
        if (moving()) t.el.animate([{ scale: '1' }, { scale: '1.025' }, { scale: '1' }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' }); return; }
      var undo = function (t) { var gone = batch && batch.t === t ? batch.inv : [v]; back(gone); var k = gone.length; batch = null;
        ts.update(t, { ic: 'none', b: (k > 1 ? k + ' invoices are' : 'Invoice #' + gone[0][0] + ' is') + ' a draft again', s: 'Nothing was sent.', life: 2600 }); note.textContent = 'Sending undone.'; };
      var okSpec = function () { return c.merge ? { ic: 'ok', b: '<span data-n></span> <span data-pl>invoice</span> sent', s: 'To ' + v[1], act: { label: 'Undo', fn: undo } } : { ic: 'ok', b: 'Invoice #' + v[0] + ' sent', s: 'To ' + v[1] + ' · ' + v[1].split(' ')[0].toLowerCase() + '@example.com', act: { label: 'Undo', fn: undo } }; };
      var t;
      if (c.busy) { t = ts.add({ ic: 'busy', b: 'Sending invoice #' + v[0] + '…', s: 'To ' + v[1] }); setTimeout(function () { ts.update(t, okSpec()); if (c.merge) mk(t, v); }, 900); }
      else { t = ts.add(okSpec()); if (c.merge) mk(t, v); }
    } else if (a === 'pay') {
      ts.add({ ic: 'ok', b: 'KES 2,140 received', s: 'From Brian Kiprop by PocketPay', act: { label: 'View', fn: function (t) { note.textContent = 'Showing the KES 2,140 payment from Brian Kiprop.'; ts.remove(t); } } });
    } else {
      var retry = function (t) { ts.update(t, { ic: 'busy', b: 'Sending payout…', s: 'KES 12,750 to +254 712 345 678' }); setTimeout(function () { ts.update(t, { ic: 'ok', b: 'Payout sent', s: 'KES 12,750 to +254 712 345 678' }); note.textContent = 'Payout sent on the second try.'; }, 1100); };
      ts.add({ ic: 'fail', b: 'Payout did not go through', s: 'PocketPay did not answer. Your KES 12,750 is safe.', act: { label: 'Retry', fn: retry }, life: 8000 });
    }
  }); });
  function names(inv) { var n = inv.map(function (v) { return v[1].split(' ')[0]; }); return n.length > 1 ? n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1] : n[0]; }
  function mk(t, v) { batch = { t: t, inv: [v], roll: TLroll($('[data-n]', t.el), { value: 1, dur: 460, live: false }) }; }
  count();
};
/* D: archive rows; each one raises a toast with Undo, the list closes and opens with them */
window.TL4tsRows = function (box) {
  var ul = $('[data-rows]', box), empty = $('[data-empty]', box), note = $('[data-note]', box), lastBtn = null;
  var ts = TL4ts(box, { pile: true, swipe: true, count: true, back: function () { var b = $$('.tq-arc', box).filter(function (x) { return !x.closest('li').hidden; })[0]; return b || lastBtn; } });
  function sync() { var any = $$('.tq-r', ul).some(function (li) { return !li.hidden; }); if (empty.hidden === any) return; var h0 = empty.parentNode.offsetHeight; empty.hidden = any; TL4glide(empty.parentNode, h0, 300); }
  $$('.tq-arc', box).forEach(function (b) { b.addEventListener('click', function () {
    var li = b.closest('li'), id = li.getAttribute('data-id'), nx = li.nextElementSibling; lastBtn = b;
    while (nx && nx.hidden) nx = nx.nextElementSibling;
    TL4fold(li, function () { li.hidden = true; sync(); });
    if (nx) $('.tq-arc', nx).focus({ preventScroll: true });
    note.textContent = '';
    ts.add({ ic: 'none', b: 'Order #' + id + ' archived', s: 'Moved to Archive.', act: { label: 'Undo', fn: function (t) { li.hidden = false; sync(); TL4unfold(li); ts.update(t, { ic: 'none', b: 'Order #' + id + ' is back', s: 'It is in Open orders again.', life: 2200 }); note.textContent = 'Order #' + id + ' is back in the list.'; } } });
  }); });
};`;

const toasts = {
  id: 'toasts', n: '29', name: 'Toast stack', h: 430,
  claim: 'Many small messages should <em>wait in a pile</em> until you reach for them.',
  lead: 'Press the buttons a few times quickly. Rest the pointer on the messages to open the pile and stop their timers. Drag one to the right to clear it. Alt+T jumps to them from the keyboard.',
  ref: { ids: 'c21 · n22', text: 'Our toasts: a paper card that rises in its own card, an orange countdown line that pauses on hover, and Undo. The first Taste Lab kept three: the corner toast, the pile, and sending then sent.', url: SHOW + '#n22', label: 'Open n22' },
  noteHint: 'B, but C’s merging', moreHint: 'a toast that asks a choice for an error',
  css: tqCss, js: tqJs,
  opts: [
    {
      k: 'B', name: 'A pile that fans out, with sending then sent', kind: 'Lively, after Arc',
      line: 'New messages rise in front and older ones tuck behind. Point at the pile and it fans out on a spring, and every timer stops. A message can change in place: sending turns into sent, a failed payout into Retry, then sent.',
      from: [arc('toast-stack'), house('c21'), ['First Taste Lab, toasts B and C', null]], tryit: 'Press Send invoice three times, then Pay out, then point at the pile and press Retry.',
      needs: 'A small script, springs.', keys: 'Alt+T goes to the front message, Tab moves on, Escape clears the one in focus.', off: 'Messages show and go at once. The orange line still counts down.', law: 'Hick: one message in front, the rest wait behind.',
      tags: ['motion:springy', 'speed:mid', 'depth:lifted', 'feedback:clear', 'open:edge', 'new:twist', 'look:ember'],
      html: tqPage(), js: String.raw`TL4tsDemo(box, { pile: true, swipe: true, busy: true });`,
    },
    {
      k: 'A', name: 'A plain column of messages', kind: 'Plain, the Sonner way',
      line: 'Our first Taste Lab’s corner toast. Each message rises under the last, up to three. The orange line runs out and it goes. Pointing at them stops the line. × clears one.',
      from: [['Sonner', 'https://sonner.emilkowal.ski/'], house('c21')], tryit: 'Press Send invoice twice, then Undo on the first.',
      needs: 'A small script.', keys: 'Alt+T goes to the messages. Escape clears one.', off: 'Messages show and go at once. The line still counts down.', law: 'Jakob: where people look for these.',
      tags: ['motion:some', 'speed:mid', 'depth:some', 'feedback:clear', 'open:edge', 'new:familiar', 'look:ember'],
      html: tqPage(), css: String.raw`#t29A .tq { transition: transform .35s var(--ease-out), opacity .25s var(--ease-out); }`, js: String.raw`TL4tsDemo(box, { pile: false });`,
    },
    {
      k: 'C', name: 'One message that counts up', kind: 'Mix',
      line: 'Send again while the message is there and it does not stack: the number rolls up, the names grow and the timer starts over. Undo takes back every invoice in it. Other news still piles up.',
      from: [arc('toast-stack'), arc('toast'), house('n22')], tryit: 'Press Send invoice four times fast, then Undo.',
      needs: 'A small script, springs.', keys: 'Alt+T, Tab and Escape, as in B.', off: 'The number just changes.', law: 'Hick: one line for one kind of news, not four.',
      tags: ['motion:springy', 'speed:mid', 'depth:lifted', 'feedback:clear', 'open:edge', 'new:novel', 'look:ember'],
      html: tqPage(), js: String.raw`TL4tsDemo(box, { pile: true, swipe: true, merge: true });`,
    },
    {
      k: 'D', name: 'Archive rows into a pile, with a count', kind: 'Reference, pushed',
      line: 'Our n22 pushed. Archive closes the row all the way and drops a message on the pile. A small count says how many wait behind, and rolls. Undo grows the row back.',
      from: [house('n22'), arc('toast-stack')], tryit: 'Archive three orders, point at the pile, then Undo one.',
      needs: 'A small script, springs.', keys: 'Focus moves to the next row’s Archive. Alt+T goes to the pile.', off: 'Rows and messages change at once. The line still counts down.', law: 'Fitts: Undo sits in the front message, close to the list.',
      tags: ['motion:springy', 'speed:mid', 'depth:lifted', 'feedback:clear', 'open:edge', 'new:twist', 'look:ember'], h: 460,
      html: tqRows(), js: String.raw`TL4tsRows(box);`,
    },
  ],
};


/* ================= 30 Stepper ================= */
const SX = [
  { k: 'Shop', d: 'Name and town', f: [['Shop name', 'Duka Fresh Westlands', 't'], ['Town', 'Nairobi', 't']] },
  { k: 'Owner', d: 'Who runs it', f: [['Full name', 'Amina Otieno', 't'], ['ID number', '29481736', 'id']] },
  { k: 'Payouts', d: 'PocketPay number', f: [['PocketPay number', '+254 712 345 678', 'ph']] },
  { k: 'Review', d: 'Check and open', f: [] },
];
const sxCss = String.raw`
#stepper .stage { padding: 18px 16px; place-items: start stretch; }
#stepper .sx { width: 100%; min-width: 0; display: grid; gap: 16px; text-align: left; container-type: inline-size; }
#stepper .sx-top { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin: 0; font: 500 11px/1.3 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
#stepper .sx-top b { font: 400 18px/1 var(--font-num); letter-spacing: 0; color: var(--ink); }
#stepper .sx-ms { position: relative; list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
#stepper .sx-li { position: relative; z-index: 1; display: grid; justify-items: center; align-content: start; }
#stepper .sx-m { display: grid; justify-items: center; gap: 6px; padding: 0 2px 2px; border-radius: 10px; text-align: center; color: var(--muted); }
#stepper .sx-m:disabled { cursor: default; }
#stepper .sx-m:not(:disabled):hover .sx-c { transform: scale(1.06); }
#stepper .sx-m:active:not(:disabled) .sx-c { transform: scale(.97); }
#stepper .sx-m:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
#stepper .sx-c { position: relative; width: var(--cs, 34px); height: var(--cs, 34px); border-radius: 50%; display: grid; place-items: center; background: var(--paper-raised); box-shadow: inset 0 0 0 1.5px var(--line-hi); transition: background-color .3s var(--ease-out), box-shadow .3s var(--ease-out), transform var(--sp-snappy-d) var(--sp-snappy); }
#stepper .sx-c > * { grid-area: 1 / 1; }
#stepper .sx-n { font: 500 var(--ns, 16px)/1 var(--font-num); color: var(--muted); transition: opacity .2s var(--ease-out), transform .3s var(--ease-out), color .3s; }
#stepper .sx-c .tk { width: 100%; height: 100%; }
#stepper .sx-c .tk path { fill: none; stroke: var(--on-accent); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 20; stroke-dashoffset: 20; transition: stroke-dashoffset .34s var(--ease-out); }
#stepper .sx-c::after { content: ""; position: absolute; inset: -4px; border-radius: 50%; box-shadow: 0 0 0 2px var(--accent); opacity: 0; transform: scale(.7); transition: opacity .25s var(--ease-out), transform var(--sp-bouncy-d) var(--sp-bouncy); }
#stepper .sx-l { display: grid; font-size: 13px; line-height: 1.3; }
#stepper .sx-l b { font-weight: 500; color: var(--ink-soft); }
#stepper .sx-l small { font-size: 11.5px; color: var(--muted); }
@container (max-width: 420px) { #stepper .sx-l small { display: none; } }
/* states */
#stepper .is-done .sx-c { background: var(--accent); box-shadow: none; }
#stepper .is-done .sx-n { opacity: 0; transform: scale(.6); }
#stepper .is-done .tk path { stroke-dashoffset: 0; transition-delay: .12s; }
#stepper .is-cur .sx-c { box-shadow: inset 0 0 0 2px var(--accent); }
#stepper .is-cur .sx-n { color: var(--accent-text); }
#stepper .is-cur .sx-l b, #stepper .is-done .sx-l b { color: var(--ink); }
#stepper .is-err .sx-c { box-shadow: inset 0 0 0 2px var(--accent-text); }
#stepper .is-err .sx-n { color: var(--accent-text); }
#stepper .is-busy .sx-c::after { animation: sxPulse 1.1s var(--ease-out) infinite; }
@keyframes sxPulse { from { opacity: .7; transform: scale(.85); } to { opacity: 0; transform: scale(1.35); } }
/* one line behind the circles (track) */
#stepper .sx-tr { position: absolute; z-index: 0; left: 12.5%; right: 12.5%; top: calc(var(--cs, 34px) / 2 - 1px); height: 2px; border-radius: 2px; background: rgb(var(--ink-rgb) / .12); }
#stepper .sx-tr i { position: absolute; inset: 0; border-radius: inherit; background: var(--accent); transform-origin: left; transform: scaleX(var(--p, 0)); transition: transform .6s var(--ease-out); }
#stepper .sx-tr .sx-dw { position: absolute; inset: 0; transform: translateX(calc(var(--p, 0) * 100%)); transition: transform .6s var(--ease-out); }
#stepper .sx-tr .sx-dw b { position: absolute; left: -5px; top: -4px; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px var(--paper); }
/* the panel */
#stepper .sx-pan { position: relative; }
#stepper .sx-pg { display: grid; gap: 10px; }
#stepper .sx-h { margin: 0; font-size: 15px; font-weight: 600; color: var(--ink); }
#stepper .sx-f { display: grid; gap: 4px; }
#stepper .sx-f .l-lbl { margin: 0; }
#stepper .sx-f .l-err { margin: 0; }
#stepper .sx-f .l-in[aria-invalid="true"] { border-color: var(--accent-text); }
#stepper .sx-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
@container (max-width: 380px) { #stepper .sx-two { grid-template-columns: minmax(0, 1fr); } }
#stepper .sx-rv { margin: 0; display: grid; gap: 0; border-radius: 10px; border: 1px solid var(--line); background: var(--paper-raised); }
#stepper .sx-rv div { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 10fr) auto; align-items: center; gap: 8px; padding: 6px 6px 6px 12px; border-top: 1px solid var(--line); font-size: 13.5px; }
#stepper .sx-rv div:first-child { border-top: 0; }
#stepper .sx-rv dt { color: var(--muted); }
#stepper .sx-rv dd { margin: 0; color: var(--ink); min-width: 0; overflow-wrap: anywhere; }
#stepper .sx-fin { display: grid; justify-items: center; gap: 8px; padding: 10px 0 4px; text-align: center; }
#stepper .sx-fin .l-tick { width: 40px; height: 40px; }
#stepper .sx-fin b { font-size: 15px; }
#stepper .sx-fin span { font-size: 13px; color: var(--muted); }
#stepper .sx-nav { display: flex; justify-content: space-between; gap: 8px; }
#stepper .sx-nav [data-back][hidden] + * { margin-left: auto; }
#stepper .sx-nav .l-btn .l-spin { width: 14px; height: 14px; }
/* A: small circles, a line between each */
#stepper .sx-in { display: flex; align-items: center; grid-template-columns: none; }
#stepper .sx-in .sx-li { flex: none; }
#stepper .sx-in .sx-m { grid-auto-flow: column; align-items: center; gap: 8px; padding: 2px 4px; }
#stepper .sx-in .sx-cn { flex: 1; min-width: 12px; height: 2px; margin: 0 6px; border-radius: 2px; background: rgb(var(--ink-rgb) / .12); position: relative; overflow: hidden; }
#stepper .sx-in .sx-cn i { position: absolute; inset: 0; background: var(--accent); transform-origin: left; transform: scaleX(0); transition: transform .3s var(--ease-out); }
#stepper .sx-in .sx-cn.is-on i { transform: none; }
@container (max-width: 460px) { #stepper .sx-in .sx-li:not(.is-cur) .sx-l { display: none; } }
/* C: steps down the side, each opens in place */
#stepper .sx-v { list-style: none; margin: 0; padding: 0; display: grid; }
#stepper .sx-vi { position: relative; display: grid; justify-items: stretch; align-items: start; grid-template-columns: var(--cs, 34px) minmax(0, 1fr); column-gap: 12px; padding-bottom: 14px; }
#stepper .sx-vi:last-child { padding-bottom: 0; }
#stepper .sx-vi::before, #stepper .sx-vi::after { content: ""; position: absolute; left: calc(var(--cs, 34px) / 2 - 1px); top: calc(var(--cs, 34px) + 4px); bottom: 4px; width: 2px; border-radius: 2px; background: rgb(var(--ink-rgb) / .12); }
#stepper .sx-vi::after { background: var(--accent); transform-origin: top; transform: scaleY(0); transition: transform .5s var(--ease-out); }
#stepper .sx-vi.is-done::after { transform: none; }
#stepper .sx-vi:last-child::before, #stepper .sx-vi:last-child::after { display: none; }
#stepper .sx-vh { display: contents; }
#stepper .sx-vt { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: var(--cs, 34px); }
#stepper .sx-vt div { display: grid; min-width: 0; }
#stepper .sx-vt b { font-size: 14px; font-weight: 600; color: var(--ink-soft); }
#stepper .sx-vt small { font-size: 12.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#stepper .is-cur .sx-vt b, #stepper .is-done .sx-vt b { color: var(--ink); }
#stepper .sx-vb { grid-column: 2; padding-top: 8px; }
#stepper .sx-vb .sx-pg { gap: 10px; }
#stepper .sx-vb .sx-nav { margin-top: 12px; justify-content: flex-start; }
@media (pointer: coarse) { #stepper .sx-m { min-height: 44px; } }`;

const sxJs = String.raw`
window.TL4sxData = ${JSON.stringify(SX)};
window.TL4step = function (box, c) {
  c = c || {};
  var S = TL4sxData, N = S.length, cur = 0, busy = false, fin = false, vals = S.map(function (s) { return s.f.map(function (f) { return f[1]; }); });
  var root = $('[data-sx]', box), uid = box.id, V = c.layout === 'vertical', IN = c.layout === 'inline';
  function circle(i) { return '<span class="sx-c"><span class="sx-n">' + (i + 1) + '</span>${TK34}</span>'; }
  var h = '';
  if (c.count) h += '<p class="sx-top"><span>Step <b data-sn></b> of 4</span><span><b data-pc></b> done</span></p>';
  if (V) h += '<ol class="sx-v" data-ms>' + S.map(function (s, i) { return '<li class="sx-vi sx-li" data-i="' + i + '"><div class="sx-vh">' + circle(i) + '<div class="sx-vt"><div><b>' + s.k + '</b><small data-sum>' + s.d + '</small></div><button class="l-btn sm ghost" type="button" data-edit="' + i + '" hidden>Edit</button></div></div><div class="sx-vb" data-vb hidden></div></li>'; }).join('') + '</ol>';
  else h += '<ol class="sx-ms' + (IN ? ' sx-in' : '') + '" data-ms>' + (IN ? '' : '<span class="sx-tr" aria-hidden="true"><i></i>' + (c.dot ? '<span class="sx-dw"><b></b></span>' : '') + '</span>') + S.map(function (s, i) { return (IN && i ? '<li class="sx-cn" aria-hidden="true"><i></i></li>' : '') + '<li class="sx-li" data-i="' + i + '"><button class="sx-m" type="button" data-go="' + i + '">' + circle(i) + '<span class="sx-l"><b>' + s.k + '</b><small>' + s.d + '</small></span></button></li>'; }).join('') + '</ol>'
    + '<div class="sx-pan" data-pan><div class="sx-pg" data-pg></div></div>';
  h += '<p class="sr" aria-live="polite" data-say></p>';
  root.innerHTML = h;
  var ms = $('[data-ms]', root), pan = $('[data-pan]', root), say = $('[data-say]', root), lis = $$('.sx-li', root);
  var sn = c.count ? TLroll($('[data-sn]', root), { value: 1, dur: 480, live: false }) : null, pc = c.count ? TLroll($('[data-pc]', root), { value: 0, fmt: function (n) { return n + '%'; }, dur: 560, live: false }) : null;
  function navHtml() { var last = cur === N - 1; return '<div class="sx-nav"><button class="l-btn sm" type="button" data-back' + (cur === 0 ? ' hidden' : '') + '>Back</button><button class="l-btn sm pri" type="button" data-next>' + (last ? 'Open account' : 'Next') + '</button></div>'; }
  function page(i) {
    if (fin) return '<div class="sx-fin">' + TICK + '<b>' + esc(vals[0][0]) + ' is open on PocketPay.</b><span>Payouts go to ' + esc(vals[2][0]) + '.</span><button class="l-btn sm" type="button" data-again>Start again</button></div>';
    var s = S[i], out = V ? '' : '<p class="sx-h">' + s.k + '</p>';
    if (!s.f.length) out += '<dl class="sx-rv">' + S.slice(0, N - 1).map(function (t, j) { return t.f.map(function (f, k) { return '<div><dt>' + f[0] + '</dt><dd>' + esc(vals[j][k]) + '</dd>' + (k === 0 ? '<button class="l-btn sm ghost" type="button" data-edit="' + j + '">Edit</button>' : '<span></span>') + '</div>'; }).join(''); }).join('') + '</dl>';
    else out += '<div class="' + (s.f.length > 1 ? 'sx-two' : '') + '">' + s.f.map(function (f, k) { var id = uid + '-f' + i + k; return '<div class="sx-f"><label class="l-lbl" for="' + id + '">' + f[0] + '</label><input class="l-in" id="' + id + '" data-k="' + k + '" value="' + esc(vals[i][k]) + '" autocomplete="off"' + (f[2] === 'ph' ? ' inputmode="tel"' : f[2] === 'id' ? ' inputmode="numeric"' : '') + '><p class="l-err" data-err hidden></p></div>'; }).join('') + '</div>';
    return out + navHtml();
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }
  function bad(type, v) { v = v.trim(); if (type === 't') return v.length < 2 ? 'Write at least two letters.' : ''; var d = v.replace(/\D/g, '');
    if (type === 'id') return /^\d{7,9}$/.test(d) && d.length === v.replace(/\s/g, '').length ? '' : 'An ID number has 7 to 9 digits.';
    return /^(254|0)7\d{8}$/.test(d) ? '' : 'Use a number like +254 712 345 678.'; }
  function paint(prev) {
    var p = fin ? 1 : Math.min(cur, N - 1) / (N - 1);
    lis.forEach(function (li, i) { var done = fin || i < cur, on = !fin && i === cur; li.classList.toggle('is-done', done); li.classList.toggle('is-cur', on); if (!on) li.classList.remove('is-err');
      var b = $('.sx-m', li); if (b) { b.disabled = !(done || on) || busy; b.setAttribute('aria-label', 'Step ' + (i + 1) + ', ' + S[i].k + (done ? ', done' : on ? ', current step' : ', not reached yet')); if (on) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); }
      if (V) { var e = $('[data-edit]', li); e.hidden = !done || fin; $('[data-sum]', li).textContent = done && i < N - 1 ? vals[i].join(' · ') : done ? 'Opened' : S[i].d; } });
    if (!V) ms.style.setProperty('--p', p);
    if (IN) { var cns = $$('.sx-cn', ms), up = (prev == null ? 0 : prev) <= cur; cns.forEach(function (cn, j) { var on = fin || j < cur, was = cn.classList.contains('is-on'); if (on !== was) { var k = up ? j - Math.min(prev || 0, j) : (cns.length - j); $('i', cn).style.transitionDelay = (Math.max(0, k) * 120) + 'ms'; } cn.classList.toggle('is-on', on); }); }
    if (sn) { sn.set(fin ? N : cur + 1); pc.set(Math.round((fin ? N : cur) / N * 100)); }
  }
  function wire(scope) {
    $$('input', scope).forEach(function (inp) { inp.addEventListener('input', function () { vals[cur][+inp.getAttribute('data-k')] = inp.value; var er = inp.parentNode.querySelector('[data-err]'); if (!er.hidden) { er.hidden = true; inp.removeAttribute('aria-invalid'); lis[cur].classList.remove('is-err'); } });
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); next(); } }); });
    var nb = $('[data-next]', scope), bb = $('[data-back]', scope), ag = $('[data-again]', scope);
    if (nb) nb.addEventListener('click', next); if (bb) bb.addEventListener('click', function () { go(cur - 1, -1); });
    if (ag) ag.addEventListener('click', function () { fin = false; vals = S.map(function (s) { return s.f.map(function (f) { return f[1]; }); }); go(0, -1, true); });
    $$('[data-edit]', scope).forEach(function (e) { if (!scope.contains(e) || e.closest('.sx-vt')) return; e.addEventListener('click', function () { go(+e.getAttribute('data-edit'), -1, true); }); });
  }
  function next() {
    if (busy) return;
    var s = S[cur], first = null;
    s.f.forEach(function (f, k) { var inp = $('#' + uid + '-f' + cur + k), m = bad(f[2], inp.value), er = inp.parentNode.querySelector('[data-err]');
      if (m) { er.innerHTML = '<svg class="l-x" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5"/></svg>' + m; er.hidden = false; inp.setAttribute('aria-invalid', 'true'); if (!first) first = inp; } });
    if (first) { lis[cur].classList.add('is-err'); first.focus(); say.textContent = 'Please fix ' + S[cur].k + '.'; if (moving() && c.shake) first.animate([{ transform: 'none' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(-2px)' }, { transform: 'none' }], { duration: 320, easing: 'ease-out' }); return; }
    if (cur === N - 1) {
      busy = true; lis[cur].classList.add('is-busy'); var nb = $('[data-next]', V ? lis[cur] : pan); nb.innerHTML = '<span class="l-spin" aria-hidden="true"></span>Opening…'; paint();
      say.textContent = 'Opening the account.';
      setTimeout(function () { busy = false; lis[cur].classList.remove('is-busy'); fin = true; go(cur, 1); }, moving() ? 1200 : 300);
      return;
    }
    go(cur + 1, 1);
  }
  function go(n, dir, keepFocus) {
    if (n < 0 || busy) return; var prev = cur; cur = n;
    if (V) {
      lis.forEach(function (li, i) { var vb = $('[data-vb]', li), want = !fin && i === cur || (fin && i === N - 1); if (want) { vb.innerHTML = page(i); wire(vb); if (vb.hidden) { vb.hidden = false; TL4unfold(vb, 420); } } else if (!vb.hidden) { TL4fold(vb, function () { vb.hidden = true; vb.innerHTML = ''; }, 320); } });
    } else {
      var h0 = pan.offsetHeight, pg = $('[data-pg]', pan); pg.innerHTML = page(cur); wire(pg);
      if (moving() && dir) { pg.animate([{ opacity: 0, transform: c.slide === false ? 'none' : 'translateX(' + (24 * dir) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: c.slide === false ? 180 : 340, easing: 'cubic-bezier(.22,1,.36,1)' }); TL4glide(pan, h0, 380); }
    }
    paint(prev);
    say.textContent = fin ? 'Done. The account is open.' : 'Step ' + (cur + 1) + ' of ' + N + ': ' + S[cur].k + '.';
    if (dir || keepFocus) { var sc = V ? lis[fin ? N - 1 : cur] : pan, f = $('input', sc) || $('[data-again]', sc) || $('[data-next]', sc); if (f && box.contains(document.activeElement)) f.focus({ preventScroll: true }); }
  }
  ms.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-go]'); if (b && !b.disabled) { var i = +b.getAttribute('data-go'); if (i !== cur || fin) { fin = false; go(i, i < cur ? -1 : 1, true); } return; }
    var ed = e.target.closest && e.target.closest('.sx-vt [data-edit]'); if (ed) go(+ed.getAttribute('data-edit'), -1, true); });
  ms.addEventListener('keydown', function (e) { if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return; var bs = $$('.sx-m', ms).filter(function (b) { return !b.disabled; }), i = bs.indexOf(document.activeElement); if (i < 0) return; e.preventDefault(); bs[Math.max(0, Math.min(bs.length - 1, i + (e.key === 'ArrowRight' ? 1 : -1)))].focus(); });
  go(0, 0);
};`;

const sxBox = '<div class="sx" data-sx></div>';
const stepper = {
  id: 'stepper', n: '30', name: 'Stepper', h: 380,
  claim: 'Steps should show <em>what is done</em> and what comes next.',
  lead: 'Open a PocketPay account for a shop, in four steps. The fields are filled in for you: press Next, or clear one to see the error. Click a done step to go back to it.',
  ref: { ids: 'c10 · c24', text: 'Our stepper: 34 px circles, done ones orange with a tick, a 2 px line that fills orange, and the step you are on filled orange. Our timeline pulses a ring on the step that is running.', url: SHOW + '#c10', label: 'Open c10' },
  noteHint: 'B, but with D’s count', moreHint: 'steps where one can be skipped',
  css: sxCss, js: sxJs,
  opts: [
    {
      k: 'B', name: 'The number turns into a tick', kind: 'Lively, after Arc',
      line: 'Press Next and the line fills to the next circle. The done number fades as an orange tick draws in. A ring springs out around the step you are on. The page slides the way you go and the box glides to its new height.',
      from: [arc('stepper'), house('c10')], tryit: 'Press Next twice, then click step 1. Then clear the shop name and press Next.',
      needs: 'A small script, springs.', keys: 'Enter in a field goes on. Left and Right move between the circles.', off: 'Steps change at once. The tick and ring just show.', law: 'Jakob: the steps read left to right, like a parcel tracker.',
      tags: ['motion:springy', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: sxBox, css: String.raw`#t30B .is-cur .sx-c::after { opacity: 1; transform: none; transition-delay: .25s; }`, js: String.raw`TL4step(box, { shake: true });`,
    },
    {
      k: 'A', name: 'Small steps in a row', kind: 'Plain, the shadcn way',
      line: 'Small circles with the name beside each, and a short line between them that fills as you pass. The page fades. On a phone only the step you are on keeps its name.',
      from: [sh('stepper'), ['shadcn stepper', 'https://ui.shadcn.com/blocks']], tryit: 'Press Next to the end and open the account.',
      needs: 'A few lines of script.', keys: 'Enter in a field goes on. Left and Right move between steps.', off: 'Steps change at once.', law: 'Hick: one small row says where you are.',
      tags: ['motion:some', 'speed:quick', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: sxBox, css: String.raw`#t30A .sx { --cs: 26px; --ns: 13px; }
#t30A .sx-c .tk path { transition: none; stroke-width: 2.8; }`, js: String.raw`TL4step(box, { layout: 'inline', slide: false });`,
    },
    {
      k: 'C', name: 'Steps down the side, each opens in place', kind: 'Mix',
      line: 'The steps stand in a column. The one you are on opens right under its name. A done step closes to one line with what you wrote, and Edit opens it again. The line down the side fills orange.',
      from: [arc('stepper'), house('c24'), house('c10')], tryit: 'Go to step 3, then press Edit on step 1.',
      needs: 'A small script.', keys: 'Tab through the fields. Enter goes on.', off: 'Steps open and close at once.', law: 'Proximity: each answer sits under its own step.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'], h: 440,
      html: sxBox, css: String.raw`#t30C .stage { height: auto; min-height: var(--h); }
#t30C .is-cur .sx-c::after { opacity: 1; transform: none; }`, js: String.raw`TL4step(box, { layout: 'vertical' });`,
    },
    {
      k: 'D', name: 'c10 with a riding dot and a count', kind: 'Reference, pushed',
      line: 'Our c10 look: the step you are on is filled orange, with no ring. A dot rides the front of the line as it fills, like a parcel. A count on top rolls with each step. Opening the account pulses the last step while it works.',
      from: [house('c10'), house('c24'), arc('stepper')], tryit: 'Press Next to the end and watch the count, then Open account.',
      needs: 'A small script.', keys: 'Enter in a field goes on. Left and Right move between the circles.', off: 'Steps and numbers change at once. No pulse.', law: 'Jakob: the kit’s own stepper.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'], h: 410,
      html: sxBox, css: String.raw`#t30D .is-cur .sx-c { background: var(--accent); box-shadow: none; }
#t30D .is-cur .sx-n { color: var(--on-accent); }
#t30D .is-err .sx-c { background: var(--accent-text); }`, js: String.raw`TL4step(box, { count: true, dot: true });`,
    },
  ],
};


/* ================= 31 Onboarding checklist ================= */
const OB = [
  { t: 'Name your shop', d: 'Buyers see this name on every receipt.', act: 'Save name', f: ['Shop name', 'Duka Fresh Westlands'], done: 'Saved as {v}' },
  { t: 'Add your first product', d: 'Start with one thing you sell every day.', act: 'Add Sukuma wiki · KES 60', done: 'Sukuma wiki added at KES 60' },
  { t: 'Link PocketPay for payouts', d: 'Money from sales lands on this number.', act: 'Link number', f: ['PocketPay number', '+254 712 345 678'], wait: 1, done: 'Payouts go to {v}' },
  { t: 'Take a test payment', d: 'Pay yourself KES 10 to see it work.', act: 'Send KES 10 test', wait: 1, done: 'KES 10 came in just now' },
  { t: 'Share your shop link', d: 'Send duka.example.com/westlands to your first buyers.', act: 'Copy link', done: 'Link copied' },
];
const OBCK = '<svg class="ob-ck" viewBox="0 0 22 22" aria-hidden="true"><circle class="r" cx="11" cy="11" r="10.2"/><circle class="f" cx="11" cy="11" r="11"/><path d="M6.6 11.4 9.6 14.3l5.8-6.4"/></svg>';
const obCss = String.raw`
#onboarding .stage { padding: 16px; place-items: start stretch; height: auto; min-height: var(--h); }
#onboarding .ob { width: 100%; min-width: 0; display: grid; gap: 14px; text-align: left; }
#onboarding .ob-hd { display: flex; align-items: center; gap: 12px; }
#onboarding .ob-hd > div { min-width: 0; display: grid; gap: 2px; }
#onboarding .ob-t { margin: 0; font-size: 16px; font-weight: 600; color: var(--ink); }
#onboarding .ob-c { margin: 0; display: inline-flex; align-items: baseline; gap: .3em; font-size: 13px; color: var(--muted); }
#onboarding .ob-c [data-cnt], #onboarding .ob-pc { font: 400 16px/1 var(--font-num); color: var(--ink); }
#onboarding .ob-ring { position: relative; width: 46px; height: 46px; flex: none; display: grid; place-items: center; }
#onboarding .ob-ring svg:first-child { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
#onboarding .ob-ring circle { fill: none; stroke-width: 4; }
#onboarding .ob-ring .bg { stroke: rgb(var(--ink-rgb) / .1); }
#onboarding .ob-ring .fg { stroke: var(--accent); stroke-linecap: round; stroke-dasharray: 113.1; stroke-dashoffset: calc(113.1 * (1 - var(--p, 0))); transition: stroke-dashoffset .6s var(--ease-out); }
#onboarding .ob-ring b { font: 400 15px/1 var(--font-num); color: var(--ink); transition: opacity .2s; }
#onboarding .ob-ring > * { grid-area: 1 / 1; }
#onboarding .ob-ring .tk2 { width: 22px; height: 22px; }
#onboarding .ob-ring .tk2 path { fill: none; stroke: var(--accent); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 18; stroke-dashoffset: 18; transition: stroke-dashoffset .4s .3s var(--ease-out); }
#onboarding .ob.is-fin .ob-ring b { opacity: 0; }
#onboarding .ob.is-fin .ob-ring .tk2 path { stroke-dashoffset: 0; }
#onboarding .ob-bar { height: var(--bh, 4px); border-radius: 4px; background: rgb(var(--ink-rgb) / .1); overflow: hidden; }
#onboarding .ob-bar i { display: block; height: 100%; border-radius: inherit; background: var(--accent); transform-origin: left; transform: scaleX(var(--p, 0)); transition: transform .6s var(--ease-out); }
#onboarding .ob-l, #onboarding .ob-gl { list-style: none; margin: 0; padding: 0; display: grid; }
#onboarding .ob-l { border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); box-shadow: var(--shadow-sm); }
#onboarding .ob-it { position: relative; border-top: 1px solid var(--line); }
#onboarding .ob-it:first-child { border-top: 0; }
#onboarding .ob-rh { width: 100%; display: flex; align-items: center; gap: 10px; min-height: 48px; padding: 8px 12px; text-align: left; color: var(--ink); border-radius: 12px; }
#onboarding .ob-rh:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
#onboarding .ob-rh[aria-disabled="true"] { cursor: default; }
#onboarding .ob-rt { flex: 1; min-width: 0; display: grid; }
#onboarding .ob-rt b { font-size: 14px; font-weight: 600; transition: color .3s; }
#onboarding .ob-rt small { font-size: 12.5px; color: var(--muted); }
#onboarding .ob-rt small:empty { display: none; }
#onboarding .is-done .ob-rt b { color: var(--muted); font-weight: 500; }
#onboarding .ob-ch { width: 16px; height: 16px; flex: none; color: var(--muted); transition: transform .3s var(--ease-out), opacity .2s; }
#onboarding .ob-ch svg { width: 16px; height: 16px; }
#onboarding .ob-rh[aria-expanded="true"] .ob-ch { transform: rotate(180deg); }
#onboarding .is-done .ob-ch { opacity: 0; }
#onboarding .ob-ck { width: 22px; height: 22px; flex: none; overflow: visible; }
#onboarding .ob-ck .r { fill: none; stroke: var(--line-hi); stroke-width: 1.5; }
#onboarding .ob-ck .f { fill: var(--accent); transform-origin: center; transform-box: fill-box; transform: scale(.3); opacity: 0; transition: transform .3s var(--ease-out), opacity .2s; }
#onboarding .ob-ck path { fill: none; stroke: var(--on-accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 16; stroke-dashoffset: 16; transition: stroke-dashoffset .3s var(--ease-out); }
#onboarding .is-done .ob-ck .f { transform: none; opacity: 1; }
#onboarding .is-done .ob-ck path { stroke-dashoffset: 0; transition-delay: .18s; }
#onboarding .is-open:not(.is-done) .ob-ck .r { stroke: var(--accent); stroke-width: 2; }
#onboarding .ob-rb { padding: 0 12px 0 44px; }
#onboarding .ob-ri { display: grid; gap: 10px; padding-bottom: 14px; }
#onboarding .ob-ri > p { margin: 0; font-size: 13.5px; color: var(--ink-soft); }
#onboarding .ob-f { display: grid; gap: 4px; max-width: 320px; }
#onboarding .ob-f .l-lbl { margin: 0; }
#onboarding .ob-act { display: flex; gap: 8px; flex-wrap: wrap; }
#onboarding .ob-act .l-spin { width: 14px; height: 14px; }
#onboarding .ob-ri .l-err { margin: 0; }
#onboarding .ob-g { display: grid; }
#onboarding .ob-gh { justify-self: start; display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; margin-left: -4px; border-radius: 8px; font-size: 13px; font-weight: 500; color: var(--ink-soft); transition: background-color .15s; }
#onboarding .ob-gh:hover { background: rgb(var(--ink-rgb) / .06); }
#onboarding .ob-gh .ob-n { font: 400 15px/1 var(--font-num); color: var(--ink); }
#onboarding .ob-gh svg { width: 14px; height: 14px; color: var(--muted); transition: transform .3s var(--ease-out); }
#onboarding .ob-gh[aria-expanded="true"] svg { transform: rotate(180deg); }
#onboarding .ob-gl .ob-it { border-top: 0; }
#onboarding .ob-gl .ob-rh { min-height: 40px; }
#onboarding .ob-fin { display: grid; gap: 10px; padding: 14px; border-radius: 12px; background: rgb(var(--accent-rgb) / .07); }
#onboarding .ob-fin p { margin: 0; font-size: 13.5px; color: var(--ink-soft); }
#onboarding .ob-fin .ob-act .l-btn.ghost { color: var(--accent-text); }
#onboarding .ob-fin .ob-act .l-btn.ghost:hover { background: rgb(var(--accent-rgb) / .1); }
#onboarding .ob-say { margin: 0; min-height: 1.4em; font-size: 12.5px; color: var(--muted); }
/* C: one task at a time, done ones become dots */
#onboarding .ob-dots { position: relative; list-style: none; margin: 0; padding: 0; display: flex; justify-content: space-between; }
#onboarding .ob-dots::before, #onboarding .ob-dots::after { content: ""; position: absolute; left: 11px; right: 11px; top: 10px; height: 2px; border-radius: 2px; background: rgb(var(--ink-rgb) / .1); }
#onboarding .ob-dots::after { background: var(--accent); transform-origin: left; transform: scaleX(var(--p, 0)); transition: transform .6s var(--ease-out); }
#onboarding .ob-dots li { position: relative; z-index: 1; }
#onboarding .ob-dot { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: var(--paper); }
#onboarding .ob-dot:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
#onboarding .ob-dot[aria-current="step"] .ob-ck .r { stroke: var(--accent); stroke-width: 2; }
#onboarding .ob-card { position: relative; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); box-shadow: var(--shadow-sm); padding: 14px 16px; }
#onboarding .ob-card .ob-ri { padding: 0; }
#onboarding .ob-card h4 { margin: 0; font-size: 15px; font-weight: 600; color: var(--ink); }
#onboarding .ob-ghost { position: absolute; z-index: 5; margin: 0; pointer-events: none; transform-origin: 0 0; }
/* D: a timeline down the side (c24) */
#onboarding .ob-line .ob-l { border: 0; background: none; box-shadow: none; }
#onboarding .ob-line .ob-it { border-top: 0; }
#onboarding .ob-line .ob-it::before, #onboarding .ob-line .ob-it::after { content: ""; position: absolute; left: 22px; top: 36px; bottom: -12px; width: 2px; margin-left: -1px; border-radius: 2px; background: rgb(var(--ink-rgb) / .12); }
#onboarding .ob-line .ob-it::after { background: var(--accent); transform-origin: top; transform: scaleY(0); transition: transform .5s var(--ease-out); }
#onboarding .ob-line .ob-it.is-done::after { transform: none; }
#onboarding .ob-line .ob-it:last-child::before, #onboarding .ob-line .ob-it:last-child::after { display: none; }
#onboarding .ob-line .ob-rh { padding: 8px 12px 8px 11px; }
#onboarding .ob-line .ob-it.is-busy .ob-ck .r { stroke: var(--accent); animation: obPulse 1.1s var(--ease-out) infinite; transform-origin: center; transform-box: fill-box; }
@keyframes obPulse { 0% { stroke-width: 2; } 50% { stroke-width: 4; } 100% { stroke-width: 2; } }
@media (pointer: coarse) { #onboarding .ob-gh { height: 44px; } }`;

const obJs = String.raw`
window.TL4obData = ${JSON.stringify(OB)};
window.TL4obCk = ${JSON.stringify(OBCK)};
window.TL4ob = function (box, c) {
  c = c || {};
  var T = TL4obData, N = T.length, root = $('[data-ob]', box), done, vals, failed, cur, ring, cnt, gcnt, pcR, tline, FOCUS = c.mode === 'focus', GROUP = c.mode === 'group';
  function esc(t) { return String(t).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }
  function sum(i) { return T[i].done.replace('{v}', vals[i]); }
  function bodyHtml(i, head) { var t = T[i], id = box.id + '-in' + i;
    return '<div class="ob-ri">' + (head ? '<h4>' + t.t + '</h4>' : '') + '<p>' + t.d + '</p>' + (t.f ? '<div class="ob-f"><label class="l-lbl" for="' + id + '">' + t.f[0] + '</label><input class="l-in" id="' + id + '" value="' + esc(vals[i]) + '" autocomplete="off"></div>' : '') + '<div class="ob-act"><button class="l-btn sm pri" type="button" data-do="' + i + '">' + t.act + '</button></div><p class="l-err" data-err hidden></p></div>'; }
  function rowHtml(i) { return '<li class="ob-it" data-i="' + i + '"><button class="ob-rh" type="button" aria-expanded="false">' + TL4obCk + '<span class="ob-rt"><b>' + T[i].t + '</b><small data-sum></small></span><span class="ob-ch" aria-hidden="true">' + TL4i.down + '</span></button><div class="ob-rb" hidden>' + bodyHtml(i) + '</div></li>'; }
  function init() {
    done = T.map(function () { return false; }); vals = T.map(function (t) { return t.f ? t.f[1] : ''; }); failed = false; cur = 0;
    var prog = c.prog === 'ring' ? '<span class="ob-ring"><svg viewBox="0 0 46 46" aria-hidden="true"><circle class="bg" cx="23" cy="23" r="18"/><circle class="fg" cx="23" cy="23" r="18"/></svg><b data-rn></b><svg class="tk2" viewBox="0 0 22 22" aria-hidden="true"><path d="M6.6 11.4 9.6 14.3l5.8-6.4"/></svg></span>' : '';
    var h = '<div class="ob-hd">' + prog + '<div><p class="ob-t" data-title>Set up your shop</p><p class="ob-c"><span data-cnt></span> of ' + N + ' done' + (c.pct ? ' · <span class="ob-pc" data-pc></span>' : '') + '</p></div></div>';
    if (c.prog === 'bar') h += '<div class="ob-bar" aria-hidden="true"><i></i></div>';
    if (FOCUS) h += '<ol class="ob-dots" data-dots>' + T.map(function (t, i) { return '<li><button class="ob-dot" type="button" data-dot="' + i + '" aria-label="' + t.t + '">' + TL4obCk + '</button></li>'; }).join('') + '</ol><div class="ob-card" data-card></div>';
    else h += '<ol class="ob-l" data-list>' + T.map(function (t, i) { return rowHtml(i); }).join('') + '</ol>';
    if (GROUP) h += '<div class="ob-g" data-g hidden><button class="ob-gh" type="button" aria-expanded="false">Done <span class="ob-n" data-gn></span>' + TL4i.down + '</button><ol class="ob-gl" data-gl hidden></ol></div>';
    h += '<div class="ob-fin" data-fin hidden><p>Buyers can now pay <b data-fn></b> with PocketPay.</p><div class="ob-act"><button class="l-btn sm pri" type="button" data-open>Open your shop</button><button class="l-btn sm ghost" type="button" data-reset>Start over</button></div></div><p class="ob-say" data-say aria-live="polite"></p>';
    root.innerHTML = h; root.classList.remove('is-fin');
    cnt = TLroll($('[data-cnt]', root), { value: 0, dur: 520, live: false });
    ring = $('[data-rn]', root) ? TLroll($('[data-rn]', root), { value: 0, fmt: function (n) { return n + '/' + N; }, dur: 520, live: false }) : null;
    pcR = $('[data-pc]', root) ? TLroll($('[data-pc]', root), { value: 0, fmt: function (n) { return n + '%'; }, dur: 620, live: false }) : null;
    gcnt = $('[data-gn]', root) ? TLroll($('[data-gn]', root), { value: 0, dur: 480, live: false }) : null;
    tline = TLline($('[data-title]', root));
    if (GROUP) { var gh = $('.ob-gh', root), gl = $('[data-gl]', root); gh.addEventListener('click', function () { var o = gh.getAttribute('aria-expanded') !== 'true', h0 = root.offsetHeight; gh.setAttribute('aria-expanded', String(o)); gl.hidden = !o; if (o) TL4unfold(gl, 360); }); }
    $('[data-open]', root).addEventListener('click', function () { say('Opening duka.example.com/westlands.'); });
    $('[data-reset]', root).addEventListener('click', function () { init(); var f = $('[data-do]', root); if (f) f.focus({ preventScroll: true }); });
    root.addEventListener('click', onClick);
    if (FOCUS) showCard(0, 0); else { $$('.ob-it', root).forEach(function (li) { $('[data-sum]', li).textContent = ''; }); openRow(0, true); }
    progress();
  }
  function say(t) { $('[data-say]', root).textContent = t; }
  function k() { return done.filter(Boolean).length; }
  function progress() { var n = k(), p = n / N; root.style.setProperty('--p', p); cnt.set(n); if (ring) ring.set(n); if (pcR) pcR.set(Math.round(p * 100)); if (FOCUS) $('[data-dots]', root).style.setProperty('--p', Math.max(0, n - (n === N ? 0 : 0)) / (N - 1) > 1 ? 1 : lastDone() / (N - 1)); }
  function lastDone() { var l = 0; done.forEach(function (d, i) { if (d) l = i; }); return k() ? l : 0; }
  function li(i) { return $('.ob-it[data-i="' + i + '"]', root); }
  function openRow(i, instant) {
    $$('.ob-l .ob-it', root).forEach(function (r) { var j = +r.getAttribute('data-i'); if (j !== i && r.classList.contains('is-open')) closeRow(j); });
    var r = li(i), rb = $('.ob-rb', r); cur = i; r.classList.add('is-open'); $('.ob-rh', r).setAttribute('aria-expanded', 'true');
    if (rb.hidden) { rb.hidden = false; if (!instant) TL4unfold(rb, 400); }
  }
  function closeRow(i, cb) { var r = li(i); if (!r) return; var rb = $('.ob-rb', r); r.classList.remove('is-open'); $('.ob-rh', r).setAttribute('aria-expanded', 'false'); if (rb.hidden) { if (cb) cb(); return; } TL4fold(rb, function () { rb.hidden = true; if (cb) cb(); }, 320); }
  function nextTodo(i) { for (var j = 1; j <= N; j++) { var x = (i + j) % N; if (!done[x]) return x; } return -1; }
  function onClick(e) {
    var d = e.target.closest && e.target.closest('[data-do]'); if (d) { act(+d.getAttribute('data-do'), d); return; }
    var rh = e.target.closest && e.target.closest('.ob-l .ob-rh'); if (rh) { var i = +rh.parentNode.getAttribute('data-i'); if (done[i]) return; if (rh.getAttribute('aria-expanded') === 'true') closeRow(i); else openRow(i); return; }
    var dt = e.target.closest && e.target.closest('[data-dot]'); if (dt) { var j = +dt.getAttribute('data-dot'); if (!done[j] && j !== cur) showCard(j, j > cur ? 1 : -1); }
  }
  function act(i, btn) {
    if (btn.disabled) return; var t = T[i], scope = btn.closest('.ob-ri'), inp = $('input', scope), er = $('[data-err]', scope);
    if (inp) { var v = inp.value.trim(), d = v.replace(/\D/g, ''); var bad = i === 2 ? !/^(254|0)7\d{8}$/.test(d) : v.length < 2;
      if (bad) { er.textContent = i === 2 ? 'Use a number like +254 712 345 678.' : 'Write at least two letters.'; er.hidden = false; inp.focus(); return; } vals[i] = v; }
    er.hidden = true;
    if (!t.wait) { finishTask(i); return; }
    btn.disabled = true; var lab = btn.textContent; btn.innerHTML = '<span class="l-spin" aria-hidden="true"></span>' + (i === 2 ? 'Linking…' : 'Sending…');
    var row = li(i); if (row) row.classList.add('is-busy');
    setTimeout(function () { btn.disabled = false; btn.textContent = lab; if (row) row.classList.remove('is-busy');
      if (c.fail && i === 2 && !failed) { failed = true; er.textContent = 'PocketPay did not answer. Check the number and try again.'; er.hidden = false; say('Linking failed. The task stays open.'); btn.focus({ preventScroll: true }); return; }
      finishTask(i); }, moving() ? 1000 : 250);
  }
  function finishTask(i) {
    var hadF = box.contains(document.activeElement); done[i] = true; progress(); say(T[i].t + ': done. ' + k() + ' of ' + N + '.');
    var nx = nextTodo(i);
    if (FOCUS) { flyToDot(i, nx); if (nx < 0) finish(); return; }
    var r = li(i); r.classList.add('is-done'); $('[data-sum]', r).textContent = sum(i); $('.ob-rh', r).setAttribute('aria-disabled', 'true');
    setTimeout(function () {
      closeRow(i, function () {
        if (GROUP) { var g = $('[data-g]', root), gl = $('[data-gl]', root);
          TL4fold(r, function () { r.classList.remove('is-open'); gl.appendChild(r); if (g.hidden) { g.hidden = false; TL4unfold(g, 320); } gcnt.set(k()); if (!$('.ob-l .ob-it', root)) $('[data-list]', root).hidden = true; }, 320); }
      });
      if (nx >= 0) { openRow(nx); if (hadF) setTimeout(function () { var b = $('[data-do="' + nx + '"]', root); if (b) b.focus({ preventScroll: true }); }, moving() ? 60 : 0); }
      else finish();
    }, moving() ? 720 : 0);
  }
  function finish() {
    root.classList.add('is-fin'); tline.set('Your shop is ready', 1);
    var fin = $('[data-fin]', root); $('[data-fn]', fin).textContent = vals[0]; fin.hidden = false; TL4unfold(fin, 420);
    if (moving()) { var rg = $('.ob-ring', root); if (rg) rg.animate([{ transform: 'none' }, { transform: 'scale(1.08)' }, { transform: 'none' }], { duration: 520, delay: 300, easing: 'cubic-bezier(.22,1,.36,1)' }); }
    say('All ' + N + ' done. Your shop is ready.');
    setTimeout(function () { if (box.contains(document.activeElement) || document.activeElement === document.body) $('[data-open]', fin).focus({ preventScroll: true }); }, 50);
  }
  /* C */
  function showCard(i, dir) {
    var card = $('[data-card]', root), h0 = card.offsetHeight; cur = i;
    $$('[data-dot]', root).forEach(function (b, j) { if (j === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); b.parentNode.classList.toggle('is-done', done[j]); b.disabled = done[j]; });
    card.innerHTML = i < 0 ? '' : bodyHtml(i, true); card.hidden = i < 0;
    if (i >= 0 && moving() && dir) { card.firstChild.animate([{ opacity: 0, transform: 'translateX(' + (dir * 18) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 340, easing: 'cubic-bezier(.22,1,.36,1)' }); TL4glide(card, h0, 380); }
  }
  function flyToDot(i, nx) {
    var card = $('[data-card]', root), dot = $('[data-dot="' + i + '"]', root), rr = root.getBoundingClientRect(), cr = card.getBoundingClientRect(), dr = dot.getBoundingClientRect(), hadF = box.contains(document.activeElement);
    if (moving()) { var g = card.cloneNode(true); g.classList.add('ob-ghost'); g.removeAttribute('data-card'); g.style.left = (cr.left - rr.left) + 'px'; g.style.top = (cr.top - rr.top) + 'px'; g.style.width = cr.width + 'px'; root.style.position = 'relative'; root.appendChild(g);
      var sx = dr.width / cr.width, sy = dr.height / cr.height;
      g.animate([{ transform: 'none', opacity: 1, borderRadius: '12px' }, { transform: 'translate(' + (dr.left - cr.left) + 'px,' + (dr.top - cr.top) + 'px) scale(' + sx + ',' + sy + ')', opacity: 0, borderRadius: '50%' }], { duration: 460, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }).onfinish = function () { g.remove(); }; }
    showCard(nx, 1); if (nx >= 0 && hadF) { var b = $('[data-do]', card); if (b) b.focus({ preventScroll: true }); }
    $('[data-dots]', root).style.setProperty('--p', Math.min(1, k() / (N - 1)));
  }
  init();
};`;

const obBox = '<div class="ob" data-ob></div>';
const onboarding = {
  id: 'onboarding', n: '31', name: 'Onboarding checklist', h: 420,
  claim: 'Setting up should feel like <em>ticking off a short list.</em>',
  lead: 'A new Duka Fresh shop on PocketPay, in five small tasks. Do each one with its button. The task ticks, closes, and the next one opens. Finish all five for the end moment, then Start over.',
  ref: { ids: 'n47 · c24', text: 'No checklist in the kit yet. Our progress bar springs and counts up; our timeline fills an orange line and pulses the step that is running.', url: SHOW + '#n47', label: 'Open n47' },
  noteHint: 'B, but without the Done group', moreHint: 'a checklist that hides to a small ring',
  css: obCss, js: obJs,
  opts: [
    {
      k: 'B', name: 'Done tasks fold away into a group', kind: 'Lively, after Arc',
      line: 'The tick fills from the centre, then draws. A moment later the task folds out of the list into a small Done group, the ring fills and the count rolls on. Linking PocketPay fails once, to show the task stays open. At the end the ring turns into a tick.',
      from: [arc('onboarding-checklist'), house('n47')], tryit: 'Do all five. On PocketPay, press Link number twice.',
      needs: 'A small script.', keys: 'Tab and Enter. After each task, focus moves to the next task’s button.', off: 'Tasks tick, close and open at once.', law: 'Hick: only one task is open at a time.',
      tags: ['motion:some', 'speed:mid', 'feedback:loud', 'open:inplace', 'new:twist', 'look:ember'], h: 440,
      html: obBox, js: String.raw`TL4ob(box, { mode: 'group', prog: 'ring', fail: true });`,
    },
    {
      k: 'A', name: 'A plain list that ticks', kind: 'Plain, the shadcn way',
      line: 'Five tasks with a thin orange bar on top. A done task keeps its place, greys out and shows what you did. The next one opens.',
      from: [sh('accordion'), sh('progress')], tryit: 'Do the first two, then open the last one by hand.',
      needs: 'A few lines of script.', keys: 'Tab and Enter.', off: 'Tasks tick and open at once.', law: 'Jakob: the plain to-do list.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:familiar', 'look:ember'],
      html: obBox, js: String.raw`TL4ob(box, { mode: 'list', prog: 'bar' });`,
    },
    {
      k: 'C', name: 'One task at a time, done ones become dots', kind: 'Mix',
      line: 'Only one task card shows. When you finish it, the card shrinks into its dot in the row on top, the dot turns into a tick, and the next card slides in. The line between the dots fills orange.',
      from: [arc('onboarding-checklist'), house('c10')], tryit: 'Do a task, then click a later dot to skip ahead.',
      needs: 'A small script.', keys: 'Tab and Enter. The dots are buttons too.', off: 'The card just changes and the dot ticks.', law: 'Hick: one task on screen, the rest are dots.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:novel', 'look:ember'], h: 330,
      html: obBox, js: String.raw`TL4ob(box, { mode: 'focus' });`,
    },
    {
      k: 'D', name: 'The timeline as a checklist', kind: 'Reference, pushed',
      line: 'Our c24 timeline down the side: the orange line fills down as tasks are done, and the circle of a task that is working pulses. Our n47 bar on top, with a count and a percent that roll.',
      from: [house('c24'), house('n47'), arc('onboarding-checklist')], tryit: 'Do Link number and Send KES 10 test, and watch the circle while it works.',
      needs: 'A small script.', keys: 'Tab and Enter.', off: 'Tasks tick at once. No pulse.', law: 'Jakob: the kit’s own timeline.',
      tags: ['motion:some', 'speed:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'], h: 440,
      html: obBox.replace('class="ob"', 'class="ob ob-line"'), css: String.raw`#t31D .ob { --bh: 8px; }
#t31D .ob-bar i { transition: transform var(--sp-bouncy-d) var(--sp-bouncy); }`, js: String.raw`TL4ob(box, { mode: 'line', prog: 'bar', pct: true });`,
    },
  ],
};

export default [crumbs, expcard, toasts, stepper, onboarding];
