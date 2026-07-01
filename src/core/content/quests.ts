// T0 quests as ORDER-FREE advance-event sets (PRD §2.13 / T0-M4-F1 / D-037 / D-032 / A6).
// A quest is a small goal beyond grinding: a kind (PEST / HUNT / CLEAR / DEFEND), grounded
// estate flavour, and a set of steps that complete in ANY order. Each step listens for an `event`
// TOKEN — a '<verb>:<subject>' string ('kill:monkey', 'gather:wood') emitted by the fight /
// labour reducers — so there is no fixed step order and no nesting. Surfaces under a
// TOP-LEVEL Quests nav tab (D-037), not a nested panel; no fixed quest-type budget (D-032).
// PURE data + pure progression with NO GameState coupling (it takes a plain done-set), so it
// wires into state / intents / reducers later without this file ever importing them.

import type { RewardBundle } from '../rewards';
import { NAMES } from './names';

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
    id: 'pest_crop_raiders',
    kind: 'PEST',
    title: 'Drive off the crop-raiders',
    blurb:
      'Monkeys and boar have come down out of the satoyama to strip the ripening paddies — thin the raiders, then mend what they have trampled before the harvest is lost.',
    steps: [
      {
        id: 'rout-monkey',
        label: 'Rout a crop-raiding monkey from the home paddies',
        event: 'kill:monkey',
      },
      {
        id: 'down-boar',
        label: 'Track the boar to its wallow in the deep satoyama and put it down',
        event: 'kill:boar',
      },
      {
        id: 'mend-fence',
        label: 'Cut stakes at the woodlot edge and mend the trampled paddy-fence',
        event: 'gather:wood',
      },
    ],
    reward: {
      resources: { koku: 30 },
      flags: ['quest_pest_crop_raiders_done'],
      log: [
        {
          channel: 'milestone',
          text: `The paddies stand quiet again. ${NAMES.elder} counts thirty koku from the house purse into your hand — "for the rice you kept on the stalk."`,
        },
      ],
    },
  },
  {
    id: 'hunt_satoyama_predators',
    kind: 'HUNT',
    title: 'Hunt the satoyama predators',
    blurb:
      'The lean wolves and a tusked boar have grown bold on the hill-trails, taking stock and testing the folds. Go up into the satoyama and put the worst of them down before they come to the yard.',
    steps: [
      { id: 'hunt-wolf', label: 'Bring down a lean wolf in the near satoyama', event: 'kill:wolf' },
      {
        id: 'hunt-boar',
        label: 'Track the boar to its wallow in the deep satoyama and kill it',
        event: 'kill:boar',
      },
    ],
    reward: {
      resources: { koku: 24 },
      flags: ['quest_hunt_satoyama_predators_done'],
      log: [
        {
          channel: 'milestone',
          text: `${NAMES.drillmaster} the drillmaster looks over the hides you bring in and grunts, almost approving. "The hills are quieter for it. Twenty-four koku — a hunter's due."`,
        },
      ],
    },
  },
  {
    id: 'clear_satoyama_trails',
    kind: 'CLEAR',
    title: 'Clear the satoyama trails',
    blurb:
      'No one can work the far ground while every trail hides a raider. Sweep the whole rising country — monkey, wolf, and boar alike — until a porter can walk the paths unarmed.',
    steps: [
      {
        id: 'clear-monkey',
        label: 'Rout a crop-raiding monkey from the trails',
        event: 'kill:monkey',
      },
      {
        id: 'clear-wolf',
        label: 'Down a lean wolf on the near-satoyama paths',
        event: 'kill:wolf',
      },
      {
        id: 'clear-boar',
        label: 'Kill the boar that dens in the deep satoyama',
        event: 'kill:boar',
      },
    ],
    reward: {
      resources: { koku: 40 },
      flags: ['quest_clear_satoyama_trails_done'],
      log: [
        {
          channel: 'milestone',
          text: `Word goes round that the satoyama trails are safe to walk. ${NAMES.elder} marks it in the house book and hands you forty koku — "a road cleared is a road that earns."`,
        },
      ],
    },
  },
  {
    id: 'defend_the_stores',
    kind: 'DEFEND',
    title: 'Defend the grain-store',
    blurb:
      'Raiders have found the granary. Hold the stores through the season — beat back what comes for the rice, and bar the store against the next night.',
    steps: [
      {
        id: 'defend-monkey',
        label: 'Drive a raiding monkey off the granary',
        event: 'kill:monkey',
      },
      {
        id: 'defend-wolf',
        label: 'Kill the wolf that breaks for the stores at night',
        event: 'kill:wolf',
      },
      { id: 'defend-bar', label: 'Cut timber and bar the grain-store door', event: 'gather:wood' },
    ],
    reward: {
      resources: { koku: 28 },
      flags: ['quest_defend_the_stores_done'],
      log: [
        {
          channel: 'milestone',
          text: `The stores come through the season whole. ${NAMES.elder} rests a hand on the barred door. "The house eats this winter because you held this. Twenty-eight koku — and the trust that comes with it."`,
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
