# API

## [z-button] <span class="api-type-label directive">Directive</span>

> z-button is a Directive, it accepts all props which are supported by [native button](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button).

To get a customized button, just pass the following props to the directive.

| Property   | Description          | Type                                                              | Default   |
| ---------- | -------------------- | ----------------------------------------------------------------- | --------- |
| `zType`    | button type          | `default \| destructive \| outline \| secondary \| ghost \| link` | `default` |
| `zSize`    | button size          | `default \| sm \| lg \|icon`                                      | `default` |
| `zShape`   | button shape         | `default \| circle \| square`                                     | `default` |
| `zFull`    | button width 100%    | `boolean`                                                         | `false`   |
| `zLoading` | button loading state | `boolean`                                                         | `false`   |
