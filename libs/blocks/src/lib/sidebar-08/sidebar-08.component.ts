import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCommand } from '@ng-icons/lucide';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb/breadcrumb.imports';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar08NavMainComponent, type Sidebar08NavItem } from './sidebar-08-nav-main.component';
import { Sidebar08NavProjectsComponent, type Sidebar08Project } from './sidebar-08-nav-projects.component';
import { Sidebar08NavSecondaryComponent, type Sidebar08SecondaryItem } from './sidebar-08-nav-secondary.component';
import { Sidebar08NavUserComponent, type Sidebar08User } from './sidebar-08-nav-user.component';

/**
 * `zVariant="inset"` styles the inset through `peer-data-[variant=inset]`, and `peer` only reaches a
 * real DOM sibling. The sidebar therefore lives here rather than inside an app-sidebar wrapper
 * component, which is where the other blocks put it.
 */
@Component({
  selector: 'lib-sidebar-08',
  standalone: true,
  imports: [
    ...ZardSidebarImports,
    ...ZardBreadcrumbImports,
    ZardSeparatorComponent,
    Sidebar08NavMainComponent,
    Sidebar08NavProjectsComponent,
    Sidebar08NavSecondaryComponent,
    Sidebar08NavUserComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucideCommand })],
  templateUrl: './sidebar-08.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar08Component {
  // This is sample data.
  protected readonly user: Sidebar08User = {
    name: 'zard ui',
    email: 'm@example.com',
    avatar: 'https://github.com/zard-ui.png',
  };

  protected readonly navMain: readonly Sidebar08NavItem[] = [
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

  protected readonly navSecondary: readonly Sidebar08SecondaryItem[] = [
    { title: 'Support', url: '#', icon: 'lucideLifeBuoy' },
    { title: 'Feedback', url: '#', icon: 'lucideSend' },
  ];

  protected readonly projects: readonly Sidebar08Project[] = [
    { name: 'Design Engineering', url: '#', icon: 'lucideFrame' },
    { name: 'Sales & Marketing', url: '#', icon: 'lucidePieChart' },
    { name: 'Travel', url: '#', icon: 'lucideMap' },
  ];
}
