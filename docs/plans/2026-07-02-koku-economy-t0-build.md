# Plan B — the koku/coin/rice economy T0 build (to v0.3.2)

**Status:** 🆕 spec ready. **⛔ BLOCKED until Plan A lands** (the PRD ripple —
[`2026-07-02-koku-ripple-docs.md`](2026-07-02-koku-ripple-docs.md)). The PRD is the
source of truth this code implements; building before the docs are re-canonised
would re-diverge them.

**For:** a separate agent to execute after Plan A. **Model:** see
[`2026-07-02-economy-koku-rediagnosis.md`](2026-07-02-economy-koku-rediagnosis.md)
§9–§14 (locked decisions). This plan realises the model in the **T0 slice up to the
current v0.3.2 milestone** — no new tiers.

> **⚠️ Shared-tree coordination.** Another agent is actively editing
> `src/ui/render.ts` + `src/ui/styles.css` (intro rebuild / multi-panel). Phases 1
> and 3 touch `render.ts` heavily → **high collision risk.** Coordinate before
> starting the render-layer edits (or land the pure-core phases first and batch the
> render changes when their WIP settles). Stage only your own files by path.

---

## Model recap (what the code must express)

- `resources` holds **`coin`** (base unit mon) + **`rice`** + `wood` + `sansai`.
  **`koku` leaves `resources` entirely.**
- **koku = the House's standing** = the existing `influence.estate` pillar,
  re-labelled and surfaced as "N koku" (a score; never spent).
- Labour yields **rice (+ a little coin)**; costs (market/estate/repair) and the
  loss-bite are **coin**; the kura shelters **coin + rice**.
- Coin renders in mixed **mon→monme→ryō** (1 ryō = 50 monme = 4,000 mon; 1 monme =
  80 mon), higher denominations revealed incrementally.

---

## Code surface map (what each file needs)

| File | Change |
|---|---|
| `core/constants.ts` | `SCHEMA_VERSION` 4 → **5** |
| `core/content/balance.ts` | `REPAIR_KOKU_COST`→`REPAIR_COIN_COST`; `LOSS_KOKU_FRAC`→`LOSS_COIN_FRAC`; `RICE_PER_RAKE` kept (now truly rice); add coin-denomination rate consts + rice season-price consts |
| `core/state.ts` | `resources: { koku: 0 }` → `{ coin: 0, rice: 0 }`; koku no longer a resource (standing lives in `influence`) |
| `core/content/activities.ts` | `LabourResource` `'koku'`→`'rice'\|'coin'`; re-map yields (paddy→rice; haul→coin wage; forage→sansai+coin; deep→more) |
| `core/intents.ts` | rake credits **`rice`** (`withResource(...,'rice',RICE_PER_RAKE)`); repair/loss/deposit/withdraw use **`coin`**; add `eat_rice` + `sell_rice` intents (Phase 2) |
| `core/content/coldOpen.ts` | `rakeLine` "+N koku" → "+N rice" |
| `core/content/market.ts` | `kokuCost`→`coinCost`; `canBuy` reads `resources.coin`; add a **sell-rice** entry/action |
| `core/content/estate.ts` | `kokuCost`→`coinCost` (U1–U4) |
| `core/content/ranks.ts` | Phase 5: add status-token rewards (surname → …) to `rewardOnReach` |
| `core/pillars.ts` / `selectors.ts` | expose koku **standing** number + grade for the UI; `seasonalJudge` unchanged (it now *is* the re-assessment) |
| `core/format.ts` | add `formatCoin(mon)` — mixed mon/monme/ryō with incremental reveal |
| `ui/render.ts` | reconcile `RESOURCE_LABEL`/`RES_WORD`/`readout-rice`; **rice pill + coin pill**; kura shows coin+rice; coin uses `formatCoin`; standing panel reads "N koku (GRADE)" |
| `persistence/migrate.ts` | add v4→v5 (below) |
| `scripts/gen-docs.ts`, `scripts/verify-content.ts`, `scripts/verify-prd.ts` | flow the renames through; regenerate `docs/content/*` |

---

## Phases (each independently shippable + revertible)

### Phase 1 — `koku → coin` rename + rice key (pure re-denomination)
The safe first step: the game plays **identically**, just honestly named.
- Rename the currency to `coin` everywhere it's spent/carried/banked/lost; add the
  `rice` resource key. Labour that today credits koku now credits **rice** (rake,
  paddy) or **coin** (haul wage) per the activities re-map.
- Reconcile the UI label mess: header **rice** pill + **coin** pill; the
  `readout-rice` surface now genuinely means rice; fix `RESOURCE_LABEL` +
  `RES_WORD`.
- **Migration v4→v5** (`migrate.ts`): map old `resources.koku`→`resources.coin`,
  `banked.koku`→`banked.coin`, add `rice: 0`. *(D-067 wipes pre-launch saves, so a
  wipe is also acceptable — but ship the real forward path.)*
- **Tests:** update `economy.test.ts`, `m1.test.ts`, `t0-arc.test.ts`,
  `coldOpen`/`intents` refs, `invariants.test.ts`, `playcheck.ts`, `save.test.ts` /
  `migrate.test.ts`, `render.test.ts`, `dev.test.ts`. Each must still be able to go
  RED (assert the new resource keys, not copied magic numbers — derive from
  `balance`).
- **Gate:** `gen:docs` regenerates `docs/content/*` (koku→rice/coin);
  `verify-content` + `verify-prd` green.

### Phase 2 — rice as a real resource (eat / store / sell)
- `eat_rice` intent: rice → satiety (a light path beside cook/sansai).
- `sell_rice` intent + a market **sell** action: rice → coin at a **season-swinging
  price** (`rice season-price` fn of `selectors.season`; autumn glut cheap, spring
  dear). Store = the existing kura (`banked.rice`).
- Re-tune labour yields + prices so the sell/hold decision is real but not fussy
  (liquid — `npm run pacing`).
- **Tests:** rice eat/sell reducers; season-price monotonic direction; kura stores
  rice.

### Phase 3 — mixed-denomination coin formatter
- `format.ts`: `formatCoin(mon)` → `"12 ryō, 40 monme, 20 mon"`, rates 1 ryō = 50
  monme = 4,000 mon (1 monme = 80 mon). **Incremental reveal:** hide the monme
  column until wealth ≥ 1 monme, ryō until ≥ 1 ryō.
- `render.ts`: the coin pill uses `formatCoin` (replaces `formatKMB` for coin; keep
  K/M/B for the koku standing score).
- **Tests:** `format.test.ts` — boundary cases (499 mon, 500 mon→"6 monme 20 mon",
  4,000→"1 ryō", incremental reveal thresholds).

### Phase 4 — re-skin House Influence as the koku **standing**
- Surface `influence.estate.value` as **"The House stands at N koku"** + the grade
  sub-label; name the far ceiling (10,000 = daimyō). Presentation over the existing
  pillar engine — **no macro-engine change.**
- `seasonalJudge` stays (it *is* the seasonal re-assessment). Add a light **"the
  assessors arrive"** beat at the T0→T1 ascension (a bigger re-assessment log
  moment); full per-tier event system is later.
- **Tests:** the standing readout reflects the pillar; grade bands unchanged
  (reuse `ESTATE_BANDS`).

### Phase 5 — status-token rank rewards
- Add visible tokens to `ranks.ts` `rewardOnReach`: the **surname** beat (~R1/kept
  on), reserving swords/gōshi for their tiers (T3/T4 — out of T0 scope, but wire the
  first token). Content + a flag; the abstract R0–R7 meter stays under the hood.
- **Tests:** the token flag/log fires on the right promotion.

---

## Out of scope for T0 / v0.3.2 (parked for their tiers)
- **T5 Office / court-rank / favour parallel track** (build at the Edo tier).
- **Bought-rank ("kaneage zamurai")** (needs the favour axis — T2+).
- **Personal koku stipend** (T4+; koku stays House-only here).
- **Village collective-liability / murahachibu, factional escalation, Tenmei
  famine** (T2+ social layer — see the social/political research brainstorm).
- The full per-tier **assessors event** system (Phase 4 ships only a T0→T1 stub).

---

## Migration & DoD

**Migration:** v4→v5 as above; keep the raw pre-migration backup (SaveManager). No
status-axis migration needed (`influence`, `rungMeter`, skills, attrs untouched —
only koku's *home* moves from `resources` to standing, and its *display noun*).

**DoD (R3 — could-have-gone-RED):**
- Raking spilled rice grants **rice**, and the log reads **"(+N rice)"** — the
  original bug is gone; no code path credits `koku` from labour.
- Header shows distinct **rice** + **coin** pills; coin renders in mon/monme/ryō
  with incremental reveal; the standing panel reads **"N koku"**.
- Market/estate/repair charge **coin**; a lost fight bites **carried coin** (+ rice/
  materials); **koku standing never drops** on a loss.
- `gen:docs` output + `verify-content` + `verify-prd` + full `npm run verify` green;
  the v4→v5 migration round-trips in `save.test.ts`.
- A full-arc T0 e2e (`t0-arc.test.ts`) drives rake→rice→sell→coin→upgrade→standing→
  ascension on the real player path.
