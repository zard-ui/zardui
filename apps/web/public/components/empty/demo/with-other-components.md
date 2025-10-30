```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardComboboxComponent } from '../../combobox/combobox.component';
import { ZardCommandEmptyComponent } from '../../command/command-empty.component';
import { ZardCommandInputComponent } from '../../command/command-input.component';
import { ZardCommandListComponent } from '../../command/command-list.component';
import { ZardCommandComponent } from '../../command/command.component';
import { ZardSelectComponent } from '../../select/select.component';
import { ZardTableComponent } from '../../table/table.component';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-with-other',
  standalone: true,
  imports: [
    ZardCommandComponent,
    ZardCommandEmptyComponent,
    ZardCommandInputComponent,
    ZardCommandListComponent,
    ZardEmptyComponent,
    ZardComboboxComponent,
    ZardSelectComponent,
    ZardTableComponent,
  ],
  template: `
    <div class="flex flex-col gap-5">
      <div class="space-y-2">
        <h6 class="font-semibold text-sm">Combobox</h6>
        <z-combobox [options]="[]" class="w-[200px]" [placeholder]="'Select framework...'" [searchPlaceholder]="'Search framework...'" [emptyText]="'No framework found.'" />
      </div>

      <div class="space-y-2">
        <h6 class="font-semibold text-sm">Table</h6>
        <table z-table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td [colSpan]="2">
                <z-empty [zDescription]="'No data found.'" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="space-y-2">
        <h6 class="font-semibold text-sm">Command</h6>
        <z-command class="md:min-w-[500px]">
          <z-command-input placeholder="Search actions, files, and more..."></z-command-input>
          <z-command-list>
            <z-command-empty>
              <z-empty [zDescription]="'No commands found.'" />
            </z-command-empty>
          </z-command-list>
        </z-command>
      </div>

      <div class="space-y-2">
        <h6 class="font-semibold text-sm">Select</h6>
        <z-select placeholder="Select a fruit">
          <z-empty [zDescription]="'No fruits found.'" />
        </z-select>
      </div>
    </div>
  `,
})
export class ZardDemoEmptyWithOtherComponent {}

```