---
title: Toggle Group
description: A set of two-state buttons that can be pressed or released. Multiple buttons can be selected at the same time.
---

# Toggle Group

A set of two-state buttons that can be pressed or released. Multiple buttons can be selected at the same time.

## Installation

### CLI

```bash
npx zard-cli@latest add toggle-group
```

### Manual

```angular-ts
import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  linkedSignal,
  output,
  signal,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgIcon, type IconName } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import {
  toggleVariants,
  type ZardToggleSizeVariants,
  type ZardToggleTypeVariants,
} from '@/shared/components/toggle/toggle.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { toggleGroupItemVariants, toggleGroupVariants } from './toggle-group.variants';

export interface ZardToggleGroupItem {
  value: string;
  label?: string;
  icon?: IconName;
  template?: TemplateRef<void>;
  disabled?: boolean;
  ariaLabel?: string;
}

type OnTouchedType = () => void;
type OnChangeType = (value: string | string[]) => void;

@Component({
  selector: 'z-toggle-group',
  imports: [NgIcon, NgTemplateOutlet],
  template: `
    <div
      role="group"
      data-slot="toggle-group"
      [class]="classes()"
      [attr.data-variant]="zType()"
      [attr.data-size]="zSize()"
      [attr.data-orientation]="zOrientation()"
      [attr.data-horizontal]="zOrientation() === 'horizontal' || null"
      [attr.data-vertical]="zOrientation() === 'vertical' || null"
      [attr.data-spacing]="zSpacing()"
      [style.--gap]="zSpacing()"
    >
      @for (item of zItems(); track item.value) {
        <button
          type="button"
          data-slot="toggle-group-item"
          [attr.data-variant]="zType()"
          [attr.data-size]="zSize()"
          [attr.data-spacing]="zSpacing()"
          [attr.aria-pressed]="isItemPressed(item.value)"
          [attr.data-state]="isItemPressed(item.value) ? 'on' : 'off'"
          [attr.aria-label]="item.ariaLabel"
          [class]="itemClasses()"
          [disabled]="disabledState() || item.disabled"
          (click)="toggleItem(item)"
        >
          @if (item.template) {
            <ng-container [ngTemplateOutlet]="item.template" />
          } @else {
            @if (item.icon) {
              <ng-icon [name]="item.icon" class="size-4!" />
            }
            @if (item.label) {
              <span>{{ item.label }}</span>
            } @else if (!item.icon) {
              <span>{{ item.value }}</span>
            }
          }
        </button>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardToggleGroupComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zToggleGroup',
})
export class ZardToggleGroupComponent implements ControlValueAccessor {
  readonly class = input<ClassValue>('');
  readonly zDefaultValue = input<string | string[]>();
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zMode = input<'single' | 'multiple'>('multiple');
  readonly zItemClass = input<ClassValue>('');
  readonly zItems = input<ZardToggleGroupItem[]>([]);
  readonly zOrientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly zSize = input<ZardToggleSizeVariants>('default');
  readonly zSpacing = input(0);
  readonly zType = input<ZardToggleTypeVariants>('default');
  readonly zValue = input<string | string[]>();

  readonly valueChange = output<string | string[]>();

  protected readonly disabledState = linkedSignal(() => this.zDisabled());
  private readonly internalValue = signal<string | string[] | undefined>(undefined);

  protected readonly classes = computed(() => mergeClasses(toggleGroupVariants(), this.class()));

  protected readonly itemClasses = computed(() =>
    mergeClasses(
      toggleGroupItemVariants(),
      toggleVariants({
        zType: this.zType(),
        zSize: this.zSize(),
      }),
      this.zItemClass(),
    ),
  );

  protected readonly currentValue = computed(() => {
    const internal = this.internalValue();
    const input = this.zValue();
    const defaultVal = this.zDefaultValue();

    if (internal !== undefined) {
      return internal;
    }
    if (input !== undefined) {
      return input;
    }
    if (defaultVal !== undefined) {
      return defaultVal;
    }

    return this.zMode() === 'single' ? '' : [];
  });

  protected isItemPressed(itemValue: string): boolean {
    const current = this.currentValue();
    if (this.zMode() === 'single') {
      return current === itemValue;
    }
    return Array.isArray(current) && current.includes(itemValue);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: OnTouchedType = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChangeFn: OnChangeType = () => {};

  toggleItem(item: ZardToggleGroupItem) {
    if (this.disabledState() || item.disabled) {
      return;
    }

    const currentValue = this.currentValue();
    let newValue: string | string[];

    if (this.zMode() === 'single') {
      newValue = currentValue === item.value ? '' : item.value;
    } else {
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      if (currentArray.includes(item.value)) {
        newValue = currentArray.filter(v => v !== item.value);
      } else {
        newValue = [...currentArray, item.value];
      }
    }

    this.internalValue.set(newValue);
    this.valueChange.emit(newValue);
    this.onChangeFn(newValue);
    this.onTouched();
  }

  writeValue(value: string | string[]): void {
    if (value !== undefined) {
      this.internalValue.set(value);
    }
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }
}
```

```angular-ts
import { cva } from 'class-variance-authority';

export const toggleGroupVariants = cva(
  'group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-lg data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-vertical:flex-col data-vertical:items-stretch',
);

export const toggleGroupItemVariants = cva(
  'shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t',
);
```

```angular-ts
export * from './toggle-group.component';
export * from './toggle-group.variants';
```

## Usage

```angular-ts
import { ZardToggleGroupComponent } from '@/shared/components/toggle-group/toggle-group.component';
```

```angular-html
<z-toggle-group>
  <z-toggle value="bold">Bold</z-toggle>
  <z-toggle value="italic">Italic</z-toggle>
  <z-toggle value="underline">Underline</z-toggle>
</z-toggle-group>
```

## Examples

### Outline

Use `zType="outline"` for an outline style.

```angular-ts
import { Component } from '@angular/core';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

@Component({
  selector: 'z-demo-toggle-group-outline',
  imports: [ZardToggleGroupComponent],
  template: `
    <z-toggle-group
      zDefaultValue="all"
      zMode="single"
      zType="outline"
      [zItems]="items"
      (valueChange)="onToggleChange($event)"
    />
  `,
})
export class ZardDemoToggleGroupOutlineComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'all',
      label: 'All',
      ariaLabel: 'Toggle all',
    },
    {
      value: 'missed',
      label: 'Missed',
      ariaLabel: 'Toggle missed',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected:', value);
  }
}
```

### Size

Use the `zSize` to change the size of the toggle group.

```angular-ts
import { Component } from '@angular/core';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

@Component({
  selector: 'z-demo-toggle-group-sizes',
  imports: [ZardToggleGroupComponent],
  template: `
    <div class="space-y-4">
      <div>
        <z-toggle-group
          zDefaultValue="top"
          zMode="single"
          zSize="sm"
          [zItems]="items"
          zType="outline"
          (valueChange)="onToggleChange($event)"
        />
      </div>
      <div>
        <z-toggle-group
          zDefaultValue="top"
          zMode="single"
          zSize="lg"
          [zItems]="items"
          zType="outline"
          (valueChange)="onToggleChange($event)"
        />
      </div>
    </div>
  `,
})
export class ZardDemoToggleGroupSizesComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'top',
      label: 'Top',
      ariaLabel: 'Toggle top',
    },
    {
      value: 'bottom',
      label: 'Bottom',
      ariaLabel: 'Toggle bottom',
    },
    {
      value: 'left',
      label: 'Left',
      ariaLabel: 'Toggle left',
    },
    {
      value: 'right',
      label: 'Right',
      ariaLabel: 'Toggle right',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected:', value);
  }
}
```

### Spacing

Use `zSpacing` to add spacing between toggle group items.

```angular-ts
import { Component } from '@angular/core';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

@Component({
  selector: 'z-demo-toggle-group-spacing',
  imports: [ZardToggleGroupComponent],
  template: `
    <z-toggle-group
      zDefaultValue="top"
      zMode="single"
      zSize="sm"
      zType="outline"
      [zItems]="items"
      [zSpacing]="2"
      (valueChange)="onToggleChange($event)"
    />
  `,
})
export class ZardDemoToggleGroupSpacingComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'top',
      label: 'Top',
      ariaLabel: 'Toggle top',
    },
    {
      value: 'bottom',
      label: 'Bottom',
      ariaLabel: 'Toggle bottom',
    },
    {
      value: 'left',
      label: 'Left',
      ariaLabel: 'Toggle left',
    },
    {
      value: 'right',
      label: 'Right',
      ariaLabel: 'Toggle right',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Selected:', value);
  }
}
```

### Vertical

Use `zOrientation="vertical"` for vertical toggle groups.

```angular-ts
import { Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

@Component({
  selector: 'z-demo-toggle-group-vertical',
  imports: [ZardToggleGroupComponent],
  template: `
    <z-toggle-group
      zMode="multiple"
      zOrientation="vertical"
      [zDefaultValue]="['bold', 'italic']"
      [zItems]="items"
      [zSpacing]="1"
      (valueChange)="onToggleChange($event)"
    />
  `,
  viewProviders: [
    provideIcons({
      lucideBold,
      lucideItalic,
      lucideUnderline,
    }),
  ],
})
export class ZardDemoToggleGroupVerticalComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'bold',
      icon: 'lucideBold',
      ariaLabel: 'Toggle bold',
    },
    {
      value: 'italic',
      icon: 'lucideItalic',
      ariaLabel: 'Toggle italic',
    },
    {
      value: 'underline',
      icon: 'lucideUnderline',
      ariaLabel: 'Toggle underline',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Toggle group changed:', value);
  }
}
```

### Disabled

```angular-ts
import { Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide';

import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

@Component({
  selector: 'z-demo-toggle-group-disabled',
  imports: [ZardToggleGroupComponent],
  template: `
    <z-toggle-group [zDisabled]="true" zMode="multiple" [zItems]="items" (valueChange)="onToggleChange($event)" />
  `,
  viewProviders: [
    provideIcons({
      lucideBold,
      lucideItalic,
      lucideUnderline,
    }),
  ],
})
export class ZardDemoToggleGroupDisabledComponent {
  items: ZardToggleGroupItem[] = [
    {
      value: 'bold',
      icon: 'lucideBold',
      ariaLabel: 'Toggle bold',
    },
    {
      value: 'italic',
      icon: 'lucideItalic',
      ariaLabel: 'Toggle italic',
    },
    {
      value: 'underline',
      icon: 'lucideUnderline',
      ariaLabel: 'Toggle underline',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Toggle group changed:', value);
  }
}
```

### Custom

A custom toggle group example.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal, type TemplateRef, viewChild } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

@Component({
  selector: 'z-demo-toggle-group-custom',
  imports: [ZardToggleGroupComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-full">
      <label z-field-label for="fontToggle">Font Weight</label>
      <z-toggle-group
        id="fontToggle"
        zItemClass="flex size-16 flex-col items-center justify-center rounded-xl"
        zMode="single"
        zType="outline"
        zSize="lg"
        [zItems]="items()"
        [zSpacing]="2"
        (valueChange)="onToggleChange($event)"
      />
      <p z-field-description>
        Use
        <code class="bg-muted rounded-md px-1 py-0.5 font-mono">font-{{ fontWeight() }}</code>
        to set the font weight.
      </p>
    </div>

    <ng-template #light>
      <span class="text-2xl leading-none font-light">Aa</span>
      <span class="text-muted-foreground text-xs">Light</span>
    </ng-template>

    <ng-template #normal>
      <span class="text-2xl leading-none font-normal">Aa</span>
      <span class="text-muted-foreground text-xs">Normal</span>
    </ng-template>

    <ng-template #medium>
      <span class="text-2xl leading-none font-medium">Aa</span>
      <span class="text-muted-foreground text-xs">Medium</span>
    </ng-template>

    <ng-template #bold>
      <span class="text-2xl leading-none font-bold">Aa</span>
      <span class="text-muted-foreground text-xs">Bold</span>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoToggleGroupCustomComponent {
  readonly light = viewChild<TemplateRef<void>>('light');
  readonly normal = viewChild<TemplateRef<void>>('normal');
  readonly medium = viewChild<TemplateRef<void>>('medium');
  readonly bold = viewChild<TemplateRef<void>>('bold');

  protected readonly fontWeight = signal<string>('');

  readonly items = computed<ZardToggleGroupItem[]>(() => [
    {
      value: 'light',
      template: this.light(),
      ariaLabel: 'Light',
    },
    {
      value: 'normal',
      template: this.normal(),
      ariaLabel: 'Normal',
    },
    {
      value: 'medium',
      template: this.medium(),
      ariaLabel: 'Medium',
    },
    {
      value: 'bold',
      template: this.bold(),
      ariaLabel: 'Bold',
    },
  ]);

  onToggleChange(value: string | string[]) {
    let weight = '';
    if (Array.isArray(value)) {
      [weight] = value;
    } else {
      weight = value;
    }
    this.fontWeight.set(weight);
  }
}
```

## API Reference

### z-toggle-group

A set of two-state buttons that can be pressed or released, with multiple selections supported.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zDefaultValue]` | Default value | `string \| string[]` | `-` |
| `[zDisabled]` | Whether the entire group is disabled | `boolean` | `false` |
| `[zItemClass]` | Additional CSS classes for group item | `ClassValue` | `''` |
| `[zItems]` | Array of toggle items to display | `ZardToggleGroupItem[]` | `[]` |
| `[zMode]` | Selection mode — single allows one active toggle, multiple allows many | `'single' \| 'multiple'` | `'multiple'` |
| `[zOrientation]` | Layout direction of the toggle group | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `[zSize]` | Size variant of the toggle group | `'default' \| 'sm' \| 'lg'` | `'default'` |
| `[zSpacing]` | Gap spacing between toggle items | `number` | `0` |
| `[zType]` | Visual style variant | `'default' \| 'outline'` | `'default'` |
| `[zValue]` | Controlled value of the toggle group | `string \| string[] \| undefined` | `-` |
| `(valueChange)` | Emitted when toggle state changes, returns updated value | `output<string \| string[]>` | `-` |

---

[Open in browser](https://zardui.com/docs/components/toggle-group)
