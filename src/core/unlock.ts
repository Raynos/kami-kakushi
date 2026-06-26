// The UI-reveal engine (PRD §6.2 core/unlock): predicate evaluation over the
// authored surface schedule. reduce/tick call revealPass to ADD newly-earned
// surfaces to the stored write-once `unlocked` latch; reads are pure projections of
// that Set, never a live predicate re-eval (so reloading never re-spams reveals).

import type { GameState, SurfaceId } from './state';
import { pushLog } from './log';
import { SURFACES } from './content/surfaces';

export function isUnlocked(state: GameState, id: SurfaceId): boolean {
  return state.unlocked.includes(id);
}

export function unlockedSurfaces(state: GameState): readonly SurfaceId[] {
  return state.unlocked;
}

/** Latch one surface (write-once) and push its reveal line, if any. */
export function revealSurface(state: GameState, id: SurfaceId): GameState {
  if (state.unlocked.includes(id)) return state;
  const surface = SURFACES.find((s) => s.id === id);
  let next: GameState = { ...state, unlocked: [...state.unlocked, id] };
  if (surface?.revealLine) {
    next = {
      ...next,
      log: pushLog(next.log, surface.revealLine.channel, surface.revealLine.text, next.clock.tick),
    };
  }
  return next;
}

/**
 * Reveal newly-earned surfaces in registry order — a single pass (reveals are
 * design-staggered one-per-beat by the authored schedule, FU4). A surface whose
 * predicate only becomes true because of another reveal in the same pass is caught
 * on the next reduce/tick — intentional, never a multi-beat dump.
 */
export function revealPass(state: GameState): GameState {
  let next = state;
  for (const s of SURFACES) {
    if (!next.unlocked.includes(s.id) && s.unlock(next)) {
      next = revealSurface(next, s.id);
    }
  }
  return next;
}
