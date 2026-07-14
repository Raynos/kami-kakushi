// validateState() — the persistence→core boundary where "src/ is the truth" is enforced.
// Every test here derives its expectations from the LIVE registries (getWeapon, refillSitePools),
// never from a copied magic number: a rebalanced durabilityMax or a re-tuned pool must not need
// a test edit, and a test that hard-coded `40` could never have caught the bug it was guarding.

import { describe, it, expect } from 'vitest';
import { validateState } from './validate';
import {
  createInitialState,
  getWeapon,
  refillSitePools,
  LABOUR_SITES,
} from '../core';

/** A structurally-valid raw save blob, with `over` merged over it. */
function rawSave(over: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    ...(createInitialState(1) as unknown as Record<string, unknown>),
    ...over,
  };
}

function loaded(over: Record<string, unknown> = {}) {
  const res = validateState(rawSave(over));
  if (!res.ok) throw new Error(`expected a valid save, got: ${res.reason}`);
  return res;
}

describe('the equipped weapon + its wear derive from the CURRENT weapon def (step 5)', () => {
  it('an unknown/renamed weapon id clamps to the pole instead of crashing the UI', () => {
    // getWeapon() THROWS on an unknown id. Before the clamp, a weapon renamed in src/ rode
    // through the save and blew up at first render — this is that bug's RED.
    const res = loaded({ equippedWeapon: 'naginata_that_was_renamed_away' });
    expect(res.state.equippedWeapon).toBe('carrying_pole');
    expect(res.coerced).toBe(true);
    expect(() => getWeapon(res.state.equippedWeapon)).not.toThrow();
  });

  it('an ABSENT durability hydrates to the equipped weapon’s max, not a hardcoded 40', () => {
    const yariMax = getWeapon('yari').durabilityMax;
    const res = loaded({ equippedWeapon: 'yari', weaponDurability: undefined });
    expect(res.state.weaponDurability).toBe(yariMax);
    // The RED this replaces: the old fallback was the literal 40 (the POLE's max), so a save
    // carrying a yari hydrated to the wrong weapon's durability.
    expect(res.coerced).toBe(false); // additive hydration is not a repair
  });

  it('a durability above the current max re-clamps on load (src/ rebalanced the weapon down)', () => {
    const poleMax = getWeapon('carrying_pole').durabilityMax;
    const res = loaded({
      equippedWeapon: 'carrying_pole',
      weaponDurability: poleMax + 500,
    });
    expect(res.state.weaponDurability).toBe(poleMax);
    expect(res.coerced).toBe(true);
  });

  it('a legitimate part-worn durability is preserved untouched', () => {
    const poleMax = getWeapon('carrying_pole').durabilityMax;
    const worn = Math.floor(poleMax / 2);
    const res = loaded({
      equippedWeapon: 'carrying_pole',
      weaponDurability: worn,
    });
    expect(res.state.weaponDurability).toBe(worn);
    expect(res.coerced).toBe(false);
  });
});

describe('validateState is a WHITELIST rebuild — retired fields age out (step 2)', () => {
  it('a retired field (ADR-056 balanceProfile) does not survive the round-trip', () => {
    const res = loaded({
      balanceProfile: 'brutal',
      someFieldWeDeletedIn2025: { deep: 1 },
    });
    expect(res.state).not.toHaveProperty('balanceProfile');
    expect(res.state).not.toHaveProperty('someFieldWeDeletedIn2025');
  });

  it('dropping junk is NOT reported as a repair (no "we mended your save" notice)', () => {
    // The load notice must mean "your save was damaged and we fixed it". Ageing out a field
    // src/ no longer knows about is routine hydration, not damage — if this flips true, every
    // player with an old save gets a scary notice for a non-event.
    const res = loaded({ balanceProfile: 'brutal' });
    expect(res.coerced).toBe(false);
  });

  it('every live GameState field still survives the rebuild', () => {
    // The guard on the guard: the whitelist is only safe because the _Handled ledger forces the
    // literal to stay complete. If someone adds a GameState field and defaults it wrong, this
    // catches the ones that would silently reset a real player fact.
    const fresh = createInitialState(1);
    const res = loaded({});
    for (const key of Object.keys(fresh) as (keyof typeof fresh)[]) {
      expect(res.state).toHaveProperty(key);
    }
  });

  it('a real player fact is preserved verbatim through the rebuild', () => {
    const res = loaded({
      rung: 'R3',
      tier: 1,
      belongings: ['a-real-thing'],
      soanLedger: 2,
    });
    expect(res.state.rung).toBe('R3');
    expect(res.state.tier).toBe(1);
    expect(res.state.belongings).toEqual(['a-real-thing']);
    expect(res.state.soanLedger).toBe(2);
  });
});

describe('sitePools: a MISSING key is a fresh site, not a depleted one (step 3)', () => {
  const season = 'winter' as const;

  it('a site absent from the save is born FULL, not worked-out', () => {
    // The bug: `state.sitePools[site] ?? 0` reads a missing key as yield-0. A site added or
    // renamed in src/ mid-run therefore showed as depleted until the next season refill.
    const fresh = refillSitePools(season);
    const someSite = LABOUR_SITES[0]!.site;
    const withHole = { ...fresh };
    delete (withHole as Record<string, number>)[someSite];

    const res = loaded({ season, sitePools: withHole });
    expect(res.state.sitePools[someSite]).toBe(fresh[someSite]);
    expect(res.state.sitePools[someSite]).toBeGreaterThan(0);
  });

  it('a PRESENT drawn-down pool wins over the refill (progress is never handed back)', () => {
    const fresh = refillSitePools(season);
    const someSite = LABOUR_SITES[0]!.site;
    const res = loaded({ season, sitePools: { ...fresh, [someSite]: 1 } });
    expect(res.state.sitePools[someSite]).toBe(1);
  });

  it('a DEPLETED (zero) pool stays depleted — 0 is a fact, not a hole', () => {
    const fresh = refillSitePools(season);
    const someSite = LABOUR_SITES[0]!.site;
    const res = loaded({ season, sitePools: { ...fresh, [someSite]: 0 } });
    expect(res.state.sitePools[someSite]).toBe(0);
  });

  it('every live site has a pool after load, whatever the save carried', () => {
    const res = loaded({ season, sitePools: {} });
    for (const { site } of LABOUR_SITES) {
      expect(res.state.sitePools[site]).toBeDefined();
    }
  });
});
