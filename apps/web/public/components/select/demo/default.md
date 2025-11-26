```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@ngzard/ui/badge';
import { ZardSelectItemComponent, ZardSelectComponent } from '@ngzard/ui/select';

@Component({
  selector: 'z-demo-select-basic',
  imports: [ZardBadgeComponent, ZardSelectComponent, ZardSelectItemComponent],
  template: `
    <div class="flex flex-col gap-4">
      <span>
        Selected value:
        <z-badge>{{ selectedValue }}</z-badge>
      </span>
      <z-select class="w-[300px]" zPlaceholder="Selecione uma fruta" [(zValue)]="selectedValue">
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
  selectedValue = 'apple';
}

```