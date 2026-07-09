// Labour activities (PRD §2.6 / §4.7.1). Each is a curated, story-consistent act
// that yields resources, grants its skill XP (under the per-event cap), drains
// satiety (soft-throttled, never blocked), and — when eligible for the current rung
// — feeds the Estate Service rung-meter. Availability is gated by its verb-surface
// being revealed (and the conditioning gate, for a danger ring).

import type { SkillId } from './skills';
import type { AreaId } from './areas';
import type { EstateDeedSource } from './balance';

export type ActivityId =
  | 'farm_paddy'
  | 'haul_stores'
  | 'woodcut_edge'
  | 'forage_satoyama'
  | 'forage_deepwoods'
  | 'tap_lacquer';
// ADR-107: labour yields RICE (rake + paddy work), COIN (hauling wage + a little from forage), wood
// (woodcut), or sansai (forage greens). koku is never labour-earned — it is House standing.
export type LabourResource = 'rice' | 'coin' | 'wood' | 'sansai';

export interface ActivityDef {
  readonly id: ActivityId;
  readonly label: string;
  readonly skill: SkillId;
  readonly area: AreaId;
  readonly yields: Partial<Record<LabourResource, number>>;
  readonly satietyCost: number;
  readonly xp: number;
  /** The autumn-harvest multiplier applies to season-gated field yields (§4.7.1). */
  readonly seasonHarvest?: boolean;
  /** A light danger ring — needs the conditioning enablement gate (§4.4). */
  readonly dangerRing?: boolean;
  /** The verb-surface that must be revealed for this activity to be available. */
  readonly surface: string;
  /** ADR-145 (Q4) — the Estate deed source this labour banks in Phase 2. OMITTED = the work is
   *  not estate-relevant (forage/woodcut feed the pockets, not the house's standing — TST3). */
  readonly deedSource?: EstateDeedSource;
}

export const ACTIVITIES: readonly ActivityDef[] = [
  {
    id: 'farm_paddy',
    label: 'Work the home paddy & rows',
    skill: 'farming',
    area: 'paddies',
    yields: { rice: 4 },
    satietyCost: 3,
    xp: 5,
    seasonHarvest: true,
    surface: 'verb-farm',
    deedSource: 'fields', // ADR-145 — the shinden/paddy work, the steady Phase-2 earner
  },
  {
    id: 'haul_stores',
    label: 'Haul stores at the forecourt',
    skill: 'conditioning',
    area: 'forecourt',
    // The first COIN-paying labour — a porter's wage (ADR-107 / D4: coin arrives as the "first wage").
    yields: { coin: 2 },
    satietyCost: 4,
    xp: 5,
    surface: 'verb-haul',
    deedSource: 'stores', // ADR-145 — granary stocking (with a kura rice deposit)
  },
  {
    id: 'woodcut_edge',
    label: 'Cut wood at the woodlot',
    skill: 'woodcutting',
    area: 'woodlot',
    yields: { wood: 3 },
    satietyCost: 4,
    xp: 5,
    surface: 'verb-woodcut',
  },
  {
    id: 'forage_satoyama',
    label: 'Forage the woodlot edge',
    skill: 'foraging',
    area: 'woodlot',
    yields: { sansai: 2, coin: 1 },
    satietyCost: 3,
    xp: 5,
    dangerRing: true,
    surface: 'verb-forage',
  },
  {
    // v0.3.1 Step 5d — the load-bearing yield (ADR-078): the SAME foraging verb, richer on the deeper
    // node. You walk one hill farther (past the danger ring) for a materially better haul — the map
    // gates income, tying the spatial spine to the Step-4 coin economy + the combat cook-loop.
    id: 'forage_deepwoods',
    label: 'Forage deep in the woodlot',
    skill: 'foraging',
    area: 'woodlot',
    yields: { sansai: 4, coin: 2 },
    satietyCost: 5,
    xp: 7,
    dangerRing: true,
    surface: 'verb-forage',
  },
  {
    // ADR-146 — the woodlot's HIDDEN action: absent from the node's list until the
    // disc-woodlot-lacquer discovery latches (derived hiddenness — see content/discoveries.ts).
    // Urushi sap sells — a pocket earner like forage-coin, deliberately NOT estate-relevant
    // (no deedSource, ADR-145 Q4): tapping trees builds no house standing.
    id: 'tap_lacquer',
    label: 'Tap the lacquer tree',
    skill: 'woodcutting',
    area: 'woodlot',
    yields: { coin: 3 },
    satietyCost: 4,
    xp: 5,
    surface: 'verb-woodcut',
  },
];

export const ACTIVITY_IDS: ReadonlySet<string> = new Set(ACTIVITIES.map((a) => a.id));

export function getActivity(id: ActivityId): ActivityDef {
  const a = ACTIVITIES.find((x) => x.id === id);
  if (!a) throw new Error(`unknown activity: ${id}`);
  return a;
}

export function activityLine(
  act: ActivityDef,
  gained: Readonly<Partial<Record<LabourResource, number>>>,
): string {
  const parts = Object.entries(gained)
    .filter(([, n]) => (n ?? 0) > 0)
    .map(([r, n]) => `+${n} ${r}`)
    .join(', ');
  return `${act.label}. (${parts})`;
}
