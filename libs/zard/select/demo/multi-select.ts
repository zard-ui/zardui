import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardBadgeComponent } from '@ngzard/ui/badge';
import { ZardSelectItemComponent, ZardSelectComponent } from '@ngzard/ui/select';

@Component({
  selector: 'z-demo-multi-select-basic',
  imports: [ZardBadgeComponent, ZardSelectComponent, ZardSelectItemComponent],
  template: `
    <div class="flex h-[400px] w-[300px] flex-col gap-4">
      Selected values:
      <span class="flex flex-wrap gap-2">
        @for (value of selectedValues(); track $index) {
          <z-badge>{{ value }}</z-badge>
        }
      </span>

      <z-select
        zPlaceholder="Select multiple fruits"
        [zMultiple]="true"
        [zMaxLabelCount]="4"
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
