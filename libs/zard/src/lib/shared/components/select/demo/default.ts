import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-basic',
  imports: [ZardBadgeComponent, ZardSelectImports],
  template: `
    <div class="flex flex-col gap-4">
      <span>
        Selected value:
        @if (selectedValue) {
          <z-badge>{{ selectedValue }}</z-badge>
        }
      </span>
      <z-select class="w-75" zPlaceholder="Select a fruit" [(zValue)]="selectedValue">
        <z-select-item zValue="apple">Apple</z-select-item>
        <z-select-item zValue="banana">Banana</z-select-item>
        <z-select-item zValue="blueberry">Blueberry</z-select-item>
        <z-select-item zValue="grapes">Grapes</z-select-item>
        <z-select-item zValue="pineapple" zDisabled>Pineapple</z-select-item>
      </z-select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectBasicComponent {
  selectedValue = '';
}
