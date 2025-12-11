import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardPaginationModule } from '../pagination.module';

@Component({
  selector: 'z-demo-pagination-default',
  imports: [ZardPaginationModule, FormsModule],
  standalone: true,
  template: `
    <z-pagination [zPageIndex]="currentPage" [zTotal]="5" [(ngModel)]="currentPage" />
  `,
})
export class ZardDemoPaginationDefaultComponent {
  protected currentPage = 2;
}
