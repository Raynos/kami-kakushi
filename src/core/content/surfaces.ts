// The data-driven surface registry (PRD §6.5 / §6.9). Each panel/screen/tab/row/
// readout/verb is data with an unlock predicate; reduce/tick latch newly-earned
// surfaces into the write-once `unlocked` set. Most M1 surfaces are revealed
// EXPLICITLY by a rung's RewardBundle (predicate `() => false`) — the reveal reads
// as plot; skill rows surface BY-DOING (predicate over skill visibility). Reveal
// staggering is a DESIGN property of this authored schedule (FU4).

import type { GameState, SurfaceId } from '../state';
import type { LogChannel } from '../log';
import type { VoiceCategory } from './voices';
import { hasFlag } from '../state';
import { HOME_REVEAL_LINE } from './home';
import { NAMES } from './names';
import { R3_FRONTIER_COMBAT_LEVEL } from './balance';
import { skillVisible } from '../skills';
import { isWaged } from './wage';

export type SurfaceKind = 'screen' | 'panel' | 'tab' | 'readout' | 'verb' | 'row';

export interface Surface {
  readonly id: SurfaceId;
  readonly kind: SurfaceKind;
  readonly unlock: (s: GameState) => boolean;
  readonly revealLine?: {
    readonly channel: LogChannel;
    readonly text: string;
    /** Speaker-voice tag (FB-91/FB-93). Absent on the milestone frontier beat; set to `narrator`
     *  by `narrate()` so every scene-reveal line renders in the same narrator voice as the intro. */
    readonly voice?: VoiceCategory;
  };
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
    id: 'readout-body',
    kind: 'readout',
    unlock: (s) => s.flags.awake === true,
    revealLine: narrate('[dev — body readout reveal; flavor-key migration pending (HD-30)]'),
  },
  {
    id: 'readout-rice',
    kind: 'readout',
    unlock: (s) => s.flags.awake === true,
    revealLine: narrate('[dev — rice readout reveal; flavor-key migration pending (HD-30)]'),
  },
  {
    // COIN is a "first wage" beat (ADR-107 / D4): the cold open is RICE-only, and the coin pill stays
    // hidden until the player first EARNS coin — the porter's wage from hauling stores at the gate
    // (~R1), or a combat spoil. STATE-PREDICATE reveal (keyed to carried-or-banked coin) so it
    // back-reveals for any save. A no-op earlier: at R0 you only rake rice, so coin stays at 0.
    id: 'readout-coin',
    kind: 'readout',
    unlock: (s) => (s.resources.coin ?? 0) > 0 || (s.banked.coin ?? 0) > 0,
    revealLine: narrate('[dev — coin readout reveal; flavor-key migration pending (HD-30)]'),
  },
  { id: 'verb-rake', kind: 'verb', unlock: (s) => s.flags.awake === true },
  {
    id: 'verb-rest',
    kind: 'verb',
    unlock: (s) => s.flags.raked === true,
    revealLine: narrate('[dev — rest verb reveal; flavor-key migration pending (HD-30)]'),
  },

  // ── R1 — the estate opens (revealed by the rank reward) ──
  { id: 'panel-rung-ladder', kind: 'panel', unlock: () => false },
  {
    // STATE-PREDICATE reveal (keyed to the already-latched ladder) so it back-reveals
    // for any mid-game save with no migrate() — the coin→estate sink dashboard.
    id: 'panel-estate',
    kind: 'panel',
    unlock: (s) => s.unlocked.includes('panel-rung-ladder'),
    revealLine: narrate(
      "The estate's own state of repair is yours to tend now — spend the house's surplus to shore it up.",
    ),
  },
  {
    id: 'readout-clock',
    kind: 'readout',
    unlock: () => false,
    revealLine: narrate(
      'You begin to mark the turning of the days, and the four seasons with them.',
    ),
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
    unlock: (s) => s.unlocked.includes('tab-combat'),
    revealLine: narrate(HOME_REVEAL_LINE),
  },
  { id: 'readout-stamina', kind: 'readout', unlock: () => false },
  // G4 — the walkable ZONE reveals (content/map.ts `revealFlag`s, the 16-node spine). Each opens on
  // its rung reward (ranks.ts rewardOnReach.unlock), predicate `() => false` (revealed as plot). The
  // reveal LINES for the newly-sited nodes have no migrated t0v2 flavor key yet ⇒ bracketed [dev —]
  // placeholders (HD-30); the two that carry forward (gate, paddies) keep their prior reveal copy.
  {
    id: 'room-gate',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate(
      'The gate and gateyard are yours to work now — stores come and go here, and Yohei sets up his stall on market days.',
    ),
  },
  {
    id: 'room-paddies',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate('The terraced home paddies open to you — the rice that feeds the house.'),
  },
  {
    id: 'room-woodshed',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate('[dev — woodshed corner reveal; flavor-key migration pending (HD-30)]'),
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
    revealLine: narrate('[dev — field-margins reveal; flavor-key migration pending (HD-30)]'),
  },
  { id: 'verb-woodcut', kind: 'verb', unlock: () => false },
  { id: 'verb-forage', kind: 'verb', unlock: () => false },
  { id: 'row-wood', kind: 'row', unlock: () => false },
  { id: 'row-sansai', kind: 'row', unlock: () => false },
  {
    // STATE-PREDICATE reveal (keyed to the sansai row) — the sansai→HP heal sink (FB-22: the
    // HEALTH-recovery action; work-stamina is the separate `rest` verb).
    id: 'verb-cook',
    kind: 'verb',
    unlock: (s) => s.unlocked.includes('row-sansai'),
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
    unlock: (s) => s.unlocked.includes('panel-estate'),
    revealLine: narrate(
      'The rice you clear and grow is food, not only trade — a plain bowl of it fills a hollow belly and puts you back to work the faster.',
    ),
  },
  { id: 'skill-conditioning', kind: 'row', unlock: () => false },
  // G4.3 — the `verb-face-wolf` surface is deleted with the scripted wolf (→ R3 night round).

  // ── G4 — the later-rung ZONE reveals (content/map.ts revealFlags): kura + weir-reeds at R3, the
  //    drill-yard NODE at R4, shrine + orchard at R5, the grove at R7. Revealed by the rung reward
  //    (predicate `() => false`); reveal LINES are [dev —] placeholders until t0v2 flavor migrates (HD-30). ──
  {
    id: 'room-kura',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate('[dev — kura / grain-store reveal; flavor-key migration pending (HD-30)]'),
  },
  {
    id: 'room-weir-reeds',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate('[dev — weir-reeds reveal; flavor-key migration pending (HD-30)]'),
  },
  {
    id: 'room-drill-yard',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate('[dev — drill-yard node reveal; flavor-key migration pending (HD-30)]'),
  },
  {
    id: 'room-shrine',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate('[dev — shrine corridor reveal; flavor-key migration pending (HD-30)]'),
  },
  {
    id: 'room-orchard',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate('[dev — overgrown orchard reveal; flavor-key migration pending (HD-30)]'),
  },
  {
    id: 'room-grove',
    kind: 'panel',
    unlock: () => false,
    revealLine: narrate('[dev — bamboo grove reveal; flavor-key migration pending (HD-30)]'),
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
    // G4 — the MON lane collect-at-the-board verb (ADR-163 / wage.ts). Revealed the moment the MC is
    // WAGED (R5+, isWaged) — a STATE-PREDICATE so it back-reveals for any R5+ save. The accrual +
    // `collect_wage` intent are wired (intents.ts); the board BUTTON binds to this surface in the
    // G4.9 render sweep. Reveal line is a [dev —] placeholder until the wage-ladder prose migrates (HD-30).
    id: 'verb-collect-wage',
    kind: 'verb',
    unlock: (s) => isWaged(s.rung),
    revealLine: narrate('[dev — the day-wage begins; collect it at the board (HD-30)]'),
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
