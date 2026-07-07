// DEV requirements cheatlist (FB-121 / ADR-137, the plan's Phase 4) — the human's
// debugging window onto the HIDDEN rung-requirement lists: the current rung's full
// authored list with live progress, exactly what the player is deliberately never
// shown (the player gets only the rounded % bar + flavor lines). DEV-only by
// construction: mounted from ui/dev.ts behind `import.meta.env.DEV`, so the whole
// module strips from prod. NOT a player surface — no taste pass applies here.

import type { GameState } from '../core';
import {
  rungRequirements,
  isRequirementDone,
  requirementTarget,
  rungProgress,
  currentRank,
} from '../core';

function el(tag: string, text?: string): HTMLElement {
  const n = document.createElement(tag);
  if (text !== undefined) n.textContent = text;
  return n;
}

/** One requirement's mechanical read (the SPEC, not the flavor — this is the debug view). */
function mechanics(req: ReturnType<typeof rungRequirements>[number]): string {
  if (req.type === 'count') return req.token;
  if (req.type === 'flag') return `flag ${req.flag}`;
  const p = req.pred;
  switch (p.kind) {
    case 'resource':
      return `carried ${p.res} ≥ ${p.min}`;
    case 'banked':
      return `banked ${p.res} ≥ ${p.min}`;
    case 'belonging':
      return `own ${p.id}`;
    case 'skill':
      return `skill ${p.skill} ≥ ${p.min}`;
    case 'native':
      return `native ${p.key}`;
  }
}

/** Mount the cheatlist into its DEV-panel pane. Returns a `refresh` the panel calls on
 *  tab select + on its visible tick — the list rebuilds from the CURRENT state (cheap:
 *  a handful of rows; no reconcile needed for a DEV pane). */
export function mountRequirementsCheatlist(
  pane: HTMLElement,
  getState: () => GameState,
): { refresh: () => void } {
  const head = el('div');
  head.style.cssText = 'color:#b08d4f;font-size:11px;text-transform:uppercase;';
  const list = el('div');
  list.style.cssText = 'display:flex;flex-direction:column;gap:.25rem;font-size:12px;';
  const note = el(
    'div',
    'The player never sees this list — only the % bar and the completion flavor lines.',
  );
  note.style.cssText = 'color:#7a6c59;font-size:10px;';
  pane.append(head, list, note);

  const refresh = (): void => {
    const s = getState();
    const rank = currentRank(s);
    const prog = rungProgress(s);
    head.textContent = `${s.rung} · ${rank.title} — ${prog.percent}%${prog.ready ? ' (READY)' : ''}`;
    list.textContent = '';
    for (const req of rungRequirements(s.rung)) {
      const row = el('div');
      row.style.cssText = 'display:flex;gap:.4rem;align-items:baseline;';
      const done = isRequirementDone(req, s.rungReqs);
      const mark = el('span', done ? '✔' : '·');
      mark.style.cssText = `color:${done ? '#7fa15a' : '#7a6c59'};width:1em;`;
      const label = el('span', req.id);
      label.style.cssText = `color:${done ? '#7fa15a' : '#e7d9bc'};font-weight:700;`;
      const target = requirementTarget(req);
      const progress = el(
        'span',
        req.type === 'count'
          ? `${Math.min(s.rungReqs[req.id] ?? 0, target)}/${target}`
          : done
            ? 'done'
            : 'open',
      );
      progress.style.cssText = 'color:#b08d4f;';
      const mech = el('span', mechanics(req));
      mech.style.cssText = 'color:#7a6c59;font-size:10px;';
      row.append(mark, label, progress, mech);
      list.append(row);
    }
  };
  refresh();
  return { refresh };
}
