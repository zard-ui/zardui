# 🤝 Contributing to ZardUI

Thank you for your interest in contributing to ZardUI! This guide will help you understand how the project is structured and how you can contribute effectively.

## 📋 Table of Contents

- [✅ Requirements](#-requirements)
- [🚀 Initial Setup](#-initial-setup)
- [🏗️ Project Architecture](#️-project-architecture)
- [📁 Folder Structure](#-folder-structure)
- [🧩 Developing Components](#-developing-components)
- [📝 Documentation System](#-documentation-system)
- [🧪 Testing](#-testing)
- [🌿 Branch Strategy](#-branch-strategy)
- [🔄 Contribution Workflow](#-contribution-workflow)
- [📋 Commit Patterns](#-commit-patterns)
- [🔧 Essential Commands](#-essential-commands)

## ✅ Requirements

- **Node.js** version `20` or `22` (specified in `engines`)
- **npm** (included with Node.js)
- **Git** for version control

> 💡 **Tip**: Use `nvm` to manage Node.js versions:
>
> ```bash
> nvm use  # Uses the version specified in .nvmrc
> ```

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

- **Unified workspace** with intelligent caching and dependency graph
- **Conventional commits** for automated releases
- **Path aliases**: `@zard/*` → `libs/zard/src/lib/*`
- **Optimized builds** with parallel task execution

### Main Projects

#### 📚 `libs/zard/` - Component Library

- **Standalone** and **publishable** Angular library
- Components with **signal-based inputs** (`input()`)
- **CVA (Class Variance Authority)** for typed variants
- **OnPush change detection** for performance
- **Host binding** for dynamic classes

#### 🌐 `apps/web/` - Documentation Site

- Angular application that consumes the library
- Interactive documentation with live demos
- **SSG (Static Site Generation)** for performance
- Automatic file synchronization system

## 📁 Folder Structure

```
zardui/
├── libs/zard/                          # 📦 Main library
│   ├── src/lib/components/            # 🧩 Components
│   │   └── [component-name]/          # 📂 Component folder
│   │       ├── [component].component.ts    # 🎯 Main component
│   │       ├── [component].variants.ts     # 🎨 CVA variants
│   │       ├── [component].spec.ts         # 🧪 Tests
│   │       ├── demo/                       # 📋 Demos for docs
│   │       │   ├── [component].ts         # 📤 Main export
│   │       │   ├── default.ts             # 🏠 Default example
│   │       │   └── [variant].ts           # 🔀 Variant examples
│   │       └── doc/                        # 📖 Documentation
│   │           ├── overview.md            # 📝 Overview
│   │           └── api.md                 # 🔧 API reference
│   └── src/lib/shared/utils/          # 🛠️ Shared utilities
├── apps/web/                          # 🌐 Documentation site
│   ├── src/app/                       # 📱 Angular application
│   └── public/components/             # 📁 Synced files
├── scripts/                           # 🤖 Automation scripts
│   ├── generate-files.cts            # 🔄 Demo/docs sync
│   └── generate-installation-guides.cts # 📋 Installation guides
└── packages/                          # 📦 Library builds
```

## 🧩 Developing Components

### Base Template for Components

```typescript
import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { mergeClasses } from '@zard/shared/utils';
import { [componentName]Variants, type [ComponentName]Variants } from './[component-name].variants';

@Component({
  selector: 'z-[name], [z-[name]]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<!-- template here -->`
})
export class Zard[Name]Component {
  readonly variant = input<[ComponentName]Variants['variant']>('default');
  readonly size = input<[ComponentName]Variants['size']>('default');
  readonly class = input<string>('');

  protected readonly classes = computed(() =>
    mergeClasses([componentName]Variants({
      variant: this.variant(),
      size: this.size()
    }), this.class())
  );
}
```

### Development Workflow

1. **Create component** in `libs/zard/src/lib/components/[name]/`
2. **Implement variants** with CVA in `[component].variants.ts`
3. **Write tests** in `[component].spec.ts`
4. **Add to barrel export** in `libs/zard/src/lib/components/components.ts`
5. **Create demos** in the `demo/` folder following existing patterns
6. **Write documentation** in `doc/overview.md` and `doc/api.md`
7. **Watch system automatically syncs** to the website

### Styling Patterns

- **TailwindCSS v4** with PostCSS for styles
- **Class merging** with `tailwind-merge` to resolve conflicts
- **Utility-first** approach for consistency
- **Design tokens** through CSS custom properties

## 📝 Documentation System

### Automatic Synchronization

The `scripts/generate-files.cts` script monitors changes in:

- `libs/zard/src/lib/components/*/demo/` → `apps/web/public/components/*/demo/`
- `libs/zard/src/lib/components/*/doc/` → `apps/web/public/components/*/doc/`

### Demo Structure

```typescript
// demo/default.ts
export const DefaultExample = {
  name: 'Default',
  code: `<z-button>Click me</z-button>`,
  component: () => import('./default.component').then(m => m.DefaultComponent),
};
```

### Documentation

- **overview.md**: Overview, use cases, basic examples
- **api.md**: Complete API reference, props, events, methods

## 🧪 Testing

### Configuration

- **Jest** with `@happy-dom/jest-environment`
- **Angular Testing Utilities** (TestBed, ComponentFixture)
- **Co-located tests** next to components

### Commands

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

### Test Example

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZardButtonComponent } from './button.component';

describe('ZardButtonComponent', () => {
  let component: ZardButtonComponent;
  let fixture: ComponentFixture<ZardButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## 🌿 Branch Strategy

### Simple GitHub Flow

Following the **proposed workflow**, we use a simplified flow:

#### Main Branch

- **`master`** - 🚀 **Single main branch**
  - Receives direct PRs
  - Automatic squash merge
  - Automatic release via tags
  - Continuous deployment to production

#### Feature Branches

Naming convention:

```bash
feat/#<issue-number>-<descriptive-name>
# Example: feat/#42-button-loading
bugfix/#<issue-number>-<descriptive-name>
# Example: bugfix/#43-input-focus-bug
```

## 🔄 Contribution Workflow

### Simple GitHub Flow (Based on Proposed Workflow)

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

- [ ] **Tests passing** - `npm test`
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

Make commits using the standard git command with the emoji + type format:

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

1. ✅ **Emoji at the start** (MANDATORY - commit will be rejected without it)
2. ✅ **Type** (feat, fix, etc)
3. ⚪ **Scope** in parentheses (optional)
4. ✅ **Colon and space**
5. ✅ **Clear, imperative description**

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
npm run watch:files         # 👀 Monitor changes in demos/docs
npm run build              # 🏗️ Production build
npm run build:dev          # 🛠️ Development build
```

### Testing

```bash
npm test                   # 🧪 All tests
npm run test:watch        # 👁️ Tests in watch mode
```

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

## 🚀 Automatic Release System

### ✨ How It Works (100% Automated)

Our release system is **fully automated** - you don't need to do anything special! Here's what happens:

#### 1. 🔀 You Merge a PR to `master`

```bash
# Example PR with commits:
✨ feat(button): add loading variant
🐛 fix(input): resolve focus issue
📦 refactor(dialog): improve performance
```

#### 2. 🤖 GitHub Actions Detects Changes

The [auto-release workflow](.github/workflows/auto-release.yml) automatically:

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

The tag push triggers [release.yml](.github/workflows/release.yml):

- ✅ Builds packages
- ✅ Publishes to npm
- ✅ Creates GitHub Release with notes

### 📊 Version Bump Logic

| Commits in PR             | Version Bump | Example           |
| ------------------------- | ------------ | ----------------- |
| Only `feat`               | **Minor**    | `1.2.3` → `1.3.0` |
| Only `fix`                | **Patch**    | `1.2.3` → `1.2.4` |
| `feat` + `fix`            | **Minor**    | `1.2.3` → `1.3.0` |
| Any with `!`              | **Major**    | `1.2.3` → `2.0.0` |
| Only `docs`, `chore`, etc | **None**     | No release        |

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

- **Current**: Angular 20 actively supported
- **Previous**: Angular 19 actively supported
- **LTS**: Angular 18 with bug fixes only
- **Migration**: Documented in CHANGELOG when dropping support

---

**Questions?** Open an issue or get in touch! Your contribution is very welcome! 🎉
