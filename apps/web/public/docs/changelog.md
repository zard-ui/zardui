---
title: Changelog
description: Latest updates, new components, and improvements to ZardUI.
---

# Changelog

Latest updates, new components, and improvements to ZardUI.

## August 2026

One-time passwords land this month. We added the Input OTP component, with grouped slots, separators, pattern validation, and paste support out of the box.

### New Components

#### input-otp

## Run the CLI

Use the CLI to add input-otp to your project.

```
npx zard-cli@latest add input-otp
```

Accessible one-time password input with grouped slots, custom separators, and copy-paste support.

```
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-preview',
  imports: [ZardInputOtpImports, FormsModule],
  template: `
    <z-input-otp [zMaxLength]="6" [(ngModel)]="value">
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="0" />
        <z-input-otp-slot [zIndex]="1" />
        <z-input-otp-slot [zIndex]="2" />
        <z-input-otp-slot [zIndex]="3" />
        <z-input-otp-slot [zIndex]="4" />
        <z-input-otp-slot [zIndex]="5" />
      </z-input-otp-group>
    </z-input-otp>
  `,
})
export class ZardDemoInputOtpPreviewComponent {
  value = '123456';
}
```

## July 2026

Four new components this month — Field, Item, Textarea, and Sonner — and a reorganisation that moved every demo and API doc next to the component it documents.

### Highlights

#### Toast is now Sonner

The `toast` component has been replaced by `sonner`. Swap `z-toast` / `z-toaster` for `z-sonner`, import `ZardSonnerService` instead of the toast service, and reinstall under the new name. The old component no longer ships.

npx zard-cli@latest add sonner

#### Demos and docs live with the components

Every demo, API reference, and overview moved from the documentation site into `libs/zard/.../components/<name>/`. Nothing changes for you as a consumer — the CLI and the registry are unaffected — but contributing a component is now a single folder.

### New Components

#### field

## Run the CLI

Use the CLI to add field to your project.

```
npx zard-cli@latest add field
```

Composable building blocks for accessible forms, pairing a control with its label, description, and error message.

Payment Method

All transactions are secure and encrypted.

Name on Card

Card Number

Enter your 16-digit card number.

Month

Year

CVV

Billing Address

The billing address associated with your payment method.

Same as shipping address

Comments

```
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardSelectImports } from '@/shared/components/select/select.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-field-default',
  imports: [
    ...ZardFieldImports,
    ZardButtonComponent,
    ZardCheckboxComponent,
    ZardInputComponent,
    ZardTextareaComponent,
    ZardSelectImports,
    FormsModule,
  ],
  template: `
    <div class="w-full min-w-md">
      <form>
        <div z-field-group>
          <fieldset z-field-set>
            <legend z-field-legend>Payment Method</legend>
            <p z-field-description>All transactions are secure and encrypted.</p>

            <div z-field-group>
              <div z-field>
                <label z-field-label for="checkout-card-name">Name on Card</label>
                <input z-input id="checkout-card-name" placeholder="Evil Rabbit" zSize="sm" required />
              </div>

              <div z-field>
                <label z-field-label for="checkout-card-number">Card Number</label>
                <input z-input id="checkout-card-number" placeholder="1234 5678 9012 3456" zSize="sm" required />
                <p z-field-description>Enter your 16-digit card number.</p>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div z-field>
                  <label z-field-label for="checkout-exp-month" class="w-fit">Month</label>
                  <z-select id="checkout-exp-month" zPlaceholder="MM" zSize="sm">
                    <z-select-item zValue="01">01</z-select-item>
                    <z-select-item zValue="02">02</z-select-item>
                    <z-select-item zValue="03">03</z-select-item>
                    <z-select-item zValue="04">04</z-select-item>
                    <z-select-item zValue="05">05</z-select-item>
                    <z-select-item zValue="06">06</z-select-item>
                    <z-select-item zValue="07">07</z-select-item>
                    <z-select-item zValue="08">08</z-select-item>
                    <z-select-item zValue="09">09</z-select-item>
                    <z-select-item zValue="10">10</z-select-item>
                    <z-select-item zValue="11">11</z-select-item>
                    <z-select-item zValue="12">12</z-select-item>
                  </z-select>
                </div>
                <div z-field>
                  <label z-field-label for="checkout-exp-year">Year</label>
                  <z-select id="checkout-exp-year" zPlaceholder="YYYY" zSize="sm">
                    <z-select-item zValue="2024">2024</z-select-item>
                    <z-select-item zValue="2025">2025</z-select-item>
                    <z-select-item zValue="2026">2026</z-select-item>
                    <z-select-item zValue="2027">2027</z-select-item>
                    <z-select-item zValue="2028">2028</z-select-item>
                    <z-select-item zValue="2029">2029</z-select-item>
                  </z-select>
                </div>
                <div z-field>
                  <label z-field-label for="checkout-cvv">CVV</label>
                  <input z-input id="checkout-cvv" placeholder="123" zSize="sm" required />
                </div>
              </div>
            </div>
          </fieldset>

          <z-field-separator />

          <fieldset z-field-set>
            <legend z-field-legend>Billing Address</legend>
            <p z-field-description>The billing address associated with your payment method.</p>

            <div z-field-group>
              <div z-field zOrientation="horizontal">
                <span
                  z-checkbox
                  zId="checkout-same-as-shipping"
                  [(ngModel)]="sameAsShipping"
                  name="sameAsShipping"
                ></span>
                <label z-field-label for="checkout-same-as-shipping" class="font-normal">
                  Same as shipping address
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset z-field-set>
            <div z-field-group>
              <div z-field>
                <label z-field-label for="checkout-comments">Comments</label>
                <textarea
                  z-textarea
                  id="checkout-comments"
                  placeholder="Add any additional comments"
                  class="resize-none"
                ></textarea>
              </div>
            </div>
          </fieldset>

          <div z-field zOrientation="horizontal">
            <button z-button type="submit">Submit</button>
            <button z-button zType="outline" type="button">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldDefaultComponent {
  protected sameAsShipping = true;
}
```

#### item

## Run the CLI

Use the CLI to add item to your project.

```
npx zard-cli@latest add item
```

A versatile row for displaying media, a title, a description, and actions side by side.

Basic Item

A simple item with title and description.

Your profile has been verified.

```
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideChevronRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';

@Component({
  selector: 'z-demo-item-default',
  imports: [ZardButtonComponent, NgIcon, ...ZardItemImports],
  template: `
    <div class="flex w-full min-w-md flex-col gap-6">
      <z-item zVariant="outline">
        <z-item-content>
          <z-item-title>Basic Item</z-item-title>
          <z-item-description>A simple item with title and description.</z-item-description>
        </z-item-content>
        <z-item-actions>
          <button type="button" z-button zType="outline" zSize="sm">Action</button>
        </z-item-actions>
      </z-item>

      <a z-item href="#" zVariant="outline" zSize="sm">
        <z-item-media>
          <ng-icon name="lucideBadgeCheck" size="1.25rem" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Your profile has been verified.</z-item-title>
        </z-item-content>
        <z-item-actions>
          <ng-icon name="lucideChevronRight" size="1rem" />
        </z-item-actions>
      </a>
    </div>
  `,
  viewProviders: [provideIcons({ lucideBadgeCheck, lucideChevronRight })],
})
export class ZardDemoItemDefaultComponent {}
```

#### textarea

## Run the CLI

Use the CLI to add textarea to your project.

```
npx zard-cli@latest add textarea
```

Multi-line text input with the same variants, sizes, and validation states as the single-line input.

```
import { Component } from '@angular/core';

import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-default',
  imports: [ZardTextareaComponent],
  template: `
    <textarea z-textarea placeholder="Type your message here." class="w-72"></textarea>
  `,
})
export class ZardDemoTextareaDefaultComponent {}
```

#### sonner

## Run the CLI

Use the CLI to add sonner to your project.

```
npx zard-cli@latest add sonner
```

An opinionated toast component with stacking, positioning, and per-type styling. Replaces the old toast.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'zard-demo-sonner-default',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="show()">Show Toast</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSonnerDefaultComponent {
  private readonly sonner = inject(ZardSonnerService);

  show() {
    this.sonner.show('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo'),
      },
    });
  }
}
```

## May 2026

A quieter month focused on form correctness. We taught the input directive to speak numbers, and we changed one dialog default that had been surprising people.

### Highlights

#### Numeric inputs keep their type

The input directive now reads and writes real numbers for `type="number"` and `type="range"`, so a signal or reactive form typed as `number` stays a number instead of being turned into a string. An empty field resolves to `null`.

#### Alert Dialog no longer closes on the backdrop

`zMaskClosable` now defaults to `false` on Alert Dialog. A confirmation is meant to be answered, not dismissed by a stray click. If you relied on the old behaviour, opt back in explicitly.

zMaskClosable: true

## March 2026

Complete icon system migration! We replaced the custom `ZardIconComponent` with `@ng-icons/lucide`, bringing better tree-shaking, a wider icon selection, and a simpler API across all components.

### Highlights

#### Migration to @ng-icons/lucide

All components now use `NgIcon` from `@ng-icons/core` with icons sourced from `@ng-icons/lucide`. This replaces the deprecated `ZardIconComponent` and the custom icon registry, resulting in better tree-shaking and smaller bundle sizes.

#### New Icon API

Icons are now provided at component level using `provideIcons()` in `viewProviders` and rendered with `<ng-icon name="lucideIconName" />`. Import only the icons you need from `@ng-icons/lucide`.

#### Updated Dependencies

The `lucide-angular` dependency has been replaced by `@ng-icons/core` and `@ng-icons/lucide`. The CLI `init` command now installs these automatically.

npm install @ng-icons/core @ng-icons/lucide

## December 2025

Major infrastructure improvements this month! We focused on developer experience with a new provider system, CLI enhancements with our own private registry, and streamlined dark-mode setup.

### Highlights

#### provideZard()

New provider function for streamlined app configuration. Add event manager plugins and other Zard utilities with a single function call in your app.config.ts.

provideZard()

#### Private Registry System

The CLI now uses our own private registry instead of fetching from GitHub. This brings significant performance improvements, better version control, and more reliable component installations.

#### Dark Mode via CLI

Adding dark-mode support to your project is now as simple as running a single CLI command. It automatically configures everything you need.

npx zard-cli@latest add dark-mode

## November 2025

Major updates this month with new interactive components including Carousel, Button Group, Input Group, and Kbd components. Enhanced user experience with better form controls and keyboard navigation support.

### New Components

#### carousel

## Run the CLI

Use the CLI to add carousel to your project.

```
npx zard-cli@latest add carousel
```

A slideshow component for cycling through elements with support for mouse drag, touch swipe, and automatic playback.

1

2

3

4

5

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';

@Component({
  imports: [ZardCarouselImports, ZardCardImports],
  template: `
    <div class="w-full max-w-[12rem] sm:max-w-xs">
      <z-carousel>
        <z-carousel-content>
          @for (slide of slides; track slide) {
            <z-carousel-item>
              <div class="p-1">
                <z-card>
                  <z-card-content class="flex aspect-square items-center justify-center p-6">
                    <span class="text-4xl font-semibold">{{ slide }}</span>
                  </z-card-content>
                </z-card>
              </div>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCarouselPreviewComponent {
  protected slides = ['1', '2', '3', '4', '5'];
}
```

#### kbd

## Run the CLI

Use the CLI to add kbd to your project.

```
npx zard-cli@latest add kbd
```

Display keyboard keys and shortcuts in a visually consistent way.

Ctrl

B

```
import { Component } from '@angular/core';

import { ZardKbdGroupComponent } from '@/shared/components/kbd/kbd-group.component';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';

@Component({
  selector: 'z-demo-kbd-default',
  imports: [ZardKbdComponent, ZardKbdGroupComponent],
  template: `
    <div class="flex flex-col items-center justify-center gap-4">
      <z-kbd-group>
        <z-kbd>⌘</z-kbd>
        <z-kbd>⇧</z-kbd>
        <z-kbd>⌥</z-kbd>
        <z-kbd>⌃</z-kbd>
      </z-kbd-group>
      <z-kbd-group>
        <z-kbd>Ctrl</z-kbd>
        <span>+</span>
        <z-kbd>B</z-kbd>
      </z-kbd-group>
    </div>
  `,
})
export class ZardDemoKbdDefaultComponent {}
```

## October 2025

Breaking changes with icons migration from lucide-static to lucide-angular for better performance. New layout components including Sheet and Empty state component for better UX.

### New Components

#### sheet

## Run the CLI

Use the CLI to add sheet to your project.

```
npx zard-cli@latest add sheet
```

A versatile sheet component for side panels and overlays with customizable positioning and smooth transitions.

```
import { ChangeDetectionStrategy, Component, inject, type AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { lucideSave } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputComponent } from '@/shared/components/input';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { Z_SHEET_DATA, ZardSheetService } from '@/shared/components/sheet/sheet.service';

interface iSheetData {
  name: string;
  username: string;
}

@Component({
  selector: 'zard-demo-sheet-basic',
  imports: [FormsModule, ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <label
          for="name"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          Name
        </label>
        <input
          z-input
          formControlName="name"
          class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
      </div>

      <div class="grid gap-3">
        <label
          for="username"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          Username
        </label>
        <input
          z-input
          formControlName="username"
          class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoSheetBasic',
})
export class ZardDemoSheetBasicInputComponent implements AfterViewInit {
  private zData: iSheetData = inject(Z_SHEET_DATA);

  form = new FormGroup({
    name: new FormControl(''),
    username: new FormControl(''),
  });

  ngAfterViewInit(): void {
    if (this.zData) {
      this.form.patchValue(this.zData);
    }
  }
}

@Component({
  imports: [ZardButtonComponent, ZardSheetImports],
  template: `
    <button type="button" z-button zType="outline" (click)="openSheet()">Edit profile</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetBasicComponent {
  private sheetService = inject(ZardSheetService);

  openSheet() {
    this.sheetService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoSheetBasicInputComponent,
      zData: {
        name: 'Matheus Ribeiro',
        username: '@ribeiromatheus.dev',
      },
      zOkText: 'Save changes',
      zOkIcon: lucideSave,
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
    });
  }
}
```

#### empty

## Run the CLI

Use the CLI to add empty to your project.

```
npx zard-cli@latest add empty
```

Clean empty state component for "no data" scenarios with customizable messages and icons.

No Projects Yet

You haven't created any projects yet. Get started by creating your first project.

Learn More

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideFolderCode } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';

@Component({
  selector: 'z-demo-empty-preview',
  imports: [ZardButtonComponent, ZardEmptyComponent, NgIcon],
  template: `
    <z-empty
      zIcon="lucideFolderCode"
      zTitle="No Projects Yet"
      zDescription="You haven't created any projects yet. Get started by creating your first project."
      [zActions]="[actionPrimary, actionSecondary]"
    >
      <ng-template #actionPrimary>
        <button type="button" z-button>Create Project</button>
      </ng-template>

      <ng-template #actionSecondary>
        <button type="button" z-button zType="outline">Import Project</button>
      </ng-template>

      <a z-button zType="link" zSize="sm" class="text-muted-foreground" href="#">
        Learn More
        <ng-icon name="lucideArrowUpRight" />
      </a>
    </z-empty>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArrowUpRight,
      lucideFolderCode,
    }),
  ],
})
export class ZardDemoEmptyPreviewComponent {}
```

## September 2025

Focus on loading and feedback components this month. New Progress, Skeleton, and Loader components for better perceived performance and user feedback during async operations.

### New Components

#### progress

## Run the CLI

Use the CLI to add progress to your project.

```
npx zard-cli@latest add progress
```

Visual progress indicator showing the completion progress of a task.

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

#### skeleton

## Run the CLI

Use the CLI to add skeleton to your project.

```
npx zard-cli@latest add skeleton
```

Loading placeholder component for better perceived performance during content loading with pulse animation.

```
import { Component } from '@angular/core';

import { ZardSkeletonComponent } from '../skeleton.component';

@Component({
  selector: 'z-demo-skeleton-default',
  imports: [ZardSkeletonComponent],
  standalone: true,
  template: `
    <div class="flex items-center space-x-4">
      <z-skeleton class="size-12 rounded-full" />
      <div class="space-y-2">
        <z-skeleton class="h-4 w-[250px]" />
        <z-skeleton class="h-4 w-[200px]" />
      </div>
    </div>
  `,
})
export class ZardDemoSkeletonDefaultComponent {}
```

#### spinner

## Run the CLI

Use the CLI to add spinner to your project.

```
npx zard-cli@latest add spinner
```

Animated loading spinner customizable via the [zIcon] template input for swapping the underlying icon.

```
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

## August 2025

Enhanced navigation and display components. New Avatar component with fallback support, Divider for content separation, and Breadcrumb for hierarchical navigation.

### New Components

#### avatar

## Run the CLI

Use the CLI to add avatar to your project.

```
npx zard-cli@latest add avatar
```

User profile image component with automatic fallback to initials and multiple size variants.

```
import { Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-basic',
  imports: [ZardAvatarComponent],
  template: `
    <div class="mb-4 flex gap-3">
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="ZA" />
      <z-avatar zSrc="error-image.png" zFallback="ZA" />
    </div>
  `,
})
export class ZardDemoAvatarBasicComponent {}
```

#### separator

## Run the CLI

Use the CLI to add separator to your project.

```
npx zard-cli@latest add separator
```

Visual separator component for separating content sections with horizontal and vertical orientations.

Zard/ui

The Next Level for Your Angular Projects

A set of beautifully designed components that you can customize, extend, and build on.

```
import { Component } from '@angular/core';

import { ZardSeparatorComponent } from '../separator.component';

@Component({
  selector: 'z-demo-separator-preview',
  imports: [ZardSeparatorComponent],
  standalone: true,
  template: `
    <div class="flex max-w-sm flex-col gap-4 text-sm">
      <div class="flex flex-col gap-1.5">
        <div class="leading-none font-medium">Zard/ui</div>
        <div class="text-muted-foreground">The Next Level for Your Angular Projects</div>
      </div>
      <z-separator />
      <div>A set of beautifully designed components that you can customize, extend, and build on.</div>
    </div>
  `,
})
export class ZardDemoSeparatorPreviewComponent {}
```

#### breadcrumb

## Run the CLI

Use the CLI to add breadcrumb to your project.

```
npx zard-cli@latest add breadcrumb
```

Navigation breadcrumb trail showing the current page location within a hierarchical structure.

```
import { Component } from '@angular/core';

import { ZardBreadcrumbImports } from '../breadcrumb.imports';

@Component({
  selector: 'z-demo-breadcrumb-default',
  imports: [ZardBreadcrumbImports],
  template: `
    <z-breadcrumb zLabel="Default breadcrumb">
      <z-breadcrumb-item>
        <a z-breadcrumb-link [routerLink]="['/']">Home</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <a z-breadcrumb-link [routerLink]="['/docs/components']">Components</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <span z-breadcrumb-page>Breadcrumb</span>
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
})
export class ZardDemoBreadcrumbDefaultComponent {}
```

## July 2025

Major release of navigation and content organization components. New Tabs for multi-view interfaces, Accordion for collapsible content, and Tooltip for contextual information. Theming system improvements with new color palettes.

### New Components

#### tabs

## Run the CLI

Use the CLI to add tabs to your project.

```
npx zard-cli@latest add tabs
```

Tabbed interface component for organizing content into separate views with smooth transitions and keyboard navigation.

Overview

View your key metrics and recent project activity. Track progress across all your active projects.

You have 12 active projects and 3 pending tasks.

Analytics

Track performance and user engagement metrics. Monitor trends and identify growth opportunities.

Page views are up 25% compared to last month.

Reports

Generate and download your detailed reports. Export data in multiple formats for analysis.

You have 5 reports ready and available to export.

Settings

Manage your account preferences and options. Customize your experience to fit your needs.

Configure notifications, security, and themes.

```
import { Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-default',
  imports: [ZardTabComponent, ZardTabGroupComponent, ZardCardImports],
  template: `
    <z-tab-group class="w-[400px]">
      <z-tab label="Overview">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Overview" />
            <z-card-description
              zDescription="View your key metrics and recent project activity. Track progress across all your active projects."
            />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">You have 12 active projects and 3 pending tasks.</p>
        </z-card>
      </z-tab>
      <z-tab label="Analytics">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Analytics" />
            <z-card-description
              zDescription="Track performance and user engagement metrics. Monitor trends and identify growth opportunities."
            />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">Page views are up 25% compared to last month.</p>
        </z-card>
      </z-tab>
      <z-tab label="Reports">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Reports" />
            <z-card-description
              zDescription="Generate and download your detailed reports. Export data in multiple formats for analysis."
            />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">You have 5 reports ready and available to export.</p>
        </z-card>
      </z-tab>
      <z-tab label="Settings">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Settings" />
            <z-card-description
              zDescription="Manage your account preferences and options. Customize your experience to fit your needs."
            />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">Configure notifications, security, and themes.</p>
        </z-card>
      </z-tab>
    </z-tab-group>
  `,
})
export class ZardDemoTabsDefaultComponent {}
```

#### accordion

## Run the CLI

Use the CLI to add accordion to your project.

```
npx zard-cli@latest add accordion
```

Collapsible content panels for organizing information in a compact space with expand/collapse animations.

Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password. The link will expire in 24 hours.

Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.

We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAccordionImports } from '@/shared/components/accordion/accordion.imports';

@Component({
  selector: 'z-demo-accordion-basic',
  imports: [ZardAccordionImports],
  template: `
    <div z-accordion zDefaultValue="item-1" zType="single" class="max-w-sm">
      <z-accordion-item zValue="item-1" zTitle="How do I reset my password?">
        Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your
        password. The link will expire in 24 hours.
      </z-accordion-item>

      <z-accordion-item zValue="item-2" zTitle="Can I change my subscription plan?">
        Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in
        your next billing cycle.
      </z-accordion-item>

      <z-accordion-item zValue="item-3" zTitle="What payment methods do you accept?">
        We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our
        payment partners.
      </z-accordion-item>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAccordionBasicComponent {}
```

#### tooltip

## Run the CLI

Use the CLI to add tooltip to your project.

```
npx zard-cli@latest add tooltip
```

Contextual information overlay displayed on hover with customizable positioning and delay settings.

```
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

@Component({
  selector: 'z-demo-tooltip-hover',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <button type="button" z-button zType="outline" zTooltip="Tooltip content">Hover</button>
  `,
})
export class ZardDemoTooltipHoverComponent {}
```

## June 2025

Overlay components release! New Dialog, Popover, Alert Dialog, and Dropdown Menu components. CVA integration for type-safe styling variants across all components.

### New Components

#### dialog

## Run the CLI

Use the CLI to add dialog to your project.

```
npx zard-cli@latest add dialog
```

Modal dialog component for displaying important content that requires user attention with backdrop overlay.

```
import { ChangeDetectionStrategy, Component, inject, type AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';

import { ZardInputComponent } from '../../input/input.component';
import { Z_MODAL_DATA, ZardDialogService } from '../dialog.service';

interface iDialogData {
  name: string;
  username: string;
}

@Component({
  selector: 'zard-demo-dialog-basic',
  imports: [FormsModule, ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid gap-4">
      <div class="grid gap-3">
        <label for="name" class="text-sm leading-none font-medium select-none">Name</label>
        <input z-input id="name" formControlName="name" />
      </div>

      <div class="grid gap-3">
        <label for="username" class="text-sm leading-none font-medium select-none">Username</label>
        <input z-input id="username" formControlName="username" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoDialogBasic',
})
export class ZardDemoDialogBasicInputComponent implements AfterViewInit {
  private zData = inject(Z_MODAL_DATA) as iDialogData;

  form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });

  ngAfterViewInit(): void {
    if (this.zData) {
      this.form.patchValue(this.zData);
    }
  }
}

@Component({
  imports: [ZardDialogImports],
  template: `
    <button type="button" z-button zType="outline" (click)="openDialog()">Edit profile</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogBasicComponent {
  private dialogService = inject(ZardDialogService);

  openDialog() {
    this.dialogService.create({
      zTitle: 'Edit Profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoDialogBasicInputComponent,
      zData: {
        name: 'Samuel Rizzon',
        username: '@samuelrizzondev',
      } as iDialogData,
      zOkText: 'Save changes',
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
    });
  }
}
```

#### popover

## Run the CLI

Use the CLI to add popover to your project.

```
npx zard-cli@latest add popover
```

Floating content container that appears on trigger with customizable positioning and close behavior.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '../popover.component';

@Component({
  selector: 'z-popover-default-demo',
  imports: [ZardButtonComponent, ZardPopoverComponent, ZardPopoverDirective],
  standalone: true,
  template: `
    <button type="button" z-button zPopover [zContent]="popoverContent" zType="outline">Open popover</button>

    <ng-template #popoverContent>
      <z-popover>
        <div class="space-y-2">
          <h4 class="leading-none font-medium">Dimensions</h4>
          <p class="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverDefaultComponent {}
```

#### alert-dialog

## Run the CLI

Use the CLI to add alert-dialog to your project.

```
npx zard-cli@latest add alert-dialog
```

Confirmation dialog for critical actions requiring explicit user confirmation with cancel and confirm options.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'zard-demo-alert-dialog-default',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="outline" (click)="open()">Show Dialog</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertDialogDefaultComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  open() {
    this.alertDialogService.create({
      zTitle: 'Are you absolutely sure?',
      zDescription: 'This action cannot be undone. This will permanently delete your account from our servers.',
      zOkText: 'Continue',
      zCancelText: 'Cancel',
    });
  }
}
```

#### dropdown

## Run the CLI

Use the CLI to add dropdown to your project.

```
npx zard-cli@latest add dropdown
```

Context menu with hierarchical actions, keyboard navigation, and support for nested submenus.

```
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-dropdown-demo',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open menu</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-48">
      <z-dropdown-menu-item (click)="log('Profile')">Profile</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Billing')">Billing</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Team')">Team</z-dropdown-menu-item>
      <z-dropdown-menu-item [disabled]="true">Subscription</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
})
export class ZardDropdownDemoComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```

## May 2025

Comprehensive form controls release! New Select, Checkbox, Radio, Switch, and Slider components with full Angular Reactive Forms integration and ControlValueAccessor support.

### New Components

#### select

## Run the CLI

Use the CLI to add select to your project.

```
npx zard-cli@latest add select
```

Dropdown select with grouped options, multi-select support, keyboard navigation, and custom item rendering.

```
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-default',
  imports: [ZardSelectImports],
  template: `
    <z-select class="w-full min-w-48" zPlaceholder="Select a fruit" [(zValue)]="selectedFruit">
      <z-select-label>Fruits</z-select-label>
      <z-select-item zValue="apple">Apple</z-select-item>
      <z-select-item zValue="banana">Banana</z-select-item>
      <z-select-item zValue="blueberry">Blueberry</z-select-item>
      <z-select-item zValue="grapes">Grapes</z-select-item>
      <z-select-item zValue="pineapple">Pineapple</z-select-item>
    </z-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectDefaultComponent {
  readonly selectedFruit = signal('');
}
```

#### checkbox

## Run the CLI

Use the CLI to add checkbox to your project.

```
npx zard-cli@latest add checkbox
```

Checkbox input component with indeterminate state support and full accessibility features.

Accept terms and conditions

By clicking this checkbox, you agree to the terms.

Enable notifications

Enable notifications You can enable or disable notifications at any time.

```
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-default',
  imports: [ZardCheckboxComponent, ...ZardFieldImports, FormsModule],
  template: `
    <div z-field-group class="min-w-sm">
      <div z-field zOrientation="horizontal">
        <z-checkbox zId="terms-checkbox" [(ngModel)]="terms" />
        <label z-field-label for="terms-checkbox">Accept terms and conditions</label>
      </div>
      <div z-field zOrientation="horizontal">
        <z-checkbox zId="terms-checkbox-2" [(ngModel)]="termsWithDesc" />
        <div z-field-content>
          <label z-field-label for="terms-checkbox-2">Accept terms and conditions</label>
          <p z-field-description>By clicking this checkbox, you agree to the terms.</p>
        </div>
      </div>
      <div z-field zOrientation="horizontal" data-disabled="true">
        <z-checkbox zId="toggle-checkbox" zDisabled />
        <label z-field-label for="toggle-checkbox">Enable notifications</label>
      </div>
      <label z-field-label>
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="toggle-checkbox-2" [(ngModel)]="notifications" />
          <div z-field-content>
            <div z-field-title>Enable notifications</div>
            <p z-field-description>You can enable or disable notifications at any time.</p>
          </div>
        </div>
      </label>
    </div>
  `,
})
export class ZardDemoCheckboxDefaultComponent {
  terms = false;
  termsWithDesc = true;
  notifications = false;
}
```

#### radio-group

## Run the CLI

Use the CLI to add radio-group to your project.

```
npx zard-cli@latest add radio-group
```

Radio button group for mutually exclusive options with customizable layouts and orientation.

Default

Comfortable

Compact

```
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-default',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports, FormsModule],
  template: `
    <z-radio-group [(value)]="selected" class="w-fit">
      <div class="flex items-center gap-3">
        <z-radio zId="r1" value="default" />
        <label z-field-label for="r1">Default</label>
      </div>
      <div class="flex items-center gap-3">
        <z-radio zId="r2" value="comfortable" />
        <label z-field-label for="r2">Comfortable</label>
      </div>
      <div class="flex items-center gap-3">
        <z-radio zId="r3" value="compact" />
        <label z-field-label for="r3">Compact</label>
      </div>
    </z-radio-group>
  `,
})
export class ZardDemoRadioGroupDefaultComponent {
  selected: unknown = 'comfortable';
}
```

#### switch

## Run the CLI

Use the CLI to add switch to your project.

```
npx zard-cli@latest add switch
```

Toggle switch component for boolean settings with smooth animation transitions.

Airplane Mode

```
import { Component } from '@angular/core';

import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'zard-demo-switch',
  imports: [ZardSwitchComponent],
  template: `
    <z-switch zId="airplane-mode">Airplane Mode</z-switch>
  `,
})
export class ZardDemoSwitchDefaultComponent {}
```

#### slider

## Run the CLI

Use the CLI to add slider to your project.

```
npx zard-cli@latest add slider
```

Range slider for numeric value selection with min/max bounds, step support, and value display.

```
import { Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-default',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex min-h-50 w-full items-center p-10">
      <z-slider class="mx-auto w-full max-w-xs" [zDefault]="[75]" />
    </div>
  `,
})
export class ZardDemoSliderDefaultComponent {}
```

## April 2025

Form foundations and CLI launch! New Input and Form components with validation support. Official CLI tool released for easy project initialization and component installation.

### New Components

#### input

## Run the CLI

Use the CLI to add input to your project.

```
npx zard-cli@latest add input
```

Text input field component with multiple variants, sizes, and built-in validation state indicators.

API Key

Your API key is encrypted and stored securely.

```
import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-default',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72">
      <label z-field-label for="input-demo-api-key">API Key</label>
      <input z-input id="input-demo-api-key" type="password" placeholder="sk-..." />
      <p z-field-description>Your API key is encrypted and stored securely.</p>
    </div>
  `,
})
export class ZardDemoInputDefaultComponent {}
```

#### form

## Run the CLI

Use the CLI to add form to your project.

```
npx zard-cli@latest add form
```

Complete form component with field management, validation, error handling, and submission control.

Full Name

This is your display name.

Email

We'll never share your email with anyone else.

Bio

Optional: Brief description about yourself.

```
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardIdDirective } from '@/shared/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardInputComponent } from '../../input/input.component';
import { ZardFormImports } from '../form.imports';

@Component({
  selector: 'zard-demo-form-default',
  imports: [FormsModule, ZardButtonComponent, ZardInputComponent, ZardFormImports, ZardIdDirective],
  template: `
    <form class="max-w-sm space-y-6">
      <z-form-field zardId="fullName" #f="zardId">
        <label z-form-label zRequired [for]="f.id()">Full Name</label>
        <z-form-control>
          <input
            z-input
            type="text"
            [id]="f.id()"
            placeholder="Enter your full name"
            [(ngModel)]="fullName"
            name="fullName"
          />
        </z-form-control>
        <z-form-message>This is your display name.</z-form-message>
      </z-form-field>

      <z-form-field zardId="email" #e="zardId">
        <label z-form-label zRequired [for]="e.id()">Email</label>
        <z-form-control>
          <input z-input type="email" [id]="e.id()" placeholder="Enter your email" [(ngModel)]="email" name="email" />
        </z-form-control>
        <z-form-message>We'll never share your email with anyone else.</z-form-message>
      </z-form-field>

      <z-form-field zardId="bio" #b="zardId">
        <label z-form-label [for]="b.id()">Bio</label>
        <z-form-control>
          <textarea
            z-input
            [id]="b.id()"
            placeholder="Tell us about yourself"
            rows="3"
            [(ngModel)]="bio"
            name="bio"
          ></textarea>
        </z-form-control>
        <z-form-message>Optional: Brief description about yourself.</z-form-message>
      </z-form-field>

      <button z-button zType="default" type="submit">Submit</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ZardDemoFormDefaultComponent {
  fullName = '';
  email = '';
  bio = '';
}
```

## March 2025

🎉 Initial release of ZardUI! An Angular component library built with TailwindCSS v4, featuring standalone components, signal-based reactivity, and modern Angular architecture. Core components including Button, Card, Badge, Alert, and Table.

### New Components

#### button

## Run the CLI

Use the CLI to add button to your project.

```
npx zard-cli@latest add button
```

Versatile button component with multiple variants (primary, secondary, outline, ghost), sizes, and loading states.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-default',
  imports: [ZardButtonComponent],
  template: `
    <button z-button>Button</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonDefaultComponent {}
```

#### card

## Run the CLI

Use the CLI to add card to your project.

```
npx zard-cli@latest add card
```

Container component for grouping related content with optional header, footer, and customizable padding.

Login to your account

Enter your email below to login to your account

Email

Password

Forgot your password?

Login

Login with Google

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardIdDirective } from '@/shared/core';

@Component({
  selector: 'z-demo-card-default',
  imports: [ZardCardImports, ZardButtonComponent, ZardIdDirective],
  template: `
    <z-card class="w-full md:w-94">
      <div z-card-header>
        <z-card-title zTitle="Login to your account" />
        <z-card-description zDescription="Enter your email below to login to your account" />
        <z-card-action>
          <button z-button type="button" zType="link" (click)="onSignUp()">Sign up</button>
        </z-card-action>
      </div>
      <div z-card-content>
        <div class="space-y-4">
          <div class="space-y-2" zardId="email" #e="zardId">
            <label
              [for]="e.id()"
              class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <input
              [id]="e.id()"
              type="email"
              placeholder="m@example.com"
              class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
          <div class="space-y-2">
            <div class="flex items-center" zardId="password" #p="zardId">
              <label
                [for]="p.id()"
                class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <a href="#" class="ml-auto text-sm underline-offset-4 hover:underline">Forgot your password?</a>
            </div>
            <input
              [id]="p.id()"
              type="password"
              class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
        </div>
      </div>
      <div z-card-footer class="flex-col gap-2">
        <z-button zType="default" class="w-full">Login</z-button>
        <z-button zType="outline" class="w-full">Login with Google</z-button>
      </div>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardDefaultComponent {
  protected onSignUp(): void {
    alert('Redirect to Sign Up');
  }
}
```

#### badge

## Run the CLI

Use the CLI to add badge to your project.

```
npx zard-cli@latest add badge
```

Small label component for displaying status, categories, counts, or tags with various color variants.

Badge

Secondary

Destructive

Outline

Ghost

```
import { Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  selector: 'z-demo-badge-default',
  imports: [ZardBadgeComponent],
  template: `
    <div class="flex flex-col items-center gap-2">
      <div class="flex w-full flex-wrap gap-2">
        <z-badge>Badge</z-badge>
        <z-badge zType="secondary">Secondary</z-badge>
        <z-badge zType="destructive">Destructive</z-badge>
        <z-badge zType="outline">Outline</z-badge>
        <z-badge zType="ghost">Ghost</z-badge>
      </div>
    </div>
  `,
})
export class ZardDemoBadgeDefaultComponent {}
```

#### alert

## Run the CLI

Use the CLI to add alert to your project.

```
npx zard-cli@latest add alert
```

Notification component for displaying important information to users with different severity levels.

Payment successful

Your payment of $29.99 has been processed. A receipt has been sent to your email address.

New feature available

We've added dark mode support. You can enable it in your account settings.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideInfo } from '@ng-icons/lucide';

import { ZardAlertComponent } from '../alert.component';

@Component({
  selector: 'z-demo-alert-basic',
  imports: [ZardAlertComponent],
  template: `
    <div class="grid w-full max-w-md items-start gap-4">
      <z-alert
        zIcon="lucideCircleCheck"
        zTitle="Payment successful"
        zDescription="Your payment of $29.99 has been processed. A receipt has been sent to your email address."
      />

      <z-alert
        zIcon="lucideInfo"
        zTitle="New feature available"
        zDescription="We've added dark mode support. You can enable it in your account settings."
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleCheck, lucideInfo })],
})
export class ZardDemoAlertBasicComponent {}
```

#### table

## Run the CLI

Use the CLI to add table to your project.

```
npx zard-cli@latest add table
```

Data table component with sorting, filtering, pagination, and customizable column rendering.

| Name | Age | Address |
| --- | --- | --- |
| John Brown | 32 | New York No. 1 Lake Park |
| Jim Green | 42 | London No. 1 Lake Park |
| Joe Black | 32 | Sidney No. 1 Lake Park |

```
import { Component } from '@angular/core';

import { ZardTableComponent } from '../table.component';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'z-demo-table-simple',
  imports: [ZardTableComponent],
  standalone: true,
  template: `
    <table z-table>
      <caption>A list of your recent invoices.</caption>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        @for (data of listOfData; track data.key) {
          <tr>
            <td class="font-medium">{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td>{{ data.address }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class ZardDemoTableSimpleComponent {
  listOfData: Person[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];
}
```
