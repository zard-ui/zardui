import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb/breadcrumb.imports';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar12AppSidebarComponent } from './sidebar-12-app-sidebar.component';

@Component({
  selector: 'lib-sidebar-12',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardBreadcrumbImports, ZardSeparatorComponent, Sidebar12AppSidebarComponent],
  templateUrl: './sidebar-12.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar12Component {
  protected readonly placeholders = Array.from({ length: 20 }, (_, index) => index);
}
