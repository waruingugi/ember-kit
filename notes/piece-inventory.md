# Piece inventory

Made by `node scripts/inventory.mjs` on 2026-11-23. Do not edit by hand; run it again.
Pages: showcase, fossa (2). Light theme, 1440 px wide, reduced motion, after scrolling the whole page once.

Every basic piece the pages really draw, measured by the browser. **Size** is height (px, or "hidden" when it was not on screen, such as a closed menu), corner radius, side padding, and font size/weight. **Colour** names each colour by its token; `RAW` means a colour that is not a token.
A piece is found by its HTML (`button`, `input`, `th`, roles) or, for chips, cards and avatars, by its class name, so a few may be counted under the wrong piece.

## Summary

| Piece | showcase | fossa (2) | Heights | Radii | Colour sets | Class names |
|---|---|---|---|---|---|---|
| icon button | 121 | 22 | 14 | 8 | 15 | 34 |
| button | 509 | 73 | 31 | 12 | 33 | 97 |
| text field | 43 | 10 | 7 | 2 | 4 | 9 |
| select | 2 | 1 | 2 | 2 | 2 | 2 |
| checkbox | 39 | 14 | 3 | 4 | 5 | 3 |
| radio | 7 | 0 | 2 | 2 | 3 | 1 |
| slider | 7 | 0 | 6 | 3 | 3 | 4 |
| menu or list option | 32 | 0 | 0 | 0 | 0 | 3 |
| table header cell | 22 | 12 | 3 | 1 | 2 | 4 |
| table cell | 152 | 64 | 3 | 1 | 2 | 7 |
| dialog or sheet | 11 | 5 | 0 | 0 | 0 | 14 |
| tooltip | 7 | 0 | 0 | 0 | 0 | 2 |
| key | 8 | 1 | 2 | 1 | 2 | 2 |
| chip, pill, badge or tag | 43 | 7 | 12 | 6 | 12 | 13 |
| card | 64 | 1 | 20 | 4 | 8 | 17 |
| avatar | 26 | 1 | 5 | 2 | 4 | 2 |

## Colours that are not tokens

- `rgb(255, 255, 255)` × 41
- `rgb(0, 0, 0)` × 40
- `rgba(225, 74, 14, 0.09)` × 23
- `rgba(225, 74, 14, 0.25)` × 22
- `rgba(21, 24, 27, 0.05)` × 8
- `rgb(16, 16, 16)` × 3
- `rgba(21, 24, 27, 0.2)` × 1
- `rgba(225, 74, 14, 0.5)` × 1
- `rgba(225, 74, 14, 0.22)` × 1
- `rgba(225, 74, 14, 0.4)` × 1
- `rgba(63, 185, 80, 0.14)` × 1
- `rgb(26, 127, 55)` × 1
- `rgba(248, 81, 73, 0.12)` × 1
- `rgb(207, 34, 46)` × 1

## icon button (143)

### By size: 36 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| 38 | 10 | 0 | Inter 14/500 | 19 |  | n32, n34, n49, n50, n51 | `b q tr` `b q` |
| 34 | 8 | 0 | Inter 17/400 | 15 |  | n01, c15, n20, c20, n21 | `ib bx` `ar` `ib pd-del` `ib` |
| hidden | 8 | 0 | Inter 14/400 | 1 | 10 | c25, c15 | `ib` `ib xp` |
| 28 | 8 | 0 | Inter 14/400 | 10 |  | c15 | `ib xp` |
| 44 | 8 | 0 | Inter 17/400 | 10 |  | n83, n89 | `gr` |
| 18 | 5 | 0 | Inter 14/400 | 8 |  | n37 | `cb` |
| hidden | 9 | 0 | Inter 17/400 | 2 | 4 | content, (page shell) | `icon-btn menu-btn` `icon-btn` `icon-btn sb-collapse` `icon-btn theme-toggle` |
| hidden | 8 | 0 | Inter 17/400 | 3 | 3 | n73, c15 | `pv` `nx` `ib` `ib bx` |
| 30 | 8 | 0 | Inter 17/400 | 6 |  | n58 | `nst` |
| 22 | full | 0 | Inter 17/400 | 5 |  | n80 | `dot` |
| 28 | full | 0 | Inter 15/400 | 4 |  | n14 | `sw` |
| 26 | 8 | 0 | Inter 15/400 | 3 |  | c17 | `ib` |
| 32 | 8 | 0 | Inter 17/400 | 3 |  | c11, n11, n09 | `ib` `ib chv` |
| 24 | full | 0 | Inter 15/400 | 3 |  | n31 | `sw` |
| hidden | 10 | 0 | Inter 14/500 | 3 |  | n39, n41, n77 | `b q x` |
| 38 | 9 | 0 | Inter 14/500 | 3 |  | n66 | `fb ic` |
| 34 | 9 | 0 | Inter 17/400 | 2 |  | (page shell), content | `icon-btn sb-collapse` `icon-btn theme-toggle` |
| 32 | 8 | 0 | Inter 14/400 | 2 |  | c15 | `ib` |
| 34 | 9 | 6 | Inter 14/500 | 2 |  | n48 | `pg` |
| 40 | 7 | 0 | Inter 17/400 | 2 |  | n56 | `nst` |
| 22 | full | 0 | Inter 13/400 | 2 |  | n45 | `button` |
| 22 | full | 0 | Inter 13/500 | 2 |  | n70 | `cx` |
| 30 | 10 | 0 | Inter 14/500 | 2 |  | n42 | `b q x` |
| hidden | 9 | 0 | Inter 14/500 |  | 2 | fleet | `fl-tool fl-ib` `fl-b q fl-x` |
| 18 | 5 | 0 | Inter 13/500 | 1 |  | n37 | `cb` |
| hidden | 8 | 0 | Inter 13/500 | 1 |  | n37 | `b sm q` |
| 20 | 6 | 0 | Inter 15/400 | 1 |  | n31 | `cb` |
| 36 | 8 | 0 | Inter 17/400 | 1 |  | n98 | `msnd` |
| 30 | full | 0 | Inter 17/400 | 1 |  | n96 | `add` |
| 38 | 0 | 0 | Inter 14/500 | 1 |  | n15 | `b pri chev` |
| 34 | 7 | 9 | Inter 14/500 | 1 |  | n65 | `s ch` |
| 40 | 8 | 0 | Inter 17/400 | 1 |  | n68 | `ib xbtn` |
| 48 | full | 0 | Inter 14/500 | 1 |  | n33 | `b tr` |
| 34 | 8 | 0 | Inter 15/400 |  | 1 | v-signin | `ib` |
| hidden | 8 | 0 | Inter 15/400 |  | 1 | v-newpass | `ib` |
| hidden | 7 | 0 | Inter 17/400 |  | 1 | fleet | `fl-qx` |

### By colour: 17 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| none | --muted | none | 44 | 17 | (page shell), content, c15, n83, n89, c20, c17, c11, n11, n09, n45, n70 +5 | `icon-btn sb-collapse` `icon-btn menu-btn` `ib` `ib xp` `gr` `ib pd-del` +6 |
| none | --ink-soft | 1px none | 25 |  | n37, n39, n41, n32, n34, n49, n50, n51, n42, n77 | `b sm q` `b q x` `b q tr` `b q` |
| --paper-raised | --canvas | 1px --line-hi | 12 |  | n37, n20, n31, n33 | `cb` `ar` `b tr` |
| none | --ink-soft | none | 8 |  | n73, n48, n98, n21 | `pv` `nx` `pg` `msnd` `ib` |
| RAW rgba(21, 24, 27, 0.05) | --ink-soft | none | 8 |  | n56, n58 | `nst` |
| --paper-raised | --muted | 1px --line-hi | 5 | 2 | n01, c15, n37 | `ib bx` `cb` |
| --paper-raised | --canvas | none | 5 |  | n80 | `dot` |
| none | --canvas | none | 4 |  | n65, n66 | `s ch` `fb ic` |
| --paper-raised | --muted | 1px --line-hi + shadow | 1 | 1 | content | `icon-btn theme-toggle` |
| --canvas | --canvas | none | 2 |  | n14 | `sw` |
| --line-hi | --canvas | none | 2 |  | n14 | `sw` |
| --accent | --canvas | none | 2 |  | n31 | `sw` |
| RAW rgba(21, 24, 27, 0.2) | --canvas | none | 1 |  | n31 | `sw` |
| none | --muted | 1px --line-hi | 1 |  | n96 | `add` |
| --accent | RAW rgb(255, 255, 255) | 1px --accent | 1 |  | n15 | `b pri chev` |
| --paper-raised | --ink-soft | 1px --line-hi |  | 1 | fleet | `fl-tool fl-ib` |
| none | --canvas | 1px none |  | 1 | fleet | `fl-b q fl-x` |

## button (582)

### By size: 118 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| 44 | 0 | 0 | Inter 15/400 | 57 |  | n01 | `d wl wr` `d wl` `d` `d wr` |
| hidden | 8 | 11 | Inter 13/500 | 44 | 3 | n64, n73, c15, n37, c16, n79, n60, n67, n17, n25, n80, n81 +4 | `b sm rm` `b sm` `b sm pri` `b sm danger` `b sm q` |
| 32 | 8 | 11 | Inter 13/500 | 44 |  | n64, n01, n83, c20, n79, n41, c12, n74, c13, n21, n78, n22 +14 | `b sm` `b q sm` `b sm q` `b sm pri` |
| 38 | 10 | 14 | Inter 14/500 | 22 |  | n01, c17, c10, c11, n30, n57, n39, n15, c14, n29, n12, n36 +3 | `b pri` `b` `b pri main` `b pri pay` `b pri go` |
| hidden | 8 | 10 | Inter 14/400 | 6 | 11 | n75, n32, content, n03 | `mi` `mi-b` `mi-b del` `mi-b co-i` `lr` |
| 31 | 7 | 8 | Inter 14/400 | 13 |  | repo | `row` |
| 30 | 7 | 12 | Inter 13/500 | 12 |  | n87, n88, n90, n85 | `button` |
| 30 | 7 | 10 | Inter 13/500 | 9 | 3 | n53, n54, n55, auth | `button` |
| hidden | full | 0 | Inter 17/400 | 11 |  | n96, n33 | `op` `pt` `pt del` |
| 29 | 7 | 12 | JetBrains Mono 11/500 | 10 |  | c03, c22 | `cur` `button` |
| 29 | full | 12 | Inter 13/500 | 10 |  | c07 | `cur` `button` |
| 33 | 6 | 8 | Inter 13/400 | 10 |  | repo | `button` `sel` |
| hidden | 7 | 12 | Inter 13/500 | 5 | 5 | (page shell), n87 | `button` |
| 25 | 7 | 9 | Inter 13/400 | 9 |  | c15 | `button` |
| hidden | 7 | 9 | Inter 13/400 |  | 9 | c15 | `button` |
| 34 | full | 11 | Inter 13/500 | 8 |  | n46 | `ch` |
| 33 | full | 15 | JetBrains Mono 11/500 | 8 |  | c05 | `cur` `button` |
| 59 | 10 | 12 | Inter 15/500 | 8 |  | c06 | `cur` `button` |
| 42 | 12 | 0 | Inter 17/400 | 7 |  | c08 | `button` |
| 38 | full | 0 | JetBrains Mono 12/500 | 7 |  | n24 | `av a0` `av a1` `av a2` `av a3` `more` |
| 30 | 7 | 11 | Inter 13/500 | 6 |  | n91, n92 | `button` |
| hidden | 8 | 10 | Inter 13/400 | 6 |  | n73 | `button` |
| 14 | 0 | 0 | JetBrains Mono 11/500 | 6 |  | c15 | `sortb` |
| hidden | 7 | 12 | JetBrains Mono 11/500 | 6 |  | c17 | `button` `cur` |
| 44 | 0 | 0 | Inter 17/400 | 6 |  | c24 | `tl-top` |
| hidden | 7 | 8 | Inter 14/400 | 6 |  | repo | `row` |
| hidden | 0 | 0 | JetBrains Mono 11/500 |  | 6 | c15 | `sortb` |
| 38 | 8 | 10 | Inter 14/400 | 5 |  | n03 | `lr` |
| 40 | 8 | 8 | Inter 14/400 | 5 |  | n90 | `lw` |
| hidden | 0 | 0 | Inter 14/400 | 1 | 4 | c15, v-forgot, v-sent | `lk` `lk back` `lk other` |
| 30 | 6 | 6 | Inter 13/500 | 5 |  | n37 | `sb` |
| 69 | 0 | 20 | Inter 17/400 | 5 |  | c16 | `xr-btn xr-g` |
| 34 | 8 | 0 | Antonio 16/400 | 5 |  | n20 | `pb` |
| 52 | 0 | 2 | Inter 16/500 | 5 |  | n18 | `hd` |
| 48 | 12 | 12 | Inter 17/400 | 5 |  | n81 | `rh` |
| 34 | 8 | 8 | Inter 17/400 | 5 |  | n84 | `hd` |
| 28 | 8 | 0 | Inter 17/400 | 5 |  | n08 | `hd` |
| hidden | 8 | 8 | Inter 17/400 |  | 5 | n84 | `hd` |
| 44 | 10 | 0 | Inter 15/400 | 4 |  | n01 | `d s in` `d in` `d wr e` |
| 51 | 10 | 4 | Inter 17/400 | 4 |  | c10 | `sx-row` |
| 74 | 10 | 2 | Inter 17/400 | 4 |  | n79 | `mk` |
| hidden | 10 | 14 | Inter 14/500 | 3 | 1 | n39, n41, v-sent | `b q` `b pri` `b pri go` `b again` |
| hidden | 8 | 10 | Inter 14/500 | 4 |  | n65 | `button` `warn` |
| 40 | 10 | 0 | Inter 14/500 | 4 |  | n62 | `xb` |
| 36 | 8 | 16 | Inter 14/500 | 4 |  | n17 | `button` |
| 32 | 7 | 13 | Inter 14/500 | 4 |  | n71 | `sb` |
| 52 | 0 | 4 | Inter 16/500 | 4 |  | n35 | `hd` |
| 36 | 8 | 8 | Inter 14/400 | 4 |  | n52 | `row` |
| 29 | 7 | 0 | JetBrains Mono 11/500 | 3 |  | c02 | `button` |
| 32 | full | 12 | Inter 14/400 | 3 |  | c03 | `button` |
| 40 | 10 | 16 | Inter 14/500 | 3 |  | c17 | `b` `b pri` |
| 44 | 0 | 4 | JetBrains Mono 11/500 | 3 |  | c17 | `button` |
| 32 | 8 | 11 | Antonio 15/500 | 3 |  | n57 | `b sm` |
| hidden | 7 | 0 | Inter 14/500 | 3 |  | n39 | `button` |
| hidden | 8 | 10 | Inter 17/400 | 3 |  | n15 | `it` |
| 34 | 7 | 11 | Inter 14/500 | 3 |  | n65 | `s` |
| 64 | 9 | 10 | Inter 17/400 | 3 |  | c06 | `bs-c` |
| hidden | full | 0 | JetBrains Mono 12/500 | 3 |  | n24 | `av a2 x` `av a3 x` `av a0 x` |
| 71 | 12 | 14 | Inter 17/400 | 3 |  | n77 | `cd` |
| 40 | 0 | 12 | JetBrains Mono 13/400 | 3 |  | code | `tab` `tab is-del` |
| hidden | 10 | 0 | Inter 15/600 |  | 3 | v-forgot, v-newpass, v-done | `pbb` |
| hidden | 8 | 10 | Inter 13/500 |  | 3 | content | `nall` `nseen` |
| hidden | 7 | 0 | JetBrains Mono 11/500 |  | 3 | c02 | `button` |
| hidden | 7 | 14 | Inter 14/500 |  | 3 | view:vehicles, view:drivers, view:groups | `fl-sb` |
| hidden | 7 | 8 | Inter 13/500 |  | 3 | fleet | `button` |
| 30 | 7 | 14 | Inter 13/500 | 2 |  | n82 | `button` |
| 34 | 9 | 6 | Inter 14/500 | 2 |  | n48 | `pg` |
| 42 | 10 | 14 | Inter 14/500 | 2 |  | c11, n11 | `b pri` `b pri go` |
| 29 | 8 | 8 | Inter 15/400 | 2 |  | n97 | `iet` |
| 30 | 15 | 8 | Inter 13/500 | 2 |  | n96 | `cp` |
| hidden | 7 | 13 | Inter 14/600 | 2 |  | n60 | `yes` `no` |
| 32 | 8 | 8 | Inter 14/600 | 2 |  | n75, n76 | `lk more` |
| 30 | 8 | 11 | Inter 12/400 | 2 |  | code | `copy-btn` |
| hidden | 0 | 16 | Inter 14/400 |  | 2 | content | `ni` |
| hidden | 9 | 12 | Inter 14/500 |  | 2 | fleet | `fl-tool` |
| 36 | 10 | 14 | Inter 14/500 | 1 |  | content | `btn` |
| 36 | 10 | 14 | JetBrains Mono 12/500 | 1 |  | c01 | `btn` |
| 42 | 10 | 12 | Inter 15/400 | 1 |  | n73 | `t` |
| 34 | 9 | 6 | Inter 14/600 | 1 |  | n48 | `pg` |
| 22 | 0 | 0 | Inter 14/400 | 1 |  | c16 | `lk` |
| 21 | 0 | 0 | Inter 13/400 | 1 |  | c11 | `lk` |
| 23 | 0 | 0 | Inter 14/400 | 1 |  | c11 | `lk` |
| 33 | 8 | 8 | Inter 20/600 | 1 |  | n97 | `iet` |
| 44 | 9 | 10 | Inter 17/400 | 1 |  | n69 | `cc` |
| 180 | 14 | 28 | Inter 17/400 | 1 |  | c12 | `up-drop` |
| hidden | 0 | 0 | Inter 13/400 | 1 |  | c12 | `lk` |
| 141 | 12 | 16 | Inter 17/400 | 1 |  | n74 | `drop` |
| 32 | 7 | 10 | Inter 14/600 | 1 |  | n60 | `ask` |
| 40 | 10 | 14 | Inter 14/500 | 1 |  | n61 | `b cpb` |
| 30 | 8 | 8 | Inter 13/500 | 1 |  | n95 | `cb` |
| 46 | 12 | 2 | Inter 17/400 | 1 |  | c14 | `eb` |
| 46 | 10 | 14 | Inter 14/600 | 1 |  | n58 | `b pri pay` |
| 46 | 0 | 0 | Inter 15/600 | 1 |  | n63 | `pbb` |
| 44 | 10 | 0 | Inter 15/600 | 1 |  | n67 | `hb` |
| 32 | 8 | 9 | Inter 14/500 | 1 |  | n19 | `lk2` |
| hidden | 8 | 22 | Inter 14/400 | 1 |  | n75 | `mi` |
| hidden | 8 | 34 | Inter 14/400 | 1 |  | n75 | `mi` |
| 38 | 9 | 13 | Inter 14/500 | 1 |  | n66 | `fb` |
| 36 | full | 0 | Inter 14/500 | 1 |  | c09 | `b q` |
| 34 | 8 | 11 | Inter 13/600 | 1 |  | n21 | `b sm q` |
| hidden | 8 | 14 | Inter 13/500 | 1 |  | n42 | `b sm` |
| 41 | 8 | 14 | Inter 13/500 | 1 |  | n42 | `b sm` |
| hidden | 8 | 11 | Inter 13/600 | 1 |  | n22 | `b sm` |
| 42 | 10 | 0 | Inter 17/400 | 1 |  | n25 | `bell` |
| 24 | 7 | 8 | JetBrains Mono 12/400 | 1 |  | c22 | `idb` |
| 21 | 3 | 0 | Inter 17/500 | 1 |  | c25 | `pk-t` |
| hidden | 0 | 0 | JetBrains Mono 12/400 | 1 |  | c25 | `lk` |
| 25 | 0 | 0 | Inter 15/600 | 1 |  | n40 | `nm` |
| 212 | 22 | 14 | Inter 17/400 | 1 |  | c27 | `fo-btn` |
| 30 | 10 | 12 | Inter 13/500 | 1 |  | stack | `btn mini` |
| 40 | 8 | 12 | JetBrains Mono 13/400 | 1 |  | code | `tab` |
| 21 | 0 | 0 | Inter 14/400 |  | 1 | v-signin | `lk` |
| 46 | 10 | 0 | Inter 15/600 |  | 1 | v-signin | `pbb` |
| hidden | 8 | 8 | Inter 14/500 |  | 1 | content | `co` |
| hidden | 9 | 0 | Inter 17/400 |  | 1 | content | `icon-btn bell` |
| hidden | 22 | 2 | Inter 17/400 |  | 1 | content | `who-btn` |
| hidden | 10 | 14 | JetBrains Mono 12/500 |  | 1 | c01 | `btn` |
| hidden | 9 | 12 | Inter 14/600 |  | 1 | fleet | `fl-add` |

### By colour: 35 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| none | --canvas | none | 132 | 23 | n87, n88, n91, n92, n53, n54, n55, n03, n90, n01, c15, n48 +23 | `button` `lr` `d wl wr` `d wl` `d` `d wr` +24 |
| none | --muted | none | 68 | 26 | c02, c03, n87, n88, n91, n92, n53, n54, n55, n90, n82, c15 +16 | `button` `cur` `sortb` `sb` `mk` `icon-btn bell` +2 |
| --paper-raised | --canvas | 1px --line-hi | 84 | 6 | c01, n64, n73, c15, n37, c16, n83, c17, c10, n79, c11, n57 +34 | `btn` `b sm rm` `b sm` `b sm danger` `b` `b cpb` +4 |
| none | --ink-soft | none | 68 |  | c03, n90, n73, n48, n20, n96, n60, c06, n17, n19, n75, n76 +2 | `button` `lw` `pg` `pb` `op` `no` +4 |
| --accent | RAW rgb(255, 255, 255) | 1px --accent | 29 | 1 | n01, n73, n37, c17, c10, n79, c11, n30, n57, n11, n39, n41 +11 | `b pri` `b sm pri` `b pri go` `b pri main` `b pri pay` |
| none | --paper | none | 21 | 2 | c02, c03, n82, n20, c17, c05, n17, c07, c22, auth | `button` `cur` `pb` |
| none | --ink-soft | 1px none | 14 |  | n01, c20, n39, n17, c09, n22, n25, n38, n86, n16 | `b q sm` `b sm q` `b q` |
| none | --accent-text | none | 9 | 5 | c15, c16, c11, c12, n65, n60, n32, c25, v-signin, v-forgot, v-sent | `lk` `warn` `ask` `mi-b del` `lk back` `lk other` |
| none | --dim | none | 13 |  | n01 | `d` `d wr` |
| --paper-raised | --ink-soft | 1px --line-hi | 7 | 2 | n46, n96, fleet | `ch` `cp` `fl-tool` |
| --accent | RAW rgb(255, 255, 255) | none | 3 | 5 | n60, repo, v-signin, v-forgot, v-newpass, v-done, fleet | `yes` `sel` `pbb` `fl-add` |
| --paper-raised | --canvas | 1px --line + shadow | 8 |  | n33, n77 | `pt` `pt del` `cd` |
| --paper | --muted | 1px --line | 7 |  | c08 | `button` |
| none | --canvas | 1px none | 6 |  | n97, c06 | `iet` `bs-c` |
| --canvas | --paper | none | 2 | 2 | c15 | `button` |
| --paper-raised | --ink-soft | none | 4 |  | n62 | `xb` |
| --paper-raised | --canvas | 1px --line-hi + shadow | 3 |  | content, n73, stack | `btn` `t` `btn mini` |
| --canvas | --paper | 1px --canvas | 3 |  | n46, n96 | `ch` `cp` |
| none | --accent-text | 1px none | 3 |  | n22, n80, n81 | `b sm` `b sm q` |
| RAW color(srgb 0.830118 0.838588 0.837176) | --canvas | none + shadow | 3 |  | n24 | `av a0` `av a0 x` |
| none | --plate-dim | none | 3 |  | code | `tab` `tab is-del` |
| --paper-raised | --canvas | none + shadow | 2 | 1 | (page shell) | `button` |
| RAW color(srgb 0.892431 0.900627 0.898118) | --canvas | none + shadow | 2 |  | n24 | `av a1` |
| RAW color(srgb 0.776706 0.785412 0.784941) | --canvas | none + shadow | 2 |  | n24 | `av a2` `av a2 x` |
| RAW color(srgb 0.865726 0.874039 0.872) | --canvas | none + shadow | 2 |  | n24 | `av a3` `av a3 x` |
| --plate-raised | --plate-dim | 1px --plate-line + shadow | 2 |  | code | `copy-btn` |
| --paper | --canvas | 1px --line-hi | 1 |  | c12 | `up-drop` |
| --paper-raised | --canvas | none | 1 |  | n74 | `drop` |
| none | --plate-text | 1px --plate-line | 1 |  | n95 | `cb` |
| --canvas | --canvas | none | 1 |  | c14 | `eb` |
| none | RAW rgb(255, 255, 255) | none | 1 |  | n63 | `pbb` |
| --paper-raised | --accent-text | 1px RAW rgba(225, 74, 14, 0.5) | 1 |  | n67 | `hb` |
| --paper-raised | --ink-soft | 1px --line | 1 |  | c22 | `idb` |
| --paper-raised | --ink-soft | 1px --line-hi + shadow | 1 |  | n24 | `more` |
| none | --plate-text | none | 1 |  | code | `tab` |

## text field (53)

### By size: 24 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| 40 | 10 | 12 | Inter 15/400 | 12 |  | c10, n79, n30, n11, n80, n81 | `in` |
| 52 | 10 | 0 | Antonio 26/400 | 6 |  | n10 | `input` |
| 40 | 10 | 36 | Inter 15/400 | 4 |  | n37, c11, n09 | `in` |
| hidden | 10 | 0 | Antonio 28/400 |  | 4 | v-sent | `input` |
| 30 | 0 | 0 | Antonio 17/500 | 3 |  | n58 | `nin` |
| hidden | 8 | 8 | Inter 15/400 | 2 |  | n97 | `iei` |
| hidden | 10 | 12 | Inter 15/400 | 2 |  | n39, n81 | `in` |
| hidden | 0 | 40 | Inter 15/400 | 2 |  | n12, n36 | `input` |
| 44 | 10 | 38 | Inter 15/400 |  | 2 | v-signin | `in` |
| hidden | 10 | 38 | Inter 15/400 |  | 2 | v-forgot, v-newpass | `in` |
| 36 | 10 | 34 | Inter 14/400 | 1 |  | c15 | `in` |
| 38 | 10 | 36 | Inter 14/400 | 1 |  | c17 | `in` |
| hidden | 8 | 8 | Inter 20/600 | 1 |  | n97 | `iei` |
| 40 | 0 | 0 | Antonio 22/500 | 1 |  | n56 | `nin` |
| 52 | 0 | 0 | Antonio 40/500 | 1 |  | n57 | `nin` |
| 44 | 0 | 10 | Inter 16/500 | 1 |  | n69 | `num` |
| hidden | 0 | 2 | Inter 14/400 | 1 |  | n69 | `q` |
| 38 | 0 | 0 | Inter 15/500 | 1 |  | n59 | `cin` |
| 30 | 0 | 2 | Inter 14/400 | 1 |  | n45 | `input` |
| 28 | 0 | 4 | Inter 15/400 | 1 |  | n70 | `q` |
| 40 | 10 | 12 | JetBrains Mono 13/400 | 1 |  | n61 | `in` |
| hidden | 0 | 0 | Inter 15/400 | 1 |  | n68 | `xin` |
| hidden | 10 | 34 | Inter 14/400 |  | 1 | c15 | `in` |
| hidden | 10 | 36 | Inter 14/400 |  | 1 | fleet | `fl-in` |

### By colour: 5 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| --paper-raised | --canvas | 1px --line-hi | 26 | 10 | c15, n37, c17, c10, n79, c11, n30, n11, n10, n09, n39, n80 +6 | `in` `input` `fl-in` |
| none | --canvas | none | 8 |  | n69, n59, n45, n70, n12, n36, n68 | `num` `q` `cin` `input` `xin` |
| none | none | none | 5 |  | n56, n57, n58 | `nin` |
| --paper-raised | --canvas | 1px --accent + shadow | 3 |  | n97 | `iei` |
| --paper-raised | --ink-soft | 1px --line-hi | 1 |  | n61 | `in` |

## select (3)

### By size: 3 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| 32 | 8 | 6 | Inter 13/400 | 1 |  | c15 | `select` |
| 36 | 0 | 0 | Inter 15/400 | 1 |  | n98 | `med` |
| hidden | 8 | 6 | Inter 13/400 |  | 1 | c15 | `select` |

### By colour: 2 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| --paper-raised | --canvas | 1px --line-hi | 1 | 1 | c15 | `select` |
| none | --canvas | none | 1 |  | n98 | `med` |

## checkbox (53)

### By size: 5 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| 18 | 5 | 0 | Arial 13/400 | 20 |  | c15, c18, c11 | `chk` |
| hidden | 5 | 0 | Arial 13/400 | 5 | 14 | c15 | `chk` |
| 67 | 12 | 14 | Inter 17/400 | 10 |  | c19 | `bt-item` |
| 20 | 6 | 0 | Inter 15/400 | 3 |  | n14 | `input` |
| 20 | full | 0 | Arial 13/400 | 1 |  | n18 | `input` |

### By colour: 5 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| --paper-raised | RAW rgb(0, 0, 0) | 1px --line-hi | 19 | 9 | c15, c18 | `chk` |
| --canvas | RAW rgb(0, 0, 0) | 1px --canvas | 7 | 5 | c15, c11, n18 | `chk` `input` |
| --paper | --canvas | 1px --line | 10 |  | c19 | `bt-item` |
| --paper-raised | --canvas | 1px --line-hi | 2 |  | n14 | `input` |
| --canvas | --canvas | 1px --canvas | 1 |  | n14 | `input` |

## radio (7)

### By size: 2 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| 18 | full | 0 | Inter 17/400 | 4 |  | n99 | `input` |
| 23 | 0 | 0 | Inter 14/600 | 3 |  | n43 | `input` |

### By colour: 3 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| none | --canvas | none | 3 |  | n43 | `input` |
| none | --canvas | 1px --line-hi | 3 |  | n99 | `input` |
| none | --canvas | 1px --accent | 1 |  | n99 | `input` |

## slider (7)

### By size: 6 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| 104 | 8 | 0 | Inter 17/400 | 2 |  | n91, n92 | `plot` |
| 28 | 0 | 0 | Arial 13/400 | 1 |  | n44 | `input` |
| 54 | 0 | 0 | Inter 17/400 | 1 |  | n93 | `trk` |
| 44 | 0 | 0 | Arial 13/400 | 1 |  | n94 | `input` |
| 46 | 10 | 4 | Inter 17/400 | 1 |  | n72 | `row` |
| 16 | 0 | 0 | Arial 13/400 | 1 |  | n19 | `input` |

### By colour: 3 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| none | --canvas | none | 4 |  | n91, n92, n93, n72 | `plot` `trk` `row` |
| none | RAW rgb(16, 16, 16) | none | 2 |  | n44, n94 | `input` |
| RAW rgb(255, 255, 255) | RAW rgb(16, 16, 16) | none | 1 |  | n19 | `input` |

## menu or list option (32)

### By size: 3 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| hidden | 8 | 10 | Inter 14/400 | 16 |  | n69, n70 | `o` `o all mixed` |
| hidden | 7 | 10 | Inter 15/400 | 8 |  | n59 | `o` |
| hidden | 8 | 10 | Inter 15/400 | 8 |  | n36 | `op` |

### By colour: 1 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| none | --canvas | none | 32 |  | n69, n59, n70, n36 | `o` `o all mixed` `op` |

## table header cell (34)

### By size: 5 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| 26 | 0 | 0 | JetBrains Mono 11/500 | 8 |  | c01, c02, c03 | `th` |
| 42 | 0 | 12 | JetBrains Mono 11/500 | 8 |  | c15 | `w` `th` `r` |
| hidden | 0 | 12 | JetBrains Mono 11/500 |  | 8 | c15 | `w` `th` `r` |
| 40 | 0 | 12 | Inter 13/500 | 6 |  | n37 | `ckc` `th` `r` |
| hidden | 0 | 0 | JetBrains Mono 11/500 |  | 4 | c02, c01 | `th` |

### By colour: 2 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| none | --muted | none | 14 | 4 | c01, c02, c03, n37 | `th` `ckc` `r` |
| --paper | --muted | none | 8 | 8 | c15 | `w` `th` `r` |

## table cell (216)

### By size: 4 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| 67 | 0 | 12 | Inter 14/400 | 80 |  | c15 | `w` `cust` `td` `r` |
| hidden | 0 | 12 | Inter 14/400 |  | 64 | c15 | `w` `cust` `td` `r` |
| 46 | 0 | 12 | Inter 14/400 | 48 |  | n37 | `ckc` `td` `r num` `num` |
| 34 | 0 | 0 | Inter 14/400 | 24 |  | c03 | `td` |

### By colour: 2 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| none | --ink-soft | none | 104 | 64 | c03, c15 | `td` `w` `cust` `r` |
| none | --canvas | none | 48 |  | n37 | `ckc` `td` `r num` `num` |

## dialog or sheet (16)

### By size: 9 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| hidden | 14 | 0 | Inter 17/400 | 1 | 3 | n36, content, fleet | `cm` `npnl` `fl-menu fl-filt` `fl-menu fl-colm` |
| hidden | 12 | 0 | Inter 17/400 | 3 |  | n69, n12, n25 | `pop` `cm` `pop pnl` |
| hidden | 0 | 0 | Inter 17/400 | 2 |  | n73, n77 | `p` `det` |
| hidden | 18 | 0 | Inter 17/400 | 1 | 1 | (page shell) | `sheet` |
| hidden | 14 | 20 | Inter 17/400 | 1 |  | n39 | `dlg` |
| hidden | 0 | 18 | Inter 17/400 | 1 |  | n41 | `sh` |
| hidden | 12 | 14 | Inter 14/400 | 1 |  | c25 | `pop pk` |
| hidden | 14 | 14 | Inter 15/400 | 1 |  | n40 | `pv` |
| hidden | 16 | 0 | Inter 17/400 |  | 1 | fleet | `fl-sh` |

### By colour: 6 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| --paper-raised | --canvas | 1px --line + shadow | 6 |  | n69, n39, n12, n36, n25, c25 | `pop` `dlg` `cm` `pop pnl` `pop pk` |
| --paper-raised | --canvas | 1px --line-hi + shadow | 1 | 5 | (page shell), content, fleet | `sheet` `npnl` `fl-menu fl-filt` `fl-menu fl-colm` `fl-sh` |
| none | --canvas | none | 1 |  | n73 | `p` |
| --paper-raised | --canvas | none + shadow | 1 |  | n41 | `sh` |
| --paper-raised | --ink-soft | 1px --line + shadow | 1 |  | n40 | `pv` |
| --paper-raised | --canvas | none | 1 |  | n77 | `det` |

## tooltip (7)

### By size: 2 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| hidden | 7 | 9 | Inter 13/400 | 4 |  | n34, n49, n50, n51 | `tip` |
| hidden | 12 | 10 | Inter 13/400 | 3 |  | c17 | `pop cmp-tipbox` |

### By colour: 2 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| --canvas | --paper | none | 4 |  | n34, n49, n50, n51 | `tip` |
| --paper-raised | --ink-soft | 1px --line + shadow | 3 |  | c17 | `pop cmp-tipbox` |

## key (9)

### By size: 5 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| hidden | 5 | 5 | JetBrains Mono 11/500 | 4 |  | n36 | `kbd` |
| 19 | 5 | 6 | JetBrains Mono 11/500 | 2 |  | n12, n36 | `kbd` |
| 20 | 5 | 6 | JetBrains Mono 11/400 | 1 |  | (page shell) | `kbd` |
| hidden | 5 | 6 | JetBrains Mono 11/500 | 1 |  | n68 | `esc` |
| hidden | 5 | 6 | JetBrains Mono 11/400 |  | 1 | (page shell) | `kbd` |

### By colour: 2 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| --paper | --muted | 1px --line-hi | 6 |  | n12, n36 | `kbd` |
| --paper-raised | --muted | 1px --line-hi | 2 | 1 | (page shell), n68 | `kbd` `esc` |

## chip, pill, badge or tag (50)

### By size: 18 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| 24 | full | 6 | Inter 12/600 | 18 |  | n87, n88, n92, n53, n54, n55 | `chip` |
| 23 | full | 7 | JetBrains Mono 11/400 | 5 |  | numbers | `chip-sample` |
| 10 | 0 | 0 | JetBrains Mono 8/400 | 5 |  | data | `tag` |
| 22 | full | 8 | JetBrains Mono 11/500 | 4 |  | c15, c24, n24, n16 | `tag` `tag src w` |
| hidden | full | 6 | Inter 12/600 |  | 4 | n87 | `chip` |
| 19 | 4 | 6 | JetBrains Mono 10/400 | 2 |  | repo | `tag A` `tag D` |
| 27 | full | 9 | JetBrains Mono 11/400 | 1 |  | content | `badge` |
| 40 | 0 | 0 | Inter 17/400 | 1 |  | n64 | `pill` |
| 34 | 9 | 0 | Inter 17/400 | 1 |  | n48 | `pill` |
| 34 | 8 | 0 | Inter 17/400 | 1 |  | n20 | `pg-pill` |
| 19 | full | 8 | JetBrains Mono 10/600 | 1 |  | c17 | `cmp-badge` |
| 28 | 0 | 0 | Inter 17/400 | 1 |  | n70 | `chips` |
| 38 | 0 | 0 | Inter 17/400 | 1 |  | n71 | `pill` |
| 7 | full | 0 | Inter 17/400 | 1 |  | c08 | `badge` |
| 64 | 12 | 12 | Inter 17/400 | 1 |  | c23 | `rp-status` |
| hidden | 0 | 0 | Inter 15/400 |  | 1 | v-sent | `pill` |
| hidden | full | 8 | JetBrains Mono 11/500 |  | 1 | c15 | `tag` |
| hidden | 0 | 0 | Inter 17/400 |  | 1 | fleet | `fl-pill` |

### By colour: 12 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| RAW rgba(225, 74, 14, 0.09) | --accent-text | 1px RAW rgba(225, 74, 14, 0.25) | 18 | 4 | n87, n88, n92, n53, n54, n55 | `chip` |
| none | --canvas | none | 8 | 2 | n64, n70, n71, data, v-sent, fleet | `pill` `chips` `tag` `fl-pill` |
| --paper | --ink-soft | 1px --line | 4 | 1 | c15, c24, n24, n16 | `tag` `tag src w` |
| none | --dim | 1px --line-hi | 5 |  | numbers | `chip-sample` |
| RAW rgba(225, 74, 14, 0.09) | --accent-text | 1px RAW rgba(225, 74, 14, 0.22) | 1 |  | content | `badge` |
| --paper-raised | --canvas | none + shadow | 1 |  | n48 | `pill` |
| --canvas | --canvas | none | 1 |  | n20 | `pg-pill` |
| --accent | --paper | none | 1 |  | c17 | `cmp-badge` |
| --accent | --muted | none + shadow | 1 |  | c08 | `badge` |
| --paper | --canvas | 1px --line | 1 |  | c23 | `rp-status` |
| RAW rgba(63, 185, 80, 0.14) | RAW rgb(26, 127, 55) | none | 1 |  | repo | `tag A` |
| RAW rgba(248, 81, 73, 0.12) | RAW rgb(207, 34, 46) | none | 1 |  | repo | `tag D` |

## card (65)

### By size: 24 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| hidden | 12 | 16 | Inter 17/400 | 16 |  | c16, n72 | `xr-card` `card` |
| 13 | 0 | 0 | JetBrains Mono 10/600 | 8 |  | data | `card-t` |
| 70 | 12 | 14 | Inter 17/400 | 6 |  | c24 | `tl-card` |
| 30 | 0 | 0 | Inter 17/400 | 5 |  | stack | `card-top` |
| 200 | 14 | 26 | Inter 17/400 | 3 |  | why | `card lift why-card` |
| 263 | 14 | 26 | Inter 17/400 | 3 |  | numbers | `card lift stat` |
| 419 | 14 | 26 | Inter 17/400 | 3 |  | stack | `card lift b-2` |
| 70 | 11 | 12 | JetBrains Mono 11/500 | 2 |  | c27 | `fo-card c3` `fo-card c1` |
| 300 | 14 | 26 | Inter 17/400 | 2 |  | numbers | `card lift stat` |
| 357 | 14 | 26 | Inter 17/400 | 2 |  | stack | `card lift b-2` |
| 554 | 14 | 0 | Inter 17/400 | 2 |  | repo | `card fstyle is-in` |
| 433 | 14 | 0 | Inter 17/400 | 1 |  | top | `card route-card is-in` |
| 200 | 12 | 14 | Inter 17/400 | 1 |  | n54 | `card` |
| 312 | 12 | 16 | Inter 17/400 | 1 |  | n55 | `card` |
| 551 | 0 | 0 | Inter 17/400 | 1 |  | n11 | `card` |
| 330 | 0 | 0 | Inter 17/400 | 1 |  | n14 | `card` |
| 228 | 0 | 0 | Inter 17/400 | 1 |  | n31 | `card` |
| 73 | 12 | 12 | Inter 17/400 | 1 |  | n65 | `card` |
| 205 | 12 | 16 | Inter 17/400 | 1 |  | n80 | `card` |
| 71 | 11 | 12 | JetBrains Mono 11/500 | 1 |  | c27 | `fo-card c2` |
| 171 | 14 | 26 | Inter 17/400 | 1 |  | numbers | `card compare is-in` |
| 731 | 14 | 26 | Inter 17/400 | 1 |  | stack | `card lift b-hero` |
| 209 | 14 | 26 | Inter 17/400 | 1 |  | code | `card diff-legend is-in` |
| hidden | 14 | 0 | Inter 17/400 |  | 1 | stPage | `st-card` |

### By colour: 8 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| --paper-raised | --canvas | 1px --line + shadow | 23 |  | top, n54, n55, n72, n80, why, numbers, stack, code, repo | `card route-card is-in` `card` `card lift why-card` `card lift stat` `card compare is-in` `card lift b-hero` +3 |
| --paper-raised | --canvas | 1px --line | 16 | 1 | c16, n65, stPage | `xr-card` `card` `st-card` |
| none | --canvas | none | 16 |  | n11, n14, n31, data, stack | `card` `card-t` `card-top` |
| --paper | --canvas | 1px --line | 5 |  | c24 | `tl-card` |
| --paper-raised | --canvas | 1px RAW rgba(225, 74, 14, 0.4) | 1 |  | c24 | `tl-card` |
| --paper-raised | --muted | 1px --line-hi | 1 |  | c27 | `fo-card c3` |
| --paper | --muted | 1px --line-hi | 1 |  | c27 | `fo-card c2` |
| --paper-raised | --canvas | 1px --line-hi + shadow | 1 |  | c27 | `fo-card c1` |

## avatar (27)

### By size: 11 versions

| Height | Radius | Pad | Font | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|---|
| 36 | full | 0 | Inter 12/600 | 7 |  | n38, n86 | `av` |
| 32 | 9 | 0 | Inter 12/600 | 5 |  | c16 | `xr-av` |
| 34 | full | 0 | JetBrains Mono 12/500 | 5 |  | n22 | `av` |
| 34 | full | 0 | Inter 12/600 | 3 |  | n77 | `av` |
| 32 | full | 0 | Inter 12/600 | 1 |  | n96 | `av` |
| 30 | full | 0 | Inter 12/600 | 1 |  | n65 | `av` |
| 30 | full | 0 | Inter 11/600 | 1 |  | c09 | `av` |
| 28 | full | 0 | Inter 17/400 | 1 |  | n16 | `av` |
| hidden | full | 0 | Inter 11/600 | 1 |  | c25 | `av` |
| hidden | full | 0 | Inter 12/600 | 1 |  | n40 | `av` |
| hidden | full | 0 | Inter 13/600 |  | 1 | content | `av` |

### By colour: 4 versions

| Background | Text | Border | showcase | fossa (2) | Parts | Classes |
|---|---|---|---|---|---|---|
| --paper-sunk | --ink-soft | none | 15 |  | n96, n65, n22, n38, n40, n77 | `av` |
| --paper | --ink-soft | 1px --line | 5 |  | c16 | `xr-av` |
| --paper-sunk | --ink-soft | 1px --line | 5 |  | c09, n86, c25 | `av` |
| --paper-raised | --canvas | 1px --line-hi | 1 | 1 | n16, content | `av` |
