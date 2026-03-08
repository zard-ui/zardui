```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardIconRegistry } from '@/shared/core';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-with-forms',
  imports: [ZardToggleComponent, FormsModule, NgIcon],
  template: `
    <z-toggle aria-label="Turn on the light" [(ngModel)]="lightOn">
      @if (lightOn) {
        <ng-icon name="lightbulb" />
      } @else {
        <ng-icon name="lightbulb-off" />
      }
    </z-toggle>
  `,
  viewProviders: [
    provideIcons({ lightbulb: ZardIconRegistry.lightbulb, lightbulbOff: ZardIconRegistry['lightbulb-off'] }),
  ],
})
export class ZardDemoToggleWithFormsComponent {
  protected lightOn = false;
}

```