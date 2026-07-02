// Bestiary (PRD §2.9 / §4.6 / canon §E). GROUNDED mobs only — grain-rats, monkeys
// (lone + troop), pit vipers, wolves, boars, bandits. NO belief-creatures in any spawn
// table (a hard guardrail the content verifier enforces). Each carries a `level` from which {attackPower,
// defense, hp} derive (Block N.1 #1). The scripted grain-store wolf is the humbling
// first fight (a guaranteed-survival story beat, §7.2 M2a).
//
// v0.3.1 Step 5b: each foe is SPATIAL — it lives on exactly one map node (`area`), so
// you walk to its ground to fight it (the human's "combat happens on a node" call). The
// grain-rat swarm boils at the gate forecourt (the gentle warmup); the lone crop-raiding
// monkey AND its troop haunt the home paddies; the lean wolf comes down to the near satoyama
// where a pit viper coils in the grass; the boar dens deeper, in the deep satoyama it raids
// from (Step 5d); the road bandit works the woodlot road (the first HUMAN threat — canon-held
// for T2, A10; in the curve but gated out of a T0 fight); the scripted wolf is cornered in
// the kura where you woke. A9 (v0.3.2) added the rats/troop/viper for T0 combat variety.

import type { AreaId } from './areas';

export type MobId =
  | 'wolf_scripted'
  | 'wolf'
  | 'boar'
  | 'monkey'
  | 'bandit'
  | 'rice_rats'
  | 'mamushi'
  | 'monkey_troop';

export interface MobDef {
  readonly id: MobId;
  readonly label: string;
  readonly kanji: string;
  readonly level: number;
  /** The map node this foe is found on — you must stand here to fight it (Step 5b, spatial). */
  readonly area: AreaId;
  /** Per-mob archetype knobs (§4.6.1d) — the cadence/accuracy/evasion character on top of the
   *  linear-in-level curve. Default: baseSpeed 1.0, accBonus 0, evaBonus 0. The monkey's fast,
   *  evasive profile is what makes it the humbling first foe despite the MC's ~58 HP. */
  readonly baseSpeed?: number;
  readonly accBonus?: number;
  readonly evaBonus?: number;
  /** The first tier this foe can be FOUGHT (spatial-reachability gate; default 0 = T0). The
   *  bandit — the first HUMAN threat — is canon-held for T2 (PRD §5), so it stays in the balance
   *  CURVE (foeForecasts, the high-end wall) but is NOT reachable/fightable in T0 (foesHere). */
  readonly minTier?: number;
  /** A scripted story beat the MC always survives (never a grindable encounter). */
  readonly scripted?: boolean;
  /** Coin scavenged on a win (the modest spoils of a kept hand; base unit mon — D-107). */
  readonly coinReward: number;
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
    coinReward: 0,
    blurb:
      'A starving wolf cornered among the rice-sacks. You live through this one on luck alone.',
  },
  {
    id: 'rice_rats',
    label: 'Grain-rat swarm',
    kanji: '稲鼠',
    level: 1,
    area: 'gate-forecourt',
    // The gentlest fight there is — a boiling swarm of grain-rats at the stores. FAST (they swarm)
    // but scattershot and easy to hit (a mass of small bodies), so it lands few real bites: a
    // slightly-easier-than-the-monkey OPTIONAL warmup at the forecourt, NOT the humbling first
    // fight (that stays the monkey on the paddies). Barely worth a coin.
    baseSpeed: 1.7,
    accBonus: -4,
    evaBonus: -2,
    coinReward: 1,
    blurb:
      'A boiling swarm at the grain-stores — a nuisance, not a threat. Good for a first swing.',
  },
  {
    id: 'monkey',
    label: 'Crop-raiding monkey',
    kanji: '猿',
    level: 1,
    area: 'home-paddies',
    // A fast, dodgy nuisance — the humbling first foe: it swings often and slips your blows.
    baseSpeed: 1.5,
    evaBonus: 4,
    coinReward: 3,
    blurb: 'Bold and quick, a menace to the paddies — but the lightest of the threats.',
  },
  {
    id: 'monkey_troop',
    label: 'Crop-raiding troop',
    kanji: '猿群',
    level: 2,
    area: 'home-paddies',
    // A whole troop swarms the paddies — the accuracy/evasion LESSON made flesh: they scatter and
    // duck so you WHIFF a lot (very high evasion), the escalation of the lone monkey on the same
    // ground. (True multi-target waits on the T1 weapon targetCount; at T0 it is one evasive pack.)
    baseSpeed: 1.2,
    evaBonus: 6,
    coinReward: 6,
    blurb: 'Not one raider but a whole troop — they scatter and duck, and you swing at empty air.',
  },
  {
    id: 'wolf',
    label: 'Lean wolf',
    kanji: '狼',
    level: 2,
    area: 'near-satoyama',
    // Fast and lethal — "it means to kill": quicker and more accurate than the monkey, and it
    // slips a little too. Harder than the monkey despite the same HP band (the graded ramp).
    baseSpeed: 1.4,
    accBonus: 2,
    evaBonus: 2,
    coinReward: 5,
    blurb: 'Comes down from the satoyama when the hunting is thin. It means to kill.',
  },
  {
    id: 'mamushi',
    label: 'Mamushi (pit viper)',
    kanji: '蝮',
    level: 2,
    area: 'near-satoyama',
    // A pit viper coiled in the hill-grass — FAST and deadly-ACCURATE (a lunging strike that rarely
    // misses), the sharp opposite of the monkey_troop's misses. A short, sharp duel: it bites hard
    // and lands its bites. (Its venom/gall consumable is a T1 feature, D-095 — no status effect yet.)
    baseSpeed: 1.3,
    accBonus: 3,
    coinReward: 4,
    blurb:
      'Coiled in the grass, quick as a whip and sure of its strike. It bites before you see it.',
  },
  {
    id: 'boar',
    label: 'Wild boar',
    kanji: '猪',
    level: 3,
    area: 'deep-satoyama',
    // Slow but heavy and unerring — a wall of muscle: it swings less often than the wolf, but
    // it lands (accBonus) and its higher-level HP makes it a real grind (harder than the wolf).
    baseSpeed: 0.95,
    accBonus: 4,
    coinReward: 8,
    blurb: 'Tusked and furious, denned in the deep hills it raids from. It will not turn aside.',
  },
  {
    id: 'bandit',
    label: 'Road bandit',
    kanji: '野伏',
    level: 5, // provisional (v0.2) — tune by playtest
    area: 'woodlot-edge',
    baseSpeed: 1.0, // a trained man — the curve's high-end wall
    // A10 / PRD §5: the first HUMAN threat is canon-held for T2. The bandit stays in the
    // balance CURVE (the top-end wall foeForecasts reads) but is GATED out of a T0 fight.
    minTier: 2,
    coinReward: 12,
    blurb: 'A masterless man gone to robbery on the woodlot road — a threat for a later season.',
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
