/**
 * Movement: the watch's movement taken apart. On the main plate stand the
 * barrel, four wheels, the pallet fork and the balance, with the bridge on
 * top. As the explode grows each part leaves in its own direction: the barrel
 * to the left, the wheels up and to the right, the fork towards you, the
 * balance up and left, the bridge up and back. Each spins as it goes and
 * settles square when fully open. While it is on
 * screen the escapement runs: the balance swings, the pallet fork flips each
 * time it passes the middle, and the escape wheel steps one half tooth per
 * beat, driving the wheels below it. The part under the pointer lifts with
 * every part above it and takes the bright stroke. At rest the bright one is
 * the escape wheel. The slider is the explode.
 */
const {
  Cam, circ, clamp, fillet, fit, facing, open, poly, prism, proj, ringAt, rings, seg, unproj,
  spring, stepS, tween, tset, tval, tdone, reducedMotion, disposer, mk, place, pointer, put, register, solid,
} = HL;

const TAU = Math.PI * 2, LIFT = 9, SPIN = 1.4, BEAT = 2.4, STEP = TAU / 30;
const rot = ([x, y], s) => [x * Math.cos(s) - y * Math.sin(s), x * Math.sin(s) + y * Math.cos(s)];
/** The parts, bottom to top: name, arbor x, y, wheel radius, teeth, pinion radius, turn ratio to the escape wheel, level. */
const PARTS = [
  ["barrel", -14, -9.5, 13, 30, 0, 1 / 90, 1],
  ["center", 0, 0, 11, 24, 2.8, -1 / 36, 2],
  ["third", 12, -10, 8, 18, 2.4, 1 / 14, 3],
  ["fourth", 23, -2, 7, 16, 2.2, -1 / 5, 4],
  ["escape", 26, 9, 6, 15, 1.8, 1, 5],
];
const PALLET = [20, 16, 6], BAL = [11, 24, 10, 7], BRIDGE = [-4, -15, 30, 6, 8.2], NAMES = ["plate", ...PARTS.map((p) => p[0]), "pallet", "balance", "bridge"];
const RAD = [40, 13, 11, 8, 7, 6, 7, 10];
/** Where each part goes when fully open, as [x, y, up], plate first: each the way it would really come out. */
const OUT = [[0, 0, 0], [-16, 16, 22], [0, 0, 40], [10, -10, 52], [20, -20, 60], [18, 6, 74], [12, 12, 88], [-14, 12, 102], [-6, -12, 122]];

/** A toothed outline, turned by a. `club` gives the escape wheel's leaning teeth. */
function teeth(cx, cy, R, n, a, club) {
  const pts = [], prof = club ? [[0, R - 2.2], [0.05, R], [0.22, R - 0.6], [0.62, R - 2.2]] : [[0, R - 1.6], [0.14, R], [0.42, R], [0.56, R - 1.6]];
  for (let k = 0; k < n; k++) for (const [f, r] of prof) {
    const t = a + ((k + f) / n) * TAU;
    pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
  }
  return pts;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.8);
  // Fitted to the most open pose: every part at its far end, lifted by the pointer.
  const AT = [[0, 0], ...PARTS.map((q) => [q[1], q[2]]), [PALLET[0], PALLET[1]], [BAL[0], BAL[1]], [13, -4.5]];
  const far = AT.flatMap(([x, y], i) => [[-1, -1], [1, 1], [1, -1], [-1, 1]].map(([u, v]) => [x + OUT[i][0] + u * (i === 8 ? 18 : RAD[i] || 40), y + OUT[i][1] + v * (i === 8 ? 11 : RAD[i] || 40), OUT[i][2] + (i ? LIFT + 10 : -4)]));
  fit(C, far, 200, 162);
  const P = proj(C), front = facing(C);
  const pz = (z) => (xy) => P(xy[0], xy[1], z);
  const ring = (R, x, y, n = 64) => circ(R, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

  const g = mk("g", {}, svg);
  // The plate, with a jewel at every arbor and three screws round its rim.
  const pg = mk("g", {}, g), plate = solid(pg);
  put(plate, prism(P, front, circ(40, 96), circ(38.4, 96), -4, 0));
  const AXES = [...PARTS.map((p) => [p[1], p[2]]), [PALLET[0], PALLET[1]], [BAL[0], BAL[1]]];
  for (const xy of AXES) mk("circle", { r: 1.3, class: "dot m", cx: pz(0)(xy)[0], cy: pz(0)(xy)[1] }, pg);
  for (const a of [0.6, 2.7, 4.6]) { const c = pz(0)([34 * Math.cos(a), 34 * Math.sin(a)]); mk("circle", { r: 1.5, class: "dot off", cx: c[0], cy: c[1] }, pg); }

  // Every part, painted from its level up.
  const items = [{ main: plate.sil, lift: tween(0), lvl: 0, k: 0 }];
  const W = PARTS.map(([, x, y, R, n, pr, , lvl]) => {
    const it = { lvl, k: lvl, lift: tween(0) }, gg = mk("g", {}, g);
    it.pin = pr ? { back: mk("path", { class: "lo" }, gg), face: mk("path", {}, gg) } : null;
    it.drum = lvl === 1 ? solid(gg) : null;
    it.back = mk("path", { class: "lo" }, gg); it.face = mk("path", { class: "sil" }, gg);
    it.hub = mk("path", { class: "nf lo" }, gg); it.main = it.drum ? it.drum.sil : it.face;
    items.push(it);
    return it;
  });
  const fork = { lvl: 6, k: 6, lift: tween(0) }, fg = mk("g", {}, g);
  fork.back = mk("path", { class: "lo" }, fg); fork.face = mk("path", { class: "sil" }, fg); fork.main = fork.face;
  const bal = { lvl: 7, k: 7, lift: tween(0) }, bg = mk("g", {}, g);
  bal.rim = solid(bg); bal.spokes = mk("path", { class: "nf lo" }, bg); bal.hair = mk("path", { class: "nf lo" }, bg); bal.main = bal.rim.sil;
  const br = { lvl: 9, k: 8, lift: tween(0) }, brg = mk("g", {}, g);
  br.solid = solid(brg); br.main = br.solid.sil;
  const brJ = [0, 1, 2].map(() => mk("circle", { r: 1.2, class: "dot m" }, brg)), brS = [0, 1].map(() => mk("circle", { r: 1.6, class: "dot off" }, brg));
  const [brR, brI] = rings(...BRIDGE.slice(0, 4), BRIDGE[4], 1.6);
  items.push(fork, bal, br);

  const ex = spring(value, { eps: 0.002 });
  let act = -2;
  /** Where part `it` is at explode e: its offset, its height, and a projection that carries the offset. */
  const pos = (it, e, lift) => { const [dx, dy, dz] = OUT[it.k], ox = dx * e, oy = dy * e, z = dz * e + lift;
    return { ox, oy, z, at: (h) => (xy) => P(xy[0] + ox, xy[1] + oy, h), Q: (x, y, h) => P(x + ox, y + oy, h) }; };
  const spinOf = (it, e) => SPIN * (1 + it.lvl * 0.35) * 4 * e * (1 - e);

  function draw(now) {
    const e = ex.x, t = now / 1000, live = !reducedMotion();
    const ph = live ? t * BEAT : 0.3, k = Math.floor(ph), f = ph - k;
    const esc = -(k + clamp(f / 0.16, 0, 1)) * STEP;          // one half tooth per beat, snapped
    const swing = 1.2 * Math.sin(Math.PI * ph), flip = 0.2 * clamp(Math.sin(Math.PI * ph) * 6, -1, 1);
    const drive = -(ph * STEP);                                 // the escape wheel's average turn, for the wheels it drives
    PARTS.forEach(([, x, y, R, n, pr, ratio], j) => {
      const it = W[j], o = pos(it, e, tval(it.lift, now)), z = o.z, pz = o.at, s = spinOf(it, e), a = (j === 4 ? esc : drive * ratio) + s;
      if (it.pin) {
        const pp = teeth(x, y, pr, 8, a);
        it.pin.back.setAttribute("d", poly(pp.map(pz(z)))); it.pin.face.setAttribute("d", poly(pp.map(pz(z + 2))));
      }
      const zw = z + (it.pin ? 2 : 0);
      if (it.drum) put(it.drum, prism(o.Q, front, ring(R - 1.2, x, y), ring(R - 2.6, x, y), zw, zw + 4));
      const pts = teeth(x, y, R, n, a, j === 4), zt = zw + (it.drum ? 4 : 0);
      it.back.setAttribute("d", poly(pts.map(pz(zt)))); it.face.setAttribute("d", poly(pts.map(pz(zt + 1.4))));
      const spokes = [0, 1, 2, 3].map((q) => seg(pz(zt + 1.4)([x + 1.5 * Math.cos(a + q * TAU / 4), y + 1.5 * Math.sin(a + q * TAU / 4)]),
        pz(zt + 1.4)([x + (R - 3.2) * Math.cos(a + q * TAU / 4), y + (R - 3.2) * Math.sin(a + q * TAU / 4)]))).join("");
      const coil = [];
      if (it.drum) for (let q = 0; q <= 70; q++) { const r = 2 + q * 0.12, b = a * 3 + q * 0.42; coil.push([x + r * Math.cos(b), y + r * Math.sin(b)]); }
      it.hub.setAttribute("d", it.drum ? open(coil.map(pz(zt + 1.4))) : spokes);
    });
    // The pallet fork: a lever on its arbor, two pallets reaching for the escape wheel, flipping on each beat.
    const fo = pos(fork, e, tval(fork.lift, now)), [fx, fy, FL] = PALLET, fz = fo.z, fa = Math.atan2(PARTS[4][2] - fy, PARTS[4][1] - fx) + flip + spinOf(fork, e);
    const shape = fillet([[-FL, -1.2], [FL * 0.5, -1.2], [FL * 0.75, -4], [FL, -3.4], [FL * 0.62, 0], [FL, 3.4], [FL * 0.75, 4], [FL * 0.5, 1.2], [-FL, 1.2]], [1, 0.6, 0.8, 0.6, 0.6, 0.6, 0.8, 0.6, 1]);
    const fp = shape.map((p) => { const [u, v] = rot(p, fa); return [fx + u, fy + v]; });
    fork.back.setAttribute("d", poly(fp.map(fo.at(fz)))); fork.face.setAttribute("d", poly(fp.map(fo.at(fz + 1.2))));
    // The balance: rim, three spokes and the hairspring, breathing as it swings.
    const bo = pos(bal, e, tval(bal.lift, now)), [bx, by, BR] = BAL, bz = bo.z + BAL[3], ba = swing + spinOf(bal, e), bp = bo.at;
    put(bal.rim, prism(bo.Q, front, ring(BR, bx, by), ring(BR - 1.6, bx, by), bz, bz + 2));
    bal.spokes.setAttribute("d", [0, 1, 2].map((q) => seg(bp(bz + 2)([bx, by]), bp(bz + 2)([bx + (BR - 1.6) * Math.cos(ba + q * TAU / 3), by + (BR - 1.6) * Math.sin(ba + q * TAU / 3)]))).join(""));
    const hs = [];
    for (let q = 0; q <= 60; q++) { const r = 1.2 + q * (0.085 + swing * 0.004), b = ba * 0.7 + q * 0.42; hs.push([bx + r * Math.cos(b), by + r * Math.sin(b)]); }
    bal.hair.setAttribute("d", open(hs.map(bp(bz + 2.4))));
    // The bridge holds the top pivots of the centre, third and fourth wheels.
    const ro = pos(br, e, tval(br.lift, now)), bz2 = ro.z + 6, bs = spinOf(br, e) * 0.25, mid = [13, -4.5];
    const turn = (xy) => { const [u, v] = rot([xy[0] - mid[0], xy[1] - mid[1]], bs); return [mid[0] + u, mid[1] + v]; };
    put(br.solid, prism(ro.Q, front, brR.map((q) => { const [u, v] = turn([q.u, q.v]); return { ...q, u, v }; }), brI.map((q) => { const [u, v] = turn([q.u, q.v]); return { ...q, u, v }; }), bz2, bz2 + 2.4));
    [1, 2, 3].forEach((j, q) => place(brJ[q], ro.at(bz2 + 2.4)(turn([PARTS[j][1], PARTS[j][2]]))));
    [[-1, -12], [27, 3]].forEach((xy, q) => place(brS[q], ro.at(bz2 + 2.4)(turn(xy))));
  }

  const B = register(stage, (dt, now) => {
    let moving = stepS(ex, dt);
    items.forEach((it) => { if (!tdone(it.lift, now)) moving = true; });
    draw(now);
    return moving || !reducedMotion();
  });
  bag.add(B.unregister);

  /** The part under the pointer, tested where each part rests, never where it is drawn: the highest one wins. */
  function hit([sx, sy]) {
    const order = items.map((it, i) => i).sort((a, b) => items[b].lvl - items[a].lvl);
    for (const i of order) {
      const it = items[i], xy = i === 0 ? [0, 0] : i <= 5 ? [PARTS[i - 1][1], PARTS[i - 1][2]] : i === 6 ? PALLET : i === 7 ? BAL : [13, -4.5];
      const o = pos(it, ex.t, 0), w0 = unproj(C, sx, sy, o.z + (i === 8 ? 8 : 3)), w = [w0[0] - o.ox, w0[1] - o.oy];
      if (i === 8 ? Math.abs(w[0] - 13) < 18 && Math.abs(w[1] + 4.5) < 11 : Math.hypot(w[0] - xy[0], w[1] - xy[1]) < RAD[i] + 2) return i;
    }
    return -1;
  }
  /** Lifts part a and every part above it (-1 is rest). The stagger spreads out by level from the part chosen. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? items[a].lvl : 0;
    act = a;
    items.forEach((it, i) => {
      tset(it.lift, a >= 0 && it.lvl >= items[a].lvl && i !== 0 ? LIFT : 0, now, Math.abs(it.lvl - from) * 40);
      const on = a < 0 ? i === 5 : i === a;
      it.main.classList.toggle("hi", on); it.main.classList.toggle("sil", !on);
    });
    read.textContent = a < 0 ? "rest" : NAMES[a];
    B.wake();
  }

  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { ex.t = clamp(v, 0, 1); B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "movement",
  means: "A watch movement taken apart: each part leaves its own way, spinning, while the escapement keeps the beat.",
  rules: [1, 2, 6, 8],
  range: [0, 0.8, 1],
  tour: [[162, 210], [234, 194], [158, 146], null],
  mount,
});
