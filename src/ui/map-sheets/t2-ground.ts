// map-sheets/t2-ground.ts — the T2 VALLEY composition (map-spec §6). The SAME world
// as T0/T1, pulled back: the estate is DEMOTED to a compound pictogram in the north
// (its field-by-field interior retired — spec VG3/D1/D2), and the valley + Asagiri
// village fill the frame south, on the one coordinate system (valley.ts). No zone
// content here (nodes.ts) and no chrome (t2-sheet.ts): only place. Reuses the estate
// layout data (layout.ts) so no landmark moves (V5).

import type { Pt } from './geom';
import {
  brushStroke,
  fineLayer,
  hatchArea,
  inkLine,
  inkText,
  rng,
  stipple,
  sv,
  wash,
} from './brush';
import { groundWashBand, hachureBand, hillRange } from './terrain';
import { flowTicks, river } from './water';
import { ghostBunds } from './fields';
import { grassTufts, pine, treeMass } from './flora';
import {
  fallenRoof,
  gatehouse,
  roofMass,
  rubbleField,
  stoneMarker,
  wallRun,
  well,
} from './built';
import {
  banditCamp,
  ferryLanding,
  flankShoulder,
  hillShrine,
  houseCluster,
  marketSquare,
  millWheel,
  quarryScar,
  templeGlyph,
  villageLane,
} from './village';
import { FIELDS, GUEST, HILLS, PRECINCT, RIVER, ROADS } from './layout';
import {
  GORGE,
  RIVER_SOUTH,
  VALLEY,
  VALLEY_FEATURES,
  VALLEY_HILLS,
  VALLEY_NOTES,
  VALLEY_ROADS,
  VALLEY_WASHES,
  VALLEY_WOODS,
  VILLAGE,
} from './valley';

/** A work-worn valley road — a warm tapered under-stroke + a fine dash overlay. */
function road(
  art: SVGElement,
  pts: readonly Pt[],
  seed: string,
  ghost = false,
): void {
  if (ghost) {
    inkLine(art, pts, {
      seed: `${seed}-g`,
      w: 1.4,
      color: 'var(--ink-faint)',
      dash: '3 11',
      opacity: 0.5,
      amp: 3,
    });
    return;
  }
  brushStroke(art, pts, {
    seed: `${seed}-u`,
    w: 14,
    color: 'var(--steel-2)',
    opacity: 1,
    taperIn: 0.05,
    taperOut: 0.05,
    amp: 2.5,
  });
  // a continuous silver working-line ON the trodden ground so a road reads as ONE
  // route from end to end at fit (the blind read separated the estate & village
  // roads — V6); the dash rides on top of it, not instead of it
  inkLine(art, pts, {
    seed: `${seed}-c`,
    w: 1.5,
    color: 'var(--silver-dim)',
    opacity: 0.7,
    amp: 2.5,
  });
  inkLine(art, pts, {
    seed: `${seed}-d`,
    w: 1.8,
    color: 'var(--ink-soft)',
    dash: '12 8',
    opacity: 1,
    amp: 2.5,
  });
}

/** The reviser's red re-label note — the T2 reveal, on the sheet (spec §6.2). */
function reLabelNote(
  art: SVGElement,
  x: number,
  y: number,
  text: string,
): void {
  const g = sv('g');
  inkText(g, x, y, text, { size: 15, color: 'var(--shu)', opacity: 0.95 });
  art.append(g);
}

/**
 * Paint the whole valley. `revealed` drives the §6.2 honesty flip: the two estate
 * labels (main house ⇄ guest house) — the seal NAMES flip in the roster; here it
 * only decides whether the reviser's re-label note is drawn.
 */
export function paintValley(art: SVGElement, revealed: boolean): void {
  // ── 0 · substrate: the sheet plate + valley washes (spec L1) ──
  art.append(
    sv('rect', {
      x: '8',
      y: '8',
      width: String(VALLEY.w - 16),
      height: String(VALLEY.h - 16),
      fill: 'var(--steel-1)',
    }),
  );
  groundWashBand(art, [...VALLEY_WASHES.floor], {
    seed: 'v-floor',
    tone: 'var(--steel-2)',
    opacity: 0.32,
  });
  groundWashBand(art, [...VALLEY_WASHES.meadow], {
    seed: 'v-meadow',
    tone: 'var(--steel-hi)',
    opacity: 0.12,
  });
  groundWashBand(art, [...VALLEY_WASHES.village], {
    seed: 'v-village',
    tone: 'var(--steel-2)',
    opacity: 0.4,
  });
  // a sparse life-scatter across the valley floor so empty ground reads as PAPER
  {
    const lr = rng('valley2-life');
    for (let yy = 2160; yy < 4180; yy += 105) {
      for (let xx = 220; xx < 2960; xx += 105) {
        if (lr() > 0.5) continue;
        const px = xx + (lr() - 0.5) * 100;
        const py = yy + (lr() - 0.5) * 100;
        if (lr() < 0.6) {
          for (const lean of [-1, 1] as const) {
            inkLine(
              art,
              [
                [px, py],
                [px + lean * (1.4 + lr() * 1.4), py - 2.6 - lr() * 2],
              ],
              {
                seed: `v2l-${xx}-${yy}-${lean}`,
                w: 0.85,
                color: 'var(--ink-faint)',
                amp: 0.3,
                opacity: 0.9,
              },
            );
          }
        } else {
          art.append(
            sv('circle', {
              cx: px.toFixed(1),
              cy: py.toFixed(1),
              r: (0.8 + lr() * 0.6).toFixed(2),
              fill: 'var(--ink-faint)',
              opacity: '0.65',
            }),
          );
        }
      }
    }
  }

  // ── 1 · the valley walls: north hills + the flanks running south ──
  hillRange(art, HILLS.range1, { seed: 'v-hills-far', rows: 3 });
  hillRange(art, HILLS.range2, { seed: 'v-hills-near', rows: 2, scale: 0.7 });
  hillRange(art, HILLS.foothills, {
    seed: 'v-hills-foot',
    rows: 1,
    scale: 0.38,
  });
  flankShoulder(art, VALLEY_HILLS.westRidge, { seed: 'v-flankW' });
  flankShoulder(art, VALLEY_HILLS.eastRidge, { seed: 'v-flankE' });
  treeMass(art, VALLEY_WOODS.west, {
    seed: 'v-woodW',
    density: 0.6,
    floor: true,
  });
  treeMass(art, VALLEY_WOODS.east, {
    seed: 'v-woodE',
    density: 0.66,
    floor: true,
  });

  // ── 2 · the river — the valley's spine, N→S through the gorge to the crossing ──
  river(art, RIVER.centerline, {
    seed: 'v-riverN',
    widthProfile: [...RIVER.widthProfile],
  });
  river(art, RIVER_SOUTH.centerline, {
    seed: 'v-riverS',
    widthProfile: [...RIVER_SOUTH.widthProfile],
  });
  flowTicks(art, RIVER_SOUTH.centerline, { seed: 'v-flow', count: 8 });
  // the gorge — the pinching valley walls + the squared cutting nobody claims
  wash(art, GORGE.westWall, {
    seed: 'gorge-w',
    fill: 'var(--steel-0)',
    opacity: 0.5,
    amp: 4,
  });
  wash(art, GORGE.eastWall, {
    seed: 'gorge-e',
    fill: 'var(--steel-0)',
    opacity: 0.5,
    amp: 4,
  });
  hachureBand(art, GORGE.westWall, { seed: 'gorge-hw', side: 1 });
  hachureBand(art, GORGE.eastWall, { seed: 'gorge-he', side: -1 });
  {
    const [gx, gy] = GORGE.cutting;
    art.append(
      sv('rect', {
        x: String(gx - 8),
        y: String(gy - 5),
        width: '16',
        height: '10',
        fill: 'none',
        stroke: 'var(--silver-dim)',
        'stroke-width': '1',
        opacity: '0.8',
      }),
    );
  }

  // ── 3 · roads — they connect the valley to the wider world (V6) ──
  road(art, VALLEY_ROADS.toVillage, 'v-rd-village');
  road(art, VALLEY_ROADS.onward, 'v-rd-onward');
  // the estate's own exits, carried at valley scale: NW upstream to temple country,
  // and east over the hill to the next valley (so ALL three ways out read — V6)
  road(art, ROADS.upstream, 'v-rd-upstream');
  road(art, ROADS.eastTrack, 'v-rd-east');
  road(art, VALLEY_ROADS.ferryApproach, 'v-rd-ferry');
  road(art, VALLEY_ROADS.campTrack, 'v-rd-camp', true);
  for (let i = 0; i < VALLEY_ROADS.quarryTracks.length; i++)
    road(art, VALLEY_ROADS.quarryTracks[i]!, `v-rd-quarry${i}`, true);

  // ── 4 · the estate, DEMOTED to a compound pictogram in the north (VG3) ──
  paintDemotedEstate(art, revealed);

  // ── 4b · Asagiri's farmland — worked fields around the village so the valley
  //   floor reads as SETTLED, not empty (V4/V12). Two paddy masses + their bunds. ──
  for (const [poly, seed] of [
    [
      [
        [1560, 3220],
        [2160, 3280],
        [2200, 3820],
        [1620, 3860],
      ],
      'v-villfieldE',
    ],
    [
      [
        [900, 3860],
        [1560, 3900],
        [1520, 4160],
        [920, 4180],
      ],
      'v-villfieldS',
    ],
  ] as const) {
    wash(art, poly, {
      seed: `${seed}-w`,
      fill: 'var(--steel-hi)',
      opacity: 0.1,
      amp: 6,
    });
    hatchArea(art, poly, {
      seed: `${seed}-h`,
      angle: -14,
      spacing: 26,
      color: 'var(--silver-dim)',
      w: 0.9,
      opacity: 0.42,
    });
    ghostBunds(art, poly, { seed: `${seed}-b` });
  }

  // ── 5 · the valley's edges carry the trouble ──
  quarryScar(art, VALLEY_FEATURES.quarry.scar, { seed: 'v-quarry' });
  // a cleared patch of ground under the camp so the palisade reads clear of woods
  wash(
    art,
    [
      [150, 2630],
      [340, 2640],
      [340, 2800],
      [150, 2790],
    ],
    { seed: 'v-camp-clear', fill: 'var(--steel-1)', opacity: 0.9, amp: 5 },
  );
  banditCamp(art, VALLEY_FEATURES.camp.at, { seed: 'v-camp' });
  for (let i = 0; i < VALLEY_FEATURES.hillShrines.length; i++)
    hillShrine(art, VALLEY_FEATURES.hillShrines[i]!, { seed: `v-shrine${i}` });
  // the moved boundary stone — a field into Asagiri's land (the dispute, drawn)
  {
    const [sx, sy] = VALLEY_FEATURES.movedStone;
    const g = sv('g', {
      transform: `translate(${sx} ${sy}) scale(1.5) translate(${-sx} ${-sy})`,
    });
    art.append(g);
    stoneMarker(g, sx, sy, 'boundary', { seed: 'v-movedstone' });
    const fine = fineLayer(art);
    inkText(fine, sx + 16, sy - 8, '新?', {
      size: 11,
      color: 'var(--shu)',
      opacity: 0.85,
    });
  }

  // ── 6 · ASAGIRI — the village, downstream (VG5) ──
  villageLane(art, VILLAGE.street, { seed: 'v-street' });
  // the mill (on the river, above the village) + the ferry crossing
  millWheel(art, VILLAGE.mill.at, VILLAGE.mill.race, { seed: 'v-mill' });
  ferryLanding(art, VILLAGE.ferry.east, VILLAGE.ferry.west, {
    seed: 'v-ferry',
  });
  // the headman's walled yard, then the house clusters
  wallRun(art, [...VILLAGE.headman.yard, VILLAGE.headman.yard[0]!], {
    seed: 'v-headman-yard',
    state: 'neat',
  });
  roofMass(art, VILLAGE.headman.at[0], VILLAGE.headman.at[1], 48, 34, {
    seed: 'v-headman',
    style: 'hip',
  });
  for (let i = 0; i < VILLAGE.clusters.length; i++) {
    const c = VILLAGE.clusters[i]!;
    houseCluster(art, c.at, {
      seed: `v-cluster${i}`,
      count: c.count,
      spread: c.spread,
    });
  }
  // the well, market, temple
  well(art, VILLAGE.well[0], VILLAGE.well[1], { seed: 'v-well' });
  marketSquare(art, VILLAGE.market.ground, { seed: 'v-market' });
  templeGlyph(art, VILLAGE.temple.at, VILLAGE.temple.torii, {
    seed: 'v-temple',
  });

  // ── 7 · the exit notes + the reveal re-label ──
  for (const n of VALLEY_NOTES)
    inkText(art, n.x, n.y, n.text, {
      size: 15,
      color: 'var(--ink-faint)',
      opacity: 0.85,
      ...(n.vertical ? { vertical: true } : {}),
    });
  if (revealed) {
    reLabelNote(
      art,
      PRECINCT.greatGate.at[0] - 150,
      PRECINCT.greatGate.at[1] + 120,
      '改・本邸',
    );
    reLabelNote(
      art,
      GUEST.house.at[0] + 60,
      GUEST.house.at[1] + 70,
      '改・客殿',
    );
  }
}

/** The estate as ONE compound pictogram (spec VG3): the precinct ring + the RUIN
 *  footprint (the largest single built mass in the valley) + the guest house small
 *  in its corner + the NEW gatehouse (gold) — its field-by-field interior retired. */
function paintDemotedEstate(art: SVGElement, revealed: boolean): void {
  // the worked fields as a single pattern mass (D2 — not bund-by-bund): the ghost
  // extent as faint bund traces (the estate SHRANK — V6-analog), the worked home
  // paddy as a light hatched wash so it reads as FIELD, never a flat hole.
  ghostBunds(art, FIELDS.ghostBunds, { seed: 'v-ghostfields' });
  {
    const paddy: Pt[] = [
      [1440, 1560],
      [1940, 1550],
      [1960, 1800],
      [1470, 1810],
    ];
    wash(art, paddy, {
      seed: 'v-paddy-w',
      fill: 'var(--steel-hi)',
      opacity: 0.12,
      amp: 6,
    });
    hatchArea(art, paddy, {
      seed: 'v-paddy-h',
      angle: -16,
      spacing: 22,
      color: 'var(--silver-dim)',
      w: 0.9,
      opacity: 0.5,
    });
  }

  // the precinct ground + robbed wall ring + the ruin's fallen mass (the largest)
  wash(art, [...PRECINCT.wall], {
    seed: 'v-prec-ground',
    fill: 'var(--steel-2)',
    opacity: 0.28,
    amp: 6,
  });
  rubbleField(art, PRECINCT.rubble, { seed: 'v-rubble' });
  wallRun(art, PRECINCT.wall, { seed: 'v-prec-wall', state: 'robbed' });
  for (const s of PRECINCT.standing)
    wallRun(art, s, { seed: `v-prec-stand-${s[0]![0]}`, state: 'standing' });
  // more BROKEN standing masonry around the ring (west + south) so the enclosure
  // reads as a RUIN, not an intact wall — dry-brush runs with gaps + rubble spill
  // (the blind read the dotted footings as a live boundary; V3).
  for (const s of [
    [
      [1170, 1080],
      [1160, 820],
      [1150, 565],
    ],
    [
      [1350, 1500],
      [1560, 1512],
      [1780, 1530],
    ],
  ] as const) {
    wallRun(art, s, { seed: `v-prec-broke-${s[0][0]}`, state: 'standing' });
  }
  for (const f of PRECINCT.fallenRoofs)
    fallenRoof(art, f.x, f.y, f.w, f.h, {
      seed: `v-fallen-${f.x}`,
      angleDeg: f.angleDeg,
    });
  // a couple of feral pines in the old ground so the ruin reads overgrown
  pine(art, 1592, 1128, 10, { seed: 'v-garden-pine-1' });
  pine(art, 1768, 1096, 9, { seed: 'v-garden-pine-2' });
  grassTufts(art, PRECINCT.innerGardenOld, {
    seed: 'v-old-garden',
    density: 1.2,
  });
  // broken, overgrown ground THROUGH the ruin core so the great compound reads as
  // RUINED (not an intact settlement) at fit — the blind pass read it as buildings
  // until this landed (V3). Rubble + grass breaching, over the fallen halls.
  {
    const core: Pt[] = [
      [1470, 660],
      [1980, 620],
      [2000, 1015],
      [1490, 1055],
    ];
    rubbleField(art, core, { seed: 'v-ruin-core' });
    grassTufts(art, core, { seed: 'v-ruin-grass', density: 0.7 });
  }

  // the guest house — small, in the ruin's SE corner (its neat wall = the repaired
  // stretch of the precinct's own circuit). Drawn as a compact pictogram, not the
  // winged interior.
  wallRun(art, [...GUEST.wall, GUEST.wall[0]!], {
    seed: 'v-guest-wall',
    state: 'neat',
  });
  roofMass(art, GUEST.house.at[0], GUEST.house.at[1], 72, 48, {
    seed: 'v-guest-hall',
    style: 'hip',
  });
  roofMass(art, GUEST.house.at[0] - 46, GUEST.house.at[1] + 6, 34, 24, {
    seed: 'v-guest-wW',
    style: 'gable',
    angleDeg: 90,
  });
  roofMass(art, GUEST.house.at[0] + 46, GUEST.house.at[1] + 6, 34, 24, {
    seed: 'v-guest-wE',
    style: 'gable',
    angleDeg: 90,
  });
  well(art, GUEST.well[0], GUEST.well[1], { seed: 'v-guest-well' });

  // the NEW gatehouse — RAISED in fresh gold work at the old great gate: the
  // estate's new face to the valley (T2's R5 works). Scaffold ticks + cleared ground.
  {
    const [gx, gy] = PRECINCT.greatGate.at;
    wash(
      art,
      [
        [gx - 70, gy - 20],
        [gx + 70, gy - 20],
        [gx + 60, gy + 60],
        [gx - 60, gy + 60],
      ],
      {
        seed: 'v-gate-cleared',
        fill: 'var(--steel-hi)',
        opacity: 0.35,
        amp: 3,
      },
    );
    gatehouse(art, [gx, gy], PRECINCT.greatGate.angleDeg, {
      seed: 'v-newgate',
      scale: 2.0,
    });
    // scaffold poles — the works still fresh
    for (const dx of [-52, 52]) {
      inkLine(
        art,
        [
          [gx + dx, gy + 40],
          [gx + dx + 6, gy - 30],
        ],
        {
          seed: `v-scaf${dx}`,
          w: 1.4,
          color: 'var(--gold-dim)',
          amp: 0.5,
          opacity: 0.9,
        },
      );
    }
    // the one-more-petal crest on the new gatehouse (the wrong thing, answered by
    // the old plans that come WITH the reveal)
    if (revealed) {
      const cy = gy - 8;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        art.append(
          sv('circle', {
            cx: (gx + Math.cos(a) * 5).toFixed(1),
            cy: (cy + Math.sin(a) * 5).toFixed(1),
            r: '2.2',
            fill: 'none',
            stroke: 'var(--gold)',
            'stroke-width': '0.8',
            opacity: '0.85',
          }),
        );
      }
    }
  }

  // a faint contour so the estate ground reads raised above the valley floor
  stipple(
    art,
    [
      [1150, 540],
      [2360, 540],
      [2380, 1540],
      [1150, 1560],
    ],
    {
      seed: 'v-estate-scree',
      step: 70,
      prob: 0.14,
      r: 1.2,
      color: 'var(--ink-faint)',
      opacity: 0.5,
    },
  );
}
