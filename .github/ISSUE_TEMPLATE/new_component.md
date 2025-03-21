---
name: '🚀 New Component'
about: 'Suggest a new component for Zard UI'
title: '[Component] <component name>'
labels: ['enhancement']
assignees: []
---

## 🚀 New Component: [Component Name]

### 📖 Description

<!-- Describe the purpose of the component and its expected use cases.   -->

### 🎨 References

<!-- Include links to reference designs or inspirations for the component. -->

- shadcn/ui: [Link]
- ng-zorro: [Link]
- ng-spartan: [Link]

### 📦 Expected API

#### **Inputs (Props)**

<!-- List all the inputs (props) that the component should accept. -->

| Name    | Type                                | Required | Description              |
| ------- | ----------------------------------- | -------- | ------------------------ |
| `zType` | `"default" \| "outline" \| "ghost"` | No       | Defines the button style |
| `zSize` | `"sm"      \| "md"      \| "lg"`    | No       | Sets the button size     |

#### **Outputs (Events)**

<!-- List all the outputs (events) that the component should emit. -->

| Name      | Type                 | Description                        |
| --------- | -------------------- | ---------------------------------- |
| `onClick` | `EventEmitter<void>` | Emitted when the button is clicked |

### ✅ Acceptance Criteria

- [ ] Matches the references
- [ ] Includes unit tests
- [ ] Responsive and accessible (a11y)
- [ ] Supports dark mode
