import { Component } from '@angular/core';

import { ZardTableComponent } from '../components/table.component';
import { ZardTableModule } from '../components/table.module';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  standalone: true,
  imports: [ZardTableComponent, ZardTableModule],
  template: `
    <z-table zType="default" zSize="default">
      <caption class="border-t p-4 caption-bottom">
        A list of your recent invoices.
      </caption>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        @for (data of listOfData; track data.key) {
          <tr>
            <td>{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td>{{ data.address }}</td>
          </tr>
        }
      </tbody>
    </z-table>
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
