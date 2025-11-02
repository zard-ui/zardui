# 🔄 Refactor Component: Empty

## 📖 Description

Refactor the `Empty` component to follow the **ZardUI pattern** (like our Card component), not React/shadcn's sub-component pattern. The current implementation is close but needs improvements:

- Add support for `zIcon` (easier than requiring an image)
- Add `zTitle` as a separate input from description
- Add `zActions` array (ng-zorro pattern) for flexible action buttons
- Remove `zSize` variant (simplify the component)
- Support both simple string inputs AND advanced TemplateRef customization
- If no `zIcon` or `zImage` is provided, don't show anything (no default SVG)

**Philosophy**: Simple cases should be simple (3 inputs), complex cases should be possible (TemplateRef). We follow Angular patterns, not React patterns.

## 🎨 References

- shadcn/ui: [Empty UI](https://ui.shadcn.com/docs/components/empty) | Visual reference only
- ng-zorro: [Empty UI](https://ng.ant.design/components/empty/en) | [Card Actions Pattern](https://ng.ant.design/components/card/en) | API reference (especially `[nzActions]` array pattern)

## 📦 Expected API

### **z-empty (Single Component)**

| Name           | Type                          | Required | Description                                  |
| -------------- | ----------------------------- | -------- | -------------------------------------------- |
| `zIcon`        | `ZardIcon`                    | No       | Icon to display (easier than image)          |
| `zImage`       | `string \| TemplateRef<void>` | No       | Image URL or custom template                 |
| `zTitle`       | `string \| TemplateRef<void>` | No       | Title text or custom template                |
| `zDescription` | `string \| TemplateRef<void>` | No       | Description text or custom template          |
| `zActions`     | `TemplateRef<void>[]`         | No       | Array of action templates (ng-zorro pattern) |
| `class`        | `ClassValue`                  | No       | Custom CSS classes                           |

**Note**: Inputs accept both simple strings (for common cases) and TemplateRef (for advanced customization), following the same pattern as our Card component.

## 🌟 Examples

### 1️⃣ Simple Case (no actions)

```html
<z-empty zIcon="inbox" zTitle="No data" zDescription="No data found"> </z-empty>
```

### 2️⃣ With Actions (ng-zorro array pattern)

```html
<z-empty
  zIcon="inbox"
  zTitle="No messages"
  zDescription="You don't have any messages yet"
  [zActions]="[actionPrimary, actionSecondary]"
>
</z-empty>

<ng-template #actionPrimary>
  <button z-button (click)="createMessage()">New Message</button>
</ng-template>

<ng-template #actionSecondary>
  <button z-button zType="outline" (click)="viewArchived()">View Archived</button>
</ng-template>
```

### 3️⃣ Advanced Customization (with TemplateRef)

```html
<z-empty
  [zImage]="customImage"
  [zTitle]="customTitle"
  zDescription="Invite your team to get started"
  [zActions]="[actionInvite]"
>
</z-empty>

<ng-template #customImage>
  <z-avatar-group>
    <z-avatar zSrc="/user1.jpg" />
    <z-avatar zSrc="/user2.jpg" />
  </z-avatar-group>
</ng-template>

<ng-template #customTitle>
  <span>No team <strong>members</strong> yet</span>
</ng-template>

<ng-template #actionInvite>
  <button z-button zSize="lg">Invite Team</button>
</ng-template>
```

### 4️⃣ With Custom Image

```html
<z-empty
  zImage="/illustrations/no-results.svg"
  zTitle="No results found"
  zDescription="Try adjusting your search terms"
  [zActions]="[actionClear]"
>
</z-empty>

<ng-template #actionClear>
  <button z-button zType="ghost" (click)="clearSearch()">
    <span z-icon zType="x"></span>
    Clear Search
  </button>
</ng-template>
```

## 🎯 Design Decisions

### Why Array of TemplateRef for Actions?

- **ng-zorro pattern**: Proven in production (see `[nzActions]` in ng-zorro Card)
- **Flexible**: Can have 0, 1, 2+ actions of any type
- **Type-safe**: TypeScript validates the templates
- **Angular-first**: Uses templates, not props with callbacks

### Why `string | TemplateRef<void>`?

- **Consistent with Card**: Same pattern we already use successfully
- **Simple for simple cases**: Just pass a string
- **Powerful for complex cases**: Use TemplateRef for rich content
- **Progressive enhancement**: Start simple, add complexity only when needed

### Why Remove `zSize`?

- **Simplicity**: Empty states don't need size variants
- **Use CSS instead**: Add custom classes if sizing is needed
- **Less API surface**: Easier to maintain and use

### Why Not Show Default SVG?

- **Intentional design**: Empty state should be explicit
- **Cleaner UX**: If no icon/image provided, component is lightweight
- **Developer control**: Forces developers to think about the empty state

## 🔄 Migration from Current API

| Current API                           | New API                                     | Change                             |
| ------------------------------------- | ------------------------------------------- | ---------------------------------- |
| `zImage: string \| TemplateRef`       | `zImage: string \| TemplateRef<void>`       | ✅ Keep (improved typing)          |
| `zDescription: string \| TemplateRef` | `zDescription: string \| TemplateRef<void>` | ✅ Keep (improved typing)          |
| ❌ N/A                                | `zIcon: ZardIcon`                           | ➕ New (easier than image)         |
| ❌ N/A                                | `zTitle: string \| TemplateRef<void>`       | ➕ New (separate from description) |
| ❌ N/A                                | `zActions: TemplateRef<void>[]`             | ➕ New (array of templates)        |
| `zSize: 'sm' \| 'default' \| 'lg'`    | ❌ Removed                                  | ➖ Simplify                        |
| Default SVG shown                     | No default (explicit only)                  | 🔄 Changed behavior                |

**Migration Example**:

```html
<!-- Before -->
<z-empty [zImage]="customImage" zDescription="No data available" zSize="default"> </z-empty>

<!-- After -->
<z-empty [zImage]="customImage" zTitle="No data" zDescription="No data available" [zActions]="[actionAdd]"> </z-empty>

<ng-template #actionAdd>
  <button z-button>Add Data</button>
</ng-template>
```

## ✅ Acceptance Criteria

- [ ] Follows ZardUI pattern (like Card component)
- [ ] Single component (NO sub-components like React/shadcn)
- [ ] All inputs accept `string | TemplateRef<void>` pattern
- [ ] `zActions` accepts array of `TemplateRef<void>[]` (ng-zorro pattern)
- [ ] Uses `ZardStringTemplateOutletDirective` for template rendering
- [ ] Removed `zSize` variant (simplified API)
- [ ] No default SVG shown (explicit icon/image required)
- [ ] Update all existing demos to new API
- [ ] Includes unit tests
- [ ] Responsive and accessible (a11y)
- [ ] Supports dark mode
- [ ] Migration guide in documentation
- [ ] Update existing usage in codebase (if any)

**Labels:** refactor, breaking-change
