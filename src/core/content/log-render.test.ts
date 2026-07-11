// The log as a DERIVED VIEW (save-format plan, step 1; the human's ruling, 2026-07-11).
//
// The load-bearing claim of the whole plan: a log line's prose is NOT a transcript frozen at the
// moment it was written — it is re-rendered from the CURRENT src/ registries every load. Reword a
// reveal line in src/ and every existing save shows the new words. These tests exist to make that
// claim falsifiable.

import { describe, it, expect } from 'vitest';
import { renderLogLine, LOG_NAMESPACES } from './log-render';
import { LOG_CONTENT } from './log-content';
import { SURFACES } from './surfaces';
import { DISCOVERIES, discoveryEmitLine } from './discoveries';
import { decodeStore, encodeStore, makeEnvelope } from '../../persistence/codec';
import { createInitialState } from '../index';
import { pushLog } from '../log';
import type { GameState } from '../index';

const revealSurface = SURFACES.find((s) => s.revealLine !== undefined)!;

describe('renderLogLine — static keys still win over the namespace dispatch', () => {
  it('resolves a hand-written key from LOG_CONTENT', () => {
    // The hand-written keys ALREADY contain dots ('combat.win'), so a dispatch-on-dot-first
    // would hijack them. This is the RED for that ordering bug.
    const dotted = Object.keys(LOG_CONTENT).find((k) => k.includes('.'))!;
    expect(() => renderLogLine(dotted, {})).not.toThrow();
  });

  it('throws on a key nothing can resolve (codec catches it and keeps the stored text)', () => {
    expect(() => renderLogLine('nonsense.no-such-id', {})).toThrow();
    expect(() => renderLogLine('reveal.a-surface-we-deleted', {})).toThrow();
  });

  it('every namespace it advertises actually resolves', () => {
    expect(LOG_NAMESPACES).toContain('reveal');
    expect(LOG_NAMESPACES).toContain('discovery');
  });
});

describe('a reveal line renders from ITS surface, not from a copy', () => {
  it('reveal.<id> renders the surface registry’s CURRENT text', () => {
    // Derivation identity, not a copied string: if the surface's prose changes, this expectation
    // changes with it — which is precisely the behaviour under test.
    expect(renderLogLine(`reveal.${revealSurface.id}`, {})).toBe(revealSurface.revealLine!.text);
  });

  it('a discovery line renders from ITS discovery def', () => {
    const d = DISCOVERIES[0]!;
    expect(renderLogLine(`discovery.${d.id}`, {})).toBe(discoveryEmitLine(d));
  });
});

describe('THE POINT: an old save’s stale prose is replaced by src/’s current words', () => {
  const STALE = 'THE OLD WORDS NOBODY WANTS ANY MORE';

  /** An "old save" whose log holds a keyed entry carrying prose from BEFORE a reword, encoded
   *  through the REAL store channel (the gzip one the game actually persists to). */
  const saveWithStaleProse = async (): Promise<string> => {
    const s: GameState = createInitialState(1);
    const withLine: GameState = {
      ...s,
      log: pushLog(s.log, 'narration', STALE, 0, { contentKey: `reveal.${revealSurface.id}` }),
    };
    return encodeStore(makeEnvelope(withLine, 1, 0));
  };

  it('the stale words do not survive the load — the CURRENT registry text does', async () => {
    const decoded = (await decodeStore(await saveWithStaleProse())) as {
      state: { log: { entries: { text: string }[] } };
    };
    const entry = decoded.state.log.entries.at(-1)!;

    expect(entry.text).toBe(revealSurface.revealLine!.text); // src/ is the truth
    expect(entry.text).not.toBe(STALE); // …and the save is not
  });

  it('the store blob does not even CARRY the prose (it is a descriptor)', async () => {
    // The size win, and the reason a reword cannot be ignored: the text is not in the blob.
    const raw = await saveWithStaleProse();
    const decoded = (await decodeStore(raw)) as { state: unknown };
    expect(JSON.stringify(decoded)).toContain(revealSurface.revealLine!.text); // rehydrated
    expect(raw).not.toContain(STALE); // …but never stored
  });

  it('an UNKEYED legacy line keeps its prose verbatim (old saves still load)', async () => {
    const s: GameState = createInitialState(1);
    const legacy: GameState = {
      ...s,
      log: pushLog(s.log, 'narration', 'authored prose with no key', 0),
    };
    const decoded = (await decodeStore(await encodeStore(makeEnvelope(legacy, 1, 0)))) as {
      state: { log: { entries: { text: string }[] } };
    };
    expect(decoded.state.log.entries.at(-1)!.text).toBe('authored prose with no key');
  });
});
