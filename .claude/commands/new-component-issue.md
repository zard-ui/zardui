Creates a GitHub issue for requesting a new ZardUI component with automatic reference gathering from shadcn/ui and ng-zorro.

# New Component Issue

Usage: `/new-component-issue [component-name]`
Example: `/new-component-issue rating`

**Component: $ARGUMENTS**

---

## 🎯 ZardUI Philosophy

Before creating the issue, understand our principles:

- **Simple cases should be simple** (3-5 inputs for common usage)
- **Complex cases should be possible** (`string | TemplateRef<void>` for flexibility)
- **Angular-first patterns** (signals, content projection, no React patterns)
- **Single component preferred** (avoid sub-components unless truly necessary)
- **Minimal API surface** (only essential props, use native HTML attributes when possible)

---

## Step 1: Gather References

Research existing implementations from shadcn/ui and ng-zorro:

### 1. shadcn/ui (Visual Reference)

```
WebFetch: https://ui.shadcn.com/docs/components/$ARGUMENTS
Prompt: "Extract the component description, main features, usage examples, and visual patterns.
         Focus on what makes it useful and how it's commonly used."
```

### 2. ng-zorro (API Reference)

```
WebFetch: https://ng.ant.design/components/$ARGUMENTS/en
Prompt: "Extract the Angular component API (inputs/outputs), usage patterns, and any special
         Angular features like directives or array-based inputs (like [nzActions])."
```

### 3. Best Practices

```
WebSearch: "$ARGUMENTS component accessibility ARIA best practices 2024"
```

---

## Step 2: Analyze for ZardUI

Based on references, determine:

1. **Component Type**: Standalone | Parent-child | With overlay
2. **Core Use Cases**: What are the 3 most common use cases?
3. **Essential Props**: What are the 5-7 essential inputs? (Keep it minimal!)
4. **Flexibility Needs**: Where do we need `string | TemplateRef<void>`?
5. **State Management**: Does it need `zDisabled`? `zLoading`? Form integration?

**Ask yourself**:

- Can this be ONE component? (Prefer yes)
- Can we use native HTML attributes? (disabled, aria-\*, etc.)
- Do we really need all these props? (Remove non-essential)

---

## Step 3: Create Issue (Enxuto!)

Use this template in `/issues/$ARGUMENTS.md`:

````markdown
# 🚀 New Component: [Component Name]

## 📖 Description

[2-3 sentences describing the component and its main use cases]

**Use cases**:

- [Use case 1]
- [Use case 2]
- [Use case 3]

**Philosophy**: [One sentence about how this component follows ZardUI patterns]

## 🎨 References

- shadcn/ui: [Component UI](https://ui.shadcn.com/docs/components/$ARGUMENTS) | [Source Code](link)
- ng-zorro: [Component UI](https://ng.ant.design/components/$ARGUMENTS/en) | [Source Code](link)

## 📦 Expected API

### **z-$ARGUMENTS (Component)**

| Name        | Type                        | Required | Description                    |
| ----------- | --------------------------- | -------- | ------------------------------ |
| `zType`     | `"default" \| "variant"`    | No       | Visual variant (if applicable) |
| `zSize`     | `"sm" \| "default" \| "lg"` | No       | Size variant (if applicable)   |
| [essential] | [type]                      | [yes/no] | [clear description]            |
| `class`     | `ClassValue`                | No       | Custom CSS classes             |

**Note**: Keep API minimal (5-7 props max). Use `string | TemplateRef<void>` for flexible content.

## 🌟 Examples

```html
<!-- Simple case (most common) -->
<z-$ARGUMENTS [prop]="value"> Content </z-$ARGUMENTS>

<!-- With customization -->
<z-$ARGUMENTS [prop]="value" [template]="customTpl"> Content </z-$ARGUMENTS>
<ng-template #customTpl> Custom content </ng-template>

<!-- Advanced case -->
[Show complex but possible usage]
```
````

## 🎯 Design Decisions

**Why [decision]?**

- [Reason 1]
- [Reason 2]

**Why NOT [alternative]?**

- [Clear reasoning against alternatives]

## ✅ Acceptance Criteria

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

```

---

## Step 4: Review Checklist

Before finalizing, verify:

- [ ] **API is minimal** (5-7 props, not 10+)
- [ ] **Simple case is simple** (common usage in 1-3 lines)
- [ ] **No sub-components** (unless truly necessary, justify!)
- [ ] **Uses Angular patterns** (signals, content projection, `string | TemplateRef`)
- [ ] **Follows existing ZardUI components** (Card, Empty, Button as reference)
- [ ] **Clear design decisions** (explain why choices were made)
- [ ] **Examples are concise** (no verbose explanations)

---

## Examples of Good vs Bad Issues

### ✅ GOOD: Kbd Component
- **Simple**: Just 2 components (`z-kbd`, `z-kbd-group`)
- **Minimal API**: Only `class` prop
- **Clear use cases**: Keyboard shortcuts in tooltips, buttons, docs
- **No complexity**: Content projection, semantic HTML

### ❌ BAD: Hypothetical Over-engineered Component
- **Complex**: 5+ sub-components
- **Too many props**: 15+ inputs
- **Unclear use cases**: Tries to do everything
- **React patterns**: Props instead of content projection

---

## Remember

**ZardUI Priority Order**:
1. **Simplicity** - Simple things should be simple
2. **Flexibility** - Complex things should be possible
3. **Angular-first** - Use Angular patterns, not React
4. **Minimal API** - Less is more
5. **Type-safe** - TypeScript all the way

When in doubt, look at **Card**, **Empty**, or **Button** components as reference!
```
