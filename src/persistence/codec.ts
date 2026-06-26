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
