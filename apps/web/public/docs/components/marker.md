---
title: Marker
description: Displays an inline status, system note, bordered row, or labeled separator in a conversation.
---

# Marker

Displays an inline status, system note, bordered row, or labeled separator in a conversation.

## Installation

### CLI

```bash
npx zard-cli@latest add marker
```

### Manual

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { markerContentVariants, markerIconVariants, markerVariants, type ZardMarkerVariants } from './marker.variants';

@Component({
  selector: 'z-marker, [z-marker]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'marker',
    '[attr.data-variant]': 'zVariant()',
    '[class]': 'classes()',
  },
  exportAs: 'zMarker',
})
export class ZardMarkerComponent {
  readonly zVariant = input<ZardMarkerVariants>('default');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(markerVariants({ zVariant: this.zVariant() }), this.class()),
  );
}

@Component({
  selector: 'z-marker-icon, [z-marker-icon]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'marker-icon',
    'aria-hidden': 'true',
    '[class]': 'classes()',
  },
  exportAs: 'zMarkerIcon',
})
export class ZardMarkerIconComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(markerIconVariants(), this.class()));
}

@Component({
  selector: 'z-marker-content, [z-marker-content]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'marker-content',
    '[class]': 'classes()',
  },
  exportAs: 'zMarkerContent',
})
export class ZardMarkerContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(markerContentVariants(), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const markerVariants = cva(
  mergeClasses(
    'group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-sm text-muted-foreground',
    "[--ng-icon__size:1rem] [&_svg:not([class*='size-'])]:size-4",
    '[a]:underline [a]:underline-offset-3 [a]:hover:text-foreground',
  ),
  {
    variants: {
      zVariant: {
        default: '',
        border: 'border-b border-border pb-2',
        separator:
          'before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-border',
      },
    },
    defaultVariants: {
      zVariant: 'default',
    },
  },
);

export const markerIconVariants = cva("size-4 shrink-0 [--ng-icon__size:1rem] [&_svg:not([class*='size-'])]:size-4");

export const markerContentVariants = cva(
  mergeClasses(
    'min-w-0 wrap-break-word',
    'group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center',
    '*:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground',
  ),
);

export type ZardMarkerVariants = NonNullable<VariantProps<typeof markerVariants>['zVariant']>;
```

```angular-ts
export * from './marker.component';
export * from './marker.imports';
export * from './marker.variants';
```

```angular-ts
export { ZardMarkerComponent, ZardMarkerContentComponent, ZardMarkerIconComponent } from './marker.component';

import { ZardMarkerComponent, ZardMarkerContentComponent, ZardMarkerIconComponent } from './marker.component';

export const ZardMarkerImports = [ZardMarkerComponent, ZardMarkerIconComponent, ZardMarkerContentComponent] as const;
```

## Usage

```angular-ts
import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
```

```angular-html
<z-marker>
  <z-marker-icon>
    <ng-icon name="lucideSearch" />
  </z-marker-icon>
  <z-marker-content>Explored 4 files</z-marker-content>
</z-marker>
```

## Examples

### Default

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch, lucideSearch } from '@ng-icons/lucide';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-marker-default',
  imports: [NgIcon, ZardSpinnerComponent, ...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-8">
      <z-marker>
        <z-marker-icon><ng-icon name="lucideGitBranch" /></z-marker-icon>
        <z-marker-content>Switched to a new branch</z-marker-content>
      </z-marker>

      <z-marker role="status">
        <z-marker-icon><z-spinner /></z-marker-icon>
        <z-marker-content class="shimmer">Thinking...</z-marker-content>
      </z-marker>

      <z-marker zVariant="separator">
        <z-marker-content>Conversation compacted</z-marker-content>
      </z-marker>

      <z-marker>
        <z-marker-icon><ng-icon name="lucideSearch" /></z-marker-icon>
        <z-marker-content>Explored 4 files</z-marker-content>
      </z-marker>
    </div>
  `,
  viewProviders: [provideIcons({ lucideGitBranch, lucideSearch })],
})
export class ZardDemoMarkerDefaultComponent {}
```

### Variant

```angular-ts
import { Component } from '@angular/core';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';

@Component({
  selector: 'z-demo-marker-variant',
  imports: [...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-8">
      <z-marker>
        <z-marker-content>A default marker for inline notes.</z-marker-content>
      </z-marker>

      <z-marker zVariant="separator">
        <z-marker-content>A separator marker</z-marker-content>
      </z-marker>

      <z-marker zVariant="border">
        <z-marker-content>A border marker for row boundaries.</z-marker-content>
      </z-marker>
    </div>
  `,
})
export class ZardDemoMarkerVariantComponent {}
```

### Status

```angular-ts
import { Component } from '@angular/core';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-marker-status',
  imports: [ZardSpinnerComponent, ...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-8">
      <z-marker role="status">
        <z-marker-icon><z-spinner /></z-marker-icon>
        <z-marker-content>Compacting conversation</z-marker-content>
      </z-marker>

      <z-marker zVariant="separator" role="status">
        <z-marker-icon><z-spinner /></z-marker-icon>
        <z-marker-content>Running tests</z-marker-content>
      </z-marker>
    </div>
  `,
})
export class ZardDemoMarkerStatusComponent {}
```

### Shimmer

```angular-ts
import { Component } from '@angular/core';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';

@Component({
  selector: 'z-demo-marker-shimmer',
  imports: [...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-8">
      <z-marker role="status">
        <z-marker-content class="shimmer">Thinking...</z-marker-content>
      </z-marker>

      <z-marker zVariant="separator" role="status">
        <z-marker-content class="shimmer">Reading 4 files</z-marker-content>
      </z-marker>
    </div>
  `,
})
export class ZardDemoMarkerShimmerComponent {}
```

### Separator

```angular-ts
import { Component } from '@angular/core';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';

@Component({
  selector: 'z-demo-marker-separator',
  imports: [...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-8">
      <z-marker zVariant="separator">
        <z-marker-content>Today</z-marker-content>
      </z-marker>

      <z-marker zVariant="separator">
        <z-marker-content>Worked for 42s</z-marker-content>
      </z-marker>

      <z-marker zVariant="separator">
        <z-marker-content>Conversation compacted</z-marker-content>
      </z-marker>
    </div>
  `,
})
export class ZardDemoMarkerSeparatorComponent {}
```

### Border

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileText, lucideGitBranch, lucideSearch } from '@ng-icons/lucide';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';

@Component({
  selector: 'z-demo-marker-border',
  imports: [NgIcon, ...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-3">
      <z-marker zVariant="border">
        <z-marker-icon><ng-icon name="lucideGitBranch" /></z-marker-icon>
        <z-marker-content>Switched to release-candidate</z-marker-content>
      </z-marker>

      <z-marker zVariant="border">
        <z-marker-icon><ng-icon name="lucideSearch" /></z-marker-icon>
        <z-marker-content>Reviewed 8 related files</z-marker-content>
      </z-marker>

      <z-marker zVariant="border">
        <z-marker-icon><ng-icon name="lucideFileText" /></z-marker-icon>
        <z-marker-content>Opened implementation notes</z-marker-content>
      </z-marker>
    </div>
  `,
  viewProviders: [provideIcons({ lucideFileText, lucideGitBranch, lucideSearch })],
})
export class ZardDemoMarkerBorderComponent {}
```

### Icon

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookOpenCheck, lucideGitBranch, lucideSearch } from '@ng-icons/lucide';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';

@Component({
  selector: 'z-demo-marker-icon',
  imports: [NgIcon, ...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-12">
      <z-marker>
        <z-marker-icon><ng-icon name="lucideGitBranch" /></z-marker-icon>
        <z-marker-content>Switched to a new branch</z-marker-content>
      </z-marker>

      <z-marker zVariant="separator">
        <z-marker-icon><ng-icon name="lucideSearch" /></z-marker-icon>
        <z-marker-content>Explored 4 files</z-marker-content>
      </z-marker>

      <z-marker class="flex-col">
        <z-marker-icon><ng-icon name="lucideBookOpenCheck" /></z-marker-icon>
        <z-marker-content>Syncing completed</z-marker-content>
      </z-marker>
    </div>
  `,
  viewProviders: [provideIcons({ lucideBookOpenCheck, lucideGitBranch, lucideSearch })],
})
export class ZardDemoMarkerIconComponent {}
```

### Link

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch, lucideRotateCcw } from '@ng-icons/lucide';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'z-demo-marker-link',
  imports: [NgIcon, ...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-8">
      <a z-marker href="#links-and-buttons">
        <z-marker-icon><ng-icon name="lucideGitBranch" /></z-marker-icon>
        <z-marker-content>View the pull request</z-marker-content>
      </a>

      <button z-marker type="button" class="hover:text-foreground transition-colors" (click)="revert()">
        <z-marker-icon><ng-icon name="lucideRotateCcw" /></z-marker-icon>
        <z-marker-content>Revert this change</z-marker-content>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideGitBranch, lucideRotateCcw })],
})
export class ZardDemoMarkerLinkComponent {
  private readonly sonner = inject(ZardSonnerService);

  revert() {
    this.sonner.show('You clicked the revert button');
  }
}
```

## API Reference

### z-marker, [z-marker]

Root of an inline conversation marker. Use the attribute selector on an `a` or `button` to make the whole marker interactive, and set `role="status"` for streaming or in-progress markers.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zVariant]` | Layout of the marker: inline row, bordered row, or a centered label with divider lines on each side. | `default \| border \| separator` | `default` |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

### z-marker-icon, [z-marker-icon]

Decorative icon slot, hidden from assistive tech with `aria-hidden`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

### z-marker-content, [z-marker-content]

Text content of the marker. Add the `shimmer` class for an animated streaming-text effect, which is disabled automatically when the user prefers reduced motion.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

---

[Open in browser](https://zardui.com/docs/components/marker)
