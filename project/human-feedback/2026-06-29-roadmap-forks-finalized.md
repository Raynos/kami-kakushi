# Roadmap re-axe — final fork decisions (2026-06-29)

> **What this is.** The human's finalized calls on the **5 provisional forks** the roadmap re-axe proposal
> ([`../../docs/plans/2026-06-29-roadmap-reaxe-proposal.md`](../../docs/plans/2026-06-29-roadmap-reaxe-proposal.md))
> had left *"flagged for your steer (recommended default applied; flag to override)"*. This round **actively
> confirmed all five** — converting *default-applied* into **locked** — which cleared the last open items in the
> proposal and triggered its **promotion** to [`../../docs/living/roadmap.md`](../../docs/living/roadmap.md).
> Decisions captured verbatim here; the promoted living roadmap carries the locked shape, and the proposal's
> "Open questions / forks" section is superseded.

## Decisions LOCKED this round

1. **Forks #1 + #5 — provisional balance numbers → ACCEPT AS PROVISIONAL.** Lock the proposal's defaults for
   both the **per-tier hour floors** (T1 ~5–8h · T2 ~8–10h · ≈40 min/rung) and the **pillar deed-band
   magnitudes** (T1 Arms 0.5K/0.72K/0.95K cap 20 ip + Estate 0.8K/1.1K/1.5K · T2 Office 2K/3.2K/4.5K cap
   80 ip). These only set rung thresholds / deed ip — **PRD §4 is liquid (D-059)**, playtest re-tunes them,
   and the **§4.8 ~28.5h budget re-derives across all 4 v1 tiers together at Ship-M1-F2**. No new ADR — they
   stay explicitly provisional.

2. **Fork #2 — E-stage → tier mapping + first retinue → DEFAULT.** The estate grows **E1→E2 in T1** (visibly
   once); **E2→E3+ slips to T2+**; the **first paid retinue (Gohei & Yatarō) is a T1 reward** — so T2's V5
   valley-watch is a *deployment/expansion*, not a "first". Lands the "real estate man" fantasy earlier and
   keeps estate growth legible (one visible stage per tier).

3. **Fork #3 — T1 rung titles + two-track rung meter → ACCEPT BOTH.** Keep the proposed **R8→R15 titles**
   (Kura Warden → Field Reeve → Drill-yard Hand → Stable & Woodlot Master → Ledger-hand → Armsman of the House
   → Under-steward → Trusted Man of the House) **and** the **two-track rung meter** — an *Estate-Service*
   (labour) sub-meter + a parallel *Combat-Rank* (martial) sub-meter, both of which must reach floor (plus the
   rung's story milestone) to promote (the Phase-1 AND-gate). The two-track split is the mechanical embodiment
   of T1's administrator-**and**-warrior identity and blocks single-axis grinding; titles are placeholders,
   trivially restyled later.

4. **Fork #4 — Rival-house T2/T3 split → DEFAULT.** Rivals (House **Tomita** = money · House **Akagi** =
   honour) are **introduced + the contest begins + the first contested deed at T2**; the **climax** (the
   Naoyuki rivalry→ally-flip, G7 dethroning) lands at **T3**. Lets the contest simmer in the valley before the
   Region-scale payoff — the cleanest dramatic build; pulling the climax forward would rob T3 of its biggest
   beat.

## Status / canon

- All **5 forks CLOSED** → the roadmap proposal has **zero open items**.
- **Promoted** to `docs/living/roadmap.md` (2026-06-29); the old M0–M7 milestone tracker is retired (git history
  + journals preserve it). The proposal is banner-marked **PROMOTED** and retained in `docs/plans/` as the
  historical as-reviewed artifact.
- **No new ADRs minted.** Forks #1/#5 are explicitly provisional (PRD §4 liquid, D-059). Forks #2/#3/#4 are
  roadmap-structure confirmations *within* the already-locked reshape (D-048…D-069) and are now carried by the
  living roadmap; if later wanted as ADR canon, they fold into the pending PRD ripple batch
  ([`../status/pending-prd-changes.md`](../status/pending-prd-changes.md)).
