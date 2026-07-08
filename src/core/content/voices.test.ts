import { describe, it, expect } from 'vitest';
import { NPC_VOICE, NPC_IDS, NPC_NAME, VOICE_CATEGORIES } from './voices';

// ADR-110 'lord' voice — the domain lord Shigemasa speaks in his OWN dedicated voice
// category (murasaki 紫 + the 殿 seal, applied by render.ts's exhaustive VOICE_COLOR /
// VOICE_SEAL maps), NOT the borrowed magistrate 'official'. RED against the pre-fix
// `shigemasa: 'official'`.
describe("NPC_VOICE — the 'lord' voice (D-110 R7)", () => {
  it('Shigemasa speaks as the lord, not a magistrate', () => {
    expect(NPC_VOICE.shigemasa).toBe('lord');
    expect(NPC_VOICE.shigemasa).not.toBe('official');
  });

  it('the lord voice is unique to Shigemasa — no other NPC borrows it', () => {
    const lordSpeakers = NPC_IDS.filter((id) => NPC_VOICE[id] === 'lord');
    expect(lordSpeakers).toEqual(['shigemasa']);
  });

  it('every NPC has a voice (the map is total over NPC_IDS)', () => {
    for (const id of NPC_IDS) expect(typeof NPC_VOICE[id]).toBe('string');
  });
});

// storywave G0 — the cast registry grew to the bible §04-cast. These guard the
// registry's internal integrity, derived from the registry itself (no copied name/id
// literals): RED if a new id is added to the type without an NPC_IDS entry, without a
// name or voice row, or reusing another id's nameplate.
describe('NPC registry integrity (storywave G0)', () => {
  it('NPC_IDS enumerates exactly the NPC_NAME / NPC_VOICE keys, no duplicates', () => {
    const ids = [...NPC_IDS].sort();
    expect(new Set(NPC_IDS).size).toBe(NPC_IDS.length);
    expect(Object.keys(NPC_NAME).sort()).toEqual(ids);
    expect(Object.keys(NPC_VOICE).sort()).toEqual(ids);
  });

  it('every id has a non-empty nameplate', () => {
    for (const id of NPC_IDS) {
      expect(typeof NPC_NAME[id]).toBe('string');
      expect(NPC_NAME[id].length).toBeGreaterThan(0);
    }
  });

  it('every nameplate resolves back to its own id (names unique across the roster)', () => {
    const byName = new Map(NPC_IDS.map((id) => [NPC_NAME[id], id]));
    expect(byName.size).toBe(NPC_IDS.length); // a shared name would shrink the map
    for (const id of NPC_IDS) expect(byName.get(NPC_NAME[id])).toBe(id);
  });

  it('every id speaks in a registered voice category', () => {
    for (const id of NPC_IDS) expect(VOICE_CATEGORIES).toContain(NPC_VOICE[id]);
  });
});
