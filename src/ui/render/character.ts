// The CHARACTER tab (split out of render.ts, 2026-07-13 render-split): the Body card
// (vitals readouts + the re-homed food verbs, FB-343/FB-369), Training (attr spending),
// the Bestiary field-guide, and the skills list (ADR-112 — all sections of Character 己).
import {
  balance,
  bestiaryEntries,
  hungerMax,
  isUnlocked,
  satietyMax,
  SKILLS,
  skillProgress,
  skillVisible,
  skillYieldNum,
  type GameState,
  type Intent,
  type SkillId,
} from '../../core';
import { el, stampAct } from '../render';
import {
  reconcileList,
  setText,
  setClass,
  setDisabled,
  setStyle,
  toggle,
} from '../reconcile';
import { renderBestiary, buildBestiaryCard, patchBestiaryCard } from './combat';
import { stripFromState } from '../stamp-book/from-state';
import { stripKey } from '../stamp-book/compact-draw';
import { paintConcertina } from '../stamp-book/concertina';
import type { DevApi } from '../dev';

type Dispatch = (intent: Intent) => void;

export function createCharacterView(ctx: {
  characterRecord: HTMLElement;
  characterBody: HTMLElement;
  characterTrain: HTMLElement;
  characterBestiary: HTMLElement;
  skillsPane: HTMLElement;
  dispatch: Dispatch;
  dev: DevApi | undefined;
  activeTab(): string;
}): {
  renderSkills(state: GameState): void;
  renderCharacterSheet(state: GameState): void;
} {
  const {
    characterRecord,
    characterBody,
    characterTrain,
    characterBestiary,
    skillsPane,
    dispatch,
    dev,
  } = ctx;

  // ── the SEAL-BOOK record strip (ADR-201, E3 compact) — the run's pressed
  //    seals + the next slot + the mystery future, VARIANT A (concertina)
  //    inline as the shipped default (ADR-075; B/C in dev/variant-renderers).
  //    Build-once + KEYED repaint (P4): only a press / a fall / a completed
  //    requirement repaints the drawing — idle ticks churn nothing. Rides the
  //    Character tab's own reveal; it never forces the tab open early
  //    (characterHasContent is deliberately untouched). ──
  let recordRefs: {
    count: HTMLElement;
    stripHost: HTMLElement;
    key: string;
  } | null = null;

  function buildRecordCard(host: HTMLElement): {
    count: HTMLElement;
    stripHost: HTMLElement;
  } {
    const card = el('div', 'weapon-card frame sbc-card');
    const head = el('div', 'skill-head');
    head.append(el('span', 'skill-name', 'Seal-book 朱印帳'));
    const count = el('span', 'skill-lvl');
    head.append(count);
    card.append(head);
    const stripHost = el('div', 'sbc-host');
    card.append(stripHost);
    host.append(card);
    return { count, stripHost };
  }

  function paintRecord(
    refs: { count: HTMLElement; stripHost: HTMLElement },
    data: ReturnType<typeof stripFromState>,
  ): void {
    const pressed = data.slots.filter((s) => s.state === 'pressed').length;
    setText(refs.count, `${pressed} of ${data.slots.length} pressed`);
    paintConcertina(refs.stripHost, data);
  }

  // characterRefs — the Character tab's SPLIT-OUT halves of combat (training attrs + bestiary),
  // each a build-once/patch surface (FB-81). Reveal at R3 (`readout-combat-level` / `panel-bestiary`).
  // Each half builds lazily + independently (both reveal at R3 in practice, but the refs never
  // assume the other is present), so a null field means "that half not yet built".
  // FB-343/FB-369 — the Character BODY card: vitals readouts + the re-homed food verbs.
  let characterBodyRefs: {
    bodyVal: HTMLElement;
    bellyVal: HTMLElement;
    cookRow: HTMLElement;
    cookBtn: HTMLButtonElement;
    eatRiceRow: HTMLElement;
    eatRiceBtn: HTMLButtonElement;
  } | null = null;
  let characterTrainRefs: { train: HTMLElement; trainPts: HTMLElement } | null =
    null;
  let characterBestiaryRefs: {
    host: HTMLElement;
    blurb: HTMLElement;
    list: HTMLElement;
  } | null = null;

  function renderSkills(state: GameState): void {
    // IA reorg (ADR-112 §2) — skills is a section of the Character tab (with attrs + bestiary).
    const show =
      ctx.activeTab() === 'character' && isUnlocked(state, 'tab-skills');
    toggle(skillsPane, show);
    if (!show) return;
    // the visible skill rows — reconciled as a keyed list so each card is built ONCE (its meter fill
    // persists ⇒ the width transition plays) and patched in place; a not-yet-visible skill has no
    // node, so an empty pane stays genuinely empty (FB-72 ghost-box contract).
    const visible = SKILLS.filter(
      (def) =>
        skillVisible(state, def.id) || isUnlocked(state, `skill-${def.id}`),
    );
    reconcileList(skillsPane, visible, {
      key: (def) => def.id,
      build: (def) => {
        const card = el('div', 'skill-row frame');
        const head = el('div', 'skill-head');
        head.append(el('span', 'skill-name', `${def.label} ${def.kanji}`));
        head.append(el('span', 'skill-lvl numeric'));
        card.append(head);
        card.append(el('div', 'skill-blurb', def.blurb));
        // show what the level DOES (R6: an invisible mechanic) — the labour-yield accelerator, read
        // from source of truth. Conditioning is the zero-yield gate skill (gate shows in the strip).
        if (def.id !== 'conditioning') card.append(el('div', 'rung-hint'));
        const meter = el('div', 'meter');
        meter.append(el('span'));
        card.append(meter);
        return card;
      },
      patch: (card, def) => {
        const prog = skillProgress(state, def.id as SkillId);
        setText(card.querySelector('.skill-lvl')!, `Lv ${prog.level}`);
        if (def.id !== 'conditioning') {
          const yieldPct = Math.round(
            (skillYieldNum(prog.level) / balance.SKILL_YIELD_DEN - 1) * 100,
          );
          setText(
            card.querySelector('.rung-hint')!,
            `+${yieldPct}% labour yield`,
          );
        }
        setStyle(
          card.querySelector<HTMLElement>('.meter span')!,
          'width',
          `${Math.round((prog.into / prog.needed) * 100)}%`,
        );
      },
      order: true,
    });
  }

  // ── the Character tab's SPLIT-OUT combat halves (IA reorg ADR-112) — the attribute-TRAINING rows
  //    (points earned in combat, spent here) + the BESTIARY field-guide. Each self-gates to the
  //    Character tab and its R3 surface (`readout-combat-level` / `panel-bestiary`), and each is a
  //    build-once/patch surface (FB-81) so a hurt idle tick churns nothing. renderSkills + renderQuests
  //    (the tab's other sections) render into their own panes; this fn owns training + bestiary. ──
  function renderCharacterSheet(state: GameState): void {
    const onCharacter = ctx.activeTab() === 'character';
    const devMode = __DEV_TOOLS__ && dev;

    // ── the SEAL-BOOK record (ADR-201) — first section of the tab: who you
    //    have been, at a glance, before the live vitals below. ──
    toggle(characterRecord, onCharacter);
    if (devMode) {
      // DEV wholesale path (mirrors the bestiary branch): rebuild fresh so
      // the variant toggle takes a clean container.
      recordRefs = null;
      characterRecord.textContent = '';
      if (onCharacter) {
        const pane = el('div', 'sbc-devpane');
        characterRecord.append(pane);
        if (!dev.renderVariant('stamp-book', pane, state, dispatch)) {
          const refs = buildRecordCard(pane);
          paintRecord(refs, stripFromState(state));
        }
      }
    } else if (onCharacter) {
      if (!recordRefs) {
        const built = buildRecordCard(characterRecord);
        recordRefs = { ...built, key: '' };
      }
      const data = stripFromState(state);
      const key = stripKey(data);
      if (key !== recordRefs.key) {
        recordRefs.key = key;
        paintRecord(recordRefs, data);
      }
    }

    // ── BODY (R2, with the Character tab itself) — FB-343/FB-369 (human-ruled 2026-07-11):
    //    the food verbs' ONE home, beside the Body 体/Belly 腹 readouts they feed (TST3/TST4;
    //    zones stopped carrying them, ADR-178 §4). The card appears with either verb. ──
    const showBody =
      onCharacter &&
      (isUnlocked(state, 'verb-cook') || isUnlocked(state, 'verb-eat-rice'));
    toggle(characterBody, showBody);
    if (showBody) {
      if (!characterBodyRefs) {
        const card = el('div', 'weapon-card frame');
        const bh = el('div', 'skill-head');
        bh.append(el('span', 'skill-name', 'Body 体'));
        const bodyVal = el('span', 'skill-lvl');
        bh.append(bodyVal);
        card.append(bh);
        const bellyRow = el('div', 'attr-row');
        const bellyLabel = el('span', 'attr-label');
        bellyLabel.append(el('span', 'attr-name', 'Belly 腹'));
        const bellyVal = el('span', 'attr-val');
        bellyLabel.append(bellyVal);
        bellyRow.append(bellyLabel);
        card.append(bellyRow);
        const cookRow = el('div', 'labour-row');
        const cookBtn = el('button', 'verb');
        cookBtn.type = 'button';
        stampAct(cookBtn, 'cook_meal');
        cookBtn.addEventListener('click', () =>
          dispatch({ type: 'cook_meal' }),
        );
        cookRow.append(cookBtn);
        const eatRiceRow = el('div', 'labour-row');
        const eatRiceBtn = el('button', 'verb');
        eatRiceBtn.type = 'button';
        stampAct(eatRiceBtn, 'eat_rice');
        eatRiceBtn.addEventListener('click', () =>
          dispatch({ type: 'eat_rice' }),
        );
        eatRiceRow.append(eatRiceBtn);
        card.append(cookRow, eatRiceRow);
        characterBody.append(card);
        characterBodyRefs = {
          bodyVal,
          bellyVal,
          cookRow,
          cookBtn,
          eatRiceRow,
          eatRiceBtn,
        };
      }
      const b = characterBodyRefs;
      // vitals readouts — numerals live here (the header vital-stack keeps bars-only, FB-387).
      setText(
        b.bodyVal,
        `${Math.round(state.character.satiety)}/${Math.round(satietyMax(state))} work left in the day`,
      );
      setText(
        b.bellyVal,
        ` ${Math.round(state.character.hunger)}/${Math.round(hungerMax(state))}`,
      );

      // cook a meal — sansai → belly (ADR-178; the HP mend is SEVERED, ADR-164/ADR-197 —
      // wounds mend at the sickroom, so the hurt-primary cue left with it).
      const showCook = isUnlocked(state, 'verb-cook');
      toggle(b.cookRow, showCook);
      if (showCook) {
        const cost = balance.COOK_SANSAI_COST;
        setClass(b.cookBtn, 'primary', false);
        setText(b.cookBtn, `Cook a meal (${cost} sansai)`);
        const short = (state.resources.sansai ?? 0) < cost;
        setDisabled(b.cookBtn, short);
        const title = short
          ? `Needs ${cost} sansai — forage the woodlot to gather it.`
          : 'A hot meal fills your belly. (Wounds mend at the sickroom, not the pot.)';
        if (b.cookBtn.title !== title) b.cookBtn.title = title;
      }

      // eat plain rice — rice → BELLY (ADR-178: food feeds the belly, never the work bar), the rice
      // food path beside cook. A deliberate meal RAISES what the daily kura ration only maintains.
      const showEatRice = isUnlocked(state, 'verb-eat-rice');
      toggle(b.eatRiceRow, showEatRice);
      if (showEatRice) {
        const cost = balance.EAT_RICE_COST;
        // ADR-163 — the meal is drawn from the kura; meal amounts read in shō (TST4).
        setText(b.eatRiceBtn, `Eat plain rice (${cost} shō)`);
        const short = (state.banked.rice ?? 0) < cost;
        setDisabled(b.eatRiceBtn, short);
        const title = short
          ? `Needs ${cost} shō in the kura — rake or farm the paddies to gather it.`
          : `A plain bowl of rice fills ${balance.EAT_RICE_HUNGER} belly — you rest better fed, at the cost of ${cost} shō.`;
        if (b.eatRiceBtn.title !== title) b.eatRiceBtn.title = title;
      }
    }

    // ── TRAINING (attrs) — reveals at R3 with combat (readout-combat-level). The +1 buttons spend
    //    attributePoints EARNED from combat leveling (the coupling holds — points still fire from the
    //    fight loop; only the SPENDING UI moved here). Always incremental (no DEV variant). ──
    const showTrain = onCharacter && isUnlocked(state, 'readout-combat-level');
    toggle(characterTrain, showTrain);
    if (showTrain) {
      // build-once shell + a fixed keyed list of the 5 attr rows (FB-81), mirroring the old combat build.
      if (!characterTrainRefs) {
        const train = el('div', 'weapon-card frame');
        const th = el('div', 'skill-head');
        th.append(el('span', 'skill-name', 'Training 鍛錬'));
        const trainPts = el('span', 'skill-lvl');
        th.append(trainPts);
        train.append(th);
        characterTrain.append(train);
        characterTrainRefs = { train, trainPts };
      }
      const c = state.character;
      const cr = characterTrainRefs;
      setText(
        cr.trainPts,
        `${c.attributePoints} point${c.attributePoints === 1 ? '' : 's'} to spend`,
      );
      reconcileList(cr.train, balance.ATTR_IDS, {
        key: (id) => id,
        build: (id) => {
          const meta = balance.ATTR_META[id];
          const row = el('div', 'attr-row');
          const label = el('span', 'attr-label');
          label.append(el('span', 'attr-name', `${meta.label} ${meta.kanji}`));
          label.append(el('span', 'attr-val'));
          label.append(el('span', 'attr-gain lock-hint', ` ${meta.gain}`));
          row.append(label);
          const plus = el('button', 'auto-toggle', '+1');
          plus.type = 'button';
          plus.addEventListener('click', () =>
            dispatch({ type: 'spend_attribute', attr: id }),
          );
          row.append(plus);
          return row;
        },
        patch: (row, id) => {
          setText(row.querySelector('.attr-val')!, ` ${c.attrs[id]}`);
          setDisabled(
            row.querySelector('.auto-toggle')!,
            c.attributePoints <= 0,
          );
        },
      });
    }

    // ── BESTIARY (R3) — the field-guide of foes; the fog→inked flip patches each card in place. ──
    const showBestiary = onCharacter && isUnlocked(state, 'panel-bestiary');
    toggle(characterBestiary, showBestiary);
    if (devMode) {
      // DEV wholesale path — mirror the market/quests DEV branches: rebuild fresh each render so the
      // variant toggle takes a clean container. (Only a live DEV session takes this branch.)
      characterBestiaryRefs = null;
      characterBestiary.textContent = '';
      if (showBestiary) {
        const bpane = el('div', 'bestiary');
        characterBestiary.append(bpane);
        if (!dev.renderVariant('bestiary', bpane, state, dispatch))
          renderBestiary(bpane, state);
      }
      return;
    }
    // prod / test — build the bestiary host ONCE (FB-81), patch in place.
    if (showBestiary) {
      if (!characterBestiaryRefs) {
        const host = el('div', 'bestiary');
        host.append(el('h3', 'foes-head', 'Bestiary 図鑑'));
        const blurb = el('div', 'skill-blurb');
        host.append(blurb);
        const list = el('div', 'bestiary-list');
        host.append(list);
        characterBestiary.append(host);
        characterBestiaryRefs = { host, blurb, list };
      }
      const br = characterBestiaryRefs;
      const entries = bestiaryEntries(state);
      const known = entries.filter((e) => e.seen).length;
      setText(
        br.blurb,
        `${known} of ${entries.length} beasts recorded — face a foe to ink its entry.`,
      );
      reconcileList(br.list, entries, {
        key: (e) => e.mob.id,
        build: () => buildBestiaryCard(),
        patch: (card, e) => patchBestiaryCard(card, e),
        order: true,
      });
    }
  }

  return { renderSkills, renderCharacterSheet };
}
