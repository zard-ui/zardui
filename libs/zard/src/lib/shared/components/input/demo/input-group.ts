import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

@Component({
  selector: 'z-demo-input-input-group',
  imports: [ZardInputComponent, NgIcon, ...ZardInputGroupImports, ...ZardFieldImports],
  viewProviders: [provideIcons({ lucideInfo })],
  template: `
    <div z-field class="w-80">
      <label z-field-label for="input-group-url">Website URL</label>
      <z-input-group>
        <z-input-group-addon>
          <span z-input-group-text>https://</span>
        </z-input-group-addon>
        <input z-input id="input-group-url" placeholder="example.com" />
        <z-input-group-addon zAlign="inline-end">
          <ng-icon name="lucideInfo" />
        </z-input-group-addon>
      </z-input-group>
    </div>
  `,
})
export class ZardDemoInputInputGroupComponent {}
