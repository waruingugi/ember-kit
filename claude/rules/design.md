Before you make or change any artifact, web page, diagram, Hairline figure or Anatomy figure, in any project, read `~/.claude/design/DESIGN.md` and follow it. It is the owner's design system, and it overrides a skill's own default look. It is the short core. Read the other files in `~/.claude/design/` only when its picker says the work needs them.

Ask the owner first, and wait, when:

- the project already has its own theme (in its `CLAUDE.md`, a design file, or its existing pages) and it differs from `DESIGN.md`: ask which theme to use;
- code copied from somewhere else (another project, a skill's example) differs from `DESIGN.md`: ask which to follow;
- a change would alter the look (a colour, a font, the layout or the motion).

It is a living system. When the owner gives feedback about how things should look or move:

1. Write the rule into the right file in `~/.claude/design/` the same day, in plain 6th-grade English.
2. Add one dated line to `~/.claude/design/CHANGELOG.md`.
3. If the change touches diagrams, also update the Diagram Design profile with `/diagram-design:profile update ember`, and copy it back to `~/.claude/design/claude/diagram-design/ember.md`.
4. Remind the owner to commit and push the folder.

Every Hairline figure you make or improve is saved in `~/.claude/design/hairline/`, and listed in that folder's `README.md`.

Anatomy (`/anatomy`, skill `anatomy`, from github.com/wheresryan22/anatomy, pinned at `1482e84` in `~/tools/anatomy`) turns one idea into a detailed isometric machine that shows how it works. When to use it, and how it fits the look: `~/.claude/design/tools/anatomy.md`. Never publish to its community gallery unless the owner asks.

Once a month, if `~/.claude/design/.last-update-check` is more than 30 days old, run `bash ~/.claude/design/scripts/check-updates.sh` and tell the owner what it found. It only reports. Never move a pin without reading what changed and testing it.
