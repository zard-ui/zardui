import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardBadgeComponent } from '../../badge/badge.component';
import { ZardSelectItemComponent } from '../select-item.component';
import { ZardSelectComponent } from '../select.component';

@Component({
  selector: 'z-demo-multi-select-basic',
  imports: [ZardBadgeComponent, ZardSelectComponent, ZardSelectItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex w-[300px] flex-col gap-4">
      Selected values:
      <span class="flex flex-wrap gap-2">
        @for (value of selectedValues(); track $index) {
          <z-badge> {{ value }} </z-badge>
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
})
export class ZardDemoMultiSelectBasicComponent {
  selectedValues = signal<string[]>([]);
}
