import { describe, it, expect } from 'vitest';
import { RANKS } from './ranks';
import { RUNG_REQUIREMENTS, rungRequirements } from './requirements';
import { ACTIVITIES } from './activities';
import { MOB_IDS } from './enemies';
import { BELONGING_IDS } from './home';
import { SKILLS } from './skills';
import { NATIVE_PREDICATES } from '../requirements-engine';

// Registry-consistency invariants (ADR-086: every expectation derives from the
// source-of-truth registries — ACTIVITIES, MOBS, BELONGINGS, SKILLS, RANKS —
// never frozen copies). These go RED when an authored requirement references
// vocabulary the game doesn't have: a token no reducer emits, a mob that
// doesn't exist, a native key with no predicate.

// The advance tokens the reducers emit (the ONE token grammar shared with
// quests, ADR-037): 'act:<activityId>' for every labour act + the rake meta-verb
// + the repair intent (Phase 3 glue), 'kill:<mobId>' from fights, and
// 'gather:<resource>' per labour yield.
const EMITTED_TOKENS = new Set<string>([
  ...ACTIVITIES.map((a) => `act:${a.id}`),
  'act:rake_rice',
  'act:repair_weapon',
  ...[...MOB_IDS].map((m) => `kill:${m}`),
  ...ACTIVITIES.flatMap((a) => Object.keys(a.yields)).map((r) => `gather:${r}`),
]);

const SKILL_ID_SET = new Set<string>(SKILLS.map((s) => s.id));

describe('requirements registry (FB-121) — authored lists resolve against the real game', () => {
  it('every rung R0–R7 has a non-empty authored list', () => {
    for (const rank of RANKS) {
      expect(rungRequirements(rank.id).length, `rung ${rank.id}`).toBeGreaterThan(0);
    }
    expect(Object.keys(RUNG_REQUIREMENTS).sort()).toEqual(RANKS.map((r) => r.id).sort());
  });

  it('every count token is one a reducer actually emits (a silent-never-completes guard)', () => {
    for (const rank of RANKS) {
      for (const req of rungRequirements(rank.id)) {
        if (req.type !== 'count') continue;
        expect(EMITTED_TOKENS.has(req.token), `${rank.id}/${req.id}: token "${req.token}"`).toBe(
          true,
        );
      }
    }
  });

  it('every state predicate references real vocabulary (belongings, skills, natives)', () => {
    for (const rank of RANKS) {
      for (const req of rungRequirements(rank.id)) {
        if (req.type !== 'state') continue;
        const p = req.pred;
        const label = `${rank.id}/${req.id}`;
        if (p.kind === 'belonging') {
          expect(BELONGING_IDS.has(p.id), `${label}: belonging "${p.id}"`).toBe(true);
        } else if (p.kind === 'skill') {
          expect(SKILL_ID_SET.has(p.skill), `${label}: skill "${p.skill}"`).toBe(true);
        } else if (p.kind === 'native') {
          expect(NATIVE_PREDICATES[p.key], `${label}: native "${p.key}"`).toBeDefined();
        } else {
          expect(['rice', 'coin', 'wood', 'sansai'], `${label}: res "${p.res}"`).toContain(p.res);
        }
      }
    }
  });

  it('req ids are unique within their rung and every req carries flavor + drive', () => {
    for (const rank of RANKS) {
      const reqs = rungRequirements(rank.id);
      const ids = reqs.map((r) => r.id);
      expect(new Set(ids).size, `rung ${rank.id} ids`).toBe(ids.length);
      for (const req of reqs) {
        expect(req.flavor.length, `${rank.id}/${req.id} flavor`).toBeGreaterThan(0);
        expect(req.drive.length, `${rank.id}/${req.id} drive`).toBeGreaterThan(0);
      }
    }
  });
});
