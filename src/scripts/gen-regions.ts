// gen-regions.ts — surgical fenced-region splicing for "generate INTO an existing doc".
//
// The process layer mixes hand-written judgment prose with a few DERIVABLE facts
// (the gate roster, the active-plans list). Rather than own a whole generated
// file (gen-docs.ts's model, right for pure content), we splice ONLY the bytes
// between a pair of HTML-comment markers and preserve every byte outside them:
//
//   <!-- gen:begin <id> (pnpm run checkpoint — do not edit inside) -->
//   ...generated body (replaced on every run)...
//   <!-- gen:end <id> -->
//
// Guarantees (why --check can be a SOUND gate):
//   • byte-idempotent — splicing the same body twice yields identical bytes;
//   • surrounding prose is preserved exactly (a co-agent's concurrent edit
//     OUTSIDE the markers survives);
//   • a missing / malformed marker pair is a HARD, self-explaining error, never
//     a silent skip (the doc would otherwise drift undetected).
//
// Shared infrastructure: checkpoint.ts is the first consumer; the PRD-ripple
// tooling (F1b) imports it too. No top-level execution — pure functions only.

const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// A begin line is `<!-- gen:begin <id>` followed by a space or the closing `-->`
// (so the id "gate" never matches a "gate-roster" marker), ending in `-->`.
const beginRe = (id: string): RegExp =>
  new RegExp(`<!--\\s*gen:begin\\s+${escapeRegExp(id)}(?:\\s|-->)[^\\n]*-->\\s*$`);
const endRe = (id: string): RegExp =>
  new RegExp(`<!--\\s*gen:end\\s+${escapeRegExp(id)}\\s*-->\\s*$`);

export class MissingRegionError extends Error {
  constructor(
    public readonly id: string,
    detail: string,
  ) {
    super(
      `gen-regions: region "${id}" ${detail}. Re-add the marker pair\n` +
        `    <!-- gen:begin ${id} (pnpm run checkpoint — do not edit inside) -->\n` +
        `    <!-- gen:end ${id} -->\n` +
        `  (or run the marker migration), then regenerate.`,
    );
    this.name = 'MissingRegionError';
  }
}

/**
 * Replace the body between the `<id>` markers with `body`, preserving the marker
 * lines and every byte outside them. Idempotent. Throws MissingRegionError if the
 * marker pair is absent or out of order.
 */
export function spliceRegion(content: string, id: string, body: string): string {
  const lines = content.split('\n');
  const beginIdx = lines.findIndex((l) => beginRe(id).test(l));
  if (beginIdx === -1) throw new MissingRegionError(id, 'has no gen:begin marker');
  const endIdx = lines.findIndex((l, i) => i > beginIdx && endRe(id).test(l));
  if (endIdx === -1) throw new MissingRegionError(id, 'has a gen:begin but no matching gen:end');

  const before = lines.slice(0, beginIdx + 1);
  const after = lines.slice(endIdx);
  const bodyLines = body.length === 0 ? [] : body.split('\n');
  return [...before, ...bodyLines, ...after].join('\n');
}

/** True iff both markers for `id` are present and in order. */
export function hasRegion(content: string, id: string): boolean {
  const lines = content.split('\n');
  const beginIdx = lines.findIndex((l) => beginRe(id).test(l));
  if (beginIdx === -1) return false;
  return lines.findIndex((l, i) => i > beginIdx && endRe(id).test(l)) !== -1;
}

/**
 * Greedy word-wrap to ≤ `width` columns (the repo's ~72-char markdown-prose norm).
 * Deterministic — a pure function of its input — so a generated region stays
 * byte-stable across runs while adapting as the underlying list grows.
 */
export function wrap(text: string, width = 72): string {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let line = '';
  for (const w of words) {
    if (line === '') line = w;
    else if (line.length + 1 + w.length <= width) line += ' ' + w;
    else {
      out.push(line);
      line = w;
    }
  }
  if (line) out.push(line);
  return out.join('\n');
}
