# API

## [z-tooltip] <span class="api-type-label directive">Directive</span>

| Property      | Description                        | Type                             | Default |
| ------------- | ---------------------------------- | -------------------------------- | ------- |
| `[zTooltip]`  | The text content of tooltip        | `string`                         | -       |
| `[zPosition]` | The position of the tooltip        | `top \| bottom \| left \| right` | `top`   |
| `[zTrigger]`  | The tooltip trigger mode.          | `hover \| click`                 | `hover` |
| `(zOnShow)`   | Emitted when the tooltip is shown  | `EventEmitter<void>`             | -       |
| `(zOnHide)`   | Emitted when the tooltip is hidden | `EventEmitter<void>`             | -       |
