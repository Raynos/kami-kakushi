// The ACTIONS surface (split out of render.ts, 2026-07-13 render-split): the Work-tab
// hero — the zone banner, the node's labour rows, the place strip (night round / day
// wage / sited works / sickroom mend), and the meta verbs. Build-once/patch (FB-81).
import {
  activityForecast,
  AREAS,
  availableLabours,
  canAffordAct,
  canRestSickroom,
  canTreat,
  canWorkProject,
  DAY_WAGE_MON,
  ESTATE_STAGES,
  getMob,
  isWaged,
  MAP_NODE_IDS,
  nightRoundById,
  nodeSeasonalBlurb,
  OUT_OF_STRENGTH_REASON,
  rakeExhausted,
  restSickroomForecast,
  stageLabel,
  treatForecast,
  availableActions,
  balance,
  getNode,
  hasFlag,
  isUnlocked,
  restQuality,
  restRefill,
  season,
  sleepForecast,
  type GameState,
  type Intent,
  type LabourOption,
} from '../../core';
import {
  el,
  stampAct,
  META_LABELS,
  AUTO_PAUSED_LABEL,
  AUTO_PAUSED_REASON,
  rakeCount,
  RAKE_AUTO_REVEAL_COUNT,
} from '../render';
import { RAKE_DONE_REASON } from '../../core/content/coldOpen';
import {
  reconcileList,
  setText,
  setClass,
  setDisabled,
  setTitle,
  toggle,
} from '../reconcile';
import type { DevApi } from '../dev';

type Dispatch = (intent: Intent) => void;

export function createActionsView(ctx: {
  pane: HTMLElement;
  zoneBanner: HTMLElement;
  zoneSeal: HTMLElement;
  zoneName: HTMLElement;
  zoneLine: HTMLElement;
  dispatch: Dispatch;
  dev: DevApi | undefined;
  activeTab(): string;
  lastState(): GameState | null;
  isPaused(): boolean;
}): { renderActions(state: GameState): void } {
  const {
    pane: actions,
    zoneBanner,
    zoneSeal,
    zoneName,
    zoneLine,
    dispatch,
    dev,
  } = ctx;

  // ── Phase 2 (FB-81) — the two big flash offenders go incremental. `actions` (the Work hero, rebuilt
  //    ~2×/s) and `combatPane` (a 6-block composite) are split into named sub-containers built ONCE;
  //    each keyed section is a reconcileList, each per-tick bit is patched in place. `null` ⇒ not
  //    yet built. metaRow/areaGroups/watchList/craftHost are their own flex-gap sub-containers (see
  //    the `.actions-group`/`.combat-group` CSS) so wrapping doesn't collapse the parent's gap;
  //    they toggle `hidden` when empty so an empty section leaves no phantom flex-gap (FB-72).
  let actionsRefs: {
    metaRow: HTMLElement;
    // storywave G4.9 — the place strip: the night-round post + the day-wage board.
    placeStrip: HTMLElement;
    nightRow: HTMLElement;
    nightBtn: HTMLButtonElement;
    nightBlurb: HTMLElement;
    wageRow: HTMLElement;
    wageBtn: HTMLButtonElement;
    // ADR-177 F3 — the sited works verb: work the commissioned project at its zone.
    worksRow: HTMLElement;
    worksBtn: HTMLButtonElement;
    // ADR-164/ADR-197 — the sickroom mend rows: paid treat (mon-only) + the free pallet day.
    treatRow: HTMLElement;
    treatBtn: HTMLButtonElement;
    restSickRow: HTMLElement;
    restSickBtn: HTMLButtonElement;
    areaGroups: HTMLElement;
    noWork: HTMLElement;
    // (FB-343/FB-369 — cook + eat-rice left for the Character Body card; see characterBodyRefs.)
  } | null = null;

  // build ONE labour row (verb + auto-toggle + lock-hint, all present); patch toggles which show +
  // the disabled/on state in place. The auto-toggle NODE survives every re-render (FB-81) so the
  // button the player is watching never loses focus / re-creates mid-auto-run.
  function buildLabourRow(o: LabourOption): HTMLElement {
    const row = el('div', 'labour-row');
    const btn = el('button', 'verb', o.activity.label);
    btn.type = 'button';
    stampAct(btn, 'do_activity', { activityId: o.activity.id });
    btn.addEventListener('click', () =>
      dispatch({ type: 'do_activity', activityId: o.activity.id }),
    );
    const auto = el('button', 'auto-toggle');
    auto.type = 'button';
    auto.addEventListener('click', () => {
      const on = ctx.lastState()?.autoActivity === o.activity.id;
      dispatch({ type: 'set_auto', activityId: on ? null : o.activity.id });
    });
    const lock = el('span', 'lock-hint');
    row.append(btn, auto, lock);
    return row;
  }
  // FB-346 — every action button says on hover what it needs and produces (ONE line, from the
  // SAME selectors/constants the reducer pays — AC-6, like the cook/eat titles). Ad-hoc titles
  // on two buttons read as an inconsistency ("this button has alt text but the others don't").
  function labourTitle(state: GameState, o: LabourOption): string {
    const f = activityForecast(state, o.activity);
    const gains = Object.entries(f.gained)
      .map(([res, n]) => `+${n} ${res === 'rice' ? 'shō (kura)' : res}`)
      .join(' · ');
    return `${gains ? `${gains} · ` : ''}+${f.xp} ${o.activity.skill} xp · −${o.activity.satietyCost} body`;
  }

  function patchLabourRow(
    row: HTMLElement,
    o: LabourOption,
    state: GameState,
  ): void {
    const btn = row.children[0] as HTMLButtonElement;
    const auto = row.children[1] as HTMLButtonElement;
    const lock = row.children[2] as HTMLElement;
    setDisabled(btn, !o.available);
    // the disabled reason wins; an available act reads its cost/effect line (FB-346).
    const btnTitle =
      !o.available && o.reason ? o.reason : labourTitle(state, o);
    if (btn.title !== btnTitle) btn.title = btnTitle;
    if (o.available) {
      toggle(auto, true);
      toggle(lock, false);
      const on = state.autoActivity === o.activity.id;
      const paused = on && ctx.isPaused();
      setClass(auto, 'on', on);
      setClass(auto, 'waiting', paused);
      setText(auto, on ? (paused ? AUTO_PAUSED_LABEL : '■ stop') : '▶ auto');
      setTitle(auto, paused ? AUTO_PAUSED_REASON : '');
      const pressed = String(on);
      if (auto.getAttribute('aria-pressed') !== pressed)
        auto.setAttribute('aria-pressed', pressed);
    } else {
      // ADR-148 — an ARMED auto never vanishes with its activity: it visibly idles
      // ("pause, resume when legal") and re-fires via the heartbeat once legal again.
      const on = state.autoActivity === o.activity.id;
      toggle(auto, on);
      if (on) {
        setClass(auto, 'on', true);
        setClass(auto, 'waiting', true);
        setText(auto, '⏸ waiting');
        if (o.reason && auto.title !== o.reason) auto.title = o.reason;
      }
      toggle(lock, !!o.reason);
      if (o.reason) setText(lock, o.reason);
    }
  }

  function renderActions(state: GameState): void {
    const onZone = ctx.activeTab() === 'work';
    // FB-410 — the zone banner: patch the node's kanji + name + standing line in place (P4/TST2 —
    // the head never rebuilds under the player). (Guarded lookup — some test fixtures stand on
    // non-map ground; the banner just hides.)
    const here = MAP_NODE_IDS.has(state.location)
      ? getNode(state.location)
      : null;
    if (here) {
      if (zoneSeal.textContent !== (here.kanji ?? ''))
        setText(zoneSeal, here.kanji ?? '');
      toggle(zoneSeal, Boolean(here.kanji));
      if (zoneName.textContent !== here.label) setText(zoneName, here.label);
      // the standing line — the SAME seasonal read the Map card resolves (one source), so a
      // season turn re-inks it here too. The DEV story switcher live-swaps it by key, as there.
      const sb = nodeSeasonalBlurb(here, season(state));
      const lineText =
        __DEV_TOOLS__ && dev && sb.key !== undefined
          ? dev.subFlavor(sb.key, sb.text)
          : sb.text;
      setText(zoneLine, lineText);
    }
    toggle(zoneLine, here !== null && zoneLine.textContent !== '');
    toggle(zoneBanner, onZone && here !== null && hasFlag(state, 'awake'));
    toggle(actions, onZone);
    if (!onZone) return;

    // (the interactive intro no longer renders here — while it's live the shell is hidden and the
    // full-screen VN scene owns the screen; render() returns before renderActions is ever reached.)

    // build the section skeleton ONCE (FB-81): named sub-containers in the same order the old wholesale
    // build produced, each patched/reconciled in place after. `.actions-group` gives the reconciled
    // sections the parent's flex-gap so wrapping doesn't collapse the button stack.
    if (!actionsRefs) {
      const metaRow = el('div', 'actions-group');
      // storywave G4.9 — the PLACE strip: the standing what-you-do-here beats that aren't plain
      // labour — the night-round post at the gate (begin_night_round) and the day-wage board
      // (collect_wage). The scripted wolf-box is GONE (G4.3 deleted `verb-face-wolf`; the wolf is
      // now the night round's `survive` terminal stage). One home for place beats (TST1).
      const placeStrip = el('div', 'place-strip');
      // (a) the night-round post — post the grain-watch at the gate (bible R3). While a round is
      //     live the app loop resolves its stages; the status line reads the current stage (TST4).
      const nightRow = el('div', 'labour-row place-night');
      const nightBtn = el('button', 'verb primary');
      nightBtn.type = 'button';
      nightBtn.append(
        el('span', 'emoji', '🏮'),
        document.createTextNode(' Post the night watch 夜廻'),
      );
      // FB-346 — say what posting means before the player commits to a night of stages.
      nightBtn.title =
        'Stand the grain-watch through the night stages — it can end in a fight.';
      nightBtn.addEventListener('click', () =>
        // C4.8 — the first round (the quest, wolf climax) plays ONCE; after the wolf is
        // survived the post serves the repeatable grain-watch (no scripted wolf replay —
        // it returns in T1, locked canon).
        dispatch({
          type: 'begin_night_round',
          roundId: hasFlag(state, 'wolf-survived-not-won')
            ? 'grain-watch'
            : 'first-night-round',
        }),
      );
      const nightBlurb = el('p', 'area-blurb');
      nightRow.append(nightBtn);
      // (b) the wage board — collect the accrued day-wage (R5+, MON lane / ADR-163).
      const wageRow = el('div', 'labour-row place-wage');
      const wageBtn = el('button', 'verb');
      wageBtn.type = 'button';
      wageBtn.title =
        'The day-book accrues your wage 給 by the worked day — collect what stands owed.';
      wageBtn.addEventListener('click', () =>
        dispatch({ type: 'collect_wage' }),
      );
      wageRow.append(wageBtn);
      // (c) ADR-177 F3 — the works site: one sited act of the commissioned project.
      //     Same place-beat idiom as the night post; shown only AT a work zone (TST3).
      const worksRow = el('div', 'labour-row place-works');
      const worksBtn = el('button', 'verb primary');
      worksBtn.type = 'button';
      stampAct(worksBtn, 'work_project');
      worksBtn.addEventListener('click', () =>
        dispatch({ type: 'work_project' }),
      );
      worksRow.append(worksBtn);
      // (d) ADR-164/ADR-197 — the sickroom mend lane: Sōan's paid treatment (mon-only — the
      //     row HIDES without the coin, ADR-197) + the free pallet-day rest. Same place-beat
      //     idiom; shown only AT the sickroom (TST3), gated + priced via the SAME selectors
      //     the reducer spends (AC-6).
      const treatRow = el('div', 'labour-row place-treat');
      const treatBtn = el('button', 'verb primary');
      treatBtn.type = 'button';
      stampAct(treatBtn, 'treat');
      treatBtn.addEventListener('click', () => dispatch({ type: 'treat' }));
      treatRow.append(treatBtn);
      const restSickRow = el('div', 'labour-row place-rest-sickroom');
      const restSickBtn = el('button', 'verb');
      restSickBtn.type = 'button';
      stampAct(restSickBtn, 'rest_sickroom');
      restSickBtn.addEventListener('click', () =>
        dispatch({ type: 'rest_sickroom' }),
      );
      restSickRow.append(restSickBtn);
      placeStrip.append(
        nightBlurb,
        nightRow,
        wageRow,
        worksRow,
        treatRow,
        restSickRow,
      );
      const areaGroups = el('div', 'actions-group');
      const noWork = el(
        'p',
        'area-blurb',
        'No work to be had where you stand — open the Map 地図 tab to walk on.',
      );
      // FB-107 (ADR-112) — the "Walk on 道" nav strip is GONE from Work: the Map tab is navigation's
      // SOLE home. Labour is all the Work tab holds now. FB-343/FB-369 — the food verbs
      // (cook · eat rice) left too: they live on the Character 己 tab's Body card.
      actions.append(metaRow, placeStrip, areaGroups, noWork);
      actionsRefs = {
        metaRow,
        placeStrip,
        nightRow,
        nightBtn,
        nightBlurb,
        wageRow,
        wageBtn,
        worksRow,
        worksBtn,
        treatRow,
        treatBtn,
        restSickRow,
        restSickBtn,
        areaGroups,
        noWork,
      };
    }
    const r = actionsRefs;

    // meta verbs (rake / rest). Rake gets an auto-repeat toggle (revealed after a few manual rakes so
    // the first ones still land as juice) — the R0 cold-open is ~550 rakes and must not be a blind
    // click-grind (fun-factor "first-5-min hook"; every later labour already has an auto-toggle).
    reconcileList(r.metaRow, availableActions(state), {
      key: (a) => a,
      build: (a) => {
        if (a === 'rake_rice') {
          const row = el('div', 'labour-row');
          const btn = el('button', 'verb', META_LABELS.rake_rice);
          btn.type = 'button';
          stampAct(btn, 'rake_rice');
          btn.addEventListener('click', () => dispatch({ type: 'rake_rice' }));
          const auto = el('button', 'auto-toggle');
          auto.type = 'button';
          auto.addEventListener('click', () =>
            dispatch({ type: 'set_auto_rake', on: !ctx.lastState()?.autoRake }),
          );
          // FB-368 — the rake row carries the labour-row lock-hint idiom too: when the
          // rake refuses, the why reads inline, not only on hover (TST4).
          const lock = el('span', 'lock-hint');
          row.append(btn, auto, lock);
          return row;
        }
        const btn = el(
          'button',
          a === 'open_eyes' ? 'verb primary' : 'verb',
          META_LABELS[a],
        );
        btn.type = 'button';
        stampAct(btn, a);
        btn.addEventListener('click', () => dispatch({ type: a } as Intent));
        return btn;
      },
      patch: (node, a) => {
        // FB-346 — rest carries its effect line too. restRefill is the SAME selector the reducer
        // grants (AC-6/ADR-178), so a hungry rest advertises its true, degraded number.
        if (a === 'rest') {
          const btn = node as HTMLButtonElement;
          const hungry = restQuality(state) < 0.99;
          const t = `+${restRefill(state)} body — a free breather${hungry ? ' (poor on an empty belly — eat to rest well)' : ''}.`;
          if (btn.title !== t) btn.title = t;
          return;
        }
        // ADR-187 — the slept day reads its FULL price before it is taken (AC-6): sleepForecast is
        // the SAME selector the reducer spends, so the hover can never flatter the button. A day-skip
        // is instant and irreversible, so legibility IS the safety (there is no bar to think during).
        if (a === 'sleep') {
          const btn = node as HTMLButtonElement;
          const f = sleepForecast(state);
          const t =
            `Wake at dawn — the day goes on without you. ` +
            `The house eats ${f.riceDrawn} shō from the kura · −${Math.round(f.bellyLost)} belly ` +
            `(you sleep through the pot) · no body back — sleeping is not resting.`;
          if (btn.title !== t) btn.title = t;
          return;
        }
        if (a !== 'rake_rice') return;
        // FB-265 — the rake refuses at empty satiety (same predicate as the reducer, AC-6):
        // disable + say why, so the player is steered to "Rest a moment" instead of a dead grind.
        // FB-324 — and the spill is FINITE: at RAKE_CAP the rake is done for good; same shared
        // predicate (rakeExhausted) as the reducer refusal, with its own why.
        const rakeBtn = node.querySelector<HTMLButtonElement>('.verb')!;
        const exhausted = rakeExhausted(state);
        const affordable = canAffordAct(state);
        setDisabled(rakeBtn, exhausted || !affordable);
        const rakeTitle = exhausted
          ? RAKE_DONE_REASON
          : affordable
            ? // FB-346 — an able rake reads its cost/effect line, not a blank hover.
              `+${balance.RICE_PER_RAKE} shō (kura) · −${balance.SATIETY_PER_ACT} body`
            : OUT_OF_STRENGTH_REASON;
        if (rakeBtn.title !== rakeTitle) rakeBtn.title = rakeTitle;
        // FB-367/FB-368 — the rake row speaks the labour-row idioms (patchLabourRow /
        // ADR-148): exhaustion is PERMANENT, so the auto-toggle hides for good (a
        // "waiting" idle would lie); merely out-of-strength keeps an ARMED auto visible
        // as "⏸ waiting" (it re-fires once legal); and the refusal reason reads inline
        // via the lock-hint, off the SAME predicates the title already uses (AC-6).
        const auto = node.querySelector<HTMLButtonElement>('.auto-toggle')!;
        const lock = node.querySelector<HTMLElement>('.lock-hint')!;
        const on = state.autoRake;
        // A PAUSED game outranks both reads: an armed auto is standing still because the loop is
        // stopped, not because the belly is empty — say the true reason (TST4).
        const paused = on && ctx.isPaused();
        if (exhausted) {
          toggle(auto, false);
        } else if (!affordable || paused) {
          toggle(auto, on);
          if (on) {
            setClass(auto, 'on', true);
            setClass(auto, 'waiting', true);
            setText(auto, paused ? AUTO_PAUSED_LABEL : '⏸ waiting');
            setTitle(
              auto,
              paused ? AUTO_PAUSED_REASON : OUT_OF_STRENGTH_REASON,
            );
          }
        } else {
          toggle(auto, rakeCount(state) >= RAKE_AUTO_REVEAL_COUNT);
          setClass(auto, 'on', on);
          setClass(auto, 'waiting', false);
          setText(auto, on ? '■ stop' : '▶ auto');
          setTitle(auto, '');
          const pressed = String(on);
          if (auto.getAttribute('aria-pressed') !== pressed)
            auto.setAttribute('aria-pressed', pressed);
        }
        const reason = exhausted
          ? RAKE_DONE_REASON
          : affordable
            ? ''
            : OUT_OF_STRENGTH_REASON;
        toggle(lock, !!reason);
        if (reason) setText(lock, reason);
      },
      order: true,
    });

    // storywave G4.9 — the PLACE strip: the night-round post + the day-wage board.
    // (a) the grain-watch night round (bible R3): posted at the gate. Show the post button once the
    //     MC has reached R3 (`rank-r3`, latched — a rung check dies at R4) and hasn't yet survived
    //     the round; at the gate it's the live post, elsewhere a standing summons to walk to the
    //     gate. While a round is LIVE the app loop resolves its stages — the blurb reads the stage.
    const roundLive = state.roundState !== null;
    const nightPending =
      hasFlag(state, 'rank-r3') &&
      !hasFlag(state, 'wolf-survived-not-won') &&
      !roundLive;
    const atGate = state.location === 'gate';
    toggle(r.nightRow, nightPending && atGate);
    if (roundLive) {
      const def = nightRoundById(state.roundState!.roundId);
      const stage = def?.stages[state.roundState!.stage];
      const foe = stage ? getMob(stage.foe).label : 'the dark';
      setText(
        r.nightBlurb,
        `夜廻 The watch is walking — you face ${foe} at the grain store.`,
      );
    } else if (nightPending && !atGate) {
      setText(
        r.nightBlurb,
        'The grain-watch waits to be walked — open the Map 地図 tab and go to the gate (門) to post it.',
      );
    }
    toggle(r.nightBlurb, roundLive || (nightPending && !atGate));
    // (b) the day-wage board (R5+, MON lane / ADR-163): collect the accrued wage. Show the button once
    //     waged; enabled only when a day's wage stands unclaimed (TST4 — the amount is legible).
    const waged = isWaged(state.rung);
    const owed = state.wageDaysAccrued;
    toggle(r.wageRow, waged);
    if (waged) {
      setText(
        r.wageBtn,
        owed > 0
          ? `Collect your wage 給 (${owed * DAY_WAGE_MON} mon)`
          : 'Wage board 給 — nothing owed',
      );
      setDisabled(r.wageBtn, owed <= 0);
    }
    // (c) ADR-177 F3 — the works site verb: visible only where the reducer would accept
    //     it (canWorkProject — AC-6: shown == enforced). The label carries the progress.
    const canWork = canWorkProject(state);
    toggle(r.worksRow, canWork);
    if (canWork) {
      const def = ESTATE_STAGES.find((d) => d.stage === state.estateCommission);
      if (def) {
        setText(
          r.worksBtn,
          `Work the repairs 普請 (${state.estateWorkDone} / ${def.workActs})`,
        );
        setDisabled(
          r.worksBtn,
          state.character.satiety < balance.WORKS_ACT_SATIETY,
        );
        r.worksBtn.title =
          state.character.satiety < balance.WORKS_ACT_SATIETY
            ? 'Too spent — rest or eat before working the site.'
            : `One act of the commissioned work — ${stageLabel(def)}.`;
      }
    }
    // (d) ADR-164/ADR-197 — the sickroom mend rows: shown exactly when the reducer would
    //     accept them (canTreat / canRestSickroom — AC-6: shown == enforced). The mon-short
    //     treat HIDES (ADR-197, never shown-disabled), so the broke player reads one honest
    //     lane: the free pallet day.
    const treatable = canTreat(state);
    toggle(r.treatRow, treatable);
    if (treatable) {
      const tf = treatForecast(state);
      setText(
        r.treatBtn,
        `Take Sōan's treatment 手当 (−${tf.cost} mon · +${tf.hpGain} HP)`,
      );
      r.treatBtn.title =
        'Sōan cleans and binds the hurt — paid speed, the coin counted once.';
    }
    const restable = canRestSickroom(state);
    toggle(r.restSickRow, restable);
    if (restable) {
      const rf = restSickroomForecast(state);
      setText(
        r.restSickBtn,
        `Rest on the pallet 臥 (the day is spent · +${rf.hpGain} HP)`,
      );
      r.restSickBtn.title =
        'Give the day to the pallet — free and slow; you wake at dawn.';
    }
    toggle(
      r.placeStrip,
      nightPending || roundLive || waged || treatable || restable,
    );

    // labour activities, grouped by estate room (each: do-once + auto-repeat toggle). Outer keyed
    // list over the areas that HAVE labour here; each group's rows are an inner keyed list.
    // FB-410 (HR-32) — the group carries NO head/blurb of its own any more: labours are spatial
    // (availableLabours filters to state.location), so the ONE area here is the zone the banner
    // already names, and its standing line is the banner's. Two names for one ground read as
    // chrome; the group is now just the reconcile host for its rows.
    const labours = availableLabours(state);
    const areasWithLabour = AREAS.filter((area) =>
      labours.some((o) => o.activity.area === area.id),
    );
    toggle(r.areaGroups, areasWithLabour.length > 0);
    reconcileList(r.areaGroups, areasWithLabour, {
      key: (area) => area.id,
      build: () => el('div', 'area-group'),
      patch: (group, area) => {
        // reconcile the labour rows DIRECTLY into the group (its head/blurb are foreign siblings the
        // reconcile never touches; the activity set here is stable so no reorder is needed).
        reconcileList(
          group,
          labours.filter((o) => o.activity.area === area.id),
          {
            key: (o) => o.activity.id,
            build: (o) => buildLabourRow(o),
            patch: (row, o) => patchLabourRow(row, o, state),
          },
        );
      },
      order: true,
    });

    // spatial (v0.3.1 Step 5): a node with no labour (and no wolf-beat prompting here) points the
    // player at the Map tab to walk on.
    toggle(
      r.noWork,
      labours.length === 0 &&
        !nightPending &&
        !roundLive &&
        hasFlag(state, 'awake') &&
        isUnlocked(state, 'room-gate'),
    );

    // (FB-107 — no "Walk on" strip here anymore: navigation lives ONLY on the Map tab.)
    // (FB-343/FB-369 — no food verbs here anymore either: cook + eat-rice live on the
    //  Character 己 tab's Body card, beside the vitals they feed.)
  }

  return { renderActions };
}
