import { defineConfig } from 'vite';

// Static build for itch.io: relative base so the bundle works inside itch's
// cross-origin iframe sandbox (PRD §6.1 / §7.3). No server, no backend.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2022',
    sourcemap: true,
  },
  define: {
    // commit-SHA build stamp (PRD §6.1.1 / Q54) — injected at build time.
    __BUILD_SHA__: JSON.stringify(process.env.BUILD_SHA ?? 'dev'),
    __BUILD_DATE__: JSON.stringify(process.env.BUILD_DATE ?? 'dev'),
  },
  test: {
    // Core is pure and Node-importable; UI tests opt into jsdom via a per-file
    // `// @vitest-environment jsdom` pragma.
    environment: 'node',
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    globals: true,
  },
});
