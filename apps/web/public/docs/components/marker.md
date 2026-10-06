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
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet.directive';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { markerContentVariants, markerIconVariants, markerVariants, type ZardMarkerVariants } from './marker.variants';

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

@Component({
  selector: 'z-marker, [z-marker]',
  imports: [NgIcon, ZardMarkerContentComponent, ZardMarkerIconComponent, ZardStringTemplateOutletDirective],
  template: `
    @let icon = zIcon();

    <ng-content select="z-marker-icon, [z-marker-icon]" />
    @if (icon && !hasIcon()) {
      <z-marker-icon>
        <ng-container *zStringTemplateOutlet="icon">
          <ng-icon [name]="iconName()!" class="size-4!" />
        </ng-container>
      </z-marker-icon>
    }

    <ng-content select="z-marker-content, [z-marker-content]" />
    @if (!hasContent()) {
      <z-marker-content>
        <ng-content />
      </z-marker-content>
    }
  `,
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
  readonly zIcon = input<TemplateRef<void> | string>();
  readonly class = input<ClassValue>('');

  /**
   * A marker with no projected `z-marker-content` builds the row itself, so
   * `<z-marker zIcon="lucideSearch">Explored 4 files</z-marker>` is one tag. Project a
   * slot and it wins: that is what unlocks a `class` override such as `shimmer`, or an
   * icon that is a whole component like `z-spinner`.
   */
  private readonly projectedIcon = contentChild(ZardMarkerIconComponent, { descendants: false });
  private readonly projectedContent = contentChild(ZardMarkerContentComponent, { descendants: false });

  protected readonly hasIcon = computed(() => !!this.projectedIcon());
  protected readonly hasContent = computed(() => !!this.projectedContent());
  protected readonly classes = computed(() =>
    mergeClasses(markerVariants({ zVariant: this.zVariant() }), this.class()),
  );

  protected readonly iconName = computed((): string | undefined => {
    const icon = this.zIcon();
    return icon instanceof TemplateRef ? undefined : icon;
  });
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
<z-marker zIcon="lucideSearch">Explored 4 files</z-marker>
```

## Examples

### Variants

The three `zVariant` values on `z-marker`: `default` for a plain inline row, `border` for a row with a bottom rule, and `separator` for a centered label with divider lines on each side.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';

@Component({
  selector: 'z-demo-marker-variants',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMarkerVariantsComponent {}
```

### Status

Set `role="status"` on `z-marker` and project the real `z-spinner` into `z-marker-icon` so a streaming or in-progress row is announced to assistive tech as it updates.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMarkerStatusComponent {}
```

### Shimmer

Add the `shimmer` utility class to `z-marker-content` for an animated streaming-text effect — it turns off automatically when the user prefers reduced motion.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMarkerShimmerComponent {}
```

### Separator

Set `zVariant="separator"` on `z-marker` for a centered label with divider lines on each side, such as a date or a section break in a conversation.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMarkerSeparatorComponent {}
```

### Border

Set `zVariant="border"` on `z-marker` for a status row that keeps the default alignment while adding a bottom rule that separates it from the next row.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFileText, lucideGitBranch, lucideSearch })],
})
export class ZardDemoMarkerBorderComponent {}
```

### With Icon

Project `z-marker-icon` alongside `z-marker-content` to pair an icon with the row. Add `class="flex-col"` on `z-marker` to stack the icon above the content instead of beside it.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBookOpenCheck, lucideGitBranch, lucideSearch } from '@ng-icons/lucide';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';

@Component({
  selector: 'z-demo-marker-with-icon',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBookOpenCheck, lucideGitBranch, lucideSearch })],
})
export class ZardDemoMarkerWithIconComponent {}
```

### Links And Buttons

Apply the `[z-marker]` attribute selector to a native `a` or `button` so the whole row becomes an interactive link or action. The root already underlines and hovers-to-foreground an `a`; give a `button` its own hover class, since that built-in styling only targets `a`.

```angular-ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch, lucideRotateCcw } from '@ng-icons/lucide';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'z-demo-marker-links-and-buttons',
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
export class ZardDemoMarkerLinksAndButtonsComponent {
  private readonly sonner = inject(ZardSonnerService);

  revert() {
    this.sonner.show('You clicked the revert button');
  }
}
```

### Shorthand

A zard-only shorthand: a `z-marker` with no projected `z-marker-content` builds the row itself, so `<z-marker zIcon="lucideSearch">Explored 4 files</z-marker>` is one tag. Project the explicit `z-marker-content` (and `z-marker-icon`) slots when you need a class override such as `shimmer`, or an icon that is a whole component like `z-spinner`.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideGitBranch, lucideSearch } from '@ng-icons/lucide';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-marker-shorthand',
  imports: [ZardSpinnerComponent, ...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-8">
      <z-marker>Short rows do not need the content wrapper.</z-marker>

      <z-marker zIcon="lucideSearch">Explored 4 files</z-marker>

      <z-marker zVariant="border" zIcon="lucideGitBranch">Switched to release-candidate</z-marker>

      <z-marker zVariant="separator">Today</z-marker>

      <z-marker role="status">
        <z-marker-icon><z-spinner /></z-marker-icon>
        <z-marker-content class="shimmer">Project the slots when you need to style them.</z-marker-content>
      </z-marker>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideGitBranch, lucideSearch })],
})
export class ZardDemoMarkerShorthandComponent {}
```

## API Reference

### z-marker

Root of an inline conversation marker. Content projected without a `z-marker-content` child gets the content surface for free, so `<z-marker zIcon="lucideSearch">Explored 4 files</z-marker>` is a complete row. Use the attribute selector on an `a` or `button` to make the whole marker interactive, and set `role="status"` for streaming or in-progress markers.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zVariant]` | Layout of the marker: inline row, bordered row, or a centered label with divider lines on each side. | `default \| border \| separator` | `default` |
| `[zIcon]` | Icon rendered in the decorative icon slot. A string is the `@ng-icons` name to render — register it with `provideIcons` — and a template is rendered as is. Ignored when a `z-marker-icon` is projected. | `string \| TemplateRef<void>` | `-` |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

### z-marker-icon

Decorative icon slot, hidden from assistive tech with `aria-hidden`. Project it when the icon is a component such as `z-spinner`; otherwise `zIcon` on the root is enough.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

### z-marker-content

Text content of the marker. Optional — the root wraps bare projected content in this surface. Project it to add classes such as `shimmer`, an animated streaming-text effect that is disabled automatically when the user prefers reduced motion.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend default classes. | `ClassValue` | `-` |

---

[Open in browser](https://zardui.com/docs/components/marker)
