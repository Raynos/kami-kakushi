// The data-driven surface registry (PRD §6.5 / §6.9, ADR-179). Each panel/screen/
// tab/row/readout/verb is data with an unlock predicate; visibility is DERIVED
// per state (core/unlock visibleSet), never stored. A surface named in a rung's
// `rewardOnReach.unlock` (ranks.ts — the authored schedule) is visible from that
// rung's latched `rank-rN` flag on, so its predicate here stays `() => false`
// (the rung arm carries it); event-caused surfaces carry a FACT predicate (a
// latched flag / discovery / skill — MONOTONE, never a fluctuating value, so a
// visible surface can never vanish, TST2). A predicate may key to another
// surface's visibility via its second arg (the in-progress visible set). Reveal
// staggering is a DESIGN property of this authored schedule (FU4).

import type { GameState, SurfaceId } from '../state';
import type { LogChannel } from '../log';
import type { VoiceCategory } from './voices';
import { hasFlag } from '../state';
import { introActive } from './intro';
import { HOME_REVEAL_LINE } from './home';
import { NAMES } from './names';
import { R3_FRONTIER_COMBAT_LEVEL } from './balance';
import { skillVisible } from '../skills';

export type SurfaceKind = 'screen' | 'panel' | 'tab' | 'readout' | 'verb' | 'row';

export interface Surface {
  readonly id: SurfaceId;
  readonly kind: SurfaceKind;
  /** The visibility predicate over progression FACTS (ADR-179): evaluated live,
   *  every state — never latched. `vis` is the in-progress visible set (the
   *  fixpoint arg) for predicates that key to another surface's visibility. */
  readonly unlock: (s: GameState, vis: ReadonlySet<SurfaceId>) => boolean;
  readonly revealLine?: {
    readonly channel: LogChannel;
    readonly text: string;
    /** Speaker-voice tag (FB-91/FB-93). Absent on the milestone frontier beat; set to `narrator`
     *  by `narrate()` so every scene-reveal line renders in the same narrator voice as the intro. */
    readonly voice?: VoiceCategory;
    /** FB-273 — fleeting flavor: the line lands in the "Now" view and fades (never Story). */
    readonly ephemeral?: boolean;
  };
  /** FB-272 — a SHORT "what opens" label the rung-up CEREMONY lists for the surfaces the new
   *  rank unlocks (the reveal reads at the promotion, not as a post-ceremony Story flood).
   *  A surface with a ceremonyLabel usually carries NO revealLine — one home per reveal. */
  readonly ceremonyLabel?: string;
}

// FB-91/FB-93 — every surface-reveal line is scene NARRATION, so it carries the `narrator` voice
// EXPLICITLY (matching the intro's narration convention), never emitted as an un-voiced/plain line.
const narrate = (text: string): { channel: LogChannel; text: string; voice: VoiceCategory } => ({
  channel: 'narration',
  text,
  voice: 'narrator',
});

// ── v0.2 narrative beats (audit #2/#6/#13) — the R3 terminal capstone, the 2nd dream
// payoff (first reader of the write-only dream-1 + porters-knot flags), and the locked
// macro-teaser panel. Diegetic copy kept beside the registry it feeds. ──
const MACRO_TEASER_REVEAL =
  'Standing in the drill yard, you begin to grasp how a house like this is truly weighed — not by its rice alone, but by its arms, its lands and coin, its standing before the lord, and the worth of its name. That reckoning sits far above a gate-watch. For now, you only see that it is there.';
const FRONTIER_BEAT = `You have become what the house needed at its gate — a hand it can trust with an edge to it. ${NAMES.drillmaster} watches you drill at first light and almost smiles. "There's a soldier in you under the farmhand. We'll find the rest of it yet." Past the gate the valley road climbs out of sight — toward the house's standing, its rivals, and the name you still cannot reach. That climb is for the days to come.`;
const DREAM_2 =
  "That night the dream comes again, and stays longer. The grey rain, the road — and now a load on your back, roped with the porter's knot your hands already knew. Water rising over the planks of a low bridge. A woman's voice behind you, calling a name through the flood — your name, you are almost sure, though the water closes over it before you can catch its shape.";

export const SURFACES: readonly Surface[] = [
  // ── cold open ──
  { id: 'screen-cold-open', kind: 'screen', unlock: () => true },
  { id: 'verb-open-eyes', kind: 'verb', unlock: () => true },
  {
    // FB-319 — gated on the intro ENDING, not `awake`: on `awake` the reveal line landed
    // mid-cold-open (the VN still owns the screen), reading as a too-early Story beat.
    // revealPass latches it on the intro-completing reduce, so the line lands right
    // AFTER the cold-open VN — same predicate shape back-reveals any post-intro save.
    id: 'readout-body',
    kind: 'readout',
    unlock: (s) => s.flags.awake === true && !introActive(s.introBeat),
    revealLine: narrate(
      "You have started to keep count of your own strength — what the day has drawn out of you, and how far that is from Sōan's pallet.",
    ),
  },
  {
    // FB-318 — same intro-done gate as readout-body (the kura line showed too early).
    id: 'readout-rice',
    kind: 'readout',
    unlock: (s) => s.flags.awake === true && !introActive(s.introBeat),
    revealLine: narrate(
      "The kura's count is open to you now: rice in, rice out, and the thin line between the store and a lean winter.",
    ),
  },
  {
    // COIN is a "first wage" beat (ADR-107 / D4): the cold open is RICE-only, and the coin pill stays
    // hidden until the player first EARNS coin. ADR-179 — keyed to the `coin-earned` FACT-flag
    // (latched at the two earning sites: sell_rice / collect_wage), because raw coin FLUCTUATES —
    // spending back to 0 must never hide a readout you've earned (the monotonicity law, TST2).
    // The live-balance check stays as a belt for any state holding coin without the flag.
    id: 'readout-coin',
    kind: 'readout',
    unlock: (s) =>
      hasFlag(s, 'coin-earned') || (s.resources.coin ?? 0) > 0 || (s.banked.coin ?? 0) > 0,
    revealLine: narrate(
      'Coin, at last, and few enough to count on one hand. What little the house pays in mon, you keep your own tally of.',
    ),
  },
  { id: 'verb-rake', kind: 'verb', unlock: (s) => s.flags.awake === true },
  {
    id: 'verb-rest',
    kind: 'verb',
    unlock: (s) => s.flags.raked === true,
    revealLine: narrate(
      'You can stop now, when the day is done — set the work down, and let the body take back what it can.',
    ),
  },

  // ── R1 — the estate opens (revealed by the rank reward) ──
  { id: 'panel-rung-ladder', kind: 'panel', unlock: () => false },
  {
    // STATE-PREDICATE reveal (keyed to the already-latched ladder) so it back-reveals
    // for any mid-game save with no migrate() — the coin→estate sink dashboard.
    id: 'panel-estate',
    kind: 'panel',
    // ADR-177 Schedule A — the projects surface is CAUSE-GATED: it exists once the
    // works-intro beat's day-book naming latches (R2+, at the board), never a rung
    // reward. It now lights the Works 普請 tab (the upgrades LEFT Estate 家, F4).
    // State-predicate so any old save back-reveals on its next settle.
    unlock: (s) => s.flags['works-named-u1'] === true,
    // FB-274 — reveal line STRUCK (human, 2026-07-10): the works-intro beat IS the cause.
  },
  {
    id: 'readout-clock',
    kind: 'readout',
    unlock: () => false,
    // FB-273 — fleeting Now flavor, not a Story beat (human, 2026-07-10).
    revealLine: {
      ...narrate('You begin to mark the turning of the days, and the four seasons with them.'),
      ephemeral: true,
    },
  },
  {
    // The player's HOME — "a place here is yours" made real (ADR-111 / FB-89). STATE-PREDICATE reveal
    // keyed to the latched `tab-combat` surface (R3), so it back-reveals for any R3+ save with no
    // migrate(). ADR-111's "home at R1" TIMING was moved to R3 (human, 2026-07-03): the home/belongings
    // pane renders inside the Inventory tab, which staggers to R3 (ADR-119) — so announcing the home at
    // R1 promised a space with no tab to open it for two rungs. Gating on the SAME `tab-combat` the
    // Inventory tab uses fires the reveal EXACTLY when its tab appears — no dangling promise. `rest`
    // re-sites here, the granted mat + bowl become owned, and the belongings section opens.
    id: 'panel-home',
    kind: 'panel',
    // ADR-177 Schedule A — the Inventory tab staggers R3→R4 (tab-inventory, its own
    // rank reward), and the home/belongings reveal re-keys to IT so the promised
    // space still appears exactly when its tab does (the ADR-119 rule, one rung later).
    // ADR-179 — keyed to the DERIVED visible set (the fixpoint arg), so a re-rung of
    // tab-inventory carries this along with zero edits here.
    unlock: (_s, vis) => vis.has('tab-inventory'),
    revealLine: narrate(HOME_REVEAL_LINE),
  },
  { id: 'readout-stamina', kind: 'readout', unlock: () => false },
  // G4 — the walkable ZONE reveals (content/map.ts `revealFlag`s, the 16-node spine). Each opens on
  // its rung reward (ranks.ts rewardOnReach.unlock), predicate `() => false` (revealed as plot). The
  // reveal LINES for the newly-sited nodes have no migrated t0v2 flavor key yet ⇒ authored via HD-30 (2026-07-09)
  // placeholders (HD-30); the two that carry forward (gate, paddies) keep their prior reveal copy.
  {
    id: 'room-gate',
    kind: 'panel',
    unlock: () => false,
    // FB-272 — announced on the R1 ceremony (was a post-ceremony Story flood line).
    ceremonyLabel: "The gate & gateyard — stores come and go; Yohei's stall on market days",
  },
  {
    id: 'room-paddies',
    kind: 'panel',
    unlock: () => false,
    ceremonyLabel: 'The home paddies — the rice that feeds the house', // FB-272
  },
  {
    id: 'room-woodshed',
    kind: 'panel',
    unlock: () => false,
    // FB-272 — the "your home area" beat belongs to the ceremony (human, 2026-07-10).
    ceremonyLabel: 'The woodshed corner — a mat, a bowl, a nail for the coat: yours',
  },
  {
    // Human 2026-07-11 — the forecourt is INTRODUCED, never pre-known: it exists the
    // moment Genemon sets you to the outer court's work. ADR-179 — that moment IS
    // "intro done" (completeIntroTail fired exactly when the cursor passed the last
    // scene), so the fact predicate is the same awake+intro-done gate readout-body
    // uses. No ceremonyLabel — it precedes every ceremony.
    id: 'room-forecourt',
    kind: 'panel',
    unlock: (s) => s.flags.awake === true && !introActive(s.introBeat),
    revealLine: narrate(
      'The outer court is given to you with the rake: the forecourt, swept ground sized for a household five times this one.',
    ),
  },
  {
    // FB-381 / ADR-177 pattern — hidden R0 ground until the R1 terms beat names it
    // ("Meals at the threshold, morning and evening"); announced on the ceremony.
    id: 'room-kitchen',
    kind: 'panel',
    unlock: () => false,
    ceremonyLabel: 'The kitchen threshold — meals at the board, morning and evening',
  },
  {
    // FB-342 / ADR-177 — the weir path, locked after the cold open; visible once the
    // works-intro beat's day-book naming latches `works-named-weir` (never a rank
    // reward — the fiction causes the unlock, TST3). ADR-179 — the flag IS the fact;
    // the old worksPass push is deleted.
    id: 'room-weir',
    kind: 'panel',
    unlock: (s) => hasFlag(s, 'works-named-weir'),
  },
  { id: 'verb-farm', kind: 'verb', unlock: () => false },
  { id: 'verb-haul', kind: 'verb', unlock: () => false },

  // ── R2 — the first nav, the wider estate, the skills you can name ──
  {
    id: 'tab-skills',
    kind: 'tab',
    unlock: () => false,
    revealLine: narrate('A way to track what your hands are learning takes shape — your Skills.'),
  },
  {
    id: 'room-woodlot',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(
      'The woodlot edge opens to you — kindling and timber to cut, wild greens to gather along its margin.',
    ),
  },
  {
    id: 'room-field-margins',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(
      'Out past the last worked row the setts begin — tanuki, badger — and the nightly raids on the drying racks and the seed store.',
    ),
  },
  { id: 'verb-woodcut', kind: 'verb', unlock: () => false },
  { id: 'verb-forage', kind: 'verb', unlock: () => false },
  { id: 'row-wood', kind: 'row', unlock: () => false },
  { id: 'row-sansai', kind: 'row', unlock: () => false },
  {
    // Keyed to the sansai row's visibility (the fixpoint arg) — the sansai→HP heal sink
    // (FB-22: the HEALTH-recovery action; work-stamina is the separate `rest` verb).
    id: 'verb-cook',
    kind: 'verb',
    unlock: (_s, vis) => vis.has('row-sansai'),
    revealLine: narrate(
      'You could boil the wild greens into a hot meal — plain fare, but a warm meal is what closes wounds and mends a body after a fight.',
    ),
  },
  {
    // ADR-107 Phase 2 — the plain-rice FOOD path opens WITH the estate economy (panel-estate, ~R1),
    // the moment rice gains its eat/sell/store uses. STATE-PREDICATE (keyed to the latched
    // panel-estate) so it back-reveals for any save. Held back from the calm rake-only cold open so
    // it doesn't compete with the free `rest` before rice has a real alternative use (sell).
    id: 'verb-eat-rice',
    kind: 'verb',
    // ADR-177 Schedule A — keyed to panel-rung-ladder (R1): panel-estate is now
    // cause-gated at R2+, and eating must keep its R1 timing (the belly, ADR-178).
    unlock: (_s, vis) => vis.has('panel-rung-ladder'),
    // FB-275 — no flavor text for eating & rice (human, 2026-07-10); the verb reveal is enough.
  },
  { id: 'skill-conditioning', kind: 'row', unlock: () => false },
  // G4.3 — the `verb-face-wolf` surface is deleted with the scripted wolf (→ R3 night round).

  // ── G4 — the later-rung ZONE reveals (content/map.ts revealFlags): kura + weir-reeds at R3, the
  //    drill-yard NODE at R4, shrine + orchard at R5, the grove at R7. Revealed by the rung reward
  //    (predicate `() => false`); reveal LINES authored via HD-30 (2026-07-09, narrative-diverge texture). ──
  {
    id: 'room-kura',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(
      "The storehouse is opened to you: the iron-strapped door, the good lock, the grain-watch's stool beside it. What is counted in and out is the house's whole year.",
    ),
  },
  {
    id: 'room-weir-reeds',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(
      'The shallows above and below the weir, reeds past the waist. River rats gnaw the screens the house leases from Matsuzō, and every screen lost is coin owed across the water.',
    ),
  },
  {
    // FB-382 / ADR-177 pattern — hidden R0 ground until hurt starts existing (the
    // grain-watch's wolf, this rung); announced on the R3 ceremony.
    id: 'room-sickroom',
    kind: 'panel',
    unlock: () => false,
    ceremonyLabel: "Sōan's sickroom — where the night-watch's hurts are carried",
  },
  {
    id: 'room-drill-yard',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(
      "The old stable court, swept bare and given a new use. Kihei's ground now, and yours to enter: things happen here in his order or not at all.",
    ),
  },
  {
    id: 'room-shrine',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(
      'In passing you glimpse it — a family altar set into a corridor, the rites kept in a passage never meant to hold them. You are not asked to stop.',
    ),
  },
  {
    id: 'room-orchard',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(
      "The old orchard gone wild: bramble to the shoulder, windfall rotting underfoot, the dogs denned in the hollow. Kihei calls it the dogs' yard, without irony.",
    ),
  },
  {
    id: 'room-grove',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(
      'Green dark and creaking, close behind the waste ground. The monkey troop raids the rows from here and is up the stems before you have turned around.',
    ),
  },

  // ── R3 — combat goes live (the drill yard, the Combat tab) ──
  {
    id: 'tab-combat',
    kind: 'tab',
    unlock: () => false,
    revealLine: narrate(
      'The drill yard opens to you — a place to train, and foes that must be met.',
    ),
  },
  { id: 'panel-drill-yard', kind: 'panel', unlock: () => false },
  {
    // ADR-177 Schedule A — the Inventory tab's OWN gate (was piggybacked on tab-combat
    // at R3): granted by the R4 rank reward, one tab per rung.
    id: 'tab-inventory',
    kind: 'tab',
    unlock: () => false,
    revealLine: narrate(
      'What is yours and what is banked now have a place of their own — the stores open to you.',
    ),
  },
  {
    // ADR-177 Schedule A — Estate 家 arrives at R6 (the house-rooms rung): the pillars,
    // the house standing, and the house itself, once there is a house worth the tab.
    id: 'tab-estate',
    kind: 'tab',
    unlock: () => false,
    revealLine: narrate(
      'The house itself comes under your eye — its rooms, its standing, its slow rise.',
    ),
  },
  { id: 'readout-combat-level', kind: 'readout', unlock: () => false },
  // A7 — the Bestiary reveals WITH combat at R3 (the field-guide of the foes you meet). It fogs a
  // foe until you've faced it (its `mob-<id>` flag) — reveal-as-plot, then scout-by-fighting.
  {
    id: 'panel-bestiary',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(
      'You begin to keep a bestiary — a field-guide of the beasts of the estate, filling in as you face each one.',
    ),
  },

  // ── R4 — the loot→craft beat (A7): the blade's wear + repair, and the Equipment/craft loop ──
  {
    id: 'readout-durability',
    kind: 'readout',
    unlock: () => false,
    revealLine: narrate(
      "You learn to read the wear on an edge — a blade dulls and chips with use, and a dull edge bites less. Mind your weapon's condition now.",
    ),
  },
  {
    id: 'panel-equipment',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(
      'The woodlot smithy is yours to use — strip what the carcasses give up, forge a real edge, keep it repaired, and take up whichever weapon suits the watch.',
    ),
  },
  { id: 'verb-repair', kind: 'verb', unlock: () => false },
  { id: 'verb-equip-axe', kind: 'verb', unlock: () => false },

  // ── R5 — the combat-rung beat (A7): the stance control (glass-cannon↔tank) ──
  {
    id: 'stance-control',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(
      'The drillmaster teaches you to set your stance before a foe — press the attack and take more in return, or guard and give up some bite. The call is yours, fight by fight.',
    ),
  },
  // ── R5 — the Quests tab (ADR-119, reinstating ADR-037): quests earn a legible home of their own, revealed
  //    as their OWN quest-log beat (not batched into the R3 combat wave). ──
  {
    id: 'tab-quests',
    kind: 'tab',
    unlock: () => false,
    revealLine: narrate(
      'You begin to keep a book of undertakings — the tasks and errands the house sets you, and the ones you take on yourself. A place to see what still stands unfinished.',
    ),
  },
  {
    // G4 — the MON lane collect-at-the-board verb (ADR-163 / wage.ts). Visible the moment the MC is
    // WAGED (R5+). ADR-179 — keyed to the latched `rank-r5` fact-flag, not the transient `s.rung`
    // (rung-monotone in T0, but the flag survives any later rung semantics). The accrual +
    // `collect_wage` intent are wired (intents.ts); the board BUTTON binds to this surface in the
    // G4.9 render sweep. Reveal line authored via HD-30 (2026-07-09).
    id: 'verb-collect-wage',
    kind: 'verb',
    unlock: (s) => hasFlag(s, 'rank-r5'),
    revealLine: narrate(
      'The house pays you in coin now — a fixed measure for each day worked. It waits at the board until you go and take it up.',
    ),
  },

  // ── Interior-house AREA reveals (A8 / canon §I / PRD §3.3) — the house physically REOPENS its
  // rooms as your standing rises: the omoya at R4, the workshops + granary at R6, the lord's study
  // at R7. FLAVOUR beats (reveal-as-plot + an inked "the house" list in the work tab), NOT walkable
  // map nodes — the 7-node map ceiling (map.ts) is untouched. Revealed explicitly by the rung. ──
  {
    id: 'house-omoya',
    kind: 'row',
    unlock: () => false,
    revealLine: narrate(
      'The omoya — the main house — is opened to you. Its shuttered rooms, closed since the lean years, are aired and swept; you walk floors the family walks.',
    ),
  },
  {
    id: 'house-workshops',
    kind: 'row',
    unlock: () => false,
    revealLine: narrate(
      "The estate's workshops wake again — a smith's forge, a joiner's bench — the crafts of a house that makes as well as grows.",
    ),
  },
  {
    id: 'house-granary',
    kind: 'row',
    unlock: () => false,
    revealLine: narrate(
      'A second granary, the itakura, is raised board by board — the house’s stores have outgrown the old kura at last.',
    ),
  },
  {
    id: 'house-study',
    kind: 'row',
    unlock: () => false,
    revealLine: narrate(
      "The lord opens his study — the shoin, the writing-room where the house's business is truly done — to you. Few servants ever cross that threshold.",
    ),
  },

  // ── R3 terminal beats (v0.2 narrative) — the macro teaser (revealed by the R3
  // reward, predicate ()=>false), then the live-gated frontier capstone + 2nd dream,
  // fired once the gate-watch has actually fought (combat level ≥ the frontier gate).
  // ORDER MATTERS: the milestone precedes dream-2 so one revealPass emits capstone then
  // dream. dream-2 is the FIRST READER of the write-only dream-1 + porters-knot flags. ──
  {
    id: 'panel-house-influence',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(MACRO_TEASER_REVEAL),
  },
  {
    id: 'screen-demo-frontier',
    kind: 'screen',
    // latched flag, NOT the transient `s.rung === 'R3'` — R3→R4 promotes at combat lvl 1, so a
    // rung check would go dead forever; `rank-r3` (set once at R3, never cleared) back-reveals.
    unlock: (s) => hasFlag(s, 'rank-r3') && s.character.level >= R3_FRONTIER_COMBAT_LEVEL,
    revealLine: { channel: 'milestone', text: FRONTIER_BEAT },
  },
  {
    id: 'dream-2',
    kind: 'panel',
    unlock: (s) =>
      hasFlag(s, 'dream-1') &&
      hasFlag(s, 'porters-knot') &&
      hasFlag(s, 'rank-r3') && // latched, not `s.rung === 'R3'` (which dies at R4) — see frontier above
      s.character.level >= R3_FRONTIER_COMBAT_LEVEL,
    revealLine: narrate(DREAM_2),
  },

  // ── skills surface BY-DOING (discover-by-doing) ──
  { id: 'skill-farming', kind: 'row', unlock: (s) => skillVisible(s, 'farming') },
  { id: 'skill-foraging', kind: 'row', unlock: (s) => skillVisible(s, 'foraging') },
  { id: 'skill-woodcutting', kind: 'row', unlock: (s) => skillVisible(s, 'woodcutting') },
];

export const SURFACE_IDS: ReadonlySet<SurfaceId> = new Set(SURFACES.map((x) => x.id));
