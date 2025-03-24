import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'z-menu-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 hover:text-gray-900"
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
