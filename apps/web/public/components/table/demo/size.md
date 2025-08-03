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
    <div class="space-y-8">
      <div>
        <h3 class="text-lg font-semibold mb-4">Compact Table</h3>
        <table z-table zSize="compact">
          <thead z-table-header>
            <tr z-table-row>
              <th z-table-head>Name</th>
              <th z-table-head>Status</th>
              <th z-table-head class="text-right">Value</th>
            </tr>
          </thead>
          <tbody z-table-body>
            <tr z-table-row>
              <td z-table-cell class="font-medium">Item 1</td>
              <td z-table-cell>Active</td>
              <td z-table-cell class="text-right">$100</td>
            </tr>
            <tr z-table-row>
              <td z-table-cell class="font-medium">Item 2</td>
              <td z-table-cell>Inactive</td>
              <td z-table-cell class="text-right">$200</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 class="text-lg font-semibold mb-4">Comfortable Table</h3>
        <table z-table zSize="comfortable">
          <thead z-table-header>
            <tr z-table-row>
              <th z-table-head>Name</th>
              <th z-table-head>Status</th>
              <th z-table-head class="text-right">Value</th>
            </tr>
          </thead>
          <tbody z-table-body>
            <tr z-table-row>
              <td z-table-cell class="font-medium">Item 1</td>
              <td z-table-cell>Active</td>
              <td z-table-cell class="text-right">$100</td>
            </tr>
            <tr z-table-row>
              <td z-table-cell class="font-medium">Item 2</td>
              <td z-table-cell>Inactive</td>
              <td z-table-cell class="text-right">$200</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ZardDemoTableSizeComponent {}
```