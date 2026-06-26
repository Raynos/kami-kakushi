// Weapon roster (PRD §2.10.1 / §4.6.9 / FU13). T0 starts with exactly ONE weapon —
// an improvised carrying-pole — and grows the roster across the tier. Each weapon is
// an archetype: per-weapon baseAttack / baseSpeed + a signature note. FOUND/earned,
// never gifted as power.

export type WeaponId = 'carrying_pole' | 'wood_axe';

export interface WeaponDef {
  readonly id: WeaponId;
  readonly label: string;
  readonly kanji: string;
  readonly baseAttack: number;
  /** Swings per time-unit; <1 is slow/heavy, >1 is fast (PRD §4.6.2). */
  readonly baseSpeed: number;
  readonly durabilityMax: number;
  readonly archetype: string;
  readonly blurb: string;
}

export const WEAPONS: readonly WeaponDef[] = [
  {
    id: 'carrying_pole',
    label: 'Worn carrying-pole',
    kanji: '天秤棒',
    baseAttack: 5,
    baseSpeed: 0.9,
    durabilityMax: 40,
    archetype: 'reach · blunt',
    blurb: "A porter's shoulder-pole. Not a weapon — but it has reach, and it is what you have.",
  },
  {
    id: 'wood_axe',
    label: 'Woodlot axe',
    kanji: '斧',
    baseAttack: 8,
    baseSpeed: 0.8,
    durabilityMax: 55,
    archetype: 'heavy · single',
    blurb: 'A felling axe off the woodlot rack — heavy, slow, and it bites deep.',
  },
];

export const WEAPON_IDS: ReadonlySet<string> = new Set(WEAPONS.map((w) => w.id));

export function getWeapon(id: WeaponId): WeaponDef {
  const w = WEAPONS.find((x) => x.id === id);
  if (!w) throw new Error(`unknown weapon: ${id}`);
  return w;
}
