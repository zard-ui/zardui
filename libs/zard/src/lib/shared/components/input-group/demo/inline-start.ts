import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

@Component({
  selector: 'z-demo-input-group-inline-start',
  imports: [ZardInputComponent, NgIcon, ...ZardInputGroupImports, ...ZardFieldImports],
  template: `
    <div z-field class="min-w-sm">
      <label z-field-label for="inline-start-input">Input</label>
      <z-input-group>
        <input z-input id="inline-start-input" placeholder="Search..." />
        <z-input-group-addon zAlign="inline-start">
          <ng-icon name="lucideSearch" class="text-muted-foreground" />
        </z-input-group-addon>
      </z-input-group>
      <p z-field-description>Icon positioned at the start.</p>
    </div>
  `,
  viewProviders: [provideIcons({ lucideSearch })],
})
export class ZardDemoInputGroupInlineStartComponent {}
