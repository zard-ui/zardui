# API

## [z-pagination] <span class="api-type-label component">Component</span>

> Pagination with page navigation, next and previous buttons.

### Properties

| Property       | Description        | Type                             | Default  |
| -------------- | ------------------ | -------------------------------- | -------- |
| `[class]`      | Custom CSS classes | `string`                         | `''`     |
| `[zSize]`      | Toggle size        | `'sm' \| 'md' \| 'lg' \|'icon' ` | `'icon'` |
| `[zPageIndex]` | Page Index         | `number`                         | `1`      |
| `[zTotal]`     | Total pages        | `number`                         | `1`      |

### Events

| Event           | Description                         | Payload  |
| --------------- | ----------------------------------- | -------- |
| `(zPageChange)` | Emitted when the page value changes | `number` |

## [z-pagination-basic] <span class="api-type-label component">Component</span>

> Pagination with page navigation, next and previous links.

### Properties

| Property  | Description        | Type                             | Default  |
| --------- | ------------------ | -------------------------------- | -------- |
| `[class]` | Custom CSS classes | `string`                         | `''`     |
| `[zSize]` | Toggle size        | `'sm' \| 'md' \| 'lg' \|'icon' ` | `'icon'` |

## [z-pagination-content] <span class="api-type-label component">Component</span>

> Wrapper for pagination items. Used to group elements such as buttons, links, etc.

### Properties

| Property  | Description        | Type     | Default |
| --------- | ------------------ | -------- | ------- |
| `[class]` | Custom CSS classes | `string` | `''`    |

## [z-pagination-item] <span class="api-type-label component">Component</span>

> Represents a pagination item. May contain buttons, links, or arbitrary content.

### Properties

| Property  | Description        | Type     | Default |
| --------- | ------------------ | -------- | ------- |
| `[class]` | Custom CSS classes | `string` | `''`    |

## [z-pagination-button] <span class="api-type-label component">Component</span>

> A paging button with active and disabled state support.

### Properties

| Property      | Description                  | Type                                   | Default  |
| ------------- | ---------------------------- | -------------------------------------- | -------- |
| `[zDisabled]` | Se o botão está desabilitado | `boolean`                              | `false`  |
| `[zActive]`   | Se o botão está ativo        | `boolean`                              | `false`  |
| `[zSize]`     | Tamanho do botão             | `'sm'` \| `'md'` \| `'lg'` \| `'icon'` | `'icon'` |
| `[class]`     | Custom CSS classes           | `string`                               | `''`     |

### Events

| Event      | Description                                                 |
| ---------- | ----------------------------------------------------------- |
| `(zClick)` | Emite quando clicado (se não estiver desabilitado ou ativo) |

## [z-pagination-link] <span class="api-type-label component">Component</span>

> A paging link using `RouterLink`, with active state support.

### Properties

| Property    | Description          | Type                                   | Default  |
| ----------- | -------------------- | -------------------------------------- | -------- |
| `[zLink]`   | Caminho de navegação | `string`                               | `'/'`    |
| `[zActive]` | Se o link está ativo | `boolean`                              | `false`  |
| `[zSize]`   | Tamanho do link      | `'sm'` \| `'md'` \| `'lg'` \| `'icon'` | `'icon'` |
| `[class]`   | Custom CSS classes   | `string`                               | `''`     |

## [z-pagination-previous] <span class="api-type-label component">Component</span>

> Link to navigate to the previous page.

### Properties

| Property  | Description                | Type     | Default |
| --------- | -------------------------- | -------- | ------- |
| `[zLink]` | Caminho da página anterior | `string` | `'/'`   |
| `[class]` | Custom CSS classes         | `string` | `''`    |

## [z-pagination-next] <span class="api-type-label component">Component</span>

> Link to navigate to the next page.

### Properties

| Property  | Description               | Type     | Default |
| --------- | ------------------------- | -------- | ------- |
| `[zLink]` | Caminho da próxima página | `string` | `'/'`   |
| `[class]` | Custom CSS classes        | `string` | `''`    |

## [z-pagination-ellipsis] <span class="api-type-label component">Component</span>

> Visual indicator of omitted pages (…).

### Properties

| Property  | Description        | Type     | Default |
| --------- | ------------------ | -------- | ------- |
| `[class]` | Custom CSS classes | `string` | `''`    |
