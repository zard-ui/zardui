import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { ZardTableModule } from './table.module';

@Component({
  selector: 'z-table',
  exportAs: 'zTable',
  imports: [ZardTableModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: ` <div class="rounded-md border relative w-full overflow-auto">
    <table z-table role="table">
      @if (columns().length && data().length) {
        <thead>
          <tr z-tr>
            @for (column of columns(); track column.accessor) {
              <th z-th zThSortable="column.accessor" scope="col">
                {{ column.header }}
              </th>
            }
          </tr>
        </thead>

        <tbody>
          @for (row of data(); track row) {
            <tr z-tr>
              @for (column of columns(); track column.accessor) {
                <td z-td>{{ row[column.accessor] }}</td>
              }
            </tr>
          }
        </tbody>
      } @else {
        <ng-content></ng-content>
      }
    </table>
  </div>`,
  host: {
    '[class.z-ordering-enabled]': 'zOrdering()',
  },
  styles: [
    `
      .z-ordering-enabled th[zThSortable]:hover {
        cursor: pointer;
      }
    `,
  ],
})
export class ZardTableComponent {
  readonly columns = input<{ header: string; accessor: string }[]>([]);
  readonly data = input<Array<Record<string, string | number>>>([]);
  readonly zOrdering = input(false);
  readonly isOrderingEnabled = computed(() => this.zOrdering());
}
