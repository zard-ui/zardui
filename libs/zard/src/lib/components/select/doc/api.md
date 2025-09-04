# API

### z-select

> A customizable select component that allows single value selection.

| Input            | Description                   | Type                        | Default                 |
| ---------------- | ----------------------------- | --------------------------- | ----------------------- |
| `[class]`        | Custom CSS classes            | `string`                    | `''`                    |
| `[zSize]`        | Sets the select size          | `'default' \| 'sm' \| 'lg'` | `'default'`             |
| `[zPlaceholder]` | Placeholder text              | `string`                    | `'Select an option...'` |
| `[zValue]`       | Selected value                | `string`                    | `''`                    |
| `[zLabel]`       | Optional label for the select | `string`                    | `''`                    |
| `[zDisabled]`    | Disables the select           | `boolean`                   | `false`                 |

| Output              | Description                             | Payload  |
| ------------------- | --------------------------------------- | -------- |
| `(selectionChange)` | Emitted when the selected value changes | `string` |

### z-select-item

> Represents an individual item inside a `z-select` component.

| Input         | Description                         | Type      | Default |
| ------------- | ----------------------------------- | --------- | ------- |
| `[class]`     | Custom CSS classes                  | `string`  | `''`    |
| `[zValue]`    | The value associated with this item | `string`  | `''`    |
| `[zDisabled]` | Disables selection for this item    | `boolean` | `false` |
