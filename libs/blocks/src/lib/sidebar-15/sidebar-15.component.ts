import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb/breadcrumb.imports';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar15SidebarLeftComponent } from './sidebar-15-sidebar-left.component';
import { Sidebar15SidebarRightComponent } from './sidebar-15-sidebar-right.component';

@Component({
  selector: 'lib-sidebar-15',
  standalone: true,
  imports: [
    ...ZardSidebarImports,
    ...ZardBreadcrumbImports,
    ZardSeparatorComponent,
    Sidebar15SidebarLeftComponent,
    Sidebar15SidebarRightComponent,
  ],
  templateUrl: './sidebar-15.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar15Component {}
