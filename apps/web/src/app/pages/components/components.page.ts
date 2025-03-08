import { Component } from '@angular/core';
import { ZardInputDirective } from '@zard/components';

@Component({
  selector: 'app-components',
  imports: [ZardInputDirective],
  templateUrl: './components.page.html',
  styleUrl: './components.page.scss',
})
export class ComponentsPage {}
