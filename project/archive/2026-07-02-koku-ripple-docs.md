# Plan A — the koku redesign doc/PRD ripple

**Status:** ✅ DONE — executed 2026-07-02 (commit `421c18e`): ADRs D-107/108/109
authored, 10 ADRs supersede-annotated, 12 living docs rippled, grep-verified clean.
Archived. **One DoD item deferred to Plan B:** the `project-status.md` snapshot
refresh (it reflects the still-koku *built* game until the code migrates). Plan B
(the T0 build) is now **unblocked**.

**Rests on:**
[`2026-07-02-economy-koku-rediagnosis.md`](2026-07-02-economy-koku-rediagnosis.md)
(§9–§14, the locked decisions) and the two research brainstorms. Driven by the
`prd-koku-ripple-audit` workflow (12/13 living docs; raw snapshot at
`project/brainstorms/raw/2026-07-02-prd-koku-ripple-audit-wf_c76dec74.json`).

**Blast radius (why this is a wide ripple):** the audit found **81 CONTRADICTS +
16 RENAME + 70 ENRICH across 12 living docs**, plus the narrative doc (audited by
hand). The old model — *koku is the spendable base currency* — is woven through
every design doc and **~12 ADRs**. This is exactly the "fundamental underlying
current" the change breaks.

---

## The new model in one screen (the canon this ripple installs)

- **RICE** — a real, separate resource. Labour yields it. You **eat** it (satiety),
  **store** it (kura), or **sell** it for coin at a **season-swinging** price.
- **COIN** — the sole spendable currency. ONE underlying value (base unit **mon
  文**), shown in **fixed mixed denominations** **mon → monme → ryō** (1 ryō = 50
  monme = 4,000 mon; 1 monme = 80 mon), higher denominations **revealed
  incrementally** as wealth grows. No moneychanger, no floating forex.
- **KOKU** — the House's **assessed STANDING** (a kokudaka-like prestige SCORE). It
  re-expresses the **House Influence** roll-up as a koku score: **never spent**, not
  an income multiplier; gates ascension/unlocks; **re-assessed seasonally**
  (`seasonalJudge`) **+ a "the assessors arrive" event at tier jumps**.
- **Tier→koku ladder:** T0 tens → T1 ~100–1,000 → T2 ~1,000–5,000 → T3 ~5,000–10,000
  → **T4 = 10,000 (daimyō) → ~100,000** → T5 ~100,000–1,000,000+. Coin denomination
  rises with tier.
- **T5 parallel Office/court-rank/favour track** gates the top (koku = scale, office
  = access). **Personal koku stipend** only from T4+ (House-only before).
- **Status tokens** (surname → the two swords → gōshi rank) as visible rank rewards.

---

## The 7 recurring broken assumptions → canonical fix (apply everywhere)

These patterns repeat across nearly every doc — treat as global find-and-reframe:

1. **"koku flywheel" / "koku sink" / "spend koku"** → **coin/rice flywheel**; the
   spend currency is **coin (mon)**. (work → rice/coin → sell rice / spend coin →
   upgrade → more output.)
2. **"koku heartbeat" / "rice counter (koku)" / rice≡koku** → **rice heartbeat**;
   rice is its own resource; the paddies produce **rice**, not koku.
3. **labour yields koku** (rake/farm/forage "+N koku") → labour yields **rice (+ a
   little coin)**; koku is **never** a labour tick.
4. **costs priced in koku** (repair/estate/market) → priced in **coin (mon)**.
5. **loss bites "carried koku"** → bites **carried coin** (+ a rice/material slice);
   **koku standing is immune** to combat loss.
6. **"coin is a NEW currency at T2"** → **coin (mon) exists from T0**; what reveals
   later is **higher denominations** (monme→ryō) as wealth grows.
7. **"House Influence is NOT koku"** → House Influence **IS** re-expressed **as the
   koku standing score**. (Keep "not coin"; drop "not koku".)

---

## Per-doc edit checklist (from the audit — CONTRADICTS first)

> History (journals, brainstorms, `raw/`, archive, audit reports) is **append-only —
> do NOT rewrite it.** `docs/content/*.md` are **generated** by `gen:docs` — they
> re-emit from code in Plan B, never hand-edited here.

### `docs/living/prd/01-vision.md` — ADRs: D-008/033/051/066/077/090/092/098/099
- §1.6: reframe House Influence (家威) **as** the koku standing score; drop "NOT
  koku". §1.6.1/§1.6.3: "koku flywheel"→coin/rice flywheel; "personal koku
  sink"→personal **coin** sink (lines 273/484/560/561/962). §1.3: "koku/rice base
  economy"→"rice-and-coin base economy". §1.5.1: "koku heartbeat"→**rice** heartbeat
  (261/647/947); R1 outputs = rice + a little coin. §1.5.1 V0: coin debuts at **T0**
  (monme is the T2 reveal). §1.8 Tanomo: "koku/economy"→**coin** economy/ledgers/debt.

### `docs/living/prd/02-systems.md` — ADRs: D-033/051/052/066/077/078/092/097/098/099
- §2.4: **rewrite the currency taxonomy** — coin (mon, mixed denominations) is the
  sole spendable; rice is a separate eat/store/sell resource; koku is standing.
  Delete the **"koku↔coin spread"** forex lever (→ fixed denominations + season rice
  price). §2.16: standing assessed **as a koku score**; drop "NOT koku". §2.4 loop:
  labour→rice+coin, spend **coin**. §2.4 (c/d) DATA: **add rice as a first-class
  ResourceDef**; keep **koku OUT of `resources`** (model as derived standing).
  §2.17: re-denominate BuildableStructure/kura-works U1–U4 in **coin**+materials.
  §2.8 loss: "carried koku"→carried coin. §2.2/§2.6: "koku heartbeat"→rice heartbeat.

### `docs/living/prd/03-unlock-ladder.md` — ADRs: D-033/051/052/066/077/078/090/093/098/099
- §3.1 cold open: readout is a **rice** counter (drop the "(koku)" gloss); first
  labour makes **rice** (+ a first-sale coin row), not koku. §3.2 R1 heartbeat =
  rice/coin; R2 richer forage = "more sansai/coin" (strike koku). §3.2/§3.5.1 loss =
  ~20% carried **coin** + ⅓ materials; kura shelters coin+rice. Provisioning shop =
  personal **coin** sink from T0; personal koku is **T4+**. §3.3.5 Genemon =
  labour/**rice+coin**. §3.4 T2: coin row is **T0**; T2 reveals TRADE + **higher
  denominations**. §3.8: replace "conversion weights" with fixed coin rates + the
  koku assessment fn + rice season-price curve.

### `docs/living/prd/04-combat-balance.md` — ADRs: D-033/051/052/066/077/078/090/092/098/099
**(the heaviest — the balance/number spine.)**
- Unit legend (§39–40): rewrite rice/coin/koku definitions. §4.0 number spine:
  **split into two scales** — a RESOURCE scale (rice+coin, produced/held/spent) and a
  STANDING ladder (koku, the tier→koku table, reassessed, never spent). §4.7.1
  yields: paddy→**rice**, +small coin; drop "net koku-equivalent throughput". §4.7.5
  kura-works: re-denominate U1–U4 in **coin**+materials. §4.6.6d: "T0 koku
  sinks"→"T0 **coin** sinks" (`REPAIR_KOKU_COST`→`REPAIR_COIN_COST`). §4.6.6/b loss:
  `LOSS_KOKU_FRAC`→`LOSS_COIN_FRAC`. §4.6.6c kura: carried/banked in **coin+rice**.
  §4.2.2/§4.3: `ESTATE_REF_KOKU`→`ESTATE_REF`, `landReclaimedKoku`→`landReclaimed`;
  clarify `seasonalJudge` now assesses **koku standing**. §4.8.0 first beat: "rice
  ticks → coin row lights"; koku/standing reveal moves to first seasonal appraisal +
  the assessors beat. §4.7.2: delete the koku↔coin spread.

### `docs/living/prd/05-narrative.md` — (audited by hand; agent errored)
- Rename "koku flywheel" (34/274/289)→coin/rice flywheel; "koku heartbeat"
  (95/206)→rice heartbeat; "labour/koku mentor" (37/361)→labour/rice+coin; "wage is
  a recurring koku sink" (307)→recurring **coin** sink. **Already correct, keep:**
  "rice counter" (87), "we owe coin" (149), "estate's mon" (724), "mon flying on
  contracts" (835), the **Office pillar reveal at T2** (483) — which now dovetails
  with the T5 office track.

### `docs/living/prd/06-tech-architecture.md` — ADRs: D-008/024/033/051/066/077/092/098/099
- §6.2 `core/economy` = the **coin+rice** spine; move koku into the standing/influence
  system. §6.3 `buy_item` = personal **coin** sink. §6.4 `resources`: **remove koku**,
  **add rice**; store koku standing in the influence structure. §6.4 `estateStage` =
  **coin** purchase-ladder. §6.5 `resources.ts`: drop koku, add rice + coin
  denomination display config. §6.5 `activities.ts`: labour yields rice(+coin), never
  koku. §6.9 renderer: **add a mon/monme/ryō formatter**; keep K/M/B for the koku
  standing/pillar numbers.

### `docs/living/prd/07-roadmap-scope.md` — ADRs: D-008/016/028/033/051/066/077/090/092/098
- §7.1.1 Estate-stages E3 sink = **coin/Arms**, not koku. Cross-cutting invariant:
  **split the number-format rule** — koku standing & counts use K/M/B; **coin uses
  mon/monme/ryō** revealed incrementally.

### `docs/living/decisions.md` — the ADR log (see ADR section below)

### `docs/living/roadmap.md` — ADRs: D-008/031/050/051/066/077/092
- Legend locked-spine: "koku…flywheel (D-051)"→**coin** flywheel. Milestone DoDs:
  T0-M1-F1 "rake→koku ticks"→rake→**rice** ticks(+coin); T0-M2-F2 repair fee in
  **coin**; T0-M4-F2 flywheel loop in rice/coin; T0-M4-F3 market = **coin** sink +
  ENRICH (sell rice at season price); T1 flywheel branches (coin); T1-M1-F3
  debt-paydown = **coin** consumer; T1-M3-F3 retinue wage = **coin** sink; T2-M1-F1
  = coin **denominations** scale up (not coin's debut). Genemon = labour/rice/coin.

### `docs/living/ui-design.md` — ADRs: D-055/062/065/078/093
- §5.12 kura: carried-vs-stored in **coin + rice** (header "Carried N mon · stored N
  mon" + a rice line); remove koku. §5.11 map: deep-satoyama = "more sansai +
  rice/coin". §10 Work: **rice(+coin)** readout, not "koku/rate". §5.5/§10 loss
  toggles: "a loss costs **coin**". §7 iconography: **split** "Rice 米 🌾" (resource)
  from a distinct **koku-standing** motif (石高/家 seal, not 🌾); grow the coin row to
  the **mon 🪙 → monme → ryō** denomination ladder.

### `docs/living/fun-factor.md` — ADRs: D-063/064/077
- §2.1 deed loop: per-deed payoff = **rice (+coin)** pop; **koku does NOT tick per
  deed** — it re-assesses seasonally / at tier jumps (add that as its own juice
  beat). §2.4/§7 onboarding: Genemon teaches labour/**rice+coin**. §3/§4 "first
  koku"→first rice/coin. §6 fun-killer: "tighter koku"→tighter **coin** + rice
  pressure.

### `docs/living/qa-playtesting.md` — (no ADRs)
- §1 `state()`: drop koku from `resources`; coin = one mon value (mixed display);
  **add rice**; surface koku as a separate `standing` field. §3 fun-proxy: "first
  koku"→first rice(+coin). §6 juice: coin/rice tick + a separate seasonal-koku beat.

### `project/status/project-status.md` — (live snapshot, replace in place)
- "koku tightening (D-092)"→**coin**-economy tightening; note koku is now standing.
  R1 waiting-on-human: loss bites **coin**; costs priced in coin (mon).

---

## ADR handling (`decisions.md`) — supersede, never delete (append-only)

**Add THREE new ADRs** (next free ids — D-106 is the latest, so **D-107 / D-108 /
D-109**), splitting the redesign into discrete decisions (human call, 2026-07-02):

- **D-107 — koku is standing, not currency (the core split).** koku = the House's
  assessed STANDING (a kokudaka-like prestige score; re-expresses House Influence),
  never spent; **coin** (base unit mon) is the sole spendable money; **rice** is a
  real resource (labour-earned; eat/store/sell for coin at a season-swinging price).
  This is the reframe the 7 patterns and the 10 superseded ADRs all point to.
- **D-108 — the tiered coin denomination display.** ONE underlying coin value shown
  in fixed mixed denominations **mon → monme → ryō** (1 ryō = 50 monme = 4,000 mon;
  1 monme = 80 mon), higher denominations **revealed incrementally** as wealth
  grows; no moneychanger, no floating rate.
- **D-109 — the tier→koku ladder + the endgame axes.** The T0…T5 tier→koku standing
  bands (T4 = 10,000 = daimyō; up to ~1,000,000), the **personal koku stipend from
  T4+** (House-only before), and the **T5 parallel Office / court-rank / favour
  track** (koku = scale, office = access). Standing re-assessed seasonally
  (`seasonalJudge`) + the "assessors arrive" tier-jump event.

Record the §9–§14 decision set across these three; cross-link them.

**Then annotate each affected ADR** with a 🔁-superseded strikethrough + forward
pointer to the master ADR (keep the original text — the *why* survives):

| ADR | What it said | Ripple action |
|---|---|---|
| **D-051** | koku compounding estate-upgrade flywheel/sink | supersede → flywheel spends **coin**; koku = standing |
| **D-066** | koku flywheel branches LAND/TREASURY/TRADE | re-scope currency → **coin**; TRADE sells rice for coin (≤⅓ cap survives) |
| **D-077** | koku tight economy **+** deed-based standing | **SPLIT**: keep the deed-based-standing clause (now the koku law); re-label the tight-economy clause → **coin** |
| **D-092** | repair charges a koku fee | rename `REPAIR_KOKU_COST`→`REPAIR_COIN_COST` (mon) |
| **D-098** | kura-works koku purchase ladder | re-denominate U1–U4 in **coin** |
| **D-099** | provisioning shop = personal koku sink | recast → personal **coin** sink; personal koku is T4+ |
| **D-090** | lost fight bites carried koku | koku→**coin** (`LOSS_COIN_FRAC`); kura also stores rice |
| **D-093** | deep-satoyama koku/sansai yields | labour yields rice(+coin), **never** koku |
| **D-008** | trade ≤⅓ minority-lane cap | survives as a **coin**-lane cap |
| **D-105** | 1780 anchor "why" mentions koku/mon economy | reword: distinguish the **coin** economy from **koku standing** (fudasashi/Dōjima now fit rice-as-sellable) |

*(D-033/052/078/097 are referenced by the docs but mostly ride the same renames;
confirm each at edit time.)*

---

## New sections to ADD (the 70 ENRICH findings, deduped)

Every doc is **silent** on the new-model surface. Add, in the right doc:
- **Coin denomination ladder** (mon→monme→ryō, fixed rate, incremental reveal) —
  02-systems §2.4, 06-tech §6.9, ui-design §7, roadmap T2 beat.
- **Rice as a sellable resource** with a **season-swinging price** vs the kura
  store — 01-vision §1.6.2, 02-systems, 04-balance §4.7.2.
- **Tier→koku standing ladder** (the table) — 04-balance §4.0, 01-vision §1.6.
- **T5 Office/court-rank/favour parallel track** — 01-vision, 02-systems, roadmap
  (dovetails with the already-present Office-pillar-at-T2 note in 05-narrative).
- **Status tokens** (surname/swords/gōshi) — 03-unlock-ladder, ui-design §7.
- **Personal koku stipend at T4+** — 02-systems §2.4, 06-tech §6.4.
- **The "assessors arrive" tier-jump event** — fun-factor §4, qa-playtesting §6,
  04-balance §4.8.

---

## Sequencing, guardrails, DoD

**Order:** (1) write the master ADR (installs the canon the rest points to) → (2)
02-systems + 04-balance (the taxonomy + number spine — everything else references
them) → (3) the remaining PRD sections + roadmap → (4) ui-design/fun-factor/
qa-playtesting → (5) refresh `project-status.md`.

**Guardrails:**
- **Append-only history untouched**; supersede ADRs with strikethrough + pointer.
- **Content docs are generated** — don't hand-edit `docs/content/*`; they follow
  Plan B via `gen:docs`.
- **Single-source:** the fixed coin rates + tier→koku bands live in ONE place the
  docs reference, not re-typed per doc (A21).
- `verify-prd` / `check-md-links` must stay green; watch cross-refs between split PRD
  files.
- Prose wrap ~80 (soft norm).

**DoD:**
- Grep of the 13 living docs shows **no** "koku flywheel / koku sink / koku
  heartbeat / +N koku labour / carried koku / coin is new at T2 / Influence is NOT
  koku".
- The master ADR exists; all 10 table-ADRs carry a supersede pointer.
- Each ENRICH concept appears in ≥1 living doc.
- `project-status.md` reflects the split; both this plan and Plan B are in the
  reading queue.
- **Only then** is Plan B unblocked.
