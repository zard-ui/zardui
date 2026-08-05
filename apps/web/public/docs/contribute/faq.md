---
title: FAQ & Troubleshooting
description: The failures contributors actually hit, and the exact command that resolves each one.
---

# FAQ & Troubleshooting

The failures contributors actually hit, and the exact command that resolves each one.

Most surprises in this repository come from the same place: a committed file that is generated rather than written. If something looks stale, the answer is almost always to rerun the generator that owns it.

## Commits

**My commit was rejected.** commitlint prints the exact rule that failed. The most common cause is a missing emoji, followed by a subject shorter than ten characters. Fix the message and amend — never reach for `--no-verify` , because the CI runs commitlint again on every commit in the pull request.

Fix a rejected commit

```
# Rewrite the message of the last commit — never use --no-verify
git commit --amend -m "✨ feat(button): add loading state"
```

**The pre-commit hook changed my files.** That is lint-staged running ESLint with `--fix` and Prettier. Review the changes, stage them and commit again.

## Code Blocks

The code block on my page is empty or out of date

The .ts under apps/web/src/generated is stale. Run npm run generate:highlight and stage the result — that directory is committed.

I generated a component and its page renders nothing

The demo registry imports from @generated/…, which only exists after the highlight generator runs. Run npm run generate:highlight, then reload.

My imports point at the wrong snippet

Exports are numbered by order of appearance, so inserting a fence in the middle of a Markdown file renumbers every block after it. Rerun the generator and re-check each BLOCK_n alias.

The Usage section of my component is missing

Add an entry for the component in packages/highlight/src/generator/usage-data.ts — usage-writer only emits files for the keys listed there.

Code blocks are empty or stale

```
npm run generate:highlight
git add apps/web/src/generated
```

## Pages & Navigation

I added a page and it is not in the sidebar

The sidebar is built from SIDEBAR_PATHS in routes.constant.ts. Add the item to the matching NavSection; the mobile menu and the command palette read the same array.

My new route was not prerendered

prerender-routes.txt is generated. Run node apps/web/update-routes.mjs and commit the result. The item must be shaped exactly as { name, path, available: true } for the regex to pick it up.

The page has no .md and the Copy Page button does nothing

apps/web/public/docs/**.md is written after the build by generate:md:docs. Run npm run build, then commit the new file. An empty output means the page structure strayed from z-content.

A new route is missing from the prerender list

```
node apps/web/update-routes.mjs
git add apps/web/prerender-routes.txt
```

## Build Errors

Cannot find module @zard/… or @doc/…

Aliases are declared per project. @doc/domain/* only resolves inside apps/web; inside libs/zard the alias is @doc/*. Check the table on the Architecture page.

A template error mentions a type I never wrote

strictTemplates is on. Bindings are type-checked against the input signature — most often you are passing string where a literal union is expected.

Nx keeps returning a stale result

Run npx nx reset to clear the local cache and the daemon, then run the target again.

The build warns that the initial bundle exceeded its budget

The budgets are set in apps/web/project.json. A warning does not fail the build; an error does. If your page pulled a heavy dependency into the initial chunk, load it lazily instead of raising the budget.

Do I need to touch the E2E specs?

Only when you change a component behaviour or its first demo — that demo is the fixture every spec targets. Pure documentation changes do not need E2E updates.

Reset a confusing build

```
npx nx reset
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### The full build is slow on purpose

`npm run build` generates the code blocks, the component Markdown and the registry, then prerenders every route and converts the result back to Markdown. Expect minutes, not seconds — and run it before pushing, since it is exactly what the CI runs.

## Still Stuck?

Open an issue with the command you ran and its full output, start a discussion if the question is about design rather than a bug, or email [gomesluiz.dev@gmail.com](mailto:gomesluiz.dev@gmail.com) . An unanswered question is a documentation bug — tell us, and this page grows.

- [Issues Report a bug or request a feature.](https://github.com/zard-ui/zardui/issues)
- [Discussions Ask questions and discuss ideas before writing code.](https://github.com/zard-ui/zardui/discussions)
