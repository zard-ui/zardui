```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardRadioComponent } from '../radio.component';

@Component({
  selector: 'z-demo-radio-disabled',
  standalone: true,
  imports: [ZardRadioComponent, FormsModule],
  template: `
    <span z-radio name="radio" [(ngModel)]="val" value="a" [disabled]="true">Disabled</span>
    <span z-radio name="radio" [(ngModel)]="val" value="b" [disabled]="true">Disabled</span>
  `,
})
export class ZardDemoRadioDisabledComponent {
  val = 'a';
}

```