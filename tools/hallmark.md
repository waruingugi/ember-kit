# Hallmark (checker only)

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

Hallmark (https://github.com/nutlope/hallmark, MIT, by nutlope and the Hallmark contributors) is
a design skill that fights "AI slop". It also deals its own themes and its
own look. **We use it as a checker only. It never designs a page.**

So it lives in `~/tools/hallmark/`, outside `~/.claude/skills/`, where it
cannot load as a skill. Never copy it into `~/.claude/skills/`, never run
`/hallmark`, never run its `theme.mjs`, and never run `install-hook.mjs`
(that adds a hook to `settings.json`).

## When

Run its linter as one more check before you call a page done, after the
checklist in `DESIGN.md` and the `craft` review. It reads `.html` and `.css`,
and the class strings in `.jsx`, `.tsx`, `.vue`, `.svelte` and `.astro`.

```bash
node ~/tools/hallmark/scripts/sloplint.mjs <file-or-folder>
```

Add `--render` for the screenshot checks. They need `puppeteer-core` and
Chrome, and they write screenshots into a `.hallmark/` folder next to the
page. Delete that folder when you are done, so it never ships.

## Which findings to skip

Some of Hallmark's rules ban parts of our look on purpose. On our pages,
skip these gates and say so in one line:

| Gate | What it bans | Why we keep it |
|---|---|---|
| `20` | No "Hallmark stamp" at the top of the CSS | We do not use Hallmark's stamp |
| `54`, `64`, `67` | Eyebrows, mono labels, tracked capitals | Our section heads have mono upper-case eyebrows |
| `38i`, `38ii`, `38iii` | An italic or coloured word in a heading | Our headings have one orange phrase |
| `37`, `1` | More than two font families, Inter as a heading font | We use five fonts (`DESIGN.md`, *Type*) |
| `63` | Meta lines joined with `·` | We use them |
| `24b` | Spacing off a 4 px scale | We have no 4 px scale |
| `58` | More than 450 words on a page | Explainers and showcases are long on purpose |
| `10a` | Animating the sidebar's width | `DESIGN.md` says the sidebar width animates (*The sidebar*). Animating anything else this way is a real finding. |
| `19` | The `——` in an eyebrow | Ours. A dash in prose is a real finding (*No dash pile-ups*). |

Every other `FAIL` is a real finding: fix it. Most often these are an SVG
with no `aria-hidden` or `aria-label` (`33`), a colour typed in instead of a
token (`48`, `7a`), no `overflow-x: clip` on `html` and `body` (`34`), and
something readable hidden until a script runs (`62`). Read each `WARN` and
fix it, or say in one line why it is fine.

Hallmark's fixes never change our look. If a fix would change a colour, a
font, the layout or the motion, ask the owner first.

## The pin

It is a copy of `skills/hallmark/` from commit
`4f6a46c6dc325d40ab268c93e25c7b96676ebccd` (2026-10-29, version 2.0.0),
unchanged, with its `LICENSE`. `npx skills add nutlope/hallmark -g` fetches
whatever is newest and installs it as a live skill, so we do not use it.

It was read for safety on 2026-11-01. It has no hooks unless you run
`install-hook.mjs`, no hidden instructions and no tracking. The linter
reads only the files you give it. It goes online only with `--render` on a
`--url`, or to load the page's own stylesheets. Its other network calls are
in scripts we never run: `imagegen.mjs` sends a prompt to Together AI, and
only when `TOGETHER_API_KEY` is set; `theme.mjs` downloads photos only from
Wikimedia. To move the pin, read every changed script, then copy the new
folder over `claude/skills/hallmark/` and over the installed copy.
