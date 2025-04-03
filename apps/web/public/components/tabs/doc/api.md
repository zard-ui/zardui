# API

## [z-tab] <span class="api-type-label component">Component</span>

> z-tab-group is a Component that allows you to create a tabbed interface with customizable navigation and active indicator positions.

To configure the tab group, pass the following props to the component.

| Property            | Description                                           | Type                             | Default  |
| ------------------- | ----------------------------------------------------- | -------------------------------- | -------- |
| `[zPosition]`       | Position of the tab navigation                        | `top \| bottom \| left \| right` | `top`    |
| `[zActivePosition]` | Position of the active indicator                      | `top \| bottom \| left \| right` | `bottom` |
| `[zShowArrow]`      | Whether to show scroll arrows when content overflows  | `true \| false`                  | `true`   |
| `[zScrollAmount]`   | Whether to show scroll arrows when content overflows  | `number`                         | `100`    |
| `[zAlignTabs]`      | Alignment of tabs within the navigation               | `start \| center \| end`         | `start`  |
| `(zOnTabChange)`    | Emits when a new tab is selected or index signal emit | `$event`                         | `$event` |
| `(zDeselect)`       | Emits when the current tab is deselected              | `$event`                         | `$event` |
