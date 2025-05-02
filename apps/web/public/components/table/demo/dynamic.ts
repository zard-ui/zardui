import { Component } from '@angular/core';
import { ZardTableComponent } from '../table.component';

@Component({
  standalone: true,
  imports: [ZardTableComponent],
  template: ` <z-table [columns]="columns" [data]="data"></z-table> `,
})
export class ZardDemoTableDynamicComponent {
  columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Age', accessor: 'age' },
    { header: 'Address', accessor: 'address' },
  ];

  data: Array<Record<string, any>> = [
    { name: 'Jim Brown', age: 32, address: 'Rua 1' },
    { name: 'Dwight', age: 29, address: 'Rua 2' },
    { name: 'Earl', age: 46, address: 'Rua 3' },
    { name: 'Fineas', age: 18, address: 'Rua 4' },
  ];
}
