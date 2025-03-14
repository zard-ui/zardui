import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  standalone: true,
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <span z-checkbox disabled>Disabled</span>
    <span z-checkbox disabled [(ngModel)]="checked">Disabled</span>
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
export class ZardDemoCheckboxDisabledComponent {
  checked = true;
}
