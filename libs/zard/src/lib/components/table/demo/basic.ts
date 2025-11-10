import { Component, OnInit, signal } from '@angular/core';
import { ZardTableComponent } from '../components/table.component';
import { ZardTableModule } from '../components/table.module';
import { TableState, ZardTableDataSource } from '../table';
import { mockFetchUsers } from '../table.mockApi';

@Component({
  standalone: true,
  imports: [ZardTableComponent, ZardTableModule],
  template: `
    <z-table
      [columns]="columns"
      [dataSource]="dataSource()"
      [enableFiltering]="true"
      [enableColumnSelector]="true"
      [enablePagination]="true"
      [enableOrdering]="true"
      (stateChange)="onStateChange($event)"
      zSize="default"
      zType="bordered"
    ></z-table>
  `,
})
export class ZardDemoTableBasicComponent implements OnInit {
  dataSource = signal<ZardTableDataSource<Record<string, string | number>>>({ data: [] });

  columns = [
    { header: 'Movie', accessor: 'title', sortable: true, filterable: true },
    { header: 'Director', accessor: 'director', filterable: true },
    { header: 'Release Year', accessor: 'year', sortable: true },
  ];

  ngOnInit(): void {
    this.onStateChange({
      pageIndex: 0,
      pageSize: 5,
      totalItems: 0,
      search: '',
      field: 'id',
      direction: 'asc',
    });
  }

  onStateChange(state: TableState) {
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
          filtering: {
            search: state.search || '',
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
