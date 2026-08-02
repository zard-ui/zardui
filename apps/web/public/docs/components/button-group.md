---
title: Button Group
description: A container that groups related buttons together with consistent styling.
---

# Button Group

A container that groups related buttons together with consistent styling.

## Installation

### CLI

```bash
npx zard-cli@latest add button-group
```

### Manual

```angular-ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { type ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  buttonGroupDividerVariants,
  buttonGroupTextVariants,
  buttonGroupVariants,
  type ZardButtonGroupVariants,
} from './button-group.variants';
import { ZardSeparatorComponent } from '../separator/separator.component';
import { type ZardSeparatorVariants } from '../separator/separator.variants';

@Component({
  selector: 'z-button-group',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    'data-slot': 'button-group',
    '[class]': 'classes()',
    '[attr.data-orientation]': 'zOrientation()',
    '[attr.aria-orientation]': 'zOrientation()',
  },
  exportAs: 'zButtonGroup',
})
export class ZardButtonGroupComponent {
  readonly zOrientation = input<Required<ZardButtonGroupVariants>['zOrientation']>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      buttonGroupVariants({
        zOrientation: this.zOrientation(),
      }),
      this.class(),
    ),
  );
}

@Component({
  selector: 'z-button-group-divider',
  imports: [ZardSeparatorComponent],
  template: `
    <z-separator [class]="classes()" aria-hidden="true" [zOrientation]="orientation()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'contents',
    'data-slot': 'button-group-separator',
  },
  exportAs: 'zButtonGroupDivider',
})
export class ZardButtonGroupDividerComponent {
  readonly zOrientation = input<ZardSeparatorVariants['zOrientation']>(null);
  readonly class = input<ClassValue>('');

  private readonly parent = inject(ZardButtonGroupComponent, {
    optional: true,
    host: true,
  });

  protected readonly orientation = computed(() => {
    if (!this.parent || typeof this.zOrientation() === 'string') {
      return this.zOrientation();
    }

    return this.parent.zOrientation() === 'vertical' ? 'horizontal' : 'vertical';
  });

  protected readonly classes = computed(() =>
    mergeClasses(
      buttonGroupDividerVariants({
        zOrientation: this.orientation(),
      }),
      this.class(),
    ),
  );
}

@Directive({
  selector: '[z-button-group-text]',
  host: {
    'data-slot': 'button-group-text',
    '[class]': 'classes()',
  },
  exportAs: 'zButtonGroupText',
})
export class ZardButtonGroupTextDirective {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(buttonGroupTextVariants(), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonGroupVariants = cva(
  'group/button-group flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 [&>input]:flex-1',
  {
    variants: {
      zOrientation: {
        horizontal:
          '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>z-select:not(:first-child)>button]:rounded-l-none [&>z-select:not(:first-child)>button]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>z-select:not(:last-child)>button]:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!',
        vertical:
          'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>z-select:not(:first-child)>button]:rounded-t-none [&>z-select:not(:first-child)>button]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>z-select:not(:last-child)>button]:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg!',
      },
    },
    defaultVariants: {
      zOrientation: 'horizontal',
    },
  },
);
export type ZardButtonGroupVariants = VariantProps<typeof buttonGroupVariants>;

export const buttonGroupDividerVariants = cva(
  'bg-input relative self-stretch grow-0 shrink-0 pointer-events-none select-none',
  {
    variants: {
      zOrientation: {
        horizontal: 'mx-px w-auto',
        vertical: 'my-px h-auto',
      },
    },
  },
);

export const buttonGroupTextVariants = cva(
  "bg-muted flex items-center gap-2 rounded-lg border px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
);
```

```angular-ts
export * from './button-group.component';
export * from './button-group.variants';
```

## Usage

```angular-ts
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
```

```angular-html
<z-button-group>
  <button z-button zType="outline">Left</button>
  <button z-button zType="outline">Center</button>
  <button z-button zType="outline">Right</button>
</z-button-group>
```

## Examples

### Orientation

Set the `zOrientation` prop to change the button group layout.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';

@Component({
  selector: 'z-demo-button-group-orientation',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon],
  template: `
    <z-button-group zOrientation="vertical">
      <button type="button" z-button zType="outline" zSize="icon" aria-label="Add">
        <ng-icon name="lucidePlus" />
      </button>
      <button type="button" z-button zType="outline" zSize="icon" aria-label="Remove">
        <ng-icon name="lucideMinus" />
      </button>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucidePlus, lucideMinus })],
})
export class ZardDemoButtonGroupOrientationComponent {}
```

### Size

Control the size of buttons using the `zSize` prop on individual buttons.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';

@Component({
  selector: 'z-demo-button-group-size',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon],
  template: `
    <z-button-group>
      <button type="button" z-button zType="outline" zSize="sm">Small</button>
      <button type="button" z-button zType="outline" zSize="sm">Button</button>
      <button type="button" z-button zType="outline" zSize="sm">Group</button>
      <button type="button" z-button zType="outline" zSize="icon-sm" aria-label="Add">
        <ng-icon name="lucidePlus" />
      </button>
    </z-button-group>

    <z-button-group>
      <button type="button" z-button zType="outline">Default</button>
      <button type="button" z-button zType="outline">Button</button>
      <button type="button" z-button zType="outline">Group</button>
      <button type="button" z-button zType="outline" zSize="icon" aria-label="Add">
        <ng-icon name="lucidePlus" />
      </button>
    </z-button-group>

    <z-button-group>
      <button type="button" z-button zType="outline" zSize="lg">Large</button>
      <button type="button" z-button zType="outline" zSize="lg">Button</button>
      <button type="button" z-button zType="outline" zSize="lg">Group</button>
      <button type="button" z-button zType="outline" zSize="icon-lg" aria-label="Add">
        <ng-icon name="lucidePlus" />
      </button>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucidePlus })],
  host: {
    class: 'flex flex-col items-start gap-8',
  },
})
export class ZardDemoButtonGroupSizeComponent {}
```

### Nested

Nest `z-button-group` components to create button groups with spacing.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAudioLines, lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTooltipDirective } from '@/shared/components/tooltip/tooltip';

@Component({
  selector: 'z-demo-button-group-nested',
  imports: [
    ZardButtonGroupComponent,
    ZardButtonComponent,
    ZardInputComponent,
    ...ZardInputGroupImports,
    ZardTooltipDirective,
    NgIcon,
  ],
  template: `
    <z-button-group>
      <z-button-group>
        <button type="button" z-button zType="outline" zSize="icon" aria-label="Add">
          <ng-icon name="lucidePlus" />
        </button>
      </z-button-group>
      <z-button-group>
        <z-input-group>
          <input z-input placeholder="Send a message..." />
          <z-input-group-addon zAlign="inline-end" zTooltip="Voice Mode">
            <ng-icon name="lucideAudioLines" />
          </z-input-group-addon>
        </z-input-group>
      </z-button-group>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucidePlus, lucideAudioLines })],
})
export class ZardDemoButtonGroupNestedComponent {}
```

### Separator

The `z-button-group-divider` component visually divides buttons within a group. Buttons with `zType="outline"` do not need a separator since they have a border.

```angular-ts
import { Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardButtonGroupComponent, ZardButtonGroupDividerComponent } from '../button-group.component';

@Component({
  selector: 'z-demo-button-group-divider',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, ZardButtonGroupDividerComponent],
  template: `
    <z-button-group>
      <button z-button zSize="sm" zType="secondary">Copy</button>
      <z-button-group-divider />
      <button z-button zSize="sm" zType="secondary">Paste</button>
    </z-button-group>
  `,
})
export class ZardDemoButtonGroupDividerComponent {}
```

### Split

Create a split button group by adding two buttons separated by a `z-button-group-divider`.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import {
  ZardButtonGroupComponent,
  ZardButtonGroupDividerComponent,
} from '@/shared/components/button-group/button-group.component';

@Component({
  selector: 'z-demo-button-group-split',
  imports: [ZardButtonGroupComponent, ZardButtonGroupDividerComponent, ZardButtonComponent, NgIcon],
  template: `
    <z-button-group>
      <button type="button" z-button zType="secondary">Button</button>
      <z-button-group-divider />
      <button type="button" z-button zType="secondary" zSize="icon" aria-label="Add">
        <ng-icon name="lucidePlus" />
      </button>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucidePlus })],
})
export class ZardDemoButtonGroupSplitComponent {}
```

### Input

Wrap an `Input` component with buttons.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardInputComponent } from '@/shared/components/input';

@Component({
  selector: 'z-demo-button-group-input',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon, ZardInputComponent],
  template: `
    <z-button-group>
      <input z-input placeholder="Search..." />
      <button type="button" z-button zType="outline"><ng-icon name="lucideSearch" /></button>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucideSearch })],
})
export class ZardDemoButtonGroupInputComponent {}
```

### Input Group

Wrap an `InputGroup` component to create complex input layouts.

```angular-ts
import { Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAudioLines, lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTooltipDirective } from '@/shared/components/tooltip/tooltip';

@Component({
  selector: 'z-demo-button-group-input-group',
  imports: [
    ZardButtonGroupComponent,
    ZardButtonComponent,
    ZardInputComponent,
    ...ZardInputGroupImports,
    ZardTooltipDirective,
    NgIcon,
  ],
  template: `
    <z-button-group class="[--radius:9999rem]">
      <z-button-group>
        <button type="button" z-button zType="outline" zSize="icon" aria-label="Add">
          <ng-icon name="lucidePlus" />
        </button>
      </z-button-group>
      <z-button-group>
        <z-input-group>
          <input
            z-input
            [placeholder]="voiceEnabled() ? 'Record and send audio...' : 'Send a message...'"
            [disabled]="voiceEnabled()"
          />
          <z-input-group-addon zAlign="inline-end">
            <button
              z-input-group-button
              zTooltip="Voice Mode"
              aria-label="Voice Mode"
              [attr.aria-pressed]="voiceEnabled()"
              [attr.data-active]="voiceEnabled() ? '' : null"
              class="data-[active]:bg-orange-100 data-[active]:text-orange-700 dark:data-[active]:bg-orange-800 dark:data-[active]:text-orange-100"
              (click)="toggleVoice()"
            >
              <ng-icon name="lucideAudioLines" />
            </button>
          </z-input-group-addon>
        </z-input-group>
      </z-button-group>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucidePlus, lucideAudioLines })],
})
export class ZardDemoButtonGroupInputGroupComponent {
  protected readonly voiceEnabled = signal(false);

  protected toggleVoice(): void {
    this.voiceEnabled.update(value => !value);
  }
}
```

### Dropdown

Create a split button group with a `Dropdown` component.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideChevronDown,
  lucideCopy,
  lucideShare,
  lucideTrash,
  lucideTriangleAlert,
  lucideUserRoundX,
  lucideVolumeOff,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardSeparatorComponent } from '@/shared/components/separator/separator.component';

@Component({
  selector: 'z-demo-button-group-dropdown',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, ZardSeparatorComponent, ...ZardDropdownImports, NgIcon],
  template: `
    <z-button-group>
      <button type="button" z-button zType="outline">Follow</button>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="icon"
        z-dropdown
        [zDropdownMenu]="menu"
        aria-label="More options"
      >
        <ng-icon name="lucideChevronDown" />
      </button>
      <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-44">
        <z-dropdown-menu-item>
          <ng-icon name="lucideVolumeOff" />
          Mute Conversation
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideCheck" />
          Mark as Read
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideTriangleAlert" />
          Report Conversation
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideUserRoundX" />
          Block User
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideShare" />
          Share Conversation
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideCopy" />
          Copy Conversation
        </z-dropdown-menu-item>
        <z-separator class="my-1" />
        <z-dropdown-menu-item variant="destructive">
          <ng-icon name="lucideTrash" />
          Delete Conversation
        </z-dropdown-menu-item>
      </z-dropdown-menu-content>
    </z-button-group>
  `,
  viewProviders: [
    provideIcons({
      lucideChevronDown,
      lucideVolumeOff,
      lucideCheck,
      lucideTriangleAlert,
      lucideUserRoundX,
      lucideShare,
      lucideCopy,
      lucideTrash,
    }),
  ],
})
export class ZardDemoButtonGroupDropdownComponent {}
```

### Select

Pair with a `Select` component.

```angular-ts
import { Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardSelectItemComponent } from '@/shared/components/select/select-item.component';
import { ZardSelectComponent } from '@/shared/components/select/select.component';

@Component({
  selector: 'z-demo-button-group-select',
  imports: [
    ZardButtonGroupComponent,
    ZardButtonComponent,
    ZardInputComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
    NgIcon,
  ],
  template: `
    <z-button-group>
      <z-button-group>
        <z-select [(zValue)]="currency" [zLabel]="currency()" class="w-fit [&_button]:font-mono">
          @for (cur of CURRENCIES; track cur.value) {
            <z-select-item [zValue]="cur.value">
              {{ cur.value }}
              <span class="text-muted-foreground">{{ cur.label }}</span>
            </z-select-item>
          }
        </z-select>
        <input z-input placeholder="10.00" pattern="[0-9]*" />
      </z-button-group>
      <z-button-group>
        <button type="button" z-button zType="outline" zSize="icon" aria-label="Send">
          <ng-icon name="lucideArrowRight" />
        </button>
      </z-button-group>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucideArrowRight })],
})
export class ZardDemoButtonGroupSelectComponent {
  protected readonly CURRENCIES = [
    { value: '$', label: 'US Dollar' },
    { value: '€', label: 'Euro' },
    { value: '£', label: 'British Pound' },
  ];

  protected readonly currency = signal('$');
}
```

### Popover

Use with a `Popover` component.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBot, lucideChevronDown } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardPopoverComponent, ZardPopoverDirective } from '@/shared/components/popover/popover.component';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-button-group-popover',
  imports: [
    ZardButtonGroupComponent,
    ZardButtonComponent,
    ZardPopoverComponent,
    ZardPopoverDirective,
    ZardTextareaComponent,
    ...ZardFieldImports,
    NgIcon,
  ],
  template: `
    <z-button-group>
      <button type="button" z-button zType="outline">
        <ng-icon name="lucideBot" />
        Copilot
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="icon"
        zPopover
        [zContent]="popoverContent"
        zAlign="end"
        aria-label="Open Popover"
      >
        <ng-icon name="lucideChevronDown" />
      </button>
      <ng-template #popoverContent>
        <z-popover class="w-80 rounded-xl p-0 text-sm">
          <div class="border-b px-4 py-3">
            <p class="font-medium">Start a new task with Copilot</p>
            <p class="text-muted-foreground text-sm">Describe your task in natural language.</p>
          </div>
          <div z-field class="p-4">
            <label z-field-label for="task" class="sr-only">Task Description</label>
            <textarea z-textarea id="task" placeholder="I need to..." class="resize-none"></textarea>
            <p z-field-description>Copilot will open a pull request for review.</p>
          </div>
        </z-popover>
      </ng-template>
    </z-button-group>
  `,
  viewProviders: [provideIcons({ lucideBot, lucideChevronDown })],
})
export class ZardDemoButtonGroupPopoverComponent {}
```

## API Reference

### z-button-group

A container that groups related buttons together with consistent styling.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `zOrientation` | Orientation of the button group | `'horizontal' \| 'vertical'` | `'horizontal'` |

### z-button-group-divider

A visual divider between buttons in a group.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `zOrientation` | Override for divider orientation, by default it uses the parent's orientation | `'horizontal' \| 'vertical'` | `null` |

### z-button-group-text

Applies styles to text elements so that they conform with the rest of the group, for example a label.

---

[Open in browser](https://zardui.com/docs/components/button-group)
