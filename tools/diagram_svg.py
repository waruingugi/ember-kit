"""A small helper that draws hand-made diagrams (state machines, data models,
"one box with drawers") as SVG on the dot grid, in the house look.

Used by patterns/state-machine.md, patterns/data-model.md and
patterns/deep-dive-drawers.md. Style the output with tools/diagram_svg.css
(put the SVG inside an element with class "dgwrap").

Run the example:  python3 -I tools/diagram_svg.py <out-dir>
It writes <out-dir>/invoice-states.svg and a check page beside it.
"""
from __future__ import annotations

import html
from pathlib import Path

R = 8  # elbow radius

MONO_CH = 0.62  # Diagram Design width budget per mono char (em)
LBL_PX = 9.5


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def label_w(text: str, px: float = LBL_PX) -> int:
    w = len(text) * MONO_CH * px + 12
    return int(-(-w // 2) * 2)


def path_d(pts: list[tuple[float, float]]) -> str:
    """Orthogonal polyline with quarter-curve elbows of radius R."""
    if len(pts) == 2:
        (x1, y1), (x2, y2) = pts
        return f"M{x1:g},{y1:g} L{x2:g},{y2:g}"
    d = [f"M{pts[0][0]:g},{pts[0][1]:g}"]
    for i in range(1, len(pts) - 1):
        (ax, ay), (bx, by), (cx, cy) = pts[i - 1], pts[i], pts[i + 1]
        def unit(dx, dy):
            return ((dx > 0) - (dx < 0), (dy > 0) - (dy < 0))
        ux, uy = unit(bx - ax, by - ay)
        vx, vy = unit(cx - bx, cy - by)
        d.append(f"L{bx - ux * R:g},{by - uy * R:g}")
        d.append(f"Q{bx:g},{by:g} {bx + vx * R:g},{by + vy * R:g}")
    d.append(f"L{pts[-1][0]:g},{pts[-1][1]:g}")
    return " ".join(d)


class Diagram:
    def __init__(self, slug: str, w: int, h: int, title: str, desc: str):
        self.slug, self.w, self.h, self.title, self.desc = slug, w, h, title, desc
        self.zones: list[str] = []
        self.arrows: list[str] = []
        self.labels: list[str] = []
        self.nodes: list[str] = []
        self.extra: list[str] = []  # drawn last (notes)

    # ---- primitives -------------------------------------------------
    def zone(self, x, y, w, h, text=None, cls=""):
        s = f'<rect class="dg-z {cls}" x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#e9ecec" stroke="#8e969a" stroke-width="1" stroke-dasharray="4 4"/>'
        if text:
            tw = label_w(text, 9.5)
            s += f'<rect class="dg-zm" x="{x + 12}" y="{y - 6}" width="{tw}" height="12" rx="2" fill="#f1f3f2"/>'
            s += f'<text class="dg-zl" x="{x + 18}" y="{y + 3}">{esc(text.upper())}</text>'
        self.zones.append(s)

    def node(self, x, y, w, h, name, sub=None, cls="", tag=None, anchor="middle", reveal=True):
        cx = x + w / 2
        tx = cx if anchor == "middle" else x + 16
        g = [f'<g class="dg-n {cls}"{" data-dg" if reveal else ""}>']
        g.append(f'<rect class="dg-nm" x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="#f1f3f2"/>')
        g.append(f'<rect class="dg-nb" x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="#f8faf9" stroke="#15181b" stroke-width="1"/>')
        if tag:
            tw = max(28, int(len(tag) * 6.1 + 12))
            g.append(f'<rect class="dg-tg" x="{x + w - tw - 8}" y="{y + 7}" width="{tw}" height="12" rx="2" fill="none" stroke="#8e969a" stroke-width="0.8"/>')
            g.append(f'<text class="dg-tt" x="{x + w - tw / 2 - 8}" y="{y + 16}" text-anchor="middle">{esc(tag.upper())}</text>')
        if sub:
            g.append(f'<text class="dg-name" x="{tx}" y="{y + h / 2 - 2}" text-anchor="{anchor}">{esc(name)}</text>')
            g.append(f'<text class="dg-sub" x="{tx}" y="{y + h / 2 + 13}" text-anchor="{anchor}">{esc(sub)}</text>')
        else:
            g.append(f'<text class="dg-name" x="{tx}" y="{y + h / 2 + 5}" text-anchor="{anchor}">{esc(name)}</text>')
        g.append("</g>")
        self.nodes.append("".join(g))

    def chip(self, x, y, w, h, text, cls=""):
        self.nodes.append(
            f'<g class="dg-chip {cls}" data-dg><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="5" fill="#f8faf9"/>'
            f'<text x="{x + w / 2}" y="{y + h / 2 + 4}" text-anchor="middle">{esc(text)}</text></g>'
        )

    def arrow(self, pts, cls="", lbl=None, at=None, side="above", head=True):
        mk = f' marker-end="url(#{self.slug}-{"ah" if "h" in cls.split() else "a"})"' if head else ""
        pl = '' if 'd' in cls.split() else ' pathLength="1"'
        self.arrows.append(f'<path class="dg-c {cls}" d="{path_d(pts)}"{pl} fill="none" stroke="#5b6368" stroke-width="1.2"{mk}/>')
        if lbl:
            self.label(lbl, *at, side=side)

    def label(self, text, x, y, side="above"):
        """x,y = point on the connector the label belongs to."""
        text = text.upper()
        w = label_w(text)
        if side == "above":
            rx, ry = x - w / 2, y - 7 - 12
        elif side == "below":
            rx, ry = x - w / 2, y + 7
        elif side == "right":
            rx, ry = x + 7, y - 6
        else:  # left
            rx, ry = x - 7 - w, y - 6
        self.labels.append(
            f'<g class="dg-l" data-dgl><rect x="{rx:g}" y="{ry:g}" width="{w}" height="12" rx="2" fill="#f1f3f2"/>'
            f'<text x="{rx + w / 2:g}" y="{ry + 9:g}" text-anchor="middle">{esc(text)}</text></g>'
        )

    def note(self, x, y, text, anchor="start"):
        self.extra.append(f'<text class="dg-note" x="{x}" y="{y}" text-anchor="{anchor}">{esc(text)}</text>')

    def raw(self, s, layer="extra"):
        getattr(self, layer).append(s)

    # ---- output -----------------------------------------------------
    def svg(self) -> str:
        s, W, H = self.slug, self.w, self.h
        head = (
            f'<svg class="dg" id="dg-{s}" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" '
            f'aria-labelledby="{s}-title {s}-desc" style="min-width:{int(W * 0.8)}px">'
            f'<title id="{s}-title">{esc(self.title)}</title><desc id="{s}-desc">{esc(self.desc)}</desc>'
            f'<defs><pattern id="{s}-dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle class="dg-dot" cx="9" cy="9" r="1" fill="#c3c7c6"/></pattern>'
            f'<marker id="{s}-a" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon class="dg-mk" points="0 0, 8 3, 0 6" fill="#5b6368"/></marker>'
            f'<marker id="{s}-ah" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon class="dg-mk h" points="0 0, 8 3, 0 6" fill="#e14a0e"/></marker></defs>'
            f'<rect class="dg-bg" width="100%" height="100%" fill="#f1f3f2"/><rect width="100%" height="100%" fill="url(#{s}-dots)"/>'
        )
        body = "".join(self.zones + self.arrows + self.labels + self.nodes + self.extra)
        return head + body + "</svg>"




# ---- example: one invoice's states ------------------------------------
def invoice_states() -> Diagram:
    d = Diagram("invoice-states", 760, 300, "Invoice states",
                "Every invoice is in exactly one state; arrows show the only moves allowed.")
    W, H = 136, 48
    d.raw('<circle class="dg-start" cx="36" cy="92" r="7" fill="#15181b"/>', "nodes")
    d.arrow([(44, 92), (72, 92)], "h")
    d.arrow([(208, 92), (316, 92)], "h", "send", (262, 92))
    d.arrow([(452, 92), (560, 92)], "h", "paid in full", (506, 92))
    d.arrow([(384, 116), (384, 200)], "d", "cancel", (384, 158), "right")
    d.arrow([(140, 116), (140, 224), (316, 224)], "d")
    d.node(72, 68, W, H, "draft")
    d.node(316, 68, W, H, "sent")
    d.node(560, 68, W, H, "paid", None, "f", "end")
    d.node(316, 200, W, H, "void", None, "e", "end")
    d.note(560, 250, "Orange marks the one path most invoices take.")
    return d


CHECK_CSS = """body{margin:0;background:#eff2f1;font-family:system-ui}
.dg-name{font:600 13px system-ui;fill:#15181b}.dg-sub,.dg-fld,.dg-ty{font:10px ui-monospace,monospace;fill:#5b6368}
.dg-l text,.dg-zl,.dg-tt,.dg-chip text{font:500 8.5px ui-monospace,monospace;fill:#5b6368}"""


def main() -> None:
    import sys
    out = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    out.mkdir(parents=True, exist_ok=True)
    dg = invoice_states()
    svg = dg.svg()
    (out / f"{dg.slug}.svg").write_text(svg)
    (out / f"{dg.slug}.html").write_text(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(dg.title)}</title>'
        f'<style>{CHECK_CSS}</style></head><body><main><h1>{esc(dg.title)}</h1>{svg}</main></body></html>')
    print("wrote", out / f"{dg.slug}.svg")


if __name__ == "__main__":
    main()
