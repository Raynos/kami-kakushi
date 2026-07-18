// The thin DOM renderer (PRD §6.9): a near-pure function of GameState that
// reconciles the DOM and dispatches intents — ZERO game logic, never mutates state.
// The woodblock shell is built once; the event log reconciles incrementally (new
// lines ink in; loaded lines render statically — no re-spam). The rest of the UI is
// cheap enough to rebuild each render.

import type {
  GameState,
  Intent,
  LogEntry,
  LogChannel,
  Season,
  StanceId,
  VoiceCategory,
  AttrId,
  NpcId,
  MetaVerb,
} from '../core';
import {
  sleepForecast,
  treatForecast,
  restSickroomForecast,
  timingFor,
  getActivity,
  activityForecast,
  introActive,
  isUnlocked,
  unlockedSurfaces,
  hasFlag,
  formatCoin,
  restRefill,
  currentRank,
  rungProgress,
  nextRankId,
  getRank,
  promotionReady,
  pendingPromotionTarget,
  SKILLS,
  skillVisible,
  getWeapon,
  ESTATE_STAGES,
  RECIPES,
  getMaterial,
  getNode,
  balance,
  NPC_NAME,
  rungRequirements,
} from '../core';
import {
  reconcileList,
  setText,
  toggle,
  setClass,
  setDisabled,
  setStyle,
} from './reconcile';
import type { Sfx } from './sfx';
// the SHIPPED estate map — the 絵図 survey-plan sheet, the human-picked winner of the ADR-075
// real-map diverge (HR-7). storywave G4.9: rebuilt on the map-sheets geometry (the ONE aligned
// layout) since the old ezu.ts POS keyed to retired node ids and drew nothing for the G4 estate.
import { travelPresenceRef } from './map-variants/sheet-map';
import { COLD_OPEN } from '../core/content/coldOpen';
import { renderLogLine } from '../core/content/log-render';
import { actionKey, type ActionClock } from '../app/action-clock';
// type-only (erased at compile → no runtime import) so the renderer can accept the DEV harness
// without pulling ui/dev.ts into the prod bundle. The dev value is undefined in prod (main.ts).
import type { DevApi } from './dev';
import { createMarketView } from './render/market';
import { createQuestsView } from './render/quests';
import { createInventoryView } from './render/inventory';
import { createCombatView } from './render/combat';
import { createCharacterView } from './render/character';
import { createEstateView } from './render/estate';
import { createMapView } from './render/map';
import { buildSettings } from './render/settings';
import { createOverlays } from './render/modals';
import { createActionsView } from './render/actions';
import { createLogView } from './render/log';
import { createVnView } from './render/vn';
import { createVitalsView } from './render/vitals';

// rake COUNT at which the R0 rake gains its auto-repeat toggle — a few manual rakes' worth,
// so the first rakes land as juice before the grind can be automated (FB-121: read from the
// R0 requirement's progress, the same stream the % bar consumes).
export const RAKE_AUTO_REVEAL_COUNT = 5;
/** Rakes done this rung — the R0 rake requirement's live progress, found by its TOKEN
 *  (registry-derived; never a copied requirement id). 0 once promoted past R0. */
export function rakeCount(state: GameState): number {
  const req = rungRequirements(state.rung).find(
    (r) => r.type === 'count' && r.token === 'act:rake_rice',
  );
  return req ? (state.rungReqs[req.id] ?? 0) : 0;
}

/** The armed-but-standing-still read for a PAUSED auto, and the why. Pause (Settings ⚙) stops the
 *  auto loop and nothing else — a manual act still resolves — so a paused game is INVISIBLE except
 *  on the buttons it silences. Left unsaid, an armed auto that never fires reads as a broken button
 *  (it did: the human hit exactly this, and only an F5 cleared it — `paused` is shell state, never
 *  saved). It wears the '⏸' the illegal-but-armed auto already wears (ADR-148) — same idiom, one
 *  home (TST1), and the player never guesses state (TST4). */
export const AUTO_PAUSED_LABEL = '⏸ paused';
export const AUTO_PAUSED_REASON =
  'The game is paused — resume it in Settings ⚙.';

export const META_LABELS: Record<MetaVerb, string> = {
  open_eyes: COLD_OPEN.cta, // single-sourced with the title card's verb (AC-21)
  rake_rice: 'Rake the spilled rice',
  rest: 'Rest a moment',
  // ADR-187 — the day-skip. The label says what it COSTS in the only currency that matters here:
  // the day. Not "wait" (you are not waiting, you are spending), not "skip" (that is chrome, not
  // fiction — TST3): you lie down in your corner and the day goes on without you.
  sleep: 'Sleep till morning',
};

// the active combat decision (kendo kamae) — kanji avoid the foe-tier word collision
// ('Steady'/'Even') used by the win-rate pips.
export const STANCE_UI: Record<
  StanceId,
  { kanji: string; gloss: string; hint: string }
> = {
  gedan: {
    kanji: '下段',
    gloss: 'Guarded',
    hint: 'Block more, spare the blade — slower kills, sustainable grind',
  },
  chudan: { kanji: '中段', gloss: 'Balanced', hint: 'The even guard' },
  jodan: {
    kanji: '上段',
    gloss: 'Aggressive',
    hint: 'Hit harder, take more, wear the blade faster — best for a longshot',
  },
};

// the pre-awake cold-open title card (the dead .coldopen CSS now has a home).
// HD-37 unit A: the lede + CTA are FICTION — authored in narrative/cold-open.md
// (COLD_OPEN.lede / COLD_OPEN.cta), never hard-coded here, and live-swappable
// via the DEV story switcher (dev.subColdOpen) like every diverged unit.
const COLD_OPEN_TITLE = '神隠し';
const COLD_OPEN_ROMAN = 'Kamikakushi';

// ── the interactive intro VN scene (ADR-104 / FB-43–FB-48) — the SOLE prod intro presentation ──
// Voice → on-palette colour: the nameplate seal + name take it (mirrors the log voice colours).
// ADR-110 'lord' voice — RESOLVED. Munemasa's R7 capstone speaks in a DEDICATED `'lord'`
// VoiceCategory (added to the core union in `voices.ts`): murasaki 紫 — the historic
// highest-court-rank colour — distinct from the magistrate `'official'` kihada and Chiyo's
// `'steward'` ochre. These maps are exhaustive over the core `VoiceCategory` union, so `lord`
// must carry a key in BOTH (a missing key is a tsc error — the compile-time guarantee).
export const VOICE_COLOR: Record<VoiceCategory, string> = {
  // FB-128 — first-class per-speaker voice tokens (--v-*, styles.css :root — F128): the
  // M1 pigment collapse had merged the cast into near-identical silvers/golds.
  narrator: 'var(--v-narrator)',
  player: 'var(--v-player)',
  physician: 'var(--v-physician)',
  steward: 'var(--v-steward)',
  arms: 'var(--v-arms)',
  official: 'var(--v-official)',
  villager: 'var(--v-villager)',
  monk: 'var(--v-monk)', // the traveling monk Iori (storywave §04-cast) — muted ash/sumi
  lord: 'var(--v-lord)',
};
// Attribute → its themed pigment (the five traditional colours in styles.css `:root`). An intro
// decision + the perk it grants are tinted by the attribute the choice boosts (+1), so a pick reads
// as "belonging" to its stat. Value = the CSS custom-property reference (CSS owns the hex).
export const ATTR_COLOR: Record<AttrId, string> = {
  str: 'var(--attr-str)',
  agi: 'var(--attr-agi)',
  int: 'var(--attr-int)',
  spd: 'var(--attr-spd)',
  luck: 'var(--attr-luck)',
};
// The hanko seal glyph reads the speaker's CATEGORY (no per-NPC kanji exists in the data):
// 医 physician, 家 steward/house, 武 arms, 夢 the inner memory (narrator), 己 the self.
export const VOICE_SEAL: Record<VoiceCategory, string> = {
  narrator: '夢',
  player: '己',
  physician: '医',
  steward: '家',
  arms: '武',
  official: '官',
  villager: '里',
  monk: '僧', // 僧 (sō) — the traveling monk Iori (storywave §04-cast)
  lord: '殿', // 殿 (dono) — his lordship, the domain lord Munemasa (ADR-110 R7)
};
/** A kanji ink-seal nameplate (hanko idiom): a category-coloured seal + the speaker's name. Takes a
 *  minimal structural shape so BOTH the intro `DialogueScene` and the normalized `VnScene` (rung
 *  beats) feed it (ADR-110 §7.3). `title` is the scene's 幕-head act label — the SAME context string
 *  its lines group under in the Story log (TST1 · one idiom) — pinned to the far right of the plate
 *  so the player can always read WHICH VN they're in, not just who is speaking (TST4). */
export function introNameplate(scene: {
  readonly voice: VoiceCategory;
  readonly speaker?: NpcId;
  readonly title?: string;
}): HTMLElement {
  const color = VOICE_COLOR[scene.voice];
  const plate = el('div', 'vn-nameplate');
  const seal = el('div', 'vn-seal', VOICE_SEAL[scene.voice]);
  seal.lang = 'ja';
  seal.style.color = color;
  seal.style.borderColor = color;
  const name = el(
    'div',
    'vn-name',
    scene.speaker ? NPC_NAME[scene.speaker] : 'A memory',
  );
  name.style.color = color;
  name.style.borderColor = color;
  plate.append(seal, name);
  if (scene.title) {
    // the 幕 (act-curtain) act label — reuses the Story log's scene-head idiom (gold
    // small-caps), pushed right so it never crowds the speaker name.
    const act = el('div', 'vn-act');
    const mark = el('span', 'vn-act-mark', '幕');
    mark.lang = 'ja';
    mark.setAttribute('aria-hidden', 'true');
    act.append(mark, el('span', 'vn-act-label', scene.title));
    plate.append(act);
  }
  return plate;
}

// (the four-pillar names live in core/content now; the T0 UI shows ONLY the active Estate
// pillar live + the rest as unnamed silhouettes, ADR-055 — see renderHouseInfluence.)

// The kura-works PURCHASE ladder (U1–U4, ADR-098) — indexed by estateStage. Stage 0 is
// the un-worked starting state; the flavour words are the estate's condition after each
// work. (The narrative CONDITION ladder E0–E5 is a separate axis, lives in the docs.)
// the estate stage names — single source for the estate section's shipped default.
export const ESTATE_STAGE_NAMES = [
  "Foreclosure's edge",
  'U1 · Stabilising',
  'U2 · Recovering',
  'U3 · Prosperous',
  'U4 · Risen',
];

// A8: the house physically REOPENS its rooms as your standing rises (omoya R4, workshops +
// granary R6, the lord's study R7). Flavour — the estate's recovery made visible — not walkable
// map nodes (the 7-node ceiling is untouched). Each row inks in when its rung reveal fires.
export const HOUSE_ROOMS: readonly {
  surface: string;
  kanji: string;
  label: string;
}[] = [
  { surface: 'house-omoya', kanji: '母屋', label: 'The main house reopened' },
  { surface: 'house-workshops', kanji: '工房', label: 'The workshops woken' },
  { surface: 'house-granary', kanji: '板倉', label: 'A new granary raised' },
  {
    surface: 'house-study',
    kanji: '書院',
    label: "The lord's study opened to you",
  },
];

// Static pane blurbs — hoisted so the incremental (prod/test) path and the DEV-variant
// wholesale fallback render the SAME copy (single source of truth, no drift).
export const MARKET_BLURB =
  'A pedlar passes now and then. A little of your OWN coin for the things you need — greens for the pot, wood to keep an edge. Your purse, not the house’s.';
export const QUESTS_BLURB =
  'Goals beyond the daily grind — take one on, then earn it in the field.';

export const CHANNEL_BULLET: Record<LogChannel, string> = {
  narration: '',
  reward: '🌾',
  combat: '⚔️',
  system: '',
  // a quiet ink mark, not the red dot the human disliked (FB-56) — milestones read as progress, calmly.
  milestone: '❖',
};

export const SEASON_TAG: Record<
  Season,
  { kanji: string; emoji: string; name: string }
> = {
  winter: { kanji: '冬', emoji: '❄️', name: 'Winter' },
  'new-year': { kanji: '正月', emoji: '🎍', name: 'New Year' },
  spring: { kanji: '春', emoji: '🌸', name: 'Spring' },
  summer: { kanji: '夏', emoji: '🎐', name: 'Summer' },
  bon: { kanji: '盆', emoji: '🏮', name: 'Bon' },
  autumn: { kanji: '秋', emoji: '🍁', name: 'Autumn' },
};

export const RESOURCE_LABEL: Record<string, string> = {
  coin: 'coin',
  rice: 'rice',
  wood: 'wood',
  sansai: 'sansai',
};

type Dispatch = (intent: Intent) => void;
// The eight-tab IA (ADR-112 → ADR-177 Schedule A): every capability lives in exactly one
// thematic tab, each revealed only once it has content — ONE tab per rung. Work R0 →
// Map R1 (alone) → Works+Character R2 (the one accepted double; Works is cause-gated on
// the works-intro naming) → Combat R3 (alone) → Inventory R4 → Quests R5 → Estate 家 R6.
type Tab =
  | 'work'
  | 'map'
  | 'works'
  | 'estate'
  | 'inventory'
  | 'character'
  | 'combat'
  | 'quests';

export interface AppHooks {
  exportSave: () => string;
  importSave: (b64: string) => void;
  newGame: () => void;
  setReducedMotion: (on: boolean) => void;
  setTextScale: (scale: number) => void;
  togglePause: () => boolean;
  /** Is the shell's auto loop paused? A shell flag (never saved), and pause stops exactly ONE
   *  thing — the auto loop — so every auto toggle paints from it (TST4: the player never guesses
   *  why an armed auto is standing still). */
  isPaused: () => boolean;
  /** The synth SFX engine (T0-M1-F4 juice). Owned by the app; cue points fire via this. */
  sfx: Sfx;
  /** ADR-148 — the shell's ActionClock: the renderer reads per-key phases to paint
   *  button states/bars and subscribes for repaints; only the app ever presses it
   *  (via the timed-dispatch gate). */
  clock: ActionClock;
}

export function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

// Coalesced-log display (consumes LogEntry.count from the pure core): when a line has
// repeated N×, multiply the authored single-resource "(+n unit)" suffix into a running
// total "…×N (+total unit)". Multi-resource / non-matching lines fall back to a bare
// "…×N" so a wrong total is impossible (the unit group excludes commas).
export function formatLogText(entry: LogEntry): string {
  // FB-158 — spoken lines ALWAYS display quoted: a voiced non-narrator line whose
  // authored text carries no quotation marks is wrapped at display time, so bare
  // dialogue (dialogue.md teach lines) reads like every other utterance.
  const text =
    entry.voice !== undefined &&
    entry.voice !== 'narrator' &&
    !/["“]/.test(entry.text)
      ? `"${entry.text}"`
      : entry.text;
  const n = entry.count ?? 1;
  if (n <= 1) return text;
  const m = text.match(/^(.*?)\s*\(\+(\d+)\s+([^),]+)\)\s*$/);
  if (m) return `${m[1]} ×${n} (+${Number(m[2]) * n} ${m[3]})`;
  return `${text} ×${n}`;
}

// 2026-07-13 ruling (dialogue live-swap plan) — a DEV story-take flip re-renders EVERYTHING,
// logged lines included: at paint, a KEYED entry re-derives its prose from the CURRENT
// registries + core take-overlays (the renderLog epoch check repaints the view on a flip).
// The call site is __DEV_TOOLS__-gated, so prod paints the baked text untouched (strip folds
// this away — T2 still protects the player). An unresolvable key (a renamed content id)
// keeps its stored prose, same as codec's load-time fallback.
export function devRederivedEntry(entry: LogEntry): LogEntry {
  let out = entry;
  if (entry.contentKey !== undefined) {
    try {
      const text = renderLogLine(entry.contentKey, entry.params);
      if (text !== out.text) out = { ...out, text };
    } catch {
      /* an unresolvable key keeps its stored prose, same as codec */
    }
  }
  // step D — the 幕-head re-derives from its key too, so a take flip re-voices logged heads.
  if (entry.contextKey !== undefined) {
    try {
      const context = renderLogLine(entry.contextKey);
      if (context !== out.context) out = { ...out, context };
    } catch {
      /* keep the stored head */
    }
  }
  return out;
}

// FB-53/FB-115 — the "Now" (ephemeral) view's wall-clock timings (a RENDER-time concern; the pure core
// never times this). Module-scope + exported so a test derives its fixtures from the SAME source the
// renderer uses (ADR-086 — no copied magic numbers). FB-115: the expiry runs regardless of the active
// view, so a fleeting line clears on schedule even while Now is hidden.
export const NOW_TTL_MS = 60000; // a fleeting line lives ~60s from first appearance (FB-268)
export const NOW_FADE_MS = 900; // …and spends its last ~0.9s fading out
// FB-268 — the two-way fade: the NEWEST 10 fleeting lines never age out (the Now view always
// holds the recent beat); only lines displaced beyond the floor run the 60s TTL. The other
// half of the law is the core's LOG_EPHEMERAL_MAX ring (101st line evicts the oldest).
export const NOW_KEEP_LAST = 10;
export const NOW_COLLAPSE_MS = 400; // an expired line collapses its height over ~0.4s so the rest glide up

// FB-199 — the "新 · new" fresh-entries divider (log + VN, one source): it marks everything
// below it as new-since-you-last-looked, is ANCHORED (a live divider never relocates or
// stacks — new lines land under it and re-arm its fade), and lives ~30s past the LAST new
// line (human call — the old 4.5s felt erratic). Exported so tests derive from this source.
export const FRESH_DIVIDER_TTL_MS = 30000;
export const FRESH_DIVIDER_FADE_MS = 800;

// The GBA typewriter cadence (~30–34ms/char) — module-scope + exported so timing that
// must OUTLAST typed text (FB-224's rake teach cooldown) derives its bound from the
// SAME source the writer uses (ADR-086 — no copied magic numbers).
export const TYPE_CADENCE_MS = 32;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function vital(
  id: string,
  label: string,
): { wrap: HTMLElement; value: HTMLElement } {
  const wrap = el('div', `vital ${id}`);
  wrap.hidden = true;
  wrap.append(el('span', 'label', label));
  const value = el('span', 'value numeric', '0');
  wrap.append(value);
  return { wrap, value };
}

export function brushRule(): HTMLElement {
  return el('hr', 'brush-rule');
}

// The settings modal lives in render/settings.ts (render-split).

// ── shared pacing + motion probes (render-split: the log, VN, and cold-open all read
//    these; module-level so the split views import them from one home) ──
// DEV-only QA affordance (`?instanttext=1`) — zero the narrative pacing so the e2e journey
// lane isn't clocked by the typewriter. Player-invisible: the ternaries fold to the literals
// in a prod build (`import.meta.env.DEV` is false), same strip path as `?fixture=`.
export const QA_INSTANT_TEXT =
  import.meta.env.DEV &&
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('instanttext');
export const TYPE_MS_PER_CHAR = QA_INSTANT_TEXT ? 0 : TYPE_CADENCE_MS;
// pause after a typed line before the next cascades in
export const TYPE_NEXT_BEAT_MS = QA_INSTANT_TEXT ? 0 : 180;
// FB-86 — the intro typewriter AUTO-ADVANCES: after a line finishes typing it holds for this
// beat, then the next line starts on its own (no click needed). A click only ever SPEEDS this
// up. FB-271 — the human read 2.0s as "scrolls too fast".
export const INTRO_LINE_ADVANCE_MS = QA_INSTANT_TEXT ? 0 : 2800;
// FB-118 — when the human CLICKS to complete a line, the next starts on a much shorter beat.
export const INTRO_CLICK_ADVANCE_MS = QA_INSTANT_TEXT ? 0 : 450;
export function reduceMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
export function introReduced(): boolean {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('reduced-motion')
  );
}
export const introInstant = (): boolean =>
  introReduced() || import.meta.env.MODE === 'test';

export function buildFreshDividerNode(): HTMLElement {
  const d = el('div', 'log-fresh-divider');
  d.append(el('span', undefined, '新 · new'));
  return d;
}

export function stampAct(
  btn: HTMLElement,
  type: Intent['type'],
  payload?: { activityId?: string; to?: string; recipeId?: string },
): void {
  if (timingFor(type, payload as never).kind !== 'timed') return;
  btn.dataset.actKey = actionKey(type, payload);
}

export function mount(
  root: HTMLElement,
  dispatch: Dispatch,
  hooks: AppHooks,
  dev?: DevApi,
): (state: GameState, prev: GameState | null) => void {
  root.textContent = '';
  root.removeAttribute('aria-busy');

  let activeTab: Tab = 'work';
  // ADR-114 — the Map "who's here" open-conversation state (UI-only, like activeTab): the id of the
  // person you're currently TALKING to (their trade/greeting is open), or null. A `tiny` trader's
  // shop (the pedlar's wares) shows ONLY while he is the open person — talk-to-reveal, never inline.
  let openPersonId: string | null = null;
  let lastState: GameState | null = null;
  // FB-153 — the beat modal held the promotion ceremony itself: skip the floating
  // rank-up overlay ONCE for the rung change that lands when the modal closes.
  let suppressRankUpOverlay = false;
  // SLOP threshold gates (human, 2026-07-10) — armed ONLY by the player-initiated
  // promotion controls (the rung-head trigger / the beat ceremony's Continue), so a
  // DEV `__qa.toRung` teleport, a fixture jump, or a save import never trips the
  // warning (and never strands a blocking scrim over the QA screenshot gallery).
  let slopGateArmed = false;
  // A gate that matched but had a VN still to play (R2's yard-hand scene) HOLDS here
  // until the scene closes — the player goes through the rung-up story first, then
  // meets the warning on the shell (human, 2026-07-10 follow-up).
  let pendingSlopWarning: 'R1' | 'R2' | null = null;
  // The seal-book AFTERGLOW (ADR-201 ruling 1): latched on the exact promotion
  // diff, held until the rung-up VN (and any queued scene) closes — the story
  // plays first, then the book presents the fresh press. A DEV rung teleport
  // still shows it (harmless, and it exercises the surface); the SLOP scrim,
  // when both fire, holds the afterglow until it is answered.
  let pendingAfterglow = false;
  let introEndingRender = false;

  const shell = el('div', 'shell paper');

  // ── the game's name — lives in the fixed FOOTER, not a title row (FB-372:
  //    the full-width titlebar bought 33px of chrome for a name; the footer
  //    already carries the version + Settings, so the name joins them and the
  //    grid loses a row) ──
  const title = el('span', 'game-title');
  title.lang = 'ja';
  title.append(el('span', 'kami', '神隠し'));
  title.append(el('span', 'roman', 'Kamikakushi'));
  const settingsBtn = el('button', 'settings-btn');
  // "Settings 設定" — the woodblock English+kanji pairing (like "Estate 地図"), not a generic-web ⚙
  // gear outside the curated emoji set (ui-design §7/§9).
  const settingsKanji = el('span', 'settings-kanji', '設定');
  settingsKanji.lang = 'ja';
  settingsBtn.append(document.createTextNode('Settings '), settingsKanji);
  settingsBtn.type = 'button';
  settingsBtn.setAttribute('aria-haspopup', 'dialog');
  const settings = buildSettings(hooks);
  settingsBtn.addEventListener('click', () => settings.open());

  // ── header / vitals ──
  const header = el('header', 'vitals');
  header.setAttribute('role', 'banner');
  const houseMark = el('span', 'house-mark');
  houseMark.lang = 'ja';
  houseMark.textContent = '黒沢家';
  header.append(houseMark);

  // ADR-107 + FB-166/FB-171 (human, 2026-07-06): NO carried-wealth pills in the header —
  // RICE and COIN both live on the Inventory 蔵 tab (the kura carried/stored rows). The
  // `readout-rice`/`readout-coin` unlocks survive in core (they still gate verbs/surfaces).
  // koku is NOT a pill — it is House standing (surfaced elsewhere, Phase 4).
  const coin = vital('coin', 'coin');
  const clock = el('div', 'vital clock');
  clock.hidden = true;
  const clockTag = el('span', 'season-tag');
  const clockDay = el('span', 'rate');
  clock.append(clockTag, clockDay);
  // storywave G1/G4.9 — the season wheel is MANUAL from R2 on (ADR-153): the player ENDS the season
  // to turn the six-season wheel (the seasonal judge, spoilage, pool refill). Lives WITH the calendar
  // (TST1 — season reads where the season shows). Gated + labelled in renderVitals.
  const seasonEndBtn = el('button', 'season-end');
  seasonEndBtn.type = 'button';
  seasonEndBtn.hidden = true;
  seasonEndBtn.addEventListener('click', () =>
    dispatch({ type: 'advance_season' }),
  );
  clock.append(seasonEndBtn);
  const stamina = el('div', 'vital stamina');
  stamina.hidden = true;
  stamina.append(el('span', 'label', 'body'));
  const staminaBar = el('div', 'bar');
  const staminaFill = el('span');
  staminaBar.append(staminaFill);
  stamina.append(staminaBar);
  // FB-335 — the bar alone was unreadable ("does this render satiety or body or stamina?"):
  // give body the SAME exact-number readout life has, and say on hover what fills/drains it.
  const staminaNum = el('span', 'value numeric');
  stamina.append(staminaNum);
  stamina.title =
    'Body 体 — work draws it down; a rest refills it. Rest better on a full belly.';
  // The belly (ADR-178 — the FB-345 body split): the SAME vital idiom as body (one primitive per
  // idiom — label + bar + exact number + hover name), on the slow daily clock. The day draws it
  // down; the kura ration maintains it; a meal raises it; its only teeth are rest quality.
  const belly = el('div', 'vital belly');
  belly.hidden = true;
  belly.append(el('span', 'label', 'belly'));
  const bellyBar = el('div', 'bar');
  const bellyFill = el('span');
  bellyBar.append(bellyFill);
  belly.append(bellyBar);
  const bellyNum = el('span', 'value numeric');
  belly.append(bellyNum);
  belly.title =
    'Belly 腹 — the day draws it down; the house eats from the kura, a meal fills it. A hungry rest restores less.';
  // HP — a life-or-death meter once combat opens (ADR-076: HP accumulates, no auto-heal, a lost fight
  // bites carried coin + rice). It sits beside `body` so the player can always SEE they're hurt + heal (eat).
  const health = el('div', 'vital health');
  health.hidden = true;
  health.append(el('span', 'label', 'life'));
  const healthBar = el('div', 'bar');
  const healthFill = el('span');
  healthBar.append(healthFill);
  health.append(healthBar);
  const healthNum = el('span', 'value numeric');
  health.append(healthNum);
  const wood = vital('wood', 'wood');
  const sansai = vital('sansai', 'sansai');
  // FB-387 — body + belly stack in one compact column (bars only; the exact numbers
  // moved to the hover titles), so the pair costs the header no more width than one.
  const vitalStack = el('div', 'vital-stack');
  vitalStack.append(stamina, belly);
  header.append(health, vitalStack, wood.wrap, sansai.wrap);

  // ── FB-106 (ADR-110) — the RUNG element in the fixed header, top-right: a compact rung name + a
  //    progress bar (the requirement percent toward the next rung, FB-121) with a HOVER card of detail. This is the
  //    rung's HOME + the PLAYER-TRIGGERED beat start: when a promotion is READY (and no beat is live
  //    / not in the intro) the element becomes the "Answer the summons" affordance → dispatch
  //    `begin_rung_beat`, which navigates to the full-screen VN beat. It NEVER auto-fires — a ready
  //    promotion BANKS here and the player may ignore it and keep grinding (ADR-110). The Work-column
  //    ladder stays as the secondary cue (§3.3). Build-once + patch in place (renderRungHead) so an
  //    idle re-render produces zero DOM churn (FB-81). ──
  const rungHead = el('div', 'rung-head');
  rungHead.hidden = true;
  const rungHeadTrigger = el(
    'button',
    'rung-head-trigger',
  ) as HTMLButtonElement;
  rungHeadTrigger.type = 'button';
  rungHeadTrigger.addEventListener('click', () => {
    slopGateArmed = true; // a real player crosses the threshold — the SLOP gate may fire
    dispatch({ type: 'begin_rung_beat' });
  });
  const rungHeadName = el('span', 'rung-head-name');
  const rungHeadMeter = el('div', 'rung-head-meter');
  const rungHeadFill = el('span');
  rungHeadMeter.append(rungHeadFill);
  const rungHeadCue = el('span', 'rung-head-cue', 'Answer the summons ›');
  rungHeadCue.hidden = true;
  rungHeadTrigger.append(rungHeadName, rungHeadMeter, rungHeadCue);
  const rungHeadCard = el('div', 'rung-head-card'); // the hover detail (CSS-revealed on :hover)
  const rungHeadCardNow = el('div', 'rung-head-card-now');
  const rungHeadCardMeter = el('div', 'rung-head-card-meter');
  const rungHeadCardNext = el('div', 'rung-head-card-next');
  rungHeadCard.append(rungHeadCardNow, rungHeadCardMeter, rungHeadCardNext);
  rungHead.append(rungHeadTrigger, rungHeadCard);
  header.append(rungHead);

  // ── nav (first appears at R2) ──
  const nav = el('nav', 'nav');
  nav.setAttribute('role', 'navigation');
  nav.hidden = true;

  // ── workspace ──
  const workspace = el('main', 'workspace');
  workspace.setAttribute('role', 'main');

  // The log DOM (logSection + filter bar + font stepper) is built by createLogView
  // (render/log.ts); the shell places its returned logSection below.
  const logView = createLogView({
    dev,
    sfx: hooks.sfx,
    lastState: () => lastState,
    firstRender: () => firstRender,
    setFirstRender: (v) => {
      firstRender = v;
    },
    introEndingRender: () => introEndingRender,
    vnActive: (s) => vnActive(s),
  });
  const {
    logSection,
    renderLog,
    setLogFilter,
    seedLogSeenOnce,
    refreshLogTabs,
    paintLogFilterBar,
  } = logView;

  const work = el('section', 'work');
  // FB-410 (HR-32, human-locked 2026-07-11) — the ZONE BANNER: the Zone tab opens with the
  // place as hero (the node's kanji + name + kicker), then the zone's STANDING LINE, then the
  // verbs. The line is the seasonal node read (`nodeSeasonalBlurb` — the SAME source the Map's
  // you-are-here card resolves, TST1: one source, two reads), so it breathes by season for free.
  // (The banner carries the tab's heading — there is no separate "What you can do" h2.)
  const zoneBanner = el('div', 'zone-banner');
  const zbHead = el('div', 'zb-head');
  const zoneSeal = el('span', 'zb-kanji');
  zoneSeal.lang = 'ja';
  const zoneNameCol = el('div');
  const zoneName = el('h2', 'zb-name');
  zoneNameCol.append(zoneName, el('p', 'zb-kicker', 'what you can do here'));
  zbHead.append(zoneSeal, zoneNameCol);
  const zoneLine = el('p', 'zb-blurb');
  zoneBanner.append(zbHead, zoneLine);
  zoneBanner.hidden = true;
  const estatePane = el('div', 'estate-pane');
  // ADR-177 Schedule A — the Works 普請 pane (the projects/upgrades home; split out of Estate 家).
  const worksPane = el('div', 'estate-pane works-pane');
  const marketPane = el('div', 'market-pane');
  const storehousePane = el('div', 'storehouse-pane');
  const belongingsPane = el('div', 'belongings-pane'); // ADR-111 / FB-89 — the home + belongings (Inventory tab)
  const influence = el('div', 'influence');
  const actions = el('div', 'actions');
  // FB-332 — the who's-here 衆 section lives on the Zone tab (was the Map tab, ADR-114): every
  // zone action, including talking to the people standing in the zone, reads as ONE surface.
  // Built once here; the person rows reconcile in renderWhosHere. Hidden (FB-72 ghost-box)
  // when no one is present or off-tab.
  const whosPane = el('div', 'whos-here');
  whosPane.hidden = true;
  whosPane.append(el('div', 'rung-now', 'Who’s here 衆'));
  const whosList = el('div', 'whos-list');
  whosPane.append(whosList);
  const skillsPane = el('div', 'skills-pane');
  const combatPane = el('div', 'combat-pane');
  const questsPane = el('div', 'quests-pane');
  const mapPane = el('div', 'map-pane');
  // IA reorg (ADR-112) — the Character tab's SPLIT-OUT halves of renderCombat: the attribute-training
  // rows + the bestiary field-guide (they live with the character sheet, not the fight surface).
  // Own containers so each is a build-once/patch surface on the Character tab (FB-81), and so the
  // per-tab anti-empty guard can see them (§7). Points are still EARNED in Combat (the coupling holds).
  // FB-343/FB-369 (human-ruled 2026-07-11) — the BODY section: the food verbs' one
  // home (eat rice · cook), beside the Body 体/Belly 腹 readouts they feed. Zones
  // stopped carrying them (ADR-178 §4; the hearth's owned-cook affordance, ADR-120,
  // is the deliberate fiction-sited exception and stays).
  const characterBody = el('div', 'character-body');
  const characterTrain = el('div', 'character-train');
  const characterBestiary = el('div', 'character-bestiary');
  // ADR-201 — the seal-book record strip: the Character tab's opening section
  // (the run's record before the live vitals). Own container so it is a
  // build-once/keyed-repaint surface (P4/FB-81).
  const characterRecord = el('div', 'character-record');
  // Order matters for FEEL (spatial model, v0.3.1): the node-specific LABOUR (`actions`) is the HERO
  // — what you walked to this node to DO — so it leads "What you can do", with the rung ladder as
  // progress-context right below it and the global "spend-coin" panes (estate/market/storehouse)
  // beneath. Before, actions rendered dead-last and the farm button fell ~865px below the fold,
  // hiding the whole point of walking to a labour node.
  // ── panel slices (multi-panel layout, M1) — the work-tab panes are grouped into named,
  //    reveal-gated slice <section>s. `work` stays the LEFT-column wrapper for the classic
  //    layout; the byōbu layout dissolves it (CSS `display:contents`) so its slices become
  //    full-width folding columns. Pane CONTENTS + their self-gating are UNTOUCHED — only the
  //    grouping changes. Each slice carries a stable class + a `data-panel` id.
  //    P1 · Do (the hero, always present R0) — the node labour + on non-Work tabs the active
  //    tab's content (skills / combat / quests / map panes, which already hide by activeTab).
  const sliceDo = el('section', 'slice slice-do');
  sliceDo.dataset.panel = 'do';
  sliceDo.setAttribute('aria-label', 'Zone');
  // IA reorg (ADR-112) — Phase A keeps the current byōbu DOM grouping; the SIX tabs are realised by
  // re-gating each pane's `activeTab` check (§6.3). Only the active tab's panes are ever visible, so
  // the slice grouping is unchanged for layout. The Do slice hosts every single-column tab surface:
  // Work labour, the node-Map, Estate improve-card, Character (skills + training + bestiary + quests),
  // and Combat. The market/storehouse/influence coin panes stay in the Estate slice (their tab
  // re-homes are Map/Inventory/Estate — self-gated, FB-100-style). Phase B (deferred) gives each tab
  // its own container section.
  sliceDo.append(
    zoneBanner,
    actions,
    whosPane,
    characterRecord,
    characterBody,
    skillsPane,
    characterTrain,
    characterBestiary,
    combatPane,
    questsPane,
    mapPane,
    estatePane,
    worksPane,
  );
  // P2 · Path & Progress — REMOVED (FB-116). The rung/progress display is now the SOLE responsibility
  // of the header rung element (renderRungHead, FB-106, top-right); the old Work-column ladder was a
  // duplicate of it, so the "Path & progress" slice is gone (no empty ghost — the slice itself is
  // deleted, not just hidden).
  // P3 · Estate & Economy — the coin sinks (market/storehouse) + the R7 House-Influence capstone
  // (~R2). The estate-IMPROVE card (`estatePane`) moved to the Estate/map tab (FB-100, see sliceDo).
  const sliceEstate = el('section', 'slice slice-estate');
  sliceEstate.dataset.panel = 'estate';
  sliceEstate.setAttribute('aria-label', 'Estate & economy');
  sliceEstate.append(marketPane, storehousePane, belongingsPane, influence);
  work.append(sliceDo, sliceEstate);

  // P4 · the story-log — its OWN persistent slice (always present R0). It keeps its `.log`
  // styling untouched (classic looks identical); the slice classes only let byōbu widen it into
  // a reading column. It's never reveal-gated (the log is the diegetic hero surface).
  logSection.classList.add('slice', 'slice-log');
  logSection.dataset.panel = 'log';

  // the reveal-gated slices (P4 log persists, so it's excluded) — each hides when all its panes
  // are hidden, so early game is Do + Log only and the screen inks in as surfaces unlock.
  const gatedSlices = [sliceDo, sliceEstate];

  // M3 (Andon) — the workspace holds ONLY the work desk now; the story log is a
  // first-class SHELL sibling (the right log window in the Andon grid). The
  // reconcilers key on element identity (reconcile.ts WeakMap), so re-parenting
  // logSection breaks nothing — same node, same scroll hooks.
  workspace.append(work);

  // ── fixed footer bar (FB-5) — the version stamp + the Settings entry, pinned to the bottom ──
  const footer = el('footer', 'appbar-footer');
  // FB-104 — the version is CLICKABLE → the About modal (single-sourced from __VERSION__, never
  // hand-typed — AC-21). A real button for keyboard/a11y, styled to read as the plain version stamp.
  const versionBtn = el(
    'button',
    'foot-meta foot-version',
    __VERSION__,
  ) as HTMLButtonElement;
  versionBtn.type = 'button';
  versionBtn.setAttribute('aria-haspopup', 'dialog');
  versionBtn.setAttribute('aria-label', `About Kami-kakushi ${__VERSION__}`);
  versionBtn.addEventListener('click', () => settings.open('about'));
  // FB-372 — name leftmost, the version stamp right beside it, Settings at the right edge.
  const footLeft = el('span', 'foot-left');
  footLeft.append(title, versionBtn);
  footer.append(footLeft, settingsBtn);
  // FB-92 — the DEV toggle floats as a fixed overlay at the bottom-right corner (dev.ts). Reserve its
  // corner in the footer (DEV builds only) so the Settings button sits clear of it — no collision.
  if (__DEV_TOOLS__ && dev) footer.classList.add('has-dev-toggle');

  // M3 (Andon) — grid areas: title / vitals / nav-rail | work desk | log window / footer.
  // FB-172 — the calendar (season/year/day) leaves the header: it docks at the FOOT of
  // the rail (the human's pick), sharing the nav grid AREA without entering the nav
  // element (whose children are reconciler-owned — the single-owner contract holds).
  const clockDock = el('div', 'clock-dock');
  clockDock.append(clock);
  shell.append(header, nav, workspace, logSection, footer, clockDock);

  // ── pre-awake cold-open title card (sibling to the shell; shown until 'awake') ──
  // The lede/CTA resolve through the DEV story switcher (HD-37 unit A) — canon in prod.
  const cardLede = (): string =>
    __DEV_TOOLS__ && dev
      ? dev.subColdOpen('lede', COLD_OPEN.lede)
      : COLD_OPEN.lede;
  const cardCta = (): string =>
    __DEV_TOOLS__ && dev
      ? dev.subColdOpen('cta', COLD_OPEN.cta)
      : COLD_OPEN.cta;
  const coldOpen = el('div', 'coldopen');
  const coFrame = el('div', 'frame');
  const coTitle = el('h1');
  coTitle.lang = 'ja';
  coTitle.textContent = COLD_OPEN_TITLE;
  const coRoman = el('p', 'coldopen-roman', COLD_OPEN_ROMAN);
  const coLede = el('p', 'coldopen-lede', cardLede());
  const coVerb = el('button', 'verb primary', cardCta());
  coVerb.type = 'button';
  coVerb.addEventListener('click', () => dispatch({ type: 'open_eyes' }));
  // HD-24 (option B) — a quiet "restore a save" line so a returning player on a fresh device/profile
  // can import BEFORE replaying the whole intro (the Settings→Saves import otherwise sits behind the
  // awake shell). Reuses the existing Saves modal — no new surface. FB-126: anchored as a tiny,
  // subtle footer at the BOTTOM of the field (a sibling of the card, not a button under the CTA).
  const coRestore = el(
    'button',
    'coldopen-restore',
    'Returning? Restore a saved game',
  );
  coRestore.type = 'button';
  coRestore.addEventListener('click', () => settings.open('saves'));
  coFrame.append(coTitle, coRoman, coLede, coVerb);
  coldOpen.append(coFrame, coRestore);

  // The Settings/Saves modal is a root-level sibling (not inside `shell`) so it can overlay BOTH the
  // awake shell AND the pre-awake cold-open — the shell is `hidden` before waking (HD-24).
  root.append(coldOpen, shell, settings.modal);

  let firstRender = true;
  // storywave G4.9 — guards the queued-scene pump so a deferred begin_scene never stacks.
  let scenePumpScheduled = false;
  let coldOpenRevealStarted = false;
  let cancelColdOpenReveal: (() => void) | undefined;

  function setTab(tab: Tab): void {
    activeTab = tab;
    // Stamp the active tab on the root so the DEV playtest-capture overlay (FB-3) can read it
    // (a DOM attribute, no render-API change); also handy to qa-shots.mjs.
    root.dataset.activeTab = tab;
    if (lastState) render(lastState, null);
  }

  // M1 reveal-gating — a slice is present only while at least one of its panes is visible AND
  // carries real content. FB-72 — a pane that returns early WITHOUT hiding its own container (it just
  // empties its text) must NOT keep the slice alive as an empty framed ghost box: only count a
  // non-hidden pane that actually rendered something (a child element or non-blank text).
  function hasVisibleChild(slice: HTMLElement): boolean {
    for (const child of slice.children) {
      const c = child as HTMLElement;
      if (c.hidden) continue;
      if (c.childElementCount > 0 || (c.textContent ?? '').trim() !== '')
        return true;
    }
    return false;
  }

  // English+kanji pairing (ui-design §7/§9). Final glyphs are a taste call (surfaced, not locked —
  // IA reorg plan §8.4).
  const TAB_LABEL: Record<Tab, string> = {
    // FB-332 — "Work" reads as the ZONE tab: the place you stand, its actions, its people.
    // 場 (ba, "place") pairs it in the woodblock English+kanji idiom like Map 地図 / Estate 家.
    work: 'Zone 場',
    map: 'Map 地図',
    works: 'Works 普請',
    estate: 'Estate 家',
    inventory: 'Inventory 蔵',
    character: 'Character 己',
    combat: 'Combat 武',
    quests: 'Quests 用', // ADR-119 — Quests regains its own tab (glyph 用, provisional taste call)
  };
  // ── the six-tab reveal predicates (ADR-112 §3) — a tab's chip appears the render its PRIMARY content
  //    first unlocks, and NEVER before (the incremental-reveal signature). Each reuses an EXISTING
  //    surface predicate — NO new flags — and is the anti-empty-tab guard (§7) lifted to the tab
  //    level: it answers "would this tab have visible content if active?" WITHOUT switching activeTab.
  //    Work R0 always · Map/Estate R1 · Character R2 · Combat/Inventory R3 · Quests R5 (ADR-119).
  // ADR-177 Schedule A — display order follows the REVEAL order (a new chip always
  // lights at the end of the row, so arrival reads as growth; Estate 家 is the R6 capstone).
  const TAB_ORDER: readonly Tab[] = [
    'work',
    'map',
    'works',
    'character',
    'combat',
    'inventory',
    'quests',
    'estate',
  ];
  // does the Character tab have any visible content? — the true anti-empty guard (§7): a skill card
  // to show (skills visible via by-doing OR a skill row unlocked), OR the R3 sections (training /
  // bestiary), OR quests. Skills-only-but-no-skill (an isolated fixture) leaves it EMPTY → no chip.
  function characterHasContent(state: GameState): boolean {
    const skillsHaveCard =
      isUnlocked(state, 'tab-skills') &&
      SKILLS.some(
        (def) =>
          skillVisible(state, def.id) || isUnlocked(state, `skill-${def.id}`),
      );
    return (
      skillsHaveCard ||
      isUnlocked(state, 'verb-cook') || // the Body card (FB-343/FB-369 — food verbs re-homed here)
      isUnlocked(state, 'verb-eat-rice') ||
      isUnlocked(state, 'readout-combat-level') || // training (attrs)
      isUnlocked(state, 'panel-bestiary') // the bestiary
      // ADR-119 — quests are NO LONGER a Character section; they have their own tab (revealed at R5),
      // so the old `tab-combat` (quests-in-Character) branch is gone.
    );
  }
  // "would this tab have visible content if active?" — the anti-empty-tab guard (§7) lifted to the
  // tab level, WITHOUT switching activeTab. Each branch mirrors its pane's real render condition:
  // the map/estate/inventory/combat panes always render content once their surface unlocks (a
  // guaranteed you-are-here card / improve card / kura card / fight surface); only Character can be
  // predicate-open-but-empty, so it gets a real content check.
  function tabHasContent(state: GameState, tab: Tab): boolean {
    switch (tab) {
      case 'work':
        // labour is always reachable (rake/rest at R0); the Work tab never empties.
        return true;
      case 'map':
        // The walkable node-map — nav's SOLE home (FB-107). ADR-184: it opens when there is somewhere
        // to GO, i.e. once a second zone exists. It used to key on `room-gate`, which was an R1 rung
        // reward; the gate now earns its own VN (R2), and keying the only travel affordance to it
        // stranded the R1 day-hand in the forecourt — with a farm requirement in a paddy he could not
        // walk to. The live playtest caught what no engine test could: the reducer happily accepts
        // `move_to` whether or not a tab exists to press. Derived from the visible set, so any future
        // re-mapping carries it (TST1) and this can never drift again.
        return (
          unlockedSurfaces(state).filter((id) => id.startsWith('room-'))
            .length >= 2
        );
      case 'works':
        // ADR-177 Schedule A — the projects home (普請): cause-gated on the works-intro
        // beat's day-book naming (panel-estate's predicate), R2+ at the board.
        return isUnlocked(state, 'panel-estate');
      case 'estate':
        // ADR-177 Schedule A — Estate 家 arrives at R6 (tab-estate, its rank reward):
        // the pillars/influence pane + the reopening house rooms. The upgrades left for Works.
        return isUnlocked(state, 'tab-estate');
      case 'inventory':
        // ADR-177 Schedule A — the Inventory tab staggers R3 → R4 (tab-inventory, its own
        // rung): banking + belongings, one tab per rung after Combat's R3.
        return isUnlocked(state, 'tab-inventory');
      case 'character':
        // Skills first (R2), attrs + bestiary + quests at R3 — but only once something actually shows.
        return characterHasContent(state);
      case 'combat':
        // the fight surface — watch + XP + weapon (tab-combat, R3).
        return isUnlocked(state, 'tab-combat');
      case 'quests':
        // ADR-119 — the Quests tab reveals at R5 (its OWN quest-log beat, tab-quests), NOT batched into
        // the R3 combat wave. Gated on its R5 content-unlock, so the chip lights one beat at a time.
        return isUnlocked(state, 'tab-quests');
    }
  }
  function visibleTabs(state: GameState): Tab[] {
    return TAB_ORDER.filter((t) => tabHasContent(state, t));
  }
  function renderNav(state: GameState): void {
    const tabs = visibleTabs(state);
    // the activeTab-not-in-list fallback → 'work' (a tab that lost its content, or a stale save).
    // FB-358 — this must run BEFORE the <2-tabs early return: a state swap that collapses the
    // whole tab set (the DEV "NG (post open)" fixture load) used to skip it, leaving activeTab
    // 'map' and the map pane rendering over an R0 state.
    if (!tabs.includes(activeTab)) {
      activeTab = 'work';
      root.dataset.activeTab = activeTab; // keep the FB-3 capture-overlay stamp in sync
    }
    // the nav bar shows only once ≥2 tabs qualify (unchanged: appears at R1 when Map joins).
    toggle(nav, tabs.length >= 2);
    if (tabs.length < 2) return;
    // the tab SET changes rarely (a chip lights up at a rung boundary), so a wholesale rebuild of a
    // handful of buttons only WHEN the set or the active tab changes is cheap + idle-churn-free. The
    // reconcileList keeps each chip's node stable across idle ticks (node-identity, FB-81 / §7).
    reconcileList(nav, tabs, {
      key: (tab) => tab,
      build: (tab) => {
        const btn = el('button', 'nav-tab', TAB_LABEL[tab]);
        btn.type = 'button';
        btn.addEventListener('click', () => setTab(tab));
        return btn;
      },
      patch: (btn, tab) => setClass(btn, 'active', activeTab === tab),
      order: true,
    });
  }

  // FB-106 (ADR-110) — patch the header rung element in place (build-once nodes above). Shows the compact
  // rung name + a meter toward the next rung; when a promotion is READY it becomes the player-triggered
  // "Answer the summons" affordance (dispatches `begin_rung_beat`) — never auto, and ignorable. The
  // hover card carries the meter numbers + the current/next rung. All writes go through the reconcile
  // helpers (patch-if-changed), so an idle re-render mutates nothing (zero churn, FB-81).
  // HD-41 (d) — the last-painted count of FINISHED requirements: the meter pulses once when
  // that count grows, so the pulse marks the same event the earned line does (human,
  // 2026-07-13 — pulsing on percent GROWTH flashed on nearly every rake, since the rounded
  // percent creeps with each act; the flash has to mean "you finished something"). Never on
  // the first paint / a load, and it resets on promotion (a fresh rung starts at 0 done).
  let lastRungDone = -1;
  function renderRungHead(state: GameState): void {
    // the rung's home once the ladder is meaningful (first rake / the R1 reveal) — gated like the
    // Work-column ladder but WITHOUT the tab check (the header is always on screen).
    const show =
      isUnlocked(state, 'panel-rung-ladder') || hasFlag(state, 'raked');
    toggle(rungHead, show);
    if (!show) return;
    const rank = currentRank(state);
    const prog = rungProgress(state);
    // READY (the affordance) = the rung's requirement list is 100% done (ADR-137/ADR-182), a NEXT rung
    // actually exists, no beat is already live, and we're out of the intro. `begin_rung_beat` guards the
    // same in core; the UI only OFFERS it here (ADR-110). The `target !== null` guard is load-bearing at
    // the terminal rung (R7): its requirements stay satisfied so promotionReady stays true, but there is
    // no next rank to advance to — without this the header would light a 'summons' that no-ops on click
    // (a dead capstone button).
    const target = pendingPromotionTarget(state);
    const ready =
      promotionReady(state) &&
      target !== null &&
      state.rungBeat === null &&
      !introActive(state.introBeat);
    setText(rungHeadName, `${rank.title} ${rank.kanji}`);
    // FB-121: the fill IS the rounded requirement percent (rungProgress/AC-6 — the same
    // engine read as the gate, so 100 ⟺ ready and the old "gated at 92%" state is gone).
    setStyle(rungHeadFill, 'width', `${prog.percent}%`);
    // HD-41 (d) — a finished requirement is VISIBLE in the meter: it pulses once, in step
    // with the earned line landing in the log (remove → reflow → re-add restarts a rapid
    // succession cleanly). The fill still slides on every act; only the flash is rationed.
    if (prog.done > lastRungDone && lastRungDone >= 0 && !reduceMotion()) {
      rungHeadMeter.classList.remove('bump');
      void rungHeadMeter.offsetWidth;
      rungHeadMeter.classList.add('bump');
    }
    lastRungDone = prog.done;
    setClass(rungHead, 'ready', ready);
    setDisabled(rungHeadTrigger, !ready); // clickable ONLY when a promotion is ready — never auto
    toggle(rungHeadCue, ready);
    const triggerTitle = ready
      ? target
        ? `Answer the summons — begin the ${getRank(target).title} beat`
        : 'Answer the summons'
      : `${rank.title} — Estate service ${prog.percent}%`;
    if (rungHeadTrigger.title !== triggerTitle)
      rungHeadTrigger.title = triggerTitle;
    // the hover-card detail (FB-106): the current rung, the meter numbers, the next rung.
    setText(rungHeadCardNow, `${rank.title} · ${rank.kanji}`);
    setText(
      rungHeadCardMeter,
      prog.ready
        ? 'Ready to advance — answer the summons.'
        : `Estate service · ${prog.percent}%`,
    );
    const nid = nextRankId(rank.id);
    setText(
      rungHeadCardNext,
      nid
        ? `Next: ${getRank(nid).title} ${getRank(nid).kanji}`
        : 'Beyond the gate the road climbs on — to be continued.',
    );
  }

  // FB-116 — the Work-column rung ladder (renderLadder) was REMOVED: it duplicated the header rung
  // element (renderRungHead, FB-106), which is now the SOLE home of the rung name + progress meter
  // (top-right, always on screen, with the hover-detail card + the ready-to-advance summons).

  // The estate trio (Works / Estate / House-Influence) lives in render/estate.ts
  // (render-split).
  const { renderWorks, renderEstate, renderHouseInfluence } = createEstateView({
    worksPane,
    estatePane,
    influence,
    dispatch,
    dev,
    activeTab: () => activeTab,
  });

  // The header vitals strip lives in render/vitals.ts (render-split); the element
  // refs are the shell's, passed once.
  const { renderVitals } = createVitalsView({
    els: {
      coin,
      clock,
      clockTag,
      clockDay,
      seasonEndBtn,
      stamina,
      staminaBar,
      staminaFill,
      staminaNum,
      belly,
      bellyBar,
      bellyFill,
      bellyNum,
      health,
      healthBar,
      healthFill,
      healthNum,
      wood,
      sansai,
    },
  });

  // The VN / intro machinery lives in render/vn.ts (render-split).
  const vnView = createVnView({
    root,
    dispatch,
    dev,
    sfx: hooks.sfx,
    armSlopGate: () => {
      slopGateArmed = true;
    },
    suppressRankUpOverlay: () => {
      suppressRankUpOverlay = true;
    },
  });
  const { vnActive, syncIntroScene, teardownIntroScene } = vnView;

  // The actions surface (the Work-tab hero) lives in render/actions.ts (render-split).
  const { renderActions } = createActionsView({
    pane: actions,
    zoneBanner,
    zoneSeal,
    zoneName,
    zoneLine,
    dispatch,
    dev,
    activeTab: () => activeTab,
    lastState: () => lastState,
    isPaused: () => hooks.isPaused(),
  });

  // The combat + character surfaces live in render/combat.ts and render/character.ts
  // (render-split); the auto-combat toggles read the live last-rendered state via getter.
  const { renderCombat } = createCombatView({
    pane: combatPane,
    dispatch,
    dev,
    activeTab: () => activeTab,
    lastState: () => lastState,
    isPaused: () => hooks.isPaused(),
  });
  const { renderSkills, renderCharacterSheet } = createCharacterView({
    characterRecord,
    characterBody,
    characterTrain,
    characterBestiary,
    skillsPane,
    dispatch,
    dev,
    activeTab: () => activeTab,
  });

  // The log surface lives in render/log.ts (render-split); see the createLogView
  // instantiation below (after the VN machinery it gates on).

  // The one-shot overlays (rank-up seal / ascension / slop warning) live in
  // render/modals.ts (render-split).
  const { showRankUp, showAscension, showSlopWarning, showSealAfterglow } =
    createOverlays({
      shell,
      root,
      sfx: hooks.sfx,
    });

  // The inventory pair (kura storehouse + home/belongings) lives in render/inventory.ts
  // (render-split).
  const { renderStorehouse, renderBelongings } = createInventoryView({
    storehousePane,
    belongingsPane,
    dispatch,
    dev,
    activeTab: () => activeTab,
  });

  // the pedlar's grant string ("+2 sansai, +1 wood") — static per item (grants never change).
  // The market surface lives in render/market.ts (render-split); it reads the shared
  // shell state (active tab / open person) through getters, never a copied snapshot.
  const { renderMarket } = createMarketView({
    pane: marketPane,
    dispatch,
    dev,
    activeTab: () => activeTab,
    openPersonId: () => openPersonId,
  });

  // The map + who's-here surfaces live in render/map.ts (render-split); the open-person
  // state stays here (the market gates on it) and threads via getter/setter.
  const { renderMap, renderWhosHere } = createMapView({
    mapPane,
    whosPane,
    whosList,
    dispatch,
    dev,
    activeTab: () => activeTab,
    openPersonId: () => openPersonId,
    setOpenPersonId: (id) => {
      openPersonId = id;
    },
    rerender: () => {
      if (lastState) render(lastState, null);
    },
  });

  // The quests surface lives in render/quests.ts (render-split).
  const { renderQuests } = createQuestsView({
    pane: questsPane,
    dispatch,
    dev,
    activeTab: () => activeTab,
  });

  function coldOpenReduced(): boolean {
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('reduced-motion')
    );
  }
  // The slow cold-open reveal (FB-14) — the GBA-typewriter take, human-approved as the prod
  // default (2026-07-02). M4 (ADR-127): the WHOLE card types — title → roman → lede, staged
  // char-by-char through the shared TYPE_MS_PER_CHAR cadence (single-sourced; the title's
  // heavier kanji run at 3× per-char so they land with weight), a gold block caret riding
  // whichever element is typing. Runs once per cold-open (the started-flag guards
  // re-entry); the wake-path resets the flag so a New Game replays it.
  function applyColdOpenReveal(): void {
    if (coldOpenRevealStarted) return;
    coldOpenRevealStarted = true;
    cancelColdOpenReveal?.();
    const items = [coTitle, coRoman, coLede, coVerb, coRestore];
    for (const it of items) it.classList.add('co-reveal-item');
    // restore the full authored text — a cancelled prior run may have left slices
    coTitle.textContent = COLD_OPEN_TITLE;
    coRoman.textContent = COLD_OPEN_ROMAN;
    coLede.textContent = cardLede();
    coVerb.textContent = cardCta();
    for (const it of items) it.classList.remove('in');
    // FB-314 — pin each typed line's full height NOW (full text is present) before the
    // typewriter empties + refills it below, so the card holds a fixed size as text fills
    // in and the CTA never slides down (TST2: never resize a watched surface under the reader).
    // A typed prefix never wraps to more lines than the full text, so this is a safe ceiling;
    // no-op under jsdom (0 height) and the reduced-motion/QA everything-at-once path.
    for (const it of [coTitle, coRoman, coLede])
      it.style.minHeight = `${it.getBoundingClientRect().height}px`;
    // the wake verb and the quiet restore line (HD-24) wake in together, after the lede types out.
    const showButton = (): void => {
      coVerb.classList.add('in');
      coRestore.classList.add('in');
    };
    // QA instant-text rides the same everything-at-once path reduced-motion takes
    if (coldOpenReduced() || QA_INSTANT_TEXT) {
      for (const it of items) it.classList.add('in');
      cancelColdOpenReveal = undefined;
      return;
    }
    const timers: number[] = [];
    const at = (fn: () => void, ms: number): void => {
      timers.push(window.setTimeout(fn, ms));
    };
    const stages: {
      el: HTMLElement;
      text: string;
      per: number;
      holdAfter: number;
    }[] = [
      {
        el: coTitle,
        text: COLD_OPEN_TITLE,
        per: TYPE_MS_PER_CHAR * 3,
        holdAfter: 380,
      },
      {
        el: coRoman,
        text: COLD_OPEN_ROMAN,
        per: TYPE_MS_PER_CHAR,
        holdAfter: 380,
      },
      { el: coLede, text: cardLede(), per: TYPE_MS_PER_CHAR, holdAfter: 900 },
    ];
    let t = 350; // a beat of dark before the title strikes
    for (const s of stages) {
      const { el: node, text, per } = s;
      at(() => {
        node.classList.add('in', 'co-typing');
        node.textContent = '';
      }, t);
      for (let i = 0; i < text.length; i++) {
        at(
          () => {
            node.textContent = text.slice(0, i + 1);
          },
          t + (i + 1) * per,
        );
      }
      t += (text.length + 1) * per;
      at(() => node.classList.remove('co-typing'), t);
      t += s.holdAfter;
    }
    at(showButton, t);
    cancelColdOpenReveal = () =>
      timers.forEach((id) => window.clearTimeout(id));
  }
  function render(state: GameState, prev: GameState | null): void {
    lastState = state;
    settings.paint(); // the Pause/Resume label is derived, never latched
    // pre-awake: show only the cold-open card; the shell (and its log) inks in on waking.
    if (!hasFlag(state, 'awake')) {
      // FB-359/FB-360 — a New game pressed WHILE a VN scene is open swaps to a pre-awake
      // state; without this teardown the early return below leaves the dead .vn-scene
      // overlay (z-40) mounted over the cold open forever — its buttons dispatch intents
      // the pre-awake reducer refuses, and every click outside it is eaten.
      teardownIntroScene();
      coldOpen.hidden = false;
      shell.hidden = true;
      firstRender = false; // so the post-wake log cascades rather than dumping statically
      activeTab = 'work'; // New Game → reset the UI to the zero state (FB-25)
      openPersonId = null; // …and close any open who's-here conversation (ADR-114)
      logView.forceStoryFilter();
      applyColdOpenReveal();
      // DEV story switcher (HD-37 unit A): a take toggle re-inks the card in place —
      // instantly, never re-typing, and never fighting a line mid-typewriter.
      if (
        __DEV_TOOLS__ &&
        dev &&
        coldOpenRevealStarted &&
        !coLede.classList.contains('co-typing')
      ) {
        if (coLede.textContent !== cardLede()) coLede.textContent = cardLede();
        if (coVerb.textContent !== cardCta()) coVerb.textContent = cardCta();
      }
      return;
    }
    coldOpen.hidden = true;
    // leaving the cold-open: cancel any pending reveal and reset so a New Game replays it.
    if (coldOpenRevealStarted) {
      cancelColdOpenReveal?.();
      coldOpenRevealStarted = false;
    }
    // FB-44/ADR-104 + ADR-110 — a VN scene (the intro OR a player-triggered rung beat) plays as a
    // FULL-SCREEN washi surface that hides the whole shell; the estate inks in only AFTER it ends
    // (the incremental-reveal signature — a rung beat's newly-motivated panels ink in on teardown,
    // §7.4). The log is kept painted INSTANTLY behind the scene (FB-48) so it's ready the moment the
    // shell reveals — the scene owns the live spoken reveal, the log is only the historical transcript.
    // storywave G4.9 — auto-open a queued generalized scene (the Count wakes you, a per-season
    // overlay, the Autumn nengu frame, a discovered side-beat, the R7 dream): when the queue holds
    // one and no VN/scene is already live, drain the head. Deferred via a microtask so we never
    // dispatch mid-render (re-entrancy), and guarded so it never stacks. begin_scene is thus
    // engine-driven (NON_UI, like advance_intro) — the player has no control that opens a scene; the
    // player-facing controls are the scene's Continue/pick (advance_scene_beat / choose_scene_option).
    if (
      state.sceneQueue.length > 0 &&
      state.activeScene === null &&
      state.rungBeat === null &&
      !introActive(state.introBeat) &&
      !scenePumpScheduled
    ) {
      const sceneId = state.sceneQueue[0]!;
      scenePumpScheduled = true;
      queueMicrotask(() => {
        scenePumpScheduled = false;
        dispatch({ type: 'begin_scene', sceneId });
      });
    }
    if (vnActive(state)) {
      shell.hidden = true;
      firstRender = false; // the post-scene log resumes its cascade, not a static dump
      activeTab = 'work';
      // FB-330 — the VN forces the story view; a player who was on Chat/All/Now when the
      // beat opened must get a REAL repaint (setLogFilter's clear + rebuild), never a raw
      // `logFilter = 'story'` over the old view's DOM — that stale mix is what re-scrolled
      // wholesale when the scene ended. Same-filter renders keep the cheap incremental path.
      if (logView.getLogFilter() !== 'story') setLogFilter('story');
      renderLog(state); // instant while a VN scene is live (see renderLog) — no slow catch-up
      // FB-222 — seed the unread baseline HERE too: this branch returns before the main
      // seeding block, so without it the first seed ran on the intro-END render and
      // swallowed every mid-intro arrival (the perk milestone) as "history" — the
      // Progress tab never showed its dot after the cold open.
      seedLogSeenOnce(state);
      syncIntroScene(state);
      return;
    }
    // the intro is over (or never ran) — drop the scene and reveal the shell. Flag the single
    // reveal render so the final beat's log lines paint instantly too (FB-48), not via the cascade.
    if (vnView.introSceneActive()) introEndingRender = true;
    teardownIntroScene();
    shell.hidden = false;
    // F55b — the estate INKS IN gracefully as the intro ends, never a hard jump. On the single
    // reveal render, tag the shell so its slices fade/rise in (CSS `.shell.intro-reveal`); the class
    // self-clears after the animation. Reduced-motion neutralises the animation (media query +
    // `.reduced-motion` zero the duration), so those users get the instant reveal.
    if (introEndingRender) {
      shell.classList.add('intro-reveal');
      window.setTimeout(() => shell.classList.remove('intro-reveal'), 1200);
    }
    // Multi-panel layout (M2) — LOCKED to 屏風 folding-columns (`layout-byobu`) + soft cards
    // (`framing-cards`), the human's picked default and now the SOLE prod rendering (ADR-075
    // zero-flag-debt; the layout/framing variant toggles were pruned from ui/dev.ts). CSS arranges
    // the slices per `.workspace[data-layout]` and frames them per `[data-framing]`; the shell
    // carries the layout too so the framed spread widens (but never full-bleeds) with the workspace.
    workspace.dataset.layout = 'layout-byobu';
    workspace.dataset.framing = 'framing-cards';
    shell.dataset.layout = 'layout-byobu';
    renderVitals(state, prev);
    renderRungHead(state); // FB-106 — the header rung element + the player-triggered beat affordance
    renderNav(state);
    renderLog(state);
    // FB-330 — while the shell was display:none (the VN owned the screen) every scroll write
    // was a no-op (scrollHeight 0), so the log reveals stranded at the TOP and then visibly
    // re-scrolls to the foot. On the single reveal render, JUMP to the newest line before the
    // player sees a frame — the log is simply already-at-the-foot, no motion at all (TST2).
    if (introEndingRender) {
      logView.pinToBottom();
    }
    paintLogFilterBar();
    // FB-59 — first awake render: mark all loaded entries seen (history), so no channel shows a
    // stale unread dot on load/refresh. After this, only mid-session arrivals trip a dot.
    // (FB-222 — also runs in the VN-active branch above, so intro arrivals count as unread.)
    seedLogSeenOnce(state);
    refreshLogTabs(state); // FB-20 — repaint per-tab unread dots
    renderWorks(state);
    renderEstate(state);
    renderWhosHere(state); // FB-332 — before renderMarket: it settles openPersonId for the wares gate
    renderMarket(state);
    renderStorehouse(state);
    renderBelongings(state);
    renderHouseInfluence(state);
    renderActions(state);
    renderSkills(state);
    renderCharacterSheet(state); // the Character tab's training + bestiary (split out of combat)
    renderCombat(state);
    renderQuests(state);
    renderMap(state);
    // M1 reveal-gating: a slice is HIDDEN (removed from flow — never shown as a locked box) until
    // one of its panes renders visible. Runs AFTER the per-pane renders set each pane's `hidden`,
    // so early game is Do + Log only and each slice inks in as its surface unlocks (the widening
    // of the screen becomes a progression beat). Hidden slices collapse out of the grid/flex flow.
    for (const slice of gatedSlices) slice.hidden = !hasVisibleChild(slice);
    // the signature beats: a rung promotion presses the house seal (ui-design §6.2); a TIER
    // ascension lands the bigger ceremony (ADR-062). Tier change wins (don't double-fire).
    if (prev && prev.tier !== state.tier && !firstRender) showAscension(state);
    else if (prev && prev.rung !== state.rung && !firstRender) {
      // FB-153 — the beat modal already performed the ceremony (skip-once).
      if (suppressRankUpOverlay) suppressRankUpOverlay = false;
      else showRankUp(state);
      pendingAfterglow = true; // ADR-201 — the book presents after the story
      // SLOP threshold gates (human, 2026-07-10) — exact-step matches, and only
      // when a player-initiated control armed the latch (never a DEV teleport).
      if (slopGateArmed) {
        slopGateArmed = false;
        if (prev.rung === 'R0' && state.rung === 'R1')
          pendingSlopWarning = 'R1';
        else if (prev.rung === 'R1' && state.rung === 'R2')
          pendingSlopWarning = 'R2';
      }
    }
    // A pending SLOP warning waits out any live-or-queued VN (the rung-up story
    // plays FIRST — human, 2026-07-10 follow-up), then opens on the shell.
    if (
      pendingSlopWarning &&
      !vnActive(state) &&
      state.sceneQueue.length === 0
    ) {
      showSlopWarning(pendingSlopWarning);
      pendingSlopWarning = null;
    }
    // The seal-book afterglow waits out the same things the slop warning does,
    // PLUS the slop scrim itself (consent first, ceremony after) and any prior
    // afterglow still on screen (a DEV multi-rung jump collapses to one).
    if (
      pendingAfterglow &&
      !vnActive(state) &&
      state.sceneQueue.length === 0 &&
      pendingSlopWarning === null &&
      !root.querySelector('.slop-scrim') &&
      !shell.querySelector('.seal-afterglow')
    ) {
      pendingAfterglow = false;
      showSealAfterglow(state);
    }
    introEndingRender = false; // one-shot: the intro-reveal render is done
    firstRender = false;
    paintActionClock(); // ADR-148 — re-apply clock phases after the render pass repainted buttons
  }

  // ── ADR-148 Phase 2 — the action-clock painting pass ─────────────────────────
  // Every button that dispatches a TIMED intent is stamped `data-act-key` at build
  // time (stampAct). This pass paints all of them from the clock: the phase class,
  // the one-global-action lock, and the inner-bottom progress bar. CSS transitions
  // carry the motion (no per-frame JS — TST2); it runs after every render (buttons
  // may have been rebuilt/re-enabled) and on every clock phase change.
  function paintActBar(
    btn: HTMLElement,
    phase: string,
    fraction: number,
    remainingMs: number,
  ): void {
    let bar = btn.querySelector<HTMLElement>(':scope > .act-bar');
    if (phase === 'idle') {
      bar?.remove();
      return;
    }
    if (!bar) {
      bar = el('span', 'act-bar');
      bar.setAttribute('aria-hidden', 'true');
      btn.append(bar);
    }
    // running fills left→right (fraction 0→1); cooldown drains right→left (fraction 1→0).
    const fromPct = fraction * 100;
    const toPct = phase === 'running' ? 100 : 0;
    if (reduceMotion()) {
      bar.style.transition = 'none';
      bar.style.width = `${toPct}%`;
      return;
    }
    bar.style.transition = 'none';
    bar.style.width = `${fromPct}%`;
    void bar.offsetWidth; // commit the start width so the transition has a from-edge
    bar.style.transition = `width ${remainingMs}ms linear`;
    bar.style.width = `${toPct}%`;
  }
  function paintActionClock(): void {
    const busy = hooks.clock.busy();
    for (const btn of root.querySelectorAll<HTMLElement>('[data-act-key]')) {
      const st = hooks.clock.status(btn.dataset.actKey!);
      setClass(btn, 'act-running', st.phase === 'running');
      setClass(btn, 'act-cooldown', st.phase === 'cooldown');
      // ONE global action (ADR-148): while anything runs, every timed button locks;
      // a cooling button locks only itself. `actLocked` remembers the lock was OURS,
      // so an availability-disabled button is never wrongly re-enabled here. Non-button
      // travel controls (map-variant nodes) get the class + aria only — the clock's own
      // press() refusal is the real enforcement; the paint is the legibility (TST4).
      const lock = busy || st.phase !== 'idle';
      if (btn instanceof HTMLButtonElement) {
        if (lock) {
          if (!btn.disabled) {
            btn.disabled = true;
            btn.dataset.actLocked = '1';
          }
        } else if (btn.dataset.actLocked) {
          btn.disabled = false;
          delete btn.dataset.actLocked;
        }
      } else {
        setClass(btn, 'act-locked', lock);
        if (lock) btn.setAttribute('aria-disabled', 'true');
        else if (btn.dataset.locked !== '1')
          btn.removeAttribute('aria-disabled');
      }
      paintActBar(btn, st.phase, st.fraction, st.remainingMs);
    }
  }
  // FB-340 (HR-26) — fire the travel-presence footsteps+follow the instant a move_to action
  // STARTS, so the walk plays DURING the move timer (synced to the clock fraction), not after it
  // completes. The `sample` thunk reads the live clock, so the animation matches the timer's
  // length and pauses/freezes with it; the map's own player (travelPresenceRef) owns the view.
  let presenceMoveKey: string | null = null;
  function maybeStartTravelPresence(): void {
    const key = hooks.clock.runningKey();
    if (key === presenceMoveKey) return; // unchanged since last change event
    presenceMoveKey = key;
    if (key === null || !key.startsWith('move_to:')) return;
    const toId = key.slice('move_to:'.length);
    const fromId = lastState?.location;
    if (fromId === undefined || fromId === toId) return;
    travelPresenceRef.current?.(fromId, toId, () => {
      const st = hooks.clock.status(key);
      return { fraction: st.fraction, running: st.phase === 'running' };
    });
  }
  hooks.clock.onChange(() => {
    paintActionClock();
    maybeStartTravelPresence();
  });

  // ── FB-264 — the DEV action hover-detail card ────────────────────────────────
  // Toggled from the DEV panel's Settings pane (body[data-dev-act-hover]); one
  // singleton fixed-position card, pointer-events:none — a DEV tool that observes
  // must not perturb (no layout shift, no stolen hovers, no dispatch). Content is
  // built lazily on mouseover from `activityForecast` — the SAME selector the
  // reducer pays from (AC-6), so the shown numbers ARE the next act's payout.
  // `__DEV_TOOLS__` strips the whole block (and the card) from prod.
  if (__DEV_TOOLS__ && dev) {
    const card = el('div', 'dev-act-card');
    card.hidden = true;
    document.body.append(card);
    const hideCard = (): void => {
      card.hidden = true;
    };
    root.addEventListener('mouseover', (e) => {
      if (document.body.dataset.devActHover !== '1' || !lastState)
        return hideCard();
      const btn = (e.target as Element | null)?.closest<HTMLElement>(
        '[data-act-key]',
      );
      if (!btn) return hideCard();
      const key = btn.dataset.actKey!;
      const sep = key.indexOf(':');
      const type = (sep === -1 ? key : key.slice(0, sep)) as Intent['type'];
      const arg = sep === -1 ? undefined : key.slice(sep + 1);
      card.textContent = '';
      // FB-299 — the card names the act and says what it NEEDS and PRODUCES, for every timed
      // action (not just labour). Numbers come from the same balance constants / selectors the
      // reducer spends (AC-6) — never re-typed literals. FB-334 — the unit reads "body" (the
      // visible meter's name), never the internal field name "satiety".
      card.append(
        el('div', 'dev-act-card-title', btn.textContent?.trim() || key),
      );
      const state = lastState;
      const line = (t: string): void => {
        card.append(el('div', 'dev-act-card-line', t));
      };
      switch (type) {
        case 'do_activity': {
          const act = getActivity(arg as Parameters<typeof getActivity>[0]);
          const f = activityForecast(state, act);
          const gains = Object.entries(f.gained)
            .map(([r, n]) => `+${n} ${r === 'rice' ? 'shō (kura)' : r}`)
            .join(' · ');
          line(gains || 'no yield');
          line(`+${f.xp} ${act.skill} xp · −${act.satietyCost} body`);
          break;
        }
        case 'rake_rice':
          line(
            `+${balance.RICE_PER_RAKE} shō (kura) · −${balance.SATIETY_PER_ACT} body`,
          );
          break;
        case 'rest':
          // restRefill — the SAME selector the reducer spends (AC-6), so a hungry (degraded)
          // rest forecasts its true, reduced number instead of the full base.
          line(`+${restRefill(state)} body`);
          break;
        case 'sleep': {
          // ADR-187 — sleepForecast is the SAME selector the reducer spends (AC-6). The day is the
          // real price and it is not a number, so it leads in words; the stores/belly follow.
          const f = sleepForecast(state);
          line('the day is spent — you wake at dawn');
          line(
            `−${f.riceDrawn} shō (kura) · −${Math.round(f.bellyLost)} belly · no body back`,
          );
          break;
        }
        case 'cook_meal':
          line(
            `−${balance.COOK_SANSAI_COST} sansai · +${balance.COOK_HUNGER_RESTORE} belly`,
          );
          break;
        case 'treat': {
          // ADR-164/ADR-197 — the SAME selector the reducer spends (AC-6).
          const f = treatForecast(state);
          line(`−${f.cost} mon · +${f.hpGain} hp`);
          break;
        }
        case 'rest_sickroom': {
          const f = restSickroomForecast(state);
          line('the day is spent — you wake at dawn');
          line(
            `+${f.hpGain} hp · −${f.riceDrawn} shō (kura) · −${Math.round(f.bellyLost)} belly`,
          );
          break;
        }
        case 'eat_rice':
          line(
            `−${balance.EAT_RICE_COST} shō (kura) · +${balance.EAT_RICE_HUNGER} belly`,
          );
          break;
        case 'repair_weapon':
          line(
            `−${balance.REPAIR_WOOD_COST} wood · −up to ${balance.REPAIR_COIN_COST} coin ` +
              `(waived if broke) · durability restored`,
          );
          break;
        case 'craft_weapon': {
          const recipe = RECIPES.find((r) => r.id === arg);
          if (recipe) {
            const needs = Object.entries(recipe.inputs)
              .map(([m, q]) => `−${q} ${getMaterial(m).label}`)
              .join(' · ');
            line(`${needs} → ${getWeapon(recipe.outputWeapon).label}`);
          }
          break;
        }
        case 'improve_estate': {
          const target = ESTATE_STAGES.find(
            (s) => s.stage === state.estateStage + 1,
          );
          if (target)
            line(`−${formatCoin(target.coinCost)} → stage U${target.stage}`);
          break;
        }
        case 'move_to':
          if (arg) line(`→ ${getNode(arg).label}`);
          break;
        default:
          break; // begin_night_round & co: the title + timing say it
      }
      const t = timingFor(type, {
        activityId: arg,
        to: arg,
        from: lastState.location,
      } as Parameters<typeof timingFor>[1]);
      card.append(
        el(
          'div',
          'dev-act-card-line dev-act-card-timing',
          t.kind === 'timed'
            ? `${t.durationMs / 1000}s work · ${t.cooldownMs / 1000}s cooldown`
            : 'instant',
        ),
      );
      card.hidden = false;
      // clamp on-screen only after unhiding, so the measured size is real
      const r = btn.getBoundingClientRect();
      const x = Math.min(
        Math.max(4, r.left),
        window.innerWidth - card.offsetWidth - 4,
      );
      const below = r.bottom + 4 + card.offsetHeight <= window.innerHeight;
      card.style.left = `${x}px`;
      card.style.top = `${below ? r.bottom + 4 : Math.max(4, r.top - 4 - card.offsetHeight)}px`;
    });
    root.addEventListener('mouseout', (e) => {
      const to = e.relatedTarget as Element | null;
      if (!to?.closest?.('[data-act-key]')) hideCard();
    });
  }

  return render;
}
