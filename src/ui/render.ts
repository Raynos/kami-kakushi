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

const RESOURCE_LABEL: Record<string, string> = { koku: 'koku', wood: 'wood', sansai: 'sansai' };

type Dispatch = (intent: Intent) => void;
type Tab = 'work' | 'skills' | 'combat' | 'quests' | 'map';

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

  const koku = vital('koku', 'koku');
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
  // bites carried koku). It sits beside `body` so the player can always SEE they're hurt + heal (eat).
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
  header.append(koku.wrap, clock, health, stamina, wood.wrap, sansai.wrap);

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
  // Order matters for FEEL (spatial model, v0.3.1): the node-specific LABOUR (`actions`) is the HERO
  // — what you walked to this node to DO — so it leads "What you can do", with the rung ladder as
  // progress-context right below it and the global "spend-koku" panes (estate/market/storehouse)
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
  sliceDo.append(workHead, actions, skillsPane, combatPane, questsPane, mapPane);
  // P2 · Path & Progress — the rung ladder (appears at first rake, R0→R1).
  const sliceProgress = el('section', 'slice slice-progress');
  sliceProgress.dataset.panel = 'progress';
  sliceProgress.setAttribute('aria-label', 'Path & progress');
  sliceProgress.append(ladder);
  // P3 · Estate & Economy — the koku sinks + the R7 House-Influence capstone (~R2).
  const sliceEstate = el('section', 'slice slice-estate');
  sliceEstate.dataset.panel = 'estate';
  sliceEstate.setAttribute('aria-label', 'Estate & economy');
  sliceEstate.append(estatePane, marketPane, storehousePane, influence);
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

  const TAB_LABEL: Record<Tab, string> = {
    work: 'Work',
    skills: 'Skills 技',
    combat: 'Combat 武',
    quests: 'Quests 用',
    map: 'Estate 地図',
  };
  function renderNav(state: GameState): void {
    const tabs: Tab[] = ['work'];
    // the walkable estate map opens once the gate does (R1 — you can step off the kura floor).
    if (isUnlocked(state, 'room-gate-forecourt')) tabs.push('map');
    if (isUnlocked(state, 'tab-skills')) tabs.push('skills');
    if (isUnlocked(state, 'tab-combat')) tabs.push('combat');
    // Quests open with combat (the crop-raider quest needs the field-defence verbs) — D-037.
    if (isUnlocked(state, 'tab-combat')) tabs.push('quests');
    nav.hidden = tabs.length < 2;
    if (nav.hidden) return;
    if (!tabs.includes(activeTab)) activeTab = 'work';
    nav.textContent = '';
    for (const tab of tabs) {
      const btn = el('button', `nav-tab${activeTab === tab ? ' active' : ''}`, TAB_LABEL[tab]);
      btn.type = 'button';
      btn.addEventListener('click', () => setTab(tab));
      nav.append(btn);
    }
  }

  function renderLadder(state: GameState): void {
    ladder.textContent = '';
    // show the meter during R0 too (once you've raked) — the ladder used to hide until R1, leaving the
    // whole cold-open with no visible progress toward the first promotion (fun-factor "a next goal").
    // F72 — HIDE the container whenever there's nothing to show (off the Work tab OR the gate isn't
    // met yet), so an empty ladder never leaves the Progress slice as an empty framed ghost card.
    ladder.hidden =
      activeTab !== 'work' || !(isUnlocked(state, 'panel-rung-ladder') || hasFlag(state, 'raked'));
    if (ladder.hidden) return;
    const rank = currentRank(state);
    const prog = rungProgress(state);
    // FULL meter but an unmet story-gate (e.g. auto-labour maxed the bar without ever fighting the
    // wolf): show the deed still owed, not a stuck "Estate service · N/N" — a maxed bar must never
    // read as a dead wall (fun-factor "always a visible next goal").
    const gated = prog.into >= prog.needed && !prog.ready;
    const card = el('div', 'rung-card frame');
    card.append(el('div', 'rung-now', `${rank.title} · ${rank.kanji}`));
    const meter = el('div', 'meter');
    const meterFill = el('span');
    // hold the fill just shy of full while gated, so a truly-full bar always means promotable.
    // Guard the fraction (needed is always >0, but a stray 0 would print `NaN%` = an empty ghost
    // meter right after a rung reset, F72), then clamp to a clean 0–100.
    const frac = prog.needed > 0 ? Math.max(0, Math.min(1, prog.into / prog.needed)) : 0;
    meterFill.style.width = `${gated ? 92 : Math.round(frac * 100)}%`;
    meter.append(meterFill);
    card.append(meter);
    card.append(
      el(
        'div',
        'rung-hint',
        prog.ready
          ? 'Ready to advance.'
          : gated
            ? (rank.advanceHint ?? 'The work is done — a deed still stands before the next rung.')
            : `Estate service · ${prog.into}/${prog.needed}`,
      ),
    );
    const nid = nextRankId(rank.id);
    if (nid) {
      const nextRank = getRank(nid);
      card.append(el('div', 'rung-next', `Next: ${nextRank.title} ${nextRank.kanji}`));
    } else {
      card.append(
        el('div', 'rung-next frontier', 'Beyond the gate the road climbs on — to be continued.'),
      );
    }
    ladder.append(card);
  }

  function renderEstate(state: GameState): void {
    estatePane.textContent = '';
    const show = activeTab === 'work' && isUnlocked(state, 'panel-estate');
    estatePane.hidden = !show;
    if (!show) return;
    const stage = state.estateStage;
    const name = ESTATE_STAGE_NAMES[stage] ?? ESTATE_STAGE_NAMES[ESTATE_STAGE_NAMES.length - 1]!;
    const card = el('div', 'rung-card frame');
    card.append(el('div', 'rung-now', `Estate · ${name}`));
    const next = ESTATE_STAGES.find((s) => s.stage === stage + 1);
    if (next) {
      card.append(el('div', 'skill-blurb', next.blurb));
      // the mechanical PAYOFF (the koku flywheel — the whole reason to sink koku into the estate),
      // read from the source-of-truth stage fields so it never drifts (R6: an invisible mechanic).
      card.append(
        el(
          'div',
          'rung-hint',
          `+${next.yieldBonusNum}% labour output · +${next.satietyMaxBonus} max body`,
        ),
      );
      const btn = el('button', 'verb', `${next.label} (${next.kokuCost} koku)`);
      btn.type = 'button';
      const carried = state.resources.koku ?? 0;
      const banked = state.banked.koku ?? 0;
      btn.disabled = carried < next.kokuCost;
      // don't lie "Needs N koku" when the koku is merely sitting safe in the kura — point at the bank.
      if (btn.disabled) {
        btn.title =
          banked >= next.kokuCost
            ? 'Draw koku from the kura storehouse first'
            : `Needs ${next.kokuCost} koku`;
      }
      btn.addEventListener('click', () => dispatch({ type: 'improve_estate' }));
      card.append(btn);
    } else {
      card.append(el('div', 'rung-hint', 'The estate stands restored.'));
    }
    estatePane.append(card);

    // A8: the house physically REOPENS its rooms as your standing rises (omoya R4, workshops +
    // granary R6, the lord's study R7). Flavour — the estate's recovery made visible — not walkable
    // map nodes (the 7-node ceiling is untouched). Each row inks in when its rung reveal fires.
    const HOUSE_ROOMS: readonly { surface: string; kanji: string; label: string }[] = [
      { surface: 'house-omoya', kanji: '母屋', label: 'The main house reopened' },
      { surface: 'house-workshops', kanji: '工房', label: 'The workshops woken' },
      { surface: 'house-granary', kanji: '板倉', label: 'A new granary raised' },
      { surface: 'house-study', kanji: '書院', label: "The lord's study opened to you" },
    ];
    const opened = HOUSE_ROOMS.filter((r) => isUnlocked(state, r.surface));
    if (opened.length > 0) {
      const house = el('div', 'rung-card frame');
      house.append(el('div', 'rung-now', 'The house reopens 家'));
      for (const r of opened) house.append(el('div', 'rung-hint', `${r.kanji} · ${r.label}`));
      estatePane.append(house);
    }
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

  function renderHouseInfluence(state: GameState): void {
    influence.textContent = '';
    const show = activeTab === 'work' && isUnlocked(state, 'panel-house-influence');
    influence.hidden = !show;
    if (!show) return;

    const live = phaseOf(state) === 2; // the macro engine opens at the R7 capstone (D-055)
    const card = el('div', `influence-panel frame${live ? ' live' : ' locked'}`);
    card.setAttribute(
      'aria-label',
      live ? 'House Influence' : 'House Influence — opens once you are trusted of the house',
    );
    const head = el('div', 'rung-now');
    head.append(document.createTextNode('House Influence '));
    const k = el('span', 'house-influence-kanji');
    k.lang = 'ja';
    k.textContent = '家威';
    head.append(k);
    card.append(head);

    if (!live) {
      // pre-capstone teaser: the measure of the house, still out of reach (unnamed silhouettes).
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

    // ── Phase 2 — the live Estate (家産) pillar + its grade bar + the locked silhouettes ──
    const est = state.influence.estate;
    const grade = estateGrade(state);
    const bands = balance.ESTATE_BANDS;
    const gradeWord =
      grade === 'EXCELLENT'
        ? 'Excellent 秀'
        : grade === 'GREAT'
          ? 'Great 優'
          : grade === 'GOOD'
            ? 'Good 良'
            : 'Unranked';

    const activeRow = el('div', 'influence-row active');
    const name = el('span', 'influence-name');
    const dot = el('span', 'pillar-dot estate', '◆');
    dot.setAttribute('aria-hidden', 'true');
    name.append(dot, document.createTextNode(' Estate & Wealth '));
    const kj = el('span');
    kj.lang = 'ja';
    kj.textContent = '家産';
    name.append(kj);
    activeRow.append(name);
    activeRow.append(el('span', `influence-grade grade-${grade.toLowerCase()}`, gradeWord));
    card.append(activeRow);

    // ── grade visual (the diverged surface, D-075) — A = the continuous ink grade-bar (the
    //    self-picked default; ships to prod). B/C live DEV-only behind the variant toggle and
    //    are stripped from the prod bundle (the `import.meta.env.DEV` guard folds to dead code
    //    in prod, so ui/dev.ts tree-shakes out — see ui/dev.ts + the gh-pages strip-guard). ──
    if (!(import.meta.env.DEV && dev && dev.renderVariant('influence', card, state, dispatch))) {
      // A (default): the continuous ink grade-bar, ticks at GOOD / GREAT / EXCELLENT
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
          `Standing ${est.value} · the season judges at ${est.highWater}`,
        ),
      );
    }

    // the pillars yet to come — unnamed silhouettes (D-055)
    for (let i = 0; i < 3; i++) card.append(silhouetteRow());

    // the manual opt-in ascension (D-049/D-062) — only the OPTION, the player picks the moment
    if (state.tier >= 1) {
      // the AFTER of the payoff (Step 5d / F2 — "design the AFTER of every payoff"): once you have
      // ascended, the ceremony must resolve into a satisfying next-state — NOT the stale
      // "reach Excellent to ascend (480/480)" prompt the big moment used to land on.
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
            `The lord's boon waits on you: ${pts} point${pts === 1 ? '' : 's'} to spend at Training 鍛錬 on the Combat tab.`,
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
          `Reach Excellent standing to ascend (${est.value}/${bands.excellent}).`,
        ),
      );
    }
    influence.append(card);
  }

  /** The reachable-neighbour move buttons (`→ node`, danger ⚠ + the conditioning lock). Shared by the
   *  MAP tab (the fuller view) AND the Work tab's "Walk on" strip, so you can move WITHOUT a
   *  tab-switch — the spatial loop stays smooth. Returns null when nowhere is walkable from here. */
  function moveStrip(state: GameState, keyPrefix: string): HTMLElement | null {
    const revealed = new Set(state.unlocked);
    const moves = reachableFrom(state.location, revealed);
    if (moves.length === 0) return null;
    const RES_WORD: Record<string, string> = { koku: 'rice', wood: 'wood', sansai: 'greens' };
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
  // One entry of the LEFT-column transcript. `player` adds a "You: " prefix + the player colour;
  // `fresh` marks a resolved-choice line (⇒ the fade-away divider); `prompt` styles the decision
  // question. `key` is stable across renders so the append-only diff never re-adds an entry.
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
    introLineTyping = false;
    introBlockNodes = [];
    introBlockIndex = -1;
    introScene?.classList.remove('typing');
    const cb = introOnBlockDone;
    introOnBlockDone = undefined;
    cb?.(); // ⇒ fade the RIGHT panel's controls in, AFTER the text has finished typing
  }
  function introLineComplete(): void {
    introLineTyping = false;
    if (introBlockIndex >= introBlockNodes.length - 1) introFinishBlock();
    // else: pause — the next click advances to the next line (F62 one-line-per-click)
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
      if (e.player && e.speaker) p.append(el('span', 'vn-speaker', `${e.speaker}: `));
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
    } else if (introBlockNodes.length === 0) {
      // no new text + nothing mid-type ⇒ a pure panel swap (Done) or an idempotent re-render.
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

  function renderActions(state: GameState): void {
    actions.textContent = '';
    actions.hidden = activeTab !== 'work';
    if (activeTab !== 'work') return;

    // (the interactive intro no longer renders here — while it's live the shell is hidden and the
    // full-screen VN scene owns the screen; render() returns before renderActions is ever reached.)

    // meta verbs (rake / rest). Rake gets an auto-repeat toggle (revealed after a few manual rakes so
    // the first ones still land as juice) — the R0 cold-open is ~550 rakes and must not be a blind
    // click-grind (fun-factor "first-5-min hook"; every later labour already has an auto-toggle).
    for (const a of availableActions(state)) {
      if (a === 'rake_rice') {
        const row = el('div', 'labour-row');
        const btn = el('button', 'verb', META_LABELS.rake_rice);
        btn.type = 'button';
        btn.addEventListener('click', () => dispatch({ type: 'rake_rice' }));
        row.append(btn);
        if (state.rungMeter >= RAKE_AUTO_REVEAL_METER) {
          const on = state.autoRake;
          const toggle = el('button', `auto-toggle${on ? ' on' : ''}`, on ? '■ stop' : '▶ auto');
          toggle.type = 'button';
          toggle.setAttribute('aria-pressed', String(on));
          toggle.addEventListener('click', () => dispatch({ type: 'set_auto_rake', on: !on }));
          row.append(toggle);
        }
        actions.append(row);
      } else {
        const btn = el('button', 'verb', META_LABELS[a]);
        if (a === 'open_eyes') btn.classList.add('primary');
        btn.type = 'button';
        btn.addEventListener('click', () => dispatch({ type: a } as Intent));
        actions.append(btn);
      }
    }

    // the humbling first fight — a charged one-time beat (the wolf cornered in the kura). Spatial
    // (Step 5b): you face it where you woke, so at the kura the charged button shows; anywhere else
    // it's a standing summons to walk back.
    const wolfPending =
      isUnlocked(state, 'verb-face-wolf') && !hasFlag(state, 'first-fight-survived');
    if (wolfPending && state.location === 'kura') {
      const wolf = el('button', 'verb primary');
      wolf.append(
        el('span', 'emoji', '⚔️'),
        document.createTextNode(' Face the wolf at the grain store'),
      );
      wolf.type = 'button';
      wolf.addEventListener('click', () => dispatch({ type: 'face_wolf' }));
      actions.append(wolf);
    } else if (wolfPending) {
      actions.append(
        el(
          'p',
          'area-blurb',
          'The grain-store wolf still waits where you woke. Use Walk on 道 below to head back to the kura (蔵) and face it.',
        ),
      );
    }

    // labour activities, grouped by estate room (each: do-once + auto-repeat toggle)
    const labours = availableLabours(state);
    for (const area of AREAS) {
      const opts = labours.filter((o) => o.activity.area === area.id);
      if (opts.length === 0) continue; // e.g. kura has no labour activity
      const group = el('div', 'area-group');
      group.append(el('h3', 'area-head', area.label));
      group.append(el('p', 'area-blurb', area.blurb));
      for (const opt of opts) {
        const row = el('div', 'labour-row');
        const btn = el('button', 'verb', opt.activity.label);
        btn.type = 'button';
        btn.disabled = !opt.available;
        if (!opt.available && opt.reason) btn.title = opt.reason;
        btn.addEventListener('click', () =>
          dispatch({ type: 'do_activity', activityId: opt.activity.id }),
        );
        row.append(btn);
        if (opt.available) {
          const auto = state.autoActivity === opt.activity.id;
          const toggle = el(
            'button',
            `auto-toggle${auto ? ' on' : ''}`,
            auto ? '■ stop' : '▶ auto',
          );
          toggle.type = 'button';
          toggle.setAttribute('aria-pressed', String(auto));
          toggle.addEventListener('click', () =>
            dispatch({ type: 'set_auto', activityId: auto ? null : opt.activity.id }),
          );
          row.append(toggle);
        } else if (opt.reason) {
          row.append(el('span', 'lock-hint', opt.reason));
        }
        group.append(row);
      }
      actions.append(group);
    }

    // spatial (v0.3.1 Step 5): a node with no labour (and no wolf-beat prompting here) leads into the
    // "Walk on" strip below — no need to open the map tab.
    if (
      labours.length === 0 &&
      !wolfPending &&
      hasFlag(state, 'awake') &&
      isUnlocked(state, 'room-gate-forecourt')
    ) {
      actions.append(el('p', 'area-blurb', 'No work to be had where you stand — walk on.'));
    }

    // cook a meal — sansai → satiety AND the ONLY way to mend HP (D-050/D-076). Say so, and make it
    // the PRIMARY (prominent) action when the MC is hurt — the "heal now" companion to the red life bar.
    if (isUnlocked(state, 'verb-cook')) {
      const row = el('div', 'labour-row');
      const cost = balance.COOK_SANSAI_COST;
      const hurt = state.character.hp < hpMax(state);
      const cook = el('button', `verb${hurt ? ' primary' : ''}`, `Cook a meal (${cost} sansai)`);
      cook.type = 'button';
      cook.title =
        'Eat to restore your body and mend your wounds — eating is the only way to heal.';
      cook.disabled = (state.resources.sansai ?? 0) < cost;
      if (cook.disabled) cook.title = `Needs ${cost} sansai — forage the satoyama to gather it.`;
      cook.addEventListener('click', () => dispatch({ type: 'cook_meal' }));
      row.append(cook);
      actions.append(row);
    }

    // ── Walk on — the current node's paths, right here on the Work tab (once the map has opened) so
    //    you can move WITHOUT a tab-switch. The Estate 地図 tab stays the fuller navigation view. ──
    if (isUnlocked(state, 'room-gate-forecourt')) {
      const strip = moveStrip(state, 'map');
      if (strip) {
        const walk = el('div', 'area-group walk-on');
        walk.append(el('h3', 'area-head', 'Walk on 道'));
        walk.append(strip);
        actions.append(walk);
      }
    }
  }

  function renderSkills(state: GameState): void {
    skillsPane.textContent = '';
    const show = activeTab === 'skills' && isUnlocked(state, 'tab-skills');
    skillsPane.hidden = !show;
    if (!show) return;
    for (const def of SKILLS) {
      const revealedByDoing = skillVisible(state, def.id);
      const revealedExplicit = isUnlocked(state, `skill-${def.id}`);
      if (!revealedByDoing && !revealedExplicit) continue;
      const prog = skillProgress(state, def.id as SkillId);
      const card = el('div', 'skill-row frame');
      const head = el('div', 'skill-head');
      head.append(el('span', 'skill-name', `${def.label} ${def.kanji}`));
      head.append(el('span', 'skill-lvl numeric', `Lv ${prog.level}`));
      card.append(head);
      card.append(el('div', 'skill-blurb', def.blurb));
      // show what the level DOES (R6: an invisible mechanic) — the labour-yield accelerator, read
      // from source of truth. Conditioning is the zero-yield gate skill (its gate shows in the move strip).
      if (def.id !== 'conditioning') {
        const yieldPct = Math.round(
          (skillYieldNum(prog.level) / balance.SKILL_YIELD_DEN - 1) * 100,
        );
        card.append(el('div', 'rung-hint', `+${yieldPct}% labour yield`));
      }
      const meter = el('div', 'meter');
      const fill = el('span');
      fill.style.width = `${Math.round((prog.into / prog.needed) * 100)}%`;
      meter.append(fill);
      card.append(meter);
      skillsPane.append(card);
    }
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

  function renderCombat(state: GameState): void {
    combatPane.textContent = '';
    const show = activeTab === 'combat' && isUnlocked(state, 'tab-combat');
    combatPane.hidden = !show;
    if (!show) return;

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

    // training — spend earned attribute points into the 5 attributes (§4.6.1)
    const c = state.character;
    const train = el('div', 'weapon-card frame');
    const th = el('div', 'skill-head');
    th.append(el('span', 'skill-name', 'Training 鍛錬'));
    th.append(
      el(
        'span',
        'skill-lvl',
        `${c.attributePoints} point${c.attributePoints === 1 ? '' : 's'} to spend`,
      ),
    );
    train.append(th);
    for (const id of balance.ATTR_IDS) {
      const meta = balance.ATTR_META[id];
      const row = el('div', 'attr-row');
      const label = el('span', 'attr-label');
      label.append(el('span', 'attr-name', `${meta.label} ${meta.kanji}`));
      label.append(el('span', 'attr-val', ` ${c.attrs[id]}`));
      label.append(el('span', 'attr-gain lock-hint', ` ${meta.gain}`));
      row.append(label);
      const plus = el('button', 'auto-toggle', '+1');
      plus.type = 'button';
      plus.disabled = c.attributePoints <= 0;
      plus.addEventListener('click', () => dispatch({ type: 'spend_attribute', attr: id }));
      row.append(plus);
      train.append(row);
    }
    combatPane.append(train);

    // equipped weapon + (from R4) durability band + repair / equip. A7 staggered reveal: the weapon
    // itself is the R3 floor; its wear-band + repair + the equip switcher wait for the R4 surfaces
    // (`readout-durability` / `panel-equipment`), so a fresh gate-watch sees the blade but not yet
    // the smithy loop.
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
        `Repair (${balance.REPAIR_WOOD_COST} wood, ${balance.REPAIR_KOKU_COST} koku)`,
      );
      rep.type = 'button';
      rep.disabled = (state.resources.wood ?? 0) < balance.REPAIR_WOOD_COST;
      rep.title = `${balance.REPAIR_WOOD_COST} wood + up to ${balance.REPAIR_KOKU_COST} koku (waived if you're short)`;
      rep.addEventListener('click', () => dispatch({ type: 'repair_weapon' }));
      wctrl.append(rep);
    }
    // weapon switcher — equip any weapon you OWN (the pole always; a crafted weapon once forged).
    // Iterates the roster order (pole · axe · yari), so it grows with the T0 weapon ladder (A3).
    // Part of the R4 Equipment beat (`panel-equipment`), so it only appears once the loop is live.
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

    // craft panel (loot→craft, D-052) — surfaces once you've stripped a material off a foe
    // (discover-by-doing). Shows the NEXT un-crafted recipe in progression order (axe → yari, A3):
    // each weapon is FOUND + MADE, never gifted; the card advances as you forge each.
    const recipe = RECIPES.find((r) => !hasFlag(state, `crafted-${r.outputWeapon}`));
    const hasMaterial = MATERIALS.some((m) => (state.resources[m.id] ?? 0) > 0);
    // A7: the loot→craft panel is part of the R4 Equipment beat (`panel-equipment`) — held back
    // one rung from combat opening, so R3 is the pure fight floor.
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
      // ── material status (the diverged surface, D-075) — A = the have/need checklist (default,
      //    ships). B/C live DEV-only behind the variant toggle (ui/dev.ts), stripped from prod. ──
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

    // stance — the active combat decision (segmented control; pips recompute live). A7: the last
    // staggered combat surface (`stance-control`), revealed at R5 — R3/R4 fight in the default
    // stance; the deliberate glass-cannon↔tank call opens once you're a seasoned hand.
    if (isUnlocked(state, 'stance-control')) {
      const stanceRow = el('div', 'stance-row');
      stanceRow.append(el('h3', undefined, 'Stance 構え'));
      for (const s of STANCE_ORDER) {
        const ui = STANCE_UI[s];
        const on = state.stance === s;
        // A2: stance is the glass-cannon↔tank axis (atk vs damage-taken). Wear is now flat, so the
        // read shown is the offense/defense trade — hurt-carries-between-fights makes it a real call.
        const mod = balance.STANCE_MODS[s];
        const atkPct = Math.round((mod.atkMult - 1) * 100);
        const takenPct = Math.round((mod.takenMult - 1) * 100);
        const sign = (n: number) => (n > 0 ? `+${n}` : `${n}`);
        const trade = `atk ${sign(atkPct)}% · taken ${sign(takenPct)}%`;
        const btn = el('button', `auto-toggle stance-btn${on ? ' on' : ''}`);
        btn.type = 'button';
        btn.setAttribute('aria-pressed', String(on));
        btn.title = ui.hint;
        btn.setAttribute('aria-label', `${ui.gloss} stance — ${trade}. ${ui.hint}`);
        btn.append(el('span', 'stance-label', `${ui.kanji} ${ui.gloss}`));
        btn.append(el('span', 'stance-wear', trade));
        btn.addEventListener('click', () => dispatch({ type: 'set_stance', stance: s }));
        stanceRow.append(btn);
      }
      combatPane.append(stanceRow);
    }

    // ── the Bestiary (A7, D-075) — the field-guide of the foes you've faced, revealed at R3. A =
    //    the field-guide card list (default, ships). B/C live DEV-only behind the variant toggle. ──
    if (isUnlocked(state, 'panel-bestiary')) {
      const bpane = el('div', 'bestiary');
      combatPane.append(bpane);
      if (!(import.meta.env.DEV && dev && dev.renderVariant('bestiary', bpane, state, dispatch))) {
        renderBestiary(bpane, state);
      }
    }

    // foes — the watch (spatial, Step 5b): only the foes on THIS node stand in the watch.
    combatPane.append(el('h3', 'foes-head', 'The watch'));
    const present = foesHere(state);
    if (present.length === 0) {
      combatPane.append(
        el(
          'p',
          'area-blurb',
          'No foe holds this ground. Use Walk on 道 (the Work tab) to reach the paddies, the satoyama, or the woodlot road.',
        ),
      );
    }
    for (const fc of present) {
      const seen = hasFlag(state, `mob-${fc.mob.id}`);
      const row = el('div', 'foe-row frame');
      const head = el('div', 'skill-head');
      head.append(
        el('span', 'skill-name', seen ? `${fc.mob.label} ${fc.mob.kanji}` : 'Unknown foe'),
      );
      // a11y (D-Q-a11y): number + word carry meaning in ink; hue lives only on the pip.
      // Scout-by-fighting fog: an un-encountered foe shows neither a precise % nor a
      // difficulty-coloured pip (the hue is info too) — only a hollow ◇ 'Unknown'.
      const wr = el('span', 'win-rate');
      if (seen) {
        const tier = fc.winRate >= 0.55 ? 'good' : fc.winRate >= 0.28 ? 'fair' : 'risky';
        const word = tier === 'good' ? 'Steady' : tier === 'fair' ? 'Even' : 'Risky';
        const pip = el('span', `pip ${tier}`, '◆');
        pip.setAttribute('aria-hidden', 'true');
        wr.append(pip, document.createTextNode(` ${pct(fc.winRate)} · ${word}`));
      } else {
        const pip = el('span', 'pip unknown', '◇');
        pip.setAttribute('aria-hidden', 'true');
        wr.append(pip, document.createTextNode(' Unknown'));
      }
      head.append(wr);
      row.append(head);
      if (seen) row.append(el('div', 'skill-blurb', fc.mob.blurb));
      const ctrl = el('div', 'labour-row');
      const fight = el('button', 'verb', 'Fight');
      fight.type = 'button';
      fight.addEventListener('click', () => dispatch({ type: 'fight', mobId: fc.mob.id as MobId }));
      ctrl.append(fight);
      // two auto-modes (batch-2 call 6): fight-to-death vs auto-flee-@20% (the safer mode breaks off
      // + stops the autopilot before you die — though a burst foe can still kill you first).
      const mob = fc.mob.id as MobId;
      const autoOn = state.autoCombat === fc.mob.id;
      const deathOn = autoOn && !state.autoCombatRetreat;
      const retreatOn = autoOn && state.autoCombatRetreat;
      // the RISK reads on the FACE of each toggle, not hover-only (the fight-to-death auto costs koku
      // on the inevitable loss; touch-legible, mirrors the stance-wear pips — ui-design §8).
      const atDeath = el(
        'button',
        `auto-toggle${deathOn ? ' on' : ''}`,
        deathOn ? '■ stop' : '▶ auto · to the end',
      );
      atDeath.type = 'button';
      atDeath.title =
        'Auto-fight to the end — HP carries; you can be beaten, and a loss costs koku.';
      atDeath.setAttribute(
        'aria-label',
        `Auto-fight the ${fc.mob.label} to the end — a loss costs koku`,
      );
      atDeath.addEventListener('click', () =>
        dispatch({ type: 'set_auto_combat', mobId: deathOn ? null : mob, retreat: false }),
      );
      const atFlee = el(
        'button',
        `auto-toggle${retreatOn ? ' on' : ''}`,
        retreatOn ? '■ stop' : '▶ auto · flee @20%',
      );
      atFlee.type = 'button';
      atFlee.title =
        'Auto-fight, but break off when HP falls below 20% (a fast foe can still kill you first).';
      atFlee.setAttribute('aria-label', `Auto-fight the ${fc.mob.label}, fleeing below 20% HP`);
      atFlee.addEventListener('click', () =>
        dispatch({ type: 'set_auto_combat', mobId: retreatOn ? null : mob, retreat: true }),
      );
      ctrl.append(atDeath, atFlee);
      row.append(ctrl);
      combatPane.append(row);
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
    koku.wrap.hidden = !isUnlocked(state, 'readout-rice');
    if (!koku.wrap.hidden) {
      const v = state.resources.koku ?? 0;
      koku.value.textContent = formatKMB(v);
      popValue(koku.value, v, prev?.resources.koku);
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
    hooks.sfx.reward(); // the koku-tally cue — a shamisen/koto pluck (T0-M1-F4)
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
    storehousePane.textContent = '';
    // the kura storehouse (batch-2 call 7) — shelter carried koku from a lost-fight penalty. Opens
    // with the estate economy; spatially gated to the kura node in Step 5.
    const show = activeTab === 'work' && isUnlocked(state, 'panel-estate');
    storehousePane.hidden = !show;
    if (!show) return;
    const carried = state.resources.koku ?? 0;
    const banked = state.banked.koku ?? 0;
    const card = el('div', 'rung-card frame');
    card.append(el('div', 'rung-now', 'The storehouse 蔵'));
    card.append(
      el(
        'div',
        'skill-blurb',
        'Stow your koku in the kura, safe from a beating on the road. What you carry, a lost fight can take; what you store, you keep.',
      ),
    );
    card.append(
      el('div', 'influence-when', `Carried ${carried} koku · stored ${banked} koku (safe)`),
    );
    // spatial (Step 5c): the storehouse IS the kura — the balance shows anywhere (your safe reserve
    // is worth seeing on the road), but you can only store/draw while standing at the grain-store.
    if (state.location === 'kura') {
      const row = el('div', 'labour-row');
      const dep = el('button', 'auto-toggle', 'Store all koku');
      dep.type = 'button';
      dep.disabled = carried <= 0;
      if (dep.disabled) dep.title = 'No carried koku to store.';
      dep.addEventListener('click', () => dispatch({ type: 'deposit', resource: 'koku' }));
      row.append(dep);
      const wd = el('button', 'auto-toggle', 'Withdraw all');
      wd.type = 'button';
      wd.disabled = banked <= 0;
      if (wd.disabled) wd.title = 'Nothing stored to withdraw.';
      wd.addEventListener('click', () => dispatch({ type: 'withdraw', resource: 'koku' }));
      row.append(wd);
      card.append(row);
    } else {
      card.append(
        el(
          'div',
          'area-blurb',
          'Use Walk on 道 (the Work tab) to head back to the kura (蔵) to store or draw koku.',
        ),
      );
    }
    storehousePane.append(card);
  }

  function renderMarket(state: GameState): void {
    marketPane.textContent = '';
    const show = activeTab === 'work' && isUnlocked(state, 'panel-estate');
    marketPane.hidden = !show;
    if (!show) return;
    const card = el('div', 'rung-card frame market-card');
    card.append(el('div', 'rung-now', 'The pedlar 市'));
    card.append(
      el(
        'div',
        'skill-blurb',
        'A pedlar passes now and then. A little of your OWN koku for the things you need — greens for the pot, wood to keep an edge. Your purse, not the house’s.',
      ),
    );
    // ── the diverged goods presentation (D-075) — A = the price-button list (default, ships).
    //    B/C live DEV-only behind the variant toggle (ui/dev.ts), stripped from prod. ──
    if (!(import.meta.env.DEV && dev && dev.renderVariant('market', card, state, dispatch))) {
      for (const item of MARKET_ITEMS) {
        const bought = state.marketBought[item.id] ?? 0;
        const capped = bought >= item.stockCap;
        const grantStr = Object.entries(item.grants)
          .map(([r, n]) => `+${n} ${r}`)
          .join(', ');
        const row = el('div', 'market-row');
        const left = el('div', 'market-item');
        left.append(el('span', 'market-name', item.label));
        left.append(
          el('span', 'market-grant lock-hint', `${grantStr}${capped ? ' · sold out' : ''}`),
        );
        // the WHEN/WHY blurb (authored in market.ts, was thrown away) — so trade isn't a bare price list.
        left.append(el('span', 'skill-blurb market-blurb', item.blurb));
        row.append(left);
        // F67/F72 — the buy control sits in its OWN in-flow cell BELOW the item copy (the row is a
        // vertical stack, styles.css), so a narrow byōbu column can never let the price button
        // float over / overlap the description text.
        const buy = el('div', 'market-buy');
        const btn = el('button', 'auto-toggle', `${item.kokuCost} koku`);
        btn.type = 'button';
        // a11y: the visible label is just the price — give the button a full accessible name so a
        // screen-reader hears WHAT it buys, not a bare "10 koku" (D-045 a11y-ink).
        btn.setAttribute(
          'aria-label',
          `Buy ${item.label} (${grantStr}) for ${item.kokuCost} koku${capped ? ' — sold out' : ''}`,
        );
        btn.disabled = !canBuy(state.resources, item, bought);
        if (capped) btn.title = "You've taken all the pedlar carries this run.";
        else if (btn.disabled && (state.banked.koku ?? 0) >= item.kokuCost)
          btn.title = 'Draw koku from the kura storehouse first';
        btn.addEventListener('click', () => dispatch({ type: 'buy_item', itemId: item.id }));
        buy.append(btn);
        row.append(buy);
        card.append(row);
      }
    }
    marketPane.append(card);
  }

  function renderMap(state: GameState): void {
    mapPane.textContent = '';
    const show = activeTab === 'map';
    mapPane.hidden = !show;
    if (!show) return;
    mapPane.append(el('h2', undefined, 'The estate 地図'));
    // ── the diverged map body (D-075) — A = the you-are-here card + "Paths lead to →" list (the
    //    self-picked default, ships). B/C live DEV-only behind the variant toggle (ui/dev.ts),
    //    stripped from prod. ──
    if (import.meta.env.DEV && dev && dev.renderVariant('map', mapPane, state, dispatch)) {
      return;
    }
    const here = getNode(state.location);
    const card = el('div', 'map-here frame');
    const h = el('div', 'rung-now');
    // strip a leading article so a label like "The grain-store (kura)" doesn't read "the the …"
    h.append(
      document.createTextNode(`You stand at the ${here.label.toLowerCase().replace(/^the /, '')} `),
    );
    if (here.kanji) {
      const k = el('span', 'house-influence-kanji');
      k.lang = 'ja';
      k.textContent = here.kanji;
      h.append(k);
    }
    card.append(h);
    card.append(el('div', 'skill-blurb', here.blurb));
    const strip = moveStrip(state, 'work'); // shared with the Work tab's "Walk on" strip
    if (strip) {
      card.append(el('div', 'lock-hint map-paths-label', 'Paths lead to:'));
      card.append(strip);
    }
    mapPane.append(card);
  }

  function renderQuests(state: GameState): void {
    questsPane.textContent = '';
    const show = activeTab === 'quests';
    questsPane.hidden = !show;
    if (!show) return;
    questsPane.append(el('h2', undefined, 'Quests 用'));
    // ── the diverged Quests body (D-075) — A = the .frame cards (default, ships). B/C live
    //    DEV-only behind the variant toggle (ui/dev.ts), stripped from prod. ──
    if (import.meta.env.DEV && dev && dev.renderVariant('quests', questsPane, state, dispatch)) {
      return;
    }
    questsPane.append(
      el(
        'div',
        'skill-blurb',
        'Goals beyond the daily grind — take one on, then earn it in the field.',
      ),
    );
    for (const q of QUESTS) {
      const done = new Set(state.quests.progress[q.id] ?? []);
      const completed = state.quests.completed.includes(q.id);
      const accepted = state.quests.accepted.includes(q.id);
      const card = el('div', `quest-card frame${completed ? ' done' : ''}`);
      const head = el('div', 'skill-head');
      head.append(el('span', 'skill-name', q.title));
      head.append(el('span', 'skill-lvl', completed ? 'Done ✓' : q.kind));
      card.append(head);
      card.append(el('div', 'skill-blurb', q.blurb));
      if (accepted || completed) {
        const stepsEl = el('div', 'quest-steps');
        for (const s of q.steps) {
          const ok = done.has(s.id);
          const row = el('div', `quest-step${ok ? ' ok' : ''}`);
          row.append(el('span', 'quest-check', ok ? '☑' : '☐'));
          row.append(el('span', undefined, s.label));
          stepsEl.append(row);
        }
        card.append(stepsEl);
        const rk = q.reward.resources?.koku;
        if (rk && !completed) card.append(el('div', 'influence-when', `Reward: ${rk} koku`));
      } else {
        // show the objectives + reward BEFORE the player commits — the offer should be legible
        // pre-accept, not blind. Mirror the accepted-branch markup with every step still ☐.
        const stepsEl = el('div', 'quest-steps');
        for (const s of q.steps) {
          const row = el('div', 'quest-step');
          row.append(el('span', 'quest-check', '☐'));
          row.append(el('span', undefined, s.label));
          stepsEl.append(row);
        }
        card.append(stepsEl);
        const rk = q.reward.resources?.koku;
        if (rk) card.append(el('div', 'influence-when', `Reward: ${rk} koku`));
        const btn = el('button', 'verb', 'Take this on');
        btn.type = 'button';
        btn.addEventListener('click', () => dispatch({ type: 'accept_quest', questId: q.id }));
        card.append(btn);
      }
      questsPane.append(card);
    }
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
