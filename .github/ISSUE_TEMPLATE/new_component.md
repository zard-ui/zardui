---
name: '🚀 New Component'
about: 'Suggest a new component for Zard UI'
title: '[Component] <component name>'
labels: ['enhancement']
assignees: []
---

## 🚀 New Component: [Component Name]

### 📖 Description

<!-- Describe the purpose of the component in 2-3 sentences and its main use cases -->

**Use cases**:
- Use case 1
- Use case 2
- Use case 3

**Philosophy**: <!-- One sentence about how this follows ZardUI patterns -->

### 🎨 References

- shadcn/ui: [Link to UI]
- ng-zorro: [Link to UI]

### 📦 Expected API

#### **z-component-name (Component)**

<!-- Keep API minimal (5-7 props max). Remove unnecessary props. -->

| Name            | Type                              | Required | Description                          |
| --------------- | --------------------------------- | -------- | ------------------------------------ |
| `zType`         | `"default" \| "variant"`          | No       | Visual variant (if applicable)       |
| `zSize`         | `"sm" \| "default" \| "lg"`       | No       | Size variant (if applicable)         |
| [essential]     | [type]                            | [yes/no] | [clear description]                  |
| `class`         | `ClassValue`                      | No       | Custom CSS classes                   |

**Note**: Use `string | TemplateRef<void>` for flexible content. Prefer native HTML attributes (disabled, aria-*) over component props.

### 🌟 Examples

```html
<!-- Simple case (most common - should be 1-3 lines) -->
<z-component [prop]="value">
  Content
</z-component>

<!-- With customization -->
<z-component [prop]="value" [template]="customTpl">
  Content
</z-component>
<ng-template #customTpl>
  Custom content
</ng-template>
```

### 🎯 Design Decisions

**Why [decision]?**
- Reason 1
- Reason 2

**Why NOT [alternative]?**
- Clear reasoning against alternatives (e.g., why NOT sub-components)

### ✅ Acceptance Criteria

- [ ] Single component (or justify multiple)
- [ ] API has 5-7 essential props (minimal)
- [ ] Uses `string | TemplateRef<void>` where flexibility needed
- [ ] Matches shadcn/ui visual style
- [ ] Follows ng-zorro API patterns (like `[nzActions]` arrays)
- [ ] Demos show simple → complex progression
- [ ] Accessible (ARIA, keyboard nav)
- [ ] Supports dark mode
- [ ] Unit tests
- [ ] Documentation

**Labels:** enhancement
