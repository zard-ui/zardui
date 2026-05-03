import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePencil } from '@ng-icons/lucide';

import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

@Component({
  selector: 'z-demo-input-group-custom',
  imports: [NgIcon, ...ZardInputGroupImports],
  viewProviders: [provideIcons({ lucidePencil })],
  template: `
    <z-input-group class="w-80">
      <z-input-group-addon><ng-icon name="lucidePencil" /></z-input-group-addon>
      <input
        data-slot="input-group-control"
        type="text"
        placeholder="Custom input control..."
        class="placeholder:text-muted-foreground bg-transparent text-sm outline-none"
      />
    </z-input-group>
  `,
})
export class ZardDemoInputGroupCustomComponent {}
