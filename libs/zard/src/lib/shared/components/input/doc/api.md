# API

## [z-input] <span class="api-type-label directive">Directive</span>

> z-input is a Directive, it accepts all props which are supported by <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input" target="_blank">native input</a>.

To get a customized input, just pass the following props to the directive.

| Property        | Description          | Type                          | Default   |
| --------------- | -------------------- | ----------------------------- | --------- |
| `[zSize]`       | input size           | `default \| sm \| lg`         | `default` |
| `[zStatus]`     | input status         | `error \| warning \| success` | `null`    |
| `[zBorderless]` | input without border | `boolean`                     | `false`   |
