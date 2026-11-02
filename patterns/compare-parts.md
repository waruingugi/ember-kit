# Choosing a part: compare, then ask

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

The kit pulls ideas from many places, and some of them disagree. So when
Claude needs a part the kit does not have yet (a data table, a date picker,
a command menu), it does not pick a source by itself. It builds a few
versions side by side, the owner picks one, and the pick is written down.
The next time, Claude reads what was picked before and decides faster.

## When

- **A new kind of part.** `components/parts/README.md` has no house version.
- **The owner asks for a new or better version** of a part that exists.
- **Not** for a part that already has a house version and the owner did not
  ask for a new one. Use the house version.
- **Not** for small fixes.

## 1. Read the log first

Open `notes/choices.md`.

- **The same part was picked before:** use the pick. It is settled. Do not
  compare again unless the owner asks.
- **A close part was picked before** (a table, now a list with rows that
  open): make the past winner's way option A, and say so.
- **The owner keeps picking one kind** (say, the mix three times): show that
  kind first. Still show the others.
- **Known leaning (Taste Lab round 1):** the owner picks the lively option
- **Many parts at once:** run a Taste Lab round instead (`tools/taste-lab/README.md`). What the owner picked so far, as rules: `patterns/taste.md`.
  (B, on a spring) for parts the reader works, and leaves out every off-look
  option. Make the lively option first, and leave out the off-look option
  unless the owner asks for one.

## 2. Gather from the sources

Each source has one job. Take that job from it, and nothing else.

| Source | What we take from it | Where |
|---|---|---|
| Our house parts | The look, always | `components/parts/`, `components/tokens.css` |
| shadcn/ui (`shadcn` skill) | How the part is built: its pieces, ARIA roles, which keys do what | `tools/ui-libraries.md` |
| beUI, free parts only (`beui` skill) | A version where motion is the point | `tools/ui-libraries.md` |
| easyui | Everyday parts with a twist. 25 are already rebuilt in our look (parts `n01` to `n25`) | `tools/ui-libraries.md` |
| Thinking orbs (libraries.dev, the orbs only) | The busy sign for an AI or agent at work | `tools/ui-libraries.md` |
| `animate` and Emil's other motion skills | How it opens, closes, stops halfway and leaves | `tools/toolkit.md` |
| `motion` skill or GSAP | The motion code | `tools/motion.md`, `tools/gsap.md` |
| `motion-ecosystem`, the `threejs-*` skills, depth | Immersive ideas: scenes, depth, scroll. Only for big showpiece parts, never for a plain control | `patterns/depth.md` |
| `dataviz` | Anything with a chart in it | built-in skill |
| A site or library the owner names | Whatever the owner pointed at | the link |

### Who wins when they disagree

1. The owner's own words.
2. `DESIGN.md` and the `notes/` files.
3. Our house parts.
4. The `tools/` and `patterns/` files.
5. Our own skills: `craft`, `motion`, `motion-ecosystem`.
6. Other people's skills. Of these, shadcn wins on how a part is built,
   beUI, easyui and `animate` win on how it moves, and none of them wins on the look.

Clashes we have already settled:

| They say | We do |
|---|---|
| shadcn: never change a part's colours | Change them once, through the theme (`tools/ui-libraries.md`) |
| beUI and `animate`: their own timing and curves | *Two speeds* and our curve (`DESIGN.md`, *Motion*) |
| Hallmark: no eyebrows, no tracked capitals | Keep ours, and skip those gates (`tools/hallmark.md`) |
| `craft` and Hallmark both judge "slop" | `craft` leads; Hallmark is an extra check |
| GSAP skills: ScrollSmoother | Never: it takes over the scroll |

## 3. Build the compare page

One page with three or four working versions of the same part, side by
side. On a phone they stack.

| Option | What it is |
|---|---|
| **A · Plain** | shadcn's way of building it, in our look, with quiet motion. Or the past pick from the log. |
| **B · Lively** | beUI's or easyui's version, given our look. |
| **C · Mix** | The best of A and B, plus ideas from the motion and immersive skills. |
| **D · Wild card** (when it helps) | Another idea: a site the owner named, another library, or a bolder take. |

The rules for every option:

- **Same job, same sample data**, so the owner compares how it works, not
  what it says. Use real-looking data that fits the part (orders in a table,
  bookings in a date picker).
- **All in our look.** Every option uses our tokens and fonts. The options
  differ in how they are built and how they move, never in borrowed colours.
- **Each card has** a big letter, a name, one line on what it does, a
  "Taken from" line naming its sources (with links), and one line on what to
  try. Below that goes the working part.
- **Under each card, three short facts:** what it needs (packages), how it
  works with the keyboard, and what it does with motion `off`.
- **Judge each option against the four UX laws** (`patterns/ux-laws.md`): target sizes, how many choices, familiar keys, and spacing that shows the groups. Name any law an option breaks in its facts.
- **Quick checks before showing:** it works with the keyboard, it shows
  everything with motion `off`, and the console has no errors. The full
  checklist waits for the winner.

Publish the page as a private artifact (`tools/publishing.md`), then ask.

## 4. Ask the owner, and wait

Ask with one question: A, B, C or D. The owner can also mix them ("A, with
C's motion") or say none. Do not build further until the owner answers.

## 5. After the pick

1. **Build the winner properly** as a house part (`patterns/showcase.md`
   says how parts are added). Run the whole checklist in `DESIGN.md`.
2. **Write one row in `notes/choices.md`**: the date, the part, the options
   shown, the pick, why (in the owner's words) and the sources. If the owner
   says never to offer something again, write that too.
3. **If the pick sets a rule** ("toggles always use a spring"), write the rule
   into the right file and add a line to `CHANGELOG.md` (*Keeping it up to
   date*, `DESIGN.md`).
