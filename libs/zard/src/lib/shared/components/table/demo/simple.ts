import { Component } from '@angular/core';

import { ZardTableImports } from '../table.imports';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'z-demo-table-simple',
  imports: [ZardTableImports],
  template: `
    <table z-table>
      <caption z-table-caption>A list of your recent invoices.</caption>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head>Name</th>
          <th z-table-head>Age</th>
          <th z-table-head>Address</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (data of listOfData; track data.key) {
          <tr z-table-row>
            <td z-table-cell class="font-medium">{{ data.name }}</td>
            <td z-table-cell>{{ data.age }}</td>
            <td z-table-cell>{{ data.address }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class ZardDemoTableSimpleComponent {
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
