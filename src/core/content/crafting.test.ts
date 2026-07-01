import { describe, it, expect } from 'vitest';
import {
  RECIPES,
  MATERIALS,
  MATERIAL_IDS,
  MATERIAL_DROPS,
  getRecipe,
  getMaterial,
  canCraft,
  missingMaterials,
  rollMaterialDrop,
  type RecipeDef,
} from './crafting';
import { MOB_IDS, GRINDABLE_MOBS } from './enemies';
import { WEAPON_IDS, getWeapon } from './weapons';
import { createRng } from '../rng';

function woodAxe(): RecipeDef {
  const r = RECIPES.find((x) => x.outputWeapon === 'wood_axe');
  if (!r) throw new Error('no wood_axe recipe');
  return r;
}

describe('recipes', () => {
  it('has the wood_axe recipe, output wood_axe, inputs hardwood×3 + beast_sinew×1', () => {
    const r = woodAxe();
    expect(r.outputWeapon).toBe('wood_axe');
    expect(r.inputs).toEqual({ hardwood: 3, beast_sinew: 1 });
  });

  it('every recipe outputs a real WeaponId and references only real, positive material inputs', () => {
    expect(RECIPES.length).toBeGreaterThan(0);
    for (const r of RECIPES) {
      expect(WEAPON_IDS.has(r.outputWeapon)).toBe(true);
      const entries = Object.entries(r.inputs);
      expect(entries.length).toBeGreaterThan(0);
      for (const [mat, need] of entries) {
        expect(MATERIAL_IDS.has(mat)).toBe(true);
        expect(Number.isInteger(need)).toBe(true);
        expect(need).toBeGreaterThan(0);
      }
    }
  });

  it('getRecipe round-trips and throws on an unknown id', () => {
    expect(getRecipe('craft_wood_axe').outputWeapon).toBe('wood_axe');
    expect(() => getRecipe('no_such_recipe')).toThrow();
  });

  it('has the CRAFTED yari (A3/D-102) — output yari, a distinct sinew-leaning material mix', () => {
    const r = getRecipe('craft_yari');
    expect(r.outputWeapon).toBe('yari');
    expect(r.inputs).toEqual({ hardwood: 2, beast_sinew: 3 });
    // a distinct mix from the axe (the yari leans sinew-lashing, the axe hardwood-haft) — a real
    // craft choice, not a re-skin.
    expect(r.inputs).not.toEqual(getRecipe('craft_wood_axe').inputs);
  });

  it('the yari is a real SIDEGRADE to the axe — faster cadence, lighter bite (A3)', () => {
    const yari = getWeapon('yari');
    const axe = getWeapon('wood_axe');
    // fast + long: more swings, so it rewards the accuracy/evasion model against quick foes…
    expect(yari.baseSpeed).toBeGreaterThan(axe.baseSpeed);
    // …paid for with a lighter per-thrust bite than the heavy axe (a trade, not a strict upgrade).
    expect(yari.baseAttack).toBeLessThan(axe.baseAttack);
  });
});

describe('materials registry', () => {
  it('exposes hardwood + beast_sinew; getMaterial round-trips and throws on unknown', () => {
    expect(MATERIAL_IDS.has('hardwood')).toBe(true);
    expect(MATERIAL_IDS.has('beast_sinew')).toBe(true);
    expect(getMaterial('hardwood').id).toBe('hardwood');
    expect(() => getMaterial('no_such_material')).toThrow();
  });

  it('MATERIAL_IDS exactly mirrors the MATERIALS table', () => {
    expect([...MATERIAL_IDS].sort()).toEqual(MATERIALS.map((m) => m.id).sort());
  });
});

describe('canCraft — the craft gate', () => {
  it('is false on empty resources', () => {
    expect(canCraft({}, woodAxe())).toBe(false);
  });

  it('is false when one material is entirely missing', () => {
    expect(canCraft({ hardwood: 3 }, woodAxe())).toBe(false); // no sinew
    expect(canCraft({ beast_sinew: 1 }, woodAxe())).toBe(false); // no hardwood
  });

  it('is false when short a material', () => {
    expect(canCraft({ hardwood: 2, beast_sinew: 1 }, woodAxe())).toBe(false);
    expect(canCraft({ hardwood: 3, beast_sinew: 0 }, woodAxe())).toBe(false);
  });

  it('is true when inputs are exactly met', () => {
    expect(canCraft({ hardwood: 3, beast_sinew: 1 }, woodAxe())).toBe(true);
  });

  it('is true when inputs are over-met (and ignores unrelated resources)', () => {
    expect(canCraft({ hardwood: 9, beast_sinew: 4, koku: 100 }, woodAxe())).toBe(true);
  });

  it('is PURE — it does not mutate the resources argument', () => {
    const resources = Object.freeze({ hardwood: 1 });
    expect(canCraft(resources, woodAxe())).toBe(false);
    expect(resources).toEqual({ hardwood: 1 });
  });
});

describe('missingMaterials', () => {
  it('reports the full requirement when nothing is held', () => {
    expect(missingMaterials({}, woodAxe())).toEqual({ hardwood: 3, beast_sinew: 1 });
  });

  it('reports only the shortfall when partly held', () => {
    expect(missingMaterials({ hardwood: 1 }, woodAxe())).toEqual({ hardwood: 2, beast_sinew: 1 });
  });

  it('is empty when the recipe is craftable', () => {
    expect(missingMaterials({ hardwood: 3, beast_sinew: 1 }, woodAxe())).toEqual({});
  });
});

describe('MATERIAL_DROPS — the loot table', () => {
  it('keys only real, GRINDABLE MobIds (never the scripted wolf)', () => {
    expect(MATERIAL_DROPS['wolf_scripted']).toBeUndefined();
    for (const mobId of Object.keys(MATERIAL_DROPS)) {
      expect(MOB_IDS.has(mobId)).toBe(true);
      expect(GRINDABLE_MOBS.some((m) => m.id === mobId)).toBe(true);
    }
  });

  it('gives every grindable foe a drop (no dead grind)', () => {
    for (const m of GRINDABLE_MOBS) {
      expect(MATERIAL_DROPS[m.id]).toBeDefined();
    }
  });

  it('drops only real materials with positive integer qty and integer fixed-point chance', () => {
    for (const d of Object.values(MATERIAL_DROPS)) {
      expect(MATERIAL_IDS.has(d.material)).toBe(true);
      expect(Number.isInteger(d.qty)).toBe(true);
      expect(d.qty).toBeGreaterThan(0);
      expect(Number.isInteger(d.chanceNum)).toBe(true);
      expect(Number.isInteger(d.chanceDen)).toBe(true);
      expect(d.chanceDen).toBeGreaterThan(0);
      expect(d.chanceNum).toBeGreaterThan(0);
      expect(d.chanceNum).toBeLessThanOrEqual(d.chanceDen);
    }
  });

  it('maps light beasts → sinew and heavy woodlot foes → hardwood', () => {
    expect(MATERIAL_DROPS['monkey']?.material).toBe('beast_sinew');
    expect(MATERIAL_DROPS['wolf']?.material).toBe('beast_sinew');
    expect(MATERIAL_DROPS['boar']?.material).toBe('hardwood');
    expect(MATERIAL_DROPS['bandit']?.material).toBe('hardwood');
  });

  it('is a closed loop — every recipe input is droppable, every drop feeds a recipe', () => {
    const recipeMats = new Set<string>();
    for (const r of RECIPES) for (const m of Object.keys(r.inputs)) recipeMats.add(m);
    const droppedMats = new Set<string>();
    for (const d of Object.values(MATERIAL_DROPS)) droppedMats.add(d.material);
    for (const m of recipeMats) expect(droppedMats.has(m)).toBe(true);
    for (const m of droppedMats) expect(recipeMats.has(m)).toBe(true);
  });
});

describe('rollMaterialDrop — seeded, integer fixed-point', () => {
  it('is deterministic — same Rng + mob yields an identical result', () => {
    const rng = createRng(7);
    const a = rollMaterialDrop(rng, 'boar');
    const b = rollMaterialDrop(rng, 'boar');
    expect(a[0]).toEqual(b[0]);
    expect(a[1].cursors.loot).toBe(b[1].cursors.loot);
  });

  it('advances the loot RNG by exactly one draw on a real drop foe', () => {
    const rng = createRng(7);
    const [, rng2] = rollMaterialDrop(rng, 'boar');
    expect(rng2.cursors.loot).toBe(rng.cursors.loot + 1);
  });

  it('returns null and leaves the Rng untouched for a foe with no drop entry', () => {
    const rng = createRng(3);
    const [drop, rng2] = rollMaterialDrop(rng, 'wolf_scripted');
    expect(drop).toBeNull();
    expect(rng2).toBe(rng);
  });

  it('a guaranteed (1/1) foe always drops the tabled material/qty over a sweep', () => {
    let rng = createRng(99);
    const entry = MATERIAL_DROPS['bandit']!;
    for (let i = 0; i < 32; i++) {
      const [drop, rng2] = rollMaterialDrop(rng, 'bandit');
      rng = rng2;
      expect(drop).not.toBeNull();
      expect(drop!.material).toBe(entry.material);
      expect(drop!.qty).toBe(entry.qty);
    }
  });

  it('a probabilistic foe both drops and misses, and every drop matches the table', () => {
    let rng = createRng(12345);
    const entry = MATERIAL_DROPS['monkey']!;
    let drops = 0;
    let misses = 0;
    for (let i = 0; i < 40; i++) {
      const [drop, rng2] = rollMaterialDrop(rng, 'monkey');
      rng = rng2;
      if (drop) {
        drops++;
        expect(drop.material).toBe(entry.material);
        expect(drop.qty).toBe(entry.qty);
      } else {
        misses++;
      }
    }
    expect(drops).toBeGreaterThan(0);
    expect(misses).toBeGreaterThan(0);
  });
});
