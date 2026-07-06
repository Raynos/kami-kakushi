// REAL-map diverge take — see docs/plans/fable-2026-07-06-estate-real-map-options.md.
// Built by a dedicated subagent; this module is the take's ONLY file.
import type { MapCtx } from './shared';
import type { GameState, Intent } from '../../core';
import { h } from './shared';

export function renderMapModelBoard(
  container: HTMLElement,
  ctx: MapCtx,
  state: GameState,
  dispatch: (intent: Intent) => void,
): void {
  void ctx;
  void state;
  void dispatch;
  container.append(h('div', undefined, '(model-board — under construction)'));
}
