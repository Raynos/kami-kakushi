// @vitest-environment jsdom
// @slow — jsdom render suite (split out of render.test.ts, 2026-07-13 render-split);
// runs at push/CI, not the per-commit vitest lane (verify budget, ADR-072/ADR-176).
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  mount,
  formatLogText,
  devRederivedEntry,
  NOW_TTL_MS,
  NOW_KEEP_LAST,
} from '../render';
import {
  LOG_SCALE_MIN,
  LOG_SCALE_MAX,
  LOG_SCALE_STEP,
  LOG_SCALE_DEFAULT,
} from '../ui-prefs';
import {
  createInitialState,
  reduce,
  getDialogue,
  COLD_OPEN_DIALOGUE_ID,
  type GameState,
  type LogEntry,
  type RequirementDef,
  rungRequirements,
  rungProgress,
} from '../../core';
import { __setStoryOverlay } from '../../core/content/story-overlay';

import { entry, SOAN, SOAN_IDX, noopHooks } from './test-utils';

describe('formatLogText — coalesced ×N display', () => {
  it('leaves a single (count 1) line untouched', () => {
    expect(
      formatLogText(entry('You fell the crop-raiding monkey. (+3 coin)', 1)),
    ).toBe('You fell the crop-raiding monkey. (+3 coin)');
  });

  it('multiplies a single-resource suffix into a running total', () => {
    expect(
      formatLogText(entry('You fell the crop-raiding monkey. (+3 coin)', 12)),
    ).toBe('You fell the crop-raiding monkey. ×12 (+36 coin)');
    expect(formatLogText(entry('Work the home paddies. (+4 rice)', 7))).toBe(
      'Work the home paddies. ×7 (+28 rice)',
    );
  });

  it('never multiplies a multi-resource suffix (bare ×N fallback)', () => {
    expect(
      formatLogText(entry('Forage the woodlot edge. (+2 sansai, +1 coin)', 5)),
    ).toBe('Forage the woodlot edge. (+2 sansai, +1 coin) ×5');
  });

  it('falls back to a bare ×N on a non-suffix line', () => {
    expect(
      formatLogText(entry('The monkey drives you back.', 3, 'combat')),
    ).toBe('The monkey drives you back. ×3');
  });
});

// ── DOM harness ─────────────────────────────────────────────────────────────
// ── FB-74 — the per-log font stepper (log-scoped scale, persisted) ─────────────────────────────────
describe('F74 — per-log font stepper scales the log text + persists', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear(); // the persisted scale must not leak between cases
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

  function awake(): GameState {
    const base = createInitialState(1);
    return { ...base, flags: { ...base.flags, awake: true } };
  }
  const stepper = () => ({
    minus: root.querySelector<HTMLButtonElement>(
      '.log-font-btn[aria-label="Smaller log text"]',
    )!,
    plus: root.querySelector<HTMLButtonElement>(
      '.log-font-btn[aria-label="Larger log text"]',
    )!,
    logScaleVar: () =>
      root
        .querySelector<HTMLElement>('.slice-log')!
        .style.getPropertyValue('--log-scale'),
  });

  it('renders the A− / A+ steppers inside the log filter bar', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(), null);
    const bar = root.querySelector<HTMLElement>('.log-filter-bar')!;
    const grp = bar.querySelector<HTMLElement>('.log-font-stepper')!;
    expect(grp).not.toBeNull(); // lives in the filter bar, bottom-right of the log
    expect(grp.querySelectorAll('.log-font-btn').length).toBe(2);
  });

  it('A+ raises and A− lowers the log-scoped --log-scale (a scoped var, not global chrome)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(), null);
    const { minus, plus, logScaleVar } = stepper();
    expect(Number(logScaleVar())).toBeCloseTo(LOG_SCALE_DEFAULT, 5); // starts at the default

    plus.click();
    const raised = Number(logScaleVar());
    expect(raised).toBeCloseTo(LOG_SCALE_DEFAULT + LOG_SCALE_STEP, 5);

    minus.click();
    expect(Number(logScaleVar())).toBeCloseTo(LOG_SCALE_DEFAULT, 5);
  });

  it('disables A− at the floor and A+ at the ceiling (bound affordance)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(), null);
    const { minus, plus, logScaleVar } = stepper();

    // step DOWN past the floor — A− must end disabled and the var pinned to the min
    for (let i = 0; i < 20; i++) minus.click();
    expect(Number(logScaleVar())).toBeCloseTo(LOG_SCALE_MIN, 5);
    expect(minus.disabled).toBe(true);
    expect(plus.disabled).toBe(false);

    // step UP past the ceiling — A+ must end disabled and the var pinned to the max
    for (let i = 0; i < 40; i++) plus.click();
    expect(Number(logScaleVar())).toBeCloseTo(LOG_SCALE_MAX, 5);
    expect(plus.disabled).toBe(true);
    expect(minus.disabled).toBe(false);
  });

  it('persists the choice (localStorage) and re-applies it on a fresh mount', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(), null);
    stepper().plus.click();
    stepper().plus.click(); // +2 steps from the default

    // a brand-new mount (fresh renderer) must read the persisted scale back, not reset to default
    document.body.innerHTML = '';
    root = document.createElement('div');
    document.body.append(root);
    const render2 = mount(root, () => {}, noopHooks());
    render2(awake(), null);
    expect(Number(stepper().logScaleVar())).toBeCloseTo(
      LOG_SCALE_DEFAULT + 2 * LOG_SCALE_STEP,
      5,
    );
  });
});

// ── Append-only rendering migration (Phase 1) — the EASY surfaces are build-once + patch-in-place
//    (via ui/reconcile.ts), NOT a `textContent=''` rebuild. The invariant: an idle re-render of
//    UNCHANGED state produces ZERO DOM churn (no node recreated, no attribute re-written), so meter
//    transitions survive and the ~2×/s tick stops flashing. Modelled on the intro's node-identity
//    block (`FB-81`). MODE==='test' keeps the renderer synchronous. ─────────────────────────────────
// ── FB-111 · the "Chat" log tab — the OPTIONAL Q&A you chose to ask, split off from the MANDATORY
//    Story. A chat line is `narration` + `chat:true`; the filter routes it to Chat (+ All), never
//    Story. FB-104/FB-105 · the footer version is clickable → the About modal, which deep-links the raw
//    CHANGELOG on GitHub. FB-115 · the Now expiry runs on wall time regardless of the active view. ──
describe('F111 / F104 / F105 / F115 — log/UI polish batch', () => {
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

  function awake(): GameState {
    const base = createInitialState(1);
    return { ...base, flags: { ...base.flags, awake: true } };
  }
  function logged(entries: LogEntry[]): GameState {
    return { ...awake(), log: { entries, seq: entries.length } };
  }
  function clickFilter(label: string): void {
    [...root.querySelectorAll<HTMLButtonElement>('.log-filter-tab')]
      .find((b) => (b.textContent ?? '') === label)
      ?.click();
  }
  const logText = (): string =>
    root.querySelector<HTMLElement>('.log-lines')!.textContent ?? '';

  // a MANDATORY story beat (narration, no chat flag) vs an OPTIONAL asked question (narration +
  // chat:true) — the exact split ask_topic/ask_rung_topic produce (they flag their lines `chat`).
  const MANDATORY = 'The physician studies your face in the lamplight.';
  const ASKED = 'Who found me on the mountain road?';
  function withChatAndStory(): GameState {
    return logged([
      { key: 0, channel: 'narration', text: MANDATORY, tick: 0, count: 1 },
      {
        key: 1,
        channel: 'narration',
        text: ASKED,
        tick: 0,
        count: 1,
        chat: true,
      },
    ]);
  }

  it('F111 — a mandatory beat shows in Story; the asked question is withheld from Story', () => {
    const render = mount(root, () => {}, noopHooks());
    render(withChatAndStory(), null); // opens on Story (the default)
    expect(logText()).toContain(MANDATORY);
    expect(logText()).not.toContain(ASKED); // the optional Q&A is NOT mandatory story
  });

  it('F111 — the Chat tab holds the asked question, NOT the mandatory beat', () => {
    const render = mount(root, () => {}, noopHooks());
    render(withChatAndStory(), null);
    // Chat sits in the bar (order: Story · Progress · Chat · Combat · Work · All · Now)…
    const chatTab = [
      ...root.querySelectorAll<HTMLButtonElement>('.log-filter-tab'),
    ].find((b) => (b.textContent ?? '') === 'Chat');
    expect(chatTab).toBeTruthy();
    clickFilter('Chat');
    expect(logText()).toContain(ASKED); // the optional Q&A lives here…
    expect(logText()).not.toContain(MANDATORY); // …and the mandatory beat does not leak in
  });

  it('FB-400 — a chat run wears the 幕 card: scene-line classes + a "with <partner>" lintel', () => {
    // one grouping idiom (TST1): the chat run's lines carry the same .scene-* card
    // classes as VN scene runs, and the opener's head names the interlocutor.
    const render = mount(root, () => {}, noopHooks());
    const s = logged([
      {
        key: 0,
        channel: 'narration',
        text: 'Who found me?',
        tick: 0,
        count: 1,
        chat: true,
      },
      {
        key: 1,
        channel: 'narration',
        text: 'The river did.',
        tick: 0,
        count: 1,
        chat: true,
        voice: 'physician',
        speaker: 'Sōan',
      },
    ] as LogEntry[]);
    render(s, null);
    clickFilter('Chat');
    const lines = [
      ...root.querySelectorAll<HTMLElement>('.log-lines .log-line'),
    ];
    expect(lines.length).toBe(2);
    expect(lines.every((l) => l.classList.contains('scene-line'))).toBe(true);
    const head = root.querySelector<HTMLElement>('.log-lines .scene-head');
    expect(head?.textContent ?? '').toContain('with Sōan');
    // the retired inline kicker never renders
    expect(root.querySelector('.chat-kicker')).toBeNull();
  });

  it('F111 — an asked ask_topic line is flagged chat in the pure core (routing source of truth)', () => {
    // drive the REAL reducer: ask the first soan topic, and prove the emitted lines carry `chat`.
    let s: GameState = { ...awake(), introBeat: SOAN_IDX };
    const topic = SOAN.topics[0]!;
    s = reduce(s, { type: 'ask_topic', topicId: topic.id });
    const asked = s.log.entries.filter((e) => e.text === topic.label);
    expect(asked.length).toBeGreaterThan(0);
    // the player's question + the NPC's answer are ALL chat (they route to Chat, off Story).
    for (const e of s.log.entries.filter((e) => e.chat))
      expect(e.channel).toBe('narration');
    expect(asked.every((e) => e.chat === true)).toBe(true);
  });

  it('F104 — the footer version is clickable → opens the About modal (single-sourced version)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(), null);
    const ver = root.querySelector<HTMLButtonElement>(
      '.appbar-footer .foot-version',
    )!;
    expect(ver).not.toBeNull();
    // single-sourced from __VERSION__ (package.json), never hand-typed (AC-21).
    expect(ver.textContent).toBe(__VERSION__);
    const scrim = root.querySelector<HTMLElement>('.modal-scrim')!;
    expect(scrim.hidden).toBe(true); // closed to start
    ver.click();
    expect(scrim.hidden).toBe(false); // …the modal opened…
    // …straight on the About tab, whose panel carries the single-sourced version.
    expect(
      root.querySelector<HTMLElement>('.modal-tab.active')!.textContent,
    ).toBe('About');
    const shownSection = [
      ...root.querySelectorAll<HTMLElement>('.modal-section'),
    ].find((s) => !s.hidden)!;
    expect(shownSection.textContent).toContain(__VERSION__);
  });

  it('F105 — the About modal deep-links to the raw CHANGELOG on GitHub (opens in a new tab)', () => {
    const render = mount(root, () => {}, noopHooks());
    render(awake(), null);
    root
      .querySelector<HTMLButtonElement>('.appbar-footer .foot-version')!
      .click();
    const link = root.querySelector<HTMLAnchorElement>('.modal-link')!;
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toBe(
      'https://raw.githubusercontent.com/Raynos/kami-kakushi/main/CHANGELOG.md',
    );
    expect(link.target).toBe('_blank');
    expect(link.rel).toContain('noopener'); // new-tab safety
  });

  // fleeting entries: `narration` + `ephemeral:true` (rest / move-arrival flavor lines).
  // FB-268: the NOW_KEEP_LAST newest never expire, so the expiry tests seed one MORE than
  // the floor — key 0 is displaced beyond it and runs the TTL; keys 1..N hold.
  function withEphemeral(n = 1): GameState {
    return logged(
      Array.from({ length: n }, (_, i) => ({
        key: i,
        channel: 'narration' as const,
        text:
          i === 0
            ? 'A cold gust crosses the yard.'
            : `The yard goes on (${i}).`,
        tick: i,
        count: 1,
        ephemeral: true,
      })),
    );
  }

  it('F115/FB-268 — beyond the keep-last floor a Now entry expires on wall-clock even while Now is NOT the active view', () => {
    vi.useFakeTimers();
    try {
      const render = mount(root, () => {}, noopHooks());
      // render on the Story tab (default) — the ephemeral lines are stamped the moment they're SEEN,
      // and the expiry clock ticks regardless of which tab is showing (FB-115).
      render(withEphemeral(NOW_KEEP_LAST + 1), null);
      // wait out the TTL (derived from the SAME source the renderer uses) WHILE still on Story…
      vi.advanceTimersByTime(NOW_TTL_MS + 2000);
      // …then open Now: the DISPLACED oldest line aged out; the keep-last floor still stands
      // whole (FB-268 — the Now view always holds the recent beat, however old).
      clickFilter('Now');
      const lines = [
        ...root.querySelectorAll<HTMLElement>('.log-lines .now-line'),
      ];
      expect(lines.length).toBe(NOW_KEEP_LAST);
      expect(lines.some((l) => l.textContent!.includes('A cold gust'))).toBe(
        false,
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it('F115 — a still-fresh Now entry DOES surface when Now opens (the clock is real, not a sink)', () => {
    vi.useFakeTimers();
    try {
      const render = mount(root, () => {}, noopHooks());
      render(withEphemeral(), null);
      vi.advanceTimersByTime(1000); // well within the TTL — still alive
      clickFilter('Now');
      const nowLines = [
        ...root.querySelectorAll<HTMLElement>('.log-lines .now-line'),
      ];
      expect(nowLines.length).toBe(1);
      expect(nowLines[0]!.textContent).toContain(
        'A cold gust crosses the yard.',
      );
    } finally {
      vi.useRealTimers();
    }
  });
});

// ── HD-41 — the rung reward reads as EARNED (the human's live pick, 2026-07-13):
//    the ruled entry ships in both tabs, Story keeps the overheard flavor prose, PROGRESS
//    states the work that was finished (`objective:`), and the meter's flash is rationed to
//    an actual completion. Both assertions go RED against the pre-pick build, which showed
//    the story prose in Progress and pulsed the meter on every act. ──
describe('HD-41 — the earned line: two readings, and a pulse that means something', () => {
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

  // the FIRST R0 requirement, read from the registry (never a copied string — the fixture
  // moves with the authored content).
  const req = (): RequirementDef => rungRequirements('R0')[0]!;
  function completed(): GameState {
    const base = createInitialState(1);
    const r = req();
    return {
      ...base,
      flags: { ...base.flags, awake: true, raked: true },
      log: {
        entries: [
          {
            key: 1,
            text: r.flavor,
            channel: 'narration',
            voice: 'narrator',
            contentKey: `requirement.${r.id}`,
            count: 1,
          } as LogEntry,
        ],
        seq: 1,
      },
    };
  }
  const clickTab = (label: string): void => {
    [...root.querySelectorAll<HTMLButtonElement>('.log-filter-tab')]
      .find((b) => (b.textContent ?? '') === label)
      ?.click();
  };
  const logText = (): string =>
    root.querySelector<HTMLElement>('.log-lines')!.textContent ?? '';

  it('Story reads the overheard line; Progress states the work that was finished', () => {
    const render = mount(root, () => {}, noopHooks());
    render(completed(), null);
    const r = req();
    // Story: the authored flavor prose, as always — and NOT the record-side statement.
    expect(logText()).toContain(r.flavor);
    expect(logText()).not.toContain(r.objective);
    // the treatment is the ruled entry (the pick), in both tabs — one class, no DEV attribute.
    expect(root.querySelector('.log-line.earned')).not.toBeNull();
    // Progress: the register of earned work — the objective line, never the story prose.
    clickTab('Progress');
    expect(logText()).toContain(r.objective);
    expect(logText()).not.toContain(r.flavor);
    expect(root.querySelector('.log-line.earned.docket')).not.toBeNull();
  });

  it('the meter pulses when a requirement COMPLETES, not on every act that moves the bar', () => {
    const render = mount(root, () => {}, noopHooks());
    const r = req();
    const target = r.type === 'count' ? r.target : 1;
    const base = {
      ...createInitialState(1),
      flags: { ...createInitialState(1).flags, awake: true, raked: true },
    };
    const at = (n: number): GameState => ({ ...base, rungReqs: { [r.id]: n } });
    const meter = (): HTMLElement =>
      root.querySelector<HTMLElement>('.rung-head-meter')!;
    render(at(1), null); // first paint — never pulses (a load is not an achievement)
    expect(meter().classList.contains('bump')).toBe(false);
    // the bar MOVES (the rounded percent grows) but nothing is finished yet ⇒ no flash.
    const half = Math.floor(target / 2);
    render(at(half), at(1));
    expect(rungProgress(at(half)).percent).toBeGreaterThan(
      rungProgress(at(1)).percent,
    );
    expect(meter().classList.contains('bump')).toBe(false);
    // the requirement lands ⇒ exactly here, the meter flashes.
    render(at(target), at(half));
    expect(rungProgress(at(target)).done).toBe(1);
    expect(meter().classList.contains('bump')).toBe(true);
  });
});

// ── 2026-07-13 ruling (dialogue live-swap plan) — the DEV log repaint re-derives KEYED
// entries from the current registries + overlays, so a story-take flip re-voices logged
// lines too. RED on main before this landed: devRederivedEntry did not exist. ──
// ── 2026-07-13 ruling (dialogue live-swap plan) — the DEV log repaint re-derives KEYED
// entries from the current registries + overlays, so a story-take flip re-voices logged
// lines too. RED on main before this landed: devRederivedEntry did not exist. ──
describe('devRederivedEntry — keyed log prose re-derives under the active take', () => {
  afterEach(() => __setStoryOverlay(null));

  it('re-derives a keyed entry; unkeyed and unresolvable entries keep their stored prose', () => {
    const line = getDialogue(COLD_OPEN_DIALOGUE_ID).lines[0]!;
    const keyed: LogEntry = {
      key: 0,
      channel: 'narration',
      text: 'stale baked prose',
      tick: 0,
      count: 1,
      contentKey: `dialogue.${COLD_OPEN_DIALOGUE_ID}.${line.id}`,
    };
    expect(devRederivedEntry(keyed).text).toBe(line.text); // canon registry read
    __setStoryOverlay({
      [`dialogue.${COLD_OPEN_DIALOGUE_ID}.${line.id}`]: 'TAKE voice',
    });
    expect(devRederivedEntry(keyed).text).toBe('TAKE voice'); // the flip reaches history
    // an unresolvable key (renamed content id) degrades to the stored prose, same as codec
    expect(
      devRederivedEntry({ ...keyed, contentKey: 'dialogue.gone.gone' }).text,
    ).toBe('stale baked prose');
    const unkeyed: LogEntry = {
      key: 1,
      channel: 'narration',
      text: 'inline',
      tick: 0,
      count: 1,
    };
    expect(devRederivedEntry(unkeyed)).toBe(unkeyed); // identity — no key, no derive
  });
});

// ── FB-168 phone log band — folding the sheet must land the strip back on the NEWEST
//    line. The band is a two-line window onto a bottom-pinned scroll; expanding it
//    re-pinned, but folding left the reader's offset untouched, so the strip came back
//    showing whatever ancient line sat at that offset (~1300px adrift, measured at
//    390×844). Goes RED against the pre-fix build, which only re-pinned on expand. ──
describe('FB-168 — the phone log band re-pins to the newest line when folded', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    // the phone band only arms under the ≤920px query
    window.matchMedia = (q: string): MediaQueryList =>
      ({
        matches: true,
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

  it('lands on the foot after expand → fold, not on the stale offset', () => {
    const render = mount(root, () => {}, noopHooks());
    const base = createInitialState(1);
    render({ ...base, flags: { ...base.flags, awake: true } }, null);

    const section = root.querySelector<HTMLElement>('.log')!;
    const lines = root.querySelector<HTMLElement>('.log-lines')!;
    // jsdom lays nothing out, so give the scroller a real geometry — without this the
    // assertion would pass against 0 === 0 and prove nothing.
    Object.defineProperty(lines, 'scrollHeight', {
      value: 5000,
      configurable: true,
    });
    Object.defineProperty(lines, 'clientHeight', {
      value: 42,
      configurable: true,
    });

    section.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(section.classList.contains('m-expanded')).toBe(true);

    // the reader scrolls back through history inside the open sheet...
    lines.scrollTop = 1200;
    // ...then folds it by its header.
    root
      .querySelector('.log-head h2')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(section.classList.contains('m-expanded')).toBe(false);
    expect(lines.scrollTop).toBe(5000); // pinned to the foot, not the stale 1200
  });
});
