# Roadmap — milestone completion tracker (LIVING)

> **M0–M2b committed & verify-green; M3–M7 provisional, re-planned after each playtest** (per
> [D-021](history/decisions.md)). This is the **living** milestone tracker (the docs-explosion deliverable
> that the first M0/M1 build-and-play cycle was the trigger for). The full per-milestone **spec** stays in
> [`prd.md` §7.2](prd.md) (which is provisional for M2–M7 and revised by playtest); this file records **what
> is actually built** and **what's next**. Edit it in place as milestones land.

## Status at a glance

| Milestone | Status | Commit | What shipped |
|---|---|---|---|
| **M0** — toolchain + pure-core engine + full multi-backend save spine + cold open | ✅ **SHIPPED** | `8bf6ac9` | Vite+TS+Vitest+ESLint with the pure-core boundary; the one seeded RNG; `reduce`/`tick`; the reveal engine; IndexedDB+localStorage+sessionStorage redundant save with crash-recovery ring + safe-mode + poison-suppression + base64 export/import; the woodblock cold open. |
| **M1** — T0 Phase-1 labour spine | ✅ **SHIPPED** | `8bf6ac9` | Rung-meter R0→R2 (AND-gate), skills (discover-by-doing), the season clock, soft stamina, the **first nav reveal** (Work \| Skills), auto-repeat, the conditioning gate, the porter's-knot ZERO-bonus beat. |
| **M2a** — combat goes live at R3 | ✅ **SHIPPED** | `248bf93`, `fc36172` | The humbling grain-store wolf; the seeded auto-resolve sim; **sampled** win-rate forecasts (honest); character leveling; satiety throttle; self-recovering losses (no death-spiral). |
| **M2b** — bestiary / equipment / durability / gear loop | ✅ **SHIPPED (slice)** | `248bf93`, `fc36172` | The grounded bestiary (fills by encounter), equipment + **graded 4-band durability** + repair (wood sink), a 2nd weapon (the woodlot axe) earned at combat-Lv2, the foe forecasts + auto-fight. *Simplified vs the §7.2 spec:* the full loot-table → find→craft recipe loop is folded into a milestone grant for now — re-expand at M3/M5. |
| **M3a** — T0 R4→R7 (quests + crafting + stance/ability reveals) | ⏭ **NEXT** | — | Pre-split at the R6→R7 Phase-1/Phase-2 seam (D-Q-M3/M5-split). |
| **M3b** — the four-pillar **House Influence** Phase-2 grind + the hybrid gate → T0 complete | ⏳ provisional | — | The macro signature (家威) the demo does not yet show. |
| **M4** — T1 (the Valley) | ⏳ provisional | — | |
| **M5a / M5b** — T2 (the Region) incl. the Otsuru/Tama payoff | ⏳ provisional | — | |
| **M6** — balance + fun + perf gates; polish loop | ⏳ provisional | — | Promote the report-only fun-proxies to a gate; the ≥30-min floor regression; the perf gate. |
| **M7** — itch.io release | ⏳ provisional | — | A first itch-ready build already exists (`npm run build:itch`, content descriptors, build stamp); M7 is the deliberate release + the cross-origin-iframe save-survival test. |

## Demo (the shipped vertical slice)

The playable demo = **M0 + M1 + M2a + M2b** — a T0 slice: cold open → labour earns the kept-hand then
trusted-hand rungs (the estate + Skills ink in) → the humbling grain-store wolf (R3) → combat goes live
(forecasts, leveling, the woodlot axe, auto-fight). `npm run dev` to play; screenshots in [`audit/`](../audit/).

## The docs-explosion (D-020 / D-021) — partial, the rest queued

The first build-and-play cycle (M0/M1/M2) — the **trigger** for the one-time docs reorganisation — is
complete. Status of the reorg:

- ✅ **This `docs/roadmap.md`** — the living milestone tracker — created.
- ✅ **Generated content tables** under [`docs/content/`](content/) (e.g. `t0-content.md`, via
  `scripts/gen-docs.ts`, gate-checked by `gen:docs --check`). More tables generate as registries grow.
- ⏳ **Freeze §1 as a tagged vision snapshot** + retire the §7 roadmap detail into this file — **deferred**
  (a deliberate one-time move; `prd.md` stays the living spec until the human signs the freeze). The §4
  balance numbers stay "proposed v1 balance" in `prd.md` and re-tune by playtest until M6.
