# API Reference

## z-layout

| Property       | Description                                     | Type                                   | Default  |
| -------------- | ----------------------------------------------- | -------------------------------------- | -------- |
| `[class]`      | Additional CSS classes                          | `ClassValue`                           | `''`     |
| `[zDirection]` | Flex direction (auto-detects based on children) | `'horizontal' \| 'vertical' \| 'auto'` | `'auto'` |

---

## z-header

| Property    | Description             | Type         | Default |
| ----------- | ----------------------- | ------------ | ------- |
| `[class]`   | Additional CSS classes  | `ClassValue` | `''`    |
| `[zHeight]` | Header height in pixels | `number`     | `64`    |

---

## z-footer

| Property    | Description             | Type         | Default |
| ----------- | ----------------------- | ------------ | ------- |
| `[class]`   | Additional CSS classes  | `ClassValue` | `''`    |
| `[zHeight]` | Footer height in pixels | `number`     | `64`    |

---

## z-content

| Property  | Description            | Type         | Default |
| --------- | ---------------------- | ------------ | ------- |
| `[class]` | Additional CSS classes | `ClassValue` | `''`    |

---

## z-sidebar

### Inputs

| Property             | Description                                | Type                        | Default |
| -------------------- | ------------------------------------------ | --------------------------- | ------- |
| `[class]`            | Additional CSS classes                     | `ClassValue`                | `''`    |
| `[zWidth]`           | Sidebar width when expanded (px or string) | `string \| number`          | `200`   |
| `[zCollapsedWidth]`  | Sidebar width when collapsed (px)          | `number`                    | `64`    |
| `[zCollapsible]`     | Enable collapse functionality              | `boolean`                   | `false` |
| `[zCollapsed]`       | Collapsed state (supports two-way binding) | `boolean`                   | `false` |
| `[zReverseArrow]`    | Reverse trigger arrow direction            | `boolean`                   | `false` |
| `[zTrigger]`         | Custom trigger template                    | `TemplateRef<void> \| null` | `null`  |
| `(zCollapsedChange)` | Emitted when collapsed state changes       | `EventEmitter<boolean>`     |

---

## z-sidebar-group

| Property  | Description            | Type         | Default |
| --------- | ---------------------- | ------------ | ------- |
| `[class]` | Additional CSS classes | `ClassValue` | `''`    |

---

## z-sidebar-group-label

| Property  | Description            | Type         | Default |
| --------- | ---------------------- | ------------ | ------- |
| `[class]` | Additional CSS classes | `ClassValue` | `''`    |
