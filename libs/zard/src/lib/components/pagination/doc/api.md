# API

## `z-pagination` <span class="api-type-label component">Component</span>

> Pagination component with previous, next, and numbered page navigation. Supports two-way binding via `[(zPageIndex)]` model signal.

### Properties

| Property         | Description                                           | Type                             | Default      |
| ---------------- | ----------------------------------------------------- | -------------------------------- | ------------ |
| `[class]`        | Custom CSS classes                                    | `string`                         | `''`         |
| `[zAriaLabel]`   | Use a unique, descriptive ARIA label for the element. | `string`                         | `Pagination` |
| `[zContent]`     | Custom pagination structure                           | `TemplateRef<void> \| undefined` | `undefined`  |
| `[zDisabled]`    | Disables pagination interaction                       | `boolean`                        | `false`      |
| `[(zPageIndex)]` | Current page index                                    | `number`                         | `1`          |
| `[zSize]`        | Button size                                           | `'default' \| 'sm' \| 'lg'`      | `'default'`  |
| `[zTotal]`       | Total number of pages                                 | `number`                         | `1`          |

### Events

| Event                | Description                           | Payload  |
| -------------------- | ------------------------------------- | -------- |
| `(zPageIndexChange)` | Emitted when the current page changes | `number` |

---

## `ul[z-pagination-content]` <span class="api-type-label component">Component</span>

> Container (unordered list) for pagination content (buttons and ellipsis).

### Properties

| Property  | Description        | Type     | Default |
| --------- | ------------------ | -------- | ------- |
| `[class]` | Custom CSS classes | `string` | `''`    |

---

## `li[z-pagination-item]` <span class="api-type-label component">Component</span>

> Wraps a pagination button or ellipsis as **li** element of container.

### Properties

| Property | Description | Type | Default |
| -------- | ----------- | ---- | ------- |
| —        | —           | —    | —       |

> This component is a structural wrapper (`<li>`) and accepts no inputs.

---

## `button[z-pagination-button], a[z-pagination-button]` <span class="api-type-label component">Component</span>

> Pagination button with support for active and disabled states.

### Properties

| Property      | Description                            | Type                        | Default     |
| ------------- | -------------------------------------- | --------------------------- | ----------- |
| `[class]`     | Custom CSS classes                     | `string`                    | `''`        |
| `[zActive]`   | Whether the button is currently active | `boolean`                   | `false`     |
| `[zDisabled]` | Whether the button is disabled         | `boolean`                   | `false`     |
| `[zSize]`     | Button size                            | `'default' \| 'sm' \| 'lg'` | `'default'` |

---

## `z-pagination-previous` <span class="api-type-label component">Component</span>

> Button **To the previous page**.

### Properties

| Property      | Description                    | Type                        | Default     |
| ------------- | ------------------------------ | --------------------------- | ----------- |
| `[class]`     | Custom CSS classes             | `string`                    | `''`        |
| `[zDisabled]` | Whether the button is disabled | `boolean`                   | `false`     |
| `[zSize]`     | Button size                    | `'default' \| 'sm' \| 'lg'` | `'default'` |

---

## `z-pagination-next` <span class="api-type-label component">Component</span>

> Button **To the next page**.

### Properties

| Property      | Description                    | Type                        | Default     |
| ------------- | ------------------------------ | --------------------------- | ----------- |
| `[class]`     | Custom CSS classes             | `string`                    | `''`        |
| `[zDisabled]` | Whether the button is disabled | `boolean`                   | `false`     |
| `[zSize]`     | Button size                    | `'default' \| 'sm' \| 'lg'` | `'default'` |

---

## `z-pagination-ellipsis` <span class="api-type-label component">Component</span>

> Visual ellipsis ("…") for omitted pages.

### Properties

| Property  | Description        | Type     | Default |
| --------- | ------------------ | -------- | ------- |
| `[class]` | Custom CSS classes | `string` | `''`    |
