```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardIconComponent } from '../icon.component';

@Component({
  standalone: true,
  imports: [ZardIconComponent],
  template: `
    <div class="flex items-center gap-4">
      <z-icon zType="Home" />
      <z-icon zType="Settings" />
      <z-icon zType="User" />
      <z-icon zType="Search" />
      <z-icon zType="Bell" />
      <z-icon zType="Mail" />
    </div>
  `,
})
export class ZardDemoIconDefaultComponent {}

```