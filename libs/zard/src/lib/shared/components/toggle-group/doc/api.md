# Toggle Group API

## Component Props

### Inputs

| Name       | Type                   | Default | Description                         |
| ---------- | ---------------------- | ------- | ----------------------------------- |
| `zValue`   | `ToggleGroupValue[]`   | `[]`    | Array of toggle items to display    |
| `zDefault` | `ToggleGroupValue[]`   | `[]`    | Default value when using with forms |
| `zSize`    | `'sm' \| 'md' \| 'lg'` | `'md'`  | Size variant of the toggle group    |
| `class`    | `ClassValue`           | `''`    | Additional CSS classes              |

### Outputs

| Name       | Type                               | Description                                               |
| ---------- | ---------------------------------- | --------------------------------------------------------- |
| `onClick`  | `EventEmitter<ToggleGroupValue[]>` | Emitted when any toggle is clicked, returns current state |
| `onHover`  | `EventEmitter<void>`               | Emitted when mouse hovers over any toggle                 |
| `onChange` | `EventEmitter<ToggleGroupValue[]>` | Emitted when toggle state changes, returns updated array  |
