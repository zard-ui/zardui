# API

## [zPopover] <span class="api-type-label directive">Directive</span>

The directive that creates a popover when applied to a trigger element.

| Property            | Description                                      | Type                                     | Default    |
| ------------------- | ------------------------------------------------ | ---------------------------------------- | ---------- |
| `zTrigger`          | How the popover is triggered                     | `'click' \| 'hover' \| null`             | `'click'`  |
| `zContent`          | **Required**. Template to display in the popover | `TemplateRef<unknown>`                   | -          |
| `zPlacement`        | Position relative to trigger                     | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` |
| `zOrigin`           | Custom anchor element                            | `ElementRef`                             | -          |
| `zVisible`          | Control visibility programmatically              | `boolean`                                | `false`    |
| `zOverlayClickable` | Close on outside click                           | `boolean`                                | `true`     |

### Outputs

| Property         | Description                   | Type                    |
| ---------------- | ----------------------------- | ----------------------- |
| `zVisibleChange` | Emits when visibility changes | `EventEmitter<boolean>` |

## z-popover <span class="api-type-label component">Component</span>

The wrapper component for popover content styling.

| Property | Description            | Type     | Default |
| -------- | ---------------------- | -------- | ------- |
| `class`  | Additional CSS classes | `string` | `''`    |
