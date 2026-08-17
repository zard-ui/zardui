import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar07NavMainComponent, type Sidebar07NavItem } from './sidebar-07-nav-main.component';
import { Sidebar07NavProjectsComponent, type Sidebar07Project } from './sidebar-07-nav-projects.component';
import { Sidebar07NavUserComponent, type Sidebar07User } from './sidebar-07-nav-user.component';
import { Sidebar07TeamSwitcherComponent, type Sidebar07Team } from './sidebar-07-team-switcher.component';

@Component({
  selector: 'lib-sidebar-07-app-sidebar',
  standalone: true,
  imports: [
    ...ZardSidebarImports,
    Sidebar07TeamSwitcherComponent,
    Sidebar07NavMainComponent,
    Sidebar07NavProjectsComponent,
    Sidebar07NavUserComponent,
  ],
  templateUrl: './sidebar-07-app-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar07AppSidebarComponent {
  // This is sample data.
  protected readonly user: Sidebar07User = {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: 'https://github.com/shadcn.png',
  };

  protected readonly teams: readonly Sidebar07Team[] = [
    { name: 'Acme Inc', logo: 'lucideGalleryVerticalEnd', plan: 'Enterprise' },
    { name: 'Acme Corp.', logo: 'lucideAudioWaveform', plan: 'Startup' },
    { name: 'Evil Corp.', logo: 'lucideCommand', plan: 'Free' },
  ];

  protected readonly navMain: readonly Sidebar07NavItem[] = [
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

  protected readonly projects: readonly Sidebar07Project[] = [
    { name: 'Design Engineering', url: '#', icon: 'lucideFrame' },
    { name: 'Sales & Marketing', url: '#', icon: 'lucidePieChart' },
    { name: 'Travel', url: '#', icon: 'lucideMap' },
  ];
}
