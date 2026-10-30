# Line charts

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

**What it is.** One value over time, drawn as a smooth orange line with a soft
fill under it. It comes in two kinds, both picked by the owner on 2026-10-29, both
in one working page to copy: `components/line-chart.html`.
- **Live** (section 01 of that page): the newest point sits on the right edge
  and the line scrolls; pointing at it pauses it.
- **Still** (section 02): a fixed set of numbers. It draws itself in once,
  reshapes between ranges, and reads each day on hover or with the arrow
  keys.

**Why it works.** The curve reads as one calm shape, so the eye follows the
trend, not the noise. It still passes through every real reading, so nothing
is made up.

## How it looks

- **The line is curved, never sharp.** Use a *monotone* curve (Fritsch-Carlson
  slopes, one cubic Bézier per step between readings). It bends smoothly
  through every reading and never goes above the highest one or below the
  lowest. Do not use a plain smooth curve (Catmull-Rom, `curveBasis`): it adds
  bumps the data never had. Do not average the data to make it smoother unless
  the owner asks.
- **One orange line**: `--accent`, 2 px, round joins and caps. Under it, a fill
  that fades from the accent at 20% to nothing at the bottom.
- **The newest point** is a 4 px accent dot with a 2 px `--paper-raised` ring.
  On a live chart it may pulse (the one loop allowed); the pulse stops when
  paused, on `calm` and on `off`.
- **Quiet axes**: three flat grid lines at `rgb(var(--ink-rgb) / .08)`, no
  axis lines. Tick labels in JetBrains Mono 11 px `--muted`, tabular numbers.
  Time labels read `−60s`, `−30s`, `now`.
- **The y-range follows the data** with 16% headroom, and eases to its new
  range instead of jumping. The tick labels update about five times a second
  so they stay readable.
- **The headline number** sits above the chart in Antonio, with its unit in
  small Inter `--muted`. The change sits under it as `▲ 2.4% over the last
  60s` in ink. No green or red: the arrow carries the direction.
- **It sits in a `.frame`** with the three-dot bar, a title and the time
  window, and a one-line tool note under it.

## How it behaves

- **Hover or touch pauses and scrubs.** A dashed line and a dot follow the
  pointer on the curve, with a tooltip: the value and "how long ago". Leaving
  resumes; it runs a little faster until it catches up. A tap outside clears
  it on touch screens.
- **A Live/Paused button** in `.btn` style, with an orange dot (live) or a
  `--dim` dot (paused).
- **A table view**: "Show the last 10 readings as a table", in a `<details>`.
- **Motion levels**: `lively` scrolls smoothly; `calm` scrolls without the
  pulse; `off` and reduced motion jump to each new reading.
- **It sleeps** when it is off screen or the tab is hidden.

## How a still chart loads and moves

- **It draws itself in once**, from left to right, when 40% of it is on
  screen: a clip opens over 1.1 s on our one curve, and a small accent dot
  rides the front edge, then fades. Grid and labels are there from the start.
  `calm` takes half the time; `off` and reduced motion show it whole.
- **Range buttons** (`7D`, `30D`, `1Y`) sit in a small group; an ink marker
  slides under the chosen one (0.25 s). Every range is resampled to 72 points
  on the monotone curve, so the line *reshapes* into the new range in 0.55 s
  instead of being redrawn. A second click mid-reshape starts from what is on
  screen, so it never jumps. The grid and labels crossfade (0.2 s).
- **The y-scale uses round numbers** (`niceScale`: steps of 1, 2, 2.5 or 5 ×
  10ⁿ), labels in compact form (`$12K`). Date labels fit the range: weekdays
  for 7 days, `Oct 3` for 30, months for a year; 3 to 5 labels by width.
- **Hover snaps to real days**: a dashed line and a ringed dot (paper fill,
  accent ring) glide to the nearest day without overshooting. The tooltip
  shows the date and the value; the headline number and the change show that
  day too ("▲ 8.8% by Oct 10, 2026"). Leaving puts back the latest value.
- **Keyboard**: the chart is focusable; ← and → step one day, `Escape` clears.
- **Table view**: every day for short ranges, the first of each month for a
  year.

## How it is built

Plain SVG and one `requestAnimationFrame` loop that writes the path straight
into the page. No chart library, no React. The helpers to copy from
`components/line-chart.html`: `slopes` (the monotone slopes), `seg` (a point
on the curve), `valueAt` (used by the hover dot, so it stays on the line),
`buildFrame` (the path, the fill and the head) and `visibleExtent`.
The still chart adds `niceScale`, `curve`/`pathOf` (the monotone path
through the 72 points), `ease` (our curve as a function) and `changeRange`.

## Rebuild prompt

> Add a line chart of `<value>` over `<time window>` in the style of
> `~/.claude/design/patterns/line-chart.md`. Copy the code from
> `~/.claude/design/components/line-chart.html`, keep the monotone curve, and
> swap the sample feed for `<the real data>`.
