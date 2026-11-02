# Components: the small parts every page shares

> Part of the design system. Read `~/.claude/design/DESIGN.md` first.

Every page is built from the same small parts, so every page feels like
one family. Do not invent a new style for one of these. Copy it.

- `tokens.css` holds every colour, font, radius, shadow and curve. Paste
  its `:root` block at the top of the page's `<style>`.
- `components.css` holds the parts below. Paste the ones the page uses.
- `parts/` holds every bigger part the reader works (tabs, stepper, data table, toast, payment status, folder and more), one file each, made from `showcase/index.html`. How to build a page from them: `parts/README.md`. Which to use and what to keep: `patterns/interactive-parts.md`.
- `preview.html` shows every part on one page. Open it with
  `bash ~/.claude/design/scripts/show-reference.sh ../components/preview.html`,
  or straight from the file.

**The font link**, once per page, in the `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,400&family=Space+Grotesk:wght@400;500;600&family=Inter:wght@400;450;500;600&family=JetBrains+Mono:wght@400;500;600&family=Antonio:wght@300..700&display=swap">
```

## The parts

| Part | Use it for | Markup |
|---|---|---|
| **Section head** | The start of every section: a huge outlined number behind, a numbered eyebrow, a heading that is a claim with one italic orange phrase, and a lead | `<section class="sec"><span class="ghost" aria-hidden="true">03</span><p class="eyebrow"><b>03</b> Order flow</p><h2>Every order is <em>in one state.</em></h2><p class="lead">…</p></section>` |
| **Sub-heading** | A small mono heading inside a section, with a rule after it | `<p class="sub">Row 1 · The whole repo</p>` |
| **Label** | A small mono caps label above a value | `<span class="label">Owning module</span>` |
| **"Our proposal" pill** | Anything not settled yet. Never leave a guess unmarked | `<span class="prop">Our proposal</span>` |
| **Badges** | A decision (`dec`) or something that needs sign-off (`sign`) | `<span class="badge dec">Decision</span>` `<span class="badge sign">Sign-off</span>` |
| **System chip** | Naming what kind of part a thing is, in its system colour | `<span class="chip sys-database"><i></i>Database</span>` (also `sys-frontend`, `sys-backend`, `sys-security`, `sys-bus`, `sys-external`) |
| **Status badge** | "This is live" or a draft label in the top bar. The dot pulses | `<span class="status"><i></i>Draft 0.1 · for review</span>` |
| **Key** | A keyboard key in running text | `<span class="kbd">[</span>` |
| **Card** | Any boxed idea. Add `lift` to make it rise on hover | `<article class="card lift"><h3>…</h3><p>…</p></article>` |
| **Bento grid** | Cards of mixed widths. Never three equal cards by default | `<div class="bento"><div class="card c7">…</div><div class="card c5">…</div></div>` |
| **Stat card** | A number that matters. It counts up once 40% visible (see *Motion* (`DESIGN.md`)) | `<article class="card stat"><p class="label">Beats an hour <span class="pill">Typical</span></p><p class="num"><span data-count="28800">0</span><small>bph</small></p><p>…</p></article>` |
| **Sparkline** | A small live trend under a stat. It draws in, then shimmers | `<svg class="spark" aria-hidden="true"><path class="tr"/><path class="ln" pathLength="1"/><path class="gl" pathLength="1"/></svg>`. Add `done` when drawn |
| **Callout** | The one rule or idea a section must leave behind. A Fraunces sentence, then a plain one | `<div class="callout"><span class="label">The import rule</span><p>Big sentence.</p><p>Plain detail.</p></div>` |
| **"Done looks like"** | How we will know a section's work is finished | `<div class="donebox"><span class="label">Done looks like</span><p>…</p></div>` |
| **Source line** | Where a fact came from | `<p class="src">Source: plan §3</p>` |
| **Frame** | Any picture: a diagram, a figure, a poster. Dots in the bar, a title, a count | `<figure class="frame"><div class="fbar"><span class="dots"><i></i><i></i><i></i></span><span class="t">order states</span><span>11 states</span></div>…</figure>` |
| **Dot canvas** | Behind a Hairline figure or a hand-drawn diagram | `<div class="canvas-dots">…</div>` |
| **Tool note** | Under every picture: which tool drew it, and why that tool, in one sentence | `<p class="tool"><span class="label">Diagram Design</span>A state machine shows every allowed move.</p>` |
| **Table** | Rows of facts. Always inside the scroll wrapper, so a phone scrolls the table, not the page | `<div class="tw"><table>…</table></div>` |
| **Button** | An action. It shrinks to 0.97 when pressed | `<button class="btn" type="button">Copy</button>` |
| **Segmented toggle** | One choice from a few (motion level, a filter) | `<span class="seg" role="group" aria-label="Motion"><button aria-pressed="true">Lively</button><button aria-pressed="false">Calm</button><button aria-pressed="false">Off</button></span>` |
| **Toast** | A short "done" message after an action, for 1.8 s | `<div class="toast" role="status"></div>`, then add `on` |
| **End card** | The last block of a page: a dark plate, a heading, numbered next steps | `<section class="end"><h2>That is the plan. <em>Tell us what to change.</em></h2><ol><li><b>01</b><span>…</span></li></ol></section>` |

**Bigger parts have their own pages:** the sidebar and the top bar (core
`DESIGN.md`), code windows and terminals (`patterns/code-blocks.md`),
folder views (`patterns/folder-views.md`), expandable cards
(`patterns/feature-catalog.md`), and the story timeline
(`patterns/story-timeline.md`).

## States a page must not forget

- **Empty.** A list or a store with nothing in it shows one plain line saying
  what will appear there and how to add the first one. Never a blank box.
- **Loading.** A figure that mounts late keeps its space (the frame has a
  fixed aspect ratio), so nothing jumps.
- **Failed.** If a figure or diagram throws, the card still reads well
  without it. Catch the error and leave the card as it is.
- **Not settled.** Mark it with the `Our proposal` pill, or say
  "Open question" in plain words.

## Icons and the page icon

- Icons are inline SVG: 1.4 to 1.6 px strokes, round caps, `currentColor`.
  No icon fonts, no emoji.
- The sidebar mark is a 34 px white tile with a simple line icon in ink and
  one orange stroke.
- For a claude.ai artifact, pass one plain word as its `icon` (like
  `clock` or `diagram`). For a page served from a folder, use
  `<link rel="icon" href="data:,">` unless the project has a real mark, so
  the browser does not ask for a missing `favicon.ico`.
