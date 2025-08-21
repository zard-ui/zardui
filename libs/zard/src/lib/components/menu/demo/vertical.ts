import { Component } from '@angular/core';

import { ZardMenuItemDirective } from '../menu-item.directive';
import { ZardMenuComponent } from '../menu.component';
import { ZardSubmenuComponent } from '../submenu.component';

@Component({
  selector: 'zard-demo-menu-vertical',
  standalone: true,
  imports: [ZardMenuComponent, ZardMenuItemDirective, ZardSubmenuComponent],
  template: `
    <div style="width: 256px;">
      <ul z-menu zMode="vertical" zTheme="light">
        <li z-menu-item zKey="1" zIcon="dashboard">Dashboard</li>
        <ul z-submenu zKey="sub1" zTitle="User Management" zIcon="users">
          <li z-menu-item zKey="2">Users</li>
          <li z-menu-item zKey="3">Roles</li>
          <li z-menu-item zKey="4">Permissions</li>
        </ul>
        <ul z-submenu zKey="sub2" zTitle="Content" zIcon="file-text">
          <li z-menu-item zKey="5">Articles</li>
          <li z-menu-item zKey="6">Media</li>
          <li z-menu-item zKey="7">Categories</li>
        </ul>
        <li z-menu-item zKey="8" zIcon="chart-bar">Analytics</li>
        <li z-menu-item zKey="9" zIcon="settings">Settings</li>
      </ul>
    </div>
  `,
})
export class ZardDemoMenuVerticalComponent {}
