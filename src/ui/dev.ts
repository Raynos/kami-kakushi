// DEV-only harness (PRD §6.10 / D-075): the in-UI DEV panel + the live variant-toggle
// infrastructure. This WHOLE module is referenced only behind `import.meta.env.DEV` —
// `createDevApi`/`mountDevPanel` are called from a DEV-guarded branch in main.ts, and the
// renderer reaches `renderVariant` only through `import.meta.env.DEV && dev` (a branch Vite
// folds to dead code in prod). So Rollup tree-shakes this module — and everything it carries
// (variant ids, the alternate renderers, the panel labels) — out of the production bundle.
// The `gh-pages.sh` strip-guard greps the prod bundle for DEV_SENTINEL to PROVE it.
//
// The renderer reads a DEV-only `variant: Record<surface,id>` to choose which rendering of a
// diverged surface to show; NOTHING in src/core branches on it — variants are pure
// presentation. Prod ships only each surface's DEFAULT (the first variant), so there is zero
// prod flag-debt (D-075).

import { balance, type GameState, type RankId, type ActivityId, type MobId } from '../core';
import { el } from './render';

/** A marker that exists ONLY in this DEV module. The gh-pages guard greps the prod bundle for
 *  it and refuses to deploy if it leaked — proof the DEV harness + variants were stripped. */
export const DEV_SENTINEL = '__KAMI_DEV_PANEL__';

export interface VariantDef {
  id: string;
  label: string;
  /** A one-line gloss shown under the toggle so the human knows what they are picking. */
  blurb: string;
}
export interface SurfaceDef {
  id: string;
  label: string;
  /** variants[0] is the prod DEFAULT (self-picked); the rest are DEV-only alternates. */
  variants: VariantDef[];
}

/** The registry of diverged surfaces + their variants — the single source the panel toggle
 *  and the renderer both read. Grows as Step 2 adds craft / market / quests. */
export const SURFACES: SurfaceDef[] = [
  {
    id: 'influence',
    label: 'House-Influence grade',
    variants: [
      {
        id: 'influence-a',
        label: 'A · continuous bar',
        blurb: 'Indigo→gold ink bar, ticks at Good/Great/Excellent (the shipped default).',
      },
      {
        id: 'influence-b',
        label: 'B · segmented bands',
        blurb: 'Three lacquer band-boxes (Good/Great/Excellent); the current band fills.',
      },
      {
        id: 'influence-c',
        label: 'C · standing marks',
        blurb: 'A row of ink marks ◆◇ filling toward Excellent — a diegetic tally.',
      },
    ],
  },
];

export interface DevApi {
  getVariant(surface: string): string;
  setVariant(surface: string, id: string): void;
  surfaces: readonly SurfaceDef[];
  /** Render a NON-default variant of `surface` into `container`. Returns true if it rendered
   *  (a non-default is selected) → the caller skips its default; false → the caller renders the
   *  prod default. Always effectively absent in prod (this whole module is stripped). */
  renderVariant(surface: string, container: HTMLElement, state: GameState): boolean;
}

export function createDevApi(): DevApi {
  const variant: Record<string, string> = {};
  for (const s of SURFACES) variant[s.id] = s.variants[0]!.id;
  const defaultOf = (s: string): string => SURFACES.find((x) => x.id === s)?.variants[0]?.id ?? '';
  return {
    getVariant: (s) => variant[s] ?? defaultOf(s),
    setVariant: (s, id) => {
      variant[s] = id;
    },
    surfaces: SURFACES,
    renderVariant: (s, container, state) => {
      const id = variant[s] ?? defaultOf(s);
      if (id === defaultOf(s)) return false; // default → the caller renders it (and ships it)
      return renderSurfaceVariant(s, id, container, state);
    },
  };
}

// ── the alternate (non-default) variant renderers — DEV-only, stripped from prod ──

function renderSurfaceVariant(
  surface: string,
  variantId: string,
  container: HTMLElement,
  state: GameState,
): boolean {
  if (surface === 'influence') return renderInfluenceGrade(variantId, container, state);
  return false;
}

/** The diverged House-Influence grade visual (B / C). The shared frame / head / silhouettes /
 *  ascend CTA live in render.ts (default A ships to prod); only this grade block diverges. */
function renderInfluenceGrade(variantId: string, card: HTMLElement, state: GameState): boolean {
  const est = state.influence.estate;
  const bands = balance.ESTATE_BANDS;
  if (variantId === 'influence-b') {
    // B — three lacquer band-boxes (Good / Great / Excellent); reached bands lit, the current
    // one partially filled. (The old B bug — fill used `color`, not `background` — is fixed.)
    const wrap = el('div', 'influence-seg');
    wrap.style.cssText = 'display:flex;gap:.4rem;margin:.5rem 0;';
    const segs: { label: string; lo: number; hi: number }[] = [
      { label: 'Good 良', lo: 0, hi: bands.good },
      { label: 'Great 優', lo: bands.good, hi: bands.great },
      { label: 'Excellent 秀', lo: bands.great, hi: bands.excellent },
    ];
    const hue = ['var(--ai)', 'var(--ochre)', 'var(--gold)'];
    segs.forEach((s, i) => {
      const frac = Math.max(0, Math.min(1, (est.value - s.lo) / (s.hi - s.lo)));
      const box = el('div');
      box.style.cssText =
        'flex:1;position:relative;height:2.4rem;border:1px solid var(--ink-faint);border-radius:2px;overflow:hidden;background:var(--washi);';
      const fill = el('span');
      fill.style.cssText = `position:absolute;left:0;bottom:0;width:100%;height:${Math.round(frac * 100)}%;background:${hue[i]};opacity:.85;`;
      const lab = el('span', undefined, s.label);
      lab.style.cssText =
        'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:var(--fs-micro)/1 var(--font-body);color:var(--ink);';
      box.append(fill, lab);
      wrap.append(box);
    });
    card.append(wrap);
  } else if (variantId === 'influence-c') {
    // C — "standing marks": a row of ink pips ◆◇ filling toward Excellent (a diegetic tally).
    const MARKS = 12;
    const filled = Math.round(Math.min(1, est.value / bands.excellent) * MARKS);
    const row = el('div', 'influence-marks');
    row.style.cssText = 'margin:.5rem 0;letter-spacing:.18em;font-size:1.1rem;';
    let marks = '';
    for (let i = 0; i < MARKS; i++) marks += i < filled ? '◆' : '◇';
    const span = el('span', undefined, marks);
    span.style.color = 'var(--gold)';
    row.append(span);
    card.append(row);
  } else {
    return false;
  }
  card.append(
    el('div', 'influence-when', `Standing ${est.value} · the season judges at ${est.highWater}`),
  );
  return true;
}

// ── the DEV panel — a floating, collapsible control surface (DEV-only) ──

/** The subset of `window.__qa` the panel drives. main.ts's qa object satisfies this
 *  structurally; the panel never sees the rest of __qa. */
export interface DevQa {
  speed(mult: number): number;
  jumpToPhase2(): unknown;
  jumpToAscension(): void;
  faceWolf(): void;
  toRung(id: RankId): unknown;
  auto(id: ActivityId | null): void;
  autoCombat(id: MobId | null): void;
  newGame(seed?: number): void;
}

export function mountDevPanel(
  host: HTMLElement,
  opts: { qa: DevQa; dev: DevApi; rerender: () => void },
): void {
  const { qa, dev, rerender } = opts;

  const panel = el('div');
  panel.setAttribute('data-dev', DEV_SENTINEL);
  panel.style.cssText =
    'position:fixed;top:.5rem;right:.5rem;z-index:9999;width:15rem;max-height:92vh;overflow:auto;' +
    'background:#1c1814;color:#e7d9bc;font:12px/1.45 ui-monospace,SFMono-Regular,monospace;' +
    'border:1px solid #b08d4f;border-radius:4px;box-shadow:0 2px 14px rgba(0,0,0,.45);';

  // header (click to collapse the body)
  const head = el('div');
  head.style.cssText =
    'display:flex;justify-content:space-between;align-items:center;padding:.35rem .5rem;' +
    'background:#26221e;border-bottom:1px solid #7a6c59;cursor:pointer;user-select:none;font-weight:700;';
  head.append(el('span', undefined, '⚙ DEV'));
  const caret = el('span', undefined, '▾');
  head.append(caret);
  panel.append(head);

  const body = el('div');
  body.style.cssText = 'padding:.4rem .5rem;display:flex;flex-direction:column;gap:.5rem;';
  panel.append(body);
  head.addEventListener('click', () => {
    const hidden = body.style.display === 'none';
    body.style.display = hidden ? 'flex' : 'none';
    caret.textContent = hidden ? '▾' : '▸';
  });

  const mono = (label: string, onClick: () => void): HTMLButtonElement => {
    const b = el('button', undefined, label);
    b.type = 'button';
    b.style.cssText =
      'background:#3a322a;color:#e7d9bc;border:1px solid #7a6c59;border-radius:3px;' +
      'padding:.18rem .4rem;font:inherit;cursor:pointer;';
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick();
    });
    return b;
  };
  const section = (title: string): HTMLElement => {
    const sec = el('div');
    const h = el('div', undefined, title);
    h.style.cssText = 'color:#b08d4f;font-size:11px;text-transform:uppercase;margin-bottom:.2rem;';
    sec.append(h);
    const rows = el('div');
    rows.style.cssText = 'display:flex;flex-wrap:wrap;gap:.25rem;';
    sec.append(rows);
    body.append(sec);
    return rows;
  };

  // speed
  const speed = section('Speed');
  for (const m of [1, 2, 4, 8]) speed.append(mono(`${m}×`, () => qa.speed(m)));

  // teleports
  const jump = section('Jump');
  jump.append(mono('→ Phase 2', () => qa.jumpToPhase2()));
  jump.append(mono('→ Ascend-ready', () => qa.jumpToAscension()));
  const rungs = section('Rung');
  for (const r of ['R3', 'R5', 'R7'] as RankId[]) rungs.append(mono(r, () => qa.toRung(r)));

  // combat + auto
  const combat = section('Combat / Auto');
  combat.append(mono('Face wolf', () => qa.faceWolf()));
  combat.append(mono('Auto: farm', () => qa.auto('farm_paddy' as ActivityId)));
  combat.append(mono('Auto: monkey', () => qa.autoCombat('monkey' as MobId)));
  combat.append(
    mono('Stop auto', () => {
      qa.auto(null);
      qa.autoCombat(null);
    }),
  );

  // lifecycle
  const life = section('Game');
  life.append(mono('New game', () => qa.newGame()));

  // ── the live variant toggle — the heart of D-075 review ──
  for (const surface of dev.surfaces) {
    const sec = el('div');
    const h = el('div', undefined, `Variant · ${surface.label}`);
    h.style.cssText = 'color:#b08d4f;font-size:11px;text-transform:uppercase;margin-bottom:.2rem;';
    sec.append(h);
    const blurb = el('div', undefined, '');
    blurb.style.cssText = 'color:#9b8e78;font-size:11px;margin-bottom:.25rem;min-height:1.4em;';
    const rows = el('div');
    rows.style.cssText = 'display:flex;flex-wrap:wrap;gap:.25rem;';
    const buttons: HTMLButtonElement[] = [];
    const paint = (): void => {
      const cur = dev.getVariant(surface.id);
      surface.variants.forEach((v, i) => {
        const on = v.id === cur;
        buttons[i]!.style.background = on ? '#b08d4f' : '#3a322a';
        buttons[i]!.style.color = on ? '#1c1814' : '#e7d9bc';
        if (on) blurb.textContent = v.blurb;
      });
    };
    surface.variants.forEach((v) => {
      const b = mono(v.label, () => {
        dev.setVariant(surface.id, v.id);
        paint();
        rerender();
      });
      buttons.push(b);
      rows.append(b);
    });
    sec.append(blurb, rows);
    body.append(sec);
    paint();
  }

  host.append(panel);
}
