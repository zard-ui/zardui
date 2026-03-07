import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { zardLightbulbIcon, zardLightbulbOffIcon } from '../../../core/icons-registry';
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
  viewProviders: [provideIcons({ lightbulb: zardLightbulbIcon, lightbulbOff: zardLightbulbOffIcon })],
})
export class ZardDemoToggleWithFormsComponent {
  protected lightOn = false;
}
