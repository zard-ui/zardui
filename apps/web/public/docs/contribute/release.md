---
title: Release
description: Releases are automated. This page exists so you know what happens to your commits after the merge — and why their format matters.
---

# Release

Releases are automated. This page exists so you know what happens to your commits after the merge — and why their format matters.

There is no manual release ritual. Merging into `master` triggers the deploy workflow, which builds, tests, versions, tags and publishes. Your commit messages are the input to that machine.

## The Pipeline

Six stages, defined in `.github/workflows/release.yml` .

1

A pull request is squash-merged into master

The deploy workflow triggers on every push to master, unless the commit message contains [skip ci] — which is how release commits avoid looping.

2

Build and test

The workflow reinstalls dependencies from the lockfile, runs npm run build, then npm test.

3

Registry refresh

npm run build:registry regenerates apps/web/public/r, and any change is committed as a [skip ci] chore.

4

Version and changelog

nx release version computes the bump from the commit types, then nx release changelog updates CHANGELOG.md. The conventional-commit mapping lives in nx.json.

5

Commit, tag and publish

The workflow commits 🔖 chore(release): publish v<version> [skip ci], tags it v<version>, and publishes the CLI to npm with provenance under the latest or beta tag.

6

GitHub release and notification

A GitHub release is created with generated notes, and a Discord webhook announces it.

What the release job runs

```
npm ci
npm run build
npm test
npm run build:registry
npx nx run zard:build
npx nx run cli:build
npx nx run mcp:build
npx nx release version <bump> --preid=beta --git-commit=false --git-tag=false
npx nx release changelog <version> --git-commit=false --git-tag=false
git tag -a "v<version>" -m "v<version>"
npm publish --provenance --access public --tag <latest|beta>
```

## Version Bump

The mapping from commit type to semver bump is configured under `release.conventionalCommits` in `nx.json` . Before versioning, the workflow runs `scripts/normalize-commits.cts` so the emoji prefix does not confuse the conventional-commit parser.

| Commits since the last release | Bump |
| --- | --- |
| Any commit marked with ! | major |
| At least one feat | minor |
| fix, perf or revert only | patch |
| docs, refactor, test, build, ci, style or chore only | none |

i

#### Beta by default

The workflow defaults to a `prerelease` bump with the `beta` preid, so day-to-day merges publish under the `beta` npm tag. A stable `latest` release is triggered manually by a maintainer choosing patch, minor or major.

## Published Packages

Three artifacts leave this repository, on two different schedules.

| Package | Workflow | Trigger |
| --- | --- | --- |
| zard-cli | .github/workflows/release.yml | Automatic, on every push to master. |
| zard (library) | .github/workflows/release.yml | Versioned together with the CLI — nx.json releases both as a fixed group. |
| zard-mcp | .github/workflows/release-mcp.yml | Manual, through workflow_dispatch. Tagged mcp-v<version>. |

## Your Part

Write correct commit messages. That is the whole contract. Do not bump versions, do not edit `CHANGELOG.md` , do not create tags — the automation owns all three, and a manual edit only creates a conflict.

If you are curious about what your change would release, preview it locally without touching anything.

Preview a release locally

```
npm run release:dry-run
```
