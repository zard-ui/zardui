# API

### z-select

> A customizable select component that supports single and multiple value selection.

| Input              | Description                                      | Type                           | Default                 |
| ------------------ | ------------------------------------------------ | ------------------------------ | ----------------------- |
| `[class]`          | Custom CSS classes                               | `ClassValue`                   | `''`                    |
| `[zAlign]`         | Overlay alignment relative to the trigger        | `'start' \| 'center' \| 'end'` | `'center'`              |
| `[zDir]`           | Text direction for trigger and content           | `'ltr' \| 'rtl' \| 'auto'`     | `'auto'`                |
| `[zDisabled]`      | Disables the select                              | `boolean`                      | `false`                 |
| `[zInvalid]`       | Applies invalid ARIA state and destructive style | `boolean`                      | `false`                 |
| `[zLabel]`         | Optional manual display label                    | `string`                       | `''`                    |
| `[zMaxLabelCount]` | Limits visible labels in multiselect mode        | `number`                       | `1`                     |
| `[zMultiple]`      | Enables multiselect mode                         | `boolean`                      | `false`                 |
| `[zPlaceholder]`   | Placeholder text                                 | `string`                       | `'Select an option...'` |
| `[zPosition]`      | Overlay positioning mode                         | `'item-aligned' \| 'popper'`   | `'popper'`              |
| `[zSize]`          | Trigger and item size                            | `'sm' \| 'default' \| 'lg'`    | `'default'`             |
| `[(zValue)]`       | Selected value                                   | `string \| string[]`           | `'' \| []`              |

| Output               | Description                             | Payload              |
| -------------------- | --------------------------------------- | -------------------- |
| `(zSelectionChange)` | Emitted when the selected value changes | `string \| string[]` |

### z-select-item

> Represents an individual item inside a `z-select` component.

| Input         | Description                         | Type         | Default |
| ------------- | ----------------------------------- | ------------ | ------- |
| `[class]`     | Custom CSS classes                  | `ClassValue` | `''`    |
| `[zValue]`    | The value associated with this item | `string`     | `''`    |
| `[zDisabled]` | Disables selection for this item    | `boolean`    | `false` |

### z-select-group

> Groups related select items.

| Input     | Description        | Type         | Default |
| --------- | ------------------ | ------------ | ------- |
| `[class]` | Custom CSS classes | `ClassValue` | `''`    |

### z-select-label

> Displays a non-selectable label inside a select group.

| Input     | Description        | Type         | Default |
| --------- | ------------------ | ------------ | ------- |
| `[class]` | Custom CSS classes | `ClassValue` | `''`    |

### z-select-separator

> Displays a separator between select groups.

| Input     | Description        | Type         | Default |
| --------- | ------------------ | ------------ | ------- |
| `[class]` | Custom CSS classes | `ClassValue` | `''`    |
