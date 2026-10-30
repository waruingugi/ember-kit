/**
 * Tracker: two vehicle decks side by side, a low bike deck and a taller van
 * bed, each with a mounting pad. One tracker puck, with a short antenna, sits
 * on a pad. The deck under the pointer calls the tracker over: it lifts, arcs
 * across the gap on the 700ms lift curve and lands on that deck's pad. A row
 * of dots in front of each deck is its installation record: the open one is
 * lit, the closed one dims but stays. The slider is how high the puck arcs.
 *
 * The idea: a device moves between vehicles, so the binding is a history,
 * not a column on the vehicle.
 */
const {
  Cam, clamp, facing, fit, lerp, prism, proj, rings, unproj,
  tdone, tset, tval, tween, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const DECKS = [
  { x0: 0, x1: 72, top: 10, pad: 36, name: "bike" },
  { x0: 92, x1: 176, top: 20, pad: 134, name: "van" },
];
const Y0 = 0, Y1 = 46, YC = 23, PAD_H = 3, PW = 8, PD = 6, PH = 7, DOTS = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let arc = value;

  const C = Cam(45, 0.5, 1.55);
  fit(C, [[-4, -4, 0], [180, 60, 0], [-4, 60, 0], [180, -4, 0], [134, YC, 20 + PAD_H + PH + 40], [36, YC, 10 + PAD_H + PH + 40]], 200, 170);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // the installation record: a row of dots on the ground in front of each deck
  const rec = DECKS.map((d) => {
    const row = [];
    for (let k = 0; k < DOTS; k++) {
      const el = flatDot(g, C, 1.6, "dot off");
      place(el, P(lerp(d.x0 + 8, d.x1 - 8, k / (DOTS - 1)), Y1 + 10, 0));
      row.push(el);
    }
    return row;
  });
  // the decks and their pads, far to near; they never move
  DECKS.forEach((d) => {
    const [r, ri] = rings(d.x0, Y0, d.x1, Y1, 6, 1.8);
    put(solid(g), prism(P, front, r, ri, 0, d.top));
    const [pr, pi] = rings(d.pad - 12, YC - 9, d.pad + 12, YC + 9, 3, 1);
    put(solid(g), prism(P, front, pr, pi, d.top, d.top + PAD_H));
  });
  // the tracker puck and its antenna, redrawn as it travels
  const puck = solid(g), ant = solid(g);
  puck.sil.classList.add("hi");

  const t = tween(0);
  let last = -1;
  function draw(v) {
    if (v === last) return;
    last = v;
    const x = lerp(DECKS[0].pad, DECKS[1].pad, v);
    const z = lerp(DECKS[0].top, DECKS[1].top, v) + PAD_H + arc * 4 * v * (1 - v);
    const [r, ri] = rings(x - PW, YC - PD, x + PW, YC + PD, 3, 1.1);
    put(puck, prism(P, front, r, ri, z, z + PH));
    const [ar, ai] = rings(x + PW - 4.5, YC - 4.5, x + PW - 2, YC - 2, 1, 0.4);
    put(ant, prism(P, front, ar, ai, z + PH, z + PH + 7));
  }

  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  /** The deck under the point, tested on each deck's own resting top, nearest first; -1 off both. */
  function hit([sx, sy]) {
    for (let i = DECKS.length - 1; i >= 0; i--) {
      const d = DECKS[i], [wx, wy] = unproj(C, sx, sy, d.top + PAD_H);
      if (wx >= d.x0 - 6 && wx <= d.x1 + 6 && wy >= Y0 - 8 && wy <= Y1 + 14) return i;
    }
    return -1;
  }

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const on = a < 0 ? 0 : a;
    tset(t, on, performance.now(), 0);
    rec.forEach((row, i) => row.forEach((el) => el.setAttribute("class", "dot " + (i === on ? "m" : "off"))));
    read.textContent = a < 0 ? "rest" : DECKS[a].name;
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { arc = clamp(v, 0, 40); last = -1; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "tracker",
  means: "One tracker, two vehicles: the deck under the pointer calls it over, and each deck keeps its own record of having held it.",
  rules: [1, 4, 5, 8],
  range: [6, 18, 32],
  tour: [[290, 150], [130, 190], [300, 160], null],
  mount,
});
