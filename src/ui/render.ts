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
  SkillId,
  MobId,
  StanceId,
  DialogueScene,
  DialogueTopic,
  VoiceCategory,
  AttrId,
  IntroOption,
  LabourOption,
  NodePerson,
} from '../core';
import {
  availableActions,
  availableLabours,
  introActive,
  introSceneAt,
  introSceneOption,
  introStatDelta,
  beatReactVoice,
  beatReactSpeaker,
  ATTR_META,
  availableTopics,
  PLAYER_SPEAKER,
  isUnlocked,
  hasFlag,
  formatKMB,
  formatCoin,
  satietyMax,
  hpMax,
  staminaRate,
  season,
  year,
  currentRank,
  rungProgress,
  nextRankId,
  getRank,
  phaseOf,
  estateGrade,
  ascensionAvailable,
  SKILLS,
  skillVisible,
  skillProgress,
  skillYieldNum,
  foesHere,
  peopleHere,
  bestiaryEntries,
  combatXpProgress,
  durabilityBand,
  getWeapon,
  WEAPONS,
  STANCE_ORDER,
  AREAS,
  ESTATE_STAGES,
  NAMES,
  RECIPES,
  MATERIALS,
  getMaterial,
  canCraft,
  QUESTS,
  MARKET_ITEMS,
  canBuy,
  getNode,
  reachableFrom,
  skillLevel,
  ACTIVITIES,
  MOBS,
  balance,
  NPC_NAME,
} from '../core';
import { LOG_FILTERS, logFilterMatches, type LogFilter } from './log-filter';
import { reconcileList, setText, toggle, setClass, setDisabled, setStyle } from './reconcile';
import {
  LOG_SCALE_MIN,
  LOG_SCALE_MAX,
  LOG_SCALE_STEP,
  clampLogScale,
  loadLogScale,
  saveLogScale,
} from './ui-prefs';
import type { Sfx } from './sfx';
// type-only (erased at compile → no runtime import) so the renderer can accept the DEV harness
// without pulling ui/dev.ts into the prod bundle. The dev value is undefined in prod (main.ts).
import type { DevApi } from './dev';

// rung-meter at which the R0 rake gains its auto-repeat toggle — a few manual rakes' worth
// (RUNG_POINTS_PER_ACT≈2), so the first rakes land as juice before the grind can be automated.
const RAKE_AUTO_REVEAL_METER = 10;

const META_LABELS: Record<'open_eyes' | 'rake_rice' | 'rest', string> = {
  open_eyes: 'Open your eyes',
  rake_rice: 'Rake the spilled rice',
  rest: 'Rest a moment',
};

// the active combat decision (kendo kamae) — kanji avoid the foe-tier word collision
// ('Steady'/'Even') used by the win-rate pips.
const STANCE_UI: Record<StanceId, { kanji: string; gloss: string; hint: string }> = {
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
const COLD_OPEN_TITLE = '神隠し';
const COLD_OPEN_ROMAN = 'Kamikakushi';
const COLD_OPEN_LEDE =
  'Dark. Straw against your cheek, the smell of wet rice, a low roof you do not know. Your name, your past — gone, as if the night swallowed them whole.';

// ── the interactive intro VN scene (D-104 / F43–F48) — the SOLE prod intro presentation ──
// Voice → on-palette colour: the nameplate seal + name take it (mirrors the log voice colours).
const VOICE_COLOR: Record<VoiceCategory, string> = {
  narrator: 'var(--ink-soft)',
  player: 'var(--rokusho)',
  physician: 'var(--ai)',
  steward: 'var(--ochre)',
  arms: 'var(--beni)',
  official: 'var(--kihada)',
  villager: 'var(--gold)',
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
const VOICE_SEAL: Record<VoiceCategory, string> = {
  narrator: '夢',
  player: '己',
  physician: '医',
  steward: '家',
  arms: '武',
  official: '官',
  villager: '里',
};
/** A kanji ink-seal nameplate (hanko idiom): a category-coloured seal + the speaker's name. */
function introNameplate(scene: DialogueScene): HTMLElement {
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
// pillar live + the rest as unnamed silhouettes, D-055 — see renderHouseInfluence.)

// The kura-works PURCHASE ladder (U1–U4, D-098) — indexed by estateStage. Stage 0 is
// the un-worked starting state; the flavour words are the estate's condition after each
// work. (The narrative CONDITION ladder E0–E5 is a separate axis, lives in the docs.)
const ESTATE_STAGE_NAMES = [
  "Foreclosure's edge",
  'U1 · Stabilising',
  'U2 · Recovering',
  'U3 · Prosperous',
  'U4 · Risen',
];

// Static pane blurbs — hoisted so the incremental (prod/test) path and the DEV-variant
// wholesale fallback render the SAME copy (single source of truth, no drift).
const MARKET_BLURB =
  'A pedlar passes now and then. A little of your OWN coin for the things you need — greens for the pot, wood to keep an edge. Your purse, not the house’s.';
const QUESTS_BLURB = 'Goals beyond the daily grind — take one on, then earn it in the field.';

const CHANNEL_BULLET: Record<LogChannel, string> = {
  narration: '',
  reward: '🌾',
  combat: '⚔️',
  system: '',
  // a quiet ink mark, not the red dot the human disliked (F56) — milestones read as progress, calmly.
  milestone: '❖',
};

const SEASON_TAG: Record<Season, { kanji: string; emoji: string; name: string }> = {
  spring: { kanji: '春', emoji: '🌸', name: 'Spring' },
  summer: { kanji: '夏', emoji: '🎐', name: 'Summer' },
  autumn: { kanji: '秋', emoji: '🍁', name: 'Autumn' },
  winter: { kanji: '冬', emoji: '❄️', name: 'Winter' },
};

const RESOURCE_LABEL: Record<string, string> = {
  coin: 'coin',
  rice: 'rice',
  wood: 'wood',
  sansai: 'sansai',
};

type Dispatch = (intent: Intent) => void;
// The six-tab IA (D-112): every capability lives in exactly one thematic tab, each revealed only
// once it has content (§3 of the IA reorg plan). Work R0 → Map/Estate/Inventory R1 → Character R2
// → Combat R3. `skills`/`quests` are folded into Character; `map` now means the node-map (nav's
// sole home), not the old "Estate 地図".
type Tab = 'work' | 'map' | 'estate' | 'inventory' | 'character' | 'combat';

export interface AppHooks {
  exportSave: () => string;
  importSave: (b64: string) => void;
  newGame: () => void;
  setReducedMotion: (on: boolean) => void;
  setTextScale: (scale: number) => void;
  togglePause: () => boolean;
  /** The synth SFX engine (T0-M1-F4 juice). Owned by the app; cue points fire via this. */
  sfx: Sfx;
}

export function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

// Coalesced-log display (consumes LogEntry.count from the pure core): when a line has
// repeated N×, multiply the authored single-resource "(+n unit)" suffix into a running
// total "…×N (+total unit)". Multi-resource / non-matching lines fall back to a bare
// "…×N" so a wrong total is impossible (the unit group excludes commas).
export function formatLogText(entry: LogEntry): string {
  const n = entry.count ?? 1;
  if (n <= 1) return entry.text;
  const m = entry.text.match(/^(.*?)\s*\(\+(\d+)\s+([^),]+)\)\s*$/);
  if (m) return `${m[1]} ×${n} (+${Number(m[2]) * n} ${m[3]})`;
  return `${entry.text} ×${n}`;
}

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

function buildSettings(hooks: AppHooks): { modal: HTMLElement; open: () => void } {
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

  // ── sub-tab bar (playtest F31): Settings · Saves · About ──
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
  // sound on/off (the synth SFX engine; default on — the ship default is the R1 taste call)
  const sound = el('button', 'auto-toggle', `Sound: ${hooks.sfx.isMuted() ? 'off' : 'on'}`);
  sound.type = 'button';
  sound.classList.toggle('on', !hooks.sfx.isMuted());
  sound.addEventListener('click', () => {
    const muted = !hooks.sfx.isMuted();
    hooks.sfx.setMuted(muted);
    sound.textContent = `Sound: ${muted ? 'off' : 'on'}`;
    sound.classList.toggle('on', !muted);
  });
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
  pause.addEventListener('click', () => {
    const p = hooks.togglePause();
    pause.textContent = p ? 'Resume' : 'Pause';
    pause.classList.toggle('on', p);
  });
  comfort.append(rm, sound, ts, pause);
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

  card.append(settingsSec, savesSec, aboutSec);
  showTab('about'); // default active tab — the human prefers opening on About (F33)

  scrim.append(card);
  return {
    modal: scrim,
    open: () => {
      opener = (document.activeElement as HTMLElement) ?? null;
      scrim.hidden = false;
      close.focus();
    },
  };
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
  // D-114 — the Map "who's here" open-conversation state (UI-only, like activeTab): the id of the
  // person you're currently TALKING to (their trade/greeting is open), or null. A `tiny` trader's
  // shop (the pedlar's wares) shows ONLY while he is the open person — talk-to-reveal, never inline.
  let openPersonId: string | null = null;
  let lastState: GameState | null = null;
  // ── the interactive intro VN scene (D-104) — the SOLE prod intro presentation. While the intro
  //    is live it HIDES the whole shell and mounts a full-screen scene on `root`; the estate inks
  //    in only AFTER the intro ends. The intro is APPEND-ONLY (F81): the scene shell is built ONCE
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
  // typewriter over the newly-appended block: its typing nodes + a per-line cursor (F62 click-advance).
  let introBlockNodes: { readonly span: HTMLElement; readonly text: string }[] = [];
  let introBlockIndex = -1; // index of the line currently revealing within the block (−1 ⇒ idle)
  let introLineTyping = false; // is that line still animating char-by-char?
  let introOnBlockDone: (() => void) | undefined; // fired when the block's LAST line completes
  let introTypeTimer: number | undefined; // the pending per-char step timeout
  let introAdvanceTimer: number | undefined; // the inter-line ~2s auto-advance timeout (F86)
  const introAuxTimers: number[] = []; // other pending intro timeouts (fresh-divider fades)
  // true for the SINGLE render on which the intro just ended, so the final beat's log lines paint
  // INSTANTLY as the shell reveals (F48 — no slow catch-up), not via the story cascade.
  let introEndingRender = false;

  const shell = el('div', 'shell paper');

  // ── title bar (the game's name + the settings entry) ──
  const titlebar = el('header', 'titlebar');
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
  settingsBtn.addEventListener('click', settings.open);
  // the Settings control now lives in the fixed footer (playtest F5); the titlebar shows the name.
  titlebar.append(title);
  shell.append(titlebar);

  // ── header / vitals ──
  const header = el('header', 'vitals');
  header.setAttribute('role', 'banner');
  const houseMark = el('span', 'house-mark');
  houseMark.lang = 'ja';
  houseMark.textContent = '黒沢家';
  header.append(houseMark);

  // D-107: two carried-wealth pills — RICE (raked/farmed) + COIN (the spendable currency, base
  // unit mon). Rice reveals on the cold open (readout-rice); coin holds back until the first wage
  // (readout-coin). koku is NOT a pill — it is House standing (surfaced elsewhere, Phase 4).
  const rice = vital('rice', 'rice');
  const coin = vital('coin', 'coin');
  const clock = el('div', 'vital clock');
  clock.hidden = true;
  const clockTag = el('span', 'season-tag');
  const clockDay = el('span', 'rate');
  clock.append(clockTag, clockDay);
  const stamina = el('div', 'vital stamina');
  stamina.hidden = true;
  stamina.append(el('span', 'label', 'body'));
  const staminaBar = el('div', 'bar');
  const staminaFill = el('span');
  staminaBar.append(staminaFill);
  stamina.append(staminaBar);
  // HP — a life-or-death meter once combat opens (D-076: HP accumulates, no auto-heal, a lost fight
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
  header.append(rice.wrap, coin.wrap, clock, health, stamina, wood.wrap, sansai.wrap);

  // ── nav (first appears at R2) ──
  const nav = el('nav', 'nav');
  nav.setAttribute('role', 'navigation');
  nav.hidden = true;

  // ── workspace ──
  const workspace = el('main', 'workspace');
  workspace.setAttribute('role', 'main');

  // F77 — sticky-bottom bookkeeping (declared before the log section so the scroll listener can
  // bind): the log auto-follows the newest line and STAYS pinned to the bottom as new lines arrive,
  // but leaves a reader who scrolled UP into history alone until they return to the foot.
  const LOG_STICK_THRESHOLD_PX = 24; // "at bottom" tolerance (sub-pixel scroll + a line's leading)
  let logPinnedToBottom = true;

  const logSection = el('section', 'log');
  logSection.setAttribute('aria-live', 'polite');
  logSection.setAttribute('aria-label', 'Story log');
  logSection.append(el('h2', undefined, 'The house remembers'));
  const logLines = el('div', 'log-lines');
  logSection.append(logLines);
  // Track whether the reader is pinned to the foot (within tolerance). Our own programmatic pin
  // fires this too and re-confirms `true`, so there's no fight with the auto-follow.
  logLines.addEventListener('scroll', () => {
    logPinnedToBottom =
      logLines.scrollHeight - logLines.scrollTop - logLines.clientHeight <= LOG_STICK_THRESHOLD_PX;
  });
  // the bottom filter bar (F9) — filters which channels show; Story leads, default 'story'.
  const logFilterBar = el('div', 'log-filter-bar');
  const logFilterBtns = new Map<LogFilter, HTMLButtonElement>();
  for (const f of LOG_FILTERS) {
    const b = el('button', 'log-filter-tab', f.label) as HTMLButtonElement;
    b.type = 'button';
    b.setAttribute('aria-label', `Show ${f.label} log`);
    b.addEventListener('click', () => setLogFilter(f.id));
    logFilterBtns.set(f.id, b);
    logFilterBar.append(b);
  }
  // F74 — the per-log FONT stepper (A− / A+), tucked bottom-right of the filter bar. It scales ONLY
  // the log's reading text (a log-scoped `--log-scale` CSS var on the log section → `.log-lines`
  // font-size), leaving the F73 chrome density alone. The choice PERSISTS in localStorage (the
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
  const workHead = el('h2', undefined, 'What you can do');
  const ladder = el('div', 'ladder');
  const estatePane = el('div', 'estate-pane');
  const marketPane = el('div', 'market-pane');
  const storehousePane = el('div', 'storehouse-pane');
  const influence = el('div', 'influence');
  const actions = el('div', 'actions');
  const skillsPane = el('div', 'skills-pane');
  const combatPane = el('div', 'combat-pane');
  const questsPane = el('div', 'quests-pane');
  const mapPane = el('div', 'map-pane');
  // IA reorg (D-112) — the Character tab's SPLIT-OUT halves of renderCombat: the attribute-training
  // rows + the bestiary field-guide (they live with the character sheet, not the fight surface).
  // Own containers so each is a build-once/patch surface on the Character tab (F81), and so the
  // per-tab anti-empty guard can see them (§7). Points are still EARNED in Combat (the coupling holds).
  const characterTrain = el('div', 'character-train');
  const characterBestiary = el('div', 'character-bestiary');
  // ── incremental-render refs (append-only migration, F81 generalised via ui/reconcile.ts) ──
  //    Each easy surface builds its card shell ONCE (lazily on first show) and PATCHES in place
  //    after, so an idle re-render of unchanged state produces zero DOM churn (meter transitions
  //    survive, focus survives, the ~2×/s tick stops flashing). null ⇒ not yet built.
  let ladderRefs: {
    card: HTMLElement;
    now: HTMLElement;
    fill: HTMLElement;
    hint: HTMLElement;
    next: HTMLElement;
  } | null = null;
  let estateRefs: {
    card: HTMLElement;
    now: HTMLElement;
    blurb: HTMLElement;
    hint: HTMLElement;
    btn: HTMLButtonElement;
    rooms: HTMLElement;
    roomList: HTMLElement;
  } | null = null;
  let storehouseRefs: {
    card: HTMLElement;
    when: HTMLElement;
    row: HTMLElement;
    dep: HTMLButtonElement;
    wd: HTMLButtonElement;
    // D-107 Phase 2 — rice deposit/withdraw, so the kura shelters rice beside coin (the D-113
    // loss-shelter now applies to rice too). deposit/withdraw are already resource-generic.
    riceRow: HTMLElement;
    depRice: HTMLButtonElement;
    wdRice: HTMLButtonElement;
    away: HTMLElement;
  } | null = null;
  // marketRefs — the buy rows + (D-107 Phase 2) the sell-rice faucet (season price + sell button).
  let marketRefs: {
    card: HTMLElement;
    rows: HTMLElement;
    sellPrice: HTMLElement;
    sellBtn: HTMLButtonElement;
  } | null = null;
  let questsRefs: { list: HTMLElement } | null = null;
  // renderHouseInfluence refs (IA reorg — migrated to append-only, F81). The card shell + the
  // koku headline/grade/bar/silhouettes are built ONCE and PATCHED in place; the structural
  // locked↔live↔ascended transitions swap named sub-sections via `hidden`, never a
  // `textContent=''` teardown. `mode` records the last-built structure so an idle re-render of the
  // same mode churns nothing (the zero-idle-churn invariant, §7). The DEV variant path stays
  // wholesale (it needs a fresh container each render for the toggle) and NULLS these refs.
  let influenceRefs: {
    mode: string;
    card: HTMLElement;
    // locked teaser
    lockedBlurb: HTMLElement;
    lockedFoot: HTMLElement;
    lockedSilhouettes: HTMLElement;
    // live standing
    liveBody: HTMLElement;
    koku: HTMLElement;
    grade: HTMLElement;
    bar: HTMLElement;
    fill: HTMLElement;
    ticks: HTMLElement;
    when: HTMLElement;
    horizon: HTMLElement;
    liveSilhouettes: HTMLElement;
    foot: HTMLElement; // the post-live footer (gate / ascend CTA / risen resolution)
    ascendBtn: HTMLButtonElement;
    boon: HTMLElement;
    frontier: HTMLElement;
  } | null = null;
  let mapRefs: {
    card: HTMLElement;
    loc: HTMLElement;
    kanji: HTMLElement;
    blurb: HTMLElement;
    paths: HTMLElement;
    pathsLabel: HTMLElement;
    strip: HTMLElement;
    // D-114 — the Map "who's here" section (built ONCE; the person rows reconcile). Hidden (F72
    // ghost-box) when no one is present, so an empty node never leaves a framed ghost card.
    whos: HTMLElement;
    whosList: HTMLElement;
  } | null = null;
  // ── Phase 2 (F81) — the two big flash offenders go incremental. `actions` (the Work hero, rebuilt
  //    ~2×/s) and `combatPane` (a 6-block composite) are split into named sub-containers built ONCE;
  //    each keyed section is a reconcileList, each per-tick bit is patched in place. `null` ⇒ not
  //    yet built. metaRow/areaGroups/watchList/craftHost are their own flex-gap sub-containers (see
  //    the `.actions-group`/`.combat-group` CSS) so wrapping doesn't collapse the parent's gap;
  //    they toggle `hidden` when empty so an empty section leaves no phantom flex-gap (F72).
  let actionsRefs: {
    metaRow: HTMLElement;
    wolfBox: HTMLElement;
    wolfBtn: HTMLButtonElement;
    wolfBlurb: HTMLElement;
    areaGroups: HTMLElement;
    noWork: HTMLElement;
    cookRow: HTMLElement;
    cookBtn: HTMLButtonElement;
    // D-107 Phase 2 — eat plain rice → satiety (the rice food path, beside cook).
    eatRiceRow: HTMLElement;
    eatRiceBtn: HTMLButtonElement;
  } | null = null;
  // IA reorg (D-112) — the Combat tab keeps ONLY the fight surface: XP · weapon · craft · stance ·
  // watch. Training (attrs) + the bestiary SPLIT OUT to the Character tab (their refs live in
  // characterRefs below); points are still EARNED from combat leveling (the coupling holds).
  let combatRefs: {
    xpNow: HTMLElement;
    xpFill: HTMLElement;
    xpHint: HTMLElement;
    wc: HTMLElement;
    wcName: HTMLElement;
    wcBand: HTMLElement;
    wcBlurb: HTMLElement;
    wctrl: HTMLElement;
    repairBtn: HTMLButtonElement;
    craftHost: HTMLElement;
    // lazily created on first reveal so a `.stance-row` never exists in the DOM before stance-control
    // unlocks (the A7 gate test asserts its absence at R3/R4).
    stanceHost: HTMLElement | null;
    watchHead: HTMLElement;
    watchEmpty: HTMLElement;
    watchList: HTMLElement;
  } | null = null;
  // characterRefs — the Character tab's SPLIT-OUT halves of combat (training attrs + bestiary),
  // each a build-once/patch surface (F81). Reveal at R3 (`readout-combat-level` / `panel-bestiary`).
  // Each half builds lazily + independently (both reveal at R3 in practice, but the refs never
  // assume the other is present), so a null field means "that half not yet built".
  let characterTrainRefs: { train: HTMLElement; trainPts: HTMLElement } | null = null;
  let characterBestiaryRefs: {
    host: HTMLElement;
    blurb: HTMLElement;
    list: HTMLElement;
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
  sliceDo.setAttribute('aria-label', 'Work');
  // IA reorg (D-112) — Phase A keeps the current byōbu DOM grouping; the SIX tabs are realised by
  // re-gating each pane's `activeTab` check (§6.3). Only the active tab's panes are ever visible, so
  // the slice grouping is unchanged for layout. The Do slice hosts every single-column tab surface:
  // Work labour, the node-Map, Estate improve-card, Character (skills + training + bestiary + quests),
  // and Combat. The market/storehouse/influence coin panes stay in the Estate slice (their tab
  // re-homes are Map/Inventory/Estate — self-gated, F100-style). Phase B (deferred) gives each tab
  // its own container section.
  sliceDo.append(
    workHead,
    actions,
    skillsPane,
    characterTrain,
    characterBestiary,
    combatPane,
    questsPane,
    mapPane,
    estatePane,
  );
  // P2 · Path & Progress — the rung ladder (appears at first rake, R0→R1).
  const sliceProgress = el('section', 'slice slice-progress');
  sliceProgress.dataset.panel = 'progress';
  sliceProgress.setAttribute('aria-label', 'Path & progress');
  sliceProgress.append(ladder);
  // P3 · Estate & Economy — the coin sinks (market/storehouse) + the R7 House-Influence capstone
  // (~R2). The estate-IMPROVE card (`estatePane`) moved to the Estate/map tab (F100, see sliceDo).
  const sliceEstate = el('section', 'slice slice-estate');
  sliceEstate.dataset.panel = 'estate';
  sliceEstate.setAttribute('aria-label', 'Estate & economy');
  sliceEstate.append(marketPane, storehousePane, influence);
  work.append(sliceDo, sliceProgress, sliceEstate);

  // P4 · the story-log — its OWN persistent slice (always present R0). It keeps its `.log`
  // styling untouched (classic looks identical); the slice classes only let byōbu widen it into
  // a reading column. It's never reveal-gated (the log is the diegetic hero surface).
  logSection.classList.add('slice', 'slice-log');
  logSection.dataset.panel = 'log';

  // the reveal-gated slices (P4 log persists, so it's excluded) — each hides when all its panes
  // are hidden, so early game is Do + Log only and the screen inks in as surfaces unlock.
  const gatedSlices = [sliceDo, sliceProgress, sliceEstate];

  // the story log lives in the RIGHT column (idle-RPG convention, playtest F8); the interactive
  // work/actions column sits on the LEFT (classic). Byōbu re-arranges the same DOM via CSS.
  workspace.append(work, logSection);

  // ── fixed footer bar (F5) — the version stamp + the Settings entry, pinned to the bottom ──
  const footer = el('footer', 'appbar-footer');
  footer.append(el('span', 'foot-meta', __VERSION__), settingsBtn);

  shell.append(header, nav, workspace, footer, settings.modal);

  // ── pre-awake cold-open title card (sibling to the shell; shown until 'awake') ──
  const coldOpen = el('div', 'coldopen');
  const coFrame = el('div', 'frame');
  const coTitle = el('h1');
  coTitle.lang = 'ja';
  coTitle.textContent = COLD_OPEN_TITLE;
  const coRoman = el('p', 'coldopen-roman', COLD_OPEN_ROMAN);
  const coLede = el('p', 'coldopen-lede', COLD_OPEN_LEDE);
  const coVerb = el('button', 'verb primary', META_LABELS.open_eyes);
  coVerb.type = 'button';
  coVerb.addEventListener('click', () => dispatch({ type: 'open_eyes' }));
  coFrame.append(coTitle, coRoman, coLede, coVerb);
  coldOpen.append(coFrame);

  root.append(coldOpen, shell);

  let firstRender = true;
  let coldOpenRevealStarted = false;
  let cancelColdOpenReveal: (() => void) | undefined;
  let lastKey = -1;
  let logFilter: LogFilter = 'story';
  // F20 — per-channel "highest key the reader has seen"; a tab whose channel has entries
  // beyond its seen-mark (that arrived while another tab was active) shows an unread dot.
  const logSeen: Record<LogFilter, number> = {
    story: -1,
    work: -1,
    combat: -1,
    progression: -1,
    all: -1,
    now: -1,
  };
  // F59 — one-shot: on the first awake log render the loaded entries are HISTORY (already seen),
  // so we seed every channel's `logSeen` to its max key. Unread dots then fire ONLY for entries
  // that arrive DURING the session, never for a save's back-history on page load / refresh.
  let logSeenSeeded = false;
  // F53 — the "Now" view's wall-clock state (render-only; the pure core never times this).
  // `nowSeen` stamps each ephemeral entry's first-shown Date.now() (keyed by entry key); a single
  // light interval fades + prunes lines past their TTL. Both are cleared on reset / filter-switch
  // so nothing leaks (the interval self-terminates the moment the filter leaves `now`).
  const NOW_TTL_MS = 15000; // a fleeting line lives ~15s from first appearance
  const NOW_FADE_MS = 900; // …and spends its last ~0.9s fading out
  const nowSeen = new Map<number, number>();
  // F58b — pending height-collapse timers (one per expiring Now line); tracked so a reset /
  // filter-switch tears them all down (leak-free, per the F53 discipline).
  const NOW_COLLAPSE_MS = 400; // an expired line collapses its height over ~0.4s so the rest glide up
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
  const LOG_DOM_MAX = 300; // mirrors core LOG_RING_MAX
  const revealQueue: LogEntry[] = [];
  let revealTimer: number | undefined;
  // P2 — GBA-style character-by-character typewriter for STORY lines (narration /
  // voiced dialogue) only. ~32ms/char reads deliberately; combat/reward/system spam
  // keeps the instant append. `typeTimer` is the in-flight per-char tick (cancelled on
  // reset/filter-clear like `revealTimer`); `finishTypeNow` finalizes the current line
  // instantly when the cascade has to catch up (the >12 flush valve).
  const TYPE_MS_PER_CHAR = 32; // GBA typewriter cadence (~30–34ms/char)
  const TYPE_NEXT_BEAT_MS = 180; // pause after a typed line before the next cascades in
  // F86 — the intro typewriter AUTO-ADVANCES: after a line finishes typing it holds for this beat,
  // then the next line starts on its own (no click needed). A click only ever SPEEDS this up — it
  // completes an in-flight line, or skips the remaining hold — it never pauses the sequence. Tunable.
  const INTRO_LINE_ADVANCE_MS = 2000;
  let typeTimer: number | undefined;
  let finishTypeNow: (() => void) | undefined;
  // F27 — a transient "fresh entries" divider dropped between history + new lines; self-fades.
  let freshDivider: HTMLElement | undefined;
  let freshDividerTimer: number | undefined;

  function setTab(tab: Tab): void {
    activeTab = tab;
    if (lastState) render(lastState, null);
  }

  // M1 reveal-gating — a slice is present only while at least one of its panes is visible AND
  // carries real content. F72 — a pane that returns early WITHOUT hiding its own container (it just
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
    work: 'Work',
    map: 'Map 地図',
    estate: 'Estate 家',
    inventory: 'Inventory 蔵',
    character: 'Character 己',
    combat: 'Combat 武',
  };
  // ── the six-tab reveal predicates (D-112 §3) — a tab's chip appears the render its PRIMARY content
  //    first unlocks, and NEVER before (the incremental-reveal signature). Each reuses an EXISTING
  //    surface predicate — NO new flags — and is the anti-empty-tab guard (§7) lifted to the tab
  //    level: it answers "would this tab have visible content if active?" WITHOUT switching activeTab.
  //    Work R0 always · Map/Estate/Inventory R1 · Character R2 · Combat R3.
  const TAB_ORDER: readonly Tab[] = ['work', 'map', 'estate', 'inventory', 'character', 'combat'];
  // does the Character tab have any visible content? — the true anti-empty guard (§7): a skill card
  // to show (skills visible via by-doing OR a skill row unlocked), OR the R3 sections (training /
  // bestiary), OR quests. Skills-only-but-no-skill (an isolated fixture) leaves it EMPTY → no chip.
  function characterHasContent(state: GameState): boolean {
    const skillsHaveCard =
      isUnlocked(state, 'tab-skills') &&
      SKILLS.some((def) => skillVisible(state, def.id) || isUnlocked(state, `skill-${def.id}`));
    return (
      skillsHaveCard ||
      isUnlocked(state, 'readout-combat-level') || // training (attrs)
      isUnlocked(state, 'panel-bestiary') || // the bestiary
      isUnlocked(state, 'tab-combat') // quests ("Undertakings 用")
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
        // the walkable node-map opens once the gate does (R1 — you can step off the kura floor). Nav's
        // sole home (F107); the market/pedlar lives here too, but the node-map is the primary content.
        return isUnlocked(state, 'room-gate-forecourt');
      case 'estate':
        // the kura-works improve card (panel-estate, ~R1) + House-Influence (joins at R3).
        return isUnlocked(state, 'panel-estate');
      case 'inventory':
        // the kura bank (carried vs stored coin/rice) — opens with the estate economy (default §8.2).
        return isUnlocked(state, 'panel-estate');
      case 'character':
        // Skills first (R2), attrs + bestiary + quests at R3 — but only once something actually shows.
        return characterHasContent(state);
      case 'combat':
        // the fight surface — watch + XP + weapon (tab-combat, R3).
        return isUnlocked(state, 'tab-combat');
    }
  }
  function visibleTabs(state: GameState): Tab[] {
    return TAB_ORDER.filter((t) => tabHasContent(state, t));
  }
  function renderNav(state: GameState): void {
    const tabs = visibleTabs(state);
    // the nav bar shows only once ≥2 tabs qualify (unchanged: appears at R1 when Map joins).
    toggle(nav, tabs.length >= 2);
    if (tabs.length < 2) return;
    // the activeTab-not-in-list fallback → 'work' (a tab that lost its content, or a stale save).
    if (!tabs.includes(activeTab)) activeTab = 'work';
    // the tab SET changes rarely (a chip lights up at a rung boundary), so a wholesale rebuild of a
    // handful of buttons only WHEN the set or the active tab changes is cheap + idle-churn-free. The
    // reconcileList keeps each chip's node stable across idle ticks (node-identity, F81 / §7).
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

  function renderLadder(state: GameState): void {
    // show the meter during R0 too (once you've raked) — the ladder used to hide until R1, leaving the
    // whole cold-open with no visible progress toward the first promotion (fun-factor "a next goal").
    // F72 — HIDE the container whenever there's nothing to show (off the Work tab OR the gate isn't
    // met yet), so an empty ladder never leaves the Progress slice as an empty framed ghost card.
    const show =
      activeTab === 'work' && (isUnlocked(state, 'panel-rung-ladder') || hasFlag(state, 'raked'));
    toggle(ladder, show);
    if (!show) return;
    // build the card shell ONCE (F81), then patch its mutable fields in place — the meter fill span
    // persists so its CSS width transition actually plays instead of snapping on every tick.
    if (!ladderRefs) {
      const card = el('div', 'rung-card frame');
      const now = el('div', 'rung-now');
      const meter = el('div', 'meter');
      const fill = el('span');
      meter.append(fill);
      const hint = el('div', 'rung-hint');
      const next = el('div', 'rung-next');
      card.append(now, meter, hint, next);
      ladder.append(card);
      ladderRefs = { card, now, fill, hint, next };
    }
    const rank = currentRank(state);
    const prog = rungProgress(state);
    // FULL meter but an unmet story-gate (e.g. auto-labour maxed the bar without ever fighting the
    // wolf): show the deed still owed, not a stuck "Estate service · N/N" — a maxed bar must never
    // read as a dead wall (fun-factor "always a visible next goal").
    const gated = prog.into >= prog.needed && !prog.ready;
    setText(ladderRefs.now, `${rank.title} · ${rank.kanji}`);
    // hold the fill just shy of full while gated, so a truly-full bar always means promotable.
    // Guard the fraction (needed is always >0, but a stray 0 would print `NaN%` = an empty ghost
    // meter right after a rung reset, F72), then clamp to a clean 0–100.
    const frac = prog.needed > 0 ? Math.max(0, Math.min(1, prog.into / prog.needed)) : 0;
    setStyle(ladderRefs.fill, 'width', `${gated ? 92 : Math.round(frac * 100)}%`);
    setText(
      ladderRefs.hint,
      prog.ready
        ? 'Ready to advance.'
        : gated
          ? (rank.advanceHint ?? 'The work is done — a deed still stands before the next rung.')
          : `Estate service · ${prog.into}/${prog.needed}`,
    );
    const nid = nextRankId(rank.id);
    if (nid) {
      const nextRank = getRank(nid);
      setClass(ladderRefs.next, 'frontier', false);
      setText(ladderRefs.next, `Next: ${nextRank.title} ${nextRank.kanji}`);
    } else {
      setClass(ladderRefs.next, 'frontier', true);
      setText(ladderRefs.next, 'Beyond the gate the road climbs on — to be continued.');
    }
  }

  // A8: the house physically REOPENS its rooms as your standing rises (omoya R4, workshops +
  // granary R6, the lord's study R7). Flavour — the estate's recovery made visible — not walkable
  // map nodes (the 7-node ceiling is untouched). Each row inks in when its rung reveal fires.
  const HOUSE_ROOMS: readonly { surface: string; kanji: string; label: string }[] = [
    { surface: 'house-omoya', kanji: '母屋', label: 'The main house reopened' },
    { surface: 'house-workshops', kanji: '工房', label: 'The workshops woken' },
    { surface: 'house-granary', kanji: '板倉', label: 'A new granary raised' },
    { surface: 'house-study', kanji: '書院', label: "The lord's study opened to you" },
  ];
  function renderEstate(state: GameState): void {
    // F100 (D-112) — the estate-improve card (kura-works flywheel) is the Estate tab's home. It
    // self-gates to the Estate tab; on every other tab it stays hidden (no ghost slice).
    const show = activeTab === 'estate' && isUnlocked(state, 'panel-estate');
    toggle(estatePane, show);
    if (!show) return;
    // build the shell ONCE (F81): the improve card carries every mutable child up front (blurb /
    // hint / button toggle in place); the house-rooms card is a keyed row list that grows.
    if (!estateRefs) {
      const card = el('div', 'rung-card frame');
      const now = el('div', 'rung-now');
      const blurb = el('div', 'skill-blurb');
      const hint = el('div', 'rung-hint');
      const btn = el('button', 'verb');
      btn.type = 'button';
      btn.addEventListener('click', () => dispatch({ type: 'improve_estate' }));
      card.append(now, blurb, hint, btn);
      estatePane.append(card);
      const rooms = el('div', 'rung-card frame');
      rooms.append(el('div', 'rung-now', 'The house reopens 家'));
      const roomList = el('div', 'house-room-list');
      rooms.append(roomList);
      estatePane.append(rooms);
      estateRefs = { card, now, blurb, hint, btn, rooms, roomList };
    }
    const r = estateRefs;
    const stage = state.estateStage;
    const name = ESTATE_STAGE_NAMES[stage] ?? ESTATE_STAGE_NAMES[ESTATE_STAGE_NAMES.length - 1]!;
    setText(r.now, `Estate · ${name}`);
    const next = ESTATE_STAGES.find((s) => s.stage === stage + 1);
    if (next) {
      toggle(r.blurb, true);
      setText(r.blurb, next.blurb);
      // the mechanical PAYOFF (the coin flywheel — the whole reason to sink coin into the estate),
      // read from the source-of-truth stage fields so it never drifts (R6: an invisible mechanic).
      setText(r.hint, `+${next.yieldBonusNum}% labour output · +${next.satietyMaxBonus} max body`);
      toggle(r.btn, true);
      setText(r.btn, `${next.label} (${formatCoin(next.coinCost)})`);
      const carried = state.resources.coin ?? 0;
      const banked = state.banked.coin ?? 0;
      setDisabled(r.btn, carried < next.coinCost);
      // don't lie "Needs N coin" when the coin is merely sitting safe in the kura — point at the bank.
      const title = r.btn.disabled
        ? banked >= next.coinCost
          ? 'Draw coin from the kura storehouse first'
          : `Needs ${formatCoin(next.coinCost)}`
        : '';
      if (r.btn.title !== title) r.btn.title = title;
    } else {
      toggle(r.blurb, false);
      toggle(r.btn, false);
      setText(r.hint, 'The estate stands restored.');
    }

    const opened = HOUSE_ROOMS.filter((room) => isUnlocked(state, room.surface));
    toggle(r.rooms, opened.length > 0);
    reconcileList(r.roomList, opened, {
      key: (room) => room.surface,
      build: (room) => el('div', 'rung-hint', `${room.kanji} · ${room.label}`),
      order: true,
    });
  }

  function silhouetteRow(): HTMLElement {
    // a pillar still to come — D-055: shown UNNAMED (a greyed silhouette), never spoiled. The greyed
    // ◆ ———— ghost-row already reads as "locked", so we drop the non-curated 🔒 that sat outside the
    // woodblock motif set (battery #21 color-discipline); the a11y label moves to the row so a screen
    // reader still announces it (the visual teaser itself stays aria-hidden).
    const row = el('div', 'influence-row silhouette');
    row.setAttribute('aria-label', 'A pillar yet to come (locked)');
    const name = el('span', 'influence-name');
    name.setAttribute('aria-hidden', 'true');
    const dot = el('span', 'pillar-dot locked', '◆');
    name.append(dot, document.createTextNode(' ————'));
    row.append(name);
    return row;
  }

  // shared koku-standing helpers (used by both the DEV wholesale path + the incremental patch).
  const LIVE_ARIA = "The House's koku standing";
  const LOCKED_ARIA = "The House's koku standing — opens once you are trusted of the house";
  function gradeWordFor(grade: ReturnType<typeof estateGrade>): string {
    return grade === 'EXCELLENT'
      ? 'Excellent 秀'
      : grade === 'GREAT'
        ? 'Great 優'
        : grade === 'GOOD'
          ? 'Good 良'
          : 'Unranked';
  }
  // the DEV-path ascension foot (a fresh wholesale build each render). The incremental prod/test
  // path toggles the equivalent foot sub-sections in place; only the DEV path appends fresh nodes.
  function appendInfluenceFoot(card: HTMLElement, state: GameState): void {
    const bands = balance.ESTATE_BANDS;
    const est = state.influence.estate;
    if (state.tier >= 1) {
      card.append(
        el(
          'div',
          'influence-foot',
          'You are a man of the house. 家産 stands Risen — the Estate is yours to raise, no longer merely to save.',
        ),
      );
      const pts = state.character.attributePoints;
      if (pts > 0) {
        card.append(
          el(
            'div',
            'influence-when',
            `The lord's boon waits on you: ${pts} point${pts === 1 ? '' : 's'} to spend at Training 鍛錬 on the Character 己 tab.`,
          ),
        );
      }
      card.append(
        el('div', 'rung-next frontier', 'Beyond the gate the road climbs on — to be continued.'),
      );
    } else if (ascensionAvailable(state)) {
      const btn = el('button', 'verb primary ascend-cta', 'Ascend — a man of the house');
      btn.type = 'button';
      btn.addEventListener('click', () => dispatch({ type: 'ascend' }));
      card.append(btn);
    } else {
      card.append(
        el(
          'div',
          'influence-foot lock-hint',
          `The House must stand at ${formatKMB(bands.excellent)} koku to ascend (${formatKMB(est.value)}/${formatKMB(bands.excellent)} koku).`,
        ),
      );
    }
  }

  // ── the House's koku standing (D-055/D-107) — migrated to append-only (F81). The card shell is
  //    built ONCE and PATCHED in place; the structural locked↔live↔ascended transitions swap named
  //    sub-sections via `hidden`, never a `textContent=''` teardown. IA reorg (D-112): the koku IS
  //    House standing → its home is the Estate tab. The DEV variant path stays wholesale. ──
  function renderHouseInfluence(state: GameState): void {
    // IA reorg (D-112 §2/§8.3) — the koku (House standing) moves from Work to the Estate tab.
    const show = activeTab === 'estate' && isUnlocked(state, 'panel-house-influence');
    toggle(influence, show);
    if (!show) return;

    const live = phaseOf(state) === 2; // the macro engine opens at the R7 capstone (D-055)
    const bands = balance.ESTATE_BANDS;

    // ── DEV variant path — a fresh wholesale build each render (the toggle needs a fresh container).
    //    Nulls the incremental refs so returning to the default rebuilds the shell cleanly. ──
    if (import.meta.env.DEV && dev) {
      influenceRefs = null;
      influence.textContent = '';
      const card = el('div', `influence-panel frame${live ? ' live' : ' locked'}`);
      card.setAttribute(
        'aria-label',
        live
          ? "The House's koku standing"
          : "The House's koku standing — opens once you are trusted of the house",
      );
      const head = el('div', 'rung-now');
      head.append(document.createTextNode('The House’s Standing '));
      const k = el('span', 'house-influence-kanji');
      k.lang = 'ja';
      k.textContent = '石高';
      head.append(k);
      card.append(head);
      if (!live) {
        card.append(
          el(
            'div',
            'skill-blurb',
            'How a house is truly weighed. Earn the trust of the house, and its measure opens to you.',
          ),
        );
        for (let i = 0; i < 4; i++) card.append(silhouetteRow());
        card.append(
          el('div', 'influence-foot lock-hint', 'Opens when you are Trusted of the house.'),
        );
        influence.append(card);
        return;
      }
      const est = state.influence.estate;
      const grade = estateGrade(state);
      const activeRow = el('div', 'influence-row active');
      const name = el('span', 'influence-name');
      const dot = el('span', 'pillar-dot estate', '◆');
      dot.setAttribute('aria-hidden', 'true');
      name.append(dot, document.createTextNode(' The House stands at '));
      const koku = el('span', 'koku-standing', formatKMB(est.value));
      name.append(koku, document.createTextNode(' koku'));
      activeRow.append(name);
      activeRow.append(
        el('span', `influence-grade grade-${grade.toLowerCase()}`, gradeWordFor(grade)),
      );
      card.append(activeRow);
      if (!dev.renderVariant('influence', card, state, dispatch)) {
        const bar = el('div', 'influence-bar');
        const fill = el('span', `influence-fill grade-${grade.toLowerCase()}`);
        fill.style.width = `${Math.min(100, Math.round((est.value / bands.excellent) * 100))}%`;
        bar.append(fill);
        for (const t of [bands.good, bands.great, bands.excellent]) {
          const tick = el('span', 'influence-tick');
          tick.style.left = `${Math.round((t / bands.excellent) * 100)}%`;
          bar.append(tick);
        }
        card.append(bar);
        card.append(
          el(
            'div',
            'influence-when',
            `The season re-assesses at ${formatKMB(est.highWater)} koku.`,
          ),
        );
        card.append(
          el(
            'div',
            'influence-when koku-horizon',
            `The road runs on toward daimyō 大名 — at ${balance.DAIMYO_KOKU.toLocaleString('en-US')} koku.`,
          ),
        );
      }
      for (let i = 0; i < 3; i++) card.append(silhouetteRow());
      appendInfluenceFoot(card, state);
      influence.append(card);
      return;
    }

    // ── prod / test — build the persistent shell ONCE (F81), then patch/toggle in place. ──
    if (!influenceRefs) {
      const card = el('div', 'influence-panel frame');
      const head = el('div', 'rung-now');
      head.append(document.createTextNode('The House’s Standing '));
      const k = el('span', 'house-influence-kanji');
      k.lang = 'ja';
      k.textContent = '石高';
      head.append(k);
      card.append(head);

      // locked teaser sub-tree (shown pre-capstone) — the blurb + 4 silhouettes + a lock-foot.
      const lockedBlurb = el(
        'div',
        'skill-blurb',
        'How a house is truly weighed. Earn the trust of the house, and its measure opens to you.',
      );
      const lockedSilhouettes = el('div', 'influence-silhouettes');
      for (let i = 0; i < 4; i++) lockedSilhouettes.append(silhouetteRow());
      const lockedFoot = el(
        'div',
        'influence-foot lock-hint',
        'Opens when you are Trusted of the house.',
      );
      card.append(lockedBlurb, lockedSilhouettes, lockedFoot);

      // live standing sub-tree (shown at the capstone) — the koku headline, grade bar, re-assess +
      // horizon lines, 3 silhouettes, and the ascension foot (gate / CTA / risen resolution).
      const liveBody = el('div', 'influence-live');
      const activeRow = el('div', 'influence-row active');
      const name = el('span', 'influence-name');
      const dot = el('span', 'pillar-dot estate', '◆');
      dot.setAttribute('aria-hidden', 'true');
      name.append(dot, document.createTextNode(' The House stands at '));
      const koku = el('span', 'koku-standing');
      name.append(koku, document.createTextNode(' koku'));
      const grade = el('span', 'influence-grade');
      activeRow.append(name, grade);
      const bar = el('div', 'influence-bar');
      const fill = el('span', 'influence-fill');
      bar.append(fill);
      const ticks = el('span', 'influence-ticks');
      // the 3 ticks (GOOD / GREAT / EXCELLENT) are structural — built once; left% patched in place.
      for (let i = 0; i < 3; i++) ticks.append(el('span', 'influence-tick'));
      bar.append(ticks);
      const when = el('div', 'influence-when');
      const horizon = el('div', 'influence-when koku-horizon');
      const liveSilhouettes = el('div', 'influence-silhouettes');
      for (let i = 0; i < 3; i++) liveSilhouettes.append(silhouetteRow());
      // the ascension foot — three mutually-exclusive states toggled in place: the risen resolution
      // (tier≥1: foot + optional boon + frontier), the ascend CTA, or the koku gate (foot).
      const foot = el('div', 'influence-foot');
      const ascendBtn = el('button', 'verb primary ascend-cta', 'Ascend — a man of the house');
      ascendBtn.type = 'button';
      ascendBtn.addEventListener('click', () => dispatch({ type: 'ascend' }));
      const boon = el('div', 'influence-when');
      const frontier = el(
        'div',
        'rung-next frontier',
        'Beyond the gate the road climbs on — to be continued.',
      );
      liveBody.append(
        activeRow,
        bar,
        when,
        horizon,
        liveSilhouettes,
        foot,
        ascendBtn,
        boon,
        frontier,
      );
      card.append(liveBody);

      influence.append(card);
      influenceRefs = {
        mode: '',
        card,
        lockedBlurb,
        lockedFoot,
        lockedSilhouettes,
        liveBody,
        koku,
        grade,
        bar,
        fill,
        ticks,
        when,
        horizon,
        liveSilhouettes,
        foot,
        ascendBtn,
        boon,
        frontier,
      };
    }
    const r = influenceRefs;
    // structural toggle: locked teaser vs live standing (a rare transition, at the R7 capstone).
    setClass(r.card, 'live', live);
    setClass(r.card, 'locked', !live);
    if (r.card.getAttribute('aria-label') !== (live ? LIVE_ARIA : LOCKED_ARIA))
      r.card.setAttribute('aria-label', live ? LIVE_ARIA : LOCKED_ARIA);
    toggle(r.lockedBlurb, !live);
    toggle(r.lockedSilhouettes, !live);
    toggle(r.lockedFoot, !live);
    toggle(r.liveBody, live);
    if (!live) return;

    // ── Phase 2 — the House's live koku STANDING. Patch the number/grade/bar in place. ──
    const est = state.influence.estate;
    const grade = estateGrade(state);
    setText(r.koku, formatKMB(est.value));
    setText(r.grade, gradeWordFor(grade));
    if (r.grade.className !== `influence-grade grade-${grade.toLowerCase()}`)
      r.grade.className = `influence-grade grade-${grade.toLowerCase()}`;
    setStyle(r.fill, 'width', `${Math.min(100, Math.round((est.value / bands.excellent) * 100))}%`);
    if (r.fill.className !== `influence-fill grade-${grade.toLowerCase()}`)
      r.fill.className = `influence-fill grade-${grade.toLowerCase()}`;
    const tickAt = [bands.good, bands.great, bands.excellent];
    for (let i = 0; i < 3; i++) {
      setStyle(
        r.ticks.children[i] as HTMLElement,
        'left',
        `${Math.round((tickAt[i]! / bands.excellent) * 100)}%`,
      );
    }
    setText(r.when, `The season re-assesses at ${formatKMB(est.highWater)} koku.`);
    setText(
      r.horizon,
      `The road runs on toward daimyō 大名 — at ${balance.DAIMYO_KOKU.toLocaleString('en-US')} koku.`,
    );

    // ── the ascension foot — three mutually-exclusive states toggled in place (D-049/D-062). ──
    const risen = state.tier >= 1;
    const canAscend = !risen && ascensionAvailable(state);
    toggle(r.ascendBtn, canAscend);
    if (risen) {
      // the AFTER of the payoff (F2) — the resolved risen next-state, NOT the stale gate prompt.
      toggle(r.foot, true);
      setClass(r.foot, 'lock-hint', false);
      setText(
        r.foot,
        'You are a man of the house. 家産 stands Risen — the Estate is yours to raise, no longer merely to save.',
      );
      const pts = state.character.attributePoints;
      toggle(r.boon, pts > 0);
      if (pts > 0)
        setText(
          r.boon,
          `The lord's boon waits on you: ${pts} point${pts === 1 ? '' : 's'} to spend at Training 鍛錬 on the Character 己 tab.`,
        );
      toggle(r.frontier, true);
    } else {
      toggle(r.boon, false);
      toggle(r.frontier, false);
      if (canAscend) {
        toggle(r.foot, false);
      } else {
        // the koku gate — the House must stand at EXCELLENT to ascend.
        toggle(r.foot, true);
        setClass(r.foot, 'lock-hint', true);
        setText(
          r.foot,
          `The House must stand at ${formatKMB(bands.excellent)} koku to ascend (${formatKMB(est.value)}/${formatKMB(bands.excellent)} koku).`,
        );
      }
    }
  }

  /** The reachable-neighbour move buttons (`→ node`, danger ⚠ + the conditioning lock). The Map tab's
   *  navigation (F107 — nav's sole home after the IA reorg). Returns null when nowhere is walkable
   *  from here. `keyPrefix` keeps the described-by ids unique. */
  function moveStrip(state: GameState, keyPrefix: string): HTMLElement | null {
    const revealed = new Set(state.unlocked);
    const moves = reachableFrom(state.location, revealed);
    if (moves.length === 0) return null;
    const RES_WORD: Record<string, string> = {
      rice: 'rice',
      coin: 'coin',
      wood: 'wood',
      sansai: 'greens',
    };
    const movesEl = el('div', 'map-moves');
    for (const n of moves) {
      const danger = n.dangerRing === true;
      const gated = danger && skillLevel(state, 'conditioning') < balance.CONDITIONING_GATE_LEVEL;
      const btn = el('button', `verb map-move${danger ? ' danger' : ''}`);
      btn.type = 'button';
      btn.append(document.createTextNode(`→ ${n.label} `));
      if (n.kanji) {
        const k = el('span');
        k.lang = 'ja';
        k.textContent = n.kanji;
        btn.append(k);
      }
      // danger as an INK mark, not a filter-skipping ⚠ emoji (ui-design §7); colour is on .map-danger.
      // lang=ja so a screen reader announces 険 like the destination kanji, not as English (a11y).
      if (danger) {
        const mark = el('span', 'map-danger', ' 険');
        mark.lang = 'ja';
        btn.append(mark);
      }
      btn.disabled = gated;
      if (gated) btn.title = `Needs Conditioning Lv${balance.CONDITIONING_GATE_LEVEL}`;
      btn.addEventListener('click', () => dispatch({ type: 'move_to', to: n.id }));
      movesEl.append(btn);
      // "what's here" — derived from content so you don't navigate blind: what you gather, who stirs
      // (named only once you've fought it — scout-by-fighting fog), and the kura storehouse.
      const yields = new Set<string>();
      for (const a of ACTIVITIES) {
        if (a.area === n.id && isUnlocked(state, a.surface)) {
          for (const r of Object.keys(a.yields)) yields.add(RES_WORD[r] ?? r);
        }
      }
      const foe = MOBS.find((m) => !m.scripted && m.area === n.id);
      const hints = [...yields];
      if (foe)
        hints.push(hasFlag(state, `mob-${foe.id}`) ? foe.label.toLowerCase() : 'a foe stirs');
      if (n.id === 'kura') hints.push('the storehouse');
      // Tie the yields/foe context + the gate reason to the button via aria-describedby, so a
      // screen-reader user tabbing the buttons hears them, not just the bare 険 glyph (a11y §5.9).
      // The keyPrefix keeps ids unique when the strip renders on both the Map and Work tabs at once.
      const describedBy: string[] = [];
      if (hints.length) {
        const hint = el('div', 'map-move-hint', hints.join(' · '));
        hint.id = `move-hint-${keyPrefix}-${n.id}`;
        describedBy.push(hint.id);
        movesEl.append(hint);
      }
      // the gate reason, VISIBLE (not a hover-only title on a disabled button — ui-design §5.9/§8).
      if (gated) {
        const lock = el(
          'div',
          'lock-hint',
          `Needs Conditioning Lv${balance.CONDITIONING_GATE_LEVEL}`,
        );
        lock.id = `move-lock-${keyPrefix}-${n.id}`;
        describedBy.push(lock.id);
        movesEl.append(lock);
      }
      if (describedBy.length) btn.setAttribute('aria-describedby', describedBy.join(' '));
    }
    return movesEl;
  }

  // ── the interactive intro VN scene (D-104 / F47) — the dialogue TREE: meet → ask → decide ──
  // A full-screen washi surface mounted on `root` that HIDES the shell. The scene reads the SCENE
  // TREE (`introSceneAt`): a nameplate + a LEFT transcript column (greeting + every asked Q/A + the
  // chosen reply) where each fragment types on the GBA typewriter as it FIRST appears, and a RIGHT
  // interactive column gated ask → decide → outcome. The model is APPEND-ONLY (F81): the shell is
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
  // pin the LEFT transcript column to its newest line (F84) — the .vn-lines' scroll parent (.vn-story).
  function introScrollToBottom(): void {
    const scroller = introStoryLinesEl?.parentElement;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }
  // clear every pending intro timeout WITHOUT tearing down the DOM (F81 — timer cleanup ≠ teardown).
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
    introLineTyping = false;
  }
  // the fade-away "fresh entries" divider — the SAME idiom the main log uses (F27/F54), reused here
  // (identical `.log-fresh-divider` node) so a resolved choice's new lines are marked, then self-fade.
  function buildFreshDividerNode(): HTMLElement {
    const d = el('div', 'log-fresh-divider');
    d.append(el('span', undefined, '新 · new'));
    return d;
  }
  function dropIntroFreshDivider(): void {
    if (!introStoryLinesEl) return;
    const d = buildFreshDividerNode();
    introStoryLinesEl.append(d);
    const t = window.setTimeout(() => {
      d.classList.add('fading');
      window.setTimeout(() => d.remove(), 800);
    }, 4500);
    introAuxTimers.push(t);
  }
  // FULL teardown — fires ONLY on a scene change or when the intro ends, never on an in-scene update.
  function teardownIntroScene(): void {
    clearIntroTimers();
    introScene?.remove();
    introScene = null;
    introSceneCurrentId = null;
    introStoryLinesEl = null;
    introPanelEl = null;
    introAskEl = null;
    introDecideEl = null;
    introOutcomeEl = null;
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
  // (NPC or player — F88); `player` flags the player's own lines (the player colour); `fresh` marks a
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
  function introTranscript(scene: DialogueScene, state: GameState): VnEntry[] {
    const out: VnEntry[] = [];
    scene.greeting.forEach((line, i) =>
      out.push({ key: `greet:${i}`, voice: line.voice, text: line.text, speaker: line.speaker }),
    );
    const askedForScene = state.askedTopics
      .map((id) => scene.topics.find((t) => t.id === id))
      .filter((t): t is DialogueTopic => t !== undefined);
    for (const t of askedForScene) {
      out.push({
        key: `askq:${t.id}`,
        voice: 'player',
        text: t.label,
        speaker: PLAYER_SPEAKER,
        player: true,
      });
      t.answer.forEach((line, i) =>
        out.push({
          key: `answ:${t.id}:${i}`,
          voice: line.voice,
          text: line.text,
          speaker: line.speaker,
        }),
      );
    }
    const pending = pendingChoiceId ? introSceneOption(scene, pendingChoiceId) : undefined;
    // the decision prompt joins the transcript once we're deciding (so it, too, TYPES — F82/F83).
    if (introPhase === 'decide' || pending)
      out.push({ key: 'prompt', voice: 'narrator', text: scene.decision.prompt, prompt: true });
    if (pending) {
      out.push({
        key: `say:${pending.id}`,
        voice: 'player',
        text: pending.say,
        speaker: PLAYER_SPEAKER,
        player: true,
        fresh: true,
      });
      out.push({
        key: `react:${pending.id}`,
        voice: beatReactVoice(scene),
        text: pending.react,
        speaker: beatReactSpeaker(scene),
        fresh: true,
      });
    }
    return out;
  }

  // ── the per-block typewriter (F62/F78) — types the NEWLY-appended lines one at a time; a click on
  //    the scene completes the current line (if mid-type) or advances to the next (one line/click). ──
  function introFinishBlock(): void {
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
  // Arm the ~2s inter-line hold, then AUTO-START the next line (F86) — no click needed. Guards the
  // timer to a single pending instance so a click racing the auto-fire can't double-advance.
  function scheduleIntroAutoAdvance(): void {
    if (introAdvanceTimer !== undefined) return; // already armed — never stack two
    introAdvanceTimer = window.setTimeout(() => {
      introAdvanceTimer = undefined;
      if (introBlockIndex < introBlockNodes.length - 1) introStartLine(introBlockIndex + 1);
    }, INTRO_LINE_ADVANCE_MS);
  }
  function introLineComplete(): void {
    introLineTyping = false;
    if (introBlockIndex >= introBlockNodes.length - 1) introFinishBlock();
    else scheduleIntroAutoAdvance(); // F86 — auto-advance after a beat; a click only speeds it up
  }
  function introStartLine(index: number): void {
    introBlockIndex = index;
    introScrollToBottom();
    const node = introBlockNodes[index];
    if (!node || node.text.length === 0) {
      introLineComplete();
      return;
    }
    introLineTyping = true;
    let i = 0;
    const step = (): void => {
      introTypeTimer = undefined;
      i += 1;
      node.span.textContent = node.text.slice(0, i);
      introScrollToBottom(); // F84 — stick to the bottom as each char lands
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
    for (const n of introBlockNodes) n.span.textContent = n.text;
    introFinishBlock();
  }
  // A click on the scene SPEEDS UP the auto-advancing typewriter (F86) — it never pauses it.
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
      if (node) node.span.textContent = node.text;
      introLineComplete();
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
    if (entries.some((e) => e.fresh)) dropIntroFreshDivider(); // F76 — mark a resolved-choice block
    const nodes: { span: HTMLElement; text: string }[] = [];
    for (const e of entries) {
      const p = el('p', `vn-line${e.prompt ? ' vn-prompt-line' : ''}`);
      p.style.color = VOICE_COLOR[e.voice]; // the speaker's on-palette voice colour (F26 idiom)
      // F88/F50 — EVERY voiced line carries its speaker-name prefix ("Sōan: " / "Genemon: " / "You: "),
      // not just the player's: the NAME is the primary "who's talking" signal, colour only reinforces
      // it. The narrator/decision-prompt line has no speaker ⇒ no prefix. The name paints instantly;
      // only the speech itself types in.
      if (e.speaker) p.append(el('span', 'vn-speaker', `${e.speaker}: `));
      const span = el('span', 'vn-text');
      p.append(span);
      introStoryLinesEl?.append(p);
      introRenderedKeys.add(e.key);
      if (instant) span.textContent = e.text;
      else nodes.push({ span, text: e.text });
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

  // ── the RIGHT panel — a STABLE, always-present region (F79): its sub-panels swap in place, never
  //    a teardown. The active one fades in ONCE (F78) after the left text finishes; the others hide. ──
  type PanelKind = 'ask' | 'decide' | 'outcome';
  function activePanelKind(): PanelKind {
    return pendingChoiceId ? 'outcome' : introPhase;
  }
  function activePanelEl(): HTMLElement | null {
    const kind = activePanelKind();
    return kind === 'ask' ? introAskEl : kind === 'decide' ? introDecideEl : introOutcomeEl;
  }
  // is the active sub-panel already revealed? (F90 — lets an idle tick skip the reveal entirely.)
  function activePanelShown(): boolean {
    const elx = activePanelEl();
    return !!elx && !elx.hidden;
  }
  function showPanel(elx: HTMLElement | null, on: boolean): void {
    if (!elx) return;
    if (on) {
      if (elx.hidden) {
        elx.hidden = false;
        elx.classList.add('vn-panel-in'); // soft staggered fade/rise (auto-zeroed for reduced-motion)
      }
    } else if (!elx.hidden) {
      elx.hidden = true;
      elx.classList.remove('vn-panel-in');
    }
  }
  // build the outcome sub-panel (perk box + Continue) the first time a choice is latched.
  function ensureOutcomePanel(scene: DialogueScene): void {
    if (introOutcomeEl || !introPanelEl) return;
    const opt = pendingChoiceId ? introSceneOption(scene, pendingChoiceId) : undefined;
    if (!opt) return;
    const wrap = el('div', 'vn-outcome');
    wrap.hidden = true;
    wrap.append(buildIntroPerkBox(opt, opt.stat.up as AttrId | undefined));
    const cont = el('button', 'verb intro-continue', 'Continue');
    cont.type = 'button';
    // the ONLY control that advances the scene (dispatches `choose_intro`) — picking never jumps.
    cont.addEventListener('click', () => dispatch({ type: 'choose_intro', optionId: opt.id }));
    wrap.append(cont);
    introPanelEl.append(wrap);
    introOutcomeEl = wrap;
  }
  // reveal the active sub-panel (fade once) + hide the others. Called after a block finishes typing.
  function revealActivePanel(scene: DialogueScene): void {
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
  // rebuild (F81), so the panel stays static (F79).
  function reconcileAskHub(scene: DialogueScene, state: GameState): void {
    if (!introAskEl) return; // decision-only scene → no ask hub
    const topicsWrap = introAskEl.querySelector<HTMLElement>('.vn-ask-topics');
    if (!topicsWrap) return;
    const asked = new Set(state.askedTopics);
    for (const t of availableTopics(scene, asked)) {
      let b = introTopicBtns.get(t.id);
      if (!b) {
        b = el('button', 'intro-ask', t.label);
        b.type = 'button';
        b.addEventListener('click', () => dispatch({ type: 'ask_topic', topicId: t.id }));
        introTopicBtns.set(t.id, b);
        topicsWrap.append(b);
        if (!introInstant()) b.classList.add('vn-panel-in'); // a newly-surfaced topic fades in
      }
      if (asked.has(t.id) && !b.classList.contains('asked')) {
        b.classList.add('asked');
        b.title = 'Asked — ask again';
      }
    }
  }

  // ── build the scene SHELL exactly ONCE per scene (F81); reconcileIntro then only appends/mutates. ──
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
  function buildDecidePanel(scene: DialogueScene): HTMLElement {
    const decide = el('div', 'vn-decide');
    decide.hidden = true;
    const choices = el('div', 'vn-choices vn-grid');
    for (const opt of scene.decision.options) {
      const attr = opt.stat.up as AttrId | undefined;
      const b = el('button', 'verb intro-choice', opt.label);
      b.type = 'button';
      // theme by the POSITIVE (+1) attribute; a pure-flavour choice with none falls back to --ai.
      b.style.setProperty('--attr-accent', attr ? ATTR_COLOR[attr] : 'var(--ai)');
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
  function buildIntroShell(scene: DialogueScene): void {
    const root_ = el('div', 'vn-scene');
    const card = el('div', 'vn-card frame');
    card.append(introNameplate(scene));
    // TWO columns: LEFT = the diegetic transcript (the ONLY place text renders; scrolls internally,
    // fixed height so the card never resizes — F80/F84); RIGHT = the stable interactive panel (F79).
    const body = el('div', 'vn-body');
    const story = el('div', 'vn-story');
    const lines = el('div', 'vn-lines');
    story.append(lines);
    const panel = el('div', 'vn-panel');
    body.append(story, panel);
    card.append(body);
    root_.append(card);
    // a click on the scene (not on a control) advances the typewriter by one line (F62).
    root_.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('button')) return;
      introAdvance();
    });
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
  // the panel in place. NEVER a teardown/rebuild within a scene (that was the flash — F81).
  function reconcileIntro(scene: DialogueScene, state: GameState): void {
    introLastState = state;
    reconcileAskHub(scene, state); // dim asked / surface newly-gated topics (in place)
    const fresh = introTranscript(scene, state).filter((e) => !introRenderedKeys.has(e.key));
    if (fresh.length > 0) {
      hideStalePanels(activePanelKind()); // clear stale controls before the new block types
      introAppendBlock(fresh, () => revealActivePanel(scene));
    } else if (introBlockNodes.length === 0 && !activePanelShown()) {
      // no new text, nothing mid-type, and the active panel isn't yet up ⇒ a pure panel swap (Done)
      // that needs its first reveal. Once it IS shown, an idle tick does NOTHING here — no re-fade,
      // no scroll yank — so a re-render of unchanged intro state can never flicker (F90).
      revealActivePanel(scene);
    }
  }
  // The intro perk box — the same JRPG frame as the log-line perk box (`buildPerkBox`), but themed
  // by the attribute the choice grants +1: an accent bar + a filled attribute KANJI chip, so the
  // perk visibly "belongs" to its stat. A pure-flavour choice (no attr) falls back to the neutral box.
  function buildIntroPerkBox(opt: IntroOption, attr: AttrId | undefined): HTMLElement {
    const wrap = el('div', 'intro-perk-line');
    buildPerkBox(wrap, {
      name: opt.perk.name,
      desc: opt.perk.desc,
      mechanics: introStatDelta(opt.stat),
    });
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
    const scene = introSceneAt(state.introBeat);
    if (!scene) {
      teardownIntroScene(); // the intro ended → drop the scene, reset everything
      return;
    }
    if (scene.id !== introSceneCurrentId) {
      teardownIntroScene(); // a new scene ⇒ the one place we rebuild the shell wholesale
      introSceneCurrentId = scene.id;
      // a decision-only scene (the dream — no topics) opens straight in the decide phase.
      introPhase = scene.topics.length > 0 ? 'ask' : 'decide';
      pendingChoiceId = null;
      buildIntroShell(scene);
    }
    reconcileIntro(scene, state);
  }

  // ── Phase 2 shared strip mount — moveStrip() is a self-contained keyed strip; rather than
  //    re-key its interleaved button/hint/lock siblings (a structural churn that would break the
  //    flat .map-moves flex), we build it fresh OFF-DOM and only swap it into the mounted container
  //    when it actually CHANGED (isEqualNode). An idle re-render sees an identical strip ⇒ zero
  //    churn on the live pane (the throwaway node never touches the DOM), while a real move rebuilds
  //    it. Returns whether the strip has any moves (so the caller can hide an empty wrapper). ──
  function patchStrip(container: HTMLElement, state: GameState, keyPrefix: string): boolean {
    const strip = moveStrip(state, keyPrefix);
    if (!strip) {
      if (container.firstChild) container.textContent = '';
      return false;
    }
    const existing = container.firstElementChild;
    if (existing && existing.isEqualNode(strip)) return true; // unchanged ⇒ keep the live node
    container.textContent = '';
    container.append(strip);
    return true;
  }

  // build ONE labour row (verb + auto-toggle + lock-hint, all present); patch toggles which show +
  // the disabled/on state in place. The auto-toggle NODE survives every re-render (F81) so the
  // button the player is watching never loses focus / re-creates mid-auto-run.
  function buildLabourRow(o: LabourOption): HTMLElement {
    const row = el('div', 'labour-row');
    const btn = el('button', 'verb', o.activity.label);
    btn.type = 'button';
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
  function patchLabourRow(row: HTMLElement, o: LabourOption, state: GameState): void {
    const btn = row.children[0] as HTMLButtonElement;
    const auto = row.children[1] as HTMLButtonElement;
    const lock = row.children[2] as HTMLElement;
    setDisabled(btn, !o.available);
    const btnTitle = !o.available && o.reason ? o.reason : '';
    if (btn.title !== btnTitle) btn.title = btnTitle;
    if (o.available) {
      toggle(auto, true);
      toggle(lock, false);
      const on = state.autoActivity === o.activity.id;
      setClass(auto, 'on', on);
      setText(auto, on ? '■ stop' : '▶ auto');
      const pressed = String(on);
      if (auto.getAttribute('aria-pressed') !== pressed) auto.setAttribute('aria-pressed', pressed);
    } else {
      toggle(auto, false);
      toggle(lock, !!o.reason);
      if (o.reason) setText(lock, o.reason);
    }
  }

  function renderActions(state: GameState): void {
    toggle(actions, activeTab === 'work');
    if (activeTab !== 'work') return;

    // (the interactive intro no longer renders here — while it's live the shell is hidden and the
    // full-screen VN scene owns the screen; render() returns before renderActions is ever reached.)

    // build the section skeleton ONCE (F81): named sub-containers in the same order the old wholesale
    // build produced, each patched/reconciled in place after. `.actions-group` gives the reconciled
    // sections the parent's flex-gap so wrapping doesn't collapse the button stack.
    if (!actionsRefs) {
      const metaRow = el('div', 'actions-group');
      const wolfBox = el('div', 'wolf-box');
      const wolfBtn = el('button', 'verb primary');
      wolfBtn.type = 'button';
      wolfBtn.append(
        el('span', 'emoji', '⚔️'),
        document.createTextNode(' Face the wolf at the grain store'),
      );
      wolfBtn.addEventListener('click', () => dispatch({ type: 'face_wolf' }));
      const wolfBlurb = el(
        'p',
        'area-blurb',
        'The grain-store wolf still waits where you woke. Use the Map 地図 tab to walk back to the kura (蔵) and face it.',
      );
      wolfBox.append(wolfBtn, wolfBlurb);
      const areaGroups = el('div', 'actions-group');
      const noWork = el(
        'p',
        'area-blurb',
        'No work to be had where you stand — open the Map 地図 tab to walk on.',
      );
      const cookRow = el('div', 'labour-row');
      const cookBtn = el('button', 'verb');
      cookBtn.type = 'button';
      cookBtn.addEventListener('click', () => dispatch({ type: 'cook_meal' }));
      cookRow.append(cookBtn);
      const eatRiceRow = el('div', 'labour-row');
      const eatRiceBtn = el('button', 'verb');
      eatRiceBtn.type = 'button';
      eatRiceBtn.addEventListener('click', () => dispatch({ type: 'eat_rice' }));
      eatRiceRow.append(eatRiceBtn);
      // F107 (D-112) — the "Walk on 道" nav strip is GONE from Work: the Map tab is navigation's
      // SOLE home. Labour is all the Work tab holds now.
      actions.append(metaRow, wolfBox, areaGroups, noWork, cookRow, eatRiceRow);
      actionsRefs = {
        metaRow,
        wolfBox,
        wolfBtn,
        wolfBlurb,
        areaGroups,
        noWork,
        cookRow,
        cookBtn,
        eatRiceRow,
        eatRiceBtn,
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
          btn.addEventListener('click', () => dispatch({ type: 'rake_rice' }));
          const auto = el('button', 'auto-toggle');
          auto.type = 'button';
          auto.addEventListener('click', () =>
            dispatch({ type: 'set_auto_rake', on: !lastState?.autoRake }),
          );
          row.append(btn, auto);
          return row;
        }
        const btn = el('button', a === 'open_eyes' ? 'verb primary' : 'verb', META_LABELS[a]);
        btn.type = 'button';
        btn.addEventListener('click', () => dispatch({ type: a } as Intent));
        return btn;
      },
      patch: (node, a) => {
        if (a !== 'rake_rice') return;
        const auto = node.querySelector<HTMLButtonElement>('.auto-toggle')!;
        toggle(auto, state.rungMeter >= RAKE_AUTO_REVEAL_METER);
        const on = state.autoRake;
        setClass(auto, 'on', on);
        setText(auto, on ? '■ stop' : '▶ auto');
        const pressed = String(on);
        if (auto.getAttribute('aria-pressed') !== pressed)
          auto.setAttribute('aria-pressed', pressed);
      },
      order: true,
    });

    // the humbling first fight — a charged one-time beat (the wolf cornered in the kura). Spatial
    // (Step 5b): you face it where you woke, so at the kura the charged button shows; anywhere else
    // it's a standing summons to walk back.
    const wolfPending =
      isUnlocked(state, 'verb-face-wolf') && !hasFlag(state, 'first-fight-survived');
    const atKura = state.location === 'kura';
    toggle(r.wolfBox, wolfPending);
    toggle(r.wolfBtn, wolfPending && atKura);
    toggle(r.wolfBlurb, wolfPending && !atKura);

    // labour activities, grouped by estate room (each: do-once + auto-repeat toggle). Outer keyed
    // list over the areas that HAVE labour here; each group's rows are an inner keyed list.
    const labours = availableLabours(state);
    const areasWithLabour = AREAS.filter((area) =>
      labours.some((o) => o.activity.area === area.id),
    );
    toggle(r.areaGroups, areasWithLabour.length > 0);
    reconcileList(r.areaGroups, areasWithLabour, {
      key: (area) => area.id,
      build: (area) => {
        const group = el('div', 'area-group');
        group.append(el('h3', 'area-head', area.label));
        group.append(el('p', 'area-blurb', area.blurb));
        return group;
      },
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
        !wolfPending &&
        hasFlag(state, 'awake') &&
        isUnlocked(state, 'room-gate-forecourt'),
    );

    // cook a meal — sansai → satiety AND the ONLY way to mend HP (D-050/D-076). Say so, and make it
    // the PRIMARY (prominent) action when the MC is hurt — the "heal now" companion to the red life bar.
    const showCook = isUnlocked(state, 'verb-cook');
    toggle(r.cookRow, showCook);
    if (showCook) {
      const cost = balance.COOK_SANSAI_COST;
      setClass(r.cookBtn, 'primary', state.character.hp < hpMax(state));
      setText(r.cookBtn, `Cook a meal (${cost} sansai)`);
      const short = (state.resources.sansai ?? 0) < cost;
      setDisabled(r.cookBtn, short);
      const title = short
        ? `Needs ${cost} sansai — forage the satoyama to gather it.`
        : 'Eat to restore your body and mend your wounds — eating is the only way to heal.';
      if (r.cookBtn.title !== title) r.cookBtn.title = title;
    }

    // eat plain rice — rice → satiety (D-107 Phase 2), the rice food path beside cook. A proper meal
    // refuels FASTER than a free rest (the design lever), trading your own rice for readiness.
    const showEatRice = isUnlocked(state, 'verb-eat-rice');
    toggle(r.eatRiceRow, showEatRice);
    if (showEatRice) {
      const cost = balance.EAT_RICE_COST;
      setText(r.eatRiceBtn, `Eat plain rice (${cost} rice)`);
      const short = (state.resources.rice ?? 0) < cost;
      setDisabled(r.eatRiceBtn, short);
      const title = short
        ? `Needs ${cost} rice — rake or farm the paddies to gather it.`
        : `A plain bowl of rice restores ${balance.EAT_RICE_SATIETY} body — more than a mere rest, at the cost of ${cost} rice.`;
      if (r.eatRiceBtn.title !== title) r.eatRiceBtn.title = title;
    }
    // (F107 — no "Walk on" strip here anymore: navigation lives ONLY on the Map tab.)
  }

  function renderSkills(state: GameState): void {
    // IA reorg (D-112 §2) — skills is a section of the Character tab (with attrs + bestiary).
    const show = activeTab === 'character' && isUnlocked(state, 'tab-skills');
    toggle(skillsPane, show);
    if (!show) return;
    // the visible skill rows — reconciled as a keyed list so each card is built ONCE (its meter fill
    // persists ⇒ the width transition plays) and patched in place; a not-yet-visible skill has no
    // node, so an empty pane stays genuinely empty (F72 ghost-box contract).
    const visible = SKILLS.filter(
      (def) => skillVisible(state, def.id) || isUnlocked(state, `skill-${def.id}`),
    );
    reconcileList(skillsPane, visible, {
      key: (def) => def.id,
      build: (def) => {
        const card = el('div', 'skill-row frame');
        const head = el('div', 'skill-head');
        head.append(el('span', 'skill-name', `${def.label} ${def.kanji}`));
        head.append(el('span', 'skill-lvl numeric'));
        card.append(head);
        card.append(el('div', 'skill-blurb', def.blurb));
        // show what the level DOES (R6: an invisible mechanic) — the labour-yield accelerator, read
        // from source of truth. Conditioning is the zero-yield gate skill (gate shows in the strip).
        if (def.id !== 'conditioning') card.append(el('div', 'rung-hint'));
        const meter = el('div', 'meter');
        meter.append(el('span'));
        card.append(meter);
        return card;
      },
      patch: (card, def) => {
        const prog = skillProgress(state, def.id as SkillId);
        setText(card.querySelector('.skill-lvl')!, `Lv ${prog.level}`);
        if (def.id !== 'conditioning') {
          const yieldPct = Math.round(
            (skillYieldNum(prog.level) / balance.SKILL_YIELD_DEN - 1) * 100,
          );
          setText(card.querySelector('.rung-hint')!, `+${yieldPct}% labour yield`);
        }
        setStyle(
          card.querySelector<HTMLElement>('.meter span')!,
          'width',
          `${Math.round((prog.into / prog.needed) * 100)}%`,
        );
      },
      order: true,
    });
  }

  // ── the Bestiary (A7) — default variant A: a woodblock FIELD-GUIDE card list. One card per
  //    grindable foe; a faced foe (its `mob-<id>` flag) shows its kanji seal, tell, win-rate
  //    forecast, and haunt; an un-faced foe stays a fogged silhouette (scout-by-fighting, mirrors
  //    the combat-tab fog). Pure read of `bestiaryEntries` — B/C alternates live in ui/dev.ts. ──
  function renderBestiary(container: HTMLElement, state: GameState): void {
    const entries = bestiaryEntries(state);
    const known = entries.filter((e) => e.seen).length;
    container.append(el('h3', 'foes-head', 'Bestiary 図鑑'));
    container.append(
      el(
        'div',
        'skill-blurb',
        `${known} of ${entries.length} beasts recorded — face a foe to ink its entry.`,
      ),
    );
    for (const e of entries) {
      const card = el('div', 'foe-row frame bestiary-card');
      const head = el('div', 'skill-head');
      head.append(
        el('span', 'skill-name', e.seen ? `${e.mob.label} ${e.mob.kanji}` : 'Unknown foe'),
      );
      const wr = el('span', 'win-rate');
      if (e.seen) {
        const tier = e.winRate >= 0.55 ? 'good' : e.winRate >= 0.28 ? 'fair' : 'risky';
        const word = tier === 'good' ? 'Steady' : tier === 'fair' ? 'Even' : 'Risky';
        const pip = el('span', `pip ${tier}`, '◆');
        pip.setAttribute('aria-hidden', 'true');
        wr.append(pip, document.createTextNode(` ${pct(e.winRate)} · ${word}`));
      } else {
        const pip = el('span', 'pip unknown', '◇');
        pip.setAttribute('aria-hidden', 'true');
        wr.append(pip, document.createTextNode(' Not yet faced'));
      }
      head.append(wr);
      card.append(head);
      if (e.seen) {
        card.append(el('div', 'skill-blurb', e.mob.blurb));
        const where = getNode(e.mob.area).label.replace(/^The /, '');
        const meta = el('div', 'bestiary-meta');
        meta.style.cssText =
          'display:flex;gap:.6rem;flex-wrap:wrap;font-size:var(--fs-micro);color:var(--ink-soft);';
        meta.append(el('span', undefined, `Tell — ${e.tell}`));
        meta.append(el('span', undefined, `Haunts — ${where}`));
        card.append(meta);
      } else {
        const fog = el('div', 'skill-blurb', 'A beast you have not yet met. Face it to record it.');
        fog.style.color = 'var(--ink-faint)';
        card.append(fog);
      }
      container.append(card);
    }
  }

  // ── shared win-rate pip (foe watch + Bestiary) — a persistent pip + text span the forecast
  //    PATCHES in place (no strobe on the ~2×/s idle tick). setPipClass guards the className write. ──
  function setPipClass(pip: HTMLElement, tier: string): void {
    const cls = `pip ${tier}`;
    if (pip.className !== cls) pip.className = cls;
  }
  function buildWinRate(): HTMLElement {
    const wr = el('span', 'win-rate');
    const pip = el('span', 'pip');
    pip.setAttribute('aria-hidden', 'true');
    wr.append(pip, el('span', 'wr-text'));
    return wr;
  }
  function patchWinRate(
    wr: HTMLElement,
    seen: boolean,
    winRate: number,
    unknownText: string,
  ): void {
    const pip = wr.querySelector<HTMLElement>('.pip')!;
    const txt = wr.querySelector<HTMLElement>('.wr-text')!;
    if (seen) {
      const tier = winRate >= 0.55 ? 'good' : winRate >= 0.28 ? 'fair' : 'risky';
      const word = tier === 'good' ? 'Steady' : tier === 'fair' ? 'Even' : 'Risky';
      setPipClass(pip, tier);
      setText(pip, '◆');
      setText(txt, ` ${pct(winRate)} · ${word}`);
    } else {
      setPipClass(pip, 'unknown');
      setText(pip, '◇');
      setText(txt, unknownText);
    }
  }

  // one persistent foe-watch row (F81) — the Fight verb + two auto-mode toggles are built ONCE (their
  // listeners read live state), the name / forecast pip / blurb / toggle-state patch in place.
  function buildFoeRow(fc: ReturnType<typeof foesHere>[number]): HTMLElement {
    const mob = fc.mob.id as MobId;
    const row = el('div', 'foe-row frame');
    const head = el('div', 'skill-head');
    head.append(el('span', 'skill-name'), buildWinRate());
    row.append(head);
    row.append(el('div', 'skill-blurb'));
    const ctrl = el('div', 'labour-row');
    const fight = el('button', 'verb', 'Fight');
    fight.type = 'button';
    fight.addEventListener('click', () => dispatch({ type: 'fight', mobId: mob }));
    const atDeath = el('button', 'auto-toggle');
    atDeath.type = 'button';
    atDeath.title =
      'Auto-fight to the end — HP carries; you can be beaten, and a loss costs coin + rice.';
    atDeath.setAttribute(
      'aria-label',
      `Auto-fight the ${fc.mob.label} to the end — a loss costs coin + rice`,
    );
    atDeath.addEventListener('click', () => {
      const on = lastState?.autoCombat === mob && !lastState.autoCombatRetreat;
      dispatch({ type: 'set_auto_combat', mobId: on ? null : mob, retreat: false });
    });
    const atFlee = el('button', 'auto-toggle');
    atFlee.type = 'button';
    atFlee.title =
      'Auto-fight, but break off when HP falls below 20% (a fast foe can still kill you first).';
    atFlee.setAttribute('aria-label', `Auto-fight the ${fc.mob.label}, fleeing below 20% HP`);
    atFlee.addEventListener('click', () => {
      const on = lastState?.autoCombat === mob && lastState.autoCombatRetreat === true;
      dispatch({ type: 'set_auto_combat', mobId: on ? null : mob, retreat: true });
    });
    ctrl.append(fight, atDeath, atFlee);
    row.append(ctrl);
    return row;
  }
  function patchFoeRow(
    row: HTMLElement,
    fc: ReturnType<typeof foesHere>[number],
    state: GameState,
  ): void {
    const seen = hasFlag(state, `mob-${fc.mob.id}`);
    setText(
      row.querySelector('.skill-name')!,
      seen ? `${fc.mob.label} ${fc.mob.kanji}` : 'Unknown foe',
    );
    patchWinRate(row.querySelector('.win-rate')!, seen, fc.winRate, ' Unknown');
    const blurb = row.querySelector<HTMLElement>('.skill-blurb')!;
    toggle(blurb, seen);
    if (seen) setText(blurb, fc.mob.blurb);
    const autoOn = state.autoCombat === fc.mob.id;
    const deathOn = autoOn && !state.autoCombatRetreat;
    const retreatOn = autoOn && state.autoCombatRetreat;
    const toggles = row.querySelectorAll<HTMLButtonElement>('.auto-toggle');
    setClass(toggles[0]!, 'on', deathOn);
    setText(toggles[0]!, deathOn ? '■ stop' : '▶ auto · to the end');
    setClass(toggles[1]!, 'on', retreatOn);
    setText(toggles[1]!, retreatOn ? '■ stop' : '▶ auto · flee @20%');
  }

  // one Bestiary field-guide card (F81) — built once per foe; the fog→inked flip patches in place.
  function buildBestiaryCard(): HTMLElement {
    const card = el('div', 'foe-row frame bestiary-card');
    const head = el('div', 'skill-head');
    head.append(el('span', 'skill-name'), buildWinRate());
    card.append(head);
    card.append(el('div', 'skill-blurb bestiary-blurb'));
    const meta = el('div', 'bestiary-meta');
    meta.style.cssText =
      'display:flex;gap:.6rem;flex-wrap:wrap;font-size:var(--fs-micro);color:var(--ink-soft);';
    meta.append(el('span'), el('span'));
    card.append(meta);
    const fog = el(
      'div',
      'skill-blurb bestiary-fog',
      'A beast you have not yet met. Face it to record it.',
    );
    fog.style.color = 'var(--ink-faint)';
    card.append(fog);
    return card;
  }
  function patchBestiaryCard(
    card: HTMLElement,
    e: ReturnType<typeof bestiaryEntries>[number],
  ): void {
    const seen = e.seen;
    setText(
      card.querySelector('.skill-name')!,
      seen ? `${e.mob.label} ${e.mob.kanji}` : 'Unknown foe',
    );
    patchWinRate(card.querySelector('.win-rate')!, seen, e.winRate, ' Not yet faced');
    const blurb = card.querySelector<HTMLElement>('.bestiary-blurb')!;
    const meta = card.querySelector<HTMLElement>('.bestiary-meta')!;
    const fog = card.querySelector<HTMLElement>('.bestiary-fog')!;
    toggle(blurb, seen);
    toggle(meta, seen);
    toggle(fog, !seen);
    if (seen) {
      setText(blurb, e.mob.blurb);
      const where = getNode(e.mob.area).label.replace(/^The /, '');
      setText(meta.children[0] as HTMLElement, `Tell — ${e.tell}`);
      setText(meta.children[1] as HTMLElement, `Haunts — ${where}`);
    }
  }

  // one stance button (F81) — the label + offense/defense trade are static per stance (mods are
  // constants), so they're built once; only the `.on`/aria-pressed selection patches per render.
  function buildStanceBtn(s: StanceId): HTMLElement {
    const ui = STANCE_UI[s];
    const mod = balance.STANCE_MODS[s];
    const atkPct = Math.round((mod.atkMult - 1) * 100);
    const takenPct = Math.round((mod.takenMult - 1) * 100);
    const sign = (n: number): string => (n > 0 ? `+${n}` : `${n}`);
    const trade = `atk ${sign(atkPct)}% · taken ${sign(takenPct)}%`;
    const btn = el('button', 'auto-toggle stance-btn');
    btn.type = 'button';
    btn.title = ui.hint;
    btn.setAttribute('aria-label', `${ui.gloss} stance — ${trade}. ${ui.hint}`);
    btn.append(el('span', 'stance-label', `${ui.kanji} ${ui.gloss}`));
    btn.append(el('span', 'stance-wear', trade));
    btn.addEventListener('click', () => dispatch({ type: 'set_stance', stance: s }));
    return btn;
  }

  // one loot→craft card (F81) — keyed by recipe.id so it's rebuilt only when the recipe ADVANCES
  // (axe → yari); the material tally + forge-button state patch in place while the recipe holds.
  function buildCraftCard(recipe: (typeof RECIPES)[number]): HTMLElement {
    const cc = el('div', 'weapon-card frame craft-card');
    cc.append(el('div', 'rung-now', recipe.label));
    cc.append(
      el(
        'div',
        'skill-blurb',
        'Strip what the carcasses give up, then forge a real edge at the woodlot smithy — found and made, not tossed off a rack.',
      ),
    );
    for (const mat of Object.keys(recipe.inputs)) {
      const m = getMaterial(mat);
      const row = el('div', 'craft-mat');
      row.append(el('span', 'craft-mat-name', `${m.label} ${m.kanji}`));
      row.append(el('span', 'craft-mat-count'));
      cc.append(row);
    }
    const craftBtn = el('button', 'verb', recipe.label);
    craftBtn.type = 'button';
    craftBtn.addEventListener('click', () =>
      dispatch({ type: 'craft_weapon', recipeId: recipe.id }),
    );
    cc.append(craftBtn);
    return cc;
  }
  function patchCraftCard(
    cc: HTMLElement,
    recipe: (typeof RECIPES)[number],
    state: GameState,
  ): void {
    const counts = cc.querySelectorAll<HTMLElement>('.craft-mat-count');
    Object.entries(recipe.inputs).forEach(([mat, need], i) => {
      const have = state.resources[mat] ?? 0;
      setText(counts[i]!, `${have}/${need}`);
      setClass(counts[i]!, 'ok', have >= need);
    });
    const btn = cc.querySelector<HTMLButtonElement>('.verb')!;
    const can = canCraft(state.resources, recipe);
    setDisabled(btn, !can);
    const title = can ? '' : 'Fell more foes for materials.';
    if (btn.title !== title) btn.title = title;
  }

  // the DEV-only wholesale combat rebuild — the original teardown-and-rebuild body, kept verbatim so
  // the craft/bestiary variant toggles (which need a fresh container each render) keep working. Prod
  // + tests (`dev` undefined) never reach this; they take the incremental path in renderCombat.
  function renderCombatWholesale(state: GameState): void {
    // combat rank + XP
    const cx = combatXpProgress(state.character.combatXp);
    const lvl = el('div', 'rung-card frame');
    lvl.append(el('div', 'rung-now', `Combat level ${cx.level} · 武`));
    const lm = el('div', 'meter');
    const lf = el('span');
    lf.style.width = pct(cx.into / cx.needed);
    lm.append(lf);
    lvl.append(lm);
    lvl.append(el('div', 'rung-hint', `Combat XP ${cx.into}/${cx.needed}`));
    combatPane.append(lvl);

    // (IA reorg D-112 — training attrs + the bestiary SPLIT OUT to the Character tab; they no longer
    // render on the Combat surface. See renderCharacterSheet's DEV wholesale path.)

    const weapon = getWeapon(state.equippedWeapon);
    const band = durabilityBand(state.weaponDurability, weapon.durabilityMax);
    const showDurability = isUnlocked(state, 'readout-durability');
    const showEquip = isUnlocked(state, 'panel-equipment');
    const wc = el('div', 'weapon-card frame');
    const wh = el('div', 'skill-head');
    wh.append(el('span', 'skill-name', `${weapon.label} ${weapon.kanji}`));
    if (showDurability) wh.append(el('span', 'skill-lvl', band.name));
    wc.append(wh);
    wc.append(
      el(
        'div',
        'skill-blurb',
        showDurability
          ? `${weapon.archetype} · durability ${state.weaponDurability}/${weapon.durabilityMax}`
          : weapon.archetype,
      ),
    );
    const wctrl = el('div', 'labour-row');
    if (showEquip && isUnlocked(state, 'verb-repair')) {
      const rep = el(
        'button',
        'auto-toggle',
        `Repair (${balance.REPAIR_WOOD_COST} wood, ${formatCoin(balance.REPAIR_COIN_COST)})`,
      );
      rep.type = 'button';
      rep.disabled = (state.resources.wood ?? 0) < balance.REPAIR_WOOD_COST;
      rep.title = `${balance.REPAIR_WOOD_COST} wood + up to ${formatCoin(balance.REPAIR_COIN_COST)} (waived if you're short)`;
      rep.addEventListener('click', () => dispatch({ type: 'repair_weapon' }));
      wctrl.append(rep);
    }
    if (showEquip) {
      for (const w of WEAPONS) {
        const owned = w.id === 'carrying_pole' || hasFlag(state, `crafted-${w.id}`);
        if (!owned || w.id === state.equippedWeapon) continue;
        const eq = el('button', 'auto-toggle', `Take up · ${w.label} ${w.kanji}`);
        eq.type = 'button';
        eq.addEventListener('click', () => dispatch({ type: 'equip_weapon', weaponId: w.id }));
        wctrl.append(eq);
      }
    }
    if (wctrl.childElementCount > 0) wc.append(wctrl);
    combatPane.append(wc);

    const recipe = RECIPES.find((r) => !hasFlag(state, `crafted-${r.outputWeapon}`));
    const hasMaterial = MATERIALS.some((m) => (state.resources[m.id] ?? 0) > 0);
    if (showEquip && recipe && hasMaterial) {
      const cc = el('div', 'weapon-card frame craft-card');
      cc.append(el('div', 'rung-now', recipe.label));
      cc.append(
        el(
          'div',
          'skill-blurb',
          'Strip what the carcasses give up, then forge a real edge at the woodlot smithy — found and made, not tossed off a rack.',
        ),
      );
      if (!(import.meta.env.DEV && dev && dev.renderVariant('craft', cc, state, dispatch))) {
        for (const [mat, need] of Object.entries(recipe.inputs)) {
          const have = state.resources[mat] ?? 0;
          const m = getMaterial(mat);
          const row = el('div', 'craft-mat');
          row.append(el('span', 'craft-mat-name', `${m.label} ${m.kanji}`));
          row.append(el('span', `craft-mat-count${have >= need ? ' ok' : ''}`, `${have}/${need}`));
          cc.append(row);
        }
      }
      const can = canCraft(state.resources, recipe);
      const craftBtn = el('button', 'verb', recipe.label);
      craftBtn.type = 'button';
      craftBtn.disabled = !can;
      if (!can) craftBtn.title = 'Fell more foes for materials.';
      craftBtn.addEventListener('click', () =>
        dispatch({ type: 'craft_weapon', recipeId: recipe.id }),
      );
      cc.append(craftBtn);
      combatPane.append(cc);
    }

    if (isUnlocked(state, 'stance-control')) {
      const stanceRow = el('div', 'stance-row');
      stanceRow.append(el('h3', undefined, 'Stance 構え'));
      for (const s of STANCE_ORDER) stanceRow.append(patchStanceReady(buildStanceBtn(s), s, state));
      combatPane.append(stanceRow);
    }

    // (IA reorg D-112 — the bestiary SPLIT OUT to the Character tab.)

    combatPane.append(el('h3', 'foes-head', 'The watch'));
    const present = foesHere(state);
    if (present.length === 0) {
      combatPane.append(
        el(
          'p',
          'area-blurb',
          'No foe holds this ground. Use the Map 地図 tab to reach the paddies, the satoyama, or the woodlot road.',
        ),
      );
    }
    for (const fc of present) {
      const row = buildFoeRow(fc);
      patchFoeRow(row, fc, state);
      combatPane.append(row);
    }
  }

  // apply the current-render stance selection to a freshly-built stance button (shared by the
  // wholesale DEV path + the incremental patch).
  function patchStanceReady(btn: HTMLElement, s: StanceId, state: GameState): HTMLElement {
    const on = state.stance === s;
    setClass(btn, 'on', on);
    const pressed = String(on);
    if (btn.getAttribute('aria-pressed') !== pressed) btn.setAttribute('aria-pressed', pressed);
    return btn;
  }

  function renderCombat(state: GameState): void {
    const show = activeTab === 'combat' && isUnlocked(state, 'tab-combat');
    toggle(combatPane, show);
    if (!show) return;
    // DEV variant sessions keep the wholesale rebuild (the craft/bestiary variant toggles need a
    // fresh container each render). Prod + tests (`dev` undefined) take the incremental path below.
    if (import.meta.env.DEV && dev) {
      combatRefs = null;
      combatPane.textContent = '';
      renderCombatWholesale(state);
      return;
    }
    // build the sub-container skeleton ONCE (F81), then patch/reconcile each block in place. Order
    // mirrors the wholesale build: XP · training · weapon · craft · stance · bestiary · watch.
    if (!combatRefs) {
      const xpCard = el('div', 'rung-card frame');
      const xpNow = el('div', 'rung-now');
      const xm = el('div', 'meter');
      const xpFill = el('span');
      xm.append(xpFill);
      const xpHint = el('div', 'rung-hint');
      xpCard.append(xpNow, xm, xpHint);

      // (IA reorg D-112 — training attrs + the bestiary moved to the Character tab; see
      //  renderCharacterSheet. The Combat tab keeps XP · weapon · craft · stance · watch only.)

      const wc = el('div', 'weapon-card frame');
      const wh = el('div', 'skill-head');
      const wcName = el('span', 'skill-name');
      const wcBand = el('span', 'skill-lvl');
      wh.append(wcName, wcBand);
      wc.append(wh);
      const wcBlurb = el('div', 'skill-blurb');
      wc.append(wcBlurb);
      const wctrl = el('div', 'labour-row');
      const repairBtn = el('button', 'auto-toggle');
      repairBtn.type = 'button';
      repairBtn.addEventListener('click', () => dispatch({ type: 'repair_weapon' }));
      wctrl.append(repairBtn);
      wc.append(wctrl);

      const craftHost = el('div', 'combat-group');

      const watchHead = el('h3', 'foes-head', 'The watch');
      const watchEmpty = el(
        'p',
        'area-blurb',
        'No foe holds this ground. Use the Map 地図 tab to reach the paddies, the satoyama, or the woodlot road.',
      );
      const watchList = el('div', 'combat-group');

      combatPane.append(xpCard, wc, craftHost, watchHead, watchEmpty, watchList);
      combatRefs = {
        xpNow,
        xpFill,
        xpHint,
        wc,
        wcName,
        wcBand,
        wcBlurb,
        wctrl,
        repairBtn,
        craftHost,
        stanceHost: null,
        watchHead,
        watchEmpty,
        watchList,
      };
    }
    const r = combatRefs;

    // ── XP card ──
    const cx = combatXpProgress(state.character.combatXp);
    setText(r.xpNow, `Combat level ${cx.level} · 武`);
    setStyle(r.xpFill, 'width', pct(cx.into / cx.needed));
    setText(r.xpHint, `Combat XP ${cx.into}/${cx.needed}`);

    // ── equipped weapon + (R4) durability band + repair / equip switcher ──
    const weapon = getWeapon(state.equippedWeapon);
    const band = durabilityBand(state.weaponDurability, weapon.durabilityMax);
    const showDurability = isUnlocked(state, 'readout-durability');
    const showEquip = isUnlocked(state, 'panel-equipment');
    setText(r.wcName, `${weapon.label} ${weapon.kanji}`);
    toggle(r.wcBand, showDurability);
    if (showDurability) setText(r.wcBand, band.name);
    setText(
      r.wcBlurb,
      showDurability
        ? `${weapon.archetype} · durability ${state.weaponDurability}/${weapon.durabilityMax}`
        : weapon.archetype,
    );
    const showRepair = showEquip && isUnlocked(state, 'verb-repair');
    toggle(r.repairBtn, showRepair);
    if (showRepair) {
      setText(
        r.repairBtn,
        `Repair (${balance.REPAIR_WOOD_COST} wood, ${formatCoin(balance.REPAIR_COIN_COST)})`,
      );
      setDisabled(r.repairBtn, (state.resources.wood ?? 0) < balance.REPAIR_WOOD_COST);
      const title = `${balance.REPAIR_WOOD_COST} wood + up to ${formatCoin(balance.REPAIR_COIN_COST)} (waived if you're short)`;
      if (r.repairBtn.title !== title) r.repairBtn.title = title;
    }
    // the equip switcher — reconciled into wctrl AFTER the persistent repair button (a foreign
    // sibling the reconcile never removes). Roster order (pole · axe · yari), owned-but-not-equipped.
    const equippable = showEquip
      ? WEAPONS.filter(
          (w) =>
            (w.id === 'carrying_pole' || hasFlag(state, `crafted-${w.id}`)) &&
            w.id !== state.equippedWeapon,
        )
      : [];
    reconcileList(r.wctrl, equippable, {
      key: (w) => w.id,
      build: (w) => {
        const eq = el('button', 'auto-toggle', `Take up · ${w.label} ${w.kanji}`);
        eq.type = 'button';
        eq.addEventListener('click', () => dispatch({ type: 'equip_weapon', weaponId: w.id }));
        return eq;
      },
      order: true,
    });
    toggle(r.wctrl, showRepair || equippable.length > 0);

    // ── loot→craft card (0-or-1, keyed by recipe.id so it rebuilds only when the recipe advances) ──
    const recipe = RECIPES.find((rc) => !hasFlag(state, `crafted-${rc.outputWeapon}`));
    const hasMaterial = MATERIALS.some((m) => (state.resources[m.id] ?? 0) > 0);
    const craftItems = showEquip && recipe && hasMaterial ? [recipe] : [];
    toggle(r.craftHost, craftItems.length > 0);
    reconcileList(r.craftHost, craftItems, {
      key: (rc) => rc.id,
      build: (rc) => buildCraftCard(rc),
      patch: (card, rc) => patchCraftCard(card, rc, state),
    });

    // ── stance control (R5) — lazily created so `.stance-row` is truly absent until it unlocks. It
    //    inserts before the watch head (the bestiary that used to sit there is now on Character). ──
    const showStance = isUnlocked(state, 'stance-control');
    if (showStance) {
      if (!r.stanceHost) {
        const sh = el('div', 'stance-row');
        sh.append(el('h3', undefined, 'Stance 構え'));
        combatPane.insertBefore(sh, r.watchHead);
        r.stanceHost = sh;
      }
      toggle(r.stanceHost, true);
      reconcileList(r.stanceHost, STANCE_ORDER, {
        key: (s) => s,
        build: (s) => buildStanceBtn(s),
        patch: (btn, s) => {
          patchStanceReady(btn, s, state);
        },
      });
    } else if (r.stanceHost) {
      toggle(r.stanceHost, false);
    }

    // (IA reorg D-112 — the Bestiary SPLIT OUT to the Character tab; see renderCharacterSheet.)

    // ── the watch (spatial) — the foes on THIS node; forecasts patch in place, no strobe ──
    const present = foesHere(state);
    toggle(r.watchEmpty, present.length === 0);
    toggle(r.watchList, present.length > 0);
    reconcileList(r.watchList, present, {
      key: (fc) => fc.mob.id,
      build: (fc) => buildFoeRow(fc),
      patch: (row, fc) => patchFoeRow(row, fc, state),
      order: true,
    });
  }

  // ── the Character tab's SPLIT-OUT combat halves (IA reorg D-112) — the attribute-TRAINING rows
  //    (points earned in combat, spent here) + the BESTIARY field-guide. Each self-gates to the
  //    Character tab and its R3 surface (`readout-combat-level` / `panel-bestiary`), and each is a
  //    build-once/patch surface (F81) so a hurt idle tick churns nothing. renderSkills + renderQuests
  //    (the tab's other sections) render into their own panes; this fn owns training + bestiary. ──
  function renderCharacterSheet(state: GameState): void {
    const onCharacter = activeTab === 'character';
    const devMode = import.meta.env.DEV && dev;

    // ── TRAINING (attrs) — reveals at R3 with combat (readout-combat-level). The +1 buttons spend
    //    attributePoints EARNED from combat leveling (the coupling holds — points still fire from the
    //    fight loop; only the SPENDING UI moved here). Always incremental (no DEV variant). ──
    const showTrain = onCharacter && isUnlocked(state, 'readout-combat-level');
    toggle(characterTrain, showTrain);
    if (showTrain) {
      // build-once shell + a fixed keyed list of the 5 attr rows (F81), mirroring the old combat build.
      if (!characterTrainRefs) {
        const train = el('div', 'weapon-card frame');
        const th = el('div', 'skill-head');
        th.append(el('span', 'skill-name', 'Training 鍛錬'));
        const trainPts = el('span', 'skill-lvl');
        th.append(trainPts);
        train.append(th);
        characterTrain.append(train);
        characterTrainRefs = { train, trainPts };
      }
      const c = state.character;
      const cr = characterTrainRefs;
      setText(
        cr.trainPts,
        `${c.attributePoints} point${c.attributePoints === 1 ? '' : 's'} to spend`,
      );
      reconcileList(cr.train, balance.ATTR_IDS, {
        key: (id) => id,
        build: (id) => {
          const meta = balance.ATTR_META[id];
          const row = el('div', 'attr-row');
          const label = el('span', 'attr-label');
          label.append(el('span', 'attr-name', `${meta.label} ${meta.kanji}`));
          label.append(el('span', 'attr-val'));
          label.append(el('span', 'attr-gain lock-hint', ` ${meta.gain}`));
          row.append(label);
          const plus = el('button', 'auto-toggle', '+1');
          plus.type = 'button';
          plus.addEventListener('click', () => dispatch({ type: 'spend_attribute', attr: id }));
          row.append(plus);
          return row;
        },
        patch: (row, id) => {
          setText(row.querySelector('.attr-val')!, ` ${c.attrs[id]}`);
          setDisabled(row.querySelector('.auto-toggle')!, c.attributePoints <= 0);
        },
      });
    }

    // ── BESTIARY (R3) — the field-guide of foes; the fog→inked flip patches each card in place. ──
    const showBestiary = onCharacter && isUnlocked(state, 'panel-bestiary');
    toggle(characterBestiary, showBestiary);
    if (devMode) {
      // DEV wholesale path — mirror the market/quests DEV branches: rebuild fresh each render so the
      // variant toggle takes a clean container. (Only a live DEV session takes this branch.)
      characterBestiaryRefs = null;
      characterBestiary.textContent = '';
      if (showBestiary) {
        const bpane = el('div', 'bestiary');
        characterBestiary.append(bpane);
        if (!dev.renderVariant('bestiary', bpane, state, dispatch)) renderBestiary(bpane, state);
      }
      return;
    }
    // prod / test — build the bestiary host ONCE (F81), patch in place.
    if (showBestiary) {
      if (!characterBestiaryRefs) {
        const host = el('div', 'bestiary');
        host.append(el('h3', 'foes-head', 'Bestiary 図鑑'));
        const blurb = el('div', 'skill-blurb');
        host.append(blurb);
        const list = el('div', 'bestiary-list');
        host.append(list);
        characterBestiary.append(host);
        characterBestiaryRefs = { host, blurb, list };
      }
      const br = characterBestiaryRefs;
      const entries = bestiaryEntries(state);
      const known = entries.filter((e) => e.seen).length;
      setText(
        br.blurb,
        `${known} of ${entries.length} beasts recorded — face a foe to ink its entry.`,
      );
      reconcileList(br.list, entries, {
        key: (e) => e.mob.id,
        build: () => buildBestiaryCard(),
        patch: (card, e) => patchBestiaryCard(card, e),
        order: true,
      });
    }
  }

  // increases-only number-pop (juice). prev===undefined (load / import / new game) never
  // pops — popValue's guard avoids a false flash on the first paint of a loaded save.
  function popValue(node: HTMLElement, cur: number, before: number | undefined): void {
    if (before === undefined || cur <= before) return;
    node.classList.remove('pop');
    void node.offsetWidth; // reflow so the animation restarts on a fresh increment
    node.classList.add('pop');
  }

  function renderVitals(state: GameState, prev: GameState | null): void {
    rice.wrap.hidden = !isUnlocked(state, 'readout-rice');
    if (!rice.wrap.hidden) {
      const v = state.resources.rice ?? 0;
      rice.value.textContent = formatKMB(v);
      popValue(rice.value, v, prev?.resources.rice);
    }
    // COIN — the first-wage reveal (D-107): hidden until the player earns coin (readout-coin).
    // Rendered in mixed mon/monme/ryō with incremental reveal (D-108, formatCoin) — NOT the
    // plain K/M/B count (rice keeps that; coin is denominated). popValue still fires on the raw
    // mon delta, so the tally-pop is unaffected by the denomination string.
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
      clockDay.textContent = `Year ${year(state)} · day ${state.clock.day + 1}`;
    }

    stamina.hidden = !isUnlocked(state, 'readout-stamina');
    if (!stamina.hidden) {
      const frac = state.character.satiety / satietyMax(state);
      staminaFill.style.width = `${Math.round(frac * 100)}%`;
      staminaBar.classList.toggle('low', staminaRate(state) < 0.99);
    }

    // HP — revealed the moment combat first matters (the R2 wolf beat), then always visible. Shows an
    // exact number (1 HP vs a full bar is life-or-death, D-076) + a bar that flags `low` when ≤ 30%.
    health.hidden = !(isUnlocked(state, 'verb-face-wolf') || isUnlocked(state, 'tab-combat'));
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
  // or curly) in a .speech span so a spoken line reads as a distinct voice (F23). Non-narration
  // channels paint as plain text.
  function appendNarration(line: HTMLElement, text: string): void {
    const re = /"[^"]*"|[“][^”]*[”]/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) line.append(document.createTextNode(text.slice(last, m.index)));
      line.append(el('span', 'speech', m[0]));
      last = m.index + m[0].length;
    }
    if (last < text.length) line.append(document.createTextNode(text.slice(last)));
  }
  // F50 — a spoken line gets a "Name: " prefix (the speaker's display name). The stored
  // `entry.speaker` already IS the display name (NAMES.* / PLAYER_SPEAKER = "You"); NPC_NAME maps
  // an id defensively should one ever arrive, else the value passes through. The voice colour
  // rides on the line's `voice-<category>` class, so the prefix inherits it — no extra colour code.
  function speakerPrefixNode(entry: LogEntry): HTMLElement | null {
    if (entry.speaker === undefined || entry.speaker === '') return null;
    const name = NPC_NAME[entry.speaker as keyof typeof NPC_NAME] ?? entry.speaker;
    return el('span', 'log-speaker', `${name}: `);
  }
  // F56 — the intro perk-unlock milestone line "Perk unlocked — {name}: {desc} (±mechanics)" renders
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
    box.append(el('div', 'perk-stat', perk.mechanics));
    line.append(box);
  }
  function renderLineContent(line: HTMLElement, entry: LogEntry): void {
    const perk = parsePerkLine(entry);
    if (perk) {
      buildPerkBox(line, perk);
      return;
    }
    line.textContent = '';
    const bullet = CHANNEL_BULLET[entry.channel];
    if (bullet) {
      const b = el('span', 'bullet emoji', bullet); // .emoji ties the bullet to the palette
      b.setAttribute('aria-hidden', 'true');
      line.append(b);
    }
    const prefix = speakerPrefixNode(entry);
    if (prefix) line.append(prefix);
    const text = formatLogText(entry);
    // F26 — when a line carries a speaker `voice`, the whole line takes that
    // voice's colour (via the `voice-<category>` class on the line, added in
    // buildLogLine), so who's talking reads at a glance. The F23 quote-detection
    // (`.speech` spans) stays only as the FALLBACK for narration lines with NO
    // voice tag — a voiced line renders as plain text and lets the class colour it.
    if (entry.channel === 'narration' && entry.voice === undefined) appendNarration(line, text);
    else line.append(document.createTextNode(text));
  }
  function buildLogLine(entry: LogEntry, animate: boolean): HTMLElement {
    // F56 — a perk-unlock milestone becomes a JRPG box: drop the `milestone` class (no red strip),
    // carry a plain `perk-line` wrapper the box lives inside.
    if (parsePerkLine(entry)) {
      const line = el('div', 'log-line perk-line');
      renderLineContent(line, entry);
      if (animate) line.classList.add('reveal');
      return line;
    }
    // the voice-<category> class carries the speaker colour (F26); absent voice ⇒
    // today's channel-only styling (narrator quote-detection fallback).
    const voiceClass = entry.voice ? ` voice-${entry.voice}` : '';
    const line = el('div', `log-line ${entry.channel}${voiceClass}`);
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
  // F77 — follow the newest line and STAY pinned to the foot as content arrives. The pin is an
  // INSTANT, authoritative jump to the bottom (a smooth scroll lagged behind rapid cascade/
  // typewriter appends and stranded the view at an OLD position — the "holding an old scroll
  // position" bug). It only fires while the reader is pinned: someone scrolled UP into history is
  // left where they are until they return to the bottom (see the scroll listener above).
  function scrollLogToNewest(): void {
    if (!logPinnedToBottom) return;
    logLines.scrollTop = logLines.scrollHeight;
  }
  function appendLine(entry: LogEntry, animate: boolean): void {
    logLines.append(buildLogLine(entry, animate)); // newest at the BOTTOM (reads as a story)
    while (logLines.childElementCount > LOG_DOM_MAX) logLines.firstElementChild?.remove();
    scrollLogToNewest(); // smoothly follow the newest line (F7)
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
  // P2 — build the line with EMPTY text (bullet + voice/.log-line classes), append it,
  // then reveal `formatLogText` one character at a time into a text node, following the
  // scroll as it types. On completion, an untagged narration line (quotes, no voice) is
  // re-rendered through renderLineContent so the F23 quote-`.speech` spans apply; a
  // voiced line needs no re-render (the whole line is the voice colour). `onDone` fires
  // once the line is fully typed (or the line was evicted), never on a cancel.
  function typeLine(entry: LogEntry, onDone: () => void): void {
    const voiceClass = entry.voice ? ` voice-${entry.voice}` : '';
    const line = el('div', `log-line ${entry.channel}${voiceClass}`);
    const bullet = CHANNEL_BULLET[entry.channel];
    if (bullet) {
      const b = el('span', 'bullet emoji', bullet);
      b.setAttribute('aria-hidden', 'true');
      line.append(b);
    }
    // F50 — a spoken line shows its "Name: " prefix immediately, before the quote types in.
    const prefix = speakerPrefixNode(entry);
    if (prefix) line.append(prefix);
    const textNode = document.createTextNode('');
    line.append(textNode);
    logLines.append(line);
    while (logLines.childElementCount > LOG_DOM_MAX) logLines.firstElementChild?.remove();
    scrollLogToNewest();

    const full = formatLogText(entry);
    const isNarrationQuote = entry.channel === 'narration' && entry.voice === undefined;
    const finalize = (): void => {
      textNode.data = full;
      if (isNarrationQuote) renderLineContent(line, entry); // F23 .speech spans
      scrollLogToNewest();
    };
    finishTypeNow = finalize;
    if (full.length === 0) {
      // nothing to type — nothing to finalize; hand straight to the cascade.
      finishTypeNow = undefined;
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
      textNode.data = full.slice(0, i);
      if (i % 3 === 0) scrollLogToNewest(); // follow the view a few chars at a time
      if (i < full.length) {
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
    logFilterBar.dataset.variant = 'log-filter-segmented'; // human pick (F21); A/B removed
    for (const [id, btn] of logFilterBtns) btn.classList.toggle('active', id === logFilter);
  }
  // F20 — the highest entry key that shows under filter `f`.
  function maxKeyForFilter(entries: readonly LogEntry[], f: LogFilter): number {
    let mx = -1;
    for (const e of entries)
      if (logFilterMatches(e.channel, f, e.ephemeral === true)) mx = Math.max(mx, e.key);
    return mx;
  }
  function refreshLogTabs(state: GameState): void {
    const entries = state.log.entries;
    logSeen[logFilter] = maxKeyForFilter(entries, logFilter); // viewing = seen
    for (const [id, btn] of logFilterBtns) {
      // `all` is excluded — it always shows everything, so a badge there would be noise; `now` too
      // (F53 — its lines fade on their own, so an unread dot there would just flicker).
      const unread =
        id !== logFilter &&
        id !== 'all' &&
        id !== 'now' &&
        maxKeyForFilter(entries, id) > logSeen[id];
      btn.classList.toggle('unread', unread);
    }
  }
  // ── F53 · the "Now" view — a rolling window of FLEETING flavor (ephemeral entries) that each
  //    fade ~15s after first appearing. Wall-clock + DOM only (a render concern; the pure core
  //    never sees time). Leak-free: `nowSeen` stamps + the single fade interval are torn down on
  //    reset / filter-switch, and the interval self-terminates the instant the filter leaves `now`.
  function stopNowInterval(): void {
    if (nowInterval !== undefined) {
      window.clearInterval(nowInterval);
      nowInterval = undefined;
    }
  }
  function clearNowView(): void {
    stopNowInterval();
    // F58b — cancel any in-flight collapse animations so their removal timers don't fire late.
    for (const t of nowCollapseTimers) window.clearTimeout(t);
    nowCollapseTimers.clear();
    nowSeen.clear();
    nowEmptyEl = undefined;
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
    // empty when nothing recent — a calm placeholder so the tab never reads broken.
    if (logLines.querySelector('.now-line')) return; // still has live lines
    if (nowEmptyEl && nowEmptyEl.isConnected) return;
    logLines.textContent = '';
    nowEmptyEl = el('div', 'log-empty', 'Quiet, just now — the moment has passed.');
    logLines.append(nowEmptyEl);
  }
  // The interval pass: fade lines entering their last NOW_FADE_MS, drop lines past NOW_TTL_MS.
  function pruneNowView(): void {
    if (logFilter !== 'now') {
      clearNowView();
      return;
    }
    const now = Date.now();
    const reduced = reduceMotion();
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
  // Full rebuild on a state change: stamp any new ephemeral entry, paint those still inside their
  // 15s window (newest at the bottom), and keep the fade interval running.
  function renderNowView(state: GameState): void {
    const now = Date.now();
    const ephemeral = state.log.entries.filter((e) => e.ephemeral === true);
    for (const e of ephemeral) if (!nowSeen.has(e.key)) nowSeen.set(e.key, now);
    logLines.textContent = '';
    nowEmptyEl = undefined;
    const reduced = reduceMotion();
    let painted = 0;
    for (const e of ephemeral) {
      const seen = nowSeen.get(e.key)!;
      const age = now - seen;
      if (age >= NOW_TTL_MS) continue;
      const line = buildLogLine(e, false);
      line.classList.add('now-line');
      line.dataset.nowKey = String(e.key);
      if (!reduced && age >= NOW_TTL_MS - NOW_FADE_MS) line.classList.add('now-fading');
      logLines.append(line);
      painted += 1;
    }
    if (painted === 0) nowEmptyPlaceholder();
    // start the light fade/prune loop (idempotent) — only meaningful while `now` is active.
    if (nowInterval === undefined) nowInterval = window.setInterval(pruneNowView, 500);
    scrollLogToNewest();
  }
  // F27 — clear/drop the transient fresh-entries divider.
  function clearFreshDivider(): void {
    if (freshDividerTimer !== undefined) {
      window.clearTimeout(freshDividerTimer);
      freshDividerTimer = undefined;
    }
    freshDivider?.remove();
    freshDivider = undefined;
  }
  function markFreshDivider(): void {
    clearFreshDivider();
    const d = buildFreshDividerNode(); // same idiom the intro reuses (F27/F54)
    logLines.append(d); // fresh lines append AFTER it
    freshDivider = d;
    freshDividerTimer = window.setTimeout(() => {
      d.classList.add('fading');
      window.setTimeout(() => {
        if (freshDivider === d) {
          d.remove();
          freshDivider = undefined;
        }
      }, 800);
    }, 4500);
  }
  function setLogFilter(f: LogFilter): void {
    if (f === logFilter) return;
    const wasNow = logFilter === 'now';
    logFilter = f;
    // a filter switch repaints the newly-filtered view instantly (statically, no cascade).
    logLines.textContent = '';
    clearFreshDivider();
    if (wasNow) clearNowView(); // F53 — leaving Now drops its stamps + stops the fade interval
    lastKey = -1;
    lastPaintedKey = -1;
    lastPaintedCount = 0;
    revealQueue.length = 0;
    if (revealTimer !== undefined) {
      window.clearTimeout(revealTimer);
      revealTimer = undefined;
    }
    stopTyping(); // P2 — cancel any in-flight typewriter (the view is being repainted)
    if (lastState) {
      const wasFirst = firstRender;
      firstRender = true;
      renderLog(lastState);
      firstRender = wasFirst;
    }
    paintLogFilterBar();
    if (lastState) refreshLogTabs(lastState); // F20 — switching a tab clears its dot
    // F51 — land at the NEWEST line (bottom) INSTANTLY on a tab switch, so the reader always
    // starts at the freshest of the newly-filtered view (not stranded mid-scroll or up top). Re-pin
    // (F77) so subsequent lines in the newly-filtered view keep following the foot.
    logPinnedToBottom = true;
    logLines.scrollTop = logLines.scrollHeight;
  }
  function renderLog(state: GameState): void {
    const entries = state.log.entries;
    // a state replacement (new game / import) rewinds log.seq — clear the stale painted
    // log + reveal queue and re-render the fresh log from scratch (tab-switches keep seq, so
    // they never trigger this).
    const didReset = state.log.seq < lastSeq;
    if (didReset) {
      logLines.textContent = '';
      lastKey = -1;
      lastPaintedKey = -1;
      lastPaintedCount = 0;
      revealQueue.length = 0;
      clearFreshDivider();
      if (revealTimer !== undefined) {
        window.clearTimeout(revealTimer);
        revealTimer = undefined;
      }
      stopTyping(); // P2 — a reset must cancel any in-flight per-char typing timer
      clearNowView(); // F53 — a reset drops the fleeting-flavor stamps + fade timer too
    }
    lastSeq = state.log.seq;
    // F53 — the "Now" view owns its own rolling, self-fading render path (not the incremental
    // cascade): fully rebuild it from the ephemeral entries + their first-seen stamps.
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
        logFilterMatches(last.channel, logFilter, last.ephemeral === true) &&
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
          scrollLogToNewest();
        }
        lastPaintedCount = last.count ?? 1;
      }
      return;
    }
    for (const e of fresh) lastKey = Math.max(lastKey, e.key);
    const freshVisible = fresh.filter((e) =>
      logFilterMatches(e.channel, logFilter, e.ephemeral === true),
    );

    // F48 — while the intro owns the live reveal (the VN scene), the LOG is only the historical
    // transcript: append its lines INSTANTLY (no typewriter, no cascade) so it's ready the moment
    // the shell reveals, never making the player wait for the log to catch up to choices already
    // made. `introEndingRender` carries the same instant path onto the single reveal render.
    const introInstant = introActive(state.introBeat) || introEndingRender;

    // F27 — new lines flowing in over existing history get a transient divider before them (never
    // while the intro paints the hidden log — the player isn't watching the transcript build).
    if (
      freshVisible.length > 0 &&
      logLines.childElementCount > 0 &&
      !firstRender &&
      !didReset &&
      !introInstant
    ) {
      markFreshDivider();
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
          appendLine(e, !firstRender && !reduceMotion());
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

  // the T0→T1 ascension ceremony (D-062 — the first ascension always lands BIG): a larger,
  // longer-held title card than a rung promotion, the silhouettes stirring behind it.
  function showAscension(state: GameState): void {
    hooks.sfx.rankUp(); // the ascension also rings the bell (the bigger ceremony, D-062)
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

  function renderStorehouse(state: GameState): void {
    // the kura storehouse (batch-2 call 7 / D-113) — shelter CARRIED coin + rice from a lost-fight
    // penalty. Opens with the estate economy; spatially gated to the kura node in Step 5. D-107
    // Phase 2 surfaces RICE beside coin (deposit/withdraw are already resource-generic), so the
    // "what you store, you keep" shelter closes the rice loss-shelter gap.
    // IA reorg (D-112 §2 / F108) — the kura bank is the Inventory tab's home (a clean lift).
    const show = activeTab === 'inventory' && isUnlocked(state, 'panel-estate');
    toggle(storehousePane, show);
    if (!show) return;
    // build the shell ONCE (F81): the coin + rice store/withdraw rows and the "walk back" blurb are
    // all present, toggled in place by location; the balance line patches its text.
    if (!storehouseRefs) {
      const card = el('div', 'rung-card frame');
      card.append(el('div', 'rung-now', 'The storehouse 蔵'));
      card.append(
        el(
          'div',
          'skill-blurb',
          'Stow your coin and rice in the kura, safe from a beating on the road. What you carry, a lost fight can take; what you store, you keep.',
        ),
      );
      const when = el('div', 'influence-when');
      card.append(when);
      const row = el('div', 'labour-row');
      const dep = el('button', 'auto-toggle', 'Store all coin');
      dep.type = 'button';
      dep.addEventListener('click', () => dispatch({ type: 'deposit', resource: 'coin' }));
      const wd = el('button', 'auto-toggle', 'Withdraw all coin');
      wd.type = 'button';
      wd.addEventListener('click', () => dispatch({ type: 'withdraw', resource: 'coin' }));
      row.append(dep, wd);
      const riceRow = el('div', 'labour-row');
      const depRice = el('button', 'auto-toggle', 'Store all rice');
      depRice.type = 'button';
      depRice.addEventListener('click', () => dispatch({ type: 'deposit', resource: 'rice' }));
      const wdRice = el('button', 'auto-toggle', 'Withdraw all rice');
      wdRice.type = 'button';
      wdRice.addEventListener('click', () => dispatch({ type: 'withdraw', resource: 'rice' }));
      riceRow.append(depRice, wdRice);
      const away = el(
        'div',
        'area-blurb',
        'Use the Map 地図 tab to head back to the kura (蔵) to store or draw coin and rice.',
      );
      card.append(row, riceRow, away);
      storehousePane.append(card);
      storehouseRefs = { card, when, row, dep, wd, riceRow, depRice, wdRice, away };
    }
    const r = storehouseRefs;
    const carried = state.resources.coin ?? 0;
    const banked = state.banked.coin ?? 0;
    const carriedRice = state.resources.rice ?? 0;
    const bankedRice = state.banked.rice ?? 0;
    setText(
      r.when,
      `Carried ${formatCoin(carried)}, ${carriedRice} rice · stored ${formatCoin(banked)}, ${bankedRice} rice (safe)`,
    );
    // spatial (Step 5c): the storehouse IS the kura — the balance shows anywhere (your safe reserve
    // is worth seeing on the road), but you can only store/draw while standing at the grain-store.
    const atKura = state.location === 'kura';
    toggle(r.row, atKura);
    toggle(r.riceRow, atKura);
    toggle(r.away, !atKura);
    if (atKura) {
      setDisabled(r.dep, carried <= 0);
      const depTitle = r.dep.disabled ? 'No carried coin to store.' : '';
      if (r.dep.title !== depTitle) r.dep.title = depTitle;
      setDisabled(r.wd, banked <= 0);
      const wdTitle = r.wd.disabled ? 'Nothing stored to withdraw.' : '';
      if (r.wd.title !== wdTitle) r.wd.title = wdTitle;
      setDisabled(r.depRice, carriedRice <= 0);
      const depRiceTitle = r.depRice.disabled ? 'No carried rice to store.' : '';
      if (r.depRice.title !== depRiceTitle) r.depRice.title = depRiceTitle;
      setDisabled(r.wdRice, bankedRice <= 0);
      const wdRiceTitle = r.wdRice.disabled ? 'No rice stored to withdraw.' : '';
      if (r.wdRice.title !== wdRiceTitle) r.wdRice.title = wdRiceTitle;
    }
  }

  // the pedlar's grant string ("+2 sansai, +1 wood") — static per item (grants never change).
  function marketGrantStr(item: (typeof MARKET_ITEMS)[number]): string {
    return Object.entries(item.grants)
      .map(([r, n]) => `+${n} ${r}`)
      .join(', ');
  }
  // build ONE pedlar row skeleton (F67/F72 vertical stack: item copy, then the buy cell). The
  // price label + click listener are stable; patchMarketRow fills the mutable state.
  function buildMarketRow(item: (typeof MARKET_ITEMS)[number]): HTMLElement {
    const row = el('div', 'market-row');
    const left = el('div', 'market-item');
    left.append(el('span', 'market-name', item.label));
    left.append(el('span', 'market-grant lock-hint'));
    // the WHEN/WHY blurb (authored in market.ts) — so trade isn't a bare price list.
    left.append(el('span', 'skill-blurb market-blurb', item.blurb));
    row.append(left);
    // F67/F72 — the buy control sits in its OWN in-flow cell BELOW the item copy (the row is a
    // vertical stack, styles.css), so a narrow byōbu column can't let the price float over the copy.
    const buy = el('div', 'market-buy');
    const btn = el('button', 'auto-toggle', formatCoin(item.coinCost));
    btn.type = 'button';
    btn.addEventListener('click', () => dispatch({ type: 'buy_item', itemId: item.id }));
    buy.append(btn);
    row.append(buy);
    return row;
  }
  function patchMarketRow(
    row: HTMLElement,
    item: (typeof MARKET_ITEMS)[number],
    state: GameState,
  ): void {
    const bought = state.marketBought[item.id] ?? 0;
    const capped = bought >= item.stockCap;
    const grantStr = marketGrantStr(item);
    setText(row.querySelector('.market-grant')!, `${grantStr}${capped ? ' · sold out' : ''}`);
    const btn = row.querySelector<HTMLButtonElement>('.market-buy button')!;
    // a11y: the visible label is just the price — a full accessible name so a screen-reader hears
    // WHAT it buys, not a bare "10 mon" (D-045 a11y-ink).
    const aria = `Buy ${item.label} (${grantStr}) for ${formatCoin(item.coinCost)}${capped ? ' — sold out' : ''}`;
    if (btn.getAttribute('aria-label') !== aria) btn.setAttribute('aria-label', aria);
    setDisabled(btn, !canBuy(state.resources, item, bought));
    const title = capped
      ? "You've taken all the pedlar carries this run."
      : btn.disabled && (state.banked.coin ?? 0) >= item.coinCost
        ? 'Draw coin from the kura storehouse first'
        : '';
    if (btn.title !== title) btn.title = title;
  }
  // ── the SELL-RICE faucet (D-107 Phase 2 / §14): rice → coin at the SEASON-swinging price. The
  //    pedlar buys your rice — DEAR in the lean spring, CHEAP at the autumn glut — so store-or-sell
  //    is a light timing call. Built ONCE; the price line + sell button patch in place (zero churn). ──
  function buildSellRice(): {
    sell: HTMLElement;
    sellPrice: HTMLElement;
    sellBtn: HTMLButtonElement;
  } {
    const sell = el('div', 'market-sell');
    sell.append(el('div', 'rung-now', 'Sell your rice 米'));
    const sellPrice = el('div', 'skill-blurb');
    const buy = el('div', 'market-buy');
    const sellBtn = el('button', 'auto-toggle');
    sellBtn.type = 'button';
    sellBtn.addEventListener('click', () => dispatch({ type: 'sell_rice' }));
    buy.append(sellBtn);
    sell.append(sellPrice, buy);
    return { sell, sellPrice, sellBtn };
  }
  function patchSellRice(
    sellPrice: HTMLElement,
    sellBtn: HTMLButtonElement,
    state: GameState,
  ): void {
    const s = season(state);
    const price = balance.riceSellPrice(s);
    const prices = Object.values(balance.RICE_SELL_PRICE_BY_SEASON);
    const gloss =
      price >= Math.max(...prices)
        ? 'rice sells dear — a good season to sell'
        : price <= Math.min(...prices)
          ? 'the autumn glut — rice sells cheap; hold it in the kura if you can'
          : 'a fair price';
    setText(
      sellPrice,
      `The pedlar pays ${formatCoin(price)} the measure now — ${SEASON_TAG[s].name}, ${gloss}.`,
    );
    const rice = state.resources.rice ?? 0;
    setText(sellBtn, `Sell all rice (${rice} rice → ${formatCoin(rice * price)})`);
    // a11y: a full accessible name so a screen-reader hears WHAT the sell does + the live price.
    const aria = `Sell all ${rice} carried rice for ${formatCoin(rice * price)} at the ${SEASON_TAG[s].name} price of ${formatCoin(price)} each`;
    if (sellBtn.getAttribute('aria-label') !== aria) sellBtn.setAttribute('aria-label', aria);
    setDisabled(sellBtn, rice <= 0);
    const title = rice <= 0 ? 'No carried rice to sell — rake or farm to gather it.' : '';
    if (sellBtn.title !== title) sellBtn.title = title;
  }
  function renderMarket(state: GameState): void {
    // IA reorg (D-112 §2 / F109 / D-114) — the pedlar (Tokubei) is now a TALKABLE PERSON on the Map
    // tab's "who's here" list, not an inline menu. His wares (a `tiny` trader's shop) open ONLY while
    // he is the OPEN person: talk-to-reveal. Gate on `openPersonId === 'pedlar'` AND that he is
    // actually present (peopleHere) — so his shop is never dumped inline (on Work OR on Map).
    const pedlarPresent = peopleHere(state).some((p) => p.id === 'pedlar');
    const show = activeTab === 'map' && openPersonId === 'pedlar' && pedlarPresent;
    toggle(marketPane, show);
    if (!show) return;
    // ── the diverged goods presentation (D-075) — A = the price-button list (default, ships).
    //    B/C live DEV-only behind the variant toggle (ui/dev.ts). This DEV branch folds to dead code
    //    in prod (`import.meta.env.DEV` → false, tree-shaken) and `dev` is undefined in prod AND
    //    tests, so ONLY a live DEV session takes it — where the variant toggle needs the wholesale
    //    clear-and-rebuild. Prod/tests use the incremental path below (F81, zero idle churn). ──
    if (import.meta.env.DEV && dev) {
      marketRefs = null; // drop the incremental shell so returning to default rebuilds cleanly
      marketPane.textContent = '';
      const card = el('div', 'rung-card frame market-card');
      card.append(el('div', 'rung-now', 'The pedlar 市'));
      card.append(el('div', 'skill-blurb', MARKET_BLURB));
      if (!dev.renderVariant('market', card, state, dispatch)) {
        for (const item of MARKET_ITEMS) {
          const row = buildMarketRow(item);
          patchMarketRow(row, item, state);
          card.append(row);
        }
      }
      // the sell-rice faucet is always present (a fresh build per wholesale render — DEV-only path).
      const { sell, sellPrice, sellBtn } = buildSellRice();
      patchSellRice(sellPrice, sellBtn, state);
      card.append(sell);
      marketPane.append(card);
      return;
    }
    // prod / test — build the card + rows container + sell section ONCE, then patch in place.
    if (!marketRefs) {
      const card = el('div', 'rung-card frame market-card');
      card.append(el('div', 'rung-now', 'The pedlar 市'));
      card.append(el('div', 'skill-blurb', MARKET_BLURB));
      const rows = el('div', 'market-rows');
      card.append(rows);
      const { sell, sellPrice, sellBtn } = buildSellRice();
      card.append(sell);
      marketPane.append(card);
      marketRefs = { card, rows, sellPrice, sellBtn };
    }
    reconcileList(marketRefs.rows, MARKET_ITEMS, {
      key: (item) => item.id,
      build: (item) => buildMarketRow(item),
      patch: (row, item) => patchMarketRow(row, item, state),
      order: true,
    });
    patchSellRice(marketRefs.sellPrice, marketRefs.sellBtn, state);
  }

  // build a fresh you-are-here card (used by the DEV-default wholesale path). The incremental path
  // below builds this shell ONCE and patches it; the moveStrip is mounted via the shared patchStrip
  // (Phase 2), so it too is zero-churn — swapped only when the reachable set actually changes.
  function fillMapHere(
    loc: HTMLElement,
    kanji: HTMLElement,
    here: ReturnType<typeof getNode>,
  ): void {
    // strip a leading article so a label like "The grain-store (kura)" doesn't read "the the …"
    setText(loc, `You stand at the ${here.label.toLowerCase().replace(/^the /, '')} `);
    if (here.kanji) {
      setText(kanji, here.kanji);
      toggle(kanji, true);
    } else {
      toggle(kanji, false);
    }
  }
  // ── the Map "who's here 衆" people (D-114 vendors-as-people) — a talk affordance per present
  //    person: a category-coloured hanko seal + name + a one-line tell + a Speak button. Built ONCE
  //    (listener bound here); patch flips the open/closed label + the greeting line in place (F81).
  //    Talk dispatches by depth: a `tiny` trader's Speak opens his wares (renderMarket, gated on
  //    `openPersonId`); a `small`/`vn` person opens his greeting line (a simple talk panel for now). ──
  function buildPersonRow(p: NodePerson): HTMLElement {
    const row = el('div', 'person-row frame');
    const head = el('div', 'person-head');
    const color = VOICE_COLOR[p.voice];
    const seal = el('span', 'person-seal', VOICE_SEAL[p.voice]);
    seal.lang = 'ja';
    seal.style.color = color;
    seal.style.borderColor = color;
    const name = el('span', 'person-name', p.name);
    name.style.color = color;
    head.append(seal, name);
    if (p.tell) head.append(el('span', 'person-tell lock-hint', p.tell));
    row.append(head);
    const say = el('div', 'person-say skill-blurb');
    row.append(say);
    const talk = el('button', 'verb person-talk');
    talk.type = 'button';
    talk.addEventListener('click', () => {
      // toggle the conversation: talking again (or to someone else) opens THIS person; a second
      // click on the open person closes it. Re-render off the last state (like setTab), UI-only.
      openPersonId = openPersonId === p.id ? null : p.id;
      if (lastState) render(lastState, null);
    });
    row.append(talk);
    return row;
  }
  function patchPersonRow(row: HTMLElement, p: NodePerson): void {
    const open = openPersonId === p.id;
    const talk = row.querySelector<HTMLButtonElement>('.person-talk')!;
    setText(talk, open ? `Leave ${p.name}` : `Speak with ${p.name}`);
    setClass(talk, 'on', open);
    const say = row.querySelector<HTMLElement>('.person-say')!;
    toggle(say, open && Boolean(p.greeting));
    if (open && p.greeting) setText(say, p.greeting);
  }
  // render the who's-here list into a host (shared by the incremental + DEV-default map paths so the
  // DEV default never drifts from prod, §6.5). Returns whether anyone is present (⇒ show the host).
  function fillWhosHere(list: HTMLElement, present: readonly NodePerson[]): boolean {
    reconcileList(list, present, {
      key: (p) => p.id,
      build: (p) => buildPersonRow(p),
      patch: (row, p) => patchPersonRow(row, p),
      order: true,
    });
    return present.length > 0;
  }
  function renderMap(state: GameState): void {
    const show = activeTab === 'map';
    toggle(mapPane, show);
    if (!show) return;
    // D-114 — if the person you were talking to is no longer here (you walked off, or a place-gate
    // that had opened isn't satisfied), close the conversation so no stale wares/greeting linger.
    const present = peopleHere(state);
    if (openPersonId !== null && !present.some((p) => p.id === openPersonId)) openPersonId = null;
    // ── the diverged map body (D-075) — A = the you-are-here card + "Paths lead to →" list (the
    //    self-picked default, ships). B/C live DEV-only behind the variant toggle (ui/dev.ts). The
    //    DEV branch folds to dead code in prod (tree-shaken) and `dev` is undefined in prod AND
    //    tests, so only a live DEV session takes it; prod/tests use the incremental path below. ──
    if (import.meta.env.DEV && dev) {
      mapRefs = null; // drop the incremental shell so returning to default rebuilds cleanly
      mapPane.textContent = '';
      mapPane.append(el('h2', undefined, 'The estate 地図'));
      if (dev.renderVariant('map', mapPane, state, dispatch)) return;
      const here = getNode(state.location);
      const card = el('div', 'map-here frame');
      const h = el('div', 'rung-now');
      const loc = el('span');
      const k = el('span', 'house-influence-kanji');
      k.lang = 'ja';
      h.append(loc, k);
      fillMapHere(loc, k, here);
      card.append(h);
      card.append(el('div', 'skill-blurb', here.blurb));
      const strip = moveStrip(state, 'work');
      if (strip) {
        card.append(el('div', 'lock-hint map-paths-label', 'Paths lead to:'));
        card.append(strip);
      }
      mapPane.append(card);
      // D-114 who's-here (DEV-default parity with prod, §6.5) — a fresh list each wholesale render.
      if (present.length > 0) {
        const whos = el('div', 'whos-here');
        whos.append(el('div', 'rung-now', 'Who’s here 衆'));
        const list = el('div', 'whos-list');
        fillWhosHere(list, present);
        whos.append(list);
        mapPane.append(whos);
      }
      return;
    }
    // prod / test — build the h2 + you-are-here card shell ONCE (F81), patch text in place. The
    // moveStrip is mounted via the shared patchStrip (Phase 2), so it's zero-churn on an idle tick.
    if (!mapRefs) {
      mapPane.append(el('h2', undefined, 'The estate 地図'));
      const card = el('div', 'map-here frame');
      const h = el('div', 'rung-now');
      const loc = el('span');
      const kanji = el('span', 'house-influence-kanji');
      kanji.lang = 'ja';
      h.append(loc, kanji);
      const blurb = el('div', 'skill-blurb');
      const paths = el('div', 'map-paths');
      const pathsLabel = el('div', 'lock-hint map-paths-label', 'Paths lead to:');
      const strip = el('div', 'map-strip');
      paths.append(pathsLabel, strip);
      card.append(h, blurb, paths);
      mapPane.append(card);
      // D-114 — the who's-here section, a sibling of the you-are-here card (built ONCE; the person
      // rows reconcile). Hidden below when no one is present (F72 ghost-box — no empty framed card).
      const whos = el('div', 'whos-here');
      whos.append(el('div', 'rung-now', 'Who’s here 衆'));
      const whosList = el('div', 'whos-list');
      whos.append(whosList);
      mapPane.append(whos);
      mapRefs = { card, loc, kanji, blurb, paths, pathsLabel, strip, whos, whosList };
    }
    const r = mapRefs;
    const here = getNode(state.location);
    fillMapHere(r.loc, r.kanji, here);
    setText(r.blurb, here.blurb);
    // the move strip is now zero-churn too (Phase 2): patchStrip only swaps it when the reachable
    // set actually changed, so an idle re-render leaves the live buttons (and their focus) untouched.
    toggle(r.paths, patchStrip(r.strip, state, 'work'));
    // D-114 who's-here — reconcile the present people; hide the whole section when the node is empty.
    toggle(r.whos, fillWhosHere(r.whosList, present));
  }

  // build ONE quest card skeleton with every mutable element present (steps + reward line + accept
  // button); patchQuestCard toggles/patches them for the offer → accepted → done states in place.
  function buildQuestCard(q: (typeof QUESTS)[number]): HTMLElement {
    const card = el('div', 'quest-card frame');
    const head = el('div', 'skill-head');
    head.append(el('span', 'skill-name', q.title));
    head.append(el('span', 'skill-lvl'));
    card.append(head);
    card.append(el('div', 'skill-blurb', q.blurb));
    const stepsEl = el('div', 'quest-steps');
    for (const s of q.steps) {
      const row = el('div', 'quest-step');
      row.append(el('span', 'quest-check'));
      row.append(el('span', undefined, s.label));
      stepsEl.append(row);
    }
    card.append(stepsEl);
    card.append(el('div', 'influence-when'));
    const btn = el('button', 'verb', 'Take this on');
    btn.type = 'button';
    btn.addEventListener('click', () => dispatch({ type: 'accept_quest', questId: q.id }));
    card.append(btn);
    return card;
  }
  function patchQuestCard(card: HTMLElement, q: (typeof QUESTS)[number], state: GameState): void {
    const done = new Set(state.quests.progress[q.id] ?? []);
    const completed = state.quests.completed.includes(q.id);
    const accepted = state.quests.accepted.includes(q.id);
    setClass(card, 'done', completed);
    setText(card.querySelector('.skill-lvl')!, completed ? 'Done ✓' : q.kind);
    // the objectives are legible pre-accept too (every step ☐ until the quest is taken on).
    const showChecks = accepted || completed;
    const rows = card.querySelectorAll<HTMLElement>('.quest-steps .quest-step');
    q.steps.forEach((s, i) => {
      const row = rows[i]!;
      const ok = showChecks && done.has(s.id);
      setText(row.querySelector('.quest-check')!, ok ? '☑' : '☐');
      setClass(row, 'ok', ok);
    });
    const rk = q.reward.resources?.coin;
    const reward = card.querySelector<HTMLElement>('.influence-when')!;
    const rewardShown = !!rk && !completed;
    toggle(reward, rewardShown);
    if (rewardShown) setText(reward, `Reward: ${formatCoin(rk)}`);
    // the accept button shows only on an un-taken offer.
    toggle(card.querySelector<HTMLButtonElement>('.verb')!, !accepted && !completed);
  }
  function renderQuests(state: GameState): void {
    // IA reorg (D-112 §8.1) — the six-tab set has no Quests tab; quests fold into Character as the
    // "Undertakings 用" section (a personal journal of goals taken on). D-112 (newest steer)
    // supersedes D-037's "Quests is its own tab." They still open with combat (the crop-raider
    // quest needs the field-defence verbs), so gate on tab-combat as before — but shown on Character.
    const show = activeTab === 'character' && isUnlocked(state, 'tab-combat');
    toggle(questsPane, show);
    if (!show) return;
    // ── the diverged Quests body (D-075) — A = the .frame cards (default, ships). B/C live DEV-only
    //    behind the variant toggle (ui/dev.ts). The DEV branch folds to dead code in prod
    //    (tree-shaken) and `dev` is undefined in prod AND tests, so only a live DEV session takes it;
    //    prod/tests use the incremental path below (F81, zero idle churn). ──
    if (import.meta.env.DEV && dev) {
      questsRefs = null; // drop the incremental shell so returning to default rebuilds cleanly
      questsPane.textContent = '';
      questsPane.append(el('h2', undefined, 'Undertakings 用'));
      if (!dev.renderVariant('quests', questsPane, state, dispatch)) {
        questsPane.append(el('div', 'skill-blurb', QUESTS_BLURB));
        for (const q of QUESTS) {
          const card = buildQuestCard(q);
          patchQuestCard(card, q, state);
          questsPane.append(card);
        }
      }
      return;
    }
    // prod / test — build the h2 + blurb + list container ONCE, reconcile the quest cards in place.
    if (!questsRefs) {
      questsPane.append(el('h2', undefined, 'Undertakings 用'));
      questsPane.append(el('div', 'skill-blurb', QUESTS_BLURB));
      const list = el('div', 'quests-list');
      questsPane.append(list);
      questsRefs = { list };
    }
    reconcileList(questsRefs.list, QUESTS, {
      key: (q) => q.id,
      build: (q) => buildQuestCard(q),
      patch: (card, q) => patchQuestCard(card, q, state),
      order: true,
    });
  }

  function coldOpenReduced(): boolean {
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('reduced-motion')
    );
  }
  // The slow cold-open reveal (F14) — the GBA-typewriter take, human-approved as the prod
  // default (2026-07-02). Runs once per cold-open (the started-flag guards re-entry); the
  // wake-path resets the flag so a New Game replays it.
  function applyColdOpenReveal(): void {
    if (coldOpenRevealStarted) return;
    coldOpenRevealStarted = true;
    cancelColdOpenReveal?.();
    const items = [coTitle, coRoman, coLede, coVerb];
    for (const it of items) it.classList.add('co-reveal-item');
    coLede.textContent = COLD_OPEN_LEDE;
    for (const it of items) it.classList.remove('in');
    const showButton = (): void => coVerb.classList.add('in');
    if (coldOpenReduced()) {
      for (const it of items) it.classList.add('in');
      cancelColdOpenReveal = undefined;
      return;
    }
    // GBA typewriter (human-approved 2026-07-02): the title shows, the subtitle fades in,
    // the lede types out character-by-character (old-Pokémon feel), then the CTA wakes in.
    coTitle.classList.add('in');
    const timers: number[] = [];
    const at = (fn: () => void, ms: number): void => {
      timers.push(window.setTimeout(fn, ms));
    };
    at(() => coRoman.classList.add('in'), 400);
    coLede.textContent = '';
    coLede.classList.add('in');
    const full = COLD_OPEN_LEDE;
    const start = 1100;
    const per = 32;
    for (let i = 0; i < full.length; i++) {
      at(
        () => {
          coLede.textContent = full.slice(0, i + 1);
        },
        start + i * per,
      );
    }
    at(showButton, start + full.length * per + 900);
    cancelColdOpenReveal = () => timers.forEach((id) => window.clearTimeout(id));
  }
  function render(state: GameState, prev: GameState | null): void {
    lastState = state;
    // pre-awake: show only the cold-open card; the shell (and its log) inks in on waking.
    if (!hasFlag(state, 'awake')) {
      coldOpen.hidden = false;
      shell.hidden = true;
      firstRender = false; // so the post-wake log cascades rather than dumping statically
      activeTab = 'work'; // New Game → reset the UI to the zero state (F25)
      openPersonId = null; // …and close any open who's-here conversation (D-114)
      logFilter = 'story';
      applyColdOpenReveal();
      return;
    }
    coldOpen.hidden = true;
    // leaving the cold-open: cancel any pending reveal and reset so a New Game replays it.
    if (coldOpenRevealStarted) {
      cancelColdOpenReveal?.();
      coldOpenRevealStarted = false;
    }
    // F44/D-104 — the interactive intro plays as a FULL-SCREEN VN scene that hides the whole shell;
    // the estate inks in only AFTER the intro ends (the incremental-reveal signature). The log is
    // kept painted INSTANTLY behind the scene (F48) so it's ready the moment the shell reveals —
    // the scene owns the live spoken reveal, the log is only the historical transcript.
    if (introActive(state.introBeat)) {
      shell.hidden = true;
      firstRender = false; // the post-intro log resumes its cascade, not a static dump
      activeTab = 'work';
      logFilter = 'story';
      renderLog(state); // instant while introActive (see renderLog) — no slow catch-up on reveal
      syncIntroScene(state);
      return;
    }
    // the intro is over (or never ran) — drop the scene and reveal the shell. Flag the single
    // reveal render so the final beat's log lines paint instantly too (F48), not via the cascade.
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
    // (`framing-cards`), the human's picked default and now the SOLE prod rendering (D-075
    // zero-flag-debt; the layout/framing variant toggles were pruned from ui/dev.ts). CSS arranges
    // the slices per `.workspace[data-layout]` and frames them per `[data-framing]`; the shell
    // carries the layout too so the framed spread widens (but never full-bleeds) with the workspace.
    workspace.dataset.layout = 'layout-byobu';
    workspace.dataset.framing = 'framing-cards';
    shell.dataset.layout = 'layout-byobu';
    renderVitals(state, prev);
    renderNav(state);
    renderLog(state);
    paintLogFilterBar();
    // F59 — first awake render: mark all loaded entries seen (history), so no channel shows a
    // stale unread dot on load/refresh. After this, only mid-session arrivals trip a dot.
    if (!logSeenSeeded) {
      logSeenSeeded = true;
      const loaded = state.log.entries;
      for (const f of Object.keys(logSeen) as LogFilter[]) logSeen[f] = maxKeyForFilter(loaded, f);
    }
    refreshLogTabs(state); // F20 — repaint per-tab unread dots
    workHead.hidden = activeTab !== 'work';
    renderLadder(state);
    renderEstate(state);
    renderMarket(state);
    renderStorehouse(state);
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
    // ascension lands the bigger ceremony (D-062). Tier change wins (don't double-fire).
    if (prev && prev.tier !== state.tier && !firstRender) showAscension(state);
    else if (prev && prev.rung !== state.rung && !firstRender) showRankUp(state);
    introEndingRender = false; // one-shot: the intro-reveal render is done
    firstRender = false;
  }

  return render;
}
