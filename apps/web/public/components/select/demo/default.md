```angular-ts showLineNumbers copyButton
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardSelectItemComponent } from '../select-item.component';
import { ZardSelectComponent } from '../select.component';

@Component({
  standalone: true,
  imports: [FormsModule, ZardSelectComponent, ZardSelectItemComponent],
  template: `
    <z-select zPlaceholder="Selecione uma fruta" [(ngModel)]="defaultValue">
      <z-select-item zValue="apple">Apple</z-select-item>
      <z-select-item zValue="banana">Banana</z-select-item>
      <z-select-item zValue="blueberry">Blueberry</z-select-item>
      <z-select-item zValue="grapes">Grapes</z-select-item>
      <z-select-item zValue="pineapple" zDisabled>Pineapple</z-select-item>
    </z-select>
  `,
})
export class ZardDemoSelectBasicComponent {
  defaultValue = 'apple';
}

```