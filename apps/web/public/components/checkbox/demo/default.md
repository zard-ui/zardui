```angular-ts showLineNumbers
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  standalone: true,
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <span z-checkbox></span>
    <span z-checkbox [(ngModel)]="checked">Default Checked</span>
  `,
})
export class ZardDemoCheckboxDefaultComponent {
  checked = true;
}

```