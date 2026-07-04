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
for marker in "__qa" "__KAMI_DEV_PANEL__"; do
  if grep -lF "$marker" "$REPO_ROOT/dist/assets/"*.js >/dev/null 2>&1; then
    echo "✗ DEV marker '$marker' leaked into the prod bundle — refusing to deploy." >&2
    echo "  Keep DEV-only code behind 'import.meta.env.DEV' (src/app/main.ts, src/ui/dev.ts)." >&2
    exit 1
  fi
done
echo "  ✓ no DEV markers (__qa / variant harness) in the prod bundle."
