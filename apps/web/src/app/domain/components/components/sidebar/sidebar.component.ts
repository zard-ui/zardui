import { ZardButtonComponent } from '@zard/components/button/button.component';
import { SIDEBAR_PATHS } from '@zard/shared/constants/routes.contant';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'z-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent],
})
export class SidebarComponent {
  readonly sidebarPaths = SIDEBAR_PATHS;
}
