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
  announcePass,
  INTRO_SCENE_COUNT,
  type GameState,
  type RankId,
  rungRequirements,
} from './index';
import { logFilterMatches } from '../ui/log-filter';

// The ADR-110 rung-up STORY BEAT tier proof (ADR-088 pair): a full-arc e2e that walks a promotion
// THROUGH the beat + an INVARIANT that no rung advances WITHOUT its beat (RED-able against the old
// auto-promote hot path). Plus the FB-103 channel routing, the migration is in migrate.test.ts, and
// the three rare bonuses. Fixtures are derived from RUNG_BEATS + the RankDefs (source of truth), not
// magic numbers.

// FB-121: the old GATE_FLAG map is gone — a rung's whole gate IS its requirement list, so
// `makeReady` seeds every requirement done straight from the gen'd registry (never literals).

/** A fresh, intro-DONE game (the beat's precondition: `!introActive`). */
function atDoneIntro(seed = 1): GameState {
  const s = createInitialState(seed);
  return {
    ...s,
    flags: { ...s.flags, awake: true },
    introBeat: INTRO_SCENE_COUNT,
  };
}

/** Complete the CURRENT rung's requirement list ⇒ a ready promotion. (The played-through
 *  requirement grind is proven by m1/pacing; this focuses on the beat machine.) */
function makeReady(s: GameState): GameState {
  return {
    ...s,
    rungReqs: Object.fromEntries(
      rungRequirements(s.rung).map((r) => [
        r.id,
        r.type === 'count' ? r.target : 1,
      ]),
    ),
  };
}

const rankFlag = (id: RankId): string => `rank-${id.toLowerCase()}`;

describe('D-110 full-arc e2e — a promotion walks THROUGH the beat (R0→R7)', () => {
  it('every rung promotes only on choose_rung_option; unlocks + flags + memory apply then', () => {
    let s = atDoneIntro();
    for (const target of [
      'R1',
      'R2',
      'R3',
      'R4',
      'R5',
      'R6',
      'R7',
    ] as RankId[]) {
      s = makeReady(s);
      expect(promotionReady(s)).toBe(true);
      expect(pendingPromotionTarget(s)).toBe(target);

      const beforeRung = s.rung;
      const beat = RUNG_BEATS[target];

      // SILENT rungs (R2 the yard-hand, R5 the accused) carry NO promotion beat — their story is a
      // generalized scene, so `begin_rung_beat` promotes them STRAIGHT through (no terminal choice).
      if (!beat) {
        s = reduce(s, { type: 'begin_rung_beat' });
        expect(s.rung, `silent rung ${target} did not promote`).toBe(target);
        expect(s.rungBeat).toBeNull(); // no VN beat opened
        expect(hasFlag(s, rankFlag(target))).toBe(true); // rewardOnReach applied on the silent promote
        continue;
      }

      // (1) TRIGGER the beat — reveals the greeting, sets the cursor, but does NOT promote.
      s = reduce(s, { type: 'begin_rung_beat' });
      expect(s.rungBeat).toBe(target);
      expect(s.rung).toBe(beforeRung); // begin never advances the rung
      expect(hasFlag(s, rankFlag(target))).toBe(false); // rewardOnReach NOT applied yet

      // (2) a full-VN beat's ask-hub is free + never promotes.
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
        expect(isUnlocked(s, surf), `${target} did not reveal ${surf}`).toBe(
          true,
        );
      }
      // the chosen story flags are set
      for (const f of opt.flags ?? []) expect(hasFlag(s, f)).toBe(true);
      // the memory writes deepened the named NPCs
      for (const m of opt.memory ?? []) {
        expect(
          s.npcMemory[m.npc],
          `${target} did not remember ${m.npc}`,
        ).toBeDefined();
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
    const r5pole = applyPromotion(
      { ...base, equippedWeapon: getWeapon('carrying_pole').id },
      'R5',
    );
    expect(hasFlag(r5pole, 'wall-weapon')).toBe(true);
    const poleLine = r5pole.log.entries
      .map((e) => e.text)
      .find((t) => t.includes('mount'));
    expect(poleLine).toBeDefined();
    expect(poleLine!.toLowerCase()).toContain(
      getWeapon('carrying_pole').label.toLowerCase(),
    );

    // wielding a DIFFERENT weapon → the mount names THAT one, proving it reads the wielded weapon.
    // RED against a hardcoded/generic sword or an ignored equippedWeapon.
    const r5axe = applyPromotion(
      { ...base, equippedWeapon: getWeapon('wood_axe').id },
      'R5',
    );
    const axeLine = r5axe.log.entries
      .map((e) => e.text)
      .find((t) => t.includes('mount'));
    expect(axeLine!.toLowerCase()).toContain(
      getWeapon('wood_axe').label.toLowerCase(),
    );
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
    expect(promotionReady(s)).toBe(true); // the requirement list is 100% done…

    // …but a REAL action on the hot path (rake runs finish()) HOLDS the rung. Against the retired
    // auto-promote, this raked-over-threshold state promoted in finish(); now it must not.
    const raked = reduce(s, { type: 'rake_rice' });
    expect(raked.rung).toBe('R0');
    expect(hasFlag(raked, 'rank-r1')).toBe(false);
    expect(isUnlocked(raked, 'verb-farm')).toBe(false); // R1's unlocks did NOT fire
    expect(promotionReady(raked)).toBe(true); // it still holds ready

    // the finish() body (announcePass, ADR-179 — revealPass's successor) likewise never promotes.
    expect(announcePass(s).rung).toBe('R0');

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
      expect(logFilterMatches(e.channel, 'story', e.ephemeral ?? false)).toBe(
        true,
      ); // shows under Story
      expect(
        logFilterMatches(e.channel, 'progression', e.ephemeral ?? false),
      ).toBe(false); // NOT Progress
    }

    s = reduce(s, {
      type: 'choose_rung_option',
      optionId: RUNG_BEATS.R1!.decision.options[0]!.id,
    });
    const r1 = getRank('R1');
    const marker = `Rank ↑ — ${r1.title} ${r1.kanji}`; // single-sourced from the RankDef (AC-21)
    const markerEntry = s.log.entries.find((e) => e.text === marker);
    expect(markerEntry).toBeDefined();
    expect(markerEntry!.channel).toBe('milestone');
    expect(logFilterMatches('milestone', 'progression', false)).toBe(true); // shows under Progress
    expect(logFilterMatches('milestone', 'story', false)).toBe(false); // NOT Story

    // the OLD prose milestone line is GONE — rewardOnReach carries no log now (FB-103 fix).
    expect(r1.rewardOnReach?.log).toBeUndefined();
    // and the terse marker is the ONLY milestone entry (no story paragraph leaked to Progress).
    const milestones = s.log.entries.filter((e) => e.channel === 'milestone');
    expect(milestones.map((e) => e.text)).toEqual([marker]);
  });
});

describe('D-110 the varied per-option bonuses (BQ2 — distinct flags + relationship memory)', () => {
  /** Drive one beat from a rung, choosing `optId`. */
  function beatFrom(rung: RankId, optId: string, seed = 1): GameState {
    let s = makeReady({ ...atDoneIntro(seed), rung });
    s = reduce(s, { type: 'begin_rung_beat' });
    return reduce(s, { type: 'choose_rung_option', optionId: optId });
  }
  /** The registry option (source of truth for its flag + memory bonus). */
  const opt = (rung: RankId, id: string) =>
    RUNG_BEATS[rung]!.decision.options.find((o) => o.id === id)!;

  it('an R3 option sets its OWN story flag + deepens the named NPC (varied, not one default)', () => {
    // The BQ2 variety now lives in each option's distinct FLAG + relationship MEMORY (derived from
    // the registry, never a copied literal) — RED if a pick is mis-routed or the options collapse.
    const track = opt('R3', 'r3-track');
    const s = beatFrom('R2', 'r3-track');
    expect(s.rung).toBe('R3');
    expect(hasFlag(s, track.flags![0]!)).toBe(true);
    const tm = track.memory![0]!;
    expect(s.npcMemory[tm.npc]).toEqual({
      regard: tm.regard,
      warmth: tm.warmthDelta,
    });

    // a DIFFERENT pick sets a DIFFERENT flag AND a DIFFERENT relationship — the options genuinely diverge.
    const mend = opt('R3', 'r3-mend');
    const other = beatFrom('R2', 'r3-mend');
    expect(hasFlag(other, mend.flags![0]!)).toBe(true);
    expect(hasFlag(other, track.flags![0]!)).toBe(false);
    const mm = mend.memory![0]!;
    expect(mm.npc).not.toBe(tm.npc); // a different NPC deepened (Genemon vs Kihei)
    expect(other.npcMemory[tm.npc]).toBeUndefined(); // r3-mend never touched r3-track's NPC
  });

  it('an R4 option diverges too — one watches with Kihei, another owns the loss to Genemon', () => {
    const watch = opt('R4', 'r4-it-returns');
    const w = beatFrom('R3', 'r4-it-returns');
    expect(w.rung).toBe('R4');
    const wm = watch.memory![0]!;
    expect(w.npcMemory[wm.npc]).toEqual({
      regard: wm.regard,
      warmth: wm.warmthDelta,
    });

    const owned = opt('R4', 'r4-the-rice');
    const o = beatFrom('R3', 'r4-the-rice');
    const om = owned.memory![0]!;
    expect(om.npc).not.toBe(wm.npc); // a different relationship than the watch pick
    expect(o.npcMemory[om.npc]).toEqual({
      regard: om.regard,
      warmth: om.warmthDelta,
    });
    expect(hasFlag(o, owned.flags![0]!)).toBe(true);
    expect(hasFlag(o, watch.flags![0]!)).toBe(false);
  });

  it("the pick is EXCLUSIVE — an unchosen option's flag never fires (rare, not baked-in)", () => {
    const held = beatFrom('R2', 'r3-hold');
    expect(hasFlag(held, opt('R3', 'r3-hold').flags![0]!)).toBe(true);
    for (const other of ['r3-track', 'r3-mend'])
      expect(hasFlag(held, opt('R3', other).flags![0]!)).toBe(false);
  });
});

describe('D-110 deepenNpc — relationships ACCUMULATE across rungs', () => {
  it("Genemon's warmth deepens R1 → R4 (not re-stamped each meeting)", () => {
    // both picks that deepen Genemon (R1 kept-accounts, R4 owned-the-loss) — the warmth ADDS across
    // rungs, the regard takes the latest. Deltas derived from the registry (source of truth).
    const r1mem = RUNG_BEATS.R1!.decision.options.find(
      (o) => o.id === 'r1-kept',
    )!.memory![0]!;
    const r4mem = RUNG_BEATS.R4!.decision.options.find(
      (o) => o.id === 'r4-the-rice',
    )!.memory![0]!;
    expect(r1mem.npc).toBe('genemon');
    expect(r4mem.npc).toBe('genemon');

    let s = makeReady(atDoneIntro());
    s = reduce(s, { type: 'begin_rung_beat' });
    s = reduce(s, { type: 'choose_rung_option', optionId: 'r1-kept' }); // genemon +1
    expect(s.npcMemory.genemon).toEqual({
      regard: r1mem.regard,
      warmth: r1mem.warmthDelta,
    });

    // dev-bypass R2/R3 (applyPromotion never touches memory), then run the R4 beat.
    s = applyPromotion(s, 'R2');
    s = applyPromotion(s, 'R3');
    s = makeReady(s);
    s = reduce(s, { type: 'begin_rung_beat' });
    s = reduce(s, { type: 'choose_rung_option', optionId: 'r4-the-rice' }); // genemon +1 AGAIN
    expect(s.rung).toBe('R4');
    // ACCUMULATED warmth (r1 + r4), regard = the latest pick — not re-stamped.
    expect(s.npcMemory.genemon).toEqual({
      regard: r4mem.regard,
      warmth: r1mem.warmthDelta + r4mem.warmthDelta,
    });
  });
});

describe('FB-388 — a promotion beat can MOVE you (RankDef.arriveAt)', () => {
  it("completing the R0→R1 beat stands you at the rank's arriveAt, not where you triggered it", () => {
    const arrive = getRank('R1').arriveAt;
    expect(arrive).toBeDefined(); // R1 declares one (the forecourt terms — FB-388)
    // FB-401 moved the R0 start onto the forecourt (= R1's arriveAt), so step
    // OFF it first — the mechanism under test is the MOVE, which needs distance.
    let s: GameState = { ...atDoneIntro(), location: 'kura' };
    expect(s.location).not.toBe(arrive);
    s = makeReady(s);
    s = reduce(s, { type: 'begin_rung_beat' });
    const opt = RUNG_BEATS.R1!.decision.options[0]!;
    s = reduce(s, { type: 'choose_rung_option', optionId: opt.id });
    expect(s.rung).toBe('R1');
    expect(s.location).toBe(arrive); // derived from the RankDef, never a copied literal
  });

  it('a rank WITHOUT arriveAt leaves you standing where you were', () => {
    expect(getRank('R4').arriveAt).toBeUndefined();
    const s = applyPromotion(
      { ...atDoneIntro(), rung: 'R3', location: 'grove' },
      'R4',
    );
    expect(s.location).toBe('grove');
  });
});

// ── HD-44 / ADR-190 — the rare stat-nudge, driven through the real beat ──────────────────────
// The lever pays exactly once in T0, and the line it pays with is authored prose. Two things
// have to hold, and neither is provable from the registry alone: the pick must actually MOVE the
// attribute, and the line the beat logs must be KEYED — it was logged unkeyed until 2026-07-13,
// so the moment the data came back it would have frozen in every save that recorded it (the same
// bug the rung-beat topics had). Driving the real reducer is the only way to see either.
describe('the pick that pays (R3, the wolf at the sill)', () => {
  const RANK: RankId = 'R3';
  const beat = RUNG_BEATS[RANK]!;
  const bonusOpt = beat.decision.options.find((o) => o.statBonus)!;

  /** The R3 beat, OPEN, with the pick ready to land — walked the way the arc test walks it: a
   *  silent rung promotes straight through `begin_rung_beat`; a beat rung needs its terminal pick. */
  const atBeat = (): GameState => {
    let s = atDoneIntro();
    for (const target of ['R1', 'R2', RANK] as RankId[]) {
      s = makeReady(s);
      s = reduce(s, { type: 'begin_rung_beat' });
      if (target === RANK) break; // the R3 beat is now OPEN — the caller makes the pick
      const b = RUNG_BEATS[target];
      if (b)
        s = reduce(s, {
          type: 'choose_rung_option',
          optionId: b.decision.options[0]!.id,
        });
    }
    return s;
  };

  it('the beat really does carry the bonus option (else the rest proves nothing)', () => {
    expect(bonusOpt.statBonus).toBeDefined();
  });

  it('picking it MOVES the attribute it names', () => {
    const before = atBeat();
    const { attr, amount } = bonusOpt.statBonus!;
    const after = reduce(before, {
      type: 'choose_rung_option',
      optionId: bonusOpt.id,
    });
    expect(after.character.attrs[attr]).toBe(
      before.character.attrs[attr] + amount,
    );
  });

  it('and the delight line it logs is KEYED, so a re-voice reaches an old save', () => {
    const after = reduce(atBeat(), {
      type: 'choose_rung_option',
      optionId: bonusOpt.id,
    });
    const entry = after.log.entries.find(
      (e) => e.text === bonusOpt.statBonus!.note,
    );

    expect(entry).toBeDefined(); // the line is shown at all
    expect(entry!.contentKey).toBe(`beat.${RANK}.opt.${bonusOpt.id}.bonus`); // …and addressable
  });

  it('the delight line lands where the player is READING (Story, not the Work tab)', () => {
    // It was `system` — which log-filter routes to WORK, the labour-reward lane. So the rarest
    // reward in the game was painted into the one tab nobody was looking at, seconds after a VN
    // the player was reading in Story. A reward the player never sees is not a reward (HD-41).
    const after = reduce(atBeat(), {
      type: 'choose_rung_option',
      optionId: bonusOpt.id,
    });
    const entry = after.log.entries.find(
      (e) => e.text === bonusOpt.statBonus!.note,
    )!;

    expect(logFilterMatches(entry.channel, 'story', false)).toBe(true);
    expect(logFilterMatches(entry.channel, 'work', false)).toBe(false);
  });

  it('a pick WITHOUT a bonus moves no attribute — the reward stays rare', () => {
    const plain = beat.decision.options.find((o) => !o.statBonus)!;
    const before = atBeat();
    const after = reduce(before, {
      type: 'choose_rung_option',
      optionId: plain.id,
    });
    expect(after.character.attrs).toEqual(before.character.attrs);
  });
});
