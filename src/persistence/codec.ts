// Save envelope + UTF-8-safe base64 codec (PRD §6.8). The GameState is JSON-safe by
// construction (the RNG cursors are plain draw-count integers, not BigInt — D-Q-numeric),
// so serialization is plain JSON. The envelope carries the app-identity magic field,
// the schema version, the monotonic save-counter (the newest-wins selector), and the
// save-layer timestamp (the documented core-lint Date.now exemption — tiebreaker only).

import type { GameState } from '../core';
import { APP_ID, SCHEMA_VERSION } from '../core';

export interface SaveEnvelope {
  readonly app: typeof APP_ID;
  readonly schemaVersion: number;
  /** Monotonic, the real newest-wins selector (PRD §6.8.1 / FU2). */
  readonly saveCounter: number;
  /** Date.now() at write — the tiebreaker only (save metadata, not game logic). */
  readonly savedAt: number;
  readonly state: GameState;
}

export function makeEnvelope(state: GameState, saveCounter: number, savedAt: number): SaveEnvelope {
  return { app: APP_ID, schemaVersion: SCHEMA_VERSION, saveCounter, savedAt, state };
}

export function encodeEnvelope(env: SaveEnvelope): string {
  return JSON.stringify(env);
}

export function decodeEnvelope(raw: string): unknown {
  return JSON.parse(raw);
}

// UTF-8-safe base64 (macrons + kanji survive) — works in browser (btoa/atob) and Node (Buffer).
export function toBase64(str: string): string {
  if (typeof Buffer !== 'undefined') return Buffer.from(str, 'utf-8').toString('base64');
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

export function fromBase64(b64: string): string {
  if (typeof Buffer !== 'undefined') return Buffer.from(b64, 'base64').toString('utf-8');
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
  ts: { readable: ReadableStream<Uint8Array>; writable: WritableStream<BufferSource> },
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
  if (typeof Buffer !== 'undefined') return Buffer.from(bytes).toString('base64');
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function base64ToBytes(b64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') return new Uint8Array(Buffer.from(b64, 'base64'));
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/** Encode an envelope for the STORE channel: JSON → gzip → base64, magic-prefixed. */
export async function encodeStore(env: SaveEnvelope): Promise<string> {
  const bytes = new TextEncoder().encode(encodeEnvelope(env));
  const gz = await pipeBytes(bytes, new CompressionStream('gzip'));
  return GZIP_PREFIX + bytesToBase64(gz);
}

/** Decode a STORE blob. Sniffs the magic prefix → gunzip → parse; a prefix-less blob is
 *  a legacy plain-JSON save (pre-gzip), decoded directly. */
export async function decodeStore(raw: string): Promise<unknown> {
  if (raw.startsWith(GZIP_PREFIX)) {
    const gz = base64ToBytes(raw.slice(GZIP_PREFIX.length));
    const bytes = await pipeBytes(gz, new DecompressionStream('gzip'));
    return decodeEnvelope(new TextDecoder().decode(bytes));
  }
  return decodeEnvelope(raw); // legacy uncompressed save
}
