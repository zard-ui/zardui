# 🚀 New Component: Button Group

## 📖 Description

The `Button Group` component is a container that groups related buttons together with unified visual styling and shared borders. It organizes action buttons while maintaining visual coherence, supporting both horizontal and vertical orientations. The component is useful for grouping related actions like toolbar buttons, form actions, or navigation controls.

## 🎨 References

- shadcn/ui: [Button Group UI](https://ui.shadcn.com/docs/components/button-group) | [Source Code](https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/default/ui/button-group.tsx)
- ng-zorro: [Button Group UI](https://ng.ant.design/components/button/en#components-button-demo-button-group) | [Source Code](https://github.com/NG-ZORRO/ng-zorro-antd/tree/master/components/button)

## 📦 Expected API

### **z-button-group (Component)**

| Name           | Type                         | Required | Description                      |
| -------------- | ---------------------------- | -------- | -------------------------------- |
| `zOrientation` | `"horizontal" \| "vertical"` | No       | Layout direction of button group |
| `class`        | `ClassValue`                 | No       | Custom CSS classes               |

## 🌟 Example

```html
<!-- Basic horizontal group -->
<z-button-group>
  <button z-button zType="outline">Archive</button>
  <button z-button zType="outline">Report</button>
  <button z-button zType="outline">Delete</button>
</z-button-group>

<!-- Vertical orientation -->
<z-button-group zOrientation="vertical">
  <button z-button zType="default">Save</button>
  <button z-button zType="default">Cancel</button>
</z-button-group>
```

## ✅ Acceptance Criteria

- [ ] Matches the shadcn/ui and ng-zorro references
- [ ] Includes unit tests
- [ ] Responsive and accessible (a11y)
- [ ] Supports dark mode
- [ ] Supports horizontal and vertical orientations
- [ ] Handles border merging for attached buttons
- [ ] Proper corner rounding for first/last buttons
- [ ] Focus indicators with proper z-index management
- [ ] Works with all button variants (zType, zSize, zShape)
