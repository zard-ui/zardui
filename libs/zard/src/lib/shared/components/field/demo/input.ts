import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputDirective } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-field-input',
  imports: [...ZardFieldImports, ZardInputDirective],
  template: `
    <div class="w-full min-w-xs">
      <fieldset z-field-set>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="username">Username</label>
            <input z-input id="username" type="text" placeholder="Max Leiter" zSize="sm" />
            <p z-field-description>Choose a unique username for your account.</p>
          </div>
          <div z-field>
            <label z-field-label for="password">Password</label>
            <p z-field-description>Must be at least 8 characters long.</p>
            <input z-input id="password" type="password" placeholder="••••••••" zSize="sm" />
          </div>
        </div>
      </fieldset>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldInputComponent {}
