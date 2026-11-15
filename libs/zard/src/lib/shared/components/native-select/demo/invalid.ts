import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';

@Component({
  selector: 'z-demo-native-select-invalid',
  imports: [ZardNativeSelectDirective, ...ZardFieldImports],
  template: `
    <div z-field class="w-64" data-invalid="true">
      <label z-field-label for="native-select-invalid">Status</label>
      <select z-native-select id="native-select-invalid" aria-invalid="true">
        <option value="" disabled selected>Select status</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>
      <z-field-error>Select a status to continue.</z-field-error>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNativeSelectInvalidComponent {}
