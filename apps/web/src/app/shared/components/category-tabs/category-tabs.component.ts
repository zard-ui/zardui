import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ZardButtonComponent } from '@zard/components/button/button.component';

export interface CategoryTab {
  label: string;
  route: string;
}

@Component({
  selector: 'z-category-tabs',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ZardButtonComponent],
  templateUrl: './category-tabs.component.html',
})
export class CategoryTabsComponent {
  tabs = input.required<CategoryTab[]>();
  browseAllRoute = input<string>();
  browseAllLabel = input<string>('Browse all blocks');
}
