#!/usr/bin/env bash
# Run every design scanner on one page, a folder, or a served URL. It only reports.
# Usage: bash ~/.claude/skills/craft/scripts/scan.sh <file.html | folder | http://url>
# The scanners live in their plugins' folders (disabled plugins keep them).
set -u
T="${1:?give a page, a folder or a URL}"
C="$HOME/.claude/plugins/cache"
newest() { ls -d "$C/$1"/*/ 2>/dev/null | sort -V | tail -1; }

# The file scanners need a folder. A URL gets fetched; a single page is copied.
# Only the temp folder TMP is ever deleted; D may be the user's own folder.
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT; D="$TMP"
case "$T" in
  http*) curl -fsS "$T" -o "$D/page.html" || { echo "could not fetch $T"; exit 1; } ;;
  *) if [ -f "$T" ]; then cp "$T" "$D/"; else D="$T"; fi ;;
esac

A=$(newest auteur/auteur)
echo "== slopscan (auteur ${A:+$(basename "$A")})"
if [ -n "$A" ]; then node "$A/scripts/slopscan.mjs" "$D" | tail -40; else echo "skipped: auteur not found"; fi

G=$(newest genjutsu/genjutsu)
echo; echo "== design-audit tells (genjutsu ${G:+$(basename "$G")})"
if [ -n "$G" ]; then
  # Fired tells and their file:line hits; drops the passing and "did not run" lines.
  python3 "$G/skills/_jutsu/design-audit/scripts/audit.py" "$D" \
    | awk '/^### Tells/{t=1} /^\*\*.*checked/{print} t&&/^\*\*.*\(tell-/{print} t&&/^- `/{print} /^### /&&!/Tells/{t=0}' | head -40
else echo "skipped: genjutsu not found"; fi

H=$(ls -d "$HOME/.claude/skills/hue" "$HOME/.claude/skills/hue.disabled" 2>/dev/null | head -1)
echo; echo "== validate (hue): undefined vars, dead classes, leftovers"
if [ -n "$H" ]; then
  V=$(mktemp -d); f=$(ls "$D"/*.html 2>/dev/null | head -1)
  if [ -n "$f" ]; then
    cp "$f" "$V/preview.html"; out=$(node "$H/scripts/validate.mjs" "$V")
    # Undefined vars and leftovers in full; dead classes as a count (many are added by script).
    echo "$out" | grep -E 'ERROR\] (css-vars|placeholders|todo|lorem)'
    n=$(echo "$out" | grep -c 'css-orphans'); [ "$n" -gt 0 ] && echo "$n CSS classes with no element in the HTML (check script-added ones first):" && echo "$out" | grep 'css-orphans' | grep -oE 'class "[^"]+"' | head -12 | tr '\n' ' ' && echo
  fi
  rm -rf "$V"
else echo "skipped: hue not found"; fi

I=$(newest impeccable/impeccable)
echo; echo "== impeccable detect (${I:+$(basename "$I")}), count per kind, then one example of each"
case "$T" in http*) echo "(URL: rendered check at 1440 and 390)";; *) echo "(file: static check only; pass an http URL for the rendered check)";; esac
if [ -n "$I" ]; then
  out=$("$I/skills/impeccable/scripts/impeccable" detect "$T" 2>&1)
  case "$T" in http*) out="$out
$("$I/skills/impeccable/scripts/impeccable" detect "$T" --viewport 390x844 2>&1)";; esac
  echo "$out" | grep -oE '^\s+\[[a-z0-9-]+\]' | sort | uniq -c | sort -rn
  echo "$out" | awk 'match($0,/^ +\[[a-z0-9-]+\]/){k=substr($0,RSTART,RLENGTH); if(!seen[k]++) print}'
else echo "skipped: impeccable not found"; fi

echo; echo "Check every finding against ~/.claude/skills/craft/house.md before fixing it."
