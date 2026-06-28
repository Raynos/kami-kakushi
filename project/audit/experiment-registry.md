# Battery — Experiment Registry

Which **lenses** the [`battery`](../../.claude/skills/battery/SKILL.md) skill has run, on what subject, when,
and where the findings landed. **Novelty rule:** every *full* battery must include **≥1 lens not yet run on
that subject** — this table is how we honour it. Seeded retroactively from the three ad-hoc batteries that
predate the skill. Append a row (or update `last run` + `report`) every time a lens runs.

Lens names are the canonical ones in the skill's lens menu. `subject` is what was attacked (a doc version, a
build tag). Re-running a lens on a **new** subject is fine and expected; re-running it on an **unchanged**
subject is what the novelty rule exists to prevent.

| Lens | Subject | Last run | Report |
|---|---|---|---|
| `doc-consistency` | PRD V2 | 2026-06-26 | [journal](../journal/2026-06-26-session-01-prd-battery-review.md) · raw `2026-06-26-prd-v2-audit-r1…r5` |
| `instruction-coherence` | PRD V2 | 2026-06-26 | [journal](../journal/2026-06-26-session-01-prd-battery-review.md) |
| `economy-arithmetic` | PRD V2 | 2026-06-26 | [journal](../journal/2026-06-26-session-01-prd-battery-review.md) |
| `persona-simulation` | PRD V2 | 2026-06-26 | [journal](../journal/2026-06-26-session-01-prd-battery-review.md) |
| `failure-state-walking` | PRD V2 | 2026-06-26 | [journal](../journal/2026-06-26-session-01-prd-battery-review.md) |
| `fun` | build v0.1 | 2026-06-27 | [state-of-the-game-2026-06-27](reports/state-of-the-game-2026-06-27.md) |
| `ui-polish` | build v0.1 | 2026-06-27 | [state-of-the-game-2026-06-27](reports/state-of-the-game-2026-06-27.md) |
| `prd-faithful` | build v0.1 | 2026-06-27 | [state-of-the-game-2026-06-27](reports/state-of-the-game-2026-06-27.md) |
| `readme-spirit` | build v0.1 | 2026-06-27 | [state-of-the-game-2026-06-27](reports/state-of-the-game-2026-06-27.md) |
| `human-feedback` | build v0.1 | 2026-06-27 | [state-of-the-game-2026-06-27](reports/state-of-the-game-2026-06-27.md) |
| `incremental` | build v0.1 | 2026-06-27 | [state-of-the-game-2026-06-27](reports/state-of-the-game-2026-06-27.md) |
| `laziness` | build v0.1 | 2026-06-27 | [state-of-the-game-2026-06-27](reports/state-of-the-game-2026-06-27.md) |
| `roadmap` | build v0.1 | 2026-06-27 | [state-of-the-game-2026-06-27](reports/state-of-the-game-2026-06-27.md) |
| `save-integrity` | build v0.1 | 2026-06-27 | [state-of-the-game-2026-06-27](reports/state-of-the-game-2026-06-27.md) — §7.1 residual-angle (a11y 100 / security cleared) |
| `fun` | build v0.2 | 2026-06-28 | [state-of-the-game-v0.2-2026-06-28](reports/state-of-the-game-v0.2-2026-06-28.md) |
| `ui-polish` | build v0.2 | 2026-06-28 | [state-of-the-game-v0.2-2026-06-28](reports/state-of-the-game-v0.2-2026-06-28.md) |
| `prd-faithful` | build v0.2 | 2026-06-28 | [state-of-the-game-v0.2-2026-06-28](reports/state-of-the-game-v0.2-2026-06-28.md) |
| `readme-spirit` | build v0.2 | 2026-06-28 | [state-of-the-game-v0.2-2026-06-28](reports/state-of-the-game-v0.2-2026-06-28.md) |
| `human-feedback` | build v0.2 | 2026-06-28 | [state-of-the-game-v0.2-2026-06-28](reports/state-of-the-game-v0.2-2026-06-28.md) |
| `incremental` | build v0.2 | 2026-06-28 | [state-of-the-game-v0.2-2026-06-28](reports/state-of-the-game-v0.2-2026-06-28.md) |
| `laziness` | build v0.2 | 2026-06-28 | [state-of-the-game-v0.2-2026-06-28](reports/state-of-the-game-v0.2-2026-06-28.md) |
| `roadmap` | build v0.2 | 2026-06-28 | [state-of-the-game-v0.2-2026-06-28](reports/state-of-the-game-v0.2-2026-06-28.md) |
| `rough-edges` | build v0.2 | 2026-06-28 | [state-of-the-game-v0.2-2026-06-28](reports/state-of-the-game-v0.2-2026-06-28.md) |
| `macro-gap` | build v0.2 | 2026-06-28 | [state-of-the-game-v0.2-2026-06-28](reports/state-of-the-game-v0.2-2026-06-28.md) |
| `test-integrity` | build v0.2 | 2026-06-28 | [state-of-the-game-v0.2-2026-06-28](reports/state-of-the-game-v0.2-2026-06-28.md) |
| `onboarding` | build v0.2 | 2026-06-28 | [state-of-the-game-v0.2-2026-06-28](reports/state-of-the-game-v0.2-2026-06-28.md) |

## Never yet run (candidate fresh lenses for the next full battery)

These satisfy the novelty rule out of the box — pick at least one next time:

- `ui-state-correctness` — every UI state renders right (loading / empty / error / boundary / overflow).
- `doc-consistency` **on a build** (only run on the PRD so far) — `docs/content/` generated-vs-source drift.
- `economy-arithmetic` **on a build** (only run on the PRD so far) — verify the live numbers, not the spec's.
- `persona-simulation` **on a build** — walk v0.2 as a concrete persona, not the PRD.
