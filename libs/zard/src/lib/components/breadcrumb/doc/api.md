# API Reference

[z-breadcrumb] Component

| Property       | Description                         | Type                     | Default   |
| -------------- | ----------------------------------- | ------------------------ | --------- |
| `[class]`      | Custom css classes                  | `string`                 | `''`      |
| `[zSize]`      | Breadcrumb size                     | `sm \| md \| lg`         | `'md'`    |
| `[zAlign]`     | Horizontal alignment                | `start \| center \| end` | `'start'` |
| `[zWrap]`      | Wrapping behavior                   | `wrap \| nowrap`         | `'wrap'`  |
| `[zSeparator]` | Separator between breadcrumb items. | `string \| TemplateRef`  | `''`      |

[z-breadcrumb-item] Component

| Property     | Description        | Type     | Default |
| ------------ | ------------------ | -------- | ------- |
| `[class]`    | Custom css classes | `string` | `''`    |
| `routerLink` | Check for note     |          |         |

**Note:** All [RouterLink](https://angular.dev/api/router/RouterLink) inputs are supported through host directives.

[z-breadcrumb-ellipsis] Component

| Property   | Description        | Type              | Default   |
| ---------- | ------------------ | ----------------- | --------- |
| `[class]`  | Custom css classes | `string`          | `''`      |
| `[zColor]` | Ellipsis color     | `muted \| strong` | `'muted'` |
