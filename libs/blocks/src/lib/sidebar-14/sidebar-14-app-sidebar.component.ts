import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

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
  selector: 'lib-sidebar-14-app-sidebar',
  standalone: true,
  imports: [...ZardSidebarImports],
  templateUrl: './sidebar-14-app-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar14AppSidebarComponent {
  // This is sample data.
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
    {
      title: 'Community',
      url: '#',
      items: [{ title: 'Contribution Guide', url: '#' }],
    },
  ];
}
