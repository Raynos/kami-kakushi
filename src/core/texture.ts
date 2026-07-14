// The ambient log-texture emitter (C4.3) — the bible §0.5 "flavor in the log" half,
// authored in flavor.md (season*/weather*/gossip* — 40+ lines that shipped with ZERO
// consumers). Rolls at most ONE authored line per world beat:
//   - an ordinary DAY boundary → a season/weather line (TEXTURE_DAY_CHANCE);
//   - a MARKET-day boundary → a stall-gossip line first (TEXTURE_MARKET_CHANCE);
//   - the SEASON turn → one incoming-season line, always (the wheel's own breath).
// All rolls ride the seeded `worldgen` stream (its own named stream — texture never
// perturbs a combat/loot replay). Lines are EPHEMERAL (FB-53): they breathe in the
// Now view and fade — texture goes to the log, never the VN, and never clutters
// Story. Pure + deterministic; cadence levers live in balance.ts (cockpit, ADR-132).

import type { GameState } from './state';
import type { Season } from './constants';
import { applyRewards } from './rewards';
import { nextFloat } from './rng';
import { FLAVOR } from './content/flavor';
import { isMarketDay } from './content/market';
import { TEXTURE_DAY_CHANCE, TEXTURE_MARKET_CHANCE } from './content/balance';

/** FLAVOR entries by prefix — derived from the generated registry, never a hand list, so a
 *  newly-authored gossip/weather line joins its pool by existing (FB-5).
 *
 *  Carries the FLAVOR **key** alongside the text (it used to drop it and keep the string only).
 *  The key is a stable id, so a texture line persists as `flavor.<key>` and re-renders from
 *  FLAVOR on load — reword an ambient line and every existing save follows (save-format plan,
 *  step 1). Still sorted BY TEXT, exactly as before, so the seeded pick for a given RNG draw is
 *  byte-for-byte the line it always was: this refactor must not move the world. */
type TextureLine = readonly [key: string, text: string];
function pool(prefix: string): TextureLine[] {
  return Object.entries(FLAVOR)
    .filter(([k, v]) => k.startsWith(prefix) && typeof v === 'string')
    .map(([k, v]) => [k, v as string] as TextureLine)
    .sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));
}

/** The season key prefix ('new-year' → 'seasonNewyear', 'winter' → 'seasonWinter'). */
function seasonPrefix(season: Season): string {
  const flat = season.replace(/-(\w)/g, (_, c: string) => c);
  return `season${flat[0]!.toUpperCase()}${flat.slice(1).toLowerCase()}`;
}

function emit(state: GameState, line: TextureLine): GameState {
  return applyRewards(state, {
    log: [
      {
        channel: 'narration',
        voice: 'narrator',
        text: line[1],
        ephemeral: true,
        contentKey: `flavor.${line[0]}`,
      },
    ],
  });
}

function roll(
  state: GameState,
  lines: readonly TextureLine[],
): [TextureLine | null, GameState] {
  if (lines.length === 0) return [null, state];
  const [v, rng] = nextFloat(state.rng, 'worldgen');
  const next = { ...state, rng };
  return [lines[Math.floor(v * lines.length)]!, next];
}

/** The DAY-boundary texture pass (called from step.ts once per rolled day). Pre-wake the
 *  world stays silent (the cold open owns its own air). At most one line lands. */
export function textureDayPass(state: GameState): GameState {
  if (state.flags.awake !== true) return state;
  // market days gossip first — the stall is where the valley's news crosses the gate
  if (isMarketDay(state.clock.day)) {
    const [chance, withRoll] = nextFloat(state.rng, 'worldgen');
    let next = { ...state, rng: withRoll };
    if (chance < TEXTURE_MARKET_CHANCE) {
      const [line, rolled] = roll(next, pool('gossip'));
      next = rolled;
      if (line) return emit(next, line);
    }
    return next;
  }
  const [chance, withRoll] = nextFloat(state.rng, 'worldgen');
  let next = { ...state, rng: withRoll };
  if (chance < TEXTURE_DAY_CHANCE) {
    const [line, rolled] = roll(next, [
      ...pool(seasonPrefix(next.season)),
      ...pool('weather'),
    ]);
    next = rolled;
    if (line) return emit(next, line);
  }
  return next;
}

/** The SEASON-turn texture line (called from the exit pipeline AFTER the wheel turns):
 *  the incoming season announces itself — one authored line, always. */
export function textureSeasonTurn(state: GameState): GameState {
  if (state.flags.awake !== true) return state;
  const [line, next] = roll(state, pool(seasonPrefix(state.season)));
  return line ? emit(next, line) : next;
}
