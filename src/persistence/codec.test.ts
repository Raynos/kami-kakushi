import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { createInitialState, type GameState } from '../core';
import { applyRewards } from '../core/rewards';
import { renderLogLine } from '../core/content/log-content';
import { makeEnvelope, encodeEnvelope, encodeStore, decodeStore } from './codec';

/** Ungzip a stored blob back to its RAW envelope JSON (the on-disk descriptor form). */
function inspectStored(stored: string): { state: { log: { entries: Record<string, unknown>[] } } } {
  expect(stored.startsWith('KKgz1:')).toBe(true);
  const json = gunzipSync(Buffer.from(stored.slice('KKgz1:'.length), 'base64')).toString('utf-8');
  return JSON.parse(json);
}

/** The GameState inside a real F6 fixture save (a full 300-entry log — the worst case). */
function fixtureState(name: string): GameState {
  const path = fileURLToPath(new URL(`../fixtures/saves/${name}.json`, import.meta.url));
  const parsed = JSON.parse(readFileSync(path, 'utf-8')) as { state: GameState };
  return parsed.state;
}

describe('gzip store codec (shrink-save-file)', () => {
  it('round-trips an envelope byte-identically through gzip', async () => {
    const env = makeEnvelope(createInitialState(7), 1, 1000);
    const raw = await encodeStore(env);
    expect(raw.startsWith('KKgz1:')).toBe(true); // magic prefix marks a gzipped blob
    const back = await decodeStore(raw);
    expect(JSON.stringify(back)).toBe(JSON.stringify(env));
  });

  it('round-trips a full 300-entry-log save AND shrinks it hard', async () => {
    const env = makeEnvelope(fixtureState('wealthy-idler'), 1, 1000);
    const plain = encodeEnvelope(env); // today's stored form (prose log)
    const gz = await encodeStore(env); // the new stored form
    // The log is ~57% of the save and is repetitive authored prose (~13× in practice).
    // A conservative floor that still goes RED if gzip ever silently no-ops.
    expect(gz.length).toBeLessThan(plain.length * 0.4);
    const back = await decodeStore(gz);
    expect(JSON.stringify(back)).toBe(JSON.stringify(env));
  });

  it('decodes a LEGACY plain-JSON store (no magic prefix) — backward compatible', async () => {
    const env = makeEnvelope(createInitialState(9), 2, 2000);
    const legacy = encodeEnvelope(env); // what a pre-gzip build wrote to the store
    expect(legacy.startsWith('KKgz1:')).toBe(false);
    const back = await decodeStore(legacy);
    expect(JSON.stringify(back)).toBe(JSON.stringify(env));
  });
});

describe('log-descriptor persistence (Stage C-final)', () => {
  // A state with one KEYED entry (persists as a descriptor) + one KEYLESS entry (persists verbatim).
  function mixedState(): GameState {
    return applyRewards(createInitialState(3), {
      log: [
        {
          channel: 'combat',
          contentKey: 'combat.win',
          params: {
            mob: 'boar',
            hpBefore: 50,
            hpAfter: 40,
            coin: 8,
            lootQty: 1,
            lootLabel: 'boar hide',
          },
        },
        { channel: 'narration', text: 'A keyless content line, kept verbatim.' },
      ],
    });
  }

  it('drops derivable text from KEYED entries in the store, keeps KEYLESS text verbatim', async () => {
    const stored = inspectStored(await encodeStore(makeEnvelope(mixedState(), 1, 1000)));
    const entries = stored.state.log.entries;
    const keyed = entries.find((e) => e.contentKey === 'combat.win')!;
    expect(keyed.text).toBeUndefined(); // the words are re-derived on load, not stored
    expect(keyed.params).toBeDefined();
    const keyless = entries.find((e) => typeof e.text === 'string' && !('contentKey' in e))!;
    expect(keyless.text).toBe('A keyless content line, kept verbatim.'); // verbatim
  });

  it('round-trips a keyed+keyless state byte-identically (rehydrates text in canonical order)', async () => {
    const env = makeEnvelope(mixedState(), 1, 1000);
    const back = await decodeStore(await encodeStore(env));
    // byte-identity proves the rebuilt text equals the original AND lands in pushLog field order.
    expect(JSON.stringify(back)).toBe(JSON.stringify(env));
    // the win line's text is the registry render, confirming it round-tripped through a descriptor
    const winText = renderLogLine('combat.win', {
      mob: 'boar',
      hpBefore: 50,
      hpAfter: 40,
      coin: 8,
      lootQty: 1,
      lootLabel: 'boar hide',
    });
    expect(JSON.stringify(back)).toContain(JSON.stringify(winText).slice(1, -1));
  });

  it('round-trips a full 300-entry fixture (keyed descriptors) byte-identically', async () => {
    const env = makeEnvelope(fixtureState('wealthy-idler'), 1, 1000);
    const back = await decodeStore(await encodeStore(env));
    expect(JSON.stringify(back)).toBe(JSON.stringify(env));
    // sanity: a keyed entry's text was rebuilt, not stored
    const stored = inspectStored(await encodeStore(env));
    const anyKeyed = stored.state.log.entries.find((e) => 'contentKey' in e);
    if (anyKeyed) expect(anyKeyed.text).toBeUndefined();
  });
});
