# Zard Progress Bar API

## `<z-progress-bar>` <span class="api-type-label component">Component</span>

The `z-progress-bar` component is a flexible and customizable progress bar that allows full styling control using class-variance-authority (CVA). It provides several configuration options for size, shape, type, and more.

### **Usage**

```html
<z-progress-bar [progress]="50" [zType]="'accent'" [zSize]="'lg'" [zShape]="'circle'" />
```

### **Properties**

| Property           | Description                          | Type                                     | Default     |
| ------------------ | ------------------------------------ | ---------------------------------------- | ----------- |
| `[progress]`       | Progress percentage (0-100).         | `number`                                 | `0`         |
| `[zType]`          | Defines the color variant.           | `'default' \| 'destructive' \| 'accent'` | `'default'` |
| `[zSize]`          | Sets the height of the bar.          | `'default' \| 'sm' \| 'lg'`              | `'default'` |
| `[zShape]`         | Defines the border radius style.     | `'default' \| 'circle' \| 'square'`      | `'default'` |
| `[zFull]`          | Makes the container take full width. | `boolean`                                | `false`     |
| `[class]`          | Custom classes for the container.    | `string`                                 | `''`        |
| `[barClass]`       | Custom classes for the progress bar. | `string`                                 | `''`        |
| `[zIndeterminate]` | Define loading infinity state.       | `boolean`                                | `false`     |

### **Styling**

The component supports full customization via CSS utility classes and CVA variants. Users can pass additional styles using `[class]` for the container and `[barClass]` for the progress bar.

```html
<z-progress-bar [progress]="75" [class]="'border border-gray-500'" [barClass]="'shadow-lg bg-green-500'" />
```
