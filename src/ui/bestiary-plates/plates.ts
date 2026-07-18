// bestiary-plates/plates.ts — the beast register 獣譜 (graphics #4): one
// naturalist survey plate per foe, drawn entirely by code from what
// `enemies.ts` already knows. Seeded-deterministic (the same seed always
// paints the identical plate — TST2), Andon tokens only, brush primitives
// from map-sheets/brush.ts (one ink toolkit — TST1). Spec: README.md in
// this dir (the document fiction is PROPOSED, non-canon until HR-5).
//
// Ink states (one convention with the estate sheet): silver = the old
// hand (silhouette, frame, rule) · gold = the current confirmation
// (ground line, scale ticks) · shu = threat marks + the 済 stamp ·
// foxing/worm-hatch = the ruined (unfaced) plate, NO silhouette (P9).
//
// AC-6 at the ink layer: threat marks derive from `mobCombatStats` — the
// SAME fn the fight and the forecast consume — via `threatGrade` below;
// ac6.test.ts REDs a hand-copied table the moment the stats move.
//
// Figure technique (rounds 0–1 craft lessons, session 217): a beast BODY
// is a hand-cut FILLED silhouette polygon (`wash` — the paper-cut read:
// the full contour authored, ears/muzzle/legs as prongs of ONE outline);
// substrate-colored CARVE strokes cut masks/stripes/ribs out of the
// mass; thin brush strokes add tails, whiskers, context. Two failed
// registers this comment exists to prevent: outline-only stick figures
// (round 0), and fat brushStrokes for mass — at w≳16 the resample step
// (w×1.8) leaves 2–3 points and the stroke renders as an angular slab
// (round 1).

import {
  brushStroke,
  hatchArea,
  inkLine,
  inkText,
  rng,
  stipple,
  sv,
  tip,
  wash,
  waveComb,
} from '../map-sheets/brush';
import type { Pt } from '../map-sheets/geom';
import { MOBS, foeTell, getMob, getNode, mobCombatStats } from '../../core';
import type { MobDef, MobId } from '../../core';

export const PLATE_W = 240;
export const PLATE_H = 320;

/** The figure box every pose draws into (ground varies per pose). */
const BOX_X = 22;
const BOX_Y = 78;

// ── threat derivation (AC-6) ─────────────────────────────────────────────────

/** Danger scalar from the SAME stat block the fight uses — never from a
 *  hand table. attackPower×hp is the toughness-times-hurt mass; both are
 *  monotone in level, so the grade rank-order matches the danger order
 *  the balance curve reads (rubric B4). */
function dangerMass(mob: MobDef): number {
  const s = mobCombatStats(mob);
  return s.attackPower * s.hp;
}

/** Threat grade 1..5 — the foe's ordinal rank among the roster's DISTINCT
 *  danger masses (derived live from mobCombatStats; presentation caps at
 *  five shu ticks). */
export function threatGrade(mob: MobDef): number {
  const masses = [...new Set(MOBS.map(dangerMass))].sort((a, b) => a - b);
  return Math.min(5, 1 + masses.indexOf(dangerMass(mob)));
}

// ── per-foe presentation data (this module's own — never game data) ──────────

/** Displayed field measurement in shaku 尺 — the old hand's rule, a
 *  presentation constant (nothing in the game reads it). */
const SHAKU: Partial<Record<MobId, string>> = {
  river_rats: '五寸',
  tanuki: '一尺五寸',
  badger: '二尺',
  monkey: '一尺五寸',
  monkey_male: '二尺五寸',
  feral_dog: '二尺五寸',
  store_rats: '四寸',
  marten: '一尺五寸',
  wolf: '四尺',
};

/** The body mass — a hand-cut filled silhouette (soft scrawled edge, a
 *  faint definition stroke). THE beast-drawing primitive here. */
function mass(g: SVGElement, pts: readonly Pt[], seed: string, amp = 2): void {
  wash(g, pts, {
    seed,
    fill: 'var(--silver)',
    opacity: 0.92,
    amp,
    stroke: 'var(--silver-dim)',
    strokeW: 0.8,
  });
}

/** A substrate-colored carve — cuts a mask/stripe/rib out of a mass. */
function carve(
  g: SVGElement,
  pts: readonly Pt[],
  seed: string,
  w: number,
): void {
  brushStroke(g, pts, { seed, w, color: 'var(--steel-1)', amp: 0.8 });
}

/** Thin silver detail stroke (tails, whiskers, small limbs). */
function detail(
  g: SVGElement,
  pts: readonly Pt[],
  seed: string,
  w: number,
  dry = false,
): void {
  brushStroke(g, pts, {
    seed,
    w,
    color: 'var(--silver)',
    amp: 1.2,
    ...(dry ? { dry: true } : {}),
  });
}

function hairline(
  g: SVGElement,
  pts: readonly Pt[],
  seed: string,
  w = 1.3,
): void {
  inkLine(g, pts, { seed, w, color: 'var(--silver-dim)', amp: 1 });
}

function ground(
  g: SVGElement,
  x0: number,
  x1: number,
  y: number,
  seed: string,
): void {
  inkLine(
    g,
    [
      [x0, y],
      [x1, y],
    ],
    { seed, w: 1, color: 'var(--ink-faint)' },
  );
}

/** One small rat — shared by the two swarm plates (nose at `left`). */
function rat(
  g: SVGElement,
  x: number,
  y: number,
  s: number,
  seed: string,
): void {
  // one closed humped body: nose → skull → humped back → rump → belly
  mass(
    g,
    [
      [x - 12 * s, y + 2 * s],
      [x - 7 * s, y - 4 * s],
      [x - 2 * s, y - 8 * s],
      [x + 6 * s, y - 10 * s],
      [x + 14 * s, y - 6 * s],
      [x + 18 * s, y + 1 * s],
      [x + 12 * s, y + 5 * s],
      [x - 2 * s, y + 6 * s],
      [x - 8 * s, y + 5 * s],
    ],
    `${seed}-b`,
    1.2,
  );
  // ear — a solid little wedge; eye — a carved dab (round-2: the
  // round-1 hairline ear read as a plant stem, and no eye = no animal)
  detail(
    g,
    [
      [x - 3 * s, y - 9 * s],
      [x - 6 * s, y - 14 * s],
    ],
    `${seed}-e`,
    2.5 * s,
  );
  carve(
    g,
    [
      [x - 8 * s, y - 2 * s],
      [x - 5.5 * s, y - 2 * s],
    ],
    `${seed}-eye`,
    1.6 * s,
  );
  // the long bare tail, trailing behind and DOWN
  hairline(
    g,
    [
      [x + 18 * s, y + 1 * s],
      [x + 30 * s, y + 6 * s],
      [x + 42 * s, y + 3 * s],
    ],
    `${seed}-t`,
    1.6,
  );
}

/** The poses — filled-silhouette bodies (see the header comment), each
 *  drawn into a <g> at the figure box's top-left, every beast facing
 *  LEFT (the album's convention). */
const FIGURES: Partial<Record<MobId, (g: SVGElement, seed: string) => void>> = {
  tanuki(g, seed) {
    // the ROUND read: full round back, pointed muzzle, masked face,
    // short legs, fat striped tail
    mass(
      g,
      [
        [30, 108],
        [44, 98],
        [50, 88],
        [54, 82],
        [57, 66],
        [61, 81],
        [64, 84],
        [68, 66],
        [72, 81],
        [92, 64],
        [116, 58],
        [138, 66],
        [150, 78],
        [154, 92],
        [150, 104],
        [148, 108],
        [151, 130],
        [141, 130],
        [138, 112],
        [112, 118],
        [90, 116],
        [88, 114],
        [90, 130],
        [80, 130],
        [76, 110],
        [60, 106],
        [44, 112],
        [34, 113],
      ],
      `${seed}-body`,
    );
    // the bushy tail — ATTACHED at the rump (round-2: the detached
    // paddle read as a beaver's), ringed like a tanuki's
    mass(
      g,
      [
        [142, 84],
        [166, 74],
        [184, 80],
        [190, 92],
        [182, 104],
        [162, 106],
        [142, 100],
      ],
      `${seed}-tail`,
      2.5,
    );
    carve(
      g,
      [
        [168, 78],
        [164, 100],
      ],
      `${seed}-ring1`,
      2.5,
    );
    carve(
      g,
      [
        [180, 84],
        [176, 102],
      ],
      `${seed}-ring2`,
      2.5,
    );
    // the eye-mask — a ROUND dark patch on the face, never a stripe
    // (round-2: the stripe read as the badger's face-stripe)
    carve(
      g,
      [
        [41, 99],
        [49, 95],
      ],
      `${seed}-mask`,
      8,
    );
    // back contour — ink facture over the fill
    detail(
      g,
      [
        [60, 78],
        [100, 62],
        [140, 72],
      ],
      `${seed}-ctr`,
      2.4,
      true,
    );
    ground(g, 24, 190, 133, `${seed}-gnd`);
  },
  badger(g, seed) {
    // the LOW read: a long wedge, nose driving into the earth, flat
    // back, stocky legs — plainly longer and lower than the tanuki
    mass(
      g,
      [
        [24, 126],
        [38, 110],
        [54, 100],
        [90, 90],
        [130, 90],
        [160, 96],
        [176, 104],
        [190, 110],
        [184, 118],
        [170, 116],
        [162, 116],
        [164, 132],
        [152, 132],
        [148, 118],
        [110, 120],
        [88, 118],
        [86, 116],
        [86, 132],
        [74, 132],
        [70, 116],
        [50, 118],
        [36, 124],
      ],
      `${seed}-body`,
    );
    carve(
      g,
      [
        [28, 122],
        [50, 103],
      ],
      `${seed}-stripe`,
      2.4,
    ); // face stripe
    // dig spray at the nose
    hairline(
      g,
      [
        [20, 118],
        [10, 110],
      ],
      `${seed}-d1`,
      1.3,
    );
    hairline(
      g,
      [
        [24, 124],
        [12, 120],
      ],
      `${seed}-d2`,
      1.3,
    );
    stipple(
      g,
      [
        [6, 124],
        [42, 124],
        [42, 136],
        [6, 136],
      ],
      {
        seed: `${seed}-dig`,
        step: 7,
        prob: 0.55,
        r: 0.9,
        color: 'var(--ink-faint)',
      },
    );
    // back contour — ink facture along the flat spine
    detail(
      g,
      [
        [56, 94],
        [92, 84],
        [140, 86],
        [172, 98],
      ],
      `${seed}-ctr`,
      2.2,
      true,
    );
    ground(g, 6, 190, 133, `${seed}-gnd`);
  },
  monkey(g, seed) {
    // the SITTING read: hunched round back, head sunk low, one long
    // reaching arm, the tail longer than the body
    mass(
      g,
      [
        [86, 48],
        [78, 54],
        [74, 64],
        [78, 72],
        [84, 78],
        [88, 88],
        [92, 104],
        [96, 118],
        [88, 126],
        [84, 132],
        [104, 132],
        [120, 128],
        [132, 116],
        [134, 100],
        [126, 84],
        [112, 64],
        [98, 50],
      ],
      `${seed}-body`,
    );
    // the reach — a purposeful thin arm with fingers
    detail(
      g,
      [
        [86, 74],
        [62, 62],
        [46, 54],
      ],
      `${seed}-arm`,
      5,
    );
    hairline(
      g,
      [
        [46, 54],
        [38, 50],
      ],
      `${seed}-fing`,
      2,
    );
    // support arm
    detail(
      g,
      [
        [96, 96],
        [92, 118],
        [90, 130],
      ],
      `${seed}-arm2`,
      4.5,
    );
    carve(
      g,
      [
        [76, 60],
        [82, 58],
      ],
      `${seed}-eye`,
      2,
    ); // the set eye
    // the LONG tail
    detail(
      g,
      [
        [132, 112],
        [156, 120],
        [174, 108],
        [180, 84],
      ],
      `${seed}-tail`,
      3.5,
    );
    // back contour — the hunched curve inked over the fill
    detail(
      g,
      [
        [98, 52],
        [118, 72],
        [132, 102],
      ],
      `${seed}-ctr`,
      2.2,
      true,
    );
    ground(g, 40, 186, 133, `${seed}-gnd`);
  },
  monkey_male(g, seed) {
    // the KING read (round-2 redesign after the unanimous "scarecrow"
    // verdict): upright big ape — bent arms ending in HANDS, a shaggy
    // mane mass around head+shoulders, muzzle + brow, thick bent legs,
    // a tail stub. Never a T-pose, nothing above the head.
    // mane first, so the head sits on it
    detail(
      g,
      [
        [124, 38],
        [138, 50],
        [142, 64],
      ],
      `${seed}-mane1`,
      12,
      true,
    );
    detail(
      g,
      [
        [92, 40],
        [84, 54],
      ],
      `${seed}-mane2`,
      8,
      true,
    );
    detail(
      g,
      [
        [112, 26],
        [124, 30],
      ],
      `${seed}-mane3`,
      8,
      true,
    );
    // stout upright torso
    mass(
      g,
      [
        [104, 62],
        [96, 78],
        [94, 102],
        [98, 122],
        [110, 128],
        [122, 124],
        [128, 100],
        [126, 76],
        [118, 62],
      ],
      `${seed}-torso`,
    );
    // head — muzzle left, browed
    mass(
      g,
      [
        [82, 52],
        [86, 42],
        [96, 32],
        [110, 28],
        [122, 34],
        [124, 46],
        [114, 56],
        [98, 58],
        [86, 58],
      ],
      `${seed}-head`,
      1.6,
    );
    carve(
      g,
      [
        [88, 44],
        [102, 38],
      ],
      `${seed}-brow`,
      2.6,
    );
    carve(
      g,
      [
        [90, 49],
        [94, 48],
      ],
      `${seed}-eye`,
      2,
    );
    // near arm — bent at the elbow, ending in a hand with fingers
    mass(
      g,
      [
        [96, 66],
        [82, 76],
        [72, 90],
        [76, 98],
        [86, 90],
        [98, 78],
        [104, 70],
      ],
      `${seed}-arm1`,
      1.6,
    );
    mass(
      g,
      [
        [70, 92],
        [60, 98],
        [64, 104],
        [74, 100],
      ],
      `${seed}-hand1`,
      1.2,
    );
    hairline(
      g,
      [
        [62, 100],
        [54, 104],
      ],
      `${seed}-f1`,
      1.6,
    );
    hairline(
      g,
      [
        [64, 103],
        [58, 108],
      ],
      `${seed}-f2`,
      1.6,
    );
    // far arm — bent, dimmer (depth), also handed
    brushStroke(
      g,
      [
        [124, 70],
        [140, 84],
        [148, 98],
      ],
      {
        seed: `${seed}-arm2`,
        w: 8,
        color: 'var(--silver-dim)',
        amp: 1.2,
      },
    );
    mass(
      g,
      [
        [146, 96],
        [156, 100],
        [152, 108],
        [144, 104],
      ],
      `${seed}-hand2`,
      1.2,
    );
    // thick bent legs, feet gripping the ground
    mass(
      g,
      [
        [98, 120],
        [90, 132],
        [88, 144],
        [104, 146],
        [106, 134],
        [104, 124],
      ],
      `${seed}-leg1`,
      1.6,
    );
    mass(
      g,
      [
        [116, 122],
        [122, 134],
        [126, 144],
        [138, 146],
        [130, 132],
        [122, 122],
      ],
      `${seed}-leg2`,
      1.6,
    );
    // tail stub
    detail(
      g,
      [
        [124, 118],
        [138, 126],
      ],
      `${seed}-tail`,
      4,
    );
    // spine contour — ink facture over the fill
    detail(
      g,
      [
        [112, 30],
        [126, 60],
        [128, 96],
      ],
      `${seed}-ctr`,
      2.5,
      true,
    );
    ground(g, 60, 170, 148, `${seed}-gnd`);
  },
  feral_dog(g, seed) {
    // the LEAN read (round-2 redesign after the unanimous "boar with
    // slash wounds" verdict): muzzle LIFTED off the ground, jaw open
    // with a tooth tick, one folded ear, CURVED rib arcs on the
    // barrel, thin neck, tail hung low between the hocks.
    mass(
      g,
      [
        [22, 78],
        [38, 72],
        [52, 66],
        [58, 58],
        [66, 68],
        [80, 68],
        [106, 66],
        [132, 70],
        [146, 76],
        [144, 92],
        [148, 130],
        [139, 130],
        [132, 94],
        [112, 92],
        [94, 96],
        [82, 98],
        [84, 131],
        [75, 131],
        [72, 98],
        [64, 88],
        [54, 80],
        [40, 80],
        [28, 84],
      ],
      `${seed}-body`,
    );
    // folded ear flap over the skull
    mass(
      g,
      [
        [54, 62],
        [64, 58],
        [66, 66],
        [58, 68],
      ],
      `${seed}-ear`,
      1.2,
    );
    // open lower jaw + a tooth tick in the gap
    detail(
      g,
      [
        [24, 88],
        [38, 84],
      ],
      `${seed}-jaw`,
      3,
    );
    hairline(
      g,
      [
        [28, 82],
        [30, 86],
      ],
      `${seed}-tooth`,
      1.2,
    );
    carve(
      g,
      [
        [42, 72],
        [48, 70],
      ],
      `${seed}-eye`,
      2,
    );
    // ribs — CURVED arcs following the barrel, never straight slashes
    carve(
      g,
      [
        [86, 78],
        [83, 86],
        [85, 93],
      ],
      `${seed}-r1`,
      1.7,
    );
    carve(
      g,
      [
        [96, 77],
        [93, 85],
        [95, 92],
      ],
      `${seed}-r2`,
      1.7,
    );
    carve(
      g,
      [
        [106, 77],
        [103, 85],
        [105, 91],
      ],
      `${seed}-r3`,
      1.7,
    );
    carve(
      g,
      [
        [116, 78],
        [113, 85],
        [115, 91],
      ],
      `${seed}-r4`,
      1.7,
    );
    // far legs — filled, dimmer, attached at the belly (never sticks)
    brushStroke(
      g,
      [
        [92, 94],
        [96, 130],
      ],
      {
        seed: `${seed}-l3`,
        w: 5,
        color: 'var(--silver-dim)',
        amp: 1,
      },
    );
    brushStroke(
      g,
      [
        [124, 92],
        [130, 129],
      ],
      {
        seed: `${seed}-l4`,
        w: 5,
        color: 'var(--silver-dim)',
        amp: 1,
      },
    );
    // the tail — thin, hung LOW between the hocks
    detail(
      g,
      [
        [144, 84],
        [148, 104],
        [142, 120],
      ],
      `${seed}-tail`,
      3.5,
    );
    // spine contour
    detail(
      g,
      [
        [56, 66],
        [104, 64],
        [144, 74],
      ],
      `${seed}-ctr`,
      2.2,
      true,
    );
    ground(g, 16, 176, 133, `${seed}-gnd`);
  },
  wolf(g, seed) {
    // the BIG still read: dead-level heavy back, ears up, deep chest,
    // tail straight out — a composed animal, nothing wasted
    mass(
      g,
      [
        [22, 64],
        [40, 56],
        [52, 50],
        [54, 38],
        [61, 48],
        [64, 36],
        [70, 46],
        [84, 44],
        [104, 42],
        [130, 44],
        [156, 48],
        [168, 54],
        [192, 56],
        [200, 64],
        [190, 70],
        [168, 68],
        [160, 72],
        [167, 137],
        [155, 137],
        [150, 76],
        [120, 80],
        [102, 82],
        [96, 84],
        [98, 138],
        [85, 138],
        [82, 84],
        [74, 80],
        [60, 68],
        [40, 66],
      ],
      `${seed}-body`,
    );
    // the ruff — one dry shoulder stroke over the mass
    detail(
      g,
      [
        [70, 52],
        [82, 78],
      ],
      `${seed}-ruff`,
      9,
      true,
    );
    // the two far legs — filled, dimmer, attached at the belly
    brushStroke(
      g,
      [
        [108, 80],
        [112, 136],
      ],
      {
        seed: `${seed}-l3`,
        w: 6,
        color: 'var(--silver-dim)',
        amp: 1,
      },
    );
    brushStroke(
      g,
      [
        [140, 76],
        [146, 136],
      ],
      {
        seed: `${seed}-l4`,
        w: 6,
        color: 'var(--silver-dim)',
        amp: 1,
      },
    );
    carve(
      g,
      [
        [44, 60],
        [52, 58],
      ],
      `${seed}-eye`,
      2,
    ); // the level eye
    // back contour — ink facture along the level spine
    detail(
      g,
      [
        [56, 50],
        [104, 44],
        [160, 52],
      ],
      `${seed}-ctr`,
      2.5,
      true,
    );
    ground(g, 18, 196, 140, `${seed}-gnd`);
  },
  river_rats(g, seed) {
    // the SWARM at the WATER (round-2 redesign after the "stones in
    // farmland" verdict): a dark water band with ripples and a shore
    // line, the swimmer as head + wake-V, shore rats with ears/eyes
    // and trailing tails, reeds BENT with clustered seed heads.
    wash(
      g,
      [
        [14, 112],
        [198, 108],
        [198, 140],
        [14, 140],
      ],
      {
        seed: `${seed}-water`,
        fill: 'var(--steel-0, #0e1016)',
        opacity: 0.75,
        amp: 2.5,
      },
    );
    waveComb(g, 70, 122, 110, { seed: `${seed}-w1`, rows: 3, opacity: 0.7 });
    waveComb(g, 150, 128, 80, { seed: `${seed}-w2`, rows: 2, opacity: 0.5 });
    inkLine(
      g,
      [
        [14, 111],
        [198, 107],
      ],
      {
        seed: `${seed}-shore`,
        w: 1.4,
        color: 'var(--silver-dim)',
        amp: 1.5,
      },
    );
    // reeds — bent, seed heads clustered at the tips
    hairline(
      g,
      [
        [150, 126],
        [158, 92],
        [172, 64],
      ],
      `${seed}-rd1`,
    );
    hairline(
      g,
      [
        [162, 124],
        [168, 94],
        [180, 70],
      ],
      `${seed}-rd2`,
    );
    hairline(
      g,
      [
        [174, 126],
        [176, 96],
        [184, 76],
      ],
      `${seed}-rd3`,
    );
    detail(
      g,
      [
        [168, 66],
        [176, 60],
      ],
      `${seed}-sh1`,
      3.5,
      true,
    );
    detail(
      g,
      [
        [177, 72],
        [185, 67],
      ],
      `${seed}-sh2`,
      3.5,
      true,
    );
    detail(
      g,
      [
        [181, 78],
        [189, 74],
      ],
      `${seed}-sh3`,
      3,
      true,
    );
    // shore rats on the bank above the water line
    rat(g, 52, 96, 1.4, `${seed}-ra`);
    rat(g, 102, 102, 1.1, `${seed}-rb`);
    // the swimmer — only the head above water, a wake-V opening behind
    mass(
      g,
      [
        [120, 120],
        [126, 114],
        [134, 113],
        [138, 118],
        [130, 122],
      ],
      `${seed}-rc`,
      1.2,
    );
    hairline(
      g,
      [
        [138, 118],
        [154, 112],
      ],
      `${seed}-wk1`,
      1.3,
    );
    hairline(
      g,
      [
        [138, 121],
        [156, 124],
      ],
      `${seed}-wk2`,
      1.3,
    );
  },
  store_rats(g, seed) {
    // the INTERIOR swarm: straight floor + wall corner, a straw bale,
    // one rat climbing the wall — the kura, not the field
    inkLine(
      g,
      [
        [16, 130],
        [196, 130],
      ],
      {
        seed: `${seed}-fl`,
        w: 2,
        color: 'var(--silver-dim)',
        amp: 0.4,
      },
    );
    inkLine(
      g,
      [
        [168, 130],
        [168, 30],
      ],
      {
        seed: `${seed}-wl`,
        w: 2,
        color: 'var(--silver-dim)',
        amp: 0.4,
      },
    );
    // the bale — a solid mass with carved rope ties
    mass(
      g,
      [
        [36, 112],
        [48, 102],
        [76, 100],
        [88, 108],
        [86, 124],
        [68, 129],
        [42, 127],
      ],
      `${seed}-bale`,
      2,
    );
    carve(
      g,
      [
        [54, 102],
        [52, 128],
      ],
      `${seed}-t1`,
      2,
    );
    carve(
      g,
      [
        [72, 101],
        [72, 127],
      ],
      `${seed}-t2`,
      2,
    );
    rat(g, 116, 120, 0.9, `${seed}-ra`);
    rat(g, 64, 94, 0.7, `${seed}-rb`); // up on the bale
    // the climber — flat against the wall, tail hanging
    mass(
      g,
      [
        [160, 82],
        [155, 72],
        [158, 60],
        [166, 58],
        [168, 70],
        [166, 82],
      ],
      `${seed}-rc`,
      1.2,
    );
    hairline(
      g,
      [
        [158, 58],
        [155, 51],
      ],
      `${seed}-rce`,
      1.4,
    );
    hairline(
      g,
      [
        [164, 84],
        [166, 104],
      ],
      `${seed}-rct`,
      1.5,
    );
  },
  marten(g, seed) {
    // the SINUOUS read: one long S over a roof beam, the tail as long
    // as the beast pouring off it — the roofline, not the ground
    inkLine(
      g,
      [
        [16, 110],
        [196, 104],
      ],
      {
        seed: `${seed}-bm`,
        w: 3.5,
        color: 'var(--silver-dim)',
        amp: 0.8,
      },
    );
    inkLine(
      g,
      [
        [16, 115],
        [196, 109],
      ],
      {
        seed: `${seed}-bm2`,
        w: 1,
        color: 'var(--ink-faint)',
        amp: 0.8,
      },
    );
    // beam end + tile scallops — the roofline reads as ARCHITECTURE
    // (round-2: the bare slope read as a hillside)
    mass(
      g,
      [
        [10, 100],
        [24, 99],
        [25, 116],
        [11, 117],
      ],
      `${seed}-bmend`,
      1.2,
    );
    for (let i = 0; i < 6; i++) {
      const x0 = 30 + i * 27;
      hairline(
        g,
        [
          [x0, 118],
          [x0 + 9, 123],
          [x0 + 18, 117],
        ],
        `${seed}-tile${i}`,
        1.2,
      );
    }
    // body: the S traced as one closed band, THICKER than round 1
    // (the ribbon read as a snake/sash)
    mass(
      g,
      [
        [172, 68],
        [160, 62],
        [146, 68],
        [128, 76],
        [108, 88],
        [90, 82],
        [72, 90],
        [56, 96],
        [44, 104],
        [50, 112],
        [62, 108],
        [78, 101],
        [92, 95],
        [110, 101],
        [130, 90],
        [148, 82],
        [162, 78],
        [172, 76],
      ],
      `${seed}-body`,
      1.6,
    );
    // the tail — a dry stroke as long as the body, off the beam
    detail(
      g,
      [
        [48, 106],
        [34, 116],
        [24, 130],
      ],
      `${seed}-tail`,
      10,
      true,
    );
    // the head end differentiated: two ears, an eye, whiskers
    detail(
      g,
      [
        [154, 62],
        [151, 56],
      ],
      `${seed}-ear1`,
      2.5,
    );
    detail(
      g,
      [
        [160, 60],
        [158, 54],
      ],
      `${seed}-ear2`,
      2.5,
    );
    carve(
      g,
      [
        [162, 68],
        [165, 68],
      ],
      `${seed}-eye`,
      1.8,
    );
    hairline(
      g,
      [
        [172, 70],
        [181, 68],
      ],
      `${seed}-wh1`,
      1,
    );
    hairline(
      g,
      [
        [172, 72],
        [181, 74],
      ],
      `${seed}-wh2`,
      1,
    );
    // legs — filled, joined at the body with hip bulges (never sticks)
    brushStroke(
      g,
      [
        [70, 94],
        [67, 108],
      ],
      {
        seed: `${seed}-l1`,
        w: 4.5,
        color: 'var(--silver-dim)',
        amp: 1,
      },
    );
    brushStroke(
      g,
      [
        [100, 96],
        [99, 107],
      ],
      {
        seed: `${seed}-l2`,
        w: 4.5,
        color: 'var(--silver-dim)',
        amp: 1,
      },
    );
    brushStroke(
      g,
      [
        [128, 86],
        [128, 102],
      ],
      {
        seed: `${seed}-l3`,
        w: 4.5,
        color: 'var(--silver-dim)',
        amp: 1,
      },
    );
    brushStroke(
      g,
      [
        [148, 82],
        [150, 102],
      ],
      {
        seed: `${seed}-l4`,
        w: 4.5,
        color: 'var(--silver-dim)',
        amp: 1,
      },
    );
    // spine contour along the S
    detail(
      g,
      [
        [58, 96],
        [92, 86],
        [130, 80],
        [166, 66],
      ],
      `${seed}-ctr`,
      2.2,
      true,
    );
  },
  // the bandit (野伏) deliberately has NO figure — the register keeps no
  // men (spec H5); drawPlate renders its slot as the ruined blank always.
};

// ── tell callout marks ───────────────────────────────────────────────────────

/** foeTell words → in-document marks (the tell label itself prints as a
 *  small mechanical caption — ADR-139-exempt). */
function tellMarks(g: SVGElement, seed: string, tell: string): void {
  const has = (w: string): boolean => tell.includes(w);
  if (has('fast')) {
    // motion strokes trailing the figure, top-left
    inkLine(
      g,
      [
        [8, 40],
        [30, 38],
      ],
      {
        seed: `${seed}-f1`,
        w: 1.2,
        color: 'var(--gold-dim)',
      },
    );
    inkLine(
      g,
      [
        [6, 48],
        [32, 46],
      ],
      {
        seed: `${seed}-f2`,
        w: 1.2,
        color: 'var(--gold-dim)',
      },
    );
    inkLine(
      g,
      [
        [10, 56],
        [28, 54],
      ],
      {
        seed: `${seed}-f3`,
        w: 1.2,
        color: 'var(--gold-dim)',
      },
    );
  }
  if (has('heavy')) {
    // one ground-weight bar under the figure's center
    brushStroke(
      g,
      [
        [80, 146],
        [130, 146],
      ],
      {
        seed: `${seed}-h`,
        w: 4,
        color: 'var(--gold-dim)',
        taperIn: 0.3,
        taperOut: 0.3,
      },
    );
  }
  if (has('evasive')) {
    // a dodge arc, top-right — the slip drawn as a path the blow missed
    inkLine(
      g,
      [
        [150, 34],
        [170, 26],
        [190, 34],
      ],
      {
        seed: `${seed}-e`,
        w: 1.2,
        color: 'var(--gold-dim)',
      },
    );
  }
  if (has('unerring')) {
    // a single straight strike line entering from the left, mid-figure
    inkLine(
      g,
      [
        [4, 90],
        [40, 86],
      ],
      {
        seed: `${seed}-u`,
        w: 1,
        color: 'var(--shu)',
        amp: 0.3,
      },
    );
  }
}

// ── the plate ────────────────────────────────────────────────────────────────

export interface PlateOpts {
  readonly seed: string;
  readonly faced: boolean;
  /** The old hand's field note (fiction-voiced; supplied by the caller —
   *  the ADR-139-diverged source, never authored here). */
  readonly note?: string;
  /** Hide header kanji/labels/note — the blind-pass naming crop (rubric
   *  B2 tests the silhouette ALONE). */
  readonly blind?: boolean;
}

const KANJI_NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

function wrapNote(note: string, width: number): string[] {
  const words = note.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > width) {
      lines.push(cur);
      cur = w;
    } else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

/** Draw one register plate. Returns the plate's <g>. */
export function drawPlate(
  parent: SVGElement,
  enemyId: MobId,
  o: PlateOpts,
): SVGGElement {
  const mob = getMob(enemyId);
  const idx = MOBS.findIndex((m) => m.id === enemyId);
  const seed = `${o.seed}:${enemyId}`;
  const r = rng(seed);
  const g = sv('g', { class: 'bp-plate' }) as SVGGElement;
  parent.append(g);

  // paper + double frame (the old hand's rule: silver out, gold key in)
  wash(
    g,
    [
      [3, 3],
      [PLATE_W - 3, 3],
      [PLATE_W - 3, PLATE_H - 3],
      [3, PLATE_H - 3],
    ],
    { seed: `${seed}-pp`, fill: 'var(--silver-faint)', opacity: 0.5, amp: 1.5 },
  );
  inkLine(
    g,
    [
      [6, 6],
      [PLATE_W - 6, 6],
      [PLATE_W - 6, PLATE_H - 6],
      [6, PLATE_H - 6],
      [6, 6],
    ],
    { seed: `${seed}-fr`, w: 2, color: 'var(--silver-dim)', amp: 1 },
  );
  inkLine(
    g,
    [
      [12, 12],
      [PLATE_W - 12, 12],
      [PLATE_W - 12, PLATE_H - 12],
      [12, PLATE_H - 12],
      [12, 12],
    ],
    {
      seed: `${seed}-fr2`,
      w: 0.8,
      color: 'var(--gold-dim)',
      opacity: 0.7,
      amp: 0.8,
    },
  );

  // plate number — survives on every plate, ruined or whole (far right)
  inkText(g, PLATE_W - 26, 30, `其ノ${KANJI_NUM[idx] ?? String(idx + 1)}`, {
    size: 11,
    color: 'var(--gold-dim)',
    vertical: true,
    anchor: 'start',
  });

  const figure = FIGURES[enemyId];
  if (!o.faced || !figure) {
    // H2/H5 — the ruined plate: foxing washes + worm-hatch, NO silhouette
    for (let i = 0; i < 3; i++) {
      const cx = 40 + r() * 140;
      const cy = 60 + r() * 200;
      const rad = 18 + r() * 30;
      wash(
        g,
        [
          [cx - rad, cy],
          [cx - rad * 0.4, cy - rad * 0.8],
          [cx + rad * 0.7, cy - rad * 0.4],
          [cx + rad, cy + rad * 0.5],
          [cx + rad * 0.2, cy + rad * 0.9],
          [cx - rad * 0.6, cy + rad * 0.6],
        ],
        {
          seed: `${seed}-fx${i}`,
          fill: 'var(--silver-faint)',
          opacity: 0.35,
          amp: 6,
        },
      );
    }
    hatchArea(
      g,
      [
        [20, 50],
        [PLATE_W - 20, 70],
        [PLATE_W - 26, PLATE_H - 40],
        [26, PLATE_H - 60],
      ],
      {
        seed: `${seed}-wh`,
        angle: 24,
        spacing: 17,
        w: 0.8,
        color: 'var(--ink-faint)',
        opacity: 0.6,
      },
    );
    // wormtracks — a few meandering eaten lines, substrate-colored
    for (let i = 0; i < 3; i++) {
      const x0 = 30 + r() * 150;
      const y0 = 70 + r() * 180;
      inkLine(
        g,
        [
          [x0, y0],
          [x0 + 14 + r() * 20, y0 + (r() - 0.5) * 24],
          [x0 + 34 + r() * 26, y0 + (r() - 0.5) * 30],
        ],
        {
          seed: `${seed}-wt${i}`,
          w: 2.6,
          color: 'var(--steel-1)',
          opacity: 0.9,
          amp: 3,
        },
      );
    }
    // never name the beast on a ruined plate (P9 — the unfaced state
    // leaks nothing, the hover included)
    tip(g, 'a ruined plate — not yet confirmed by the house');
    return g;
  }

  // header — kanji title vertical at the period-correct RIGHT edge,
  // beside (left of) the plate number; reading gloss bottom-left
  if (!o.blind) {
    inkText(g, PLATE_W - 52, 28, mob.kanji, {
      size: 22,
      color: 'var(--silver-hi)',
      vertical: true,
      anchor: 'start',
    });
    inkText(g, 20, 260, mob.label, {
      size: 10,
      color: 'var(--ink-soft)',
      anchor: 'start',
    });
  }

  // the figure
  const fig = sv('g', {
    transform: `translate(${BOX_X} ${BOX_Y})`,
  }) as SVGGElement;
  g.append(fig);
  figure(fig, seed);
  if (!o.blind) tellMarks(fig, seed, foeTell(mob));

  if (!o.blind) {
    // threat marks — shu grade ticks, DERIVED (AC-6): 危 + one tick per grade
    const grade = threatGrade(mob);
    inkText(g, 22, 32, '危', {
      size: 10,
      color: 'var(--shu)',
      anchor: 'start',
      opacity: 0.9,
    });
    for (let i = 0; i < grade; i++) {
      brushStroke(
        g,
        [
          [38 + i * 13, 28],
          [48 + i * 13, 28],
        ],
        {
          seed: `${seed}-th${i}`,
          w: 3.2,
          color: 'var(--shu)',
          taperIn: 0.25,
          taperOut: 0.25,
        },
      );
    }
    // tell caption (mechanical)
    inkText(g, 22, 46, foeTell(mob), {
      size: 8,
      color: 'var(--ink-faint)',
      anchor: 'start',
    });

    // measurement — the old hand's rule with 尺 note
    const shaku = SHAKU[enemyId];
    if (shaku) {
      inkLine(
        g,
        [
          [40, 244],
          [200, 244],
        ],
        { seed: `${seed}-mr`, w: 1, color: 'var(--gold-dim)', amp: 0.5 },
      );
      for (const t of [40, 80, 120, 160, 200])
        inkLine(
          g,
          [
            [t, 241],
            [t, 247],
          ],
          { seed: `${seed}-mt${t}`, w: 1, color: 'var(--gold-dim)', amp: 0.3 },
        );
      inkText(g, 200, 238, shaku, {
        size: 9,
        color: 'var(--gold-dim)',
        anchor: 'end',
      });
    }

    // ground line — 出ル所 + the foe's own node (derived; gold = the
    // current confirmation)
    const node = getNode(mob.area);
    inkText(
      g,
      20,
      274,
      `出ル所　${node?.kanji ?? ''}　${node?.label ?? mob.area}`,
      {
        size: 9.5,
        color: 'var(--gold)',
        anchor: 'start',
        opacity: 0.9,
      },
    );

    // the field note (fiction-voiced, supplied by the caller)
    if (o.note) {
      wrapNote(o.note, 44).forEach((line, i) => {
        inkText(g, 20, 288 + i * 10, line, {
          size: 8.5,
          color: 'var(--ink-soft)',
          anchor: 'start',
          opacity: 0.85,
        });
      });
    }

    // the 済 confirm stamp — shu, pressed slightly askew
    const sx = PLATE_W - 40;
    const sy = PLATE_H - 46;
    const stamp = sv('g', {
      transform: `rotate(${(r() - 0.5) * 14} ${sx} ${sy})`,
      opacity: '0.85',
    }) as SVGGElement;
    g.append(stamp);
    inkLine(
      stamp,
      [
        [sx - 12, sy - 12],
        [sx + 12, sy - 12],
        [sx + 12, sy + 12],
        [sx - 12, sy + 12],
        [sx - 12, sy - 12],
      ],
      { seed: `${seed}-st`, w: 2, color: 'var(--shu)', amp: 0.8 },
    );
    inkText(stamp, sx, sy + 5, '済', { size: 13, color: 'var(--shu)' });
  }

  // the blind crop must not leak the name anywhere — the hover title
  // included (the golden test's B2 guard reads textContent)
  tip(
    g,
    o.blind ? 'a confirmed plate' : `${mob.label} ${mob.kanji} — confirmed`,
  );
  return g;
}
