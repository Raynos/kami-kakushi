// T0 zones — the bible's ground (story-bible/tiers/t0.md + 05-world), KEYED TO THE
// SHEET's zone ids (src/ui/map-sheets/nodes.ts T0_NODES — ONE vocabulary, TST1). Each
// zone inks in on its own rung beat (the separate-reveal rule, canon §I). 16 AreaIds:
// 15 walkable + `ruined` (locked scenery, never walkable). Blurbs are adapted from the
// bible-distilled sheet nodes (single source). The old satoyama frame is retired here.

export type AreaId =
  | 'weir'
  | 'weir-reeds'
  | 'gate'
  | 'forecourt'
  | 'woodshed'
  | 'kitchen'
  | 'shrine'
  | 'kura'
  | 'sickroom'
  | 'drill-yard'
  | 'paddies'
  | 'field-margins'
  | 'woodlot'
  | 'ruined'
  | 'orchard'
  | 'grove';

export interface AreaDef {
  readonly id: AreaId;
  readonly label: string;
  readonly blurb: string;
  /** Locked scenery — visible & blurbed, never walkable (`canMove` refuses). */
  readonly locked?: boolean;
}

export const AREAS: readonly AreaDef[] = [
  {
    id: 'weir',
    label: 'The weir & riverbank',
    blurb: 'Where the river left him; the weir-jizō stands here.',
  },
  {
    id: 'weir-reeds',
    label: 'The weir reeds',
    blurb: 'River rats gnaw the weir screens the house leases from Matsuzō.',
  },
  {
    id: 'gate',
    label: 'The gate & gateyard',
    blurb: "The estate's face, kept barely; Yohei's stall sets up here on market days.",
  },
  {
    id: 'forecourt',
    label: 'The forecourt',
    blurb: "The working heart of the guest house's outer court — the first verb is here.",
  },
  {
    id: 'woodshed',
    label: 'The woodshed',
    blurb: 'His corner: a mat, a chipped bowl, the comfort floor.',
  },
  {
    id: 'kitchen',
    label: 'The kitchen threshold',
    blurb: "Meals at the threshold; the board where the household's shape is overheard.",
  },
  {
    id: 'shrine',
    label: 'The shrine-alcove corridor',
    blurb: 'A family altar in a corridor — glimpsed once in T0, entered in T1.',
  },
  {
    id: 'kura',
    label: 'The kura & grain-store',
    blurb: "The working storehouse; the grain-watch's post.",
  },
  {
    id: 'sickroom',
    label: "Sōan's sickroom",
    blurb: 'A lean-to surgery off the outer court — defeat carries you here, and days are lost.',
  },
  {
    id: 'drill-yard',
    label: 'The drill yard',
    blurb: "The old stable court, repurposed — Kihei's ground. Opens at R4, as Kihei's need.",
  },
  {
    id: 'paddies',
    label: 'The home paddy & vegetable rows',
    blurb: "The guest house's skirts; the labour baseline — the deed engine's heart.",
  },
  {
    id: 'field-margins',
    label: 'The field margins',
    blurb: "Tanuki and badger setts at the paddy's edge, raiding the drying racks.",
  },
  {
    id: 'woodlot',
    label: 'The woodlot edge',
    blurb: "Kindling and forage country; the wolf's ground before R3. Nobody here.",
  },
  {
    id: 'ruined',
    label: 'The ruined compound',
    blurb: 'Beyond a rope and a warning: fallen roofs, a crumbled gate. Locked all tier.',
    locked: true,
  },
  {
    id: 'orchard',
    label: 'The overgrown orchard',
    blurb: "The old compound's orchard gone wild; feral dogs den in it, bold from lean winters.",
  },
  {
    id: 'grove',
    label: 'The bamboo grove',
    blurb: 'Behind the compound; the monkey troop raids the vegetable rows from it.',
  },
];

export const AREA_IDS: ReadonlySet<string> = new Set(AREAS.map((a) => a.id));
