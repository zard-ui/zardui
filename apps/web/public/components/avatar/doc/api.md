# API Reference

[z-avatar] Component

| Property      | Description                                       | Type                                        | Default   |
| ------------- | ------------------------------------------------- | ------------------------------------------- | --------- |
| `[class]`     | Additional CSS classes                            | `string`                                    | `''`      |
| `[zAlt]`      | Image alt text for accessibility                  | `string`                                    | `''`      |
| `[zFallback]` | Fallback text displayed while loading or on error | `string`                                    | `''`      |
| `[zPriority]` | Should image load with high priority              | `boolean`                                   | `false`   |
| `[zShape]`    | Avatar shape                                      | `circle \| rounded \| square`               | `circle`  |
| `[zSize]`     | Avatar size variant                               | `sm \| default \| md \| lg \| xl \| number` | `default` |
| `[zSrc]`      | Image source URL                                  | `string \| SafeUrl`                         | `''`      |
| `[zStatus]`   | Status indicator badge                            | `online \| offline \| doNotDisturb \| away` |           |

[z-avatar-group] Component

| Property         | Description                 | Type                     | Default      |
| ---------------- | --------------------------- | ------------------------ | ------------ |
| `[zOrientation]` | Layout direction of avatars | `horizontal \| vertical` | `horizontal` |
| `[class]`        | Additional CSS classes      | `string`                 | `''`         |
