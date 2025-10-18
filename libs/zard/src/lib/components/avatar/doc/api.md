# API

## z-avatar

### Inputs

| Property      | Description                                       | Type                                                     | Default   |
| ------------- | ------------------------------------------------- | -------------------------------------------------------- | --------- |
| `[zSize]`     | Avatar size variant                               | `sm \| default \| md \| lg \| xl`                        | `default` |
| `[zShape]`    | Avatar shape                                      | `circle \| rounded \| square`                            | `circle`  |
| `[zStatus]`   | Status indicator badge                            | `online \| offline \| doNotDisturb \| away \| invisible` |           |
| `[zSrc]`      | Image source URL                                  | `string`                                                 |           |
| `[zAlt]`      | Image alt text for accessibility                  | `string`                                                 | `''`      |
| `[zFallback]` | Fallback text displayed while loading or on error | `string`                                                 | `''`      |
| `[class]`     | Additional CSS classes                            | `string`                                                 | `''`      |

## z-avatar-group

### Inputs

| Property         | Description                 | Type                     | Default      |
| ---------------- | --------------------------- | ------------------------ | ------------ |
| `[zOrientation]` | Layout direction of avatars | `horizontal \| vertical` | `horizontal` |
| `[class]`        | Additional CSS classes      | `string`                 | `''`         |
