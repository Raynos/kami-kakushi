import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';

// Resolve a build identity from git at config-load time so both `vite` (dev)
// and `vite build` stamp a real version — no env wiring required. Env vars
// still win when set (CI / reproducible builds); git is the fallback; 'dev'
// only if git is unavailable. (PRD §6.1.1 / Q54.)
function git(cmd: string): string | undefined {
  try {
    return execSync(`git ${cmd}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return undefined;
  }
}
const VERSION = process.env.BUILD_VERSION ?? git('describe --tags --abbrev=0') ?? 'dev';
const BUILD_SHA = process.env.BUILD_SHA ?? git('describe --tags --dirty') ?? 'dev';
const BUILD_DATE = process.env.BUILD_DATE ?? git('log -1 --format=%cs') ?? 'dev';

// Static build for itch.io: relative base so the bundle works inside itch's
// cross-origin iframe sandbox (PRD §6.1 / §7.3). No server, no backend.
export default defineConfig({
  // index.html lives in src/ (the web root); outDir climbs back to repo-root dist/.
  root: 'src',
  base: './',
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
