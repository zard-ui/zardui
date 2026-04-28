import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-rtl',
  imports: [ZardSelectImports],
  template: `
    <div class="w-75" dir="rtl">
      <z-select zDir="rtl" zPlaceholder="اختر فاكهة" [(zValue)]="selectedFruit">
        <z-select-item zValue="apple">تفاح</z-select-item>
        <z-select-item zValue="banana">موز</z-select-item>
        <z-select-item zValue="blueberry">توت</z-select-item>
        <z-select-item zValue="grapes">عنب</z-select-item>
        <z-select-item zValue="pineapple">أناناس</z-select-item>
      </z-select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectRtlComponent {
  readonly selectedFruit = signal('');
}
