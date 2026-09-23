import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePanelLeft } from '@ng-icons/lucide';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb/breadcrumb.imports';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSidebarService } from '@zard/components/sidebar/sidebar.service';

import { Sidebar16SearchFormComponent } from './sidebar-16-search-form.component';

@Component({
  selector: 'lib-sidebar-16-site-header',
  standalone: true,
  imports: [
    ...ZardBreadcrumbImports,
    ZardButtonComponent,
    ZardSeparatorComponent,
    Sidebar16SearchFormComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucidePanelLeft })],
  templateUrl: './sidebar-16-site-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar16SiteHeaderComponent {
  protected readonly sidebar = inject(ZardSidebarService);
}
