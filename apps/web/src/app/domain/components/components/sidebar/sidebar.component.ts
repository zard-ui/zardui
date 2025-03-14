import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZardButtonComponent } from '@zard/components/button/button.component';

@Component({
  selector: 'z-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent],
})
export class SidebarComponent {
  sidebarOpen = true;
}
