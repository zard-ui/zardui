import { Component } from '@angular/core';

import { ZardMenuModule } from '../menu.module';

@Component({
  selector: 'zard-demo-menu-horizontal',
  standalone: true,
  imports: [ZardMenuModule],
  template: `
    <ul z-menu zMode="horizontal">
      <li z-menu-item (click)="navigate('home')">Home</li>
      <li z-menu-item (click)="navigate('about')">About</li>
      <li z-submenu zTitle="Products" zIcon="package">
        <ul>
          <li z-menu-item (click)="navigate('product-a')">Product A</li>
          <li z-menu-item (click)="navigate('product-b')">Product B</li>
          <li z-menu-item (click)="navigate('product-c')">Product C</li>
        </ul>
      </li>
      <li z-submenu zTitle="Services" zIcon="settings">
        <ul>
          <li z-menu-item (click)="navigate('consulting')">Consulting</li>
          <li z-menu-item (click)="navigate('support')">Support</li>
          <li z-menu-item (click)="navigate('training')">Training</li>
        </ul>
      </li>
      <li z-menu-divider></li>
      <li z-menu-item (click)="navigate('contact')">Contact</li>
    </ul>
  `,
})
export class ZardDemoMenuHorizontalComponent {
  navigate(route: string) {
    console.log('Navigate to:', route);
  }
}
