# API

## [z-command] <span class="api-type-label component">Component</span>

The main command palette container that handles search input and keyboard navigation. Features intelligent debounced search, ARIA accessibility, and comprehensive keyboard navigation.

| Property | Description            | Type                        | Default   |
| -------- | ---------------------- | --------------------------- | --------- |
| `size`   | Size of the command palette | `sm \| default \| lg \| xl` | `default` |
| `class`  | Additional CSS classes | `string`                    | `''`      |

### Events

| Event       | Description                            | Type                              |
| ----------- | -------------------------------------- | --------------------------------- |
| `zOnChange` | Fired when the selected option changes | `EventEmitter<ZardCommandOption>` |
| `zOnSelect` | Fired when an option is selected       | `EventEmitter<ZardCommandOption>` |

### Features

- **Intelligent Search**: 150ms debounced search with immediate response for empty values
- **Accessibility**: Full ARIA support with live regions and screen reader announcements
- **Keyboard Navigation**: Arrow keys, Enter, Escape with automatic scroll-to-view
- **Focus Management**: Automatic focus handling and visual feedback

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

### Features

- **Global Shortcuts**: Ctrl/Cmd + key combinations
- **Action Callbacks**: Per-option and global action handlers
- **Group Filtering**: Smart filtering across option groups
- **Auto-scroll**: Selected options automatically scroll into view

---

## [z-command-input] <span class="api-type-label component">Component</span>

Search input component with debounced input handling and accessibility features.

| Property      | Description                      | Type     | Default                       |
| ------------- | -------------------------------- | -------- | ----------------------------- |
| `placeholder` | Placeholder text for input       | `string` | `Type a command or search...` |
| `class`       | Additional CSS classes           | `string` | `''`                          |

### Events

| Event         | Description                    | Type                    |
| ------------- | ------------------------------ | ----------------------- |
| `valueChange` | Fired when input value changes | `EventEmitter<string>`  |

### Features

- **Smart Debouncing**: 150ms delay for search optimization
- **ARIA Support**: Screen reader friendly with proper labels
- **Keyboard Delegation**: Passes navigation keys to parent components

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

### Features

- **Smart Visibility**: Automatically shows when search yields no results
- **Dual Support**: Works with both traditional and JSON command components

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

### Features

- **Smart Filtering**: Automatically shows/hides based on search terms
- **Accessibility**: Full ARIA option semantics with selection states
- **Smooth Scrolling**: Automatically scrolls into view when selected via keyboard
- **Visual Feedback**: Clear hover and selection states

---

## [z-command-option-group] <span class="api-type-label component">Component</span>

Groups related command options together with semantic grouping and accessibility.

| Property | Description            | Type     | Default |
| -------- | ---------------------- | -------- | ------- |
| `zLabel` | Group label (required) | `string` | -       |
| `class`  | Additional CSS classes | `string` | `''`    |

### Features

- **ARIA Grouping**: Proper semantic grouping for screen readers
- **Visual Hierarchy**: Clear visual separation and labeling

---

## [z-command-divider] <span class="api-type-label component">Component</span>

Visual separator between command groups with semantic role.

| Property | Description            | Type     | Default |
| -------- | ---------------------- | -------- | ------- |
| `class`  | Additional CSS classes | `string` | `''`    |

### Features

- **Semantic Role**: Proper ARIA separator role
- **Smart Visibility**: Can be conditionally shown/hidden

---

## Types

### ZardCommandOption

```typescript
interface ZardCommandOption {
  value: unknown;              // Option value
  label: string;               // Display label
  disabled?: boolean;          // Disabled state
  command?: string;            // Command identifier for search
  shortcut?: string;           // Display shortcut (e.g., "⌘N")
  icon?: string;               // HTML icon content
  action?: () => void;         // Optional action callback
  key?: string;                // Keyboard shortcut key (e.g., 'n' for Ctrl+N)
}
```

### ZardCommandGroup

```typescript
interface ZardCommandGroup {
  label: string;               // Group label
  options: ZardCommandOption[]; // Array of options
}
```

### ZardCommandConfig

```typescript
interface ZardCommandConfig {
  placeholder?: string;         // Input placeholder
  emptyText?: string;          // No results message
  groups: ZardCommandGroup[];  // Option groups
  dividers?: boolean;          // Show dividers between groups
  onSelect?: (option: ZardCommandOption) => void; // Global selection handler
}
```

## Accessibility Features

The Command component includes comprehensive accessibility support:

- **ARIA Labels**: Dynamic labels and descriptions
- **Live Regions**: Screen reader announcements for search results
- **Keyboard Navigation**: Full keyboard support with visual feedback
- **Focus Management**: Automatic focus handling and scroll-to-view
- **Screen Reader Support**: Proper semantic markup and announcements

## Performance Optimizations

- **Intelligent Debouncing**: 150ms search delay with immediate empty value handling
- **Signal-based Reactivity**: Efficient updates using Angular signals
- **Smart Filtering**: Optimized search across multiple fields
- **Memory Management**: Proper cleanup of timers and resources
