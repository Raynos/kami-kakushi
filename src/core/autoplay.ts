// The canonical focused-optimal auto-play policy (the SINGLE source of "what would a perfect
// player do next"). It is pure and navigation-aware: under the spatial model (v0.3.1 Step 5) the
// optimal path WALKS to a labour's node before working it, and walks back to the kura for the
// scripted wolf. Everything that auto-drives the real engine consumes this ONE function so they can
// never silently desync — the pacing report + the G-PACING gate (walkPacing), the playcheck reward
// trace, the full-arc e2e / invariants tests, and the DEV `__qa.toRung` climber.

import type { GameState } from './state';
import type { Intent } from './intents';
import { availableActions } from './intents';
import { canDoActivity, satietyMax } from './selectors';
import { ACTIVITIES, getActivity, type ActivityId } from './content/activities';
import { getRank } from './content/ranks';
import { reachableFrom } from './content/map';
import { getMob } from './content/enemies';
import { getWeapon } from './content/weapons';
import { durabilityBand } from './combat';
import { isUnlocked } from './unlock';
import { skillLevel } from './skills';
import {
  rungThreshold,
  CONDITIONING_GATE_LEVEL,
  STAMINA_FLAT_ABOVE,
  REPAIR_WOOD_COST,
} from './content/balance';
import { introActive, introSceneAt } from './content/intro';
import { promotionReady, pendingPromotionTarget } from './ranks';
import { RUNG_BEATS } from './content/rungBeats';

/** BFS the REVEALED map graph for the first hop from `from` toward `to` (null if here/unreachable).
 *  The focused-optimal path uses this to WALK to a labour's node before working it. */
export function nextHopToward(
  from: string,
  to: string,
  revealed: ReadonlySet<string>,
): string | null {
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
export function cheapestEligibleGlobal(s: GameState): { id: ActivityId; node: string } | null {
  const elig = new Set(getRank(s.rung).eligible);
  const revealed = new Set(s.unlocked);
  const opts = ACTIVITIES.filter((a) => {
    if (!elig.has(a.id)) return false;
    if (!isUnlocked(s, a.surface)) return false;
    if (a.dangerRing && skillLevel(s, 'conditioning') < CONDITIONING_GATE_LEVEL) return false;
    return a.area === s.location || nextHopToward(s.location, a.area, revealed) !== null;
  }).sort((a, b) => a.satietyCost - b.satietyCost);
  const best = opts[0];
  return best ? { id: best.id, node: best.area } : null;
}

/**
 * The focused-optimal next intent for an auto-play harness (returns null when stuck/terminal).
 * Order: open_eyes > (complete the intro) > drive an OPEN rung beat > TRIGGER a ready rung beat >
 * rest-if-starving > rake_rice > (walk-to-then-)face the scripted wolf @R2 > WALK-to / do the
 * cheapest-eligible labour (spatial, v0.3.1 Step 5).
 *
 * ADR-110: promotion is no longer an auto-hot-path side effect — the perfect player must (a) answer
 * the intro's VN scenes, then (b) TRIGGER each ready rung beat (`begin_rung_beat`) and complete it
 * (`choose_rung_option`). The beat drivers pick the FIRST decision option deterministically (the
 * exact pick is relationship/flag flavour; the climb is identical whichever is chosen).
 */
/**
 * The SHIPPED auto-mode's next intent (FB-4 Ph3) — the pure decision the app loop's `autoStep`
 * dispatched inline until now, extracted so the app loop AND the idler persona consume the SAME
 * function and can never desync (the exact no-desync move `focusedOptimalIntent` already made).
 * Decision order preserved verbatim: auto-COMBAT (rest below the knee > repair a worn blade when
 * wood allows > STOP on Broken with no wood > fight) > auto-RAKE (clear when illegal > rest > rake)
 * > auto-LABOUR (rest > do > clear when undoable). Returns null when NO auto mode is armed (or the
 * armed labour just cleared) — the loop idles. The DOM guards (paused / document.hidden / crashed)
 * stay in main.ts; they are app concerns, not decisions.
 */
export function autoModeIntent(s: GameState): Intent | null {
  const belowKnee = (): boolean =>
    s.character.satiety < satietyMax(s) * STAMINA_FLAT_ABOVE &&
    availableActions(s).includes('rest');
  // auto-fight takes priority over auto-labour
  if (s.autoCombat) {
    if (belowKnee()) return { type: 'rest' };
    // auto-manage durability: repair when wood allows; if Broken with no wood, STOP auto-combat
    // rather than grind at ~0% (the reducer voices the weapon-broken stop line).
    const weapon = getWeapon(s.equippedWeapon);
    const band = durabilityBand(s.weaponDurability, weapon.durabilityMax);
    const worn = band.name === 'Battered' || band.name === 'Broken';
    if (worn && (s.resources.wood ?? 0) >= REPAIR_WOOD_COST) return { type: 'repair_weapon' };
    if (band.name === 'Broken') {
      return { type: 'set_auto_combat', mobId: null, reason: 'weapon-broken' };
    }
    return { type: 'fight', mobId: s.autoCombat, retreat: s.autoCombatRetreat };
  }
  // auto-rake the R0 cold-open; clears itself once raking is no longer legal (R1).
  if (s.autoRake) {
    if (!availableActions(s).includes('rake_rice')) return { type: 'set_auto_rake', on: false };
    if (belowKnee()) return { type: 'rest' };
    return { type: 'rake_rice' };
  }
  const auto = s.autoActivity;
  if (!auto) return null;
  const act = getActivity(auto);
  if (belowKnee()) return { type: 'rest' };
  if (canDoActivity(s, act)) return { type: 'do_activity', activityId: auto };
  return { type: 'set_auto', activityId: null };
}

export function focusedOptimalIntent(s: GameState): Intent | null {
  const acts = availableActions(s);
  if (acts.includes('open_eyes')) return { type: 'open_eyes' };
  // (a) answer the intro's VN scenes before working — pick the first closer, deterministically.
  if (introActive(s.introBeat)) {
    const scene = introSceneAt(s.introBeat);
    const opt = scene?.decision.options[0];
    if (opt) return { type: 'choose_intro', optionId: opt.id };
  }
  // (b) drive an OPEN rung beat to its terminal choice (applies the promotion), or TRIGGER a ready one.
  if (s.rungBeat !== null) {
    const opt = RUNG_BEATS[s.rungBeat]?.decision.options[0];
    if (opt) return { type: 'choose_rung_option', optionId: opt.id };
  }
  if (promotionReady(s) && !introActive(s.introBeat)) {
    const target = pendingPromotionTarget(s);
    if (target !== null && RUNG_BEATS[target]) return { type: 'begin_rung_beat' };
  }
  if (s.character.satiety < satietyMax(s) * 0.25 && acts.includes('rest')) return { type: 'rest' };
  if (acts.includes('rake_rice')) return { type: 'rake_rice' };
  if (s.rung === 'R2' && !s.flags['first-fight-survived'] && s.rungMeter >= rungThreshold('R2')) {
    // Step 5b: the scripted wolf is spatial — walk back to the kura (its node) to face it.
    const kura = getMob('wolf_scripted').area;
    if (s.location === kura) return { type: 'face_wolf' };
    const hop = nextHopToward(s.location, kura, new Set(s.unlocked));
    return hop ? { type: 'move_to', to: hop } : null;
  }
  const target = cheapestEligibleGlobal(s);
  if (!target) return null;
  if (target.node === s.location && canDoActivity(s, getActivity(target.id))) {
    return { type: 'do_activity', activityId: target.id };
  }
  const hop = nextHopToward(s.location, target.node, new Set(s.unlocked));
  return hop ? { type: 'move_to', to: hop } : null;
}
