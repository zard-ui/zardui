```angular-ts showLineNumbers
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  standalone: true,
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <span z-checkbox zType="destructive"></span>
    <span z-checkbox zType="destructive" [(ngModel)]="checked">Destructive Checked</span>
  `,
})
export class ZardDemoCheckboxDestructiveComponent {
  checked = true;
}

```