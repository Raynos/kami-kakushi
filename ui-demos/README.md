# ui-demos — the UI-remaster variants (staging ground)

Five full, working remasters of the actual game's T0 (R0–R3) UI, per
[`project/archive/2026-07-02-ui-remaster-variants.md`](../project/archive/2026-07-02-ui-remaster-variants.md).
Same game — same 6-tab IA, verbs, numbers, log-centric shape — each variant a
generation better in its own direction. The midpoint between "change the CSS"
and "reinvent the UI" (never a reskin, never a reinvention).

## Review

```
npx serve ui-demos     # or any static server; ES modules need http://
```

Open the gallery (`/`), pick a variant, then use the bottom-right stage strip:
cold open → R0 → R1 → R2 → R3, plus the moments (play intro, face the wolf,
fight, answer the summons). Everything clickable is real against the mock
engine — rake, walk, trade, bank, train, fight, rung up.

## Layout

- `shared/data.js` — ALL canon T0 content, English-only (zero kanji/kana;
  romanized terms stay). Transcribed 1:1 from `src/core/content/*`.
- `shared/engine.js` — the mock engine: staged R0–R3 snapshots + live verbs +
  the 480ms tick loop. No real balance sim, no persistence.
- `shared/format.js` — `formatKMB` + `formatCoin` (mon → monme → ryō),
  mirroring `src/core/format.ts`.
- `shared/VARIANT-SPEC.md` — the contract every variant implements (screen
  inventory, engine API, the polish bar).
- `01-moonlit/ … 05-aizome/` — one directory per variant
  (`index.html` + `style.css` + `main.js`).

## Rules of this ground

- **Staging only.** Nothing here ships; prod wiring happens (if ever) as its
  own D-075 pass in `src/`. This dir never imports from `src/` and vice versa.
- Excluded from Prettier + ESLint (like `tmp/`).
- The engine is smoke-tested by driving the full R0→R3 arc in Node (see the
  session-47 journal); if you change `shared/`, re-drive it.
