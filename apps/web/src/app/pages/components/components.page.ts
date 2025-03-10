import { Component } from '@angular/core';
import { ZardButtonComponent } from '@zard/components/button';
import { ZardIconDirective } from '@zard/components/icon';

@Component({
  selector: 'app-components',
  imports: [ZardButtonComponent, ZardIconDirective],
  templateUrl: './components.page.html',
  styleUrl: './components.page.scss',
})
export class ComponentsPage {
  visible = false;
}
