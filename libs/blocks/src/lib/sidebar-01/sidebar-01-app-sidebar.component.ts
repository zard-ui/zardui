import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar01SearchFormComponent } from './sidebar-01-search-form.component';
import { Sidebar01VersionSwitcherComponent } from './sidebar-01-version-switcher.component';

interface NavItem {
  readonly title: string;
  readonly url: string;
  readonly isActive?: boolean;
}

interface NavGroup {
  readonly title: string;
  readonly url: string;
  readonly items: readonly NavItem[];
}

@Component({
  selector: 'lib-sidebar-01-app-sidebar',
  standalone: true,
  imports: [...ZardSidebarImports, Sidebar01VersionSwitcherComponent, Sidebar01SearchFormComponent],
  templateUrl: './sidebar-01-app-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // React's <AppSidebar /> adds no element of its own; `contents` keeps the z-sidebar a direct flex
  // item of the provider.
  host: { class: 'contents' },
})
export class Sidebar01AppSidebarComponent {
  // This is sample data.
  protected readonly versions = ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'];

  protected readonly navMain: readonly NavGroup[] = [
    {
      title: 'Getting Started',
      url: '#',
      items: [
        { title: 'Installation', url: '#' },
        { title: 'Project Structure', url: '#' },
      ],
    },
    {
      title: 'Build Your Application',
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
        { title: 'File Conventions', url: '#' },
        { title: 'Functions', url: '#' },
        { title: 'next.config.js Options', url: '#' },
        { title: 'CLI', url: '#' },
        { title: 'Edge Runtime', url: '#' },
      ],
    },
    {
      title: 'Architecture',
      url: '#',
      items: [
        { title: 'Accessibility', url: '#' },
        { title: 'Fast Refresh', url: '#' },
        { title: 'Next.js Compiler', url: '#' },
        { title: 'Supported Browsers', url: '#' },
        { title: 'Turbopack', url: '#' },
      ],
    },
  ];
}
