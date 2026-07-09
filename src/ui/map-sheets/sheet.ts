// map-sheets/sheet.ts — the shared review-sheet SHELL (DEV fold): the full-screen
// modal, pan/zoom (viewBox-driven), the zone-seal layer, the roster/detail pane and
// the night-rounds rail. The GROUND is painted by the per-tier compositions
// (t0-sheet.ts / t1-sheet.ts) over the ONE geography (layout.ts); this module owns
// everything that is chrome, not place. Replaces dev-t0v2-map.ts's modal wholesale
// (same public API: openT0V2Map / openT1Map).

import { rng, scrawl, sv, tip } from './brush';
import type { Pt } from './geom';
import { ANCHORS, NIGHT_ROUTE, NIGHT_ROUTE_T1, T0_WINDOW, WORLD } from './layout';
import { NIGHT_ROUTE_T2, VALLEY } from './valley';
import type { SheetNode, Tier, ZoneKind } from './nodes';
import { KIND_META, rosterFor, T1_IDS, T1_NODES, T1_NOTES, T2_IDS } from './nodes';
import { paintReveal, REVEAL, zonesAtRung } from './reveal';
import { paintT0Ground } from './t0-sheet';
import { paintT1Ground } from './t1-sheet';
import { paintT2Ground } from './t2-sheet';

function hd<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

interface Frame {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

function frameFor(tier: Tier): Frame {
  if (tier === 'T2') return { x: VALLEY.x, y: VALLEY.y, w: VALLEY.w, h: VALLEY.h };
  return tier === 'T0' ? T0_WINDOW : { x: 0, y: 0, w: WORLD.w, h: WORLD.h };
}

/** Seal world position: the layout anchor unless the ground painter refined it
 *  (room seals snap to the drawn geometry — single source is the drawing). */
function posFor(id: string, overrides: ReadonlyMap<string, Pt>): { x: number; y: number } {
  const o = overrides.get(id);
  if (o) return { x: o[0], y: o[1] };
  const a = ANCHORS[id];
  return a ? { x: a.x, y: a.y } : { x: 0, y: 0 };
}

// ── the sheet painter ─────────────────────────────────────────────────────────

let uidCounter = 0;

function paintSheet(svg: SVGSVGElement, nodeEls: Map<string, SVGGElement>, tier: Tier): void {
  const uid = `t0v2-${++uidCounter}`;
  const defs = sv('defs');
  const filter = sv('filter', {
    id: `${uid}-w`,
    x: '-5%',
    y: '-5%',
    width: '110%',
    height: '110%',
  });
  filter.append(
    sv('feTurbulence', {
      type: 'fractalNoise',
      baseFrequency: '0.009',
      numOctaves: '2',
      seed: '7',
      result: 'n',
    }),
    sv('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: '4' }),
  );
  defs.append(filter);
  svg.append(defs);

  const frame = frameFor(tier);
  // clip the ART to the sheet's inner border — the world continues past the T0
  // window, and a survey's drawing never crosses its own frame
  const clip = sv('clipPath', { id: `${uid}-clip` });
  clip.append(
    sv('rect', {
      x: String(frame.x + 20),
      y: String(frame.y + 20),
      width: String(frame.w - 40),
      height: String(frame.h - 40),
    }),
  );
  defs.append(clip);
  const art = sv('g', { filter: `url(#${uid}-w)`, 'clip-path': `url(#${uid}-clip)` });
  const seals = sv('g'); // crisp text/click layer
  svg.append(art, seals);

  const overrides =
    tier === 'T2'
      ? paintT2Ground(art, frame)
      : tier === 'T1'
        ? paintT1Ground(art, frame)
        : paintT0Ground(art, frame);

  // the night-rounds rail — drawn once, revealed when 夜 is selected
  const rail = sv('g', { class: 't0v2-nightrail' });
  const route = tier === 'T2' ? NIGHT_ROUTE_T2 : tier === 'T1' ? NIGHT_ROUTE_T1 : NIGHT_ROUTE;
  rail.append(
    sv('path', {
      d: scrawl(route, 'rail', 3.5),
      fill: 'none',
      stroke: 'var(--shu)',
      'stroke-width': '2',
      'stroke-dasharray': '4 9',
      opacity: '0.85',
    }),
  );
  const lantern = sv('circle', {
    cx: String(route[0]![0]),
    cy: String(route[0]![1]),
    r: '7',
    fill: 'none',
    stroke: 'var(--shu)',
    'stroke-width': '1.8',
  });
  tip(lantern, 'The round begins and ends at its post by the gate');
  rail.append(lantern);
  art.append(rail);

  drawSealLayer(seals, nodeEls, tier, overrides);
}

function drawSealLayer(
  seals: SVGElement,
  nodeEls: Map<string, SVGGElement>,
  tier: Tier,
  overrides: ReadonlyMap<string, Pt>,
): void {
  // collision relief for the house cluster (L9, blind pass 2's "sole place the
  // sheet stops feeling composed"): each ROOM seal's caption tries below, then
  // above — a spot is taken if it overlaps any seal chip or an already-placed
  // caption — and suppresses when neither fits (the name still rides the
  // tooltip + the roster). Greedy in roster order; fully deterministic.
  const roster = rosterFor(tier);
  const pos = new Map(roster.map((n) => [n.id, posFor(n.id, overrides)]));
  interface Box {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  }
  const hits = (a: Box, b: Box): boolean =>
    a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
  // chip boxes first (inflated so captions never kiss a neighbouring seal);
  // ownerIx lets a seal's caption candidates skip ITS OWN chip box
  const taken: Box[] = roster.map((n) => {
    const p = pos.get(n.id)!;
    const r = ANCHORS[n.id]?.room === true;
    return {
      x0: p.x - (r ? 24 : 30),
      y0: p.y - (r ? 22 : 28),
      x1: p.x + (r ? 24 : 30),
      y1: p.y + (r ? 22 : 28),
    };
  });
  const chipCount = taken.length;
  const capBoxFor = (nx: number, ny: number, bh: number, above: boolean): Box =>
    above
      ? { x0: nx - 72, y0: ny - bh / 2 - 52, x1: nx + 72, y1: ny - bh / 2 - 4 }
      : { x0: nx - 72, y0: ny + bh / 2 + 4, x1: nx + 72, y1: ny + bh / 2 + 52 };
  for (let ri = 0; ri < roster.length; ri++) {
    const n = roster[ri]!;
    const { x: nx, y: ny } = pos.get(n.id)!;
    const room = ANCHORS[n.id]?.room === true;
    // ALL seals run the pass now (blind pass 3: Gate/Night-rounds captions
    // collided at fit) — non-room seals never suppress, they just flip above
    let capAbove = false;
    let capSuppressed = false;
    {
      const bhr = room ? 32 : 44;
      const clear = (box: Box): boolean =>
        !taken.some((b, bi) => (bi === ri && bi < chipCount ? false : hits(b, box)));
      const below = capBoxFor(nx, ny, bhr, false);
      const above = capBoxFor(nx, ny, bhr, true);
      if (clear(below)) {
        taken.push(below);
      } else if (clear(above)) {
        capAbove = true;
        taken.push(above);
      } else if (room) {
        capSuppressed = true;
      } else {
        taken.push(below); // crowded both ways — a non-room caption stays below
      }
    }
    const g = sv('g', {
      class: `t0v2-node t0v2-k-${n.kind}${room ? ' t0v2-room' : ''}`,
    }) as SVGGElement;
    g.dataset.zone = n.id;
    seals.append(g);
    nodeEls.set(n.id, g);

    const bw = room ? 34 : 46;
    const bh = room ? 32 : 44;
    // invisible hit-target spanning seal + caption (the ezu WebKit-gap lesson)
    g.append(
      sv('rect', {
        x: String(nx - 70),
        y: String(ny - bh / 2 - 8),
        width: '140',
        height: String(bh + 62),
        fill: 'transparent',
      }),
    );
    const tilt = ((rng(`tilt-${n.id}`)() - 0.5) * 3).toFixed(2);
    g.append(
      sv('rect', {
        x: String(nx - bw / 2),
        y: String(ny - bh / 2),
        width: String(bw),
        height: String(bh),
        transform: `rotate(${tilt} ${nx} ${ny})`,
        class: 't0v2-sealbox',
      }),
    );
    g.append(
      sv(
        'text',
        {
          x: String(nx),
          y: String(ny + (room ? 8 : 10)),
          'text-anchor': 'middle',
          class: 't0v2-kanji',
        },
        n.kanji,
      ),
    );
    // caption: on ROOM seals it rides the zoom-gated detail register so the
    // house never drowns in chips at fit view (spec L9/L10). The old 戦/人/怪
    // mark rows are GONE (FB drain 2026-07-07: player-illegible clutter) —
    // that state lives in the detail pane, where it reads.
    const detail = room ? sv('g', { class: 'ms-fine' }) : sv('g');
    g.append(detail);
    // captions stack downward by default; flipped seals stack upward instead
    const capY = capAbove ? ny - bh / 2 - 34 : ny + bh / 2 + 22;
    if (!capSuppressed) {
      const cap = sv(
        'text',
        {
          x: String(nx),
          y: String(capY),
          'text-anchor': 'middle',
          class: 't0v2-caption',
        },
        n.name.replace(/^The /, ''),
      );
      detail.append(cap);
    }
    tip(g, n.name);
  }
}

// ── the detail pane ───────────────────────────────────────────────────────────

function renderOverview(aside: HTMLElement, select: (id: string) => void, tier: Tier): void {
  const roster = rosterFor(tier);
  aside.textContent = '';
  const titleFor: Record<Tier, string> = {
    T0: 'T0 — the zone sheet',
    T1: 'T1 — the zone sheet',
    T2: 'T2 — the valley sheet',
  };
  aside.append(hd('div', 't0v2-aside-title', titleFor[tier]));
  const srcFor: Record<Tier, string> = {
    T0:
      'Source: docs/story-bible/tiers/t0.md (walked whole, 2026-07-07). DEV survey-sheet ' +
      'viewer — the live map draws this same geometry through map-variants/sheet-map.ts ' +
      '(ADR-151). One geography: this sheet is a WINDOW of the T1 world. ' +
      'Drag to pan · scroll to zoom · roster rows fly to the zone.',
    T1:
      'Source: docs/story-bible/tiers/t1.md (walked whole, 2026-07-07). The SAME world as ' +
      'T0, seen whole and one-to-two years on: the land at true extent, the wings opened, ' +
      "the re-survey's red recording what the tier changed. The ruin shows NO new work — " +
      'its reveal is T2. Drag to pan · scroll to zoom.',
    T2:
      'Source: docs/story-bible/tiers/t2.md + map-spec §6. The SAME world PULLED BACK to the ' +
      'valley: the estate demoted to one compound (the ruin now named the Main house — the ' +
      'reveal), Asagiri village downstream on the river. A mura-ezu, wide. Drag to pan · ' +
      'scroll to zoom.',
  };
  aside.append(hd('div', 't0v2-aside-src', srcFor[tier]));
  const counts = roster.reduce<Record<ZoneKind, number>>(
    (acc, n) => ((acc[n.kind] = (acc[n.kind] ?? 0) + 1), acc),
    { estate: 0, grounds: 0, combat: 0, activity: 0, scenery: 0 },
  );
  const kindLine =
    `${counts.estate} estate · ${counts.grounds} grounds · ${counts.combat} combat zones · ` +
    `${counts.activity} combat activity · ${counts.scenery} scenery`;
  const sumFor: Record<Tier, string> = {
    T0:
      `${roster.length} nodes — ${kindLine}. Shapes: 3 grindable loops · 1 authored chain · ` +
      '1 repeatable mini-dungeon (the Night rounds).',
    T1:
      `${roster.length} nodes (${T1_NODES.length} new in T1) — ${kindLine}. Shapes: grindable ` +
      'loops (the pools RETIRE at R4; the shallows; the carried T0 loops) · authored chains ' +
      '(the let-go terraces; the boar chain) · the R6 wolf set-piece in daylight · the Night ' +
      'rounds, grown building by building.',
    T2:
      `${roster.length} nodes (the valley) — ${kindLine}. The estate demotes to three compound ` +
      'seals; the village + valley zones join. First HUMAN combat (the mountain-dogs’ camp); ' +
      'the village reputation track opens at zero.',
  };
  aside.append(hd('div', 't0v2-aside-sum', sumFor[tier]));
  // the full roster, grouped by kind — a completeness checklist for the review
  const order: readonly ZoneKind[] = ['estate', 'grounds', 'combat', 'activity', 'scenery'];
  for (const kind of order) {
    const group = roster.filter((n) => n.kind === kind);
    if (group.length === 0) continue;
    aside.append(hd('div', 't0v2-roster-head', `${KIND_META[kind].chip} ${KIND_META[kind].label}`));
    for (const n of group) {
      const row = hd('button', 't0v2-roster-row');
      row.type = 'button';
      row.append(hd('span', 't0v2-roster-kanji', n.kanji), hd('span', undefined, n.name));
      if ((tier === 'T1' && T1_IDS.has(n.id)) || (tier === 'T2' && T2_IDS.has(n.id)))
        row.append(hd('span', 't0v2-roster-new', '新'));
      row.addEventListener('click', () => select(n.id));
      aside.append(row);
    }
  }
}

function renderDetail(aside: HTMLElement, n: SheetNode, back: () => void, tier: Tier): void {
  aside.textContent = '';
  const backBtn = hd('button', 't0v2-back', '← all zones');
  backBtn.type = 'button';
  backBtn.addEventListener('click', back);
  aside.append(backBtn);

  const head = hd('div', 't0v2-detail-head');
  head.append(hd('span', 't0v2-detail-kanji', n.kanji), hd('span', 't0v2-detail-name', n.name));
  aside.append(head);
  const chips = hd('div', 't0v2-chiprow');
  chips.append(
    hd(
      'div',
      `t0v2-chip t0v2-chip-${n.kind}`,
      `${KIND_META[n.kind].chip} · ${KIND_META[n.kind].label}`,
    ),
  );
  if (tier === 'T1' && T1_IDS.has(n.id))
    chips.append(hd('div', 't0v2-chip t0v2-chip-new', '新 · new in T1'));
  if (tier === 'T2') chips.append(hd('div', 't0v2-chip t0v2-chip-new', '新 · the valley'));
  aside.append(chips);
  aside.append(hd('p', 't0v2-detail-blurb', n.blurb));

  const section = (label: string, items: readonly string[]): void => {
    aside.append(hd('div', 't0v2-detail-label', label));
    const ul = hd('ul', 't0v2-detail-list');
    for (const item of items) {
      const li = hd('li', undefined, item.replace(/^hidden: /, ''));
      if (item.startsWith('hidden:')) {
        li.prepend(hd('span', 't0v2-hidden-tag', '隠 hidden · '));
      }
      ul.append(li);
    }
    aside.append(ul);
  };
  section('Actions', n.actions);
  section("Who's there", n.who);
  if (n.combat) {
    aside.append(hd('div', 't0v2-detail-label', 'Combat shape'));
    aside.append(hd('p', 't0v2-detail-combat', n.combat));
  }
  aside.append(hd('div', 't0v2-detail-label', 'The wrong thing'));
  aside.append(hd('p', 't0v2-detail-wrong', `怪 ${n.wrong}`));
  const t1note = T1_NOTES[n.id];
  if (tier === 'T1' && t1note) {
    aside.append(hd('div', 't0v2-detail-label', 'What T1 changes here'));
    aside.append(hd('p', 't0v2-detail-combat', t1note));
  }
}

// ── the modal ─────────────────────────────────────────────────────────────────

const CSS = `
  .t0v2-card { max-width:none; width:100%; height:calc(100dvh - 2rem); overflow:hidden;
    display:flex; flex-direction:column; }
  .t0v2-head { display:flex; align-items:center; gap:.6rem; flex-wrap:wrap; }
  .t0v2-controls { display:flex; gap:.3rem; margin-left:auto; margin-right:2.4rem; align-items:center; }
  .t0v2-pill, .t0v2-zoom { font:12px/1.4 ui-monospace,SFMono-Regular,monospace; cursor:pointer;
    border:1px solid var(--silver-faint); border-radius:3px; padding:.15rem .5rem;
    background:var(--steel-2); color:var(--ink-soft); }
  .t0v2-pill[data-on] { background:var(--gold-dim); color:var(--void); border-color:var(--gold); font-weight:700; }
  .t0v2-zoom:hover, .t0v2-pill:hover { color:var(--ink); border-color:var(--silver); }
  .t0v2-zoomgroup { display:flex; gap:.2rem; margin-right:.5rem; }
  .t0v2-body { flex:1 1 auto; min-height:0; display:flex; gap:.8rem; margin-top:.8rem; }
  .t0v2-mapwrap { flex:1 1 auto; min-width:0; position:relative; border:1px solid var(--silver-faint);
    background:var(--void); overflow:hidden;
    user-select:none; -webkit-user-select:none; } /* drag-pan must never select SVG text */
  .t0v2-mapwrap svg { display:block; width:100%; height:100%; cursor:grab; touch-action:none; }
  .t0v2-mapwrap svg.t0v2-panning { cursor:grabbing; }
  /* maximize: fill the viewport in NORMAL stacking (no Fullscreen top layer), so the
     backtick-capture overlay + pen still paint over the map. z-index clears the modal
     card but sits far below the capture layer (~2^31). */
  .t0v2-mapwrap.t0v2-max { position:fixed; inset:0; z-index:40; border:none; }
  .t0v2-maxexit { position:absolute; top:.5rem; right:.5rem; z-index:2; display:none;
    font:12px/1.4 ui-monospace,SFMono-Regular,monospace; cursor:pointer;
    border:1px solid var(--silver-faint); border-radius:3px; padding:.2rem .6rem;
    background:var(--steel-2); color:var(--ink-soft); }
  .t0v2-mapwrap.t0v2-max .t0v2-maxexit { display:block; }
  .t0v2-maxexit:hover { color:var(--ink); border-color:var(--silver); }
  .t0v2-hint { position:absolute; left:.6rem; bottom:.45rem; font-size:11px;
    color:var(--ink-faint); pointer-events:none; }
  .t0v2-aside { flex:0 0 330px; min-height:0; overflow-y:auto; padding-right:.4rem;
    display:flex; flex-direction:column; gap:.45rem; }
  @media (max-width: 900px) {
    .t0v2-body { flex-direction:column; }
    .t0v2-aside { flex:1 1 auto; }
  }
  .t0v2-kanji { font-family:var(--font-head); font-size:30px; fill:var(--ink); }
  .t0v2-room .t0v2-kanji { font-size:22px; }
  .t0v2-caption { font-family:var(--font-body); font-size:17px; fill:var(--ink);
    paint-order:stroke; stroke:var(--steel-1); stroke-width:5px; stroke-linejoin:round; }
  .t0v2-sealbox { fill:var(--steel-2); stroke:var(--silver-wire); stroke-width:1.6;
    fill-opacity:.88; }
  .t0v2-k-estate .t0v2-sealbox { stroke:var(--gold); }
  .t0v2-k-grounds .t0v2-sealbox { stroke:var(--gold-dim); }
  .t0v2-k-combat .t0v2-sealbox { stroke:var(--ink-soft); stroke-dasharray:6 4; }
  .t0v2-k-activity .t0v2-sealbox { stroke:var(--shu); stroke-dasharray:3 4; }
  .t0v2-k-scenery { opacity:.72; }
  .t0v2-k-scenery .t0v2-sealbox { stroke:var(--silver-faint); stroke-dasharray:4 5; }
  .t0v2-node { cursor:pointer; outline:none; }
  .t0v2-node:hover .t0v2-sealbox, .t0v2-node:focus-visible .t0v2-sealbox {
    stroke:var(--gold-hi); stroke-width:2.4; }
  .t0v2-node:hover .t0v2-caption { fill:var(--ink); }
  .t0v2-node[data-sel] .t0v2-sealbox { stroke:var(--shu); stroke-width:2.8; }
  .t0v2-node[data-sel] .t0v2-kanji { fill:var(--shu-hi, var(--shu)); }
  .t0v2-nightrail { display:none; }
  svg[data-night] .t0v2-nightrail { display:inline; }
  /* the fine register FADES at the zoom gate (a hard display:none read as a
     rendering glitch — FB drain 2026-07-07); visibility keeps hidden text
     unhittable and unpainted once the fade lands */
  .ms-fine { transition: opacity .18s linear, visibility .18s linear; }
  svg[data-zoom='far'] .ms-fine { opacity:0; visibility:hidden; }
  .t0v2-aside-title { font-family:var(--font-head); font-size:1.05rem; color:var(--ink); }
  .t0v2-aside-src, .t0v2-aside-sum { font-size:12px; color:var(--ink-faint); line-height:1.5; }
  .t0v2-roster-head { margin-top:.5rem; font-size:11px; letter-spacing:.08em;
    text-transform:uppercase; color:var(--gold-dim); }
  .t0v2-roster-row { display:flex; gap:.5rem; align-items:baseline; text-align:left;
    background:none; border:none; border-bottom:1px solid var(--steel-2); padding:.22rem .1rem;
    font:13px/1.4 var(--font-body); color:var(--ink-soft); cursor:pointer; }
  .t0v2-roster-row:hover { color:var(--ink); background:var(--steel-2); }
  .t0v2-roster-kanji { font-family:var(--font-head); color:var(--ink); flex:0 0 auto; }
  .t0v2-back { align-self:flex-start; background:none; border:1px solid var(--silver-faint);
    border-radius:3px; padding:.15rem .5rem; color:var(--ink-soft); cursor:pointer;
    font:12px/1.4 ui-monospace,monospace; }
  .t0v2-back:hover { color:var(--ink); border-color:var(--silver); }
  .t0v2-detail-head { display:flex; gap:.55rem; align-items:baseline; }
  .t0v2-detail-kanji { font-family:var(--font-head); font-size:1.7rem; color:var(--ink); }
  .t0v2-detail-name { font-family:var(--font-head); font-size:1.05rem; color:var(--ink); }
  .t0v2-chip { align-self:flex-start; font-size:11px; letter-spacing:.06em; border-radius:3px;
    padding:.1rem .45rem; border:1px solid var(--silver-faint); color:var(--ink-soft); }
  .t0v2-chip-combat, .t0v2-chip-activity { border-color:var(--shu); color:var(--shu); }
  .t0v2-chip-estate { border-color:var(--gold); color:var(--gold); }
  .t0v2-chip-scenery { border-style:dashed; }
  .t0v2-detail-blurb { font-size:13.5px; line-height:1.55; color:var(--ink); margin:0; }
  .t0v2-detail-label { margin-top:.35rem; font-size:11px; letter-spacing:.08em;
    text-transform:uppercase; color:var(--gold-dim); }
  .t0v2-detail-list { margin:.1rem 0 0; padding-left:1.1rem; font-size:13px; line-height:1.5;
    color:var(--ink-soft); }
  .t0v2-hidden-tag { color:var(--shu); font-size:11px; }
  .t0v2-roster-new { font-family:var(--font-head); color:var(--gold); flex:0 0 auto;
    margin-left:auto; font-size:12px; }
  .t0v2-chiprow { display:flex; gap:.35rem; }
  .t0v2-chip-new { border-color:var(--gold); color:var(--gold); }
  .t0v2-detail-combat { font-size:13px; line-height:1.5; color:var(--ink-soft); margin:0; }
  .t0v2-detail-wrong { font-size:13px; line-height:1.55; color:var(--shu); margin:0; opacity:.9; }
`;

/** Open the T0 review map as a full-screen modal. Returns the scrim. */
export function openT0V2Map(): HTMLElement {
  return openTierMap('T0');
}

/** Open the T1 review map — the same world seen whole. */
export function openT1Map(): HTMLElement {
  return openTierMap('T1');
}

/** Open the T2 review map — the valley, the estate demoted, Asagiri downstream. */
export function openT2Map(): HTMLElement {
  return openTierMap('T2');
}

function openTierMap(tier: Tier): HTMLElement {
  const scrim = hd('div', 'modal-scrim');
  // the DEV panel floats at z-index 9999 and would overlap the aside's corner —
  // this modal is a full-screen review surface, so it goes above the panel.
  scrim.style.zIndex = '10000';
  const card = hd('div', 'modal-card frame t0v2-card');
  scrim.append(card);

  const style = document.createElement('style');
  style.textContent = CSS;
  card.append(style);

  const close = hd('button', 'modal-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', `Close the ${tier} map`);
  card.append(close);

  const head = hd('div', 't0v2-head');
  const title = hd('div', 'modal-title');
  const kami = hd('span', 'kami', '絵図・改');
  const romanFor: Record<Tier, string> = {
    T0: 'T0 — the estate & the household',
    T1: 'T1 — the same world, seen whole',
    T2: 'T2 — the valley, Asagiri downstream',
  };
  const roman = hd('span', 'roman', romanFor[tier]);
  title.append(kami, roman);
  head.append(title);

  const controls = hd('div', 't0v2-controls');
  head.append(controls);
  card.append(head);

  const FR = frameFor(tier);
  const body = hd('div', 't0v2-body');
  const mapWrap = hd('div', 't0v2-mapwrap');
  const svg = sv('svg', {
    viewBox: `${FR.x} ${FR.y} ${FR.w} ${FR.h}`,
    role: 'img',
    'aria-label': `${tier} survey plan — the story-bible zone sheet`,
    preserveAspectRatio: 'xMidYMid meet',
  });
  mapWrap.append(svg);
  mapWrap.append(hd('div', 't0v2-hint', 'drag to pan · scroll to zoom'));
  const aside = hd('div', 't0v2-aside');
  body.append(mapWrap, aside);
  card.append(body);

  // ── the view: pan (drag) + zoom (wheel / buttons), viewBox-driven ──
  const vb: { x: number; y: number; w: number; h: number } = { ...FR };
  const applyVb = (): void => {
    svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
    // the fine-detail register reveals past ~1.6× zoom (spec L10)
    svg.setAttribute('data-zoom', vb.w <= FR.w * 0.62 ? 'near' : 'far');
  };
  const clampVb = (): void => {
    vb.w = Math.min(Math.max(vb.w, 320), FR.w * 1.15);
    vb.h = (vb.w * FR.h) / FR.w;
    const m = vb.w * 0.25; // let the sheet edge pull in a bit, never lose it
    vb.x = Math.min(Math.max(vb.x, FR.x - m), FR.x + FR.w + m - vb.w);
    vb.y = Math.min(
      Math.max(vb.y, FR.y - (m * FR.h) / FR.w),
      FR.y + FR.h + (m * FR.h) / FR.w - vb.h,
    );
  };
  /** client → world coords (getScreenCTM handles viewBox + letterboxing). */
  const toWorld = (cx: number, cy: number): { x: number; y: number } => {
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(cx, cy).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };
  // The paper-warp displacement filter costs ~10ms/frame while ZOOMING (the
  // browser re-rasterises the filtered group at each new scale — measured
  // 24ms→14ms p50 without it). Suspend it during zoom, restore on idle: crisp
  // warp at rest, 60fps in motion. Pan is attribute-only and never pays this.
  const artGroup = (): SVGElement | null => svg.children[1] as SVGElement | null;
  let artFilter: string | null = null;
  let filterIdle: ReturnType<typeof setTimeout> | undefined;
  const suspendFilterForZoom = (): void => {
    const art = artGroup();
    if (art && artFilter === null) {
      artFilter = art.getAttribute('filter');
      if (artFilter) art.removeAttribute('filter');
    }
    clearTimeout(filterIdle);
    filterIdle = setTimeout(() => {
      const a = artGroup();
      if (a && artFilter) a.setAttribute('filter', artFilter);
      artFilter = null;
    }, 160);
  };
  const zoomAt = (cx: number, cy: number, factor: number): void => {
    suspendFilterForZoom();
    const p = toWorld(cx, cy);
    vb.w *= factor;
    vb.h *= factor;
    clampVb();
    applyVb();
    // keep the world point under the cursor stationary: re-measure and shift
    const now = toWorld(cx, cy);
    vb.x += p.x - now.x;
    vb.y += p.y - now.y;
    clampVb();
    applyVb();
  };
  svg.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, e.deltaY > 0 ? 1.18 : 1 / 1.18);
    },
    { passive: false },
  );
  let dragging = false;
  let dragMoved = false;
  let dragStart = { x: 0, y: 0 };
  // live pointers — two fingers = pinch zoom. touch-action:none means WE own
  // every gesture; without this, touch could pan but never zoom (G-9 — and
  // this DEV viewer's geometry is player-bound through
  // map-variants/sheet-map.ts (ADR-151), so gestures here must match the
  // live map's).
  const pointers = new Map<number, { x: number; y: number }>();
  let pinchDist = 0;
  svg.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchDist = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      dragging = false; // a second finger ends the pan; the gesture is a pinch
      svg.classList.remove('t0v2-panning');
      return;
    }
    dragging = true;
    dragMoved = false;
    dragStart = toWorld(e.clientX, e.clientY);
    svg.classList.add('t0v2-panning');
  });
  svg.addEventListener('pointermove', (e) => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a!.x - b!.x, a!.y - b!.y);
      if (pinchDist > 0 && d > 0) {
        // zoom about the finger midpoint; zoomAt keeps that world point still
        zoomAt((a!.x + b!.x) / 2, (a!.y + b!.y) / 2, pinchDist / d);
      }
      pinchDist = d;
      return;
    }
    if (!dragging) return;
    const p = toWorld(e.clientX, e.clientY);
    const dx = dragStart.x - p.x;
    const dy = dragStart.y - p.y;
    if (!dragMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      dragMoved = true;
      // capture only once a REAL drag starts — capturing on pointerdown would
      // retarget the derived click to the svg and node selection would go dead
      svg.setPointerCapture(e.pointerId);
    }
    if (!dragMoved) return;
    vb.x += dx;
    vb.y += dy;
    clampVb();
    applyVb();
  });
  const endDrag = (e: PointerEvent): void => {
    pointers.delete(e.pointerId);
    pinchDist = 0;
    dragging = false;
    svg.classList.remove('t0v2-panning');
  };
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);

  const fit = (): void => {
    Object.assign(vb, FR);
    applyVb();
  };
  /** Fly the view to a node (roster navigation) — a readable close-up. */
  const focusNode = (id: string): void => {
    const a = ANCHORS[id];
    if (!a) return;
    vb.w = tier === 'T2' ? 1500 : tier === 'T1' ? 1100 : 900;
    vb.h = (vb.w * FR.h) / FR.w;
    vb.x = a.x - vb.w / 2;
    vb.y = a.y - vb.h / 2;
    clampVb();
    applyVb();
  };

  // zoom buttons + layer pills
  const zoomGroup = hd('div', 't0v2-zoomgroup');
  const zoomBtn = (label: string, act: () => void, aria: string): void => {
    const b = hd('button', 't0v2-zoom', label);
    b.type = 'button';
    b.setAttribute('aria-label', aria);
    b.addEventListener('click', () => act());
    zoomGroup.append(b);
  };
  const centre = (): { x: number; y: number } => {
    const r = svg.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
  zoomBtn(
    '⊕',
    () => {
      const c = centre();
      zoomAt(c.x, c.y, 1 / 1.35);
    },
    'Zoom in',
  );
  zoomBtn(
    '⊖',
    () => {
      const c = centre();
      zoomAt(c.x, c.y, 1.35);
    },
    'Zoom out',
  );
  zoomBtn('⤢ fit', fit, 'Fit the whole sheet');
  // Maximize the map pane to fill the viewport so the survey can be read close.
  // A CSS blow-up on purpose — NOT the native Fullscreen API, which promotes the
  // pane into the browser's top layer where the ` playtest-capture overlay + its
  // drawing pen (z-index ~2^31, appended to <body>) can't paint over it. Staying
  // in normal DOM stacking keeps the capture layer above the map. Toggles on the
  // head button, an on-pane exit chip (the head is covered when maxed), or Esc.
  let maxed = false;
  const exitMax = hd('button', 't0v2-maxexit', '⛶ exit');
  exitMax.type = 'button';
  exitMax.setAttribute('aria-label', 'Exit full-screen');
  mapWrap.append(exitMax);
  const fsBtn = hd('button', 't0v2-zoom', '⛶ full');
  fsBtn.type = 'button';
  fsBtn.setAttribute('aria-label', 'Full-screen the map');
  const setMax = (on: boolean): void => {
    maxed = on;
    mapWrap.classList.toggle('t0v2-max', on);
    fsBtn.textContent = on ? '⛶ exit' : '⛶ full';
    fit(); // the pane just resized — refit so the whole sheet stays framed
  };
  fsBtn.addEventListener('click', () => setMax(!maxed));
  exitMax.addEventListener('click', () => setMax(false));
  zoomGroup.append(fsBtn);
  controls.append(zoomGroup);

  const nodeEls = new Map<string, SVGGElement>();
  paintSheet(svg, nodeEls, tier);
  applyVb();

  // ── the T0 rung-reveal previewer (ADR-151): fog = unsurveyed paper, seals
  //    gate by RUNG_LADDER (the REAL schedule, derived from core ranks.ts).
  //    DEV-only preview — the live map (map-variants/sheet-map.ts) reads core
  //    `revealed`, never this pill. Cycles every rung; the fog poly is the
  //    nearest REVEAL stage at-or-below the rung (stages are sparse data).
  if (tier === 'T0') {
    const STAGES: (number | null)[] = [null, 1, 2, 3, 4, 5, 6, 7];
    let stageIx = 0;
    const rungPill = hd('button', 't0v2-pill', 'rung: all');
    rungPill.type = 'button';
    rungPill.setAttribute('aria-label', 'Preview the rung-reveal (fog of unsurveyed paper)');
    rungPill.addEventListener('click', () => {
      stageIx = (stageIx + 1) % STAGES.length;
      const rung = STAGES[stageIx]!;
      rungPill.textContent = rung === null ? 'rung: all' : `rung: R${rung}`;
      if (rung === null) delete rungPill.dataset.on;
      else rungPill.dataset.on = '1';
      // clear the previous stage, then re-apply
      for (const g of Array.from(svg.querySelectorAll('.ms-reveal'))) g.remove();
      const visible = rung === null ? (): boolean => true : zonesAtRung(rung);
      for (const [id, g] of nodeEls) {
        g.style.display = visible(typeof id === 'string' ? id : '') ? '' : 'none';
      }
      const fogStages = rung === null ? [] : REVEAL.filter((s) => s.rung <= rung);
      const stage = fogStages.length > 0 ? fogStages[fogStages.length - 1]! : null;
      // svg children: [defs, art, seals] — paintSheet's own layer order
      const art = svg.children[1] as SVGElement;
      const sealLayer = svg.children[svg.children.length - 1] as SVGElement;
      paintReveal(svg, art, sealLayer, stage);
    });
    controls.append(rungPill);
  }

  let selected: string | null = null;
  const select = (id: string | null): void => {
    if (selected) delete nodeEls.get(selected)?.dataset.sel;
    selected = id;
    if (id) {
      const g = nodeEls.get(id);
      if (g) g.dataset.sel = '1';
      if (id === 'night-rounds') svg.setAttribute('data-night', '1');
      else svg.removeAttribute('data-night');
      const n = rosterFor(tier).find((x) => x.id === id)!;
      renderDetail(aside, n, () => select(null), tier);
    } else {
      svg.removeAttribute('data-night');
      renderOverview(
        aside,
        (nid) => {
          select(nid);
          focusNode(nid);
        },
        tier,
      );
    }
  };
  for (const [id, g] of nodeEls) {
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.addEventListener('click', () => {
      if (dragMoved) return; // a pan that ended on a seal is not a selection
      select(selected === id ? null : id);
    });
    g.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') select(selected === id ? null : id);
    });
  }
  select(null);

  const dismiss = (): void => {
    clearTimeout(filterIdle); // never restore a filter onto a removed sheet
    document.removeEventListener('keydown', onKey);
    scrim.remove();
  };
  const onKey = (e: KeyboardEvent): void => {
    if (e.key !== 'Escape') return;
    if (maxed)
      setMax(false); // Esc steps out of maximize before closing the modal
    else dismiss();
  };
  close.addEventListener('click', dismiss);
  scrim.addEventListener('click', (e) => {
    if (e.target === scrim) dismiss();
  });
  document.addEventListener('keydown', onKey);

  document.body.append(scrim);
  return scrim;
}
