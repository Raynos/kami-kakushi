import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  hasFlag,
  ascensionAvailable,
  applyGrindFight,
  focusedOptimalIntent,
  resolveNightStage,
  nightRoundById,
  rungProgress,
  promotionReady,
  playerSpeaker,
  hpMax,
  visibleSet,
  factsForSurfaces,
  getMob,
  MOBS,
  balance,
  type GameState,
  type Intent,
} from './index';
import { RUNG_BEATS } from './content/rungBeats';

// STRUCTURAL + TIER invariants across a long REAL playthrough of the storywave T0 arc — a
// property/fuzz-lite guard that catches a whole CLASS of bugs the targeted tests miss: numeric
// corruption, resource/vital underflow, a broken write-once reveal latch, a non-monotonic clock,
// AND the tier's design LAWS (labour never wounds; combat drops carry no coin; the season wheel
// only turns by intent; Autumn never exits unreckoned; the speaker name only climbs; rice lives
// only in the kura; HP rises only by a deliberate meal; every rung-up surfaces a VN scene). We
// drive the SAME shared focused-optimal auto-pilot as the t0-arc proof (weir cold open → ascension)
// and assert the invariants hold at EVERY step — a regression on the spine trips here with the step.

interface Step {
  readonly intent: Intent | { readonly type: 'night-stage'; readonly foe: string };
  readonly before: GameState;
  readonly after: GameState;
}

const arc = (() => {
  let s = reduce(createInitialState(20260626), { type: 'open_eyes' });
  const states: GameState[] = [s];
  const steps: Step[] = [];
  let guard = 0;
  while (s.tier === 0 && guard++ < 2_000_000) {
    if (ascensionAvailable(s)) {
      const after = reduce(s, { type: 'ascend' });
      steps.push({ intent: { type: 'ascend' }, before: s, after });
      states.push(after);
      s = after;
      break;
    }
    if (s.roundState !== null) {
      const def = nightRoundById(s.roundState.roundId)!;
      const foe = def.stages[s.roundState.stage]?.foe ?? '?';
      const after = resolveNightStage(s, def);
      steps.push({ intent: { type: 'night-stage', foe }, before: s, after });
      states.push(after);
      s = after;
      continue;
    }
    const intent = focusedOptimalIntent(s);
    if (!intent) break;
    const after = reduce(s, intent);
    steps.push({ intent, before: s, after });
    states.push(after);
    s = after;
  }
  return { states, steps, final: s };
})();

const finite = (n: number): boolean => typeof n === 'number' && Number.isFinite(n);

/** Per-state corruption check — a failure string (with the offending field) or null if clean. */
function checkState(s: GameState): string | null {
  const c = s.character;
  if (!finite(c.hp) || c.hp < 0) return `hp=${c.hp}`;
  if (!finite(c.satiety) || c.satiety < 0) return `satiety=${c.satiety}`;
  // ADR-178 — the belly holds its clamp band at every step (the daily drain/ration and every
  // meal route through adjustHunger, so an out-of-band value means a write bypassed the clamp).
  if (!finite(c.hunger) || c.hunger < 0 || c.hunger > balance.HUNGER_MAX)
    return `hunger=${c.hunger}`;
  if (!finite(c.level) || c.level < 1) return `level=${c.level}`;
  if (!finite(c.combatXp) || c.combatXp < 0) return `combatXp=${c.combatXp}`;
  for (const [k, v] of Object.entries(c.attrs)) if (!finite(v)) return `attr ${k}=${v}`;
  for (const [k, v] of Object.entries(s.resources)) {
    if (!finite(v) || v < 0) return `resource ${k}=${v}`;
  }
  for (const [k, v] of Object.entries(s.banked)) if (!finite(v) || v < 0) return `banked ${k}=${v}`;
  for (const [k, v] of Object.entries(s.rungReqs))
    if (!finite(v) || v < 0) return `rungReqs ${k}=${v}`;
  if (!finite(s.tier) || s.tier < 0) return `tier=${s.tier}`;
  if (!finite(s.estateStage) || s.estateStage < 0) return `estateStage=${s.estateStage}`;
  if (!finite(s.seasonsPassed) || s.seasonsPassed < 0) return `seasonsPassed=${s.seasonsPassed}`;
  const e = s.influence.estate;
  if (!finite(e.value) || e.value < 0) return `influence.value=${e.value}`;
  if (!finite(e.highWater) || e.highWater < e.value) return `influence.highWater=${e.highWater}`;
  return null;
}

describe('structural invariants hold across the full real playthrough', () => {
  it('the playthrough is long enough to be a real exercise (a four-figure walk to ascension)', () => {
    // The floor is a sanity check that the arc exercised the systems, not a pacing
    // assertion (the [3, 22] band gate owns pacing). HD-35's re-pace (2026-07-10)
    // shrank the greedy arc ~3.6k → ~1.3k dispatches; 1000 stays comfortably below
    // every gating seed while still catching a collapsed/short-circuited arc.
    expect(arc.states.length).toBeGreaterThan(1000);
    expect(arc.final.tier).toBe(1); // it actually reached ascension
  });

  it('no state ever holds a corrupt value (NaN/Infinity, or a negative vital/resource)', () => {
    for (let i = 0; i < arc.states.length; i++) {
      const fail = checkState(arc.states[i]!);
      expect(fail, `corrupt state at step ${i}: ${fail}`).toBeNull();
    }
  });

  // ADR-179 — `unlocked` is deleted; visibility is DERIVED. The invariant splits in two:
  // the announce latch (`seenReveals`) stays write-once, and the derived visible set must
  // be MONOTONE across real play (TST2 — a fact predicate may never un-reveal a surface).
  it('the announce latch is WRITE-ONCE — seenReveals only ever grows, never loses a surface', () => {
    const seen = new Set<string>();
    let prevRef: readonly string[] | null = null;
    for (let i = 0; i < arc.states.length; i++) {
      const u = arc.states[i]!.seenReveals;
      if (u === prevRef) continue;
      prevRef = u;
      expect(u.length, `seenReveals shrank at step ${i}`).toBeGreaterThanOrEqual(seen.size);
      for (const id of seen) expect(u.includes(id), `lost reveal '${id}' at step ${i}`).toBe(true);
      for (const id of u) seen.add(id);
    }
  });

  it('the DERIVED visible set only ever grows — no surface un-reveals mid-play (ADR-179 / TST2)', () => {
    // checkState-style: report only the first offender (a per-id expect over the whole
    // arc would be ~50k assertions for nothing on the green path).
    let fail: string | null = null;
    let prevVis: ReadonlySet<string> = new Set();
    for (let i = 0; i < arc.states.length && fail === null; i++) {
      const vis = visibleSet(arc.states[i]!);
      for (const id of prevVis) {
        if (!vis.has(id)) {
          fail = `visible surface '${id}' vanished at step ${i}`;
          break;
        }
      }
      prevVis = vis;
    }
    expect(fail).toBeNull();
    expect(prevVis.size).toBeGreaterThan(0); // never vacuous — the arc revealed real surfaces
  });

  it('the clock and the log sequence are MONOTONIC (time and history never run backwards)', () => {
    for (let i = 1; i < arc.states.length; i++) {
      const prev = arc.states[i - 1]!;
      const cur = arc.states[i]!;
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
    for (let i = 1; i < arc.states.length; i++) {
      const a = order.indexOf(arc.states[i - 1]!.rung);
      const b = order.indexOf(arc.states[i]!.rung);
      expect(b, `rung demoted at step ${i}`).toBeGreaterThanOrEqual(a);
    }
  });

  it('100 ⟺ promotionReady — the requirement bar can never lie about the gate', () => {
    for (let i = 0; i < arc.states.length; i++) {
      const s = arc.states[i]!;
      expect(rungProgress(s).percent === 100, `percent/gate disagree at step ${i}`).toBe(
        promotionReady(s),
      );
    }
  });
});

describe('the T0 TIER invariants (the design laws) hold across the full playthrough', () => {
  it('LABOUR never reduces HP — work spends satiety, never health (the one-way coupling)', () => {
    for (const st of arc.steps) {
      if (st.intent.type === 'do_activity' || st.intent.type === 'rake_rice') {
        expect(
          st.after.character.hp,
          `labour ${st.intent.type} cut HP ${st.before.character.hp}→${st.after.character.hp}`,
        ).toBeGreaterThanOrEqual(st.before.character.hp);
      }
    }
  });

  it('HP rises ONLY by a deliberate sickroom act — never off food, labour, rest, or a fight', () => {
    // ADR-164/ADR-197 — recovery is a deliberate spend of mon (treat) or a day
    // (rest_sickroom); cook_meal feeds the belly and must NOT appear here.
    for (const st of arc.steps) {
      if (st.after.character.hp > st.before.character.hp) {
        expect(
          ['treat', 'rest_sickroom'],
          `HP rose on a non-sickroom intent (${st.intent.type})`,
        ).toContain(st.intent.type);
      }
    }
  });

  it('the season WHEEL only advances by the advance_season intent (never a silent auto-turn)', () => {
    for (const st of arc.steps) {
      if (st.intent.type === 'advance_season') continue;
      expect(st.after.season, `season turned on ${st.intent.type}`).toBe(st.before.season);
      expect(st.after.seasonsPassed, `seasonsPassed moved on ${st.intent.type}`).toBe(
        st.before.seasonsPassed,
      );
    }
  });

  it('AUTUMN never exits unreckoned — the nengu latches before the wheel leaves autumn', () => {
    let sawAutumnExit = false;
    for (const st of arc.steps) {
      if (st.before.season === 'autumn' && st.after.season !== 'autumn') {
        sawAutumnExit = true;
        expect(hasFlag(st.after, 'nengu-reckoned'), 'left autumn without reckoning the nengu').toBe(
          true,
        );
      }
    }
    expect(sawAutumnExit, 'the arc never crossed an autumn boundary (nengu never tested)').toBe(
      true,
    );
  });

  it('the SPEAKER label only climbs You → Nameless → Gonbei (monotonic, never a regress)', () => {
    const rank = (s: GameState): number =>
      hasFlag(s, 'label-gonbei') ? 2 : hasFlag(s, 'label-nameless') ? 1 : 0;
    const NAMES = ['You', 'Nameless'];
    let hi = 0;
    let sawNameless = false;
    let sawGonbei = false;
    for (const s of arc.states) {
      expect(rank(s), 'speaker label regressed').toBeGreaterThanOrEqual(hi);
      hi = rank(s);
      // Gonbei (the R7 house name) can never precede Nameless (the R0 name beat).
      if (hasFlag(s, 'label-gonbei')) expect(hasFlag(s, 'label-nameless')).toBe(true);
      if (hasFlag(s, 'label-nameless')) sawNameless = true;
      if (hasFlag(s, 'label-gonbei')) sawGonbei = true;
      // the nameplate the log renders tracks the ladder (You/Nameless before the house name lands).
      if (rank(s) < 2) expect(NAMES).toContain(playerSpeaker(s));
    }
    expect(sawNameless && sawGonbei, 'the ladder never reached its two named rungs').toBe(true);
    expect(playerSpeaker(arc.final)).toBe('Gonbei'); // ends at the house name (bible R7)
  });

  it('RICE is held ONLY in the kura — it is never a carried resource, on any state', () => {
    for (let i = 0; i < arc.states.length; i++) {
      expect(arc.states[i]!.resources.rice ?? 0, `rice was carried at step ${i}`).toBe(0);
    }
  });

  it('a DEFEAT bleeds carried coin + goods but NEVER rice (rice is sheltered in the kura)', () => {
    // A fresh L1 vs the bandit is a guaranteed loss (the curve's high wall) — a real rout.
    const base = createInitialState(1);
    const armed: GameState = {
      ...base,
      character: { ...base.character, level: 1, satiety: 100 },
      resources: { ...base.resources, coin: 100, hardwood: 100 },
      banked: { ...base.banked, rice: 200 },
    };
    const ready = { ...armed, character: { ...armed.character, hp: hpMax(armed) } };
    const after = applyGrindFight(ready, 'bandit');
    expect(after.character.hp).toBe(balance.SETBACK_HP); // it lost
    // the ROUT bleeds a FRACTION of carried wealth — coin + goods take the LOSS_COIN/MATERIAL hit…
    expect(after.resources.coin).toBe(100 - Math.round(100 * balance.LOSS_COIN_FRAC));
    expect(after.resources.hardwood).toBe(100 - Math.floor(100 * balance.LOSS_MATERIAL_FRAC));
    // …but the kura rice takes NO rout penalty: it only ever loses the household's daily MEAL over the
    // lost sick-days (a few shō), never the ~20% carried-loss fraction (which would be 40+ here → RED).
    const rout = Math.round(200 * balance.LOSS_COIN_FRAC); // what a rice-bleed WOULD have taken
    const maxMeals = balance.CONSUMPTION_SHO_PER_DAY * (balance.SICKROOM_DAYS_LOST + 3);
    expect(200 - (after.banked.rice ?? 0), 'the rout bled the kura rice').toBeLessThanOrEqual(
      maxMeals,
    );
    expect(maxMeals).toBeLessThan(rout); // proves the two are distinguishable (the check can go RED)
    expect(after.resources.rice ?? 0).toBe(0); // and rice is never carried to bleed in the first place
  });

  it('COMBAT drops carry NO coin — a won fight mints materials only (the KIND lane)', () => {
    const strong: GameState = (() => {
      const s = createInitialState(3);
      const t: GameState = {
        ...s,
        character: {
          ...s.character,
          level: 20,
          satiety: 100,
          attrs: { str: 30, agi: 30, int: 20, spd: 30, luck: 20 },
        },
        resources: { ...s.resources, coin: 50 },
      };
      return { ...t, character: { ...t.character, hp: hpMax(t) } };
    })();
    const won = applyGrindFight(strong, 'tanuki');
    expect(won.character.combatXp).toBeGreaterThan(0); // it won
    expect(won.resources.coin ?? 0).toBe(50); // the win minted ZERO coin (materials only)
  });

  it('NO human foe is fightable below tier 2 — the bandit is canon-held, and every fought foe fits its tier', () => {
    // the sole human archetype in the roster (the road bandit) is gated to T2 (no human combat in T0/T1).
    expect(getMob('bandit').minTier ?? 0).toBeGreaterThanOrEqual(2);
    // and across the whole arc, every foe actually engaged sits at or below the tier it was fought at.
    for (const st of arc.steps) {
      let foe: string | null = null;
      if (st.intent.type === 'fight') foe = st.intent.mobId;
      else if (st.intent.type === 'night-stage') foe = st.intent.foe;
      if (foe && foe !== '?') {
        expect(getMob(foe as Parameters<typeof getMob>[0]).minTier ?? 0).toBeLessThanOrEqual(
          st.before.tier,
        );
      }
    }
    // structural: every human-tier foe (minTier ≥ 2) is absent from the T0-reachable set — the roster
    // holds exactly one such foe (the bandit), so a beast slipping to minTier ≥ 2 or a human dropping
    // below it is a RED here.
    expect(MOBS.filter((m) => (m.minTier ?? 0) >= 2).map((m) => m.id)).toEqual(['bandit']);
  });

  it('DEBT is never NUMBERED in T0 — the nengu is a felt FLAG, carrying no numeric debt field', () => {
    for (const s of arc.states) {
      // no numeric debt/nengu resource is ever surfaced (the reckoning is flags-only in T0)
      expect(s.resources.debt).toBeUndefined();
      expect(s.banked.debt).toBeUndefined();
      expect(typeof s.flags['nengu-short'] === 'number').toBe(false);
      expect(typeof s.flags['nengu-reckoned'] === 'number').toBe(false);
    }
    // the shortfall is signalled as a boolean flag (felt), never a number the player reads.
    if ('nengu-short' in arc.final.flags) {
      expect(typeof arc.final.flags['nengu-short']).toBe('boolean');
    }
  });

  it('WOLF-SURVIVED-NOT-WON survives the ascension (the run history carries through the tier)', () => {
    expect(hasFlag(arc.final, 'wolf-survived-not-won')).toBe(true);
  });

  it('every nightRoundOnly foe is un-FIGHTABLE and un-ARMABLE by day (B6 — engine law)', () => {
    // Registry-derived: for each night-only foe, stand ON its node with combat open and try
    // both day intents — the reducer must refuse (reference-equal state). RED if the C1.4
    // guards are removed, or if a future night foe is added without riding them.
    const nightFoes = MOBS.filter((m) => m.nightRoundOnly);
    expect(nightFoes.length).toBeGreaterThan(0); // never vacuous
    for (const mob of nightFoes) {
      const base = createInitialState(1);
      const s: GameState = {
        ...base,
        rung: 'R4',
        location: mob.area,
        // ADR-179 — tab-combat derives from its rung fact (rank-r3), never a stored latch.
        flags: { ...base.flags, ...factsForSurfaces('tab-combat') },
      };
      expect(reduce(s, { type: 'fight', mobId: mob.id }), `fight ${mob.id}`).toBe(s);
      expect(reduce(s, { type: 'set_auto_combat', mobId: mob.id }), `arm ${mob.id}`).toBe(s);
    }
  });

  it('EVERY rung-up R1…R7 surfaces a VN scene — a promotion beat OR a silent-content scene', () => {
    // the beat-bearing rungs each carry a RUNG_BEATS entry (the VN opened on `begin_rung_beat`)…
    for (const r of ['R1', 'R3', 'R4', 'R6', 'R7'] as const) {
      expect(RUNG_BEATS[r], `rung ${r} has no promotion beat`).toBeTruthy();
    }
    // …and the SILENT rungs (R2, R5) deliver their story as an enqueued scene that actually played.
    for (const id of ['r2-yard-hand', 'count']) {
      expect(arc.final.scenesPlayed.includes(id), `silent rung scene ${id} never played`).toBe(
        true,
      );
    }
    // the R7 capstone dream too (the 8th VN surface, beside R0's intro) — the run drained it.
    expect(arc.final.scenesPlayed.includes('r7-dream')).toBe(true);
  });
});
