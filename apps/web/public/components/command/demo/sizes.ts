import { Component } from '@angular/core';

import { ZardCommandOptionComponent } from '../command-option.component';
import { ZardCommandComponent } from '../command.component';

@Component({
  standalone: true,
  imports: [ZardCommandComponent, ZardCommandOptionComponent],
  template: `
    <div class="space-y-4">
      <div>
        <h3 class="text-sm font-medium mb-2">Small</h3>
        <z-command size="sm" zPlaceholder="Small command...">
          <z-command-option zLabel="Option 1" zValue="1"></z-command-option>
          <z-command-option zLabel="Option 2" zValue="2"></z-command-option>
        </z-command>
      </div>

      <div>
        <h3 class="text-sm font-medium mb-2">Default</h3>
        <z-command size="default" zPlaceholder="Default command...">
          <z-command-option zLabel="Option 1" zValue="1"></z-command-option>
          <z-command-option zLabel="Option 2" zValue="2"></z-command-option>
        </z-command>
      </div>

      <div>
        <h3 class="text-sm font-medium mb-2">Large</h3>
        <z-command size="lg" zPlaceholder="Large command...">
          <z-command-option zLabel="Option 1" zValue="1"></z-command-option>
          <z-command-option zLabel="Option 2" zValue="2"></z-command-option>
        </z-command>
      </div>
    </div>
  `,
})
export class ZardDemoCommandSizesComponent {}
