// The zone-reveal pass (ADR-184 — a zone opens only in a VN). A rung-up VN may open at
// most two zones (the `verify-content` law); every OTHER zone earns its reveal from the
// fiction, through a side-quest VN of its own. This module is the AC-20 glue that fires
// those VNs: it runs from the `finish()` settle pass beside `worksPass`, enqueues each
// reveal scene the tick its fictional moment arrives — plus ONE narration beat of the
// same first-moment shape (the sleep-announce, below), which is a log line rather than
// a VN because a full-screen takeover to announce a convenience verb is unearned
// ceremony (the human's ruling, 2026-07-13: "a tiny beat") — the scene's
// own decision options set the zone's fact-flag (works-intro's pattern: EVERY option sets
// it, so a graceless answer colours the relationship, never the map), and surfaces.ts
// derives the zone's visibility from that flag (ADR-179 — visibility is never stored).
//
// The conditions below are deliberately made of labour the player is ALREADY doing at that
// rung (the human's rule, 2026-07-12: a side-quest gating a rung-up is fine — an OBTUSE
// trigger is not). Each one is reached by the sim bot's own requirement-driven route, so
// the arc proves them: coin + greens accumulate at the forecourt/woodlot at R2, R3's
// requirement list stands the MC in the paddies, and the R3 night round is what first
// draws blood.

import type { GameState } from './state';
import { setFlag, hasFlag } from './state';
import { pushLog } from './log';
import { hpMax, canSleep } from './selectors';
import { sleepAnnounceLine } from './content/flavor';
import { isUnlocked } from './unlock';
import { rungNumber } from './ranks';
import { enqueueScene } from './scenes';
import { COOK_SANSAI_COST } from './content/balance';
import { CHEAPEST_STALL_ITEM_COST } from './content/market';
import { LEASE_DAY } from './content/people';
import { dayOfWeek } from './constants';

/** One settle-pass step of the zone-reveal chain (pure; idempotent per tick — `enqueueScene`
 *  once-guards a played `once` def, so a satisfied condition re-fires nothing). */
export function revealsPass(state: GameState): GameState {
  let next = state;
  const rung = rungNumber(next.rung);

  // ── the gate — "the first coin you need to spend" (human, 2026-07-12). You are at the
  //    board with mon in your fist and nowhere within a day's walk to spend it; Genemon
  //    names Yohei's stall and the market days. Threshold = the cheapest thing the stall
  //    stocks (derived from MARKET_ITEMS — never a copied number).
  if (
    rung >= 2 &&
    next.location === 'forecourt' &&
    (next.resources.coin ?? 0) >= CHEAPEST_STALL_ITEM_COST
  ) {
    next = enqueueScene(next, 'sb-market');
  }

  // ── the kitchen — you are carrying wild greens you cannot eat raw. O-Hisa teaches the
  //    pot (which is what `verb-cook` has always been: the ONLY mend for a fought body).
  //    Siting the verb to a cook locus is built but HELD, pending HD-40 (the walk costs R3
  //    nine minutes, outside the pacing band) — see the cook_meal case in intents.ts.
  if (
    rung >= 2 &&
    next.location === 'forecourt' &&
    (next.resources.sansai ?? 0) >= COOK_SANSAI_COST
  ) {
    next = enqueueScene(next, 'sb-cook');
  }

  // ── the field margins — the raided drying racks, seen from the rows you work. R3+, so
  //    the ground opens with the blade that can answer it (R3's own requirement list keeps
  //    the MC in the paddies, so this fires from the rung's own labour).
  if (rung >= 3 && next.location === 'paddies') next = enqueueScene(next, 'sb-racks');

  // ── the weir reeds — `sb-lease` (authored long before this law) IS this beat: Matsuzō up
  //    from the river, the screens rat-gnawed, "send your man down". It already enqueues at
  //    the season turn; the LEASE DAY (the weekday the old man walks up — people.ts) fires
  //    it within a week of R3 instead of within a season. Its completion latches the flag
  //    (scenes.ts `applySceneCompletionEffects` — it is a narration-only beat, so it has no
  //    option to carry one).
  if (rung >= 3 && dayOfWeek(next.clock.day) === LEASE_DAY) next = enqueueScene(next, 'sb-lease');

  // ── the sickroom — the first hurt THAT COUNTS. FB-382's stated intent is "the sickroom
  //    reveals when hurt starts existing", and hurt starts existing when COMBAT does (the
  //    grain-watch's wolf, in practice). The naive `hp < hpMax` test fires in the COLD OPEN —
  //    the MC is river-found and wakes damaged, so it would open the room at R0, before there
  //    is any such thing as a wound taken in the house's service, and Sōan's beat (which is
  //    about cracked ribs and a body he has mended once already) would play to a man who has
  //    not yet held a blade. So: hurt, AND combat exists. It still precedes any defeat
  //    relocation (defeat.ts) — you cannot be beaten without first being hurt.
  if (next.character.hp < hpMax(next) && isUnlocked(next, 'tab-combat')) {
    next = enqueueScene(next, 'sb-sickroom');
  }

  // ── the corner — the sleep-announce beat (ADR-187 follow-up; closes HR-36's P9 ✘). The
  //    verb shipped unannounced; this line is its discovery IN PLACE: the first time you
  //    STAND at your corner with the verb live, the room tells you the day is yours to end.
  //    `canSleep` is the whole condition on purpose (AC-6-shaped: announced == available) —
  //    it carries R4+ (the corner is the only bed), the location, and the not-mid-VN guard,
  //    so the beat can never promise a verb the row does not offer. It fires on ARRIVAL,
  //    never the rung-up tick: the woodshed node is not walkable before the R4 grant, and
  //    during the grant's beat `canSleep` is false (rungBeat active). The seen-flag is the
  //    works.ts idiom; the prose canon is FLAVOR.sleepAnnounce (bundle sleep-announce).
  if (!hasFlag(next, 'sleep-announced') && canSleep(next)) {
    next = {
      ...next,
      log: pushLog(next.log, 'narration', sleepAnnounceLine(), next.clock.tick, {
        voice: 'narrator',
        contentKey: 'flavor.sleepAnnounce',
      }),
    };
    next = setFlag(next, 'sleep-announced');
  }

  return next;
}
