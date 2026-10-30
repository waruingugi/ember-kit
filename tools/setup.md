# Setting up a new machine

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

Everything the design system needs, in order. Pin every version. Never use
`@latest`.

## 1. Get this folder

```bash
git clone https://github.com/waruingugi/ember-kit ~/.claude/design
```

It must live at `~/.claude/design`: every file points there.

## 2. Runtimes

Node 18 or newer (22.15 works). Python 3.10 or newer (on a Mac, Homebrew's
`/opt/homebrew/bin/python3`; macOS's own `/usr/bin/python3` is 3.9, too
old). git.

## 3. The rule, the profile and our two skills

```bash
D=~/.claude/design/claude
mkdir -p ~/.claude/skills ~/.claude/rules ~/.diagram-design/profiles
cp $D/rules/design.md                 ~/.claude/rules/design.md
cp $D/diagram-design/ember.md         ~/.diagram-design/profiles/ember.md
cp -R $D/skills/craft                 ~/.claude/skills/
cp -R $D/skills/motion-ecosystem      ~/.claude/skills/
```

The rule makes Claude Code read `DESIGN.md` before any design work. It
calls you "the owner", so there is nothing to rename.

## 4. Skills from other people

Copy only the folders named, from the commits named. Read each one before
you install it, and never run its install scripts.

```bash
K=~/.claude/skills
c() { git clone https://github.com/$1 ~/tools/$2 && git -C ~/tools/$2 checkout $3; }
c lucasmarkes/hairline            hairline            37d2e78dcb333ab30c3338e28ed4a690364ea014
c wheresryan22/anatomy            anatomy             1482e8469b0a9e0d8cc18ea2740a01423d29ae80
c ibelick/ui-skills               ui-skills           d036a68
c greensock/gsap-skills           gsap-skills         aed9cfd3277740755f6bfc1155c7aa645403b760
c emilkowalski/skills             emil-skills         a81dbca07f2217b7103e510c0f13f8d5b017afc9
c CloudAI-X/threejs-skills        threejs-skills      0e181866f095b5f06d005133876e926515390d95
c LottieFiles/motion-design-skill motion-design-skill f9a8a041b85185ee4881b3471d3415e939aac772
c zanwei/design-dna               design-dna          593e39bc9e3652734653bd75544a333d7d43615e
c kylezantos/design-motion-principles design-motion-principles 4a9ca879f24a361f4dca4174fe2da0f67b5ddee3
c tt-a1i/archify                  archify             v3.2.0
cp -R ~/tools/hairline/skills/hairline-create $K/
cp -R ~/tools/anatomy $K/anatomy && rm -rf $K/anatomy/.git
# from ~/tools/ui-skills, copy these four skill folders into $K:
#   fixing-accessibility  fixing-metadata  fixing-motion-performance  improve-ui
cp -R ~/tools/gsap-skills/skills/gsap-* ~/tools/threejs-skills/skills/threejs-* ~/tools/motion-design-skill/skills/motion-design $K/
for s in animate improve-animations review-animations find-animation-opportunities remove-animations animation-performance animation-vocabulary; do cp -R ~/tools/emil-skills/skills/$s $K/; done
cp -R ~/tools/design-dna $K/design-dna && rm -rf $K/design-dna/.git
cp -R ~/tools/design-motion-principles/skills/design-motion-principles $K/
cp -R ~/tools/archify $K/archify && rm -rf $K/archify/.git
```

**Archify** (diagrams of how parts connect) is pinned at `v3.2.0`, its
newest release on 2026-10-30. Check it with
`node ~/.claude/skills/archify/bin/archify.mjs doctor`.

`craft`'s scanners live inside four plugins. Install them, then turn them
off (never uninstall): inside Claude Code, `/plugin marketplace add`
`agiwhitelist/auteur`, `AThevon/genjutsu`, `pbakaus/impeccable` and
`nextlevelbuilder/ui-ux-pro-max-skill`, then `/plugin install`
`auteur@auteur`, `genjutsu@genjutsu`, `impeccable@impeccable` and
`ui-ux-pro-max@ui-ux-pro-max-skill`. Use only ui-ux-pro-max's UX rules
(`tools/toolkit.md`, *UI skills*).

## 5. Diagram Design: the clone and the plugin

```bash
git clone https://github.com/cathrynlavery/diagram-design ~/tools/diagram-design
git -C ~/tools/diagram-design checkout 0cf73c3fcc56667ad91a9a04c439ac6ccfabc9d1
# inside Claude Code:
/plugin marketplace add ~/tools/diagram-design
/plugin install diagram-design@diagram-design
/reload-plugins
/diagram-design:profile load ember
```

Then load `ember` into the clone's style guide too, as `tools/diagrams.md`
says. The clone is also where the exploded builder lives
(`tools/build_layers.py` uses it).

## 6. Plugins and servers

- `/plugin install playwright@claude-plugins-official`, for looking at
  pages.
- The Context7 MCP server, for up-to-date library docs.
- `dataviz` is built in.

## 7. Check it all

```bash
bash ~/.claude/design/scripts/check-updates.sh             # every pin, and what is newer
bash ~/.claude/design/scripts/show-reference.sh showcase   # every part renders in Chrome
python3 -I ~/.claude/design/tools/diagram_svg.py /tmp/dg   # the diagram helper draws its example
```

Then build any one library figure with `hairline-create` and see
`validate.mjs` print `ok` (`tools/hairline.md`).
