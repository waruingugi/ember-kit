"""Build an exploded layer stack (3 to 5 slabs) with Diagram Design's own builder, in the house skins.

Run: python3 -I build_layers.py ~/tools/diagram-design/scripts <out-dir>
Change only parts() and the title. See patterns/exploded-layers.md."""
import importlib.util, sys, json
repo_scripts = sys.argv[1]; out_dir = sys.argv[2]
sys.path.insert(0, repo_scripts)
spec = importlib.util.spec_from_file_location("bx", f"{repo_scripts}/build-exploded-examples.py")
bx = importlib.util.module_from_spec(spec); sys.modules["bx"] = bx; spec.loader.exec_module(bx)
ax = sys.modules["axonometry"]

def skin(_src, **kw):
    d = dict(ax.SKINS[_src]); d.update(kw); return d

ax.SKINS["ember-light"] = skin("light",
    paper="#f8faf9", ink="#15181b", muted="#5b6368", soft="#8e969a", accent="#e14a0e",
    ink_rgb="21,24,27", acc_rgb="225,74,14", base="#ffffff", rule="rgba(21,24,27,0.12)",
    shade=(None, "rgba(21,24,27,0.06)", "rgba(21,24,27,0.14)"),
    focal=("rgba(225,74,14,0.10)", "rgba(225,74,14,0.20)", "rgba(225,74,14,0.32)"),
    cavity="rgba(21,24,27,0.10)", floor="rgba(21,24,27,0.04)", well="rgba(21,24,27,0.14)",
    screen="#15181b", chip_top="#5b6368", chip_side="#15181b", sil="#15181b",
    inner="rgba(21,24,27,0.55)", trace="rgba(21,24,27,0.30)", lead="rgba(21,24,27,0.40)",
    lead_acc="rgba(225,74,14,0.60)", inner_acc="rgba(225,74,14,0.70)", lens="#15181b")
ax.SKINS["ember-dark"] = skin("dark",
    paper="#14181c", ink="#ebeff1", muted="#8f999f", soft="#5f686e", accent="#ff6a2b",
    ink_rgb="235,239,241", acc_rgb="255,106,43", base="#1c2126", rule="rgba(235,239,241,0.12)",
    shade=("rgba(235,239,241,0.06)", None, "rgba(0,0,0,0.40)"),
    focal=("rgba(255,106,43,0.18)", None, "rgba(0,0,0,0.40)"),
    cavity="rgba(0,0,0,0.45)", floor="rgba(0,0,0,0.25)", well="rgba(0,0,0,0.35)",
    screen="#07090b", island="#14181c", chip_top="#5f686e", chip_side="#07090b", sil="#ebeff1",
    inner="rgba(235,239,241,0.45)", trace="rgba(235,239,241,0.28)", lead="rgba(235,239,241,0.40)",
    lead_acc="rgba(255,106,43,0.60)", inner_acc="rgba(255,106,43,0.70)", lens="#07090b")

A = bx.AI; slab = bx.Rect(0, 0, A, A, 10)
def parts():
    return [bx.Part("data", "Data stores", "postgres, object store", bx.Rect(16, 16, A - 16, A - 16, 8), t=24, kind="vault", closed_z=0),
            bx.Part("log", "Shared log", "event log, 48h", slab, t=12, kind="skills", closed_z=24),
            bx.Part("services", "Services", "api, workers, search", slab, t=14, kind="tools", closed_z=36),
            bx.Part("apps", "Apps", "web app, phone app", slab, t=10, kind="interface", closed_z=50)]

res = {}
for skin_name in ("ember-light", "ember-dark"):
    fig = bx.Figure(slug=f"ember-layers-{skin_name}", title="App layers",
        desc="Exploded view: data stores at the base, the shared log, the services that read it, and the apps on top, with the shared log as the focal layer.",
        parts=parts(), focus="log", gap_k=0.75)
    body, vh, steps = bx.build_svg(fig, skin_name, True, fig.slug)
    res[skin_name] = dict(body=body, vh=vh, steps=steps)
    # standalone file for verification (static, exploded frame)
    fig2 = bx.Figure(slug=fig.slug, title=fig.title, desc=fig.desc, parts=parts(), focus="log", gap_k=0.75)
    b2, vh2, _ = bx.build_svg(fig2, skin_name, False, fig.slug)
    sk = ax.SKINS[skin_name]
    html = bx.MINIMAL.format(eyebrow="Exploded axonometric", title=fig.title, font=bx.FONT_LINK, slug=fig.slug,
                             desc=fig.desc, vh=vh2, body=b2, **{k: sk[k] for k in ("paper", "ink", "muted", "accent")})
    open(f"{out_dir}/{fig.slug}.html", "w").write(html)
json.dump(res, open(f"{out_dir}/ember-layers.json", "w"))
print({k: (v["vh"], v["steps"]) for k, v in res.items()})
