import { Component } from '@angular/core';
import { ZardCommandComponent, ZardCommandOptionComponent, ZardCommandOptionGroupComponent } from '../index';

@Component({
  standalone: true,
  imports: [ZardCommandComponent, ZardCommandOptionComponent, ZardCommandOptionGroupComponent],
  template: `
    <div class="flex flex-col gap-4">
      <z-command zSize="sm">
        <z-command-option-group zLabel="Small">
          <z-command-option zLabel="Option 1" zValue="1"></z-command-option>
          <z-command-option zLabel="Option 2" zValue="2"></z-command-option>
        </z-command-option-group>
      </z-command>

      <z-command>
        <z-command-option-group zLabel="Default">
          <z-command-option zLabel="Option 1" zValue="1"></z-command-option>
          <z-command-option zLabel="Option 2" zValue="2"></z-command-option>
        </z-command-option-group>
      </z-command>

      <z-command zSize="lg">
        <z-command-option-group zLabel="Large">
          <z-command-option zLabel="Option 1" zValue="1"></z-command-option>
          <z-command-option zLabel="Option 2" zValue="2"></z-command-option>
        </z-command-option-group>
      </z-command>
    </div>
  `,
})
export class ZardDemoCommandSizeComponent {}
