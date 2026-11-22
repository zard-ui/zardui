---
title: September 2025 - Progress, Skeleton and Spinner
description: Focus on loading and feedback components this month. New Progress, Skeleton, and Loader components for better perceived performance and user feedback during async operations.
---

# September 2025 - Progress, Skeleton and Spinner

Focus on loading and feedback components this month. New Progress, Skeleton, and Loader components for better perceived performance and user feedback during async operations.

## New Components

### [Progress](/docs/components/progress)

Visual progress indicator showing the completion progress of a task.

```
npx zard-cli@latest add progress
```

```
import { afterNextRender, ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardProgressComponent } from '@/shared/components/progress/progress.component';

@Component({
  selector: 'z-demo-progress-preview',
  imports: [ZardProgressComponent],
  template: `
    <z-progress class="w-60" [value]="value()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoProgressPreviewComponent {
  protected readonly value = signal(13);

  constructor() {
    afterNextRender(() => {
      setTimeout(() => this.value.set(66), 500);
    });
  }
}
```

### [Skeleton](/docs/components/skeleton)

Loading placeholder component for better perceived performance during content loading with pulse animation.

```
npx zard-cli@latest add skeleton
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'z-demo-skeleton-preview',
  imports: [ZardSkeletonComponent],
  template: `
    <div class="flex items-center space-x-4">
      <z-skeleton class="size-12 rounded-full" />
      <div class="space-y-2">
        <z-skeleton class="h-4 w-[250px]" />
        <z-skeleton class="h-4 w-[200px]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSkeletonPreviewComponent {}
```

### [Spinner](/docs/components/spinner)

Animated loading spinner customizable via the [zIcon] template input for swapping the underlying icon.

```
npx zard-cli@latest add spinner
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-spinner-custom-icon',
  imports: [ZardSpinnerComponent],
  template: `
    <div class="flex items-center gap-4">
      <z-spinner [zIcon]="customIcon" />
    </div>

    <ng-template #customIcon let-classes>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        [class]="classes"
      >
        <path d="M12 2v4" />
        <path d="m16.2 7.8 2.9-2.9" />
        <path d="M18 12h4" />
        <path d="m16.2 16.2 2.9 2.9" />
        <path d="M12 18v4" />
        <path d="m4.9 19.1 2.9-2.9" />
        <path d="M2 12h4" />
        <path d="m4.9 4.9 2.9 2.9" />
      </svg>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSpinnerCustomIconComponent {}
```
