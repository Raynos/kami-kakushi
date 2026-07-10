// The dev server must never yank the human's live game session (F75/FB-257, TST2 — "never yank the
// ground from under the player"). Vite can reload the page from three places:
//
//   1. a file change → a `full-reload` message. Closed by the no-op `handleHotUpdate`.
//   2. a SERVER RESTART → vite re-execs vite.config.ts whenever it, or anything it statically
//      imports (playtest-inbox.ts, telemetry-drop.ts), changes. Agents edit those constantly.
//   3. …the mechanism behind (2): `@vite/client`'s websocket closes, the client polls for the
//      server, then calls `location.reload()`.
//
// `server.hmr: false` was believed to close (2). It does NOT — measured 2026-07-10: the HMR
// websocket still accepts a 101 upgrade, and a restart still reloads an open page. The old version
// of this file asserted `hmr === false` *because* that supposedly "meant" no reload — a config value
// standing in for a behaviour — and it stayed green straight through a live regression. A false
// green is worse than no test (PH3), so that assertion is gone.
//
// The real fix: we serve our OWN `/@vite/client` — no websocket, no `location.reload()` anywhere in
// it. These tests pin the properties that make that true.
//
// RED-able: put `location.reload()` back in the stub → test 1 fails. Drop the `/@vite/env` import →
// test 3 fails (and the real game stops booting: dev `define` values are installed at runtime by
// env.mjs, never statically replaced). Re-add `import './styles.css'` to ui/index.ts → test 5 fails
// (a JS-imported stylesheet is served as a JS module that imports the client, dragging it back in).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import config, { INERT_VITE_CLIENT, VITE_CLIENT_PATH } from '../../vite.config';

/** vite.config.ts default-exports a config FUNCTION; `build` skips the singleServerGuard's lsof. */
function resolve(): Record<string, unknown> {
  const fn = config as unknown as (env: {
    command: string;
    mode: string;
  }) => Record<string, unknown>;
  return fn({ command: 'build', mode: 'production' });
}

interface ServerCfg {
  watch?: { usePolling?: unknown };
}

describe('vite dev server — the live playtest is never reloaded (F75/FB-257)', () => {
  it('the client we serve cannot navigate or reload the page', () => {
    expect(INERT_VITE_CLIENT).not.toContain('location.reload');
    expect(INERT_VITE_CLIENT).not.toContain('location.href');
    expect(INERT_VITE_CLIENT).not.toContain('location.replace');
  });

  it('the client we serve opens no socket, so a server restart cannot reach the page', () => {
    expect(INERT_VITE_CLIENT).not.toContain('WebSocket');
    expect(INERT_VITE_CLIENT).not.toContain('EventSource');
  });

  it('it still installs vite `define` globals — dev does not statically replace them', () => {
    // env.mjs assigns __DEV_TOOLS__ / __VERSION__ / __BUILD_* onto globalThis at runtime. Without
    // this import, boot() throws `__DEV_TOOLS__ is not defined` on the first paint.
    expect(INERT_VITE_CLIENT).toContain("import '/@vite/env'");
  });

  it("exports exactly what vite's generated CSS shim imports", () => {
    // `import { createHotContext } from "/@vite/client"` → import.meta.hot
    // `import { updateStyle, removeStyle } from "/@vite/client"`
    for (const sym of ['createHotContext', 'updateStyle', 'removeStyle']) {
      expect(INERT_VITE_CLIENT).toContain(`export function ${sym}`);
    }
    expect(VITE_CLIENT_PATH).toBe('/@vite/client');
  });

  it('the stylesheet is LINKED from html, never `import`ed from JS', () => {
    // A JS-imported stylesheet is served in dev as a JS module that imports @vite/client — which is
    // how the client (and its reload) reached the page even with the html tag stripped.
    const html = readFileSync('src/index.html', 'utf-8');
    expect(html).toMatch(/<link[^>]+rel="stylesheet"[^>]+href="\.\/ui\/styles\.css"/);
    const uiIndex = readFileSync('src/ui/index.ts', 'utf-8');
    expect(uiIndex).not.toMatch(/^\s*import\s+['"]\.\/styles\.css['"]/m);
  });

  it('keeps the polling watcher, so a manual F5 still serves freshly-transformed modules', () => {
    const server = resolve().server as ServerCfg;
    expect(server.watch?.usePolling).toBe(true);
  });
});
