import { ChangeDetectionStrategy, Component, computed, effect, input, output, ViewEncapsulation } from '@angular/core';
import { ZardButtonComponent } from '../components';
import { TableState, ZardTableDataSource } from './table';
import { ZardTableModule } from './table.module';
import { ZardTableService } from './table.service';

@Component({
  selector: 'z-table',
  exportAs: 'zTable',
  imports: [ZardTableModule, ZardButtonComponent],
  providers: [ZardTableService],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div z-table-wrapper>
      <table z-table role="table">
        @if (columns().length && dataSource().data.length) {
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
            @for (row of dataSource().data; track row) {
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
      <div z-table-pagination>
        <button z-button zType="outline" zSize="sm" (click)="goPrev()" [disabled]="disablePrev()">Previous</button>
        <button z-button zType="outline" zSize="sm" (click)="goNext()" [disabled]="disableNext()">Next</button>
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
  readonly dataSource = input<ZardTableDataSource<Record<string, string | number>>>({ data: [] });

  readonly pagination = input<boolean>();

  readonly zOrdering = input(false);
  readonly isOrderingEnabled = computed(() => this.zOrdering());

  readonly stateChange = output<TableState>();

  readonly disableNext = computed(() => !this.tableService.hasNextPage());
  readonly disablePrev = computed(() => !this.tableService.hasPrevPage());

  constructor(private readonly tableService: ZardTableService) {
    effect(() => {
      const meta = this.dataSource().meta?.pagination;
      if (meta) {
        this.tableService.updateState(meta);
      }
    });
  }

  goNext() {
    this.tableService.nextPage();
    this.stateChange.emit(this.tableService.tableState());
  }

  goPrev() {
    this.tableService.prevPage();
    this.stateChange.emit(this.tableService.tableState());
  }
}
