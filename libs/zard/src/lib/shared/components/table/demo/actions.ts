import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';

import { ZardDropdownImports } from '../../dropdown';
import { ZardTableImports } from '../table.imports';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'z-demo-table-actions',
  imports: [ZardTableImports, ZardDropdownImports, NgIcon],
  template: `
    <table z-table>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head>Product</th>
          <th z-table-head>Price</th>
          <th z-table-head class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (product of products; track product.id) {
          <tr z-table-row>
            <td z-table-cell class="font-medium">{{ product.name }}</td>
            <td z-table-cell>{{ product.price }}</td>
            <td z-table-cell class="text-right">
              <button
                z-button
                z-dropdown
                z-dropdown
                zType="ghost"
                zSize="icon"
                zAlign="end"
                type="button"
                aria-label="Open actions"
                [zDropdownMenu]="menu"
              >
                <ng-icon name="lucideEllipsis" aria-hidden="true" />
              </button>
              <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-30 -translate-x-[calc(100%-1.5rem)]">
                <z-dropdown-menu-item>Edit</z-dropdown-menu-item>
                <z-dropdown-menu-item>Duplicate</z-dropdown-menu-item>
                <z-dropdown-menu-separator class="block" />
                <z-dropdown-menu-item
                  variant="destructive"
                  class="hover:text-destructive focus:text-destructive focus-visible:text-destructive data-highlighted:text-destructive"
                >
                  Delete
                </z-dropdown-menu-item>
              </z-dropdown-menu-content>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideEllipsis })],
  host: {
    class: 'block w-full overflow-x-auto',
  },
})
export class ZardDemoTableActionsComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Wireless Mouse',
      price: 29.99,
    },
    {
      id: 2,
      name: 'Mechanical Keyboard',
      price: 129.99,
    },
    {
      id: 3,
      name: 'USB-C Hub',
      price: 49.99,
    },
  ];
}
