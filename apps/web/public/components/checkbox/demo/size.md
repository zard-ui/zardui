```angular-ts showLineNumbers
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  standalone: true,
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <span z-checkbox>Default</span>
    <span z-checkbox zSize="lg" [(ngModel)]="checked">Large</span>
  `,
})
export class ZardDemoCheckboxSizeComponent {
  checked = true;
}

```