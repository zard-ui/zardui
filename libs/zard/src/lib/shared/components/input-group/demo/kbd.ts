import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';

@Component({
  selector: 'z-demo-input-group-kbd',
  imports: [ZardInputComponent, ZardKbdComponent, NgIcon, ...ZardInputGroupImports],
  template: `
    <z-input-group class="min-w-sm">
      <input z-input placeholder="Search..." />
      <z-input-group-addon>
        <ng-icon name="lucideSearch" class="text-muted-foreground" />
      </z-input-group-addon>
      <z-input-group-addon zAlign="inline-end">
        <z-kbd>⌘K</z-kbd>
      </z-input-group-addon>
    </z-input-group>
  `,
  viewProviders: [provideIcons({ lucideSearch })],
})
export class ZardDemoInputGroupKbdComponent {}
