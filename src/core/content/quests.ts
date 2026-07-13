// T0 quests as ORDER-FREE advance-event sets (PRD §2.13 / T0-M4-F1 / ADR-037 / ADR-032 / AC-6).
// A quest is a small goal beyond grinding: a kind (PEST / HUNT / CLEAR / DEFEND), grounded
// estate flavour, and a set of steps that complete in ANY order. Each step listens for an `event`
// TOKEN — a '<verb>:<subject>' string ('kill:monkey', 'gather:wood') emitted by the fight /
// labour reducers — so there is no fixed step order and no nesting. Surfaces under a
// TOP-LEVEL Quests nav tab (ADR-037), not a nested panel; no fixed quest-type budget (ADR-032).
// PURE data + pure progression with NO GameState coupling (it takes a plain done-set), so it
// wires into state / intents / reducers later without this file ever importing them.
//
// G4 (the content cutover): the roster is re-authored to the bible's T0 defence quests — the
// first night round, the orchard-dog chain, and the seasonal margin defences (grove monkeys,
// weir rats, field-margin setts). Every fight has an economic reason the ledger could name.
// All prose is the migrated canon (FLAVOR.quest* keys — the single source; NEVER re-typed).
// Rewards run on the KIND lane (bible economics: combat/defence pays in recovered goods and
// standing, NEVER coin) — so a quest banks its completion flag + its diegetic payoff line.

import type { RewardBundle } from '../rewards';
import { FLAVOR } from './flavor';

export type QuestKind = 'PEST' | 'HUNT' | 'CLEAR' | 'DEFEND';

export interface QuestStep {
  readonly id: string;
  readonly label: string;
  /** The advance token this step listens for — '<verb>:<subject>' (e.g. 'kill:monkey'). */
  readonly event: string;
}

export interface QuestDef {
  readonly id: string;
  readonly kind: QuestKind;
  readonly title: string;
  readonly blurb: string;
  readonly steps: readonly QuestStep[];
  readonly reward: RewardBundle;
}

export const QUESTS: readonly QuestDef[] = [
  {
    id: 'first_night_round',
    kind: 'DEFEND',
    title: 'Walk the first night round',
    blurb: FLAVOR.questNightRoundOffer,
    steps: [
      {
        id: 'clear-store-rats',
        label: 'Clear the store rats along the kura wall on the round',
        event: 'kill:store_rats',
      },
      {
        id: 'clear-marten',
        label: 'Turn the marten off the roof before it reaches the coop',
        event: 'kill:marten',
      },
    ],
    reward: {
      flags: ['quest_first_night_round_done'],
      log: [
        {
          channel: 'narration',
          text: FLAVOR.questNightRoundComplete,
          contentKey: 'flavor.questNightRoundComplete',
        },
        {
          channel: 'milestone',
          text: FLAVOR.questNightRoundReward,
          contentKey: 'flavor.questNightRoundReward',
        },
      ],
    },
  },
  {
    id: 'orchard_chain',
    kind: 'CLEAR',
    title: 'Take back the orchard',
    blurb: FLAVOR.questOrchardDogsOffer,
    steps: [
      {
        id: 'drive-dogs',
        label: 'Break the feral-dog pack denned in the overgrown orchard',
        event: 'kill:feral_dog',
      },
      {
        id: 'reclaim-rows',
        label: 'Cut back the wild rows and reclaim the orchard as an orchard',
        event: 'gather:wood',
      },
    ],
    reward: {
      flags: ['quest_orchard_chain_done'],
      log: [
        {
          channel: 'narration',
          text: FLAVOR.questOrchardDogsComplete,
          contentKey: 'flavor.questOrchardDogsComplete',
        },
        {
          channel: 'milestone',
          text: FLAVOR.questOrchardReclaimReward,
          contentKey: 'flavor.questOrchardReclaimReward',
        },
      ],
    },
  },
  {
    id: 'defend_grove',
    kind: 'DEFEND',
    title: 'Drive the troop from the rows',
    blurb: FLAVOR.questGroveMonkeysOffer,
    steps: [
      {
        id: 'rout-monkey',
        label: 'Rout the crop-raiding monkeys from the vegetable rows',
        event: 'kill:monkey',
      },
      {
        id: 'break-troop',
        label: 'Turn the troop big-male, and the rest break for the grove',
        event: 'kill:monkey_male',
      },
    ],
    reward: {
      flags: ['quest_defend_grove_done'],
      log: [
        {
          channel: 'narration',
          text: FLAVOR.questGroveMaleComplete,
          contentKey: 'flavor.questGroveMaleComplete',
        },
        {
          channel: 'milestone',
          text: FLAVOR.questGroveMonkeysReward,
          contentKey: 'flavor.questGroveMonkeysReward',
        },
      ],
    },
  },
  {
    id: 'pest_weir_screens',
    kind: 'PEST',
    title: 'Keep the leased screens whole',
    blurb: FLAVOR.questWeirRatsOffer,
    steps: [
      {
        id: 'clear-river-rats',
        label: 'Clear the river rats gnawing the weir screens',
        event: 'kill:river_rats',
      },
      {
        id: 'mend-screens',
        label: 'Cut green bamboo and mend the gnawed weir screens',
        event: 'gather:wood',
      },
    ],
    reward: {
      flags: ['quest_pest_weir_screens_done'],
      log: [
        {
          channel: 'narration',
          text: FLAVOR.questWeirRatsComplete,
          contentKey: 'flavor.questWeirRatsComplete',
        },
        {
          channel: 'narration',
          text: FLAVOR.questWeirRatsSpeech,
          contentKey: 'flavor.questWeirRatsSpeech',
        },
        {
          channel: 'milestone',
          text: FLAVOR.questWeirRatsReward,
          contentKey: 'flavor.questWeirRatsReward',
        },
      ],
    },
  },
  {
    id: 'pest_field_margins',
    kind: 'PEST',
    title: 'Dig out the field-margin setts',
    blurb: FLAVOR.questMarginSettsOffer,
    steps: [
      {
        id: 'drive-tanuki',
        label: 'Drive the tanuki off the drying racks at the field margin',
        event: 'kill:tanuki',
      },
      {
        id: 'dig-badger',
        label: 'Dig out the badger under the seed store',
        event: 'kill:badger',
      },
    ],
    reward: {
      flags: ['quest_pest_field_margins_done'],
      log: [
        {
          channel: 'narration',
          text: FLAVOR.questMarginSettsComplete,
          contentKey: 'flavor.questMarginSettsComplete',
        },
        {
          channel: 'milestone',
          text: FLAVOR.questMarginSettsReward,
          contentKey: 'flavor.questMarginSettsReward',
        },
      ],
    },
  },
];

/** Every quest id — the membership set (mirrors MOB_IDS / WEAPON_IDS / ACTIVITY_IDS). */
export const QUEST_IDS: ReadonlySet<string> = new Set(QUESTS.map((q) => q.id));

/** Resolve a quest by id; throws on an unknown id (mirrors getMob / getWeapon). */
export function getQuest(id: string): QuestDef {
  const q = QUESTS.find((x) => x.id === id);
  if (!q) throw new Error(`unknown quest: ${id}`);
  return q;
}

/**
 * ORDER-FREE advance: return a NEW done-set with every not-yet-done step whose `.event`
 * matches `event` marked complete. Never mutates `done`; an event that matches no step is a
 * no-op (the set is returned unchanged). Step order is irrelevant — any event may land first.
 */
export function advanceQuest(
  done: ReadonlySet<string>,
  event: string,
  quest: QuestDef,
): ReadonlySet<string> {
  const matched = quest.steps.filter((s) => s.event === event && !done.has(s.id));
  if (matched.length === 0) return done;
  const next = new Set(done);
  for (const s of matched) next.add(s.id);
  return next;
}

/** A quest is complete once ALL of its steps are done — in ANY order. */
export function isQuestComplete(done: ReadonlySet<string>, quest: QuestDef): boolean {
  return quest.steps.every((s) => done.has(s.id));
}
