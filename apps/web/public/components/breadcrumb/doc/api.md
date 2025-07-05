# API

## [z-breadcrumb] <span class="api-type-label component">Component</span>

> z-breadcrumb is a flexible and accessible component that renders a navigation trail and wraps its list of items.

| Property  | Description        | Type              | Default |
| --------- | ------------------ | ----------------- | ------- |
| `[class]` | Custom css classes | `string`          | `''`    |
| `[zSize]` | Breadcrumb size    | `sm \| md \| lg ` | `'md'`  |

## [z-breadcrumb-list] <span class="api-type-label component">Component</span>

> z-breadcrumb-list renders the container for breadcrumb items. Typically used inside z-breadcrumb to control layout and spacing.

| Property   | Description          | Type                     | Default   |
| ---------- | -------------------- | ------------------------ | --------- |
| `[class]`  | Custom css classes   | `string`                 | `''`      |
| `[zAlign]` | Horizontal alignment | `start \| center \| end` | `'start'` |
| `[zWrap]`  | Wrapping behavior    | `wrap \| nowrap`         | `'wrap'`  |

## [z-breadcrumb-item] <span class="api-type-label component">Component</span>

> z-breadcrumb-item represents a single item in the breadcrumb trail and optionally includes a separator.

| Property   | Description        | Type                                 | Default     |
| ---------- | ------------------ | ------------------------------------ | ----------- |
| `[class]`  | Custom css classes | `string`                             | `''`        |
| `[zType]`  | Visual style       | `default \| muted \| bold \| subtle` | `'default'` |
| `[zShape]` | Shape and spacing  | `default \| square \| rounded`       | `'default'` |

## [z-breadcrumb-link] <span class="api-type-label component">Component</span>

> z-breadcrumb-link is a styled anchor used inside z-breadcrumb-item to navigate between levels.

| Property  | Description        | Type                             | Default     |
| --------- | ------------------ | -------------------------------- | ----------- |
| `[class]` | Custom css classes | `string`                         | `''`        |
| `[zType]` | Link style         | `default \| underline \| subtle` | `'default'` |

## [z-breadcrumb-page] <span class="api-type-label component">Component</span>

> z-breadcrumb-page indicates the current page in the breadcrumb trail and renders with aria-current="page" for accessibility.

| Property  | Description        | Type                           | Default     |
| --------- | ------------------ | ------------------------------ | ----------- |
| `[class]` | Custom css classes | `string`                       | `''`        |
| `[zType]` | Link style         | `default \| strong \| primary` | `'default'` |

## [z-breadcrumb-separator] <span class="api-type-label component">Component</span>

> z-breadcrumb-separator displays a visual separator between breadcrumb items and supports both string and template inputs.

| Property       | Description                                                           | Type                           | Default     |
| -------------- | --------------------------------------------------------------------- | ------------------------------ | ----------- |
| `[class]`      | Custom css classes                                                    | `string`                       | `''`        |
| `[zType]`      | Separator color                                                       | `default \| strong \| primary` | `'default'` |
| `[zSeparator]` | Separator between breadcrumb items. Can be a string or an ng-template | `string \| TemplateRef`        | `'/'`       |

## [z-breadcrumb-ellipsis] <span class="api-type-label component">Component</span>

> z-breadcrumb-ellipsis renders an ellipsis (…) to indicate collapsed or hidden items in a breadcrumb trail.

| Property   | Description        | Type              | Default   |
| ---------- | ------------------ | ----------------- | --------- |
| `[class]`  | Custom css classes | `string`          | `''`      |
| `[zColor]` | Ellipsis color     | `muted \| strong` | `'muted'` |
