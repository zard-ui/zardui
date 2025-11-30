# API Reference

## ZardResizableComponent

The main container component that manages resizable panels.

### Selector

`z-resizable`

### Inputs

| Input     | Type                         | Default        | Description                                   |
| --------- | ---------------------------- | -------------- | --------------------------------------------- |
| `zLayout` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction of the panels                |
| `zLazy`   | `boolean`                    | `false`        | If true, panels only update after resize ends |
| `class`   | `ClassValue`                 | `''`           | Additional CSS classes to apply               |

### Outputs

| Output         | Type                      | Description                |
| -------------- | ------------------------- | -------------------------- |
| `zResizeStart` | `output<ZardResizeEvent>` | Emitted when resize starts |
| `zResize`      | `output<ZardResizeEvent>` | Emitted during resize      |
| `zResizeEnd`   | `output<ZardResizeEvent>` | Emitted when resize ends   |

### Methods

| Method          | Parameters                                             | Description                                   |
| --------------- | ------------------------------------------------------ | --------------------------------------------- |
| `startResize`   | `handleIndex: number, event: MouseEvent \| TouchEvent` | Initiates resize operation                    |
| `collapsePanel` | `index: number`                                        | Toggles collapse state of a collapsible panel |

## ZardResizablePanelComponent

Individual panel component within a resizable container.

### Selector

`z-resizable-panel`

### Inputs

| Input          | Type                  | Default     | Description                     |
| -------------- | --------------------- | ----------- | ------------------------------- |
| `zDefaultSize` | `number \| undefined` | `undefined` | Initial size as percentage      |
| `zMin`         | `number`              | `0`         | Minimum size as percentage      |
| `zMax`         | `number`              | `100`       | Maximum size as percentage      |
| `zCollapsible` | `boolean`             | `false`     | Whether panel can be collapsed  |
| `zResizable`   | `boolean`             | `true`      | Whether panel can be resized    |
| `class`        | `ClassValue`          | `''`        | Additional CSS classes to apply |

## ZardResizableHandleComponent

Draggable divider between panels.

### Selector

`z-resizable-handle`

### Inputs

| Input          | Type         | Default | Description                        |
| -------------- | ------------ | ------- | ---------------------------------- |
| `zWithHandle`  | `boolean`    | `false` | Shows visual grip handle           |
| `zDisabled`    | `boolean`    | `false` | Disables resize functionality      |
| `zHandleIndex` | `number`     | `0`     | Index of the handle (auto-managed) |
| `class`        | `ClassValue` | `''`    | Additional CSS classes to apply    |
