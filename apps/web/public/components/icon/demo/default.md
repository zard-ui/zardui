```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardIconComponent } from '../icon.component';

@Component({
  standalone: true,
  imports: [ZardIconComponent],
  template: `
    <div class="flex items-center gap-4">
      <z-icon zType="house" />
      <z-icon zType="settings" />
      <z-icon zType="user" />
      <z-icon zType="search" />
      <z-icon zType="bell" />
      <z-icon zType="mail" />
    </div>
  `,
})
export class ZardDemoIconDefaultComponent {}

```