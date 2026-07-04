# Plan — Shrink the save file (compression, + optional log descriptors)

**Status:** 🆕 Proposed — awaiting human sign-off (R-item). Not started.
**Author:** Opus 4.8 (session 2026-07-05).
**Related:** D-038 (one RNG), the pure-core boundary (AGENTS.md · Conventions),
`src/persistence/codec.ts`.

> **History:** this plan first proposed a full event-sourced save (seed + intent
> trace + replay, "D"). **Measurement killed D** — see below. The intent trace
> saved nothing and added large determinism risk. This version is the honest,
> numbers-backed plan: **A (compress) is the win; C (log descriptors) is an
> optional architectural nicety; D is dropped.**

---

## The measurement that decides this

Real fixture saves (`src/fixtures/saves/`), the log stripped out and re-measured:

| Fact | Value |
| --- | --- |
| Log as % of the save | **57–60%** (it IS the problem) |
| Non-log state (the "snapshot") | **1.1–2.4 KB** (tiny) |
| Current save (prose log), gzipped | 48 KB → **3.65 KB (13×)** |
| Descriptors (C), gzipped | 48 KB → **2.68 KB (18×)** |
| C's marginal gain *over compression alone* | **~1 KB** (and shrinks once params are stored) |

Two conclusions fall straight out:

1. **Compression (A) is the real lever.** The log is repetitive authored prose;
   gzip already captures the redundancy — 13× for a self-contained codec change.
2. **The intent-trace idea (D) is pointless.** Its only job was to avoid
   re-storing the state snapshot — but the snapshot is **2 KB**. Nothing to
   reclaim, and it doesn't even shrink the log. **Dropped.**

## The problem

Save files are large. The cause is single: **`state.log`** — the only unbounded
field in `GameState` (`src/core/state.ts:118`), a ring buffer of up to **300**
prose entries (`LOG_RING_MAX`, `src/core/constants.ts:26`). It's ~57% of the
save. Everything else is small.

## Recommendation

- **A · Compress the envelope — DO THIS.** The fix. 13×, zero fidelity/
  determinism risk, prose stays intact.
- **C · Log-as-descriptors — OPTIONAL, not for size.** Only ~1 KB better than A
  once compressed, and needs a real log-content-registry refactor. Worth it *only*
  for the architectural win (one pure source for a line's words, T1; "reword once
  → all history updates"). Defer unless that cleanliness is wanted for its own
  sake.
- **D · Intent trace + replay — DROPPED.** Saves nothing; adds byte-identical-
  replay risk. Gone.

---

## Part A — Compression (the plan of record)

### Design

Wrap `encodeEnvelope`'s JSON before base64 in `src/persistence/codec.ts`:

```
encode: JSON.stringify(env)  →  LZ-compress  →  base64 (with a magic prefix)
decode: base64 → detect magic → decompress → JSON.parse   (fall back to plain
        parse when the magic is absent, so pre-A exports still import)
```

- **Codec choice:** a tiny **vendored sync LZ** (lz-string-class) over
  `CompressionStream`. Reasons: sync (the sim/test/Node paths and the
  synchronous save path stay simple), dependency-light, works in browser + Node,
  base64-native. `CompressionStream` is async and browser-only — awkward here.
- **Magic byte / version tag** on the encoded string so a mixed store (old
  uncompressed + new compressed) round-trips. The importer sniffs it.
- The RNG stays JSON-safe (draw-count integers, `src/core/rng.ts`), so nothing
  about serialization changes — only an added compress/decompress layer.

### Touch points

- `src/persistence/codec.ts` — the compress/decompress + magic-byte sniff.
- `src/persistence/saveManager.ts` / `backends.ts` — store the compressed string;
  ensure the export/import (base64 backup) channel round-trips.
- No `GameState`, renderer, or core change. No `SCHEMA_VERSION` bump (the state
  shape is unchanged — this is a *transport* change, backward-compatible via the
  magic-byte fallback).

### Tests & gates

- **Round-trip:** `env → encode(compress) → decode → deep-equal env`, for a
  representative save (full 300-entry log) and an empty new-game save.
- **Backward-compat:** a pre-A uncompressed base64 export still imports (magic
  absent → plain path).
- **Size assertion (could-go-RED):** a full-log fixture encodes to < e.g. 8 KB —
  guards the compression actually engaging.
- **F6 fixtures** (`fixtures:check`) still load; regen if the on-disk form
  changes.

### DoD (Part A)

- Save size measured before/after on a real 300-entry save; reduction stated in
  the commit body (expect ~13×).
- Round-trip + backward-compat tests green; `npm run verify` green.
- A save written by the new code loads; an old export still imports.

---

## Part C — Log as descriptors (OPTIONAL — architectural, not size)

Only pursue if the human wants the T1 cleanliness (one pure source per line) for
its own sake — the size gain over A is ~1 KB.

### How the log rebuilds (the answer to "is it even possible?")

**Trivially, and without any replay.** The log is stored as an **ordered array**
of compact descriptors; on load you iterate it in order and render each:

```
LogDescriptor =
  | { key; channel; tick; count?; params? }   // derived line → renderLogLine(key, params)
  | { legacy: true; channel; tick; count?; text }  // migrated old prose (frozen verbatim)

load:  for (const d of logRecord)  ring.push({ ...d, text: d.legacy ? d.text
                                                      : renderLogLine(d.key, d.params) })
```

Order is preserved because it's a serialized array (and every entry carries
`tick`). No seed, no replay, no determinism guarantee needed.

### The real cost — a log-content registry

Today log text is authored **inline** at emit sites (`step.ts:37`, `:65`) via the
rewards bus (`src/core/rewards.ts:39`). C requires the text to be a pure function
of `(key, params)`:

```
// src/core/log-content.ts (new)
LOG_CONTENT: Record<string, (params) => string>
renderLogLine(key, params) => LOG_CONTENT[key](params)
```

Every emit site changes from handing a finished `text` to handing `{key,
params}`; `LogEntry` carries `key`+`params`; text is derived. This is the whole
cost of C — a broad, mechanical extraction across every emit site.

### Migration (only if C ships) — SCHEMA_VERSION 7 → 8

Legacy saves have prose entries and no `key`/`params`. Migrate each old entry to a
`{ legacy: true, text }` descriptor — frozen verbatim, rendered as-is. New lines
get keyed descriptors. No history lost. `migrate.ts` entry `7:`, + `CHANGELOG.md`
(A22).

### Risks (C)

- **R-C1 · Emit-site refactor blast radius** — every inline string moves into the
  registry. Guarded by a **golden test: registry-rendered text === old inline
  text**, byte-for-byte, before/after.
- **R-C2 · Params completeness** — a line whose text depends on state not in its
  `params` re-derives wrong. Contract: `render` is a pure function of `params`
  alone; capture what it needs at emit time.
- **R-C3 · Re-derivation fidelity** — a later reword changes old saves' log
  (the human accepted this; it's the "reword once → history updates" property).

### Model routing (if C is approved)

Registry *design* + the emit-site contract: **Opus**. The mechanical string
extraction: **Fable-eligible** under the Opus spec + the golden test as guardrail
(route only after the registry shape is locked; D-124).

---

## What was dropped and why (D)

The event-sourced approach — persist `seed + snapshot-at-last-rung + intent trace`
and replay on load — was measured out:

- The non-log **snapshot is ~2 KB**, so storing it every save is already cheap;
  the trace reclaims nothing.
- The trace **does not rebuild the log** (it rebuilds *state*); the log still
  needs descriptors regardless.
- It demanded a **byte-identical full-run replay** guarantee (`autoModeIntent`
  purity, a nondeterminism audit, a replay-equivalence invariant e2e) — large
  risk for zero size benefit.

Kept here as the record of why the simpler plan is right.
