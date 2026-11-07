import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';
import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-native-select-native-vs-select',
  imports: [ZardNativeSelectDirective, ZardSelectImports, ...ZardFieldImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4 sm:flex-row">
      <div z-field>
        <label z-field-label for="native-select-compare-native">Native Select</label>
        <select z-native-select id="native-select-compare-native">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="blueberry">Blueberry</option>
        </select>
      </div>
      <div z-field>
        <label z-field-label for="native-select-compare-select">Select</label>
        <z-select id="native-select-compare-select" zPlaceholder="Select a fruit">
          <z-select-item zValue="apple">Apple</z-select-item>
          <z-select-item zValue="banana">Banana</z-select-item>
          <z-select-item zValue="blueberry">Blueberry</z-select-item>
        </z-select>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNativeSelectNativeVsSelectComponent {}
