```angular-ts showLineNumbers
import { Component } from '@angular/core';

import {
  ZardTableComponent,
  ZardTableHeaderComponent,
  ZardTableBodyComponent,
  ZardTableRowComponent,
  ZardTableHeadComponent,
  ZardTableCellComponent,
} from '../table.component';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  standalone: true,
  imports: [
    ZardTableComponent,
    ZardTableHeaderComponent,
    ZardTableBodyComponent,
    ZardTableRowComponent,
    ZardTableHeadComponent,
    ZardTableCellComponent,
  ],
  template: `
    <table z-table>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head>Name</th>
          <th z-table-head>Age</th>
          <th z-table-head>Address</th>
          <th z-table-head>Action</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (data of listOfData; track data.key) {
          <tr z-table-row>
            <td z-table-cell class="font-medium">{{ data.name }}</td>
            <td z-table-cell>{{ data.age }}</td>
            <td z-table-cell>{{ data.address }}</td>
            <td z-table-cell>
              <button class="text-blue-600 hover:text-blue-800 mr-2">
                Action {{ data.name }}
              </button>
              <button class="text-red-600 hover:text-red-800">
                Delete
              </button>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class ZardDemoTableWithDataComponent {
  listOfData: Person[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];
}
```