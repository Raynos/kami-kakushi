// The interactive intro — DATA, not script (interactive-intro plan §3.4/§4, D-039 discipline).
// After "Open your eyes," the cold open becomes a VN-style, click-to-continue sequence of
// weighty BALANCED choices: each option is a net-zero +1/−1 attribute lean (never power creep),
// and each NPC beat writes PER-NPC memory (plan §3.2) read by that NPC's later lines. The exact
// ± lands as a system line AFTER the pick (diegetic-hint-only — human decision 2026-07-02).
// Pure-core: no DOM, no Math/Date; immutable-in/out. The renderer + typewriter + voice colours
// are LATER phases — this module only carries the data.

import { COLD_OPEN } from './coldOpen';
import { getDialogueLine, COLD_OPEN_DIALOGUE_ID } from './dialogue';
import { ATTR_META, type AttrId } from './balance';
import { NPC_NAME, NPC_VOICE, PLAYER_SPEAKER, type NpcId, type VoiceCategory } from './voices';

/** One line of a beat's setup (the NPC/narrator lines revealed when the beat opens). */
export interface IntroSetupLine {
  readonly voice: VoiceCategory;
  readonly text: string;
  /** Nameplate; absent for narrator prose. */
  readonly speaker?: string;
}

/** A +1/−1 attribute trade-off — net-zero, so the MC always totals the same attribute points. */
export interface IntroStat {
  readonly up: AttrId;
  readonly down: AttrId;
}

export interface IntroOption {
  readonly id: string; // stable, e.g. 'soan-grateful'
  readonly label: string; // the button copy the player clicks (diegetic — implies the lean)
  readonly say: string; // the MC's spoken reply → log, voice 'player'
  readonly react: string; // the NPC's / narrator's immediate reaction → log, voice = beat.voice
  readonly stat: IntroStat; // +1 up / −1 down (net-zero)
  /** The diegetic post-pick outcome flavor (F42): one grounded sentence that names what the choice
   *  reveals about the character and implies the lean. The ± is appended by `introOutcomeLine`
   *  (single-source), NEVER baked in here — so the flavor reads as fiction, not a stat delta. */
  readonly outcome: string;
  /** The per-NPC memory write; absent ⇒ a self/narrator beat that remembers nothing. */
  readonly memory?: { readonly npc: NpcId; readonly regard: string; readonly warmth: number };
}

export interface IntroBeat {
  readonly id: string;
  readonly voice: VoiceCategory; // who addresses you (the react line + the nameplate)
  readonly speaker?: NpcId; // undefined ⇒ a narrator / self beat (the dream)
  readonly setup: readonly IntroSetupLine[];
  readonly prompt?: string; // the choice prompt; absent ⇒ a Continue-only beat
  readonly options?: readonly IntroOption[]; // absent ⇒ pure narration (just Continue)
}

/** The greeting Genemon opens Beat 3 with — REUSED from the dialogue registry (single source). */
const GENEMON_GREET = getDialogueLine(COLD_OPEN_DIALOGUE_ID, 'gen-greet').text;

export const INTRO_BEATS: readonly IntroBeat[] = [
  // ── Beat 1 · Answer Sōan the physician (writes `soan`; STR↔INT body-vs-mind axis) ──
  {
    id: 'soan',
    voice: 'physician',
    speaker: 'soan',
    setup: [
      { voice: 'narrator', text: COLD_OPEN.wake },
      { voice: 'physician', speaker: NPC_NAME.soan, text: COLD_OPEN.grounding },
    ],
    prompt: 'What do you say to him?',
    options: [
      {
        id: 'soan-grateful',
        label: 'Thank him — ask how to mend',
        say: `"Then I'll trust your craft, not the village's ghosts."`,
        react: `"Sense, at last. Rest, eat, and let the swelling go down. The wits come back last — don't force them."`,
        stat: { up: 'int', down: 'str' },
        outcome: `You defer to his craft — the mind already sharp, the body still slack from the sickbed.`,
        memory: { npc: 'soan', regard: 'grateful', warmth: 1 },
      },
      {
        id: 'soan-curt',
        label: `Brush it off — ask for work`,
        say: `"Kami or flood, I'm still breathing. Where's the work?"`,
        react: `"...Hm. No patience for a physician. Well — the body heals the same whether you thank me or not."`,
        stat: { up: 'str', down: 'int' },
        outcome: `You'd sooner work than be tended — the body shoulders ahead of the wits.`,
        memory: { npc: 'soan', regard: 'curt', warmth: -1 },
      },
      {
        id: 'soan-worried',
        label: 'Grasp at the fragment',
        say: `"There was a road. Grey rain. A name I can't hold. Is that the fever?"`,
        react: `"That is the blow talking, not a ghost. It will fade — or it won't. Don't let the old women make a haunting of it."`,
        stat: { up: 'luck', down: 'agi' },
        outcome: `You chase the half-memory over the moment — fortune's thread pulls, quick feet slacken.`,
        memory: { npc: 'soan', regard: 'worried', warmth: 0 },
      },
    ],
  },

  // ── Beat 2 · The dream-fragment (self — narrator voice, NO NPC memory; INT↔SPD lean) ──
  {
    id: 'dream',
    voice: 'narrator',
    setup: [{ voice: 'narrator', text: COLD_OPEN.dream }],
    prompt: 'The fragment tugs. Do you follow it?',
    options: [
      {
        id: 'dream-dwell',
        label: 'Dwell on it',
        say: `"Hold the road. The rain. Almost a name."`,
        react: `You chase it inward — and the ache in your skull chases you back. The name stays lost, but the habit of looking sets in.`,
        stat: { up: 'int', down: 'spd' },
        outcome: `You turn inward and worry the memory — the mind deepens as the body slows.`,
      },
      {
        id: 'dream-shake',
        label: 'Shake it off',
        say: `"Later. The body is here; the past isn't."`,
        react: `You let it go and the room sharpens — the slats of light, the way out.`,
        stat: { up: 'spd', down: 'int' },
        outcome: `You shake it off and the room sharpens — quicker on your feet, shorter on thought.`,
      },
      {
        id: 'dream-hands',
        label: 'Trust the hands',
        say: `"A porter's knot. My hands know this much."`,
        react: `Your fingers move before you decide to — a labourer's memory, still in the muscle.`,
        stat: { up: 'str', down: 'luck' },
        outcome: `Your hands recall the labour before your head does — plain strength over any luck.`,
      },
    ],
  },

  // ── Beat 3 · Answer Genemon the steward (writes `genemon`; STR↔AGI) ──
  {
    id: 'genemon',
    voice: 'steward',
    speaker: 'genemon',
    setup: [{ voice: 'steward', speaker: NPC_NAME.genemon, text: GENEMON_GREET }],
    prompt: 'How do you answer the steward?',
    options: [
      {
        id: 'genemon-earnest',
        label: 'Earnest — point me at the work',
        say: `"I'll earn my keep. Point me at it."`,
        react: `"...Good. The house has had its fill of hands that don't. We'll see if you mean it."`,
        stat: { up: 'str', down: 'agi' },
        outcome: `You set your back to the work plainly — honest muscle over nimble footing.`,
        memory: { npc: 'genemon', regard: 'earnest', warmth: 1 },
      },
      {
        id: 'genemon-wary',
        label: `Wary — what's in it for me`,
        say: `"A samurai house with an empty granary. What's in it for me?"`,
        react: `"An honest question, and a cold one. Rice and a dry corner — that's the whole of what I can promise. Take it or walk."`,
        stat: { up: 'agi', down: 'str' },
        outcome: `You keep your guard up and your terms plain — light-footed and wary, not yet strong.`,
        memory: { npc: 'genemon', regard: 'wary', warmth: -1 },
      },
      {
        id: 'genemon-steady',
        label: 'Silent — just get to work',
        say: `(You say nothing, and reach for the spilled rice.)`,
        react: `"...A man who works before he talks. Rare. We'll get on."`,
        stat: { up: 'spd', down: 'luck' },
        outcome: `You answer with your hands, not your mouth — steady and quick, trusting to no luck.`,
        memory: { npc: 'genemon', regard: 'steady', warmth: 1 },
      },
    ],
  },
];

/** Total beats — one source for the intro-done cursor value (`introBeat === INTRO_BEATS.length`). */
export const INTRO_BEAT_COUNT = INTRO_BEATS.length;

/** True while the intro is live (a beat is being shown). Pre-wake (-1) and done (≥length) → false. */
export function introActive(introBeat: number): boolean {
  return introBeat >= 0 && introBeat < INTRO_BEATS.length;
}

/** The beat currently being shown, or null when pre-wake / done. */
export function introBeatAt(introBeat: number): IntroBeat | null {
  return introActive(introBeat) ? (INTRO_BEATS[introBeat] ?? null) : null;
}

/** Find an option within a beat by id (the reducer looks up the picked option). */
export function introOption(beat: IntroBeat, optionId: string): IntroOption | undefined {
  return beat.options?.find((o) => o.id === optionId);
}

/** The bare ± delta text ("+1 INT / −1 STR") — the single source for the ± portion, read from the
 *  ATTR_META labels so no doc/copy ever hand-types it. Both the plain stat line and the flavored
 *  outcome line build on this. */
export function introStatDelta(stat: IntroStat): string {
  return `+1 ${ATTR_META[stat.up].label} / −1 ${ATTR_META[stat.down].label}`;
}

/** The diegetic-hint-only post-pick line: the exact ± lands AFTER the choice, never on the button
 *  (human decision 2026-07-02). Reads the attribute LABELS from ATTR_META (single source). */
export function introStatLine(stat: IntroStat): string {
  return `The choice settles into you. (${introStatDelta(stat)})`;
}

/** The FLAVORED post-pick outcome line (F42): the option's diegetic outcome sentence — what the
 *  choice reveals about the character — with the exact ± woven in as context (never a bare delta).
 *  Emitted on the MILESTONE channel so it reads under Progress, not Work (F41). The ± is single-
 *  source via `introStatDelta`, so it always matches the trade the reducer actually applies. */
export function introOutcomeLine(opt: IntroOption): string {
  return `${opt.outcome} (${introStatDelta(opt.stat)})`;
}

/** The voice category an option's `react` line speaks in (NPC beats use the NPC's voice). */
export function beatReactVoice(beat: IntroBeat): VoiceCategory {
  return beat.speaker ? NPC_VOICE[beat.speaker] : beat.voice;
}

/** The nameplate for an option's `react` line (the NPC's name, or undefined for a narrator beat). */
export function beatReactSpeaker(beat: IntroBeat): string | undefined {
  return beat.speaker ? NPC_NAME[beat.speaker] : undefined;
}

export { PLAYER_SPEAKER };
