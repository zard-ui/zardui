---
title: Kbd
description: Used to display textual user input from keyboard.
---

# Kbd

Used to display textual user input from keyboard.

## Installation

### CLI

```bash
npx zard-cli@latest add kbd
```

### Manual

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { kbdVariants } from './kbd.variants';

@Component({
  selector: 'z-kbd, [z-kbd]',
  template: `
    <kbd data-slot="kbd" [class]="classes()"><ng-content /></kbd>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zKbd',
})
export class ZardKbdComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(kbdVariants(), this.class()));
}
```

```angular-ts
import { cva } from 'class-variance-authority';

export const kbdVariants = cva(
  `pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3`,
);

export const kbdGroupVariants = cva(`inline-flex items-center gap-1`);
```

```angular-ts
export * from './kbd-group.component';
export * from './kbd.component';
export * from './kbd.imports';
export * from './kbd.variants';
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { type ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { kbdGroupVariants } from './kbd.variants';

@Component({
  selector: 'z-kbd-group, [z-kbd-group]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    'data-slot': 'kbd-group',
  },
  exportAs: 'zKbdGroup',
})
export class ZardKbdGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(kbdGroupVariants(), this.class()));
}
```

```angular-ts
/*
 * The alias, not a relative path: the Angular compiler re-emits these imports from
 * whichever module spreads the array, and it can only do that for a specifier the
 * consumer can resolve too. A relative path here fails with NG3004.
 */
import { ZardKbdGroupComponent } from '@/shared/components/kbd/kbd-group.component';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';

/** Every part of the kbd component, for a template that uses more than one. */
export const ZardKbdImports = [ZardKbdComponent, ZardKbdGroupComponent] as const;
```

## Usage

```angular-ts
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';
```

```angular-html
<z-kbd>⌘ K</z-kbd>
```

## Examples

### Group

Wrap several `z-kbd` elements (and any surrounding text) in `z-kbd-group` to keep a multi-key shortcut or an inline instruction aligned and spaced as one unit.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardKbdGroupComponent } from '../kbd-group.component';
import { ZardKbdComponent } from '../kbd.component';

@Component({
  selector: 'z-demo-kbd-group',
  imports: [ZardKbdGroupComponent, ZardKbdComponent],
  template: `
    <z-kbd-group class="text-muted-foreground text-sm">
      Use
      <z-kbd>Ctrl + B</z-kbd>
      <z-kbd>Ctrl + K</z-kbd>
      to open command palette
    </z-kbd-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoKbdGroupComponent {}
```

### Button

Project a `z-kbd` inside `button[z-button]` to show the key that triggers the action.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCornerDownLeft } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';

@Component({
  selector: 'z-demo-kbd-button',
  imports: [NgIcon, ZardKbdComponent, ZardButtonComponent],
  template: `
    <div class="flex flex-col items-center justify-center gap-4">
      <button type="submit" z-button zType="outline">
        Accept
        <z-kbd>
          <ng-icon name="lucideCornerDownLeft" strokeWidth="3" />
        </z-kbd>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCornerDownLeft })],
})
export class ZardDemoKbdButtonComponent {}
```

### Tooltip

Compose `z-kbd` and `z-kbd-group` inside the `ng-template` passed to `[zTooltip]` to show the shortcut for an action; `z-kbd` detects the tooltip content data-slot and switches to a transparent, tooltip-matching background automatically.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardButtonGroupComponent } from '@/shared/components/button-group';
import { ZardKbdGroupComponent } from '@/shared/components/kbd/kbd-group.component';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';
import { ZardTooltipDirective } from '@/shared/components/tooltip';

@Component({
  selector: 'z-demo-kbd-tooltip',
  imports: [
    ZardButtonComponent,
    ZardButtonGroupComponent,
    ZardTooltipDirective,
    ZardKbdGroupComponent,
    ZardKbdComponent,
  ],
  template: `
    <z-button-group>
      <button type="button" z-button zType="outline" [zTooltip]="saveTip">Save</button>
      <button type="button" z-button zType="outline" [zTooltip]="printTip">Print</button>
    </z-button-group>

    <ng-template #saveTip>
      Save changes
      <z-kbd>S</z-kbd>
    </ng-template>

    <ng-template #printTip>
      Print document
      <z-kbd-group>
        <z-kbd>Ctrl</z-kbd>
        <z-kbd>P</z-kbd>
      </z-kbd-group>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoKbdTooltipComponent {}
```

### Input Group

Compose `z-kbd` inside a `z-input-group-addon` (aligned `inline-end`) next to `input[z-input]` to hint at the shortcut that focuses the field, such as ⌘K for a search box.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';

@Component({
  selector: 'z-demo-kbd-input-group',
  imports: [ZardInputComponent, ZardKbdComponent, NgIcon, ...ZardInputGroupImports],
  template: `
    <z-input-group class="min-w-sm">
      <input z-input id="kbd-input-group-search" placeholder="Search..." />
      <z-input-group-addon>
        <ng-icon name="lucideSearch" class="text-muted-foreground" />
      </z-input-group-addon>
      <z-input-group-addon zAlign="inline-end">
        <z-kbd>⌘</z-kbd>
        <z-kbd>K</z-kbd>
      </z-input-group-addon>
    </z-input-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideSearch })],
})
export class ZardDemoKbdInputGroupComponent {}
```

## API Reference

### z-kbd

Displays a keyboard key.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-kbd-group

Groups z-kbd components together.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/kbd)
