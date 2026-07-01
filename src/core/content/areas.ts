// T0 estate rooms/areas (PRD §1.7 / §3.3). The "separate-reveal" rule: each room
// inks in on its own beat as the rung ladder is climbed (canon §I). v1 keeps full
// walkable maps within a small per-tier node set; M1 reveals the estate's near rooms.

export type AreaId =
  | 'kura'
  | 'gate-forecourt'
  | 'home-paddies'
  | 'woodlot-edge'
  | 'near-satoyama'
  | 'deep-satoyama';

export interface AreaDef {
  readonly id: AreaId;
  readonly label: string;
  readonly blurb: string;
}

export const AREAS: readonly AreaDef[] = [
  {
    id: 'kura',
    label: 'The grain-store (kura)',
    blurb: 'Where you woke. Dark, dry, smelling of rice.',
  },
  {
    id: 'gate-forecourt',
    label: 'Gate & forecourt',
    blurb: 'The estate gate and the swept forecourt — stores come and go here.',
  },
  {
    id: 'home-paddies',
    label: 'Home paddies',
    blurb: 'The terraced rice paddies that feed the house.',
  },
  {
    id: 'woodlot-edge',
    label: 'Stables & woodlot edge',
    blurb: 'The stable yard giving onto the woodlot — fuel, timber, and the road out.',
  },
  {
    id: 'near-satoyama',
    label: 'Near satoyama',
    blurb: 'The managed hill-forest above the estate — sansai, and the first hint of danger.',
  },
  {
    id: 'deep-satoyama',
    label: 'Deep satoyama',
    blurb: 'The wild hill-forest beyond the edge — a richer forage, and the boar in its wallow.',
  },
];

export const AREA_IDS: ReadonlySet<string> = new Set(AREAS.map((a) => a.id));
