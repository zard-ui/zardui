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
| `minDate`     | `Date \| null`                      | `null`          | Minimum selectable date                   |
| `maxDate`     | `Date \| null`                      | `null`          | Maximum selectable date                   |
| `disabled`    | `boolean`                           | `false`         | Whether the date picker is disabled       |

#### Events

| Event        | Type                         | Description                     |
| ------------ | ---------------------------- | ------------------------------- |
| `dateChange` | `EventEmitter<Date \| null>` | Emitted when a date is selected |
