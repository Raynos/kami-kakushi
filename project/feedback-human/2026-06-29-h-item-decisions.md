# Human feedback — 2026-06-29 H-item decision pass

> Walked the open `project/human-in-the-loop/` queue with the human and resolved it live via
> `AskUserQuestion`. Captures the decisions (the **why** + verbatim spec) so they survive compaction.
> Queue resolutions are in [`../human-in-the-loop/decisions.md`](../human-in-the-loop/decisions.md).

## Context

The H-item queue looked busy but collapsed to one real open decision: **H10 (Operating Model v2)**,
which absorbed **H7** (ship-gate skill) and **H9** (resolve-queue skill). H1–H6/H8 were already resolved;
**R1** is a play/taste review (needs the human at the controls, not a chat decision).

## Decisions

### H10 — Operating Model v2-lite → **DEFER the bundle**

The human chose **Defer** on adopting the v2-lite operating-model bundle as a whole. Not a freeze — per
H10's own clause, useful pieces are greenlit ad hoc. The human did greenlight **one** piece, reshaped to
their own lean spec (below): the pre-commit gate.

### D-a — verify on commit → **a dynamic, content-aware FAST subset (not full `verify`)**

Verbatim steer:

> Do a dynamic fast subset per commit. Pre-commit should be fast so think 5s or less, and it should run
> logic that's relevant to what's in the commit:
> - `.ts` files => `tsc`
> - `.md` files => then verify markdown
> - check for journal or anything that's in the existing pre commit
>
> Running the tests would not fit. If you want you can consider any lightweight things you think of in <5s.

### D-d — playcheck in the hook → **a tiny, really-fast smoke test, not the full ratchet**

Verbatim steer:

> Yes a smoke test in pre commit that's really fast and just checks for dumb stuff would be super helpful.

### H9 — `resolve-queue` skill → **DROP**

Resolve decision queues by hand (this session demonstrated it working). Build automation only if it
becomes a recurring pain.

### H7 — `ship-gate` skill → **don't build** (rides H10's defer)

D-054's milestone-integrity policy + CI-manifest check already own the policy; no bespoke skill now.

## What was built this session (to honor D-a/D-d)

A content-aware, **<5s** pre-commit gate — measured **~0.87s** on a TS+core commit:

- [`.githooks/pre-commit`](../../.githooks/pre-commit) — runs only what's relevant to the **staged** files:
  staged `.ts` → `tsc --noEmit` (~0.6s); staged `.ts/.md/json/css/html` → `prettier --check` (staged only);
  staged `src/**` → a pure-core **boot smoke**; then the **unchanged** journal-hygiene gate. **No test
  suite.** Bypass: `SKIP_VERIFY=1` (checks) / `SKIP_JOURNAL=1` (journal).
- [`src/scripts/smoke.ts`](../../src/scripts/smoke.ts) — boots the pure core (`createInitialState` → a few
  `reduce`s) and asserts it doesn't throw / stays coherent. ~0.16s. The "dumb stuff" guard.

## Still open (not decided here)

- **R1** — the M0–M2 play/taste call. Needs the human to play (`npm run dev`) or skim the gallery. Teed up.
- **Revisit trigger** — reconsider the fuller v2-lite (playcheck ratchet, ship-gate) only if the
  hand-holding cost resurfaces.
