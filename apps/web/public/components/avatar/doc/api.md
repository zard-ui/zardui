# API

## [z-avatar] <span class="api-type-label component">Component</span>

> `z-avatar` is a component that accepts all properties supported by a native `<div>`.

To customize the badge, pass the following props to the component.

| Property     | Description         | Type                                                      | Default     |
| ------------ | ------------------- | --------------------------------------------------------- | ----------- |
| `[zType]`    | Avatar type         | `default \| destructive \| outline \| secondary \| ghost` | `default`   |
| `[zSize]`    | Avatar size         | `default \| sm \| md \| lg \| full                      ` | `default`   |
| `[zShape]`   | Avatar shape        | `default \| circle \| square                            ` | `default`   |
| `[zStatus]`  | Avatar status       | `online \| offline \| doNotDisturb \| away \| invisible ` |             |
| `[zBorder]`  | Avatar border       | `boolean                                                ` | `false`     |
| `[zLoading]` | Avatar loading time | `undefined \| number                                    ` | `undefined` |
| `[zImage]`   | Avatar image data   | `{ fallback: string, url?: string: alt?: string }       ` |             |
