```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardPaginationModule } from '../pagination.module';

@Component({
  selector: 'z-demo-pagination-default',
  imports: [ZardPaginationModule],
  template: `
    <z-pagination [zTotal]="5" [(zPageIndex)]="currentPage" />
  `,
})
export class ZardDemoPaginationDefaultComponent {
  protected currentPage = 2;
}

```
