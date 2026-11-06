// Round 4, batch d: choices, pickers and upload (parts 21–26), after Arc's free parts (uiarc.dev, MIT).
// Our own code in our look. Part 21's js puts the shared helpers on window:
// TL4dflip (children glide to new places, new ones grow in, gone ones fade where they stood), TL4dfresh, and
// TL4drect (an SVG box whose four edges each ride a spring that keeps its speed, so the front edge can lead).
import { arc, house, skill } from '../src-links.mjs';

const SHOW = '../../components/showcase/index.html';

/* ================= 21 Multi-select ================= */
const msCss = String.raw`
.ms { width: min(100%, 380px); display: grid; gap: 6px; text-align: left; }
.ms-l { margin: 0; font-size: 13.5px; font-weight: 500; color: var(--ink-soft); }
.ms-f { position: relative; }
.ms-t { position: relative; width: 100%; min-height: 44px; display: flex; align-items: center; padding: 7px 66px 7px 8px; border-radius: 10px; border: 1px solid var(--line-hi); background: var(--paper-raised); color: var(--ink); font: inherit; text-align: left; cursor: pointer; transition: border-color .2s, box-shadow .2s; }
.ms-t:hover { border-color: rgb(var(--ink-rgb) / .42); }
.ms-t[aria-expanded="true"], .ms-t:focus-visible, .ms-t.is-in:focus-within { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgb(var(--accent-rgb) / .15); }
.ms-t.is-in { cursor: text; padding-right: 10px; }
.ms-chips { position: relative; flex: 1; min-width: 0; display: flex; gap: 4px; align-items: center; overflow: hidden; }
.ms-t.is-in .ms-chips { flex-wrap: wrap; overflow: visible; }
.ms-c { flex: none; display: inline-flex; align-items: center; gap: 2px; height: 28px; max-width: 8.5rem; padding: 0 10px; border-radius: 999px; background: rgb(var(--ink-rgb) / .07); font-size: 13px; font-weight: 500; color: var(--ink); white-space: nowrap; }
.ms-cn { overflow: hidden; text-overflow: ellipsis; }
.ms-more { background: transparent; box-shadow: inset 0 0 0 1px var(--line-hi); color: var(--ink-soft); font-family: var(--font-num); font-size: 14px; padding: 0 9px; }
.ms-cx { width: 22px; height: 22px; margin-right: -6px; display: grid; place-items: center; border-radius: 50%; color: var(--muted); transition: background-color .15s, color .15s; }
.ms-cx:hover { background: rgb(var(--ink-rgb) / .1); color: var(--ink); }
.ms-cx svg, .ms-x svg { width: 12px; height: 12px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; }
.ms-ph { color: var(--muted); font-size: 14.5px; padding-left: 4px; }
.ms-txt { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14.5px; padding-left: 4px; }
.ms-in { flex: 1 0 90px; min-width: 90px; height: 28px; border: 0; background: transparent; color: var(--ink); font: inherit; font-size: 14.5px; padding: 0 4px; outline: none; }
.ms-in::placeholder, .ms-q::placeholder { color: var(--muted); }
.ms-cv { position: absolute; right: 12px; top: 50%; width: 16px; height: 16px; margin-top: -8px; fill: none; stroke: var(--muted); stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; transition: transform var(--sp-snappy-d) var(--sp-snappy); }
.ms-t[aria-expanded="true"] .ms-cv { transform: rotate(180deg); }
.ms-x { position: absolute; z-index: 2; right: 34px; top: 50%; width: 28px; height: 28px; margin-top: -14px; display: grid; place-items: center; border-radius: 50%; color: var(--muted); opacity: 0; transform: scale(.6); pointer-events: none; transition: opacity .15s var(--ease-out), transform var(--sp-snappy-d) var(--sp-snappy), background-color .15s; }
.ms-x.is-on { opacity: 1; transform: none; pointer-events: auto; }
.ms-x:hover { background: rgb(var(--ink-rgb) / .08); color: var(--ink); }
.ms-pop { position: absolute; z-index: 6; left: 0; right: 0; top: calc(100% + 6px); transform-origin: 50% 0; --from: translateY(-6px) scale(.98); --in: var(--sp-snappy-d); --ease: var(--sp-snappy); }
.ms-s { display: flex; align-items: center; gap: 8px; height: 40px; margin: -5px -5px 5px; padding: 0 12px; border-bottom: 1px solid var(--line); }
.ms-si { width: 15px; height: 15px; flex: none; fill: none; stroke: var(--muted); stroke-width: 1.7; stroke-linecap: round; }
.ms-q { flex: 1; min-width: 0; height: 100%; border: 0; background: transparent; color: var(--ink); font: inherit; font-size: 14.5px; outline: none; }
.ms-lb { position: relative; list-style: none; margin: 0; padding: 0; max-height: 216px; overflow: auto; overscroll-behavior: contain; outline: none; }
.ms-lb:focus-visible { box-shadow: inset 0 0 0 2px rgb(var(--accent-rgb) / .5); border-radius: 8px; }
.ms-lb .l-hl { left: 0; right: 0; height: 36px; }
.ms-o { position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; min-height: 36px; padding: 6px 10px; border-radius: 8px; font-size: 14px; color: var(--ink); cursor: pointer; user-select: none; }
.ms-o b { font-weight: 700; }
.ms-n { margin-left: auto; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; }
.ms-ck { width: 18px; height: 18px; flex: none; display: grid; place-items: center; border-radius: 5px; border: 1.5px solid var(--line-hi); transition: background-color .15s, border-color .15s; }
.ms-ck svg { width: 12px; height: 12px; fill: none; stroke: var(--paper); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
.ms-ck .ms-tk { stroke-dasharray: 14; stroke-dashoffset: 14; transition: stroke-dashoffset .22s var(--ease-out); }
.ms-ck .ms-dash { opacity: 0; }
.ms-o[aria-selected="true"] .ms-ck, .ms-o[data-mixed] .ms-ck { background: var(--ink); border-color: var(--ink); }
.ms-o[aria-selected="true"] .ms-tk { stroke-dashoffset: 0; }
.ms-o[data-mixed] .ms-dash { opacity: 1; }
.ms-sep { height: 1px; background: var(--line); margin: 4px 6px; }
.ms-none { padding: 10px; font-size: 13.5px; color: var(--muted); }
.ms-sum { margin: 2px 0 0; font-size: 13.5px; color: var(--muted); }
.ms-sum b { font: 400 18px/1 var(--font-num); color: var(--ink); }
.ms-g { display: flex; flex-wrap: wrap; gap: 6px; padding: 6px; }
.ms-gc { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 11px; border-radius: 999px; border: 1px solid var(--line-hi); background: var(--paper-raised); font-size: 13px; font-weight: 500; color: var(--ink-soft); transition: background-color .2s, color .2s, border-color .2s, transform .15s var(--ease-out); }
.ms-gc:active { transform: scale(.97); }
.ms-gc .ms-n { margin: 0; }
.ms-gc svg { width: 0; height: 14px; margin-right: -6px; flex: none; fill: none; stroke: var(--accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transition: width var(--sp-bouncy-d) var(--sp-bouncy), margin var(--sp-bouncy-d) var(--sp-bouncy); }
.ms-gc svg path { stroke-dasharray: 14; stroke-dashoffset: 14; transition: stroke-dashoffset .3s var(--ease-out) .08s; }
.ms-gc[aria-pressed="true"] { background: var(--ink); border-color: var(--ink); color: var(--paper); }
.ms-gc[aria-pressed="true"] .ms-n { color: color-mix(in srgb, var(--paper) 70%, transparent); }
.ms-gc[aria-pressed="true"] svg { width: 14px; margin-right: 0; }
.ms-gc[aria-pressed="true"] svg path { stroke-dashoffset: 0; }
.ms-ft { display: flex; justify-content: space-between; gap: 8px; padding: 6px 6px 2px; border-top: 1px solid var(--line); margin-top: 4px; }
@media (pointer: coarse) { .ms-o { min-height: 44px; } .ms-lb .l-hl { height: 44px; } .ms-x { width: 36px; height: 36px; margin-top: -18px; right: 32px; } .ms-cx { width: 30px; height: 30px; } }`;

const msJs = String.raw`
/* ===== round 4, batch d shared helpers ===== */
/* FLIP for a row of keyed children ([data-k]): kept ones glide to their new place, new ones grow in, gone ones fade where they stood. */
window.TL4dflip = function (cont, mutate, o) {
  o = o || {};
  function kids() { return $$('[data-k]', cont).filter(function (e) { return e.parentNode === cont && !e._ghost; }); }
  var was = {};
  kids().forEach(function (e) { was[e.getAttribute('data-k')] = { el: e, r: e.getBoundingClientRect() }; });
  mutate();
  if (!moving() || o.still) return;
  var sp = TLsp(o.sp || 'snappy'), cr = cont.getBoundingClientRect(), seen = {}, n = 0;
  kids().forEach(function (e) {
    var k = e.getAttribute('data-k'), w = was[k], fr; seen[k] = 1;
    e.getAnimations().forEach(function (a) { a.cancel(); });
    var r = e.getBoundingClientRect();
    if (w) { var dx = w.r.left - r.left, dy = w.r.top - r.top; if (Math.abs(dx) > .5 || Math.abs(dy) > .5) e.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: sp.d, easing: sp.e }); }
    else if (o.from && (fr = o.from(k))) { var b = TLsp('bouncy'); e.animate([{ transform: 'translate(' + (fr.left - r.left) + 'px,' + (fr.top - r.top) + 'px)', opacity: .4 }, { transform: 'none', opacity: 1 }], { duration: b.d, easing: b.e }); }
    else e.animate([{ opacity: 0, transform: 'scale(.9)' }, { opacity: 1, transform: 'none' }], { duration: sp.d, easing: sp.e, delay: (o.stagger || 0) * n++, fill: 'backwards' });
  });
  Object.keys(was).forEach(function (k) {
    if (seen[k]) return; var w = was[k], g = w.el; if (g.parentNode === cont) return;
    g._ghost = true; g.setAttribute('aria-hidden', 'true'); g.inert = true;
    g.style.cssText += ';position:absolute;margin:0;pointer-events:none;left:' + (w.r.left - cr.left - cont.clientLeft) + 'px;top:' + (w.r.top - cr.top - cont.clientTop) + 'px;width:' + w.r.width + 'px;height:' + w.r.height + 'px';
    cont.appendChild(g); g.getAnimations().forEach(function (a) { a.cancel(); });
    g.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.9)' }], { duration: 200, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }).onfinish = function () { if (g._ghost) g.remove(); };
  });
};
/* Bring back an element that TL4dflip is fading out. */
window.TL4dfresh = function (e) { if (!e._ghost) return e; e.getAnimations().forEach(function (a) { a.cancel(); }); e._ghost = false; e.style.cssText = ''; e.inert = false; e.removeAttribute('aria-hidden'); e.remove(); return e; };
/* An SVG rect that springs to a box. Each edge has its own spring that keeps its speed when the goal changes.
   o.lead = [front ms, back ms, front zeta]: the edge on the side it moves toward leads, the other catches up. o.draw(c) runs after each paint. */
window.TL4drect = function (rect, o) {
  o = o || {}; var c = [0, 0, 0, 0], op = [0, 1, 2, 3].map(function () { return { dur: o.dur || 420, zeta: o.zeta || 1 }; });
  function paint() { if (rect) { rect.setAttribute('x', c[0].toFixed(2)); rect.setAttribute('y', c[1].toFixed(2)); rect.setAttribute('width', Math.max(0, c[2] - c[0]).toFixed(2)); rect.setAttribute('height', Math.max(0, c[3] - c[1]).toFixed(2)); } if (o.draw) o.draw(c); }
  var sp = op.map(function (p, i) { return TLvec([0], function (x) { c[i] = x[0]; paint(); }, p); });
  return { c: c, to: function (l, t, r, b, so) {
    so = so || {}; var g = [l, t, r, b];
    if (o.lead && !so.jump) {
      var mx = (l + r - c[0] - c[2]) / 2, my = (t + b - c[1] - c[3]) / 2, F = o.lead[0], S = o.lead[1], Z = o.lead[2] || 1, mid = (F + S) / 2;
      var set = function (i, front, back) { op[i].dur = front ? F : back ? S : mid; op[i].zeta = front ? Z : 1; };
      set(0, mx < -.5, mx > .5); set(2, mx > .5, mx < -.5); set(1, my < -.5, my > .5); set(3, my > .5, my < -.5);
    }
    sp.forEach(function (s, i) { s.to([g[i]], so); });
  } };
};

/* ===== part 21 ===== */
window.TL4ms = function (box, c) {
  c = c || {};
  var A = [['Westlands', 42], ['Kilimani', 35], ['Karen', 18], ['Lavington', 23], ['Parklands', 27], ['South B', 31], ['Ruaka', 12], ['Kileleshwa', 20]];
  var mode = c.mode || 'chips', inline = mode === 'inline', group = mode === 'group', plain = mode === 'plain', id = box.id, sel = [0, 1];
  var tick = '<svg viewBox="0 0 12 12" aria-hidden="true"><path class="ms-tk" d="M2.6 6.3 5 8.6l4.4-4.9"/><path class="ms-dash" d="M3.2 6h5.6"/></svg>';
  var xs = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/></svg>';
  var host = $('[data-ms]', box), h = '<p class="ms-l" id="' + id + '-l">Delivery areas</p><div class="ms-f" data-f>';
  if (inline) h += '<div class="ms-t is-in" data-t><span class="ms-chips" data-chips><input class="ms-in" data-k="input" data-q type="text" role="combobox" aria-expanded="false" aria-controls="' + id + '-lb" aria-autocomplete="list" aria-labelledby="' + id + '-l" aria-describedby="' + id + '-sum" placeholder="Type an area" autocomplete="off"></span></div>';
  else h += '<button class="ms-t" type="button" aria-haspopup="' + (group ? 'dialog' : 'listbox') + '" aria-labelledby="' + id + '-l ' + id + '-sum" data-t>' + (plain ? '<span class="ms-txt" data-txt></span>' : '<span class="ms-chips" data-chips aria-hidden="true"></span>') + '<span class="ms-ph" data-ph>Pick areas</span><svg class="ms-cv" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 6.5 8 10l3.5-3.5"/></svg></button><button class="ms-x" type="button" aria-label="Clear all areas" data-x>' + xs + '</button>';
  h += '<div class="ms-pop l-panel l-pop" data-pop' + (group ? ' role="dialog" aria-label="Pick delivery areas"' : '') + '>';
  if (group) h += '<div class="ms-g" role="group" aria-label="Delivery areas">' + A.map(function (a, i) { return '<button class="ms-gc" type="button" aria-pressed="false" data-v="' + i + '"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.3 6.5 11l6-6.5"/></svg>' + a[0] + ' <span class="ms-n">' + a[1] + '</span></button>'; }).join('') + '</div><div class="ms-ft"><button class="l-btn sm ghost" type="button" data-all>Select all</button><button class="l-btn sm" type="button" data-done>Done</button></div>';
  else {
    if (c.search) h += '<div class="ms-s"><svg class="ms-si" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5"/><path d="M10.4 10.4 13.5 13.5"/></svg><input class="ms-q" data-q type="text" role="combobox" aria-expanded="true" aria-controls="' + id + '-lb" aria-autocomplete="list" aria-label="Search areas" placeholder="Search areas" autocomplete="off"></div>';
    h += '<ul class="ms-lb" role="listbox" id="' + id + '-lb" aria-multiselectable="true" aria-label="Delivery areas"' + (c.search || inline ? '' : ' tabindex="0"') + '><li class="l-hl" role="presentation" aria-hidden="true"></li>'
      + (c.all ? '<li class="ms-o ms-all" role="option" id="' + id + '-all" data-v="all" aria-selected="false"><span class="ms-ck">' + tick + '</span><span data-allt>Select all</span></li><li class="ms-sep" role="presentation"></li>' : '')
      + A.map(function (a, i) { return '<li class="ms-o" role="option" id="' + id + '-o' + i + '" data-v="' + i + '" aria-selected="false"><span class="ms-ck">' + tick + '</span><span data-nm>' + a[0] + '</span><span class="ms-n">' + a[1] + '</span></li>'; }).join('')
      + '<li class="ms-none" role="presentation" data-none hidden></li></ul>';
  }
  h += '</div></div><p class="ms-sum" id="' + id + '-sum"><b data-na></b> <span data-aw>areas</span> · <b data-no></b> orders this week</p><p class="sr" aria-live="polite" data-say></p>';
  host.innerHTML = h;
  var f = $('[data-f]', host), t = $('[data-t]', host), chips = $('[data-chips]', host), ph = $('[data-ph]', host), txt = $('[data-txt]', host), xb = $('[data-x]', host), pp0 = $('[data-pop]', host), q = $('[data-q]', host), lb = $('.ms-lb', host), say = $('[data-say]', host);
  var na = TLroll($('[data-na]', host), { value: sel.length, live: false }), no = TLroll($('[data-no]', host), { value: 0, fmt: function (n) { return n.toLocaleString('en-KE'); }, live: false });
  function has(i) { return sel.indexOf(i) >= 0; }
  function toggle(i, on) { var k = sel.indexOf(i); if (on == null) on = k < 0; if (on && k < 0) sel.push(i); else if (!on && k >= 0) sel.splice(k, 1); return on; }
  /* field chips */
  var chipEl = {}, moreEl = null, moreR = null;
  function chip(i) { var e = chipEl[i]; if (e && e._ghost) TL4dfresh(e); if (!e) { e = chipEl[i] = document.createElement('span'); e.className = 'ms-c'; e.setAttribute('data-k', 'c' + i); e.innerHTML = '<span class="ms-cn">' + A[i][0] + '</span>' + (inline ? '<button class="ms-cx" type="button" tabindex="-1" aria-label="Remove ' + A[i][0] + '" data-rm="' + i + '">' + xs + '</button>' : ''); } return e; }
  function more(k) { if (!moreEl) { moreEl = document.createElement('span'); moreEl.className = 'ms-c ms-more'; moreEl.setAttribute('data-k', 'more'); moreEl.innerHTML = '+<span></span>'; moreR = TLroll(moreEl.lastChild, { value: k, live: false }); } else { TL4dfresh(moreEl); moreR.set(k); } return moreEl; }
  function field(o) {
    o = o || {};
    if (plain) { txt.textContent = sel.map(function (i) { return A[i][0]; }).join(', '); }
    else TL4dflip(chips, function () {
      var n = sel.length;
      var lay = function (v) {
        var want = sel.slice(0, v).map(chip); if (v < n) want.push(more(n - v)); if (inline) want.push(q);
        $$('[data-k]', chips).forEach(function (e) { if (e.parentNode === chips && !e._ghost && want.indexOf(e) < 0) e.remove(); });
        want.forEach(function (e, j) { if (chips.children[j] !== e) chips.insertBefore(e, chips.children[j] || null); });
      };
      var v = n; lay(v);
      if (!inline) while (v > 1 && chips.scrollWidth > chips.clientWidth + 1) { v--; lay(v); }
    }, { still: o.still, from: o.from });
    if (ph) ph.hidden = sel.length > 0;
    if (xb) xb.classList.toggle('is-on', sel.length > 0);
  }
  function sum() {
    var tot = 0; sel.forEach(function (i) { tot += A[i][1]; });
    na.set(sel.length); no.set(tot); $('[data-aw]', host).textContent = sel.length === 1 ? 'area' : 'areas';
  }
  /* list */
  var qv = '';
  function vis() { return lb ? $$('.ms-o[data-v]:not(.ms-all)', lb).filter(function (o) { return !o.hidden; }).map(function (o) { return +o.getAttribute('data-v'); }) : []; }
  function list() {
    if (group) { $$('.ms-gc', pp0).forEach(function (b) { b.setAttribute('aria-pressed', String(has(+b.getAttribute('data-v')))); }); $('[data-all]', pp0).textContent = sel.length === A.length ? 'Clear all' : 'Select all'; return; }
    $$('.ms-o[data-v]:not(.ms-all)', lb).forEach(function (o) {
      var i = +o.getAttribute('data-v'), nm = A[i][0], k = nm.toLowerCase().indexOf(qv.toLowerCase());
      o.hidden = !!qv && k < 0; o.setAttribute('aria-selected', String(has(i)));
      $('[data-nm]', o).innerHTML = qv && k >= 0 ? nm.slice(0, k) + '<b>' + nm.slice(k, k + qv.length) + '</b>' + nm.slice(k + qv.length) : nm;
    });
    var v = vis(), on = v.filter(has).length, all = $('.ms-all', lb), none = $('[data-none]', lb);
    if (all) { all.hidden = !v.length; all.setAttribute('aria-selected', String(!!v.length && on === v.length)); if (on && on < v.length) all.setAttribute('data-mixed', ''); else all.removeAttribute('data-mixed'); $('[data-allt]', all).textContent = qv ? 'Select all ' + v.length + (v.length === 1 ? ' match' : ' matches') : 'Select all'; var sp = all.nextElementSibling; if (sp) sp.hidden = !v.length; }
    none.hidden = v.length > 0; none.textContent = 'No area called “' + qv + '”.';
  }
  function render(o) { list(); field(o); sum(); }
  function speak(i, on) { say.textContent = (i === 'all' ? (on ? 'All shown areas added. ' : 'All shown areas removed. ') : A[i][0] + (on ? ' added. ' : ' removed. ')) + sel.length + (sel.length === 1 ? ' area.' : ' areas.'); }
  function pick(li) {
    var v = li.getAttribute('data-v');
    if (v === 'all') { var vv = vis(), allOn = vv.every(has); vv.forEach(function (i) { toggle(i, !allOn); }); render(); speak('all', !allOn); }
    else { var on = toggle(+v); render(); speak(+v, on); }
    if (inline && qv) { q.value = qv = ''; list(); nv.mark(Math.max(0, nv.items().indexOf(li))); }
  }
  var nv = null, pp;
  if (!group) {
    nv = nav(lb, '.ms-o', { hl: $('.l-hl', lb), keys: q || lb, scroller: lb, loop: true, pick: pick,
      onMark: function (el) { var k = q || lb; if (el) k.setAttribute('aria-activedescendant', el.id); else k.removeAttribute('aria-activedescendant'); } });
    lb.addEventListener('click', function (e) { var li = e.target.closest && e.target.closest('.ms-o'); if (li) pick(li); });
    if (q) lb.addEventListener('pointerdown', function (e) { e.preventDefault(); });
    if (!q) lb.addEventListener('keydown', function (e) { if (e.key === ' ') { e.preventDefault(); var li = $('.ms-o[data-on]', lb); if (li) pick(li); } });
  }
  function first() { var its = nv.items(), k = -1; its.forEach(function (li, j) { if (k < 0 && li.getAttribute('aria-selected') === 'true' && !li.classList.contains('ms-all')) k = j; }); return Math.max(0, k); }
  pp = pop(inline ? null : t, pp0, {
    arrowOpen: true, keep: inline ? f : null,
    focus: function () { return inline ? null : q || (group ? $('.ms-gc', pp0) : lb); },
    onOpen: function () { if (inline) q.setAttribute('aria-expanded', 'true'); if (q && !inline) { q.value = qv = ''; } list(); if (nv) setTimeout(function () { nv.mark(inline ? 0 : first()); }, 30); },
    onClose: function () { if (inline) q.setAttribute('aria-expanded', 'false'); if (nv) nv.clear(); }
  });
  function top() { return qv && $('.ms-all', lb) ? 1 : 0; }
  if (q) q.addEventListener('input', function () { qv = q.value.trim(); if (!pp.isOpen()) pp.set(true); list(); nv.mark(top()); });
  if (q) q.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') pp.set(false, false);
    if (inline && e.key === 'Escape' && pp.isOpen()) { e.stopPropagation(); pp.set(false, false); }
    if (inline && e.key === 'ArrowDown' && !pp.isOpen()) { e.preventDefault(); e.stopImmediatePropagation(); pp.set(true); }
    if (inline && e.key === 'Backspace' && !q.value && sel.length) { var i = sel[sel.length - 1]; toggle(i, false); render(); speak(i, false); }
  });
  if (inline) {
    q.addEventListener('focus', function () { if (!pp.isOpen()) pp.set(true); });
    t.addEventListener('pointerdown', function (e) { if (e.target === t || e.target === chips) { e.preventDefault(); q.focus(); } });
    chips.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-rm]'); if (!b) return; var i = +b.getAttribute('data-rm'); toggle(i, false); render(); speak(i, false); q.focus(); });
  } else {
    t.addEventListener('keydown', function (e) { if (e.key === 'Backspace' && sel.length) { e.preventDefault(); var i = sel[sel.length - 1]; toggle(i, false); render(); speak(i, false); } if (e.key === 'ArrowUp' && !pp.isOpen()) { e.preventDefault(); pp.set(true); } });
    xb.addEventListener('click', function () { sel = []; render(); say.textContent = 'All areas cleared.'; t.focus(); });
  }
  if (group) {
    var gcs = $$('.ms-gc', pp0);
    gcs.forEach(function (b, j) {
      b.addEventListener('click', function () { var i = +b.getAttribute('data-v'), on = toggle(i); list(); field({ from: on ? function (k) { return k === 'c' + i ? b.getBoundingClientRect() : null; } : null }); sum(); speak(i, on); });
      b.addEventListener('keydown', function (e) { var n = gcs.length, k = { ArrowRight: j + 1, ArrowDown: j + 1, ArrowLeft: j - 1, ArrowUp: j - 1, Home: 0, End: n - 1 }[e.key]; if (k == null) return; e.preventDefault(); gcs[(k + n) % n].focus(); });
    });
    $('[data-all]', pp0).addEventListener('click', function () { var on = sel.length !== A.length; A.forEach(function (a, i) { toggle(i, on); }); render(); speak('all', on); });
    $('[data-done]', pp0).addEventListener('click', function () { pp.set(false); });
  }
  render({ still: true });
  if ('ResizeObserver' in window) new ResizeObserver(function () { field({ still: true }); }).observe(f);
  if (document.fonts) document.fonts.ready.then(function () { field({ still: true }); });
};`;

const msHtml = '<div data-ms style="width:min(100%,380px)"></div>';
const multisel = {
  id: 'multisel', n: '21', name: 'Multi-select', h: 450,
  claim: 'Picking several things should <em>keep the field easy to read.</em>',
  lead: 'Duka Fresh picks the areas its riders cover this week. Open the field, pick a few, search, and watch the chips make room. The line under it adds up the orders.',
  ref: { ids: 'n45 · n46', text: 'Round 2’s tags C and D: tags that suggest as you type (n45), and filter chips that fill ink and add up (n46).', url: SHOW + '#n46', label: 'Open n46' },
  noteHint: 'B, but with D’s chips in the list', moreHint: 'a multi-select for people, with photos',
  css: msCss, js: msJs,
  opts: [
    {
      k: 'B', name: 'Chips that make room, a search, and Select all', kind: 'Lively, after Arc',
      line: 'The field keeps one line. A new chip grows in and its neighbours glide aside; a chip that leaves fades where it stood. When they no longer fit, a +2 chip rolls its number. The list springs open with a search box and Select all.',
      from: [arc('multi-select'), house('n45'), house('n07')], tryit: 'Pick five areas, then type “la” and press Enter.',
      needs: 'A small script. Chips move with transforms only.', keys: 'Down or Enter opens. Type to search. Up and Down move, Enter ticks. Backspace on the field drops the last chip. Escape closes.', off: 'Chips and ticks appear at once. The numbers swap.', law: 'Hick: a search box cuts a long list down before you choose.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'open:trigger', 'new:twist', 'look:ember'],
      html: msHtml, top: true, js: String.raw`TL4ms(box, { mode: 'chips', search: true, all: true });`,
    },
    {
      k: 'A', name: 'A plain list with ticks', kind: 'Plain',
      line: 'The shadcn way. The field lists the names in words and cuts them off with dots. The list fades in. Each row has a tick box. Nothing slides.',
      from: [['shadcn/ui combobox', 'https://ui.shadcn.com/docs/components/combobox'], arc('multi-select')], tryit: 'Tick three areas, then press Escape.',
      needs: 'A small script.', keys: 'Down opens. Up and Down move, Space or Enter ticks. Escape closes.', off: 'Same; it was nearly still already.', law: 'Jakob: it looks like most multi-selects.',
      tags: ['motion:still', 'speed:quick', 'density:compact', 'feedback:quiet', 'open:trigger', 'new:familiar', 'look:ember'],
      html: msHtml, top: true,
      css: String.raw`#t21A .ms-pop { --from: none; --in: .15s; --ease: var(--ease-out); }
#t21A .ms-ck .ms-tk, #t21A .ms-lb .l-hl { transition: none; }`,
      js: String.raw`TL4ms(box, { mode: 'plain' });`,
    },
    {
      k: 'C', name: 'Type in the field, chips wrap', kind: 'Mix',
      line: 'Our tags that suggest (n45), for a fixed list. You type straight into the field and the matching letters show in bold. Enter ticks the marked area and clears what you typed. Chips wrap onto new lines and each has its own ×.',
      from: [house('n45'), arc('multi-select')], tryit: 'Type “k”, press Enter twice, then Backspace.',
      needs: 'A small script.', keys: 'Type to search. Up and Down move, Enter ticks. Backspace in the empty box removes the last chip. Escape closes.', off: 'Chips appear and leave at once.', law: 'Proximity: what you typed and what you picked sit in one box.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:clear', 'open:trigger', 'new:twist', 'look:ember'],
      html: msHtml, top: true, js: String.raw`TL4ms(box, { mode: 'inline', all: true });`,
    },
    {
      k: 'D', name: 'Filter chips that fly up into the field', kind: 'Reference, pushed',
      line: 'Our filter chips (n46), pushed. The field opens a panel with every area as a chip. A chip you turn on fills ink, its tick slides in, and a copy flies up into the field on a spring. The order count rolls.',
      from: [house('n46'), arc('multi-select'), skill('animate')], tryit: 'Open it and turn on Karen, then Ruaka. Watch them fly up.',
      needs: 'A small script and CSS springs.', keys: 'Enter opens. Arrow keys move between chips, Space turns one on or off. Escape closes.', off: 'The chips land in the field at once.', law: 'Fitts: every choice is a big target, all in view.',
      tags: ['motion:springy', 'speed:mid', 'density:roomy', 'feedback:loud', 'open:trigger', 'new:novel', 'look:ember'],
      html: msHtml, top: true, js: String.raw`TL4ms(box, { mode: 'group' });`,
    },
  ],
};

/* ================= 22 Radio cards ================= */
const rcCss = String.raw`
#radiocards .stage, #segmented .stage { container-type: inline-size; }
.rc { width: min(100%, 420px); display: grid; gap: 12px; text-align: left; }
.rc-l { margin: 0; font-size: 13.5px; font-weight: 500; color: var(--ink-soft); }
.rc-g { position: relative; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.rc.is-list .rc-g { grid-template-columns: minmax(0, 1fr); gap: 6px; }
@container (max-width: 360px) { .rc:not(.is-row) .rc-g { grid-template-columns: minmax(0, 1fr); } }
.rc-ring { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; z-index: 3; }
.rc-ring rect { fill: none; stroke: var(--accent); stroke-width: 1.5; }
.rc-c { position: relative; z-index: 1; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 2px 10px; align-items: baseline; align-content: start; padding: 12px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); cursor: pointer; transition: border-color .2s, transform var(--sp-bouncy-d) var(--sp-bouncy), background-color .2s; }
.rc-c:hover { border-color: var(--line-hi); }
.rc-c input { position: absolute; opacity: 0; width: 1px; height: 1px; margin: 0; }
.rc-c:has(input:focus-visible) { outline: 2px solid var(--accent); outline-offset: 3px; }
.rc-c:has(input:checked) { border-color: transparent; }
.rc-c:has(input:disabled) { cursor: not-allowed; background: var(--paper); }
.rc-c:has(input:disabled) .rc-n, .rc-c:has(input:disabled) .rc-p { color: var(--muted); }
.rc-dot { grid-row: 1; align-self: center; width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid var(--line-hi); display: grid; place-items: center; transition: border-color .2s; }
.rc-dot::after { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); transform: scale(.4); opacity: 0; transition: transform var(--sp-snappy-d) var(--sp-snappy), opacity .15s; }
.rc-c:has(input:checked) .rc-dot { border-color: var(--accent); }
.rc-c:has(input:checked) .rc-dot::after { transform: none; opacity: 1; }
.rc-n { font-size: 14.5px; font-weight: 600; color: var(--ink); }
.rc-p { font: 400 17px/1 var(--font-num); color: var(--ink); white-space: nowrap; }
.rc-d { grid-column: 2 / -1; font-size: 13px; line-height: 1.4; color: var(--muted); }
.rc-off { grid-column: 2 / -1; display: flex; gap: 5px; align-items: center; font-size: 12.5px; line-height: 1.35; color: var(--ink-soft); }
.rc-off svg { width: 13px; height: 13px; flex: none; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.rc-more { grid-column: 2 / -1; display: grid; grid-template-rows: 0fr; transition: grid-template-rows .4s var(--ease-out); }
.rc-more > span { overflow: hidden; font-size: 12.5px; color: var(--ink-soft); }
.rc-c:has(input:checked) .rc-more { grid-template-rows: 1fr; }
.rc-c:has(input:checked) .rc-more > span { padding-top: 4px; }
.rc-tk { position: absolute; right: 9px; top: 9px; width: 18px; height: 18px; opacity: 0; transition: opacity .2s; }
.rc-tk circle { fill: var(--accent); }
.rc-tk path { fill: none; stroke: var(--on-accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 16; stroke-dashoffset: 16; }
.rc-c:has(input:checked) .rc-tk { opacity: 1; }
.rc-c:has(input:checked) .rc-tk path { stroke-dashoffset: 0; transition: stroke-dashoffset .34s var(--ease-out) .12s; }
.rc-sum { overflow: hidden; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); }
.rc-si { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2px 12px; align-items: baseline; padding: 12px 14px; }
.rc-big { margin: 0; font: 400 24px/1.1 var(--font-num); color: var(--ink); }
.rc-big small { font: 500 12px/1 var(--font-body); color: var(--muted); margin-left: 4px; }
.rc-gb { margin: 0; font-size: 12.5px; color: var(--muted); text-align: right; }
.rc-gb b { font: 400 16px/1 var(--font-num); color: var(--ink); }
.rc-m { grid-column: 1 / -1; margin: 0; font-size: 13px; color: var(--ink-soft); }
.rc-line { margin: 0; font-size: 13.5px; color: var(--muted); }
.rc-line b { font: 400 18px/1 var(--font-num); color: var(--ink); }
@media (pointer: coarse) { .rc-c { min-height: 52px; } }`;

const rcJs = String.raw`
window.TL4rc = function (box, c) {
  c = c || {};
  var P = [
    { n: 'Daily', d: '1 GB. Lasts 24 hours.', p: 99, gb: 1, m: 'Renews tomorrow at 9:00 am.' },
    { n: 'Weekly', d: '6 GB. Lasts 7 days.', p: 499, gb: 6, m: 'Renews every Thursday.' },
    { n: 'Monthly', d: '25 GB. Lasts 30 days.', p: 1999, gb: 25, m: 'Renews on 5 December. The best price for each GB.' },
    { n: 'Unlimited', d: 'No cap. Lasts 30 days.', p: 4999, off: 'Not on your SIM yet. A Mawimbi shop can switch it.' }
  ];
  var host = $('[data-rc]', box), id = box.id, cur = 1, lock = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="7" width="9" height="6.5" rx="1.6"/><path d="M5.5 7V5.3a2.5 2.5 0 0 1 5 0V7"/></svg>';
  var tk = '<svg class="rc-tk" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="11"/><path d="M6.6 11.4 9.6 14.3l5.8-6.4"/></svg>';
  host.className = 'rc' + (c.layout === 'list' ? ' is-list' : '');
  host.innerHTML = '<p class="rc-l" id="' + id + '-l">Data bundle for 0712 345 678</p><div class="rc-g" role="radiogroup" aria-labelledby="' + id + '-l">' + (c.ring ? '<svg class="rc-ring" aria-hidden="true"><rect rx="11.5"/></svg>' : '')
    + P.map(function (x, i) { return '<label class="rc-c"><input type="radio" name="' + id + '-b" value="' + i + '"' + (i === cur ? ' checked' : '') + (x.off ? ' disabled' : '') + '>' + (c.dot ? '<span class="rc-dot" aria-hidden="true"></span>' : '<span></span>') + '<span class="rc-n">' + x.n + '</span><span class="rc-p">KES ' + x.p.toLocaleString('en-KE') + '</span><span class="rc-d">' + x.d + '</span>' + (x.off ? '<span class="rc-off">' + lock + x.off + '</span>' : '') + (c.more && !x.off ? '<span class="rc-more"><span>' + x.m + '</span></span>' : '') + (c.tick ? tk : '') + '</label>'; }).join('')
    + '</div>' + (c.sum ? '<div class="rc-sum" data-sum><div class="rc-si"><p class="rc-big"><span data-p></span><small>today</small></p><p class="rc-gb"><b data-g></b> a GB</p><p class="rc-m" data-m></p></div></div>' : '<p class="rc-line">You pay <b data-p></b> today · <b data-g></b> a GB</p>') + '<p class="sr" aria-live="polite" data-say></p>';
  var g = $('.rc-g', host), cards = $$('.rc-c', host), ins = $$('input', host), say = $('[data-say]', host), m = $('[data-m]', host), sumEl = $('[data-sum]', host);
  var price = TLroll($('[data-p]', host), { value: P[cur].p, fmt: TLkes, dur: 560, live: false });
  var per = TLroll($('[data-g]', host), { value: Math.round(P[cur].p / P[cur].gb), fmt: TLkes, dur: 560, live: false });
  var ml = m ? TLline(m) : null; if (ml) ml.set(P[cur].m, 1);
  var ring = c.ring ? TL4drect($('.rc-ring rect', host), c.ring) : null, follow = 0;
  function place(jump) { if (!ring) return; var e = cards[cur]; ring.to(e.offsetLeft + .75, e.offsetTop + .75 - (c.lift ? 3 : 0), e.offsetLeft + e.offsetWidth - .75, e.offsetTop + e.offsetHeight - .75 - (c.lift ? 3 : 0), { jump: jump }); }
  function track() { var t0 = performance.now(); cancelAnimationFrame(follow); (function f(t) { place(false); if (t - t0 < 520) follow = requestAnimationFrame(f); else follow = 0; })(t0); }
  ins.forEach(function (x, i) { x.addEventListener('change', function () {
    var dir = i > cur ? 1 : -1, h0 = sumEl ? sumEl.offsetHeight : 0; cur = i; var b = P[i];
    if (c.more && moving()) track(); else place(false);
    price.set(b.p); per.set(Math.round(b.p / b.gb));
    if (ml) { ml.set(b.m, dir); if (sumEl && moving()) TLglide(sumEl, h0, 320); }
    say.textContent = b.n + ', KES ' + b.p.toLocaleString('en-KE') + '. ' + b.m;
  }); });
  place(true);
  if ('ResizeObserver' in window) new ResizeObserver(function () { if (!follow) place(true); }).observe(g);
  if (document.fonts) document.fonts.ready.then(function () { place(true); });
};`;

const rcHtml = '<div data-rc></div>';
const radiocards = {
  id: 'radiocards', n: '22', name: 'Radio cards', h: 400,
  claim: 'A choice with a price should <em>show what each one gets you.</em>',
  lead: 'Mawimbi Mobile sells data bundles. Each card has a name, a price and what you get. One cannot be picked yet, and it says why. The price and the cost for each GB roll as you choose.',
  ref: { ids: 'n43', text: 'Round 2’s choice G: an orange frame springs between three cards, the picked one lifts and draws a tick, and a box under them explains the pick.', url: SHOW + '#n43', label: 'Open n43' },
  noteHint: 'B, but with D’s tick', moreHint: 'radio cards for a phone plan with a picture each',
  css: rcCss, js: rcJs,
  opts: [
    {
      k: 'B', name: 'One ring that stretches to the card you pick', kind: 'Lively, after Arc',
      line: 'One orange ring moves from card to card. Its front edge leads and the back edge catches up, so it stretches as it goes, and it takes the new card’s size. The dot springs in. A box below rolls the price.',
      from: [arc('radio-cards'), house('n43'), house('n07')], tryit: 'Click Daily, then Monthly, then press the arrow keys fast.',
      needs: 'A small script: one spring for each edge of the ring.', keys: 'Tab in. Arrow keys pick and skip Unlimited.', off: 'The ring jumps to the card. The numbers swap.', law: 'Hick: price and what you get sit together, so you compare at a glance.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: rcHtml, js: String.raw`TL4rc(box, { dot: true, sum: true, ring: { lead: [230, 520, .78] } });`,
    },
    {
      k: 'A', name: 'A plain list of cards', kind: 'Plain',
      line: 'The picked card’s own border turns orange and its dot fills. Nothing travels. The line under it says what you pay.',
      from: [['shadcn/ui radio group', 'https://ui.shadcn.com/docs/components/radio-group'], arc('radio-cards')], tryit: 'Pick Monthly with the arrow keys.',
      needs: 'CSS only, plus the rolling number.', keys: 'Tab in. Arrow keys pick.', off: 'Same; only the numbers swap.', law: 'Jakob: it works like any list of radio buttons.',
      tags: ['motion:still', 'speed:quick', 'density:compact', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: rcHtml, css: String.raw`#t22A .rc-c:has(input:checked) { border-color: var(--accent); }
#t22A .rc-dot::after { transition: opacity .15s; transform: none; }`,
      js: String.raw`TL4rc(box, { dot: true, layout: 'list' });`,
    },
    {
      k: 'C', name: 'A list where the picked card opens', kind: 'Mix',
      line: 'A list. The ring slides down or up and stretches the same way as B. The picked card also opens a line that says when it renews, and the ring grows with it as it opens.',
      from: [arc('radio-cards'), house('n43'), house('n35')], tryit: 'Go from Daily to Monthly and watch the ring grow.',
      needs: 'A small script and a CSS grid that opens.', keys: 'Tab in. Arrow keys pick.', off: 'The card opens at once and the ring jumps.', law: 'Proximity: what the pick means opens inside the card you picked.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:clear', 'open:inplace', 'new:novel', 'look:ember'],
      html: rcHtml, js: String.raw`TL4rc(box, { dot: true, layout: 'list', more: true, ring: { lead: [230, 520, .8] } });`,
    },
    {
      k: 'D', name: 'Our springing frame, now with speed and size', kind: 'Reference, pushed',
      line: 'Our n43, pushed. The frame springs with a little bounce and keeps its speed when you change your mind mid-move. The picked card lifts 3 px and draws its tick. The box below glides to its new height and rolls the price.',
      from: [house('n43'), arc('radio-cards'), house('n07')], tryit: 'Click Monthly, then Daily before the frame lands.',
      needs: 'A small script and CSS springs.', keys: 'Tab in. Arrow keys pick.', off: 'The frame jumps and the box swaps at once.', law: 'Hick: the box tells you what a choice means before you move on.',
      tags: ['motion:springy', 'speed:mid', 'depth:lifted', 'feedback:loud', 'open:inplace', 'new:twist', 'look:ember'],
      html: rcHtml, css: String.raw`#t22D .rc-c:has(input:checked) { transform: translateY(-3px); }
#t22D .rc-ring { filter: drop-shadow(0 10px 18px rgb(0 0 0 / .12)); }
#t22D .rc-c { grid-template-columns: 0 minmax(0, 1fr) auto; column-gap: 0; padding-right: 34px; }
#t22D .rc-d, #t22D .rc-off { grid-column: 2 / -1; }`,
      js: String.raw`TL4rc(box, { tick: true, sum: true, lift: true, ring: { dur: 520, zeta: .62 } });`,
    },
  ],
};

/* ================= 23 Segmented control ================= */
const sgCss = String.raw`
.sg { width: min(100%, 420px); display: grid; gap: 14px; justify-items: start; text-align: left; }
.sg-tr { position: relative; isolation: isolate; display: inline-flex; max-width: 100%; gap: 2px; padding: 3px; border-radius: 10px; background: rgb(var(--ink-rgb) / .06); border: 1px solid var(--line); touch-action: pan-y; user-select: none; -webkit-user-select: none; }
.sg.is-eq .sg-tr { display: inline-grid; grid-auto-columns: minmax(0, 1fr); grid-auto-flow: column; }
.sg-pill { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; z-index: -1; pointer-events: none; filter: drop-shadow(0 1px 1.5px rgb(0 0 0 / .1)); }
.sg-pill rect { fill: var(--paper-raised); stroke: var(--line); stroke-width: 1; }
.sg-b { position: relative; height: 32px; padding: 0 13px; border-radius: 7px; font-size: 13.5px; font-weight: 500; color: var(--muted); white-space: nowrap; transition: color .16s var(--ease-out); }
.sg-b > span { display: inline-block; transition: transform .15s var(--ease-out); }
.sg-b:active > span { transform: scale(.97); }
@media (hover: hover) and (pointer: fine) { .sg-b:hover { color: var(--ink); } }
.sg-b[aria-checked="true"] { color: var(--ink); }
.sg-b:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.sg-ov { position: absolute; inset: 0; display: flex; gap: 2px; padding: 3px; pointer-events: none; }
.sg.is-eq .sg-ov { display: grid; grid-auto-columns: minmax(0, 1fr); grid-auto-flow: column; }
.sg-ov .sg-b { color: var(--paper); }
.sg.is-ink .sg-pill { filter: none; }
.sg.is-ink .sg-pill rect { fill: var(--ink); stroke: none; }
.sg.is-ink .sg-tr { background: var(--paper-raised); border-color: var(--line-hi); }
.sg.is-ink .sg-tr > .sg-b[aria-checked="true"] { color: var(--muted); }
.sg-out { margin: 0; font-size: 13.5px; color: var(--muted); }
.sg-out b { font: 400 20px/1 var(--font-num); color: var(--ink); }
.sg.is-grab .sg-tr { cursor: grabbing; }
.sg-view { width: 100%; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.sg-st { padding: 10px 12px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); min-width: 0; }
.sg-st p { margin: 0; font: 500 10.5px/1.3 var(--font-mono); letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.sg-st b { display: block; margin-top: 4px; font: 400 20px/1.1 var(--font-num); color: var(--ink); white-space: nowrap; }
.sg-cap { margin: 0; font-size: 13px; color: var(--ink-soft); }
@container (max-width: 380px) { .sg-view { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); } .sg-st:first-child { grid-column: 1 / -1; } .sg-b { padding: 0 10px; font-size: 13px; } }
@media (pointer: coarse) { .sg-b { height: 40px; } }`;

const sgJs = String.raw`
window.TL4sg = function (box, c) {
  c = c || {};
  var S = [['Today', 18450, 42, 'Since 6 am, Thursday 5 November.'], ['Week', 126300, 288, 'Monday 2 to Thursday 5 November.'], ['Month', 498700, 1130, 'From 1 November.'], ['All time', 6204900, 14820, 'Since the shop opened in March 2024.']];
  var host = $('[data-sg]', box), cur = 0, btn = function (s, i, ov) { return '<button class="sg-b" type="button"' + (ov ? ' tabindex="-1"' : ' role="radio" aria-checked="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '"') + '><span>' + s[0] + '</span></button>'; };
  host.className = 'sg' + (c.eq ? ' is-eq' : '') + (c.ink ? ' is-ink' : '');
  host.innerHTML = '<div class="sg-tr" role="radiogroup" aria-label="Sales period"><svg class="sg-pill" aria-hidden="true"><rect rx="7"/></svg>' + S.map(function (s, i) { return btn(s, i); }).join('') + (c.ink ? '<div class="sg-ov" aria-hidden="true" inert>' + S.map(function (s, i) { return btn(s, i, 1); }).join('') + '</div>' : '') + '</div>'
    + (c.view ? '<div class="sg-view" data-view><div class="sg-st"><p>Sales</p><b data-a></b></div><div class="sg-st"><p>Orders</p><b data-o></b></div><div class="sg-st"><p>Average</p><b data-v></b></div></div><p class="sg-cap" data-cap></p>' : '<p class="sg-out"><b data-a></b> from <b data-o></b> orders</p>');
  var tr = $('.sg-tr', host), bs = $$('.sg-tr > .sg-b', host), ov = $('.sg-ov', host), rect = $('.sg-pill rect', host);
  var a = TLroll($('[data-a]', host), { value: S[0][1], fmt: TLkes, dur: 620, live: false });
  var o = TLroll($('[data-o]', host), { value: S[0][2], fmt: function (n) { return n.toLocaleString('en-KE'); }, dur: 620, live: false });
  var av = c.view ? TLroll($('[data-v]', host), { value: Math.round(S[0][1] / S[0][2]), fmt: TLkes, dur: 620, live: false }) : null, cap = c.view ? TLline($('[data-cap]', host)) : null;
  if (cap) cap.set(S[0][3], 1);
  var sr = document.createElement('p'); sr.className = 'sr'; sr.setAttribute('aria-live', 'polite'); host.appendChild(sr);
  var pill = TL4drect(rect, { dur: c.dur || 420, zeta: c.zeta || 1, lead: c.lead, draw: ov ? function (k) { var W = tr.clientWidth, H = tr.clientHeight; ov.style.clipPath = 'inset(' + k[1].toFixed(2) + 'px ' + (W - k[2]).toFixed(2) + 'px ' + (H - k[3]).toFixed(2) + 'px ' + k[0].toFixed(2) + 'px round 7px)'; } : null });
  function box_(i) { var b = bs[i]; return [b.offsetLeft, b.offsetTop, b.offsetLeft + b.offsetWidth, b.offsetTop + b.offsetHeight]; }
  function place(jump) { var r = box_(cur); pill.to(r[0], r[1], r[2], r[3], { jump: jump }); }
  function go(i, focus) {
    if (focus) bs[i].focus();
    if (i === cur) return; var dir = i > cur ? 1 : -1; cur = i;
    bs.forEach(function (b, j) { b.setAttribute('aria-checked', String(j === i)); b.tabIndex = j === i ? 0 : -1; });
    place(false); a.set(S[i][1]); o.set(S[i][2]);
    if (av) { av.set(Math.round(S[i][1] / S[i][2])); cap.set(S[i][3], dir); var v = $('[data-view]', host); if (moving()) v.animate([{ transform: 'translateX(' + (dir * 8) + 'px)', opacity: .5 }, { transform: 'none', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' }); }
    sr.textContent = S[i][0] + ': ' + TLkes(S[i][1]) + ' from ' + S[i][2] + ' orders.';
  }
  bs.forEach(function (b, i) {
    b.addEventListener('click', function () { if (!dragged) go(i); });
    b.addEventListener('keydown', function (e) { var n = bs.length, j = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[e.key]; if (j == null) return; e.preventDefault(); go((j + n) % n, true); });
  });
  /* C: press on the picked one and slide */
  var drag = null, dragged = false;
  if (c.drag) {
    tr.addEventListener('pointerdown', function (e) {
      var b = e.target.closest && e.target.closest('.sg-b'); dragged = false; if (!b || bs.indexOf(b) !== cur) return;
      var r = box_(cur); drag = { x: e.clientX, l: r[0], w: r[2] - r[0] }; tr.setPointerCapture(e.pointerId);
    });
    tr.addEventListener('pointermove', function (e) {
      if (!drag) return; var dx = e.clientX - drag.x; if (!dragged && Math.abs(dx) < 4) return;
      dragged = true; host.classList.add('is-grab');
      var lo = box_(0)[0], hi = box_(bs.length - 1)[0], l = drag.l + dx;
      if (l < lo) l = lo - Math.sqrt(lo - l) * 2; if (l > hi) l = hi + Math.sqrt(l - hi) * 2;
      var r = box_(cur); pill.to(l, r[1], l + drag.w, r[3]);
      var mid = l + drag.w / 2, k = 0; bs.forEach(function (b, j) { if (mid >= b.offsetLeft) k = j; });
      if (k !== cur) { go(k); pill.to(l, r[1], l + drag.w, r[3]); }
    });
    var end = function () { if (!drag) return; drag = null; host.classList.remove('is-grab'); place(false); setTimeout(function () { dragged = false; }, 0); };
    tr.addEventListener('pointerup', end); tr.addEventListener('pointercancel', end);
  }
  place(true);
  if ('ResizeObserver' in window) new ResizeObserver(function () { if (!drag) place(true); }).observe(tr);
  if (document.fonts) document.fonts.ready.then(function () { place(true); });
};`;

const sgHtml = '<div data-sg></div>';
const segmented = {
  id: 'segmented', n: '23', name: 'Segmented control', h: 220,
  claim: 'A switch between views should <em>glide like one thing.</em>',
  lead: 'Arc’s switch feels more fluid than ours. We read both. Ours moves the pill with a CSS transition, and buttons all share one width. When you click again mid-move, a CSS transition stops dead and starts again from rest, so the pill hitches. Theirs is a real spring that keeps its speed, fits each label, and lands with no bounce. Click fast, or hold an arrow key, to feel it.',
  ref: { ids: 'TLseg · n17', text: 'Round 3’s month switch: equal buttons and a paper pill on a CSS spring. The house tabs (n17) glide an ink marker on a .25 s curve.', url: SHOW + '#n17', label: 'Open n17' },
  noteHint: 'B’s stretch, with D’s ink', moreHint: 'a segmented control with a count in each part',
  css: sgCss, js: sgJs,
  opts: [
    {
      k: 'B', name: 'The pill stretches toward your pick, then catches up', kind: 'Lively, beats Arc',
      line: 'Each edge of the pill has its own spring. The edge in front moves fast and gives a tiny bit at the end. The back edge follows a beat later, so the pill stretches toward your pick and then pulls in. Both keep their speed if you click again.',
      from: [arc('segmented-control'), skill('animate'), house('n17')], tryit: 'Click Today, then All time. Then hold the right arrow key.',
      needs: 'A small script: four springs, one SVG box.', keys: 'Tab in. Arrow keys pick and wrap. Home and End jump.', off: 'The pill jumps. The numbers swap.', law: 'Jakob: it is still a plain switch; only the motion is new.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: sgHtml, js: String.raw`TL4sg(box, { lead: [210, 470, .72] });`,
    },
    {
      k: 'A', name: 'Arc’s way, in our look', kind: 'Plain, after Arc',
      line: 'Why theirs is more fluid, done the same way: each button is as wide as its word, the pill glides its place and its width together, on a 0.42 s spring with no bounce that keeps its speed when you click again. Labels only change colour.',
      from: [arc('segmented-control')], tryit: 'Click the four parts quickly, one after another.',
      needs: 'A small script: one spring that keeps its speed.', keys: 'Tab in. Arrow keys pick and wrap.', off: 'The pill jumps.', law: 'Jakob: like the switches on a phone.',
      tags: ['motion:some', 'speed:mid', 'density:compact', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: sgHtml, js: String.raw`TL4sg(box, { dur: 420, zeta: 1 });`,
    },
    {
      k: 'C', name: 'Ours with their spring, and you can slide it', kind: 'Mix',
      line: 'Our round 3 switch with equal parts, now on the spring that keeps its speed. Press the picked part and slide: the pill follows your finger, the number changes as it passes each part, and it settles where you let go.',
      from: [house('n17'), arc('segmented-control'), ['iOS segmented control', null]], tryit: 'Press Today and drag right, slowly.',
      needs: 'A small script and pointer events.', keys: 'Tab in. Arrow keys pick and wrap.', off: 'Sliding still picks. The pill jumps.', law: 'Fitts: equal parts are easy targets.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: sgHtml, js: String.raw`TL4sg(box, { eq: true, dur: 400, zeta: .9, drag: true });`,
    },
    {
      k: 'D', name: 'Our ink marker, with the stretch and a view that follows', kind: 'Reference, pushed',
      line: 'Our tabs’ ink marker. The words under it turn paper exactly where the marker is, so the colour crosses as it passes. It stretches like B. The cards below slide 8 px the way you moved and every number rolls.',
      from: [house('n17'), arc('segmented-control'), house('n07')], tryit: 'Click Month, then Today.',
      needs: 'A small script, an SVG box and a clipped copy of the words.', keys: 'Tab in. Arrow keys pick and wrap.', off: 'The marker jumps. The numbers swap.', law: 'Proximity: the switch sits right on the numbers it changes.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:loud', 'open:inplace', 'new:novel', 'look:ember'],
      html: sgHtml, h: 300, js: String.raw`TL4sg(box, { ink: true, view: true, lead: [220, 480, .78] });`,
    },
  ],
};

/* ================= 24 Rating ================= */
const rtCss = String.raw`
.rt { width: min(100%, 400px); display: grid; gap: 10px; justify-items: start; text-align: left; }
.rt-q { margin: 0; font-size: 14.5px; font-weight: 600; color: var(--ink); }
.rt-row { display: inline-flex; align-items: flex-end; gap: 6px; padding: 4px; margin: -4px; border-radius: 10px; cursor: pointer; touch-action: pan-y; outline: none; user-select: none; -webkit-user-select: none; }
.rt-row:focus-visible { box-shadow: 0 0 0 2px var(--accent); }
.rt-s { position: relative; display: block; width: 38px; height: 38px; transition: transform .15s var(--ease-out); }
.rt-s.is-down { transform: scale(.86); }
.rt-s svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.rt-o path { fill: rgb(var(--ink-rgb) / .06); stroke: var(--line-hi); stroke-width: 1.3; stroke-linejoin: round; }
.rt-f { position: absolute; inset: 0; clip-path: inset(0 100% 0 0); transition: clip-path .24s var(--ease-out), opacity .18s; }
.rt-f path { fill: var(--accent); stroke: var(--accent); stroke-width: 1.3; stroke-linejoin: round; }
.rt-row.is-prev .rt-f { opacity: .45; }
.rt-row.is-bar { gap: 5px; }
.rt-row.is-bar .rt-s { width: 30px; border-radius: 7px; overflow: hidden; background: rgb(var(--ink-rgb) / .08); box-shadow: inset 0 0 0 1px var(--line); }
.rt-row.is-bar .rt-f { background: var(--accent); clip-path: inset(100% 0 0 0); }
.rt-w { margin: 0; min-height: 1.5em; font-size: 14px; font-weight: 500; color: var(--ink-soft); }
.rt-w .tll { vertical-align: baseline; }
.rt-avg { margin: 2px 0 0; font-size: 13.5px; color: var(--muted); }
.rt-avg b { font: 400 18px/1 var(--font-num); color: var(--ink); }
.rt-card { width: 100%; display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 6px 22px; align-items: center; padding: 14px 16px; margin-bottom: 6px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); box-shadow: var(--shadow-sm); }
.rt-big { margin: 0; font: 400 52px/1 var(--font-num); color: var(--ink); }
.rt-mini { display: flex; gap: 2px; margin: 4px 0 2px; }
.rt-mini .rt-s { width: 14px; height: 14px; }
.rt-cnt { margin: 0; font-size: 12.5px; color: var(--muted); }
.rt-dist { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; min-width: 0; }
.rt-dist li { display: grid; grid-template-columns: 10px minmax(0, 1fr) 3.2em; gap: 8px; align-items: center; font-size: 12px; color: var(--muted); }
.rt-dist .k { font-family: var(--font-num); font-size: 13px; color: var(--ink-soft); }
.rt-dist .bt { height: 7px; border-radius: 4px; background: rgb(var(--ink-rgb) / .08); overflow: hidden; }
.rt-dist .bt i { display: block; height: 100%; background: color-mix(in oklab, var(--accent) 55%, var(--paper-raised)); transform-origin: 0 50%; }
.rt-dist .v { text-align: right; font-family: var(--font-num); font-size: 13px; color: var(--ink-soft); }
.rt-dist li.is-you .bt i { background: var(--accent); }
.rt-dist li.is-you .v, .rt-dist li.is-you .k { color: var(--accent-text); }
.rt-bub { position: absolute; left: 0; top: -34px; padding: 3px 8px; border-radius: 8px; background: var(--ink); color: var(--paper); font: 500 12px/1.4 var(--font-body); white-space: nowrap; pointer-events: none; opacity: 0; transform: translateY(4px); transition: opacity .15s, transform var(--sp-snappy-d) var(--sp-snappy), left .12s var(--ease-out); }
.rt-wrap { position: relative; padding-top: 36px; }
.rt-wrap.is-on .rt-bub { opacity: 1; transform: none; }
@container (max-width: 380px) { .rt-card { grid-template-columns: minmax(0, 1fr); } .rt-big { font-size: 44px; } }`;

const rtJs = String.raw`
window.TL4rt = function (box, c) {
  c = c || {};
  var W = ['No rating yet', 'Very bad', 'Bad', 'Poor', 'Not good', 'Fair', 'Okay', 'Fine', 'Good', 'Very good', 'Great'];
  var STAR = '<path d="M12 2.6l2.86 5.8 6.4.93-4.63 4.51 1.09 6.37L12 17.2l-5.72 3.01 1.09-6.37L2.74 9.33l6.4-.93z"/>';
  var step = c.half ? .5 : 1, bar = c.shape === 'bar', host = $('[data-rt]', box), id = box.id;
  var D = { 5: 912, 4: 241, 3: 78, 2: 31, 1: 22 }, sum = 5842, n = 1284, val = 0, prev = null;
  function mk(i, small) { return '<span class="rt-s" data-i="' + i + '"' + (bar && !small ? ' style="height:' + (16 + i * 6) + 'px"' : '') + '>' + (bar && !small ? '' : '<svg class="rt-o" viewBox="0 0 24 24" aria-hidden="true">' + STAR + '</svg>') + '<span class="rt-f">' + (bar && !small ? '' : '<svg viewBox="0 0 24 24" aria-hidden="true">' + STAR + '</svg>') + '</span></span>'; }
  var h = '';
  if (c.card) h += '<div class="rt-card"><div><p class="rt-big" data-a></p><div class="rt-mini" aria-hidden="true">' + [0, 1, 2, 3, 4].map(function (i) { return mk(i, 1); }).join('') + '</div><p class="rt-cnt"><span data-n></span> ratings</p></div><ul class="rt-dist" aria-label="Ratings by stars">' + [5, 4, 3, 2, 1].map(function (k) { return '<li data-k="' + k + '"><span class="k">' + k + '</span><span class="bt"><i></i></span><span class="v" data-dv></span></li>'; }).join('') + '</ul></div>';
  h += '<p class="rt-q" id="' + id + '-q">' + (bar ? 'How fresh was the fruit?' : 'How was your Duka Fresh delivery?') + '</p>';
  h += (c.bubble ? '<div class="rt-wrap" data-wrap><span class="rt-bub" data-bub aria-hidden="true"></span>' : '') + '<div class="rt-row' + (bar ? ' is-bar' : '') + '" role="slider" tabindex="0" aria-labelledby="' + id + '-q" aria-valuemin="0" aria-valuemax="5" aria-valuenow="0" aria-valuetext="No rating yet">' + [0, 1, 2, 3, 4].map(function (i) { return mk(i); }).join('') + '</div>' + (c.bubble ? '</div>' : '');
  h += '<p class="rt-w"><span data-w>No rating yet</span></p>';
  if (!c.card) h += '<p class="rt-avg"><b data-a></b> average from <b data-n></b> ratings</p>';
  h += '<p class="sr" aria-live="polite" data-say></p>';
  host.innerHTML = h;
  var row = $('.rt-row', host), S = $$('.rt-s', row), F = S.map(function (s) { return $('.rt-f', s); }), wrap = $('[data-wrap]', host), bub = $('[data-bub]', host), say = $('[data-say]', host);
  var word = TLline($('[data-w]', host)), shown = 0;
  var fmtA = function (x) { return x.toFixed(1); };
  var avg = TLroll($('[data-a]', host), { value: Math.round(sum / n * 10) / 10, fmt: fmtA, dur: 620, live: false });
  var cnt = TLroll($('[data-n]', host), { value: n, fmt: function (x) { return x.toLocaleString('en-KE'); }, dur: 620, live: false });
  function clip(el, f, b) { el.style.clipPath = b ? 'inset(' + (100 - f * 100).toFixed(1) + '% 0 0 0)' : 'inset(0 ' + (100 - f * 100).toFixed(1) + '% 0 0)'; }
  function fill(v, sweep) {
    var up = v >= shown, from = shown; shown = v;
    F.forEach(function (el, i) {
      var f = Math.max(0, Math.min(1, v - i)), d = 0;
      if (sweep && c.sweep && moving()) { var lo = Math.min(from, v), k = up ? i - Math.floor(lo) : Math.ceil(Math.max(from, v)) - 1 - i; d = Math.max(0, k) * 42; }
      el.style.transitionDelay = d ? d + 'ms' : ''; clip(el, f, bar);
    });
  }
  /* summary card */
  var dv = c.card ? $$('.rt-dist li', host).map(function (li) { var k = +li.getAttribute('data-k'); return { li: li, k: k, r: TLroll($('[data-dv]', li), { value: D[k], fmt: function (x) { return x.toLocaleString('en-KE'); }, dur: 560, live: false }), i: $('i', li) }; }) : [];
  var bars = c.card ? TLvec(dv.map(function (d) { return 0; }), function (x) { dv.forEach(function (d, j) { d.i.style.transform = 'scaleX(' + x[j].toFixed(4) + ')'; }); }, { dur: 560, zeta: .8 }) : null;
  function bucket(v) { return Math.min(5, Math.max(1, Math.round(v))); }
  function stats(wave) {
    var a = sum / n; avg.set(Math.round(a * 10) / 10); cnt.set(n);
    if (c.card) {
      var mx = 0; dv.forEach(function (d) { mx = Math.max(mx, D[d.k]); });
      bars.to(dv.map(function (d) { return D[d.k] / mx; }), wave ? { delay: function (j) { return j * 70; } } : null);
      dv.forEach(function (d) { d.r.set(D[d.k]); d.li.classList.toggle('is-you', !!val && bucket(val) === d.k); });
      $$('.rt-mini .rt-f', host).forEach(function (el, i) { clip(el, Math.max(0, Math.min(1, a - i))); });
    }
  }
  function aria(v) { row.setAttribute('aria-valuenow', String(v)); row.setAttribute('aria-valuetext', v ? v + ' of 5' + (bar ? '' : ' stars') + ', ' + W[v * 2] : 'No rating yet'); }
  function commit(v) {
    v = Math.max(0, Math.min(5, v)); var old = val; if (v === old) { setPrev(null); return; }
    val = v; prev = null; row.classList.remove('is-prev'); fill(v, true);
    if (old && !v) { n--; D[bucket(old)]--; } else if (!old && v) { n++; D[bucket(v)]++; } else { D[bucket(old)]--; D[bucket(v)]++; }
    sum += v - old; stats(false); aria(v);
    word.set(v ? (v + (bar ? ' · ' : ' stars · ') + W[v * 2]) : 'No rating yet', v > old ? 1 : -1);
    if (v && c.pop && moving()) { var b = TLsp('bouncy'); S.forEach(function (s, i) { if (i < Math.ceil(v)) s.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)', offset: .35 }, { transform: 'scale(1)' }], { duration: b.d * 1.1, easing: 'cubic-bezier(.22,1,.36,1)', delay: 140 + i * 45 }); }); }
    say.textContent = v ? 'You rated ' + v + ' of 5, ' + W[v * 2] + '. The average is now ' + (sum / n).toFixed(1) + ' from ' + n.toLocaleString('en-KE') + ' ratings.' : 'Your rating is cleared.';
  }
  function setPrev(v) {
    prev = v; row.classList.toggle('is-prev', v != null && v !== val); fill(v == null ? val : v, true);
    if (bub) { wrap.classList.toggle('is-on', v != null); if (v != null) { var s = S[Math.max(0, Math.ceil(v) - 1)]; bub.textContent = v + ' · ' + W[v * 2]; bub.style.left = Math.max(0, s.offsetLeft + s.offsetWidth / 2 - bub.offsetWidth / 2) + 'px'; } }
  }
  function at(e) {
    var x = e.clientX, v = step;
    S.forEach(function (s, i) { var r = s.getBoundingClientRect(); if (x >= r.left - 3) { var f = (x - r.left) / r.width; v = i + (step < 1 && f <= .5 ? .5 : 1); } });
    return v;
  }
  var touch = null;
  row.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' || touch) setPrev(at(e)); });
  row.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') setPrev(null); });
  row.addEventListener('pointerdown', function (e) { var s = e.target.closest && e.target.closest('.rt-s'); if (s) { s.classList.add('is-down'); touch = e.pointerType !== 'mouse' ? s : null; } if (touch) { row.setPointerCapture(e.pointerId); setPrev(at(e)); } });
  function up() { S.forEach(function (s) { s.classList.remove('is-down'); }); }
  row.addEventListener('pointerup', function (e) { up(); var v = at(e); if (touch) { touch = null; setPrev(null); } commit(v === val ? 0 : v); });
  row.addEventListener('pointercancel', function () { up(); touch = null; setPrev(null); });
  row.addEventListener('keydown', function (e) {
    var k = e.key, v = null;
    if (k === 'ArrowRight' || k === 'ArrowUp') v = Math.min(5, (val || 0) + step);
    else if (k === 'ArrowLeft' || k === 'ArrowDown') v = Math.max(step, val - step);
    else if (k === 'Home') v = step; else if (k === 'End') v = 5;
    else if (/^[1-5]$/.test(k)) v = +k;
    else if (k === 'Backspace' || k === 'Delete') v = 0;
    if (v == null) return; e.preventDefault(); commit(v);
  });
  fill(0, false);
  if (c.card) TLonView(host, function () { stats(true); }); else stats(false);
};`;

const rtHtml = '<div class="rt" data-rt></div>';
const rating = {
  id: 'rating', n: '24', name: 'Rating', h: 250,
  claim: 'A rating should <em>show your pick before you give it.</em>',
  lead: 'Rate a Duka Fresh delivery. Point at the stars to see the rating first, then click to give it. The average and the number of ratings roll when yours goes in, changes or comes out.',
  ref: null,
  noteHint: 'B, but with D’s bars', moreHint: 'a rating that asks one more question after a low score',
  css: rtCss.replace('.rt {', '#rating .stage { container-type: inline-size; }\n.rt {'), js: rtJs,
  opts: [
    {
      k: 'B', name: 'Half stars that sweep in and pop', kind: 'Lively, after Arc',
      line: 'Point to see a pale preview, to the half star. Click and the orange fill sweeps star by star the way you moved. Then the stars pop in a small wave. The word rolls up or down, and so do the average and the count.',
      from: [arc('rating'), house('n07')], tryit: 'Point slowly across, click 4½, then press the left arrow.',
      needs: 'A small script and CSS clips.', keys: 'Tab to the stars. Arrows move by a half. 1 to 5 set a number. Home and End. Backspace clears.', off: 'The stars fill at once. No pop.', law: 'Jakob: five stars, as on every shop.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:loud', 'open:inplace', 'new:twist', 'look:ember'],
      html: rtHtml, js: String.raw`TL4rt(box, { half: true, sweep: true, pop: true });`,
    },
    {
      k: 'A', name: 'Whole stars, no fuss', kind: 'Plain',
      line: 'Whole stars only. Pointing shows a pale preview, clicking fills them at once. Only the average and the count roll.',
      from: [arc('rating')], tryit: 'Click 3, then 5, then click 5 again to clear it.',
      needs: 'A small script.', keys: 'Arrows move by one. 1 to 5. Backspace clears.', off: 'Same.', law: 'Hick: five steps, no halves to think about.',
      tags: ['motion:still', 'speed:quick', 'density:compact', 'feedback:quiet', 'open:inplace', 'new:familiar', 'look:ember'],
      html: rtHtml, css: String.raw`#t24A .rt-f { transition: none; }`, js: String.raw`TL4rt(box, {});`,
    },
    {
      k: 'C', name: 'Bars that rise, with a label that follows', kind: 'Mix',
      line: 'Another shape: five bars that grow taller, like a phone’s signal. They fill from the bottom, half a bar at a time. A small label rides above your finger and says the word.',
      from: [arc('rating'), ['Phone signal bars', null]], tryit: 'Drag across the bars on a phone, or point at them.',
      needs: 'A small script and CSS clips.', keys: 'Arrows move by a half. 1 to 5. Backspace clears.', off: 'The bars fill at once; the label still shows.', law: 'Jakob: taller means more, like signal bars.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:clear', 'open:inplace', 'new:novel', 'look:ember'],
      html: rtHtml, h: 280, js: String.raw`TL4rt(box, { half: true, sweep: true, shape: 'bar', bubble: true });`,
    },
    {
      k: 'D', name: 'A rating card that adds yours in', kind: 'Reference, pushed',
      line: 'Our stat card, pushed. A big average with small stars filled to the exact score, then a bar for each star count. Give your rating and your bar turns orange, grows on a spring, and every number rolls.',
      from: [house('n07'), arc('rating'), house('n47')], tryit: 'Give 5, then change it to 3 and watch the bars.',
      needs: 'A small script and springs.', keys: 'Tab to the stars. Arrows move by a half. 1 to 5. Backspace clears.', off: 'Bars and numbers jump to the new values.', law: 'Proximity: your rating sits under the numbers it changes.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: rtHtml, h: 360, js: String.raw`TL4rt(box, { half: true, sweep: true, pop: true, card: true });`,
    },
  ],
};

/* ================= 26 File dropzone ================= */
const dzCss = String.raw`
#dropzone .stage { height: auto; min-height: var(--h); align-items: start; padding-top: 22px; }
.dz { position: relative; width: min(100%, 440px); display: grid; gap: 10px; text-align: left; }
.dz-drop { position: relative; display: grid; justify-items: center; gap: 4px; padding: 22px 16px; border-radius: 12px; background: var(--paper-raised); text-align: center; cursor: pointer; overflow: hidden; transition: background-color .2s; }
.dz-drop:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.dz-edge { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }
.dz-edge rect { x: 1px; y: 1px; width: calc(100% - 2px); height: calc(100% - 2px); rx: 11px; fill: none; stroke: var(--line-hi); stroke-width: 1.5; stroke-dasharray: 7 6; transition: stroke .2s; }
.dz-drop:hover .dz-edge rect { stroke: rgb(var(--ink-rgb) / .45); }
.dz-drop[data-over] { background: color-mix(in srgb, var(--accent) 6%, var(--paper-raised)); }
.dz-drop[data-over] .dz-edge rect { stroke: var(--accent); }
.dz.is-march .dz-drop[data-over] .dz-edge rect { animation: dz-march .6s linear infinite; }
@keyframes dz-march { to { stroke-dashoffset: -13; } }
.dz-ic { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 10px; background: var(--paper-sunk); color: var(--ink-soft); transition: transform var(--sp-bouncy-d) var(--sp-bouncy), background-color .2s, color .2s; }
.dz-ic svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.dz.is-march .dz-drop[data-over] .dz-ic { transform: translateY(-5px); background: var(--accent); color: var(--on-accent); }
.dz-t { margin: 4px 0 0; font-size: 14.5px; font-weight: 600; color: var(--ink); }
.dz-t u { text-decoration: none; color: var(--accent-text); }
.dz-h { margin: 0; font-size: 12.5px; color: var(--muted); }
.dz.is-slim .dz-drop { grid-template-columns: auto minmax(0, 1fr); justify-items: start; align-items: center; column-gap: 12px; padding: 10px 14px; text-align: left; }
.dz.is-slim .dz-ic { grid-row: span 2; width: 32px; height: 32px; }
.dz.is-slim .dz-t { margin: 0; font-size: 13.5px; }
.dz-tools { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; }
.dz-note { margin: 0; flex: 1 1 160px; font-size: 12.5px; color: var(--accent-text); min-height: 1em; }
.dz-list { list-style: none; margin: 0; padding: 0; display: grid; border-radius: 12px; }
.dz-list:not(:has(> li:not([hidden]))) { display: none; }
.dz-r { overflow: hidden; }
.dz-ri { position: relative; display: grid; grid-template-columns: 36px minmax(0, 1fr) auto; gap: 2px 12px; align-items: center; padding: 10px 12px 12px; border: 1px solid var(--line); border-bottom-width: 0; background: var(--paper-raised); }
.dz-r:first-child .dz-ri, .dz-r[hidden] + .dz-r .dz-ri { border-radius: 12px 12px 0 0; }
.dz-list > .dz-r:last-of-type .dz-ri { border-bottom-width: 1px; border-radius: 0 0 12px 12px; }
.dz-list > .dz-r:only-of-type .dz-ri { border-radius: 12px; }
.dz-fi { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 8px; background: var(--paper-sunk); color: var(--muted); font: 600 9.5px/1 var(--font-mono); letter-spacing: .04em; overflow: hidden; }
.dz-fi img { width: 100%; height: 100%; object-fit: cover; }
.dz-m { min-width: 0; }
.dz-n { margin: 0; display: flex; gap: 8px; align-items: baseline; font-size: 13.5px; font-weight: 500; color: var(--ink); }
.dz-n span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dz-n small { flex: none; font-size: 12px; font-weight: 400; color: var(--muted); }
.dz-st { margin: 1px 0 0; display: flex; align-items: center; gap: 6px; min-height: 22px; font-size: 12.5px; color: var(--muted); }
.dz-st .l-tick, .dz-st .l-x { width: 16px; height: 16px; flex: 0 0 16px; }
.dz-r[data-s="err"] .dz-st, .dz-r[data-s="bad"] .dz-st { color: var(--accent-text); }
.dz-pc { font-variant-numeric: tabular-nums; color: var(--ink-soft); }
.dz-a { display: flex; gap: 4px; }
.dz-a button { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 8px; color: var(--muted); transition: background-color .15s, color .15s, transform .15s var(--ease-out); }
.dz-a button:hover { background: rgb(var(--ink-rgb) / .07); color: var(--ink); }
.dz-a button:active { transform: scale(.94); }
.dz-a svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.dz-pb { position: absolute; left: 60px; right: 12px; bottom: 7px; height: 3px; border-radius: 2px; background: rgb(var(--ink-rgb) / .08); overflow: hidden; transition: opacity .3s .5s; }
.dz-pb i { display: block; height: 100%; background: var(--accent); transform-origin: 0 50%; transform: scaleX(0); }
.dz-r[data-s="done"] .dz-pb, .dz-r[data-s="bad"] .dz-pb { opacity: 0; }
.dz-ru { grid-column: 1 / -1; display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--ink-soft); }
.dz-ru p { margin: 0; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dz-undo { position: relative; display: flex; align-items: center; gap: 12px; padding: 10px 12px 12px 14px; border-radius: 12px; border: 1px solid var(--line); background: var(--paper-raised); box-shadow: var(--shadow-lg); font-size: 13.5px; color: var(--ink-soft); overflow: hidden; }
.dz-undo p { margin: 0; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dz-cd { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: var(--accent); transform-origin: 0 50%; }
.dz-tot { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px 12px; align-items: baseline; font-size: 13px; color: var(--muted); }
.dz-tot p { margin: 0; }
.dz-tot b { font: 400 17px/1 var(--font-num); color: var(--ink); }
.dz-tl { grid-column: 1 / -1; height: 4px; border-radius: 2px; background: rgb(var(--ink-rgb) / .08); overflow: hidden; }
.dz-tl i { display: block; height: 100%; background: var(--accent); transform-origin: 0 50%; transform: scaleX(0); }
.dz-ov { position: absolute; inset: -8px; z-index: 4; display: grid; place-items: center; border-radius: 14px; border: 1.5px dashed var(--accent); background: color-mix(in srgb, var(--accent) 8%, var(--paper)); font-size: 15px; font-weight: 600; color: var(--accent-text); opacity: 0; pointer-events: none; transition: opacity .18s; }
.dz.is-over .dz-ov { opacity: 1; }
@media (pointer: coarse) { .dz-a button { width: 44px; height: 44px; } }`;

const dzJs = String.raw`
window.TL4dz = function (box, c) {
  c = c || {};
  var LIM = 10 * 1048576, MAX = 5, OK = /\.(pdf|png|jpe?g)$/i, host = $('[data-dz]', box), id = box.id;
  var IC = { up: '<path d="M12 16V4M7 9l5-5 5 5M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>', rot: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9"/><path d="M4.5 4.5V9H9"/>' };
  function ic(n, v) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + IC[n] + '</svg>'; }
  var X = '<svg class="l-x" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="11"/><path d="M7.5 7.5l7 7M14.5 7.5l-7 7"/></svg>';
  host.className = 'dz' + (c.march ? ' is-march' : '');
  host.innerHTML = (c.total ? '<div class="dz-tot" data-tot hidden><p><b data-td></b> of <b data-tn></b> files uploaded</p><p><span data-tb></span> of <span data-tt></span></p><span class="dz-tl"><i></i></span></div>' : '')
    + '<div class="dz-drop" role="button" tabindex="0" aria-describedby="' + id + '-h" data-drop>' + (c.plain ? '' : '<svg class="dz-edge" aria-hidden="true"><rect/></svg>') + '<span class="dz-ic" aria-hidden="true">' + ic('up') + '</span><p class="dz-t" data-t>Drop files here, or <u>choose them</u></p><p class="dz-h" id="' + id + '-h">PDF, PNG or JPG, up to 10 MB each. Up to 5 files.</p>'
    + '<input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" hidden data-in></div>'
    + '<div class="dz-tools"><button class="l-btn sm" type="button" data-try>Try sample files</button><p class="dz-note" data-note aria-live="polite"></p></div>'
    + '<ul class="dz-list" data-list aria-label="Files"></ul>' + (c.undo === 'bar' ? '<div class="dz-undo" data-undo hidden><p data-ut></p><button class="l-btn sm" type="button" data-ub>Undo</button><span class="dz-cd" data-cd></span></div>' : '')
    + (c.whole ? '<div class="dz-ov" aria-hidden="true" data-ov>Drop to add them</div>' : '') + '<p class="sr" aria-live="polite" data-say></p>';
  var drop = $('[data-drop]', host), inp = $('[data-in]', host), list = $('[data-list]', host), note = $('[data-note]', host), tt = $('[data-t]', host), say = $('[data-say]', host), ub = $('[data-undo]', host), ov = $('[data-ov]', host);
  var files = [], uid = 0, T0 = tt.innerHTML;
  if (c.plain) drop.style.border = '1.5px dashed var(--line-hi)';
  function size(b) { return b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  function live() { return files.filter(function (f) { return !f.gone; }); }
  /* overall */
  var tot = c.total ? { el: $('[data-tot]', host), d: TLroll($('[data-td]', host), { value: 0, live: false }), n: TLroll($('[data-tn]', host), { value: 0, live: false }), b: TLroll($('[data-tb]', host), { value: 0, fmt: function (x) { return (x / 10).toFixed(1) + ' MB'; }, live: false, dur: 420 }), t: TLroll($('[data-tt]', host), { value: 0, fmt: function (x) { return (x / 10).toFixed(1) + ' MB'; }, live: false }) } : null;
  if (tot) tot.v = TLvec([0], function (x) { $('.dz-tl i', host).style.transform = 'scaleX(' + x[0].toFixed(4) + ')'; }, { dur: 480, zeta: 1 });
  function total() {
    if (!tot) return; var ok = live().filter(function (f) { return f.s !== 'bad'; }), all = 0, got = 0, dn = 0;
    ok.forEach(function (f) { all += f.size; got += f.size * f.p; if (f.s === 'done') dn++; });
    tot.el.hidden = !ok.length; tot.d.set(dn); tot.n.set(ok.length); tot.b.set(Math.round(got / 104857.6)); tot.t.set(Math.round(all / 104857.6)); tot.v.to([all ? got / all : 0]);
  }
  function slim() {
    if (!c.fold) return; var on = live().length > 0; if (host.classList.contains('is-slim') === on) return;
    var h0 = drop.offsetHeight; host.classList.toggle('is-slim', on); tt.innerHTML = on ? 'Add more files' : T0; if (moving()) TLglide(drop, h0, 360);
  }
  function paint(f) {
    var st = $('.dz-st', f.li), acts = $('.dz-a', f.li); f.li.setAttribute('data-s', f.s);
    var nm = f.name.replace(/[&<>"]/g, '');
    if (f.s === 'up') { if (!f.pc) { st.innerHTML = '<span>Uploading</span><span class="dz-pc" data-pc></span>'; f.pc = TLroll($('[data-pc]', st), { value: Math.round(f.p * 100), fmt: function (x) { return x + '%'; }, dur: 360, live: false }); } else f.pc.set(Math.round(f.p * 100)); }
    else { f.pc = null; st.innerHTML = f.s === 'done' ? TICK.replace('l-tick draw', 'l-tick' + (moving() ? ' draw' : '')) + '<span>Uploaded</span>' : X + '<span>' + f.why + '</span>'; }
    var want = (f.s === 'err' ? 'r' : '') + 'x';
    if (acts.getAttribute('data-w') !== want) { acts.setAttribute('data-w', want); acts.innerHTML = (f.s === 'err' ? '<button type="button" data-act="retry" aria-label="Try ' + nm + ' again">' + ic('rot') + '</button>' : '') + '<button type="button" data-act="rm" aria-label="Remove ' + nm + '">' + ic('x') + '</button>'; }
    f.bar.to([f.s === 'bad' ? 0 : f.p]); total();
  }
  function tickUp(f) {
    clearInterval(f.t); if (f.s !== 'up') return;
    f.t = setInterval(function () {
      f.p = Math.min(1, f.p + (.04 + Math.random() * .09) * Math.min(1, 4e6 / Math.max(f.size, 1e6)));
      if (f.failAt && f.p >= f.failAt) { f.p = f.failAt; f.failAt = 0; f.s = 'err'; f.why = 'Stopped at ' + Math.round(f.p * 100) + '%. Check your connection.'; clearInterval(f.t); say.textContent = f.name + ' stopped. You can try again.'; }
      else if (f.p >= 1) { f.s = 'done'; clearInterval(f.t); say.textContent = f.name + ' uploaded.'; }
      paint(f);
    }, 140);
  }
  function grow(li, d) {
    if (!moving() || c.plain) return; var h = li.offsetHeight, s = TLsp('soft');
    li.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: s.d, easing: s.e, delay: d || 0, fill: 'backwards' });
    li.firstChild.animate([{ transform: 'translateY(8px)' }, { transform: 'none' }], { duration: s.d, easing: s.e, delay: d || 0, fill: 'backwards' });
  }
  function shrink(li, done) {
    if (!moving() || c.plain) { done(); return; } var h = li.offsetHeight;
    li.animate([{ height: h + 'px', opacity: 1 }, { opacity: 0, offset: .5 }, { height: '0px', opacity: 0 }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = done;
  }
  function add(arr) {
    var room = MAX - live().length, left = Math.max(0, arr.length - room), k = 0;
    note.textContent = left ? 'Only 5 files at a time. ' + left + (left === 1 ? ' was' : ' were') + ' left out.' : '';
    arr.slice(0, Math.max(0, room)).forEach(function (x) {
      var f = { id: ++uid, name: x.name, size: x.size, failAt: x.failAt || 0, p: 0, s: 'up', file: x.file };
      if (!OK.test(f.name)) { f.s = 'bad'; f.why = 'Only PDF, PNG or JPG files.'; }
      else if (f.size > LIM) { f.s = 'bad'; f.why = 'Too big. The limit is 10 MB.'; }
      var ext = (f.name.split('.').pop() || '').slice(0, 4).toUpperCase(), li = document.createElement('li');
      li.className = 'dz-r'; li._f = f; f.li = li;
      var th = c.thumbs && f.file && /^image\/(png|jpe?g)$/.test(f.file.type) && f.s !== 'bad' ? (f.url = URL.createObjectURL(f.file)) : null;
      li.innerHTML = '<div class="dz-ri"><span class="dz-fi" aria-hidden="true">' + (th ? '<img alt="" src="' + th + '">' : ext) + '</span><div class="dz-m"><p class="dz-n"><span></span><small>' + size(f.size) + '</small></p><p class="dz-st"></p></div><span class="dz-a"></span><span class="dz-pb" aria-hidden="true"><i></i></span></div>';
      $('.dz-n span', li).textContent = f.name;
      list.appendChild(li); files.push(f);
      f.bar = TLvec([0], function (v) { $('.dz-pb i', li).style.transform = 'scaleX(' + v[0].toFixed(4) + ')'; }, { dur: 420, zeta: 1 });
      paint(f); grow(li, k++ * 70); tickUp(f);
    });
    slim(); total();
    if (arr.length) say.textContent = Math.min(arr.length, Math.max(0, room)) + ' files added.' + (left ? ' ' + note.textContent : '');
  }
  /* remove and undo */
  var last = null, cd = null;
  function final(f) { if (!f) return; f.li.remove(); if (f.url) URL.revokeObjectURL(f.url); files.splice(files.indexOf(f), 1); total(); }
  function hideUndo() { if (cd) { cd.cancel(); cd = null; } if (ub) ub.hidden = true; }
  function countdown(line, onEnd) { var a = line.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: 5000, easing: 'linear', fill: 'forwards' }); a.onfinish = onEnd; return a; }
  function pause(el, a) { ['pointerenter', 'focusin'].forEach(function (t) { el.addEventListener(t, function () { if (a()) a().pause(); }); }); ['pointerleave', 'focusout'].forEach(function (t) { el.addEventListener(t, function () { if (a() && !el.matches(':hover') && !el.contains(document.activeElement)) a().play(); }); }); }
  if (ub) { pause(ub, function () { return cd; }); $('[data-ub]', ub).addEventListener('click', function () { var f = last; last = null; hideUndo(); if (!f) return; f.gone = false; f.li.hidden = false; grow(f.li); tickUp(f); slim(); total(); say.textContent = f.name + ' is back.'; var b = $('[data-act]', f.li); if (b) b.focus(); }); }
  function remove(f) {
    clearInterval(f.t); f.gone = true; var li = f.li;
    if (c.undo === 'inline') {
      var ri = li.firstChild; ri.hidden = true; var u = document.createElement('div'); u.className = 'dz-ri dz-ru-w'; u.innerHTML = '<div class="dz-ru"><p></p><button class="l-btn sm" type="button">Undo</button></div><span class="dz-cd"></span>';
      $('p', u).textContent = f.name + ' removed.'; li.appendChild(u); var a = countdown($('.dz-cd', u), function () { shrink(li, function () { final(f); slim(); }); });
      pause(u, function () { return a; });
      $('button', u).addEventListener('click', function () { a.onfinish = null; a.cancel(); u.remove(); ri.hidden = false; f.gone = false; tickUp(f); total(); var b = $('[data-act]', li); if (b) b.focus(); });
      $('button', u).focus({ preventScroll: true }); total(); say.textContent = f.name + ' removed. Undo is there for 5 seconds.'; return;
    }
    shrink(li, function () { if (c.undo === 'bar') li.hidden = true; else final(f); slim(); });
    if (c.undo === 'bar') {
      if (last && last !== f) final(last); last = f; hideUndo(); ub.hidden = false; $('[data-ut]', ub).textContent = 'Removed ' + f.name + '.';
      if (moving()) ub.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 350, easing: 'cubic-bezier(.22,1,.36,1)' });
      cd = countdown($('[data-cd]', ub), function () { var g = last; last = null; hideUndo(); final(g); });
    }
    total(); say.textContent = f.name + ' removed.' + (c.undo ? ' Undo is there for 5 seconds.' : '');
  }
  list.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-act]'); if (!b) return; var f = b.closest('.dz-r')._f;
    if (b.getAttribute('data-act') === 'rm') { var vis = live(), i = vis.indexOf(f), nb = vis[i + 1] || vis[i - 1]; remove(f); if (c.undo !== 'inline') { var t = nb && $('[data-act="rm"]', nb.li); (t || drop).focus({ preventScroll: true }); } }
    else { f.s = 'up'; f.p = 0; f.pc = null; paint(f); tickUp(f); }
  });
  list.addEventListener('keydown', function (e) {
    var b = e.target.closest && e.target.closest('[data-act]'); if (!b) return; var f = b.closest('.dz-r')._f, vis = live().filter(function (x) { return !x.li.hidden; }), i = vis.indexOf(f);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { var g = vis[i + (e.key === 'ArrowDown' ? 1 : -1)]; if (!g) return; e.preventDefault(); var t = $('[data-act="' + b.getAttribute('data-act') + '"]', g.li) || $('[data-act]', g.li); t.focus(); }
    if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); $('[data-act="rm"]', f.li).click(); }
  });
  /* picking, dropping, pasting */
  function wrapF(fl) { return [].slice.call(fl || []).map(function (x) { return { name: x.name, size: x.size, file: x }; }); }
  drop.addEventListener('click', function () { inp.click(); });
  drop.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inp.click(); } });
  inp.addEventListener('change', function () { add(wrapF(inp.files)); inp.value = ''; });
  var tgt = c.whole ? host : drop;
  function over(on, e) {
    if (on) { var n = e && e.dataTransfer && e.dataTransfer.items ? e.dataTransfer.items.length : 0; if (!c.whole && !c.plain) tt.textContent = n > 1 ? 'Drop ' + n + ' files to add them' : 'Drop it to add it'; if (ov) ov.textContent = n > 1 ? 'Drop to add ' + n + ' files' : 'Drop to add it'; drop.setAttribute('data-over', ''); }
    else { drop.removeAttribute('data-over'); if (!c.whole) tt.innerHTML = host.classList.contains('is-slim') ? 'Add more files' : T0; }
    host.classList.toggle('is-over', on && !!c.whole);
    if (c.plain) drop.style.borderColor = on ? 'var(--accent)' : '';
  }
  ['dragenter', 'dragover'].forEach(function (t) { tgt.addEventListener(t, function (e) { e.preventDefault(); if (!drop.hasAttribute('data-over')) over(true, e); }); });
  tgt.addEventListener('dragleave', function (e) { if (!tgt.contains(e.relatedTarget)) over(false); });
  tgt.addEventListener('drop', function (e) { e.preventDefault(); over(false); add(wrapF(e.dataTransfer.files)); });
  document.addEventListener('paste', function (e) { if (!(host.matches(':hover') || host.contains(document.activeElement)) || (e.target.closest && e.target.closest('input, textarea'))) return; var fl = e.clipboardData && e.clipboardData.files; if (fl && fl.length) { e.preventDefault(); add(wrapF(fl)); } });
  $('[data-try]', host).addEventListener('click', function () {
    add([{ name: 'pocketpay-statement-oct.pdf', size: 1.8 * 1048576 }, { name: 'shop-front.jpg', size: 3.4 * 1048576 }, { name: 'price-list.xlsx', size: .22 * 1048576 }, { name: 'delivery-day.png', size: 14.6 * 1048576 }, { name: 'kra-pin-certificate.pdf', size: .6 * 1048576, failAt: .62 }]);
  });
};`;

const dzHtml = '<div data-dz></div>';
const dropzone = {
  id: 'dropzone', n: '26', name: 'File dropzone', h: 300,
  claim: 'An upload should <em>show every file as it goes.</em>',
  lead: 'Send papers to PocketPay. Drag files onto the box, choose them, or paste a screenshot. Try the sample files: one is the wrong kind, one is too big and one stops halfway, so you can see each problem. Nothing leaves your browser.',
  ref: { ids: 'c12', text: 'File upload: a dashed box that turns orange when you drag over it, one row per file with an orange bar, Retry for a failed file.', url: SHOW + '#c12', label: 'Open c12' },
  noteHint: 'B, with C’s slim bar', moreHint: 'an upload for one profile photo, with cropping',
  css: dzCss, js: dzJs,
  opts: [
    {
      k: 'B', name: 'A box that answers the drag, rows that spring in, and Undo', kind: 'Lively, after Arc',
      line: 'Drag over and the box tints, its icon lifts and turns orange, the dashed edge runs, and it says how many files you hold. Rows slide in one after another. Each percent rolls and its orange line eases to it. Remove a file and an Undo card waits 5 s.',
      from: [arc('file-dropzone'), house('c12'), house('n07')], tryit: 'Press Try sample files, remove one, then press Undo.',
      needs: 'A small script. A real file box; nothing is sent.', keys: 'Enter on the box opens the file picker. Up and Down move between rows. Delete removes a row. Ctrl+V or ⌘V pastes a file.', off: 'Rows appear at once. The edge stays still. Lines jump.', law: 'Fitts: the whole box is one big target.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:loud', 'open:inplace', 'new:twist', 'look:ember'],
      html: dzHtml, js: String.raw`TL4dz(box, { march: true, undo: 'bar' });`,
    },
    {
      k: 'A', name: 'Our c12, as it is', kind: 'Ours today',
      line: 'A dashed box that turns orange when you drag over it. Rows show up at once. Each has an orange bar. Remove takes the row away at once, with no Undo.',
      from: [house('c12')], tryit: 'Press Try sample files, then Retry the one that stopped.',
      needs: 'A small script.', keys: 'Enter on the box opens the picker. Up and Down between rows. Delete removes.', off: 'Same.', law: 'Jakob: every upload page looks like this.',
      tags: ['motion:still', 'speed:quick', 'density:mid', 'feedback:clear', 'open:inplace', 'new:familiar', 'look:ember'],
      html: dzHtml, js: String.raw`TL4dz(box, { plain: true });`,
    },
    {
      k: 'C', name: 'The box folds into a slim bar', kind: 'Mix',
      line: 'Once you add files, the big box folds into a slim Add more bar, so the list gets the room. While you drag, the whole card becomes the target. Remove turns the row into “removed” with its own Undo and a short orange line, then it closes.',
      from: [arc('file-dropzone'), house('c12'), house('n21')], tryit: 'Add the samples, then remove one and leave it.',
      needs: 'A small script and a height glide.', keys: 'Enter on the box opens the picker. Up and Down between rows. Delete removes.', off: 'The box folds at once. Rows close at once.', law: 'Proximity: Undo shows on the row you removed.',
      tags: ['motion:springy', 'speed:mid', 'density:compact', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: dzHtml, js: String.raw`TL4dz(box, { march: true, fold: true, whole: true, undo: 'inline' });`,
    },
    {
      k: 'D', name: 'Our c12 with pictures and a total', kind: 'Reference, pushed',
      line: 'c12, pushed. A line at the top adds up every file: how many are done and how many MB are in, all rolling, with one orange line for the lot. Pictures you pick show as small photos in their rows. Remove has Undo.',
      from: [house('c12'), arc('file-dropzone'), house('n47')], tryit: 'Pick a photo of your own, then add the samples.',
      needs: 'A small script. Photos stay in your browser.', keys: 'Enter on the box opens the picker. Up and Down between rows. Delete removes.', off: 'Rows and lines jump to their place. Numbers swap.', law: 'Hick: one total tells you if you can move on.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:clear', 'open:inplace', 'new:twist', 'look:ember'],
      html: dzHtml, js: String.raw`TL4dz(box, { march: true, undo: 'bar', thumbs: true, total: true });`,
    },
  ],
};

/* ================= 25 Date range picker ================= */
const drCss = String.raw`
#daterange .stage { align-items: start; justify-items: start; padding: 22px 16px; }
.dr { position: relative; width: 100%; text-align: left; --cs: 36px; }
.dr-t { position: relative; display: inline-flex; align-items: center; gap: 9px; height: 42px; padding: 0 12px; border-radius: 10px; border: 1px solid var(--line-hi); background: var(--paper-raised); color: var(--ink); font: inherit; font-size: 14.5px; box-shadow: var(--shadow-sm); transition: border-color .2s, transform .15s var(--ease-out); }
.dr-t:hover { border-color: rgb(var(--ink-rgb) / .42); }
.dr-t:active { transform: scale(.97); }
.dr-t svg { width: 16px; height: 16px; flex: none; fill: none; stroke: var(--muted); stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.dr-tl { position: relative; font-weight: 500; white-space: nowrap; }
.dr.is-fly .dr-tl { z-index: 8; }
.dr-tn { font-size: 12.5px; color: var(--muted); white-space: nowrap; }
.dr-sum { margin: 10px 0 0; font-size: 13.5px; color: var(--muted); }
.dr-sum b { font: 400 18px/1 var(--font-num); color: var(--ink); }
.dr-p { position: absolute; z-index: 6; left: 0; top: 0; width: max-content; max-width: 100%; visibility: hidden; pointer-events: none; filter: drop-shadow(0 12px 28px rgb(0 0 0 / .14)) drop-shadow(0 1px 2px rgb(0 0 0 / .08)); transition: visibility 0s linear .36s; }
.dr-p.is-open { visibility: visible; pointer-events: auto; transition: visibility 0s; }
.dr.is-fade .dr-p { top: 48px; opacity: 0; transform: translateY(-4px); transition: visibility 0s linear .15s, opacity .15s var(--ease-out), transform .15s var(--ease-out); }
.dr.is-fade .dr-p.is-open { opacity: 1; transform: none; transition: visibility 0s, opacity .2s var(--ease-out), transform .2s var(--ease-out); }
.dr-sf { position: absolute; inset: 0; border-radius: 14px; background: var(--paper-raised); box-shadow: inset 0 0 0 1px var(--line); }
.dr-in { position: relative; display: grid; grid-template-columns: auto minmax(0, 1fr); grid-template-areas: "q cal" "ft ft"; gap: 12px 16px; padding: 12px; }
.dr.is-narrow .dr-in, .dr.no-rail .dr-in { grid-template-columns: minmax(0, 1fr); grid-template-areas: "q" "cal" "ft"; }
.dr.no-q .dr-in { grid-template-areas: "cal" "ft"; }
.dr-q { grid-area: q; display: grid; align-content: start; gap: 2px; min-width: 0; padding-right: 12px; border-right: 1px solid var(--line); }
.dr.is-narrow .dr-q, .dr.no-rail .dr-q { display: flex; gap: 6px; padding: 0 0 10px; border-right: 0; border-bottom: 1px solid var(--line); overflow-x: auto; scrollbar-width: none; }
.dr-q button { height: 32px; padding: 0 10px; border-radius: 8px; font-size: 13px; color: var(--ink-soft); text-align: left; white-space: nowrap; transition: background-color .15s, color .15s; }
.dr-q button:hover { background: rgb(var(--ink-rgb) / .06); color: var(--ink); }
.dr-q button[aria-pressed="true"] { background: rgb(var(--ink-rgb) / .09); color: var(--ink); font-weight: 600; }
.dr.no-rail .dr-q button, .dr.is-narrow .dr-q button { flex: none; border: 1px solid var(--line-hi); border-radius: 999px; padding: 0 11px; }
.dr.no-rail .dr-q button[aria-pressed="true"], .dr.is-narrow .dr-q button[aria-pressed="true"] { background: var(--ink); color: var(--paper); border-color: var(--ink); font-weight: 500; }
.dr-cal { grid-area: cal; position: relative; min-width: 0; }
.dr-nav button { position: absolute; z-index: 2; top: -2px; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 8px; color: var(--ink-soft); transition: background-color .15s, opacity .15s; }
.dr-nav button:hover { background: rgb(var(--ink-rgb) / .07); }
.dr-nav button:disabled { opacity: .3; pointer-events: none; }
.dr-nav button svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.dr-nav [data-prev] { left: 0; } .dr-nav [data-next] { right: 0; }
.dr-ms { position: relative; overflow: clip; }
.dr-mw { display: flex; gap: 22px; }
.dr-m { position: relative; width: calc(var(--cs) * 7); }
.dr-mn { margin: 0; height: 30px; display: grid; place-items: center; font-size: 14px; font-weight: 600; color: var(--ink); }
.dr-wd { display: grid; grid-template-columns: repeat(7, var(--cs)); font: 500 10.5px/24px var(--font-mono); letter-spacing: .06em; text-transform: uppercase; color: var(--muted); text-align: center; }
.dr-wk { position: relative; display: grid; grid-template-columns: repeat(7, var(--cs)); height: var(--cs); }
.dr-bar { position: absolute; inset: 0; background: rgb(var(--ink-rgb) / .08); clip-path: inset(3px 100% 3px 0 round 9px); transition: clip-path var(--sp-snappy-d) var(--sp-snappy); pointer-events: none; }
.dr-p.is-prev .dr-bar { background: rgb(var(--ink-rgb) / .055); }
.dr-d { position: relative; z-index: 1; width: var(--cs); height: var(--cs); border-radius: 9px; font: 400 15px/1 var(--font-num); color: var(--ink-soft); font-variant-numeric: tabular-nums; transition: color .15s, background-color .15s; }
.dr-d:hover:not(:disabled) { box-shadow: inset 0 0 0 1px var(--line-hi); }
.dr-d:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }
.dr-d:disabled { color: var(--dim); }
.dr-d[aria-current="date"]::after { content: ""; position: absolute; left: 50%; bottom: 5px; width: 4px; height: 4px; margin-left: -2px; border-radius: 50%; background: currentColor; }
.dr-d.is-in { color: var(--ink); }
.dr-d.is-end { color: var(--paper); }
.dr.is-cells .dr-d.is-in { background: rgb(var(--ink-rgb) / .08); border-radius: 0; }
.dr.is-cells .dr-d.is-end { background: var(--ink); }
.dr-p.is-prev .dr-d.is-endb { color: var(--ink); }
.dr-end { position: absolute; z-index: 0; left: 0; top: 0; width: var(--cs); height: var(--cs); border-radius: 9px; background: var(--ink); opacity: 0; pointer-events: none; transition: transform var(--sp-snappy-d) var(--sp-snappy), opacity .15s, background-color .15s, box-shadow .15s; }
.dr-end.is-on { opacity: 1; }
.dr-p.is-prev .dr-end[data-e="b"] { background: transparent; box-shadow: inset 0 0 0 1.5px var(--ink); }
.dr-ft { grid-area: ft; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; padding-top: 10px; border-top: 1px solid var(--line); }
.dr-dl { margin: 0; flex: 1 1 160px; min-width: 0; font-size: 13.5px; font-weight: 500; color: var(--ink); white-space: nowrap; }
.dr-dl small { display: block; font-size: 12.5px; font-weight: 400; color: var(--muted); }
.dr-dl small b { font: 400 15px/1 var(--font-num); color: var(--ink); }
.dr-btns { display: flex; gap: 6px; margin-left: auto; }
@container (max-width: 340px) { .dr { --cs: 34px; } }
@media (pointer: coarse) { .dr-q button, .dr-nav button { min-height: 40px; } }`;

const drJs = String.raw`
window.TL4dr = function (box, c) {
  c = c || {};
  var T = new Date(2026, 10, 5), MS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], WD = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  function D(y, m, d) { return new Date(y, m, d); }
  function add(d, n) { return D(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function same(a, b) { return !!a && !!b && a.getTime() === b.getTime(); }
  function k(d) { return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(); }
  function wd(d) { return (d.getDay() + 6) % 7; }
  function span(a, b) { return Math.round((b - a) / 864e5) + 1; }
  function short(d) { return d.getDate() + ' ' + MS[d.getMonth()].slice(0, 3); }
  function lab(a, b) { return same(a, b) ? short(a) + ' ' + a.getFullYear() : short(a) + ' – ' + short(b) + ' ' + b.getFullYear(); }
  function days(a, b) { var n = span(a, b); return n + (n === 1 ? ' day' : ' days'); }
  function sales(d) { var x = (d.getDate() * 7919 + d.getMonth() * 104729 + d.getFullYear()) % 9973; return 9000 + (x % 7000) + (wd(d) >= 5 ? 6500 : 0); }
  function total(a, b) { var s = 0; for (var d = a; d <= b; d = add(d, 1)) s += sales(d); return s; }
  var Q = [['Today', T, T], ['Yesterday', add(T, -1), add(T, -1)], ['Last 7 days', add(T, -6), T], ['Last 30 days', add(T, -29), T], ['This month', D(2026, 10, 1), T], ['Last month', D(2026, 9, 1), D(2026, 9, 31)]];
  var ap = { a: Q[2][1], b: Q[2][2] }, dr = { a: ap.a, b: ap.b }, picking = false, hv = null, view = null, nm = 1, fd = ap.b, applied = false;
  var host = $('[data-dr]', box), id = box.id, chev = function (d) { return '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="' + (d < 0 ? 'M10 3.5 5.5 8l4.5 4.5' : 'M6 3.5 10.5 8 6 12.5') + '"/></svg>'; };
  host.className = 'dr' + (c.grow ? '' : ' is-fade') + (c.bars ? '' : ' is-cells') + (c.q === 'rail' ? '' : ' no-rail') + (c.q ? '' : ' no-q');
  host.innerHTML = '<button class="dr-t" type="button" aria-haspopup="dialog" data-t><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.5" y="3.5" width="11" height="10" rx="2"/><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3"/></svg><span class="dr-tl" data-tl></span><span class="dr-tn" data-tn></span></button>'
    + (c.total ? '<p class="dr-sum"><b data-ts></b> in sales</p>' : '')
    + '<div class="dr-p" data-p role="dialog" aria-label="Pick a date range"><div class="dr-sf" data-sf></div><div class="dr-in" data-in>'
    + (c.q ? '<div class="dr-q" role="group" aria-label="Quick ranges">' + Q.map(function (q, i) { return '<button type="button" aria-pressed="false" data-q="' + i + '">' + q[0] + '</button>'; }).join('') + '</div>' : '')
    + '<div class="dr-cal"><div class="dr-nav"><button type="button" data-prev aria-label="Earlier month">' + chev(-1) + '</button><button type="button" data-next aria-label="Later month">' + chev(1) + '</button></div><div class="dr-ms" data-ms></div></div>'
    + '<div class="dr-ft"><p class="dr-dl" aria-live="polite"><span data-dl></span>' + (c.total ? '<small><b data-fs></b> in sales</small>' : '') + '</p>' + (c.live ? '' : '<div class="dr-btns"><button class="l-btn sm ghost" type="button" data-cancel>Cancel</button><button class="l-btn sm pri" type="button" data-apply>Apply</button></div>') + '</div>'
    + '</div></div>';
  var t = $('[data-t]', host), P = $('[data-p]', host), sf = $('[data-sf]', host), inn = $('[data-in]', host), ms = $('[data-ms]', host), apb = $('[data-apply]', host), tlEl = $('[data-tl]', host);
  var tl = TLline(tlEl), tn = TLline($('[data-tn]', host)), dl = TLline($('[data-dl]', host));
  var ts = c.total ? TLroll($('[data-ts]', host), { value: total(ap.a, ap.b), fmt: TLkes, dur: 640, live: false }) : null, fs = c.total ? TLroll($('[data-fs]', host), { value: total(ap.a, ap.b), fmt: TLkes, dur: 560, live: false }) : null;
  tl.set(lab(ap.a, ap.b), 1); tn.set(days(ap.a, ap.b), 1);
  function first(m) { return D(m.getFullYear(), m.getMonth(), 1); }
  function vis(d) { var a = first(view), b = D(view.getFullYear(), view.getMonth() + nm, 0); return d >= a && d <= b; }
  function month(m) {
    var y = m.getFullYear(), mo = m.getMonth(), lead = wd(D(y, mo, 1)), n = D(y, mo + 1, 0).getDate(), h = '<div class="dr-m" role="group" aria-label="' + MS[mo] + ' ' + y + '"><p class="dr-mn">' + MS[mo] + ' ' + y + '</p><div class="dr-wd" aria-hidden="true"><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span></div>';
    for (var w = 0; w < 6; w++) {
      h += '<div class="dr-wk" data-w0="' + k(D(y, mo, 1 - lead + w * 7)) + '">' + (c.bars ? '<i class="dr-bar"></i>' : '');
      for (var j = 0; j < 7; j++) { var dn = 1 - lead + w * 7 + j, d = D(y, mo, dn); h += dn < 1 || dn > n ? '<span></span>' : '<button class="dr-d" type="button" tabindex="-1" data-d="' + k(d) + '" aria-label="' + WD[j] + ' ' + dn + ' ' + MS[mo] + ' ' + y + '"' + (d > T ? ' disabled' : '') + (same(d, T) ? ' aria-current="date"' : '') + '>' + dn + '</button>'; }
      h += '</div>';
    }
    return h + (c.ends ? '<i class="dr-end" data-e="a"></i><i class="dr-end" data-e="b"></i>' : '') + '</div>';
  }
  function parse(s) { var p = s.split('-'); return D(+p[0], +p[1], +p[2]); }
  function render(dir) {
    var old = ms.firstChild, w = document.createElement('div'); w.className = 'dr-mw';
    var h = ''; for (var i = 0; i < nm; i++) h += month(D(view.getFullYear(), view.getMonth() + i, 1)); w.innerHTML = h;
    if (old && dir && moving()) {
      old.style.cssText = 'position:absolute;left:0;top:0;width:' + old.offsetWidth + 'px'; ms.appendChild(w);
      old.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateX(' + (-dir * 28) + 'px)', opacity: 0 }], { duration: 240, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }).onfinish = function () { old.remove(); };
      w.animate([{ transform: 'translateX(' + (dir * 28) + 'px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' });
    } else { ms.textContent = ''; ms.appendChild(w); }
    $('[data-next]', host).disabled = vis(T);
    paint(true);
  }
  function cur() { return ms.lastChild; }
  function rng() { if (!dr.a) return null; var b = picking ? (hv || dr.a) : dr.b; return b < dr.a ? [b, dr.a] : [dr.a, b]; }
  function paint(jump) {
    var r = rng(), w = cur(); P.classList.toggle('is-prev', picking);
    $$('.dr-wk', w).forEach(function (wk) {
      var s0 = parse(wk.getAttribute('data-w0')), btns = $$('.dr-d', wk), lo = -1, hi = -1;
      btns.forEach(function (b) { var d = parse(b.getAttribute('data-d')), j = wd(d), on = r && d >= r[0] && d <= r[1], e = r && (same(d, r[0]) || same(d, r[1]));
        b.classList.toggle('is-in', !!on && !e); b.classList.toggle('is-end', !!e); b.classList.toggle('is-endb', !!e && picking && !same(d, dr.a));
        if (on) { if (lo < 0) lo = j; hi = j; } });
      var bar = $('.dr-bar', wk); if (!bar) return;
      var L, R; if (lo >= 0) { L = lo / 7 * 100; R = (6 - hi) / 7 * 100; } else { var after = r && r[0] > add(s0, 6); L = after ? 100 : 0; R = 100 - L; }
      if (jump) bar.style.transition = 'none';
      bar.style.clipPath = 'inset(3px ' + R.toFixed(3) + '% 3px ' + L.toFixed(3) + '% round 9px)';
      if (jump) { bar.offsetWidth; bar.style.transition = ''; }
    });
    if (c.ends) $$('.dr-m', w).forEach(function (m) {
      var en = !r ? [] : picking ? [dr.a, hv || dr.a] : [dr.a, dr.b];
      [['a', en[0]], ['b', en[1]]].forEach(function (p) {
        var e = $('.dr-end[data-e="' + p[0] + '"]', m), b = p[1] && $('[data-d="' + k(p[1]) + '"]', m);
        if (!b) { e.classList.remove('is-on'); return; }
        var x = b.offsetLeft, y = b.parentNode.offsetTop; if (jump || !e.classList.contains('is-on')) { e.style.transition = 'none'; e.style.transform = 'translate(' + x + 'px,' + y + 'px)'; e.offsetWidth; e.style.transition = ''; }
        e.style.transform = 'translate(' + x + 'px,' + y + 'px)'; e.classList.add('is-on');
      });
    });
    $$('[data-q]', host).forEach(function (b) { var q = Q[+b.getAttribute('data-q')]; b.setAttribute('aria-pressed', String(!picking && same(dr.a, q[1]) && same(dr.b, q[2]))); });
    roving();
  }
  function roving() { var bs = $$('.dr-d', cur()), tb = $('[data-d="' + k(fd) + '"]', cur()) || bs.filter(function (b) { return !b.disabled; })[0]; bs.forEach(function (b) { b.tabIndex = b === tb ? 0 : -1; }); }
  var lastEnd = ap.b;
  function words() {
    if (picking) { dl.set('Pick the last day', 1); if (apb) apb.disabled = true; return; }
    var dir = dr.b >= lastEnd ? 1 : -1; lastEnd = dr.b; dl.set(lab(dr.a, dr.b) + ' · ' + days(dr.a, dr.b), dir); if (apb) apb.disabled = false; if (fs) fs.set(total(dr.a, dr.b));
  }
  function showView(d, dir) { var nv = D(d.getFullYear(), d.getMonth() - nm + 1, 1); if (vis(d)) return false; view = nv; render(dir); return true; }
  function pick(d) {
    if (!picking) { dr = { a: d, b: null }; picking = true; hv = d; }
    else { var a = dr.a; dr = d < a ? { a: d, b: a } : { a: a, b: d }; picking = false; hv = null; }
    fd = d; paint(); words();
    if (c.live && !picking) { applyNow(); setTimeout(function () { pp.set(false); }, moving() ? 320 : 0); }
  }
  function applyNow() { var dir = dr.b >= ap.b ? 1 : -1; ap = { a: dr.a, b: dr.b }; applied = true; if (ts) ts.set(total(ap.a, ap.b)); if (c.live || !c.grow || !moving()) { tl.set(lab(ap.a, ap.b), dir); } tn.set(days(ap.a, ap.b), dir); }
  ms.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('.dr-d'); if (!b || b.disabled) return; if (c.drag && e.detail !== 0) return; pick(parse(b.getAttribute('data-d'))); });
  ms.addEventListener('pointerover', function (e) { var b = e.target.closest && e.target.closest('.dr-d'); if (!b || b.disabled || !picking || drag) return; hv = parse(b.getAttribute('data-d')); paint(); });
  var drag = null;
  if (c.drag) {
    ms.addEventListener('pointerdown', function (e) { var b = e.target.closest && e.target.closest('.dr-d'); if (!b || b.disabled) return; var d = parse(b.getAttribute('data-d')); if (picking) { pick(d); return; } drag = { d: d, moved: false }; ms.setPointerCapture(e.pointerId); pick(d); e.preventDefault(); b.focus({ preventScroll: true }); });
    ms.addEventListener('pointermove', function (e) { if (!drag) return; var el = document.elementFromPoint(e.clientX, e.clientY), b = el && el.closest && el.closest('.dr-d'); if (!b || b.disabled || !ms.contains(b)) return; var d = parse(b.getAttribute('data-d')); if (!same(d, hv)) { hv = d; drag.moved = drag.moved || !same(d, drag.d); paint(); } });
    var end = function () { if (!drag) return; var g = drag; drag = null; if (g.moved && hv) pick(hv); };
    ms.addEventListener('pointerup', end); ms.addEventListener('pointercancel', end);
  }
  ms.addEventListener('keydown', function (e) {
    var b = e.target.closest && e.target.closest('.dr-d'); if (!b) return; var d = parse(b.getAttribute('data-d')), n = null, key = e.key;
    if (key === 'ArrowLeft') n = add(d, -1); else if (key === 'ArrowRight') n = add(d, 1); else if (key === 'ArrowUp') n = add(d, -7); else if (key === 'ArrowDown') n = add(d, 7);
    else if (key === 'Home') n = add(d, -wd(d)); else if (key === 'End') n = add(d, 6 - wd(d));
    else if (key === 'PageUp' || key === 'PageDown') { var s = (key === 'PageUp' ? -1 : 1) * (e.shiftKey ? 12 : 1); n = D(d.getFullYear(), d.getMonth() + s, Math.min(d.getDate(), D(d.getFullYear(), d.getMonth() + s + 1, 0).getDate())); }
    if (!n) return; e.preventDefault(); if (n > T) n = T;
    var dir = n > d ? 1 : -1; fd = n; if (picking) hv = n; showView(n, dir); paint(); var nb = $('[data-d="' + k(n) + '"]', cur()); if (nb) nb.focus({ preventScroll: true });
  });
  function step(s) { view = D(view.getFullYear(), view.getMonth() + s, 1); if (!vis(fd)) fd = D(view.getFullYear(), view.getMonth(), 1); render(s); }
  $('[data-prev]', host).addEventListener('click', function () { step(-1); });
  $('[data-next]', host).addEventListener('click', function () { step(1); });
  $$('[data-q]', host).forEach(function (b) { b.addEventListener('click', function () { var q = Q[+b.getAttribute('data-q')]; dr = { a: q[1], b: q[2] }; picking = false; hv = null; fd = q[2]; if (!showView(q[2], q[2] > view ? 1 : -1)) paint(); words(); if (c.live) { applyNow(); setTimeout(function () { pp.set(false); }, moving() ? 320 : 0); } }); });
  if (apb) { apb.addEventListener('click', function () { applyNow(); pp.set(false); }); $('[data-cancel]', host).addEventListener('click', function () { pp.set(false); }); }
  /* open: the trigger grows into the panel; close: it shrinks back and the label flies home */
  var anims = [];
  function stop() { anims.forEach(function (a) { a.cancel(); }); anims = []; }
  function clipFor(w, h) { return 'inset(0px ' + Math.max(0, P.offsetWidth - w) + 'px ' + Math.max(0, P.offsetHeight - h) + 'px 0px' + rr(10) + ')'; }
  function rr(n) { return ' round ' + n + 'px'; }
  var pp = pop(t, P, { trap: true,
    focus: function () { return $('.dr-d[tabindex="0"]', cur()); },
    onOpen: function () {
      applied = false; dr = { a: ap.a, b: ap.b }; picking = false; hv = null; fd = ap.b; lastEnd = ap.b;
      var W = host.clientWidth; nm = c.two && W >= 640 ? 2 : 1; host.classList.toggle('is-narrow', W < 520);
      view = D(ap.b.getFullYear(), ap.b.getMonth() - nm + 1, 1); ms.textContent = ''; render(0); words();
      stop(); if (!c.grow || !moving()) return; var s = TLsp('soft');
      anims.push(sf.animate([{ clipPath: clipFor(t.offsetWidth, t.offsetHeight) }, { clipPath: 'inset(0px 0px 0px 0px' + rr(14) + ')' }], { duration: s.d * 1.15, easing: s.e }));
      anims.push(inn.animate([{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }], { duration: 260, delay: 90, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }));
    },
    onClose: function () {
      var did = applied; applied = false;
      if (!c.grow || !moving()) { if (did && c.grow) tl.set(lab(ap.a, ap.b), 1); return; }
      stop(); var from = $('[data-dl]', host).getBoundingClientRect();
      anims.push(inn.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: 'ease-out', fill: 'forwards' }));
      anims.push(sf.animate([{ clipPath: 'inset(0px 0px 0px 0px' + rr(14) + ')' }, { clipPath: clipFor(t.offsetWidth, t.offsetHeight) }], { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }));
      setTimeout(function () { anims.forEach(function (a) { a.cancel(); }); anims = []; }, 380);
      if (did && !c.live) {
        var old = tlEl.textContent; tlEl.textContent = ''; tl = TLline(tlEl); tl.set(lab(ap.a, ap.b), 1);
        var to = tlEl.getBoundingClientRect(), b = TLsp('soft');
        host.classList.add('is-fly'); tlEl.animate([{ transform: 'translate(' + (from.left - to.left) + 'px,' + (from.top - to.top) + 'px)' }, { transform: 'none' }], { duration: b.d * 1.2, easing: b.e }).onfinish = function () { host.classList.remove('is-fly'); };
      }
    }
  });
};`;

const drHtml = '<div data-dr></div>';
const daterange = {
  id: 'daterange', n: '25', name: 'Date range picker', h: 470,
  claim: 'Picking a range should <em>show it stretch before you apply it.</em>',
  lead: 'PocketPay shows sales for the days you pick. Open the dates, pick a first and a last day, or a quick range. Nothing changes until you press Apply. Today is Thursday 5 November 2026, so later days are off.',
  ref: { ids: 'n01 · first date picker', text: 'Our booking calendar (n01): a faint ink band joins two ink end caps, and hover shows the range before you pick. In the first round you kept the plain, gliding, quick-pick and price versions.', url: SHOW + '#n01', label: 'Open n01' },
  noteHint: 'B, but without Apply', moreHint: 'a range picker with times as well as days',
  css: drCss.replace('#daterange .stage {', '#daterange .stage { container-type: inline-size; } #daterange .stage {'), js: drJs,
  opts: [
    {
      k: 'B', name: 'The button grows into two months, and the dates fly home', kind: 'Lively, after Arc',
      line: 'The button grows into a panel with quick ranges down the side. After the first day, the band stretches toward your pointer or the arrow keys, one band per week, and the ink ends glide. Months slide. Apply shrinks it back and the dates fly into the button.',
      from: [arc('date-range-picker'), house('n01'), house('n07')], tryit: 'Open it, click 26 Oct, move to 3 Nov, click, then Apply.',
      needs: 'A small script. Clip paths for the grow and the bands.', keys: 'Enter opens. Arrows move a day or a week and stretch the band. Page keys move a month. Enter picks. Escape closes without changing.', off: 'The panel appears and leaves at once. Bands and ends jump.', law: 'Jakob: quick ranges first, like every report page.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:loud', 'open:trigger', 'new:twist', 'look:ember'],
      html: drHtml, wide: true, js: String.raw`TL4dr(box, { grow: true, two: true, q: 'rail', bars: true, ends: true });`,
    },
    {
      k: 'A', name: 'A plain calendar under the button', kind: 'Plain',
      line: 'The shadcn way. A panel fades in under the button with one month. Each day in the range gets a shade. Apply or Cancel.',
      from: [['shadcn/ui date picker', 'https://ui.shadcn.com/docs/components/date-picker'], arc('date-range-picker')], tryit: 'Pick 2 Nov and 4 Nov, then Apply.',
      needs: 'A small script.', keys: 'Arrows move. Enter picks. Escape closes.', off: 'Same; only a fade goes.', law: 'Jakob: the calendar most sites use.',
      tags: ['motion:still', 'speed:quick', 'density:compact', 'feedback:quiet', 'open:trigger', 'new:familiar', 'look:ember'],
      html: drHtml, js: String.raw`TL4dr(box, {});`,
    },
    {
      k: 'C', name: 'Quick ranges on top, no Apply', kind: 'Mix',
      line: 'The first round’s quick picks as chips over the month. The same stretching band and gliding ends as B. There is no Apply: the second click or a chip sets it, the band lands, then it closes and the button rolls to the new dates.',
      from: [arc('date-range-picker'), house('n01'), ['Taste Lab date picker C', null]], tryit: 'Open it and press Last 30 days.',
      needs: 'A small script.', keys: 'Arrows move and stretch the band. Enter picks. Escape closes.', off: 'It closes at once after the pick.', law: 'Hick: one tap on a chip does the common case.',
      tags: ['motion:springy', 'speed:quick', 'density:compact', 'feedback:clear', 'open:trigger', 'new:twist', 'look:ember'],
      html: drHtml, js: String.raw`TL4dr(box, { grow: true, q: 'row', bars: true, ends: true, live: true });`,
    },
    {
      k: 'D', name: 'Drag across the days, and see the sales add up', kind: 'Reference, pushed',
      line: 'Our booking calendar (n01), pushed for a report. Press a day and drag to the last one, or click two days. The band follows your finger. The panel adds up the sales for those days, rolling as the range changes, and Apply sends it home.',
      from: [house('n01'), arc('date-range-picker'), house('n07')], tryit: 'Open it and drag from 9 Nov back to 2 Nov.',
      needs: 'A small script and pointer events.', keys: 'Arrows move and stretch the band. Enter picks. Escape closes.', off: 'The band jumps; the sum swaps.', law: 'Fitts: one drag instead of two exact taps.',
      tags: ['motion:springy', 'speed:mid', 'density:mid', 'feedback:clear', 'open:trigger', 'new:novel', 'look:ember'],
      html: drHtml, h: 490, js: String.raw`TL4dr(box, { grow: true, bars: true, ends: true, drag: true, total: true });`,
    },
  ],
};

/*@@MORE@@*/




export default [multisel, radiocards, segmented, rating, daterange, dropzone];
