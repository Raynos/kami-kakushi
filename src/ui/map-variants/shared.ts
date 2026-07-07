// Shared plumbing for the REAL-map diverge variants (HR-7 re-scope, the
// fable-2026-07-06-estate-real-map-options.md plan). Each variant lives in its
// OWN module in this directory (one Fable-5 xhigh subagent each — disjoint
// files, zero merge conflicts) and is imported ONLY by src/ui/dev.ts, so the
// whole directory tree-shakes out of prod with the DEV harness.
import type { GameState, Intent } from '../../core';
import { canMove, getNode, MAP_NODES } from '../../core';

/** The navigation context dev.ts builds once per render — identical to the
 *  legacy MapNavCtx shape (structural). Every variant renders from THIS +
 *  the live GameState; movement goes through ctx.move (the real move_to). */
export interface MapCtx {
  readonly here: string;
  readonly revealed: ReadonlySet<string>;
  readonly condOk: boolean;
  readonly neighbours: readonly { readonly id: string }[];
  readonly move: (id: string) => void;
  readonly gateReason: string;
}

export type MapVariantRender = (
  container: HTMLElement,
  ctx: MapCtx,
  state: GameState,
  dispatch: (intent: Intent) => void,
) => void;

/** tiny element helper (mirrors render.ts `el` without importing it — no cycle) */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

/** Is `id` a live one-step walk from here (per the ctx)? */
export function isNeighbour(ctx: MapCtx, id: string): boolean {
  return ctx.neighbours.some((n) => n.id === id);
}

/** The revealed node set (BFS from the kura over revealed ground), node → depth. */
export function revealedDepths(revealed: ReadonlySet<string>): Map<string, number> {
  const depths = new Map<string, number>();
  const start = 'kura';
  depths.set(start, 0);
  const q = [start];
  while (q.length > 0) {
    const id = q.shift()!;
    const d = depths.get(id)!;
    for (const nb of getNode(id).neighbors) {
      if (depths.has(nb)) continue;
      if (!canMove(id, nb, revealed)) continue;
      depths.set(nb, d + 1);
      q.push(nb);
    }
  }
  return depths;
}

/** Undiscovered ground one step past revealed nodes (the fog frontier):
 *  id → the revealed node it hangs off. NEVER name these (reveal-as-plot). */
export function fogFrontier(revealed: ReadonlySet<string>): Map<string, string> {
  const depths = revealedDepths(revealed);
  const fog = new Map<string, string>();
  for (const id of depths.keys()) {
    for (const nb of getNode(id).neighbors) {
      if (!depths.has(nb) && !fog.has(nb)) fog.set(nb, id);
    }
  }
  return fog;
}

/** Wire a node element as a real travel control (button-like): dispatches the
 *  real move; stamps data-node for the shared click tests. */
export function wireTravel(elm: HTMLElement, id: string, ctx: MapCtx): void {
  elm.dataset.node = id;
  elm.dataset.actKey = `move_to:${id}`; // ADR-148 Ph3 — the walk paints on the node itself
  elm.style.cursor = 'pointer';
  elm.setAttribute('role', 'button');
  elm.tabIndex = 0;
  elm.addEventListener('click', () => ctx.move(id));
  elm.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).key === 'Enter') ctx.move(id);
  });
}

/** Stamp a gated (danger-ring, conditioning unmet) node: inert + the reason. */
export function wireGated(elm: HTMLElement, id: string, ctx: MapCtx): void {
  elm.dataset.node = id;
  elm.dataset.locked = '1';
  elm.setAttribute('aria-disabled', 'true');
  elm.title = ctx.gateReason;
}

export { MAP_NODES, getNode, canMove };
