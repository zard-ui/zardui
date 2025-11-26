# API

## [`z-pagination`] <span class="api-type-label component">Component</span>

> Pagination component with previous, next, and numbered page navigation. Supports two-way binding with `[(ngModel)]` and form integration via `ControlValueAccessor`.

### Properties

| Property       | Description                     | Type                             | Default  |
| -------------- | ------------------------------- | -------------------------------- | -------- |
| `[class]`      | Custom CSS classes              | `string`                         | `''`     |
| `[zSize]`      | Button size                     | `'sm' \| 'md' \| 'lg' \| 'icon'` | `'icon'` |
| `[zPageIndex]` | Current page index (1-based)    | `number`                         | `1`      |
| `[zTotal]`     | Total number of pages           | `number`                         | `1`      |
| `[zDisabled]`  | Disables pagination interaction | `boolean`                        | `false`  |

### Events

| Event                | Description                           | Payload  |
| -------------------- | ------------------------------------- | -------- |
| `(zPageIndexChange)` | Emitted when the current page changes | `number` |

### Forms

This component implements `ControlValueAccessor`, so it can be used with `[(ngModel)]` and Reactive Forms.

---

## [`z-pagination-content`] <span class="api-type-label component">Component</span>

> Container for pagination content (buttons and ellipsis).

### Properties

| Property  | Description        | Type     | Default |
| --------- | ------------------ | -------- | ------- |
| `[class]` | Custom CSS classes | `string` | `''`    |

---

## [`z-pagination-item`] <span class="api-type-label component">Component</span>

> Wraps a pagination button or ellipsis.

### Properties

| Property  | Description        | Type     | Default |
| --------- | ------------------ | -------- | ------- |
| `[class]` | Custom CSS classes | `string` | `''`    |

---

## [`z-pagination-button`] <span class="api-type-label component">Component</span>

> Pagination button with support for active and disabled states.

### Properties

| Property      | Description                            | Type                                   | Default  |
| ------------- | -------------------------------------- | -------------------------------------- | -------- |
| `[zDisabled]` | Whether the button is disabled         | `boolean`                              | `false`  |
| `[zActive]`   | Whether the button is currently active | `boolean`                              | `false`  |
| `[zSize]`     | Button size                            | `'sm'` \| `'md'` \| `'lg'` \| `'icon'` | `'icon'` |
| `[class]`     | Custom CSS classes                     | `string`                               | `''`     |

### Events

| Event      | Description                                      |
| ---------- | ------------------------------------------------ |
| `(zClick)` | Emitted when clicked (if not disabled or active) |

---

## [`z-pagination-previous`] <span class="api-type-label component">Component</span>

> Button to go to the previous page.

### Properties

| Property  | Description        | Type     | Default |
| --------- | ------------------ | -------- | ------- |
| `[class]` | Custom CSS classes | `string` | `''`    |

---

## [`z-pagination-next`] <span class="api-type-label component">Component</span>

> Button to go to the next page.

### Properties

| Property  | Description        | Type     | Default |
| --------- | ------------------ | -------- | ------- |
| `[class]` | Custom CSS classes | `string` | `''`    |

---

## [`z-pagination-ellipsis`] <span class="api-type-label component">Component</span>

> Visual ellipsis ("…") for omitted pages.

### Properties

| Property  | Description        | Type     | Default |
| --------- | ------------------ | -------- | ------- |
| `[class]` | Custom CSS classes | `string` | `''`    |
