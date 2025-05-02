import { Component } from '@angular/core';
import { ZardTableComponent } from '../table.component';
import { ZardTableModule } from '../table.module';

@Component({
  standalone: true,
  imports: [ZardTableComponent, ZardTableModule],
  template: `
    <z-table>
      <thead z-thead>
        <tr z-tr>
          <th z-th>Name</th>
          <th z-th>Age</th>
          <th z-th>Address</th>
        </tr>
      </thead>

      <tbody>
        <tr z-tr>
          <td z-td>Michael</td>
          <td z-td>32</td>
          <td z-td>Rua 1</td>
        </tr>
        <tr z-tr>
          <td z-td>Jim</td>
          <td z-td>46</td>
          <td z-td>Rua 2</td>
        </tr>
        <tr z-tr>
          <td z-td>Dwight</td>
          <td z-td>29</td>
          <td z-td>Rua 3</td>
        </tr>
      </tbody>
    </z-table>
  `,
})
export class ZardDemoTableBasicComponent {}
