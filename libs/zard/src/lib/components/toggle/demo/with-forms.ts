import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardIconComponent } from '../../icon/icon.component';
import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-with-forms',
  standalone: true,
  imports: [ZardToggleComponent, FormsModule, ZardIconComponent],
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
