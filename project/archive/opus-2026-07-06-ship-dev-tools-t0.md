# Ship client-side DEV tools into the T0 gh-pages bundle (default-off, `?dev=yes`)

**Status:** ✅ DONE — all 6 steps landed & verified in `bd33887` (2026-07-06,
opus session). Archived to `project/archive/`.
**Locks:** human answered the two direction forks via AskUserQuestion (2026-07-06):
scope = **client-side tools only**; strip-gate = **invert under a T0 build flag +
ADR**. Recorded as **ADR-138**.

## Who builds this — Fable or Opus?

**Opus, whole thing.** This is build-shape + ship-hygiene surgery that reverses a
documented invariant (ADR-067 / `verify-dev-strip.sh`) and touches the composition
root's DCE gating — judgment concentrates in getting the tree-shaking soundness
right (a wrong gate ships cheats to players or breaks e2e). No mechanical bulk to
farm to a cheaper tier.

## Goal

During **T0**, the prod (gh-pages) build ships the **client-side** DEV tools
_inside_ the binary but **default-hidden / inert**; `?dev=yes` reveals them. Local
dev keeps today's behaviour (tools on by default, `?dev=no` opts out). Post-T0 a
single build flag flips back to the hard strip.

**In scope (ship into gh-pages):** the `__qa` play-API, the DEV panel + variant
harness (ADR-075), the balance cockpit, and the FB-6 scenario fixtures (+ `?fixture=`
boot param). All pure client-side — they work on static hosting.

**Out of scope (stay stripped):** FB-8 telemetry and the FB-3 playtest-capture overlay
— both POST to **dev-server** endpoints that don't exist on gh-pages, so shipping
them is dead weight. They remain gated on `import.meta.env.DEV`.

## The two-axis model

Today `import.meta.env.DEV` conflates _"is the code in the bundle"_ with _"is it
active"_. Split them:

- **Inclusion (build-time, tree-shaking):** a new `__DEV_TOOLS__` define — `true`
  in dev serve always, and in a `vite build` when `SHIP_DEV_TOOLS` is not
  disabled (default = enabled during T0). Post-T0: set `SHIP_DEV_TOOLS=0` → the
  prod build defines `__DEV_TOOLS__ = false` → the client-side tools DCE away, the
  strip is restored.
- **Activation (runtime):** a pure `resolveDevGating(isDev, hasTools, search)`
  returning `{ qa, panel }`:
  - `!hasTools` ⇒ both `false` (nothing shipped).
  - `qa` (the `__qa` API + fixtures + `?fixture=`): `isDev || ?dev=yes`. In dev
    serve `__qa` stays on even under `?dev=no` (e2e/agents drive through it — a
    hard requirement, see `e2e/helpers.ts`). In a T0 prod bundle it needs
    `?dev=yes`.
  - `panel` (the visible DEV panel + variant harness): dev serve default-on,
    `?dev=no` opts out; T0 prod default-off, `?dev=yes` opts in.

`?dev=` aliases: OFF = `no|0|false|off`, ON = `yes|1|true|on` (mirrors the
existing off-set).

## Steps

1. **`resolveDevGating` pure fn + unit test** — extract the gating matrix into a
   pure, exported function and unit-test the full truth table (this is the
   RED-able _behavioural_ proof of "default-inert in prod", which the dev-server
   e2e lane structurally cannot reach since it always runs with `DEV=true`).
2. **`vite.config.ts`** — `SHIP_DEV_TOOLS` env (default on) →
   `__DEV_TOOLS__: JSON.stringify(command === 'serve' || SHIP_DEV_TOOLS)` define.
3. **`vite-env.d.ts`** — `declare const __DEV_TOOLS__: boolean;`.
4. **`src/app/main.ts`** — rewire: compute `{ qa, panel }` once at boot; gate the
   `__qa`/cockpit/fixtures/panel block on `__DEV_TOOLS__ && qa` (panel sub-gated
   on `dev`); leave telemetry + `mountCapture` on `import.meta.env.DEV`.
5. **`verify-dev-strip.sh`** — parametrise on `SHIP_DEV_TOOLS`: server markers
   (`__KAMI_TELEMETRY__`, `__KAMI_PLAYTEST_CAPTURE__`, `__playtest-capture`)
   **always** ABSENT; client markers (`__qa`, `__KAMI_DEV_PANEL__`,
   `__KAMI_FIXTURES__`, `fresh-R3-pre-wolf`, `balance-override`) PRESENT in T0
   (ship mode), ABSENT post-T0. Keeps the gate sound in both directions.
6. **ADR ADR-138** in `decisions.md` (refines/limits ADR-067 for T0).

## Soundness / risks

- **Cheat leak:** the whole point of the runtime `qa`/`panel` gate — a plain
  gh-pages visitor (no `?dev=yes`) gets `{ qa:false, panel:false }`; no `__qa`
  installed, no panel. Proven by the `resolveDevGating` unit matrix.
- **e2e:** dev-serve `?dev=no` keeps `__qa` (qa = `isDev || …` = true). Unchanged.
- **Tree-shaking post-T0:** `__DEV_TOOLS__` folds to `false` ⇒ `if (false && …)`
  and `false && … ? … : undefined` both DCE. The strip gate re-asserts ABSENT.
- **Bundle size:** gh-pages grows by the client-tool code during T0 — accepted,
  it's a T0-only convenience for live review on the deployed build.
