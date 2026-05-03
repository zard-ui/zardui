import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEyeOff } from '@ng-icons/lucide';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

@Component({
  selector: 'z-demo-input-group-inline-end',
  imports: [ZardInputComponent, NgIcon, ...ZardInputGroupImports, ...ZardFieldImports],
  viewProviders: [provideIcons({ lucideEyeOff })],
  template: `
    <div z-field class="min-w-sm">
      <label z-field-label for="inline-end-input">Input</label>
      <z-input-group>
        <input z-input id="inline-end-input" type="password" placeholder="Enter password" />
        <z-input-group-addon zAlign="inline-end">
          <ng-icon name="lucideEyeOff" />
        </z-input-group-addon>
      </z-input-group>
      <p z-field-description>Icon positioned at the end.</p>
    </div>
  `,
})
export class ZardDemoInputGroupInlineEndComponent {}
