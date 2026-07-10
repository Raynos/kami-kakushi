import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { CAPTURE_ENDPOINT, playtestInboxHandler } from './src/scripts/playtest-inbox';
import {
  TELEMETRY_DROP_ENDPOINT,
  sweepTelemetryDir,
  telemetryDropHandler,
} from './src/scripts/telemetry-drop';

// The VERSION is the SINGLE SOURCE OF TRUTH from package.json — NOT git tags
// (human call, H1/2026-07-01): the game/HTML/TS must never read a git tag for
// its displayed version, so a tag lagging the build can't mislabel the footer.
// The build SHA + date remain a git-derived BUILD STAMP (a commit identifier,
// not a version) — and the SHA uses the raw short hash, never `describe --tags`.
// Env vars still win when set (CI / reproducible builds). (PRD §6.1.1 / Q54.)
function git(cmd: string): string | undefined {
  try {
    return execSync(`git ${cmd}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return undefined;
  }
}
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const VERSION = process.env.BUILD_VERSION ?? `v${pkg.version}`;
const BUILD_SHA = process.env.BUILD_SHA ?? git('rev-parse --short HEAD') ?? 'dev';
const BUILD_DATE = process.env.BUILD_DATE ?? git('log -1 --format=%cs') ?? 'dev';

// D-138 — T0-only: ship the CLIENT-SIDE DEV tools (__qa play-API, DEV panel +
// variant harness, balance cockpit, F6 fixtures) INTO the prod (gh-pages) bundle,
// default-OFF, opt-in via `?dev=yes`. Default = enabled (we're in T0). Flip back to
// the hard strip post-T0 with `SHIP_DEV_TOOLS=0` on the build (and the same env on
// verify-dev-strip.sh, which reads it too). `__DEV_TOOLS__` is the tree-shaking
// inclusion gate; the runtime activation is resolveDevGating() in src/app/. Server-
// coupled telemetry + playtest-capture stay on `import.meta.env.DEV` (they need a
// dev server absent on gh-pages) — out of scope here.
const SHIP_DEV_TOOLS = !['0', 'false', 'no', 'off'].includes(
  (process.env.SHIP_DEV_TOOLS ?? '').toLowerCase(),
);

// Single-dev-server guard (the concurrent-agent sprawl): `pnpm run dev` REFUSES to start a
// second server. If DEV_PORT is already listening, name the holder and exit — instead of
// silently cascading to 5174/5175/… and leaving a pile of servers behind. `strictPort` below
// is the belt-and-suspenders (vite itself won't cascade). Bypass with KAMI_ALLOW_MULTI_DEV=1.
//
// It must IGNORE ITSELF. Vite restarts IN-PROCESS when the config — or anything the config
// imports (playtest-inbox.ts, telemetry-drop.ts) — changes: restartServer() re-evaluates this
// file (re-running the guard) and only THEN closes the old server. So mid-restart :5173 is
// still listening, held by our OWN pid. Counting that as "someone else" made the dev server
// exit(1) on every edit to a config dep — it killed itself, and the playtest-capture POST was
// left with no inbox to reach (the human hit exactly this while an agent edited telemetry-drop).
const DEV_PORT = 5173;
function singleServerGuard(): void {
  if (process.env.KAMI_ALLOW_MULTI_DEV === '1') return;
  let listening: string;
  try {
    listening = execSync(`lsof -ti tcp:${DEV_PORT} -sTCP:LISTEN`, {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return; // lsof exits non-zero when nothing is listening ⇒ the port is free ⇒ proceed
  }
  const self = String(process.pid);
  const pid = listening
    .split('\n')
    .map((p) => p.trim())
    .find((p) => p && p !== self); // our own listener is a restart, not a rival
  if (!pid) return;
  console.error(
    `\n✗ A dev server is already running on :${DEV_PORT} (pid ${pid}).\n` +
      `  Refusing to start a second — use the running one, or stop it:\n` +
      `      kill ${pid}\n` +
      `  (bypass this guard with KAMI_ALLOW_MULTI_DEV=1)\n`,
  );
  process.exit(1);
}

// Static build for itch.io: relative base so the bundle works inside itch's
// cross-origin iframe sandbox (PRD §6.1 / §7.3). No server, no backend.
export default defineConfig(({ command }) => {
  // Guard ONLY the real dev server — never `vite build`, `vite preview`, or vitest (which all
  // load this config too, and must not be blocked by a running dev server).
  if (command === 'serve' && !process.env.VITEST && !process.argv.includes('preview')) {
    singleServerGuard();
  }
  return {
    // index.html lives in src/ (the web root); outDir climbs back to repo-root dist/.
    root: 'src',
    base: './',
    // Playtest-capture inbox (F3): a DEV-SERVER-ONLY endpoint the capture overlay POSTs to.
    // `apply: 'serve'` keeps it out of `vite build` entirely — the prod static bundle has no
    // server, so the endpoint is structurally absent from prod (never a shipped write surface).
    plugins: [
      {
        name: 'playtest-inbox',
        apply: 'serve',
        configureServer(server) {
          const pendingDir = fileURLToPath(
            new URL('./project/playtest-inbox/pending', import.meta.url),
          );
          server.middlewares.use(CAPTURE_ENDPOINT, playtestInboxHandler(pendingDir));
        },
      },
      {
        // Telemetry report drop (F8 Ph4): the attended-time report auto-drops on session-end
        // into git-ignored project/telemetry/ (local sensor data agents read — see its README).
        // Same `apply: 'serve'` shape as the inbox: structurally absent from any build.
        name: 'telemetry-drop',
        apply: 'serve',
        configureServer(server) {
          const dir = fileURLToPath(new URL('./project/telemetry', import.meta.url));
          // GC on boot as well as on every drop: a folder left full of tainted / 20-second
          // runs reads as play that never happened (see telemetry/retention.ts). NEVER under
          // vitest — it boots a vite server too, and the test lane must not touch the human's
          // sensor data (the 973b996 rule). The drop endpoint is unreachable there anyway.
          const swept = process.env.VITEST ? [] : sweepTelemetryDir(dir);
          if (swept.length > 0) {
            console.info(`[telemetry] swept ${swept.length} unusable report(s) from ${dir}`);
          }
          server.middlewares.use(TELEMETRY_DROP_ENDPOINT, telemetryDropHandler(dir));
        },
      },
      {
        // Watch + re-transform, but NEVER auto-reload the page (F75). The file-change still
        // invalidates the module graph (so a manual F5 serves fresh code); returning [] from
        // handleHotUpdate tells vite there is nothing to hot-update, so no `update` /
        // `full-reload` message is ever sent to the browser — a live playtest is never yanked.
        name: 'kami-no-auto-reload',
        apply: 'serve',
        handleHotUpdate() {
          return [];
        },
      },
    ],
    server: {
      // One dev server, on 5173, or none: pin the port and refuse to cascade. The
      // singleServerGuard above prints a friendly message first; strictPort is the backstop
      // so a race (port taken between the check and the bind) still fails instead of sprawling.
      port: DEV_PORT,
      strictPort: true,
      // Pre-transform the module graph at server start (parallel with browser
      // boot) so the FIRST page load doesn't pay on-demand compile — the e2e
      // lane's first test per run was eating ~5s of it. Paths are root-relative
      // (root is `src`).
      warmup: { clientFiles: ['./index.html', './app/main.ts'] },
      // Auto-reload OFF (human call, F75 — hardened 2026-07-10). A live playtest is NEVER
      // yanked from under the player (TST2). Vite has TWO reload paths and F75 only closed one:
      //   1. a file change → a `full-reload` message — suppressed by the no-op `handleHotUpdate`
      //      plugin above;
      //   2. a SERVER RESTART → vite re-execs this config whenever it (or anything it imports:
      //      playtest-inbox.ts, telemetry-drop.ts) changes, the HMR client's socket drops, and on
      //      reconnect `@vite/client` calls `location.reload()`. Nothing in path 1 touches this.
      // With agents editing config deps all day, path 2 was reloading the human's game session
      // mid-play. Only `hmr: false` closes it.
      //
      // `hmr:false` was tried alone on 2026-07-05 and reverted for serving STALE modules — that
      // was a missing WATCHER, not hmr. With `watch.usePolling` below the server re-transforms on
      // every edit, so a manual F5 still serves fresh code. Re-verified A/B on 2026-07-10 (edit a
      // config dep with a page open): HMR on ⇒ 1 reload, session destroyed; hmr:false ⇒ 0 reloads,
      // session survives, and a re-fetched module carries the new code.
      hmr: false,
      // `usePolling` forces the watcher to detect changes even where native fs events don't fire
      // in this environment — it is what keeps re-transform alive now that HMR is off.
      watch: { usePolling: true, interval: 250 },
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      target: 'es2022',
      sourcemap: true,
    },
    define: {
      // version + build stamp (PRD §6.1.1 / Q54) — resolved from git above.
      __VERSION__: JSON.stringify(VERSION),
      __BUILD_SHA__: JSON.stringify(BUILD_SHA),
      __BUILD_DATE__: JSON.stringify(BUILD_DATE),
      // D-138 — whether the client-side DEV tools are compiled INTO this bundle.
      // Always true in a dev serve (tools available locally); in a `vite build`
      // it follows SHIP_DEV_TOOLS (default true during T0). When statically false,
      // every `__DEV_TOOLS__ && …` gate dead-code-eliminates → the hard strip.
      __DEV_TOOLS__: JSON.stringify(command === 'serve' || SHIP_DEV_TOOLS),
    },
    test: {
      // Core is pure and Node-importable; UI tests opt into jsdom via a per-file
      // `// @vitest-environment jsdom` pragma.
      environment: 'node',
      // root is 'src' (above), so test globs are resolved relative to it.
      include: ['**/*.test.ts'],
      globals: true,
      // Speed levers to keep the `vitest` verify gate well under the 5s drift
      // budget (ADR-072). `threads` spawns workers faster than the default
      // `forks`, and `isolate: false` reuses each worker's module registry
      // across files instead of tearing it down per file — together ~4.8s → ~3s.
      // Safe here because the suite is isolation-clean: the pure core has no
      // shared mutable module state, and every UI file re-declares its own jsdom
      // env; validated by 3× shuffled-order runs all-green. If a future test
      // leaks cross-file state, drop `isolate: false` first (keeps most of the win).
      pool: 'threads',
      isolate: false,
    },
  };
});
