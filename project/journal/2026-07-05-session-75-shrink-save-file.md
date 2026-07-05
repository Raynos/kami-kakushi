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

## Stage C2–C6 — migrate the remaining emit sites (autonomous grind)

Human said "grind it out and complete without me." Migrated all LOGIC-inline
authored log lines into `content/log-content.ts` (23 keys), one file per commit,
each golden-tested + fixtures-regen-verified (diff = pure contentKey/params, zero
text change = verbatim move):

- **C2/C3** (`a1fbcc4`) — ranks (rank.wallWeapon, rank.marker) + ascension
  (ascension.hall bakes NAMES, ascension.dream branches on a `knot` param).
- **C4** (`968ad16`) — fight.ts, all 7 combat sites. The composed sub-phrases (win
  loot tally, rout-loss grammar) moved INTO the registry render fns.
- **C5** (`730fb52`) — intents.ts, the 10 inline templates (repair/equip/cook/eat/
  sell/buy/deposit/withdraw/weaponBroken/belonging-fallback).
- **C6** (`bde6caf`) — coverage ratchet (every key needs a SAMPLE + renders
  non-empty).

**Refined scope (a judgment call):** ~55 `text:` sites, but most pull words from
**content data** (topic/option/recipe/dest text) or **single-source helpers**
(`rakeLine`, `activityLine`, `homeRestLine`). Those already satisfy T1 (words in
ONE content module) and persist as keyless `{text}`. Only the **logic-inline
authored** strings were the real T1 targets → 23 keys.

## Shared-index incident (C5) — caught + reverted

At C5, `git add <mypaths>` + `git commit` swept the WHOLE shared index — a co-agent
had staged their F7 files, so the commit included main.ts/balance.ts/dev*.ts + their
journal (12 files). My pre-commit grep flagged it but ran in the same `&&` chain, so
it didn't stop the commit. **Fix:** `git reset --mixed HEAD~1` (undo, unstage all,
working tree intact — co-agent WIP preserved), then re-commit via **pathspec**
`git commit -F <msg> -- <mypaths>` (commits ONLY named paths, race-safe against the
shared index). Adopted pathspec commits for all subsequent commits.

## Stage C-final (`this commit`) — descriptors persist

`codec.ts`: `encodeStore` strips a KEYED entry's derivable `text` (keyless entries
keep text verbatim); `decodeStore` rehydrates via `renderLogLine` BEFORE validation,
rebuilding keyed entries in **pushLog's exact field order** so save→load stays
byte-identical (the 21 existing round-trip tests still pass). Unknown-key fallback
(don't nuke a save if a contentKey is ever removed). New tests: strip drops keyed
text / keeps keyless / byte-identical round-trip (mixed + a 300-entry fixture).

**No SCHEMA_VERSION bump** (decision #4 said 7→8): a keyless entry IS the legacy
form, so old saves load unchanged and the transform is reversible over an unchanged
GameState shape — the bump+migration were unnecessary; intent (no loss, derive
forward) is met. Documented in the plan Outcome.

**Final size:** ~8.5–11.3× on real fixtures (wealthy-idler 48 885 → 4 802). gzip
dominates; the descriptor strip adds ~1–2% — confirming C was for T1, not size.

## Still open

- **Push** C1–C-final once the shared tree clears (co-agent F7 red blocks a clean
  push; Stage A is already on origin/main). Task #8.
- A real-browser save/load smoke (tests use Node CompressionStream; browser gzip is
  the same RFC-1952).

## Follow-up (human asked: browser test + save/load e2e) — both green, plan DONE

- **e2e** `src/persistence/save-e2e.test.ts` — drives the whole T0 arc via the real
  reducer (focusedOptimalIntent + applyGrindFight, no forced flags) → a log with BOTH
  keyed descriptors and keyless lines → round-trips through the real SaveManager (gzip +
  descriptor strip/rehydrate) byte-identically + rebuilds keyed text from the registry +
  the plain base64 export backstop. 4 tests, in the 17-gate roster.
- **Headless browser smoke** `src/scripts/save-smoke.mjs` (qa-playtesting §0 headless,
  Playwright on the live :5173 dev server) — loads a rich fixture → confirms localStorage
  holds a **gzipped `KKgz1:` descriptor blob** → reloads from storage → the **300-entry
  log (13 keyed) rehydrates byte-identically** and the UI paints. PASS. This closes the
  one verification I couldn't do headlessly-in-tests (proves the browser CompressionStream
  path + reload boot() path work).
- Plan marked **DONE** and archived to `project/archive/`. All work on origin/main.
