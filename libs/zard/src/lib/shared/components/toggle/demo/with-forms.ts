import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLightbulb, lucideLightbulbOff } from '@ng-icons/lucide';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-with-forms',
  imports: [ZardToggleComponent, FormsModule, NgIcon],
  template: `
    <z-toggle aria-label="Turn on the light" [(ngModel)]="lightOn">
      @if (lightOn) {
        <ng-icon name="lucideLightbulb" />
      } @else {
        <ng-icon name="lucideLightbulbOff" />
      }
    </z-toggle>
  `,
  viewProviders: [provideIcons({ lucideLightbulb, lucideLightbulbOff })],
})
export class ZardDemoToggleWithFormsComponent {
  protected lightOn = false;
}
