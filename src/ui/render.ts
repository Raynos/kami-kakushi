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
} from '../core';
import {
  availableActions,
  availableLabours,
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
} from '../core';
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
  milestone: '🔴',
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
  card.append(
    el(
      'p',
      'modal-sub',
      'A grounded, story-driven incremental RPG in mid-Edo rural Japan — rise through a declining samurai house, one earned rung at a time.',
    ),
  );
  card.append(brushRule());

  // ── comfort / a11y ──
  card.append(el('h3', undefined, 'Comfort'));
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
  card.append(comfort);
  card.append(brushRule());

  // ── save ──
  card.append(el('h3', undefined, 'Your save'));
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
  const saveRow = el('div', 'settings-row');
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
  saveRow.append(exp, imp, ng);
  card.append(exportArea, importArea, saveRow);
  card.append(brushRule());

  // ── about / credits / license / content ──
  card.append(
    el(
      'p',
      'modal-meta',
      `Built agentically with Claude Code · ${__VERSION__} · build ${__BUILD_SHA__} · ${__BUILD_DATE__}`,
    ),
  );
  card.append(el('p', 'modal-meta', 'Code: MIT. Game content: all rights reserved.'));
  card.append(
    el('p', 'modal-meta', 'Content notes: mild thematic — child-disappearance, drowning, debt.'),
  );

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
  titlebar.append(title, settingsBtn);
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

  const logSection = el('section', 'log');
  logSection.setAttribute('aria-live', 'polite');
  logSection.setAttribute('aria-label', 'Story log');
  logSection.append(el('h2', undefined, 'The house remembers'));
  const logLines = el('div', 'log-lines');
  logSection.append(logLines);

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
  work.append(
    workHead,
    actions,
    ladder,
    estatePane,
    marketPane,
    storehousePane,
    influence,
    skillsPane,
    combatPane,
    questsPane,
    mapPane,
  );

  workspace.append(logSection, work);
  shell.append(header, nav, workspace, settings.modal);

  // ── pre-awake cold-open title card (sibling to the shell; shown until 'awake') ──
  const coldOpen = el('div', 'coldopen');
  const coFrame = el('div', 'frame');
  const coTitle = el('h1');
  coTitle.lang = 'ja';
  coTitle.textContent = COLD_OPEN_TITLE;
  const coRoman = el('p', 'coldopen-roman', COLD_OPEN_ROMAN);
  const coLede = el('p', undefined, COLD_OPEN_LEDE);
  const coVerb = el('button', 'verb primary', META_LABELS.open_eyes);
  coVerb.type = 'button';
  coVerb.addEventListener('click', () => dispatch({ type: 'open_eyes' }));
  coFrame.append(coTitle, coRoman, coLede, coVerb);
  coldOpen.append(coFrame);

  root.append(coldOpen, shell);

  let firstRender = true;
  let lastKey = -1;
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

  function setTab(tab: Tab): void {
    activeTab = tab;
    if (lastState) render(lastState, null);
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
    ladder.hidden = activeTab !== 'work';
    // show the meter during R0 too (once you've raked) — the ladder used to hide until R1, leaving the
    // whole cold-open with no visible progress toward the first promotion (fun-factor "a next goal").
    if (ladder.hidden || !(isUnlocked(state, 'panel-rung-ladder') || hasFlag(state, 'raked')))
      return;
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
    meterFill.style.width = `${gated ? 92 : Math.round((prog.into / prog.needed) * 100)}%`;
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

  function renderActions(state: GameState): void {
    actions.textContent = '';
    actions.hidden = activeTab !== 'work';
    if (activeTab !== 'work') return;

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
      const row = el('div', 'labour-row');
      row.append(
        el('span', 'skill-name', `${meta.label} ${meta.kanji}  ${c.attrs[id]}  (${meta.gain})`),
      );
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
  function renderLineContent(line: HTMLElement, entry: LogEntry): void {
    line.textContent = '';
    const bullet = CHANNEL_BULLET[entry.channel];
    if (bullet) {
      const b = el('span', 'bullet emoji', bullet); // .emoji ties the bullet to the palette
      b.setAttribute('aria-hidden', 'true');
      line.append(b);
    }
    line.append(document.createTextNode(formatLogText(entry)));
  }
  function buildLogLine(entry: LogEntry, animate: boolean): HTMLElement {
    const line = el('div', `log-line ${entry.channel}`);
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
  function appendLine(entry: LogEntry, animate: boolean): void {
    logLines.append(buildLogLine(entry, animate)); // newest at the BOTTOM (reads as a story)
    while (logLines.childElementCount > LOG_DOM_MAX) logLines.firstElementChild?.remove();
    logSection.scrollTop = logSection.scrollHeight; // auto-scroll to follow the newest line
  }
  function pumpReveal(): void {
    if (revealTimer !== undefined) return;
    const entry = revealQueue.shift();
    if (!entry) return;
    appendLine(entry, true);
    revealTimer = window.setTimeout(() => {
      revealTimer = undefined;
      pumpReveal();
    }, LOG_STAGGER_MS);
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
      if (revealTimer !== undefined) {
        window.clearTimeout(revealTimer);
        revealTimer = undefined;
      }
    }
    lastSeq = state.log.seq;
    if (entries.length === 0) return;
    const last = entries[entries.length - 1]!;
    const fresh: LogEntry[] = entries.filter((e) => e.key > lastKey);
    if (fresh.length === 0) {
      // in-place ×N growth: the last entry kept its key but bumped its count (a coalesce).
      // Only paint while the reveal cascade is idle (it self-heals on the next render).
      if (
        last.key === lastPaintedKey &&
        (last.count ?? 1) !== lastPaintedCount &&
        revealQueue.length === 0 &&
        revealTimer === undefined
      ) {
        const lineEl = logLines.lastElementChild as HTMLElement | null;
        if (lineEl) {
          renderLineContent(lineEl, last);
          flashTally(lineEl);
          logSection.scrollTop = logSection.scrollHeight;
        }
        lastPaintedCount = last.count ?? 1;
      }
      return;
    }
    for (const e of fresh) lastKey = Math.max(lastKey, e.key);

    // on load / reset / reduced-motion / a single new line → append at once (no re-spam).
    if (firstRender || didReset || reduceMotion() || fresh.length === 1) {
      for (const e of fresh) appendLine(e, !firstRender && !reduceMotion());
    } else {
      // a batch (the cold open, a rank-up reveal) → cascade the lines in one-by-one.
      revealQueue.push(...fresh);
      if (revealQueue.length > 12) {
        // queue backed up during fast streaming — flush to catch up.
        if (revealTimer !== undefined) {
          window.clearTimeout(revealTimer);
          revealTimer = undefined;
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
    card.append(el('div', 'rung-now', 'The travelling market 市'));
    card.append(
      el(
        'div',
        'skill-blurb',
        'A pedlar passes now and then — a little koku for what the estate is short of. A minor trade, no more.',
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
        row.append(btn);
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

  function render(state: GameState, prev: GameState | null): void {
    lastState = state;
    // pre-awake: show only the cold-open card; the shell (and its log) inks in on waking.
    if (!hasFlag(state, 'awake')) {
      coldOpen.hidden = false;
      shell.hidden = true;
      firstRender = false; // so the post-wake log cascades rather than dumping statically
      return;
    }
    coldOpen.hidden = true;
    shell.hidden = false;
    renderVitals(state, prev);
    renderNav(state);
    renderLog(state);
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
    // the signature beats: a rung promotion presses the house seal (ui-design §6.2); a TIER
    // ascension lands the bigger ceremony (D-062). Tier change wins (don't double-fire).
    if (prev && prev.tier !== state.tier && !firstRender) showAscension(state);
    else if (prev && prev.rung !== state.rung && !firstRender) showRankUp(state);
    firstRender = false;
  }

  return render;
}
