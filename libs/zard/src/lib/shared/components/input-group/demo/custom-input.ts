import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePencil } from '@ng-icons/lucide';

import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

@Component({
  selector: 'z-demo-input-group-custom-input',
  imports: [NgIcon, ...ZardInputGroupImports],
  template: `
    <z-input-group class="w-80">
      <z-input-group-addon><ng-icon name="lucidePencil" /></z-input-group-addon>
      <input
        id="input-group-custom-input"
        data-slot="input-group-control"
        type="text"
        placeholder="Custom input control..."
        class="placeholder:text-muted-foreground bg-transparent text-sm outline-none"
      />
    </z-input-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucidePencil })],
})
export class ZardDemoInputGroupCustomInputComponent {}
