import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';

import { ZardSelectItemComponent } from '../select-item.component';
import { ZardSelectComponent } from '../select.component';

@Component({
  selector: 'z-demo-multi-select-basic',
  imports: [ZardSelectComponent, ZardSelectItemComponent],
  template: `
    <z-select
      zPlaceholder="Select multiple fruits"
      [zMultiple]="true"
      [zMaxLabelCount]="4"
      [(zValue)]="selectedValues"
      class="w-[300px]"
    >
      <z-select-item zValue="apple">Apple</z-select-item>
      <z-select-item zValue="banana">Banana</z-select-item>
      <z-select-item zValue="blueberry">Blueberry</z-select-item>
      <z-select-item zValue="grapes">Grapes</z-select-item>
      <z-select-item zValue="pineapple">Pineapple</z-select-item>
      <z-select-item zValue="strawberry">Strawberry</z-select-item>
      <z-select-item zValue="watermelon">Watermelon</z-select-item>
      <z-select-item zValue="kiwi">Kiwi</z-select-item>
      <z-select-item zValue="mango">Mango</z-select-item>
    </z-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMultiSelectBasicComponent {
  readonly selectedValues = signal<string[]>([]);

  constructor() {
    effect(() => {
      console.log(this.selectedValues());
    });
  }
}
