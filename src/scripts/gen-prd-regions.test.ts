import { describe, it, expect } from 'vitest';
import { genT0RungTitles, genT0WeaponRoster, genT0Bestiary } from './gen-prd-regions';
import { spliceRegion } from './gen-regions';
import { RANKS, WEAPONS, MOBS, getMob } from '../core';

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
      '<!-- gen:begin t0-rung-titles (pnpm run gen:prd-regions — do not edit inside) -->';
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

describe('genT0WeaponRoster', () => {
  it('names every WEAPON label, kanji, and archetype — derived from the registry', () => {
    const body = genT0WeaponRoster();
    for (const w of WEAPONS) {
      // fixtures from the source of truth (WEAPONS): rename a weapon in weapons.ts
      // and this fails until the region is regenerated (the mismatch that shipped
      // kama-yari in §4 while the build had the woodlot axe, ADR-128).
      expect(body).toContain(`> | ${w.label} | ${w.kanji} | ${w.archetype} | ${w.blurb} |`);
    }
  });

  it('emits exactly one row per weapon (none dropped or duplicated)', () => {
    const rows = genT0WeaponRoster()
      .split('\n')
      .filter((l) => WEAPONS.some((w) => l.startsWith(`> | ${w.label} |`)));
    expect(rows).toHaveLength(WEAPONS.length);
  });

  it('is IDENTITY only — the provisional §4 tuning numbers stay OUT (D-021)', () => {
    const body = genT0WeaponRoster();
    // the durabilityMax values are §4-domain tuning; a generator that leaked them
    // would fail here (and would re-drift every time a number is tuned).
    for (const w of WEAPONS) expect(body).not.toContain(String(w.durabilityMax));
  });
});

describe('genT0Bestiary', () => {
  it('names every T0-reachable mob — derived from MOBS', () => {
    const body = genT0Bestiary();
    for (const m of MOBS.filter((x) => (x.minTier ?? 0) < 2)) {
      expect(body).toContain(`> | ${m.label} | ${m.kanji} |`);
    }
  });

  it('EXCLUDES the road bandit — the T2-gated foe belongs in §5, not the T0 bestiary', () => {
    const bandit = getMob('bandit');
    expect(bandit.minTier).toBe(2); // guards the fixture: the filter's whole reason
    // the sharpest RED-able line: drop the minTier filter and the bandit leaks in.
    expect(genT0Bestiary()).not.toContain(bandit.label);
  });

  it('emits one row per T0 foe (bandit excluded) — count matches the filter', () => {
    const t0 = MOBS.filter((m) => (m.minTier ?? 0) < 2);
    const rows = genT0Bestiary()
      .split('\n')
      .filter((l) => t0.some((m) => l.startsWith(`> | ${m.label} |`)));
    expect(rows).toHaveLength(t0.length);
    expect(t0.length).toBe(MOBS.length - 1); // exactly the bandit is held back
  });
});
