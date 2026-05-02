import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-description',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports, FormsModule],
  template: `
    <z-radio-group [(value)]="selected" class="w-fit">
      <div z-field zOrientation="horizontal">
        <z-radio zId="desc-r1" value="default" />
        <div z-field-content>
          <label z-field-label for="desc-r1">Default</label>
          <p z-field-description>Standard spacing for most use cases.</p>
        </div>
      </div>
      <div z-field zOrientation="horizontal">
        <z-radio zId="desc-r2" value="comfortable" />
        <div z-field-content>
          <label z-field-label for="desc-r2">Comfortable</label>
          <p z-field-description>More space between elements.</p>
        </div>
      </div>
      <div z-field zOrientation="horizontal">
        <z-radio zId="desc-r3" value="compact" />
        <div z-field-content>
          <label z-field-label for="desc-r3">Compact</label>
          <p z-field-description>Minimal spacing for dense layouts.</p>
        </div>
      </div>
    </z-radio-group>
  `,
})
export class ZardDemoRadioGroupDescriptionComponent {
  selected: unknown = 'comfortable';
}
