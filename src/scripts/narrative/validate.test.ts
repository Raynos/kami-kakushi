// FB-5 Ph2 — the validation roster's RED proofs: every §3 validation demonstrably
// goes RED against an inline fixture, and every error cites the authoring
// file:line. The base fixture derives from the SOURCE-OF-TRUTH registries
// (RANKS' unlock list, real NPC ids, real attrs/stances) — never copied magic
// values — so a registry change moves the fixtures with it (test discipline,
// ADR-086…ADR-088).

import { describe, it, expect } from 'vitest';
import { parseNarrative, NarrativeError } from './parse';
import { validateNarrative } from './validate';
import { emitScenes } from './emit';
import { RANKS } from '../../core/content/ranks';

const R1_UNLOCK = RANKS.find((r) => r.id === 'R1')!.rewardOnReach!.unlock!;

/** A minimal VALID scene built from source-of-truth values. */
const BASE = `## rung R1 · rung-r1
speaker: genemon
voice: steward
motivates: ${R1_UNLOCK.join(', ')}

> A narrator line.

Genemon: "A greeting line."

### ask t-one · "First question?"

Genemon: "First answer."

### ask t-two · "Second question?"
after: t-one

Genemon: "Second answer."

### decide · The prompt?

#### o-one · "The label."

Genemon: "The react."

memory: genemon +1 (dutiful)
flags: f-one
`;

const validate = (md: string) => validateNarrative([parseNarrative(md, 'fixture.md')]);

const expectError = (md: string, needle: string): void => {
  const v = validate(md);
  expect(v.errors.join('\n')).toContain(needle);
};

describe('narrative validation roster (each check can go RED)', () => {
  it('the base fixture is clean (errors AND warnings empty)', () => {
    const v = validate(BASE);
    expect(v.errors).toEqual([]);
    expect(v.warnings).toEqual([]);
  });

  it('§1 unknown speaker', () => {
    expectError(
      BASE.replace('Genemon: "A greeting line."', 'Kihie: "A greeting line."'),
      'unknown speaker "Kihie"',
    );
  });

  it('§1 ambient (non-NPC) speaker needs an explicit voice', () => {
    // Sayo (the village girl) is a NAMES entry but not a T0 NpcId, so a bare speaker
    // line requires an explicit (voice). (A former pedlar example is now the
    // first-class NpcId `yohei`, so it resolves a voice on its own.)
    expectError(
      BASE.replace('Genemon: "A greeting line."', 'Sayo: "A greeting line."'),
      'needs an explicit (voice)',
    );
  });

  it('§2 unknown line voice', () => {
    expectError(
      BASE.replace('Genemon: "A greeting line."', 'Genemon (growly): "A greeting line."'),
      'unknown voice "growly"',
    );
  });

  it('§2 unknown scene voice', () => {
    expectError(BASE.replace('voice: steward', 'voice: growly'), 'unknown scene voice "growly"');
  });

  it('scene speaker must be a real NPC id', () => {
    expectError(BASE.replace('speaker: genemon', 'speaker: nonesuch'), 'unknown scene speaker');
  });

  it('§3 duplicate topic id', () => {
    expectError(BASE.replace('### ask t-two', '### ask t-one'), 'duplicate topic id "t-one"');
  });

  it('§3 duplicate option id across scenes', () => {
    const second = BASE.replace('## rung R1 · rung-r1', '## rung R2 · rung-r2')
      .replace('speaker: genemon', 'speaker: rokusuke')
      .replace(
        `motivates: ${R1_UNLOCK.join(', ')}`,
        `motivates: ${RANKS.find((r) => r.id === 'R2')!.rewardOnReach!.unlock!.join(', ')}`,
      )
      .replace('### ask t-one · "First question?"', '### ask t-three · "First question?"')
      .replace(
        '### ask t-two · "Second question?"\nafter: t-one',
        '### ask t-four · "Second question?"\nafter: t-three',
      )
      .replaceAll('Genemon:', 'Rokusuke:');
    expectError(`${BASE}\n${second}`, 'duplicate option id "o-one"');
  });

  it('§4 after: must resolve to a topic in the same scene', () => {
    expectError(
      BASE.replace('after: t-one', 'after: t-elsewhere'),
      '"t-elsewhere" is not a topic in scene',
    );
  });

  it('§4 after: must not self-gate', () => {
    expectError(BASE.replace('after: t-one', 'after: t-two'), 'gates on itself');
  });

  it('§4 after: must not cycle', () => {
    const md = BASE.replace(
      '### ask t-one · "First question?"',
      '### ask t-one · "First question?"\nafter: t-two',
    );
    expectError(md, 'cyclic after: chain');
  });

  it('§5 memory npc must be a known NPC id', () => {
    expectError(
      BASE.replace('memory: genemon +1 (dutiful)', 'memory: nonesuch +1 (dutiful)'),
      'memory npc "nonesuch"',
    );
  });

  it('§5 memory warmth delta clamps at ±3', () => {
    expectError(
      BASE.replace('memory: genemon +1 (dutiful)', 'memory: genemon +4 (dutiful)'),
      'exceeds the ±3 clamp',
    );
  });

  it('§6 bonus attr from the source-of-truth roster', () => {
    expectError(
      BASE.replace('flags: f-one', 'flags: f-one\nbonus: +1 chr — "A note."'),
      'bonus attr "chr"',
    );
  });

  it('§6 stance from STANCE_ORDER', () => {
    expectError(BASE.replace('flags: f-one', 'flags: f-one\nstance: seigan'), 'stance "seigan"');
  });

  it('§7 motivates must be known surfaces', () => {
    expectError(
      BASE.replace(`motivates: ${R1_UNLOCK.join(', ')}`, 'motivates: not-a-surface'),
      'not a known surface',
    );
  });

  it('§7 motivates must be verbatim-equal to the rank unlock list', () => {
    // A real surface id that is NOT R1's unlock list — order/AWOL both trip it.
    expectError(
      BASE.replace(
        `motivates: ${R1_UNLOCK.join(', ')}`,
        `motivates: ${[...R1_UNLOCK].reverse().join(', ')}`,
      ),
      'verbatim-equal to RANKS.R1.rewardOnReach.unlock',
    );
  });

  it('§8 unknown rank key', () => {
    expectError(
      BASE.replace('## rung R1 · rung-r1', '## rung R99 · rung-r99'),
      'unknown rank "R99"',
    );
  });

  it('§8 R0 takes no beat', () => {
    expectError(
      BASE.replace('## rung R1 · rung-r1', '## rung R0 · rung-r0'),
      'R0 takes no rung beat',
    );
  });

  it('§8 duplicate rung key', () => {
    const dup = BASE.replace('### ask t-one', '### ask t-five')
      .replace(
        '### ask t-two · "Second question?"\nafter: t-one',
        '### ask t-six · "Second question?"\nafter: t-five',
      )
      .replace('#### o-one', '#### o-two');
    expectError(`${BASE}\n${dup}`, 'duplicate rung "R1"');
  });

  it('§12 WARN (not error) on an off-register voice override', () => {
    const v = validate(
      BASE.replace('Genemon: "A greeting line."', 'Genemon (villager): "A greeting line."'),
    );
    expect(v.errors).toEqual([]);
    expect(v.warnings.join('\n')).toContain("Genemon speaks in 'villager'");
  });

  it("§12 allowlist — Munemasa's R7 'official' register stays quiet (human ruling)", () => {
    const r7unlock = RANKS.find((r) => r.id === 'R7')!.rewardOnReach!.unlock!;
    const md = `## rung R7 · rung-r7
speaker: munemasa
voice: official
motivates: ${r7unlock.join(', ')}

Munemasa (official): "A capstone line."

### decide · The prompt?

#### o-seven · "The label."

Munemasa: "The react."
`;
    const v = validate(md);
    expect(v.errors).toEqual([]);
    expect(v.warnings).toEqual([]);
  });

  it('errors cite the authoring file:line', () => {
    const v = validate(BASE.replace('Genemon: "A greeting line."', 'Kihie: "A greeting line."'));
    expect(v.errors[0]).toMatch(/^fixture\.md:8 — /);
  });

  it('react lines take no (voice) override', () => {
    expectError(
      BASE.replace('Genemon: "The react."', 'Genemon (steward): "The react."'),
      'a react line takes no (voice) override',
    );
  });

  it('parse errors carry file:line too', () => {
    expect(() =>
      parseNarrative('## rung R1 · rung-r1\n\njust prose with no home\n', 'fixture.md'),
    ).toThrowError(NarrativeError);
  });
});

// storywave G3.5 (FB-5) — the generalized scene-def block + the speakerless narration-only
// beat. Fixtures quote the picked-take forms scenes.md declares (u2 take-c's silent-rung
// narration; the U8 take-c "dog that stays" side-beat), not invented shapes. Each assertion
// goes RED against a broken validator.
describe('narrative scene-defs (G3.5) — the new grammar forms validate + go RED', () => {
  // The speakerless narration-only beat: narrator-voiced greeting, no granter speaker, no
  // decision (the engine's empty-options continue path drives it). A season-exit overlay,
  // once per year — verbatim u2 take-c narration.
  const SILENT = `## scene-def nengu-autumn-frame
trigger: season-exit autumn
once: true
voice: narrator

> First light. The broom stands against the gatepost where you left it.

> You take the broom. Nobody takes it back.
`;

  // A well-formed scene-def WITH a decision (the U8 dog side-beat, take C): a flag trigger,
  // a two-voice react (Genemon answers a beat Kihei owns → reactNpc).
  const DOG = `## scene-def sb-dog
trigger: flag orchard-reclaimed
once: true
speaker: kihei
voice: arms

> Kihei crosses the cleared ground on his round and stops beside you.

Kihei: "Drive it, feed it, or bring it to me. Don't leave it half-decided."

### decide · The dog watches you decide.

#### sb-dog-drive · "The orchard's cleared. All of it."

Kihei: "Cleared is cleared. Stop the gap in the wall behind it."

memory: kihei +1 (thorough)
flags: sb-dog-driven

#### sb-dog-feed · "It stays. I'll feed it from my share."

Genemon: "A dog. Old, one ear. Rice: a handful, mornings — entered against rats."

memory: genemon +1 (accountable)
flags: sb-dog-fed
`;

  it('the speakerless narration-only beat is clean (errors AND warnings empty)', () => {
    const v = validate(SILENT);
    expect(v.errors).toEqual([]);
    expect(v.warnings).toEqual([]);
  });

  it('a well-formed scene-def with a decision is clean', () => {
    const v = validate(DOG);
    expect(v.errors).toEqual([]);
    expect(v.warnings).toEqual([]);
  });

  it('a two-voice react in a scene-def compiles to a reactNpc', () => {
    // Genemon (not the scene speaker Kihei) answers sb-dog-feed — the emit path must carry it.
    // Assertions are quote-robust (emit is pre-oxfmt; the gate formats it after).
    const gen = emitScenes(parseNarrative(DOG, 'fixture.md'));
    expect(gen).toContain("reactNpc: 'genemon'");
    expect(gen).toContain("kind: 'flag'");
    expect(gen).toContain('orchard-reclaimed');
    expect(gen).toContain('once: true');
  });

  it('the narration-only beat emits an empty decision (the engine continue path)', () => {
    const gen = emitScenes(parseNarrative(SILENT, 'fixture.md'));
    expect(gen).toContain("decision: { prompt: '', options: [] }");
    expect(gen).toContain("kind: 'season-exit'");
    expect(gen).toContain('autumn');
  });

  // FB-198 — the `You:` player-speech form: compiles to voice 'player' with NO static
  // speaker (the engine resolves the nameplate via the G4.7 ladder at display time).
  it("F198 — a `You:` line compiles to voice 'player' with no static speaker", () => {
    const md = DOG.replace(
      '> Kihei crosses the cleared ground on his round and stops beside you.',
      'You: "Here, dog."',
    );
    const v = validate(md);
    expect(v.errors).toEqual([]);
    // quote-robust (emit is pre-oxfmt): the line is player-voiced, carries the text,
    // and — the lever — compiles NO static speaker (the ladder resolves it at display).
    const gen = emitScenes(parseNarrative(md, 'fixture.md'));
    const line = gen.split('\n').find((l) => l.includes('Here, dog.'))!;
    expect(line).toContain("voice: 'player'");
    expect(line).not.toContain('speaker');
  });

  it('F198 RED — a `You:` line with a (voice) override', () => {
    expectError(
      DOG.replace(
        '> Kihei crosses the cleared ground on his round and stops beside you.',
        'You (villager): "Here, dog."',
      ),
      'a `You:` player line never takes a (voice) override',
    );
  });

  it('RED — an unknown trigger kind', () => {
    expectError(
      SILENT.replace('trigger: season-exit autumn', 'trigger: on-tuesday'),
      'unknown trigger "on-tuesday"',
    );
  });

  it('RED — season-exit without a season', () => {
    expectError(
      SILENT.replace('trigger: season-exit autumn', 'trigger: season-exit'),
      'season-exit trigger needs a season',
    );
  });

  it('RED — season-exit with an unknown season', () => {
    expectError(
      SILENT.replace('trigger: season-exit autumn', 'trigger: season-exit octember'),
      'unknown season "octember"',
    );
  });

  it('RED — a missing trigger', () => {
    expectError(SILENT.replace('trigger: season-exit autumn\n', ''), 'is missing "trigger:" meta');
  });

  it('RED — a scene-def react must be spoken by an NPC', () => {
    // Sayo is a NAMES entry but not a T0 NpcId — an invalid react speaker.
    expectError(
      DOG.replace(
        'Kihei: "Cleared is cleared. Stop the gap in the wall behind it."',
        '> A narrator react.',
      ),
      'a scene-def react must be a speech line spoken by an NPC',
    );
  });
});
