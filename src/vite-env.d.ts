/// <reference types="vite/client" />

// Compile-time version + build stamp injected by vite.config.ts (PRD §6.1.1 / Q54).
declare const __VERSION__: string; // from package.json (single source), e.g. "v0.3.1"
declare const __BUILD_SHA__: string; // full git describe, e.g. "v0.2-55-g0d2fa28"
declare const __BUILD_DATE__: string;
