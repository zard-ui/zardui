import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSelectImports, type ZardSelectPositionVariants } from '@/shared/components/select';
import { ZardSwitchComponent } from '@/shared/components/switch';

@Component({
  selector: 'z-demo-select-align-item',
  imports: [ZardSelectImports, ZardSwitchComponent, ...ZardFieldImports],
  template: `
    <div z-field-group class="w-full min-w-xs">
      <div z-field zOrientation="horizontal">
        <div z-field-content>
          <label z-field-label for="align-item">Align Item</label>
          <p z-field-description>Toggle to align the item with the trigger.</p>
        </div>
        <z-switch id="align-item" [(zChecked)]="alignItem" />
      </div>

      <div z-field>
        <z-select [zPosition]="position()" [(zValue)]="selectedFruit">
          <z-select-group>
            <z-select-item zValue="apple">Apple</z-select-item>
            <z-select-item zValue="banana">Banana</z-select-item>
            <z-select-item zValue="blueberry">Blueberry</z-select-item>
            <z-select-item zValue="grapes">Grapes</z-select-item>
            <z-select-item zValue="pineapple">Pineapple</z-select-item>
          </z-select-group>
        </z-select>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectAlignItemComponent {
  readonly alignItem = signal(true);
  readonly selectedFruit = signal('banana');

  protected readonly position = computed<ZardSelectPositionVariants>(() =>
    this.alignItem() ? 'item-aligned' : 'popper',
  );
}
