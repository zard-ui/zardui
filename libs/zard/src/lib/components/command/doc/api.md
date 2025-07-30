# API

## [z-command] <span class="api-type-label component">Component</span>

The main command palette container that handles search input and keyboard navigation.

| Property       | Description                           | Type                        | Default                       |
| -------------- | ------------------------------------- | --------------------------- | ----------------------------- |
| `size`         | Size of the command palette           | `sm \| default \| lg \| xl` | `default`                     |
| `zPlaceholder` | Placeholder text for the search input | `string`                    | `Type a command or search...` |
| `class`        | Additional CSS classes                | `string`                    | `''`                          |

### Events

| Event       | Description                            | Type                              |
| ----------- | -------------------------------------- | --------------------------------- |
| `zOnChange` | Fired when the selected option changes | `EventEmitter<ZardCommandOption>` |
| `zOnSelect` | Fired when an option is selected       | `EventEmitter<ZardCommandOption>` |

---

## [z-command-option] <span class="api-type-label component">Component</span>

Individual selectable option within the command palette.

| Property    | Description                    | Type                     | Default   |
| ----------- | ------------------------------ | ------------------------ | --------- |
| `zValue`    | Value of the option (required) | `any`                    | -         |
| `zLabel`    | Label text (required)          | `string`                 | -         |
| `zIcon`     | Icon for the option            | `string`                 | `''`      |
| `zCommand`  | Command identifier             | `string`                 | `''`      |
| `zShortcut` | Keyboard shortcut display      | `string`                 | `''`      |
| `zDisabled` | Disabled state                 | `boolean`                | `false`   |
| `variant`   | Visual variant                 | `default \| destructive` | `default` |
| `class`     | Additional CSS classes         | `string`                 | `''`      |

---

## [z-command-option-group] <span class="api-type-label component">Component</span>

Groups related command options together with an optional label.

| Property | Description            | Type     | Default |
| -------- | ---------------------- | -------- | ------- |
| `zLabel` | Group label (required) | `string` | -       |
| `class`  | Additional CSS classes | `string` | `''`    |

---

## [z-command-divider] <span class="api-type-label component">Component</span>

Visual separator between command groups or sections.

| Property | Description            | Type     | Default |
| -------- | ---------------------- | -------- | ------- |
| `class`  | Additional CSS classes | `string` | `''`    |
