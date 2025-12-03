# API Reference

[z-calendar] Component

### Inputs

| Name       | Type                                | Default    | Description                                                        |
| ---------- | ----------------------------------- | ---------- | ------------------------------------------------------------------ |
| `class`    | `ClassValue`                        | `''`       | Additional CSS classes to apply to the calendar                    |
| `zMode`    | `'single' \| 'multiple' \| 'range'` | `'single'` | Selection mode of the calendar                                     |
| `value`    | `CalendarValue`                     | `null`     | Currently selected date(s) - type depends on mode                  |
| `minDate`  | `Date \| null`                      | `null`     | Minimum selectable date. Also used to expand the year picker range |
| `maxDate`  | `Date \| null`                      | `null`     | Maximum selectable date. Also used to expand the year picker range |
| `disabled` | `boolean`                           | `false`    | Whether the calendar is disabled                                   |

### Outputs

| Name         | Type                           | Description                         |
| ------------ | ------------------------------ | ----------------------------------- |
| `dateChange` | `EventEmitter<Date \| Date[]>` | Emitted when date selection changes |

### Selection Modes

| Mode       | Value Type      | Description                                      |
| ---------- | --------------- | ------------------------------------------------ |
| `single`   | `Date \| null`  | Select a single date (default behavior)          |
| `multiple` | `Date[]`        | Select multiple individual dates (toggle on/off) |
| `range`    | `[Date, Date?]` | Select a date range (click start, then end)      |

### Methods

| Name              | Signature  | Description                                          |
| ----------------- | ---------- | ---------------------------------------------------- |
| `resetNavigation` | `(): void` | Resets calendar navigation to the current value date |
