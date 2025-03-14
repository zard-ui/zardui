import { ZardButtonComponent } from '@zard/components/button/button.component';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent],
})
export class SidebarComponent {
  sidebarOpen = true;
}
