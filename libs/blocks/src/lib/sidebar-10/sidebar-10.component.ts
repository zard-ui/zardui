import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '@zard/components/breadcrumb/breadcrumb.imports';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Sidebar10AppSidebarComponent } from './sidebar-10-app-sidebar.component';
import { Sidebar10NavActionsComponent } from './sidebar-10-nav-actions.component';

@Component({
  selector: 'lib-sidebar-10',
  standalone: true,
  imports: [
    ...ZardSidebarImports,
    ...ZardBreadcrumbImports,
    ZardSeparatorComponent,
    Sidebar10AppSidebarComponent,
    Sidebar10NavActionsComponent,
  ],
  templateUrl: './sidebar-10.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar10Component {}
