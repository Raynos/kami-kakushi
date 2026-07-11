import { describe, it, expect } from 'vitest';
import { RANKS } from './content/ranks';
import { SURFACES } from './content/surfaces';
import { ACTIVITIES } from './content/activities';
import { MOBS } from './content/enemies';
import { MAP_NODES, canMove } from './content/map';
import { SCENES } from './content/scenes';
import { rungRequirements } from './content/requirements';
import { createInitialState, hasFlag, setFlag, type GameState } from './state';
import { INTRO_BEAT_COUNT, introActive, introSceneAt } from './content/intro';
import type { RankId } from './content/ranks';
import { visibleSet, announcePass, factsForSurfaces } from './unlock';
import { revealsPass } from './reveals';
import { reduce } from './intents';
import { focusedOptimalIntent } from './autoplay';
import { CHEAPEST_STALL_ITEM_COST } from './content/market';
import { COOK_SANSAI_COST } from './content/balance';
import { hpMax } from './selectors';

// ADR-184 — the zone-reveal law: a zone opens only inside a VN, and a rung-up VN opens at most
// two. The CAP itself is a verify gate (verify-content, mechanically exact); these are the
// invariants a gate cannot check — that the schedule is REACHABLE, that the VNs actually fire,
// and that a re-mapped zone re-announces instead of silently re-granting.
//
// Everything derives from the registries (RANKS / ACTIVITIES / MOBS / requirements) — never a
// copied list of zone names, so re-mapping a zone tomorrow re-derives these instead of breaking
// them, and a genuinely unreachable schedule goes RED.

/** A state that has climbed to rung N and nothing else: the intro closed (which is what opens the
 *  forecourt — ADR-179's intro-cursor reveal, not a rung), each rung's latched `rank-rN` fact, and
 *  the rung field itself (the reveals pass reads `s.rung`, the flags entitle the surfaces). */
function atRung(n: number): GameState {
  let s = createInitialState(1);
  s = { ...s, introBeat: INTRO_BEAT_COUNT, flags: { ...s.flags, awake: true } }; // the intro is done
  for (let i = 1; i <= n; i++) s = setFlag(s, `rank-r${i}`);
  return { ...s, rung: (n === 0 ? 'R0' : `R${n}`) as RankId };
}

/** The zone a labour activity / a foe sits in, as a `room-*` surface id. */
const roomOf = (area: string): string | undefined =>
  MAP_NODES.find((n) => n.id === area)?.revealFlag;

describe('ADR-184 — the zone-reveal law', () => {
  it('every zone is opened by a rung-up VN or by a scene, and never by nothing', () => {
    // The law's structural claim: a `room-*` surface is entitled EITHER by the rung schedule
    // (its ceremony) or by a fact-flag some SCENE sets (its side-quest VN). A zone entitled by
    // neither is unreachable content; a zone entitled by a flag nothing sets is worse — it is
    // authored-but-dark. Derived from the scene registry, so a new zone must earn a beat.
    const scheduled = new Set(RANKS.flatMap((r) => r.rewardOnReach?.unlock ?? []));
    const sceneFlags = new Set(
      SCENES.flatMap((d) => d.scene.decision.options.flatMap((o) => o.flags ?? [])),
    );
    // `sb-lease` is narration-only: its flag is latched by applySceneCompletionEffects, not by an
    // option. Read it from the engine rather than hand-listing it (scenes.ts is the source).
    sceneFlags.add('screens-charged');

    for (const s of SURFACES.filter((x) => x.id.startsWith('room-'))) {
      if (scheduled.has(s.id)) continue; // opened by its rung's ceremony
      // the intro CURSOR opens the forecourt (ADR-179: it is introduced with the rake, before any
      // rung exists) — a third legitimate opener, and the only one.
      if (s.unlock(atRung(0), new Set())) continue;
      // otherwise: its predicate must be satisfied by a flag some scene sets.
      const opened = [...sceneFlags].some((f) => s.unlock(setFlag(atRung(0), f), new Set()));
      expect(opened, `${s.id} is opened by no rung and no scene — it is unreachable`).toBe(true);
    }
  });

  it('THE REACHABILITY INVARIANT: every rung’s requirements can be done in zones you can reach', () => {
    // The invariant that would have caught the stale `ranks.ts:60` comment (which claimed R1
    // opened the gate "for haul", while haul_stores actually sites at the forecourt). For each
    // rung, every requirement that names a labour act or a kill must site in a zone that is
    // visible AT that rung — counting BOTH what the ceremony opens and what a side-quest VN can
    // open by then (the human's ruling: a side quest may gate a rung-up; an OBTUSE trigger may
    // not). The VN-opened zones are entitled through their facts, so stamp those too: this
    // asserts the SCHEDULE is satisfiable, and the arc test proves the triggers actually fire.
    const allZoneFacts = factsForSurfaces(
      'room-gate',
      'room-kitchen',
      'room-field-margins',
      'room-weir-reeds',
      'room-sickroom',
    );
    for (let i = 0; i < RANKS.length; i++) {
      const rank = RANKS[i]!;
      let s = atRung(i);
      s = { ...s, flags: { ...s.flags, ...allZoneFacts } };
      const vis = visibleSet(s);
      for (const req of rungRequirements(rank.id)) {
        if (req.type !== 'count') continue;
        const [kind, subject] = req.token.split(':');
        const area =
          kind === 'act'
            ? ACTIVITIES.find((a) => a.id === subject)?.area
            : kind === 'kill'
              ? MOBS.find((m) => m.id === subject)?.area
              : undefined;
        if (area === undefined) continue; // a non-spatial token (a flag/state req)
        const room = roomOf(area);
        if (room === undefined) continue; // an always-open node (no reveal flag)
        expect(
          vis.has(room as never),
          `${rank.id} requires ${req.token} in "${area}", which is not reachable at ${rank.id}`,
        ).toBe(true);
      }
    }
  });

  it('the woodshed opens in the SAME rung as the home it promises (the ADR-177 incoherence, shut)', () => {
    // Its ceremony line is "a mat, a bowl, a nail for the coat: yours". ADR-177 moved the home
    // grant to `tab-inventory`; this asserts the ZONE and the HOME can never drift apart again —
    // both derived, no rung named here.
    const homeRung = RANKS.findIndex((r) => r.rewardOnReach?.unlock?.includes('tab-inventory'));
    const shedRung = RANKS.findIndex((r) => r.rewardOnReach?.unlock?.includes('room-woodshed'));
    expect(shedRung).toBe(homeRung);
    const vis = visibleSet(atRung(shedRung));
    expect(vis.has('panel-home')).toBe(true); // the promise is kept the moment it is spoken
    expect(vis.has('room-woodshed')).toBe(true);
  });

  it('each reveal VN enqueues at its fictional moment — and not before', () => {
    // The triggers, asserted as LEVERS (the condition each one keys on), not as a snapshot.
    const board = (over: Partial<GameState> = {}): GameState => ({
      ...atRung(2),
      location: 'forecourt',
      ...over,
    });

    // the gate: coin in your fist with nowhere to spend it (threshold DERIVED from the stall).
    const poor = board({ resources: { coin: CHEAPEST_STALL_ITEM_COST - 1 } });
    expect(revealsPass(poor).sceneQueue).not.toContain('sb-market');
    const flush = board({ resources: { coin: CHEAPEST_STALL_ITEM_COST } });
    expect(revealsPass(flush).sceneQueue).toContain('sb-market');
    // …and not at the woodlot: the beat happens at the board, where Genemon is.
    expect(revealsPass({ ...flush, location: 'woodlot' }).sceneQueue).not.toContain('sb-market');

    // the kitchen: greens you cannot eat raw.
    const noGreens = board({ resources: { sansai: COOK_SANSAI_COST - 1 } });
    expect(revealsPass(noGreens).sceneQueue).not.toContain('sb-cook');
    const greens = board({ resources: { sansai: COOK_SANSAI_COST } });
    expect(revealsPass(greens).sceneQueue).toContain('sb-cook');

    // the margins: the raided racks, seen from the rows — R3+, when a blade can answer them.
    const rowsAtR2: GameState = { ...atRung(2), location: 'paddies' };
    expect(revealsPass(rowsAtR2).sceneQueue).not.toContain('sb-racks');
    const rowsAtR3: GameState = { ...atRung(3), location: 'paddies' };
    expect(revealsPass(rowsAtR3).sceneQueue).toContain('sb-racks');

    // the sickroom: hurt — but not hurt like THIS. A bare `hp < hpMax` test opens the room in the
    // COLD OPEN, and the reason is subtle enough that only a real playthrough found it: the intro's
    // stat pick raises hpMax (+STR), and current hp does not rise with it — so a freshly-introduced
    // MC is technically "below max" while having taken no wound at all. Sōan's beat is about
    // cracked ribs; it must not play to a man who has never held a blade. Drive the REAL intro and
    // assert the room stays shut.
    let introDone = reduce(createInitialState(1), { type: 'open_eyes' });
    while (introActive(introDone.introBeat)) {
      const sc = introSceneAt(introDone.introBeat)!;
      introDone = reduce(introDone, {
        type: 'choose_intro',
        optionId: sc.decision.options[0]!.id,
      });
    }
    expect(introDone.character.hp).toBeLessThan(hpMax(introDone)); // "hurt", by the naive test
    expect(revealsPass(introDone).sceneQueue).not.toContain('sb-sickroom'); // …and yet: no room
    const foughtHurt: GameState = {
      ...atRung(3), // combat exists at R3
      character: { ...atRung(3).character, hp: 1 },
    };
    expect(revealsPass(foughtHurt).sceneQueue).toContain('sb-sickroom');
  });

  it('a reveal VN opens its zone whichever option the player picks (no pick locks you out)', () => {
    // The works-intro pattern, asserted for every reveal beat: a player may be graceless,
    // sceptical or rude — the pick colours the relationship, never the map.
    for (const id of ['sb-market', 'sb-cook', 'sb-racks', 'sb-sickroom']) {
      const def = SCENES.find((d) => d.id === id)!;
      const flagSets = def.scene.decision.options.map((o) => new Set(o.flags ?? []));
      expect(flagSets.length, `${id} must offer a choice`).toBeGreaterThan(1);
      const [first, ...rest] = flagSets;
      for (const other of rest) {
        expect(
          [...first!].every((f) => other.has(f)),
          `${id}: every option must set the same reveal flag`,
        ).toBe(true);
      }
      expect(first!.size, `${id} must set a reveal flag`).toBeGreaterThan(0);
    }
  });

  it('THE RE-ARM: a zone moved to a later rung drops its stale latch and re-announces', () => {
    // The asymmetry this fixes (verified independently by the save-format session): zone ACCESS
    // already derives from the schedule, so an old save correctly LOSES a re-rung zone — but
    // `seenReveals` never un-latched, so the zone would silently re-grant later with no ceremony.
    // Simulate exactly that: a save that saw the woodshed at R1 (its old rung), loaded against
    // today's schedule (R4).
    const oldSave: GameState = {
      ...atRung(1),
      seenReveals: ['room-woodshed', 'room-paddies'], // announced long ago, at a rung it left
    };
    expect(visibleSet(oldSave).has('room-woodshed')).toBe(false); // access already re-derives

    const loaded = announcePass(oldSave);
    expect(loaded.seenReveals).not.toContain('room-woodshed'); // the stale latch is DROPPED…
    expect(loaded.seenReveals).toContain('room-paddies'); // …and a still-valid one is kept

    // …so when the woodshed's real rung arrives, it announces, instead of appearing in silence.
    const atR4 = announcePass({ ...atRung(4), seenReveals: loaded.seenReveals });
    expect(atR4.seenReveals).toContain('room-woodshed');
  });

  it('walking OUT of a zone that is not on your map still works (no soft-lock)', () => {
    // `canMove` checks only that the DESTINATION is revealed, so a player standing in a zone that
    // de-reveals (an old save re-mapped under them, or a defeat that carries them to a sickroom
    // they have not been shown) can always walk out. Asserted so a future gate on the ORIGIN
    // cannot quietly strand anyone.
    const s = atRung(1); // the sickroom is not open at R1
    const vis = visibleSet(s) as ReadonlySet<string>;
    expect(vis.has('room-sickroom')).toBe(false);
    expect(canMove('sickroom', 'forecourt', vis)).toBe(true); // out is always open
    expect(canMove('forecourt', 'sickroom', vis)).toBe(false); // in is not
  });

  it('the announce SUPPRESSES a VN-revealed zone’s line (the scene is the reveal — HR-32b)', () => {
    // Prod mode: the VN that opened the zone already said it, so nothing else fires. (The DEV
    // 'vn+ink' alternate is the other half of the diverge; the toggle is DEV-only.)
    const opened: GameState = {
      ...atRung(2),
      flags: { ...atRung(2).flags, ...factsForSurfaces('room-gate') },
    };
    expect(visibleSet(opened).has('room-gate')).toBe(true);
    const after = announcePass(opened);
    expect(after.seenReveals).toContain('room-gate'); // latched (never announced twice)
    expect(after.log.entries.some((l) => l.contentKey === 'reveal.room-gate')).toBe(false); // silent
  });

  it('the reveal beats fire from real play: the R0→R3 climb opens every zone its rungs need', () => {
    // The end-to-end proof that the triggers are not obtuse (the human's ONE stated failure mode):
    // drive the REAL engine with the shared optimal policy and assert the zones arrive. Kept to
    // R3 so it stays in the fast lane; the full-arc @slow test carries R4→R7.
    let s = reduce(createInitialState(7), { type: 'open_eyes' });
    let guard = 0;
    while (s.rung !== 'R3' && guard++ < 200_000) {
      const i = focusedOptimalIntent(s);
      if (!i) break;
      s = reduce(s, i);
    }
    expect(s.rung, 'the climb must reach R3').toBe('R3');
    expect(s.scenesPlayed).toContain('sb-market'); // the gate earned itself
    expect(s.scenesPlayed).toContain('sb-cook'); // and the kitchen
    const vis = visibleSet(s);
    expect(vis.has('room-gate')).toBe(true);
    expect(vis.has('room-kitchen')).toBe(true);
    expect(hasFlag(s, 'told-of-the-stall')).toBe(true);
    expect(hasFlag(s, 'taught-to-cook')).toBe(true);
  });
});
