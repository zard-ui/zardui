# API

## z-alert

| Property         | Description       | Type                          | Default   |
| ---------------- | ----------------- | ----------------------------- | --------- |
| `[zTitle]`       | Alert title       | `string \| TemplateRef<void>` | `-`       |
| `[zDescription]` | Alert description | `string \| TemplateRef<void>` | `-`       |
| `[zIcon]`        | Alert icon        | `string \| TemplateRef<void>` | `-`       |
| `[zType]`        | Alert variant     | `default \| destructive`      | `default` |

- The `destructive` type displays a `circle-alert` icon by default
- Setting a custom `[zIcon]` will override the default icon provided by `[zType]`
