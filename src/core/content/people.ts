// The vendors-as-people registry (ADR-114 / FB-109/FB-110), grown at G4 into the FULL bible
// §04-cast ↔ node placement: every T0 person you can meet stands at a map node's "who's here"
// list — never a bare inline menu — arranged on a SPECTRUM of interaction depth, with an
// OPTIONAL presence predicate (WHO is WHERE WHEN) and an OPTIONAL place-gate. A vendor/person =
// (a person on the spectrum) + (an optional presence window) + (an optional place-gate). Pure
// data + pure predicates (no DOM, no RNG, no Date/Math.random): `presence` is a pure function of
// the derived `PresenceCtx` (day-of-week / season / rung / flags — all latched state), so
// `peopleHere` (selectors.ts) is deterministic + unit-testable, exactly as `foesHere` (combat.ts)
// is for the spatial "who's here" foe question.
//
// The LINES a person speaks are migrated canon (dialogue.gen.ts `u9-<npc>` registries — the
// single source, NEVER re-typed here). This module places WHO stands WHERE and WHEN; the talk
// panel surfaces their migrated dialogue via `sceneId` (the full-VN path is wired in a later
// chunk). Munemasa — "a voice through a wall" — never places at a T0 node, so he has no entry.

import type { GameState, SurfaceId } from '../state';
import type { MapNodeId } from './map';
import type { VoiceCategory } from './voices';
import type { RankId } from './ranks';
import type { Season } from '../constants';
import { dayOfWeek, type DayOfWeek } from '../constants';
import { YOHEI_MARKET_DAYS } from './market';
import { NAMES } from './names';

/** The ADR-114 depth spectrum — how much authoring a vendor carries:
 *  - `vn`    — a FULL VN character: a ADR-104 full-screen intro + dialogue/quests (the richest).
 *  - `small` — a SMALL person: a line or two of dialogue PLUS a trade (real voice, light presence).
 *  - `tiny`  — a TINY trader: ZERO questions; talking opens STRAIGHT into the trade menu (a face on
 *              a shop, no dialogue tree). */
export type PersonDepth = 'vn' | 'small' | 'tiny';

/** The DERIVED context a `presence` predicate reads (G4) — the four levers the bible schedules a
 *  person on: the day-of-week (Yohei's market days), the season (Iori at New Year + Bon), the rung
 *  (Naoyuki reads the MC true from R1), and the story flags. Pure derivation of latched state, so a
 *  presence predicate stays deterministic + unit-testable. */
export interface PresenceCtx {
  readonly dayOfWeek: DayOfWeek;
  readonly season: Season;
  readonly rung: RankId;
  readonly flags: Readonly<Record<string, boolean>>;
}

/** Derive the presence context from GameState (the single place state internals are read). */
export function presenceCtx(s: GameState): PresenceCtx {
  return { dayOfWeek: dayOfWeek(s.clock.day), season: s.season, rung: s.rung, flags: s.flags };
}

/** The rung ladder order, for "at or past Rn" presence gates (plain index compare — the canonical
 *  ordering lives in ranks.ts; kept local so people.ts stays a leaf). */
const RUNG_ORDER: readonly RankId[] = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'];
function rungAtLeast(rung: RankId, min: RankId): boolean {
  return RUNG_ORDER.indexOf(rung) >= RUNG_ORDER.indexOf(min);
}

/** The weir lease is settled on one weekday a week — Matsuzō walks up from the water then. A
 *  placement-scheduling constant (not fiction), sibling to YOHEI_MARKET_DAYS. */
const LEASE_DAY: DayOfWeek = 0;

export interface NodePerson {
  /** Stable id — the bible NpcId ('genemon', 'yohei', …); also the who's-here reconcile key + the
   *  talk-open key. */
  readonly id: string;
  /** Display name (a canonical NAMES entry — the who's-here nameplate). */
  readonly name: string;
  /** Speaker category — colours the who's-here row seal/name + any dialogue (voices.ts). */
  readonly voice: VoiceCategory;
  /** Where they stand (content/map.ts) — they only appear in `peopleHere` at THIS node. */
  readonly node: MapNodeId;
  /** The ADR-114 spectrum position. */
  readonly depth: PersonDepth;

  /** (ADR-114 place-gate) a surface/flag the LOCATION needs before this person is reachable — you
   *  must REACH or BUILD the place first. Undefined = no gate (the node's own map reveal gates it). */
  readonly placeGate?: SurfaceId;

  /** Is this person here right now? A PURE predicate over the derived `PresenceCtx` (day-of-week /
   *  season / rung / flags — no RNG, no wall-clock); undefined = always present at their node. */
  readonly presence?: (c: PresenceCtx) => boolean;

  // ── depth-specific payloads ──
  /** `vn` → the migrated dialogue/scene id to open on talk (dialogue.gen.ts `u9-<npc>`). */
  readonly sceneId?: string;
  /** `small`/`tiny` → a line or two shown on talk (so a trader reads as a person, not a menu). */
  readonly greeting?: string;
  /** `small`/`tiny` → the trade set to open on talk (Yohei's market — content/market.ts). */
  readonly shopId?: string;
  /** A one-line who's-here tell (like `foeTell`) — the person's role, at a glance. */
  readonly tell?: string;
}

// The FULL T0 cast placement (bible §04-cast; the storywave migration map, session 125). One entry
// per person at their canonical node; the presence predicate carries the bible's WHEN. Secondary
// haunts noted in the migration map (Sōan on the weir rounds, Kihei at the gate watch-change,
// O-Hisa at the woodshed) are ambient scripted beats, not talk placements — folded in a later chunk.
export const PEOPLE: readonly NodePerson[] = [
  // ── the household (the estate's inner cast) ──
  {
    // Genemon — the steward; the board, the book, the terms (R1·R6·R7 granter). Runs the forecourt.
    id: 'genemon',
    name: NAMES.elder,
    voice: 'steward',
    node: 'forecourt',
    depth: 'vn',
    sceneId: 'u9-genemon',
    tell: 'the steward — the board, the book, the terms',
  },
  {
    // Kihei — the drillmaster / watch-keeper (R3·R4 granter). His ground is the drill yard (R4 node).
    id: 'kihei',
    name: NAMES.drillmaster,
    voice: 'arms',
    node: 'drill-yard',
    depth: 'vn',
    sceneId: 'u9-kihei',
    tell: 'the drillmaster — orders, then verdicts',
  },
  {
    // Sōan — the physician; the weir examination + the sickroom. His surgery off the outer court.
    id: 'soan',
    name: NAMES.physician,
    voice: 'physician',
    node: 'sickroom',
    depth: 'vn',
    sceneId: 'u9-soan',
    tell: 'the physician — the exam, the sickroom',
  },
  {
    // O-Hisa — the kitchen; meals at the threshold, the household's shape overheard.
    id: 'ohisa',
    name: NAMES.ohisa,
    voice: 'steward',
    node: 'kitchen',
    depth: 'vn',
    sceneId: 'u9-ohisa',
    tell: 'the kitchen — meals at the threshold',
  },
  {
    // Shinnosuke — the heir's son (~12), the player's MIRROR. Underfoot at the kitchen board first.
    id: 'shinnosuke',
    name: NAMES.shinnosuke,
    voice: 'steward',
    node: 'kitchen',
    depth: 'vn',
    sceneId: 'u9-shinnosuke',
    tell: "the heir's son — a boy, always underfoot",
  },
  {
    // Toku — the dowager, the house's memory; the shrine corridor + the new-moon walk (shrine = R5).
    id: 'toku',
    name: NAMES.toku,
    voice: 'steward',
    node: 'shrine',
    depth: 'vn',
    sceneId: 'u9-toku',
    tell: "the dowager — the house's memory",
  },
  {
    // Naoyuki — the heir, reads the MC true from the R1 veranda (the full portrait; the Count is R5,
    // a scripted scene). Present at the forecourt/veranda from R1.
    id: 'naoyuki',
    name: NAMES.heir,
    voice: 'official',
    node: 'forecourt',
    depth: 'vn',
    sceneId: 'u9-naoyuki',
    presence: (c) => rungAtLeast(c.rung, 'R1'),
    tell: 'the heir — reads you true',
  },

  // ── the estate's edge (the village line) ──
  {
    // Yohei — the pedlar at the gate on MARKET DAYS only (day-of-week predicate). A TINY trader:
    // talking opens his market (content/market.ts) straight away. Coin errands counted to the mon.
    id: 'yohei',
    name: NAMES.pedlar,
    voice: 'villager',
    node: 'gate',
    depth: 'tiny',
    presence: (c) => YOHEI_MARKET_DAYS.includes(c.dayOfWeek),
    shopId: 'yohei',
    tell: 'the pedlar — coin, greens, wood, a whetstone',
  },
  {
    // O-Yae — the scullery day-girl; the news service both ways, at the kitchen by day.
    id: 'oyae',
    name: NAMES.oyae,
    voice: 'villager',
    node: 'kitchen',
    depth: 'vn',
    sceneId: 'u9-oyae',
    tell: 'the scullery day-girl — news both ways',
  },
  {
    // Matsuzō — the old weir-keeper the house leases the weir from; up from the water on the LEASE DAY.
    id: 'matsuzo',
    name: NAMES.matsuzo,
    voice: 'villager',
    node: 'weir',
    depth: 'vn',
    sceneId: 'u9-matsuzo',
    presence: (c) => c.dayOfWeek === LEASE_DAY,
    tell: 'the old weir-keeper — the water, the lease',
  },
  {
    // Iori — the traveling monk, lodging at the gate at NEW YEAR + BON only (season predicate). Wants
    // nothing, gives, leaves.
    id: 'iori',
    name: NAMES.iori,
    voice: 'monk',
    node: 'gate',
    depth: 'vn',
    sceneId: 'u9-iori',
    presence: (c) => c.season === 'new-year' || c.season === 'bon',
    tell: 'a traveling monk — wants nothing, gives, leaves',
  },
  {
    // O-Ume — the widow at the paddy's edge; sets her drowned husband's place at Bon (the jizō
    // offerings). At the field margins.
    id: 'oume',
    name: NAMES.oume,
    voice: 'villager',
    node: 'field-margins',
    depth: 'vn',
    sceneId: 'u9-oume',
    tell: 'the paddy-edge widow — the jizō offerings',
  },
  {
    // Rokusuke — the named face of the hired hands; his load-tally clears the MC at the Count. In the
    // home paddies with the rest of the day-labour.
    id: 'rokusuke',
    name: NAMES.rokusuke,
    voice: 'villager',
    node: 'paddies',
    depth: 'vn',
    sceneId: 'u9-rokusuke',
    tell: 'the hired hands — his load-tally counts',
  },
];

export const PEOPLE_IDS: ReadonlySet<string> = new Set(PEOPLE.map((p) => p.id));

export function getPerson(id: string): NodePerson {
  const p = PEOPLE.find((x) => x.id === id);
  if (!p) throw new Error(`unknown person: ${id}`);
  return p;
}
