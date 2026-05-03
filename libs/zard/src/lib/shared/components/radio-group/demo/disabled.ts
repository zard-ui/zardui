import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-disabled',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports, FormsModule],
  template: `
    <z-radio-group [(value)]="selected" class="w-fit">
      <div z-field zOrientation="horizontal" data-disabled="true">
        <z-radio zId="disabled-1" value="option1" zDisabled />
        <label z-field-label for="disabled-1" class="font-normal">Disabled</label>
      </div>
      <div z-field zOrientation="horizontal">
        <z-radio zId="disabled-2" value="option2" />
        <label z-field-label for="disabled-2" class="font-normal">Option 2</label>
      </div>
      <div z-field zOrientation="horizontal">
        <z-radio zId="disabled-3" value="option3" />
        <label z-field-label for="disabled-3" class="font-normal">Option 3</label>
      </div>
    </z-radio-group>
  `,
})
export class ZardDemoRadioGroupDisabledComponent {
  selected: unknown = 'option2';
}
