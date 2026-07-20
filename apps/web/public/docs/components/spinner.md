---
title: Spinner
description: A visual component that displays a loading animation to indicate that an action or process is in progress.
---

# Spinner

A visual component that displays a loading animation to indicate that an action or process is in progress.

## Installation

### CLI

```bash
npx zard-cli@latest add spinner
```

### Manual

```angular-ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet/string-template-outlet.directive';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-spinner',
  imports: [ZardStringTemplateOutletDirective],
  template: `
    @let icon = zIcon();
    @if (icon) {
      <ng-container *zStringTemplateOutlet="icon; context: iconContext()" />
    } @else {
      <svg
        data-slot="spinner"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        [class]="classes()"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'inline-flex',
    role: 'status',
    'aria-label': 'Loading',
  },
  exportAs: 'zSpinner',
})
export class ZardSpinnerComponent {
  readonly class = input<ClassValue>('');
  readonly zIcon = input<TemplateRef<{ $implicit: string }> | undefined>(undefined);

  protected readonly classes = computed(() => mergeClasses('size-4 animate-spin', this.class()));
  protected readonly iconContext = computed(() => ({ $implicit: this.classes() }));
}
```

```angular-ts
export * from './spinner.component';
```

## Usage

```angular-ts
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';
```

```angular-html
<z-spinner></z-spinner>
```

## Examples

### Customization

```angular-ts
import { Component } from '@angular/core';

import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-spinner-customization',
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
})
export class ZardDemoSpinnerCustomizationComponent {}
```

### Size

```angular-ts
import { Component } from '@angular/core';

import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-spinner-size',
  imports: [ZardSpinnerComponent],
  template: `
    <div class="flex items-center gap-6">
      <z-spinner class="size-3" />
      <z-spinner class="size-4" />
      <z-spinner class="size-6" />
      <z-spinner class="size-8" />
    </div>
  `,
})
export class ZardDemoSpinnerSizeComponent {}
```

### Button

```angular-ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-spinner-button',
  imports: [ZardButtonComponent, ZardSpinnerComponent],
  template: `
    <div class="flex flex-col items-center gap-4">
      <button type="button" z-button zSize="sm" [zDisabled]="true">
        <z-spinner data-icon="inline-start" />
        Loading...
      </button>
      <button type="button" z-button zType="outline" zSize="sm" [zDisabled]="true">
        <z-spinner data-icon="inline-start" />
        Please wait
      </button>
      <button type="button" z-button zType="secondary" zSize="sm" [zDisabled]="true">
        <z-spinner data-icon="inline-start" />
        Processing
      </button>
    </div>
  `,
})
export class ZardDemoSpinnerButtonComponent {}
```

### Badge

```angular-ts
import { Component } from '@angular/core';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-spinner-badge',
  imports: [ZardBadgeComponent, ZardSpinnerComponent],
  template: `
    <div class="flex items-center gap-4 [--radius:1.2rem]">
      <z-badge>
        <z-spinner data-icon="inline-start" />
        Syncing
      </z-badge>
      <z-badge zType="secondary">
        <z-spinner data-icon="inline-start" />
        Updating
      </z-badge>
      <z-badge zType="outline">
        <z-spinner data-icon="inline-start" />
        Processing
      </z-badge>
    </div>
  `,
})
export class ZardDemoSpinnerBadgeComponent {}
```

### Input Group

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-spinner-input-group',
  imports: [ZardInputComponent, ZardTextareaComponent, ZardSpinnerComponent, NgIcon, ...ZardInputGroupImports],
  template: `
    <div class="flex w-full min-w-md flex-col gap-4">
      <z-input-group>
        <input z-input placeholder="Send a message..." disabled />
        <z-input-group-addon zAlign="inline-end">
          <z-spinner />
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <textarea z-textarea placeholder="Send a message..." disabled></textarea>
        <z-input-group-addon zAlign="block-end">
          <z-spinner />
          Validating...
          <button type="button" z-input-group-button zVariant="default" zSize="icon-xs" class="ml-auto">
            <ng-icon name="lucideArrowUp" />
            <span class="sr-only">Send</span>
          </button>
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
  viewProviders: [provideIcons({ lucideArrowUp })],
})
export class ZardDemoSpinnerInputGroupComponent {}
```

### Empty

```angular-ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardEmptyComponent } from '@/shared/components/empty/empty.component';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-spinner-empty',
  imports: [ZardButtonComponent, ZardEmptyComponent, ZardSpinnerComponent],
  template: `
    <z-empty
      class="w-full"
      [zImage]="iconTpl"
      zTitle="Processing your request"
      zDescription="Please wait while we process your request. Do not refresh the page."
      [zActions]="[cancelAction]"
    />

    <ng-template #iconTpl>
      <div class="bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg">
        <z-spinner />
      </div>
    </ng-template>

    <ng-template #cancelAction>
      <button type="button" z-button zType="outline" zSize="sm">Cancel</button>
    </ng-template>
  `,
})
export class ZardDemoSpinnerEmptyComponent {}
```

## API Reference

### z-spinner

A simple loading indicator built on the Lucide loader-circle icon.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Override or extend the default classes (size, color, animation duration). | `ClassValue` | `size-4 animate-spin` |
| `[zIcon]` | Custom icon template. Receives the merged classes via `$implicit` so the icon stays in sync with the spinner sizing/animation. | `TemplateRef<{ $implicit: string }>` | `-` |

---

[Open in browser](https://zardui.com/docs/components/spinner)
