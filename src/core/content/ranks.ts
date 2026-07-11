// The T0 estate rung ladder (PRD §3.2 / §3.2.1 earned-transition spine / §4.1.1,
// reworked by FB-121 / ADR-137). Phase 1 = climb the rungs; each promotes when its
// authored HIDDEN requirement list (content/requirements.ts, gen'd from narrative
// markdown) is fully done — the old meter/threshold/storyGate AND-gate is deleted.
// `eligible` remains the CURATED per-rung labour pool for the auto-play/sim harness.
// `rewardOnReach` fires when promoted INTO that rank (the reveal reads as plot).

import type { RewardBundle } from '../rewards';
import { NAMES } from './names';

export type RankId = 'R0' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7';

export interface RankDef {
  readonly id: RankId;
  readonly tier: 0;
  readonly title: string;
  readonly kanji: string;
  readonly granter?: string;
  /** Action ids CURATED for this rung — the auto-play/sim labour pool (FB-121: the meter
   *  they once fed is gone; progression is the authored requirement list in
   *  content/requirements.ts, re-audit this field at Phase 5). */
  readonly eligible: readonly string[];
  /** Fired when promoted INTO this rank. */
  readonly rewardOnReach?: RewardBundle;
  /** FB-388 — where the promotion beat LEAVES you (the fiction moves you: the
   *  R1 terms are set at the forecourt, so completing the beat stands you
   *  there). Applied by `applyPromotion`; omitted = you stay where you were. */
  readonly arriveAt?: string;
}

export const RANKS: readonly RankDef[] = [
  {
    id: 'R0',
    tier: 0,
    // G4 — bible R0 'the man from the weir': the day-book's "one man, name unknown."
    title: 'The man from the weir',
    kanji: '無名',
    eligible: ['rake_rice'],
  },
  {
    id: 'R1',
    tier: 0,
    // G4 — bible R1 'the day-hand': kept by arithmetic; hired by the day, counted in the book.
    title: 'The day-hand',
    kanji: '日雇',
    granter: NAMES.elder,
    // FB-388 — the terms beat sets the day's work out at the forecourt: completing
    // the R0→R1 VN stands you there (no manual walk out of the kura).
    arriveAt: 'forecourt',
    eligible: ['farm_paddy', 'haul_stores'],
    rewardOnReach: {
      // Each rung stamps its own `rank-rN` marker — a deliberate SYMMETRIC set (battery #19 audit):
      // `rank-r1` gates a reveal (intents.ts) and the rest are the per-rung record used by test
      // fixtures + reserved as gate-hooks for later rungs — kept complete, not dead write-only cruft.
      flags: ['rank-r1'],
      // FB-103 / ADR-110: the rung-up STORY prose now lives in RUNG_BEATS.R1.greeting (spoken in the
      // beat → Story channel); `applyPromotion` emits the single terse "Rank ↑" marker to Progress.
      // So `rewardOnReach` carries NO log line — only the flags + the surfaces the beat motivates.
      // G4 — the room-<id> reveal ids match content/map.ts `revealFlag`s (the 16-node zone spine).
      // R1 opens the gate (haul + Yohei's stall), the home paddy (farm), and the woodshed corner —
      // the labour R1→R2 requires (farm_paddy, haul_stores) must be REACHABLE the moment you're R1.
      unlock: [
        'room-gate',
        'room-paddies',
        'room-woodshed',
        // FB-381 — the kitchen threshold reveals with the terms that name it
        // ("Meals at the threshold, morning and evening" — this very beat).
        'room-kitchen',
        'verb-farm',
        'verb-haul',
        'readout-clock',
        'readout-stamina',
        'panel-rung-ladder',
      ],
    },
  },
  {
    id: 'R2',
    tier: 0,
    // G4 — bible R2 'the yard-hand': the SILENT rung ('a task simply not taken back'); no granter beat.
    title: 'The yard-hand',
    kanji: '庭男',
    eligible: ['farm_paddy', 'haul_stores', 'woodcut_edge', 'forage_satoyama'],
    rewardOnReach: {
      flags: ['rank-r2', 'porters-knot'],
      // FB-103 / ADR-110: both the milestone prose AND the porters-knot narration move into
      // RUNG_BEATS.R2.greeting (the beat's closing narrator line), so all of R2's story prose lives
      // in one place (Story channel). `rewardOnReach` keeps only flags + unlocks; `applyPromotion`
      // emits the terse "Rank ↑" marker to Progress.
      // G4 — R2 opens the woodlot (woodcut + forage both site there now, activities.ts) and the
      // field margins (the tanuki/badger PEST beat) — the labour R2→R3 requires (woodcut_edge,
      // forage_satoyama). The retired near/deep wilderness nodes fold into the woodlot.
      unlock: [
        'tab-skills',
        'room-woodlot',
        'room-field-margins',
        'verb-woodcut',
        'verb-forage',
        'row-wood',
        'row-sansai',
        'skill-conditioning',
      ],
    },
  },
  // R3 — Gate-watch: the humbling first fight (the grain-store wolf) opens it; combat
  // goes live (Combat tab, the drill yard, the duty of estate defence).
  {
    id: 'R3',
    tier: 0,
    // G4 — bible R3 'the grain-watch': the first night round, the wolf survived-not-won; ribs cracked.
    title: 'The grain-watch',
    kanji: '蔵番',
    granter: NAMES.drillmaster,
    eligible: ['farm_paddy', 'haul_stores', 'woodcut_edge', 'forage_satoyama'],
    // M2·2 lineage: R3→R4 once required real combat duty (the `combat-blooded` storyGate);
    // FB-121 carries that intent as R3's kill:* requirements in requirements.md.
    rewardOnReach: {
      flags: ['rank-r3', 'combat-unlocked'],
      // v0.3.2 A7 — staggered combat reveal (§4.6.9): R3 opens combat's FLOOR only — the weapon,
      // the auto-resolve fight loop (verb, auto-modes, retreat), and the Bestiary. Durability +
      // repair + craft/equip wait for R4 (`readout-durability`/`panel-equipment`); the stance
      // control waits for R5 (`stance-control`) — one beat per rung, not the whole tab at once.
      // G4 — R3 opens the kura (the grain-watch's post, where the night round is walked) and the
      // weir reeds (the leased-screen rat PEST beat, Matsuzō's water). `room-drill-yard` waits for R4.
      // ADR-177 Schedule A — panel-house-influence moved R3 → R6 (it joins the Estate
      // 家 tab when THAT arrives; pre-R6 the Works ladder's standing gauge carries it).
      unlock: [
        'tab-combat',
        'panel-drill-yard',
        'readout-combat-level',
        'panel-bestiary',
        'room-kura',
        'room-weir-reeds',
        // FB-382 — the sickroom reveals when hurt starts existing (the grain-watch's
        // wolf); it must precede any defeat relocation there (defeat.ts), and does —
        // combat opens this same rung.
        'room-sickroom',
      ],
      // FB-103 / ADR-110: story prose → RUNG_BEATS.R3.greeting (Kihei's full VN meet); terse marker only.
    },
  },
  // R4–R7 — the rest of the T0 estate ladder (M2·2, deliberately THIN: threshold + a reveal-as-
  // plot log beat, reusing the existing labour verbs). The estate's trust deepens toward the
  // capstone; R7 sets `t0-capstone`, opening Phase 2 (the Estate-pillar grind) + the T0→T1 ascension.
  {
    id: 'R4',
    tier: 0,
    // G4 — bible R4 'the pupil': limps to the board, confesses the granary loss, begs for drills.
    title: 'The pupil',
    kanji: '弟子',
    granter: NAMES.drillmaster, // G4 — bible R4 'the pupil': Kihei's drills grant it
    eligible: ['farm_paddy', 'haul_stores', 'woodcut_edge', 'forage_satoyama'],
    rewardOnReach: {
      flags: ['rank-r4'],
      // v0.3.2 A7 — the loot→craft beat: weapon durability bands + repair + the Equipment/craft
      // loop (the craft panel + the equip switcher) reveal here, one rung after combat opens.
      // G4 — R4 opens the drill yard NODE (Kihei's ground on the map), where the drills happen.
      // ADR-177 Schedule A — the Inventory tab arrives HERE (R3→R4 stagger, its own rung).
      unlock: [
        'readout-durability',
        'panel-equipment',
        'verb-repair',
        'house-omoya',
        'room-drill-yard',
        'tab-inventory',
      ],
      // FB-103 / ADR-110: story prose → RUNG_BEATS.R4.greeting (Genemon + Kihei); terse marker only.
    },
  },
  {
    id: 'R5',
    tier: 0,
    // G4 — bible R5 'the accused': cleared by the day-book at the Count; Naoyuki names him.
    title: 'The accused',
    kanji: '咎人',
    granter: NAMES.elder,
    eligible: ['farm_paddy', 'haul_stores', 'woodcut_edge', 'forage_satoyama'],
    rewardOnReach: {
      // ADR-122 — the T0 status token: reaching R5 mounts the weapon you WIELD on your home wall (the
      // housing status-mirror). The `wall-weapon` flag latches the mount; applyPromotion emits the
      // dynamic reveal line naming your ACTUAL weapon (never a generic sword), and the home renders it.
      flags: ['rank-r5', 'wall-weapon'],
      // v0.3.2 A7 — the combat-rung beat: the stance control (glass-cannon↔tank) reveals here,
      // the last staggered combat surface (§4.6.9). ADR-119 — the QUESTS tab also reveals at R5 (its own
      // quest-log beat, tab-quests), one beat per rung.
      // G4 — R5 opens the shrine corridor (glimpsed, the dowager's new-moon walk) and the overgrown
      // orchard (the feral-dog CLEAR chain). The Count clears him and the wage begins here (wage.ts).
      unlock: ['stance-control', 'tab-quests', 'room-shrine', 'room-orchard'],
      // FB-103 / ADR-110: story prose → RUNG_BEATS.R5.greeting (Genemon confers + Kihei teaches the
      // stance, two-voice; BQ3). Terse "Rank ↑" marker only.
    },
  },
  {
    id: 'R6',
    tier: 0,
    // G4 — bible R6 'the trusted hand': the first coin errand at Yohei's stall, counted to the mon.
    title: 'The trusted hand',
    kanji: '用人',
    granter: NAMES.elder, // G4 — bible R6: Genemon sends the first coin errand
    eligible: ['farm_paddy', 'haul_stores', 'woodcut_edge', 'forage_satoyama'],
    rewardOnReach: {
      flags: ['rank-r6'],
      // ADR-177 Schedule A — Estate 家 arrives at R6 (the tab + the influence pane join
      // the reopening house-rooms; the upgrades live on Works 普請 since R2).
      unlock: ['house-workshops', 'house-granary', 'tab-estate', 'panel-house-influence'],
      // FB-103 / ADR-110: story prose → RUNG_BEATS.R6.greeting (Genemon's coin-errand meet); terse marker only.
    },
  },
  {
    id: 'R7',
    tier: 0,
    // G4 — bible R7 'the named hand': the day-book writes Gonbei; "Earn a better." Sleep → first dream.
    title: 'The named hand',
    kanji: '名代',
    granter: NAMES.elder, // G4 — bible R7: Genemon writes the hand-me-down name (Munemasa never places in T0)
    eligible: ['farm_paddy', 'haul_stores', 'woodcut_edge', 'forage_satoyama'],
    rewardOnReach: {
      // the T0 capstone: `t0-capstone` opens Phase 2 (`phaseOf`), where Estate-pillar deeds
      // begin to bank toward the T0→T1 ascension grade (built in M2·3–M2·5). The day-book naming
      // sets `label-gonbei` (voices.ts speaker ladder) — wired in the R7 beat / applyPromotion below.
      flags: ['rank-r7', 't0-capstone', 'label-gonbei'],
      // G4 — R7 opens the bamboo grove (the monkey-troop DEFEND beat, the last T0 node).
      unlock: ['house-study', 'room-grove'],
      // FB-103 / ADR-110: story prose → RUNG_BEATS.R7.greeting (Genemon writes the name — Munemasa is
      // "a voice through a wall", never placed). Terse "Rank ↑" marker only. `t0-capstone` fires here
      // regardless of the beat's choice (BQ4); `label-gonbei` flips the speaker to "Gonbei" (bible R7).
    },
  },
];

export const RANK_IDS: ReadonlySet<string> = new Set(RANKS.map((r) => r.id));

export function getRank(id: RankId): RankDef {
  const r = RANKS.find((x) => x.id === id);
  if (!r) throw new Error(`unknown rank: ${id}`);
  return r;
}

export function nextRankId(id: RankId): RankId | null {
  const i = RANKS.findIndex((r) => r.id === id);
  if (i < 0 || i + 1 >= RANKS.length) return null;
  return RANKS[i + 1]!.id;
}
