```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardIconComponent } from '../icon.component';

@Component({
  standalone: true,
  imports: [ZardIconComponent],
  template: `
    <div class="flex items-center gap-6">
      <div class="flex flex-col items-center gap-2">
        <z-icon zType="Home" zSize="sm" />
        <span class="text-xs text-muted-foreground">Small</span>
      </div>

      <div class="flex flex-col items-center gap-2">
        <z-icon zType="Home" zSize="default" />
        <span class="text-xs text-muted-foreground">Default</span>
      </div>

      <div class="flex flex-col items-center gap-2">
        <z-icon zType="Home" zSize="lg" />
        <span class="text-xs text-muted-foreground">Large</span>
      </div>

      <div class="flex flex-col items-center gap-2">
        <z-icon zType="Home" zSize="xl" />
        <span class="text-xs text-muted-foreground">Extra Large</span>
      </div>
    </div>
  `,
})
export class ZardDemoIconSizesComponent {}

```