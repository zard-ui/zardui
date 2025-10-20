# API

## [z-breadcrumb]

| Property       | Description                                                              | Type                     | Default   |
| -------------- | ------------------------------------------------------------------------ | ------------------------ | --------- |
| `[class]`      | Custom css classes                                                       | `string`                 | `''`      |
| `[zSize]`      | Breadcrumb size                                                          | `sm \| md \| lg`         | `'md'`    |
| `[zAlign]`     | Horizontal alignment                                                     | `start \| center \| end` | `'start'` |
| `[zWrap]`      | Wrapping behavior                                                        | `wrap \| nowrap`         | `'wrap'`  |
| `[zSeparator]` | Separator between breadcrumb items. Can be a string or an `ng-template`. | `string \| TemplateRef`  | `null`    |

## [z-breadcrumb-item]

| Property        | Description                    | Type     | Default |
| --------------- | ------------------------------ | -------- | ------- |
| `[class]`       | Custom css classes             | `string` | `''`    |
| `[routerLink]`  | Angular router link (optional) | `any`    | -       |
| `[queryParams]` | Query parameters               | `any`    | -       |

**Note:** All RouterLink inputs are supported through host directives.

## [z-breadcrumb-ellipsis]

| Property   | Description        | Type              | Default   |
| ---------- | ------------------ | ----------------- | --------- |
| `[class]`  | Custom css classes | `string`          | `''`      |
| `[zColor]` | Ellipsis color     | `muted \| strong` | `'muted'` |
