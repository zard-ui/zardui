```angular-ts showLineNumbers copyButton
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardInputDirective } from '../../input/input.directive';
import { ZardSelectItemComponent } from '../../select/select-item.component';
import { ZardSelectComponent } from '../../select/select.component';
import { ZardButtonGroupComponent } from '../button-group.component';

@Component({
  selector: 'z-demo-button-group-select',
  imports: [ZardButtonGroupComponent, ZardSelectComponent, ZardSelectItemComponent, ZardInputDirective, FormsModule],
  template: `
    <z-button-group>
      <z-select [(ngModel)]="currency" class="w-fit">
        @for (cur of CURRENCIES; track cur.code) {
          <z-select-item [zValue]="cur.code">{{ cur.symbol }}</z-select-item>
        }
      </z-select>
      <input z-input placeholder="10.00" type="number" step="0.1" />
    </z-button-group>
  `,
})
export class ZardDemoButtonGroupSelectComponent {
  protected readonly CURRENCIES = [
    { symbol: '€', code: 'EUR' },
    { symbol: '$', code: 'USD' },
    { symbol: '£', code: 'GBP' },
    { symbol: '¥', code: 'JPY' },
  ];
  protected readonly currency = signal(this.CURRENCIES[1].code);
}

```