import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { CAPTURE_ENDPOINT, playtestInboxHandler } from './src/scripts/playtest-inbox';

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

// Single-dev-server guard (the concurrent-agent sprawl): `npm run dev` REFUSES to start a
// second server. If DEV_PORT is already listening, name the holder and exit — instead of
// silently cascading to 5174/5175/… and leaving a pile of servers behind. `strictPort` below
// is the belt-and-suspenders (vite itself won't cascade). Bypass with KAMI_ALLOW_MULTI_DEV=1.
const DEV_PORT = 5173;
function singleServerGuard(): void {
  if (process.env.KAMI_ALLOW_MULTI_DEV === '1') return;
  let holder: string;
  try {
    holder = execSync(`lsof -ti tcp:${DEV_PORT} -sTCP:LISTEN`, {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return; // lsof exits non-zero when nothing is listening ⇒ the port is free ⇒ proceed
  }
  if (!holder) return;
  const pid = holder.split('\n')[0];
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
      // Auto-reload OFF (human call, F75): the browser does NOT hot-reload or full-refresh
      // on a file change — the player hits F5 themselves (shields a live playtest from an
      // agent's mid-edit WIP flashing in). BUT the server must still WATCH + re-transform so
      // that a manual F5 serves fresh code (2026-07-05: `hmr:false` alone left the server
      // serving STALE modules until a restart). `usePolling` forces the watcher to detect
      // changes even where native fs events don't fire in this environment; the reload itself
      // is suppressed by the no-op HMR update in `handleHotUpdate` (plugin below), not here.
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
    },
    test: {
      // Core is pure and Node-importable; UI tests opt into jsdom via a per-file
      // `// @vitest-environment jsdom` pragma.
      environment: 'node',
      // root is 'src' (above), so test globs are resolved relative to it.
      include: ['**/*.test.ts'],
      globals: true,
    },
  };
});
