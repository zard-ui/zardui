# Calendar API

## ZardCalendarComponent

### Inputs

| Name       | Type                        | Default     | Description                                     |
| ---------- | --------------------------- | ----------- | ----------------------------------------------- |
| `class`    | `ClassValue`                | `''`        | Additional CSS classes to apply to the calendar |
| `zSize`    | `'sm' \| 'default' \| 'lg'` | `'default'` | Size variant of the calendar                    |
| `value`    | `Date \| null`              | `null`      | Currently selected date                         |
| `minDate`  | `Date \| null`              | `null`      | Minimum selectable date                         |
| `maxDate`  | `Date \| null`              | `null`      | Maximum selectable date                         |
| `disabled` | `boolean`                   | `false`     | Whether the calendar is disabled                |

### Outputs

| Name         | Type                 | Description                     |
| ------------ | -------------------- | ------------------------------- |
| `dateChange` | `EventEmitter<Date>` | Emitted when a date is selected |

### CSS Custom Properties

| Property      | Description                | Default                 |
| ------------- | -------------------------- | ----------------------- |
| `--cell-size` | Size of each calendar cell | `2rem` (varies by size) |

### Size Variants

| Size      | Cell Size | Description                         |
| --------- | --------- | ----------------------------------- |
| `sm`      | `1.75rem` | Compact calendar with smaller cells |
| `default` | `2rem`    | Standard calendar size              |
| `lg`      | `2.5rem`  | Larger calendar with bigger cells   |
