# 🤝 Contributing to ZardUI

Thank you for your interest in contributing to ZardUI! This guide gets you from a fresh clone to a merged pull request.

> 📚 **The full guide lives on the website: [zardui.com/docs/contribute](https://zardui.com/docs/contribute).**
> It is the canonical, navigable version of this file — with runnable code blocks and a page per topic:
> [Setup](https://zardui.com/docs/contribute/setup) ·
> [Architecture](https://zardui.com/docs/contribute/architecture) ·
> [Project Structure](https://zardui.com/docs/contribute/project-structure) ·
> [Components](https://zardui.com/docs/contribute/components) ·
> [Blocks](https://zardui.com/docs/contribute/blocks) ·
> [Documentation System](https://zardui.com/docs/contribute/documentation) ·
> [Testing](https://zardui.com/docs/contribute/testing) ·
> [Workflow](https://zardui.com/docs/contribute/workflow) ·
> [Release](https://zardui.com/docs/contribute/release) ·
> [FAQ](https://zardui.com/docs/contribute/faq)
>
> This file is the short version. When the two disagree, the website is right.

## 📋 Table of Contents

- [✅ Requirements](#-requirements)
- [🚀 Initial Setup](#-initial-setup)
- [🏗️ Project Architecture](#️-project-architecture)
- [📁 Folder Structure](#-folder-structure)
- [🧩 Developing Components](#-developing-components)
- [🧱 Developing Blocks](#-developing-blocks)
- [📝 Documentation System](#-documentation-system)
- [🧪 Testing](#-testing)
- [🌿 Branch Strategy](#-branch-strategy)
- [🔄 Contribution Workflow](#-contribution-workflow)
- [📋 Commit Patterns](#-commit-patterns)
- [🔧 Essential Commands](#-essential-commands)
- [🚀 Automatic Release System](#-automatic-release-system)

## ✅ Requirements

- **Node.js** `>=20.19.0` (enforced by `engines` in `package.json`; CI runs Node 24)
- **npm** — the repository ships a `package-lock.json`
- **Git**

## 🚀 Initial Setup

1. **Fork and clone the repository**:

   ```bash
   git clone https://github.com/<your-username>/zardui.git
   cd zardui
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

   Husky installs itself through the `prepare` script, so the git hooks are active immediately.

3. **Start the development environment**:

   ```bash
   npm start
   ```

   `scripts/dev.mjs` pre-builds the highlighted code blocks, then runs the highlight generator in watch mode next to
   `nx run web:serve --configuration=local`. The site listens on `http://localhost:4222` — copy `.env.example` to
   `.env` to change the port.

📖 More detail: [Setup](https://zardui.com/docs/contribute/setup)

## 🏗️ Project Architecture

ZardUI is a **monorepo** managed by [Nx](https://nx.dev/):

- **Nx 22** with cached targets and a derived dependency graph
- **Angular 21** — standalone components, signal inputs, OnPush everywhere
- **TailwindCSS v4** via `@tailwindcss/postcss` (there is **no** `tailwind.config.js`)
- **TypeScript 5.9** in strict mode, with `strictTemplates`
- **CVA** (`class-variance-authority`) for typed variants, merged through `mergeClasses()`
- **SSR + prerendering** driven by `apps/web/prerender-routes.txt`

### Main Projects

| Path                  | What it is                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `libs/zard/`          | The publishable component library — components, variants, demos, API references                  |
| `libs/blocks/`        | Composed screens (e.g. `login-01`) with their metadata                                           |
| `apps/web/`           | The documentation site (Angular + SSR/prerender)                                                 |
| `apps/web-e2e/`       | Playwright E2E specs, including accessibility checks                                             |
| `packages/highlight/` | Shiki generators plus `z-code-block`, `z-code-tabs`, `z-code-display`                            |
| `packages/cli/`       | `zard-cli`, built with Commander.js                                                              |
| `packages/mcp/`       | `zard-mcp`, an MCP server exposing components, docs and blocks                                   |
| `tools/generators/`   | The local Nx plugin `@zardui/generators` (`component`, `block`)                                  |
| `scripts/`            | `dev.mjs`, `build-registry.cts`, `serve-registry.cts`, `sync-blocks.ts`, `normalize-commits.cts` |
| `api/og.ts`           | Vercel edge function rendering the dynamic OG images                                             |

### Path Aliases

Aliases are declared **per project**, not globally.

| Alias           | Resolves to                  | Declared in                                         |
| --------------- | ---------------------------- | --------------------------------------------------- |
| `@zard/*`       | `libs/zard/src/lib/shared/*` | `apps/web/tsconfig.json`                            |
| `@blocks`       | `libs/blocks/src/index.ts`   | `apps/web/tsconfig.json`                            |
| `@doc/domain/*` | `apps/web/src/app/domain/*`  | `apps/web/tsconfig.json`                            |
| `@doc/shared/*` | `apps/web/src/app/shared/*`  | `apps/web/tsconfig.json`                            |
| `@doc/*`        | `apps/web/src/app/*`         | `libs/zard/tsconfig.json`                           |
| `@/*`           | `libs/zard/src/lib/*`        | `apps/web/tsconfig.json`, `libs/zard/tsconfig.json` |
| `@highlight/*`  | `packages/highlight/src/*`   | `apps/web/tsconfig.json`, `libs/zard/tsconfig.json` |
| `@generated/*`  | `apps/web/src/generated/*`   | `apps/web/tsconfig.json`, `libs/zard/tsconfig.json` |

📖 More detail: [Architecture](https://zardui.com/docs/contribute/architecture)

## 📁 Folder Structure

```
zardui/
├── libs/zard/src/lib/shared/components/     # 🧩 The component library
│   └── [component]/
│       ├── [component].component.ts         # 🎯 Component
│       ├── [component].variants.ts          # 🎨 CVA variants + derived types
│       ├── [component].component.spec.ts    # 🧪 Jest unit tests
│       ├── index.ts                         # 📤 Barrel export
│       ├── demo/
│       │   ├── [component].ts               # 📤 Demo registry read by the docs page
│       │   └── [example].ts                 # 🔀 One file per example
│       └── doc/
│           ├── api.ts                       # 🔧 API reference — ApiSection[]
│           └── snippets.md                  # ✂️ Optional extra code snippets
├── libs/blocks/src/lib/[block]/             # 🧱 Blocks
│   ├── block.ts                             # 📋 Metadata (files[] is generated)
│   ├── [block].component.ts
│   └── [block].component.html
├── apps/web/
│   ├── src/app/domain/                      # 📱 Doc components, pages, services
│   ├── src/app/shared/constants/            # 🧭 routes.constant.ts, components.constant.ts
│   ├── src/generated/                       # ⚙️ GENERATED highlighted code (committed)
│   ├── public/documentation/                # 📝 Markdown sources for page code blocks
│   ├── public/docs/                         # ⚙️ GENERATED page Markdown (committed)
│   ├── public/blocks/[block]/               # 🖼️ light.png + dark.png per block
│   ├── public/r/                            # ⚙️ GENERATED registry served to the CLI
│   ├── prerender-routes.txt                 # ⚙️ GENERATED by update-routes.mjs
│   ├── update-routes.mjs                    # 🔄 Rewrites prerender-routes.txt
│   └── generate-docs-markdown.mjs           # 🔄 Prerendered HTML → public/docs/**.md
├── apps/web-e2e/src/                        # 🎭 Playwright specs + utils
├── packages/highlight/src/generator/        # ⚙️ The six Shiki writers
├── packages/cli/src/                        # ⚡ commands/, config/, core/, utils/
├── packages/mcp/src/                        # 🤖 services/, tools/, types/
├── tools/generators/{component,block}/      # 🔨 Nx generators
├── scripts/                                 # 🤖 dev, registry, block sync, commit tooling
└── api/og.ts                                # ☁️ OG image edge function
```

> ⚠️ **Never hand-edit a generated path.** `apps/web/src/generated/`, `apps/web/public/docs/`, `apps/web/public/r/`,
> `apps/web/prerender-routes.txt` and a block's `files[]` array are committed **build artifacts**. Change the source,
> rerun the command, commit the result.

📖 More detail: [Project Structure](https://zardui.com/docs/contribute/project-structure)

## 🧩 Developing Components

### Using the Generator

```bash
npm run generate:component
# or
npx nx generate @zardui/generators:component --name=my-component --description="My component description"
```

It **creates 7 files** — `[name].component.ts`, `[name].variants.ts`, `[name].component.spec.ts`, `index.ts`,
`demo/default.ts`, `demo/[name].ts`, `doc/api.ts` — and **updates 4 existing ones**:

| File                                                       | Change                                                      |
| ---------------------------------------------------------- | ----------------------------------------------------------- |
| `libs/zard/src/index.ts`                                   | Adds the barrel export, in alphabetical order               |
| `apps/web/src/app/shared/constants/components.constant.ts` | Appends the `COMPONENTS_REGISTRY` entry                     |
| `apps/web/src/app/shared/constants/routes.constant.ts`     | Appends the sidebar item to `COMPONENTS_PATH`               |
| `packages/highlight/src/generator/usage-data.ts`           | Seeds the usage snippet so `@generated/usage/<name>` exists |

**Then run `npm run generate:highlight`.** The demo registry imports from `@generated/…`, and those files only exist
after the highlight generator runs.

### Component Template

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
  booleanAttribute,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { myComponentVariants, type ZardMyComponentTypeVariants } from './my-component.variants';

@Component({
  selector: 'z-my-component, [z-my-component]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
  exportAs: 'zMyComponent',
  template: `
    <ng-content />
  `,
})
export class ZardMyComponentComponent {
  readonly zType = input<ZardMyComponentTypeVariants>('default');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(myComponentVariants({ zType: this.zType() }), this.class()));
}
```

### Key Conventions

- **Input prefix**: `z` for component-specific inputs (`zType`, `zSize`, `zDisabled`)
- **Boolean inputs**: `input(false, { transform: booleanAttribute })`
- **Class input**: always `ClassValue` from `clsx`, merged **last** so consumers can override
- **Selectors**: support element and attribute usage — `z-name, [z-name]`
- **Encapsulation**: always `ViewEncapsulation.None`
- **Change detection**: always `ChangeDetectionStrategy.OnPush`
- **Path aliases**: inside the library, import through `@/` (e.g. `@/shared/utils/merge-classes`)

### Variants File (CVA)

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const myComponentVariants = cva(mergeClasses('base-classes-here'), {
  variants: {
    zType: {
      default: 'default-classes',
      outline: 'outline-classes',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});

export type ZardMyComponentTypeVariants = NonNullable<VariantProps<typeof myComponentVariants>['zType']>;
```

### Demos and API Reference

- `demo/[example].ts` — one standalone component per example.
- `demo/[component].ts` — the **registry** the docs page loads. Each example pairs its component with a `codeData`
  import from `@generated/components/<name>/demo/<example>`. The registry also wires `api`, `installData` and `usage`.
  A demo file that is not listed there is never rendered.
- `doc/api.ts` — the API reference, exported as a typed `ApiSection[]` and rendered by `z-api-reference`. One section
  per public selector. See `libs/zard/src/lib/shared/components/button/doc/api.ts`.

### Development Workflow

1. Scaffold with `npm run generate:component`
2. Implement the variants in `[component].variants.ts`
3. Build the component in `[component].component.ts`
4. Write tests in `[component].component.spec.ts`
5. Add demos under `demo/` and register them in `demo/[component].ts`
6. Document every public input in `doc/api.ts`
7. Run `npm run generate:highlight` and commit `apps/web/src/generated/`

📖 More detail: [Components](https://zardui.com/docs/contribute/components)

## 🧱 Developing Blocks

```bash
npm run generate:block
# or
npx nx generate @zardui/generators:block \
  --name=login-02 \
  --description="Split login screen" \
  --category=login \
  --label=Authentication
```

`--category` is the **registry bucket** and is validated against `featured | sidebar | login | signup | otp | calendar`
(the keys of `BLOCKS_REGISTRY`, typed by `BlockCategory` in `domain/services/blocks.service.ts`). `--label` is the
**display label** stored in `Block.category`, and `--title` overrides the card heading. Blocks are registered in
`featured` as well as their own category, because `/blocks` renders one category at a time and defaults to `featured`.

### Block Structure

```typescript
// block.ts
import type { Block } from '@doc/domain/components/block-container/block-container.component';

import { MyBlockComponent } from './my-block.component';

export const myBlock: Block = {
  id: 'my-block-01',
  title: 'My Block',
  description: 'Description of the block.',
  component: MyBlockComponent,
  category: 'Authentication',
  image: {
    light: '/blocks/my-block-01/light.png',
    dark: '/blocks/my-block-01/dark.png',
  },
  // Generated by `npm run sync:blocks` — do not edit by hand.
  files: [],
};
```

After scaffolding you must:

1. Build the screen from existing Zard components.
2. Run `npm run sync:blocks` — it rewrites `files[]` from every `.ts`/`.html` in the folder except `block.ts`.
3. Add `light.png` and `dark.png` under `apps/web/public/blocks/<name>/`. **Nothing generates them for you**; without
   them the block card renders a broken image. `scripts/capture-blocks.mts` shoots them at 1440×900 against a running
   dev server:

   ```bash
   npx nx serve web --configuration=local --port=4222   # in another terminal
   npx tsx scripts/capture-blocks.mts                   # every sidebar block
   npx tsx scripts/capture-blocks.mts login-01          # or just the ones you name
   ```

4. Run `npm run build:registry` so the CLI can install the block.

📖 More detail: [Blocks](https://zardui.com/docs/contribute/blocks)

## 📝 Documentation System

Every code block on the site is generated at build time — no runtime highlighter, and every snippet is reviewable in a
diff. `npm run generate:highlight` runs `packages/highlight/src/generator/index.ts`, which executes six writers:

| Writer                | Reads                                          | Writes                                                 |
| --------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| `demo-writer`         | `libs/zard/**/demo/*.ts`                       | `apps/web/src/generated/components/<name>/demo/*.ts`   |
| `installation-writer` | every component folder in `libs/zard`          | `apps/web/src/generated/installation/**`               |
| `docs-writer`         | `apps/web/public/documentation/<section>/*.md` | `apps/web/src/generated/documentation/<section>/*.ts`  |
| `page-data-writer`    | `apps/web/public/documentation/<section>/*.md` | `apps/web/src/generated/pages/<section>/*.ts`          |
| `usage-writer`        | the `USAGE_DATA` record in `usage-data.ts`     | `apps/web/src/generated/usage/<name>.ts`               |
| `snippet-writer`      | `libs/zard/**/doc/snippets.md`                 | `apps/web/src/generated/components/<name>/snippets.ts` |

Page exports are numbered by order of appearance (`BLOCK_0`, `TABS_0`, `BLOCK_1`…), so inserting a fence in the middle
of a Markdown file renumbers everything after it. Import with an alias and rerun the generator after every edit.

Code fence metadata parsed by `meta-parser.ts`: `title="…"`, `tab="…"`, `id="…"`, `showLineNumbers`, `copyButton`,
`expandable="true"`, `expandableTitle="…"` and line ranges such as `{1,3-5}`.

After the build, `npm run generate:md` (components) and `npm run generate:md:docs` (static pages, from the prerendered
HTML) write `apps/web/public/docs/**.md` — the files behind the "Copy Page as Markdown" button and `llms.txt`.

### Adding a documentation page

1. Write the Markdown sources under `apps/web/public/documentation/<section>/`
2. Run `npm run generate:highlight` and note the `BLOCK_n` / `TABS_n` exports
3. Create the standalone `*.page.ts` (OnPush, `z-` prefixed selector, `NavigationConfig` starting with `overview`,
   `SeoService.setDocsSeo(...)` in `ngOnInit`)
4. Register the lazy route in `apps/web/src/app/app.routes.ts`
5. Add the item to the matching `NavSection` in `routes.constant.ts` — that one array feeds the sidebar, the mobile
   menu and the ⌘K command palette
6. Run `node apps/web/update-routes.mjs` and commit `prerender-routes.txt`
7. Run `npm run build`, then commit the generated `apps/web/public/docs/**.md`

📖 More detail: [Documentation System](https://zardui.com/docs/contribute/documentation)

## 🧪 Testing

### Unit Tests

- **Jest 30** with the `happy-dom` environment
- **@testing-library/angular** — `render()` and `screen`
- Co-located as `[component].component.spec.ts`
- `npm test` expands to `nx run-many --target=test --p=libs/*`

```typescript
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/angular';

import { ZardButtonComponent } from './button.component';

describe('ZardButtonComponent', () => {
  it('creates successfully', async () => {
    await render('<button z-button>Test</button>', { imports: [ZardButtonComponent] });

    expect(screen.getByRole('button')).toBeVisible();
  });
});
```

### E2E Tests

- **Playwright** (Chromium) in `apps/web-e2e/src/components/`
- The `ComponentDemoPage` helper (`src/utils/component-page.ts`) navigates to `/docs/components/:name` and waits for
  hydration
- `checkA11y` (`src/utils/axe-helper.ts`) runs axe against WCAG 2.1 A/AA

```typescript
import { test, expect } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

test.describe('Button component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'button');
    await demoPage.goto();
  });

  test('button is clickable and remains interactive', async () => {
    const button = demoPage.firstDemoBox.locator('button[z-button]').first();
    await expect(button).toBeEnabled();
    await button.click();
    await expect(button).toBeVisible();
  });

  test('passes accessibility checks', async ({ page }) => {
    await checkA11y(page, '#overview', ['button-name', 'color-contrast']);
  });
});
```

### E2E Governance Rules

1. **Test behaviour, not content** — assert on interactions and ARIA state, not demo copy or element counts
2. **The first demo is the fixture** — the hero example of each component page is the E2E target; keep it stable
3. **Same-PR updates** — if your change touches a component or its first demo, update the spec in the same PR
4. **Stable selectors** — prefer `z-button`, `[z-input]` and roles over text or CSS classes

📖 More detail: [Testing](https://zardui.com/docs/contribute/testing)

## 🌿 Branch Strategy

`master` is the only long-lived branch. It receives pull requests from forks, merges are squashed, and a merge
triggers the release automation.

```bash
feat/#<issue-number>-<descriptive-name>   # feat/#42-button-loading
fix/#<issue-number>-<descriptive-name>    # fix/#43-input-focus-bug
```

## 🔄 Contribution Workflow

1. **📋 Fork the repository**
2. **🌿 Create a branch** from an up-to-date `master`:
   ```bash
   git checkout master
   git pull origin master
   git checkout -b feat/#123-new-feature
   ```
3. **💻 Develop** with as many commits as you like — the squash merge collapses them
4. **🧪 Verify locally**:
   ```bash
   npx nx run-many --target=lint --p=zard,blocks --parallel
   npm test
   npm run build
   ```
5. **🚀 Open a PR against `master`**
6. **👁️ Review + squash merge** = automatic release

### PR Checklist

- [ ] **Unit tests passing** — `npm test`
- [ ] **Full build passing** — `npm run build` (what the CI runs)
- [ ] **E2E updated** if a component or its first demo changed
- [ ] **Generated files committed** (`apps/web/src/generated/`, `public/docs/`, `prerender-routes.txt` when affected)
- [ ] **Code follows project patterns**
- [ ] **Related issue linked**
- [ ] **Conventional commit** (emoji + type) in the PR title

### What the CI runs

`.github/workflows/ci.yml` has five jobs: `commitlint` (fails on warnings), `lint`
(`nx run-many --target=lint --p=zard,blocks`), `build` (`npm run build`), `test` (`npm test`) and `e2e`
(`nx e2e web-e2e`, uploading the Playwright report).

📖 More detail: [Workflow](https://zardui.com/docs/contribute/workflow)

## 📋 Commit Patterns

### 🎯 Making Commits

```bash
git add .
git commit -m "✨ feat(button): add new variant"
```

### 📝 Commit Types and Versioning

| Emoji | Type       | Description              | Version Bump      |
| ----- | ---------- | ------------------------ | ----------------- |
| ✨    | `feat`     | New functionality        | **Minor** (0.x.0) |
| 🐛    | `fix`      | Bug correction           | **Patch** (0.0.x) |
| 🚀    | `perf`     | Performance improvements | **Patch** (0.0.x) |
| ⏪️    | `revert`   | Revert previous commit   | **Patch** (0.0.x) |
| 📦    | `refactor` | Code refactoring         | No release        |
| 🔧    | `ci`       | CI/CD                    | No release        |
| 🧪    | `test`     | Tests                    | No release        |
| 📝    | `docs`     | Documentation            | No release        |
| 💄    | `style`    | Code style               | No release        |
| 🏗️    | `build`    | Build system             | No release        |
| 🚧    | `chore`    | Maintenance              | No release        |

**Breaking Changes**: add `!` after the type for a **Major** bump:

```bash
✨ feat(button)!: redesign button API   # 1.0.0 → 2.0.0
```

### ✅ Commit Validation

Husky runs two hooks: `pre-commit` executes lint-staged (ESLint `--fix` + Prettier on staged `.ts`, Prettier on staged
`.html`), and `commit-msg` runs commitlint. The CI validates every commit in the PR again.

#### 🎨 Commit Format

```
emoji type(scope): subject

[optional body]

[optional footer]
```

A commit is **rejected** when it:

- has no emoji at the start of the header
- uses a type outside the allowed list, or a non-lowercase type
- has a subject shorter than 10 or longer than 72 characters
- has a subject ending with a period
- has a header longer than 100 characters, or a body line longer than 100 characters

**Examples:**

```bash
✅ ✨ feat(button): add loading state
✅ 🐛 fix: resolve focus bug on Safari
✅ 📦 refactor(core): improve class merging

❌ feat(button): add loading state          # missing emoji — REJECTED
❌ ✨ feat(button): fix                     # subject too short — REJECTED
❌ ✨ feat(button): add loading state.      # trailing period — REJECTED
```

**Do NOT add `Co-Authored-By` trailers**, and never bypass the hooks with `--no-verify`. If a hook fails, fix the
cause.

## 🔧 Essential Commands

### Development

```bash
npm start                    # 🚀 Dev server on port 4222 (highlight watcher + nx serve)
npm run build                # 🏗️ Full production pipeline — what the CI runs
npm run serve:ssr            # 🌐 Serve the built SSR server from dist/apps/web
```

`npm run build` chains: `generate:highlight` → `generate:md` → `build:registry` → `update-routes.mjs` →
`nx run web:build --configuration=production` → `generate:md:docs`.

### Code Generation

```bash
npm run generate:component   # Scaffold a component
npm run generate:block       # Scaffold a block
npm run generate:highlight   # Regenerate apps/web/src/generated/**
npm run generate:md          # Component Markdown → apps/web/public/docs/components/
npm run generate:md:docs     # Prerendered pages → apps/web/public/docs/ (after the build)
npm run sync:blocks          # Rewrite files[] in every block.ts
npm run build:registry       # Build the registry served to the CLI and MCP
```

### Testing

```bash
npm test                     # 🧪 All unit tests
npm run test:watch           # 👁️ Unit tests in watch mode
npm run e2e                  # 🎭 E2E tests (boots the dev server)
npm run e2e:ui               # 🖥️ E2E with the Playwright UI
```

### CLI, MCP & Release

```bash
npm run build:cli            # Build the CLI
npm run build:mcp            # Build the MCP server
npm run dev:mcp              # Build the MCP in dev mode
npm run serve:registry       # Serve the registry locally
npm run release:dry-run      # Preview a release
npm run release              # Create a release
```

## 🚀 Automatic Release System

Releases are automated — you do not need to do anything beyond committing correctly.

1. **You merge a PR into `master`.** The deploy workflow triggers on every push to `master` unless the message
   contains `[skip ci]`.
2. **The workflow builds and tests**, then refreshes the registry with `npm run build:registry` and commits any change
   as a `[skip ci]` chore.
3. **`nx release version` computes the bump** from the commit types (mapped in `nx.json`), and `nx release changelog`
   updates `CHANGELOG.md`. `scripts/normalize-commits.cts` runs first so the emoji prefix does not confuse the
   conventional-commit parser.
4. **The workflow commits, tags and publishes**: `🔖 chore(release): publish v<version> [skip ci]`, tag `v<version>`,
   then `npm publish --provenance` for `zard-cli` under the `latest` or `beta` tag.
5. **A GitHub release is created** with generated notes, and a Discord webhook announces it.

The default bump is a `prerelease` with the `beta` preid, so day-to-day merges publish under the `beta` npm tag. A
stable release is triggered manually by a maintainer through `workflow_dispatch`. The MCP server has its own manual
workflow (`release-mcp.yml`) and is tagged `mcp-v<version>`.

**What you need to do: nothing.** Do not bump versions, edit `CHANGELOG.md` or create tags — the automation owns all
three.

📖 More detail: [Release](https://zardui.com/docs/contribute/release)

## 🤝 Community and Support

- **Issues**: report bugs or request features
- **Discussions**: general questions and proposals
- **Email**: **gomesluiz.dev@gmail.com**

Stuck on something this file does not cover? Check
[FAQ & Troubleshooting](https://zardui.com/docs/contribute/faq).

## 📚 Useful Resources

- [Nx Documentation](https://nx.dev/)
- [Angular Docs](https://angular.dev/)
- [TailwindCSS v4](https://tailwindcss.com/docs)
- [CVA Documentation](https://cva.style/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Testing Library Angular](https://testing-library.com/docs/angular-testing-library/intro/)

---

**Questions?** Open an issue or get in touch! Your contribution is very welcome! 🎉
