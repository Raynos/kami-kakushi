# Plan — Shrink the save file (compression, + optional log descriptors)

**Status:** 🔧 IN-PROGRESS — A + C built locally (7 commits); push pending past a
co-agent's red tree, then a browser smoke. See **Outcome** at the foot.
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

- **A · Compress the envelope.** The fix. 13×, zero fidelity/determinism risk,
  prose stays intact.
- **C · Log-as-descriptors.** Only ~1 KB better than A once compressed, but taken
  for the architectural win (one pure source for a line's words, T1; "reword once
  → all history updates").
- **D · Intent trace + replay — DROPPED.** Saves nothing; adds byte-identical-
  replay risk. Gone.

## Decisions locked (human, 2026-07-05)

1. **Scope — A + C together.** Compression AND the log-content registry (schema
   bump 7→8, migration, every emit site → `render(key, params)`).
2. **Codec — native gzip.** `CompressionStream` in the browser, `node:zlib`
   `gzipSync` in Node/tests. Best ratio, no vendored dependency.
3. **Export channel — keep exports plain.** Compress only the internal store
   (the quota-bearing path); the copy-out backup (`exportBase64`) stays **plain
   base64-JSON** for maximum recoverability (any tool decodes base64→JSON).

**Synergy — the async ripple is contained.** "Keep exports plain" means
`exportBase64` / `importBase64` stay **sync**; only the internal store gains an
**async** gzip step — and that path (`flushSave`, `src/app/main.ts:248`) is
already async. So gzip's one downside (async) touches only a path that was
already async. Net: two encode paths — sync-plain (export) + async-gzip (store).

---

## Part A — Compression (the plan of record)

### Design

Wrap `encodeEnvelope`'s JSON before base64 in `src/persistence/codec.ts`:

```
encode: JSON.stringify(env)  →  LZ-compress  →  base64 (with a magic prefix)
decode: base64 → detect magic → decompress → JSON.parse   (fall back to plain
        parse when the magic is absent, so pre-A exports still import)
```

- **Codec choice (LOCKED — native gzip):** `CompressionStream('gzip')` in the
  browser, `node:zlib` `gzipSync` in Node/tests. Best ratio, no vendored dep. The
  **store** encode/decode is async (browser path); the **export** stays sync-plain
  (below), so the async ripple hits only `flushSave` (already async).
- **Two encode paths:** `encodeStore` (async, gzip → base64, for localStorage) +
  `exportBase64` (sync, plain JSON → base64, the recoverable backup — unchanged).
- **Magic byte / version tag** on the stored string so a mixed store (old
  uncompressed + new gzipped) round-trips. The decoder sniffs it → gzip path or
  plain fallback. Exports carry the plain marker.
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

## Part C — Log as descriptors (IN SCOPE — locked 2026-07-05)

Taken for the T1 cleanliness (one pure source per line) — the size gain over A is
~1 KB but the single-source architecture is the point.

> **Content-key design note.** Today `LogEntry.key` is a **numeric seq id**
> (uniqueness for the ring), NOT a content key — see the sampled entry
> `{"key":8391,…}`. C adds a **new stable string content-key** (e.g.
> `contentKey: 'reward.rake'`) that maps into `LOG_CONTENT`; the numeric `key`
> keeps its ring-uniqueness role. Don't overload the existing field.

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

### The real cost — a log-content registry (scoped 2026-07-05)

**Scope measured:** ~**55 `text:` emit sites** across 7 core files (`step.ts`,
`intents.ts`, `fight.ts`, `ranks.ts`, `ascension.ts`, `content/quests.ts`,
`content/surfaces.ts`) + 13 direct `pushLog` calls. Much text is **dynamically
composed**, incl. helper calls — e.g. `` `…sell ${rice} rice at ${formatCoin(price)}…
(+${formatCoin(coinGain)})` ``. So each site needs a stable key, **exact param
capture** (`rice`, `price`, `coinGain`), and a render fn that reproduces the
string (calling `formatCoin` itself).

**Registry design:**

```
// src/core/content/log-content.ts (new)
type LogParams = Record<string, string | number | boolean>
LOG_CONTENT: Record<string, (p: LogParams) => string>   // the moved templates
renderLogLine(contentKey, params) => LOG_CONTENT[contentKey](params)
```

`LogEntry` gains optional `contentKey` + `params` (+ `legacy?: true` for migrated
prose); `RewardBundle.log` accepts `{channel, contentKey, params?}` and
`applyRewards` derives `text` via `renderLogLine`. `text` stays on the LIVE entry
(the renderer + the coalesce key are unchanged); only the PERSISTED form drops
`text` for keyed entries.

**Incremental-green build order (each its own commit, verify green):**

- **C1 · Infra** — `log-content.ts` + additive optional `LogEntry.contentKey/
  params/legacy`; `applyRewards` accepts EITHER `text` OR `contentKey` (derive).
  No schema bump, no persistence change yet — pure additive, nothing breaks.
- **C2…C8 · Migrate one file per commit** — move each file's inline templates
  into `LOG_CONTENT`, swap `text:` → `contentKey`+`params`. The **golden test**
  (re-derived text === the old inline text) guards every move.
- **C-final · Persist descriptors** — codec stores `contentKey`+`params` (drops
  `text` for keyed entries), migration 7→8 wraps legacy prose as `{legacy, text}`,
  size measured. This is the only step that bumps the schema / touches the save
  shape.

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

---

## Outcome (built 2026-07-05, Opus)

**A + C shipped** across 7 commits (Stage A gzip, then C1–C6 registry migration, then
C-final descriptors). Final store size on real fixtures: **~8.5–11.3×** smaller
(e.g. wealthy-idler 48 885 → 4 802 bytes). gzip (A) does the heavy lifting; the
descriptor strip (C-final) adds only ~1–2% on top — as predicted, **C's value is the
T1 architecture, not size.**

**Two honest deviations from the locked decisions, both making the change simpler/safer:**

1. **No `SCHEMA_VERSION` bump (decision #4 said 7→8).** The migration was to "wrap old
   prose as legacy descriptors." But in the built design a **keyless entry (text, no
   contentKey) IS the legacy form** — old saves are all keyless-with-text and load
   unchanged, and the descriptor strip/rehydrate is a **reversible transport step** over
   an unchanged `GameState` shape (contentKey/params are additive-optional). So the bump
   + migration were unnecessary; the human's actual intent (no log loss, derive forward)
   is fully met. Bumping would have forced a no-op migration + churned version-asserting
   tests for zero benefit.
2. **Refined C scope — key only the LOGIC-inline authored lines.** ~55 `text:` sites, but
   most pull words from **content data** (topic/option/recipe/destination text) or
   **single-source helpers** (`rakeLine`, `activityLine`, `homeRestLine`). Those already
   satisfy T1 (their words live in ONE content module) and persist as keyless `{text}`.
   The true T1 targets were the strings authored **inline in logic** (step/ranks/
   ascension/fight/intents) — 23 keys, now in `content/log-content.ts`.

**Guards:** golden line-equality tests (special glyphs as codepoints) + a coverage
ratchet (every key needs a SAMPLE) + the **fixtures regen diff** (a de-facto golden on
every line in a fixture — pure contentKey/params, zero text change confirmed each step)
+ byte-identical codec round-trip (the strip/rehydrate rebuilds text in pushLog's exact
field order, so the 21 existing save round-trip tests still pass).

**Left for the human:** push once the shared tree clears (Stage A is already on
`origin/main`; C1–C-final are local — a co-agent's F7 balance-cockpit WIP is red in the
tree, so a clean push is blocked; never SKIP that red onto main).
