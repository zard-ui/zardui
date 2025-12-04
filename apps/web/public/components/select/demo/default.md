```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '../../badge/badge.component';
import { ZardSelectModule } from '../select.module';

@Component({
  selector: 'z-demo-select-basic',
  imports: [ZardBadgeComponent, ZardSelectModule],
  template: `
    <div class="flex flex-col gap-4">
      <span>
        Selected value:
        @if (selectedValue) {
          <z-badge>{{ selectedValue }}</z-badge>
        }
      </span>
      <z-select class="w-[300px]" zPlaceholder="Select a fruit" [(zValue)]="selectedValue">
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

```