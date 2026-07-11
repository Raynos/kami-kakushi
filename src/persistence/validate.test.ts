// validateState() — the persistence→core boundary where "src/ is the truth" is enforced.
// Every test here derives its expectations from the LIVE registries (getWeapon, refillSitePools),
// never from a copied magic number: a rebalanced durabilityMax or a re-tuned pool must not need
// a test edit, and a test that hard-coded `40` could never have caught the bug it was guarding.

import { describe, it, expect } from 'vitest';
import { validateState } from './validate';
import { createInitialState, getWeapon } from '../core';

/** A structurally-valid raw save blob, with `over` merged over it. */
function rawSave(over: Record<string, unknown> = {}): Record<string, unknown> {
  return { ...(createInitialState(1) as unknown as Record<string, unknown>), ...over };
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
    const res = loaded({ equippedWeapon: 'carrying_pole', weaponDurability: poleMax + 500 });
    expect(res.state.weaponDurability).toBe(poleMax);
    expect(res.coerced).toBe(true);
  });

  it('a legitimate part-worn durability is preserved untouched', () => {
    const poleMax = getWeapon('carrying_pole').durabilityMax;
    const worn = Math.floor(poleMax / 2);
    const res = loaded({ equippedWeapon: 'carrying_pole', weaponDurability: worn });
    expect(res.state.weaponDurability).toBe(worn);
    expect(res.coerced).toBe(false);
  });
});
