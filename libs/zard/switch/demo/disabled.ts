import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZardSwitchComponent } from '@ngzard/ui/switch';

@Component({
  selector: 'z-demo-switch-disabled',
  imports: [ZardSwitchComponent, FormsModule, ReactiveFormsModule],
  standalone: true,
  template: `
    <z-switch [(ngModel)]="model" disabled>Disabled</z-switch>
    <z-switch [formControl]="checkControl">Disabled in forms</z-switch>
  `,
})
export class ZardDemoSwitchDisabledComponent {
  model = false;
  checkControl = new FormControl({ value: true, disabled: true });
}
