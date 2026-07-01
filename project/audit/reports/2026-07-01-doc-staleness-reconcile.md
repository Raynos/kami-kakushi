# Doc-staleness reconcile — PRD & roadmap vs the v0.3.1 build

**Date:** 2026-07-01 · **Trigger:** human worry that the PRD and roadmap went
stale during the v0.3.0 → v0.3.1 build, with the source of truth now living in
`src/`. **Method:** three parallel fresh-eyes sweeps (ADRs+journals / PRD+roadmap
/ the `src` pure core), then every sharp finding **re-verified by hand against the
code and the actual files** (R2 — the agents are makers too; one had mislabeled
`roadmap.md` as the PRD).

## Headline

**The worry is largely unfounded — the docs are NOT broadly stale.** The v0.3.1
build's design record was rippled as it went:

- **The ADR log (`decisions.md`) is current.** Every v0.3.1 change is captured —
  D-076 (HP-attrition combat), D-090 (carried-vs-banked loss bite), D-091 (two
  auto-modes), D-092 (koku sinks / E4 / repair fee), D-093 (spatial map), D-094
  (judge cadence), D-095 (T0 material surplus = WAI). All human-primed 2026-06-30.
- **PRD §4 (`prd/04-combat-balance.md`) is current.** It already carries dedicated
  subsections for the rework: **§4.6.6b** (accumulating HP + two auto-modes),
  **§4.6.6c** (kura storehouse — carried vs banked), **§4.6.6d** (T0 koku sinks,
  `REPAIR_KOKU_COST`, the **E1–E4** ladder), and **§4.2.2** (D-094 judge-cadence
  decouple). The earlier "banking/retreat absent from the PRD" impression was an
  artifact of reading `roadmap.md` mislabeled as the PRD.
- **Roadmap tier scope is accurate.** T0-M1…M4 ✅ shipped; all of T1/T2 🆕; T3 ⏳
  coarse — which matches the code (T0 fully built, T1+ skeleton only).

So the reconciliation surface is **narrow**, not a rewrite.

## Confirmed drift (fixed this pass)

All in `roadmap.md`'s "Already SHIPPED" carry-forward prose — pre-v0.3.1 text that
the light-touch roadmap ripple (which did add the D-076/D-077 markers on
T0-M2/M4) missed. All provisional narrative, cleared to fix under D-021/D-059:

| # | Loc | Was | Now (matches code + PRD §4.6.6d) |
|---|-----|-----|-----|
| 1 | `roadmap.md:73` | "repair (wood sink)" | repair = wood + a soft koku fee (D-092) |
| 2 | `roadmap.md:106` | "repair wood-sink" | repair = wood + soft koku fee (D-092) |
| 3 | `roadmap.md:123` | "E1→E3 yield-bearing upgrades" | **E1→E4** (E4 long-house added v0.3.1, D-092) |

## Surfaced for the human (NOT auto-resolved)

Two genuine judgment calls — filed as **H12** and **H13** in
[`../../human-in-the-loop/decisions.md`](../../human-in-the-loop/decisions.md):

- **H12 · Version reconciliation. → RESOLVED (D-096, 2026-07-01).** Three version
  numbers disagreed, and the *actual* single source (git tags → `__VERSION__`,
  the game footer) said the oldest one: the built game showed **v0.2**
  (`git describe` off tags `v0.1`, `v0.2` — the build was **never tagged
  v0.3.x**); `package.json` said **0.3.0** (read by nothing for display);
  docs/journals said **v0.3.1** (pure convention, no code anchor) — the A21
  single-source violation in full. **Human call:** single-source the displayed
  version from **`package.json`** (→ 0.3.1); git tags are never read by the
  game/HTML/TS. `vite.config.ts` rewired; footer now shows `v0.3.1`.

- **H13 · E-stage numbering collision.** Two E-stage schemes now overlap. Design
  canon (§1.5.1/§4.7.5/§7): a *condition* ladder **E0 Foreclosure's Edge → E3
  Prosperous**, with **E4–E5 parked for T4+**. Code + §4.6.6d: an *upgrade-
  purchase* ladder **E1–E4** (100/300/700/1400 koku), where v0.3.1 added a T0
  **E4 "long-house."** So a code-E4 now lives in T0 while §7:86/§7:118 still say
  "E4–E5 parked for T4+" — an internal PRD inconsistency. Is the code's T0 E4 the
  same object as the parked design E4, or a same-number-different-thing that needs
  disambiguating? Design-canon call, left for the human.

## Not touched (verified NOT stale)

- PRD §4.6.6b/c/d, §4.2.2 — the v0.3.1 combat/bank/economy/judge locks (current).
- The **condition-stage** E0→E3 refs in §2:1109, §4:115/1305, §7:86/118 — a
  *different axis* from the code's upgrade ladder; only their overlap with the new
  code-E4 is the open question (H2 above), not the refs themselves.
- Roadmap T1/T2/T3 milestone scope — accurate vs the (unbuilt) code.
