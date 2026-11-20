---
title: April 2026 - Avatar Sizes and Dynamic Select
description: A thin month — two releases, no new components. One quietly narrows the Avatar `zSize` API to named sizes only; the other makes Select track option lists that keep changing after render.
---

# April 2026 - Avatar Sizes and Dynamic Select

A thin month — two releases, no new components. One quietly narrows the Avatar `zSize` API to named sizes only; the other makes Select track option lists that keep changing after render.

## Avatar drops numeric sizes

`zSize` on `z-avatar` only takes `sm`, `default`, `md`, `lg` and `xl` now: the numeric option is gone. Swap a number for the closest name (32, 40, 48, 56 and 64 px) or for a `size-*` class. Its exported types were renamed too.

- `ZardAvatarVariants` → `ZardAvatarSizeVariants`
- `ZardImageVariants` → `ZardAvatarShapeVariants`
- `ZardAvatarGroupVariants` → `ZardAvatarGroupOrientationVariants`

```
<z-avatar zSize="sm" />
```

## Select follows dynamic option lists

Options added to a `z-select` after it renders, from a signal or a reactive list, are now selectable. The current value survives new options, and removing the selected one falls back to the raw value. No input or output changed.
