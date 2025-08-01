import { Component, OnInit, signal } from '@angular/core';
import { TableState, ZardTableDataSource } from '../table';
import { ZardTableComponent } from '../table.component';
import { mockFetchUsers } from '../table.mockApi';
import { ZardTableModule } from '../table.module';

@Component({
  standalone: true,
  imports: [ZardTableComponent, ZardTableModule],
  template: ` <z-table [columns]="columns" [pagination]="true" [zOrdering]="true" [filtering]="true" [dataSource]="dataSource()" (stateChange)="onStateChange($event)"></z-table> `,
})
export class ZardDemoTableFilteredComponent implements OnInit {
  dataSource = signal<ZardTableDataSource<Record<string, string | number>>>({ data: [] });

  columns = [
    { header: 'Name', accessor: 'name', filterable: true },
    { header: 'Age', accessor: 'age' },
    { header: 'Email', accessor: 'email', filterable: true },
  ];

  ngOnInit(): void {
    this.onStateChange({ pageIndex: 0, pageSize: 5, totalItems: 0, search: '' });
  }

  onStateChange(state: TableState) {
    mockFetchUsers(state).then(response => {
      this.dataSource.set({
        data: response.data,
        meta: {
          pagination: response.meta?.pagination,
          filtering: {
            search: state.search || '',
          },
        },
      });
    });
  }
}
