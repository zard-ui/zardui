import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb/breadcrumb.imports';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar03AppSidebarComponent } from './sidebar-03-app-sidebar.component';

@Component({
  selector: 'lib-sidebar-03',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardBreadcrumbImports, ZardSeparatorComponent, Sidebar03AppSidebarComponent],
  templateUrl: './sidebar-03.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar03Component {}
