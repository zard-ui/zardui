```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardMenuModule } from '../menu.module';

@Component({
  selector: 'zard-demo-menu-vertical',
  standalone: true,
  imports: [ZardMenuModule],
  template: `
    <div style="width: 256px;">
      <ul z-menu zMode="vertical" zTheme="light">
        <li z-menu-item>Dashboard</li>
        <ul z-submenu zTitle="User Management">
          <li z-menu-item>Users</li>
          <li z-menu-item>Roles</li>
          <li z-menu-item>Permissions</li>
        </ul>
        <ul z-submenu zTitle="Content">
          <li z-menu-item>Articles</li>
          <li z-menu-item>Media</li>
          <li z-menu-item>Categories</li>
        </ul>
        <li z-menu-item>Analytics</li>
        <li z-menu-item>Settings</li>
      </ul>
    </div>
  `,
})
export class ZardDemoMenuVerticalComponent {}

```
