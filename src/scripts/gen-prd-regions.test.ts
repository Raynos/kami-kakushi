import { describe, it, expect } from 'vitest';
import { genT0RungTitles } from './gen-prd-regions';
import { spliceRegion } from './gen-regions';
import { RANKS } from '../core';

// Proves the F1b Phase 2 PRD-region generator is DERIVED from RANKS (not
// hand-copied) and splices cleanly. Each assertion can go RED: a generator that
// dropped a rung, hard-coded a stale title, or drifted on a second run fails
// here — the same could-go-RED discipline the --check gate enforces on the PRD.

describe('genT0RungTitles', () => {
  it('names every RANKS rung id, title, and kanji — derived from the registry', () => {
    const body = genT0RungTitles();
    for (const r of RANKS) {
      // fixtures come from the source of truth (RANKS), never a copied literal —
      // rename a rung in ranks.ts and this fails until the generator is re-run.
      expect(body).toContain(`| ${r.id} | ${r.title} | ${r.kanji} |`.replace(/^/, '> '));
    }
  });

  it('emits exactly one table row per rung (no rungs dropped or duplicated)', () => {
    const rows = genT0RungTitles()
      .split('\n')
      .filter((l) => /^> \| R\d/.test(l));
    expect(rows).toHaveLength(RANKS.length);
  });

  it('frames the block honestly — build-derived, sweep-deferred (not a reconciliation)', () => {
    const body = genT0RungTitles();
    expect(body).toContain('GENERATED from `RANKS`');
    expect(body).toContain('/prd-compress'); // the narrative-title reconciliation is R1-gated, not here
  });

  it('splices byte-idempotently into a doc carrying the marker pair', () => {
    const begin =
      '<!-- gen:begin t0-rung-titles (npm run gen:prd-regions — do not edit inside) -->';
    const end = '<!-- gen:end t0-rung-titles -->';
    const doc = ['# §3', '', 'Prose above.', begin, 'seed', end, 'Prose below.', ''].join('\n');
    const once = spliceRegion(doc, 't0-rung-titles', genT0RungTitles());
    const twice = spliceRegion(once, 't0-rung-titles', genT0RungTitles());
    expect(twice).toBe(once); // stable
    expect(once).toContain('Prose above.');
    expect(once).toContain('Prose below.');
    expect(once).not.toContain('seed');
  });
});
