// The ESTATE trio (split out of render.ts, 2026-07-13 render-split): Works 普請 (the
// day-book page, ADR-177), Estate 家 (the house, drawn — the E1 fold-in), and the
// House-Influence standing card (ADR-055/ADR-107). Sheet renders rebuild only when their
// signature moves (TST2: idle ticks are zero-churn); the influence card is append-only
// build-once/patch (FB-81).
import {
  balance,
  ascensionAvailable,
  estateBuild,
  phaseOf,
  worksSiteZones,
  estateGrade,
  formatCoin,
  formatKMB,
  getNode,
  isUnlocked,
  stageBlurb,
  stageLabel,
  type GameState,
  type Intent,
} from '../../core';
import { el, stampAct, HOUSE_ROOMS, ESTATE_STAGE_NAMES } from '../render';
import { setText, setClass, setDisabled, setStyle, toggle } from '../reconcile';
import { FLAVOR } from '../../core/content/flavor';
import { paintSheetA, SHEET_A_W, SHEET_A_H } from '../estate-sheet/sheet-a';
import {
  estateFixtureFromState,
  estateSheetSignature,
} from '../estate-sheet/from-state';
import type { DevApi } from '../dev';

type Dispatch = (intent: Intent) => void;

export function createEstateView(ctx: {
  worksPane: HTMLElement;
  estatePane: HTMLElement;
  influence: HTMLElement;
  dispatch: Dispatch;
  dev: DevApi | undefined;
  activeTab(): string;
}): {
  renderWorks(state: GameState): void;
  renderEstate(state: GameState): void;
  renderHouseInfluence(state: GameState): void;
} {
  const { worksPane, estatePane, influence, dispatch, dev } = ctx;

  // ── incremental-render refs (append-only migration, FB-81 generalised via ui/reconcile.ts) ──
  //    Each easy surface builds its card shell ONCE (lazily on first show) and PATCHES in place
  //    after, so an idle re-render of unchanged state produces zero DOM churn (meter transitions
  //    survive, focus survives, the ~2×/s tick stops flashing). null ⇒ not yet built.
  // ADR-177 / ADR-075 — Works 普請 (the day-book page) + Estate 家 (the house, drawn)
  // rebuild ONLY when their signature moves (TST2: idle ticks are zero-churn; a
  // DEV-variant switch clears the signature so the default re-inks cleanly).
  let worksSig: string | null = null;
  let estateSig: string | null = null;
  // renderHouseInfluence refs (IA reorg — migrated to append-only, FB-81). The card shell + the
  // koku headline/grade/bar/silhouettes are built ONCE and PATCHED in place; the structural
  // locked↔live↔ascended transitions swap named sub-sections via `hidden`, never a
  // `textContent=''` teardown. `mode` records the last-built structure so an idle re-render of the
  // same mode churns nothing (the zero-idle-churn invariant, §7). The DEV variant path stays
  // wholesale (it needs a fresh container each render for the toggle) and NULLS these refs.
  let influenceRefs: {
    mode: string;
    card: HTMLElement;
    // locked teaser
    lockedBlurb: HTMLElement;
    lockedFoot: HTMLElement;
    lockedSilhouettes: HTMLElement;
    // live standing
    liveBody: HTMLElement;
    koku: HTMLElement;
    grade: HTMLElement;
    bar: HTMLElement;
    fill: HTMLElement;
    ticks: HTMLElement;
    when: HTMLElement;
    horizon: HTMLElement;
    liveSilhouettes: HTMLElement;
    foot: HTMLElement; // the post-live footer (gate / ascend CTA / risen resolution)
    ascendBtn: HTMLButtonElement;
    boon: HTMLElement;
    frontier: HTMLElement;
  } | null = null;

  function renderWorks(state: GameState): void {
    // ADR-177 Schedule A (F4) — the projects/upgrades home is the Works 普請 tab, cause-gated
    // on the works-intro naming (panel-estate's predicate). Estate 家 keeps the house itself.
    const show =
      ctx.activeTab() === 'works' && isUnlocked(state, 'panel-estate');
    toggle(worksPane, show);
    if (!show) return;
    // ADR-075 — DEV variant fall-through (B · work-site board / C · the interim ladder).
    if (
      __DEV_TOOLS__ &&
      dev &&
      dev.renderVariant('works', worksPane, state, dispatch)
    ) {
      worksSig = null; // switching back to A rebuilds the default page cleanly
      return;
    }
    // ── Default A · THE DAY-BOOK PAGE (self-picked, ships) — the works-cause fiction as
    //    chrome: each project is a ledger line. Closed entries are ruled through; the open
    //    entry carries its price, payoff, and the commissioning button; a named-but-unseen
    //    concern shows the go-and-see line; the future stays a faint unruled line (TST3).
    const build = estateBuild(state);
    const stageName =
      ESTATE_STAGE_NAMES[state.estateStage] ??
      ESTATE_STAGE_NAMES[ESTATE_STAGE_NAMES.length - 1]!;
    const carried = state.resources.coin ?? 0;
    const banked = state.banked.coin ?? 0;
    const n = build.next;
    const sig = JSON.stringify([
      state.estateStage,
      state.estateCommission,
      state.estateWorkDone,
      n?.discovery ?? 'done',
      n ? n.coinShort > 0 : false,
      n ? n.deedsShort > 0 : false,
      n?.standing ?? 0,
      n ? banked >= n.def.coinCost : false,
      n ? (state.resources.wood ?? 0) >= n.def.woodCost : false,
      __DEV_TOOLS__ && dev ? dev.storyEpoch() : 0,
    ]);
    if (sig === worksSig) return;
    worksSig = sig;
    worksPane.replaceChildren();
    const card = el('div', 'rung-card frame works-ledger');
    card.append(el('div', 'rung-now', `Works 普請 — Estate · ${stageName}`));
    const page = el('div', 'ledger-page');
    for (const row of build.rows) {
      if (row.status === 'built') {
        // a closed line: ruled through, kept — the book remembers (take-C's register).
        const line = el('div', 'ledger-line is-closed');
        line.append(
          el('span', 'ledger-rule', '〆'),
          el('span', 'ledger-name', stageLabel(row.def)),
        );
        line.append(el('span', 'ledger-note', 'closed'));
        page.append(line);
        continue;
      }
      if (row.status === 'next' && n) {
        if (state.estateCommission === n.def.stage) {
          // ADR-177 F3 — COMMISSIONED: the entry is open and the work is under way at
          // the site. The page reads the progress; the acts happen at the zone (TST3).
          const line = el('div', 'ledger-line is-open');
          line.append(
            el('span', 'ledger-rule', '普'),
            el('span', 'ledger-name', stageLabel(n.def)),
          );
          line.append(
            el(
              'span',
              'ledger-note',
              `${state.estateWorkDone} / ${n.def.workActs}`,
            ),
          );
          page.append(line);
          const body = el('div', 'ledger-entry');
          body.append(
            el(
              'div',
              'rung-hint',
              `The work stands at the site — ${worksSiteZones(n.def.stage)
                .map((z) => getNode(z)?.kanji ?? z)
                .join(' · ')}. Go and work it.`,
            ),
          );
          page.append(body);
          continue;
        }
        if (n.discovery === 'open') {
          const line = el('div', 'ledger-line is-open');
          line.append(
            el('span', 'ledger-rule', '▹'),
            el('span', 'ledger-name', stageLabel(n.def)),
          );
          line.append(el('span', 'ledger-note', formatCoin(n.def.coinCost)));
          page.append(line);
          const body = el('div', 'ledger-entry');
          body.append(el('div', 'skill-blurb', stageBlurb(n.def)));
          // the mechanical PAYOFF, read from the source-of-truth stage fields (AC-6).
          body.append(
            el(
              'div',
              'rung-hint',
              `+${n.def.yieldBonusNum}% labour output · +${n.def.satietyMaxBonus} max body`,
            ),
          );
          body.append(
            el(
              'div',
              'ledger-gauge',
              `inputs: ${formatCoin(n.def.coinCost)} · wood ${n.def.woodCost}`,
            ),
          );
          if (n.deedGate > 0) {
            body.append(
              el(
                'div',
                'ledger-gauge',
                `standing ${Math.min(n.standing, n.deedGate)} / ${n.deedGate} koku`,
              ),
            );
          }
          const btn = el('button', 'verb');
          btn.type = 'button';
          stampAct(btn, 'improve_estate');
          btn.addEventListener('click', () =>
            dispatch({ type: 'improve_estate' }),
          );
          btn.textContent = `Commission — ${stageLabel(n.def)}`;
          const woodShort = (state.resources.wood ?? 0) < n.def.woodCost;
          setDisabled(
            btn,
            carried < n.def.coinCost || woodShort || n.deedsShort > 0,
          );
          // don't lie "Needs N coin" when the coin merely sits safe in the kura (AC-6/TST4).
          btn.title = btn.disabled
            ? n.deedsShort > 0
              ? `The house's standing must reach ${n.deedGate} koku first (now ${n.standing})`
              : woodShort
                ? `Needs ${n.def.woodCost} wood — the woodlot pays in timber`
                : banked >= n.def.coinCost
                  ? 'Draw coin from the kura storehouse first'
                  : `Needs ${formatCoin(n.def.coinCost)}`
            : '';
          body.append(btn);
          page.append(body);
        } else {
          // named-but-unpriced (go and see) or nothing named yet — the chain's read (TST4);
          // both lines are FB-5 canon, live-swappable in DEV (ADR-143).
          const hintKey =
            n.discovery === 'named' ? 'worksLadderNamed' : 'worksLadderUnnamed';
          const line = el('div', `ledger-line is-${n.discovery}`);
          line.append(
            el('span', 'ledger-rule', '▹'),
            el(
              'span',
              'ledger-name is-hint',
              __DEV_TOOLS__ && dev
                ? dev.subFlavor(hintKey, FLAVOR[hintKey])
                : FLAVOR[hintKey],
            ),
          );
          page.append(line);
        }
        continue;
      }
      // a stage beyond the next — a faint unruled line; a promise, never a preview (P15/TST3).
      const line = el('div', 'ledger-line is-faint');
      line.append(
        el('span', 'ledger-rule', '　'),
        el('span', 'ledger-name', 'the works continue'),
      );
      page.append(line);
    }
    if (build.complete)
      page.append(
        el('div', 'ledger-line is-footing', 'The estate stands restored.'),
      );
    card.append(page);
    worksPane.append(card);
  }

  function renderEstate(state: GameState): void {
    // ADR-177 Schedule A — Estate 家 (R6): the house ITSELF is the tab's anchor (F5 —
    // the E1 okoshi-ezu cutaway folds in, state-driven); the influence pane shares the tab.
    const show =
      ctx.activeTab() === 'estate' && isUnlocked(state, 'tab-estate');
    toggle(estatePane, show);
    if (!show) return;
    // ADR-075 — DEV variant fall-through (B · the steward's reckoning / C · the rooms list).
    if (
      __DEV_TOOLS__ &&
      dev &&
      dev.renderVariant('estate-house', estatePane, state, dispatch)
    ) {
      estateSig = null;
      return;
    }
    // ── Default A · THE HOUSE, DRAWN (self-picked, ships) — the survey sheet as the tab's
    //    one anchor: rooms ink in as they reopen; the freshest work wears gold (H5). The
    //    paint is signature-gated (the sheet re-inks only when the house moves — TST2).
    const sig = estateSheetSignature(state);
    if (sig === estateSig) return;
    estateSig = sig;
    estatePane.replaceChildren();
    const card = el('div', 'rung-card frame estate-sheet-card');
    card.append(el('div', 'rung-now', 'Estate 家 · the house, drawn'));
    const holder = el('div', 'estate-sheet-holder');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${SHEET_A_W} ${SHEET_A_H}`);
    svg.setAttribute('class', 'estate-sheet-svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute(
      'aria-label',
      'The estate survey sheet — the house as it stands',
    );
    paintSheetA(svg, estateFixtureFromState(state));
    holder.append(svg);
    card.append(holder);
    const opened = HOUSE_ROOMS.filter((room) =>
      isUnlocked(state, room.surface),
    );
    card.append(
      el(
        'div',
        'rung-hint estate-sheet-caption',
        opened.length > 0
          ? `Reopened: ${opened.map((room) => `${room.kanji} ${room.label}`).join(' · ')}`
          : 'The inner house waits, shuttered.',
      ),
    );
    estatePane.append(card);
  }

  function silhouetteRow(): HTMLElement {
    // a pillar still to come — ADR-055: shown UNNAMED (a greyed silhouette), never spoiled. The greyed
    // ◆ ———— ghost-row already reads as "locked", so we drop the non-curated 🔒 that sat outside the
    // woodblock motif set (battery #21 color-discipline); the a11y label moves to the row so a screen
    // reader still announces it (the visual teaser itself stays aria-hidden).
    const row = el('div', 'influence-row silhouette');
    row.setAttribute('aria-label', 'A pillar yet to come (locked)');
    const name = el('span', 'influence-name');
    name.setAttribute('aria-hidden', 'true');
    const dot = el('span', 'pillar-dot locked', '◆');
    name.append(dot, document.createTextNode(' ————'));
    row.append(name);
    return row;
  }

  // shared koku-standing helpers (used by both the DEV wholesale path + the incremental patch).
  const LIVE_ARIA = "The House's koku standing";
  const LOCKED_ARIA =
    "The House's koku standing — opens once you are trusted of the house";
  function gradeWordFor(grade: ReturnType<typeof estateGrade>): string {
    // C4.7 (ADR-159) — the six-step ladder wears the classical grade kanji
    // (不可·劣·可·良·優·秀). Mechanical labels; the day-book judge's per-grade
    // LINE variety is fiction and rides the C5a wave.
    switch (grade) {
      case 'EXCELLENT':
        return 'Excellent 秀';
      case 'GREAT':
        return 'Great 優';
      case 'GOOD':
        return 'Good 良';
      case 'OK':
        return 'Fair 可';
      case 'BAD':
        return 'Poor 劣';
      case 'FAIL':
        return 'Failing 不可';
    }
  }
  // the DEV-path ascension foot (a fresh wholesale build each render). The incremental prod/test
  // path toggles the equivalent foot sub-sections in place; only the DEV path appends fresh nodes.
  function appendInfluenceFoot(card: HTMLElement, state: GameState): void {
    const bands = balance.ESTATE_BANDS;
    const est = state.influence.estate;
    if (state.tier >= 1) {
      card.append(
        el(
          'div',
          'influence-foot',
          'You are a man of the house. 家産 stands Risen — the Estate is yours to raise, no longer merely to save.',
        ),
      );
      const pts = state.character.attributePoints;
      if (pts > 0) {
        card.append(
          el(
            'div',
            'influence-when',
            `The lord's boon waits on you: ${pts} point${pts === 1 ? '' : 's'} to spend at Training 鍛錬 on the Character 己 tab.`,
          ),
        );
      }
      card.append(
        el(
          'div',
          'rung-next frontier',
          'Beyond the gate the road climbs on — to be continued.',
        ),
      );
    } else if (ascensionAvailable(state)) {
      const btn = el(
        'button',
        'verb primary ascend-cta',
        'Ascend — a man of the house',
      );
      btn.type = 'button';
      btn.addEventListener('click', () => dispatch({ type: 'ascend' }));
      card.append(btn);
    } else {
      card.append(
        el(
          'div',
          'influence-foot lock-hint',
          `The House must stand at ${formatKMB(bands.excellent)} koku to ascend (${formatKMB(est.value)}/${formatKMB(bands.excellent)} koku).`,
        ),
      );
    }
  }

  // ── the House's koku standing (ADR-055/ADR-107) — migrated to append-only (FB-81). The card shell is
  //    built ONCE and PATCHED in place; the structural locked↔live↔ascended transitions swap named
  //    sub-sections via `hidden`, never a `textContent=''` teardown. IA reorg (ADR-112): the koku IS
  //    House standing → its home is the Estate tab. The DEV variant path stays wholesale. ──
  function renderHouseInfluence(state: GameState): void {
    // IA reorg (ADR-112 §2/§8.3) — the koku (House standing) moves from Work to the Estate tab.
    const show =
      ctx.activeTab() === 'estate' &&
      isUnlocked(state, 'panel-house-influence');
    toggle(influence, show);
    if (!show) return;

    const live = phaseOf(state) === 2; // the macro engine opens at the R7 capstone (ADR-055)
    const bands = balance.ESTATE_BANDS;

    // ── DEV variant path — a fresh wholesale build each render (the toggle needs a fresh container).
    //    Nulls the incremental refs so returning to the default rebuilds the shell cleanly. ──
    if (__DEV_TOOLS__ && dev) {
      influenceRefs = null;
      influence.textContent = '';
      const card = el(
        'div',
        `influence-panel frame${live ? ' live' : ' locked'}`,
      );
      card.setAttribute(
        'aria-label',
        live
          ? "The House's koku standing"
          : "The House's koku standing — opens once you are trusted of the house",
      );
      const head = el('div', 'rung-now');
      head.append(document.createTextNode('The House’s Standing '));
      const k = el('span', 'house-influence-kanji');
      k.lang = 'ja';
      k.textContent = '石高';
      head.append(k);
      card.append(head);
      if (!live) {
        card.append(
          el(
            'div',
            'skill-blurb',
            'How a house is truly weighed. Earn the trust of the house, and its measure opens to you.',
          ),
        );
        for (let i = 0; i < 4; i++) card.append(silhouetteRow());
        card.append(
          el(
            'div',
            'influence-foot lock-hint',
            'Opens when you are Trusted of the house.',
          ),
        );
        influence.append(card);
        return;
      }
      const est = state.influence.estate;
      const grade = estateGrade(state);
      const activeRow = el('div', 'influence-row active');
      const name = el('span', 'influence-name');
      const dot = el('span', 'pillar-dot estate', '◆');
      dot.setAttribute('aria-hidden', 'true');
      name.append(dot, document.createTextNode(' The House stands at '));
      const koku = el('span', 'koku-standing', formatKMB(est.value));
      name.append(koku, document.createTextNode(' koku'));
      activeRow.append(name);
      activeRow.append(
        el(
          'span',
          `influence-grade grade-${grade.toLowerCase()}`,
          gradeWordFor(grade),
        ),
      );
      card.append(activeRow);
      if (!dev.renderVariant('influence', card, state, dispatch)) {
        const bar = el('div', 'influence-bar');
        const fill = el('span', `influence-fill grade-${grade.toLowerCase()}`);
        fill.style.width = `${Math.min(100, Math.round((est.value / bands.excellent) * 100))}%`;
        bar.append(fill);
        for (const t of [bands.good, bands.great, bands.excellent]) {
          const tick = el('span', 'influence-tick');
          tick.style.left = `${Math.round((t / bands.excellent) * 100)}%`;
          bar.append(tick);
        }
        card.append(bar);
        card.append(
          el(
            'div',
            'influence-when',
            `The season re-assesses at ${formatKMB(est.highWater)} koku.`,
          ),
        );
        card.append(
          el(
            'div',
            'influence-when koku-horizon',
            `The road runs on toward daimyō 大名 — at ${balance.DAIMYO_KOKU.toLocaleString('en-US')} koku.`,
          ),
        );
      }
      for (let i = 0; i < 3; i++) card.append(silhouetteRow());
      appendInfluenceFoot(card, state);
      influence.append(card);
      return;
    }

    // ── prod / test — build the persistent shell ONCE (FB-81), then patch/toggle in place. ──
    if (!influenceRefs) {
      const card = el('div', 'influence-panel frame');
      const head = el('div', 'rung-now');
      head.append(document.createTextNode('The House’s Standing '));
      const k = el('span', 'house-influence-kanji');
      k.lang = 'ja';
      k.textContent = '石高';
      head.append(k);
      card.append(head);

      // locked teaser sub-tree (shown pre-capstone) — the blurb + 4 silhouettes + a lock-foot.
      const lockedBlurb = el(
        'div',
        'skill-blurb',
        'How a house is truly weighed. Earn the trust of the house, and its measure opens to you.',
      );
      const lockedSilhouettes = el('div', 'influence-silhouettes');
      for (let i = 0; i < 4; i++) lockedSilhouettes.append(silhouetteRow());
      const lockedFoot = el(
        'div',
        'influence-foot lock-hint',
        'Opens when you are Trusted of the house.',
      );
      card.append(lockedBlurb, lockedSilhouettes, lockedFoot);

      // live standing sub-tree (shown at the capstone) — the koku headline, grade bar, re-assess +
      // horizon lines, 3 silhouettes, and the ascension foot (gate / CTA / risen resolution).
      const liveBody = el('div', 'influence-live');
      const activeRow = el('div', 'influence-row active');
      const name = el('span', 'influence-name');
      const dot = el('span', 'pillar-dot estate', '◆');
      dot.setAttribute('aria-hidden', 'true');
      name.append(dot, document.createTextNode(' The House stands at '));
      const koku = el('span', 'koku-standing');
      name.append(koku, document.createTextNode(' koku'));
      const grade = el('span', 'influence-grade');
      activeRow.append(name, grade);
      const bar = el('div', 'influence-bar');
      const fill = el('span', 'influence-fill');
      bar.append(fill);
      const ticks = el('span', 'influence-ticks');
      // the 3 ticks (GOOD / GREAT / EXCELLENT) are structural — built once; left% patched in place.
      for (let i = 0; i < 3; i++) ticks.append(el('span', 'influence-tick'));
      bar.append(ticks);
      const when = el('div', 'influence-when');
      const horizon = el('div', 'influence-when koku-horizon');
      const liveSilhouettes = el('div', 'influence-silhouettes');
      for (let i = 0; i < 3; i++) liveSilhouettes.append(silhouetteRow());
      // the ascension foot — three mutually-exclusive states toggled in place: the risen resolution
      // (tier≥1: foot + optional boon + frontier), the ascend CTA, or the koku gate (foot).
      const foot = el('div', 'influence-foot');
      const ascendBtn = el(
        'button',
        'verb primary ascend-cta',
        'Ascend — a man of the house',
      );
      ascendBtn.type = 'button';
      ascendBtn.addEventListener('click', () => dispatch({ type: 'ascend' }));
      const boon = el('div', 'influence-when');
      const frontier = el(
        'div',
        'rung-next frontier',
        'Beyond the gate the road climbs on — to be continued.',
      );
      liveBody.append(
        activeRow,
        bar,
        when,
        horizon,
        liveSilhouettes,
        foot,
        ascendBtn,
        boon,
        frontier,
      );
      card.append(liveBody);

      influence.append(card);
      influenceRefs = {
        mode: '',
        card,
        lockedBlurb,
        lockedFoot,
        lockedSilhouettes,
        liveBody,
        koku,
        grade,
        bar,
        fill,
        ticks,
        when,
        horizon,
        liveSilhouettes,
        foot,
        ascendBtn,
        boon,
        frontier,
      };
    }
    const r = influenceRefs;
    // structural toggle: locked teaser vs live standing (a rare transition, at the R7 capstone).
    setClass(r.card, 'live', live);
    setClass(r.card, 'locked', !live);
    if (r.card.getAttribute('aria-label') !== (live ? LIVE_ARIA : LOCKED_ARIA))
      r.card.setAttribute('aria-label', live ? LIVE_ARIA : LOCKED_ARIA);
    toggle(r.lockedBlurb, !live);
    toggle(r.lockedSilhouettes, !live);
    toggle(r.lockedFoot, !live);
    toggle(r.liveBody, live);
    if (!live) return;

    // ── Phase 2 — the House's live koku STANDING. Patch the number/grade/bar in place. ──
    const est = state.influence.estate;
    const grade = estateGrade(state);
    setText(r.koku, formatKMB(est.value));
    setText(r.grade, gradeWordFor(grade));
    if (r.grade.className !== `influence-grade grade-${grade.toLowerCase()}`)
      r.grade.className = `influence-grade grade-${grade.toLowerCase()}`;
    setStyle(
      r.fill,
      'width',
      `${Math.min(100, Math.round((est.value / bands.excellent) * 100))}%`,
    );
    if (r.fill.className !== `influence-fill grade-${grade.toLowerCase()}`)
      r.fill.className = `influence-fill grade-${grade.toLowerCase()}`;
    const tickAt = [bands.good, bands.great, bands.excellent];
    for (let i = 0; i < 3; i++) {
      setStyle(
        r.ticks.children[i] as HTMLElement,
        'left',
        `${Math.round((tickAt[i]! / bands.excellent) * 100)}%`,
      );
    }
    setText(
      r.when,
      `The season re-assesses at ${formatKMB(est.highWater)} koku.`,
    );
    setText(
      r.horizon,
      `The road runs on toward daimyō 大名 — at ${balance.DAIMYO_KOKU.toLocaleString('en-US')} koku.`,
    );

    // ── the ascension foot — three mutually-exclusive states toggled in place (ADR-049/ADR-062). ──
    const risen = state.tier >= 1;
    const canAscend = !risen && ascensionAvailable(state);
    toggle(r.ascendBtn, canAscend);
    if (risen) {
      // the AFTER of the payoff (FB-2) — the resolved risen next-state, NOT the stale gate prompt.
      toggle(r.foot, true);
      setClass(r.foot, 'lock-hint', false);
      setText(
        r.foot,
        'You are a man of the house. 家産 stands Risen — the Estate is yours to raise, no longer merely to save.',
      );
      const pts = state.character.attributePoints;
      toggle(r.boon, pts > 0);
      if (pts > 0)
        setText(
          r.boon,
          `The lord's boon waits on you: ${pts} point${pts === 1 ? '' : 's'} to spend at Training 鍛錬 on the Character 己 tab.`,
        );
      toggle(r.frontier, true);
    } else {
      toggle(r.boon, false);
      toggle(r.frontier, false);
      if (canAscend) {
        toggle(r.foot, false);
      } else {
        // the koku gate — the House must stand at EXCELLENT to ascend.
        toggle(r.foot, true);
        setClass(r.foot, 'lock-hint', true);
        setText(
          r.foot,
          `The House must stand at ${formatKMB(bands.excellent)} koku to ascend (${formatKMB(est.value)}/${formatKMB(bands.excellent)} koku).`,
        );
      }
    }
  }

  return { renderWorks, renderEstate, renderHouseInfluence };
}
