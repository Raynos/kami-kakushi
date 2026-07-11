// The UI-reveal engine (ADR-179, PRD §6.2 core/unlock): visibility is DERIVED —
// a pure function of progression FACTS (the latched `rank-rN` flags, event
// fact-flags, discoveries, skills, resources) — never stored. The authored
// from-this-rung-on schedule stays in ranks.ts (`rewardOnReach.unlock`, read
// declaratively); a surface is visible iff its rung has been reached OR its own
// predicate holds. The save's only reveal-shaped field is `seenReveals`, the
// announce-once ceremony latch (sibling of `scenesPlayed`): it gates reveal
// LINES, never visibility — so an old save can never pin stale UI, and a
// reload never re-spams reveals.

import type { GameState, SurfaceId } from './state';
import { hasFlag } from './state';
import { pushLog } from './log';
import { SURFACES } from './content/surfaces';
import { RANKS, type RankId } from './content/ranks';

/** A rank's latched fact-flag (`rank-rN` — stamped by applyPromotion, never cleared,
 *  survives ascension; the `screen-demo-frontier` lesson: never the transient `s.rung`). */
const rankFlag = (id: RankId): string => `rank-${id.toLowerCase()}`;

/** surface id → the rung that grants it, built from the ranks schedule (one home: ranks.ts). */
const SURFACE_RUNG: ReadonlyMap<string, RankId> = (() => {
  const m = new Map<string, RankId>();
  for (const r of RANKS) {
    for (const id of r.rewardOnReach?.unlock ?? []) m.set(id, r.id);
  }
  return m;
})();

/** Is this surface granted by a reached rung? (false for surfaces outside the schedule). */
function grantedByRung(state: GameState, id: string): boolean {
  const rung = SURFACE_RUNG.get(id);
  return rung !== undefined && hasFlag(state, rankFlag(rung));
}

// Per-state memo — states are immutable, so render/reducers call visibleSet freely.
const memo = new WeakMap<GameState, ReadonlySet<SurfaceId>>();

/**
 * The derived visible set — the ONE visibility source (ADR-179). Computed as a
 * fixpoint over the registry: a predicate may key to ANOTHER surface's visibility
 * (its second arg — e.g. panel-home keys to tab-inventory), and the set only
 * grows per pass, so it converges in ≤ registry length (in practice 2 passes).
 */
export function visibleSet(state: GameState): ReadonlySet<SurfaceId> {
  const hit = memo.get(state);
  if (hit) return hit;
  const vis = new Set<SurfaceId>();
  for (let grew = true; grew; ) {
    grew = false;
    for (const s of SURFACES) {
      if (!vis.has(s.id) && (grantedByRung(state, s.id) || s.unlock(state, vis))) {
        vis.add(s.id);
        grew = true;
      }
    }
  }
  memo.set(state, vis);
  return vis;
}

export function isUnlocked(state: GameState, id: SurfaceId): boolean {
  return visibleSet(state).has(id);
}

// Chained/event surfaces whose entitling facts aren't a scheduled rung of their own —
// each resolves through the surface it keys to (so a re-rung carries these along) or
// names its event fact-flag directly. Kept beside the engine so the map can't drift
// from the predicates above it (surfaces.ts) without this file in the same review.
const SPECIAL_FACTS: Readonly<Record<string, () => Record<string, boolean>>> = {
  'verb-cook': () => factsForSurfaces('row-sansai'),
  'verb-eat-rice': () => factsForSurfaces('panel-rung-ladder'),
  'panel-home': () => factsForSurfaces('tab-inventory'),
  'panel-estate': () => ({ 'works-named-u1': true }),
  'room-weir': () => ({ 'works-named-weir': true }),
  'readout-coin': () => ({ 'coin-earned': true }),
  'verb-collect-wage': () => ({ 'rank-r5': true }),
};

/**
 * The fact-flags that ENTITLE the named surfaces (ADR-179) — the test/DEV bridge for
 * "make these visible": stamp the returned flags on a state and the surfaces derive.
 * Scheduled surfaces resolve to their rung's `rank-rN` flag (from the ranks.ts
 * schedule — the source of truth, never a copied list); chained/event surfaces via
 * SPECIAL_FACTS. Throws for a surface whose facts are NOT flags (the intro-cursor
 * reveals: readout-body/rice, room-forecourt — set `awake` + `introBeat` instead),
 * so a caller can't silently under-specify.
 */
export function factsForSurfaces(...ids: readonly SurfaceId[]): Record<string, boolean> {
  const flags: Record<string, boolean> = {};
  for (const id of ids) {
    const rung = SURFACE_RUNG.get(id);
    if (rung !== undefined) {
      flags[rankFlag(rung)] = true;
      continue;
    }
    const special = SPECIAL_FACTS[id];
    if (!special) throw new Error(`factsForSurfaces: no flag facts entitle "${id}"`);
    Object.assign(flags, special());
  }
  return flags;
}

/** The visible surfaces in registry order (the stable reveal order the QA proxies read). */
export function unlockedSurfaces(state: GameState): readonly SurfaceId[] {
  const vis = visibleSet(state);
  return SURFACES.filter((s) => vis.has(s.id)).map((s) => s.id);
}

/**
 * Announce-once ceremony pass (replaces the old push-based revealPass at the same
 * call sites: finish()/tick/load). Any visible-but-unannounced surface gets its
 * reveal line pushed (registry order) and is latched into `seenReveals` — which is
 * ONLY this announce cursor, never read for visibility. On load, a save whose
 * facts newly entitle a surface announces it once (the old back-reveal behavior);
 * a plain reload announces nothing.
 */
export function announcePass(state: GameState): GameState {
  const vis = visibleSet(state);
  let next = state;
  let seen: SurfaceId[] | null = null;
  for (const s of SURFACES) {
    if (!vis.has(s.id)) continue;
    if ((seen ?? next.seenReveals).includes(s.id)) continue;
    seen = seen ?? [...next.seenReveals];
    seen.push(s.id);
    if (s.revealLine) {
      next = {
        ...next,
        // FB-91/FB-93 — carry the reveal line's voice tag (narrator for scene prose) so it renders
        // in the same voice as the intro's narration, not as an un-voiced/plain line.
        log: pushLog(next.log, s.revealLine.channel, s.revealLine.text, next.clock.tick, {
          voice: s.revealLine.voice,
          // FB-273 — a fleeting reveal (readout-clock) lands in Now and fades, never Story.
          ephemeral: s.revealLine.ephemeral,
        }),
      };
    }
  }
  if (seen) next = { ...next, seenReveals: seen };
  return next;
}
