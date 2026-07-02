// UI preferences — small, DEVICE-scoped display prefs that live in localStorage, NOT the
// game save (they're per-browser comfort settings, like the a11y text-scale, not run state).
// This is the persistence seam the F74 per-log font stepper reuses: a pure clamp + a
// try/guarded load/save round-trip, unit-testable against a localStorage mock. The core stays
// untouched (no DOM/storage in the pure core); the renderer owns the CSS-var application.

/** The per-log reading-text scale (F74). Bounds keep the log legible on washi at either end. */
export const LOG_SCALE_MIN = 0.85;
export const LOG_SCALE_MAX = 1.4;
export const LOG_SCALE_STEP = 0.1;
export const LOG_SCALE_DEFAULT = 1;

const LOG_SCALE_KEY = 'kk.ui.logScale';

/** Clamp to [MIN, MAX] and round to 2dp (kills float drift from repeated ±STEP steps). A
 *  non-finite / NaN input falls back to the default rather than poisoning the stored value. */
export function clampLogScale(n: number): number {
  if (!Number.isFinite(n)) return LOG_SCALE_DEFAULT;
  const clamped = Math.min(LOG_SCALE_MAX, Math.max(LOG_SCALE_MIN, n));
  return Math.round(clamped * 100) / 100;
}

/** Read the persisted log scale (default when absent/unreadable/corrupt). localStorage access is
 *  guarded — a privacy-mode / disabled-storage browser simply falls back to the default. */
export function loadLogScale(): number {
  try {
    const raw = localStorage.getItem(LOG_SCALE_KEY);
    if (raw == null) return LOG_SCALE_DEFAULT;
    return clampLogScale(Number.parseFloat(raw));
  } catch {
    return LOG_SCALE_DEFAULT;
  }
}

/** Persist the (clamped) log scale; returns the value actually stored so the caller can adopt it. */
export function saveLogScale(scale: number): number {
  const v = clampLogScale(scale);
  try {
    localStorage.setItem(LOG_SCALE_KEY, String(v));
  } catch {
    /* storage unavailable — keep the in-memory value; nothing else to do */
  }
  return v;
}
