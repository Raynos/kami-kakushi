#!/usr/bin/env bash
# ship-hygiene gate (D-067, extended for the D-075 variant harness): the DEV play-API
# (__qa — speed cheats + jump-to teleports) AND the DEV panel + variant harness (ui/dev.ts,
# stamped with DEV_SENTINEL = __KAMI_DEV_PANEL__) are gated on `import.meta.env.DEV` and
# dead-code-eliminated in prod. REFUSE to publish a bundle that leaked either — a shipped
# __qa hands players cheats, and a leaked variant harness ships the non-default UI variants
# (prod must ship ONLY the self-picked default — zero flag-debt, D-075). A deploy GATE that
# can't be forgotten.
#
# Runnable standalone (`bash src/scripts/verify-dev-strip.sh`) and from gh-pages.sh / CI.
# Greps the freshly-built dist/assets/*.js for the DEV sentinels; exit 1 on any leak.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "▸ verifying DEV tools + variant harness are stripped from the prod bundle…"
# __qa = the DEV play-API; __KAMI_DEV_PANEL__ = the variant harness; __KAMI_PLAYTEST_CAPTURE__ +
# __playtest-capture = the F3 playtest capture overlay + its dev-server endpoint (incl. its
# injected screenshot rasteriser, which rides in via the overlay module); __KAMI_FIXTURES__ +
# a fixture name = the F6 scenario-save registry + its committed envelopes (belt-and-braces: the
# name catches an emitted JSON chunk even if the sentinel were somehow dropped). All are gated on
# `import.meta.env.DEV` and must dead-code-eliminate from prod.
for marker in "__qa" "__KAMI_DEV_PANEL__" "__KAMI_PLAYTEST_CAPTURE__" "__playtest-capture" "__KAMI_FIXTURES__" "fresh-R3-pre-wolf"; do
  if grep -lF "$marker" "$REPO_ROOT/dist/assets/"*.js >/dev/null 2>&1; then
    echo "✗ DEV marker '$marker' leaked into the prod bundle — refusing to deploy." >&2
    echo "  Keep DEV-only code behind 'import.meta.env.DEV'" >&2
    echo "  (src/app/main.ts, src/ui/dev.ts, src/ui/capture.ts)." >&2
    exit 1
  fi
done
echo "  ✓ no DEV markers (__qa / variant harness / playtest capture) in the prod bundle."
