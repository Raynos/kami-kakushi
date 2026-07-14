import { describe, it, expect } from 'vitest';
import { hasWholeWord, matchesLabel, stripGenRegions } from './prd-drift';

// Unit-tests the pure matching layer of the prd-drift report (the CLI itself
// stays untested — it's a report, and coupling tests to the CURRENT PRD corpus
// would cry wolf on every unrelated prose edit). Synthetic corpora only; each
// case can go RED against a plain `includes()` implementation.

describe('hasWholeWord', () => {
  it('does NOT match a name hiding inside a longer one (the Toku false-CLEAN)', () => {
    // RED against `includes()`: "toku" sat inside tokubei/tokujirō/tokuemon,
    // so the Dowager could vanish from the PRD and still count as mentioned
    // (the 2026-07-05 audit's masked-name finding).
    expect(hasWholeWord('tokubei tokujirō tokuemon', 'toku')).toBe(false);
  });

  it('matches the same name standing alone', () => {
    expect(hasWholeWord('the dowager toku spoke', 'toku')).toBe(true);
  });

  it('treats markdown/punctuation as a boundary (names appear as **bold**)', () => {
    expect(hasWholeWord('dowager **toku**, sharp-memoried', 'toku')).toBe(true);
  });

  it('treats non-ASCII letters as word characters (\\p{L}, not \\b)', () => {
    // RED against a \b implementation: ō is outside regex \w, so \b would see
    // a boundary inside "ōsōan" and falsely match "sōan".
    expect(hasWholeWord('ōsōan', 'sōan')).toBe(false);
    expect(hasWholeWord('physician sōan disbelieves', 'sōan')).toBe(true);
  });

  it('escapes regex metacharacters in the needle', () => {
    expect(
      hasWholeWord('mamushi (pit viper) strikes', 'mamushi (pit viper)'),
    ).toBe(true);
  });
});

describe('matchesLabel', () => {
  it('accepts the core form when the trailing parenthetical is absent', () => {
    expect(
      matchesLabel('a mamushi struck from the grass', 'Mamushi (pit viper)'),
    ).toBe(true);
  });

  it('is case-insensitive over a lowercased corpus', () => {
    expect(
      matchesLabel('the grain-store leans', 'The grain-store (kura)'),
    ).toBe(true);
  });

  it('rejects a label absent from the corpus', () => {
    expect(matchesLabel('nothing relevant here', 'Forged yari')).toBe(false);
  });
});

describe('stripGenRegions', () => {
  it('removes region bodies so a shipped id with a retired word cannot fire the scan', () => {
    const doc = [
      'hand prose above',
      '<!-- gen:begin t0-activities (pnpm run gen:prd-regions — do not edit inside) -->',
      '> | `forage_satoyama` | Forage the woodlot edge |',
      '<!-- gen:end t0-activities -->',
      'hand prose below',
    ].join('\n');
    const out = stripGenRegions(doc);
    expect(out).not.toContain('satoyama');
    expect(out).toContain('hand prose above');
    expect(out).toContain('hand prose below');
  });

  it('leaves a retired term in HAND prose alone — the scan still fires there', () => {
    expect(stripGenRegions('the satoyama frame lives on')).toContain(
      'satoyama',
    );
  });
});
