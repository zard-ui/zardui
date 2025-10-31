```angular-ts showLineNumbers copyButton
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  selector: 'z-demo-checkbox-disabled',
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