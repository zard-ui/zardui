import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Sidebar13SettingsDialogComponent } from './sidebar-13-settings-dialog.component';

@Component({
  selector: 'lib-sidebar-13',
  standalone: true,
  imports: [Sidebar13SettingsDialogComponent],
  templateUrl: './sidebar-13.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar13Component {}
