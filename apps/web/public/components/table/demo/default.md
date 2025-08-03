```angular-ts showLineNumbers
import { Component } from '@angular/core';

import {
  ZardTableComponent,
  ZardTableHeaderComponent,
  ZardTableBodyComponent,
  ZardTableRowComponent,
  ZardTableHeadComponent,
  ZardTableCellComponent,
  ZardTableCaptionComponent,
} from '../table.component';

@Component({
  standalone: true,
  imports: [
    ZardTableComponent,
    ZardTableHeaderComponent,
    ZardTableBodyComponent,
    ZardTableRowComponent,
    ZardTableHeadComponent,
    ZardTableCellComponent,
    ZardTableCaptionComponent,
  ],
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
        <tr z-table-row>
          <td z-table-cell class="font-medium">INV001</td>
          <td z-table-cell>Paid</td>
          <td z-table-cell>Credit Card</td>
          <td z-table-cell class="text-right">$250.00</td>
        </tr>
        <tr z-table-row>
          <td z-table-cell class="font-medium">INV002</td>
          <td z-table-cell>Pending</td>
          <td z-table-cell>PayPal</td>
          <td z-table-cell class="text-right">$150.00</td>
        </tr>
        <tr z-table-row>
          <td z-table-cell class="font-medium">INV003</td>
          <td z-table-cell>Unpaid</td>
          <td z-table-cell>Bank Transfer</td>
          <td z-table-cell class="text-right">$350.00</td>
        </tr>
        <tr z-table-row>
          <td z-table-cell class="font-medium">INV004</td>
          <td z-table-cell>Paid</td>
          <td z-table-cell>Credit Card</td>
          <td z-table-cell class="text-right">$450.00</td>
        </tr>
        <tr z-table-row>
          <td z-table-cell class="font-medium">INV005</td>
          <td z-table-cell>Paid</td>
          <td z-table-cell>PayPal</td>
          <td z-table-cell class="text-right">$550.00</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class ZardDemoTableDefaultComponent {}
```