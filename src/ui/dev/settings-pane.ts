// The DEV panel's SETTINGS pane (split out of dev.ts, 2026-07-13 render-split): Speed,
// Inspect, Save health, Telemetry. DEV-only, riding dev.ts's DEV fold.
import { el } from '../render';
import { findOrphanedIds, formatOrphanReport } from '../../persistence';
import { loadActionHover, saveActionHover } from '../ui-prefs';
import { mono } from './widgets';
import type { DevQa } from '../dev';

export function buildSettingsPane(opts: {
  pane: HTMLElement;
  /** The Settings tab button — the orphan sensor badges its label (`Settings (2⚠)`). */
  tab: HTMLButtonElement;
  qa: DevQa;
}): void {
  const { pane, tab, qa } = opts;

  const section = (title: string): HTMLElement => {
    const sec = el('div');
    const h = el('div', undefined, title);
    h.style.cssText = 'color:#b08d4f;font-size:11px;text-transform:uppercase;margin-bottom:.2rem;';
    sec.append(h);
    const rows = el('div');
    rows.style.cssText = 'display:flex;flex-wrap:wrap;gap:.25rem;';
    sec.append(rows);
    pane.append(sec);
    return rows;
  };

  // speed — FB-49: 1·2·4·8·16, with the ACTIVE multiplier highlighted (reuse the gold #b08d4f /
  // dark #1c1814 active idiom the tab bar + variant toggles use). Track the selected button so a
  // click marks it active and clears the rest; default the highlight to 1× (the game's start speed).
  const speed = section('Speed');
  const speedBtns = new Map<number, HTMLButtonElement>();
  const markSpeed = (active: number): void => {
    for (const [m, b] of speedBtns) {
      const on = m === active;
      b.style.background = on ? '#b08d4f' : '#3a322a';
      b.style.color = on ? '#1c1814' : '#e7d9bc';
      b.style.fontWeight = on ? '700' : 'normal';
    }
  };
  for (const m of [1, 2, 4, 8, 16]) {
    const b = mono(`${m}×`, () => {
      qa.speed(m);
      markSpeed(m);
    });
    speedBtns.set(m, b);
    speed.append(b);
  }
  markSpeed(1); // the game starts at 1×

  // FB-264 — the action hover-detail inspector: hovering any timed action button shows what it
  // WILL pay (effective yields/xp via activityForecast — AC-6) + its timing. The render-side card
  // reads body[data-dev-act-hover]; the pref survives reload (ui-prefs seam). Default OFF.
  const inspect = section('Inspect');
  let hoverOn = loadActionHover();
  const applyHover = (): void => {
    if (hoverOn) document.body.dataset.devActHover = '1';
    else delete document.body.dataset.devActHover;
    hoverBtn.textContent = `action detail: ${hoverOn ? 'on' : 'off'}`;
    hoverBtn.style.background = hoverOn ? '#b08d4f' : '#3a322a';
    hoverBtn.style.color = hoverOn ? '#1c1814' : '#e7d9bc';
  };
  const hoverBtn = mono('action detail: off', () => {
    hoverOn = !hoverOn;
    saveActionHover(hoverOn);
    applyHover();
  });
  inspect.append(hoverBtn);
  applyHover();

  // (The UI-v2 temp-toggle section lived here through the migration; RETIRED with
  // the human's PH5 certification, 2026-07-06 — attr palette locked 'temper'; the
  // open variant picks live in the Variants pane, not here.)

  // ── Save health: the orphaned-id sensor (save-format plan, step 4) ─────────────────────
  // Ids this save carries that src/ no longer defines — i.e. a content RENAME that needed a
  // migration and didn't get one. Normally EMPTY, so it earns no tab of its own and no
  // permanent real estate: it renders a single calm "matches src/" line when clean, and only
  // when something IS orphaned does it list the ids and badge the Settings tab (the Balance-tab
  // precedent) so it can't be missed by someone who isn't watching the console. TST4 — the dev
  // never has to guess whether their rename broke an old save.
  const saveHealth = section('Save health');
  const orphanLine = el('div');
  orphanLine.style.cssText =
    'flex:1 1 100%;white-space:pre-wrap;font-size:11px;line-height:1.35;color:#9c8f7a;';
  saveHealth.append(orphanLine);
  const refreshOrphans = (): void => {
    const report = findOrphanedIds(qa.state());
    const bad = report.total > 0;
    orphanLine.textContent = bad
      ? `${report.total} orphaned id(s) — this save references content src/ no longer defines. ` +
        `A rename needs a migration.\n${formatOrphanReport(report)}`
      : 'No orphaned ids — this save matches src/.';
    orphanLine.style.color = bad ? '#c8813f' : '#9c8f7a';
    tab.textContent = bad ? `Settings (${report.total}⚠)` : 'Settings';
  };
  refreshOrphans();
  tab.addEventListener('click', () => refreshOrphans());
  setInterval(() => {
    if (pane.style.display !== 'none') refreshOrphans();
  }, 1000);

  // (The whole TELEPORT block lived here until 2026-07-13, when the human ruled it out entirely —
  //  Scenarios is the one home for "put the game in state X". TST1. Three things were removed:
  //
  //   · the ADR-184 zone-announce toggle → moved to the Review tab (HR-32b), where every
  //     awaiting-a-verdict thing now lives, as a MODE surface in the SURFACES registry.
  //   · the Settings→Rung strip (one R0…R7 button per rank) → since FB-68 those buttons did not
  //     teleport at all: each LOADED that rung's `rung-RX` scenario, the exact thing the Scenarios
  //     tab exists to do. Two doors on one act. The rung-start set is no longer `hidden` from the
  //     pane, so it lists there under "Rung starts (R0–R7)", with the current rung marked.
  //   · the Jump section (`→ Phase 2`, `→ Ascend-ready`) → the same duplication one layer down:
  //     `wealthy-idler` IS Phase 2 and `pre-ascension` IS ascend-ready, both already in Scenarios.
  //     Unlike the rung buttons these two were still TRUE applyPromotion-style teleports, i.e. the
  //     incoherent end-state (no earned unlocks/resources for the destination) FB-68 complained
  //     about — so the fixtures don't just duplicate them, they're strictly better. The human's
  //     call: delete, don't repoint.
  //
  //  `__qa.jumpToPhase2` / `jumpToAscension` / `toRung` REMAIN in main.ts — they are the headless
  //  driver API (qa-playtesting.md §1) and taint the run when used. Only the PANEL doors are gone.)

  // (The Combat/Auto section — Auto: farm / Auto: monkey / Stop auto — was RETIRED here
  // (FB-300): the in-game auto-toggles are the real feature, and the headless `__qa.auto` /
  // `__qa.autoCombat` drive methods remain the QA path; the buttons earned nothing.)

  // FB-8 — Telemetry (MINIMAL by human lock 2026-07-05: one live line + drop/clear; the
  // copy/download/console.table buttons were cut — the project/telemetry/ folder drop is the
  // transport). DEV instrument panel, not a player surface → diverge-exempt (locked; the
  // Scenarios/Balance precedent). The line refreshes on a slow tick; stamped with the FB-8
  // sentinel so the strip gate can see the section rode the DEV fold.
  if (qa.telemetry) {
    const tele = section('Telemetry');
    const t = qa.telemetry;
    const line = el('div');
    line.style.cssText = 'flex:1 1 100%;color:#e7d9bc;opacity:.85;';
    line.dataset.sentinel = t.sentinel;
    const refresh = (): void => {
      const s = t.summary();
      const taint = s.taints.length > 0 ? ` · TAINTED (${s.taints.join(', ')})` : '';
      line.textContent = `${s.attendedMin} min attended (${s.activeMin} active / ${s.idleMin} idle) · now: ${s.class} · ${s.segments} seg${taint}`;
    };
    refresh();
    window.setInterval(refresh, 5000);
    tele.append(line);
    tele.append(mono('Drop report → project/telemetry/', () => t.drop()));
    tele.append(
      mono('Clear history', () => {
        if (window.confirm('Clear ALL telemetry history (every stored run)?')) t.clear();
      }),
    );
  }

  // FB-38 — New game lives ONLY in the fixed footer now (it used to be duplicated here in a
  // Settings→Game section). The footer copy (below, FB-34) is the single always-visible one.
}
