# API Reference

## z-icon

### Dependencies

- `@ng-icons/core`
- `@ng-icons/lucide`

### Properties

| Property                 | Description                                                  | Type                                | Default     |
| ------------------------ | ------------------------------------------------------------ | ----------------------------------- | ----------- |
| `[class]`                | Additional CSS classes                                       | `ClassValue`                        | `''`        |
| `[zType]` (required)     | The icon name from ZARD_ICONS registry                       | `ZardIcon`                          |             |
| `[zSize]`                | Icon size variant (can be overriden by class)                | `'sm' \| 'default' \| 'lg' \| 'xl'` | `'default'` |
| `[zStrokeWidth]`         | The stroke width of the icon lines                           | `number`                            | `2`         |
| `[zAbsoluteStrokeWidth]` | Whether to use absolute stroke width (scales with icon size) | `boolean`                           | `false`     |

### Types

```typescript
type ZardIcon =
  | 'house'
  | 'settings'
  | 'user'
  | 'search'
  | 'bell'
  | 'mail'
  | 'calendar'
  | 'check'
  | 'x'
  | 'info'
  | 'triangle-alert'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-left'
  | 'chevron-right'
  | 'moon'
  | 'sun'
  | 'star'
  | 'heart'
  | 'zap'
  | 'github';
// ... and more (see icons.ts for full list)
```

### Provider

The icon component automatically provides the `ZARD_ICONS` registry using `provideIcons()` from `@ng-icons/core`.
