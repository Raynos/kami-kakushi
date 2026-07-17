// map-sheets/reveal.ts — the T0 rung-reveal mechanism (ADR-151): the sheet is the
// family's OWN survey, so fog of war is UNSURVEYED PAPER — where nobody has walked
// since the fall, the drawing simply stops at a scrawled survey edge. Ghost chips
// (未 "not yet") tease the next rung's ground; rumor notes hint in the fiction's
// voice (ENGLISH — the FB-181/183 strip policy: no unexplained kanji marginalia on
// a player-bound sheet). ALL of this is data: the T0 build plan locks the real
// ladder/regions by editing REVEAL + RUNG_LADDER, never this painter.

import type { Pt } from './geom';
import { inkText, rng, scrawl, sv } from './brush';
import { RUNG_LADDER } from './nodes';
import { T0_WINDOW } from './layout';

export interface RevealNote {
  readonly x: number;
  readonly y: number;
  readonly text: string;
}

export interface RevealStage {
  readonly rung: number;
  /** fog = window minus this poly (the survey's known ground), OR… */
  readonly known?: readonly Pt[];
  /** …fog = just these blobs (late stages: only pockets stay unwalked) */
  readonly blobs?: readonly (readonly Pt[])[];
  /** dashed 未 chips at the frontier — the next rung's ground, teased unnamed */
  readonly ghosts?: readonly Pt[];
  /** rumor notes where known things run into fog (fiction voice, English) */
  readonly notes?: readonly RevealNote[];
}

/** The T0 reveal stages (ADR-151 placeholder geography — the illustration's). */
export const REVEAL: readonly RevealStage[] = [
  {
    rung: 1,
    // FB-384 — the SW pocket covers the home paddies (unlocked AT R1): reachable
    // ground is never under fog. No ghost chip: the live sheet's fogFrontier
    // already marks the next ground (field-margins) with its own 未測.
    known: [
      [1830, 900],
      [2420, 900],
      [2450, 1700],
      [2050, 1740],
      [1545, 1775],
      [1555, 1545],
      [1820, 1500],
    ],
    notes: [
      // FB-413 — rides 18 under the village note (layout.ts SHEET_NOTES),
      // which moved up 24 for fog-displacement margin; keep the pair together.
      { x: 2160, y: 1706, text: 'beyond this, not yet walked' },
      { x: 1730, y: 1290, text: 'the old fields, they say' },
    ],
  },
  {
    rung: 3,
    known: [
      [1500, 880],
      [2440, 880],
      [2450, 1740],
      [1180, 1780],
      [1240, 1440],
      [1500, 1200],
    ],
    ghosts: [
      [585, 1105],
      [2565, 1145],
    ],
    notes: [
      { x: 1080, y: 1360, text: 'the water comes from a weir' },
      { x: 2450, y: 1000, text: 'woods, eastward' },
    ],
  },
  {
    rung: 5,
    blobs: [
      [
        [980, 350],
        [1780, 350],
        [1820, 700],
        [1760, 1000],
        [1180, 1010],
        [960, 760],
      ],
      [
        [1800, 360],
        [2360, 350],
        [2320, 610],
        [1850, 620],
      ],
    ],
    ghosts: [
      [1650, 820],
      [2095, 470],
    ],
    notes: [{ x: 1200, y: 980, text: 'an old compound stood here, they say' }],
  },
  { rung: 7 },
];

const poly = (pts: readonly Pt[]): string =>
  pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ') + ' Z';

/** The fog stage for `rung` — the nearest REVEAL stage at-or-below it (stages
 *  are sparse data). Null ⇒ no fog (the full sheet). ONE lookup for both the
 *  DEV previewer and the live map. */
export function stageAtRung(rung: number): RevealStage | null {
  const stages = REVEAL.filter((s) => s.rung <= rung);
  return stages.length > 0 ? stages[stages.length - 1]! : null;
}

/** Zones visible at `rung` (RUNG_LADDER absent ⇒ always visible). */
export function zonesAtRung(rung: number): (id: string) => boolean {
  return (id) => (RUNG_LADDER[id] ?? 1) <= rung;
}

/** Paint the rung's fog + frontier onto the sheet. Returns the fog group (the
 *  caller removes it to change stages). `null` stage ⇒ nothing (the full sheet). */
export function paintReveal(
  svg: SVGSVGElement,
  art: SVGElement,
  seals: SVGElement,
  stage: RevealStage | null,
): SVGGElement | null {
  // FB-396 reset — every stage repaint re-evaluates every sheet note (the DEV
  // previewer swaps stages in place; a note hidden by a prior stage must not
  // stay hidden on a stage that reveals its ground).
  for (const note of svg.querySelectorAll('.ms-sheet-note'))
    note.removeAttribute('visibility');
  if (!stage || (!stage.known && !stage.blobs)) return null;
  const fr = T0_WINDOW;
  const uid = `msr-${stage.rung}-${Math.abs(fr.x)}`;
  const defs = svg.querySelector('defs');
  if (defs && !defs.querySelector(`#${uid}`)) {
    const filt = sv('filter', { id: uid });
    filt.append(
      sv('feTurbulence', {
        type: 'fractalNoise',
        baseFrequency: '0.012',
        numOctaves: '2',
        seed: '11',
        result: 'n',
      }),
      sv('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: '14' }),
    );
    defs.append(filt);
  }
  const fog = sv('g', {
    class: 'ms-reveal',
    filter: `url(#${uid})`,
  }) as SVGGElement;
  art.after(fog);
  // FB-390/391 — the family OWNS the document: the north arrow + scale bar read
  // even on unsurveyed paper. They ride their own lift group (t0-sheet
  // paintFurniture), raised ABOVE the fog — never a hole in it (a hole showed
  // the world art beneath). Idempotent across stage repaints.
  for (const lift of svg.querySelectorAll(
    ':scope > g .ms-furn-lift, :scope > .ms-furn-lift',
  ))
    fog.after(lift);
  // FB-396 — sheet notes are FOG-ATOMIC: a note anchored under the fog hides
  // entirely (its tail must not poke out of the paper); one on surveyed ground
  // lifts above the fog and reads WHOLE (the mask otherwise slices sentences
  // mid-glyph — "to the village — half a r…").
  for (const note of Array.from(svg.querySelectorAll('.ms-sheet-note'))) {
    const nx = Number(note.getAttribute('x'));
    const ny = Number(note.getAttribute('y'));
    if (isFogged(stage, nx, ny)) note.setAttribute('visibility', 'hidden');
    else fog.after(note);
  }

  const paths: {
    d: string;
    rule: 'evenodd' | 'nonzero';
    edge: readonly Pt[];
  }[] = [];
  if (stage.known) {
    // FB-378/385 — the fog covers the WHOLE window, edge to edge (the old 20-unit
    // inset left an unfogged ring). Beyond-the-window world art can't leak at all
    // since the t0-sheet window clip; off-sheet reads as off-sheet. FB-390/391 —
    // NO furniture holes either: a hole showed the world art beneath the north
    // arrow / scale bar (the corner leaks); the furniture LIFTS above the fog
    // instead (the `.ms-furn-lift` re-append below).
    paths.push({
      d: `M${fr.x} ${fr.y} H${fr.x + fr.w} V${fr.y + fr.h} H${fr.x} Z ${poly(stage.known)}`,
      rule: 'evenodd',
      edge: stage.known,
    });
  }
  for (const b of stage.blobs ?? [])
    paths.push({ d: poly(b), rule: 'nonzero', edge: b });

  for (const p of paths) {
    fog.append(
      sv('path', {
        d: p.d,
        fill: 'var(--steel-1)',
        'fill-rule': p.rule,
        'fill-opacity': '0.985',
      }),
    );
    // the survey edge — a scrawled frontier line where the drawing stops
    fog.append(
      sv('path', {
        d: scrawl([...p.edge, p.edge[0]!], `msr-edge-${stage.rung}`, 3),
        fill: 'none',
        stroke: 'var(--silver-faint)',
        'stroke-width': '2.4',
        'stroke-dasharray': '14 9 4 9',
      }),
    );
  }

  // setting-out pegs — sparse surveyor's crosses on the blank paper
  const pr = rng(`msr-pegs-${stage.rung}`);
  for (let i = 0; i < 30; i++) {
    const x = fr.x + 40 + pr() * (fr.w - 80);
    const y = fr.y + 40 + pr() * (fr.h - 80);
    const inFog = stage.known
      ? !pointInBox(x, y, stage.known)
      : (stage.blobs ?? []).some((b) => pointInBox(x, y, b));
    if (!inFog) continue;
    for (const [dx, dy, dx2, dy2] of [
      [-4, 0, 4, 0],
      [0, -4, 0, 4],
    ] as const) {
      fog.append(
        sv('line', {
          x1: String(x + dx),
          y1: String(y + dy),
          x2: String(x + dx2),
          y2: String(y + dy2),
          stroke: 'var(--silver-faint)',
          'stroke-width': '1',
        }),
      );
    }
  }

  // ghost chips (未) + rumor notes ride the SEALS layer (crisp, above fog)
  const frontier = sv('g', { class: 'ms-reveal' }) as SVGGElement;
  seals.append(frontier);
  for (const [gx, gy] of stage.ghosts ?? []) {
    frontier.append(
      sv('rect', {
        x: String(gx - 23),
        y: String(gy - 22),
        width: '46',
        height: '44',
        fill: 'var(--steel-2)',
        'fill-opacity': '0.5',
        stroke: 'var(--silver-faint)',
        'stroke-width': '1.6',
        'stroke-dasharray': '5 6',
      }),
    );
    const t = sv('text', {
      x: String(gx),
      y: String(gy + 10),
      'text-anchor': 'middle',
      class: 't0v2-kanji',
      opacity: '0.45',
    });
    t.textContent = '未';
    frontier.append(t);
  }
  for (const n of stage.notes ?? []) {
    inkText(frontier, n.x, n.y, n.text, {
      size: 13,
      color: 'var(--ink-soft)',
      opacity: 0.9,
    });
  }
  // the caller removes BOTH groups by class; return the fog for convenience
  return fog;
}

/** Is world point (x,y) under `stage`'s fog? (FB-380 — seal painters consult this
 *  so nothing under unsurveyed paper is previewed by name.) No stage ⇒ no fog. */
export function isFogged(
  stage: RevealStage | null,
  x: number,
  y: number,
): boolean {
  if (!stage) return false;
  if (stage.known) return !pointInBox(x, y, stage.known);
  return (stage.blobs ?? []).some((b) => pointInBox(x, y, b));
}

/** cheap bbox containment (the reveal is an illustration mask, not physics) */
function pointInBox(x: number, y: number, p: readonly Pt[]): boolean {
  const xs = p.map((q) => q[0]);
  const ys = p.map((q) => q[1]);
  return (
    x > Math.min(...xs) &&
    x < Math.max(...xs) &&
    y > Math.min(...ys) &&
    y < Math.max(...ys)
  );
}
