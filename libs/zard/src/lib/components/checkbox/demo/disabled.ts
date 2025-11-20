import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  selector: 'z-demo-checkbox-disabled',
  imports: [ZardCheckboxComponent, FormsModule],
  standalone: true,
  template: `
    <span z-checkbox disabled>Disabled</span>
    <span z-checkbox disabled [(ngModel)]="checked">Disabled</span>
  `,
})
export class ZardDemoCheckboxDisabledComponent {
  checked = true;
}
