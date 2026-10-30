/**
 * Watch: a wristwatch taken apart, each part going the way it really comes
 * off. The case back unscrews and drops down, the movement lifts straight
 * up, the dial rises and slides right, the glass rises and slides left, and
 * the crown unscrews outward. Each part spins as it goes and lands square
 * when fully open. While it is on screen the wheels turn, the balance swings
 * and the hands keep the real time. The part under the pointer lifts further
 * with every layer above it, staggered out from it, and takes the bright
 * stroke. At rest the bright one is the movement. The slider is the explode.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, ringAt, rings, run, seg, unproj,
  spring, stepS, tween, tset, tval, tdone, reducedMotion, disposer, mk, place, pointer, put, register, solid,
} = HL;

const RO = 50, RI = 46, CUP = 14, GAP = 30, LIFT = 12, SPIN = 1.6, DROP = 30, S2 = Math.SQRT1_2, TAU = Math.PI * 2;
const UP = [-S2, -S2], RT = [S2, -S2];
/** A point r out from the middle at a clock angle a (0 is twelve o'clock, clockwise). */
const at = (r, a) => [r * (UP[0] * Math.cos(a) + RT[0] * Math.sin(a)), r * (UP[1] * Math.cos(a) + RT[1] * Math.sin(a))];
const rot = ([x, y], s) => [x * Math.cos(s) - y * Math.sin(s), x * Math.sin(s) + y * Math.cos(s)];
/** The layers above the case: name, height when shut, thickness, the radius the pointer finds it by, gaps it rises, how far it slides towards three o'clock. */
const LAYERS = [["movement", 2, 7, 42, 1, 0], ["dial", 10, 3, 45, 2, 26], ["glass", 13, 2.5, 47, 3, -24]];
/** The train: x, y, radius, teeth, turn rate. Neighbours turn opposite ways. */
const GEARS = [[-14, -9.5, 13, 24, -0.08], [0, 0, 11, 20, 0.2], [12, -10, 8, 15, -0.5], [23, -2, 6, 12, 1.2]];
const BAL = [15, 21, 10];

const shift = (ring, ox, oy) => ring.map((q) => ({ ...q, u: q.u + ox, v: q.v + oy }));
const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());
/** A wheel's toothed outline, turned by a, as world [x, y] points. */
function teeth(cx, cy, R, n, a) {
  const pts = [];
  for (let k = 0; k < n; k++) for (const [f, r] of [[0, R - 1.8], [0.14, R], [0.42, R], [0.56, R - 1.8]]) {
    const t = a + ((k + f) / n) * TAU;
    pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
  }
  return pts;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.32);
  const edge = (cx, cy, r, z) => [0, 1, 2, 3].map((k) => [cx + r * Math.cos((k * TAU) / 4 + TAU / 8), cy + r * Math.sin((k * TAU) / 4 + TAU / 8), z]);
  const slid = (d) => [RT[0] * d, RT[1] * d];
  fit(C, [...edge(0, 0, RO + 8, -DROP - 4), ...edge(...slid(26), 46, 10 + 2 * GAP + LIFT + 6), ...edge(...slid(-24), 48, 13 + 3 * GAP + LIFT + 3), ...edge(...slid(RO + 22), 6, 10)], 200, 160);
  const P = proj(C), front = facing(C);
  const outer = circ(RO, 96), inner = circ(RI, 96);

  const g = mk("g", {}, svg);
  // The case back hangs below everything, so it is painted first.
  const backG = mk("g", {}, g), back = solid(backG), notches = [0, 1, 2, 3, 4, 5].map(() => mk("circle", { r: 1.6, class: "dot off" }, backG));
  // The case, which never moves: its far half before the layers, its near wall after the ones still inside it.
  const lug = (sx, sy, k) => { const [x, y] = at(56, k); const [r, ri] = rings(x + sx - 4, y + sy - 4, x + sx + 4, y + sy + 4, 2.4, 0.8); return prism(P, front, r, ri, 2, 10); };
  const farG = mk("g", {}, g);
  for (const s of [-1, 1]) put(solid(farG), lug(RT[0] * 11 * s, RT[1] * 11 * s, 0));
  const caseSil = mk("path", { d: poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, CUP)))), class: "sil" }, farG);
  mk("path", { d: poly(ringAt(P, inner, CUP)), class: "nf" }, farG);
  mk("path", { d: open(ringAt(P, run(circ(RI - 4, 96), (q) => !front(q)), 3)), class: "nf lo" }, farG);
  const layerG = LAYERS.map(() => mk("g", {}, g));
  const nearG = mk("g", {}, g);
  const iF = LR(ringAt(P, run(inner, front), CUP)), oT = LR(ringAt(P, run(outer, front), CUP)), oB = LR(ringAt(P, run(outer, front), 0));
  mk("path", { d: poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]), class: "fo" }, nearG);
  mk("path", { d: open(oT), class: "nf lo" }, nearG);
  mk("path", { d: open(iF), class: "nf" }, nearG);
  mk("path", { d: open([oT[0], ...oB, oT[oT.length - 1]]), class: "nf sil" }, nearG);
  for (const s of [-1, 1]) put(solid(nearG), lug(RT[0] * 11 * s, RT[1] * 11 * s, Math.PI));
  const crown = solid(nearG), knurl = mk("path", { class: "nf lo" }, nearG);

  // Each layer's pieces, made once and re-pathed every frame.
  const L = LAYERS.map(([name], i) => ({ name, g: layerG[i], lift: tween(0), main: null }));
  const plate = solid(L[0].g), jewels = GEARS.concat([BAL]).map(() => mk("circle", { r: 1.2, class: "dot m" }, L[0].g));
  const wheels = GEARS.map(() => ({ back: mk("path", { class: "lo" }, L[0].g), face: mk("path", { class: "sil" }, L[0].g), hub: mk("path", { class: "nf lo" }, L[0].g) }));
  const rim = solid(L[0].g), spokes = mk("path", { class: "nf lo" }, L[0].g), hair = mk("path", { class: "nf lo" }, L[0].g);
  const dial = solid(L[1].g), sub = mk("path", { class: "nf lo" }, L[1].g), idx = [];
  for (let k = 0; k < 12; k++) idx.push(mk("circle", { r: k % 3 ? 1 : 1.6, class: k === 0 ? "dot m" : "dot off" }, L[1].g));
  const hourH = mk("path", { class: "sil" }, L[1].g), minH = mk("path", { class: "sil" }, L[1].g);
  const secH = mk("path", { class: "nf" }, L[1].g), cap = mk("path", { class: "sil" }, L[1].g);
  const glass = mk("path", { class: "nf lo" }, L[2].g), glassEdge = mk("path", { class: "nf lo" }, L[2].g);
  [plate.sil, dial.sil, glass].forEach((el, i) => { L[i].main = el; });
  const backLift = tween(0);

  const ex = spring(value, { eps: 0.002 });
  const t0 = Math.floor(Date.now() / 1000), secTw = tween((t0 % 60) * (TAU / 60), 240); // a tick is short: a watch snaps, it does not glide
  let lastSec = t0, act = -9, inside = -1; // -9 is no state, so the first setActive always runs
  const turn = (k, e) => SPIN * k * 4 * e * (1 - e);          // peaks halfway, gone when shut and when fully open
  /** Where layer i sits at explode e: its base height, its slide, and its spin. */
  const pose = (i, e, lift) => { const [, z0, , , up, sl] = LAYERS[i]; return { z: z0 + up * GAP * e + lift, ox: RT[0] * sl * e, oy: RT[1] * sl * e, s: turn(i + 1, e) }; };
  const hand = (Q, z, a, len, w, tail) => {
    const d = at(1, a), n = at(1, a + Math.PI / 2), p = (s, t) => [d[0] * s + n[0] * t, d[1] * s + n[1] * t];
    return poly([p(-tail, 0), p(len * 0.22, w), p(len, 0), p(len * 0.22, -w)].map(([x, y]) => Q(x, y, z)));
  };

  function draw(now) {
    const e = ex.x, t = now / 1000, live = !reducedMotion();
    const o = L.map((l, i) => pose(i, e, tval(l.lift, now)));
    const io = o.filter((p) => p.z < CUP - 1).length;
    if (io !== inside) { inside = io; (io ? L[io - 1].g : farG).after(nearG); }
    // The case back unscrews: it drops and turns the other way.
    const bz = -DROP * e - tval(backLift, now), bs = -turn(2, e);
    put(back, prism(P, front, circ(44, 96), circ(42.4, 96), bz - 3, bz));
    notches.forEach((el, k) => place(el, P(...rot([38 * Math.cos((k * TAU) / 6), 38 * Math.sin((k * TAU) / 6)], bs), bz)));
    // The crown unscrews outward, its grip lines turning as it goes.
    const [cx, cy] = at(RO + 4 + 16 * e, Math.PI / 2), ca = e * TAU * 1.5;
    put(crown, prism(P, front, shift(circ(4.5, 32), cx, cy), shift(circ(3.4, 32), cx, cy), 4, 10));
    knurl.setAttribute("d", [0, 1, 2].map((k) => { const a = ca + (k * TAU) / 3, u = RT[0] * Math.cos(a), v = RT[1] * Math.cos(a), h = 7 + 3 * Math.sin(a);
      return Math.cos(a) > -0.2 ? seg(P(cx + u * 4.4, cy + v * 4.4, h - 1.2), P(cx + u * 4.4, cy + v * 4.4, h + 1.2)) : ""; }).join(""));
    let q = o[0], Q = (x, y, z) => P(x + q.ox, y + q.oy, z), qz = (z) => (xy) => Q(xy[0], xy[1], z);
    put(plate, prism(Q, front, circ(40, 96), circ(38.4, 96), q.z, q.z + 3));
    GEARS.concat([BAL]).forEach(([x, y], k) => place(jewels[k], qz(q.z + 3)(rot([x, y], q.s))));
    GEARS.forEach(([x, y, R, n, w], k) => {
      const a = (live ? w * t : k * 0.4) + q.s, [gx, gy] = rot([x, y], q.s), pts = teeth(gx, gy, R, n, a), wh = wheels[k];
      wh.back.setAttribute("d", poly(pts.map(qz(q.z + 3))));
      wh.face.setAttribute("d", poly(pts.map(qz(q.z + 5))));
      wh.hub.setAttribute("d", [0, 1, 2, 3].map((s) => seg(qz(q.z + 5)([gx + 1.6 * Math.cos(a + s * TAU / 4), gy + 1.6 * Math.sin(a + s * TAU / 4)]),
        qz(q.z + 5)([gx + (R - 3.4) * Math.cos(a + s * TAU / 4), gy + (R - 3.4) * Math.sin(a + s * TAU / 4)]))).join(""));
    });
    const [bx, by] = rot(BAL, q.s), BR = BAL[2], sw = (live ? 1.15 * Math.sin(t * TAU * 1.3) : 0.5) + q.s;
    put(rim, prism(Q, front, shift(circ(BR, 48), bx, by), shift(circ(BR - 1.6, 48), bx, by), q.z + 5, q.z + 7));
    spokes.setAttribute("d", [0, 1, 2].map((s) => seg(qz(q.z + 7)([bx, by]), qz(q.z + 7)([bx + (BR - 1.6) * Math.cos(sw + s * TAU / 3), by + (BR - 1.6) * Math.sin(sw + s * TAU / 3)]))).join(""));
    const coil = [];
    for (let s = 0; s <= 56; s++) { const r = 1.3 + s * 0.09, a = sw * 0.6 + s * 0.42; coil.push([bx + r * Math.cos(a), by + r * Math.sin(a)]); }
    hair.setAttribute("d", open(coil.map(qz(q.z + 7.4))));
    q = o[1];
    put(dial, prism(Q, front, circ(44, 96), circ(42.4, 96), q.z, q.z + 2));
    idx.forEach((el, k) => place(el, qz(q.z + 2)(at(37, (k * TAU) / 12 + q.s))));
    const [sx, sy] = at(21, Math.PI + q.s);
    sub.setAttribute("d", poly(circ(7, 32).map((c) => Q(c.u + sx, c.v + sy, q.z + 2))));
    const d = new Date(), m = d.getMinutes() + d.getSeconds() / 60, h = (d.getHours() % 12) + m / 60, hz = q.z + 2.4;
    hourH.setAttribute("d", hand(Q, hz, (h / 12) * TAU + q.s, 22, 2.6, 4));
    minH.setAttribute("d", hand(Q, hz + 0.5, (m / 60) * TAU + q.s, 34, 1.9, 5));
    const sd = at(1, tval(secTw, now) + q.s);
    secH.setAttribute("d", seg(qz(hz + 1)([-sd[0] * 9, -sd[1] * 9]), qz(hz + 1)([sd[0] * 39, sd[1] * 39])));
    cap.setAttribute("d", poly(circ(2.4, 16).map((c) => Q(c.u, c.v, hz + 1.2))));
    q = o[2];
    glass.setAttribute("d", prism(Q, front, circ(46, 96), null, q.z, q.z + 2.5).sil);
    glassEdge.setAttribute("d", open(ringAt(Q, run(circ(43, 96), front), q.z + 2.5)));
  }

  const B = register(stage, (dt, now) => {
    let moving = stepS(ex, dt) || !tdone(backLift, now);
    const sec = Math.floor(Date.now() / 1000);
    if (sec !== lastSec) { tset(secTw, tval(secTw, now) + (sec - lastSec) * (TAU / 60), now, 0); lastSec = sec; }
    L.forEach((l) => { if (!tdone(l.lift, now)) moving = true; });
    draw(now);
    return moving || !reducedMotion();
  });
  bag.add(B.unregister);

  /** The part under the pointer, tested where each part rests, never where it is drawn: the top one wins. */
  function hit([x, y]) {
    for (let i = LAYERS.length - 1; i >= 0; i--) {
      const p = pose(i, ex.t, 0), w = unproj(C, x, y, p.z + LAYERS[i][2]);
      if (Math.hypot(w[0] - p.ox, w[1] - p.oy) < LAYERS[i][3]) return i;
    }
    let w = unproj(C, x, y, CUP / 2);
    if (Math.hypot(w[0], w[1]) < RO + 6) return -1;
    w = unproj(C, x, y, -DROP * ex.t);
    return Math.hypot(w[0], w[1]) < 44 ? -3 : -2;
  }
  /** Lifts layer a and all above it (-1 the case, -3 the case back, -2 rest). The stagger spreads out from the layer chosen. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : Math.max(act, 0);
    act = a;
    L.forEach((l, i) => {
      tset(l.lift, a >= 0 && i >= a ? LIFT : 0, now, Math.abs(i - from) * 45);
      const on = a === -2 ? i === 0 : i === a;
      l.main.classList.toggle("hi", on);
      if (i !== 2) l.main.classList.toggle("sil", !on); // the glass has no silhouette stroke to give up
    });
    tset(backLift, a === -3 ? LIFT : 0, now, 0);
    caseSil.classList.toggle("hi", a === -1); caseSil.classList.toggle("sil", a !== -1);
    back.sil.classList.toggle("hi", a === -3); back.sil.classList.toggle("sil", a !== -3);
    read.textContent = a === -2 ? "rest" : a === -1 ? "case" : a === -3 ? "back" : LAYERS[a][0];
    B.wake();
  }

  setActive(-2);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-2) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { ex.t = clamp(v, 0, 1); B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "watch",
  means: "A watch taken apart: each part comes off the way it really would, spinning, and the one under the pointer lifts out.",
  rules: [1, 2, 5, 6],
  range: [0, 0.8, 1],
  tour: [[190, 175], [230, 140], [170, 105], null],
  mount,
});
