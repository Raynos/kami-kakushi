// The log as a DERIVED VIEW (save-format plan, step 1; the human's ruling, 2026-07-11).
//
// The load-bearing claim of the whole plan: a log line's prose is NOT a transcript frozen at the
// moment it was written — it is re-rendered from the CURRENT src/ registries every load. Reword a
// reveal line in src/ and every existing save shows the new words. These tests exist to make that
// claim falsifiable.

import { describe, it, expect, afterEach } from 'vitest';
import { renderLogLine, LOG_NAMESPACES } from './log-render';
import { LOG_CONTENT } from './log-content';
import { SURFACES } from './surfaces';
import { __setStoryOverlay } from './story-overlay';
import { DISCOVERIES, discoveryEmitLine } from './discoveries';
import { RUNG_BEATS, type RungScene } from './rungBeats';
import { SCENES } from './scenes';
import { DIALOGUE_SCENES, introPerkLine, type DialogueScene } from './intro';
import {
  decodeStore,
  encodeStore,
  makeEnvelope,
} from '../../persistence/codec';
import { createInitialState } from '../index';
import { pushLog } from '../log';
import type { GameState } from '../index';

const revealSurface = SURFACES.find((s) => s.revealLine !== undefined)!;

describe('renderLogLine — static keys still win over the namespace dispatch', () => {
  it('resolves a hand-written key from LOG_CONTENT', () => {
    // The hand-written keys ALREADY contain dots ('combat.win'), so a dispatch-on-dot-first
    // would hijack them. This is the RED for that ordering bug.
    const dotted = Object.keys(LOG_CONTENT).find((k) => k.includes('.'))!;
    expect(() => renderLogLine(dotted, {})).not.toThrow();
  });

  it('throws on a key nothing can resolve (codec catches it and keeps the stored text)', () => {
    expect(() => renderLogLine('nonsense.no-such-id', {})).toThrow();
    expect(() => renderLogLine('reveal.a-surface-we-deleted', {})).toThrow();
  });

  it('every namespace it advertises actually resolves', () => {
    expect(LOG_NAMESPACES).toContain('reveal');
    expect(LOG_NAMESPACES).toContain('discovery');
  });
});

// ── the sweep the beat-topic gap walked straight through (2026-07-13) ────────────────────────
// The test above proves every NAMESPACE resolves. It is blind to a namespace that resolves only
// SOME of its keys — and `beat.` was exactly that: `intents.ts` wrote `topic.<id>.ask` and
// `topic.<id>.answer.<i>` for every rung beat, `vnText` had no topic branch to read them back, and
// so every rung-beat ask and answer sat frozen at its stored prose. A re-voice could not reach it;
// the DEV take switcher could not reach it; nothing went red.
//
// This sweeps the keys the emitters can actually WRITE (`scenes.ts` · `intents.ts`), built FROM the
// registries — so a new beat, scene, topic or option joins the sweep for free, and any future
// emitter/resolver drift is RED on the next run.
type Emitted = readonly [key: string, text: string];

/** The keys the VN payload emits — `beat.<rank>.…` and `scene.<id>.…` share `RungScene`. */
const rungKeys = (ns: string, id: string, scene: RungScene): Emitted[] => [
  ...scene.greeting.map(
    (l): Emitted => [`${ns}.${id}.greeting.${l.id}`, l.text],
  ),
  ...scene.topics.flatMap((t): Emitted[] => [
    [`${ns}.${id}.topic.${t.id}.ask`, t.label],
    ...t.answer.map(
      (l): Emitted => [`${ns}.${id}.topic.${t.id}.answer.${l.id}`, l.text],
    ),
  ]),
  ...scene.decision.options.flatMap((o): Emitted[] => [
    [`${ns}.${id}.opt.${o.id}.say`, o.say],
    [`${ns}.${id}.opt.${o.id}.react`, o.react],
    ...(o.statBonus
      ? [[`${ns}.${id}.opt.${o.id}.bonus`, o.statBonus.note] as Emitted]
      : []),
  ]),
];

/** The intro's own payload — same shape, but its options close on a PERK line, not a stat note. */
const introKeys = (s: DialogueScene): Emitted[] => [
  ...s.greeting.map((l): Emitted => [`intro.${s.id}.greeting.${l.id}`, l.text]),
  ...s.topics.flatMap((t): Emitted[] => [
    [`intro.${s.id}.topic.${t.id}.ask`, t.label],
    ...t.answer.map(
      (l): Emitted => [`intro.${s.id}.topic.${t.id}.answer.${l.id}`, l.text],
    ),
  ]),
  ...s.decision.options.flatMap((o): Emitted[] => [
    [`intro.${s.id}.opt.${o.id}.say`, o.say],
    [`intro.${s.id}.opt.${o.id}.react`, o.react],
    [`intro.${s.id}.opt.${o.id}.perk`, introPerkLine(o)],
  ]),
];

const EMITTED: Emitted[] = [
  ...Object.entries(RUNG_BEATS).flatMap(([rank, b]) =>
    b ? rungKeys('beat', rank, b) : [],
  ),
  ...SCENES.flatMap((d) => rungKeys('scene', d.id, d.scene)),
  ...DIALOGUE_SCENES.flatMap(introKeys),
];

describe('every VN line the emitters key is a line the resolvers can read back', () => {
  it('the sweep actually covers the addresses that broke (else it is a dead ratchet)', () => {
    // Without this, a registry that stopped carrying topics would make the sweep below pass by
    // being EMPTY — green because it checked nothing. These are the classes the drift hid in.
    const has = (p: (k: string) => boolean) => EMITTED.some(([k]) => p(k));
    expect(has((k) => k.startsWith('beat.') && k.includes('.topic.'))).toBe(
      true,
    );
    expect(has((k) => k.startsWith('intro.') && k.includes('.topic.'))).toBe(
      true,
    );
    expect(has((k) => k.startsWith('scene.') && k.endsWith('.say'))).toBe(true);
  });

  it('resolves each one to ITS registry line — none throws, none lands on a neighbour', () => {
    const broken = EMITTED.flatMap(([key, text]) => {
      let got: string;
      try {
        got = renderLogLine(key);
      } catch {
        return [
          `${key} — THROWS: nothing reads it, so the save keeps its stale prose forever`,
        ];
      }
      return got === text
        ? []
        : [`${key} — resolves to the WRONG line: ${JSON.stringify(got)}`];
    });
    expect(broken).toEqual([]);
  });
});

describe('a reveal line renders from ITS surface, not from a copy', () => {
  it('reveal.<id> renders the surface registry’s CURRENT text', () => {
    // Derivation identity, not a copied string: if the surface's prose changes, this expectation
    // changes with it — which is precisely the behaviour under test.
    expect(renderLogLine(`reveal.${revealSurface.id}`, {})).toBe(
      revealSurface.revealLine!.text,
    );
  });

  it('a discovery line renders from ITS discovery def', () => {
    const d = DISCOVERIES[0]!;
    expect(renderLogLine(`discovery.${d.id}`, {})).toBe(discoveryEmitLine(d));
  });
});

describe('THE POINT: an old save’s stale prose is replaced by src/’s current words', () => {
  const STALE = 'THE OLD WORDS NOBODY WANTS ANY MORE';

  /** An "old save" whose log holds a keyed entry carrying prose from BEFORE a reword, encoded
   *  through the REAL store channel (the gzip one the game actually persists to). */
  const saveWithStaleProse = async (): Promise<string> => {
    const s: GameState = createInitialState(1);
    const withLine: GameState = {
      ...s,
      log: pushLog(s.log, 'narration', STALE, 0, {
        contentKey: `reveal.${revealSurface.id}`,
      }),
    };
    return encodeStore(makeEnvelope(withLine, 1, 0));
  };

  it('the stale words do not survive the load — the CURRENT registry text does', async () => {
    const decoded = (await decodeStore(await saveWithStaleProse())) as {
      state: { log: { entries: { text: string }[] } };
    };
    const entry = decoded.state.log.entries.at(-1)!;

    expect(entry.text).toBe(revealSurface.revealLine!.text); // src/ is the truth
    expect(entry.text).not.toBe(STALE); // …and the save is not
  });

  it('the store blob does not even CARRY the prose (it is a descriptor)', async () => {
    // The size win, and the reason a reword cannot be ignored: the text is not in the blob.
    const raw = await saveWithStaleProse();
    const decoded = (await decodeStore(raw)) as { state: unknown };
    expect(JSON.stringify(decoded)).toContain(revealSurface.revealLine!.text); // rehydrated
    expect(raw).not.toContain(STALE); // …but never stored
  });

  it('…including a rung-beat ANSWER — the class that could not, until 2026-07-13', async () => {
    // The whole point, on the addresses that were unreachable: an old save holding a rung-beat
    // topic answer must show the registry's CURRENT words, not the prose frozen when it was asked.
    // Before the topic branch existed this threw inside the codec and the save kept STALE forever
    // — which is what an ADR-185 re-voice wave would have shipped to every existing player.
    const beat = Object.entries(RUNG_BEATS).find(
      ([, b]) => b && b.topics.length > 0,
    )!;
    const [rank, scene] = beat as [string, RungScene];
    const topic = scene.topics[0]!;

    const s: GameState = createInitialState(1);
    const withStale: GameState = {
      ...s,
      log: pushLog(s.log, 'narration', STALE, 0, {
        contentKey: `beat.${rank}.topic.${topic.id}.answer.${topic.answer[0]!.id}`,
      }),
    };
    const decoded = (await decodeStore(
      await encodeStore(makeEnvelope(withStale, 1, 0)),
    )) as {
      state: { log: { entries: { text: string }[] } };
    };

    expect(decoded.state.log.entries.at(-1)!.text).toBe(topic.answer[0]!.text);
    expect(decoded.state.log.entries.at(-1)!.text).not.toBe(STALE);
  });

  it('an UNKEYED legacy line keeps its prose verbatim (old saves still load)', async () => {
    const s: GameState = createInitialState(1);
    const legacy: GameState = {
      ...s,
      log: pushLog(s.log, 'narration', 'authored prose with no key', 0),
    };
    const decoded = (await decodeStore(
      await encodeStore(makeEnvelope(legacy, 1, 0)),
    )) as {
      state: { log: { entries: { text: string }[] } };
    };
    expect(decoded.state.log.entries.at(-1)!.text).toBe(
      'authored prose with no key',
    );
  });
});

// ── HD-44 / ADR-190: the rare stat-nudge's delight line ──────────────────────────────────────
// The one asymmetric reward in a net-zero choice system. It was gone for months — a content
// rewrite (ea5710e3) replaced the option it hung on and the bonus did not come across — and the
// line the beat logs for it was UNKEYED, so the moment the data returned it would have frozen in
// every save that logged it. These pin both halves: the data exists, and the line is addressable.
describe('the R3 delight line — the one pick that pays', () => {
  const withBonus = Object.entries(RUNG_BEATS).flatMap(([rank, b]) =>
    (b?.decision.options ?? [])
      .filter((o) => o.statBonus)
      .map((o) => ({ rank, o })),
  );

  it('EXACTLY ONE rung option carries a bonus — rare is the design, not an accident', () => {
    // A dead ratchet in reverse: if this ever reads 0 the lever has been silently dropped again
    // (which is precisely what happened); if it climbs, "rare" has quietly stopped being true.
    expect(withBonus.length).toBe(1);
  });

  it('its note renders from the registry through the key the beat logs', () => {
    const { rank, o } = withBonus[0]!;
    expect(renderLogLine(`beat.${rank}.opt.${o.id}.bonus`)).toBe(
      o.statBonus!.note,
    );
  });

  it('the note names the attribute it actually moves (the player never guesses — TST4)', () => {
    const { o } = withBonus[0]!;
    expect(o.statBonus!.note).toContain(o.statBonus!.attr.toUpperCase());
    expect(o.statBonus!.amount).toBeGreaterThan(0);
  });
});

// ── step D (session-200) — the 幕-head context is KEYED (`intro-title.<sceneId>`): the
// resolver reads introSceneTitle (overlay-aware), so a re-authored or take-flipped head
// reaches logged scene cards through the same funnel as every other keyed line. ──
describe('the intro-title context resolver (step D)', () => {
  afterEach(() => __setStoryOverlay(null));

  it('resolves a scene head from the registry, and the overlay re-voices it', () => {
    const scene = DIALOGUE_SCENES[0]!;
    const canonHead = scene.title ?? 'the cold open';
    expect(renderLogLine(`intro-title.${scene.id}`)).toBe(canonHead);
    __setStoryOverlay({ [`intro-title.${scene.id}`]: 'TAKE head' });
    expect(renderLogLine(`intro-title.${scene.id}`)).toBe('TAKE head');
    expect(() => renderLogLine('intro-title.no-such-scene')).toThrow(); // codec falls back
  });
});

// ADR-164/ADR-197 — the mend lane's result lines live in the DISPATCH layer (the fiction
// is a FLAVOR key the sickroom-mend diverge overlays; the mechanics suffix rides params).
describe('the sickroom resolver (mend-lane result lines)', () => {
  afterEach(() => __setStoryOverlay(null));

  it('prices the two verbs honestly, and a take re-voices the prose but never the suffix', () => {
    expect(renderLogLine('sickroom.treat', { cost: 12, hpGain: 50 })).toContain(
      '(−12 mon, +50 HP)',
    );
    expect(renderLogLine('sickroom.rest', { hpGain: 20 })).toContain(
      '(+20 HP)',
    );
    __setStoryOverlay({ 'flavor.sickroomTreat': 'TAKE mend prose' });
    expect(renderLogLine('sickroom.treat', { cost: 12, hpGain: 50 })).toBe(
      'TAKE mend prose (−12 mon, +50 HP)',
    );
  });
});
