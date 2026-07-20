---
title: Toggle
description: A two-state button that can be either on or off.
---

# Toggle

A two-state button that can be either on or off.

## Installation

### CLI

```bash
npx zard-cli@latest add toggle
```

### Manual

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  linkedSignal,
  model,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { toggleVariants, type ZardToggleSizeVariants, type ZardToggleTypeVariants } from './toggle.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: boolean) => void;

@Component({
  selector: 'z-toggle',
  template: `
    <button
      type="button"
      data-slot="toggle"
      [attr.aria-label]="zAriaLabel()"
      [attr.aria-pressed]="zValue()"
      [attr.data-state]="state()"
      [class]="classes()"
      [disabled]="disabled()"
      (click)="toggle()"
    >
      <ng-content />
    </button>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardToggleComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '(mouseenter)': 'handleHover()',
  },
  exportAs: 'zToggle',
})
export class ZardToggleComponent implements ControlValueAccessor {
  readonly zValue = model(false);
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zType = input<ZardToggleTypeVariants>('default');
  readonly zSize = input<ZardToggleSizeVariants>('default');
  readonly zAriaLabel = input.required<string>();
  readonly class = input<ClassValue>('');

  readonly zToggleClick = output<void>();
  readonly zToggleHover = output<void>();
  readonly zToggleChange = output<boolean>();

  protected readonly state = computed(() => (this.zValue() ? 'on' : 'off'));

  protected readonly disabled = linkedSignal(() => this.zDisabled());

  protected readonly classes = computed(() =>
    mergeClasses(toggleVariants({ zSize: this.zSize(), zType: this.zType() }), this.class()),
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: OnTouchedType = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChangeFn: OnChangeType = () => {};

  handleHover() {
    this.zToggleHover.emit();
  }

  toggle() {
    if (this.disabled()) {
      return;
    }

    this.zValue.update(v => !v);

    this.zToggleClick.emit();
    this.zToggleChange.emit(this.zValue());
    this.onChangeFn(this.zValue());
    this.onTouched();
  }

  writeValue(val: boolean): void {
    this.zValue.set(val);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      zType: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent',
      },
      zSize: {
        default: 'h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
    },
  },
);
export type ZardToggleTypeVariants = NonNullable<VariantProps<typeof toggleVariants>['zType']>;
export type ZardToggleSizeVariants = NonNullable<VariantProps<typeof toggleVariants>['zSize']>;
```

```angular-ts
export * from './toggle.component';
export * from './toggle.variants';
```

## Usage

```angular-ts
import { ZardToggleComponent } from '@/shared/components/toggle/toggle.component';
```

```angular-html
<z-toggle>Toggle</z-toggle>
```

## Examples

### Outline

Use `zType="outline"` for an outline style.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic } from '@ng-icons/lucide';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-outline',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <div class="flex items-center gap-2">
      <z-toggle zAriaLabel="Toggle italic" zType="outline">
        <ng-icon name="lucideItalic" />
        Italic
      </z-toggle>
      <z-toggle zAriaLabel="Toggle bold" zType="outline">
        <ng-icon name="lucideBold" />
        Bold
      </z-toggle>
    </div>
  `,
  viewProviders: [provideIcons({ lucideBold, lucideItalic })],
})
export class ZardDemoToggleOutlineComponent {}
```

### With Text

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideItalic } from '@ng-icons/lucide';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-with-text',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <z-toggle zAriaLabel="Toggle italic">
      <ng-icon name="lucideItalic" />
      Italic
    </z-toggle>
  `,
  viewProviders: [provideIcons({ lucideItalic })],
})
export class ZardDemoToggleWithTextComponent {}
```

### Size

Use the `zSize` input to change the size of the toggle.

```angular-ts
import { Component } from '@angular/core';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-size',
  imports: [ZardToggleComponent],
  template: `
    <div class="flex items-center gap-2">
      <z-toggle zAriaLabel="Toggle small" zSize="sm" zType="outline">Small</z-toggle>
      <z-toggle zAriaLabel="Toggle default" zSize="default" zType="outline">Default</z-toggle>
      <z-toggle zAriaLabel="Toggle large" zSize="lg" zType="outline">Large</z-toggle>
    </div>
  `,
})
export class ZardDemoToggleSizeComponent {}
```

### Disabled

```angular-ts
import { Component } from '@angular/core';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-disabled',
  imports: [ZardToggleComponent],
  template: `
    <div class="flex items-center gap-2">
      <z-toggle zAriaLabel="Toggle disabled" zDisabled>Disabled</z-toggle>
      <z-toggle zAriaLabel="Toggle disabled outline" zType="outline" zDisabled>Disabled</z-toggle>
    </div>
  `,
})
export class ZardDemoToggleDisabledComponent {}
```

### With

```angular-ts
import { Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLightbulb, lucideLightbulbOff } from '@ng-icons/lucide';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-with-bindings',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <div class="flex flex-col items-center gap-8">
      <z-toggle zAriaLabel="Turn on the light" [(zValue)]="lightOn" zType="outline">
        <ng-icon [name]="bulb()" />
      </z-toggle>
      <span>Light is {{ state() }}.</span>
    </div>
  `,
  viewProviders: [provideIcons({ lucideLightbulb, lucideLightbulbOff })],
})
export class ZardDemoToggleWithBindingsComponent {
  protected readonly lightOn = signal(false);
  protected readonly bulb = computed(() => (this.lightOn() ? 'lucideLightbulb' : 'lucideLightbulbOff'));
  protected readonly state = computed(() => (this.lightOn() ? 'on' : 'off'));
}
```

## API Reference

### [z-toggle]

A two-state button that can be either on or off.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |
| `[zSize]` | Toggle size | `'sm' \| 'default' \| 'lg'` | `'default'` |
| `[zType]` | Visual style | `'default' \| 'outline'` | `'default'` |
| `[(zValue)]` | Toggle value | `boolean` | `false` |
| `[zDisabled]` | Disables the toggle (also integrates with Angular Forms) | `boolean` | `false` |
| `[zAriaLabel]` | Accessible label for screen readers (required) | `string (required)` | `-` |
| `(zToggleClick)` | Emitted when the toggle is clicked | `void` | `-` |
| `(zToggleHover)` | Emitted when the toggle is hovered | `void` | `-` |
| `(zToggleChange)` | Emitted when the toggle value changes | `boolean` | `-` |

---

[Open in browser](https://zardui.com/docs/components/toggle)
