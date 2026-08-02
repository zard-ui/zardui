import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardTableImports } from '@/shared/components/table/table.imports';

interface Row {
  id: string;
  name: string;
  email: string;
  role: string;
}

const TABLE_DATA: readonly Row[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'Admin' },
  { id: '2', name: 'Marcus Rodriguez', email: 'marcus.rodriguez@example.com', role: 'User' },
  { id: '3', name: 'Priya Patel', email: 'priya.patel@example.com', role: 'User' },
  { id: '4', name: 'David Kim', email: 'david.kim@example.com', role: 'Editor' },
];

@Component({
  selector: 'z-demo-checkbox-table',
  imports: [ZardCheckboxComponent, ...ZardTableImports, FormsModule],
  template: `
    <table z-table>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head class="w-8">
            <z-checkbox zId="select-all-checkbox" [ngModel]="allSelected()" (checkChange)="toggleAll($event)" />
          </th>
          <th z-table-head>Name</th>
          <th z-table-head>Email</th>
          <th z-table-head>Role</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (row of rows; track row.id) {
          <tr z-table-row [attr.data-state]="isSelected(row.id) ? 'selected' : null">
            <td z-table-cell>
              <z-checkbox
                [zId]="'row-' + row.id + '-checkbox'"
                [ngModel]="isSelected(row.id)"
                (checkChange)="toggleRow(row.id, $event)"
              />
            </td>
            <td z-table-cell class="font-medium">{{ row.name }}</td>
            <td z-table-cell>{{ row.email }}</td>
            <td z-table-cell>{{ row.role }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class ZardDemoCheckboxTableComponent {
  protected readonly rows = TABLE_DATA;
  private readonly selectedRows = signal<ReadonlySet<string>>(new Set(['1']));

  protected readonly allSelected = computed(() => this.selectedRows().size === this.rows.length);

  protected isSelected(id: string): boolean {
    return this.selectedRows().has(id);
  }

  protected toggleAll(checked: boolean): void {
    this.selectedRows.set(checked ? new Set(this.rows.map(row => row.id)) : new Set());
  }

  protected toggleRow(id: string, checked: boolean): void {
    const next = new Set(this.selectedRows());
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    this.selectedRows.set(next);
  }
}
