import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { SIDEBAR_PATHS } from '@zard/shared/constants/routes.constant';

@Component({
  selector: 'z-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent],
})
export class SidebarComponent {
  readonly sidebarPaths = SIDEBAR_PATHS;
}
