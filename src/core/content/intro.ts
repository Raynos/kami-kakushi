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
  /** The post-pick outcome, as a PERK UNLOCK (F56): the choice grants a named perk. `name` is a
   *  short perk name that MAY reference the character/context; `desc` is a STANDALONE one-line
   *  flavor of what the perk IS — readable WITHOUT the intro-conversation context. The ± mechanics
   *  are appended by `introPerkLine` (single-source via `introStatDelta`), NEVER baked in here.
   *  The UI renders these as JRPG-style perk boxes later; this module carries the DATA + milestone line. */
  readonly perk: { readonly name: string; readonly desc: string };
  /** The per-NPC memory write; absent ⇒ a self/narrator beat that remembers nothing. */
  readonly memory?: { readonly npc: NpcId; readonly regard: string; readonly warmth: number };
}

/** One askable QUESTION node in an NPC's hub (npc-dialogue-tree plan §3.1). Exploratory:
 *  asking reveals the `answer` line(s) and marks the id asked (for the UI to DIM it) — but the
 *  topic STAYS and is RE-ASKABLE (human fork 2026-07-02), so re-asking re-emits the answer.
 *  Carries NO stat lean and NO memory write — only the scene's DECISION touches attrs/regard. */
export interface DialogueTopic {
  /** Globally unique across all scenes (`askedTopics` is a flat set), e.g. 'soan-kami'. */
  readonly id: string;
  /** The ask-button copy AND the MC's spoken question — voiced as a `player` line when asked. */
  readonly label: string;
  /** The NPC's reply line(s) → log/scrollback (each carries its own voice + nameplate). */
  readonly answer: readonly IntroSetupLine[];
  /** Optional branch gate: the topic is only askable once the predicate over the asked-set passes
   *  (e.g. `gen-danger` only after `gen-work`). Absent ⇒ always askable. */
  readonly gate?: (asked: ReadonlySet<string>) => boolean;
}

/** The terminal "continue the story" node — the balanced +1/−1 decision (today's beat choice). */
export interface DialogueDecision {
  readonly prompt: string; // "What do you say to him?"
  readonly options: readonly IntroOption[]; // the net-zero balanced closers (reused verbatim)
}

/** One scene of the intro: MEET an NPC (greeting), ASK topics (the hub), then DECIDE. A scene with
 *  `topics: []` is a topic-less inner beat (the dream) — no hub, decision only. A strict
 *  generalization of the old linear `IntroBeat`. */
export interface DialogueScene {
  readonly id: string; // 'soan' | 'dream' | 'genemon'
  readonly voice: VoiceCategory; // the nameplate + react colour
  readonly speaker?: NpcId; // undefined ⇒ narrator / self scene (the dream)
  readonly greeting: readonly IntroSetupLine[]; // shown on entering (was the beat's `setup`)
  readonly topics: readonly DialogueTopic[]; // the ask hub ([] ⇒ decision-only)
  readonly decision: DialogueDecision; // the terminal balanced choice
}

/** Legacy linear beat shape — kept as a DERIVED, back-compat view of a `DialogueScene` so the
 *  not-yet-migrated renderer keeps compiling. Retire once the VN scene reads `DIALOGUE_SCENES`. */
export interface IntroBeat {
  readonly id: string;
  readonly voice: VoiceCategory;
  readonly speaker?: NpcId;
  readonly setup: readonly IntroSetupLine[];
  readonly prompt?: string;
  readonly options?: readonly IntroOption[];
}

/** The greeting Genemon opens his scene with — REUSED from the dialogue registry (single source). */
const GENEMON_GREET = getDialogueLine(COLD_OPEN_DIALOGUE_ID, 'gen-greet').text;

/** The ordered intro as dialogue SCENES (npc-dialogue-tree plan §3.4) — the single source of truth.
 *  Scene order == the old 3-beat order (soan/dream/genemon → scenes 0/1/2), so the `introBeat`
 *  cursor and the v3→v4 migration stay trivial. The DECISIONS reuse the already-voice-passed intro
 *  options VERBATIM; only the ask-hub `topics` are new. */
export const DIALOGUE_SCENES: readonly DialogueScene[] = [
  // ── Scene 1 · Sōan the physician (writes `soan`; STR↔INT body-vs-mind axis) ──
  {
    id: 'soan',
    voice: 'physician',
    speaker: 'soan',
    greeting: [
      { voice: 'narrator', text: COLD_OPEN.wake },
      { voice: 'physician', speaker: NPC_NAME.soan, text: COLD_OPEN.grounding },
    ],
    topics: [
      {
        id: 'soan-what-happened',
        label: `"What happened to me?"`,
        answer: [
          {
            voice: 'physician',
            speaker: NPC_NAME.soan,
            text: `"You washed up below the weir three days back, a gash on your scalp and no name to give. The river does that. We fished you out; the rest you'll have to earn back."`,
          },
        ],
      },
      {
        id: 'soan-kami',
        label: `"The village says a kami hid me away."`,
        answer: [
          {
            voice: 'physician',
            speaker: NPC_NAME.soan,
            text: `"Kami-kakushi — 'spirited away.' It's the tale they tell for every soul that wanders off and every child the river takes. I've tended enough of the 'spirited-away' to know it's water and cold and bad luck, not spirits. Don't let the old women make a haunting of it."`,
          },
        ],
      },
      {
        id: 'soan-fragment',
        label: `"There's a road. Grey rain. A name I can't hold."`,
        answer: [
          {
            voice: 'physician',
            speaker: NPC_NAME.soan,
            text: `"That's the blow talking, not a ghost. Fragments surface as the swelling goes down — chase them if you must, but a name you have to dig for is rarely one worth keeping."`,
          },
        ],
      },
      {
        id: 'soan-mend',
        label: `"How do I get my strength back?"`,
        answer: [
          {
            voice: 'physician',
            speaker: NPC_NAME.soan,
            text: `"Rest, rice, and work — in that order at first, then all at once. The body remembers labour before the mind remembers anything. The wits come back last; don't force them."`,
          },
        ],
      },
    ],
    decision: {
      prompt: 'What do you say to him?',
      options: [
        {
          id: 'soan-grateful',
          label: 'Thank him — ask how to mend',
          say: `"Then I'll trust your craft, not the village's ghosts."`,
          react: `"Sense, at last. Rest, eat, and let the swelling go down. The wits come back last — don't force them."`,
          stat: { up: 'int', down: 'str' },
          perk: {
            name: `Sōan's Counsel`,
            desc: `A mind honed sharper than the body it wears.`,
          },
          memory: { npc: 'soan', regard: 'grateful', warmth: 1 },
        },
        {
          id: 'soan-curt',
          label: `Brush it off — ask for work`,
          say: `"Kami or flood, I'm still breathing. Where's the work?"`,
          react: `"...Hm. No patience for a physician. Well — the body heals the same whether you thank me or not."`,
          stat: { up: 'str', down: 'int' },
          perk: {
            name: `Sickbed Grit`,
            desc: `A back that shoulders the work before the wits can weigh in.`,
          },
          memory: { npc: 'soan', regard: 'curt', warmth: -1 },
        },
        {
          id: 'soan-worried',
          label: 'Grasp at the fragment',
          say: `"There was a road. Grey rain. A name I can't hold. Is that the fever?"`,
          react: `"That is the blow talking, not a ghost. It will fade — or it won't. Don't let the old women make a haunting of it."`,
          stat: { up: 'luck', down: 'agi' },
          perk: {
            name: `A Waking Fragment`,
            desc: `A half-caught omen that bends fortune your way, though your step is slower to answer.`,
          },
          memory: { npc: 'soan', regard: 'worried', warmth: 0 },
        },
      ],
    },
  },

  // ── Scene 2 · The dream-fragment (self — narrator voice, NO NPC memory, NO topics; INT↔SPD lean) ──
  {
    id: 'dream',
    voice: 'narrator',
    greeting: [{ voice: 'narrator', text: COLD_OPEN.dream }],
    topics: [], // decision-only inner beat — the UI shows no "Ask" group
    decision: {
      prompt: 'The fragment tugs. Do you follow it?',
      options: [
        {
          id: 'dream-dwell',
          label: 'Dwell on it',
          say: `"Hold the road. The rain. Almost a name."`,
          react: `You chase it inward — and the ache in your skull chases you back. The name stays lost, but the habit of looking sets in.`,
          stat: { up: 'int', down: 'spd' },
          perk: {
            name: `The Inward Turn`,
            desc: `A mind that deepens by dwelling, at the price of a slower body.`,
          },
        },
        {
          id: 'dream-shake',
          label: 'Shake it off',
          say: `"Later. The body is here; the past isn't."`,
          react: `You let it go and the room sharpens — the slats of light, the way out.`,
          stat: { up: 'spd', down: 'int' },
          perk: {
            name: `The Clear Room`,
            desc: `Senses sharpened to the way out — quick where thought is thin.`,
          },
        },
        {
          id: 'dream-hands',
          label: 'Trust the hands',
          say: `"A porter's knot. My hands know this much."`,
          react: `Your fingers move before you decide to — a labourer's memory, still in the muscle.`,
          stat: { up: 'str', down: 'luck' },
          perk: {
            name: `The Porter's Hands`,
            desc: `Hands that remember the work before the head does.`,
          },
        },
      ],
    },
  },

  // ── Scene 3 · Genemon the steward (writes `genemon`; STR↔AGI) ──
  {
    id: 'genemon',
    voice: 'steward',
    speaker: 'genemon',
    greeting: [{ voice: 'steward', speaker: NPC_NAME.genemon, text: GENEMON_GREET }],
    topics: [
      {
        id: 'gen-house',
        label: `"What house is this?"`,
        answer: [
          {
            voice: 'steward',
            speaker: NPC_NAME.genemon,
            text: `"The Kurosawa. A great name gone to seed — samurai on the rolls, paupers in the granary. I've kept it upright since the last master could not, and I'll keep it upright when you can't either."`,
          },
        ],
      },
      {
        id: 'gen-work',
        label: `"What work is there?"`,
        answer: [
          {
            voice: 'steward',
            speaker: NPC_NAME.genemon,
            text: `"Rice to rake, a paddy to tend, a storehouse standing half-empty. Honest labour and no shortage of it. Earn your keep and there's a dry corner and a bowl in it — that's the whole of what I can promise."`,
          },
        ],
      },
      {
        id: 'gen-you',
        label: `"And who are you to me?"`,
        answer: [
          {
            voice: 'steward',
            speaker: NPC_NAME.genemon,
            text: `"Steward. I run the estate; you'll learn it, or you won't eat. Do as I say on the house's matters and we'll get on well enough."`,
          },
        ],
      },
      {
        // Branches: only surfaces once the player has asked what work there is.
        id: 'gen-danger',
        label: `"Is it safe here?"`,
        gate: (asked) => asked.has('gen-work'),
        answer: [
          {
            voice: 'steward',
            speaker: NPC_NAME.genemon,
            text: `"Safe as anywhere the lord's men don't ride. There's a wolf gone bold at the grain store, and worse up in the hills. But that's tomorrow's trouble. Today it's rice."`,
          },
        ],
      },
    ],
    decision: {
      prompt: 'How do you answer the steward?',
      options: [
        {
          id: 'genemon-earnest',
          label: 'Earnest — point me at the work',
          say: `"I'll earn my keep. Point me at it."`,
          react: `"...Good. The house has had its fill of hands that don't. We'll see if you mean it."`,
          stat: { up: 'str', down: 'agi' },
          perk: {
            name: `Genemon's Charge`,
            desc: `Honest muscle set plainly to the task — sure over nimble.`,
          },
          memory: { npc: 'genemon', regard: 'earnest', warmth: 1 },
        },
        {
          id: 'genemon-wary',
          label: `Wary — what's in it for me`,
          say: `"A samurai house with an empty granary. What's in it for me?"`,
          react: `"An honest question, and a cold one. Rice and a dry corner — that's the whole of what I can promise. Take it or walk."`,
          stat: { up: 'agi', down: 'str' },
          perk: {
            name: `The Wary Foot`,
            desc: `A guard kept up and light on the feet — quick to move before committing.`,
          },
          memory: { npc: 'genemon', regard: 'wary', warmth: -1 },
        },
        {
          id: 'genemon-steady',
          label: 'Silent — just get to work',
          say: `(You say nothing, and reach for the spilled rice.)`,
          react: `"...A man who works before he talks. Rare. We'll get on."`,
          stat: { up: 'spd', down: 'luck' },
          perk: {
            name: `Hands Before Words`,
            desc: `A steady quickness that answers with work — trusting to no luck.`,
          },
          memory: { npc: 'genemon', regard: 'steady', warmth: 1 },
        },
      ],
    },
  },
];

/** Total scenes — one source for the intro-done cursor value (`introBeat === DIALOGUE_SCENES.length`). */
export const INTRO_SCENE_COUNT = DIALOGUE_SCENES.length;

/** DERIVED back-compat view: the old linear `IntroBeat[]`, projected from `DIALOGUE_SCENES` (single
 *  source — no duplicated content). `setup`=greeting, `prompt`/`options`=the decision. Kept so the
 *  not-yet-migrated renderer/tests keep compiling; retire when the VN scene reads scenes directly. */
export const INTRO_BEATS: readonly IntroBeat[] = DIALOGUE_SCENES.map((s) => ({
  id: s.id,
  voice: s.voice,
  // `speaker` is exact-optional: only spread it when the scene actually names one (the dream omits it).
  ...(s.speaker !== undefined ? { speaker: s.speaker } : {}),
  setup: s.greeting,
  prompt: s.decision.prompt,
  options: s.decision.options,
}));

/** Total beats — a re-export alias of `INTRO_SCENE_COUNT` so the migration import doesn't break. */
export const INTRO_BEAT_COUNT = INTRO_SCENE_COUNT;

/** True while the intro is live (a scene is being shown). Pre-wake (-1) and done (≥count) → false. */
export function introActive(introScene: number): boolean {
  return introScene >= 0 && introScene < DIALOGUE_SCENES.length;
}

/** The scene currently being shown, or null when pre-wake / done. */
export function introSceneAt(introScene: number): DialogueScene | null {
  return introActive(introScene) ? (DIALOGUE_SCENES[introScene] ?? null) : null;
}

/** The topics askable RIGHT NOW: those whose `gate` passes over the asked-set. Asked topics STAY in
 *  the hub (human fork 2026-07-02) — the caller dims the ones present in `asked`; nothing is removed. */
export function availableTopics(scene: DialogueScene, asked: ReadonlySet<string>): DialogueTopic[] {
  return scene.topics.filter((t) => (t.gate ? t.gate(asked) : true));
}

/** Find a topic within a scene by id (the `ask_topic` reducer looks up the asked topic). */
export function introTopic(scene: DialogueScene, topicId: string): DialogueTopic | undefined {
  return scene.topics.find((t) => t.id === topicId);
}

/** Find a DECISION option within a scene by id (the `choose_intro` reducer looks up the pick). */
export function introSceneOption(scene: DialogueScene, optionId: string): IntroOption | undefined {
  return scene.decision.options.find((o) => o.id === optionId);
}

/** DERIVED back-compat: the beat currently shown as a legacy `IntroBeat`, or null pre-wake / done. */
export function introBeatAt(introScene: number): IntroBeat | null {
  return introActive(introScene) ? (INTRO_BEATS[introScene] ?? null) : null;
}

/** DERIVED back-compat: find an option within a legacy beat by id. */
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

/** The post-pick PERK-UNLOCK line (F56): the option's granted perk — its `name` + standalone `desc`
 *  — with the exact ± mechanics woven in as context (never a bare delta). Emitted on the MILESTONE
 *  channel so it reads under Progress, not Work (F41). The ± is single-source via `introStatDelta`,
 *  so it always matches the trade the reducer actually applies. (The UI renders the perk as a
 *  JRPG-style box in a later pass; this is the log-line form of the same data.) */
export function introPerkLine(opt: IntroOption): string {
  return `Perk unlocked — ${opt.perk.name}: ${opt.perk.desc} (${introStatDelta(opt.stat)})`;
}

/** A voiced node (a scene or a legacy beat) — anything that names who is speaking. */
type Voiced = { readonly voice: VoiceCategory; readonly speaker?: NpcId };

/** The voice category an option's `react` line speaks in (NPC scenes use the NPC's voice). Accepts a
 *  `DialogueScene` or a legacy `IntroBeat` (both carry `voice`/`speaker`). */
export function beatReactVoice(node: Voiced): VoiceCategory {
  return node.speaker ? NPC_VOICE[node.speaker] : node.voice;
}

/** The nameplate for an option's `react` line (the NPC's name, or undefined for a narrator node). */
export function beatReactSpeaker(node: Voiced): string | undefined {
  return node.speaker ? NPC_NAME[node.speaker] : undefined;
}

export { PLAYER_SPEAKER };
