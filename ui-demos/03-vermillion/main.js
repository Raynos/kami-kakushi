// ui-demos/03-vermillion/main.js — Vermillion: modern indie polish.
// Render + reconcile + engine wiring. Regions re-render only when their HTML
// actually changes (cheap string compare); the log reconciles append-only so
// arrivals animate; meters animate via a prev-width snap; numbers pop on gain.

import { createEngine, sel } from '../shared/engine.js';
import * as D from '../shared/data.js';
import { formatKMB, formatCoin } from '../shared/format.js';

const eng = createEngine('R1');
window.eng = eng; // demo/QA convenience

// ── tiny helpers ─────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── UI state ─────────────────────────────────────────────────────────────────
const ui = {
  tab: 'work',
  logFilter: 'story',
  lastHTML: new Map(),      // region key -> html (skip identical writes)
  renderedLog: [],          // [{id, count, text}] mirror of the feed DOM
  logFilterRendered: null,
  prevVals: new Map(),      // data-pop key -> value (number pops)
  meterVals: new Map(),     // data-meter key -> width (fill animation)
  knownTabs: new Set(),     // tab reveal animation
  railInit: false,
  renderedTab: null,
  vnKey: '',
  vnPrevShown: 0,
  vnSceneKey: '',
  cereKey: null,
  cereAt: 0,
  prevMaxLogId: -1,
};

// ── region writer (skip when unchanged; keep scroll) ─────────────────────────
function setRegion(key, elId, html) {
  if (ui.lastHTML.get(key) === html) return false;
  const node = $(elId);
  const st = node.scrollTop;
  node.innerHTML = html;
  node.scrollTop = st;
  ui.lastHTML.set(key, html);
  return true;
}

// ── shared fragments ─────────────────────────────────────────────────────────
function paneHead(kicker, title) {
  return `<div class="pane-head"><span class="kicker">${esc(kicker)}</span>
    <h2 class="pane-title">${esc(title)}</h2></div>`;
}
function secHead(title, sub = '') {
  return `<div class="sec-head"><h3>${esc(title)}</h3>${
    sub ? `<span class="sub">${esc(sub)}</span>` : ''}</div>`;
}
function switchHtml({ on, action, arg, extra = '', small = false, labelOn, labelOff }) {
  return `<button class="switch ${small ? 'sm' : ''} ${on ? 'on' : ''}"
      data-action="${action}" data-arg="${arg}" ${extra}>
    <i></i><span>${esc(on ? (labelOn ?? D.COPY.autoOff) : (labelOff ?? D.COPY.autoOn))}</span>
  </button>`;
}
// A big juicy action card. `auto` (optional): {on, action, arg}.
function actCard({ action, arg = '', name, sub = '', skill = '', disabled = false,
                   reason = '', cls = '', barKey = '', auto = null }) {
  return `<div class="act-card ${cls} ${disabled ? 'is-off' : ''}">
    <button class="act-main" data-action="${action}" data-arg="${arg}" ${disabled ? 'disabled' : ''}>
      ${skill ? `<span class="act-skill">${esc(skill)}</span>` : ''}
      <span class="act-name">${esc(name)}</span>
      ${sub ? `<span class="act-sub">${esc(sub)}</span>` : ''}
      ${reason ? `<span class="act-reason">${esc(reason)}</span>` : ''}
      ${barKey ? `<span class="act-bar" data-abar="${barKey}"><i></i></span>` : ''}
    </button>
    ${auto ? switchHtml(auto) : ''}
  </div>`;
}
function meterHtml(key, frac, cls = '') {
  const pct = (Math.max(0, Math.min(1, frac)) * 100).toFixed(1);
  return `<div class="meter ${cls}"><i data-meter="${key}" style="width:${pct}%"></i></div>`;
}
function pipHtml(pct) {
  const band = sel.winBand(pct);
  return `<span class="pip pip-${band.pip}"><i></i>${esc(band.label)} · ${pct}%</span>`;
}

// ═══ HEADER ═══════════════════════════════════════════════════════════════
function renderHeader(s) {
  const V = D.COPY.vitals;
  const parts = [];

  parts.push(`<div class="brand">
    <div class="crest"><i></i></div>
    <div class="brand-text"><span class="kicker">${esc(D.HOUSE_MARK.split(' ')[0])}</span>
      <b>${esc(D.HOUSE_MARK.split(' ').slice(1).join(' '))}</b></div>
  </div>`);

  const chips = [];
  chips.push(chip('rice', V.rice, formatKMB(s.resources.rice)));
  if (s.resources.coin + s.banked.coin > 0)
    chips.push(chip('coin', V.coin, formatCoin(s.resources.coin), 'coin'));
  if (sel.isUnlocked(s, 'row-wood'))
    chips.push(chip('wood', V.wood, formatKMB(s.resources.wood)));
  if (sel.isUnlocked(s, 'row-sansai'))
    chips.push(chip('sansai', V.sansai, formatKMB(s.resources.sansai)));
  if (sel.isUnlocked(s, 'readout-clock')) {
    const season = sel.seasonOf(s.clock.day);
    chips.push(`<div class="chip clock"><span>${season.emoji} ${esc(season.label)}</span>
      <b>Year ${sel.yearOf(s.clock.day)} · Day ${sel.dayOfSeason(s.clock.day)}</b></div>`);
  }
  parts.push(`<div class="vitals">${chips.join('')}</div>`);

  const bars = [];
  if (sel.isUnlocked(s, 'verb-face-wolf')) {
    const max = sel.hpMax(s);
    const low = s.character.hp <= max * 0.3;
    bars.push(vbar('hp', V.life, s.character.hp, max, `life ${low ? 'low' : ''}`));
  }
  if (sel.isUnlocked(s, 'readout-stamina'))
    bars.push(vbar('body', V.body, s.character.satiety, sel.satietyMax(s), 'body'));
  if (bars.length) parts.push(`<div class="bars">${bars.join('')}</div>`);

  // rung head / the summons
  const r = sel.rung(s);
  let rung;
  if (sel.summonsReady(s)) {
    rung = `<button class="summons" data-action="summons">
      <span class="summons-k">The meter is full</span><b>${esc(D.COPY.summons)}</b></button>`;
  } else {
    const frac = s.rungMeter / r.threshold;
    rung = `<div class="rung-head">
      <div class="rung-line"><span class="rung-plate"><span>${r.id}</span></span><b>${esc(r.title)}</b></div>
      <div class="rung-meter"><i data-meter="rung-h" style="width:${(Math.min(1, frac) * 100).toFixed(1)}%"></i></div>
      <div class="rung-nums">${s.rungMeter} <span>/ ${r.threshold}</span></div>
    </div>`;
  }
  parts.push(`<div class="rung-wrap">${rung}</div>`);

  setRegion('hdr', 'hdr', parts.join(''));
}
function chip(key, label, val, cls = '') {
  return `<div class="chip ${cls}" data-pop="${key}:${esc(val)}">
    <span>${esc(label)}</span><b>${esc(val)}</b></div>`;
}
function vbar(key, label, val, max, cls) {
  const pct = (Math.max(0, Math.min(1, val / max)) * 100).toFixed(1);
  return `<div class="vbar ${cls}">
    <span class="vbar-k">${esc(label)}</span>
    <span class="vbar-track"><i data-meter="${key}" style="width:${pct}%"></i></span>
    <span class="vbar-n" data-pop="${key}:${val}"><b>${val}</b>/${max}</span>
  </div>`;
}

// ═══ RAIL ═════════════════════════════════════════════════════════════════
function renderRail(s) {
  const nav = sel.navVisible(s);
  document.body.classList.toggle('no-nav', !nav);
  if (!nav) {
    if (ui.lastHTML.get('rail') !== '') { $('rail').innerHTML = ''; ui.lastHTML.set('rail', ''); }
    ui.knownTabs.clear();
    return;
  }
  const tabs = sel.visibleTabs(s);
  const html = tabs.map((t) => {
    const isNew = ui.railInit && !ui.knownTabs.has(t.id);
    return `<button class="tab ico-${t.id} ${ui.tab === t.id ? 'on' : ''} ${isNew ? 'reveal' : ''}"
        data-action="tab" data-arg="${t.id}" aria-label="${esc(t.label)}">
      <i class="glyph"></i><span class="tag">${esc(t.label)}</span>
      <span class="flyout">${esc(t.label)}</span></button>`;
  }).join('');
  setRegion('rail', 'rail', html);
  tabs.forEach((t) => ui.knownTabs.add(t.id));
  ui.railInit = true;
}

// ═══ WORK TAB ═════════════════════════════════════════════════════════════
function workTab(s) {
  const out = [paneHead('Work', D.COPY.workHeader)];
  const labours = sel.laboursHere(s);
  const mult = sel.yieldMult(s) * sel.staminaRate(s);

  // the wolf beat — the most dramatic thing on the screen
  const wolfLive = sel.isUnlocked(s, 'verb-face-wolf') && !s.flags['first-fight-survived'];
  if (wolfLive) {
    if (s.location === 'kura') {
      const wolf = D.MOBS.find((m) => m.id === 'wolf_scripted');
      out.push(`<div class="act-grid">${actCard({
        action: 'face-wolf', name: D.COPY.wolfButton, sub: wolf.blurb,
        cls: 'danger', barKey: 'wolf',
      })}</div>`);
    } else {
      out.push(`<p class="note">${esc(D.COPY.wolfAway)}</p>`);
    }
  }

  // verbs + labours
  const cards = [];
  if (s.rung === 'R0') {
    const showAuto = s.rungMeter >= D.BALANCE.RAKE_AUTO_REVEAL_METER || s.flags.raked;
    cards.push(actCard({
      action: 'rake', name: D.COPY.rakeLabel,
      sub: `+${D.BALANCE.RICE_PER_RAKE} rice · −${D.BALANCE.SATIETY_PER_ACT} body`,
      barKey: 'rake',
      auto: showAuto ? { on: s.autoRake, action: 'auto-rake', arg: '' } : null,
    }));
  }
  cards.push(actCard({
    action: 'rest', name: D.COPY.restLabel,
    sub: `+${D.BALANCE.SATIETY_PER_REST} body`, barKey: 'rest',
  }));
  for (const a of labours) {
    const yields = Object.entries(a.yields)
      .map(([res, n]) => `+${Math.max(1, Math.round(n * mult))} ${res}`).join(' · ');
    const skillDef = D.SKILLS.find((k) => k.id === a.skill);
    const lv = s.skills[a.skill]?.level ?? 1;
    cards.push(actCard({
      action: 'activity', arg: a.id, name: a.label,
      sub: `${yields} · −${a.satietyCost} body`,
      skill: `${skillDef.label} · Lv ${lv}`,
      barKey: a.id,
      auto: { on: s.autoActivity === a.id, action: 'auto-act', arg: a.id },
    }));
  }
  out.push(`<div class="act-grid">${cards.join('')}</div>`);

  if (s.rung !== 'R0' && labours.length === 0 && !(wolfLive && s.location === 'kura')) {
    out.push(`<p class="note">${esc(D.COPY.noWorkHere)}</p>`);
  }

  // meals
  const meals = [];
  if (sel.isUnlocked(s, 'verb-cook')) {
    const cant = s.resources.sansai < D.BALANCE.COOK_SANSAI_COST;
    const hurt = s.character.hp <= sel.hpMax(s) * 0.6;
    meals.push(actCard({
      action: 'cook', name: D.COPY.cookLabel,
      sub: `+${D.BALANCE.COOK_HP_RESTORE} life`,
      disabled: cant, reason: cant ? `Needs ${D.BALANCE.COOK_SANSAI_COST} sansai` : '',
      cls: !cant && hurt ? 'urgent' : '', barKey: 'cook',
    }));
  }
  if (sel.isUnlocked(s, 'panel-estate')) {
    const cant = s.resources.rice < D.BALANCE.EAT_RICE_COST;
    meals.push(actCard({
      action: 'eat', name: D.COPY.eatRiceLabel,
      sub: `+${D.BALANCE.EAT_RICE_SATIETY} body`,
      disabled: cant, reason: cant ? `Needs ${D.BALANCE.EAT_RICE_COST} rice` : '',
      barKey: 'eat',
    }));
  }
  if (meals.length) {
    out.push(secHead('The cookfire'));
    out.push(`<div class="act-grid">${meals.join('')}</div>`);
  }

  // the rung ladder (from the first rake)
  if (s.flags.raked || s.rungMeter > 0) {
    const r = sel.rung(s);
    const next = sel.nextRung(s);
    const full = sel.meterFull(s);
    const ready = sel.summonsReady(s);
    let hint = '';
    if (full) {
      if (ready) hint = D.COPY.ladderReady;
      else if (next && !next.unlocks) hint = D.COPY.ladderEnd;
      else hint = r.advanceHint ?? '';
    }
    out.push(`<section class="card ladder">
      <div class="ladder-top">
        <div><span class="kicker">The rung ladder</span>
          <h3 class="card-title">${esc(r.title)}</h3></div>
        <span class="rung-plate big"><span>${r.id}</span></span>
      </div>
      ${meterHtml('rung-l', s.rungMeter / r.threshold, 'lg')}
      <div class="ladder-nums"><span>${esc(D.COPY.ladderService)}</span>
        <b>${s.rungMeter} / ${r.threshold}</b></div>
      ${hint ? `<p class="hint ${ready ? 'gold' : ''}">${esc(hint)}</p>` : ''}
      ${next ? `<p class="next-line">${esc(D.COPY.ladderNext)} <b>${next.id} · ${esc(next.title)}</b></p>` : ''}
      ${ready ? `<button class="ladder-cta" data-action="summons">${esc(D.COPY.summons)}</button>` : ''}
    </section>`);
  }
  return out.join('');
}

// ═══ MAP TAB ══════════════════════════════════════════════════════════════
function mapTab(s) {
  const out = [paneHead('Map', D.COPY.mapHeader)];
  const node = sel.nodeOf(s);

  out.push(`<section class="card">
    <span class="kicker">${esc(D.COPY.youStandAt)}</span>
    <h3 class="card-title">${esc(node.label)}</h3>
    <p class="blurb">${esc(node.blurb)}</p>
  </section>`);

  const dests = sel.reachable(s);
  out.push(`<section class="card"><span class="kicker">${esc(D.COPY.onward)}</span>
    <div class="move-strip">${dests.map((d) => `
      <button class="move ${d.blocked ? 'is-off' : ''}" data-action="move"
          data-arg="${d.node.id}" ${d.blocked ? 'disabled' : ''}>
        <b>${esc(d.node.label)}</b>
        ${d.blocked
          ? `<span class="reason">${esc(D.COPY.needsConditioning)}</span>`
          : '<span class="go">›</span>'}
      </button>`).join('')}
    </div></section>`);

  const ppl = sel.peopleHere(s);
  if (ppl.length) {
    out.push(`<section class="card"><span class="kicker">${esc(D.COPY.whosHere)}</span>
      ${ppl.map((p) => {
        const open = s.openPersonId === p.id;
        return `<div class="person-row">
          <div class="p-info"><b>${esc(p.name)}</b><span>${esc(p.tell)}</span></div>
          <button class="btn ${open ? '' : 'prime'}" data-action="${open ? 'leave' : 'talk'}"
              data-arg="${p.id}">${esc(open ? D.COPY.leave(p.name) : D.COPY.speakWith(p.name))}</button>
        </div>`;
      }).join('')}
    </section>`);
  }

  if (s.openPersonId === 'pedlar') {
    out.push(`<section class="card">
      <span class="kicker">${esc(D.COPY.marketHeader)}</span>
      <p class="blurb">${esc(D.MARKET_BLURB)}</p>
      ${D.MARKET_ITEMS.map((it) => {
        const bought = s.marketBought[it.id] ?? 0;
        const soldOut = bought >= it.stockCap;
        const cantPay = s.resources.coin < it.coinCost;
        const off = soldOut || cantPay;
        const grants = Object.entries(it.grants).map(([r2, n]) => `+${n} ${r2}`).join(' · ');
        return `<div class="mkt-row ${off ? 'is-off' : ''}">
          <div class="mkt-info"><b>${esc(it.label)}</b><span class="mkt-grant">${esc(grants)}</span>
            <p>${esc(it.blurb)}</p></div>
          <button class="mkt-buy" data-action="buy" data-arg="${it.id}" ${off ? 'disabled' : ''}>
            ${soldOut
              ? '<b class="cant">Sold out</b>'
              : `<b class="${cantPay ? 'cant' : ''}">${esc(formatCoin(it.coinCost))}</b>`}
            <span>${bought}/${it.stockCap} bought</span>
          </button>
        </div>`;
      }).join('')}
    </section>`);

    const price = sel.ricePrice(s);
    const season = sel.seasonOf(s.clock.day);
    const n = s.resources.rice;
    out.push(`<section class="card">
      <span class="kicker">${esc(D.COPY.sellRiceHeader)}</span>
      <p class="blurb">${esc(D.COPY.sellRiceLine(price, season.label, D.RICE_SELL_GLOSS[season.id]))}</p>
      <div class="improve-foot">
        <span class="gold-line">${n} rice carried</span>
        <button class="btn prime" data-action="sell-rice" ${n <= 0 ? 'disabled' : ''}>
          ${esc(D.COPY.sellAllRice(n, formatCoin(n * price)))}</button>
      </div>
    </section>`);
  }
  return out.join('');
}

// ═══ ESTATE TAB ═══════════════════════════════════════════════════════════
function estateTab(s) {
  const out = [paneHead(D.COPY.estateHeader, 'The kura-works')];
  const stageName = D.ESTATE_STAGE_NAMES[s.estateStage];
  const next = D.ESTATE_STAGES[s.estateStage];

  if (next) {
    const cant = s.resources.coin < next.coinCost;
    out.push(`<section class="card">
      <span class="stage-plate"><span>${esc(stageName)}</span></span>
      <h3 class="card-title">${esc(next.label)}</h3>
      <p class="blurb">${esc(next.blurb)}</p>
      <p class="gold-line" style="margin-top:8px">+${next.yieldBonusNum}% labour output · +${next.satietyMaxBonus} max body</p>
      <div class="improve-foot">
        <span class="price ${cant ? 'cant' : ''}">${esc(formatCoin(next.coinCost))}</span>
        <button class="btn prime" data-action="improve" ${cant ? 'disabled' : ''}>
          ${cant ? `Needs ${esc(formatCoin(next.coinCost))}` : esc(next.label)}</button>
      </div>
    </section>`);
  } else {
    out.push(`<section class="card">
      <span class="stage-plate"><span>${esc(stageName)}</span></span>
      <h3 class="card-title">The house stands risen</h3>
      <p class="blurb">${esc(D.ESTATE_STAGES[3].logLine)}</p>
    </section>`);
  }

  out.push(`<section class="card">
    <span class="kicker">${esc(D.COPY.houseReopens)}</span>
    <div style="margin-top:12px">
      ${D.HOUSE_ROOMS.map((r2) => `<div class="room-row"><b>${esc(r2.label)}</b>
        <span class="lock-chip">Opens at ${r2.lockRung}</span></div>`).join('')}
    </div>
  </section>`);

  if (sel.isUnlocked(s, 'panel-house-influence')) {
    out.push(`<section class="card locked">
      <span class="kicker">${esc(D.HOUSE_INFLUENCE.header)}</span>
      <p class="blurb">${esc(D.HOUSE_INFLUENCE.blurb)}</p>
      ${Array.from({ length: D.HOUSE_INFLUENCE.silhouetteRows },
        () => '<div class="sil-row">◆ ————————————</div>').join('')}
      <p class="locked-foot">${esc(D.HOUSE_INFLUENCE.lockedFoot)}</p>
    </section>`);
  }
  return out.join('');
}

// ═══ INVENTORY TAB ════════════════════════════════════════════════════════
function inventoryTab(s) {
  const out = [paneHead('Inventory', D.STOREHOUSE.header)];
  const atKura = s.location === 'kura';
  out.push(`<section class="card">
    <p class="blurb">${esc(D.STOREHOUSE.blurb)}</p>
    <div class="bal-line">${esc(D.COPY.carriedLine(
      formatCoin(s.resources.coin), formatKMB(s.resources.rice),
      formatCoin(s.banked.coin), formatKMB(s.banked.rice)))}</div>
    ${atKura ? `<div class="bank-grid">
      ${actCard({ action: 'deposit', arg: 'coin', name: D.COPY.storeAllCoin,
        sub: `${formatCoin(s.resources.coin)} carried`, disabled: s.resources.coin <= 0,
        reason: s.resources.coin <= 0 ? 'Nothing carried' : '', barKey: 'dep-coin' })}
      ${actCard({ action: 'deposit', arg: 'rice', name: D.COPY.storeAllRice,
        sub: `${formatKMB(s.resources.rice)} rice carried`, disabled: s.resources.rice <= 0,
        reason: s.resources.rice <= 0 ? 'Nothing carried' : '', barKey: 'dep-rice' })}
      ${actCard({ action: 'withdraw', arg: 'coin', name: D.COPY.withdrawAllCoin,
        sub: `${formatCoin(s.banked.coin)} stored`, disabled: s.banked.coin <= 0,
        reason: s.banked.coin <= 0 ? 'Nothing stored' : '', barKey: 'wd-coin' })}
      ${actCard({ action: 'withdraw', arg: 'rice', name: D.COPY.withdrawAllRice,
        sub: `${formatKMB(s.banked.rice)} rice stored`, disabled: s.banked.rice <= 0,
        reason: s.banked.rice <= 0 ? 'Nothing stored' : '', barKey: 'wd-rice' })}
    </div>` : `<p class="note" style="margin-top:12px">${esc(D.STOREHOUSE.offNodeBlurb)}</p>`}
  </section>`);
  return out.join('');
}

// ═══ CHARACTER TAB ════════════════════════════════════════════════════════
function characterTab(s) {
  const out = [paneHead('Character', sel.rung(s).title)];

  // skills — visible by doing
  const visible = D.SKILLS.filter((k) => {
    const sk = s.skills[k.id];
    if (!sk) return false;
    if (k.id === 'conditioning') return true;
    return sk.xp > 0 || sk.level > 1;
  });
  out.push(secHead('Skills', `+${D.SKILL_YIELD_PER_LEVEL}% yield per level`));
  out.push(`<section class="card">
    ${visible.map((k) => {
      const sk = s.skills[k.id];
      const need = 40 + sk.level * 30;
      return `<div class="skill-row">
        <div class="skill-top"><b>${esc(k.label)}</b>
          <span class="lv-plate"><span>Lv ${sk.level}</span></span>
          <span class="yield-hint">+${D.SKILL_YIELD_PER_LEVEL}%/lvl</span></div>
        <p>${esc(k.blurb)}</p>
        ${meterHtml(`sk-${k.id}`, sk.xp / need)}
      </div>`;
    }).join('')}
  </section>`);

  // training
  if (sel.isUnlocked(s, 'readout-combat-level')) {
    const pts = s.character.attributePoints;
    out.push(secHead(D.COPY.trainingHeader));
    out.push(`<section class="card">
      <p class="points-big">${esc(D.COPY.trainingPoints(pts))}</p>
      ${D.ATTRS.map((a) => `<div class="attr-row">
        <span class="attr-plate"><span>${esc(a.label)}</span></span>
        <div class="a-name"><b>${esc(a.name)}</b><span>${esc(a.gloss)}</span></div>
        <span class="attr-val" data-pop="attr-${a.id}:${s.character.attrs[a.id]}">${s.character.attrs[a.id]}</span>
        <button class="attr-plus" data-action="attr" data-arg="${a.id}"
          ${pts <= 0 ? 'disabled' : ''}>+1</button>
      </div>`).join('')}
    </section>`);
  }

  // bestiary
  if (sel.isUnlocked(s, 'panel-bestiary')) {
    const entries = sel.bestiary(s);
    const faced = entries.filter((e) => e.faced).length;
    out.push(secHead(D.COPY.bestiaryHeader, D.COPY.bestiaryCount(faced, entries.length)));
    out.push(`<div class="beast-grid">
      ${entries.map(({ mob, faced: f }) => f
        ? `<div class="beast">
            <div class="beast-top"><b>${esc(mob.label)}</b>${pipHtml(sel.winRate(s, mob))}</div>
            <p>${esc(mob.blurb)}</p>
            <div class="facts"><b>Tell —</b> ${esc(mob.tell)}<br><b>Haunts —</b> ${esc(mob.haunts)}</div>
          </div>`
        : `<div class="beast unfaced">
            <div class="beast-top"><b>${esc(D.COPY.bestiaryUnknown)}</b></div>
            <p>${esc(D.COPY.bestiaryNotFaced)}</p>
          </div>`).join('')}
    </div>`);
  }

  // undertakings
  if (sel.isUnlocked(s, 'tab-combat')) {
    out.push(secHead(D.QUESTS_HEADER, D.QUESTS_BLURB));
    out.push(D.QUESTS.map((q) => {
      const state = sel.questState(s, q);
      const done = s.quests.progress[q.id] ?? [];
      return `<div class="quest">
        <div class="quest-top"><span class="kind-badge kind-${q.kind}"><span>${esc(q.kind)}</span></span>
          <b>${esc(q.title)}</b></div>
        <p>${esc(q.blurb)}</p>
        <div class="steps">${q.steps.map((st) => {
          const d = done.includes(st.id);
          return `<div class="step ${d ? 'done' : ''}"><span class="box">${d ? '◆' : '◇'}</span>
            <span class="s-label">${esc(st.label)}</span></div>`;
        }).join('')}</div>
        <div class="quest-foot">
          <span class="reward">${esc(D.COPY.reward(formatCoin(q.rewardCoin)))}</span>
          ${state === 'open'
            ? `<button class="btn prime" data-action="quest" data-arg="${q.id}">${esc(D.COPY.takeThisOn)}</button>`
            : state === 'accepted'
              ? '<span class="state-chip accepted">Undertaken</span>'
              : '<span class="state-chip completed">Completed</span>'}
        </div>
      </div>`;
    }).join(''));
  }
  return out.join('');
}

// ═══ COMBAT TAB ═══════════════════════════════════════════════════════════
function combatTab(s) {
  const out = [paneHead('Combat', D.COPY.watchHeader)];
  const need = sel.combatXpNeeded(s);
  const weapon = D.WEAPONS.find((w) => w.id === s.equippedWeapon);

  out.push(`<div class="combat-top">
    <section class="card">
      <span class="kicker">${esc(D.COPY.combatLevel(s.character.level))}</span>
      <div style="margin-top:12px">${meterHtml('cxp', s.character.combatXp / need, 'lg xp')}</div>
      <div class="xp-line"><span>Experience</span>
        <span data-pop="cxp:${s.character.combatXp}"><b>${s.character.combatXp}</b> / ${need}</span></div>
    </section>
    <section class="card">
      <span class="kicker">In hand</span>
      <h3 class="card-title">${esc(weapon.label)}</h3>
      <p class="weapon-arch">${esc(weapon.archetype)}</p>
      <p class="blurb">${esc(weapon.blurb)}</p>
    </section>
  </div>`);

  const foes = sel.foesHere(s);
  if (!foes.length) {
    out.push(`<p class="note">${esc(D.COPY.watchEmpty)}</p>`);
  } else {
    out.push(foes.map((mob) => {
      const faced = s.bestiaryFaced.includes(mob.id);
      const pct = sel.winRate(s, mob);
      const autoEnd = s.autoCombat === mob.id && !s.autoCombatRetreat;
      const autoFlee = s.autoCombat === mob.id && s.autoCombatRetreat;
      return `<div class="foe-row">
        <div class="foe-info"><b class="${faced ? '' : 'fog'}">${esc(mob.label)}</b>
          ${faced ? '' : `<span style="font-size:10.5px;color:var(--ink-mute);margin-left:8px">${esc(D.COPY.bestiaryNotFaced)}</span>`}
          <p>${esc(mob.blurb)}</p></div>
        <div class="foe-side">
          ${pipHtml(pct)}
          <div class="foe-actions">
            ${switchHtml({ on: autoEnd, action: 'auto-combat', arg: mob.id,
              extra: 'data-retreat="0"', small: true, labelOff: D.COPY.autoToEnd })}
            ${switchHtml({ on: autoFlee, action: 'auto-combat', arg: mob.id,
              extra: 'data-retreat="1"', small: true, labelOff: D.COPY.autoFlee })}
            <button class="fight-btn" data-action="fight" data-arg="${mob.id}">${esc(D.COPY.fight)}</button>
          </div>
        </div>
      </div>`;
    }).join(''));
  }
  return out.join('');
}

// ═══ MAIN PANE ════════════════════════════════════════════════════════════
const TAB_RENDER = {
  work: workTab, map: mapTab, estate: estateTab,
  inventory: inventoryTab, character: characterTab, combat: combatTab,
};
function renderMain(s) {
  const tabs = sel.visibleTabs(s);
  if (!tabs.some((t) => t.id === ui.tab)) ui.tab = 'work';
  const html = `<div class="pane">${TAB_RENDER[ui.tab](s)}</div>`;
  const wrote = setRegion('main', 'main', html);
  if (wrote && ui.renderedTab !== ui.tab) $('main').scrollTop = 0;
  ui.renderedTab = ui.tab;
}

// ═══ LOG ══════════════════════════════════════════════════════════════════
function logLineHtml(l, arrive) {
  let bullet = D.CHANNEL_BULLET[l.channel] ?? '';
  if (bullet && l.text.startsWith(bullet)) bullet = ''; // engine text may carry its own
  const plate = l.voice
    ? `<i class="plate v-${l.voice}"><span>${esc(l.speaker ?? l.voice)}</span></i>` : '';
  const badge = l.count > 1 ? `<span class="xn">×${l.count}</span>` : '';
  return `<div class="ll ll-${l.channel} ${l.ephemeral ? 'll-now' : ''} ${arrive ? 'arrive' : ''}">
    ${bullet ? `<span class="bullet">${bullet}</span>` : ''}${plate}${esc(l.text)}${badge}</div>`;
}

function renderLog(s) {
  setRegion('logtop', 'log-top',
    `<span class="kicker">The record</span><h2 class="log-title">${esc(D.LOG_HEADER)}</h2>`);
  setRegion('logbar', 'log-filters', D.LOG_FILTERS.map((f) =>
    `<button class="lf ${ui.logFilter === f ? 'on' : ''}" data-action="filter" data-arg="${f}">
      ${esc(D.LOG_FILTER_LABELS[f])}</button>`).join(''));

  const view = sel.logView(s, ui.logFilter);
  const feed = $('log-feed');
  const R = ui.renderedLog;

  // can we append instead of rebuilding?
  let incremental = ui.logFilterRendered === ui.logFilter && R.length > 0 && view.length >= R.length;
  if (incremental) {
    for (let i = 0; i < R.length - 1; i++) {
      if (!view[i] || view[i].id !== R[i].id) { incremental = false; break; }
    }
    const lastR = R[R.length - 1];
    const lastV = view[R.length - 1];
    if (incremental && (!lastV || lastV.text !== lastR.text)) incremental = false;
  }

  const nearBottom = feed.scrollHeight - feed.scrollTop - feed.clientHeight < 56;
  if (!incremental) {
    feed.innerHTML = view.length
      ? view.map((l) => logLineHtml(l, false)).join('')
      : '<div class="log-empty">— quiet —</div>';
    feed.scrollTop = feed.scrollHeight;
  } else {
    const lastR = R[R.length - 1];
    const lastV = view[R.length - 1];
    if (lastV.count !== lastR.count) {
      const node = feed.children[R.length - 1];
      if (node) {
        node.outerHTML = logLineHtml(lastV, false);
        const badge = feed.children[R.length - 1]?.querySelector('.xn');
        if (badge) { badge.classList.add('bump'); }
      }
    }
    if (view.length > R.length) {
      const addition = view.slice(R.length).map((l) => logLineHtml(l, !reduced)).join('');
      feed.insertAdjacentHTML('beforeend', addition);
    }
    if (nearBottom) feed.scrollTop = feed.scrollHeight;
  }
  ui.renderedLog = view.map((l) => ({ id: l.id, count: l.count, text: l.text }));
  ui.logFilterRendered = ui.logFilter;
}

// ═══ FULL-SCREEN MOMENTS ══════════════════════════════════════════════════
function renderCold(s) {
  const show = s.phase === 'cold-open';
  const cold = $('cold');
  if (!show) { cold.classList.remove('show'); ui.lastHTML.delete('cold'); return; }
  const html = `<div class="cold-inner">
    <div class="cold-sub">${esc(D.COLD_OPEN.subtitle)}</div>
    <h1 class="cold-title">${esc(D.COLD_OPEN.title)}</h1>
    <div class="cold-rule"></div>
    <p class="cold-lede">${esc(D.COLD_OPEN.lede)}</p>
    <button class="cold-verb" data-action="open-eyes">${esc(D.COLD_OPEN.verb)}</button>
  </div>`;
  if (setRegion('cold', 'cold', html)) cold.classList.add('show');
}

function vnScene(s) {
  if (!s.vn) return null;
  return s.vn.kind === 'intro' ? D.INTRO_SCENES[s.vn.sceneIndex] : D.RUNG_BEATS[s.vn.target];
}

function vnLine(l, isNew) {
  if (l.voice === 'narrator') {
    return `<div class="vn-line narr ${isNew ? 'vn-in' : ''}">${esc(l.text)}</div>`;
  }
  return `<div class="vn-line ${isNew ? 'vn-in' : ''}">
    <i class="plate v-${l.voice}"><span>${esc(l.speaker ?? l.voice)}</span></i>${esc(l.text)}</div>`;
}

function renderVN(s) {
  const vnEl = $('vn');
  if (s.phase !== 'vn' || !s.vn) {
    vnEl.classList.remove('show'); ui.lastHTML.delete('vn'); ui.vnKey = ''; ui.vnSceneKey = '';
    return;
  }
  const vn = s.vn;
  const scene = vnScene(s);
  const key = [vn.kind, vn.sceneIndex ?? vn.target, vn.phase, vn.shown,
    vn.asked.join(','), vn.lastAsk ?? '', vn.picked ?? ''].join('|');
  if (key === ui.vnKey) return;

  const sceneKey = `${vn.kind}:${vn.sceneIndex ?? vn.target}`;
  if (sceneKey !== ui.vnSceneKey) ui.vnPrevShown = 0;
  ui.vnSceneKey = sceneKey;

  const plateName = scene.plateLabel ?? scene.speaker ?? '';
  const dots = vn.kind === 'intro'
    ? `<div class="vn-progress">${D.INTRO_SCENES.map((_, i) =>
        `<i class="${i <= vn.sceneIndex ? 'on' : ''}"></i>`).join('')}</div>`
    : '';

  let body = '';
  let panelAction = '';

  if (vn.phase === 'greeting') {
    const lines = scene.greeting.slice(0, vn.shown)
      .map((l, i) => vnLine(l, i >= ui.vnPrevShown && !reduced)).join('');
    body = `<div class="vn-lines">${lines}</div>
      <div class="vn-controls"><button class="vn-next" data-action="vn-next">▸</button></div>`;
    panelAction = 'data-action="vn-next"';
    ui.vnPrevShown = vn.shown;
  } else if (vn.phase === 'ask') {
    const last = scene.greeting[scene.greeting.length - 1];
    const askTopic = vn.lastAsk ? scene.topics.find((t) => t.id === vn.lastAsk) : null;
    const topics = scene.topics
      .filter((t) => !t.gateTopic || vn.asked.includes(t.gateTopic))
      .map((t) => `<button class="vn-topic ${vn.asked.includes(t.id) ? 'asked' : ''}"
          data-action="vn-ask" data-arg="${t.id}">${esc(t.label)}</button>`).join('');
    body = `<div class="vn-lines">${vnLine(last, false)}
        ${askTopic ? `<div class="vn-answer">${askTopic.answer.map((l) => vnLine(l, !reduced)).join('')}</div>` : ''}
      </div>
      <div class="vn-ask-head kicker">Ask</div>${topics}
      <div class="vn-done-row"><button class="vn-next" data-action="vn-done">${esc(D.COPY.doneQuestioning)}</button></div>`;
  } else if (vn.phase === 'decide') {
    body = `<p class="vn-prompt">${esc(scene.decision.prompt)}</p>
      ${scene.decision.options.map((o) =>
        `<button class="vn-slab" data-action="vn-choose" data-arg="${o.id}">${esc(o.label)}</button>`).join('')}`;
  } else { // resolved
    const opt = scene.decision.options.find((o) => o.id === vn.picked);
    body = `<div class="vn-lines">
        ${vnLine({ voice: 'player', speaker: 'You', text: opt.say }, !reduced)}
        ${vnLine({ voice: scene.voice, speaker: scene.speaker ?? undefined, text: opt.react }, !reduced)}
      </div>
      ${opt.perk ? `<div class="perk"><span class="kicker">${esc(D.COPY.perkTag)}</span>
        <b>${esc(opt.perk.name)}</b><p>${esc(opt.perk.desc)}</p>
        ${opt.stat ? `<span class="perk-stat">+1 ${opt.stat.up.toUpperCase()} · −1 ${opt.stat.down.toUpperCase()}</span>` : ''}
      </div>` : ''}
      ${opt.statBonus ? `<div class="perk"><span class="kicker">Drilled</span>
        <p>${esc(opt.statBonus.note)}</p></div>` : ''}
      <div class="vn-controls"><button class="vn-next" data-action="vn-continue">${esc(D.COPY.continueBtn)}</button></div>`;
  }

  const html = `<div class="vn-panel" ${panelAction}>
    <div class="vn-box">${body}</div>
    ${plateName ? `<div class="vn-plate"><span class="vn-seal"><span>${esc(scene.sealText)}</span></span>
      <b>${esc(plateName)}</b></div>` : ''}
    ${dots}
  </div>`;
  setRegion('vn', 'vn', html);
  vnEl.classList.add('show');
  ui.vnKey = key;
  const lines = vnEl.querySelector('.vn-lines');
  if (lines) lines.scrollTop = lines.scrollHeight;
}

function renderCeremony(s) {
  const el = $('ceremony');
  if (!s.ceremony) {
    if (ui.cereKey) { el.classList.remove('show'); el.innerHTML = ''; ui.cereKey = null; }
    return;
  }
  const key = `${s.ceremony.rank}:${s.ceremony.title}`;
  if (ui.cereKey === key) return;
  ui.cereKey = key;
  ui.cereAt = performance.now();
  const sparks = Array.from({ length: 14 }, (_, i) => {
    const left = 8 + ((i * 61) % 84);
    const delay = (i * 0.37) % 2.4;
    const size = 3 + (i % 3);
    return `<span class="spark" style="left:${left}%;bottom:${10 + ((i * 23) % 30)}%;
      width:${size}px;height:${size}px;animation-delay:${delay.toFixed(2)}s"></span>`;
  }).join('');
  el.innerHTML = `<div class="cere-inner" data-action="cere">
    ${sparks}
    <div class="cere-kicker">${esc(D.COPY.promoted)}</div>
    <h1 class="cere-title">${esc(s.ceremony.title)}</h1>
    <span class="cere-underline"></span>
    <div class="cere-rank">${esc(D.HOUSE_MARK)} · rung <b>${esc(s.ceremony.rank)}</b></div>
    <div class="cere-hint">${esc(D.COPY.continueBtn)} ›</div>
  </div>`;
  el.setAttribute('data-action', 'cere');
  el.classList.add('show');
}

// ═══ STAGE STRIP (the demo review affordance) ═════════════════════════════
function renderStrip(s) {
  const stages = D.STAGES.map((st) =>
    `<button class="sbtn ${s.stageId === st.id ? 'on' : ''}" data-action="stage"
      data-arg="${st.id}" title="${esc(st.blurb)}">${esc(st.label.split(' · ')[0])}</button>`).join('');
  const moments = `
    <button class="sbtn moment" data-action="moment" data-arg="intro" title="Play the intro from the cold open">Intro</button>
    <button class="sbtn moment" data-action="moment" data-arg="wolf" title="R2 at the kura — face the wolf">Wolf</button>
    <button class="sbtn moment" data-action="moment" data-arg="fight" title="R3 — pick a fight at the forecourt">Fight</button>
    <button class="sbtn moment" data-action="moment" data-arg="rungup" title="Force the meter and play the next rung beat">Rung-up</button>`;
  setRegion('strip', 'strip', `${stages}<span class="sdiv"></span>${moments}`);
}

// DEMO-ONLY documented hack (VARIANT-SPEC §2 · stage selector) — the ONLY
// place demo code writes engine state directly: force the meter (and the
// story-gate flag) so the next rung beat plays from wherever we stand.
function momentRungUp() {
  if (eng.state.phase !== 'game') eng.setStage('R0');
  let next = sel.nextRung(eng.state);
  if (!next?.unlocks || !D.RUNG_BEATS[next.id]) {
    eng.setStage('R2'); // R3+ has no in-scope next beat — replay R2 → R3
    next = sel.nextRung(eng.state);
  }
  const cur = sel.rung(eng.state);
  if (cur.storyGateFlag) eng.state.flags[cur.storyGateFlag] = true;
  eng.state.rungMeter = 99999;
  eng.dispatch({ type: 'begin_rung_beat' });
}

function runMoment(id) {
  if (id === 'intro') {
    eng.setStage('cold-open');
    eng.dispatch({ type: 'open_eyes' });
  } else if (id === 'wolf') {
    eng.setStage('R2');
    eng.dispatch({ type: 'face_wolf' });
  } else if (id === 'fight') {
    eng.setStage('R3');
    eng.dispatch({ type: 'move_to', node: 'gate-forecourt' });
    eng.dispatch({ type: 'fight', mobId: 'rice_rats' });
  } else if (id === 'rungup') {
    momentRungUp();
  }
}

// ═══ JUICE — pops, meter fills, action-bar pulses, flashes ════════════════
function animateMeters() {
  document.querySelectorAll('[data-meter]').forEach((m) => {
    const key = m.dataset.meter;
    const target = m.style.width;
    const prev = ui.meterVals.get(key);
    if (prev !== undefined && prev !== target && !reduced) {
      m.style.transition = 'none';
      m.style.width = prev;
      void m.offsetWidth;
      m.style.transition = '';
      m.style.width = target;
    }
    ui.meterVals.set(key, target);
  });
}
function bumpPops() {
  document.querySelectorAll('[data-pop]').forEach((n) => {
    const raw = n.dataset.pop;
    const i = raw.indexOf(':');
    const key = raw.slice(0, i);
    const val = raw.slice(i + 1);
    const prev = ui.prevVals.get(key);
    if (prev !== undefined && prev !== val && !reduced) {
      const b = n.querySelector('b') ?? n;
      b.classList.remove('bump');
      void b.offsetWidth;
      b.classList.add('bump');
    }
    ui.prevVals.set(key, val);
  });
}
// Which action just fired? Match the freshest log line to an action bar.
function detectActionPulse(s) {
  let maxId = -1; let entry = null;
  for (const l of s.log) if (l.id > maxId) { maxId = l.id; entry = l; }
  const isNew = maxId > ui.prevMaxLogId && ui.prevMaxLogId !== -1;
  ui.prevMaxLogId = maxId;
  if (!isNew || !entry || entry.channel !== 'reward') return null;
  const t = entry.text;
  if (t.startsWith('You rake')) return 'rake';
  if (t.startsWith('A hot meal')) return 'cook';
  if (t.startsWith('Plain rice')) return 'eat';
  for (const a of D.ACTIVITIES) if (t.startsWith(a.label)) return a.id;
  return null;
}
function pulseBar(key) {
  const bar = document.querySelector(`[data-abar="${key}"]`);
  if (!bar || reduced) return;
  bar.classList.remove('fire');
  void bar.offsetWidth;
  bar.classList.add('fire');
}
function flash(kind) {
  if (reduced) return;
  const f = $('flash');
  f.className = '';
  void f.offsetWidth;
  f.className = kind;
}
function shake() {
  if (reduced) return;
  const app = $('app');
  app.classList.remove('shake');
  void app.offsetWidth;
  app.classList.add('shake');
}
function handleEvents(events) {
  for (const ev of events) {
    if (ev.type === 'fight-end') flash(ev.won ? 'gold' : 'verm');
    else if (ev.type === 'wolf-survived') { flash('verm'); shake(); }
    else if (ev.type === 'estate-up' || ev.type === 'level-up' || ev.type === 'quest-complete') flash('gold');
  }
}

// ═══ THE RENDER LOOP ══════════════════════════════════════════════════════
function render(s, events) {
  const pulse = detectActionPulse(s);
  handleEvents(events);
  document.body.classList.toggle('phase-cold', s.phase === 'cold-open');
  renderHeader(s);
  renderRail(s);
  renderMain(s);
  renderLog(s);
  renderCold(s);
  renderVN(s);
  renderCeremony(s);
  renderStrip(s);
  animateMeters();
  bumpPops();
  if (pulse) pulseBar(pulse);
}
const rerender = () => render(eng.state, []);

// ═══ INPUT — one delegated dispatcher ═════════════════════════════════════
const ACTIONS = {
  'tab':        (ds) => { ui.tab = ds.arg; rerender(); },
  'filter':     (ds) => { ui.logFilter = ds.arg; rerender(); },
  'stage':      (ds) => eng.setStage(ds.arg),
  'moment':     (ds) => runMoment(ds.arg),
  'open-eyes':  () => eng.dispatch({ type: 'open_eyes' }),
  'rake':       () => eng.dispatch({ type: 'rake_rice' }),
  'rest':       () => eng.dispatch({ type: 'rest' }),
  'activity':   (ds) => eng.dispatch({ type: 'do_activity', id: ds.arg }),
  'auto-rake':  () => eng.dispatch({ type: 'set_auto_rake', on: !eng.state.autoRake }),
  'auto-act':   (ds) => eng.dispatch({ type: 'set_auto', id: eng.state.autoActivity === ds.arg ? null : ds.arg }),
  'move':       (ds) => eng.dispatch({ type: 'move_to', node: ds.arg }),
  'talk':       (ds) => eng.dispatch({ type: 'talk', personId: ds.arg }),
  'leave':      () => eng.dispatch({ type: 'leave' }),
  'buy':        (ds) => eng.dispatch({ type: 'buy_item', id: ds.arg }),
  'sell-rice':  () => eng.dispatch({ type: 'sell_rice' }),
  'deposit':    (ds) => eng.dispatch({ type: 'deposit', what: ds.arg }),
  'withdraw':   (ds) => eng.dispatch({ type: 'withdraw', what: ds.arg }),
  'improve':    () => eng.dispatch({ type: 'improve_estate' }),
  'cook':       () => eng.dispatch({ type: 'cook_meal' }),
  'eat':        () => eng.dispatch({ type: 'eat_rice' }),
  'attr':       (ds) => eng.dispatch({ type: 'spend_attribute', attr: ds.arg }),
  'face-wolf':  () => eng.dispatch({ type: 'face_wolf' }),
  'fight':      (ds) => eng.dispatch({ type: 'fight', mobId: ds.arg }),
  'auto-combat': (ds) => {
    const retreat = ds.retreat === '1';
    const on = eng.state.autoCombat === ds.arg && eng.state.autoCombatRetreat === retreat;
    eng.dispatch({ type: 'set_auto_combat', mobId: on ? null : ds.arg, retreat });
  },
  'quest':      (ds) => eng.dispatch({ type: 'accept_quest', id: ds.arg }),
  'summons':    () => eng.dispatch({ type: 'begin_rung_beat' }),
  'vn-next':    () => eng.dispatch({ type: 'vn_next' }),
  'vn-ask':     (ds) => eng.dispatch({ type: 'vn_ask', topicId: ds.arg }),
  'vn-done':    () => eng.dispatch({ type: 'vn_done_asking' }),
  'vn-choose':  (ds) => eng.dispatch({ type: 'vn_choose', optionId: ds.arg }),
  'vn-continue': () => eng.dispatch({ type: 'vn_continue' }),
  'cere':       () => { if (performance.now() - ui.cereAt > 1600) eng.dispatch({ type: 'dismiss_ceremony' }); },
};

document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-action]');
  if (!t || t.disabled) return;
  const fn = ACTIONS[t.dataset.action];
  if (fn) fn(t.dataset, t);
});

// go
eng.subscribe(render);
