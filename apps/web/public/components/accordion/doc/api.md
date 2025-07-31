# API Reference

##### [z-accordion]

z-accordion is a component that displays a list of collapsible content sections.

| Property         | Description                                  | Type                | Default   |
|------------------|----------------------------------------------|---------------------|-----------|
| `[zType]`        | Single or multiple items can be opened       | `'single' \| 'multiple'` | `'single'` |
| `[zCollapsible]` | Whether accordion items can be collapsed     | `boolean`           | `true`    |
| `[zValue]`       | The controlled value of the accordion        | `string \| string[]` | `''`      |
| `[zDefaultValue]`| The default value of the accordion           | `string \| string[]` | `''`      |

##### [z-accordion-item]

z-accordion-item represents a single section in the accordion.

| Property         | Description                                  | Type       | Default |
|------------------|----------------------------------------------|------------|---------|
| `[zTitle]`       | The title displayed in the accordion header  | `string`   | `''`    |
| `[zDescription]` | The description displayed within the section | `string`   | `''`    |
| `[zValue]`       | Unique value for the accordion item          | `string`   | `''`    |
