// 02 · Candlelit Ledger — main.js
// Render + reconcile + engine wiring for the candlelit-journal remaster.
// Region-diffed innerHTML rendering: each region re-renders only when its
// HTML string changes, so the 480ms engine tick touches nothing visible
// unless the state it shows actually moved (keeps hover/scroll/animation
// stable). Log scroll + meter fills are reconciled by hand.

import { createEngine, sel } from '../shared/engine.js';
import * as D from '../shared/data.js';
import { formatKMB, formatCoin } from '../shared/format.js';

const eng = createEngine('R1'); // default landing stage per VARIANT-SPEC §1

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

// mobile breakpoint — mirrors the style.css @media (max-width: 920px) block.
// On a phone the spread closes to a single page; `ui.face` says which page
// is up ('work' = the active tab, 'record' = the log). Desktop ignores it.
const MQ_MOBILE = matchMedia('(max-width: 920px)');
MQ_MOBILE.addEventListener('change', () => render(eng.state));

// ── UI-local state ───────────────────────────────────────────
const ui = {
  tab: 'work',
  filter: 'story',
  face: 'work', // mobile only: which page of the closed journal is up
  seenLogId: 0, // newest log id the reader has had in view (mobile unread dot)
  stripOpen: false,
  animatedLogId: 0, // log ids ≤ this never (re-)animate
  seenTabs: new Set(),
  freshTabs: new Set(),
  ceremonyAt: 0,
};

let lastStage = null;
let lastLeftTab = null;
let prevVitals = null; // for number pops
const meterMemo = {}; // meter id → last fraction (for animated fills)

// ── tiny helpers ─────────────────────────────────────────────
const $ = (id) => document.getElementById(id);

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// payload for data-payload attributes (parsed back with JSON.parse)
const pay = (o) => esc(JSON.stringify(o));

const regions = {};
function setHTML(id, html) {
  if (regions[id] === html) return false;
  regions[id] = html;
  $(id).innerHTML = html;
  return true;
}

function meter(id, frac, cls = '') {
  const f = Math.max(0, Math.min(1, frac));
  return `<div class="rule-meter"><div class="ink-fill ${cls}" data-meter="${id}" data-frac="${f}"></div></div>`;
}

function animateMeters() {
  for (const el of document.querySelectorAll('.ink-fill[data-meter]')) {
    const key = el.dataset.meter;
    const frac = parseFloat(el.dataset.frac);
    const prev = meterMemo[key];
    if (prev !== undefined && prev !== frac && !REDUCED) {
      el.style.width = prev * 100 + '%';
      el.getBoundingClientRect(); // force reflow so the transition runs
      el.style.width = frac * 100 + '%';
    } else {
      el.style.width = frac * 100 + '%';
    }
    meterMemo[key] = frac;
  }
}

// a ledger entry: a written line + a wax-seal verb
function ledger(payload, letter, label, note, opts = {}) {
  const dis = opts.disabled ? ' disabled' : '';
  const extra = opts.extra ?? '';
  return `<div class="entry-row ${opts.cls ?? ''}">
    <div class="entry-main">
      <div class="entry-label">${label}</div>
      ${note ? `<div class="entry-note">${note}</div>` : ''}
    </div>
    ${extra}
    <button class="seal ${opts.seal ?? ''}" data-act="dispatch" data-payload='${pay(payload)}'${dis}
      aria-label="${esc(opts.aria ?? letter)}">${esc(letter)}</button>
  </div>`;
}

const cardH = (t) => `<h3 class="card-h">${esc(t)}</h3>`;
const pageHead = (t) => `<h2 class="page-title">${esc(t)}</h2><div class="rule-kumiko"></div>`;

// ── header vitals: desk instruments ──────────────────────────
// Two row-groups: small instruments (mark/resources/clock) and the meter
// dials (life/body/rung). On desktop the wrappers are `display: contents`
// (layout identical to a flat row); at ≤920px they become the condensed
// two-row rail — a scrollable instrument row over a fixed meter row.
function vitalsHTML(s) {
  const res = s.resources;
  // wrap a live number in a .pop span when it just grew (animates once)
  const val = (key, text, grewNow) => (grewNow ? `<span class="pop">${text}</span>` : text);
  const grew = (key, v) => !!prevVitals && v > prevVitals[key];

  const insts = [];
  const meters = [];
  insts.push(
    `<div class="inst mark"><div class="k">the house</div><div class="v">${esc(D.HOUSE_MARK)}</div></div>`,
  );
  insts.push(
    `<div class="inst"><div class="k">rice</div><div class="v num">${val('rice', formatKMB(res.rice), grew('rice', res.rice))}</div></div>`,
  );
  if (res.coin + s.banked.coin > 0) {
    insts.push(
      `<div class="inst"><div class="k">coin</div><div class="v num">${val('coin', esc(formatCoin(res.coin)), grew('coin', res.coin))}</div></div>`,
    );
  }
  if (sel.isUnlocked(s, 'row-wood')) {
    insts.push(
      `<div class="inst"><div class="k">wood</div><div class="v num">${val('wood', formatKMB(res.wood), grew('wood', res.wood))}</div></div>`,
    );
  }
  if (sel.isUnlocked(s, 'row-sansai')) {
    insts.push(
      `<div class="inst"><div class="k">sansai</div><div class="v num">${val('sansai', formatKMB(res.sansai), grew('sansai', res.sansai))}</div></div>`,
    );
  }
  if (sel.isUnlocked(s, 'readout-clock')) {
    const se = sel.seasonOf(s.clock.day);
    insts.push(
      `<div class="inst clock"><div class="k">${esc(se.label)} ${se.emoji}</div><div class="v num">Year ${sel.yearOf(s.clock.day)} · day ${sel.dayOfSeason(s.clock.day)}</div></div>`,
    );
  }
  if (sel.isUnlocked(s, 'verb-face-wolf')) {
    const max = sel.hpMax(s);
    const low = s.character.hp <= max * 0.3;
    meters.push(
      `<div class="inst gauge life${low ? ' low' : ''}">
        <div class="krow"><span class="k">life</span><span class="v num">${s.character.hp}/${max}</span></div>
        ${meter('hp', s.character.hp / max, 'life')}
      </div>`,
    );
  }
  if (sel.isUnlocked(s, 'readout-stamina')) {
    const max = sel.satietyMax(s);
    meters.push(
      `<div class="inst gauge">
        <div class="krow"><span class="k">body</span><span class="v num">${s.character.satiety}/${max}</span></div>
        ${meter('sat', s.character.satiety / max, 'body')}
      </div>`,
    );
  }
  // the rung head
  const r = sel.rung(s);
  if (sel.summonsReady(s)) {
    meters.push(
      `<button class="inst rung summons" data-act="dispatch" data-payload='${pay({ type: 'begin_rung_beat' })}'>
        <div class="k">the summons</div><div class="v">${esc(D.COPY.summons)}</div>
      </button>`,
    );
  } else {
    const shown = Math.min(s.rungMeter, r.threshold);
    meters.push(
      `<div class="inst rung">
        <div class="krow"><span class="k">${esc(r.title)}</span><span class="v num">${formatKMB(shown)} / ${formatKMB(r.threshold)}</span></div>
        ${meter('rung', s.rungMeter / r.threshold)}
      </div>`,
    );
  }
  return `<div class="vrow vrow-insts">${insts.join('')}</div><div class="vrow vrow-meters">${meters.join('')}</div>`;
}

// ── bookmark tabs ────────────────────────────────────────────
// The tab bookmarks ride in a `.bm-tabs` wrapper (display: contents on
// desktop; the scrollable half of the bottom bookmark bar on mobile), and a
// mobile-only leather "Record" bookmark flips the closed journal to the log
// page — with a candle-lit dot when unread lines have landed there.
function bookmarksHTML(s) {
  if (!sel.navVisible(s)) return '';
  const onRecord = ui.face === 'record';
  const tabs = sel
    .visibleTabs(s)
    .map(
      (t) =>
        `<button class="bookmark bm-${t.id}${t.id === ui.tab && !onRecord ? ' active' : ''}${ui.freshTabs.has(t.id) ? ' fresh' : ''}"
          data-act="tab" data-tab="${t.id}">${esc(t.label)}</button>`,
    )
    .join('');
  const maxId = Math.max(0, ...s.log.map((l) => l.id));
  const dot = maxId > ui.seenLogId && !onRecord ? '<span class="dot" aria-hidden="true"></span>' : '';
  return `<div class="bm-tabs">${tabs}</div>
    <button class="bookmark bm-record mobile-only${onRecord ? ' active' : ''}" data-act="face"
      aria-label="${esc(D.LOG_HEADER)}">Record${dot}</button>`;
}

// ── Work tab ─────────────────────────────────────────────────
function workHTML(s) {
  let h = pageHead(D.COPY.workHeader);

  // the wolf beat — the most dramatic entry in the book
  if (sel.isUnlocked(s, 'verb-face-wolf') && !s.flags['first-fight-survived']) {
    if (s.location === 'kura') {
      h += `<div class="wolf-card">${ledger(
        { type: 'face_wolf' },
        'W',
        esc(D.COPY.wolfButton),
        esc(D.MOBS.find((m) => m.id === 'wolf_scripted').blurb),
        { seal: 'big', aria: D.COPY.wolfButton },
      )}</div>`;
    } else {
      h += `<div class="card"><p class="note">${esc(D.COPY.wolfAway)}</p></div>`;
    }
  }

  // meta verbs
  let verbs = '';
  if (s.rung === 'R0') {
    const autoRake =
      s.rungMeter >= D.BALANCE.RAKE_AUTO_REVEAL_METER || s.flags.raked
        ? `<button class="ghost${s.autoRake ? ' on' : ''}" data-act="dispatch"
             data-payload='${pay({ type: 'set_auto_rake', on: !s.autoRake })}'>${esc(s.autoRake ? D.COPY.autoOff : D.COPY.autoOn)}</button>`
        : '';
    verbs += ledger(
      { type: 'rake_rice' },
      'R',
      esc(D.COPY.rakeLabel),
      `+${D.BALANCE.RICE_PER_RAKE} rice · −${D.BALANCE.SATIETY_PER_ACT} body`,
      { extra: autoRake, aria: D.COPY.rakeLabel },
    );
  }
  verbs += ledger(
    { type: 'rest' },
    'Z',
    esc(D.COPY.restLabel),
    `+${D.BALANCE.SATIETY_PER_REST} body`,
    { aria: D.COPY.restLabel },
  );
  h += `<div class="card">${verbs}</div>`;

  // labour rows at this ground
  const here = sel.laboursHere(s);
  if (here.length) {
    let rows = '';
    for (const act of here) {
      const mult = sel.yieldMult(s);
      const y = Object.entries(act.yields)
        .map(([r2, n]) => `+${Math.max(1, Math.round(n * mult))} ${r2}`)
        .join(' · ');
      const on = s.autoActivity === act.id;
      const auto = `<button class="ghost${on ? ' on' : ''}" data-act="dispatch"
        data-payload='${pay({ type: 'set_auto', id: on ? null : act.id })}'>${esc(on ? D.COPY.autoOff : D.COPY.autoOn)}</button>`;
      rows += ledger(
        { type: 'do_activity', id: act.id },
        act.label[0].toUpperCase(),
        esc(act.label),
        `${y} · −${act.satietyCost} body`,
        { extra: auto, aria: act.label },
      );
    }
    h += `<div class="card">${cardH('Labour at this ground')}${rows}</div>`;
  } else if (s.rung !== 'R0') {
    h += `<div class="card">${cardH('Labour at this ground')}<p class="note">${esc(D.COPY.noWorkHere)}</p></div>`;
  }

  // meals
  let meals = '';
  if (sel.isUnlocked(s, 'verb-cook')) {
    const hurt = s.character.hp < sel.hpMax(s) * 0.55;
    meals += ledger(
      { type: 'cook_meal' },
      'C',
      esc(D.COPY.cookLabel),
      `+${D.BALANCE.COOK_HP_RESTORE} life`,
      {
        disabled: s.resources.sansai < D.BALANCE.COOK_SANSAI_COST,
        cls: hurt ? 'urgent' : '',
        aria: D.COPY.cookLabel,
      },
    );
  }
  if (sel.isUnlocked(s, 'panel-estate')) {
    meals += ledger(
      { type: 'eat_rice' },
      'E',
      esc(D.COPY.eatRiceLabel),
      `+${D.BALANCE.EAT_RICE_SATIETY} body`,
      { disabled: s.resources.rice < D.BALANCE.EAT_RICE_COST, aria: D.COPY.eatRiceLabel },
    );
  }
  if (meals) h += `<div class="card">${cardH('The cookfire')}${meals}</div>`;

  // the rung ladder — a hand-ruled row of the book
  if (s.flags.raked || s.rung !== 'R0') {
    const cur = sel.rung(s);
    const next = sel.nextRung(s);
    const full = s.rungMeter >= cur.threshold;
    let status = '';
    if (full) {
      if (next && !next.unlocks) status = D.COPY.ladderEnd;
      else if (sel.storyGateMet(s)) status = D.COPY.ladderReady;
      else status = cur.advanceHint ?? D.COPY.ladderReady;
    }
    h += `<div class="card">${cardH(D.COPY.ladderService)}
      <div class="ladder">
        <div class="lrow">
          <span class="ltitle">${esc(cur.title)}</span>
          <span class="lnums num">${formatKMB(Math.min(s.rungMeter, cur.threshold))} / ${formatKMB(cur.threshold)}</span>
        </div>
        ${meter('ladder', s.rungMeter / cur.threshold)}
        ${status ? `<div class="lstatus">${esc(status)}</div>` : ''}
        ${next ? `<div class="lnext">${esc(D.COPY.ladderNext)} ${esc(next.title)}</div>` : `<div class="lnext">${esc(D.COPY.ladderEnd)}</div>`}
      </div>
    </div>`;
  }
  return h;
}

// ── Map tab ──────────────────────────────────────────────────
function mapHTML(s) {
  let h = pageHead(D.COPY.mapHeader);
  const node = sel.nodeOf(s);

  h += `<div class="card">${cardH(D.COPY.youStandAt)}
    <div class="here-label">${esc(node.label)}</div>
    <p class="note">${esc(node.blurb)}</p>
  </div>`;

  const dests = sel.reachable(s);
  h += `<div class="card">${cardH(D.COPY.onward)}<div class="dest-strip">${dests
    .map(({ node: n, blocked }) =>
      blocked
        ? `<button class="inkbtn dest" disabled>${esc(n.label)}<span class="d-sub">${esc(D.COPY.needsConditioning)}</span></button>`
        : `<button class="inkbtn dest" data-act="dispatch" data-payload='${pay({ type: 'move_to', node: n.id })}'>${esc(n.label)}</button>`,
    )
    .join('')}</div></div>`;

  const people = sel.peopleHere(s);
  if (people.length) {
    h += `<div class="card">${cardH(D.COPY.whosHere)}${people
      .map((p) => {
        const open = s.openPersonId === p.id;
        const btnLabel = open ? D.COPY.leave(p.name) : D.COPY.speakWith(p.name);
        return `<div class="person-row">
          <span class="person-name v-${p.voice}">${esc(p.name)}</span>
          <span class="person-tell">${esc(p.tell)}</span>
          <button class="ghost${open ? ' on' : ''}" data-act="dispatch"
            data-payload='${pay({ type: open ? 'leave' : 'talk', personId: p.id })}'>${esc(btnLabel)}</button>
        </div>`;
      })
      .join('')}</div>`;
  }

  if (s.openPersonId === 'pedlar') {
    h += marketHTML(s);
  }
  return h;
}

function marketHTML(s) {
  let rows = '';
  for (const item of D.MARKET_ITEMS) {
    const bought = s.marketBought[item.id] ?? 0;
    const soldOut = bought >= item.stockCap;
    const cantPay = s.resources.coin < item.coinCost;
    const grants = Object.entries(item.grants)
      .map(([r, n]) => `+${n} ${r}`)
      .join(' · ');
    rows += `<div class="entry-row market-row">
      <div class="entry-main">
        <div class="entry-label">${esc(item.label)}</div>
        <div class="grants">${esc(grants)}</div>
        <div class="entry-note">${esc(item.blurb)}</div>
      </div>
      <div class="tagcol">
        <span class="tag num">${esc(formatCoin(item.coinCost))}</span>
        <span class="stock num">${soldOut ? 'sold out' : `${item.stockCap - bought} left`}</span>
      </div>
      <button class="seal" data-act="dispatch" data-payload='${pay({ type: 'buy_item', id: item.id })}'
        ${soldOut || cantPay ? 'disabled' : ''} aria-label="Buy: ${esc(item.label)}">${esc(item.label[0].toUpperCase())}</button>
    </div>`;
  }

  const price = sel.ricePrice(s);
  const season = sel.seasonOf(s.clock.day);
  const gloss = D.RICE_SELL_GLOSS[season.id];
  const n = s.resources.rice;
  const sell = `<div class="card">${cardH(D.COPY.sellRiceHeader)}
    <p class="lede-line">${esc(D.COPY.sellRiceLine(price, season.label, gloss))}</p>
    ${ledger(
      { type: 'sell_rice' },
      'S',
      esc(D.COPY.sellAllRice(formatKMB(n), formatCoin(n * price))),
      null,
      { disabled: n <= 0, aria: 'Sell all rice' },
    )}
  </div>`;

  return `<div class="card">${cardH(D.COPY.marketHeader)}
    <p class="lede-line">${esc(D.MARKET_BLURB)}</p>${rows}</div>${sell}`;
}

// ── Estate tab ───────────────────────────────────────────────
function estateHTML(s) {
  let h = pageHead(D.COPY.estateHeader);

  // the kura-works improve card
  const standing = D.ESTATE_STAGE_NAMES[s.estateStage];
  const next = D.ESTATE_STAGES[s.estateStage];
  let improve = `<div class="lede-line">${esc(standing)}</div>`;
  if (next) {
    improve += ledger(
      { type: 'improve_estate' },
      next.label[0].toUpperCase(),
      esc(next.label),
      `${esc(next.blurb)}<br>+${next.yieldBonusNum}% labour output · +${next.satietyMaxBonus} max body`,
      {
        disabled: s.resources.coin < next.coinCost,
        extra: `<span class="tag num">${esc(formatCoin(next.coinCost))}</span>`,
        aria: next.label,
      },
    );
  } else {
    improve += `<p class="note">${esc(D.ESTATE_STAGES[3].logLine)}</p>`;
  }
  h += `<div class="card">${cardH('The kura-works')}${improve}</div>`;

  // the house reopens — locked silhouette rows
  h += `<div class="card">${cardH(D.COPY.houseReopens)}${D.HOUSE_ROOMS.map(
    (r) =>
      `<div class="sil"><span>◆ ${esc(r.label)}</span><span class="dash"></span><span class="lock">${esc(r.lockRung)}</span></div>`,
  ).join('')}</div>`;

  // house standing — the locked teaser (R3)
  if (sel.isUnlocked(s, 'panel-house-influence')) {
    const hi = D.HOUSE_INFLUENCE;
    h += `<div class="card">${cardH(hi.header)}
      <p class="note">${esc(hi.blurb)}</p>
      ${Array.from({ length: hi.silhouetteRows }, () => `<div class="sil"><span>◆</span><span class="dash"></span></div>`).join('')}
      <p class="note" style="margin-top:8px">${esc(hi.lockedFoot)}</p>
    </div>`;
  }
  return h;
}

// ── Inventory tab ────────────────────────────────────────────
function inventoryHTML(s) {
  let h = pageHead('Inventory');
  const st = D.STOREHOUSE;
  h += `<div class="card">${cardH(st.header)}<p class="lede-line">${esc(st.blurb)}</p>`;
  if (s.location === 'kura') {
    const line = D.COPY.carriedLine(
      formatCoin(s.resources.coin),
      formatKMB(s.resources.rice),
      formatCoin(s.banked.coin),
      formatKMB(s.banked.rice),
    );
    h += `<p class="entry-label num" style="margin-bottom:12px">${esc(line)}</p>
      <div class="dest-strip">
        <button class="inkbtn" data-act="dispatch" data-payload='${pay({ type: 'deposit', what: 'coin' })}'
          ${s.resources.coin <= 0 ? 'disabled' : ''}>${esc(D.COPY.storeAllCoin)}</button>
        <button class="inkbtn" data-act="dispatch" data-payload='${pay({ type: 'withdraw', what: 'coin' })}'
          ${s.banked.coin <= 0 ? 'disabled' : ''}>${esc(D.COPY.withdrawAllCoin)}</button>
        <button class="inkbtn" data-act="dispatch" data-payload='${pay({ type: 'deposit', what: 'rice' })}'
          ${s.resources.rice <= 0 ? 'disabled' : ''}>${esc(D.COPY.storeAllRice)}</button>
        <button class="inkbtn" data-act="dispatch" data-payload='${pay({ type: 'withdraw', what: 'rice' })}'
          ${s.banked.rice <= 0 ? 'disabled' : ''}>${esc(D.COPY.withdrawAllRice)}</button>
      </div>`;
  } else {
    h += `<p class="note">${esc(st.offNodeBlurb)}</p>`;
  }
  h += `</div>`;
  return h;
}

// ── Character tab ────────────────────────────────────────────
function characterHTML(s) {
  let h = pageHead('Character');

  // skills — visible by doing
  const visible = D.SKILLS.filter((sk) => {
    const st = s.skills[sk.id];
    return sk.id === 'conditioning' || (st && (st.xp > 0 || st.level > 1));
  });
  if (visible.length) {
    h += `<div class="card">${cardH('Skills')}${visible
      .map((sk) => {
        const st = s.skills[sk.id];
        const need = 40 + st.level * 30;
        return `<div class="skill-row">
          <div class="skill-top">
            <span class="skill-name">${esc(sk.label)}</span>
            <span class="skill-lv num">Lv ${st.level}</span>
            <span class="skill-hint">+${D.SKILL_YIELD_PER_LEVEL}% yield per level</span>
          </div>
          <div class="entry-note">${esc(sk.blurb)}</div>
          ${meter('skill-' + sk.id, st.xp / need)}
        </div>`;
      })
      .join('')}</div>`;
  }

  // training (R3)
  if (sel.isUnlocked(s, 'readout-combat-level')) {
    const pts = s.character.attributePoints;
    h += `<div class="card">${cardH(D.COPY.trainingHeader)}
      <p class="lede-line num">${esc(D.COPY.trainingPoints(pts))}</p>
      ${D.ATTRS.map(
        (a) => `<div class="attr-row">
          <span class="attr-tag">${esc(a.label)}</span>
          <span class="attr-name">${esc(a.name)} <span class="gloss">— ${esc(a.gloss)}</span></span>
          <span class="attr-val num">${s.character.attrs[a.id]}</span>
          <button class="seal mini" data-act="dispatch" data-payload='${pay({ type: 'spend_attribute', attr: a.id })}'
            ${pts <= 0 ? 'disabled' : ''} aria-label="Train ${esc(a.name)}">+1</button>
        </div>`,
      ).join('')}</div>`;
  }

  // bestiary (R3)
  if (sel.isUnlocked(s, 'panel-bestiary')) {
    const entries = sel.bestiary(s);
    const faced = entries.filter((e) => e.faced).length;
    h += `<div class="card">${cardH(D.COPY.bestiaryHeader)}
      <p class="lede-line num">${esc(D.COPY.bestiaryCount(faced, entries.length))}</p>
      <div class="beast-grid">${entries
        .map(({ mob, faced: f }) => {
          if (!f) {
            return `<div class="beast fogged">
              <div class="b-top"><span class="b-name">${esc(D.COPY.bestiaryUnknown)}</span></div>
              <div class="b-meta">${esc(D.COPY.bestiaryNotFaced)}</div>
            </div>`;
          }
          const pct = sel.winRate(s, mob);
          const band = sel.winBand(pct);
          return `<div class="beast">
            <div class="b-top">
              <span class="b-name">${esc(mob.label)}</span>
              <span class="chip pip-${band.pip} num">${esc(band.label)} · ${pct}%</span>
            </div>
            <div class="b-blurb">${esc(mob.blurb)}</div>
            <div class="b-meta">Tell — ${esc(mob.tell)}<br>Haunts — ${esc(mob.haunts)}</div>
          </div>`;
        })
        .join('')}</div></div>`;
  }

  // undertakings (R3)
  if (sel.isUnlocked(s, 'tab-combat')) {
    h += `<div class="card">${cardH(D.QUESTS_HEADER)}
      <p class="lede-line">${esc(D.QUESTS_BLURB)}</p>
      ${D.QUESTS.map((q) => {
        const state = sel.questState(s, q);
        const done = s.quests.progress[q.id] ?? [];
        const steps = q.steps
          .map(
            (st) =>
              `<li class="${done.includes(st.id) ? 'done' : ''}"><span class="m">${done.includes(st.id) ? '✓' : '·'}</span><span>${esc(st.label)}</span></li>`,
          )
          .join('');
        let action = '';
        if (state === 'open') {
          action = `<button class="inkbtn" data-act="dispatch" data-payload='${pay({ type: 'accept_quest', id: q.id })}'>${esc(D.COPY.takeThisOn)}</button>`;
        } else if (state === 'accepted') {
          action = `<span class="chip">Undertaken</span>`;
        } else {
          action = `<span class="chip done">✓ Done</span>`;
        }
        return `<div class="quest">
          <div class="q-top"><span class="chip">${esc(q.kind)}</span><span class="q-title">${esc(q.title)}</span></div>
          <div class="q-blurb">${esc(q.blurb)}</div>
          <ol>${steps}</ol>
          <div class="q-foot">
            <span class="q-reward num">${esc(D.COPY.reward(formatCoin(q.rewardCoin)))}</span>
            ${action}
          </div>
        </div>`;
      }).join('')}</div>`;
  }
  return h;
}

// ── Combat tab ───────────────────────────────────────────────
function combatHTML(s) {
  let h = pageHead('Combat');
  const need = sel.combatXpNeeded(s);

  h += `<div class="card">${cardH(D.COPY.combatLevel(s.character.level))}
    <div class="krow" style="margin-bottom:2px">
      <span class="note">toward the next level</span>
      <span class="entry-note num">${s.character.combatXp} / ${need}</span>
    </div>
    ${meter('cxp', s.character.combatXp / need, 'green')}
  </div>`;

  const w = D.WEAPONS.find((x) => x.id === s.equippedWeapon);
  h += `<div class="card">${cardH(w.label)}
    <span class="chip">${esc(w.archetype)}</span>
    <p class="note" style="margin-top:8px">${esc(w.blurb)}</p>
  </div>`;

  const foes = sel.foesHere(s);
  let watch = '';
  if (!foes.length) {
    watch = `<p class="note">${esc(D.COPY.watchEmpty)}</p>`;
  } else {
    watch = foes
      .map((m) => {
        const facedIt = s.bestiaryFaced.includes(m.id);
        const pct = sel.winRate(s, m);
        const band = sel.winBand(pct);
        const onEnd = s.autoCombat === m.id && !s.autoCombatRetreat;
        const onFlee = s.autoCombat === m.id && s.autoCombatRetreat;
        const autos = `<div class="watch-autos">
          <button class="ghost${onEnd ? ' on' : ''}" data-act="dispatch"
            data-payload='${pay({ type: 'set_auto_combat', mobId: onEnd ? null : m.id, retreat: false })}'>${esc(D.COPY.autoToEnd)}</button>
          <button class="ghost${onFlee ? ' on' : ''}" data-act="dispatch"
            data-payload='${pay({ type: 'set_auto_combat', mobId: onFlee ? null : m.id, retreat: true })}'>${esc(D.COPY.autoFlee)}</button>
        </div>`;
        return `<div class="entry-row watch-row">
          <div class="entry-main">
            <div class="entry-label${facedIt ? '' : ' v-narrator'}" ${facedIt ? '' : 'style="font-style:italic"'}>
              ${facedIt ? esc(m.label) : esc(D.COPY.bestiaryUnknown)}
              <span class="chip pip-${band.pip} num" style="margin-left:8px">${esc(band.label)} · ${pct}%</span>
            </div>
            <div class="entry-note">${esc(m.blurb)}</div>
          </div>
          ${autos}
          <button class="seal" data-act="dispatch" data-payload='${pay({ type: 'fight', mobId: m.id })}'
            aria-label="${esc(D.COPY.fight)}: ${esc(m.label)}">F</button>
        </div>`;
      })
      .join('');
  }
  h += `<div class="card">${cardH(D.COPY.watchHeader)}${watch}</div>`;
  return h;
}

// ── the left page router ─────────────────────────────────────
function pageLeftHTML(s) {
  switch (ui.tab) {
    case 'map':       return mapHTML(s);
    case 'estate':    return estateHTML(s);
    case 'inventory': return inventoryHTML(s);
    case 'character': return characterHTML(s);
    case 'combat':    return combatHTML(s);
    default:          return workHTML(s);
  }
}

// ── the log — the right page ─────────────────────────────────
function logPageHTML(s) {
  const filters = D.LOG_FILTERS.map(
    (f) =>
      `<button class="ghost${f === ui.filter ? ' on' : ''}" data-act="filter" data-filter="${f}">${esc(D.LOG_FILTER_LABELS[f])}</button>`,
  ).join('');

  const lines = sel.logView(s, ui.filter);
  const entries = lines
    .map((l) => {
      const bullet = D.CHANNEL_BULLET[l.channel] ?? '·';
      // engine text sometimes already opens with the channel bullet — don't double it
      let text = l.text;
      if (text.startsWith(bullet)) text = text.slice(bullet.length).trimStart();
      const spk = l.voice
        ? `<span class="spk v-${esc(l.voice)}">${esc(l.speaker ?? '')}${l.speaker ? ' —' : ''}</span> `
        : '';
      const times = l.count > 1 ? `<span class="times">×${l.count}</span>` : '';
      const fresh = l.id > ui.animatedLogId && !REDUCED ? ' fresh' : '';
      return `<div class="entry ch-${esc(l.channel)}${fresh}">
        <span class="b">${bullet}</span>
        <span class="t">${spk}${esc(text)}${times}</span>
      </div>`;
    })
    .join('');

  return `<div class="log-fixed">
      <h2 class="page-title">${esc(D.LOG_HEADER)}</h2>
      <div class="rule-kumiko"></div>
      <div class="filters">${filters}</div>
    </div>
    <div id="log-scroll"><div class="entries">${entries}</div></div>`;
}

// ── full-screen moments ──────────────────────────────────────

function coldOpenHTML() {
  const c = D.COLD_OPEN;
  return `<div class="veil"></div>
    <div class="cover">
      <div class="cover-frame"></div>
      <h1>${esc(c.title)}</h1>
      <div class="cover-sub">${esc(c.subtitle)}</div>
      <p class="cover-lede">${esc(c.lede)}</p>
      <div class="cover-verb">
        <button class="seal big" data-act="dispatch" data-payload='${pay({ type: 'open_eyes' })}'
          aria-label="${esc(c.verb)}">O</button>
        <div class="cover-verb-label">${esc(c.verb)}</div>
      </div>
    </div>`;
}

function vnLine(l, fresh) {
  const spk = l.speaker
    ? `<span class="spk v-${esc(l.voice)}">${esc(l.speaker)} —</span> `
    : '';
  return `<p class="vn-line v-${esc(l.voice)}${fresh && !REDUCED ? ' fresh' : ''}">${spk}${esc(l.text)}</p>`;
}

function vnHTML(s) {
  const vn = s.vn;
  const scene = vn.kind === 'intro' ? D.INTRO_SCENES[vn.sceneIndex] : D.RUNG_BEATS[vn.target];
  const who = scene.speaker ?? scene.plateLabel ?? '';
  const plate = `<div class="plate" style="--vc: var(--v-${esc(scene.voice)})">
    <span class="mono">${esc(scene.sealText)}</span>
    <span class="who">${esc(who)}</span>
  </div>`;

  let body = '';
  let foot = '';

  const shownLines = scene.greeting.slice(0, vn.shown);
  const greetHTML = shownLines.map((l, i) => vnLine(l, i === vn.shown - 1 && vn.phase === 'greeting')).join('');

  if (vn.phase === 'greeting') {
    body = `<div class="vn-lines" data-act="dispatch" data-payload='${pay({ type: 'vn_next' })}'>${greetHTML}</div>`;
    foot = `<div class="vn-hint" data-act="dispatch" data-payload='${pay({ type: 'vn_next' })}'>— go on —</div>`;
  } else if (vn.phase === 'ask') {
    const lastTopic = scene.topics.find((t) => t.id === vn.lastAsk);
    const answerHTML = lastTopic
      ? lastTopic.answer.map((l, i) => vnLine(l, i === lastTopic.answer.length - 1)).join('')
      : '';
    const topics = scene.topics
      .filter((t) => !t.gateTopic || vn.asked.includes(t.gateTopic))
      .map((t) => {
        const asked = vn.asked.includes(t.id);
        return `<button class="topic${asked ? ' asked' : ''}" data-act="dispatch"
          data-payload='${pay({ type: 'vn_ask', topicId: t.id })}'><span>${asked ? '✓ ' : ''}${esc(t.label)}</span></button>`;
      })
      .join('');
    body = `<div class="vn-lines">${greetHTML}${answerHTML}
      <div class="topics">${topics}
        <button class="topic done-asking" data-act="dispatch"
          data-payload='${pay({ type: 'vn_done_asking' })}'><span>${esc(D.COPY.doneQuestioning)}</span></button>
      </div></div>`;
  } else if (vn.phase === 'decide') {
    const opts = scene.decision.options
      .map(
        (o) =>
          `<button class="topic" data-act="dispatch"
            data-payload='${pay({ type: 'vn_choose', optionId: o.id })}'><span>${esc(o.label)}</span></button>`,
      )
      .join('');
    body = `<div class="vn-lines">${greetHTML}
      <p class="vn-prompt">${esc(scene.decision.prompt)}</p>
      <div class="topics">${opts}</div></div>`;
  } else {
    // resolved
    const opt = scene.decision.options.find((o) => o.id === vn.picked);
    let perk = '';
    if (opt.perk) {
      const statLine = opt.stat
        ? `<div class="perk-stat num">+1 ${opt.stat.up.toUpperCase()} · −1 ${opt.stat.down.toUpperCase()}</div>`
        : '';
      perk = `<div class="perk">
        <div class="perk-tag">${esc(D.COPY.perkTag)}</div>
        <div class="perk-name">${esc(opt.perk.name)}</div>
        <div class="perk-desc">${esc(opt.perk.desc)}</div>
        ${statLine}
      </div>`;
    }
    const bonus = opt.statBonus ? `<p class="vn-line v-narrator">${esc(opt.statBonus.note)}</p>` : '';
    body = `<div class="vn-lines">${greetHTML}
      ${vnLine({ voice: 'player', speaker: 'You', text: opt.say }, true)}
      ${vnLine({ voice: scene.voice, speaker: scene.speaker ?? who, text: opt.react }, true)}
      ${bonus}${perk}</div>`;
    foot = `<div class="vn-foot"><button class="inkbtn vn-continue" data-act="dispatch"
      data-payload='${pay({ type: 'vn_continue' })}'>${esc(D.COPY.continueBtn)}</button></div>`;
  }

  return `<div class="veil"></div>
    <div class="vn-page">
      <div class="rule-kumiko"></div>
      ${plate}
      ${body}
      ${foot}
    </div>`;
}

function ceremonyHTML(s) {
  const held = Date.now() - ui.ceremonyAt > 1800;
  return `<div class="veil"${held ? ` data-act="dispatch" data-payload='${pay({ type: 'dismiss_ceremony' })}'` : ''}></div>
    <div class="cere${held ? ' settled' : ''}">
      <div class="rule-kumiko"></div>
      <div class="cere-eyebrow">${esc(D.COPY.promoted)}</div>
      <h1 class="cere-title">${esc(s.ceremony.title)}</h1>
      <div class="cere-seal" aria-hidden="true">K</div>
      <div class="rule-kumiko"></div>
      ${
        held
          ? `<button class="inkbtn cere-continue" data-act="dispatch" data-payload='${pay({ type: 'dismiss_ceremony' })}'>${esc(D.COPY.continueBtn)}</button>`
          : `<div class="vn-hint cere-hold">· · ·</div>`
      }
    </div>`;
}

function overlayHTML(s) {
  if (s.phase === 'cold-open') return coldOpenHTML();
  if (s.phase === 'vn' && s.vn) return vnHTML(s);
  if (s.ceremony) return ceremonyHTML(s);
  return '';
}

// ── the stage strip (review affordance) ──────────────────────
function stripHTML(s) {
  const panel = ui.stripOpen
    ? `<div class="strip-panel">
        <h4>Stages</h4>
        ${D.STAGES.map(
          (st) =>
            `<button class="strip-btn${s.stageId === st.id ? ' cur' : ''}" data-act="stage"
              data-stage="${st.id}" title="${esc(st.blurb)}">${s.stageId === st.id ? '› ' : ''}${esc(st.label)}</button>`,
        ).join('')}
        <div class="strip-sep"></div>
        <h4>Moments</h4>
        <button class="strip-btn" data-act="moment" data-moment="intro">Play intro</button>
        <button class="strip-btn" data-act="moment" data-moment="wolf">Face the wolf</button>
        <button class="strip-btn" data-act="moment" data-moment="fight">Fight</button>
        <button class="strip-btn" data-act="moment" data-moment="rungup">Rung-up</button>
      </div>`
    : '';
  return `${panel}<button class="strip-pull" data-act="strip-toggle">Stages ${ui.stripOpen ? '▾' : '▴'}</button>`;
}

// ── render ───────────────────────────────────────────────────
function render(s) {
  // stage bookkeeping — a stage jump resets local UI state
  if (s.stageId !== lastStage) {
    lastStage = s.stageId;
    ui.tab = 'work';
    ui.filter = 'story';
    ui.face = 'work';
    ui.seenTabs = new Set(sel.visibleTabs(s).map((t) => t.id));
    ui.freshTabs = new Set();
    ui.animatedLogId = Math.max(0, ...s.log.map((l) => l.id));
    ui.seenLogId = ui.animatedLogId;
    for (const k of Object.keys(meterMemo)) delete meterMemo[k];
    prevVitals = null;
  }

  // tab validity + tab-reveal drama
  const visibleIds = sel.visibleTabs(s).map((t) => t.id);
  if (!visibleIds.includes(ui.tab)) ui.tab = 'work';
  const fresh = visibleIds.filter((id) => !ui.seenTabs.has(id));
  if (fresh.length) {
    ui.freshTabs = new Set(fresh);
    for (const id of visibleIds) ui.seenTabs.add(id);
  }

  // mobile face bookkeeping — the desktop spread always shows both pages,
  // so off-mobile the face pins to 'work' (keeps desktop DOM canonical).
  // The record counts as "read" whenever the log page is actually in view:
  // on desktop always, on mobile when the record face is up or the log is
  // inlined below the verbs (the sparse pre-nav R0 page).
  if (!MQ_MOBILE.matches && ui.face !== 'work') ui.face = 'work';
  const maxLogId = Math.max(0, ...s.log.map((l) => l.id));
  if (!MQ_MOBILE.matches || ui.face === 'record' || !sel.navVisible(s)) ui.seenLogId = maxLogId;

  document.body.className = `phase-${s.phase} face-${ui.face}${sel.navVisible(s) ? '' : ' log-inline'}`;

  setHTML('vitals', s.phase === 'cold-open' ? '' : vitalsHTML(s));

  // the mobile bookmark ribbon scrolls — keep the reader's place across
  // re-renders (innerHTML rebuilds reset scrollLeft)
  const bmOld = document.querySelector('.bm-tabs');
  const bmScroll = bmOld ? bmOld.scrollLeft : 0;
  if (setHTML('bookmarks', s.phase === 'cold-open' ? '' : bookmarksHTML(s))) {
    const bmNew = document.querySelector('.bm-tabs');
    if (bmNew) bmNew.scrollLeft = bmScroll;
  }

  // a newly-revealed bookmark must announce itself even off-screen — slide
  // the mobile bookmark bar so the fresh tab's rise is seen
  if (fresh.length && MQ_MOBILE.matches) {
    requestAnimationFrame(() => {
      const el = document.querySelector('.bookmark.fresh');
      if (el) el.scrollIntoView({ inline: 'center', block: 'nearest', behavior: REDUCED ? 'auto' : 'smooth' });
    });
  }

  // left page (preserve scroll within the same tab)
  const leftEl = $('page-left');
  const prevLeftScroll = leftEl.scrollTop;
  if (setHTML('page-left', pageLeftHTML(s))) {
    leftEl.scrollTop = ui.tab === lastLeftTab ? prevLeftScroll : 0;
  }
  lastLeftTab = ui.tab;

  // right page — the log; keep the reader's place, follow the newest line
  const oldScroll = $('log-scroll');
  const wasBottom = oldScroll
    ? oldScroll.scrollHeight - oldScroll.scrollTop - oldScroll.clientHeight < 48
    : true;
  const prevLogTop = oldScroll ? oldScroll.scrollTop : 0;
  if (setHTML('page-right', logPageHTML(s))) {
    const nl = $('log-scroll');
    if (nl) nl.scrollTop = wasBottom ? nl.scrollHeight : prevLogTop;
  }
  ui.animatedLogId = Math.max(ui.animatedLogId, ...s.log.map((l) => l.id), 0);

  // overlays
  const ov = overlayHTML(s);
  const ovChanged = setHTML('overlay', ov);
  $('overlay').classList.toggle('on', !!ov);
  if (ovChanged) {
    const vl = document.querySelector('.vn-lines');
    if (vl) vl.scrollTop = vl.scrollHeight;
  }

  // hold the ceremony ~2s before the continue affordance appears
  if (s.ceremony && !ui.ceremonyAt) {
    ui.ceremonyAt = Date.now();
    setTimeout(() => render(eng.state), REDUCED ? 250 : 1950);
  }
  if (!s.ceremony) ui.ceremonyAt = 0;

  setHTML('stagestrip', stripHTML(s));
  animateMeters();

  // iOS WebKit only synthesizes `click` for taps on interactive elements —
  // the few non-button tap targets (.vn-lines, .vn-hint, the ceremony veil)
  // need a direct no-op handler so the delegated click listener hears them.
  // Re-applied every render because innerHTML rebuilds the nodes.
  for (const el of document.querySelectorAll('[data-act]:not(button)')) {
    if (!el.onclick) el.onclick = () => {};
  }

  prevVitals = {
    rice: s.resources.rice,
    coin: s.resources.coin,
    wood: s.resources.wood,
    sansai: s.resources.sansai,
  };
}

// ── demo moments (stage-strip only; the meter hack is the one
//    documented exception per VARIANT-SPEC §2) ─────────────────
function moment(m) {
  if (m === 'intro') {
    eng.setStage('cold-open');
    eng.dispatch({ type: 'open_eyes' });
  } else if (m === 'wolf') {
    eng.setStage('R2'); // wakes at the kura — the wolf is here
    ui.filter = 'combat';
    ui.face = 'record'; // on mobile, flip to the record so the fight is seen
    eng.dispatch({ type: 'face_wolf' });
  } else if (m === 'fight') {
    eng.setStage('R3');
    eng.dispatch({ type: 'move_to', node: 'gate-forecourt' });
    ui.tab = 'combat';
    ui.filter = 'combat';
    ui.face = 'record';
    eng.dispatch({ type: 'fight', mobId: 'rice_rats' });
  } else if (m === 'rungup') {
    // Documented demo hack — VARIANT-SPEC §2: fill the meter AND set the
    // CURRENT rung's story-gate flag (`farmed` at R1, `first-fight-survived`
    // at R2) so the summons is answerable from any staged rung. R3's next
    // rung (R4) has no in-scope beat, so from there restage to R0 first.
    if (eng.state.stageId === 'cold-open' || !D.RUNG_BEATS[sel.nextRung(eng.state)?.id]) {
      eng.setStage('R0');
    }
    const cur = sel.rung(eng.state);
    if (cur.storyGateFlag) eng.state.flags[cur.storyGateFlag] = true;
    eng.state.rungMeter = 99999;
    eng.dispatch({ type: 'begin_rung_beat' });
  }
}

// ── events ───────────────────────────────────────────────────
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || el.hasAttribute('disabled')) return;
  const act = el.dataset.act;
  if (act === 'dispatch') {
    eng.dispatch(JSON.parse(el.dataset.payload));
  } else if (act === 'tab') {
    ui.tab = el.dataset.tab;
    ui.face = 'work'; // a tab bookmark always flips the journal to the work page
    render(eng.state);
    document.querySelector('.bookmark.active')?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  } else if (act === 'face') {
    ui.face = 'record'; // the Record bookmark flips to the log page
    render(eng.state);
  } else if (act === 'filter') {
    ui.filter = el.dataset.filter;
    render(eng.state);
  } else if (act === 'strip-toggle') {
    ui.stripOpen = !ui.stripOpen;
    render(eng.state);
  } else if (act === 'stage') {
    ui.stripOpen = false;
    eng.setStage(el.dataset.stage);
  } else if (act === 'moment') {
    ui.stripOpen = false;
    moment(el.dataset.moment);
  }
  // when the record page just became visible (it renders while hidden, so
  // the usual stick-to-bottom pass can't reach it), pin it to the newest line
  if (MQ_MOBILE.matches && ui.face === 'record') {
    const ls = $('log-scroll');
    if (ls) ls.scrollTop = ls.scrollHeight;
  }
});

eng.subscribe((state) => render(state));
