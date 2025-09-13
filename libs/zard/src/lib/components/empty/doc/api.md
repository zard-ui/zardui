# API

## [z-empty] <span class="api-type-label component">Component</span>

> `z-empty` component is used to display a friendly placeholder when no data is available in a component or section. This component is useful
for scenarios like empty tables, lists, search results, or any other UI element that might lack content. It provides users with visual
feedback and optional actions to address the empty state, improving the overall user experience by clearly communicating when content is
unavailable.

To customize the empty, pass the following props to the component.

| Property        | Description                       | Type                             | Default |
|-----------------|-----------------------------------|----------------------------------|---------|
| `[zImage]`      | custom image (string or template) | `string \| TemplateRef<unknown>` | `-`     |
| `[zImageStyle]` | custom styles for image           | `Record<string, string>`         | `{}`    |
