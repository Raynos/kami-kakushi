// THE KEYLESS GATE (save-format plan, locked decision 2 — the human ruled this a GATE, not a norm).
//
// Every line the game writes to the log must persist as a DESCRIPTOR (contentKey + params), never
// as raw prose. If prose reaches the save, that line is frozen at the words it had when it was
// written: reword it in src/ and every existing save keeps showing the old text. That is the exact
// failure this plan exists to remove, so it is defended by a test that can go RED rather than by a
// note in a README nobody re-reads.
//
// The corpus is the FIXTURE SPECS — real states produced by driving the REAL engine across the
// whole arc (cold open → R7 → pre-ascension), so this covers the emitters a full playthrough
// actually reaches, not a hand-picked sample.
//
// ADDING A LINE? Give it a contentKey. If it genuinely cannot have one, add it to KEYLESS_ALLOWED
// below WITH a reason — an explicit, reviewable exception, never a silent one.

import { describe, it, expect } from 'vitest';
import { FIXTURE_SPECS, buildFixtureState } from '../../fixtures/specs';
import { renderLogLine } from './log-render';

/** Prose that may legitimately reach the save keyless. Each entry needs a REASON. */
const KEYLESS_ALLOWED: readonly { readonly match: RegExp; readonly why: string }[] = [
  // (empty — nothing has earned an exception yet. Keep it that way if you can.)
];

const allowed = (text: string): boolean => KEYLESS_ALLOWED.some((a) => a.match.test(text));

describe('the log persists DESCRIPTORS, not prose (the keyless gate)', () => {
  it('a full arc emits ZERO keyless log entries', () => {
    const offenders = new Map<string, { channel: string; count: number }>();

    for (const spec of FIXTURE_SPECS) {
      for (const e of buildFixtureState(spec).log.entries) {
        if (e.contentKey !== undefined) continue;
        if (allowed(e.text)) continue;
        const seen = offenders.get(e.text);
        if (seen) seen.count += 1;
        else offenders.set(e.text, { channel: e.channel, count: 1 });
      }
    }

    if (offenders.size > 0) {
      const worst = [...offenders.entries()]
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 15)
        .map(([text, m]) => `  [${m.channel}] ×${m.count}  ${text.slice(0, 90)}`)
        .join('\n');
      throw new Error(
        `${offenders.size} distinct keyless log line(s) reach the save — they would freeze their ` +
          `prose into every existing save.\nGive each emitter a contentKey (see ` +
          `core/content/log-render.ts), or allow it explicitly with a reason.\n\n${worst}`,
      );
    }

    expect(offenders.size).toBe(0);
  });

  it('every key a full arc emits actually RESOLVES (no key that renders to nothing)', () => {
    // The other half of the gate. A keyed entry whose key does not resolve is WORSE than a keyless
    // one: codec falls back to the stored text, so it looks fine today and silently stops tracking
    // src/ forever. This is the test that catches a typo'd or renamed key.
    const broken = new Set<string>();

    for (const spec of FIXTURE_SPECS) {
      for (const e of buildFixtureState(spec).log.entries) {
        if (e.contentKey === undefined) continue;
        try {
          renderLogLine(e.contentKey, e.params ?? {});
        } catch {
          broken.add(e.contentKey);
        }
      }
    }

    expect([...broken]).toEqual([]);
  });
});
