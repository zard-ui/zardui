import { Component } from '@angular/core';

import { ZardIconComponent } from '../icon.component';

@Component({
  standalone: true,
  imports: [ZardIconComponent],
  template: `
    <div class="flex items-center gap-4">
      <z-icon zType="Heart" class="text-destructive" />
      <z-icon zType="CheckCircle" class="text-green-500" />
      <z-icon zType="AlertTriangle" class="text-warning" />
      <z-icon zType="Info" class="text-blue-500" />
      <z-icon zType="Star" class="text-yellow-500" />
      <z-icon zType="Zap" class="text-purple-500" />
    </div>
  `,
})
export class ZardDemoIconColorsComponent {}
