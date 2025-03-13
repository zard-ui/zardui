import { Component } from '@angular/core';

import { ZardCheckboxComponent } from '../checkbox.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <span z-checkbox>Default</span>
    <span z-checkbox zSize="lg" [(ngModel)]="checked">Large</span>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 24px;
      }
    `,
  ],
})
export class ZardDemoCheckboxSizeComponent {
  checked = true;
}
