# Date Picker API

### ZardDatePickerComponent

A date picker component that provides an intuitive interface for date selection through a button trigger and calendar popup.

#### Properties

| Property      | Type                                | Default         | Description                               |
| ------------- | ----------------------------------- | --------------- | ----------------------------------------- |
| `class`       | `ClassValue`                        | `''`            | Additional CSS classes                    |
| `zType`       | `'default' \| 'outline' \| 'ghost'` | `'outline'`     | Button variant style                      |
| `zSize`       | `'sm' \| 'default' \| 'lg'`         | `'default'`     | Size of the date picker                   |
| `value`       | `Date \| null`                      | `null`          | Selected date value                       |
| `placeholder` | `string`                            | `'Pick a date'` | Placeholder text when no date is selected |
| `zFormat`     | `string`                            | `'MMMM d, yyyy'` | Date format pattern                      |
| `minDate`     | `Date \| null`                      | `null`          | Minimum selectable date                   |
| `maxDate`     | `Date \| null`                      | `null`          | Maximum selectable date                   |
| `disabled`    | `boolean`                           | `false`         | Whether the date picker is disabled       |

#### Format Patterns

The `zFormat` property supports the following patterns:

| Pattern | Description       | Example     |
|---------|-------------------|-------------|
| `yyyy`  | 4-digit year      | 2024        |
| `yy`    | 2-digit year      | 24          |
| `MMMM`  | Full month name   | January     |
| `MMM`   | Short month name  | Jan         |
| `MM`    | Month (2 digits)  | 01          |
| `M`     | Month (1-2 digits)| 1           |
| `dd`    | Day (2 digits)    | 05          |
| `d`     | Day (1-2 digits)  | 5           |
| `EEEE`  | Full day name     | Sunday      |
| `EEE`   | Short day name    | Sun         |

Common format examples:
- `'MMMM d, yyyy'` → "January 5, 2024" (default)
- `'MM/dd/yyyy'` → "01/05/2024"
- `'dd-MM-yy'` → "05-01-24"
- `'EEE, MMM d'` → "Sun, Jan 5"

#### Events

| Event        | Type                         | Description                     |
| ------------ | ---------------------------- | ------------------------------- |
| `dateChange` | `EventEmitter<Date \| null>` | Emitted when a date is selected |
