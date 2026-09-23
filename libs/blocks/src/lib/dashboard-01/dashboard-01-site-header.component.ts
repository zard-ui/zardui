import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

@Component({
  selector: 'lib-dashboard-01-site-header',
  standalone: true,
  imports: [...ZardSidebarImports, ZardSeparatorComponent, ZardButtonComponent],
  templateUrl: './dashboard-01-site-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Dashboard01SiteHeaderComponent {}
