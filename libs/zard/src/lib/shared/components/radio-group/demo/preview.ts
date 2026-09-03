import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-preview',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports],
  template: `
    <z-radio-group [(value)]="selected" class="w-fit">
      <div class="flex items-center gap-3">
        <z-radio zId="r1" value="default" />
        <label z-field-label for="r1">Default</label>
      </div>
      <div class="flex items-center gap-3">
        <z-radio zId="r2" value="comfortable" />
        <label z-field-label for="r2">Comfortable</label>
      </div>
      <div class="flex items-center gap-3">
        <z-radio zId="r3" value="compact" />
        <label z-field-label for="r3">Compact</label>
      </div>
    </z-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoRadioGroupPreviewComponent {
  selected: unknown = 'comfortable';
}
