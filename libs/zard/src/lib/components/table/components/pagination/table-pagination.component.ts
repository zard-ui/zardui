import { Component, input, output } from '@angular/core';
import { ZardButtonComponent } from '../../../button/button.component';

@Component({
  selector: 'z-table-pagination',
  standalone: true,
  exportAs: 'zTablePagination',
  imports: [ZardButtonComponent],
  template: `
    <nav class="flex justify-end gap-2 items-center mt-4" role="navigation" aria-label="Table pagination">
      <span class="sr-only">{{ pageSummary() }}</span>

      <button z-button zType="outline" zSize="sm" class="cursor-pointer" (click)="prev.emit()" [disabled]="disablePrev()" [attr.aria-label]="'Go to previous page'">
        Previous
      </button>

      <button z-button zType="outline" zSize="sm" class="cursor-pointer" (click)="next.emit()" [disabled]="disableNext()" [attr.aria-label]="'Go to next page'">Next</button>
    </nav>
  `,
})
export class ZardTablePaginationComponent {
  readonly pageSummary = input<string>();
  readonly disableNext = input<boolean>();
  readonly disablePrev = input<boolean>();
  readonly prev = output<void>();
  readonly next = output<void>();
}
