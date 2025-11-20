```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardRadioComponent } from '../radio.component';

@Component({
  selector: 'z-demo-radio-default',
  imports: [ZardRadioComponent, FormsModule],
  standalone: true,
  template: `
    <div class="flex flex-col gap-3">
      <span z-radio name="option" [(ngModel)]="selected" value="default">Default</span>
      <span z-radio name="option" [(ngModel)]="selected" value="comfortable">Comfortable</span>
      <span z-radio name="option" [(ngModel)]="selected" value="compact">Compact</span>
    </div>
  `,
})
export class ZardDemoRadioDefaultComponent {
  selected = 'default';
}

```