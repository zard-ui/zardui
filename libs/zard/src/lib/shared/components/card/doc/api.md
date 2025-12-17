# API

## [z-card] <span class="api-type-label component">Component</span>

> z-card is a component that provides a structured container for displaying content with body section and optional header and footer sections.

| Property          | Description               | Type                                       | Default |
| ----------------- | ------------------------- | ------------------------------------------ | ------- |
| `[class]`         | Custom css classes        | `ClassValue`                               | `''`    |
| `[zAction]`       | Card action button¹       | `string`                                   | `''`    |
| `[zDescription]`  | Card description content¹ | `string \| TemplateRef<void> \| undefined` | -       |
| `[zFooterBorder]` | Card footer with border   | `boolean`                                  | `false` |
| `[zHeaderBorder]` | Card header with border¹  | `boolean`                                  | `false` |
| `[zTitle]`        | Card title content        | `string \| TemplateRef<void> \| undefined` | -       |
| `(zActionClick)`  | Emits action button click | `void`                                     | -       |

¹ `zTitle` is required to have header.

🚨Note: optional card footer content is defined with selector **card-footer**\
(eg. `<div card-footer> </div>`)
