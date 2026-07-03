# Economy & progression re-diagnosis — the koku problem

> **📦 ARCHIVED 2026-07-03 — DONE (superseded).** The diagnosis's model shipped
> as the koku-economy build (D-107, Ph1–4). Verified in the agent-default audit
> ([`project/audit/reports/2026-07-03-agent-default-decision-audit.md`](../../project/audit/reports/2026-07-03-agent-default-decision-audit.md)).
> The Status line below predates that and is stale.

**Status:** 🆕 proposal, awaiting human read + a taste call. Diagnosis only — **no
code changed.** Companion to
[`project/brainstorms/2026-07-02-koku-edo-economy-research.md`](../../project/brainstorms/2026-07-02-koku-edo-economy-research.md)
(the historical research this rests on).

**Caveat (shared tree):** another agent is actively editing the build (recent
commits). Line references are a snapshot of `main` at 2026-07-02 and may drift;
re-confirm before acting.

---

## 1 · Current-state diagnosis

### 1.1 What resources actually exist

Three stored resources (`state.resources`, seeded `{ koku: 0 }` in
`state.ts:186`):

- **koku** — the universal spendable currency.
- **wood** — weapon-repair material.
- **sansai** — foraged greens, cooked into satiety (food).

Plus a `banked` mirror (the kura storehouse) for sheltering carried wealth.

Progression / status lives in **separate, non-resource** axes — this matters:

- **rungMeter** — Estate Service points (R0…R7 ladder, `ranks.ts`), +2/act,
  resets each promotion.
- **influence.estate** (value / highWater / judged) — the House-Influence pillar,
  graded NONE→GOOD→GREAT→EXCELLENT (`pillars.ts`), the Phase-2 macro engine that
  gates ascension.
- **skillXp**, **combatXp/level**, **attrs** — character growth.

So the game *already separates* currency, status-progress, and macro-standing.
The problem is **not** "everything is one number." It's narrower and sharper:
**the evocative word "koku" is bolted onto the trivial coin, and the coin does
five unrelated jobs at once.**

### 1.2 koku is a generic coin, at copper-coin magnitudes

Income (per single act):

| Source | Yield | File |
|---|---|---|
| Rake spilled rice | **+3 koku** | `balance.ts:24`, `intents.ts:294` |
| Work the paddies | +4 koku | `activities.ts:38` |
| Haul stores | +2 koku | `activities.ts:47` |
| Forage (near/deep) | +1 / +2 koku | `activities.ts:71,85` |

Sinks (all priced in koku):

- **Market** (`market.ts`): greens/wood 10–70 koku.
- **Kura-works estate ladder** (`estate.ts`): 100 / 300 / 700 / 1400 koku.
- **Weapon repair** (`balance.ts:260`): 6 koku.
- **Loss penalty** (`balance.ts:238`): a lost fight drops 20% of *carried* koku.

Per the research, **1 koku ≈ 150 kg of rice ≈ one adult's annual ration**, and a
low samurai's *entire yearly stipend* was denominated in koku. A world where you
"earn 3 koku raking a floor" and "patch a storehouse for 100 koku" is using koku
with the magnitude and cadence of **mon (copper cash)** or a generic gold coin —
not koku. This flattens the setting: the single most Edo-specific unit in the
game is spent on the most mundane transactions.

### 1.3 Rice-the-substance and koku-the-money are the *same variable*

The clincher. The resource you earn raking **rice** is stored as `koku`, and the
UI labels it inconsistently:

- Header pill → **"koku"** (`render.ts:193`, `RESOURCE_LABEL`).
- Work-tab move-strip → **"rice"** (`render.ts:1028`, `RES_WORD`).
- The readout surface id → **`readout-rice`** (`surfaces.ts:50`).
- The reward log → **"(+N koku)"** while narrating raking rice
  (`coldOpen.ts:26`).

The code comment at `coldOpen.ts:24` even acknowledges the fudge: *"The rake
credits koku (RICE_PER_RAKE), so the line names koku."* The player is being told,
in the same breath, that the thing in the basket is both rice and koku. This is
the exact confusion the research predicted — not hypothetical, shipped.

### 1.4 koku is doing five jobs

The one koku pile simultaneously represents: **food money** (buy greens),
**material money** (buy wood, repair), **estate-investment capital** (kura-works),
**at-risk carried wealth** (loss penalty), and **the literal rice you harvest**.
Meanwhile the concept koku *should* denote — the estate's assessed productive
standing, its rank, its stipend-worth — is carried by *other* systems with
abstract names ("House Influence", "grade EXCELLENT", "rung meter"). **koku is on
the wrong noun.** The trivial thing got the sacred word; the sacred thing got a
spreadsheet label.

### 1.5 What's already fun — preserve these

- **The rung ladder R0→R7** (`content/ranks.ts`): kanji titles (日雇→内衆),
  diegetic promotion beats, reveal-as-plot unlocks, an AND-gate of
  meter + story. This is genuinely strong narrative progression. **Keep intact.**
- **The kura-works flywheel** (`estate.ts`): patch kura → clear yard → reclaim
  shinden → raise long-house, each with compounding +yield% and lovely prose.
  A satisfying idle flywheel with real Edo texture. **Keep the loop; re-denominate
  the cost.**
- **The House-Influence pillar + seasonal judge + grade → ascension**
  (`pillars.ts`): the "measure of the House" macro engine. This is *already the
  kokudaka-shaped thing.* **Keep — and consider renaming it to koku.**
- **Kura storehouse (carried vs banked, risk on loss)**: a clean protect/risk
  decision. **Keep.**
- **Skills→yield accelerator, combat, stances, cook-loop**: solid idle scaffolding.
  **Keep.**
- **The literary tone** (cold open, promotion beats, physician grounding the
  folklore): excellent. **Preserve absolutely.**

The diagnosis is therefore a **re-denomination + light restructure**, NOT a
teardown.

---

## 2 · Alternative models

### Option A — "Rice, Coin, and Standing" (three-noun split; minimal restructure)

Fix the nouns; keep every loop.

- **Coin (mon, 文)** — rename the current `koku` currency to a copper-cash purse.
  This is what you earn labouring (a few mon), and spend on greens, wood, repairs,
  and (rescaled) estate works. Copper-cash magnitudes finally match the cadence.
- **Rice** — becomes a *real, separate, physical* resource. Raking/farming yields
  **rice**, which you can **eat** (→ satiety), **store** in the kura, or **sell**
  for coin at the market. This introduces the historical rice↔cash conversion as
  one light, legible decision (sell now, or hold against a lean week / better
  price).
- **Koku** — reserved for its true meaning: the estate's **assessment**. The
  House-Influence pillar becomes "the House is assessed at N koku," climbing over
  the whole campaign toward daimyō-scale (10,000). Never spent; a rank, not a
  wallet.
- **Core loop:** labour → rice (+ a little coin) → eat / store / sell → coin pays
  upkeep + estate works → estate works raise assessed **koku** + yield → koku-grade
  gates ascension.
- **Scales:** personal survival = keep rice + coin above the line; household =
  grow the estate's assessed koku; regional/Edo = koku-rank unlocks standing and
  obligations.
- **koku fits** as the spine of *status*, exactly as history has it.
- **Why legible/satisfying:** one number changes meaning (coin), one new light
  decision (sell/hold rice), and the prestige number (koku) now compounds
  visibly toward a famous threshold. Minimal new UI.
- **Risks:** adds a rice↔coin conversion the player must learn; two header pills
  where there was one; the sell price needs tuning so rice isn't just "auto-sell."
  Low overall.

### Option B — "The Ledger" (personal purse vs household treasury; systemic)

Make the *entrusted-with-more* fantasy the mechanical spine.

- **Personal lane:** mon wages, personal food/tools, personal debt to a
  fudasashi-style broker.
- **Household lane:** rice stores (the estate's kokudaka production), the **tribute
  owed up the chain** (nengu as a recurring obligation/sink), household coin,
  household debt.
- **Progression = access:** you begin able to touch only your own purse; each rung
  hands you more of the *household* ledger — first its rice, then its coin, then
  its tribute and debt, then the domain's assessment.
- **koku** = the household's assessed productive base; the signature tension is the
  research's **assessed-vs-collected gap** (paper koku ≈ 2× real rice; ~40%
  actually collected) — being "paper-rich, cash-poor" becomes a felt mechanic.
- **Why compelling:** the strongest *narrative-stakes* option; obligations and debt
  are real idle sinks; "they trust you with the books now" is a potent beat.
- **Risks:** highest complexity + UX cost (two ledgers, obligations, debt spiral);
  real danger of a bookkeeping-sim feel that fights the literary tone; a lot to
  build before it's fun.

### Option C — "Rice, Silver, Favour" (three non-fungible tracks; political spine)

Three deliberately *non-interchangeable* meters, koku as pure status.

- **Rice** — subsistence + production; feeds famine risk (Tenmei 1782 as the
  looming shock).
- **Coin** — trade + upkeep; convertible from rice at a *fluctuating* market rate
  (the Dōjima swing modelled as a periodic price, not a live forex).
- **Favour / Face (giri-on, 義理)** — the social-political currency: earned by
  service, gifts, and duty; spent on patronage, offices, and political moves.
  **Cannot be bought with coin** — that's the entire point, and the antidote to
  "idle games let you buy your way up."
- **koku** = the estate's formal assessment/rank only.
- **Why compelling:** by far the strongest for the *labourer→Edo-politics* arc;
  Favour is the through-line that money can't shortcut; anti-pay-to-win by design.
- **Risks:** most new systems to build (an entire favour economy); three bars
  competing for attention early when only rice matters; balancing a currency you
  *can't* convert is hard.

---

## 3 · Recommended direction

**Ship Option A now as the spine; leave an explicit seam to graft Option C's
"Favour" track at the village/region tiers (T2+), and treat Option B's
assessed-vs-collected gap as optional late texture.**

Rationale:

- **A fixes the confirmed, shipped confusion with the least risk** and preserves
  everything that's already fun (§1.5). It's a re-denomination, and — crucially —
  **there are no live users yet** (D-067; migrations wipe pre-launch saves), so the
  data cost is near-zero.
- A **lays the noun-foundation** (rice ≠ coin ≠ koku-assessment) that B and C both
  need. You can't add a Favour economy or a household ledger on top of a single
  koku-blob; you *can* add them on top of three clean nouns.
- The **political** late-game the setting promises is C's Favour track — but it
  belongs at the village/region scale, not the T0 estate. Building the noun spine
  now (A) and the political currency when the political tier arrives (C) matches
  the game's own tier cadence and avoids three-bars-at-once early bloat.

Net: **A is the T0/T1 answer, C is the T2+ answer, B is a texture reservoir.**

---

## 4 · UI & terminology implications

- **Header pills:** split the one koku pill into **rice** (物成 / a bale glyph) and
  **coin (mon, 文)**. Keep wood/sansai. Reconcile the `RESOURCE_LABEL` /
  `RES_WORD` / `readout-rice` disagreement into one source of truth.
- **The rake line** becomes honest: "You rake the spilled rice back toward the
  basket. **(+3 rice)**" — and *rice*, not coin, is what you first hold. Coin
  enters when you first sell or are first paid a wage (a natural early beat).
- **Estate assessment:** re-skin the House-Influence bar as "**the House stands at
  N koku**" with the grade as a sub-label; name the far horizon (10,000 koku =
  daimyō) so the number has a mythic ceiling.
- **Market:** gains a **sell-rice-for-coin** action alongside the buy items;
  buy prices re-quoted in mon.
- **Terminology table** (single glossary doc): rice = 米/物成 (produce, food,
  sellable) · coin = 文 mon (everyday cash) · koku = 石 (the House's assessed
  standing, never spent) · Estate Service = the rung meter · House Influence →
  folds into the koku assessment.
- **Risk of over-labelling:** with two new pills, watch header crowding on the
  cold-open; reveal rice first, coin second, koku (assessment) only at R3+ when the
  House-Influence panel already unlocks.

---

## 5 · Content & narrative implications

- **The cold open gets *better*, not disrupted:** raking spilled **rice** for rice
  is now literal and grounded; the physician's "given work and rice, [bodies]
  mend" line already leans this way (`coldOpen.ts:14`). Coin arriving later ("your
  first wage") is a clean progression beat.
- **Promotion beats** already speak of rice and stores ("Earn your rice", "Mind the
  stores as if the rice were your own") — they align with rice-as-substance and
  need little change.
- **New micro-beats to write:** first sale of rice for coin; first time the House's
  koku-assessment is named; (later) first Favour earned.
- **The estate ladder** prose (patch kura → raise long-house) is reusable verbatim;
  only the cost noun changes.
- **Tone guard:** keep numbers off the prose — the literary lines should say
  "rice", "coin", "the House's standing", never "N koku of assessed kokudaka."
  Numbers live in the readouts; poetry lives in the log.

---

## 6 · Data / save-migration implications

- **Mechanism:** ordered forward migrations keyed by version (`migrate.ts`),
  additive-with-defaults; `SCHEMA_VERSION = 4`.
- **Cheapest real cost in the codebase for this change**, because **D-067 wipes
  pre-launch saves** — there are no users to preserve. A v4→v5 migration can simply:
  rename `resources.koku` → `resources.mon`, `banked.koku` → `banked.mon`, and
  introduce `resources.rice` (default 0). Or, given no users, wipe.
- **Balance re-tune, not a data model overhaul:** the numbers (yields, costs, loss
  fraction) mostly carry over under new names; only the rice↔coin split needs new
  values (sell price, how much labour gives rice vs coin).
- **The status axes need no migration** — `influence.estate`, `rungMeter`, skills,
  attrs are untouched; only their *display noun* (koku) changes.
- **Verifier/gen-docs:** `verify-content` and `gen:docs` own the balance constants
  and the estate-stage contiguity check — renames must flow through them
  (single-source rule).

---

## 7 · Phased implementation roadmap

**Phase 0 — lock the model (human sign-off).** Confirm A, the noun glossary, and
the open decisions in §8. No code.

**Phase 1 — rename koku→mon (pure re-denomination).** Rename the currency
everywhere (resource key, labels, log lines, market/estate/repair costs), reconcile
the `readout-rice`/`RES_WORD` disagreement, add the v4→v5 migration. *No new
mechanic yet* — the game plays identically, just honestly named. Ships value
immediately and de-risks the rest.

**Phase 2 — split rice out as a real resource.** Labour yields rice (+ a little
mon); add eat-rice (→ satiety) and store-rice (kura); add sell-rice-for-coin at the
market. Re-tune yields/prices. This is the one genuinely new loop.

**Phase 3 — re-skin the estate assessment as koku.** House-Influence bar becomes
"the House stands at N koku"; name the 10,000-koku daimyō horizon; grade becomes a
sub-label. Pure presentation over the existing pillar engine.

**Phase 4 — seam for Favour (design stub only).** Reserve the `influence` shape and
a UI slot for a T2 Favour/giri track; write the design note; build nothing until
the village tier.

Each phase is independently shippable and independently revertible.

---

## 8 · Open design decisions (need human judgment)

1. **Coin noun:** **mon (文, copper)** vs **a generic "coin"** vs **silver (monme)**?
   mon best fits the labourer cadence; monme reads richer but is weight-based
   (harder to gloss). *Taste + legibility call.*
2. **Does rice stay fully separate, or is it "soft money"?** Pure-A makes rice a
   distinct resource you sell; a lighter variant keeps one wallet but renames it
   mon and treats rice as flavour. How much conversion friction is *fun* vs *fussy*?
3. **Is the House's standing literally called "koku," or "kokudaka," or kept as
   "House Influence" with koku only in flavour?** Re-skinning the pillar as koku is
   the boldest fix but touches the macro engine's identity.
4. **How early does coin appear?** At the cold open (two pills immediately), or
   only at R1 "earn your rice → first wage" (rice-only cold open, coin as a beat)?
   Recommend the latter for a calmer opening.
5. **Do we adopt the assessed-vs-collected gap (Option B texture) at T0, or defer?**
   It's evocative but adds cognitive load to the tutorial tier.
6. **Ceiling framing:** name the 10,000-koku daimyō threshold explicitly as the
   campaign's mythic ceiling, or keep it implicit? Explicit gives the idle number a
   destination; implicit protects the literary restraint.

---

## 9 · Decisions taken (human, 2026-07-02) — resolves §8

- **D1 · Coin noun → a TIERED denomination ladder, not one coin.** The currency
  itself becomes a progression axis, mapping onto the real tri-metallic system:
  **copper mon (文) → silver monme (匁) → gold ryō (両)** as you climb tiers, "and
  maybe even gold whatever that is in T4/T5". You *earn in coppers* as a labourer
  and *count gold* as a lord. (Historically sound: gold settled large sums, copper
  small — [FACT, prior research].)
- **D2 · Rice fully separate (light friction).** Rice is a real resource: eat /
  store / sell for coin. One sell-or-hold decision; no forex sim.
- **D3 · Standing = House Influence AND koku (both, reconciled).** Keep the
  pillars/Influence engine; the House also keeps a **ledger measured in koku**, and
  its **standing is a koku score** — "thematic and internally consistent." So:
  Influence stays the mechanism; **koku is the number it reports.** The House's
  worth *is* its kokudaka.
- **D4 · Coin appears incrementally** — rice-only cold open, coin arrives as a
  "first wage" beat, denominations unlock upward by tier (per D1).
- **D5 · Paper-vs-real gap → via periodic RE-ASSESSMENT ("in waves"), not a
  parallel meter.** Human intuition: the estate's *assessed* koku is re-judged in
  waves and lags the *current* deed/income flow. **This already exists in code** —
  `seasonalJudge` (`pillars.ts`) judges the pillar at a new high-water each season.
  So model the assessed koku as a **lagging, wave-updated figure** distinct from
  live income, rather than importing Option B's full ledger. Keep it light.
- **D6 · Ceiling → a NAMED LADDER of ranks, not one distant 10,000 bar.** Instead
  of a single far number, name a rung at each tier (below) so the koku score always
  has a *next* named summit — explicit destination without a grindy one-bar feel.

## 10 · The tier → koku ladder (answering "what is T0…T5 in koku?")

**Status: GAME-DESIGN proposal.** The scale is anchored on the verified FACTS
(daimyō = ≥10,000 koku; Kaga ≈ 1.025M; the shogunate's Tokugawa house ≈ 7M;
gosanke Owari ≈ 619k / Kii ≈ 555k / Mito ≈ 350k) — the *band edges between* them
are game-design choices, liquid, to tune. Institutional labels at each tier want
confirmation from the in-flight social/political research pass.

| Tier | You are | House measured at | Coin you handle | Historical identity |
|---|---|---|---|---|
| **T0** Estate-tutorial | labourer → trusted hand in a fallen minor house | **tens of koku** (restore toward ~100) | **mon** (copper) | day-labourer → house servant |
| **T1** Estate | house officer / steward growing the holding | **~100 → ~1,000 koku** | mon → **monme** | gōshi / village-samurai house |
| **T2** Village / valley | headman / lord of a village-cluster | **~1,000 → ~5,000 koku** | **monme** (silver) | shōya/nanushi → kokujin |
| **T3** Region / district | holder of a fief nearing the daimyō line | **~5,000 → ~10,000 koku** | monme → **ryō** | senior retainer / karō / kokujin |
| **T4** Castle-town | **daimyō of your own castle + domain** | **10,000 → ~100,000 koku** | **ryō** (gold) | daimyō; sankin-kōtai begins |
| **T5** Edo politics | a great house + court office | **100,000 → 1,000,000+ koku** | ryō + **Favour/office** | jōshu → kunimochi → gosanke → shogunal office |

**The 10,000-koku line is the campaign's hinge** — crossing it at T4 is the moment
you *become a daimyō*. That single FACT is the spine the whole ladder hangs on.

**Named koku sub-milestones bridging "castle town" → the summit** (T4–T5), so the
late game keeps naming a next rung:

- **10,000 koku** — you become a daimyō [FACT: the daimyō floor].
- **~50,000 koku** — a domain with a real voice.
- **~100,000 koku** — a major castle-holding daimyō.
- **~200,000+ koku** — *kunimochi*, a province-holder.
- **~350k–620k koku** — *gosanke* scale [FACT: Mito/Kii/Owari], Tokugawa-branch
  prestige.
- **~1,000,000 koku** — **Kaga**, the summit of daimyō wealth [FACT ≈ 1.025M].

**What's "above daimyō" — the key design pivot for T5.** Above a point, **power
stops being koku and becomes OFFICE + COURT RANK.** Historically the huge *tozama*
("outside") lords like Kaga (1M koku) were *barred* from bakufu office, while small
hereditary *fudai* lords (often ~50k koku) held the top council seats (rōjū, tairō)
that actually ran the country — and above them all sat the Shogun (Tokugawa house
≈ 7,000,000 koku [FACT]). **So T5's real currency is not more koku — it is court
rank (kan'i) and shogunal office/Favour.** This is exactly where Option C's Favour
track (deferred at §3) comes home: you can be koku-rich yet powerless in Edo, or
koku-modest yet hold high office. **koku caps out as the axis of the *middle* game;
Favour/office is the axis of the *end* game.**

## 11 · Next open decisions (opened by §9–§10)

- **N1 · Denomination handoff:** do mon / monme / ryō **coexist** (you hold all
  three, with an exchange), or does each tier **hard-replace** the last? Coexist is
  historically true (and enables the fudasashi exchange lane); hard-replace is
  simpler UI.
- **N2 · Confirm the tier band edges** in §10 (are tens→100 / 100→1k / 1k→5k /
  5k→10k / 10k→100k / 100k→1M the right pacing?), knowing they're liquid.
- **N3 · Adopt the "koku → then Favour/office" pivot at T5?** i.e. koku is the
  T0–T4 axis and an explicit *court-rank/office* track takes over for Edo politics.
- **N4 · Re-assessment cadence (D5):** is the wave seasonal (reuse `seasonalJudge`
  as-is), or a slower per-tier "the assessors come" event? How visible is the
  assessed-vs-current gap to the player?
- **N5 · Does the player's PERSON also carry a koku stipend** (you, personally,
  rated in koku as you become samurai), distinct from the House's koku standing? A
  second koku reading, or keep koku House-only?

---

## 12 · Decisions taken (human + agent-default, 2026-07-02, round 2)

- **N1 · RESOLVED → money is ONE quantity shown in mixed denominations (not 3
  resources, not an exchange minigame).** Human refinement supersedes both offered
  options:
  - Internally there is **one wealth value** (base unit: **mon**). No separate
    monme/ryō resources.
  - It renders in **mixed fixed-denomination notation** (like £·s·d / a mixed
    radix): e.g. `12 ryō, 40 monme, 20 mon`.
  - The **exchange rate is FIXED for the whole game** — **no moneychanger UI, no
    broker lane, no floating rate** (the float is abstracted away, exactly as the
    research recommended).
  - **Incremental reveal:** you first see only **mon**; the **monme** column
    appears once wealth crosses into that range; **ryō** later still. Human
    example: *"when you have 500 mon it can be 6 monme 20 mon"* → implies ~**1
    monme ≈ 80 mon** as a starting rate (clean final rates TBD — small open item).
  - Net: denominations are a **display progression over one number** — Edo-flavoured
    big-number formatting. Kills the "three counters to track" cost entirely.
- **N3 · RESOLVED → koku does NOT cap; office/favour is a SECOND, GATING track at
  the top.** Human call: *"koku still goes up, ranks still measured in koku, but
  gated by office/favour/court… or in T5 two parallel tracks, koku and office."*
  So:
  - koku stays the scale all the way up (no plateau).
  - High ranks — especially **T5/Edo** — are **gated by office / court rank /
    favour**, a distinct axis.
  - Likely a **new pillar** (Office/Favour) beside the Estate/koku pillar — possibly
    two parallel tracks at T5. **koku = your scale; office/favour = your access;
    both needed at the summit.** (This is Option C's Favour track, now sited as a
    late-tier *gate* rather than a replacement.)

### Agent-picked defaults (bias-to-motion — override welcome, N2/N4/N5)

Chosen while the human was away, all reversible:

- **N2 → accept the §10 band edges as PROVISIONAL/liquid.** Keep as written; tune by
  the pacing sim + playtest. (No reason to block the model on exact numbers.)
- **N4 → seasonal re-assessment, reuse `seasonalJudge` as-is.** Zero new engine; the
  koku standing steps up to meet accrued deeds each season — the lightest form of
  D5's "in waves." (Rejected the heavier per-tier "assessors arrive" event for now;
  it can be layered later if the political tiers want the drama.)
- **N5 → House-only koku; personal reward stays rice + coin.** Avoids re-introducing
  the exact two-koku blur this whole plan exists to fix. A personal stipend can be
  reconsidered at T4+ when the player *is* samurai, but the default is one clear
  meaning for koku: the House's standing.

### Still genuinely open (need the human)

- **Clean fixed denomination rates** (mon:monme:ryō) — the ~80 mon/monme example is
  a starting point; pick round, legible values.
- **N3 shape:** is Office/Favour **one new pillar** or a **full parallel track** at
  T5? (Wants the social/political research pass, in flight, to land first.)
- **N4/N5** confirmations if the agent defaults above aren't to taste.

---

## 13 · Decisions taken (human, 2026-07-02, round 3) — supersedes the round-2 defaults

- **Coin rates → 1 ryō = 50 monme = 4,000 mon (1 monme = 80 mon).** Matches the
  Bank of Japan primary source (the 1601 rate) *and* the human's own worked example
  — historically real, not invented. Locks the mixed-denomination display math
  (N1).
- **T5 office axis → FULL PARALLEL TRACK** (supersedes N3's "one pillar" option and
  the round-2 note). A koku ladder *and* a distinct office / court-rank / favour
  ladder both climb at the top, each with its own mechanics and rewards. koku =
  your *scale*; office = your *access*; high ranks need both. Historically anchored
  by **Tanuma Okitsugu** (ashigaru's son → 57,000-koku daimyō + rōjū via shogunal
  favour, peak ~1780s) and the fudai/tozama office-gate (huge tozama lords were
  barred from office; small fudai held the top seats). Most depth, most to build —
  a T5 subsystem, deferred but now firmly specified.
- **Re-assessment → SEASONAL + "the assessors arrive"** (upgrades the round-2
  seasonal-only default). Keep `seasonalJudge` for steady per-season steps, AND add
  a weightier formal re-rating at big tier jumps (bakufu/domain assessors) that
  makes koku leap and resets obligations — a Big Beat. Grounded in the real
  kokudaka re-survey (kenchi) practice; a new milestone event to build.
- **Personal koku → House-only through T3, a PERSONAL STIPEND unlocks at T4+.**
  koku means one thing (the House's standing) for the whole teaching arc; once you
  *are* samurai/daimyō (T4+), you also gain a personal koku stipend (your rated
  worth) beside the House total — historically how retainers were paid, introduced
  only *after* koku's meaning is locked in, so it enriches rather than blurs.

### How the round-3 calls land against the social/political research

(See [`project/brainstorms/2026-07-02-edo-social-political-research.md`](../../project/brainstorms/2026-07-02-edo-social-political-research.md).)
The office track (Tanuma/patronage), the assessors event (kenchi re-survey), and
the T4 samurai-stipend all have direct historical anchors. The research also
surfaces **new content lanes** the plan should reserve seams for: **status tokens**
(surname → the two swords → gōshi rank, making each rise *visible*),
**bought-rank-with-stigma** ("kaneage zamurai" — money buys rank at a reputation
cost), the **village collective-liability / murahachibu ostracism** cluster (the
T2 tension), **factional escalation / appeal-to-Edo** (late-game risk), and
**famine-as-a-status-mediated-obligation** shock (the looming 1782 Tenmei event).
These are T2+ design fodder, not T0/T1 economy work — parked here as the seam list.

---

## 14 · Agent-picked defaults (2026-07-02, round 4 — human away; override welcome)

All four reversible; chosen to defend the core fix and follow the research.

- **Rice price → SWINGS BY SEASON.** Cheap at the autumn glut, dear in lean spring;
  a light store-and-sell decision that pairs with the kura storehouse and echoes the
  Dōjima swing (abstracted to seasons, no live forex). This is the "light friction"
  D2 asked for — the one conversion decision worth having. *(Rejected the fixed
  price: it makes rice just slow coin and drops the timing game.)*
- **koku's job → PURE STANDING + GATE (not an income multiplier).** koku gates
  ascension and unlocks content but does **not** itself lift income; the compounding
  flywheel stays on the kura-works estate stages (which already give +yield%). Keeps
  koku clean as *the House's honour*, not a wealth stat — defending the whole point
  of the redesign. *(Rejected the soft-flywheel: it drifts koku back toward "just
  money.")*
- **Rank rewards → VISIBLE STATUS TOKENS (augment the titles, don't replace).** Each
  milestone grants a tangible, historically-real token: kept on → a **surname** →
  the **two swords** → **gōshi** rank. The rise you can *see*, not just a meter;
  research-backed and a strong fit for the literary tone. The abstract R0–R7 meter
  stays under the hood. *(A content layer to write, but high value.)*
- **Bought-rank ("kaneage zamurai") → DEFER to T2+.** A superb money-buys-rank-but-
  not-honour tradeoff, but it only bites once a reputation/favour axis exists to pay
  the cost into — the T2+ social tier — and it's only emergent at 1780 anyway.
  Reserve the seam; build it with the favour track. *(Rejected building it early
  (no rep axis yet to give it teeth) and omitting it (it's too good to lose).)*

**With round 4, the T0/T1 economy model is fully specified.** What remains before
build is mechanical detailing (exact yields/prices/thresholds — all liquid) and the
human's confirmation of these four defaults. The T2+ social/political layer (office
track, status tokens beyond gōshi, village liability, famine) is specified as
*direction*, to be planned per-tier when those tiers arrive.
