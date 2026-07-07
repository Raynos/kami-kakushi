import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  hasFlag,
  ascensionAvailable,
  applyGrindFight,
  focusedOptimalIntent,
  type GameState,
  rungProgress,
  promotionReady,
  rungRequirements,
} from './index';

// STRUCTURAL INVARIANTS across a long real playthrough — a property/fuzz-lite guard that catches a
// whole CLASS of bugs the targeted tests miss: numeric corruption (NaN/Infinity), resource/vital
// underflow (negative coin/hp), a broken write-once reveal latch (a surface getting UN-revealed), or
// a non-monotonic clock/log. We drive the SAME auto-pilot as the t0-arc proof (cold open → ascension,
// thousands of real reduces) and assert the invariants hold at EVERY single step — so a regression
// anywhere on the spine that corrupts state trips here with the exact step number.

const finite = (n: number): boolean => typeof n === 'number' && Number.isFinite(n);

/** Per-state invariants. Returns a failure string (with the offending field) or null if clean. */
function checkState(s: GameState): string | null {
  const c = s.character;
  if (!finite(c.hp) || c.hp < 0) return `hp=${c.hp}`;
  if (!finite(c.satiety) || c.satiety < 0) return `satiety=${c.satiety}`;
  if (!finite(c.level) || c.level < 1) return `level=${c.level}`;
  if (!finite(c.combatXp) || c.combatXp < 0) return `combatXp=${c.combatXp}`;
  if (!finite(c.attributePoints) || c.attributePoints < 0)
    return `attributePoints=${c.attributePoints}`;
  for (const [k, v] of Object.entries(c.attrs)) {
    if (!finite(v) || v < 0) return `attr ${k}=${v}`;
  }
  for (const [k, v] of Object.entries(s.resources)) {
    if (!finite(v) || v < 0) return `resource ${k}=${v}`;
  }
  for (const [k, v] of Object.entries(s.skillXp)) {
    if (!finite(v ?? 0) || (v ?? 0) < 0) return `skillXp ${k}=${v}`;
  }
  for (const [k, v] of Object.entries(s.rungReqs)) {
    if (!finite(v) || v < 0) return `rungReqs ${k}=${v}`;
  }
  if (!finite(s.tier) || s.tier < 0) return `tier=${s.tier}`;
  if (!finite(s.estateStage) || s.estateStage < 0) return `estateStage=${s.estateStage}`;
  if (!finite(s.weaponDurability) || s.weaponDurability < 0)
    return `durability=${s.weaponDurability}`;
  const e = s.influence.estate;
  if (!finite(e.value) || e.value < 0) return `influence.value=${e.value}`;
  if (!finite(e.highWater) || e.highWater < e.value) return `influence.highWater=${e.highWater}`;
  if (!finite(e.judged) || e.judged < 0) return `influence.judged=${e.judged}`;
  if (s.schemaVersion <= 0) return `schemaVersion=${s.schemaVersion}`;
  return null;
}

describe('structural invariants hold across a full real playthrough', () => {
  // Drive cold open → ascension, capturing every state so we can assert per-state AND cross-state.
  const states: GameState[] = [];
  {
    let s = reduce(createInitialState(20260626), { type: 'open_eyes' });
    states.push(s);
    let guard = 0;
    while (s.tier === 0 && guard++ < 1_000_000) {
      if (ascensionAvailable(s)) {
        s = reduce(s, { type: 'ascend' });
        states.push(s);
        break;
      }
      if (s.rung === 'R3' && !hasFlag(s, 'combat-blooded')) {
        s = applyGrindFight(s, 'monkey');
      } else {
        const intent = focusedOptimalIntent(s);
        if (!intent) break;
        s = reduce(s, intent);
      }
      states.push(s);
    }
  }

  it('the playthrough is long enough to be a real exercise (thousands of steps to ascension)', () => {
    expect(states.length).toBeGreaterThan(2000);
    expect(states[states.length - 1]!.tier).toBe(1); // it actually reached ascension
  });

  it('no state ever holds a corrupt value (NaN/Infinity, or a negative vital/resource/skill)', () => {
    for (let i = 0; i < states.length; i++) {
      const fail = checkState(states[i]!);
      expect(fail, `corrupt state at step ${i}: ${fail}`).toBeNull();
    }
  });

  it('the reveal latch is WRITE-ONCE — unlocked only ever grows, never loses a surface', () => {
    const seen = new Set<string>();
    let prevRef: readonly string[] | null = null;
    for (let i = 0; i < states.length; i++) {
      const u = states[i]!.unlocked;
      if (u === prevRef) continue; // structural sharing: the array is unchanged this step — O(1) skip
      prevRef = u;
      expect(u.length, `unlocked shrank at step ${i}`).toBeGreaterThanOrEqual(seen.size);
      for (const id of seen) expect(u.includes(id), `lost surface '${id}' at step ${i}`).toBe(true);
      for (const id of u) seen.add(id);
    }
  });

  it('the clock and the log sequence are MONOTONIC (time and history never run backwards)', () => {
    for (let i = 1; i < states.length; i++) {
      const prev = states[i - 1]!;
      const cur = states[i]!;
      const t0 = prev.clock.day * 24 + prev.clock.tick;
      const t1 = cur.clock.day * 24 + cur.clock.tick;
      expect(t1, `clock ran backwards at step ${i}`).toBeGreaterThanOrEqual(t0);
      expect(cur.log.seq, `log.seq ran backwards at step ${i}`).toBeGreaterThanOrEqual(
        prev.log.seq,
      );
    }
  });

  it('the rung only ever climbs (the ladder never demotes mid-play)', () => {
    const order = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'];
    for (let i = 1; i < states.length; i++) {
      const a = order.indexOf(states[i - 1]!.rung);
      const b = order.indexOf(states[i]!.rung);
      expect(b, `rung demoted at step ${i}`).toBeGreaterThanOrEqual(a);
    }
  });

  // FB-121 / ADR-137 (the plan's Phase-6 named invariants): the requirement percent is
  // the player's ONLY progression read, so its contract holds across the whole real arc.
  it('rung percent: integer in [0,100], monotonic within a rung, resets on promotion', () => {
    for (let i = 0; i < states.length; i++) {
      const p = rungProgress(states[i]!).percent;
      expect(Number.isInteger(p), `non-integer percent at step ${i}`).toBe(true);
      expect(p, `percent out of range at step ${i}`).toBeGreaterThanOrEqual(0);
      expect(p, `percent out of range at step ${i}`).toBeLessThanOrEqual(100);
      if (i === 0) continue;
      if (states[i]!.rung === states[i - 1]!.rung) {
        // same rung: the bar NEVER moves backwards (progress accrues, completion latches)
        expect(p, `percent fell at step ${i}`).toBeGreaterThanOrEqual(
          rungProgress(states[i - 1]!).percent,
        );
      } else {
        // a promotion resets the map. COUNT progress opens at 0; an ATOMIC (state/flag)
        // requirement may legitimately pre-latch the same tick — already holding 100 mon
        // when the rung turns IS the requirement met (the settle pass runs in finish()).
        for (const req of rungRequirements(states[i]!.rung)) {
          if (req.type === 'count') {
            expect(
              states[i]!.rungReqs[req.id] ?? 0,
              `count req ${req.id} carried progress across the step-${i} promotion`,
            ).toBe(0);
          }
        }
        expect(p, `born READY at the step-${i} promotion (no work left?)`).toBeLessThan(100);
      }
    }
  });

  it('100 ⟺ promotionReady — the bar can never lie about the gate (the 99-clamp)', () => {
    for (let i = 0; i < states.length; i++) {
      const s = states[i]!;
      expect(rungProgress(s).percent === 100, `percent/gate disagree at step ${i}`).toBe(
        promotionReady(s),
      );
    }
  });
});
