import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';

@Component({
  selector: 'z-demo-native-select-groups',
  imports: [ZardNativeSelectDirective, ...ZardFieldImports],
  template: `
    <div z-field class="w-64">
      <label z-field-label for="native-select-department">Department</label>
      <select z-native-select id="native-select-department">
        <option value="" disabled selected>Select department</option>
        <optgroup label="Engineering">
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="devops">DevOps</option>
        </optgroup>
        <optgroup label="Sales">
          <option value="account-executive">Account executive</option>
          <option value="sales-development">Sales development</option>
        </optgroup>
        <optgroup label="Operations">
          <option value="support">Customer support</option>
          <option value="product-manager">Product manager</option>
        </optgroup>
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNativeSelectGroupsComponent {}
