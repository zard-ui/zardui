import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

import { Dashboard01AppSidebarComponent } from './dashboard-01-app-sidebar.component';
import { Dashboard01ChartAreaInteractiveComponent } from './dashboard-01-chart-area-interactive.component';
import { Dashboard01DataTableComponent } from './dashboard-01-data-table.component';
import { Dashboard01SectionCardsComponent } from './dashboard-01-section-cards.component';
import { Dashboard01SiteHeaderComponent } from './dashboard-01-site-header.component';

@Component({
  selector: 'lib-dashboard-01',
  standalone: true,
  imports: [
    ...ZardSidebarImports,
    Dashboard01AppSidebarComponent,
    Dashboard01ChartAreaInteractiveComponent,
    Dashboard01DataTableComponent,
    Dashboard01SectionCardsComponent,
    Dashboard01SiteHeaderComponent,
  ],
  templateUrl: './dashboard-01.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard01Component {}
