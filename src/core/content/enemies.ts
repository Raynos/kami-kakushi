// Bestiary (PRD §2.9 / §4.6 / canon §E). GROUNDED mobs only — boars, wolves,
// monkeys, bandits. NO belief-creatures in any spawn table (a hard guardrail the
// content verifier enforces). Each carries a `level` from which {attackPower,
// defense, hp} derive (Block N.1 #1). The scripted grain-store wolf is the humbling
// first fight (a guaranteed-survival story beat, §7.2 M2a).

export type MobId = 'wolf_scripted' | 'wolf' | 'boar' | 'monkey' | 'bandit';

export interface MobDef {
  readonly id: MobId;
  readonly label: string;
  readonly kanji: string;
  readonly level: number;
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
    kokuReward: 3,
    blurb: 'Bold and quick, a menace to the paddies — but the lightest of the threats.',
  },
  {
    id: 'wolf',
    label: 'Lean wolf',
    kanji: '狼',
    level: 2,
    kokuReward: 5,
    blurb: 'Comes down from the satoyama when the hunting is thin. It means to kill.',
  },
  {
    id: 'boar',
    label: 'Wild boar',
    kanji: '猪',
    level: 3,
    kokuReward: 8,
    blurb: 'Tusked and furious. It will not turn aside.',
  },
  {
    id: 'bandit',
    label: 'Road bandit',
    kanji: '野伏',
    level: 4,
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
