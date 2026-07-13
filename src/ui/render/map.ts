// The MAP tab + the Zone tab's "who's here" list (split out of render.ts, 2026-07-13
// render-split): the you-are-here flavor card, the 絵図 survey sheet (signature-gated
// wholesale repaint — TST2), and the ADR-114 talk-to-reveal person rows.
import {
  balance,
  nodeHint,
  nodeSeasonalBlurb,
  peopleAwayHere,
  season,
  getNode,
  peopleHere,
  presenceCtx,
  skillLevel,
  unlockedSurfaces,
  PEOPLE,
  type GameState,
  type Intent,
  type NodePerson,
} from '../../core';
import { el, VOICE_COLOR, VOICE_SEAL } from '../render';
import { reconcileList, setText, setClass, toggle } from '../reconcile';
import { renderMapSheet } from '../map-variants/sheet-map';
import { buildMapCtx, type MapCtx } from '../map-variants/shared';
import type { DevApi } from '../dev';

type Dispatch = (intent: Intent) => void;

export function createMapView(ctx: {
  mapPane: HTMLElement;
  whosPane: HTMLElement;
  whosList: HTMLElement;
  dispatch: Dispatch;
  dev: DevApi | undefined;
  activeTab(): string;
  /** The Zone tab's open-conversation state — owned by mount (market gates on it too). */
  openPersonId(): string | null;
  setOpenPersonId(id: string | null): void;
  /** UI-only re-render off the last state (like setTab). */
  rerender(): void;
}): {
  renderMap(state: GameState): void;
  renderWhosHere(state: GameState): void;
} {
  const { mapPane, whosPane, whosList, dispatch, dev } = ctx;

  let mapRefs: {
    card: HTMLElement;
    loc: HTMLElement;
    kanji: HTMLElement;
    blurb: HTMLElement;
    wrongEl: HTMLElement; // C4.6 — the node's wrong-thing line (one FLAVOR source with the sheet)
    // FB-102 — the Map splits into TWO sections: (a) the bordered you-are-here FLAVOR card above
    // (card/loc/kanji/blurb), and (b) the estate map below — the 絵図 survey-plan sheet (the
    // HR-7 human pick) — a sibling of the flavor card, not nested in it. The sheet is a wholesale
    // deterministic SVG paint, so `sig` fingerprints every input it reads: an idle tick repaints
    // NOTHING (TST2), and only a real change (move / reveal / stage / presence) redraws the sheet.
    nav: HTMLElement;
    sig: string;
    // (FB-332 — the ADR-114 "who's here" section moved off this pane to the Zone tab: whosPane.)
  } | null = null;

  /** The reachable-neighbour move buttons (`→ node`, danger ⚠ + the conditioning lock). The Map tab's
   *  navigation (FB-107 — nav's sole home after the IA reorg). Returns null when nowhere is walkable
   *  from here. `keyPrefix` keeps the described-by ids unique. */
  /** The navigation context the shipped survey-plan sheet renders from (the shared map shape):
   *  clicking a node's seal IS the move (the real move_to — no separate "go" button), and a
   *  conditioning-gated edge carries the visible reason (§5.9), never a dead grey box. */
  function mapCtx(state: GameState): MapCtx {
    // one ctx source, shared with the DEV travel-presence variants (TST1)
    return buildMapCtx(state, dispatch);
  }
  /** Fingerprint of EVERY input the survey sheet reads — location, the revealed/unlocked set
   *  (which also carries house rooms + people place-gates), the conditioning gate, the estate
   *  stage, and each mapped person's live presence — so the sheet's wholesale (deterministic)
   *  repaint fires only on a real change, never on an idle tick (TST2). */
  function mapSignature(state: GameState): string {
    const pctx = presenceCtx(state);
    const presence = PEOPLE.map((p) =>
      p.presence === undefined || p.presence(pctx) ? '1' : '0',
    ).join('');
    return [
      state.location,
      String(state.estateStage),
      skillLevel(state, 'conditioning') >= balance.CONDITIONING_GATE_LEVEL ? '1' : '0',
      presence,
      unlockedSurfaces(state).join(','), // ADR-179 — derived, stable registry order
    ].join('|');
  }

  // fill the you-are-here card's header (the incremental map shell builds it ONCE, this patches).
  function fillMapHere(
    loc: HTMLElement,
    kanji: HTMLElement,
    here: ReturnType<typeof getNode>,
  ): void {
    // strip a leading article so a label like "The grain-store (kura)" doesn't read "the the …"
    setText(loc, `You stand at the ${here.label.toLowerCase().replace(/^the /, '')} `);
    if (here.kanji) {
      setText(kanji, here.kanji);
      toggle(kanji, true);
    } else {
      toggle(kanji, false);
    }
  }
  // ── the Map "who's here 衆" people (ADR-114 vendors-as-people) — a talk affordance per present
  //    person: a category-coloured hanko seal + name + a one-line tell + a Speak button. Built ONCE
  //    (listener bound here); patch flips the open/closed label + the greeting line in place (FB-81).
  //    Talk dispatches by depth: a `tiny` trader's Speak opens his wares (renderMarket, gated on
  //    `openPersonId`); a `small`/`vn` person opens his greeting line (a simple talk panel for now). ──
  function buildPersonRow(p: NodePerson): HTMLElement {
    const row = el('div', 'person-row frame');
    const head = el('div', 'person-head');
    const color = VOICE_COLOR[p.voice];
    const seal = el('span', 'person-seal', VOICE_SEAL[p.voice]);
    seal.lang = 'ja';
    seal.style.color = color;
    seal.style.borderColor = color;
    const name = el('span', 'person-name', p.name);
    name.style.color = color;
    head.append(seal, name);
    if (p.tell) head.append(el('span', 'person-tell lock-hint', p.tell));
    row.append(head);
    const say = el('div', 'person-say skill-blurb');
    row.append(say);
    const talk = el('button', 'verb person-talk');
    talk.type = 'button';
    talk.addEventListener('click', () => {
      if (p.depth === 'vn' && p.sceneId) {
        // C4.2 — a `vn` person actually SPEAKS: every press delivers their next
        // gate-satisfied authored line into the Story log (the talk_to intent — the same
        // diegetic-mentor cursor as the cold open; the log is the surface, TST1/ADR-039).
        // The conversation STAYS open ("Ask X" keeps asking); it closes by walking off or
        // talking to someone else. The dispatch re-renders for us.
        ctx.setOpenPersonId(p.id);
        dispatch({ type: 'talk_to', personId: p.id });
        return;
      }
      // small/tiny: toggle the greeting/wares panel — a second click on the open person
      // closes it. Re-render off the last state (like setTab), UI-only.
      ctx.setOpenPersonId(ctx.openPersonId() === p.id ? null : p.id);
      ctx.rerender();
    });
    row.append(talk);
    return row;
  }
  function patchPersonRow(row: HTMLElement, p: NodePerson): void {
    const open = ctx.openPersonId() === p.id;
    const talk = row.querySelector<HTMLButtonElement>('.person-talk')!;
    // a vn conversation stays open and keeps ASKING (C4.2); small/tiny toggle open/closed
    const openLabel = p.depth === 'vn' ? `Ask ${p.name} more` : `Leave ${p.name}`;
    setText(talk, open ? openLabel : `Speak with ${p.name}`);
    setClass(talk, 'on', open);
    const say = row.querySelector<HTMLElement>('.person-say')!;
    toggle(say, open && Boolean(p.greeting));
    if (open && p.greeting) setText(say, p.greeting);
  }
  // render the who's-here list into a host (shared by the incremental + DEV-default map paths so the
  // DEV default never drifts from prod, §6.5). Returns whether anyone is present (⇒ show the host).
  function fillWhosHere(
    list: HTMLElement,
    present: readonly NodePerson[],
    away: readonly NodePerson[] = [],
  ): boolean {
    // present people first, then the dimmed away rows (FB-408). One reconciled list —
    // the `away:` key prefix means a person flipping present↔away rebuilds their row.
    const rows = [
      ...present.map((p) => ({ p, away: false })),
      ...away.map((p) => ({ p, away: true })),
    ];
    reconcileList(list, rows, {
      key: (r) => (r.away ? `away:${r.p.id}` : r.p.id),
      build: (r) => (r.away ? buildAwayRow(r.p) : buildPersonRow(r.p)),
      patch: (row, r) => {
        if (!r.away) patchPersonRow(row, r.p);
      },
      order: true,
    });
    return rows.length > 0;
  }
  // FB-408 — a dimmed, button-less row for a scheduled person who is NOT here right now:
  // the same seal + name idiom as a present row, with the awayTell as the schedule hint.
  function buildAwayRow(p: NodePerson): HTMLElement {
    const row = el('div', 'person-row frame person-away');
    const head = el('div', 'person-head');
    const seal = el('span', 'person-seal', VOICE_SEAL[p.voice]);
    seal.lang = 'ja';
    head.append(seal, el('span', 'person-name', p.name));
    if (p.awayTell) head.append(el('span', 'person-tell lock-hint', p.awayTell));
    row.append(head);
    return row;
  }
  function renderMap(state: GameState): void {
    const show = ctx.activeTab() === 'map';
    toggle(mapPane, show);
    if (!show) return;
    // ── the Map body (FB-102 / ADR-115 / ADR-116 / HR-7) — TWO sections: (a) the bordered
    //    you-are-here FLAVOR card (the immersive current-node description), then (b) the estate
    //    map itself: the 絵図 SURVEY-PLAN sheet, the human-picked winner of the ADR-075 real-map
    //    diverge (HR-7, 2026-07-07 — the losing takes are stripped, zero flag-debt). The sheet
    //    carries its own what-is-where reads (per-node labour/foe/people marks, fog frontier,
    //    conditioning-gated edges greyed WITH the visible reason) and moves by clicking a node's
    //    seal (the real move_to). It repaints wholesale but DETERMINISTICALLY (seeded jitter), so
    //    it mounts behind the mapSignature guard: an idle tick repaints nothing (TST2). ──
    if (!mapRefs) {
      // No pane heading — the active "Map 地図" tab and the sheet's own 黒沢家領内絵図
      // cartouche already title it (FB-373, TST1).
      // (a) the bordered you-are-here FLAVOR card (FB-102): the immersive current-node
      // description. FB-336 — it reads BELOW the sheet now (appended after nav): the map is
      // the tab's hero, the zone description is the scroll's second beat.
      const card = el('div', 'map-here frame');
      const h = el('div', 'rung-now');
      const loc = el('span');
      const kanji = el('span', 'house-influence-kanji');
      kanji.lang = 'ja';
      h.append(loc, kanji);
      const blurb = el('div', 'skill-blurb');
      card.append(h, blurb);
      // C4.6 — the node's WRONG thing (bible: every zone carries one) reads on the play card
      // too, from the ONE FLAVOR source the sheet detail pane shares. Hidden when the node
      // has none (the woodshed's warmth is earned).
      const wrongEl = el('div', 'map-wrong skill-blurb');
      card.append(wrongEl);
      // (b) the survey sheet's mount — a SIBLING of the flavor card, filled behind the sig
      // guard. FB-336 — the sheet mounts FIRST, the flavor card below it.
      const nav = el('div', 'map-nav');
      mapPane.append(nav, card);
      // (FB-332 — the who's-here section no longer lives here; it renders on the Zone tab.)
      mapRefs = { card, loc, kanji, blurb, wrongEl, nav, sig: '' };
    }
    const r = mapRefs;
    const here = getNode(state.location);
    fillMapHere(r.loc, r.kanji, here);
    // C4.6 — the wrong thing, patched in place (present only where authored)
    toggle(r.wrongEl, Boolean(here.wrong));
    if (here.wrong) setText(r.wrongEl, `怪 ${here.wrong}`);
    // ADR-146 — the standing discovery hint reads as PART of the node description (diegetic,
    // P15 — never a banner/counter); it tightens as attempts climb and vanishes on the latch.
    // Text patch in place (P4); DEV story switcher live-swaps the line via its flavor key.
    const hint = nodeHint(state, state.location);
    const hintText =
      hint === null
        ? ''
        : __DEV_TOOLS__ && dev && hint.key !== undefined
          ? dev.subFlavor(hint.key, hint.text)
          : hint.text;
    // C5a unit 5 — the node breathes by season (05-world): the you-are-here read resolves
    // the seasonal FLAVOR variant (DEV story switcher live-swaps it by key, like the hint).
    const sb = nodeSeasonalBlurb(here, season(state));
    const blurbText =
      __DEV_TOOLS__ && dev && sb.key !== undefined ? dev.subFlavor(sb.key, sb.text) : sb.text;
    setText(r.blurb, hintText === '' ? blurbText : `${blurbText} ${hintText}`);
    // (b) the survey sheet — repaint ONLY when an input it reads changed (the sig guard): a move,
    // newly-surveyed ground, the conditioning gate, an estate stage, or a person arriving/leaving.
    // The FB-340 travel presence (footsteps + follow) plays DURING the move timer, fired from the
    // clock-driven hook below — not on this rebuild.
    const sig = mapSignature(state);
    if (sig !== r.sig) {
      r.sig = sig;
      r.nav.textContent = '';
      renderMapSheet(r.nav, mapCtx(state), state, dispatch);
    }
  }

  // FB-332 — the who's-here 衆 section on the Zone tab: reconcile the present people; close a
  // conversation whose person left (you walked off, or a place-gate closed — ADR-114, so no
  // stale wares/greeting linger); hide the whole section when the node is empty (FB-72).
  function renderWhosHere(state: GameState): void {
    const present = peopleHere(state);
    if (ctx.openPersonId() !== null && !present.some((p) => p.id === ctx.openPersonId()))
      ctx.setOpenPersonId(null);
    // FB-408 — the node's absent REGULARS ride the same list as dimmed schedule rows
    // (Yohei off-market: "sets up on market days 水・土"), so scheduled ground never
    // reads purposeless.
    const away = peopleAwayHere(state);
    toggle(whosPane, ctx.activeTab() === 'work' && fillWhosHere(whosList, present, away));
  }

  // build ONE quest card skeleton with every mutable element present (steps + reward line + accept
  // button); patchQuestCard toggles/patches them for the offer → accepted → done states in place.

  return { renderMap, renderWhosHere };
}
