import { Component } from '@angular/core';

import { ZardPaginationModule } from '../pagination.module';

@Component({
  standalone: true,
  imports: [ZardPaginationModule],
  template: ` <z-pagination [zPageIndex]="currentPage" [zTotal]="5" (zPageChange)="currentPage = $event" /> `,
})
export class ZardDemoPaginationComponent {
  currentPage = 2;
}
