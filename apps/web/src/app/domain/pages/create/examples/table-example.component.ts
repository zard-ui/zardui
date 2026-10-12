import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDropdownImports } from '@zard/components/dropdown';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardSelectImports } from '@zard/components/select';
import { ZardTableImports } from '@zard/components/table';

import { ExampleImports } from './example.component';

const INVOICES = [
  { invoice: 'INV001', paymentStatus: 'Paid', totalAmount: '$250.00', paymentMethod: 'Credit Card' },
  { invoice: 'INV002', paymentStatus: 'Pending', totalAmount: '$150.00', paymentMethod: 'PayPal' },
  { invoice: 'INV003', paymentStatus: 'Unpaid', totalAmount: '$350.00', paymentMethod: 'Bank Transfer' },
  { invoice: 'INV004', paymentStatus: 'Paid', totalAmount: '$450.00', paymentMethod: 'Credit Card' },
  { invoice: 'INV005', paymentStatus: 'Paid', totalAmount: '$550.00', paymentMethod: 'PayPal' },
  { invoice: 'INV006', paymentStatus: 'Pending', totalAmount: '$200.00', paymentMethod: 'Bank Transfer' },
  { invoice: 'INV007', paymentStatus: 'Unpaid', totalAmount: '$300.00', paymentMethod: 'Credit Card' },
] as const;

const PEOPLE = [
  { name: 'Sarah Chen', email: 'sarah.chen@acme.com', role: 'Admin' },
  { name: 'Marc Rodriguez', email: 'marcus.rodriguez@acme.com', role: 'User' },
  { name: 'Emily Watson', email: 'emily.watson@acme.com', role: 'User' },
] as const;

const PILL = 'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium';
const GREEN = `${PILL} bg-green-500/10 text-green-700 dark:text-green-400`;
const BLUE = `${PILL} bg-blue-500/10 text-blue-700 dark:text-blue-400`;
const YELLOW = `${PILL} bg-yellow-500/10 text-yellow-700 dark:text-yellow-400`;
const GRAY = `${PILL} bg-gray-500/10 text-gray-700 dark:text-gray-400`;

const TASKS = [
  { task: 'Design homepage', status: 'Completed', statusClass: GREEN, priority: 'High', priorityClass: BLUE },
  { task: 'Implement API', status: 'In Progress', statusClass: YELLOW, priority: 'Medium', priorityClass: GRAY },
  { task: 'Write tests', status: 'Pending', statusClass: GRAY, priority: 'Low', priorityClass: GRAY },
] as const;

const PRODUCTS = [
  { product: 'Wireless Mouse', price: '$29.99', quantity: '1' },
  { product: 'Mechanical Keyboard', price: '$129.99', quantity: '2' },
  { product: 'USB-C Hub', price: '$49.99', quantity: '1' },
] as const;

const ASSIGNMENTS = [
  { task: 'Design homepage', assignee: 'sarah', status: 'In Progress' },
  { task: 'Implement API', assignee: 'marcus', status: 'Pending' },
  { task: 'Write tests', assignee: 'emily', status: 'Not Started' },
] as const;

const ASSIGNEES = [
  { value: 'sarah', label: 'Sarah Chen' },
  { value: 'marcus', label: 'Marc Rodriguez' },
  { value: 'emily', label: 'Emily Watson' },
  { value: 'david', label: 'David Kim' },
] as const;

/** shadcn/ui's `table-example`, in zard. */
@Component({
  selector: 'z-table-example',
  imports: [
    ExampleImports,
    NgIcon,
    ZardButtonComponent,
    ZardDropdownImports,
    ZardInputComponent,
    ZardSelectImports,
    ZardTableImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideMoreHorizontal })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <table z-table>
          <caption z-table-caption>A list of your recent invoices.</caption>
          <thead z-table-header>
            <tr z-table-row>
              <th z-table-head class="w-[100px]">Invoice</th>
              <th z-table-head>Status</th>
              <th z-table-head>Method</th>
              <th z-table-head class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody z-table-body>
            @for (invoice of recentInvoices; track invoice.invoice) {
              <tr z-table-row>
                <td z-table-cell class="font-medium">{{ invoice.invoice }}</td>
                <td z-table-cell>{{ invoice.paymentStatus }}</td>
                <td z-table-cell>{{ invoice.paymentMethod }}</td>
                <td z-table-cell class="text-right">{{ invoice.totalAmount }}</td>
              </tr>
            }
          </tbody>
        </table>
      </z-example>

      <z-example zTitle="With Footer">
        <table z-table>
          <caption z-table-caption>A list of your recent invoices.</caption>
          <thead z-table-header>
            <tr z-table-row>
              <th z-table-head class="w-[100px]">Invoice</th>
              <th z-table-head>Status</th>
              <th z-table-head>Method</th>
              <th z-table-head class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody z-table-body>
            @for (invoice of recentInvoices; track invoice.invoice) {
              <tr z-table-row>
                <td z-table-cell class="font-medium">{{ invoice.invoice }}</td>
                <td z-table-cell>{{ invoice.paymentStatus }}</td>
                <td z-table-cell>{{ invoice.paymentMethod }}</td>
                <td z-table-cell class="text-right">{{ invoice.totalAmount }}</td>
              </tr>
            }
          </tbody>
          <tfoot z-table-footer>
            <tr z-table-row>
              <td z-table-cell colspan="3">Total</td>
              <td z-table-cell class="text-right">$2,500.00</td>
            </tr>
          </tfoot>
        </table>
      </z-example>

      <z-example zTitle="Simple">
        <table z-table>
          <thead z-table-header>
            <tr z-table-row>
              <th z-table-head>Name</th>
              <th z-table-head>Email</th>
              <th z-table-head class="text-right">Role</th>
            </tr>
          </thead>
          <tbody z-table-body>
            @for (person of people; track person.email) {
              <tr z-table-row>
                <td z-table-cell class="font-medium">{{ person.name }}</td>
                <td z-table-cell>{{ person.email }}</td>
                <td z-table-cell class="text-right">{{ person.role }}</td>
              </tr>
            }
          </tbody>
        </table>
      </z-example>

      <z-example zTitle="With Badges">
        <table z-table>
          <thead z-table-header>
            <tr z-table-row>
              <th z-table-head>Task</th>
              <th z-table-head>Status</th>
              <th z-table-head class="text-right">Priority</th>
            </tr>
          </thead>
          <tbody z-table-body>
            @for (row of tasks; track row.task) {
              <tr z-table-row>
                <td z-table-cell class="font-medium">{{ row.task }}</td>
                <td z-table-cell>
                  <span [class]="row.statusClass">{{ row.status }}</span>
                </td>
                <td z-table-cell class="text-right">
                  <span [class]="row.priorityClass">{{ row.priority }}</span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </z-example>

      <z-example zTitle="With Actions">
        <table z-table>
          <thead z-table-header>
            <tr z-table-row>
              <th z-table-head>Product</th>
              <th z-table-head>Price</th>
              <th z-table-head class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody z-table-body>
            @for (row of products; track row.product) {
              <tr z-table-row>
                <td z-table-cell class="font-medium">{{ row.product }}</td>
                <td z-table-cell>{{ row.price }}</td>
                <td z-table-cell class="text-right">
                  <button
                    type="button"
                    z-button
                    zType="ghost"
                    zSize="icon"
                    class="size-8"
                    z-dropdown
                    [zDropdownMenu]="actions"
                  >
                    <ng-icon name="lucideMoreHorizontal" />
                    <span class="sr-only">Open menu</span>
                  </button>
                  <z-dropdown-menu-content #actions="zDropdownMenuContent" zAlign="end">
                    <z-dropdown-menu-item>Edit</z-dropdown-menu-item>
                    <z-dropdown-menu-item>Duplicate</z-dropdown-menu-item>
                    <z-dropdown-menu-separator />
                    <z-dropdown-menu-item zVariant="destructive">Delete</z-dropdown-menu-item>
                  </z-dropdown-menu-content>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </z-example>

      <z-example zTitle="With Select">
        <table z-table>
          <thead z-table-header>
            <tr z-table-row>
              <th z-table-head>Task</th>
              <th z-table-head>Assignee</th>
              <th z-table-head>Status</th>
            </tr>
          </thead>
          <tbody z-table-body>
            @for (row of assignments; track row.task) {
              <tr z-table-row>
                <td z-table-cell class="font-medium">{{ row.task }}</td>
                <td z-table-cell>
                  <z-select class="w-40" [zValue]="row.assignee">
                    <z-select-group>
                      @for (person of assignees; track person.value) {
                        <z-select-item [zValue]="person.value">{{ person.label }}</z-select-item>
                      }
                    </z-select-group>
                  </z-select>
                </td>
                <td z-table-cell>{{ row.status }}</td>
              </tr>
            }
          </tbody>
        </table>
      </z-example>

      <z-example zTitle="With Input">
        <table z-table>
          <thead z-table-header>
            <tr z-table-row>
              <th z-table-head>Product</th>
              <th z-table-head>Quantity</th>
              <th z-table-head>Price</th>
            </tr>
          </thead>
          <tbody z-table-body>
            @for (row of products; track row.product) {
              <tr z-table-row>
                <td z-table-cell class="font-medium">{{ row.product }}</td>
                <td z-table-cell>
                  <input z-input type="number" class="h-8 w-20" min="0" [value]="row.quantity" />
                </td>
                <td z-table-cell>{{ row.price }}</td>
              </tr>
            }
          </tbody>
        </table>
      </z-example>
    </z-example-wrapper>
  `,
})
export class TableExampleComponent {
  protected readonly recentInvoices = INVOICES.slice(0, 3);
  protected readonly people = PEOPLE;
  protected readonly tasks = TASKS;
  protected readonly products = PRODUCTS;
  protected readonly assignments = ASSIGNMENTS;
  protected readonly assignees = ASSIGNEES;
}
