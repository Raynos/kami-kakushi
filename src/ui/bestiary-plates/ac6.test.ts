// The AC-6 gate for the beast register (spec §Plate grammar #4): the
// plate's threat grade must DERIVE from `mobCombatStats` — the same stat
// block the fight and the forecast consume — never from a hand-copied
// table. The test recomputes the grade independently from the live stats,
// so a hardcoded table in plates.ts goes RED the moment any foe's level
// (and so its stats) moves in enemies.ts. COMMIT lane (fast, pure).

import { describe, expect, it } from 'vitest';
import { MOBS, mobCombatStats } from '../../core';
import { threatGrade } from './plates';

describe('bestiary-plates threat marks (AC-6)', () => {
  it('grades derive from mobCombatStats (independent recompute matches)', () => {
    const mass = (id: string): number => {
      const mob = MOBS.find((m) => m.id === id)!;
      const s = mobCombatStats(mob);
      return s.attackPower * s.hp;
    };
    const distinct = [...new Set(MOBS.map((m) => mass(m.id)))].sort(
      (a, b) => a - b,
    );
    for (const mob of MOBS) {
      const expected = Math.min(5, 1 + distinct.indexOf(mass(mob.id)));
      expect(threatGrade(mob), mob.id).toBe(expected);
    }
  });

  it('grade rank-order matches the stats danger order (rubric B4)', () => {
    const byDanger = [...MOBS].sort((a, b) => {
      const sa = mobCombatStats(a);
      const sb = mobCombatStats(b);
      return sa.attackPower * sa.hp - sb.attackPower * sb.hp;
    });
    let last = 0;
    for (const mob of byDanger) {
      const g = threatGrade(mob);
      expect(g, mob.id).toBeGreaterThanOrEqual(last);
      last = g;
    }
    // and the grades actually spread — a constant fn would satisfy
    // monotonicity vacuously (PH3: this line is what can go RED)
    expect(threatGrade(byDanger[0]!)).toBeLessThan(
      threatGrade(byDanger[byDanger.length - 1]!),
    );
  });
});
