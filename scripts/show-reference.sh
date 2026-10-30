#!/usr/bin/env bash
# Open a page from this folder in Chrome, served on localhost.
# Usage: bash ~/.claude/design/scripts/show-reference.sh [showcase|components|parts|<path>] [#section]
#   bash ~/.claude/design/scripts/show-reference.sh                    -> the showcase (every part)
#   bash ~/.claude/design/scripts/show-reference.sh showcase delivery  -> its story timeline
#   bash ~/.claude/design/scripts/show-reference.sh components         -> every small part, in our tokens
#   bash ~/.claude/design/scripts/show-reference.sh parts              -> the 29 interactive parts
set -euo pipefail

DIR="$HOME/.claude/design"
PORT=8766
case "${1:-showcase}" in
  showcase)   PAGE="components/showcase/index.html" ;;
  components) PAGE="components/preview.html" ;;
  parts)      PAGE="components/interactive.html" ;;
  *)          PAGE="$1" ;;
esac
HASH="${2:+#$2}"

# One server for the whole design folder, so every page shares one port.
if ! curl -sf -o /dev/null "http://localhost:$PORT/$PAGE"; then
  if lsof -ti "tcp:$PORT" >/dev/null 2>&1; then
    echo "Port $PORT is busy with another server. Stop it, then run this again: kill \$(lsof -ti tcp:$PORT)" >&2
    exit 1
  fi
  (cd "$DIR" && nohup python3 -m http.server "$PORT" >/dev/null 2>&1 &)
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    curl -sf -o /dev/null "http://localhost:$PORT/$PAGE" && break
    sleep 0.3
  done
fi

open -a "Google Chrome" "http://localhost:$PORT/$PAGE$HASH"
echo "Showing http://localhost:$PORT/$PAGE$HASH"
