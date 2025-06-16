import { ChangeDetectionStrategy, Component, computed, input, signal, ViewEncapsulation } from '@angular/core';
import { ZardButtonComponent } from '../components';
import { ZardTableModule } from './table.module';

@Component({
  selector: 'z-table',
  exportAs: 'zTable',
  imports: [ZardTableModule, ZardButtonComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="rounded-md border">
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
            @for (row of paginatedData(); track row) {
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
    </div>

    @if (pagination()) {
      <div class="flex justify-end gap-2 items-center mt-4">
        @if (hasPrevPage()) {
          <button z-button zType="outline" zSize="sm" (click)="goPrev()">Previous</button>
        }
        @if (hasNextPage()) {
          <button z-button zType="outline" zSize="sm" (click)="goNext()">Next</button>
        }
      </div>
    }
  `,
  host: {
    '[class.z-ordering-enabled]': 'zOrdering()',
  },
  styles: [
    `
      .z-ordering-enabled th[zthsortable]:hover {
        cursor: pointer;
      }
    `,
  ],
})
export class ZardTableComponent {
  readonly columns = input<{ header: string; accessor: string }[]>([]);
  readonly data = input<Array<Record<string, string | number>>>([]);
  readonly zOrdering = input(false);
  readonly pagination = input<number>();
  readonly isOrderingEnabled = computed(() => this.zOrdering());

  readonly startSlice = signal(0);

  readonly pageSize = computed(() => this.pagination() ?? 0);

  readonly endSlice = computed(() => this.startSlice() + this.pageSize());

  readonly paginatedData = computed(() => {
    if (!this.pagination()) return this.data();
    return this.data().slice(this.startSlice(), this.endSlice());
  });

  readonly hasNextPage = computed(() => {
    return this.pageSize() > 0 && this.endSlice() < this.data().length;
  });

  readonly hasPrevPage = computed(() => {
    return this.pageSize() > 0 && this.startSlice() > 0;
  });

  goNext() {
    if (this.hasNextPage()) {
      this.startSlice.update(start => start + this.pageSize());
    }
  }

  goPrev() {
    if (this.hasPrevPage()) {
      this.startSlice.update(start => Math.max(0, start - this.pageSize()));
    }
  }
}
