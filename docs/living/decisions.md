# Decision Log (ADRs)

> **A live, append-only ledger** (it grows, so it lives in `docs/living/`, not in a "history" folder).
> **Precedence:** when a living doc and an ADR disagree on *current state*, the **living doc wins** (fix it
> if stale); on *why* a thing is the way it is, the **ADR wins**.

Append-only record of **locked decisions** and *why*. One entry per decision, numbered `ADR-000…`,
**IDs never reused**.

**Status:** ✅ Decided · 🛠 In design · ⏭ Deferred · ⛔ Reversed · 🔁 Amended (a clause superseded; the core decision holds — see the entry's note)

**Dating:** every entry carries a **`- **created_date:** YYYY-MM-DD`** first bullet (the day it was locked).
With newest-steer-wins, the date is what disambiguates which call is current when two ADRs touch the same
ground. *(Dates ADR-001…ADR-074 were backfilled 2026-06-29 from git first-appearance history.)*

**Reversing a decision:** don't delete it. Mark the old entry `⛔ REVERSED by D-XXX ({date})`, strike
its claim with `~~strikethrough~~`, and add a new ADR with the new call. History stays intact.

**Rename ADRs feed the drift tripwire (norm — human, 2026-07-05):** an ADR that renames or retires a
player-visible term (a cast name, a mechanic phrase like "spend koku") also adds its entry to the
`RETIRED` list in [`src/scripts/prd-drift.ts`](../../src/scripts/prd-drift.ts) **in the same commit** —
that list is hand-maintained, and no gate can soundly know a rename happened (audit:
[`2026-07-05-prd-ripple-drift-audit.md`](../../project/audit/reports/2026-07-05-prd-ripple-drift-audit.md)).

> Resolved [`human-in-the-loop`](../../project/human-in-the-loop/decisions.md) `HD`-items graduate into ADRs here.

---

## Template (copy for each new decision)

### D-0XX ✅ — {short title}
- **created_date:** {YYYY-MM-DD — the day the decision was locked}
- **Context:** {the forces at play — what made this worth recording}
- **Options:** {A / B / C, each in a phrase}
- **Decision:** {what we chose}
- **Why:** {the deciding rationale}
- **Consequences:** {what this commits us to; follow-on work it spawns}

---

<!-- Real entries live in the band files below (ADR-196 shard). -->

## The log — band files

The entries are sharded into `docs/living/decisions/` by ADR number
(ADR-196 — one giant file was the #4 hot file in the shared tree).
**Entries are unchanged and append-only; a NEW ADR goes in the LIVE
(newest) band.** Reserve its number first:
`pnpm exec tsx src/scripts/tree-claim.ts adr`.

- [`decisions/000.md`](decisions/000.md) — ADR-001…ADR-049 (founding:
  story ground, tech stack, T0 economy, the PRD-V2 blocks)
- [`decisions/050.md`](decisions/050.md) — ADR-050…ADR-099 (the
  6-tier reshape, operating philosophy PH1–PH6, diverge process)
- [`decisions/100.md`](decisions/100.md) — ADR-100…ADR-149 (combat
  axes, housing, tab IA, the frontier PRD, taste standard)
- [`decisions/150.md`](decisions/150.md) — **ADR-150+ · the LIVE
  band, new ADRs land here** (story reboot, estate spine, seasons,
  the ADR-19x process locks)

Numbering gaps ADR-146/ADR-148 are recorded inside the log (no entry
was ever written). `verify-deferred-work` scans the index AND every
band; `tree-claim.ts adr` reads both for its high-water mark.

