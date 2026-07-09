// v0.3.2 A7 — the staggered combat reveal (§4.6.9) + the Bestiary selector. The combat tab no
// longer dumps every surface the moment it opens: R3 is the fight FLOOR (weapon + fight loop +
// Bestiary), R4 adds the durability/repair/equip/craft loop, R5 adds the stance control — one
// beat per rung. These tests DERIVE the rung reveals from RANKS (the source of truth), so a
// re-staged bundle flips them RED rather than passing on a copied list.
import { describe, it, expect } from 'vitest';
import {
  RANKS,
  createInitialState,
  setFlag,
  bestiaryEntries,
  foeTell,
  getMob,
  GRINDABLE_MOBS,
  type RankId,
} from './index';

/** The cumulative set of surfaces a player has unlocked by the time they REACH `rank` — the union
 *  of every rung reward's `unlock` from R0 up to and including it (the real reveal order). */
function unlockedThrough(rank: RankId): Set<string> {
  const acc = new Set<string>();
  for (const r of RANKS) {
    for (const u of r.rewardOnReach?.unlock ?? []) acc.add(u);
    if (r.id === rank) break;
  }
  return acc;
}

describe('A7 — combat surfaces reveal one beat per rung (derived from RANKS)', () => {
  it('R3 opens the fight FLOOR only: combat + bestiary, but NOT durability / equip / craft / stance', () => {
    const at3 = unlockedThrough('R3');
    // the floor is live
    expect(at3.has('tab-combat')).toBe(true);
    expect(at3.has('panel-bestiary')).toBe(true);
    expect(at3.has('readout-combat-level')).toBe(true);
    // the later beats are still fogged
    expect(at3.has('readout-durability')).toBe(false);
    expect(at3.has('panel-equipment')).toBe(false);
    expect(at3.has('verb-repair')).toBe(false);
    expect(at3.has('stance-control')).toBe(false);
  });

  it('R4 adds the loot→craft beat: durability + equipment + repair (stance still held back)', () => {
    const at4 = unlockedThrough('R4');
    expect(at4.has('readout-durability')).toBe(true);
    expect(at4.has('panel-equipment')).toBe(true);
    expect(at4.has('verb-repair')).toBe(true);
    // the R3 floor is of course still present
    expect(at4.has('panel-bestiary')).toBe(true);
    // stance is the R5 beat — not yet
    expect(at4.has('stance-control')).toBe(false);
  });

  it('R5 adds the stance control — the last staggered combat surface', () => {
    const at5 = unlockedThrough('R5');
    expect(at5.has('stance-control')).toBe(true);
  });

  it('every staggered surface is revealed exactly once across the ladder (no double-bundle)', () => {
    const counts = new Map<string, number>();
    for (const r of RANKS) {
      for (const u of r.rewardOnReach?.unlock ?? []) counts.set(u, (counts.get(u) ?? 0) + 1);
    }
    for (const id of [
      'panel-bestiary',
      'readout-durability',
      'panel-equipment',
      'stance-control',
    ]) {
      expect(counts.get(id), `${id} bundled ${counts.get(id) ?? 0}×`).toBe(1);
    }
  });
});

describe('A7 — the Bestiary selector fogs an un-encountered foe, reveals it once faced', () => {
  it('a fresh fighter has faced no foe — every entry is fogged', () => {
    const s = createInitialState(1);
    const entries = bestiaryEntries(s);
    expect(entries.length).toBe(GRINDABLE_MOBS.length);
    expect(entries.every((e) => !e.seen)).toBe(true);
  });

  it("setting a foe's mob-<id> flag reveals ONLY that foe's entry, with real earned info", () => {
    const seen = setFlag(createInitialState(1), 'mob-monkey');
    const entries = bestiaryEntries(seen);
    const monkey = entries.find((e) => e.mob.id === 'monkey')!;
    // an UNFACED grindable foe stays fogged (the feral-dog pack — not the night-round-only wolf,
    // which never appears in the day bestiary).
    const feralDog = entries.find((e) => e.mob.id === 'feral_dog')!;
    expect(monkey.seen).toBe(true);
    expect(feralDog.seen).toBe(false);
    // the earned info is real: a positive win-rate forecast + a derived tell.
    expect(monkey.winRate).toBeGreaterThan(0);
    expect(monkey.tell.length).toBeGreaterThan(0);
  });

  it('the tell is DERIVED from the archetype knobs (enemies.ts), not a copied string', () => {
    // G4 roster: monkey evaBonus 4 → "evasive"; badger baseSpeed 0.9 → "heavy"; wolf accBonus 3 →
    // "unerring". Each reads its design lever straight off the def (foeTell), never a copied string.
    expect(foeTell(getMob('monkey'))).toContain('evasive');
    expect(foeTell(getMob('badger'))).toContain('heavy');
    expect(foeTell(getMob('wolf'))).toContain('unerring');
  });
});
