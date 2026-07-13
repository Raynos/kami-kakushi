// The QUESTS surface (split out of render.ts, 2026-07-13 render-split): the ADR-119
// dedicated Quests tab (用). The default (A) card list ships from here; the diverged B/C
// alternates stay DEV-only in ui/dev/variant-renderers.ts behind `dev.renderVariant`.
import { formatCoin, isUnlocked, QUESTS, type GameState, type Intent } from '../../core';
import { el, QUESTS_BLURB } from '../render';
import { reconcileList, setText, setClass, toggle } from '../reconcile';
import type { DevApi } from '../dev';

type Dispatch = (intent: Intent) => void;

export function createQuestsView(ctx: {
  pane: HTMLElement;
  dispatch: Dispatch;
  dev: DevApi | undefined;
  activeTab(): string;
}): { renderQuests(state: GameState): void } {
  const { pane: questsPane, dispatch, dev } = ctx;

  let questsRefs: { list: HTMLElement } | null = null;

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
    // ADR-119 (supersedes ADR-112 §8.1, reinstates ADR-037) — Quests regains its OWN dedicated tab, revealed
    // at R5 (tab-quests) as its own quest-log beat. It's no longer a Character section, so it self-gates
    // to the Quests tab and hides everywhere else (no ghost slice).
    const show = ctx.activeTab() === 'quests' && isUnlocked(state, 'tab-quests');
    toggle(questsPane, show);
    if (!show) return;
    // ── the diverged Quests body (ADR-075) — A = the .frame cards (default, ships). B/C live DEV-only
    //    behind the variant toggle (ui/dev.ts). The DEV branch folds to dead code in prod
    //    (tree-shaken) and `dev` is undefined in prod AND tests, so only a live DEV session takes it;
    //    prod/tests use the incremental path below (FB-81, zero idle churn). ──
    if (__DEV_TOOLS__ && dev) {
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

  return { renderQuests };
}
