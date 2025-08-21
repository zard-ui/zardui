import { Component, signal } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardMenuItemDirective } from '../menu-item.directive';
import { ZardMenuComponent } from '../menu.component';
import { ZardSubmenuComponent } from '../submenu.component';

@Component({
  selector: 'zard-demo-menu-inline',
  standalone: true,
  imports: [ZardMenuComponent, ZardMenuItemDirective, ZardSubmenuComponent, ZardButtonComponent],
  template: `
    <div style="width: 256px;">
      <button z-button zType="outline" (click)="toggleCollapsed()" class="mb-4">
        {{ collapsed() ? 'Expand' : 'Collapse' }}
      </button>

      <ul z-menu zMode="inline" [zInlineCollapsed]="collapsed()">
        <li z-menu-item zKey="1" zIcon="mail">Navigation One</li>
        <li z-menu-item zKey="2" zIcon="calendar">Navigation Two</li>
        <ul z-submenu zKey="sub1" zTitle="Navigation Three" zIcon="folder">
          <li z-menu-item zKey="3">Option 3</li>
          <li z-menu-item zKey="4">Option 4</li>
          <ul z-submenu zKey="sub1-2" zTitle="Submenu">
            <li z-menu-item zKey="5">Option 5</li>
            <li z-menu-item zKey="6">Option 6</li>
          </ul>
        </ul>
        <ul z-submenu zKey="sub2" zTitle="Navigation Four" zIcon="settings">
          <li z-menu-item zKey="7">Option 7</li>
          <li z-menu-item zKey="8">Option 8</li>
          <li z-menu-item zKey="9">Option 9</li>
          <li z-menu-item zKey="10">Option 10</li>
        </ul>
      </ul>
    </div>
  `,
})
export class ZardDemoMenuInlineComponent {
  collapsed = signal(false);

  toggleCollapsed() {
    this.collapsed.update(val => !val);
  }
}
