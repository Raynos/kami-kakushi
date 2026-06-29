// T0 quests as ORDER-FREE advance-event sets (PRD §2.13 / T0-M4-F1 / D-037 / D-032).
// A quest is a small goal beyond grinding: a kind (PEST / HUNT / CLEAR), grounded estate
// flavour, and a set of steps that complete in ANY order. Each step listens for an `event`
// TOKEN — a '<verb>:<subject>' string ('kill:monkey', 'gather:wood') emitted by the fight /
// labour reducers — so there is no fixed step order and no nesting. Surfaces under a
// TOP-LEVEL Quests nav tab (D-037), not a nested panel; no fixed quest-type budget (D-032).
// PURE data + pure progression with NO GameState coupling (it takes a plain done-set), so it
// wires into state / intents / reducers later without this file ever importing them.

import type { RewardBundle } from '../rewards';
import { NAMES } from './names';

export type QuestKind = 'PEST' | 'HUNT' | 'CLEAR';

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
        label: 'Put down the boar rooting up the seed-beds',
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
