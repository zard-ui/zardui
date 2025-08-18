```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardSelectItemComponent } from '../select-item.component';
import { ZardSelectComponent } from '../select.component';

@Component({
  standalone: true,
  imports: [FormsModule, ZardSelectComponent, ZardSelectItemComponent],
  template: `
    <z-select placeholder="Selecione uma fruta" [(ngModel)]="defaultValue">
      <z-select-item value="apple">Apple</z-select-item>
      <z-select-item value="banana">Banana</z-select-item>
      <z-select-item value="blueberry">Blueberry</z-select-item>
      <z-select-item value="grapes">Grapes</z-select-item>
      <z-select-item value="pineapple" disabled>Pineapple</z-select-item>
    </z-select>
  `,
})
export class ZardDemoSelectBasicComponent {
  defaultValue = 'apple';
}

```