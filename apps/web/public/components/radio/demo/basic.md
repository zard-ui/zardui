```angular-ts showLineNumbers
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardRadioComponent } from '../radio.component';

@Component({
  standalone: true,
  imports: [ZardRadioComponent, FormsModule],
  template: `
    <span z-radio name="radio" [(ngModel)]="val" value="a">Default</span>
    <span z-radio name="radio" zType="destructive" [(ngModel)]="val" value="b">Destructive</span>
    <span z-radio name="radio" zType="secondary" [(ngModel)]="val" value="c">Secondary</span>
    <span z-radio name="radio" [(ngModel)]="val" value="d">Directive usage</span>
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
export class ZardDemoRadioBasicComponent {
  val = 'a';
}

```