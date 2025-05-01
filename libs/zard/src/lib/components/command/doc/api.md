# API

## z-command <span class="api-type-label component">Component</span>

| Property         | Description         | Type                        | Default                       |
| ---------------- | ------------------- | --------------------------- | ----------------------------- |
| `[zSize]`        | Size of the command | `default \| sm \| lg`       | `default`                     |
| `[zPlaceholder]` | Input placeholder   | `string`                    | `Type a command or search...` |
| `(zOnChange)`    | Change event        | `output<ZardCommandOption>` | -                             |

## z-command-option <span class="api-type-label component">Component</span>

| Property      | Description       | Type                  | Default |
| ------------- | ----------------- | --------------------- | ------- |
| `[zValue]`    | Option value      | `any`                 | -       |
| `[zLabel]`    | Option label      | `string\|TemplateRef` | -       |
| `[zIcon]`     | Option icon       | `string\|TemplateRef` | -       |
| `[zCommand]`  | Command text      | `string`              | -       |
| `[zShortcut]` | Keyboard shortcut | `string`              | -       |
| `[zDisabled]` | Disabled state    | `boolean`             | `false` |

## z-command-option-group <span class="api-type-label component">Component</span>

| Property   | Description | Type     | Default |
| ---------- | ----------- | -------- | ------- |
| `[zLabel]` | Group label | `string` | -       |
