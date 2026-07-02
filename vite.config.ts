import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

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

// Static build for itch.io: relative base so the bundle works inside itch's
// cross-origin iframe sandbox (PRD §6.1 / §7.3). No server, no backend.
export default defineConfig({
  // index.html lives in src/ (the web root); outDir climbs back to repo-root dist/.
  root: 'src',
  base: './',
  server: {
    // Auto-reload OFF (human call, F75): the dev server does NOT hot-reload or
    // full-refresh on a file change — the player hits F5 themselves. As a bonus
    // this shields a live playtest from an agent's mid-edit WIP flashing in
    // (the half-drawn state behind the F60 crash). Vite auto-restarts the server
    // when THIS config changes, so the switch takes effect on the next request.
    hmr: false,
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
});
