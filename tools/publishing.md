# Putting a page online

> Part of the design system. Read `~/.claude/design/DESIGN.md` first; it says when to read this file.

Pages in this style can be published as claude.ai artifacts. Here is what
works there, and the order to do things in.

## Local first, online second

1. The page's source is a local file, kept in the project (for example
   `docs/artifacts/<name>/index.html`). In a throwaway study it can live in
   the session's scratch folder.
2. Change the local file first. Then publish it. Never change only the
   online copy.
3. Republish the same file path to keep the same link.
4. A page that is really someone else's (a client's brand, a real record)
   is never published as if it were theirs.

## What an artifact may load

- **Scripts** only from `cdn.jsdelivr.net/npm/`, `cdnjs.cloudflare.com`,
  `unpkg.com` and a few others, each pinned to an exact version. GSAP
  3.15.0 from jsdelivr, with the SRI hashes in `tools/gsap.md`, works.
- **Stylesheets** only from Google Fonts. So our five fonts work, through
  the one link in `components/README.md`. Every other style must be inline
  in the page's `<style>`.
- **Everything else ships with the page.** Hairline figures, the vendored
  Hairline package, Archify diagram pages and poster images go in the
  publish call's `files`, next to the page. A page with custom figures can
  publish them as one bundle, for example `vendor/figures-bundle.js`.
- **No ES modules from local files.** Use the plain-script copies
  (`vendor/hairline-0.5.1.global.js`, and a bundle of kernel, shim and figures for
  custom figures).

## What the page must do

- Set `body`'s background from `--paper`. The page is light only, so set
  `color-scheme: light` and give every colour a token. Do not add a dark
  theme without asking (*Ask first* in `DESIGN.md`).
- Wrap every `localStorage` read and write in `try`/`catch`. It can throw
  in a private window.
- Keep the page under 16 MB, embedded images included.
- Work at 390 px wide with no sideways scroll. Only tables, code and wide
  diagrams scroll, each inside its own container.
- Use `<link rel="icon" href="data:,">`, and pass one plain word as the
  artifact's `icon` (like `clock` or `diagram`).
- `alert()`, `confirm()` and `prompt()` do nothing in an artifact. Build any
  confirmation into the page.
- Copy buttons call `navigator.clipboard.writeText` inside the click, and
  fall back to selecting the text.

## Before you publish

Run the checklist at the end of `DESIGN.md`. Look at the page once in the
browser at 1440 and 390 px wide, and with motion `off`. Then publish, and
give the owner the link.