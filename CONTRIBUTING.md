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

We use **Conventional Commits** as specified in CLAUDE.md:

```bash
📦 refactor: code changes that don't fix bugs or add features
✨ feat: new functionality
🐛 fix: bug correction
💄 style: changes that don't affect code meaning (formatting, etc)
🏗️ build: build system or dependencies changes
🔧 ci: CI configuration changes
✏️ docs: documentation only changes
🚀 perf: performance improvements
🧪 test: adding or correcting tests
🌐 i18n: internationalization and localization
📈 analytics: analytics
🗃️ database: database-related changes
```

### Automatic Versioning

```bash
# Examples of how commits affect versioning:
feat(button): add loading state    # Minor: v19.3.4 → v19.4.0
fix(input): resolve focus bug      # Patch: v19.1.0 → v19.1.1
feat!(card): support to angular 20 # Major: v19.1.0 → v20.0.0
docs: update examples              # No release
```

### Practical Examples

```bash
✨ feat: add button component with variants
🐛 fix: resolve keyboard navigation in dropdown
📦 refactor: improve component performance with OnPush
🧪 test: add comprehensive tests for form validation
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

### Release Cycle

- **Monday-Thursday**: Development and PRs
- **Friday**: Code freeze + automatic release
- **Versioning**: Based on conventional commits

### How It Works

```bash
1. PR with "feat(button): add loading state" is merged
2. Semantic Release detects conventional commit
3. Auto bump: v19.3.4 → v19.4.0
4. Creates tag v19.4.0
5. Publishes @zard/ui@19.4.0 to npm
6. Automatic release notes
```

### Version Support

- **Current + Previous**: Angular 20 + 19 actively supported
- **LTS**: Angular 18 with extended support (bug fixes only)
- **Migration**: When Angular 21 is released, create migration branch

---

**Questions?** Open an issue or get in touch! Your contribution is very welcome! 🎉
