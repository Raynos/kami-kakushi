// The alternate (non-default) ADR-075 surface-variant renderers (split out of dev.ts,
// 2026-07-13 render-split) — DEV-only, stripped from prod: the renderer reaches these only
// through `import.meta.env.DEV && dev`, so Rollup tree-shakes the whole module. Each default
// (A) variant ships inline in render.ts; every alternate here re-presents the SAME pure-core
// reads and drives the REAL intents (ADR-075: every variant works).
import {
  balance,
  bestiaryEntries,
  canBuy,
  formatCoin,
  formatKMB,
  canCraft,
  getMaterial,
  BELONGINGS,
  HOME_TIERS,
  homeSetComplete,
  cornerRestBonus,
  homeSatietyBonus,
  homeStorageBonus,
  homeHasCook,
  ownedBelongings,
  ownedBelongingIds,
  ownsBelonging,
  MARKET_ITEMS,
  QUESTS,
  RECIPES,
  ASKS,
  askById,
  availableAsks,
  unheardAskCount,
  peopleHere,
  peopleAwayHere,
  playerSpeaker,
  type NodePerson,
  type BelongingDef,
  type GameState,
  type Intent,
  type MarketItem,
  isUnlocked,
  estateBuild,
  stageLabel,
  stageBlurb,
  WORKS_PROJECTS,
  stageDiscovery,
  getNode,
  ESTATE_STAGES,
} from '../../core';
import {
  el,
  pct,
  HOUSE_ROOMS,
  ESTATE_STAGE_NAMES,
  VOICE_COLOR,
  VOICE_SEAL,
} from '../render';
import { FLAVOR } from '../../core/content/flavor';

// ── the alternate (non-default) variant renderers — DEV-only, stripped from prod ──

export function renderSurfaceVariant(
  surface: string,
  variantId: string,
  container: HTMLElement,
  state: GameState,
  dispatch: (intent: Intent) => void,
): boolean {
  if (surface === 'influence')
    return renderInfluenceGrade(variantId, container, state);
  if (surface === 'craft')
    return renderCraftVariant(variantId, container, state);
  if (surface === 'market')
    return renderMarketVariant(variantId, container, state, dispatch);
  if (surface === 'quests')
    return renderQuestsVariant(variantId, container, state, dispatch);
  if (surface === 'bestiary')
    return renderBestiaryVariant(variantId, container, state);
  if (surface === 'home')
    return renderHomeVariant(variantId, container, state, dispatch);
  if (surface === 'works')
    return renderWorksVariant(variantId, container, state, dispatch);
  if (surface === 'estate-house')
    return renderEstateHouseVariant(variantId, container, state);
  if (surface === 'talk')
    return renderTalkVariant(variantId, container, state, dispatch);
  return false;
}

// ── the FB-415 talk surface (B / C) — DEV-only, stripped from prod. Default A (in-row
// ask plates) ships inline in render/map.ts; both alternates re-present the SAME
// availableAsks/unheardAskCount reads and drive the REAL `ask` intent (ADR-075: every
// variant works). UI-open state is module-local (the wholesale DEV rebuild re-derives). ──

/** B/C conversation state — which person/ask is open (B), the running exchange (C). */
const talkUi: {
  personId: string | null;
  askId: string | null;
  log: { speaker: string; color: string; text: string }[];
} = { personId: null, askId: null, log: [] };

function renderTalkVariant(
  variantId: string,
  container: HTMLElement,
  state: GameState,
  dispatch: (intent: Intent) => void,
): boolean {
  if (variantId !== 'talk-b' && variantId !== 'talk-c') return false;
  container.textContent = ''; // wholesale DEV rebuild (market-pane precedent)
  const present = peopleHere(state);
  const away = peopleAwayHere(state);
  if (
    talkUi.personId !== null &&
    !present.some((p) => p.id === talkUi.personId)
  ) {
    talkUi.personId = null;
    talkUi.askId = null;
    talkUi.log = [];
  }
  const open = present.find((p) => p.id === talkUi.personId);
  // a click that only moves UI-local state re-renders synchronously (no fake intent)
  const rerender = (): void => {
    renderTalkVariant(variantId, container, state, dispatch);
  };

  const newsChip = (personId: string): HTMLElement | null => {
    const n = unheardAskCount(state, personId, ASKS);
    if (n === 0) return null;
    const chip = el('span', 'ask-new', `新 ${n}`);
    chip.lang = 'ja';
    return chip;
  };

  const personHead = (p: NodePerson): HTMLElement => {
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
    const chip = newsChip(p.id);
    if (chip) head.append(chip);
    return head;
  };

  if (variantId === 'talk-b') {
    // B — the VN-lite framed exchange: ONE speech frame at the head of the pane (the
    // ceremony register — P19's breathing half), the asks as a vertical VN choice list
    // (P11: ask-first, an explicit "Take your leave" closes). The rows below stay terse.
    if (open) {
      const frame = el('div', 'person-row frame');
      frame.style.cssText = 'border-color:var(--rokusho);gap:.6rem;';
      frame.append(personHead(open));
      const speech = el('div', 'ask-answer');
      const def = talkUi.askId !== null ? askById(talkUi.askId) : undefined;
      if (def && def.person === open.id) {
        for (const l of def.answer(state)) {
          const line = el('div', 'ask-answer-line');
          const sp = el(
            'span',
            'ask-answer-speaker',
            `${l.speaker ?? open.name}: `,
          );
          sp.style.color = VOICE_COLOR[l.voice ?? open.voice];
          line.append(sp, el('span', undefined, l.text));
          speech.append(line);
        }
      } else {
        const still = el('div', 'ask-answer-line');
        still.append(
          el('span', undefined, `${open.name} waits on your question.`),
        );
        speech.append(still);
      }
      frame.append(speech);
      const choices = el('div');
      choices.style.cssText =
        'display:flex;flex-direction:column;align-items:flex-start;gap:.35rem;';
      for (const a of availableAsks(state, open.id, ASKS)) {
        const b = el('button', 'verb ask-plate', a.def.label);
        b.type = 'button';
        if (a.heard) b.classList.add('heard');
        if (talkUi.askId === a.def.id) b.classList.add('on');
        b.addEventListener('click', () => {
          talkUi.askId = a.def.id;
          dispatch({ type: 'ask', askId: a.def.id });
        });
        choices.append(b);
      }
      const leave = el('button', 'verb');
      leave.type = 'button';
      leave.textContent = 'Take your leave';
      leave.addEventListener('click', () => {
        talkUi.personId = null;
        talkUi.askId = null;
        rerender();
      });
      choices.append(leave);
      frame.append(choices);
      container.append(frame);
    }
    for (const p of present) {
      if (open && p.id === open.id) continue;
      const row = el('div', 'person-row frame');
      row.append(personHead(p));
      const talk = el('button', 'verb person-talk', `Speak with ${p.name}`);
      talk.type = 'button';
      talk.addEventListener('click', () => {
        talkUi.personId = p.id;
        talkUi.askId = null;
        // the interim C4.2 cursor still fires for a vn person (step 4 retires it);
        // its dispatch re-renders — a non-vn open is UI-only, so re-render here.
        if (p.depth === 'vn' && p.sceneId)
          dispatch({ type: 'talk_to', personId: p.id });
        else rerender();
      });
      row.append(talk);
      container.append(row);
    }
    for (const p of away) container.append(buildTalkAwayRow(p));
    return true;
  }

  // C — the mini-transcript: the open row carries a SHORT running exchange (your
  // question, their answer — the last few kept), so the conversation reads as a
  // conversation; the plates stay beneath. Distinct hierarchy from A (one answer
  // swaps) and B (framed ceremony). Transcript is UI-local, capped, never logged (D4).
  for (const p of present) {
    const row = el('div', 'person-row frame');
    row.append(personHead(p));
    const isOpen = open !== undefined && p.id === open.id;
    if (isOpen) {
      if (talkUi.log.length > 0) {
        const tr = el('div', 'ask-answer');
        for (const e of talkUi.log) {
          const line = el('div', 'ask-answer-line');
          const sp = el('span', 'ask-answer-speaker', `${e.speaker}: `);
          sp.style.color = e.color;
          line.append(sp, el('span', undefined, e.text));
          tr.append(line);
        }
        row.append(tr);
      }
      const plates = el('div', 'ask-plates');
      for (const a of availableAsks(state, p.id, ASKS)) {
        const b = el('button', 'verb ask-plate', a.def.label);
        b.type = 'button';
        if (a.heard) b.classList.add('heard');
        b.addEventListener('click', () => {
          talkUi.log.push({
            speaker: playerSpeaker(state),
            color: VOICE_COLOR.player,
            text: a.def.label,
          });
          for (const l of a.def.answer(state)) {
            talkUi.log.push({
              speaker: l.speaker ?? p.name,
              color: VOICE_COLOR[l.voice ?? p.voice],
              text: l.text,
            });
          }
          talkUi.log = talkUi.log.slice(-8); // the last few exchanges only
          dispatch({ type: 'ask', askId: a.def.id });
        });
        plates.append(b);
      }
      row.append(plates);
    }
    const talk = el('button', 'verb person-talk');
    talk.type = 'button';
    talk.textContent = isOpen ? `Ask ${p.name} more` : `Speak with ${p.name}`;
    if (isOpen) talk.classList.add('on');
    talk.addEventListener('click', () => {
      if (talkUi.personId !== p.id) {
        talkUi.personId = p.id;
        talkUi.log = [];
      }
      // the interim C4.2 cursor still fires for a vn person (step 4 retires it)
      if (p.depth === 'vn' && p.sceneId)
        dispatch({ type: 'talk_to', personId: p.id });
      else rerender();
    });
    row.append(talk);
    container.append(row);
  }
  for (const p of away) container.append(buildTalkAwayRow(p));
  return true;
}

/** FB-408 away row, re-presented for the talk variants (dimmed, button-less). */
function buildTalkAwayRow(p: NodePerson): HTMLElement {
  const row = el('div', 'person-row frame person-away');
  const head = el('div', 'person-head');
  const seal = el('span', 'person-seal', VOICE_SEAL[p.voice]);
  seal.lang = 'ja';
  head.append(seal, el('span', 'person-name', p.name));
  if (p.awayTell) head.append(el('span', 'person-tell lock-hint', p.awayTell));
  row.append(head);
  return row;
}

/** The diverged Works 普請 (B / C) — DEV-only, stripped from prod. Default A (the day-book
 *  page) ships inline in render.ts; both alternates re-present the SAME estateBuild/works
 *  reads and drive the REAL improve_estate intent (ADR-075: every variant works). */
function renderWorksVariant(
  variantId: string,
  container: HTMLElement,
  state: GameState,
  dispatch: (intent: Intent) => void,
): boolean {
  if (variantId !== 'works-b' && variantId !== 'works-c') return false;
  const build = estateBuild(state);
  const n = build.next;
  const carried = state.resources.coin ?? 0;
  const banked = state.banked.coin ?? 0;
  const commissionBtn = (): HTMLButtonElement => {
    const btn = el('button', 'verb') as HTMLButtonElement;
    btn.type = 'button';
    btn.addEventListener('click', () => dispatch({ type: 'improve_estate' }));
    if (n) {
      const woodShort = (state.resources.wood ?? 0) < n.def.woodCost;
      btn.textContent = `Commission — ${stageLabel(n.def)} (${formatCoin(n.def.coinCost)} · wood ${n.def.woodCost})`;
      btn.disabled = carried < n.def.coinCost || woodShort || n.deedsShort > 0;
      btn.title = btn.disabled
        ? n.deedsShort > 0
          ? `The house's standing must reach ${n.deedGate} koku first (now ${n.standing})`
          : woodShort
            ? `Needs ${n.def.woodCost} wood`
            : banked >= n.def.coinCost
              ? 'Draw coin from the kura storehouse first'
              : `Needs ${formatCoin(n.def.coinCost)}`
        : '';
    }
    return btn;
  };
  // ADR-177 F3 — a live commission renders as progress (the acts happen at the site).
  const commissionRead = (): HTMLElement | null => {
    if (!n || state.estateCommission !== n.def.stage) return null;
    return el(
      'div',
      'rung-hint',
      `Under way — ${stageLabel(n.def)}: ${state.estateWorkDone} / ${n.def.workActs} (work it at the site)`,
    );
  };
  container.replaceChildren();
  const stageName =
    ESTATE_STAGE_NAMES[state.estateStage] ??
    ESTATE_STAGE_NAMES[ESTATE_STAGE_NAMES.length - 1]!;
  if (variantId === 'works-b') {
    // B · THE WORK-SITE BOARD — one card per project, anchored on the zones you walk:
    // the sites carry the discovery state; the open site carries the commissioning.
    const card = el('div', 'rung-card frame works-board');
    card.append(el('div', 'rung-now', `Works 普請 — Estate · ${stageName}`));
    const boardEl = el('div', 'works-board-row');
    for (const proj of WORKS_PROJECTS) {
      const def = ESTATE_STAGES.find((d) => d.stage === proj.stage)!;
      const built = state.estateStage >= proj.stage;
      const isNext = proj.stage === state.estateStage + 1;
      const disc = stageDiscovery(state, proj.stage);
      const site = el(
        'div',
        `works-site ${built ? 'is-built' : isNext ? `is-${disc}` : 'is-faint'}`,
      );
      const kanji = proj.zones
        .map((z) => getNode(z.node)?.kanji ?? '?')
        .join('');
      site.append(el('div', 'works-site-kanji', kanji));
      if (built) {
        site.append(el('div', 'works-site-name', stageLabel(def)));
        site.append(el('div', 'works-site-note', 'done — the seal holds'));
      } else if (isNext && disc === 'open' && n) {
        site.append(el('div', 'works-site-name', stageLabel(n.def)));
        site.append(el('div', 'works-site-note', stageBlurb(n.def)));
        if (n.deedGate > 0)
          site.append(
            el(
              'div',
              'works-site-note',
              `standing ${Math.min(n.standing, n.deedGate)} / ${n.deedGate} koku`,
            ),
          );
        const read = commissionRead();
        if (read) site.append(read);
        else site.append(commissionBtn());
      } else if (isNext && disc === 'named') {
        site.append(
          el('div', 'works-site-name is-hint', FLAVOR.worksLadderNamed),
        );
      } else {
        site.append(
          el(
            'div',
            'works-site-name is-hint',
            isNext ? FLAVOR.worksLadderUnnamed : 'the works continue',
          ),
        );
      }
      boardEl.append(site);
    }
    card.append(boardEl);
    container.append(card);
    return true;
  }
  // C · THE BUILD LADDER (interim) — the pre-ADR-177 tracker shape, kept for live comparison.
  const card = el('div', 'rung-card frame');
  card.append(el('div', 'rung-now', `Works 普請 — Estate · ${stageName}`));
  const ladder = el('div', 'build-ladder');
  for (const row of build.rows) {
    const line = el('div', `build-ladder-row is-${row.status}`);
    const nextOpen = n?.open ?? true;
    line.append(
      el(
        'span',
        'build-ladder-mark',
        row.status === 'built' ? '◆' : row.status === 'next' ? '▹' : '▢',
      ),
      el(
        'span',
        'build-ladder-name',
        row.status === 'locked' || (row.status === 'next' && !nextOpen)
          ? 'the works continue'
          : stageLabel(row.def),
      ),
    );
    if (row.status === 'next' && nextOpen && row.deedGate > 0)
      line.append(
        el(
          'span',
          'build-ladder-gauge',
          `standing ${Math.min(state.influence.estate.value, row.deedGate)} / ${row.deedGate} koku`,
        ),
      );
    ladder.append(line);
  }
  card.append(ladder);
  if (n && n.discovery === 'open') {
    card.append(el('div', 'skill-blurb', stageBlurb(n.def)));
    card.append(
      el(
        'div',
        'rung-hint',
        `+${n.def.yieldBonusNum}% labour output · +${n.def.satietyMaxBonus} max body`,
      ),
    );
    const read = commissionRead();
    if (read) card.append(read);
    else card.append(commissionBtn());
  } else if (n) {
    card.append(
      el(
        'div',
        'rung-hint',
        n.discovery === 'named'
          ? FLAVOR.worksLadderNamed
          : FLAVOR.worksLadderUnnamed,
      ),
    );
  } else {
    card.append(el('div', 'rung-hint', 'The estate stands restored.'));
  }
  container.append(card);
  return true;
}

/** The diverged Estate 家 house surface (B / C) — DEV-only. Default A (the drawn sheet)
 *  ships inline in render.ts; both alternates re-present the SAME room/standing reads. */
function renderEstateHouseVariant(
  variantId: string,
  container: HTMLElement,
  state: GameState,
): boolean {
  if (variantId !== 'estate-house-b' && variantId !== 'estate-house-c')
    return false;
  container.replaceChildren();
  const opened = HOUSE_ROOMS.filter((room) => isUnlocked(state, room.surface));
  if (variantId === 'estate-house-b') {
    // B · THE STEWARD'S RECKONING — the house as day-book lines: each wing a ruled
    // entry, open or shut; the standing as the page's footing.
    const card = el('div', 'rung-card frame estate-reckoning');
    card.append(el('div', 'rung-now', 'Estate 家 · the second reckoning'));
    const page = el('div', 'ledger-page');
    for (const room of HOUSE_ROOMS) {
      const isOpen = isUnlocked(state, room.surface);
      const line = el('div', `ledger-line ${isOpen ? 'is-open' : 'is-faint'}`);
      // P15 — a room not yet reopened stays UNNAMED (a silhouette line, never a preview).
      line.append(
        el('span', 'ledger-rule', isOpen ? '〇' : '▢'),
        el(
          'span',
          'ledger-name',
          isOpen ? `${room.kanji} · ${room.label}` : '————',
        ),
        el('span', 'ledger-note', isOpen ? 'open' : ''),
      );
      page.append(line);
    }
    page.append(
      el(
        'div',
        'ledger-line is-footing',
        `The house stands at ${state.influence.estate.value} koku.`,
      ),
    );
    card.append(page);
    container.append(card);
    return true;
  }
  // C · THE ROOMS LIST (interim) — the pre-ADR-177 shape.
  const card = el('div', 'rung-card frame');
  card.append(el('div', 'rung-now', 'The house reopens 家'));
  const list = el('div', 'house-room-list');
  for (const room of opened)
    list.append(el('div', 'rung-hint', `${room.kanji} · ${room.label}`));
  if (opened.length === 0)
    list.append(el('div', 'rung-hint', 'The inner house waits, shuttered.'));
  card.append(list);
  container.append(card);
  return true;
}

/** The diverged Bestiary (B / C) — DEV-only, stripped from prod. Default A (the field-guide card
 *  list) ships inline in render.ts; B/C are pure re-presentations of the SAME `bestiaryEntries`
 *  data — an un-faced foe stays fogged in every take (scout-by-fighting). No dispatch: read-only. */
function renderBestiaryVariant(
  variantId: string,
  container: HTMLElement,
  state: GameState,
): boolean {
  if (variantId !== 'bestiary-b' && variantId !== 'bestiary-c') return false;
  const entries = bestiaryEntries(state);
  const known = entries.filter((e) => e.seen).length;

  if (variantId === 'bestiary-b') {
    // ── B · the danger ledger — a ranked ink table, easiest→deadliest, each faced foe carrying a
    //    single CONTINUOUS danger-gauge (A19: ink over pips) that fills as the odds worsen. An
    //    un-faced foe is a fogged row (silhouette + hatched gauge), so the shape is legible but the
    //    threat unknown until met. ──
    const ledger = el('div');
    ledger.style.cssText =
      'border:2px solid var(--ink);background:var(--washi-shade);padding:.55rem .6rem;display:flex;flex-direction:column;gap:.4rem;';
    const banner = el('div');
    banner.style.cssText =
      'display:flex;align-items:baseline;gap:.4rem;border-bottom:1px solid var(--ink-faint);padding-bottom:.3rem;color:var(--ink);';
    const bt = el(
      'span',
      undefined,
      `Danger ledger — ${known} of ${entries.length} recorded`,
    );
    bt.style.fontWeight = '700';
    banner.append(bt);
    const bk = el('span', undefined, '危険帳');
    bk.lang = 'ja';
    bk.style.cssText =
      'margin-left:auto;color:var(--ink-faint);font-size:var(--fs-small);';
    banner.append(bk);
    ledger.append(banner);

    // seen foes ranked easiest (highest win-rate) → deadliest; the fogged ones trail after.
    const ranked = entries
      .slice()
      .sort((a, b) => Number(b.seen) - Number(a.seen) || b.winRate - a.winRate);
    for (const e of ranked) {
      const danger = e.seen ? 1 - e.winRate : 0;
      const row = el('div');
      row.style.cssText = 'display:flex;align-items:center;gap:.5rem;';
      const name = el(
        'span',
        undefined,
        e.seen ? `${e.mob.label} ${e.mob.kanji}` : 'Unknown foe',
      );
      name.style.cssText = `flex:0 0 9rem;color:${e.seen ? 'var(--ink)' : 'var(--ink-faint)'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;
      const track = el('div');
      track.style.cssText =
        'position:relative;flex:1;height:.7rem;border:1px solid var(--ink-faint);background:var(--washi);overflow:hidden;';
      if (e.seen) {
        const fill = el('span');
        // deadlier → fuller + hotter ink (rokusho→ochre→beni as the odds worsen).
        const hue =
          danger >= 0.72
            ? 'var(--beni)'
            : danger >= 0.45
              ? 'var(--ochre)'
              : 'var(--rokusho)';
        fill.style.cssText = `position:absolute;left:0;top:0;height:100%;width:${Math.round(danger * 100)}%;background:${hue};`;
        track.append(fill);
      } else {
        track.style.backgroundImage =
          'repeating-linear-gradient(45deg,var(--washi),var(--washi) 4px,var(--washi-shade) 4px,var(--washi-shade) 8px)';
      }
      const read = el(
        'span',
        undefined,
        e.seen ? `${pct(1 - danger)} win` : 'unknown',
      );
      read.style.cssText = `flex:0 0 4.5rem;text-align:right;font-variant-numeric:tabular-nums;font-size:var(--fs-micro);color:${e.seen ? 'var(--ink-soft)' : 'var(--ink-faint)'};`;
      row.append(name, track, read);
      ledger.append(row);
    }
    container.append(ledger);
    return true;
  }

  // ── C · the 図鑑 scroll — diegetic bestiary entries. Each foe is a scroll row led by a KANJI
  //    "portrait" that inks in once faced (a faint silhouette ？ before), with the field-note prose
  //    and its tell beneath; unfaced foes read as a rumour, not a stat-line. ──
  const scroll = el('div');
  scroll.style.cssText =
    'border:2px solid var(--ink);background:var(--washi);padding:.55rem .65rem;display:flex;flex-direction:column;gap:.5rem;';
  const cap = el('div');
  cap.style.cssText =
    'display:flex;align-items:baseline;gap:.4rem;border-bottom:2px solid var(--ink);padding-bottom:.25rem;color:var(--ink);';
  const ct = el(
    'span',
    undefined,
    `The beasts of the estate — ${known} of ${entries.length} known`,
  );
  ct.style.fontWeight = '700';
  cap.append(ct);
  const ck = el('span', undefined, '図鑑');
  ck.lang = 'ja';
  ck.style.cssText =
    'margin-left:auto;color:var(--ink-faint);font-size:var(--fs-small);';
  cap.append(ck);
  scroll.append(cap);

  for (const e of entries) {
    const row = el('div');
    row.style.cssText = 'display:flex;gap:.6rem;align-items:flex-start;';
    const portrait = el('div');
    portrait.lang = 'ja';
    portrait.textContent = e.seen ? e.mob.kanji : '？';
    portrait.style.cssText =
      `flex:0 0 3rem;height:3rem;display:flex;align-items:center;justify-content:center;` +
      `font-size:1.8rem;border:1px solid ${e.seen ? 'var(--ink)' : 'var(--ink-faint)'};` +
      `background:${e.seen ? 'var(--washi-shade)' : 'var(--washi-deep)'};` +
      `color:${e.seen ? 'var(--ink)' : 'var(--ink-faint)'};`;
    row.append(portrait);
    const body = el('div');
    body.style.cssText =
      'flex:1;min-width:0;display:flex;flex-direction:column;gap:.12rem;';
    const nm = el(
      'span',
      undefined,
      e.seen ? `${e.mob.label} ${e.mob.kanji}` : 'A beast unmet',
    );
    nm.style.cssText = `font-weight:700;color:${e.seen ? 'var(--ink)' : 'var(--ink-faint)'};`;
    body.append(nm);
    if (e.seen) {
      body.append(el('div', 'skill-blurb', e.mob.blurb));
      const note = el(
        'div',
        undefined,
        `Its way in a fight — ${e.tell}. Your odds against it: ${pct(e.winRate)}.`,
      );
      note.style.cssText = 'font-size:var(--fs-micro);color:var(--ink-soft);';
      body.append(note);
    } else {
      const rumour = el(
        'div',
        undefined,
        'Only a rumour so far. Face it, and this entry will ink itself in.',
      );
      rumour.style.cssText =
        'font-size:var(--fs-micro);color:var(--ink-faint);font-style:italic;';
      body.append(rumour);
    }
    row.append(body);
    scroll.append(row);
  }
  container.append(scroll);
  return true;
}

/** The diverged HOME / belongings panel (B / C) — DEV-only, stripped from prod. Default A (the
 *  functional list) ships inline in render.ts; B/C re-present the SAME home data — the header, the
 *  owned belongings (mat + bowl + bought furniture with their comfort), the live comfort-in-effect
 *  tally, and the buyable acquire list. Every buy button drives the REAL `buy_belonging` intent via
 *  the threaded `dispatch`, so a purchase moves the true state (AC-6 — same numbers as the default). */
function renderHomeVariant(
  variantId: string,
  container: HTMLElement,
  state: GameState,
  dispatch: (intent: Intent) => void,
): boolean {
  if (variantId !== 'home-b' && variantId !== 'home-c') return false;

  const tier = HOME_TIERS[0]!;
  const owned = ownedBelongings(state);
  const ownedIds = ownedBelongingIds(state);
  const restB = cornerRestBonus(state); // the corner's property (FB-409 — restRefill applies it only AT the corner)
  const bodyB = homeSatietyBonus(state);
  const storageB = homeStorageBonus(state);
  const settled = homeSetComplete(ownedIds);
  const coin = state.resources.coin ?? 0;
  const acquirable = BELONGINGS.filter(
    (b) => b.source.kind === 'buy' && !ownsBelonging(state, b.id),
  );
  const comfortNote = (def: BelongingDef): string => {
    if (def.homesCook) return 'cook here'; // ADR-120 — the hearth homes the cook verb
    if (!def.comfort) return 'a keepsake';
    switch (def.comfort.kind) {
      case 'rest':
        return `rest +${def.comfort.amount} body`;
      case 'storage':
        return `keeps ${def.comfort.amount} belongings`; // ADR-120 — the chest is storage
      case 'body':
        return `+${def.comfort.amount} max body`;
    }
  };
  // the live comfort-in-effect tally string, shared by both variants (AC-6: the SAME selectors the
  // reducer + the prod default read — a bare corner reads 0, the settled set adds its note).
  const tallyParts: string[] = [];
  if (restB > 0) tallyParts.push(`rest +${restB} body`);
  if (bodyB > 0) tallyParts.push(`+${bodyB} max body`);
  if (storageB > 0) tallyParts.push(`storage for ${storageB} belongings`);
  if (homeHasCook(state)) tallyParts.push('a hearth to cook at');
  const tallyBase =
    tallyParts.length > 0
      ? `Comfort in effect · ${tallyParts.join(' · ')}`
      : 'A bare corner — no comforts yet.';
  const tallyText = settled ? `${tallyBase} · a settled home 整` : tallyBase;
  // a REAL buy button, wired to the reducer via dispatch — disabled when the purse is short.
  const buyButton = (def: BelongingDef, label: string): HTMLButtonElement => {
    const b = el('button', 'verb', label) as HTMLButtonElement;
    b.type = 'button';
    if (def.source.kind !== 'buy') return b;
    const afford = coin >= def.source.coinCost;
    b.disabled = !afford;
    b.title = afford
      ? `Bring it in — pay ${formatCoin(def.source.coinCost)}`
      : `Need ${formatCoin(def.source.coinCost - coin)} more`;
    b.setAttribute(
      'aria-label',
      `Bring a ${def.label.toLowerCase()} into your corner (${comfortNote(def)}) for ${formatCoin(def.source.coinCost)}`,
    );
    b.addEventListener('click', () =>
      dispatch({ type: 'buy_belonging', belongingId: def.id }),
    );
    return b;
  };

  if (variantId === 'home-b') {
    // ── B · 一間 room cutaway — a diegetic view of your quarters. A small woodblock room drawn as a
    //    fixed slot grid; each OWNED belonging sits IN SITU (the futon in its corner, the hearth
    //    sunk in the floor, the chest against the wall, the bowl on the mat), comfort read from where
    //    the piece rests. The acquire list below is framed as "what the room still lacks". ──
    const wrap = el('div', 'home-cutaway');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:.5rem;';

    const head = el('div');
    head.style.cssText =
      'display:flex;align-items:baseline;gap:.4rem;border-bottom:1px solid var(--ink-faint);padding-bottom:.25rem;color:var(--ink);';
    const ht = el('span', undefined, tier.label);
    ht.style.fontWeight = '700';
    const hk = el('span', undefined, tier.kanji);
    hk.lang = 'ja';
    hk.style.cssText =
      'margin-left:auto;color:var(--ink-faint);font-size:var(--fs-small);';
    head.append(ht, hk);
    wrap.append(head);
    wrap.append(el('div', 'skill-blurb', tier.blurb));

    // the room itself — a bordered "tatami" floor; belongings placed in fixed spots, present only
    // when owned. Each spot names its piece + a where-it-sits line so comfort reads spatially.
    const SPOTS: {
      id: string;
      here: string; // where it sits in the room
      col: string;
      row: string;
    }[] = [
      { id: 'straw_mat', here: 'in the corner', col: '1', row: '2' },
      { id: 'bowl', here: 'set on the mat', col: '1', row: '1' },
      { id: 'bedding', here: 'laid over the straw', col: '2', row: '2' },
      { id: 'hearth', here: 'sunk in the floor', col: '2', row: '1' },
      { id: 'chest', here: 'against the wall', col: '3', row: '1' },
    ];
    const room = el('div', 'home-room');
    room.style.cssText =
      'position:relative;display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:minmax(3.4rem,auto);gap:.4rem;' +
      'border:2px solid var(--ink);background:var(--washi-shade);padding:.55rem;' +
      'background-image:repeating-linear-gradient(0deg,transparent,transparent 1.6rem,var(--washi-deep) 1.6rem,var(--washi-deep) calc(1.6rem + 1px));';
    const ownedSet = new Set(owned.map((b) => b.id));
    for (const spot of SPOTS) {
      if (!ownedSet.has(spot.id)) continue;
      const def = BELONGINGS.find((b) => b.id === spot.id)!;
      const piece = el('div', 'home-piece');
      piece.dataset.belonging = def.id;
      piece.style.cssText =
        `grid-column:${spot.col};grid-row:${spot.row};` +
        'display:flex;flex-direction:column;gap:.1rem;align-items:center;justify-content:center;text-align:center;' +
        'border:1px solid var(--ink);background:var(--washi);padding:.3rem .35rem;';
      const k = el('span', undefined, def.kanji);
      k.lang = 'ja';
      k.style.cssText = 'font-size:1.5rem;line-height:1;color:var(--ink);';
      const nm = el('span', undefined, def.label.replace(/^A /, ''));
      nm.style.cssText = 'font-size:var(--fs-micro);color:var(--ink-soft);';
      piece.append(k, nm);
      piece.append(navHomeTag(spot.here, 'var(--ink-faint)'));
      if (def.comfort)
        piece.append(navHomeTag(comfortNote(def), 'var(--rokusho)'));
      piece.title = def.blurb;
      room.append(piece);
    }
    wrap.append(room);

    // the live comfort-in-effect tally — the same reading the prod default shows.
    const tally = el('div', 'home-cutaway-tally', tallyText);
    tally.style.cssText = `color:${tallyParts.length > 0 ? 'var(--rokusho)' : 'var(--ink-soft)'};font-size:var(--fs-small);`;
    wrap.append(tally);

    // "what the room still lacks" — the acquire list, diegetically framed.
    if (acquirable.length > 0) {
      const lackHead = el('div', undefined, 'What the room still lacks');
      lackHead.style.cssText =
        'color:var(--ink-soft);font-family:var(--font-head);font-size:var(--fs-small);letter-spacing:.04em;margin-top:.15rem;';
      wrap.append(lackHead);
      for (const def of acquirable) {
        if (def.source.kind !== 'buy') continue;
        const line = el('div', 'home-lack-row');
        line.dataset.belonging = def.id;
        line.style.cssText =
          'display:flex;align-items:center;gap:.5rem;border-top:1px dotted var(--ink-faint);padding:.35rem 0;';
        const k = el('span', undefined, def.kanji);
        k.lang = 'ja';
        k.style.cssText =
          'font-size:1.2rem;color:var(--ink-soft);flex:0 0 auto;';
        const mid = el('div');
        mid.style.cssText =
          'flex:1;min-width:0;display:flex;flex-direction:column;gap:.08rem;';
        const nm = el('span', undefined, `${def.label} — ${comfortNote(def)}`);
        nm.style.cssText = 'color:var(--ink);';
        mid.append(nm, el('div', 'skill-blurb', def.blurb));
        line.append(k, mid, buyButton(def, formatCoin(def.source.coinCost)));
        wrap.append(line);
      }
    } else {
      wrap.append(
        el(
          'div',
          'skill-blurb',
          'The room wants for nothing more — a settled corner.',
        ),
      );
    }
    container.append(wrap);
    return true;
  }

  // ── C · 持ち物帳 possessions ledger — a household register in the steward's hand. Owned pieces are
  //    ruled ledger lines (kanji · name · a marginal comfort annotation on the right); the running
  //    comfort tally is the foot line; buyable pieces trail as UNFILLED ledger lines you may ink in
  //    with a coin. Terse, calm, ink-on-washi. ──
  const ledger = el('div', 'home-ledger');
  ledger.style.cssText =
    'border:1px solid var(--ink);background:var(--washi);padding:.5rem .6rem;display:flex;flex-direction:column;gap:.3rem;';
  const cap = el('div');
  cap.style.cssText =
    'display:flex;align-items:baseline;gap:.4rem;border-bottom:2px solid var(--ink);padding-bottom:.25rem;color:var(--ink);';
  const ct = el(
    'span',
    undefined,
    `${tier.label} — a register of what is yours`,
  );
  ct.style.fontWeight = '700';
  const ck = el('span', undefined, '持ち物帳');
  ck.lang = 'ja';
  ck.style.cssText =
    'margin-left:auto;color:var(--ink-faint);font-size:var(--fs-small);';
  cap.append(ct, ck);
  ledger.append(cap);

  for (const def of owned) {
    const row = el('div', 'home-ledger-row');
    row.dataset.belonging = def.id;
    row.style.cssText =
      'display:flex;align-items:baseline;gap:.5rem;border-bottom:1px solid var(--ink-faint);padding:.3rem 0;';
    const k = el('span', undefined, def.kanji);
    k.lang = 'ja';
    k.style.cssText = 'flex:0 0 1.6rem;font-size:1.15rem;color:var(--ink);';
    const nm = el('span', undefined, def.label);
    nm.style.cssText =
      'flex:1;min-width:0;color:var(--ink);overflow:hidden;text-overflow:ellipsis;';
    const note = el('span', undefined, comfortNote(def));
    note.style.cssText = `flex:0 0 auto;text-align:right;font-size:var(--fs-micro);font-variant-numeric:tabular-nums;color:${def.comfort ? 'var(--rokusho)' : 'var(--ink-faint)'};`;
    row.append(k, nm, note);
    ledger.append(row);
  }

  // the running comfort total — the ledger foot line (the SAME tally the default shows).
  const foot = el('div', 'home-ledger-foot', tallyText);
  foot.style.cssText = `align-self:flex-start;padding-top:.15rem;font-variant-numeric:tabular-nums;color:${tallyParts.length > 0 ? 'var(--rokusho)' : 'var(--ink-soft)'};`;
  ledger.append(foot);

  // the UNFILLED ledger lines — pieces you may still ink into the register with a coin.
  if (acquirable.length > 0) {
    const unfilledHead = el('div', undefined, '未入 — lines yet to fill');
    unfilledHead.lang = 'ja';
    unfilledHead.style.cssText =
      'color:var(--ink-soft);font-size:var(--fs-small);border-top:2px solid var(--ink);padding-top:.3rem;margin-top:.15rem;';
    ledger.append(unfilledHead);
    for (const def of acquirable) {
      if (def.source.kind !== 'buy') continue;
      const row = el('div', 'home-unfilled-row');
      row.dataset.belonging = def.id;
      row.style.cssText =
        'display:flex;align-items:center;gap:.5rem;border-bottom:1px dotted var(--ink-faint);padding:.3rem 0;';
      const k = el('span', undefined, def.kanji);
      k.lang = 'ja';
      k.style.cssText =
        'flex:0 0 1.6rem;font-size:1.1rem;color:var(--ink-soft);';
      const nm = el('span', undefined, `${def.label} · ${comfortNote(def)}`);
      nm.style.cssText = 'flex:1;min-width:0;color:var(--ink-soft);';
      const price = el('span', undefined, formatCoin(def.source.coinCost));
      price.style.cssText =
        'flex:0 0 auto;color:var(--ink-soft);font-variant-numeric:tabular-nums;white-space:nowrap;';
      row.append(k, nm, price, buyButton(def, '記す'));
      ledger.append(row);
    }
  }
  container.append(ledger);
  return true;
}

/** A muted one-line affordance tag inside the room cutaway (where a piece sits / its comfort). */
function navHomeTag(text: string, color: string): HTMLElement {
  const t = el('div', undefined, text);
  t.style.cssText = `font-size:var(--fs-micro);color:${color};`;
  return t;
}

/** The diverged House-Influence grade visual (B / C). The shared frame / head / silhouettes /
 *  ascend CTA live in render.ts (default A ships to prod); only this grade block diverges. */
function renderInfluenceGrade(
  variantId: string,
  card: HTMLElement,
  state: GameState,
): boolean {
  const est = state.influence.estate;
  const bands = balance.ESTATE_BANDS;
  if (variantId === 'influence-b') {
    // B — three lacquer band-boxes (Good / Great / Excellent); reached bands lit, the current
    // one partially filled. (The old B bug — fill used `color`, not `background` — is fixed.)
    const wrap = el('div', 'influence-seg');
    wrap.style.cssText = 'display:flex;gap:.4rem;margin:.5rem 0;';
    const segs: { label: string; lo: number; hi: number }[] = [
      { label: 'Good 良', lo: 0, hi: bands.good },
      { label: 'Great 優', lo: bands.good, hi: bands.great },
      { label: 'Excellent 秀', lo: bands.great, hi: bands.excellent },
    ];
    const hue = ['var(--ai)', 'var(--ochre)', 'var(--gold)'];
    segs.forEach((s, i) => {
      const frac = Math.max(0, Math.min(1, (est.value - s.lo) / (s.hi - s.lo)));
      const box = el('div');
      box.style.cssText =
        'flex:1;position:relative;height:2.4rem;border:1px solid var(--ink-faint);border-radius:2px;overflow:hidden;background:var(--washi);';
      const fill = el('span');
      fill.style.cssText = `position:absolute;left:0;bottom:0;width:100%;height:${Math.round(frac * 100)}%;background:${hue[i]};opacity:.85;`;
      const lab = el('span', undefined, s.label);
      lab.style.cssText =
        'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:var(--fs-micro)/1 var(--font-body);color:var(--ink);';
      box.append(fill, lab);
      wrap.append(box);
    });
    card.append(wrap);
  } else if (variantId === 'influence-c') {
    // C — "standing marks": a row of ink pips ◆◇ filling toward Excellent (a diegetic tally).
    const MARKS = 12;
    const filled = Math.round(Math.min(1, est.value / bands.excellent) * MARKS);
    const row = el('div', 'influence-marks');
    row.style.cssText = 'margin:.5rem 0;letter-spacing:.18em;font-size:1.1rem;';
    let marks = '';
    for (let i = 0; i < MARKS; i++) marks += i < filled ? '◆' : '◇';
    const span = el('span', undefined, marks);
    span.style.color = 'var(--gold)';
    row.append(span);
    card.append(row);
  } else {
    return false;
  }
  // ADR-107: keep the DEV variants' footer koku-consistent with the prod default's re-skin.
  card.append(
    el(
      'div',
      'influence-when',
      `The season re-assesses at ${formatKMB(est.highWater)} koku.`,
    ),
  );
  return true;
}

/** The diverged Craft panel (B / C) — DEV-only, stripped from prod. The shared chrome (recipe
 *  title, intro blurb, and the dispatch-bound Forge button) stays inline in render.ts (default A
 *  ships); only the material-status DISPLAY portion diverges, rendered into `container`. Pure
 *  presentation of the same data — no dispatch needed (the Forge button is shared). */
function renderCraftVariant(
  variantId: string,
  container: HTMLElement,
  state: GameState,
): boolean {
  // Mirror render.ts: the NEXT un-crafted recipe in progression order (axe → yari, A3), so the
  // DEV variants show the same card the default renderer does — not a stale RECIPES[0].
  const recipe =
    RECIPES.find((r) => !state.flags[`crafted-${r.outputWeapon}`]) ??
    RECIPES[0]!;
  const can = canCraft(state.resources, recipe);
  const inputs = Object.entries(recipe.inputs);

  if (variantId === 'craft-b') {
    // B — "the smith's measures": each material a single CONTINUOUS ink fill-gauge (A19:
    // continuous ink over a bare number) filling toward what the recipe asks. The exact
    // tabular have/need stays beside it, so no count is lost; gold when full, ochre while short.
    const wrap = el('div', 'craft-measures');
    wrap.style.cssText =
      'margin:.4rem 0;display:flex;flex-direction:column;gap:.45rem;';
    for (const [mat, need] of inputs) {
      const have = state.resources[mat] ?? 0;
      const m = getMaterial(mat);
      const full = have >= need;
      const frac = need > 0 ? Math.max(0, Math.min(1, have / need)) : 1;
      const row = el('div', 'craft-measure');
      row.style.cssText = 'display:flex;flex-direction:column;gap:.15rem;';
      const head = el('div');
      head.style.cssText =
        'display:flex;justify-content:space-between;align-items:baseline;gap:.5rem;';
      head.append(el('span', undefined, `${m.label} ${m.kanji}`));
      const tally = el(
        'span',
        undefined,
        full
          ? `${have}/${need} · 足`
          : `${have}/${need} · ${need - have} wanting`,
      );
      tally.style.cssText =
        'font-variant-numeric:tabular-nums;color:var(--ink);white-space:nowrap;';
      tally.title = full
        ? 'This measure runs full.'
        : `Fell more foes — ${need - have} more ${m.label.toLowerCase()} wanting.`;
      head.append(tally);
      row.append(head);
      const track = el('div');
      track.style.cssText =
        'position:relative;height:.7rem;border:1px solid var(--ink-faint);' +
        'background:var(--washi-shade);overflow:hidden;';
      const fill = el('span');
      fill.style.cssText =
        `position:absolute;left:0;top:0;height:100%;width:${Math.round(frac * 100)}%;` +
        `background:${full ? 'var(--gold)' : 'var(--ochre)'};`;
      track.append(fill);
      row.append(track);
      wrap.append(row);
    }
    container.append(wrap);
    container.append(
      el(
        'div',
        'skill-blurb',
        can
          ? 'Every measure runs full — strike the smithy and bind the axe.'
          : 'The axe binds once every measure runs full.',
      ),
    );
    return true;
  }

  if (variantId === 'craft-c') {
    // C — "what the axe waits on": a FOCUSED DIEGETIC assembly readout (A19: a focused in-world
    // view over an abstract tally). Each material is the part it becomes — its blurb names the
    // role — with a left ink-rule gold-once-gathered / indigo-while-wanting, and a 整/未 verdict.
    const list = el('div', 'craft-assembly');
    list.style.cssText =
      'margin:.4rem 0;display:flex;flex-direction:column;gap:.5rem;';
    for (const [mat, need] of inputs) {
      const have = state.resources[mat] ?? 0;
      const m = getMaterial(mat);
      const full = have >= need;
      const part = el('div');
      part.style.cssText =
        `display:flex;gap:.5rem;padding-left:.5rem;` +
        `border-left:3px solid ${full ? 'var(--gold)' : 'var(--ai)'};`;
      const kan = el('span', undefined, m.kanji);
      kan.style.cssText = 'font-size:1.3rem;line-height:1.1;color:var(--ink);';
      part.append(kan);
      const body = el('div');
      body.style.cssText = 'flex:1;';
      const headRow = el('div');
      headRow.style.cssText =
        'display:flex;justify-content:space-between;align-items:baseline;gap:.5rem;';
      headRow.append(el('span', undefined, m.label));
      const status = el(
        'span',
        undefined,
        full
          ? `${have}/${need} · 足`
          : `${have}/${need} · ${need - have} wanting`,
      );
      status.style.cssText =
        'font-variant-numeric:tabular-nums;color:var(--ink);white-space:nowrap;';
      status.title = full
        ? 'This part is gathered.'
        : `Fell more foes — ${need - have} more ${m.label.toLowerCase()} wanting.`;
      headRow.append(status);
      body.append(headRow);
      body.append(el('div', 'skill-blurb', m.blurb));
      part.append(body);
      list.append(part);
    }
    container.append(list);
    const verdict = el(
      'div',
      undefined,
      can
        ? '整 — the bench is set; bind the axe.'
        : '未 — the bench wants for materials yet.',
    );
    verdict.style.cssText =
      `margin-top:.35rem;font-weight:700;font-variant-numeric:tabular-nums;` +
      `color:${can ? 'var(--gold)' : 'var(--shu)'};`;
    container.append(verdict);
    return true;
  }

  return false;
}

/** The diverged travelling-market visual (B / C) — DEV-only. The shared stall heading + intro
 *  blurb stay in render.ts (default A — the price-button list — ships); only the GOODS
 *  presentation diverges. Buy buttons drive the real reducer via the threaded `dispatch`. */
function renderMarketVariant(
  variantId: string,
  card: HTMLElement,
  state: GameState,
  dispatch: (intent: Intent) => void,
): boolean {
  const buy = (itemId: string): void => dispatch({ type: 'buy_item', itemId });
  const coin = state.resources.coin ?? 0;
  const grantStr = (item: MarketItem): string =>
    Object.entries(item.grants)
      .map(([r, n]) => `+${n} ${r}`)
      .join(', ');

  if (variantId === 'market-b') {
    // B — the posted price-board (品書 shinagaki): one notice, each good a justified ledger line —
    // name, a dotted leader, grant + price right-aligned tabular, then a 求 ("buy") verb. Stock +
    // any coin shortfall read as plain ink beneath, so an unaffordable good is HINTED, never grey.
    const board = el('div', 'market-board');
    board.style.cssText =
      'margin:.5rem 0;border-top:1px solid var(--ink-faint);padding-top:.2rem;';
    for (const item of MARKET_ITEMS) {
      const bought = state.marketBought[item.id] ?? 0;
      const remaining = item.stockCap - bought;
      const capped = remaining <= 0;
      const affordable = canBuy(state.resources, item, bought);

      const line = el('div', 'market-board-line');
      line.style.cssText =
        'display:flex;align-items:center;gap:.45rem;padding:.3rem 0 .1rem;';
      const name = el('span', undefined, item.label);
      name.style.cssText = 'color:var(--ink);white-space:nowrap;';
      const leader = el('span');
      leader.style.cssText =
        'flex:1;height:0;border-bottom:1px dotted var(--ink-faint);min-width:1.5rem;';
      leader.setAttribute('aria-hidden', 'true');
      const grant = el('span', undefined, grantStr(item));
      grant.style.cssText =
        'color:var(--rokusho);font-variant-numeric:tabular-nums;white-space:nowrap;';
      const price = el('span', undefined, formatCoin(item.coinCost));
      price.style.cssText =
        'color:var(--ink-soft);font-variant-numeric:tabular-nums;min-width:5rem;text-align:right;white-space:nowrap;';
      const verb = el('button', 'verb', capped ? '尽' : '求');
      verb.type = 'button';
      verb.disabled = !affordable;
      verb.setAttribute(
        'aria-label',
        `Buy ${item.label} (${grantStr(item)}) for ${formatCoin(item.coinCost)}${capped ? ' — sold out' : ''}`,
      );
      verb.title = capped
        ? "You've taken all the pedlar carries this run."
        : affordable
          ? `Pay ${formatCoin(item.coinCost)}`
          : `Need ${formatCoin(item.coinCost - coin)} more`;
      verb.addEventListener('click', () => buy(item.id));
      line.append(name, leader, grant, price, verb);

      const hintText = capped
        ? 'sold out'
        : affordable
          ? `${remaining} left`
          : `${remaining} left · need ${formatCoin(item.coinCost - coin)} more`;
      const hint = el('div', 'lock-hint', hintText);
      hint.style.cssText = 'margin:0 0 .25rem;font-style:italic;';
      board.append(line, hint);
    }
    card.append(board);
    return true;
  }

  if (variantId === 'market-c') {
    // C — the pedlar's ground-cloth: the purse up top, each good led by ONE curated good-emoji,
    // the price to the right, and REMAINING stock as CONTINUOUS INK (an ochre bar shortening as
    // the cloth empties, A19 — not pips). Unaffordable goods name the coin shortfall, not grey.
    const icon: Record<string, string> = {
      greens_sack: '🌿',
      wood_bundle: '🪵',
      whetstone_kit: '🪨',
      greens_basket: '🧺',
    };
    const purse = el('div', 'lock-hint', `Your purse · ${formatCoin(coin)}`);
    purse.style.cssText =
      'margin:.4rem 0 .2rem;color:var(--ink-soft);font-variant-numeric:tabular-nums;align-self:flex-start;';
    card.append(purse);
    for (const item of MARKET_ITEMS) {
      const bought = state.marketBought[item.id] ?? 0;
      const remaining = item.stockCap - bought;
      const capped = remaining <= 0;
      const affordable = canBuy(state.resources, item, bought);
      const frac = item.stockCap > 0 ? remaining / item.stockCap : 0;

      const row = el('div', 'market-cloth-row');
      row.style.cssText =
        'display:flex;align-items:flex-start;gap:.55rem;padding:.45rem 0;border-top:1px solid var(--ink-faint);';
      const glyph = el('span', undefined, icon[item.id] ?? '🎒');
      glyph.style.cssText = 'font-size:1.5rem;line-height:1.1;flex:0 0 auto;';
      glyph.setAttribute('aria-hidden', 'true');
      const mid = el('div');
      mid.style.cssText =
        'flex:1;display:flex;flex-direction:column;gap:.14rem;min-width:0;';
      const nameLine = el('span', undefined, item.label);
      nameLine.style.cssText = 'color:var(--ink);';
      const grant = el('span', undefined, grantStr(item));
      grant.style.cssText =
        'color:var(--rokusho);font-variant-numeric:tabular-nums;';
      const track = el('div');
      track.style.cssText =
        'height:.28rem;max-width:7rem;background:var(--washi-shade);margin-top:.15rem;';
      const ink = el('div');
      ink.style.cssText = `height:100%;width:${Math.round(frac * 100)}%;background:${capped ? 'var(--ink-faint)' : 'var(--ochre)'};`;
      track.append(ink);
      const stockText = capped
        ? 'cloth bare · sold out'
        : affordable
          ? `${remaining} of ${item.stockCap} left`
          : `${remaining} of ${item.stockCap} left · need ${formatCoin(item.coinCost - coin)} more`;
      const stockLabel = el('span', 'lock-hint', stockText);
      stockLabel.style.cssText =
        'font-style:italic;font-variant-numeric:tabular-nums;align-self:flex-start;';
      mid.append(nameLine, grant, track, stockLabel);
      const right = el('div');
      right.style.cssText =
        'flex:0 0 auto;display:flex;flex-direction:column;align-items:flex-end;gap:.25rem;';
      const price = el('span', undefined, formatCoin(item.coinCost));
      price.style.cssText =
        'color:var(--ink-soft);font-variant-numeric:tabular-nums;white-space:nowrap;';
      const take = el('button', 'verb', capped ? 'gone' : 'take 取');
      take.type = 'button';
      take.disabled = !affordable;
      take.setAttribute(
        'aria-label',
        `Buy ${item.label} (${grantStr(item)}) for ${formatCoin(item.coinCost)}${capped ? ' — sold out' : ''}`,
      );
      take.title = capped
        ? "You've taken all the pedlar carries this run."
        : affordable
          ? `Take it — pay ${formatCoin(item.coinCost)}`
          : `Need ${formatCoin(item.coinCost - coin)} more`;
      take.addEventListener('click', () => buy(item.id));
      right.append(price, take);
      row.append(glyph, mid, right);
      card.append(row);
    }
    return true;
  }

  return false;
}

/** The diverged Quests surface (B / C) — DEV-only. The shared <h2> title ("Quests 用") stays in
 *  render.ts; each variant supplies its own diegetic framing + body for the SAME data. Accept
 *  buttons drive the real reducer via the threaded `dispatch`. */
function renderQuestsVariant(
  variantId: string,
  container: HTMLElement,
  state: GameState,
  dispatch: (intent: Intent) => void,
): boolean {
  if (variantId !== 'quests-b' && variantId !== 'quests-c') return false;

  // kind → a brushed category stamp (kanji + roman word) + its accent. Colour is ALWAYS backed by
  // the word text (§9). The keys match QuestKind exactly, so KIND[q.kind] is total.
  const KIND = {
    PEST: { kanji: '害', word: 'PEST', accent: 'var(--beni)' },
    HUNT: { kanji: '狩', word: 'HUNT', accent: 'var(--ai)' },
    CLEAR: { kanji: '掃', word: 'CLEAR', accent: 'var(--ochre)' },
    DEFEND: { kanji: '守', word: 'DEFEND', accent: 'var(--rokusho)' },
  };
  const take = (questId: string): void =>
    dispatch({ type: 'accept_quest', questId });

  if (variantId === 'quests-b') {
    // ── B · 高札場 — the village notice-board. Each quest a posted commission-bill; progress reads
    //    as ONE CONTINUOUS ink "deeds answered" stroke (A19), the deeds fine-listed beneath. ──
    const board = el('div');
    board.style.cssText =
      'border:2px solid var(--ink);background:var(--washi-shade);padding:.55rem .6rem;' +
      'display:flex;flex-direction:column;gap:.55rem;';
    const banner = el('div');
    banner.style.cssText =
      'display:flex;align-items:baseline;gap:.4rem;border-bottom:1px solid var(--ink-faint);padding-bottom:.3rem;color:var(--ink);';
    banner.append(el('span', undefined, '📜'));
    const bTitle = el('span', undefined, 'Kōsatsu — the village notice-board');
    bTitle.style.fontWeight = '700';
    banner.append(bTitle);
    const bKanji = el('span', undefined, '高札場');
    bKanji.lang = 'ja';
    bKanji.style.cssText =
      'margin-left:auto;color:var(--ink-faint);font-size:var(--fs-small);';
    banner.append(bKanji);
    board.append(banner);

    for (const q of QUESTS) {
      const done = new Set(state.quests.progress[q.id] ?? []);
      const completed = state.quests.completed.includes(q.id);
      const accepted = state.quests.accepted.includes(q.id);
      const k = KIND[q.kind];

      const bill = el('div');
      bill.style.cssText =
        'border:1px solid var(--ink-faint);border-left:4px solid ' +
        k.accent +
        ';background:var(--washi);padding:.4rem .5rem;display:flex;flex-direction:column;gap:.32rem;';
      const head = el('div');
      head.style.cssText =
        'display:flex;align-items:baseline;gap:.45rem;flex-wrap:wrap;';
      const stamp = el('span');
      stamp.style.cssText =
        'display:inline-flex;align-items:baseline;gap:.2rem;color:' +
        k.accent +
        ';border:1px solid currentColor;padding:0 .25rem;font-size:var(--fs-micro);font-weight:700;';
      const stampKanji = el('span', undefined, k.kanji);
      stampKanji.lang = 'ja';
      stamp.append(stampKanji, el('span', undefined, k.word));
      head.append(stamp);
      const title = el('span', undefined, q.title);
      title.style.cssText = 'font-weight:700;color:var(--ink);';
      head.append(title);
      if (completed) {
        const fulfilled = el('span', undefined, '果 fulfilled ✓');
        fulfilled.style.cssText =
          'margin-left:auto;color:var(--shu-deep);font-weight:700;font-size:var(--fs-small);';
        head.append(fulfilled);
      }
      bill.append(head);
      bill.append(el('div', 'skill-blurb', q.blurb));

      if (accepted || completed) {
        const total = q.steps.length;
        const ndone = q.steps.filter((s) => done.has(s.id)).length;
        const frac = total === 0 ? 1 : ndone / total;
        const meter = el('div');
        meter.style.cssText = 'display:flex;align-items:center;gap:.5rem;';
        const bar = el('div');
        bar.style.cssText =
          'position:relative;flex:1;height:.5rem;border:1px solid var(--ink-faint);background:var(--washi-deep);overflow:hidden;';
        const fill = el('span');
        fill.style.cssText =
          'position:absolute;left:0;top:0;bottom:0;background:var(--ink-soft);width:' +
          Math.round(frac * 100) +
          '%;';
        bar.append(fill);
        const count = el('span', undefined, ndone + ' of ' + total + ' deeds');
        count.style.cssText =
          'color:var(--ink-soft);font-size:var(--fs-micro);font-variant-numeric:tabular-nums;white-space:nowrap;';
        meter.append(bar, count);
        bill.append(meter);

        const list = el('div');
        list.style.cssText = 'display:flex;flex-direction:column;gap:.12rem;';
        for (const s of q.steps) {
          const ok = done.has(s.id);
          const row = el('div');
          row.style.cssText =
            'display:flex;gap:.4rem;align-items:baseline;font-size:var(--fs-small);color:' +
            (ok ? 'var(--ink)' : 'var(--ink-soft)') +
            ';';
          const mark = el('span', undefined, ok ? '■' : '□');
          mark.style.color = ok ? 'var(--ink)' : 'var(--ink-faint)';
          row.append(mark, el('span', undefined, s.label));
          list.append(row);
        }
        bill.append(list);

        const rk = q.reward.resources?.coin;
        if (rk && !completed) {
          const reward = el(
            'div',
            undefined,
            'On fulfilment — ' + formatCoin(rk),
          );
          reward.style.cssText =
            'align-self:flex-start;border:1px solid var(--gold);color:var(--gold);padding:0 .3rem;font-size:var(--fs-micro);font-variant-numeric:tabular-nums;';
          bill.append(reward);
        }
      } else {
        const foot = el('div');
        foot.style.cssText =
          'display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;';
        const btn = el('button', 'verb', 'Take the commission 請ける');
        btn.type = 'button';
        btn.addEventListener('click', () => take(q.id));
        foot.append(btn);
        const rk = q.reward.resources?.coin;
        if (rk) {
          const posted = el(
            'span',
            undefined,
            'Posted reward — ' + formatCoin(rk),
          );
          posted.style.cssText =
            'color:var(--ink-soft);font-size:var(--fs-micro);font-variant-numeric:tabular-nums;';
          foot.append(posted);
        }
        bill.append(foot);
      }
      board.append(bill);
    }
    container.append(board);
    return true;
  }

  // ── C · 用帳 — the steward's field-ledger. One aligned entry per commission: a kind stamp, the
  //    name + terse note, an ink deeds-tally, the coin in a right-aligned tabular column (§9), and
  //    a status; a 合計 foot totals the coin in hand. ──
  const ledger = el('div');
  ledger.style.cssText =
    'border:1px solid var(--ink);background:var(--washi);padding:.5rem .6rem;display:flex;flex-direction:column;gap:.3rem;';
  const cap = el('div');
  cap.style.cssText =
    'display:flex;align-items:baseline;gap:.4rem;border-bottom:2px solid var(--ink);padding-bottom:.25rem;color:var(--ink);';
  cap.append(el('span', undefined, '📖'));
  const cTitle = el('span', undefined, 'Field-ledger of commissions');
  cTitle.style.fontWeight = '700';
  cap.append(cTitle);
  const cKanji = el('span', undefined, '用帳');
  cKanji.lang = 'ja';
  cKanji.style.cssText =
    'margin-left:auto;color:var(--ink-faint);font-size:var(--fs-small);';
  cap.append(cKanji);
  ledger.append(cap);

  let coinInHand = 0;
  for (const q of QUESTS) {
    const done = new Set(state.quests.progress[q.id] ?? []);
    const completed = state.quests.completed.includes(q.id);
    const accepted = state.quests.accepted.includes(q.id);
    const k = KIND[q.kind];
    const total = q.steps.length;
    const ndone = q.steps.filter((s) => done.has(s.id)).length;
    const rk = q.reward.resources?.coin ?? 0;
    if (accepted && !completed) coinInHand += rk;

    const row = el('div');
    row.style.cssText =
      'display:flex;align-items:baseline;gap:.5rem;border-bottom:1px solid var(--ink-faint);padding:.32rem 0;';
    const stamp = el('span');
    stamp.style.cssText =
      'flex:0 0 auto;color:' +
      k.accent +
      ';border:1px solid currentColor;padding:0 .25rem;font-size:var(--fs-micro);font-weight:700;';
    const stampKanji = el('span', undefined, k.kanji);
    stampKanji.lang = 'ja';
    stamp.append(stampKanji);
    row.append(stamp);

    const main = el('div');
    main.style.cssText =
      'flex:1;min-width:0;display:flex;flex-direction:column;gap:.08rem;';
    const title = el('span', undefined, q.title);
    title.style.cssText =
      'font-weight:700;color:' +
      (completed ? 'var(--ink-soft)' : 'var(--ink)') +
      ';';
    main.append(title);
    const note = el('span', undefined, k.word + ' · ' + q.blurb);
    note.style.cssText = 'color:var(--ink-soft);font-size:var(--fs-micro);';
    main.append(note);
    row.append(main);

    const deeds = el('span');
    deeds.style.cssText =
      'flex:0 0 auto;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;';
    if (!accepted && !completed) {
      const dash = el('span', undefined, '—');
      dash.style.color = 'var(--ink-faint)';
      deeds.append(dash);
    } else {
      const inked = el('span', undefined, '┃'.repeat(ndone));
      inked.style.color = 'var(--ink)';
      const faint = el('span', undefined, '┃'.repeat(total - ndone));
      faint.style.color = 'var(--ink-faint)';
      const num = el('span', undefined, ' ' + ndone + '/' + total);
      num.style.cssText = 'color:var(--ink-soft);font-size:var(--fs-micro);';
      deeds.append(inked, faint, num);
    }
    row.append(deeds);

    const coin = el('span', undefined, rk ? formatCoin(rk) : '—');
    coin.style.cssText =
      'flex:0 0 4.6rem;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;color:' +
      (rk ? 'var(--gold)' : 'var(--ink-faint)') +
      ';';
    row.append(coin);

    const status = el('span');
    status.style.cssText = 'flex:0 0 auto;text-align:right;';
    if (completed) {
      status.textContent = '果 done ✓';
      status.style.cssText +=
        'color:var(--shu-deep);font-weight:700;font-size:var(--fs-small);';
    } else if (accepted) {
      status.textContent = 'in hand';
      status.style.cssText += 'color:var(--rokusho);font-size:var(--fs-small);';
    } else {
      const btn = el('button', 'verb', 'Take on');
      btn.type = 'button';
      btn.addEventListener('click', () => take(q.id));
      status.append(btn);
    }
    row.append(status);
    ledger.append(row);
  }

  const foot = el(
    'div',
    undefined,
    '合計 — coin in hand: ' + formatCoin(coinInHand),
  );
  foot.style.cssText =
    'align-self:flex-end;color:var(--ink-soft);font-size:var(--fs-micro);font-variant-numeric:tabular-nums;padding-top:.15rem;';
  ledger.append(foot);
  container.append(ledger);
  return true;
}
