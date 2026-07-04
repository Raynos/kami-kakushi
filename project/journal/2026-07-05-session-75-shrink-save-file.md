# Session 75 — shrink the save file (plan)

**Date:** 2026-07-05
**Focus:** Answer "can we make save files smaller by dropping the log?" → a
measured plan.

## What happened

The human asked whether saves can be shrunk by removing the full log, and how the
log would then render on load/refresh.

Investigated the save/log/determinism/render paths (Explore agent + direct
reads). Key finding: **the log is the only unbounded field** — a 300-entry prose
ring (`state.log`, `src/core/state.ts:118`), ~57% of the save. There is **no
persisted intent history**, so the run is not replayable as-is.

Ran through options with the human (A compress · C log-descriptors · D
seed+intent-trace+replay). Initially planned the full event-sourced answer
(A+C+D) at the human's request — then **measured real fixture saves**, which
killed D:

| Fact | Value |
| --- | --- |
| Log as % of save | 57–60% |
| Non-log state (snapshot) | 1.1–2.4 KB |
| Current save gzipped | 48 KB → **3.65 KB (13×)** |
| Descriptors (C) gzipped | → 2.68 KB (18×) |
| C's marginal gain over A | ~1 KB |

The human correctly pushed: the intent trace only avoids re-storing the ~2 KB
snapshot (nothing to reclaim) and doesn't even rebuild the log — the log rebuilds
trivially from an **ordered descriptor array** (C), no replay. **D dropped.**

## Outcome

- Plan: `docs/plans/opus-2026-07-05-shrink-save-file.md` — **A (compression) is
  the plan of record; C optional (architectural, not size); D dropped.** The plan
  records the measurement and why D is out.
- Added to the human reading queue (`project/todo-human.md`): pick A only vs A+C.

## Next intended steps

- Human picks A-only or A+C.
- If A: implement the sync-LZ + magic-byte codec wrapper in
  `src/persistence/codec.ts`; round-trip + backward-compat + size tests.

## Note

Committed only my own files by explicit path (shared tree — w1:p2/p3 live).
The plan file was untracked while a co-agent's regenerated `docs/plans/README.md`
already referenced it (dead-link RED on CI); this commit greens that.

## Update — decisions locked, build started

Walked the human through the plan's open decisions. Locked:

1. **Scope — A + C.** Compression AND the log-content registry.
2. **Codec — native gzip** (`CompressionStream` browser / `node:zlib` Node).
3. **Exports stay plain** base64-JSON (recoverable backup); only the internal
   store is gzipped. Synergy: the async ripple hits only `flushSave` (already
   async), since `exportBase64` stays sync.
4. **Routing — Opus builds all** (incl. the mechanical extraction).
5. **Go — build now**, staged: codec (A) → log-content registry (C) →
   descriptors + migration (schema 7→8).

Building in that order; each stage its own commit + tests + green verify.

## Stage A shipped — gzip store codec

`codec.ts`: `encodeStore`/`decodeStore` — JSON → gzip (`CompressionStream`,
a global in browser + Node ≥18, one codepath) → base64, magic-prefixed
(`KKgz1:`). A prefix-less blob = a legacy plain-JSON save, so pre-gzip stores
still load (backward-compatible). `exportBase64`/`importBase64` untouched — the
copy-out backup stays plain base64-JSON (recoverable with any tool). The 4 store
call sites in `saveManager.ts` (save/backup/readCandidates/restoreBackup, all
already async) now use the async codec.

**Measured (real fixtures): ~10×** — wealthy-idler 48151 → 4886, pre-ascension
48052 → 4538 bytes (base64 adds ~33% over raw gzip; unavoidable for the
string-typed backends). `codec.test.ts`: gzip round-trip · full-300-log fixture
shrinks < 0.4× plain (could-go-RED size floor) · legacy plain-JSON decodes. The
21 existing save tests now round-trip through gzip end-to-end. 17 gates green.

**Pending before final done:** a real-browser save/load smoke (tests use Node's
`CompressionStream`; the browser's is the same RFC-1952 gzip, low risk).

## Stage C1 — log-content registry infra + first file (proof-of-pattern)

Human overrode my "stop at A" rec (T1 cleanliness is a taste call, theirs): do C.
Quantified C first — ~55 emit sites over 7 files, dynamic params — so it runs
**incrementally green**, one file per commit, golden-test-guarded.

C1 shipped: `content/log-content.ts` — `LOG_CONTENT` registry + `renderLogLine`
(throws loud on an unknown key). `LogEntry`/`pushLog` carry optional
`contentKey`+`params`; `RewardBundle.log` accepts EITHER `text` OR
`contentKey`+`params` (`applyRewards` derives via the registry). Additive — no
schema bump, no persistence change yet. Migrated the FIRST file, `step.ts`
(`season.reckoned`, `season.spoilage`). Golden test asserts exact-literal
re-derived text (special glyphs as codepoints) + the emit→derive→descriptor path.
Fixtures regenerated (my log-field addition only — diff is pure contentKey/params,
no balance-number changes; the co-agent's balance.ts WIP didn't leak).

**Shared-tree note:** the working tree also holds `w1:p3`'s F7 balance-cockpit
WIP (`dev-cockpit.ts` untracked + `dev.ts`/`balance.ts`/`main.ts`/`index.ts`
modified), which is RED (`cockpit.levers` undefined + oxfmt). That is THEIR red,
not mine — my slice is green (74 tests, tsgo 0 errors, my files formatted). So
this commit is `SKIP_VERIFY=1`, own-paths-only, **kept local — NOT pushed** until
the tree is clean (don't fight someone else's red; never SKIP red onto main).

## Next: Stage C2…C8 — migrate the remaining 6 files, then descriptors + migration.
