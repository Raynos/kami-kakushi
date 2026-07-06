import { describe, it, expect } from 'vitest';
import { NPC_VOICE, NPC_IDS } from './voices';

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
