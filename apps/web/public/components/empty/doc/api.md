# API

## [z-empty] <span class="api-type-label component">Component</span>

> `z-empty` component displays a placeholder when no data is available, commonly used in tables, lists, or search results.

To customize the empty, pass the following props to the component.

| Property       | Description                         | Type                          | Default |
| -------------- | ----------------------------------- | ----------------------------- | ------- |
| `zIcon`        | Icon to display                     | `ZardIcon`                    | -       |
| `zImage`       | Image URL or custom template        | `string \| TemplateRef<void>` | -       |
| `zDescription` | Description text or custom template | `string \| TemplateRef<void>` | -       |
| `zTitle`       | Title text or custom template       | `string \| TemplateRef<void>` | -       |
| `zActions`     | Array of action templates           | `TemplateRef<void>[]`         | []      |
| `class`        | Custom CSS classes                  | `ClassValue`                  | ''      |

**Note:** when zImage is used as string (URL), image size defaults to 64 x 64. This can be overridden by TailwindCSS using [&_img]: selector for sizing classes like in [custom image](docs/components/empty#custom-image) example.
