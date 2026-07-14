// Loot→craft recipe system (PRD §2.10 FIND+CRAFT / §2.11 simple recipes / ADR-052 the
// "one craftable" showcase taste; DoD T0-M2-F2). RETIRES the combat-L2 wood_axe GRANT
// (fight.ts) — the axe is now FOUND (materials drop from felled foes) and CRAFTED from
// them at the woodlot smithy, never gifted off a rack. T0 stays SIMPLE flat recipes
// only (component/quality chains are T1+, §2.11). Pure-core data + helpers: integer
// fixed-point drop chances (num/den, rolled through the ONE seeded loot RNG — never
// Math.random), immutable-in/immutable-out.

import type { WeaponId } from './weapons';
import type { Rng } from '../rng';
import { nextInt } from '../rng';

export type MaterialId = string;

export interface MaterialDef {
  readonly id: MaterialId;
  readonly label: string;
  readonly kanji: string;
  readonly blurb: string;
}

/** The crafting materials — each lights its own resource row once first looted (§2.10). */
export const MATERIALS: readonly MaterialDef[] = [
  {
    id: 'hardwood',
    label: 'Seasoned hardwood',
    kanji: '堅木',
    blurb:
      'A close-grained billet off the woodlot, cured hard and true — fit for a haft that will not split.',
  },
  {
    id: 'beast_sinew',
    label: 'Beast sinew',
    kanji: '腱',
    blurb:
      'Tendon drawn from a felled beast and dried to cord — the lashing that binds a head to its haft.',
  },
];

export const MATERIAL_IDS: ReadonlySet<string> = new Set(
  MATERIALS.map((m) => m.id),
);

export function getMaterial(id: MaterialId): MaterialDef {
  const m = MATERIALS.find((x) => x.id === id);
  if (!m) throw new Error(`unknown material: ${id}`);
  return m;
}

export interface RecipeDef {
  readonly id: string;
  readonly outputWeapon: WeaponId;
  readonly inputs: Readonly<Record<MaterialId, number>>;
  readonly label: string;
  readonly blurb: string;
}

/** T0 craftables (ADR-052/ADR-095 "≥1 craftable"; ADR-102 — pole + 2, the yari a CRAFTED spear). Flat
 *  inputs → one weapon. Ordered by progression: the axe first (cheap), then the yari (the martial
 *  graduation, leans sinew-lashing over the axe's hardwood haft). T0 stays SIMPLE flat recipes. */
export const RECIPES: readonly RecipeDef[] = [
  {
    id: 'craft_wood_axe',
    outputWeapon: 'wood_axe',
    inputs: { hardwood: 3, beast_sinew: 1 },
    label: 'Forge the woodlot axe',
    blurb:
      'At the woodlot smithy a heavy felling head is set to a seasoned haft and bound fast with sinew. A real edge — one you earned off the carcasses, not one tossed to you off the rack.',
  },
  {
    id: 'craft_yari',
    outputWeapon: 'yari',
    inputs: { hardwood: 2, beast_sinew: 3 },
    label: 'Forge a yari 槍',
    blurb:
      'A straight ash haft, a keen forged head, and sinew lashed tight turn a season of carcasses into a soldier’s spear — the first weapon you carry that was never a farm tool.',
  },
];

export function getRecipe(id: string): RecipeDef {
  const r = RECIPES.find((x) => x.id === id);
  if (!r) throw new Error(`unknown recipe: ${id}`);
  return r;
}

/** PURE: do these resources cover every input the recipe needs? Reads only — never mutates. */
export function canCraft(
  resources: Readonly<Record<string, number>>,
  recipe: RecipeDef,
): boolean {
  for (const [mat, need] of Object.entries(recipe.inputs)) {
    if ((resources[mat] ?? 0) < need) return false;
  }
  return true;
}

/** PURE: the per-material shortfall (need − have, only where short) — for the craft panel. */
export function missingMaterials(
  resources: Readonly<Record<string, number>>,
  recipe: RecipeDef,
): Readonly<Record<MaterialId, number>> {
  const out: Record<MaterialId, number> = {};
  for (const [mat, need] of Object.entries(recipe.inputs)) {
    const short = need - (resources[mat] ?? 0);
    if (short > 0) out[mat] = short;
  }
  return out;
}

export interface MaterialDrop {
  readonly material: MaterialId;
  readonly qty: number;
  /** Integer fixed-point drop chance = chanceNum / chanceDen (rolled via nextInt — no floats). */
  readonly chanceNum: number;
  readonly chanceDen: number;
}

/** Which foe (by MobId) drops which crafting material, and how often (G4: re-keyed to the
 *  bible roster). Beasts carry NO mon — combat drops MATERIALS only (KIND lane). Light beasts
 *  (rats/tanuki/badger/monkey/feral-dog/marten/wolf) yield sinew; the held-for-T2 bandit hauls
 *  stolen timber (hardwood). `store_rats` is the deliberate "no drop entry" foe. All SEED. */
export const MATERIAL_DROPS: Readonly<Record<string, MaterialDrop>> = {
  // The river-rat swarm is nearly worthless loot — usually nothing, a rare scrap of sinew.
  river_rats: { material: 'beast_sinew', qty: 1, chanceNum: 1, chanceDen: 6 },
  tanuki: { material: 'beast_sinew', qty: 1, chanceNum: 1, chanceDen: 2 },
  badger: { material: 'beast_sinew', qty: 1, chanceNum: 1, chanceDen: 2 },
  monkey: { material: 'beast_sinew', qty: 1, chanceNum: 1, chanceDen: 2 },
  monkey_male: { material: 'beast_sinew', qty: 1, chanceNum: 3, chanceDen: 5 },
  feral_dog: { material: 'beast_sinew', qty: 1, chanceNum: 3, chanceDen: 4 },
  // Night-round foes (marten/wolf) still give up a hide/sinew — the round's material haul.
  marten: { material: 'beast_sinew', qty: 1, chanceNum: 1, chanceDen: 2 },
  wolf: { material: 'beast_sinew', qty: 1, chanceNum: 3, chanceDen: 4 },
  // The woodlot-road bandit is hauling stolen timber — a guaranteed, if dangerous, haul.
  bandit: { material: 'hardwood', qty: 3, chanceNum: 1, chanceDen: 1 },
};

/** PURE/DETERMINISTIC: roll a foe's material drop through the ONE seeded loot RNG.
 *  Returns the awarded { material, qty } (or null on no-drop / no drop-entry) and the
 *  advanced Rng. Integer fixed-point: draws an int in [0, chanceDen) and drops when it
 *  is < chanceNum — never Math.random. A mob with no drop entry draws nothing (Rng
 *  returned unchanged). */
export function rollMaterialDrop(
  rng: Rng,
  mobId: string,
): [{ readonly material: MaterialId; readonly qty: number } | null, Rng] {
  const drop = MATERIAL_DROPS[mobId];
  if (!drop) return [null, rng];
  const [roll, rng2] = nextInt(rng, 'loot', drop.chanceDen);
  if (roll < drop.chanceNum)
    return [{ material: drop.material, qty: drop.qty }, rng2];
  return [null, rng2];
}
