import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardSelectItemComponent } from '../select-item.component';
import { ZardSelectComponent } from '../select.component';

@Component({
  selector: 'z-demo-select-basic',
  standalone: true,
  imports: [FormsModule, ZardSelectComponent, ZardSelectItemComponent],
  template: `
    <div class="w-3/4">
      <z-select zPlaceholder="Selecione uma fruta" [(ngModel)]="defaultValue">
        <z-select-item zValue="apple">Apple</z-select-item>
        <z-select-item zValue="banana">Banana</z-select-item>
        <z-select-item zValue="blueberry">Blueberry</z-select-item>
        <z-select-item zValue="grapes">Grapes</z-select-item>
        <z-select-item zValue="pineapple" zDisabled>Pineapple</z-select-item>
      </z-select>
    </div>
  `,
})
export class ZardDemoSelectBasicComponent {
  defaultValue = 'apple';
}
