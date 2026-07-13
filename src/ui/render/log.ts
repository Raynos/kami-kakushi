// The LOG surface (split out of render.ts, 2026-07-13 render-split): "The house
// remembers" — the append-only story log, its channel filter tabs + story sub-view,
// the GBA typewriter cascade, the fleeting "Now" view, the fresh-entries divider, the
// font stepper, and the 幕-card scene grouping. The view owns its DOM (built here,
// returned as `logSection` for the shell to place) and every piece of paint state.
import { type GameState, type LogEntry, requirementById } from '../../core';
import {
  el,
  buildFreshDividerNode,
  formatLogText,
  devRederivedEntry,
  reduceMotion,
  CHANNEL_BULLET,
  QA_INSTANT_TEXT,
  TYPE_MS_PER_CHAR,
  TYPE_NEXT_BEAT_MS,
  NOW_TTL_MS,
  NOW_FADE_MS,
  NOW_KEEP_LAST,
  NOW_COLLAPSE_MS,
  FRESH_DIVIDER_TTL_MS,
  FRESH_DIVIDER_FADE_MS,
} from '../render';
import { reconcileList, resetReconcile, setClass } from '../reconcile';
import {
  appendNarration,
  computeChatKickers,
  parsePerkLine,
  buildPerkBox,
  speakerPrefixNode,
} from './log-lines';
export { inferQuoteVoice, buildPerkBox } from './log-lines';
import {
  LOG_FILTERS,
  logFilterMatches,
  storySubMatches,
  isEarnedLine,
  type LogFilter,
  type StorySub,
} from '../log-filter';
import {
  loadLogScale,
  saveLogScale,
  clampLogScale,
  LOG_SCALE_MIN,
  LOG_SCALE_MAX,
  LOG_SCALE_STEP,
} from '../ui-prefs';
import type { Sfx } from '../sfx';
import type { DevApi } from '../dev';

export function createLogView(ctx: {
  dev: DevApi | undefined;
  sfx: Sfx;
  lastState(): GameState | null;
  /** Render-loop flags owned by mount — read live, never snapshotted. */
  firstRender(): boolean;
  setFirstRender(v: boolean): void;
  introEndingRender(): boolean;
  /** The VN gate (a live scene suppresses the cascade) — owned by the intro machinery. */
  vnActive(state: GameState): boolean;
}): {
  logSection: HTMLElement;
  renderLog(state: GameState): void;
  setLogFilter(f: LogFilter, force?: boolean): void;
  getLogFilter(): LogFilter;
  /** The cold-open reveal's raw filter reset — no repaint (see applyColdOpenReveal). */
  forceStoryFilter(): void;
  seedLogSeenOnce(state: GameState): void;
  refreshLogTabs(state: GameState): void;
  paintLogFilterBar(): void;
  /** render()'s intro-release re-pin: pin the view and jump to the newest line. */
  pinToBottom(): void;
} {
  const { dev, sfx } = ctx;

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
  let typeTimer: number | undefined;
  let finishTypeNow: (() => void) | undefined;
  // FB-27 — a transient "fresh entries" divider dropped between history + new lines; self-fades.
  let freshDivider: HTMLElement | undefined;
  let freshDividerTimer: number | undefined;

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
    sfx.reward(); // the coin-tally cue — a shamisen/koto pluck (T0-M1-F4)
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
    if (ctx.firstRender()) return false;
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
    const last = ctx.lastState();
    if (last) {
      // FB-228 — opening a tab with UNREAD lines plays them like a live arrival: the READ
      // history paints instantly (as before), then the unread tail flows through the fresh
      // divider + cascade + typewriter — "as if the tab had been open the whole time".
      // (The seen high-water is captured BEFORE refreshLogTabs below marks this tab seen;
      // the >12 flush valve still protects a huge backlog. Now/all are excluded — no dots.)
      const unreadFrom = f !== 'all' && f !== 'now' ? logSeen[f] : Number.MAX_SAFE_INTEGER;
      const wasFirst = ctx.firstRender();
      ctx.setFirstRender(true);
      if (
        !ctx.vnActive(last) &&
        !reduceMotion() &&
        last.log.entries.some((e) => e.key > unreadFrom && lineVisible(e))
      ) {
        const read = last.log.entries.filter((e) => e.key <= unreadFrom);
        renderLog({ ...last, log: { ...last.log, entries: read } });
        ctx.setFirstRender(false);
        renderLog(last); // the unread tail — divider + cascade + typewriter
      } else {
        renderLog(last);
      }
      ctx.setFirstRender(wasFirst);
    }
    paintLogFilterBar();
    if (last) refreshLogTabs(last); // FB-20 — switching a tab clears its dot
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
        if (!first && ctx.lastState()) {
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
          if (!ctx.vnActive(state) && !ctx.introEndingRender()) {
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
    if ((ctx.firstRender() || didReset) && freshVisible.length > LOG_DOM_MAX)
      freshVisible = freshVisible.slice(-LOG_DOM_MAX);

    // FB-48 — while a VN scene owns the live reveal (intro OR a rung beat — ADR-110), the LOG is only the
    // historical transcript: append its lines INSTANTLY (no typewriter, no cascade) so it's ready the
    // moment the shell reveals, never making the player wait for the log to catch up to choices
    // already made. `ctx.introEndingRender()` carries the same instant path onto the single reveal render.
    const introInstant = ctx.vnActive(state) || ctx.introEndingRender();

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
      !ctx.firstRender() &&
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
    if (
      ctx.firstRender() ||
      didReset ||
      reduceMotion() ||
      freshVisible.length === 1 ||
      introInstant
    ) {
      for (const e of freshVisible) {
        // P2 — a lone STORY line still typewrites (route it through the cascade of one);
        // ctx.firstRender()/didReset/reduced-motion/intro keep the instant path (guards bail).
        if (!didReset && !introInstant && typewriterEnabled() && qualifiesForTypewriter(e)) {
          revealQueue.push(e);
          pumpReveal();
        } else {
          // FB-330 — the VN transcript backlog appends DEAD STILL (no .reveal fade, no smooth
          // glide): the log must simply BE there when the shell reveals, never visibly
          // re-scroll itself in front of the player.
          appendLine(e, !ctx.firstRender() && !reduceMotion() && !introInstant);
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

  return {
    logSection,
    renderLog,
    setLogFilter,
    getLogFilter: () => logFilter,
    forceStoryFilter: () => {
      logFilter = 'story';
    },
    seedLogSeenOnce,
    refreshLogTabs,
    paintLogFilterBar,
    pinToBottom: () => {
      logPinnedToBottom = true;
      logLines.scrollTop = logLines.scrollHeight;
    },
  };
}
