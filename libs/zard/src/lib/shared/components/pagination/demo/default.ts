import { Component } from '@angular/core';

import { ZardPaginationImports } from '../pagination.imports';

@Component({
  selector: 'z-demo-pagination-default',
  imports: [ZardPaginationImports],
  template: `
    <z-pagination [zTotal]="5" [(zPageIndex)]="currentPage" />
  `,
})
export class ZardDemoPaginationDefaultComponent {
  protected currentPage = 2;
}
