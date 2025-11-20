```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  selector: 'z-demo-checkbox-shape',
  imports: [ZardCheckboxComponent, FormsModule],
  standalone: true,
  template: `
    <span z-checkbox zShape="circle" [(ngModel)]="checked">Cicle</span>
    <span z-checkbox zShape="square" [(ngModel)]="checked">Square</span>
  `,
})
export class ZardDemoCheckboxShapeComponent {
  checked = true;
}

```