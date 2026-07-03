// ui-demos/05-aizome/main.js — Aizome: indigo textile remaster.
// Render + reconcile + engine wiring. The log holds center stage at all
// times; actions live on the right rail as fabric patches; tabs are cloth
// tags. Meters are sashiko stitch-lines that sew themselves in.

import { createEngine, sel } from '../shared/engine.js';
import * as D from '../shared/data.js';
import { formatKMB, formatCoin } from '../shared/format.js';

const eng = createEngine('R1'); // default landing stage: R1

// ── local UI state ───────────────────────────────────────────────────────
const ui = { tab: 'work', filter: 'story', stripOpen: false };

// ── tiny helpers ─────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const intentAttr = (intent) => `data-action="dispatch" data-intent="${esc(JSON.stringify(intent))}"`;

function btn(label, intent, { cls = 'patch-btn', sub = '', disabled = false, title = '' } = {}) {
  return `<button class="${cls}" ${intentAttr(intent)}${disabled ? ' disabled' : ''}${
    title ? ` title="${esc(title)}"` : ''}>${label}${sub ? `<span class="sub">${sub}</span>` : ''}</button>`;
}
const card = (title, body, cls = '') =>
  `<section class="card ${cls}">${title ? `<h2 class="card-h">${title}</h2>` : ''}${body}</section>`;

// stitch meters: fill sews in left→right (width transition from prev value)
const meterPrev = new Map();
function meter(id, val, max, cls = '') {
  const pct = Math.max(0, Math.min(100, max > 0 ? (val / max) * 100 : 0));
  const prev = meterPrev.has(id) ? meterPrev.get(id) : pct;
  meterPrev.set(id, pct);
  return `<div class="stitch-meter"><span class="fill ${cls}" data-meter="${id}" data-target="${pct}" style="width:${prev}%"></span></div>`;
}
function settleMeters(scope) {
  for (const el of scope.querySelectorAll('.fill[data-meter]')) {
    const target = `${el.dataset.target}%`;
    if (el.style.width === target) continue;
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = target; }));
  }
}

// number pop on gain
const prevVals = new Map();
function popClass(key, val) {
  const prev = prevVals.get(key);
  prevVals.set(key, val);
  return prev !== undefined && prev !== val ? ' pop' : '';
}

// region render with signature caching + scroll preservation
const sig = {};
const scrollKeys = {};
function region(id, sigStr, build, scrollKey = '') {
  if (sig[id] === sigStr) return;
  sig[id] = sigStr;
  const el = $(id);
  const keep = scrollKeys[id] === scrollKey;
  const st = keep ? el.scrollTop : 0;
  scrollKeys[id] = scrollKey;
  el.innerHTML = build();
  el.scrollTop = st;
  settleMeters(el);
}

// ── header: the woven vitals band ────────────────────────────────────────
function buildHeader(s) {
  if (s.phase === 'cold-open') return '';
  const V = D.COPY.vitals;
  let h = `<div class="house-mark"><span class="mark-crest"><i></i></span>${esc(D.HOUSE_MARK)}</div>`;
  h += '<div class="vit-sep"></div><div class="vit-group">';
  h += `<div class="vit"><span class="vlab">${V.rice}</span><span class="vnum${popClass('rice', s.resources.rice)}">${formatKMB(s.resources.rice)}</span></div>`;
  if (s.resources.coin + s.banked.coin > 0) {
    h += `<div class="vit"><span class="vlab">${V.coin}</span><span class="vnum brass${popClass('coin', s.resources.coin)}">${esc(formatCoin(s.resources.coin))}</span></div>`;
  }
  if (sel.isUnlocked(s, 'row-wood')) {
    h += `<div class="vit"><span class="vlab">${V.wood}</span><span class="vnum dim${popClass('wood', s.resources.wood)}">${formatKMB(s.resources.wood)}</span></div>`;
  }
  if (sel.isUnlocked(s, 'row-sansai')) {
    h += `<div class="vit"><span class="vlab">${V.sansai}</span><span class="vnum dim${popClass('sansai', s.resources.sansai)}">${formatKMB(s.resources.sansai)}</span></div>`;
  }
  h += '</div>';
  if (sel.isUnlocked(s, 'readout-clock')) {
    const season = sel.seasonOf(s.clock.day);
    h += `<div class="vit-sep"></div><div class="clock"><span class="season">${season.emoji} ${season.label}</span> · Year ${sel.yearOf(s.clock.day)} · day ${sel.dayOfSeason(s.clock.day)}</div>`;
  }
  if (sel.isUnlocked(s, 'verb-face-wolf')) {
    const max = sel.hpMax(s);
    const low = s.character.hp <= max * 0.3;
    h += `<div class="vit-sep"></div><div class="bar-vit">
      <div class="bar-top"><span class="vlab${low ? ' low' : ''}">${V.life}</span><span class="meter-nums${low ? ' low' : ''}">${s.character.hp} / ${max}</span></div>
      ${meter('hp', s.character.hp, max, low ? 'madder' : '')}</div>`;
  }
  if (sel.isUnlocked(s, 'readout-stamina')) {
    const max = sel.satietyMax(s);
    const low = s.character.satiety < max * 0.35;
    h += `<div class="bar-vit">
      <div class="bar-top"><span class="vlab${low ? ' low' : ''}">${V.body}</span><span class="meter-nums${low ? ' low' : ''}">${Math.round(s.character.satiety)} / ${max}</span></div>
      ${meter('satiety', s.character.satiety, max, low ? 'madder' : 'pale')}</div>`;
  }
  // rung head — or the summons, when the house calls
  if (sel.summonsReady(s)) {
    h += `<button class="summons" ${intentAttr({ type: 'begin_rung_beat' })}>${esc(D.COPY.summons)}</button>`;
  } else {
    const r = sel.rung(s);
    h += `<div class="rung-head">
      <div class="rung-line"><span class="rung-title">${esc(r.title)}</span>
      <span class="rung-nums">${Math.min(s.rungMeter, r.threshold)} / ${r.threshold}</span></div>
      ${meter('rung-head', Math.min(s.rungMeter, r.threshold), r.threshold, 'brass')}</div>`;
  }
  return h;
}

// ── nav: cloth tags along the top of the bolt ────────────────────────────
let prevTabIds = null;
function buildNav(s) {
  if (s.phase === 'cold-open' || !sel.navVisible(s)) {
    prevTabIds = [];
    return '';
  }
  const tabs = sel.visibleTabs(s);
  const navNew = prevTabIds !== null && prevTabIds.length === 0;
  const isNew = (id) => prevTabIds !== null && prevTabIds.length > 0 && !prevTabIds.includes(id);
  const html = tabs
    .map((t) => `<button class="tag${t.id === ui.tab ? ' active' : ''}${isNew(t.id) ? ' tag-new' : ''}" data-action="tab" data-tab="${t.id}">${esc(t.label)}</button>`)
    .join('');
  prevTabIds = tabs.map((t) => t.id);
  return `<div class="tags${navNew ? ' nav-new' : ''}">${html}</div>`;
}

// ── work tab ─────────────────────────────────────────────────────────────
function ladderCard(s) {
  if (!(s.flags.raked || s.rungMeter > 0)) return '';
  const r = sel.rung(s);
  const next = sel.nextRung(s);
  const into = Math.min(s.rungMeter, r.threshold);
  let status = '';
  if (sel.meterFull(s)) {
    status = sel.storyGateMet(s)
      ? `<div class="ladder-status ready">${esc(D.COPY.ladderReady)}</div>`
      : `<div class="ladder-status gated">${esc(r.advanceHint ?? D.COPY.ladderEnd)}</div>`;
  }
  const nextLine = next
    ? `<div class="ladder-next">${esc(D.COPY.ladderNext)} ${esc(next.title)}</div>`
    : `<div class="ladder-next">${esc(D.COPY.ladderEnd)}</div>`;
  return card(
    'The ladder',
    `<div class="ladder-title"><span class="chip brass">${r.id}</span><span class="rname">${esc(r.title)}</span></div>
     ${meter('ladder', into, r.threshold, 'brass')}
     <div class="ladder-nums"><span>${esc(D.COPY.ladderService)}</span><span class="num">${into} / ${r.threshold}</span></div>
     ${status}${nextLine}`,
  );
}

function hereCard(s) {
  const node = sel.nodeOf(s);
  return card(
    D.COPY.youStandAt,
    `<div style="font-size:15px;margin-bottom:6px">${esc(node.label)}</div>
     <p class="blurb">${esc(node.blurb)}</p>`,
  );
}

function verbRow(label, intent, { meta = '', auto = null, disabled = false, sub = '', cls = 'patch-btn', title = '' } = {}) {
  let under = '';
  if (meta || auto) {
    under = `<div class="verb-under"><span class="verb-meta">${meta}</span>${auto ?? ''}</div>`;
  }
  return `<div class="verb-row">${btn(label, intent, { disabled, sub, cls, title })}${under}</div>`;
}

function autoChip(on, intent) {
  return `<button class="auto-chip${on ? ' on' : ''}" ${intentAttr(intent)}>${esc(on ? D.COPY.autoOff : D.COPY.autoOn)}</button>`;
}

function buildWorkRail(s) {
  let verbs = '';
  // the wolf beat — the most dramatic patch on the screen
  if (sel.isUnlocked(s, 'verb-face-wolf') && !s.flags['first-fight-survived']) {
    verbs += s.location === 'kura'
      ? `<div class="verb-row">${btn(esc(D.COPY.wolfButton), { type: 'face_wolf' }, { cls: 'patch-btn wolf' })}</div>`
      : `<p class="hint" style="margin-bottom:12px">${esc(D.COPY.wolfAway)}</p>`;
  }
  // R0 meta verbs
  if (s.rung === 'R0' && sel.isUnlocked(s, 'verb-rake')) {
    const autoRevealed = s.rungMeter >= D.BALANCE.RAKE_AUTO_REVEAL_METER || s.flags.raked;
    verbs += verbRow(esc(D.COPY.rakeLabel), { type: 'rake_rice' }, {
      meta: `+${D.BALANCE.RICE_PER_RAKE} rice · −${D.BALANCE.SATIETY_PER_ACT} body`,
      auto: autoRevealed ? autoChip(s.autoRake, { type: 'set_auto_rake', on: !s.autoRake }) : null,
    });
  }
  if (sel.isUnlocked(s, 'verb-rest')) {
    verbs += verbRow(esc(D.COPY.restLabel), { type: 'rest' }, {
      meta: `+${D.BALANCE.SATIETY_PER_REST} body`,
      cls: 'patch-btn secondary',
    });
  }
  // labours at this ground
  const here = sel.laboursHere(s);
  for (const act of here) {
    const yields = Object.entries(act.yields).map(([r, n]) => `+${n} ${r}`).join(' · ');
    const on = s.autoActivity === act.id;
    verbs += verbRow(esc(act.label), { type: 'do_activity', id: act.id }, {
      meta: `${yields} · −${act.satietyCost} body`,
      auto: autoChip(on, { type: 'set_auto', id: on ? null : act.id }),
    });
  }
  if (!here.length && sel.laboursKnown(s).length) {
    verbs += `<p class="hint">${esc(D.COPY.noWorkHere)}</p>`;
  }
  let h = card(D.COPY.workHeader, verbs);

  // meals
  let meals = '';
  if (sel.isUnlocked(s, 'verb-cook')) {
    const hurt = s.character.hp <= sel.hpMax(s) * 0.7;
    const can = s.resources.sansai >= D.BALANCE.COOK_SANSAI_COST;
    meals += verbRow(esc(D.COPY.cookLabel), { type: 'cook_meal' }, {
      meta: `+${D.BALANCE.COOK_HP_RESTORE} life`,
      disabled: !can,
      cls: hurt && can ? 'patch-btn wolf' : 'patch-btn secondary',
      title: can ? '' : 'Not enough sansai',
    });
  }
  if (sel.isUnlocked(s, 'panel-estate')) {
    const can = s.resources.rice >= D.BALANCE.EAT_RICE_COST;
    meals += verbRow(esc(D.COPY.eatRiceLabel), { type: 'eat_rice' }, {
      meta: `+${D.BALANCE.EAT_RICE_SATIETY} body`,
      disabled: !can,
      cls: 'patch-btn secondary',
      title: can ? '' : 'Not enough rice',
    });
  }
  if (meals) h += card('The cookfire', meals);
  // in sparse R0 the ladder lives on the rail (the side pane is furled)
  if (!sel.navVisible(s)) h += ladderCard(s);
  return h;
}

const buildWorkSide = (s) => ladderCard(s) + hereCard(s);

// ── map tab ──────────────────────────────────────────────────────────────
function buildMapSide(s) {
  const node = sel.nodeOf(s);
  let h = card(
    D.COPY.mapHeader,
    `<div class="micro" style="margin-bottom:4px">${esc(D.COPY.youStandAt)}</div>
     <div style="font-size:16px;margin-bottom:6px">${esc(node.label)}</div>
     <p class="blurb">${esc(node.blurb)}</p>`,
  );
  const moves = sel.reachable(s)
    .map(({ node: n, blocked }) =>
      verbRow(esc(n.label), { type: 'move_to', node: n.id }, {
        cls: 'patch-btn small secondary',
        disabled: blocked,
        sub: blocked ? esc(D.COPY.needsConditioning) : '',
      }))
    .join('');
  h += card(D.COPY.onward, moves || `<p class="hint">${esc(D.COPY.noWorkHere)}</p>`);
  return h;
}

function buildMapRail(s) {
  const people = sel.peopleHere(s);
  let h = '';
  if (people.length) {
    const rows = people.map((p) => {
      const open = s.openPersonId === p.id;
      return `<div class="rowline"><div class="grow">
          <div style="font-size:14px;color:var(--cotton)">${esc(p.name)}</div>
          <div class="micro">${esc(p.tell)}</div></div></div>
        <div class="verb-row">${btn(
          esc(open ? D.COPY.leave(p.name) : D.COPY.speakWith(p.name)),
          open ? { type: 'leave' } : { type: 'talk', personId: p.id },
          { cls: 'patch-btn small' },
        )}</div>`;
    }).join('');
    h += card(D.COPY.whosHere, rows);
  } else {
    h += card(D.COPY.whosHere, `<p class="hint">No one keeps this ground just now.</p>`);
  }
  if (s.openPersonId === 'pedlar') {
    const items = D.MARKET_ITEMS.map((it) => {
      const bought = s.marketBought[it.id] ?? 0;
      const left = it.stockCap - bought;
      const grants = Object.entries(it.grants).map(([r, n]) => `+${n} ${r}`).join(' · ');
      const afford = s.resources.coin >= it.coinCost;
      return `<div class="rowline"><div class="grow">
          <div style="color:var(--cotton)">${esc(it.label)} <span class="micro" style="color:var(--brass-2)">${grants}</span></div>
          <div class="micro" style="margin-top:2px">${esc(it.blurb)}</div>
          <div class="micro" style="margin-top:2px">${left > 0 ? `${left} left` : 'Sold out'}</div></div>
        ${btn(`<span class="price">${esc(formatCoin(it.coinCost))}</span>`, { type: 'buy_item', id: it.id }, {
          cls: 'patch-btn small',
          disabled: !afford || left <= 0,
          title: left <= 0 ? 'Sold out' : afford ? '' : 'Not enough coin',
        })}</div>`;
    }).join('');
    h += card(D.COPY.marketHeader, `<p class="blurb" style="margin-bottom:8px">${esc(D.MARKET_BLURB)}</p>${items}`);
    const season = sel.seasonOf(s.clock.day);
    const price = sel.ricePrice(s);
    const n = s.resources.rice;
    h += card(
      D.COPY.sellRiceHeader,
      `<p class="blurb" style="margin-bottom:10px">${esc(D.COPY.sellRiceLine(formatCoin(price), season.label, D.RICE_SELL_GLOSS[season.id]))}</p>
       ${btn(esc(D.COPY.sellAllRice(n, formatCoin(n * price))), { type: 'sell_rice' }, { cls: 'patch-btn small', disabled: n <= 0 })}`,
    );
  }
  return h;
}

// ── estate tab ───────────────────────────────────────────────────────────
function buildEstateSide(s) {
  const next = D.ESTATE_STAGES[s.estateStage];
  let body = `<div style="font-size:16px;margin-bottom:4px">${esc(D.ESTATE_STAGE_NAMES[s.estateStage])}</div>`;
  if (next) {
    const afford = s.resources.coin >= next.coinCost;
    body += `<hr class="stitch-run" style="margin:10px 0">
      <div style="font-size:14.5px;color:var(--cotton);margin-bottom:4px">${esc(next.label)}</div>
      <p class="blurb" style="margin-bottom:6px">${esc(next.blurb)}</p>
      <div class="micro" style="color:var(--brass-2);margin-bottom:10px">+${next.yieldBonusNum}% labour output · +${next.satietyMaxBonus} max body</div>
      <div class="verb-row">${btn(`<span class="price">${esc(formatCoin(next.coinCost))}</span> — ${esc(next.label)}`, { type: 'improve_estate' }, {
        cls: 'patch-btn small',
        disabled: !afford,
        title: afford ? '' : 'Not enough carried coin',
      })}</div>`;
  } else {
    body += `<hr class="stitch-run" style="margin:10px 0">
      <p class="blurb">${esc(D.ESTATE_STAGES[3].logLine)}</p>`;
  }
  return card(D.COPY.estateHeader, body);
}

function buildEstateRail(s) {
  const rooms = D.HOUSE_ROOMS.map((r) =>
    `<div class="rowline locked"><span class="grow">${esc(r.label)}</span><span class="lock-chip">${r.lockRung}</span></div>`).join('');
  let h = card(D.COPY.houseReopens, rooms);
  if (sel.isUnlocked(s, 'panel-house-influence')) {
    const sil = Array.from({ length: D.HOUSE_INFLUENCE.silhouetteRows },
      () => `<div class="rowline locked"><span class="sil">◆ ————————</span></div>`).join('');
    h += card(
      esc(D.HOUSE_INFLUENCE.header),
      `<p class="blurb" style="margin-bottom:8px">${esc(D.HOUSE_INFLUENCE.blurb)}</p>${sil}
       <p class="micro" style="margin-top:10px;font-style:italic">${esc(D.HOUSE_INFLUENCE.lockedFoot)}</p>`,
    );
  }
  return h;
}

// ── inventory tab ────────────────────────────────────────────────────────
function buildInventorySide(s) {
  return card(
    esc(D.STOREHOUSE.header),
    `<p class="blurb" style="margin-bottom:10px">${esc(D.STOREHOUSE.blurb)}</p>
     <hr class="stitch-run" style="margin:10px 0">
     <div class="micro num">${esc(D.COPY.carriedLine(
       formatCoin(s.resources.coin), formatKMB(s.resources.rice),
       formatCoin(s.banked.coin), formatKMB(s.banked.rice),
     ))}</div>`,
  );
}

function buildInventoryRail(s) {
  if (s.location !== 'kura') {
    return card('The kura ledger', `<p class="hint">${esc(D.STOREHOUSE.offNodeBlurb)}</p>`);
  }
  const rows =
    verbRow(esc(D.COPY.storeAllCoin), { type: 'deposit', what: 'coin' }, { cls: 'patch-btn small', disabled: s.resources.coin <= 0, meta: esc(formatCoin(s.resources.coin)) }) +
    verbRow(esc(D.COPY.withdrawAllCoin), { type: 'withdraw', what: 'coin' }, { cls: 'patch-btn small secondary', disabled: s.banked.coin <= 0, meta: esc(formatCoin(s.banked.coin)) }) +
    verbRow(esc(D.COPY.storeAllRice), { type: 'deposit', what: 'rice' }, { cls: 'patch-btn small', disabled: s.resources.rice <= 0, meta: `${formatKMB(s.resources.rice)} rice` }) +
    verbRow(esc(D.COPY.withdrawAllRice), { type: 'withdraw', what: 'rice' }, { cls: 'patch-btn small secondary', disabled: s.banked.rice <= 0, meta: `${formatKMB(s.banked.rice)} rice` });
  return card('The kura ledger', rows);
}

// ── character tab ────────────────────────────────────────────────────────
function buildCharacterSide(s) {
  const skillRows = D.SKILLS.filter((sk) => {
    const st = s.skills[sk.id];
    if (!st) return false;
    if (sk.id === 'conditioning') return sel.isUnlocked(s, 'skill-conditioning');
    return st.xp > 0 || st.level > 1;
  }).map((sk) => {
    const st = s.skills[sk.id];
    const need = 40 + st.level * 30;
    return `<div style="padding:8px 0">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:3px">
        <span style="font-size:14px;color:var(--cotton)">${esc(sk.label)}</span>
        <span class="lv" style="font-size:12px;color:var(--brass-2)">Lv ${st.level}</span></div>
      <div class="micro" style="margin-bottom:6px">${esc(sk.blurb)} <span style="color:var(--brass-2)">+${D.SKILL_YIELD_PER_LEVEL}% yield / lvl</span></div>
      ${meter(`skill-${sk.id}`, st.xp, need)}
      <div class="micro num" style="margin-top:3px;text-align:right">${st.xp} / ${need}</div></div>`;
  }).join('<hr class="stitch-run">');
  let h = card('Skills', skillRows || `<p class="hint">The body learns by doing — work, and it will show here.</p>`);

  if (sel.isUnlocked(s, 'readout-combat-level')) {
    const pts = s.character.attributePoints;
    const attrs = D.ATTRS.map((a) =>
      `<div class="rowline">
        <span class="chip" style="min-width:44px;text-align:center">${a.label}</span>
        <div class="grow"><div style="color:var(--cotton)">${esc(a.name)}</div>
        <div class="micro">${esc(a.gloss)}</div></div>
        <span class="num" style="font-size:15px;color:var(--brass-2)">${s.character.attrs[a.id]}</span>
        <button class="plus-btn" ${intentAttr({ type: 'spend_attribute', attr: a.id })}${pts <= 0 ? ' disabled' : ''}>+1</button>
      </div>`).join('');
    h += card(
      D.COPY.trainingHeader,
      `<div class="micro" style="color:${pts > 0 ? 'var(--brass-2)' : 'var(--pale)'};margin-bottom:6px">${esc(D.COPY.trainingPoints(pts))}</div>${attrs}`,
    );
  }
  return h;
}

function pipHTML(pct) {
  const band = sel.winBand(pct);
  return `<span class="pip ${band.pip}"><i></i>${esc(band.label)} · <span class="num">${pct}%</span></span>`;
}

function buildCharacterRail(s) {
  let h = '';
  if (sel.isUnlocked(s, 'panel-bestiary')) {
    const entries = sel.bestiary(s);
    const faced = entries.filter((e) => e.faced).length;
    const cards = entries.map(({ mob, faced: f }) => f
      ? `<div style="padding:9px 0">
          <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
            <span style="font-size:14px;color:var(--cotton)">${esc(mob.label)}</span>${pipHTML(sel.winRate(s, mob))}</div>
          <div class="micro" style="margin-top:3px;line-height:1.5">${esc(mob.blurb)}</div>
          <div class="micro" style="margin-top:4px;color:var(--pale-2)">Tell — ${esc(mob.tell)}</div>
          <div class="micro" style="color:var(--pale-2)">Haunts — ${esc(mob.haunts)}</div></div>`
      : `<div style="padding:9px 0;opacity:.55">
          <div style="font-size:14px;color:var(--pale)">${esc(D.COPY.bestiaryUnknown)}</div>
          <div class="micro" style="margin-top:3px">${esc(D.COPY.bestiaryNotFaced)}</div></div>`)
      .join('<hr class="stitch-run">');
    h += card(
      D.COPY.bestiaryHeader,
      `<div class="micro" style="margin-bottom:6px">${esc(D.COPY.bestiaryCount(faced, entries.length))}</div>${cards}`,
    );
  }
  if (sel.isUnlocked(s, 'tab-combat')) {
    const quests = D.QUESTS.map((q) => {
      const state = sel.questState(s, q);
      const done = s.quests.progress[q.id] ?? [];
      const steps = q.steps.map((st) => {
        const isDone = done.includes(st.id);
        return `<div class="rowline" style="padding:5px 2px;${isDone ? 'opacity:.55' : ''}">
          <span style="flex:none;color:${isDone ? 'var(--band-good)' : 'var(--pale)'}">${isDone ? '✕' : '◻'}</span>
          <span class="grow" style="${isDone ? 'text-decoration:line-through' : ''}">${esc(st.label)}</span></div>`;
      }).join('');
      const action = state === 'open'
        ? `<div class="verb-row" style="margin-top:8px">${btn(esc(D.COPY.takeThisOn), { type: 'accept_quest', id: q.id }, { cls: 'patch-btn small' })}</div>`
        : `<div style="margin-top:8px"><span class="chip ${state === 'completed' ? 'done' : 'brass'}">${state === 'completed' ? 'Completed' : 'Undertaken'}</span></div>`;
      return `<div style="padding:10px 0;${state === 'completed' ? 'opacity:.6' : ''}">
        <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px">
          <span class="chip madder">${esc(q.kind)}</span>
          <span style="font-size:14.5px;color:var(--cotton)">${esc(q.title)}</span></div>
        <div class="micro" style="line-height:1.5;margin-bottom:6px">${esc(q.blurb)}</div>
        ${steps}
        <div class="micro" style="margin-top:6px;color:var(--brass-2)">${esc(D.COPY.reward(formatCoin(q.rewardCoin)))}</div>
        ${action}</div>`;
    }).join('<hr class="stitch-run">');
    h += card(
      esc(D.QUESTS_HEADER),
      `<div class="micro" style="margin-bottom:4px">${esc(D.QUESTS_BLURB)}</div>${quests}`,
    );
  }
  return h;
}

// ── combat tab ───────────────────────────────────────────────────────────
function buildCombatSide(s) {
  const need = sel.combatXpNeeded(s);
  let h = card(
    'The soldier under the farmhand',
    `<div style="font-size:16px;margin-bottom:8px">${esc(D.COPY.combatLevel(s.character.level))}</div>
     ${meter('combat-xp', s.character.combatXp, need, 'brass')}
     <div class="micro num" style="margin-top:4px;text-align:right">${s.character.combatXp} / ${need}</div>`,
  );
  const w = D.WEAPONS.find((x) => x.id === s.equippedWeapon);
  h += card(
    'In hand',
    `<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:6px">
      <span style="font-size:15px;color:var(--cotton)">${esc(w.label)}</span>
      <span class="chip">${esc(w.archetype)}</span></div>
     <p class="blurb">${esc(w.blurb)}</p>`,
  );
  return h;
}

function buildCombatRail(s) {
  const foes = sel.foesHere(s);
  if (!foes.length) {
    return card(D.COPY.watchHeader, `<p class="hint">${esc(D.COPY.watchEmpty)}</p>`);
  }
  const rows = foes.map((mob) => {
    const faced = s.bestiaryFaced.includes(mob.id);
    const pct = sel.winRate(s, mob);
    const autoOn = s.autoCombat === mob.id && !s.autoCombatRetreat;
    const fleeOn = s.autoCombat === mob.id && s.autoCombatRetreat;
    return `<div style="padding:10px 0">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:3px">
        <span style="font-size:14.5px;color:${faced ? 'var(--cotton)' : 'var(--pale)'}">${esc(faced ? mob.label : D.COPY.bestiaryUnknown)}</span>
        ${pipHTML(pct)}</div>
      <div class="micro" style="line-height:1.5;margin-bottom:8px">${esc(mob.blurb)}</div>
      <div class="verb-row">${btn(esc(D.COPY.fight), { type: 'fight', mobId: mob.id }, { cls: 'patch-btn small' })}
      <div class="verb-under">
        <button class="auto-chip${autoOn ? ' on' : ''}" ${intentAttr({ type: 'set_auto_combat', mobId: autoOn ? null : mob.id, retreat: false })}>${esc(D.COPY.autoToEnd)}</button>
        <button class="auto-chip${fleeOn ? ' on' : ''}" ${intentAttr({ type: 'set_auto_combat', mobId: fleeOn ? null : mob.id, retreat: true })}>${esc(D.COPY.autoFlee)}</button>
      </div></div></div>`;
  }).join('<hr class="stitch-run">');
  return card(D.COPY.watchHeader, rows);
}

// ── the log: incremental reconcile ───────────────────────────────────────
let lastView = [];
let lastFilter = null;
function lineHTML(l, animate) {
  const bullet = D.CHANNEL_BULLET[l.channel] ?? '';
  const speaker = l.voice
    ? `<span class="voice v-${esc(l.voice)}">${l.speaker ? `${esc(l.speaker)} — ` : ''}</span>`
    : '';
  const count = l.count > 1 ? `<span class="count${animate === 'pulse' ? ' pulse' : ''}">×${l.count}</span>` : '';
  return `<div class="line ch-${esc(l.channel)}${animate === true ? ' anim' : ''}" data-lid="${l.id}">
    ${bullet ? `<span class="bullet">${bullet}</span>` : '<span class="bullet"></span>'}
    <span class="ltext">${speaker}${esc(l.text)}</span>${count}</div>`;
}

function renderLogHead(s) {
  region('loghead', JSON.stringify([ui.filter, s.phase]), () => {
    const chips = D.LOG_FILTERS.map((f) =>
      `<button class="filter-chip${f === ui.filter ? ' active' : ''}" data-action="filter" data-filter="${f}">${esc(D.LOG_FILTER_LABELS[f])}</button>`).join('');
    return `<h1 class="log-title">${esc(D.LOG_HEADER)}</h1><div class="filters">${chips}</div>`;
  });
}

function renderLog(s) {
  const cont = $('loglines');
  const view = sel.logView(s, ui.filter);
  const near = cont.scrollHeight - cont.scrollTop - cont.clientHeight < 56;
  const snap = view.map((l) => ({ id: l.id, text: l.text, count: l.count }));

  const mustRebuild =
    lastFilter !== ui.filter ||
    view.length < lastView.length ||
    (view.length && lastView.length && view[0].text !== lastView[0].text);

  if (mustRebuild) {
    cont.innerHTML = view.length
      ? view.map((l) => lineHTML(l, false)).join('')
      : `<p class="hint log-empty">Nothing under this thread yet.</p>`;
    cont.scrollTop = cont.scrollHeight;
  } else {
    const nodes = cont.querySelectorAll('.line');
    let changed = false;
    for (let i = 0; i < lastView.length; i++) {
      if (view[i].text !== lastView[i].text || view[i].count !== lastView[i].count) {
        const el = nodes[i];
        if (el) el.outerHTML = lineHTML(view[i], 'pulse');
        changed = true;
      }
    }
    if (view.length > lastView.length) {
      if (lastView.length === 0) cont.innerHTML = '';
      let tail = '';
      for (let i = lastView.length; i < view.length; i++) tail += lineHTML(view[i], true);
      cont.insertAdjacentHTML('beforeend', tail);
      changed = true;
    }
    if (changed && near) cont.scrollTop = cont.scrollHeight;
  }
  lastView = snap;
  lastFilter = ui.filter;
}

// ── overlays: cold open · VN scenes · ceremony ───────────────────────────
function buildColdOpen() {
  return `<div class="overlay cold">
    <div class="co-title">${esc(D.COLD_OPEN.title)}</div>
    <div class="co-sub">${esc(D.COLD_OPEN.subtitle)}</div>
    <div class="co-stitch"></div>
    <p class="co-lede">${esc(D.COLD_OPEN.lede)}</p>
    <button class="patch-btn co-verb" ${intentAttr({ type: 'open_eyes' })}>${esc(D.COLD_OPEN.verb)}</button>
  </div>`;
}

function vnScene(s) {
  return s.vn.kind === 'intro' ? D.INTRO_SCENES[s.vn.sceneIndex] : D.RUNG_BEATS[s.vn.target];
}

function vnLine(l) {
  if (l.voice === 'narrator' || !l.speaker) {
    return `<p class="vn-line narr">${esc(l.text)}</p>`;
  }
  return `<p class="vn-line say"><span class="vn-speaker" >${esc(l.speaker)} — </span>${esc(l.text)}</p>`;
}

function buildVN(s) {
  const vn = s.vn;
  const scene = vnScene(s);
  const plateLabel = scene.speaker ?? scene.plateLabel ?? '';
  const mono = scene.sealText ?? '·';
  let body = scene.greeting.slice(0, vn.shown).map(vnLine).join('');

  let controls = '';
  if (vn.phase === 'greeting') {
    controls = `<div class="vn-controls"><button class="vn-patch primary" data-action="vn-next">Next ›</button></div>`;
  } else if (vn.phase === 'ask') {
    if (vn.lastAsk) {
      const topic = scene.topics.find((t) => t.id === vn.lastAsk);
      if (topic) body += `<div class="vn-answer">${topic.answer.map(vnLine).join('')}</div>`;
    }
    const topicBtns = scene.topics.map((t) => {
      const asked = vn.asked.includes(t.id);
      const gated = t.gateTopic && !vn.asked.includes(t.gateTopic);
      return `<button class="vn-patch${asked ? ' asked' : ''}" data-action="vn-ask" data-topic="${t.id}"${gated ? ' disabled title="Ask more first"' : ''}>${esc(t.label)}</button>`;
    }).join('');
    controls = `<div class="vn-controls">${topicBtns}
      <button class="vn-patch primary" data-action="vn-done">${esc(D.COPY.doneQuestioning)}</button></div>`;
  } else if (vn.phase === 'decide') {
    const opts = scene.decision.options.map((o) =>
      `<button class="vn-patch" data-action="vn-choose" data-opt="${o.id}">${esc(o.label)}</button>`).join('');
    controls = `<div class="vn-prompt">${esc(scene.decision.prompt)}</div><div class="vn-options">${opts}</div>`;
  } else if (vn.phase === 'resolved') {
    const opt = scene.decision.options.find((o) => o.id === vn.picked);
    if (opt) {
      body += vnLine({ voice: 'player', speaker: 'You', text: opt.say });
      body += vnLine({ voice: scene.voice, speaker: scene.speaker ?? plateLabel, text: opt.react });
      if (opt.perk) {
        const statTxt = opt.stat
          ? `+1 ${opt.stat.up.toUpperCase()} / −1 ${opt.stat.down.toUpperCase()}`
          : '';
        body += `<div class="perk-box"><div class="perk-tag">${esc(D.COPY.perkTag)}</div>
          <div class="perk-name">${esc(opt.perk.name)}</div>
          <div class="perk-desc">${esc(opt.perk.desc)}</div>
          ${statTxt ? `<div class="perk-stat num">${statTxt}</div>` : ''}</div>`;
      }
      if (opt.statBonus) {
        body += `<div class="perk-box"><div class="perk-tag">${esc(D.COPY.perkTag)}</div>
          <div class="perk-desc">${esc(opt.statBonus.note)}</div></div>`;
      }
    }
    controls = `<div class="vn-controls"><button class="vn-patch primary" data-action="vn-continue">${esc(D.COPY.continueBtn)}</button></div>`;
  }

  return `<div class="overlay vn dim"><div class="vn-panel">
    ${plateLabel ? `<div class="plate v-${esc(scene.voice)}"><span class="mono">${esc(mono)}</span><span>${esc(plateLabel)}</span></div>` : ''}
    <div class="vn-lines">${body}</div>${controls}</div></div>`;
}

function buildCeremony(s) {
  const c = s.ceremony;
  return `<div class="overlay cere">
    <svg class="crest" viewBox="0 0 200 200" aria-hidden="true">
      <defs><mask id="crest-mask">
        <circle cx="100" cy="100" r="80" pathLength="100" class="mask-draw"
          fill="none" stroke="#fff" stroke-width="34"
          transform="rotate(-90 100 100)"/>
      </mask></defs>
      <g mask="url(#crest-mask)">
        <circle cx="100" cy="100" r="88" class="st"/>
        <circle cx="100" cy="100" r="74" class="st brass"/>
      </g>
      <g class="crest-core">
        <rect x="66" y="66" width="68" height="68" class="st"
          transform="rotate(45 100 100)"/>
        <text x="100" y="116" text-anchor="middle" class="initial">${esc(D.NAMES.house[0])}</text>
        <path d="M100 8 v10 M100 182 v10 M8 100 h10 M182 100 h10" class="st brass"/>
      </g>
    </svg>
    <div class="cere-tag">${esc(D.COPY.promoted)}</div>
    <div class="cere-title">${esc(c.title)}</div>
    <button class="patch-btn cere-continue" ${intentAttr({ type: 'dismiss_ceremony' })}>${esc(D.COPY.continueBtn)}</button>
  </div>`;
}

function buildOverlay(s) {
  if (s.ceremony) return buildCeremony(s);
  if (s.phase === 'cold-open') return buildColdOpen();
  if (s.phase === 'vn' && s.vn) return buildVN(s);
  return '';
}

// ── stage strip (the review affordance) ──────────────────────────────────
function buildStrip(s) {
  // full-screen moments own the screen — the strip furls until they end
  if (s.phase === 'vn' || s.ceremony) return '';
  const stages = D.STAGES.map((st) =>
    `<button class="strip-btn${s.stageId === st.id ? ' active' : ''}" data-action="stage" data-stage="${st.id}" title="${esc(st.blurb)}">${esc(st.label)}</button>`).join('');
  const inGame = s.phase === 'game';
  const moments = [
    `<button class="strip-btn" data-action="moment" data-moment="intro"${s.phase === 'cold-open' ? '' : ' disabled'}>Play intro</button>`,
    `<button class="strip-btn" data-action="moment" data-moment="wolf"${inGame ? '' : ' disabled'}>Face wolf</button>`,
    `<button class="strip-btn" data-action="moment" data-moment="fight"${inGame ? '' : ' disabled'}>Fight</button>`,
    `<button class="strip-btn" data-action="moment" data-moment="rungup"${inGame && s.rung !== 'R3' ? '' : ' disabled'}>Rung-up</button>`,
  ].join('');
  return `<div class="strip${ui.stripOpen ? ' open' : ''}">
    <div class="strip-body">
      <span class="strip-lab">Stages</span><div class="strip-row">${stages}</div>
      <span class="strip-lab">Moments</span><div class="strip-row">${moments}</div>
    </div>
    <button class="strip-toggle" data-action="strip-toggle">${ui.stripOpen ? 'Close ▾' : 'Stages ▴'}</button>
  </div>`;
}

// The rung-up demo hack lives HERE and only here (VARIANT-SPEC §2): force the
// meter AND the current rung's story-gate flag so the summons can play from a
// staged jump. From R3 the strip disables the button (R4 is out of scope).
function momentRungUp() {
  const s = eng.state;
  if (s.phase !== 'game') return;
  const cur = sel.rung(s);
  if (cur.id === 'R3') return;
  if (cur.storyGateFlag) s.flags[cur.storyGateFlag] = true;
  s.rungMeter = cur.threshold;
  eng.dispatch({ type: 'begin_rung_beat' });
}

function moment(id) {
  if (id === 'intro') {
    if (eng.state.phase !== 'cold-open') eng.setStage('cold-open');
    eng.dispatch({ type: 'open_eyes' });
  } else if (id === 'wolf') {
    const s = eng.state;
    if (!(s.rung === 'R2' && s.location === 'kura' && !s.flags['first-fight-survived'])) {
      eng.setStage('R2');
    }
    ui.tab = 'work';
    eng.dispatch({ type: 'face_wolf' });
  } else if (id === 'fight') {
    if (eng.state.rung !== 'R3') eng.setStage('R3');
    ui.tab = 'combat';
    if (eng.state.location !== 'gate-forecourt') {
      eng.dispatch({ type: 'move_to', node: 'gate-forecourt' });
    }
    eng.dispatch({ type: 'fight', mobId: 'rice_rats' });
  } else if (id === 'rungup') {
    momentRungUp();
  }
}

// ── the frame ────────────────────────────────────────────────────────────
const SIDE_BUILDERS = {
  work: buildWorkSide, map: buildMapSide, estate: buildEstateSide,
  inventory: buildInventorySide, character: buildCharacterSide, combat: buildCombatSide,
};
const RAIL_BUILDERS = {
  work: buildWorkRail, map: buildMapRail, estate: buildEstateRail,
  inventory: buildInventoryRail, character: buildCharacterRail, combat: buildCombatRail,
};

function render(s) {
  // clamp the active tab to what the stage reveals
  const tabs = sel.visibleTabs(s);
  if (!tabs.some((t) => t.id === ui.tab)) ui.tab = 'work';

  const app = $('app');
  app.classList.toggle('phase-cold', s.phase === 'cold-open');
  app.classList.toggle('sparse', !sel.navVisible(s));

  // shared content signature for the two contextual panes
  const paneSig = JSON.stringify([
    ui.tab, s.phase, s.rung, s.rungMeter, s.location, s.openPersonId,
    s.resources, s.banked, s.estateStage, s.skills, s.character, s.flags,
    s.marketBought, s.quests, s.bestiaryFaced, s.autoRake, s.autoActivity,
    s.autoCombat, s.autoCombatRetreat, s.unlocked.length, s.clock.day,
  ]);

  region('vitals', JSON.stringify([
    s.phase, s.resources, s.banked.coin, s.banked.rice, s.clock.day,
    s.character.hp, Math.round(s.character.satiety), s.estateStage,
    s.unlocked.length, s.rung, s.rungMeter, sel.summonsReady(s),
  ]), () => buildHeader(s));
  region('tags', JSON.stringify([tabs.map((t) => t.id), ui.tab, s.phase]), () => buildNav(s));
  region('side', paneSig, () => SIDE_BUILDERS[ui.tab](s), ui.tab);
  region('rail', paneSig, () => RAIL_BUILDERS[ui.tab](s), ui.tab);
  renderLogHead(s);
  renderLog(s);
  region('overlay', JSON.stringify([
    s.phase, s.stageId, s.ceremony,
    s.vn && [s.vn.kind, s.vn.sceneIndex, s.vn.target, s.vn.shown, s.vn.phase,
      s.vn.asked, s.vn.lastAsk, s.vn.picked],
  ]), () => buildOverlay(s));
  region('strip', JSON.stringify([s.stageId, ui.stripOpen, s.phase, s.rung, !!s.ceremony]), () => buildStrip(s));
}

const rerender = () => render(eng.state);

// ── input wiring (event delegation) ──────────────────────────────────────
document.addEventListener('click', (e) => {
  // the strip behaves like a menu: clicking anywhere else furls it
  if (ui.stripOpen && !e.target.closest('#strip')) {
    ui.stripOpen = false;
    rerender();
  }
  const b = e.target.closest('[data-action]');
  if (!b || b.disabled) return;
  const a = b.dataset.action;
  if (a === 'dispatch') eng.dispatch(JSON.parse(b.dataset.intent));
  else if (a === 'tab') { ui.tab = b.dataset.tab; rerender(); }
  else if (a === 'filter') { ui.filter = b.dataset.filter; rerender(); }
  else if (a === 'stage') { ui.tab = 'work'; eng.setStage(b.dataset.stage); }
  else if (a === 'moment') moment(b.dataset.moment);
  else if (a === 'strip-toggle') { ui.stripOpen = !ui.stripOpen; rerender(); }
  else if (a === 'vn-next') eng.dispatch({ type: 'vn_next' });
  else if (a === 'vn-ask') eng.dispatch({ type: 'vn_ask', topicId: b.dataset.topic });
  else if (a === 'vn-done') eng.dispatch({ type: 'vn_done_asking' });
  else if (a === 'vn-choose') eng.dispatch({ type: 'vn_choose', optionId: b.dataset.opt });
  else if (a === 'vn-continue') eng.dispatch({ type: 'vn_continue' });
});

eng.subscribe((state) => render(state));
