# API

## [z-empty] <span class="api-type-label component">Component</span>

> `z-empty` component displays a placeholder when no data is available, commonly used in tables, lists, or search results.

To customize the empty, pass the following props to the component.

| Property         | Description                             | Type                             | Default   |
|------------------|-----------------------------------------|----------------------------------|-----------|
| `[zImage]`       | custom image (string or template)       | `string \| TemplateRef<unknown>` | `-`       |
| `[zDescription]` | custom description (string or template) | `string \| TemplateRef<unknown>` | `No data` |
| `[zSize]`        | component size                          | `default \| small`               | `default` |
