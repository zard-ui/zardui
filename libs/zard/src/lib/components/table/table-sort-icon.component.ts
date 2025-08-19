import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'z-table-sort-icon',
  standalone: true,
  template: `
    <span aria-hidden="true">{{ icon() }}</span>
    <span class="visually-hidden">{{ label() }}</span>
  `,
  styles: [
    `
      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
      }
    `,
  ],
})
export class ZardTableSortIconComponent {
  readonly direction = input<'asc' | 'desc' | null>();

  readonly icon = computed(() => {
    switch (this.direction()) {
      case 'asc':
        return '▲';
      case 'desc':
        return '▼';
      default:
        return '⇅';
    }
  });

  readonly label = computed(() => {
    switch (this.direction()) {
      case 'asc':
        return 'Sorted ascending';
      case 'desc':
        return 'Sorted descending';
      default:
        return 'Not sorted';
    }
  });
}
