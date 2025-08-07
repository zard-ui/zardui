```angular-ts showLineNumbers
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardRadioComponent } from '../radio.component';

@Component({
  standalone: true,
  imports: [ZardRadioComponent, FormsModule],
  template: `
    <span z-radio name="radio" zType="destructive" [(ngModel)]="val" value="a"></span>
    <span z-radio name="radio" zType="destructive" [(ngModel)]="val" value="b">Destructive</span>
  `,
})
export class ZardDemoRadioDestructiveComponent {
  val = 'b';
}

```