// Content verifier (PRD §6.6 / §6.6.1): cross-checks ids across the typed registries
// and enforces the canon invariants. Grows additively as registries arrive. Run
// inside `npm run verify`; a violation fails the build.
export {};

import {
  SURFACES,
  SURFACE_IDS,
  SKILL_IDS,
  AREA_IDS,
  ACTIVITY_IDS,
  ACTIVITIES,
  RANKS,
  NAMES,
  MOBS,
  MOB_IDS,
  WEAPONS,
  WEAPON_IDS,
  ESTATE_STAGES,
  balance,
} from '../core';

const { RUNG_METER_THRESHOLDS } = balance;

const errors: string[] = [];

// 1. Surface ids unique + the set mirrors the registry.
const seen = new Set<string>();
for (const s of SURFACES) {
  if (seen.has(s.id)) errors.push(`duplicate surface id: ${s.id}`);
  seen.add(s.id);
}
if (seen.size !== SURFACE_IDS.size) {
  errors.push(`SURFACE_IDS (${SURFACE_IDS.size}) does not mirror SURFACES (${seen.size})`);
}

// 2. Activities resolve their skill / area / surface.
for (const a of ACTIVITIES) {
  if (!SKILL_IDS.has(a.skill)) errors.push(`activity ${a.id}: unknown skill "${a.skill}"`);
  if (!AREA_IDS.has(a.area)) errors.push(`activity ${a.id}: unknown area "${a.area}"`);
  if (!SURFACE_IDS.has(a.surface)) errors.push(`activity ${a.id}: unknown surface "${a.surface}"`);
}

// 3. Rank eligibility ids resolve; rank rewards unlock only real surfaces.
const META_ACTIONS = new Set(['rake_rice', 'rest', 'open_eyes']);
for (const r of RANKS) {
  for (const e of r.eligible) {
    if (!ACTIVITY_IDS.has(e) && !META_ACTIONS.has(e)) {
      errors.push(`rank ${r.id}: eligible id "${e}" is neither an activity nor a meta action`);
    }
  }
  for (const u of r.rewardOnReach?.unlock ?? []) {
    if (!SURFACE_IDS.has(u)) errors.push(`rank ${r.id}: reward unlocks unknown surface "${u}"`);
  }
}

// 3b. Rung-meter drift guard (audit G-PACING; D-056 — single profile, fork retired): the
//     RUNG_METER_THRESHOLDS map is the single source of truth, mirrored 1:1 by RankDef.meterThreshold.
for (const r of RANKS) {
  if (RUNG_METER_THRESHOLDS[r.id] !== r.meterThreshold) {
    errors.push(
      `rank ${r.id}: RUNG_METER_THRESHOLDS (${RUNG_METER_THRESHOLDS[r.id]}) != RankDef.meterThreshold (${r.meterThreshold})`,
    );
  }
}

// 4. Bestiary: grounded mobs only (no belief-creatures in spawn tables, canon §E),
//    ids mirror, levels ≥ 1; weapons mirror + sane stats.
if (MOBS.length !== MOB_IDS.size) errors.push('MOB_IDS does not mirror MOBS');
for (const m of MOBS) {
  if (m.level < 1) errors.push(`mob ${m.id}: level < 1`);
}
const BELIEF_WORDS = [
  'tengu',
  'kappa',
  'yokai',
  'yōkai',
  'oni',
  'kami',
  'yurei',
  'yūrei',
  'bakemono',
];
for (const m of MOBS) {
  if (BELIEF_WORDS.some((w) => m.id.toLowerCase().includes(w))) {
    errors.push(`belief-creature in the bestiary/spawn registry: ${m.id} (canon §E forbids it)`);
  }
}
if (WEAPONS.length !== WEAPON_IDS.size) errors.push('WEAPON_IDS does not mirror WEAPONS');
for (const w of WEAPONS) {
  if (w.baseAttack <= 0 || w.baseSpeed <= 0 || w.durabilityMax <= 0) {
    errors.push(`weapon ${w.id}: non-positive stat`);
  }
}

// 4b. Estate sink (audit #5): stages contiguous 1..N, costs strictly ascending, bonus ≥ 0.
ESTATE_STAGES.forEach((e, i) => {
  if (e.stage !== i + 1) errors.push(`estate stage #${i}: non-contiguous stage ${e.stage}`);
  if (e.satietyMaxBonus < 0) errors.push(`estate stage E${e.stage}: negative satietyMaxBonus`);
  if (i > 0 && e.coinCost <= ESTATE_STAGES[i - 1]!.coinCost) {
    errors.push(`estate stage E${e.stage}: coinCost not strictly ascending`);
  }
});

// 5. Real-name denylist — no real Edo figures may surface as canon names (D-042 / Q39).
const DENYLIST = new Set([
  'munenori',
  'jubei',
  'jūbei',
  'ranpo',
  'tadakuni',
  'toyama',
  'konoe',
  'yagyu',
  'yagyū',
  'edogawa',
  'tokugawa',
  'ieyasu',
  'nobunaga',
  'hideyoshi',
  'naozane',
  'kuranosuke',
]);
for (const [key, value] of Object.entries(NAMES)) {
  if (DENYLIST.has(String(value).toLowerCase())) {
    errors.push(`real-name denylist hit: NAMES.${key} = "${value}"`);
  }
}

if (errors.length > 0) {
  console.error('verify-content FAILED:');
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(
  `verify-content: OK (${SURFACES.length} surfaces, ${ACTIVITIES.length} activities, ${RANKS.length} ranks, ${MOBS.length} mobs, ${WEAPONS.length} weapons, ${Object.keys(NAMES).length} names).`,
);
process.exit(0);
