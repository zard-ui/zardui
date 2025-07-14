import { Component, OnInit, signal } from '@angular/core';
import { ZardTableDataSource } from '../table';
import { ZardTableComponent } from '../table.component';
import { mockFetchUsers } from '../table.mockApi';
import { ZardTableModule } from '../table.module';

@Component({
  standalone: true,
  imports: [ZardTableComponent, ZardTableModule],
  template: ` <z-table [columns]="columns" [dataSource]="dataSource()"></z-table> `,
})
export class ZardDemoTableBasicComponent implements OnInit {
  dataSource = signal<ZardTableDataSource<Record<string, string | number>>>({ data: [] });

  columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Age', accessor: 'age' },
    { header: 'Email', accessor: 'email' },
  ];

  ngOnInit(): void {
    mockFetchUsers({ pageIndex: 0, pageSize: 5, totalItems: 0 }).then(response => {
      this.dataSource.set({
        data: response.data,
      });
    });
  }
}
