// verify-changelog — the CHANGELOG must document the CURRENT version (single-source consistency).
//
// The displayed game version is single-sourced from package.json (AC-21). This gate makes
// CHANGELOG.md a first-class part of that contract: the package.json `version` MUST have a
// matching `## [x.y.z]` release section (Keep-a-Changelog format). So a version bump that forgets
// its changelog entry FAILS verify — at commit (pre-commit), push (pre-push), and CI — and can't
// be quietly shipped. It lives as a verify GATE (the highest rung that soundly holds the rule:
// a content invariant, not a diff heuristic, so it never cries wolf and can't be forgotten).
export {};

import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as {
  version: string;
};
const { version } = pkg;
const changelog = readFileSync(new URL('../../CHANGELOG.md', import.meta.url), 'utf8');

// Keep-a-Changelog release headings look like:  ## [0.3.4] — 2026-07-02
// Match the version in brackets at the start of a line, tolerant of the trailing " — <date>".
const headingRe = new RegExp(`^##\\s*\\[${version.replace(/\./g, '\\.')}\\]`, 'm');

if (!headingRe.test(changelog)) {
  console.error(`  X verify-changelog: package.json is v${version}, but CHANGELOG.md has no`);
  console.error(`    "## [${version}]" release section.`);
  console.error(`    A version bump must be documented — add the entry (newest first,`);
  console.error(`    Keep-a-Changelog format). See CHANGELOG.md.`);
  process.exit(1);
}
console.log(`  ✓ verify-changelog: CHANGELOG.md documents v${version}.`);
process.exit(0);
