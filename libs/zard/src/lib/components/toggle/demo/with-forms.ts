import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardToggleComponent } from '../toggle.component';
import { ZardIconComponent } from '../../icon/icon.component';

@Component({
  standalone: true,
  imports: [ZardToggleComponent, FormsModule, ZardIconComponent],
  template: `
    <z-toggle aria-label="Turn on the light" [(ngModel)]="lightOn">
      @if (lightOn) {
        <div z-icon zType="Lightbulb"></div>
      } @else {
        <div z-icon zType="LightbulbOff"></div>
      }
    </z-toggle>
  `,
})
export class ZardDemoToggleWithFormComponent {
  lightOn = false;
}
