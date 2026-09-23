import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleDot } from '@ng-icons/lucide';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Dashboard01NavDocumentsComponent, type Dashboard01Document } from './dashboard-01-nav-documents.component';
import { Dashboard01NavMainComponent, type Dashboard01NavItem } from './dashboard-01-nav-main.component';
import { Dashboard01NavSecondaryComponent } from './dashboard-01-nav-secondary.component';
import { Dashboard01NavUserComponent, type Dashboard01User } from './dashboard-01-nav-user.component';

@Component({
  selector: 'lib-dashboard-01-app-sidebar',
  standalone: true,
  imports: [
    ...ZardSidebarImports,
    Dashboard01NavMainComponent,
    Dashboard01NavDocumentsComponent,
    Dashboard01NavSecondaryComponent,
    Dashboard01NavUserComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucideCircleDot })],
  templateUrl: './dashboard-01-app-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Dashboard01AppSidebarComponent {
  // This is sample data.
  protected readonly user: Dashboard01User = {
    name: 'zard ui',
    email: 'm@example.com',
    avatar: 'https://github.com/zard-ui.png',
  };

  protected readonly navMain: readonly Dashboard01NavItem[] = [
    { title: 'Dashboard', url: '#', icon: 'lucideLayoutDashboard' },
    { title: 'Lifecycle', url: '#', icon: 'lucideListTodo' },
    { title: 'Analytics', url: '#', icon: 'lucideChartBar' },
    { title: 'Projects', url: '#', icon: 'lucideFolder' },
    { title: 'Team', url: '#', icon: 'lucideUsers' },
  ];

  protected readonly navSecondary: readonly Dashboard01NavItem[] = [
    { title: 'Settings', url: '#', icon: 'lucideSettings' },
    { title: 'Get Help', url: '#', icon: 'lucideCircleHelp' },
    { title: 'Search', url: '#', icon: 'lucideSearch' },
  ];

  protected readonly documents: readonly Dashboard01Document[] = [
    { name: 'Data Library', url: '#', icon: 'lucideDatabase' },
    { name: 'Reports', url: '#', icon: 'lucideClipboardList' },
    { name: 'Word Assistant', url: '#', icon: 'lucideFileText' },
  ];
}
