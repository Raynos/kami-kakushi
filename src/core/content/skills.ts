// Skill registry (PRD §1.5.1 / §2.7 / §4.5). The v1 LOCKED labour set surfaces by
// doing (discover-by-doing). Each skill carries a per-skill PERKS scaffold — the
// bounded labour→combat channel (Q6/FU8); magnitudes land at their milestone, and
// **conditioning stays the ZERO-stat enablement gate**, orthogonal to the perks.

export type SkillId = 'farming' | 'foraging' | 'woodcutting' | 'conditioning';

export interface SkillDef {
  readonly id: SkillId;
  readonly label: string;
  readonly kanji: string;
  readonly blurb: string;
}

export const SKILLS: readonly SkillDef[] = [
  {
    id: 'farming',
    label: 'Farming',
    kanji: '農',
    blurb: 'Paddy and field work — the house eats by it.',
  },
  {
    id: 'foraging',
    label: 'Foraging',
    kanji: '採',
    blurb: 'Reading the woodlot for sansai, mushrooms, and medicine.',
  },
  {
    id: 'woodcutting',
    label: 'Woodcutting',
    kanji: '樵',
    blurb: 'Felling and splitting at the woodlot edge — fuel and timber.',
  },
  {
    id: 'conditioning',
    label: 'Conditioning',
    kanji: '鍛',
    blurb: 'Hard labour hardens the body — the gate from weak to capable.',
  },
];

export const SKILL_IDS: ReadonlySet<string> = new Set(SKILLS.map((s) => s.id));

export function getSkill(id: SkillId): SkillDef {
  const s = SKILLS.find((x) => x.id === id);
  if (!s) throw new Error(`unknown skill: ${id}`);
  return s;
}
