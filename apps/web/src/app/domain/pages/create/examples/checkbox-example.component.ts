import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@zard/components/checkbox';
import { ZardFieldImports } from '@zard/components/field';
import { ZardTableImports } from '@zard/components/table';

import { ExampleImports } from './example.component';

const TABLE_DATA = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'Admin' },
  { id: '2', name: 'Marcus Rodriguez', email: 'marcus.rodriguez@example.com', role: 'User' },
  { id: '3', name: 'Priya Patel', email: 'priya.patel@example.com', role: 'User' },
  { id: '4', name: 'David Kim', email: 'david.kim@example.com', role: 'Editor' },
] as const;

const DESKTOP_ITEMS = [
  { id: 'finder-pref-9k2-hard-disks-ljj', label: 'Hard disks' },
  { id: 'finder-pref-9k2-external-disks-1yg', label: 'External disks' },
  { id: 'finder-pref-9k2-cds-dvds-fzt', label: 'CDs, DVDs, and iPods' },
  { id: 'finder-pref-9k2-connected-servers-6l2', label: 'Connected servers' },
] as const;

/** shadcn/ui's `checkbox-example`, in zard. */
@Component({
  selector: 'z-checkbox-example',
  imports: [FormsModule, ExampleImports, ZardCheckboxComponent, ZardFieldImports, ZardTableImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper>
      <z-example zTitle="Basic">
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="terms" />
          <label z-field-label for="terms">Accept terms and conditions</label>
        </div>
      </z-example>

      <z-example zTitle="With Description">
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="terms-2" [ngModel]="true" />
          <div z-field-content>
            <label z-field-label for="terms-2">Accept terms and conditions</label>
            <p z-field-description>By clicking this checkbox, you agree to the terms and conditions.</p>
          </div>
        </div>
      </z-example>

      <z-example zTitle="Invalid">
        <div z-field zOrientation="horizontal" data-invalid>
          <z-checkbox zId="terms-3" zInvalid />
          <label z-field-label for="terms-3">Accept terms and conditions</label>
        </div>
      </z-example>

      <z-example zTitle="Disabled">
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="toggle" zDisabled />
          <label z-field-label for="toggle">Enable notifications</label>
        </div>
      </z-example>

      <z-example zTitle="With Title">
        <div z-field-group>
          <label z-field-label for="toggle-2">
            <div z-field zOrientation="horizontal">
              <z-checkbox zId="toggle-2" [ngModel]="true" />
              <div z-field-content>
                <div z-field-title>Enable notifications</div>
                <p z-field-description>You can enable or disable notifications at any time.</p>
              </div>
            </div>
          </label>
          <label z-field-label for="toggle-4">
            <div z-field zOrientation="horizontal" data-disabled>
              <z-checkbox zId="toggle-4" zDisabled />
              <div z-field-content>
                <div z-field-title>Enable notifications</div>
                <p z-field-description>You can enable or disable notifications at any time.</p>
              </div>
            </div>
          </label>
        </div>
      </z-example>

      <z-example zTitle="In Table">
        <table z-table>
          <thead z-table-header>
            <tr z-table-row>
              <th z-table-head class="w-8">
                <z-checkbox zId="select-all" [ngModel]="allSelected()" (checkChange)="toggleAll($event)" />
              </th>
              <th z-table-head>Name</th>
              <th z-table-head>Email</th>
              <th z-table-head>Role</th>
            </tr>
          </thead>
          <tbody z-table-body>
            @for (row of rows; track row.id) {
              <tr z-table-row [attr.data-state]="selectedRows().has(row.id) ? 'selected' : null">
                <td z-table-cell>
                  <z-checkbox
                    [zId]="'row-' + row.id"
                    [ngModel]="selectedRows().has(row.id)"
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
      </z-example>

      <z-example zTitle="Group">
        <div z-field>
          <label z-field-label>Show these items on the desktop:</label>
          @for (item of desktopItems; track item.id) {
            <div z-field zOrientation="horizontal">
              <z-checkbox [zId]="item.id" />
              <label z-field-label [for]="item.id" class="font-normal">{{ item.label }}</label>
            </div>
          }
        </div>
      </z-example>
    </z-example-wrapper>
  `,
})
export class CheckboxExampleComponent {
  protected readonly rows = TABLE_DATA;
  protected readonly desktopItems = DESKTOP_ITEMS;
  protected readonly selectedRows = signal<ReadonlySet<string>>(new Set(['1']));
  protected readonly allSelected = computed(() => this.selectedRows().size === this.rows.length);

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
