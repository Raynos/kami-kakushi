// The VN / INTRO machinery (split out of render.ts, 2026-07-13 render-split): the
// full-screen washi scene (ADR-104/FB-47) — the source-tagged VnScene projection
// (intro dialogue trees + rung beats + generalized scene-defs), the append-only
// transcript with the GBA typewriter, the ask → decide → outcome panel flow, and the
// scene teardown. While a scene is live it hides the whole shell; the world inks in
// only after it ends.
import {
  introSceneAt,
  rungBeatFor,
  sceneById,
  NPC_NAME,
  NPC_VOICE,
  playerSpeaker,
  ATTR_META,
  beatReactSpeaker,
  beatReactVoice,
  introActive,
  introStatDelta,
  RANKS,
  SURFACES,
  type AttrId,
  type DialogueTopic,
  type IntroSetupLine,
  type NpcId,
  type VoiceCategory,
  type GameState,
  type Intent,
} from '../../core';
import type { RungScene } from '../../core/content/rungBeats';
import type { DialogueScene } from '../../core/content/intro';
import {
  el,
  introNameplate,
  introInstant,
  buildFreshDividerNode,
  brushRule,
  VOICE_COLOR,
  ATTR_COLOR,
  QA_INSTANT_TEXT,
  TYPE_MS_PER_CHAR,
  INTRO_LINE_ADVANCE_MS,
  INTRO_CLICK_ADVANCE_MS,
  FRESH_DIVIDER_TTL_MS,
  FRESH_DIVIDER_FADE_MS,
} from '../render';
import { inferQuoteVoice, buildPerkBox } from './log-lines';
import type { Sfx } from '../sfx';
import type { DevApi } from '../dev';

type Dispatch = (intent: Intent) => void;

export function createVnView(ctx: {
  root: HTMLElement;
  dispatch: Dispatch;
  dev: DevApi | undefined;
  sfx: Sfx;
  /** The rung-beat ceremony re-arms the slop gate + suppresses the floating rank-up seal. */
  armSlopGate(): void;
  suppressRankUpOverlay(): void;
}): {
  vnActive(state: GameState): boolean;
  syncIntroScene(state: GameState): void;
  teardownIntroScene(): void;
  /** render()'s intro-release probe: is a scene element currently mounted? */
  introSceneActive(): boolean;
} {
  const { root, dispatch, dev, sfx } = ctx;

  // ── the interactive intro VN scene (ADR-104) — the SOLE prod intro presentation. While the intro
  //    is live it HIDES the whole shell and mounts a full-screen scene on `root`; the estate inks
  //    in only AFTER the intro ends. The intro is APPEND-ONLY (FB-81): the scene shell is built ONCE
  //    per scene, then each state change DIFFS the transcript against the DOM and APPENDS only the
  //    new lines — no node already on screen is destroyed/recreated within a scene (that wholesale
  //    teardown+rebuild was the flash + wiped typewriter + resizing card the human saw). A full
  //    teardown fires ONLY on a scene CHANGE or when the intro ends. ──
  let introScene: HTMLElement | null = null;
  let introSceneCurrentId: string | null = null;
  // the RIGHT panel is gated ask → decide (a decision-only scene opens straight in 'decide').
  let introPhase: 'ask' | 'decide' = 'ask';
  // a LATCHED-but-not-yet-dispatched decision: on pick the reply + perk + Continue show; ONLY
  // Continue dispatches `choose_intro` (⇒ advances the scene). Picking never jumps scenes.
  let pendingChoiceId: string | null = null;
  // per-scene mounted refs + append-only bookkeeping (ALL reset by teardownIntroScene).
  let introStoryLinesEl: HTMLElement | null = null; // the LEFT transcript column's line container
  let introPanelEl: HTMLElement | null = null; // the RIGHT interactive column (always present)
  let introAskEl: HTMLElement | null = null; // the ask sub-panel (topics + "heard enough")
  let introDecideEl: HTMLElement | null = null; // the decide sub-panel (the choice grid)
  let introOutcomeEl: HTMLElement | null = null; // the outcome sub-panel (perk + Continue), lazy
  const introTopicBtns = new Map<string, HTMLButtonElement>(); // topicId → ask button (dim/gate in place)
  const introRenderedKeys = new Set<string>(); // transcript entry keys already appended to the DOM
  let introLastState: GameState | null = null; // latest state, for the UI-only (Done / pick) handlers
  // typewriter over the newly-appended block: its typing nodes + a per-line cursor (FB-62 click-advance).
  let introBlockNodes: { readonly span: HTMLElement; readonly text: string }[] = [];
  let introBlockIndex = -1; // index of the line currently revealing within the block (−1 ⇒ idle)
  let introLineTyping = false; // is that line still animating char-by-char?
  let introOnBlockDone: (() => void) | undefined; // fired when the block's LAST line completes
  let introTypeTimer: number | undefined; // the pending per-char step timeout
  let introAdvanceTimer: number | undefined; // the inter-line ~2s auto-advance timeout (FB-86)
  const introAuxTimers: number[] = []; // other pending intro timeouts (fresh-divider fades)
  let introFreshEl: HTMLElement | null = null; // FB-199 — the live VN fresh divider (anchored)
  let introFreshTimer: number | undefined; // …and its pending fade countdown
  // FB-227 — the GBA caret (the cold open's co-typing primitive, TST1): rides the VN line
  // being typed, stays blinking through the inter-line hold, clears when the block finishes.
  let introCaretEl: HTMLElement | null = null;
  // FB-197 — Space/Enter advance the VN like a click; installed per scene, removed on teardown.
  let introKeyHandler: ((e: KeyboardEvent) => void) | null = null;
  // true for the SINGLE render on which the intro just ended, so the final beat's log lines paint
  // INSTANTLY as the shell reveals (FB-48 — no slow catch-up), not via the story cascade.

  // ── the interactive intro VN scene (ADR-104 / FB-47) — the dialogue TREE: meet → ask → decide ──
  // A full-screen washi surface mounted on `root` that HIDES the shell. The scene reads the SCENE
  // TREE (`introSceneAt`): a nameplate + a LEFT transcript column (greeting + every asked Q/A + the
  // chosen reply) where each fragment types on the GBA typewriter as it FIRST appears, and a RIGHT
  // interactive column gated ask → decide → outcome. The model is APPEND-ONLY (FB-81): the shell is
  // built ONCE per scene, then each state change appends only the NEW transcript lines and mutates
  // the panel in place — never a wholesale teardown+rebuild (that flashed, wiped the typewriter, and
  // resized the card). Reduced-motion / test env → instant (no typing). The MC's question + NPC's
  // answer are also emitted to the LOG by the core; the scene reflects them from the tree, not the log.

  // ── the source-tagged VN projection (ADR-110 §7.3) — the ONE normalized shape both the intro
  //    (`DIALOGUE_SCENES`) and the rung beats (`RUNG_BEATS`) feed into the SAME append-only engine.
  //    The engine below renders from `VnScene`/`VnOption` only, so it never branches on the raw
  //    scene type; only the DISPATCH (choose_intro vs choose_rung_option) reads `source`. ──
  type VnSource = 'intro' | 'rung' | 'scene';
  interface VnOption {
    readonly id: string;
    readonly label: string;
    readonly say: string; // the MC's reply → a `player` transcript line
    readonly react: string; // the speaker's reaction → the transcript, in `reactVoice`
    readonly reactVoice: VoiceCategory;
    readonly reactSpeaker?: string; // the react nameplate (undefined ⇒ a narrator react)
    readonly attr?: AttrId; // intro decision-button theming (+1 attr); rung: only the statBonus pick
    readonly accent?: string; // FB-147 — rung choice hint: warmth gold / even silver / costly shu
    readonly perk?: { readonly name: string; readonly desc: string; readonly mechanics: string };
    readonly note?: string; // rung `statBonus` delight line (the rare bonus) → a small outcome note
  }
  interface VnScene {
    readonly source: VnSource;
    readonly id: string;
    readonly voice: VoiceCategory;
    readonly speaker?: NpcId;
    readonly greeting: readonly IntroSetupLine[];
    readonly topics: readonly DialogueTopic[];
    readonly prompt: string;
    readonly options: readonly VnOption[];
  }
  function projectIntro(scene: DialogueScene): VnScene {
    return {
      source: 'intro',
      id: scene.id,
      voice: scene.voice,
      ...(scene.speaker !== undefined ? { speaker: scene.speaker } : {}),
      greeting: scene.greeting,
      topics: scene.topics,
      prompt: scene.decision.prompt,
      options: scene.decision.options.map((o): VnOption => {
        const rs = beatReactSpeaker(scene);
        return {
          id: o.id,
          label: o.label,
          say: o.say,
          react: o.react,
          reactVoice: beatReactVoice(scene),
          ...(rs !== undefined ? { reactSpeaker: rs } : {}),
          attr: o.stat.up as AttrId,
          perk: { name: o.perk.name, desc: o.perk.desc, mechanics: introStatDelta(o.stat) },
        };
      }),
    };
  }
  function projectRung(scene: RungScene): VnScene {
    return {
      source: 'rung',
      id: scene.id,
      voice: scene.voice,
      ...(scene.speaker !== undefined ? { speaker: scene.speaker } : {}),
      greeting: scene.greeting,
      topics: scene.topics,
      prompt: scene.decision.prompt,
      options: scene.decision.options.map((o): VnOption => {
        // a two-voice beat (e.g. R4) overrides the react to a NON-default speaker; else the scene's.
        const rs = o.reactNpc ? NPC_NAME[o.reactNpc] : beatReactSpeaker(scene);
        // FB-147 — the choice's colour hint: the rare statBonus pick wears its attr
        // pigment; otherwise the honest mechanical axis is the relationship write —
        // warmth-gaining reads GOLD, even reads SILVER, warmth-costing reads SHU
        // (deliberately telegraphs relational cost — TST4, the player never guesses).
        const warmth = (o.memory ?? []).reduce((n, m) => n + m.warmthDelta, 0);
        const accent =
          warmth > 0 ? 'var(--gold)' : warmth < 0 ? 'var(--shu-hi)' : 'var(--silver-dim)';
        return {
          id: o.id,
          label: o.label,
          say: o.say,
          react: o.react,
          reactVoice: o.reactNpc ? NPC_VOICE[o.reactNpc] : beatReactVoice(scene),
          ...(rs !== undefined ? { reactSpeaker: rs } : {}),
          ...(o.statBonus ? { note: o.statBonus.note, attr: o.statBonus.attr } : { accent }),
        };
      }),
    };
  }
  // storywave G4.9 — the generalized VN scene (the Count / season overlays / nengu / side-beats /
  // the R7 dream) projects through the SAME normalized shape (one modal — TST1). `def.scene` IS a
  // RungScene, so this mirrors projectRung — but the source is 'scene' (its picks dispatch
  // choose_scene_option, its narration-only Continue dispatches advance_scene_beat, its asks
  // dispatch ask_scene_topic). A scene NEVER promotes, so no rung-up ceremony fires on its
  // Continue. Topics used to be DROPPED here (`topics: []`) because scenes had no ask reducer —
  // which quietly made every ask-topic the side-beats authored (`sb-sickroom` and friends)
  // unreachable prose. HD-43 gave them the reducer; they pass through now.
  function projectScene(scene: RungScene): VnScene {
    return {
      source: 'scene',
      id: scene.id,
      voice: scene.voice,
      ...(scene.speaker !== undefined ? { speaker: scene.speaker } : {}),
      greeting: scene.greeting,
      topics: scene.topics,
      prompt: scene.decision.prompt,
      options: scene.decision.options.map((o): VnOption => {
        const rs = o.reactNpc ? NPC_NAME[o.reactNpc] : beatReactSpeaker(scene);
        const warmth = (o.memory ?? []).reduce((n, m) => n + m.warmthDelta, 0);
        const accent =
          warmth > 0 ? 'var(--gold)' : warmth < 0 ? 'var(--shu-hi)' : 'var(--silver-dim)';
        return {
          id: o.id,
          label: o.label,
          say: o.say,
          react: o.react,
          reactVoice: o.reactNpc ? NPC_VOICE[o.reactNpc] : beatReactVoice(scene),
          ...(rs !== undefined ? { reactSpeaker: rs } : {}),
          ...(o.statBonus ? { note: o.statBonus.note, attr: o.statBonus.attr } : { accent }),
        };
      }),
    };
  }
  // The ACTIVE VN scene (source-tagged) — the intro (as today) while it runs, else the ready-and-
  // triggered rung beat (`RUNG_BEATS[rungBeat]` via `rungBeatFor`). `null` ⇒ no VN is live (the shell
  // shows). The reducers own the core rung selectors (`rungTopic`/`rungOption`/`availableRungTopics`);
  // the renderer reads options off the projection + inlines the (source-agnostic) topic gate.
  function activeVn(state: GameState): VnScene | null {
    // ADR-139 — the DEV story take-switcher substitutes the ACTIVE scene with a selected
    // take (display/content only; state + RNG never fork — takes are state-compatible by
    // the narrative/takes README rule). Identity when everything is 'canon'; folds to the
    // plain selectors in a strip build (same `__DEV_TOOLS__` axis as the panel, ADR-138).
    if (introActive(state.introBeat)) {
      const s = introSceneAt(state.introBeat);
      const sub = __DEV_TOOLS__ && dev && s ? dev.subIntroScene(s) : s;
      return sub ? projectIntro(sub) : null;
    }
    if (state.rungBeat !== null) {
      const s = rungBeatFor(state.rungBeat);
      const sub = __DEV_TOOLS__ && dev && s ? dev.subRungScene(s) : s;
      return sub ? projectRung(sub) : null;
    }
    // storywave G4.9 — a live generalized scene (Count / season / nengu / side-beat / dream).
    // ADR-139 — the switcher substitutes its RungScene body with the selected take (display-only;
    // trigger/once stay canon, so a take never re-fires). Identity when everything is 'canon'.
    if (state.activeScene !== null) {
      const def = sceneById(state.activeScene.id);
      const s = def ? def.scene : null;
      const sub = __DEV_TOOLS__ && dev && s ? dev.subScene(s) : s;
      return sub ? projectScene(sub) : null;
    }
    return null;
  }
  // Is a full-screen VN scene live? (the render gate — intro OR a rung beat). ADR-110 §7.3: the washi
  // surface hides the shell during BOTH; the world inks in only after the active scene ends.
  function vnActive(state: GameState): boolean {
    return introActive(state.introBeat) || state.rungBeat !== null || state.activeScene !== null;
  }
  // pin the LEFT transcript column to its newest line (FB-84) — the .vn-lines' scroll parent (.vn-story).
  function introScrollToBottom(): void {
    const scroller = introStoryLinesEl?.parentElement;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }
  // clear every pending intro timeout WITHOUT tearing down the DOM (FB-81 — timer cleanup ≠ teardown).
  function clearIntroTimers(): void {
    if (introTypeTimer !== undefined) {
      window.clearTimeout(introTypeTimer);
      introTypeTimer = undefined;
    }
    if (introAdvanceTimer !== undefined) {
      window.clearTimeout(introAdvanceTimer);
      introAdvanceTimer = undefined;
    }
    for (const t of introAuxTimers) window.clearTimeout(t);
    introAuxTimers.length = 0;
    if (introFreshTimer !== undefined) {
      window.clearTimeout(introFreshTimer);
      introFreshTimer = undefined;
    }
    introFreshEl = null;
    introLineTyping = false;
  }
  // the fade-away "fresh entries" divider — the SAME idiom the main log uses (FB-27/FB-54), reused here
  // (identical `.log-fresh-divider` node) so a resolved choice's new lines are marked, then self-fade.
  function dropIntroFreshDivider(): void {
    if (!introStoryLinesEl) return;
    // FB-199 — anchored: while a divider is alive, a fresh block re-arms its fade
    // instead of stacking a second marker; the boundary stays where the reader left it.
    if (introFreshEl?.isConnected) {
      armIntroFreshFade();
      return;
    }
    const d = buildFreshDividerNode();
    introStoryLinesEl.append(d);
    introFreshEl = d;
    armIntroFreshFade();
  }
  function armIntroFreshFade(): void {
    const d = introFreshEl;
    if (!d) return;
    if (introFreshTimer !== undefined) window.clearTimeout(introFreshTimer);
    d.classList.remove('fading'); // a late block mid-fade pulls it back
    introFreshTimer = window.setTimeout(() => {
      introFreshTimer = undefined;
      d.classList.add('fading');
      const t = window.setTimeout(() => {
        d.remove();
        if (introFreshEl === d) introFreshEl = null;
      }, FRESH_DIVIDER_FADE_MS);
      introAuxTimers.push(t);
    }, FRESH_DIVIDER_TTL_MS);
  }
  // FULL teardown — fires ONLY on a scene change or when the intro ends, never on an in-scene update.
  function teardownIntroScene(): void {
    clearIntroTimers();
    if (introKeyHandler) {
      document.removeEventListener('keydown', introKeyHandler);
      introKeyHandler = null;
    }
    introScene?.remove();
    introScene = null;
    introSceneCurrentId = null;
    introStoryLinesEl = null;
    introPanelEl = null;
    introAskEl = null;
    introDecideEl = null;
    introOutcomeEl = null;
    introCaretEl = null; // FB-227 — the scene DOM (and its caret) is gone
    introTopicBtns.clear();
    introRenderedKeys.clear();
    introBlockNodes = [];
    introBlockIndex = -1;
    introOnBlockDone = undefined;
    introLastState = null;
    pendingChoiceId = null;
    introPhase = 'ask';
  }
  // One entry of the LEFT-column transcript. `speaker` renders a "<name>: " prefix on any voiced line
  // (NPC or player — FB-88); `player` flags the player's own lines (the player colour); `fresh` marks a
  // resolved-choice line (⇒ the fade-away divider); `prompt` styles the decision question. `key` is
  // stable across renders so the append-only diff never re-adds an entry.
  interface VnEntry {
    readonly key: string;
    readonly voice: VoiceCategory;
    readonly text: string;
    readonly speaker?: string | undefined;
    readonly player?: boolean;
    readonly fresh?: boolean;
    readonly prompt?: boolean;
  }
  // The FULL desired transcript for the current state — greeting, each asked Q/A, the decision
  // prompt (once deciding), then the chosen say + NPC react (once a choice is latched). Order is
  // stable + append-only: a later state is always a prefix-superset of an earlier one within a scene.
  function introTranscript(scene: VnScene, state: GameState): VnEntry[] {
    const out: VnEntry[] = [];
    // FB-198 — a player-voiced authored line (the narrative `You:` form) carries no static
    // name; it takes the G4.7 speaker-ladder label here, same as the core's log funnel.
    const authoredSpeaker = (line: {
      voice: VoiceCategory;
      speaker?: string;
    }): string | undefined =>
      line.voice === 'player' && line.speaker === undefined ? playerSpeaker(state) : line.speaker;
    scene.greeting.forEach((line, i) =>
      out.push({
        key: `greet:${i}`,
        voice: line.voice,
        text: line.text,
        speaker: authoredSpeaker(line),
        player: line.voice === 'player',
      }),
    );
    const askedForScene = state.askedTopics
      .map((id) => scene.topics.find((t) => t.id === id))
      .filter((t): t is DialogueTopic => t !== undefined);
    for (const t of askedForScene) {
      out.push({
        key: `askq:${t.id}`,
        voice: 'player',
        text: t.label,
        speaker: playerSpeaker(state), // FB-198 — the ladder label, matching the core's log funnel
        player: true,
      });
      t.answer.forEach((line, i) =>
        out.push({
          key: `answ:${t.id}:${i}`,
          voice: line.voice,
          text: line.text,
          speaker: authoredSpeaker(line),
          player: line.voice === 'player',
        }),
      );
    }
    const pending = pendingChoiceId
      ? scene.options.find((o) => o.id === pendingChoiceId)
      : undefined;
    // the decision prompt joins the transcript once we're deciding (so it, too, TYPES — FB-82/FB-83).
    if (introPhase === 'decide' || pending)
      out.push({ key: 'prompt', voice: 'narrator', text: scene.prompt, prompt: true });
    if (pending) {
      out.push({
        key: `say:${pending.id}`,
        voice: 'player',
        text: pending.say,
        speaker: playerSpeaker(state), // FB-198 — the ladder label, matching the core's log funnel
        player: true,
        fresh: true,
      });
      // the react's voice/nameplate ride on the OPTION (a rung two-voice beat overrides the speaker).
      out.push({
        key: `react:${pending.id}`,
        voice: pending.reactVoice,
        text: pending.react,
        speaker: pending.reactSpeaker,
        fresh: true,
      });
    }
    return out;
  }

  // ── the per-block typewriter (FB-62/FB-78) — types the NEWLY-appended lines one at a time; a click on
  //    the scene completes the current line (if mid-type) or advances to the next (one line/click). ──
  function introFinishBlock(): void {
    // FB-271 — the caret RESTS on the block's last line until the scene advances (the GBA
    // "waiting for you" beat the human missed): it clears on the next block's first line
    // (setIntroCaret moves it) or on scene teardown — no longer the instant the block ends.
    if (introTypeTimer !== undefined) {
      window.clearTimeout(introTypeTimer);
      introTypeTimer = undefined;
    }
    if (introAdvanceTimer !== undefined) {
      window.clearTimeout(introAdvanceTimer);
      introAdvanceTimer = undefined;
    }
    introLineTyping = false;
    introBlockNodes = [];
    introBlockIndex = -1;
    introScene?.classList.remove('typing');
    const cb = introOnBlockDone;
    introOnBlockDone = undefined;
    cb?.(); // ⇒ fade the RIGHT panel's controls in, AFTER the text has finished typing
  }
  // Arm the ~2s inter-line hold, then AUTO-START the next line (FB-86) — no click needed. Guards the
  // timer to a single pending instance so a click racing the auto-fire can't double-advance.
  function scheduleIntroAutoAdvance(ms: number = INTRO_LINE_ADVANCE_MS): void {
    if (introAdvanceTimer !== undefined) return; // already armed — never stack two
    introAdvanceTimer = window.setTimeout(() => {
      introAdvanceTimer = undefined;
      if (introBlockIndex < introBlockNodes.length - 1) introStartLine(introBlockIndex + 1);
    }, ms);
  }
  function introLineComplete(advanceMs: number = INTRO_LINE_ADVANCE_MS): void {
    introLineTyping = false;
    if (introBlockIndex >= introBlockNodes.length - 1) introFinishBlock();
    else scheduleIntroAutoAdvance(advanceMs); // FB-86 auto-advance; FB-118 shorter beat after a click
  }
  // FB-141 — voice colour scopes to the SPOKEN words only: a VN line's quoted
  // segments render as .vn-speech spans (coloured by the line's --voice), the
  // in-line narration stays neutral ink. The typewriter writes through the same
  // segmenter so speech is coloured AS it types, no completion pop.
  function vnSegments(text: string): { text: string; speech: boolean }[] {
    const re = /"[^"]*"|[“][^”]*[”]/g;
    const segs: { text: string; speech: boolean }[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) segs.push({ text: text.slice(last, m.index), speech: false });
      segs.push({ text: m[0], speech: true });
      last = m.index + m[0].length;
    }
    if (last < text.length) segs.push({ text: text.slice(last), speech: false });
    return segs;
  }
  function writeVnSlice(span: HTMLElement, text: string, upTo: number): void {
    span.textContent = '';
    let pos = 0;
    for (const seg of vnSegments(text)) {
      if (pos >= upTo) break;
      const take = seg.text.slice(0, Math.max(0, upTo - pos));
      if (seg.speech) span.append(el('span', 'vn-speech', take));
      else span.append(document.createTextNode(take));
      pos += seg.text.length;
    }
  }
  // FB-227 — move the GBA caret to the given span (or clear it): one caret, ever.
  function setIntroCaret(span: HTMLElement | null): void {
    if (introCaretEl === span) return;
    introCaretEl?.classList.remove('co-typing');
    span?.classList.add('co-typing');
    introCaretEl = span;
  }
  function introStartLine(index: number): void {
    introBlockIndex = index;
    const node = introBlockNodes[index];
    node?.span.parentElement?.classList.remove('vn-pending'); // FB-152 — its turn: reveal the line
    if (node) setIntroCaret(node.span); // FB-227 — the caret rides the typing line
    introScrollToBottom();
    if (!node || node.text.length === 0) {
      introLineComplete();
      return;
    }
    if (QA_INSTANT_TEXT) {
      // one step, no per-char timers (setTimeout(0) still clamps to ~4ms/char)
      writeVnSlice(node.span, node.text, node.text.length);
      introLineComplete();
      return;
    }
    introLineTyping = true;
    let i = 0;
    const step = (): void => {
      introTypeTimer = undefined;
      i += 1;
      writeVnSlice(node.span, node.text, i);
      introScrollToBottom(); // FB-84 — stick to the bottom as each char lands
      if (i < node.text.length) introTypeTimer = window.setTimeout(step, TYPE_MS_PER_CHAR);
      else introLineComplete();
    };
    introTypeTimer = window.setTimeout(step, TYPE_MS_PER_CHAR);
  }
  // finish the in-flight block INSTANTLY (used when a new block must append while one still types).
  function introFlushBlock(): void {
    if (introBlockNodes.length === 0) return;
    if (introTypeTimer !== undefined) {
      window.clearTimeout(introTypeTimer);
      introTypeTimer = undefined;
    }
    for (const n of introBlockNodes) {
      n.span.parentElement?.classList.remove('vn-pending'); // FB-152
      writeVnSlice(n.span, n.text, n.text.length);
    }
    introFinishBlock();
  }
  // A click on the scene SPEEDS UP the auto-advancing typewriter (FB-86) — it never pauses it.
  //   • mid-type  → complete this line instantly; the ~2s auto-advance then runs (introLineComplete).
  //   • in the ~2s hold → cancel the wait and start the next line NOW.
  // Guarded so a click racing the pending auto-timer can't fire the next line twice.
  function introAdvance(): void {
    if (introBlockIndex < 0 || introBlockNodes.length === 0) return; // nothing typing
    if (introLineTyping) {
      if (introTypeTimer !== undefined) {
        window.clearTimeout(introTypeTimer);
        introTypeTimer = undefined;
      }
      const node = introBlockNodes[introBlockIndex];
      if (node) writeVnSlice(node.span, node.text, node.text.length);
      introLineComplete(INTRO_CLICK_ADVANCE_MS); // FB-118 — click-through: snappy beat, not the 2s hold
    } else if (introBlockIndex < introBlockNodes.length - 1) {
      if (introAdvanceTimer !== undefined) {
        window.clearTimeout(introAdvanceTimer); // skip the remaining hold — go faster
        introAdvanceTimer = undefined;
      }
      introStartLine(introBlockIndex + 1);
    }
  }
  // Append a block of NEW transcript entries to the story column and TYPE them (unless instant).
  // Never destroys existing nodes; fires `onDone` once the whole block finishes (⇒ reveal panel).
  function introAppendBlock(entries: VnEntry[], onDone: () => void): void {
    if (introBlockNodes.length > 0) introFlushBlock(); // never leave a half-typed prior block
    const instant = introInstant();
    if (entries.some((e) => e.fresh)) dropIntroFreshDivider(); // FB-76 — mark a resolved-choice block
    const nodes: { span: HTMLElement; text: string }[] = [];
    for (const e of entries) {
      const p = el('p', `vn-line${e.prompt ? ' vn-prompt-line' : ''}`);
      // FB-141 — the voice colour rides a per-line --voice custom property and lands
      // only on the SPOKEN segments (.vn-speech) + the name prefix; in-line narration
      // stays neutral ink. A decision PROMPT is the scene's call to action and reads
      // BRIGHT GOLD whole-line (F132/FB-143 — gold-hi, clear of the steward amber).
      if (e.prompt) p.style.color = 'var(--gold-hi)';
      else {
        // FB-228 — a narrator line's embedded quote is a character speaking: route the
        // inferred speaker's colour through the SAME --voice the .vn-speech spans read.
        const quoteVoice = e.voice === 'narrator' ? inferQuoteVoice(e.text) : null;
        p.style.setProperty('--voice', VOICE_COLOR[quoteVoice ?? e.voice]);
      }
      if (e.speaker) p.classList.add('vn-spoken'); // FB-228 — spoken lines step in (indent)
      // FB-88/FB-50 — EVERY voiced line carries its speaker-name prefix ("Sōan: " / "Genemon: " / "You: "),
      // not just the player's: the NAME is the primary "who's talking" signal, colour only reinforces
      // it. The narrator/decision-prompt line has no speaker ⇒ no prefix. The name paints instantly;
      // only the speech itself types in.
      if (e.speaker) p.append(el('span', 'vn-speaker', `${e.speaker}: `));
      const span = el('span', 'vn-text');
      p.append(span);
      // FB-144/FB-158 — a voiced line with NO quotation marks IS bare dialogue
      // (dialogue.md teach lines): display it QUOTED like every other utterance,
      // which also routes it through the speech-colour segmenter for free.
      const text =
        !e.prompt && e.voice !== 'narrator' && !/["“]/.test(e.text) ? `"${e.text}"` : e.text;
      introStoryLinesEl?.append(p);
      introRenderedKeys.add(e.key);
      if (instant) {
        writeVnSlice(span, text, text.length); // FB-141 — speech-scoped colour
      } else {
        // FB-152 — a queued line stays fully HIDDEN (name included) until its
        // turn types; the FB-50 instant-name rule applies per line, not per block.
        p.classList.add('vn-pending');
        nodes.push({ span, text });
      }
    }
    introScrollToBottom();
    if (instant || nodes.length === 0) {
      onDone();
      return;
    }
    introBlockNodes = nodes;
    introBlockIndex = -1;
    introOnBlockDone = onDone;
    introScene?.classList.add('typing');
    introStartLine(0);
  }

  // ── the RIGHT panel — a STABLE, always-present region (FB-79): its sub-panels swap in place, never
  //    a teardown. The active one fades in ONCE (FB-78) after the left text finishes; the others hide. ──
  type PanelKind = 'ask' | 'decide' | 'outcome';
  function activePanelKind(): PanelKind {
    return pendingChoiceId ? 'outcome' : introPhase;
  }
  function activePanelEl(): HTMLElement | null {
    const kind = activePanelKind();
    return kind === 'ask' ? introAskEl : kind === 'decide' ? introDecideEl : introOutcomeEl;
  }
  // is the active sub-panel already revealed? (FB-90 — lets an idle tick skip the reveal entirely.)
  function activePanelShown(): boolean {
    const elx = activePanelEl();
    return !!elx && !elx.hidden;
  }
  function showPanel(elx: HTMLElement | null, on: boolean): void {
    if (!elx) return;
    if (on) {
      if (elx.hidden) {
        elx.hidden = false;
        // soft staggered fade/rise (auto-zeroed for reduced-motion); skipped under
        // QA instant text — the animation makes every e2e press wait for stability
        if (!QA_INSTANT_TEXT) elx.classList.add('vn-panel-in');
      }
    } else if (!elx.hidden) {
      elx.hidden = true;
      elx.classList.remove('vn-panel-in');
    }
  }
  // build the outcome sub-panel (perk/bonus box + Continue) the first time a choice is latched. The
  // intro shows its granted PERK; a rung beat shows its rare `statBonus` NOTE when the pick carries
  // one (most rung picks are relationship/flag-only ⇒ just the Continue). Continue is the ONLY control
  // that advances — it dispatches by SOURCE (`choose_intro` vs `choose_rung_option`, ADR-110 §7.3).
  function ensureOutcomePanel(scene: VnScene): void {
    if (introOutcomeEl || !introPanelEl) return;
    const opt = pendingChoiceId ? scene.options.find((o) => o.id === pendingChoiceId) : undefined;
    if (!opt) return;
    const wrap = el('div', 'vn-outcome');
    wrap.hidden = true;
    if (opt.perk) wrap.append(buildVnPerkBox(opt.perk, opt.attr));
    else if (opt.note) wrap.append(el('div', 'vn-outcome-note', opt.note)); // rung statBonus delight
    const optId = opt.id;
    if (scene.source === 'intro') {
      const cont = el('button', 'verb intro-continue', 'Continue');
      cont.type = 'button';
      cont.addEventListener('click', () => dispatch({ type: 'choose_intro', optionId: optId }));
      wrap.append(cont);
    } else if (scene.source === 'scene') {
      // storywave G4.9 — a generalized scene's terminal pick: a plain Continue (NO promotion/
      // ceremony — scenes never advance a rank) that dispatches choose_scene_option.
      const cont = el('button', 'verb intro-continue', 'Continue');
      cont.type = 'button';
      cont.addEventListener('click', () =>
        dispatch({ type: 'choose_scene_option', optionId: optId }),
      );
      wrap.append(cont);
    } else {
      // FB-328 — the panel names what the button does BEFORE the press: a promotion
      // kicker + the target rung, so a flag-only pick (no perk, no statBonus) never
      // reads as one bare orphaned "Rung up" button. Reuses the ceremony's classes.
      const targetRank = RANKS.find((r) => r.id === introLastState?.rungBeat);
      wrap.append(el('div', 'rankup-kicker', 'Promotion 昇'));
      if (targetRank) {
        wrap.append(
          el(
            'div',
            'vn-rung-flavor',
            `The house raises you — ${targetRank.title} ${targetRank.kanji}.`,
          ),
        );
      }
      // FB-153 — the promotion ceremony lives IN the beat modal (human spec): the
      // outcome's control reads "Rung up"; pressing it renders the seal + the
      // promoted-to flavour HERE, and its Continue does the real dispatch. The old
      // floating overlay is suppressed for this transition (showRankUp skip-once).
      const rungUp = el('button', 'verb intro-continue vn-rungup', 'Rung up');
      rungUp.type = 'button';
      rungUp.addEventListener('click', () => {
        if (introScene?.querySelector('.vn-rung-ceremony')) return;
        const target = introLastState?.rungBeat;
        const rank = RANKS.find((r) => r.id === target);
        const cer = el('div', 'vn-rung-ceremony');
        cer.append(el('div', 'rankup-kicker', 'Promoted'));
        const seal = el('div', 'hanko-css');
        seal.lang = 'ja';
        seal.textContent = rank?.kanji ?? '昇';
        cer.append(seal);
        cer.append(
          el('div', 'vn-rung-flavor', `You've been promoted to ${rank?.title ?? 'a new rung'}.`),
        );
        // FB-272 — the ceremony carries the "what opens" context (human, 2026-07-10): the
        // rank's unlocked surfaces with a short ceremonyLabel list HERE, framed as the
        // steward's expectation — instead of flooding Story after the ceremony closes.
        const opens = (rank?.rewardOnReach?.unlock ?? [])
          .map((id) => SURFACES.find((su) => su.id === id)?.ceremonyLabel)
          .filter((l): l is string => l !== undefined);
        if (opens.length > 0) {
          const list = el('div', 'vn-rung-opens');
          list.append(
            el('div', 'vn-rung-opens-head', 'Now open to you — the house expects them worked:'),
          );
          for (const label of opens) list.append(el('div', 'vn-rung-opens-item', label));
          cer.append(list);
        }
        const cont = el('button', 'verb intro-continue', 'Continue');
        cont.type = 'button';
        cont.addEventListener('click', () => {
          ctx.suppressRankUpOverlay(); // the modal already held the ceremony
          ctx.armSlopGate(); // re-arm: covers a run reloaded mid-beat (the trigger click was last session)
          dispatch({ type: 'choose_rung_option', optionId: optId });
        });
        cer.append(cont);
        rungUp.remove();
        // FB-159 — the promotion is HUGE: the ceremony overlays the WHOLE card,
        // seal + flavour + Continue centred (not a strip in the side panel).
        const card = introScene?.querySelector('.vn-card');
        (card ?? wrap).append(cer);
        sfx.rankUp(); // the temple bell rings AT the ceremony, not after the modal
      });
      wrap.append(rungUp);
    }
    introPanelEl.append(wrap);
    introOutcomeEl = wrap;
  }
  // reveal the active sub-panel (fade once) + hide the others. Called after a block finishes typing.
  function revealActivePanel(scene: VnScene): void {
    const kind = activePanelKind();
    if (kind === 'outcome') ensureOutcomePanel(scene);
    showPanel(introAskEl, kind === 'ask');
    showPanel(introDecideEl, kind === 'decide');
    showPanel(introOutcomeEl, kind === 'outcome');
    introScrollToBottom();
  }
  // hide the sub-panels that AREN'T the incoming phase, so old controls don't linger/race while the
  // new block types. The incoming panel is left as-is (already-shown ask stays; a not-yet-shown one
  // reveals later via revealActivePanel) — the panel region itself never collapses (fixed width).
  function hideStalePanels(kind: PanelKind): void {
    if (kind !== 'ask') showPanel(introAskEl, false);
    if (kind !== 'decide') showPanel(introDecideEl, false);
    if (kind !== 'outcome') showPanel(introOutcomeEl, false);
  }
  // reconcile the ask hub IN PLACE: append any newly-gated topic buttons, dim asked ones — never a
  // rebuild (FB-81), so the panel stays static (FB-79).
  function reconcileAskHub(scene: VnScene, state: GameState): void {
    if (!introAskEl) return; // decision-only scene → no ask hub
    const topicsWrap = introAskEl.querySelector<HTMLElement>('.vn-ask-topics');
    if (!topicsWrap) return;
    const asked = new Set(state.askedTopics);
    // the gate over the asked-set is source-agnostic (the intro's `availableTopics` + the rung's
    // `availableRungTopics` are the same filter); inline it so one path serves both scene sources.
    const askable = scene.topics.filter((t) => (t.gate ? t.gate(asked) : true));
    const source = scene.source;
    for (const t of askable) {
      let b = introTopicBtns.get(t.id);
      if (!b) {
        b = el('button', 'intro-ask', t.label);
        b.type = 'button';
        b.addEventListener('click', () =>
          dispatch(
            source === 'intro'
              ? { type: 'ask_topic', topicId: t.id }
              : source === 'scene'
                ? { type: 'ask_scene_topic', topicId: t.id }
                : { type: 'ask_rung_topic', topicId: t.id },
          ),
        );
        introTopicBtns.set(t.id, b);
        topicsWrap.append(b);
        if (!introInstant()) b.classList.add('vn-panel-in'); // a newly-surfaced topic fades in
      }
      if (asked.has(t.id) && !b.classList.contains('asked')) {
        b.classList.add('asked');
        b.title = 'Asked'; // FB-269 — a re-ask is a no-op now (the answer stays in the transcript)
      }
    }
  }

  // ── build the scene SHELL exactly ONCE per scene (FB-81); reconcileIntro then only appends/mutates. ──
  function buildAskPanel(): HTMLElement {
    const askGroup = el('div', 'vn-ask');
    askGroup.hidden = true;
    const head = el('div', 'vn-ask-head');
    const seal = el('span', 'vn-ask-seal', '問');
    seal.lang = 'ja';
    seal.setAttribute('aria-hidden', 'true');
    head.append(seal, document.createTextNode('Ask'));
    askGroup.append(head);
    askGroup.append(el('div', 'vn-ask-topics')); // topic buttons land here (reconcileAskHub)
    askGroup.append(brushRule());
    const done = el('button', 'intro-done', `I've heard enough`);
    done.type = 'button';
    // UI-only (no core state change): flip to the decide phase + resync (append the prompt, no flash).
    done.addEventListener('click', () => {
      if (introPhase !== 'ask' || pendingChoiceId) return;
      introPhase = 'decide';
      if (introLastState) syncIntroScene(introLastState);
    });
    askGroup.append(done);
    return askGroup;
  }
  function buildDecidePanel(scene: VnScene): HTMLElement {
    const decide = el('div', 'vn-decide');
    decide.hidden = true;
    // storywave G4.9 — a narration-only scene (empty decision, ADR-165: the nengu frame, the R7
    // dream body, R2's silent yard-hand beat) has no pick — its terminal is a single Continue that
    // dispatches advance_scene_beat (the engine's empty-options path closes the scene).
    if (scene.source === 'scene' && scene.options.length === 0) {
      const cont = el('button', 'verb intro-continue', 'Continue');
      cont.type = 'button';
      cont.addEventListener('click', () => dispatch({ type: 'advance_scene_beat' }));
      const choices = el('div', 'vn-choices vn-grid');
      choices.append(cont);
      decide.append(choices);
      return decide;
    }
    const choices = el('div', 'vn-choices vn-grid');
    for (const opt of scene.options) {
      const attr = opt.attr;
      const b = el('button', 'verb intro-choice', opt.label);
      b.type = 'button';
      // theme by the POSITIVE (+1) attribute; a rung choice with none carries its
      // FB-147 warmth accent (gold/silver/shu); a pure-flavour choice falls to --ai.
      b.style.setProperty('--attr-accent', attr ? ATTR_COLOR[attr] : (opt.accent ?? 'var(--ai)'));
      if (attr) b.append(el('span', 'intro-choice-tag', ATTR_META[attr].kanji));
      // UI-only: LATCH the choice (shows the reply + perk + Continue); the dispatch waits for Continue.
      b.addEventListener('click', () => {
        if (pendingChoiceId) return;
        pendingChoiceId = opt.id;
        if (introLastState) syncIntroScene(introLastState);
      });
      choices.append(b);
    }
    decide.append(choices);
    return decide;
  }
  function buildIntroShell(scene: VnScene): void {
    const root_ = el('div', 'vn-scene');
    const card = el('div', 'vn-card frame');
    card.append(introNameplate(scene));
    // TWO columns: LEFT = the diegetic transcript (the ONLY place text renders; scrolls internally,
    // fixed height so the card never resizes — FB-80/FB-84); RIGHT = the stable interactive panel (FB-79).
    const body = el('div', 'vn-body');
    const story = el('div', 'vn-story');
    const lines = el('div', 'vn-lines');
    story.append(lines);
    const panel = el('div', 'vn-panel');
    body.append(story, panel);
    card.append(body);
    root_.append(card);
    // a click on the scene (not on a control) advances the typewriter by one line (FB-62).
    root_.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('button')) return;
      introAdvance();
    });
    // FB-197 — Space/Enter advance too (classic VN keyboard idiom). Skipped when a control
    // has focus (Space must still press the focused button) or a modal dialog is open;
    // preventDefault stops Space from scrolling the page.
    introKeyHandler = (e: KeyboardEvent) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        target.closest('button, input, textarea, select, [contenteditable]')
      )
        return;
      if (document.querySelector('.modal-scrim:not([hidden])')) return;
      e.preventDefault();
      introAdvance();
    };
    document.addEventListener('keydown', introKeyHandler);
    introAskEl = scene.topics.length > 0 ? buildAskPanel() : null;
    introDecideEl = buildDecidePanel(scene);
    if (introAskEl) panel.append(introAskEl);
    panel.append(introDecideEl);
    introStoryLinesEl = lines;
    introPanelEl = panel;
    introOutcomeEl = null;
    introScene = root_;
    root.append(root_);
  }
  // APPEND-ONLY reconcile: diff the transcript vs the DOM, append + type only the NEW lines, mutate
  // the panel in place. NEVER a teardown/rebuild within a scene (that was the flash — FB-81).
  function reconcileIntro(scene: VnScene, state: GameState): void {
    introLastState = state;
    reconcileAskHub(scene, state); // dim asked / surface newly-gated topics (in place)
    const fresh = introTranscript(scene, state).filter((e) => !introRenderedKeys.has(e.key));
    if (fresh.length > 0) {
      hideStalePanels(activePanelKind()); // clear stale controls before the new block types
      introAppendBlock(fresh, () => revealActivePanel(scene));
    } else if (introBlockNodes.length === 0 && !activePanelShown()) {
      // no new text, nothing mid-type, and the active panel isn't yet up ⇒ a pure panel swap (Done)
      // that needs its first reveal. Once it IS shown, an idle tick does NOTHING here — no re-fade,
      // no scroll yank — so a re-render of unchanged intro state can never flicker (FB-90).
      revealActivePanel(scene);
    }
  }
  // The intro perk box — the same JRPG frame as the log-line perk box (`buildPerkBox`), but themed
  // by the attribute the choice grants +1: an accent bar + a filled attribute KANJI chip, so the
  // perk visibly "belongs" to its stat. A pure-flavour choice (no attr) falls back to the neutral box.
  // Takes the ALREADY-normalized perk (`{name,desc,mechanics}`) so both the intro's granted perk and
  // any future VN outcome feed it (ADR-110 §7.3) — the ± mechanics are baked in at projection time.
  function buildVnPerkBox(
    perk: { readonly name: string; readonly desc: string; readonly mechanics: string },
    attr: AttrId | undefined,
  ): HTMLElement {
    const wrap = el('div', 'intro-perk-line');
    buildPerkBox(wrap, perk);
    if (attr) {
      const box = wrap.querySelector<HTMLElement>('.perk-box');
      if (box) {
        box.classList.add('attr-themed');
        box.style.setProperty('--attr-accent', ATTR_COLOR[attr]);
        // a filled kanji chip stamped on the box corner — the perk's stat, at a glance.
        const chip = el('span', 'perk-attr-chip', ATTR_META[attr].kanji);
        chip.lang = 'ja';
        chip.setAttribute('aria-label', `+1 ${ATTR_META[attr].label}`);
        box.prepend(chip);
      }
    }
    return wrap;
  }
  // Mount / update the full-screen scene. Builds the shell ONCE per scene (a scene CHANGE is the
  // only in-intro teardown — a genuine new card, so its ink-in fade is welcome); every other update
  // is APPEND-ONLY via reconcileIntro, so an unrelated re-render never flashes or restarts typing.
  function syncIntroScene(state: GameState): void {
    const scene = activeVn(state); // intro scene OR the ready-and-triggered rung beat (ADR-110 §7.3)
    if (!scene) {
      teardownIntroScene(); // the VN ended → drop the scene, reset everything
      return;
    }
    // ADR-139 — a DEV take swap must rebuild the (append-only) live transcript: fold the story
    // epoch into the scene key so a swap reads as a scene change. Identity in prod/strip builds.
    const sceneKey =
      __DEV_TOOLS__ && dev && dev.storyEpoch() > 0 ? `${scene.id}#${dev.storyEpoch()}` : scene.id;
    if (sceneKey !== introSceneCurrentId) {
      teardownIntroScene(); // a new scene ⇒ the one place we rebuild the shell wholesale
      introSceneCurrentId = sceneKey;
      // a decision-only scene (the dream — no topics) opens straight in the decide phase.
      introPhase = scene.topics.length > 0 ? 'ask' : 'decide';
      pendingChoiceId = null;
      buildIntroShell(scene);
    }
    reconcileIntro(scene, state);
  }

  return {
    vnActive,
    syncIntroScene,
    teardownIntroScene,
    introSceneActive: () => introScene !== null,
  };
}
