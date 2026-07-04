// Balance-tuning cockpit (F7 / D-059) — DEV-only, stripped from prod. A live slider panel over a
// CURATED set of `balance.ts` feel levers: drag mid-run, feel it immediately, export the touched
// keys as a committable artifact an agent transcribes back into canon. The HUMAN owns which numbers
// feel right (D-059); agents build the cockpit and transcribe its exports — they never move a slider
// into canon on the human's behalf.
//
// This module is imported ONLY by ui/dev.ts (the mount) and re-exported to main.ts through it, so it
// rides the existing DEV fold + sentinel graph. The override mechanism lives in core/balance.ts
// (only the declaring module can reassign its own `export let` bindings); this file is the UI +
// controller + the pure export-diff builder.

import { __setBalanceLever, __resetBalanceLevers, readBalanceLever, BALANCE_CANON } from '../core';
import { el } from './render';

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
}

/** Ph1 curated set — the W1 rice faucet + the W3 eat-vs-rest pair. Ph2 grows this to the full §2
 *  table (structured map paths included). Canon values come from BALANCE_CANON (single source), so
 *  no magic number is copied here. */
export const BALANCE_LEVERS: readonly LeverDef[] = [
  {
    path: 'RICE_PER_RAKE',
    label: 'Rice per rake',
    group: 'W1 · rice faucet',
    watch: 'W1',
    integer: true,
  },
  {
    path: 'EAT_RICE_SATIETY',
    label: 'Eat-rice satiety',
    group: 'W3 · eat vs rest',
    watch: 'W3',
    guard: 'EAT_RICE_SATIETY > SATIETY_PER_REST is the documented design lever',
    integer: true,
  },
  {
    path: 'SATIETY_PER_REST',
    label: 'Satiety per rest',
    group: 'W3 · eat vs rest',
    watch: 'W3',
    integer: true,
  },
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

/** PURE export-diff builder (unit-tested on bytes). Renders the touched-lever set as a committable
 *  markdown artifact: frontmatter + the touched table + the EXACT `old → new` balance.ts edits. The
 *  mirror + re-verify block (Ph3) is appended by the transport layer. Scalar levers only in Ph1. */
export function buildTuneArtifact(
  touched: readonly TouchedLever[],
  meta: TuneMeta,
  note?: string,
): string {
  const rows = touched
    .map((t) => `| ${t.path} | ${t.canon} | ${t.current} | ${deltaPct(t.canon, t.current)} |`)
    .join('\n');
  const applies = touched
    .map(
      (t) => `- \`export let ${t.path} = ${t.canon};\` → \`export let ${t.path} = ${t.current};\``,
    )
    .join('\n');
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
    rows,
    '',
    '## Apply — src/core/content/balance.ts (old → new, exact)',
    applies,
  ];
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
  return {
    set: (path, value) => {
      __setBalanceLever(path, value);
      fire();
    },
    read: (path) => readBalanceLever(path),
    canon,
    touched: () =>
      BALANCE_LEVERS.map((l) => ({
        path: l.path,
        canon: canon(l.path),
        current: readBalanceLever(l.path),
      })).filter((t) => t.current !== t.canon),
    reset: () => {
      __resetBalanceLevers();
      fire();
    },
    subscribe: (fn) => void subscribers.push(fn),
    exportMarkdown: (note) =>
      buildTuneArtifact(
        BALANCE_LEVERS.map((l) => ({
          path: l.path,
          canon: canon(l.path),
          current: readBalanceLever(l.path),
        })).filter((t) => t.current !== t.canon),
        meta(),
        note,
      ),
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
  opts: { onDirty?: (count: number) => void } = {},
): void {
  const { onDirty } = opts;

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

  repaintAll();
}
