// The rung-up STORY BEATS (D-110) — DATA, not script, parallel to the intro's DIALOGUE_SCENES.
// The DATA is authored as prose in `narrative/rung-beats.md` (F5 — the source of truth) and
// compiled to `rungBeats.gen.ts` by `npm run gen:narrative`; this module keeps the hand-written
// TYPES + HELPERS and re-exports the generated registry, so consumers see one unchanged surface.
// EVERY rung R1→R7 is a player-TRIGGERED VN beat that narratively MOTIVATES its unlocks (F97) and
// discovers its people (F99); SOME rungs introduce a new face (Tokubei R1, Rokusuke R2, Kihei R3,
// Tōzō R4, Chiyo R6, Shigemasa R7), others deepen a known one (the Genemon rungs). R0 has NO beat —
// the intro's Genemon scene IS the R0 beat (§6.6 R0); you never "promote into R0".
//
// Choices are relationship/flag-FIRST (§0): they mainly move `npcMemory` (via `deepenNpc`) + story
// `flags`, with only THREE rare, varied bonuses (BQ2): R2 `pedlar-favour` (a story flag), R3
// `statBonus` (+1 AGI), R4 `smith-whetstone` (a keepsake flag). The prose is the Kurosawa house,
// 1780 voice (the intro's register); each beat's `motivates` list is verbatim from the matching
// `ranks.ts` `rewardOnReach.unlock`. Pure-core: no DOM, no Math/Date — this module only carries data.

import type { AttrId, StanceId } from './balance';
import type { NpcId, VoiceCategory } from './voices';
import type { RankId } from './ranks';
import type { IntroSetupLine, DialogueTopic } from './intro'; // reused verbatim

/** A rung-beat decision option: relationship + story-flag FIRST (§0). Unlike the intro's
 *  `IntroOption`, neither a perk nor a net-zero stat swap is required. */
export interface RungOption {
  readonly id: string; // stable, globally unique, e.g. 'r1-dutiful'
  readonly label: string; // the button copy (diegetic)
  readonly say: string; // the MC's spoken reply → Story, voice 'player'
  readonly react: string; // the speaker's reaction → Story, voice = the react speaker's
  /** For the two-voice beats (R4): the NPC whose voice/nameplate the `react` line speaks in, when it
   *  is NOT the scene's default decision speaker. Absent ⇒ the react uses the scene's speaker. */
  readonly reactNpc?: NpcId;
  /** ACCUMULATING relationship write(s) — an array so a two-voice beat can touch two NPCs (R4
   *  Genemon+Tōzō). `warmthDelta` ADDS (clamped -3..+3); `regard` overwrites only when present. */
  readonly memory?: readonly {
    readonly npc: NpcId;
    readonly warmthDelta: number;
    readonly regard?: string;
  }[];
  /** Story flags this choice sets — the durable record of the pick + any flag-backed bonus
   *  (`pedlar-favour`, `smith-whetstone`). Read by later beats / surfaces. */
  readonly flags?: readonly string[];
  /** The RARE small stat nudge (BQ2) — a modest one-time +attr, smaller than an intro perk. Present
   *  on EXACTLY ONE option (R3 'disciplined'); everything else omits it. `note` is the delight line. */
  readonly statBonus?: { readonly attr: AttrId; readonly amount: number; readonly note: string };
  /** For R5 only: the opening stance this pick makes your default (a story-DEFAULT, NOT a bonus). */
  readonly setStance?: StanceId;
}

export interface RungDecision {
  readonly prompt: string;
  readonly options: readonly RungOption[];
}

/** One rung beat. Mirrors `DialogueScene` but with a `RungDecision`. `topics: []` ⇒ a light-VN beat
 *  (greeting + decision, no ask-hub); a non-empty `topics` ⇒ a full VN meet (R3/R6/R7). The
 *  greeting's per-line `voice`/`speaker` carry two-voice beats (R4/R5). */
export interface RungScene {
  readonly id: string; // 'rung-r1' … 'rung-r7'
  readonly rank: RankId; // the TARGET rank this beat promotes INTO
  readonly voice: VoiceCategory; // the react/nameplate colour of the decision (fallback)
  readonly speaker?: NpcId; // the primary decision speaker (react nameplate)
  readonly greeting: readonly IntroSetupLine[];
  readonly topics: readonly DialogueTopic[]; // [] ⇒ light beat; else the ask-hub
  readonly decision: RungDecision;
  /** The `rewardOnReach.unlock` ids this beat narrates — a DOC/echo cross-check (a verify-content
   *  assert can pin beat↔unlock coherence, mirroring the surface check). */
  readonly motivates: readonly string[];
}

export { RUNG_BEATS } from './rungBeats.gen';
import { RUNG_BEATS } from './rungBeats.gen';

/** The beat that promotes INTO `target`, or undefined when the target has no registered beat. */
export function rungBeatFor(target: RankId): RungScene | undefined {
  return RUNG_BEATS[target];
}

/** The topics askable RIGHT NOW in a rung beat — those whose `gate` passes over the asked-set.
 *  Mirrors the intro's `availableTopics`; asked topics STAY + are re-askable (the caller dims them). */
export function availableRungTopics(scene: RungScene, asked: ReadonlySet<string>): DialogueTopic[] {
  return scene.topics.filter((t) => (t.gate ? t.gate(asked) : true));
}

/** Find a rung-beat topic by id (the `ask_rung_topic` reducer looks up the asked topic). */
export function rungTopic(scene: RungScene, topicId: string): DialogueTopic | undefined {
  return scene.topics.find((t) => t.id === topicId);
}

/** Find a rung-beat decision option by id (the `choose_rung_option` reducer looks up the pick). */
export function rungOption(scene: RungScene, optionId: string): RungOption | undefined {
  return scene.decision.options.find((o) => o.id === optionId);
}
