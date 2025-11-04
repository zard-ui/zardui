import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSelectItemComponent } from '../select-item.component';
import { ZardSelectComponent } from '../select.component';

@Component({
  selector: 'z-demo-select-basic',
  imports: [ZardSelectComponent, ZardSelectItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-select zPlaceholder="Selecione uma fruta" [(zValue)]="defaultValue">
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
