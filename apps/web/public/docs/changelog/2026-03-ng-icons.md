---
title: March 2026 - Icons from ng-icons
description: Complete icon system migration! We replaced the custom `ZardIconComponent` with `@ng-icons/lucide`, bringing better tree-shaking, a wider icon selection, and a simpler API across all components.
---

# March 2026 - Icons from ng-icons

Complete icon system migration! We replaced the custom `ZardIconComponent` with `@ng-icons/lucide`, bringing better tree-shaking, a wider icon selection, and a simpler API across all components.

## Migration to @ng-icons/lucide

All components now use `NgIcon` from `@ng-icons/core` with icons sourced from `@ng-icons/lucide`. This replaces the deprecated `ZardIconComponent` and the custom icon registry, resulting in better tree-shaking and smaller bundle sizes.

## New Icon API

Icons are now provided at component level using `provideIcons()` in `viewProviders` and rendered with `<ng-icon name="lucideIconName" />`. Import only the icons you need from `@ng-icons/lucide`.

## Updated Dependencies

The `lucide-angular` dependency has been replaced by `@ng-icons/core` and `@ng-icons/lucide`. The CLI `init` command now installs these automatically.

```
npm install @ng-icons/core @ng-icons/lucide
```
