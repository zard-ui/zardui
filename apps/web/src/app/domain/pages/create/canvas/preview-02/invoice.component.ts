import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardTableImports } from '@zard/components/table/table.imports';

const INVOICE_ITEMS = [
  { item: 'Design System License', qty: 1, unitPrice: 499 },
  { item: 'Priority Support', qty: 12, unitPrice: 99 },
  { item: 'Custom Components', qty: 3, unitPrice: 250 },
] as const;

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

const ROWS = INVOICE_ITEMS.map(row => ({
  item: row.item,
  qty: row.qty,
  rate: currency.format(row.unitPrice),
  amount: currency.format(row.qty * row.unitPrice),
}));

const SUBTOTAL = INVOICE_ITEMS.reduce((sum, row) => sum + row.qty * row.unitPrice, 0);
const TAX = 0;

@Component({
  selector: 'z-preview-02-invoice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardBadgeComponent, ZardButtonComponent, ZardCardImports, ZardTableImports],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Invoice #INV-2847" />
        <z-card-description zDescription="Due March 30, 2026" />
        <z-card-action>
          <z-badge zType="secondary">Pending</z-badge>
        </z-card-action>
      </z-card-header>
      <z-card-content>
        <table z-table>
          <thead z-table-header>
            <tr z-table-row>
              <th z-table-head>Item</th>
              <th z-table-head class="text-right">Qty</th>
              <th z-table-head class="text-right">Rate</th>
              <th z-table-head class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody z-table-body>
            @for (row of rows; track row.item) {
              <tr z-table-row>
                <td z-table-cell>{{ row.item }}</td>
                <td z-table-cell class="text-right tabular-nums">{{ row.qty }}</td>
                <td z-table-cell class="text-right tabular-nums">{{ row.rate }}</td>
                <td z-table-cell class="text-right tabular-nums">{{ row.amount }}</td>
              </tr>
            }
            <tr z-table-row>
              <td z-table-cell colspan="3" class="text-right">Subtotal</td>
              <td z-table-cell class="text-right tabular-nums">{{ subtotal }}</td>
            </tr>
            <tr z-table-row>
              <td z-table-cell colspan="3" class="text-right">Tax</td>
              <td z-table-cell class="text-right tabular-nums">$0.00</td>
            </tr>
            <tr z-table-row>
              <td z-table-cell colspan="3" class="text-right">Total Due</td>
              <td z-table-cell class="text-right tabular-nums">{{ totalDue }}</td>
            </tr>
          </tbody>
        </table>
      </z-card-content>
      <z-card-footer>
        <button type="button" z-button zType="outline" zSize="sm">Download PDF</button>
        <button type="button" z-button zSize="sm" class="ml-auto">Pay Now</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02InvoiceComponent {
  protected readonly rows = ROWS;
  protected readonly subtotal = currency.format(SUBTOTAL);
  protected readonly totalDue = currency.format(SUBTOTAL + TAX);
}
