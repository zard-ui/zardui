---
title: Accordion
description: A vertically stacked set of interactive headings that each reveal a section of content.
---

# Accordion

A vertically stacked set of interactive headings that each reveal a section of content.

## Installation

### CLI

```bash
npx zard-cli@latest add accordion
```

### Manual

```angular-ts
import {
  type AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardAccordionItemComponent } from '@/shared/components/accordion/accordion-item.component';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-accordion, [z-accordion]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'zAccordion',
})
export class ZardAccordionComponent implements AfterContentInit {
  readonly items = contentChildren(ZardAccordionItemComponent);

  readonly class = input<ClassValue>('');
  readonly zType = input<'single' | 'multiple'>('single');
  readonly zCollapsible = input<boolean>(true);
  readonly zDefaultValue = input<string | string[]>('');

  private readonly defaultValue = computed(() => {
    const defaultValue = this.zDefaultValue();
    if (typeof defaultValue === 'string') {
      return defaultValue ? [defaultValue] : [];
    } else if (this.zType() === 'single') {
      throw new Error('Array of default values is supported only for multiple zType');
    }
    return defaultValue;
  });

  protected readonly classes = computed(() => mergeClasses(this.class()));

  ngAfterContentInit(): void {
    for (const item of this.items()) {
      item.accordion = this;
      item.isOpen.set(this.defaultValue().includes(item.zValue()));
    }
  }

  toggleItem(selectedItem: ZardAccordionItemComponent): void {
    if (this.zType() === 'single') {
      this.toggleForSingleType(selectedItem);
    } else {
      this.toggleForMultipleType(selectedItem);
    }
  }

  private toggleForSingleType(selectedItem: ZardAccordionItemComponent): void {
    const isClosing = selectedItem.isOpen();

    if (isClosing && !this.zCollapsible()) {
      return;
    }

    for (const item of this.items()) {
      const shouldBeOpen = item === selectedItem ? !item.isOpen() : false;
      item.isOpen.set(shouldBeOpen);
    }
  }

  private toggleForMultipleType(selectedItem: ZardAccordionItemComponent): void {
    const isClosing = selectedItem.isOpen();
    if (isClosing && !this.zCollapsible() && this.countOpenItems() <= 1) {
      return;
    }

    selectedItem.isOpen.update(v => !v);
  }

  private countOpenItems(): number {
    return this.items().reduce((counter, item) => (item.isOpen() ? ++counter : counter), 0);
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const accordionItemVariants = cva('border-b last:border-b-0 flex flex-1 flex-col', {
  variants: {},
  defaultVariants: {},
});

export const accordionTriggerVariants = cva(
  'cursor-pointer group flex flex-1 items-start justify-between gap-4 rounded-md py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 w-full',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const accordionContentVariants = cva('grid text-sm transition-all', {
  variants: {
    isOpen: {
      true: 'grid-rows-[1fr]',
      false: 'grid-rows-[0fr]',
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});

export type ZardAccordionItemVariants = VariantProps<typeof accordionItemVariants>;
export type ZardAccordionTriggerVariants = VariantProps<typeof accordionTriggerVariants>;
export type ZardAccordionContentVariants = VariantProps<typeof accordionContentVariants>;
```

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import type { ZardAccordionComponent } from '@/shared/components/accordion/accordion.component';
import {
  accordionContentVariants,
  accordionItemVariants,
  accordionTriggerVariants,
} from '@/shared/components/accordion/accordion.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-accordion-item',
  imports: [NgIcon],
  template: `
    <button
      type="button"
      [attr.aria-controls]="'content-' + zValue()"
      [attr.aria-expanded]="isOpen()"
      [id]="'accordion-' + zValue()"
      [disabled]="zDisabled()"
      [class]="triggerClasses()"
      (click)="toggle()"
    >
      {{ zTitle() }}
      <ng-icon
        name="lucideChevronDown"
        class="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
        [class]="isOpen() ? 'rotate-180' : ''"
      />
    </button>

    @if (!zDisabled()) {
      <div
        role="region"
        [attr.aria-labelledby]="'accordion-' + zValue()"
        [attr.data-state]="isOpen() ? 'open' : 'closed'"
        [id]="'content-' + zValue()"
        [class]="contentClasses()"
      >
        <div class="overflow-hidden">
          <div class="pt-0 pb-4">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronDown })],
  host: {
    '[class]': 'itemClasses()',
    '[attr.data-state]': "isOpen() ? 'open' : 'closed'",
    '[attr.data-disabled]': 'zDisabled()',
    '[attr.aria-disabled]': 'zDisabled()',
    '[attr.disabled]': 'zDisabled()',
  },
  exportAs: 'zAccordionItem',
})
export class ZardAccordionItemComponent {
  readonly zTitle = input<string>('');
  readonly zValue = input<string>('');
  readonly class = input<ClassValue>('');
  readonly zDisabled = input(false, { transform: booleanAttribute });

  accordion!: ZardAccordionComponent;
  readonly isOpen = signal(false);

  protected readonly itemClasses = computed(() => mergeClasses(accordionItemVariants(), this.class()));
  protected readonly triggerClasses = computed(() => mergeClasses(accordionTriggerVariants()));
  protected readonly contentClasses = computed(() => mergeClasses(accordionContentVariants({ isOpen: this.isOpen() })));

  toggle(): void {
    if (this.accordion) {
      this.accordion.toggleItem(this);
    } else {
      this.isOpen.update(v => !v);
    }
  }
}
```

```angular-ts
import { ZardAccordionItemComponent } from '@/shared/components/accordion/accordion-item.component';
import { ZardAccordionComponent } from '@/shared/components/accordion/accordion.component';

export const ZardAccordionImports = [ZardAccordionComponent, ZardAccordionItemComponent] as const;
```

```angular-ts
export * from '@/shared/components/accordion/accordion.component';
export * from '@/shared/components/accordion/accordion-item.component';
export * from '@/shared/components/accordion/accordion.variants';
export * from '@/shared/components/accordion/accordion.imports';
```

## Usage

```angular-ts
import { ZardAccordionImports } from '@/shared/components/accordion/accordion.imports';
```

```angular-html
<z-accordion zType="single" zCollapsible>
  <z-accordion-item zValue="item-1" zTitle="Is it accessible?">
    Yes. It adheres to the WAI-ARIA design pattern.
  </z-accordion-item>
</z-accordion>
```

## Examples

### Basic

A basic accordion that shows one item at a time. The first item is open by default.

```angular-ts
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

### Multiple

Use `type="multiple"` to allow multiple items to be open at the same time.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAccordionImports } from '@/shared/components/accordion/accordion.imports';

@Component({
  selector: 'z-demo-accordion-multiple',
  imports: [ZardAccordionImports],
  template: `
    <div z-accordion zType="multiple" class="max-w-sm">
      <z-accordion-item zValue="notifications" zTitle="Notification Settings">
        Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile
        devices.
      </z-accordion-item>

      <z-accordion-item zValue="privacy" zTitle="Privacy & Security">
        Control your privacy settings and security preferences. Enable two-factor authentication, manage connected
        devices, review active sessions, and configure data sharing preferences. You can also download your data or
        delete your account.
      </z-accordion-item>

      <z-accordion-item zValue="billing" zTitle="Billing & Subscription">
        View your current plan, payment history, and upcoming invoices. Update your payment method, change your
        subscription tier, or cancel your subscription.
      </z-accordion-item>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAccordionMultipleComponent {}
```

### Disabled

Use the `disabled` prop on `AccordionItem` to disable individual items.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAccordionImports } from '@/shared/components/accordion/accordion.imports';

@Component({
  selector: 'z-demo-accordion-disabled',
  imports: [ZardAccordionImports],
  template: `
    <div z-accordion zType="single" class="max-w-sm">
      <z-accordion-item zValue="item-1" zTitle="Can I access my account history?">
        Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your
        password. The link will expire in 24 hours.
      </z-accordion-item>

      <z-accordion-item zValue="item-2" zTitle="Can I change my subscription plan?" [zDisabled]="true">
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
export class ZardDemoAccordionDisabledComponent {}
```

### Borders

Add `border` to the `Accordion` and `border-b last:border-b-0` to the `AccordionItem` to add borders to the items.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAccordionImports } from '@/shared/components/accordion/accordion.imports';

@Component({
  selector: 'z-demo-accordion-borders',
  imports: [ZardAccordionImports],
  template: `
    <div z-accordion zDefaultValue="billing" zType="single" class="max-w-sm rounded-lg border">
      <z-accordion-item zValue="billing" zTitle="How does billing work?" class="px-4">
        We offer monthly and annual subscription plans. Billing is charged at the beginning of each cycle, and you can
        cancel anytime. All plans include automatic backups, 24/7 support, and unlimited team members.
      </z-accordion-item>

      <z-accordion-item zValue="security" zTitle="Is my data secure?" class="px-4">
        Yes. We use end-to-end encryption, SOC 2 Type II compliance, and regular third-party security audits. All data
        is encrypted at rest and in transit using industry-standard protocols.
      </z-accordion-item>

      <z-accordion-item zValue="integration" zTitle="What integrations do you support?" class="px-4">
        We integrate with 500+ popular tools including Slack, Zapier, Salesforce, HubSpot, and more. You can also build
        custom integrations using our REST API and webhooks.
      </z-accordion-item>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAccordionBordersComponent {}
```

### Card

Wrap the `Accordion` in a `Card` component.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAccordionImports } from '@/shared/components/accordion/accordion.imports';
import { ZardCardImports } from '@/shared/components/card/card.imports';

@Component({
  selector: 'z-demo-accordion-card',
  imports: [ZardAccordionImports, ZardCardImports],
  template: `
    <z-card
      zTitle="Subscription & Billing"
      zDescription="Common questions about your account, plans, payments and cancellations."
      class="w-full max-w-sm"
    >
      <div z-card-header>
        <z-card-title zTitle="Subscription & Billing" />
        <z-card-description zDescription="Common questions about your account, plans, payments and cancellations." />
      </div>
      <div z-card-content>
        <z-accordion zDefaultValue="plans" zType="single">
          <z-accordion-item zValue="plans" zTitle="What subscription plans do you offer?">
            We offer three subscription tiers: Starter ($9/month), Professional ($29/month), and Enterprise ($99/month).
            Each plan includes increasing storage limits, API access, priority support, and team collaboration features.
          </z-accordion-item>

          <z-accordion-item zValue="billing" zTitle="How does billing work?">
            Billing occurs automatically at the start of each billing cycle. We accept all major credit cards, PayPal,
            and ACH transfers for enterprise customers. You'll receive an invoice via email after each payment.
          </z-accordion-item>

          <z-accordion-item zValue="cancel" zTitle="How do I cancel my subscription?">
            You can cancel your subscription anytime from your account settings. There are no cancellation fees or
            penalties. Your access will continue until the end of your current billing period.
          </z-accordion-item>
        </z-accordion>
      </div>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAccordionCardComponent {}
```

## API Reference

### z-accordion

A component that displays a list of collapsible content sections.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |
| `[zType]` | Single or multiple items can be opened | `'single' \| 'multiple'` | `'single'` |
| `[zCollapsible]` | Whether accordion items can be collapsed | `boolean` | `true` |
| `[zDefaultValue]` | Item value(s) of the accordion's item(s) to be opened by default | `string \| string[]` | `''` |

### z-accordion-item

Represents a single section in the accordion.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |
| `[zTitle]` | The title for item header | `string` | `''` |
| `[zValue]` | Unique value of the accordion item | `string` | `''` |
| `[zDisabled]` | Accordion disabled state | `boolean` | `false` |

---

[Open in browser](https://zardui.com/docs/components/accordion)
