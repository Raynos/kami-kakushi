#!/usr/bin/env tsx
/**
 * md-wrap — reflow (or check) markdown PROSE to the repo's ~72-char norm.
 *
 * The norm (AGENTS.md "Markdown prose width") is a SUGGESTION, not a gate: a
 * hard width check on markdown cries wolf on the things that legitimately
 * exceed it. So this tool is deliberately CONSERVATIVE — it only ever touches
 * a line it can improve by re-folding at an EXISTING space, and it leaves
 * everything else exactly as it found it:
 *
 *   - fenced code blocks (``` / ~~~)      - tables (a row cannot wrap)
 *   - headings, thematic breaks, HTML     - YAML frontmatter
 *   - link-reference definitions          - <!-- gen:begin --> regions
 *   - hard line breaks (trailing "  ")    - unbreakable tokens (URLs, paths)
 *
 * That last one is the important one, and the reason a narrower column was
 * never the real fix: a 100-char inline link is a single atom. No wrap width
 * splits it, so this tool does not pretend to — such a line is left alone and
 * is NOT reported as an offender.
 *
 * Usage:
 *   tsx src/scripts/md-wrap.ts <file...>              rewrite in place
 *   tsx src/scripts/md-wrap.ts --check <file...>      report, exit 1 if any
 *   tsx src/scripts/md-wrap.ts --check --new-only <f> report only lines this
 *                                                     working tree ADDED vs HEAD
 *
 * `--new-only` is what the PostToolUse hook uses: it honours the norm's "apply
 * to new/edited docs; don't mass-retrofit existing ones" clause, so editing one
 * line of a 300-line archive doc doesn't dump 40 pre-existing complaints.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

/** The repo's markdown prose width (AGENTS.md). Characters, not bytes. */
export const PROSE_WIDTH = 72;

const FENCE = /^\s{0,3}(```|~~~)/;
const TABLE = /^\s*\|/;
const HEADING = /^\s{0,3}#{1,6}(\s|$)/;
const THEMATIC = /^\s{0,3}([-*_])\s*(\1\s*){2,}$/;
const LINK_DEF = /^\s{0,3}\[[^\]]+\]:\s/;
const HTML_ISH = /^\s{0,3}</;
const BLANK = /^\s*$/;
const GEN_BEGIN = /<!--\s*gen:begin/;
const GEN_END = /<!--\s*gen:end/;
const HARD_BREAK = /(\s{2,}|\\)$/;
/** A list item: indent + marker + space. Captures indent and marker. */
const LIST_ITEM = /^(\s*)([-*+]|\d{1,9}[.)])(\s+)/;
/** Leading blockquote markers, e.g. "> " or ">> ". */
const QUOTE = /^(\s*(?:>\s?)+)/;

/** Character count (the norm counts characters, not bytes — CJK inflates bytes). */
export function width(s: string): number {
  return Array.from(s).length;
}

/**
 * Greedy fold of `text` at existing spaces, emitting `first` before the first
 * line and `cont` before every subsequent one. A token longer than the budget
 * is NEVER split — it overflows onto its own line, which is precisely how an
 * unbreakable URL survives untouched.
 */
export function fold(text: string, first: string, cont: string, max = PROSE_WIDTH): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const out: string[] = [];
  let prefix = first;
  let line = '';
  for (const w of words) {
    const candidate = line === '' ? w : `${line} ${w}`;
    if (line !== '' && width(prefix) + width(candidate) > max) {
      out.push(prefix + line);
      prefix = cont;
      line = w;
    } else {
      line = candidate;
    }
  }
  if (line !== '') out.push(prefix + line);
  return out;
}

/** True for a line that opens or continues a reflowable prose paragraph. */
function isProse(line: string): boolean {
  if (BLANK.test(line)) return false;
  // A bare ">" (or ">>") is a blockquote's PARAGRAPH SEPARATOR, not prose. It has
  // no text, so folding it away silently merges the paragraphs either side of it —
  // which is exactly what it did to project/todo-human.md's header before this
  // guard existed. Treat it as blank: verbatim, and it ends the open paragraph.
  if (QUOTE.test(line) && line.replace(QUOTE, '').trim() === '') return false;
  if (FENCE.test(line) || TABLE.test(line) || HEADING.test(line)) return false;
  if (THEMATIC.test(line) || LINK_DEF.test(line) || HTML_ISH.test(line)) return false;
  return true;
}

/** The prefix a paragraph's FIRST line carries, and the one its continuations get. */
function prefixesFor(line: string): { first: string; cont: string; text: string } {
  const quote = QUOTE.exec(line)?.[1] ?? '';
  const rest = line.slice(quote.length);
  const li = LIST_ITEM.exec(rest);
  if (li) {
    const indent = li[1] ?? '';
    const marker = li[2] ?? '';
    const gap = li[3] ?? '';
    const first = quote + indent + marker + gap;
    // Continuations of a list item hang under its text, not its bullet.
    return {
      first,
      cont: quote + ' '.repeat(width(indent + marker + gap)),
      text: rest.slice(li[0].length),
    };
  }
  const indent = /^\s*/.exec(rest)?.[0] ?? '';
  return { first: quote + indent, cont: quote + indent, text: rest.slice(indent.length) };
}

/**
 * Reflow every prose paragraph in `src` to `max` columns. Pure and idempotent:
 * reflow(reflow(x)) === reflow(x).
 */
export function reflow(src: string, max = PROSE_WIDTH): string {
  return analyze(src, max).out;
}

/**
 * The single pass behind both `reflow` and `offenders`.
 *
 * `prose` is the set of SOURCE line numbers (1-based) this pass treated as
 * reflowable prose. Everything else — fences, tables, headings, frontmatter,
 * gen-regions, hard-break paragraphs — is verbatim, and offenders() MUST NOT
 * report it. Deriving that set here, in the one place that has the file's
 * context, is the whole point: judging a line in ISOLATION cannot know it sits
 * inside a ```code fence``` (which is precisely how offenders() once flagged a
 * shell one-liner in this very journal).
 */
function analyze(src: string, max = PROSE_WIDTH): { out: string; prose: Set<number> } {
  const lines = src.split('\n');
  const out: string[] = [];
  const prose = new Set<number>();
  let i = 0;

  // YAML frontmatter — verbatim.
  if (lines[0] === '---') {
    const end = lines.findIndex((l, n) => n > 0 && l === '---');
    if (end !== -1) {
      out.push(...lines.slice(0, end + 1));
      i = end + 1;
    }
  }

  let inFence = false;
  let inGen = false;
  while (i < lines.length) {
    const line = lines[i] ?? '';

    if (FENCE.test(line)) inFence = !inFence;
    if (GEN_BEGIN.test(line)) inGen = true;
    const genClosing = GEN_END.test(line);

    // Verbatim zones: code fences, generated regions, and every non-prose line.
    if (inFence || inGen || !isProse(line)) {
      out.push(line);
      if (genClosing) inGen = false;
      i++;
      continue;
    }

    // Gather the paragraph: this line plus its flush continuations.
    const { first, cont, text } = prefixesFor(line);
    const parts = [text];
    let j = i + 1;
    let hardBreak = HARD_BREAK.test(line);
    while (j < lines.length) {
      const next = lines[j] ?? '';
      if (!isProse(next) || FENCE.test(next) || GEN_BEGIN.test(next)) break;
      // A new list item, or a differently-quoted line, starts a new block.
      const nq = QUOTE.exec(next)?.[1] ?? '';
      if (LIST_ITEM.test(next.slice(nq.length))) break;
      if (nq !== (QUOTE.exec(line)?.[1] ?? '')) break;
      if (HARD_BREAK.test(next)) hardBreak = true;
      parts.push(next.slice(nq.length).trim());
      j++;
    }

    // A hard line break is deliberate authorship — never re-fold that paragraph.
    if (hardBreak) {
      for (let k = i; k < j; k++) out.push(lines[k] ?? '');
    } else {
      // These source lines ARE reflowable prose — the only lines offenders() may flag.
      for (let k = i; k < j; k++) prose.add(k + 1);
      out.push(...fold(parts.join(' '), first, cont, max));
    }
    i = j;
  }

  return { out: out.join('\n'), prose };
}

/**
 * The lines a human should actually go fix. Three conditions, ALL required —
 * each one is a distinct way this could otherwise cry wolf:
 *
 *  1. the line is REFLOWABLE PROSE in file context (not a fence/table/heading/
 *     gen-region/frontmatter line — `analyze` decides this, because only it has
 *     the surrounding context);
 *  2. it exceeds `max`;
 *  3. folding it would actually SHORTEN it — so a line whose overflow is one
 *     unbreakable token (a long URL or path) is not an offender, by construction.
 */
export function offenders(src: string, max = PROSE_WIDTH): { line: number; text: string }[] {
  const { prose } = analyze(src, max);
  const lines = src.split('\n');
  const hits: { line: number; text: string }[] = [];
  for (let n = 0; n < lines.length; n++) {
    if (!prose.has(n + 1)) continue; // (1) verbatim in context — never report
    const text = lines[n] ?? '';
    if (width(text) <= max) continue; // (2)
    const { first, cont } = prefixesFor(text);
    const body = text.slice(width(first));
    if (fold(body, first, cont, max).length > 1) hits.push({ line: n + 1, text }); // (3)
  }
  return hits;
}

/** Line numbers this working tree ADDED/CHANGED vs HEAD (all lines if untracked). */
function addedLines(file: string): Set<number> | null {
  let diff = '';
  try {
    diff = execFileSync('git', ['diff', '-U0', 'HEAD', '--', file], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return null; // not a repo / not tracked → treat every line as new
  }
  if (diff.trim() === '') {
    // No diff vs HEAD. Either untracked (everything is new) or unchanged (nothing is).
    try {
      execFileSync('git', ['ls-files', '--error-unmatch', file], {
        stdio: ['ignore', 'ignore', 'ignore'],
      });
      return new Set(); // tracked and unchanged — nothing to report
    } catch {
      return null; // untracked — all lines are new
    }
  }
  const added = new Set<number>();
  for (const m of diff.matchAll(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/gm)) {
    const start = Number(m[1]);
    const count = m[2] === undefined ? 1 : Number(m[2]);
    for (let n = start; n < start + count; n++) added.add(n);
  }
  return added;
}

function main(): void {
  const argv = process.argv.slice(2);
  const check = argv.includes('--check');
  const newOnly = argv.includes('--new-only');
  const files = argv.filter((a) => !a.startsWith('--'));

  if (files.length === 0) {
    console.error('usage: md-wrap.ts [--check] [--new-only] <file.md...>');
    process.exit(2);
  }

  let bad = 0;
  let fixed = 0;
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const src = readFileSync(file, 'utf8');

    if (!check) {
      const next = reflow(src);
      if (next !== src) {
        writeFileSync(file, next);
        fixed++;
        console.log(`  reflowed ${file}`);
      }
      continue;
    }

    let hits = offenders(src);
    if (newOnly) {
      const added = addedLines(file);
      if (added !== null) hits = hits.filter((h) => added.has(h.line));
    }
    if (hits.length === 0) continue;

    bad += hits.length;
    console.error(`${file} — ${hits.length} prose line(s) over ${PROSE_WIDTH} chars:`);
    for (const h of hits.slice(0, 12)) {
      console.error(`  ${h.line}: (${width(h.text)}) ${h.text.slice(0, 60)}…`);
    }
    if (hits.length > 12) console.error(`  … and ${hits.length - 12} more`);
  }

  if (check && bad > 0) {
    console.error(`\nReflow them, or run: pnpm run md:wrap <file>`);
    process.exit(1);
  }
  if (!check)
    console.log(
      fixed === 0 ? 'md-wrap: nothing to reflow.' : `md-wrap: reflowed ${fixed} file(s).`,
    );
}

// Only run the CLI when invoked directly (so the tests can import the pure fns).
if (process.argv[1]?.endsWith('md-wrap.ts')) main();
