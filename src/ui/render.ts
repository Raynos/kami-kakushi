// The thin DOM renderer (PRD §6.9): a near-pure function of GameState that
// reconciles the DOM and dispatches intents — ZERO game logic, never mutates state.
// The woodblock shell is built once; the event log reconciles incrementally (new
// lines ink in; loaded lines render statically — no re-spam). The rest of the UI is
// cheap enough to rebuild each render.

import type { GameState, Intent, LogEntry, LogChannel, Season, SkillId } from '../core';
import {
  availableActions,
  availableLabours,
  isUnlocked,
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
type Tab = 'work' | 'skills';

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

export function mount(
  root: HTMLElement,
  dispatch: Dispatch,
): (state: GameState, prev: GameState | null) => void {
  root.textContent = '';
  root.removeAttribute('aria-busy');

  let activeTab: Tab = 'work';
  let lastState: GameState | null = null;

  const shell = el('div', 'shell paper');

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
  work.append(workHead, ladder, actions, skillsPane);

  workspace.append(logSection, work);
  shell.append(header, nav, workspace);
  root.append(shell);

  let firstRender = true;
  let lastKey = -1;

  function setTab(tab: Tab): void {
    activeTab = tab;
    if (lastState) render(lastState, null);
  }

  function renderNav(state: GameState): void {
    const hasSkills = isUnlocked(state, 'tab-skills');
    nav.hidden = !hasSkills;
    if (!hasSkills) return;
    nav.textContent = '';
    for (const tab of ['work', 'skills'] as Tab[]) {
      const btn = el(
        'button',
        `nav-tab${activeTab === tab ? ' active' : ''}`,
        tab === 'work' ? 'Work' : 'Skills 技',
      );
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

  function render(state: GameState, _prev: GameState | null): void {
    lastState = state;
    renderVitals(state);
    renderNav(state);
    renderLog(state);
    workHead.hidden = activeTab !== 'work';
    renderLadder(state);
    renderActions(state);
    renderSkills(state);
    firstRender = false;
  }

  return render;
}
