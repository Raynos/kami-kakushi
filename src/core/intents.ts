// The action reducer (PRD §6.3): every player verb is a typed Intent; reduce maps a
// verb → new state. Pure, deterministic, immutable-in/out. Mode-guarded — an intent
// that isn't currently legal is a no-op. The Intent union grows additively per
// milestone; M0–M1 cover the cold open + the T0 Phase-1 labour spine.

import type { GameState } from './state';
import { setFlag, hasFlag, withResource, addSkillXp } from './state';
import { applyRewards } from './rewards';
import { revealPass } from './unlock';
import { advanceClock } from './step';
import { clamp } from './math';
import { satietyMax, staminaRate, season, canDoActivity } from './selectors';
import { accrueRungMeter, promoteRungs } from './ranks';
import {
  RICE_PER_RAKE,
  SATIETY_PER_ACT,
  SATIETY_PER_REST,
  TICKS_PER_ACT,
  HARVEST_AUTUMN_MULT_NUM,
  HARVEST_AUTUMN_MULT_DEN,
} from './content/balance';
import { COLD_OPEN, rakeLine } from './content/coldOpen';
import {
  getActivity,
  activityLine,
  type ActivityId,
  type LabourResource,
} from './content/activities';

export type Intent =
  | { type: 'open_eyes' }
  | { type: 'rake_rice' }
  | { type: 'rest' }
  | { type: 'do_activity'; activityId: ActivityId }
  | { type: 'set_auto'; activityId: ActivityId | null };

export type IntentType = Intent['type'];

/** The currently-legal no-arg meta verbs (the cold-open / rest loop). */
export function availableActions(state: GameState): ('open_eyes' | 'rake_rice' | 'rest')[] {
  if (!hasFlag(state, 'awake')) return ['open_eyes'];
  const acts: ('rake_rice' | 'rest')[] = [];
  if (!hasFlag(state, 'rank-r1')) acts.push('rake_rice'); // day-labour, before being kept on
  if (hasFlag(state, 'raked')) acts.push('rest');
  return acts;
}

function metaLegal(state: GameState, type: 'open_eyes' | 'rake_rice' | 'rest'): boolean {
  return availableActions(state).includes(type);
}

function adjustSatiety(state: GameState, delta: number): GameState {
  const satiety = clamp(state.character.satiety + delta, 0, satietyMax(state));
  return { ...state, character: { ...state.character, satiety } };
}

function finish(state: GameState): GameState {
  return revealPass(promoteRungs(state));
}

export function reduce(state: GameState, intent: Intent): GameState {
  let next = state;
  switch (intent.type) {
    case 'open_eyes': {
      if (!metaLegal(state, 'open_eyes')) return state;
      next = setFlag(next, 'awake', true);
      next = applyRewards(next, {
        flags: ['dream-1'],
        log: [
          { channel: 'narration', text: COLD_OPEN.wake },
          { channel: 'narration', text: COLD_OPEN.grounding },
          { channel: 'narration', text: COLD_OPEN.dream },
        ],
      });
      break;
    }
    case 'rake_rice': {
      if (!metaLegal(state, 'rake_rice')) return state;
      next = withResource(next, 'koku', RICE_PER_RAKE);
      next = adjustSatiety(next, -SATIETY_PER_ACT);
      next = applyRewards(next, {
        flags: ['raked'],
        log: [{ channel: 'reward', text: rakeLine(RICE_PER_RAKE) }],
      });
      next = accrueRungMeter(next, 'rake_rice');
      next = advanceClock(next, TICKS_PER_ACT);
      break;
    }
    case 'rest': {
      if (!metaLegal(state, 'rest')) return state;
      next = adjustSatiety(next, SATIETY_PER_REST);
      next = applyRewards(next, { log: [{ channel: 'system', text: COLD_OPEN.restAct }] });
      next = advanceClock(next, TICKS_PER_ACT);
      break;
    }
    case 'do_activity': {
      const act = getActivity(intent.activityId);
      if (!canDoActivity(next, act)) return state;
      const rate = staminaRate(next);
      const autumn = act.seasonHarvest === true && season(next) === 'autumn';
      const gained: Partial<Record<LabourResource, number>> = {};
      for (const [res, amt] of Object.entries(act.yields) as [LabourResource, number][]) {
        let v = amt * rate;
        if (autumn) v = (v * HARVEST_AUTUMN_MULT_NUM) / HARVEST_AUTUMN_MULT_DEN;
        gained[res] = Math.max(1, Math.round(v));
      }
      const xpGain = Math.max(1, Math.round(act.xp * rate));
      next = addSkillXp(next, act.skill, xpGain);
      next = adjustSatiety(next, -act.satietyCost);
      const storyFlags: string[] = [];
      if (act.id === 'farm_paddy') storyFlags.push('farmed');
      next = applyRewards(next, {
        resources: gained as Record<string, number>,
        flags: storyFlags,
        log: [{ channel: 'reward', text: activityLine(act, gained) }],
      });
      next = accrueRungMeter(next, act.id);
      next = advanceClock(next, TICKS_PER_ACT);
      break;
    }
    case 'set_auto': {
      next = { ...next, autoActivity: intent.activityId };
      break;
    }
  }
  return finish(next);
}
