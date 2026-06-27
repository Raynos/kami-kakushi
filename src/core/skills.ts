// Per-skill XP curves & levels (PRD §4.5). An integer 1.3×-per-level cumulative
// table — fully deterministic (no Math.pow / floats in the threshold math). Skills
// surface discover-by-doing once they hold any XP.

import type { GameState } from './state';
import type { SkillId } from './content/skills';
import {
  SKILL_XP_BASE,
  SKILL_XP_GROWTH_NUM,
  SKILL_XP_GROWTH_DEN,
  SKILL_MAX_LEVEL,
  SKILL_VISIBILITY_XP,
  SKILL_YIELD_DEN,
  SKILL_YIELD_PER_LEVEL_NUM,
  SKILL_YIELD_CAP_NUM,
} from './content/balance';

// CUM[level] = total XP needed to BE that level. CUM[1] = 0.
const CUM: readonly number[] = (() => {
  const arr: number[] = [0, 0]; // index 0 unused, index 1 = level 1
  let cost = SKILL_XP_BASE;
  for (let level = 2; level <= SKILL_MAX_LEVEL; level++) {
    arr[level] = arr[level - 1]! + cost;
    cost = Math.floor((cost * SKILL_XP_GROWTH_NUM) / SKILL_XP_GROWTH_DEN);
  }
  return arr;
})();

export function levelForXp(xp: number): number {
  let level = 1;
  while (level < SKILL_MAX_LEVEL && xp >= (CUM[level + 1] ?? Infinity)) level++;
  return level;
}

export function skillXp(state: GameState, id: SkillId): number {
  return state.skillXp[id] ?? 0;
}

export function skillLevel(state: GameState, id: SkillId): number {
  return levelForXp(skillXp(state, id));
}

export function skillVisible(state: GameState, id: SkillId): boolean {
  return skillXp(state, id) >= SKILL_VISIBILITY_XP;
}

/**
 * The integer fixed-point labour-yield numerator for a skill level (audit #4): a
 * bounded "work → skill up → faster output" accelerator. Returns SKILL_YIELD_DEN
 * (×1.00) at L1 — so L1 yields are byte-identical to v0.1 — ramping +PER_LEVEL_NUM%
 * per level to the +CAP_NUM% ceiling (×3.0 at L51). Deterministic, no Math.pow.
 */
export function skillYieldNum(level: number): number {
  return SKILL_YIELD_DEN + Math.min((level - 1) * SKILL_YIELD_PER_LEVEL_NUM, SKILL_YIELD_CAP_NUM);
}

export interface SkillProgress {
  readonly level: number;
  readonly into: number;
  readonly needed: number;
}

export function skillProgress(state: GameState, id: SkillId): SkillProgress {
  const xp = skillXp(state, id);
  const level = levelForXp(xp);
  const base = CUM[level] ?? 0;
  const next = CUM[level + 1] ?? base + 1;
  return { level, into: xp - base, needed: Math.max(1, next - base) };
}
