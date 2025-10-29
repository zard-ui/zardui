import { Component } from '@angular/core';

import { ZardIconComponent } from '../icon.component';

@Component({
  selector: 'z-demo-icon-sizes',
  standalone: true,
  imports: [ZardIconComponent],
  template: `
    <div class="flex items-center gap-6">
      <div class="flex flex-col items-center gap-2">
        <z-icon zType="house" zSize="sm" />
        <span class="text-xs text-muted-foreground">Small</span>
      </div>

      <div class="flex flex-col items-center gap-2">
        <z-icon zType="house" zSize="default" />
        <span class="text-xs text-muted-foreground">Default</span>
      </div>

      <div class="flex flex-col items-center gap-2">
        <z-icon zType="house" zSize="lg" />
        <span class="text-xs text-muted-foreground">Large</span>
      </div>

      <div class="flex flex-col items-center gap-2">
        <z-icon zType="house" zSize="xl" />
        <span class="text-xs text-muted-foreground">Extra Large</span>
      </div>
    </div>
  `,
})
export class ZardDemoIconSizesComponent {}
