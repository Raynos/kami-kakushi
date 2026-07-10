// The works DISCOVERY chain (estate plan Phase 1 / ADR-177 — TST3, FB-338/FB-342):
// the day-book NAMES a concern → the player WALKS the zone and SEES the damage →
// Genemon's beat PRICES the work → the ladder stage OPENS. Nothing on the estate
// ladder is buyable before its fiction has fired. AC-20 glue: `worksPass` runs from
// the reducer tail (`finish`), BEFORE `triggerFlagScenes`, so a sighting latched here
// enqueues its pricing beat the same tick. Naming for U2–U4 derives from the RUNG
// (not a rank reward), so an old save past the rung self-heals on its next settle.

import type { GameState } from './state';
import { setFlag, hasFlag } from './state';
import { pushLog } from './log';
import { revealSurface } from './unlock';
import { enqueueScene } from './scenes';
import { rungNumber } from './ranks';
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

// ── ADR-143 — the DEV story set-switcher's core overlay (declaring-module setter,
//    the req-flavor/discovery pattern): works lines are CORE-emitted log text, so a
//    selected take swaps FUTURE emissions here; already-logged lines stay (T2). ──
let WORKS_OVERRIDE: Readonly<Record<string, string>> | null = null;

export function __setWorksFlavorOverride(map: Readonly<Record<string, string>> | null): void {
  WORKS_OVERRIDE = map;
}

/** Resolve a works line: the DEV take overlay wins, else the canon text. */
export function worksLine(key: string, canon: string): string {
  return WORKS_OVERRIDE?.[key] ?? canon;
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
  if (hasFlag(next, 'works-named-weir')) next = revealSurface(next, 'room-weir');
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
          { voice: 'narrator' },
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
            { voice: 'narrator' },
          ),
        };
        next = setFlag(next, z.seenFlag);
      }
    }
    // (4) every zone seen → the project's seen flag (its pricing beat's trigger).
    if (!hasFlag(next, p.seenFlag) && p.zones.every((z) => hasFlag(next, z.seenFlag))) {
      next = setFlag(next, p.seenFlag);
    }
  }
  return next;
}
