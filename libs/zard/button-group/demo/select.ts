import { Component, signal } from '@angular/core';

import { ZardInputDirective } from '@ngzard/ui/input';
import { ZardSelectItemComponent, ZardSelectComponent } from '@ngzard/ui/select';

import { ZardButtonGroupComponent } from '../button-group.component';

@Component({
  selector: 'z-demo-button-group-select',
  imports: [ZardButtonGroupComponent, ZardSelectComponent, ZardSelectItemComponent, ZardInputDirective],
  template: `
    <z-button-group>
      <z-select [(zValue)]="currency" class="w-fit">
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
