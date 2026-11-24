/* tbl:begin. The table piece's behaviour (kit/cards/table.md). One copy, shared by every table. */
function emberTable(box, cfg) {
  "use strict";
  var root = document.documentElement;
  function lv() { var m = root.dataset.motion || "lively"; if (matchMedia("(prefers-reduced-motion: reduce)").matches) m = "off"; return m; }
  function $(s, el) { return (el || box).querySelector(s); }
  function $$(s, el) { return [].slice.call((el || box).querySelectorAll(s)); }
  var ROWS = cfg.rows, cols = cfg.columns, idOf = cfg.id;
  var tb = $("tbody"), foot = $(".tbl-foot"), all = $("thead .tbl-cb"), bar = $(".tbl-bar"), bn = $(".tbl-count"), search = $(".tbl-search input");
  var sort = { k: cfg.sort.k, dir: cfg.sort.dir }, sel = {}, q = "";
  var CB = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.8 8.3 6.7 11 12.2 5"/></svg>';
  function rows() { return ROWS.filter(function (x) { return !q || cfg.text(x).toLowerCase().indexOf(q) >= 0; }).sort(function (a, b) { var A = cols[sort.k].get(a), B = cols[sort.k].get(b); return (A > B ? 1 : A < B ? -1 : 0) * sort.dir; }); }
  function cell(c, r) { return "<td" + (c.cls ? ' class="' + c.cls + '"' : "") + ">" + c.html(r) + "</td>"; }
  function render() {
    var flip = lv() !== "off", before = {};
    if (flip) $$("tr[data-id]", tb).forEach(function (tr) { before[tr.dataset.id] = tr.getBoundingClientRect().top; });
    var rs = rows();
    tb.innerHTML = rs.map(function (r) { var id = idOf(r), s = !!sel[id]; return '<tr data-id="' + id + '" aria-selected="' + s + '"><td class="tbl-ckc"><button class="tbl-cb" type="button" role="checkbox" aria-checked="' + s + '" aria-label="' + cfg.pickLabel(r) + '">' + CB + "</button></td>" + cols.map(function (c) { return cell(c, r); }).join("") + "</tr>"; }).join("") || '<tr class="tbl-empty"><td colspan="' + (cols.length + 1) + '">' + cfg.empty + "</td></tr>";
    $$("tr[data-id]", tb).forEach(function (tr) {
      $(".tbl-cb", tr).addEventListener("click", function () { sel[tr.dataset.id] = !sel[tr.dataset.id]; render(); var b = $('tr[data-id="' + tr.dataset.id + '"] .tbl-cb', tb); if (b) b.focus(); });
      var b0 = before[tr.dataset.id]; if (flip && b0 !== undefined) { var d = b0 - tr.getBoundingClientRect().top; if (d) tr.animate([{ transform: "translateY(" + d + "px)" }, { transform: "none" }], { duration: 420, easing: "cubic-bezier(.22,1,.36,1)" }); }
    });
    var ids = Object.keys(sel).filter(function (k) { return sel[k]; }), picked = ROWS.filter(function (r) { return sel[idOf(r)]; }), on = ids.length > 0;
    all.setAttribute("aria-checked", ids.length === ROWS.length ? "true" : on ? "mixed" : "false");
    foot.textContent = on ? ids.length + " of " + ROWS.length + " picked" + (cfg.pickedNote ? cfg.pickedNote(picked) : "") : rs.length + " of " + ROWS.length + " " + cfg.noun + " · sorted by " + cols[sort.k].name + (sort.dir > 0 ? ", low to high" : ", high to low");
    bar.classList.toggle("is-on", on); bar.setAttribute("aria-hidden", String(!on)); $$("button", bar).forEach(function (b) { b.tabIndex = on ? 0 : -1; }); bn.textContent = ids.length + " picked";
  }
  function clear() { for (var k in sel) sel[k] = false; render(); }
  $$("th[data-k]").forEach(function (h) { $(".tbl-sort", h).addEventListener("click", function () { var k = +h.dataset.k; sort = { k: k, dir: sort.k === k ? -sort.dir : 1 }; $$("th[data-k]").forEach(function (x) { x.setAttribute("aria-sort", +x.dataset.k === k ? (sort.dir > 0 ? "ascending" : "descending") : "none"); }); render(); }); });
  all.addEventListener("click", function () { var on = all.getAttribute("aria-checked") !== "true"; ROWS.forEach(function (r) { sel[idOf(r)] = on; }); render(); });
  if (search) search.addEventListener("input", function (e) { q = e.target.value.trim().toLowerCase(); render(); });
  $$("[data-bx]", bar).forEach(function (b) { b.addEventListener("click", function () { var m = b.getAttribute("data-bx"), ids = Object.keys(sel).filter(function (k) { return sel[k]; }); clear(); foot.textContent = m; all.focus(); if (cfg.onAction) cfg.onAction(b, ids); }); });
  $("[data-bc]", bar).addEventListener("click", function () { clear(); all.focus(); });
  render();
  /* a handle for pages that change the data (tabs, React state): rows glide to their new places; ticks on rows that left are dropped */
  return { setRows: function (next) { ROWS = next; var keep = {}; ROWS.forEach(function (r) { var id = idOf(r); if (sel[id]) keep[id] = true; }); sel = keep; render(); }, rows: function () { return ROWS.slice(); } };
}
/* Cell html is written into the page as is: pass any text that came from people through emberTable.esc. */
emberTable.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
/* tbl:end */
