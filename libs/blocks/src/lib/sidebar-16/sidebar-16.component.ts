import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCommand } from '@ng-icons/lucide';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar16NavMainComponent, type Sidebar16NavItem } from './sidebar-16-nav-main.component';
import { Sidebar16NavProjectsComponent, type Sidebar16Project } from './sidebar-16-nav-projects.component';
import { Sidebar16NavSecondaryComponent, type Sidebar16SecondaryItem } from './sidebar-16-nav-secondary.component';
import { Sidebar16NavUserComponent, type Sidebar16User } from './sidebar-16-nav-user.component';
import { Sidebar16SiteHeaderComponent } from './sidebar-16-site-header.component';

@Component({
  selector: 'lib-sidebar-16',
  standalone: true,
  imports: [
    ...ZardSidebarImports,
    Sidebar16NavMainComponent,
    Sidebar16NavProjectsComponent,
    Sidebar16NavSecondaryComponent,
    Sidebar16NavUserComponent,
    Sidebar16SiteHeaderComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucideCommand })],
  templateUrl: './sidebar-16.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar16Component {
  // This is sample data.
  protected readonly user: Sidebar16User = {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: 'https://github.com/shadcn.png',
  };

  protected readonly navMain: readonly Sidebar16NavItem[] = [
    {
      title: 'Playground',
      url: '#',
      icon: 'lucideSquareTerminal',
      isActive: true,
      items: [
        { title: 'History', url: '#' },
        { title: 'Starred', url: '#' },
        { title: 'Settings', url: '#' },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: 'lucideBot',
      items: [
        { title: 'Genesis', url: '#' },
        { title: 'Explorer', url: '#' },
        { title: 'Quantum', url: '#' },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: 'lucideBookOpen',
      items: [
        { title: 'Introduction', url: '#' },
        { title: 'Get Started', url: '#' },
        { title: 'Tutorials', url: '#' },
        { title: 'Changelog', url: '#' },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: 'lucideSettings2',
      items: [
        { title: 'General', url: '#' },
        { title: 'Team', url: '#' },
        { title: 'Billing', url: '#' },
        { title: 'Limits', url: '#' },
      ],
    },
  ];

  protected readonly navSecondary: readonly Sidebar16SecondaryItem[] = [
    { title: 'Support', url: '#', icon: 'lucideLifeBuoy' },
    { title: 'Feedback', url: '#', icon: 'lucideSend' },
  ];

  protected readonly projects: readonly Sidebar16Project[] = [
    { name: 'Design Engineering', url: '#', icon: 'lucideFrame' },
    { name: 'Sales & Marketing', url: '#', icon: 'lucidePieChart' },
    { name: 'Travel', url: '#', icon: 'lucideMap' },
  ];
}
