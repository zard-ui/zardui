import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb/breadcrumb.imports';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar06AppSidebarComponent } from './sidebar-06-app-sidebar.component';

@Component({
  selector: 'lib-sidebar-06',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardBreadcrumbImports, ZardSeparatorComponent, Sidebar06AppSidebarComponent],
  templateUrl: './sidebar-06.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar06Component {}
