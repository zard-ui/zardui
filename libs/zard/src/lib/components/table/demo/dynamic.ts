import { Component, OnInit, signal } from '@angular/core';
import { TableState, ZardTableDataSource } from '../table';
import { ZardTableComponent } from '../table.component';
import { mockFetchUsers } from '../table.mockApi';
import { ZardTableModule } from '../table.module';

@Component({
  standalone: true,
  imports: [ZardTableComponent, ZardTableModule],
  template: ` <z-table [columns]="columns" [dataSource]="dataSource()" [pagination]="true" (stateChange)="onStateChange($event)"></z-table> `,
})
export class ZardDemoTableDynamicComponent implements OnInit {
  dataSource = signal<ZardTableDataSource<Record<string, string | number>>>({ data: [] });

  ngOnInit(): void {
    this.onStateChange({ pageIndex: 0, pageSize: 5, totalItems: 0 });
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
        },
      });
    });
  }

  columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Age', accessor: 'age' },
    { header: 'Email', accessor: 'email' },
  ];
}
