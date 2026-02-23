# API Reference

[z-tree] Component

z-tree is the root container for a hierarchical tree view.

| Property             | Description                              | Type              | Default |
| -------------------- | ---------------------------------------- | ----------------- | ------- |
| `[class]`            | Custom CSS classes                       | `string`          | `''`    |
| `[zData]`            | Tree data source                         | `TreeNode<T>[]`   | `[]`    |
| `[zSelectable]`      | Enable node selection on click           | `boolean`         | `false` |
| `[zCheckable]`       | Enable checkbox selection with propagation | `boolean`       | `false` |
| `[zExpandAll]`       | Expand all nodes initially               | `boolean`         | `false` |
| `[zVirtualScroll]`   | Enable virtual scrolling for large trees | `boolean`         | `false` |
| `[zVirtualItemSize]` | Virtual scroll item height in pixels     | `number`          | `32`    |

| Event                | Description               | Type              |
| -------------------- | ------------------------- | ----------------- |
| `(zNodeClick)`       | Node clicked              | `TreeNode<T>`     |
| `(zNodeExpand)`      | Node expanded             | `TreeNode<T>`     |
| `(zNodeCollapse)`    | Node collapsed            | `TreeNode<T>`     |
| `(zSelectionChange)` | Selection changed          | `TreeNode<T>[]`   |
| `(zCheckChange)`     | Checked nodes changed      | `TreeNode<T>[]`   |

[TreeNode] Interface

The data model for each node in the tree.

| Property   | Description                            | Type              | Required |
| ---------- | -------------------------------------- | ----------------- | -------- |
| `key`      | Unique identifier                      | `string`          | Yes      |
| `label`    | Display text                           | `string`          | Yes      |
| `data`     | Custom data payload                    | `T`               | No       |
| `icon`     | Lucide icon name                       | `string`          | No       |
| `children` | Child nodes                            | `TreeNode<T>[]`   | No       |
| `expanded` | Initially expanded                     | `boolean`         | No       |
| `selected` | Initially selected                     | `boolean`         | No       |
| `checked`  | Initially checked                      | `boolean`         | No       |
| `disabled` | Disable interactions                   | `boolean`         | No       |
| `leaf`     | Mark as leaf (hides expand toggle)     | `boolean`         | No       |
