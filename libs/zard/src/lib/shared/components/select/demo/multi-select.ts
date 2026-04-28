import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-multi-select-basic',
  imports: [ZardSelectImports],
  template: `
    <div class="flex h-100 w-75 flex-col gap-4">
      <p class="text-muted-foreground text-sm">Selected fruits: {{ selectedValues().join(', ') }}</p>
      <z-select
        zPlaceholder="Select multiple fruits"
        [zMultiple]="true"
        [zMaxLabelCount]="3"
        [(zValue)]="selectedValues"
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
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMultiSelectBasicComponent {
  readonly selectedValues = signal<string[]>([]);
}
