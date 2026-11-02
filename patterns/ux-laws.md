# Four UX laws

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

Four rules about how people use screens. They come from studies of real
people, collected at https://lawsofux.com (Jon Yablonski). Use them when you
build a part, when you judge the options on a compare page
(`patterns/compare-parts.md`), and in the checklist before a page goes online.

They never change the look. They decide sizes, places, how many choices to
show and how things behave. If following one would change a colour, a font,
the layout system or the motion, ask the owner first.

## 1. Fitts's law: big and close is fast

**The idea.** The time to reach a target depends on how far away it is and
how big it is. A far, small button is slow to hit and easy to miss. A near,
big one is fast. (Paul Fitts, 1954. Time ≈ a + b · log₂(distance ÷ width + 1).)

**What we do.**

- **Size.** On a touch screen (`@media (pointer: coarse)`), every target is
  at least 44 × 44 px, with at least 8 px between targets (`craft`,
  `rules.md`). With a mouse, nothing is smaller than 24 × 24 px. A small icon
  keeps its look and gets a bigger hit area from a `::before` around it.
- **Distance.** Put the next action where the hand and eye already are. A
  popover grows from the button that opened it. A part's feedback (a toast,
  an Undo bar) shows inside its own card, next to what you clicked
  (`DESIGN.md`, *Recurring parts*). A form's main button comes right after
  the last field, on the reading path.
- **Edges.** With a mouse, the pointer stops at the edge of the screen, so
  things on an edge are easy to hit. That is why the sidebar and the top bar
  sit on edges.
- **Phones.** Main actions go where a thumb reaches: the bottom half, or a
  sticky bar at the bottom (like the batch tray, part 19).
- **Danger far away.** Keep a destructive action (Delete) away from the
  common one (Save), so a near miss does no harm. Our Undo rule still holds:
  no "Are you sure?" box.

**Check.** On a phone width, measure every control. Anything under 44 px
fails. Click through a task and count the long trips across the screen.

## 2. Hick's law: more choices, slower choice

**The idea.** The more options people see at once, the longer they take to
pick one. Each doubling of the options adds about the same extra time.
(William Hick and Ray Hyman, 1952. Time ≈ a + b · log₂(options + 1).)

**What we do.**

- **Few at a time.** Show 3 or 4 real choices. That is why compare pages have
  3 or 4 options, and why the owner sees options side by side.
- **One main action per view.** Only one button gets the main style
  (`.b.pri`). The rest are plain.
- **Hide the rare ones.** Put actions people seldom use behind "More" (a
  split button or an overflow menu).
- **Break long tasks into steps.** A long form becomes a stepper (part 10),
  one small group of fields per step.
- **Group long lists.** Sidebars and menus get groups with short headings.
- **Not for lists people search.** When people already know the name they
  want (a country, a customer), Hick's law does not help. Give them a search
  box or a combobox instead of a shorter list.

**Check.** Count the choices on each screen and in each menu. More than about
seven at one level needs groups, steps or a "More".

## 3. Jakob's law: people expect what they already know

**The idea.** People spend most of their time on other sites and apps. So
they expect yours to work the same way. When it does, they don't have to
think. (Jakob Nielsen, 2000.)

**What we do.**

- **Our look can be new. How things behave stays familiar.** A part may look
  like ember, but it works like the parts people use every day.
- **Keys work as everywhere else.** Escape closes a menu, popover or drawer.
  Enter sends a form. Arrow keys move through menus, tabs and lists. Clicking
  the dim backdrop closes a drawer. shadcn/ui (Radix) shows the expected
  behaviour for each part (`tools/ui-libraries.md`): copy it.
- **Familiar places.** The name or logo at the top left goes home. Search is
  at the top. Links in text are underlined. A switch is on when its knob is on
  the right.
- **A new way needs an old way too.** If a part does something new (option D
  on the sticky pages compare swaps cards as you scroll), keep a familiar way
  to do the same thing (its Back and Next buttons).

**Check.** Try each part with only the keyboard. Every key should do what a
reader would guess.

## 4. The law of proximity: close means related

**The idea.** Things that sit close together look like they belong together.
Things far apart look separate. People see the groups before they read a
word. (From Gestalt psychology, the study of how we see wholes.)

**What we do.**

- **Space shows the groups.** The space inside a group is always smaller than
  the space between groups, about half or less. A label sits close to its
  field. Fields in one group sit closer to each other than to the next group.
  Sections are far apart (the section head starts 88–150 px below the last
  section).
- **Captions hug their picture.** The one-line tool note sits right under its
  frame. A status word sits on its own line right under the name it belongs
  to (`DESIGN.md`, *Recurring parts*).
- **Space before boxes.** Use space to group things first. Add a border or a
  card only when space is not enough (`DESIGN.md`, *Edges at rest*).
- **Equal gaps say nothing.** If every gap on a page is the same, nothing
  looks grouped. Two or three gap sizes, used on purpose, read best.

**Check.** Blur your eyes, or look at a screenshot at small size. The groups
you see should be the groups you meant.

## When they pull against each other

- **Fitts vs Hick.** Big targets take room, and room is limited, so show
  fewer, bigger choices. That obeys both laws.
- **Jakob vs a new idea.** A new idea is fine when it has a job. Keep the
  familiar way next to it.
- **Proximity vs Fitts.** Targets that sit close for grouping still keep
  8 px between them on touch screens.
