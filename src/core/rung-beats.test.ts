import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  applyPromotion,
  promotionReady,
  pendingPromotionTarget,
  RUNG_BEATS,
  getRank,
  getWeapon,
  isUnlocked,
  hasFlag,
  revealPass,
  balance,
  INTRO_SCENE_COUNT,
  type GameState,
  type RankId,
} from './index';
import { logFilterMatches } from '../ui/log-filter';

// The D-110 rung-up STORY BEAT tier proof (D-088 pair): a full-arc e2e that walks a promotion
// THROUGH the beat + an INVARIANT that no rung advances WITHOUT its beat (RED-able against the old
// auto-promote hot path). Plus the F103 channel routing, the migration is in migrate.test.ts, and
// the three rare bonuses. Fixtures are derived from RUNG_BEATS + the RankDefs (source of truth), not
// magic numbers.

/** The story-gate flag a rung needs before it may promote (absent ⇒ always-ready). Single-sourced
 *  from the intent that sets each — R1 needs `farmed`, R2 the scripted wolf, R3 real gate-watch. */
const GATE_FLAG: Partial<Record<RankId, string>> = {
  R1: 'farmed',
  R2: 'first-fight-survived',
  R3: 'combat-blooded',
};

/** A fresh, intro-DONE game (the beat's precondition: `!introActive`). */
function atDoneIntro(seed = 1): GameState {
  const s = createInitialState(seed);
  return { ...s, flags: { ...s.flags, awake: true }, introBeat: INTRO_SCENE_COUNT };
}

/** Saturate the CURRENT rung's meter to its threshold + set its story gate ⇒ a ready promotion.
 *  (The labour-driven meter fill is proven by pacing/t0-arc; this focuses on the beat machine.) */
function makeReady(s: GameState): GameState {
  const flag = GATE_FLAG[s.rung];
  return {
    ...s,
    rungMeter: balance.rungThreshold(s.rung),
    flags: flag ? { ...s.flags, [flag]: true } : s.flags,
  };
}

const rankFlag = (id: RankId): string => `rank-${id.toLowerCase()}`;

describe('D-110 full-arc e2e — a promotion walks THROUGH the beat (R0→R7)', () => {
  it('every rung promotes only on choose_rung_option; unlocks + flags + memory apply then', () => {
    let s = atDoneIntro();
    for (const target of ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'] as RankId[]) {
      s = makeReady(s);
      expect(promotionReady(s)).toBe(true);
      expect(pendingPromotionTarget(s)).toBe(target);

      const beforeRung = s.rung;
      // (1) TRIGGER the beat — reveals the greeting, sets the cursor, but does NOT promote.
      s = reduce(s, { type: 'begin_rung_beat' });
      expect(s.rungBeat).toBe(target);
      expect(s.rung).toBe(beforeRung); // begin never advances the rung
      expect(hasFlag(s, rankFlag(target))).toBe(false); // rewardOnReach NOT applied yet

      // (2) a full-VN beat's ask-hub is free + never promotes.
      const beat = RUNG_BEATS[target]!;
      if (beat.topics.length > 0) {
        s = reduce(s, { type: 'ask_rung_topic', topicId: beat.topics[0]!.id });
        expect(s.rung).toBe(beforeRung);
        expect(s.rungBeat).toBe(target);
      }

      // (3) the TERMINAL choice applies the promotion.
      const opt = beat.decision.options[0]!;
      s = reduce(s, { type: 'choose_rung_option', optionId: opt.id });
      expect(s.rung).toBe(target);
      expect(s.rungBeat).toBeNull();
      expect(hasFlag(s, rankFlag(target))).toBe(true);
      // the beat's motivated surfaces (verbatim rewardOnReach.unlock) inked in
      for (const surf of beat.motivates) {
        expect(isUnlocked(s, surf), `${target} did not reveal ${surf}`).toBe(true);
      }
      // the chosen story flags are set
      for (const f of opt.flags ?? []) expect(hasFlag(s, f)).toBe(true);
      // the memory writes deepened the named NPCs
      for (const m of opt.memory ?? []) {
        expect(s.npcMemory[m.npc], `${target} did not remember ${m.npc}`).toBeDefined();
      }
    }
    expect(s.rung).toBe('R7');
    expect(hasFlag(s, 't0-capstone')).toBe(true); // the capstone fired on the R7 terminal choice
  });
});

describe('D-122 — the R5 wall-weapon status token (the one T0 home token)', () => {
  it('reaching R5 mounts the weapon you WIELD — reads the actual weapon, never a generic sword', () => {
    const base: GameState = { ...atDoneIntro(), rung: 'R4' };
    // wielding the default carrying-pole → the mount names IT (source-of-truth label).
    const r5pole = applyPromotion({ ...base, equippedWeapon: getWeapon('carrying_pole').id }, 'R5');
    expect(hasFlag(r5pole, 'wall-weapon')).toBe(true);
    const poleLine = r5pole.log.entries.map((e) => e.text).find((t) => t.includes('mount'));
    expect(poleLine).toBeDefined();
    expect(poleLine!.toLowerCase()).toContain(getWeapon('carrying_pole').label.toLowerCase());

    // wielding a DIFFERENT weapon → the mount names THAT one, proving it reads the wielded weapon.
    // RED against a hardcoded/generic sword or an ignored equippedWeapon.
    const r5axe = applyPromotion({ ...base, equippedWeapon: getWeapon('wood_axe').id }, 'R5');
    const axeLine = r5axe.log.entries.map((e) => e.text).find((t) => t.includes('mount'));
    expect(axeLine!.toLowerCase()).toContain(getWeapon('wood_axe').label.toLowerCase());
    expect(axeLine!.toLowerCase()).not.toContain('sword');
  });

  it('a rung that does NOT grant the token (R4) mounts nothing — the token is R5-specific', () => {
    const r4 = applyPromotion({ ...atDoneIntro(), rung: 'R3' }, 'R4');
    expect(hasFlag(r4, 'wall-weapon')).toBe(false);
    expect(r4.log.entries.some((e) => e.text.includes('mount'))).toBe(false);
  });
});

describe('D-110 INVARIANT — no rung advances without its beat', () => {
  it('filling the meter to READY never promotes; only the beat does (RED vs old auto-promote)', () => {
    const s = makeReady(atDoneIntro());
    expect(promotionReady(s)).toBe(true); // the AND-gate is open…

    // …but a REAL action on the hot path (rake runs finish()) HOLDS the rung. Against the retired
    // auto-promote, this raked-over-threshold state promoted in finish(); now it must not.
    const raked = reduce(s, { type: 'rake_rice' });
    expect(raked.rung).toBe('R0');
    expect(hasFlag(raked, 'rank-r1')).toBe(false);
    expect(isUnlocked(raked, 'verb-farm')).toBe(false); // R1's unlocks did NOT fire
    expect(raked.rungMeter).toBeGreaterThanOrEqual(balance.rungThreshold('R0')); // it still holds ready

    // the finish() body (revealPass) alone likewise never promotes.
    expect(revealPass(s).rung).toBe('R0');

    // ONLY begin_rung_beat → choose_rung_option promotes.
    const opt = RUNG_BEATS.R1!.decision.options[0]!;
    const promoted = reduce(reduce(s, { type: 'begin_rung_beat' }), {
      type: 'choose_rung_option',
      optionId: opt.id,
    });
    expect(promoted.rung).toBe('R1');
  });

  it('begin_rung_beat no-ops while the intro is active (the VN surfaces never overlap)', () => {
    // meter forced ready but the intro is still live (introBeat mid-scene) ⇒ the trigger is inert.
    const midIntro: GameState = makeReady({
      ...createInitialState(1),
      flags: { awake: true },
      introBeat: 0,
    });
    expect(reduce(midIntro, { type: 'begin_rung_beat' }).rungBeat).toBeNull();
  });
});

describe('D-110 / F103 channel routing — story prose → Story, terse marker → Progress', () => {
  it('the R1 greeting is narration (Story); the "Rank ↑" marker is milestone (Progress)', () => {
    let s = makeReady(atDoneIntro());
    s = reduce(s, { type: 'begin_rung_beat' }); // reveals the R1 greeting

    const greetTexts = new Set(RUNG_BEATS.R1!.greeting.map((l) => l.text));
    const greet = s.log.entries.filter((e) => greetTexts.has(e.text));
    expect(greet.length).toBe(RUNG_BEATS.R1!.greeting.length); // every greeting line landed
    for (const e of greet) {
      expect(e.channel).toBe('narration');
      expect(logFilterMatches(e.channel, 'story', e.ephemeral ?? false)).toBe(true); // shows under Story
      expect(logFilterMatches(e.channel, 'progression', e.ephemeral ?? false)).toBe(false); // NOT Progress
    }

    s = reduce(s, {
      type: 'choose_rung_option',
      optionId: RUNG_BEATS.R1!.decision.options[0]!.id,
    });
    const r1 = getRank('R1');
    const marker = `Rank ↑ — ${r1.title} ${r1.kanji}`; // single-sourced from the RankDef (A21)
    const markerEntry = s.log.entries.find((e) => e.text === marker);
    expect(markerEntry).toBeDefined();
    expect(markerEntry!.channel).toBe('milestone');
    expect(logFilterMatches('milestone', 'progression', false)).toBe(true); // shows under Progress
    expect(logFilterMatches('milestone', 'story', false)).toBe(false); // NOT Story

    // the OLD prose milestone line is GONE — rewardOnReach carries no log now (F103 fix).
    expect(r1.rewardOnReach?.log).toBeUndefined();
    // and the terse marker is the ONLY milestone entry (no story paragraph leaked to Progress).
    const milestones = s.log.entries.filter((e) => e.channel === 'milestone');
    expect(milestones.map((e) => e.text)).toEqual([marker]);
  });
});

describe('D-110 the three rare varied bonuses (BQ2)', () => {
  /** Drive one beat from a rung, choosing `optId`. */
  function beatFrom(rung: RankId, optId: string, seed = 1): GameState {
    let s = makeReady({ ...atDoneIntro(seed), rung });
    s = reduce(s, { type: 'begin_rung_beat' });
    return reduce(s, { type: 'choose_rung_option', optionId: optId });
  }

  it('R2 "trade the gossip" sets the pedlar-favour STORY FLAG (Tokubei friend-price)', () => {
    const s = beatFrom('R1', 'r2-rokusuke-friend');
    expect(s.rung).toBe('R2');
    expect(hasFlag(s, 'pedlar-favour')).toBe(true);
    expect(hasFlag(s, 'r2-rokusuke-friend')).toBe(true);
    expect(s.npcMemory.rokusuke?.regard).toBe('friend');
    // the OTHER R2 picks do NOT grant it — the bonus is rare, not baked into the rung.
    expect(hasFlag(beatFrom('R1', 'r2-wolf-heeded'), 'pedlar-favour')).toBe(false);
  });

  it('R3 "stand a watch" grants the one +1 AGI STAT nudge (statBonus)', () => {
    const base = makeReady({ ...atDoneIntro(), rung: 'R2' });
    const agiBefore = base.character.attrs.agi;
    const s = beatFrom('R2', 'r3-disciplined');
    expect(s.rung).toBe('R3');
    expect(s.character.attrs.agi).toBe(agiBefore + 1);
    // no other R3 pick moves an attribute (the statBonus is on exactly one option).
    expect(beatFrom('R2', 'r3-aggressive').character.attrs.agi).toBe(agiBefore);
  });

  it('R4 "spend on the house" earns the smith-whetstone KEEPSAKE flag', () => {
    const s = beatFrom('R3', 'r4-generous');
    expect(s.rung).toBe('R4');
    expect(hasFlag(s, 'smith-whetstone')).toBe(true);
    expect(s.npcMemory.tozo?.regard).toBe('friend'); // the two-voice R4 also warms Tōzō
    expect(hasFlag(beatFrom('R3', 'r4-thrifty'), 'smith-whetstone')).toBe(false); // rare, not default
  });
});

describe('D-110 deepenNpc — relationships ACCUMULATE across rungs', () => {
  it("Genemon's warmth deepens R1 → R4 (not re-stamped each meeting)", () => {
    let s = makeReady(atDoneIntro());
    s = reduce(s, { type: 'begin_rung_beat' });
    s = reduce(s, { type: 'choose_rung_option', optionId: 'r1-dutiful' }); // genemon +1
    expect(s.npcMemory.genemon).toEqual({ regard: 'dutiful', warmth: 1 });

    // dev-bypass R2/R3 (applyPromotion never touches memory), then run the R4 beat.
    s = applyPromotion(s, 'R2');
    s = applyPromotion(s, 'R3');
    s = makeReady(s);
    s = reduce(s, { type: 'begin_rung_beat' });
    s = reduce(s, { type: 'choose_rung_option', optionId: 'r4-thrifty' }); // genemon +1 AGAIN
    expect(s.rung).toBe('R4');
    expect(s.npcMemory.genemon).toEqual({ regard: 'thrifty', warmth: 2 }); // ACCUMULATED, not re-stamped
  });
});
