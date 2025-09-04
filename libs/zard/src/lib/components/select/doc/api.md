# API

### z-select

> A customizable select component that allows single value selection.

| Input           | Description                   | Type                        | Default                 |
| --------------- | ----------------------------- | --------------------------- | ----------------------- |
| `[class]`       | Custom CSS classes            | `string`                    | `''`                    |
| `[zSize]`       | Sets the select size          | `'default' \| 'sm' \| 'lg'` | `'default'`             |
| `[placeholder]` | Placeholder text              | `string`                    | `'Select an option...'` |
| `[value]`       | Selected value                | `string`                    | `''`                    |
| `[label]`       | Optional label for the select | `string`                    | `''`                    |
| `[disabled]`    | Disables the select           | `boolean`                   | `false`                 |

| Output              | Description                             | Payload  |
| ------------------- | --------------------------------------- | -------- |
| `(selectionChange)` | Emitted when the selected value changes | `string` |

### z-select-item

> Represents an individual item inside a `z-select` component.

| Input        | Description                         | Type      | Default |
| ------------ | ----------------------------------- | --------- | ------- |
| `[class]`    | Custom CSS classes                  | `string`  | `''`    |
| `[value]`    | The value associated with this item | `string`  | `''`    |
| `[disabled]` | Disables selection for this item    | `boolean` | `false` |
