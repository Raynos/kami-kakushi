// Weapon roster (PRD §2.10.1 / §4.6.9 / FU13). T0 starts with exactly ONE weapon —
// an improvised carrying-pole — and grows the roster across the tier. Each weapon is
// an archetype: per-weapon baseAttack / baseSpeed + a signature note. FOUND/earned,
// never gifted as power.

export type WeaponId = 'carrying_pole' | 'wood_axe' | 'yari';

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
    baseAttack: 3, // §4.6.1 new scale — improvised/weak (weaponBase + 1.2·STR) — tune by playtest
    baseSpeed: 0.9,
    durabilityMax: 40,
    archetype: 'reach · blunt',
    blurb: "A porter's shoulder-pole. Not a weapon — but it has reach, and it is what you have.",
  },
  {
    id: 'wood_axe',
    label: 'Woodlot axe',
    kanji: '斧',
    baseAttack: 5, // §4.6.1 new scale — heavier bite than the pole — tune by playtest
    baseSpeed: 0.85, // provisional (v0.2) — tune by playtest
    durabilityMax: 55,
    archetype: 'heavy · single',
    blurb: 'A felling axe off the woodlot rack — heavy, slow, and it bites deep.',
  },
  {
    id: 'yari',
    label: 'Forged yari',
    kanji: '槍',
    // Line-1 SPEAR (PRD §4.6.9) — the real martial weapon you GRADUATE to. Less bite per thrust
    // than the axe, but fast + long: more swings, so it excels against quick, evasive foes (the
    // accuracy/evasion model rewards its cadence). Signature "thrust-through" is a T1 ability slot.
    baseAttack: 4, // §4.6.1 scale — a sidegrade to the axe (fast/reach vs heavy/bite) — tune by playtest
    baseSpeed: 1.0, // §4.6.9 yari cadence
    durabilityMax: 45,
    archetype: 'reach · thrust',
    blurb:
      'A spear forged and lashed at the woodlot smithy — a straight ash haft and a keen head. Not a farm tool turned to fighting, but a real weapon, made to a soldier’s pattern.',
  },
];

export const WEAPON_IDS: ReadonlySet<string> = new Set(WEAPONS.map((w) => w.id));

export function getWeapon(id: WeaponId): WeaponDef {
  const w = WEAPONS.find((x) => x.id === id);
  if (!w) throw new Error(`unknown weapon: ${id}`);
  return w;
}
