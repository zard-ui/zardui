import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  standalone: true,
  imports: [ZardToggleComponent, FormsModule],
  template: `
    <z-toggle aria-label="Turn on the light" [(ngModel)]="lightOn">
      @if (lightOn) {
        <div class="icon-lightbulb"></div>
      } @else {
        <div class="icon-lightbulb-off"></div>
      }
    </z-toggle>
  `,
})
export class ZardDemoToggleWithFormComponent {
  lightOn = false;
}
