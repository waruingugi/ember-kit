/* ================= shared helpers for every option ================= */
var root = document.documentElement;
function lvl() { return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'off' : (root.getAttribute('data-motion') || 'lively'); }
function moving() { return lvl() !== 'off'; }
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function run(id, fn) { var el = document.getElementById(id); if (!el) return; try { fn(el); } catch (e) { console.error('Taste Lab part ' + id + ' failed', e); } }
var TICK = '<svg class="l-tick draw" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="11"/><path d="M6.6 11.4 9.6 14.3l5.8-6.4"/></svg>';

/* Real spring curves as CSS linear(), so springs need no motion library. */
(function () {
  if (!window.CSS || !CSS.supports('transition-timing-function', 'linear(0, 1)')) return;
  function curve(k, c, m) {
    var x = 0, v = 0, dt = 1 / 1000, pts = [0], last = 0;
    for (var i = 1; i < 2500; i++) { var a = (-k * (x - 1) - c * v) / m; v += a * dt; x += v * dt; pts.push(x); if (Math.abs(x - 1) > 0.003 || Math.abs(v) > 0.05) last = i; }
    var end = Math.min(pts.length - 1, last + 10), out = [];
    for (var j = 0; j <= 48; j++) out.push(j === 48 ? '1' : pts[Math.round(j * end / 48)].toFixed(3));
    return { e: 'linear(' + out.join(', ') + ')', d: (end / 1000).toFixed(2) + 's' };
  }
  var s = curve(380, 30, 0.5), b = curve(320, 17, 0.7), g = curve(170, 26, 0.9);
  var st = document.createElement('style');
  st.textContent = ':root{--sp-snappy:' + s.e + ';--sp-snappy-d:' + s.d + ';--sp-bouncy:' + b.e + ';--sp-bouncy-d:' + b.d + ';--sp-soft:' + g.e + ';--sp-soft-d:' + g.d + '}';
  document.head.appendChild(st);
})();

/* Open and close a panel: Escape, outside press, focus in and back, optional focus trap. */
function pop(trigger, panel, o) {
  o = o || {}; var open = false;
  function set(v, back) {
    if (v === open) return; open = v;
    panel.classList.toggle('is-open', v); if (o.scrim) o.scrim.classList.toggle('is-open', v);
    if (trigger) trigger.setAttribute('aria-expanded', String(v));
    if (v) { if (o.onOpen) o.onOpen(); var f = typeof o.focus === 'function' ? o.focus() : (o.focus ? $(o.focus, panel) : null); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 20); }
    else { if (o.onClose) o.onClose(); if (back !== false && trigger && (panel.contains(document.activeElement) || document.activeElement === document.body)) trigger.focus({ preventScroll: true }); }
  }
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', function (e) { e.stopPropagation(); set(!open); });
    trigger.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) { e.stopPropagation(); set(false); } if (o.arrowOpen && e.key === 'ArrowDown' && !open) { e.preventDefault(); set(true); } });
  }
  document.addEventListener('pointerdown', function (e) { if (!open || panel.contains(e.target) || (trigger && trigger.contains(e.target)) || (o.keep && o.keep.contains(e.target))) return; set(false, false); });
  panel.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.stopPropagation(); set(false); return; }
    if (o.trap && e.key === 'Tab') {
      var f = $$('button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"]), a[href]', panel).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return; var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  return { set: set, isOpen: function () { return open; } };
}

/* Arrow keys through a list. focus:true moves real focus (menus); otherwise it marks the row (listbox with a text box). */
function nav(panel, sel, o) {
  o = o || {}; var idx = -1;
  function items() { return $$(sel, panel).filter(function (i) { return !i.hidden && !i.disabled && i.offsetParent !== null; }); }
  function keepIn(el) { var b = o.scroller; if (!b) return; if (el.offsetTop < b.scrollTop) b.scrollTop = el.offsetTop; else if (el.offsetTop + el.offsetHeight > b.scrollTop + b.clientHeight) b.scrollTop = el.offsetTop + el.offsetHeight - b.clientHeight; }
  function mark(i, focus) {
    var its = items(); if (!its.length) { idx = -1; if (o.hl) o.hl.style.opacity = 0; if (o.onMark) o.onMark(null); return; }
    idx = Math.max(0, Math.min(its.length - 1, i)); if (o.loop) idx = (i + its.length) % its.length;
    its.forEach(function (el, j) { if (j === idx) el.setAttribute('data-on', ''); else el.removeAttribute('data-on'); });
    var el = its[idx];
    if (o.hl) { o.hl.style.height = el.offsetHeight + 'px'; o.hl.style.transform = 'translateY(' + el.offsetTop + 'px)'; o.hl.style.opacity = 1; }
    if (focus || o.focus) el.focus({ preventScroll: true });
    keepIn(el); if (o.onMark) o.onMark(el);
  }
  function clear() { idx = -1; $$(sel, panel).forEach(function (el) { el.removeAttribute('data-on'); }); if (o.hl) o.hl.style.opacity = 0; }
  function key(e) {
    var its = items(), k = e.key;
    var fa = its.indexOf(document.activeElement); if (fa >= 0) idx = fa;
    if (k === 'ArrowDown') { e.preventDefault(); mark(idx < 0 ? 0 : idx + 1); }
    else if (k === 'ArrowUp') { e.preventDefault(); mark(idx < 0 ? its.length - 1 : idx - 1); }
    else if (k === 'Home') { e.preventDefault(); mark(0); }
    else if (k === 'End') { e.preventDefault(); mark(its.length - 1); }
    else if ((k === 'Enter' || (k === ' ' && o.focus)) && idx >= 0 && its[idx]) { e.preventDefault(); if (o.pick) o.pick(its[idx]); else its[idx].click(); }
    else if (o.focus && k.length === 1 && /\S/.test(k)) { var s = k.toLowerCase(); for (var j = 1; j <= its.length; j++) { var c = its[(idx + j) % its.length]; if ((c.textContent || '').trim().toLowerCase().indexOf(s) === 0) { mark((idx + j) % its.length); break; } } }
  }
  (o.keys || panel).addEventListener('keydown', key);
  panel.addEventListener('pointermove', function (e) { var t = e.target.closest && e.target.closest(sel); if (!t) return; var j = items().indexOf(t); if (j >= 0 && j !== idx) mark(j, o.focus); });
  return { mark: mark, clear: clear, items: items, index: function () { return idx; } };
}

/* ================= the page frame ================= */
(function () {
  var KEY = 'taste-lab-v1';
  function savePrefs() { try { localStorage.setItem(KEY, JSON.stringify({ theme: root.getAttribute('data-theme'), motion: root.getAttribute('data-motion') })); } catch (e) {} }
  var themeBtn = $('#themeBtn');
  function syncTheme() { var d = root.getAttribute('data-theme') === 'dark'; themeBtn.setAttribute('aria-label', d ? 'Switch to day theme' : 'Switch to night theme'); }
  themeBtn.addEventListener('click', function () { root.setAttribute('data-theme', root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); syncTheme(); savePrefs(); });
  syncTheme();
  function syncMotion() { $$('[data-motion-set]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-motion-set') === root.getAttribute('data-motion'))); }); }
  $$('[data-motion-set]').forEach(function (b) { b.addEventListener('click', function () { root.setAttribute('data-motion', b.getAttribute('data-motion-set')); syncMotion(); savePrefs(); }); });
  syncMotion();

  /* sidebar: collapse, resize, phone drawer */
  var SB_MIN = 216, SB_MAX = 420, SB_DEF = 272, sb = { w: SB_DEF, collapsed: false };
  try { var s0 = JSON.parse(localStorage.getItem('taste-lab-sb-v1') || '{}') || {}; if (s0.w) sb.w = s0.w; sb.collapsed = !!s0.collapsed; } catch (e) {}
  function saveSb() { try { localStorage.setItem('taste-lab-sb-v1', JSON.stringify(sb)); } catch (e) {} }
  var colBtn = $('#sbCollapse');
  function setCollapsed(c) { sb.collapsed = c; if (c) root.setAttribute('data-sb', 'collapsed'); else root.removeAttribute('data-sb'); colBtn.setAttribute('aria-label', c ? 'Expand sidebar' : 'Collapse sidebar'); colBtn.setAttribute('aria-expanded', String(!c)); saveSb(); setTimeout(place, 470); }
  function setWidth(w) { sb.w = Math.round(Math.max(SB_MIN, Math.min(SB_MAX, w))); root.style.setProperty('--sb-w', sb.w + 'px'); $('#sbResize').setAttribute('aria-valuenow', sb.w); }
  colBtn.setAttribute('aria-expanded', String(!sb.collapsed)); colBtn.setAttribute('aria-label', sb.collapsed ? 'Expand sidebar' : 'Collapse sidebar');
  colBtn.addEventListener('click', function () { setCollapsed(!sb.collapsed); });
  var handle = $('#sbResize'), drag = null;
  handle.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, w: sb.collapsed ? 68 : sb.w }; handle.setPointerCapture(e.pointerId); root.classList.add('is-resizing'); });
  handle.addEventListener('pointermove', function (e) { if (!drag) return; var w = drag.w + (e.clientX - drag.x); if (w < SB_MIN - 70) { if (!sb.collapsed) setCollapsed(true); } else { if (sb.collapsed) setCollapsed(false); setWidth(w); } place(); });
  function endDrag() { if (!drag) return; drag = null; root.classList.remove('is-resizing'); saveSb(); setTimeout(place, 50); }
  handle.addEventListener('pointerup', endDrag); handle.addEventListener('pointercancel', endDrag);
  handle.addEventListener('dblclick', function () { setCollapsed(false); setWidth(SB_DEF); saveSb(); });
  handle.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); if (sb.collapsed && e.key === 'ArrowRight') { setCollapsed(false); return; } var w = sb.w + (e.key === 'ArrowRight' ? 16 : -16); if (w < SB_MIN) setCollapsed(true); else setWidth(w); saveSb(); setTimeout(place, 50); }
    else if (e.key === 'Enter') setCollapsed(!sb.collapsed);
  });
  var menuBtn = $('#menuBtn'), scrim = $('#scrim');
  function setNav(open) { root.classList.toggle('nav-open', open); menuBtn.setAttribute('aria-expanded', String(open)); if (open) setTimeout(function () { var a = $('.sb-link.is-active') || $('.sb-link'); if (a) a.focus(); }, 60); }
  menuBtn.addEventListener('click', function () { setNav(!root.classList.contains('nav-open')); });
  scrim.addEventListener('click', function () { setNav(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('nav-open')) { setNav(false); menuBtn.focus(); }
    if (!e.target || !e.target.closest || e.target.closest('input, textarea, select, [contenteditable]')) return;
    if (e.key === '[' && !e.metaKey && !e.ctrlKey && !e.altKey) setCollapsed(!sb.collapsed);
  });
  var links = $$('.sb-link'), ind = $('#sbIndicator'), nav0 = $('#sbNav'), active = null;
  function place() { if (!active) { ind.style.opacity = 0; return; } ind.style.top = active.offsetTop + 'px'; ind.style.height = active.offsetHeight + 'px'; ind.style.opacity = 1; }
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(a.getAttribute('href')); if (!t) return;
      e.preventDefault(); setNav(false);
      scrollTo({ top: a.getAttribute('href') === '#top' ? 0 : t.getBoundingClientRect().top + scrollY - 70, behavior: moving() ? 'smooth' : 'auto' });
      history.replaceState(null, '', a.getAttribute('href'));
    });
  });
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var top = $('#topProgress'), ghosts = $$('.ghost'), ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var h = document.documentElement.scrollHeight - innerHeight; top.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
      var cur = null; secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < innerHeight * 0.35) cur = links[i]; });
      if (cur !== active) { if (active) active.classList.remove('is-active'); active = cur; if (active) { active.classList.add('is-active'); var r = active.offsetTop - nav0.clientHeight / 2; nav0.scrollTop = Math.max(0, r); } place(); }
      if (lvl() === 'lively') ghosts.forEach(function (g) { var r = g.parentNode.getBoundingClientRect(); if (r.bottom < -300 || r.top > innerHeight + 300) return; g.style.transform = 'translate3d(0,' + ((r.top - innerHeight * 0.4) * -0.1).toFixed(1) + 'px,0)'; });
      else ghosts.forEach(function (g) { g.style.transform = ''; });
    });
  }
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', function () { place(); onScroll(); }); onScroll();

  /* fade-up on arrival; anything already on screen at load shows at once */
  var rv = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('is-in'); else io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('is-in'); });
})();

/* ================= picks: saved to the page's database ================= */
(function () {
  var ROUND = 'r1', COL = 'rounds/' + ROUND + '/picks', S = {}, db = null, canWrite = true, busy = {}, timers = {};
  var byId = {}; LAB.forEach(function (c) { byId[c.id] = c; S[c.id] = { pick: null, none: false, note: '', more: '' }; });
  var storeEl = $('#storeState');
  function store(t, bad) { storeEl.textContent = t; storeEl.classList.toggle('is-bad', !!bad); }
  function secState(id, t, bad) { var el = $('#' + id + ' .save-state'); if (el) { el.textContent = t; el.classList.toggle('is-bad', !!bad); } }
  function render(id) {
    var c = byId[id], s = S[id], sec = document.getElementById(id); if (!sec) return;
    $$('.opt', sec).forEach(function (o) { var on = o.getAttribute('data-opt') === s.pick; o.classList.toggle('is-picked', on); $('.pick', o).setAttribute('aria-pressed', String(on)); });
    $('[data-none]', sec).setAttribute('aria-pressed', String(!!s.none));
    var n = $('[data-note]', sec), m = $('[data-more]', sec);
    if (document.activeElement !== n) n.value = s.note || ''; if (document.activeElement !== m) m.value = s.more || '';
    var link = $('.sb-link[data-comp="' + id + '"]'); if (link) link.classList.toggle('is-picked', !!(s.pick || s.none));
    summary();
  }
  function summary() {
    var done = 0, lines = ['Taste Lab, round 1 picks'], html = '';
    LAB.forEach(function (c) {
      var s = S[c.id], o = s.pick && c.opts.filter(function (x) { return x.k === s.pick; })[0];
      if (s.pick || s.none) done++;
      var what = o ? s.pick + ' · ' + o.name : (s.none ? 'None of these' : 'Not picked yet');
      lines.push(c.n + ' ' + c.name + ': ' + what + (o ? ' [' + o.tags.join(', ') + ']' : '') + (s.note ? ' | note: ' + s.note : '') + (s.more ? ' | more like: ' + s.more : ''));
      var extra = (s.note ? s.note : '') + (s.more ? (s.note ? ' · ' : '') + 'More like: ' + s.more : '');
      html += '<li><span class="n">' + c.n + '</span><span>' + c.name + '<small>' + esc(o ? o.name : '') + (extra ? (o ? ' · ' : '') + esc(extra) : '') + '</small></span><span class="p' + (o ? '' : ' is-none') + '">' + (o ? s.pick : (s.none ? 'None' : '—')) + '</span></li>';
    });
    $('#sumList').innerHTML = html; $('#sumText').value = lines.join('\n');
    $('#pickCount').textContent = done + ' of ' + LAB.length + ' picked';
    $('#sbPct').textContent = done + ' of ' + LAB.length;
    $('#sbBar').style.transform = 'scaleX(' + done / LAB.length + ')';
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }
  function save(id) {
    if (!db || !canWrite) { secState(id, db ? 'Read only' : 'Not saved here. Use Copy picks at the end.', true); return; }
    if (busy[id]) { busy[id].again = true; return; }
    busy[id] = { again: false }; secState(id, 'Saving…');
    (function go() {
      var c = byId[id], s = S[id], o = s.pick && c.opts.filter(function (x) { return x.k === s.pick; })[0];
      db.collection(COL).doc(id).set({ round: ROUND, component: id, name: c.name, pick: s.pick || null, option: o ? o.name : null, tags: o ? o.tags : [], none: !!s.none, note: s.note || '', more: s.more || '', savedAt: new Date().toISOString() })
        .then(function () { if (busy[id].again) { busy[id].again = false; go(); return; } delete busy[id]; secState(id, 'Saved'); },
          function (e) { delete busy[id]; secState(id, e && e.code === 'invalid_argument' ? 'Not saved: this view is read only' : 'Not saved. Use Copy picks at the end.', true); if (e && e.code === 'invalid_argument') canWrite = false; });
    })();
  }
  LAB.forEach(function (c) {
    var sec = document.getElementById(c.id); if (!sec) return;
    $$('.pick', sec).forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-pick'), s = S[c.id]; s.pick = s.pick === k ? null : k; if (s.pick) s.none = false; render(c.id); save(c.id); }); });
    $('[data-none]', sec).addEventListener('click', function () { var s = S[c.id]; s.none = !s.none; if (s.none) s.pick = null; render(c.id); save(c.id); });
    [['[data-note]', 'note'], ['[data-more]', 'more']].forEach(function (p) {
      var el = $(p[0], sec);
      el.addEventListener('input', function () { S[c.id][p[1]] = el.value; summary(); clearTimeout(timers[c.id + p[1]]); timers[c.id + p[1]] = setTimeout(function () { save(c.id); }, 900); });
      el.addEventListener('change', function () { clearTimeout(timers[c.id + p[1]]); save(c.id); });
    });
  });
  summary();
  $('#copyPicks').addEventListener('click', function () {
    var t = $('#sumText'), st = $('#copyState');
    function manual() { t.focus(); t.select(); st.textContent = 'Selected. Press Ctrl+C or ⌘C to copy.'; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t.value).then(function () { st.textContent = 'Copied.'; }, manual); else manual();
  });

  if (!window.claude || typeof window.claude.use !== 'function') { store('Not saving here. Use Copy picks.', true); return; }
  store('Connecting…');
  Promise.all([window.claude.use('db'), window.claude.use('user')]).then(function (r) {
    db = r[0]; var user = r[1];
    if (!db) { store('Saving is off here. Use Copy picks.', true); return; }
    if (user && typeof user.isOwner === 'function' && !user.isOwner()) { canWrite = false; $$('.pick, [data-none], [data-note], [data-more]').forEach(function (b) { b.disabled = true; }); }
    var t = setTimeout(function () { store('Can’t reach saved picks yet', true); }, 10000);
    db.collection(COL).onSnapshot(function (snap) {
      if (!snap.metadata.fromCache) { clearTimeout(t); store(canWrite ? 'Picks save to this page' : 'Read only: the owner picks'); }
      snap.docs.forEach(function (d) { var x = d.data(); if (!x || !S[d.id] || busy[d.id]) return; S[d.id] = { pick: typeof x.pick === 'string' ? x.pick : null, none: !!x.none, note: String(x.note || ''), more: String(x.more || '') }; render(d.id); });
    }, function () { clearTimeout(t); store('Saved picks can’t be reached', true); });
  });
})();
