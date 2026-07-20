---
title: Input Group
description: Add addons, buttons, and helper content to inputs.
---

# Input Group

Add addons, buttons, and helper content to inputs.

## Installation

### CLI

```bash
npx zard-cli@latest add input-group
```

### Manual

```angular-ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  inputGroupAddonVariants,
  inputGroupButtonVariants,
  inputGroupTextVariants,
  inputGroupVariants,
  type ZardInputGroupAddonAlignVariants,
  type ZardInputGroupButtonSizeVariants,
  type ZardInputGroupButtonVariantVariants,
} from './input-group.variants';

@Component({
  selector: 'z-input-group, [z-input-group]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    'data-slot': 'input-group',
    '[class]': 'classes()',
  },
  exportAs: 'zInputGroup',
})
export class ZardInputGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(inputGroupVariants(), this.class()));
}

@Component({
  selector: 'z-input-group-addon, [z-input-group-addon]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    'data-slot': 'input-group-addon',
    '[attr.data-align]': 'zAlign()',
    '[class]': 'classes()',
    '(click)': 'onClick($event)',
  },
  exportAs: 'zInputGroupAddon',
})
export class ZardInputGroupAddonComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly class = input<ClassValue>('');
  readonly zAlign = input<ZardInputGroupAddonAlignVariants>('inline-start');

  protected readonly classes = computed(() =>
    mergeClasses(inputGroupAddonVariants({ zAlign: this.zAlign() }), this.class()),
  );

  protected onClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }

    const control = this.elementRef.nativeElement.parentElement?.querySelector('input, textarea') as HTMLElement | null;
    control?.focus();
  }
}

@Directive({
  selector: 'button[z-input-group-button]',
  host: {
    type: 'button',
    'data-slot': 'input-group-button',
    '[attr.data-size]': 'zSize()',
    '[class]': 'classes()',
  },
  exportAs: 'zInputGroupButton',
})
export class ZardInputGroupButtonDirective {
  readonly class = input<ClassValue>('');
  readonly zVariant = input<ZardInputGroupButtonVariantVariants>('ghost');
  readonly zSize = input<ZardInputGroupButtonSizeVariants>('xs');

  protected readonly classes = computed(() =>
    mergeClasses(inputGroupButtonVariants({ zVariant: this.zVariant(), zSize: this.zSize() }), this.class()),
  );
}

@Component({
  selector: 'z-input-group-text, span[z-input-group-text]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'input-group-text',
    '[class]': 'classes()',
  },
  exportAs: 'zInputGroupText',
})
export class ZardInputGroupTextComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(inputGroupTextVariants(), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const inputGroupVariants = cva(
  mergeClasses(
    'group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border border-input transition-colors outline-none',
    'has-disabled:bg-input/50 has-disabled:opacity-50',
    'has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50',
    'has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20',
    'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto',
    'dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',
    'has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3',
    'has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5',
    // Input/textarea overrides when used as input-group-control
    '[&>[data-slot=input-group-control]]:flex-1 [&>[data-slot=input-group-control]]:rounded-none [&>[data-slot=input-group-control]]:border-0! [&>[data-slot=input-group-control]]:bg-transparent! [&>[data-slot=input-group-control]]:shadow-none [&>[data-slot=input-group-control]]:ring-0!',
    '[&>[data-slot=input-group-control]:focus-visible]:ring-0! [&>[data-slot=input-group-control][aria-invalid=true]]:ring-0!',
    '[&>textarea[data-slot=input-group-control]]:resize-none [&>textarea[data-slot=input-group-control]]:py-2',
  ),
);

export const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      zAlign: {
        'inline-start': 'order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]',
        'inline-end': 'order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]',
        'block-start':
          'order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2',
        'block-end': 'order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2',
      },
    },
    defaultVariants: {
      zAlign: 'inline-start',
    },
  },
);

export const inputGroupButtonVariants = cva(
  mergeClasses(
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-transparent bg-clip-padding whitespace-nowrap',
    'text-sm font-medium shadow-none transition-all outline-none select-none',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    "shrink-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    'active:not-aria-[haspopup]:translate-y-px',
  ),
  {
    variants: {
      zVariant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        destructive:
          'bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      zSize: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: 'h-8 px-3',
        'icon-xs': 'size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0',
        'icon-sm': 'size-8 p-0 has-[>svg]:p-0',
      },
    },
    defaultVariants: {
      zVariant: 'ghost',
      zSize: 'xs',
    },
  },
);

export const inputGroupTextVariants = cva(
  "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
);

export type ZardInputGroupAddonAlignVariants = NonNullable<VariantProps<typeof inputGroupAddonVariants>['zAlign']>;
export type ZardInputGroupButtonSizeVariants = NonNullable<VariantProps<typeof inputGroupButtonVariants>['zSize']>;
export type ZardInputGroupButtonVariantVariants = NonNullable<
  VariantProps<typeof inputGroupButtonVariants>['zVariant']
>;
```

```angular-ts
export * from './input-group.component';
export * from './input-group.imports';
export * from './input-group.variants';
```

```angular-ts
export {
  ZardInputGroupAddonComponent,
  ZardInputGroupButtonDirective,
  ZardInputGroupComponent,
  ZardInputGroupTextComponent,
} from './input-group.component';

import {
  ZardInputGroupAddonComponent,
  ZardInputGroupButtonDirective,
  ZardInputGroupComponent,
  ZardInputGroupTextComponent,
} from './input-group.component';

export const ZardInputGroupImports = [
  ZardInputGroupComponent,
  ZardInputGroupAddonComponent,
  ZardInputGroupButtonDirective,
  ZardInputGroupTextComponent,
] as const;
```

## Usage

```angular-ts
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
```

```angular-html
<z-input-group>
  <z-input-group-addon>
    <span z-input-group-text>https://</span>
  </z-input-group-addon>
  <input z-input placeholder="example.com" />
</z-input-group>
```

## Examples

### Inline Start

Use `zAlign="inline-start"` to position the addon at the start of the input. This is the default.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

@Component({
  selector: 'z-demo-input-group-inline-start',
  imports: [ZardInputComponent, NgIcon, ...ZardInputGroupImports, ...ZardFieldImports],
  template: `
    <div z-field class="min-w-sm">
      <label z-field-label for="inline-start-input">Input</label>
      <z-input-group>
        <input z-input id="inline-start-input" placeholder="Search..." />
        <z-input-group-addon zAlign="inline-start">
          <ng-icon name="lucideSearch" class="text-muted-foreground" />
        </z-input-group-addon>
      </z-input-group>
      <p z-field-description>Icon positioned at the start.</p>
    </div>
  `,
  viewProviders: [provideIcons({ lucideSearch })],
})
export class ZardDemoInputGroupInlineStartComponent {}
```

### Inline End

Use `zAlign="inline-end"` to position the addon at the end of the input.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEyeOff } from '@ng-icons/lucide';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

@Component({
  selector: 'z-demo-input-group-inline-end',
  imports: [ZardInputComponent, NgIcon, ...ZardInputGroupImports, ...ZardFieldImports],
  template: `
    <div z-field class="min-w-sm">
      <label z-field-label for="inline-end-input">Input</label>
      <z-input-group>
        <input z-input id="inline-end-input" type="password" placeholder="Enter password" />
        <z-input-group-addon zAlign="inline-end">
          <ng-icon name="lucideEyeOff" />
        </z-input-group-addon>
      </z-input-group>
      <p z-field-description>Icon positioned at the end.</p>
    </div>
  `,
  viewProviders: [provideIcons({ lucideEyeOff })],
})
export class ZardDemoInputGroupInlineEndComponent {}
```

### Block Start

Use `zAlign="block-start"` to position the addon above the input.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideFileCode } from '@ng-icons/lucide';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-input-group-block-start',
  imports: [ZardInputComponent, ZardTextareaComponent, NgIcon, ...ZardInputGroupImports, ...ZardFieldImports],
  template: `
    <div z-field-group class="min-w-sm">
      <div z-field>
        <label z-field-label for="block-start-input">Input</label>
        <z-input-group class="h-auto">
          <input z-input id="block-start-input" placeholder="Enter your name" />
          <z-input-group-addon zAlign="block-start">
            <span z-input-group-text>Full Name</span>
          </z-input-group-addon>
        </z-input-group>
        <p z-field-description>Header positioned above the input.</p>
      </div>
      <div z-field>
        <label z-field-label for="block-start-textarea">Textarea</label>
        <z-input-group>
          <textarea
            z-textarea
            id="block-start-textarea"
            placeholder="console.log('Hello, world!');"
            class="font-mono text-sm"
          ></textarea>
          <z-input-group-addon zAlign="block-start">
            <ng-icon name="lucideFileCode" class="text-muted-foreground" />
            <span z-input-group-text class="font-mono">script.js</span>
            <button type="button" z-input-group-button zSize="icon-xs" class="ml-auto">
              <ng-icon name="lucideCopy" />
              <span class="sr-only">Copy</span>
            </button>
          </z-input-group-addon>
        </z-input-group>
        <p z-field-description>Header positioned above the textarea.</p>
      </div>
    </div>
  `,
  viewProviders: [provideIcons({ lucideCopy, lucideFileCode })],
})
export class ZardDemoInputGroupBlockStartComponent {}
```

### Block End

Use `zAlign="block-end"` to position the addon below the input.

```angular-ts
import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-input-group-block-end',
  imports: [ZardInputComponent, ZardTextareaComponent, ...ZardInputGroupImports, ...ZardFieldImports],
  template: `
    <div z-field-group class="min-w-sm">
      <div z-field>
        <label z-field-label for="block-end-input">Input</label>
        <z-input-group class="h-auto">
          <input z-input id="block-end-input" placeholder="Enter amount" />
          <z-input-group-addon zAlign="block-end">
            <span z-input-group-text>USD</span>
          </z-input-group-addon>
        </z-input-group>
        <p z-field-description>Footer positioned below the input.</p>
      </div>
      <div z-field>
        <label z-field-label for="block-end-textarea">Textarea</label>
        <z-input-group>
          <textarea z-textarea id="block-end-textarea" placeholder="Write a comment..."></textarea>
          <z-input-group-addon zAlign="block-end">
            <span z-input-group-text>0/280</span>
            <button z-input-group-button zVariant="default" zSize="sm" class="ml-auto">Post</button>
          </z-input-group-addon>
        </z-input-group>
        <p z-field-description>Footer positioned below the textarea.</p>
      </div>
    </div>
  `,
})
export class ZardDemoInputGroupBlockEndComponent {}
```

### Icon

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCreditCard, lucideInfo, lucideMail, lucideSearch, lucideStar } from '@ng-icons/lucide';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

@Component({
  selector: 'z-demo-input-group-icon',
  imports: [ZardInputComponent, NgIcon, ...ZardInputGroupImports],
  template: `
    <div class="grid w-full min-w-sm gap-6">
      <z-input-group>
        <input z-input placeholder="Search..." />
        <z-input-group-addon>
          <ng-icon name="lucideSearch" />
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <input z-input type="email" placeholder="Enter your email" />
        <z-input-group-addon>
          <ng-icon name="lucideMail" />
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <input z-input placeholder="Card number" />
        <z-input-group-addon>
          <ng-icon name="lucideCreditCard" />
        </z-input-group-addon>
        <z-input-group-addon zAlign="inline-end">
          <ng-icon name="lucideCheck" />
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <input z-input placeholder="Card number" />
        <z-input-group-addon zAlign="inline-end">
          <ng-icon name="lucideStar" />
          <ng-icon name="lucideInfo" />
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
  viewProviders: [provideIcons({ lucideSearch, lucideMail, lucideCreditCard, lucideCheck, lucideStar, lucideInfo })],
})
export class ZardDemoInputGroupIconComponent {}
```

### Text

```angular-ts
import { Component } from '@angular/core';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-input-group-text',
  imports: [ZardInputComponent, ZardTextareaComponent, ...ZardInputGroupImports],
  template: `
    <div class="grid w-full min-w-sm gap-6">
      <z-input-group>
        <z-input-group-addon><span z-input-group-text>$</span></z-input-group-addon>
        <input z-input placeholder="0.00" />
        <z-input-group-addon zAlign="inline-end"><span z-input-group-text>USD</span></z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <z-input-group-addon><span z-input-group-text>https://</span></z-input-group-addon>
        <input z-input placeholder="example.com" class="pl-0.5!" />
        <z-input-group-addon zAlign="inline-end"><span z-input-group-text>.com</span></z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <input z-input placeholder="Enter your username" />
        <z-input-group-addon zAlign="inline-end">
          <span z-input-group-text>&#64;company.com</span>
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <textarea z-textarea placeholder="Enter your message"></textarea>
        <z-input-group-addon zAlign="block-end">
          <span z-input-group-text class="text-muted-foreground text-xs">120 characters left</span>
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
})
export class ZardDemoInputGroupTextComponent {}
```

### Button

```angular-ts
import { Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy, lucideInfo, lucideStar } from '@ng-icons/lucide';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardPopoverComponent, ZardPopoverDirective } from '@/shared/components/popover/popover.component';

@Component({
  selector: 'z-demo-input-group-button',
  imports: [ZardInputComponent, ZardPopoverComponent, ZardPopoverDirective, NgIcon, ...ZardInputGroupImports],
  template: `
    <div class="grid w-full min-w-sm gap-6">
      <z-input-group>
        <input z-input placeholder="https://x.com/shadcn" readonly />
        <z-input-group-addon zAlign="inline-end">
          <button
            type="button"
            z-input-group-button
            zSize="icon-xs"
            aria-label="Copy"
            title="Copy"
            (click)="copy('https://x.com/shadcn')"
          >
            <ng-icon [name]="isCopied() ? 'lucideCheck' : 'lucideCopy'" />
          </button>
        </z-input-group-addon>
      </z-input-group>

      <z-input-group class="[--radius:9999px]">
        <z-input-group-addon>
          <button
            type="button"
            z-input-group-button
            zVariant="secondary"
            zSize="icon-xs"
            zPopover
            [zContent]="popoverContent"
          >
            <ng-icon name="lucideInfo" />
          </button>
        </z-input-group-addon>
        <z-input-group-addon class="text-muted-foreground pl-1.5">https://</z-input-group-addon>
        <input z-input id="input-secure-19" />
        <z-input-group-addon zAlign="inline-end">
          <button type="button" z-input-group-button zSize="icon-xs" (click)="toggleFavorite()">
            <ng-icon
              name="lucideStar"
              [attr.data-favorite]="isFavorite()"
              class="[&_path]:transition-colors data-[favorite=true]:[&_path]:fill-blue-600 data-[favorite=true]:[&_path]:stroke-blue-600"
            />
          </button>
        </z-input-group-addon>
      </z-input-group>

      <z-input-group>
        <input z-input placeholder="Type to search..." />
        <z-input-group-addon zAlign="inline-end">
          <button type="button" z-input-group-button zVariant="secondary">Search</button>
        </z-input-group-addon>
      </z-input-group>

      <ng-template #popoverContent>
        <z-popover class="flex flex-col gap-1 rounded-xl text-sm">
          <p class="font-medium">Your connection is not secure.</p>
          <p>You should not enter any sensitive information on this site.</p>
        </z-popover>
      </ng-template>
    </div>
  `,
  viewProviders: [provideIcons({ lucideCopy, lucideCheck, lucideInfo, lucideStar })],
})
export class ZardDemoInputGroupButtonComponent {
  protected readonly isCopied = signal(false);
  protected readonly isFavorite = signal(false);

  protected copy(text: string): void {
    navigator.clipboard?.writeText(text);
    this.isCopied.set(true);
    setTimeout(() => this.isCopied.set(false), 2000);
  }

  protected toggleFavorite(): void {
    this.isFavorite.update(v => !v);
  }
}
```

### Kbd

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';

@Component({
  selector: 'z-demo-input-group-kbd',
  imports: [ZardInputComponent, ZardKbdComponent, NgIcon, ...ZardInputGroupImports],
  template: `
    <z-input-group class="min-w-sm">
      <input z-input placeholder="Search..." />
      <z-input-group-addon>
        <ng-icon name="lucideSearch" class="text-muted-foreground" />
      </z-input-group-addon>
      <z-input-group-addon zAlign="inline-end">
        <z-kbd>⌘K</z-kbd>
      </z-input-group-addon>
    </z-input-group>
  `,
  viewProviders: [provideIcons({ lucideSearch })],
})
export class ZardDemoInputGroupKbdComponent {}
```

### Dropdown

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideEllipsis } from '@ng-icons/lucide';

import { ZardDropdownImports } from '@/shared/components/dropdown';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

@Component({
  selector: 'z-demo-input-group-dropdown',
  imports: [ZardInputComponent, NgIcon, ZardDropdownImports, ...ZardInputGroupImports],
  template: `
    <div class="grid w-full min-w-sm gap-4">
      <z-input-group>
        <input z-input placeholder="Enter file name" />
        <z-input-group-addon zAlign="inline-end">
          <button
            type="button"
            z-input-group-button
            zSize="icon-xs"
            aria-label="More"
            z-dropdown
            [zDropdownMenu]="moreMenu"
          >
            <ng-icon name="lucideEllipsis" />
          </button>
          <z-dropdown-menu-content #moreMenu="zDropdownMenuContent">
            <z-dropdown-menu-item>Settings</z-dropdown-menu-item>
            <z-dropdown-menu-item>Copy path</z-dropdown-menu-item>
            <z-dropdown-menu-item>Open location</z-dropdown-menu-item>
          </z-dropdown-menu-content>
        </z-input-group-addon>
      </z-input-group>

      <z-input-group class="[--radius:1rem]">
        <input z-input placeholder="Enter search query" />
        <z-input-group-addon zAlign="inline-end">
          <button type="button" z-input-group-button class="pr-1.5! text-xs" z-dropdown [zDropdownMenu]="searchMenu">
            Search In...
            <ng-icon name="lucideChevronDown" class="size-3" />
          </button>
          <z-dropdown-menu-content #searchMenu="zDropdownMenuContent" class="[--radius:0.95rem]">
            <z-dropdown-menu-item>Documentation</z-dropdown-menu-item>
            <z-dropdown-menu-item>Blog Posts</z-dropdown-menu-item>
            <z-dropdown-menu-item>Changelog</z-dropdown-menu-item>
          </z-dropdown-menu-content>
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
  viewProviders: [provideIcons({ lucideEllipsis, lucideChevronDown })],
})
export class ZardDemoInputGroupDropdownComponent {}
```

### Spinner

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoader } from '@ng-icons/lucide';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-input-group-spinner',
  imports: [ZardInputComponent, ZardSpinnerComponent, NgIcon, ...ZardInputGroupImports],
  template: `
    <div class="grid w-full min-w-sm gap-4">
      <z-input-group>
        <input z-input placeholder="Searching..." />
        <z-input-group-addon zAlign="inline-end">
          <z-spinner />
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <input z-input placeholder="Processing..." />
        <z-input-group-addon>
          <z-spinner />
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <input z-input placeholder="Saving changes..." />
        <z-input-group-addon zAlign="inline-end">
          <span z-input-group-text>Saving...</span>
          <z-spinner />
        </z-input-group-addon>
      </z-input-group>
      <z-input-group>
        <input z-input placeholder="Refreshing data..." />
        <z-input-group-addon>
          <ng-icon name="lucideLoader" class="animate-spin" />
        </z-input-group-addon>
        <z-input-group-addon zAlign="inline-end">
          <span z-input-group-text class="text-muted-foreground">Please wait...</span>
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
  viewProviders: [provideIcons({ lucideLoader })],
})
export class ZardDemoInputGroupSpinnerComponent {}
```

### Textarea

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideCornerDownLeft, lucideFileCode2, lucideRefreshCw } from '@ng-icons/lucide';

import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-input-group-textarea',
  imports: [ZardTextareaComponent, NgIcon, ...ZardInputGroupImports],
  template: `
    <div class="grid w-full min-w-md gap-4">
      <z-input-group>
        <textarea
          z-textarea
          id="textarea-code-32"
          placeholder="console.log('Hello, world!');"
          class="min-h-[200px]"
        ></textarea>
        <z-input-group-addon zAlign="block-end" class="border-t">
          <span z-input-group-text>Line 1, Column 1</span>
          <button type="button" z-input-group-button zVariant="default" zSize="sm" class="ml-auto">
            Run
            <ng-icon name="lucideCornerDownLeft" />
          </button>
        </z-input-group-addon>
        <z-input-group-addon zAlign="block-start" class="border-b">
          <span z-input-group-text class="font-mono font-medium">
            <ng-icon name="lucideFileCode2" />
            script.js
          </span>
          <button type="button" z-input-group-button zSize="icon-xs" class="ml-auto" aria-label="Refresh">
            <ng-icon name="lucideRefreshCw" />
          </button>
          <button type="button" z-input-group-button zSize="icon-xs" aria-label="Copy">
            <ng-icon name="lucideCopy" />
          </button>
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
  viewProviders: [provideIcons({ lucideFileCode2, lucideCopy, lucideCornerDownLeft, lucideRefreshCw })],
})
export class ZardDemoInputGroupTextareaComponent {}
```

### Custom

Add the `data-slot="input-group-control"` attribute to your custom input for automatic focus state handling.

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePencil } from '@ng-icons/lucide';

import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

@Component({
  selector: 'z-demo-input-group-custom',
  imports: [NgIcon, ...ZardInputGroupImports],
  template: `
    <z-input-group class="w-80">
      <z-input-group-addon><ng-icon name="lucidePencil" /></z-input-group-addon>
      <input
        data-slot="input-group-control"
        type="text"
        placeholder="Custom input control..."
        class="placeholder:text-muted-foreground bg-transparent text-sm outline-none"
      />
    </z-input-group>
  `,
  viewProviders: [provideIcons({ lucidePencil })],
})
export class ZardDemoInputGroupCustomComponent {}
```

## API Reference

### z-input-group

Container that groups an input or textarea with addons (text, icons, buttons).

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-input-group-addon

A slot inside the group for prefix/suffix content. Clicking it focuses the inner input.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zAlign]` | Addon alignment | `'inline-start' \| 'inline-end' \| 'block-start' \| 'block-end'` | `'inline-start'` |

### button[z-input-group-button]

Compact button styled to fit inside an InputGroup.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zSize]` | Button size | `'xs' \| 'sm' \| 'icon-xs' \| 'icon-sm'` | `'xs'` |

### z-input-group-text

Inline text label inside an addon (e.g. currency symbol, unit suffix).

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/input-group)
