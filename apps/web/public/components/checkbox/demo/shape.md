```angular-ts showLineNumbers
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  standalone: true,
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <span z-checkbox zShape="circle" [(ngModel)]="checked">Cicle</span>
    <span z-checkbox zShape="square" [(ngModel)]="checked">Square</span>
  `,
})
export class ZardDemoCheckboxShapeComponent {
  checked = true;
}

```