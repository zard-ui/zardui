```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '../checkbox.component';

@Component({
  selector: 'z-demo-checkbox-shape',
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <span z-checkbox zShape="circle" [(ngModel)]="checked1">Circle</span>
    <span z-checkbox zShape="square" [(ngModel)]="checked2">Square</span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCheckboxShapeComponent {
  checked1 = true;
  checked2 = true;
}

```