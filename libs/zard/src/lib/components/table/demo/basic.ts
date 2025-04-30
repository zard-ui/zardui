import { Component } from '@angular/core';
import { ZardTableComponent } from '../table.component';

@Component({
  standalone: true,
  imports: [ZardTableComponent],
  template: `
    <z-table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Address</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Michael</td>
          <td>32</td>
          <td>Rua 1</td>
        </tr>
        <tr>
          <td>Jim</td>
          <td>46</td>
          <td>Rua 2</td>
        </tr>
        <tr>
          <td>Dwight</td>
          <td>29</td>
          <td>Rua 3</td>
        </tr>
      </tbody>
    </z-table>
  `,
})
export class ZardDemoTableBasicComponent {}
