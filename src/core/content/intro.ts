// The interactive intro — DATA, not script (interactive-intro plan §3.4/§4, ADR-039 discipline).
// After "Open your eyes," the cold open becomes a VN-style, click-to-continue sequence of
// weighty BALANCED choices: each option is a net-zero +1/−1 attribute lean (never power creep),
// and each NPC beat writes PER-NPC memory (plan §3.2) read by that NPC's later lines. The exact
// ± lands as a system line AFTER the pick (diegetic-hint-only — human decision 2026-07-02).
// Pure-core: no DOM, no Math/Date; immutable-in/out. The renderer + typewriter + voice colours
// are LATER phases — this module only carries the data.

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
  /** The post-pick outcome, as a PERK UNLOCK (FB-56): the choice grants a named perk. `name` is a
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
  /** FB-362 — the scene's 幕-head display label, stamped as the log `context` so each
   *  intro act groups as its OWN scene card (was one shared 'the cold open' card).
   *  Authored as `title:` meta in narrative/intro.md; optional in the type so take
   *  bundles without one still compile — the engine falls back via introSceneTitle. */
  readonly title?: string;
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

/** The ordered intro as dialogue SCENES (npc-dialogue-tree plan §3.4) — the single source of
 *  truth, AUTHORED in `narrative/intro.md` (FB-5) and compiled to `intro.gen.ts`. Scene order ==
 *  the old 3-beat order (soan/dream/genemon → scenes 0/1/2), so the `introBeat` cursor and the
 *  v3→v4 migration stay trivial. */
export { DIALOGUE_SCENES } from './intro.gen';
import { DIALOGUE_SCENES } from './intro.gen';

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

// ── FB-362 — the per-scene 幕-head label (ADR-139 live-switchable) ────────────────────
// The label is CORE-emitted log text (baked into each entry's `context` at emit time), so
// the DEV story switcher swaps it through the declaring-module override (the
// requirements.ts/coldOpen.ts pattern): FUTURE emissions voice the selected take;
// already-logged lines keep their baked context (TST2 — history never rewrites).

let INTRO_TITLE_OVERRIDE: Readonly<Record<string, string>> | null = null;

/** DEV-only (the story set-switcher): override the intro scene titles by SCENE id
 *  (`## prose intro-title` take keys), or null to restore canon. */
export function __setIntroTitleOverride(map: Readonly<Record<string, string>> | null): void {
  INTRO_TITLE_OVERRIDE = map;
}

/** The 幕-head context an intro scene's log lines stamp — the DEV overlay's take if set,
 *  else the authored `title:`, else the pre-FB-362 shared label (old take bundles). */
export function introSceneTitle(scene: DialogueScene): string {
  return INTRO_TITLE_OVERRIDE?.[scene.id] ?? scene.title ?? 'the cold open';
}

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

/** The post-pick PERK-UNLOCK line (FB-56): the option's granted perk — its `name` + standalone `desc`
 *  — with the exact ± mechanics woven in as context (never a bare delta). Emitted on the MILESTONE
 *  channel so it reads under Progress, not Work (FB-41). The ± is single-source via `introStatDelta`,
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
