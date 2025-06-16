import { Component } from '@angular/core';
import { ZardTableComponent } from '../table.component';
import { ZardTableModule } from '../table.module';

@Component({
  standalone: true,
  imports: [ZardTableComponent, ZardTableModule],
  template: ` <z-table [columns]="columns" [data]="data" [zOrdering]="true" [pagination]="5"></z-table> `,
})
export class ZardDemoTableDynamicComponent {
  columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Age', accessor: 'age' },
    { header: 'Address', accessor: 'address' },
  ];

  data: Array<Record<string, string | number>> = [
    { name: 'Jim Brown', age: 32, address: 'Rua 1' },
    { name: 'Dwight', age: 29, address: 'Rua 2' },
    { name: 'Earl', age: 46, address: 'Rua 3' },
    { name: 'Fineas', age: 18, address: 'Rua 4' },
    { name: 'Gus', age: 54, address: 'Rua 5' },
    { name: 'Hank', age: 41, address: 'Rua 6' },
    { name: 'Ivy', age: 22, address: 'Rua 7' },
    { name: 'Jack', age: 35, address: 'Rua 8' },
    { name: 'Kara', age: 27, address: 'Rua 9' },
    { name: 'Liam', age: 30, address: 'Rua 10' },
    { name: 'Mia', age: 24, address: 'Rua 11' },
    { name: 'Noah', age: 33, address: 'Rua 12' },
    { name: 'Olivia', age: 28, address: 'Rua 13' },
    { name: 'Paul', age: 39, address: 'Rua 14' },
    { name: 'Quinn', age: 21, address: 'Rua 15' },
    { name: 'Rita', age: 37, address: 'Rua 16' },
    { name: 'Sam', age: 26, address: 'Rua 17' },
    { name: 'Tina', age: 31, address: 'Rua 18' },
    { name: 'Ursula', age: 45, address: 'Rua 19' },
    { name: 'Victor', age: 38, address: 'Rua 20' },
  ];
}
