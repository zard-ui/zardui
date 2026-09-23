import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb/breadcrumb.imports';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar04AppSidebarComponent } from './sidebar-04-app-sidebar.component';

@Component({
  selector: 'lib-sidebar-04',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardBreadcrumbImports, ZardSeparatorComponent, Sidebar04AppSidebarComponent],
  templateUrl: './sidebar-04.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar04Component {}
