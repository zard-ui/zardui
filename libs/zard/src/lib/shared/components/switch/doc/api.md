# API

## [z-switch] <span class="api-type-label component">Component</span>

> z-switch is a component that brings you a customizable switch with minimal configuration

To get a customized switch, just pass the following props to the directive.

| Property      | Description           | Type                     | Default   |
| ------------- | --------------------- | ------------------------ | --------- |
| `[class]`     | ClassValue            | `string`                 | `''`      |
| `[zChecked]`  | switch state          | `boolean`                | `true`    |
| `[zDisabled]` | switch disabled state | `boolean`                | `false`   |
| `[zId]`       | switch id             | `string`                 |           |
| `[zType]`     | switch type           | `default \| destructive` | `default` |
| `[zSize]`     | switch size           | `default \| sm \| lg`    | `default` |

**Note:** Component uses fallback content (also called default content), Angular 18+ feature.
