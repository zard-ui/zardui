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

### Trunk-Based Development

We follow **Trunk-Based Development** with short-lived feature branches:

#### Main Branches

- **`master`** - 🚀 **Production**

  - Protected branch, maintainers only
  - Updates via PRs from `beta` branch
  - Automatic deployment to production

- **`beta`** - 🧪 **Development**
  - Integration and testing branch
  - Deployed at: `https://dev.zardui.com/`
  - All features are tested here first

#### Feature Branches

Naming convention:

```bash
feat/#<issue-number>-<descriptive-name>
# Example: feat/#42-button-component
```

## 🔄 Contribution Workflow

### Step by Step

1. **📋 Find or create an issue** on GitHub
2. **🏷️ Assign the issue to yourself** (prevents duplication)
3. **🌿 Create your branch** from `beta`:
   ```bash
   git checkout beta
   git pull origin beta
   git checkout -b feat/#123-new-feature
   ```
4. **💻 Develop your feature** following the patterns
5. **🧪 Run tests**:
   ```bash
   npm test
   npm run test:watch  # during development
   ```
6. **📝 Make commits** following conventional commits
7. **🚀 Open a Pull Request** to `beta`
8. **👁️ Wait for review** from maintainers
9. **✅ After approval**, automatic deployment to dev environment

### PR Checklist

- [ ] Tests passing
- [ ] Code follows project patterns
- [ ] Documentation updated (if necessary)
- [ ] Demos working correctly
- [ ] No lint/typecheck warnings
- [ ] Related issue linked

## 📋 Commit Patterns

We use **Conventional Commits** for automated releases:

```bash
📦 refactor: code changes without bugs/features
✨ feat: new functionality
🐛 fix: bug correction
💄 style: formatting (no logic changes)
🏗️ build: build system/dependencies
🔧 ci: CI configurations
✏️ docs: documentation only
🚀 perf: performance improvements
🧪 test: adding/correcting tests
🌐 i18n: internationalization
📈 analytics: analytics and metrics
🗃️ database: database-related changes
```

### Examples

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

---

**Questions?** Open an issue or get in touch! Your contribution is very welcome! 🎉
