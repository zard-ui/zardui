```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardIconComponent } from '@ngzard/ui/icon';
import { ZardToggleComponent } from '@ngzard/ui/toggle';

@Component({
  selector: 'z-demo-toggle-with-forms',
  imports: [ZardToggleComponent, FormsModule, ZardIconComponent],
  standalone: true,
  template: `
    <z-toggle aria-label="Turn on the light" [(ngModel)]="lightOn">
      @if (lightOn) {
        <z-icon zType="lightbulb" />
      } @else {
        <z-icon zType="lightbulb-off" />
      }
    </z-toggle>
  `,
})
export class ZardDemoToggleWithFormsComponent {
  protected lightOn = false;
}

```