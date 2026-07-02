// ui-demos/shared/engine.js — the mock game engine behind every remaster
// variant. Staged R0–R3 snapshots + live verbs: real numbers move, log lines
// append, meters fill, fights resolve, rung-ups play — but no real balance
// sim and no persistence. One engine per page.
//
// API:
//   const eng = createEngine('R1');
//   eng.state                      // read directly (never mutate)
//   eng.dispatch({type, ...})      // all mutations
//   eng.subscribe(fn)              // fn(state, events[]) after every change
//   eng.setStage('R2')            // jump to a staged snapshot
//   sel.*                          // pure selectors (import { sel })
//
// Dispatch types (T0 R0–R3 scope only):
//   open_eyes · vn_next · vn_ask{topicId} · vn_done_asking ·
//   vn_choose{optionId} · vn_continue ·
//   rake_rice · rest · do_activity{id} · set_auto_rake{on} · set_auto{id|null} ·
//   move_to{node} · talk{personId} · leave ·
//   buy_item{id} · sell_rice ·
//   deposit{what:'coin'|'rice'} · withdraw{what} ·
//   improve_estate · cook_meal · eat_rice · spend_attribute{attr} ·
//   face_wolf · fight{mobId} · set_auto_combat{mobId|null, retreat} ·
//   accept_quest{id} · begin_rung_beat · dismiss_ceremony

import * as D from './data.js';
import { formatCoin } from './format.js';

const TICK_MS = 480; // mirrors AUTO_REPEAT_MS

// ── selectors (pure) ─────────────────────────────────────────────────────────

export const sel = {
  seasonOf(day) {
    return D.SEASONS[Math.floor(day / D.DAYS_PER_SEASON) % 4];
  },
  yearOf(day) {
    return 1 + Math.floor(day / (D.DAYS_PER_SEASON * 4));
  },
  dayOfSeason(day) {
    return (day % D.DAYS_PER_SEASON) + 1;
  },
  hpMax(s) {
    return D.BALANCE.HP_BASE + D.BALANCE.HP_PER_LEVEL * s.character.level +
      D.BALANCE.STR_HP * s.character.attrs.str;
  },
  satietyMax(s) {
    const estateBonus = D.ESTATE_STAGES.slice(0, s.estateStage)
      .reduce((a, e) => a + e.satietyMaxBonus, 0);
    return D.BALANCE.SATIETY_BASE + estateBonus;
  },
  yieldMult(s) {
    const estate = D.ESTATE_STAGES.slice(0, s.estateStage)
      .reduce((a, e) => a + e.yieldBonusNum, 0);
    return 1 + estate / 100;
  },
  isUnlocked(s, surface) {
    return s.unlocked.includes(surface);
  },
  visibleTabs(s) {
    return D.TABS.filter((t) => !t.gate || s.unlocked.includes(t.gate));
  },
  navVisible(s) {
    return sel.visibleTabs(s).length >= 2;
  },
  rung(s) {
    return D.RUNGS.find((r) => r.id === s.rung);
  },
  nextRung(s) {
    const i = D.RUNGS.findIndex((r) => r.id === s.rung);
    return D.RUNGS[i + 1] ?? null;
  },
  storyGateMet(s) {
    // The AND-gate reads the CURRENT rung's story flag (ranks.ts): R1 needs
    // `farmed` to rise, R2 needs `first-fight-survived`, R0 is always ready.
    const cur = sel.rung(s);
    const next = sel.nextRung(s);
    if (!next || !next.unlocks) return false; // R4+ = out of demo scope
    return !cur.storyGateFlag || !!s.flags[cur.storyGateFlag];
  },
  meterFull(s) {
    const r = sel.rung(s);
    return s.rungMeter >= r.threshold;
  },
  summonsReady(s) {
    return sel.meterFull(s) && sel.storyGateMet(s) && !s.vn && !s.ceremony;
  },
  laboursHere(s) {
    return D.ACTIVITIES.filter(
      (a) => a.area === s.location && s.unlocked.includes(a.surface),
    );
  },
  laboursKnown(s) {
    return D.ACTIVITIES.filter((a) => s.unlocked.includes(a.surface));
  },
  nodeOf(s) {
    return D.MAP_NODES.find((n) => n.id === s.location);
  },
  conditioningLevel(s) {
    return s.skills.conditioning?.level ?? 1;
  },
  reachable(s) {
    const here = sel.nodeOf(s);
    return here.neighbors
      .map((id) => D.MAP_NODES.find((n) => n.id === id))
      .filter((n) => !n.revealFlag || s.unlocked.includes(n.revealFlag))
      .map((n) => ({
        node: n,
        blocked: !!n.dangerRing && sel.conditioningLevel(s) < D.CONDITIONING_GATE_LEVEL,
      }));
  },
  peopleHere(s) {
    return D.PEOPLE.filter(
      (p) => p.node === s.location && s.unlocked.includes(p.presenceFlag),
    );
  },
  foesHere(s) {
    if (!s.unlocked.includes('tab-combat')) return [];
    return D.MOBS.filter((m) => m.area === s.location && !m.scripted);
  },
  winRate(s, mob) {
    // A6 in miniature: the shown forecast uses the same inputs as the fight —
    // a hurt fighter's displayed odds drop for free.
    const hpFrac = s.character.hp / sel.hpMax(s);
    const lvlBonus = (s.character.level - 1) * 8 + (s.character.attrs.str - 5) * 3;
    const raw = (mob.baseWinRate ?? 20) * (0.45 + 0.55 * hpFrac) + lvlBonus;
    return Math.max(2, Math.min(96, Math.round(raw)));
  },
  winBand(pct) {
    return D.WINRATE_BANDS.find((b) => pct >= b.min);
  },
  ricePrice(s) {
    return D.BALANCE.RICE_SELL_PRICE[sel.seasonOf(s.clock.day).id];
  },
  bestiary(s) {
    return D.MOBS.map((m) => ({ mob: m, faced: s.bestiaryFaced.includes(m.id) }));
  },
  combatXpNeeded(s) {
    return 60 + s.character.level * 40;
  },
  staminaRate(s) {
    const frac = s.character.satiety / sel.satietyMax(s);
    return frac >= 0.35 ? 1 : 0.7; // soft throttle, never blocked
  },
  questState(s, q) {
    if (s.quests.completed.includes(q.id)) return 'completed';
    if (s.quests.accepted.includes(q.id)) return 'accepted';
    return 'open';
  },
  logView(s, filter) {
    if (filter === 'now') return s.log.filter((l) => l.ephemeral);
    if (filter === 'all') return s.log.filter((l) => !l.ephemeral);
    return s.log.filter(
      (l) => !l.ephemeral && (D.CHANNEL_FILTERS[l.channel] ?? []).includes(filter),
    );
  },
};

// ── staged snapshots ─────────────────────────────────────────────────────────

const BASE_UNLOCKS = ['verb-rake', 'verb-rest', 'readout-rice'];
const R1_UNLOCKS = [...BASE_UNLOCKS, ...D.RUNGS[1].unlocks];
const R2_UNLOCKS = [...R1_UNLOCKS, ...D.RUNGS[2].unlocks];
const R3_UNLOCKS = [...R2_UNLOCKS, ...D.RUNGS[3].unlocks];

function baseCharacter() {
  return {
    hp: 58, satiety: D.BALANCE.COLD_OPEN_SATIETY, level: 1, combatXp: 0,
    attributePoints: 0,
    attrs: { str: 5, agi: 5, int: 5, spd: 5, luck: 5 },
  };
}

let logSeq = 0;
function L(channel, text, extra = {}) {
  return { id: ++logSeq, channel, text, count: 1, ...extra };
}

function snapshot(stageId) {
  const common = {
    stageId,
    phase: 'game', // 'cold-open' | 'vn' | 'game'
    vn: null,
    ceremony: null,
    clock: { tick: 0, day: 0 },
    character: baseCharacter(),
    resources: { rice: 0, coin: 0, wood: 0, sansai: 0 },
    banked: { coin: 0, rice: 0 },
    flags: {},
    unlocked: [...BASE_UNLOCKS],
    location: 'kura',
    rung: 'R0',
    rungMeter: 0,
    estateStage: 0,
    autoRake: false,
    autoActivity: null,
    autoCombat: null,
    autoCombatRetreat: false,
    openPersonId: null,
    marketBought: {},
    quests: { accepted: [], progress: {}, completed: [] },
    skills: {
      farming: { level: 1, xp: 20 },
      foraging: { level: 1, xp: 0 },
      woodcutting: { level: 1, xp: 0 },
      conditioning: { level: 1, xp: 10 },
    },
    bestiaryFaced: [],
    equippedWeapon: 'carrying_pole',
    log: [],
  };

  switch (stageId) {
    case 'cold-open':
      return { ...common, phase: 'cold-open', unlocked: [] };

    case 'R0':
      return {
        ...common,
        flags: { awake: true, raked: true },
        resources: { ...common.resources, rice: 27 },
        rungMeter: 260,
        log: [
          L('narration', D.COLD_OPEN.wake),
          L('narration', D.COLD_OPEN.riceReveal),
          L('reward', D.COLD_OPEN.rakeLine(3), { count: 9 }),
          L('narration', D.COLD_OPEN.restAct),
        ],
      };

    case 'R1':
      return {
        ...common,
        rung: 'R1',
        unlocked: [...R1_UNLOCKS],
        flags: { awake: true, raked: true, 'rank-r1': true },
        location: 'gate-forecourt',
        clock: { tick: 9, day: 6 },
        rungMeter: 740,
        resources: { ...common.resources, rice: 62, coin: 38 },
        banked: { coin: 0, rice: 20 },
        character: { ...baseCharacter(), satiety: 82 },
        log: [
          L('milestone', 'Rank ↑ — Kept hand. The house keeps you now.'),
          L('narration', 'Dawn at the gate. The forecourt is swept clean — your doing.'),
          L('reward', 'Haul stores at the forecourt. (+2 coin)', { count: 12 }),
          L('narration', D.COLD_OPEN.coinReveal),
          L('reward', 'Work the home paddies. (+4 rice)', { count: 8 }),
        ],
      };

    case 'R2':
      return {
        ...common,
        rung: 'R2',
        unlocked: [...R2_UNLOCKS],
        flags: { awake: true, raked: true, farmed: true, 'rank-r1': true, 'rank-r2': true },
        location: 'kura',
        clock: { tick: 14, day: 15 },
        rungMeter: 1180,
        resources: { rice: 148, coin: 104, wood: 21, sansai: 9 },
        banked: { coin: 120, rice: 60 },
        estateStage: 1,
        character: { ...baseCharacter(), hp: 51, satiety: 74 },
        skills: {
          farming: { level: 3, xp: 40 },
          foraging: { level: 1, xp: 15 },
          woodcutting: { level: 2, xp: 22 },
          conditioning: { level: 2, xp: 8 },
        },
        log: [
          L('milestone', 'Rank ↑ — Trusted hand. The woodlot and the near hill are yours to work.'),
          L('narration', "A wolf's been at the grain stores in the night. Someone must face it — and there is no one else to send."),
          L('reward', 'Cut wood at the woodlot edge. (+3 wood)', { count: 7 }),
          L('reward', 'Forage the near satoyama. (+2 sansai, +1 coin)', { count: 4 }),
          L('narration', "The kura's door-bar hangs mended — the house's first surplus, well spent. (U1 · Stabilising)"),
        ],
      };

    case 'R3':
    default:
      return {
        ...common,
        rung: 'R3',
        unlocked: [...R3_UNLOCKS],
        flags: {
          awake: true, raked: true, farmed: true, 'first-fight-survived': true,
          'rank-r1': true, 'rank-r2': true, 'rank-r3': true,
        },
        location: 'drill-yard',
        clock: { tick: 4, day: 26 },
        rungMeter: 620,
        resources: { rice: 210, coin: 187, wood: 34, sansai: 16 },
        banked: { coin: 300, rice: 110 },
        estateStage: 1,
        character: {
          ...baseCharacter(), hp: 47, satiety: 88, level: 1,
          combatXp: 34, attributePoints: 2,
        },
        skills: {
          farming: { level: 3, xp: 62 },
          foraging: { level: 2, xp: 30 },
          woodcutting: { level: 2, xp: 55 },
          conditioning: { level: 2, xp: 40 },
        },
        bestiaryFaced: ['wolf_scripted'],
        log: [
          L('combat', 'The wolf is down. You are shaking, and alive, and the stores are whole.'),
          L('milestone', 'Rank ↑ — Gate-watch. A weapon, a yard to train in, and the estate\'s defence on your shoulders.'),
          L('narration', 'Kihei throws you a wooden sword without a word of greeting.'),
          L('reward', 'Haul stores at the forecourt. (+2 coin)', { count: 5 }),
        ],
      };
  }
}

// ── engine ───────────────────────────────────────────────────────────────────

export function createEngine(stageId = 'R0') {
  let state = snapshot(stageId);
  const listeners = new Set();
  let events = [];

  function emit(type, payload = {}) {
    events.push({ type, ...payload });
  }

  function notify() {
    const evs = events;
    events = [];
    for (const fn of listeners) fn(state, evs);
  }

  // — log helpers (coalesce repeated reward lines like the real renderer) —
  function log(channel, text, extra = {}) {
    const last = state.log[state.log.length - 1];
    if (last && last.text === text && last.channel === channel && !extra.voice) {
      last.count += 1;
      last.id = ++logSeq; // refresh so UIs see a change
      return;
    }
    state.log.push(L(channel, text, extra));
    if (state.log.length > 220) state.log.splice(0, state.log.length - 220);
  }
  function now(text) {
    state.log.push(L('narration', text, { ephemeral: true, at: Date.now() }));
  }

  // — economy/act helpers —
  function gain(res, n) {
    state.resources[res] = Math.max(0, (state.resources[res] ?? 0) + n);
  }
  function spendSatiety(n) {
    state.character.satiety = Math.max(0, state.character.satiety - n);
  }
  function meterFeed(actId) {
    const r = sel.rung(state);
    const eligible =
      (r.id === 'R0' && actId === 'rake_rice') ||
      (r.id !== 'R0' && actId !== 'rake_rice' && actId !== 'rest');
    if (eligible) state.rungMeter += D.RUNG_POINTS_PER_ACT;
  }
  function skillXp(skillId, xp) {
    const sk = state.skills[skillId];
    if (!sk) return;
    sk.xp += xp;
    const need = 40 + sk.level * 30;
    if (sk.xp >= need) {
      sk.xp -= need;
      sk.level += 1;
      log('milestone', `${D.SKILLS.find((s) => s.id === skillId).label} rises to Lv ${sk.level}.`);
    }
  }

  function doLabour(act) {
    const mult = sel.yieldMult(state) * sel.staminaRate(state);
    const gained = {};
    for (const [res, n] of Object.entries(act.yields)) {
      const g = Math.max(1, Math.round(n * mult));
      gain(res, g);
      gained[res] = g;
    }
    spendSatiety(act.satietyCost);
    skillXp(act.skill, act.xp);
    meterFeed(act.id);
    const parts = Object.entries(gained).map(([r, n]) => `+${n} ${r}`).join(', ');
    log('reward', `${act.label}. (${parts})`);
    advanceClock();
  }

  function advanceClock() {
    state.clock.tick += 1;
    if (state.clock.tick >= D.TICKS_PER_DAY) {
      state.clock.tick = 0;
      state.clock.day += 1;
    }
  }

  function questAdvance(event) {
    for (const qid of state.quests.accepted) {
      const q = D.QUESTS.find((x) => x.id === qid);
      const done = state.quests.progress[qid] ?? [];
      const fresh = q.steps.filter((st) => st.event === event && !done.includes(st.id));
      if (!fresh.length) continue;
      state.quests.progress[qid] = [...done, ...fresh.map((st) => st.id)];
      for (const st of fresh) log('milestone', `${q.title} — ${st.label}: done.`);
      if (q.steps.every((st) => state.quests.progress[qid].includes(st.id))) {
        state.quests.completed.push(qid);
        state.quests.accepted = state.quests.accepted.filter((x) => x !== qid);
        gain('coin', q.rewardCoin);
        log('milestone', q.rewardLine);
        emit('quest-complete', { questId: qid });
      }
    }
  }

  // — combat —
  function fight(mob) {
    const pct = sel.winRate(state, mob);
    const win = Math.random() * 100 < pct;
    const weapon = D.WEAPONS.find((w) => w.id === state.equippedWeapon);
    log('combat', `⚔️ You square up to the ${mob.label.toLowerCase()}, ${weapon.label.toLowerCase()} in hand.`);
    const rounds = 2 + Math.floor(Math.random() * 3);
    let hp = state.character.hp;
    for (let i = 0; i < rounds; i++) {
      const youHit = Math.random() < 0.65;
      log('combat', youHit
        ? `Your swing lands — the ${mob.label.toLowerCase()} staggers.`
        : `You swing at empty air — it slips aside.`);
      const itHits = Math.random() < (win ? 0.35 : 0.6);
      if (itHits) {
        const dmg = 3 + mob.level * 3 + Math.floor(Math.random() * 4);
        hp = Math.max(win ? 8 : 4, hp - dmg);
        log('combat', `It answers — teeth and weight. (−${dmg} life)`);
      }
    }
    state.character.hp = hp;
    if (!state.bestiaryFaced.includes(mob.id)) {
      state.bestiaryFaced.push(mob.id);
      log('milestone', `Bestiary — the ${mob.label.toLowerCase()}'s entry is inked.`);
    }
    if (win) {
      state.flags['combat-blooded'] = true;
      if (mob.coinReward > 0) gain('coin', mob.coinReward);
      state.character.combatXp += 10 + mob.level * 6;
      const spoils = mob.coinReward > 0 ? ` (+${mob.coinReward} coin)` : '';
      log('combat', `The ${mob.label.toLowerCase()} breaks and is done.${spoils}`);
      const short = mob.id.includes('monkey') ? 'monkey' : mob.id.includes('wolf') ? 'wolf' : mob.id;
      questAdvance(`kill:${short}`);
      const need = sel.combatXpNeeded(state);
      if (state.character.combatXp >= need) {
        state.character.combatXp -= need;
        state.character.level += 1;
        state.character.attributePoints += 2;
        state.character.hp = Math.min(sel.hpMax(state), state.character.hp + 10);
        log('milestone', `Combat level ${state.character.level}. Two points to spend at Training.`);
        emit('level-up');
      }
    } else {
      const lost = Math.floor(state.resources.coin * D.BALANCE.LOSS_COIN_FRAC);
      if (lost > 0) {
        gain('coin', -lost);
        log('combat', `You come to in the grass, lighter by ${formatCoin(lost)}. What you carry, a lost fight can take.`);
      } else {
        log('combat', 'You come to in the grass, aching. Nothing carried, nothing lost.');
      }
      emit('fight-lost');
    }
    emit('fight-end', { won: win });
  }

  // — VN driver (intro + rung beats share one shape) —
  function vnScene() {
    if (!state.vn) return null;
    return state.vn.kind === 'intro'
      ? D.INTRO_SCENES[state.vn.sceneIndex]
      : D.RUNG_BEATS[state.vn.target];
  }

  function startIntro() {
    state.phase = 'vn';
    state.vn = { kind: 'intro', sceneIndex: 0, shown: 1, asked: [], phase: 'greeting', picked: null };
  }

  function applyPromotion(target) {
    const def = D.RUNGS.find((r) => r.id === target);
    state.rung = target;
    state.rungMeter = 0;
    state.flags[`rank-${target.toLowerCase()}`] = true;
    for (const u of def.unlocks ?? []) {
      if (!state.unlocked.includes(u)) state.unlocked.push(u);
    }
    log('milestone', `Rank ↑ — ${def.title}.`);
    state.ceremony = { type: 'rankup', rank: target, title: def.title };
    emit('rankup', { rank: target, title: def.title });
  }

  // ── the reducer ──
  function dispatch(action) {
    const t = action.type;
    const vn = state.vn;
    const scene = vnScene();

    switch (t) {
      // — cold open / VN —
      case 'open_eyes':
        state.flags.awake = true;
        log('narration', D.COLD_OPEN.wake);
        startIntro();
        break;
      case 'vn_next': {
        if (!vn || !scene) break;
        if (vn.shown < scene.greeting.length) vn.shown += 1;
        else vn.phase = scene.topics.length ? 'ask' : 'decide';
        break;
      }
      case 'vn_ask': {
        if (!vn || !scene) break;
        const topic = scene.topics.find((x) => x.id === action.topicId);
        if (topic && !vn.asked.includes(topic.id)) vn.asked.push(topic.id);
        vn.lastAsk = topic?.id ?? null;
        break;
      }
      case 'vn_done_asking':
        if (vn) vn.phase = 'decide';
        break;
      case 'vn_choose': {
        if (!vn || !scene) break;
        const opt = scene.decision.options.find((o) => o.id === action.optionId);
        if (!opt) break;
        vn.picked = opt.id;
        vn.phase = 'resolved';
        log('narration', opt.say, { voice: 'player', speaker: 'You' });
        log('narration', opt.react, { voice: scene.voice, speaker: scene.speaker ?? undefined });
        if (opt.stat) {
          state.character.attrs[opt.stat.up] += 1;
          state.character.attrs[opt.stat.down] -= 1;
          log('milestone', `Perk unlocked — ${opt.perk.name}: ${opt.perk.desc} (+1 ${opt.stat.up.toUpperCase()} / −1 ${opt.stat.down.toUpperCase()})`);
        }
        if (opt.statBonus) {
          state.character.attrs[opt.statBonus.attr] += opt.statBonus.amount;
          log('milestone', opt.statBonus.note);
        }
        break;
      }
      case 'vn_continue': {
        if (!vn) break;
        if (vn.kind === 'intro') {
          if (vn.sceneIndex + 1 < D.INTRO_SCENES.length) {
            state.vn = { kind: 'intro', sceneIndex: vn.sceneIndex + 1, shown: 1, asked: [], phase: 'greeting', picked: null };
          } else {
            state.vn = null;
            state.phase = 'game';
            state.flags.raked = false;
            // the intro's end grants the R0 floor (the cold-open snapshot
            // starts with unlocked: [], so the gates must be granted here)
            for (const u of BASE_UNLOCKS) {
              if (!state.unlocked.includes(u)) state.unlocked.push(u);
            }
            log('narration', D.COLD_OPEN.riceReveal);
          }
        } else {
          const target = vn.target;
          state.vn = null;
          state.phase = 'game';
          applyPromotion(target);
        }
        break;
      }

      // — work —
      case 'rake_rice': {
        const n = D.BALANCE.RICE_PER_RAKE;
        gain('rice', n);
        state.flags.raked = true;
        spendSatiety(D.BALANCE.SATIETY_PER_ACT);
        meterFeed('rake_rice');
        log('reward', D.COLD_OPEN.rakeLine(n));
        advanceClock();
        break;
      }
      case 'rest':
        state.character.satiety = Math.min(
          sel.satietyMax(state),
          state.character.satiety + D.BALANCE.SATIETY_PER_REST,
        );
        now(D.COLD_OPEN.restAct);
        advanceClock();
        break;
      case 'do_activity': {
        const act = D.ACTIVITIES.find((a) => a.id === action.id);
        if (!act || act.area !== state.location) break;
        if (act.id === 'farm_paddy') state.flags.farmed = true;
        doLabour(act);
        if (act.skill === 'woodcutting') questAdvance('gather:wood');
        break;
      }
      case 'set_auto_rake':
        state.autoRake = !!action.on;
        break;
      case 'set_auto':
        state.autoActivity = action.id ?? null;
        break;

      // — map —
      case 'move_to': {
        const dest = sel.reachable(state).find((r) => r.node.id === action.node);
        if (!dest || dest.blocked) break;
        state.location = action.node;
        state.openPersonId = null;
        now(`You walk to ${dest.node.label.toLowerCase()}.`);
        advanceClock();
        break;
      }
      case 'talk': {
        const p = sel.peopleHere(state).find((x) => x.id === action.personId);
        if (!p) break;
        state.openPersonId = p.id;
        log('narration', p.greeting, { voice: p.voice, speaker: p.name });
        break;
      }
      case 'leave':
        state.openPersonId = null;
        break;

      // — market —
      case 'buy_item': {
        const item = D.MARKET_ITEMS.find((i) => i.id === action.id);
        const bought = state.marketBought[item.id] ?? 0;
        if (!item || state.resources.coin < item.coinCost || bought >= item.stockCap) break;
        gain('coin', -item.coinCost);
        state.marketBought[item.id] = bought + 1;
        const parts = Object.entries(item.grants).map(([r, n]) => `+${n} ${r}`).join(', ');
        for (const [r, n] of Object.entries(item.grants)) gain(r, n);
        log('reward', `Bought: ${item.label}. (${parts}, −${formatCoin(item.coinCost)})`);
        break;
      }
      case 'sell_rice': {
        const n = state.resources.rice;
        if (n <= 0) break;
        const coin = n * sel.ricePrice(state);
        state.resources.rice = 0;
        gain('coin', coin);
        log('reward', `You sell ${n} rice to the pedlar. (+${formatCoin(coin)})`);
        break;
      }

      // — kura bank —
      case 'deposit': {
        if (state.location !== 'kura') break;
        const w = action.what;
        state.banked[w] += state.resources[w];
        state.resources[w] = 0;
        now(`The kura takes your ${w}. Safe now.`);
        break;
      }
      case 'withdraw': {
        if (state.location !== 'kura') break;
        const w = action.what;
        state.resources[w] += state.banked[w];
        state.banked[w] = 0;
        now(`You carry your ${w} again — at your own risk.`);
        break;
      }

      // — estate —
      case 'improve_estate': {
        const next = D.ESTATE_STAGES[state.estateStage];
        if (!next || state.resources.coin < next.coinCost) break;
        gain('coin', -next.coinCost);
        state.estateStage += 1;
        log('milestone', next.logLine);
        emit('estate-up', { stage: state.estateStage });
        break;
      }

      // — meals —
      case 'cook_meal':
        if (state.resources.sansai < D.BALANCE.COOK_SANSAI_COST) break;
        gain('sansai', -D.BALANCE.COOK_SANSAI_COST);
        state.character.hp = Math.min(sel.hpMax(state), state.character.hp + D.BALANCE.COOK_HP_RESTORE);
        log('reward', `A hot meal of sansai. The body mends a little. (+${D.BALANCE.COOK_HP_RESTORE} life)`);
        break;
      case 'eat_rice':
        if (state.resources.rice < D.BALANCE.EAT_RICE_COST) break;
        gain('rice', -D.BALANCE.EAT_RICE_COST);
        state.character.satiety = Math.min(
          sel.satietyMax(state),
          state.character.satiety + D.BALANCE.EAT_RICE_SATIETY,
        );
        log('reward', `Plain rice, eaten standing. (+${D.BALANCE.EAT_RICE_SATIETY} body)`);
        break;

      // — character —
      case 'spend_attribute':
        if (state.character.attributePoints <= 0) break;
        state.character.attributePoints -= 1;
        state.character.attrs[action.attr] += 1;
        log('milestone', `Training — ${action.attr.toUpperCase()} rises to ${state.character.attrs[action.attr]}.`);
        break;

      // — combat —
      case 'face_wolf': {
        if (state.location !== 'kura' || state.flags['first-fight-survived']) break;
        const wolf = D.MOBS.find((m) => m.id === 'wolf_scripted');
        log('combat', '⚔️ The wolf rises from behind the rice-sacks — ribs under winter fur, nothing to lose.');
        log('combat', 'You put the carrying-pole between you and it. It comes anyway.');
        log('combat', 'Teeth find your forearm; the pole finds its skull. Twice. (−32 life)');
        state.character.hp = Math.max(6, state.character.hp - 32);
        state.flags['first-fight-survived'] = true;
        if (!state.bestiaryFaced.includes(wolf.id)) state.bestiaryFaced.push(wolf.id);
        log('combat', 'The wolf is down. You are shaking, and alive, and the stores are whole.');
        log('milestone', 'You live through it on luck alone. Something in you refuses to call it luck.');
        emit('wolf-survived');
        break;
      }
      case 'fight': {
        const mob = sel.foesHere(state).find((m) => m.id === action.mobId);
        if (mob) fight(mob);
        break;
      }
      case 'set_auto_combat':
        state.autoCombat = action.mobId ?? null;
        state.autoCombatRetreat = !!action.retreat;
        break;

      // — quests —
      case 'accept_quest': {
        const q = D.QUESTS.find((x) => x.id === action.id);
        if (!q || sel.questState(state, q) !== 'open') break;
        state.quests.accepted.push(q.id);
        state.quests.progress[q.id] = [];
        log('milestone', `Undertaken — ${q.title}.`);
        break;
      }

      // — ceremonies —
      case 'begin_rung_beat': {
        if (!sel.summonsReady(state)) break;
        const target = sel.nextRung(state).id;
        if (!D.RUNG_BEATS[target]) break;
        state.phase = 'vn';
        state.vn = { kind: 'rung', target, shown: 1, asked: [], phase: 'greeting', picked: null };
        break;
      }
      case 'dismiss_ceremony':
        state.ceremony = null;
        break;

      default:
        break;
    }
    notify();
  }

  // — the tick loop (active-only, mirrors autoStep; auto-fight > auto-rake >
  //   auto-labour, each auto-resting when the body runs low) —
  function tick() {
    if (state.phase !== 'game') return;
    let acted = false;
    const lowSatiety = state.character.satiety < sel.satietyMax(state) * 0.7;
    const restNow = () => {
      state.character.satiety = Math.min(
        sel.satietyMax(state),
        state.character.satiety + D.BALANCE.SATIETY_PER_REST,
      );
      advanceClock();
    };
    if (state.autoCombat) {
      const mob = sel.foesHere(state).find((m) => m.id === state.autoCombat);
      const frac = state.character.hp / sel.hpMax(state);
      if (mob && (!state.autoCombatRetreat || frac > 0.2)) {
        fight(mob);
        acted = true;
      }
    } else if (state.autoRake && state.rung === 'R0') {
      if (lowSatiety) restNow();
      else {
        gain('rice', D.BALANCE.RICE_PER_RAKE);
        spendSatiety(D.BALANCE.SATIETY_PER_ACT);
        meterFeed('rake_rice');
        log('reward', D.COLD_OPEN.rakeLine(D.BALANCE.RICE_PER_RAKE));
        advanceClock();
      }
      acted = true;
    } else if (state.autoActivity) {
      const act = D.ACTIVITIES.find((a) => a.id === state.autoActivity);
      if (act && act.area === state.location) {
        if (lowSatiety) restNow();
        else doLabour(act);
        acted = true;
      }
    }
    if (!acted) advanceClock();
    // expire Now-channel lines older than ~15s
    const cut = Date.now() - 15000;
    state.log = state.log.filter((l) => !l.ephemeral || l.at > cut);
    notify();
  }

  const interval = setInterval(tick, TICK_MS);

  return {
    get state() {
      return state;
    },
    dispatch,
    subscribe(fn) {
      listeners.add(fn);
      fn(state, []);
      return () => listeners.delete(fn);
    },
    setStage(id) {
      state = snapshot(id);
      notify();
    },
    stop() {
      clearInterval(interval);
    },
  };
}
