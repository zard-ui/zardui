import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardRadioComponent } from '../radio.component';

@Component({
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
