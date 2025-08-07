```angular-ts showLineNumbers
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  standalone: true,
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <span z-checkbox disabled>Disabled</span>
    <span z-checkbox disabled [(ngModel)]="checked">Disabled</span>
  `,
})
export class ZardDemoCheckboxDisabledComponent {
  checked = true;
}

```