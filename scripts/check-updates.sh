#!/usr/bin/env bash
# Check whether any pinned design tool has a newer version.
# It only reports. It never installs or moves a pin.
# Usage: bash ~/.claude/design/scripts/check-updates.sh
set -uo pipefail

STAMP="$HOME/.claude/design/.last-update-check"
say() { printf '%-22s %s\n' "$1" "$2"; }

echo "Pinned design tools, checked $(date +%Y-%m-%d)"
echo

say "GSAP" "pinned 3.15.0, newest $(npm view gsap version 2>/dev/null || echo '?')"
say "Hairline (npm)" "pinned 0.5.1, newest $(npm view @lucasmarkes/hairline version 2>/dev/null || echo '?')"

repo() {  # name, folder, pinned commit
  if [ ! -d "$2/.git" ]; then say "$1" "not cloned at $2"; return; fi
  git -C "$2" fetch -q origin 2>/dev/null || { say "$1" "could not reach GitHub"; return; }
  local head ahead
  head=$(git -C "$2" rev-parse --short origin/HEAD 2>/dev/null || git -C "$2" rev-parse --short origin/main)
  ahead=$(git -C "$2" rev-list --count "$3..$head" 2>/dev/null || echo '?')
  say "$1" "pinned ${3:0:7}, newest $head ($ahead new commits)"
}
repo "hairline-create" "$HOME/tools/hairline" 37d2e78dcb333ab30c3338e28ed4a690364ea014
repo "Anatomy" "$HOME/tools/anatomy" 1482e8469b0a9e0d8cc18ea2740a01423d29ae80
repo "Diagram Design" "$HOME/tools/diagram-design" 0cf73c3fcc56667ad91a9a04c439ac6ccfabc9d1
repo "GSAP skills" "$HOME/tools/gsap-skills" aed9cfd3277740755f6bfc1155c7aa645403b760
repo "Emil's skills" "$HOME/tools/emil-skills" a81dbca07f2217b7103e510c0f13f8d5b017afc9
repo "Three.js skills" "$HOME/tools/threejs-skills" 0e181866f095b5f06d005133876e926515390d95
repo "Lottie motion-design" "$HOME/tools/motion-design-skill" f9a8a041b85185ee4881b3471d3415e939aac772
repo "Design DNA" "$HOME/tools/design-dna" 593e39bc9e3652734653bd75544a333d7d43615e
repo "Motion principles" "$HOME/tools/design-motion-principles" 4a9ca879f24a361f4dca4174fe2da0f67b5ddee3

latest_archify=$(git ls-remote --tags --refs https://github.com/tt-a1i/archify 2>/dev/null | sed 's#.*refs/tags/##' | sort -V | tail -1)
say "Archify" "pinned v3.2.0, newest tag ${latest_archify:-?}"

date +%Y-%m-%d > "$STAMP"
echo
echo "Before moving any pin: read what changed, test it, then update the pin in"
echo "~/.claude/design/tools/ and scripts/check-updates.sh."
