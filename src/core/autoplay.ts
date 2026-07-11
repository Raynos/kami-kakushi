// The canonical focused-optimal auto-play policy (the SINGLE source of "what would a perfect
// player do next"). It is pure and navigation-aware: under the spatial model (v0.3.1 Step 5) the
// optimal path WALKS to a labour's node before working it, and walks back to the kura for the
// scripted wolf. Everything that auto-drives the real engine consumes this ONE function so they can
// never silently desync — the pacing report + the G-PACING gate (walkPacing), the playcheck reward
// trace, the full-arc e2e / invariants tests, and the DEV `__qa.toRung` climber.

import type { GameState } from './state';
import type { Intent } from './intents';
import { availableActions } from './intents';
import { canDoActivity, hpMax, rakeExhausted, satietyMax } from './selectors';
import { ACTIVITIES, getActivity, type ActivityId } from './content/activities';
import { getRank } from './content/ranks';
import { reachableFrom } from './content/map';
import { getMob, GRINDABLE_MOBS, type MobId } from './content/enemies';
import { sceneById } from './content/scenes';
import { isMarketDay } from './content/market';
import { isWaged } from './content/wage';
import { getBelonging } from './content/home';
import { ESTATE_STAGES } from './content/estate';
import { getWeapon } from './content/weapons';
import { durabilityBand } from './combat';
import { isUnlocked } from './unlock';
import { skillLevel } from './skills';
import {
  CONDITIONING_GATE_LEVEL,
  STAMINA_FLAT_ABOVE,
  REPAIR_WOOD_COST,
  COOK_SANSAI_COST,
  WORKS_ACT_SATIETY,
} from './content/balance';
import { rungRequirements } from './content/requirements';
import { isRequirementDone } from './requirements-engine';
import { canCraft, getRecipe } from './content/crafting';
import { hasFlag } from './state';
import { introActive, introSceneAt } from './content/intro';
import { promotionReady, pendingPromotionTarget, phaseOf, rungNumber } from './ranks';
import { estateBuild } from './selectors';
import { WORKS_PROJECTS, stageOpen, canWorkProject, worksSiteZones } from './works';
import { RUNG_BEATS } from './content/rungBeats';

/** ADR-145 Phase-2 player-model knob (NOT canon): the KURA rice pile (shō) at which the
 *  focused-optimal steward sells at Yohei's stall — batching sells keeps the loop textured
 *  without spamming zero-clock transactions. (Rice is kura-only post-G4.5 — ADR-163.) */
const PHASE2_SELL_RICE_AT = 20;

/** storywave G1 player-model knob (NOT canon): the amount of UNJUDGED Estate growth (koku) the
 *  focused-optimal steward lets bank before ENDING the season to collect the seasonal share. Sized
 *  well above the 0-bonus floor so the reckoning always pays (never a no-op loop, since
 *  `advance_season` is instant) and the deed-grind is never starved. */
const PHASE2_SEASON_COLLECT_KOKU = 20;

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
/** Mend-before-fight threshold for the focused-optimal driver: FULL health. A level-1
 *  half-HP fighter loses ~always; at full the odds are real, and sansai is cheap. */
const FIGHT_MEND_HP_FRAC = 1;

export function autoModeIntent(s: GameState): Intent | null {
  // FB-266 — a VN surface (rung beat / generalized scene / intro) owns the screen: auto
  // PAUSES under it (stays armed, resumes on close) rather than grinding beneath the card.
  // The manual "Answer the summons" press additionally DISARMS via MANUAL_DISARM (main.ts).
  if (s.rungBeat !== null || s.activeScene !== null || introActive(s.introBeat)) return null;
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
    if (rakeExhausted(s)) return { type: 'set_auto_rake', on: false }; // FB-324 — spill exhausted
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

/** Grind up to this combat level before posting the R3 grain-watch night round: the round's
 *  MIDDLE stage is a real fight vs the marten (L2) — un-survivable underlevelled — so the
 *  focused-optimal player trains to the wolf's own level (nightRounds wolf = L3) first, then
 *  walks the round. Data-adjacent (the wolf's level); a small constant so autoplay stays leaf. */
const NIGHT_ROUND_READY_LEVEL = 6;

export function focusedOptimalIntent(s: GameState): Intent | null {
  const acts = availableActions(s);
  if (acts.includes('open_eyes')) return { type: 'open_eyes' };
  // (a0) drain any live/queued generalized VN scene FIRST (the Count, the season overlays, the
  // R7 dream, R2's silent yard-hand beat) — a scene owns the surface until it closes, so the
  // arc plays it before working on. A decision scene picks its first option deterministically;
  // a narration-only scene advances to its terminal (scenes.advanceSceneBeat closes it).
  if (s.activeScene !== null) {
    const def = sceneById(s.activeScene.id);
    const opts = def?.scene.decision.options ?? [];
    if (opts.length > 0) return { type: 'choose_scene_option', optionId: opts[0]!.id };
    return { type: 'advance_scene_beat' };
  }
  if (s.sceneQueue.length > 0) return { type: 'begin_scene', sceneId: s.sceneQueue[0]! };
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
    // TRIGGER a ready promotion. `begin_rung_beat` opens the VN beat for a rung that HAS one, and
    // promotes SILENTLY through a beatless rung (R2 the yard-hand, R5 the accused) — so the driver
    // dispatches it for EVERY ready promotion, not only the beat-bearing rungs (else the silent
    // rungs deadlock the ladder).
    if (pendingPromotionTarget(s) !== null) return { type: 'begin_rung_beat' };
  }
  if (s.character.satiety < satietyMax(s) * 0.25 && acts.includes('rest')) return { type: 'rest' };
  if (acts.includes('rake_rice')) return { type: 'rake_rice' };
  // FB-121: drive the CURRENT rung's authored requirement list, in authored order. The
  // Phase-3 policy covers count (act:/kill:) + the R2 flag req — the whole harness reach
  // today (R0→R3); state-predicate driving (coin/belonging/estate) is the Phase-5 sim
  // rework, keyed to each req's `drive:` hint.
  const revealed = new Set(s.unlocked);
  const unfinished = rungRequirements(s.rung).filter((d) => !isRequirementDone(d, s.rungReqs));
  // G4.3 — the scripted grain-store wolf drive is deleted; the wolf moves to the R3 night round
  // (its 'first-fight-survived' req is driven through the night-round staging in a later chunk).
  // walk-to-then-do one labour act (the shared "go do X" move for every driver below).
  const driveLabour = (id: ActivityId): Intent | null => {
    const act = getActivity(id);
    if (!isUnlocked(s, act.surface)) return null;
    if (act.dangerRing && skillLevel(s, 'conditioning') < CONDITIONING_GATE_LEVEL) return null;
    if (act.area === s.location && canDoActivity(s, act)) {
      return { type: 'do_activity', activityId: act.id };
    }
    const hop = nextHopToward(s.location, act.area, revealed);
    return hop ? { type: 'move_to', to: hop } : null;
  };
  // Is a foe/labour AREA reachable from here right now (here, or a revealed path exists)?
  const canReachArea = (area: string): boolean =>
    area === s.location || nextHopToward(s.location, area, revealed) !== null;
  // ADR-177 — walk the works DISCOVERY chain toward opening `stage`: to the board for
  // the naming (U1's works-intro), then to each named-but-unseen zone (the sighting
  // latches in the settle pass; the pricing beat plays through the scene drain above).
  // Null when nothing is walkable yet (rung-named stages simply aren't due).
  const driveWorks = (stage: number): Intent | null => {
    const proj = WORKS_PROJECTS.find((x) => x.stage === stage);
    if (!proj || hasFlag(s, proj.openFlag)) return null;
    if (!hasFlag(s, proj.namedFlag)) {
      if (proj.namedAtRung === undefined && rungNumber(s.rung) >= 2 && s.location !== 'forecourt') {
        const hop = nextHopToward(s.location, 'forecourt', revealed);
        if (hop) return { type: 'move_to', to: hop };
      }
      return null;
    }
    for (const z of proj.zones) {
      if (hasFlag(s, z.seenFlag)) continue;
      if (s.location === z.node) return null; // latches on the next settle
      const hop = nextHopToward(s.location, z.node, revealed);
      if (hop) return { type: 'move_to', to: hop };
    }
    return null; // all seen — the beat is queued; the scene drain plays it
  };
  // ADR-177 F3 — finish a LIVE commission: walk to a work zone and put the acts in
  // (rest when too spent; the reducer's satiety floor mirrors here via canWorkProject+cost).
  const driveCommission = (): Intent | null => {
    if (s.estateCommission <= 0) return null;
    if (canWorkProject(s)) {
      if (s.character.satiety < WORKS_ACT_SATIETY && acts.includes('rest')) return { type: 'rest' };
      return { type: 'work_project' };
    }
    for (const node of worksSiteZones(s.estateCommission)) {
      const hop = nextHopToward(s.location, node, revealed);
      if (hop) return { type: 'move_to', to: hop };
    }
    return null;
  };
  // earn coin: the accrued day-wage first (R5+ tactile board faucet), then sell surplus kura rice
  // on a market day; else the coin-paying haul while the forecourt pool holds, and when it's worked
  // out forage's steady pocket-coin (a SECONDARY yield, NOT pool-limited) keeps the faucet flowing.
  const earnCoin = (): Intent | null => {
    if (isWaged(s.rung) && s.wageDaysAccrued > 0) return { type: 'collect_wage' };
    if ((s.banked.rice ?? 0) > 0 && isUnlocked(s, 'panel-estate') && isMarketDay(s.clock.day)) {
      return { type: 'sell_rice' };
    }
    const haulPool = s.sitePools[getActivity('haul_stores').area] ?? 0;
    if (haulPool > 0) {
      const h = driveLabour('haul_stores');
      if (h) return h;
    }
    return (
      driveLabour('forage_satoyama') ??
      driveLabour('forage_deepwoods') ??
      driveLabour('haul_stores') ??
      driveLabour('farm_paddy')
    );
  };
  // Mend toward FULL HP (a hurt fighter loses forever): cook when a meal's ready, else forage sansai
  // (the meal's ingredient); when the forage site is worked out, turn the season to refill it. Returns
  // null when already full OR when mending is impossible (no cook / unreachable forage) — fight on hurt.
  const mendToFull = (): Intent | null => {
    if (s.character.hp >= hpMax(s) * FIGHT_MEND_HP_FRAC) return null;
    if (!isUnlocked(s, 'verb-cook')) return null; // can't mend yet — proceed and fight hurt
    if ((s.resources.sansai ?? 0) >= COOK_SANSAI_COST) return { type: 'cook_meal' };
    if ((s.sitePools[getActivity('forage_satoyama').area] ?? 0) <= 0) {
      return { type: 'advance_season' };
    }
    return driveLabour('forage_satoyama') ?? driveLabour('forage_deepwoods');
  };
  // Walk-to-then-FIGHT `desired` (the shared combat move): mend to full, craft/repair, and TRAIN on
  // the strongest reachable grindable at/below level before taking the desired foe (a lvl-1 vs a
  // lvl-2 foe is a loss loop, not a climb). Returns the prep/move/fight intent, or null when no
  // fightable foe is reachable. Reused by the kill requirements AND the R3 night-round grind-up.
  const fightToward = (desired: MobId): Intent | null => {
    if (!isUnlocked(s, 'tab-combat')) return null;
    // craft the axe the moment the looted materials allow (a real upgrade over the pole).
    if (!hasFlag(s, 'crafted-wood_axe') && canCraft(s.resources, getRecipe('craft_wood_axe'))) {
      return { type: 'craft_weapon', recipeId: 'craft_wood_axe' };
    }
    const mend = mendToFull();
    if (mend) return mend;
    // mend a worn blade when the wood allows (a Broken edge grinds losses); else cut the wood.
    const band = durabilityBand(s.weaponDurability, getWeapon(s.equippedWeapon).durabilityMax);
    if (band.name === 'Battered' || band.name === 'Broken') {
      if ((s.resources.wood ?? 0) >= REPAIR_WOOD_COST) return { type: 'repair_weapon' };
      const cut = driveLabour('woodcut_edge');
      if (cut) return cut;
    }
    const target = getMob(desired);
    const fightable = (m: (typeof GRINDABLE_MOBS)[number]): boolean =>
      (m.minTier ?? 0) <= s.tier && canReachArea(m.area);
    const canTakeDesired =
      s.character.level >= target.level &&
      !target.nightRoundOnly &&
      (target.minTier ?? 0) <= s.tier &&
      canReachArea(target.area);
    let mob: MobId | null = canTakeDesired ? desired : null;
    if (mob === null) {
      const trainable = GRINDABLE_MOBS.filter(
        (m) => m.level <= s.character.level && fightable(m),
      ).sort((a, b) => b.level - a.level);
      const fallback = GRINDABLE_MOBS.filter(fightable).sort((a, b) => a.level - b.level);
      mob = trainable[0]?.id ?? fallback[0]?.id ?? null;
    }
    if (mob === null) return null;
    if (getMob(mob).area === s.location) return { type: 'fight', mobId: mob, retreat: false };
    const hop = nextHopToward(s.location, getMob(mob).area, revealed);
    return hop ? { type: 'move_to', to: hop } : null;
  };
  for (const req of unfinished) {
    if (req.type !== 'count') continue;
    const [verb, subject] = req.token.split(':') as [string, string];
    if (verb === 'act' && subject === 'repair_weapon') {
      // the R4 mend: cut the wood if short, then repair (the reducer waives the coin fee broke).
      if ((s.resources.wood ?? 0) >= REPAIR_WOOD_COST) return { type: 'repair_weapon' };
      const cut = driveLabour('woodcut_edge');
      if (cut) return cut;
      continue;
    }
    if (verb === 'act' && ACTIVITIES.some((a) => a.id === subject)) {
      const go = driveLabour(subject as ActivityId);
      if (go) return go;
      continue;
    }
    if (verb === 'kill') {
      const go = fightToward(subject as MobId);
      if (go) return go;
    }
  }
  // state-predicate drivers (each authored req's `drive:` intent, generalised): earn toward,
  // then spend/place. Latching in the engine means a spent purse never un-completes a met req.
  for (const req of unfinished) {
    if (req.type !== 'state') continue;
    const p = req.pred;
    if (p.kind === 'resource' && p.res === 'coin') {
      const earn = earnCoin();
      if (earn) return earn;
      continue;
    }
    if (p.kind === 'banked') {
      if ((s.resources[p.res] ?? 0) > 0 && isUnlocked(s, 'panel-estate')) {
        if (s.location === 'kura') return { type: 'deposit', resource: p.res };
        const hop = nextHopToward(s.location, 'kura', revealed);
        if (hop) return { type: 'move_to', to: hop };
      }
      if (p.res === 'rice') {
        // rice banks kura-native from the paddy's PRIMARY yield, which rides the (site,season)
        // production pool. When the paddy is worked out for the season, TURN THE MANUAL WHEEL
        // (instant) to refill it rather than farm a dead field — the focused-optimal farmer waits
        // for next season. The 10%/season spoilage on the turn is dwarfed by a fresh pool's yield,
        // so the banked pile still climbs to the R7 granary target.
        if (
          (s.sitePools[getActivity('farm_paddy').area] ?? 0) <= 0 &&
          rungNumber(s.rung) >= 2 // the manual wheel is engine-refused pre-R2 (C1.4)
        ) {
          return { type: 'advance_season' };
        }
        const go = driveLabour('farm_paddy');
        if (go) return go;
        continue;
      }
      const earn = earnCoin();
      if (earn) return earn;
      continue;
    }
    if (p.kind === 'belonging') {
      const def = getBelonging(p.id);
      const cost = def.source.kind === 'buy' ? def.source.coinCost : 0;
      if (isUnlocked(s, 'panel-home') && (s.resources.coin ?? 0) >= cost) {
        return { type: 'buy_belonging', belongingId: p.id };
      }
      const earn = earnCoin();
      if (earn) return earn;
      continue;
    }
    if (p.kind === 'native' && p.key === 'estate-u1') {
      // ADR-177 F3 — a live commission finishes first (the acts at the site).
      const working = driveCommission();
      if (working) return working;
      const target = ESTATE_STAGES.find((x) => x.stage === s.estateStage + 1);
      if (target && isUnlocked(s, 'panel-estate')) {
        // ADR-177 — the stage prices only after its discovery chain closes: walk the
        // chain first (the reducer would no-op an un-opened commissioning — livelock).
        if (!stageOpen(s, target.stage)) {
          const go = driveWorks(target.stage);
          if (go) return go;
        } else if ((s.resources.wood ?? 0) < target.woodCost) {
          // F3 — the material input: cut the timber before the commissioning.
          const cut = driveLabour('woodcut_edge');
          if (cut) return cut;
        } else if ((s.resources.coin ?? 0) >= target.coinCost) {
          return { type: 'improve_estate' };
        }
      }
      const earn = earnCoin();
      if (earn) return earn;
    }
  }
  // FLAG requirements (atomic story flags): R3's grain-watch wolf + R7's Autumn nengu. Driven AFTER
  // the count + state reqs (above) so the fighter is blooded/levelled and the granary stocked first.
  // A flag already SET is left alone — the reduce-tail settle latches it next step; re-driving would
  // loop. The night-round STAGES are resolved by the driver loop (resolveNightStage), not here.
  for (const req of unfinished) {
    if (req.type !== 'flag') continue;
    if (hasFlag(s, req.flag)) continue; // set — settles on the next reduce; never re-drive
    if (req.flag === 'wolf-survived-not-won') {
      // the R3 first night round (grain-watch, nightRounds `first-night-round`): grind to
      // combat-ready (the marten stage is a real fight), then POST at the gate. A live round is
      // resolved by the driver loop; if none is live, begin one.
      if (s.character.level < NIGHT_ROUND_READY_LEVEL) {
        const best = GRINDABLE_MOBS.filter(
          (m) => (m.minTier ?? 0) <= s.tier && canReachArea(m.area),
        ).sort((a, b) => b.level - a.level)[0];
        const grind = best ? fightToward(best.id) : null;
        if (grind) return grind;
      }
      // FULL BELLY + FULL HP before posting — the round is three back-to-back fights with HP carried
      // between stages and NO mend inside it, and low satiety throttles attack (COMBAT_SATIETY floor).
      // Beginning it hurt/hungry loses stage 1 on the spot (an un-winnable re-begin loop).
      if (s.character.satiety < satietyMax(s) * 0.9 && acts.includes('rest'))
        return { type: 'rest' };
      const mend = mendToFull();
      if (mend) return mend;
      if (s.roundState === null) return { type: 'begin_night_round', roundId: 'first-night-round' };
      continue; // a round is live — the driver loop resolves its stages this step
    }
    if (req.flag === 'nengu-reckoned') {
      // ADR-166: the reckoning latches when the NENGU SCENE completes — the refused Autumn
      // exit enqueues it, (a0) drains it (reckoning), and the next attempt exits. So the
      // policy is unchanged: keep turning the manual wheel; the refusal path self-resolves.
      return { type: 'advance_season' };
    }
  }
  // ADR-145 Phase 3 — the TEXTURED Phase-2 loop (the A+B hybrid, played sensibly): commission
  // the next build stage the moment its gates are met (the pacing beats), work the rice lever
  // (sell the pile — a treasury deed + the coin the stages need), and rotate the two
  // estate-relevant labours so the deed mix is real, not one repeated act. Deterministic
  // (rotation keys off the day parity — no RNG), so runs reproduce.
  if (phaseOf(s) === 2 && isUnlocked(s, 'panel-estate')) {
    const b = estateBuild(s);
    // (1) the staged build: ADR-177 F3 — finish a live commission, else walk the
    //     discovery chain, gather the timber, and commission when every gate clears.
    {
      const working = driveCommission();
      if (working) return working;
    }
    if (b.next && !b.next.open) {
      const go = driveWorks(b.next.def.stage);
      if (go) return go;
    } else if (b.next && b.next.deedsShort === 0 && b.next.coinShort === 0) {
      if ((s.resources.wood ?? 0) < b.next.def.woodCost) {
        const cut = driveLabour('woodcut_edge');
        if (cut) return cut;
      } else {
        return { type: 'improve_estate' };
      }
    }
    // (2) the rice lever: sell a worthwhile KURA pile at the stall (PHASE2_SELL_RICE_AT is a
    //     player-model knob like GREEDY_MEND_HP_FRAC — what a sensible steward batches, never
    //     canon). B4 closure: reads banked.rice (rice is kura-only post-G4.5; resources.rice is
    //     never written) and only on a market day (mirrors the reducer's no-op guards — a
    //     shut stall must not stall the policy loop).
    if (isMarketDay(s.clock.day) && (s.banked.rice ?? 0) >= PHASE2_SELL_RICE_AT) {
      return { type: 'sell_rice' };
    }
    // (2b) collect the seasonal share (storywave G1): seasons are MANUAL now, so the judge no
    //      longer auto-fires — the steward ENDS the season to reckon it once a WORTHWHILE amount of
    //      unjudged Estate growth has banked (so the reckoning always pays a real bonus — never a
    //      0-bonus no-op loop, since advance_season is instant — and the deed-grind is never
    //      starved). Rice is sold first (above), so the spoilage riding the turn bites little.
    if (s.influence.estate.highWater - s.influence.estate.judged >= PHASE2_SEASON_COLLECT_KOKU) {
      return { type: 'advance_season' };
    }
    // (3) rotate the estate-relevant earners — fields on even days, stores on odd.
    const rotated = s.clock.day % 2 === 0 ? 'farm_paddy' : 'haul_stores';
    const go =
      driveLabour(rotated) ?? driveLabour(rotated === 'farm_paddy' ? 'haul_stores' : 'farm_paddy');
    if (go) return go;
    // neither earner reachable — fall through to the generic pool rather than stall.
  }
  // Nothing required remains (or none of it is driveable): the Phase-2 tail. Grind the
  // curated labour pool — estate labour banks the Estate deeds that carry the post-R7 grade
  // toward ascension (the old focused-optimal default, unchanged by FB-121).
  const target = cheapestEligibleGlobal(s);
  if (!target) return null;
  if (target.node === s.location && canDoActivity(s, getActivity(target.id))) {
    return { type: 'do_activity', activityId: target.id };
  }
  const hop = nextHopToward(s.location, target.node, revealed);
  return hop ? { type: 'move_to', to: hop } : null;
}
