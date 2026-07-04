# Session 65 — 2026-07-04 — resume-pointer gen-region

**Summary:** The snapshot's "How to resume" pointer named a hard-typed journal
filename that rotted (it lagged 6 sessions behind newest at s63 — the least-current
line in an otherwise-fresh file). Closed the drift by generating it: a new
`resume-journal` gen-region in `project-status.md`, populated by `checkpoint.ts`
from the actual newest journal on disk. Same "generate, don't duplicate" pattern
the gate-roster region already used. No ADR — a tooling hardening, not a design change.

## What changed
- `src/scripts/checkpoint.ts` — added `newestJournalName(names)` (pure, exported):
  picks the GREATEST session number, not a lexical `.sort()` (which mis-ranks
  unpadded `session-9` above `session-63`). Added `genResumeJournal()` emitting the
  newest journal as an indented markdown link, wired a `resume-journal` REGIONS entry
  for `project-status.md`, and routed the CLI's "newest journal" printout through the
  same helper (fixing the same latent lexical bug there).
- `src/scripts/checkpoint.test.ts` — RED-able test for `newestJournalName`
  (`session-9` vs `session-63` → must return 63; fails a naive `.sort()[last]`).
- `project/status/project-status.md` — replaced the stale s57 pointer with the
  `resume-journal` region; compressed the resume blockquote 5→3 lines to stay
  line-neutral at the 120 cap (no cap raise).

## Next intended steps
1. The resume pointer now self-refreshes on every `npm run checkpoint` — no upkeep.
2. Back to the F-wave: F1b Ph2–4, then F2→F10 per `fable-process-master-plan.md`.

## Landmines
- The `resume-journal` region body carries a baked-in 3-space indent (it sits as the
  step-1 list continuation) — intentional so a dry `checkpoint` run byte-matches.
  Don't hand-edit inside the markers; run `npm run checkpoint`.
- Session-64 (F1b) was authored by a concurrent agent and landed during this session;
  this s65 entry is a separate thread (the checkpoint-tooling change).

---

## Addendum — F1b closed (reframe & archive)

The human reviewed F1b (PRD ripple tooling) and made the call to close it.
Verified against the build first: Ph1 (`prd:drift`), Ph2 (splicer + pilot §3
canon region, gate #8), and Ph4 (`/prd-compress` skill) all shipped with DoDs
met. The lone open item was **Ph3's "one *real* `/prd-ripple` invocation"** — a
DoD that can't be self-completed because it needs an unrelated future
built-system change to exist as something to ripple (zero `/prd-ripple`
invocations and zero PRD-touching commits since `e197546`, confirmed).

Resolution (human's pick): **reframe & close.** Ph3's buildable deliverable is
the skill + AGENTS.md convention pointer — both shipped. The "real invocation"
is demoted from plan scope to a **standing expectation** the AGENTS.md
convention enforces on the next built-system change (likely UI-v2); the proof
commit will reference the archived plan when it lands. Flipped the Status token
to `DONE`, reframed the Ph3 DoD in-file, ran `npm run checkpoint` →
auto-archived the plan to `project/archive/`, relinked `docs/plans/README.md`,
and cleared the reading-queue entry (D-089 — the human engaged with it here).

---

## Addendum — first `/prd-ripple` under the new "ripple during T0" rule (D-128)

Ran `/prd-ripple` (Flow 1). The classification pass was honest: no un-rippled
built-system change sat in the tree (the home-reveal R1→R3 change was already
rippled — ADR done, no stale PRD prose), and the `prd:drift` punch-list (13
spec-altitude gaps) was, per F1b Ph1, all deferred to the R1-gated compression
sweep. Surfaced the one genuinely-rippleable gap (stance names) to the human.

**The human then reversed the defer decision:** *"I don't want a T0 compression
backlog at all, I want to ripple during T0 too."* Recorded as **D-128** (refines
D-117, reverses F1b Ph1's defer; decouples presence-gap rippling from the Flow-2
compression sweep; unblocks bulk gen-region transclusion).

First ripple under the rule: the **three stance names** from the source of truth
(`balance.ts` `STANCE_MODS`) into §2.8 data-shape + §3 R5 row — **jodan**
(aggressive 1.35/1.15), **gedan** (defensive 0.8/0.85), **chudan** (balanced
identity default). Also surfaced that the PRD implied a two-pole choice; the
build has three (a balanced middle). `prd:drift` STANCES now 3/3.

## Punch-list triage (remaining, per D-128)
- **STANCES** — ✅ done (this commit).
- **MOBS 4/8** — `road bandit` is **T2-gated** (A10/`9a5fc4e`) → belongs in §5
  frontier, NOT a T0 ripple; grain-rat swarm / crop-raiding troop / lean wolf
  need a T0 bestiary home (candidate for a gen-region, not prose-weaving).
- **WEAPONS 0/3** — a roster **MISMATCH**, not a presence add: §4 specs
  `kama-yari`; the build ships `woodlot-axe` + `forged-yari`. Needs a decision
  (is the build's roster the intent? → ripple §4 + ADR), and §4 is
  frontier-frozen (D-021). Surfaced to the human.
- **NAMES 3/19** — Tokubei / Rokusuke / Tōzō are the rung-beat cast, **gated on
  the open R8 read**; not rippled into canon until the human signs off.

## Next intended step
Extend `gen-prd-regions.ts` with tier-filtered roster regions (T0 weapons, T0
mobs, stance table) — the durable "no backlog by construction" mechanism D-128
unblocked. Resolve the weapon roster mismatch with the human first.
