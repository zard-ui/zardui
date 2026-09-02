import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb/breadcrumb.imports';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar07AppSidebarComponent } from './sidebar-07-app-sidebar.component';

@Component({
  selector: 'lib-sidebar-07',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardBreadcrumbImports, ZardSeparatorComponent, Sidebar07AppSidebarComponent],
  templateUrl: './sidebar-07.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar07Component {}
