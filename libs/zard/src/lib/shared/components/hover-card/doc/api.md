# API

### [zHoverCard]

> Opens rich content in a floating panel when its trigger is hovered or focused.

| Input           | Description                                | Type                                     | Default    |
| --------------- | ------------------------------------------ | ---------------------------------------- | ---------- |
| `[zHoverCard]`  | Template rendered inside the hover card    | `TemplateRef<void>`                      | Required   |
| `[zPlacement]`  | Preferred position relative to the trigger | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` |
| `[zOpenDelay]`  | Delay in milliseconds before opening       | `number`                                 | `700`      |
| `[zCloseDelay]` | Delay in milliseconds before closing       | `number`                                 | `300`      |
| `[zVisible]`    | Controls visibility programmatically       | `boolean`                                | `false`    |

| Output             | Description                         | Payload   |
| ------------------ | ----------------------------------- | --------- |
| `(zVisibleChange)` | Emitted when the visibility changes | `boolean` |

### z-hover-card

> Wraps and styles the content displayed by `[zHoverCard]`.

| Input     | Description        | Type         | Default |
| --------- | ------------------ | ------------ | ------- |
| `[class]` | Custom CSS classes | `ClassValue` | `''`    |
