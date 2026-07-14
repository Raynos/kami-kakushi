// Save envelope + UTF-8-safe base64 codec (PRD §6.8). The GameState is JSON-safe by
// construction (the RNG cursors are plain draw-count integers, not BigInt — D-Q-numeric),
// so serialization is plain JSON. The envelope carries the app-identity magic field,
// the schema version, the monotonic save-counter (the newest-wins selector), and the
// save-layer timestamp (the documented core-lint Date.now exemption — tiebreaker only).

import type { GameState } from '../core';
import { APP_ID, SCHEMA_VERSION, APP_GENERATION } from '../core';
import type { LogEntry } from '../core/log';
import { renderLogLine, type LogParams } from '../core/content/log-render';

export interface SaveEnvelope {
  readonly app: typeof APP_ID;
  readonly schemaVersion: number;
  /** App generation (ADR-161 clean break). A blob whose generation is below APP_GENERATION —
   *  including every pre-storywave save, which has no `generation` field at all — RETIRES on
   *  load (backed up + fresh boot + courteous notice), never migrated. */
  readonly generation: number;
  /** Monotonic, the real newest-wins selector (PRD §6.8.1 / FU2). */
  readonly saveCounter: number;
  /** Date.now() at write — the tiebreaker only (save metadata, not game logic). */
  readonly savedAt: number;
  readonly state: GameState;
}

export function makeEnvelope(
  state: GameState,
  saveCounter: number,
  savedAt: number,
): SaveEnvelope {
  return {
    app: APP_ID,
    schemaVersion: SCHEMA_VERSION,
    generation: APP_GENERATION,
    saveCounter,
    savedAt,
    state,
  };
}

export function encodeEnvelope(env: SaveEnvelope): string {
  return JSON.stringify(env);
}

export function decodeEnvelope(raw: string): unknown {
  return JSON.parse(raw);
}

// UTF-8-safe base64 (macrons + kanji survive) — works in browser (btoa/atob) and Node (Buffer).
export function toBase64(str: string): string {
  if (typeof Buffer !== 'undefined')
    return Buffer.from(str, 'utf-8').toString('base64');
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

export function fromBase64(b64: string): string {
  if (typeof Buffer !== 'undefined')
    return Buffer.from(b64, 'base64').toString('utf-8');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/** Export a save to a portable base64 string (the backstop durability channel). */
export function exportBase64(env: SaveEnvelope): string {
  return toBase64(encodeEnvelope(env));
}

/** Parse a base64 export back to a candidate envelope object (unvalidated). */
export function importBase64(b64: string): unknown {
  return decodeEnvelope(fromBase64(b64));
}

// ── gzip STORE codec (shrink-save-file, D-... 2026-07-05) ──────────────────────
// The internal store (localStorage / IndexedDB / sessionStorage) gzips the JSON to
// fit the quota — the log is ~57% of a save and compresses ~13×. The EXPORT channel
// above stays plain base64-JSON on purpose: a copied-out backup must be recoverable
// with any base64 tool, never coupled to our gzip. gzip runs through Web Streams
// (`CompressionStream`) — a global in browsers and Node ≥18, so ONE codepath. A magic
// prefix marks a gzipped blob; its ABSENCE means a legacy plain-JSON save, so pre-gzip
// stores still load (backward-compatible). encode/decode are async (streams are), but
// their only callers — SaveManager.save/backup/readCandidates/restoreBackup — are
// already async, so nothing new is forced sync→async.
const GZIP_PREFIX = 'KKgz1:';

async function pipeBytes(
  bytes: Uint8Array,
  ts: {
    readable: ReadableStream<Uint8Array>;
    writable: WritableStream<BufferSource>;
  },
): Promise<Uint8Array> {
  const writer = ts.writable.getWriter();
  // A Uint8Array IS a BufferSource at runtime; the cast sidesteps TS's ArrayBufferLike
  // vs ArrayBuffer typed-array generic strictness (SharedArrayBuffer never occurs here).
  void writer.write(bytes as BufferSource);
  void writer.close();
  const reader = ts.readable.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
  }
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined')
    return Buffer.from(bytes).toString('base64');
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function base64ToBytes(b64: string): Uint8Array {
  if (typeof Buffer !== 'undefined')
    return new Uint8Array(Buffer.from(b64, 'base64'));
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// ── log descriptors (shrink-save-file Stage C-final) ──────────────────────────
// A KEYED log entry (contentKey present) drops its derivable `text` on the way to the
// store and rebuilds it from the log-content registry on the way back — the log persists
// as compact descriptors, not prose. A KEYLESS entry (content-module / legacy prose) keeps
// its `text` verbatim. Old pre-descriptor saves are ALL keyless-with-text, so they load
// unchanged (derive forward, no data loss) — no schema bump needed (the GameState shape is
// unchanged; contentKey/params are additive-optional and this is a reversible transport step).

/** Drop the derivable `text` from a keyed entry; leave a keyless entry untouched. */
function stripLogEntry(e: LogEntry): unknown {
  if (e.contentKey === undefined) return e;
  const rest: Record<string, unknown> = { ...e };
  delete rest.text;
  return rest;
}

/** Rebuild a keyed entry's `text` from the registry, in pushLog's canonical field order so a
 *  save→load round-trip stays byte-identical. A keyless entry passes through unchanged. */
function rehydrateLogEntry(raw: unknown): unknown {
  const e = raw as Partial<LogEntry> & {
    contentKey?: string;
    params?: LogParams;
  };
  if (e.contentKey === undefined && e.contextKey === undefined) return raw;
  let text = e.text ?? '';
  if (e.contentKey !== undefined) {
    try {
      text = renderLogLine(e.contentKey, e.params ?? {});
    } catch {
      text = e.text ?? ''; // an unknown key (a removed contentKey) must not nuke the whole save
    }
  }
  // step D — the 幕-head re-derives from its key too (falls back to the stored head).
  let context = e.context;
  if (e.contextKey !== undefined) {
    try {
      context = renderLogLine(e.contextKey);
    } catch {
      context = e.context;
    }
  }
  return {
    key: e.key,
    channel: e.channel,
    text,
    tick: e.tick,
    count: e.count,
    ...(e.speaker !== undefined ? { speaker: e.speaker } : {}),
    ...(e.voice !== undefined ? { voice: e.voice } : {}),
    ...(e.ephemeral !== undefined ? { ephemeral: e.ephemeral } : {}),
    ...(e.chat !== undefined ? { chat: e.chat } : {}),
    ...(context !== undefined ? { context } : {}),
    ...(e.contextKey !== undefined ? { contextKey: e.contextKey } : {}),
    ...(e.contentKey !== undefined ? { contentKey: e.contentKey } : {}),
    ...(e.params !== undefined ? { params: e.params } : {}),
  };
}

/** Map the envelope's log entries with `fn` (immutably), passing everything else through. */
function mapLogEntries(env: unknown, fn: (e: unknown) => unknown): unknown {
  const outer = env as { state?: { log?: { entries?: unknown[] } } };
  const entries = outer.state?.log?.entries;
  if (!Array.isArray(entries)) return env;
  const state = outer.state as Record<string, unknown>;
  const log = state.log as Record<string, unknown>;
  return {
    ...(env as object),
    state: { ...state, log: { ...log, entries: entries.map(fn) } },
  };
}

/** Strip every keyed entry's derivable `text` from an envelope (no gzip, no base64).
 *  The store channel does this on the way out; the FIXTURE generator uses it too, so a committed
 *  fixture save holds descriptors rather than prose — otherwise every reword churns 18 fixture
 *  files and the fixtures quietly disagree with what the game actually persists. */
export function stripEnvelopeLog(env: SaveEnvelope): unknown {
  return mapLogEntries(env, (e) => stripLogEntry(e as LogEntry));
}

/** Rebuild every keyed entry's `text` from the registry (the inverse of `stripEnvelopeLog`).
 *  A stripped fixture is rehydrated through THIS on load, so it crosses the same derive-from-src/
 *  path a real save does — the fixtures exercise the rehydration rather than bypassing it. */
export function rehydrateEnvelopeLog(env: unknown): SaveEnvelope {
  return mapLogEntries(env, rehydrateLogEntry) as SaveEnvelope;
}

/** Encode an envelope for the STORE channel: descriptors → JSON → gzip → base64, magic-prefixed. */
export async function encodeStore(env: SaveEnvelope): Promise<string> {
  const stored = stripEnvelopeLog(env);
  const bytes = new TextEncoder().encode(JSON.stringify(stored));
  const gz = await pipeBytes(bytes, new CompressionStream('gzip'));
  return GZIP_PREFIX + bytesToBase64(gz);
}

/** Decode a STORE blob. Sniffs the magic prefix → gunzip → parse; a prefix-less blob is a
 *  legacy plain-JSON save (pre-gzip). Either way, keyed log entries are rehydrated from the
 *  registry BEFORE validation (which requires `text` on every entry). */
export async function decodeStore(raw: string): Promise<unknown> {
  let parsed: unknown;
  if (raw.startsWith(GZIP_PREFIX)) {
    const gz = base64ToBytes(raw.slice(GZIP_PREFIX.length));
    const bytes = await pipeBytes(gz, new DecompressionStream('gzip'));
    parsed = decodeEnvelope(new TextDecoder().decode(bytes));
  } else {
    parsed = decodeEnvelope(raw); // legacy uncompressed save
  }
  return mapLogEntries(parsed, rehydrateLogEntry);
}
