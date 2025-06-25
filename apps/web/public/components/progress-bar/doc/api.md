# Zard Progress Bar API

## `<z-progress-bar>` <span class="api-type-label component">Component</span>

> `z-progress-bar` is a component that accepts all properties supported by a native `<div>`.

To customize the progress bar, pass the following props to the component.

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
