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
 * Release commits (`[skip ci]`) and merge commits are ignored; a breaking
 * change (`!`) is a major, otherwise the strongest bump among the commits wins.
 *
 * Usage: npx tsx scripts/release-bump.cts [--from <ref>]
 */

import { execSync } from 'child_process';

import { parseCommit, type ParsedCommit } from './emoji-commit-mapper.cts';

type Bump = ParsedCommit['semverBump'];

const RANK: Record<Bump, number> = { none: 0, patch: 1, minor: 2, major: 3 };

/** The last library/CLI release tag reachable from HEAD. MCP tags (`mcp-v*`) are not releases of this group. */
function lastReleaseTag(): string | null {
  try {
    return execSync('git describe --tags --abbrev=0 --match "v[0-9]*"', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

function commitSubjectsSince(ref: string | null): string[] {
  const range = ref ? `${ref}..HEAD` : 'HEAD';
  const output = execSync(`git log ${range} --no-merges --pretty=format:%s`, { encoding: 'utf-8' });

  return output
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.includes('[skip ci]'));
}

export function bumpFor(subjects: readonly string[]): Bump {
  let bump: Bump = 'none';

  for (const subject of subjects) {
    const parsed = parseCommit(subject);
    if (parsed && RANK[parsed.semverBump] > RANK[bump]) bump = parsed.semverBump;
  }

  return bump;
}

if (require.main === module) {
  const fromIndex = process.argv.indexOf('--from');
  const from = fromIndex > -1 ? process.argv[fromIndex + 1] : lastReleaseTag();

  process.stdout.write(bumpFor(commitSubjectsSince(from)));
}
