#!/usr/bin/env bash
# ship-hygiene gate (D-067, extended for the D-075 variant harness; two-mode since D-138).
# The DEV tooling is split into two classes with different ship rules:
#
#   CLIENT-SIDE  (__qa play-API, DEV panel + variant harness, balance cockpit, F6 fixtures)
#     — pure client code that works on static hosting. During T0 it SHIPS into the prod
#       (gh-pages) bundle, default-OFF, opt-in via `?dev=yes` (D-138). Post-T0 it is stripped.
#   SERVER-COUPLED  (F8 telemetry, F3 playtest-capture overlay + its dev-server endpoint)
#     — POST to a dev server that does not exist on gh-pages. ALWAYS stripped from any bundle.
#
# The mode follows `SHIP_DEV_TOOLS` (same env vite.config.ts reads; default = ship, i.e. T0):
#   ship   → client markers MUST be PRESENT (proof the tools shipped), server markers ABSENT.
#   strip  → client markers ABSENT too (the hard post-T0 strip — the original D-067 gate).
# The *default-inert* behaviour (no `?dev=yes` ⇒ tools dormant) is proven by the RED-able
# resolveDevGating unit matrix (src/app/dev-gating.test.ts), which the gate can't grep for.
#
# Runnable standalone (`bash src/scripts/verify-dev-strip.sh`) and from gh-pages.sh / CI.
# Greps the freshly-built dist/assets/*.js for the sentinels; exit 1 on any violation.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ASSETS="$REPO_ROOT/dist/assets"

# ship mode unless SHIP_DEV_TOOLS is an explicit off value (mirrors vite.config.ts).
case "$(printf '%s' "${SHIP_DEV_TOOLS:-}" | tr '[:upper:]' '[:lower:]')" in
  0 | false | no | off) SHIP=0 ;;
  *) SHIP=1 ;;
esac

# __qa = the DEV play-API; __KAMI_DEV_PANEL__ = the variant harness; __KAMI_FIXTURES__ +
# a fixture name (fresh-R3-pre-wolf) = the F6 scenario-save registry + its committed envelopes
# (belt-and-braces: the name catches an emitted JSON chunk even if the sentinel were dropped);
# balance-override = the F7 balance-cockpit live-tuning setter (the string literal in
# __setBalanceLever's throw, which survives minification). __playtest-capture = the capture
# ENDPOINT string, which the shipped cockpit imports to offer "export to inbox" (its POST 404s
# inertly on gh-pages) — so it rides the client tools, present in ship / gone in strip.
CLIENT_MARKERS=("__qa" "__KAMI_DEV_PANEL__" "__KAMI_FIXTURES__" "fresh-R3-pre-wolf" "balance-override" "__playtest-capture")
# __KAMI_PLAYTEST_CAPTURE__ = the F3 capture-overlay DOM sentinel (+ its injected screenshot
# rasteriser); __KAMI_TELEMETRY__ = the F8 telemetry module. These are the true SERVER-COUPLED
# surfaces (a `` ` `` overlay / a session-end drop that POST to a dev server) — always stripped.
SERVER_MARKERS=("__KAMI_PLAYTEST_CAPTURE__" "__KAMI_TELEMETRY__")

present() { grep -lF "$1" "$ASSETS/"*.js >/dev/null 2>&1; }

fail_present() {
  echo "✗ SERVER-COUPLED DEV marker '$1' leaked into the prod bundle — refusing to deploy." >&2
  echo "  It POSTs to a dev-server endpoint absent on gh-pages; keep it behind 'import.meta.env.DEV'" >&2
  echo "  (src/app/main.ts mountCapture, src/telemetry/). D-138 scope." >&2
  exit 1
}

echo "▸ verifying DEV-tools ship hygiene (mode: $([ "$SHIP" = 1 ] && echo 'ship — T0' || echo 'strip — post-T0'))…"

# Server-coupled tools must ALWAYS be absent — in BOTH modes.
for marker in "${SERVER_MARKERS[@]}"; do
  present "$marker" && fail_present "$marker"
done
echo "  ✓ server-coupled DEV markers (telemetry / playtest-capture) absent."

if [ "$SHIP" = 1 ]; then
  # T0 ship: the client-side tools MUST be present (they ride the gh-pages build, default-off).
  for marker in "${CLIENT_MARKERS[@]}"; do
    if ! present "$marker"; then
      echo "✗ expected CLIENT DEV marker '$marker' MISSING from the T0 bundle." >&2
      echo "  T0 ships the client-side DEV tools into gh-pages (default-off, ?dev=yes) — D-138." >&2
      echo "  A missing marker means the ship gate broke; check __DEV_TOOLS__ in vite.config.ts." >&2
      exit 1
    fi
  done
  echo "  ✓ client-side DEV tools present (T0: shipped default-off, opt-in via ?dev=yes)."
else
  # Post-T0 hard strip: the client-side tools must be gone too (the original D-067 gate).
  for marker in "${CLIENT_MARKERS[@]}"; do
    if present "$marker"; then
      echo "✗ CLIENT DEV marker '$marker' leaked into the prod bundle — refusing to deploy." >&2
      echo "  Post-T0 strip mode: keep DEV-only code behind '__DEV_TOOLS__ && gating.*'" >&2
      echo "  (src/app/main.ts, src/ui/dev.ts)." >&2
      exit 1
    fi
  done
  echo "  ✓ no client-side DEV markers (__qa / variant harness / fixtures) in the prod bundle."
fi
