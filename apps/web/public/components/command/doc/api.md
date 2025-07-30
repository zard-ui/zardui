# API

## [z-command] <span class="api-type-label component">Component</span>

The main command palette container that handles search input and keyboard navigation. Features intelligent debounced search, ARIA accessibility, and comprehensive keyboard navigation.

| Property | Description                 | Type                        | Default   |
| -------- | --------------------------- | --------------------------- | --------- |
| `size`   | Size of the command palette | `sm \| default \| lg \| xl` | `default` |
| `class`  | Additional CSS classes      | `string`                    | `''`      |

### Events

| Event       | Description                            | Type                              |
| ----------- | -------------------------------------- | --------------------------------- |
| `zOnChange` | Fired when the selected option changes | `EventEmitter<ZardCommandOption>` |
| `zOnSelect` | Fired when an option is selected       | `EventEmitter<ZardCommandOption>` |

---

## [z-command-json] <span class="api-type-label component">Component</span>

JSON-configured command palette that renders options from a configuration object. Includes advanced keyboard shortcuts and action handling.

| Property | Description                      | Type                        | Default   |
| -------- | -------------------------------- | --------------------------- | --------- |
| `config` | Command configuration (required) | `ZardCommandConfig`         | -         |
| `size`   | Size of the command palette      | `sm \| default \| lg \| xl` | `default` |
| `class`  | Additional CSS classes           | `string`                    | `''`      |

### Events

| Event       | Description                            | Type                              |
| ----------- | -------------------------------------- | --------------------------------- |
| `zOnChange` | Fired when the selected option changes | `EventEmitter<ZardCommandOption>` |
| `zOnSelect` | Fired when an option is selected       | `EventEmitter<ZardCommandOption>` |

---

## [z-command-input] <span class="api-type-label component">Component</span>

Search input component with debounced input handling and accessibility features.

| Property      | Description                | Type     | Default                       |
| ------------- | -------------------------- | -------- | ----------------------------- |
| `placeholder` | Placeholder text for input | `string` | `Type a command or search...` |
| `class`       | Additional CSS classes     | `string` | `''`                          |

### Events

| Event         | Description                    | Type                   |
| ------------- | ------------------------------ | ---------------------- |
| `valueChange` | Fired when input value changes | `EventEmitter<string>` |

---

## [z-command-list] <span class="api-type-label component">Component</span>

Container for command options with proper ARIA listbox semantics.

| Property | Description            | Type     | Default |
| -------- | ---------------------- | -------- | ------- |
| `class`  | Additional CSS classes | `string` | `''`    |

---

## [z-command-empty] <span class="api-type-label component">Component</span>

Displays when no search results are found. Automatically shows/hides based on search state.

| Property | Description            | Type     | Default |
| -------- | ---------------------- | -------- | ------- |
| `class`  | Additional CSS classes | `string` | `''`    |

---

## [z-command-option] <span class="api-type-label component">Component</span>

Individual selectable option within the command palette with enhanced accessibility and interaction features.

| Property    | Description                    | Type                     | Default   |
| ----------- | ------------------------------ | ------------------------ | --------- |
| `zValue`    | Value of the option (required) | `any`                    | -         |
| `zLabel`    | Label text (required)          | `string`                 | -         |
| `zIcon`     | Icon HTML content              | `string`                 | `''`      |
| `zCommand`  | Command identifier             | `string`                 | `''`      |
| `zShortcut` | Keyboard shortcut display      | `string`                 | `''`      |
| `zDisabled` | Disabled state                 | `boolean`                | `false`   |
| `variant`   | Visual variant                 | `default \| destructive` | `default` |
| `class`     | Additional CSS classes         | `string`                 | `''`      |

---

## [z-command-option-group] <span class="api-type-label component">Component</span>

Groups related command options together with semantic grouping and accessibility.

| Property | Description            | Type     | Default |
| -------- | ---------------------- | -------- | ------- |
| `zLabel` | Group label (required) | `string` | -       |
| `class`  | Additional CSS classes | `string` | `''`    |

---

## [z-command-divider] <span class="api-type-label component">Component</span>

Visual separator between command groups with semantic role.

| Property | Description            | Type     | Default |
| -------- | ---------------------- | -------- | ------- |
| `class`  | Additional CSS classes | `string` | `''`    |
