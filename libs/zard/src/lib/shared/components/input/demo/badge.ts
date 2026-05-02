import { Component } from '@angular/core';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-badge',
  imports: [ZardInputComponent, ZardBadgeComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-80">
      <label z-field-label for="input-badge">
        Webhook URL
        <z-badge zType="secondary" class="ml-auto">Beta</z-badge>
      </label>
      <input z-input id="input-badge" type="url" placeholder="https://api.example.com/webhook" />
    </div>
  `,
})
export class ZardDemoInputBadgeComponent {}
