import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardTableImports } from '@/shared/components/table/table.imports';

export interface Invoice {
  id: string;
  status: string;
  method: string;
  amount: number;
}

@Component({
  selector: 'z-demo-table-preview',
  imports: [ZardTableImports],
  template: `
    <table z-table>
      <caption z-table-caption>A list of your recent invoices.</caption>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head>Invoice</th>
          <th z-table-head>Status</th>
          <th z-table-head>Method</th>
          <th z-table-head class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (invoice of invoices(); track invoice.id) {
          <tr z-table-row>
            <td z-table-cell>
              <div>{{ invoice.id }}</div>
            </td>
            <td z-table-cell>
              {{ invoice.status }}
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
export class ZardDemoTablePreviewComponent {
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
    {
      id: 'INV004',
      status: 'Paid',
      method: 'Credit Card',
      amount: 450,
    },
    {
      id: 'INV005',
      status: 'Paid',
      method: 'PayPal',
      amount: 550,
    },
    {
      id: 'INV006',
      status: 'Pending',
      method: 'Bank Transfer',
      amount: 200,
    },
    {
      id: 'INV007',
      status: 'Unpaid',
      method: 'Credit Card',
      amount: 300,
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
