```angular-ts showLineNumbers
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardRadioComponent } from '../radio.component';

@Component({
  standalone: true,
  imports: [ZardRadioComponent, FormsModule],
  template: `
    <span name="radio-disabled" z-radio disabled> Disabled </span>
    <span name="radio-disabled" z-radio disabled [(ngModel)]="selected" [value]="true"> Disabled Selected </span>
  `,
})
export class ZardDemoRadioDisabledComponent {
  selected = true;
}

```