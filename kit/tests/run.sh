#!/bin/bash
# Tests for verify.mjs: it must pass the house pieces and fail known mistakes. Run after any change to verify.mjs or a card.
#   bash kit/tests/run.sh
set -u
K="$(cd "$(dirname "$0")/.." && pwd)"; T="$(mktemp -d)"; fail=0
S="$K/cards/table/table.starter.html"
node "$K/tools/accent.mjs" "#0f766e" -o "$T/teal.css" 2>/dev/null
python3 - "$S" "$T" <<'PY'
import sys; s=open(sys.argv[1]).read(); t=sys.argv[2]
def put(name, extra): open(f"{t}/{name}.html","w").write(s.replace("</head>", "<style>"+extra+"</style>\n</head>",1))
put("teal", open(f"{t}/teal.css").read())
put("mono-header", '.tbl th{font-family:"JetBrains Mono";text-transform:uppercase;letter-spacing:.1em}')
put("typed-colour", '.tbl .tbl-st[data-s="done"]::before{background:#2563eb}')
put("no-hover", '.tbl tbody tr:hover{background:none}.tbl tbody tr{transition:none}')
put("no-focus", ".kit .b:focus-visible, .kit .b:focus, .tbl button:focus-visible, .tbl input:focus-visible, :focus-visible { outline: none !important; box-shadow: none !important; }")
put("height-anim", '.tbl .tbl-foot{transition:height .3s}')
put("busy-loop", '@keyframes zz{to{transform:rotate(1turn)}} .zz{visibility:hidden;animation:zz 1s linear infinite}')
s2=s.replace('<body class="kit">','<body class="kit"><i class="zz"></i>',1); open(f"{t}/busy-loop.html","w").write(s2.replace("</head>", '<style>@keyframes zz{to{transform:rotate(1turn)}} .zz{display:block;width:4px;height:4px;visibility:hidden;animation:zz 1s linear infinite}</style>\n</head>',1))
PY
check() { # name mode expect(PASS|FAIL) file
  out=$(node "$K/verify.mjs" "$4" --$2 $( [ "$2" = card ] && echo table ) 2>&1 | tail -1)
  if [[ "$out" == $3* ]]; then echo "ok    $1 ($2): $out"; else echo "WRONG $1 ($2): wanted $3, got: $out"; fail=1; fi
}
check "house starter"       house PASS "$S"
check "card starter"        card  PASS "$S"
check "teal accent"         house PASS "$T/teal.html"
check "teal accent"         card  PASS "$T/teal.html"
check "mono header"         card  FAIL "$T/mono-header.html"
check "typed colour"        house FAIL "$T/typed-colour.html"
check "typed colour"        card  FAIL "$T/typed-colour.html"
check "no row hover"        card  FAIL "$T/no-hover.html"
check "no focus ring"       house FAIL "$T/no-focus.html"
check "height animates"     house FAIL "$T/height-anim.html"
check "hidden busy loop"    house FAIL "$T/busy-loop.html"
rm -rf "$T"; [ $fail = 0 ] && echo "all tests pass" || { echo "SOME TESTS ARE WRONG"; exit 1; }
