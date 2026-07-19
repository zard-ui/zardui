import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-choice-card',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports, FormsModule],
  template: `
    <z-radio-group [(value)]="selected" class="min-w-sm">
      <label z-field-label for="plus-plan">
        <div z-field zOrientation="horizontal">
          <div z-field-content>
            <div z-field-title>Plus</div>
            <p z-field-description>For individuals and small teams.</p>
          </div>
          <z-radio zId="plus-plan" value="plus" />
        </div>
      </label>
      <label z-field-label for="pro-plan">
        <div z-field zOrientation="horizontal">
          <div z-field-content>
            <div z-field-title>Pro</div>
            <p z-field-description>For growing businesses.</p>
          </div>
          <z-radio zId="pro-plan" value="pro" />
        </div>
      </label>
      <label z-field-label for="enterprise-plan">
        <div z-field zOrientation="horizontal">
          <div z-field-content>
            <div z-field-title>Enterprise</div>
            <p z-field-description>For large teams and enterprises.</p>
          </div>
          <z-radio zId="enterprise-plan" value="enterprise" />
        </div>
      </label>
    </z-radio-group>
  `,
})
export class ZardDemoRadioGroupChoiceCardComponent {
  selected: unknown = 'plus';
}
