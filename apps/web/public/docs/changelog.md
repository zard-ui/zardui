---
title: Changelog
description: Latest updates, new components, and improvements to ZardUI.
---

# Changelog

Latest updates, new components, and improvements to ZardUI.

## October 2026

We made every component read right to left, so Arabic, Hebrew and Persian apps get the same library as everyone else. Turn it on when you run zard-cli init, or set dir="rtl" on your html tag, and see the RTL guide for fonts and migration.

### Right to left

#### card

## Run the CLI

Use the CLI to add card to your project.

```
npx zard-cli@latest add card
```

The same card in Arabic, Hebrew and English: pick a language and the layout mirrors with it.

تسجيل الدخول إلى حسابك

أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك

إنشاء حساب

البريد الإلكتروني

كلمة المرور

نسيت كلمة المرور؟

تسجيل الدخول

تسجيل الدخول باستخدام Google

```
// You will notice this example is rendered inside a wrapper that sets the dir and data-lang attributes, and
// reads its text from a translations helper. This is because this site is not RTL by default.
// In your application you won't need either: set dir="rtl" on <html> (or use the CDK Dir directive on a subtree)
// and write the text of your own language. See the RTL guide: https://zardui.com/docs/rtl

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface CardRtlValues {
  title: string;
  description: string;
  signUp: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  forgotPassword: string;
  login: string;
  loginWithGoogle: string;
}

const translations: ZardRtlTranslations<CardRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      title: 'Login to your account',
      description: 'Enter your email below to login to your account',
      signUp: 'Sign Up',
      email: 'Email',
      emailPlaceholder: 'm@example.com',
      password: 'Password',
      forgotPassword: 'Forgot your password?',
      login: 'Login',
      loginWithGoogle: 'Login with Google',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      title: 'تسجيل الدخول إلى حسابك',
      description: 'أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك',
      signUp: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'm@example.com',
      password: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      login: 'تسجيل الدخول',
      loginWithGoogle: 'تسجيل الدخول باستخدام Google',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      title: 'התחבר לחשבון שלך',
      description: 'הזן את האימייל שלך למטה כדי להתחבר לחשבון שלך',
      signUp: 'הירשם',
      email: 'אימייל',
      emailPlaceholder: 'm@example.com',
      password: 'סיסמה',
      forgotPassword: 'שכחת את הסיסמה?',
      login: 'התחבר',
      loginWithGoogle: 'התחבר עם Google',
    },
  },
};

@Component({
  selector: 'z-demo-card-rtl',
  imports: [ZardCardImports, ZardButtonComponent, ...ZardFieldImports, ZardInputComponent],
  template: `
    <z-card class="w-full md:w-94">
      <z-card-header>
        <z-card-title [zTitle]="i18n.t().title" />
        <z-card-description [zDescription]="i18n.t().description" />
        <z-card-action>
          <a z-button zType="link" href="#">{{ i18n.t().signUp }}</a>
        </z-card-action>
      </z-card-header>
      <z-card-content>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="card-rtl-email">{{ i18n.t().email }}</label>
            <input z-input id="card-rtl-email" type="email" [placeholder]="i18n.t().emailPlaceholder" required />
          </div>
          <div z-field>
            <div class="flex items-center">
              <label z-field-label for="card-rtl-password">{{ i18n.t().password }}</label>
              <a href="#" class="ms-auto text-sm underline-offset-4 hover:underline">{{ i18n.t().forgotPassword }}</a>
            </div>
            <input z-input id="card-rtl-password" type="password" required />
          </div>
        </div>
      </z-card-content>
      <z-card-footer class="flex-col gap-2">
        <z-button class="w-full">{{ i18n.t().login }}</z-button>
        <z-button zType="outline" class="w-full">{{ i18n.t().loginWithGoogle }}</z-button>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
```

## Zard UI v1.0 is here

Alpha, Beta, and Release Candidate converge into a stable 1.0: the component API, the CLI, and the registry format are now covered by semantic versioning, and breaking changes only ship behind a major bump from here on.

## September 2026

The month v1.0.0 ships — see the announcement above for what a stable 1.0 means.

### Highlights

#### Dialog, sheet and alert dialog in the template

The three overlays gain the declarative form the drawer already had: compose z-dialog, z-sheet or z-alert-dialog with [(zVisible)] and header, title, description and footer children, or keep opening the same panel from code through the service. Every example on their pages now shows both.

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
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  selector: 'z-demo-field-preview',
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
export class ZardDemoFieldPreviewComponent {
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
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideChevronRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';

@Component({
  selector: 'z-demo-item-preview',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBadgeCheck, lucideChevronRight })],
})
export class ZardDemoItemPreviewComponent {}
```

#### textarea

## Run the CLI

Use the CLI to add textarea to your project.

```
npx zard-cli@latest add textarea
```

Multi-line text input with the same variants, sizes, and validation states as the single-line input.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-preview',
  imports: [ZardTextareaComponent],
  template: `
    <textarea z-textarea id="textarea-preview" placeholder="Type your message here." class="w-72"></textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTextareaPreviewComponent {}
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
  selector: 'z-demo-sonner-preview',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="show()">Show Toast</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSonnerPreviewComponent {
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

## April 2026

A thin month — two releases, no new components. One quietly narrows the Avatar `zSize` API to named sizes only; the other makes Select track option lists that keep changing after render.

### Highlights

#### Avatar drops numeric sizes

`zSize` on `z-avatar` only takes `sm`, `default`, `md`, `lg` and `xl` now: the numeric option is gone. Swap a number for the closest name (32, 40, 48, 56 and 64 px) or for a `size-*` class. Its exported types were renamed too.

- `ZardAvatarVariants` → `ZardAvatarSizeVariants`
- `ZardImageVariants` → `ZardAvatarShapeVariants`
- `ZardAvatarGroupVariants` → `ZardAvatarGroupOrientationVariants`

<z-avatar zSize="sm" />

#### Select follows dynamic option lists

Options added to a `z-select` after it renders, from a signal or a reactive list, are now selectable. The current value survives new options, and removing the selected one falls back to the raw value. No input or output changed.

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

## February 2026

The busiest month of the year outside August — 77 commits, most of them release automation. Underneath that: the CLI is renamed to `zard-cli` and hardened for monorepos, dark mode becomes safe under SSR, Button is restyled to match the latest shadcn/ui, Switch moves to a breaking model-input API, and Tree lands (it was removed again in August, see that entry).

### Highlights

#### CLI package renamed to zard-cli

The package moves from `@ngzard/ui` to `zard-cli`, and the binary from `ngzard` to `zard-cli`. The old package now prints a deprecation warning instead of doing anything. `components.json` and components you already installed are unaffected.

npx zard-cli@latest init

#### Tree component

A new `z-tree` shipped this month — expand/collapse, single and checkbox selection with propagation and indeterminate state, CDK virtual scroll, keyboard navigation, and a custom node template. It was removed again in August 2026, so there is no install command or demo for it here; mentioned for the record.

#### Switch moves to a model input

`z-switch` is now a component driven by `[(zChecked)]` and `zDisabled` instead of an attribute directive. The `(checkChange)` output and the bare `[z-switch]` selector are gone. Migrate `(checkChange)` to `(zCheckedChange)` or `[(zChecked)]`, `<button z-switch>` to `<z-switch>`, and a bare `disabled` attribute to `[zDisabled]`.

<z-switch [(zChecked)]="enabled" [zDisabled]="locked">Label</z-switch>

#### Button matches the latest shadcn/ui

New `zSize` values (`xs`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`), every existing size 4px shorter, a `rounded-lg` base radius, and a tinted rather than solid `destructive` variant. Not an API break, but layouts shift — reinstall `button` (and `date-picker`, which picked up the same size scale) to pick up the new styles.

#### Dark mode service works under SSR

`ZardDarkMode` no longer touches `matchMedia` in its constructor, so it no longer throws on the server and no longer flashes the wrong theme on first paint. It initialises after first render and keeps tracking OS changes while in `system` mode.

npx zard-cli@latest add dark-mode

#### CLI add is monorepo- and Angular-aware

`zard-cli add` now walks up to find the right `package.json`, pins `embla-carousel-angular` to your Angular major, retries with `--legacy-peer-deps` when needed, warns on Angular pre-releases, and rewrites `@/shared/*` imports using the aliases in `components.json`.

## January 2026

A quiet month by commit count but not by API surface: Angular 21 becomes the floor, every generated id moves to a new `ZardIdDirective` so server and client stop disagreeing, and both the input directive and Checkbox learn to honour the Reactive Forms disabled state.

### Highlights

#### Angular 21 is now required

Peer dependencies move to `^21.0.0` for `@angular/core`, `common`, `forms`, `router`, `platform-browser`, and `cdk` (previously pinned to 20.3.14), with `embla-carousel-angular` on `^21` and `tailwind-merge` on `^3.4`. Apps still on Angular 20 need to update before installing new components.

ng update @angular/core@21 @angular/cli@21 @angular/cdk@21

#### SSR-stable ids with ZardIdDirective

Alert Dialog, Card, Checkbox, Input Group, Radio, Switch, Tooltip, and Menu now generate their ids through the public `ZardIdDirective` instead of `crypto.randomUUID()`, so the id is deterministic and the server and browser render the same markup — no more hydration mismatch. `generateId` from `@/shared/utils/merge-classes` is gone; use `ZardIdDirective` from `@/shared/core` instead.

<label zardId="email" #e="zardId" [for]="e.id()">Email</label>

#### ZardTooltipModule replaced by ZardTooltipImports

The tooltip module is gone. Import `ZardTooltipImports` (or the standalone directive/component directly) instead.

imports: [ZardTooltipImports]

#### Input directive is a ControlValueAccessor

The `input[z-input]` and `textarea[z-input]` directives now register `NG_VALUE_ACCESSOR`: `setValue`/`patchValue` work, `control.disable()` disables the field, and blur marks it touched. A new signal-form demo shows it wired through `[formField]` from `@angular/forms/signals`.

#### Checkbox: zDisabled input and form disabled state

The `disabled` input is renamed to `zDisabled`, `setDisabledState` is implemented so reactive forms can disable a checkbox directly, and `checked` is now a signal. The outer `<span>` wrapper is gone — the host itself carries the layout and `aria-disabled`.

<span z-checkbox [zDisabled]="true">Disabled</span>

#### Avatar and Empty render images with NgOptimizedImage

Avatar gains a `zPriority` input and accepts a `SafeUrl` for `zSrc`; the image fills its container and lazy-loads unless marked priority. Empty renders its `zImage` at 64×64 by default. Both reject `data:`/`blob:` URLs in dev mode.

<z-avatar zSrc="/me.png" zPriority />

#### Variant helper types renamed

Several exported variant types were renamed or split for consistency. `ZardAlertIconVariants`, `ZardAlertTitleVariants`, `ZardAlertDescriptionVariants` and `ZardCheckLabelVariants` were removed with no replacement.

- `ZardAlertVariants` → `ZardAlertTypeVariants`
- `ZardBadgeVariants` → `ZardBadgeTypeVariants, ZardBadgeShapeVariants`
- `ZardCheckboxVariants` → `ZardCheckboxTypeVariants, ZardCheckboxSizeVariants, ZardCheckboxShapeVariants`
- `ZardIconVariants` → `ZardIconSizeVariants`

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
  selector: 'z-demo-carousel-preview',
  imports: [ZardCarouselImports, ZardCardImports],
  template: `
    <div class="w-full max-w-48 sm:max-w-xs">
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
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardKbdGroupComponent } from '@/shared/components/kbd/kbd-group.component';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';

@Component({
  selector: 'z-demo-kbd-preview',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoKbdPreviewComponent {}
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
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputComponent } from '@/shared/components/input';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardSheetService } from '@/shared/components/sheet/sheet.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

/** Content the service renders inside the sheet. */
@Component({
  selector: 'z-demo-sheet-preview-form',
  imports: [ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <label for="sheet-service-name" class="text-sm leading-none font-medium select-none">Name</label>
        <input z-input id="sheet-service-name" formControlName="name" />
      </div>
      <div class="grid gap-3">
        <label for="sheet-service-username" class="text-sm leading-none font-medium select-none">Username</label>
        <input z-input id="sheet-service-username" formControlName="username" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoSheetPreviewForm',
})
export class ZardDemoSheetPreviewFormComponent {
  readonly form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });
}

@Component({
  selector: 'z-demo-sheet-preview',
  imports: [ZardButtonComponent, ZardInputComponent, ZardSheetImports, ZardTabsImports, ReactiveFormsModule],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Open</button>

        <z-sheet [(zVisible)]="visible">
          <z-sheet-header>
            <z-sheet-title>Edit profile</z-sheet-title>
            <z-sheet-description>Make changes to your profile here. Click save when you're done.</z-sheet-description>
          </z-sheet-header>
          <form [formGroup]="form" class="grid flex-1 auto-rows-min gap-6 px-4">
            <div class="grid gap-3">
              <label for="sheet-name" class="text-sm leading-none font-medium select-none">Name</label>
              <input z-input id="sheet-name" formControlName="name" />
            </div>
            <div class="grid gap-3">
              <label for="sheet-username" class="text-sm leading-none font-medium select-none">Username</label>
              <input z-input id="sheet-username" formControlName="username" />
            </div>
          </form>
          <z-sheet-footer>
            <button type="button" z-button (click)="save()">Save changes</button>
            <button type="button" z-button zType="outline" z-sheet-close>Close</button>
          </z-sheet-footer>
        </z-sheet>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="openSheet()">Open</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetPreviewComponent {
  private readonly sheetService = inject(ZardSheetService);

  readonly visible = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });

  save() {
    console.log('Form submitted:', this.form.value);
    this.visible.set(false);
  }

  openSheet() {
    this.sheetService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoSheetPreviewFormComponent,
      zOkText: 'Save changes',
      zCancelText: 'Close',
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
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'z-demo-skeleton-preview',
  imports: [ZardSkeletonComponent],
  template: `
    <div class="flex items-center space-x-4">
      <z-skeleton class="size-12 rounded-full" />
      <div class="space-y-2">
        <z-skeleton class="h-4 w-[250px]" />
        <z-skeleton class="h-4 w-[200px]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSkeletonPreviewComponent {}
```

#### spinner

## Run the CLI

Use the CLI to add spinner to your project.

```
npx zard-cli@latest add spinner
```

Animated loading spinner customizable via the [zIcon] template input for swapping the underlying icon.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-spinner-custom-icon',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSpinnerCustomIconComponent {}
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
import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSeparatorComponent } from '../separator.component';

@Component({
  selector: 'z-demo-separator-preview',
  imports: [ZardSeparatorComponent],
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '../breadcrumb.imports';

@Component({
  selector: 'z-demo-breadcrumb-basic',
  imports: [ZardBreadcrumbImports],
  template: `
    <z-breadcrumb zLabel="Basic breadcrumb">
      <z-breadcrumb-item>
        <a z-breadcrumb-link href="/">Home</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <a z-breadcrumb-link href="/docs/components">Components</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <span z-breadcrumb-page>Breadcrumb</span>
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoBreadcrumbBasicComponent {}
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
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-preview',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTabsPreviewComponent {}
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
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

@Component({
  selector: 'z-demo-tooltip-preview',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <button type="button" z-button zType="outline" zTooltip="Tooltip content">Hover</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTooltipPreviewComponent {}
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
import { ChangeDetectionStrategy, Component, inject, signal, type AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { Z_MODAL_DATA, ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

interface DialogData {
  name: string;
  username: string;
}

/** Content the service renders inside the dialog; reads what was passed through `zData`. */
@Component({
  selector: 'z-demo-dialog-preview-content',
  imports: [ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid gap-4">
      <div class="grid gap-3">
        <label for="dialog-service-name" class="text-sm leading-none font-medium select-none">Name</label>
        <input z-input id="dialog-service-name" formControlName="name" />
      </div>
      <div class="grid gap-3">
        <label for="dialog-service-username" class="text-sm leading-none font-medium select-none">Username</label>
        <input z-input id="dialog-service-username" formControlName="username" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoDialogPreviewContent',
})
export class ZardDemoDialogPreviewContentComponent implements AfterViewInit {
  private readonly data = inject(Z_MODAL_DATA) as DialogData;

  readonly form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });

  ngAfterViewInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }
}

@Component({
  selector: 'z-demo-dialog-preview',
  imports: [ZardButtonComponent, ZardDialogImports, ZardInputComponent, ZardTabsImports, ReactiveFormsModule],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Edit profile</button>

        <z-dialog [(zVisible)]="visible">
          <z-dialog-header>
            <z-dialog-title>Edit profile</z-dialog-title>
            <z-dialog-description>Make changes to your profile here. Click save when you're done.</z-dialog-description>
          </z-dialog-header>
          <form [formGroup]="form" class="grid gap-4">
            <div class="grid gap-3">
              <label for="dialog-name" class="text-sm leading-none font-medium select-none">Name</label>
              <input z-input id="dialog-name" formControlName="name" />
            </div>
            <div class="grid gap-3">
              <label for="dialog-username" class="text-sm leading-none font-medium select-none">Username</label>
              <input z-input id="dialog-username" formControlName="username" />
            </div>
          </form>
          <z-dialog-footer>
            <button type="button" z-button zType="outline" z-dialog-close>Cancel</button>
            <button type="button" z-button (click)="save()">Save changes</button>
          </z-dialog-footer>
        </z-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="openDialog()">Edit profile</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogPreviewComponent {
  private readonly dialogService = inject(ZardDialogService);

  readonly visible = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('Samuel Rizzon'),
    username: new FormControl('@samuelrizzondev'),
  });

  save() {
    console.log('Form submitted:', this.form.value);
    this.visible.set(false);
  }

  openDialog() {
    this.dialogService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoDialogPreviewContentComponent,
      zData: {
        name: 'Samuel Rizzon',
        username: '@samuelrizzondev',
      } satisfies DialogData,
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

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-demo-popover-preview',
  imports: [ZardButtonComponent, ZardInputComponent, ...ZardPopoverImports],
  template: `
    <button type="button" z-button zPopover zType="outline" [zContent]="popoverContent">Open popover</button>

    <ng-template #popoverContent>
      <z-popover class="w-80">
        <div z-popover-header>
          <h4 z-popover-title>Dimensions</h4>
          <p z-popover-description>Set the dimensions for the layer.</p>
        </div>

        <div class="grid gap-2">
          @for (dimension of dimensions; track dimension.id) {
            <div class="grid grid-cols-3 items-center gap-4">
              <label class="text-sm" [attr.for]="dimension.id">{{ dimension.label }}</label>
              <input
                z-input
                type="text"
                class="col-span-2 h-8"
                [id]="dimension.id"
                [value]="dimension.value"
                [attr.aria-label]="dimension.label"
              />
            </div>
          }
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverPreviewComponent {
  readonly dimensions = [
    { id: 'width', label: 'Width', value: '100%' },
    { id: 'maxWidth', label: 'Max. width', value: '300px' },
    { id: 'height', label: 'Height', value: '25px' },
    { id: 'maxHeight', label: 'Max. height', value: 'none' },
  ];
}
```

#### alert-dialog

## Run the CLI

Use the CLI to add alert-dialog to your project.

```
npx zard-cli@latest add alert-dialog
```

Confirmation dialog for critical actions requiring explicit user confirmation with cancel and confirm options.

```
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardAlertDialogImports } from '@/shared/components/alert-dialog/alert-dialog.imports';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-alert-dialog-preview',
  imports: [ZardAlertDialogImports, ZardButtonComponent, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Show Dialog</button>

        <z-alert-dialog [(zVisible)]="visible">
          <z-alert-dialog-header>
            <z-alert-dialog-title>Are you absolutely sure?</z-alert-dialog-title>
            <z-alert-dialog-description>
              This action cannot be undone. This will permanently delete your account from our servers.
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
            <button type="button" z-button (click)="visible.set(false)">Continue</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="open()">Show Dialog</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertDialogPreviewComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  readonly visible = signal(false);

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
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-demo-dropdown-basic',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open menu</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-48">
      <z-dropdown-menu-label>My Account</z-dropdown-menu-label>
      <z-dropdown-menu-item (click)="log('Profile')">Profile</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Billing')">Billing</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Team')">Team</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item [disabled]="true">Subscription</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDropdownBasicComponent {
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
  selector: 'z-demo-select-preview',
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
export class ZardDemoSelectPreviewComponent {
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
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-preview',
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
      <label z-field-label for="toggle-checkbox-2">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCheckboxPreviewComponent {
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
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-preview',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports],
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoRadioGroupPreviewComponent {
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
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-preview',
  imports: [ZardSwitchComponent],
  template: `
    <z-switch zId="airplane-mode">Airplane Mode</z-switch>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchPreviewComponent {}
```

#### slider

## Run the CLI

Use the CLI to add slider to your project.

```
npx zard-cli@latest add slider
```

Range slider for numeric value selection with min/max bounds, step support, and value display.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-preview',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex min-h-50 w-full items-center p-10">
      <z-slider class="mx-auto w-full max-w-xs" [zDefault]="[75]" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSliderPreviewComponent {}
```

## April 2025

Form foundations and CLI launch! New Input and Form components with validation support. Official CLI tool released for easy project initialization and component installation. The Form component has since been discontinued — use Field instead, which covers the same ground and is what the form guides are built on.

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
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-preview',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72">
      <label z-field-label for="input-demo-api-key">API Key</label>
      <input z-input id="input-demo-api-key" type="password" placeholder="sk-..." />
      <p z-field-description>Your API key is encrypted and stored securely.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputPreviewComponent {}
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
    <button type="button" z-button>Button</button>
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

Sign up

Email

Password

Forgot your password?

Login

Login with Google

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-card-preview',
  imports: [ZardCardImports, ZardButtonComponent, ...ZardFieldImports, ZardInputComponent],
  template: `
    <z-card class="w-full md:w-94">
      <z-card-header>
        <z-card-title zTitle="Login to your account" />
        <z-card-description zDescription="Enter your email below to login to your account" />
        <z-card-action>
          <a z-button zType="link" href="#">Sign up</a>
        </z-card-action>
      </z-card-header>
      <z-card-content>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="card-login-email">Email</label>
            <input z-input id="card-login-email" type="email" placeholder="m@example.com" required />
          </div>
          <div z-field>
            <div class="flex items-center">
              <label z-field-label for="card-login-password">Password</label>
              <a href="#" class="ms-auto text-sm underline-offset-4 hover:underline">Forgot your password?</a>
            </div>
            <input z-input id="card-login-password" type="password" required />
          </div>
        </div>
      </z-card-content>
      <z-card-footer class="flex-col gap-2">
        <z-button class="w-full">Login</z-button>
        <z-button zType="outline" class="w-full">Login with Google</z-button>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardPreviewComponent {}
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

Link

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  selector: 'z-demo-badge-variants',
  imports: [ZardBadgeComponent],
  template: `
    <div class="flex flex-col items-center gap-2">
      <div class="flex w-full flex-wrap gap-2">
        <z-badge>Badge</z-badge>
        <z-badge zType="secondary">Secondary</z-badge>
        <z-badge zType="destructive">Destructive</z-badge>
        <z-badge zType="outline">Outline</z-badge>
        <z-badge zType="ghost">Ghost</z-badge>
        <z-badge zType="link">Link</z-badge>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoBadgeVariantsComponent {}
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

import { ZardAlertComponent } from '@/shared/components/alert/alert.component';

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
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardTableImports } from '@/shared/components/table/table.imports';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'z-demo-table-simple',
  imports: [ZardTableImports],
  template: `
    <table z-table>
      <caption z-table-caption>A list of registered users.</caption>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head scope="col">Name</th>
          <th z-table-head scope="col">Age</th>
          <th z-table-head scope="col">Address</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (data of listOfData; track data.key) {
          <tr z-table-row>
            <td z-table-cell class="font-medium">{{ data.name }}</td>
            <td z-table-cell>{{ data.age }}</td>
            <td z-table-cell>{{ data.address }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full overflow-x-auto',
  },
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
