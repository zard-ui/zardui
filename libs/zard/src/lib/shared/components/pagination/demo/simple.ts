import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardPaginationImports } from '../pagination.imports';

@Component({
  selector: 'z-demo-pagination-simple',
  imports: [ZardPaginationImports],
  template: `
    <z-pagination [zTotal]="5" [(zPageIndex)]="currentPage" zSimple />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPaginationSimpleComponent {
  protected currentPage = 2;
}
