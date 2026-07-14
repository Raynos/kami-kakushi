// Shared DEV-panel widget factories + tokens (split out of dev.ts, 2026-07-13 render-split).
// DEV-only: imported only from the dev/ modules, riding dev.ts's DEV fold.
import { el } from '../render';

/** A marker that exists ONLY in the DEV module graph. The gh-pages guard greps the prod
 *  bundle for it and refuses to deploy if it leaked — proof the DEV harness + variants
 *  were stripped. */
export const DEV_SENTINEL = '__KAMI_DEV_PANEL__';

/** The panes are the ONLY scrolling area (FB-37): each grows to fill the body's middle and
 *  scrolls its own overflow, so the fixed footer below stays pinned. */
export const paneScroll = 'flex:1 1 auto;min-height:0;overflow:auto;';

export const mono = (label: string, onClick: () => void): HTMLButtonElement => {
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

export const tabBtn = (label: string): HTMLButtonElement => {
  const b = el('button', undefined, label);
  b.type = 'button';
  // FB-302 — THREE tabs per row inside the wrapping bar (was 40% / two); nowrap keeps each
  // label on one line. FB-311 — the basis is FIXED (flex-grow 0), so a lone tab on the last
  // row (Balance) stays one cell wide instead of stretching across the row.
  b.style.cssText =
    'flex:0 0 calc((100% - .5rem)/3);box-sizing:border-box;white-space:nowrap;border:1px solid #7a6c59;' +
    'border-radius:3px;padding:.2rem .4rem;font:inherit;cursor:pointer;font-weight:700;';
  return b;
};

// ── the QUEUE CHIP (2026-07-13) — every review row names the HR-item it is waiting on, so
//    the panel and `human-in-the-loop/review.md` point AT each other: the doc names the tag
//    to click, the row names the item to answer. A row whose `hr` is `none · <why>` is not
//    waiting on anybody — a settled bundle the human asked to KEEP for comparison (hd30-nengu,
//    fb324-rake-cap) — and reads as a muted "reference" chip that no count includes. ──
export const isAwaitingVerdict = (hr: string): boolean => hr.startsWith('HR-');
export const hrChip = (hr: string): HTMLElement => {
  const open = isAwaitingVerdict(hr);
  const chip = el('span', undefined, open ? hr : 'reference');
  chip.title = open
    ? `awaiting your verdict — ${hr} in review.md`
    : hr.replace(/^none · /, '');
  chip.style.cssText =
    'margin-left:auto;flex:0 0 auto;font-size:10px;letter-spacing:.04em;padding:0 .25rem;' +
    'border-radius:2px;text-transform:none;' +
    (open
      ? 'color:#1c1814;background:#b08d4f;'
      : 'color:#9b8e78;border:1px solid #3a322a;');
  return chip;
};
