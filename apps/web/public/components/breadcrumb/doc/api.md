# API

## [z-breadcrumb] <span class="api-type-label component">Component</span>

> z-breadcrumb is a flexible and accessible component that renders a navigation trail and wraps its list of items.

| Property       | Description                                                               | Type                     | Default   |
| -------------- | ------------------------------------------------------------------------- | ------------------------ | --------- |
| `[class]`      | Custom css classes                                                        | `string`                 | `''`      |
| `[zSize]`      | Breadcrumb size                                                           | `sm \| md \| lg`         | `'md'`    |
| `[zAlign]`     | Horizontal alignment                                                      | `start \| center \| end` | `'start'` |
| `[zWrap]`      | Wrapping behavior                                                         | `wrap \| nowrap`         | `'wrap'`  |
| `[zSeparator]` | Separator between breadcrumb items. Can be a string or an `ng-template`. | `string \| TemplateRef`  | `null`    |

**Note:** When `zSeparator` is not provided, a default chevron icon will be used.

## [z-breadcrumb-item] <span class="api-type-label component">Component</span>

> z-breadcrumb-item represents a single item in the breadcrumb trail. Supports all RouterLink inputs for navigation. For the current page, wrap content with `<span aria-current="page">`. The separator is automatically rendered after each item, except the last one.

| Property        | Description                    | Type     | Default |
| --------------- | ------------------------------ | -------- | ------- |
| `[class]`       | Custom css classes             | `string` | `''`    |
| `[routerLink]`  | Angular router link (optional) | `any`    | -       |
| `[queryParams]` | Query parameters               | `any`    | -       |

**Note:** All RouterLink inputs are supported through host directives.

## [z-breadcrumb-ellipsis] <span class="api-type-label component">Component</span>

> z-breadcrumb-ellipsis renders an ellipsis (…) to indicate collapsed or hidden items in a breadcrumb trail.

| Property   | Description        | Type              | Default   |
| ---------- | ------------------ | ----------------- | --------- |
| `[class]`  | Custom css classes | `string`          | `''`      |
| `[zColor]` | Ellipsis color     | `muted \| strong` | `'muted'` |
