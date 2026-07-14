// The Review pane's VARIANTS half (split out of dev.ts, 2026-07-13 render-split): the live
// ADR-075 variant toggle. DEV-only, riding dev.ts's DEV fold.
import { el } from '../render';
import { mono, hrChip } from './widgets';
import type { DevApi } from '../dev';

export function buildVariantsPane(opts: {
  pane: HTMLElement;
  dev: DevApi;
  rerender: () => void;
}): void {
  const { pane, dev, rerender } = opts;

  // ── the live variant toggle — the heart of ADR-075 review. Each surface is a COLLAPSED summary
  //    row (label + current pick + caret); clicking it reveals the blurb + the option buttons.
  //    Rows are RECENCY-ordered: SURFACES is oldest→newest (new surfaces are appended), so we
  //    display it REVERSED — the most-recently-introduced surface sits at the top. ──
  // A variant's reference is its own ID (`market-b`) — ADR-192 killed the positional V-tag
  // (an insert/prune renumbered every tag after it). Ids are what review.md cites and what the
  // `review-link` gate checks, so the panel and the gate can never disagree.

  // Rung-ordered (2026-07-09) — surfaces sort by the RUNG a player first meets them, so the
  // Variants tab tracks a rung-by-rung QA (mirrors review.md's rung grouping). A rung header
  // lands whenever the rung changes; V-tags stay REGISTRY-ordered (above), so they never shift.
  const rungOrdered = dev.surfaces
    .slice()
    .sort((a, b) => (a.rung ?? 99) - (b.rung ?? 99));
  let shownRung: number | undefined;
  let firstRow = true;
  for (const surface of rungOrdered) {
    if (firstRow || surface.rung !== shownRung) {
      shownRung = surface.rung;
      firstRow = false;
      const rh = el(
        'div',
        undefined,
        surface.rung !== undefined ? `— rung R${surface.rung} —` : '— other —',
      );
      rh.style.cssText =
        'color:#b08d4f;font-size:10px;text-transform:uppercase;letter-spacing:.08em;margin:.35rem 0 .1rem;opacity:.85;';
      pane.append(rh);
    }
    const sec = el('div');
    sec.style.cssText = 'border:1px solid #3a322a;border-radius:3px;';

    // the clickable collapsed summary row — a two-line VERTICAL stack (playtest FB-35): line 1 is
    // the caret + surface NAME only; line 2 sits underneath (indented under the name, muted) as
    // `V{n}{letter} · {label}` — V-tag first. Stacking (vs cramming name+label+[Vn] on one line) stops
    // the long rows (e.g. HOUSE-INFLUENCE GRADE) wrapping badly / overflowing the panel's edge.
    const summary = el('div');
    summary.style.cssText =
      'display:flex;flex-direction:column;gap:.05rem;padding:.28rem .4rem;cursor:pointer;user-select:none;min-width:0;';
    // line 1 — caret + name
    const sTitle = el('div');
    sTitle.style.cssText =
      'display:flex;align-items:baseline;gap:.35rem;min-width:0;';
    const sCaret = el('span', undefined, '▸');
    sCaret.style.cssText = 'color:#b08d4f;flex:0 0 auto;';
    const sLabel = el('span', undefined, surface.label);
    sLabel.style.cssText =
      'color:#b08d4f;text-transform:uppercase;font-size:11px;min-width:0;';
    sTitle.append(sCaret, sLabel, hrChip(surface.hr));
    // line 2 — current pick, indented under the name, wraps within the panel width
    const sPick = el('span', undefined, '');
    sPick.style.cssText =
      'color:#9b8e78;font-size:11px;padding-left:1.05rem;overflow-wrap:anywhere;min-width:0;';
    summary.append(sTitle, sPick);
    sec.append(summary);

    // the collapsible details area (blurb + option buttons), hidden by default
    const details = el('div');
    details.style.cssText =
      'display:none;flex-direction:column;gap:.25rem;padding:0 .4rem .35rem;';
    const blurb = el('div', undefined, '');
    blurb.style.cssText = 'color:#9b8e78;font-size:11px;min-height:1.4em;';
    const rows = el('div');
    rows.style.cssText = 'display:flex;flex-wrap:wrap;gap:.25rem;';
    const buttons: HTMLButtonElement[] = [];

    const paint = (): void => {
      const cur = dev.getVariant(surface.id);
      surface.variants.forEach((v, i) => {
        const on = v.id === cur;
        buttons[i]!.style.background = on ? '#b08d4f' : '#3a322a';
        buttons[i]!.style.color = on ? '#1c1814' : '#e7d9bc';
        if (on) {
          blurb.textContent = v.blurb;
          sPick.textContent = `${v.id} · ${v.label}`;
        }
      });
    };
    surface.variants.forEach((v) => {
      const b = mono(`${v.id} · ${v.label}`, () => {
        dev.setVariant(surface.id, v.id);
        paint();
        rerender();
      });
      // FB-35 — left-align the option label (mono defaults to centered), so a long pick like
      // `V6A · A · price-button list` reads cleanly instead of centre-wrapping.
      b.style.textAlign = 'left';
      buttons.push(b);
      rows.append(b);
    });
    details.append(blurb, rows);
    sec.append(details);

    summary.addEventListener('click', () => {
      const hidden = details.style.display === 'none';
      details.style.display = hidden ? 'flex' : 'none';
      sCaret.textContent = hidden ? '▾' : '▸';
    });

    pane.append(sec);
    paint();
  }
}
