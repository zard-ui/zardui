import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCar, lucideCoffee, lucideEllipsis, lucideShoppingCart, lucideTv, lucideWallet } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardDropdownImports } from '@zard/components/dropdown';
import { ZardTableImports } from '@zard/components/table';

const TRANSACTIONS = [
  {
    icon: 'lucideCoffee',
    name: 'Blue Bottle Coffee',
    category: 'Food & Drink',
    date: 'Today, 10:24 AM',
    amount: '-$6.50',
    income: false,
  },
  {
    icon: 'lucideShoppingCart',
    name: 'Whole Foods Market',
    category: 'Groceries',
    date: 'Yesterday',
    amount: '-$142.30',
    income: false,
  },
  {
    icon: 'lucideWallet',
    name: 'Stripe Payout',
    category: 'Income',
    date: 'Oct 12',
    amount: '+$4,200.00',
    income: true,
  },
  {
    icon: 'lucideCar',
    name: 'Uber Technologies',
    category: 'Transport',
    date: 'Oct 11',
    amount: '-$24.10',
    income: false,
  },
  {
    icon: 'lucideTv',
    name: 'Netflix Subscription',
    category: 'Entertainment',
    date: 'Oct 10',
    amount: '-$19.99',
    income: false,
  },
] as const;

@Component({
  selector: 'z-preview-01-recent-transactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardTableImports, ZardDropdownImports, ZardButtonComponent, NgIcon],
  viewProviders: [
    provideIcons({ lucideCar, lucideCoffee, lucideEllipsis, lucideShoppingCart, lucideTv, lucideWallet }),
  ],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Recent Transactions" />
        <z-card-description zDescription="Your latest account activity." />
        <z-card-action>
          <button type="button" z-button zType="outline" zSize="sm">View All</button>
        </z-card-action>
      </z-card-header>
      <z-card-content>
        <div data-slot="table-container" class="relative w-full overflow-x-auto">
          <table z-table>
            <tbody z-table-body>
              @for (transaction of transactions; track transaction.name) {
                <tr z-table-row>
                  <td z-table-cell class="w-10">
                    <div class="bg-muted flex size-10 items-center justify-center rounded-lg">
                      <ng-icon [name]="transaction.icon" class="size-4 shrink-0" />
                    </div>
                  </td>
                  <td z-table-cell>
                    <div class="flex flex-col">
                      <span class="font-medium">{{ transaction.name }}</span>
                      <span class="text-muted-foreground text-sm">{{ transaction.category }}</span>
                    </div>
                  </td>
                  <td z-table-cell class="text-muted-foreground text-sm">{{ transaction.date }}</td>
                  <td z-table-cell class="text-right">
                    <span class="text-sm font-semibold tabular-nums" [class.text-emerald-500]="transaction.income">
                      {{ transaction.amount }}
                    </span>
                  </td>
                  <td z-table-cell class="w-8">
                    <button
                      type="button"
                      z-button
                      zType="ghost"
                      zSize="icon-sm"
                      z-dropdown
                      [zDropdownMenu]="menu"
                      aria-label="Open menu"
                    >
                      <ng-icon name="lucideEllipsis" />
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <z-dropdown-menu-content #menu="zDropdownMenuContent" zAlign="end">
          <z-dropdown-menu-item>View details</z-dropdown-menu-item>
          <z-dropdown-menu-item>Add note</z-dropdown-menu-item>
          <z-dropdown-menu-item>Categorize</z-dropdown-menu-item>
          <z-dropdown-menu-separator />
          <z-dropdown-menu-item>Dispute</z-dropdown-menu-item>
        </z-dropdown-menu-content>
      </z-card-content>
    </z-card>
  `,
})
export class Preview01RecentTransactionsComponent {
  protected readonly transactions = TRANSACTIONS;
}
