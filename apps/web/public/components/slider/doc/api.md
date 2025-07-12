# API

## [z-slider] <span class="api-type-label component">Component</span>

> `z-slider` is a flexible and accessible component that allows users to select a numeric value from within a configurable range using pointer or keyboard interaction.

| Property         | Description                           | Type                     | Default        |
| ---------------- | ------------------------------------- | ------------------------ | -------------- |
| `[class]`        | Custom CSS classes                    | `string`                 | `''`           |
| `[zMin]`         | Minimum selectable value              | `number`                 | `0`            |
| `[zMax]`         | Maximum selectable value              | `number`                 | `100`          |
| `[zDefault]`     | Default value when `zValue` is absent | `number`                 | `0`            |
| `[zValue]`       | Controlled value input                | `number \| null`         | `null`         |
| `[zStep]`        | Step increment for the value          | `number`                 | `1`            |
| `[zDisabled]`    | Disables slider interaction           | `boolean`                | `false`        |
| `[zOrientation]` | Slider orientation                    | `horizontal \| vertical` | `'horizontal'` |

### Events

| Event       | Description                           | Type     |
| ----------- | ------------------------------------- | -------- |
| `(onSlide)` | Emitted when the slider value changes | `number` |
