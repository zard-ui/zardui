import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb/breadcrumb.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar14AppSidebarComponent } from './sidebar-14-app-sidebar.component';

@Component({
  selector: 'lib-sidebar-14',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardBreadcrumbImports, Sidebar14AppSidebarComponent],
  templateUrl: './sidebar-14.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar14Component {}
