# API

| Property            | Type                                               | Default               | Description                                 |
| ------------------- | -------------------------------------------------- | --------------------- | ------------------------------------------- |
| `class`             | `ClassValue`                                       | `''`                  | Additional CSS classes                      |
| `buttonVariant`     | `'default' \| 'outline' \| 'secondary' \| 'ghost'` | `'outline'`           | Button variant style                        |
| `zWidth`            | `'default' \| 'sm' \| 'md' \| 'lg' \| 'full'`      | `'default'`           | Width of the combobox                       |
| `placeholder`       | `string`                                           | `'Select...'`         | Placeholder text when no value is selected  |
| `searchPlaceholder` | `string`                                           | `'Search...'`         | Placeholder for the search input            |
| `emptyText`         | `string`                                           | `'No results found.'` | Text shown when no options match the search |
| `disabled`          | `boolean`                                          | `false`               | Whether the combobox is disabled            |
| `searchable`        | `boolean`                                          | `true`                | Whether to show the search input            |
| `value`             | `string \| null`                                   | `null`                | The selected value                          |
| `options`           | `ZardComboboxOption[]`                             | `[]`                  | Array of options (for flat list)            |
| `groups`            | `ZardComboboxGroup[]`                              | `[]`                  | Array of grouped options                    |
| `ariaLabel`         | `string`                                           | `''`                  | ARIA label for accessibility                |
| `ariaDescribedBy`   | `string`                                           | `''`                  | ARIA described-by for accessibility         |

### Outputs

| Event          | Type                               | Description                        |
| -------------- | ---------------------------------- | ---------------------------------- |
| `zValueChange` | `EventEmitter<string \| null>`     | Emitted when the value changes     |
| `zOnSelect`    | `EventEmitter<ZardComboboxOption>` | Emitted when an option is selected |
