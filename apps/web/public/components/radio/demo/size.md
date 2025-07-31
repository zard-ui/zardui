```angular-ts showLineNumbers
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardRadioComponent } from '../radio.component';

@Component({
  standalone: true,
  imports: [ZardRadioComponent, FormsModule],
  template: `
    <span name="radio-size" z-radio zSize="sm" [(ngModel)]="val" value="small">Small</span>
    <span name="radio-size" z-radio [(ngModel)]="val" value="default">Default</span>
    <span name="radio-size" z-radio zSize="lg" [(ngModel)]="val" value="large">Large</span>
  `,
})
export class ZardDemoRadioSizeComponent {
  val = 'large';
}

```