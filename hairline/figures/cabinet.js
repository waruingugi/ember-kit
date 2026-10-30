/**
 * Cabinet: a watchmaker's parts cabinet, two columns of three drawers on low
 * feet. The drawer under the pointer slides out on the 700ms lift curve and
 * its neighbours ease out a little, staggered by distance. Inside the open
 * drawer three spare wheels pop up one after another and turn as they rise,
 * and the drawer's pull takes the bright stroke. At rest one drawer stands
 * half open with its wheels showing, and the others sit at uneven depths. The
 * slider is the stagger, in ms.
 */
const {
  Cam, clamp, facing, fillet, fit, open, poly, prism, proj, rings, rrect, seg,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const COLS = 2, ROWS = 3, W = 104, D = 54, H = 84, FOOT = 5, M = 4, GX = 4, GZ = 4, TAU = Math.PI * 2;
const DW = (W - 2 * M - (COLS - 1) * GX) / COLS, DH = (H - 2 * M - (ROWS - 1) * GZ) / ROWS;
const REST = [2, 0, 24, 1, 0, 4], OUT = 34, NUDGE = 6, PARTS = 3;

/** Drawer k: column c and row r (row 0 at the bottom), and its front's box on the face, in x and z. */
function drawer(k) {
  const r = Math.floor(k / COLS), c = k % COLS;
  const xa = M + c * (DW + GX), za = FOOT + M + r * (DH + GZ);
  return { r, c, xa, xb: xa + DW, za, zb: za + DH };
}
/** A small spare wheel lying flat, turned by a. */
function wheel(cx, cy, R, a) {
  const pts = [];
  for (let k = 0; k < 10; k++) for (const [f, r] of [[0, R - 1], [0.15, R], [0.45, R], [0.6, R - 1]]) {
    const t = a + ((k + f) / 10) * TAU;
    pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
  }
  return pts;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.48);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, D + OUT + 2, 0], [W, D + OUT + 2, 0], [0, 0, FOOT + H], [W, 0, FOOT + H], [0, D + OUT, FOOT + H]], 200, 166);
  const P = proj(C), front = facing(C);
  const onFace = (y) => (pts) => pts.map(([u, v]) => P(u, y, v));

  const g = mk("g", {}, svg);
  // Four feet, the body, and its top lip. The body never moves.
  for (const [x, y] of [[6, 6], [W - 6, 6], [6, D - 6], [W - 6, D - 6]]) {
    const [r, ri] = rings(x - 4, y - 4, x + 4, y + 4, 2, 0.8);
    put(solid(g), prism(P, front, r, ri, 0, FOOT));
  }
  const [bodyR, bodyI] = rings(0, 0, W, D, 5, 1.8);
  put(solid(g), prism(P, front, bodyR, bodyI, FOOT, FOOT + H));
  const [lipR, lipI] = rings(-2, -2, W + 2, D + 2, 6, 1.6);
  put(solid(g), prism(P, front, lipR, lipI, FOOT + H, FOOT + H + 2.6));
  // The dark slots each drawer front sits in, drawn once on the face.
  for (let k = 0; k < COLS * ROWS; k++) {
    const h = drawer(k);
    mk("path", { d: poly(onFace(D)(rrect(h.xa - 0.6, h.za - 0.6, h.xb + 0.6, h.zb + 0.6, 2.6, 5).map((q) => [q.u, q.v]))), class: "nf lo" }, g);
  }

  const drawers = [];
  for (let k = 0; k < COLS * ROWS; k++) {
    const h = drawer(k), dg = mk("g", {}, g);
    const box = solid(dg);
    const parts = [];
    for (let j = 0; j < PARTS; j++) parts.push({ back: mk("path", { class: "lo" }, dg), face: mk("path", { class: "nf" }, dg), z: tween(0) });
    const back = mk("path", { class: "lo" }, dg), face = mk("path", { class: "sil" }, dg);
    const pull = mk("path", { class: "nf" }, dg), label = mk("path", { class: "nf lo" }, dg);
    drawers.push({ h, g: dg, box, parts, back, face, pull, label, e: tween(REST[k]), drawn: NaN });
  }

  const shapeFront = (h) => rrect(h.xa, h.za, h.xb, h.zb, 2.4, 5).map((q) => [q.u, q.v]);
  const pullShape = (h) => fillet([[(h.xa + h.xb) / 2 - 9, h.zb - 9], [(h.xa + h.xb) / 2 + 9, h.zb - 9], [(h.xa + h.xb) / 2 + 9, h.zb - 5.6], [(h.xa + h.xb) / 2 - 9, h.zb - 5.6]], [1.6, 1.6, 1.6, 1.6]);
  const labelShape = (h) => fillet([[(h.xa + h.xb) / 2 - 7, h.za + 5], [(h.xa + h.xb) / 2 + 7, h.za + 5], [(h.xa + h.xb) / 2 + 7, h.za + 11], [(h.xa + h.xb) / 2 - 7, h.za + 11]], [0.8, 0.8, 0.8, 0.8]);

  /** Drawer k pulled out by e, with its spare wheels risen by their own tweens. */
  function draw(dr, now) {
    const e = Math.max(0, tval(dr.e, now)), h = dr.h, y = D + e;
    if (e > 2.2) {
      const [r, ri] = rings(h.xa + 1.2, D - 1, h.xb - 1.2, y - 0.8, 1.8, 1.4);
      put(dr.box, prism(P, front, r, ri, h.za + 1, h.zb - 4));
    } else put(dr.box, { sil: "", crease: "" });
    dr.parts.forEach((p, j) => {
      const lift = tval(p.z, now), cx = h.xa + 9 + j * ((DW - 18) / (PARTS - 1)), cy = D + Math.min(e - 7, 16), zf = h.zb - 4 + lift;
      if (e < 12) { p.back.setAttribute("d", ""); p.face.setAttribute("d", ""); return; }
      const pts = wheel(cx, cy, 4.6 - j * 0.6, lift * 0.35 + j);
      p.back.setAttribute("d", poly(pts.map(([u, v]) => P(u, v, zf - 0.9))));
      p.face.setAttribute("d", poly(pts.map(([u, v]) => P(u, v, zf))));
    });
    const f = shapeFront(h);
    dr.back.setAttribute("d", poly(onFace(y - 1.6)(f)));
    dr.face.setAttribute("d", poly(onFace(y)(f)));
    dr.pull.setAttribute("d", poly(onFace(y + 0.4)(pullShape(h))));
    dr.label.setAttribute("d", poly(onFace(y)(labelShape(h))));
  }

  let order = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    // Paint the drawers that stick out furthest last, so they cover the ones behind them; move groups, do not redraw.
    const sorted = drawers.slice().sort((a, b) => tval(a.e, now) - tval(b.e, now) || a.h.r - b.h.r);
    const key = sorted.map((d) => d.h.r * COLS + d.h.c).join();
    if (key !== order) { order = key; sorted.forEach((d) => g.appendChild(d.g)); }
    for (const dr of drawers) {
      draw(dr, now);
      if (!tdone(dr.e, now) || dr.parts.some((p) => !tdone(p.z, now))) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  // The pointer is read on the face's own plane, where the drawers rest shut. That plane never moves.
  const o = P(0, D, 0), ux = P(1, D, 0), uz = P(0, D, 1);
  const ax = [ux[0] - o[0], ux[1] - o[1]], az = [uz[0] - o[0], uz[1] - o[1]], det = ax[0] * az[1] - ax[1] * az[0];
  function hit([sx, sy]) {
    const qx = sx - o[0], qy = sy - o[1], x = (qx * az[1] - qy * az[0]) / det, z = (ax[0] * qy - ax[1] * qx) / det;
    for (let k = 0; k < COLS * ROWS; k++) {
      const h = drawer(k);
      if (x >= h.xa - GX / 2 && x <= h.xb + GX / 2 && z >= h.za - GZ / 2 && z <= h.zb + GZ / 2) return k;
    }
    return -1;
  }

  let act = -2;
  const restMark = REST.indexOf(Math.max(...REST));
  /** Opens drawer a (-1 puts every drawer back where it rests). Neighbours ease out by distance; the wheels inside pop up one by one. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : Math.max(act, restMark);
    act = a;
    const open = a < 0 ? restMark : a;
    drawers.forEach((dr, k) => {
      const dist = Math.max(Math.abs(dr.h.r - drawer(from).r), Math.abs(dr.h.c - drawer(from).c));
      const to = a < 0 ? REST[k] : k === a ? OUT : dist === 1 ? NUDGE : 0;
      tset(dr.e, to, now, dist * stag);
      dr.parts.forEach((p, j) => tset(p.z, k === open ? 3 + j * 1.2 : 0, now, dist * stag + 220 + j * 70));
      const lit = k === open;
      dr.pull.classList.toggle("hi", lit); dr.face.classList.toggle("hi", lit && a >= 0); dr.face.classList.toggle("sil", !(lit && a >= 0));
      dr.parts.forEach((p) => p.face.classList.toggle("hi", lit && a >= 0));
    });
    read.textContent = a < 0 ? "rest" : "drawer " + (drawer(a).c + 1) + "·" + (ROWS - drawer(a).r);
    B.wake();
  }

  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = clamp(v, 0, 120); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "cabinet",
  means: "A parts cabinet: the drawer under the pointer slides out, and the spare wheels inside pop up and turn.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[166, 122], [218, 182], [166, 190], null],
  mount,
});
