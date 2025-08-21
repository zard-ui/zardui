```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardMenuDividerDirective } from '../menu-divider.directive';
import { ZardMenuGroupComponent } from '../menu-group.component';
import { ZardMenuItemDirective } from '../menu-item.directive';
import { ZardMenuComponent } from '../menu.component';
import { ZardSubmenuComponent } from '../submenu.component';

@Component({
  selector: 'zard-demo-menu-default',
  standalone: true,
  imports: [ZardMenuComponent, ZardMenuItemDirective, ZardSubmenuComponent, ZardMenuGroupComponent, ZardMenuDividerDirective],
  template: `
    <ul z-menu>
      <li z-menu-item zKey="1" zIcon="home">Home</li>
      <li z-menu-item zKey="2" zIcon="users">About</li>
      <ul z-submenu zKey="sub1" zTitle="Services" zIcon="package">
        <li z-menu-item zKey="3" [zLevel]="2">Web Development</li>
        <li z-menu-item zKey="4" [zLevel]="2">Mobile Apps</li>
        <ul z-submenu zKey="sub2" zTitle="Cloud Services" [zLevel]="2">
          <li z-menu-item zKey="5" [zLevel]="3">AWS</li>
          <li z-menu-item zKey="6" [zLevel]="3">Azure</li>
          <li z-menu-item zKey="7" [zLevel]="3">Google Cloud</li>
        </ul>
      </ul>
      <li z-menu-divider></li>
      <z-menu-group zTitle="Resources">
        <li z-menu-item zKey="8" zIcon="book">Documentation</li>
        <li z-menu-item zKey="9" zIcon="file-text">Blog</li>
      </z-menu-group>
      <li z-menu-divider></li>
      <li z-menu-item zKey="10" zIcon="settings">Settings</li>
      <li z-menu-item zKey="11" zIcon="log-out" [zDisabled]="true">Logout</li>
    </ul>
  `,
})
export class ZardDemoMenuDefaultComponent {}

```