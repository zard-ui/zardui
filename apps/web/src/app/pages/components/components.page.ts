import { ZardButtonComponent } from '@zard/components/button/button.component';
import { Component } from '@angular/core';

@Component({
  selector: 'z-components',
  imports: [ZardButtonComponent],
  templateUrl: './components.page.html',
  styleUrl: './components.page.scss',
})
export class ComponentsPage {
  visible = false;
}
