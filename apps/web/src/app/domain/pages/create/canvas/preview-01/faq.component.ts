import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAccordionImports } from '@zard/components/accordion';
import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardTabsImports } from '@zard/components/tabs';

const TABS = [
  {
    label: 'General',
    questions: [
      {
        q: 'How secure is my financial data with Ledger?',
        a: 'We use bank-level AES-256 encryption, SOC 2 Type II certified infrastructure, and never store your credentials. All connections use read-only access tokens. We are a SEC registered investment advisor.',
      },
      {
        q: 'How do I connect my bank or investment accounts?',
        a: 'Go to Settings > Linked Accounts and search for your institution. We support over 12,000 banks and brokerages via Plaid and MX.',
      },
      {
        q: 'Can I export my data for tax purposes?',
        a: 'Yes. Navigate to Reports > Tax Export to download a CSV or PDF summary of your transactions, dividends, and capital gains for any tax year.',
      },
    ],
  },
  {
    label: 'Billing',
    questions: [
      {
        q: 'What is the difference between Basic and Pro pricing tiers?',
        a: 'Basic includes budgeting, goal tracking, and up to 3 linked accounts. Pro adds unlimited accounts, dividend tracking, portfolio analysis, and priority support.',
      },
      {
        q: 'How do I cancel my subscription?',
        a: 'Go to Settings > Billing > Manage Plan and click Cancel. Your access continues until the end of your current billing period.',
      },
      {
        q: 'Do you offer a free trial?',
        a: 'Yes. All new accounts start with a 14-day Pro trial. No credit card required.',
      },
    ],
  },
  {
    label: 'Goals',
    questions: [
      {
        q: 'How do I set up a custom financial goal?',
        a: "Click New Goal from the Savings Targets card. Choose a category, set a target amount and date, and we'll calculate the monthly contribution needed.",
      },
      {
        q: 'Can I track multiple goals at once?',
        a: 'Yes. Pro accounts can track unlimited goals. Basic accounts support up to 3 active goals.',
      },
      {
        q: 'How are monthly contributions calculated?',
        a: 'We divide the remaining amount by the number of months until your target date, adjusted for your current savings rate and any auto-transfer schedules.',
      },
    ],
  },
] as const;

/** zard's tab group draws its own list, so shadcn's `w-full` list and `flex-1` triggers are reached from the host. */
@Component({
  selector: 'z-preview-01-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardTabsImports, ZardAccordionImports, ZardButtonComponent],
  template: `
    <z-card>
      <z-card-content>
        <z-tab-group class="[&_[role=tab]]:flex-1 [&_[role=tablist]]:w-full">
          @for (tab of tabs; track tab.label) {
            <z-tab [label]="tab.label">
              <z-accordion zType="single" [zCollapsible]="true" zDefaultValue="item-0">
                @for (item of tab.questions; track item.q; let index = $index) {
                  <z-accordion-item [zValue]="'item-' + index" [zTitle]="item.q">{{ item.a }}</z-accordion-item>
                }
              </z-accordion>
            </z-tab>
          }
        </z-tab-group>
      </z-card-content>
      <z-card-footer>
        <button type="button" z-button zType="outline" class="w-full">Contact Support</button>
        <button type="button" z-button zType="link" class="w-full">Learn More</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01FaqComponent {
  protected readonly tabs = TABS;
}
