import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardSelectImports, type ZardSelectPositionVariants } from '@/shared/components/select';
import { ZardSwitchComponent } from '@/shared/components/switch';

@Component({
  selector: 'z-demo-select-align-item',
  imports: [ZardSelectImports, ZardSwitchComponent],
  template: `
    <div class="flex w-75 flex-col gap-4">
      <z-switch [(zChecked)]="alignItem">Align item</z-switch>

      <z-select zPlaceholder="Select a fruit" [zPosition]="position()" [(zValue)]="selectedFruit">
        <z-select-item zValue="apple">Apple</z-select-item>
        <z-select-item zValue="banana">Banana</z-select-item>
        <z-select-item zValue="blueberry">Blueberry</z-select-item>
        <z-select-item zValue="grapes">Grapes</z-select-item>
        <z-select-item zValue="pineapple">Pineapple</z-select-item>
      </z-select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectAlignItemComponent {
  readonly alignItem = signal(true);
  readonly selectedFruit = signal('blueberry');

  protected readonly position = computed<ZardSelectPositionVariants>(() =>
    this.alignItem() ? 'item-aligned' : 'popper',
  );
}
