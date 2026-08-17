---
title: Drawer
description: A draggable panel that slides in from an edge of the screen.
---

# Drawer

A draggable panel that slides in from an edge of the screen.

```
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import type { ZardDrawerPlacement } from '@/shared/components/drawer/drawer.variants';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

import { injectIsMobile } from './is-mobile';

const DELIVERY_TIMES = [
  {
    value: 'asap',
    id: 'delivery-asap',
    label: 'Standard delivery',
    description: '25–35 min · Driver assigned now',
    badge: 'Fastest',
  },
  { value: '5-00', id: 'delivery-5-00', label: '5:00 PM – 5:15 PM', description: 'Prep starts at 4:45 PM' },
  { value: '5-30', id: 'delivery-5-30', label: '5:30 PM – 5:45 PM', description: `Good if you're heading home` },
  { value: '6-00', id: 'delivery-6-00', label: '6:00 PM – 6:15 PM', description: 'Most popular · High demand' },
  { value: '6-30', id: 'delivery-6-30', label: '6:30 PM – 6:45 PM', description: 'Last slot before kitchen closes' },
];

@Component({
  imports: [ZardBadgeComponent, ZardButtonComponent, ZardDrawerImports, ...ZardRadioGroupImports],
  template: `
    <button type="button" z-button zType="secondary" (click)="visible.set(true)">Open Drawer</button>

    <z-drawer [(zVisible)]="visible" [zPlacement]="placement()" [zHandle]="isMobile()">
      <z-drawer-header>
        <z-drawer-title>Pick a delivery time</z-drawer-title>
        <z-drawer-description>We'll prepare your order as soon as possible.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 overflow-y-auto p-4">
        <z-radio-group [(value)]="deliveryTime" class="grid w-full gap-2">
          @for (time of times; track time.value) {
            <label
              [for]="time.id"
              class="has-data-[state=checked]:bg-input/30 flex w-full items-center gap-3 rounded-2xl border p-4 select-none"
            >
              <span class="flex flex-1 flex-col gap-1 leading-snug">
                <span class="flex items-center gap-2 text-sm font-medium">
                  {{ time.label }}
                  @if (time.badge) {
                    <z-badge zType="secondary">{{ time.badge }}</z-badge>
                  }
                </span>
                <span class="text-muted-foreground text-sm">{{ time.description }}</span>
              </span>

              <z-radio [zId]="time.id" [value]="time.value" />
            </label>
          }
        </z-radio-group>
      </div>

      <z-drawer-footer>
        <button type="button" z-button (click)="visible.set(false)">Confirm Delivery Time</button>
        <button type="button" z-button zType="ghost" z-drawer-close>Cancel</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerBasicComponent {
  private readonly isMobileViewport = injectIsMobile();

  readonly times = DELIVERY_TIMES;
  readonly visible = signal(false);
  readonly deliveryTime = signal<unknown>('asap');

  /** Bottom sheet where the screen is narrow, side panel where there is room. */
  readonly isMobile = computed(() => this.isMobileViewport());
  readonly placement = computed<ZardDrawerPlacement>(() => (this.isMobile() ? 'bottom' : 'right'));
}
```

## Installation

## Command

```
npx zard-cli@latest add drawer
```

## Usage

```
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
```

```
<button type="button" z-button zType="outline" (click)="visible.set(true)">Open</button>

<z-drawer [(zVisible)]="visible">
  <z-drawer-header>
    <z-drawer-title>Are you absolutely sure?</z-drawer-title>
    <z-drawer-description>This action cannot be undone.</z-drawer-description>
  </z-drawer-header>

  <div class="p-4"><!-- Content here --></div>

  <z-drawer-footer>
    <button type="button" z-button>Submit</button>
    <button type="button" z-button zType="outline" z-drawer-close>Cancel</button>
  </z-drawer-footer>
</z-drawer>
```

## Composition

Use the following composition to build a drawer:

```
z-drawer
├── z-drawer-header
│   ├── z-drawer-title
│   └── z-drawer-description
├── (your content)
└── z-drawer-footer
    └── [z-drawer-close]
```

## Examples

### custom sizes

A vertical drawer sizes itself to its content and is capped at

calc(100dvh - 6rem)

. A side drawer spans 75% of the viewport width, or

24rem

on larger screens. Override either with

class

```
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <div class="flex flex-wrap gap-2">
      <button type="button" z-button zType="secondary" (click)="halfHeight.set(true)">Half height</button>
      <button type="button" z-button zType="secondary" (click)="wideSide.set(true)">Wide side</button>
    </div>

    <z-drawer [(zVisible)]="halfHeight" class="h-[50vh]">
      <z-drawer-header>
        <z-drawer-title>Half height</z-drawer-title>
        <z-drawer-description>The drawer keeps the height you give it.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 overflow-y-auto p-4">
        <div class="bg-muted h-96 w-full rounded-2xl"></div>
      </div>
    </z-drawer>

    <z-drawer [(zVisible)]="wideSide" zPlacement="right" class="sm:w-[32rem]">
      <z-drawer-header>
        <z-drawer-title>Wide side</z-drawer-title>
        <z-drawer-description>A side drawer is 24rem wide until you widen it.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full rounded-2xl"></div>
      </div>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerCustomSizesComponent {
  readonly halfHeight = signal(false);
  readonly wideSide = signal(false);
}
```

### position

Use

zPlacement

to set the side of the drawer. Values are

top

right

bottom

and

left

```
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import type { ZardDrawerPlacement } from '@/shared/components/drawer/drawer.variants';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <div class="flex flex-wrap gap-2">
      @for (option of placements; track option) {
        <button type="button" z-button zType="secondary" class="capitalize" (click)="open(option)">
          {{ option }}
        </button>
      }
    </div>

    <z-drawer [(zVisible)]="visible" [zPlacement]="placement()">
      <z-drawer-header>
        <z-drawer-title>Move Goal</z-drawer-title>
        <z-drawer-description>Set your daily activity goal.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full min-h-40 rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button z-drawer-close>Close</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerPositionComponent {
  readonly placements: ZardDrawerPlacement[] = ['top', 'right', 'bottom', 'left'];

  readonly visible = signal(false);
  readonly placement = signal<ZardDrawerPlacement>('bottom');

  open(placement: ZardDrawerPlacement) {
    this.placement.set(placement);
    this.visible.set(true);
  }
}
```

### swipe handle

Use

zHandle

to render a swipe handle.

```
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <button type="button" z-button zType="secondary" (click)="visible.set(true)">Open Drawer</button>

    <z-drawer [(zVisible)]="visible" zHandle>
      <z-drawer-header>
        <z-drawer-title>Drawer</z-drawer-title>
        <z-drawer-description>Drawer with a swipe handle.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted h-80 w-full rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button z-drawer-close>Close</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerSwipeHandleComponent {
  readonly visible = signal(false);
}
```

### nested

Open drawers from inside another drawer. Parent drawers stay mounted and stack behind the frontmost drawer.

```
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import type { ZardDrawerPlacement } from '@/shared/components/drawer/drawer.variants';

import { injectIsMobile } from './is-mobile';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <button type="button" z-button zType="secondary" (click)="first.set(true)">Open Drawer</button>

    <z-drawer [(zVisible)]="first" [zPlacement]="placement()" [zHandle]="isMobile()">
      <z-drawer-header>
        <z-drawer-title>Drawer</z-drawer-title>
        <z-drawer-description>Open another drawer from the same direction.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full min-h-32 rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button zType="outline" (click)="second.set(true)">Open Nested Drawer</button>
      </z-drawer-footer>
    </z-drawer>

    <z-drawer [(zVisible)]="second" [zPlacement]="placement()" [zHandle]="isMobile()">
      <z-drawer-header>
        <z-drawer-title>Nested Drawer</z-drawer-title>
        <z-drawer-description>The parent drawer stays mounted behind this one.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full min-h-32 rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button zType="outline" (click)="third.set(true)">Open Third Drawer</button>
      </z-drawer-footer>
    </z-drawer>

    <z-drawer [(zVisible)]="third" [zPlacement]="placement()" [zHandle]="isMobile()">
      <z-drawer-header>
        <z-drawer-title>Third Drawer</z-drawer-title>
        <z-drawer-description>Two drawers are stacked behind this one.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full min-h-32 rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button z-drawer-close>Close</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerNestedComponent {
  private readonly isMobileViewport = injectIsMobile();

  readonly first = signal(false);
  readonly second = signal(false);
  readonly third = signal(false);

  readonly isMobile = computed(() => this.isMobileViewport());
  readonly placement = computed<ZardDrawerPlacement>(() => (this.isMobile() ? 'bottom' : 'right'));
}
```

### non modal

Set

[zModal]="false"

to allow interaction with the rest of the page while the drawer is open. A non-modal drawer keeps no mask, so an outside press does not dismiss it.

```
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <button type="button" z-button zType="outline" (click)="visible.set(true)">Non Modal</button>

    <z-drawer [(zVisible)]="visible" zPlacement="right" [zModal]="false">
      <z-drawer-header>
        <z-drawer-title>Non Modal Drawer</z-drawer-title>
        <z-drawer-description>The page behind stays scrollable and clickable.</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 p-4">
        <div class="bg-muted size-full rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button z-drawer-close>Close</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerNonModalComponent {
  readonly visible = signal(false);
}
```

### snap points

Use

zSnapPoints

to snap a drawer to preset heights. Numbers between

0

and

1

represent fractions of the viewport. Numbers greater than

1

are treated as pixel values. String values support

px

and

rem

units. Snap points apply to vertical drawers. Track the active one with

[(zSnapPoint)]

; at the largest snap point the drawer gets a

data-expanded

attribute you can style against.

```
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import type { ZardDrawerSnapPoint } from '@/shared/components/drawer/drawer.utils';

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports],
  template: `
    <button type="button" z-button zType="outline" (click)="visible.set(true)">Open Snap Drawer</button>

    <z-drawer [(zVisible)]="visible" [zSnapPoints]="snapPoints" [(zSnapPoint)]="snapPoint" zHandle>
      <z-drawer-header>
        <z-drawer-title>Snap points</z-drawer-title>
        <z-drawer-description>
          Drag the drawer to snap between a compact peek and a near full-height view.
        </z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 touch-pan-y overflow-y-auto p-4">
        <div class="bg-muted h-80 w-full rounded-2xl"></div>
      </div>

      <z-drawer-footer>
        <button type="button" z-button z-drawer-close>Close</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerSnapPointsComponent {
  readonly snapPoints: ZardDrawerSnapPoint[] = ['31rem', 1];

  readonly visible = signal(false);
  readonly snapPoint = signal<ZardDrawerSnapPoint | undefined>('31rem');
}
```

### responsive

You can combine the Dialog and Drawer components to create a responsive dialog. This renders a Dialog on desktop and a Drawer on mobile.

```
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDialogService } from '@/shared/components/dialog';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import { ZardInputComponent } from '@/shared/components/input';

import { injectIsMobile } from './is-mobile';

@Component({
  selector: 'zard-demo-drawer-profile-form',
  imports: [ZardButtonComponent, ZardInputComponent],
  template: `
    <form class="grid items-start gap-6">
      <div class="grid gap-3">
        <label for="drawer-demo-email" class="text-sm leading-none font-medium select-none">Email</label>
        <input z-input id="drawer-demo-email" type="email" value="shadcn@example.com" />
      </div>

      <div class="grid gap-3">
        <label for="drawer-demo-username" class="text-sm leading-none font-medium select-none">Username</label>
        <input z-input id="drawer-demo-username" value="@shadcn" />
      </div>

      <button type="submit" z-button>Save changes</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerProfileFormComponent {}

@Component({
  imports: [ZardButtonComponent, ZardDrawerImports, ZardDemoDrawerProfileFormComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="open()">Edit Profile</button>

    <z-drawer [(zVisible)]="visible">
      <z-drawer-header>
        <z-drawer-title>Edit profile</z-drawer-title>
        <z-drawer-description>Make changes to your profile here. Click save when you're done.</z-drawer-description>
      </z-drawer-header>

      <div class="p-4">
        <zard-demo-drawer-profile-form />
      </div>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerResponsiveComponent {
  private readonly dialogService = inject(ZardDialogService);
  private readonly isMobile = injectIsMobile();

  readonly visible = signal(false);

  /** Same content, two surfaces: a dialog where there is room, a drawer where there is not. */
  open() {
    if (this.isMobile()) {
      this.visible.set(true);
      return;
    }

    this.dialogService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoDrawerProfileFormComponent,
      zOkText: null,
      zCancelText: null,
    });
  }
}
```

### service

Use

ZardDrawerService.create()

when the drawer is opened from code instead of from a template.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDrawerService } from '@/shared/components/drawer/drawer.service';
import { ZardInputComponent } from '@/shared/components/input';

@Component({
  selector: 'zard-demo-drawer-service-form',
  imports: [ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid gap-4 px-4">
      <div class="grid gap-3">
        <label for="drawer-service-name" class="text-sm leading-none font-medium select-none">Name</label>
        <input z-input id="drawer-service-name" formControlName="name" />
      </div>

      <div class="grid gap-3">
        <label for="drawer-service-goal" class="text-sm leading-none font-medium select-none">Daily goal</label>
        <input z-input id="drawer-service-goal" type="number" formControlName="goal" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerServiceFormComponent {
  readonly form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    goal: new FormControl(350),
  });
}

@Component({
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="openDrawer()">Open from a service</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerServiceComponent {
  private readonly drawerService = inject(ZardDrawerService);

  openDrawer() {
    this.drawerService.create({
      zTitle: 'Move goal',
      zDescription: 'Set your daily activity goal.',
      zContent: ZardDemoDrawerServiceFormComponent,
      zOkText: 'Submit',
      zCancelText: 'Cancel',
      zOnOk: instance => {
        console.log('Goal submitted:', instance.form.value);
      },
    });
  }
}
```

## API Reference

z-drawer Component

Root of a declarative drawer. Holds the open state and hosts the projected content. The panel exposes `data-placement`, `data-axis`, `data-state`, `data-swiping`, `data-snap-points` and `data-expanded`, plus a `--z-drawer-bleed` variable that fills the inset gap for an edge-to-edge look.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| `zVisible` | Open state, two-way bound | `boolean` | `false` |
| `zPlacement` | Edge of the screen the drawer slides from | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| `zSnapPoints` | Sizes the drawer rests at. 0–1 is a fraction of the viewport, above that pixels, strings keep their CSS unit | `(number \| string)[]` | `-` |
| `zSnapPoint` | Active snap point, two-way bound. Defaults to the first one | `number \| string` | `-` |
| `zDismissible` | Whether swiping, the mask and Escape can close the drawer | `boolean` | `true` |
| `zHandle` | Renders the swipe handle | `boolean` | `false` |
| `zModal` | Renders the mask and blocks the page behind. Set false for a non-modal drawer | `boolean` | `true` |
| `class` | Custom CSS classes applied to the panel | `ClassValue` | `-` |
| `zAfterOpen` | Emitted once the drawer is attached | `OutputRef<void>` | `-` |
| `zAfterClose` | Emitted once the exit animation has finished | `OutputRef<void>` | `-` |

z-drawer-header / z-drawer-footer Component

Layout slots for the top and bottom of a drawer.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Custom CSS classes to apply | `ClassValue` | `-` |

z-drawer-title Component

Accessible name of the drawer. Wired to `aria-labelledby` automatically.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| `zTitle` | Title text or template, when not projecting content | `string \| TemplateRef<void>` | `-` |
| `class` | Custom CSS classes to apply | `ClassValue` | `-` |

z-drawer-description Component

Supporting text. Wired to `aria-describedby` automatically.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| `zDescription` | Description text or template, when not projecting content | `string \| TemplateRef<void>` | `-` |
| `class` | Custom CSS classes to apply | `ClassValue` | `-` |

[z-drawer-close]Component

Closes the drawer it is projected into. Works for declarative and service-opened drawers alike.

ZardDrawerOptions Component

Configuration accepted by `ZardDrawerService.create()`.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| `zTitle` | Drawer title text or template | `string \| TemplateRef<void>` | `-` |
| `zDescription` | Drawer description text or template | `string \| TemplateRef<void>` | `-` |
| `zContent` | Custom content component, template, or HTML | `string \| TemplateRef<T> \| Type<T>` | `-` |
| `zPlacement` | Edge of the screen the drawer slides from | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| `zSnapPoints` | Sizes the drawer rests at | `(number \| string)[]` | `-` |
| `zSnapPoint` | Snap point the drawer opens at | `number \| string` | `-` |
| `zDismissible` | Whether swiping, the mask and Escape can close the drawer | `boolean` | `true` |
| `zHandle` | Renders the swipe handle | `boolean` | `false` |
| `zMask` | Renders the backdrop and blocks the page behind. Set false for a non-modal drawer | `boolean` | `true` |
| `zMaskClosable` | Whether clicking outside closes the drawer | `boolean` | `true` |
| `zClosable` | Whether to show the close button | `boolean` | `true` |
| `zDuration` | Exit animation duration in ms | `number` | `450` |
| `zOkText` | OK button text, null to hide button | `string \| null` | `'OK'` |
| `zCancelText` | Cancel button text, null to hide button | `string \| null` | `'Cancel'` |
| `zOkIcon` | OK button icon — registered icon name or inline SVG string | `string` | `-` |
| `zCancelIcon` | Cancel button icon — registered icon name or inline SVG string | `string` | `-` |
| `zOkDestructive` | Whether OK button should have destructive styling | `boolean` | `false` |
| `zOkDisabled` | Whether OK button should be disabled | `boolean` | `false` |
| `zHideFooter` | Whether to hide the footer with action buttons | `boolean` | `false` |
| `zCustomClasses` | Additional CSS classes to apply | `ClassValue` | `-` |
| `zOnOk` | OK button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `zOnCancel` | Cancel button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `zData` | Data to pass to custom content components | `object` | `-` |
| `zViewContainerRef` | View container for rendering custom content | `ViewContainerRef` | `-` |

ZardDrawerRef Component

Reference returned by `ZardDrawerService.create()`, used to observe and close the drawer.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| `close` | Closes the drawer, optionally with a result | `(result?: R) => void` | `-` |
| `isClosing` | Signal that turns true once the drawer starts closing | `Signal<boolean>` | `false` |
| `result` | Signal holding the result passed to close() | `Signal<R \| undefined>` | `undefined` |
| `componentInstance` | Signal with the instance of the component rendered as content | `Signal<T \| null>` | `null` |
