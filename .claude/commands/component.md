Creates a new zard component named "$ARGUMENTS" following ZardUI patterns and conventions.

# Command Component

Usage: `/component [component-name]`
Example: `/component table` creates a table component

## Overview

This command creates a complete ZardUI component named "$ARGUMENTS" with proper file structure, TypeScript patterns, and documentation setup.

**Component to create: $ARGUMENTS**

### Design Philosophy

ZardUI follows the **shadcn/ui and ng-zorro developer experience standards**:

- **Intuitive API design** with clear, predictable prop names
- **Consistent component patterns** across the entire library
- **Excellent TypeScript support** with full type safety
- **Flexible styling system** that's easy to customize
- **Comprehensive documentation** with live examples
- **Accessibility-first** approach following ARIA standards

## Component Architecture Requirements

### File Structure

Each component must follow this exact pattern:

```
libs/zard/src/lib/components/[component-name]/
├── [component-name].component.ts     # Main component
├── [component-name].variants.ts      # CVA styling variants
├── demo/                            # Demo components for docs
│   ├── [component-name].ts          # Main demo export
│   ├── default.ts                   # Default example
│   └── [variant].ts                 # Variant examples
└── doc/                             # Documentation
    ├── overview.md                  # Component overview
    └── api.md                       # API reference
```

### Component Template

```typescript
@Component({
  selector: 'z-[name], [element][z-[name]]',
  exportAs: 'z[Name]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<!-- component template -->`,
  host: {
    '[class]': 'classes()',
  },
})
export class Zard[Name]Component {
  readonly class = input<ClassValue>('');
  readonly zType = input<Zard[Name]Variants['zType']>('default');
  readonly zSize = input<Zard[Name]Variants['zSize']>('default');
  // Add other variant inputs as needed

  protected readonly classes = computed(() =>
    mergeClasses([name]Variants({
      zType: this.zType(),
      zSize: this.zSize()
    }), this.class())
  );
}
```

### Required Patterns (Following shadcn/ui & ng-zorro Standards)

- **Standalone components** with `standalone: true`
- **Signal-based inputs** using `input()` function for modern Angular patterns
- **CVA (Class Variance Authority)** for type-safe styling variants like shadcn/ui
- **OnPush change detection** for optimal performance
- **ViewEncapsulation.None** for global styling flexibility
- **exportAs** for template reference variables (ng-zorro pattern)
- **Host binding** for dynamic classes: `host: { '[class]': 'classes()' }`
- **ClassValue** type for class input (shadcn/ui pattern)
- **Prefixed variant props** with `z` prefix (e.g., `zType`, `zSize`) for consistency
- **TailwindCSS** with `mergeClasses` utility for class merging
- **Intuitive prop names** that match user expectations (e.g., `disabled`, `loading`, `size`)
- **Consistent variant naming** across all components (`default`, `secondary`, `destructive`, etc.)

### Demo Structure

Demo folder must contain:

- `[component].ts` - Main demo export with examples array
- `default.ts` - Default example component
- Additional variant demo components (e.g., `secondary.ts`, `outline.ts`)

Demo export structure:

```typescript
export const [COMPONENT_NAME] = {
  componentName: '[component-name]',
  componentType: '[component-name]',
  examples: [
    {
      name: 'default',
      component: ZardDemo[Name]DefaultComponent,
    },
    // Additional examples...
  ],
};
```

### Export Requirements

1. Export component in `libs/zard/src/lib/components/components.ts`
2. Create demo components following the structure above
3. Write documentation in `doc/overview.md` and `doc/api.md`
4. **Add to documentation system**:
   - Import demo in `apps/web/src/app/shared/constants/components.constant.ts`
   - Add to `COMPONENTS` array in alphabetical order
   - Add route entry in `COMPONENTS_PATH.data` in `routes.constant.ts`
5. File watcher automatically syncs demo/doc to web app

### Testing

- Co-located `.spec.ts` files next to components
- Use Jest with `@happy-dom/jest-environment`
- Angular testing utilities: TestBed, ComponentFixture

### Development Workflow (shadcn/ui & ng-zorro Quality Standards)

1. **Research component patterns** - Study how shadcn/ui and ng-zorro implement similar components
2. Create component in `libs/zard/src/lib/components/[name]/`
3. Export in `libs/zard/src/lib/components/components.ts`
4. **Create comprehensive demos** showing all variants and use cases
5. **Write thorough documentation** in doc/ folder with:
   - Clear usage examples
   - Complete API reference
   - Accessibility considerations
   - Best practices
6. **Register in documentation system**:
   - Import demo in `apps/web/src/app/shared/constants/components.constant.ts`
   - Add to `COMPONENTS` array (alphabetical order)
   - Add sidebar entry in `routes.constant.ts` COMPONENTS_PATH.data
7. **Test thoroughly** with `npx nx test zard --watch`
8. **Verify accessibility** and keyboard navigation
9. File watcher syncs automatically to web app

### Quality Checklist (Match shadcn/ui & ng-zorro Standards)

- [ ] Component API is intuitive and predictable
- [ ] All variants work correctly and look polished
- [ ] TypeScript types are comprehensive and helpful
- [ ] Component is fully accessible (ARIA, keyboard navigation)
- [ ] Documentation includes all necessary examples
- [ ] Tests cover all major functionality
- [ ] Styling is consistent with design system
- [ ] Performance is optimized (OnPush, computed signals)

### Documentation System Integration

```typescript
// In components.constant.ts
import { [COMPONENT_NAME] } from '@zard/components/[component-name]/demo/[component-name]';

export const COMPONENTS: ComponentData[] = [
  // ... other components in alphabetical order
  [COMPONENT_NAME],
  // ... remaining components
];
```

```typescript
// In routes.constant.ts COMPONENTS_PATH.data
{ name: '[Component Name]', path: '/docs/components/[component-name]', available: true },
```
