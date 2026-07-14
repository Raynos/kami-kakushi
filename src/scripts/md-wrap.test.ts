import { describe, expect, it } from 'vitest';
import { PROSE_WIDTH, offenders, reflow, width } from './md-wrap.js';

/** Every fixture derives its length from the SOURCE OF TRUTH, never a copied 72. */
const over = (word: string) =>
  `${word} `.repeat(Math.ceil((PROSE_WIDTH * 2) / (word.length + 1))).trim();

const longestLine = (s: string) => Math.max(...s.split('\n').map(width));

describe('reflow — the prose it SHOULD fold', () => {
  it('folds an over-long paragraph to within the norm', () => {
    const src = over('alpha');
    expect(width(src)).toBeGreaterThan(PROSE_WIDTH); // the test could go RED
    const out = reflow(src);
    expect(longestLine(out)).toBeLessThanOrEqual(PROSE_WIDTH);
    expect(out.split(/\s+/)).toEqual(src.split(/\s+/)); // content-preserving
  });

  it('is idempotent — reflow(reflow(x)) === reflow(x)', () => {
    const once = reflow(over('beta'));
    expect(reflow(once)).toBe(once);
  });

  it('rejoins a paragraph that was hard-wrapped at the OLD 80 width', () => {
    const src =
      'one two three four five six seven eight nine ten\neleven twelve thirteen';
    const out = reflow(src);
    expect(out.split('\n')[0]).toContain('eleven'); // pulled up into the first line
  });

  it('hangs a list item under its text, not its bullet', () => {
    const out = reflow(`- ${over('gamma')}`);
    const lines = out.split('\n');
    expect(lines.length).toBeGreaterThan(1); // it actually folded
    const [first = '', second = ''] = lines;
    expect(first.startsWith('- ')).toBe(true);
    expect(second.startsWith('  ')).toBe(true); // aligned to the text
    expect(second.trimStart().startsWith('-')).toBe(false); // NOT a new bullet
    expect(longestLine(out)).toBeLessThanOrEqual(PROSE_WIDTH);
  });

  it('keeps a blockquote quoted on every folded line', () => {
    const out = reflow(`> ${over('delta')}`);
    expect(out.split('\n').every((l) => l.startsWith('> '))).toBe(true);
    expect(longestLine(out)).toBeLessThanOrEqual(PROSE_WIDTH);
  });
});

describe('reflow — the things it MUST NOT touch', () => {
  const untouched = (src: string) => expect(reflow(src)).toBe(src);

  it('leaves a fenced code block verbatim, however long', () => {
    untouched(['```ts', `const x = '${over('code')}';`, '```'].join('\n'));
  });

  it('leaves a table row verbatim (a row cannot wrap)', () => {
    untouched(`| a | b |\n| --- | --- |\n| ${over('cell')} | x |`);
  });

  it('leaves an over-long heading verbatim', () => {
    untouched(`## ${over('title')}`);
  });

  it('leaves a generated gen-region verbatim', () => {
    untouched(
      [
        '<!-- gen:begin roster -->',
        over('gen'),
        '<!-- gen:end roster -->',
      ].join('\n'),
    );
  });

  it('leaves YAML frontmatter verbatim', () => {
    untouched(`---\ndescription: ${over('meta')}\n---`);
  });

  it('leaves a paragraph with a hard line break verbatim', () => {
    untouched(`${over('hard')}  \nnext line`);
  });

  // Regression: reflow ATE the bare ">" separators and merged the paragraphs
  // either side of them (it did this to project/todo-human.md's header for real).
  it('keeps a bare ">" — a blockquote paragraph separator — as a separator', () => {
    const out = reflow('> first para.\n>\n> second para.');
    expect(out.split('\n').filter((l) => l.trim() === '>')).toHaveLength(1);
    const [a, sep, b] = out.split('\n');
    expect(a).toBe('> first para.');
    expect(sep).toBe('>');
    expect(b).toBe('> second para.');
  });

  it('does not merge quoted paragraphs across a separator, even when folding', () => {
    const out = reflow(`> ${over('one')}\n>\n> ${over('two')}`);
    const sepAt = out.split('\n').findIndex((l) => l.trim() === '>');
    expect(sepAt).toBeGreaterThan(0); // the separator survived, mid-document
    expect(
      out
        .split('\n')
        .slice(0, sepAt)
        .every((l) => l.includes('one')),
    ).toBe(true);
    expect(
      out
        .split('\n')
        .slice(sepAt + 1)
        .every((l) => l.includes('two')),
    ).toBe(true);
  });

  it('does NOT split an unbreakable token — the long inline link survives', () => {
    const link = `[text](../../docs/plans/${'a'.repeat(PROSE_WIDTH * 2)}.md)`;
    const out = reflow(link);
    expect(out).toBe(link);
    expect(out).not.toContain('\n');
  });
});

describe('offenders — what the hook actually reports', () => {
  it('reports a genuinely over-long prose line', () => {
    const hits = offenders(over('epsilon'));
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]?.line).toBe(1);
  });

  it('reports NOTHING for a line reflow cannot improve (the unbreakable link)', () => {
    const link = `[t](https://example.com/${'b'.repeat(PROSE_WIDTH * 2)})`;
    expect(width(link)).toBeGreaterThan(PROSE_WIDTH); // it IS over the width…
    expect(offenders(link)).toEqual([]); // …and is still not an offender
  });

  it('reports nothing for prose already within the norm', () => {
    expect(offenders('short and sweet.')).toEqual([]);
  });

  // Regression: offenders() used to re-fold each line IN ISOLATION, which loses
  // the file context — so an over-long shell line inside a ```fence``` got
  // flagged. It did this for real, in this repo's own session journal.
  it('never reports a long line inside a code fence, even when the file is dirty', () => {
    const src = [
      over('realprose'), // a genuine offender, so the file is NOT clean
      '',
      '```sh',
      `diff <(git show HEAD:path.md | norm) <(norm < path.md)  # ${over('cmd')}`,
      '```',
    ].join('\n');
    const hits = offenders(src);
    expect(hits.length).toBeGreaterThan(0); // the real offender IS caught…
    expect(hits.every((h) => h.line === 1)).toBe(true); // …and ONLY it
  });

  it('never reports an over-long table row, even when the file is dirty', () => {
    const src = `${over('realprose')}\n\n| ${over('cell')} | x |`;
    const hits = offenders(src);
    expect(hits.map((h) => h.line)).toEqual([1]);
  });

  it('counts CJK by characters, not bytes', () => {
    const cjk = '神隠し'.repeat(10); // 30 chars, 90 bytes
    expect(width(cjk)).toBe(30);
    expect(offenders(cjk)).toEqual([]); // under 72 CHARS, though over 72 bytes
  });
});
