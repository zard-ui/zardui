---
title: August 2025 - Avatar, Divider and Breadcrumb
description: Enhanced navigation and display components. New Avatar component with fallback support, Divider for content separation, and Breadcrumb for hierarchical navigation.
---

# August 2025 - Avatar, Divider and Breadcrumb

Enhanced navigation and display components. New Avatar component with fallback support, Divider for content separation, and Breadcrumb for hierarchical navigation.

## New Components

### [Avatar](/docs/components/avatar)

User profile image component with automatic fallback to initials and multiple size variants.

```
npx zard-cli@latest add avatar
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-basic',
  imports: [ZardAvatarComponent],
  template: `
    <div class="mb-4 flex gap-3">
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="ZA" />
      <z-avatar zSrc="error-image.png" zFallback="ZA" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAvatarBasicComponent {}
```

### [Separator](/docs/components/separator)

Visual separator component for separating content sections with horizontal and vertical orientations.

```
npx zard-cli@latest add separator
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSeparatorComponent } from '../separator.component';

@Component({
  selector: 'z-demo-separator-preview',
  imports: [ZardSeparatorComponent],
  template: `
    <div class="flex max-w-sm flex-col gap-4 text-sm">
      <div class="flex flex-col gap-1.5">
        <div class="leading-none font-medium">Zard/ui</div>
        <div class="text-muted-foreground">The Next Level for Your Angular Projects</div>
      </div>
      <z-separator />
      <div>A set of beautifully designed components that you can customize, extend, and build on.</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSeparatorPreviewComponent {}
```

### [Breadcrumb](/docs/components/breadcrumb)

Navigation breadcrumb trail showing the current page location within a hierarchical structure.

```
npx zard-cli@latest add breadcrumb
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '../breadcrumb.imports';

@Component({
  selector: 'z-demo-breadcrumb-basic',
  imports: [ZardBreadcrumbImports],
  template: `
    <z-breadcrumb zLabel="Basic breadcrumb">
      <z-breadcrumb-item>
        <a z-breadcrumb-link href="/">Home</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <a z-breadcrumb-link href="/docs/components">Components</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <span z-breadcrumb-page>Breadcrumb</span>
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoBreadcrumbBasicComponent {}
```
