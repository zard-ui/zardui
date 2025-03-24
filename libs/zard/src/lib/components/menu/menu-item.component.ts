import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-menu-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="text-gray-700 dark:text-gray-200 block w-full px-4 py-2 rounded-sm text-left text-sm hover:bg-gray-100 dark:hover:bg-accent hover:text-gray-900 dark:hover:text-gray-100"
      role="menuitem"
      [class.disabled]="disabled()"
      [disabled]="disabled()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: `
    .disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
})
export class ZardMenuItemComponent {
  disabled = input<boolean>(false);
}
