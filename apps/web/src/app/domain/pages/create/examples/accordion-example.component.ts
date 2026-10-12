import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight } from '@ng-icons/lucide';

import { ZardAccordionImports } from '@zard/components/accordion/accordion.imports';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';

import { ExampleImports } from './example.component';

interface AccordionExampleItem {
  value: string;
  trigger: string;
  content: string;
  disabled?: boolean;
}

const BASIC_ITEMS: readonly AccordionExampleItem[] = [
  { value: 'item-1', trigger: 'Is it accessible?', content: 'Yes. It adheres to the WAI-ARIA design pattern.' },
  {
    value: 'item-2',
    trigger: 'Is it styled?',
    content: "Yes. It comes with default styles that matches the other components' aesthetic.",
  },
  {
    value: 'item-3',
    trigger: 'Is it animated?',
    content: "Yes. It's animated by default, but you can disable it if you prefer.",
  },
];

const MULTIPLE_ITEMS: readonly AccordionExampleItem[] = [
  {
    value: 'item-1',
    trigger:
      'What are the key considerations when implementing a comprehensive enterprise-level authentication system?',
    content:
      "Implementing a robust enterprise authentication system requires careful consideration of multiple factors. This includes secure password hashing and storage, multi-factor authentication (MFA) implementation, session management, OAuth2 and SSO integration, regular security audits, rate limiting to prevent brute force attacks, and maintaining detailed audit logs. Additionally, you'll need to consider scalability, performance impact, and compliance with relevant data protection regulations such as GDPR or HIPAA.",
  },
  {
    value: 'item-2',
    trigger:
      'How does modern distributed system architecture handle eventual consistency and data synchronization across multiple regions?',
    content:
      "Modern distributed systems employ various strategies to maintain data consistency across regions. This often involves using techniques like CRDT (Conflict-Free Replicated Data Types), vector clocks, and gossip protocols. Systems might implement event sourcing patterns, utilize message queues for asynchronous updates, and employ sophisticated conflict resolution strategies. Popular solutions like Amazon's DynamoDB and Google's Spanner demonstrate different approaches to solving these challenges, balancing between consistency, availability, and partition tolerance as described in the CAP theorem.",
  },
];

const DISABLED_ITEMS: readonly AccordionExampleItem[] = [
  {
    value: 'item-1',
    trigger: 'Can I access my account history?',
    content:
      'Yes, you can view your complete account history including all transactions, plan changes, and support tickets in the Account History section of your dashboard.',
    disabled: false,
  },
  {
    value: 'item-2',
    trigger: 'Premium feature information',
    content: 'This section contains information about premium features. Upgrade your plan to access this content.',
    disabled: true,
  },
  {
    value: 'item-3',
    trigger: 'How do I update my email address?',
    content:
      "You can update your email address in your account settings. You'll receive a verification email at your new address to confirm the change.",
    disabled: false,
  },
];

/*
 * zard's accordion item owns its trigger and content, so shadcn's `AccordionTrigger`/`AccordionContent` classes are
 * applied from the item through child selectors. `z-accordion` is not a block on its own: `flex w-full flex-col` is
 * what shadcn's `Accordion` root draws.
 */
const BORDERS_ITEM_CLASS = [
  'style-vega:rounded-lg style-vega:border style-nova:rounded-lg style-nova:border style-lyra:border',
  '[&>button]:font-medium style-vega:[&>button]:px-4 style-vega:[&>button]:text-sm style-nova:[&>button]:px-2.5',
  'style-nova:[&>button]:text-sm style-lyra:[&>button]:px-2 style-lyra:[&>button]:text-xs',
  'style-maia:[&>button]:text-sm style-mira:[&>button]:text-xs style-luma:[&>button]:text-sm',
  '[&_.cn-accordion-content-inner]:text-muted-foreground style-vega:[&_.cn-accordion-content-inner]:px-4',
  'style-nova:[&_.cn-accordion-content-inner]:px-2.5 style-nova:[&_.cn-accordion-content-inner]:text-sm',
  'style-lyra:[&_.cn-accordion-content-inner]:px-2 style-lyra:[&_.cn-accordion-content-inner]:text-xs',
  'style-maia:[&_.cn-accordion-content-inner]:px-0 style-mira:[&_.cn-accordion-content-inner]:px-0',
  'style-luma:[&_.cn-accordion-content-inner]:px-0',
].join(' ');

const DISABLED_ITEM_CLASS = [
  'data-open:bg-muted/50 style-sera:p-0 p-1',
  'style-vega:[&>button]:px-4 style-nova:[&>button]:px-2.5 style-lyra:[&>button]:px-2 style-sera:[&>button]:px-4',
  'style-vega:[&_.cn-accordion-content-inner]:px-4 style-nova:[&_.cn-accordion-content-inner]:px-2.5',
  'style-lyra:[&_.cn-accordion-content-inner]:px-2 style-sera:[&_.cn-accordion-content-inner]:px-4',
].join(' ');

/** shadcn/ui's `accordion-example`, in zard. */
@Component({
  selector: 'z-accordion-example',
  imports: [ExampleImports, NgIcon, ZardAccordionImports, ZardButtonComponent, ZardCardImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight })],
  template: `
    <z-example-wrapper zClass="w-full max-w-4xl lg:grid-cols-1 2xl:max-w-4xl 2xl:grid-cols-1">
      <z-example zTitle="Basic">
        <z-accordion zType="single" class="mx-auto flex w-full max-w-lg flex-col">
          @for (item of basicItems; track item.value) {
            <z-accordion-item [zValue]="item.value" [zTitle]="item.trigger">{{ item.content }}</z-accordion-item>
          }
        </z-accordion>
      </z-example>

      <z-example zTitle="Multiple">
        <z-accordion zType="multiple" class="mx-auto flex w-full max-w-lg flex-col">
          @for (item of multipleItems; track item.value) {
            <z-accordion-item [zValue]="item.value" [zTitle]="item.trigger">{{ item.content }}</z-accordion-item>
          }
        </z-accordion>
      </z-example>

      <z-example zTitle="With Borders">
        <z-accordion
          zType="single"
          class="style-vega:gap-2 style-nova:gap-2 style-lyra:gap-2 mx-auto flex w-full max-w-lg flex-col"
        >
          <z-accordion-item zValue="billing" zTitle="How does billing work?" [class]="bordersItemClass">
            We offer monthly and annual subscription plans. Billing is charged at the beginning of each cycle, and you
            can cancel anytime. All plans include automatic backups, 24/7 support, and unlimited team members. There are
            no hidden fees or setup costs.
          </z-accordion-item>
          <z-accordion-item zValue="security" zTitle="Is my data secure?" [class]="bordersItemClass">
            Yes. We use end-to-end encryption, SOC 2 Type II compliance, and regular third-party security audits. All
            data is encrypted at rest and in transit using industry-standard protocols. We also offer optional
            two-factor authentication and single sign-on for enterprise customers.
          </z-accordion-item>
          <z-accordion-item zValue="integration" zTitle="What integrations do you support?" [class]="bordersItemClass">
            <p>
              We integrate with 500+ popular tools including Slack, Zapier, Salesforce, HubSpot, and more. You can also
              build custom integrations using our REST API and webhooks.
            </p>
            <p>Our API documentation includes code examples in 10+ programming languages.</p>
          </z-accordion-item>
        </z-accordion>
      </z-example>

      <z-example zTitle="In Card">
        <z-card class="mx-auto w-full max-w-lg gap-4">
          <z-card-header>
            <z-card-title zTitle="Subscription & Billing" />
            <z-card-description zDescription="Common questions about your account, plans, and payments" />
          </z-card-header>
          <z-card-content>
            <z-accordion
              zType="single"
              zDefaultValue="plans"
              class="style-maia:rounded-md style-mira:rounded-md flex w-full flex-col"
            >
              <z-accordion-item zValue="plans" zTitle="What subscription plans do you offer?">
                <p>
                  We offer three subscription tiers: Starter ($9/month), Professional ($29/month), and Enterprise
                  ($99/month). Each plan includes increasing storage limits, API access, priority support, and team
                  collaboration features.
                </p>
                <p>
                  <a href="#" (click)="$event.preventDefault()">Annual billing is available</a>
                  with a 20% discount. All plans include a 14-day free trial with no credit card required.
                </p>
                <button type="button" z-button zSize="sm">
                  View plans
                  <ng-icon name="lucideArrowUpRight" />
                </button>
              </z-accordion-item>
              <z-accordion-item zValue="billing" zTitle="How does billing work?">
                <p>
                  Billing occurs automatically at the start of each billing cycle. We accept all major credit cards,
                  PayPal, and ACH transfers for enterprise customers.
                </p>
                <p>
                  You'll receive an invoice via email after each payment. You can update your payment method or billing
                  information anytime in your account settings. Failed payments will trigger automated retry attempts
                  and email notifications.
                </p>
              </z-accordion-item>
              <z-accordion-item zValue="upgrade" zTitle="Can I upgrade or downgrade my plan?">
                <p>
                  Yes, you can change your plan at any time. When upgrading, you'll be charged a prorated amount for the
                  remainder of your billing cycle and immediately gain access to new features.
                </p>
                <p>
                  When downgrading, the change takes effect at the end of your current billing period, and you'll retain
                  access to premium features until then. No refunds are provided for downgrades.
                </p>
              </z-accordion-item>
              <z-accordion-item zValue="cancel" zTitle="How do I cancel my subscription?">
                <p>
                  You can cancel your subscription anytime from your account settings. There are no cancellation fees or
                  penalties. Your access will continue until the end of your current billing period.
                </p>
                <p>
                  After cancellation, your data is retained for 30 days in case you want to reactivate. You can export
                  all your data before or after canceling. We'd love to hear your feedback about why you're leaving.
                </p>
              </z-accordion-item>
              <z-accordion-item zValue="refund" zTitle="What is your refund policy?">
                <p>
                  We offer a 30-day money-back guarantee for new subscriptions. If you're not satisfied within the first
                  30 days, contact our support team for a full refund.
                </p>
                <p>
                  After 30 days, we don't provide refunds for partial billing periods, but you can cancel anytime to
                  avoid future charges. Enterprise customers have custom refund terms outlined in their contracts.
                </p>
              </z-accordion-item>
            </z-accordion>
          </z-card-content>
        </z-card>
      </z-example>

      <z-example zTitle="With Disabled">
        <z-accordion
          zType="single"
          class="style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-lg style-mira:rounded-lg style-luma:rounded-xl style-sera:rounded-none mx-auto flex w-full max-w-lg flex-col overflow-hidden border"
        >
          @for (item of disabledItems; track item.value) {
            <z-accordion-item
              [zValue]="item.value"
              [zTitle]="item.trigger"
              [zDisabled]="!!item.disabled"
              [class]="disabledItemClass"
            >
              {{ item.content }}
            </z-accordion-item>
          }
        </z-accordion>
      </z-example>
    </z-example-wrapper>
  `,
})
export class AccordionExampleComponent {
  protected readonly basicItems = BASIC_ITEMS;
  protected readonly multipleItems = MULTIPLE_ITEMS;
  protected readonly disabledItems = DISABLED_ITEMS;
  protected readonly bordersItemClass = BORDERS_ITEM_CLASS;
  protected readonly disabledItemClass = DISABLED_ITEM_CLASS;
}
