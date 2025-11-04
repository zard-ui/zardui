# API

### z-select

> A customizable select component that allows single value selection.

| Input              | Description                               | Type                 | Default                 |
| ------------------ | ----------------------------------------- | -------------------- | ----------------------- |
| `[class]`          | Custom CSS classes                        | `string`             | `''`                    |
| `[zDisabled]`      | Disables the select                       | `boolean`            | `false`                 |
| `[zLabel]`         | Optional label for the select             | `string`             | `''`                    |
| `[zMaxLabelCount]` | Limits visible labels in multiselect mode | `number`             | `0`                     |
| `[zMultiple]`      | Multiselect mode                          | `boolean`            | `false`                 |
| `[zPlaceholder]`   | Placeholder text                          | `string`             | `'Select an option...'` |
| `[(zValue)]`       | Selected value                            | `string \| string[]` | `'' \| []`              |

| Output               | Description                             | Payload              |
| -------------------- | --------------------------------------- | -------------------- |
| `(zSelectionChange)` | Emitted when the selected value changes | `string \| string[]` |

### z-select-item

> Represents an individual item inside a `z-select` component.

| Input         | Description                         | Type      | Default |
| ------------- | ----------------------------------- | --------- | ------- |
| `[class]`     | Custom CSS classes                  | `string`  | `''`    |
| `[zValue]`    | The value associated with this item | `string`  | `''`    |
| `[zDisabled]` | Disables selection for this item    | `boolean` | `false` |
