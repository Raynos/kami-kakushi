import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  reduce,
  tick,
  isUnlocked,
  hasFlag,
  skillLevel,
  skillVisible,
  canDoActivity,
  availableActions,
  getActivity,
  season,
  levelForXp,
  applyPromotion,
  promotionReady,
  nextRankId,
  introActive,
  introSceneAt,
  RUNG_BEATS,
  phaseOf,
  mcCombatStats,
  hpMax,
  RANKS,
  SEASONS,
  TICKS_PER_DAY,
  type GameState,
  type Intent,
} from './index';
import { SKILL_XP_BASE, RICE_PER_RAKE } from './content/balance';
import { refillSitePools } from './content/activities';
import { rungRequirements } from './content/requirements';
import { getDialogueLine, COLD_OPEN_DIALOGUE_ID } from './content/dialogue';
import { SURFACES } from './content/surfaces';
import { rakeLine } from './content/coldOpen';
import { NAMES } from './content/names';

// FB-265: work refuses at empty satiety (the manual player must rest, like the auto loop),
// so the mass-grind drivers rest when short exactly as a real player is now forced to —
// the requirement COUNTS still derive from the registry; rest adds no count tokens.
const WORK_INTENTS = new Set(['rake_rice', 'do_activity']);
function run(s: GameState, intents: Intent[]): GameState {
  for (const i of intents) {
    if (WORK_INTENTS.has(i.type)) {
      while (s.character.satiety < 6 && availableActions(s).includes('rest'))
        s = reduce(s, { type: 'rest' });
    }
    s = reduce(s, i);
  }
  return s;
}
function repeat(type: 'rake_rice' | 'rest', n: number): Intent[] {
  return Array.from({ length: n }, () => ({ type }) as Intent);
}
function farm(n: number): Intent[] {
  return Array.from(
    { length: n },
    () => ({ type: 'do_activity', activityId: 'farm_paddy' }) as Intent,
  );
}
// FB-121: a promotion is the CURRENT rung's authored requirement list, done. Counts derive
// from the gen'd registry (ADR-086 — never frozen literals), so a requirements.md retune
// keeps these tests true. `haul(n)` mirrors `farm(n)` for the multi-requirement rungs.
// Same-token requirements complete CUMULATIVELY at staged targets (human,
// 2026-07-07: e.g. R0 rake 100/200/500) — the acts to finish them ALL is the MAX.
const countFor = (rung: GameState['rung'], token: string): number => {
  const targets = rungRequirements(rung)
    .filter((r) => r.type === 'count' && r.token === token)
    .map((r) => (r.type === 'count' ? r.target : 0));
  if (targets.length === 0) throw new Error(`no count req for ${token} at ${rung}`);
  return Math.max(...targets);
};
function haul(n: number): Intent[] {
  return Array.from(
    { length: n },
    () => ({ type: 'do_activity', activityId: 'haul_stores' }) as Intent,
  );
}
/** Drive the FULL R1 count set (farm the paddies + haul the forecourt), spatially. */
function doR1Work(s: GameState): GameState {
  s = run({ ...s, location: 'paddies' }, farm(countFor('R1', 'act:farm_paddy')));
  s = run({ ...s, location: 'forecourt' }, haul(countFor('R1', 'act:haul_stores')));
  return s;
}

// ADR-110: promotion is now a player-TRIGGERED beat, not an auto-hot-path side effect. These helpers
// drive the real player path — finish the intro's VN scenes, then TRIGGER + complete a ready rung
// beat (begin_rung_beat → choose_rung_option → applyPromotion). The option pick is flavour; any
// pick promotes.
function finishIntro(s: GameState): GameState {
  while (introActive(s.introBeat)) {
    const scene = introSceneAt(s.introBeat)!;
    s = reduce(s, { type: 'choose_intro', optionId: scene.decision.options[0]!.id });
  }
  return s;
}
function playBeat(s: GameState): GameState {
  s = reduce(s, { type: 'begin_rung_beat' });
  const target = s.rungBeat;
  if (target === null) return s; // no beat ready (gate unmet) — a no-op
  return reduce(s, {
    type: 'choose_rung_option',
    optionId: RUNG_BEATS[target]!.decision.options[0]!.id,
  });
}

describe('skill XP curve', () => {
  it('levels on the cumulative 1.3× table', () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(SKILL_XP_BASE - 1)).toBe(1);
    expect(levelForXp(SKILL_XP_BASE)).toBe(2);
    expect(levelForXp(10_000)).toBeGreaterThan(2);
  });
});

describe('T0 Phase-1 rung climb', () => {
  it('raking the spilled stores earns the kept-hand rung (R0→R1) and opens the estate', () => {
    let s = finishIntro(reduce(createInitialState(1), { type: 'open_eyes' }));
    expect(s.rung).toBe('R0');
    s = run(s, repeat('rake_rice', countFor('R0', 'act:rake_rice'))); // the R0 list done (holds — no auto-promote)
    expect(s.rung).toBe('R0'); // ADR-110: the meter holds ready; the rung waits on the beat
    s = playBeat(s); // trigger + complete the R1 story beat → the promotion applies
    expect(s.rung).toBe('R1');
    expect(hasFlag(s, 'rank-r1')).toBe(true);
    expect(isUnlocked(s, 'verb-farm')).toBe(true);
    expect(isUnlocked(s, 'verb-haul')).toBe(true);
    expect(isUnlocked(s, 'readout-clock')).toBe(true);
    expect(isUnlocked(s, 'readout-stamina')).toBe(true);
    expect(isUnlocked(s, 'panel-rung-ladder')).toBe(true);
  });

  it('field work earns the trusted-hand rung (R1→R2): first nav, skills, the wider estate', () => {
    let s = finishIntro(reduce(createInitialState(1), { type: 'open_eyes' }));
    s = playBeat(run(s, repeat('rake_rice', countFor('R0', 'act:rake_rice')))); // → R1 (reqs + beat)
    // v0.3.1 Step 5: labour is spatial — farm at the paddies, haul at the forecourt (FB-121:
    // R1 is a TWO-requirement rung; farming alone no longer opens the gate).
    s = doR1Work(s);
    s = playBeat(s); // trigger + complete the R2 beat → promote
    expect(s.rung).toBe('R2');
    expect(isUnlocked(s, 'tab-skills')).toBe(true); // the FIRST nav reveal
    expect(isUnlocked(s, 'verb-woodcut')).toBe(true);
    expect(isUnlocked(s, 'verb-forage')).toBe(true);
    expect(hasFlag(s, 'porters-knot')).toBe(true); // the ZERO-bonus Origin beat
    expect(skillVisible(s, 'farming')).toBe(true);
  });

  it('R2 is a pure-labour rung — its full count set opens the gate (the combat gate is R3)', () => {
    // G4: R2→R3 is labour-only (woodcut/forage/haul); the combat gate moved to R3 (the night-round
    // grain-watch — its kill:* requirements, tested in the R3→R4 block below). So finishing R2's
    // count set DOES open the gate — an incomplete set (missing forage) must NOT.
    let s = finishIntro(reduce(createInitialState(1), { type: 'open_eyes' }));
    s = playBeat(run(s, repeat('rake_rice', countFor('R0', 'act:rake_rice')))); // → R1
    s = playBeat(doR1Work(s)); // → R2
    const woodcut = (t: GameState): GameState =>
      run(
        { ...t, location: 'woodlot' },
        Array.from(
          { length: countFor('R2', 'act:woodcut_edge') },
          () => ({ type: 'do_activity', activityId: 'woodcut_edge' }) as Intent,
        ),
      );
    const forage = (t: GameState): GameState =>
      run(
        { ...t, location: 'woodlot' },
        Array.from(
          { length: countFor('R2', 'act:forage_satoyama') },
          () => ({ type: 'do_activity', activityId: 'forage_satoyama' }) as Intent,
        ),
      );
    const haulR2 = (t: GameState): GameState =>
      run({ ...t, location: 'forecourt' }, haul(countFor('R2', 'act:haul_stores')));
    // woodcut + haul only (forage untouched) → the list is INCOMPLETE, so the gate holds.
    const partial = haulR2(woodcut(s));
    expect(promotionReady(partial)).toBe(false);
    expect(playBeat(partial).rung).toBe('R2'); // triggering the beat is a no-op while short
    // now finish the forage requirement too → the full labour set opens the gate and promotes.
    const done = forage(partial);
    expect(promotionReady(done)).toBe(true);
    expect(playBeat(done).rung).toBe('R3');
  });
});

// M2·2 — the thin R4→R7 ladder closes T0: the capstone opens Phase 2 (the macro-pillar grind).
describe('T0 ladder R4→R7 + the capstone (M2·2)', () => {
  it('the rung ladder is the contiguous T0 spine R0…R7', () => {
    expect(RANKS.map((r) => r.id)).toEqual(['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7']);
    expect(RANKS.every((r) => r.tier === 0)).toBe(true);
  });

  it('R3→R4 needs the WHOLE requirement list — labour alone never opens the gate', () => {
    const base = createInitialState(1);
    // seed the labour counts done but the kill requirements untouched (registry-derived).
    const labourOnly = Object.fromEntries(
      rungRequirements('R3')
        .filter((r) => r.type === 'count' && r.token.startsWith('act:'))
        .map((r) => [r.id, r.type === 'count' ? r.target : 1]),
    );
    const allDone = Object.fromEntries(
      rungRequirements('R3').map((r) => [r.id, r.type === 'count' ? r.target : 1]),
    );
    const atR3 = (rungReqs: Record<string, number>): GameState => ({
      ...base,
      rung: 'R3',
      rungReqs,
      flags: { ...base.flags, awake: true },
    });
    // FB-121: the old combat-blooded storyGate lives on as R3's kill:* requirements — the
    // rows kept (labour done) without the watch stood (kills) is NOT ready.
    expect(promotionReady(atR3(labourOnly))).toBe(false);
    expect(promotionReady(atR3(allDone))).toBe(true);
    expect(applyPromotion(atR3(allDone), 'R4').rung).toBe('R4'); // the beat applies it
  });

  it('the ladder climbs R0→R7 and the capstone opens Phase 2', () => {
    let s = createInitialState(1);
    s = { ...s, flags: { ...s.flags, awake: true } };
    expect(phaseOf(s)).toBe(1);
    // Walk the ladder via applyPromotion (the beat-terminal apply) — one rung at a time (the DEV-seek
    // shape). rank-rN + t0-capstone ride each rung's rewardOnReach.
    let guard = 0;
    while (s.rung !== 'R7' && guard++ < 20) {
      const nid = nextRankId(s.rung);
      if (!nid) break;
      s = applyPromotion(s, nid);
    }
    expect(s.rung).toBe('R7');
    expect(hasFlag(s, 't0-capstone')).toBe(true);
    expect(phaseOf(s)).toBe(2); // the macro engine opens
  });
});

// T0-M1-F3 — the diegetic labour mentor Genemon greets + teaches, data-not-script, in the
// story LOG (not a popup, ADR-039/ADR-063/ADR-064); the gated acknowledgment is reveal-as-plot.
describe('diegetic mentor onboarding (Genemon) — T0-M1-F3', () => {
  it('waking retires the registry greet/stakes (Beat 3 carries them) but keeps the teach deferred', () => {
    // The interactive intro now owns the opening: Genemon's greet is Beat 3, so waking marks the
    // registry's ungated greet/stakes DELIVERED (they must not double-fire) — while the raked-gated
    // rice-teaching stays reveal-as-plot, undelivered until the player actually rakes.
    const s = reduce(createInitialState(1), { type: 'open_eyes' });
    expect(s.deliveredDialogue).toContain('gen-greet'); // retired from the registry dump
    expect(s.deliveredDialogue).toContain('gen-stores');
    // the rice-teaching + promise + acknowledgment are reveal-as-plot — NOT on the first click
    expect(s.deliveredDialogue).not.toContain('gen-rake');
    expect(s.deliveredDialogue).not.toContain('gen-keep');
    expect(s.deliveredDialogue).not.toContain('gen-kept');
  });

  it('the mentor lines land ONE PER RAKE (reveal-as-plot; no monologue dump on the first click)', () => {
    let s = reduce(createInitialState(1), { type: 'open_eyes' });
    // rake #1 surfaces ONLY the rice lesson — not the whole raked-gated monologue at once.
    s = reduce(s, { type: 'rake_rice' });
    expect(s.deliveredDialogue).toContain('gen-rake');
    expect(s.deliveredDialogue).not.toContain('gen-keep'); // paced to the next rake
    expect(s.deliveredDialogue).not.toContain('gen-kept');
    // rake #2 lands the promise; rake #3 the acknowledgment (its "filling basket" line after real raking).
    s = reduce(s, { type: 'rake_rice' });
    expect(s.deliveredDialogue).toContain('gen-keep');
    expect(s.deliveredDialogue).not.toContain('gen-kept');
    s = reduce(s, { type: 'rake_rice' });
    expect(s.deliveredDialogue).toContain('gen-kept');
    // …and they never double-deliver
    const before = s.deliveredDialogue.length;
    s = reduce(s, { type: 'rake_rice' });
    expect(s.deliveredDialogue.length).toBe(before);
  });

  // FB-91/FB-93 — flavor-text VOICE consistency: every emitted cold-open/labour/reveal line must carry
  // the SAME voice/speaker convention the intro uses, so the renderer colours + prefixes it
  // consistently. Genemon's SPEECH renders "Genemon: …" (steward voice); third-person prose + the
  // rake/reveal RESULT lines render in the narrator voice with NO nameplate. Fixtures are read from
  // the content source (getDialogueLine / COLD_OPEN / rakeLine), never copied magic strings.
  it('cold-open + labour flavor lines carry the intro-consistent voice/speaker', () => {
    let s = reduce(createInitialState(1), { type: 'open_eyes' });
    const find = (text: string) => s.log.entries.find((e) => e.text === text);

    // the wake-time surface reveals (readout-body / readout-rice) are scene NARRATION → narrator
    // voice, no nameplate — same convention as the intro's narrator lines. C1.5 (was an empty
    // dead loop): the prose derives from the SURFACES registry itself, never a copied string.
    for (const id of ['readout-body', 'readout-rice'] as const) {
      const def = SURFACES.find((d) => d.id === id);
      expect(def?.revealLine?.text, `${id} has no reveal line`).toBeTruthy();
      const entry = find(def!.revealLine!.text);
      expect(entry, `${id} reveal never logged on wake`).toBeTruthy();
      expect(entry?.voice).toBe('narrator');
      expect(entry?.speaker).toBeUndefined();
    }

    // rake #1: the rice-teaching (gen-rake) is Genemon's SPEECH → steward voice + "Genemon"
    // nameplate; the rake RESULT line is narration → narrator voice, no nameplate.
    s = reduce(s, { type: 'rake_rice' });
    const rake = find(getDialogueLine(COLD_OPEN_DIALOGUE_ID, 'gen-rake').text);
    expect(rake?.voice).toBe('steward');
    expect(rake?.speaker).toBe(NAMES.elder);
    const result = find(rakeLine(RICE_PER_RAKE));
    expect(result?.voice).toBe('narrator');
    expect(result?.speaker).toBeUndefined();

    // rake #2: gen-keep is first-person Genemon speech → steward + nameplate.
    s = reduce(s, { type: 'rake_rice' });
    const keep = find(getDialogueLine(COLD_OPEN_DIALOGUE_ID, 'gen-keep').text);
    expect(keep?.voice).toBe('steward');
    expect(keep?.speaker).toBe(NAMES.elder);

    // rake #3: gen-kept is third-person NARRATOR prose ("…Genemon says…") → narrator voice, and
    // the nameplate is SUPPRESSED (it is not spoken by a named NPC).
    s = reduce(s, { type: 'rake_rice' });
    const kept = find(getDialogueLine(COLD_OPEN_DIALOGUE_ID, 'gen-kept').text);
    expect(kept?.voice).toBe('narrator');
    expect(kept?.speaker).toBeUndefined();
  });

  it('auto-rake can be armed + disarmed (the R0 cold-open is not a blind click-grind)', () => {
    const base = createInitialState(1);
    expect(base.autoRake).toBe(false); // off by default
    const armed = reduce(base, { type: 'set_auto_rake', on: true });
    expect(armed.autoRake).toBe(true);
    expect(reduce(armed, { type: 'set_auto_rake', on: false }).autoRake).toBe(false);
  });
});

// T0-M4-F4 — the small walkable estate map: areas you MOVE BETWEEN, gated by the existing
// room reveals + the conditioning danger-ring gate (ADR-065).
describe('walkable estate map (T0-M4-F4 / D-065)', () => {
  it('move_to walks to an adjacent revealed node, blocks non-adjacent + the danger gate', () => {
    const base = createInitialState(1);
    const atForecourt: GameState = {
      ...base,
      location: 'forecourt',
      flags: { ...base.flags, awake: true },
      // the paddies + the danger-ring field-margins revealed (field-margins is NOT off the forecourt).
      unlocked: [...base.unlocked, 'room-paddies', 'room-field-margins'],
    };
    // adjacent + revealed → you move
    expect(reduce(atForecourt, { type: 'move_to', to: 'paddies' }).location).toBe('paddies');
    // non-adjacent even when revealed (the field margins aren't off the forecourt) → no-op
    expect(reduce(atForecourt, { type: 'move_to', to: 'field-margins' })).toBe(atForecourt);
    // the danger ring needs the conditioning gate even when adjacent + revealed
    const atPaddies: GameState = {
      ...atForecourt,
      location: 'paddies',
    };
    // field-margins is a danger ring adjacent to the paddies + revealed — still blocked (conditioning 0)
    expect(reduce(atPaddies, { type: 'move_to', to: 'field-margins' })).toBe(atPaddies);
  });
});

// PRD no-magic / mediocre-start acceptance criterion (battery #17): the porter's-knot Origin
// beat is FLAVOR — it grants ZERO mechanical bonus. A RED-able invariant: two states differing
// ONLY in the knot/dream flags produce byte-identical combat stats, HP ceiling, and labour yield.
// If anyone ever wires the dream to a stat, this flips RED.
describe("porter's-knot is mechanically inert (no-magic / mediocre-start)", () => {
  it('the origin-dream flags change no combat stat, HP ceiling, or labour yield', () => {
    const base = createInitialState(1);
    const plain: GameState = {
      ...base,
      rung: 'R2',
      location: 'paddies', // v0.3.1 Step 5: farm_paddy is spatial — stand where the labour runs
      flags: { ...base.flags, awake: true },
      unlocked: [...base.unlocked, 'verb-farm', 'tab-combat'],
    };
    const withKnot: GameState = {
      ...plain,
      flags: { ...plain.flags, 'porters-knot': true, 'dream-1': true },
    };
    // combat stats + HP ceiling are identical (the dream grants no might/guard/vigor/hp)
    expect(mcCombatStats(withKnot)).toEqual(mcCombatStats(plain));
    expect(hpMax(withKnot)).toBe(hpMax(plain));
    // labour yields the same rice (the dream is no productivity blessing either)
    const yKnot = reduce(withKnot, { type: 'do_activity', activityId: 'farm_paddy' });
    const yPlain = reduce(plain, { type: 'do_activity', activityId: 'farm_paddy' });
    expect(yKnot.resources.rice).toBe(yPlain.resources.rice);
  });
});

describe('conditioning enablement gate (the danger ring)', () => {
  it('foraging is locked until conditioning reaches the gate level', () => {
    let s = finishIntro(reduce(createInitialState(1), { type: 'open_eyes' }));
    s = playBeat(run(s, repeat('rake_rice', countFor('R0', 'act:rake_rice')))); // → R1
    s = playBeat(doR1Work(s)); // → R2 (forage revealed)
    // FB-121: the R1 climb now hauls 400 stores, so conditioning arrives at R2 already past the
    // gate — zero it synthetically to isolate the LEVER (level < gate blocks; ≥ gate opens).
    s = { ...s, skillXp: { ...s.skillXp, conditioning: 0 } };
    // stand at the woodlot so the ONLY thing gating forage is the conditioning level, not the node
    expect(canDoActivity({ ...s, location: 'woodlot' }, getActivity('forage_satoyama'))).toBe(
      false,
    );
    // top off the climb's fatigue so conditioning XP isn't stamina-throttled, then haul builds it to Lv2
    s = { ...s, character: { ...s.character, satiety: 100 } };
    s = run(
      { ...s, location: 'forecourt' }, // v0.3.1 Step 5: haul_stores runs at the forecourt
      Array.from(
        { length: 5 },
        () => ({ type: 'do_activity', activityId: 'haul_stores' }) as Intent,
      ),
    );
    expect(skillLevel(s, 'conditioning')).toBeGreaterThanOrEqual(2);
    expect(canDoActivity({ ...s, location: 'woodlot' }, getActivity('forage_satoyama'))).toBe(true);
  });
});

describe('soft stamina + season', () => {
  it('a drained body yields less but never zero (soft throttle)', () => {
    let s = finishIntro(reduce(createInitialState(1), { type: 'open_eyes' }));
    s = playBeat(run(s, repeat('rake_rice', countFor('R0', 'act:rake_rice')))); // → R1
    s = playBeat(doR1Work(s)); // → R2
    // a fed body AT THE PADDIES for the fresh baseline (doR1Work ends at the forecourt). REFILL the
    // paddy site pool (doR1Work drew it down) so the ONLY lever between fresh + tired is SATIETY —
    // not the ADR-163 per-site draw-down. Rice banks to the kura (banked), never carried (resources).
    s = {
      ...s,
      location: 'paddies',
      character: { ...s.character, satiety: 100 },
      sitePools: refillSitePools(season(s)),
    };
    const fresh = reduce(s, { type: 'do_activity', activityId: 'farm_paddy' });
    const freshRice = (fresh.banked.rice ?? 0) - (s.banked.rice ?? 0);
    expect(freshRice).toBeGreaterThan(0); // a full pool + full belly banks real rice
    // a DEEPLY drained body — low but still able to pay the act (FB-265 refuses at the true
    // floor now, so "drained yields less but never zero" is tested INSIDE the affordable band;
    // the exactly-empty case is the refusal test below, not a throttle case).
    const drained: GameState = { ...s, character: { ...s.character, satiety: 4 } };
    // walk the drained body back to the paddies for the tired-farm comparison
    const tired = reduce(
      { ...drained, location: 'paddies' },
      { type: 'do_activity', activityId: 'farm_paddy' },
    );
    const tiredRice = (tired.banked.rice ?? 0) - (drained.banked.rice ?? 0);
    expect(tiredRice).toBeGreaterThan(0); // never zero (the soft throttle floors, never blocks)
    expect(tiredRice).toBeLessThanOrEqual(freshRice);
  });

  it('work REFUSES at empty satiety — the reducer no-ops and the gate says why (FB-265)', () => {
    // rake: an awake R0 body at 1 satiety (below SATIETY_PER_ACT) cannot rake for free
    let s = reduce(createInitialState(1), { type: 'open_eyes' });
    s = { ...s, character: { ...s.character, satiety: 1 } };
    expect(reduce(s, { type: 'rake_rice' })).toBe(s); // refused, not a free act
    // labour: the same predicate gates do_activity + the button's shown reason (AC-6)
    let r2 = finishIntro(reduce(createInitialState(1), { type: 'open_eyes' }));
    r2 = playBeat(run(r2, repeat('rake_rice', countFor('R0', 'act:rake_rice')))); // → R1
    r2 = { ...r2, location: 'paddies', character: { ...r2.character, satiety: 1 } };
    expect(canDoActivity(r2, getActivity('farm_paddy'))).toBe(false);
    expect(reduce(r2, { type: 'do_activity', activityId: 'farm_paddy' })).toBe(r2);
    // …and rest is the way back in
    const rested = reduce(r2, { type: 'rest' });
    expect(canDoActivity(rested, getActivity('farm_paddy'))).toBe(true);
  });

  it('the season is stored and turns ONLY by advance_season (the six-season wheel)', () => {
    const s0 = createInitialState(1);
    expect(season(s0)).toBe('winter'); // the wheel opens on Winter (storywave G1 / ADR-153)
    // MANUAL now: a plain tick never moves the wheel (the old day-derived season is retired).
    expect(season(tick(s0, TICKS_PER_DAY * 5))).toBe('winter');
    // C1.4: the wheel is engine-refused pre-R2 (the guard suite lives in season.test.ts) —
    // seam to R2 so this test keeps testing ITS lever (storage + manual turn), not the guard.
    const s = { ...s0, rung: 'R2' as const };
    // two turns on: Winter → New Year → Spring — the next season derived from SEASONS, not a copied index.
    const twoOn = reduce(reduce(s, { type: 'advance_season' }), { type: 'advance_season' });
    expect(season(twoOn)).toBe(SEASONS[2]); // 'spring'
  });
});

// FB-53 + F58a — the FLEETING flavor lines (rest, per-rake +rice output, per-activity labour output)
// are tagged `ephemeral`, so the render routes them to the self-fading "Now" view and keeps them OFF
// the permanent channels. RED-able + discriminating: the flag is NOT a blanket — a milestone
// perk-unlock line on the SAME log stays permanent (ephemeral falsey), so the discriminator holds.
describe('ephemeral flavor tagging (F53 + F58a)', () => {
  const lastByChannel = (
    s: GameState,
    channel: 'reward' | 'system' | 'milestone',
  ): { readonly ephemeral?: boolean } | undefined =>
    [...s.log.entries].reverse().find((e) => e.channel === channel);

  it('the rest line is ephemeral (fleeting body-flavor, not a permanent record)', () => {
    let s = reduce(createInitialState(1), { type: 'open_eyes' });
    s = reduce(s, { type: 'rake_rice' }); // sets `raked` → rest becomes a legal verb
    s = reduce(s, { type: 'rest' });
    const rest = lastByChannel(s, 'system');
    expect(rest).toBeDefined();
    expect(rest!.ephemeral).toBe(true);
  });

  it('the rake + labour output lines are ephemeral (F58a), but a milestone perk line is NOT', () => {
    // F58a — the cold-open per-rake +rice OUTPUT line is now fleeting flavor: it lands in Now and
    // fades, so repetitive rake output no longer spams the permanent Work channel (log-v2 revision).
    const raked = reduce(reduce(createInitialState(1), { type: 'open_eyes' }), {
      type: 'rake_rice',
    });
    const rakeLine = lastByChannel(raked, 'reward');
    expect(rakeLine).toBeDefined();
    expect(rakeLine!.ephemeral).toBe(true);

    // the do_activity labour output line ("you worked / +N") is likewise fleeting flavor → ephemeral.
    const base = createInitialState(1);
    const atPaddies: GameState = {
      ...base,
      rung: 'R2',
      location: 'paddies',
      flags: { ...base.flags, awake: true },
      unlocked: [...base.unlocked, 'verb-farm'],
    };
    const farmed = reduce(atPaddies, { type: 'do_activity', activityId: 'farm_paddy' });
    const farmLine = lastByChannel(farmed, 'reward');
    expect(farmLine).toBeDefined();
    expect(farmLine!.ephemeral).toBe(true);

    // …but the flag is NOT a blanket: the milestone rung-marker line (applyPromotion's rank.marker)
    // stays a PERMANENT record. Climb R0→R1 for a real promotion beat, then read its milestone line.
    let promoted = finishIntro(reduce(createInitialState(1), { type: 'open_eyes' }));
    promoted = playBeat(run(promoted, repeat('rake_rice', countFor('R0', 'act:rake_rice')))); // → R1
    expect(promoted.rung).toBe('R1');
    const markerLine = lastByChannel(promoted, 'milestone');
    expect(markerLine).toBeDefined();
    expect(markerLine!.ephemeral ?? false).toBe(false);
  });
});
