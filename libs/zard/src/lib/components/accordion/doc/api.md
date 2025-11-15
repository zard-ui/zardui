# API Reference

[z-accordion] Component

z-accordion is a component that displays a list of collapsible content sections.

| Property          | Description                                                      | Type                     | Default    |
| ----------------- | ---------------------------------------------------------------- | ------------------------ | ---------- |
| `[class]`         | Custom CSS classes                                               | `string`                 | `''`       |
| `[zType]`         | Single or multiple items can be opened                           | `'single' \| 'multiple'` | `'single'` |
| `[zCollapsible]`  | Whether accordion items can be collapsed                         | `boolean`                | `true`     |
| `[zDefaultValue]` | Item value(s) of the accordion's item(s) to be opened by default | `string \| string[]`     | `''`       |

[z-accordion-item] Component

z-accordion-item represents a single section in the accordion.

| Property   | Description                        | Type     | Default |
| ---------- | ---------------------------------- | -------- | ------- |
| `[class]`  | Custom CSS classes                 | `string` | `''`    |
| `[zTitle]` | The title for item header          | `string` | `''`    |
| `[zValue]` | Unique value of the accordion item | `string` | `''`    |
