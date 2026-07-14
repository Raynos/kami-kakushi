// @vitest-environment jsdom
// @slow — jsdom render suite (split out of render.test.ts, 2026-07-13 render-split);
// runs at push/CI, not the per-commit vitest lane (verify budget, ADR-072/ADR-176).
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, FRESH_DIVIDER_TTL_MS, FRESH_DIVIDER_FADE_MS } from '../render';
import {
  createInitialState,
  reduce,
  DIALOGUE_SCENES,
  ATTR_META,
  getRank,
  nextRankId,
  promotionReady,
  RUNG_BEATS,
  type GameState,
  type Intent,
  rungRequirements,
  rungProgress,
} from '../../core';
import { __setStoryOverlay } from '../../core/content/story-overlay';

import { SOAN, SOAN_IDX, LAST, LAST_IDX, noopHooks } from './test-utils';

// ── FB-62 — the two-column VN intro modal: ask → done → decide gating + choose → reply → Continue ──
// (MODE==='test' → the typewriter is instant, so the panel + transcript render synchronously.)
describe('F62/F81 — the interactive intro VN scene (append-only, two columns)', () => {
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

  // an intro-active state (awake so render shows the VN scene, not the cold-open) parked at `beat`.
  function introState(beat: number, askedTopics: string[] = []): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      introBeat: beat,
      askedTopics,
      flags: { ...base.flags, awake: true },
    };
  }
  function spyMount(): { seen: Intent[]; render: ReturnType<typeof mount> } {
    const seen: Intent[] = [];
    return { seen, render: mount(root, (i) => seen.push(i), noopHooks()) };
  }
  const byText = (sel: string, substr: string): HTMLButtonElement | undefined =>
    [...root.querySelectorAll<HTMLButtonElement>(sel)].find((b) =>
      (b.textContent ?? '').includes(substr),
    );
  // a sub-panel counts as SHOWN only when it exists and isn't hidden (the panel is a stable region
  // whose sub-panels toggle `hidden` in place — FB-79, never removed from the DOM).
  const shown = (sel: string): boolean => {
    const e = root.querySelector<HTMLElement>(sel);
    return !!e && !e.hidden;
  };

  it('renders TWO columns; Phase 1 shows the ask hub, the decide grid stays hidden', () => {
    const { render } = spyMount();
    render(introState(SOAN_IDX), null);
    expect(root.querySelector('.vn-body')).not.toBeNull();
    expect(root.querySelector('.vn-story .vn-lines')).not.toBeNull();
    expect(root.querySelector('.vn-panel')).not.toBeNull();
    // the greeting typed into the story; the ASK sub-panel is shown, the DECIDE sub-panel is hidden.
    expect(root.querySelector<HTMLElement>('.vn-story')!.textContent).toContain(
      'Sōan',
    );
    expect(root.querySelectorAll('.intro-ask').length).toBe(SOAN.topics.length);
    expect(shown('.vn-ask')).toBe(true);
    expect(shown('.vn-decide')).toBe(false); // the decision is withheld in the ask phase
    expect(root.querySelector('.intro-done')).not.toBeNull();
  });

  it('"I\'ve heard enough" swaps to the DECIDE grid WITHOUT recreating the story nodes (F81)', () => {
    const { render } = spyMount();
    render(introState(SOAN_IDX), null);
    // capture the first already-rendered greeting line to prove it is NOT destroyed on the swap.
    const firstLine = root.querySelector<HTMLElement>('.vn-story .vn-line')!;
    expect(firstLine).not.toBeNull();
    root.querySelector<HTMLButtonElement>('.intro-done')!.click();
    // the SAME node persists (append-only — no teardown/innerHTML reset ⇒ no flash).
    expect(firstLine.isConnected).toBe(true);
    expect(root.querySelector('.vn-story .vn-line')).toBe(firstLine);
    // the panel swapped IN PLACE: decide shown, ask hidden (both still in the DOM).
    expect(shown('.vn-decide')).toBe(true);
    expect(shown('.vn-ask')).toBe(false);
    expect(root.querySelectorAll('.intro-choice').length).toBe(
      SOAN.decision.options.length,
    );
    // the decision prompt joined the story transcript (so it, too, is typed — FB-82/FB-83).
    expect(root.querySelector<HTMLElement>('.vn-story')!.textContent).toContain(
      SOAN.decision.prompt,
    );
  });

  it('an asked Q/A APPENDS to the story, leaving prior lines untouched (append-only diff)', () => {
    const { render } = spyMount();
    const topic = SOAN.topics[0]!;
    render(introState(SOAN_IDX), null);
    const greetingLines = root.querySelectorAll('.vn-story .vn-line').length;
    const firstLine = root.querySelector<HTMLElement>('.vn-story .vn-line')!;
    // simulate the core having recorded the ask (askedTopics grows) + a re-render.
    render(introState(SOAN_IDX, [topic.id]), null);
    expect(firstLine.isConnected).toBe(true); // the greeting node was NOT recreated
    const lines = root.querySelectorAll('.vn-story .vn-line');
    expect(lines.length).toBeGreaterThan(greetingLines); // the Q + answer appended
    expect(root.querySelector<HTMLElement>('.vn-story')!.textContent).toContain(
      topic.label,
    );
  });

  it('each decision button is THEMED by the attribute it grants +1 (accent + kanji chip)', () => {
    const { render } = spyMount();
    render(introState(SOAN_IDX), null);
    const opt = SOAN.decision.options[0]!; // derived — whatever soan's first option grants
    const btn = byText('.intro-choice', opt.label)!;
    expect(btn).toBeTruthy();
    expect(btn.style.getPropertyValue('--attr-accent')).toContain(
      `attr-${opt.stat.up}`,
    );
    const chip = btn.querySelector<HTMLElement>('.intro-choice-tag')!;
    expect(chip).not.toBeNull();
    expect(chip.textContent).toBe(ATTR_META[opt.stat.up].kanji);
  });

  it('picking a choice does NOT advance — reply + fresh divider + perk + Continue appear', () => {
    const { seen, render } = spyMount();
    render(introState(SOAN_IDX), null);
    root.querySelector<HTMLButtonElement>('.intro-done')!.click();
    const opt = SOAN.decision.options[0]!;
    byText('.intro-choice', opt.label)!.click();
    // the KEY complaint fix: picking never dispatches choose_intro (no scene jump yet).
    expect(seen.some((i) => i.type === 'choose_intro')).toBe(false);
    // the chosen reply (what the CHARACTER said back) appended to the story…
    expect(root.querySelector<HTMLElement>('.vn-story')!.textContent).toContain(
      opt.react.slice(1, 20),
    );
    // …under the SAME fade-away fresh-entries divider the main log uses (FB-76)…
    expect(root.querySelector('.vn-story .log-fresh-divider')).not.toBeNull();
    // …the granted perk shows as an attribute-themed box, and the outcome panel is shown…
    const perk = root.querySelector<HTMLElement>('.perk-box')!;
    expect(perk).not.toBeNull();
    expect(perk.textContent).toContain(opt.perk.name);
    expect(perk.classList.contains('attr-themed')).toBe(true);
    expect(root.querySelector('.perk-attr-chip')!.textContent).toBe(
      ATTR_META[opt.stat.up].kanji,
    );
    expect(shown('.vn-outcome')).toBe(true);
    expect(shown('.vn-decide')).toBe(false);
    // …and a single Continue is the ONLY way onward.
    expect(root.querySelector('.intro-continue')).not.toBeNull();
  });

  // FB-222 — the unread baseline seeds at the FIRST render (even mid-VN), so a milestone
  // landing during the cold open counts as a mid-session arrival. RED before FB-222: the
  // seed first ran on the intro-END render and swallowed the perk line as "history".
  it('F222 — a milestone landing DURING the intro trips the Progress unread dot on reveal', () => {
    const { render } = spyMount();
    let s = introState(LAST_IDX); // the FINAL scene — its pick ends the intro
    render(s, null); // VN active — this render must seed the baseline
    const opt = LAST.decision.options[0]!;
    s = reduce(s, { type: 'choose_intro', optionId: opt.id }); // the REAL pick → perk milestone
    expect(s.log.entries.some((e) => e.channel === 'milestone')).toBe(true); // fixture self-check
    render(s, null); // the last scene is done ⇒ the intro is over — the shell reveals
    const progress = [
      ...root.querySelectorAll<HTMLButtonElement>('.log-filter-tab'),
    ].find((b) => (b.textContent ?? '').includes('Progress'))!;
    expect(progress).not.toBeUndefined();
    expect(progress.classList.contains('unread')).toBe(true);
  });

  it('ONLY Continue dispatches choose_intro (advancing the scene)', () => {
    const { seen, render } = spyMount();
    render(introState(SOAN_IDX), null);
    root.querySelector<HTMLButtonElement>('.intro-done')!.click();
    const opt = SOAN.decision.options[0]!;
    byText('.intro-choice', opt.label)!.click();
    root.querySelector<HTMLButtonElement>('.intro-continue')!.click();
    expect(seen).toContainEqual({ type: 'choose_intro', optionId: opt.id });
  });

  // (Restored with HD-37's rearc — the dream act is topic-less again, so the renderer's
  // decision-only branch is live once more; the test came back from git history.)
  it('a decision-only scene (the dream — no topics) opens straight in the DECIDE grid', () => {
    const dreamIdx = DIALOGUE_SCENES.findIndex((s) => s.topics.length === 0);
    expect(dreamIdx).toBeGreaterThanOrEqual(0);
    const { render } = spyMount();
    render(introState(dreamIdx), null);
    expect(shown('.vn-decide')).toBe(true);
    expect(root.querySelector('.vn-choices.vn-grid')).not.toBeNull();
    expect(root.querySelector('.intro-ask')).toBeNull(); // no ask hub for a topic-less scene
    expect(root.querySelector('.intro-done')).toBeNull();
    // the prompt still types into the story on entry (nothing pops in un-typed — FB-82/FB-83).
    expect(root.querySelector<HTMLElement>('.vn-story')!.textContent).toContain(
      DIALOGUE_SCENES[dreamIdx]!.decision.prompt,
    );
  });

  // FB-88 — EVERY voiced line carries its speaker-name prefix, not just the player's. The NPC greeting
  // (a non-player line) must render "<name>: " the same way the player's "You: " does.
  it('F88 — a voiced NPC greeting line renders its speaker-name prefix, not just player lines', () => {
    const { render } = spyMount();
    render(introState(SOAN_IDX), null);
    // the scene's first VOICED greeting line (narrator lines carry no speaker → no prefix, by design).
    const npcName = SOAN.greeting.find((l) => l.speaker)!.speaker; // from the scene
    expect(npcName).toBeTruthy();
    const prefixes = [
      ...root.querySelectorAll<HTMLElement>('.vn-line .vn-speaker'),
    ].map((s) => s.textContent);
    // the NPC's own name prefixes its line (RED before FB-88 — NPC lines had no .vn-speaker span).
    expect(prefixes).toContain(`${npcName}: `);
  });

  // FB-87 — an asked topic keeps the `asked` class (the hook the gray styling hangs on). Re-askable
  // (still a live button), just de-emphasized in CSS.
  it('F87 — an asked topic button carries the gray "asked" class', () => {
    const { render } = spyMount();
    const topic = SOAN.topics[0]!;
    render(introState(SOAN_IDX, [topic.id]), null);
    const btn = [
      ...root.querySelectorAll<HTMLButtonElement>('.intro-ask'),
    ].find((b) => (b.textContent ?? '').includes(topic.label))!;
    expect(btn).toBeTruthy();
    expect(btn.classList.contains('asked')).toBe(true);
  });
});

// ── ADR-110 / FB-106 — the rung-up STORY BEAT is REACHABLE: the header rung element is the player-
//    triggered start, the beat plays in the SAME full-screen VN scene as the intro (vnActive), and a
//    ready promotion is IGNORABLE (it banks; the grind never forces the modal). Reuses the intro's
//    append-only VN engine (§7.3) — the rung options ride the same latch → Continue → dispatch path. ──
// ── ADR-110 / FB-106 — the rung-up STORY BEAT is REACHABLE: the header rung element is the player-
//    triggered start, the beat plays in the SAME full-screen VN scene as the intro (vnActive), and a
//    ready promotion is IGNORABLE (it banks; the grind never forces the modal). Reuses the intro's
//    append-only VN engine (§7.3) — the rung options ride the same latch → Continue → dispatch path. ──
describe('D-110 / F106 — rung-up story beats are reachable (header trigger + VN reuse)', () => {
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
  function spyMount(): { seen: Intent[]; render: ReturnType<typeof mount> } {
    const seen: Intent[] = [];
    return { seen, render: mount(root, (i) => seen.push(i), noopHooks()) };
  }
  const byText = (sel: string, substr: string): HTMLButtonElement | undefined =>
    [...root.querySelectorAll<HTMLButtonElement>(sel)].find((b) =>
      (b.textContent ?? '').includes(substr),
    );
  const shown = (sel: string): boolean => {
    const e = root.querySelector<HTMLElement>(sel);
    return !!e && !e.hidden;
  };
  const INTRO_DONE = DIALOGUE_SCENES.length; // introBeat past the last scene ⇒ introActive false
  // an out-of-intro, awake, "the-ladder-is-meaningful" (raked) base — the header rung shows here.
  function awakeRungBase(): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      introBeat: INTRO_DONE,
      flags: { ...base.flags, awake: true, raked: true },
    };
  }
  // a state parked at R0 with its requirement list DONE (source-of-truth: the gen'd
  // registry) ⇒ promotionReady. rungBeat stays null (the promotion BANKS). FB-121.
  const doneReqs = (rung: GameState['rung']): Record<string, number> =>
    Object.fromEntries(
      rungRequirements(rung).map((r) => [
        r.id,
        r.type === 'count' ? r.target : 1,
      ]),
    );
  function rungReadyState(): GameState {
    return { ...awakeRungBase(), rungReqs: doneReqs('R0') };
  }
  // a state parked INSIDE a live rung beat (the player already triggered it).
  function rungBeatState(
    target: 'R1' | 'R3',
    askedTopics: string[] = [],
  ): GameState {
    return { ...awakeRungBase(), rungBeat: target, askedTopics };
  }

  it('a READY promotion turns the header rung into a begin_rung_beat trigger', () => {
    const { seen, render } = spyMount();
    const state = rungReadyState();
    expect(promotionReady(state)).toBe(true); // fixture self-check (derived, not a magic number)
    render(state, null);
    const trigger =
      root.querySelector<HTMLButtonElement>('.rung-head-trigger')!;
    expect(trigger).not.toBeNull();
    expect(root.querySelector('.rung-head')!.classList.contains('ready')).toBe(
      true,
    );
    expect(trigger.disabled).toBe(false); // clickable ONLY when ready
    trigger.click();
    expect(seen).toContainEqual({ type: 'begin_rung_beat' });
  });

  it('the TERMINAL rung (R7) with a full meter does NOT light a dead trigger', () => {
    // R7 is the top of T0: with its whole requirement list done promotionReady stays true —
    // but there is NO next rank, so the header must NOT offer a begin_rung_beat that would
    // no-op (the deploy-gate audit caught this as a phantom capstone button). RED against
    // the pre-fix header, which lit `.ready` whenever promotionReady held.
    const { seen, render } = spyMount();
    const state: GameState = {
      ...awakeRungBase(),
      rung: 'R7',
      rungReqs: doneReqs('R7'),
    };
    expect(promotionReady(state)).toBe(true); // the list IS done + the gate open…
    expect(nextRankId(state.rung)).toBeNull(); // …but there is no rung to advance to
    render(state, null);
    expect(root.querySelector('.rung-head')!.classList.contains('ready')).toBe(
      false,
    ); // no glow
    const trigger =
      root.querySelector<HTMLButtonElement>('.rung-head-trigger')!;
    expect(trigger.disabled).toBe(true);
    trigger.click();
    expect(seen).not.toContainEqual({ type: 'begin_rung_beat' }); // clicking does nothing
  });

  it('the header rung shows the rung name, a percent bar, and a hover detail card (not-ready)', () => {
    const { render } = spyMount();
    // mid-climb, NOT ready: the R0 count requirement at 40% of its target (registry-derived).
    const rake = rungRequirements('R0').find((r) => r.type === 'count')!;
    const midway = rake.type === 'count' ? Math.floor(rake.target * 0.4) : 0;
    const state: GameState = {
      ...awakeRungBase(),
      rungReqs: { [rake.id]: midway },
    };
    expect(promotionReady(state)).toBe(false);
    render(state, null);
    const head = root.querySelector<HTMLElement>('.rung-head')!;
    expect(head.hidden).toBe(false);
    expect(head.classList.contains('ready')).toBe(false);
    expect(
      root.querySelector<HTMLButtonElement>('.rung-head-trigger')!.disabled,
    ).toBe(true);
    const rank = getRank('R0');
    const name =
      root.querySelector<HTMLElement>('.rung-head-name')!.textContent ?? '';
    expect(name).toContain(rank.title);
    expect(name).toContain(rank.kanji);
    expect(root.querySelector('.rung-head-meter > span')).not.toBeNull();
    // the hover card carries the rounded percent + names the NEXT rung (FB-121: the same
    // rungProgress read the gate uses — AC-6).
    expect(root.querySelector('.rung-head-card-meter')!.textContent).toContain(
      `${rungProgress(state).percent}%`,
    );
    const next = getRank(nextRankId('R0')!); // → R1
    expect(root.querySelector('.rung-head-card-next')!.textContent).toContain(
      next.title,
    );
  });

  it('with rungBeat set the VN scene renders the rung beat and HIDES the shell (vnActive)', () => {
    const { render } = spyMount();
    render(rungBeatState('R1'), null);
    // the full-screen washi scene is up (the SAME .vn-scene as the intro)…
    expect(root.querySelector('.vn-scene')).not.toBeNull();
    // …and it hides the shell (the vnActive gate now covers a rung beat too).
    expect(root.querySelector<HTMLElement>('.shell')!.hidden).toBe(true);
    // G4 — R1 is now a full VN (it carries ask topics) → it opens in the ASK phase; the decide
    // grid is built (its options present in the DOM) but held until "I've heard enough".
    expect(shown('.vn-ask')).toBe(true);
    expect(root.querySelectorAll('.intro-choice').length).toBe(
      RUNG_BEATS.R1!.decision.options.length,
    );
    // the greeting prose typed into the story (the beat is the story surface, FB-103).
    expect(root.querySelector<HTMLElement>('.vn-story')!.textContent).toContain(
      RUNG_BEATS.R1!.greeting[0]!.text.slice(0, 24),
    );
  });

  it('a full VN meet (R3 Kihei) shows the ask-hub; asking dispatches ask_rung_topic', () => {
    const { seen, render } = spyMount();
    render(rungBeatState('R3'), null);
    expect(shown('.vn-ask')).toBe(true);
    // only the un-gated topics are askable at zero-asked (kihei-who gates behind kihei-why-blade).
    const askable = RUNG_BEATS.R3!.topics.filter(
      (t) => !t.gate || t.gate(new Set<string>()),
    );
    expect(askable.length).toBeGreaterThan(0);
    expect(root.querySelectorAll('.intro-ask').length).toBe(askable.length);
    const topic = askable[0]!;
    byText('.intro-ask', topic.label)!.click();
    expect(seen).toContainEqual({ type: 'ask_rung_topic', topicId: topic.id });
  });

  it('picking a rung option latches; Rung up performs the in-modal ceremony; its Continue dispatches (FB-153)', () => {
    const { seen, render } = spyMount();
    render(rungBeatState('R1'), null);
    const opt = RUNG_BEATS.R1!.decision.options[0]!;
    byText('.intro-choice', opt.label)!.click();
    // latching alone does NOT advance (no promotion yet) — mirrors the intro's FB-62 fix.
    expect(seen.some((i) => i.type === 'choose_rung_option')).toBe(false);
    // the chosen reply appended to the story…
    expect(root.querySelector<HTMLElement>('.vn-story')!.textContent).toContain(
      opt.react.slice(1, 20),
    );
    // FB-153 — step 1: "Rung up" renders the ceremony IN the modal, still no dispatch…
    root.querySelector<HTMLButtonElement>('.intro-continue')!.click();
    expect(seen.some((i) => i.type === 'choose_rung_option')).toBe(false);
    const ceremony = root.querySelector<HTMLElement>('.vn-rung-ceremony')!;
    expect(ceremony).not.toBeNull();
    expect(ceremony.textContent).toContain("You've been promoted to");
    // …step 2: the ceremony's Continue is the ONE dispatching control.
    ceremony.querySelector<HTMLButtonElement>('.intro-continue')!.click();
    expect(seen).toContainEqual({
      type: 'choose_rung_option',
      optionId: opt.id,
    });
  });

  it('ignoring a ready promotion leaves the game playable (the beat is IGNORABLE, D-110)', () => {
    const { seen, render } = spyMount();
    render(rungReadyState(), null);
    // nothing auto-fired the beat — a ready promotion BANKS on the header, never forces the modal.
    expect(seen.some((i) => i.type === 'begin_rung_beat')).toBe(false);
    // the shell is SHOWN (no full-screen VN scene blocks play) …
    expect(root.querySelector<HTMLElement>('.shell')!.hidden).toBe(false);
    expect(root.querySelector('.vn-scene')).toBeNull();
    // … the affordance sits ready-but-optional (the player may keep grinding indefinitely).
    expect(root.querySelector('.rung-head')!.classList.contains('ready')).toBe(
      true,
    );
    expect(
      root.querySelector<HTMLButtonElement>('.rung-head-trigger')!.disabled,
    ).toBe(false);
  });
});

// ── SLOP threshold gates (human, 2026-07-10) — crossing R0→R1 warns "unreviewed",
//    R1→R2 warns "untested" with typed consent on Confirm; both close the house way
//    (× / Escape); a live rung-up VN plays out before the warning; a DEV teleport
//    (no player-initiated arming click) never trips either. Each test drives the
//    REAL reducer to the promotion and the REAL mounted DOM through the render diff. ──
// ── FB-86/FB-90 — the intro typewriter under the ANIMATED path (MODE!=='test', motion allowed): lines
//    AUTO-advance (a click only speeds up), and an idle re-render of settled state mutates nothing. ──
describe('F86/F90 — intro typewriter auto-advance + flicker-free reconcile (animated)', () => {
  let root: HTMLElement;
  beforeEach(() => {
    document.body.innerHTML = '';
    // motion ALLOWED (matches:false) — so the renderer takes the real typewriter path, not instant.
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
    vi.stubEnv('MODE', 'development'); // leave the MODE==='test' instant fast-path
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });
  function introState(beat: number, askedTopics: string[] = []): GameState {
    const base = createInitialState(1);
    return {
      ...base,
      introBeat: beat,
      askedTopics,
      flags: { ...base.flags, awake: true },
    };
  }
  function spyMount(): ReturnType<typeof mount> {
    return mount(root, () => {}, noopHooks());
  }
  const lineTexts = (): (string | null)[] =>
    [...root.querySelectorAll<HTMLElement>('.vn-line .vn-text')].map(
      (e) => e.textContent,
    );
  const shown = (sel: string): boolean => {
    const e = root.querySelector<HTMLElement>(sel);
    return !!e && !e.hidden;
  };

  // FB-86 — the core fix: with NO click at all, the block types line 0, then AUTO-advances (the ~2s
  // timer) into each subsequent line to the end, and reveals the panel. RED before FB-86: a finished
  // non-last line just paused, so line 1+ never typed without a click.
  it('F86 — lines auto-advance through the whole block with NO click, then reveal the panel', () => {
    const render = spyMount();
    render(introState(SOAN_IDX), null);
    const greeting = SOAN.greeting;
    expect(greeting.length).toBeGreaterThanOrEqual(2);
    vi.runAllTimers(); // let ONLY the auto timers run — no click
    const texts = lineTexts();
    // G4 — the intro greeting now mixes voiced speaker lines (Genemon/Sōan) with narration; a
    // voiced line whose source carries no quotes is DISPLAYED quoted (FB-158), so derive the
    // expected DISPLAY text with the same rule rather than the raw source.
    const displayed = (line: (typeof greeting)[number]): string =>
      line.voice !== 'narrator' && !/["“]/.test(line.text)
        ? `"${line.text}"`
        : line.text;
    greeting.forEach((line, i) => expect(texts[i]).toBe(displayed(line))); // every line typed itself
    expect(shown('.vn-ask')).toBe(true); // …and the panel revealed after the last line
  });

  // FB-86 — a click while a line is still typing COMPLETES it instantly (speeds up); it never pauses.
  it('F86 — a click mid-type completes the current line instantly', () => {
    const render = spyMount();
    render(introState(SOAN_IDX), null);
    const full = SOAN.greeting[0]!.text;
    const first = root.querySelector<HTMLElement>('.vn-line .vn-text')!;
    expect(first.textContent).not.toBe(full); // mid-type (the first char timer hasn't even fired)
    root.querySelector<HTMLElement>('.vn-scene')!.click();
    expect(first.textContent).toBe(full); // the click filled the line at once
  });

  // FB-197 — Space advances exactly like a click (keyboard VN idiom). RED before FB-197:
  // the scene only listened for clicks, so the keydown left the line mid-type.
  it('F197 — Space mid-type completes the current line instantly (keyboard advance)', () => {
    const render = spyMount();
    render(introState(SOAN_IDX), null);
    const full = SOAN.greeting[0]!.text;
    const first = root.querySelector<HTMLElement>('.vn-line .vn-text')!;
    expect(first.textContent).not.toBe(full); // mid-type
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
    );
    expect(first.textContent).toBe(full); // Space filled the line at once
  });

  // FB-197 — a Space keydown whose target is a focusable control must NOT advance the
  // scene: Space there presses the control (e.g. an ask-topic button), not the typewriter.
  it('F197 — Space on a focused button does NOT advance the typewriter', () => {
    const render = spyMount();
    render(introState(SOAN_IDX), null);
    vi.runAllTimers(); // settle the greeting so the ask panel (buttons) is revealed
    render(introState(SOAN_IDX, [SOAN.topics[0]!.id]), null); // a new block types
    const spans = [...root.querySelectorAll<HTMLElement>('.vn-line .vn-text')];
    const typing = spans[spans.length - 1]!;
    const before = typing.textContent;
    const btn = root.querySelector<HTMLButtonElement>('.intro-ask')!;
    btn.focus();
    btn.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
    );
    expect(typing.textContent).toBe(before); // untouched — the keydown belonged to the button
  });

  // FB-86 — a click DURING the ~2s inter-line hold skips the remaining wait and starts the next line
  // now. RED against a model that ignores the click in the gap (line 1 would stay empty until ~2s).
  it('F86 — a click during the inter-line hold advances immediately (skips the wait)', () => {
    const render = spyMount();
    render(introState(SOAN_IDX), null);
    const sceneEl = root.querySelector<HTMLElement>('.vn-scene')!;
    sceneEl.click(); // complete line 0 → arm the hold
    expect(lineTexts()[1]).toBe(''); // line 1 waiting out the hold
    sceneEl.click(); // click in the gap → skip the wait, start line 1 now
    vi.advanceTimersByTime(100); // a fraction of the ~2s hold — enough for a few chars if it started
    expect((lineTexts()[1] ?? '').length).toBeGreaterThan(0); // it started early, not at ~2s
  });

  // FB-227/FB-271 — the GBA caret (the cold open's co-typing primitive) rides the VN's
  // typing line, and once the block finishes it RESTS on the last line (the "waiting for
  // you" beat) instead of vanishing — it only moves when the next block starts typing.
  it('F227/F271 — the GBA caret rides the typing line and rests on the last line at block end', () => {
    const render = spyMount();
    render(introState(SOAN_IDX), null);
    const typing = root.querySelector<HTMLElement>('.vn-line .vn-text')!;
    expect(typing.classList.contains('co-typing')).toBe(true); // riding line 0 mid-type
    vi.runAllTimers(); // the whole block types + auto-advances out
    const resting = [
      ...root.querySelectorAll<HTMLElement>('.vn-lines .co-typing'),
    ];
    expect(resting.length).toBe(1); // exactly ONE caret, resting (FB-271), never a trail
    const lines = [...root.querySelectorAll<HTMLElement>('.vn-lines .vn-text')];
    expect(resting[0]).toBe(lines[lines.length - 1]); // …on the block's LAST line
  });

  // FB-199 — the VN fresh divider lives FRESH_DIVIDER_TTL_MS past the last new line (the
  // source constant, ~30s), not the old hard-coded 4.5s. RED before FB-199: at ~5s the
  // divider was already fading out from under the reader.
  it('F199 — the fresh divider outlives 4.5s and fades on the source-derived TTL', () => {
    const render = spyMount();
    render(introState(SOAN_IDX), null);
    vi.runAllTimers(); // settle the greeting → ask panel
    root.querySelector<HTMLButtonElement>('.intro-done')!.click();
    vi.runAllTimers(); // settle the decision prompt
    const opt = SOAN.decision.options[0]!;
    [...root.querySelectorAll<HTMLButtonElement>('.intro-choice')]
      .find((b) => b.textContent!.includes(opt.label))!
      .click(); // latch → the fresh reply block drops the divider
    const divider = root.querySelector<HTMLElement>(
      '.vn-story .log-fresh-divider',
    )!;
    expect(divider).not.toBeNull();
    vi.advanceTimersByTime(FRESH_DIVIDER_TTL_MS - 1000); // types the block + waits out most of the TTL
    expect(divider.isConnected).toBe(true);
    expect(divider.classList.contains('fading')).toBe(false); // RED under the old 4.5s timer
    vi.advanceTimersByTime(1000 + FRESH_DIVIDER_FADE_MS + 50); // past TTL + the fade-out
    expect(root.querySelector('.vn-story .log-fresh-divider')).toBeNull();
  });

  // FB-90 — the flicker guard: once the block has typed out and the panel is revealed, re-rendering
  // the SAME intro state (as the tick loop does) must not touch the scene DOM — no re-added fade
  // class, no re-typed text, no re-hidden/re-shown panel. A DOM mutation here is a visible flicker.
  it('F90 — an idle re-render of settled intro state mutates nothing in the scene', () => {
    const render = spyMount();
    render(introState(SOAN_IDX), null);
    vi.runAllTimers(); // settle: greeting fully typed, ask panel revealed
    const sceneEl = root.querySelector<HTMLElement>('.vn-scene')!;
    const before = sceneEl.innerHTML;
    const obs = new MutationObserver(() => {});
    obs.observe(sceneEl, { childList: true, subtree: true, attributes: true });
    render(introState(SOAN_IDX), null); // identical-state re-render ticks
    render(introState(SOAN_IDX), null);
    render(introState(SOAN_IDX), null);
    const records = obs.takeRecords(); // synchronously drain any queued mutations
    obs.disconnect();
    expect(records).toEqual([]); // zero DOM mutations ⇒ nothing can re-animate ⇒ no flicker
    expect(sceneEl.innerHTML).toBe(before);
  });
});

// ── Multi-panel workspace: the locked byōbu+cards layout, the sticky-bottom log, the in-flow
//    pedlar buy control, and the no-empty-ghost-slice fix. DOM tests drive the real renderer. ──
// ── FB-359/FB-360 (inbox drain 2026-07-10) — New game DURING an open VN scene: the
//    pre-awake render branch early-returns, and it used to skip teardownIntroScene(),
//    leaving the dead .vn-scene overlay (z-40) mounted over the cold open forever —
//    its buttons dispatch intents the pre-awake reducer refuses ("can't click
//    continue", "can't even press new game"). RED against the old branch.
describe('FB-359/FB-360 — a swap to pre-awake tears the VN scene down', () => {
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

  it('New game while the intro VN is open drops the scene and shows the cold open', () => {
    const base = createInitialState(1);
    const inVn: GameState = {
      ...base,
      introBeat: 1,
      flags: { ...base.flags, awake: true },
    };
    const render = mount(root, () => {}, noopHooks());
    render(inVn, null);
    expect(root.querySelector('.vn-scene')).not.toBeNull(); // the VN is up
    // the New game swap: a fresh pre-awake state rendered over it
    render(createInitialState(2), null);
    expect(root.querySelector('.vn-scene')).toBeNull(); // the stale overlay must go…
    const coldOpen = root.querySelector<HTMLElement>('.coldopen')!;
    expect(coldOpen.hidden).toBe(false); // …and the cold open own the screen
  });
});

// ── FB-367/FB-368 (inbox drain 2026-07-10) — the rake row speaks the labour-row idioms
//    (patchLabourRow / ADR-148): a PERMANENTLY exhausted rake hides its auto-toggle for
//    good (a "waiting" idle would lie — the spill never refills), a merely out-of-strength
//    rake keeps an ARMED auto visible as "⏸ waiting", and the refusal reason reads inline
//    via the lock-hint — off the SAME predicates the button title uses (AC-6). Fixtures
//    derive from balance.RAKE_CAP / SATIETY_PER_ACT (source of truth), never typed counts.
