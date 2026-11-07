import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';

@Component({
  selector: 'z-demo-native-select-disabled',
  imports: [ZardNativeSelectDirective, ...ZardFieldImports],
  template: `
    <div z-field class="w-64" data-disabled="true">
      <label z-field-label for="native-select-disabled">Status</label>
      <select z-native-select id="native-select-disabled" disabled>
        <option value="todo">Todo</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNativeSelectDisabledComponent {}
