import { Component } from '@angular/core';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardIconDirective } from '@zard/components/icon/icon.directive';

@Component({
  selector: 'z-components',
  imports: [ZardButtonComponent, ZardIconDirective],
  templateUrl: './components.page.html',
  styleUrl: './components.page.scss',
})
export class ComponentsPage {
  visible = false;
}
