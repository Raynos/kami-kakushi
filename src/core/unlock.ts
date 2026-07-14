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
import { SURFACES, type Surface } from './content/surfaces';
import { MAP_NODES } from './content/map';
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
      if (
        !vis.has(s.id) &&
        (grantedByRung(state, s.id) || s.unlock(state, vis))
      ) {
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
  'verb-cook': () => factsForSurfaces('room-kitchen'), // ADR-184 — the verb arrives with its pot
  'verb-eat-rice': () => factsForSurfaces('tab-skills'), // FB-369 re-home: keys to the Character tab's anchor (R2)
  'panel-home': () => factsForSurfaces('tab-inventory'),
  'panel-estate': () => ({ 'works-named-u1': true }),
  'room-weir': () => ({ 'works-named-weir': true }),
  'readout-coin': () => ({ 'coin-earned': true }),
  'verb-collect-wage': () => ({ 'rank-r5': true }),
  // ADR-184 — the five VN-revealed zones: each keys to the fact its side-quest VN latches
  // (reveals.ts enqueues the scene; the scene's options — or, for the narration-only
  // `sb-lease`, its completion effect — set the flag). No rung entitles them.
  'room-gate': () => ({ 'told-of-the-stall': true }), // sb-market
  'room-kitchen': () => ({ 'taught-to-cook': true }), // sb-cook
  'room-field-margins': () => ({ 'racks-raided': true }), // sb-racks
  'room-weir-reeds': () => ({ 'screens-charged': true }), // sb-lease
  'room-sickroom': () => ({ 'tended-by-soan': true }), // sb-sickroom
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
export function factsForSurfaces(
  ...ids: readonly SurfaceId[]
): Record<string, boolean> {
  const flags: Record<string, boolean> = {};
  for (const id of ids) {
    const rung = SURFACE_RUNG.get(id);
    if (rung !== undefined) {
      flags[rankFlag(rung)] = true;
      continue;
    }
    const special = SPECIAL_FACTS[id];
    if (!special)
      throw new Error(`factsForSurfaces: no flag facts entitle "${id}"`);
    Object.assign(flags, special());
  }
  return flags;
}

/** The visible surfaces in registry order (the stable reveal order the QA proxies read). */
export function unlockedSurfaces(state: GameState): readonly SurfaceId[] {
  const vis = visibleSet(state);
  return SURFACES.filter((s) => vis.has(s.id)).map((s) => s.id);
}

// ── ADR-184 — the zone-ANNOUNCE mode (an open diverge; human, 2026-07-12: "implement both") ──
// A VN-revealed zone (surfaces.ts `vnReveal`) is opened by its side-quest scene, and the question
// the human wants to FEEL is whether the scene's own prose is the whole reveal, or whether the zone
// also inks onto the map with a line of its own afterwards. Both ship; prod runs the first. The DEV
// panel's Reveal-mode toggle flips this at runtime (the declaring-module DEV-setter pattern, as
// `__setDiscoveryFlavorOverride`) — inert in prod, where nothing ever calls it.
export type ZoneRevealMode = 'vn' | 'vn+ink';
let ZONE_REVEAL_MODE: ZoneRevealMode = 'vn';

/** DEV-only: switch the zone-announce mode ('vn' = the scene is the whole reveal — the default). */
export function __setZoneRevealMode(mode: ZoneRevealMode): void {
  ZONE_REVEAL_MODE = mode;
}
export function zoneRevealMode(): ZoneRevealMode {
  return ZONE_REVEAL_MODE;
}

/**
 * ADR-184 — the derived reveal RE-ARM. `seenReveals` is an announce LATCH that never un-latches,
 * so a re-mapping (a zone moved between rungs, or out of the schedule into a VN) would leave an old
 * save with that zone SILENTLY re-granted later — already "announced", years ago, at a rung it no
 * longer belongs to. So any `room-*` id that is latched but NOT in the current visible set drops out
 * of the latch and will announce again when its new fact arrives. Zero new save fields; self-healing
 * for every future re-mapping. SAFE BY CONSTRUCTION: every zone's predicate is a permanently-latching
 * fact (a `rank-rN` flag, or an event flag a scene sets), so nothing un-reveals for an innocent
 * reason — and the scope is `room-*` only, so verbs/panels/readouts keep their latch untouched.
 */
function rearmZoneReveals(
  state: GameState,
  vis: ReadonlySet<SurfaceId>,
): GameState {
  const kept = state.seenReveals.filter(
    (id) => !id.startsWith('room-') || vis.has(id),
  );
  if (kept.length === state.seenReveals.length) return state;
  return { ...state, seenReveals: kept };
}

/** The line a surface announces with, in the mode that announces one. A VN-revealed zone usually
 *  carries no authored line (its scene said it), so the 'vn+ink' alternate inks it in with the
 *  zone's own MAP BLURB — the one text that already describes it (TST1: one source, no new prose
 *  invented for a DEV variant). Resolved HERE, at announce time, and never in the surfaces registry:
 *  that array is built at module init, and reaching into map.ts from it closes an import cycle
 *  (surfaces → map → flavor) whose TDZ error takes the whole core down. */
function announceLine(s: Surface): Surface['revealLine'] {
  if (s.revealLine) return s.revealLine;
  if (s.vnReveal !== true) return undefined;
  const node = MAP_NODES.find((n) => n.revealFlag === s.id);
  if (!node) return undefined;
  // keyless-ok: the announce emit below attaches contentKey `reveal.<surface-id>`.
  return { channel: 'narration', text: node.blurb, voice: 'narrator' };
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
  let next = rearmZoneReveals(state, vis);
  let seen: SurfaceId[] | null = null;
  for (const s of SURFACES) {
    if (!vis.has(s.id)) continue;
    if ((seen ?? next.seenReveals).includes(s.id)) continue;
    seen = seen ?? [...next.seenReveals];
    seen.push(s.id);
    // ADR-184 — a VN-revealed zone's line is the map-ink ALTERNATE: suppressed in the shipped
    // 'vn' mode (the scene that opened the zone already said it), emitted in DEV 'vn+ink'.
    if (s.vnReveal === true && ZONE_REVEAL_MODE !== 'vn+ink') continue;
    const line = announceLine(s);
    if (line) {
      next = {
        ...next,
        // FB-91/FB-93 — carry the reveal line's voice tag (narrator for scene prose) so it renders
        // in the same voice as the intro's narration, not as an un-voiced/plain line.
        log: pushLog(next.log, line.channel, line.text, next.clock.tick, {
          voice: line.voice,
          // FB-273 — a fleeting reveal (readout-clock) lands in Now and fades, never Story.
          ephemeral: line.ephemeral,
          // The save persists this KEY, not the prose (save-format plan, step 1). The text above
          // is for the live session; on load it re-renders from THIS surface's revealLine, so a
          // reworded reveal updates every existing save instead of freezing the old words.
          contentKey: `reveal.${s.id}`,
        }),
      };
    }
  }
  if (seen) next = { ...next, seenReveals: seen };
  return next;
}
