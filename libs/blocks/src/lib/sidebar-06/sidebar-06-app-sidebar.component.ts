import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGalleryVerticalEnd } from '@ng-icons/lucide';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar06NavMainComponent, type Sidebar06NavGroup } from './sidebar-06-nav-main.component';
import { Sidebar06SidebarOptInFormComponent } from './sidebar-06-sidebar-opt-in-form.component';

@Component({
  selector: 'lib-sidebar-06-app-sidebar',
  standalone: true,
  imports: [...ZardSidebarImports, Sidebar06NavMainComponent, Sidebar06SidebarOptInFormComponent, NgIcon],
  viewProviders: [provideIcons({ lucideGalleryVerticalEnd })],
  templateUrl: './sidebar-06-app-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar06AppSidebarComponent {
  // This is sample data.
  protected readonly navMain: readonly Sidebar06NavGroup[] = [
    {
      title: 'Getting Started',
      url: '#',
      items: [
        { title: 'Installation', url: '#' },
        { title: 'Project Structure', url: '#' },
      ],
    },
    {
      title: 'Building Your Application',
      url: '#',
      items: [
        { title: 'Routing', url: '#' },
        { title: 'Data Fetching', url: '#', isActive: true },
        { title: 'Rendering', url: '#' },
        { title: 'Caching', url: '#' },
        { title: 'Styling', url: '#' },
        { title: 'Optimizing', url: '#' },
        { title: 'Configuring', url: '#' },
        { title: 'Testing', url: '#' },
        { title: 'Authentication', url: '#' },
        { title: 'Deploying', url: '#' },
        { title: 'Upgrading', url: '#' },
        { title: 'Examples', url: '#' },
      ],
    },
    {
      title: 'API Reference',
      url: '#',
      items: [
        { title: 'Components', url: '#' },
        { title: 'Style Guide', url: '#' },
        { title: 'Functions', url: '#' },
        { title: 'angular.json Options', url: '#' },
        { title: 'CLI', url: '#' },
        { title: 'Hydration', url: '#' },
      ],
    },
    {
      title: 'Architecture',
      url: '#',
      items: [
        { title: 'Accessibility', url: '#' },
        { title: 'Hot Module Replacement', url: '#' },
        { title: 'Angular Compiler', url: '#' },
        { title: 'Supported Browsers', url: '#' },
        { title: 'esbuild', url: '#' },
      ],
    },
  ];
}
