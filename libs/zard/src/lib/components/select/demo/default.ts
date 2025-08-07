import { Component } from '@angular/core';

import { ZardSelectItemComponent } from '../select-item.component';
import { ZardSelectComponent } from '../select.component';

@Component({
  standalone: true,
  imports: [ZardSelectComponent, ZardSelectItemComponent],
  template: `
    <div class="flex flex-col gap-4">
      <z-select placeholder="Selecione uma fruta">
        <z-select-item value="apple">Apple</z-select-item>
        <z-select-item value="banana">Banana</z-select-item>
        <z-select-item value="blueberry">Blueberry</z-select-item>
        <z-select-item value="grapes">Grapes</z-select-item>
        <z-select-item value="pineapple" disabled>Pineapple</z-select-item>
      </z-select>
    </div>
  `,
})
export class ZardDemoSelectBasicComponent {}
