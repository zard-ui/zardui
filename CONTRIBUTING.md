# 🤝 Contributing to ZardUI

Thank you for your interest in contributing to ZardUI! This guide will help you understand how the project is structured and how you can contribute effectively.

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

## ✅ Requirements

- **Node.js** version `>=20.19.0` (specified in `engines`)
- **npm** (included with Node.js)
- **Git** for version control


## 🚀 Initial Setup

1. **Fork and clone the repository**:

   ```bash
   git clone https://github.com/[your-username]/zardui.git
   cd zardui
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development environment**:

   ```bash
   npm start
   ```

   The project will run at `http://localhost:4222`

## 🏗️ Project Architecture

### Monorepo with Nx

ZardUI is a **monorepo** managed by [Nx](https://nx.dev/) with the following characteristics:

- **Nx 22** with intelligent caching and dependency graph
- **Angular 21** with signal-based architecture
- **TailwindCSS v4** with PostCSS integration
- **TypeScript 5.9** with strict mode
- **Conventional commits** for automated releases
- **Path aliases**: `@/*` inside `libs/zard/` maps to `src/lib/*`
- **Optimized builds** with Angular CLI + esbuild

### Main Projects

#### 📚 `libs/zard/` - Component Library

- **Standalone** and **publishable** Angular library
- Components with **signal-based inputs** (`input()`)
- **CVA (Class Variance Authority)** for typed variants
- **OnPush change detection** for performance
- **ViewEncapsulation.None** for styling flexibility
- **Host binding** for dynamic classes

#### 🧱 `libs/blocks/` - Block Library

- Pre-built, composable UI blocks (e.g., authentication pages)
- Each block is an Angular component with metadata
- Includes file contents for CLI installation

#### 🌐 `apps/web/` - Documentation Site

- Angular application with SSR/SSG (Express + Vercel)
- Interactive documentation with live demos
- Automatic file synchronization system

#### ⚡ `packages/cli/` - CLI Tool

- `zard-cli` built with Commander.js
- Installs components and blocks from a registry

#### 🤖 `packages/mcp/` - MCP Server

- `zard-mcp` built with `@modelcontextprotocol/sdk`
- AI-powered tools for component discovery, documentation, and installation
- 9 tools: list/search/get components, get docs/examples/dependencies, list/get blocks, install components
- Fetches from the Zard registry with caching (5-minute TTL)
- Configurable via `ZARD_REGISTRY_URL` environment variable

#### 🔨 `tools/generators/` - Nx Generators

- Local Nx plugin `@zardui/generators`
- Scaffolds new components and blocks with all required files

## 📁 Folder Structure

```
zardui/
├── libs/zard/                                # 📦 Main library
│   ├── src/lib/shared/components/           # 🧩 Components
│   │   └── [component-name]/                # 📂 Component folder
│   │       ├── [component].component.ts     # 🎯 Main component
│   │       ├── [component].variants.ts      # 🎨 CVA variants
│   │       ├── [component].component.spec.ts # 🧪 Unit tests
│   │       ├── index.ts                     # 📤 Barrel export
│   │       ├── demo/                        # 📋 Demos for docs
│   │       │   ├── [component].ts           # 📤 Demo registry
│   │       │   ├── default.ts               # 🏠 Default example
│   │       │   └── [variant].ts             # 🔀 Variant examples
│   │       └── doc/                         # 📖 Documentation
│   │           ├── overview.md              # 📝 Overview
│   │           └── api.md                   # 🔧 API reference
│   └── src/lib/shared/utils/               # 🛠️ Shared utilities
├── libs/blocks/                             # 🧱 Block library
│   └── src/lib/[block-name]/               # 📂 Block folder
│       ├── block.ts                         # 📋 Block metadata
│       ├── [block].component.ts             # 🎯 Angular component
│       └── [block].component.html           # 📄 Template
├── apps/web/                                # 🌐 Documentation site
│   ├── src/app/                             # 📱 Angular application
│   └── public/components/                   # 📁 Synced demo/doc files
├── apps/web-e2e/                            # 🎭 E2E tests (Playwright)
│   └── src/components/                      # 🧪 Component E2E specs
├── tools/generators/                        # 🔨 Nx generators
│   └── component/                           # 🧩 Component generator
├── packages/cli/                            # ⚡ CLI tool
│   └── src/
│       ├── index.ts                         # 🎯 CLI entry point
│       ├── commands/                        # 📦 CLI commands (add, init, etc.)
│       ├── config/                          # ⚙️ Configuration management
│       ├── constants/                       # 📋 Shared constants
│       ├── core/                            # 🔧 Core logic (registry, installer)
│       └── utils/                           # 🛠️ Utility functions
├── packages/mcp/                            # 🤖 MCP Server
│   └── src/
│       ├── index.ts                         # 🎯 Server entry point
│       ├── services/                        # 🔄 Registry service (caching)
│       ├── tools/                           # 🧰 9 MCP tool implementations
│       └── types/                           # 📋 Registry type definitions
├── scripts/                                 # 🤖 Automation scripts
│   ├── generate-files.cts                   # 🔄 Demo/docs sync
│   ├── generate-installation-guides.cts     # 📋 Installation guides
│   ├── build-registry.cts                   # 📦 Registry build
│   └── sync-blocks.ts                       # 🔄 Block sync
└── api/                                     # ☁️ Vercel Edge Functions
    └── og.ts                                # 🖼️ Dynamic OG image generation
```

## 🧩 Developing Components

### Using the Generator

The easiest way to create a new component is using the Nx generator:

```bash
npm run generate:component
# or
npx nx generate @zardui/generators:component --name=my-component --description="My component description"
```

This creates 8 files and auto-updates 3 existing files (barrel export, component registry, sidebar routes).

### Component Template

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { mergeClasses } from '@/shared/utils/merge-classes';
import {
  myComponentVariants,
  type ZardMyComponentTypeVariants,
  type ZardMyComponentSizeVariants,
} from './my-component.variants';
import type { ClassValue } from 'clsx';

@Component({
  selector: 'z-my-component, [z-my-component]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { '[class]': 'classes()' },
  template: `<ng-content />`,
})
export class ZardMyComponentComponent {
  readonly zType = input<ZardMyComponentTypeVariants>('default');
  readonly zSize = input<ZardMyComponentSizeVariants>('default');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      myComponentVariants({
        zType: this.zType(),
        zSize: this.zSize(),
      }),
      this.class(),
    ),
  );
}
```

### Key Conventions

- **Input prefix**: Use `z` prefix for component-specific inputs (`zType`, `zSize`, `zDisabled`, etc.)
- **Boolean inputs**: Use `booleanAttribute` transform:
  ```typescript
  readonly zDisabled = input(false, { transform: booleanAttribute });
  ```
- **Class input**: Always accept `ClassValue` from `clsx` for class merging
- **Selectors**: Support both element and attribute usage: `z-name, [z-name]`
- **Encapsulation**: Always use `ViewEncapsulation.None`
- **Change detection**: Always use `ChangeDetectionStrategy.OnPush`
- **Path aliases**: Use `@/` prefix for imports within the library (e.g., `@/shared/utils/merge-classes`)

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
    zSize: {
      default: 'size-default-classes',
      sm: 'size-sm-classes',
      lg: 'size-lg-classes',
    },
  },
  defaultVariants: {
    zType: 'default',
    zSize: 'default',
  },
});

type MyComponentVariants = VariantProps<typeof myComponentVariants>;
export type ZardMyComponentTypeVariants = NonNullable<MyComponentVariants['zType']>;
export type ZardMyComponentSizeVariants = NonNullable<MyComponentVariants['zSize']>;
```

### Development Workflow

1. **Scaffold component** with `npm run generate:component`
2. **Implement variants** with CVA in `[component].variants.ts`
3. **Build the component** in `[component].component.ts`
4. **Write tests** in `[component].component.spec.ts`
5. **Create demos** in the `demo/` folder following existing patterns
6. **Write documentation** in `doc/overview.md` and `doc/api.md`
7. **Watch system automatically syncs** demos and docs to the website

### Styling Patterns

- **TailwindCSS v4** with `@tailwindcss/postcss` (no `tailwind.config.js`)
- **Class merging** with `tailwind-merge` + `clsx` via `mergeClasses()` utility
- **Utility-first** approach for consistency
- **Design tokens** through CSS custom properties

## 🧱 Developing Blocks

### Using the Generator

```bash
npm run generate:block
# or
npx nx generate @zardui/generators:block --name=my-block
```

### Block Structure

Blocks are pre-built UI compositions that combine multiple Zard components:

```typescript
// block.ts
import type { Block } from '@/shared/types';
import { MyBlockComponent } from './my-block.component';

export const myBlock: Block = {
  id: 'my-block-01',
  title: 'My Block',
  description: 'Description of the block.',
  component: MyBlockComponent,
  category: 'Category',
  image: { light: 'path/to/light.png', dark: 'path/to/dark.png' },
  files: [
    { name: 'my-block.component.ts', path: '...', content: '...', language: 'typescript' },
  ],
};
```

## 📝 Documentation System

### Automatic Synchronization

The `scripts/generate-files.cts` script monitors changes in:

- `libs/zard/src/lib/shared/components/*/demo/` → `apps/web/public/components/*/demo/`
- `libs/zard/src/lib/shared/components/*/doc/` → `apps/web/public/components/*/doc/`

Demo `.ts` files are automatically converted to `.md` for display on the docs site.

### Demo Structure

Each component has a demo registry file and individual demo components:

```typescript
// demo/button.ts - Demo registry
import { ZardDemoButtonDefaultComponent } from './default';
import { ZardDemoButtonTypeComponent } from './type';

export const BUTTON = {
  componentName: 'button',
  componentType: 'button',
  description: 'Displays a button or a component that looks like a button.',
  examples: [
    { name: 'default', component: ZardDemoButtonDefaultComponent },
    { name: 'type', component: ZardDemoButtonTypeComponent },
  ],
};
```

```typescript
// demo/default.ts - Demo component
import { Component } from '@angular/core';
import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-default',
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <button z-button>Default</button>
    <button z-button zType="outline">Outline</button>
  `,
})
export class ZardDemoButtonDefaultComponent {}
```

### Documentation Files

- **overview.md**: Overview, use cases, basic examples
- **api.md**: Complete API reference, props, events, methods

## 🧪 Testing

### Unit Tests

- **Jest 30** with `happy-dom` environment
- **@testing-library/angular** with `render()` and `screen` API
- **Co-located tests** next to components (`[component].component.spec.ts`)

### E2E Tests

- **Playwright** with `@nx/playwright` integration
- **Tests location**: `apps/web-e2e/src/components/`
- **Test target**: Component demos at `http://localhost:4222/docs/components/:name`
- **Accessibility**: `@axe-core/playwright` for WCAG 2.1 AA compliance checks

### Commands

```bash
# Unit tests
npm test                                      # Run all unit tests
npm run test:watch                            # Unit tests in watch mode

# E2E tests
npm run e2e                                   # Run E2E tests (auto-starts dev server)
npm run e2e:ui                                # Run E2E with Playwright UI (interactive)
npx nx e2e web-e2e -- --grep "Button"         # Run specific E2E test
```

### Unit Test Example

```typescript
import { render, screen } from '@testing-library/angular';
import { ZardButtonComponent } from './button.component';

describe('ZardButtonComponent', () => {
  it('should render with default variant', async () => {
    await render('<button z-button>Click me</button>', {
      imports: [ZardButtonComponent],
    });

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('should apply disabled state', async () => {
    await render('<button z-button zDisabled>Disabled</button>', {
      imports: [ZardButtonComponent],
    });

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('disabled');
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';
import { ComponentDemoPage } from '../utils/component-page';
import { checkA11y } from '../utils/axe-helper';

test.describe('MyComponent', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'my-component');
    await demoPage.goto();
  });

  test('renders default demo', async () => {
    await expect(demoPage.firstDemoCard).toBeVisible();
  });

  test('passes a11y checks', async ({ page }) => {
    await checkA11y(page, '#overview');
  });
});
```

### E2E Governance Rules

Since E2E tests run against component demo pages, follow these rules to prevent false failures:

1. **Test behavior, not content** — assert on interactions and ARIA state, not demo text or element counts
2. **First demo is the test fixture** — the first example per component is the primary E2E target; keep it stable
3. **Same-PR updates** — if your change modifies a component or its first demo, update the E2E test in the same PR
4. **Stable selectors** — use component selectors (`z-button`), directives (`[z-input]`), and ARIA attributes (`[role="dialog"]`) over text or CSS classes

## 🌿 Branch Strategy

### Simple GitHub Flow

#### Main Branch

- **`master`** - Single main branch
  - Receives direct PRs
  - Automatic squash merge
  - Automatic release via tags
  - Continuous deployment to production

#### Feature Branches

Naming convention:

```bash
feat/#<issue-number>-<descriptive-name>
# Example: feat/#42-button-loading
fix/#<issue-number>-<descriptive-name>
# Example: fix/#43-input-focus-bug
```

## 🔄 Contribution Workflow

1. **📋 Fork the repository**
2. **🌿 Create branch** directly from `master`:
   ```bash
   git checkout master
   git pull origin master
   git checkout -b feat/#123-new-feature
   ```
3. **💻 Develop** with as many commits as you want
4. **🧪 Run tests**:
   ```bash
   npm test
   npm run test:watch  # during development
   ```
5. **🚀 Open PR to `master`**
6. **👁️ Review + Merge** = Automatic release
7. **✅ Automatic squash merge** transforms multiple commits into 1 clean commit

### PR Checklist

- [ ] **Unit tests passing** - `npm test`
- [ ] **E2E tests passing** - `npm run e2e` (if component or first demo changed)
- [ ] **E2E test updated/added** if component behavior changed
- [ ] **Code follows project patterns**
- [ ] **Documentation updated** (if necessary)
- [ ] **Demos working correctly**
- [ ] **No lint/typecheck warnings**
- [ ] **Related issue linked**
- [ ] **Conventional commit** in PR title
- [ ] **Squash merge** will be applied automatically

## 📋 Commit Patterns

### Conventional Commits for Automated Releases

We use **Conventional Commits with Emojis** for better visual feedback and automated releases.

#### 🎯 Making Commits

```bash
git add .
git commit -m "✨ feat(button): add new variant"
```

#### 📝 Commit Types and Versioning

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

**Breaking Changes**: Add `!` after the type for a **Major** version bump:

```bash
✨ feat(button)!: redesign button API  # Major: 1.0.0 → 2.0.0
```

#### ✅ Commit Validation

We use Husky + commitlint to validate commits automatically:

- ✅ **Before commit**: lint-staged runs ESLint and Prettier
- ✅ **On commit message**: commitlint validates format
- ❌ Invalid format → commit rejected with helpful error

#### 🎨 Commit Format

```
emoji type(scope): description

[optional body]

[optional footer]
```

**Examples:**

```bash
✨ feat(button): add loading state
🐛 fix(input): resolve focus bug
📦 refactor(dialog): improve animation performance
🧪 test(form): add validation tests
📝 docs(readme): update installation guide
```

**Important - Emoji is REQUIRED**:

1. **Emoji at the start** (MANDATORY - commit will be rejected without it)
2. **Type** (feat, fix, etc)
3. **Scope** in parentheses (optional)
4. **Colon and space**
5. **Clear, imperative description**

**Do NOT add `Co-Authored-By` trailers to commits.**

**Examples of valid commits:**

```bash
✅ ✨ feat(button): add variant
✅ 🐛 fix: resolve bug
✅ 📦 refactor(core): improve performance

❌ feat(button): missing emoji - WILL BE REJECTED
❌ feat: missing emoji - WILL BE REJECTED
```

## 🔧 Essential Commands

### Development

```bash
npm start                    # 🚀 Start dev server (port 4222)
npm run watch:files          # 👀 Monitor changes in demos/docs
npm run build                # 🏗️ Production build
npm run convert:demos        # 🔄 Convert demos to markdown
npm run serve:ssr            # 🌐 Serve SSR server locally
```

### Code Generation

```bash
npm run generate:component   # Scaffold a new component
npm run generate:block       # Scaffold a new block
```

### Testing

```bash
npm test                     # 🧪 All unit tests
npm run test:watch           # 👁️ Unit tests in watch mode
npm run e2e                  # 🎭 E2E tests (auto-starts dev server)
npm run e2e:ui               # 🖥️ E2E with Playwright UI
```

### CLI, MCP & Registry

```bash
npm run build:cli            # Build the CLI
npm run build:mcp            # Build the MCP server
npm run dev:mcp              # Build MCP in dev mode (with npm link)
npm run build:registry       # Build the component registry
npm run serve:registry       # Serve registry locally
npm run sync:blocks          # Sync blocks configuration
```

### Release

```bash
npm run release:dry-run      # Preview release
npm run release              # Create release
npm run release:cli          # Release CLI package
npm run publish:cli          # Publish CLI to npm
npm run publish:mcp          # Publish MCP to npm
```

## 🚀 Automatic Release System

### ✨ How It Works (100% Automated)

Our release system is **fully automated** - you don't need to do anything special:

#### 1. 🔀 You Merge a PR to `master`

```bash
# Example PR with commits:
✨ feat(button): add loading variant
🐛 fix(input): resolve focus issue
📦 refactor(dialog): improve performance
```

#### 2. 🤖 GitHub Actions Detects Changes

The auto-release workflow automatically:

- ✅ Analyzes commits since last release
- ✅ Determines version bump (major/minor/patch)
- ✅ Skips if only docs/chore commits

#### 3. 📝 Nx Release Creates the Release

If release is needed, it automatically:

- ✅ Bumps version in `package.json`
- ✅ Generates/updates `CHANGELOG.md`
- ✅ Creates git commit: `🔖 chore(release): publish X.Y.Z`
- ✅ Creates git tag: `zard@X.Y.Z`
- ✅ Pushes to GitHub

#### 4. 📦 NPM Publishing (Triggered by Tag)

The tag push triggers the publish workflow:

- ✅ Builds packages
- ✅ Publishes to npm
- ✅ Creates GitHub Release with notes

### 📊 Version Bump Logic

| Commits in PR             | Version Bump | Example            |
| ------------------------- | ------------ | ------------------ |
| Only `feat`               | **Minor**    | `1.2.3` → `1.3.0` |
| Only `fix`                | **Patch**    | `1.2.3` → `1.2.4` |
| `feat` + `fix`            | **Minor**    | `1.2.3` → `1.3.0` |
| Any with `!`              | **Major**    | `1.2.3` → `2.0.0` |
| Only `docs`, `chore`, etc | **None**     | No release         |

### 🎯 What You Need to Do

**Nothing!** Just:

1. ✅ Use proper commit format (emoji + type)
2. ✅ Get your PR reviewed and approved
3. ✅ Squash & merge to master
4. ✅ Automation handles the rest!

### 🔍 Monitoring Releases

- 📊 **GitHub Actions**: Check the "Actions" tab for release status
- 📝 **CHANGELOG.md**: Auto-updated with each release
- 🏷️ **GitHub Releases**: Created automatically with notes
- 📦 **npm**: Published automatically

### 🛠️ Manual Release (Emergency)

If you need to create a release manually:

```bash
# Dry run (preview)
npm run release:dry-run

# Create release
npm run release

# Create specific version
npx nx release version 1.2.3
```

### 📅 Release Frequency

- **Automatic**: Every merge to master (if needed)
- **No schedule**: Releases happen when features/fixes are ready
- **Fast**: Release created within ~2 minutes of merge

### 🔖 Version Support

- **Current**: Angular 21 actively supported
- **Previous**: Angular 20 actively supported
- **LTS**: Angular 19 with bug fixes only
- **Migration**: Documented in CHANGELOG when dropping support

## 🤝 Community and Support

- **Issues**: Report bugs or request features
- **Discussions**: General discussions and questions
- **Email**: For specific questions → **gomesluiz.dev@gmail.com**

## 📚 Useful Resources

- [Nx Documentation](https://nx.dev/)
- [Angular Docs](https://angular.dev/)
- [TailwindCSS v4](https://tailwindcss.com/docs)
- [CVA Documentation](https://cva.style/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Testing Library Angular](https://testing-library.com/docs/angular-testing-library/intro/)

---

**Questions?** Open an issue or get in touch! Your contribution is very welcome! 🎉
