// The real DOM→PNG snapshotter for the capture overlay (FB-3 Ph2b). Kept in its own module so
// capture.ts stays dependency-free and fully unit-testable — main.ts injects this at the mount
// (as the overlay's `DomSnapshotter`). DEV-ONLY: imported only from main.ts's
// `import.meta.env.DEV` branch, so modern-screenshot dead-code-eliminates from the prod bundle
// with the rest of the overlay (verify-dev-strip.sh proves it) — the prod zero-runtime-dep
// guarantee holds; modern-screenshot is a devDependency.

import { domToPng } from 'modern-screenshot';
import type { DomSnapshotter } from './capture';

/** Rasterise `el` (the #app root) to a PNG data URL, or null on failure — a screenshot is a
 *  best-effort viewing aid (§2.3), never allowed to break the capture; the deterministic save
 *  in the .md is the authoritative repro. */
export const snapshotDom: DomSnapshotter = async (el) => {
  try {
    return await domToPng(el);
  } catch {
    return null;
  }
};
