# Icon

A versatile icon component that wraps lucide-angular icons with a consistent API and styling. This component provides an abstraction layer over icon libraries, making it easy to switch icon providers in the future if needed.

## Features

- **Type-safe icon names** - Full TypeScript support with autocomplete for all available icons
- **Consistent sizing** - Predefined size variants (sm, default, lg, xl)
- **Customizable** - Custom classes, stroke width, and color support
- **Future-proof** - Easy to swap icon libraries by only changing the z-icon component
- **Tree-shakeable** - Only includes icons that are actually used in your bundle

## Usage

```typescript
import { ZardIconComponent } from '@zard/zard';
```

### Basic Example

```html
<z-icon zType="Home" />
<z-icon zType="Settings" />
<z-icon zType="User" />
```

### With Sizes

```html
<z-icon zType="Home" zSize="sm" />
<z-icon zType="Home" zSize="default" />
<z-icon zType="Home" zSize="lg" />
<z-icon zType="Home" zSize="xl" />
```

### With Custom Colors

```html
<z-icon zType="Heart" class="text-destructive" />
<z-icon zType="CheckCircle" class="text-green-500" />
<z-icon zType="AlertTriangle" class="text-warning" />
```

### With Stroke Width

```html
<z-icon zType="Home" [zStrokeWidth]="1" />
<z-icon zType="Home" [zStrokeWidth]="3" />
```

## Available Icons

This component uses lucide-angular under the hood. You can find all available icons at [lucide.dev/icons](https://lucide.dev/icons).

When using an icon name, convert the kebab-case name to PascalCase. For example:
- `chevron-down` → `ChevronDown`
- `check-circle` → `CheckCircle`
- `alert-triangle` → `AlertTriangle`

## Architecture Benefits

The z-icon component provides an abstraction layer that:

1. **Encapsulates icon library implementation** - If you need to switch from lucide-angular to another library in the future, you only need to update the z-icon component
2. **Provides consistent sizing** - All icons use the same size variants across your application
3. **Type safety** - Full TypeScript support with autocomplete for icon names
4. **Simplifies usage** - Simple, clean API that's easy to use and understand
