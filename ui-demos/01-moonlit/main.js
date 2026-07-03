// ui-demos/01-moonlit/main.js
// Moonlit Menu — a 1998 PSX JRPG menu system that never existed.
// Render + reconcile over the shared mock engine.

import { createEngine, sel } from '../shared/engine.js';
import * as D from '../shared/data.js';
import { formatKMB, formatCoin } from '../shared/format.js';

const eng = createEngine('R1');
const app = document.getElementById('app');

// — UI-only state —
let activeTab = 'work';
let logFilter = 'story';
// mobile-only chrome state (classes are unstyled outside the ≤920px breakpoint,
// and the toggle buttons are display:none in base CSS — desktop never sees them)
let logOpen = false;
let stripOpen = false;

// — number-pop tracking —
let prev = { rice: null, coin: null, wood: null, sansai: null, meter: null };

// — log scroll memory —
let logAtBottom = true;

// — animation gating: entry animations play ONLY on structural change, never on
//   the 480ms tick re-render. lastViewSig tracks structural identity; the log
//   animates only lines newer than lastLogMaxId. —
let lastViewSig = '';
let lastLogMaxId = 0;
let logNewThreshold = 0;

// ── helpers ──────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]),
  );
}
function crest(cls = '') {
  return `<span class="crest ${cls}" aria-hidden="true"></span>`;
}

function pct(a, b) {
  return Math.max(0, Math.min(100, Math.round((a / b) * 100)));
}

// ── header vitals ────────────────────────────────────────────────────────────
function vitalsHTML(s) {
  const out = [];
  // house mark
  out.push(
    `<div class="vital house">${crest()}<span class="vv">${esc(D.HOUSE_MARK)}</span></div>`,
  );
  // rice — always
  out.push(vitalBox('Rice', formatKMB(s.resources.rice), 'rice'));
  // coin — once any coin exists
  if (s.resources.coin + s.banked.coin > 0) {
    out.push(vitalBox('Coin', formatCoin(s.resources.coin), 'coin'));
  }
  // clock
  if (sel.isUnlocked(s, 'readout-clock')) {
    const season = sel.seasonOf(s.clock.day);
    const yr = sel.yearOf(s.clock.day);
    const dos = sel.dayOfSeason(s.clock.day);
    out.push(
      `<div class="vital"><span class="vk">${esc(season.label)} ${season.emoji}</span>` +
        `<span class="vv tabnums" style="font-size:13px;color:var(--silver)">Year ${yr} · day ${dos}</span></div>`,
    );
  }
  // life bar (R2+)
  if (sel.isUnlocked(s, 'verb-face-wolf')) {
    const max = sel.hpMax(s);
    const p = pct(s.character.hp, max);
    const low = p <= 30 ? ' low' : '';
    out.push(
      `<div class="vital"><span class="vk">Life</span>` +
        `<span class="vv tabnums" style="font-size:13px;color:var(--hp)">${s.character.hp}/${max}</span>` +
        `<div class="barwrap"><div class="meter hp${low}"><i style="--fill:${p}%"></i></div></div></div>`,
    );
  }
  // body/satiety bar (R1+)
  if (sel.isUnlocked(s, 'readout-stamina')) {
    const max = sel.satietyMax(s);
    const p = pct(s.character.satiety, max);
    out.push(
      `<div class="vital"><span class="vk">Body</span>` +
        `<span class="vv tabnums" style="font-size:13px;color:var(--body-stam)">${s.character.satiety}/${max}</span>` +
        `<div class="barwrap"><div class="meter body"><i style="--fill:${p}%"></i></div></div></div>`,
    );
  }
  // wood + sansai pills (R2+)
  if (sel.isUnlocked(s, 'row-wood')) {
    out.push(vitalBox('Wood', formatKMB(s.resources.wood), 'wood'));
  }
  if (sel.isUnlocked(s, 'row-sansai')) {
    out.push(vitalBox('Sansai', formatKMB(s.resources.sansai), 'sansai'));
  }
  out.push('<div style="flex:1"></div>');
  out.push(rungHeadHTML(s));
  return `<div class="vitals">${out.join('')}</div>`;
}

function vitalBox(key, val, popKey) {
  const popped = popKey && prev[popKey] !== null && prev[popKey] !== val;
  return (
    `<div class="vital"><span class="vk">${esc(key)}</span>` +
    `<span class="vv tabnums${popped ? ' pop' : ''}">${esc(val)}</span></div>`
  );
}

function rungHeadHTML(s) {
  const r = sel.rung(s);
  const ready = sel.summonsReady(s);
  let body;
  if (ready) {
    body = `<button class="summons-btn" data-act="begin_rung_beat">${esc(D.COPY.summons)}</button>`;
  } else {
    const p = pct(s.rungMeter, r.threshold);
    body =
      `<div class="barwrap" style="width:100%"><div class="meter gold"><i style="--fill:${p}%"></i></div></div>` +
      `<div class="rh-into tabnums">${Math.min(s.rungMeter, r.threshold)} / ${r.threshold} service</div>`;
  }
  return (
    `<div class="vital runghead">` +
    `<div class="rh-top"><span class="rh-rank">${esc(r.title)}</span>` +
    `<span class="rh-into">${esc(r.id)}</span></div>${body}</div>`
  );
}

// ── left rail (tabs) ─────────────────────────────────────────────────────────
function tabStat(s, id) {
  switch (id) {
    case 'work': {
      const n = sel.laboursHere(s).length;
      return s.rung === 'R0' ? 'rake' : n ? `${n} here` : '—';
    }
    case 'map':
      return shortNode(sel.nodeOf(s).label);
    case 'estate':
      return `U${s.estateStage}`;
    case 'inventory':
      return `${formatKMB(s.resources.rice)}r`;
    case 'character': {
      const pts = s.character.attributePoints;
      return pts > 0 ? `${pts}pt` : `Lv ${s.character.level}`;
    }
    case 'combat':
      return `Lv ${s.character.level}`;
    default:
      return '';
  }
}
function shortNode(label) {
  // tiny tab-stat readout — clip to two meaningful words (drop filler "&"/"the")
  return briefLabel(label)
    .split(' ')
    .filter((w) => w !== '&' && w.toLowerCase() !== 'the')
    .slice(0, 2)
    .join(' ');
}
function briefLabel(label) {
  // strip only the "(kura)"-style parenthetical, keep the full phrase
  return label.replace(/\s*\(.*\)/, '');
}

function railHTML(s, anim) {
  const tabs = sel.visibleTabs(s);
  const rows = tabs
    .map(
      (t, i) =>
        `<button class="tab ${t.id === activeTab ? 'active' : ''}" data-act="set_tab" data-tab="${t.id}" style="animation-delay:${i * 40}ms">` +
        `${crest('t-cursor')}<span class="t-label">${esc(t.label)}</span>` +
        `<span class="t-stat tabnums">${esc(tabStat(s, t.id))}</span></button>`,
    )
    .join('');
  return (
    `<nav class="rail box">` +
    `<div class="rail-brand"><div class="rb-mark">Kurosawa</div><div class="rb-sub">Estate Ledger</div></div>` +
    `<div class="rail-tabs${anim ? ' anim' : ''}">${rows}</div></nav>`
  );
}

// ── menu-row builder ─────────────────────────────────────────────────────────
function menuRow({ act, data = {}, name, sub, cost, costCls = '', disabled, reason, trailing }) {
  const attrs = Object.entries(data)
    .map(([k, v]) => `data-${k}="${esc(v)}"`)
    .join(' ');
  const tag = disabled ? 'div' : 'button';
  const dis = disabled ? 'disabled' : '';
  const main =
    `<${tag} class="m-main" ${disabled ? '' : `data-act="${act}" ${attrs}`} ${dis}>` +
    (disabled ? '' : crest('m-cursor')) +
    `<span class="m-name">${esc(name)}${sub ? `<span class="m-sub">${esc(sub)}</span>` : ''}` +
    (disabled && reason ? `<span class="m-reason">${esc(reason)}</span>` : '') +
    `</span>` +
    (cost ? `<span class="m-cost ${costCls}">${esc(cost)}</span>` : '') +
    `</${tag}>`;
  return `<div class="mrow ${disabled ? 'disabled' : ''}">${main}${trailing || ''}</div>`;
}

function autoPill(on, act, data = {}) {
  const attrs = Object.entries(data)
    .map(([k, v]) => `data-${k}="${esc(v)}"`)
    .join(' ');
  return `<button class="auto-pill ${on ? 'on' : ''}" data-act="${act}" ${attrs}>${on ? D.COPY.autoOff : D.COPY.autoOn}</button>`;
}

function box(title, bodyHTML, cls = '') {
  return (
    `<section class="box ${cls}">` +
    `<h2 class="box-title">${esc(title)}<span class="rule"></span></h2>` +
    `<div class="box-body">${bodyHTML}</div></section>`
  );
}

// ── WORK tab ─────────────────────────────────────────────────────────────────
function workTab(s) {
  const parts = [];
  const rows = [];

  if (s.rung === 'R0') {
    rows.push(
      menuRow({
        act: 'rake_rice',
        name: D.COPY.rakeLabel,
        cost: `+${D.BALANCE.RICE_PER_RAKE} rice`,
        costCls: 'yield',
        trailing:
          s.rungMeter >= D.BALANCE.RAKE_AUTO_REVEAL_METER || s.flags.raked
            ? autoPill(s.autoRake, 'set_auto_rake', { on: s.autoRake ? '' : '1' })
            : '',
      }),
    );
    rows.push(menuRow({ act: 'rest', name: D.COPY.restLabel, cost: `+${D.BALANCE.SATIETY_PER_REST} body`, costCls: 'yield' }));
  }

  // wolf beat (R2, until survived)
  let wolfHTML = '';
  if (sel.isUnlocked(s, 'verb-face-wolf') && !s.flags['first-fight-survived']) {
    if (s.location === 'kura') {
      wolfHTML = `<button class="cta wolf" data-act="face_wolf">${esc(D.COPY.wolfButton)}</button>`;
    } else {
      wolfHTML = `<div class="note away">${esc(D.COPY.wolfAway)}</div>`;
    }
  }

  // labours here
  const labours = sel.laboursHere(s);
  if (s.rung !== 'R0') {
    if (labours.length) {
      for (const a of labours) {
        const yields = Object.entries(a.yields)
          .map(([r, n]) => `+${n} ${r}`)
          .join(', ');
        rows.push(
          menuRow({
            act: 'do_activity',
            data: { id: a.id },
            name: a.label,
            sub: `${yields} · −${a.satietyCost} body`,
            trailing: autoPill(s.autoActivity === a.id, 'set_auto', {
              id: s.autoActivity === a.id ? '' : a.id,
            }),
          }),
        );
      }
    } else if (!wolfHTML) {
      rows.push(`<div class="note">${esc(D.COPY.noWorkHere)}</div>`);
    }
  }

  // cook / eat
  if (sel.isUnlocked(s, 'verb-cook')) {
    const hurt = s.character.hp < sel.hpMax(s) * 0.7;
    rows.push(
      menuRow({
        act: 'cook_meal',
        name: D.COPY.cookLabel + (hurt ? '  ·  the body wants mending' : ''),
        cost: `+${D.BALANCE.COOK_HP_RESTORE} life`,
        costCls: 'yield',
        disabled: s.resources.sansai < D.BALANCE.COOK_SANSAI_COST,
        reason: 'Not enough sansai',
      }),
    );
  }
  if (sel.isUnlocked(s, 'panel-estate')) {
    rows.push(
      menuRow({
        act: 'eat_rice',
        name: D.COPY.eatRiceLabel,
        cost: `+${D.BALANCE.EAT_RICE_SATIETY} body`,
        costCls: 'yield',
        disabled: s.resources.rice < D.BALANCE.EAT_RICE_COST,
        reason: 'Not enough rice',
      }),
    );
  }

  parts.push(
    box(
      D.COPY.workHeader,
      (wolfHTML ? wolfHTML + (rows.length ? '<div style="height:8px"></div>' : '') : '') +
        `<div class="menu-list">${rows.join('')}</div>`,
    ),
  );

  // rung ladder card
  if (s.flags.raked) parts.push(ladderCard(s));

  return parts.join('');
}

function ladderCard(s) {
  const r = sel.rung(s);
  const next = sel.nextRung(s);
  const p = pct(s.rungMeter, r.threshold);
  const full = sel.meterFull(s);
  const gateMet = sel.storyGateMet(s);
  let hint = '';
  if (sel.summonsReady(s)) {
    hint = `<div class="lad-hint">${esc(D.COPY.ladderReady)}</div>`;
  } else if (full && !gateMet && r.advanceHint) {
    hint = `<div class="lad-hint">${esc(r.advanceHint)}</div>`;
  }
  const nextLine = next
    ? `<span class="lad-next">${esc(D.COPY.ladderNext)} ${esc(next.id)} · ${esc(next.title)}</span>`
    : `<span class="lad-next">${esc(D.COPY.ladderEnd)}</span>`;
  return box(
    'The rung ladder',
    `<div class="ladder">` +
      `<div class="lad-rank"><span class="lad-title">${esc(r.title)}</span>${nextLine}</div>` +
      `<div class="meter gold" style="height:10px"><i style="--fill:${p}%"></i></div>` +
      `<div class="lad-into tabnums">${esc(D.COPY.ladderService)} · ${Math.min(s.rungMeter, r.threshold)} / ${r.threshold}</div>` +
      hint +
      `</div>`,
  );
}

// ── MAP tab ──────────────────────────────────────────────────────────────────
function mapTab(s) {
  const parts = [];
  const node = sel.nodeOf(s);
  parts.push(
    box(
      D.COPY.mapHeader,
      `<div class="subhead">${esc(D.COPY.youStandAt)}</div>` +
        `<div class="lad-title" style="font-size:15px">${esc(node.label)}</div>` +
        `<div class="hereblurb">${esc(node.blurb)}</div>` +
        moveStrip(s),
    ),
  );

  // who's here
  const people = sel.peopleHere(s);
  if (people.length) {
    parts.push(box(D.COPY.whosHere, people.map((p) => personRow(s, p)).join('')));
  }

  // pedlar trade panel
  if (s.openPersonId === 'pedlar') {
    parts.push(marketPanel(s));
  }

  return parts.join('');
}

function moveStrip(s) {
  const dests = sel.reachable(s);
  const btns = dests
    .map((d) => {
      if (d.blocked) {
        return `<button class="move-btn" disabled>${esc(briefLabel(d.node.label))}<span class="mb-reason">${esc(D.COPY.needsConditioning)}</span></button>`;
      }
      return `<button class="move-btn" data-act="move_to" data-node="${d.node.id}">${esc(briefLabel(d.node.label))}</button>`;
    })
    .join('');
  return `<div class="subhead">${esc(D.COPY.onward)}</div><div class="move-strip">${btns}</div>`;
}

function personRow(s, p) {
  const open = s.openPersonId === p.id;
  const act = open
    ? `<button class="move-btn" data-act="leave">${esc(D.COPY.leave(p.name))}</button>`
    : `<button class="move-btn" data-act="talk" data-person-id="${p.id}">${esc(D.COPY.speakWith(p.name))}</button>`;
  return (
    `<div class="person"><div>` +
    `<div class="p-name">${esc(p.name)}</div><div class="p-tell">${esc(p.tell)}</div>` +
    `</div><div class="p-act">${act}</div></div>`
  );
}

function marketPanel(s) {
  const rows = D.MARKET_ITEMS.map((it) => {
    const bought = s.marketBought[it.id] ?? 0;
    const grants = Object.entries(it.grants)
      .map(([r, n]) => `+${n} ${r}`)
      .join(', ');
    const soldOut = bought >= it.stockCap;
    const tooDear = s.resources.coin < it.coinCost;
    const dis = soldOut || tooDear;
    const label = soldOut ? 'Sold out' : formatCoin(it.coinCost);
    return (
      `<div class="market-row"><div class="mk-main">` +
      `<span class="mk-label">${esc(it.label)}</span><span class="mk-grant">${esc(grants)}</span>` +
      `<div class="mk-blurb">${esc(it.blurb)}</div></div>` +
      `<button class="mk-buy" data-act="buy_item" data-id="${it.id}" ${dis ? 'disabled' : ''}>${esc(label)}</button></div>`
    );
  }).join('');

  const price = sel.ricePrice(s);
  const season = sel.seasonOf(s.clock.day);
  const gloss = D.RICE_SELL_GLOSS[season.id];
  const sellLine = D.COPY.sellRiceLine(price, season.label, gloss);
  const coinFor = formatCoin(s.resources.rice * price);
  const sellBtn =
    s.resources.rice > 0
      ? `<button class="move-btn" data-act="sell_rice" style="margin-top:8px">${esc(D.COPY.sellAllRice(s.resources.rice, coinFor))}</button>`
      : `<div class="gloss">No rice to sell right now.</div>`;

  return box(
    D.COPY.marketHeader,
    `<div class="gloss">${esc(D.MARKET_BLURB)}</div>` +
      `<div class="stack">${rows}</div>` +
      `<div class="subhead">${esc(D.COPY.sellRiceHeader)}</div>` +
      `<div class="gloss">${esc(sellLine)}</div>${sellBtn}`,
  );
}

// ── ESTATE tab ───────────────────────────────────────────────────────────────
function estateTab(s) {
  const parts = [];
  const stageName = D.ESTATE_STAGE_NAMES[s.estateStage];
  const next = D.ESTATE_STAGES[s.estateStage];
  let improveBody =
    `<div class="row-between"><span class="lad-title" style="font-size:15px">${esc(stageName)}</span></div>`;
  if (next) {
    const tooDear = s.resources.coin < next.coinCost;
    improveBody +=
      `<div class="card" style="margin-top:8px"><div class="c-head"><span class="c-name">${esc(next.label)}</span></div>` +
      `<div class="c-blurb">${esc(next.blurb)}</div>` +
      `<div class="kv-line">+${next.yieldBonusNum}% labour output · +${next.satietyMaxBonus} max body</div>` +
      `<div style="margin-top:8px">` +
      menuRow({
        act: 'improve_estate',
        name: next.label,
        cost: formatCoin(next.coinCost),
        disabled: tooDear,
        reason: 'Not enough coin',
      }) +
      `</div></div>`;
  } else {
    improveBody += `<div class="gloss">The Kurosawa name stands proud again — a house risen. Higher works are a tale for another season.</div>`;
  }
  parts.push(box(D.COPY.estateHeader, improveBody));

  // house reopens — locked rooms
  const rooms = D.HOUSE_ROOMS.map(
    (r) =>
      `<div class="silhouette"><span class="lock">◇</span><span>${esc(r.label)}</span><span class="lock-rung">${esc(r.lockRung)}</span></div>`,
  ).join('');
  parts.push(box(D.COPY.houseReopens, `<div class="stack">${rooms}</div>`));

  // house standing teaser (R3)
  if (sel.isUnlocked(s, 'panel-house-influence')) {
    const hi = D.HOUSE_INFLUENCE;
    const sil = Array.from({ length: hi.silhouetteRows })
      .map(() => `<div class="silhouette"><span class="lock">◆</span><span>————</span></div>`)
      .join('');
    parts.push(
      box(
        hi.header,
        `<div class="gloss">${esc(hi.blurb)}</div><div class="stack">${sil}</div>` +
          `<div class="locked-foot">${esc(hi.lockedFoot)}</div>`,
      ),
    );
  }
  return parts.join('');
}

// ── INVENTORY tab ────────────────────────────────────────────────────────────
function inventoryTab(s) {
  const sh = D.STOREHOUSE;
  if (s.location !== 'kura') {
    return box(sh.header, `<div class="empty-hint">${esc(sh.offNodeBlurb)}</div>`);
  }
  const carried = D.COPY.carriedLine(
    formatCoin(s.resources.coin),
    s.resources.rice,
    formatCoin(s.banked.coin),
    s.banked.rice,
  );
  const btns =
    `<button class="bank-btn" data-act="deposit" data-what="coin" ${s.resources.coin ? '' : 'disabled'}>${esc(D.COPY.storeAllCoin)}</button>` +
    `<button class="bank-btn" data-act="withdraw" data-what="coin" ${s.banked.coin ? '' : 'disabled'}>${esc(D.COPY.withdrawAllCoin)}</button>` +
    `<button class="bank-btn" data-act="deposit" data-what="rice" ${s.resources.rice ? '' : 'disabled'}>${esc(D.COPY.storeAllRice)}</button>` +
    `<button class="bank-btn" data-act="withdraw" data-what="rice" ${s.banked.rice ? '' : 'disabled'}>${esc(D.COPY.withdrawAllRice)}</button>`;
  return box(
    sh.header,
    `<div class="gloss">${esc(sh.blurb)}</div>` +
      `<div class="kv-line tabnums">${esc(carried)}</div>` +
      `<div class="bank-btns">${btns}</div>`,
  );
}

// ── CHARACTER tab ────────────────────────────────────────────────────────────
function characterTab(s) {
  const parts = [];

  // skills
  const skillRows = D.SKILLS.filter((sk) => {
    const st = s.skills[sk.id];
    if (sk.id === 'conditioning') return true;
    return st && (st.xp > 0 || st.level > 1);
  })
    .map((sk) => {
      const st = s.skills[sk.id];
      const need = 40 + st.level * 30;
      const p = pct(st.xp, need);
      return (
        `<div class="card"><div class="c-head"><span class="c-name">${esc(sk.label)}</span>` +
        `<span class="c-lv">Lv ${st.level}</span></div>` +
        `<div class="c-blurb">${esc(sk.blurb)}</div>` +
        `<div class="c-hint">+${D.SKILL_YIELD_PER_LEVEL}% yield / level</div>` +
        `<div class="meter gold" style="height:7px;margin-top:6px"><i style="--fill:${p}%"></i></div></div>`
      );
    })
    .join('');
  parts.push(box('Skills', skillRows || '<div class="empty-hint">No skills practised yet.</div>'));

  // training (R3)
  if (sel.isUnlocked(s, 'readout-combat-level')) {
    const pts = s.character.attributePoints;
    const rows = D.ATTRS.map((a) => {
      const val = s.character.attrs[a.id];
      return (
        `<div class="attr-row"><span class="a-label">${esc(a.label)}</span>` +
        `<span class="a-name">${esc(a.name)}<small>${esc(a.gloss)}</small></span>` +
        `<span class="a-val tabnums">${val}</span>` +
        `<button class="a-plus" data-act="spend_attribute" data-attr="${a.id}" ${pts > 0 ? '' : 'disabled'}>+</button></div>`
      );
    }).join('');
    parts.push(
      box(
        D.COPY.trainingHeader,
        `<div class="subhead" style="color:var(--gold)">${esc(D.COPY.trainingPoints(pts))}</div>${rows}`,
      ),
    );
  }

  // bestiary (R3)
  if (sel.isUnlocked(s, 'panel-bestiary')) {
    const entries = sel.bestiary(s);
    const facedN = entries.filter((e) => e.faced).length;
    const cards = entries
      .map((e) => {
        if (!e.faced) {
          return (
            `<div class="card"><div class="c-head"><span class="c-name" style="color:var(--silver-faint)">${esc(D.COPY.bestiaryUnknown)}</span></div>` +
            `<div class="c-blurb">${esc(D.COPY.bestiaryNotFaced)}</div></div>`
          );
        }
        const wr = sel.winRate(s, e.mob);
        const band = sel.winBand(wr);
        return (
          `<div class="card"><div class="c-head"><span class="c-name">${esc(e.mob.label)}</span>` +
          `<span class="pip ${band.pip}">${band.label} · ${wr}%</span></div>` +
          `<div class="c-blurb">${esc(e.mob.blurb)}</div>` +
          `<div class="c-hint">Tell — ${esc(e.mob.tell)}</div>` +
          `<div class="c-hint">Haunts — ${esc(e.mob.haunts)}</div></div>`
        );
      })
      .join('');
    parts.push(
      box(
        D.COPY.bestiaryHeader,
        `<div class="gloss">${esc(D.COPY.bestiaryCount(facedN, entries.length))}</div>${cards}`,
      ),
    );
  }

  // undertakings (R3)
  if (sel.isUnlocked(s, 'tab-combat')) {
    const cards = D.QUESTS.map((q) => {
      const state = sel.questState(s, q);
      const done = s.quests.progress[q.id] ?? [];
      const steps = q.steps
        .map((st) => {
          const isDone = done.includes(st.id);
          return `<li class="${isDone ? 'done' : ''}"><span class="st-mark">${isDone ? '◆' : '◇'}</span>${esc(st.label)}</li>`;
        })
        .join('');
      let action;
      if (state === 'completed') action = `<div class="c-hint" style="color:var(--body-stam)">✓ Completed</div>`;
      else if (state === 'accepted') action = `<div class="c-hint" style="color:var(--gold)">Undertaken — in progress</div>`;
      else
        action = `<button class="move-btn" data-act="accept_quest" data-id="${q.id}" style="margin-top:6px">${esc(D.COPY.takeThisOn)}</button>`;
      return (
        `<div class="card"><div class="c-head"><span class="badge">${esc(q.kind)}</span>` +
        `<span class="c-name">${esc(q.title)}</span></div>` +
        `<div class="c-blurb">${esc(q.blurb)}</div>` +
        `<ul class="quest-steps">${steps}</ul>` +
        `<div class="c-hint">${esc(D.COPY.reward(formatCoin(q.rewardCoin)))}</div>${action}</div>`
      );
    }).join('');
    parts.push(box(D.QUESTS_HEADER, `<div class="gloss">${esc(D.QUESTS_BLURB)}</div>${cards}`));
  }

  return parts.join('');
}

// ── COMBAT tab ───────────────────────────────────────────────────────────────
function combatTab(s) {
  const parts = [];
  const need = sel.combatXpNeeded(s);
  const p = pct(s.character.combatXp, need);
  parts.push(
    box(
      'Combat',
      `<div class="row-between"><span class="lad-title" style="font-size:15px">${esc(D.COPY.combatLevel(s.character.level))}</span>` +
        `<span class="rh-into tabnums">${s.character.combatXp} / ${need} xp</span></div>` +
        `<div class="meter gold" style="height:9px;margin-top:8px"><i style="--fill:${p}%"></i></div>`,
    ),
  );

  // weapon
  const w = D.WEAPONS.find((x) => x.id === s.equippedWeapon);
  parts.push(
    box(
      'The weapon',
      `<div class="card"><div class="c-head"><span class="c-name">${esc(w.label)}</span>` +
        `<span class="c-lv">${esc(w.archetype)}</span></div>` +
        `<div class="c-blurb">${esc(w.blurb)}</div></div>`,
    ),
  );

  // the watch
  const foes = sel.foesHere(s);
  let watchBody;
  if (!foes.length) {
    watchBody = `<div class="empty-hint">${esc(D.COPY.watchEmpty)}</div>`;
  } else {
    watchBody = foes
      .map((m) => {
        const faced = s.bestiaryFaced.includes(m.id);
        const wr = sel.winRate(s, m);
        const band = sel.winBand(wr);
        const name = faced ? m.label : D.COPY.bestiaryUnknown;
        const isAuto = s.autoCombat === m.id;
        return (
          `<div class="card"><div class="c-head"><span class="c-name">${esc(name)}</span>` +
          `<span class="pip ${band.pip}">${band.label} · ${wr}%</span></div>` +
          `<div class="c-blurb">${esc(m.blurb)}</div>` +
          `<div class="bank-btns">` +
          `<button class="cta" style="font-size:13px;padding:8px 14px;width:auto" data-act="fight" data-mob-id="${m.id}">${esc(D.COPY.fight)}</button>` +
          `<button class="auto-pill ${isAuto && !s.autoCombatRetreat ? 'on' : ''}" data-act="set_auto_combat" data-mob-id="${isAuto && !s.autoCombatRetreat ? '' : m.id}" data-retreat="">${esc(D.COPY.autoToEnd)}</button>` +
          `<button class="auto-pill ${isAuto && s.autoCombatRetreat ? 'on' : ''}" data-act="set_auto_combat" data-mob-id="${isAuto && s.autoCombatRetreat ? '' : m.id}" data-retreat="1">${esc(D.COPY.autoFlee)}</button>` +
          `</div></div>`
        );
      })
      .join('');
  }
  parts.push(box(D.COPY.watchHeader, watchBody));

  return parts.join('');
}

// ── the log ──────────────────────────────────────────────────────────────────
function logHTML(s) {
  const lines = sel.logView(s, logFilter);
  const linesHTML =
    lines.length === 0
      ? `<div class="empty-hint">Nothing on this channel yet.</div>`
      : lines
          .map((l) => {
            const bullet = D.CHANNEL_BULLET[l.channel];
            let text = l.text;
            if (bullet && text.startsWith(bullet)) text = text.slice(bullet.length).replace(/^\s+/, '');
            const vClass = l.voice ? `v-${l.voice}` : '';
            const speaker = l.speaker
              ? `<span class="speaker ${vClass}">${esc(l.speaker)}</span>`
              : '';
            const count = l.count > 1 ? `<span class="count tabnums">×${l.count}</span>` : '';
            const bulletHTML = bullet ? `<span class="lb" aria-hidden="true">${bullet}</span>` : '';
            const fresh = l.id > logNewThreshold ? ' is-new' : '';
            return (
              `<div class="log-line ${l.channel}${fresh}">${bulletHTML}` +
              `<span class="lt ${l.voice ? vClass : ''}">${speaker}${esc(text)}${count}</span></div>`
            );
          })
          .join('');

  const filters = D.LOG_FILTERS.map(
    (f) =>
      `<button class="filt ${f === logFilter ? 'active' : ''}" data-act="set_filter" data-filter="${f}">${esc(D.LOG_FILTER_LABELS[f])}</button>`,
  ).join('');

  // .log-open + .log-toggle are mobile-only (toggle is display:none in base CSS;
  // .log-open is unstyled outside the ≤920px breakpoint).
  return (
    `<section class="log${logOpen ? ' log-open' : ''}">` +
    `<div class="log-head">${crest()}<span class="lh-title">${esc(D.LOG_HEADER)}</span>` +
    `<button class="log-toggle" data-act="toggle_log" aria-expanded="${logOpen}" aria-label="${logOpen ? 'Collapse the log' : 'Expand the log'}"></button></div>` +
    `<div class="log-lines" id="logLines">${linesHTML}</div>` +
    `<div class="log-filters">${filters}</div></section>`
  );
}

// ── full-screen moments ──────────────────────────────────────────────────────
function coldOpenHTML() {
  const c = D.COLD_OPEN;
  return (
    `<div class="overlay coldopen">` +
    crest('co-crest') +
    `<h1 class="co-title">${esc(c.title)}</h1>` +
    `<div class="co-sub">${esc(c.subtitle)}</div>` +
    `<p class="co-lede">${esc(c.lede)}</p>` +
    `<div class="co-verb"><button class="co-verb-btn" data-act="open_eyes">${esc(c.verb)}</button></div>` +
    `</div>`
  );
}

function vnHTML(s) {
  const vn = s.vn;
  const scene = vn.kind === 'intro' ? D.INTRO_SCENES[vn.sceneIndex] : D.RUNG_BEATS[vn.target];
  const shown = scene.greeting.slice(0, vn.shown);

  // top matter: dream "memory" scenes get a floating line
  let topmatter = '';
  if (scene.plateLabel === 'A memory') {
    topmatter = `<div class="vn-topmatter"><div class="vn-memory">${esc(scene.greeting[0].text)}</div></div>`;
  } else {
    topmatter = `<div class="vn-topmatter"></div>`;
  }

  const plateName = scene.speaker || scene.plateLabel || 'A voice';
  const seal = scene.sealText || '·';
  const sceneVclass = `v-${scene.voice}`;

  // lines
  const linesHTML = shown
    .map((ln) => {
      const sp = ln.speaker ? `<span class="vl-speaker v-${ln.voice}">${esc(ln.speaker)}</span>` : '';
      return `<div class="vn-line v-${ln.voice}">${sp}${esc(ln.text)}</div>`;
    })
    .join('');

  let interact = '';
  const moreGreeting = vn.shown < scene.greeting.length;

  // NOTE: the continue hint is a real <button> — iOS WebKit does not
  // synthesize click from taps on non-interactive elements (spec §4.2).
  if (moreGreeting) {
    interact = `<button class="vn-hint" data-act="vn_next">▽  continue</button>`;
  } else if (vn.phase === 'greeting' || vn.phase === 'ask') {
    // ask hub (if topics) then done
    if (scene.topics.length) {
      const asked = vn.asked;
      const topicBtns = scene.topics
        .map((t) => {
          const isAsked = asked.includes(t.id);
          const gated = t.gateTopic && !asked.includes(t.gateTopic);
          const answerHTML =
            isAsked && t.answer
              ? `<div class="vn-line v-${t.answer[0].voice}" style="margin-top:4px;font-size:14px">${esc(t.answer[0].text)}</div>`
              : '';
          return (
            `<button class="vn-choice ${isAsked ? 'asked' : ''} ${gated ? 'gated' : ''}" ${gated || isAsked ? '' : `data-act="vn_ask" data-topic-id="${t.id}"`}>` +
            crest('c-cursor') +
            esc(t.label) +
            `</button>${answerHTML}`
          );
        })
        .join('');
      interact =
        `<div class="vn-choices"><div class="vn-prompt">Ask what you will —</div>${topicBtns}` +
        `<button class="btn-continue" data-act="vn_done_asking" style="align-self:flex-end;margin-top:12px">${esc(D.COPY.doneQuestioning)}</button></div>`;
    } else {
      interact = `<button class="vn-hint" data-act="vn_next">▽  continue</button>`;
    }
  } else if (vn.phase === 'decide') {
    const opts = scene.decision.options
      .map(
        (o) =>
          `<button class="vn-choice" data-act="vn_choose" data-option-id="${o.id}">${crest('c-cursor')}${esc(o.label)}</button>`,
      )
      .join('');
    interact = `<div class="vn-choices"><div class="vn-prompt">${esc(scene.decision.prompt)}</div>${opts}</div>`;
  } else if (vn.phase === 'resolved') {
    const opt = scene.decision.options.find((o) => o.id === vn.picked);
    let perk = '';
    if (opt.perk) {
      const stat = opt.stat
        ? `+1 ${opt.stat.up.toUpperCase()} · −1 ${opt.stat.down.toUpperCase()}`
        : '';
      perk =
        `<div class="vn-perk"><div class="pk-tag">${esc(D.COPY.perkTag)}</div>` +
        `<div class="pk-name">${esc(opt.perk.name)}</div>` +
        `<div class="pk-desc">${esc(opt.perk.desc)}</div>` +
        (stat ? `<div class="pk-stat tabnums">${esc(stat)}</div>` : '') +
        `</div>`;
    } else if (opt.statBonus) {
      perk =
        `<div class="vn-perk"><div class="pk-tag">${esc(D.COPY.perkTag)}</div>` +
        `<div class="pk-desc">${esc(opt.statBonus.note)}</div></div>`;
    }
    const say = `<div class="vn-line v-player"><span class="vl-speaker v-player">You</span>${esc(opt.say)}</div>`;
    const react = `<div class="vn-line ${sceneVclass}"><span class="vl-speaker v-${scene.voice}">${esc(scene.speaker ?? '')}</span>${esc(opt.react)}</div>`;
    interact =
      `<div class="vn-choices">${say}${react}${perk}` +
      `<div class="vn-continue"><button class="btn-continue" data-act="vn_continue">${esc(D.COPY.continueBtn)}</button></div></div>`;
  }

  return (
    `<div class="overlay vn">` +
    `<div class="vn-scene">${topmatter}` +
    `<div class="vn-box">` +
    `<div class="vn-plate"><span class="vp-seal"><span>${esc(seal)}</span></span><span class="vp-name v-${scene.voice}">${esc(plateName)}</span></div>` +
    `<div class="vn-lines">${linesHTML}</div>${interact}</div></div></div>`
  );
}

function ceremonyHTML(s, anim) {
  const c = s.ceremony;
  return (
    `<div class="overlay ceremony${anim ? ' anim' : ''}">` +
    crest('ce-crest') +
    `<div class="ce-promoted">${esc(D.COPY.promoted)}</div>` +
    `<div class="ce-rule"></div>` +
    `<div class="ce-title">${esc(c.title)}</div>` +
    `<button class="ce-dismiss" data-act="dismiss_ceremony">Press on ▸</button>` +
    `</div>`
  );
}

// ── stage strip ──────────────────────────────────────────────────────────────
function stageStripHTML(s) {
  const stages = D.STAGES.map(
    (st) =>
      `<button class="ss-btn ${st.id === s.stageId ? 'active' : ''}" data-act="set_stage" data-stage="${st.id}" title="${esc(st.blurb)}">${esc(st.label.split(' · ')[0])}</button>`,
  ).join('');
  const moments =
    `<button class="ss-btn moment" data-act="moment" data-name="intro">▷ Intro</button>` +
    `<button class="ss-btn moment" data-act="moment" data-name="wolf">▷ Wolf</button>` +
    `<button class="ss-btn moment" data-act="moment" data-name="fight">▷ Fight</button>` +
    `<button class="ss-btn moment" data-act="moment" data-name="rungup">▷ Rung-up</button>`;
  // .open + .ss-toggle are mobile-only (toggle is display:none in base CSS;
  // .open is unstyled outside the ≤920px breakpoint).
  return (
    `<div class="stage-strip${stripOpen ? ' open' : ''}"><span class="ss-label">Stage</span>${stages}` +
    `<span class="ss-sep"></span><span class="ss-label">Moment</span>${moments}` +
    `<button class="ss-toggle" data-act="toggle_strip" aria-expanded="${stripOpen}" aria-label="Stage and moment selector">◈</button></div>`
  );
}

// ── top-level render ─────────────────────────────────────────────────────────
function tabContent(s) {
  switch (activeTab) {
    case 'work':
      return workTab(s);
    case 'map':
      return mapTab(s);
    case 'estate':
      return estateTab(s);
    case 'inventory':
      return inventoryTab(s);
    case 'character':
      return characterTab(s);
    case 'combat':
      return combatTab(s);
    default:
      return workTab(s);
  }
}

function render(s) {
  // preserve log scroll intent
  const prevLog = document.getElementById('logLines');
  if (prevLog) {
    logAtBottom =
      prevLog.scrollHeight - prevLog.scrollTop - prevLog.clientHeight < 24;
  }
  // preserve the center pane's scroll across tick re-renders (same contract as
  // the log): a scrolled pane must not snap to top every 480ms. Restored only
  // when the view is structurally unchanged — a tab/stage switch lands at top.
  const prevCenter = app.querySelector('.center');
  const centerScroll = prevCenter ? prevCenter.scrollTop : 0;

  // structural identity — box/rail/ceremony entry animation plays only when this
  // changes, so the 480ms tick re-render never restarts them.
  const navOn = sel.navVisible(s);
  const sig = `${s.stageId}|${s.phase}|${activeTab}|${navOn}|${s.ceremony ? s.ceremony.rank : ''}`;
  const structuralAnim = sig !== lastViewSig;
  lastViewSig = sig;

  // log lines newer than what we've shown get the one-shot arrival animation
  logNewThreshold = lastLogMaxId;

  // full-screen cold open (no tick churn in this phase)
  if (s.phase === 'cold-open') {
    app.innerHTML = coldOpenHTML() + stageStripHTML(s);
    afterRender(s);
    return;
  }

  // ensure active tab valid
  const vis = sel.visibleTabs(s).map((t) => t.id);
  if (!vis.includes(activeTab)) activeTab = 'work';

  const shell =
    `${vitalsHTML(s)}` +
    `<div class="stage ${navOn ? '' : 'no-nav'}">` +
    (navOn ? railHTML(s, structuralAnim) : '') +
    `<div class="center${structuralAnim ? ' anim' : ''}">${tabContent(s)}</div>` +
    logHTML(s) +
    `</div>`;

  let overlay = '';
  if (s.phase === 'vn' && s.vn) overlay = vnHTML(s);
  if (s.ceremony) overlay = ceremonyHTML(s, structuralAnim);

  app.innerHTML = shell + overlay + stageStripHTML(s);

  // restore log scroll
  const logEl = document.getElementById('logLines');
  if (logEl && logAtBottom) logEl.scrollTop = logEl.scrollHeight;

  // restore center scroll (structure unchanged only)
  if (!structuralAnim && centerScroll) {
    const centerEl = app.querySelector('.center');
    if (centerEl) centerEl.scrollTop = centerScroll;
  }

  afterRender(s);
}

function afterRender(s) {
  // advance the log arrival threshold so already-shown lines don't re-animate
  const maxId = s.log.reduce((m, l) => Math.max(m, l.id), lastLogMaxId);
  lastLogMaxId = maxId;
  syncPrev(s);
}

function syncPrev(s) {
  prev = {
    rice: formatKMB(s.resources.rice),
    coin: formatCoin(s.resources.coin),
    wood: formatKMB(s.resources.wood),
    sansai: formatKMB(s.resources.sansai),
    meter: s.rungMeter,
  };
}

// ── moments (documented demo hack lives here, ONE place) ─────────────────────
function runMoment(name) {
  if (name === 'intro') {
    eng.setStage('cold-open');
    return;
  }
  if (name === 'wolf') {
    // Jump to R2 at the kura and surface the dramatic wolf CTA — the player
    // (or QA) throws the punch by clicking "Face the wolf".
    eng.setStage('R2');
    activeTab = 'work';
    return;
  }
  if (name === 'fight') {
    eng.setStage('R3');
    activeTab = 'combat';
    eng.dispatch({ type: 'move_to', node: 'gate-forecourt' });
    const foes = sel.foesHere(eng.state);
    if (foes[0]) eng.dispatch({ type: 'fight', mobId: foes[0].id });
    return;
  }
  if (name === 'rungup') {
    // DOCUMENTED DEMO HACK (spec §2): force-fill the meter + satisfy the
    // current rung's story gate, then run the rung beat. Kept to this one spot.
    let next = sel.nextRung(eng.state);
    if (!next || !next.unlocks) {
      eng.setStage('R2'); // R3 is terminal for the demo — drop to a rung that can rise
      activeTab = 'work';
    }
    const st = eng.state;
    const cur = sel.rung(st);
    if (cur.storyGateFlag) st.flags[cur.storyGateFlag] = true;
    st.rungMeter = 99999;
    eng.dispatch({ type: 'begin_rung_beat' });
  }
}

// ── event delegation ─────────────────────────────────────────────────────────
app.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;

  // UI-only
  if (act === 'set_tab') {
    activeTab = el.dataset.tab;
    render(eng.state);
    return;
  }
  if (act === 'set_filter') {
    logFilter = el.dataset.filter;
    render(eng.state);
    return;
  }
  if (act === 'set_stage') {
    eng.setStage(el.dataset.stage);
    return;
  }
  if (act === 'moment') {
    runMoment(el.dataset.name);
    return;
  }
  if (act === 'toggle_log') {
    logOpen = !logOpen;
    render(eng.state);
    return;
  }
  if (act === 'toggle_strip') {
    stripOpen = !stripOpen;
    render(eng.state);
    return;
  }

  // engine intents
  const intent = { type: act };
  const d = el.dataset;
  if (d.id !== undefined) intent.id = d.id;
  if (d.node !== undefined) intent.node = d.node;
  if (d.personId !== undefined) intent.personId = d.personId;
  if (d.topicId !== undefined) intent.topicId = d.topicId;
  if (d.optionId !== undefined) intent.optionId = d.optionId;
  if (d.what !== undefined) intent.what = d.what;
  if (d.attr !== undefined) intent.attr = d.attr;
  if (d.mobId !== undefined) intent.mobId = d.mobId || null;
  if (d.retreat !== undefined) intent.retreat = d.retreat === '1';
  if (act === 'set_auto_rake') intent.on = d.on === '1';

  eng.dispatch(intent);
});

// keyboard: Enter/Space on non-button hint elements
app.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const el = e.target.closest('[data-act]');
  if (el && el.tagName !== 'BUTTON') {
    e.preventDefault();
    el.click();
  }
});

eng.subscribe((s) => render(s));

// QA hook (repo convention: playtest via code) — lets a headless driver read
// and stage engine state. No render path reads this; UI behavior is unchanged.
window.__moonlit = { eng, sel };
