import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb/breadcrumb.imports';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar02AppSidebarComponent } from './sidebar-02-app-sidebar.component';

@Component({
  selector: 'lib-sidebar-02',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardBreadcrumbImports, ZardSeparatorComponent, Sidebar02AppSidebarComponent],
  templateUrl: './sidebar-02.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar02Component {}
