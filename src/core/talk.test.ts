// FB-415 step 4 — the talk contract after the re-homing (D8): the C4.2 press-A
// dispenser (`talk_to`) is RETIRED; every vn person's u9-* authored lines now answer
// through their PERSON-ASK (asks.md `native: u9-<npc>` → ask-natives.ts), inline only
// (D4), with the default text-digest freshness re-lighting the ask when a `when:`
// gate opens a new line (D6). These guards derive from the live registries
// (PEOPLE / DIALOGUES / ASKS), never copied ids or prose.

import { describe, expect, it } from 'vitest';
import {
  createInitialState,
  reduce,
  factsForSurfaces,
  type GameState,
} from './index';
import { PEOPLE, getPerson } from './content/people';
import { getDialogue } from './content/dialogue';
import { ASKS } from './content/asks';
import { ASK_DEFS } from './content/asks.gen';
import { availableAsks, type AskDef } from './asks';
import { peopleHere } from './selectors';
import type { NodePerson } from './content/people';

/** The person-ask that re-homes this person's u9 def (via the generated `native:`
 *  linkage), resolved into the ENGINE def the selector/reducer run. */
function personAsk(p: NodePerson): AskDef | undefined {
  const gen = ASK_DEFS.find((g) => g.person === p.id && g.native === p.sceneId);
  return gen === undefined ? undefined : ASKS.find((a) => a.id === gen.id);
}

/** Stand the MC at a person's node with their gates satisfied (seam-forced rung; the
 *  full real-path presence is t0-arc's concern). ADR-179 — a placeGate is satisfied by
 *  stamping its entitling FACTS (visibility derives, never a stored latch). */
function standingWith(personId: string): GameState {
  const p = getPerson(personId);
  const s = createInitialState(1);
  return {
    ...s,
    rung: 'R4',
    location: p.node,
    flags: p.placeGate
      ? { ...s.flags, ...factsForSurfaces(p.placeGate) }
      : s.flags,
  };
}

describe('the re-homed talk contract (FB-415 D8 — asks own the u9 lines)', () => {
  it('EVERY vn person with a u9 def has a person-ask answering from it (full-T0 floor)', () => {
    // the 2026-07-18 human ruling: talking exists at every rung of T0 — nothing breaks.
    // Every vn person's sceneId must be reachable through an ask whose native answer
    // derives from that very def. (Yohei is `tiny` — the stall owns his voice, D2.)
    for (const p of PEOPLE.filter((x) => x.depth === 'vn' && x.sceneId)) {
      expect(
        personAsk(p),
        `${p.id}: no person-ask re-homes ${p.sceneId}`,
      ).toBeTruthy();
    }
  });

  it('the person-ask answers the def’s gate-free lines, and NEVER writes the log (D4)', () => {
    const p = PEOPLE.find((x) => x.depth === 'vn' && x.sceneId && !x.presence)!;
    const ask = personAsk(p)!;
    const s = standingWith(p.id);
    expect(peopleHere(s).some((x) => x.id === p.id)).toBe(true); // precondition
    // the answer carries exactly the def's gate/memory-satisfied lines, verbatim
    const openLines = getDialogue(p.sceneId!)
      .lines.filter(
        (l) =>
          (l.gate === undefined || l.gate(s.flags)) &&
          (l.memGate === undefined || l.memGate(s.npcMemory)),
      )
      .map((l) => l.text);
    expect(ask.answer(s).map((l) => l.text)).toEqual(openLines);
    expect(openLines.length).toBeGreaterThan(0);
    // hearing it latches heard-state but adds NOTHING to any log channel
    const s2 = reduce(s, { type: 'ask', askId: ask.id });
    expect(s2).not.toBe(s);
    expect(s2.log.entries).toEqual(s.log.entries);
    expect(s2.deliveredDialogue).toEqual(s.deliveredDialogue); // the old cursor stays still
  });

  it('a when: gate opening a NEW line re-lights the heard ask (D6 text-digest freshness)', () => {
    // find, from the REAL registries, a vn person whose def has a flag-gated line
    const p = PEOPLE.find(
      (x) =>
        x.depth === 'vn' &&
        x.sceneId &&
        !x.presence &&
        getDialogue(x.sceneId).lines.some((l) => l.gate !== undefined),
    );
    const candidates = PEOPLE.filter(
      (x) => x.depth === 'vn' && x.sceneId,
    ).filter((x) =>
      getDialogue(x.sceneId!).lines.some((l) => l.gate !== undefined),
    );
    expect(
      candidates.length,
      'no vn person with a flag-gated u9 line in the registry',
    ).toBeGreaterThan(0);
    const person = p ?? candidates[0]!;
    const ask = personAsk(person)!;
    const gated = getDialogue(person.sceneId!).lines.find(
      (l) => l.gate !== undefined,
    )!;
    // derive a flag that SATISFIES the gate by probing single-flag worlds — from the
    // gate itself, never a copied flag name. (u9 gates are single-flag `when:`s.)
    const flagNames = ['pupil', 'wolf-held', 'raked', 'mended', 'named'];
    const satisfying = flagNames.find((f) => gated.gate!({ [f]: true }));
    expect(
      satisfying,
      `could not derive ${person.id}'s gate flag by probing`,
    ).toBeTruthy();
    let s = standingWith(person.id);
    expect(gated.gate!(s.flags)).toBe(false); // precondition: the line is closed
    s = reduce(s, { type: 'ask', askId: ask.id });
    expect(
      availableAsks(s, person.id, ASKS).find((a) => a.def.id === ask.id)!.heard,
    ).toBe(true); // heard, dim
    // the gate opens (the state move) → the answer grows → the ask is FRESH again
    const moved: GameState = {
      ...s,
      flags: { ...s.flags, [satisfying!]: true },
    };
    expect(ask.answer(moved).length).toBeGreaterThan(ask.answer(s).length);
    expect(
      availableAsks(moved, person.id, ASKS).find((a) => a.def.id === ask.id)!
        .heard,
    ).toBe(false);
  });

  it('every vn person with a sceneId points at a REAL dialogue with lines (registry seam)', () => {
    for (const p of PEOPLE.filter((x) => x.depth === 'vn' && x.sceneId)) {
      const d = getDialogue(p.sceneId!); // throws on an unknown id — RED on a broken seam
      expect(
        d.lines.length,
        `${p.id}'s dialogue ${p.sceneId} is empty`,
      ).toBeGreaterThan(0);
    }
  });
});
