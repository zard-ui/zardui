import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-field-select',
  imports: [...ZardFieldImports, ZardSelectImports],
  template: `
    <div class="w-full min-w-md">
      <div z-field>
        <label z-field-label for="department">Department</label>
        <z-select zPlaceholder="Choose department" id="department">
          <z-select-item zValue="engineering">Engineering</z-select-item>
          <z-select-item zValue="design">Design</z-select-item>
          <z-select-item zValue="marketing">Marketing</z-select-item>
          <z-select-item zValue="sales">Sales</z-select-item>
          <z-select-item zValue="support">Customer Support</z-select-item>
          <z-select-item zValue="hr">Human Resources</z-select-item>
          <z-select-item zValue="finance">Finance</z-select-item>
          <z-select-item zValue="operations">Operations</z-select-item>
        </z-select>
        <p z-field-description>Select your department or area of work.</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldSelectComponent {}
