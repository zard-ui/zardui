# 🔄 Refactor Component: Input Group

## 📖 Description

Simplify and align the `Input Group` component with shadcn/ui's latest patterns. Our current implementation is close, but needs streamlining:

**Keep**:
- ✅ Single component (no sub-components)
- ✅ `string | TemplateRef<void>` for flexibility
- ✅ Content projection for inputs

**Add**:
- Alignment for addons (`inline` | `block`) to support textareas
- Better button addon styling

**Philosophy**: Minimal API, maximum flexibility.

## 🎨 References

- shadcn/ui: [Input Group UI](https://ui.shadcn.com/docs/components/input-group) | [Source Code](https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/input-group.tsx)
- ng-zorro: [Input Group UI](https://ng.ant.design/components/input/en) | [Source Code](https://github.com/NG-ZORRO/ng-zorro-antd/tree/master/components/input)

## 📦 Expected API

| Name                   | Type                              | Required | Description                          |
| ---------------------- | --------------------------------- | -------- | ------------------------------------ |
| `zAddOnBefore`         | `string \| TemplateRef<void>`     | No       | Addon before input (external)        |
| `zAddOnAfter`          | `string \| TemplateRef<void>`     | No       | Addon after input (external)         |
| `zAddOnAlign`          | `"inline" \| "block"`             | No       | Addon alignment (default: "inline")  |
| `zPrefix`              | `string \| TemplateRef<void>`     | No       | Content before input text (internal) |
| `zSuffix`              | `string \| TemplateRef<void>`     | No       | Content after input text (internal)  |
| `zSize`                | `"sm" \| "default" \| "lg"`       | No       | Size variant                         |
| `zDisabled`            | `boolean`                         | No       | Disabled state for entire group      |
| `zLoading`             | `boolean`                         | No       | Loading state with spinner           |
| `class`                | `ClassValue`                      | No       | Custom CSS classes                   |

**Removed**: `zBorderless` and `aria-*` props (use native HTML attributes or custom classes instead)

**Simplified**: Single `zAddOnAlign` applies to both before/after addons (most cases use same alignment)

## 🌟 Examples

```html
<!-- Simple with prefix/suffix -->
<z-input-group zPrefix="$" zSuffix=".00">
  <input z-input type="text" placeholder="0" />
</z-input-group>

<!-- With addons -->
<z-input-group zAddOnBefore="https://" zAddOnAfter=".com">
  <input z-input type="text" placeholder="mysite" />
</z-input-group>

<!-- With button addon -->
<z-input-group [zAddOnAfter]="searchBtn">
  <input z-input type="text" placeholder="Search..." />
</z-input-group>
<ng-template #searchBtn>
  <button z-button zSize="sm">Search</button>
</ng-template>

<!-- Disabled state -->
<z-input-group zPrefix="$" [zDisabled]="true">
  <input z-input type="text" placeholder="0" />
</z-input-group>

<!-- Loading state -->
<z-input-group zPrefix="$" [zLoading]="isSearching">
  <input z-input type="text" placeholder="Search..." />
</z-input-group>

<!-- Textarea with block alignment -->
<z-input-group [zAddOnAfter]="actions" zAddOnAlign="block">
  <textarea z-input rows="4"></textarea>
</z-input-group>
<ng-template #actions>
  <button z-button zSize="sm">Submit</button>
</ng-template>
```

## 🎯 Design Decisions

**Why single `zAddOnAlign` instead of separate before/after?**
- 99% of cases use same alignment for both addons
- Simpler API (9 inputs instead of 10+)
- Can still handle edge cases with custom CSS classes

**Why keep `zDisabled` and `zLoading` props?**
- Controls the **entire group** (input + addons + buttons), not just the input
- `zDisabled`: Disables input, buttons, and applies disabled styling to addons
- `zLoading`: Shows spinner in suffix, disables input, and prevents button clicks
- Cleaner DX than manually disabling each element

**Why remove `zBorderless` and `aria-*` props?**
- `zBorderless`: Use `class="border-0"` instead (more flexible)
- `aria-*`: Use native attributes on input: `<input z-input aria-label="...">`

**Why keep prefix/suffix separate from addons?**
- Clear distinction: prefix/suffix are INSIDE border, addons OUTSIDE
- Different use cases: icons vs buttons

## 🔄 Changes from Current API

| Current | New | Change |
|---------|-----|--------|
| `zAddOnBefore/After/Prefix/Suffix` | Same (improved typing) | ✅ Keep |
| ❌ N/A | `zAddOnAlign: "inline" \| "block"` | ➕ Add |
| `zDisabled` | Same | ✅ Keep (controls entire group) |
| ❌ N/A | `zLoading` | ➕ Add (shows spinner, disables group) |
| `zBorderless`, `aria-*` | ❌ Removed | ➖ Use classes/native attrs |
| `zSize` | Same | ✅ Keep |

**Breaking changes**: Remove `zBorderless` and all `aria-*` props.

**Migration**:
```html
<!-- Before -->
<z-input-group zPrefix="$" [zBorderless]="true" zAriaLabel="Amount">
  <input z-input type="text" />
</z-input-group>

<!-- After -->
<z-input-group zPrefix="$" class="border-0">
  <input z-input type="text" aria-label="Amount" />
</z-input-group>
```

## ✅ Acceptance Criteria

- [ ] Single component (no sub-components)
- [ ] Add `zAddOnAlign: "inline" | "block"` input
- [ ] Add `zLoading` input (shows spinner, disables entire group)
- [ ] Keep `zDisabled` (disables entire group including addons/buttons)
- [ ] Remove `zBorderless` and `aria-*` props
- [ ] Better button addon styling (matches shadcn)
- [ ] Textarea support with block-aligned addons
- [ ] Update all demos
- [ ] Unit tests
- [ ] Documentation

**Labels:** refactor, breaking-change
