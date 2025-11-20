import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  selector: 'z-demo-checkbox-default',
  imports: [ZardCheckboxComponent, FormsModule],
  standalone: true,
  template: `
    <span z-checkbox></span>
    <span z-checkbox [(ngModel)]="checked">Default Checked</span>
  `,
})
export class ZardDemoCheckboxDefaultComponent {
  checked = true;
}
