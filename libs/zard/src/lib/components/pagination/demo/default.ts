import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardPaginationModule } from '../pagination.module';

@Component({
  standalone: true,
  imports: [ZardPaginationModule, FormsModule],
  template: ` <z-pagination [zPageIndex]="currentPage" [zTotal]="5" [(ngModel)]="currentPage" /> `,
})
export class ZardDemoPaginationComponent {
  protected currentPage = 2;
}
