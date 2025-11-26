```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@ngzard/ui/checkbox';

@Component({
  selector: 'z-demo-checkbox-destructive',
  imports: [ZardCheckboxComponent, FormsModule],
  standalone: true,
  template: `
    <span z-checkbox zType="destructive"></span>
    <span z-checkbox zType="destructive" [(ngModel)]="checked">Destructive Checked</span>
  `,
})
export class ZardDemoCheckboxDestructiveComponent {
  checked = true;
}

```