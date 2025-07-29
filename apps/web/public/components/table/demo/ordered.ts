import { Component, OnInit, signal } from '@angular/core';
import { TableState, ZardTableDataSource } from '../table';
import { ZardTableComponent } from '../table.component';
import { mockFetchUsers } from '../table.mockApi';
import { ZardTableModule } from '../table.module';

@Component({
  standalone: true,
  imports: [ZardTableComponent, ZardTableModule],
  template: `<z-table [columns]="columns" [pagination]="true" [dataSource]="dataSource()" [zOrdering]="true" (stateChange)="onStateChange($event)"></z-table>`,
})
export class ZardDemoTableOrderedComponent implements OnInit {
  dataSource = signal<ZardTableDataSource<Record<string, string | number>>>({ data: [] });

  columns = [
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Age', accessor: 'age', sortable: true },
    { header: 'Email', accessor: 'email' },
  ];

  ngOnInit(): void {
    this.onStateChange();
  }

  onStateChange(state: TableState = { pageIndex: 0, pageSize: 5, totalItems: 0, field: 'id', direction: 'asc' }) {
    mockFetchUsers(state).then(response => {
      this.dataSource.set({
        data: response.data,
        meta: {
          pagination: {
            totalItems: response.meta?.pagination?.totalItems || 0,
            pageSize: response.meta?.pagination?.pageSize || 5,
            pageIndex: response.meta?.pagination?.pageIndex || 0,
            first: response.meta?.pagination?.first,
            last: response.meta?.pagination?.last,
          },
          sorting: {
            field: state.field ?? 'id',
            direction: state.direction ?? 'asc',
          },
        },
      });
    });
  }
}
