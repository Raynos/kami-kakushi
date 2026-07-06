// The two-axis DEV-tools gate (D-138). Splits "is the code in the bundle"
// (build-time `__DEV_TOOLS__`, tree-shaking) from "is it active" (this runtime fn).
//
// Two independently-gated surfaces:
//  - `qa`    — the `__qa` play-API + F6 fixtures (+ `?fixture=` boot). In a DEV
//              SERVE build it stays on even under `?dev=no`, because e2e/agents
//              drive the game through `__qa` (see e2e/helpers.ts — a hard
//              requirement). In a T0 PROD bundle it's default-OFF, opt-in `?dev=yes`.
//  - `panel` — the visible DEV panel + D-075 variant harness + balance cockpit.
//              DEV serve: default-on, `?dev=no` opts out. T0 prod: default-off,
//              `?dev=yes` opts in.
//
// Pure so the full truth table is unit-testable — this is the RED-able proof that
// a T0 prod bundle is default-INERT (no `?dev=yes` ⇒ both false), which the
// dev-server e2e lane structurally can't reach (it always runs with DEV=true).

const DEV_OFF = /[?&]dev=(?:no|0|false|off)\b/i;
const DEV_ON = /[?&]dev=(?:yes|1|true|on)\b/i;

export interface DevGating {
  /** install `__qa` + fixtures + honour the `?fixture=` boot param */
  qa: boolean;
  /** mount the DEV panel + variant harness + balance cockpit */
  panel: boolean;
}

/** Resolve the runtime DEV-tools gate.
 *  @param isDev    `import.meta.env.DEV` — true only in a dev-serve build.
 *  @param hasTools `__DEV_TOOLS__` — whether the tool code is in this bundle at all.
 *  @param search   `window.location.search` (the query string, leading `?` and all). */
export function resolveDevGating(isDev: boolean, hasTools: boolean, search: string): DevGating {
  if (!hasTools) return { qa: false, panel: false };
  const off = DEV_OFF.test(search);
  const on = DEV_ON.test(search);
  return {
    qa: isDev || on,
    panel: isDev ? !off : on,
  };
}
