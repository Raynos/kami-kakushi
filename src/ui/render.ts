// The thin DOM renderer (PRD §6.9): a near-pure function of GameState that
// reconciles the DOM and dispatches intents — ZERO game logic, never mutates state.
// The woodblock shell is built once; the event log reconciles incrementally (new
// lines ink in; loaded lines render statically — no re-spam). The rest of the UI is
// cheap enough to rebuild each render.

import type { GameState, Intent, LogEntry, LogChannel, Season, SkillId, MobId } from '../core';
import {
  availableActions,
  availableLabours,
  isUnlocked,
  hasFlag,
  formatKMB,
  satietyMax,
  staminaRate,
  season,
  year,
  currentRank,
  rungProgress,
  nextRankId,
  getRank,
  SKILLS,
  skillVisible,
  skillProgress,
  foeForecasts,
  combatXpProgress,
  durabilityBand,
  getWeapon,
} from '../core';

const META_LABELS: Record<'open_eyes' | 'rake_rice' | 'rest', string> = {
  open_eyes: 'Open your eyes',
  rake_rice: 'Rake the spilled rice',
  rest: 'Rest a moment',
};

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
type Tab = 'work' | 'skills' | 'combat';

export interface AppHooks {
  exportSave: () => string;
  importSave: (b64: string) => void;
  newGame: () => void;
  setReducedMotion: (on: boolean) => void;
  setTextScale: (scale: number) => void;
  togglePause: () => boolean;
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function el<K extends keyof HTMLElementTagNameMap>(
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

  const hide = (): void => {
    scrim.hidden = true;
  };
  const close = el('button', 'modal-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close');
  close.addEventListener('click', hide);
  scrim.addEventListener('click', (e) => {
    if (e.target === scrim) hide();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
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
  comfort.append(rm, ts, pause);
  card.append(comfort);
  card.append(brushRule());

  // ── save ──
  card.append(el('h3', undefined, 'Your save'));
  const exportArea = el('textarea', 'save-area');
  exportArea.readOnly = true;
  exportArea.rows = 2;
  exportArea.placeholder = 'Your exported save appears here — copy it somewhere safe.';
  const importArea = el('textarea', 'save-area');
  importArea.rows = 2;
  importArea.placeholder = 'Paste a save here, then Import.';
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
    if (v) hooks.importSave(v);
  });
  const ng = el('button', 'auto-toggle', 'New game');
  ng.type = 'button';
  ng.addEventListener('click', () => {
    if (confirm('Start a new game? Your current run will be overwritten.')) hooks.newGame();
  });
  saveRow.append(exp, imp, ng);
  card.append(exportArea, importArea, saveRow);
  card.append(brushRule());

  // ── about / credits / license / content ──
  card.append(
    el(
      'p',
      'modal-meta',
      `Built agentically with Claude Code · build ${__BUILD_SHA__} · ${__BUILD_DATE__}`,
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
      scrim.hidden = false;
      close.focus();
    },
  };
}

export function mount(
  root: HTMLElement,
  dispatch: Dispatch,
  hooks: AppHooks,
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
  const settingsBtn = el('button', 'settings-btn', '⚙ Settings');
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
  const wood = vital('wood', 'wood');
  const sansai = vital('sansai', 'sansai');
  header.append(koku.wrap, clock, stamina, wood.wrap, sansai.wrap);

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
  const actions = el('div', 'actions');
  const skillsPane = el('div', 'skills-pane');
  const combatPane = el('div', 'combat-pane');
  work.append(workHead, ladder, actions, skillsPane, combatPane);

  workspace.append(logSection, work);
  shell.append(header, nav, workspace, settings.modal);
  root.append(shell);

  let firstRender = true;
  let lastKey = -1;

  function setTab(tab: Tab): void {
    activeTab = tab;
    if (lastState) render(lastState, null);
  }

  const TAB_LABEL: Record<Tab, string> = { work: 'Work', skills: 'Skills 技', combat: 'Combat 武' };
  function renderNav(state: GameState): void {
    const tabs: Tab[] = ['work'];
    if (isUnlocked(state, 'tab-skills')) tabs.push('skills');
    if (isUnlocked(state, 'tab-combat')) tabs.push('combat');
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
    if (ladder.hidden || !isUnlocked(state, 'panel-rung-ladder')) return;
    const rank = currentRank(state);
    const prog = rungProgress(state);
    const card = el('div', 'rung-card frame');
    card.append(el('div', 'rung-now', `${rank.title} · ${rank.kanji}`));
    const meter = el('div', 'meter');
    const meterFill = el('span');
    meterFill.style.width = `${Math.round((prog.into / prog.needed) * 100)}%`;
    meter.append(meterFill);
    card.append(meter);
    card.append(
      el(
        'div',
        'rung-hint',
        prog.ready ? 'Ready to advance.' : `Estate service · ${prog.into}/${prog.needed}`,
      ),
    );
    const nid = nextRankId(rank.id);
    if (nid) {
      const nextRank = getRank(nid);
      card.append(el('div', 'rung-next', `Next: ${nextRank.title} ${nextRank.kanji}`));
    }
    ladder.append(card);
  }

  function renderActions(state: GameState): void {
    actions.textContent = '';
    actions.hidden = activeTab !== 'work';
    if (activeTab !== 'work') return;

    // meta verbs (rake / rest)
    for (const a of availableActions(state)) {
      const btn = el('button', 'verb', META_LABELS[a]);
      if (a === 'open_eyes') btn.classList.add('primary');
      btn.type = 'button';
      btn.addEventListener('click', () => dispatch({ type: a } as Intent));
      actions.append(btn);
    }

    // the humbling first fight — a charged one-time beat (the wolf at the stores)
    if (isUnlocked(state, 'verb-face-wolf') && !hasFlag(state, 'first-fight-survived')) {
      const wolf = el('button', 'verb primary', '⚔️ Face the wolf at the grain store');
      wolf.type = 'button';
      wolf.addEventListener('click', () => dispatch({ type: 'face_wolf' }));
      actions.append(wolf);
    }

    // labour activities (each: do-once + an auto-repeat toggle)
    for (const opt of availableLabours(state)) {
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
        const toggle = el('button', `auto-toggle${auto ? ' on' : ''}`, auto ? '■ stop' : '▶ auto');
        toggle.type = 'button';
        toggle.setAttribute('aria-pressed', String(auto));
        toggle.addEventListener('click', () =>
          dispatch({ type: 'set_auto', activityId: auto ? null : opt.activity.id }),
        );
        row.append(toggle);
      } else if (opt.reason) {
        row.append(el('span', 'lock-hint', opt.reason));
      }
      actions.append(row);
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
      const meter = el('div', 'meter');
      const fill = el('span');
      fill.style.width = `${Math.round((prog.into / prog.needed) * 100)}%`;
      meter.append(fill);
      card.append(meter);
      skillsPane.append(card);
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
    lvl.append(el('div', 'rung-now', `Combat rank ${cx.level} · 武`));
    const lm = el('div', 'meter');
    const lf = el('span');
    lf.style.width = pct(cx.into / cx.needed);
    lm.append(lf);
    lvl.append(lm);
    lvl.append(el('div', 'rung-hint', `Combat XP ${cx.into}/${cx.needed}`));
    combatPane.append(lvl);

    // equipped weapon + durability band + repair / equip
    const weapon = getWeapon(state.equippedWeapon);
    const band = durabilityBand(state.weaponDurability, weapon.durabilityMax);
    const wc = el('div', 'weapon-card frame');
    const wh = el('div', 'skill-head');
    wh.append(el('span', 'skill-name', `${weapon.label} ${weapon.kanji}`));
    wh.append(el('span', 'skill-lvl', band.name));
    wc.append(wh);
    wc.append(
      el(
        'div',
        'skill-blurb',
        `${weapon.archetype} · durability ${state.weaponDurability}/${weapon.durabilityMax}`,
      ),
    );
    const wctrl = el('div', 'labour-row');
    if (isUnlocked(state, 'verb-repair')) {
      const rep = el('button', 'auto-toggle', 'Repair (5 wood)');
      rep.type = 'button';
      rep.disabled = (state.resources.wood ?? 0) < 5;
      rep.addEventListener('click', () => dispatch({ type: 'repair_weapon' }));
      wctrl.append(rep);
    }
    if (isUnlocked(state, 'verb-equip-axe') && state.equippedWeapon !== 'wood_axe') {
      const eq = el('button', 'auto-toggle', 'Take up the axe 斧');
      eq.type = 'button';
      eq.addEventListener('click', () => dispatch({ type: 'equip_weapon', weaponId: 'wood_axe' }));
      wctrl.append(eq);
    } else if (state.equippedWeapon === 'wood_axe') {
      const eq = el('button', 'auto-toggle', 'Carrying-pole 天秤棒');
      eq.type = 'button';
      eq.addEventListener('click', () =>
        dispatch({ type: 'equip_weapon', weaponId: 'carrying_pole' }),
      );
      wctrl.append(eq);
    }
    if (wctrl.childElementCount > 0) wc.append(wctrl);
    combatPane.append(wc);

    // foes — the watch
    combatPane.append(el('h3', 'foes-head', 'The watch'));
    for (const fc of foeForecasts(state)) {
      const seen = hasFlag(state, `mob-${fc.mob.id}`);
      const row = el('div', 'foe-row frame');
      const head = el('div', 'skill-head');
      head.append(
        el('span', 'skill-name', seen ? `${fc.mob.label} ${fc.mob.kanji}` : 'Unknown foe'),
      );
      // a11y (D-Q-a11y): number + word carry meaning in ink; hue lives only on the pip.
      const tier = fc.winRate >= 0.55 ? 'good' : fc.winRate >= 0.28 ? 'fair' : 'risky';
      const word = tier === 'good' ? 'Steady' : tier === 'fair' ? 'Even' : 'Risky';
      const wr = el('span', 'win-rate');
      const pip = el('span', `pip ${tier}`, '◆');
      pip.setAttribute('aria-hidden', 'true');
      wr.append(pip, document.createTextNode(` ${pct(fc.winRate)} · ${word}`));
      head.append(wr);
      row.append(head);
      if (seen) row.append(el('div', 'skill-blurb', fc.mob.blurb));
      const ctrl = el('div', 'labour-row');
      const fight = el('button', 'verb', 'Fight');
      fight.type = 'button';
      fight.addEventListener('click', () => dispatch({ type: 'fight', mobId: fc.mob.id as MobId }));
      ctrl.append(fight);
      const auto = state.autoCombat === fc.mob.id;
      const at = el('button', `auto-toggle${auto ? ' on' : ''}`, auto ? '■ stop' : '▶ auto');
      at.type = 'button';
      at.addEventListener('click', () =>
        dispatch({ type: 'set_auto_combat', mobId: auto ? null : (fc.mob.id as MobId) }),
      );
      ctrl.append(at);
      row.append(ctrl);
      combatPane.append(row);
    }
  }

  function renderVitals(state: GameState): void {
    koku.wrap.hidden = !isUnlocked(state, 'readout-rice');
    if (!koku.wrap.hidden) koku.value.textContent = formatKMB(state.resources.koku ?? 0);

    clock.hidden = !isUnlocked(state, 'readout-clock');
    if (!clock.hidden) {
      const s = SEASON_TAG[season(state)];
      clockTag.lang = 'ja';
      clockTag.textContent = `${s.emoji} ${s.kanji} ${s.name}`;
      clockDay.textContent = `Year ${year(state)} · day ${state.clock.day + 1}`;
    }

    stamina.hidden = !isUnlocked(state, 'readout-stamina');
    if (!stamina.hidden) {
      const frac = state.character.satiety / satietyMax(state);
      staminaFill.style.width = `${Math.round(frac * 100)}%`;
      staminaBar.classList.toggle('low', staminaRate(state) < 0.99);
    }

    wood.wrap.hidden = !isUnlocked(state, 'row-wood');
    if (!wood.wrap.hidden) wood.value.textContent = formatKMB(state.resources.wood ?? 0);
    sansai.wrap.hidden = !isUnlocked(state, 'row-sansai');
    if (!sansai.wrap.hidden) sansai.value.textContent = formatKMB(state.resources.sansai ?? 0);
    void RESOURCE_LABEL;
  }

  function renderLog(state: GameState): void {
    const entries = state.log.entries;
    const fresh: LogEntry[] = entries.filter((e) => e.key > lastKey);
    for (const entry of fresh) {
      const line = el('div', `log-line ${entry.channel}`);
      const bullet = CHANNEL_BULLET[entry.channel];
      if (bullet) {
        const b = el('span', 'bullet', bullet);
        b.setAttribute('aria-hidden', 'true');
        line.append(b);
      }
      line.append(document.createTextNode(entry.text));
      if (!firstRender) line.classList.add('reveal');
      logLines.prepend(line);
      lastKey = Math.max(lastKey, entry.key);
    }
    while (logLines.childElementCount > entries.length) {
      logLines.lastElementChild?.remove();
    }
  }

  function showRankUp(state: GameState): void {
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

  function render(state: GameState, prev: GameState | null): void {
    lastState = state;
    renderVitals(state);
    renderNav(state);
    renderLog(state);
    workHead.hidden = activeTab !== 'work';
    renderLadder(state);
    renderActions(state);
    renderSkills(state);
    renderCombat(state);
    // the signature beat: a promotion presses the house seal (ui-design §6.2)
    if (prev && prev.rung !== state.rung && !firstRender) showRankUp(state);
    firstRender = false;
  }

  return render;
}
