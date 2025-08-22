import { Component } from '@angular/core';

import { ZardDividerComponent } from '../../divider/divider.component';
import { ZardMenuModule } from '../menu.module';

@Component({
  selector: 'zard-demo-menu-default',
  standalone: true,
  imports: [ZardMenuModule, ZardDividerComponent],
  host: {
    class: 'w-full',
  },
  template: `
    <ul z-menu>
      <li z-menu-item (click)="navigate('home')">
        <i class="icon-layout-dashboard mr-2"></i>
        Home
      </li>
      <li z-menu-item (click)="navigate('about')">
        <i class="icon-users mr-2"></i>
        About
      </li>
      <li z-submenu zTitle="Services" zIcon="package">
        <ul>
          <li z-menu-item (click)="navigate('web-development')">Web Development</li>
          <li z-menu-item (click)="navigate('mobile-apps')">Mobile Apps</li>
          <li z-submenu zTitle="Cloud Services">
            <ul>
              <li z-menu-item (click)="navigate('aws')">AWS</li>
              <li z-menu-item (click)="navigate('azure')">Azure</li>
              <li z-menu-item (click)="navigate('google-cloud')">Google Cloud</li>
            </ul>
          </li>
        </ul>
      </li>
      <z-divider></z-divider>
      <li z-menu-group zTitle="Resources">
        <ul>
          <li z-menu-item (click)="navigate('documentation')">
            <i class="icon-book mr-2"></i>
            Documentation
          </li>
          <li z-menu-item (click)="navigate('blog')">
            <i class="icon-file-text mr-2"></i>
            Blog
          </li>
        </ul>
      </li>
      <z-divider></z-divider>
      <li z-menu-item (click)="navigate('settings')">
        <i class="icon-settings mr-2"></i>
        Settings
      </li>
      <li z-menu-item [zDisabled]="true">
        <i class="icon-log-out mr-2"></i>
        Logout
      </li>
    </ul>
  `,
})
export class ZardDemoMenuDefaultComponent {
  navigate(route: string) {
    console.log('Navigate to:', route);
    // router.navigate([route]) ou qualquer lógica de navegação
  }
}
