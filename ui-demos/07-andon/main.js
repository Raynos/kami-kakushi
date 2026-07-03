// ui-demos/07-andon — ANDON: warmth is a PLACE. A fusion fork of 04-lacquer.
// Two-light dusk: a warm oil-lamp pools over a lacquer action-desk (left rail +
// centre); cold moonlight falls through a shoji-latticed paper WINDOW that IS
// the event log (right). Temperature is MODE — warm = "you act", cool = "the
// world remembers"; type is the channel — serif = lamp/story, condensed-sans =
// moon/system. The signature is the crest-to-seal cursor: a cool silver-gold
// diamond marks selection at rest, a warm vermillion wax-seal blooms on commit.
// Same machinery as 04 (subscribe→HTML render, reconcile, mobile fixes); the
// re-imagination is composition + light + type. All data from ../shared/*.js.

import { createEngine, sel } from '../shared/engine.js';
import * as D from '../shared/data.js';
import { formatKMB, formatCoin } from '../shared/format.js';

const eng = createEngine('R1');

const ui = {
  tab: 'work',
  paneTab: null,
  logFilter: 'story',
  lastFilter: 'story',
  logKeys: [],
  seenTabs: new Set(),
  lastStage: null,
  stripOpen: false,
  ceremonyAt: 0,
  logExpanded: false, // mobile-only: the log band pulled tall (hidden on desktop)
};

const prevVals = new Map(); // data-vk → last value (number pops)
const meterPrev = new Map(); // data-m → last width % (gold-thread fills)
const htmlCache = new Map(); // element → last innerHTML string

const $ = (id) => document.getElementById(id);

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

// ── tiny component builders ──────────────────────────────────────────────────

// A gold-thread meter that animates between renders: we render at the LAST
// width, then requestAnimationFrame to the target so the CSS transition runs
// even across an innerHTML replace.
function meter(id, frac, cls = '') {
  const pct = Math.max(0, Math.min(100, (frac || 0) * 100));
  const from = meterPrev.has(id) ? meterPrev.get(id) : pct;
  return `<span class="meter ${cls}"><i data-m="${id}" data-w="${pct.toFixed(2)}" style="width:${from.toFixed(2)}%"></i></span>`;
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

function trayHead(title, extra = '') {
  return `<div class="tray-head"><h3>${esc(title)}</h3>${extra}</div>`;
}

function pill(key, label, value) {
  return `<span class="pill"><span class="pl">${esc(label)}</span><b data-vk="${key}" data-vv="${esc(value)}">${esc(value)}</b></span>`;
}

function barHTML(id, label, val, max, low) {
  return `<span class="vbar${low ? ' low' : ''}"><span class="pl">${esc(label)}</span>${meter('bar-' + id, val / max, 'bar')}<b class="bv" data-vk="${id}" data-vv="${Math.round(val)}">${Math.round(val)}<span class="bmax">/${Math.round(max)}</span></b></span>`;
}

function autoBtn(on, act, extra = '') {
  return `<button class="qbtn auto${on ? ' on' : ''}" data-act="${act}" ${extra}>${esc(on ? D.COPY.autoOff : D.COPY.autoOn)}</button>`;
}

function pipHTML(pct) {
  const band = sel.winBand(pct);
  return `<span class="win"><span class="pip ${band.pip}"></span><b class="pct">${pct}%</b><span class="micro dim">${esc(band.label)}</span></span>`;
}

function stockDots(bought, cap) {
  let dots = '';
  for (let i = 0; i < cap; i++) dots += `<span class="dot${i < cap - bought ? ' full' : ''}"></span>`;
  return `<span class="stock" title="${cap - bought} in stock">${dots}</span>`;
}

// ── header vitals ────────────────────────────────────────────────────────────

function headerHTML(s) {
  const u = (x) => sel.isUnlocked(s, x);
  const r = s.resources;
  const left = `<div class="house"><span class="crest"><i>K</i></span><span class="house-name">${esc(D.HOUSE_MARK)}</span></div>`;

  const pills = [pill('rice', D.COPY.vitals.rice, formatKMB(r.rice))];
  if (r.coin + s.banked.coin > 0) pills.push(pill('coin', D.COPY.vitals.coin, formatCoin(r.coin)));
  if (u('row-wood')) pills.push(pill('wood', D.COPY.vitals.wood, formatKMB(r.wood)));
  if (u('row-sansai')) pills.push(pill('sansai', D.COPY.vitals.sansai, formatKMB(r.sansai)));

  let clock = '';
  if (u('readout-clock')) {
    const season = sel.seasonOf(s.clock.day);
    clock = `<span class="clock"><span class="cl-season">${season.emoji} ${esc(season.label)}</span><span class="cl-date">Year ${sel.yearOf(s.clock.day)} · day ${sel.dayOfSeason(s.clock.day)}</span></span>`;
  }

  const bars = [];
  if (u('verb-face-wolf')) {
    const max = sel.hpMax(s);
    bars.push(barHTML('hp', D.COPY.vitals.life, s.character.hp, max, s.character.hp <= max * 0.3));
  }
  if (u('readout-stamina')) {
    bars.push(barHTML('body', D.COPY.vitals.body, s.character.satiety, sel.satietyMax(s), false));
  }

  const rung = sel.rung(s);
  const rungHead = sel.summonsReady(s)
    ? `<button class="seal summons" data-act="summons">${esc(D.COPY.summons)}</button>`
    : `<div class="rung-head"><span class="rh-title">${esc(rung.title)}</span>${meter('rung', s.rungMeter / rung.threshold, 'mini')}</div>`;

  return `${left}<div class="vitals">${pills.join('')}${clock}${bars.join('')}</div><div class="rung-slot">${rungHead}</div>`;
}

// ── nav ──────────────────────────────────────────────────────────────────────

function navHTML(s) {
  // The left rail — tabs as lamplit lacquer document-boxes. Each carries the
  // cool silver-gold diamond crest cursor (moonlight on metal): dim at rest,
  // lit on hover / the active box.
  const tabs = sel.visibleTabs(s).map((t) => {
    const fresh = !ui.seenTabs.has(t.id);
    return `<button class="tab${t.id === ui.tab ? ' on' : ''}${fresh ? ' glint' : ''}" data-act="tab" data-tab="${t.id}"><span class="tab-crest"></span><span class="tab-label">${esc(t.label)}</span></button>`;
  }).join('');
  return `<div class="rail-brand"><span class="rb-mark">The desk</span></div><div class="rail-tabs">${tabs}</div>`;
}

// ── work tab ─────────────────────────────────────────────────────────────────

function workHTML(s) {
  const u = (x) => sel.isUnlocked(s, x);
  const out = [];
  const rows = [];

  if (s.rung === 'R0') {
    const autoRevealed = s.rungMeter >= D.BALANCE.RAKE_AUTO_REVEAL_METER || s.flags.raked;
    rows.push(`<div class="row">
      <button class="seal" data-act="rake">${esc(D.COPY.rakeLabel)}</button>
      <div class="row-info"><span class="micro">+${D.BALANCE.RICE_PER_RAKE} rice · −${D.BALANCE.SATIETY_PER_ACT} body</span></div>
      ${autoRevealed ? autoBtn(s.autoRake, 'auto-rake') : ''}
    </div>`);
  }

  rows.push(`<div class="row">
    <button class="qbtn" data-act="rest">${esc(D.COPY.restLabel)}</button>
    <div class="row-info"><span class="micro">+${D.BALANCE.SATIETY_PER_REST} body</span></div>
  </div>`);

  const here = sel.laboursHere(s);
  for (const a of here) {
    const y = Object.entries(a.yields).map(([res, n]) => `+${n} ${res}`).join(' · ');
    rows.push(`<div class="row">
      <button class="qbtn verb" data-act="activity" data-id="${a.id}">${esc(a.label)}</button>
      <div class="row-info"><span class="micro">${y} · −${a.satietyCost} body</span></div>
      ${autoBtn(s.autoActivity === a.id, 'auto-act', `data-id="${a.id}"`)}
    </div>`);
  }
  if (!here.length && s.rung !== 'R0') rows.push(`<div class="note">${esc(D.COPY.noWorkHere)}</div>`);

  if (u('verb-cook')) {
    const can = s.resources.sansai >= D.BALANCE.COOK_SANSAI_COST;
    const hurt = s.character.hp <= sel.hpMax(s) * 0.55;
    rows.push(`<div class="row">
      <button class="${hurt && can ? 'seal urgent' : 'qbtn' + (hurt ? ' urgent' : '')}" data-act="cook" ${can ? '' : 'disabled title="Not enough sansai"'}>${esc(D.COPY.cookLabel)}</button>
      <div class="row-info"><span class="micro">+${D.BALANCE.COOK_HP_RESTORE} life</span></div>
    </div>`);
  }
  if (u('panel-estate')) {
    const can = s.resources.rice >= D.BALANCE.EAT_RICE_COST;
    rows.push(`<div class="row">
      <button class="qbtn" data-act="eat" ${can ? '' : 'disabled title="Not enough rice"'}>${esc(D.COPY.eatRiceLabel)}</button>
      <div class="row-info"><span class="micro">+${D.BALANCE.EAT_RICE_SATIETY} body</span></div>
    </div>`);
  }

  out.push(`<section class="tray">${trayHead(D.COPY.workHeader)}${rows.join('')}</section>`);

  // The wolf beat — the most dramatic button on the screen.
  if (u('verb-face-wolf') && !s.flags['first-fight-survived']) {
    if (s.location === 'kura') {
      const wolf = D.MOBS.find((m) => m.id === 'wolf_scripted');
      out.push(`<section class="tray wolf-card">
        <p class="prose">${esc(wolf.blurb)}</p>
        <div class="row center"><button class="seal seal-lg wolf-btn" data-act="face-wolf">${esc(D.COPY.wolfButton)}</button></div>
      </section>`);
    } else {
      out.push(`<section class="tray wolf-card away"><p class="note">${esc(D.COPY.wolfAway)}</p></section>`);
    }
  }

  if (s.flags.raked || s.rungMeter > 0 || s.rung !== 'R0') out.push(ladderHTML(s));
  return out.join('');
}

function ladderHTML(s) {
  const r = sel.rung(s);
  const next = sel.nextRung(s);
  const ready = sel.summonsReady(s);
  const full = sel.meterFull(s);
  const into = Math.min(s.rungMeter, r.threshold);
  return `<section class="tray ladder">
    ${trayHead(D.COPY.ladderService, `<span class="rung-id">${esc(r.id)}</span>`)}
    <div class="ladder-body">
      <div class="ladder-title">${esc(r.title)}</div>
      ${meter('ladder', s.rungMeter / r.threshold, 'gold')}
      <div class="micro gold-num">${formatKMB(into)} / ${formatKMB(r.threshold)}</div>
      ${ready ? `<p class="hint gold">${esc(D.COPY.ladderReady)}</p>` : ''}
      ${full && !ready && r.advanceHint ? `<p class="hint">${esc(r.advanceHint)}</p>` : ''}
      ${next ? `<div class="micro dim" style="padding-top:7px">${esc(D.COPY.ladderNext)} ${esc(next.title)}</div>` : ''}
      ${s.rung === 'R3' ? `<div class="micro dim" style="padding-top:4px">${esc(D.COPY.ladderEnd)}</div>` : ''}
    </div>
  </section>`;
}

// ── map tab ──────────────────────────────────────────────────────────────────

function mapHTML(s) {
  const node = sel.nodeOf(s);
  const out = [];

  out.push(`<section class="tray">
    ${trayHead(D.COPY.mapHeader)}
    <div class="here">
      <div class="micro dim">${esc(D.COPY.youStandAt)}</div>
      <div class="here-name">${esc(node.label)}</div>
      <p class="prose">${esc(node.blurb)}</p>
    </div>
  </section>`);

  const reach = sel.reachable(s);
  out.push(`<section class="tray">
    ${trayHead(D.COPY.onward)}
    <div class="move-strip">${reach.map((rr) => `
      <div class="move-cell">
        <button class="qbtn move" data-act="move" data-node="${rr.node.id}" ${rr.blocked ? 'disabled' : ''}>${esc(rr.node.label)}</button>
        ${rr.blocked ? `<div class="micro warn">${esc(D.COPY.needsConditioning)}</div>` : ''}
      </div>`).join('')}
    </div>
  </section>`);

  const people = sel.peopleHere(s);
  if (people.length) {
    out.push(`<section class="tray">
      ${trayHead(D.COPY.whosHere)}
      ${people.map((p) => {
        const open = s.openPersonId === p.id;
        return `<div class="row person">
        <div class="row-info grow"><b class="p-name">${esc(p.name)}</b><span class="micro dim">${esc(p.tell)}</span></div>
        <button class="${open ? 'qbtn' : 'seal seal-sm'}" data-act="${open ? 'leave' : 'talk'}" data-person="${p.id}">${esc(open ? D.COPY.leave(p.name) : D.COPY.speakWith(p.name))}</button>
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
      <div class="m-line"><b>${esc(it.label)}</b><span class="micro gold-num">${grants}</span>${stockDots(bought, it.stockCap)}</div>
      <p class="prose dim">${esc(it.blurb)}</p>
      <div class="m-buy">${sold
        ? '<span class="micro dim">Sold out</span>'
        : `<button class="seal seal-sm" data-act="buy" data-id="${it.id}" ${afford ? '' : 'disabled title="Not enough coin"'}>${esc(formatCoin(it.coinCost))}</button>`}
      </div>
    </div>`;
  }).join('');
  return `<section class="tray market">
    ${trayHead(D.COPY.marketHeader)}
    <p class="note">${esc(D.MARKET_BLURB)}</p>
    ${items}
    <div class="sell">
      <div class="micro strong">${esc(D.COPY.sellRiceHeader)}</div>
      <p class="prose dim">${esc(D.COPY.sellRiceLine(price, season.label, D.RICE_SELL_GLOSS[season.id]))}</p>
      <button class="qbtn" data-act="sell-rice" ${rice > 0 ? '' : 'disabled title="No rice carried"'}>${esc(D.COPY.sellAllRice(formatKMB(rice), formatCoin(rice * price)))}</button>
    </div>
  </section>`;
}

// ── estate tab ───────────────────────────────────────────────────────────────

function estateHTML(s) {
  const out = [];
  const cur = D.ESTATE_STAGE_NAMES[s.estateStage];
  const next = D.ESTATE_STAGES[s.estateStage];
  const body = next
    ? `<div class="est-next">
        <div class="est-label">${esc(next.label)}</div>
        <p class="prose dim">${esc(next.blurb)}</p>
        <span class="micro gold-num">+${next.yieldBonusNum}% labour output · +${next.satietyMaxBonus} max body</span>
        <div class="est-buy">
          <button class="seal" data-act="improve" ${s.resources.coin >= next.coinCost ? '' : 'disabled title="Not enough coin"'}>${esc(next.label)}</button>
          <span class="cost">${esc(formatCoin(next.coinCost))}</span>
        </div>
      </div>`
    : `<p class="prose">${esc(D.ESTATE_STAGES[3].logLine)}</p>`;
  out.push(`<section class="tray">
    ${trayHead(D.COPY.estateHeader, `<span class="chip hot">${esc(cur)}</span>`)}
    ${body}
  </section>`);

  out.push(`<section class="tray">
    ${trayHead(D.COPY.houseReopens)}
    ${D.HOUSE_ROOMS.map((rm) => `<div class="sil-row"><span class="sil-mark">◆</span><span class="sil-name">${esc(rm.label)}</span><span class="chip dim">${esc(rm.lockRung)}</span></div>`).join('')}
  </section>`);

  if (sel.isUnlocked(s, 'panel-house-influence')) {
    out.push(`<section class="tray locked-teaser">
      ${trayHead(D.HOUSE_INFLUENCE.header)}
      <p class="prose dim">${esc(D.HOUSE_INFLUENCE.blurb)}</p>
      ${Array.from({ length: D.HOUSE_INFLUENCE.silhouetteRows }, () => '<div class="sil-row"><span class="sil-mark">◆</span><span class="sil-bar"></span></div>').join('')}
      <div class="micro dim foot">${esc(D.HOUSE_INFLUENCE.lockedFoot)}</div>
    </section>`);
  }
  return out.join('');
}

// ── inventory tab ────────────────────────────────────────────────────────────

function inventoryHTML(s) {
  const r = s.resources;
  const b = s.banked;
  const atKura = s.location === 'kura';
  const rows = atKura
    ? `<div class="bank-grid">
        <button class="qbtn" data-act="bank" data-what="coin" data-dir="deposit" ${r.coin > 0 ? '' : 'disabled title="No coin carried"'}>${esc(D.COPY.storeAllCoin)}</button>
        <button class="qbtn" data-act="bank" data-what="coin" data-dir="withdraw" ${b.coin > 0 ? '' : 'disabled title="No coin stored"'}>${esc(D.COPY.withdrawAllCoin)}</button>
        <button class="qbtn" data-act="bank" data-what="rice" data-dir="deposit" ${r.rice > 0 ? '' : 'disabled title="No rice carried"'}>${esc(D.COPY.storeAllRice)}</button>
        <button class="qbtn" data-act="bank" data-what="rice" data-dir="withdraw" ${b.rice > 0 ? '' : 'disabled title="No rice stored"'}>${esc(D.COPY.withdrawAllRice)}</button>
      </div>`
    : `<p class="note">${esc(D.STOREHOUSE.offNodeBlurb)}</p>`;
  return `<section class="tray">
    ${trayHead(D.STOREHOUSE.header)}
    <p class="prose dim">${esc(D.STOREHOUSE.blurb)}</p>
    <span class="micro gold-num carried">${esc(D.COPY.carriedLine(formatCoin(r.coin), formatKMB(r.rice), formatCoin(b.coin), formatKMB(b.rice)))}</span>
    ${rows}
  </section>`;
}

// ── character tab ────────────────────────────────────────────────────────────

function characterHTML(s) {
  const out = [];

  const skills = D.SKILLS.filter((sk) => {
    const st = s.skills[sk.id];
    return st && (st.xp > 0 || st.level > 1 || sk.id === 'conditioning');
  });
  out.push(`<section class="tray">
    ${trayHead('Skills')}
    ${skills.map((sk) => {
      const st = s.skills[sk.id];
      const need = 40 + st.level * 30;
      return `<div class="skill">
        <div class="sk-line"><b>${esc(sk.label)}</b><span class="chip">Lv ${st.level}</span><span class="micro dim">+${D.SKILL_YIELD_PER_LEVEL}% yield each level</span></div>
        <p class="prose dim">${esc(sk.blurb)}</p>
        ${meter('sk-' + sk.id, st.xp / need, 'thin')}
      </div>`;
    }).join('')}
  </section>`);

  if (sel.isUnlocked(s, 'readout-combat-level')) {
    const pts = s.character.attributePoints;
    out.push(`<section class="tray">
      ${trayHead(D.COPY.trainingHeader, `<span class="chip${pts > 0 ? ' hot' : ''}">${esc(D.COPY.trainingPoints(pts))}</span>`)}
      ${D.ATTRS.map((a) => `<div class="attr-row">
        <span class="attr-tag">${esc(a.label)}</span>
        <span class="attr-name">${esc(a.name)}<span class="micro dim"> — ${esc(a.gloss)}</span></span>
        <b class="attr-val" data-vk="attr-${a.id}" data-vv="${s.character.attrs[a.id]}">${s.character.attrs[a.id]}</b>
        <button class="seal seal-sm sq" data-act="attr" data-attr="${a.id}" ${pts > 0 ? '' : 'disabled title="No points to spend"'}>+1</button>
      </div>`).join('')}
    </section>`);
  }

  if (sel.isUnlocked(s, 'panel-bestiary')) {
    const entries = sel.bestiary(s);
    const faced = entries.filter((e) => e.faced).length;
    out.push(`<section class="tray">
      ${trayHead(D.COPY.bestiaryHeader)}
      <p class="note">${esc(D.COPY.bestiaryCount(faced, entries.length))}</p>
      <div class="beast-grid">${entries.map((e) => e.faced
        ? `<div class="beast">
            <div class="b-line"><b>${esc(e.mob.label)}</b>${pipHTML(sel.winRate(s, e.mob))}</div>
            <p class="prose dim">${esc(e.mob.blurb)}</p>
            <span class="micro">Tell — ${esc(e.mob.tell)}</span>
            <span class="micro">Haunts — ${esc(e.mob.haunts)}</span>
          </div>`
        : `<div class="beast unfaced">
            <div class="b-line"><b class="fog">${esc(D.COPY.bestiaryUnknown)}</b></div>
            <span class="micro dim">${esc(D.COPY.bestiaryNotFaced)}</span>
          </div>`).join('')}
      </div>
    </section>`);
  }

  if (sel.isUnlocked(s, 'tab-combat')) {
    out.push(`<section class="tray">
      ${trayHead(D.QUESTS_HEADER)}
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
    ? `<button class="seal seal-sm" data-act="quest" data-id="${q.id}">${esc(D.COPY.takeThisOn)}</button>`
    : st === 'accepted'
      ? '<span class="chip hot">Undertaken</span>'
      : '<span class="chip done">❖ Complete</span>';
  return `<div class="quest ${st}">
    <div class="q-line"><span class="kind">${esc(q.kind)}</span><b>${esc(q.title)}</b></div>
    <p class="prose dim">${esc(q.blurb)}</p>
    <ul class="q-steps">${q.steps.map((step) => {
      const done = prog.includes(step.id);
      return `<li class="${done ? 'done' : ''}"><span class="tick">${done ? '◆' : '◇'}</span><span>${esc(step.label)}</span></li>`;
    }).join('')}</ul>
    <div class="q-foot"><span class="micro gold-num">${esc(D.COPY.reward(formatCoin(q.rewardCoin)))}</span>${foot}</div>
  </div>`;
}

// ── combat tab ───────────────────────────────────────────────────────────────

function combatHTML(s) {
  const out = [];
  const need = sel.combatXpNeeded(s);
  out.push(`<section class="tray">
    ${trayHead(D.COPY.combatLevel(s.character.level))}
    ${meter('cxp', s.character.combatXp / need, 'gold')}
    <div class="micro gold-num xp-count">${s.character.combatXp} / ${need}</div>
  </section>`);

  const w = D.WEAPONS.find((x) => x.id === s.equippedWeapon);
  out.push(`<section class="tray">
    ${trayHead(w.label, `<span class="chip">${esc(w.archetype)}</span>`)}
    <p class="prose dim">${esc(w.blurb)}</p>
  </section>`);

  const foes = sel.foesHere(s);
  out.push(`<section class="tray">
    ${trayHead(D.COPY.watchHeader)}
    ${foes.length ? foes.map((m) => {
      const faced = s.bestiaryFaced.includes(m.id);
      const autoEnd = s.autoCombat === m.id && !s.autoCombatRetreat;
      const autoFlee = s.autoCombat === m.id && s.autoCombatRetreat;
      return `<div class="foe">
        <div class="b-line"><b class="${faced ? '' : 'fog'}">${esc(m.label)}</b>${pipHTML(sel.winRate(s, m))}</div>
        <p class="prose dim">${esc(m.blurb)}</p>
        <div class="foe-verbs">
          <button class="seal seal-sm" data-act="fight" data-mob="${m.id}">${esc(D.COPY.fight)}</button>
          <button class="qbtn auto${autoEnd ? ' on' : ''}" data-act="auto-combat" data-mob="${m.id}" data-retreat="0">${esc(autoEnd ? D.COPY.autoOff : D.COPY.autoToEnd)}</button>
          <button class="qbtn auto${autoFlee ? ' on' : ''}" data-act="auto-combat" data-mob="${m.id}" data-retreat="1">${esc(autoFlee ? D.COPY.autoOff : D.COPY.autoFlee)}</button>
        </div>
      </div>`;
    }).join('') : `<p class="note">${esc(D.COPY.watchEmpty)}</p>`}
  </section>`);
  return out.join('');
}

// ── the log (hero surface) ───────────────────────────────────────────────────

function logHeadHTML() {
  // .log-expand is mobile-only (display:none in base CSS): pulls the paper
  // band tall for reading, in place — the log stays first-class on a phone.
  return `<h2>${esc(D.LOG_HEADER)}</h2>
  <button class="log-expand${ui.logExpanded ? ' on' : ''}" data-act="log-expand" aria-expanded="${ui.logExpanded}" aria-label="${ui.logExpanded ? 'Shrink the record' : 'Expand the record'}">⌃</button>
  <div class="filters">${D.LOG_FILTERS.map((f) => `<button class="f${f === ui.logFilter ? ' on' : ''}" data-act="filter" data-filter="${f}">${esc(D.LOG_FILTER_LABELS[f])}</button>`).join('')}</div>`;
}

function lineHTML(l, fresh) {
  const bullet = D.CHANNEL_BULLET[l.channel];
  const spk = l.voice && l.speaker
    ? `<span class="spk v-${l.voice}">${esc(l.speaker)}</span><span> — </span>`
    : '';
  const cnt = l.count > 1 ? ` <span class="xn" title="repeated ×${l.count}">×${l.count}</span>` : '';
  // The bullet column already carries the channel glyph — drop a duplicate
  // leading glyph from the text (presentation only, words untouched).
  let text = l.text;
  if (bullet && text.startsWith(bullet)) text = text.slice(bullet.length).trimStart();
  return `<li class="ll ll-${l.channel}${fresh ? ' ink-in' : ''}">${bullet ? `<span class="lb">${bullet}</span>` : '<span class="lb lb-dot">·</span>'}<div class="lt">${spk}${esc(text)}${cnt}</div></li>`;
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
        if (badge) { badge.classList.add('pop'); }
      }
      for (let i = n; i < keys.length; i++) feed.insertAdjacentHTML('beforeend', lineHTML(lines[i], true));
      appended = true;
    }
  }
  if (!appended) feed.innerHTML = lines.map((l) => lineHTML(l, false)).join('');

  ui.logKeys = keys;
  ui.lastFilter = ui.logFilter;
  if (!appended || nearBottom) scroller.scrollTop = scroller.scrollHeight;
}

// ── overlays: cold open, VN scroll, rank-up ceremony ─────────────────────────

function coldHTML() {
  return `<div class="cold">
    <div class="cold-inner">
      <div class="cold-crest">◆ ◆ ◆</div>
      <h1 class="cold-title">${esc(D.COLD_OPEN.title)}</h1>
      <div class="cold-sub"><span class="rule"></span>${esc(D.COLD_OPEN.subtitle)}<span class="rule"></span></div>
      <p class="cold-lede">${esc(D.COLD_OPEN.lede)}</p>
      <button class="seal seal-lg cold-verb" data-act="open-eyes">${esc(D.COLD_OPEN.verb)}</button>
    </div>
  </div>`;
}

function vnLine(ln, fresh) {
  const spk = ln.speaker ? `<span class="spk v-${ln.voice}">${esc(ln.speaker)}</span>` : '';
  return `<div class="vnl${ln.voice === 'narrator' ? ' narr' : ''}${fresh ? ' ink-in' : ''}">${spk}${esc(ln.text)}</div>`;
}

function vnHTML(s) {
  const vn = s.vn;
  const scene = vn.kind === 'intro' ? D.INTRO_SCENES[vn.sceneIndex] : D.RUNG_BEATS[vn.target];
  const plateName = scene.speaker ?? scene.plateLabel ?? '';
  const lines = scene.greeting.slice(0, vn.shown)
    .map((ln, i) => vnLine(ln, vn.phase === 'greeting' && i === vn.shown - 1)).join('');

  let tail = '';
  if (vn.phase === 'greeting') {
    tail = `<div class="vn-cue"><button class="qbtn paper" data-act="vn-next">Continue ▸</button></div>`;
  } else if (vn.phase === 'ask') {
    const last = scene.topics.find((t) => t.id === vn.lastAsk);
    const answer = last ? `<div class="vn-answer ink-in">${last.answer.map((ln) => vnLine(ln, false)).join('')}</div>` : '';
    tail = `${answer}<div class="vn-hub">
      ${scene.topics.map((t) => {
        const asked = vn.asked.includes(t.id);
        const gated = t.gateTopic && !vn.asked.includes(t.gateTopic);
        return `<button class="topic${asked ? ' asked' : ''}" data-act="vn-ask" data-topic="${t.id}" ${gated ? 'disabled title="Ask the rest first"' : ''}>${asked ? '◆ ' : ''}${esc(t.label)}</button>`;
      }).join('')}
      <button class="qbtn paper done" data-act="vn-done">${esc(D.COPY.doneQuestioning)}</button>
    </div>`;
  } else if (vn.phase === 'decide') {
    tail = `<div class="vn-decide ink-in">
      <div class="vn-prompt">${esc(scene.decision.prompt)}</div>
      ${scene.decision.options.map((o) => `<button class="choice" data-act="vn-choose" data-opt="${o.id}">${esc(o.label)}</button>`).join('')}
    </div>`;
  } else {
    const opt = scene.decision.options.find((o) => o.id === vn.picked);
    const perk = opt.perk
      ? `<div class="perk ink-in">
          <span class="micro perk-tag">${esc(D.COPY.perkTag)}</span>
          <b class="perk-name">${esc(opt.perk.name)}</b>
          <p class="prose">${esc(opt.perk.desc)}</p>
          ${opt.stat ? `<div class="perk-stats"><span class="chip up">+1 ${opt.stat.up.toUpperCase()}</span><span class="chip downc">−1 ${opt.stat.down.toUpperCase()}</span></div>` : ''}
        </div>`
      : '';
    const bonus = opt.statBonus ? `<p class="bonus">${esc(opt.statBonus.note)}</p>` : '';
    tail = `<div class="vn-resolved">
      ${vnLine({ voice: 'player', speaker: 'You', text: opt.say }, true)}
      ${vnLine({ voice: scene.voice, speaker: scene.speaker, text: opt.react }, true)}
      ${perk}${bonus}
      <div class="vn-cue"><button class="seal" data-act="vn-continue">${esc(D.COPY.continueBtn)}</button></div>
    </div>`;
  }

  return `<div class="vn">
    <div class="vn-scroll">
      <div class="vn-roller top"></div>
      <div class="vn-paper"${vn.phase === 'greeting' ? ' data-act="vn-next" onclick=""' : ''}>
        <div class="vn-plate"><span class="plate-seal">${esc(scene.sealText)}</span><span class="plate-name">${esc(plateName)}</span></div>
        <div class="vn-lines">${lines}${tail}</div>
      </div>
      <div class="vn-roller bot"></div>
    </div>
  </div>`;
}

function ceremonyHTML(s) {
  const c = s.ceremony;
  const initial = c.title.trim()[0].toUpperCase();
  return `<div class="ceremony" data-act="dismiss-ceremony" onclick="">
    <div class="cer-field">
      <div class="cer-promoted">${esc(D.COPY.promoted)}</div>
      <div class="cer-seal"><span>${esc(initial)}</span></div>
      <div class="cer-title">${esc(c.title)}</div>
      <span class="cer-rank micro dim">${esc(c.rank)} · ${esc(D.HOUSE_MARK)}</span>
      <button class="qbtn cer-continue" data-act="dismiss-ceremony">${esc(D.COPY.continueBtn)}</button>
    </div>
  </div>`;
}

// ── stage selector (review affordance — VARIANT-SPEC §2) ─────────────────────

function stripHTML(s) {
  return `<button class="ss-head" data-act="ss-toggle">❖ <span>Stage</span><span class="ss-sep"> · </span>${esc(s.stageId)}</button>
  <div class="ss-body">
    <div class="ss-row">${D.STAGES.map((st) => `<button class="ss-btn${st.id === s.stageId ? ' on' : ''}" data-act="ss-stage" data-stage="${st.id}" title="${esc(st.blurb)}">${esc(st.label)}</button>`).join('')}</div>
    <div class="ss-row moments">
      <button class="ss-btn" data-act="ss-intro" title="Cold open, then the three intro scenes">Play intro</button>
      <button class="ss-btn" data-act="ss-wolf" title="R2 at the kura — the scripted first fight">Face wolf</button>
      <button class="ss-btn" data-act="ss-fight" title="R3 — a real fight at the forecourt">Fight</button>
      <button class="ss-btn" data-act="ss-rungup" title="Force the meter, play the rung beat + seal">Rung-up</button>
    </div>
  </div>`;
}

// ── render root ──────────────────────────────────────────────────────────────

const paneFns = {
  work: workHTML, map: mapHTML, estate: estateHTML,
  inventory: inventoryHTML, character: characterHTML, combat: combatHTML,
};

function renderPane(s) {
  const pane = $('pane');
  const switched = ui.paneTab !== ui.tab;
  const html = `<div class="pane-inner${switched ? ' pane-in' : ''}" data-tab="${ui.tab}">${paneFns[ui.tab](s)}</div>`;
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

  if (!s.ceremony) ui.ceremonyAt = 0;
  else if (!ui.ceremonyAt) ui.ceremonyAt = Date.now();

  ov.classList.toggle('live', !!html);
  if (setHTML(ov, html)) {
    const vl = ov.querySelector('.vn-lines');
    if (vl) vl.scrollTop = vl.scrollHeight;
  }
}

function renderAll() {
  const s = eng.state;

  if (s.stageId !== ui.lastStage) { // a stage jump — reset UI state, no glints
    ui.lastStage = s.stageId;
    ui.tab = 'work';
    ui.logFilter = 'story';
    ui.logExpanded = false;
    ui.seenTabs = new Set(sel.visibleTabs(s).map((t) => t.id));
    prevVals.clear();
    meterPrev.clear();
  }
  if (!sel.visibleTabs(s).some((t) => t.id === ui.tab)) ui.tab = 'work';

  const cold = s.phase === 'cold-open';
  $('hdr').hidden = cold;
  $('main').hidden = cold;
  if (!cold) {
    setHTML($('hdr'), headerHTML(s));
    const navOn = sel.navVisible(s);
    $('nav').hidden = !navOn;
    if (navOn) {
      setHTML($('nav'), navHTML(s));
      sel.visibleTabs(s).forEach((t) => ui.seenTabs.add(t.id));
    }
    $('main').classList.toggle('sparse', !navOn);
    $('main').classList.toggle('logx', ui.logExpanded);
    renderPane(s);
    setHTML($('loghead'), logHeadHTML());
    renderLogFeed(s);
  }
  renderOverlay(s);
  const strip = $('stagestrip');
  strip.classList.toggle('open', ui.stripOpen);
  setHTML(strip, stripHTML(s));

  popVals();
  animateMeters();
}

// ── the signature: crest → seal ──────────────────────────────────────────────
// A committed game-action stamps a warm vermillion wax-seal ring at the pointer
// — the SAME 45° diamond that marks selection at rest (the cool tab/row crest),
// blooming warm as it presses down (~140ms) then rounding to a ring and fading.
// It lives in the #fx layer (outside every re-rendered surface) so the innerHTML
// replace that follows the dispatch never wipes it mid-bloom.
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');
function sealBloom(x, y) {
  if (REDUCED.matches) return;
  const fx = $('fx');
  if (!fx) return;
  const b = document.createElement('span');
  b.className = 'seal-bloom';
  b.style.left = x + 'px';
  b.style.top = y + 'px';
  fx.appendChild(b);
  setTimeout(() => b.remove(), 440);
}
// A commit is a game-action button (warm side), never navigation/toggle chrome.
const COMMIT_SEL = '.seal, .qbtn.verb, .qbtn.move, .choice, .topic, .cta';

// ── intents ──────────────────────────────────────────────────────────────────

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  if (el.matches(COMMIT_SEL) || el.matches('button.qbtn') && !el.classList.contains('auto')) {
    sealBloom(e.clientX, e.clientY);
  }
  const d = el.dataset;
  switch (d.act) {
    // cold open / VN
    case 'open-eyes': eng.dispatch({ type: 'open_eyes' }); break;
    case 'vn-next': eng.dispatch({ type: 'vn_next' }); break;
    case 'vn-ask': eng.dispatch({ type: 'vn_ask', topicId: d.topic }); break;
    case 'vn-done': eng.dispatch({ type: 'vn_done_asking' }); break;
    case 'vn-choose': eng.dispatch({ type: 'vn_choose', optionId: d.opt }); break;
    case 'vn-continue': eng.dispatch({ type: 'vn_continue' }); break;
    // chrome
    case 'tab': ui.tab = d.tab; renderAll(); break;
    case 'filter': ui.logFilter = d.filter; renderAll(); break;
    case 'log-expand': {
      const sc = $('logscroll');
      const pinned = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 48;
      ui.logExpanded = !ui.logExpanded;
      renderAll();
      if (pinned) sc.scrollTop = sc.scrollHeight;
      break;
    }
    case 'summons': eng.dispatch({ type: 'begin_rung_beat' }); break;
    // work
    case 'rake': eng.dispatch({ type: 'rake_rice' }); break;
    case 'rest': eng.dispatch({ type: 'rest' }); break;
    case 'auto-rake': eng.dispatch({ type: 'set_auto_rake', on: !eng.state.autoRake }); break;
    case 'activity': eng.dispatch({ type: 'do_activity', id: d.id }); break;
    case 'auto-act': eng.dispatch({ type: 'set_auto', id: eng.state.autoActivity === d.id ? null : d.id }); break;
    case 'cook': eng.dispatch({ type: 'cook_meal' }); break;
    case 'eat': eng.dispatch({ type: 'eat_rice' }); break;
    // map & market
    case 'move': eng.dispatch({ type: 'move_to', node: d.node }); break;
    case 'talk': eng.dispatch({ type: 'talk', personId: d.person }); break;
    case 'leave': eng.dispatch({ type: 'leave' }); break;
    case 'buy': eng.dispatch({ type: 'buy_item', id: d.id }); break;
    case 'sell-rice': eng.dispatch({ type: 'sell_rice' }); break;
    // estate & inventory
    case 'bank': eng.dispatch({ type: d.dir, what: d.what }); break;
    case 'improve': eng.dispatch({ type: 'improve_estate' }); break;
    // character & combat
    case 'attr': eng.dispatch({ type: 'spend_attribute', attr: d.attr }); break;
    case 'face-wolf': eng.dispatch({ type: 'face_wolf' }); break;
    case 'fight': eng.dispatch({ type: 'fight', mobId: d.mob }); break;
    case 'auto-combat': {
      const retreat = d.retreat === '1';
      const active = eng.state.autoCombat === d.mob && eng.state.autoCombatRetreat === retreat;
      eng.dispatch({ type: 'set_auto_combat', mobId: active ? null : d.mob, retreat });
      break;
    }
    case 'quest': eng.dispatch({ type: 'accept_quest', id: d.id }); break;
    // ceremony (held ~2s before dismissible)
    case 'dismiss-ceremony':
      if (Date.now() - ui.ceremonyAt > 1600) eng.dispatch({ type: 'dismiss_ceremony' });
      break;
    // stage strip
    case 'ss-toggle': ui.stripOpen = !ui.stripOpen; renderAll(); break;
    case 'ss-stage': ui.stripOpen = false; eng.setStage(d.stage); break;
    case 'ss-intro':
      ui.stripOpen = false;
      eng.setStage('cold-open');
      eng.dispatch({ type: 'open_eyes' });
      break;
    case 'ss-wolf':
      ui.stripOpen = false;
      eng.setStage('R2');
      eng.dispatch({ type: 'face_wolf' });
      break;
    case 'ss-fight':
      ui.stripOpen = false;
      eng.setStage('R3');
      eng.dispatch({ type: 'move_to', node: 'gate-forecourt' });
      ui.tab = 'combat';
      eng.dispatch({ type: 'fight', mobId: 'rice_rats' });
      break;
    case 'ss-rungup': {
      // The documented demo hack (VARIANT-SPEC §2) — this one place only:
      // force the meter (and the story gate) so the beat can play on demand.
      ui.stripOpen = false;
      if (eng.state.rung === 'R3') eng.setStage('R2'); // R4+ is out of scope
      const cur = sel.rung(eng.state);
      if (cur.storyGateFlag) eng.state.flags[cur.storyGateFlag] = true;
      eng.state.rungMeter = cur.threshold;
      eng.dispatch({ type: 'begin_rung_beat' });
      break;
    }
    default: break;
  }
});

eng.subscribe(() => renderAll());

// headless QA / review handle (mirrors 04's engine exposure)
window.__andon = { eng, sel, ui };
