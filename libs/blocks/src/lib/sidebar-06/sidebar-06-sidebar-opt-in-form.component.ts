import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

@Component({
  selector: 'lib-sidebar-06-sidebar-opt-in-form',
  standalone: true,
  imports: [...ZardCardImports, ...ZardSidebarImports, ZardButtonComponent, ZardInputComponent],
  templateUrl: './sidebar-06-sidebar-opt-in-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar06SidebarOptInFormComponent {}
