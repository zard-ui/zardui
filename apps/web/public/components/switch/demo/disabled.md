```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZardSwitchComponent } from '../switch.component';

@Component({
  selector: 'z-demo-switch-disabled',
  imports: [ZardSwitchComponent, FormsModule, ReactiveFormsModule],
  template: `
    <z-switch [(zChecked)]="model" [zDisabled]="true">Disabled</z-switch>
    <z-switch [formControl]="checkControl">Disabled in forms</z-switch>
  `,
})
export class ZardDemoSwitchDisabledComponent {
  model = false;
  checkControl = new FormControl({ value: true, disabled: true });
}

```