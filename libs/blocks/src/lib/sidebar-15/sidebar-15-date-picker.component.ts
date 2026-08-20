import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCalendarComponent } from '@zard/components/calendar/calendar.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

@Component({
  selector: 'lib-sidebar-15-date-picker',
  standalone: true,
  imports: [...ZardSidebarImports, ZardCalendarComponent],
  templateUrl: './sidebar-15-date-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Sidebar15DatePickerComponent {}
