# API

## [z-tooltip] <span class="api-type-label directive">Directive</span>

| Property     | Description                                             | Type                             | Default |
| ------------ | ------------------------------------------------------- | -------------------------------- | ------- |
| `zTooltip`   | The text content of tooltip                             | `string`                         | -       |
| `zPosition`  | The position of the tooltip                             | `top \| bottom \| left \| right` | `top`   |
| `zTrigger`   | The tooltip trigger mode.                               | `hover \| click`                 | `hover` |
| `zShowDelay` | Delay showing the tooltip after trigger in milliseconds | `number`                         | 150     |
| `zHideDelay` | Delay hiding the tooltip after trigger in milliseconds  | `number`                         | 100     |
| `(zShow)`    | Emitted when the tooltip is shown                       | `output<void>`                   | -       |
| `(zHide)`    | Emitted when the tooltip is hidden                      | `output<void>`                   | -       |
