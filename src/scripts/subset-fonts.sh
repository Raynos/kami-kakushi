#!/usr/bin/env bash
# subset-fonts.sh — vendor the two characterful OFL faces as subset .woff2.
#
# This is a MANUAL / one-time step (network + fonttools): it cannot live in the code
# diff because it produces binary assets. The @font-face rules in src/ui/styles.css
# reference the outputs below; until they exist the faces silently fall back to the
# system Mincho stack (font-display:swap, no FOIT) — harmless, just lower fidelity.
#
# Requirements:
#   pip install fonttools brotli
# Source TTFs (SIL OFL 1.1 — ship OFL.txt alongside the woff2):
#   Shippori Mincho B1 ExtraBold  — github.com/google/fonts (ofl/shipporiminchob1)
#   Yuji Syuku Regular            — github.com/google/fonts (ofl/yujisyuku)
#
# MAINTENANCE COUPLING: $GLYPHS is the union of every CJK glyph the game renders
# (all content kanji fields + render.ts literals). Adding new content kanji means
# re-running this script, else that glyph falls back to system Mincho. For
# additions-safety you may instead subset the full Jōyō range (~2,136 kanji,
# ~150-250KB/face) by adding its unicode ranges to --unicodes.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/src/ui/fonts"
mkdir -p "$OUT"

# the 32-kanji + し union the UI renders today
GLYPHS="神隠し黒沢家技武春夏秋冬日雇下人手代門番天秤棒斧農採樵鍛狼猿猪野伏"

SRC_SHIPPORI="${SRC_SHIPPORI:-ShipporiMinchoB1-ExtraBold.ttf}"
SRC_YUJI="${SRC_YUJI:-YujiSyuku-Regular.ttf}"

if ! command -v pyftsubset >/dev/null 2>&1; then
  echo "error: pyftsubset not found — run 'pip install fonttools brotli' first." >&2
  exit 1
fi

pyftsubset "$SRC_SHIPPORI" \
  --output-file="$OUT/shippori-mincho-b1-800-subset.woff2" \
  --flavor=woff2 --layout-features='*' \
  --unicodes="U+0000-00FF,U+3000-303F,U+3040-30FF,U+FF00-FFEF" \
  --text="$GLYPHS"

pyftsubset "$SRC_YUJI" \
  --output-file="$OUT/yuji-syuku-400-subset.woff2" \
  --flavor=woff2 --layout-features='*' \
  --unicodes="U+0000-00FF,U+3000-303F,U+3040-30FF" \
  --text="$GLYPHS"

echo "wrote subset woff2 to $OUT (remember to add OFL.txt)"
