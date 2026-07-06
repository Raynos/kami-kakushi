// Balance-tuning cockpit (FB-7 / ADR-059) — DEV-only, stripped from prod. A live slider panel over a
// CURATED set of `balance.ts` feel levers: drag mid-run, feel it immediately, export the touched
// keys as a committable artifact an agent transcribes back into canon. The HUMAN owns which numbers
// feel right (ADR-059); agents build the cockpit and transcribe its exports — they never move a slider
// into canon on the human's behalf.
//
// This module is imported ONLY by ui/dev.ts (the mount) and re-exported to main.ts through it, so it
// rides the existing DEV fold + sentinel graph. The override mechanism lives in core/balance.ts
// (only the declaring module can reassign its own `export let` bindings); this file is the UI +
// controller + the pure export-diff builder.

import {
  __setBalanceLever,
  __resetBalanceLevers,
  readBalanceLever,
  BALANCE_CANON,
  balance,
  perDeedCap,
  season,
  homeRestBonus,
  type GameState,
} from '../core';
import { el } from './render';
import { CAPTURE_ENDPOINT } from './capture-format';

/** A tunable lever's cockpit metadata. `path` is the key into core's setter/reader + BALANCE_CANON;
 *  everything else is UI-only. Slider `min/max/step` are cockpit metadata, NEVER canon (§7 footnote:
 *  bounds are UI, not the sanctioned space — the numeric input accepts any value beyond the slider). */
export interface LeverDef {
  /** The cockpit path — the core setter/reader switch case + BALANCE_CANON key. */
  readonly path: string;
  /** Human label for the row. */
  readonly label: string;
  /** Group header the row renders under (watch items first — §2 order). */
  readonly group: string;
  /** Watch-item tag (W1…W4) shown inline, or undefined for a plain feel lever. */
  readonly watch?: string;
  /** A signed-invariant guard note rendered inline (e.g. the eat>rest design lever). */
  readonly guard?: string;
  /** Canon is an integer ⇒ integer slider step; else a fine 0.01 step. */
  readonly integer?: boolean;
  /** 'new-game' = read only by createInitialState/level-up math, so it applies from the next New
   *  game (the binding updates live but existing state was already derived). Undefined = live,
   *  mid-run. None of the curated set is 'new-game' (§1c), but the field keeps the class explicit. */
  readonly appliesAt?: 'new-game';
}

/** The full §2 curated lever set — the four balance-watch targets first (W1…W4), then the obvious
 *  feel levers. Canon values come from BALANCE_CANON (single source), so no magic number is copied
 *  here; slider `min/max/step` are cockpit metadata derived from canon at mount, never canon. */
export const BALANCE_LEVERS: readonly LeverDef[] = [
  // W1 · rice faucet / coin
  {
    path: 'RICE_PER_RAKE',
    label: 'Rice per rake',
    group: 'W1 · rice faucet',
    watch: 'W1',
    integer: true,
  },
  {
    path: 'SKILL_YIELD_PER_LEVEL_NUM',
    label: 'Skill yield / level (%)',
    group: 'W1 · rice faucet',
    watch: 'W1',
    integer: true,
  },
  {
    path: 'SKILL_YIELD_CAP_NUM',
    label: 'Skill yield cap (%)',
    group: 'W1 · rice faucet',
    watch: 'W1',
    integer: true,
  },
  // W2 · store-vs-sell (season price table)
  {
    path: 'RICE_SELL_PRICE_BY_SEASON.spring',
    label: 'Rice price · spring',
    group: 'W2 · store-vs-sell',
    watch: 'W2',
    integer: true,
    guard: 'spring-dearest / autumn-cheapest monotonic direction is test-asserted canon',
  },
  {
    path: 'RICE_SELL_PRICE_BY_SEASON.summer',
    label: 'Rice price · summer',
    group: 'W2 · store-vs-sell',
    watch: 'W2',
    integer: true,
  },
  {
    path: 'RICE_SELL_PRICE_BY_SEASON.autumn',
    label: 'Rice price · autumn',
    group: 'W2 · store-vs-sell',
    watch: 'W2',
    integer: true,
    guard: 'the autumn glut — must stay the cheapest season',
  },
  {
    path: 'RICE_SELL_PRICE_BY_SEASON.winter',
    label: 'Rice price · winter',
    group: 'W2 · store-vs-sell',
    watch: 'W2',
    integer: true,
  },
  // W3 · eat-rice vs rest
  {
    path: 'EAT_RICE_SATIETY',
    label: 'Eat-rice satiety',
    group: 'W3 · eat vs rest',
    watch: 'W3',
    integer: true,
    guard: 'EAT_RICE_SATIETY > SATIETY_PER_REST is the documented design lever',
  },
  {
    path: 'EAT_RICE_COST',
    label: 'Eat-rice cost (rice)',
    group: 'W3 · eat vs rest',
    watch: 'W3',
    integer: true,
  },
  {
    path: 'SATIETY_PER_REST',
    label: 'Satiety per rest',
    group: 'W3 · eat vs rest',
    watch: 'W3',
    integer: true,
  },
  // W4 · capstone pacing
  {
    path: 'ESTATE_BANDS.good',
    label: 'Estate band · Good',
    group: 'W4 · capstone pacing',
    watch: 'W4',
    integer: true,
  },
  {
    path: 'ESTATE_BANDS.great',
    label: 'Estate band · Great',
    group: 'W4 · capstone pacing',
    watch: 'W4',
    integer: true,
  },
  {
    path: 'ESTATE_BANDS.excellent',
    label: 'Estate band · Excellent (gate)',
    group: 'W4 · capstone pacing',
    watch: 'W4',
    integer: true,
  },
  {
    path: 'ESTATE_DEED_PER_ACT',
    label: 'Estate deed / act (koku)',
    group: 'W4 · capstone pacing',
    watch: 'W4',
  },
  {
    path: 'PER_DEED_CAP_NUM',
    label: 'Per-deed cap (%·Good)',
    group: 'W4 · capstone pacing',
    watch: 'W4',
    integer: true,
  },
  // Stamina / meals
  { path: 'SATIETY_PER_ACT', label: 'Satiety cost / act', group: 'Stamina / meals', integer: true },
  { path: 'STAMINA_RATE_FLOOR', label: 'Stamina rate floor', group: 'Stamina / meals' },
  { path: 'STAMINA_FLAT_ABOVE', label: 'Stamina flat-above', group: 'Stamina / meals' },
  { path: 'COOK_SANSAI_COST', label: 'Cook sansai cost', group: 'Stamina / meals', integer: true },
  { path: 'COOK_HP_RESTORE', label: 'Cook HP restore', group: 'Stamina / meals', integer: true },
  // Rung pacing (threshold levers must carry the ranks.ts meterThreshold mirror in the export)
  { path: 'RUNG_POINTS_PER_ACT', label: 'Rung points / act', group: 'Rung pacing', integer: true },
  {
    path: 'RUNG_METER_THRESHOLDS.R0',
    label: 'Rung meter · R0',
    group: 'Rung pacing',
    integer: true,
    guard: 'ranks.ts meterThreshold mirror (verify-content 1:1)',
  },
  {
    path: 'RUNG_METER_THRESHOLDS.R1',
    label: 'Rung meter · R1',
    group: 'Rung pacing',
    integer: true,
    guard: 'ranks.ts meterThreshold mirror (verify-content 1:1)',
  },
  {
    path: 'RUNG_METER_THRESHOLDS.R2',
    label: 'Rung meter · R2',
    group: 'Rung pacing',
    integer: true,
    guard: 'ranks.ts meterThreshold mirror (verify-content 1:1)',
  },
  {
    path: 'RUNG_METER_THRESHOLDS.R3',
    label: 'Rung meter · R3',
    group: 'Rung pacing',
    integer: true,
    guard: 'ranks.ts meterThreshold mirror (verify-content 1:1)',
  },
  {
    path: 'RUNG_METER_THRESHOLDS.R4',
    label: 'Rung meter · R4',
    group: 'Rung pacing',
    integer: true,
    guard: 'ranks.ts meterThreshold mirror (verify-content 1:1)',
  },
  {
    path: 'RUNG_METER_THRESHOLDS.R5',
    label: 'Rung meter · R5',
    group: 'Rung pacing',
    integer: true,
    guard: 'ranks.ts meterThreshold mirror (verify-content 1:1)',
  },
  {
    path: 'RUNG_METER_THRESHOLDS.R6',
    label: 'Rung meter · R6',
    group: 'Rung pacing',
    integer: true,
    guard: 'ranks.ts meterThreshold mirror (verify-content 1:1)',
  },
  {
    path: 'RUNG_METER_THRESHOLDS.R7',
    label: 'Rung meter · R7 (capstone)',
    group: 'Rung pacing',
    integer: true,
    guard: 'ranks.ts meterThreshold mirror (verify-content 1:1)',
  },
  // Sinks / upkeep
  { path: 'REPAIR_COIN_COST', label: 'Repair coin cost', group: 'Sinks / upkeep', integer: true },
  { path: 'REPAIR_WOOD_COST', label: 'Repair wood cost', group: 'Sinks / upkeep', integer: true },
  // Combat feel
  { path: 'STANCE_MODS.jodan.atkMult', label: 'Jōdan atk ×', group: 'Combat feel' },
  { path: 'STANCE_MODS.jodan.takenMult', label: 'Jōdan taken ×', group: 'Combat feel' },
  { path: 'STANCE_MODS.gedan.atkMult', label: 'Gedan atk ×', group: 'Combat feel' },
  { path: 'STANCE_MODS.gedan.takenMult', label: 'Gedan taken ×', group: 'Combat feel' },
  { path: 'LOSS_COIN_FRAC', label: 'Loss · coin frac', group: 'Combat feel' },
  { path: 'LOSS_MATERIAL_FRAC', label: 'Loss · material frac', group: 'Combat feel' },
  { path: 'AUTO_RETREAT_FRAC', label: 'Auto-retreat HP frac', group: 'Combat feel' },
];

/** One touched lever: its canon and current (overridden) value. */
export interface TouchedLever {
  readonly path: string;
  readonly canon: number;
  readonly current: number;
}

/** The dynamic bits of the export artifact the browser supplies (seed/clock/build stamp). Passed as
 *  data so the artifact builder stays a PURE, unit-testable function (no Date.now / no globals). */
export interface TuneMeta {
  /** Build stamp string, e.g. "v0.3.4 (abc1234, 2026-07-03)". */
  readonly build: string;
  readonly seed: number;
  readonly clock: { readonly day: number; readonly tick: number };
  /** ISO timestamp of the export (the browser passes `new Date().toISOString()`). */
  readonly capturedAt: string;
}

/** The cockpit controller — the shared state behind BOTH the panel UI and `__qa.balance` (headless).
 *  Touched-ness is DERIVED (live read ≠ canon), so there is no separate dirty-set to drift. */
export interface BalanceCockpit {
  /** Override a lever live; fires onChange so the app re-renders (live tooltips update). */
  set(path: string, value: number): void;
  /** The lever's current (possibly overridden) value. */
  read(path: string): number;
  /** The lever's canon (module-init) value. */
  canon(path: string): number;
  /** Every lever whose current value differs from canon. */
  touched(): TouchedLever[];
  /** Reset every lever to canon; fires onChange. */
  reset(): void;
  /** Render the committable tune artifact for the current touched set (empty-safe). */
  exportMarkdown(note?: string): string;
  /** The full transport payload (artifact + filename stamp + machine JSON) for the inbox POST. */
  exportPayload(note?: string): TunePayload;
  /** Apply any `?bal.<path>=<value>` URL params (FB-5-survival + shareable tune links). Ignores stale/
   *  unknown paths. Fires onChange once if anything applied. */
  hydrate(): void;
  /** Subscribe to override changes (the panel repaints its rows) — so ANY set/reset, whether from a
   *  slider, `__qa.balance.set`, or URL hydration, keeps the panel display truthful (never stale). */
  subscribe(fn: () => void): void;
  readonly levers: readonly LeverDef[];
}

/** Percent-delta of a tuned value vs canon, as a signed string ("+20%", "−33%", "0%"). */
function deltaPct(canon: number, current: number): string {
  if (canon === 0) return current === 0 ? '0%' : '—';
  const pct = Math.round(((current - canon) / canon) * 100);
  const sign = pct > 0 ? '+' : pct < 0 ? '−' : '';
  return `${sign}${Math.abs(pct)}%`;
}

/** Build the `?bal.*=…` query string for a touched set (the reproducible session URL — Ph2 wires the
 *  live hydration; the artifact carries it from Ph1 so a tune is always replayable). */
function balQuery(touched: readonly TouchedLever[]): string {
  if (touched.length === 0) return '/';
  return '/?' + touched.map((t) => `bal.${t.path}=${t.current}`).join('&');
}

/** The registered levers whose current (live) value differs from canon — the single derivation the
 *  controller's touched()/exportMarkdown/exportPayload all share (no dirty-set to drift). */
function computeTouched(): TouchedLever[] {
  return BALANCE_LEVERS.map((l) => ({
    path: l.path,
    canon: BALANCE_CANON[l.path] ?? readBalanceLever(l.path),
    current: readBalanceLever(l.path),
  })).filter((t) => t.current !== t.canon);
}

/** The transport payload for a tune export: the artifact markdown + a filename stamp + the
 *  machine-readable sidecar JSON. Shaped to ride the FB-3 playtest-inbox endpoint verbatim (§6b). */
export interface TunePayload {
  /** Filename stamp / inbox session id (SESSION_RE-safe — colons stripped from the ISO stamp). */
  readonly session: string;
  /** The committable artifact markdown (the `.md` the agent transcribes). */
  readonly markdown: string;
  /** Sidecar basename (`<stamp>.json`). */
  readonly metadataName: string;
  /** Machine-readable tune JSON (kind + build + touched levers). */
  readonly metadata: string;
}

/** The exact `old → new` edit line for one touched lever. A SCALAR lever is an `export let` binding;
 *  a STRUCTURED path (dotted) is a field of a map/object literal, so it names the field to edit. */
function applyLine(t: TouchedLever): string {
  if (t.path.includes('.')) {
    return `- \`${t.path}\`: ${t.canon} → ${t.current}  (edit the field in the object literal in src/core/content/balance.ts)`;
  }
  return `- \`export let ${t.path} = ${t.canon};\` → \`export let ${t.path} = ${t.current};\``;
}

/** PURE export-diff builder (unit-tested on bytes). Renders the touched-lever set as a committable
 *  markdown artifact: frontmatter + the touched table + the EXACT `old → new` balance.ts edits + the
 *  mirror & re-verify block the applying agent runs. Scalars emit an `export let` line; structured
 *  map paths name the field. Empty-safe (no touched levers → a "no changes" artifact). */
export function buildTuneArtifact(
  touched: readonly TouchedLever[],
  meta: TuneMeta,
  note?: string,
): string {
  const rows = touched
    .map((t) => `| ${t.path} | ${t.canon} | ${t.current} | ${deltaPct(t.canon, t.current)} |`)
    .join('\n');
  const applies = touched.map(applyLine).join('\n');
  const touchesRungThreshold = touched.some((t) => t.path.startsWith('RUNG_METER_THRESHOLDS.'));
  const lines = [
    '---',
    'kind: balance-tune',
    `captured_at: ${meta.capturedAt}`,
    `build: ${meta.build}`,
    `seed: ${meta.seed}`,
    `clock: { day: ${meta.clock.day}, tick: ${meta.clock.tick} }`,
    `session_url: ${balQuery(touched)}`,
    '---',
    '## Touched levers',
    '| path | canon | tuned | Δ |',
    '|---|---|---|---|',
    rows || '| (none) | | | |',
    '',
    '## Apply — src/core/content/balance.ts (old → new, exact)',
    applies || '- (no levers touched)',
    '',
    '## Mirrors & re-verify',
  ];
  if (touchesRungThreshold) {
    lines.push(
      '- a RUNG_METER_THRESHOLDS.* lever moved — update the matching `meterThreshold` in',
      '  src/core/content/ranks.ts (verify-content enforces the 1:1 mirror).',
    );
  }
  lines.push(
    '- run: `pnpm run gen:docs && pnpm run verify` (pacing:check is in verify).',
    '- balance-sim gate: `pnpm run verify:balance && pnpm run balance:report` — this diff is',
    '  exactly the value change that stales its fingerprint; commit the regenerated report.',
  );
  if (note && note.trim().length > 0) {
    lines.push('', '## Note', note.trim());
  }
  return lines.join('\n') + '\n';
}

/** Create the cockpit controller. `onChange` is the app re-render (so a live override refreshes the
 *  UI + interpolated tooltips); `meta` supplies the export header from live state at export time. */
export function createBalanceCockpit(opts: {
  onChange?: () => void;
  meta: () => TuneMeta;
}): BalanceCockpit {
  const { onChange, meta } = opts;
  const subscribers: (() => void)[] = [];
  // onChange = the app re-render (live tooltips); subscribers = the panel row repaint. Both fire on
  // every set/reset so a headless `__qa.balance.set` updates the panel display too, not just a slider.
  const fire = (): void => {
    onChange?.();
    for (const s of subscribers) s();
  };
  const canon = (path: string): number => BALANCE_CANON[path] ?? readBalanceLever(path);

  // ── URL persistence (FB-18 variant pattern): each touched lever mirrors to `?bal.<path>=<value>`;
  //    the param is DROPPED when the lever returns to canon (a clean state keeps a clean URL). Legible
  //    + shareable + dies with the tab — never a sticky localStorage retune (the ADR-059 silent-retune
  //    failure). Inert under vitest (jsdom shares location across a file) and when there is no URL. ──
  const urlOn =
    typeof location !== 'undefined' &&
    typeof history !== 'undefined' &&
    import.meta.env.MODE !== 'test';
  const mirror = (path: string, value: number): void => {
    if (!urlOn) return;
    const params = new URLSearchParams(location.search);
    const key = `bal.${path}`;
    if (value === canon(path)) params.delete(key);
    else params.set(key, String(value));
    const qs = params.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  };
  const clearUrl = (): void => {
    if (!urlOn) return;
    const params = new URLSearchParams(location.search);
    // collect-then-delete (never mutate while iterating .keys()).
    const balKeys: string[] = [];
    for (const k of params.keys()) if (k.startsWith('bal.')) balKeys.push(k);
    for (const k of balKeys) params.delete(k);
    const qs = params.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  };

  return {
    set: (path, value) => {
      __setBalanceLever(path, value);
      mirror(path, value);
      fire();
    },
    read: (path) => readBalanceLever(path),
    canon,
    touched: () => computeTouched(),
    reset: () => {
      __resetBalanceLevers();
      clearUrl();
      fire();
    },
    hydrate: () => {
      if (!urlOn) return;
      const params = new URLSearchParams(location.search);
      const known = new Set(BALANCE_LEVERS.map((l) => l.path));
      let any = false;
      for (const [k, v] of params) {
        if (!k.startsWith('bal.')) continue;
        const path = k.slice(4);
        if (!known.has(path)) continue; // stale / typo param — ignore (guard, like the variant hydrate)
        const n = Number(v);
        if (!Number.isFinite(n)) continue;
        __setBalanceLever(path, n);
        any = true;
      }
      if (any) fire();
    },
    subscribe: (fn) => void subscribers.push(fn),
    exportMarkdown: (note) => buildTuneArtifact(computeTouched(), meta(), note),
    exportPayload: (note) => {
      const m = meta();
      const touched = computeTouched();
      // colons are illegal in the inbox SESSION_RE — strip them from the ISO stamp.
      const stamp = `${m.capturedAt.replace(/:/g, '-')}-balance-tune`;
      return {
        session: stamp,
        markdown: buildTuneArtifact(touched, m, note),
        metadataName: `${stamp}.json`,
        metadata: JSON.stringify(
          { kind: 'balance-tune', build: m.build, seed: m.seed, clock: m.clock, touched },
          null,
          2,
        ),
      };
    },
    levers: BALANCE_LEVERS,
  };
}

// ── the panel UI — the Balance sub-tab (§4). Same monospace DEV idiom as the rest of the panel. ──

/** Mount the Balance cockpit into its sub-tab pane. Rows group under §2 headers (watch items first);
 *  each row is label + range slider + numeric input + `canon → current (Δ%)` readout + guard/watch
 *  tags + a per-lever ↺. `onDirty` reports the touched count so the tab label can badge it. */
export function mountBalanceCockpit(
  pane: HTMLElement,
  cockpit: BalanceCockpit,
  opts: {
    onDirty?: (count: number) => void;
    getState?: () => GameState;
    /** Injectable POST (tests) — defaults to fetch. Returns whether the inbox write succeeded. */
    post?: (url: string, body: string) => Promise<boolean>;
    doc?: Document;
  } = {},
): void {
  const { onDirty, getState } = opts;
  const doc = opts.doc ?? document;
  const post =
    opts.post ??
    (async (url: string, body: string): Promise<boolean> => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body,
        });
        return res.ok;
      } catch {
        return false;
      }
    });

  // a footnote: slider bounds are UI metadata, not sanctioned canon (§7 open question 7).
  const foot = el(
    'div',
    undefined,
    'Slider bounds are UI, not canon — the numeric input takes any value.',
  );
  foot.style.cssText = 'color:#7a6c59;font-size:10px;margin-bottom:.3rem;';
  pane.append(foot);

  // per-lever repaint hooks, so a reset / any set repaints every row's readout + inputs. Subscribed
  // to the cockpit below, so a headless `__qa.balance.set` / URL hydration repaints the panel too.
  const repainters: (() => void)[] = [];
  const repaintAll = (): void => {
    for (const r of repainters) r();
    onDirty?.(cockpit.touched().length);
  };
  cockpit.subscribe(repaintAll);

  // ── §5 live feedback — cheap, selector-derived, recomputed on EVERY override. Explicitly NOT a
  //    simulation: pure arithmetic over the same selectors the game uses, reading the LIVE (overridden)
  //    balance values, so a dragged band visibly moves the capstone ETA. The authoritative after-check
  //    stays in node (the export's re-verify block). Absent when no live state is threaded (tests). ──
  if (getState) {
    const box = el('div');
    box.style.cssText =
      'border:1px solid #3a322a;border-radius:3px;padding:.3rem .4rem;margin-bottom:.4rem;display:flex;flex-direction:column;gap:.15rem;';
    const title = el('div', undefined, 'Live feel — selector estimate, not a sim');
    title.style.cssText = 'color:#b08d4f;font-size:10px;text-transform:uppercase;';
    box.append(title);
    const lines = [el('div'), el('div'), el('div'), el('div')];
    for (const l of lines) {
      l.style.cssText = 'color:#c9b79a;font-size:10px;line-height:1.35;';
      box.append(l);
    }
    pane.append(box);

    // acts → wall-time using the exact AUTO_REPEAT_MS cadence (the walkPacing wall-time model).
    const fmtMin = (acts: number): string => {
      const min = (acts * balance.AUTO_REPEAT_MS) / 60000;
      return min < 1 ? `${Math.round(min * 60)}s` : `${min.toFixed(1)} min`;
    };
    const paintReadouts = (): void => {
      const s = getState();
      // 1 · next-rung ETA
      const remain = Math.max(0, balance.rungThreshold(s.rung) - s.rungMeter);
      const perAct = balance.RUNG_POINTS_PER_ACT;
      const acts1 = perAct > 0 ? Math.ceil(remain / perAct) : 0;
      lines[0]!.textContent = `Next rung ${s.rung}: ${acts1} acts ≈ ${fmtMin(acts1)}`;
      // 2 · capstone ETA (W4) — Estate value → EXCELLENT at the (capped) deed-per-act rate
      const deed = Math.min(balance.ESTATE_DEED_PER_ACT, perDeedCap());
      const gap = Math.max(0, balance.ESTATE_BANDS.excellent - s.influence.estate.value);
      const acts2 = deed > 0 ? Math.ceil(gap / deed) : 0;
      lines[1]!.textContent = `Capstone (Excellent ${balance.ESTATE_BANDS.excellent}): ${acts2} acts ≈ ${fmtMin(acts2)}`;
      // 3 · eat-vs-rest verdict (W3)
      const seasonNow = season(s);
      const coinWorth = balance.EAT_RICE_COST * balance.riceSellPrice(seasonNow);
      const restBody = balance.SATIETY_PER_REST + homeRestBonus(s);
      lines[2]!.textContent = `Eat +${balance.EAT_RICE_SATIETY} body / ${balance.EAT_RICE_COST} rice (≈${coinWorth} coin, ${seasonNow}) vs rest +${restBody} free`;
      // 4 · rice→coin flow (W1/W2)
      const price = balance.riceSellPrice(seasonNow);
      const spring = balance.riceSellPrice('spring');
      const autumn = balance.riceSellPrice('autumn');
      lines[3]!.textContent = `Rice→coin: ${balance.RICE_PER_RAKE}/rake × ${price} = ${balance.RICE_PER_RAKE * price} coin/act (spring:autumn ${spring}:${autumn})`;
    };
    repainters.push(paintReadouts);
  }

  // group the levers, preserving registry order (watch items first).
  const groups: string[] = [];
  for (const l of cockpit.levers) if (!groups.includes(l.group)) groups.push(l.group);

  for (const group of groups) {
    const sec = el('div');
    sec.style.cssText = 'margin-bottom:.5rem;';
    const h = el('div', undefined, group);
    h.style.cssText = 'color:#b08d4f;font-size:11px;text-transform:uppercase;margin-bottom:.25rem;';
    sec.append(h);

    for (const lever of cockpit.levers.filter((l) => l.group === group)) {
      const canon = cockpit.canon(lever.path);
      const step = lever.integer ? '1' : '0.01';
      // slider bounds: canon × [¼, 4] (metadata only), min 0. A zero-canon lever gets a 0..1 span.
      const lo = canon === 0 ? 0 : Math.min(canon * 0.25, canon * 4);
      const hi = canon === 0 ? 1 : Math.max(canon * 0.25, canon * 4);

      const row = el('div');
      row.dataset.lever = lever.path;
      row.style.cssText =
        'display:flex;flex-direction:column;gap:.15rem;padding:.28rem 0;border-top:1px solid #2a251f;';

      const top = el('div');
      top.style.cssText = 'display:flex;align-items:baseline;gap:.4rem;';
      const label = el('span', undefined, lever.label);
      label.style.cssText = 'color:#e7d9bc;';
      top.append(label);
      if (lever.watch) {
        const tag = el('span', undefined, lever.watch);
        tag.style.cssText =
          'color:#1c1814;background:#b08d4f;border-radius:2px;padding:0 .25rem;font-size:10px;font-weight:700;';
        top.append(tag);
      }
      const readout = el('span', undefined, '');
      readout.dataset.role = 'readout';
      readout.style.cssText = 'margin-left:auto;color:#9b8e78;font-variant-numeric:tabular-nums;';
      top.append(readout);
      row.append(top);

      const controls = el('div');
      controls.style.cssText = 'display:flex;align-items:center;gap:.4rem;';
      const slider = el('input') as HTMLInputElement;
      slider.type = 'range';
      slider.min = String(lo);
      slider.max = String(hi);
      slider.step = step;
      slider.style.cssText = 'flex:1;min-width:0;accent-color:#b08d4f;';
      const num = el('input') as HTMLInputElement;
      num.type = 'number';
      num.step = step;
      num.style.cssText =
        'width:4.5rem;background:#26221e;color:#e7d9bc;border:1px solid #7a6c59;border-radius:3px;padding:.1rem .3rem;font:inherit;';
      const resetOne = el('button', undefined, '↺') as HTMLButtonElement;
      resetOne.type = 'button';
      resetOne.title = `Reset ${lever.label} to canon (${canon})`;
      resetOne.style.cssText =
        'background:#3a322a;color:#e7d9bc;border:1px solid #7a6c59;border-radius:3px;padding:.1rem .4rem;font:inherit;cursor:pointer;';
      controls.append(slider, num, resetOne);
      row.append(controls);

      if (lever.guard) {
        const g = el('div', undefined, `guard · ${lever.guard}`);
        g.style.cssText = 'color:#7a6c59;font-size:10px;';
        row.append(g);
      }

      const paint = (): void => {
        const cur = cockpit.read(lever.path);
        const touched = cur !== canon;
        readout.textContent = `${canon} → ${cur} (${deltaPct(canon, cur)})`;
        readout.style.color = touched ? '#d9a441' : '#9b8e78';
        readout.style.fontWeight = touched ? '700' : 'normal';
        slider.value = String(cur);
        num.value = String(cur);
      };
      repainters.push(paint);

      // cockpit.set fires the controller's onChange (app re-render) + notifies the panel repaint via
      // the subscription above — so the row handlers just set; no manual repaint/rerender needed.
      const apply = (raw: string): void => {
        const v = lever.integer ? Math.round(Number(raw)) : Number(raw);
        if (!Number.isFinite(v)) return;
        cockpit.set(lever.path, v);
      };
      slider.addEventListener('input', () => apply(slider.value));
      num.addEventListener('change', () => apply(num.value));
      resetOne.addEventListener('click', () => cockpit.set(lever.path, canon));

      paint();
      sec.append(row);
    }
    pane.append(sec);
  }

  // Reset-all-to-canon (Ph2 also clears the bal.* URL params).
  const resetAll = el('button', undefined, 'Reset all to canon') as HTMLButtonElement;
  resetAll.type = 'button';
  resetAll.style.cssText =
    'margin-top:.3rem;background:#3a322a;color:#e7d9bc;border:1px solid #7a6c59;border-radius:3px;padding:.2rem .5rem;font:inherit;cursor:pointer;font-weight:700;';
  resetAll.addEventListener('click', () => cockpit.reset());
  pane.append(resetAll);

  // ── §6 export — build the committable artifact, POST it to the FB-3 playtest-inbox endpoint
  //    (reused verbatim; this ships NO handler of its own), and fall back to clipboard + a file
  //    download if the dev-server endpoint is unreachable (a tune is a page of text, so the
  //    clipboard is a legitimate fallback here). The HUMAN exports; an agent transcribes (ADR-059). ──
  const exportWrap = el('div');
  exportWrap.style.cssText =
    'margin-top:.45rem;padding-top:.35rem;border-top:1px solid #3a322a;display:flex;flex-direction:column;gap:.25rem;';
  const noteInput = el('input') as HTMLInputElement;
  noteInput.type = 'text';
  noteInput.placeholder = 'optional note — why this tune…';
  noteInput.style.cssText =
    'background:#26221e;color:#e7d9bc;border:1px solid #7a6c59;border-radius:3px;padding:.15rem .35rem;font:inherit;font-size:11px;';
  const exportBtn = el('button', undefined, 'Export tune → inbox') as HTMLButtonElement;
  exportBtn.type = 'button';
  exportBtn.style.cssText =
    'background:#b08d4f;color:#1c1814;border:1px solid #7a6c59;border-radius:3px;padding:.22rem .5rem;font:inherit;cursor:pointer;font-weight:700;';
  const status = el('div', undefined, '');
  status.style.cssText = 'color:#9b8e78;font-size:10px;min-height:1.2em;';
  exportWrap.append(noteInput, exportBtn, status);
  pane.append(exportWrap);

  const downloadFallback = (filename: string, markdown: string): void => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = doc.createElement('a');
    a.href = url;
    a.download = filename;
    doc.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const doExport = async (): Promise<void> => {
    const payload = cockpit.exportPayload(noteInput.value);
    // shape the FB-3 CaptureBody: the whole artifact rides in `header` (the file is always new — a
    // unique session per export), `entry` empty; the machine JSON is the metadata sidecar.
    const body = JSON.stringify({
      session: payload.session,
      header: payload.markdown,
      entry: '',
      metadataName: payload.metadataName,
      metadata: payload.metadata,
    });
    status.textContent = 'exporting…';
    const ok = await post(CAPTURE_ENDPOINT, body);
    if (ok) {
      status.textContent = `tune → inbox: ${payload.session}.md`;
    } else {
      try {
        await navigator.clipboard?.writeText(payload.markdown);
      } catch {
        /* clipboard denied — the download below still delivers the bytes */
      }
      downloadFallback(`${payload.session}.md`, payload.markdown);
      status.textContent = 'inbox unreachable — copied to clipboard + downloaded';
    }
  };
  exportBtn.addEventListener('click', () => void doExport());
  // disable export when nothing is touched (a clean run has nothing to export).
  repainters.push(() => {
    const clean = cockpit.touched().length === 0;
    exportBtn.disabled = clean;
    exportBtn.style.opacity = clean ? '.5' : '1';
    exportBtn.style.cursor = clean ? 'not-allowed' : 'pointer';
  });

  repaintAll();
}
