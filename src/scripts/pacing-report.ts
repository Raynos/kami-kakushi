// Headless time-per-rung pacing report (audit G-PACING). Drives the focused-optimal
// auto-play path per rung on the single shipped profile (D-056 — the DEMO/REAL fork is
// retired) using the REAL engine (createInitialState + reduce — NOT a re-derived formula,
// so the "model" cannot drift from the game), converts dispatched intents → modeled
// wall-minutes via the 480ms active-loop cadence, prints a per-rung table, and flags any
// T0 climb rung OUT of the sane T0 band (T0 is ≥30-min-floor-EXEMPT; the floor gates from
// T1). `--check` is the G-PACING gate (in `npm run verify` via the pacing:check script).
//
// Model: the active-only loop dispatches exactly ONE intent per AUTO_REPEAT_MS while
// focused, so modeled wall-time per rung = (intents to clear that rung) × AUTO_REPEAT_MS.
// Intents = productive acts (cheapest eligible activity = focused-optimal) + rests
// (the auto-loop's satiety<25% rule) + per-rung meta verbs (open_eyes at R0; face_wolf
// at R2 to satisfy the storyGate). In-game days are flavour; the FLOOR is on wall-minutes.
export {};

import {
  createInitialState,
  reduce,
  availableActions,
  canDoActivity,
  getActivity,
  satietyMax,
  getRank,
  RANKS,
  balance,
  ACTIVITIES,
  isUnlocked,
  skillLevel,
  reachableFrom,
  type GameState,
  type ActivityId,
  type Intent,
} from '../core';

const {
  AUTO_REPEAT_MS,
  RUNG_WALL_FLOOR_MIN,
  T0_PACING_BAND_MIN,
  T0_PACING_BAND_MAX,
  rungThreshold,
} = balance;
const SEED = 20260626;

export interface RungPacing {
  rung: string;
  title: string;
  threshold: number;
  act: string;
  acts: number;
  rests: number;
  meta: number;
  intents: number;
  wallMin: number;
  inGameDays: number;
  terminal: boolean;
  /** T0 (D-056): true when a climb rung falls OUTSIDE the sane T0 band (too fast/too slow). */
  outOfBand: boolean;
}

interface RungTrack {
  acts: number;
  rests: number;
  meta: number;
  startTick: number;
  endTick: number;
  act: string;
}

/** BFS the REVEALED map graph for the first hop from `from` toward `to` (null if here/unreachable).
 *  v0.3.1 Step 5: the focused-optimal path now WALKS to a labour's node before working it. */
function nextHopToward(from: string, to: string, revealed: ReadonlySet<string>): string | null {
  if (from === to) return null;
  const cameFrom = new Map<string, string>();
  const seen = new Set<string>([from]);
  const queue: string[] = [from];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const nb of reachableFrom(cur, revealed)) {
      if (seen.has(nb.id)) continue;
      seen.add(nb.id);
      cameFrom.set(nb.id, cur);
      if (nb.id === to) {
        let step = nb.id;
        while (cameFrom.get(step) !== from) step = cameFrom.get(step)!;
        return step;
      }
      queue.push(nb.id);
    }
  }
  return null;
}

/** Cheapest (lowest-satiety) rung-eligible labour ANYWHERE reachable, + its node — the focused-
 *  optimal pick under the spatial model. Un-revealed, danger-gated, and unreachable labours are
 *  excluded, so the harness only ever heads for a labour it can actually reach and do. */
function cheapestEligibleGlobal(s: GameState): { id: ActivityId; node: string } | null {
  const elig = new Set(getRank(s.rung).eligible);
  const revealed = new Set(s.unlocked);
  const opts = ACTIVITIES.filter((a) => {
    if (!elig.has(a.id)) return false;
    if (!isUnlocked(s, a.surface)) return false;
    if (a.dangerRing && skillLevel(s, 'conditioning') < balance.CONDITIONING_GATE_LEVEL)
      return false;
    return a.area === s.location || nextHopToward(s.location, a.area, revealed) !== null;
  }).sort((a, b) => a.satietyCost - b.satietyCost);
  const best = opts[0];
  return best ? { id: best.id, node: best.area } : null;
}

/**
 * The focused-optimal next intent for the auto-play harness (returns null when stuck/terminal).
 * The SINGLE source of this policy — both `walkPacing` (here) and `playcheck`'s reward trace drive
 * it, so the two can never silently desync. Order: open_eyes > rest-if-starving > rake_rice >
 * face_wolf@R2 > WALK-to / do the cheapest-eligible labour (spatial, v0.3.1 Step 5).
 */
export function focusedOptimalIntent(s: GameState): Intent | null {
  const acts = availableActions(s);
  if (acts.includes('open_eyes')) return { type: 'open_eyes' };
  if (s.character.satiety < satietyMax(s) * 0.25 && acts.includes('rest')) return { type: 'rest' };
  if (acts.includes('rake_rice')) return { type: 'rake_rice' };
  if (s.rung === 'R2' && !s.flags['first-fight-survived'] && s.rungMeter >= rungThreshold('R2')) {
    return { type: 'face_wolf' };
  }
  const target = cheapestEligibleGlobal(s);
  if (!target) return null;
  if (target.node === s.location && canDoActivity(s, getActivity(target.id))) {
    return { type: 'do_activity', activityId: target.id };
  }
  const hop = nextHopToward(s.location, target.node, new Set(s.unlocked));
  return hop ? { type: 'move_to', to: hop } : null;
}

export function walkPacing(seed = SEED): RungPacing[] {
  let s = createInitialState(seed);
  const t: Record<string, RungTrack> = {};
  const abs = (): number => s.clock.day * 24 + s.clock.tick;
  const touch = (r: string): RungTrack =>
    (t[r] ??= { acts: 0, rests: 0, meta: 0, startTick: abs(), endTick: abs(), act: '-' });
  let guard = 0;
  while (s.rung !== 'R3' && guard++ < 1_000_000) {
    const cur = touch(s.rung);
    const intent = focusedOptimalIntent(s);
    if (!intent) break;
    s = reduce(s, intent);
    if (intent.type === 'open_eyes' || intent.type === 'face_wolf') cur.meta++;
    else if (intent.type === 'rest') cur.rests++;
    else if (intent.type === 'rake_rice') {
      cur.acts++;
      cur.act = 'rake_rice';
    } else if (intent.type === 'do_activity') {
      cur.acts++;
      cur.act = intent.activityId;
    }
    cur.endTick = abs();
  }

  const rows: RungPacing[] = [];
  for (const rank of RANKS) {
    const c = t[rank.id];
    const threshold = rungThreshold(rank.id);
    const terminal = rank.id === 'R3' && rank.storyGate({}) === false;
    if (!c) {
      rows.push({
        rung: rank.id,
        title: rank.title,
        threshold,
        act: '-',
        acts: 0,
        rests: 0,
        meta: 0,
        intents: 0,
        wallMin: 0,
        inGameDays: 0,
        terminal,
        outOfBand: false,
      });
      continue;
    }
    const intents = c.acts + c.rests + c.meta;
    const wallMin = (intents * AUTO_REPEAT_MS) / 1000 / 60;
    rows.push({
      rung: rank.id,
      title: rank.title,
      threshold,
      act: c.act,
      acts: c.acts,
      rests: c.rests,
      meta: c.meta,
      intents,
      wallMin,
      inGameDays: (c.endTick - c.startTick) / 24,
      terminal,
      outOfBand: !terminal && (wallMin < T0_PACING_BAND_MIN || wallMin > T0_PACING_BAND_MAX),
    });
  }
  return rows;
}

// ── CLI: (no flag) print the table · --check (exit 1 if any T0 climb rung is OUT OF BAND).
//    D-056: ONE profile now — T0 is ≥30-floor-EXEMPT, gated instead on the sane T0 band
//    [T0_PACING_BAND_MIN, T0_PACING_BAND_MAX] = [3, 22] min. Guarded so importing this from a
//    test does NOT run the CLI. ──
const RUN_AS_CLI = process.argv[1]?.includes('pacing-report') ?? false;
if (RUN_AS_CLI) {
  const check = process.argv.includes('--check');
  const rows = walkPacing();
  console.log(
    `Pacing report — single profile (D-056)  (T0 band ${T0_PACING_BAND_MIN}–${T0_PACING_BAND_MAX} min/climb-rung; ≥${RUNG_WALL_FLOOR_MIN}-floor gates from T1)`,
  );
  console.log(
    'rung  title          thr     act            acts   rests  intents  wall(min)  ~days  band',
  );
  for (const r of rows) {
    const flag = r.terminal ? 'TERMINAL' : r.intents === 0 ? '-' : r.outOfBand ? 'OUT' : 'OK';
    console.log(
      `${r.rung.padEnd(5)} ${r.title.padEnd(14)} ${String(r.threshold).padStart(6)} ${r.act.padEnd(13)} ${String(r.acts).padStart(6)} ${String(r.rests).padStart(6)} ${String(r.intents).padStart(8)} ${r.wallMin.toFixed(2).padStart(9)} ${r.inGameDays.toFixed(0).padStart(6)}  ${flag}`,
    );
  }
  const climb = rows.filter((r) => !r.terminal && r.intents > 0);
  const fails = climb.filter((r) => r.outOfBand);
  console.log(
    `SUMMARY: ${climb.length} climb rungs, min ${Math.min(...climb.map((r) => r.wallMin)).toFixed(2)} / max ${Math.max(...climb.map((r) => r.wallMin)).toFixed(2)} min; T0 band ${T0_PACING_BAND_MIN}–${T0_PACING_BAND_MAX}: ${fails.length ? 'FAIL (' + fails.map((r) => r.rung).join(',') + ')' : 'PASS'}`,
  );
  if (check) process.exit(fails.length ? 1 : 0);
}
