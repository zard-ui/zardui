import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb/breadcrumb.imports';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar09AppSidebarComponent } from './sidebar-09-app-sidebar.component';

@Component({
  selector: 'lib-sidebar-09',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardBreadcrumbImports, ZardSeparatorComponent, Sidebar09AppSidebarComponent],
  templateUrl: './sidebar-09.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar09Component {
  protected readonly placeholders = Array.from({ length: 24 }, (_, index) => index);
}
