# API

## [z-toaster] <span class="api-type-label component">Component</span>

> `z-toaster` is a component that displays toast notifications. It uses `ngx-sonner` under the hood.

To customize the toaster, pass the following props to the component.

| Property         | Description                    | Type                                                                                                                      | Default         |
| ---------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `[variant]`      | Toast variant styling          | `default \| destructive`                                                                                                  | `default`       |
| `[theme]`        | Theme for the toasts           | `light \| dark \| system`                                                                                                | `system`        |
| `[position]`     | Position of the toast container| `top-left \| top-center \| top-right \| bottom-left \| bottom-center \| bottom-right`                                  | `bottom-right`  |
| `[richColors]`   | Enable rich colors             | `boolean`                                                                                                                 | `false`         |
| `[expand]`       | Expand toasts by default       | `boolean`                                                                                                                 | `false`         |
| `[duration]`     | Auto-dismiss duration (ms)     | `number`                                                                                                                  | `4000`          |
| `[visibleToasts]`| Maximum visible toasts         | `number`                                                                                                                  | `3`             |
| `[closeButton]`  | Show close button              | `boolean`                                                                                                                 | `false`         |