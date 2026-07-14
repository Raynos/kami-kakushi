// @vitest-environment jsdom
// @slow — jsdom render suite (split out of render.test.ts, 2026-07-13 render-split);
// runs at push/CI, not the per-commit vitest lane (verify budget, ADR-072/ADR-176).
import { satietyMax } from '../../core';
import { describe, it, expect, beforeEach } from 'vitest';
import { mount, TYPE_CADENCE_MS } from '../render';
import {
  createInitialState,
  balance,
  getDialogue,
  COLD_OPEN_DIALOGUE_ID,
  RAKE_TEACH_LINE_IDS,
  rakeTeachPending,
  RAKE_TEACH_COOLDOWN_MS,
  OUT_OF_STRENGTH_REASON,
  type GameState,
  rungRequirements,
  factsForSurfaces,
} from '../../core';
import { RAKE_DONE_REASON } from '../../core/content/coldOpen';
import { __setStoryOverlay } from '../../core/content/story-overlay';

import { noopHooks } from './test-utils';

// ── ADR-119 — the seven-tab reveal CADENCE (Work R0 · Map/Estate R1 · Character R2 · Combat/Inventory
//    R3 · Quests R5). These assert the NAV chips that light at each beat, so a mis-gated tab (e.g. the
//    old Inventory-at-R1 triple-reveal, or a Quests-at-R3 batch) flips them RED. ──
describe('ADR-184 — a rung can always REACH the labour it demands (the R1 strand)', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    window.matchMedia = (q: string): MediaQueryList =>
      ({
        matches: false,
        media: q,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
    root = document.createElement('div');
    document.body.append(root);
  });

  it('the Map tab exists the moment a SECOND zone does — the only way to walk anywhere', () => {
    // The live-playtest bug, pinned. R1 opens exactly one zone (the paddy) and R1→R2 is 30 farm
    // acts sited in it; the Map is nav's sole home (FB-107), so if it does not light at R1 the
    // player is stranded in the forecourt with a requirement they cannot reach. Derived, not
    // rung-keyed: one zone ⇒ nowhere to go ⇒ no map; two ⇒ the map.
    const base = createInitialState(1);
    const render = mount(root, () => {}, noopHooks());
    const labels = (): string[] =>
      [...root.querySelectorAll<HTMLButtonElement>('.nav-tab')].map(
        (b) => b.textContent ?? '',
      );

    // the cold open: the forecourt alone — there is only one place to be, so no map.
    render({ ...base, flags: { ...base.flags, awake: true } }, null);
    expect(labels().some((l) => l.includes('地図'))).toBe(false);

    // R1: the paddy joins the forecourt — somewhere to go, so the map opens.
    render(
      {
        ...base,
        flags: {
          ...base.flags,
          awake: true,
          ...factsForSurfaces('room-paddies'),
        },
      },
      null,
    );
    expect(
      labels().some((l) => l.includes('地図')),
      'the R1 day-hand must be able to walk',
    ).toBe(true);
  });
});

// ── FB-224 — the cold-open rake teach cooldown: while Genemon's three raked-gated teach
//    lines land one-per-rake, the rake press cools down long enough for the arriving line
//    to finish typing. The bound derives from the SAME registry + cadence the writer uses
//    (ADR-086), so a longer authored line or an id rename goes RED here.
describe('F224 — rake teach cooldown covers its own text', () => {
  it('F224 — every teach id exists and the cooldown covers the LONGEST line at cadence', () => {
    const def = getDialogue(COLD_OPEN_DIALOGUE_ID);
    const teach = RAKE_TEACH_LINE_IDS.map((id) =>
      def.lines.find((l) => l.id === id),
    );
    teach.forEach((l) => expect(l).toBeDefined()); // a dialogue.md rename REDs here
    const longest = Math.max(...teach.map((l) => l!.text.length));
    expect(longest).toBeGreaterThan(0);
    expect(RAKE_TEACH_COOLDOWN_MS).toBeGreaterThanOrEqual(
      longest * TYPE_CADENCE_MS,
    );
  });

  it('F224 — rakeTeachPending stays true until ALL three lines are delivered', () => {
    expect(rakeTeachPending([])).toBe(true);
    expect(rakeTeachPending(RAKE_TEACH_LINE_IDS.slice(0, 2))).toBe(true);
    expect(rakeTeachPending([...RAKE_TEACH_LINE_IDS])).toBe(false);
  });
});

// ── FB-358 (inbox drain 2026-07-10) — a state swap that COLLAPSES the tab set (the DEV
//    "NG (post open)" fixture load: a deep-R1 run → a fresh R0 state) must not leave the
//    old tab's panel on screen. renderNav's <2-tabs early return used to skip the
//    activeTab-not-in-list fallback, so activeTab stayed 'map' and the map pane kept
//    rendering over an R0 state (no map unlock). RED against that order.
// ── FB-367/FB-368 (inbox drain 2026-07-10) — the rake row speaks the labour-row idioms
//    (patchLabourRow / ADR-148): a PERMANENTLY exhausted rake hides its auto-toggle for
//    good (a "waiting" idle would lie — the spill never refills), a merely out-of-strength
//    rake keeps an ARMED auto visible as "⏸ waiting", and the refusal reason reads inline
//    via the lock-hint — off the SAME predicates the button title uses (AC-6). Fixtures
//    derive from balance.RAKE_CAP / SATIETY_PER_ACT (source of truth), never typed counts.
describe('FB-367/FB-368 — rake row: dead auto hides, lock-hint reads the why', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    window.matchMedia = (q: string): MediaQueryList =>
      ({
        matches: false,
        media: q,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
    root = document.createElement('div');
    document.body.append(root);
  });

  // `satiety: 'full'` = topped up (derived via satietyMax); `'spent'` = one below the act
  // cost (derived from balance.SATIETY_PER_ACT — the same constant canAffordAct gates on).
  function rakeState(
    satiety: 'full' | 'spent',
    over: Partial<GameState> = {},
  ): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      flags: { ...base.flags, awake: true },
      character: {
        ...base.character,
        satiety:
          satiety === 'full' ? satietyMax(base) : balance.SATIETY_PER_ACT - 1,
      },
      ...over,
    };
  }
  function rakeRow(): HTMLElement {
    const btn = [
      ...root.querySelectorAll<HTMLButtonElement>('.actions .verb'),
    ].find((b) => (b.textContent ?? '').includes('Rake the spilled rice'))!;
    expect(btn).toBeDefined();
    return btn.closest('.labour-row') as HTMLElement;
  }

  it('exhausted spill — auto-toggle hides even while armed; lock-hint reads the done line', () => {
    const render = mount(root, () => {}, noopHooks());
    // affordable (full body) — exhaustion is the sole gate. Rake progress high enough that
    // the auto-toggle HAD been revealed (derived from the R0 requirement, like the % bar) —
    // otherwise "hidden" could never have gone RED here.
    const base = rakeState('full', {
      rakesDone: balance.RAKE_CAP,
      autoRake: true,
    });
    const rakeReq = rungRequirements(base.rung).find(
      (r) => r.type === 'count' && r.token === 'act:rake_rice',
    )!;
    expect(rakeReq).toBeDefined();
    const s: GameState = {
      ...base,
      rungReqs: { [rakeReq.id]: balance.RAKE_CAP },
    };
    render(s, null);
    const row = rakeRow();
    expect(row.querySelector<HTMLButtonElement>('.verb')!.disabled).toBe(true);
    expect(row.querySelector<HTMLButtonElement>('.auto-toggle')!.hidden).toBe(
      true,
    ); // no dead idle
    const lock = row.querySelector<HTMLElement>('.lock-hint')!;
    expect(lock.hidden).toBe(false);
    expect(lock.textContent).toBe(RAKE_DONE_REASON);
  });

  it('out of strength, armed — auto idles visibly as waiting; lock-hint reads the rest line', () => {
    const render = mount(root, () => {}, noopHooks());
    const s = rakeState('spent', { rakesDone: 0, autoRake: true }); // below the act cost
    render(s, null);
    const row = rakeRow();
    const auto = row.querySelector<HTMLButtonElement>('.auto-toggle')!;
    expect(auto.hidden).toBe(false); // ADR-148 — an armed auto never vanishes with its activity
    expect(auto.classList.contains('waiting')).toBe(true);
    expect(auto.textContent).toBe('⏸ waiting');
    const lock = row.querySelector<HTMLElement>('.lock-hint')!;
    expect(lock.hidden).toBe(false);
    expect(lock.textContent).toBe(OUT_OF_STRENGTH_REASON);
  });

  it('out of strength, unarmed — auto stays hidden; recovering strength clears the hint', () => {
    const render = mount(root, () => {}, noopHooks());
    const weary = rakeState('spent', { rakesDone: 0, autoRake: false });
    render(weary, null);
    const row = rakeRow();
    expect(row.querySelector<HTMLButtonElement>('.auto-toggle')!.hidden).toBe(
      true,
    );
    expect(row.querySelector<HTMLElement>('.lock-hint')!.hidden).toBe(false);
    // rested again → the hint clears and the verb re-arms
    const rested = rakeState('full', { rakesDone: 0, autoRake: false });
    render(rested, weary);
    expect(row.querySelector<HTMLButtonElement>('.verb')!.disabled).toBe(false);
    expect(row.querySelector<HTMLElement>('.lock-hint')!.hidden).toBe(true);
  });

  // The human's report (2026-07-13): "I press auto and it doesn't start raking — it just toggles
  // the button auto→stop and back", and a REFRESH fixed it. Pause is shell state (never saved), it
  // silences the auto loop and NOTHING else — a manual rake still resolves — so a paused game was
  // invisible everywhere except on the auto buttons, which went on reading a confident "■ stop"
  // while nothing happened. Now the button says which of the two it is. RED against the old build:
  // it painted '■ stop' regardless of pause.
  it('paused game, armed auto — the button says PAUSED, not a lying "■ stop"', () => {
    const paused = { ...noopHooks(), isPaused: () => true };
    const render = mount(root, () => {}, paused);
    // full body + spill remaining: the ONLY reason this auto is standing still is the pause.
    const s = rakeState('full', { rakesDone: 1, autoRake: true });
    render(s, null);
    const auto = rakeRow().querySelector<HTMLButtonElement>('.auto-toggle')!;
    expect(auto.hidden).toBe(false);
    expect(auto.textContent).toBe('⏸ paused');
    expect(auto.classList.contains('waiting')).toBe(true);
    expect(auto.title).toMatch(/paused/i); // …and the hover says where to un-pause it
  });

  it('running game, armed auto — still reads "■ stop" (the paused read never cries wolf)', () => {
    const render = mount(root, () => {}, noopHooks()); // isPaused: false
    const s = rakeState('full', { rakesDone: 1, autoRake: true });
    render(s, null);
    const auto = rakeRow().querySelector<HTMLButtonElement>('.auto-toggle')!;
    expect(auto.textContent).toBe('■ stop');
    expect(auto.classList.contains('waiting')).toBe(false);
    expect(auto.hasAttribute('title')).toBe(false);
  });
});

// ── HD-41 — the rung reward reads as EARNED (the human's live pick, 2026-07-13):
//    the ruled entry ships in both tabs, Story keeps the overheard flavor prose, PROGRESS
//    states the work that was finished (`objective:`), and the meter's flash is rationed to
//    an actual completion. Both assertions go RED against the pre-pick build, which showed
//    the story prose in Progress and pulsed the meter on every act. ──
