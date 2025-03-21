import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZardSwitchComponent } from '../switch.component';

@Component({
  standalone: true,
  imports: [ZardSwitchComponent, FormsModule, ReactiveFormsModule],
  template: `
    <z-switch [(ngModel)]="model" disabled>Disabled</z-switch>
    <z-switch [formControl]="checkControl">Disabled in forms</z-switch>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 24px;
      }
    `,
  ],
})
export class ZardDemoSwitchDisabledComponent {
  model = false;
  checkControl = new FormControl({ value: true, disabled: true });
}
