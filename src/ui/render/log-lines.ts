// Pure LOG-LINE content builders (split out of render/log.ts, 2026-07-13 render-split):
// quoted-speech voice inference, the speaker prefix, the FB-56 perk box, and the chat
// kicker map — all pure functions of an entry/text, shared by the log view and the VN.
import {
  NPC_NAME,
  NPC_VOICE,
  type LogEntry,
  type NpcId,
  type VoiceCategory,
  type AttrId,
} from '../../core';
import { el, VOICE_COLOR, ATTR_COLOR } from '../render';

// FB-228 — who speaks the quotes inside a narrator line? CONSERVATIVE inference:
// exactly ONE known NPC display name appearing in the line attributes its quotes to
// that NPC's voice; zero or several names ⇒ null (stay neutral, never mis-tint).
// One function feeds BOTH surfaces (the log's appendNarration + the VN's --voice).
export function inferQuoteVoice(text: string): VoiceCategory | null {
  let found: VoiceCategory | null = null;
  for (const [id, name] of Object.entries(NPC_NAME) as [NpcId, string][]) {
    if (!text.includes(name)) continue;
    if (found !== null) return null; // two speakers named — ambiguous, stay neutral
    found = NPC_VOICE[id];
  }
  return found;
}

export function inferQuoteVoiceColor(text: string): string | null {
  const v = inferQuoteVoice(text);
  return v ? VOICE_COLOR[v] : null;
}

// FB-50 — a spoken line gets a "Name: " prefix (the speaker's display name). The stored
// `entry.speaker` already IS the display name (NAMES.* / PLAYER_SPEAKER = "You"); NPC_NAME maps
// an id defensively should one ever arrive, else the value passes through. The voice colour
// rides on the line's `voice-<category>` class, so the prefix inherits it — no extra colour code.
export function speakerPrefixNode(entry: LogEntry): HTMLElement | null {
  if (entry.speaker === undefined || entry.speaker === '') return null;
  const name =
    NPC_NAME[entry.speaker as keyof typeof NPC_NAME] ?? entry.speaker;
  return el('span', 'log-speaker', `${name}: `);
}

// FB-56 — the intro perk-unlock milestone line "Perk unlocked — {name}: {desc} (±mechanics)" renders
// as an old-school JRPG PERK BOX, not the red milestone strip. Parse the single-source shape the
// core emits (`introPerkLine`); a non-perk milestone falls through to normal styling.
export function parsePerkLine(entry: LogEntry): {
  readonly name: string;
  readonly desc: string;
  readonly mechanics: string;
} | null {
  if (entry.channel !== 'milestone') return null;
  const m = /^Perk unlocked — (.+?): (.+) \(([^)]*)\)\s*$/.exec(entry.text);
  if (!m) return null;
  return { name: m[1]!, desc: m[2]!, mechanics: m[3]! };
}

export function buildPerkBox(
  line: HTMLElement,
  perk: {
    readonly name: string;
    readonly desc: string;
    readonly mechanics: string;
  },
): void {
  line.textContent = '';
  const box = el('div', 'perk-box');
  box.append(el('div', 'perk-tag', 'Perk unlocked'));
  box.append(el('div', 'perk-name', perk.name));
  box.append(el('div', 'perk-desc', perk.desc));
  box.append(buildStatLine(perk.mechanics));
  line.append(box);
}

// F137 — tint each "±N ATTR" token in a mechanics string with its attribute
// pigment (the 5-metal set), so a stat delta reads as belonging to its stat.
export function buildStatLine(mechanics: string): HTMLElement {
  const out = el('div', 'perk-stat');
  const re = /([+\-−]\d+\s+)(STR|AGI|INT|SPD|LUCK)/g;
  let idx = 0;
  for (const m of mechanics.matchAll(re)) {
    if (m.index > idx)
      out.append(document.createTextNode(mechanics.slice(idx, m.index)));
    const tok = el('span', 'stat-attr', `${m[1]}${m[2]}`);
    tok.style.color = ATTR_COLOR[m[2]!.toLowerCase() as AttrId];
    out.append(tok);
    idx = m.index + m[0].length;
  }
  if (idx < mechanics.length)
    out.append(document.createTextNode(mechanics.slice(idx)));
  return out;
}

// Split narration text into narrator prose + quoted-speech runs, wrapping each "…" (straight
// or curly) in a .speech span so a spoken line reads as a distinct voice (FB-23). Non-narration
// channels paint as plain text.
export function appendNarration(line: HTMLElement, text: string): void {
  const re = /"[^"]*"|[“][^”]*[”]/g;
  // FB-228 — a quote embedded in narration ('"…," Genemon says') is that character
  // SPEAKING: tint it with their voice colour when the speaker is unambiguous.
  const quoteColor = inferQuoteVoiceColor(text);
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last)
      line.append(document.createTextNode(text.slice(last, m.index)));
    const span = el('span', 'speech', m[0]);
    if (quoteColor) span.style.color = quoteColor;
    line.append(span);
    last = m.index + m[0].length;
  }
  if (last < text.length)
    line.append(document.createTextNode(text.slice(last)));
}

// F127/FB-165/FB-400 — chat grouping: a PURE function of the entries maps every chat
// line to its conversation partner (a player line finds its partner by LOOKAHEAD to
// the NPC's reply, so the group opens above the opening question, never mid-run).
// FB-400 retired the inline "— with X —" kicker rule: chat runs now wear the SAME
// 幕-card idiom as VN scene runs (stampSceneGroup), the opener's label as the lintel.
export function computeChatKickers(entries: readonly LogEntry[]): {
  openers: Map<number, string>;
  partners: Map<number, string>;
} {
  const openers = new Map<number, string>();
  const partners = new Map<number, string>(); // FB-400 — every chat line's conversation identity
  let current: string | null = null; // the active conversation partner
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i]!;
    if (e.chat !== true) {
      current = null; // a non-chat line breaks the run
      continue;
    }
    let partner =
      e.voice !== 'player' && e.speaker !== undefined ? e.speaker : null;
    if (partner === null) {
      // a player line: the partner is whoever replies next in this chat run
      for (let j = i + 1; j < entries.length; j++) {
        const n = entries[j]!;
        if (n.chat !== true) break;
        if (n.voice !== 'player' && n.speaker !== undefined) {
          partner = n.speaker;
          break;
        }
      }
      if (partner === null) partner = current; // mid-group player line
    }
    if (partner !== null && partner !== current) {
      // FB-270 — the group opener may carry a scene context ("the cold open",
      // "The day-hand promotion"); the head names it so the card has meaning.
      openers.set(
        e.key,
        e.context !== undefined ? `${partner} · ${e.context}` : partner,
      );
      current = partner;
    }
    if (partner !== null) partners.set(e.key, partner);
  }
  return { openers, partners };
}
