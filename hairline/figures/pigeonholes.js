/**
 * Pigeonholes: a mail rack of twelve slots on a plinth, one envelope in each.
 * The slot under the pointer slides its envelope out to you; the others ease
 * back in, staggered outwards from it on the 700ms lift curve. At rest the
 * envelopes sit at uneven depths, and the one furthest out is lit.
 * A slot is a route, an envelope a request: picking one is answering it.
 * The slider is the stagger, in ms.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, ringAt, rings, rrect, seg,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const COLS = 4, ROWS = 3, HW = 26, HH = 20, GAP = 6, M = 7, D = 40, T = 1.2;
const W = M * 2 + COLS * HW + (COLS - 1) * GAP, Z = M * 2 + ROWS * HH + (ROWS - 1) * GAP;
const REST = [3, 0, 7, 1, 0, 5, 2, 0, 9, 1, 0, 3], OUT = 22, TUCK = 0.35;

/** Hole k (row 0 at the bottom): its box on the front face, in x and z. */
function hole(k) {
  const r = Math.floor(k / COLS), c = k % COLS;
  const xa = M + c * (HW + GAP), za = M + r * (HH + GAP);
  return { r, c, xa, xb: xa + HW, za, zb: za + HH };
}

/** A rounded rectangle lying on the front face (y = D), as screen points. */
const onFace = (P, u0, v0, u1, v1, rad) => rrect(u0, v0, u1, v1, rad, 4).map((q) => P(q.u, D, q.v));

/** Envelope k pulled out by e: its solid, and the flap's V on its top face. */
function envelope(P, front, h, e) {
  const x0 = h.xa + 3, x1 = h.xb - 6, y0 = D - 7, y1 = D + e, z0 = h.za + 0.8, z1 = z0 + T;
  const [ring, inner] = rings(x0, y0, x1, y1, 1.2, 0.6);
  const xm = (x0 + x1) / 2, deep = Math.min(8, (y1 - y0) * 0.45);
  const flap = seg(P(x0 + 1, y1 - 1, z1), P(xm, y1 - 1 - deep, z1)) + seg(P(xm, y1 - 1 - deep, z1), P(x1 - 1, y1 - 1, z1));
  return { paths: prism(P, front, ring, inner, z0, z1), flap };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;

  // Fitted with the top row's envelopes all the way out, so no pose leaves the frame.
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-3, -3, -5], [W + 3, D + 3, -5], [0, 0, Z], [W, D, Z], [W, D + OUT, Z - M], [M, D + OUT, Z - M]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the plinth, then the rack's body
  const [pr, pi] = rings(-3, -3, W + 3, D + 3, 3, 1.2);
  put(solid(g), prism(P, front, pr, pi, -5, 0));
  const [br, bi] = rings(0, 0, W, D, 3.5, 1.4);
  const body = solid(g);
  put(body, prism(P, front, br, bi, 0, Z));
  body.sil.classList.add("sil");

  // the openings and their label holders, all on the front face
  const holes = [];
  for (let k = 0; k < COLS * ROWS; k++) {
    const h = hole(k), xm = (h.xa + h.xb) / 2;
    mk("path", { d: poly(onFace(P, h.xa, h.za, h.xb, h.zb, 2.5)), class: "nf" }, g);
    mk("path", { d: poly(onFace(P, h.xa + 1.6, h.za + 1.6, h.xb - 1.6, h.zb - 1.6, 1.4)), class: "nf lo" }, g);
    mk("path", { d: poly(onFace(P, xm - 6, h.za - 4.4, xm + 6, h.za - 2.2, 1)), class: "nf lo" }, g);
    holes.push(h);
  }

  // envelopes, painted bottom row first and left to right, so a nearer one covers a farther one
  const envs = holes.map((h, k) => {
    const s = solid(g), flap = mk("path", { class: "nf lo" }, s.g);
    return { h, s, flap, e: tween(REST[k]), last: NaN };
  });
  const restMark = REST.indexOf(Math.max(...REST));

  function draw(k, e) {
    const en = envs[k];
    if (e === en.last) return;
    en.last = e;
    const q = envelope(P, front, en.h, e);
    put(en.s, q.paths);
    en.flap.setAttribute("d", q.flap);
  }

  // hit test: the resting centre of each opening on screen. Openings never move.
  const centres = holes.map((h) => P((h.xa + h.xb) / 2, D, (h.za + h.zb) / 2));
  const reach = Math.max(HW, HH) * C.S * 0.75;
  function hit([x, y]) {
    let best = -1, bd = reach;
    centres.forEach((c, k) => { const d = Math.hypot(c[0] - x, c[1] - y); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    envs.forEach((en, k) => { draw(k, Math.round(tval(en.e, now) * 100) / 100); if (!tdone(en.e, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  let act = -2;
  /** Opens slot a (-1 puts every envelope back where it rests). The stagger spreads out from the slot chosen, or the one let go. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : Math.max(act, 0);
    act = a;
    envs.forEach((en, k) => {
      const dist = Math.max(Math.abs(en.h.r - holes[from].r), Math.abs(en.h.c - holes[from].c));
      tset(en.e, a < 0 ? REST[k] : k === a ? OUT : REST[k] * TUCK, now, dist * stag);
      en.s.sil.classList.toggle("hi", a < 0 ? k === restMark : k === a);
      en.s.sil.classList.toggle("sil", !(a < 0 ? k === restMark : k === a));
    });
    read.textContent = a < 0 ? "rest" : "route " + (holes[a].r + 1) + "·" + (holes[a].c + 1);
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
  name: "pigeonholes",
  means: "A mail rack of twelve slots: the one under the pointer slides its envelope out, and the rest ease back in.",
  rules: [1, 2, 5, 9],
  range: [0, 45, 90],
  tour: [[146, 98], [230, 182], [274, 250], null],
  mount,
});
