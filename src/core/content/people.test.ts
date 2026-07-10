// Vendors-as-people (ADR-114) + location-flavor routing (ADR-116) — pure-core tests. Fixtures derive
// from the source of truth (the PEOPLE registry, getNode's blurb, each person's own presence
// predicate, YOHEI_MARKET_DAYS), never copied literals, so a mis-gated selector or a re-channelled
// move line fails RED.
//
// G4 (the content cutover): the registry is the FULL bible cast (pedlar→yohei, the smith retired).
// The T0 cast gates on PRESENCE (WHO is WHERE WHEN — Yohei's market days), not placeGate — so this
// exercises the node-spatial gate and the presence gate against the real yohei/genemon placements.

import { describe, it, expect } from 'vitest';
import { createInitialState, type GameState } from '../state';
import { reduce } from '../intents';
import { peopleHere } from '../selectors';
import { getPerson, presenceCtx } from './people';
import { nodeSeasonalBlurb, getNode } from './map';
import { YOHEI_MARKET_DAYS } from './market';
import { dayOfWeek, DAYS_PER_WEEK, type DayOfWeek } from '../constants';

function awakeAt(location: string, opts: { day?: number; unlocked?: string[] } = {}): GameState {
  const base = createInitialState(1);
  return {
    ...base,
    location,
    clock: { ...base.clock, day: opts.day ?? base.clock.day },
    flags: { ...base.flags, awake: true },
    unlocked: [...base.unlocked, ...(opts.unlocked ?? [])],
  };
}

/** A market day-of-week and a non-market one, both DERIVED from YOHEI_MARKET_DAYS (never pinned):
 *  clock.day in 0..6 has day-of-week === itself, so we use the DoW value directly as a day. */
const MARKET_DOW = YOHEI_MARKET_DAYS[0]!;
const NON_MARKET_DOW = ([0, 1, 2, 3, 4, 5, 6] as DayOfWeek[]).find(
  (d) => !YOHEI_MARKET_DAYS.includes(d),
)!;

describe('peopleHere (D-114) — the spatial "who\'s here" selector, mirroring foesHere', () => {
  it('returns an always-present household member at HIS node, and NOT at any other node', () => {
    const steward = getPerson('genemon'); // source of truth: his node (the forecourt), no presence gate
    const present = awakeAt(steward.node);
    expect(steward.presence).toBeUndefined(); // the coupling this rides on: always present at his node
    expect(peopleHere(present).map((p) => p.id)).toContain('genemon');

    // same state, but standing on the KURA floor (not his node) → spatial: he is absent.
    const elsewhere = awakeAt('kura');
    expect(elsewhere.location).not.toBe(steward.node);
    expect(peopleHere(elsewhere).map((p) => p.id)).not.toContain('genemon');
  });

  it('respects PRESENCE — the pedlar is here on a market day, gone off it', () => {
    const yohei = getPerson('yohei'); // source of truth: his node (the gate) + market-day presence
    expect(dayOfWeek(MARKET_DOW)).toBe(MARKET_DOW); // a day in 0..6 IS its own day-of-week
    expect(YOHEI_MARKET_DAYS).toContain(MARKET_DOW);
    expect(YOHEI_MARKET_DAYS).not.toContain(NON_MARKET_DOW);

    const onMarket = awakeAt(yohei.node, { day: MARKET_DOW });
    expect(yohei.presence!(presenceCtx(onMarket))).toBe(true); // documents the coupling
    expect(peopleHere(onMarket).map((p) => p.id)).toContain('yohei');

    const offMarket = awakeAt(yohei.node, { day: NON_MARKET_DOW });
    expect(yohei.presence!(presenceCtx(offMarket))).toBe(false);
    expect(peopleHere(offMarket).map((p) => p.id)).not.toContain('yohei');
  });

  it('presence is spatial+temporal AND-ed — the pedlar is absent off his node even on a market day', () => {
    const yohei = getPerson('yohei');
    const wrongNode = awakeAt('kura', { day: MARKET_DOW }); // market day, but not the gate
    expect(wrongNode.location).not.toBe(yohei.node);
    expect(peopleHere(wrongNode).map((p) => p.id)).not.toContain('yohei');
    // a full week of market days never conjures him onto the wrong node.
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      expect(peopleHere(awakeAt('kura', { day: d })).map((p) => p.id)).not.toContain('yohei');
    }
  });
});

describe('D-116 — location flavor routes to a transient Now line, never the Story log', () => {
  it('move_to emits the destination blurb as an EPHEMERAL narration entry (the Now channel)', () => {
    // stand at the forecourt with the kura open, then walk to the kura.
    const dest = 'kura';
    const s0 = awakeAt('forecourt', { unlocked: [getNode(dest).revealFlag!] });
    const s1 = reduce(s0, { type: 'move_to', to: dest });
    expect(s1.location).toBe(dest); // the move actually happened

    // source of truth for the arrival line's text — SEASONAL since C5a unit 5
    const blurb = nodeSeasonalBlurb(getNode(dest), s1.season).text;
    const blurbEntries = s1.log.entries.filter((e) => e.text === blurb);
    expect(blurbEntries.length).toBeGreaterThan(0); // an arrival line WAS emitted
    // …and EVERY such entry is a fleeting Now line, never a permanent Story entry. Could-go-RED:
    // emitting `{ channel: 'narration' }` with no `ephemeral` fails here.
    for (const e of blurbEntries) {
      expect(e.ephemeral).toBe(true);
      expect(e.channel).toBe('narration');
      // FB-344 — the zone's label rides as the line's speaker, so the Now view
      // reads "Kura: <the description>" (source of truth: the node's own label).
      expect(e.speaker).toBe(getNode(dest).label);
    }
  });
});
