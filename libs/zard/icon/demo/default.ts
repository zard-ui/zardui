import { Component } from '@angular/core';

import { ZardIconComponent } from '@ngzard/ui/icon';

@Component({
  selector: 'z-demo-icon-default',
  imports: [ZardIconComponent],
  standalone: true,
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
