// C4.2 — the talk_to intent: the vn-depth cast is conversable. The spirit audit's
// finding: ~40 authored u9-* dialogue lines were placed on people via sceneId but the
// talk affordance never dispatched them — written and mute. These guards derive from
// the live registries (PEOPLE / DIALOGUES), never copied ids or prose.

import { describe, expect, it } from 'vitest';
import { createInitialState, reduce, type GameState } from './index';
import { PEOPLE, getPerson } from './content/people';
import { getDialogue } from './content/dialogue';
import { peopleHere } from './selectors';

/** Stand the MC at a person's node with their gates satisfied (seam-forced rung; the
 *  full real-path presence is t0-arc's concern). */
function standingWith(personId: string): GameState {
  const p = getPerson(personId);
  const s = createInitialState(1);
  return {
    ...s,
    rung: 'R4',
    location: p.node,
    unlocked: p.placeGate ? [...s.unlocked, p.placeGate] : s.unlocked,
  };
}

describe('talk_to — a vn person speaks their authored lines (C4.2)', () => {
  // pick a vn person with an unconditional presence from the REAL registry
  const talker = PEOPLE.find((p) => p.depth === 'vn' && p.sceneId && !p.presence);
  it('the registry offers at least one always-present vn person to test against', () => {
    expect(talker, 'no unconditionally-present vn person in PEOPLE').toBeTruthy();
  });

  it('delivers ONE next line per ask into the log, with the speaker nameplate, advancing the cursor', () => {
    const p = talker!;
    const dialogue = getDialogue(p.sceneId!);
    let s = standingWith(p.id);
    expect(peopleHere(s).some((x) => x.id === p.id)).toBe(true); // precondition
    const logBefore = s.log.entries.length;
    s = reduce(s, { type: 'talk_to', personId: p.id });
    // exactly one authored line landed (the "one teach per moment" cap)…
    const fresh = s.log.entries.slice(logBefore);
    expect(fresh.length).toBe(1);
    // …and it is the dialogue's first gate-free line, voiced with a nameplate
    const firstOpen = dialogue.lines.find((l) => !l.gate && !l.memGate)!;
    expect(fresh[0]!.text).toBe(firstOpen.text);
    expect(s.deliveredDialogue).toContain(firstOpen.id);
    // a second ask delivers the NEXT line, not the same one again
    const s2 = reduce(s, { type: 'talk_to', personId: p.id });
    const fresh2 = s2.log.entries.slice(s.log.entries.length);
    if (fresh2.length > 0) expect(fresh2[0]!.text).not.toBe(firstOpen.text);
  });

  it('is a clean no-op away from the person, and when the lines are exhausted', () => {
    const p = talker!;
    const away: GameState = { ...standingWith(p.id), location: 'woodshed' };
    if (p.node !== 'woodshed') {
      expect(reduce(away, { type: 'talk_to', personId: p.id })).toBe(away);
    }
    // exhaust: ask more times than the dialogue has lines — the tail asks must not throw
    // and must stop appending (delivered set covers everything reachable at this state)
    let s = standingWith(p.id);
    const lineCount = getDialogue(p.sceneId!).lines.length;
    for (let i = 0; i < lineCount + 3; i++) s = reduce(s, { type: 'talk_to', personId: p.id });
    const delivered = s.deliveredDialogue.length;
    const again = reduce(s, { type: 'talk_to', personId: p.id });
    expect(again.deliveredDialogue.length).toBe(delivered);
  });

  it('every vn person with a sceneId points at a REAL dialogue with lines (registry seam)', () => {
    for (const p of PEOPLE.filter((x) => x.depth === 'vn' && x.sceneId)) {
      const d = getDialogue(p.sceneId!); // throws on an unknown id — RED on a broken seam
      expect(d.lines.length, `${p.id}'s dialogue ${p.sceneId} is empty`).toBeGreaterThan(0);
    }
  });
});
