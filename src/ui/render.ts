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
  DialogueScene,
  DialogueTopic,
  VoiceCategory,
  AttrId,
  IntroSetupLine,
  RungScene,
  NpcId,
  LabourOption,
  MetaVerb,
} from '../core';
import {
  availableActions,
  sleepForecast,
  canTreat,
  treatForecast,
  canRestSickroom,
  restSickroomForecast,
  availableLabours,
  canAffordAct,
  OUT_OF_STRENGTH_REASON,
  rakeExhausted,
  timingFor,
  getActivity,
  activityForecast,
  introActive,
  introSceneAt,
  introStatDelta,
  beatReactVoice,
  beatReactSpeaker,
  ATTR_META,
  playerSpeaker,
  isUnlocked,
  requirementById,
  unlockedSurfaces,
  hasFlag,
  formatKMB,
  formatCoin,
  satietyMax,
  hungerMax,
  restQuality,
  restRefill,
  hpMax,
  staminaRate,
  season,
  nodeSeasonalBlurb,
  MAP_NODE_IDS,
  dayOfWeek,
  DAY_OF_WEEK_NAMES,
  currentRank,
  RANKS,
  SURFACES,
  rungProgress,
  nextRankId,
  getRank,
  promotionReady,
  pendingPromotionTarget,
  rungBeatFor,
  SKILLS,
  skillVisible,
  getWeapon,
  AREAS,
  ESTATE_STAGES,
  stageLabel,
  canWorkProject,
  NAMES,
  RECIPES,
  getMaterial,
  getNode,
  balance,
  NPC_NAME,
  NPC_VOICE,
  rungRequirements,
  sceneById,
  isWaged,
  DAY_WAGE_MON,
  getMob,
  nightRoundById,
} from '../core';
import {
  isEarnedLine,
  LOG_FILTERS,
  logFilterMatches,
  storySubMatches,
  type LogFilter,
  type StorySub,
} from './log-filter';
import {
  reconcileList,
  resetReconcile,
  setText,
  toggle,
  setClass,
  setDisabled,
  setStyle,
  setTitle,
} from './reconcile';
import {
  LOG_SCALE_MIN,
  LOG_SCALE_MAX,
  LOG_SCALE_STEP,
  clampLogScale,
  loadLogScale,
  saveLogScale,
} from './ui-prefs';
import type { Sfx } from './sfx';
// the SHIPPED estate map — the 絵図 survey-plan sheet, the human-picked winner of the ADR-075
// real-map diverge (HR-7). storywave G4.9: rebuilt on the map-sheets geometry (the ONE aligned
// layout) since the old ezu.ts POS keyed to retired node ids and drew nothing for the G4 estate.
import { travelPresenceRef } from './map-variants/sheet-map';
import { COLD_OPEN, RAKE_DONE_REASON } from '../core/content/coldOpen';
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

// rake COUNT at which the R0 rake gains its auto-repeat toggle — a few manual rakes' worth,
// so the first rakes land as juice before the grind can be automated (FB-121: read from the
// R0 requirement's progress, the same stream the % bar consumes).
const RAKE_AUTO_REVEAL_COUNT = 5;
/** Rakes done this rung — the R0 rake requirement's live progress, found by its TOKEN
 *  (registry-derived; never a copied requirement id). 0 once promoted past R0. */
function rakeCount(state: GameState): number {
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
export const AUTO_PAUSED_REASON = 'The game is paused — resume it in Settings ⚙.';

const META_LABELS: Record<MetaVerb, string> = {
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
export const STANCE_UI: Record<StanceId, { kanji: string; gloss: string; hint: string }> = {
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
const ATTR_COLOR: Record<AttrId, string> = {
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
 *  beats) feed it (ADR-110 §7.3). */
function introNameplate(scene: {
  readonly voice: VoiceCategory;
  readonly speaker?: NpcId;
}): HTMLElement {
  const color = VOICE_COLOR[scene.voice];
  const plate = el('div', 'vn-nameplate');
  const seal = el('div', 'vn-seal', VOICE_SEAL[scene.voice]);
  seal.lang = 'ja';
  seal.style.color = color;
  seal.style.borderColor = color;
  const name = el('div', 'vn-name', scene.speaker ? NPC_NAME[scene.speaker] : 'A memory');
  name.style.color = color;
  name.style.borderColor = color;
  plate.append(seal, name);
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
export const HOUSE_ROOMS: readonly { surface: string; kanji: string; label: string }[] = [
  { surface: 'house-omoya', kanji: '母屋', label: 'The main house reopened' },
  { surface: 'house-workshops', kanji: '工房', label: 'The workshops woken' },
  { surface: 'house-granary', kanji: '板倉', label: 'A new granary raised' },
  { surface: 'house-study', kanji: '書院', label: "The lord's study opened to you" },
];

// Static pane blurbs — hoisted so the incremental (prod/test) path and the DEV-variant
// wholesale fallback render the SAME copy (single source of truth, no drift).
export const MARKET_BLURB =
  'A pedlar passes now and then. A little of your OWN coin for the things you need — greens for the pot, wood to keep an edge. Your purse, not the house’s.';
export const QUESTS_BLURB =
  'Goals beyond the daily grind — take one on, then earn it in the field.';

const CHANNEL_BULLET: Record<LogChannel, string> = {
  narration: '',
  reward: '🌾',
  combat: '⚔️',
  system: '',
  // a quiet ink mark, not the red dot the human disliked (FB-56) — milestones read as progress, calmly.
  milestone: '❖',
};

export const SEASON_TAG: Record<Season, { kanji: string; emoji: string; name: string }> = {
  winter: { kanji: '冬', emoji: '❄️', name: 'Winter' },
  'new-year': { kanji: '正月', emoji: '🎍', name: 'New Year' },
  spring: { kanji: '春', emoji: '🌸', name: 'Spring' },
  summer: { kanji: '夏', emoji: '🎐', name: 'Summer' },
  bon: { kanji: '盆', emoji: '🏮', name: 'Bon' },
  autumn: { kanji: '秋', emoji: '🍁', name: 'Autumn' },
};

const RESOURCE_LABEL: Record<string, string> = {
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
type Tab = 'work' | 'map' | 'works' | 'estate' | 'inventory' | 'character' | 'combat' | 'quests';

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
    entry.voice !== undefined && entry.voice !== 'narrator' && !/["“]/.test(entry.text)
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

function vital(id: string, label: string): { wrap: HTMLElement; value: HTMLElement } {
  const wrap = el('div', `vital ${id}`);
  wrap.hidden = true;
  wrap.append(el('span', 'label', label));
  const value = el('span', 'value numeric', '0');
  wrap.append(value);
  return { wrap, value };
}

function brushRule(): HTMLElement {
  return el('hr', 'brush-rule');
}

function buildSettings(hooks: AppHooks): {
  modal: HTMLElement;
  open: (tab?: string) => void;
  /** Repaint the state-derived controls (the Pause/Resume label) — called from every render, so a
   *  pause flipped from anywhere (the DEV `__qa.pause`, a future hotkey) can never leave the
   *  button lying about the game it controls. */
  paint: () => void;
} {
  const scrim = el('div', 'modal-scrim');
  scrim.hidden = true;
  const card = el('div', 'modal-card frame');
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'true');
  card.setAttribute('aria-label', 'Settings and About');

  // focus management (D-Q-a11y): trap Tab inside the open dialog, restore focus to the
  // control that opened it, and only act on Escape while actually open.
  let opener: HTMLElement | null = null;
  const hide = (): void => {
    scrim.hidden = true;
    opener?.focus();
  };
  const close = el('button', 'modal-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close');
  close.addEventListener('click', hide);
  scrim.addEventListener('click', (e) => {
    if (e.target === scrim) hide();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !scrim.hidden) hide();
  });
  card.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = card.querySelectorAll<HTMLElement>(
      'button, textarea, input, [href], [tabindex]:not([tabindex="-1"])',
    );
    if (f.length === 0) return;
    const first = f[0]!;
    const last = f[f.length - 1]!;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
  card.append(close);

  const h = el('h2', 'modal-title');
  h.lang = 'ja';
  h.append(el('span', 'kami', '神隠し'), el('span', 'roman', 'Kamikakushi'));
  card.append(h);

  // ── sub-tab bar (playtest FB-31): Settings · Saves · About ──
  // one long column split into three panels; the active tab shows, the rest hide.
  const tabBar = el('div', 'modal-tabs');
  tabBar.setAttribute('role', 'tablist');
  const sections: Record<string, HTMLElement> = {};
  const tabs: Record<string, HTMLButtonElement> = {};
  const showTab = (name: string): void => {
    for (const [k, sec] of Object.entries(sections)) sec.hidden = k !== name;
    for (const [k, tb] of Object.entries(tabs)) {
      const on = k === name;
      tb.classList.toggle('active', on);
      tb.setAttribute('aria-selected', on ? 'true' : 'false');
    }
  };
  const addTab = (name: string, label: string): HTMLElement => {
    const tb = el('button', 'modal-tab', label);
    tb.type = 'button';
    tb.setAttribute('role', 'tab');
    tb.addEventListener('click', () => showTab(name));
    tabs[name] = tb;
    tabBar.append(tb);
    const sec = el('div', 'modal-section');
    sec.setAttribute('role', 'tabpanel');
    sections[name] = sec;
    return sec;
  };
  const settingsSec = addTab('settings', 'Settings');
  const savesSec = addTab('saves', 'Saves');
  const aboutSec = addTab('about', 'About');
  card.append(tabBar);

  // ── comfort / a11y (Settings tab) ──
  settingsSec.append(el('h3', undefined, 'Comfort'));
  const comfort = el('div', 'settings-row');
  let reduced = false;
  const rm = el('button', 'auto-toggle', 'Reduced motion: off');
  rm.type = 'button';
  rm.addEventListener('click', () => {
    reduced = !reduced;
    hooks.setReducedMotion(reduced);
    rm.textContent = `Reduced motion: ${reduced ? 'on' : 'off'}`;
    rm.classList.toggle('on', reduced);
  });
  // Sound removed for now (human call, 2026-07-07 — the synth cues read too comedic). Mute the
  // ONE shared SFX engine at mount so every caller no-ops, main.ts's per-deed hit() included, and
  // drop the user-facing toggle so nothing can re-arm it. The engine (sfx.ts) is left intact —
  // this is a wiring-level silence, trivially reversible: restore the toggle button below.
  hooks.sfx.setMuted(true);
  let scale = 1;
  const ts = el('div', 'labour-row');
  const tsLabel = el('span', 'lock-hint', 'Text size 100%');
  const minus = el('button', 'auto-toggle', 'A−');
  minus.type = 'button';
  const plus = el('button', 'auto-toggle', 'A+');
  plus.type = 'button';
  const applyScale = (): void => {
    hooks.setTextScale(scale);
    tsLabel.textContent = `Text size ${Math.round(scale * 100)}%`;
  };
  minus.addEventListener('click', () => {
    scale = Math.max(0.9, Math.round((scale - 0.1) * 10) / 10);
    applyScale();
  });
  plus.addEventListener('click', () => {
    scale = Math.min(1.5, Math.round((scale + 0.1) * 10) / 10);
    applyScale();
  });
  ts.append(minus, plus, tsLabel);
  const pause = el('button', 'auto-toggle', 'Pause');
  pause.type = 'button';
  // The label is DERIVED, never latched: `paintPause` reads the shell flag and is called both here
  // and from every render, so the button can never disagree with the game it controls (TST4).
  const paintPause = (): void => {
    const p = hooks.isPaused();
    setText(pause, p ? 'Resume' : 'Pause');
    setClass(pause, 'on', p);
  };
  pause.addEventListener('click', () => {
    hooks.togglePause();
    paintPause();
  });
  paintPause();
  comfort.append(rm, ts, pause);
  settingsSec.append(comfort);

  // ── manage saves (Saves tab) ──
  savesSec.append(el('h3', undefined, 'Your save'));
  const exportArea = el('textarea', 'save-area');
  exportArea.readOnly = true;
  exportArea.rows = 2;
  exportArea.placeholder = 'Your exported save appears here — copy it somewhere safe.';
  exportArea.id = 'save-export';
  exportArea.name = 'save-export';
  exportArea.setAttribute('aria-label', 'Exported save code');
  const importArea = el('textarea', 'save-area');
  importArea.rows = 2;
  importArea.placeholder = 'Paste a save here, then Import.';
  importArea.id = 'save-import';
  importArea.name = 'save-import';
  importArea.setAttribute('aria-label', 'Paste a save code to import');
  const exp = el('button', 'auto-toggle', 'Export save');
  exp.type = 'button';
  exp.addEventListener('click', () => {
    exportArea.value = hooks.exportSave();
    exportArea.select();
  });
  const imp = el('button', 'auto-toggle', 'Import');
  imp.type = 'button';
  imp.addEventListener('click', () => {
    const v = importArea.value.trim();
    if (v) {
      hooks.importSave(v);
      hide(); // close so the loaded game is visible
    }
  });
  const ng = el('button', 'auto-toggle', 'New game');
  ng.type = 'button';
  ng.addEventListener('click', () => {
    if (confirm('Start a new game? Your current run will be overwritten.')) {
      hooks.newGame();
      hide(); // close so the fresh game is visible
    }
  });
  // Export group: label + readonly area + the Export button.
  const expGroup = el('div', 'save-group');
  const expLabel = el('label', 'save-label', 'Export');
  expLabel.htmlFor = 'save-export';
  expGroup.append(expLabel, exportArea, exp);
  // Import group: label + paste area + the Import button.
  const impGroup = el('div', 'save-group');
  const impLabel = el('label', 'save-label', 'Import');
  impLabel.htmlFor = 'save-import';
  impGroup.append(impLabel, importArea, imp);
  savesSec.append(expGroup, impGroup, brushRule());
  // Danger row: start over.
  const dangerRow = el('div', 'save-group');
  dangerRow.append(el('span', 'save-label', 'Start over'), ng);
  savesSec.append(dangerRow);

  // ── about / credits / license / content (About tab) ──
  aboutSec.append(
    el(
      'p',
      'modal-sub',
      'A grounded, story-driven incremental RPG in mid-Edo rural Japan — rise through a declining samurai house, one earned rung at a time.',
    ),
  );
  aboutSec.append(brushRule());
  aboutSec.append(
    el(
      'p',
      'modal-meta',
      `Built agentically with Claude Code · ${__VERSION__} · build ${__BUILD_SHA__} · ${__BUILD_DATE__}`,
    ),
  );
  aboutSec.append(el('p', 'modal-meta', 'Code: MIT. Game content: all rights reserved.'));
  aboutSec.append(
    el('p', 'modal-meta', 'Content notes: mild thematic — child-disappearance, drowning, debt.'),
  );
  // FB-105 — deep-link to the raw CHANGELOG on GitHub (opens in a new tab); a raw-file link is fine per
  // the human's spec. The version's story is one click from the footer (FB-104 version → About → here).
  const changelogRow = el('p', 'modal-meta');
  const changelog = el('a', 'modal-link', 'Changelog') as HTMLAnchorElement;
  changelog.href = 'https://raw.githubusercontent.com/Raynos/kami-kakushi/main/CHANGELOG.md';
  changelog.target = '_blank';
  changelog.rel = 'noopener noreferrer';
  changelogRow.append(document.createTextNode('Version history: '), changelog);
  aboutSec.append(changelogRow);

  card.append(settingsSec, savesSec, aboutSec);
  showTab('about'); // default active tab — the human prefers opening on About (FB-33)

  scrim.append(card);
  return {
    modal: scrim,
    paint: paintPause,
    // FB-104 — an optional `tab` opens the modal straight on that sub-tab (the footer version opens it
    // on "about"); called with no arg (the gear button) it keeps whichever tab was last shown.
    open: (tab?: string) => {
      opener = (document.activeElement as HTMLElement) ?? null;
      if (typeof tab === 'string' && sections[tab]) showTab(tab);
      scrim.hidden = false;
      close.focus();
    },
  };
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
  seasonEndBtn.addEventListener('click', () => dispatch({ type: 'advance_season' }));
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
  stamina.title = 'Body 体 — work draws it down; a rest refills it. Rest better on a full belly.';
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
  const rungHeadTrigger = el('button', 'rung-head-trigger') as HTMLButtonElement;
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

  // FB-77 — sticky-bottom bookkeeping (declared before the log section so the scroll listener can
  // bind): the log auto-follows the newest line and STAYS pinned to the bottom as new lines arrive,
  // but leaves a reader who scrolled UP into history alone until they return to the foot.
  const LOG_STICK_THRESHOLD_PX = 24; // "at bottom" tolerance (sub-pixel scroll + a line's leading)
  let logPinnedToBottom = true;
  // FB-150 — while a programmatic SMOOTH glide to the foot is in flight, its
  // intermediate scroll positions must not read as "the reader scrolled up"
  // and unpin (that risk is why FB-77 originally chose the instant jump).
  let smoothScrollUntil = 0;

  const logSection = el('section', 'log');
  logSection.setAttribute('aria-live', 'polite');
  logSection.setAttribute('aria-label', 'Story log');
  // FB-363 — the head is a ROW: the title left, the story vn/all sub-toggle right
  // (the toggle lives in the story SECTION, not the filter bar — the tab row stays uniform).
  const logHead = el('div', 'log-head');
  logHead.append(el('h2', undefined, 'The house remembers'));
  logSection.append(logHead);
  const logLines = el('div', 'log-lines');
  logSection.append(logLines);
  // Track whether the reader is pinned to the foot (within tolerance). Our own programmatic pin
  // fires this too and re-confirms `true`, so there's no fight with the auto-follow.
  logLines.addEventListener('scroll', () => {
    const atFoot =
      logLines.scrollHeight - logLines.scrollTop - logLines.clientHeight <= LOG_STICK_THRESHOLD_PX;
    // FB-150 — mid-glide positions may only RE-pin, never unpin.
    if (!atFoot && performance.now() < smoothScrollUntil) return;
    logPinnedToBottom = atFoot;
  });
  // FB-168 — PHONE: the log is a collapsed one-line band; tapping the band
  // expands it to a near-full-screen sheet; tapping the sheet's header folds it
  // back (the demo's m-log-band). Desktop never enters this path.
  const mobileLogBand = window.matchMedia('(max-width: 920px)');
  logSection.addEventListener('click', (e) => {
    if (!mobileLogBand.matches) return;
    const t = e.target as HTMLElement;
    if (logSection.classList.contains('m-expanded')) {
      if (t.closest('.log-head h2')) logSection.classList.remove('m-expanded');
      return;
    }
    if (t.closest('button')) return;
    logSection.classList.add('m-expanded');
    logLines.scrollTop = logLines.scrollHeight; // re-pin to the newest on expand
  });
  // the bottom filter bar (FB-9) — filters which channels show; Story leads, default 'story'.
  const logFilterBar = el('div', 'log-filter-bar');
  const logFilterBtns = new Map<LogFilter, HTMLButtonElement>();
  // FB-176 — Now is NOT one of the channel filters: it's the fleeting-flavor scratch view.
  // It sits ALONE at the bar's left, visually apart from the six-tab channel group.
  const logFilterGroup = el('div', 'log-filter-group');
  // FB-320 — a small vn/all sub-toggle appears while Story is the active filter: `vn` keeps
  // only the scene lines (the MAIN story); `all` is the full story channel. FB-363 moved it
  // from beside the Story tab (it made the tab read double-width) into the log head's right.
  const storySubWrap = el('span', 'story-sub');
  storySubWrap.hidden = true;
  const storySubBtns = new Map<StorySub, HTMLButtonElement>();
  for (const sub of ['vn', 'all'] as const) {
    const sb = el('button', 'story-sub-btn', sub) as HTMLButtonElement;
    sb.type = 'button';
    sb.setAttribute(
      'aria-label',
      sub === 'vn' ? 'Show only the scene story lines' : 'Show all story lines',
    );
    sb.addEventListener('click', () => {
      if (storySub === sub) return;
      storySub = sub;
      setLogFilter('story', true); // repaint the story view's content in place
    });
    storySubBtns.set(sub, sb);
    storySubWrap.append(sb);
  }
  logHead.append(storySubWrap);
  for (const f of LOG_FILTERS) {
    const b = el('button', 'log-filter-tab', f.label) as HTMLButtonElement;
    b.type = 'button';
    b.setAttribute('aria-label', `Show ${f.label} log`);
    b.addEventListener('click', () => setLogFilter(f.id));
    logFilterBtns.set(f.id, b);
    if (f.id === 'now') {
      b.classList.add('tab-now');
      logFilterBar.prepend(b);
    } else {
      logFilterGroup.append(b);
    }
  }
  logFilterBar.append(logFilterGroup);
  // FB-74 — the per-log FONT stepper (A− / A+), tucked bottom-right of the filter bar. It scales ONLY
  // the log's reading text (a log-scoped `--log-scale` CSS var on the log section → `.log-lines`
  // font-size), leaving the FB-73 chrome density alone. The choice PERSISTS in localStorage (the
  // ui-prefs seam) and re-applies on every mount; the buttons disable at the min/max bounds.
  let logScale = loadLogScale();
  const logFontStepper = el('div', 'log-font-stepper');
  const logFontMinus = el('button', 'log-font-btn', 'A−') as HTMLButtonElement;
  logFontMinus.type = 'button';
  logFontMinus.setAttribute('aria-label', 'Smaller log text');
  const logFontPlus = el('button', 'log-font-btn', 'A+') as HTMLButtonElement;
  logFontPlus.type = 'button';
  logFontPlus.setAttribute('aria-label', 'Larger log text');
  const applyLogScale = (): void => {
    logSection.style.setProperty('--log-scale', String(logScale));
    logFontMinus.disabled = logScale <= LOG_SCALE_MIN;
    logFontPlus.disabled = logScale >= LOG_SCALE_MAX;
    const pctLabel = `Log text ${Math.round(logScale * 100)}%`;
    logFontMinus.title = pctLabel;
    logFontPlus.title = pctLabel;
  };
  logFontMinus.addEventListener('click', () => {
    logScale = saveLogScale(clampLogScale(logScale - LOG_SCALE_STEP));
    applyLogScale();
  });
  logFontPlus.addEventListener('click', () => {
    logScale = saveLogScale(clampLogScale(logScale + LOG_SCALE_STEP));
    applyLogScale();
  });
  logFontStepper.append(logFontMinus, logFontPlus);
  logFilterBar.append(logFontStepper);
  applyLogScale(); // re-apply the persisted scale on mount
  logSection.append(logFilterBar);

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
  // ── Phase 2 (FB-81) — the two big flash offenders go incremental. `actions` (the Work hero, rebuilt
  //    ~2×/s) and `combatPane` (a 6-block composite) are split into named sub-containers built ONCE;
  //    each keyed section is a reconcileList, each per-tick bit is patched in place. `null` ⇒ not
  //    yet built. metaRow/areaGroups/watchList/craftHost are their own flex-gap sub-containers (see
  //    the `.actions-group`/`.combat-group` CSS) so wrapping doesn't collapse the parent's gap;
  //    they toggle `hidden` when empty so an empty section leaves no phantom flex-gap (FB-72).
  let actionsRefs: {
    metaRow: HTMLElement;
    // storywave G4.9 — the place strip: the night-round post + the day-wage board.
    placeStrip: HTMLElement;
    nightRow: HTMLElement;
    nightBtn: HTMLButtonElement;
    nightBlurb: HTMLElement;
    wageRow: HTMLElement;
    wageBtn: HTMLButtonElement;
    // ADR-177 F3 — the sited works verb: work the commissioned project at its zone.
    worksRow: HTMLElement;
    worksBtn: HTMLButtonElement;
    // ADR-164/ADR-197 — the sickroom mend rows: paid treat (mon-only) + the free pallet day.
    treatRow: HTMLElement;
    treatBtn: HTMLButtonElement;
    restSickRow: HTMLElement;
    restSickBtn: HTMLButtonElement;
    areaGroups: HTMLElement;
    noWork: HTMLElement;
    // (FB-343/FB-369 — cook + eat-rice left for the Character Body card; see characterBodyRefs.)
  } | null = null;
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
  const versionBtn = el('button', 'foot-meta foot-version', __VERSION__) as HTMLButtonElement;
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
    __DEV_TOOLS__ && dev ? dev.subColdOpen('lede', COLD_OPEN.lede) : COLD_OPEN.lede;
  const cardCta = (): string =>
    __DEV_TOOLS__ && dev ? dev.subColdOpen('cta', COLD_OPEN.cta) : COLD_OPEN.cta;
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
  const coRestore = el('button', 'coldopen-restore', 'Returning? Restore a saved game');
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
  let lastKey = -1;
  // F127/FB-165 — key → conversation partner for chat lines that OPEN a group
  // (the "— with X —" kicker renders inside that line). Derived PURELY from the
  // entries list (recomputed in renderLog), so a player's opening question wears
  // the kicker via lookahead to the NPC's reply — never out of order.
  let chatKickers = new Map<number, string>();
  // FB-400 — key → partner for EVERY chat line (not just openers): the chat 幕-card
  // grouping needs each line's conversation identity, recomputed with the kickers.
  let chatPartners = new Map<number, string>();
  let chatKickersSeq = -1;
  let logFilter: LogFilter = 'story';
  // HD-41 — the story-take epoch the log was last painted at. The Progress objective lines are
  // READ from the registry per paint, so flipping a take in DEV → Story must repaint the view
  // (the log is otherwise append-only). DEV-only: prod never bumps an epoch.
  let logStoryEpoch = -1;
  // FB-320 — the Story tab's sub-view: 'vn' = only the scene (context-carrying) lines, the
  // MAIN story; 'all' = the full story channel (default — today's view). Session-local.
  let storySub: StorySub = 'all';
  // Does `e` show under the CURRENT view? (the one place the FB-320 sub-view composes
  // with the channel filter — every current-filter visibility check routes through here.)
  const lineVisible = (e: LogEntry): boolean =>
    logFilterMatches(
      e.channel,
      logFilter,
      e.ephemeral === true,
      e.chat === true,
      isEarnedLine(e.contentKey),
    ) &&
    (logFilter !== 'story' || storySubMatches(storySub, e.context !== undefined));
  // FB-20 — per-channel "highest key the reader has seen"; a tab whose channel has entries
  // beyond its seen-mark (that arrived while another tab was active) shows an unread dot.
  const logSeen: Record<LogFilter, number> = {
    story: -1,
    progression: -1,
    chat: -1,
    combat: -1,
    work: -1,
    all: -1,
    now: -1,
  };
  // FB-59 — one-shot: on the first awake log render the loaded entries are HISTORY (already seen),
  // so we seed every channel's `logSeen` to its max key. Unread dots then fire ONLY for entries
  // that arrive DURING the session, never for a save's back-history on page load / refresh.
  let logSeenSeeded = false;
  // FB-53/FB-115 — the "Now" (ephemeral) view's wall-clock state (render-only; the pure core never times
  // this). `nowSeen` stamps each ephemeral entry's first-OBSERVED Date.now() (keyed by entry key).
  // FB-115: an entry is stamped the moment the renderer first SEES it — regardless of the active view —
  // and a single light interval ages the stamps out on wall time whether or not Now is showing, so a
  // fleeting line clears on schedule (open Now later → already gone, not a backlog). The interval
  // ALSO drives the DOM fade/collapse while Now is the active view. All state is cleared on reset.
  const nowSeen = new Map<number, number>();
  // FB-115 — the high-water key already stamped; keys are monotonic (log.seq), so a stamp aged out of
  // `nowSeen` is NEVER re-created fresh when it's still present in the (permanent) log ring.
  let lastEphStampKey = -1;
  // FB-325 — the ×N count already stamped for `lastEphStampKey`: a coalesce bump past it
  // re-stamps (new text re-lights the lamp + restarts that line's fade clock).
  let lastEphStampCount = 0;
  // F58b — pending height-collapse timers (one per expiring Now line); tracked so a reset tears them
  // all down (leak-free, per the FB-53 discipline).
  const nowCollapseTimers = new Set<number>();
  let nowInterval: number | undefined;
  let nowEmptyEl: HTMLElement | undefined;
  // track the last painted entry so a coalesced ×N bump (same key, higher count) repaints
  // the existing DOM line in place rather than appending a duplicate.
  let lastPaintedKey = -1;
  let lastPaintedCount = 0;
  // the last log.seq we painted — drops back when the state is replaced (new game / import),
  // which is how we detect a reset and clear the stale painted log (else old lines linger).
  let lastSeq = 0;
  // staggered log reveal: new lines cascade in one-by-one (text-adventure feel)
  const LOG_STAGGER_MS = 240;
  // FB-160/FB-161 — the CORE log history is unbounded (durable lines never evict);
  // the RENDERER paints a window: at most this many newest lines live in the DOM
  // (append-trim + the load/tab-switch repaint slice). Scroll-back past the window
  // is future polish (lazy backfill), per the human's call — never data loss.
  const LOG_DOM_MAX = 300;
  const revealQueue: LogEntry[] = [];
  let revealTimer: number | undefined;
  // P2 — GBA-style character-by-character typewriter for STORY lines (narration /
  // voiced dialogue) only. ~32ms/char reads deliberately; combat/reward/system spam
  // keeps the instant append. `typeTimer` is the in-flight per-char tick (cancelled on
  // reset/filter-clear like `revealTimer`); `finishTypeNow` finalizes the current line
  // instantly when the cascade has to catch up (the >12 flush valve).
  // DEV-only QA affordance (`?instanttext=1`) — zero the narrative pacing so the
  // e2e journey lane isn't clocked by the typewriter (the intro test alone paid
  // ~25s of cadence). Player-invisible: the ternaries fold to the literals in a
  // prod build (`import.meta.env.DEV` is false), same strip path as `?fixture=`.
  const QA_INSTANT_TEXT =
    import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('instanttext');
  const TYPE_MS_PER_CHAR = QA_INSTANT_TEXT ? 0 : TYPE_CADENCE_MS;
  const TYPE_NEXT_BEAT_MS = QA_INSTANT_TEXT ? 0 : 180; // pause after a typed line before the next cascades in
  // FB-86 — the intro typewriter AUTO-ADVANCES: after a line finishes typing it holds for this beat,
  // then the next line starts on its own (no click needed). A click only ever SPEEDS this up — it
  // completes an in-flight line, or skips the remaining hold — it never pauses the sequence. Tunable.
  const INTRO_LINE_ADVANCE_MS = QA_INSTANT_TEXT ? 0 : 2800; // FB-271 — the human read 2.0s as "scrolls too fast"
  // FB-118 — when the human CLICKS to complete a line (actively reading through), the next line starts
  // on a much shorter beat than the atmospheric auto-hold above; clicking should feel snappy.
  const INTRO_CLICK_ADVANCE_MS = QA_INSTANT_TEXT ? 0 : 450;
  let typeTimer: number | undefined;
  let finishTypeNow: (() => void) | undefined;
  // FB-27 — a transient "fresh entries" divider dropped between history + new lines; self-fades.
  let freshDivider: HTMLElement | undefined;
  let freshDividerTimer: number | undefined;

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
      if (c.childElementCount > 0 || (c.textContent ?? '').trim() !== '') return true;
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
      SKILLS.some((def) => skillVisible(state, def.id) || isUnlocked(state, `skill-${def.id}`));
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
        return unlockedSurfaces(state).filter((id) => id.startsWith('room-')).length >= 2;
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
    const show = isUnlocked(state, 'panel-rung-ladder') || hasFlag(state, 'raked');
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
    if (rungHeadTrigger.title !== triggerTitle) rungHeadTrigger.title = triggerTitle;
    // the hover-card detail (FB-106): the current rung, the meter numbers, the next rung.
    setText(rungHeadCardNow, `${rank.title} · ${rank.kanji}`);
    setText(
      rungHeadCardMeter,
      prog.ready ? 'Ready to advance — answer the summons.' : `Estate service · ${prog.percent}%`,
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

  // ── the interactive intro VN scene (ADR-104 / FB-47) — the dialogue TREE: meet → ask → decide ──
  // A full-screen washi surface mounted on `root` that HIDES the shell. The scene reads the SCENE
  // TREE (`introSceneAt`): a nameplate + a LEFT transcript column (greeting + every asked Q/A + the
  // chosen reply) where each fragment types on the GBA typewriter as it FIRST appears, and a RIGHT
  // interactive column gated ask → decide → outcome. The model is APPEND-ONLY (FB-81): the shell is
  // built ONCE per scene, then each state change appends only the NEW transcript lines and mutates
  // the panel in place — never a wholesale teardown+rebuild (that flashed, wiped the typewriter, and
  // resized the card). Reduced-motion / test env → instant (no typing). The MC's question + NPC's
  // answer are also emitted to the LOG by the core; the scene reflects them from the tree, not the log.
  function introReduced(): boolean {
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('reduced-motion')
    );
  }
  const introInstant = (): boolean => introReduced() || import.meta.env.MODE === 'test';

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
  function buildFreshDividerNode(): HTMLElement {
    const d = el('div', 'log-fresh-divider');
    d.append(el('span', undefined, '新 · new'));
    return d;
  }
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
          suppressRankUpOverlay = true; // the modal already held the ceremony
          slopGateArmed = true; // re-arm: covers a run reloaded mid-beat (the trigger click was last session)
          dispatch({ type: 'choose_rung_option', optionId: optId });
        });
        cer.append(cont);
        rungUp.remove();
        // FB-159 — the promotion is HUGE: the ceremony overlays the WHOLE card,
        // seal + flavour + Continue centred (not a strip in the side panel).
        const card = introScene?.querySelector('.vn-card');
        (card ?? wrap).append(cer);
        hooks.sfx.rankUp(); // the temple bell rings AT the ceremony, not after the modal
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

  // build ONE labour row (verb + auto-toggle + lock-hint, all present); patch toggles which show +
  // the disabled/on state in place. The auto-toggle NODE survives every re-render (FB-81) so the
  // button the player is watching never loses focus / re-creates mid-auto-run.
  function buildLabourRow(o: LabourOption): HTMLElement {
    const row = el('div', 'labour-row');
    const btn = el('button', 'verb', o.activity.label);
    btn.type = 'button';
    stampAct(btn, 'do_activity', { activityId: o.activity.id });
    btn.addEventListener('click', () =>
      dispatch({ type: 'do_activity', activityId: o.activity.id }),
    );
    const auto = el('button', 'auto-toggle');
    auto.type = 'button';
    auto.addEventListener('click', () => {
      const on = lastState?.autoActivity === o.activity.id;
      dispatch({ type: 'set_auto', activityId: on ? null : o.activity.id });
    });
    const lock = el('span', 'lock-hint');
    row.append(btn, auto, lock);
    return row;
  }
  // FB-346 — every action button says on hover what it needs and produces (ONE line, from the
  // SAME selectors/constants the reducer pays — AC-6, like the cook/eat titles). Ad-hoc titles
  // on two buttons read as an inconsistency ("this button has alt text but the others don't").
  function labourTitle(state: GameState, o: LabourOption): string {
    const f = activityForecast(state, o.activity);
    const gains = Object.entries(f.gained)
      .map(([res, n]) => `+${n} ${res === 'rice' ? 'shō (kura)' : res}`)
      .join(' · ');
    return `${gains ? `${gains} · ` : ''}+${f.xp} ${o.activity.skill} xp · −${o.activity.satietyCost} body`;
  }

  function patchLabourRow(row: HTMLElement, o: LabourOption, state: GameState): void {
    const btn = row.children[0] as HTMLButtonElement;
    const auto = row.children[1] as HTMLButtonElement;
    const lock = row.children[2] as HTMLElement;
    setDisabled(btn, !o.available);
    // the disabled reason wins; an available act reads its cost/effect line (FB-346).
    const btnTitle = !o.available && o.reason ? o.reason : labourTitle(state, o);
    if (btn.title !== btnTitle) btn.title = btnTitle;
    if (o.available) {
      toggle(auto, true);
      toggle(lock, false);
      const on = state.autoActivity === o.activity.id;
      const paused = on && hooks.isPaused();
      setClass(auto, 'on', on);
      setClass(auto, 'waiting', paused);
      setText(auto, on ? (paused ? AUTO_PAUSED_LABEL : '■ stop') : '▶ auto');
      setTitle(auto, paused ? AUTO_PAUSED_REASON : '');
      const pressed = String(on);
      if (auto.getAttribute('aria-pressed') !== pressed) auto.setAttribute('aria-pressed', pressed);
    } else {
      // ADR-148 — an ARMED auto never vanishes with its activity: it visibly idles
      // ("pause, resume when legal") and re-fires via the heartbeat once legal again.
      const on = state.autoActivity === o.activity.id;
      toggle(auto, on);
      if (on) {
        setClass(auto, 'on', true);
        setClass(auto, 'waiting', true);
        setText(auto, '⏸ waiting');
        if (o.reason && auto.title !== o.reason) auto.title = o.reason;
      }
      toggle(lock, !!o.reason);
      if (o.reason) setText(lock, o.reason);
    }
  }

  function renderActions(state: GameState): void {
    const onZone = activeTab === 'work';
    // FB-410 — the zone banner: patch the node's kanji + name + standing line in place (P4/TST2 —
    // the head never rebuilds under the player). (Guarded lookup — some test fixtures stand on
    // non-map ground; the banner just hides.)
    const here = MAP_NODE_IDS.has(state.location) ? getNode(state.location) : null;
    if (here) {
      if (zoneSeal.textContent !== (here.kanji ?? '')) setText(zoneSeal, here.kanji ?? '');
      toggle(zoneSeal, Boolean(here.kanji));
      if (zoneName.textContent !== here.label) setText(zoneName, here.label);
      // the standing line — the SAME seasonal read the Map card resolves (one source), so a
      // season turn re-inks it here too. The DEV story switcher live-swaps it by key, as there.
      const sb = nodeSeasonalBlurb(here, season(state));
      const lineText =
        __DEV_TOOLS__ && dev && sb.key !== undefined ? dev.subFlavor(sb.key, sb.text) : sb.text;
      setText(zoneLine, lineText);
    }
    toggle(zoneLine, here !== null && zoneLine.textContent !== '');
    toggle(zoneBanner, onZone && here !== null && hasFlag(state, 'awake'));
    toggle(actions, onZone);
    if (!onZone) return;

    // (the interactive intro no longer renders here — while it's live the shell is hidden and the
    // full-screen VN scene owns the screen; render() returns before renderActions is ever reached.)

    // build the section skeleton ONCE (FB-81): named sub-containers in the same order the old wholesale
    // build produced, each patched/reconciled in place after. `.actions-group` gives the reconciled
    // sections the parent's flex-gap so wrapping doesn't collapse the button stack.
    if (!actionsRefs) {
      const metaRow = el('div', 'actions-group');
      // storywave G4.9 — the PLACE strip: the standing what-you-do-here beats that aren't plain
      // labour — the night-round post at the gate (begin_night_round) and the day-wage board
      // (collect_wage). The scripted wolf-box is GONE (G4.3 deleted `verb-face-wolf`; the wolf is
      // now the night round's `survive` terminal stage). One home for place beats (TST1).
      const placeStrip = el('div', 'place-strip');
      // (a) the night-round post — post the grain-watch at the gate (bible R3). While a round is
      //     live the app loop resolves its stages; the status line reads the current stage (TST4).
      const nightRow = el('div', 'labour-row place-night');
      const nightBtn = el('button', 'verb primary');
      nightBtn.type = 'button';
      nightBtn.append(
        el('span', 'emoji', '🏮'),
        document.createTextNode(' Post the night watch 夜廻'),
      );
      // FB-346 — say what posting means before the player commits to a night of stages.
      nightBtn.title = 'Stand the grain-watch through the night stages — it can end in a fight.';
      nightBtn.addEventListener('click', () =>
        // C4.8 — the first round (the quest, wolf climax) plays ONCE; after the wolf is
        // survived the post serves the repeatable grain-watch (no scripted wolf replay —
        // it returns in T1, locked canon).
        dispatch({
          type: 'begin_night_round',
          roundId: hasFlag(state, 'wolf-survived-not-won') ? 'grain-watch' : 'first-night-round',
        }),
      );
      const nightBlurb = el('p', 'area-blurb');
      nightRow.append(nightBtn);
      // (b) the wage board — collect the accrued day-wage (R5+, MON lane / ADR-163).
      const wageRow = el('div', 'labour-row place-wage');
      const wageBtn = el('button', 'verb');
      wageBtn.type = 'button';
      wageBtn.title =
        'The day-book accrues your wage 給 by the worked day — collect what stands owed.';
      wageBtn.addEventListener('click', () => dispatch({ type: 'collect_wage' }));
      wageRow.append(wageBtn);
      // (c) ADR-177 F3 — the works site: one sited act of the commissioned project.
      //     Same place-beat idiom as the night post; shown only AT a work zone (TST3).
      const worksRow = el('div', 'labour-row place-works');
      const worksBtn = el('button', 'verb primary');
      worksBtn.type = 'button';
      stampAct(worksBtn, 'work_project');
      worksBtn.addEventListener('click', () => dispatch({ type: 'work_project' }));
      worksRow.append(worksBtn);
      // (d) ADR-164/ADR-197 — the sickroom mend lane: Sōan's paid treatment (mon-only — the
      //     row HIDES without the coin, ADR-197) + the free pallet-day rest. Same place-beat
      //     idiom; shown only AT the sickroom (TST3), gated + priced via the SAME selectors
      //     the reducer spends (AC-6).
      const treatRow = el('div', 'labour-row place-treat');
      const treatBtn = el('button', 'verb primary');
      treatBtn.type = 'button';
      stampAct(treatBtn, 'treat');
      treatBtn.addEventListener('click', () => dispatch({ type: 'treat' }));
      treatRow.append(treatBtn);
      const restSickRow = el('div', 'labour-row place-rest-sickroom');
      const restSickBtn = el('button', 'verb');
      restSickBtn.type = 'button';
      stampAct(restSickBtn, 'rest_sickroom');
      restSickBtn.addEventListener('click', () => dispatch({ type: 'rest_sickroom' }));
      restSickRow.append(restSickBtn);
      placeStrip.append(nightBlurb, nightRow, wageRow, worksRow, treatRow, restSickRow);
      const areaGroups = el('div', 'actions-group');
      const noWork = el(
        'p',
        'area-blurb',
        'No work to be had where you stand — open the Map 地図 tab to walk on.',
      );
      // FB-107 (ADR-112) — the "Walk on 道" nav strip is GONE from Work: the Map tab is navigation's
      // SOLE home. Labour is all the Work tab holds now. FB-343/FB-369 — the food verbs
      // (cook · eat rice) left too: they live on the Character 己 tab's Body card.
      actions.append(metaRow, placeStrip, areaGroups, noWork);
      actionsRefs = {
        metaRow,
        placeStrip,
        nightRow,
        nightBtn,
        nightBlurb,
        wageRow,
        wageBtn,
        worksRow,
        worksBtn,
        treatRow,
        treatBtn,
        restSickRow,
        restSickBtn,
        areaGroups,
        noWork,
      };
    }
    const r = actionsRefs;

    // meta verbs (rake / rest). Rake gets an auto-repeat toggle (revealed after a few manual rakes so
    // the first ones still land as juice) — the R0 cold-open is ~550 rakes and must not be a blind
    // click-grind (fun-factor "first-5-min hook"; every later labour already has an auto-toggle).
    reconcileList(r.metaRow, availableActions(state), {
      key: (a) => a,
      build: (a) => {
        if (a === 'rake_rice') {
          const row = el('div', 'labour-row');
          const btn = el('button', 'verb', META_LABELS.rake_rice);
          btn.type = 'button';
          stampAct(btn, 'rake_rice');
          btn.addEventListener('click', () => dispatch({ type: 'rake_rice' }));
          const auto = el('button', 'auto-toggle');
          auto.type = 'button';
          auto.addEventListener('click', () =>
            dispatch({ type: 'set_auto_rake', on: !lastState?.autoRake }),
          );
          // FB-368 — the rake row carries the labour-row lock-hint idiom too: when the
          // rake refuses, the why reads inline, not only on hover (TST4).
          const lock = el('span', 'lock-hint');
          row.append(btn, auto, lock);
          return row;
        }
        const btn = el('button', a === 'open_eyes' ? 'verb primary' : 'verb', META_LABELS[a]);
        btn.type = 'button';
        stampAct(btn, a);
        btn.addEventListener('click', () => dispatch({ type: a } as Intent));
        return btn;
      },
      patch: (node, a) => {
        // FB-346 — rest carries its effect line too. restRefill is the SAME selector the reducer
        // grants (AC-6/ADR-178), so a hungry rest advertises its true, degraded number.
        if (a === 'rest') {
          const btn = node as HTMLButtonElement;
          const hungry = restQuality(state) < 0.99;
          const t = `+${restRefill(state)} body — a free breather${hungry ? ' (poor on an empty belly — eat to rest well)' : ''}.`;
          if (btn.title !== t) btn.title = t;
          return;
        }
        // ADR-187 — the slept day reads its FULL price before it is taken (AC-6): sleepForecast is
        // the SAME selector the reducer spends, so the hover can never flatter the button. A day-skip
        // is instant and irreversible, so legibility IS the safety (there is no bar to think during).
        if (a === 'sleep') {
          const btn = node as HTMLButtonElement;
          const f = sleepForecast(state);
          const t =
            `Wake at dawn — the day goes on without you. ` +
            `The house eats ${f.riceDrawn} shō from the kura · −${Math.round(f.bellyLost)} belly ` +
            `(you sleep through the pot) · no body back — sleeping is not resting.`;
          if (btn.title !== t) btn.title = t;
          return;
        }
        if (a !== 'rake_rice') return;
        // FB-265 — the rake refuses at empty satiety (same predicate as the reducer, AC-6):
        // disable + say why, so the player is steered to "Rest a moment" instead of a dead grind.
        // FB-324 — and the spill is FINITE: at RAKE_CAP the rake is done for good; same shared
        // predicate (rakeExhausted) as the reducer refusal, with its own why.
        const rakeBtn = node.querySelector<HTMLButtonElement>('.verb')!;
        const exhausted = rakeExhausted(state);
        const affordable = canAffordAct(state);
        setDisabled(rakeBtn, exhausted || !affordable);
        const rakeTitle = exhausted
          ? RAKE_DONE_REASON
          : affordable
            ? // FB-346 — an able rake reads its cost/effect line, not a blank hover.
              `+${balance.RICE_PER_RAKE} shō (kura) · −${balance.SATIETY_PER_ACT} body`
            : OUT_OF_STRENGTH_REASON;
        if (rakeBtn.title !== rakeTitle) rakeBtn.title = rakeTitle;
        // FB-367/FB-368 — the rake row speaks the labour-row idioms (patchLabourRow /
        // ADR-148): exhaustion is PERMANENT, so the auto-toggle hides for good (a
        // "waiting" idle would lie); merely out-of-strength keeps an ARMED auto visible
        // as "⏸ waiting" (it re-fires once legal); and the refusal reason reads inline
        // via the lock-hint, off the SAME predicates the title already uses (AC-6).
        const auto = node.querySelector<HTMLButtonElement>('.auto-toggle')!;
        const lock = node.querySelector<HTMLElement>('.lock-hint')!;
        const on = state.autoRake;
        // A PAUSED game outranks both reads: an armed auto is standing still because the loop is
        // stopped, not because the belly is empty — say the true reason (TST4).
        const paused = on && hooks.isPaused();
        if (exhausted) {
          toggle(auto, false);
        } else if (!affordable || paused) {
          toggle(auto, on);
          if (on) {
            setClass(auto, 'on', true);
            setClass(auto, 'waiting', true);
            setText(auto, paused ? AUTO_PAUSED_LABEL : '⏸ waiting');
            setTitle(auto, paused ? AUTO_PAUSED_REASON : OUT_OF_STRENGTH_REASON);
          }
        } else {
          toggle(auto, rakeCount(state) >= RAKE_AUTO_REVEAL_COUNT);
          setClass(auto, 'on', on);
          setClass(auto, 'waiting', false);
          setText(auto, on ? '■ stop' : '▶ auto');
          setTitle(auto, '');
          const pressed = String(on);
          if (auto.getAttribute('aria-pressed') !== pressed)
            auto.setAttribute('aria-pressed', pressed);
        }
        const reason = exhausted ? RAKE_DONE_REASON : affordable ? '' : OUT_OF_STRENGTH_REASON;
        toggle(lock, !!reason);
        if (reason) setText(lock, reason);
      },
      order: true,
    });

    // storywave G4.9 — the PLACE strip: the night-round post + the day-wage board.
    // (a) the grain-watch night round (bible R3): posted at the gate. Show the post button once the
    //     MC has reached R3 (`rank-r3`, latched — a rung check dies at R4) and hasn't yet survived
    //     the round; at the gate it's the live post, elsewhere a standing summons to walk to the
    //     gate. While a round is LIVE the app loop resolves its stages — the blurb reads the stage.
    const roundLive = state.roundState !== null;
    const nightPending =
      hasFlag(state, 'rank-r3') && !hasFlag(state, 'wolf-survived-not-won') && !roundLive;
    const atGate = state.location === 'gate';
    toggle(r.nightRow, nightPending && atGate);
    if (roundLive) {
      const def = nightRoundById(state.roundState!.roundId);
      const stage = def?.stages[state.roundState!.stage];
      const foe = stage ? getMob(stage.foe).label : 'the dark';
      setText(r.nightBlurb, `夜廻 The watch is walking — you face ${foe} at the grain store.`);
    } else if (nightPending && !atGate) {
      setText(
        r.nightBlurb,
        'The grain-watch waits to be walked — open the Map 地図 tab and go to the gate (門) to post it.',
      );
    }
    toggle(r.nightBlurb, roundLive || (nightPending && !atGate));
    // (b) the day-wage board (R5+, MON lane / ADR-163): collect the accrued wage. Show the button once
    //     waged; enabled only when a day's wage stands unclaimed (TST4 — the amount is legible).
    const waged = isWaged(state.rung);
    const owed = state.wageDaysAccrued;
    toggle(r.wageRow, waged);
    if (waged) {
      setText(
        r.wageBtn,
        owed > 0
          ? `Collect your wage 給 (${owed * DAY_WAGE_MON} mon)`
          : 'Wage board 給 — nothing owed',
      );
      setDisabled(r.wageBtn, owed <= 0);
    }
    // (c) ADR-177 F3 — the works site verb: visible only where the reducer would accept
    //     it (canWorkProject — AC-6: shown == enforced). The label carries the progress.
    const canWork = canWorkProject(state);
    toggle(r.worksRow, canWork);
    if (canWork) {
      const def = ESTATE_STAGES.find((d) => d.stage === state.estateCommission);
      if (def) {
        setText(r.worksBtn, `Work the repairs 普請 (${state.estateWorkDone} / ${def.workActs})`);
        setDisabled(r.worksBtn, state.character.satiety < balance.WORKS_ACT_SATIETY);
        r.worksBtn.title =
          state.character.satiety < balance.WORKS_ACT_SATIETY
            ? 'Too spent — rest or eat before working the site.'
            : `One act of the commissioned work — ${stageLabel(def)}.`;
      }
    }
    // (d) ADR-164/ADR-197 — the sickroom mend rows: shown exactly when the reducer would
    //     accept them (canTreat / canRestSickroom — AC-6: shown == enforced). The mon-short
    //     treat HIDES (ADR-197, never shown-disabled), so the broke player reads one honest
    //     lane: the free pallet day.
    const treatable = canTreat(state);
    toggle(r.treatRow, treatable);
    if (treatable) {
      const tf = treatForecast(state);
      setText(r.treatBtn, `Take Sōan's treatment 手当 (−${tf.cost} mon · +${tf.hpGain} HP)`);
      r.treatBtn.title = 'Sōan cleans and binds the hurt — paid speed, the coin counted once.';
    }
    const restable = canRestSickroom(state);
    toggle(r.restSickRow, restable);
    if (restable) {
      const rf = restSickroomForecast(state);
      setText(r.restSickBtn, `Rest on the pallet 臥 (the day is spent · +${rf.hpGain} HP)`);
      r.restSickBtn.title = 'Give the day to the pallet — free and slow; you wake at dawn.';
    }
    toggle(r.placeStrip, nightPending || roundLive || waged || treatable || restable);

    // labour activities, grouped by estate room (each: do-once + auto-repeat toggle). Outer keyed
    // list over the areas that HAVE labour here; each group's rows are an inner keyed list.
    // FB-410 (HR-32) — the group carries NO head/blurb of its own any more: labours are spatial
    // (availableLabours filters to state.location), so the ONE area here is the zone the banner
    // already names, and its standing line is the banner's. Two names for one ground read as
    // chrome; the group is now just the reconcile host for its rows.
    const labours = availableLabours(state);
    const areasWithLabour = AREAS.filter((area) =>
      labours.some((o) => o.activity.area === area.id),
    );
    toggle(r.areaGroups, areasWithLabour.length > 0);
    reconcileList(r.areaGroups, areasWithLabour, {
      key: (area) => area.id,
      build: () => el('div', 'area-group'),
      patch: (group, area) => {
        // reconcile the labour rows DIRECTLY into the group (its head/blurb are foreign siblings the
        // reconcile never touches; the activity set here is stable so no reorder is needed).
        reconcileList(
          group,
          labours.filter((o) => o.activity.area === area.id),
          {
            key: (o) => o.activity.id,
            build: (o) => buildLabourRow(o),
            patch: (row, o) => patchLabourRow(row, o, state),
          },
        );
      },
      order: true,
    });

    // spatial (v0.3.1 Step 5): a node with no labour (and no wolf-beat prompting here) points the
    // player at the Map tab to walk on.
    toggle(
      r.noWork,
      labours.length === 0 &&
        !nightPending &&
        !roundLive &&
        hasFlag(state, 'awake') &&
        isUnlocked(state, 'room-gate'),
    );

    // (FB-107 — no "Walk on" strip here anymore: navigation lives ONLY on the Map tab.)
    // (FB-343/FB-369 — no food verbs here anymore either: cook + eat-rice live on the
    //  Character 己 tab's Body card, beside the vitals they feed.)
  }

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
    characterBody,
    characterTrain,
    characterBestiary,
    skillsPane,
    dispatch,
    dev,
    activeTab: () => activeTab,
  });

  // increases-only number-pop (juice). prev===undefined (load / import / new game) never
  // pops — popValue's guard avoids a false flash on the first paint of a loaded save.
  function popValue(node: HTMLElement, cur: number, before: number | undefined): void {
    if (before === undefined || cur <= before) return;
    node.classList.remove('pop');
    void node.offsetWidth; // reflow so the animation restarts on a fresh increment
    node.classList.add('pop');
  }

  function renderVitals(state: GameState, prev: GameState | null): void {
    // (FB-166/FB-171 — rice AND coin left the vitals strip; their readouts live on
    // the Inventory 蔵 tab's kura carried/stored rows. The coin element stays built
    // and updated for element-contract stability but never mounts.)
    coin.wrap.hidden = !isUnlocked(state, 'readout-coin');
    if (!coin.wrap.hidden) {
      const v = state.resources.coin ?? 0;
      coin.value.textContent = formatCoin(v);
      popValue(coin.value, v, prev?.resources.coin);
    }

    clock.hidden = !isUnlocked(state, 'readout-clock');
    if (!clock.hidden) {
      const s = SEASON_TAG[season(state)];
      clockTag.lang = 'ja';
      clockTag.textContent = '';
      clockTag.append(
        el('span', 'emoji', s.emoji),
        document.createTextNode(` ${s.kanji} ${s.name}`),
      );
      // FB-333 — the clock is season + weekday ONLY (no year, no day counter): the player
      // lives by the week (market days pull the wheel), not by an absolute count.
      const dw = DAY_OF_WEEK_NAMES[dayOfWeek(state.clock.day)]!;
      clockDay.lang = 'ja';
      setText(clockDay, `${dw.kanji} ${dw.name}`);
      // storywave G1/G4.9 — the manual season wheel is the player's from R2 on (before R2 the
      // season is day-of-week only). Once shown, ending the season is always available (instant —
      // the seasonal judge + spoilage + pool refill run on the turn, ADR-153).
      const rungN = Number.parseInt(state.rung.replace(/^R/, ''), 10);
      const canTurnSeason = Number.isFinite(rungN) && rungN >= 2;
      seasonEndBtn.hidden = !canTurnSeason;
      if (canTurnSeason) setText(seasonEndBtn, `End the ${SEASON_TAG[season(state)].name} 季`);
    } else {
      seasonEndBtn.hidden = true;
    }

    stamina.hidden = !isUnlocked(state, 'readout-stamina');
    if (!stamina.hidden) {
      const max = satietyMax(state);
      const frac = state.character.satiety / max;
      staminaFill.style.width = `${Math.round(frac * 100)}%`;
      staminaBar.classList.toggle('low', staminaRate(state) < 0.99);
      // FB-387 (revising FB-335) — bars only in the header; the exact number lives on
      // the hover title. The unit reads "body" everywhere (FB-334), never "satiety".
      setText(staminaNum, `${Math.round(state.character.satiety)}/${Math.round(max)}`);
      stamina.title = `Body 体 ${Math.round(state.character.satiety)}/${Math.round(max)} — work draws it down; a rest refills it. Rest better on a full belly.`;
    }

    // The belly (ADR-178) — reveals WITH body (the two-bar group FB-345 asked for). The low flag
    // fires exactly when its teeth bite (restQuality < 1 — AC-6: the same selector the rest
    // reducer spends), so an amber-flagged belly always MEANS "your rests are degraded".
    belly.hidden = !isUnlocked(state, 'readout-stamina');
    if (!belly.hidden) {
      const max = hungerMax(state);
      const frac = max > 0 ? state.character.hunger / max : 0;
      bellyFill.style.width = `${Math.round(frac * 100)}%`;
      bellyBar.classList.toggle('low', restQuality(state) < 0.99);
      // FB-387 — bars only (the FB-335 numeral moved to the hover title); the unit reads
      // "belly" everywhere (FB-334's law), never the internal field name.
      setText(bellyNum, `${Math.round(state.character.hunger)}/${Math.round(max)}`);
      belly.title = `Belly 腹 ${Math.round(state.character.hunger)}/${Math.round(max)} — the day draws it down; the house eats from the kura, a meal fills it. A hungry rest restores less.`;
    }

    // HP — revealed the moment combat first matters (the R2 wolf beat), then always visible. Shows an
    // exact number (1 HP vs a full bar is life-or-death, ADR-076) + a bar that flags `low` when ≤ 30%.
    // storywave G4.3 — `verb-face-wolf` is deleted; HP reveals with combat (tab-combat).
    health.hidden = !isUnlocked(state, 'tab-combat');
    if (!health.hidden) {
      const max = hpMax(state);
      const hp = state.character.hp;
      const frac = max > 0 ? hp / max : 0;
      healthFill.style.width = `${Math.round(frac * 100)}%`;
      healthBar.classList.toggle('low', frac <= 0.3);
      healthNum.textContent = `${hp}/${max}`;
    }

    wood.wrap.hidden = !isUnlocked(state, 'row-wood');
    if (!wood.wrap.hidden) {
      const v = state.resources.wood ?? 0;
      wood.value.textContent = formatKMB(v);
      popValue(wood.value, v, prev?.resources.wood);
    }
    sansai.wrap.hidden = !isUnlocked(state, 'row-sansai');
    if (!sansai.wrap.hidden) {
      const v = state.resources.sansai ?? 0;
      sansai.value.textContent = formatKMB(v);
      popValue(sansai.value, v, prev?.resources.sansai);
    }
    void RESOURCE_LABEL;
  }

  function reduceMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  // Split narration text into narrator prose + quoted-speech runs, wrapping each "…" (straight
  // or curly) in a .speech span so a spoken line reads as a distinct voice (FB-23). Non-narration
  // channels paint as plain text.
  function appendNarration(line: HTMLElement, text: string): void {
    const re = /"[^"]*"|[“][^”]*[”]/g;
    // FB-228 — a quote embedded in narration ('"…," Genemon says') is that character
    // SPEAKING: tint it with their voice colour when the speaker is unambiguous.
    const quoteColor = inferQuoteVoiceColor(text);
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) line.append(document.createTextNode(text.slice(last, m.index)));
      const span = el('span', 'speech', m[0]);
      if (quoteColor) span.style.color = quoteColor;
      line.append(span);
      last = m.index + m[0].length;
    }
    if (last < text.length) line.append(document.createTextNode(text.slice(last)));
  }
  // FB-228 — who speaks the quotes inside a narrator line? CONSERVATIVE inference:
  // exactly ONE known NPC display name appearing in the line attributes its quotes to
  // that NPC's voice; zero or several names ⇒ null (stay neutral, never mis-tint).
  // One function feeds BOTH surfaces (the log's appendNarration + the VN's --voice).
  function inferQuoteVoice(text: string): VoiceCategory | null {
    let found: VoiceCategory | null = null;
    for (const [id, name] of Object.entries(NPC_NAME) as [NpcId, string][]) {
      if (!text.includes(name)) continue;
      if (found !== null) return null; // two speakers named — ambiguous, stay neutral
      found = NPC_VOICE[id];
    }
    return found;
  }
  function inferQuoteVoiceColor(text: string): string | null {
    const v = inferQuoteVoice(text);
    return v ? VOICE_COLOR[v] : null;
  }
  // FB-50 — a spoken line gets a "Name: " prefix (the speaker's display name). The stored
  // `entry.speaker` already IS the display name (NAMES.* / PLAYER_SPEAKER = "You"); NPC_NAME maps
  // an id defensively should one ever arrive, else the value passes through. The voice colour
  // rides on the line's `voice-<category>` class, so the prefix inherits it — no extra colour code.
  function speakerPrefixNode(entry: LogEntry): HTMLElement | null {
    if (entry.speaker === undefined || entry.speaker === '') return null;
    const name = NPC_NAME[entry.speaker as keyof typeof NPC_NAME] ?? entry.speaker;
    return el('span', 'log-speaker', `${name}: `);
  }
  // FB-56 — the intro perk-unlock milestone line "Perk unlocked — {name}: {desc} (±mechanics)" renders
  // as an old-school JRPG PERK BOX, not the red milestone strip. Parse the single-source shape the
  // core emits (`introPerkLine`); a non-perk milestone falls through to normal styling.
  function parsePerkLine(
    entry: LogEntry,
  ): { readonly name: string; readonly desc: string; readonly mechanics: string } | null {
    if (entry.channel !== 'milestone') return null;
    const m = /^Perk unlocked — (.+?): (.+) \(([^)]*)\)\s*$/.exec(entry.text);
    if (!m) return null;
    return { name: m[1]!, desc: m[2]!, mechanics: m[3]! };
  }
  function buildPerkBox(
    line: HTMLElement,
    perk: { readonly name: string; readonly desc: string; readonly mechanics: string },
  ): void {
    line.textContent = '';
    const box = el('div', 'perk-box');
    box.append(el('div', 'perk-tag', 'Perk unlocked'));
    box.append(el('div', 'perk-name', perk.name));
    box.append(el('div', 'perk-desc', perk.desc));
    box.append(buildStatLine(perk.mechanics));
    line.append(box);
  }
  // F137 — tint each "±N ATTR" token in a mechanics string with its attribute
  // pigment (the 5-metal set), so a stat delta reads as belonging to its stat.
  function buildStatLine(mechanics: string): HTMLElement {
    const out = el('div', 'perk-stat');
    const re = /([+\-−]\d+\s+)(STR|AGI|INT|SPD|LUCK)/g;
    let idx = 0;
    for (const m of mechanics.matchAll(re)) {
      if (m.index > idx) out.append(document.createTextNode(mechanics.slice(idx, m.index)));
      const tok = el('span', 'stat-attr', `${m[1]}${m[2]}`);
      tok.style.color = ATTR_COLOR[m[2]!.toLowerCase() as AttrId];
      out.append(tok);
      idx = m.index + m[0].length;
    }
    if (idx < mechanics.length) out.append(document.createTextNode(mechanics.slice(idx)));
    return out;
  }
  // F127/FB-165/FB-400 — chat grouping: a PURE function of the entries maps every chat
  // line to its conversation partner (a player line finds its partner by LOOKAHEAD to
  // the NPC's reply, so the group opens above the opening question, never mid-run).
  // FB-400 retired the inline "— with X —" kicker rule: chat runs now wear the SAME
  // 幕-card idiom as VN scene runs (stampSceneGroup), the opener's label as the lintel.
  function computeChatKickers(entries: readonly LogEntry[]): {
    openers: Map<number, string>;
    partners: Map<number, string>;
  } {
    const openers = new Map<number, string>();
    const partners = new Map<number, string>(); // FB-400 — every chat line's conversation identity
    let current: string | null = null; // the active conversation partner
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i]!;
      if (e.chat !== true) {
        current = null; // a non-chat line breaks the run
        continue;
      }
      let partner = e.voice !== 'player' && e.speaker !== undefined ? e.speaker : null;
      if (partner === null) {
        // a player line: the partner is whoever replies next in this chat run
        for (let j = i + 1; j < entries.length; j++) {
          const n = entries[j]!;
          if (n.chat !== true) break;
          if (n.voice !== 'player' && n.speaker !== undefined) {
            partner = n.speaker;
            break;
          }
        }
        if (partner === null) partner = current; // mid-group player line
      }
      if (partner !== null && partner !== current) {
        // FB-270 — the group opener may carry a scene context ("the cold open",
        // "The day-hand promotion"); the head names it so the card has meaning.
        openers.set(e.key, e.context !== undefined ? `${partner} · ${e.context}` : partner);
        current = partner;
      }
      if (partner !== null) partners.set(e.key, partner);
    }
    return { openers, partners };
  }
  /** HD-41 — the PROGRESS reading of an earned line: the authored statement of the work just
   *  finished, or null when this entry (or this view) isn't one. DEV can swap the take live —
   *  the line is read from the registry on every paint, never stored. */
  function progressObjective(entry: LogEntry): string | null {
    if (logFilter !== 'progression' || !isEarnedLine(entry.contentKey)) return null;
    const id = entry.contentKey!.slice('requirement.'.length);
    const req = requirementById(id);
    if (!req) return null;
    return __DEV_TOOLS__ && dev ? dev.subReqObjective(id, req.objective) : req.objective;
  }
  function renderLineContent(line: HTMLElement, entry: LogEntry): void {
    const perk = parsePerkLine(entry);
    if (perk) {
      buildPerkBox(line, perk);
      return;
    }
    line.textContent = '';
    // HD-41 — the two readings of one completion (human, 2026-07-13): STORY keeps the
    // overheard flavor prose; PROGRESS is the register of earned work, so it states the
    // labour that was just finished (`objective`, authored per requirement). Same entry,
    // same descriptor (ADR-186) — only the reading changes, resolved from the registry at
    // paint time, so no save ever stores these words. An id the registry no longer knows
    // (a retired requirement in an old save) falls through to the logged text.
    const objective = progressObjective(entry);
    if (objective !== null) {
      line.classList.add('docket');
      line.append(document.createTextNode(objective));
      return;
    }
    // FB-262 — the VN-group header survives content re-renders (same pattern as the kicker).
    if (line.dataset.sceneHead !== undefined) {
      const head = el('div', 'scene-head', `— ${line.dataset.sceneHead} —`);
      head.setAttribute('aria-hidden', 'true');
      line.append(head);
    }
    const bullet = CHANNEL_BULLET[entry.channel];
    if (bullet) {
      const b = el('span', 'bullet emoji', bullet); // .emoji ties the bullet to the palette
      b.setAttribute('aria-hidden', 'true');
      line.append(b);
    }
    const prefix = speakerPrefixNode(entry);
    if (prefix) line.append(prefix);
    // DEV — re-derive keyed prose so a story-take flip re-voices logged lines (see devRederivedEntry).
    const text = formatLogText(__DEV_TOOLS__ && dev ? devRederivedEntry(entry) : entry);
    // FB-26 — when a line carries a speaker `voice`, the whole line takes that
    // voice's colour (via the `voice-<category>` class on the line, added in
    // buildLogLine), so who's talking reads at a glance. The FB-23 quote-detection
    // (`.speech` spans) runs for NARRATOR-voiced and un-voiced narration (FB-228 —
    // an embedded quote is a character speaking, tinted by inference); a line
    // spoken in a real voice renders plain and lets the class colour it whole.
    if (entry.channel === 'narration' && (entry.voice === undefined || entry.voice === 'narrator'))
      appendNarration(line, text);
    else line.append(document.createTextNode(text));
  }
  // FB-167 — the paint-order key of the last-built line: when the SPEAKER-BLOCK
  // changes (a different voice/speaker/channel takes over), the new line opens
  // with breathing room, so narration / dialogue / teach lines never run together
  // as "one big log". Paint-order derived; reset with the painted view.
  let lastBlockKey: string | null = null;
  // FB-262 — the Story log's VN GROUPS: consecutive non-chat lines sharing a scene `context`
  // read as ONE 幕-card unit (HR-24: A · 幕 card; the .scene-* classes are styled in styles.css). Paint-order
  // derived like the block breaks; the closing edge is `.scene-close` (stamped when the run
  // ends) or `:last-child` (the run is still the newest thing in the log).
  let lastSceneCtx: string | null = null;
  let lastSceneNode: HTMLElement | null = null;
  // FB-317 — the ctx of the last card that PRINTED its lintel: a run interrupted by a
  // stray non-scene line (an old save's mid-scene reveal) reopens its box WITHOUT a
  // duplicate "— the cold open —" head; the name paints once per scene, not per fragment.
  let lastHeadCtx: string | null = null;
  function stampSceneGroup(line: HTMLElement, entry: LogEntry): void {
    // FB-400 — ONE grouping idiom (TST1): chat runs wear the same 幕 card as VN scene
    // runs. A chat line's group identity is its conversation partner (chatPartners);
    // its card head is the opener's "with <partner> · <context>" label (the retired
    // inline kicker's text, now a lintel).
    const chatPartner = entry.chat === true ? (chatPartners.get(entry.key) ?? null) : null;
    const ctx =
      chatPartner !== null
        ? `chat:${chatPartner}`
        : entry.chat !== true && entry.context !== undefined
          ? entry.context
          : null;
    if (ctx !== lastSceneCtx && lastSceneNode?.isConnected) {
      lastSceneNode.classList.add('scene-close'); // the previous run ended — close its box
    }
    if (ctx === null) {
      lastSceneCtx = null;
      lastSceneNode = null;
      return;
    }
    line.classList.add('scene-line');
    if (ctx !== lastSceneCtx) {
      line.classList.add('scene-open');
      if (ctx !== lastHeadCtx) {
        // a chat card's lintel: the opener's label; a mid-run repaint falls back to the partner.
        line.dataset.sceneHead =
          chatPartner !== null ? `with ${chatKickers.get(entry.key) ?? chatPartner}` : ctx;
        lastHeadCtx = ctx;
      }
    }
    lastSceneCtx = ctx;
    lastSceneNode = line;
  }
  function stampBlockBreak(line: HTMLElement, entry: LogEntry): void {
    const key = `${entry.channel}|${entry.voice ?? ''}|${entry.speaker ?? ''}`;
    if (lastBlockKey !== null && key !== lastBlockKey) line.classList.add('log-break');
    lastBlockKey = key;
  }
  function buildLogLine(entry: LogEntry, animate: boolean): HTMLElement {
    // FB-56 — a perk-unlock milestone becomes a JRPG box: drop the `milestone` class (no red strip),
    // carry a plain `perk-line` wrapper the box lives inside.
    if (parsePerkLine(entry)) {
      const line = el('div', 'log-line perk-line');
      lastBlockKey = 'perk'; // a perk box breaks the run either side
      renderLineContent(line, entry);
      if (animate) line.classList.add('reveal');
      return line;
    }
    // the voice-<category> class carries the speaker colour (FB-26); absent voice ⇒
    // today's channel-only styling (narrator quote-detection fallback). FB-228 — a
    // line spoken in a real voice (never the narrator) also steps in (.spoken).
    const voiceClass = entry.voice ? ` voice-${entry.voice}` : '';
    const spokenClass = entry.voice && entry.voice !== 'narrator' ? ' spoken' : '';
    // HD-41 — a rung-requirement completion is story that is ALSO earned: the class carries
    // the treatment (A quiet ledger dot by default; B/C via the DEV earned-line variant).
    const earnedClass = isEarnedLine(entry.contentKey) ? ' earned' : '';
    const line = el('div', `log-line ${entry.channel}${voiceClass}${spokenClass}${earnedClass}`);
    stampBlockBreak(line, entry); // FB-167 — breathing room when the speaker-block changes
    stampSceneGroup(line, entry); // FB-262 — VN-unit grouping in the Story log
    renderLineContent(line, entry);
    if (animate) line.classList.add('reveal');
    return line;
  }
  // restart the tally-flash on a coalesced ×N bump (remove → reflow → re-add).
  function flashTally(line: HTMLElement): void {
    line.classList.remove('tally');
    void line.offsetWidth;
    line.classList.add('tally');
    hooks.sfx.reward(); // the coin-tally cue — a shamisen/koto pluck (T0-M1-F4)
  }
  // FB-77 — follow the newest line and STAY pinned to the foot as content arrives; a reader
  // scrolled UP into history is left alone until they return (see the scroll listener above).
  // FB-150 — a WHOLE-LINE append glides smoothly (the instant one-line-height jump read as
  // "chunky"); the per-char typewriter + floods keep the instant authoritative jump (FB-77's
  // original lag bug), and the smoothScrollUntil window stops the glide's intermediate
  // positions from unpinning the reader. Reduced-motion always jumps.
  function scrollLogToNewest(smooth = false): void {
    if (!logPinnedToBottom) return;
    // (typeof guard: jsdom has no scrollTo — tests take the instant jump)
    if (smooth && !reduceMotion() && typeof logLines.scrollTo === 'function') {
      smoothScrollUntil = performance.now() + 450;
      logLines.scrollTo({ top: logLines.scrollHeight, behavior: 'smooth' });
      return;
    }
    logLines.scrollTop = logLines.scrollHeight;
  }
  function appendLine(entry: LogEntry, animate: boolean): void {
    logLines.append(buildLogLine(entry, animate)); // newest at the BOTTOM (reads as a story)
    while (logLines.childElementCount > LOG_DOM_MAX) logLines.firstElementChild?.remove();
    scrollLogToNewest(animate); // follow the newest line (FB-7); animated appends glide (FB-150)
    armFreshDividerFade(); // FB-177 — the divider fades after the LAST written line, not the first
  }
  // P2 — a line typewrites only if it is STORY text: a narration line, or any line
  // carrying a speaker `voice` (narrator / player / NPC dialogue). Combat/reward/
  // system/milestone lines return false and keep the instant append.
  function qualifiesForTypewriter(entry: LogEntry): boolean {
    return entry.channel === 'narration' || entry.voice !== undefined;
  }
  // P2 — the typewriter engages only when every guard holds: not the test env (vitest
  // stays deterministic — its render/log tests run under MODE=test and bypass this
  // entirely), not the very first paint, and not reduced-motion (OS media query OR the
  // in-app `.reduced-motion` class). The reset/load guards live at the call sites
  // (firstRender / didReset route to the instant path before this is ever consulted).
  function typewriterEnabled(): boolean {
    if (import.meta.env.MODE === 'test') return false;
    if (firstRender) return false;
    return !(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('reduced-motion')
    );
  }
  // P2 — cancel any in-flight per-char typing (reset / filter-clear removes the line
  // anyway, so we drop it rather than finalize).
  function stopTyping(): void {
    if (typeTimer !== undefined) {
      window.clearTimeout(typeTimer);
      typeTimer = undefined;
    }
    finishTypeNow = undefined;
  }
  // P2 — the per-char typewriter. FB-321/FB-322 — the line is built FULLY STYLED up front
  // (buildLogLine → renderLineContent: voice tints, the FB-23/FB-228 quote-`.speech` spans,
  // their italics), then its TEXT reveals progressively ACROSS the styled text nodes — the
  // scroll-in wears the same ink as the finished line, never a plain-text preview that
  // snaps styled at the end (the old shape: type into one bare text node, re-render on
  // completion — the human watched quotes scroll in untinted and un-italic). The line's
  // chrome (scene head / chat kicker / bullet / speaker prefix — FB-50/FB-262) shows at
  // once, exactly as before. `onDone` fires once the line is fully typed (or the line was
  // evicted), never on a cancel.
  function typeLine(entry: LogEntry, onDone: () => void): void {
    const line = buildLogLine(entry, false);
    logLines.append(line);
    while (logLines.childElementCount > LOG_DOM_MAX) logLines.firstElementChild?.remove();
    scrollLogToNewest();
    armFreshDividerFade(); // FB-177 — a typing line keeps the fresh divider alive

    // collect the CONTENT text nodes in document order; the chrome's text is excluded (it
    // paints immediately). Each node's full text is remembered, then emptied for the reveal.
    const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
    const nodes: { node: Text; full: string }[] = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (n.parentElement?.closest('.scene-head, .bullet, .log-speaker')) continue;
      const t = n as Text;
      nodes.push({ node: t, full: t.data });
      t.data = '';
    }
    const total = nodes.reduce((sum, x) => sum + x.full.length, 0);
    const finalize = (): void => {
      for (const x of nodes) if (x.node.data !== x.full) x.node.data = x.full;
      scrollLogToNewest();
    };
    finishTypeNow = finalize;
    if (total === 0 || QA_INSTANT_TEXT) {
      finishTypeNow = undefined;
      finalize();
      onDone();
      return;
    }
    let i = 0;
    const step = (): void => {
      typeTimer = undefined;
      // the line was evicted (LOG_DOM_MAX churn) — stop typing, keep the cascade moving.
      if (!line.isConnected) {
        finishTypeNow = undefined;
        onDone();
        return;
      }
      i += 1;
      // fill the styled nodes in order until i characters are visible in total
      let budget = i;
      for (const x of nodes) {
        const want = Math.min(x.full.length, Math.max(0, budget));
        if (x.node.data.length !== want) x.node.data = x.full.slice(0, want);
        budget -= x.full.length;
        if (budget <= 0) break;
      }
      if (i % 3 === 0) scrollLogToNewest(); // follow the view a few chars at a time
      if (i < total) {
        typeTimer = window.setTimeout(step, TYPE_MS_PER_CHAR);
      } else {
        finishTypeNow = undefined;
        finalize();
        onDone();
      }
    };
    typeTimer = window.setTimeout(step, TYPE_MS_PER_CHAR);
  }
  function pumpReveal(): void {
    if (revealTimer !== undefined || typeTimer !== undefined) return; // no overlap
    const entry = revealQueue.shift();
    if (!entry) return;
    if (typewriterEnabled() && qualifiesForTypewriter(entry)) {
      // typewriter line — the NEXT pumpReveal is scheduled from the typing-complete
      // callback (a short beat later), so lines never overlap.
      typeLine(entry, () => {
        armFreshDividerFade(); // FB-177 — the fade counts from the line FINISHING, not starting
        revealTimer = window.setTimeout(() => {
          revealTimer = undefined;
          pumpReveal();
        }, TYPE_NEXT_BEAT_MS);
      });
    } else {
      // non-story line — instant append, then the classic LOG_STAGGER_MS step.
      appendLine(entry, true);
      revealTimer = window.setTimeout(() => {
        revealTimer = undefined;
        pumpReveal();
      }, LOG_STAGGER_MS);
    }
  }
  function paintLogFilterBar(): void {
    logFilterBar.dataset.variant = 'log-filter-segmented'; // human pick (FB-21); A/B removed
    for (const [id, btn] of logFilterBtns) btn.classList.toggle('active', id === logFilter);
    // FB-320 — the Story tab expands its vn/all sub-toggle only while selected
    storySubWrap.hidden = logFilter !== 'story';
    for (const [sub, sb] of storySubBtns) sb.classList.toggle('active', sub === storySub);
  }
  // FB-20 — the highest entry key that shows under filter `f`.
  function maxKeyForFilter(entries: readonly LogEntry[], f: LogFilter): number {
    let mx = -1;
    for (const e of entries)
      if (
        logFilterMatches(
          e.channel,
          f,
          e.ephemeral === true,
          e.chat === true,
          isEarnedLine(e.contentKey),
        )
      )
        mx = Math.max(mx, e.key);
    return mx;
  }
  // FB-59/FB-222 — one-shot unread baseline: everything in the log at first render is
  // history (no stale dots on load/refresh); everything after — including lines landing
  // WHILE the VN cold open hides the shell — is a mid-session arrival that trips a dot.
  function seedLogSeenOnce(state: GameState): void {
    if (logSeenSeeded) return;
    logSeenSeeded = true;
    const loaded = state.log.entries;
    for (const f of Object.keys(logSeen) as LogFilter[]) logSeen[f] = maxKeyForFilter(loaded, f);
  }
  function refreshLogTabs(state: GameState): void {
    const entries = state.log.entries;
    logSeen[logFilter] = maxKeyForFilter(entries, logFilter); // viewing = seen
    for (const [id, btn] of logFilterBtns) {
      // `all` is excluded — it always shows everything, so a badge there would be noise; `now` too
      // (FB-53 — its lines fade on their own, so an unread dot there would just flicker).
      const unread =
        id !== logFilter &&
        id !== 'all' &&
        id !== 'now' &&
        maxKeyForFilter(entries, id) > logSeen[id];
      btn.classList.toggle('unread', unread);
    }
  }
  // ── FB-53/FB-115 · the "Now" view — a rolling window of FLEETING flavor (ephemeral entries) that each
  //    fade ~15s after first appearing. Wall-clock + DOM only (a render concern; the pure core never
  //    sees time). FB-115: the EXPIRY CLOCK is DECOUPLED from the active view — a single light interval
  //    ages `nowSeen` stamps out on wall time whether or not Now is showing (so a fleeting line clears
  //    on schedule; open Now later → already gone, not a backlog) and, WHILE Now is active, also drives
  //    the DOM fade/collapse. Leak-free: the clock self-terminates when no stamps remain and Now isn't
  //    the active view, and a full reset (new game / import) tears everything down.
  function stopExpiryClock(): void {
    if (nowInterval !== undefined) {
      window.clearInterval(nowInterval);
      nowInterval = undefined;
    }
  }
  function ensureExpiryClock(): void {
    if (nowInterval === undefined) nowInterval = window.setInterval(tickExpiry, 500);
  }
  function cancelNowCollapse(): void {
    // F58b — cancel any in-flight collapse animations so their removal timers don't fire late (used
    // when the Now DOM is about to be wiped by a filter switch — the stamps + clock are KEPT, FB-115).
    for (const t of nowCollapseTimers) window.clearTimeout(t);
    nowCollapseTimers.clear();
  }
  function clearNowView(): void {
    // FULL teardown (reset only) — drop the stamps, the high-water mark, and the clock.
    stopExpiryClock();
    cancelNowCollapse();
    nowSeen.clear();
    lastEphStampKey = -1;
    nowEmptyEl = undefined;
    refreshNowLive(); // FB-175 — a reset douses the live lamp with the stamps
  }
  // FB-115 — stamp any NEWLY-observed ephemeral entry with its wall-clock birth, for ANY active view.
  // The monotonic high-water key means an entry whose stamp already aged out of `nowSeen` is never
  // re-stamped fresh (it stays in the permanent log ring, but its render-life is over). Starts the
  // expiry clock the moment there's anything to age out.
  // FB-325 — ONE exception to the never-re-stamp rule: a COALESCED repeat (the same key bumping
  // its ×N count — a re-rake, a repeated flavor) IS new text arriving, so it re-stamps: the Now
  // lamp re-lights and the line's fade clock restarts with the fresh arrival. Without this a
  // player grinding one verb never saw the lamp again after its first 10s window lapsed.
  function stampEphemeral(state: GameState): void {
    const now = Date.now();
    let maxKey = lastEphStampKey;
    let maxCount = lastEphStampCount;
    for (const e of state.log.entries) {
      if (e.ephemeral !== true) continue;
      if (e.key > lastEphStampKey) nowSeen.set(e.key, now);
      else if (e.key === lastEphStampKey && (e.count ?? 1) > lastEphStampCount)
        nowSeen.set(e.key, now); // FB-325 — the coalesce bump re-stamps
      if (e.key > maxKey) {
        maxKey = e.key;
        maxCount = e.count ?? 1;
      } else if (e.key === maxKey) {
        maxCount = Math.max(maxCount, e.count ?? 1);
      }
    }
    lastEphStampKey = maxKey;
    lastEphStampCount = maxCount;
    if (nowSeen.size > 0) ensureExpiryClock();
    refreshNowLive();
  }
  // FB-268 — the keep-last floor: the NOW_KEEP_LAST newest stamped fleeting lines are exempt
  // from the TTL (they hold the Now view's recent beat). Derived from the stamps themselves
  // (nowSeen keys are the log keys, monotonic), so it needs no state threading.
  function protectedNowKeys(): Set<number> {
    const keys = [...nowSeen.keys()].sort((a, b) => b - a).slice(0, NOW_KEEP_LAST);
    return new Set(keys);
  }
  // FB-175 — the Now tab's ambient ACTIVITY lamp: fleeting text landed in the last 10s.
  // Deliberately NOT the red unread dot (Now's lines self-fade — FB-53); a distinct warm
  // "live" tint that lapses back to quiet on its own. Driven by the same wall-clock stamps
  // as the fade (`nowSeen`), refreshed by the same 500ms expiry clock — no extra timer.
  const NOW_LIVE_MS = 10_000;
  function refreshNowLive(): void {
    const btn = logFilterBtns.get('now');
    if (!btn) return;
    const now = Date.now();
    let live = false;
    for (const seen of nowSeen.values())
      if (now - seen < NOW_LIVE_MS) {
        live = true;
        break;
      }
    btn.classList.toggle('live', live);
  }
  // F58b — collapse an expired Now line (height → 0, opacity → 0, margins/padding → 0) over
  // ~0.4s so the lines below it glide UP as one, instead of snapping up on an instant remove.
  // Reduced-motion never calls this (it removes instantly); the stamp is dropped up-front so the
  // prune pass skips the node while it animates out.
  function collapseNowLine(node: HTMLElement, key: number): void {
    nowSeen.delete(key);
    node.style.maxHeight = `${node.scrollHeight}px`;
    void node.offsetHeight; // commit the start height so the transition to 0 has something to run from
    node.classList.add('now-collapsing');
    const t = window.setTimeout(() => {
      nowCollapseTimers.delete(t);
      node.remove();
    }, NOW_COLLAPSE_MS + 60);
    nowCollapseTimers.add(t);
  }
  function nowEmptyPlaceholder(): void {
    // empty when nothing recent — a calm placeholder so the tab never reads broken. Idempotent: only
    // appends when there's no live line AND the placeholder isn't already up, so a repeated
    // empty-state render churns nothing (ADR-123 zero-churn). NOT a wholesale clear — reconcile owns
    // the now-line nodes; the placeholder is the sole foreign sibling and is removed before a repaint.
    if (logLines.querySelector('.now-line')) return; // still has live lines
    if (nowEmptyEl && nowEmptyEl.isConnected) return;
    nowEmptyEl = el('div', 'log-empty', 'Quiet, just now — the moment has passed.');
    logLines.append(nowEmptyEl);
  }
  // FB-115 — the interval body: ALWAYS ages the stamps out on wall time (so the expiry runs regardless
  // of the active view), and — only while Now is the active view — drives the DOM fade/collapse. The
  // clock self-terminates once nothing is pending (no stamps + Now not shown).
  function tickExpiry(): void {
    // a torn-down mount (tests, a hard page swap) must not keep ticking: without
    // this the interval outlived the DOM and threw after environment teardown.
    if (typeof window === 'undefined' || !logLines.isConnected) {
      stopExpiryClock();
      return;
    }
    const now = Date.now();
    if (logFilter === 'now') {
      // Now IS visible: the DOM pass owns the stamp lifecycle (collapse/remove drop the stamp), so it
      // can animate the fade-out. It fades lines entering their last NOW_FADE_MS + expires past TTL.
      pruneNowViewDom(now);
    } else {
      // Now is HIDDEN: no DOM to touch — just age the logical clock so lines are already gone when the
      // player switches to Now next (the core of the FB-115 fix). FB-268: the keep-last floor
      // is exempt — those stamps survive any age.
      const keep = protectedNowKeys();
      for (const [key, seen] of nowSeen)
        if (!keep.has(key) && now - seen >= NOW_TTL_MS) nowSeen.delete(key);
      // only floor-protected stamps left and all past TTL ⇒ nothing changes until a new line
      // lands (stampEphemeral re-arms the clock) — stop ticking rather than spin forever.
      if (
        nowSeen.size > 0 &&
        [...nowSeen.entries()].every(([k, seen]) => keep.has(k) && now - seen >= NOW_TTL_MS)
      ) {
        stopExpiryClock();
        refreshNowLive();
        return;
      }
    }
    if (nowSeen.size === 0 && logFilter !== 'now') stopExpiryClock();
    refreshNowLive(); // FB-175 — the live lamp ages off on the same clock
  }
  // The DOM prune pass (Now active): fade lines entering their last NOW_FADE_MS, expire past NOW_TTL_MS.
  function pruneNowViewDom(now: number): void {
    const reduced = reduceMotion();
    const keep = protectedNowKeys(); // FB-268 — the keep-last floor never fades
    let live = 0;
    for (const node of Array.from(logLines.children) as HTMLElement[]) {
      const raw = node.dataset.nowKey;
      if (raw === undefined) continue; // the placeholder — skip
      if (node.classList.contains('now-collapsing')) continue; // F58b — already animating out
      const seen = nowSeen.get(Number(raw));
      if (seen === undefined) {
        node.remove();
        continue;
      }
      if (keep.has(Number(raw))) {
        node.classList.remove('now-fading'); // displaced back INTO the floor never half-fades
        live += 1;
        continue;
      }
      const age = now - seen;
      if (age >= NOW_TTL_MS) {
        // F58b — collapse the line so the rest slide up (reduced-motion → instant remove).
        if (reduced) {
          node.remove();
          nowSeen.delete(Number(raw));
        } else {
          collapseNowLine(node, Number(raw));
        }
      } else {
        if (!reduced && age >= NOW_TTL_MS - NOW_FADE_MS) node.classList.add('now-fading');
        live += 1;
      }
    }
    if (live === 0) nowEmptyPlaceholder();
  }
  // ADR-123 — the Now view is APPEND-ONLY (FB-81 / reconcile.ts), no longer a `textContent=''` rebuild.
  // A state-change re-render RECONCILES the currently-visible ephemeral entries (stamped, still inside
  // their TTL) keyed by log key: a surviving line keeps its node (zero churn), an aged-out line is
  // removed, a new fleeting line is appended. FB-115 — this only READS the stamps (stampEphemeral, run
  // for every view, owns writing them), so an entry aged out while Now was hidden is simply absent.
  function renderNowView(state: GameState): void {
    const now = Date.now();
    const reduced = reduceMotion();
    // the ephemeral entries STILL inside their render window (newest at the bottom — log order).
    const keep = protectedNowKeys(); // FB-268 — the keep-last floor is always visible
    const visible = state.log.entries.filter((e) => {
      if (e.ephemeral !== true) return false;
      if (keep.has(e.key)) return true;
      const seen = nowSeen.get(e.key);
      return seen !== undefined && now - seen < NOW_TTL_MS;
    });
    // the placeholder is the one FOREIGN sibling reconcile doesn't own — drop it before a real repaint
    // so the container holds only reconciled now-lines (reconcile's single-owner contract).
    if (visible.length > 0 && nowEmptyEl) {
      nowEmptyEl.remove();
      nowEmptyEl = undefined;
    }
    reconcileList(logLines, visible, {
      key: (e) => String(e.key),
      build: (e) => {
        const line = buildLogLine(e, false);
        line.classList.add('now-line');
        line.dataset.nowKey = String(e.key);
        return line;
      },
      patch: (line, e) => {
        const seen = nowSeen.get(e.key);
        const age = seen === undefined ? 0 : now - seen;
        setClass(
          line,
          'now-fading',
          !reduced && !keep.has(e.key) && age >= NOW_TTL_MS - NOW_FADE_MS,
        );
      },
      order: true,
    });
    if (visible.length === 0) nowEmptyPlaceholder();
    ensureExpiryClock(); // keep the fade/prune loop alive while Now is shown
    scrollLogToNewest();
  }
  // FB-27 — clear/drop the transient fresh-entries divider.
  function clearFreshDivider(): void {
    if (freshDividerTimer !== undefined) {
      window.clearTimeout(freshDividerTimer);
      freshDividerTimer = undefined;
    }
    freshDivider?.remove();
    freshDivider = undefined;
  }
  // FB-323 — `before` re-anchors the divider ABOVE an existing line (the coalesce-bump
  // case: the "new text" grew in place, so the marker slides in front of it).
  function markFreshDivider(before?: Element): void {
    clearFreshDivider();
    const d = buildFreshDividerNode(); // same idiom the intro reuses (FB-27/FB-54)
    if (before) logLines.insertBefore(d, before);
    else logLines.append(d); // fresh lines append AFTER it
    freshDivider = d;
    armFreshDividerFade();
  }
  // FB-177 — the fade countdown re-arms on EVERY appended line, so the divider outlives the
  // typewriter cascade: a batch can take many seconds to type out, and the old fixed timer
  // (armed at batch ARRIVAL) faded the divider while its own lines were still landing.
  // It fades FRESH_DIVIDER_TTL_MS after the LAST line is written, not the first (FB-199).
  function armFreshDividerFade(): void {
    const d = freshDivider;
    if (!d) return;
    if (freshDividerTimer !== undefined) window.clearTimeout(freshDividerTimer);
    d.classList.remove('fading'); // a late line mid-fade pulls it back
    freshDividerTimer = window.setTimeout(() => {
      // a single long line can TYPE for longer than the whole countdown — while the
      // cascade is still writing (typing tick live or lines queued), check back later
      // instead of fading out from under the reader.
      if (typeTimer !== undefined || revealTimer !== undefined || revealQueue.length > 0) {
        armFreshDividerFade();
        return;
      }
      d.classList.add('fading');
      window.setTimeout(() => {
        if (freshDivider === d) {
          d.remove();
          freshDivider = undefined;
        }
      }, FRESH_DIVIDER_FADE_MS);
    }, FRESH_DIVIDER_TTL_MS); // FB-199 — ~30s past the last line (was 4.5s)
  }
  // `force` repaints even when the filter is unchanged — the FB-320 sub-toggle flips the
  // story view's CONTENT without changing the filter id.
  function setLogFilter(f: LogFilter, force = false): void {
    if (f === logFilter && !force) return;
    const wasNow = logFilter === 'now';
    logFilter = f;
    // a filter switch repaints the newly-filtered view instantly (statically, no cascade).
    logLines.textContent = '';
    resetReconcile(logLines); // ADR-123 — the Now view reconciles this shared container; a wholesale
    // clear must forget its key→node map or the next Now render would patch detached nodes.
    nowEmptyEl = undefined;
    clearFreshDivider();
    // FB-115 — leaving Now WIPES its DOM (below), so cancel any in-flight collapse animations; but KEEP
    // the stamps + the expiry clock running so the fleeting lines keep aging out while Now is hidden.
    if (wasNow) cancelNowCollapse();
    lastKey = -1;
    lastBlockKey = null; // FB-167 — the repaint re-derives block breaks
    lastSceneCtx = null; // FB-262 — scene groups re-derive with them
    lastSceneNode = null;
    lastHeadCtx = null; // FB-317 — lintels re-derive with the repaint
    lastPaintedKey = -1;
    lastPaintedCount = 0;
    revealQueue.length = 0;
    if (revealTimer !== undefined) {
      window.clearTimeout(revealTimer);
      revealTimer = undefined;
    }
    stopTyping(); // P2 — cancel any in-flight typewriter (the view is being repainted)
    if (lastState) {
      // FB-228 — opening a tab with UNREAD lines plays them like a live arrival: the READ
      // history paints instantly (as before), then the unread tail flows through the fresh
      // divider + cascade + typewriter — "as if the tab had been open the whole time".
      // (The seen high-water is captured BEFORE refreshLogTabs below marks this tab seen;
      // the >12 flush valve still protects a huge backlog. Now/all are excluded — no dots.)
      const unreadFrom = f !== 'all' && f !== 'now' ? logSeen[f] : Number.MAX_SAFE_INTEGER;
      const wasFirst = firstRender;
      firstRender = true;
      if (
        !vnActive(lastState) &&
        !reduceMotion() &&
        lastState.log.entries.some((e) => e.key > unreadFrom && lineVisible(e))
      ) {
        const read = lastState.log.entries.filter((e) => e.key <= unreadFrom);
        renderLog({ ...lastState, log: { ...lastState.log, entries: read } });
        firstRender = false;
        renderLog(lastState); // the unread tail — divider + cascade + typewriter
      } else {
        renderLog(lastState);
      }
      firstRender = wasFirst;
    }
    paintLogFilterBar();
    if (lastState) refreshLogTabs(lastState); // FB-20 — switching a tab clears its dot
    // FB-51 — land at the NEWEST line (bottom) INSTANTLY on a tab switch, so the reader always
    // starts at the freshest of the newly-filtered view (not stranded mid-scroll or up top). Re-pin
    // (FB-77) so subsequent lines in the newly-filtered view keep following the foot.
    logPinnedToBottom = true;
    logLines.scrollTop = logLines.scrollHeight;
  }
  function renderLog(state: GameState): void {
    // HD-41 — the DEV story-take switch: picking another objective take repaints the whole
    // view via the SAME sanctioned path as a tab switch (a watched log is never mutated
    // line-by-line under the reader — TST2). First paint just records the epoch.
    if (__DEV_TOOLS__ && dev) {
      const epoch = dev.storyEpoch();
      if (epoch !== logStoryEpoch) {
        const first = logStoryEpoch < 0;
        logStoryEpoch = epoch;
        if (!first && lastState) {
          // A take flip repaints IN PLACE (session-200 bug report): the reader is mid-scroll
          // comparing the very line that changes, so the FB-51 land-at-bottom that setLogFilter
          // applies would yank the ground (TST2). Restore the offset unless they were already
          // pinned to the foot — pinned readers keep following it, same as before.
          const wasPinned = logPinnedToBottom;
          const top = logLines.scrollTop;
          setLogFilter(logFilter, true);
          if (!wasPinned) {
            logPinnedToBottom = false;
            logLines.scrollTop = top;
          }
          return;
        }
      }
    }
    // FB-262 — VN groups: consecutive lines from one scene read as ONE 幕-card unit
    // (HR-24 signed off on A · 幕 card, 2026-07-10; styles the .scene-* classes unconditionally).
    const entries = state.log.entries;
    // FB-165 — refresh the pure kicker map whenever the log advanced or reset.
    if (state.log.seq !== chatKickersSeq) {
      const maps = computeChatKickers(entries);
      chatKickers = maps.openers;
      chatPartners = maps.partners;
      chatKickersSeq = state.log.seq;
    }
    // a state replacement (new game / import) rewinds log.seq — clear the stale painted
    // log + reveal queue and re-render the fresh log from scratch (tab-switches keep seq, so
    // they never trigger this).
    const didReset = state.log.seq < lastSeq;
    if (didReset) {
      logLines.textContent = '';
      resetReconcile(logLines); // ADR-123 — forget the Now view's key→node map on a wholesale reset
      lastKey = -1;
      lastBlockKey = null; // FB-167
      lastSceneCtx = null; // FB-262
      lastSceneNode = null;
      lastHeadCtx = null; // FB-317
      lastPaintedKey = -1;
      lastPaintedCount = 0;
      revealQueue.length = 0;
      clearFreshDivider();
      if (revealTimer !== undefined) {
        window.clearTimeout(revealTimer);
        revealTimer = undefined;
      }
      stopTyping(); // P2 — a reset must cancel any in-flight per-char typing timer
      clearNowView(); // FB-53 — a reset drops the fleeting-flavor stamps + fade timer too
    }
    lastSeq = state.log.seq;
    // FB-115 — stamp any newly-observed ephemeral entry for EVERY view (not just Now), so its expiry
    // clock starts the moment it arrives regardless of which tab is showing. This is the decoupling:
    // the fleeting lines age out on wall time even while Now is hidden.
    stampEphemeral(state);
    // FB-53 — the "Now" view owns its own rolling, self-fading render path (not the incremental
    // cascade): fully rebuild it from the ephemeral entries + their (view-independent) stamps.
    if (logFilter === 'now') {
      renderNowView(state);
      return;
    }
    if (entries.length === 0) return;
    const last = entries[entries.length - 1]!;
    const fresh: LogEntry[] = entries.filter((e) => e.key > lastKey);
    if (fresh.length === 0) {
      // in-place ×N growth: the last entry kept its key but bumped its count (a coalesce).
      // Only paint while the reveal cascade is idle (it self-heals on the next render).
      if (
        lineVisible(last) &&
        last.key === lastPaintedKey &&
        (last.count ?? 1) !== lastPaintedCount &&
        revealQueue.length === 0 &&
        revealTimer === undefined &&
        typeTimer === undefined // P2 — don't repaint mid-typewriter
      ) {
        const lineEl = logLines.lastElementChild as HTMLElement | null;
        if (lineEl) {
          renderLineContent(lineEl, last);
          flashTally(lineEl);
          // FB-323 — a coalesce bump IS new text: it gets the 新 marker like any arrival.
          // Pinned at the foot → the divider re-anchors to sit just above the bumped
          // line; scrolled-up keeps the anchored boundary (its fade re-arms). Never
          // while a VN owns the screen (the player isn't watching the transcript).
          if (!vnActive(state) && !introEndingRender) {
            if (freshDivider?.isConnected && !logPinnedToBottom) armFreshDividerFade();
            else markFreshDivider(lineEl);
          }
          scrollLogToNewest();
        }
        lastPaintedCount = last.count ?? 1;
      }
      return;
    }
    for (const e of fresh) lastKey = Math.max(lastKey, e.key);
    let freshVisible = fresh.filter(lineVisible);
    // FB-160/FB-161 — a FULL repaint (load / reset / tab switch) paints only the
    // newest LOG_DOM_MAX window; deeper history stays safe in core (never a
    // thousands-of-nodes DOM flood on a long run's tab switch).
    if ((firstRender || didReset) && freshVisible.length > LOG_DOM_MAX)
      freshVisible = freshVisible.slice(-LOG_DOM_MAX);

    // FB-48 — while a VN scene owns the live reveal (intro OR a rung beat — ADR-110), the LOG is only the
    // historical transcript: append its lines INSTANTLY (no typewriter, no cascade) so it's ready the
    // moment the shell reveals, never making the player wait for the log to catch up to choices
    // already made. `introEndingRender` carries the same instant path onto the single reveal render.
    const introInstant = vnActive(state) || introEndingRender;

    // FB-315/FB-331 — a line the VN overlay displayed is READ. While a VN scene is live, an
    // arriving SCENE line (it carries `context` — greeting / Q&A / say / react, the exact lines
    // the overlay renders) pre-marks itself seen for every filter it matches, so Chat/Story
    // never dot for it — and never one-by-one replay it — after the shell reveals (the FB-228
    // unread-tail path stays for lines that are genuinely unseen). Context-less mid-VN arrivals
    // (a perk milestone, a surface reveal) keep their FB-222 unread dots.
    if (introInstant) {
      for (const e of fresh) {
        if (e.context === undefined) continue;
        for (const f of Object.keys(logSeen) as LogFilter[]) {
          if (f === 'all' || f === 'now') continue; // never dotted anyway
          if (
            e.key > logSeen[f] &&
            logFilterMatches(
              e.channel,
              f,
              e.ephemeral === true,
              e.chat === true,
              isEarnedLine(e.contentKey),
            )
          )
            logSeen[f] = e.key;
        }
      }
    }

    // FB-27 — new lines flowing in over existing history get a transient divider before them (never
    // while the intro paints the hidden log — the player isn't watching the transcript build).
    if (
      freshVisible.length > 0 &&
      logLines.childElementCount > 0 &&
      !firstRender &&
      !didReset &&
      !introInstant
    ) {
      // FB-199/FB-323 — the divider marks the read/unread BOUNDARY. A reader scrolled up
      // into history keeps the anchored marker (new lines land under it, its fade
      // re-arms); a reader PINNED at the foot has read everything above, so the divider
      // RE-ANCHORS to sit just above each incoming block — new text always says 新.
      if (freshDivider?.isConnected && !logPinnedToBottom) armFreshDividerFade();
      else markFreshDivider();
    }

    // on load / reset / reduced-motion / a single new line / the intro transcript → append at once.
    if (firstRender || didReset || reduceMotion() || freshVisible.length === 1 || introInstant) {
      for (const e of freshVisible) {
        // P2 — a lone STORY line still typewrites (route it through the cascade of one);
        // firstRender/didReset/reduced-motion/intro keep the instant path (guards bail).
        if (!didReset && !introInstant && typewriterEnabled() && qualifiesForTypewriter(e)) {
          revealQueue.push(e);
          pumpReveal();
        } else {
          // FB-330 — the VN transcript backlog appends DEAD STILL (no .reveal fade, no smooth
          // glide): the log must simply BE there when the shell reveals, never visibly
          // re-scroll itself in front of the player.
          appendLine(e, !firstRender && !reduceMotion() && !introInstant);
        }
      }
    } else {
      // a batch (the cold open, a rank-up reveal) → cascade the lines in one-by-one.
      revealQueue.push(...freshVisible);
      if (revealQueue.length > 12) {
        // queue backed up during fast streaming — flush to catch up (instant, no typing).
        if (revealTimer !== undefined) {
          window.clearTimeout(revealTimer);
          revealTimer = undefined;
        }
        // finalize any in-flight typewriter line so it isn't stranded half-typed.
        if (typeTimer !== undefined) {
          window.clearTimeout(typeTimer);
          typeTimer = undefined;
          finishTypeNow?.();
          finishTypeNow = undefined;
        }
        while (revealQueue.length) appendLine(revealQueue.shift()!, false);
      } else {
        pumpReveal();
      }
    }
    lastPaintedKey = last.key;
    lastPaintedCount = last.count ?? 1;
  }

  function showRankUp(state: GameState): void {
    hooks.sfx.rankUp(); // the rank-up flourish — a struck temple-bell 鈴 (T0-M1-F4)
    const rank = currentRank(state);
    const overlay = el('div', 'rankup-seal');
    overlay.setAttribute('role', 'status');
    const inner = el('div', 'seal-inner');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      inner.classList.add('animate');
    inner.append(el('div', 'rankup-kicker', 'Promoted'));
    const seal = el('div', 'hanko-css');
    seal.lang = 'ja';
    seal.textContent = rank.kanji;
    inner.append(seal);
    inner.append(el('div', 'rankup-title', rank.title));
    overlay.append(inner);
    shell.append(overlay);
    window.setTimeout(() => overlay.remove(), 1900);
  }

  // the T0→T1 ascension ceremony (ADR-062 — the first ascension always lands BIG): a larger,
  // longer-held title card than a rung promotion, the silhouettes stirring behind it.
  function showAscension(state: GameState): void {
    hooks.sfx.rankUp(); // the ascension also rings the bell (the bigger ceremony, ADR-062)
    const overlay = el('div', 'rankup-seal ascension');
    overlay.setAttribute('role', 'status');
    const inner = el('div', 'seal-inner');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      inner.classList.add('animate');
    inner.append(el('div', 'rankup-kicker', 'The house rises'));
    const seal = el('div', 'hanko-css');
    seal.lang = 'ja';
    seal.textContent = '家産'; // the Estate pillar, ascended
    inner.append(seal);
    inner.append(el('div', 'rankup-title', `A man of the ${NAMES.house}`));
    inner.append(el('div', 'rankup-kicker subtitle', 'The Estate pillar stands. The next stirs.'));
    overlay.append(inner);
    shell.append(overlay);
    void state;
    window.setTimeout(() => overlay.remove(), 3200);
  }

  // ── SLOP threshold gates (human, 2026-07-10) ────────────────────────────────
  // R0 is the reviewed floor: everything past it is unreviewed ("slop"), and
  // everything past R1 is untested vibe coding ("turbo slop"). Crossing each
  // threshold interposes a warning, closable the house way (× / Escape — human
  // follow-up, 2026-07-10); the R2 gate's CONFIRM still demands typed consent.
  // Opens root-level at the modal layer, on the shell only — a live rung-up VN
  // plays out first (the pendingSlopWarning hold). Fired from the render pass's
  // exact-promotion diff, so a DEV fixture jump across rungs never trips it.
  function showSlopWarning(target: 'R1' | 'R2'): void {
    const scrim = el('div', 'modal-scrim slop-scrim');
    const card = el('div', 'modal-card frame slop-card');
    card.setAttribute('role', 'alertdialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-label', 'Content warning');
    const close = (): void => {
      scrim.remove();
      document.removeEventListener('keydown', onEsc);
    };
    const onEsc = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onEsc);
    const x = el('button', 'modal-close', '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close');
    x.addEventListener('click', close);
    card.append(x);
    card.append(
      el('div', 'slop-kicker', target === 'R1' ? 'Warning — slop' : 'Warning — turbo slop'),
      el(
        'p',
        'slop-body',
        target === 'R1'
          ? 'Slop is here. Everything past this rung is unreviewed.'
          : 'Turbo slop is here. Everything past this rung is completely untested ' +
              'pure vibe coding — Jake has not seen any of this yet.',
      ),
    );
    const confirm = el('button', 'verb primary slop-confirm', 'Confirm to continue');
    confirm.type = 'button';
    confirm.addEventListener('click', close);
    let focusTarget: HTMLElement = confirm;
    if (target === 'R2') {
      const sentence = 'Yes I really want to play the vibe slop let me in.';
      confirm.disabled = true;
      const gate = el('div', 'slop-gate');
      gate.append(
        el('div', 'slop-gate-label', 'Type this, exactly, to continue:'),
        el('div', 'slop-sentence', `“${sentence}”`),
      );
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'slop-input';
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.setAttribute('aria-label', 'Type the sentence to continue');
      input.addEventListener('input', () => {
        confirm.disabled = input.value.trim() !== sentence;
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !confirm.disabled) confirm.click();
      });
      gate.append(input);
      card.append(gate);
      focusTarget = input;
    }
    card.append(confirm);
    // the settings-modal Tab trap (D-Q-a11y), minus every close affordance
    card.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = card.querySelectorAll<HTMLElement>('button:not([disabled]), input');
      if (f.length === 0) return;
      const first = f[0]!;
      const last = f[f.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
    scrim.append(card);
    root.append(scrim);
    focusTarget.focus();
  }

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
    const stages: { el: HTMLElement; text: string; per: number; holdAfter: number }[] = [
      { el: coTitle, text: COLD_OPEN_TITLE, per: TYPE_MS_PER_CHAR * 3, holdAfter: 380 },
      { el: coRoman, text: COLD_OPEN_ROMAN, per: TYPE_MS_PER_CHAR, holdAfter: 380 },
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
    cancelColdOpenReveal = () => timers.forEach((id) => window.clearTimeout(id));
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
      logFilter = 'story';
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
      if (logFilter !== 'story') setLogFilter('story');
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
    if (introScene) introEndingRender = true;
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
      logPinnedToBottom = true;
      logLines.scrollTop = logLines.scrollHeight;
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
      // SLOP threshold gates (human, 2026-07-10) — exact-step matches, and only
      // when a player-initiated control armed the latch (never a DEV teleport).
      if (slopGateArmed) {
        slopGateArmed = false;
        if (prev.rung === 'R0' && state.rung === 'R1') pendingSlopWarning = 'R1';
        else if (prev.rung === 'R1' && state.rung === 'R2') pendingSlopWarning = 'R2';
      }
    }
    // A pending SLOP warning waits out any live-or-queued VN (the rung-up story
    // plays FIRST — human, 2026-07-10 follow-up), then opens on the shell.
    if (pendingSlopWarning && !vnActive(state) && state.sceneQueue.length === 0) {
      showSlopWarning(pendingSlopWarning);
      pendingSlopWarning = null;
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
        else if (btn.dataset.locked !== '1') btn.removeAttribute('aria-disabled');
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
      if (document.body.dataset.devActHover !== '1' || !lastState) return hideCard();
      const btn = (e.target as Element | null)?.closest<HTMLElement>('[data-act-key]');
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
      card.append(el('div', 'dev-act-card-title', btn.textContent?.trim() || key));
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
          line(`+${balance.RICE_PER_RAKE} shō (kura) · −${balance.SATIETY_PER_ACT} body`);
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
          line(`−${f.riceDrawn} shō (kura) · −${Math.round(f.bellyLost)} belly · no body back`);
          break;
        }
        case 'cook_meal':
          line(`−${balance.COOK_SANSAI_COST} sansai · +${balance.COOK_HUNGER_RESTORE} belly`);
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
          line(`+${f.hpGain} hp · −${f.riceDrawn} shō (kura) · −${Math.round(f.bellyLost)} belly`);
          break;
        }
        case 'eat_rice':
          line(`−${balance.EAT_RICE_COST} shō (kura) · +${balance.EAT_RICE_HUNGER} belly`);
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
          const target = ESTATE_STAGES.find((s) => s.stage === state.estateStage + 1);
          if (target) line(`−${formatCoin(target.coinCost)} → stage U${target.stage}`);
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
      const x = Math.min(Math.max(4, r.left), window.innerWidth - card.offsetWidth - 4);
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
