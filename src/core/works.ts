// The works DISCOVERY chain (estate plan Phase 1 / ADR-177 — TST3, FB-338/FB-342):
// the day-book NAMES a concern → the player WALKS the zone and SEES the damage →
// Genemon's beat PRICES the work → the ladder stage OPENS. Nothing on the estate
// ladder is buyable before its fiction has fired. AC-20 glue: `worksPass` runs from
// the reducer tail (`finish`), BEFORE `triggerFlagScenes`, so a sighting latched here
// enqueues its pricing beat the same tick. Naming for U2–U4 derives from the RUNG
// (not a rank reward), so an old save past the rung self-heals on its next settle.

import { storyText } from './content/story-overlay';
import type { GameState, SurfaceId } from './state';
import { setFlag, hasFlag } from './state';
import { pushLog } from './log';
import { enqueueScene } from './scenes';
import { rungNumber } from './ranks';
import { visibleSet } from './unlock';
import { getNode } from './content/map';
import { FLAVOR } from './content/flavor';
import type { EstateStageDef } from './content/estate';

export interface WorksZone {
  /** The map node whose visit reveals this concern. */
  readonly node: string;
  readonly seenFlag: string;
  /** The FLAVOR key of the sighting line (core-emitted; DEV-overridable). */
  readonly seenKey: keyof typeof FLAVOR;
}

export interface WorksProjectDef {
  /** The estate ladder stage this discovery chain opens (estate.ts U<stage>). */
  readonly stage: number;
  /** The rung whose arrival has the day-book name this concern (absent for U1 —
   *  the works-intro scene names it, at the board, R2+). */
  readonly namedAtRung?: number;
  /** The day-book naming line's FLAVOR key + its emit-once latch (U2–U4). */
  readonly namedKey?: keyof typeof FLAVOR;
  readonly namedLoggedFlag?: string;
  readonly namedFlag: string;
  /** All zones seen → the pricing beat's trigger flag (scenes.md works-u<stage>). */
  readonly seenFlag: string;
  /** The beat closed → the ladder stage is open to commission. */
  readonly openFlag: string;
  readonly zones: readonly WorksZone[];
}

export const WORKS_PROJECTS: readonly WorksProjectDef[] = [
  {
    stage: 1,
    namedFlag: 'works-named-u1',
    seenFlag: 'works-seen-u1',
    openFlag: 'works-open-u1',
    zones: [
      { node: 'gate', seenFlag: 'works-seen-gate', seenKey: 'worksSeenGate' },
      { node: 'paddies', seenFlag: 'works-seen-paddies', seenKey: 'worksSeenPaddies' },
      { node: 'woodshed', seenFlag: 'works-seen-woodshed', seenKey: 'worksSeenWoodshed' },
    ],
  },
  {
    stage: 2,
    namedAtRung: 5,
    namedKey: 'worksNamedOrchard',
    namedLoggedFlag: 'works-line-u2',
    namedFlag: 'works-named-u2',
    seenFlag: 'works-seen-u2',
    openFlag: 'works-open-u2',
    zones: [{ node: 'orchard', seenFlag: 'works-seen-orchard', seenKey: 'worksSeenOrchard' }],
  },
  {
    stage: 3,
    namedAtRung: 6,
    namedKey: 'worksNamedGranary',
    namedLoggedFlag: 'works-line-u3',
    namedFlag: 'works-named-u3',
    seenFlag: 'works-seen-u3',
    openFlag: 'works-open-u3',
    zones: [{ node: 'kura', seenFlag: 'works-seen-kura', seenKey: 'worksSeenKura' }],
  },
  {
    stage: 4,
    namedAtRung: 7,
    namedKey: 'worksNamedHouse',
    namedLoggedFlag: 'works-line-u4',
    namedFlag: 'works-named-u4',
    seenFlag: 'works-seen-u4',
    openFlag: 'works-open-u4',
    // The omoya has no walkable node — its shut rooms are SEEN from the forecourt.
    zones: [{ node: 'forecourt', seenFlag: 'works-seen-house', seenKey: 'worksSeenHouse' }],
  },
];

/** ADR-177 F3 — can a `work_project` act run right now? One predicate, shared by the
 *  reducer, the render affordance, and the sim (AC-6: shown == enforced). True iff a
 *  stage is commissioned and the player stands at one of its work zones. */
export function canWorkProject(state: GameState): boolean {
  if (state.estateCommission <= 0) return false;
  const p = WORKS_PROJECTS.find((x) => x.stage === state.estateCommission);
  if (!p) return false;
  return p.zones.some((z) => z.node === state.location);
}

/** The commissioned stage's work zones (for the site read / the sim's walk). */
export function worksSiteZones(stage: number): readonly string[] {
  return WORKS_PROJECTS.find((x) => x.stage === stage)?.zones.map((z) => z.node) ?? [];
}

/** Is the estate ladder stage open to commission (its pricing beat has closed)? */
export function stageOpen(state: GameState, stage: number): boolean {
  const p = WORKS_PROJECTS.find((x) => x.stage === stage);
  if (!p) return true; // a stage outside the chain (defensive) keeps the old behavior
  return hasFlag(state, p.openFlag);
}

/** The discovery read for a not-yet-open stage (TST4 — the card never guesses). */
export function stageDiscovery(state: GameState, stage: number): 'unnamed' | 'named' | 'open' {
  const p = WORKS_PROJECTS.find((x) => x.stage === stage);
  if (!p) return 'open';
  if (hasFlag(state, p.openFlag)) return 'open';
  return hasFlag(state, p.namedFlag) ? 'named' : 'unnamed';
}

/** Resolve a works line: the active take wins (step B, session-200 — the ONE story
 *  overlay; works keys live in the flavor space), else the canon text. */
export function worksLine(key: string, canon: string): string {
  return storyText(`flavor.${key}`) ?? canon;
}

/** The ladder stage's display strings, take-aware (U1's live in FLAVOR — worksU1*). */
export function stageLabel(def: EstateStageDef): string {
  return worksLine(`worksU${def.stage}Label`, def.label);
}
export function stageBlurb(def: EstateStageDef): string {
  return worksLine(`worksU${def.stage}Blurb`, def.blurb);
}
export function stageLogLine(def: EstateStageDef): string {
  return worksLine(`worksU${def.stage}Done`, def.logLine);
}

/** One settle-pass step of the discovery chain (pure; idempotent per tick). */
export function worksPass(state: GameState): GameState {
  let next = state;
  const rung = rungNumber(next.rung);
  // (0) the works-intro fires at the board: first forecourt presence at R2+ enqueues
  //     the scene (enqueueScene once-guards a played `once` def — never re-fires).
  if (rung >= 2 && next.location === 'forecourt') next = enqueueScene(next, 'works-intro');
  // (1) FB-342 — the weir path re-opens the moment the day-book names the lease.
  //     ADR-179 — the `works-named-weir` flag IS the fact; room-weir's visibility
  //     derives from it (surfaces.ts predicate), so there is nothing to push here.
  for (const p of WORKS_PROJECTS) {
    // Ladder order — a stage's discovery chain runs only while it is the NEXT stage
    // (the day-book names one concern at a time; Genemon never prices U3 over an
    // unbought U1, so the beats' prose can stand on the prior works being done).
    if (p.stage !== next.estateStage + 1) continue;
    // (2) rung-derived naming (U2–U4): arriving at the rung names the concern; the
    //     day-book line emits exactly once (its own latch, separate from the flag so
    //     an old save past the rung still gets the flag without a duplicate line).
    if (p.namedAtRung !== undefined && rung >= p.namedAtRung && !hasFlag(next, p.namedFlag)) {
      next = setFlag(next, p.namedFlag);
    }
    if (
      p.namedKey !== undefined &&
      p.namedLoggedFlag !== undefined &&
      hasFlag(next, p.namedFlag) &&
      !hasFlag(next, p.namedLoggedFlag)
    ) {
      next = {
        ...next,
        log: pushLog(
          next.log,
          'milestone',
          worksLine(p.namedKey, FLAVOR[p.namedKey]),
          next.clock.tick,
          // The save persists the KEY; the words re-render from FLAVOR on load.
          { voice: 'narrator', contentKey: `works.${p.namedKey}` },
        ),
      };
      next = setFlag(next, p.namedLoggedFlag);
    }
    if (!hasFlag(next, p.namedFlag)) continue;
    // (3) the sighting: standing in a named zone latches its seen flag + the line.
    for (const z of p.zones) {
      if (next.location === z.node && !hasFlag(next, z.seenFlag)) {
        next = {
          ...next,
          log: pushLog(
            next.log,
            'narration',
            worksLine(z.seenKey, FLAVOR[z.seenKey]),
            next.clock.tick,
            { voice: 'narrator', contentKey: `works.${z.seenKey}` },
          ),
        };
        next = setFlag(next, z.seenFlag);
      }
    }
    // (4) every REACHABLE zone seen → the project's seen flag (its pricing beat's trigger).
    //     ADR-184 — a named zone the player cannot yet walk to does not hold the chain hostage:
    //     U1's concerns are the gate, the paddies and the WOODSHED, and the woodshed corner now
    //     opens at R4 (it rides the home grant it promises). Requiring a sighting there would have
    //     stalled the whole works ladder from R2 to R4. So the chain prices what you can actually
    //     get to and look at — and the un-walked zone still emits its own sighting line later, when
    //     it opens (step 3 above keeps its per-zone latch). Derived from the SAME visible set the
    //     map is gated by (ADR-179), so any future re-mapping carries this for free.
    const vis = visibleSet(next);
    const reachable = p.zones.filter((z) => {
      const flag = getNode(z.node).revealFlag;
      return flag === undefined || vis.has(flag as SurfaceId);
    });
    if (
      !hasFlag(next, p.seenFlag) &&
      reachable.length > 0 &&
      reachable.every((z) => hasFlag(next, z.seenFlag))
    ) {
      next = setFlag(next, p.seenFlag);
    }
  }
  return next;
}
