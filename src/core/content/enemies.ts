// Bestiary (PRD §2.9 / §4.6 / canon §E). GROUNDED mobs only — boars, wolves,
// monkeys, bandits. NO belief-creatures in any spawn table (a hard guardrail the
// content verifier enforces). Each carries a `level` from which {attackPower,
// defense, hp} derive (Block N.1 #1). The scripted grain-store wolf is the humbling
// first fight (a guaranteed-survival story beat, §7.2 M2a).
//
// v0.3.1 Step 5b: each foe is SPATIAL — it lives on exactly one map node (`area`), so
// you walk to its ground to fight it (the human's "combat happens on a node" call). The
// crop-raiding monkey haunts the home paddies; the lean wolf comes down to the near
// satoyama; the boar dens deeper, in the deep satoyama it raids from (Step 5d); the road
// bandit works the woodlot road; the scripted wolf is cornered in the kura where you woke.

import type { AreaId } from './areas';

export type MobId = 'wolf_scripted' | 'wolf' | 'boar' | 'monkey' | 'bandit';

export interface MobDef {
  readonly id: MobId;
  readonly label: string;
  readonly kanji: string;
  readonly level: number;
  /** The map node this foe is found on — you must stand here to fight it (Step 5b, spatial). */
  readonly area: AreaId;
  /** A scripted story beat the MC always survives (never a grindable encounter). */
  readonly scripted?: boolean;
  /** Koku scavenged on a win (the modest spoils of a kept hand). */
  readonly kokuReward: number;
  readonly blurb: string;
}

export const MOBS: readonly MobDef[] = [
  {
    id: 'wolf_scripted',
    label: 'Grain-store wolf',
    kanji: '狼',
    level: 2,
    area: 'kura',
    scripted: true,
    kokuReward: 0,
    blurb:
      'A starving wolf cornered among the rice-sacks. You live through this one on luck alone.',
  },
  {
    id: 'monkey',
    label: 'Crop-raiding monkey',
    kanji: '猿',
    level: 1,
    area: 'home-paddies',
    kokuReward: 3,
    blurb: 'Bold and quick, a menace to the paddies — but the lightest of the threats.',
  },
  {
    id: 'wolf',
    label: 'Lean wolf',
    kanji: '狼',
    level: 2,
    area: 'near-satoyama',
    kokuReward: 5,
    blurb: 'Comes down from the satoyama when the hunting is thin. It means to kill.',
  },
  {
    id: 'boar',
    label: 'Wild boar',
    kanji: '猪',
    level: 3,
    area: 'deep-satoyama',
    kokuReward: 8,
    blurb: 'Tusked and furious, denned in the deep hills it raids from. It will not turn aside.',
  },
  {
    id: 'bandit',
    label: 'Road bandit',
    kanji: '野伏',
    level: 5, // provisional (v0.2) — tune by playtest
    area: 'woodlot-edge',
    kokuReward: 12,
    blurb: 'A masterless man gone to robbery on the woodlot road.',
  },
];

export const MOB_IDS: ReadonlySet<string> = new Set(MOBS.map((m) => m.id));

export function getMob(id: MobId): MobDef {
  const m = MOBS.find((x) => x.id === id);
  if (!m) throw new Error(`unknown mob: ${id}`);
  return m;
}

/** The grindable (non-scripted) foes, in danger order (easiest first). */
export const GRINDABLE_MOBS: readonly MobDef[] = MOBS.filter((m) => !m.scripted)
  .slice()
  .sort((a, b) => a.level - b.level);
