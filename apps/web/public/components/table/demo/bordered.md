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
    <table z-table zType="bordered">
      <caption z-table-caption>A bordered table example.</caption>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head>Product</th>
          <th z-table-head>Category</th>
          <th z-table-head>Stock</th>
          <th z-table-head class="text-right">Price</th>
        </tr>
      </thead>
      <tbody z-table-body>
        <tr z-table-row>
          <td z-table-cell class="font-medium">Laptop</td>
          <td z-table-cell>Electronics</td>
          <td z-table-cell>25</td>
          <td z-table-cell class="text-right">$1,299.99</td>
        </tr>
        <tr z-table-row>
          <td z-table-cell class="font-medium">Smartphone</td>
          <td z-table-cell>Electronics</td>
          <td z-table-cell>50</td>
          <td z-table-cell class="text-right">$799.99</td>
        </tr>
        <tr z-table-row>
          <td z-table-cell class="font-medium">Desk Chair</td>
          <td z-table-cell>Furniture</td>
          <td z-table-cell>15</td>
          <td z-table-cell class="text-right">$299.99</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class ZardDemoTableBorderedComponent {}
```