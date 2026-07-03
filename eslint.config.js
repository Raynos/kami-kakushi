import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

// Transcendental Math methods banned in the pure core (PRD §6.1 / Q36): every
// growth-curve power is integer-pow-by-repeated-multiplication so a fixed seed
// replays byte-identically across engines. Math.sqrt is whitelisted (not listed).
const BANNED_MATH = [
  'pow',
  'exp',
  'expm1',
  'log',
  'log2',
  'log10',
  'log1p',
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'atan2',
  'sinh',
  'cosh',
  'tanh',
  'asinh',
  'acosh',
  'atanh',
  'cbrt',
  'hypot',
];

const CORE_FORBIDDEN_GLOBALS = [
  'window',
  'document',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'navigator',
  'location',
  'fetch',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'caches',
  'XMLHttpRequest',
  'WebSocket',
  'alert',
];

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'project/archive/**',
      'src/scripts/*.mjs',
      'tmp/**',
      // ui-demos: the UI-remaster staging ground (plain browser JS demos, not product code)
      'ui-demos/**',
      // co-agent git worktrees: transient full-repo checkouts, never this checkout's code
      '.claude/worktrees/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // TS handles undefined identifiers; eslint's no-undef false-positives on types.
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // ---- the pure-core boundary (CLAUDE.md conventions / PRD §6.1, §6.2) ----
  {
    files: ['src/core/**/*.ts'],
    ignores: ['src/core/**/*.test.ts'],
    languageOptions: {
      // No DOM/window/Node globals in core — it must import cleanly in Node.
      globals: { ...globals.es2021 },
    },
    rules: {
      'no-restricted-globals': [
        'error',
        ...CORE_FORBIDDEN_GLOBALS.map((name) => ({
          name,
          message: `core is pure & deterministic: no '${name}' in src/core (PRD §6.1/§6.2).`,
        })),
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'Math',
          property: 'random',
          message: 'core uses the one seeded RNG (core/rng), never Math.random (PRD §6.1).',
        },
        ...BANNED_MATH.map((property) => ({
          object: 'Math',
          property,
          message: `core bans Math.${property}: use integer-pow; only Math.sqrt is whitelisted (PRD §6.1 / Q36).`,
        })),
        {
          object: 'Date',
          property: 'now',
          message:
            'core is clock-free: no Date.now in src/core — the save-layer tiebreaker exemption lives in src/persistence (FU2/§6.1).',
        },
        {
          object: 'performance',
          property: 'now',
          message: 'core is clock-free: no performance.now in src/core (PRD §6.1).',
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "NewExpression[callee.name='Date']",
          message: 'core is clock-free: no `new Date()` in src/core (PRD §6.1).',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/ui',
                '**/ui/**',
                '**/app',
                '**/app/**',
                '**/persistence',
                '**/persistence/**',
              ],
              message:
                'core may not import from ui/app/persistence — the dependency rule is one-directional (PRD §6.2).',
            },
          ],
        },
      ],
    },
  },

  // tests + scripts + config may use Node/DOM globals freely.
  {
    files: ['**/*.test.ts', 'src/scripts/**/*.ts', 'vite.config.ts', 'eslint.config.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
);
