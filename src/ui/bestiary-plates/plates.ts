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
  // ear + the long bare tail
  hairline(
    g,
    [
      [x - 3 * s, y - 9 * s],
      [x - 5 * s, y - 13 * s],
    ],
    `${seed}-e`,
    1.2,
  );
  hairline(
    g,
    [
      [x + 18 * s, y + 1 * s],
      [x + 30 * s, y + 5 * s],
      [x + 40 * s, y + 2 * s],
    ],
    `${seed}-t`,
    1.5,
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
    // the bushy tail — a drooping teardrop off the rump, furred dry
    mass(
      g,
      [
        [148, 84],
        [168, 76],
        [184, 82],
        [188, 92],
        [178, 102],
        [160, 104],
        [148, 96],
      ],
      `${seed}-tail`,
      2.5,
    );
    detail(
      g,
      [
        [156, 86],
        [180, 94],
      ],
      `${seed}-fur`,
      3.5,
      true,
    );
    carve(
      g,
      [
        [38, 102],
        [54, 93],
      ],
      `${seed}-mask`,
      5,
    ); // the eye-mask, cut across the head
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
    ground(g, 40, 186, 133, `${seed}-gnd`);
  },
  monkey_male(g, seed) {
    // the KING read: upright, chest out, arms spread wide, plainly
    // BIGGER than the sitting monkey — one big standing silhouette
    mass(
      g,
      [
        [116, 30],
        [106, 38],
        [102, 50],
        [92, 58],
        [70, 68],
        [54, 82],
        [58, 92],
        [76, 82],
        [94, 76],
        [96, 100],
        [92, 122],
        [86, 146],
        [102, 146],
        [106, 124],
        [112, 120],
        [118, 124],
        [120, 146],
        [136, 146],
        [130, 120],
        [128, 98],
        [130, 76],
        [148, 82],
        [166, 92],
        [172, 82],
        [152, 66],
        [132, 56],
        [128, 46],
        [126, 34],
      ],
      `${seed}-body`,
    );
    // mane — dry fur strokes off the head
    detail(
      g,
      [
        [104, 44],
        [96, 52],
      ],
      `${seed}-m1`,
      4,
      true,
    );
    detail(
      g,
      [
        [128, 40],
        [136, 48],
      ],
      `${seed}-m2`,
      4,
      true,
    );
    detail(
      g,
      [
        [116, 28],
        [114, 20],
      ],
      `${seed}-m3`,
      3.5,
      true,
    );
    carve(
      g,
      [
        [106, 42],
        [122, 38],
      ],
      `${seed}-brow`,
      2.6,
    ); // the brow
    // hands
    hairline(
      g,
      [
        [56, 88],
        [46, 94],
      ],
      `${seed}-h1`,
      2.2,
    );
    hairline(
      g,
      [
        [168, 88],
        [178, 94],
      ],
      `${seed}-h2`,
      2.2,
    );
    ground(g, 60, 170, 148, `${seed}-gnd`);
  },
  feral_dog(g, seed) {
    // the LEAN read: head slung low and forward, jaw open, ribs carved,
    // belly tucked high, tail hung low
    mass(
      g,
      [
        [24, 96],
        [40, 88],
        [52, 82],
        [56, 74],
        [62, 82],
        [76, 76],
        [104, 72],
        [132, 76],
        [148, 82],
        [158, 96],
        [164, 114],
        [158, 117],
        [150, 102],
        [144, 96],
        [150, 130],
        [141, 130],
        [134, 98],
        [112, 96],
        [94, 100],
        [82, 102],
        [84, 131],
        [75, 131],
        [72, 102],
        [62, 94],
        [44, 100],
        [30, 106],
        [26, 100],
      ],
      `${seed}-body`,
    );
    // the open lower jaw
    detail(
      g,
      [
        [28, 106],
        [42, 102],
      ],
      `${seed}-jaw`,
      2.5,
    );
    // ribs, carved out of the flank
    carve(
      g,
      [
        [88, 84],
        [91, 95],
      ],
      `${seed}-r1`,
      1.8,
    );
    carve(
      g,
      [
        [98, 83],
        [101, 94],
      ],
      `${seed}-r2`,
      1.8,
    );
    carve(
      g,
      [
        [108, 83],
        [111, 93],
      ],
      `${seed}-r3`,
      1.8,
    );
    ground(g, 20, 176, 133, `${seed}-gnd`);
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
    // the two far legs, dimmer (depth)
    hairline(
      g,
      [
        [108, 84],
        [110, 136],
      ],
      `${seed}-l3`,
      4,
    );
    hairline(
      g,
      [
        [140, 80],
        [144, 136],
      ],
      `${seed}-l4`,
      4,
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
    ground(g, 18, 196, 140, `${seed}-gnd`);
  },
  river_rats(g, seed) {
    // the SWARM at the water's edge: three bodies among reeds, one
    // swimming — the weir, not the storehouse
    waveComb(g, 100, 122, 150, { seed: `${seed}-w1`, rows: 3 });
    waveComb(g, 62, 131, 90, { seed: `${seed}-w2`, rows: 2, opacity: 0.35 });
    hairline(
      g,
      [
        [150, 128],
        [156, 60],
      ],
      `${seed}-rd1`,
    );
    hairline(
      g,
      [
        [162, 126],
        [164, 56],
      ],
      `${seed}-rd2`,
    );
    hairline(
      g,
      [
        [172, 128],
        [178, 66],
      ],
      `${seed}-rd3`,
    );
    detail(
      g,
      [
        [156, 60],
        [151, 52],
      ],
      `${seed}-sh1`,
      2.5,
    );
    detail(
      g,
      [
        [164, 56],
        [160, 47],
      ],
      `${seed}-sh2`,
      2.5,
    );
    rat(g, 56, 100, 1.25, `${seed}-ra`);
    rat(g, 102, 110, 1, `${seed}-rb`);
    // the swimmer — only the humped back over the wave line
    mass(
      g,
      [
        [120, 118],
        [128, 110],
        [140, 108],
        [148, 114],
        [140, 118],
        [126, 119],
      ],
      `${seed}-rc`,
      1.2,
    );
    hairline(
      g,
      [
        [148, 114],
        [162, 112],
      ],
      `${seed}-rct`,
      1.4,
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
    // body: the S traced as one closed band (top edge out, bottom back)
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
        [50, 110],
        [62, 104],
        [78, 96],
        [92, 90],
        [110, 96],
        [130, 84],
        [148, 76],
        [162, 72],
        [172, 74],
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
      8,
      true,
    );
    hairline(
      g,
      [
        [156, 60],
        [154, 54],
      ],
      `${seed}-ear`,
      1.5,
    );
    // little legs gripping the beam
    hairline(
      g,
      [
        [70, 96],
        [68, 106],
      ],
      `${seed}-l1`,
      2.5,
    );
    hairline(
      g,
      [
        [100, 96],
        [100, 105],
      ],
      `${seed}-l2`,
      2.5,
    );
    hairline(
      g,
      [
        [128, 84],
        [128, 100],
      ],
      `${seed}-l3`,
      2.5,
    );
    hairline(
      g,
      [
        [148, 78],
        [150, 100],
      ],
      `${seed}-l4`,
      2.5,
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
