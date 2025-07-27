# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ZardUI is an Angular component library built with TailwindCSS, inspired by shadcn/ui. It's an Nx monorepo with two main projects:
- `libs/zard/` - The publishable Angular component library
- `apps/web/` - Documentation website and component showcase

## Essential Commands

### Development
```bash
npm start                    # Start dev server with file watcher (port 4222)
npm run watch:files         # Watch and sync demo/doc files only
```

### Building
```bash
npm run build              # Build production web app
npm run build:dev          # Build development web app  
npm run publish:build      # Build all library packages for publishing
```

### Testing
```bash
npm test                   # Run tests for all libraries
npx nx test zard           # Run tests for specific library
npx nx test zard --watch   # Run tests in watch mode
```

### Release
```bash
npm run release            # Automated release with conventional commits
```

## Architecture Overview

### Monorepo Structure
- **Nx workspace** with dependency graph and caching
- **Conventional commits** for automated releases
- **Path aliases**: `@zard/*` → `libs/zard/src/lib/*`

### Component Architecture
Components follow modern Angular patterns:
- **Standalone components** with `standalone: true`
- **Signal-based inputs** using `input()` function
- **CVA (Class Variance Authority)** for type-safe styling variants
- **OnPush change detection** for performance
- **Host binding** for dynamic classes: `host: { '[class]': 'classes()' }`

### Component File Structure
Each component follows this pattern:
```
component-name/
├── component-name.component.ts     # Main component
├── component-name.variants.ts      # CVA styling variants
├── demo/                          # Demo components for docs
│   ├── component-name.ts          # Main demo export
│   ├── default.ts                 # Default example
│   └── [variant].ts               # Variant examples
└── doc/                           # Documentation
    ├── overview.md                # Component overview
    └── api.md                     # API reference
```

### Documentation System
- **Automated file sync**: `scripts/generate-files.cts` watches component `demo/` and `doc/` folders
- **Real-time updates**: File watcher copies changes to `apps/web/public/components/`
- **Dynamic rendering**: Web app uses `NgComponentOutlet` for live demos

### Styling System
- **TailwindCSS v4** with PostCSS
- **Class merging**: `tailwind-merge` for conflict resolution
- **Conditional classes**: `clsx` utility
- **Design tokens**: CSS custom properties for theming

## Component Development Workflow

1. **Create component** in `libs/zard/src/lib/components/[name]/`
2. **Export component** in `libs/zard/src/lib/components/components.ts`
3. **Add demo components** in `demo/` folder following existing patterns
4. **Write documentation** in `doc/overview.md` and `doc/api.md`
5. **File watcher automatically syncs** demo/doc to web app
6. **Test component** with `npx nx test zard --watch`

### Component Template
```typescript
@Component({
  selector: 'z-[name], [z-[name]]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `<!-- component template -->`
})
export class Zard[Name]Component {
  readonly variant = input<Zard[Name]Variants['variant']>('default');
  readonly size = input<Zard[Name]Variants['size']>('default');
  readonly class = input<string>('');
  
  protected readonly classes = computed(() => 
    mergeClasses([name]Variants({
      variant: this.variant(),
      size: this.size()
    }), this.class())
  );
}
```

## Testing Guidelines

- **Jest** with `@happy-dom/jest-environment`
- **Co-located tests**: `.spec.ts` files next to components
- **Angular testing utilities**: TestBed, ComponentFixture
- **Coverage collection** in `coverage/libs/zard`

## Key Files to Understand

- `libs/zard/src/index.ts` - Library entry point
- `libs/zard/src/lib/components/components.ts` - Component exports
- `scripts/generate-files.cts` - Documentation sync automation
- `apps/web/src/app/shared/constants/components.constant.ts` - Component registry
- `apps/web/src/app/widget/components/zard-code-box/` - Demo renderer

## Node.js Requirements

- Node.js 20 or 22 (specified in engines)
- Uses ES modules (`"type": "module"`)

## Build Dependencies

- Build order managed by Nx dependency graph
- Web app depends on library builds (`dependsOn: ["^build"]`)
- Library packages built independently for publishing