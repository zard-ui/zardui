```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardMenuDividerDirective } from '../menu-divider.directive';
import { ZardMenuItemDirective } from '../menu-item.directive';
import { ZardMenuComponent } from '../menu.component';
import { ZardSubmenuComponent } from '../submenu.component';

@Component({
  selector: 'zard-demo-menu-horizontal',
  standalone: true,
  imports: [ZardMenuComponent, ZardMenuItemDirective, ZardSubmenuComponent, ZardMenuDividerDirective],
  template: `
    <ul z-menu zMode="horizontal">
      <li z-menu-item zKey="1" zIcon="home">Home</li>
      <li z-menu-item zKey="2" zIcon="info">About</li>
      <ul z-submenu zKey="sub1" zTitle="Products" zIcon="package">
        <li z-menu-item zKey="3">Product A</li>
        <li z-menu-item zKey="4">Product B</li>
        <li z-menu-item zKey="5">Product C</li>
      </ul>
      <ul z-submenu zKey="sub2" zTitle="Services" zIcon="settings">
        <li z-menu-item zKey="6">Consulting</li>
        <li z-menu-item zKey="7">Support</li>
        <li z-menu-item zKey="8">Training</li>
      </ul>
      <li z-menu-divider></li>
      <li z-menu-item zKey="9" zIcon="phone">Contact</li>
    </ul>
  `,
})
export class ZardDemoMenuHorizontalComponent {}

```