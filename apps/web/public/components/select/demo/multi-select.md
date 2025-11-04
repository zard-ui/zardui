```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';

import { ZardSelectItemComponent } from '../select-item.component';
import { ZardSelectComponent } from '../select.component';

@Component({
  selector: 'z-demo-multi-select-basic',
  imports: [ZardSelectComponent, ZardSelectItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-select zPlaceholder="Select multiple fruits" [zMultiple]="true" [zMaxLabelCount]="2" [(zValue)]="defaultValue">
      <z-select-item zValue="apple">Apple</z-select-item>
      <z-select-item zValue="banana">Banana</z-select-item>
      <z-select-item zValue="blueberry">Blueberry</z-select-item>
      <z-select-item zValue="grapes">Grapes</z-select-item>
      <z-select-item zValue="pineapple">Pineapple</z-select-item>
    </z-select>
  `,
})
export class ZardDemoMultiSelectBasicComponent {
  defaultValue = signal<string[]>([]);

  constructor() {
    effect(() => {
      console.log(this.defaultValue());
    });
  }
}

```