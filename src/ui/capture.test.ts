// @vitest-environment jsdom
//
// Drives the capture overlay through the REAL DOM flow — a genuine Backquote KeyboardEvent, typing
// into the real textarea, a ⌘/Ctrl+Enter submit — with an injected POST + snapshotter + session id.
// RED-able: if the hotkey stopped opening the box, the input-guard regressed, the note stopped
// reaching the POST, the screenshot stopped flowing, or captures stopped sharing one session file,
// an assert below flips red.
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mountCapture, CAPTURE_SENTINEL, type CaptureEntryContext } from './capture';

const SESSION = '2026-07-04T21-53-00-testid';

function baseCtx(): CaptureEntryContext {
  return {
    seed: 20260626,
    clock: { day: 1, tick: 2 },
    location: 'home-paddies',
    rung: 'R1',
    tier: 0,
    activeTab: 'work',
    variants: {},
    viewport: { w: 1728, h: 1117, dpr: 2 },
    url: '/',
    saveBase64: 'SAVE==',
    logTail: [],
  };
}

const flush = (): Promise<void> => new Promise((r) => setTimeout(r, 0));
const boxEl = (): HTMLElement | null => document.querySelector(`[data-kami-capture]`);
const hotkey = (target: EventTarget = document): void => {
  target.dispatchEvent(new KeyboardEvent('keydown', { code: 'Backquote', bubbles: true }));
};
async function typeAndSend(note: string): Promise<void> {
  const ta = boxEl()!.querySelector('textarea')!;
  ta.value = note;
  ta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true }));
  await flush();
}

interface Post {
  url: string;
  body: {
    session: string;
    header: string;
    entry: string;
    screenshot?: string;
    screenshotName?: string;
  };
}
let unmount: () => void = () => {};
let host: HTMLElement;
let posts: Post[];

function mount(over: Partial<Parameters<typeof mountCapture>[0]> = {}): void {
  posts = [];
  unmount = mountCapture({
    host,
    build: { version: 'v0.3.5', sha: 'abc1234', date: '2026-07-03' },
    buildContext: baseCtx,
    now: () => new Date('2026-07-04T21:53:00Z'),
    sessionId: SESSION,
    post: async (url, body) => {
      posts.push({ url, body: JSON.parse(body) });
      return true;
    },
    ...over,
  });
}

beforeEach(() => {
  document.body.innerHTML = '';
  host = document.createElement('div');
  document.body.appendChild(host);
});
afterEach(() => unmount());

describe('mountCapture — hotkey + box', () => {
  it('opens on Backquote, toggles closed, and is inert while focused in an input', () => {
    mount();
    expect(boxEl()).toBeNull();
    hotkey();
    expect(boxEl()!.dataset.kamiCapture).toBe(CAPTURE_SENTINEL);
    hotkey();
    expect(boxEl()).toBeNull();

    const input = document.createElement('input');
    document.body.appendChild(input);
    hotkey(input);
    expect(boxEl()).toBeNull();
  });

  it('Escape cancels without posting', async () => {
    mount();
    hotkey();
    boxEl()!
      .querySelector('textarea')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();
    expect(boxEl()).toBeNull();
    expect(posts).toHaveLength(0);
  });
});

describe('mountCapture — submit', () => {
  it('posts session + header + entry carrying the note, and closes the box', async () => {
    mount();
    hotkey();
    await typeAndSend('the open-eyes button sits off centre');
    expect(posts).toHaveLength(1);
    expect(posts[0]!.url).toBe('/__playtest-capture');
    expect(posts[0]!.body.session).toBe(SESSION);
    expect(posts[0]!.body.header).toContain('# Playtest session');
    expect(posts[0]!.body.entry).toContain('the open-eyes button sits off centre');
    expect(posts[0]!.body.entry).toContain('seed 20260626');
    expect(boxEl()).toBeNull();
  });

  it('all captures in one mount share the SAME session id (→ one file)', async () => {
    mount();
    hotkey();
    await typeAndSend('first');
    hotkey();
    await typeAndSend('second');
    expect(posts).toHaveLength(2);
    expect(posts[0]!.body.session).toBe(posts[1]!.body.session);
    expect(posts[0]!.body.entry).not.toBe(posts[1]!.body.entry);
  });

  it('flows an injected screenshot into the POST + references it in the entry', async () => {
    const png =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    mount({ snapshot: async () => png });
    hotkey();
    await typeAndSend('glitch');
    expect(posts[0]!.body.screenshot).toBe(png);
    expect(posts[0]!.body.screenshotName).toMatch(/\.png$/);
    expect(posts[0]!.body.entry).toContain(`${SESSION}/`);
  });

  it('a failed POST falls back to a file download (no throw)', async () => {
    const origCreate = URL.createObjectURL;
    const origRevoke = URL.revokeObjectURL;
    URL.createObjectURL = () => 'blob:mock';
    URL.revokeObjectURL = () => {};
    try {
      let downloaded = '';
      mount({ post: async () => false });
      const origClick = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
        downloaded = this.download;
      };
      try {
        hotkey();
        await typeAndSend('offline note');
        expect(downloaded).toContain(SESSION);
        await flush();
      } finally {
        HTMLAnchorElement.prototype.click = origClick;
      }
    } finally {
      URL.createObjectURL = origCreate;
      URL.revokeObjectURL = origRevoke;
    }
  });
});
