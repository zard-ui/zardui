#!/usr/bin/env tsx

/**
 * Prints the semver bump the commits since the last release call for:
 * `major`, `minor`, `patch` or `none`.
 *
 * The deploy workflow uses it once a stable version is out, to decide what a
 * push to master publishes. Nx can derive a bump from conventional commits too,
 * but in a fixed release group it reads them through the first project only:
 * a `feat` that touches `libs/zard` reaches `cli` as a changed dependency and
 * comes out as a patch. The library and the CLI ship as one version, so the
 * bump is computed here over the whole repository and handed to Nx explicitly.
 *
 * The baseline is the last *stable* tag: a prerelease tag such as
 * `v1.0.1-beta.0` is skipped, or the commits between it and the stable release
 * before it would drop out of the bump. Release commits (`[skip ci]`) and merge
 * commits are ignored. A breaking change, marked with `!` in the subject or a
 * `BREAKING CHANGE:` footer in the body, is a major; otherwise the strongest
 * bump among the commits wins.
 *
 * Usage: npx tsx scripts/release-bump.cts [--from <ref>]
 */

import { execSync } from 'child_process';

import { parseCommit, type ParsedCommit } from './emoji-commit-mapper.cts';

type Bump = ParsedCommit['semverBump'];

const RANK: Record<Bump, number> = { none: 0, patch: 1, minor: 2, major: 3 };

/** A stable release tag of this group: `v1.2.3`, never `v1.2.3-beta.0` nor an MCP tag (`mcp-v*`). */
const STABLE_TAG = /^v\d+\.\d+\.\d+$/;

/** A `BREAKING CHANGE:` (or `BREAKING-CHANGE:`) footer marks a major even without `!` in the subject. */
const BREAKING_FOOTER = /^BREAKING[ -]CHANGE:/m;

/** Separators `git log` will not find inside a commit message. */
const FIELD = '\x1f';
const RECORD = '\x1e';

/** One commit, as far as the bump is concerned: its subject line and its body. */
export interface ReleaseCommit {
  subject: string;
  body: string;
}

/** The newest stable release tag reachable from HEAD. */
function lastStableReleaseTag(): string | null {
  const tags = execSync('git tag --merged HEAD --list "v*" --sort=-v:refname', { encoding: 'utf-8' })
    .split('\n')
    .map(tag => tag.trim());

  return tags.find(tag => STABLE_TAG.test(tag)) ?? null;
}

function commitsSince(ref: string | null): ReleaseCommit[] {
  const range = ref ? `${ref}..HEAD` : 'HEAD';
  const output = execSync(`git log ${range} --no-merges --pretty=format:%s%x1f%b%x1e`, { encoding: 'utf-8' });

  return output
    .split(RECORD)
    .map(record => {
      const [subject = '', body = ''] = record.split(FIELD);
      return { subject: subject.trim(), body: body.trim() };
    })
    .filter(commit => commit.subject && !commit.subject.includes('[skip ci]'));
}

export function bumpFor(commits: readonly ReleaseCommit[]): Bump {
  let bump: Bump = 'none';

  for (const { subject, body } of commits) {
    const parsed = parseCommit(subject);
    if (!parsed) continue;

    const commitBump: Bump = BREAKING_FOOTER.test(body) ? 'major' : parsed.semverBump;
    if (RANK[commitBump] > RANK[bump]) bump = commitBump;
  }

  return bump;
}

if (require.main === module) {
  const fromIndex = process.argv.indexOf('--from');
  const from = fromIndex > -1 ? process.argv[fromIndex + 1] : lastStableReleaseTag();

  process.stdout.write(bumpFor(commitsSince(from)));
}
