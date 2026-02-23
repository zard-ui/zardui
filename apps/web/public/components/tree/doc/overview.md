# Tree

A hierarchical tree view for displaying nested data structures. Supports expand/collapse, single and multi-selection, checkboxes with parent/child propagation, and virtual scrolling for large datasets.

## When to use

- File explorers and directory browsers
- Category management and navigation hierarchies
- Permission trees with checkbox selection
- Organizational charts and nested settings
- Any nested parent-child data visualization

## Features

- **Expand / Collapse** — Click the chevron to toggle children visibility
- **Selection** — Single-select mode highlights the clicked node
- **Checkboxes** — Checkable mode with full parent/child propagation and indeterminate state
- **Virtual Scroll** — Renders thousands of nodes efficiently with CDK virtual scrolling
- **Keyboard Navigation** — Full arrow key navigation, Home/End, Enter to select, Space to toggle checkbox
- **Custom Templates** — Pass an `ng-template` to customize node rendering
- **Accessibility** — `role="tree"`, `role="treeitem"`, `aria-expanded`, `aria-level`, `aria-selected`, `aria-checked`

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `ArrowDown` | Move to next visible node |
| `ArrowUp` | Move to previous visible node |
| `ArrowRight` | Expand current node |
| `ArrowLeft` | Collapse current node |
| `Home` | Jump to first node |
| `End` | Jump to last visible node |
| `Enter` | Select current node |
| `Space` | Toggle checkbox on current node |
