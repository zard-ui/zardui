import { Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLightbulb, lucideLightbulbOff } from '@ng-icons/lucide';

import { ZardToggleComponent } from '../toggle.component';

@Component({
  selector: 'z-demo-toggle-with-bindings',
  imports: [ZardToggleComponent, NgIcon],
  template: `
    <div class="flex flex-col items-center gap-8">
      <z-toggle zAriaLabel="Turn on the light" [(zValue)]="lightOn" zType="outline">
        <ng-icon [name]="bulb()" />
      </z-toggle>
      <span>Light is {{ state() }}.</span>
    </div>
  `,
  viewProviders: [provideIcons({ lucideLightbulb, lucideLightbulbOff })],
})
export class ZardDemoToggleWithBindingsComponent {
  protected readonly lightOn = signal(false);
  protected readonly bulb = computed(() => (this.lightOn() ? 'lucideLightbulb' : 'lucideLightbulbOff'));
  protected readonly state = computed(() => (this.lightOn() ? 'on' : 'off'));
}
