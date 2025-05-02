import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ZardTableModule } from './table.module';

@Component({
  selector: 'z-table',
  exportAs: 'zTable',
  imports: [ZardTableModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: ` <div class="rounded-md border relative w-full overflow-auto">
    @if (columns.length && data.length) {
      <table z-table>
        @if (columns.length) {
          <thead>
            <tr z-tr>
              @for (column of columns; track column.accessor) {
                <th z-th>{{ column.header }}</th>
              }
            </tr>
          </thead>
        }

        @if (data.length) {
          <tbody>
            @for (row of data; track row) {
              <tr z-tr>
                @for (column of columns; track column.accessor) {
                  <td z-td>{{ row[column.accessor] }}</td>
                }
              </tr>
            }
          </tbody>
        } @else {
          <tbody z-tbody>
            <tr z-tr>
              <td z-td [attr.colspan]="columns.length || 1" class="text-center">No data available.</td>
            </tr>
          </tbody>
        }
      </table>
    } @else {
      <table z-table>
        <ng-content></ng-content>
      </table>
    }
  </div>`,
})
export class ZardTableComponent {
  @Input() columns: { header: string; accessor: string }[] = [];
  @Input() data: Array<Record<string, any>> = [];
}
