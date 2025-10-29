```angular-ts showLineNumbers copyButton
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardPaginationModule } from '../pagination.module';

@Component({
  selector: 'z-demo-pagination-default',
  standalone: true,
  imports: [ZardPaginationModule, FormsModule],
  template: ` <z-pagination [zPageIndex]="currentPage" [zTotal]="5" [(ngModel)]="currentPage" /> `,
})
export class ZardDemoPaginationDefaultComponent {
  protected currentPage = 2;
}

```
