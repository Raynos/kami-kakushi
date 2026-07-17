// FB-415 — the state-derived ask engine (talk-system redesign, step 1). Everyday talk
// answers from LIVE state: an ask def is (person · rung window · when-gate · answer fn ·
// freshness key), the selector derives what's askable NOW, and hearing an ask never
// writes the log (D4 — inline only; story beats alone write to Story). Rung windows in
// these fixtures derive from the RANKS registry order, never copied literals.

import { describe, expect, it } from 'vitest';
import {
  createInitialState,
  reduce,
  factsForSurfaces,
  type GameState,
} from './index';
import { RANKS } from './content/ranks';
import { getPerson } from './content/people';
import { ASKS } from './content/asks';
import { availableAsks, unheardAskCount, type AskDef } from './asks';
import { makeEnvelope } from '../persistence/codec';
import { validateEnvelope } from '../persistence/validate';

/** A minimal ask def over the REAL rank ladder: window [RANKS[lo], RANKS[hi]]. */
function askAt(lo: number, hi: number, id = 'test-ask'): AskDef {
  return {
    id,
    person: 'genemon',
    rungMin: RANKS[lo]!.id,
    rungMax: RANKS[hi]!.id,
    label: '“How does the house stand?”',
    answer: () => [{ text: 'It stands.' }],
  };
}

describe('availableAsks — the rung-windowed ask selector (FB-415 D5/D6)', () => {
  it('offers an ask whose window contains the current rung, and not outside it', () => {
    const defs = [askAt(1, 3)];
    const inWindow = { ...createInitialState(1), rung: RANKS[2]!.id };
    const below = { ...createInitialState(1), rung: RANKS[0]!.id };
    const above = { ...createInitialState(1), rung: RANKS[4]!.id };
    expect(
      availableAsks(inWindow, 'genemon', defs).map((a) => a.def.id),
    ).toEqual(['test-ask']);
    expect(availableAsks(below, 'genemon', defs)).toEqual([]);
    expect(availableAsks(above, 'genemon', defs)).toEqual([]);
    // and only for the def's own person
    expect(availableAsks(inWindow, 'soan', defs)).toEqual([]);
  });
});

/** Stand the MC at an ask's person with gates satisfied, at the ask's opening rung
 *  (seam-forced, as talk.test.ts does; ADR-179 place-gates satisfied via facts). */
function standingFor(def: AskDef): GameState {
  const p = getPerson(def.person);
  const s = createInitialState(1);
  return {
    ...s,
    rung: def.rungMin,
    location: p.node,
    flags: p.placeGate
      ? { ...s.flags, ...factsForSurfaces(p.placeGate) }
      : s.flags,
  };
}

/** A seed ask on an always-present person from the REAL registry (talk.test.ts idiom). */
function seedAsk(): AskDef | undefined {
  return ASKS.find(
    (d) => !getPerson(d.person).presence && d.when === undefined,
  );
}

describe('the ask intent — heard-marking, inline only (D4/D7)', () => {
  const def = seedAsk();
  it('the registry seeds at least one ungated ask on an always-present person', () => {
    expect(
      def,
      'no ungated ask on an always-present person in ASKS',
    ).toBeTruthy();
  });

  it('marks the ask heard and leaves the log UNTOUCHED (D4 — inline only)', () => {
    const d = def!;
    const s = standingFor(d);
    const before = availableAsks(s, d.person, ASKS).find(
      (a) => a.def.id === d.id,
    );
    expect(before?.heard).toBe(false); // precondition: offered, fresh
    const s2 = reduce(s, { type: 'ask', askId: d.id });
    expect(s2).not.toBe(s); // the hear latched…
    expect(s2.log.entries).toEqual(s.log.entries); // …but NO channel gained a line
    const after = availableAsks(s2, d.person, ASKS).find(
      (a) => a.def.id === d.id,
    );
    expect(after?.heard).toBe(true);
  });

  it('un-hears when state moves the answer (D6 — refresh is state-driven, no timers)', () => {
    // the seed steward ask keys its freshness to the rung: hearing it at R0 dims it,
    // and a promotion (any state move the def declares) makes it fresh again. Rungs
    // come from the RANKS registry, never literals.
    const d = ASKS.find(
      (a) => a.freshness !== undefined && !getPerson(a.person).presence,
    );
    expect(
      d,
      'no freshness-keyed ask on an always-present person',
    ).toBeTruthy();
    const s0 = standingFor(d!);
    expect(unheardAskCount(s0, d!.person, ASKS)).toBeGreaterThan(0);
    const heard = reduce(s0, { type: 'ask', askId: d!.id });
    // heard → the newness count DROPPED…
    expect(unheardAskCount(heard, d!.person, ASKS)).toBe(
      unheardAskCount(s0, d!.person, ASKS) - 1,
    );
    // …until the state the answer derives from moves (seam-forced rung step)
    const moved: GameState = {
      ...heard,
      rung: RANKS[RANKS.findIndex((r) => r.id === heard.rung) + 1]!.id,
    };
    const again = availableAsks(moved, d!.person, ASKS).find(
      (a) => a.def.id === d!.id,
    );
    expect(again?.heard).toBe(false);
  });

  it('is a clean no-op away from the person, and for an unknown ask', () => {
    const d = def!;
    const p = getPerson(d.person);
    const away: GameState = {
      ...standingFor(d),
      location: p.node === 'woodshed' ? 'kura' : 'woodshed',
    };
    expect(reduce(away, { type: 'ask', askId: d.id })).toBe(away);
    const here = standingFor(d);
    expect(reduce(here, { type: 'ask', askId: 'no-such-ask' })).toBe(here);
  });
});

describe('asksHeard persistence (SCHEMA_VERSION 15, additive)', () => {
  it('heard asks survive a save→load round-trip', () => {
    const d = seedAsk()!;
    const heard = reduce(standingFor(d), { type: 'ask', askId: d.id });
    const env = makeEnvelope(heard, 1, 1);
    const res = validateEnvelope(JSON.parse(JSON.stringify(env)));
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.state.asksHeard).toEqual(heard.asksHeard);
  });

  it('a pre-bump (v14) blob opens with no ask heard — the correct fresh default', () => {
    const s = createInitialState(1) as unknown as Record<string, unknown>;
    delete s.asksHeard; // a v14 state never carried the field
    const env = {
      ...makeEnvelope(createInitialState(1), 1, 1),
      schemaVersion: 14,
      state: s,
    };
    const res = validateEnvelope(JSON.parse(JSON.stringify(env)));
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.state.asksHeard).toEqual({});
  });
});
