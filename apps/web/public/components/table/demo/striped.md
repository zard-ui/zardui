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
    <table z-table zType="striped">
      <caption z-table-caption>A striped table example.</caption>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head>Name</th>
          <th z-table-head>Position</th>
          <th z-table-head>Department</th>
          <th z-table-head class="text-right">Salary</th>
        </tr>
      </thead>
      <tbody z-table-body>
        <tr z-table-row>
          <td z-table-cell class="font-medium">John Doe</td>
          <td z-table-cell>Software Engineer</td>
          <td z-table-cell>Engineering</td>
          <td z-table-cell class="text-right">$120,000</td>
        </tr>
        <tr z-table-row>
          <td z-table-cell class="font-medium">Jane Smith</td>
          <td z-table-cell>Product Manager</td>
          <td z-table-cell>Product</td>
          <td z-table-cell class="text-right">$130,000</td>
        </tr>
        <tr z-table-row>
          <td z-table-cell class="font-medium">Mike Johnson</td>
          <td z-table-cell>Designer</td>
          <td z-table-cell>Design</td>
          <td z-table-cell class="text-right">$95,000</td>
        </tr>
        <tr z-table-row>
          <td z-table-cell class="font-medium">Sarah Wilson</td>
          <td z-table-cell>Data Scientist</td>
          <td z-table-cell>Engineering</td>
          <td z-table-cell class="text-right">$140,000</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class ZardDemoTableStripedComponent {}
```