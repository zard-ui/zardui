import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

@Component({
  selector: 'z-demo-input-group-default',
  imports: [ZardInputComponent, NgIcon, ...ZardInputGroupImports],
  template: `
    <z-input-group class="min-w-xs">
      <input z-input placeholder="Search..." />
      <z-input-group-addon>
        <ng-icon name="lucideSearch" />
      </z-input-group-addon>
      <z-input-group-addon zAlign="inline-end">12 results</z-input-group-addon>
    </z-input-group>
  `,
  viewProviders: [provideIcons({ lucideSearch })],
})
export class ZardDemoInputGroupDefaultComponent {}
