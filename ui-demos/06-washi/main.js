// ui-demos/06-washi/main.js — Washi & Ink: the faithful baseline.
// The CURRENT game's composition kept exactly (title bar / header vitals / nav /
// work LEFT / log RIGHT / ink footer); the budget is spent on UX polish — uniform
// states, animated meters, ink-in log lines, a properly held seal ceremony.
// All data/logic from ../shared/*.js — nothing invented, zero Japanese glyphs.

import { createEngine, sel } from '../shared/engine.js';
import * as D from '../shared/data.js';
import { formatKMB, formatCoin } from '../shared/format.js';

const eng = createEngine('R1');

const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ui = {
  tab: 'work',
  paneTab: null,
  logFilter: 'story',
  lastFilter: 'story',
  logKeys: [],
  tabFreshAt: new Map(), // tabId → first-seen ms (drives the one-time glint)
  lastStage: null,
  stripOpen: false,
  logOpen: false, // mobile only — the folded log expanded over the work pane
  lastPeekKey: '', // newest 'all'-line key (drives the peek's fresh animation)
  logScaleIdx: 1, // index into LOG_SCALES (the A−/A+ stepper)
  ceremonyAt: 0,
  ceremonyTimer: 0,
  coldTimers: [],
  coldPlayed: false,
};

const prevVals = new Map(); // data-vk → last value  (number pops)
const meterPrev = new Map(); // data-m  → last width % (eased fills)
const htmlCache = new Map(); // element → last innerHTML string
const tw = { key: null, timer: 0, full: '', el: null }; // the one live typewriter

const $ = (id) => document.getElementById(id);

/* ── the light/dark toggle — data-theme lands pre-paint via the head script ── */
const THEME_KEY = 'kk-ui-demos-06-theme';
const themeBtn = $('themetoggle');
function syncThemeBtn() {
  themeBtn.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'dark'));
}
themeBtn.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem(THEME_KEY, next); } catch { /* private mode — session-only */ }
  syncThemeBtn();
});
syncThemeBtn();

function esc(x) {
  return String(x).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function setHTML(el, html) {
  if (htmlCache.get(el) === html) return false;
  htmlCache.set(el, html);
  el.innerHTML = html;
  return true;
}

/* ── tiny component builders ─────────────────────────────────────────────── */

// A meter that animates between renders: render at the LAST width, then rAF to
// the target so the CSS width transition runs even across an innerHTML replace.
function meter(id, frac, cls = '') {
  const pct = Math.max(0, Math.min(100, (frac || 0) * 100));
  const from = meterPrev.has(id) ? meterPrev.get(id) : pct;
  return `<span class="meter ${cls}"><i data-m="${id}" data-w="${pct.toFixed(2)}" style="width:${from.toFixed(2)}%"></i></span>`;
}
function bar(id, frac, cls = '') {
  const pct = Math.max(0, Math.min(100, (frac || 0) * 100));
  const from = meterPrev.has(id) ? meterPrev.get(id) : pct;
  return `<span class="bar ${cls}"><i data-m="${id}" data-w="${pct.toFixed(2)}" style="width:${from.toFixed(2)}%"></i></span>`;
}
function animateMeters() {
  document.querySelectorAll('i[data-m]').forEach((el) => {
    const target = parseFloat(el.dataset.w);
    meterPrev.set(el.dataset.m, target);
    requestAnimationFrame(() => { el.style.width = target + '%'; });
  });
}
function popVals() {
  document.querySelectorAll('[data-vk]').forEach((el) => {
    const k = el.dataset.vk;
    const v = el.dataset.vv;
    const old = prevVals.get(k);
    if (old !== undefined && old !== v) {
      el.classList.remove('pop');
      void el.offsetWidth;
      el.classList.add('pop');
    }
    prevVals.set(k, v);
  });
}

function cardHead(title, extra = '') {
  return `<div class="card-head"><h2>${esc(title)}</h2>${extra}</div>`;
}
function autoBtn(on, act, extra = '') {
  return `<button class="auto${on ? ' on' : ''}" data-act="${act}" ${extra} aria-pressed="${on}" title="${on ? 'Stop the auto-repeat' : 'Repeat this on its own'}">${esc(on ? D.COPY.autoOff : D.COPY.autoOn)}</button>`;
}
function winHTML(pct) {
  const band = sel.winBand(pct);
  return `<span class="win"><span class="pip ${band.pip}"></span><b class="pct">${pct}%</b><span class="band">${esc(band.label)}</span></span>`;
}
function stockDots(bought, cap) {
  let dots = '';
  for (let i = 0; i < cap; i++) dots += `<span class="dot${i < cap - bought ? ' full' : ''}"></span>`;
  return `<span class="stock" title="${cap - bought} of ${cap} in stock">${dots}</span>`;
}
const em = (glyph) => `<span class="emoji">${glyph}</span>`;

/* ── header vitals ───────────────────────────────────────────────────────── */

function vitalsHTML(s) {
  const u = (x) => sel.isUnlocked(s, x);
  const r = s.resources;
  const parts = [`<span class="house-mark">${esc(D.HOUSE_MARK)}</span>`];

  parts.push(`<span class="vital"><span class="label">${esc(D.COPY.vitals.rice)}</span><b class="value" data-vk="rice" data-vv="${r.rice}">${formatKMB(r.rice)}</b></span>`);
  if (r.coin + s.banked.coin > 0) {
    parts.push(`<span class="vital coin"><span class="label">${esc(D.COPY.vitals.coin)}</span><b class="value" data-vk="coin" data-vv="${r.coin}">${esc(formatCoin(r.coin))}</b></span>`);
  }
  if (u('readout-clock')) {
    const season = sel.seasonOf(s.clock.day);
    parts.push(`<span class="vital clock"><span class="season-tag">${em(season.emoji)} ${esc(season.label)}</span><span class="clock-date">Year ${sel.yearOf(s.clock.day)} · day ${sel.dayOfSeason(s.clock.day)}</span></span>`);
  }
  if (u('verb-face-wolf')) {
    const max = sel.hpMax(s);
    const low = s.character.hp <= max * 0.3;
    parts.push(`<span class="vital meterv"><span class="label">${esc(D.COPY.vitals.life)}</span>${bar('hp', s.character.hp / max, 'life' + (low ? ' low' : ''))}<span class="bar-num" data-vk="hp" data-vv="${Math.round(s.character.hp)}">${Math.round(s.character.hp)}/${max}</span></span>`);
  }
  if (u('readout-stamina')) {
    const max = sel.satietyMax(s);
    const low = s.character.satiety <= max * 0.3;
    parts.push(`<span class="vital meterv"><span class="label">${esc(D.COPY.vitals.body)}</span>${bar('body', s.character.satiety / max, low ? 'low' : '')}</span>`);
  }
  if (u('row-wood')) {
    parts.push(`<span class="vital"><span class="label">${esc(D.COPY.vitals.wood)}</span><b class="value" data-vk="wood" data-vv="${r.wood}">${formatKMB(r.wood)}</b></span>`);
  }
  if (u('row-sansai')) {
    parts.push(`<span class="vital"><span class="label">${esc(D.COPY.vitals.sansai)}</span><b class="value" data-vk="sansai" data-vv="${r.sansai}">${formatKMB(r.sansai)}</b></span>`);
  }

  // the rung head — the sole home of progression (hover card = detail on demand)
  const rung = sel.rung(s);
  const next = sel.nextRung(s);
  const ready = sel.summonsReady(s);
  const into = Math.min(s.rungMeter, rung.threshold);
  const trigger = ready
    ? `<button class="rung-trigger" data-act="summons"><span class="summons-cue">${esc(D.COPY.summons)}</span></button>`
    : `<div class="rung-trigger" tabindex="0" onclick=""><span class="rung-name">${esc(rung.title)}</span><span class="rung-mini"><i data-m="rung" data-w="${((into / rung.threshold) * 100).toFixed(2)}" style="width:${(meterPrev.get('rung') ?? (into / rung.threshold) * 100).toFixed(2)}%"></i></span></div>`;
  parts.push(`<div class="rung-head${ready ? ' ready' : ''}">
    ${trigger}
    <div class="rung-card" role="tooltip">
      <div class="rc-now">${esc(rung.title)} · ${esc(rung.id)}</div>
      <div class="rc-meter">${esc(D.COPY.ladderService)} · ${formatKMB(into)} / ${formatKMB(rung.threshold)}</div>
      ${ready ? `<div class="rc-next">${esc(D.COPY.ladderReady)}</div>` : ''}
      ${next ? `<div class="rc-next">${esc(D.COPY.ladderNext)} ${esc(next.title)}</div>` : ''}
    </div>
  </div>`);
  return parts.join('');
}

/* ── nav ─────────────────────────────────────────────────────────────────── */

function navHTML(s) {
  const now = Date.now();
  return sel.visibleTabs(s).map((t) => {
    if (!ui.tabFreshAt.has(t.id)) ui.tabFreshAt.set(t.id, now);
    const fresh = !RM && now - ui.tabFreshAt.get(t.id) < 1600;
    return `<button class="nav-tab${t.id === ui.tab ? ' on' : ''}${fresh ? ' fresh' : ''}" data-act="tab" data-tab="${t.id}" aria-pressed="${t.id === ui.tab}">${esc(t.label)}</button>`;
  }).join('');
}

/* ── work tab ────────────────────────────────────────────────────────────── */

function workHTML(s) {
  const u = (x) => sel.isUnlocked(s, x);
  const out = [];
  const rows = [];

  if (s.rung === 'R0') {
    const autoRevealed = s.rungMeter >= D.BALANCE.RAKE_AUTO_REVEAL_METER || s.flags.raked;
    rows.push(`<div class="row">
      <button class="verb primary" data-act="rake">${esc(D.COPY.rakeLabel)}</button>
      <span class="row-info">+${D.BALANCE.RICE_PER_RAKE} rice · −${D.BALANCE.SATIETY_PER_ACT} body</span>
      ${autoRevealed ? autoBtn(s.autoRake, 'auto-rake') : ''}
    </div>`);
  }
  rows.push(`<div class="row">
    <button class="verb" data-act="rest">${esc(D.COPY.restLabel)}</button>
    <span class="row-info">+${D.BALANCE.SATIETY_PER_REST} body</span>
  </div>`);

  const here = sel.laboursHere(s);
  for (const a of here) {
    const y = Object.entries(a.yields).map(([res, n]) => `+${n} ${res}`).join(' · ');
    rows.push(`<div class="row">
      <button class="verb" data-act="activity" data-id="${a.id}">${esc(a.label)}</button>
      <span class="row-info">${y} · −${a.satietyCost} body</span>
      ${autoBtn(s.autoActivity === a.id, 'auto-act', `data-id="${a.id}"`)}
    </div>`);
  }
  if (!here.length && s.rung !== 'R0') {
    rows.push(`<p class="note">${esc(D.COPY.noWorkHere)}</p>`);
  }

  if (u('verb-cook')) {
    const can = s.resources.sansai >= D.BALANCE.COOK_SANSAI_COST;
    const hurt = s.character.hp <= sel.hpMax(s) * 0.55;
    rows.push(`<div class="row">
      <button class="verb${hurt ? ' urgent' : ''}" data-act="cook" ${can ? '' : `disabled title="Not enough sansai — needs ${D.BALANCE.COOK_SANSAI_COST}"`}>${esc(D.COPY.cookLabel)}</button>
      <span class="row-info">+${D.BALANCE.COOK_HP_RESTORE} life</span>
    </div>`);
    if (!can) rows.push(`<p class="row-reason">Not enough sansai — needs ${D.BALANCE.COOK_SANSAI_COST}.</p>`);
  }
  if (u('panel-estate')) {
    const can = s.resources.rice >= D.BALANCE.EAT_RICE_COST;
    rows.push(`<div class="row">
      <button class="verb" data-act="eat" ${can ? '' : `disabled title="Not enough rice — needs ${D.BALANCE.EAT_RICE_COST}"`}>${esc(D.COPY.eatRiceLabel)}</button>
      <span class="row-info">+${D.BALANCE.EAT_RICE_SATIETY} body</span>
    </div>`);
  }

  // the wolf beat — the most dramatic surface on the screen (R2, until survived)
  if (u('verb-face-wolf') && !s.flags['first-fight-survived']) {
    const wolf = D.MOBS.find((m) => m.id === 'wolf_scripted');
    if (s.location === 'kura') {
      out.push(`<section class="card wolf-card reveal">
        <div class="kicker">A foe in the dark</div>
        <p class="prose">${esc(wolf.blurb)}</p>
        <button class="verb primary dread" data-act="face-wolf">${esc(D.COPY.wolfButton)}</button>
      </section>`);
    } else {
      out.push(`<section class="card wolf-card">
        <div class="kicker">A foe in the dark</div>
        <p class="note">${esc(D.COPY.wolfAway)}</p>
      </section>`);
    }
  }

  out.push(`<section class="card">${cardHead(D.COPY.workHeader)}<div class="rows">${rows.join('')}</div></section>`);

  if (s.flags.raked || s.rungMeter > 0 || s.rung !== 'R0') out.push(ladderHTML(s));
  return out.join('');
}

function ladderHTML(s) {
  const r = sel.rung(s);
  const next = sel.nextRung(s);
  const ready = sel.summonsReady(s);
  const full = sel.meterFull(s);
  const into = Math.min(s.rungMeter, r.threshold);
  return `<section class="card">
    ${cardHead(D.COPY.ladderService, `<span class="chip">${esc(r.id)}</span>`)}
    <div class="ladder-title">${esc(r.title)}</div>
    ${meter('ladder', s.rungMeter / r.threshold, 'gold')}
    <div class="meter-num">${formatKMB(into)} / ${formatKMB(r.threshold)}</div>
    ${ready ? `<p class="ladder-hint ready">${esc(D.COPY.ladderReady)} ${esc(D.COPY.summons)}</p>` : ''}
    ${full && !ready && r.advanceHint ? `<p class="ladder-hint">${esc(r.advanceHint)}</p>` : ''}
    ${next ? `<div class="ladder-next">${esc(D.COPY.ladderNext)} ${esc(next.title)}</div>` : ''}
    ${s.rung === 'R3' ? `<div class="ladder-next">${esc(D.COPY.ladderEnd)}</div>` : ''}
  </section>`;
}

/* ── map tab ─────────────────────────────────────────────────────────────── */

function mapHTML(s) {
  const node = sel.nodeOf(s);
  const out = [];

  out.push(`<section class="card">
    <div class="kicker">${esc(D.COPY.youStandAt)}</div>
    <div class="here-name">${esc(node.label)}</div>
    <p class="prose dim" style="margin:0">${esc(node.blurb)}</p>
  </section>`);

  const reach = sel.reachable(s);
  out.push(`<section class="card">
    ${cardHead(D.COPY.onward)}
    <div class="move-strip">${reach.map((rr) => `
      <div class="move-cell">
        <button class="verb" data-act="move" data-node="${rr.node.id}" ${rr.blocked ? `disabled title="${esc(D.COPY.needsConditioning)}"` : ''}><span class="go">›</span> ${esc(rr.node.label)}</button>
        ${rr.blocked ? `<p class="row-reason">${esc(D.COPY.needsConditioning)}.</p>` : ''}
      </div>`).join('')}
    </div>
  </section>`);

  const people = sel.peopleHere(s);
  if (people.length) {
    out.push(`<section class="card">
      ${cardHead(D.COPY.whosHere)}
      ${people.map((p) => {
        const open = s.openPersonId === p.id;
        return `<div class="person">
          <span class="person-seal v-${p.voice}">${esc(p.name[0])}</span>
          <span class="person-main"><span class="person-name">${esc(p.name)}</span><br><span class="person-tell">${esc(p.tell)}</span></span>
          <button class="verb" data-act="${open ? 'leave' : 'talk'}" data-person="${p.id}">${esc(open ? D.COPY.leave(p.name) : D.COPY.speakWith(p.name))}</button>
        </div>`;
      }).join('')}
    </section>`);
  }

  if (s.openPersonId === 'pedlar') out.push(marketHTML(s));
  return out.join('');
}

function marketHTML(s) {
  const season = sel.seasonOf(s.clock.day);
  const price = sel.ricePrice(s);
  const rice = s.resources.rice;
  const items = D.MARKET_ITEMS.map((it) => {
    const bought = s.marketBought[it.id] ?? 0;
    const sold = bought >= it.stockCap;
    const afford = s.resources.coin >= it.coinCost;
    const grants = Object.entries(it.grants).map(([res, n]) => `+${n} ${res}`).join(' · ');
    return `<div class="m-item${sold ? ' sold' : ''}">
      <div class="m-line"><span class="m-name">${esc(it.label)}</span><span class="m-leader"></span><span class="m-grant">${grants}</span><span class="m-price">${esc(formatCoin(it.coinCost))}</span></div>
      <p class="prose dim" style="margin:2px 0 0">${esc(it.blurb)}</p>
      <div class="m-buyrow">${sold
        ? `<span class="chip">Sold out</span>`
        : `<button class="verb" data-act="buy" data-id="${it.id}" ${afford ? '' : `disabled title="Not enough coin — needs ${esc(formatCoin(it.coinCost))}"`}>Buy · ${esc(formatCoin(it.coinCost))}</button>`}
      ${stockDots(bought, it.stockCap)}</div>
    </div>`;
  }).join('');
  return `<section class="card reveal">
    ${cardHead(D.COPY.marketHeader, `<span class="chip">${esc(D.PEOPLE[0].name)}</span>`)}
    <p class="prose dim">${esc(D.MARKET_BLURB)}</p>
    ${items}
    <div class="sell-block">
      <div class="kicker">${esc(D.COPY.sellRiceHeader)}</div>
      <p class="prose dim">${esc(D.COPY.sellRiceLine(price, season.label, D.RICE_SELL_GLOSS[season.id]))}</p>
      <button class="verb" data-act="sell-rice" ${rice > 0 ? '' : 'disabled title="No rice carried"'}>${esc(D.COPY.sellAllRice(formatKMB(rice), formatCoin(rice * price)))}</button>
    </div>
  </section>`;
}

/* ── estate tab ──────────────────────────────────────────────────────────── */

function estateHTML(s) {
  const out = [];
  const cur = D.ESTATE_STAGE_NAMES[s.estateStage];
  const next = D.ESTATE_STAGES[s.estateStage];
  const afford = next && s.resources.coin >= next.coinCost;
  const body = next
    ? `<div class="ladder-title">${esc(next.label)}</div>
       <p class="prose dim">${esc(next.blurb)}</p>
       <span class="payoff">+${next.yieldBonusNum}% labour output · +${next.satietyMaxBonus} max body</span>
       <div class="est-buy">
         <button class="verb primary" data-act="improve" ${afford ? '' : `disabled title="Not enough coin — needs ${esc(formatCoin(next.coinCost))}"`}>${esc(next.label)}</button>
         <span class="cost">${esc(formatCoin(next.coinCost))}</span>
       </div>
       ${afford ? '' : `<p class="row-reason">Not enough coin — needs ${esc(formatCoin(next.coinCost))} (carrying ${esc(formatCoin(s.resources.coin))}).</p>`}`
    : `<p class="prose">${esc(D.ESTATE_STAGES[3].logLine)}</p>`;
  out.push(`<section class="card">
    ${cardHead(D.COPY.estateHeader, `<span class="chip hot">${esc(cur)}</span>`)}
    ${body}
  </section>`);

  out.push(`<section class="card">
    ${cardHead(D.COPY.houseReopens)}
    ${D.HOUSE_ROOMS.map((rm) => `<div class="sil-row"><span class="sil-mark">◆</span><span class="sil-name">${esc(rm.label)}</span><span class="chip">${esc(rm.lockRung)}</span></div>`).join('')}
  </section>`);

  if (sel.isUnlocked(s, 'panel-house-influence')) {
    out.push(`<section class="card locked-teaser">
      ${cardHead(D.HOUSE_INFLUENCE.header)}
      <p class="prose dim">${esc(D.HOUSE_INFLUENCE.blurb)}</p>
      ${Array.from({ length: D.HOUSE_INFLUENCE.silhouetteRows }, () => '<div class="sil-row"><span class="sil-mark">◆</span><span class="sil-bar"></span></div>').join('')}
      <div class="locked-foot">${esc(D.HOUSE_INFLUENCE.lockedFoot)}</div>
    </section>`);
  }
  return out.join('');
}

/* ── inventory tab ───────────────────────────────────────────────────────── */

function inventoryHTML(s) {
  const r = s.resources;
  const b = s.banked;
  const atKura = s.location === 'kura';
  const rows = atKura
    ? `<div class="bank-grid">
        <button class="verb" data-act="bank" data-what="coin" data-dir="deposit" ${r.coin > 0 ? '' : 'disabled title="No coin carried"'}>${esc(D.COPY.storeAllCoin)}</button>
        <button class="verb" data-act="bank" data-what="coin" data-dir="withdraw" ${b.coin > 0 ? '' : 'disabled title="No coin stored"'}>${esc(D.COPY.withdrawAllCoin)}</button>
        <button class="verb" data-act="bank" data-what="rice" data-dir="deposit" ${r.rice > 0 ? '' : 'disabled title="No rice carried"'}>${esc(D.COPY.storeAllRice)}</button>
        <button class="verb" data-act="bank" data-what="rice" data-dir="withdraw" ${b.rice > 0 ? '' : 'disabled title="No rice stored"'}>${esc(D.COPY.withdrawAllRice)}</button>
      </div>`
    : `<p class="note">${esc(D.STOREHOUSE.offNodeBlurb)}</p>`;
  return `<section class="card">
    ${cardHead(D.STOREHOUSE.header)}
    <p class="prose dim">${esc(D.STOREHOUSE.blurb)}</p>
    <span class="carried-line">${esc(D.COPY.carriedLine(formatCoin(r.coin), formatKMB(r.rice), formatCoin(b.coin), formatKMB(b.rice)))}</span>
    ${rows}
  </section>`;
}

/* ── character tab ───────────────────────────────────────────────────────── */

function characterHTML(s) {
  const out = [];

  const skills = D.SKILLS.filter((sk) => {
    const st = s.skills[sk.id];
    return st && (st.xp > 0 || st.level > 1 || sk.id === 'conditioning');
  });
  out.push(`<section class="card">
    ${cardHead('Skills')}
    ${skills.map((sk) => {
      const st = s.skills[sk.id];
      const need = 40 + st.level * 30;
      return `<div class="skill">
        <div class="sk-line"><span class="sk-name">${esc(sk.label)}</span><span class="chip">Lv ${st.level}</span><span class="sk-hint">+${D.SKILL_YIELD_PER_LEVEL}% yield / level</span></div>
        <p class="prose dim" style="margin:2px 0 0">${esc(sk.blurb)}</p>
        ${meter('sk-' + sk.id, st.xp / need, 'thin')}
      </div>`;
    }).join('')}
  </section>`);

  if (sel.isUnlocked(s, 'readout-combat-level')) {
    const pts = s.character.attributePoints;
    out.push(`<section class="card">
      ${cardHead(D.COPY.trainingHeader, `<span class="chip${pts > 0 ? ' hot' : ''}">${esc(D.COPY.trainingPoints(pts))}</span>`)}
      ${D.ATTRS.map((a) => `<div class="attr-row">
        <span class="attr-tag">${esc(a.label)}</span>
        <span class="attr-name">${esc(a.name)} <span class="attr-gloss">— ${esc(a.gloss)}</span></span>
        <b class="attr-val" data-vk="attr-${a.id}" data-vv="${s.character.attrs[a.id]}">${s.character.attrs[a.id]}</b>
        <button class="verb plus1" data-act="attr" data-attr="${a.id}" ${pts > 0 ? '' : 'disabled title="No points to spend — level up in combat"'}>+1</button>
      </div>`).join('')}
    </section>`);
  }

  if (sel.isUnlocked(s, 'panel-bestiary')) {
    const entries = sel.bestiary(s);
    const faced = entries.filter((e) => e.faced).length;
    out.push(`<section class="card">
      ${cardHead(D.COPY.bestiaryHeader)}
      <p class="note">${esc(D.COPY.bestiaryCount(faced, entries.length))}</p>
      ${entries.map((e) => e.faced
        ? `<div class="beast">
            <div class="b-line"><span class="b-name">${esc(e.mob.label)}</span>${winHTML(sel.winRate(s, e.mob))}</div>
            <p class="prose dim" style="margin:2px 0">${esc(e.mob.blurb)}</p>
            <span class="b-meta"><b>Tell</b> — ${esc(e.mob.tell)}</span>
            <span class="b-meta"><b>Haunts</b> — ${esc(e.mob.haunts)}</span>
          </div>`
        : `<div class="beast">
            <div class="b-line"><span class="b-name fog">${esc(D.COPY.bestiaryUnknown)}</span></div>
            <span class="b-meta">${esc(D.COPY.bestiaryNotFaced)}</span>
          </div>`).join('')}
    </section>`);
  }

  if (sel.isUnlocked(s, 'tab-combat')) {
    out.push(`<section class="card">
      ${cardHead(D.QUESTS_HEADER)}
      <p class="note">${esc(D.QUESTS_BLURB)}</p>
      ${D.QUESTS.map((q) => questHTML(s, q)).join('')}
    </section>`);
  }
  return out.join('');
}

function questHTML(s, q) {
  const st = sel.questState(s, q);
  const prog = s.quests.progress[q.id] ?? [];
  const foot = st === 'open'
    ? `<button class="verb" data-act="quest" data-id="${q.id}">${esc(D.COPY.takeThisOn)}</button>`
    : st === 'accepted'
      ? '<span class="chip hot">Undertaken</span>'
      : '<span class="chip done">❖ Complete</span>';
  return `<div class="quest ${st}">
    <div class="q-line"><span class="chip kind">${esc(q.kind)}</span><span class="q-title">${esc(q.title)}</span></div>
    <p class="prose dim" style="margin:4px 0 0">${esc(q.blurb)}</p>
    <ul class="q-steps">${q.steps.map((step) => {
      const done = prog.includes(step.id);
      return `<li class="${done ? 'done' : ''}"><span class="tick">${done ? '◆' : '◇'}</span><span>${esc(step.label)}</span></li>`;
    }).join('')}</ul>
    <div class="q-foot"><span class="q-reward">${esc(D.COPY.reward(formatCoin(q.rewardCoin)))}</span>${foot}</div>
  </div>`;
}

/* ── combat tab ──────────────────────────────────────────────────────────── */

function combatHTML(s) {
  const out = [];
  const need = sel.combatXpNeeded(s);
  out.push(`<section class="card">
    ${cardHead(D.COPY.combatLevel(s.character.level))}
    ${meter('cxp', s.character.combatXp / need, 'gold')}
    <div class="meter-num">${s.character.combatXp} / ${need} xp</div>
  </section>`);

  const w = D.WEAPONS.find((x) => x.id === s.equippedWeapon);
  out.push(`<section class="card">
    ${cardHead(w.label, `<span class="chip">${esc(w.archetype)}</span>`)}
    <p class="prose dim" style="margin:0">${esc(w.blurb)}</p>
  </section>`);

  const foes = sel.foesHere(s);
  out.push(`<section class="card">
    ${cardHead(D.COPY.watchHeader)}
    ${foes.length ? foes.map((m) => {
      const faced = s.bestiaryFaced.includes(m.id);
      const autoEnd = s.autoCombat === m.id && !s.autoCombatRetreat;
      const autoFlee = s.autoCombat === m.id && s.autoCombatRetreat;
      return `<div class="foe">
        <div class="b-line"><span class="b-name${faced ? '' : ' fog'}">${esc(faced ? m.label : D.COPY.bestiaryUnknown)}</span>${winHTML(sel.winRate(s, m))}</div>
        <p class="prose dim" style="margin:2px 0 0">${esc(m.blurb)}</p>
        <div class="foe-verbs">
          <button class="verb fight" data-act="fight" data-mob="${m.id}">${esc(D.COPY.fight)}</button>
          <button class="auto${autoEnd ? ' on' : ''}" data-act="auto-combat" data-mob="${m.id}" data-retreat="0" aria-pressed="${autoEnd}" title="Fight on repeat — a loss costs a fifth of carried coin">${esc(autoEnd ? D.COPY.autoOff : D.COPY.autoToEnd)}</button>
          <button class="auto${autoFlee ? ' on' : ''}" data-act="auto-combat" data-mob="${m.id}" data-retreat="1" aria-pressed="${autoFlee}" title="Fight on repeat, break off below 20% life">${esc(autoFlee ? D.COPY.autoOff : D.COPY.autoFlee)}</button>
        </div>
      </div>`;
    }).join('') : `<p class="note">${esc(D.COPY.watchEmpty)}</p>`}
  </section>`);
  return out.join('');
}

/* ── the log (hero surface) ──────────────────────────────────────────────── */

function logHeadHTML() {
  return `<h2>${esc(D.LOG_HEADER)}</h2>`;
}
const LOG_SCALES = [0.85, 1, 1.15, 1.3];
function logFootHTML() {
  const tabs = D.LOG_FILTERS.map((f) =>
    `<button class="lf${f === ui.logFilter ? ' on' : ''}" data-act="filter" data-filter="${f}" aria-pressed="${f === ui.logFilter}">${esc(D.LOG_FILTER_LABELS[f])}</button>`,
  ).join('');
  const stepper = `<span class="log-stepper">
    <button class="lstep" data-act="log-font" data-d="-1" ${ui.logScaleIdx <= 0 ? 'disabled' : ''} aria-label="Smaller log text" title="Smaller log text">A−</button>
    <button class="lstep" data-act="log-font" data-d="1" ${ui.logScaleIdx >= LOG_SCALES.length - 1 ? 'disabled' : ''} aria-label="Larger log text" title="Larger log text">A+</button>
  </span>`;
  return tabs + stepper;
}

// gains in indigo, losses in beni — applied to the ESCAPED text (presentation only)
function accentDeltas(escaped) {
  return escaped
    .replace(/\((\+[^()]*)\)/g, '(<span class="gain">$1</span>)')
    .replace(/\((−[^()]*)\)/g, '(<span class="loss">$1</span>)');
}

function lineHTML(l, fresh) {
  const bullet = D.CHANNEL_BULLET[l.channel];
  const spk = l.voice && l.speaker ? `<span class="spk">${esc(l.speaker)}:</span> ` : '';
  const cnt = l.count > 1 ? ` <span class="xn" title="repeated ×${l.count}">×${l.count}</span>` : '';
  let text = l.text;
  if (bullet && text.startsWith(bullet)) text = text.slice(bullet.length).trimStart();
  const lb = bullet ? `<span class="lb">${em(bullet)}</span>` : '<span class="lb lb-dot">·</span>';
  const voiceCls = l.voice ? ` v-${l.voice}` : '';
  return `<li class="ll ll-${l.channel}${voiceCls}${fresh && !RM ? ' ink-in' : ''}">${lb}<div class="lt">${spk}${accentDeltas(esc(text))}${cnt}</div></li>`;
}

function renderLogFeed(s) {
  const lines = sel.logView(s, ui.logFilter);
  const keys = lines.map((l) => l.id + ':' + l.count);
  const filterChanged = ui.lastFilter !== ui.logFilter;
  const same = !filterChanged && keys.length === ui.logKeys.length && keys.every((k, i) => k === ui.logKeys[i]);
  if (same) return;

  const feed = $('logfeed');
  const scroller = $('logscroll');
  const nearBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 48;
  let appended = false;

  if (!filterChanged && ui.logKeys.length && keys.length >= ui.logKeys.length && feed.children.length === ui.logKeys.length) {
    const n = ui.logKeys.length;
    const prefixOk = ui.logKeys.slice(0, n - 1).every((k, i) => k === keys[i]);
    if (prefixOk) {
      if (ui.logKeys[n - 1] !== keys[n - 1]) {
        feed.children[n - 1].outerHTML = lineHTML(lines[n - 1], false);
        const badge = feed.children[n - 1].querySelector('.xn');
        if (badge) badge.classList.add('pop');
      }
      for (let i = n; i < keys.length; i++) feed.insertAdjacentHTML('beforeend', lineHTML(lines[i], true));
      appended = true;
    }
  }
  if (!appended) {
    feed.innerHTML = lines.length
      ? lines.map((l) => lineHTML(l, false)).join('')
      : `<li class="log-empty">Nothing here yet — the house is listening.</li>`;
  }

  ui.logKeys = keys;
  ui.lastFilter = ui.logFilter;
  if (!appended || nearBottom) scroller.scrollTop = scroller.scrollHeight;
}

// The mobile folded-log peek strip (desktop: display:none in base CSS).
// Collapsed → the newest line across ALL channels, alive on arrival;
// expanded → the log header as the fold-away handle.
function renderLogPeek(s) {
  const peek = $('logpeek');
  const lines = sel.logView(s, 'all');
  const last = lines[lines.length - 1];
  const key = last ? last.id + ':' + last.count : 'none';
  let html;
  if (ui.logOpen) {
    html = `<span class="lp-title">${esc(D.LOG_HEADER)}</span><span class="lp-chev">▾</span>`;
  } else if (!last) {
    html = `<span class="lb lb-dot">·</span><span class="lp-text">Nothing here yet — the house is listening.</span><span class="lp-chev">▴</span>`;
  } else {
    const bullet = D.CHANNEL_BULLET[last.channel];
    let text = last.text;
    if (bullet && text.startsWith(bullet)) text = text.slice(bullet.length).trimStart();
    const spk = last.voice && last.speaker ? `<span class="spk v-${last.voice}">${esc(last.speaker)}:</span> ` : '';
    const cnt = last.count > 1 ? ` <span class="xn">×${last.count}</span>` : '';
    const lb = bullet ? `<span class="lb">${em(bullet)}</span>` : '<span class="lb lb-dot">·</span>';
    html = `${lb}<span class="lp-text">${spk}${accentDeltas(esc(text))}${cnt}</span><span class="lp-chev">▴</span>`;
  }
  const changed = setHTML(peek, html);
  peek.setAttribute('aria-expanded', String(ui.logOpen));
  peek.setAttribute('aria-label', ui.logOpen ? 'Fold the log away' : `${D.LOG_HEADER} — open the log`);
  if (changed && !ui.logOpen && !RM && ui.lastPeekKey && ui.lastPeekKey !== key) {
    peek.querySelector('.lp-text')?.classList.add('lp-fresh');
  }
  ui.lastPeekKey = key;
}

/* ── overlays: cold open · VN scene · seal ceremony ──────────────────────── */

function coldHTML() {
  return `<div class="coldopen" data-co="1">
    <div class="co-card">
      <h1 class="co-title co-item" data-co-step="0">${esc(D.COLD_OPEN.title)}</h1>
      <div class="co-sub co-item" data-co-step="1">${esc(D.COLD_OPEN.subtitle)}</div>
      <p class="co-lede co-item" data-co-step="2" data-lede="${esc(D.COLD_OPEN.lede)}"></p>
      <button class="co-verb co-item" data-co-step="3" data-act="open-eyes">${esc(D.COLD_OPEN.verb)}</button>
    </div>
  </div>`;
}

// staged cold-open reveal: title → subtitle → typewritten lede → the lone verb
function playColdOpen(ov) {
  if (ui.coldPlayed) return;
  ui.coldPlayed = true;
  ui.coldTimers.forEach(clearTimeout);
  ui.coldTimers = [];
  const items = ov.querySelectorAll('.co-item');
  const lede = ov.querySelector('.co-lede');
  const ledeText = lede?.dataset.lede ?? '';
  if (RM) {
    items.forEach((el) => el.classList.add('in'));
    if (lede) lede.textContent = ledeText;
    return;
  }
  const at = (ms, fn) => ui.coldTimers.push(setTimeout(fn, ms));
  at(200, () => items[0]?.classList.add('in'));
  at(1000, () => items[1]?.classList.add('in'));
  at(1700, () => {
    items[2]?.classList.add('in');
    let i = 0;
    const step = () => {
      if (!lede.isConnected) return;
      lede.textContent = ledeText.slice(0, ++i);
      if (i < ledeText.length) ui.coldTimers.push(setTimeout(step, 24));
      else items[3]?.classList.add('in');
    };
    step();
  });
  at(6200, () => items[3]?.classList.add('in')); // safety net — the verb always arrives
}

function vnLine(ln, opts = {}) {
  const cls = ln.voice === 'narrator' ? ' narr' : '';
  const spk = ln.speaker ? `<span class="spk v-${ln.voice}">${esc(ln.speaker)}:</span>` : '';
  if (opts.type) {
    return `<p class="vnl${cls}" data-tw="${esc(ln.text)}" data-tw-key="${esc(opts.key)}">${spk}<span class="tw-out"></span><span class="vn-cursor"></span></p>`;
  }
  return `<p class="vnl${cls}">${spk}${esc(ln.text)}</p>`;
}

function vnHTML(s) {
  const vn = s.vn;
  const scene = vn.kind === 'intro' ? D.INTRO_SCENES[vn.sceneIndex] : D.RUNG_BEATS[vn.target];
  const plateName = scene.speaker ?? scene.plateLabel ?? '';
  const sceneKey = vn.kind === 'intro' ? `i${vn.sceneIndex}` : `r${vn.target}`;

  // the transcript: greeting so far + asked Q&A + (resolved) the say/react pair
  const parts = [];
  scene.greeting.slice(0, vn.shown).forEach((ln, i) => {
    const isNewest = vn.phase === 'greeting' && i === vn.shown - 1;
    parts.push(vnLine(ln, isNewest && !RM ? { type: true, key: `${sceneKey}:g${i}` } : {}));
  });
  if (vn.phase !== 'greeting') {
    for (const tid of vn.asked) {
      const topic = scene.topics.find((t) => t.id === tid);
      if (!topic) continue;
      parts.push(vnLine({ voice: 'player', speaker: 'You', text: topic.label }));
      topic.answer.forEach((ln, i) => {
        const isNewest = vn.phase === 'ask' && tid === vn.lastAsk && i === topic.answer.length - 1;
        parts.push(vnLine(ln, isNewest && !RM ? { type: true, key: `${sceneKey}:a${tid}` } : {}));
      });
    }
  }
  if (vn.phase === 'decide') {
    parts.push(`<p class="vnl vn-prompt">${esc(scene.decision.prompt)}</p>`);
  }
  if (vn.phase === 'resolved') {
    const opt = scene.decision.options.find((o) => o.id === vn.picked);
    parts.push(vnLine({ voice: 'player', speaker: 'You', text: opt.say }));
    parts.push(vnLine({ voice: scene.voice, speaker: scene.speaker ?? undefined, text: opt.react },
      RM ? {} : { type: true, key: `${sceneKey}:react` }));
  }

  // the stable right panel: ask → decide → outcome
  let panel = '';
  if (vn.phase === 'greeting') {
    panel = `<p class="vn-hint">The scene is speaking — click anywhere to continue.</p>
      <button class="vn-done" data-act="vn-next">Continue ›</button>`;
  } else if (vn.phase === 'ask') {
    panel = `<div class="vn-ask-head"><span>Ask</span></div>
      ${scene.topics.map((t) => {
        const asked = vn.asked.includes(t.id);
        const gated = t.gateTopic && !vn.asked.includes(t.gateTopic);
        return `<button class="topic${asked ? ' asked' : ''}" data-act="vn-ask" data-topic="${t.id}" ${gated ? 'disabled title="Ask after the other questions"' : ''}>${esc(t.label)}</button>`;
      }).join('')}
      <hr class="brush-rule">
      <button class="vn-done" data-act="vn-done">${esc(D.COPY.doneQuestioning)}</button>`;
  } else if (vn.phase === 'decide') {
    panel = `<div class="vn-prompt fade-in">${esc(scene.decision.prompt)}</div>
      ${scene.decision.options.map((o) => `<button class="choice fade-in" data-act="vn-choose" data-opt="${o.id}">${esc(o.label)}</button>`).join('')}`;
  } else {
    const opt = scene.decision.options.find((o) => o.id === vn.picked);
    const perk = opt.perk
      ? `<div class="perk-box fade-in">
          <div class="perk-tag">${esc(D.COPY.perkTag)}</div>
          <div class="perk-name">${esc(opt.perk.name)}</div>
          <p class="perk-desc">${esc(opt.perk.desc)}</p>
          ${opt.stat ? `<div class="perk-stat"><span class="up">+1 ${opt.stat.up.toUpperCase()}</span> · <span class="down">−1 ${opt.stat.down.toUpperCase()}</span></div>` : ''}
        </div>`
      : '';
    const bonus = opt.statBonus ? `<p class="vn-bonus fade-in">${esc(opt.statBonus.note)}</p>` : '';
    panel = `${perk}${bonus}
      <button class="verb vn-continue fade-in" data-act="vn-continue">${esc(D.COPY.continueBtn)}</button>`;
  }

  // onclick="" — iOS WebKit only synthesizes click events from taps on
  // "clickable" targets; the empty handler marks the scene tappable so the
  // delegated click-anywhere-to-advance works under a thumb (no-op elsewhere).
  return `<div class="vn-scene${vn.phase === 'greeting' ? ' typing' : ''}" data-vn-phase="${vn.phase}" onclick="">
    <div class="vn-card paper">
      <div class="vn-plate v-${scene.voice}">
        <span class="vn-seal">${esc(scene.sealText)}</span>
        <span class="vn-name">${esc(plateName)}</span>
      </div>
      <div class="vn-body">
        <div class="vn-story" id="vnstory"><div class="vn-lines">${parts.join('')}</div></div>
        <div class="vn-panel" data-panel="${vn.phase}">${panel}</div>
      </div>
    </div>
  </div>`;
}

function ceremonyHTML(s) {
  const c = s.ceremony;
  const initial = c.title.trim()[0].toUpperCase();
  return `<div class="ceremony" data-act="dismiss-ceremony" onclick="">
    <div class="cer-card paper">
      <span class="stud tl"></span><span class="stud tr"></span><span class="stud bl"></span><span class="stud br"></span>
      <div class="cer-kicker">${esc(D.COPY.promoted)}</div>
      <div class="cer-seal">${esc(initial)}</div>
      <div class="cer-title">${esc(c.title)}</div>
      <div class="cer-rank">${esc(c.rank)} · ${esc(D.HOUSE_MARK)}</div>
      <button class="verb cer-continue" data-act="dismiss-ceremony" id="cercontinue">${esc(D.COPY.continueBtn)}</button>
    </div>
  </div>`;
}

/* ── the typewriter (one live line at a time; tracked, RM-safe) ──────────── */

function runTypewriter(root) {
  const el = root.querySelector('[data-tw]');
  if (!el) {
    tw.key = null;
    clearTimeout(tw.timer);
    return;
  }
  const key = el.dataset.twKey;
  if (key === tw.key) return; // same line still typing / already done
  clearTimeout(tw.timer);
  tw.key = key;
  tw.full = el.dataset.tw;
  tw.el = el;
  const out = el.querySelector('.tw-out');
  let i = 0;
  const step = () => {
    if (!el.isConnected) return;
    i += 1;
    out.textContent = tw.full.slice(0, i);
    const story = $('vnstory');
    if (story) story.scrollTop = story.scrollHeight;
    if (i < tw.full.length) tw.timer = setTimeout(step, 16);
    else finishTypewriter();
  };
  step();
}

function finishTypewriter() {
  clearTimeout(tw.timer);
  if (tw.el && tw.el.isConnected) {
    const out = tw.el.querySelector('.tw-out');
    if (out) out.textContent = tw.full;
    tw.el.querySelector('.vn-cursor')?.remove();
  }
  tw.el = null;
}
const typing = () => !!(tw.el && tw.el.isConnected && tw.el.querySelector('.vn-cursor'));

/* ── stage selector (the review affordance — VARIANT-SPEC §2) ────────────── */

function stripHTML(s) {
  const cur = D.STAGES.find((st) => st.id === s.stageId);
  return `<div class="ss-body">
    <div class="ss-label">Stages</div>
    <div class="ss-row">${D.STAGES.map((st) => `<button class="ss-btn${st.id === s.stageId ? ' on' : ''}" data-act="ss-stage" data-stage="${st.id}" title="${esc(st.blurb)}">${esc(st.label)}</button>`).join('')}</div>
    <div class="ss-label">Moments</div>
    <div class="ss-row">
      <button class="ss-btn" data-act="ss-intro" title="Cold open, then the three intro scenes">Play intro</button>
      <button class="ss-btn" data-act="ss-wolf" title="R2 at the kura — the scripted first fight">Face wolf</button>
      <button class="ss-btn" data-act="ss-fight" title="R3 — a real fight at the forecourt">Fight</button>
      <button class="ss-btn" data-act="ss-rungup" title="Force the meter, play the rung beat + seal">Rung-up</button>
    </div>
  </div>
  <button class="ss-head" data-act="ss-toggle">❖ ${esc(cur ? cur.label : s.stageId)}</button>`;
}

/* ── render root ─────────────────────────────────────────────────────────── */

const paneFns = {
  work: workHTML, map: mapHTML, estate: estateHTML,
  inventory: inventoryHTML, character: characterHTML, combat: combatHTML,
};

function renderPane(s) {
  const pane = $('pane');
  const switched = ui.paneTab !== ui.tab;
  const html = paneFns[ui.tab](s);
  const top = pane.scrollTop;
  if (setHTML(pane, html)) pane.scrollTop = switched ? 0 : top;
  ui.paneTab = ui.tab;
}

function renderOverlay(s) {
  const ov = $('overlay');
  let html = '';
  if (s.phase === 'cold-open') html = coldHTML();
  else if (s.phase === 'vn' && s.vn) html = vnHTML(s);
  else if (s.ceremony) html = ceremonyHTML(s);

  if (s.phase !== 'cold-open') {
    ui.coldPlayed = false;
    ui.coldTimers.forEach(clearTimeout);
    ui.coldTimers = [];
  }
  if (!s.ceremony) {
    ui.ceremonyAt = 0;
    clearTimeout(ui.ceremonyTimer);
    ui.ceremonyTimer = 0;
  }

  if (setHTML(ov, html)) {
    if (s.phase === 'cold-open') playColdOpen(ov);
    if (s.phase === 'vn' && s.vn) {
      runTypewriter(ov);
      const story = $('vnstory');
      if (story) story.scrollTop = story.scrollHeight;
    }
    if (s.ceremony && !ui.ceremonyAt) {
      ui.ceremonyAt = Date.now();
      const held = RM ? 0 : 1500;
      ui.ceremonyTimer = setTimeout(() => $('cercontinue')?.classList.add('in'), held);
    }
  }
}

function renderAll() {
  const s = eng.state;

  if (s.stageId !== ui.lastStage) { // a stage jump — reset UI state, no glints
    ui.lastStage = s.stageId;
    ui.tab = 'work';
    ui.logFilter = 'story';
    ui.logOpen = false;
    ui.lastPeekKey = '';
    ui.logKeys = [];
    ui.tabFreshAt = new Map(sel.visibleTabs(s).map((t) => [t.id, 0]));
    prevVals.clear();
    meterPrev.clear();
    tw.key = null;
    clearTimeout(tw.timer);
  }
  if (!sel.visibleTabs(s).some((t) => t.id === ui.tab)) ui.tab = 'work';

  const cold = s.phase === 'cold-open';
  const shellHidden = cold || (s.phase === 'vn' && s.vn?.kind === 'intro');
  $('titlebar').hidden = cold;
  $('vitals').hidden = shellHidden;
  $('workspace').hidden = shellHidden;
  if (!shellHidden) {
    setHTML($('vitals'), vitalsHTML(s));
    const navOn = sel.navVisible(s);
    $('nav').hidden = !navOn;
    if (navOn) setHTML($('nav'), navHTML(s));
    $('workspace').classList.toggle('sparse', !navOn);
    $('workspace').classList.toggle('log-open', ui.logOpen);
    renderPane(s);
    setHTML($('loghead'), logHeadHTML());
    setHTML($('logfoot'), logFootHTML());
    $('logscroll').style.fontSize = LOG_SCALES[ui.logScaleIdx] + 'em';
    renderLogFeed(s);
    renderLogPeek(s);
  }
  renderOverlay(s);
  const strip = $('stagestrip');
  strip.classList.toggle('open', ui.stripOpen);
  setHTML(strip, stripHTML(s));

  popVals();
  animateMeters();
}

/* ── intents ─────────────────────────────────────────────────────────────── */

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (el && !el.disabled) {
    const d = el.dataset;
    switch (d.act) {
      // cold open / VN
      case 'open-eyes': eng.dispatch({ type: 'open_eyes' }); return;
      case 'vn-next':
        if (typing()) { finishTypewriter(); return; }
        eng.dispatch({ type: 'vn_next' });
        return;
      case 'vn-ask': eng.dispatch({ type: 'vn_ask', topicId: d.topic }); return;
      case 'vn-done': eng.dispatch({ type: 'vn_done_asking' }); return;
      case 'vn-choose': eng.dispatch({ type: 'vn_choose', optionId: d.opt }); return;
      case 'vn-continue': eng.dispatch({ type: 'vn_continue' }); return;
      // chrome
      case 'tab': ui.tab = d.tab; ui.logOpen = false; renderAll(); return;
      case 'filter': ui.logFilter = d.filter; renderAll(); return;
      case 'log-peek': { // mobile: unfold / fold the log over the work pane
        ui.logOpen = !ui.logOpen;
        renderAll();
        if (ui.logOpen) { const sc = $('logscroll'); sc.scrollTop = sc.scrollHeight; }
        return;
      }
      case 'log-font':
        ui.logScaleIdx = Math.max(0, Math.min(LOG_SCALES.length - 1, ui.logScaleIdx + Number(d.d)));
        renderAll();
        return;
      case 'summons': eng.dispatch({ type: 'begin_rung_beat' }); return;
      // work
      case 'rake': eng.dispatch({ type: 'rake_rice' }); return;
      case 'rest': eng.dispatch({ type: 'rest' }); return;
      case 'auto-rake': eng.dispatch({ type: 'set_auto_rake', on: !eng.state.autoRake }); return;
      case 'activity': eng.dispatch({ type: 'do_activity', id: d.id }); return;
      case 'auto-act': eng.dispatch({ type: 'set_auto', id: eng.state.autoActivity === d.id ? null : d.id }); return;
      case 'cook': eng.dispatch({ type: 'cook_meal' }); return;
      case 'eat': eng.dispatch({ type: 'eat_rice' }); return;
      // map & market
      case 'move': eng.dispatch({ type: 'move_to', node: d.node }); return;
      case 'talk': eng.dispatch({ type: 'talk', personId: d.person }); return;
      case 'leave': eng.dispatch({ type: 'leave' }); return;
      case 'buy': eng.dispatch({ type: 'buy_item', id: d.id }); return;
      case 'sell-rice': eng.dispatch({ type: 'sell_rice' }); return;
      // estate & inventory
      case 'bank': eng.dispatch({ type: d.dir, what: d.what }); return;
      case 'improve': eng.dispatch({ type: 'improve_estate' }); return;
      // character & combat
      case 'attr': eng.dispatch({ type: 'spend_attribute', attr: d.attr }); return;
      case 'face-wolf': eng.dispatch({ type: 'face_wolf' }); return;
      case 'fight': eng.dispatch({ type: 'fight', mobId: d.mob }); return;
      case 'auto-combat': {
        const retreat = d.retreat === '1';
        const active = eng.state.autoCombat === d.mob && eng.state.autoCombatRetreat === retreat;
        eng.dispatch({ type: 'set_auto_combat', mobId: active ? null : d.mob, retreat });
        return;
      }
      case 'quest': eng.dispatch({ type: 'accept_quest', id: d.id }); return;
      // ceremony — held ~1.5s before it will dismiss
      case 'dismiss-ceremony':
        if (RM || Date.now() - ui.ceremonyAt > 1500) eng.dispatch({ type: 'dismiss_ceremony' });
        return;
      // stage strip
      case 'ss-toggle': ui.stripOpen = !ui.stripOpen; renderAll(); return;
      case 'ss-stage': ui.stripOpen = false; eng.setStage(d.stage); return;
      case 'ss-intro':
        ui.stripOpen = false;
        eng.setStage('cold-open');
        return;
      case 'ss-wolf':
        ui.stripOpen = false;
        eng.setStage('R2');
        ui.logFilter = 'all';
        eng.dispatch({ type: 'face_wolf' });
        return;
      case 'ss-fight':
        ui.stripOpen = false;
        eng.setStage('R3');
        eng.dispatch({ type: 'move_to', node: 'gate-forecourt' });
        ui.tab = 'combat';
        ui.logFilter = 'all';
        eng.dispatch({ type: 'fight', mobId: 'rice_rats' });
        return;
      case 'ss-rungup': {
        // The documented demo hack (VARIANT-SPEC §2) — this one place only:
        // force the meter AND the current rung's storyGateFlag so the summons
        // is ready on demand (earned-only is correct in play, wrong for a jump).
        ui.stripOpen = false;
        if (eng.state.rung === 'R3') eng.setStage('R2'); // R4+ is out of scope
        const cur = sel.rung(eng.state);
        if (cur.storyGateFlag) eng.state.flags[cur.storyGateFlag] = true;
        eng.state.rungMeter = cur.threshold;
        eng.dispatch({ type: 'begin_rung_beat' });
        return;
      }
      default: return;
    }
  }

  // classic VN pacing: a click anywhere on the scene advances one line —
  // completes the line if it is still typing, else reveals the next.
  const scene = e.target.closest('.vn-scene');
  if (scene && scene.dataset.vnPhase === 'greeting') {
    if (typing()) finishTypewriter();
    else eng.dispatch({ type: 'vn_next' });
  }
});

eng.subscribe(() => renderAll());

