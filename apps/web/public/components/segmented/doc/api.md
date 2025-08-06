# API

### Inputs

| Name            | Type                        | Default               | Description                            |
| --------------- | --------------------------- | --------------------- | -------------------------------------- |
| `class`         | `ClassValue`                | `''`                  | Additional CSS classes to apply        |
| `zSize`         | `'sm' \| 'default' \| 'lg'` | `'default'`           | Size of the segmented control          |
| `zOptions`      | `SegmentedOption[]`         | `[]`                  | Array of options to display            |
| `zDefaultValue` | `string`                    | `''`                  | Default selected value                 |
| `zDisabled`     | `boolean`                   | `false`               | Whether the entire control is disabled |
| `zAriaLabel`    | `string`                    | `'Segmented control'` | ARIA label for accessibility           |

### Outputs

| Name      | Type     | Description                    |
| --------- | -------- | ------------------------------ |
| `zChange` | `string` | Emitted when selection changes |
