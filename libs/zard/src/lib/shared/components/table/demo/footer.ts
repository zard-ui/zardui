import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardTableImports } from '@/shared/components/table/table.imports';

export interface Invoice {
  id: string;
  status: string;
  method: string;
  amount: number;
}

@Component({
  selector: 'z-demo-table-footer',
  imports: [ZardTableImports],
  template: `
    <table z-table>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head>Invoice</th>
          <th z-table-head>Status</th>
          <th z-table-head>Method</th>
          <th z-table-head class="text-end">Amount</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (invoice of invoices(); track invoice.id) {
          <tr z-table-row>
            <td z-table-cell>{{ invoice.id }}</td>
            <td z-table-cell>
              <div>{{ invoice.status }}</div>
            </td>

            <td z-table-cell>
              {{ invoice.method }}
            </td>
            <td z-table-cell>
              <div class="text-right font-medium">{{ formatCurrency(invoice.amount) }}</div>
            </td>
          </tr>
        } @empty {
          <tr z-table-row>
            <td z-table-cell [attr.colspan]="4" class="h-24 text-center">No results.</td>
          </tr>
        }
      </tbody>
      <tfoot z-table-footer>
        <tr z-table-row>
          <td z-table-cell colspan="3">Total</td>
          <td z-table-cell class="text-right">{{ formatCurrency(total()) }}</td>
        </tr>
      </tfoot>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full overflow-x-auto',
  },
})
export class ZardDemoTableFooterComponent {
  readonly invoices = signal<Invoice[]>([
    {
      id: 'INV001',
      status: 'Paid',
      method: 'Credit Card',
      amount: 250,
    },
    {
      id: 'INV002',
      status: 'Pending',
      method: 'PayPal',
      amount: 150,
    },
    {
      id: 'INV003',
      status: 'Unpaid',
      method: 'Bank Transfer',
      amount: 350,
    },
  ]);

  readonly total = computed(() =>
    this.invoices().reduce((sum: number, invoice: { amount: number }) => sum + invoice.amount, 0),
  );

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}
