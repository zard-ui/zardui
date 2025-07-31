```angular-ts showLineNumbers
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardRadioComponent } from '../radio.component';

@Component({
  standalone: true,
  imports: [ZardRadioComponent, FormsModule],
  template: `
    <span z-radio name="radio" zType="secondary" [(ngModel)]="val" value="a"></span>
    <span z-radio name="radio" zType="secondary" [(ngModel)]="val" value="b">Secondary</span>
  `,
})
export class ZardDemoRadioSecondaryComponent {
  val = 'b';
}

```