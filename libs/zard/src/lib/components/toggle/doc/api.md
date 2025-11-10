# API

## [z-toggle] <span class="api-type-label component">Component</span>

> A two-state button that can be either on or off.

### Properties

| Property       | Description                                                          | Type                     | Default     |
| -------------- | -------------------------------------------------------------------- | ------------------------ | ----------- |
| `[class]`      | Custom CSS classes                                                   | `string`                 | `''`        |
| `[zSize]`      | Toggle size                                                          | `'sm' \| 'md' \| 'lg'`   | `'md'`      |
| `[zType]`      | Visual style                                                         | `'default' \| 'outline'` | `'default'` |
| `[zValue]`     | Toggle value                                                         | `boolean`                | `undefined` |
| `[zDefault]`   | Default value when uncontrolled (used as initial state only)         | `boolean`                | `false`     |
| `[zDisabled]`  | Disables the toggle (also integrates with Angular Forms)             | `boolean`                | `false`     |
| `[zAriaLabel]` | Accessible label for screen readers (required when using icons only) | `string`                 | `''`        |

### Events

| Event            | Description                           | Payload   |
| ---------------- | ------------------------------------- | --------- |
| `(toggleClick)`  | Emitted when the toggle is clicked    | `void`    |
| `(toggleHover)`  | Emitted when the toggle is hovered    | `void`    |
| `(toggleChange)` | Emitted when the toggle value changes | `boolean` |
