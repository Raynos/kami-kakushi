// The vendors-as-people registry (D-114 / F109/F110): every vendor is a PERSON you
// TALK to at a map node's "who's here" list — never a bare inline menu — arranged on a
// SPECTRUM of interaction depth, with an OPTIONAL place-gate. A vendor = (a person on the
// spectrum) + (an optional place-gate). Pure data + pure predicates (no DOM, no RNG, no
// Date/Math.random): the `presence`/`placeGate` are pure functions of latched surface
// state, so `peopleHere` (selectors.ts) is deterministic + unit-testable, exactly as
// `foesHere` (combat.ts) is for the spatial "who's here" foe question.

import type { GameState, SurfaceId } from '../state';
import type { MapNodeId } from './map';
import type { VoiceCategory } from './voices';
import { NAMES } from './names';

/** The D-114 depth spectrum — how much authoring a vendor carries:
 *  - `vn`    — a FULL VN character: a D-104 full-screen intro + dialogue/quests (the richest).
 *  - `small` — a SMALL person: a line or two of dialogue PLUS a trade (real voice, light presence).
 *  - `tiny`  — a TINY trader: ZERO questions; talking opens STRAIGHT into the trade menu (a face on
 *              a shop, no dialogue tree). */
export type PersonDepth = 'vn' | 'small' | 'tiny';

export interface NodePerson {
  /** Stable id — 'pedlar', 'smith', … (also the who's-here reconcile key + the talk-open key). */
  readonly id: string;
  /** Display name (a canonical NAMES entry or an inline label — the who's-here nameplate). */
  readonly name: string;
  /** Speaker category — colours the who's-here row seal/name + any dialogue (voices.ts). */
  readonly voice: VoiceCategory;
  /** Where they stand (content/map.ts) — they only appear in `peopleHere` at THIS node. */
  readonly node: MapNodeId;
  /** The D-114 spectrum position (a/b/c). */
  readonly depth: PersonDepth;

  /** (D-114 place-gate) a surface/flag the LOCATION needs before this person is reachable — you
   *  must REACH or BUILD the place first (e.g. the smithy before the smith). Undefined = no gate. */
  readonly placeGate?: SurfaceId;

  /** Is this person here right now? (e.g. the pedlar "passes now and then"). A PURE predicate over
   *  GameState (surface latch only — no RNG); undefined = always present once place-gated. */
  readonly presence?: (s: GameState) => boolean;

  // ── depth-specific payloads ──
  /** `vn` → the D-104 DialogueScene id to open (the shared VN engine). */
  readonly sceneId?: string;
  /** `small`/`tiny` → a line or two shown on talk (so a trader reads as a person, not a menu). */
  readonly greeting?: string;
  /** `small`/`tiny` → the trade set to open on talk (the pedlar's `MARKET_ITEMS`, for now). */
  readonly shopId?: string;
  /** A one-line who's-here tell (like `foeTell`) — what this person is/carries, at a glance. */
  readonly tell?: string;
}

export const PEOPLE: readonly NodePerson[] = [
  // ── the PEDLAR (F109 worked example) — a TINY trader (a face on a shop) with ONE greeting line so
  //    he reads as a person, not a menu (a hair toward `small`; easy to promote later). He "passes
  //    now and then" — present at the gate-forecourt once the estate economy opens (panel-estate,
  //    ~R1). No place-gate: he comes to YOU (contrast the smith, who is tied to a place). ──
  {
    id: 'pedlar',
    name: NAMES.pedlar,
    voice: 'villager',
    node: 'gate-forecourt',
    depth: 'tiny',
    presence: (s) => s.unlocked.includes('panel-estate'),
    greeting:
      '"Anything for the road, master? Greens for the pot, a bundle of kindling, a hone for the ' +
      'blade — a little of all, and cheap." He unslings his pack.',
    shopId: 'pedlar',
    tell: 'an Ōmi pedlar — greens, wood, a whetstone',
  },
  // ── the SMITH (place-gate SEAM, D-114 §4.2) — a `small` person TIED TO A PLACE: unavailable until
  //    the woodlot smithy is YOURS to use (placeGate `panel-equipment`, the R4 reward). Before then he
  //    is simply not in `peopleHere` (the reveal reuses the existing surface latch — no new machinery),
  //    so the shop feels EARNED and SITED. A deliberate STUB here (a greeting, no full character): the
  //    two examples together cover both halves of D-114 (person-who-comes-to-you vs place-gated). ──
  {
    id: 'smith',
    name: 'The smith',
    voice: 'arms',
    node: 'woodlot-edge',
    depth: 'small',
    placeGate: 'panel-equipment',
    greeting:
      '"The forge is hot. Bring me good wood and a tired edge, and we\'ll see it made whole." ' +
      'He does not look up from the anvil.',
    tell: 'the woodlot smith — mends and betters a blade',
  },
];

export const PEOPLE_IDS: ReadonlySet<string> = new Set(PEOPLE.map((p) => p.id));

export function getPerson(id: string): NodePerson {
  const p = PEOPLE.find((x) => x.id === id);
  if (!p) throw new Error(`unknown person: ${id}`);
  return p;
}
