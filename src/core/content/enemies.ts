// Bestiary (PRD §2.9 / §4.6 / canon §E; T0 sheet "Combat structure & enemies"). GROUNDED
// mobs only — river rats, tanuki/badger, the monkey troop, feral dogs, the night-round
// store-rats→marten→wolf ladder, and the held-for-T2 bandit. NO belief-creatures in any
// spawn table (a hard guardrail the content verifier enforces). Each carries a `level`
// from which {attackPower, defense, hp} derive (Block N.1 #1).
//
// G4 (the content cutover): the roster is re-sited onto the bible's 16-zone estate spine —
// each foe lives on exactly one map node (`area`, Step 5b spatial), so you walk to its
// ground to fight it. The bible's economics are KIND-lane: beasts carry no mon (combat
// drops MATERIALS, never coin — crafting.ts), so the old `coinReward` field is GONE. The
// old scripted grain-store wolf (`wolf_scripted` + `face_wolf`) is retired: the wolf now
// lives ONLY in the R3 night round (the night-round engine, nightRounds.ts), alongside the
// store-rats and marten (`nightRoundOnly`) — the arc's rats→marten→wolf climax.
//
// Blurbs are the migrated canon (FLAVOR.mob* keys, authored in narrative/flavor.md — the
// single source; NEVER re-typed here). The bandit — the first HUMAN threat — is canon-held
// for T2 (no human combat in T0/T1): it stays in the balance CURVE (foeForecasts, the
// high-end wall) but `minTier: 2` gates it out of a T0 fight, and the content verifier
// asserts every human-archetype foe carries minTier ≥ 2.

import type { AreaId } from './areas';
import { FLAVOR } from './flavor';

export type MobId =
  | 'river_rats'
  | 'tanuki'
  | 'badger'
  | 'monkey'
  | 'monkey_male'
  | 'feral_dog'
  | 'store_rats'
  | 'marten'
  | 'wolf'
  | 'bandit';

export interface MobDef {
  readonly id: MobId;
  readonly label: string;
  readonly kanji: string;
  readonly level: number;
  /** The map node this foe is found on — you must stand here to fight it (Step 5b, spatial). */
  readonly area: AreaId;
  /** Per-mob archetype knobs (§4.6.1d) — the cadence/accuracy/evasion character on top of the
   *  linear-in-level curve. Default: baseSpeed 1.0, accBonus 0, evaBonus 0. All SEED / sim-owned. */
  readonly baseSpeed?: number;
  readonly accBonus?: number;
  readonly evaBonus?: number;
  /** The first tier this foe can be FOUGHT (spatial-reachability gate; default 0 = T0). The
   *  bandit — the first HUMAN threat — is canon-held for T2 (PRD §5 / T0 sheet), so it stays in
   *  the balance CURVE (foeForecasts, the high-end wall) but is NOT reachable/fightable in T0. */
  readonly minTier?: number;
  /** A scripted story beat the MC always survives (never a grindable encounter). Unused in the
   *  post-G4 roster — the scripted wolf is retired — but kept as a machinery hook for later beats. */
  readonly scripted?: boolean;
  /** This foe is met ONLY inside the R3 night round (the on-rails mini-dungeon, nightRounds.ts),
   *  never a walk-up day-grind foe — so it is excluded from GRINDABLE_MOBS / the day foesHere list. */
  readonly nightRoundOnly?: boolean;
  readonly blurb: string;
}

// Levels + archetype knobs are SEED magnitudes — the balance sim owns the final curve (§4.6.1d).
export const MOBS: readonly MobDef[] = [
  {
    id: 'river_rats',
    label: 'River rats',
    kanji: '川鼠',
    level: 1,
    area: 'weir-reeds',
    // The gentlest grind — a wet swarm at the leased weir screens. FAST (they boil) but scattershot
    // and easy to hit (a mass of small bodies), so it lands few real bites: the warmup foe.
    baseSpeed: 1.7,
    accBonus: -4,
    evaBonus: -2,
    blurb: FLAVOR.mobRatRiver,
  },
  {
    id: 'tanuki',
    label: 'Tanuki',
    kanji: '狸',
    level: 1,
    area: 'field-margins',
    // The folk-loaded animal played PLAIN (kernel #1): round, low, gone at a shout. A brisk, light
    // raider of the drying racks — quicker than a badger, but no real weight behind it.
    baseSpeed: 1.2,
    evaBonus: 2,
    blurb: FLAVOR.mobTanuki,
  },
  {
    id: 'badger',
    label: 'Badger',
    kanji: '穴熊',
    level: 2,
    area: 'field-margins',
    // Slow to rouse and hard to stop once roused — a low, heavy digger that lands what it throws.
    baseSpeed: 0.9,
    accBonus: 3,
    blurb: FLAVOR.mobBadger,
  },
  {
    id: 'monkey',
    label: 'Crop-raiding monkey',
    kanji: '猿',
    level: 1,
    area: 'grove',
    // Fast and dodgy — the humbling first foe: it swings often and slips your blows (high evasion).
    baseSpeed: 1.5,
    evaBonus: 4,
    blurb: FLAVOR.mobMonkey,
  },
  {
    id: 'monkey_male',
    label: 'Troop big-male',
    kanji: '猿王',
    level: 2,
    area: 'grove',
    // The grove troop's mini-cap: half again the size and unafraid of a stick — the accuracy/evasion
    // LESSON made flesh (very high evasion), the escalation of the lone monkey on the same ground.
    baseSpeed: 1.2,
    evaBonus: 6,
    blurb: FLAVOR.mobMonkeyMale,
  },
  {
    id: 'feral_dog',
    label: 'Feral dog',
    kanji: '野犬',
    level: 2,
    area: 'orchard',
    // Bold from lean winters, worst in a pack — quick and it means the bite: harder than a monkey,
    // it slips a little and lands a little. Break the pack and what's left is only dogs.
    baseSpeed: 1.3,
    accBonus: 2,
    evaBonus: 1,
    blurb: FLAVOR.mobFeralDog,
  },
  {
    id: 'store_rats',
    label: 'Store rats',
    kanji: '内鼠',
    level: 1,
    area: 'kura',
    // Night-round stage 1 — the swarm along the kura wall-lines after dark. The gentlest night foe,
    // fast and scattershot like its river cousin; the round's easy opening.
    baseSpeed: 1.6,
    accBonus: -3,
    evaBonus: -2,
    nightRoundOnly: true,
    blurb: FLAVOR.mobRatStore,
  },
  {
    id: 'marten',
    label: 'Marten',
    kanji: '貂',
    level: 2,
    area: 'kura',
    // Night-round stage 2 — over the roof, not the wall, and it kills more than it carries. Fast and
    // evasive: the mid-round step up from the store rats before the wolf.
    baseSpeed: 1.5,
    accBonus: 2,
    evaBonus: 3,
    nightRoundOnly: true,
    blurb: FLAVOR.mobMarten,
  },
  {
    id: 'wolf',
    label: 'Lean wolf',
    kanji: '狼',
    level: 3,
    area: 'kura',
    // The R3 night-round CLIMAX (the arc's rats→marten→wolf): big, silent, no waste. Survived, not
    // won — the humbling beat. Heavier and surer than anything before it in the round.
    baseSpeed: 1.1,
    accBonus: 3,
    nightRoundOnly: true,
    blurb: FLAVOR.mobWolf,
  },
  {
    id: 'bandit',
    label: 'Road bandit',
    kanji: '野伏',
    level: 5, // provisional (v0.2) — tune by playtest; the curve's high-end wall
    area: 'woodlot',
    baseSpeed: 1.0, // a trained man
    // The first HUMAN threat is canon-held for T2 (T0 sheet: no human combat in T0/T1). The bandit
    // stays in the balance CURVE (the top-end wall foeForecasts reads) but is GATED out of a T0 fight.
    minTier: 2,
    blurb: 'A masterless man gone to robbery on the woodlot road — a threat for a later season.',
  },
];

export const MOB_IDS: ReadonlySet<string> = new Set(MOBS.map((m) => m.id));

export function getMob(id: MobId): MobDef {
  const m = MOBS.find((x) => x.id === id);
  if (!m) throw new Error(`unknown mob: ${id}`);
  return m;
}

/** The day-grindable foes, in danger order (easiest first): not scripted, and not a
 *  night-round-only foe (those are met only inside the on-rails R3 round, nightRounds.ts). */
export const GRINDABLE_MOBS: readonly MobDef[] = MOBS.filter((m) => !m.scripted && !m.nightRoundOnly)
  .slice()
  .sort((a, b) => a.level - b.level);
