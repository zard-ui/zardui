---
title: Workflow
description: From picking an issue to a merged pull request, including the commit rules that decide whether your work is accepted.
---

# Workflow

From picking an issue to a merged pull request, including the commit rules that decide whether your work is accepted.

Zard UI follows a plain GitHub flow: `master` is the only long-lived branch, every change arrives through a pull request from a fork, and merges are squashed. Releases are derived from commit messages, which is why their format is enforced.

## Branches

Branch from an up-to-date `master` and name the branch after the issue you are solving: `feat/#<issue>-<short-name>` or `fix/#<issue>-<short-name>` .

Start from an issue

```
git checkout master
git pull origin master
git checkout -b feat/#123-button-loading
```

Commit as often as you like — the squash merge collapses the branch into a single commit whose message is the pull request title, so that title must follow the format below too.

Before you push

```
npx nx run-many --target=lint --p=zard,blocks --parallel
npm test
npm run build
```

## Commit Format

The header is `<emoji> type(scope): subject` . The scope is optional; the emoji is not. Add `!` after the type — or the scope — for a breaking change, which promotes the release to a major bump.

| Emoji | Type | Used for | Version bump |
| --- | --- | --- | --- |
| ✨ | `feat` | A new feature | minor |
| 🐛 | `fix` | A bug fix | patch |
| 🚀 | `perf` | A performance improvement | patch |
| ⏪️ | `revert` | Reverts a previous commit | patch |
| 📦 | `refactor` | A change that neither fixes a bug nor adds a feature | none |
| 📝 | `docs` | Documentation only | none |
| 💄 | `style` | Formatting, no behaviour change | none |
| 🧪 | `test` | Adding or fixing tests | none |
| 🏗️ | `build` | Build system or dependencies | none |
| 🔧 | `ci` | CI configuration and scripts | none |
| 🚧 | `chore` | Anything that does not touch src or tests | none |

Commit — the emoji is mandatory

```
git add .
git commit -m "✨ feat(button): add loading state"

# Valid
# ✨ feat(button): add loading state
# 🐛 fix(input): resolve focus bug on Safari
# 📝 docs(contribute): document the block generator
# ✨ feat(button)!: redesign the button API   <- breaking change, major bump

# Rejected by commitlint
# feat(button): add loading state             <- no emoji
# ✨ feat(button): fix                        <- subject shorter than 10 chars
# ✨ feat(button): add loading state.          <- trailing period
# ✨ Feat(button): add loading state          <- type must be lower-case
```

#### No Co-Authored-By trailers

Do not add `Co-Authored-By` trailers to commits, and never bypass the hooks with `--no-verify` . If a hook fails, fix the cause.

## Why Commits Are Rejected

These rules come straight from `commitlint.config.mjs` . The `commit-msg` hook applies them locally, and the CI applies them again to every commit in the pull request.

| Rejected because | Fix |
| --- | --- |
| No emoji at the start of the header | Prefix the message with the emoji for your type. |
| A type outside the allowed list | Use one of the types in the table above, in lower case. |
| Subject shorter than 10 characters | Describe the change, do not just name the area. |
| Subject longer than 72 characters | Move the detail to the commit body. |
| Subject ending with a period | Drop the trailing period. |
| Header longer than 100 characters | Shorten the scope or the subject. |
| A body line longer than 100 characters | Wrap the body. |

## Pull Request

Open the pull request against `master` . The repository template asks what you did, for screenshots, for the linked issue, for the type of change and for a browser checklist — fill all of it in.

- •The pull request targets master.
- •The title follows the same emoji + type + subject format as the commits.
- •The related issue is linked.
- •Unit tests pass locally: npm test.
- •The full build passes: npm run build.
- •E2E specs were updated if a component or its first demo changed.
- •Generated files that your change produced are committed.
- •Screenshots or a GIF are attached when the change is visual.

## What the CI Runs

Five jobs, defined in `.github/workflows/ci.yml` . All of them must pass before a review can be merged.

| Job | What it does |
| --- | --- |
| `commitlint` | Validates every commit message in the pull request, failing on warnings. |
| `lint` | npx nx run-many --target=lint --p=zard,blocks --parallel |
| `build` | npm run build |
| `test` | npm test — runs after build |
| `e2e` | npx nx e2e web-e2e — runs after build, uploads the Playwright report |

Once the checks are green and a maintainer approves, the pull request is squash-merged into `master` . From there the release automation takes over — see the Release page.
