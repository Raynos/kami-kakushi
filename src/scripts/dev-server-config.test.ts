// The dev server must never yank the human's live game session (F75, TST2 — "never yank the ground
// from under the player"). Vite has TWO reload paths, and the `kami-no-auto-reload` plugin only
// closes the file-change one. The other is a SERVER RESTART: vite re-execs vite.config.ts whenever
// it — or anything it imports (playtest-inbox.ts, telemetry-drop.ts) — changes, the HMR client's
// socket drops, and on reconnect `@vite/client` calls `location.reload()`. Agents edit those config
// deps constantly, so a human mid-playtest kept losing their run. `server.hmr: false` is the only
// setting that closes it; `watch.usePolling` is what keeps the server re-transforming (so a manual
// F5 still serves fresh code) now that HMR is off. The two belong together — assert both.
//
// RED-able: delete `hmr: false` (or set it true) and the first test fails; drop `usePolling` and the
// second fails, catching the stale-module regression that got `hmr:false` reverted back in 2026-07-05.
import { describe, it, expect } from 'vitest';
import config from '../../vite.config';

/** vite.config.ts default-exports a config FUNCTION; `build` skips the singleServerGuard's lsof. */
function resolve(): Record<string, unknown> {
  const fn = config as unknown as (env: {
    command: string;
    mode: string;
  }) => Record<string, unknown>;
  return fn({ command: 'build', mode: 'production' });
}

interface ServerCfg {
  hmr?: unknown;
  watch?: { usePolling?: unknown };
}

describe('vite dev server — the live playtest is never reloaded (F75)', () => {
  it('disables the HMR client, so a server restart cannot location.reload() the page', () => {
    const server = resolve().server as ServerCfg;
    expect(server.hmr).toBe(false);
  });

  it('keeps the polling watcher, so a manual F5 still serves freshly-transformed modules', () => {
    const server = resolve().server as ServerCfg;
    expect(server.watch?.usePolling).toBe(true);
  });
});
