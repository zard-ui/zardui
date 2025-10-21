import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { Lightbulb, LightbulbOff } from 'lucide-angular';

import { ZardToggleComponent } from '../toggle.component';
import { ZardIconComponent } from '../../icon/icon.component';

@Component({
  standalone: true,
  imports: [ZardToggleComponent, FormsModule, ZardIconComponent],
  template: `
    <z-toggle aria-label="Turn on the light" [(ngModel)]="lightOn">
      @if (lightOn) {
        <z-icon [zType]="LightbulbIcon" />
      } @else {
        <z-icon [zType]="LightbulbOffIcon" />
      }
    </z-toggle>
  `,
})
export class ZardDemoToggleWithFormComponent {
  readonly LightbulbIcon = Lightbulb;
  readonly LightbulbOffIcon = LightbulbOff;
  lightOn = false;
}
