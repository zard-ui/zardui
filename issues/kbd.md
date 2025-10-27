# 🚀 New Component: Kbd

## 📖 Description

The `Kbd` component displays keyboard keys and shortcuts in a visually consistent way. Useful for documentation, tooltips, command palettes, and UI hints showing keyboard shortcuts.

**Use cases**:
- Show keyboard shortcuts in tooltips (`Ctrl+S to save`)
- Display command hints in buttons (`Press Enter`)
- Document keyboard navigation
- Command palette shortcuts

**Philosophy**: Simple, semantic, and accessible. Two components: `Kbd` for single keys, `KbdGroup` for key combinations.

## 🎨 References

- shadcn/ui: [Kbd UI](https://ui.shadcn.com/docs/components/kbd) | [Source Code](https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/kbd.tsx)
- ng-zorro: No equivalent component (use standard HTML `<kbd>` with custom styling)

## 📦 Expected API

### **z-kbd (Single Key)**

| Name    | Type         | Required | Description                     |
| ------- | ------------ | -------- | ------------------------------- |
| `class` | `ClassValue` | No       | Custom CSS classes              |

### **z-kbd-group (Key Combination)**

| Name    | Type         | Required | Description                     |
| ------- | ------------ | -------- | ------------------------------- |
| `class` | `ClassValue` | No       | Custom CSS classes              |

**Note**: Both components use content projection for maximum flexibility. Keys are displayed with native `<kbd>` semantics.

## 🌟 Examples

```html
<!-- Single key -->
<z-kbd>Esc</z-kbd>
<z-kbd>⌘</z-kbd>
<z-kbd>Ctrl</z-kbd>

<!-- Key combination with group -->
<z-kbd-group>
  <z-kbd>Ctrl</z-kbd>
  <span>+</span>
  <z-kbd>C</z-kbd>
</z-kbd-group>

<!-- With custom separator -->
<z-kbd-group>
  <z-kbd>⌘</z-kbd>
  <span class="mx-1">then</span>
  <z-kbd>K</z-kbd>
</z-kbd-group>

<!-- In a tooltip -->
<button z-button [zTooltip]="shortcutTip">
  Save
</button>
<ng-template #shortcutTip>
  Press <z-kbd-group>
    <z-kbd>Ctrl</z-kbd>
    <span>+</span>
    <z-kbd>S</z-kbd>
  </z-kbd-group> to save
</ng-template>

<!-- In a button hint -->
<button z-button>
  Submit
  <z-kbd class="ml-2">Enter</z-kbd>
</button>

<!-- Multiple combinations -->
<div class="space-x-2">
  <z-kbd-group>
    <z-kbd>Ctrl</z-kbd>
    <span>+</span>
    <z-kbd>K</z-kbd>
  </z-kbd-group>
  <span>or</span>
  <z-kbd-group>
    <z-kbd>⌘</z-kbd>
    <span>+</span>
    <z-kbd>K</z-kbd>
  </z-kbd-group>
</div>
```

## 🎯 Design Decisions

**Why two components (Kbd + KbdGroup)?**
- **Semantic clarity**: Single key vs combination are different concepts
- **Styling control**: Group can handle spacing/layout between keys
- **Flexible separators**: Users can add `+`, `then`, or custom text between keys

**Why content projection instead of input props?**
- **Simple API**: No need for `[keys]="['Ctrl', 'C']"` array inputs
- **Flexible content**: Can mix text, icons, or custom elements
- **HTML semantics**: Uses native `<kbd>` element properly

**Why minimal API (only `class` prop)?**
- **Component is presentational**: No state, no logic
- **Styling via CSS**: Variants can be added with classes if needed
- **Keeps it simple**: Just wraps content with proper styling

## ✅ Acceptance Criteria

- [ ] `z-kbd` component for single keys
- [ ] `z-kbd-group` component for key combinations
- [ ] Uses semantic `<kbd>` HTML element
- [ ] Content projection for keys and separators
- [ ] Proper styling (border, shadow, monospace font)
- [ ] Supports dark mode
- [ ] Accessible (proper semantics for screen readers)
- [ ] Works inline with text
- [ ] Demos: single key, combinations, in tooltips, in buttons
- [ ] Unit tests
- [ ] Documentation

**Labels:** enhancement
