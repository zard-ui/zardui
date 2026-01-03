# API Reference

## ZardScrollToTopComponent

A floating button component that scrolls to the top of the page.

### Selector

`z-scroll-to-top`

### Inputs

| Input     | Type                                 | Default     | Description                                      |
| --------- | ------------------------------------ | ----------- | ------------------------------------------------ |
| `variant` | `'default' \| 'outline' \| 'subtle'` | `'default'` | Visual style variant of the button               |
| `size`    | `'sm' \| 'md' \| 'lg'`               | `'md'`      | Size of the button                               |
| `class`   | `string`                             | `''`        | Additional CSS classes to apply to the component |

### Methods

| Method        | Parameters | Description                          |
| ------------- | ---------- | ------------------------------------ |
| `scrollToTop` | None       | Smoothly scrolls the page to the top |

### Properties

| Property  | Type                         | Description                                                |
| --------- | ---------------------------- | ---------------------------------------------------------- |
| `visible` | `Signal<boolean>` (readonly) | Indicates whether the button is visible (scrolled > 200px) |
