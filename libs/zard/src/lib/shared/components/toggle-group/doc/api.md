# Toggle Group API

## Component Props

### Inputs

| Name        | Type                   | Default | Description                          |
| ----------- | ---------------------- | ------- | ------------------------------------ |
| `class`     | `ClassValue`           | `''`    | Additional CSS classes               |
| `zDefault`  | `ToggleGroupValue[]`   | `[]`    | Default value when using with forms  |
| `zDisabled` | `boolean`              | `false` | Whether the entire group is disabled |
| `zSize`     | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size variant of the toggle group     |
| `zValue`    | `ToggleGroupValue[]`   | `[]`    | Array of toggle items to display     |

### Outputs

| Name       | Type                               | Description                                               |
| ---------- | ---------------------------------- | --------------------------------------------------------- |
| `onClick`  | `EventEmitter<ToggleGroupValue[]>` | Emitted when any toggle is clicked, returns current state |
| `onHover`  | `EventEmitter<void>`               | Emitted when mouse hovers over any toggle                 |
| `onChange` | `EventEmitter<ToggleGroupValue[]>` | Emitted when toggle state changes, returns updated array  |
