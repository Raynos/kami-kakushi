// @vitest-environment jsdom
//
// Drives the capture overlay through the REAL DOM flow — a genuine Backquote KeyboardEvent,
// typing into the real textarea, a ⌘/Ctrl+Enter submit — with an injected POST + snapshotter.
// RED-able: if the hotkey stopped opening the box, the input-guard regressed, the note stopped
// reaching the POST body, or the screenshot stopped flowing, an assert below flips red.
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mountCapture, CAPTURE_SENTINEL, type CaptureBaseContext } from './capture';

const SERVER_FILENAME_RE = /^[A-Za-z0-9T.-]+\.md$/;

function baseCtx(): CaptureBaseContext {
  return {
    build: { version: 'v0.3.5', sha: 'abc1234', date: '2026-07-03' },
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

let unmount: () => void = () => {};
let host: HTMLElement;
let posts: { url: string; body: string }[];

function mount(over: Partial<Parameters<typeof mountCapture>[0]> = {}): void {
  posts = [];
  unmount = mountCapture({
    host,
    buildContext: baseCtx,
    now: () => new Date('2026-07-04T21:53:00Z'),
    post: async (url, body) => {
      posts.push({ url, body });
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
  it('opens on Backquote and toggles closed on a second press', () => {
    mount();
    expect(boxEl()).toBeNull();
    hotkey();
    expect(boxEl()).not.toBeNull();
    expect(boxEl()!.dataset.kamiCapture).toBe(CAPTURE_SENTINEL);
    hotkey();
    expect(boxEl()).toBeNull();
  });

  it('is inert while focused in an input/textarea (the backtick is a character there)', () => {
    mount();
    const input = document.createElement('input');
    document.body.appendChild(input);
    hotkey(input); // e.target is the input → guard skips
    expect(boxEl()).toBeNull();
  });

  it('Escape cancels without posting', async () => {
    mount();
    hotkey();
    const ta = boxEl()!.querySelector('textarea')!;
    ta.value = 'discarded';
    ta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await flush();
    expect(boxEl()).toBeNull();
    expect(posts).toHaveLength(0);
  });
});

describe('mountCapture — submit', () => {
  it('⌘/Ctrl+Enter posts a well-formed capture carrying the note, and closes the box', async () => {
    mount();
    hotkey();
    const ta = boxEl()!.querySelector('textarea')!;
    ta.value = 'the open-eyes button sits off centre';
    ta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true }));
    await flush();

    expect(posts).toHaveLength(1);
    expect(posts[0]!.url).toBe('/__playtest-capture');
    const payload = JSON.parse(posts[0]!.body) as { filename: string; markdown: string };
    expect(payload.filename).toMatch(SERVER_FILENAME_RE);
    expect(payload.markdown).toContain('the open-eyes button sits off centre');
    expect(payload.markdown).toContain('seed: 20260626');
    expect(boxEl()).toBeNull(); // vanished on send
  });

  it('flows an injected screenshot into the POST body + the frontmatter', async () => {
    const png =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    mount({ snapshot: async () => png });
    hotkey();
    const ta = boxEl()!.querySelector('textarea')!;
    ta.value = 'glitch';
    ta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', metaKey: true, bubbles: true }));
    await flush();

    const payload = JSON.parse(posts[0]!.body) as { markdown: string; screenshot?: string };
    expect(payload.screenshot).toBe(png);
    expect(payload.markdown).toMatch(/^screenshot: .+\.png$/m);
  });

  it('a failed POST falls back to a file download (no throw)', async () => {
    const origCreate = URL.createObjectURL;
    const origRevoke = URL.revokeObjectURL;
    URL.createObjectURL = () => 'blob:mock';
    URL.revokeObjectURL = () => {};
    try {
      let downloaded = '';
      mount({ post: async () => false });
      // capture the download anchor's filename
      const origClick = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
        downloaded = this.download;
      };
      try {
        hotkey();
        const ta = boxEl()!.querySelector('textarea')!;
        ta.value = 'offline note';
        ta.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true }),
        );
        await flush();
        expect(downloaded).toMatch(SERVER_FILENAME_RE);
        // downloadFallback revokes the object URL on a setTimeout(0); flush it here so it fires
        // while URL.revokeObjectURL is still stubbed (the finally below restores jsdom's throwing
        // impl — an unflushed revoke timer would then throw post-test).
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
