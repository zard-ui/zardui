# API Reference

[z-alert] Component

| Property         | Description       | Type                                | Default   |
| ---------------- | ----------------- | ----------------------------------- | --------- |
| `[zTitle]`       | Alert title       | `string \| TemplateRef<void>`       | `-`       |
| `[zDescription]` | Alert description | `string \| TemplateRef<void>`       | `-`       |
| `[zIcon]`        | Alert icon        | `TemplateRef<void> \| ZardIconName` | `-`       |
| `[zType]`        | Alert variant     | `default \| destructive`            | `default` |

**zIcon:** if not specified, default icon will be `lucideCircleAlert`
