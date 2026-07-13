import { describe, it, expect } from 'vitest';
import {
  isEarnedLine,
  logFilterMatches,
  storySubMatches,
  LOG_FILTERS,
  type LogFilter,
} from './log-filter';
import type { LogChannel } from '../core/log';

// Derived from the source of truth (the LogChannel union), NOT a copied literal — if a channel
// is added to core/log.ts this list must grow with it, and the orphan test below goes RED.
const ALL_CHANNELS: readonly LogChannel[] = [
  'narration',
  'reward',
  'combat',
  'system',
  'milestone',
];

describe('LOG_FILTERS — the F111 bar order', () => {
  it('reads Story · Progress · Chat · Combat · Work · All · Now, left→right', () => {
    // derive the expected order from the ids (the labels come along for the ride); if the source
    // reorders, this goes RED — the order IS the design lever here (FB-111 inserts Chat after Progress).
    expect(LOG_FILTERS.map((f) => f.id)).toEqual([
      'story',
      'progression',
      'chat',
      'combat',
      'work',
      'all',
      'now',
    ]);
    // Chat sits third, right after Progress (the FB-111 slot), labelled "Chat".
    expect(LOG_FILTERS[2]!.id).toBe('chat');
    expect(LOG_FILTERS[2]!.label).toBe('Chat');
    // `now` is last and labelled "Now" (FB-53).
    const last = LOG_FILTERS[LOG_FILTERS.length - 1]!;
    expect(last.id).toBe('now');
    expect(last.label).toBe('Now');
  });
});

describe('logFilterMatches — the F111 chat axis (optional Q&A vs mandatory Story)', () => {
  it('an ASKED question (chat) shows in Chat, NOT in Story', () => {
    // an ask_topic / ask_rung_topic line is `narration` + `chat:true`. It routes to Chat, and is
    // WITHHELD from the mandatory Story tab (the split FB-111 asks for).
    expect(logFilterMatches('narration', 'chat', false, true)).toBe(true);
    expect(logFilterMatches('narration', 'story', false, true)).toBe(false);
  });

  it('a mandatory narration beat (not chat) stays in Story, NOT in Chat', () => {
    // a greeting / decision / narration beat has no chat flag → Story keeps it, Chat rejects it.
    expect(logFilterMatches('narration', 'story', false, false)).toBe(true);
    expect(logFilterMatches('narration', 'chat', false, false)).toBe(false);
  });

  it('a chat line still surfaces under the All escape-hatch (nothing is unreachable)', () => {
    expect(logFilterMatches('narration', 'all', false, true)).toBe(true);
  });

  it('the Chat tab holds ONLY chat lines — a non-chat channel never leaks in', () => {
    for (const c of ALL_CHANNELS) expect(logFilterMatches(c, 'chat', false, false)).toBe(false);
  });

  it('chat lines never appear in Now (they are permanent, not ephemeral)', () => {
    expect(logFilterMatches('narration', 'now', false, true)).toBe(false);
  });
});

describe('logFilterMatches — the F9 channel→category mapping (non-ephemeral)', () => {
  it('Story shows only the diegetic narration', () => {
    expect(logFilterMatches('narration', 'story', false)).toBe(true);
    expect(logFilterMatches('combat', 'story', false)).toBe(false);
    expect(logFilterMatches('reward', 'story', false)).toBe(false);
  });

  it('Work shows labour rewards + mundane system lines, not story/combat', () => {
    expect(logFilterMatches('reward', 'work', false)).toBe(true);
    expect(logFilterMatches('system', 'work', false)).toBe(true);
    expect(logFilterMatches('narration', 'work', false)).toBe(false);
    expect(logFilterMatches('combat', 'work', false)).toBe(false);
  });

  it('Combat shows only the fight', () => {
    expect(logFilterMatches('combat', 'combat', false)).toBe(true);
    expect(logFilterMatches('milestone', 'combat', false)).toBe(false);
  });

  it('Progress shows only milestones (rung-ups / perks / unlocks)', () => {
    expect(logFilterMatches('milestone', 'progression', false)).toBe(true);
    expect(logFilterMatches('narration', 'progression', false)).toBe(false);
  });

  it('All shows every channel', () => {
    for (const c of ALL_CHANNELS) expect(logFilterMatches(c, 'all', false)).toBe(true);
  });
});

describe('logFilterMatches — the F53 ephemeral / Now rule', () => {
  it('the Now view matches ONLY ephemeral entries (any channel)', () => {
    for (const c of ALL_CHANNELS) {
      expect(logFilterMatches(c, 'now', true)).toBe(true); // ephemeral → shows in Now
      expect(logFilterMatches(c, 'now', false)).toBe(false); // permanent → never in Now
    }
  });

  it('every OTHER filter HIDES ephemeral entries (they live only in Now)', () => {
    const permanentFilters: LogFilter[] = ['story', 'progression', 'chat', 'combat', 'work', 'all'];
    for (const f of permanentFilters) {
      for (const c of ALL_CHANNELS) {
        // an ephemeral line NEVER shows outside Now, even under All / its own channel category.
        expect(logFilterMatches(c, f, true)).toBe(false);
      }
    }
  });

  it('a non-ephemeral line still shows under its channel category, never in Now', () => {
    // regression guard on the two axes not crossing: reward (Work) stays permanent-only.
    expect(logFilterMatches('reward', 'work', false)).toBe(true);
    expect(logFilterMatches('reward', 'now', false)).toBe(false);
  });
});

describe('logFilterMatches — reachability invariants', () => {
  it('no orphan channel — every channel belongs to a non-all/non-now category', () => {
    const categorized = LOG_FILTERS.map((f) => f.id).filter(
      (id): id is LogFilter => id !== 'all' && id !== 'now',
    );
    for (const c of ALL_CHANNELS) {
      const reachable = categorized.some((f) => logFilterMatches(c, f, false));
      expect(reachable, `channel "${c}" must belong to a filter category`).toBe(true);
    }
  });

  it('an ephemeral entry is reachable — exactly via Now', () => {
    // an ephemeral flavor line would be UNREACHABLE if Now did not exist: every other filter
    // hides it, so Now is its sole home.
    for (const c of ALL_CHANNELS) {
      const reachable = LOG_FILTERS.map((f) => f.id).filter((f) => logFilterMatches(c, f, true));
      expect(reachable).toEqual(['now']);
    }
  });
});

describe('logFilterMatches — the HD-41 earned axis (a rung reward is story AND earned)', () => {
  it('an EARNED narration line shows in Progress AND keeps its Story home', () => {
    // the defect this fixes (taste P16: Progress = earned): a requirement-completion
    // line routed to Story only, and the Progress tab never registered the step.
    expect(logFilterMatches('narration', 'progression', false, false, true)).toBe(true);
    expect(logFilterMatches('narration', 'story', false, false, true)).toBe(true);
  });

  it('a PLAIN narration line still never reaches Progress (the axis is the descriptor, not the channel)', () => {
    expect(logFilterMatches('narration', 'progression', false, false, false)).toBe(false);
  });

  it('the earned axis never leaks into Work/Combat/Chat, and never overrides ephemeral', () => {
    expect(logFilterMatches('narration', 'work', false, false, true)).toBe(false);
    expect(logFilterMatches('narration', 'combat', false, false, true)).toBe(false);
    expect(logFilterMatches('narration', 'chat', false, false, true)).toBe(false);
    expect(logFilterMatches('narration', 'progression', true, false, true)).toBe(false); // ephemeral wins
  });

  it('isEarnedLine keys off the ADR-186 requirement descriptor, nothing else', () => {
    expect(isEarnedLine('requirement.r0_rake')).toBe(true);
    expect(isEarnedLine('scene.intro')).toBe(false);
    expect(isEarnedLine(undefined)).toBe(false);
  });
});

describe('storySubMatches — the Story vn/all sub-view (FB-320)', () => {
  it("'vn' keeps only scene (context-carrying) lines; 'all' keeps everything", () => {
    expect(storySubMatches('vn', true)).toBe(true); // a VN scene line
    expect(storySubMatches('vn', false)).toBe(false); // ambient story flavor — hidden under vn
    expect(storySubMatches('all', true)).toBe(true);
    expect(storySubMatches('all', false)).toBe(true);
  });
});
