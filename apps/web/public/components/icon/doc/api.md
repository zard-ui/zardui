# Icon API

## Component Selector

- `z-icon`
- `[z-icon]`

## Inputs

### zType (required)

The name of the icon to display from lucide-angular.

- **Type:** `IconName` (PascalCase icon names from lucide-angular)
- **Required:** Yes
- **Example:** `"Home"`, `"ChevronDown"`, `"AlertTriangle"`

```html
<z-icon zType="Home" />
```

### zSize

The size variant of the icon.

- **Type:** `'sm' | 'default' | 'lg' | 'xl'`
- **Default:** `'default'`
- **Required:** No

**Size mapping:**
- `sm` - h-3 w-3
- `default` - h-3.5 w-3.5
- `lg` - h-5 w-5
- `xl` - h-6 w-6

```html
<z-icon zType="Home" zSize="lg" />
```

### zStrokeWidth

The stroke width of the icon.

- **Type:** `number`
- **Default:** `2`
- **Required:** No

```html
<z-icon zType="Home" [zStrokeWidth]="3" />
```

### zAbsoluteStrokeWidth

Whether to use absolute stroke width.

- **Type:** `boolean`
- **Default:** `false`
- **Required:** No

```html
<z-icon zType="Home" [zAbsoluteStrokeWidth]="true" />
```

### class

Additional CSS classes to apply to the icon wrapper.

- **Type:** `ClassValue` (string | string[] | object)
- **Default:** `''`
- **Required:** No

```html
<z-icon zType="Home" class="text-primary hover:text-primary/80" />
```

## Styling

The icon component accepts custom classes through the `class` input. You can use Tailwind utility classes or custom CSS classes.

### Color

```html
<z-icon zType="Heart" class="text-red-500" />
<z-icon zType="CheckCircle" class="text-green-500" />
```

### Hover Effects

```html
<z-icon zType="Settings" class="hover:text-primary transition-colors" />
```

### Combining with Other Utilities

```html
<z-icon zType="Star" class="text-yellow-500 hover:scale-110 transition-transform" />
```

## Type Safety

The component provides full type safety for icon names through the `IconName` type, which is derived from lucide-angular's icon registry. This means:

- **Autocomplete** - Your IDE will suggest available icon names
- **Compile-time errors** - Invalid icon names will cause TypeScript errors
- **Refactoring support** - Renaming icons will update all usages

## Examples

### Icon with Multiple Props

```html
<z-icon
  zType="Settings"
  zSize="lg"
  [zStrokeWidth]="2.5"
  class="text-primary hover:rotate-90 transition-transform duration-300"
/>
```

### Dynamic Icon Type

```typescript
@Component({
  template: `<z-icon [zType]="iconType" />`
})
export class MyComponent {
  iconType: IconName = 'Home';

  changeIcon() {
    this.iconType = 'Settings';
  }
}
```

### Conditional Styling

```html
<z-icon
  zType="AlertTriangle"
  [class]="isError ? 'text-destructive' : 'text-warning'"
/>
```
