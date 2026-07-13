#!/usr/bin/env python3
"""Reflow markdown prose to the ~72-char norm — content-preserving.

    python3 src/scripts/reflow-md.py <file.md> [more.md ...]   # in place

The 72-char wrap is a SOFT norm (AGENTS.md), deliberately not gated, so
this is an on-demand tool, not a verify gate. Born in session 195, which
reflowed the human-read session queue with it.

VERIFY EVERY RUN (AC-15 — a content-preserving transform is diffed, not
trusted). Strip blockquote '>' prefixes, split on whitespace, and the
token stream must be IDENTICAL before and after; the output must be
NUL-free. Count width in CHARACTERS, never bytes — an em-dash is 3
bytes, and a byte count overstates this repo's prose by ~7x.

Wide lines that REMAIN are the accepted exceptions: headings (cannot
wrap), table rows, long unbreakable links/paths, and gen:begin/gen:end
regions (a generator owns those — do not touch).

Careful with project/status/project-status.md: it is PINNED at a
120-line hard cap, so wrapping it narrower overflows the cap. It cannot
be reflowed — only rewritten (displace content, reset rewrite-debt).

Rewraps paragraphs, list items and blockquotes. Leaves verbatim:
headings, tables, hrules, code fences, HTML comments, blank lines.
Never splits a whitespace-free token (long URLs/paths stay long — the
accepted exception), never breaks on hyphens, and never lets a wrapped
continuation line begin with a token markdown would reinterpret as a
new block (-, *, +, >, #, |, `1.`).
"""
import re
import sys
import textwrap

WIDTH = 72

BULLET = re.compile(r'^(\s*)([-*+]|\d+\.)(\s+)(.*)$')
QUOTE = re.compile(r'^(\s*>\s?)(.*)$')
HEADING = re.compile(r'^\s*#')
TABLE = re.compile(r'^\s*\|')
HRULE = re.compile(r'^\s*(-{3,}|\*{3,}|_{3,})\s*$')
# a continuation line must not look like one of these
REINTERPRET = re.compile(r'^([-*+>#|]|\d+\.)(\s|$)')


def wrap(text, first_prefix, cont_prefix, width=WIDTH):
    """Wrap `text` under the given prefixes, pulling a word back up if a
    continuation line would start with a markdown-significant token."""
    lines = textwrap.wrap(
        text,
        width=width,
        initial_indent=first_prefix,
        subsequent_indent=cont_prefix,
        break_long_words=False,
        break_on_hyphens=False,
    )
    if not lines:
        return [first_prefix.rstrip()]

    # Fix any continuation line that would be re-read as a new block by
    # merging its leading word onto the previous line (slightly over 72
    # is strictly better than a silently-changed structure).
    fixed = True
    while fixed:
        fixed = False
        for i in range(1, len(lines)):
            body = lines[i][len(cont_prefix):]
            if REINTERPRET.match(body):
                words = body.split(' ')
                lines[i - 1] = lines[i - 1] + ' ' + words[0]
                rest = ' '.join(words[1:])
                if rest:
                    lines[i] = cont_prefix + rest
                else:
                    del lines[i]
                fixed = True
                break
    return lines


def indent_of(s):
    return len(s) - len(s.lstrip(' '))


def reflow(lines, width=WIDTH):
    out = []
    i = 0
    n = len(lines)
    in_fence = False
    in_comment = False

    while i < n:
        line = lines[i]
        stripped = line.strip()

        if in_comment:
            out.append(line)
            if '-->' in line:
                in_comment = False
            i += 1
            continue
        if stripped.startswith('<!--'):
            out.append(line)
            if '-->' not in line:
                in_comment = True
            i += 1
            continue
        if stripped.startswith('```') or stripped.startswith('~~~'):
            in_fence = not in_fence
            out.append(line)
            i += 1
            continue
        if in_fence or stripped == '':
            out.append(line)
            i += 1
            continue
        if HEADING.match(line) or TABLE.match(line) or HRULE.match(line):
            out.append(line)
            i += 1
            continue

        # --- blockquote: gather the run, reflow its inner doc, re-prefix
        q = QUOTE.match(line)
        if q:
            inner = []
            prefixes = []
            while i < n and QUOTE.match(lines[i]):
                m = QUOTE.match(lines[i])
                prefixes.append(m.group(1))
                inner.append(m.group(2))
                i += 1
            # normalise to the shortest '>' prefix seen (e.g. '> ')
            base = min(prefixes, key=len)
            if not base.endswith(' '):
                base = base + ' '
            # the quote prefix eats into the line budget, so the inner doc
            # wraps narrower — else '> ' + a 72-char line lands at 74.
            for il in reflow(inner, width - len(base)):
                out.append((base + il).rstrip() if il.strip() == '' else base + il)
            continue

        # --- bullet: gather its continuation lines
        b = BULLET.match(line)
        if b:
            lead, marker, gap, first = b.groups()
            first_prefix = lead + marker + gap
            cont_prefix = ' ' * len(first_prefix)
            body = [first]
            i += 1
            while i < n:
                nxt = lines[i]
                if nxt.strip() == '' or BULLET.match(nxt) or HEADING.match(nxt) \
                        or TABLE.match(nxt) or HRULE.match(nxt) or QUOTE.match(nxt) \
                        or nxt.strip().startswith('<!--'):
                    break
                if indent_of(nxt) <= len(lead):
                    break  # dedented out of this bullet
                body.append(nxt.strip())
                i += 1
            text = ' '.join(x for x in body if x)
            out.extend(wrap(text, first_prefix, cont_prefix, width))
            continue

        # --- paragraph: continuation lines must share the same indent
        lead = ' ' * indent_of(line)
        body = [line.strip()]
        i += 1
        while i < n:
            nxt = lines[i]
            if nxt.strip() == '' or BULLET.match(nxt) or HEADING.match(nxt) \
                    or TABLE.match(nxt) or HRULE.match(nxt) or QUOTE.match(nxt) \
                    or nxt.strip().startswith('<!--'):
                break
            if indent_of(nxt) != len(lead):
                break  # the author's indent shift is a real block boundary
            body.append(nxt.strip())
            i += 1
        out.extend(wrap(' '.join(body), lead, lead, width))

    return out


def main(path):
    with open(path, encoding='utf-8') as f:
        src = f.read()
    trailing_nl = src.endswith('\n')
    lines = src.split('\n')
    if trailing_nl:
        lines = lines[:-1]
    out = reflow(lines)
    result = '\n'.join(out) + ('\n' if trailing_nl else '')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(result)


if __name__ == '__main__':
    for p in sys.argv[1:]:
        main(p)
